
const express = require('express')

const dotenv = require('dotenv')
dotenv.config('./.env')

const morgan = require('morgan')

const cors = require('cors')

const cookieParser = require('cookie-parser')

const dbconnect = require('./dbconnect')

const authRouter = require('./routers/authRouter')
const postRouter = require('./routers/postRouter')
const userRouter = require('./routers/userRouter')
const demoRouter = require('./routers/demoRouter');
const fileUpload = require('express-fileupload');


const app = express()

//middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('common'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}
))
app.use(fileUpload({
    useTempFiles:true
}))

const PORT = process.env.PORT || 4001

dbconnect()
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

app.get('/', (req, res) => {
    res.status(200).send("Okay")
})

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/api', demoRouter)



