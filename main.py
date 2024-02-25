import json
import random
import os

os.system('clear')

sentences = open('my_sentences.json','r')
# print(sentences)

data = json.load(sentences)
len_data = len(data['sentences'])
print(len_data)
# print(type(data))

# for i in data['sentences']:
#     print(f"{i['spanish']} : {i['english']}\n{i['spanish_pronunciation']}\n\n")

class Player:

    def __init__(self, name) -> None:
        self.name = name
        self.score = 0
        self.guess = ""
        self.selection = None
    
    def __str__(self) -> str:
        return f"Player: {self.name} with {self.score} points"

def shuffle(x):
    for i in range(1000):
        p1, p2 = random.randint(0,len(pool)-1),random.randint(0,len(pool)-1)
        x[p1], x[p2] = x[p2], x[p1]
    
all_players = []

num_players = 2 # int(input("Enter the amount of players: "))
for i in range(num_players):
    name = "Gabe" # input("Enter you nick name: ")
    player = Player(name)
    all_players.append(player)

turn = 1
appeared = set()

while turn < 5:
    turn += 1
    pool = []
    ran_num = random.randint(0, len(data['sentences'])-1)
    while ran_num in appeared:
        ran_num = random.randint(0, len(data['sentences'])-1)
    appeared.add(ran_num)
    entity = data['sentences'][ran_num]
    pool.append(entity['english'])
    print(f"The sentence is:\n{entity['spanish']}\n{entity['spanish_pronunciation']}")
    for i in range(num_players):
        # timer
        guess = input('Enter you aproximation: ')
        all_players[i].guess = guess
        pool.append(guess)
    shuffle(pool)
    print(f'Please select the right answer from the pool of the answers:')
    for i in range(len(pool)):
        print(f"{i+1}) {pool[i]}")
    
    
    
    


