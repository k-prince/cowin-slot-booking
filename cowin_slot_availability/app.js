// Kumar Prince //
var express= require('express')
var bodyParser = require('body-parser')
var rp = require('request-promise');
var player = require('play-sound')(opts = {})
const https = require('https')
const port = 8000;
const app = express();
var intervalObj = null;
var age_limit = 18;             // Give your preferred age limit
var pincode = 813203; //560078;           // Give your pincode
var fromDate = '18-05-2021';    // Give your preferred date

app.use(bodyParser.json());

app.listen(port,() => {
    console.log(`Node App listening at http://localhost:${port}`)
    
    intervalObj = setInterval(() => {
        var options = {
            uri: 'http://localhost:8000/',
            method: 'GET',
            json: true,
            headers : {
                'Accept': 'application/json'
            }
        };
        rp(options)
        .then(function (parsedBody) {
            console.log('Finding available slots... Please wait...');
        })
      }, 5000);

  });
app.get('/',(req,res)=>{
    res.status(200).send(`App is running on port ${port}`)
    try
    {
        var options = {
            uri: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+ pincode +'&date='+ fromDate,
            method: 'GET',
            json: true,
            headers : {
                'Accept': 'application/json'
            }
        };
        rp(options)
        .then(function (parsedBody) {
            //console.log('Successfull : ', parsedBody);
            parsedBody.centers.forEach(function(center){
                center.sessions.forEach(function(availableSlots){
                    //console.log('Vaccine: ', availableSlots.vaccine);
                    //console.log('Available capacity: ', availableSlots.available_capacity);
                    //console.log('Minimum age limit', availableSlots.min_age_limit);
                    if(availableSlots.min_age_limit == age_limit && (availableSlots.available_capacity > 0 || availableSlots.available_capacity_dose1 > 0)){
                        console.log('********* Hurrayy! Slots are available :-) ********** Visit https://www.cowin.gov.in/home for booking ******');
                        console.log('Centers name------------------------------Vaccine--------------------Available capacity----------',);
                        console.log(center.name, '          ' , availableSlots.vaccine, '                    ', availableSlots.available_capacity);
                        clearInterval(intervalObj);
                        player.play('./resources/beep.mp3', function(err){
                            console.log('Audio playing...');
                        })
                    }
                });
            });
        })
        .catch(function (err) {
            console.log('Failed response: ', JSON.stringify(err));
            res.status(400).send(JSON.stringify(err));
        });
    }
     catch(ex){console.log('Ex Occurred',ex);}
})