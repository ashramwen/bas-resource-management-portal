import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaFeature, Building } from '../models/building.interface';
import { Http } from '@angular/http';

@Injectable()
export class MapService {

  constructor(
    private http: Http
  ) { }
  public getBuildingsGeo(): Observable<Building[]> {
    return this.http.get('./assets/mock-data/new.geojson')
      .map((r) => {
        return r.json();
      })
      .map((r: AreaFeature[]) => {
        r.forEach((f) => {
          f.geometry.coordinates[0]
            .forEach((point) => {
              let temp = point[1];
              point[1] = point[0];
              point[0] = temp;
            });
        });
        return [{
          id: '08',
          data: r,
          levels: [{
            name: '7',
            id: '0807'
          }]
        }];
      });
  }
}
