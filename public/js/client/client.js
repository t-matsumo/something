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
        console.dir(this.count(info.boadState));
        let board = this.putToBoard(info.boadState, info.puttableIndices[0].x, info.puttableIndices[0].y, info.playerColor);
        console.dir(board);
        console.dir(info.boadState);
        console.dir(this.count(board));
        console.dir(this.count(info.boadState));
        return super.think(info);
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