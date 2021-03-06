# leaflet-challenge

## Please note:

#### Run Instructions:

1) Clone the repository to your local system.
2) Place a config.js file that contains the line: const API_KEY =  "A valid api access token from mapbox.com"
3) Open index.html in Live Server to see the results of earthquake activity for the past week.



#### 1. Map:  All step 1 map requirements have been met including:

* The Tile layer (light-V10) loads without error.
* A D3 call is made to the USGS url to fetch geojson data for the past week.
* Circles are created with radius corresponding to the magnitude of the earthquake. 
* A legend of colors and depths was added to represent the colors and depths of the each earthquake.

#### 2. Data Points: Each data point (circle) on the map represents the earthquake data in the following ways:

* Circles represent the geographical location (latitude & longitude) of the earthquake on the map.
* The size of each circle represents the magnitude of the earthquake - larger circles represents greater magnitude.
* The color of each circle represents the depth of the earthquake - lighter colors are less deep, darker colors are deeper. Depth is measured in kilometers (km).
* A tooltip has been added to each circle that displays the magnitude, depth, location, and time of the earthquake.

#### 3. A screen capture of the working map appears below:

![Screencapture](ScreenCapture.PNG)

___