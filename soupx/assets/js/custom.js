var plan = {};
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var goalIds = ['looseW', 'healthyEat', 'muscleG', 'detox', 'lightD', 'notS'];
var optionalItemIds = ['opt1', 'opt2', 'opt3'];
var prefIds = ['veg', 'nonVeg', 'vegan', 'egg'];
var allergenIds = ['noAllergen', 'nutFree', 'glutenFree'];
var fullMealcost = 0
var coupons = {
    'WELCOME': 300,
    'ANYTIMEFITNESS': 500,
    'GOLDGYM': 500,
    'CULTFIT': 500,
    'SOUPERSTAR': 50,
    'SOUPX50': 50,
    'GOWRI': 500,
    'PRINCY': 500,
    'AISHWARYA': 500
};
plan.fullMeal = 'No';
plan.preference = [];
plan.optionalItems = [];
plan.selected_plan = {name: 'Trial 7 Days', price: 1463, days: 7, coupon: null, discount: 0};
setSchedule();
function init(){
    $('#apply_coupon').on('click', function(e){
        e.preventDefault();
        applyCoupon();
    })
    $('#wrapped').on('submit', function(e){
        e.preventDefault();
        if(!setSchedule()) {
            $('#loader_form').css('display', '');
            return;
        }
        console.log(plan);
        var data = {
            name: $('#name').val(), 
            email: $('#email').val(), 
            phone: $('#phone').val(),
            address: $('#address_1').val() + ' ' + $('#address_2').val(),
            city: $('#city').val(),
            pincode: $('#pincode').val(),
            landmark: $('#landmark').val(), 
            plan: JSON.stringify(plan)
        };
        $.ajax({
            url: 'api/api.php',
            type: 'POST',
            data: data,
            success: function(response){
                response = JSON.parse(response);
                if(response.status){
                    payment(response.data);
                    // location.reload();
                } else{
                    alert('Error');
                }
            }
        });
    });

    var customPlanDays = "<option value='0'>Select Days</option>";
    for(let i = 2; i <= 28; i++){
        customPlanDays += `<option value="${i}">${i} Days</option>`;
    }
    $('#customDays').html(customPlanDays);
}

