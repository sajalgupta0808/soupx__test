jQuery(document).ready(function($){
    $('#login_btn').on('click', function(e){
        login(e);
    });
    $('#login_btn_1').on('click', function(e){
        initiateLogin(e);
    });
    $('#login_btn_p').on('click', function(e){
        login(e);
    });
    $('#login_btn_1_p').on('click', function(e){
        initiateLogin(e);
    });
    $('#corporate-login_btn').on('click', function(e){
        corporateLogin(e);
    });

    $('#phone, #password').on('keypress', function(e){
        if(e.which == 13){
            login(e);
        }
    });

    $('#forgot').on('click', (e)=>{
        $('#my-signin2').hide();
        $('#forgot_pwd').show();
    })

    $('#resetPWD').on('click', (e)=>{
        e.preventDefault();
        resetPasswordOtp();
    })
    $('#verifyOtp').on('click', (e)=>{
        e.preventDefault();
        saveOTP();
    })
    $('#updatePwd').on('click', (e)=>{
        e.preventDefault();
        updatePwd();
    })
})

function showLogin(){    
    $('#forgot_pwd').hide();
    $('#my-signin2').show();
}
function initiateLogin(e){
    e.preventDefault();
    var phone = $('#phone').val();
    if(!phone){
        alert('Phone required !!');
        return;
    }
    $.ajax({
        url: '/api/v1/initiate-login',
        method: 'POST',
        data: {phone: phone},
        success: function(response){
            if(response.success){
                $('#otp-input').show();
                $('#login_btn').show();
                $('#login_btn_1').hide();
                // $('#update_pwd').hide();
            } else{
                $('.success_msg').html(response.message);
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
            }
        }
    });
}
function login(e){
    e.preventDefault();
    console.log('asds');
    var phone = $('#phone').val();
    var otp = $('#otp-login').val();
    if(!phone || !otp){
        alert('Please fill the data !!');
        return;
    }
    $.ajax({
        url: '/api/authenticate',
        method: 'POST',
        data: {phone: phone, password: otp},
        success: function(response){
            console.log(response);
            if(response.success){
                // $('.success_msg').addClass('text-success');
                $('.success_msg').html('Login Successfull !!');
                $('.success_msg').css('color', 'green');
                $('.success_msg').css('display', '');
                setTimeout(function(){
                    var urlParams = new URLSearchParams(window.location.search);
                    if(urlParams.has('referrer')){
                        window.location.replace(document.location.origin+'/'+urlParams.get('referrer'));
                    } else{
                        location.reload();
                    }
                }, 1000);
            }else{
                // $('.success_msg').addClass('text-danger');
                $('.success_msg').html('Login Failed !! Wrong mobile/password !!!');
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
            }
        }
    });
}
function corporateLogin(e){
    e.preventDefault();
    console.log('asds');
    var phone = $('#phone').val();
    var password = $('#password').val();
    if(!phone || !password){
        alert('Phone and Password required !!');
        return;
    }
    $.ajax({
        url: '/api/authenticateCorporate',
        method: 'POST',
        data: {phone: phone, password: password},
        success: function(response){
            console.log(response);
            if(response.success){
                // $('.success_msg').addClass('text-success');
                $('.success_msg').html('Login Successfull !!');
                $('.success_msg').css('color', 'green');
                $('.success_msg').css('display', '');
                setTimeout(function(){
                    var urlParams = new URLSearchParams(window.location.search);
                    if(urlParams.has('referrer')){
                        window.location.replace(document.location.origin+'/'+urlParams.get('referrer'));
                    } else{
                        location.reload();
                    }
                }, 1000);
            }else{
                // $('.success_msg').addClass('text-danger');
                $('.success_msg').html('Login Failed !! Wrong mobile/password !!!');
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
            }
        }
    });
}


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // socialMediaSignin(profile.getEmail(), profile.getName());
}


function socialMediaSignin(email, name){
    $.ajax({
        url: '/api/social-media-login',
        method: 'POST',
        data: {email: email},
        success: function(response){
            console.log(response);
            if(response.success){
                // $('.success_msg').addClass('text-success');
                $('.success_msg').html('Login Successfull !!');
                $('.success_msg').css('color', 'green');
                $('.success_msg').css('display', '');
                setTimeout(function(){
                    var urlParams = new URLSearchParams(window.location.search);
                    if(urlParams.has('referrer')){
                        window.location.replace(document.location.origin+'/'+urlParams.get('referrer'));
                    } else{
                        location.reload();
                    }
                }, 1000);
            }else{
                // $('.success_msg').addClass('text-danger');
                $('.success_msg').html('Account not found !!!');
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
                window.location.replace(document.location.origin+'/sign_up');
            }
        }
    });
} 

function fbLogin(res){
    console.log(res);
    console.log(res.authResponse.accessToken);
    if(res.status == "connected"){

        var url = `https://graph.facebook.com/v3.2/me?access_token=${res.authResponse.accessToken}&fields=id%2Cfirst_name%2Clast_name%2Cemail&locale=en_US&method=get&pretty=0&sdk=joey&suppress_http_code=1`;
        $.ajax({
            url: url,
            method: 'GET',
            success: function(response){
                console.log(response);
                if(response.email){
                    socialMediaSignin(response.email, response.first_name+' '+response.last_name);
                } else{
                    alert('Something went wrong !! Try another way of login !');
                }
            }
        });
    } else{
        alert('Something went wrong !! Try another way of login !');
    }
}

function resetPasswordOtp(){
    let email = $('#email_forgot').val() || undefined;
    if(email == undefined){
        alert('Email required !!');
        return;
    }
    $.ajax({
        url: '/api/forgotPasswordRoute',
        method: 'GET',
        data: {email: email},
        success: function(response){
            console.log(response);
            if(response.success){
                $('.success_msg').html('OTP sent to your email !!');
                $('.success_msg').css('color', 'green');
                $('.success_msg').css('display', '');
                $('#email_forgot').val('');
                $('#forgot_pwd').hide();
                $('#verify_otp').show();
            }else{
                $('.success_msg').html('Email not found !!');
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
            }
        }
    })
}

function saveOTP(){
    let otp = $('#otp_forgot').val() || undefined;
    if(otp == undefined){
        alert('OTP required !!');
        return;
    }
    if(otp.length != 4){
        alert('OTP should be 4 digits !!');
        return;
    }
    $('#update_pwd').show();
    $('#verify_otp').hide();
}

function updatePwd(){
    let pwd = $('#upwd').val() || undefined; 
    let cpwd = $('#cupwd').val() || undefined;
    if(pwd == undefined || cpwd == undefined){
        alert('Password required !!');
        return;
    } 
    if(pwd != cpwd){
        alert('Password and confirm password should be same !!');
        return;
    }
    $.ajax({
        url: '/api/updatePwdAfterOTPGen',
        method: 'POST',
        data: {password: pwd, otp: $('#otp_forgot').val()},
        success: function(response){
            if(response.success){
                $('.success_msg').html('Password updated successfully !!');
                $('.success_msg').css('color', 'green');
                $('.success_msg').css('display', '');
                $('#update_pwd').hide();
                $('#my-signin2').show();
            } else{
                $('.success_msg').html('Something went wrong !!');
                $('.success_msg').css('color', 'red');
                $('.success_msg').css('display', '');
            }
        }
    });
}