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

module.exports = Game;