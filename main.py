from flask import Flask, redirect
from scraper import getSignatureCount
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime

cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)
db = firestore.client()

DATE_FORMAT = "%m/%d/%Y %H:%M:%S"

@app.route('/')
def hello():
  return redirect('/static/index.html')

"""
Called by the cron job, scrapes the petition page and records the latest value in the database
"""
@app.route('/recordSignatureCount')
def recordSignatureCount():
  petitionUrl = "https://www.change.org/p/st%C3%A9phane-richard-pause-sur-la-5g-soutenez-le-proc%C3%A8s-contre-les-4-op%C3%A9rateurs-pour-un-d%C3%A9bat-public-%C3%A9clair%C3%A9"
  value = getSignatureCount(petitionUrl)
  now = datetime.datetime.utcnow().strftime("%m/%d/%Y %H:%M:%S")

  doc_ref = db.collection(u'trackers').document('5gPetition').update({now: value})
  return 'ok'

if __name__ == '__main__':
  app.run(host='127.0.0.1', port=8080, debug=True)