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

  public static findBounds(layers: L.Polygon[]) {
    let left = null;
    let right = null;
    let top = null;
    let bottom = null;

    layers.forEach((child) => {
      if (left === null) {
        left = child.getBounds().getWest();
      } else if (left > child.getBounds().getWest()) {
        left = child.getBounds().getWest();
      }
      if (right === null) {
        right = child.getBounds().getEast();
      } else if (right < child.getBounds().getEast()) {
        right = child.getBounds().getEast();
      }
      if (top === null) {
        top = child.getBounds().getNorth();
      } else if (top > child.getBounds().getNorth()) {
        top = child.getBounds().getNorth();
      }
      if (bottom === null) {
        bottom = child.getBounds().getSouth();
      } else if (bottom < child.getBounds().getSouth()) {
        bottom = child.getBounds().getSouth();
      }
    });

    return {
      left, right, top, bottom
    };
  }
}
