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
var islandLoc = {
  'Nanumea':{
    'cor': [176.124937, -5.674855],
    'zoom': 13
  },
  'Niutao':{
    'cor': [177.342939, -6.108872],
    'zoom': 14
  },
  'Nanumaga':{
    'cor': [176.319494, -6.285822],
    'zoom': 13
  },
  'Nui':{
    'cor': [177.162076, -7.220970],
    'zoom': 13
  },
  'Vaitupu':{
    'cor': [178.678998, -7.477828],
    'zoom': 13
  },
  'Nukufetau':{
    'cor': [178.367552, -7.994038],
    'zoom': 11.5
  },
  'Funafuti':{
    'cor': [179.114308, -8.516122],
    'zoom': 11
  },
  'Nukulaelae':{
    'cor': [179.832588, -9.383703],
    'zoom': 12
  },
  'Niulakita':{
    'cor': [179.473064, -10.789087],
    'zoom': 15
  }
};

$(document).ready(function() {
  $("#slidervalue").text(`${$(".slider").val()} m`);
  $.ajax('https://raw.githubusercontent.com/adawyj97/Capstone-Project/master/Data/DEM_grid_attri.json').done(function(dataset) {
      data = JSON.parse(dataset);
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
              'fill-opacity': 0.8
            },
            'filter': ["==", `bel_${$("#myRange").val()}0_con`.slice(0, 10), 1]
          }, '3d-buildings');
        });

      document.getElementById("islands").onchange = function() {
        var selected = $("#islands option:selected").text();
        map.flyTo({
          center: islandLoc[selected].cor,
          zoom: islandLoc[selected].zoom,
          essential: true
        });
      };

      document.getElementById("myRange").onchange= function() {
        var elev = $("#myRange").val();
        var predicate = `bel_${elev}0_con`.slice(0, 10);
        $("#slidervalue").text(`${elev} m`);
        map.setFilter('fishnet', ["==", predicate, 1]);
      };

      $("#transportation_switch").on('change', function() {
        if ($(this).is(':checked')) {
          map.setPaintProperty('fishnet', 'fill-color',  [
            'match',
            ['get', 'Tran_recla'],
            0,
            '#f0f9e8',
            1,
            '#ccebc5',
            2,
            '#a8ddb5',
            3,
            '#7bccc4',
            4,
            '#43a2ca',
            '#0868ac'
          ]);
        }
        else {
          map.setPaintProperty('fishnet', 'fill-color', '#088');
        }
      });
  });
});
