const express = require("express");
const  bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();
const { Console } = require("console");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(response, request){
    request.sendFile(__dirname+"/index.html");
});

app.post("/", function(request, response){
    console.log("working")
    var email = request.body.Email;
    var name = request.body.Name;
    console.log("Email Adress: "+email);
    console.log("Name: "+name);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/67dde331f1";
    const api_key = process.env.API_KEY;
    console.log(api_key);

    const options = {
        method: "POST",
        auth: "user:"+api_key
    }

   const req =  https.request(url, options, function(res){

        if(res.statusCode == 200){
            response.sendFile(__dirname+"/sucess.html");
        } else {
            response.sendFile(__dirname+"/fail.html");
        }

        res.on("data", function(data){
            console.log(JSON.parse(data));
        })

    });

        req.write(jsonData);
        req.end();
     

});

app.post("/failure", function(request, response){
    response.redirect("/")
});

app.listen(process.env.PORT || 8000,function(){
    console.log("Server Running on port 8000:");
});