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
```
python index.py
```

Step 3:

Index page:
```
127.0.0.1:5000
```

To comment:
```
Click on an image, drag and drop if needed.
````
