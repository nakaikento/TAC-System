# -*- coding: utf-8 -*-
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Index, Mapping
from elasticsearch_dsl import connections
import json
from pprint import pprint
ENDPOINT = "https://search-test-voztd5cpn6mkyv7wnbrdcsfdra.ap-northeast-1.es.amazonaws.com/"
client =  Elasticsearch(ENDPOINT)
connections.create_connection(alias='my_connection', hosts=[ENDPOINT], timeout=60)

data_2019 = Index('2019')
pprint(data_2019.get_mapping(using=client))
