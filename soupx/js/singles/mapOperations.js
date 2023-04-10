    
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete_1'));
    
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component', 'geometry']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);

    showMap();
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var fullAddress = {lat:0, lon:0, address: ""};
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
//   {"lat":26.8467088,"lon":80.9461592,"address":"barelib.k.varanasi.jeyparkash.nagar.221010, Azar collage, Lalbagh, Lucknow, Uttar Pradesh 226001, India"}
    fullAddress.lat = place.geometry.location.lat();
    fullAddress.lon = place.geometry.location.lng() 
    fullAddress.address = $('#autocomplete_1').val();
    $('#chng_loc').css('display', '');
    $('.locGrp').css('display', 'none');
    $('#location-span').text(fullAddress.address.substr(0, 50)+"...");
    localStorage.setItem('location', JSON.stringify(fullAddress));
    getKitchenLocation().then((r, err)=>{
        location.reload();
    });
    // showMap();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                {center: geolocation, radius: position.coords.accuracy});
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

function showMap() {
    var clientlocation = localStorage.getItem('location');;
    clientlocation = JSON.parse(clientlocation);
    let myLatLng = { lat: 28.6179505, lng: 77.31422119999999 };
    if(clientlocation){
        myLatLng = {lat: clientlocation.lat, lng: clientlocation.lon};
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: myLatLng,
    });
  
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
}