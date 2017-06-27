from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('gallery.html')

@app.route('/add-comment')
def comment():
	return render_template('singleImage.html')

@app.route('/gallery')
def gallery():
	return render_template('gallery.html')
