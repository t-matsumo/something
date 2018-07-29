import Color from '../constants/Color.js';
import DirectionOffsets from './constants/DirectionOffsets.js';

export default class {
    /**
     * 石を置く座標を1つ返す
     * 座標の形式：{x: 整数, y: 整数}
     * x, yの範囲：左上が原点(0, 0)、右下が(7, 7)
     * @param {Array} boadState - 盤面の状態
     * @param {Array} puttableIndices - 石を置ける座標の配列（必ず要素数は1以上）
     * @param {Color} playerColor - プレイヤーの色(置くべき石の色)
     * @return {Object} 座標を{x: 整数, y: 整数}の形式で返す
     */
    think(boadState, puttableIndices, playerColor) {
        return puttableIndices[0];
    }

    put(boadState, playerColor) {
        let puttableIndices = this.searchPuttableCellIndices(boadState, playerColor);
        return this.think(boadState, puttableIndices, playerColor);
    }

    searchPuttableCellIndices(boadState, playerColor) {
        let indices = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.checkPuttableOrNot(boadState, i, j, playerColor)) {
                    indices.push({x: i, y: j});
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
}