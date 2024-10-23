const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
require('./src/config/db');
const authRouter = require('./src/routes/authRouter');
const logRouter = require('./src/routes/logRouter');


dotenv.config();

app.use(express.json());
app.use(cors());


app.use('/api/users', authRouter);
app.use('/api/logs', logRouter);




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})



