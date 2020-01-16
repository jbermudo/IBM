var express = require('express');
var app = express();

app.use(express.static(__dirname + "/app"));

// app.get('/contactlist',function (req, res){
//     console.log("Received");
//     var person1 = {
//         name: "tim",
//         email: "tim@yahoo.com",
//         number: "(+639495954682)"
//     }
    
//     var person2 = {
//         name: "james",
//         email: "james@yahoo.com",
//         number: "(+639495954682)"
//     }

//     var contactlist = [person1, person2];
//     res.json(contactlist);
// });


app.listen(8000);
console.log("Server running on port 8000");