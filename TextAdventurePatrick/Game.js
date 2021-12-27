let textSpeed = 20; //ms
let videoText = "VIDEO FEED:" + '\n' + " ~~ " + '\n' + '\n' + " ~~ ";
let audioText = "AUDIO FEED:";
let logText = "This is a log of your inputs";
let logHistory = [];

let videoDiv = document.getElementById('video');
let audioDiv = document.getElementById('audio');
let logDiv = document.getElementById('log');
let input = 'default';
let logSize = 6;

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 13) {
        console.log("enter pressed");

        takeInput();
    }
});

let audioTextActual = "AUDIO FEED: " + '\n';
let audioTextQueue = "This text needs to be added to the screen";

let readyForInput = true;

function takeInput() {
    if (!readyForInput) {
        return;
    }
    input = document.getElementById('input').value;
    document.getElementById('input').value = '';
    logHistory.push(input); //ADD INPUT TO LOG HISTORY

    //TURN LOG HISTORY INTO TEXT
    let text = '';
    for (let i = 0; i < logHistory.length; i++) {
        text = text.concat('Researcher input: ' + logHistory[i] + '\n');
    }
    while (logHistory.length >= logSize) {
        logHistory.splice(0, 1);
    }
    logText = text;
    console.log('new input: ' + input);

    processInput();

} //enter does this

function checkReady() {
    readyForInput = true;
    if (audioTextQueue.length > 0) {
        readyForInput = false;
    }

    if (readyForInput) {
        document.getElementById('input').disabled = false;
        document.getElementById('input').style.border = '5px solid darkgreen';
    } else {
        document.getElementById('input').disabled = false;
        document.getElementById('input').style.border = '5px solid darkred';
    }
}

function processInput() {
    audioTextQueue = audioTextQueue.concat('\n' + 'RESEARCHER: \"' + input + "\"");
}

function progressGame() {


    if (audioTextQueue.length > 0) {
        let newChar = audioTextQueue[0];
        audioTextQueue = audioTextQueue.slice(1);
        audioTextActual = audioTextActual.concat(newChar);
    }
    audioText = audioTextActual;

    checkReady()

    setText();
} //game step

function startGame() {
    setInterval(() => {
        requestAnimationFrame(progressGame);
    }, 20);
} //start new game

function setText() {
    audioDiv.innerText = audioText;
    logDiv.innerText = logText;
} //set text of html elements


startGame();