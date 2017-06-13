import sys
import requests, json

# Get access_token from file
with open ("./access_token.txt", "r") as keyfile:
    access_token=keyfile.readlines()
    access_token = ''.join(access_token)

# Uses userid as an argument
# e.g. ig_getCalls.py 145902177
# userid = sys.argv[1]    #145902177 = shelleypham
userid = '145902177' #take this out after testing
url= 'https://api.instagram.com/v1/users/{0}/media/recent/?access_token={1}'.format(userid, access_token)

response = requests.get(url)
data = json.loads(response.text)

# Prints status response if not OK
if response.status_code != 200:
    print(response)
else:
    # Get recent photo
    img_mostRecent = (data['data'][0]['images']['standard_resolution']['url'])
    print(json.dumps(img_mostRecent))

    # Get recent 5 images
    img_recentList = []
    for i in range(0,4):
        img_recentList.append((data['data'][i]['images']['standard_resolution']['url']))
    print(img_recentList)

    # Get recent media id
    media_mostRecent = (data['data'][0]['id'])

    # API for comments
    # https://api.instagram.com/v1/media/{media-id}/comments?access_token=ACCESS-TOKEN

    # Get recent 5 media id
    media_recentList = []
    for i in range(0,5):
        media_recentList.append((data['data'][i]['id']))
    print(media_recentList)

    # Get recent photo's comments
    comments_url = 'https://api.instagram.com/v1/media/{0}/comments?access_token={1}'.format(media_mostRecent, access_token)

    comments_response = requests.get(comments_url)
    comments_data = json.loads(comments_response.text)
    print(json.dumps(comments_data))

    if response.status_code != 200:
        print(response)
    else:
        # TODO: get all comments
        comments_recentList = []
        #for i in range(0, 10):
        #    comments_recentList.append()
