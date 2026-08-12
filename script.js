// --- LÓGICA DO PLACAR ---
let scoreA = 0;
let scoreB = 0;

function changeScore(team, value) {
    if (team === 'A') {
        scoreA = Math.max(0, scoreA + value); // Impede placar negativo
        document.getElementById('scoreA').innerText = scoreA;
    } else if (team === 'B') {
        scoreB = Math.max(0, scoreB + value);
        document.getElementById('scoreB').innerText = scoreB;
    }
}

// --- LÓGICA DO CRONÔMETRO ---
let timerInterval = null;
let totalSeconds = 0;

function toggleTimer() {
    const startBtn = document.getElementById('startBtn');
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.innerText = 'Iniciar Tempo';
    } else {
        startBtn.innerText = 'Pausar Tempo';
        timerInterval = setInterval(() => {
            totalSeconds++;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
            
            // Formatação de dois dígitos
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            
            document.getElementById('gameTimer').innerText = `${minutes}:${seconds}`;
        }, 1000);
    }
}

function resetMatch() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    scoreA = 0;
    scoreB = 0;
    document.getElementById('gameTimer').innerText = '00:00';
    document.getElementById('scoreA').innerText = '0';
    document.getElementById('scoreB').innerText = '0';
    document.getElementById('startBtn').innerText = 'Iniciar Tempo';
}

// --- LÓGICA DA PRANCHETA TÁTICA (ARRASTAR ELEMENTOS) ---
let playerCount = 0;

function addPlayer() {
    playerCount++;
    const pitch = document.getElementById('footballPitch');
    const player = document.createElement('div');
    
    player.classList.add('player-token');
    player.innerText = playerCount;
    
    // Posição inicial levemente aleatória para não empilhar todos no mesmo ponto
    player.style.left = `${20 + (playerCount * 5) % 60}%`;
    player.style.top = `${30 + (playerCount * 8) % 50}%`;
    
    // Define cores diferentes para diferenciar os times temporariamente
    if (playerCount > 11) {
        player.style.backgroundColor = '#1976d2'; // Azul para time visitante
    }

    // Evento de clique duplo para remover o jogador da prancheta
    player.addEventListener('dblclick', () => player.remove());

    makeElementDraggable(player);
    pitch.appendChild(player);
}

function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Novas posições calculadas
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;
        
        // Limita os jogadores para não saírem das bordas do campo verde
        const pitch = document.getElementById('footballPitch');
        if (newTop >= 0 && newTop <= (pitch.clientHeight - element.clientHeight)) {
            element.style.top = newTop + "px";
        }
        if (newLeft >= 0 && newLeft <= (pitch.clientWidth - element.clientWidth)) {
            element.style.left = newLeft + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
