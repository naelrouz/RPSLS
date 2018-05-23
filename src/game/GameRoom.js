import Player from './Player'

import events from '../eventConstants'

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

        // TODO ? if such a player already exists 'This player already exists'


        // if the maximum number of players is exceeded
        if (this.$players.size === this.$maxPlayersCount) {
            throw new Error('Maximum number of players exceeded')
        }


        socket.join(this.$gameRoomId);
        const newPlayer = new Player(socket)
        this.$players.set(socket.id, newPlayer)

        socket.broadcast
            .in(this.$gameRoomId)
            .emit(events.OPPONENT_ENTRANCE_TO_GAME_ROOM, {
                message: `${socket.username} user has joined to GameRoom`
            });
    }
}

export default GameRoom;