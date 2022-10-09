const http = require('http')
const url = require('url')
const Const = require('../const')

const PORT = 3000;

module.exports.serve = function (cfg = {port: PORT}, database) {
    const handler = new Handler(database)
    const server = http.createServer(cors((req, resp) => {
        const u = url.parse(req.url, true);
        switch (u.pathname) {
            case '/generate':
                handler.generate(req, resp, u.query)
                return
            default:
                handler.tableRows(req, resp)
                return
        }
    }))

    server.listen(cfg.port, () => {
        console.log("server started:", cfg.port)
    })
}

class Handler {
    constructor(db) {
        this.db = db
    }

    async tableRows(req, resp) {
        req.on('error', (err) => {
            console.log('request error:', err);
        })

        const body = await readBody(req)

        let tableRowsReq
        try {
            tableRowsReq = JSON.parse(body)
        } catch (e) {
            console.log('body', body,'JSON.parse error', e)
            resp.writeHead(400)
            resp.end('Bad request')
            return
        }
        const err = validateTableRowsReq(tableRowsReq)
        if (!!err) {
            console.log('request invalid', err, tableRowsReq)
            resp.writeHead(400)
            resp.end(err)
            return
        }

        const orderBy = tableRowsReq.order_by
        const filter = tableRowsReq.filter
        const pagination = tableRowsReq.pagination

        try {
            const tableRows = await this.db.getTableRows(orderBy, filter, pagination)
            const json = JSON.stringify(tableRows)
            resp.writeHead(200, {'Content-Type': 'application/json'})
            resp.end(json)
        } catch (e) {
            console.log(`failed to get table rows: ${e}`)
            resp.writeHead(500)
            resp.end('Something went wrong')
        }
    }

    generate(req, resp, query) {
        let n = query['n']
        if (n < 0) n = 0
        if (n > 100) n = 100
        // TODO do it asynchronously
        this.db.generateRows(n)

        resp.writeHead(200)
        resp.end()
    }
}

function validateTableRowsReq(req) {
    if (!req ||
        !req.hasOwnProperty('order_by') ||
        !req.hasOwnProperty('filter') ||
        !req.hasOwnProperty('pagination')
    ) return 'invalid request'
    switch (req.order_by) {
        default:
            return `invalid request order_by: ${req.order_by}`
        case '':
        case Const.COLUMN_NAME:
        case Const.COLUMN_QUANTITY:
        case Const.COLUMN_DISTANCE:
    }
    if (!req.filter.hasOwnProperty('column') ||
        !req.filter.hasOwnProperty('condition') ||
        !req.filter.hasOwnProperty('value')) return 'invalid request filter'
    switch (req.filter.column) {
        default:
            return `invalid request filter column: ${req.filter.column}`
        case Const.COLUMN_DATE:
        case Const.COLUMN_NAME:
        case Const.COLUMN_QUANTITY:
        case Const.COLUMN_DISTANCE:
            switch (req.filter.condition) {
                default:
                    return `invalid request filter condition: ${req.filter.condition}`
                case Const.CONDITION_EQUAL:
                case Const.CONDITION_CONTAIN:
                case Const.CONDITION_GREATER_THAN:
                case Const.CONDITION_LESS_THAN:
            }
            break
        case '':
            if (req.filter.condition !== '') {
                return `invalid request filter condition: ${req.filter.condition}`
            }
    }

    if (!req.pagination.hasOwnProperty('limit') ||
        req.pagination.limit <= 0 ||
        !req.pagination.hasOwnProperty('offset') ||
        req.pagination.offset < 0) return 'invalid request pagination'
    if (req.pagination.limit > 100) req.pagination.limit = 100
    return null
}

function readBody(req) {
    return new Promise((resolve) => {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            resolve(body)
        });
    })
}

const ALLOW_HEADERS = 'Accept, Accept-Encoding, Cache-Control, Content-Type, Content-Length'
const ALLOW_METHODS = 'GET, POST, PUT, DELETE'
const MAX_AGE = '3600'
const METHOD_OPTIONS = 'OPTIONS'

function cors(next) {
    return (req, resp) => {
        const origin = req.headers['origin']
        if (!!origin && origin !== '') {
            resp.setHeader('Access-Control-Allow-Credentials', 'true')
            resp.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS)
            resp.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS)
            resp.setHeader('Access-Control-Max-Age', MAX_AGE)
            resp.setHeader('Access-Control-Allow-Origin', origin)
            if (req.headers["Method"] === METHOD_OPTIONS) {
                resp.writeHead(200)
                return
            }
        }
        next(req, resp)
    }
}
