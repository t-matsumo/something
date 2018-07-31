import Color from './constants/Color.js';
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
        this.opponentColor = (this.playerColor === Color.BLACK) ? Color.WHITE : Color.BLACK;


        // 評価値が最も高い座標を選択
        let maxDepth = 5;
        let maxValue = 0;
        let selectedCell = info.puttableIndices[0];
        for (let cell of info.puttableIndices) {
            let tmp = this.calcValue(info.boadState, cell.x, cell.y, info.playerColor, maxDepth);
            if (maxValue < tmp) {
                maxValue = tmp;
                selectedCell = cell;
            }
        }
        
        return selectedCell;
    }

    // 評価関数
    calcValue(boadState, x, y, color, depth) {
        if (depth < 1) {
            return 0;
        }

        let nextState = this.putToBoard(boadState, x, y, color);
        let count = this.count(nextState.boardState);

        let value = this.evaluateBoardState(boadState, count, color);

        let puttableIndices = this.searchPuttableCellIndices(nextState.boardState, nextState.nextColor);
        if (nextState.nextColor === this.playerColor) {
            let maxValue = 0;
            for (let cell of puttableIndices) {
                let tmp = this.calcValue(nextState.boardState, cell.x, cell.y, nextState.nextColor, depth - 1);
                if (maxValue < tmp) {
                    maxValue = tmp;
                }
            }
            return value + maxValue;
        } else if (nextState.nextColor === this.opponentColor) {
            let minValue = 0;
            for (let cell of puttableIndices) {
                let tmp = this.calcValue(nextState.boardState, cell.x, cell.y, nextState.nextColor, depth - 1);
                if (minValue > tmp) {
                    minValue = tmp;
                }
            }
            return value + minValue;
        }

        // nullのとき（終了）
        return value;
    }

    evaluateBoardState(boadState, count, color) {
        let cornerValue = this.calcCornerValue(boadState, color);
        if (color === Color.BLACK) {
            return cornerValue * 100 + Color.BLACK - Color.WHITE;
        } else {
            return cornerValue * 100 + Color.WHITE - Color.BLACK;
        }
    }

    calcCornerValue(boadState, color) {
        let value = 0;
        if (boadState[0][0] === color) {
            value++;
        }
        if (boadState[0][7] === color) {
            value++;
        }
        if (boadState[7][0] === color) {
            value++;
        }
        if (boadState[7][7] === color) {
            value++;
        }

        return value;
    }

    // その他this.メソッド名で使えるもの(clientTemplateで宣言済)
    // 引数で与えた座標が盤面外かどうかを判定
    //  {boolean} notOutOfBoard(x, y)
    // 石を置ける座標の配列を取得
    //  {Array} searchPuttableCellIndices(boadState, playerColor)
    // 石を置いたあとの盤面と次に置くべき石の色（なければnull）を取得
    //  {boardState: boardState, nextColor: nextColor} putToBoard(boadState, x, y, playerColor)
    // 石の数を数える
    //  {numOfBlack: 黒の数, numberOfWhite: 白の数} count(boadState)
}