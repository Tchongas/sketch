const canvas = document.getElementById('drawingArea');
const ctx = canvas.getContext('2d');
const container = canvas.parentNode;
const undoButton = document.getElementById('undo-button');
const clearButton = document.getElementById('clear-button');
const saveBtn = document.getElementById("saveBtn");
const hideBtn = document.getElementById("hideBtn");
const showBtn = document.getElementById("showBtn");

const hideInfoBtn = document.getElementById("closeInfoBtn");
const showInfoBtn = document.getElementById("infoBtn");

const savedStates = [];


let strokeStyle = '#f0f8ff';
let lineWidth = '4';
let lineCap = 'round';

let timerId;

let background = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

let isEraserMode = false;
let pencilColor = "#f0f8ff";

resizeCanvas();



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

undoButton.addEventListener('click', undo);
clearButton.addEventListener('click', clearCanvas);
hideBtn.addEventListener('click', hideBar);
showBtn.addEventListener('click', showBar);

hideInfoBtn.addEventListener('click', hideInfo);
showInfoBtn.addEventListener('click', showInfo);

ctx.strokeStyle = strokeStyle;
ctx.lineWidth = lineWidth;
ctx.lineCap = lineCap;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let lines = []; // array to store all the lines drawn



function startTimer() {
  // clear the previous timer if there was one
  clearTimeout(timerId);

  // start a new timer
  timerId = setTimeout(() => {
    document.getElementById('console').innerText = ("")
  }, 3000);
}

function hideBar() {
  document.getElementById("buttoncontainer").style.visibility = "hidden";
  document.getElementById("small-buttoncontainer").style.visibility = "hidden";
  document.getElementById("showBtn").style.visibility = "visible";
  document.getElementById("info").style.visibility = "hidden";
  document.getElementById("infoBtn").style.visibility = "hidden";
}

function showBar() {
  document.getElementById("buttoncontainer").style.visibility = "visible";
  document.getElementById("small-buttoncontainer").style.visibility = "visible";
  document.getElementById("showBtn").style.visibility = "hidden";
  document.getElementById("info").style.visibility = "hidden";
  document.getElementById("infoBtn").style.visibility = "visible";
}

function hideInfo() {
  document.getElementById("info").style.visibility = "hidden";
  document.getElementById("infoBtn").style.visibility = "visible";
}

function showInfo() {
  document.getElementById("info").style.visibility = "visible";
  document.getElementById("infoBtn").style.visibility = "hidden";
}


document.addEventListener("keydown", function(event) {
  
  

  if (event.ctrlKey && event.code === "KeyZ") {
    undo(); // call the undo() function when "Ctrl+Z" is pressed
    document.getElementById('console').innerText = ("Undo")
  }

  else if (event.code === "Digit2") {
    pencilColor = "#cf5b5b";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Vermelho")
    isEraserMode = false;

  }

  else if (event.code === "Digit1") {
    pencilColor = "#f0f8ff";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Branco")
    isEraserMode = false;
  }

  else if (event.code === "Digit3") {
    pencilColor = "#cfc655";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Amarelo")
    isEraserMode = false;
  }

  else if (event.code === "Digit4") {
    pencilColor = "#55cf63";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Verde Claro")
    isEraserMode = false;
  }

  else if (event.code === "Digit5") {
    pencilColor = "#5755cf";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Azul Escuro")
    isEraserMode = false;
  }

  else if (event.code === "Digit6") {
    pencilColor = "#9655cf";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Roxo")
    isEraserMode = false;
  }

  else if (event.code === "Digit7") {
    pencilColor = "#cf55be";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Rosa")
    isEraserMode = false;
  }

  else if (event.code === "Digit8") {
    pencilColor = "#cf9055";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Laranja")
    isEraserMode = false;
  }

  else if (event.code === "Digit9") {
    pencilColor = "#3b803c";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Verde Escuro")
    isEraserMode = false;
  }

  else if (event.code === "Digit0") {
    pencilColor = "#57d3e6";
    ctx.strokeStyle = pencilColor;
    document.getElementById('console').innerText = ("Cor: Azul claro")
    isEraserMode = false;
  }

  else if (event.code === "KeyE") {
    if (isEraserMode) {
      // Switch back to pencil mode
      strokeStyle = pencilColor;
      ctx.strokeStyle = strokeStyle;
      document.getElementById('console').innerText = ("Lapis");
    } else {
      // Switch to eraser mode
      strokeStyle = background;
      ctx.strokeStyle = strokeStyle;
      document.getElementById('console').innerText = ("Borracha");
    }
    isEraserMode = !isEraserMode;
  }

  else if (event.code === "KeyO") {
    ctx.lineWidth = ctx.lineWidth + 2;
    document.getElementById('console').innerText = ("Grossura da linha: "+ ctx.lineWidth)
    
  }

  else if (event.code === "KeyP") {
    ctx.lineWidth = ctx.lineWidth - 2;
    document.getElementById('console').innerText = ("Grossura da linha: "+ ctx.lineWidth)
    
    
  }
  startTimer();


});

saveBtn.addEventListener("click", () => {
  // Get the data URL of the canvas as PNG
  const dataURL = canvas.toDataURL("image/png");

  // Create a link element and set its download attribute to the desired file name
  const link = document.createElement("a");
  link.download = "canvas.png";

  // Set the href attribute of the link to the data URL
  link.href = dataURL;

  // Simulate a click on the link to trigger the download
  link.click();
});





function resizeCanvas() {
  saveState();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  restoreState();
}

function saveState() {
    savedStates.push(canvas.toDataURL());
  }

function restoreState() {
    const lastState = savedStates.pop();
    const img = new Image();
    img.src = lastState;
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }



  function startDrawing(e) {
    if (e.button === 0) { // Left mouse button
      isDrawing = true;
      lastX = e.clientX - canvas.offsetLeft;
      lastY = e.clientY - canvas.offsetTop;
      lines.push({ startX: lastX, startY: lastY });
      saveState(); // Save the current state of the canvas
    }
  }
  
  function draw(e) {
    if (!isDrawing || e.button !== 0) return; // Exit the function if not drawing or not left mouse button
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    lines.push({ startX: lastX, startY: lastY, endX: x, endY: y });
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }
  
  function stopDrawing(e) {
    if (e.button === 0) { // Left mouse button
      isDrawing = false;
    }
  }



  // Implement the undo function
  function undo() {
    if (savedStates.length === 0) return; // Don't do anything if there are no saved states
    restoreState(); // Remove the last saved state and redraw the canvas


  }

  function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
}
 


  




  