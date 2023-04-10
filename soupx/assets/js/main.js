var step = 1;
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
$(function() {

    $('.wizard > .steps li a').click(function() {
        $(this).parent().addClass('checked');
        $(this).parent().prevAll().addClass('checked');
        $(this).parent().nextAll().removeClass('checked');
    });
    // Custome Jquery Step Button
    $('.forward').click(function() {
        if(validateSteps()){
            $("#wizard").steps('next');
        }
    })
    $('.backward').click(function() {
        $("#wizard").steps('previous');
    })
    // Select Dropdown
    $('html').click(function() {
        $('.select .dropdown').hide();
    });
    $('.select').click(function(event) {
        event.stopPropagation();
    });
    $('.select .select-control').click(function() {
        $(this).parent().next().toggle();
    })
    $('.select .dropdown li').click(function() {
        $(this).parent().toggle();
        var text = $(this).attr('rel');
        $(this).parent().prev().find('div').text(text);
    })

    $('[data-toggle="tooltip"]').tooltip();


    $(document).ready(function() {
        $(".custom-file-input").on("change", function() {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });

        $('#slider-service').slick({
            dots: true,
            rows: 2,
            arrows: false,
            infinite: true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    rows: 2,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    rows: 1,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    rows: 1,
                    dots: false,
                    arrows: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ]
        });

    });


})




//multi form ===================================
//DOM elements
const DOMstrings = {
    stepsBtnClass: 'multisteps-form__progress-btn',
    stepsBtns: document.querySelectorAll(`.multisteps-form__progress-btn`),
    stepsBar: document.querySelector('.multisteps-form__progress'),
    stepsForm: document.querySelector('.multisteps-form__form'),
    stepFormPanelClass: 'multisteps-form__panel',
    stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
    stepPrevBtnClass: 'js-btn-prev',
    stepNextBtnClass: 'js-btn-next'
};


//remove class from a set of items
const removeClasses = (elemSet, className) => {

    elemSet.forEach(elem => {

        elem.classList.remove(className);

    });

};

//return exect parent node of the element
const findParent = (elem, parentClass) => {

    let currentNode = elem;

    while (!currentNode.classList.contains(parentClass)) {
        currentNode = currentNode.parentNode;
    }

    return currentNode;

};

//get active button step number
const getActiveStep = elem => {
    return Array.from(DOMstrings.stepsBtns).indexOf(elem);
};

//set all steps before clicked (and clicked too) to active
const setActiveStep = activeStepNum => {

    //remove active state from all the state
    removeClasses(DOMstrings.stepsBtns, 'js-active');

    //set picked items to active
    DOMstrings.stepsBtns.forEach((elem, index) => {

        if (index <= activeStepNum) {
            elem.classList.add('js-active');
        }

    });
};

//get active panel
const getActivePanel = () => {

    let activePanel;

    DOMstrings.stepFormPanels.forEach(elem => {

        if (elem.classList.contains('js-active')) {

            activePanel = elem;

        }

    });

    return activePanel;

};

//open active panel (and close unactive panels)
const setActivePanel = activePanelNum => {

    const animation = $(DOMstrings.stepFormPanels, 'js-active').attr("data-animation");

    //remove active class from all the panels
    removeClasses(DOMstrings.stepFormPanels, 'js-active');
    removeClasses(DOMstrings.stepFormPanels, animation);
    // removeClasses(DOMstrings.stepFormPanels, 'js-active', 'animate__animated', animation);
    removeClasses(DOMstrings.stepFormPanels, 'animate__animated');

    //show active panel
    DOMstrings.stepFormPanels.forEach((elem, index) => {
        if (index === activePanelNum) {

            elem.classList.add('js-active');
            // stepFormPanels
            elem.classList.add('animate__animated', animation);

            setTimeout(function() {
                removeClasses(DOMstrings.stepFormPanels, 'animate__animated', animation);
            }, 1200);

            setFormHeight(elem);

        }
    });

};


//set form height equal to current panel height
const formHeight = activePanel => {

    const activePanelHeight = activePanel.offsetHeight;

    DOMstrings.stepsForm.style.height = `${activePanelHeight}px`;

};

const setFormHeight = () => {
    const activePanel = getActivePanel();

    formHeight(activePanel);
};

