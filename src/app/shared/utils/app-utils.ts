import { Observable } from 'rxjs';
export class AppUtils {
  public static now() {
    return new Date().getTime();
  }

  public static wait(time: number) {
    return Observable.empty().delay(time).toPromise();
  };

  public static validateJson(text: string) {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static findBounds(geos: Array<[number, number]>): [[number, number], [number, number]] {
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    geos.forEach((geo) => {
      left = left < geo[0] ? left : geo[0];
      right = right > geo[0] ? right : geo[0];
      top = top < geo[1] ? top : geo[1];
      bottom = bottom > geo[1] ? bottom : geo[1];
    });

    return [[left, top], [right, bottom]];
  }
}
