import env from 'bun:env';
export const confirg = {
    api_url: env.API_URL,
    api_port: env.API_PORT,
    mongo_url: env.MONGO_URL,
}