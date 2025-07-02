const connectToMongo=require('./db')
const express = require('express')

var cors = require('cors') //for running frontend and backend together
//provides a express middleware
// It allows controlled access to resources on a server from a different origin, enabling web applications to make API requests to external services.


connectToMongo();//funtion to connect mongo DB through moongose

const app = express()
const port = 5000 //port for backend

app.use(cors())
app.use(express.json({ limit: '10mb' }))//middleware required for req.body

app.get('/', (req, res) => { //testing
  res.send('Hello Sutau!')
})
app.use('/api/auth' , require('./routes/auth')) //for login/signup etc
app.use('/api/sketch' , require('./routes/sketch'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`) //nothing
})