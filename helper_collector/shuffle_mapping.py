import random

# shuffle algorithm that shuffles the answer well but also maps to the index of the original list
# since I need to know what player's answer it was to compute the points
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

l = list(range(10))
print(l)
print(shuffle(l))
print(l)