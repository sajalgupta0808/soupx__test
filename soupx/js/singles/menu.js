var kitchenLocation;
var key = "AIzaSyCwxwjRk3UX08zKcUXqQSUP0hH_iHRsV-M";
var clientlocation = localStorage.getItem('location');;
clientlocation = JSON.parse(clientlocation);
var isDeriverable = localStorage.getItem('isDeliverable');
jQuery(document).ready(function($){
    var cart = localStorage.getItem('cart');
    var isDeliverable = JSON.parse(localStorage.getItem('isDeliverable')) || undefined;
    if(clientlocation){
      console.log(clientlocation);
      if(isDeliverable == undefined){
        getKitchenLocation();
      }
      $('#autocomplete').val(clientlocation.address);
      $('#autocomplete_1').val(clientlocation.address);
      $('#location-span').text(clientlocation.address.substr(0, 50)+'...');
      $('#chng_loc').css('display', '');
      $('.locGrp').css('display', 'none');
    }
    cart = JSON.parse(cart);
    if(cart){
        $('.notification-no').html(`<b>${cart.cart.length}</b>`);
    }
    if(!clientlocation)
      getLocation();
    $('#detect_location').on('click', async function(e){
      getLocation();
    });

    $('#search-dish').on('keyup', function(e){
      var s = $(this).val();
      if(s.length < 3){
        return;
      }
      searchDish(s);
    });

    $('#logout').on('click', function(e){
      document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.reload(true);
    });

    $('#change-loc').on('click', function(e){
      $('#chng_loc').css('display', 'none');
      $('.locGrp').css('display', '-webkit-inline-box');
    });

    $('#shoppingCart').on('click', function(){
      $('#cartModal').fadeIn(400);
      $('.modal-backdrop').css('z-index', '99999!important');
      // $('body').css('background-color', '#f5f3f3');
    });
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

    var topLimit = $('#top-limit').offset().top;
    $(window).scroll(function() {
      //console.log(topLimit <= $(window).scrollTop())
      if (topLimit <= $(window).scrollTop()) {
        $('.left-sidebar').addClass('sticky-sidebar');
      } else {
        $('.left-sidebar').removeClass('sticky-sidebar');
      }}
    )
})

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
     alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position){
    console.log(position.coords.latitude);

    $.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCwxwjRk3UX08zKcUXqQSUP0hH_iHRsV-M`,
    function(response){
      console.log(response.results[0].formatted_address);
      if (response.status == 'OK'){
        $('#autocomplete').val(response.results[0].formatted_address);
        $('#chng_loc').css('display', '');
        $('.locGrp').css('display', 'none');
        $('#location-span').text(response.results[0].formatted_address.substr(0, 50)+'...');
        
        clientlocation = {lat: position.coords.latitude, lon: position.coords.longitude, address: response.results[0].formatted_address};
        localStorage.setItem('location', JSON.stringify({lat: position.coords.latitude, lon: position.coords.longitude, address: response.results[0].formatted_address}));
        getKitchenLocation().then((r, err)=>{
          location.reload();
        });
      }
    });
  }


function searchDish(dish){
  $.ajax({
    url: '/api/search',
    method: 'GET',
    contentType: 'application/json',
    data: {s: dish},
    success: function(response){
      console.log(response);
    }
  });
}

function getKitchenLocation(){
  return new Promise((resolve, reject)=>{
    $.ajax({
      url: '/api/getKitchenInfo?key=address',
      method: 'GET',
      contentType: 'application/json',
      success: function(response){
        // console.log(response);
  
        kitchenLocation = JSON.parse(response.result.res[0].value);
        compareDistance({lat: clientlocation.lat, lon: clientlocation.lon}, kitchenLocation).then((r, re)=>{
          resolve('done');
        });
      },
      error: function(err){
        reject(err);
      }
    });
  });
}

function compareDistance(origin, destination){
  let _d = "";
  console.log(destination);
  for(let i = 0; i < destination.locations.length; i++){
    if(i == 0){
      _d = destination.locations[i].lat+','+destination.locations[i].lon;
    } else{
      _d += '|'+destination.locations[i].lat+','+destination.locations[i].lon;
    } 
  }
  return new Promise((resolve, reject)=>{
    $.ajax({
      url: `/api/distance?origin=${origin.lat},${origin.lon}&destination=${_d}`,
      method: 'GET',
      contentType: 'application/json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": "*"
      },
      success: function(response){
        console.log(response.result.rows[0].elements);
        let distance = response.result.rows[0].elements;
        let d = false;
        for(let i = 0; i < distance.length; i++){
          if(distance[i].distance.value <= 15000){
            d = true;
            break;
          }
        }
        (d)?localStorage.setItem('isDeliverable', true):localStorage.setItem('isDeliverable', false);
        // location.reload();
        resolve('done');
      },
      error: function(err){
        reject(err);
      }
    });
  });
}

function resetLocation(){
  clientlocation = localStorage.getItem('location');
  clientlocation = JSON.parse(clientlocation);
  console.log(clientlocation);
  getKitchenLocation().then((r, err)=>{
    location.reload();
  });
}

function setupCart(){
  `<div class="fm-cart-detail d-flex flex-wrap">
  <div class="fm-cartd-left">
      <div class="fm-catg-icon fm-nonveg">Chipotle English Breakfast</div>
  </div>
  <div class="fm-cartd-right">
      <div class="fm-add-nob d-flex flex-wrap">
          <div class="fm-add-minus"><i class="fa fa-minus" aria-hidden="true"></i></div>
          <div class="fm-add-item">1</div>
          <div class="fm-add-plus"><i class="fa fa-plus" aria-hidden="true"></i></div>
      </div>
  </div>
  </div>`;
  
  let cart = localStorage.getItem('cart');
  cart = (cart)?JSON.parse(cart):false;
  console.log(cart);
  cart = (cart)?cart.cart:false;
  let html = ``;
  let total = 0;
  if(cart && cart.length > 0){
    if(cart[0].meta == undefined){
      // localStorage.setItem('cart', JSON.stringify({cart: cart, meta: {}}));
      localStorage.removeItem('cart');
    }
    for(let i = 0; i < cart.length; i++){
      let cartMeta = cart[i].meta;
      total += cart[i].total;
      for(let j = 0; j < cartMeta.length; j++){
        if(cartMeta[j]){
          html += `<div class="fm-cart-detail d-flex flex-wrap" style="padding-bottom: 10px;"><div class="fm-cartd-left">`;
          if(cart[i].is_veg){        
            html += `<div class="fm-catg-icon">${cart[i].dish_name}(${cartMeta[j].label})</div>`; 
          } else{
            html += `<div class="fm-catg-icon fm-nonveg">${cart[i].dish_name}(${cartMeta[j].label})</div>`; 
          }
          html += `  </div>
                    <div class="fm-cartd-right">
                        <div class="fm-add-nob d-flex flex-wrap">
                            <div class="fm-add-minus" onclick = "addToCart(${cart[i].dish_id}, ${j}, -1, ${cartMeta[j].price}, '${cart[i].dish_name}', '${cartMeta[j].label}', '${cart[i].img}', ${cart[i].is_veg}, true)"><i class="fa fa-minus" aria-hidden="true"></i></div>
                            <div class="fm-add-item">${cartMeta[j].quantity}</div>
                            <div class="fm-add-plus" onclick="addToCart(
                                ${cart[i].dish_id}, 
                                ${j}, 
                                1, 
                                ${cartMeta[j].price}, 
                                '${cart[i].dish_name}', 
                                '${cartMeta[j].label}', 
                                '${cart[i].img}', 
                                ${cart[i].is_veg},
                                true
                              )"><i class="fa fa-plus" aria-hidden="true"></i></div>
                        </div>
                    </div>
                  </div>
                  `;
        }
      }
    }
    // $('#cart-total-cost').html(`Place order . ₹${total}`);
    html += `<div class="cart-proceed-btn">
              <a id="cart-total-cost" href="/confirm-order" class="btn btn-default btn-block" style="text-align: center; margin-top: 10%;">Place order . ₹${total}</a>
            </div>`;
    $('#cartBody').html(html);
    // console.log(html);
      let itemCount = cartItemCount(cart);
      $('#cartCount').text(`You have ${itemCount} items in your cart`);
      $('#showCart').html(`${itemCount} item in Cart&nbsp;<i class="fa fa-arrow-right"></i>`);
      $('#empty-cart').addClass('d-none');
      $('#cartBody').removeClass('d-none');
  } else{
    $('#empty-cart').removeClass('d-none');
    $('#cartBody').addClass('d-none');
  }
}

cartItemCount = (cart)=>{
  let count = 0;
  for(let i = 0; i < cart.length; i++){
    count += cart[i].quantity;
  }
  return count;
}

  
async function openMetaModal(id, dish_name, is_veg, img){
  let meta = await $.get(`/api/v1/get-dish-meta`, {dish_id: id});
  var cart = localStorage.getItem('cart');
  let index = -1;
  let cartMeta = [];
  $('#dish-modal-header').text(dish_name);
  if(cart){
      cart = JSON.parse(cart);
      index = cart.cart.findIndex(function(element, index, array){
      console.log(element);
      return element.dish_id == id;
      });
  }
  if(meta.success){
      if(meta.data.length > 0){
        let meta_value = JSON.parse(meta.data[0].meta_value);
        let basePrice = meta_value.quantity[0].sale_price
        console.log(meta_value);
        let html = ``;
        if(index > -1){
            cartMeta = cart.cart[index].meta;
        }
        for(let i = 0; i < meta_value.quantity.length; i++){
            if(cartMeta[i]){
              if(i == 0){
                html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox" checked="true"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">₹${meta_value.quantity[i].sale_price}</td>
                            </tr>
                        `;
                } else{
                html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox" checked="true"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">+ ${meta_value.quantity[i].sale_price - basePrice}</td>
                            </tr>
                        `;

              }
            } else{
              if(i == 0){
                html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, 1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">₹${meta_value.quantity[i].sale_price}</td>
                            </tr>
                        `;
              } else{
                html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, 1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">+${meta_value.quantity[i].sale_price - basePrice}</td>
                            </tr>
                        `;

              }
            }
        }
        $('#meta-table').html(html);
      }
  }
  let addons = await $.get(`/api/v1/get-addons`, {dish_id: id});
  console.log(addons);
  if(addons.data.length > 0){
      let html = ``;
      for(let i = 0; i < addons.data.length; i++){
      html += `<div class="row"><h6 style="color: grey; font-weight: 700;">${addons.data[i].cat}</h6></div>`
      html += `<table class="table" style="text-align: initial; color: grey;">`;
      for(let j = 0; j < addons.data[i].addons.length; j++){
          let addonIndex = -1;
          if(index > -1){
          addonIndex = cart.cart[index].addons.findIndex(function(element, index, array){
              return element.id == addons.data[i].addons[j].addon_id;
          });
          }
          if(addonIndex > -1 && addonIndex == i){
          
          html += `
                      <tr>
                      <td><input id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})" type='checkbox' checked="true"> ${addons.data[i].addons[j].addon_name}</td>
                      <td style="text-align: end;">₹${addons.data[i].addons[j].price}</td>
                      </tr>
                  `;
          } else{
          html += `
                      <tr>
                      <td><input id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})" type='checkbox'> ${addons.data[i].addons[j].addon_name}</td>
                      <td style="text-align: end;">₹${addons.data[i].addons[j].price}</td>
                      </tr>
                  `;
          }
      }
      html += `</table></div>`;
      }
      $('#addon-div').html(html);
  } else{
      $('#addon-div').html(`<h6 style="color: grey;">No Addons Available</h6>`);
  }
  var h = $(window).height();
  // $('#meta-div').css('top', `${h}px`);
  $('#meta-div').fadeIn(400);
  $('body').css('overflow', 'hidden');
}

async function openNewMetaModal(id, dish_name, is_veg, img){
  let meta = await $.get(`/api/v1/get-dish-meta`, {dish_id: id});
  var cart = localStorage.getItem('cart');
  let index = -1;
  let cartMeta = [];
  $('#dish-modal-header').text(dish_name);
  if(cart){
      cart = JSON.parse(cart);
      index = cart.cart.findIndex(function(element, index, array){
      console.log(element);
      return element.dish_id == id;
      });
  }
  if(meta.success){
      if(meta.data.length > 0){
        let meta_value = JSON.parse(meta.data[0].meta_value);
        let basePrice = meta_value.quantity[0].sale_price
        console.log(meta_value);
        let html = ``;
        if(index > -1){
            cartMeta = cart.cart[index].meta;
            $('#new-modal-quantity').text(cart.cart[index].quantity+' items selected');
            $('#new-modal-total').text('₹'+cart.cart[index].total);
        } else{
          $('#new-modal-quantity').text('0 items selected');
          $('#new-modal-total').text('₹0');
        }
        for(let i = 0; i < meta_value.quantity.length; i++){
            if(cartMeta[i]){
              if(i == 0){
                html += `
                        <li>
                        <div class="add-on-box d-flex flex-wrap">
                          <div class="ad-nme">
                            <div class="form-check">
                              <input id="meta_${i}" class="meta_${id} form-check-input" type="checkbox" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" checked="true">
                              <label class="form-check-label" for="meta_${i}">
                                ${meta_value.quantity[i].label}
                              </label>
                            </div>
                          </div>
                          <div class="ad-price">₹${meta_value.quantity[i].sale_price}</div>
                        </div>
                      </li>
                          `;
                /* html += `

                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox" checked="true"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">₹${meta_value.quantity[i].sale_price}</td>
                            </tr>
                        `; */
                } else{
                  html += `
                        <li>
                        <div class="add-on-box d-flex flex-wrap">
                          <div class="ad-nme">
                            <div class="form-check">
                              <input id="meta_${i}" class="meta_${id} form-check-input" type="checkbox" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" checked="true">
                              <label class="form-check-label" for="meta_${i}">
                                ${meta_value.quantity[i].label}
                              </label>
                            </div>
                          </div>
                          <div class="ad-price">+ ${meta_value.quantity[i].sale_price - basePrice}</div>
                        </div>
                      </li>
                          `;
/*                 html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, -1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox" checked="true"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">+ ${meta_value.quantity[i].sale_price - basePrice}</td>
                            </tr>
                        `;
 */
              }
            } else{
              if(i == 0){
                html += `
                        <li>
                        <div class="add-on-box d-flex flex-wrap">
                          <div class="ad-nme">
                            <div class="form-check">
                              <input id="meta_${i}" class="meta_${id} form-check-input" type="checkbox" onclick="addToCart(${id}, ${i}, 1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})">
                              <label class="form-check-label" for="meta_${i}">
                                ${meta_value.quantity[i].label}
                              </label>
                            </div>
                          </div>
                          <div class="ad-price">₹${meta_value.quantity[i].sale_price}</div>
                        </div>
                      </li>
                          `;
               /*  html += `
                            <tr>
                            <td><input id="meta_${i}" class="meta_${id}" onclick="addToCart(${id}, ${i}, 1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})" type="checkbox"> ${meta_value.quantity[i].label}</td>
                            <td style="text-align: end;">₹${meta_value.quantity[i].sale_price}</td>
                            </tr>
                        `; */
              } else{
                html += `
                <li>
                <div class="add-on-box d-flex flex-wrap">
                  <div class="ad-nme">
                    <div class="form-check">
                      <input id="meta_${i}" class="meta_${id} form-check-input" type="checkbox" onclick="addToCart(${id}, ${i}, 1, ${meta_value.quantity[i].sale_price}, '${dish_name}', '${meta_value.quantity[i].label}', '${img}', ${is_veg})">
                      <label class="form-check-label" for="meta_${i}">
                        ${meta_value.quantity[i].label}
                      </label>
                    </div>
                  </div>
                  <div class="ad-price">+ ${meta_value.quantity[i].sale_price - basePrice}</div>
                </div>
              </li>
                  `;

              }
            }
        }
        $('#dish-modal-options').html(html);
      }
  }
  let addons = await $.get(`/api/v1/get-addons`, {dish_id: id});
  console.log(addons);
  if(addons.data.length > 0){
      let html = ``;
      for(let i = 0; i < addons.data.length; i++){
        html += `<div class="add-on-text" style="margin-top: 10px; font-weight: 700;">${addons.data[i].cat}</div><ul>`;
      // html += `<div class="row"><h6 style="color: grey;">${addons.data[i].cat}</h6></div>`
      // html += `<table class="table" style="text-align: initial; color: grey;">`;
      for(let j = 0; j < addons.data[i].addons.length; j++){
          let addonIndex = -1;
          if(index > -1){
          addonIndex = cart.cart[index].addons.findIndex(function(element, index, array){
              return element.id == addons.data[i].addons[j].addon_id;
          });
          }
          if(addonIndex > -1 && addonIndex == i){
          
            html += `
                      <li>
                      <div class="add-on-box d-flex flex-wrap">
                        <div class="ad-nme">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})" checked="true">
                            <label class="form-check-label" for="add-on-one">
                            ${addons.data[i].addons[j].addon_name}
                            </label>
                          </div>
                        </div>
                        <div class="ad-price">₹${addons.data[i].addons[j].price}</div>
                      </div>
                    </li>
                  `;

          /* html += `
                      <tr>
                      <td><input id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})" type='checkbox' checked="true"> ${addons.data[i].addons[j].addon_name}</td>
                      <td style="text-align: end;">₹${addons.data[i].addons[j].price}</td>
                      </tr>
                  `; */
          } else{
            html += `
                      <li>
                      <div class="add-on-box d-flex flex-wrap">
                        <div class="ad-nme">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})">
                            <label class="form-check-label" for="add-on-one">
                            ${addons.data[i].addons[j].addon_name}
                            </label>
                          </div>
                        </div>
                        <div class="ad-price">₹${addons.data[i].addons[j].price}</div>
                      </div>
                    </li>
                  `;
         /*  html += `
                      <tr>
                      <td><input id="addon-${addons.data[i].addons[j].addon_id}" onclick="addAddonsToCart(${id}, ${addons.data[i].addons[j].addon_id}, ${addons.data[i].addons[j].price}, '${addons.data[i].addons[j].addon_name}', ${addons.data[i].addons[j].type})" type='checkbox'> ${addons.data[i].addons[j].addon_name}</td>
                      <td style="text-align: end;">₹${addons.data[i].addons[j].price}</td>
                      </tr>
                  `; */
          }
        }
        html += '</ul>';
      }
      $('#dish-modal-addons').html(html);
  } else{
      $('#dish-modal-addons').html(`<h6 style="color: grey;">No Addons Available</h6>`);
  }
  // var h = $(window).height();
  // $('#meta-div').css('top', `${h}px`);
  $('#menu-addon').fadeIn(400);
  $('main').css('opacity', '0.2');
  // $('body').css('overflow', 'hidden');
}
 
