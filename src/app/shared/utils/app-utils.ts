import { Observable } from 'rxjs';
export class AppUtils {
  public static now() {
    return new Date().getTime();
  }

  public static wait(time: number) {
    return Observable.empty().delay(time).toPromise();
  };
}
