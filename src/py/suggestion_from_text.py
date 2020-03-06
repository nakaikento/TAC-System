
from elasticsearch import Elasticsearch
from elasticsearch_dsl.connections import connections
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from pprint import pprint
import numpy as np
import lightgbm as lgb
import pickle
import os
import urllib.parse as parse

app = Flask(__name__)
CORS(app)

# Elasticsearchとの接続
# 文字化け防止
app.config['JSON_AS_ASCII'] = False
ENDPOINT = "https://search-test-voztd5cpn6mkyv7wnbrdcsfdra.ap-northeast-1.es.amazonaws.com/"
client =  Elasticsearch(ENDPOINT)
connections.create_connection(alias='my_connection', hosts=[ENDPOINT], timeout=60)

# 「報告先」のlightGBMモデル作成時の特徴量
path_to_pickle_file = os.path.join(os.path.dirname(__file__), 'model/pickle/houkokusaki_feature_names.pkl')
with open(path_to_pickle_file, mode='rb') as f:
    houkokusaki_feature_names = pickle.load(f)

@app.route("/query/")
def index():
    # URLのqueryからtextを取得
    raw_text = request.args.get("text")
    text = parse.unquote(raw_text)
    print(text)
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
                'tf' : terms[key]['term_freq'],
                'df' : terms[key].get('doc_freq'),
                'tf-idf' :  terms[key]['term_freq'] * np.log( N / terms[key].get('doc_freq')) if terms[key].get('doc_freq') else None,
                } for key in terms.keys()]
             }
    term2tfidf = { key : terms[key]['term_freq'] * np.log( N / terms[key].get('doc_freq')) \
                   if terms[key].get('doc_freq') else 0 for key in terms.keys() }
    tfidfs = [value['term'] for value in result['terms_tfidf']]
    # pprint(result)
    def get_category_top3(tfidfs, feature_names, model_path):


        def tfidf_matrix_generator(tfidfs, feature_names):
            tfidf_list = np.zeros(len(feature_names))
            for item in tfidfs:
                if item in feature_names:
                    index = feature_names.index(item)
                    tfidf_list[index] = term2tfidf[item]

            tfidf_matrix = np.array(tfidf_list).reshape((1,-1))
            return tfidf_matrix

        tfidf_matrix = tfidf_matrix_generator(tfidfs, houkokusaki_feature_names)

        # モデル読み込み
        bst = lgb.Booster(model_file=model_path)
        # 予測
        y_pred = bst.predict(tfidf_matrix)
        y_ans = y_pred.argsort().flatten()
        unique = ['畜産物', '農薬', '燃料', '施設', '飼料', '青果物', '資材', '共済', '米・麦・大豆', '肥料', '農機', '信用', 'その他']
        top3 = [unique[ans] for ans in y_ans][:3]
        res = [{ 'key' : i, 'label' : top3[i] } for i in range(len(top3))]

        return res

    # 報告先
    houkokusaki_model_file_path = os.path.join(os.path.dirname(__file__), 'model/lightGBM_houkokusaki_model.txt')
    houkokusaki_res = get_category_top3(tfidfs, houkokusaki_feature_names, houkokusaki_model_file_path)

    # 活動内容
    # houkokusaki_model_file_path = os.path.join(os.path.dirname(__file__), 'model/lightGBM_houkokusaki_model.txt')
    # houkokusaki_res = get_category_top3(tfidfs, houkokusaki_feature_names, houkokusaki_model_file_path)

    return jsonify(houkokusaki_res)


if __name__ == "__main__":
    app.run(debug=True, port=5050)
