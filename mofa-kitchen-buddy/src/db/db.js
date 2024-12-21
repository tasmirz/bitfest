import { MongoClient } from 'mongodb';
import { confirg } from '../config';

const client = new MongoClient(confirg.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export { connectToDatabase, client };