function buildCustomPlan(){
    let days = parseInt($('#customDays').val());
    let cost = (days <= 6)?239:(days > 6 && days <= 13)?209:(days > 13 && days <= 21)?189:(days > 21 && days <= 28)?169:0;
    let totalCost = days * cost;
    $('#customPlanCost').text(cost);
    $('#customPlanTotalCost').html(`<tiny>₹</tiny> ${totalCost}`);
    $('#noMeals').text(days);
    setPlan(`Custom ${days} Days`, totalCost, days, '4thp', '3rdp', '1stp', '2ndp');
}
function setStartDate(){
    plan.startDate = $('#startDate').val();
    console.log(plan);
}
function setOptionalItems(item, price, id){
    if(plan.optionalItems.includes(item)){
        plan.optionalItems.splice(plan.optionalItems.indexOf(item), 1);
        $(`#${id}`).parent().parent().css('background-color', 'white');
        // $(`#${id}`).parent().parent().css('color', 'black');
    } else{
        plan.optionalItems.push(item);
        $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
        // $(`#${id}`).parent().parent().css('color', 'white');
    }
    showPlanDetails();
    console.log(plan);
}
function setFullMeal(t, id, id_){
    plan.fullMeal = t;
    if(t == 'Yes') fullMealcost = 99;
    else fullMealcost = 0;
    showPlanDetails();
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id_}`).parent().parent().css('background-color', 'white');
    console.log(plan);
}
function setGoal(goal, id){
    plan.goal = goal;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for(let i = 0; i < goalIds.length; i++){
        if(goalIds[i] != id){
            $(`#${goalIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    }
    console.log(plan);
}
function setFoodPreference(pref, id){

    if(plan.preference.includes(pref)){
        plan.preference.splice(plan.preference.indexOf(pref), 1);
        $(`#${id}`).parent().parent().css('background-color', 'white');
        // $(`#${id}`).parent().parent().css('color', 'black');
    } else{
        plan.preference.push(pref);
        $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
        // $(`#${id}`).parent().parent().css('color', 'white');
    }

    /* plan.preference = pref;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for(let i = 0; i < prefIds.length; i++){
        if(prefIds[i] != id){
            $(`#${prefIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    } */
    console.log(plan);
}
function setAllergens(allergen, id){
    plan.allergens = allergen;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for(let i = 0; i < allergenIds.length; i++){
        if(allergenIds[i] != id){
            $(`#${allergenIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    }
    console.log(plan);
}

function setGender(gender, id, _id){
    plan.gender = gender;
    $(`#${id}`).parent().css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id}`).parent().css('color', 'white');
    $(`#${_id}`).parent().css('background-color', '');
    $(`#${_id}`).parent().css('color', '');
    console.log(plan);
}
function setBMIData(){
    let w = $('#weight').val();
    let a = $('#age').val();
    if(w < 0) w = w * -1;
    if(a < 0) a = a * -1;
    plan.height = $('#height').val();
    plan.weight = w;
    $('#weight').val(w);
    plan.age = a;
    $('#age').val(a);
    console.log(plan);
}
function setNotesAndNext(){
    plan.notes = $('#notes').val();
    $('#nextButton').trigger('click');
    $('#nextButton').css('display', '');
    
}
function setNotes(){
    plan.notes = $('#notes').val();
    console.log(plan);
}
function setMeal(meal, id){
    plan.meal = meal;
}

function setDays(day){
    // days.push(day);
    if(days.length == 0){
        days.push(day);
        // $(`#${id}`).css('background-color', '#c5c50c');
    } else {
        if(days.includes(day)){
            let index = days.indexOf(day);
            days.splice(index, 1);
            // $(`#${id}`).css('background-color', 'rgb(199, 193, 193)');
        } else {
            days.push(day);
            // $(`#${id}`).css('background-color', '#c5c50c');
        }
    }
    console.log(days);
}
function setSchedule(){
    if(days.length == 0){
        alert('Please select atleast one day');
        return false;
    } else{
        plan.days = days;
        return true;
    }
}
function setPlan(plan_name, plan_price, days, id, id_, id__, id___){
    plan.selected_plan = {name: plan_name, price: plan_price, days: days};
    $(`#${id}`).css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id_}`).css('background-color', '');
    $(`#${id__}`).css('background-color', '');
    $(`#${id___}`).css('background-color', '');
    showPlanDetails();
    console.log(plan);
}

function showPlanDetails(){
    let amt = parseFloat(plan.selected_plan.price);
    if(plan.optionalItems.length > 0){
        amt = amt + ((29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length);
    }
    amt += fullMealcost * parseInt(plan.selected_plan.days);
    $('#s_plan_name').val(plan.selected_plan.name);
    $('#s_plan_price').val(`₹ ${plan.selected_plan.price}`);
    $('#s_plan_addons').val(`₹ ${(29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length}`);
    $('#s_plan_fm').val(`₹ ${fullMealcost * parseInt(plan.selected_plan.days)}`);
    $('#s_plan_days').val(`${plan.selected_plan.days} Days`);
    $('#total_amount').text(`₹ ${amt}`);
}
function setTimeslot(){
    plan.timeslot = $('#timeslot').val();
    console.log(plan);
}

function applyCoupon(){
    let coupon = $('#coupon').val();
    if(coupon == ''){
        $('#coupon-error').addClass('text-danger');
        $('#coupon-error').text('Please enter coupon code');
    }
    else{
        coupon = coupon.toUpperCase();
        console.log(coupons[coupon]);
        if(plan.selected_plan.coupon != null && plan.selected_plan.coupon == coupon){
            $('#coupon-error').text('Coupon already applied');
        } else if(coupons[coupon] != undefined){
                            
            $('#coupon-error').removeClass('text-danger');
            // $('#coupon-error').text('Coupon applied successfully');
            $('#coupon-error').addClass('text-success');
            if(coupon == 'SOUPERSTAR'){
                let discount = parseInt(plan.selected_plan.price) * (coupons[coupon] / 100);
                coupons[coupon] = discount <= 600 ? discount : 600;
            } else if(coupon == 'SOUPX50'){
                let discount = parseInt(plan.selected_plan.price) * (coupons[coupon] / 100);
                coupons[coupon] = discount;
            }
            $('#coupon-error').text(`You saved ₹ ${coupons[coupon]} !`);
            plan.selected_plan.coupon = coupon;
            plan.selected_plan.discount = coupons[coupon];
            plan.selected_plan.price = parseInt(plan.selected_plan.price) - coupons[coupon];
            // $('#s_plan_price').val(plan.selected_plan.price);
            $('#coupon').prop('readonly', true);
            showPlanDetails();
            console.log(plan);
        }
        else{
            $('#coupon-error').removeClass('text-success');
            $('#coupon-error').text('Invalid coupon code');
            $('#coupon-error').addClass('text-danger');
        }
    }
}

 /* =================== Razorpay Checkout ==================== */
    
 function payment(id){
    var amt = parseFloat(plan.selected_plan.price);
    if(plan.optionalItems.length > 0){
        amt = amt + ((29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length);
    }
    amt += fullMealcost * parseInt(plan.selected_plan.days);
    $.ajax({
        url: './api/payment.php',
        method: 'POST',
        data: {action: 'initiateOrder', amount: amt, id: id},
        success: function(response){
            response = JSON.parse(response);
            console.log(response);
            // if(response.success){
                var options = {
                    "key": response.key_id, // Enter the Key ID generated from the Dashboard
                    "amount": response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
                    "currency": "INR",
                    "order_id": response.gateway_txn_id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
                    "handler": function (response){
                        console.log(response);
                        $.ajax({
                            url: './api/payment.php',
                            method: 'POST',
                            data: {paymentData: response, action: 'confirmOrder', amount: amt, id: id},
                            success: function(response){
                                console.log(response);
                                // response = JSON.parse(response);
                                if(response == 'success'){
                                    alert("Payemnt Successfull !!");
                                    location.reload(true);
                                } else{
                                    alert("Payment Failed !!");
                                }
                            }
                        });
                    },
                    "prefill": {
                        "name": $('#name').val(),
                        "email": $('#email').val(),
                        "contact": '+91'+$('#phone').val()
                    },
                };
                console.log(options);
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
                $('#loader_form').css('display', '');
            // }
        
        }
    });
}


init();
showPlanDetails();