from pymongo import MongoClient

try:
    conn = MongoClient()
    print("Connected successfully!!!")
except:
    print("Could not connect to MongoDB")

db = conn.calypso
collection = db.calypso_user
for i in collection.find({'username':'shivam'}):
    print("username",i["firstname"])

