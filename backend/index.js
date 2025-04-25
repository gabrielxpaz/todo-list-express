const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
//Rotas
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) =>{
    res.send('API TO-DO LIST funcionando')
})


app.listen(port, (err) =>{
    console.log('Server is running on port 3000');
})