async function openDescModal(dish_name, desc){
  // let meta = await $.get(`/api/v1/get-dish-meta`, {dish_id: id});
  // var cart = localStorage.getItem('cart');
  let index = -1;
  let cartMeta = [];
  $('#dish-modal-header').text(dish_name);
  let html = `<p>${desc}</p>`;
  $('#dish-modal-options').html(html);
  // var h = $(window).height();
  // $('#meta-div').css('top', `${h}px`);
  $('#menu-addon').fadeIn(400);
  $('main').css('opacity', '0.2');
  // $('body').css('overflow', 'hidden');
}


function closeMetaModal(){
  $('#meta-div').fadeOut(400);
  $('body').css('overflow', 'auto');
}
function closeNewMetaModal(){
  $('#menu-addon').fadeOut(400);
  $('main').css('opacity', '1');
}
function addToCart(dish_id, meta_index, quantity, price, dish_name, label, img, is_veg, in_cart = false){
  if(isDeriverable == 'false'){
      alert('Sorry! out of delivery area !');
      return;
  }
  if(!$(`#meta_${meta_index}`).is(':checked') && !in_cart){
      quantity = -1;
  }
  var cart = localStorage.getItem('cart');
  cart = JSON.parse(cart);
  let newmeta = [];
  newmeta[meta_index] = {
      label: label,
      meta_index: meta_index, 
      quantity: quantity, 
      price: price
  };
  var c = {
      dish_id: dish_id, 
      img: img,
      dish_name: dish_name,
      meta: newmeta,
      total: price,
      quantity: quantity,
      is_veg: is_veg,
      addons: []
  };
  console.log(c);
      if(cart){
          var index = cart.cart.findIndex(function(element, index, array){
              console.log(element);
              return element.dish_id == dish_id;
          });
          if(index > -1){
              let cartMeta = cart.cart[index].meta[meta_index];
              console.log(cartMeta);
              if(cart.cart[index].quantity == 1 && quantity == -1){
                  cart.cart.splice(index, 1);
              } else{

                  if(cartMeta){
                      if(cartMeta.quantity == 1 && quantity == -1){
                          if(cart.cart[index].meta.length > 1){
                              cart.cart[index].meta[meta_index] = null; 
                              cart.cart[index].total -= price;
                              cart.cart[index].quantity -= 1;
                              $('#new-modal-quantity').text(cart.cart[index].quantity+' items selected');
                              $('#new-modal-total').text('₹'+cart.cart[index].total);
                          } else{
                              cart.cart.splice(index, 1);
                              $('#new-modal-quantity').text('0 items selected');
                              $('#new-modal-total').text('₹0');
                          }
                      } else if(quantity == -1){
                          cartMeta.quantity -= 1; 
                          cart.cart[index].total -= price;
                          cart.cart[index].quantity -= 1;
                          cart.cart[index].meta[meta_index] = cartMeta;
                          $('#new-modal-quantity').text(cart.cart[index].quantity+' items selected');
                          $('#new-modal-total').text('₹'+cart.cart[index].total);
                      } else{
                          cartMeta.quantity += quantity;
                          cart.cart[index].total += price;
                          console.log(cartMeta);
                          cart.cart[index].meta[meta_index] = cartMeta;
                          cart.cart[index].quantity += 1;
                          $('#new-modal-quantity').text(cart.cart[index].quantity+' items selected');
                        $('#new-modal-total').text('₹'+cart.cart[index].total);
                      }
                  } else{
                      cart.cart[index].meta[meta_index] = {
                          label: label,
                          meta_index: meta_index,
                          quantity: quantity,
                          price: price
                      }
                      cart.cart[index].total += price;
                      cart.cart[index].quantity += 1;
                      $('#new-modal-quantity').text(cart.cart[index].quantity+' items selected');
                      $('#new-modal-total').text('₹'+cart.cart[index].total);
                  }
              }
          } else{
              cart.cart[cart.cart.length] = c;
              $('#new-modal-quantity').text(c.quantity+' items selected');
              $('#new-modal-total').text('₹'+c.total);
          }

          localStorage.setItem('cart', JSON.stringify(cart));
          $('.notification-no').html(`<b>${cartItemCount(cart.cart)}</b>`);
          setupCart();
          console.log(index);
      } else{
          localStorage.setItem('cart', JSON.stringify({cart: [c]}));
          setupCart();
          $('.notification-no').html(`<b>1</b>`);
      }
}
function addAddonsToCart(dish_id, addon_id, price, addon_name, type){
      if(isDeriverable == 'false'){
          alert('Sorry! out of delivery area !');
          return;
      }
      let action = $('#addon-'+addon_id).is(':checked');
      var cart = localStorage.getItem('cart');
      cart = JSON.parse(cart);
      var index = cart.cart.findIndex(function(element, index, array){
      console.log(element);
      return element.dish_id == dish_id;
      });
      if(action){
  
      let addon = {
          id: addon_id,
          name: addon_name,
          type: type,
          price: price
      };
      if(index > -1){
          cart.cart[index].addons.push(addon);
          cart.cart[index].total += price;
          localStorage.setItem('cart', JSON.stringify(cart));
          setupCart();
      } else{
          alert('First select an option from the above list');
          return;
      }
      } else{
      if(index > -1){
          let addonIndex = cart.cart[index].addons.findIndex(function(element, index, array){
          return element.id == addon_id;
          });
          cart.cart[index].addons.splice(addonIndex, 1);
          cart.cart[index].total -= price;
          localStorage.setItem('cart', JSON.stringify(cart));
      }
  }
      
}

setupCart();