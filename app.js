//jshint esversion: 6

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const app = express()

const MAIL_API_KEY = 'c23a60d23a657d40d7420ef552423918-us5'
const LIST_ID = 'b0caad4315'

app.use(express.static('public'));
// app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/fail", (req, res) => {
    res.sendFile(__dirname + "/failure.html")
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)
    const url = 'https://us5.api.mailchimp.com/3.0/lists/b0caad4315'
    const options = {
        method: "POST",
        auth: "jiran:c23a60d23a657d40d7420ef552423918-us5",
    }

    const request = https.request(url, options, (response) => {

        response.statusCode === 200
            ? res.sendFile(__dirname + '/success.html')
            : res.sendFile(__dirname + '/failure.html')




        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()

})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})