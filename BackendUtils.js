require('dotenv').config();
const { MongoClient } = require('mongodb');
const Console = require('./ConsoleUtils');

let client;
let db;

class BackendUtils {
  constructor() {
    this.collections = {};
  }

  async connect() {
    try {
      const uri = process.env.mongoUri;
      if (!uri) {
        Console.error('Database', 'mongoUri not found in .env');
        return;
      }

      client = new MongoClient(uri, {
        serverApi: { version: "1", strict: true, deprecationErrors: true },
      });

      await client.connect();
      db = client.db('StumbleRush');

      this.collections = {
        Users: db.collection('users'),
        Skins: db.collection('skins'),
        Animations: db.collection('animations'),
        Emotes: db.collection('emotes'),
        Footsteps: db.collection('footsteps'),
      };

      Console.log('Database', '✅ Connected successfully to MongoDB');
      await this.autoPopulateSharedData();
    } catch (error) {
      Console.error('Database', '❌ Connection error: ' + error.message);
    }
  }

  async autoPopulateSharedData() {
    try {
      Console.log('Populate', '🔄 Populando dados...');

      // Load shared.json if needed
      const fs = require('fs');
      let SharedData = {};
      if (fs.existsSync('./shared.json')) {
        SharedData = JSON.parse(fs.readFileSync('./shared.json', 'utf8'));
      }

      // Skins
      if (SharedData.Skins_v4?.length > 0) {
        await this.collections.Skins.deleteMany({});
        await this.collections.Skins.insertMany(SharedData.Skins_v4);
        Console.log('Populate', `✅ ${SharedData.Skins_v4.length} skins`);
      }

      Console.log('Populate', '✅ Dados populados!');
    } catch (e) {
      Console.error('Populate', e.message);
    }
  }
}

const backend = new BackendUtils();
backend.connect();

module.exports = BackendUtils;
