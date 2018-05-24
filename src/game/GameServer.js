import uniqid from 'uniqid';

import GameRoom from './GameRoom';

class GameServer {
  constructor() {
    this.$gameRooms = new Map();
  }
  createGameRoom() {
    const gameRoomId = uniqid();
    const newGameRoom = new GameRoom(gameRoomId);
    this.$gameRooms.set(gameRoomId, newGameRoom);
    return newGameRoom;
  }

  getGameRoom(gameRoomId) {
    return this.$gameRooms.get(gameRoomId);
  }

  getRoomPlayers(gameRoomId) {
    return this.$gameRooms.get(gameRoomId).players;
  }

  setRoomPlayerGesture(gameRoomId, playerId, gesture) {
    this.$gameRooms.get(gameRoomId).setPlayerGesture(playerId, gesture);
  }

  addRoomPlayer(gameRoomId, socket) {
    if (!this.getGameRoom(gameRoomId)) {
      console.error('there is no room with such id');
    }

    this.getGameRoom(gameRoomId).addPlayer(socket);
  }

  get gameRooms() {
    return this.$gameRooms;
  }
}

export default GameServer;
