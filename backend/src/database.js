const { MongoClient } = require('mongodb');

const database = module.exports;

database.connect = async function connect() {
  database.client = await MongoClient.connect('mongodb+srv://imamerusman:Nd5WxdB5vZiFGNhG@test.wvuhkja.mongodb.net/todos', { useUnifiedTopology: true });
};
