
//面向对象：
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var scoreDiv = document.getElementById("score");
var restart = document.getElementById("restart");

//定义棋盘格的大小，横、纵向数量
var boxSize = 20;
var rows = 30;
var cols = 40;
//定义一个“锁”
var lock = false;
//定义一个时间变量：控制定时器
var timer = null;
//定义分数的变量
var score = 0;
//定义变量：用来控制速度
var speed = 200;

//创建棋盘类
function DrawBackground(){
	//绘制横纵线的方法
	this.drawBack = function(){
		//绘制横线
		for (var i = 0; i < rows + 1; i++) {
			context.beginPath();
			context.moveTo(0,i * boxSize);
			context.lineTo(boxSize * cols,i * boxSize);
			context.closePath();
			context.strokeStyle = "gray";
			context.stroke();
			context.save();
		}
		//绘制纵线
		for (var i = 0; i < cols + 1; i++) {
			context.beginPath();
			context.moveTo(i * boxSize,0);
			context.lineTo(i * boxSize,boxSize * rows);
			context.closePath();
			context.strokeStyle = "gray";
			context.stroke();
			context.save();
		
		}
	}
	
}

//创建蛇类
function Snack (){
	//属性1：身体的长度
	this.bodyLength = 4;
	//属性2：各节身体的位置数组
	this.locationArray = [];//数组内存的是：对象,如{x:2,y:2}。
	//初始的蛇有四节
	for (var i = 0; i < this.bodyLength; i++) {
		var pos = {x:i * boxSize,y:0};
		this.locationArray.push(pos);
	}
	//属性3：方向
	//规定：0-左 1-右 2-上 3-下
	this.direction = 1;
	this.drawSnackBody = function(){
		//根据locationArray里存储的坐标信息绘制
		for (var i = 0; i < this.bodyLength; i++) {
			context.beginPath();
			//判断是否为"蛇头"
			if (i == this.bodyLength -1) {
				context.fillStyle = "hotpink";
			}else{
				context.fillStyle = "pink";
			}
			context.fillRect(this.locationArray[i].x,this.locationArray[i].y,boxSize,boxSize);
			context.strokeStyle = "white";
			context.strokeRect(this.locationArray[i].x,this.locationArray[i].y,boxSize,boxSize);
			context.save();
		}
	}
	//蛇的移动行为
	this.moveSnack = function(){
		//蛇的走向
		switch (this.direction){
			case 0:{
				var nextPos = {x:this.locationArray[this.bodyLength - 1].x - boxSize,y:this.locationArray[this.bodyLength - 1].y};
				//把新坐标添加到蛇的数组内
				this.locationArray.push(nextPos);
				break;
			}
			case 1:{
				var nextPos = {x:this.locationArray[this.bodyLength - 1].x + boxSize,y:this.locationArray[this.bodyLength - 1].y};
				//把新坐标添加到蛇的数组内
				this.locationArray.push(nextPos);
				break;
			}
			case 2:{
				var nextPos = {x:this.locationArray[this.bodyLength - 1].x,y:this.locationArray[this.bodyLength - 1].y - boxSize};
				//把新坐标添加到蛇的数组内
				this.locationArray.push(nextPos);
				break;
			}
			case 3:{
				var nextPos = {x:this.locationArray[this.bodyLength - 1].x,y:this.locationArray[this.bodyLength - 1].y + boxSize};
				//把新坐标添加到蛇的数组内
				this.locationArray.push(nextPos);
				break;
			}
			default:
				break;
		}
		//移除“蛇尾”数组内的第一个元素
		this.locationArray.shift();
		//重新绘制蛇的身体
		this.drawSnackBody();
	}
	//增加“身体”的方法
	this.addBody = function(){
		//蛇的长度加一
		this.bodyLength++;
		//蛇的身体加一
		var e = {x:0,y:0};
		this.locationArray.unshift(e);
	}
}

//“食物”类
function Food(){
	this.foodX = parseInt(Math.random()*cols) * boxSize;
	this.foodY = parseInt(Math.random()*rows) * boxSize;
	//绘制“食物”
	this.drawFood = function(){
		context.beginPath();
		context.fillStyle = "deeppink";
		context.fillRect(this.foodX,this.foodY,boxSize,boxSize);
		context.save();
	}
	//随机“食物”位置
	this.changeFoodPos = function(){
		this.foodX = parseInt(Math.random()*cols) * boxSize;
		this.foodY = parseInt(Math.random()*rows) * boxSize;
	}
}

//操作类
function HandleGame(){
	//判断是否end
	this.isDieHandle = function(aSnack){
		//碰撞检测
		//碰到边界时,end
		var snackHead = aSnack.locationArray[aSnack.bodyLength - 1];
		if (snackHead.x < 0 || snackHead.x == boxSize * cols || snackHead.y < 0 || snackHead.y == boxSize * rows) {
			alert("Game Over");
			clearInterval(timer);
		}
		//碰到自己时，end
		for (var i = 0; i < aSnack.bodyLength - 1; i++) {
			if (aSnack.locationArray[i].x == snackHead.x && aSnack.locationArray[i].y == snackHead.y) {
				alert("Game Over");
				clearInterval(timer);
				break;
			}
		}
	}
	//判断是否吃到“食物”
	this.isEatFood = function(aSnack,aFood){
		var snackHead = aSnack.locationArray[aSnack.bodyLength - 1];
		if (snackHead.x == aFood.foodX && snackHead.y == aFood.foodY) {
			//吃到了“食物”
			//蛇的身体加一
			aSnack.addBody();
			//改变下一次“食物”的位置
			aFood.changeFoodPos();
			//加分数
			score += 10;
			scoreDiv.innerHTML = "分数：" + score ;
			//蛇的速度变快
			if (aSnack.bodyLength > 10) {
				speed = 150;
				clearInterval(timer);
				timeFun();
				if (aSnack.bodyLength > 30) {
					speed = 100;
					clearInterval(timer);
					timeFun();
				}
			}
		}
	}
}


var b = new DrawBackground();
var s = new Snack();
var f = new Food();
var h = new HandleGame()
b.drawBack();
s.drawSnackBody();
f.drawFood();
function timeFun (){
	timer = setInterval(function(){
		//清画布
		context.clearRect(0,0,canvas.width,canvas.height);
		lock = true;
		//再画一次画布
		b.drawBack();
		f.drawFood();
		//让蛇移动
		s.moveSnack();
		h.isDieHandle(s);
		h.isEatFood(s,f);
	},speed);
}
timeFun();
//键盘控制蛇的方向
document.onkeydown = function(event){
	var ev = event || window.event;
	switch (ev.keyCode){
		case 37://左
			if (s.direction != 1 && s.direction != 0 && lock == true) {
				s.direction = 0;
				lock = false;
			}
			break;
		case 38://上
			if (s.direction != 3 && s.direction != 2 && lock == true) {
				s.direction = 2;
				lock = false;
			}
			break;
		case 39://右
			if (s.direction != 0 && s.direction != 1 && lock == true) {
				s.direction = 1;
				lock = false;
			}
			break;
		case 40://下
			if (s.direction != 2 && s.direction != 3 && lock == true) {
				s.direction = 3;
				lock = false;
			}
			break;
		default:
			break;
	}
}

restart.onclick = function(){
	window.location.href = "贪吃蛇-正式版.html";
}