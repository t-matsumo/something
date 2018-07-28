let Color = require('../constants/Color').Color;
let Board = require('./Board').Board;

exports.ReversiLogic = class {
    constructor() {
        this.board = new Board();
        this._currentTurn = Color.BLACK;
    }

    start() {
        return this.board.currentState;
    }

    onSelectCell(putInfo) {
        if (putInfo.color.id !== this._currentTurn.id) {
            return this.board.currentState;
        }

        if (this.board.canNotPut(putInfo.x, putInfo.y, putInfo.color)) {
            return this.board.currentState;
        }

        this._currentTurn = (this._currentTurn.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        this.board.put(putInfo.x, putInfo.y, putInfo.color);

        return this.board.currentState;
    }

    get currentTurn() {
        if (this.board.canPutAnywhare(this._currentTurn)) {
            return this._currentTurn;
        }

        let opponent = (this._currentTurn.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        if (this.board.canPutAnywhare(opponent)) {
            this._currentTurn = opponent;
            return this._currentTurn;
        }
        
        return this._currentTurn;
    }

    get winner() {
        if (this.board.canPutAnywhare(Color.BLACK) || this.board.canPutAnywhare(Color.WHITE)) {
            return null;
        }

        if (this.board.numberOfBlack === this.board.numberOfWhite) {
            return Color.EMPTY;
        } else if (this.board.numberOfBlack > this.board.numberOfWhite) {
            return Color.BLACK;
        } else {
            return Color.WHITE;
        }
    }
};

