import json
import random
import os
import copy

os.system('clear')

sentences = open('my_sentences.json','r')
# print(sentences)

data = json.load(sentences)
len_data = len(data['sentences'])
# print(len_data)
# print(type(data))

class Player:

    def __init__(self, name) -> None:
        self.name = name
        self.score = 0
        self.guess = ""
        self.fooled = []
    
    def __str__(self) -> str:
        return f"Player: {self.name} with {self.score} points"

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

all_players = [Player('game')]

num_players = 2 # int(input("Enter the amount of players: "))
for i in range(num_players):
    name = f"P{i+1}" # input("Enter you nick name: ")
    player = Player(name)
    all_players.append(player)

turn = 1
appeared = set()
num_players = len(all_players)

while turn < 3:
    turn += 1
    pool = []
    ran_num = random.randint(0, len(data['sentences'])-1)
    while ran_num in appeared:
        ran_num = random.randint(0, len(data['sentences'])-1)
    appeared.add(ran_num)
    entity = data['sentences'][ran_num]
    pool.append(entity['english'])
    print(f"The sentence is:\n{entity['spanish']}\n{entity['spanish_pronunciation']}")
    for i in range(1,num_players):
        # timer
        guess = input(f'{all_players[i].name} enter you aproximation: ')
        all_players[i].guess = guess
        pool.append(guess)
    ordered_pool = copy.copy(pool)
    ds = shuffle(pool)
    # print(pool)
    # print(ds)
    # print(f'Please select the right answer from the pool of the answers:')
    for i in range(len(pool)):
        print(f"{i+1}) {pool[i]}")
    for i in range(1, num_players):
        choice = int(input(f"{all_players[i].name}: "))
        if ds[choice-1] == 0:
            all_players[i].score += 2
        elif ds[choice-1] == i:
            pass
        elif choice > 0 and choice <= num_players+1:
            all_players[ds[choice-1]].score += 1
            all_players[ds[choice-1]].fooled.append(all_players[i])
        else:
            pass
    for i in range(1, num_players):
        print(all_players[i])

    
    


