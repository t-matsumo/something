import CoordinateConverter from './util/CoordinateConverter.js';
import Color from './constants/Color.js';
import AutoClient from './client/client1.js';
import AutoClient2 from './client/t-matsumo.js';

phina.define('MainScene', {
    superClass: 'DisplayScene',
    socket: null,
    playerColor: null,
    currentTurn: null,
    turnLabel: null,
    autoMode: false,
    autoButton: null,
    autoButton2: null,
    autoClient: null,
    roomIdLabel: null,

    init: function (options) {
        this.superInit();

        this.roomIdLabel = Label({
            x: this.gridX.center(),
            y: this.gridY.center(7),
            text: "ルームID:" + '未定',
        }).addChildTo(this);

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
            x: this.gridX.center(-6),
            y: this.gridY.center(6),
            text: '自動でやる1'
        }).on('push', (e) => {
            this.autoClient = new AutoClient();
            this.autoMode = !this.autoMode;
            this.autoButton.text = this.autoMode ? '自分でやる' : '自動でやる';
        })
            .addChildTo(this);

        this.autoButton2 = Button({
            x: this.gridX.center(6),
            y: this.gridY.center(6),
            text: '自動でやる2'
        }).on('push', (e) => {
            this.autoClient = new AutoClient2();
            this.autoMode = !this.autoMode;
            this.autoButton2.text = this.autoMode ? '自分でやる' : '自動でやる';
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
                this.socket.emit('selectCell', this.socket.id, putInfo);
            });

        this.socket.on('changeBoard', (msg) => {
            let state = JSON.parse(msg);
            this.board.put(state.boadState);

            if (state.winner !== null) {
                setTimeout(() => {
                    alert(state.winner.id + "の勝ち(黒:" + state.numOfBlack + "、白:" + state.numOfWhite + ")");
                    this.socket.emit('end', this.socket.id);
                    this.socket.disconnect();
                    this.exit();
                }, 3000);
                return;
            }

            this.turnLabel.text = state.currentTurn.id + "の番";
            this.currentTurn = state.currentTurn;

            if (this.autoMode && this.currentTurn.id === this.playerColor.id) {
                let msg = this.autoClient.put(state.boadState, this.playerColor);
                let putInfo = JSON.stringify({ x: msg.x, y: msg.y, color: this.playerColor });
                this.socket.emit('selectCell', this.socket.id, putInfo);
            }
        });

        this.socket.on('start', (msg) => {
            let state = JSON.parse(msg);

            this.roomIdLabel.text = "ルームID" + state.roomId;

            this.board.put(state.boadState);

            this.turnLabel.text = state.currentTurn.id + "の番";
            this.currentTurn = state.currentTurn;

            if (this.autoMode && this.currentTurn.id === this.playerColor.id) {
                let msg = this.autoClient.put(state.boadState, this.playerColor);
                let putInfo = JSON.stringify({ x: msg.x, y: msg.y, color: this.playerColor })
                this.socket.emit('selectCell', this.socket.id, putInfo);
            }
        });

        this.socket.on('connect', () => {
            this.socket.emit('start', this.socket.id, this.playerColor);
        });
    },
});