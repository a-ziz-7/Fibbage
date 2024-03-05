from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import json

app = Flask(__name__)
socketio = SocketIO(app)

sentences = open('my_sentences.json','r')

sentences_data = json.load(sentences)
len_sentences = len(sentences_data['sentences'])

correct = "english"
language = ""
pronuanciation = ""

num_players = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/language_selector', methods=['GET', 'POST'])
def handle_request():
    data = request.get_json()
    selected_flag = data.get('flag')
    print(selected_flag)
    if selected_flag == 'russian':
        language = 'russian'
        pronuanciation = 'russian_pronunciation'
    elif selected_flag == 'spanish':
        language = 'spanish'
        pronuanciation = 'spanish_pronunciation'
    print(language, pronuanciation)
    print(sentences_data['sentences'][0][language])
    print(sentences_data['sentences'][0][pronuanciation])

    response_data = {'message': 'Request received successfully'}
    return jsonify(response_data)

@app.route('/wait', methods=['GET', 'POST'])
def wait():
    global num_players
    num_players += 1
    print('Render wait.html:  ' + str(num_players))
    return render_template('wait.html')

@socketio.on('start_game')
def start_game():
    for i in range(10):
        print('Start button pressed')
    socketio.emit('redirect', {'url': '/'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
