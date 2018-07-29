var ReversiLogic = require('../logic/ReversiLogic').ReversiLogic;

exports.Rooms = class {
    constructor() {
        this.blackQueue = [];
        this.whiteQueue = [];
        this.rooms = {};
    }

    register(id, playerColor) {
        let opponent;
        if (playerColor.id === 'BLACK') {
            if (this.whiteQueue.length > 0) {
                opponent = this.whiteQueue.shift();
            } else {
                this.blackQueue.push(id);
                return;
            }
        } else {
            if (this.blackQueue.length > 0) {
                opponent = this.blackQueue.shift();
            } else {
                this.whiteQueue.push(id);
                return;
            }
        }

        let roomId = String(id) + String(opponent);
        let logic = new ReversiLogic();
        this.rooms[id] = { roomId: roomId, logic: logic, opponentId: opponent };
        this.rooms[opponent] = { roomId: roomId, logic: logic, opponentId: id };
    }

    matched(id) {
        return this.rooms[id] !== undefined;
    }

    info(id) {
        return this.rooms[id];
    }

    unregist(id) {
        delete this.rooms[id];
    }
}