export interface GlobeLocation {
  id: string;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  home?: boolean;
}

// Regional footprint only, no fabricated cities, offices, or employers.
// Coordinates are geographic-centroid approximations for each region, not
// literal addresses.
export const GLOBE_LOCATIONS: GlobeLocation[] = [
  { id: "bangladesh", label: "Bangladesh", sublabel: "Home / base", lat: 23.685, lng: 90.3563, home: true },
  { id: "america", label: "America", sublabel: "Professional footprint", lat: 39.8283, lng: -98.5795 },
  { id: "dubai", label: "Dubai", sublabel: "Working with 2BitSoft", lat: 25.0957, lng: 55.161 },
  { id: "europe", label: "Europe", sublabel: "Professional footprint", lat: 50.8, lng: 10.3 },
];

export const GLOBE_ARCS: { from: string; to: string }[] = [
  { from: "bangladesh", to: "america" },
  { from: "bangladesh", to: "dubai" },
  { from: "bangladesh", to: "europe" },
];
