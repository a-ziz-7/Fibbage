from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)

sentences = open('my_sentences.json','r')

sentences_data = json.load(sentences)
len_sentences = len(sentences_data['sentences'])

language = ""
pronuanciation = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/your-endpoint', methods=['POST'])
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

    # You can send a response back to the client if needed
    return jsonify({'message': 'Request received successfully'})

if __name__ == '__main__':
    app.run(debug=True)
