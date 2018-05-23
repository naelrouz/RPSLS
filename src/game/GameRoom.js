import Player from './Player'


class GameRoom {
    constructor(gameRoomId) {
        this.$gameRoomId = gameRoomId;
        this.$maxPlayersCount = 2;
        this.$players = new Map()
    }
    get id() {
        return this.$gameRoomId
    }

    get players() {
        return this.$players
    }
    addPlayer(socket) {
        socket.join(this.$gameRoomId);

        const newPlayer = new Player(socket)
        this.$players.set(socket.id, newPlayer)
    }
}

export default GameRoom;