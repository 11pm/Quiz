from flask import Flask, request, render_template, jsonify
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/QUIZ'

DB = SQLAlchemy(app)

# class Categories(db.Model):


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
	return 'Hello world'

if __name__ == '__main__':
	app.run(debug=True)