var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-51.1, -29.5]),
    zoom: 4
  })
});

var selectedPoint = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([-51.1, -29.5]))
});

var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      selectedPoint
    ]
  })
});
map.addLayer(layer);

map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;

  selectedPoint.getGeometry().setCoordinates(coordinate);
  $("#inpLatitude").val(coordinate[0]);
  $("#inpLongitude").val(coordinate[1]);
});

function setLatLong(inpLat, inpLong) {
  inpLat.val(mapLatitude);
  //refresh element
  inpLat.change();

  inpLong.val(mapLongitude);
  //refresh element
  inpLong.change();
};

//Refresh map
$('#mapModal').on('shown.bs.modal', function () {
  map.updateSize();
});