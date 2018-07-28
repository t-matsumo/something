let Color = require('../constants/Color').Color;
let DirectionOffsets = require('../constants/DirectionOffsets').DirectionOffsets;

exports.Board = class {
    constructor() {
        this._boardState = new Array(8);
        for (let y = 0; y < 8; y++) {
            this._boardState[y] = new Array(8).fill(Color.EMPTY);
        }
        this._boardState[3][3] = this._boardState[4][4] = Color.WHITE;
        this._boardState[4][3] = this._boardState[3][4] = Color.BLACK;

        this._numberOfBlack = this._numberOfWhite = 2;
    }

    get currentState() {
        return this._boardState;
    }

    get numberOfBlack() {
        return this._numberOfBlack;
    }

    get numberOfWhite() {
        return this._numberOfWhite;
    }

    canPutAnywhare(color) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.canNotPut(i, j, color)) {
                    return true;
                }
            }
        }

        return false;
    }

    canNotPut(x, y, color) {
        if (this._boardState[x][y].id !== Color.EMPTY.id) {
            return true;
        }

        for (let key in DirectionOffsets) {
            if (this.canReverse(x, y, color, DirectionOffsets[key])) {
                return false;
            }
        }

        return true;
    }

    put(x, y, color) {
        this._boardState[x][y] = color;
        if (color.id === Color.BLACK) {
            this._numberOfBlack++;
        } else {
            this._numberOfWhite++;
        }
        this.reverse(x, y, color);
    }

    canReverse(x, y, color, offset) {
        let oppositColor = (color.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        let count = 0; // 裏返せる個数（これがないと自分の色の石の隣に置けてしまう）
        x += offset.x;
        y += offset.y;
        while (this.notOutOfBoard(x, y) && this._boardState[x][y].id === oppositColor.id) {
            x += offset.x;
            y += offset.y;

            count++;
        }

        if (count > 0 && this.notOutOfBoard(x, y) && this._boardState[x][y].id === color.id) {
            return true;
        }

        return false;
    }

    reverse(x, y, color) {
        let oppositColor = (color.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        for (let key in DirectionOffsets) {
            if (!this.canReverse(x, y, color, DirectionOffsets[key])) {
                continue;
            }

            let tempX = x + DirectionOffsets[key].x;
            let tempY = y + DirectionOffsets[key].y;
            while (this._boardState[tempX][tempY].id === oppositColor.id) {
                this._boardState[tempX][tempY] = color;

                if (color === Color.BLACK) {
                    this._numberOfBlack++;
                    this._numberOfWhite--;
                } else {
                    this._numberOfBlack--;
                    this._numberOfWhite++;
                }
                
                tempX += DirectionOffsets[key].x;
                tempY += DirectionOffsets[key].y;
            }
        }
    }

    notOutOfBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }
};