document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container'); // 틀린그림찾기 이미지 래퍼
    const scoreDisplay = document.getElementById('score');
    
    // 정답 좌표 (x: 가로 %, y: 세로 %, radius: 터치 판정 반경 %)
    const D_HOTSPOTS = [
        { id: 1, x: 20, y: 35, radius: 7 },
        { id: 2, x: 75, y: 20, radius: 7 },
        { id: 3, x: 45, y: 60, radius: 7 },
        { id: 4, x: 15, y: 80, radius: 7 },
        { id: 5, x: 85, y: 85, radius: 7 }
    ];

    let foundSpots = new Set();

    if (!gameContainer) return;

    gameContainer.addEventListener('click', (e) => {
        const rect = gameContainer.getBoundingClientRect();
        
        // 클릭한 위치를 백분율(%)로 변환
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        D_HOTSPOTS.forEach(spot => {
            if (foundSpots.has(spot.id)) return;

            // 두 점 사이의 거리 계산 (피타고라스 정리)
            const distance = Math.sqrt(Math.pow(clickX - spot.x, 2) + Math.pow(clickY - spot.y, 2));

            // 클릭한 곳이 반경 안에 포함되면 정답 처리
            if (distance <= spot.radius) {
                foundSpots.add(spot.id);
                markAsFound(spot.x, spot.y);
                checkWin();
            }
        });
    });

    function markAsFound(x, y) {
        // 정답 위치에 O 표시를 남기기 위한 마커 생성
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        
        // 마커 애니메이션 클래스 추가 (css/donghae.css에 정의되어 있다고 가정)
        marker.classList.add('show'); 
        gameContainer.appendChild(marker);
    }

    function checkWin() {
        if (scoreDisplay) {
            scoreDisplay.textContent = `${foundSpots.size} / 5`;
        }

        if (foundSpots.size === 5) {
            setTimeout(() => {
                if (window.completeMission) {
                    window.completeMission('donghae');
                } else {
                    localStorage.setItem('mission_donghae', 'true');
                }
                alert('동해 해양경찰청 미션 완료!');
                window.location.href = 'index.html'; // 허브로 복귀
            }, 600);
        }
    }
});
