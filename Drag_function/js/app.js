
//setting
const
eleLeft = v => $(v).offset().left,
eleTop = v => $(v).offset().top;

let
target = { me:null, x:0, y:0, center:{x:0, y:0},test:0 },
list = { arr:[], left:eleLeft(".list") },
box = { left:eleLeft(".box_list"), top:eleTop(".box_list") },
check = { first:0, location:0, out:0, isUpDown:0, isDown:false },
other = {windowScroll:0,compare:[]};

function certainPartUp(e) {
	if(e != target.me.index()){
		$(`.list:nth-child(${e+1})`).css({transform:`translate(0px,0px)`});
	}
}

function certainPartDown(e) {
	if(e != target.me.index()){
		$(`.list:nth-child(${e+1})`).css({transform:`translate(0px,${target.me.height() + 28}px)`});
	}
}

function certainPartIn(e) {
	Array.from($(".list")).filter((v,idx) => {
		if(idx >= e && target.me.index() != idx){
			$(v).css({transform:`translate(0px,${target.me.height() + 28}px)`});
		}
	});
}

function certainPartOut(e) {
	Array.from($(".list")).filter((v,idx) => {
		if(idx >= e && target.me.index() != idx){
			$(v).css({transform:"translate(0px,0px)"});
		}
	});
}

function locationCheck() {
	Array.from($(".list")).filter((v,idx) => {
		if((target.center.x + (target.me.width() / 2) ) > list.left && (target.center.x + (target.me.width() / 2) ) < (list.left + 250) && (target.center.y+(target.me.height()/ 2)) > (list.arr[11].top + 8) ){
			check.location = 13;
			return true;
		}else if(idx == target.me.index() && (target.center.x + (target.me.width() / 2) ) > list.left && (target.center.x + (target.me.width() / 2) ) < (list.left + 250) && (target.center.y+(target.me.height()/ 2) ) > target.me.y && (target.center.y + (target.me.height() / 2) ) < (target.me.y + $(v).height()+36)){
			check.location = idx;
			return true;

		}else if((target.center.x + (target.me.width() / 2) ) > list.left && (target.center.x + (target.me.width() / 2) ) < (list.left + 250) &&
			(target.center.y+(target.me.height()/ 2) ) > (eleTop($(v))) && (target.center.y + (target.me.height() / 2) ) < (eleTop($(v)) + $(v).height()+28)){
			return check.location = idx;
		}
	});
	return check.location;
}

function inOutChk() { // 밖인지 안인지 체크
	if((target.center.x + (target.me.width() / 2) ) > list.left && (target.center.x + (target.me.width() / 2) ) < (list.left + 250) &&
		(target.center.y + (target.me.height() / 2) ) > box.top && (target.center.y + (target.me.height() / 2) ) < (box.top + 1248))
		return false;
	else 
		return true;
}

function mouseDown(e) {//마우스 다운시
	if(target.me == null) {
		check.isDown = true;
		target.me = $(this);
		target.x = eleLeft(target.me);
		target.y = eleTop(target.me);
		target.me.css({position:"fixed",zIndex:"9999"});
		target.me.css({top:list.arr[target.me.index()].top, left:list.left});
		Array.from($(".list")).forEach((v,idx) => {
			if(idx > target.me.index())
				$(v).css({transform:`translate(0px,${target.me.height() + 28}px)`});
		});
	}
}

function mouseMove(e) {
	if(check.isDown){//마우스 클릭시에만
		target.center.x = e.pageX - (target.me.width() / 2);
		target.center.y = e.pageY - (target.me.height() / 2);
		target.me.css({transform:`translate(${(target.center.x - target.x) - $(window).scrollLeft()}px,
			${target.center.y - target.y - $(window).scrollTop()}px)`});

		if(check.first == 0){
			Array.from($(".list")).forEach((v,idx) => {
				if(idx != target.me.index())
					$(v).css({transition:"0.2s ease-out"});
			});
			check.first = 1;
		}

		if(inOutChk()) { // true = 밖
			check.out = 1;
			certainPartOut(locationCheck());
			$(".box_list").css({background:"#e6fcff"});

		}else {// false = 안
			if(check.out == 1){
				certainPartIn(locationCheck());
				check.out = 0;
			}
			if(locationCheck() != target.me.index() )
				target.test = locationCheck();
			console.log(locationCheck()," move");

			if((target.center.y + (target.me.height() / 2) ) < check.isUpDown) { // up
				certainPartDown(locationCheck());
			}else if((target.center.y + (target.me.height() / 2) ) > check.isUpDown) { // down
				certainPartUp(locationCheck());
			}

			$(".box_list").css({background:"#ffebe6"});
		}

		check.isUpDown = (target.center.y + (target.me.height() / 2) );
	}
}

function mouseUp(e) {//마우스 업 했을때 
	if(target.me != null){
		if(inOutChk()) {
			$(".list").css({position:"relative",top:0,left:0,transform:"translate(0px,0px)",zIndex:"0",transition:"none"});
		}else {
			console.log(locationCheck());
			if(target.test == target.me.index()){
				$(`.list:not(.list:nth-child(${target.me.index()}))`).css({position:"relative",top:0,left:0,transform:"translate(0px,0px)",zIndex:"0",transition:"none"});
				// target.me.css({transition:"0.3s ease-out"}).css({position:"relative",transform:"translate(0px,0px)"});
				target.me.css({"transition":"0.3s ease-out",position:"relative"});
			}else {
				target.me.css({transition:"0.15s ease-out"}).css({position:"absolute",
					transform:`translate(0px,${eleTop(`.list:nth-child(${target.test + 1})`) + $(`.list:nth-child(${target.test + 1})`).height() + 20}px)`});
			}

		}

		$(".box_list").css({background:"#ebecf0"});
		check.first = 0;
		check.isDown = false;
		target.me = null;

	}
}

function eve() {
	$(window).on("resize",function() {
		box.left = eleLeft(".box_list");
		list.left = eleLeft(".list");
	});
	$(document)
	.on("mousedown","a",mouseDown )
	.on("mousemove",mouseMove.bind(this) )
	.on("mouseup",mouseUp.bind(this) )
	.on("scroll",function() {
		other.windowScroll = $(window).scrollTop();
	})
}

function load() {
	Array.from($(".list")).forEach((v,idx) => list.arr.push({top:eleTop(v),idx:idx}) );
	console.log(list.arr);
}

eve();
load();