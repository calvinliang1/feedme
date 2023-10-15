import pymongo
from decouple import config

try:
    client = pymongo.MongoClient(config('MONGODB'))
    database = client['FeedMe']
except Exception as err:
    print(err)
    client = None
