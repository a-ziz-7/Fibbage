var socket = io.connect('http://' + document.domain + ':' + location.port);

function update_question() {
    socket.emit('update_question');
}
update_question()

socket.on('update_question', function(data) {
    console.log('Received update_question event:', data);
    var qDiv = document.getElementById('q');
    var pDiv = document.getElementById('p');
    var sep = data.question.split("|")
    qDiv.innerHTML = sep[0];
    pDiv.innerHTML = sep[1];
});

