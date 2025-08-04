import { beforeEach } from 'node:test'
import { app } from '../src/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { execSync } from 'node:child_process'

describe("Transactions Routes", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it("should be able to create a new transaction", async () => {

        await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 1000,
                type: "credit"
            })
            .expect(201)


    })

    it("should be able to get a specific transaction  ", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 1000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get("Set-Cookie")



        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies || [])
            .expect(200)


        const transactionId = listTransactionsResponse.body[0].id

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set("Cookie", cookies || [])
            .expect(200)

        expect(getTransactionResponse.body).toEqual(
            expect.objectContaining({
                title: "New Transaction",
                amount: 1000,
            })
        )

    })


    it("should be able to list all transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 1000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get("Set-Cookie")



        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies || [])
            .expect(200)

        expect(listTransactionsResponse.body).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: 1000,
            })
        ])

    })

    it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies || [])
      .send({
        title: 'Debit transaction',
        amount: 1000,
        type: 'credit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(summaryResponse.body).toEqual({
      amount: 2000,
    })
  })


})

