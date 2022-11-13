const BOX = 32;
const NUM_CELLS = {width: 17, height: 15};
const BG_OFFSET = {x: BOX, y: BOX*3};
const SCORE_OFFSET = {x: BOX*2.5, y: BOX*1.7};
const SNAKE_START = {x: BOX*9, y: BOX*10};


const endGameEvent = new Event('endgame');
const game = {
	canvas : document.getElementById('game'),
	ctx : null,
	items : [],
  ground: new Image(),
  score: 0,
	init() {	
    this.ground.src = "img/ground.png";
		this.items.push(new Food(), new Snack(), new TrApple());
    this.ctx = this.canvas.getContext("2d");
	},
	run(){
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.ground, 0, 0);
    snake.draw(this.ctx);
		for (const item of this.items){
			item.draw(this.ctx);
		}
    this.showScore();
	},
	update(){
    snake.update();
		for (let item of this.items){
			item.update();
		}
	},
  end(){
    clearInterval(gameRun);
    this.ctx.fillStyle = "white";
    this.ctx.font = "50px Arial";
    this.ctx.fillText("Game over",  BOX*6, BOX*7);
    this.ctx.fillText("Score: "+ this.score,  BOX*7, BOX*9);
    this.ctx.fillStyle = "green"; 
    this.ctx.fillText("Replay",  BOX*7.5, BOX*11);
    this.canvas.addEventListener('click', this.replay)
  },
  replay(){
    location.reload(true);
  },
  showScore(e){
    this.ctx.fillStyle = "white";
    this.ctx.font = "50px Arial";
    this.ctx.fillText(this.score, SCORE_OFFSET.x, SCORE_OFFSET.y);
  }
};

const snake = {
  tail: [{x:9*BOX,y:10*BOX}],
  color: 'green',
  draw(ctx){
    for (const cell of this.tail ){
      ctx.fillStyle = this.color;
      ctx.fillRect(cell.x,cell.y,BOX,BOX);  
    }
  },
  update(){
    const newHead = {...this.tail[0]};
    if(this.dir === "left") newHead.x -= BOX;
    if(this.dir === "right") newHead.x += BOX;
    if(this.dir === "up") newHead.y -= BOX;
    if(this.dir === "down") newHead.y += BOX;
    this._checkBorders(newHead);
    if(!this._hasEatenItem(newHead)){
      this.tail.pop();
    }
    this._hasEatenTail(newHead);
    this.tail.unshift(newHead);
  },
  _checkBorders(head){
    if(head.x >= 18*BOX || head.x <= 0*BOX || head.y <= 2*BOX || head.y >= 18*BOX){
      document.dispatchEvent(endGameEvent);
    }
  },
  _hasEatenItem(head){
    for(const item of game.items){
      if(item.x === head.x && item.y === head.y){
        return item.wasEaten();
      }
    }
  },
  _hasEatenTail(head){
    for({x,y} of this.tail){
      if(x === head.x && y === head.y){
        document.dispatchEvent(endGameEvent);
      }
    }
    return false;
  }
}

class Item{
	constructor(){
    this._move();
    this.bonus = 0;
    this.grow = false;
    this.pic = new Image();
    this.pic.src = "img/hamburger.png"
  }
	draw(ctx){
    ctx.drawImage(this.pic, this.x, this.y)
	}
	update(){
	}
  _move(){
    this.x = Math.floor(Math.random()*NUM_CELLS.width)*BOX+BG_OFFSET.x;
    this.y = Math.floor(Math.random()*NUM_CELLS.height)*BOX+BG_OFFSET.y;
  }
  wasEaten(){
    this._move();
    game.score += this.bonus;
    return this.grow;
  }
}

class Food extends Item{
  constructor(){
    super();
    this.pic.src = "img/hamburger.png";
    this.bonus = 2;
    this.grow = true;
  }
}

class Snack extends Item{
  constructor(){
    super();
    this.pic.src = "img/food.png";
    this.bonus = 1;
    this.grow = false;
  }
}
class TrApple extends Item{
  constructor(){
    super();
    this.pic.src = "img/apple.png";
    this.bonus = 5;
    this.grow = false;
    this.rand = 0;
  }
  update(){
    this.rand = Math.floor(Math.random() * 12);
    if(this.rand === 0 && this.x > 1*BOX) this.x -= BOX;
    if(this.rand === 3 && this.x < 17*BOX) this.x += BOX;
    if(this.rand === 7 && this.y > 3*BOX) this.y -= BOX;
    if(this.rand === 11 && this.y < 17*BOX) this.y += BOX;
  }
}

document.addEventListener('endgame', ()=>game.end());

document.addEventListener("keydown", direction);
function direction(event){
  if(event.key === 'ArrowLeft' && snake.dir !== "right")
   snake.dir = "left";
  if(event.key === 'ArrowRight' && snake.dir !== "left")
    snake.dir = "right";
  if(event.key === 'ArrowUp' && snake.dir !== "down")
    snake.dir = "up";
  if(event.key === 'ArrowDown' && snake.dir !== "up")
    snake.dir = "down";
}

game.init();

const gameRun = setInterval(()=>{game.run();game.update()},100);

