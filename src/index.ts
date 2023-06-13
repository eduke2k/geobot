import { Geobot } from './model/Geobot';

const bot = new Geobot(process.env.TOKEN || '');
bot.start()
  .then(() => {
    console.log('bot started, saying hello...');
    bot.sayHello();
  })
  .catch((error) => {
    console.log('Oh no! ', error);
  });
