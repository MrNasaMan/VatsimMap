

var map = L.map("map").setView([39.8283, -98.5795], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

var markers = {};

var planeIcon = L.icon({
  iconUrl: 'https://www.freeiconspng.com/uploads/airplane-icon-image-gallery-1.png',
  iconSize: [20, 20],
  iconAnchor: [20, 20]
});

function updateMarkers() {
  axios
    .get("https://api.codetabs.com/v1/proxy/?quest=https://data.vatsim.net/v3/vatsim-data.json")
    .then(function (response) {
      const data = response.data.pilots;
   
      for (var i = 0; i < data.length; i++) {
        const client = data[i];
        if (client.flight_plan !== null) {
          const callsign = client.callsign;
          const air = client.flight_plan.aircraft_short;
          const dep = client.flight_plan.departure;
          const arr = client.flight_plan.arrival;
          const heading = client.heading;
          const latitude = client.latitude;
          const longitude = client.longitude;
          const alt= client.altitude;
          const tooltipContent = `Callsign: ${callsign}<br>Dep: ${dep}<br>Arr: ${arr}<br>Alt: ${alt} ft<br> Type: ${air}`;
      
          if (markers.hasOwnProperty(callsign)) {
            markers[callsign].setLatLng([latitude, longitude]);
            markers[callsign].setRotationAngle(heading);
          } else {
            var marker = L.marker([latitude, longitude], { icon: planeIcon, rotationAngle: heading }).addTo(map);
            marker.bindTooltip(tooltipContent);
            markers[callsign] = marker;
            
            
            marker.on('click', function(e) {
              const options = {
                method: 'GET',
                url: 'https://airport-info.p.rapidapi.com/airport',
                params: {icao: dep},
                headers: {
                  'X-RapidAPI-Key': 'a2c3878f6amsh8b2be779683e14dp1475f7jsnf98a5013caa5',
                  'X-RapidAPI-Host': 'airport-info.p.rapidapi.com'
                }
              };
            
              axios.request(options).then(function (response) {
                const depLat = response.data.latitude;
                const depLong = response.data.longitude;
                const options2 = {
                  method: 'GET',
                  url: 'https://airport-info.p.rapidapi.com/airport',
                  params: {icao: arr},
                  headers: {
                    'X-RapidAPI-Key': 'a2c3878f6amsh8b2be779683e14dp1475f7jsnf98a5013caa5',
                    'X-RapidAPI-Host': 'airport-info.p.rapidapi.com'
                  }
                };
            
                axios.request(options2).then(function (response) {
                  const arrLat = response.data.latitude;
                  const arrLong = response.data.longitude;

                  var latlngs = [];

                  var latlng1 = [depLat, depLong],
                    latlng2 = [arrLat, arrLong];
                  
                  var offsetX = latlng2[1] - latlng1[1],
                    offsetY = latlng2[0] - latlng1[0];
                  
                  var r = Math.sqrt( Math.pow(offsetX, 2) + Math.pow(offsetY, 2) ),
                    theta = Math.atan2(offsetY, offsetX);
                  
                  var thetaOffset = (3.14/10);
                   
                  var r2 = (r/2)/(Math.cos(thetaOffset)),
                    theta2 = theta + thetaOffset;
                  
                  var midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
                    midpointY = (r2 * Math.sin(theta2)) + latlng1[0];
                  
                  var midpointLatLng = [midpointY, midpointX];
                  
                  latlngs.push(latlng1, midpointLatLng, latlng2);
                  
                  var pathOptions = {
                    color: 'blue',
                    weight: 4
                  }
                  var line = L.curve(
                    [
                      'M', latlng1,
                      'Q', midpointLatLng,
                         latlng2
                    ], pathOptions).addTo(map);

            
                  let lineIsVisible = true;
                  line.on('click', function(e) {
                    if (lineIsVisible) {
                      map.removeLayer(line);
                      lineIsVisible = false;
                    } else {
                      map.addLayer(line);
                      lineIsVisible = true;
                    }
                  });
                }).catch(function (error) {
                  console.error(error);
                });
              }).catch(function (error) {
                console.error(error);
              });
            });
            
            

          }
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    handler.getControllers().then(val => console.log(val));
}


updateMarkers();


setInterval(function () {
  updateMarkers();
}, 15000);
