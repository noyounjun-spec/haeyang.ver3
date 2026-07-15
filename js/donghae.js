document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    
    // 정답 좌표 (x: 가로 %, y: 세로 %, radius: 터치 판정 반경 %)
    // 테스트 시 이 좌표값들을 클릭해야 정답 처리됩니다.
    const D_HOTSPOTS = [
        { id: 1, x: 20, y: 35, radius: 8 },
        { id: 2, x: 75, y: 20, radius: 8 },
        { id: 3, x: 45, y: 60, radius: 8 },
        { id: 4, x: 15, y: 80, radius: 8 },
        { id: 5, x: 85, y: 85, radius: 8 }
    ];

    let foundSpots = new Set();

    gameContainer.addEventListener('click', (e) => {
        const rect = gameContainer.getBoundingClientRect();
        
        // 클릭 좌표를 컨테이너 대비 백분율(%)로 계산
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        D_HOTSPOTS.forEach(spot => {
            if (foundSpots.has(spot.id)) return;

            // 두 점 사이의 거리 계산
            const distance = Math.sqrt(Math.pow(clickX - spot.x, 2) + Math.pow(clickY - spot.y, 2));

            // 클릭한 거리가 반경 내에 있다면 정답 처리
            if (distance <= spot.radius) {
                foundSpots.add(spot.id);
                createMarker(spot.x, spot.y);
                updateScore();
            }
        });
    });

    function createMarker(x, y) {
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        gameContainer.appendChild(marker);
    }

    function updateScore() {
        scoreDisplay.textContent = `${foundSpots.size} / 5`;

        if (foundSpots.size === 5) {
            setTimeout(() => {
                localStorage.setItem('mission_donghae', 'true');
                alert('동해 해양경찰청 미션 완료!');
                window.location.href = 'index.html';
            }, 600);
        }
    }
});
