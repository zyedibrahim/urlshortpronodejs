import express from 'express';
import shortid from "shortid"
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import cors from "cors"
const app = express();
const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL); // dial
app.use(express.json())
app.use(cors())
// Top level await
await client.connect(); // call
// console.log("Mongo is connected !!!  ");

const PORT = process.env.PORT;
app.post("/urlshort", async function (request, response) {

    const {url} = request.body



const dataurl = {
    longurl:url,
    // shorturl:`http://localhost:4000/${shortid.generate()}`,
    shorturl:`${process.env.PORT}/${shortid.generate()}`,
    Clickcount:0,
    date:new Date()
}


    const posturl = await client
    .db("urls")
.collection("urls&shorturl")
.insertOne(dataurl)

response.status(200).send({"url":"success fully inserted",dataurl})

});


app.get("/:shortcode", async function (request, response) {
 
    const getdata = await client
    .db("urls")
    .collection("urls&shorturl")
    .findOne({shorturl: `${process.env.PORT}/${request.params.shortcode}` })
    


    const data = await client
    .db("urls")
    .collection("urls&shorturl")
    .updateOne({shorturl: `${process.env.PORT}/${request.params.shortcode}` },{$set:{Clickcount: getdata.Clickcount +1 }} )



 response.redirect(getdata.longurl)  
   
   
   
       });
   
app.post("/urlcount", async function (request, response) {
 
 const {urlcheck} = request.body

try{

    const getdata = await client
    .db("urls")
    .collection("urls&shorturl")
    .findOne({shorturl: urlcheck })
    
    
   

        response.status(200).send({"status": "200 ok" ,clickcount:getdata?.Clickcount })
    


      
}

catch(err){
    response.status(400).send({status:"Not Found"})
}
   
   
       });
   
  




app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));