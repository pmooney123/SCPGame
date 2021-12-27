let textSpeed = 20; //ms
let videoText = "VIDEO FEED:" + '\n' + " ~~ " + '\n' + '\n' + " ~~ ";
let audioText = "AUDIO FEED:";
let logText = "This is a log of your inputs";
let logHistory = [];
let gameSpeed = 20;
let videoDiv = document.getElementById('video');
let audioDiv = document.getElementById('audio');
let logDiv = document.getElementById('log');
let input = 'default';
let logSize = 6;
let typingStyle = "text";
let typingColor = 'ffffff';
let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 13) {
        console.log("enter pressed");

        takeInput();
    }
});

let audioTextActual = [];
let audioTextQueue = "AUDIO LOG:";
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
        text = text.concat('CONSOLE INPUT: ' + logHistory[i] + '\n');
    }
    while (logHistory.length >= logSize) {
        logHistory.splice(0, 1);
    }
    logText = text;
    console.log('new input: ' + input);

    processInput();

} //change inputvalue to input

function checkReady() {
    readyForInput = true;
    if (audioTextQueue.length > 0) {
        readyForInput = false;
    }

    if (readyForInput) {
        document.getElementById('input').style.border = '5px solid darkgreen';
    } else {
        document.getElementById('input').style.border = '5px solid darkred';
    }
} //check for advancing audio text, or other game haulting exposition
function time() {
    let hourText = hour;
    if (hour < 10) {
        hourText = "0" + hour;
    }
    let minuteText = minute ;
    if (minute < 10) {
        minuteText = "0" + minute;
    }
    let secondText = second;
    if (second < 10) {
        secondText = "0" + second;
    }
    return " (" + hourText + ":" + minuteText + ":" + secondText + ") ";
}
function processInput() {
    if (input === "") {
        addAudio('\n' + '*%' + time() + 'RESEARCHER:%' + '$ intense silence*');
        return;
    }
    addAudio('\n' + '*%' + time() + 'RESEARCHER:% \"' + input + "*\"")
} //change input to game actions
function addAudio(audio) {


    audioTextQueue = audioTextQueue.concat(audio);
}
//% = skip, & == bold, $ == italic, @ == strike, * == normal, # == read hexadecimal color, ^ == reset color
function advanceAudio() {
    if (audioTextQueue.length > 0) {
        let newChar = audioTextQueue[0];
        if (newChar === '&') {
            typingStyle = "b";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '$') {
            typingStyle = "i";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '#') {
            typingColor = audioTextQueue.substring(1, 7);
            console.log(typingColor);
            audioTextQueue = audioTextQueue.substring(7, audioTextQueue.length);
        } else if (newChar === '@') {
            typingStyle = "s";
            audioTextQueue = audioTextQueue.slice(1);
        } else if (newChar === '*') {
            typingStyle = "text";
            typingColor = "ffffff";
            audioTextQueue = audioTextQueue.slice(1);
        }
        else {
            if (newChar === '%') {
            let newWord = "";
            newChar = audioTextQueue[1];
            let index = 1;
            while (newChar !== "%") {
                index++;
                newWord = newWord.concat(newChar);
                newChar = audioTextQueue[index];
            }
            audioTextQueue = audioTextQueue.substring(index + 1, audioTextQueue.length);
            //audioTextActual = audioTextActual.concat(newWord);
            let child = document.createElement(typingStyle);
            child.innerText = newWord;
            child.style.color = '#' + typingColor;
            audioTextActual.push(child);
        } //skip text inbetween %
            else {
            audioTextQueue = audioTextQueue.slice(1);
            let child = document.createElement(typingStyle);
            child.style.color = '#' + typingColor;
            child.innerText = newChar;
            audioTextActual.push(child);
            //audioTextActual = audioTextActual.concat(newChar);
        } //add new elements
        }
    }
    audioText = audioTextActual;

} //convert audioqueue to audiotext
function advanceTime(extra) {
    millisecond += gameSpeed;
    if (extra != null) millisecond += extra
    while (millisecond > 1000) {
        millisecond -= 1000;
        second++;
    }
    while (second > 60) {
        second -= 60;
        minute++;
    }
    while (minute > 60) {
        minute -= 60;
        hour++;
    }
    while (hour > 24) {
        hour -= 24;
    }

}
function progressGame() {
    advanceTime();

    advanceAudio();

    checkReady()

    setText();

} //game step

function startGame() {
    setInterval(() => {
        requestAnimationFrame(progressGame);
    }, gameSpeed);
} //start new game

function setText() {
    audioDiv.innerHTML = "";
    let startChild = document.createElement("text");
    startChild.innerText = "AUDIO LOG: ";
    for (let i = 0; i < audioTextActual.length; i++) {
        audioDiv.appendChild(audioTextActual[i]);
    }
    logDiv.innerText = logText;

    document.getElementById("audio").scrollTop = document.getElementById("audio").scrollHeight
    document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight
    document.getElementById("video").scrollTop = document.getElementById("video").scrollHeight

} //set text of html elements


startGame();