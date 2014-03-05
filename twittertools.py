import tweepy

class TwitterTimeline:
	"""Class that represents the Twitter timeline of a user."""
	def __init__(self, api, user_id):
		self.timeline = api.user_timeline(user_id)
		self.last_id = self.timeline.max_id

class TwitterAccessor:
	"""Class that provides clean access to Twitter data"""
	def __init__(self, consumer_key, consumer_secret, access_token, access_token_secret):
		# Auth using the credentials.
		auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
		auth.set_access_token(access_token, access_token_secret)

		# Set class instance for API access.
		self.api = tweepy.API(auth)

	def testAPI(self):
		timeline = TwitterTimeline(self.api, 'LoLDyrus')
		print timeline.last_id