
async function showSection(section) {
	var flag = 0;
  gameState = "start";
  mgameState = "start";
	if (window.location.pathname.includes('profile')) {
		flag = 1;
		history.pushState({}, "", '/' + section);
  	}
  if (section == 'game' || section == 'multiGame') {
    flag = 1;
    window.history.pushState({}, "", window.location.pathname);
  }
	var request = section;
	await fetch(request, {
		method: 'GET',
		headers: {
		'X-Custom-Header': 'self'
		}
	})
	.then(response => response.text())
	.then(text => {
		if (section == 'logout') {
		document.getElementById('nav').innerHTML = '';
		}
		document.getElementById('app').innerHTML = text;
    if (section == 'game' && window.location.href.includes('tournament'))
      document.getElementById('startgame').onclick = function() {startgame('tournament')};
	});
	if (flag === 1) {
		return;
  	}
	window.history.pushState({}, "", section);
}

async function getSection(section) {
  await fetch(section, {
    method: 'GET',
    headers: {
      'X-Custom-Header': 'self'
    }
  })
  .then(response => response.text())
  .then(text => {
    document.getElementById('app').innerHTML = text;
  });
  if (section == '/tournamentDiagram') {
    placePlayers();
    applyRound();
  }
}

async function popStateHome(section) {
  await fetch(section, {
    method: 'GET',
    headers: {
      'X-Custom-Header': 'pop'
    }
  })
  .then(response => response.json())
  .then(json => {
    document.getElementById('app').innerHTML = json.app;
    document.getElementById('nav').innerHTML = json.nav;
  });
}

window.addEventListener('popstate', () => {
  if (window.location.pathname == '/' || window.location.pathname == '/logout' ) {
    document.getElementById('nav').innerHTML = '';
  }
  if (window.location.pathname == '/home') {
    popStateHome("/home")
  }
  getSection(`${window.location.pathname}`);
});


