import Color from '../constants/Color.js';
import CoordinateConverter from '../util/CoordinateConverter.js';

phina.define('Board', {
    superClass: 'RectangleShape',
    NUMBER_OF_LINE: 9,
    NUMBER_OF_CELLS: 8,
    BOARD_COLOR: '#004E2D',
    LINE_COLOR: 'black',

    pieces: [],
    halfWidth: 0,
    cellWidth: 0,
    halfCellWidth: 0,

    init: function (options) {
        this.superInit(options);
        this.fill = this.BOARD_COLOR;

        this.halfWidth = this.width / 2;
        this.cellWidth = this.width / this.NUMBER_OF_CELLS;
        this.halfCellWidth = this.cellWidth / 2;
        this.NUMBER_OF_LINE.times((i) => {
            let lineOffset = i * this.cellWidth - this.halfWidth;
            PathShape({
                width: this.width,
                height: this.height,
                stroke: this.LINE_COLOR,
                strokeWidth: 4,
                paths: [Vector2(-this.halfWidth, lineOffset), Vector2(this.halfWidth, lineOffset)],
            }).addChildTo(this);

            PathShape({
                width: this.width,
                height: this.width,
                stroke: this.LINE_COLOR,
                strokeWidth: 4,
                paths: [Vector2(lineOffset, -this.halfWidth), Vector2(lineOffset, this.halfWidth)],
            }).addChildTo(this);
        });
    },
    put: function (boardState) {
        this.pieces.forEach((piece) => piece.remove());

        boardState.length.times((x) => {
            boardState[x].length.times((y) => {
                if (boardState[x][y] === Color.EMPTY) {
                    return;
                }

                let piece = Piece({
                    x: CoordinateConverter.indexToCoordinate(this, x),
                    y: CoordinateConverter.indexToCoordinate(this, y),
                    width: this.cellWidth,
                    height: this.cellWidth,
                    color: boardState[x][y],
                }).addChildTo(this);
                this.pieces.push(piece);
            });
        });
    },

});