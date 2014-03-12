from flask import Flask, render_template
from twittertools import TwitterInterface
from config import CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET

app = Flask(__name__)

@app.route("/")
def index():
  return render_template('index.html')

@app.route("/tweets/<handle_records>")
def get_more_tweets(handle_records):
	interface = TwitterInterface(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
	return 'Hello World!'

if __name__ == "__main__":
  app.run(debug=True)