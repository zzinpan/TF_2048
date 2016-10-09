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
		Board.ctx.save();
		Board.ctx.fillStyle = Board.style.blankColor;
		this.fillShape();
		Board.ctx.restore();
		//타일의 숫자가 0이면 그리지 않음
		if(this.number != 0){
			Board.ctx.save();
			Board.ctx.fillStyle = "#ffcdd2";	
			this.fillShape();
			Board.ctx.fillStyle = "rgb(255, 255, 255)";
			Board.ctx.textAlign = "center";//text Align
			Board.ctx.textBaseline = 'middle';//vertical Align
			Board.ctx.font = 'bold '+Board.tilePx/2+'px sans-serif';
			Board.ctx.translate(Board.tilePx/2, Board.tilePx/2 );
			Board.ctx.fillText(this.number, 0,0);
			Board.ctx.restore();
		}
	}
	//타일 모양 만들기
	Tile.prototype.fillShape = function(){
		//TODO 둥근 모서리 만들기
		Board.ctx.translate(this.gx, this.gy);
		Board.ctx.strokeStyle = "#ffc107";
		Board.ctx.beginPath();
		Board.ctx.moveTo(10, 0);
		Board.ctx.lineTo(Board.tilePx -10, 0);
		Board.ctx.quadraticCurveTo(Board.tilePx -10, 0, Board.tilePx, 10);
		Board.ctx.lineTo(Board.tilePx, Board.tilePx -10);
		Board.ctx.quadraticCurveTo(Board.tilePx, Board.tilePx -10, Board.tilePx -10, Board.tilePx);
		Board.ctx.lineTo(10, Board.tilePx);
		Board.ctx.quadraticCurveTo(10, Board.tilePx, 0, Board.tilePx -10);
		Board.ctx.lineTo(0, 10);
		Board.ctx.quadraticCurveTo(0, 10, 10, 0);
		Board.ctx.stroke();
		Board.ctx.fill();
	}
	//타일 숫자 증가
	Tile.prototype.numberIncrease = function(){
		//신규 타일일 경우
		if( this.number == 0 ){
			//1/4 확률로 4로 탄생 
			if ( Math.round( Math.random()*3 ) == 3 ){
				this.number = 4;
			}else{
				this.number = 2;
			}
		}else{
			this.number *= 2;
		}
	}
	
	/* 타일 갯수 유효성 검사  */
	if(false){
		return;
	}
	
	/* style */
	_option = _option == null ? {"border": null, "border-color": null, "blank-color": null} : _option;
	
	/* Board 객체 */
	var Board = {
			canvas: _canvas, //캔버스 객체
			ctx: _canvas.getContext("2d"), //캔버스 컨텍스트
			canvasPx: 0, //캔버스 한변의 길이
			canvasGx: 0, //캔버스 기준점x
			canvasGy: 0, //캔버스 기준점y
			backGroundTileArr: null, //배경이 되는 타일 배열
			tileArr: null, //실제 타일 배열
			isTileMoving: false, //타일 이동 여부
			tileCnt: _tileCnt, //타일 총 갯수
			tileRowCnt: Math.sqrt( _tileCnt ), //타일 한 줄의 갯 수,
			tilePx: 0, //타일의 한 변의 길이

			
			tileTodo: {
				arr: null,
				init: function(){
					//애니메이션용 임시 타일 배열 생성
					Board.tileTodo.arr = new Array();
					for(var i=0; i<Board.tileRowCnt; i++){
						Board.tileTodo.arr[i] = new Array();
						for(var j=0; j<Board.tileRowCnt; j++){
							Board.tileTodo.arr[i][j] = null;
						}
					}
				},
				getTodo: function(x, y){
					for(var i=0; i<Board.tileRowCnt; i++){
						for(var j=0; j<Board.tileRowCnt; j++){
							if( Board.tileTodo.arr[i][j] == null ){
								continue;
							}
							if ( Board.tileTodo.arr[i][j].ex != x ){
								continue;
							}
							if ( Board.tileTodo.arr[i][j].ey != y ){
								continue;
							}
							return Board.tileTodo.arr[i][j];
						}
					}
				},
				add: function(x, y, ex, ey){
					Board.tileTodo.arr[x][y] = {
						ex: ex,
						ey: ey,
						sgx: Util.getTileGx(x), 
						sgy: Util.getTileGy(y),
						egx: Util.getTileGx(ex),
						egy: Util.getTileGy(ey),
						isRemove: false,
						number: Board.tileArr[x][y].number
					};
					return Board.tileTodo.arr[x][y];
				},
				todo: function(){
					Board.isTileMoving = true;
					
					//애니메이션 처리
					for(var x=0; x<Board.tileRowCnt; x++){
						for(var y=0; y<Board.tileRowCnt; y++){
							var todo = Board.tileTodo.arr[x][y];
							if(todo != null){
								var _x = x;
								var _y = y;
								var tween = new TWEEN.Tween(Board.tileArr[_x][_y])
								.to( {gx: todo.egx, gy: todo.egy} , 500 )
								.easing( TWEEN.Easing.Quintic.InOut )
								.onComplete(function(){
									Board.tileArr[_x][_y].number = todo.number;
									if(todo.isRemove){
										Board.tileArr[_x][_y] = null;
									}
								});
								tween.start();
							}
						}
					}
				}
			}, 
			
			
			interval: {
				draw: null
			},
			style: {
				border: _option["border"] == null ? 9 : _option["border"], //선 두께
				borderColor: _option["border-color"] == null ? "#000000" : _option["border-color"], //선 색
				blankColor: _option["blank-color"] == null ? "#ffffff" : _option["blank-color"] //빈 타일 색
			},
			init: function(){
				//캔버스 한 변의 길이
				if( Board.canvas.height > Board.canvas.width ){
					Board.canvasPx = Board.canvas.width - Board.style.border*2;
				}else{
					Board.canvasPx = Board.canvas.height - Board.style.border*2;
				}
				
				//캔버스 기준점x
				Board.canvasGx = (Board.canvas.width - Board.canvasPx) /2;
				
				//캔버스 기준점y
				Board.canvasGy = (Board.canvas.height - Board.canvasPx) /2;
				
				//타일 한 변의 길이
				Board.tilePx = Board.canvasPx /Board.tileRowCnt -Board.style.border*2;
			},
			backgroundTileArrInit: function(){
				//a1 + (n-1)d
				//배경 배열
				Board.backGroundTileArr = new Array();
				for(var i=0; i<Board.tileRowCnt; i++){
					Board.backGroundTileArr[i] = new Array();
					for(var j=0; j<Board.tileRowCnt; j++){
						Board.backGroundTileArr[i][j] = new Tile( Util.getTileGx(i), Util.getTileGy(j) );
						Board.backGroundTileArr[i][j].draw();
					}
				}
			},
			tileArrInit: function(){
				//실제 타일 배열 생성
				Board.tileArr = new Array();
				for(var i=0; i<Board.tileRowCnt; i++){
					Board.tileArr[i] = new Array();
					for(var j=0; j<Board.tileRowCnt; j++){
						Board.tileArr[i][j] = null;
					}
				}

				//신규 타일 2개 생성
				Board.newTile();
				Board.newTile();
				
			},
			
			newTile: function(){
				
				//타일이 존재하지 않는 좌표 배열
				var nullTileArr = new Array();
				for(var x=0; x<Board.tileRowCnt; x++){
					for(var y=0; y<Board.tileRowCnt; y++){
						if(Board.tileArr[x][y] == null){
							nullTileArr.push({x: x, y: y});
						}
					}
				}
				
				//그 중에 하나를 선택
				var randomCoord = nullTileArr[ Math.floor(Math.random() * nullTileArr.length) ];
				
				//타일 생성
				Board.tileArr[randomCoord.x][randomCoord.y] = new Tile( Util.getTileGx(randomCoord.x), Util.getTileGy(randomCoord.y) );
				Board.tileArr[randomCoord.x][randomCoord.y].numberIncrease();
				
			},
			
			existLeftTile: function(x, y){
				if( Board.tileArr[x-1][y] != null ){
					return true;
				}
				return false;
			},
			
			existUpTile: function(x, y){
				if( Board.tileArr[x][y-1] != null ){
					return true;
				}
				return false;
			},
			
			existRightTile: function(x, y){
				if( Board.tileArr[x+1][y] != null ){
					return true;
				}
				return false;
			},
			
			existDownTile: function(x, y){
				if( Board.tileArr[x][y+1] != null ){
					return true;
				}
				return false;
			},
			
			
			draw: function(){
				Board.ctx.clearRect(Board.canvasGx, Board.canvasGy, Board.canvasPx, Board.canvasPx);
				
				//2048 borderColor
				Board.ctx.save();
				Board.ctx.fillStyle = Board.style.borderColor;
				Board.ctx.translate(Board.canvasGx, Board.canvasGy);
				Board.ctx.fillRect(-Board.style.border, -Board.style.border, Board.canvasPx+Board.style.border*2, Board.canvasPx+Board.style.border*2);
				Board.ctx.restore();
				
				//background tiles
				for(var i=0; i<Board.tileRowCnt; i++){
					for(var j=0; j<Board.tileRowCnt; j++){
						Board.backGroundTileArr[i][j].draw();
					}
				}
				
				//tiles
				for(var i=0; i<Board.tileRowCnt; i++){
					for(var j=0; j<Board.tileRowCnt; j++){
						if( Board.tileArr[i][j] == null ){
							continue;
						}
						if( Board.tileArr[i][j].visible == false ){
							continue;
						}
						Board.tileArr[i][j].draw();
					}
				}
				
				//tween
				TWEEN.update();
			}
	};
	
	//Util 모음
	var Util = {
			
			//타일의 gx, gy를 계산
			getTileGx: function(i){
				return Board.canvasGx + Board.tilePx*i + Board.style.border*i*2 +Board.style.border;
			},
			
			getTileGy: function(j){
				return Board.canvasGy + Board.tilePx*j + Board.style.border*j*2 +Board.style.border;
			},
			
			//이동할 타일(기존x, 기존y, 이동할x 이동할y)
			moveTile: function(){
				
				Board.isTileMoving = true;
				
				
				//애니메이션 처리
				var tween = new TWEEN.Tween(Board.movingTempTileArr[x][y])
				.to( {gx: Util.getTileGx(ex), gy: Util.getTileGy(ey)} , 500 )
				.easing( TWEEN.Easing.Quintic.InOut )
				.onComplete(function(){
					Board.tileArr[ex][ey].visible = true;
				});
				tween.start();
			}
			
	}
	
	Board.init();
	Board.backgroundTileArrInit();
	Board.tileArrInit();
	Board.tileTodo.init();
	
	
	//주기적 렌더링
	Board.interval.draw = setInterval(Board.draw, 20);
	
	//사용자가 접근 가능 한 변수 및 함수 정의 
	return {
		toLeft: function(){
			
			//타일이 이동중이라면, 이벤트 무시
			if(Board.isTileMoving){
				return;
			}
			
			Board.tileTodo.init();
			
			for(var x=0; x<Board.tileRowCnt; x++){
				for(var y=0; y<Board.tileRowCnt; y++){
	
					//타일이 존재 하는가?
					if(Board.tileArr[x][y] == null){
						continue;
					}
					
					//왼쪽이 벽인가?
					if( x == 0 ){
						continue;
					}
					
					var ex = x-1;
					var ey = y;

					//이동할 곳을 좌표 지정
					while(true){
						
						var todo = Board.tileTodo.getTodo(ex,ey);
						
						//이동할 가장 왼쪽자리에 타일이 없는 경우
						if( ex == 0 && todo == null ){
							Board.tileTodo.add(x, y, ex, ey); 
							break;
						}

						//이동할 곳에 타일이 있는 경우
						if( todo != null ){
							
							//이동할 곳의 타일과 숫자가 같은 경우
							if( Board.tileArr[x][y].number == todo.number ){
								var newTodo = Board.tileTodo.add(x, y, ex, ey);
								newTodo.number *= 2;
								newTodo.isRemove = true;
								
							//숫자가 다른 경우 && 가장 오른쪽이 아닌 경우
							}else if(x != tileRowCnt-1){
								Board.tileTodo.add(x, y, ex+1, ey);
							}
							break;
						}
						
						ex--;
					}
						
					Board.tileTodo.todo();
					
				}
			}
			
		},
		toUp: function(){
			
			if(Board.isTileMoving){
				return;
			}
			
			for(var x=0; x<Board.tileRowCnt; x++){
				for(var y=0; y<Board.tileRowCnt; y++){
					//타일이 존재 한다면
					if(Board.tileArr[x][y] != null){
						//위쪽이 벽이 아니고, 바로 위쪽에 타일이 없는 경우
						if( y != 0 && !Board.existUpTile(x,y) ){
							
							var ex = x;
							var ey = y-1;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ey == 0 || Board.existUpTile(ex,ey) ){
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
			
			if(Board.isTileMoving){
				return;
			}
			
			for(var x=Board.tileRowCnt-1; -1<x; x--){
				for(var y=0; y<Board.tileRowCnt; y++){
					//타일이 존재 한다면
					if(Board.tileArr[x][y] != null){
						//오른쪽이 벽이 아니고, 바로 오른쪽에 타일이 없는 경우
						if( x != Board.tileRowCnt-1 && !Board.existRightTile(x,y) ){
							
							var ex = x+1;
							var ey = y;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ex == Board.tileRowCnt-1 || Board.existRightTile(ex,ey) ){
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
			
			if(Board.isTileMoving){
				return;
			}
			
			for(var x=0; x<Board.tileRowCnt; x++){
				for(var y=Board.tileRowCnt-1; -1<y; y--){
					//타일이 존재 한다면
					if(Board.tileArr[x][y] != null){
						//아래쪽 벽이 아니고, 바로 아래쪽에 타일이 없는 경우
						if( y != Board.tileRowCnt-1 && !Board.existDownTile(x,y) ){
							
							var ex = x;
							var ey = y+1;
							
							//이동할 곳을 좌표 지정
							while(true){
								if( ey == Board.tileRowCnt-1 || Board.existDownTile(ex,ey) ){
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
			Board.init();
			for(var i=0; i<Board.tileRowCnt; i++){
				for(var j=0; j<Board.tileRowCnt; j++){
					Board.backGroundTileArr[i][j].gx = Util.getTileGx(i);
					Board.backGroundTileArr[i][j].gy = Util.getTileGy(j);
					if(Board.tileArr[i][j] != null){
						Board.tileArr[i][j].gx = Util.getTileGx(i);
						Board.tileArr[i][j].gy = Util.getTileGy(j);
					}
				}
			}
		}
	};
	
}