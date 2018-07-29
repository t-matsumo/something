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
        this.maxDepth = 3;

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
        // console.log((this.maxDepth - depth + 1) + "手先を計算中");

        let nextBoard = this.putToBoard(boadState, x, y, color);

        let value = this.calcValue(nextBoard, color);

        if (depth <= 0) {
            return value;
        }

        let nextColor = (color.id === Color.BLACK.id) ? Color.WHITE : Color.BLACK;
        let nextCells = this.searchPuttableCellIndices(nextBoard, nextColor);
        if (nextCells.length <= 0) {
            nextCells = this.searchPuttableCellIndices(nextBoard, color.id);
            nextColor = color.id;
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
    calcValue(boadState, color) {
        let nums = this.count(boadState);
        let cornerValue = 0;

        if (boadState[0][0].id === Color.id) {
            cornerValue++;
        }

        if (boadState[0][7].id === Color.id) {
            cornerValue++;
        }

        if (boadState[7][0].id === Color.id) {
            cornerValue++;
        }

        if (boadState[7][7].id === Color.id) {
            cornerValue++;
        }

        let nextTurnValue = 0;
        let nextCells = this.searchPuttableCellIndices(boadState, color);
        if (color.id !== this.playerColor.id) {
            if (nextCells.length <= 0) {
                nextTurnValue = 1;
            }
        }

        if (color.id === Color.BLACK.id) {
            return cornerValue * 40 + nextTurnValue * 50 + (nums.numOfBlack - nums.numOfWhite) * 10 + nextCells.length * 20;
        } else {
            return cornerValue * 40 + nextTurnValue * 50 + (nums.numOfWhite - nums.numOfBlack) * 10 + nextCells.length * 20;
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