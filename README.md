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

3. Install all dependencies
```
sudo pip install -r py_deps.txt
```

4. Register for Instagram Developer. Click on `Manage Clients` and add any other Instagram account as needed.
```
https://www.instagram.com/developer/clients/manage/
```

5. Create a `.env` file at your root with the following values:
```
CLIENT_ID=(your instagram client id)
CLIENT_SECRET=(your instagram client secret id)
REDIRECT_URI=(your instagram redirect url)
MONGODB_CONNECTION_URI=(your mongodb connection url)
SECRET_KEY=(random secret key)
```

## Running the app

Step 1:
```
. env/bin/activate
```

Step 2:
Open a new tab type `mongod` on the terminal.

Step 3:
```
python index.py
```

Step 4:

Go to this URL on your Google Chrome browser:
```
127.0.0.1:5000
```

To create a Collectag:
```
Select 'Add new Collectag' on the index page.
```

To comment:
```
Click on an image, drag and drop your desired Collectag.
````
