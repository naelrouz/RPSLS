import Koa from 'koa';
import Router from 'koa-router';
import cfg from 'config';
import colors from 'colors';
import http from 'http';
import socketIO from 'socket.io';
import uniqid from 'uniqid';

import events from './eventConstants';
import middlewares from './middlewares';
import GameServer from './game/GameServer';

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socketIO(server);

const PORT = cfg.server.port;

Object.keys(middlewares).forEach(middleware => {
  middlewares[middleware].init(app);
});

const gameServer = new GameServer();

io.on('connection', socket => {
  console.log(`New user is connected. socketId : ${socket.id}`);

  // TODO
  // Listen on CHANGE_USERNAME
  // socket.on(events.CHANGE_USERNAME, ({
  //   username
  // }) => {
  //   console.log('username: ', username);
  //   socket.username = username;
  // });
  // TODO
  // Listen on NEW_MESSAGE
  // socket.on(events.NEW_MESSAGE, payload => {
  //   const {
  //     message
  //   } = payload;
  //   const {
  //     username
  //   } = socket;

  //   console.log('NEW_MESSAGE.payload: ', payload);
  //   console.log('message: ', message);
  //   console.log('username: ', username);

  //   io.emit(events.NEW_MESSAGE, {
  //     message,
  //     username
  //   });
  // });

  // > Create GameRoom
  socket.on(events.CREATE_GAME_ROOM, () => {
    const newGameRoom = gameServer.createGameRoom();
    const gameRoomId = newGameRoom.id;
    console.log('newGameRoom.id', gameRoomId);

    // tag current user as ceator this GameRoom

    // join to the GameRoom
    socket.join(gameRoomId);

    // return is created GameRoomId
    io.in(gameRoomId).emit(events.NEW_GAME_ROOM_CREATED, {
      gameRoomId
    });

    console.log('gameRooms :', gameServer.gameRooms);
  });

  // > entrance opponent to the GameRoom
  socket.on(events.ENTER_TO_GAME_ROOM, ({ gameRoomId }) => {
    try {
      gameServer.addRoomPlayer(gameRoomId, socket);
    } catch (error) {
      console.error(error);

      // TODO ? send error message to client
      // socket.emit(events.ERROR, { message: '', error });
    }
  });

  //
  socket.on(events.SELECT_GESTURE, ({ gameRoomId, gesture }) => {
    console.log('--------------------');
    console.log('> gesture: ', gesture);
    console.log('> gameRoomId: ', gameRoomId);
    console.log('> socket.id: ', socket.id);
    console.log('--------------------');

    try {
      gameServer.setRoomPlayerGesture(gameRoomId, socket.id, gesture);
    } catch (error) {
      console.error('setRoomPlayerGesture.error: ', error);
    }
  });

  // Listen on disconnect (end game if participant is disconnect?)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(router.routes());

server.listen(PORT, () => {
  console.log(colors.green.bold(`App is start ${cfg.server.host}:${PORT}`));
});
