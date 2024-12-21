import express from 'express';
import { connectToDatabase } from './db';
import recipeRoutes from './recipes';
import ingredientRoutes from './ingredients';

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    try {
        const db = await connectToDatabase();
        console.log('Database connection established');

        app.use(express.json());

        app.use('/api/recipes', recipeRoutes);
        app.use('/api/ingredients', ingredientRoutes);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
})();