import tweepy
import time
import calendar

class TwitterTimeline:
	"""Class that represents the Twitter timeline of a user. Does not contain retweets"""
	def __init__(self, api, user_id, num_tweets, max_id='999999999999999999'):
		# make sure that we dont repeat a tweet.
		max_id = str(int(max_id) - 1)

		self.timeline = api.user_timeline(user_id, max_id=max_id)

		# strip the timeline of retweeted tweets.
		tweetsToRemove = []

		# find all the tweets to be removed from the full list.
		for tweet in self.timeline:
			if hasattr(tweet, 'retweeted_status'):
				tweetsToRemove.append(tweet)

		# remove all the retweets.
		for tweetToRemove in tweetsToRemove:
			self.timeline.remove(tweetToRemove)

	def get_tweets(self):
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
			Takes in a list of handle records {'name':, 'max_id':}, and the number of tweets (max 200) to return.

			Returns a dict with updated handle_records and list of tweets {'handle_records':, 'tweets':}
		"""
		all_tweets = self.__get_all_tweets(self.api, handle_records, num_tweets)

		# get the top num_tweets tweets
		most_recent_tweets = all_tweets[:num_tweets]

		# update handle records
		for tweet in most_recent_tweets:
			for handle_record in handle_records:
				if tweet.user.screen_name == handle_record['name']:
					handle_record['max_id'] = tweet.id_str

		return handle_records, self.__statuses_to_dicts(most_recent_tweets)

	def __statuses_to_dicts(self, statuses):
		"""Takes in a list of Tweepy statuses and returns a list of standard python dicts"""
		dicts = []

		for status in statuses:
			status_dict = {}
			
			# choice attributes from list at https://dev.twitter.com/docs/platform-objects
			status_dict['text'] = status.text
			status_dict['created_at'] = self.__twittertime_to_unixtime(status.created_at)
			status_dict['id_str'] = status.id_str
			status_dict['retweeted'] = status.retweeted
			status_dict['retweet_count'] = status.retweet_count
			status_dict['source'] = status.source
			# todo: make the user object a normal python dict as well.
			status_dict['user'] = self.__user_to_dict(status.user)

			dicts.append(status_dict)

		return dicts

	def __user_to_dict(self, user):
		"""Takes in a Tweepy user and returns a standard python dict"""
		user_dict = {}

		# choice attributes from list at https://dev.twitter.com/docs/platform-objects
		user_dict['screen_name'] = user.screen_name
		user_dict['name'] = user.name

		return user_dict

	def __get_all_tweets(self, api, handle_records, num_tweets):
		"""
			Takes in an api object, the handle records, and the number of tweets to get from each handle.
		"""
		all_tweets = []

		# create a list of all the tweets from the handle_records
		for handle_record in handle_records:
			# check if max_id is empty string, if it is then use default max_id
			if not handle_record['max_id']:
				timeline = TwitterTimeline(self.api, handle_record['name'], num_tweets)
			else:
				timeline = TwitterTimeline(self.api, handle_record['name'], num_tweets, handle_record['max_id'])

			# Adds the tweets from the timeline to the list of all tweets.
			all_tweets.extend(timeline.get_tweets())

		# sort the list of all tweets by date in descending order
		all_tweets.sort(key=lambda tweet: self.__twittertime_to_unixtime(tweet.created_at), reverse=True)

		return all_tweets

	def __twittertime_to_unixtime(self, twittertime):
		"""Converts Twitter time from created_at to a unix timestamp"""
		return calendar.timegm(twittertime.utctimetuple())