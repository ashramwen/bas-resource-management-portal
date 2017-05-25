import { Location } from '../../models/location.interface';
import { LocationWithPath } from './models/location-width-path.interface';

export class MapUtils {
  public static addClass(layer: L.Polygon, name: string) {
    let ele = layer.getElement();
    if (!ele.classList.contains(name)) {
      ele.classList.add(name);
    }
  }

  public static removeClass(layer: L.Polygon, name: string) {
    let ele = layer.getElement();
    if (ele.classList.contains(name)) {
      ele.classList.remove(name);
    }
  }
}
