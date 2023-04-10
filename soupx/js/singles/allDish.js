$(document).ready(function(){
    $('.add_to_cart').on('click', function(e){
        var id = $(this).data('id');
        var meta = $(this).data('meta');
        var dish = $(this).data('dish');
        var img = $(this).data('featured_img');
        console.log(meta);
        var html = "<table>";
        for(var i=0; i<meta.quantity.length; i++){
            html += "<tr>";
            html += `<td align='left'><input type='radio' name="variations" onClick='addToCart(${id}, ${i}, 1, ${meta.quantity[i].sale_price}, "${dish}", "${meta.quantity[i].label}", "${img}")'></td>`;
            html += "<th align='center'>"+meta.quantity[i].label+"</td>";
            html += `<th align='right'>${meta.quantity[i].sale_price}</td>`;
            html += "</tr>";
        }    
        $('#meta_data').html(html);
    });
})
function addToCart(dish_id, meta_index, quantity, price, dish_name, label, img){
    var cart = localStorage.getItem('cart');
    cart = JSON.parse(cart);
    var c = {
        dish_id: dish_id, 
        img: img,
        dish_name: dish_name,
        label: label,
        meta_index: meta_index, 
        quantity: quantity, 
        price: price
    };
    console.log(c);
    if(cart){
        var index = cart.cart.findIndex(function(element, index, array){
            console.log(element);
            return element.dish_id == dish_id;
        });
        if(index > -1){
            cart.cart[index].quantity += 1;
            cart.cart[index].price += price;
        } else{
            cart.cart[cart.cart.length] = c;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        $('.notification-no').html(`<b>${cart.cart.length}</b>`);
        console.log(index);
    } else{
        localStorage.setItem('cart', JSON.stringify({cart: [c]}));
        $('.notification-no').html(`<b>1</b>`);
    }
    // if(cart)
    $('#myModal').modal('hide');;
}