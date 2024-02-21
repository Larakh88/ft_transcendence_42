let mgameState = 'start';
let mpaddle_1, mpaddle_2, mpaddle_3, minitial_ball, mball, mscore_1, mscore_2, mscore_3, mmessage, mpaddle_common;
let mpaddle_1_coord, mpaddle_2_coord, mpaddle_3_coord, minitial_ball_coord, mball_coord, mboard_coord;

let mdirection;
let minitial_velocity = 10;
let mvelocity_increase = 1;
let mpaddle_translate = 16;
let mscore = '0';
let malias1, malias2, malias3, mwinner;

let mkeyState = {};

async function goToMGame() {
	malias1 = document.getElementById('multiplayer1').value;
	malias2 = document.getElementById('multiplayer2').value;
	malias3 = document.getElementById('multiplayer3').value;
	const notiAlert = document.getElementById('select-alert-container');
	if (malias1.trim() === '' || malias2.trim() === '' || malias3.trim() === '') {
		createAlert(notiAlert, gettext('Please enter all aliases'), 'alert-danger');
		return;
	}
	if (malias1.length > 10 || malias2.length > 10 || malias3.length > 10) {
		createAlert(notiAlert, gettext('Alias cannot be more than 10 characters!'), 'alert-danger');
		return;
	}
	if (!isPrintableASCII(malias1) || !isPrintableASCII(malias2) || !isPrintableASCII(malias3)) {
		createAlert(notiAlert, gettext('Alias cannot contain spaces!'), 'alert-danger');
		return;
	}
	if (malias1 === malias2 || malias1 === malias3 || malias2 === malias3) {
		createAlert(notiAlert, gettext('Aliases cannot be identical!'), 'alert-danger');
		return;
	}

    await showSection('multiGame');

    document.getElementById('mplayer_1_alias').textContent = malias1;
	document.getElementById('mplayer_2_alias').textContent = malias2;
	document.getElementById('mplayer_3_alias').textContent = malias3;
}

function isPrintableASCII(str) {
    var printableASCIIRegex = /^[!-~]+$/;
    return printableASCIIRegex.test(str);
}


function mstartgame() {
	document.getElementById('mstartgame').hidden = true;
    document.getElementById('mstartgame').disabled = true;
    document.getElementById('mgrow').style.display = 'none';
    const instr = document.getElementsByClassName('instructions');
    Array.from(instr).forEach(element => element.style.display = 'none');
    mpaddle_1 = document.getElementById('mpaddle_1');
    mpaddle_2 = document.getElementById('mpaddle_2');
	mpaddle_3 = document.getElementById('mpaddle_3');
    minitial_ball = document.getElementById('mball');
    mball = document.getElementById('mball');
    mscore_1 = document.getElementById('mplayer_1_score');
    mscore_2 = document.getElementById('mplayer_2_score');
	mscore_3 = document.getElementById('mplayer_3_score');
    mmessage = document.getElementById('mgame_message');
    mpaddle_common = document.querySelector('.mpaddle').getBoundingClientRect();

    mgameState = 'play';
    mstartballmovement();
}

document.addEventListener('keydown', function (e) {
    mkeyState[e.key] = true;
});

document.addEventListener('keyup', function (e) {
    mkeyState[e.key] = false;
});

function mstartballmovement() {
    if (mgameState === 'play') {
        requestAnimationFrame(() => {
            mball.style = minitial_ball.style;
            var x = 0;
            var y = 0;
            velocity = minitial_velocity;
            while (Math.abs(x) <= 0.3 || Math.abs(x) >= 0.95) {
                mdirection = getRandomInt(0, 2 * Math.PI);
                x = Math.cos(mdirection);
                y = Math.sin(mdirection);
            }
            minitializeCoordinates();
            mmoveBall(x, y);
        });
    }
}

function minitializeCoordinates() {
    mpaddle_1_coord = mpaddle_1.getBoundingClientRect();
    mpaddle_2_coord = mpaddle_2.getBoundingClientRect();
	mpaddle_3_coord = mpaddle_3.getBoundingClientRect();
    minitial_ball_coord = mball.getBoundingClientRect();
    mball_coord = minitial_ball_coord;
    mboard_coord = document.getElementById('mboard').getBoundingClientRect();
}

function mcalculateBallMove(x, y) {
    const translateX = x * velocity;
    const translateY = y * velocity;

    const existingTransform = mball.style.transform;

    const existingTranslate = existingTransform.match(/translate\((.*?)\)/);
    const existingTranslateX = existingTranslate ? parseFloat(existingTranslate[1].split(',')[0]) : 0;
    const existingTranslateY = existingTranslate ? parseFloat(existingTranslate[1].split(',')[1]) : 0;

    const newTranslateX = existingTranslateX + translateX;
    const newTranslateY = existingTranslateY + translateY;

    mball.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;

    mball_coord = mball.getBoundingClientRect();
    requestAnimationFrame(() => {
        mmoveBall(x, y);
    });
}

