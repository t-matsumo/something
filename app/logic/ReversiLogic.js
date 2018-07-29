let Color = require('../constants/Color').Color;
let Board = require('./Board').Board;

exports.ReversiLogic = class {
    constructor() {
        this.board = new Board();
        this._currentTurn = Color.BLACK;
        this._winner = null;
    }

    get currentTurn() {
        return this._currentTurn;
    }

    get winner() {
        return this._winner;
    }

    get numOfBlack() {
        return this.board.numberOfBlack;
    }

    get numOfWhite() {
        return this.board.numberOfWhite;
    }

    start() {
        return this.board.currentState;
    }

    onSelectCell(putInfo) {
        if (this._currentTurn == null || putInfo.color.id !== this._currentTurn.id) {
            return this.board.currentState;
        }

        if (this.board.canNotPut(putInfo.x, putInfo.y, putInfo.color)) {
            return this.board.currentState;
        }

        this.board.put(putInfo.x, putInfo.y, putInfo.color);
        this._currentTurn = this.nextTurn();

        if (this._currentTurn === null) {
            if (this.board.numberOfBlack === this.board.numberOfWhite) {
                this._winner = Color.EMPTY;
            } else if (this.board.numberOfBlack > this.board.numberOfWhite) {
                this._winner = Color.BLACK;
            } else {
                this._winner = Color.WHITE;
            }
        }

        return this.board.currentState;
    }

    nextTurn() {
        let next = (this._currentTurn.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        if (this.board.canPutAnywhare(next)) {
            return next;
        }

        if (this.board.canPutAnywhare(this._currentTurn)) {
            return this._currentTurn;
        }

        // どちらの石も置けない
        return null;
    }
};