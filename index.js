import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const uri = "mongodb://localhost:27017";


mongoose.connect(uri,
    ).then(()=>{
        console.log('MongoDB Connected')})
    .catch(()=>{
    console.log('error')})

const app = express();
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Welcome to the blog-a-tet!');
})

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        fullName: req.body.fullName,
    }, 'secret123');

    res.json ({
       success: true,
    })
})

app.listen(4444, (err) =>{
 if (err) console.log(err);
console.log('Server OK. Listening on port 4444')
});
