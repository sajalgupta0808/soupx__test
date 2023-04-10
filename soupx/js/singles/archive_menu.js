jQuery(document).ready(function($){

/*==========================*/ 
/* sliders */ 
/*==========================*/
if($('.food-menu-slider').length > 0){
  $('.food-menu-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true, 
    infinite: true, 
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          slidesToShow: 1
        }
      }
    ]
    
  });
  let filters = getUrlParameters('filter');
  if(filters){
    filters = JSON.parse(filters);
    console.log(filters);
    if(filters.filter == 'sort'){
      $('#pricesort').css('color', 'red');
    }
    if(filters.filter == 'veg'){
      $('#is_veg').css('color', 'green');
    }
    if(filters.filter == 'non-veg'){
      $('#is_nonveg').css('color', 'red');
    }
  }
}
 

/*==========================*/  
/* Scroll on animate */  
/*==========================*/
function onScrollInit( items, trigger ) {
  items.each( function() {
    var osElement = $(this),
        osAnimationClass = osElement.attr('data-os-animation'),
        osAnimationDelay = osElement.attr('data-os-animation-delay');
        osElement.css({
          '-webkit-animation-delay':  osAnimationDelay,
          '-moz-animation-delay':     osAnimationDelay,
          'animation-delay':          osAnimationDelay
        });
        var osTrigger = ( trigger ) ? trigger : osElement;
        osTrigger.waypoint(function() {
          osElement.addClass('animated').addClass(osAnimationClass);
          },{
              triggerOnce: true,
              offset: '95%',
        });
// osElement.removeClass('fadeInUp');
  });
}
onScrollInit( $('.os-animation') );
onScrollInit( $('.staggered-animation'), $('.staggered-animation-container'));


/*==========================*/
/* Header fix */
/*==========================*/
var scroll = $(window).scrollTop();
if (scroll >= 10) {
    $("body").addClass("fixed");
} else {
    $("body").removeClass("fixed");
}


});

$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
        $("body").addClass("fixed");
    } else {
        $("body").removeClass("fixed");
    }
});
function priceFilter(){
  let filters = getUrlParameters('filter');
  filters = (filters)?JSON.parse(filters):null;
  if(filters){
    if(filters.filter == 'sort'){
      window.location.replace(`/menu`);
    }
  } else{  
    location = `/menu?filter=${JSON.stringify({filter: 'sort', 'sort': 'DESC'})}`;
  }
}
function vegFilter(){
  let filters = getUrlParameters('filter');
  filters = (filters)?JSON.parse(filters):null;
  if(filters){
    if(filters.filter == 'veg'){
      window.location.replace(`/menu`);
    }
  } else{  
    location = `/menu?filter=${JSON.stringify({filter: 'veg'})}`;
  }
}
function nonVegFilter(){
  let filters = getUrlParameters('filter');
  filters = (filters)?JSON.parse(filters):null;
  if(filters){
    if(filters.filter == 'non-veg'){
      window.location.replace(`/menu`);
    }
  } else{  
    location = `/menu?filter=${JSON.stringify({filter: 'non-veg'})}`;
  }
}

function getUrlParameters(parameter){
  var url = new URL(window.location.href);
  var c = url.searchParams.get(parameter);
  return c;
}
