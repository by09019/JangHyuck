
const
ctx = $("#myCvs").get(0).getContext("2d"),
app = class {

	constructor() {
		let xCnt = 1, yCnt = 1;
		// this.arr = Array(40).fill(null).map((i,x) => Array(80).fill(null).map((j, y) => { j = {x:(y * 15), y:(x * 15)} }));
		this.arr = Array.from(Array(40), (i, x) => Array.from(Array(80), (j, y) => j = {x:(y * 15), y:(x * 15)} ));
		this.arr.forEach((i, x) =>{
			$(".yBox").append(`<span>${yCnt++}</span>`);
			if(x === 0) i.forEach(j => $(".xBox").append(`<span>${xCnt++}</span>`));
		})
		$.getJSON('plan.json', json => {	
			this.drawImage();		
			this.drawImage(json.road1);		
			this.drawImage(json.road2);		
			this.drawImage(json.road3);		
			this.create();

			$.each(json.color, function(index, val) {
				$("#color").append(`<option value="${val}">${index}</option>`);
			});
			$(".boxColor").css({background:$("#color").val()});

			$(document)
			.on("click", "img" ,function(e) {
				let imgClo = new Image();

				imgClo.src= $(this).attr("src");
				ctx.clearRect(0,0,1200,600);
				ctx.drawImage( imgClo , 0, 0, 1200, 600);
			})
			.on("change", "#color", function() {
				$(".boxColor").css({background:$(this).val()});
			})

		}); 
	}

	drawImage(tg = "") {
		this.create(ctx);
		if(tg !== "") {
			tg.forEach(v => {
				let chk = this.arr[(v[1] - 1)][(v[0] - 1)];
				ctx.fillStyle = "black";
				ctx.beginPath();
				ctx.rect(chk.x, chk.y, 15, 15);
				ctx.stroke();
				ctx.fill();

				ctx.closePath();
			})
		}

		let img = new Image();
		img.src = $("#myCvs").get(0).toDataURL();
		$(".type").append(`<img src='${img.src}' width="250px;" height="150px" />`);
		ctx.clearRect(0,0,1200,600);
	}

	create() {
		this.arr.map((i,x) => {
			i.map((j,y) => {
				ctx.lineWidth = 1;
				ctx.strokeStyle = "gray";
				ctx.beginPath();
				ctx.rect(j.x, j.y, 15, 15);
				ctx.stroke();
				ctx.closePath();
			})
		});
	}
}

window.onload = _ => { new app(); }