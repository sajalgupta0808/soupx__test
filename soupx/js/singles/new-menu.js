jQuery(document).ready(function($){
    $('#showCart').on('click', function(){
        $('#cartModal').fadeIn(400);
        $('.modal-backdrop').css('z-index', '99999!important');
        // $('body').css('background-color', '#f5f3f3');
    });
    $('#closeCart').on('click', function(){
        $('#cartModal').fadeOut(400);
        $('.modal-backdrop').css('z-index', '-99991!important');
        // $('body').css('background-color', '#fff');
    })
});
