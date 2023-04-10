var cookies = document.cookie.trim().split('; ');
var token = "";
var usertype = "";
var source = {};
var info = {};
var delivery = 0;
var wallet = 0;
var useWalletAmt = 0;
var destination = JSON.parse(localStorage.getItem('location'));
var isDeliverable = localStorage.getItem('isDeliverable');
for(var i = 0; i < cookies.length; i++){
    var cookie = cookies[i].split('=');
    if(cookie[0] == "token"){
        token = "JWT "+cookie[1];
    } if(cookie[0] == "usertype"){
        usertype = cookie[1];
    }
}
jQuery(document).ready(function($){
  initCart();

  $('#close-alert').on('click', function(e){
    $('.content-container').css('opacity', '1');
    $('body').css('overflow-y', 'scroll');
  })

  if(isDeliverable == 'false'){
    $('#rzp-button1').prop('disabled', true);
    $('#pod-button1').prop('disabled', true);
    showAlert('Sorry! out of delivery area !', 'alert-warning', 'alert-success');
  }
})




function initCart(){
  let cart = localStorage.getItem('cart'); 
  console.log(cart);
  let html = ``;
  if(cart != null){
    cart = JSON.parse(cart);
    cart = cart.cart;
    let order = new Array();
    let total = 0;
    for(let i = 0; i < cart.length; i++){
      let cartMeta = cart[i].meta;
      total += cart[i].total;
      let vegClass = (cart[i].is_veg)?'fm-veg':'fm-nonveg';
      for(let j = 0; j < cartMeta.length; j++){
        if(cartMeta[j]){
          order[i] = {'dish_id': cart[i].dish_id, 'quantity': cart[i].quantity, 'meta': cartMeta, 'addons': cart[i].addons};
          html += `
                  <div class="fm-cart-detail d-flex flex-wrap">
                      <div class="fm-cartd-left">
                          <div class="fm-catg-icon ${vegClass}">${cart[i].dish_name}(${cartMeta[j].label})</div>
                          <div class="fm-cartd-price">₹${cartMeta[j].price}</div>
                      </div>
                      <div class="fm-cartd-right">
                          <div class="fm-add-nob d-flex flex-wrap">
                              <div class="fm-add-minus" onclick="updateCart(
                                ${cart[i].dish_id}, 
                                ${j}, 
                                -1, 
                                ${cartMeta[j].price}, 
                                '${cart[i].dish_name}', 
                                '${cartMeta[j].label}', 
                                '${cart[i].img}', 
                                ${cart[i].is_veg},
                                true
                              )"><i class="fas fa-minus" aria-hidden="true"></i></div>
                              <div class="fm-add-item">${cartMeta[j].quantity}</div>
                              <div class="fm-add-plus" onclick="updateCart(
                                ${cart[i].dish_id}, 
                                ${j}, 
                                1, 
                                ${cartMeta[j].price}, 
                                '${cart[i].dish_name}', 
                                '${cartMeta[j].label}', 
                                '${cart[i].img}', 
                                ${cart[i].is_veg},
                                true
                              )"><i class="fas fa-plus" aria-hidden="true"></i></div>
                          </div>
                      </div>
                  </div>
                `;
        }
      }
    }
    $('#orderSummary').html(html);
    
    var sub = Math.round(((total / 1.05) + Number.EPSILON) * 100) / 100;
    var tax = total - sub;
    tax = Math.round((tax + Number.EPSILON) * 100) / 100;
    var disc = ((0) * sub)/ 100;
    disc = Math.round((disc + Number.EPSILON) * 100) / 100;
    delivery = (sub < 100)?20:0;

    total = (sub - disc) + tax;
    total = total + delivery;
    total = Math.round((total + Number.EPSILON) * 100) / 100;

    html = `
            <tr>
              <td>Item Price</td>
              <td class="text-end">₹${sub}</td>
            </tr>
            <tr class="color-gray">
              <td>Discount</td>
              <td class="text-end">₹${disc}</td>
            </tr>
            <tr class="color-gray">
              <td>Delivery</td>
              <td class="text-end">+ ₹${delivery}</td>
            </tr>
            <tr>
              <td>GST (5%)</td>
              <td class="text-end">+ ₹${tax}</td>
            </tr>
            <tr class="fm-total-payement">
              <td> <strong>Payable</strong></td>
              <td class="text-end"><strong>₹${total}</strong></td>
            </tr>
          `;
      $('#paymentSummary').html(html);

    /* =================== Razorpay Checkout ==================== */
    
  document.getElementById('rzp-button1').onclick = function(e){
    // alert(token);
    $('.overlay').css("display", '');
    $('#rzp-button1').prop('disabled', true);
    $('#pod-button1').prop('disabled', true);
    // $('#rzp-button1').css("display", 'none');
    $.ajax({
        url: '/api/initiate-order',
        method: 'POST',
        headers: {'Authorization': token},
        data: {wallet: useWalletAmt, mode: 'rzp', cart: order, address: JSON.stringify(destination)},
        success: function(response){
            console.log(response);
            if(response.success){
                console.log(response.pointsEarned);
                var pointsEarned = parseInt(response.pointsEarned);
                $('.overlay').css("display", 'none');
                // $('#rzp-button1').css("display", '');
                var options = {
                    "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
                    "amount": response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
                    "currency": "INR",
                    // "name": "Acme Corp",
                    // "description": "A Wild Sheep Chase is the third novel by Japanese author  Haruki Murakami",
                    // "image": "https://example.com/your_logo",
                    "order_id": response.data.order_id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
                    "handler": function (response){
                        $('.overlay').css("display", '');
                        
                        // alert(response.razorpay_payment_id);
                        response.source = JSON.stringify(source);
                        response.destination = JSON.stringify(destination); 
                        $.ajax({
                            url: '/api/confirm-order-web',
                            method: 'POST',
                            headers: {'Authorization': token},
                            data: {mode:'rzp', paymentData: response, delivery: delivery, pointsUsed: useWalletAmt, pointsEarned: pointsEarned},
                            success: function(response){
                                console.log(response);
                                if(response.success){
                                    localStorage.removeItem('cart');
                                    showAlert('Order Successfull !!', 'alert-success', 'alert-warning');
                                    $('.transaction-started').fadeOut(40);
                                    $('.transaction-complete').fadeIn(25);
                                    setupCart();
                                    showOrderSummary(token, response.order_id);
                                }
                            }
                        });
                    },
                    "prefill": {
                        "name": response.user.name,
                        "email": response.user.email,
                        "contact": response.user.phone
                    },
  /*                         "notes": {
                        "address": "note value"
                    },
                    "theme": {
                        "color": "#F37254"
                    } */
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            }
            e.preventDefault();
        }
    });
  }

  /* ==================== POD Checkout ========================= */
  $('#pod-button1').on('click', function(e){
    $('.overlay').css("display", '');
     $('#rzp-button1').prop('disabled', true);
    $('#pod-button1').prop('disabled', true);
    $.ajax({
        url: '/api/initiate-order',
        method: 'POST',
        headers: {'Authorization': token},
        data: {wallet: useWalletAmt, mode: 'pod', cart: order, address: JSON.stringify(destination)},
        success: function(response){
            console.log(response);
            if(response.success){
                console.log(response.pointsEarned);
                var pointsEarned = parseInt(response.pointsEarned);
                response.data.source = JSON.stringify(source);
                response.data.destination = JSON.stringify(destination);
                $.ajax({
                    url: '/api/confirm-order-web',
                    method: 'POST',
                    headers: {'Authorization': token},
                    data: {mode:'pod', paymentData: response.data, delivery: delivery, pointsUsed: useWalletAmt, pointsEarned: pointsEarned},
                    success: function(response){
                        console.log(response);
                        if(response.success){
                            localStorage.removeItem('cart');
                            showAlert('Order Successfull !!', 'alert-success', 'alert-warning');
                            $('.transaction-started').fadeOut(40);
                            $('.transaction-complete').fadeIn(25);
                            showOrderSummary(token, response.order_id);
                            setupCart();
                            $('.overlay').css("display", 'none');
                        }
                    }
                });
                
            }
            e.preventDefault();
            $('#paymentSummary').html(html);
        }
    });
  });




  } else{
    html += `
        <img class="img-responsive" src="images/food-cart1.svg">
      `;
      $('#orderSummary').css('text-align', 'center');
      $('#cartMessage').text('Your cart is empty !!');
      $('#orderSummary').html(html);
  }

}

function updateCart(dish_id, meta_index, quantity, price, dish_name, label, img, is_veg, in_cart){
  addToCart(dish_id, meta_index, quantity, price, dish_name, label, img, is_veg, in_cart);
  initCart();
}

function showOrderSummary(token, order_id){
  $.ajax({
      url: '/api/get-order',
      method: 'GET',
      data: {order_id: order_id},
      headers: {'Authorization': token},
      success: function(response){
          if(response.success){
              var status = ['Order Recieved', 'Order Accepted; Food is being prepared !', 'Order Packed', 'Out For Delivery']; 
              var order = [...response.result[0].order_items];
              console.log(order);
              var add = JSON.parse(response.result[0].order_address);
              var html = "";
              for(var i = 0; i < order.length; i++){
                  html += `<tr>`;
                  html += `<td>${order[i].dish_name}</td>`;
                  // html += `<td>${order[i].label}</td>`;
                  html += `<td>X</td>`;
                  html += `<td>${order[i].quantity}</td>`;
                  html += `</tr>`;
              }
              html += `<tr><th>Address :</th></tr>`;
              html += `<tr><td>${add.address}</td></tr>`;
              html += `<tr><th>Status :</th></tr>`;
              html += `<tr><td>${status[response.result[0].order_owner_status]}</td></tr>`;
              $('#orderSummary').html(html);
              html += `<tr class="fm-total-payement">
                        <td> <strong>Amount Payed</strong></td>
                        <td class="text-end"><strong>₹${response.result[0].order_total}</strong></td>
                      </tr>`;
              $('#paymentSummary').html(html);
          }
      }
  });
}

function showAlert(text, addClass, remClass){
  var w = $(window).width();
  var h = $(window).height();
  var divW = $('#custom-alert').width();
  var divH = $('#custom-alert').height();
  $('#custom-alert').css('top', (h/2)-(divH/2)+"px");
  // $('#custom-alert').css('left', (w/2)-(divW/2)+"px");
  $('#alert-body').text(text);
  $('#custom-alert').removeClass(remClass);
  $('#custom-alert').addClass(addClass);
  $('.content-container').css('opacity', '0.5');
  $('body').css('overflow-y', 'clip');
  $('#custom-alert').alert();
  $('#custom-alert').show();  
}