// no templates in ctx example
import pug from 'pug';

exports.init = app =>
  app.use(async (ctx, next) => {
    // in the future we'll extend this
    ctx.render = (templatePath, locals) => pug.renderFile(templatePath, locals);

    await next();
  });
