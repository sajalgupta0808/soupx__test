// const { inArray } = require("jquery");
var cookies = document.cookie.trim().split('; ');
var token = "";
var data = {};
var days = new Array(0);

for(var i = 0; i < cookies.length; i++){
    var cookie = cookies[i].split('=');
    if(cookie[0] == "token"){
        token = "JWT "+cookie[1];
    } if(cookie[0] == "usertype"){
        usertype = cookie[1];
    }
}

function setGoal(goal, id){
    data.goal = goal;
    $('#step_1').css('display', 'none');
    $('#step_2').fadeIn(400);
}
function setGender(gender){
    data.gender = gender;
    console.log(data);
    $('#step_2').css('display', 'none');
    $('#step_3').fadeIn(400);
}
function setBMIData(){
    data.height = $('#height').val();
    data.weight = $('#weight').val();
    data.age = $('#age').val();
    console.log(data);
    $('#step_3').css('display', 'none');
    $('#step_4').fadeIn(400);
}

function setMeal(meal, id){
    data.meal = meal;
    $('#step_4').css('display', 'none');
    $('#step_5').fadeIn(400);
}

function setDays(day, id){
    // days.push(day);
    if(days.length == 0){
        days.push(day);
        $(`#${id}`).css('background-color', '#c5c50c');
    } else {
        if(days.includes(day)){
            let index = days.indexOf(day);
            days.splice(index, 1);
            $(`#${id}`).css('background-color', 'rgb(199, 193, 193)');
        } else {
            days.push(day);
            $(`#${id}`).css('background-color', '#c5c50c');
        }
    }
    console.log(days);
}
function setSchedule(){
    if(days.length == 0){
        alert('Please select atleast one day');
    } else{
        data.days = days;
        $('#step_5').css('display', 'none');
        $('#step_6').fadeIn(400);
    }
}