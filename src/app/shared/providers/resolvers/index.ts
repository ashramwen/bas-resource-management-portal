import { BuildingResolver } from './building-resolver.service';
import { LightsResolver } from './lights-resolver.service';
import { LightResolver } from './light-resolver.service';

export const RESOLVERS = [LightsResolver, LightResolver, BuildingResolver];
