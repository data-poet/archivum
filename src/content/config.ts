/**
 * Root content collections orchestrator.
 * To add a collection: Create `schema.ts` and `meta.ts` in the target folder, then register in `collections`.
 */

import { religions } from "./religions/schema";
import { races } from "./races/schema";

export const collections = { religions, races };