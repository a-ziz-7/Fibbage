// game_env.js
var socket = io.connect('http://' + document.domain + ':' + location.port);

function work() {
    socket.emit('work');
}

work()

socket.on('update_question', function(data) {
    console.log('Received update_question event:', data);
    var qDiv = document.getElementById('q');
    qDiv.innerHTML = data.question;
});

