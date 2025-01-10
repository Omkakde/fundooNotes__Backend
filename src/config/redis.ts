const Redis = require('redis');
import Logger from './logger';
const logger = Logger.logger;
const redisClient = Redis.createClient();// created client
redisConnect(redisClient);
async function redisConnect(redisClient){
    await redisClient.connect(); //connect with database
    logger.info('connected to redis');
}
export default redisClient;