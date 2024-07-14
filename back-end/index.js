import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

import multer from "multer";
import cors from 'cors';

// const uri = "mongodb+srv://magistr25:123@cluster0.ns1uise.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27018/test"
mongoose.connect(uri,
    ).then(()=>{
        console.log('MongoDB Connected')})
    .catch(()=>{
    console.log('error')})

const app = express();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads') )

// app.get('/', (req, res) => {
//     res.send('Welcome to the blog-a-tet!');
// })

app.post('/auth/login', loginValidation, handleValidationErrors,  UserController.login);
app.post('/auth/register/', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/upload', checkAuth, upload.single('image'),
    (req, res) => {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        })
    })

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data: http://localhost:4444; script-src 'self'; style-src 'self'");
    next();
});

app.listen(4444, (err) =>{
 if (err) console.log(err);
console.log('Server OK. Listening on port 4444')
});
