document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board'); // 게임 보드 요소
    const scoreDisplay = document.getElementById('score'); // 찾은 쌍을 표시할 요소
    
    // 6쌍의 카드를 만들기 위한 CSS 필터 값 (클로드 설명 참고)
    const CARD_FILTERS = [
        'hue-rotate(80deg)', 
        'hue-rotate(160deg)', 
        'hue-rotate(240deg)', 
        'sepia(100%)', 
        'grayscale(100%)', 
        'invert(80%)'
    ];

    // 카드 쌍 만들기 및 섞기
    let cards = [...CARD_FILTERS, ...CARD_FILTERS];
    cards.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedCount = 0;

    // 보드에 카드 렌더링
    cards.forEach(filter => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.filter = filter;

        const frontFace = document.createElement('img');
        frontFace.src = 'assets/archi.png';
        frontFace.classList.add('card-front');
        frontFace.style.filter = filter;

        const backFace = document.createElement('div');
        backFace.classList.add('card-back');

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        gameBoard.appendChild(cardElement);

        cardElement.addEventListener('click', () => flipCard(cardElement));
    });

    function flipCard(card) {
        if (lockBoard) return;
        if (card === firstCard) return; // 같은 카드 두 번 클릭 방지
        if (card.classList.contains('matched')) return;

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.filter === secondCard.dataset.filter;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchedCount++;
        if (scoreDisplay) scoreDisplay.textContent = `${matchedCount} / 6`;

        resetBoard();

        // 6쌍 모두 찾았을 때 게임 클리어
        if (matchedCount === 6) {
            setTimeout(gameClear, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 800);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function gameClear() {
        // progress.js에 있는 완료 처리 로직 호출
        if (window.completeMission) {
            window.completeMission('jungbu');
        } else {
            // 로컬 스토리지에 직접 저장하는 fallback
            localStorage.setItem('mission_jungbu', 'true');
        }
        alert('중부 해양경찰청 미션 완료!');
        window.location.href = 'index.html'; // 허브로 복귀
    }
});
