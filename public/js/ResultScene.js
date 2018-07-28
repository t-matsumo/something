phina.define('ResultScene', {
    superClass: 'DisplayScene',

    init: function(options) {
        this.superInit();
        
        Button({
            x: this.gridX.center(),
            y: this.gridY.center(),
            text: '次のゲームへ'
        }).on('push', (e) => this.exit())
            .addChildTo(this);
    }
});