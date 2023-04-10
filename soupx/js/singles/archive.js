var isDeriverable = localStorage.getItem('isDeliverable');
$(document).ready(function(){
    setup_cart();
});

function addToCart(dish_id, meta_index, quantity, price, dish_name, label, img, optional_item){
    if(isDeriverable == 'false'){
        alert('Sorry! out of delivery area !');
        return;
    }
    var cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
    var c = {
        dish_id: dish_id, 
        img: img,
        dish_name: dish_name,
        label: label,
        meta_index: meta_index, 
        quantity: quantity, 
        price: price,
        optional_items: []
    };
    if(optional_item){
        var op_c = 0;
        $.each($("input[name='"+dish_name+"']:checked"), function(){
            console.log($(this).val());
            op_c += 1;
            c.optional_items.push($(this).val());            
        });
        if(dish_id == 21){
            if(op_c < 3 && op_c > 0){
                c.price -= 10;
            } else if(op_c == 0){
                c.price -= 20;
            }
        } else if(dish_id == 22){
            if(op_c <= 3 && op_c > 0){
                c.price -= 10;
            } else if(op_c == 0){
                c.price -= 20;
            }
        } else if(dish_id == 23){
            if(op_c <= 4 && op_c > 2){
                c.price -= 10;
            } else if(op_c <= 2 && op_c > 0){
                c.price -= 20;
            } else if(op_c == 0) {
                c.price -= 35;
            }
        }   
    }
    console.log(c);
    if(cart){
        var index = cart.cart.findIndex(function(element, index, array){
            console.log(element);
            return element.dish_id == dish_id;
        });
        if(index > -1){
            if(cart.cart[index].quantity == 1 && quantity == -1){
                cart.cart.splice(index, 1);
            } else{
                cart.cart[index].quantity += quantity;
                cart.cart[index].price += price;
            }
        } else{
            cart.cart[cart.cart.length] = c;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        $('.notification-no').html(`<b>${cart.cart.length}</b>`);
        setup_cart();
        console.log(index);
    } else{
        localStorage.setItem('cart', JSON.stringify({cart: [c]}));
        setup_cart();
        $('.notification-no').html(`<b>1</b>`);
    }
}

function setup_cart(){
    var cart = localStorage.getItem('cart');
    if(cart){
        cart = JSON.parse(cart);
        var html = '';
        var total = 0;
        for(var i=0; i<cart.cart.length; i++){
            if(cart.cart[i]){
                total += cart.cart[i].price;
                html += `<li><a href="#0" onclick="addToCart(${cart.cart[i].dish_id}, ${cart.cart[i].meta_index}, -1, ${-1 * (cart.cart[i].price / cart.cart[i].quantity)}, '${cart.cart[i].dish_name}', '${cart.cart[i].label}', '${cart.cart[i].img}')">${cart.cart[i].quantity}x ${cart.cart[i].dish_name}</a><span>₹${cart.cart[i].price}</span></li>`;
            }
        }
        $('#order_summary').html(html);
        $('#order_subtotal').text('₹ '+total);
    }
}

function removeOptionalItems(name, id){
    var c = 0;
    var html = "";
    $.each($("input[name='"+name+"']:checked"), function(){
        console.log($(this).val());
        c += 1;
    });
    if(id == 21){
        if(c < 3 && c > 0){
            html = "-10";
        } else if(c == 0){
            html = "-20";
        }
    } else if(id == 22){
        if(c <= 3 && c > 0){
            html = "-10";
        } else if(c == 0){
            html = "-20";
        }
    } else if(id == 23){
        if(c <= 4 && c > 2){
            html = "-10";
        } else if(c <= 2 && c > 0){
            html = "-20";
        } else if(c == 0) {
            html = "-35";
        }
    }
    if(html != ""){
        $("#reduced_amt_"+id).html(html + ' ₹'); 
    }
    console.log(html);
}