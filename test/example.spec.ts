import { app } from '../src/app.js'
import request from 'supertest'
import { afterAll, beforeAll, expect, test } from 'vitest'


beforeAll(async () => {
    await app.ready()
})

afterAll(async () => {
    await app.close()
})

test("o usuario consegue criar uma transação", async () => {
    
    await request(app.server)
    .post("/transactions")
    .send({
        title: "New Transaction",
        amount : 1000,
        type : "credit"
    })
    .expect(201)

    
})