const inputSlider = document.querySelector("[data-lengthSlider]");
const passLength = document.querySelector('[data-lengthNum]');

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector("[data-Indicator]");
const generateBtn = document.querySelector('.generate-btn');
const allCheckBox = document.querySelectorAll("input[type=checkBox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// default behaviour
let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc");

// set the length of the password using slider
function handleSlider(){
    inputSlider.value = passwordLength;
    passLength.innerText = passwordLength;

   const min = inputSlider.min;
   const max = inputSlider.max;
   inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    let randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6)
    {
        setIndicator('#ff0')
    }
    else{
        setIndicator("#f00");
    }
    }
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "failed"
    }
    // to make data-copyMsg span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked)
            checkCount++;
    })
    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider()
    }
}
allCheckBox.forEach((checkBox) =>{
    checkBox.addEventListener('change',handleCheckBoxChange)
});

inputSlider.addEventListener('input' ,(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
   if(passwordLength>0)
   {
    copyContent();
   }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount===0) return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove the old password
    password = "";
    // Generating the password on basis of checkboxes checked
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    // Adding the necessary characters to password on basis of checkboxes checked!!
    for(let i =0;i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }

    //  If passoword has some remaining characters left after adding compulsory characters
    for(let i =0;i<passwordLength-funcArr.length;i++)
    {
        let randomIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randomIndex]();   
    }

    // reshuffle the password
    password = shufflePassword(Array.from(password));

    // show the password in UI
    passwordDisplay.value = password;
    // calculate strength immediately to check whether the password is Strong(green),Normal(Grey),Weak(red)
    calcStrength();
})