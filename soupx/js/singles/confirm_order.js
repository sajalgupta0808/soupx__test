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
$(document).ready(function(){
    console.log(isDeliverable);
    if(isDeliverable == 'false'){
        $('#rzp-button1').prop('disabled', true);
        $('#pod-button1').prop('disabled', true);
        alert('Sorry! out of delivery area !');
    }
    // Source address
    $.ajax({
        url: '/api/getKitchenInfo',
        method: 'GET',
        headers: {'Authorization': token}, 
        data: {key: 'address'},
        success: function(response){
            console.log(response);   
            if(response.success){
                source = JSON.parse(response.result.res[0].value);
            } 
        }
    });
    if(usertype != 'corporate'){        
        $.ajax({
            url: '/api/getClassInfo',
            method: 'GET',
            headers: {'Authorization': token}, 
            success: function(response){
                if(response.success){
                    info = response.result.info;
                    console.log(info);
                    getWallet(usertype);
                }
            }
        });
    } else{
        init_corporate_cart(false);
    }
});

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
                var add = JSON.parse(response.result[0].order_address);
                var html = "";
                for(var i = 0; i < order.length; i++){
                    html += `<tr>`;
                    html += `<td>${order[i].dish_name}</td>`;
                    html += `<td>${order[i].label}</td>`;
                    html += `<td>X</td>`;
                    html += `<td>${order[i].quantity}</td>`;
                    html += `</tr>`;
                }
                html += `<tr><th>Address :</th></tr>`;
                html += `<tr><td>${add.address}</td></tr>`;
                html += `<tr><th>Status :</th></tr>`;
                html += `<tr><td>${status[response.result[0].order_owner_status]}</td></tr>`;
                $('#order_summary').html(html);
                $('.transaction-complete').fadeOut(80);
                $('.order-summary').fadeIn(25);
            }
        }
    });
}

