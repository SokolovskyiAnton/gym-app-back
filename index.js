require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const {routes} = require('./src/routes')


mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.urgqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongo is working.')).catch(e => console.log(e));

const app = express();
app.use(cookieParser())
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.forEach(item => {
    app.use(`/api/v1/${item}`, require(`./src/routes/${item}`))
})

const PORT = process.env.PORT || 5005;
http.createServer({}, app).listen(PORT);
console.log(`Server is working on port ${PORT}`)
