import tweepy
import time

class TwitterTimeline:
	"""Class that represents the Twitter timeline of a user. Does not contain retweets"""
	def __init__(self, api, user_id, num_tweets, max_id='999999999999999999'):
		self.timeline = api.user_timeline(user_id, max_id=max_id)

		# strip the timeline of retweeted tweets.
		for tweet in self.timeline:
			if hasattr(tweet, 'retweeted_status'):
				self.timeline.remove(tweet)

	def get_tweets():
		return self.timeline

class TwitterInterface:
	"""Class that provides clean access to Twitter data"""
	def __init__(self, consumer_key, consumer_secret, access_token, access_token_secret):
		# Auth using the credentials.
		auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
		auth.set_access_token(access_token, access_token_secret)

		# Set class instance for API access.
		self.api = tweepy.API(auth)

	def get_recent_tweets(self, handle_records, num_tweets):
		"""
			Takes in a list of two-element lists [handle_name, max_id], and the number of tweets (max 200) to return.

			Returns a two-element list where the first element are updated handle_records, and the second is the list of tweets
		"""
		all_tweets = __get_all_tweets(self.api, handle_records, num_tweets)

		# get the top num_tweets tweets
		most_recent_tweets = all_tweets[:num_tweets]

		# update handle records
		for tweet in most_recent_tweets:
			for handle_record in handle_records:
				if tweet.user.screen_name == handle_record[0]:
					handle_record[1] = tweet.id_str

		return handle_records, most_recent_tweets

	def __get_all_tweets(api, handle_records, num_tweets):
		"""
			Takes in an api object, the handle records, and the number of tweets to get from each handle.
		"""
		# create a list of all the tweets from the handle_records
		for handle_record in handles_records:
			# extract the handle name and the max id from the two-element list.
			handle_name = handle_record[0]
			max_id = handle_record[1]

			# check if max_id is empty string, if it is then use default max_id
			if not max_id:
				timeline = TwitterTimeline(self.api, handle_name, num_tweets)
			else:
				timeline = TwitterTimeline(self.api, handle_name, num_tweets, max_id)

			# Adds the tweets from the timeline to the list of all tweets.
			all_tweets.extend(timeline)

		# sort the list of all tweets by date in descending order
		all_tweets.sort(key=lambda tweet: __twittertime_to_unixtime(tweet.created_at), reverse=True)

	def __twittertime_to_unixtime(twittertime):
		"""Converts Twitter time from created_at to a unix timestamp"""
		return time.mktime(time.strptime(twittertime,'%a %b %d %H:%M:%S +0000 %Y'))