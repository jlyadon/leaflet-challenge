let myMap = L.map("map", {
    center: [39.83, -98.58],
    zoom: 4
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Define your plasma color scale values
const plasmaColors = ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'];

// Set up the legend. The framework of the code for setting up the legend was provided by Xpert.
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];

    // Add legend title
    div.innerHTML = "<h4>Depth by<br>Color (km)</h4>";

    // Add color and label for each range
    for (let i = 0; i < limits.length; i++) {

        let textcolor = '';
        if (i < 6){textcolor = 'black'}
        else {textcolor = 'white'}

        div.innerHTML +=
            '<i style="background-color:' + d3.interpolatePlasma((200 - limits[i]) / 200) +
            ';">' +
            `<font color="${textcolor}">` +
            limits[i] + '</font></i><br>';
    }
    div.innerHTML +=
            '<i style="background-color: black"><font color="white">200+</font></i> ';
    return div;
};

// Adding the legend to the map
legend.addTo(myMap);

d3.json(link).then((data) =>{

    for (i=0;i<data.features.length;i++){
        quake = data.features[i]

        let lat = quake.geometry.coordinates[0];
        let long = quake.geometry.coordinates[1];
        let depth = quake.geometry.coordinates[2];

        function fillColor(z){ // Below, we put depth in to this function
            if (z > 200){return 'black'}
            else {return d3.interpolatePlasma((200 - z) / 200)}
        };

        let mag = quake.properties.mag;

        let circle = L.circle([long,lat], {
            // For documentation on the color code: https://medium.com/code-nebula/automatically-generate-chart-colors-with-chart-js-d3s-color-scales-f62e282b2b41
            color: 'black',
            weight: 1,
            fillColor: fillColor(depth),
            radius: 50000 * mag, 
        }).addTo(myMap)

        circle.bindPopup(`${quake.properties.title} | Depth: ${depth} km`)
    }
})