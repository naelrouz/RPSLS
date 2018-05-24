import Player from './Player'

import rules from './gameRules'

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
    get playersAsArray() {
        return Array.from(this.$players.values())
    }
    addPlayer(socket) {

        // TODO ? if such a player already exists 'This player already exists'


        // if the maximum number of players is exceeded
        if (this.$players.size === this.$maxPlayersCount) {
            // throw new Error('Maximum number of players exceeded')
            console.error('Maximum number of players exceeded');

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
    getPlayer(playerId) {
        return this.$players.get(playerId)
    }
    isAllPlayersSelectedGestures() {
        return Array.from(this.$players.values()).reduce((result, player) => {
            if (!result) {
                return result
            }

            return !!player.selectedGesture

        }, true)

    }
    // gameOwer(){

    // }
    learnWinner() {

        const [player1, player2] = this.playersAsArray;

        if (player1.selectedGesture === player2.selectedGesture) {
            return {
                message: 'draw',
                winner: null,
                loser: null,
                players: this.playersAsArray
            }
        }


        // if the player1 object contains the player2, the user wins
        if (rules[player1.selectedGesture].hasOwnProperty(player2.selectedGesture)) {
            // return `player1! ${player1.selectedGesture}  ${rules[player1.selectedGesture][player2.selectedGesture]} ${player2.selectedGesture}`;

            player1.winner = true

            return {
                message: `${player1.selectedGesture} ${rules[player1.selectedGesture][player2.selectedGesture]} ${player2.selectedGesture}`,
                players: this.playersAsArray.map(player =>
                    ({
                        [player.id]: {
                            winner: player.winner,
                            selectedGesture: player.selectedGesture
                        }
                    })
                )
            }
        }

        return `player2! ${player2.selectedGesture}  ${rules[player2.selectedGesture][player1.selectedGesture]} ${player1.selectedGesture}`;

    }
    // sendGameResults() {

    // }
    setPlayerGesture(playerId, gesture) {

        // if the player has already chosen a gesture
        if (this.$players.get(playerId).selectedGesture) {
            return;
        }

        this.$players.get(playerId).selectedGesture = gesture;

        // if all players selected gestures

        console.log('this.isAllPlayersSelectedGestures() : ', this.isAllPlayersSelectedGestures());

        if (this.isAllPlayersSelectedGestures()) {
            console.log('learnWinner:', this.learnWinner());

        }



    }
}

export default GameRoom;