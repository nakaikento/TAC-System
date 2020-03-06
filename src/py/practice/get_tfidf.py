# from elasticsearch_dsl import DocType
from elasticsearch import Elasticsearch
from elasticsearch_dsl.connections import connections
from pprint import pprint
ENDPOINT = "https://search-test-voztd5cpn6mkyv7wnbrdcsfdra.ap-northeast-1.es.amazonaws.com/"
client =  Elasticsearch(ENDPOINT)
connections.create_connection(alias='my_connection', hosts=[ENDPOINT], timeout=60)

body = \
    {
      "doc" : {
        "text" : "「田舎でのんびり暮らしてみたい」と、田舎暮らしに一度は憧れたことがあるのではないでしょうか。近年は、東京一極集中などが問題となっていますが、その一方で田舎暮らしに憧れる若者が増えています。"
      },
      "term_statistics": True,
      "offsets":False,
      "payloads":False,
      "positions":False
    }

TV = client.termvectors(index='2018',
                         body=body)
pprint(TV)
