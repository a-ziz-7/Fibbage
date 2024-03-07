var socket = io.connect('http://' + document.domain + ':' + location.port);
console.log('123');
function update_question() {
    socket.emit('update_question');
}
// update_question()

socket.on('update_question', function(data) {
    console.log('Received update_question event:', data);
    var qDiv = document.getElementById('q');
    var pDiv = document.getElementById('p');
    var sep = data.question.split("|")
    qDiv.innerHTML = sep[0];
    pDiv.innerHTML = sep[1];
});

function submitA() {
    var a = document.getElementById('area').value;
    socket.emit('submit_a', { answer: a });
}

socket.on('show_results', function(data) {
    var b = document.querySelector('body');
    b.innerHTML += '<h1>GGG</h1>';  
});

function submitName() {
    var text = document.getElementById('area_username').value;
    var b = document.getElementById('Submit');
    console.log(b);
    if (b && b.innerText === 'Submit') {
        b.innerText = 'Rename';
    }
    socket.emit('submit_name', { text: text });
}

function startEnv() {

    fetch('/env', {
        method: 'POST',
    })
    .then(response => response.text())
    .then(html => {
        // would be nice to send the name here too
        document.querySelector('body').style.backgroundImage = 'none';
        document.querySelector('body').style.height= '69vh';
        document.querySelector('body').innerHTML = html;
        update_question();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


socket.on('redirect', function(data) {
    window.location.href = data.url;
});
