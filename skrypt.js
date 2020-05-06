let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let punkty =
[
	[0, 0, 64, "#FFF0", "strona-glowna"],
	[-141, -171, 32, "#FFF0", "elektronika"],
	[219, -22, 32, "#FFF0", "druk-3d"],
	[-90, 203, 36, "#FFF0", "robotyka"],

	[-205, -254, 32, "#FFF", "Na czym polega druk 3D?"],
	[-240, -161, 32, "#FFF", "Rodzaje drukarek"],
	[-99, -265, 32, "#FFF", "Filamenty"],

	[255, -119, 32, "#FFF", "Na czym polega druk 3D?"],
	[323, -30, 32, "#FFF", "Rodzaje drukarek"],
	[280, 56, 32, "#FFF", "Filamenty"],

	[-193, 212, 32, "#FFF", "Na czym polega druk 3D?"],
	[-28, 281, 32, "#FFF", "Rodzaje drukarek"],
	[-142, 301, 32, "#FFF", "Filamenty"]
];
let polaczenia =
[	
	[0, 1, "#FFF", 100],
	[0, 2, "#FFF", 100],
	[0, 3, "#FFF", 100],
	
	[1, 4, "#FFF",  50],
	[1, 5, "#FFF",  50],
	[1, 6, "#FFF",  50],
	
	[2, 7, "#FFF",  50],
	[2, 8, "#FFF",  50],
	[2, 9, "#FFF",  50],
	
	[3, 10, "#FFF",  50],
	[3, 11, "#FFF",  50],
	[3, 12, "#FFF",  50]
];
let nieruchome =
[
	0
];
let sily = [];
let przesuwanyPunkt = -1;
let stalaPrzyciagania = 0.01;
let stalaOdpychania = -2;
let odbijalnoscScian = 10;
let odlegloscPolaczen = 150;
let oporOtoczenia = 0.1;

let fps = 0;

function dopasujRozmiar()
{
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	ctx.strokeStyle = "#FFF";
	ctx.fillStyle = "#FFF";

	rysuj();
}
dopasujRozmiar();

for (let i in punkty)
{
	var newImg = new Image;
	
	newImg.onload = function()
	{
		punkty[i][5] = this;
	}
	newImg.src = 'img/'+ punkty[i][4] +'.png';
}

function przyciaganie()
{

	for (let i in punkty)
	{
		if (sily[i] === undefined)
		{
			sily[i] = [];
			sily[i][0] = 0;
			sily[i][1] = 0;
		}

		for (let j in punkty)
		{
			if (i == j)
				continue;

			let x = punkty[i][0] - punkty[j][0];
			let y = punkty[i][1] - punkty[j][1];

			if (x == 0 && y == 0)
			{
				sily[i][0] += Math.random() * 2 - 1;
				sily[i][1] += Math.random() * 2 - 1;
				continue;
			}

			let sila = (stalaOdpychania * Math.pow(punkty[j][2], 3)) / (Math.pow(x, 2) + Math.pow(y, 2));

			if (x == 0)
			{
				if (y > 0)
					sily[i][1] -= sila;
				else
					sily[i][1] += sila;
			}
			else if (y == 0)
			{
				if (x > 0)
					sily[i][0] -= sila;
				else
					sily[i][0] += sila;
			}
			else
			{
				let sx = Math.sqrt(1 / (Math.pow(y / x, 2) + 1));
				let sy = Math.sqrt(1 / (Math.pow(x / y, 2) + 1));

				if (x > 0)
					sily[i][0] -= sila * sx;
				else
					sily[i][0] += sila * sx;

					if (y > 0)
						sily[i][1] -= sila * sy;
					else
						sily[i][1] += sila * sy;
			}
		}
	}

	//Przyciąganie się połączeń

	for (let i in polaczenia)
	{
		let x = punkty[polaczenia[i][0]][0] - punkty[polaczenia[i][1]][0];
		let y = punkty[polaczenia[i][0]][1] - punkty[polaczenia[i][1]][1];

		if (x == 0 && y == 0)
			continue;

		let sila1 = punkty[polaczenia[i][0]][2] * stalaPrzyciagania * (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) - polaczenia[i][3]);
		let sila2 = punkty[polaczenia[i][1]][2] * stalaPrzyciagania * (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) - polaczenia[i][3]);

		if (x == 0)
		{
			if (y > 0)
			{
				sily[polaczenia[i][0]][1] -= sila1;
				sily[polaczenia[i][1]][1] += sila2;
			}
			else
			{
				sily[polaczenia[i][0]][1] += sila1;
				sily[polaczenia[i][1]][1] -= sila2;
			}
		}
		else if (y == 0)
		{
			if (x > 0)
			{
				sily[polaczenia[i][0]][0] -= sila1;
				sily[polaczenia[i][1]][0] += sila2;
			}
			else
			{
				sily[polaczenia[i][0]][0] += sila1;
				sily[polaczenia[i][1]][0] -= sila2;
			}
		}
		else
		{
			let sx = Math.sqrt(1 / (Math.pow(y / x, 2) + 1));
			let sy = Math.sqrt(1 / (Math.pow(x / y, 2) + 1));

			if (x > 0)
			{
				sily[polaczenia[i][0]][0] -= sila1 * sx;
				sily[polaczenia[i][1]][0] += sila2 * sx;
			}
			else
			{
				sily[polaczenia[i][0]][0] += sila1 * sx;
				sily[polaczenia[i][1]][0] -= sila2 * sx;
			}

			if (y > 0)
			{
				sily[polaczenia[i][0]][1] -= sila1 * sy;
				sily[polaczenia[i][1]][1] += sila2 * sy;
			}
			else
			{
				sily[polaczenia[i][0]][1] += sila1 * sy;
				sily[polaczenia[i][1]][1] -= sila2 * sy;
			}
		}
	}

	//Stosowanie siły wypadkowej

	for (let i in punkty)
	{
		if (sily[i][0] > 5)
			sily[i][0] = 5;
		if (sily[i][1] > 5)
			sily[i][1] = 5;

		if (sily[i][0] < -5)
			sily[i][0] = -5;
		if (sily[i][1] < -5)
			sily[i][1] = -5;

		if (i == przesuwanyPunkt || nieruchome.includes(parseInt(i)))
		{
			sily[i][0] = 0;
			sily[i][1] = 0;
			continue;
		}

		punkty[i][0] += sily[i][0] * oporOtoczenia;
		punkty[i][1] += sily[i][1] * oporOtoczenia;

		if (punkty[i][0] < - c.width / 2)
		{
			punkty[i][0] = - c.width / 2;
			sily[i][0] = - sily[i][0] * odbijalnoscScian;
		}
		if (punkty[i][1] < 0 - c.height / 2)
		{
			punkty[i][1] = - c.height / 2;
			sily[i][1] = - sily[i][1] * odbijalnoscScian;
		}

		if (punkty[i][0] > c.width / 2)
		{
			punkty[i][0] = c.width / 2;
			sily[i][0] = - sily[i][0] * odbijalnoscScian;
		}
		if (punkty[i][1] > c.height / 2)
		{
			punkty[i][1] = c.height / 2;
			sily[i][1] = - sily[i][1] * odbijalnoscScian;
		}
	}
	rysuj();
	
	fps++;
}

