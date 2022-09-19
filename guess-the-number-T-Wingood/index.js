const { clear } = require('console');
const { rmdir } = require('fs');
const readline = require('readline');
const { start } = require('repl');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

upperLimit = 100
let lowerLimit = 0
let gameLoop = false
let numTries = 1 // Attempt Tracker 
playerGuess = ""
highOrLow = ""

startPrompt()

async function startPrompt(){ // Pick which game to chose from. 
  let answer = await ask (`Hello! Welcome to the number guessing game! Type "1" to have the Computer guess your number or "2" for you guessing the Computer's number. \n`)
  answer = answer.toLowerCase()
  isNaN(answer) ? (console.log("Thats not a option"), startPrompt()) : ""
  answer <=0 || answer >=3 ? (console.log("Thats not a option"), startPrompt()): ""
  answer == "1" ? startComputer() : ""
  answer == "2" ? startHuman() : ""
}
async function startComputer() { // Computer Guesses the Number
  console.clear()
  console.log("This is Computer vs Human!")
  console.log("Let's play a game where you make up a number and I (the computer) try to guess it.")
  let upperLimit = await ask ("How many numbers are you challenging me with? i.e 100 means I will look between 0 and 100? ")
  upperLimit = Number(upperLimit)
  let secretNumber = await ask(`What is your secret number between 1 and ${upperLimit}?\nI won't peek, I promise...\n`);
  console.log('You entered: ' + secretNumber);
  
  startGame();

function computerGuessNum(){
  let computerGuess = Math.round(((upperLimit + lowerLimit)/ 2))
  return computerGuess
}
async function startGame(){ // Runs the game
    while (gameLoop =! false){
    let computerGuess = computerGuessNum(upperLimit,lowerLimit);  
    let answer = await ask (`Was your number ${computerGuess} Type (Y) for Yes or (N) for No? (Your secret number was ${secretNumber}) \n`);
    answer = answer.toLowerCase()
    if (answer == "y"){
      checkYes();
    } else {
      computerGuess == secretNumber ? caughtCheater() : newGuess()
    }
    }
    async function caughtCheater(){ // Evaluates cheating scenarios
      let computerGuess = computerGuessNum(upperLimit,lowerLimit)
      if (computerGuess == secretNumber){
        console.log ("I believe I actually chose your secret number.")
        startGame();
      } else if (computerGuess > secretNumber){
        console.log(`Something doesn't feel right. I think the secret number is lower`)
        newGuess();
      } else if (computerGuess < secretNumber){
        console.log(`Something doesn't feel right. I think the secret number is higher.`)
        newGuess();
      } else {
        console.log(`Something is off...lets try that again`)
        newGuess();
      }

    }
    async function checkYes(){ // Evaluates user input if (Y) to computer guess // restart or quit game once completed
      let computerGuess = computerGuessNum(upperLimit,lowerLimit)
      if (secretNumber == computerGuess){
        console.log (`Your number was ${computerGuess}!, It took me this many tries: ${numTries}`)
        let gameAgain = await ask (`Would you like to play again? Type (Y) for Yes or (N) for No\n`)
        gameAgain = gameAgain.toLowerCase()
        gameAgain == "y" ? (clear(), startPrompt(), upperLimit = 100, lowerLimit = 0) : (clear(), console.log("Okay, Great Game!"), process.exit())
      } else {
        caughtCheater()
      }
    }
    async function newGuess(){ // Evaluates user input of Higher or Lower if computer incorrectly guesses secret number
      let computerGuess = computerGuessNum(upperLimit,lowerLimit)
      let highOrLow = await ask(`Is the secret number (H)igher or (L)ower then ${computerGuess} Type H for Higher, L for Lower? Your secret number was ${secretNumber} \n`)
      highOrLow = highOrLow.toLowerCase()
      checkHighLow(highOrLow)
      async function checkHighLow(){
        if (highOrLow == "h"){
          secretNumber > computerGuess ? (lowerLimit = computerGuess, startGame(), numTries ++) : caughtCheater()
        } else if (highOrLow == "l"){
          secretNumber < computerGuess ? (upperLimit = computerGuess, startGame(), numTries ++) : caughtCheater()
        } else {
          console.log ("I didn't get that, lets try again")
          newGuess()
        }
        }
    }
  }
}
async function startHuman() { // Human Guesses the Number
  console.log("This is Human vs Computer!")
  console.log("Let's play a game where I (computer) make up a number and you (human) try to guess it.")
  let numOfNumbers = await ask(`What is the highest number you want me to pick from??\n`);
  isNaN(numOfNumbers) ? (clear(), console.log("Oops, thats not a number. Lets start over") , startHuman()) : " "
  numOfNumbers = Number(numOfNumbers)
  let computerGuess = Math.round(Math.random() * numOfNumbers)
  
  startGame();

async function startGame(){ // Runs the game
  let playerGuess = await ask (`What is your guess? Remember the number is anywhere from 0 to ${numOfNumbers}\n`)
  if (isNaN(playerGuess)){
    console.log ("Oops, you didn't guess a number!")
    startGame()
  } else if (playerGuess > computerGuess){
      console.log (`Your guess of ${playerGuess} was too high!`); numTries ++; startGame();
  } else if (playerGuess < computerGuess){
      console.log (`Your guess of ${playerGuess} is too low!`); numTries ++; startGame();
  } else {
      console.log (`You guessed the number!! Great Job!. You guessed in this many tries:` + numTries);
      let gameAgain = await ask (`Would you like to play again? Type (Y) for Yes or (N) for No\n`);
      gameAgain = gameAgain.toLowerCase()
      gameAgain == "y" ? (clear(), startPrompt(), upperLimit = 100, numTries = 1) : (clear(), console.log("Okay, Great Game!"), process.exit());
  }
  }
}
