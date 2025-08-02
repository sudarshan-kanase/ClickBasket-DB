const pg = require('pg');
const con = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clickbasket', 
    password: 'Kana@7666',
    port: 5432,     // default PostgreSQL Port
});
module.exports = con;
