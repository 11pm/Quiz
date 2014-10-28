from flask import Flask, request, render_template 
from flaskext.mysql import MySql

mysql = MySql()
app = Flask(__name__)

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'QUIZ'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

@app.route('/quiz', methods=['GET'])
def quiz():
	return jsonify(
		response='Ayy lmao'
	)

if __name__ == '__main__':
	app.run(debug=True)