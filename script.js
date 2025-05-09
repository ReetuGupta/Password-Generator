// Selecting DOM elements
let displayPassword = document.querySelector(".password-display");
let copyBtn = document.querySelector("[data-copy]");
let copyMsg = document.querySelector("[data-copyMsg]")

let displayLength = document.querySelector(".length-display");

let slider = document.querySelector(".slider");

let allCheckbox = document.querySelectorAll("input[type = checkbox]");
let uppercase = document.querySelector("#uppercase");
let lowercase = document.querySelector("#lowercase");
let number = document.querySelector("#number");
let symbol = document.querySelector("#symbol");

let colorIndicator = document.querySelector(".strength-indicator");

let generateBtn = document.querySelector(".generate-btn");

// String of symbols used for password
let keyboardSymbols = `~!@#$%^&*()_-+=[]{}|;:"',<>.?/`;

//default settings
let password = "";
let passwordLength = 10;
let count = 0;
setIndicator("#ccc");

// update password length when slider value changes
slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Updates slider and its label
function handleSlider(){
    slider.value = passwordLength;
    displayLength.innerText = passwordLength;

    let min = slider.min;
    let max = slider.max;

    slider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "%100%";
}

// Call once to initialize with default length
handleSlider();

// Utility: Returns a random integer between min (inclusive) and max (exclusive)
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random uppercase letter
function randomUppercase(){
    return String.fromCharCode(getRandom(65, 91));
}

// Generate a random lowercase letter
function randomLowercase(){
    return String.fromCharCode(getRandom(97, 123));
}

// Generate a random number (0–9)
function randomNumbers(){
    return getRandom(0, 10);
}

// Generate a random symbol from the keyboardSymbols string
function randomSymbols(){
    let index = getRandom(0, keyboardSymbols.length);
    // return keyboardSymbols[index];
    return keyboardSymbols.charAt(index);
}

// Copy the generated password to clipboard
async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    // Show visual feedback after copy
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
}

// Attach click handler to copy button
copyBtn.addEventListener('click', () => {
    if(displayPassword.value)
        copyContent();
});

// Set strength indicator background color
function setIndicator(color){
    colorIndicator.style.backgroundColor = color;
    colorIndicator.style.boxShadow = `1px 1px 5px ${color}`;
}

// Evaluate password strength based on selected options and length
function calStrength(){
    const hasUpper = uppercase.checked;
    const hasLower = lowercase.checked;
    const hasNum = number.checked;
    const hasSymbol = symbol.checked;

    if( hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8)
        setIndicator("green");

    else if( (hasUpper || hasLower) && (hasNum || hasSymbol) && passwordLength >= 6)
        setIndicator("orange");

    else
        setIndicator("red");
}

// Count how many options are selected and ensure password length is not less
function checkCount(){
    count = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            count++;
    });

    // Ensure password length is at least equal to selected character types
    if(passwordLength < count){
        passwordLength = count;
        handleSlider();
    }
}

// When any checkbox changes, recalculate count
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', checkCount);
});

// Main password generation logic
generateBtn.addEventListener('click', () => {
    // If no checkbox is selected, return
    if(count == 0)
        return;

    // Ensure password length is at least equal to number of selected types
    if(passwordLength < count){
        passwordLength = count;
        handleSlider();
    }

    password ="";

    // Array of functions for selected character types
    let funcArr = [];

    if(uppercase.checked)
        funcArr.push(randomUppercase);
    
    if(lowercase.checked)
        funcArr.push(randomLowercase);

    if(number.checked)
        funcArr.push(randomNumbers);

    if(symbol.checked)
        funcArr.push(randomSymbols);

      // Add at least one character from each selected type
    funcArr.forEach(selected => {
        password += selected();
    });

    // Add remaining characters randomly from selected types
    for(let i=0; i<passwordLength - funcArr.length; i++) {
        let randIndex = getRandom(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    // Shuffle to avoid predictable order (e.g. uppercase always first)
    password = shufflePassword(Array.from(password));
   
    // Display final password in input box
    displayPassword.value = password;
  
     // Evaluate password strength
    calStrength();
    
});

// Shuffles characters in password using Fisher-Yates algorithm
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
        // Convert back to string
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}





