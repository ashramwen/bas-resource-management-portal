import { ThingState } from './thing-state.interface';
export interface ExpandFields {
  hasTraits: boolean;
}

export interface StompThing {
  state: ThingState;
  target: string;
  expandFields: ExpandFields;
  timestamp: number;
}
