
function Pixel(){
	this.color = -1;
	this.text = '';
}

function Canvas(width, height){
	this.width = width;
	this.height = height;

	this.canvas = [];

	this.fillColor = 0;

	for(var y = 0; y < height; y++){
		this.canvas[y] = [];
		for(x = 0; x < width; x++){
			this.canvas[y][x] = new Pixel();
		}
	}
}

Canvas.prototype.fill = function(c){
	if(c >= 0 && c <= 255){
		this.fillColor = c;
	}else console.log("Bad fill color");
}

Canvas.prototype.background = function(c){
	if(c >= 0 && c <= 255){
		for(var y = 0; y < this.height; y++){
			for(x = 0; x < this.width; x++){
				this.canvas[y][x].color = c;
				this.canvas[y][x].txt = '';
			}
		}
	}else console.log("Bad background color.");
}

Canvas.prototype.point = function(x, y){
	this.canvas[y][x].color = this.fillColor;
	this.canvas[y][x].txt = '';
}

Canvas.prototype.circle = function(x, y, s){
	for(var x2 = x-s-1; x2 < x+s+1; x2++){
		for(var y2 = y-s-1; y2 < y+s+1; y2++){
			if(x2 > 0 && x2 < this.width && y2 > 0 && y2 < this.height){
				let dist = (x - x2) ** 2 + (y - y2) ** 2;
				if(dist < s**2){
					this.canvas[y2][x2].color = this.fillColor;
					this.canvas[y2][x2].txt = '';
				}
			}
		}
	}
}

Canvas.prototype.rect = function(x, y, w, h){
	for(var x2 = Math.floor(x-w/2); x2 < x+w/2; x2++){
		for(var y2 = Math.floor(y-h/2); y2 < y+h/2; y2++){
			if(x2 > 0 && x2 < this.width && y2 > 0 && y2 < this.height){
				this.canvas[y2][x2].color = this.fillColor;
				this.canvas[y2][x2].txt = '';
			}
		}
	}
}

Canvas.prototype.text = function(x, y, txt){
	var x2 = x;
	var y2 = y % 2 == 0 ? y : y-1;
	var i = 0;

	while(i < txt.length && x2 < this.width && x2 > 0 && y2 > 0 && y2 < this.height){
		this.canvas[y2][x2].txt = txt[i];
		this.canvas[y2+1][x2].color = this.fillColor;
		i++;
		x2++;
	}
}

Canvas.prototype.draw = function(){
	var str = "";
	for(var y = 0; y < this.height; y+=2){
		for(x = 0; x < this.width; x++){
			let fgc = this.canvas[y+1][x].color;
			let bgc = this.canvas[y][x].color;
			
			if(fgc < 0 || fgc > 255 || bgc < 0 || fgc > 255){
				continue;
			}

			let fg = "\x1b[38;5;" + fgc + "m";
			let bg = "\x1b[48;5;" + bgc + "m";

			let txt = this.canvas[y][x].txt || "\u2584";

			str += fg + bg + txt + "\x1b[0m";
		}
		str += "\n";
	}

	process.stdout.write(str);
}

const width = process.stdout.columns;
const height = process.stdout.rows*2;

var c = new Canvas(width, height);

c.background(15);
c.fill(26);
c.point(5, 6);
c.point(15, 5);

c.fill(0);
c.text(5, 11, "Make your terminal bigger if you can't see everything.");
c.text(5, 15, "Terminal based graphics! Uses the unicode half block character.");
c.text(5, 18, "Controlling back and foreground colors let's us use 8 bit colors!");

c.fill(160);
c.circle(23, 30, 5);
c.circle(9, 32, 9);
c.circle(41, 35, 13);

c.fill(56);
c.circle(23, 30, 2);
c.fill(203);
c.circle(41, 35, 5);

c.fill(70);
c.rect(30, 5, 10, 4);
c.rect(23, 44, 7, 5);

c.draw();


