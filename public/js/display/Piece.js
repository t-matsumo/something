import Color from '../constants/Color.js';

phina.define('Piece', {
    superClass: 'CircleShape',

    init: function (options) {
        this.superInit(options);
        this.fill = this.stroke = Color[options.color.id].colorCode;
    },
});