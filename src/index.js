import Koa from 'koa';
import Router from 'koa-router';
import cfg from 'config';
import colors from 'colors';
import http from 'http';
import socketIO from 'socket.io';

// const app = new Koa()
// var server = require('http').createServer(app.callback())
// var io = require('socket.io')(server)
// server.listen("your port", "your host")

import middlewares from './middlewares';

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socketIO(server);

const PORT = cfg.server.port;

Object.keys(middlewares).forEach(middleware => {
  middlewares[middleware].init(app);
});

io.on('connection', socket => {
  console.log('a user connected');
});

router.get('/hi', async (ctx, next) => {
  ctx.body = '<h1>Hello world</h1>';
  console.log('Hi!!');
});

router.get('/views', async (ctx, next) => {
  //   let count = ctx.session.count || 0;
  //   count += 1;
  //   ctx.session.count = count;

  ctx.body = ctx.render('./templates/index.pug', {
    user: 'John',
    count: 0
  });
});

app.use(router.routes());

server.listen(PORT, () => {
  console.log(colors.green.bold(`App is start ${cfg.server.host}:${PORT}`));
});
