const axios = require('axios');
const disCommunitiy = 'Elkhart Indiana PoGo';
const hookcord = require('hookcord');
const discAppId = '642420862556831747';
const moment = require("moment");
const discSecret = '18NqGx23udELcitv9HIlK4vs2Y2V4lCESFed3XCOgXWEX_eio3pdwPcCuhQUw78vdE2q';
const Hook = new hookcord.Hook();


//https://discordapp.com/api/webhooks/642420862556831747/18NqGx23udELcitv9HIlK4vs2Y2V4lCESFed3XCOgXWEX_eio3pdwPcCuhQUw78vdE2q

Hook.login(discAppId, discSecret);

async function getRaidsData(url){

    raids_data = await axios.get(url).then( response => {
        raid_data = response.data;
        return raid_data;
    }).catch(error => {
        console.error(error);
    });

    let results = raids_data.results;

    for(let raid in results){
        //console.log(raid);
            if ( results[raid]['community'].name === disCommunitiy  || results[raid]['community'].name === 'tetstServo12'  || results[raid]['community'].name === 'Elkhart Raids' ){
                let disMsg = '';
                if((results[raid]['form']) === null){
                    let ahora =   moment().format();
                        ahora =  moment(ahora);
                    let hatchtime =  moment(results[raid]['hatches']);
                    let diffe =  await calculateMinutes(ahora,hatchtime);
                    diffe = Math.floor(Math.ceil(diffe) -2);

                    let gym_name = results[raid]['gym']['name'];
                    let tier = results[raid]['egg_tier'];
                   // console.log(results[raid]);
                    let data = {boss_name: 'tbd', gym_name: gym_name, end_time: diffe, hatched: 0, type: 'egg',raid_tier:tier};
                    disMsg = "$egg "+tier+' "'+gym_name+'" '+diffe+" mins";
                    console.log(data,disMsg);
                    await axios_push('https://elkhartraids.website/api/raid/create', data);

                    Hook.setPayload({
                        "content": disMsg
                        })
                    await Hook.fire()
                        .then(response_object => {
                        })
                        .catch(error => {
                        throw error;
                        })
                    
                }else{
                    let ahora = moment().format();
                      ahora = moment(ahora);
                    let endTime = moment(results[raid]['ends']);
                    let diffe =  await calculateMinutes(ahora,endTime);
                        diffe = Math.floor(Math.ceil(diffe) -2);

                    let gym_name = results[raid]['gym']['name'];
                    let tier = results[raid]['form']['raid_boss_level'];
                    let boss_name = results[raid]['form']['name'];
                    //console.log(results[raid]);
                    let data = {boss_name: boss_name, gym_name: gym_name, end_time: diffe, hatched: 1, type: 'raid',raid_tier:tier};
                    disMsg = "$raid "+boss_name+' "'+gym_name+'" '+diffe+" mins";
                    console.log(data,disMsg);
                    await axios_push('https://elkhartraids.website/api/raid/create', data);
                    await Hook.setPayload({
                        "content": disMsg
                        });
                    await Hook.fire()
                        .then(response_object => {
                        })
                        .catch(error => {
                        throw error;
                        });

                }     


            }
    }

//console.log(results);


}module.exports.getRaidsData = async function(url){
    await getRaidsData(url);
};

async function axios_push(url, data){
    await axios.post(url, data)
        .then((res) => {
           // console.log(`statusCode: ${res.status}`,data);
           console.log(res.status,data);
        }).catch(error => {
        console.error(error.response);
    });
}module.exports.axios_push = async function(url,data){
    await axios_push(url,data);
};

async function calculateMinutes(startDate,endDate)
{
   var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
   var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
   var duration = moment.duration(end_date.diff(start_date));
   var minutes = duration.asMinutes();
   //minutes = Math(minutes * 60);       
   return minutes;
}

//

function startPokeNavListener() {
    console.log('the pokenav listener is waking up');
    getRaidsData('https://api.pokenavbot.com/raids/v1/stream/?lookback=2');

    var minutes = 2, the_interval = minutes * 60 * 1000;

    setInterval(function () {
     getRaidsData('https://api.pokenavbot.com/raids/v1/stream/?lookback=2');
    }, the_interval);
}module.exports.startPokeNavListener = function(){
    startPokeNavListener();
};

