export type LocationLevel = undefined | 'building' | 'floor' | 'partition' | 'area' | 'site';

export interface LocationResponse {
  location: string;
  locationLevel: LocationLevel;
  subLocations: { [subLocation: string]: LocationResponse };
}
