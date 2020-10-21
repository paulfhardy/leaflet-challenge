//*********************************************************************/
// Leaflet mapping using Geojson data from USGS on global earthquakes
// recorfed over the past week.  The data is updated every minute.
// This program reads in the geojson data, and maps the earthquake data
// in three ways: 
//  1) Circles represent the location (latlng) of the earthquake on the map.
//  2) The size of the circle represents the magnitude of the earthquake.
//  3) The color of the circle represents the depth of the earthquake.
// Program Developed and tested by : Paul Hardy
// Program create on : 10/21/2020
//**********************************************************************/

// Store our API endpoint inside queryUrl - this is dat for the last week of activity.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the Magmitude, Depth, Place, & time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag +
        "<div>"+"Depth: " + feature.geometry.coordinates[2] + " km"+ "</div>" +
        "<div>"+"Location: " + feature.properties.place + "</div>" +

        "<hr><p>" + "Time: "+ new Date(feature.properties.time) + "</p>");
    };
    
    // Define a variable mags that we want to run once for each feature in the features array
    // to create a layer of circles for each earthquake, at the location specified. Also set the 
    // radius of the circles to represent the magnitude of the earthquake, and the color to represent
    // the depth of the earthquake.
    var mags = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return new L.Circle(latlng, {
        // radius: feature.properties.mag*20000,
        radius: Math.pow(2,feature.properties.mag/1.1)*10000,
        fillOpacity: 100,
        fillColor: getColor(feature.geometry.coordinates[2]),
        stroke: true,
        color: "black",
        weight: 1 
      });
    }
   });

   // Sending our earthquakes layer (mags) to the createMap function
   createMap(mags);
}  // createFeature function ends here

function createMap(mags) {
  
  // Create our map, giving it the light map layer and mags layer to display on load
  var myMap = L.map("map", {
    center: [
      0, 0],
    zoom: 3,
    layers: [mags]
   });

   // Define lightmap layer and add it to the map
   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
   }).addTo(myMap);

   // Set up the legend
    var legend = L.control({ position: "bottomright" });
        
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend");
        depths = [0,10,30,50,70,90]
  
    var legendInfo = `<h3>Earthquake <br> Depth (km) </h3>`;
    div.innerHTML = legendInfo;

      for (var i = 0; i < depths.length; i++) {
        div.innerHTML += 
        '<i style="background:' + getColor(depths[i]) + '"></i> ' + 
        depths[i] + (depths[i + 1] ? '&ndash;' + ((depths[i + 1]) -1) + '<br>' : '+');
      }
      return div;
    };
  
    // Add the legend to the map
    legend.addTo(myMap);

}; // End of createMaps function.

// Function getColor establishes the colors for different depths of the earthquakes
// and is used to represent the colors in the legend.
function getColor(d) {
  return d >= 90   ? '#ff4000' :
         d >= 70   ? '#ff8000' :
         d >= 50   ? '#ffbf00' :
         d >= 30   ? '#ffff00' :
         d >= 10   ? '#bfff00' :
         d >= 0    ? '#80ff00' :
                    '#00ff00';
};