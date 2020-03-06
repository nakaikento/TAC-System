# from elasticsearch_dsl import DocType
from elasticsearch import Elasticsearch
from elasticsearch_dsl.connections import connections
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from pprint import pprint
import numpy as np
import lightgbm as lgb
import pickle
import os


ENDPOINT = "https://search-test-voztd5cpn6mkyv7wnbrdcsfdra.ap-northeast-1.es.amazonaws.com/"
client =  Elasticsearch(ENDPOINT)
connections.create_connection(alias='my_connection', hosts=[ENDPOINT], timeout=60)

# 「報告先」のlightGBMモデル作成時の特徴量
path_to_pickle_file = os.path.join(os.path.dirname(__file__), 'model/pickle/houkokusaki_feature_names.pkl')
with open(path_to_pickle_file, mode='rb') as f:
    houkokusaki_feature_names = pickle.load(f)


text = '「田舎でのんびり暮らしてみたい」と、田舎暮らしに一度は憧れたことがあるのではないでしょうか。近年は、東京一極集中などが問題となっていますが、その一方で田舎暮らしに憧れる若者が増えています。'
body = \
    {
      "doc" : {
        "text" : text
      },
      "term_statistics": True,
      "offsets":False,
      "payloads":False,
      "positions":False
    }
response = client.termvectors(index='2018', body=body)

# 文書数
N = response['term_vectors']['text']['field_statistics']['doc_count']
# 単語とtf-idfのセット
terms = response['term_vectors']['text']['terms']
# tf : terms[key]['term_freq']
# df : terms[key].get('doc_freq')
result = { 'terms_tfidf' : [{'term': key,
            'tf-idf' :  terms[key]['term_freq'] * np.log( N / terms[key].get('doc_freq')) if terms[key].get('doc_freq') else None,
            } for key in terms.keys()]
         }
term2tfidf = { key : terms[key]['term_freq'] * np.log( N / terms[key].get('doc_freq')) \
               if terms[key].get('doc_freq') else 0 for key in terms.keys() }
tfidfs = [value['term'] for value in result['terms_tfidf']]
# return jsonify(houkokusaki_feature_names)
# return jsonify(result)

# tfidf行列の生成
# tfidf_list = []
# for feature in houkokusaki_feature_names:
#     flag = True
#     for j in range(len(tfidfs)):
#         if feature == tfidfs[j]:
#             tfidf_list.append(tfidfs[j])
#             flag=False
#
#     if flag:
#         tfidf_list.append(0)
tfidf_list = np.zeros(len(houkokusaki_feature_names))
for item in tfidfs:
    if item in houkokusaki_feature_names:
        index = houkokusaki_feature_names.index(item)
        tfidf_list[index] = term2tfidf[item]


tfidf_matrix = np.array(tfidf_list).reshape((1,-1))

#     return len(houkokusaki_feature_names)
# モデル読み込み
model_file_path = os.path.join(os.path.dirname(__file__), 'model/lightGBM_houkokusaki_model.txt')
bst = lgb.Booster(model_file=model_file_path)
# 予測
y_pred = bst.predict(tfidf_matrix)
y_ans = y_pred.argsort().flatten()
print(y_ans)
unique = ['畜産物', '農薬', '燃料', '施設', '飼料', '青果物', '資材', '共済', '米・麦・大豆', '肥料', '農機', '信用', 'その他']

pprint([unique[ans] for ans in y_ans])
