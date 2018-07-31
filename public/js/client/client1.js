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

        // 評価値が最も高い座標を選択
        let maxValue = this.calcValue(info.boadState, info.puttableIndices[0].x, info.puttableIndices[0].y, info.playerColor);
        let selectedCell = info.puttableIndices[0];
        for (let cell of info.puttableIndices) {
            let tmp = this.calcValue(info.boadState, cell.x, cell.y, info.playerColor);
            if (maxValue < tmp) {
                maxValue = tmp;
                selectedCell = cell;
            }
        }
        
        return selectedCell;
    }

    // 評価関数
    calcValue(boadState, x, y, color) {
        let board = this.putToBoard(boadState, x, y, color);
        let nums = this.count(board);

        if (this.playerColor.id === Color.BLACK.id) {
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
    // 石を置いたあとの盤面と次に置くべき石の色（なければnull）を取得
    //  {boardState: boardState, nextColor: nextColor} putToBoard(boadState, x, y, playerColor)
    // 石の数を数える
    //  {numOfBlack: 黒の数, numberOfWhite: 白の数} count(boadState)
}