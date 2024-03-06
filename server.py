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
players = []
class Player:
    def __init__(self, name, score=0) -> None:
        self.name = name
        self.score = score
        self.choice = None
        self.fooled = []
    
    def __lt__(self, __value: object) -> bool:
        return self.score > __value.score
    
    def __str__(self) -> str:
        return f"Player: {self.name} with {self.score} points"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/language_selector', methods=['GET', 'POST'])
def handle_request():
    data = request.get_json()
    selected_flag = data.get('flag')
    language = 'spanish' if selected_flag == 'spanish' else 'russian'
    pronuanciation = 'spanish_pronunciation' if selected_flag == 'spanish' else 'russian_pronuanciation'
    response_data = {'message': 'Request received successfully'}
    return jsonify(response_data)

@app.route('/wait', methods=['GET', 'POST'])
def wait():
    global num_players
    num_players += 1
    return render_template('wait.html')

@socketio.on('submit_name')
def submit_name(data):
    text_data = data.get('text', '')
    for i in range(10):
        print('Text received from client:', text_data)
    player = Player(text_data)
    players.append(player)
    print(players)
    

@socketio.on('start_game')
def start_game():
    socketio.emit('redirect', {'url': '/game_env'}, room=None)

@app.route('/game_env')
def game_env():
    return render_template('game_env.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
