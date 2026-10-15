export interface GlobeLocation {
  id: string;
  label: string;
  sublabel: string;
  // Shown on first load, before anyone has picked a location.
  initialSublabel?: string;
  lat: number;
  lng: number;
  home?: boolean;
}

// Regional footprint, labelled with the company worked with in each region.
// Coordinates are geographic-centroid approximations for each region, not
// literal addresses.
export const GLOBE_LOCATIONS: GlobeLocation[] = [
  { id: "bangladesh", label: "Bangladesh", sublabel: "Ledgercross · Home base", initialSublabel: "Home base", lat: 23.685, lng: 90.3563, home: true },
  { id: "america", label: "America", sublabel: "Working with RemoteIntegrity", lat: 39.8283, lng: -98.5795 },
  { id: "europe", label: "Europe", sublabel: "Working with RemoteIntegrity", lat: 50.8, lng: 10.3 },
];

export const GLOBE_ARCS: { from: string; to: string }[] = [
  { from: "bangladesh", to: "america" },
  { from: "bangladesh", to: "europe" },
];
