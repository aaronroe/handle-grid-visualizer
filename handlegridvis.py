from flask import Flask, render_template

import json

from twittertools import TwitterInterface
from config import CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET

app = Flask(__name__)

@app.route("/")
def index():
  return render_template('index.html')

@app.route("/tweets/<handle_records_json>")
def get_more_tweets(handle_records_json):
	# try to parse the records input json
	try:
		handle_records = json.loads(handle_records_json)
	except ValueError:
		return 'Invalid handle records json!'
	
	interface = TwitterInterface(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
	
	return json.dumps(handle_records)

if __name__ == "__main__":
  app.run(debug=True)