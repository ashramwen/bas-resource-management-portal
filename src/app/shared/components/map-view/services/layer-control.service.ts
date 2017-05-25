import { Injectable } from '@angular/core';
import { BasArea } from '../models/area.interface';
import { MapUtils } from '../utils';
import { BMLocation } from '../models/location.interface';

@Injectable()
export class LayerControlService {

  private _layers: BasArea[];

  public clearLayers() {
    if (!this._layers) { return; }
    this._layers.forEach((l) => {
      l.remove();
    });
    this._layers = [];
  }

  public loadBuildingFeatures(locations: BMLocation[], map: L.Map) {

    let featureLayers = locations
      .reduce((ar, l) => ar.concat(this._initFeatures(l)), [] as BasArea[]);

    featureLayers.forEach((l) => {
      l.addTo(map);
      this._updateLayerState(l);
    });
    this._layers = featureLayers;
    return featureLayers;
  }

  public updateLayers(map: L.Map) {
    let updatedLayers = this._findUpdatedLayers(this._layers);
    return updatedLayers.map((l) => {
      let index = this._layers.indexOf(l);
      l.remove();
      let newFeature = this._initFeature(l.polygon, l.location);
      this._layers[index] = newFeature;
      newFeature.addTo(map);
      this._updateLayerState(newFeature);
      return newFeature;
    });
  }

  /**
   * find layer bounds
   * 
   * @private
   * @returns 
   * 
   * @memberOf MapViewCmp
   */
  public findBounds(map: L.Map) {
    let left = null;
    let right = null;
    let top = null;
    let bottom = null;

    let layers = this._layers;
    if (!layers || !layers.length) {
      let bounds = map.getBounds();
      left = bounds.getWest();
      top = bounds.getNorth();
      bottom = bounds.getSouth();
      right = bounds.getEast();
      return {
        left, top, bottom, right
      };
    } else {
      return MapUtils.findBounds(layers);
    }
  }

  private _updateLayerState(layer: BasArea) {
    if (layer.location.disabled) {
      this.fadeAndDisableLayer(layer);
    }
    if (layer.location.selected) {
      this.hightlightLayer(layer);
    }
  }

  private _findUpdatedLayers(layers: BasArea[]) {
    return layers.filter((l) => {
      return l.disabled !== l.location.disabled
        || l.selected !== l.location.selected
        || l.highlighted !== l.location.highlighted;
    });
  }

  private _initFeatures(d: BMLocation) {
    let features = d.geos.map((polygon) => {
      return this._initFeature(polygon, d);
    });
    return features;
  }

  private _initFeature(polygon: Array<[number, number]>, location: BMLocation) {
    let layerOptions: L.PolylineOptions = {
      className: 'loc-layer'
    };
    let feature: BasArea = L.polygon(polygon, layerOptions);
    feature.location = location;
    feature.disabled = location.disabled;
    feature.highlighted = location.highlighted;
    feature.selected = location.selected;
    feature.polygon = polygon;

    return feature;
  }

  private hightlightLayer(layer: BasArea) {
    MapUtils.removeClass(layer, 'fade');
    MapUtils.removeClass(layer, 'hide');
    MapUtils.addClass(layer, 'selected');
    this.enableLayer(layer);
  }

  private fadeAndDisableLayer(layer: BasArea) {
    this.fadeLayer(layer);
    this.disableLayer(layer);
  }

  private fadeAndEnableLayer(layer: BasArea) {
    this.fadeLayer(layer);
    this.enableLayer(layer);
  }

  private fadeLayer(layer: BasArea) {
    MapUtils.addClass(layer, 'fade');
  }

  private hideLayer(layer: BasArea) {
    MapUtils.addClass(layer, 'hide');
  }

  private disableLayer(layer: BasArea) {
    MapUtils.addClass(layer, 'disabled');
  }

  private enableLayer(layer: BasArea) {
    MapUtils.removeClass(layer, 'disabled');
  }
}
