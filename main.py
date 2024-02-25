import json

sentences = open('my_sentences.json','r')

print(sentences)

data = json.load(sentences)

print(type(data))

for i in data['sentences']:
    print(f"{i['spanish']} : {i['english']}")