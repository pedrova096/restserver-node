process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ============
// Token
// ============
// 60 seg * 60 min * 24 hrs * 30 dias 

// process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;
process.env.TOKEN_EXPIRES = '48h';

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

//Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '151160252017-eo1qencduvqj81im1d30iceqenlh1l36.apps.googleusercontent.com';