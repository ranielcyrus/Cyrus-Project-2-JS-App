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

//variable to be able to access globally
let varPhonetics = '';
let varDefinition = '';


//API function 
async function getWord() {
    //fetching dictionary api and adding the parameter on the last part
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputField.value}`)
    let data = await response.json();

    if (!response.ok) throw new Error('Network response was not ok.');

    //checker for phonetics availability and assinging  assign
    if(data[0].phonetics[0].text!==undefined){
        varPhonetics = data[0].phonetics[0].text;
    } else {
        varPhonetics = data[0].phonetics[1].text;
    }

    //assing definition 
    varDefinition=data[0].meanings[0].definitions[0].definition;
    return varDefinition, varPhonetics;     
    
}

//DOM manipulations function
function domElements() {
    //inputted word to show in page
    result.textContent = `${inputField.value}`;
    //phonetics show in page
    phonet.textContent = `Phonetic: ${varPhonetics}`;
    //meaning of the word
    mean.textContent = `Definition: ${varDefinition}`

    ///read button
    read.addEventListener("click", function () {
        // stop any ongoing speech
        window.speechSynthesis.cancel();

        //text to speech the input word
        let toSpeak = result.textContent.concat(varDefinition) //combining the word and definiton
        speech.text = toSpeak;
        window.speechSynthesis.speak(speech);
        //wait for the first speech to finish before stops the continuous speaking
        speech.onend = () => {
            window.speechSynthesis.cancel();
        };
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
}


//event listener
btn.addEventListener("click", async () => {
    //check if the input field is not empty, use trim to check for white spaces
    if(inputField.value.trim().length !== 0){
       
        try {
            //execute the call API and DOM manupulation functions
            await getWord();
            domElements();

        } catch(err) {
            //show error
            result.textContent = `${inputField.value}`;
            phonet.textContent = "Error: No definitions found"; 
            //remove meaning text content if ever there's an exisiting one
            mean.textContent = ""
        }

        //opening the book, check first for responsiveness
        if(window.matchMedia("(max-width: 480px)")){
            book.style.transform = `translateX(${80}px)`;
            frontCover.style.transform = `rotateY(${-150}deg)`;
            frontTitle.style.display='none';
            result.style.fontSize= "1.5rem";
            phonet.style.fontSize= "0.75rem";
            mean.style.fontSize= "0.75rem";
        } else {
        book.style.transform = `translateX(${200}px)`;
        frontCover.style.transform = `rotateY(${-180}deg)`;
        frontTitle.style.display='none';
        }
        
    } else {
        inputField.setAttribute('placeholder', 'Empty Fields! Pls Enter a word')
        alert("Input field is empty")
    } 
})
