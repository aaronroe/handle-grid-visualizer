import tweepy

class TwitterTimeline:
	"""Class that represents the Twitter timeline of a user."""
	def __init__(self, consumer_key, consumer_secret, access_token, access_token_secret):
		# Auth using the credentials.
		auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
		auth.set_access_token(access_token, access_token_secret)

		# Set instance of API.
		self.api = tweepy.API(auth)

	def testAPI(self):
		print len(self.api.user_timeline('LOLDyrus'))