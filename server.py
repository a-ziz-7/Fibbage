from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import json
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

json_data = open('my_sentences.json','r')

sentences_data = json.load(json_data)
sentences = sentences_data['sentences']
len_sentences = len(sentences_data['sentences'])
languages = ["english", "spanish","spanish_pronunciation"]

players = []
active_players = []

appeared = set()

answered = []
answered_num = 0

pool = []
map_pool = {}

answered_box = []

correct_answer = []
cr_an = ''

player_end = []

class Player:
    def __init__(self, name, sid, score=0) -> None:
        self.name = name
        self.sid = sid
        self.score = score
        self.guess = None
        # self.choice = None
        self.fooled = []
    
    def __lt__(self, __value: object) -> bool:
        return self.score > __value.score
    
    def __str__(self) -> str:
        return f"Player: {self.name} with {self.score} points ({', '.join(self.fooled)})"

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
    # Emit a message to all connected clients when /env is accessed
    socketio.emit('render_env_html', {'html': render_template('wait.html')}, room=None)
    return render_template('wait.html')
        
@socketio.on('submit_name')
def submit_name(data):
    text_data = data.get('text', '')
    player_sid = request.sid
    if player_sid not in active_players:
        active_players.append(player_sid)
        player = Player(text_data, player_sid)
        players.append(player)
        print(f'{text_data} <--> CREATED')
        print(players,'\n')
    else:
        if players[active_players.index(player_sid)].name != text_data:
            print(f'{players[active_players.index(player_sid)].name} renamed to --> {text_data}')
            players[active_players.index(player_sid)].name = text_data
    
@socketio.on('update_question')
def update_question():
    global pool, cr_an
    ran_num = random.randint(0, len_sentences-1)
    while ran_num in appeared:
        ran_num = random.randint(0, len_sentences-1)
    appeared.add(ran_num)
    question_data = f"{sentences[ran_num][languages[1]]}|{sentences[ran_num][languages[2]].lower()}"
    pool = [sentences[ran_num][languages[0]]]
    cr_an = sentences[ran_num][languages[0]]
    print(f"The question generated:\n{sentences[ran_num][languages[1]]}\n\n")
    socketio.emit('update_question', {'question': question_data}, room=None)
 
@socketio.on('start_game')
def start_game():
    socketio.emit('redirect', {'url': '/game_env'}, room=None)

@socketio.on('submit_a')
def submit_a(data):
    global answered, pool, map_pool
    answer = data.get('answer', '')
    player_sid = request.sid
    if player_sid not in answered:
        answered.append(player_sid)
        temp_player = get_player(player_sid)
        temp_player.guess = answer
        if len(answered) == len(active_players):
            for i in players:
                pool.append(i.guess)
            map_pool = shuffle(pool)
            correct_pool = "|".join(pool)
            print(f'The pool: {pool}')
            socketio.emit('show_results', {'pool':correct_pool})
    
@socketio.on('box_selected')
def box_selected(responce):
    # print(responce)
    pass

@socketio.on('answer_submited')
def answer_submited(responce):
    global answered_box, cr_an
    if int(responce['ans']) == -1:
        return
    player_sid = request.sid
    if player_sid not in answered_box:
        answered_box.append(player_sid)
        ind_ans = active_players.index(player_sid)
        choice = map_pool[int(responce['ans'])-1]
        mp = players[ind_ans]
        if choice == 0:
            mp.score += 2
            correct_answer.append(mp.name)
        elif (choice-1) == ind_ans:
            pass
        else:
            players[choice-1].fooled.append(mp.name)
            players[choice-1].score += 1
        if len(answered_box) == len(active_players):
            x = f'0*{cr_an}*{", ".join(correct_answer)}|'
            x += chopchopselection()
            socketio.emit('show_answers', {'answers':x})
            print_mp()

@socketio.on('disconnect')
def handle_disconnect():
    player_sid = request.sid
    if player_sid in active_players:
        active_players.remove(player_sid)
        player = get_player(player_sid)
        if player:
            players.remove(player)
            print(f"Player {player.name} disconnected.")
    print(players)

@app.route('/game_env')
def game_env():
    return render_template('game_env.html')

@socketio.on('new_new')
def new_new():
    global answered, pool, answered_box, correct_answer
    answered = []
    pool = []
    answered_box = []
    clear()
    correct_answer = []
    socketio.emit('new_round')

@socketio.on('end_game')
def end_game():
    global player_end
    player_sid = request.sid
    if player_sid not in player_end:
        player_end.append(player_sid)
        if len(active_players) == len(player_end):
            final_results = ''
            players.sort()
            for i in players:
                final_results += f'{i.name}*{i.score}|'
            socketio.emit('end_game', {'scores':final_results[:-1]})

def get_player(sid):
    global players
    for i in players:
        if i.sid == sid:
            return i

def shuffle(x):
    d = {}
    for i in range(len(x)):
        d[i] = i
    for i in range(1000):
        p1, p2 = random.randint(0,len(x)-1),random.randint(0,len(x)-1)
        x[p1], x[p2] = x[p2], x[p1]
        s = d[p1]
        d[p1] = d[p2]
        d[p2] = s
    return d

def print_mp():
    global players
    print('\nPlayer Scores:')
    for i in players:
        print(i)
    print('-------------------------\nNEW ROUND!!!\n')

def chopchopselection():
    global players
    # player name, player guess, player fooled
    ans = ""
    for i in players:
        ans += i.name+"*"+i.guess+"*"+", ".join(i.fooled)+"*"+str(i.score)+"|"
    ans = ans[:-1]
    return ans

def clear():
    global players
    for i in players:
        i.guess = None
        # i.choice = None
        i.fooled = []

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')