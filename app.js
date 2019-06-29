require('dotenv').config();
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    var data = {
        members:[
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    var options = {
        url: 'https://us3.api.mailchimp.com/3.0/lists/'+process.env.unique_ID,
        method: 'POST',
        headers: {
            'Authorization': 'Binu ' + process.env.key
        },
        body: jsonData
    };

    request(options, function(error, response, body){
        if(error){
            res.sendFile(__dirname + "/failure.html");
        }
        else{
            if(res.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
});

app.listen(process.env.PORT || 8000, function(req, res){
    console.log('Server is running at port 8000');
});

