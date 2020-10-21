// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag +
      "<div>"+"Depth: " + feature.geometry.coordinates[2] + " km"+ "</div>" +
      "<div>"+"Location: " + feature.properties.place + "</div>" +

      "<hr><p>" + "Time: "+ new Date(feature.properties.time) + "</p>");
  };

  function getColor(d) {
    return d > 90   ? '#ff0000' :
           d > 70   ? '#ff4000' :
           d > 50   ? '#ff8000' :
           d > 30   ? '#ffbf00' :
           d > 10   ? '#ffff00' :
           d > 1    ? '#bfff00' :
                      '#80ff00';
};
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  // });

  var mags = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return new L.Circle(latlng, {
        // radius: feature.properties.mag*20000,
        radius: Math.pow(2,feature.properties.mag)*10000,
        fillOpacity: 100,
        fillColor: getColor(feature.geometry.coordinates[2]),
        stroke: true,
        color: "black",
        weight: 1 
      });
    }
  });

  // Sending our earthquakes layer to the createMap function
 // createMap(earthquakes, mags);
 createMap(mags);
}

function createMap(mags) {
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71],
    zoom: 4,
    layers: [mags]
  });
  // Define streetmap and darkmap layers
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "dark-v10",
  //   accessToken: API_KEY
  // });

  // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap
//   //  "Dark Map": darkmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//  //    Earthquakes: earthquakes,
//      Magnitudes: mags
//    };

function getColor(d) {
  return d > 90   ? '#ff0000' :
         d > 70   ? '#ff4000' :
         d > 50   ? '#ff8000' :
         d > 30   ? '#ffbf00' :
         d > 10   ? '#ffff00' :
         d > 0    ? '#bfff00' :
                    '#80ff00';
};

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  //  L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

    // Set up the legend
  var legend = L.control({ position: "bottomleft" });
      
    legend.onAdd = function (myMap) {
      var div = L.DomUtil.create("div", "info legend");
      depths = [0,10,30,50,70,90]
      labels = [];
  
    //   // Add min & max
    //   var legendInfo = `<h1>Median Income</h1>
    //     <div class="labels">
    //       <div class="min"> ${limits[0].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 3})} </div>
    //       <div class="max"> ${limits[limits.length - 1].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 4})} </div>
    //     </div>`;
    // Add min & max
    var legendInfo = `<h3>Earthquake Depth (km) </h3>`;

    div.innerHTML = legendInfo;
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML += 
        '<i style="background:' + getColor(depths[i]) + '"></i> ' + 
        depths[i] + (depths[i + 1] ? '&ndash;' + ((depths[i + 1]) -1) + '<br>' : '+');
      }
      return div;
    };
      //   div.innerHTML = legendInfo;
  
    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });
  
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };
  
    // // Adding legend to the map
    legend.addTo(myMap);
};