import express from 'express'
import cors from 'cors'
import { PORT } from './utils/config.js'
import authRouter from './routes/authRouter.js'

const app=express()

app.use(express.json())
app.use(cors())

const routes=[
    authRouter
]

routes.forEach((route)=>{
    app.use(authRouter)
})

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})