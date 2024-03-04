from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import json
import random
import copy
import os

app = Flask(__name__)
socketio = SocketIO(app)

# Load sentences from JSON file
with open('my_sentences.json', 'r') as sentences_file:
    sentences_data = json.load(sentences_file)

class Player:
    def __init__(self, sid, name, score=0):
        self.sid = sid
        self.name = name
        self.score = score
        self.choice = None
        self.guess = None
        self.fooled = []

players = []

def clear():
    for player in players:
        player.fooled = []

def shuffle():
    d = {}
    for i in range(len(players)):
        d[i] = i
    for i in range(1000):
        p1, p2 = random.randint(0, len(players)-1), random.randint(0, len(players)-1)
        players[p1], players[p2] = players[p2], players[p1]
        s = d[p1]
        d[p1] = d[p2]
        d[p2] = s
    return d

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

def game_loop():
    global players
    turn = 1
    appeared = set()
    num_players = len(players)
    num_turns = 2  # You can change the number of turns as needed

    while turn < num_turns + 1:
        turn += 1
        pool = []
        ran_num = random.randint(0, len(sentences_data['sentences'])-1)
        while ran_num in appeared:
            ran_num = random.randint(0, len(sentences_data['sentences'])-1)
        appeared.add(ran_num)
        entity = sentences_data['sentences'][ran_num]
        pool.append(entity['english'])

        for i in range(num_players):
            sentence_data = {
                'spanish': entity['spanish'],
                'spanish_pronunciation': entity['spanish_pronunciation']
            }
            emit('game_update', {'player': players[i].name, 'sentence': sentence_data}, room=players[i].sid)

        for i in range(1, num_players):
            socketio.emit('submit_guess', {'player': players[i].name}, room=players[i].sid)

        socketio.sleep(30)  # Wait for 30 seconds for players to submit guesses

        ordered_pool = copy.copy(pool)
        ds = shuffle()
        
        for i in range(1, num_players):
            choices = [f'{j+1}) {pool[j]}' for j in range(len(pool))]
            socketio.emit('select_answer', {'player': players[i].name, 'choices': choices}, room=players[i].sid)

        socketio.sleep(30)  # Wait for 30 seconds for players to select answers

        for i in range(1, num_players):
            choice = players[i].choice
            if ds[choice-1] == 0:
                players[0].fooled.append(players[i])
                players[i].score += 2
            elif ds[choice-1] == i:
                pass
            elif choice > 0 and choice <= num_players+1:
                players[ds[choice-1]].score += 1
                players[ds[choice-1]].fooled.append(players[i])
            else:
                pass

        emit('reveal_answer', {'sentence': entity['spanish'], 'english': entity['english']}, room=players[0].sid)

        for i in range(1, num_players):
            if len(players[i].fooled) != 0:
                fooled_info = {
                    'guessed': ordered_pool[i],
                    'fooled_players': [fooled.name for fooled in players[i].fooled]
                }
                emit('reveal_guess', {'player': players[i].name, 'fooled_info': fooled_info}, room=players[i].sid)

        if len(players[0].fooled) == 0:
            no_one_info = {'english': entity['english']}
            emit('no_one_right_answer', no_one_info, room=players[0].sid)
        else:
            right_answer_info = {
                'english': entity['english'],
                'fooled_players': [fooled.name for fooled in players[0].fooled]
            }
            emit('reveal_right_answer', right_answer_info, room=players[0].sid)

        if (turn-1) != num_turns:
            for i in range(1, num_players):
                player_info = {
                    'name': players[i].name,
                    'score': players[i].score
                }
                emit('show_score', {'player': player_info}, room=players[i].sid)
        else:
            for i in range(1, num_players):
                emit('final_scores', {'player': players[i].name, 'score': players[i].score}, room=players[i].sid)

        socketio.sleep(10)  # Wait for 10 seconds before the next turn
        clear()

@socketio.on('connect')
def handle_connect():
    global players
    print('Client connected_________________________')
    player_sid = request.sid
    player_name = input("Enter your nickname: ")
    player = Player(player_sid, player_name)
    players.append(player)

    if len(players) > 2:
        emit('wait_message', room=player_sid)
        return
    elif len(players) == 2:
        emit('start_game', room=player_sid)
        emit('start_game', room=players[0].sid)
        game_loop()

if __name__ == '__main__':  
    app.run(port=5000)
    socketio.run(app, debug=True)
