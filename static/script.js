var selectedFlag = null;
var socket = io.connect('http://' + document.domain + ':' + location.port);

function selectFlag(flag) {
    var button = document.getElementById('my-button');

    if (selectedFlag == flag) {
        document.querySelector("." + flag + " img").classList.remove("selected");
        selectedFlag = null;
        button.style.backgroundColor = 'rgb(185, 135, 43)';
    } else {
        if (selectedFlag) {
            document.querySelector("." + selectedFlag + " img").classList.remove("selected");
        }
        selectedFlag = flag;
        button.style.backgroundColor = (flag === 'spanish') ? 'red' : 'blue';
        document.querySelector("." + flag + " img").classList.add("selected");
    }
}

function sendRequest() {
    if (selectedFlag) {
        // Prepare the data to be sent in the POST request
        var data = { flag: selectedFlag };
        fetch('/language_selector', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            return fetch('/wait', {
                method: 'POST',
            });
        })
        .then(response => response.text())
        .then(html => {
            // console.log('Wait Success:', waitData);
            document.querySelector('body').innerHTML = html;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert("Please select a flag first.");
    }
}

function submitName() {
    var text = document.getElementById('area').value;
    socket.emit('submit_name', { text: text });
}

function startGame() {
    socket.emit('start_game');
}

socket.on('redirect', function(data) {
    window.location.href = data.url;
});