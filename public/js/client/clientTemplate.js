import Color from './constants/Color.js';
import DirectionOffsets from './constants/DirectionOffsets.js';


export default class {
    /**
     * 石を置く座標を1つ返す
     * 座標の形式：{x: 整数, y: 整数}
     * x, yの範囲：左上が原点(0, 0)、右下が(7, 7)
     * info = {
            boadState: boadState,
            puttableIndices: puttableIndices,
            playerColor: playerColor,
            numOfBlack: numOfBlack,
            numOfWhite: numOfWhite
        };
     * @return {Object} 座標を{x: 整数, y: 整数}の形式で返す
     */
    think(info) {
        return info.puttableIndices[0];
    }

    put(boadState, playerColor) {
        let boardStateForAi = new Array(8);
        for (let x = 0; x < 8; x++) {
            boardStateForAi[x] = new Array(8);
            for (let y = 0; y < 8; y++) {
                boardStateForAi[x][y] = this.convertIdToColor(boadState[x][y].id);
            }
        }
        let playerColorForAi = this.convertIdToColor(playerColor.id);
        let puttableIndices = this.searchPuttableCellIndices(boardStateForAi, playerColorForAi);
        let count = this.count(boardStateForAi);

        let info = {
            boadState: boardStateForAi,
            puttableIndices: puttableIndices,
            playerColor: playerColorForAi,
            numOfBlack: count.numOfBlack,
            numOfWhite: count.numOfWhite
        };

        return this.think(info);
    }

    convertIdToColor(id) {
        switch (id) {
            case 'EMPTY':
                return Color.EMPTY;
            case 'BLACK':
                return Color.BLACK;
            case 'WHITE':
                return Color.WHITE;
        }
    }

    searchPuttableCellIndices(boadState, playerColor) {
        let indices = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.checkPuttableOrNot(boadState, x, y, playerColor)) {
                    indices.push({ x: x, y: y });
                }
            }
        }

        return indices;
    }

    checkPuttableOrNot(boadState, x, y, playerColor) {
        if (boadState[x][y] !== Color.EMPTY) {
            return false;
        }

        for (let key in DirectionOffsets) {
            if (this.canReverse(boadState, x, y, playerColor, DirectionOffsets[key])) {
                return true;
            }
        }

        return false;
    }

    canReverse(boadState, x, y, playerColor, offset) {
        let oppositColor = (playerColor === Color.BLACK) ? Color.WHITE : Color.BLACK;
        let count = 0; // 裏返せる個数（これがないと自分の色の石の隣に置けてしまう）
        x += offset.x;
        y += offset.y;
        while (this.notOutOfBoard(x, y) && boadState[x][y] === oppositColor) {
            x += offset.x;
            y += offset.y;

            count++;
        }

        if (count > 0 && this.notOutOfBoard(x, y) && boadState[x][y] === playerColor) {
            return true;
        }

        return false;
    }

    notOutOfBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }

    putToBoard(currentBoardState, x, y, playerColor) {
        let boardState = new Array(8);
        for (let x = 0; x < 8; x++) {
            boardState[x] = new Array(8);
            for (let y = 0; y < 8; y++) {
                boardState[x][y] = currentBoardState[x][y];
            }
        }

        boardState[x][y] = playerColor;

        let oppositColor = (playerColor === Color.BLACK) ? Color.WHITE : Color.BLACK;
        for (let key in DirectionOffsets) {
            if (!this.canReverse(boardState, x, y, playerColor, DirectionOffsets[key])) {
                continue;
            }

            let tempX = x + DirectionOffsets[key].x;
            let tempY = y + DirectionOffsets[key].y;
            while (boardState[tempX][tempY] === oppositColor) {
                boardState[tempX][tempY] = playerColor;

                tempX += DirectionOffsets[key].x;
                tempY += DirectionOffsets[key].y;
            }
        }

        let nextColor = (playerColor === Color.BLACK) ? Color.WHITE : Color.BLACK;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.checkPuttableOrNot(boardState, x, y, nextColor)) {
                    return {boardState: boardState, nextColor: nextColor};
                }
            }
        }

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.checkPuttableOrNot(boardState, x, y, playerColor)) {
                    return {boardState: boardState, nextColor: playerColor};
                }
            }
        }

        return {boardState: boardState, nextColor: null};
    }

    count(boardState) {
        let numOfBlack = 0;
        let numOfWhite = 0;

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                switch (boardState[x][y]) {
                    case Color.BLACK:
                        numOfBlack++;
                        break;
                    case Color.WHITE:
                        numOfWhite++;
                        break;
                }
            }
        }

        return {numOfBlack: numOfBlack, numOfWhite: numOfWhite};
    }
}