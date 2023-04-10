jQuery(document).ready(function($){
    $('#save-lead').on('click', saveLead);
    $('#verify-lead').on('click', verifyLead);
    $('#skip').on('click', function(){
        $('#lead').hide();
        $('#main').show();
    });
    /* window.onscroll = function(){
        let scrollTop = $(window).scrollTop();
        if(scrollTop > 100){
            $('.sticky-sidebar').css('top', '7% !important');
            $('#search-div').css('position', 'fixed');
        } else{
            $('#search-div').css('position', '');
            $('.sticky-sidebar').css('top', '24% !important');
        }
    } */
    $('#search').on('keyup', function(e){
        let search = $('#search').val();
        if(search.length > 3){
           window.find(search, false, false, false, false, false, true);
        }
        $('#search-btn').trigger('click');
    });
    $('#search-btn').on('click', function(e){
        $('#search').trigger('focus');
    });
});

function saveLead(){
    let name = $('#name').val() || null;
    let email = $('#email').val();
    let phone = $('#phone').val() || null;
    if(phone == ''){
        alert('Please fill in all fields');
        return;
    }
    let data = {
        name: name,
        email: email,
        phone: phone
    }
    $.ajax({
        url: 'api/v1/save-leads',
        type: 'GET',
        data: data,
        success: function(res){
            if(res.success){
                $('#leadId').val(res.id);
                $('#step_1').hide();
                $('#step_2').show();
            }
        }
    });
}

function verifyLead(){
    let leadId = $('#leadId').val();
    let otp = $('#otp').val();
    if(otp == ''){
        alert('Please enter otp !');
        return;
    }
    if(otp.length != 4){
        alert('Please enter valid otp !');
        return;
    }
    let data = {
        id: leadId,
        otp: otp
    }
    $.ajax({
        url: 'api/v1/verify-lead',
        type: 'GET',
        data: data,
        success: function(res){
            if(res.success){
                $('#lead').hide();
                $('#main').show();
            } else{
                alert(res.message);
            }
        }
    });
}