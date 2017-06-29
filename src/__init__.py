import os
import time
import requests
import json
import pymongo
from instagram.client import InstagramAPI
from flask import Flask, request, render_template, session, redirect, abort, flash, jsonify
from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient
from bson import Binary, Code
from bson.json_util import dumps

# load .env variables
load_dotenv(find_dotenv())

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')


permissionsArray = ['likes', 'comments', 'public_content'];


# connect to mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.connectTag

# configure Instagram API
instaConfig = {
	'client_id':os.environ.get('CLIENT_ID'),
	'client_secret':os.environ.get('CLIENT_SECRET'),
	'redirect_uri' : os.environ.get('REDIRECT_URI')
}

api = InstagramAPI(**instaConfig)

# instagram api endpoints
def getAccessToken(instaConfig, code,):
    url = u'https://api.instagram.com/oauth/access_token'
    data = {
        u'client_id': instaConfig['client_id'],
        u'client_secret': instaConfig['client_secret'],
        u'code': code,
        u'grant_type': u'authorization_code',
        u'redirect_uri': instaConfig['redirect_uri']
    }

    response = requests.post(url, data=data)

    account_data = json.loads(response.content)

    return account_data

# get user media from instagram
def getUserMedia(accessToken):
    url = u'https://api.instagram.com/v1/users/self/media/recent?access_token=' + accessToken

    response = requests.get(url)

    selfMedia = json.loads(response.content)

    return selfMedia

def addComment(accessToken, mediaId, comment):
    url = u'https://api.instagram.com/v1/media/' + mediaId + '/comments'

    requests.post(url, data=(('access_token', accessToken), (('text', comment))))

    return "200"

# routes user to either the homepage or generates the login page
@app.route('/')
def index():
	if 'instagramAccessToken' in session and 'user' in session:
		response = getUserMedia(session['instagramAccessToken'])

		return render_template('content/gallery.html', user=session['user'], **response)
	else:
		return render_template('content/index.html')

# Redirect users to Instagram for login
@app.route('/connect')
def main():
	url = api.get_authorize_url(scope=permissionsArray)
	return redirect(url)

# Instagram will redirect users back to this route after successfully logging in
@app.route('/callback')
def instagram_callback():
	code = request.args.get('code')
	if code:
		accountData = getAccessToken(instaConfig, code)

		if not accountData:
			return redirect('/')

		# Sessions are used to keep this data
		session['instagramAccessToken'] = accountData['access_token']
		session['user'] = accountData['user']

		exists = db.collectags.find_one({"id": session['user']['id']})
		# save to mongodb
		if not exists:
			db.users.insert_one({
				'username': session['user']['username'], 'id':session['user']['id'],
				'profile_picture':session['user']['profile_picture']
			});

		return redirect('/') # redirect back to main page

	else:
		return redirect('/')

@app.route('/comment')
def comment():
	if 'instagramAccessToken' in session and 'user' in session:
		id = request.args.get('id')
		src = request.args.get('src')

		return render_template('content/comment.html', user=session['user'], src=src, id=id)
	else:
		return render_template('content/index.html')

def getCollectTags():
	return list(db.collectags.find({"user_id": session['user']['id']}))

def getCollectTag(tagName):
	return db.collectags.find_one({"name": tagName})

def newCollectTag(tagName, tagList):
	exists = db.collectags.find_one({"name": tagName})

	if(exists):
		return 'Already exists'
	else:
		db.collectags.insert_one({ 'name': tagName, 'tagList': tagList, 'user_id':session['user']['id']});

		return db.collectags.find_one({"name": tagName})


def updateCollectTag(tagName, tagList):
	return db.collectags.find_one_and_update(
     	{'name': tagName},
     	{'$set': {'tagList': tagList}});


# save collectag
@app.route('/collectag', methods=['GET', 'POST'])
def collectTagRoute():
	if 'instagramAccessToken' in session and 'user' in session:
		if request.method == 'POST':
	        # new collectag
			tagName = request.form.get('tagName');
			tagList = request.form.get('tagList');
			return dumps({'data':newCollectTag(tagName, tagList)})
	    	else:
	        # get all collectag
			return dumps({'data':getCollectTags()})
	else:
		return redirect('404')


@app.route('/addComment', methods=['POST'])
def addCommentRoute():
	if 'instagramAccessToken' in session and 'user' in session:
		comment = request.form.get('comment');
		mediaId = request.form.get('mediaId');
		return addComment(session['instagramAccessToken'], mediaId, comment)
	else:
		return "404"

@app.route('/collectag/one', methods=['GET', 'POST'])
def collectTagSingle(name=None):
	if 'instagramAccessToken' in session and 'user' in session:
		if request.method == 'POST':
			tagName = request.form.get('tagName');
			tagList = request.form.get('tagList');
			return dumps({'data':updateCollectTag(tagName, tagList)})
	    	else:
	        # get all collectag
			tagName = request.body.get('tagName');
			return dumps({'data':getCollectTag(tagName)})
	else:
		return redirect('404')



#hello
if __name__ == "__main__":
    app.run()
