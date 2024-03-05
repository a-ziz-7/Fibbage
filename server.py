from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)

sentences = open('my_sentences.json','r')

sentences_data = json.load(sentences)
len_sentences = len(sentences_data['sentences'])

correct = "english"
language = ""
pronuanciation = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/language_selector', methods=['POST'])
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

@app.route('/wait')
def wait():
    print('!!@$#@#%@#$^#$%&$%^&#$#%!%#$%^$*&(*&%^$#%$%^*&($%&#^@%!$^%&#^*$%&^#%!@$^%&^*&#$^@%2))')
    return render_template('wait.html')


if __name__ == '__main__':
    app.run(debug=True)
