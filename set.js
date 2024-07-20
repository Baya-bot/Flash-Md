const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUdNOFVjNUJ0RTZOVitpWm1NQkRuanpmS1d0bHUxSDZublV6dHo0VVNucz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieXB3RkltaFlMRG1LUVRLRU1GdUhxelEyU2JaZVJzZ3J0MTc5ckVEOUZFYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTSWMxTmRPeWpvWTMvQllCZ200Mmx2bWZQYUNtQnZyR1NReW5WRkJPOEdNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJKS3Nad3oyRkJlZmRDVDRna3ZJK3RNY2dSdFVCcWtyNlBMNTQ4Y3VPTUJzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVKSzh5VTFTcGwreEg1L1V3Z2kxTXJoTkdpOGI1R1orTGFZQ0gzY2xNbTA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlLbDVvbS9IK1V0MGViWTBURTRnWU1hRnI5NnNjY0JmWFowVHMwTmIzamM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0s5RWRYN1hKRU9ZVXMvOVBBSVgxUGJjZkkxVHVjLzRyS09LbUo1aFFHMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWlM5dE03UGM1YzZBQWRYc2tuUkcxVjRFWmtCa1NaSHYvVWRETS9xb1Ftaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVaNkZBUmRWS2tkK0dVcTZQYnoxK3lVL0R5M1lHZVo4eTZLcWpUbWlPWVloMnBqMzE2UGNzQWxQMWV3dmhzYVVqOE1wdW90WCtOUkhUbkZlQktMeEJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTgyLCJhZHZTZWNyZXRLZXkiOiJCQUxQQnIxNTJITzh3bjl5dkhZRGNVaTJIMlRkYUpjL1dubC9YNmUrOGR3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJTMVBLQWJsTVNteTJpTDRSa1hyeWxRIiwicGhvbmVJZCI6IjI0YjBiMjA0LWVlNmYtNGU5ZC1iMzAwLTE0YmVjMDM1ODVhNSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFczI5bVpOanV6KzhxNGtFRlFiSHZ6NFFEb2c9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMVMrLzRzdkVDbjhWYVpGZVozVi9CdGZlcTZFPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IldCTTc2TVo5IiwibWUiOnsiaWQiOiIyNzc0NzgxNTMyNjoyNEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT1c2NTVBQ0VQN3I3YlFHR0FNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQTJoUndPNEI5MWdmNTNGVEJEekNtVWVTeHRaZmZ4UVU5dldpYkM0MlhHMD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiU0loRS9ZTERqUjNTNXFBZW9PakVoK1JmMUVFSTZCV0xMdXNGcEpCdTdYWHJqQ3BNckF6OTVxZ0ZKeG9nOUhLd2ZCU3VUdjI4VUtoQ29YWEFHZDk4Q2c9PSIsImRldmljZVNpZ25hdHVyZSI6Imw0MWlVelJlcEZQZDc3V1UxNzYvbzY3eFRuZ3c4Ukg5VkhNSldDU3kwL2E4THVSMEFVd2lNSnFLV0FPQmFacDdZMUhDc2ZlTjhvaHlPSit1NjFhaUNnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc3NDc4MTUzMjY6MjRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUU5vVWNEdUFmZFlIK2R4VXdROHdwbEhrc2JXWDM4VUZQYjFvbXd1Tmx4dCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMTQ2NDMzMX0=',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Rengoku",
    OWNER_NUMBER : process.env.OWNER_NUMBER || "27747815326", 
             
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    BOT : process.env.BOT_NAME || 'FLASH-MD',
    //OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'off',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    PRESENCE : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_MESSAGE || "on",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
