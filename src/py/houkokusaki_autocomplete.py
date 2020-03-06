def successive_lightGBM(text):

    import numpy as np
    import re
    import pickle
    from janome.tokenizer import Tokenizer
    from sklearn.feature_extraction.text import TfidfVectorizer
    from collections import Counter
    import lightgbm as lgb

    # with open('../pickle/inverted_file_dic.pkl', mode='rb') as f:
    #     inverted_file_dic = pickle.load(f)
    # # inverted_file_dic のキーを取得する
    # inverted_file_dic_keys = inverted_file_dic.keys()

#     return len(inverted_file_dic_keys)
    with open('pickle/houkokusaki_feature_names.pkl', mode='rb') as f:
        houkokusaki_feature_names = pickle.load(f)
    # idfの計算のためinverted_fileのレコード数を取得する
    N = len(inverted_file_dic.keys())

    def clean_text(text):
        """textをキレイにする
        具体的には、＜＞(とその中身)、【】(とその中身)、\n(改行コード), \u3000(大文字スペース)を消去する。
        """
        return re.sub(r'＜(.+?)＞|【(.+?)】|\n|\u3000|', '', text)

    # Tokenizerインスタンスの生成 (このとき、独自固有名詞辞書 'words_dic.csv' を登録)
    # t = Tokenizer('../csv/words_dic.csv')
    t = Tokenizer()

    def extract_words(text):
        tokens = t.tokenize(text)
        return ' '.join([token.base_form for token in tokens])

    def words_order(text):
        """空白で区切られたstrの文字集合の各文字とその位置を返す関数"""
        # str 以外を受け取った場合、エラーを返す
        if not type(text):
            raise ValueError(f'expected str. got {type(text)}.')

        word_list = text.split()
        return [(word_list[i], i) for i in range(len(word_list))]

    # レコードに対してクリーニング、形態素解析を実行
    text =clean_text(text)
    text = extract_words(text)
    # tf (term frequency) の抽出
    tf_counter =  Counter(text.split())
    # idf (inverse document frequency) 及び tf-idf の抽出
    # word_tfidf = []
    words = []
    tfidfs = []
    for key in tf_counter.keys():
        if key in inverted_file_dic_keys:
            tf = tf_counter[key]
            df = len(inverted_file_dic[key]) + 1
            idf = np.log( N / df)
            tf_idf = tf * idf
    #         word_tfidf.append([key, tf_idf])
            words.append(key)
            tfidfs.append(tf_idf)

    tfidf_list = []
    for feature in houkokusaki_feature_names:
        flag = True
        for j in range(len(words)):
            if feature == words[j]:
                tfidf_list.append(tfidfs[j])
                flag=False

        if flag:
            tfidf_list.append(0)
    tf_idf = np.array(tfidf_list).reshape((1,-1))

#     return len(houkokusaki_feature_names)
    # モデル読み込み
    bst = lgb.Booster(model_file='model/katudo_naiyo.txt')
    # 予測
    y_pred = bst.predict(tf_idf)
    y_ans = y_pred.argsort().flatten()

    unique = ['情報案内', '情報収集', 'クレーム対応', 'その他', '営農相談', '商品提案', '農業経営相談', '新規開拓']
    return [unique[ans] for ans in y_ans]
