import Color from '../constants/Color.js';
import DirectionOffsets from './constants/DirectionOffsets.js';
import clientTemplate from './clientTemplate.js';

export default class extends clientTemplate {
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
     */
    think(info) {
        this.playerColor = info.playerColor;
        this.maxDepth = 2;

        // 評価値が最も高い座標を選択
        let maxValue = this.calcValue(info.boadState, info.puttableIndices[0].x, info.puttableIndices[0].y, info.playerColor);
        let selectedCell = info.puttableIndices[0];
        for (let cell of info.puttableIndices) {
            let tmp = this.calcValueWithNextTurn(info.boadState, cell.x, cell.y, info.playerColor, this.maxDepth);
            if (maxValue < tmp) {
                maxValue = tmp;
                selectedCell = cell;
            }
        }
        
        return selectedCell;
    }

    calcValueWithNextTurn(boadState, x, y, color, depth) {
        console.log((this.maxDepth - depth + 1) + "手先を計算中");

        let value = this.calcValue(boadState, x, y, color);
        if (depth <= 0) {
            return value;
        }

        let nextBoard = this.putToBoard(boadState, x, y, color);

        let nextColor = (color.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        let nextCells = this.searchPuttableCellIndices(boadState, nextColor);
        if (nextCells.length <= 0) {
            nextCells = this.searchPuttableCellIndices(boadState, color.id);
        }

        if (nextCells.length <= 0) {
            return value;
        }

        let maxValue = 0;
        for (let cell of nextCells) {
            let tmp = 0;
            if (this.playerColor.id === color.id) {
                tmp = this.calcValueWithNextTurn(nextBoard, cell.x, cell.y, nextColor, depth - 1) + value;
            } else {
                tmp = this.calcValueWithNextTurn(nextBoard, cell.x, cell.y, nextColor, depth - 1) - value;
            }

            if (maxValue < tmp) {
                maxValue = tmp;
            }
        }

        return maxValue;
    }

    // 評価関数
    calcValue(boadState, x, y, color) {
        let board = this.putToBoard(boadState, x, y, color);
        let nums = this.count(board);

        if (color.id === Color.BLACK.id) {
            return nums.numOfBlack - nums.numberOfWhite;
        } else {
            return nums.numberOfWhite - nums.numOfBlack;
        }
    }

    // その他this.メソッド名で使えるもの(clientTemplateで宣言済)
    // 引数で与えた座標が盤面外かどうかを判定
    //  {boolean} notOutOfBoard(x, y)
    // 石を置ける座標の配列を取得
    //  {Array} searchPuttableCellIndices(boadState, playerColor)
    // 石を置いたあとの盤面を取得
    //  {Array} putToBoard(boadState, x, y, playerColor)
    // 石の数を数える
    //  {numOfBlack: 黒の数, numberOfWhite: 白の数} count(boadState)
}