function init_cart(useWallet = false){
    var userCart = localStorage.getItem('cart');
    userCart = JSON.parse(userCart);
    var order = new Array();
    
    console.log(userCart);
    if(isDeliverable == 'false'){
        $('#deliveryNotice').css('display', 'block');
        return;
    }
    $('#deliveryNotice').css('display', 'none');
    if(!userCart){
        $('.cart-empty').css('display', '');
        $('.cart').css('display', 'none');
        return;
    }
    var html = "";
    var total = 0;
    for(var i=0; i<userCart.cart.length; i++){
        total += userCart.cart[i].total; 
        let cartMeta = userCart.cart[i].meta;
        if(cartMeta){
            for(var j=0; j<cartMeta.length; j++){
                if(cartMeta[j]){            
                    order[i] = {'dish_id': userCart.cart[i].dish_id, 'quantity': userCart.cart[i].quantity, 'meta': cartMeta, 'addons': userCart.cart[i].addons};
                    html += '<tr>';
                    html += `<td><img src='${userCart.cart[i].img}' style='max-width: 77px'/></td>`
                    html += `<td><b>${userCart.cart[i].dish_name}</b> (${cartMeta[j].label}) | Quantity: ${cartMeta[j].quantity} X ${cartMeta[j].price}</td>`
                    html += `<th>₹ ${cartMeta[j].price * cartMeta[j].quantity}</th>`;
                    html += '</tr>';                    
                }
            }
        }
        if(userCart.cart[i].addons.length > 0){
            html += `<tr><th colspan="3" style="text-align: center;">Addons</th></tr>`;
            for(let k = 0; k < userCart.cart[i].addons.length; k++){
                html += `<tr>
                            <td>${userCart.cart[i].addons[k].name} (${(userCart.cart[i].addons[k] == 1)?'Non Veg':'Veg'})</td>
                            <td>X</td>
                            <td>${userCart.cart[i].addons[k].price}</td>
                        </tr>`;
            }
        }
    }
    
    var sub = Math.round(((total / 1.05) + Number.EPSILON) * 100) / 100;
    var tax = total - sub;
    tax = Math.round((tax + Number.EPSILON) * 100) / 100;
    var credits = parseInt((sub / 100)) * 0;
    if(useWallet){
        if(wallet >= 50){
            useWalletAmt = 50;
            sub = sub - 50;
        }else{
            sub = sub - wallet;
            useWalletAmt = wallet;
        }
    }
    var disc = ((0) * sub)/ 100;
    disc = Math.round((disc + Number.EPSILON) * 100) / 100;
    delivery = (sub < 100)?20:0;

    total = (sub - disc) + tax;
    total = total + delivery;
    total = Math.round((total + Number.EPSILON) * 100) / 100;

    
    html += `<tr><th colspan="2">Subtotal :</th><th colspan="2">₹ ${sub}</th></tr>`;
    // html += `<tr><th colspan="2">Discount ${info.retaining_discount}% :</th><th colspan="2">- ₹ ${disc}</th></tr>`;
    html += `<tr><th colspan="2">Taxes & Charges :</th><th colspan="2">+ ₹ ${tax}</th></tr>`;
    html += `<tr><th colspan="2">Delivery Fee :</th><th colspan="2">+ ₹ ${delivery}</th></tr>`;
    html += `<tr><th colspan="2">Total Amount :</th><th colspan="2">₹ ${total}</th></tr>`;
    /* if(useWallet){
        html += `<tr><th colspan="2">Credits Used :</th><th colspan="2">${useWalletAmt}</th></tr>`;        
        html += `<tr><th colspan="2">Wallet :</th><th colspan="2">${wallet - useWalletAmt} points</th><td><input type='checkbox' onchange="init_cart(false)" checked> Redeem</td></tr>`;
    }else{
        useWalletAmt = 0;
        html += `<tr><th colspan="2">Wallet :</th><th colspan="2">${wallet} points</th><td><input type='checkbox' onchange="init_cart(true)"> Redeem</td></tr>`;
    } */
    // html += `<tr><th colspan="2">Credits To Be Earned :</th><th colspan="2">${credits}</th></tr>`;
    // console.log(html);
    $('#cart_summary').html(html);

    /* =================== Razorpay Checkout ==================== */
    
    document.getElementById('rzp-button1').onclick = function(e){
        $('.overlay').css("display", '');
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
                                        $('.transaction-started').fadeOut(40);
                                        $('.transaction-complete').fadeIn(25);
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
                                $('.transaction-started').fadeOut(40);
                                $('.transaction-complete').fadeIn(25);
                                showOrderSummary(token, response.order_id);
                                $('.overlay').css("display", 'none');
                            }
                        }
                    });
                    
                }
                e.preventDefault();
            }
        });
    });
}
function init_corporate_cart(useWallet){
    var userCart = localStorage.getItem('cart');
    userCart = JSON.parse(userCart);
    var order = new Array();
  
    console.log(userCart);
    if(!userCart){
        $('.cart-empty').css('display', '');
        $('.cart').css('display', 'none');
        return;
    }
    var html = "";
    var total = 0;
    for(var i=0; i<userCart.cart.length; i++){
        total += userCart.cart[i].price; 
        order[i] = {'dish_id': userCart.cart[i].dish_id, 'quantity': userCart.cart[i].quantity, 'meta_index': userCart.cart[i].meta_index};
        html += '<tr>';
        html += `<td><img src='${userCart.cart[i].img}' style='max-width: 77px'/></td>`
        html += `<td><b>${userCart.cart[i].dish_name}</b><br>${userCart.cart[i].label} | Quantity: ${userCart.cart[i].quantity}<br>${userCart.cart[i].quantity} X ${userCart.cart[i].price/userCart.cart[i].quantity}</td>`
        html += `<th>₹ ${userCart.cart[i].price}</th>`;
        html += '</tr>';
    }
    var sub = Math.round(((total / 1.05) + Number.EPSILON) * 100) / 100;
    var tax = total - sub;
    tax = Math.round((tax + Number.EPSILON) * 100) / 100;
    var credits = parseInt((sub / 100)) * info.purchase_rewards;
    if(useWallet){
        if(wallet > sub){
            useWalletAmt = total;
            sub = 0;
        }else{
            sub = sub - wallet;
            useWalletAmt = wallet;
        }
    }
    // var disc = ((info.retaining_discount) * sub)/ 100;
    // disc = Math.round((disc + Number.EPSILON) * 100) / 100;
    delivery = (sub < 100)?20:0;

    total = (sub) + tax;
    total = total + delivery;
    total = Math.round((total + Number.EPSILON) * 100) / 100;

    
    html += `<tr><th colspan="2">Subtotal :</th><th colspan="2">₹ ${sub}</th></tr>`;
    // html += `<tr><th colspan="2">Discount ${info.retaining_discount}% :</th><th colspan="2">- ₹ ${disc}</th></tr>`;
    html += `<tr><th colspan="2">Taxes & Charges :</th><th colspan="2">+ ₹ ${tax}</th></tr>`;
    html += `<tr><th colspan="2">Delivery Fee :</th><th colspan="2">+ ₹ ${delivery}</th></tr>`;
    html += `<tr><th colspan="2">Total Amount :</th><th colspan="2">₹ ${total}</th></tr>`;
    if(useWallet){
        html += `<tr><th colspan="2">Credits Used :</th><th colspan="2">${useWalletAmt}</th></tr>`;        
        html += `<tr><th colspan="2">Wallet :</th><th colspan="2">${wallet - useWalletAmt} points</th><td><input type='checkbox' onchange="init_cart(false)" checked> Redeem</td></tr>`;
    }else{
        useWalletAmt = 0;
        html += `<tr><th colspan="2">Wallet :</th><th colspan="2">${wallet} points</th><td><input type='checkbox' onchange="init_cart(true)"> Redeem</td></tr>`;
    }
    html += `<tr><th colspan="2">Credits To Be Earned :</th><th colspan="2">${credits}</th></tr>`;
    console.log(html);
    $('#cart_summary').html(html);
    /* ==================== POD Checkout ========================= */
    $('#place_order-button1').on('click', function(e){
        $('.overlay').css("display", '');
        $.ajax({
            url: '/api/place-corporate-order',
            method: 'POST',
            headers: {'Authorization': token},
            data: {wallet: useWalletAmt, cart: order, address: JSON.stringify(destination)},
            success: function(response){
                console.log(response);
                if(response.success){
                    console.log(response.pointsEarned);
                    var pointsEarned = parseInt(response.pointsEarned);
                    localStorage.removeItem('cart');
                    $('.transaction-started').fadeOut(40);
                    $('.transaction-complete').fadeIn(25);
                    showOrderSummary(token, response.order_id);
                    $('.overlay').css("display", 'none');
                }
                e.preventDefault();
            }
        });
    });
}


function getWallet(usertype){
    $.ajax({
        url: '/api/getUserWallet',
        method: 'GET',
        headers: {'Authorization': token},
        success: function(response){
            if(response.success){
                console.log(response);
                wallet = parseInt(response.result.res.points);
                if(usertype == 'corporate')
                    init_corporate_cart(false);
                else
                    init_cart(false);
            }
        }
    });
}