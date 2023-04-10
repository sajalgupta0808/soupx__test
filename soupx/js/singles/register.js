$(document).ready(function(){
  var token;
  $('#register-form').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData($(this)[0]);
    $.ajax({
      url: '/api/v1/register',
      method:     'POST', 
      processData: false,
      contentType: false,
      data: formData,
      success: function(response){
        console.log(response);
        if(response.success){
          token = response.token;
          $('#sign_up_form').fadeOut(400);
          $('#otp-form').fadeIn(500);
        } else{
          alert(response.message);
        }
      }
    });
  });
  $('#verify-otp').on('click', function(e){
    var otp = $('#otp').val();
    if(otp.length < 4 || otp.length > 4){
      $('#responseMsg').css('color', 'red');
      $('#responseMsg').text('Please Enter Valid OTP !!');
    } else{
      $.ajax({
        url: '/api/authenticate',
        method: 'POST',
        headers: {"Authorization": token},
        data: {phone: $('#phone').val(), password: otp},
        success: function(response){
          if(response.success){
            $('#responseMsg').css('color', 'green');
            $('#responseMsg').text('No. Verified !!');
            location.href = '/';
          } else{
            $('#responseMsg').css('color', 'red');
            $('#responseMsg').text(response.message);
          }
        }
      });
    }
  });
});

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}