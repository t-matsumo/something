let Color = require('../constants/Color').Color;
let Board = require('./Board').Board;

exports.ReversiLogic = class {
    constructor() {
        this.board = new Board();
        this.currentTurn = Color.BLACK;
    }

    start() {
        return this.board.currentState();
    }

    onSelectCell(putInfo) {
        if (putInfo.color.id !== this.currentTurn.id) {
            return this.board.currentState();
        }

        if (this.board.canNotPut(putInfo.x, putInfo.y, putInfo.color)) {
            return this.board.currentState();
        }

        this.currentTurn = this.currentTurn.id === Color.BLACK.id ? Color.WHITE : Color.BLACK;
        this.board.put(putInfo.x, putInfo.y, putInfo.color);

        return this.board.currentState();
    }

    get getCurrentTurn() {
        return this.currentTurn;
    }
};

