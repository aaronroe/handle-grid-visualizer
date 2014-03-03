import tweepy

# Consumer key and secret, and access token & secret.
consumer_key=""
consumer_secret=""
access_token=""
access_token_secret=""

# Auth using the credentials.
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

# Check to see if we can get a user's timeline.
print len(api.user_timeline('LOLDyrus'))