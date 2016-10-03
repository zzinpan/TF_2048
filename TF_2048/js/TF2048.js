//2048 Class
var TF2048 = function(_canvas, _tileCnt, _option){
	
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
		ctx.fillStyle = blankColor;
		this.fillShape();
		ctx.restore();
		//타일의 숫자가 0이면 그리지 않음
		if(this.number != 0){
			ctx.save();
			ctx.fillStyle = "#ffcdd2";	
			this.fillShape();
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.textAlign = "center";//text Align
			ctx.textBaseline = 'middle';//vertical Align
			ctx.font = 'bold '+tilePx/2+'px sans-serif';
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
	
	
	
	
	/* 타일 갯수 유효성 검사  */
	if(false){
		return;
	}
	
	//캔버스 객체
	var canvas = _canvas;
	
	//캔버스 컨텍스트
	var ctx = canvas.getContext("2d");
	
	/* style */
	_option = _option == null ? {"border": null, "border-color": null, "blank-color": null} : _option;
	
	//border
	var border = _option["border"] == null ? 9 : _option["border"];
	var bordrColor = _option["border-color"] == null ? "#000000" : _option["border-color"];
	var blankColor = _option["blank-color"] == null ? "#ffffff" : _option["blank-color"];
	
	//캔버스 한 변의 길이
	var canvasPx;
	
	//캔버스 기준점x
	var canvasGx;
	
	//캔버스 기준점y
	var canvasGy;
	
	//타일 총 갯수
	var tileCnt = _tileCnt;
	
	//타일 한줄의 갯수
	var tileRowCnt = Math.sqrt( tileCnt );
	
	//타일 한 변의 길이
	var tilePx;
	
	/* 계산에 필요한 init */
	function init(){
		//캔버스 한 변의 길이
		if(canvas.height > canvas.width){
			canvasPx = canvas.width-border*2;
		}else{
			canvasPx = canvas.height-border*2;
		}
		
		//캔버스 기준점x
		canvasGx = (canvas.width - canvasPx) /2;
		
		//캔버스 기준점y
		canvasGy = (canvas.height - canvasPx) /2;
		
		//타일 한 변의 길이
		tilePx = canvasPx /tileRowCnt -border*2;
	}
	init();
	
	//Util 모음
	var Util = {
			
			//타일의 gx, gy를 계산
			getTileGx: function(i){
				return canvasGx + tilePx*i +border*i*2 +border;
			},
			
			getTileGy: function(j){
				return canvasGy + tilePx*j +border*j*2 +border;
			},
			
			//이동할 타일(기존x, 기존y, 이동할x 이동할y)
			moveTile: function(x,y,ex,ey){
				//object는 call by reference이므로 가능한 코딩
				
				//이동시킬 타일
				var movingTile = tileArr[x][y];
				
				//기존의 타일이 있던 곳은 null 처리
				tileArr[x][y] = null;
				
				//이동할 곳에 타일을 저장
				tileArr[ex][ey] = movingTile;
				
				//애니메이션 처리
				var tween = new TWEEN.Tween(movingTile)
				.to( {gx: Util.getTileGx(ex), gy: Util.getTileGy(ey)} , 500 )
				.easing( TWEEN.Easing.Quintic.InOut )
				tween.start();
			}
			
	}
	
	//a1 + (n-1)d
	//배경 배열
	var backGroundTileArr = new Array();
	for(var i=0; i<tileRowCnt; i++){
		backGroundTileArr[i] = new Array();
		for(var j=0; j<tileRowCnt; j++){
			backGroundTileArr[i][j] = new Tile( Util.getTileGx(i), Util.getTileGy(j) );
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
	tileArr[randomTileIdx1.x][randomTileIdx1.y] = new Tile( Util.getTileGx(randomTileIdx1.x), Util.getTileGy(randomTileIdx1.y) );
	tileArr[randomTileIdx1.x][randomTileIdx1.y].number = 2;
	tileArr[randomTileIdx2.x][randomTileIdx2.y] = new Tile( Util.getTileGx(randomTileIdx2.x), Util.getTileGy(randomTileIdx2.y) );
	tileArr[randomTileIdx2.x][randomTileIdx2.y].number = 2;
	
	//주기적 렌더링
	var animation = setInterval(function(){
		
		ctx.clearRect(canvasGx, canvasGy, canvasPx, canvasPx);
		
		//2048 borderColor
		ctx.save();
		ctx.fillStyle = bordrColor;
		ctx.translate(canvasGx, canvasGy);
		ctx.fillRect(-border, -border, canvasPx+border*2, canvasPx+border*2);
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
	
	//사용자가 접근 가능 한 변수 및 함수 정의 
	return {
		toLeft: function(){
			//왼쪽에 타일이 존재하는가?
			function existLeftTile(x, y){
				if( tileArr[x-1][y] != null ){
					return true;
				}
				return false;
			}
			
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					//타일이 존재 한다면
					if(tileArr[x][y] != null){
						//왼쪽이 벽이 아니고, 바로 왼쪽에 타일이 없는 경우
						if( x != 0 && !existLeftTile(x,y) ){
							
							var ex = x-1;
							var ey = y;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ex == 0 || existLeftTile(ex,ey) ){
									break;
								}
								ex--;
							}
							Util.moveTile(x,y,ex,ey);
							
						}
					}
				}
			}
		},
		toUp: function(){
			//위쪽에 타일이 존재하는가?
			function existUpTile(x, y){
				if( tileArr[x][y-1] != null ){
					return true;
				}
				return false;
			}
			for(var x=0; x<tileRowCnt; x++){
				for(var y=0; y<tileRowCnt; y++){
					//타일이 존재 한다면
					if(tileArr[x][y] != null){
						//위쪽이 벽이 아니고, 바로 위쪽에 타일이 없는 경우
						if( y != 0 && !existUpTile(x,y) ){
							
							var ex = x;
							var ey = y-1;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ey == 0 || existUpTile(ex,ey) ){
									break;
								}
								ey--;
							}
							Util.moveTile(x,y,ex,ey);
							
						}
					}
				}
			}
		},
		toRight: function(){
			//오른쪽에 타일이 존재하는가?
			function existRightTile(x, y){
				if( tileArr[x+1][y] != null ){
					return true;
				}
				return false;
			}
			
			for(var x=tileRowCnt-1; -1<x; x--){
				for(var y=0; y<tileRowCnt; y++){
					//타일이 존재 한다면
					if(tileArr[x][y] != null){
						//왼쪽이 벽이 아니고, 바로 왼쪽에 타일이 없는 경우
						if( x != tileRowCnt-1 && !existRightTile(x,y) ){
							
							var ex = x+1;
							var ey = y;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ex == tileRowCnt-1 || existRightTile(ex,ey) ){
									break;
								}
								ex++;
							}
							Util.moveTile(x,y,ex,ey);
							
						}
					}
				}
			}
		},
		toDown: function(){
			//아래쪽에 타일이 존재하는가?
			function existDownTile(x, y){
				if( tileArr[x][y+1] != null ){
					return true;
				}
				return false;
			}
			for(var x=0; x<tileRowCnt; x++){
				for(var y=tileRowCnt-1; -1<y; y--){
					//타일이 존재 한다면
					if(tileArr[x][y] != null){
						//위쪽이 벽이 아니고, 바로 위쪽에 타일이 없는 경우
						if( y != tileRowCnt-1 && !existDownTile(x,y) ){
							
							var ex = x;
							var ey = y+1;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ey == tileRowCnt-1 || existDownTile(ex,ey) ){
									break;
								}
								ey++;
							}
							Util.moveTile(x,y,ex,ey);
							
						}
					}
				}
			}
		},
		//리사이징
		resize: function(){
			init();
			for(var i=0; i<tileRowCnt; i++){
				for(var j=0; j<tileRowCnt; j++){
					backGroundTileArr[i][j].gx = Util.getTileGx(i);
					backGroundTileArr[i][j].gy = Util.getTileGy(j);
					if(tileArr[i][j] != null){
						tileArr[i][j].gx = Util.getTileGx(i);
						tileArr[i][j].gy = Util.getTileGy(j);
					}
				}
			}
		}
	};
	
}