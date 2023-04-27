const canvas = document.getElementById('drawingArea');
const ctx = canvas.getContext('2d');
// qualquer coisa ctx. quer dizer que é sobre o canvas

const container = canvas.parentNode;
const undoButton = document.getElementById('undo-button');
const clearButton = document.getElementById('clear-button');
const saveBtn = document.getElementById("saveBtn");
const hideBtn = document.getElementById("hideBtn");
const showBtn = document.getElementById("showBtn");
const hideInfoBtn = document.getElementById("closeInfoBtn");
const showInfoBtn = document.getElementById("infoBtn");

const savedStates = []; //aqui fica todas mudanças já feitas, para que possamos usar ctrl Z para voltar nelas



let strokeStyle = '#f0f8ff';
let lineWidth = '4';
let lineCap = 'round';

let timerId;

let isEraserMode = false;
let pencilColor = "#f0f8ff";


//cor do fundo
let colorValue = document.getElementById("color-picker").value;

//a função resizeCanvas tbm é usada para inicializar algumas coisas
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
//LastX e LastY é pra saber a ultima posição da linha, fazendo as linhas serem continuas
let lastX = 0;
let lastY = 0;

let lines = []; // Todas as linhas ficam salvas aqui


//TIMER DE 3 SEGUNDOS
function startTimer() {
  // reiniciar o timer para 3 segundos
  clearTimeout(timerId);

  //começar Timer de 3 segundos para fazer o console sumir
  timerId = setTimeout(() => {
    document.getElementById('console').innerText = ("")
  }, 3000);
}


//pegar cor para o fundo
function getColor() {
  const colorPicker = document.getElementById("color-picker");
  colorValue = colorPicker.value;
  console.log("The selected color is:", colorValue);
  document.body.style.backgroundColor = colorValue;
  clearCanvas();
}



//FUNÇÕES RELACIONADAS AOS BOTOES E TEXTO, NAO RELACIONADAS AO CANVAS
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



//TODAS AS FUNÇOES QUE ACONTECEM APARTIR DE UMA TECLA
document.addEventListener("keydown", function(event) {
  
  if (event.ctrlKey && event.code === "KeyZ") {
    undo(); 
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
      /* se isEraserMode é TRUE, quer dizer que a borracha já esta sendo usada, ou seja é pra 
      desativar ela. A borracha é só um pincel com a cor do fundo, entao aqui só botamos a cor
      como a ultima cor usada antes da borracha, que esta na var PencilColor*/
      strokeStyle = pencilColor;
      ctx.strokeStyle = strokeStyle;
      document.getElementById('console').innerText = ("Lapis");
    } else {
      /* E aqui Colocamos a cor da var ctx.StrokeStyle igual ao fundo, nao mudamos a pencilColor para nao
      perder a ultima cor usada*/
      strokeStyle = colorValue;
      console.log(colorValue)
      ctx.strokeStyle = strokeStyle;
      document.getElementById('console').innerText = ("Borracha");
    }
    isEraserMode = !isEraserMode;
  }

  else if (event.code === "KeyW") {
    ctx.lineWidth = ctx.lineWidth + 2;
    document.getElementById('console').innerText = ("Grossura da linha: "+ ctx.lineWidth)
    
  }

  else if (event.code === "KeyQ") {
    ctx.lineWidth = ctx.lineWidth - 2;
    document.getElementById('console').innerText = ("Grossura da linha: "+ ctx.lineWidth)
    
    
  }

  else if (event.code === "KeyR") {
    clearCanvas();
    document.getElementById('console').innerText = ("Limpar")
    
    
  }
  startTimer();


});

saveBtn.addEventListener("click", () => {
  // Pega a URL do canvas e tranforma em PNG para baixar
  const dataURL = canvas.toDataURL("image/png");

  // Gambiarra aqui, criamos um elemento a com o link de dowload do canvas e dai simulamos um click
  const link = document.createElement("a");
  link.download = "canvas.png";

  // setar o href para ser a imagem do canvas
  link.href = dataURL;

  // simular um click
  link.click();
});




/* Função que é chamada toda vez q o tamanho da tela muda, ela causa um bug que corta certas partes do canvas
mas é oque temos por enquanto*/
function resizeCanvas() {
  saveState();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = pencilColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  restoreState();
}

//função para salvar oque está no canvas, para que seja possivel usar ctrl Z
function saveState() {
    savedStates.push(canvas.toDataURL());
  }

// Função do ctrl Z, tira o ultimo valor do array e recria tudo usando uma Imagem
// nao chama essa função diretamente, chama a UNDO
function restoreState() {
    const lastState = savedStates.pop();
    const img = new Image();
    img.src = lastState;
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }


//função que define se está desenhando ou não
  function startDrawing(e) {
    if (e.button === 0) { // botao do mouse esquerdo
      isDrawing = true;
      lastX = e.clientX - canvas.offsetLeft;
      lastY = e.clientY - canvas.offsetTop;
      lines.push({ startX: lastX, startY: lastY });
      saveState(); // Salvar
    }
  }
  
  //função q faz as linhas apartir das variaveis e salva as linhas num array
  function draw(e) {
    if (!isDrawing || e.button !== 0) return; // return se nao esta desenhando ou se nao está segurando o mouse
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
  

  //função pra parar de desenhar quando larga o mouse
  function stopDrawing(e) {
    if (e.button === 0) {
      isDrawing = false;
    }
  }

  // função do ctrl Z
  function undo() {
    if (savedStates.length === 0) return; // se nao tem nada salvo retorna
    restoreState();


  }
  // limpar o canvas com um retangulo gigante
  function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
}
 


  




  