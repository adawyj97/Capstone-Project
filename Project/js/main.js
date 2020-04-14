mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWh3eWo5NyIsImEiOiJjaXRqbDY4MGowODd2MnNudjZoYTRoYTdvIn0.IJkerWhlLG-vRoCpqtL8NA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [179.199436, -8.519515],
    zoom: 16,
    pitch: 50,
    bearing: -5.6,
    container: 'map',
    antialias: true
});

var data;
$(document).ready(function() {
  $.ajax('https://raw.githubusercontent.com/adawyj97/Capstone-Project/master/Data/Tuvalu_grid.json').done(function(dataset) {
      data = JSON.parse(dataset);
        });
      });

map.on('load', function() {
  map.addSource('elevation', {
    type: 'geojson',
    data: data
  });

  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;
  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer(
  {
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    }, labelLayerId
    );


    map.addLayer({'id': 'fishnet',
      'type': 'fill',
      'source': 'elevation',
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.5
      }
    }, '3d-buildings');
  });
