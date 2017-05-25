import * as L from 'leaflet';
import * as template from './selection-button.control.html';

export const SelectionButtonControl: typeof L.Control = L.Control.extend({
  onAdd: function (map: L.Map) {
    let container: HTMLDivElement = <HTMLDivElement> L.DomUtil.create('div');
    let state: boolean = false;
    container.innerHTML = template;
    let myButton = container.querySelector('button.bm-selection-button');
    container.addEventListener('click', () => {
      state = !state;
      if (state) {
        myButton.classList.add('active');
      } else {
        myButton.classList.remove('active');
      }
      map.fire('selection-mode-change', { state });
      event.stopPropagation();
    });
    return container;
  },
  onRemove: function (map: L.Map) {
    // Nothing to do here
  }
});
