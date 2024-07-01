import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {registerValidation} from "./validations/auth.js";
import {validationResult} from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';


// const uri = "mongodb+srv://magistr25:123@cluster0.ns1uise.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27017/test"


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

app.post('/auth/login', async (req, res) => {
    try{
        const user = await UserModel.findOne({
            email: req.body.email,
        });

        if (!user) {
            return req.status(404).json({
                message: 'User not found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid login or password',
            })
        }
        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', {expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token})

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }

})

app.post('/auth/register/', registerValidation, async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, 'select123', {expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token})
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData
        })
    }
    catch(err)
    {console.log("err");
    res.status(500).json({
        message: 'Не удалось авторизоваться'
    })
    }
})



app.listen(4444, (err) =>{
 if (err) console.log(err);
console.log('Server OK. Listening on port 4444')
});
