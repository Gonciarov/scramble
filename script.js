const gameArea = document.querySelector('.gameArea');
const btn = document.createElement('button');
const output = document.createElement('div');
const input = document.createElement('input');
const scoreBoard = document.createElement('div');

// words array
let words = []

// spreadsheet credentials
const spreadsheetId = '16w69iHrzmPIkIUn78a2-kjWUucbBv_OIN44ehmQmUow';
const API_KEY = 'AIzaSyCi98bBh-FsYg-qARXMuBcAJmji4_8NGRs';

// getting data from spreadsheet
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:M2?key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log(data.values[1]);
    words = data.values[1];
    // adding output field to the game area
gameArea.append(output);

// adding input field to the game area
gameArea.append(input);

// adding button to the game area
gameArea.prepend(scoreBoard)

// adding button to the game area
gameArea.append(btn)
  })
  .catch(error => {
    console.log('Error fetching data from the spreadsheet:', error);
  });
scoreBoard.textContent = 'Score: 0';
scoreBoard.style.color = "white";
scoreBoard.style.background = "black";
scoreBoard.style.padding = "25px";
input.setAttribute('type', 'text');


let currentWord = '';
let score = 0;
let incorrect = 0;

//adding class for input
input.classList.add('input')

// aligning output area to the centre of the page and making font size bigger
output.style.textAlign = "center";
output.style.fontSize = "3em";

// adding 'Play' word to the button
btn.textContent = "PLAY";



// hide stuff

scoreBoard.style.display = "none";
input.style.display = "none";

// add event listener

btn.addEventListener('click', (e) => {
    if (words.length <= 0) {
      gameArea.textContent = `Game over. You have guessed ${score} words with ${score + incorrect} attempts`
    }
    btn.style.display = 'none';
    scoreBoard.style.display = "block";
    input.style.display = "inline";
    input.disabled = false;
    input.value = '';
    input.style = "input";
    pickAWord();
})

input.addEventListener('keyup', (e)=>{
    console.log(input.value.length);
    if (input.value.length == currentWord || e.code == 'Enter') {
        checkResult()
    }
})



function pickAWord() {
    // generate random index in range 0 to words array length
    let randIndex = Math.floor(Math.random() * words.length);
    // return a word found by the index
    output.textContent = scrambleLetters(words[randIndex]);
    output.style.letterSpacing = '0.5em';
    input.setAttribute('maxlength', words[randIndex].length);
    input.focus();
    currentWord = words[randIndex]
}

function scrambleLetters(word) {
    // Convert the input string into an array of characters
    const array = word.split('');
  
    // Scramble the array
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
  
    // Join the scrambled array of characters into a new string
    const scrambledWord = array.join('');
    if (scrambledWord == word) {
        console.log('MAAAATCH!!!')
        return scrambleLetters(word);
    }
    return scrambledWord;
  }

  function checkResult(){
    input.style.borderWidth = '5px';
    if(input.value == currentWord){
        console.log('correct');
        input.style.borderColor = 'green';
        score++;
        input.disabled = true;
        btn.style.display = "block";
        btn.textContent = "Next";
        words = words.filter(item => item !== currentWord)
        console.log(words)
    }else{
        input.style.borderColor = 'red';
        console.log('incorrect');
        input.value = '';
        input.focus();
        incorrect++;
    }
    addScore()
}

function addScore(){
    let tempOutput = `Score: <b>${score}</b> --- Incorrect: <b>${incorrect}</b> --- <b> Words left: ${words.length}`;
    scoreBoard.innerHTML = tempOutput;
}


