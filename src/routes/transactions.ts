import { db } from "../database.js"
import type { FastifyInstance } from "fastify"
import z from "zod"
import { checkSessionIdExists } from "../middleware/check-session-id-exists.js"


export async function transactionsRoutes(app: FastifyInstance) {
   

    app.get("/", { preHandler: [checkSessionIdExists] }, async (req, res) => {
        const { session_id } = req.cookies

        const transactions = await db("transactions")
            .select()
            .where({ session_id })

            return res.status(200).send(transactions)

    })

    app.get("/summary", { preHandler: [checkSessionIdExists] }, async (req, res) => {
       
        const {session_id} = req.cookies
       
        const summary = await db("transactions")
            .select()
            .where({session_id})
            .sum("amount", { as: "amount" })
            .first()

        return res.status(200).send(summary)

    })

    app.get("/:id", { preHandler: [checkSessionIdExists] }, async (req, res) => {

        const getTransactionsParamsSchema = z.object({
            id: z.string()
        })

        const { id } = getTransactionsParamsSchema.parse(req.params)
        const {session_id} = req.cookies

        const transaction = await db('transactions')
            .select()
            .where({
                session_id : session_id,
                id : id
            })
            .returning("*").first()

        if (!transaction) {
            return res.status(404).send({
                message: "Transação não encontrada"
            })
        }

        return res.status(200).send(transaction)
    })

    app.post("/", async (req, res) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let session_id = req.cookies.session_id

        if (!session_id) {
            session_id = crypto.randomUUID()
            res.cookie("session_id", session_id, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24,
            })
        }

        await db("transactions")
            .insert({
                id: crypto.randomUUID(),
                title,
                amount: type === "credit" ? amount : amount * -1,
                session_id: session_id
            })

        return res.status(201).send()

    })



    app.delete("/:id", async (req, res) => {

        const getTransactionsParamsSchema = z.object({
            id: z.string()
        })

        const { id } = getTransactionsParamsSchema.parse(req.params)

        const transactions = await db('transactions')
            .select()
            .where({ id }).returning("*").first()

        if (!transactions) {
            return res.status(404).send({
                message: "Transação não encontrada"
            })
        }

        await db("transactions")
            .delete()
            .where({ id })

        return res.status(204).send()
    })

}
