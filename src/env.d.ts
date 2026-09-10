/// <reference path="../.astro/types.d.ts" />

// No upstream types ship for this package (a fork of d3-force used
// internally by force-graph) — declaring only the two exports actually used.
declare module 'd3-force-3d' {
  export function forceX<N>(x?: number | ((node: N) => number)): {
    strength(strength: number): any;
  };
  export function forceY<N>(y?: number | ((node: N) => number)): {
    strength(strength: number): any;
  };
}
