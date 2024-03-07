var socket = io.connect('http://' + document.domain + ':' + location.port);
console.log('123');
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
    var a = document.getElementById('area').value;
    socket.emit('submit_a', { answer: a });
}

// var body = document.querySelector('body');
// var pool = data.pool.split('|'); // Assuming data.pool is a string containing '|' separated values

// // Create a new div element
// var resultDiv = document.createElement('div');

// // Loop through the array and append each item to the div
// pool.forEach(function(item) {
//     var pElement = document.createElement('p');
//     pElement.textContent = item; // Assuming item is a string; adjust accordingly
//     resultDiv.appendChild(pElement);
// });

// // Append the new div to the body
// body.innerHTML = resultDiv;

socket.on('show_results', function(data) {
    var area = document.getElementById('area');
    area.style.display = 'none';
    var body = document.getElementById('q_a');
    console.log(area);
    var pool = data.pool.split('|'); 
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result_div');
    var rgbValues = [
        [247, 178, 103],
        [247, 157, 101],
        [244, 132, 95],
        [242, 112, 89],
        [242, 92, 84]
    ];
    pool.forEach(function(item) {
        var pElement = document.createElement('div');
        pElement.textContent = item; // Assuming item is a string; adjust accordingly
        pElement.classList.add('pool_choice'); // Add the class 'pool_choice'
        var randomColor = rgbValues[Math.floor(Math.random() * rgbValues.length)];
        pElement.style.backgroundColor = `rgb(${randomColor.join(', ')})`;
        resultDiv.appendChild(pElement);
    });
    
    // Append the new div to the body
    // body.appendChild(resultDiv);
    body.appendChild(resultDiv);
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
