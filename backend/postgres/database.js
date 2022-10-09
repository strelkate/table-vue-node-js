const {Pool} = require('pg')
const Const = require('../const')

const defaultConfig = {
    host: "postgres",
    port: "5432",
    user: "postgres",
    password: "postgres",
    database: "postgres",
}

class Database {
    constructor() {
    }

    connect(cfg = defaultConfig) {
        return new Promise((resolve) => {
            const pool = new Pool(cfg)
            pool.connect(err => {
                if (!!err) {
                    const e = `failed to connect to the database ${err}`
                    console.log(e)
                    resolve(e)
                    return
                }
                console.log('successfully connected to the database')
                migrations.forEach(async m => {
                    await dbQuery(pool, m)
                })

                this.db = pool
                resolve()
            })
        })
    }

    async getTableRows(orderBy, filter, pagination) {
        const fields = [pagination.offset, pagination.limit]
        let nextParamIndex = 3

        const order = buildOrderBy(orderBy)
        const where = buildWhere(filter, nextParamIndex)
        if (where !== '') {
			let value = filter.value
			if (filter.condition === Const.CONDITION_CONTAIN) {
				value = `%${filter.value}%`
			}
			fields.push(value)
		}
        const q = `select date, name, quantity, distance
                   from table_rows ${where} ${order}
                   offset $1 limit $2`
        try {
            const result = await dbQuery(this.db, q, fields)
            return result.rows
        } catch (err) {
            console.log('getTableRows query:', q, '\n', err)
            return []
        }
    }

    insertTableRow(tr) {
        const q = "insert into table_rows(name, quantity, distance) values ($1, $2, $3)"
        dbQuery(this.db, q, [tr.name, tr.quantity, tr.distance])
    }

    generateRows(n = 0) {
        for (let i = 0; i < n; i++) {
            const tr = {
                name: names[randIntN(10)],
                quantity: randIntN(100),
                distance: randIntN(100),
            }
            this.insertTableRow(tr)
        }
    }
}

function buildOrderBy(orderBy) {
    switch (orderBy) {
        default:
            throw 'unsupported order by column'
        case '':
            return ''
        case Const.COLUMN_NAME:
        case Const.COLUMN_QUANTITY:
        case Const.COLUMN_DISTANCE:
    }
    return `order by ${orderBy}`
}

function buildWhere(filter) {
    if (!filter ||
        !filter.hasOwnProperty('column') ||
        !filter.hasOwnProperty('condition') ||
        !filter.hasOwnProperty('value')) throw 'unsupported filter condition'
    switch (filter.column) {
        default:
            throw 'unsupported filter column'
        case '':
        case Const.COLUMN_DATE:
        case Const.COLUMN_NAME:
        case Const.COLUMN_QUANTITY:
        case Const.COLUMN_DISTANCE:
    }
    let condition = ''
    switch (filter.condition) {
        default:
            throw 'unsupported filter condition'
        case '':
            return ''
        case Const.CONDITION_EQUAL:
            condition = '='
            break
        case Const.CONDITION_CONTAIN:
            switch (filter.column) {
				case Const.COLUMN_DATE:
                case Const.COLUMN_QUANTITY:
                case Const.COLUMN_DISTANCE:
                    throw `unsupported filter condition for column: ${filter.column}`
            }
            condition = 'LIKE'
            break
        case Const.CONDITION_GREATER_THAN:
            if (filter.column === Const.COLUMN_NAME) {
                throw `unsupported filter condition for column: ${filter.column}`
            }
            condition = ">"
            break
        case Const.CONDITION_LESS_THAN:
            if (filter.column === Const.COLUMN_NAME) {
                throw `unsupported filter condition for column: ${filter.column}`
            }
            condition = "<"
            break
    }
    return `where ${filter.column} ${condition} $3`
}

function dbQuery(db, query, fields = []) {
    return new Promise((resolve, reject) => {
        db.query(query, fields, (err, result) => {
			console.log('query:', query, '\nfields:', fields)
            if (!!err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}

const names = ["coach", "repeat", "superintendent", "policy", "weight", "behavior", "cheese", "outer", "victory", "bomb"]

function randIntN(n = 10) {
    return Math.floor(Math.random() * n)
}

// language=SQL format=false
const migrations = [
    `create table if not exists table_rows(
        id bigserial primary key,
        date timestamp with time zone not null default now(),
        name varchar(255) not null,
        quantity bigint not null,
        distance bigint not null
    )`
]

module.exports = {
	Database,
}
