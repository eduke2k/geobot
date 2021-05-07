import { Geobot } from './model/Geobot';
import * as dotenv from 'dotenv';

const bot = new Geobot(dotenv.config().parsed.TOKEN);
bot.start()
  .then(() => {
    // bot.sayHello();
  })
  .catch((error) => {
    console.log('Oh no! ', error);
  });
