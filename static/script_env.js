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
        if (b.style.display !== 'none') {
            console.log('case: scores shown area genrated');
            b = null;
            socket.emit('new_new');
            return;
        }
    }
    if (a.style.display !== 'none') {
        socket.emit('submit_a', { answer: a.value });
        console.log('case: text area read and boxes generate');
        a = null;
    } else {
        console.log('case: boxes read and scores generate');
        socket.emit('answer_submited', {ans:ans});
    }
}

socket.on('show_results', function(data) {
    var area = document.getElementById('area');
    area.style.display = 'none';
    var body = document.getElementById('q_a');
    var pool = data.pool.split('|'); 
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result_div');
    resultDiv.id = 'rd1';
    resultDiv.style.width = '';
    resultDiv.style.display = 'flex';
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
        console.log(x);
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
    var resultDivv = document.createElement('div');
    resultDivv.classList.add('result_div_2'); // Add a class to the result div
    resultDivv.id = 'sumbit_fucking_3';
    resultDivv.style.display = 'flex';

    var tbr = document.getElementById('rd1');
    console.log(tbr.innerHTML);
    tbr.innerHTML = '';
    tbr.style.display = 'none';

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
            guessDiv.textContent = 'Player ' + player_data[0] + ' (' + player_data[3] +' points) guessed: ' + player_data[1];
            playerDiv.appendChild(guessDiv);

            var fooledDiv = document.createElement('div');
            fooledDiv.classList.add('row2'); // Add a class to the fooledDiv
            fooledDiv.style.backgroundColor = getRandomColor();
            fooledDiv.textContent = player_data[2].length > 0 ? 'Who got fooled: ' + player_data[2] : 'No one got fooled';
            playerDiv.appendChild(fooledDiv);
        }

        resultDivv.appendChild(playerDiv);
    }
    
    body.appendChild(resultDivv);
});


function submitName() {
    var text = document.getElementById('area_username').value;
    var b = document.getElementById('Submit');
    if (b && b.innerText === 'Submit') {
        b.innerText = 'Rename';
    }
    socket.emit('submit_name', { text: text });
}

var selectedElementId = null; 

function boxSelect(itemId) {
    var item = document.getElementById(itemId);
    // console.log('BS HEADER');
    if (selectedElementId === itemId) {
        // console.log('BS SELECTED_ID WAS SELECTED BEFORE');
        item.style.border = '';
        selectedElementId = null;
    } else {
        // console.log('BS NEW SELECT');
        if (selectedElementId) {
            var prevSelectedElement = document.getElementById(selectedElementId);
            if (prevSelectedElement) {
                // console.log('PREV CASE');
                prevSelectedElement.style.border = '';
            } else {
                console.error("Previously selected element not found for ID:", selectedElementId);
            }
        }
        // console.log('SHOULD LIGHT UP!!!');
        selectedElementId = itemId;
        // console.log(item.style.border);s
        item.style.border = '2px solid #ff0000';
        ans = item.id;
        socket.emit('box_selected', {ans:item.id});
    }
}


socket.on('new_round', function(data) {
    console.log('new round generated');
    update_question();
    var area = document.getElementById('area');
    area.style.display = 'flex';
    area.value = '';
    selectedElementId = null;
    var sf3 = document.getElementById('sumbit_fucking_3');
    sf3.style.display = 'none';
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

// Add this in your JavaScript code
socket.on('render_env_html', function(data) {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('body').style.height = '69vh';
    document.querySelector('body').innerHTML = data.html;
    update_question();
});