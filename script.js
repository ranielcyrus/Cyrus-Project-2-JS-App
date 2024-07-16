////////variables for text to speech and DOM elements///////////////
let speech = new SpeechSynthesisUtterance();
let inputField = document.querySelector('#input-field')
let btn = document.querySelector('.btn');
let book = document.querySelector('.book');
let frontCover = document.querySelector('.front');
let frontTitle = document.querySelector('.front-title')
let page = document.querySelector('#page-1')
let result = document.querySelector('.searchResult')
let phonet = document.querySelector('.phonetics')
let mean = document.querySelector('.meaning')
let read = document.querySelector('#read-btn')
let close = document.querySelector('#close-btn')


//function 
async function getWord() {
try {
    //fetching dictionary api and adding the parameter on the last part
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputField.value}`)
    let data = await response.json();

    //DOM manipulation for Pages
    //inputted word to show in page
    result.textContent = `${inputField.value}`;
    //checker for phonetics availability 
    if(data[0].phonetics[0].text!==undefined){
        phonet.textContent = `Phonetic: ${data[0].phonetics[0].text}`;
    } else {
        phonet.textContent = `Phonetic: ${data[0].phonetics[1].text}`;
    }
    //meaning of the word
    mean.textContent = `Definition: ${data[0].meanings[0].definitions[0].definition}`

        ///read button
        read.addEventListener("click", function () {
            //text to speech the input word
            speech.text = inputField.value
            window.speechSynthesis.speak(speech);
            //text to speech the meaning of the inputted word
            speech.text = data[0].meanings[0].definitions[0].definition
            window.speechSynthesis.speak(speech);
        })

        //close button
        close.addEventListener("click", function() {
            //stop the text to speech
            window.speechSynthesis.cancel();
            //close the book
            book.style.transform = `translateX(${0}px)`;
            frontCover.style.transform = `rotateY(${0}deg)`;
            frontTitle.style.display='inline';
        })

    } catch(err) {
        //show error
        phonet.textContent = "Error: No definitions found"; 
        //remove meaning text content if ever there's an exisiting one
        mean.textContent = ""
    }
}

//event listener
btn.addEventListener("click", function (){
    //check if the input field is not empty, use trim to check for white spaces
    if(inputField.value.trim().length !== 0){
        getWord();

        //opening the book
        if(window.matchMedia("(max-width: 480px)")){
            book.style.transform = `translateX(${80}px)`;
            frontCover.style.transform = `rotateY(${-150}deg)`;
            frontTitle.style.display='none';
            result.style.fontSize= "1.5rem";
            phonet.style.fontSize= "0.75rem";
            mean.style.fontSize= "0.75rem";
        }
        else {
        book.style.transform = `translateX(${200}px)`;
        frontCover.style.transform = `rotateY(${-180}deg)`;
        frontTitle.style.display='none';
        }
    } 
    else {
        inputField.setAttribute('placeholder', 'Empty Fields! Pls Enter a word')
        alert("Input field is empty")
    } 
})