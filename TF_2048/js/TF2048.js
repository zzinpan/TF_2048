//2048 Class
var TF2048 = function(_canvas, _tileCnt){
	
	/* 타일 갯수 유효성 검사  */
	if(false){
		return;
	}
	
	/* private 변수  */
	
	//캔버스 객체
	var canvas = _canvas;
	
	//캔버스 컨텍스트
	var ctx = canvas.getContext("2d");
	
	/* 리사이징 이벤트  */
	var fnResize = function(){
		canvas.height = $(window).height();
	 	canvas.width = $(window).width();
	}
	fnResize();
	$(window).resize(fnResize);
	
	//border
	var border = 10;
	
	//캔버스 한 변의 길이
	var canvasPx = null;
	if(canvas.height > canvas.width){
		canvasPx = canvas.width;
	}else{
		canvasPx = canvas.height;
	}
	
	//캔버스 기준점x
	var canvasGx = ($(window).width()-canvasPx) /2;
	
	//캔버스 기준점y
	var canvasGy = ($(window).height()-canvasPx) /2;
	
	//타일 총 갯수
	var tileCnt = _tileCnt;
	
	//타일 한줄의 갯수
	var tileRowCnt = Math.sqrt( tileCnt );
	
	//타일 한 변의 길이
	var tilePx = canvasPx /tileRowCnt - border*2;
	
	//2048 내부 타일 Class
	var Tile = function(_gx, _gy){
		//기준점 gx, gy
		this.gx = _gx;
		this.gy = _gy;
		//타일의 숫자
		this.number = 0;
	}
	Tile.prototype.draw = function(){
		ctx.save();
		ctx.fillStyle = "rgb(255, 255, 255)";
		this.fillShape();
		ctx.restore();
		//타일의 숫자가 0이면 그리지 않음
		if(this.number != 0){
			ctx.save();
			ctx.fillStyle = "#ffebee";	
			this.fillShape();
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.textAlign = "center";//text Align
			ctx.textBaseline = 'middle';//vertical Align
			ctx.font = 'bold '+tilePx/2+' sans-serif';
			ctx.translate(tilePx/2, tilePx/2 );
			ctx.fillText(this.number, 0,0);
			ctx.restore();
		}
	}
	//타일 모양 만들기
	Tile.prototype.fillShape = function(){
		//TODO 둥근 모서리 만들기
		ctx.translate(this.gx, this.gy);
		ctx.strokeStyle = "#ffc107";
		ctx.beginPath();
		ctx.moveTo(10, 0);
		ctx.lineTo(tilePx -10, 0);
		ctx.quadraticCurveTo(tilePx -10, 0, tilePx, 10);
		ctx.lineTo(tilePx, tilePx -10);
		ctx.quadraticCurveTo(tilePx, tilePx -10, tilePx -10, tilePx);
		ctx.lineTo(10, tilePx);
		ctx.quadraticCurveTo(10, tilePx, 0, tilePx -10);
		ctx.lineTo(0, 10);
		ctx.quadraticCurveTo(0, 10, 10, 0);
		ctx.stroke();
		ctx.fill();
	}
	
	//타일의 gx, gy를 계산
	function getTileGx(i){
		return border+border/2 + canvasGx + (i+1) * border + (i * tilePx);
	}
	function getTileGy(j){
		return border+border/2 + canvasGy + (j+1) * border + (j * tilePx);
	}
	
	//a1 + (n-1)d
	//배경 배열
	var backGroundTileArr = new Array();
	for(var i=0; i<tileRowCnt; i++){
		backGroundTileArr[i] = new Array();
		for(var j=0; j<tileRowCnt; j++){
			backGroundTileArr[i][j] = new Tile( getTileGx(i), getTileGy(j) );
			backGroundTileArr[i][j].draw();
		}
	}
	
	//신규 타일 2개 랜덤
	var randomTileIdx1 = {x: Math.floor(Math.random()*tileRowCnt), y: Math.floor(Math.random()*tileRowCnt)};
	var randomTileIdx2 = {x: null, y: null};
	while(true){
		randomTileIdx2.x = Math.floor(Math.random()*tileRowCnt);
		randomTileIdx2.y = Math.floor(Math.random()*tileRowCnt);
		if(randomTileIdx1.x != randomTileIdx2.x && randomTileIdx1.y != randomTileIdx2.y){
			break;
		}
	}
	
	//실제 타일 배열 생성
	var tileArr = new Array();
	for(var i=0; i<tileRowCnt; i++){
		tileArr[i] = new Array();
		for(var j=0; j<tileRowCnt; j++){
			tileArr[i][j] = null;
		}
	}
	
	//최초 타일 생성
	tileArr[randomTileIdx1.x][randomTileIdx1.y] = new Tile( getTileGx(randomTileIdx1.x), getTileGy(randomTileIdx1.y) );
	tileArr[randomTileIdx1.x][randomTileIdx1.y].number = 2;
	tileArr[randomTileIdx2.x][randomTileIdx2.y] = new Tile( getTileGx(randomTileIdx2.x), getTileGy(randomTileIdx2.y) );
	tileArr[randomTileIdx2.x][randomTileIdx2.y].number = 2;
	
	//주기적 렌더링
	var animation = setInterval(function(){
		
		ctx.clearRect(canvasGx, canvasGy, canvasPx, canvasPx);
		
		//2048 background fill
		ctx.save();
		ctx.fillStyle = "#ffc107";
		ctx.translate(canvasGx, canvasGy);
		ctx.fillRect(0 , 0, canvasPx, canvasPx);
		ctx.restore();
		
		//background tiles
		for(var i=0; i<tileRowCnt; i++){
			for(var j=0; j<tileRowCnt; j++){
				backGroundTileArr[i][j].draw();
			}
		}
		
		//tiles
		for(var i=0; i<tileRowCnt; i++){
			for(var j=0; j<tileRowCnt; j++){
				if( tileArr[i][j] != null ){
					tileArr[i][j].draw();
				}
			}
		}
		
		//tween
		TWEEN.update();
		
	}, 20);
	
	return {
		toLeft: function(){
			var updateTileArr = new Array();
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					//타일이 존재 한다면
					if(tileArr[x][y] != null){
						//가장 왼쪽 타일이 아니라면
						if(x != 0){
							var coord = {sx: x, sy: y, ex: 0, ey: y};
							//현재 x열의 가장 왼쪽 타일 찾기
							for(var _x=x-1; -1<_x; _x--){
								if( tileArr[_x][y] != null ){
									coord.ex = _x+1;
									break;
								}
							}
							//TODO 붙어있을 경우 처리가 안됨
							updateTileArr.push(coord);
							var tween = new TWEEN.Tween(tileArr[x][y])
							.to( {gx: getTileGx(coord.ex)} , 500 )
							.easing( TWEEN.Easing.Quintic.InOut )
							tween.start();
						}
					}
				}
			}
			for(var i=0; i<updateTileArr.length; i++){
				var sx = updateTileArr[i].sx;
				var sy = updateTileArr[i].sy;
				var ex = updateTileArr[i].ex;
				var ey = updateTileArr[i].ey;
				tileArr[ex][ey] = tileArr[sx][sy];
				tileArr[sx][sy] = null;
			}
		},
		toUp: function(){
			var updateTileArr = new Array();
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					if(tileArr[x][y] != null){
						if(y != 0){
							updateTileArr.push({x: x, y: y});
							var tween = new TWEEN.Tween(tileArr[x][y])
							.to( {gy: getTileGy(y-1)} , 500 )
							.easing( TWEEN.Easing.Quintic.InOut )
							tween.start();
						}
					}
				}
			}
			for(var i=0; i<updateTileArr.length; i++){
				var x = updateTileArr[i].x;
				var y = updateTileArr[i].y;
				tileArr[x][y-1] = tileArr[x][y];
				tileArr[x][y] = null;
			}
		},
		toRight: function(){
			var updateTileArr = new Array();
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					if(tileArr[x][y] != null){
						if(x != tileRowCnt-1){
							updateTileArr.push({x: x, y: y});
							var tween = new TWEEN.Tween(tileArr[x][y])
							.to( {gx: getTileGx(x+1)} , 500 )
							.easing( TWEEN.Easing.Quintic.InOut )
							tween.start();
						}
					}
				}
			}
			for(var i=updateTileArr.length-1; -1<i; i--){
				var x = updateTileArr[i].x;
				var y = updateTileArr[i].y;
				tileArr[x+1][y] = tileArr[x][y];
				tileArr[x][y] = null;
			}
		},
		toDown: function(){
			var updateTileArr = new Array();
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					if(tileArr[x][y] != null){
						if(y != tileRowCnt-1){
							updateTileArr.push({x: x, y: y});
							var tween = new TWEEN.Tween(tileArr[x][y])
							.to( {gy: getTileGy(y+1)} , 500 )
							.easing( TWEEN.Easing.Quintic.InOut )
							tween.start();
						}
					}
				}
			}
			for(var i=updateTileArr.length-1; -1<i; i--){
				var x = updateTileArr[i].x;
				var y = updateTileArr[i].y;
				tileArr[x][y+1] = tileArr[x][y];
				tileArr[x][y] = null;
			}
		},
		getTileArr: tileArr
	};
	
}