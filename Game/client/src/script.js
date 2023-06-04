window.addEventListener('load',()=>{

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

class Player{
    constructor(game){
        this.game = game;
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;
        this.collisionRadius = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.dx = 0;
        this.dy = 0;
        this.speedModifier = 5;
        this.src = "../"
    }

    draw(context){
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save()
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
    }

    update(){
        this.dx = this.game.mouse.x - this.collisionX;
        this.dy = this.game.mouse.y -this.collisionY;
        const distance = Math.hypot(this.dx, this.dy);

        if(distance > this.speedModifier){
            this.speedX = (this.dx)/distance || 0;
            this.speedY = (this.dy)/distance || 0;
        }else{
            this.speedX = 0;
            this.speedY = 0;
        }
        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
    }
}

class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.numberOfObstacles = (Math.random()*4)+1;
        this.obstacles = [];

        this.mouse = {
            x: this.width * 0.5,
            y: this.height * 0.5,
            pressed: false
        }

        //controls

        canvas.addEventListener('mousedown', (event)=>{
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
            this.mouse.pressed = true;
        });

        canvas.addEventListener('mouseup', (event)=>{
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
            this.mouse.pressed = false;
        });

        canvas.addEventListener('mousemove', (event)=>{
            if(this.mouse.pressed){
                this.mouse.x = event.offsetX;
                this.mouse.y = event.offsetY;
            }
        });

    }
    render(context){
        this.player.draw(context);
        this.player.update();
        this.obstacles.forEach((obstacle)=>obstacle.draw(context));
    }

}

const game = new Game(canvas);
game.render(ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate)
}

animate();

$(function() {  
    $('.btn-6')
      .on('mouseenter', function(e) {
              var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
              $(this).find('span').css({top:relY, left:relX})
      })
      .on('mouseout', function(e) {
              var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
          $(this).find('span').css({top:relY, left:relX})
      });
  });
});

$(document).ready(function() {

  const sock = io();
  
  function showResult(result) {
    var notification = $('#notification');
    notification.text("Se ha hecho una tirada de " + result);
    notification.fadeIn();

    setTimeout(function() {
    notification.fadeOut();
    }, 3000);
  }

  sock.on('showResultToAll', function(result) {
    showResult(result);
  });

  function changeBackground(imageUrl) {
    console.log("tetas");
    const canvas1 = document.getElementById('canvas1');
    canvas1.style.backgroundImage = `url(../img/${imageUrl}.jpg)`;
  }

  sock.on('backgroundChange', function(newBackground){
    changeBackground(newBackground);
  })

    //Function to pop a little window that shows a pair of dices

    $('#dice-btn').click(function() {

      const sock = io();

      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      var closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = 'x';
      closeBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
      });
      
      var dice1 = document.createElement('img');
      dice1.src = '../img/1.png';
      dice1.className = 'dice';
      
      var dice2 = document.createElement('img');
      dice2.src = '../img/1.png';
      dice2.className = 'dice';

      var resultText = document.createElement('p');
      resultText.className = 'result-text';
      
      var rollBtn = document.createElement('button');
      rollBtn.innerHTML = 'Tirar';
      rollBtn.addEventListener('click', function() {
        var result1 = Math.floor(Math.random() * 6) + 1;
        var result2 = Math.floor(Math.random() * 6) + 1;
        total = result1 + result2;
        
        dice1.src = `../img/${result1}.png`;
        dice2.src = `../img/${result2}.png`;

        resultText.innerHTML = 'Resultado: ' + total;
      });
      
      rollBtn.addEventListener('click', function() {
        rollBtn.innerHTML = 'Tirar otra vez';
        rollBtn.append(resultText);
        sock.emit('diceResult', total);
      });
      
      overlay.appendChild(closeBtn);
      overlay.appendChild(dice1);
      overlay.appendChild(dice2);
      overlay.appendChild(rollBtn);
      
      document.body.appendChild(overlay);
    });

      
    //Function to pop the chat on screen

    $('#chat-btn').click(function(){

        const chatDiv = document.getElementById('chat');

        const canvasDiv = document.getElementById('canvas1');

        canvasDiv.style.zIndex = -1;

        chatDiv.style.zIndex = 1;

        chatDiv.innerHTML = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <title>RPS</title>
            <link rel="stylesheet" href="styles/chat.css">
          </head>
          <body>
            <div class="rps-wrapper">
              <ul id="events"></ul>
              <div class="controls">
                <div class="chat-wrapper">
                  <form id="chat-form">
                    <input id="text" autocomplete="off" title="chat"/>
                    <button id="say">Say</button>
                  </form>
                </div>
        
                <div class="button-wrapper">
                  <button id="rock" class="turn">Rock</button>
                  <button id="paper" class="turn">Paper</button>
                  <button id="scissors" class="turn">Scissors</button>
                </div>
              </div>
            </div>
  
          </body>
        </html>`;

        const writeEvent = (text) => {
          // <ul> element
          const parent = document.querySelector('#events');
        
          // <li> element
          const el = document.createElement('li');
          el.innerHTML = text;
        
          parent.appendChild(el);
        };
        
        const onFormSubmitted = (e) => {
          e.preventDefault();
        
          const input = document.querySelector('#text');
          const text = input.value;
          input.value = '';
        
          sock.emit('message', text);
        };
        
        const addButtonListeners = () => {
          ['rock', 'paper', 'scissors'].forEach((id) => {
            const button = document.getElementById(id);
            button.addEventListener('click', () => {
              sock.emit('turn', id);
            });
          });
        };
        
        writeEvent('Welcome to RPS');
        
        const sock = io();
        sock.on('message', writeEvent);
        
        document
          .querySelector('#chat-form')
          .addEventListener('submit', onFormSubmitted);
        
        addButtonListeners();

      })

      //Function that allows the user to change the current map
      $('#changeMap-btn').click(function() {

        const sock = io();

        // Crea el div del mapa
        var mapDiv = $('<div></div>').addClass('map-overlay');
    
        // Crea la x para cerrar el div
        var closeBtn = $('<span></span>').addClass('close-btn').text('x');
        closeBtn.click(function() {
          mapDiv.remove();
        });
    
        // Crea las imágenes del mapa
        var image1 = $('<img>').attr('src', '../img/tabern.jpg').attr('id', 'tabern');
        var image2 = $('<img>').attr('src', '../img/sea.jpg').attr('id', 'sea');
        var image3 = $('<img>').attr('src', '../img/castle.jpg').attr('id', 'castle');
        var image4 = $('<img>').attr('src', '../img/fields.jpg').attr('id', 'fields');
    
        // Agrega los elementos al div del mapa
        mapDiv.append(closeBtn);
    
        var row1 = $('<div></div>').addClass('row');
        row1.append(image1);
        row1.append(image2);
        mapDiv.append(row1);
    
        var row2 = $('<div></div>').addClass('row');
        row2.append(image3);
        row2.append(image4);
        mapDiv.append(row2);

        image1.click(function(){
          sock.emit('changeBackground', "tabern");
        })

        image2.click(function(){
          sock.emit('changeBackground', "sea");
        })

        image3.click(function(){
          sock.emit('changeBackground', "castle");
        })

        image4.click(function(){
          sock.emit('changeBackground', "fields");
        })
    
        // Agrega el div del mapa al cuerpo del documento
        $('body').append(mapDiv);
      });
});


