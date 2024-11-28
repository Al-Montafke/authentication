const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.uri;
const client = new MongoClient(uri);
let connected = false;

async function connect() {
    if (connected) return client;
    
    for (let tries = 3; tries > 0; tries--) {
        try {
            await client.connect();
            console.log('Connected to the database!');
            connected = true;
            return client;
        } catch (err) {
            console.log(`There was an error connecting to the database: ${err}`);
            console.log(`Retrying... ${tries - 1} tries left.`);
            if (tries > 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    throw new Error('Max tries reached!');
}
module.exports = { connect };

