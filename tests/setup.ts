import { config } from 'dotenv'
import path from 'path'

// Load .env variables from the root of the project
config({ path: path.resolve(__dirname, '../.env') })
