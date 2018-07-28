import Color from './constants/Color.js';

phina.define('TitleScene', {
    superClass: 'DisplayScene',

    init: function () {
        this.superInit();

        Label({
            x: this.gridX.center(),
            y: this.gridY.center(-1),
            text: 'Reversi'
        }).addChildTo(this);

        Button({
            x: this.gridX.center(),
            y: this.gridY.center(),
            text: '黒(先攻)'
        }).on('push', (e) => this.exit({playerColor: Color.BLACK}))
            .addChildTo(this);
        Button({
            x: this.gridX.center(),
            y: this.gridY.center(2),
            text: '白(後攻)'
        }).on('push', (e) => this.exit({playerColor: Color.WHITE}))
            .addChildTo(this);
    },
});