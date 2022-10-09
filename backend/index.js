const server = require('./server/server')
const database = require('./postgres/database')

// TODO move to config file
const cfg = {
    server: {
        port: 3000
    },
    postgres: {
        host: "postgres",
        port: "5432",
        user: "postgres",
        password: "postgres",
        database: "postgres",
    }
};

(async _ => {
    const db = new database.Database()
    const err = await db.connect(cfg.postgres)
    if (!!err) {
        console.log(`failed to create database ${err}`)
        process.exit(1)
    }
    server.serve(cfg.server, db)
})()


