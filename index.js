const axios = require('axios');
const disCommunitiy = 'Elkhart Indiana PoGo';
const hookcord = require('hookcord');
const discAppId = '639182476018712608';
const moment = require("moment");
const discSecret = 'd7YdC4HtfC2BNtLHUHjuWXIWQiKZmFDcHQP7JQSdkJhh7q25vFclbbVlPCbqbexhrZJH';
const Hook = new hookcord.Hook();

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
            if ( results[raid]['community'].name === disCommunitiy || results[raid]['community'].name === 'tetstServo12' ){
                let disMsg = '';
                if((results[raid]['form']) === null){
                    let ahora =   moment().format();
                        ahora =  moment(ahora);
                    let hatchtime =  moment(results[raid]['hatch_time']);
                    let diffe =  await calculateMinutes(ahora,hatchtime);   
                        diffe = Math.ceil(diffe);
                    let gym_name = results[raid]['gym']['name'];
                    let tier = results[raid]['egg_tier'];
                   // console.log(results[raid]);
                    let data = {boss_name: 'tbd', gym_name: gym_name, end_time: diffe, hatched: 0, type: 'egg',tier:tier};
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
                        diffe = Math.ceil(diffe);
                    let gym_name = results[raid]['gym']['name'];
                    let tier = results[raid]['form']['raid_boss_level'];
                    let boss_name = results[raid]['form']['name'];
                    //console.log(results[raid]);
                    let data = {boss_name: boss_name, gym_name: gym_name, end_time: diffe, hatched: 0, type: 'raid',tier:tier};    
                    disMsg = "$raid "+boss_name+' "'+gym_name+'" '+diffe+" mins";
                    console.log(data,disMsg);
                    await axios_push('https://elkhartraids.website/api/raid/create', data);
                    await Hook.setPayload({
                        "content": disMsg
                        })
                    await Hook.fire()
                        .then(response_object => {
                        })
                        .catch(error => {
                        throw error;
                        })

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
        console.error(error.response.status);
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
getRaidsData('https://api.pokenavbot.com/raids/v1/stream/?lookback=2');
var minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
  //console.log("I am doing my 5 minutes check");
  // do your stuff here
  //Elkhart Indiana PoGo
getRaidsData('https://api.pokenavbot.com/raids/v1/stream/?lookback=2');
}, the_interval);

