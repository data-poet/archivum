import { raceType } from "./race";
import { subRaceType } from "./sub-race";

export { raceType, subRaceType };

/** Every races entry type — source of truth for labels and relations (see meta.ts / relations.ts). */
export const RACES_TYPES = [raceType, subRaceType] as const;