setInterval(przyciaganie, 20);

setInterval(() =>
{
	$(".fps").html(fps + " FPS");
	fps = 0;
}, 1000);

function rysuj()
{
	ctx.clearRect(0, 0, c.width, c.height);

	for (let i = 0; i < polaczenia.length; i++)
	{
		let grd = ctx.createLinearGradient(punkty[polaczenia[i][0]][0] + (c.width / 2), punkty[polaczenia[i][0]][1] + (c.height / 2), punkty[polaczenia[i][1]][0] + (c.width / 2), punkty[polaczenia[i][1]][1] + (c.height / 2));
		grd.addColorStop(0, polaczenia[i][2]);
		grd.addColorStop(1, polaczenia[i][2] + "4");

		ctx.lineWidth = 5;
		ctx.strokeStyle = grd;

		ctx.beginPath();
		ctx.moveTo(punkty[polaczenia[i][0]][0] + (c.width / 2), punkty[polaczenia[i][0]][1] + (c.height / 2));
		ctx.lineTo(punkty[polaczenia[i][1]][0] + (c.width / 2), punkty[polaczenia[i][1]][1] + (c.height / 2));
		ctx.stroke();
	}

	for (let i = 0; i < punkty.length; i++)
	{
		ctx.fillStyle = punkty[i][3];

		ctx.beginPath();
		ctx.arc(punkty[i][0] + (c.width / 2), punkty[i][1] + (c.height / 2), punkty[i][2], 0, 2 * Math.PI);
		ctx.fill();
		
		if (punkty[i][5])
			ctx.drawImage(punkty[i][5], punkty[i][0] + (c.width / 2) - punkty[i][2], punkty[i][1] + (c.height / 2) - punkty[i][2]);
	}
}

document.onmousedown = function(e)
{
	for (var i = 0; i < punkty.length; i++)
	{
		if(Math.abs(punkty[i][0] + (c.width / 2) - e.clientX) < punkty[i][2] && Math.abs(punkty[i][1] + (c.height / 2) - e.clientY) < punkty[i][2])
		{
			przesuwanyPunkt = i;
			break;
		}
	}
};
document.onmousemove = function(e)
{
	if (przesuwanyPunkt > -1)
	{
		punkty[przesuwanyPunkt][0] = e.clientX - (c.width / 2);
		punkty[przesuwanyPunkt][1] = e.clientY - (c.height / 2);
		rysuj();
	}
};
document.onmouseup = function(e)
{
	przesuwanyPunkt = -1;
};

window.onresize = function () { dopasujRozmiar(); };

rysuj();

function wypiszPunkty()
{
	let str = "";
	
	for (i in punkty)
	{
		str += "[" + punkty[i][0] + ", " + punkty[i][1] + ", " + punkty[i][2] + ", \"" + punkty[i][3] + "\", \"" + punkty[i][4] + "\"]\n";
	}
	console.log(str);
}
