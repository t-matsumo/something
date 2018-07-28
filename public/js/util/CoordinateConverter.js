export default class {
    static indexToCoordinate(board, cellIndex) {
        return cellIndex * board.cellWidth - board.halfWidth + board.halfCellWidth
    }

    static coordinateToIndexX(board, coordinate) {
        return Math.round((coordinate - board.halfCellWidth) / board.cellWidth);
    }
    
    static coordinateToIndexY(board, coordinate) {
        return Math.round((coordinate - board.y + board.halfWidth - board.halfCellWidth) / board.cellWidth);
    }
};