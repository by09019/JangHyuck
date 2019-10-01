
//setting
const
eleLeft = v => $(v).offset().left,
eleTop = v => $(v).offset().top;

let
centerX = 0,
centerY = 0,
target = { me:null, x:0, y:0, center:{x:0, y:0},test:0,left:0,top:0 },
list = { arr:[], left:eleLeft(".list"),heightArr:[] },
box = { left:eleLeft(".box_list"), top:eleTop(".box_list") },
check = { first:0, out:0, isDown:false },
other = {windowScroll:0,nowChk:0,ntcx:0,ntcy:0,moveIdx:0};

function OriginalPlace() {// 밖에서 mouseup 시 원래 자리로
	$(`.list:not(.list:nth-child(${target.me.index() + 1}))`).css({position:"relative",top:0,left:0,transform:"translate(0px,0px)",zIndex:"0",transition:"none"});
	target.me.css({transition:"0.1s ease-out"}).css({transform:"translate(0px,0px)"});
	setTimeout(function() { target.me.css({transition:"none",position:"relative",left:0,top:0}); },100.1);
}

function certainPart(e = 0,txt = "in") {//태그 위치 변경
	if(txt == "out"){
		$(`.list:not(.list:nth-child(${target.me.index()+1}))`).css({transform:`translate(0px,0px`});
	}else if(txt == "in") {
		if(check.out == 1){ //처음 들어올시
			Array.from($(".list")).filter((v,idx) => {
				if(idx >= e && target.me.index() != idx){
					$(v).css({transform:`translate(0px,${target.me.height() + 28}px)`});
				}
			});
			check.out = 0;
		}else{
			Array.from($(".list")).filter((v,idx) => {
				if(idx > e && target.me.index() != idx){
					$(v).css({transform:`translate(0px,${target.me.height() + 28}px)`});
				}else if(target.me.index() != idx && idx <= e){
					$(v).css({transform:`translate(0px,0px`});
				}
			});
		}
	}
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
		target.me.left = target.me.offset().left;
		target.me.top = target.me.offset().top;
		target.x = eleLeft(target.me);
		target.y = eleTop(target.me);
		target.me.css({position:"fixed",zIndex:"9999"});
		target.me.css({top:list.arr[target.me.index()].top, left:list.left});
		other.nowChk = target.me.index();
		other.moveIdx = target.me.index();
		Array.from($(".list")).forEach((v,idx) => {
			if(idx > target.me.index()){
				$(v).addClass("hov");
				$(v).css({transform:`translate(0px,${target.me.height() + 28}px)`});
			}
		});
	}
}

function mouseMove(e) {
	if(check.isDown){//마우스 클릭시에만
		target.center.x = e.pageX - (target.me.width() / 2);
		target.center.y = e.pageY - (target.me.height() / 2);
		centerX = (eleLeft(target.me) + (target.me.width() / 2) );
		centerY = (eleTop(target.me) + (target.me.height() / 2) );
		target.me.css({transform:`translate(${(target.center.x - target.x) - $(window).scrollLeft()}px,
			${target.center.y - target.y - $(window).scrollTop()}px)`});

		if(check.first == 0){
			$(`.list:not(.list:nth-child(${target.me.index() + 1}))`).css({transition:"0.15s ease-out"});
			check.first = 1;
		}

		if(inOutChk()) { // true = 밖
			check.out = 1;
			certainPart(0,"out");
			$(".box_list").css({background:"#e6fcff"});

		}else {// false = 안
			Array.from($(".list")).forEach((v,idx) => {
				// if(centerX > list.left && centerX < (list.left + $(v).width()) &&
				// 	centerY > list.arr[idx].top && centerY < (list.arr[idx].top + list.arr[idx].height + 28) ){
				// 	if(other.moveIdx != idx){
				// 		other.nowChk = certainPart(idx);
				// 		setTimeout(function(){
				// 			list.arr[idx].height = $(v).height();
				// 			console.log(list.arr[idx].height);
				// 		},150.1);
				// 		other.moveIdx = idx;
				// 		// console.log(idx);
				// 		return certainPart(idx);
				// 	}
				// }

				if(centerX > list.left && centerX < (list.left + $(v).width()) &&
					eleTop(target.me) >= (eleTop(v) + ($(v).height() / 2)) ||
					(eleTop(target.me) + target.me.height()) >= (eleTop(v) + ($(v).height() / 2))  ){
					if(other.moveIdx != idx){
						other.moveIdx = idx;
						return certainPart(idx);
					}
				}
			});
			$(".box_list").css({background:"#ffebe6"});
		}

	}
}

function mouseUp(e) {//마우스 업 했을때 
	if(target.me != null){
		if(target.center.x != 0) $(this).bind('click',false); 

		if(inOutChk()) {
			OriginalPlace();
		}else {
			if(other.moveIdx == target.me.index()){
				OriginalPlace();
			}else{
				target.me.insertAfter(`.list:nth-child(${other.moveIdx + 1})`);
				setTimeout(function() {
					target.me.css({transition:"0.1s ease-out"}).css({top:0,transform:`translate(0px,${(eleTop(`.list:nth-child(${other.moveIdx +1})`) + $(`.list:nth-child(${other.moveIdx +1})`).height() + 28 - other.windowScroll )}px)`});
				},150.1);
			}
		}
		check.isDown = false;
		setTimeout(function() {
			check.first = 0;
			target.me = null;
			$(".box_list").css({background:"#ebecf0"});
			$(".list").css({transition:"none",position:"relative",left:0,top:0,transform:"translate(0px,0px)",zIndex:0}).removeClass("hov");
		},150.21);
	}
}

function eve() {
	setTimeout( _ => $(window).scrollTop(0) ,0.01);
	$(window).on("resize",function() {
		box.left = eleLeft(".box_list");
		list.left = eleLeft(".list");
	});
	$(document)
	.on("mousedown","a",mouseDown )
	.on("mousemove",mouseMove.bind(this) )
	.on("mouseup",mouseUp.bind(this) )
	.on("scroll",_ => other.windowScroll = $(window).scrollTop() )
}

function load() {
	Array.from($(".list")).forEach((v,idx) => {
		list.arr.push({top:eleTop(v),idx:idx,height:($(v).height() + 20)});
		$(v).find(".test").css({width:"100%",height:"1px",position:"absolute",top:($(v).height() / 2),background:"black",left:0 });
	} );
}
eve();
load();