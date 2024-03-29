var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('wait_message', function (data) {
    alert('Waiting for more players to join...');
});

socket.on('start_game', function (data) {
    alert('Game starting!');
});

socket.on('game_update', function (data) {
    // Update UI with game information
    // You can use JavaScript to manipulate the DOM here
    document.getElementById('game-info').innerHTML = `<p>Player: ${data.player}</p>
                                                        <p>Sentence: ${data.sentence.spanish}</p>
                                                        <p>Pronunciation: ${data.sentence.spanish_pronunciation}</p>`;
});

socket.on('submit_guess', function (data) {
    // Allow the player to submit a guess
    // You can use JavaScript to show input fields or modal for input
    var guess = prompt(`${data.player}, enter your approximation:`);
    socket.emit('submit_guess', { player: data.player, guess: guess });
});

socket.on('select_answer', function (data) {
    // Allow the player to select an answer
    // You can use JavaScript to show options and get user input
    var choice = prompt(`${data.player}, please select the right answer:\n${data.choices.join('\n')}`);
    socket.emit('select_answer', { player: data.player, choice: choice });
});

socket.on('reveal_guess', function (data) {
    // Update UI to reveal guesses and fooled players
    // You can use JavaScript to manipulate the DOM here
    alert(`${data.player} guessed ${data.fooled_info.guessed} and fooled players: ${data.fooled_info.fooled_players.join(', ')}`);
});

socket.on('reveal_right_answer', function (data) {
    // Update UI to reveal the right answer and who got it right
    // You can use JavaScript to manipulate the DOM here
    alert(`The right answer: ${data.english}\nWho got it right: ${data.fooled_players.join(', ')}`);
});

socket.on('no_one_right_answer', function (data) {
    // Update UI when no one got the right answer
    // You can use JavaScript to manipulate the DOM here
    alert(`No one got the right answer: ${data.english}`);
});

socket.on('final_scores', function (data) {
    // Update UI with final scores
    // You can use JavaScript to manipulate the DOM here
    alert(`Final Score for ${data.player}: ${data.score}`);
});
