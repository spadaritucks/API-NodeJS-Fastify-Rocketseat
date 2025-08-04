import { app } from '../src/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'

describe("Transactions Routes", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
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
})

