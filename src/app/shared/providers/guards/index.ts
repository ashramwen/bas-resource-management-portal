import { AuthGuard } from './authen-guard.service';
import { MetaGuard } from './meta-guard.service';

export const GUARD_SERVICES = [AuthGuard, MetaGuard];
