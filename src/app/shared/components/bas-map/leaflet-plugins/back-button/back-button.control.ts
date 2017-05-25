import * as L from 'leaflet';
import * as template from './back-button.control.html';

export const BackButtonControl: typeof L.Control = L.Control.extend({
  onAdd: function (map: L.Map) {
    let container: HTMLDivElement = <HTMLDivElement> L.DomUtil.create('div');
    container.innerHTML = template;
    container.addEventListener('click', () => {
      map.fire('level-back');
      event.stopPropagation();
    });
    return container;
  },
  onRemove: function (map: L.Map) {
    // Nothing to do here
  }
});
