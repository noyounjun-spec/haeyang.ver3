document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    
    const CARD_FILTERS = [
        'hue-rotate(80deg)', 
        'hue-rotate(160deg)', 
        'hue-rotate(240deg)', 
        'sepia(100%)', 
        'grayscale(100%)', 
        'invert(80%)'
    ];

    let cards = [...CARD_FILTERS, ...CARD_FILTERS];
    cards.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedCount = 0;

    cards.forEach(filter => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.filter = filter;

        // 카드 앞면/뒷면을 감싸는 내부 컨테이너 (CSS 3D 효과용)
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const img = document.createElement('img');
        img.src = 'assets/archi.png';
        img.style.filter = filter;
        cardFront.appendChild(img);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        gameBoard.appendChild(cardElement);

        cardElement.addEventListener('click', () => flipCard(cardElement));
    });

    function flipCard(card) {
        if (lockBoard) return;
        if (card === firstCard) return;
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
        if (firstCard.dataset.filter === secondCard.dataset.filter) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchedCount++;
        scoreDisplay.textContent = `${matchedCount} / 6`;
        resetBoard();

        if (matchedCount === 6) {
            setTimeout(() => {
                localStorage.setItem('mission_jungbu', 'true');
                alert('중부 해양경찰청 미션 완료!');
                window.location.href = 'index.html';
            }, 500);
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
});
