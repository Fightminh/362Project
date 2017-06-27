# 362Project
Project for 362

## Prerequisite
1. Download pip
Instructions:
```
https://pip.pypa.io/en/stable/installing/
```

2. Download virtualenv
```
sudo pip install virtualenv
```

3. Download Flask
```
sudo pip install Flask
```

4. Download MongoDB (not needed as of now, since Shelley hasn't integrated it yet)
```
https://docs.mongodb.com/getting-started/shell/installation/
```

## Running the app

Step 1:
```
. venv/bin/activate
```

Step 2:
```
export FLASK_APP=server.py
```

Step 3:
```
flask run
```

Step 4:

Index page:
```
127.0.0.1:5000
```

To comment:
```
127.0.0.1:5000/add-comment
````
Remember to click the 4th photo only.


## TODO:
* Integrate Instagram API calls
* Integrate MongoDB
* Integrate Drag and Drop functionality
