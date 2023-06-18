import { Geobot } from './model/Geobot';

if (!process.env.TOKEN) {
  throw new Error('No TOKEN found in env. Are you sure it\'s setup correctly?');
}

const bot = new Geobot(process.env.TOKEN || '');
bot.start()
  .then(() => {
    console.log('bot started, saying hello...');
    bot.sayHello();
  })
  .catch((error) => {
    console.log('Oh no! ', error);
  });
