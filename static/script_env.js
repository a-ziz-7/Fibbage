var socket = io.connect('http://' + document.domain + ':' + location.port);
var ans;

function update_question() {
    socket.emit('update_question');
}

socket.on('update_question', function(data) {
    console.log('Received update_question event:', data);
    var qDiv = document.getElementById('q');
    var pDiv = document.getElementById('p');
    var sep = data.question.split("|")
    qDiv.innerHTML = sep[0];
    pDiv.innerHTML = sep[1];
});

function submitA() {
    var a = document.getElementById('area');
    var b = document.getElementById('sumbit_fucking_3');
    if (b) {
        console.log('asdjkbhllbhjasabldjsiufeipuverpugv9prgrg9834buvvbil');
        b = null;
        socket.emit('new_new');
        return;
    }
    if (a.style.display !== 'none') {
        socket.emit('submit_a', { answer: a.value });
        a = null;
    } else {
        socket.emit('answer_submited', {ans:ans});
    }
}

socket.on('show_results', function(data) {
    var area = document.getElementById('area');
    area.style.display = 'none';
    var body = document.getElementById('q_a');
    console.log(area);
    var pool = data.pool.split('|'); 
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result_div');
    resultDiv.id = 'rd1';
    resultDiv.style.width = '';
    var x = 0
    var rgbValues = [
        [247, 178, 103],
        [247, 157, 101],
        [244, 132, 95],
        [242, 112, 89],
        [242, 92, 84]
    ];
    pool.forEach(function(item) {
        x += 1
        var pElement = document.createElement('div');
        pElement.textContent = item; // Assuming item is a string; adjust accordingly
        pElement.classList.add('pool_choice'); // Add the class 'pool_choice'
        pElement.id = x.toString();
        var randomColor = rgbValues[Math.floor(Math.random() * rgbValues.length)];
        pElement.style.backgroundColor = `rgb(${randomColor.join(', ')})`;
        pElement.addEventListener('click', function() {
            boxSelect(pElement.id); 
        });
        resultDiv.appendChild(pElement);
    });
    if (x>4) {
        resultDiv.style.width = '90%';
    }else if (x==4) {
        resultDiv.style.width = '800px';
    }
    body.appendChild(resultDiv);
});

socket.on('show_answers', function(data) {
    var body = document.getElementById('q_a');
    var answer_data = data.answers.split('|');
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result_div_2'); // Add a class to the result div
    resultDiv.id = 'sumbit_fucking_3';

    for (var i = 0; i < answer_data.length; i++) {
        var player_data = answer_data[i].split('*');
        var playerDiv = document.createElement('div');
        playerDiv.classList.add('cg'); // Add a class to the player div

        if (i === 0) {
            // For correct answer
            var answerDiv = document.createElement('div');
            answerDiv.classList.add('row1');
            answerDiv.style.backgroundColor = getRandomColor(); // Set random color for row1
            answerDiv.textContent = 'Correct answer: ' + player_data[1];
            playerDiv.appendChild(answerDiv);

            var whoGotItDiv = document.createElement('div');
            whoGotItDiv.classList.add('row2'); // Add a class to the whoGotItDiv
            whoGotItDiv.style.backgroundColor = getRandomColor();
            whoGotItDiv.textContent = player_data[2].length > 0 ? 'Players who got it right: ' + player_data[2] : 'No one got it right';
            playerDiv.appendChild(whoGotItDiv);
        } else {
            // For other player guesses
            var guessDiv = document.createElement('div');
            guessDiv.classList.add('row1');
            guessDiv.style.backgroundColor = getRandomColor();
            guessDiv.textContent = 'Player ' + player_data[0] + ' (' + player_data[3] +' points) guessed ' + player_data[1];
            playerDiv.appendChild(guessDiv);

            var fooledDiv = document.createElement('div');
            fooledDiv.classList.add('row2'); // Add a class to the fooledDiv
            fooledDiv.style.backgroundColor = getRandomColor();
            fooledDiv.textContent = player_data[2].length > 0 ? 'Who got fooled: ' + player_data[2] : 'No one got fooled';
            playerDiv.appendChild(fooledDiv);
        }

        resultDiv.appendChild(playerDiv);
    }
    var tbr = document.getElementById('rd1');
    tbr.style.display = 'none';
    body.appendChild(resultDiv);
});

    // var answer_data = data.answers.split('|');
    // var resultDiv = document.createElement('div');
    // console.log(data.answers)
    // for (var i = 0; i < answer_data.length; i++){
    //     player_data = answer_data[i].split('*');
    //     var playerDiv = document.createElement('div');
    //     if (i == 0) {
    //         playerDiv.textContent = 'Correct answer: ' + player_data[1] +
    //         (player_data[2].length > 0 ? ('\nWho got it right: ' + player_data[2]) : '\nNo one got it right.');
    //         console.log(
    //             'Correct answer: ' + player_data[1] + (player_data[2].length > 0 ? ('\nWho got it right: ' + player_data[2]) : '\nNo one got it right.')
    //         );
    //     } else {
    //         playerDiv.textContent = 'Player ' + player_data[0] + ' guessed ' + player_data[1] +
    //         (player_data[2].length > 0 ? ('\nWho got fooled: ' + player_data[2]) : '\nNo one got fooled.');
    //         console.log('Player ' + player_data[0] +' guessed '  + player_data[1] + 
    //         (player_data[2].length > 0 ? ('\nWho got fooled: ' + player_data[2]) : '\nNo one got fooled.')
    //         );
    //     }
    //     resultDiv.appendChild(playerDiv);
    // }
    // document.body.appendChild(resultDiv);


function submitName() {
    var text = document.getElementById('area_username').value;
    var b = document.getElementById('Submit');
    console.log(b);
    if (b && b.innerText === 'Submit') {
        b.innerText = 'Rename';
    }
    socket.emit('submit_name', { text: text });
}

var selectedElementId = null; 

function boxSelect(itemId) {
    var item = document.getElementById(itemId);
    if (!item) {
        console.error("Element not found for ID:", itemId);
        return;
    }
    if (selectedElementId === itemId) {
        item.style.border = '';
        selectedElementId = null;
    } else {
        if (selectedElementId) {
            var prevSelectedElement = document.getElementById(selectedElementId);
            if (prevSelectedElement) {
                prevSelectedElement.style.border = '';
            } else {
                console.error("Previously selected element not found for ID:", selectedElementId);
            }
        }
        selectedElementId = itemId;
        item.style.border = '2px solid #ff0000';
        ans = item.id;
        socket.emit('box_selected', {ans:item.id});
    }
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

socket.on('new_round', function(data) {
    for (let i = 0; i < 100; i++) {
        console.log(i);
    }
    var area = document.getElementById('area');
    area.style.display = 'flex';
    var rd1 = document.getElementById('rd1');
    rd1.style.display = 'none';
});

function getRandomColor() {
    var rgbValues = [
        [247, 178, 103],
        [247, 157, 101],
        [244, 132, 95],
        [242, 112, 89],
        [242, 92, 84]
    ];
    var randomIndex = Math.floor(Math.random() * rgbValues.length);
    return `rgb(${rgbValues[randomIndex].join(', ')})`;
}

socket.on('redirect', function(data) {
    window.location.href = data.url;
});

// Add this in your JavaScript code
socket.on('render_env_html', function(data) {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('body').style.height = '69vh';
    document.querySelector('body').innerHTML = data.html;
    update_question();
});