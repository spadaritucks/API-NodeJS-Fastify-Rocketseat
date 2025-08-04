import fastify from "fastify"
import { transactionsRoutes } from "./routes/transactions.js"
import cookie from '@fastify/cookie'


export const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
    prefix : "transactions"
})
