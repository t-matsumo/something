import CoordinateConverter from './util/CoordinateConverter.js';
import Color from './constants/Color.js';
import AutoClient from './client/client.js';

phina.define('MainScene', {
    superClass: 'DisplayScene',
    socket: null,
    playerColor: null,
    currentTurn: null,
    turnLabel: null,
    autoMode: false,
    autoButton: null,
    autoClient: null,

    init: function (options) {
        this.superInit();

        this.autoClient = new AutoClient();
        this.playerColor = options.playerColor;
        Label({
            x: this.gridX.center(-6),
            y: this.gridY.center(-6),
            text: "あなたの色：" + this.playerColor.id,
        }).addChildTo(this);

        this.currentTurn = Color.BLACK;
        this.turnLabel = Label({
            x: this.gridX.center(6),
            y: this.gridY.center(-6),
            text: this.currentTurn.id + "の番",
        }).addChildTo(this);

        this.board = Board({
            x: this.gridX.center(),
            y: this.gridY.center(),
            width: this.gridX.width,
            height: this.gridX.width,
        }).addChildTo(this);

        this.autoButton = Button({
            x: this.gridX.center(),
            y: this.gridY.center(6),
            text: '自動でやる'
        }).on('push', (e) => {
            this.autoMode = !this.autoMode;
            this.autoButton.text = this.autoMode ? '自分でやる' : '自動でやる';
        })
            .addChildTo(this);

        this.socket = io();

        this.board.setInteractive(true)
            .on('pointend', (e) => {
                if (this.currentTurn.id !== this.playerColor.id) {
                    return;
                }

                let x = CoordinateConverter.coordinateToIndexX(this.board, e.pointer.x);
                let y = CoordinateConverter.coordinateToIndexY(this.board, e.pointer.y);
                let putInfo = JSON.stringify({ x: x, y: y, color: this.playerColor })
                this.socket.emit('selectCell', putInfo);
            });

        this.socket.on('changeBoard', (msg) => {
            let state = JSON.parse(msg);
            this.board.put(state.boadState);

            if (state.winner !== null) {
                alert(state.winner.id + "の勝ち");
                this.socket.emit('end');
                this.exit();
            }

            this.turnLabel.text = state.currentTurn.id + "の番";
            this.currentTurn = state.currentTurn;

            if (this.autoMode && this.currentTurn.id === this.playerColor.id) {
                console.log("auto");
                let msg = this.autoClient.put(state.boadState, this.playerColor);
                let putInfo = JSON.stringify({ x: msg.x, y: msg.y, color: this.playerColor })
                this.socket.emit('selectCell', putInfo);
            }
        });

        this.socket.emit('start', this.playerColor);
    },
});