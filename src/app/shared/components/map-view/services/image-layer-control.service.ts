import { Injectable } from '@angular/core';
import { MapUtils } from '../utils';
import { BMLocation } from '../models/location.interface';
import { BMImageLayer } from '../models/image-layer.interface';
import { BMImage } from '../models/image.interface';

@Injectable()
export class ImageLayerControlService {

  private _layers: BMImageLayer[];

  public clearLayers() {
    if (!this._layers) { return; }
    this._layers.forEach((l) => {
      l.remove();
    });
    this._layers = [];
  }

  public loadImages(images: BMImage[], map: L.Map) {
    this.clearLayers();
    let imageLayers = this._initImageLayers(images, map);
    this._layers = imageLayers;
    return imageLayers;
  }

  private _initImageLayers(imgs: BMImage[], map: L.Map) {
    let imageLayers = imgs.map((img) => this._initImageLayer(img, map));
    return imageLayers;
  }

  private _initImageLayer(img: BMImage, map: L.Map) {
    let imageLayer: BMImageLayer = L.imageOverlay(img.imageUrl, img.geos).addTo(map);
    imageLayer.image = img;
    return imageLayer;
  }
}
