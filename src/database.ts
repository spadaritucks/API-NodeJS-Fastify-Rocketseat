import knex from "knex";
import type { Knex } from "knex";
import "dotenv/config"
import { env } from "./env/index.js";




export const config : Knex.Config = {
    client: "sqlite3",
    connection: {
        filename:  env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations : {
        extension : "ts",
        directory : "./db/migrations"
    }
}


export const db = knex(config);