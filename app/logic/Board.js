let Color = require('../constants/Color').Color;
let DirectionOffsets = require('../constants/DirectionOffsets').DirectionOffsets;

exports.Board = class {
    constructor() {
        this.boardState = new Array(8);
        for (let y = 0; y < 8; y++) {
            this.boardState[y] = new Array(8).fill(Color.EMPTY);
        }
        this.boardState[3][3] = this.boardState[4][4] = Color.WHITE;
        this.boardState[4][3] = this.boardState[3][4] = Color.BLACK;
    }

    currentState() {
        return this.boardState;
    }

    canNotPut(x, y, color) {
        if (this.boardState[x][y].id !== Color.EMPTY.id) {
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
        this.boardState[x][y] = color;
        this.reverse(x, y, color);
    }

    canReverse(x, y, color, offset) {
        let oppositColor = (color.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        let count = 0; // 裏返せる個数（これがないと自分の色の石の隣に置けてしまう）
        x += offset.x;
        y += offset.y;
        while (this.notOutOfBoard(x, y) && this.boardState[x][y].id === oppositColor.id) {
            x += offset.x;
            y += offset.y;

            count++;
        }

        if (count > 0 && this.notOutOfBoard(x, y) && this.boardState[x][y].id === color.id) {
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

            let x2 = x + DirectionOffsets[key].x;
            let y2 = y + DirectionOffsets[key].y;
            while (this.boardState[x2][y2].id === oppositColor.id) {
                this.boardState[x2][y2] = color;
                x2 += DirectionOffsets[key].x;
                y2 += DirectionOffsets[key].y;
            }
        }
    }

    notOutOfBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }
};