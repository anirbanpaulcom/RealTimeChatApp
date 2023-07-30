const mongoose = require("mongoose");

exports.connectDataBase = ()=> {

    const MongoURL = "mongodb://127.0.0.1:27017/chat";

    mongoose.connect( MongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).
    then(()=> {
        console.log("Database is now connected")
    })
    .catch((error)=> {
    console.log(error);
    });
    
}