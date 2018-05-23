import Koa from 'koa';
import Router from 'koa-router';
import cfg from 'config';
import colors from 'colors';
import http from 'http';
import socketIO from 'socket.io';
import uniqid from 'uniqid';

import events from './eventConstants';
import middlewares from './middlewares';
import GameServer from './game/GameServer'

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socketIO(server);

const PORT = cfg.server.port;

Object.keys(middlewares).forEach(middleware => {
  middlewares[middleware].init(app);
});

// game vars

// const users = {};
// const gameRooms = {};


const gameServer = new GameServer()

io.on('connection', socket => {
  console.log(`New user is connected. socketId : ${socket.id}`);

  // init new user
  // users[socket.id] = {
  //   socket,
  //   createdGameRooms: []
  // };

  // Set default username
  // socket.username = 'Anonymous';

  // Listen on CHANGE_USERNAME
  socket.on(events.CHANGE_USERNAME, ({
    username
  }) => {
    console.log('username: ', username);
    socket.username = username;
  });

  // Listen on NEW_MESSAGE
  socket.on(events.NEW_MESSAGE, payload => {
    const {
      message
    } = payload;
    const {
      username
    } = socket;

    console.log('NEW_MESSAGE.payload: ', payload);
    console.log('message: ', message);
    console.log('username: ', username);

    io.emit(events.NEW_MESSAGE, {
      message,
      username
    });
  });

  // > Action: create new GameRoom
  socket.on(events.CREATE_GAME_ROOM, () => {
    // generate gameRoomId
    // const gameRoomId = uniqid();

    // create GameRoom
    // gameRooms[gameRoomId] = {
    //   players: {}
    // };

    const newGameRoom = gameServer.createGameRoom();
    const gameRoomId = newGameRoom.id
    console.log('newGameRoom.id', gameRoomId);


    // tag current user as ceator this GameRoom
    // users[socket.id].createdGameRooms.push(gameRoomId);

    // join to the GameRoom
    socket.join(gameRoomId);

    // const closeGameRoomTimer = () => {};

    // return is created GameRoomId
    io.in(gameRoomId).emit(events.NEW_GAME_ROOM_CREATED, {
      gameRoomId
    });



    console.log('gameRooms :', gameServer.gameRooms);
  });

  // > entrance opponent to the GameRoom
  try {
    socket.on(events.ENTER_TO_GAME_ROOM, ({
      gameRoomId
    }) => {

      const playersCount = gameServer.getRoomPlayers(gameRoomId).size

      console.log('playersCount:', playersCount);

      if (playersCount === 2) {
        console.log('>>>>>>>>>>> max user');
      }

      gameServer.addRoomPlayer(gameRoomId, socket);

      console.log('players:', gameServer.getRoomPlayers(gameRoomId));




      // socket.broadcast
      //   .in(gameRoomId)
      //   .emit(events.OPPONENT_ENTRANCE_TO_GAME_ROOM, {
      //     message: `${socket.username} user has joined to GameRoom`
      //   });
      // console.log('gameRooms :', gameRooms);
    });
  } catch (error) {
    console.error('Entrance to the GameRoom error: ', error);
  }

  socket.on(events.SELECT_GESTURE, ({
    gameRoomId,
    gesture
  }) => {
    console.log('--------------------');
    console.log('> gesture: ', gesture);
    console.log('> gameRoomId: ', gameRoomId);
    console.log('> socket.id: ', socket.id);
    console.log('--------------------');

    // save selected gesture    
    gameRooms[gameRoomId].players[socket.id].selectedGesture = gesture;

    console.log('gameRooms :', gameRooms);


    const {
      players
    } = gameRooms[gameRoomId];


    // if everyone has already chosen

    const isAllHaveChosenGesture = Object.keys(players).reduce((result, key) => {
      if (!result) {
        return result
      }

      return !!players[key].selectedGesture

    }, true)


    console.log('isAllSelectedGgestures:', isAllHaveChosenGesture);




    // const isAllSelectGesture = (players) => players

    // learn the winner

    // send the result of the game to the participants

  });



  // Listen on disconnect (end game if participant is disconnect)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.use(router.routes());

server.listen(PORT, () => {
  console.log(colors.green.bold(`App is start ${cfg.server.host}:${PORT}`));
});

// var arr = ['Камень', 'Ножницы', 'Бумага'];

// var rand = Math.floor(Math.random() * arr.length);

// var result_02 = arr[rand];
// alert(result_02);

// var result_01 = prompt('Введите данные');

// if (arr.includes(result_01)) {
//   var win = [
//     ['Камень', 'Ножницы'],
//     ['Ножницы', 'Бумага'],
//     ['Бумага', 'Камень']
//   ].find(
//     (el, i) =>
//       (result_01 == el[0] && result_02 == el[1]) ||
//       (result_02 == el[0] && result_01 == el[1])
//   ) || ['Ничья'];
//   alert(win[0]);
// } else alert('Неверный ввод');