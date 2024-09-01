const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    development:{
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        port: process.env.PORT,
        logging: false
    }
}

