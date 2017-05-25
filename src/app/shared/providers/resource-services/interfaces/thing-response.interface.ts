
export interface ThingResponse {
  id: number;
  createDate: number;
  modifyDate: number;
  createBy: string;
  modifyBy: string;
  isDeleted: boolean;
  vendorThingID: string;
  kiiAppID: string;
  type: string;
  fullKiiThingID: string;
  schemaName: string;
  schemaVersion: string;
  kiiThingID: string;
  locations: string[];
}
