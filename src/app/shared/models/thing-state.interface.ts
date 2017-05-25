export interface ThingState {
  Bri?: number;
  CO2?: number;
  Humidity?: number;
  Noise?: number;
  PIR?: number;
  PM25?: number;
  Power?: boolean;
  Smoke?: number;
  Temp?: number;
  VOC?: number;
  Brightness?: number;

  date?: number;
  target?: string;
}
