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

module.exports = Player;