export class XoApp {
    constructor() {
        this.title = 'بازی دوز (XO)';
        this.icon = 'gamepad-2';
        this.width = '320px';
        this.height = '420px';
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-white flex flex-col items-center justify-center p-4 font-vazir';
        
        container.innerHTML = `
            <div id="xo-status" class="mb-6 text-lg font-bold text-gray-700 bg-gray-100 px-6 py-2 rounded-xl shadow-sm border border-gray-200">
                نوبت: <span class="text-blue-600 text-xl">X</span>
            </div>
            <div id="xo-board" class="grid grid-cols-3 gap-2 w-full max-w-[220px] aspect-square">
            </div>
            <button id="xo-reset" class="mt-8 px-6 py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 active:scale-95 transition-all shadow-md">
                شروع مجدد
            </button>
        `;

        this.statusDisplay = container.querySelector('#xo-status');
        this.boardElement = container.querySelector('#xo-board');
        this.resetButton = container.querySelector('#xo-reset');

        this.createBoard();

        this.resetButton.addEventListener('click', () => this.resetGame());

        return container;
    }

    createBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-5xl font-bold rounded-xl flex items-center justify-center transition-colors focus:outline-none';
            cell.dataset.index = i;
            cell.addEventListener('click', (e) => this.handleCellClick(e, i));
            this.boardElement.appendChild(cell);
        }
    }

    handleCellClick(event, index) {
        if (this.board[index] !== '' || !this.gameActive) return;

        this.board[index] = this.currentPlayer;
        const cell = event.target;
        
        if (this.currentPlayer === 'X') {
            cell.innerHTML = '<span class="text-blue-600 drop-shadow-sm">X</span>';
        } else {
            cell.innerHTML = '<span class="text-red-500 drop-shadow-sm">O</span>';
        }

        cell.classList.replace('hover:bg-gray-100', 'cursor-default');

        this.checkWinOrDraw();
    }

    checkWinOrDraw() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        let roundWon = false;

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            this.statusDisplay.innerHTML = `برنده: <span class="${this.currentPlayer === 'X' ? 'text-blue-600' : 'text-red-500'} text-xl">${this.currentPlayer}</span> 🎉`;
            this.statusDisplay.classList.replace('bg-gray-100', 'bg-green-100');
            this.statusDisplay.classList.replace('border-gray-200', 'border-green-300');
            this.gameActive = false;
            return;
        }

        if (!this.board.includes('')) {
            this.statusDisplay.innerHTML = '<span class="text-gray-600">بازی مساوی شد!</span>';
            this.statusDisplay.classList.replace('bg-gray-100', 'bg-yellow-100');
            this.statusDisplay.classList.replace('border-gray-200', 'border-yellow-300');
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.innerHTML = `نوبت: <span class="${this.currentPlayer === 'X' ? 'text-blue-600' : 'text-red-500'} text-xl">${this.currentPlayer}</span>`;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusDisplay.innerHTML = `نوبت: <span class="text-blue-600 text-xl">X</span>`;
        this.statusDisplay.className = 'mb-6 text-lg font-bold text-gray-700 bg-gray-100 px-6 py-2 rounded-xl shadow-sm border border-gray-200';
        this.createBoard();
    }
}