//STEPS BAR CLICK FUNCTION
DOMstrings.stepsBar.addEventListener('click', e => {

    //check if click target is a step button
    const eventTarget = e.target;

    if (!eventTarget.classList.contains(`${DOMstrings.stepsBtnClass}`)) {
        return;
    }

    //get active button step number
    const activeStep = getActiveStep(eventTarget);

    //set all steps before clicked (and clicked too) to active
    setActiveStep(activeStep);

    //open active panel
    setActivePanel(activeStep);
});

//PREV/NEXT BTNS CLICK
DOMstrings.stepsForm.addEventListener('click', e => {

    const eventTarget = e.target;
    console.log(eventTarget);

    //check if we clicked on `PREV` or NEXT` buttons
    if (!(eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`) || eventTarget.classList.contains(`${DOMstrings.stepNextBtnClass}`))) {
        return;
    }

    //find active panel
    const activePanel = findParent(eventTarget, `${DOMstrings.stepFormPanelClass}`);

    let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);

    //set active step and active panel onclick
    if (eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`)) {
        step -= 1;
        activePanelNum--;

    } else {
        if(!validateSteps()){
            return;
        }
        step += 1;
        activePanelNum++;

    }

    setActiveStep(activePanelNum);
    setActivePanel(activePanelNum);

});

function init(){
    $('#apply_coupon').on('click', function(e){
        e.preventDefault();
        applyCoupon();
    })
    $('#pay').on('click', function(e){
        e.preventDefault();
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
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    var maxDate = year + '-' + month + '-' + day;

    // or instead:
    // var maxDate = dtToday.toISOString().substr(0, 10);

    // alert(maxDate);
    $('#startDate').attr('min', maxDate);
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
    $('#s_plan_name').text(plan.selected_plan.name);
    $('#s_goal').text(plan.goal);
    $('#s_prefs').text(plan.preference.join(', '));
    $('#s_allergen').text(plan.allergens);
    $('#s_start_date').text(plan.startDate);
    $('#s_timeslot').text(plan.timeslot);
    $('#s_days').text(plan.days.join(', '));

    $('#s_plan_price').text(`₹ ${plan.selected_plan.price}`);
    $('#s_plan_addons').text(`₹ ${(29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length}`);
    $('#s_plan_fm').text(`₹ ${fullMealcost * parseInt(plan.selected_plan.days)}`);
    $('#s_plan_days').text(`${plan.selected_plan.days} Days`);
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

function validateSteps(){
    if(step == 1){
       if($('#name').val() == ''){
           alert('Please enter your name');
           return false;
       }
       if($('#phone').val() == '' || telephoneCheck($('#phone').val()) == false){
            alert('Please enter a valid phone number');
            return false;
       }
       if(!plan.goal || plan.goal == ''){
            alert('Please select your goal');
            return false;
       }
       if(plan.preference.length == 0){
            alert('Please select at least 1 preference');
            return false;
       }
    } else if(step == 2){
        if(!plan.gender || plan.gender == ''){
            alert('Please select your Gender');
            return false;
        }
        if(!plan.age || plan.age == ''){
            alert('Please enter your age');
            return false;
        }
        if(!plan.weight || plan.weight == ''){
            alert('Please enter your weight');
            return false;
        }
        if(!plan.height || plan.height == ''){
            alert('Please select your height');
            return false;
        }
    } else if(step == 3){
        if(!plan.startDate || plan.startDate == ''){
            alert('Please select your start date');
            return false;
        }
        if(!plan.timeslot || plan.timeslot == ''){
            alert('Please select your timeslot');
            return false;
        } if(days.length == 0){
            alert('Please select at least 1 day');
            return false;
        }
    } else{
        if($('#address_1').val() == '' || $('#landmark').val() == '' || $('#pincode').val() == ''){
            alert('Please enter your address');
            return false;
        }
        if($('#pincode').val().length != 6){
            alert('Please enter a valid pincode');
            return false;
        }
        showPlanDetails();
    }   
    return true;
}

function telephoneCheck(str) {
    var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(str);
    return a;
}

//SETTING PROPER FORM HEIGHT ONLOAD
window.addEventListener('load', setFormHeight, true);

//SETTING PROPER FORM HEIGHT ONRESIZE
window.addEventListener('resize', setFormHeight, true);
