export interface ESQueryOption {
  endTime: number;
  power: boolean | number;
  startTime: number;
  target: string[];
  allTargets?: boolean;
  group: GroupType;
  pipeline?: GroupType;
}

export enum GroupType {
  None = 0,
  Hour = 1 << 0,
  Day = 1 << 1,
  Target = 1 << 2,
}
