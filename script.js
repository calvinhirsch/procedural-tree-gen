var canvas = document.getElementById('canv');
canvas.width = $(window).width();
canvas.height = $(window).height();

var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

var sprouts = [];
var leaves = [];
var currentPress = undefined;

const BRANCHMAXANGLE = Math.PI / 8;
const BRANCHLENGTH = 25;
const BRANCHINITWEIGHT = 1.2;
const BRANCHMAXWEIGHT = 10;
const BRANCHDEFAULTOPACITY = 0.35;

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

canvas.onmousedown = function(evt) {
	currentPress = getMousePos(canvas, evt);
	sprouts.push({
		x: currentPress.x,
		y: currentPress.y,
		branches: [newBranch(currentPress.x, currentPress.y, 3 * Math.PI / 2)]
	});
}

canvas.onmouseup = function(evt) {
	addLeaves();
	currentPress = undefined;
}

function boundAngle(angle) {
	while (angle < 0) {
		angle += 2 * Math.PI;
	}
	while (angle >= 2 * Math.PI) {
		angle -= 2 * Math.PI;
	}
	return angle;
}

function getAngle(dx, dy) {
	return boundAngle(Math.atan2(dy, dx));
}

function getCoords(xi, yi, angle, mag) {
	angle = boundAngle(angle);
	return {x: xi + mag * Math.cos(angle), y: yi + mag * Math.sin(angle)};
}

function newBranch(xi, yi, anglei) {
	var angle = boundAngle(anglei + Math.random() * BRANCHMAXANGLE * 2 - BRANCHMAXANGLE);
	var coords2 = getCoords(xi, yi, angle, BRANCHLENGTH);
	return [[xi, yi], [coords2.x, coords2.y]];
}

function drawBranches(branches) {
	for (bi in branches) {
		var b = branches[bi];
		for (var i = 1; i < b.length; i++) {
			var weight = (b.length - i) * 0.33 + BRANCHINITWEIGHT;
			context.beginPath();
			context.strokeStyle = 'rgba(0,0,0,' + (BRANCHDEFAULTOPACITY + weight / BRANCHMAXWEIGHT * (1 - BRANCHDEFAULTOPACITY)) + ')';
			context.lineWidth = weight;
			context.moveTo(b[i - 1][0], b[i - 1][1]);
			context.lineTo(b[i][0], b[i][1]);
			context.stroke();
		}
	}
}

function drawLeaves() {
	for (li in leaves) {
		var l = leaves[li];
		context.beginPath();
		context.arc(l[0], l[1], 3, 0, 2 * Math.PI, false);
		context.fillStyle = 'green';
		context.fill();
	}
}

function update() {
	if (currentPress != undefined) {
		var sprout = sprouts[sprouts.length - 1];
		for (bi in sprout.branches) {
			var b = sprout.branches[bi];
			// Chance of adding branch to end
			if (Math.random() > 0.7) {
				var i = b.length - 1;
				var currAngle = getAngle(b[i][0] - b[i - 1][0], b[i][1] - b[i - 1][1]);
				for (var k = 0; k < 15; k++) {
					var newAngle = boundAngle(currAngle + Math.random() * BRANCHMAXANGLE * 2 - BRANCHMAXANGLE);
					var coords = getCoords(b[i][0], b[i][1], newAngle, BRANCHLENGTH);
					if (coords.y < sprout.y) {
						sprout.branches[bi].push([coords.x, coords.y]);
						break;
					}
				}
			}
			
			// Chance of adding branch to middle
			if (Math.random() * 100 + (b.length * 0.5) > 92) {
				var i = Math.floor(Math.random() * (b.length - 1) + 1);
				var currAngle = getAngle(b[i][0] - b[i - 1][0], b[i][1] - b[i - 1][1]);
				for (var k = 0; k < 15; k++) {
					var branch = newBranch(b[i][0], b[i][1], currAngle);
					if (branch[1][1] < sprout.y) {
						sprout.branches.push(branch);
						break;
					}
				}
			}
		}
		
		if (Math.random() > 0.99) {
			sprout.branches.push(newBranch(sprout.x, sprout.y, 3 * Math.PI / 2));
		}
	}
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (s in sprouts) {
		if (sprouts[s].branches != undefined) {
			drawBranches(sprouts[s].branches);
		}
	}
	
}

function addLeaves() {
	var sprout = sprouts[sprouts.length - 1];
	for (bi in sprout.branches) {
		var b = sprout.branches[bi];
		var s = b[b.length - 1];
		leaves.push([s[0], s[1]]);
	}
}

$(document).on("keypress", function (e) {
    e = e || window.event;
    if (e.keyCode == 122) {
		var numLeaves = sprouts[sprouts.length - 1].branches.length;
		leaves.splice(leaves.length - numLeaves, numLeaves);
		sprouts.splice(sprouts.length - 1, 1);
	}
});

setInterval(update, 50);