function mmoveBall(x, y) {
    const futureBallCoord = {
        top: mball_coord.top + y * velocity,
        bottom: mball_coord.bottom + y * velocity,
        left: mball_coord.left + x * velocity,
        right: mball_coord.right + x * velocity,
        height: mball_coord.height,
    };

    if (futureBallCoord.top <= mboard_coord.top)
        y *= -1;
    if (misCollision(mpaddle_1_coord, futureBallCoord)) {
        x = 1;
        velocity += mvelocity_increase;
    } else if (misCollision(mpaddle_2_coord, futureBallCoord)) {
        x = -1;
        velocity += mvelocity_increase;
    }
	else if (misCollision(mpaddle_3_coord, futureBallCoord)) {
		y = -1;
		velocity += mvelocity_increase;
	}
    if (futureBallCoord.left <= mboard_coord.left || futureBallCoord.right >= mboard_coord.right || futureBallCoord.bottom >= mboard_coord.bottom) { //went outside
        if (futureBallCoord.left <= mboard_coord.left)
            mscore_1.innerHTML = +mscore_1.innerHTML - 1;
        else if (futureBallCoord.right >= mboard_coord.right)
            mscore_2.innerHTML = +mscore_2.innerHTML - 1;
		else
			mscore_3.innerHTML = +mscore_3.innerHTML - 1;
        mball_coord = minitial_ball_coord;
        mball.style.display = 'none';
        if (mscore_2.innerHTML === mscore || mscore_1.innerHTML === mscore || mscore_3.innerHTML === mscore)
            mendGame();
        else {
            sleep(2000).then(() => {
                mstartballmovement();
            });
        }
        return;
    }
    mcalculateBallMove(x, y);
}

function misCollision(paddle, thisBall) {
    return (
        paddle.left <= thisBall.right &&
        paddle.right >= thisBall.left &&
        paddle.top <= thisBall.bottom &&
        paddle.bottom >= thisBall.top
    );
}

function mendGame() {
    const score1 = parseInt(mscore_1.innerHTML);
    const score2 = parseInt(mscore_2.innerHTML);
    const score3 = parseInt(mscore_3.innerHTML);

	const highestScore = Math.max(score1, score2, score3);
	if (score1 === highestScore && score2 !== highestScore && score3 !== highestScore) {
        mwinner = malias1;
    } else if (score2 === highestScore && score1 !== highestScore && score3 !== highestScore) {
        mwinner = malias2;
    } else if (score3 === highestScore && score1 !== highestScore && score2 !== highestScore) {
        mwinner = malias3;
    } else {
        mwinner = "Tie";
    }

    text = gettext('Game Over!<br>') + (mwinner === gettext("Tie") ? gettext("It's a Tie") : mwinner + gettext(' Wins'));
    mmessage.innerHTML = text;
    document.getElementById('mrestart').classList.remove('d-none');
    mgameState = 'start';
}


function mmovePaddle() {
    if (mgameState === 'play') {
        if (mkeyState['q'] || mkeyState['Q']) 
            mmovePaddle1Up();
        if (mkeyState['a'] || mkeyState['A']) 
            mmovePaddle1Down();
        if (mkeyState['p'] || mkeyState['P']) 
            mmovePaddle2Up();
        if (mkeyState["l"] || mkeyState['L']) 
            mmovePaddle2Down();
		if (mkeyState['b'] || mkeyState['B']) 
            mmovePaddle3Right();
        if (mkeyState["v"] || mkeyState['V']) 
            mmovePaddle3Left();
		

        mpaddle_1_coord = mpaddle_1.getBoundingClientRect();
        mpaddle_2_coord = mpaddle_2.getBoundingClientRect();
		mpaddle_3_coord = mpaddle_3.getBoundingClientRect();
    }
    requestAnimationFrame(mmovePaddle);
}

function mmovePaddle1Up() {
    const newTop1 = Math.max(0, mpaddle_1.offsetTop - mpaddle_translate);
    mpaddle_1.style.top = `${newTop1}px`;
}

function mmovePaddle1Down() {
    const newTop1 = Math.min(mboard_coord.height - mpaddle_1_coord.height - 2, mpaddle_1.offsetTop + mpaddle_translate);
    mpaddle_1.style.top = `${newTop1}px`;
}

function mmovePaddle2Up() {
    const newTop2 = Math.max(0, mpaddle_2.offsetTop - mpaddle_translate);
    mpaddle_2.style.top = `${newTop2}px`;
}

function mmovePaddle2Down() {
    const newTop2 = Math.min(mboard_coord.height - mpaddle_2_coord.height - 2, mpaddle_2.offsetTop + mpaddle_translate);
    mpaddle_2.style.top = `${newTop2}px`;
}

function mmovePaddle3Right() {
	const newLeft = Math.min(mboard_coord.width - mpaddle_3_coord.width, mpaddle_3.offsetLeft + mpaddle_translate );
	mpaddle_3.style.left = `${newLeft}px`;
}

function mmovePaddle3Left() {
	const newLeft = Math.max(0, mpaddle_3.offsetLeft - mpaddle_translate );
	mpaddle_3.style.left = `${newLeft}px`;
}

requestAnimationFrame(mmovePaddle);
