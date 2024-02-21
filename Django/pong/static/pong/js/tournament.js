let haveIt = [];

function generateUniqueRandom(max = 8, min = 0) {
	let difference = max - min;
    let random = Math.random();
	random = Math.floor(random * difference);
	random = random + min;
    if(!haveIt.includes(random)) {
        haveIt.push(random);
        return random;
	}
	else {
		if (haveIt.length < max)
			return generateUniqueRandom(max);
		else
			return false;
    }
}

function applyRound() {
	const round = localStorage.getItem('round');
	const button = document.getElementById('start-round');
	if (round < 8 && round > 0) {
		const spinner = document.getElementById('round' + round);
		const matchup = document.getElementById('r' + round);
		if (button)
			button.textContent = gettext('Start Round ') + round;
		if (spinner)
			spinner.classList.remove("visually-hidden")
		if (matchup)
			matchup.classList.add('current');
	} else if (round > 7 || round < 1) {
		const matchup = document.getElementById('r8');
		const spinner = document.getElementById('round8');
		if (spinner)
			spinner.classList.remove("visually-hidden")
		if (matchup)
			matchup.classList.add('current');
		if (button) {
			button.textContent = gettext('New Tournament');
			button.onclick = function() {
				localStorage.clear();
				showSection('tournamentForm');
			}
		}
	}

}

async function getTournament(winner) {
	await showSection('tournamentDiagram');
	let round = localStorage.getItem('round');
	if (winner) {
		localStorage.setItem('winner-r' + round, winner);
		localStorage.setItem('round', ++round);
	}
	placePlayers();
	applyRound();
}

async function submitTournament() {
	localStorage.clear();

	const forms = document.querySelectorAll('input[type="text"]')
	const form = document.getElementById('tournament-form')
	let players = [];

	form.classList.add('was-validated')

	for (let i = 0; i < forms.length; i++) {
		players.push(forms[i].value);
	}

	let unique = [...new Set(players)];

	let j = 0;
	for (let i = 0; i < forms.length; i++) {
		if ( forms[i].value != unique[j++]) {
			forms[i].classList.add('is-invalid')
			forms[i].value = ''
			j--;
		} else if (forms[i].value == "" || forms[i].value.includes(" ")) {
			forms[i].classList.add('is-invalid')
			createAlert(document.getElementById('alert'), gettext('Please enter a value for Player ') + (i + 1) + '!', 'alert-danger');
			return ;
		}
	}

	if (forms.length < 8 || unique.length < 8) {
		createAlert(document.getElementById('alert'), gettext('Please enter 8 unique players!'), 'alert-danger');
		return;
	}

	let i = 0;
	let storePlayers = [];
	while (i <= 7) {
		let random = generateUniqueRandom();
		document.getElementById("player" + (i + 1)).textContent = players[random];
		storePlayers.push(players[random]);
		i++;
	}
	localStorage.setItem('players', JSON.stringify(storePlayers));
	localStorage.setItem('round', 1);
	await showSection('tournamentDiagram');
	placePlayers();
	applyRound();
	while (haveIt.length > 0)
		haveIt.pop();
}

function placePlayers() {
	const players = JSON.parse(localStorage.getItem('players'));
	const round = localStorage.getItem('round');
	if (!players || !round)  {
		window.history.back();
		return ;
	}
	let i = 0;
	while ( i < 8 ) {
		let player = document.getElementById("player" + (i + 1))
		if (player)
			player.textContent = players[i];
		if (i < round && i > 0) {
			let winner = localStorage.getItem('winner-r' + i);
			if (winner)
				document.getElementById("winner-r" + i).textContent = winner;
		}
		i++;
	}
	var round_players = {};
	var p1, p2;
	if (round > 0 && round < 5) {
		p1 = (round * 2) - 2;
		p2 = (round * 2) - 1;
	} else if (round == 5) {
		p1 = localStorage.getItem('winner-r1');
		p2 = localStorage.getItem('winner-r2');
	} else if (round == 6) {
		p1 = localStorage.getItem('winner-r3');
		p2 = localStorage.getItem('winner-r4');
	} else if (round == 7) {
		p1 = localStorage.getItem('winner-r5');
		p2 = localStorage.getItem('winner-r6');
	} else if (round == 8) {
		p1 = localStorage.getItem('winner-r7');
	}

	if (round < 5 && round > 0) {
		round_players = {
			"player1": players[p1],
			"player2": players[p2]
		};
	} else if (round < 9 && round > 4) {
		round_players = {
			"player1": p1,
			"player2": p2
		};
	}

	localStorage.setItem("r" + round + "players", JSON.stringify(round_players));
}

document.addEventListener('DOMContentLoaded', function(event) {
	if (window.location.pathname == '/tournamentDiagram') {
		placePlayers();
		applyRound();
	}
})

