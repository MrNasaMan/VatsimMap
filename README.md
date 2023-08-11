# VatsimMap
A Map which overlays vatsim traffic

**Description**

A basic website that uses the vatsim api to collect airplane positions and place them on top of a map.

This takes use of the leaflet library to place markers on top of the map which are planes. It then gatheres heading and flight information from the api to rotate the marker to the plane's actual heading and to display flight information. 

Upon the click of the airplane, it will do some math and draw the shortest possible distance from the departure to arrival airport. This was done as a way of showing the flight path.

THIS IS A BETA VERSION. IT IS NOT GUARENTEED TO WORK

**Packages**


Code Mostly in Node JS
Uses Leaflet and Axios
