// LEAFLET MAP: REDFIN + DIVVY


var myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 13
});


var highContrastmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.high-contrast",
    accessToken: API_KEY
  });

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

var divvyMarkers = new L.LayerGroup();

var redfinDivvy= "/api/redfin_divvy"

d3.json(redfinDivvy, function(response) {
var coord = []
var info = []
var divvy = []
var divInfo = []
  Object.keys(response).forEach(function(key) {
    coord.push([response[key].redfin_lat,response[key].redfin_lng])
    info.push([response[key].neighborhood,response[key].sale_price,response[key].homes_sold,response[key].count])
    divvy.push([response[key].divvy_lat,response[key].divvy_lng])
    divInfo.push([response[key].name,response[key].capacity,response[key].num_bikes_available])
  });
  console.log(coord)
  console.log(info)
  console.log(divvy)
  console.log(divInfo)


  for (var i = 0; i < coord.length; i++) {
       L.circleMarker(coord[i], {
        fillColor: chooseColor(info[i][1]),
        color: "white",
        radius: countSize(info[i][3]),
        fillOpacity: 0.1,
        weight: 1.5

       })
       .bindPopup("<h4>" + info[i][0]+ "</h4> <br> <h6> Sale Price: $" + info[i][1] +  "K</h6> <br> <h6> Homes Sold: " + info[i][2] + "</h6> <br> <h6> Total Divvy Stations : " + info[i][3] + "</h6>")
       .addTo(myMap);
     }
     var myIcon = L.icon({
      iconUrl: 'https://apprecs.org/gp/images/app-icons/300/5b/com.mattkula.chicagobikelocator.jpg',
      iconSize: [19, 25],
      iconAnchor: [0, 0],
      popupAnchor: [-3, -76],
      shadowUrl: 'https://www.worldcancerday.org/modules/custom/uicc_map/angularjs/app/assets/img/marker-shadow.png',
      shadowSize: [49, 25],
      shadowAnchor: [0, 0]
    });

  for (var i = 0; i < divvy.length; i++) {
      L.marker(divvy[i], {icon: myIcon})
      .bindPopup("<h4>Divvy Station: " + divInfo[i][0]+ "</h4> <br> <h6> Capacity: " + divInfo[i][1] +  "</h6> <br> <h6> Divvy Bikes Available: " + divInfo[i][2] +  "</h6>")
      .addTo(divvyMarkers);
      divvyMarkers.addTo(myMap);
      ;
    }

     function chooseColor(sale) {
      switch (true) {
      case sale < 100:
        return "#7fc97f";
      case sale < 200:
        return "#beaed4";
      case sale < 300:
        return "#fdc086";
      case sale < 400:
        return "#ffff99";
      case sale < 500:
        return "#386cb0";
      case sale > 500:
        return "#f0027f"
      default:
        return "#bf5b17";
      }
    }

    function countSize(cot) {
      return cot * 4;
    }


  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var sales = [0,100,200,300,400,500,600];
    var labels = ['<strong> Sale Price ($) in K </strong>'];
    var colors = [
        "#7fc97f",
        "#beaed4",
        "#fdc086",
        "#ffff99",
        "#386cb0",
        "#f0027f",
        "#bf5b17"
      ];
    
      var baseMaps = {
        "Hight-Contrast": highContrastmap,
        "Street Map": streetmap,
        "Satellite": satellitemap
       };
      
       var overlayMaps = {
        DivvyStations: divvyMarkers
      };

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

  
    for (var i = 0; i < sales.length; i++) {
       
            labels.push('<i style="background:' + colors[i] + '"></i> ' +
            sales[i] + (sales[i + 1] ? '&ndash;' + sales[i + 1] + '<br>' : '+'));
            
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(myMap);



});
