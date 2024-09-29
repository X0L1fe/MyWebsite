import os
from flask import Flask, redirect, render_template, session, url_for
from werkzeug.exceptions import HTTPException

SECRET_KEY = os.urandom(32)  # Сгенерируем случайный ключ с длиной 32 байта

app = Flask(__name__)

app.secret_key = SECRET_KEY

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

@app.route('/technology')
def technology():
    return render_template('technology.html')

@app.route('/not-found/first-game')# Змейка
def first_game():
    if 'visited_404' in session and session['visited_404']:
        session['visited_404'] = False
        return render_template('mini-games-first.html')
    else:
        return page_not_found(404)

@app.errorhandler(404)
def page_not_found(e):
    session['visited_404'] = True
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)