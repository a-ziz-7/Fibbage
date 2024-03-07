import uuid
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import json
import random

app = Flask(__name__)
socketio = SocketIO(app)

json_data = open('my_sentences.json','r')

sentences_data = json.load(json_data)
sentences = sentences_data['sentences']
len_sentences = len(sentences_data['sentences'])

languages = ["english", "",""]


num_players = 0
players = []
active_players = []

appeared = set()

answered = []
answered_num = 0


class Player:
    def __init__(self, name, sid, score=0) -> None:
        self.name = name
        self.sid = sid
        self.score = score
        self.guess = None
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
    languages[1] = 'spanish' if selected_flag == 'spanish' else 'russian'
    languages[2] = 'spanish_pronunciation' if selected_flag == 'spanish' else 'russian_pronunciation'
    return ""

@app.route('/env', methods=['GET', 'POST'])
def env():
    return render_template('wait.html')
    
    
@socketio.on('submit_name')
def submit_name(data):
    text_data = data.get('text', '')
    player_sid = request.sid
    if player_sid not in active_players:
        active_players.append(player_sid)
        player = Player(text_data, player_sid)
        players.append(player)
        print('CREATED')
    else:
        players[active_players.index(player_sid)].name = text_data
    print(players[active_players.index(player_sid)].name)
    print(players)
    
@socketio.on('update_question')
def update_question():
    ran_num = random.randint(0, len_sentences-1)
    while ran_num in appeared:
        ran_num = random.randint(0, len_sentences-1)
    appeared.add(ran_num)
    question_data = f"{sentences[ran_num][languages[1]]}|{sentences[ran_num][languages[2]].lower()}"
    print(f"{question_data}")
    socketio.emit('update_question', {'question': question_data}, room=None)
 
@socketio.on('start_game')
def start_game():
    socketio.emit('redirect', {'url': '/game_env'}, room=None)

@socketio.on('submit_a')
def submit_a(data):
    global answered
    answer = data.get('answer', '')
    player_sid = request.sid
    if player_sid not in answered:
        answered.append(player_sid)

    socketio.emit('show_results')

    

@app.route('/game_env')
def game_env():
    return render_template('game_env.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
