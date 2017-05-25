import * as L from 'leaflet';

export const LabelOverlay = L.Class.extend({
  initialize: function (/*LatLng*/ latLng, /*String*/ label, options) {
    this._latlng = latLng;
    this._label = label;
    L.Util.setOptions(this, options);
  },
  options: {
    offset: new L.Point(0, 2)
  },
  onAdd: function (map) {
    this._map = map;
    if (!this._container) {
      this._initLayout();
    }
    map.getPanes().overlayPane.appendChild(this._container);
    this._container.innerHTML = this._label;
    map.on('viewreset', this._reset, this);
    this._reset();
  },
  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._container);
    map.off('viewreset', this._reset, this);
  },
  _reset: function () {
    var pos = this._map.latLngToLayerPoint(this._latlng);
    var op = new L.Point(pos.x + this.options.offset.x, pos.y - this.options.offset.y);
    L.DomUtil.setPosition(this._container, op);
  },
  _initLayout: function () {
    this._container = L.DomUtil.create('div', 'leaflet-label-overlay');
  }
});


 // add text labels:
    // var labelLocation = new L.LatLng(51.329219337279405, 10.454119349999928);
    // var labelTitle = new L.LabelOverlay(labelLocation, '<b>GERMANY</b>');
    // map.addLayer(labelTitle);


    // var labelLocation2 = new L.LatLng(47.71329162782909, 13.34573480000006);
    // var labelTitle2 = new L.LabelOverlay(labelLocation2, '<b>AUSTRIA</b>');
    // map.addLayer(labelTitle2);

    // // In order to prevent the text labels to "jump" when zooming in and out,
    // // in Google Chrome, I added this event handler:

    // map.on('movestart', function () {
    //     map.removeLayer(labelTitle);
    //     map.removeLayer(labelTitle2);
    // });
    // map.on('moveend', function () {
    //     map.addLayer(labelTitle);
    //     map.addLayer(labelTitle2);
    // });
