import Color from '../constants/Color.js';
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
        let puttableIndices = this.searchPuttableCellIndices(boadState, playerColor);
        
        let count = this.count(boadState);

        let info = {
            boadState: boadState,
            puttableIndices: puttableIndices,
            playerColor: playerColor,
            numOfBlack: count.numOfBlack,
            numOfWhite: count.numOfWhite
        };
        return this.think(info);
    }

    searchPuttableCellIndices(boadState, playerColor) {
        let indices = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.checkPuttableOrNot(boadState, i, j, playerColor)) {
                    indices.push({ x: i, y: j });
                }
            }
        }

        return indices;
    }

    checkPuttableOrNot(boadState, x, y, playerColor) {
        if (boadState[x][y].id !== Color.EMPTY.id) {
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
        let oppositColor = (playerColor.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        let count = 0; // 裏返せる個数（これがないと自分の色の石の隣に置けてしまう）
        x += offset.x;
        y += offset.y;
        while (this.notOutOfBoard(x, y) && boadState[x][y].id === oppositColor.id) {
            x += offset.x;
            y += offset.y;

            count++;
        }

        if (count > 0 && this.notOutOfBoard(x, y) && boadState[x][y].id === playerColor.id) {
            return true;
        }

        return false;
    }

    notOutOfBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }

    putToBoard(currentBoardState, x, y, playerColor) {
        let boardState = new Array(8);
        for (let y = 0; y < 8; y++) {
            boardState[y] = currentBoardState[y].slice();
        }

        boardState[x][y] = playerColor;

        let oppositColor = (playerColor.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        for (let key in DirectionOffsets) {
            if (!this.canReverse(boardState, x, y, playerColor, DirectionOffsets[key])) {
                continue;
            }

            let tempX = x + DirectionOffsets[key].x;
            let tempY = y + DirectionOffsets[key].y;
            while (boardState[tempX][tempY].id === oppositColor.id) {
                boardState[tempX][tempY] = playerColor;

                tempX += DirectionOffsets[key].x;
                tempY += DirectionOffsets[key].y;
            }
        }

        return boardState;
    }

    count(boardState) {
        let numOfBlack = 0;
        let numOfWhite = 0;
        for (let row of boardState) {
            for (let cell of row) {
                switch (cell.id) {
                    case Color.BLACK.id:
                        numOfBlack++;
                        break;
                    case Color.WHITE.id:
                        numOfWhite++;
                        break;
                }
            }
        }

        return {numOfBlack: numOfBlack, numberOfWhite: numOfWhite};
    }
}