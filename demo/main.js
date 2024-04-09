const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sentences = require('../my_sentences.json');
const data = sentences.sentences;
const lenData = data.length;

class Player {
  constructor(name, score = 0) {
    this.name = name;
    this.score = score;
    this.choice = null;
    this.fooled = [];
  }

  toString() {
    return `Player: ${this.name} with ${this.score} points`;
  }
}

function clear(players) {
  for (const player of players) {
    player.fooled = [];
  }
}

function shuffle(array) {
  const length = array.length;
  const indices = Array.from({ length }, (_, i) => i);

  for (let i = 0; i < 1000; i++) {
    const p1 = Math.floor(Math.random() * length);
    const p2 = Math.floor(Math.random() * length);

    [array[p1], array[p2]] = [array[p2], array[p1]];
    [indices[p1], indices[p2]] = [indices[p2], indices[p1]];
  }

  return indices;
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const allPlayers = [new Player('game')];
  const numPlayers = parseInt(await prompt('Enter the amount of players: '), 10);

  for (let i = 0; i < numPlayers; i++) {
    const name = await prompt('Enter your nickname: ');
    const player = new Player(name);
    allPlayers.push(player);
  }

  let turn = 1;
  const appeared = new Set();
  const numTurns = 2;

  async function playTurn() {
    turn += 1;
    const pool = [];
    let ranNum = Math.floor(Math.random() * lenData);

    while (appeared.has(ranNum)) {
      ranNum = Math.floor(Math.random() * lenData);
    }

    appeared.add(ranNum);
    const entity = data[ranNum];
    pool.push(entity.english);

    for (let i = 1; i <= numPlayers; i++) {
      console.clear();
      console.log(`The sentence is:\n${entity.spanish}\n${entity.spanish_pronunciation} - pronunciation`);
      const guess = await prompt(`${allPlayers[i].name} enter your approximation: `);
      allPlayers[i].guess = guess;
      pool.push(guess);
    }

    console.clear(); 
    const orderedPool = [...pool];
    const shuffledIndices = shuffle(pool);

    for (let i = 1; i <= numPlayers; i++) {
      console.log('Please select the right answer from the pool of answers:');
      for (let j = 0; j < pool.length; j++) {
        console.log(`${j + 1}) ${pool[j]}`);
      }

      const choice = parseInt(await prompt(`${allPlayers[i].name}: `), 10);
      allPlayers[i].choice = choice;

      if (shuffledIndices[choice - 1] === 0) {
        allPlayers[0].fooled.push(allPlayers[i]);
        allPlayers[i].score += 2;
      } else if (shuffledIndices[choice - 1] === i) {
        // Do nothing
      } else if (choice > 0 && choice <= numPlayers + 1) {
        allPlayers[shuffledIndices[choice - 1]].score += 1;
        allPlayers[shuffledIndices[choice - 1]].fooled.push(allPlayers[i]);
      } else {
        // Do nothing
      }

      console.clear(); 
    }

    console.log(`Sentence: '${entity.spanish}'\n`);

    for (let i = 1; i <= numPlayers; i++) {
      if (allPlayers[i].fooled.length !== 0) {
        console.log(`${allPlayers[i].name} guessed ${orderedPool[i]}\nand fooled ${
          allPlayers[i].fooled.length === 1 ? 'player' : 'players'
        }: ${allPlayers[i].fooled.map((player) => player.name).join(' ')}\n`);
      }
    }

    if (allPlayers[0].fooled.length === 0) {
      console.log(`No one got the right answer: \n${entity.english}\n\n`);
    } else {
      console.log(`The right answer:\n${entity.english}\nWho got it right: ${allPlayers[0].fooled
        .map((player) => player.name)
        .join(' ')}\n\n`);
    }
    if (turn - 1 !== numTurns) {
      for (let i = 1; i <= numPlayers; i++) {
        console.log(allPlayers[i].toString());
      }

      await prompt('\nPRESS ENTER');
    } else {
      await prompt('\nPRESS ENTER FOR FINAL SCORES');
      console.clear(); 
    }

    clear(allPlayers);
  }

  async function runGame() {
    while (turn < numTurns + 1) {
      await playTurn();
    }
    
    console.log('Final Scores!!!\n');
    console.log('----------------------------------------------\n');
    
    const sortedPlayers = allPlayers.slice(1).sort((a, b) => b.score - a.score);

    for (let i = 0; i < sortedPlayers.length; i++) {
      console.log(`${i + 1}) ${sortedPlayers[i]}`);
    }

    console.log('\n----------------------------------------------');
    rl.close();
  }

  await runGame();
}

// start the main loop
main();
