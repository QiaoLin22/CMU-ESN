const socket = io();
const username = $('#username-data').val();

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
}
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
  
navigator.geolocation.getCurrentPosition(success, error, options);

function initMap() {
  // Map options
  const options = {
      zoom: 12,
      center: { lat: 37.410600, lng: -122.059732 }
  }
  // New Map
  const map = new google.maps.Map(document.getElementById("map"), options);
  // Add Marker

}
