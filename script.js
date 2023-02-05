const screen = document.getElementById("screen-text");
const errorIcon = document.getElementById("error-icon");
const memoryIcon = document.getElementById("memory-icon");

let userInput = '';
let cache = '';
let overwrite = false;
let operation = '';
let memory = '';
let eq = false;

//SCREEN-RELATED FUNCTIONS
function addToScreen(input) {
  if (overwrite) {
    userInput = '';
    overwrite = false;
  }

  if (userInput.length < 8) {
    if (input === '.' && userInput.includes('.')) return;
    if (userInput.length == 0 && input === '.') userInput = '0';
    if (userInput === '0' && input === '0') userInput = '';
    userInput += input;
    screen.textContent = userInput;
  }
}

function resetScreen() {
  userInput = '';
  screen.textContent = '0';
}

function blinkScreen(value) {
  let memCheck = false;
  let errCheck = false;

  if (memoryIcon.style.visibility === 'visible' && value !== 'mem') {
    memCheck = true;
    memoryIcon.style.visibility = 'hidden';
  }
  if (errorIcon.style.visibility === 'visible' && value !== 'err') {
    errCheck = true;
    errorIcon.style.visibility = 'hidden';
  }
  screen.style.visibility = 'hidden';

  setTimeout(() => {
    screen.style.visibility = 'visible';
    if (memCheck) memoryIcon.style.visibility = 'visible';
    if (errCheck) errorIcon.style.visibility = 'visible';
  }, (50));
}


//NUMBER BUTTONS
const numBtnArr = Array.from(document.getElementsByClassName("key number"));

numBtnArr.forEach(element => {
  element.addEventListener("click", () => {
    addToScreen(element.textContent);
  })
});


//FUNCTION BUTTONS
const fncBtnArr = Array.from(document.getElementsByClassName("key func"));

fncBtnArr.forEach(element => {
  element.addEventListener("click", () => {
    switch (element.textContent) {
      case 'ON/C':
        blinkScreen('err');
        resetScreen();
        errorIcon.style.visibility = 'hidden';
        cache = '';
        break;
      case 'CE':
        blinkScreen('err');
        errorIcon.style.visibility = 'hidden';
        break;
      case 'MRC':
        blinkScreen();
        if(memory !== '') {
          if(eq){
            cache = '';
            userInput = '';
            eq = false;
          }
          screen.textContent = memory;
          userInput = memory;
        }
        break;
      case 'M-':
        blinkScreen('mem');
        if(screen.textContent === memory) {
          memory = '';
          memoryIcon.style.visibility = 'hidden';
        }
        
        break;
      case 'M+':
        blinkScreen();
        memoryIcon.style.visibility = 'visible';
        memory = screen.textContent;
        break;
      default:
        break;
    }
  })
});


//OPERATIONS BUTTONS
const opBtnArr = Array.from(document.getElementsByClassName("key operations"));

function calculate(value) {
  switch (value) {
    case '+':
      screen.textContent = parseFloat(cache) + parseFloat(userInput);
      break;
    case '-':
      screen.textContent = parseFloat(cache) - parseFloat(userInput);
      break;
    case 'x':
      screen.textContent = parseFloat(cache) * parseFloat(userInput);
      break;
    case '÷':
      if (screen.textContent === '0') {
        screen.textContent = '0';
        errorIcon.style.visibility = 'visible';
      } else screen.textContent = parseFloat(cache) / parseFloat(userInput);
      break;
    case '%':
      screen.textContent = '0';
      break;
    default:
      return;
  }

  if (screen.textContent.length > 8) {
    screen.textContent = screen.textContent.toString().slice(0, 8);
    errorIcon.style.visibility = "visible";
    if (!parseFloat(screen.textContent) < 0) errorIcon.style.visibility = "visible";
  }

}


function operations() {
  if (cache === '' && userInput !== '') {
    cache = userInput;
    userInput = '';
  }
  else if (cache !== '' && userInput !== '') {
    calculate(operation);
    cache = screen.textContent;
  }
  overwrite = true;
}

opBtnArr.forEach(element => {
  element.addEventListener("click", () => {
    blinkScreen();
    if (!['=', '+/-', '√', '%'].includes(element.textContent)) {
      operation = element.textContent;
    }

    if (['+/-', '√', '%'].includes(element.textContent)) {
      switch (element.textContent) {
        case '+/-':
          userInput = parseFloat(screen.textContent) * (-1);
          break;
        case '√':
          if (parseFloat(screen.textContent) < 0) {
            userInput = '0';
            errorIcon.style.visibility = 'visible';
          } else userInput = Math.sqrt(parseFloat(screen.textContent));
          if (userInput.toString().length > 8) {
            userInput = userInput.toString().slice(0, 8);
          }
          break;
        case '%':
          break;
        default:
          return;
      }
      screen.textContent = userInput;
    } else if (['+', '-', 'x', '÷'].includes(operation)) operations();
    if(element.textContent === '=')  {
      userInput = '';
      eq = true;
    }

    console.log("cache: " + cache);
    console.log("usrInput: " + userInput);
    console.log("operation: " + element.textContent);
    console.log("value on screen: " + screen.textContent);
    console.log("---------------------------------------");
  })
});
