import jquery from 'jquery';

var endpoint = 'https://www.cloudflare.com/cdn-cgi/trace';
var location = 'http://ip-api.com/json/';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export async function getLocation(lat, long) {
  try {
      let r1 = await jquery.get(endpoint);
      let r2 = await jquery.get(location + r1.substring(34, 47));
      let km = getDistanceFromLatLonInKm(lat, long, r2.lat, r2.lon);
      return Math.ceil(km / 1.609);
  } catch(e) {
      // console.log(e);
      throw e;
  }
}