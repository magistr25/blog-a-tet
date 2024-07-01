import express from 'express';
import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from "./validations.js";
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'



// const uri = "mongodb+srv://magistr25:123@cluster0.ns1uise.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27017/test"
mongoose.connect(uri,
    ).then(()=>{
        console.log('MongoDB Connected')})
    .catch(()=>{
    console.log('error')})

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Welcome to the blog-a-tet!');
// })

app.post('/auth/login', loginValidation, UserController.login);

app.post('/auth/register/', registerValidation, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe)

// app.get('/posts', Post.Controller.getAll)
// app.get('/posts:id', Post.Controller.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
// app.delete('/posts', Post.Controller.remove)
//app.patch('/posts', Post.Controller.update)

app.listen(4444, (err) =>{
 if (err) console.log(err);
console.log('Server OK. Listening on port 4444')
});
