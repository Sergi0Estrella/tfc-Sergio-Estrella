window.addEventListener('load',()=>{
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

class Player{
    constructor(game){
        this.game = game;
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;
        this.collisionRadius = 30;
    }

    draw(context){
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save()
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
    }

    update(){
        this.collisionX = this.game.mouse.X;
        this.collisionY = this.game.mouse.Y;
    }
}

class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);

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
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
            console.log(event.offsetX, event.offsetY);
        });

    }
    render(context){
        this.player.draw(context);
        this.player.update();
    }
}

const game = new Game(canvas);
game.render(ctx);

console.log(game);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate)
}

animate();

})
