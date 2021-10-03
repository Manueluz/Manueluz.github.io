let socket = new WebSocket("ws://90.175.129.152:9090/test");

var button = document.getElementById('connect');

button.addEventListener("click",loadGameSelector,false);

var field = document.getElementById("gameID");
field.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        tryJoinGame();
    }
})



function tryJoinGame() {
  var id = field.value;
  field.value = "";
  socket.send("GAME_JOIN_"+id);
}

function loadGameSelector(){
  loadHTML('<div id ="padding"><div><button id = "startGame2" class = "button">2 players</button><p></p><button id = "startGame3" class = "button">3 players</button><p></p><button id = "startGame4" class = "button">4 players</button></div></div>');
  document.getElementById('startGame2').addEventListener("click",startGame2,false);
  document.getElementById('startGame3').addEventListener("click",startGame3,false);
  document.getElementById('startGame4').addEventListener("click",startGame4,false);
}
function startGame2() {
  socket.send("GAME_CREATE_002020");
}
function startGame3() {
  socket.send("GAME_CREATE_003020");
}
function startGame4() {
  socket.send("GAME_CREATE_004020");
}

var ctx;
function beginGame(boardSize){
    loadHTML('<canvas id="myCanvas" width="500" height="500" class="canvas"></canvas><div><p id="IDHolder" class = "text">Loading ID</p></div>');
    canvas = document.getElementById('myCanvas');
    if (!canvas.getContext) {
        return;
    }

    ctx = canvas.getContext('2d');
    ctx.canvas.addEventListener('click', function(event){
        var mouseX = event.clientX - ctx.canvas.offsetLeft;
        var mouseY = event.clientY - ctx.canvas.offsetTop;
        var x = 0;
        var y = 0;
        while (mouseX > 25) {
          x = x + 1;
          mouseX = mouseX-25;
        }
        while (mouseY > 25) {
          y = y + 1;
          mouseY = mouseY-25;
        }
        socket.send("MOVE_X_" + x + "_Y_" + y);
    });
}

function drawTile(x,y,id){
  switch (id) {
    case 0:
      ctx.fillStyle = '#FF00D0';
      ctx.strokeStyle = '#FF00D0';
      break;
    case 1:
      ctx.fillStyle = '#9500FF';
      ctx.strokeStyle = '#9500FF';
      break;
    case 2:
      ctx.fillStyle = '#00C8FF';
      ctx.strokeStyle = '#00C8FF';
      break;
    case 3:
      ctx.fillStyle = '#4A7DFF';
      ctx.strokeStyle = '#4A7DFF';
      break;
    default:
      ctx.fillStyle = '#0D00FF';
      ctx.strokeStyle = '#0D00FF';
  }
  ctx.fillRect(x*25,y*25,25,25)
}

function loadHTML(page){
  document.getElementById('Content').innerHTML= page;

}

socket.onopen = function(e) {

};



socket.onmessage = function(event) {
  var msg = event.data;
  console.log(msg);
  if(msg == "ERR_404"){
    field.placeholder = "Error: Cant find game!";
  }

  var tokens = msg.split("_");
  if(tokens.length == 6){
    if(tokens[0] == "GAME" && tokens[1] == "HEADERS" && tokens[2] == "PLAYER" ){
      beginGame(Number(tokens[5]));
    }
  }
  if(tokens.length == 3){
    if(tokens[0] == "GAME" && tokens[1] == "ID"){
      document.getElementById("IDHolder").innerHTML = "Game ID:" + tokens[2];
    }
  }
  if(tokens.length == 9){
    if(tokens[0] == "MOVE"){
      drawTile(Number(tokens[2]),Number(tokens[4]),Number(tokens[6]))
    }
  }
};

socket.onclose = function(event) {
  loadHTML('<div id ="padding"><p id="Error">Connection lost</p></div>');
};

socket.onerror = function(error) {
  loadHTML('<div id ="padding"><p id="Error">Connection lost</p></div>');
};
