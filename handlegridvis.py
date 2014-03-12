from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
  return render_template('index.html')

@app.route("/tweets/<handle_records>")
def get_more_tweets(handle_records):
	return 'Hello World!'

if __name__ == "__main__":
  app.run(debug=True)