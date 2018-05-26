import events from '../eventConstants';

class GameRoomChat {
  constructor(gameRoomId, players) {
    this.$chatParticipants = players;
    this.$gameRoomId = gameRoomId;
    this.server = null;
    this.init();
  }

  init() {
    this.server = this.$chatParticipants.values().next().value.socket.server;

    this.server.emit(events.NEW_MESSAGE, {
      text: 'Welcome to the game room chat!'
    });

    this.$chatParticipants.forEach(({ socket }) => {
      socket.on('m', message => {
        // console.log('>> message: ', message);

        this.sendMessage(socket, message);
      });
    });
  }
  sendMessage(socket, { text }) {
    console.log('>> message: ', text);

    // .broadcast.in(this.$gameRoomId)

    console.log('this.$gameRoomId: ', this.$gameRoomId);

    socket.broadcast.in(this.$gameRoomId).emit(events.NEW_MESSAGE, {
      text
    });

    // Array.from(this.$chatParticipants.values())
    //   .find(participant => participant !== socketId)
    //   .socket.bro.emit(events.NEW_MESSAGE, {
    //     text
    //   });
  }
}

export default GameRoomChat;
