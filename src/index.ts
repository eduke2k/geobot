import { Geobot } from './model/Geobot';

const bot = new Geobot(process.env.TOKEN || '');
bot.start()
  .then(() => {
    bot.sayHello();
  })
  .catch((error) => {
    console.log('Oh no! ', error);
  });
