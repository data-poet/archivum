import { pantheonType } from "./pantheon";
import { godType } from "./god";
import { churchType } from "./church";
import { orderType } from "./order";
import { relicType } from "./relic";
import { ritualType } from "./ritual";
import { creationMythType } from "./creation-myth";

export { pantheonType, godType, churchType, orderType, relicType, ritualType, creationMythType };

/** Every religions entry type — source of truth for labels and relations (see meta.ts / relations.ts). */
export const RELIGIONS_TYPES = [pantheonType, godType, churchType, orderType, relicType, ritualType, creationMythType] as const;
