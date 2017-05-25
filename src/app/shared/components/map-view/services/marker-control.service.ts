import { Injectable } from '@angular/core';
import { BasMarker } from '../models/marker.interface';
import { BMThing } from '../models/thing.interface';

@Injectable()
export class MarkerControlService {

  private _markers: BasMarker[];

  public loadMarkers(devices: BMThing[], map: L.Map) {
    this._clearMarkers();
    this._markers = devices.map((d) => {
      return this._createMarker(d, map);
    });
    return this._markers;
  }

  public updateMarkers(map: L.Map) {
    let updatedMarkers = this._findUpdatedMarkers(this._markers);
    return updatedMarkers.map((m) => {
      console.log(m.getElement());
      let index = this._markers.indexOf(m);
      let newMarker = this._createMarker(m.device, map);
      m.remove();
      newMarker.addTo(map);
      this._markers[index] = newMarker;
      return newMarker;
    });
  }

  private _findUpdatedMarkers(markers: BasMarker[]) {
    return markers.filter((m) => {
      return m.selected !== m.device.selected
        || m.highlighted !== m.device.highlighted;
    });
  }

  private _createMarker(device: BMThing, map: L.Map) {
    let color: string = '';
    let scale = 1;
    if (device.selected) {
      color = 'green';
    } else if (device.disabled) {
      color = '#ccc';
    } else {
      color = 'blue';
    }
    if (device.highlighted) {
      scale = 1.2;
    }

    let icon = L.divIcon({
      iconSize: [24, 24],
      html: `
        <svg height="24" transform="scale(${scale})" 
          viewBox="0 0 24 24" 
          width="24" 
          xmlns="http://www.w3.org/2000/svg">
            <path fill="${color}" 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `,
      className: 'device-icon'
    });
    let markerOptions: L.MarkerOptions = {
      icon: icon,
      clickable: true,
      draggable: false,
      keyboard: false,
      title: device.vendorThingID,
      alt: device.vendorThingID,
      opacity: 1,
      riseOnHover: true,
      riseOffset: 10
    };
    let marker: BasMarker = L.marker(device.geos, markerOptions);
    marker.device = device;
    marker.addTo(map);
    marker.selected = device.selected;
    marker.highlighted = device.highlighted;
    return marker;
  }

  private _clearMarkers() {
    if (!this._markers) { return; }
    this._markers.forEach((m) => { m.remove(); });
    this._markers = [];
  }
}
