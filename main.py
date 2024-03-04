import json
import random
import os
import copy
import time
# some changes
os.system('clear')

sentences = open('my_sentences.json','r')
# print(sentences)

data = json.load(sentences)
len_data = len(data['sentences'])
# print(len_data)
# print(type(data))

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


def clear(x):
    for pl in x:
        pl.fooled = []


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


def main():
    all_players = [Player('game')]

    num_players = int(input("Enter the amount of players: "))
    for i in range(num_players):
        name = input("Enter you nick name: ")
        player = Player(name)
        all_players.append(player)

    turn = 1
    appeared = set()
    num_players = len(all_players)
    num_turns = 2

    while turn < num_turns + 1:
        turn += 1
        pool = []
        ran_num = random.randint(0, len(data['sentences'])-1)
        while ran_num in appeared:
            ran_num = random.randint(0, len(data['sentences'])-1)
        appeared.add(ran_num)
        entity = data['sentences'][ran_num]
        pool.append(entity['english'])
        for i in range(1,num_players):
            os.system('clear')
            # give each player 30 seconds to answer, if doesnt answer then empty string
            print(f"The sentence is:\n{entity['spanish']}\n{entity['spanish_pronunciation']} - pronuanciation")
            guess = input(f'{all_players[i].name} enter you aproximation: ')
            all_players[i].guess = guess
            pool.append(guess)
        os.system('clear')
        ordered_pool = copy.copy(pool)
        ds = shuffle(pool)
        os.system('clear')
        for i in range(1, num_players):
            print(f'Please select the right answer from the pool of the answers:')
            for j in range(len(pool)):
                print(f"{j+1}) {pool[j]}")
            
            choice = int(input(f"{all_players[i].name}: "))
            all_players[i].choice = choice
            if ds[choice-1] == 0:
                all_players[0].fooled.append(all_players[i])
                all_players[i].score += 2
            elif ds[choice-1] == i:
                pass
            elif choice > 0 and choice <= num_players+1:
                all_players[ds[choice-1]].score += 1
                all_players[ds[choice-1]].fooled.append(all_players[i])
            else:
                pass
            os.system('clear')
        print(f"Sentence: '{entity['spanish']}'\n")
        for i in range(1, num_players):
            if len(all_players[i].fooled) != 0:
                print(f'{all_players[i].name} guessed {ordered_pool[i]}\nand fooled {'player' if len(all_players[i].fooled) == 1 else 'players'}: {" ".join([i.name for i in all_players[i].fooled])}\n')
        if len(all_players[0].fooled) == 0:
            print(f'No one got the right answer: \n{entity['english']}\n\n')
        else:
            print(f"The right answer:\n{entity['english']}\nWho got it right: {" ".join([i.name for i in all_players[0].fooled])}\n\n")
        print(turn)
        if (turn-1) != num_turns:
            for i in range(1, num_players):
                print(all_players[i])
            input('\nPRESS ENTER')
        else:
            input('\nPRESS ENTER FOR FINAL SCORES')
            os.system('clear')
        clear(all_players)
            
    print(f'----------------------------------------------\n')
    print('Final Scores!!!')
    all_players = all_players[1:]
    all_players.sort()
    for i in range(len(all_players)):
        print(f'{i+1}) {all_players[i]}')
    print(f'\n----------------------------------------------')



main()