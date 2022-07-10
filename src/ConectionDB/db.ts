import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://destrada:Diego2022@cluster0.kfe9r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

export const connect = ()=>{
    mongoose.connect(MONGODB_URI,{
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('conectado a mongo db')
    })
    .catch ( error =>{
        console.error('error en la coneccion a mongo db', error.message )
    })
}