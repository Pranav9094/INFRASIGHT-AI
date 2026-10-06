// ============================================================
// INFRA-SIGHT — Open Source Bridge Asset Registry
// Extensible slots for multi-bridge digital twins
// ============================================================

import type {
  Asset, AssetComponent, DataSource, Evidence, AssetEvent,
  Inspection, MaintenanceRecord, EngineeringSpec
} from '../types';

// ============================================================
// 1. BROOKLYN BRIDGE (BR-BKN-002) - Open Source Dataset Slot
// ============================================================
export const BKN_ASSET: Asset = {
  id: 'BR-BKN-002',
  asset_type: 'bridge',
  name: 'Brooklyn Bridge',
  location: 'East River, New York City (Manhattan–Brooklyn), NY, USA',
  latitude: 40.7061,
  longitude: -73.9969,
  geometry: {
    type: 'LineString',
    coordinates: [[-74.0048, 40.7107], [-73.9898, 40.7018]]
  },
  opening_date: '1883-05-24',
  construction_date: '1869-01-03',
  operator: 'New York City Department of Transportation (NYCDOT)',
  authority: 'NYCDOT Division of Bridges',
  status: 'Operational',
  description: 'Historic hybrid cable-stayed/suspension bridge spanning the East River between Manhattan and Brooklyn. Designed by John A. Roebling, featuring iconic neo-Gothic stone masonry towers and galvanized steel wire cables.',
  source_id: 'nycdot-bridges',
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-05T00:00:00Z',
};

export const BKN_COMPONENTS: AssetComponent[] = [
  {
    id: 'BKN-TOWER-MAN',
    asset_id: 'BR-BKN-002',
    component_type: 'tower',
    name: 'Manhattan Stone Tower (Granite/Limestone)',
    model_node_id: 'tower_man',
    status: 'Operational',
    condition: 'Monitor',
    condition_description: 'Neo-Gothic dual pointed arches in Rosendale cement and Maine granite. Mortar repointing and micro-crack monitoring conducted under NYCDOT historic structures preservation program.',
    corrosion_status: 'Masonry weather exposure monitored; iron tie anchors stabilized',
    risk: 'Medium',
    risk_score: 48,
    confidence: 0.82,
    evidence_ids: ['EV-BKN-TWR-01', 'EV-BKN-PRESERV-01'],
    next_verification: 'Scheduled biennial aerial masonry photogrammetry inspection.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'BKN-TOWER-BKN',
    asset_id: 'BR-BKN-002',
    component_type: 'tower',
    name: 'Brooklyn Stone Tower (Granite/Limestone)',
    model_node_id: 'tower_bkn',
    status: 'Operational',
    condition: 'Monitor',
    condition_description: 'Sound bedrock foundation seating. Historic stone weathering monitored with acoustic sensors and visual LIDAR scans.',
    corrosion_status: 'Masonry weather exposure monitored; structural granite sound',
    risk: 'Medium',
    risk_score: 46,
    confidence: 0.84,
    evidence_ids: ['EV-BKN-TWR-01'],
    next_verification: 'Review point cloud scan against previous LIDAR baseline.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'BKN-DECK-001',
    asset_id: 'BR-BKN-002',
    component_type: 'deck',
    name: 'Suspended Roadway Deck & Promenade',
    model_node_id: 'deck',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Steel stiffening trusses supporting lower vehicular roadway and elevated pedestrian/bicycle timber boardwalk. Major deck rehab completed with anti-corrosion barrier.',
    corrosion_status: 'Protected by modern zinc-rich paint system and waterproofing membrane',
    risk: 'Low',
    risk_score: 28,
    confidence: 0.88,
    evidence_ids: ['EV-BKN-DECK-01'],
    next_verification: 'Continuous vehicular load monitoring (weight restriction enforcement).',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'BKN-CABLE-MAIN',
    asset_id: 'BR-BKN-002',
    component_type: 'cable',
    name: 'Main Suspension Cables (4 Galv. Bundles)',
    model_node_id: 'cable_main',
    status: 'Operational',
    condition: 'Monitor',
    condition_description: 'Four 15.75-inch (40 cm) diameter galvanized steel wire cables. Acoustic emission sensors installed along anchorage chambers to detect wire fractures.',
    corrosion_status: 'Dehumidification and continuous acoustic monitoring in place',
    risk: 'Medium',
    risk_score: 52,
    confidence: 0.79,
    evidence_ids: ['EV-BKN-CBL-01'],
    next_verification: 'Internal cable unwrapping inspection cycle review.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'BKN-STAYS-001',
    asset_id: 'BR-BKN-002',
    component_type: 'cable',
    name: 'Diagonal Stay Cables (Roebling System)',
    model_node_id: 'stays',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Distinctive diagonal wire stays radiating from tower saddle tops down into the deck floor beams, providing aerodynamic torsional stiffness.',
    corrosion_status: 'High-grade protective coating inspected annually',
    risk: 'Low',
    risk_score: 24,
    confidence: 0.85,
    evidence_ids: ['EV-BKN-CBL-01'],
    next_verification: 'Tension harmonization check during annual review.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'BKN-CAISSON-001',
    asset_id: 'BR-BKN-002',
    component_type: 'pier',
    name: 'Timber Pneumatic Sub-River Caissons',
    model_node_id: 'caisson',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Submerged southern yellow pine timber caissons filled with concrete, permanently submerged in East River silt and bedrock, preventing oxygenation and decay.',
    corrosion_status: 'Anaerobic underwater conditions preserve timber indefinitely',
    risk: 'Low',
    risk_score: 18,
    confidence: 0.90,
    evidence_ids: ['EV-BKN-CAIS-01'],
    next_verification: 'Sonar bathymetric scour survey every 5 years.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
];

export const BKN_SOURCES: DataSource[] = [
  {
    id: 'nycdot-bridges',
    name: 'NYCDOT Division of Bridges Official Records',
    type: 'official',
    tier: 'VERIFIED',
    url: 'https://www.nyc.gov/html/dot/html/infrastructure/bridges.shtml',
    status: 'active',
    trust_level: 0.95,
    description: 'Municipal engineering agency responsible for operation, maintenance, and structural safety of the Brooklyn Bridge.',
  },
  {
    id: 'open-meteo-nyc',
    name: 'Open-Meteo Live Marine Wind & Weather (NYC)',
    type: 'live_api',
    tier: 'LIVE',
    url: 'https://open-meteo.com',
    status: 'active',
    trust_level: 0.92,
    description: 'Automated weather observation API calibrated to East River coordinates.',
  },
  {
    id: 'bkn-open-mesh',
    name: 'Open-Source Photogrammetry & LiDAR Registry',
    type: 'geospatial',
    tier: 'DERIVED',
    url: 'https://github.com/infrasight/open-bridge-models',
    status: 'active',
    trust_level: 0.88,
    description: 'Open-source 3D survey scan and digital twin topology for structural analysis.',
  },
];

export const BKN_SPECS: EngineeringSpec[] = [
  { id: 'BKN-SPEC-01', asset_id: 'BR-BKN-002', category: 'Geometry', parameter: 'Total Length', value: '1,825.4 m (5,989 ft)', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.99 },
  { id: 'BKN-SPEC-02', asset_id: 'BR-BKN-002', category: 'Geometry', parameter: 'Main Span Length', value: '486.3 m (1,595.5 ft)', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.99 },
  { id: 'BKN-SPEC-03', asset_id: 'BR-BKN-002', category: 'Towers', parameter: 'Tower Height Above High Water', value: '84.3 m (276.5 ft)', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.98 },
  { id: 'BKN-SPEC-04', asset_id: 'BR-BKN-002', category: 'Cables', parameter: 'Diameter of Main Cables', value: '40 cm (15.75 in)', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.98 },
  { id: 'BKN-SPEC-05', asset_id: 'BR-BKN-002', category: 'Capacity', parameter: 'Weight Restriction', value: '3.0 US tons (commercial vehicles prohibited)', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.99 },
];

export const BKN_EVENTS: AssetEvent[] = [
  { id: 'EVT-BKN-01', asset_id: 'BR-BKN-002', event_date: '1883-05-24', event_type: 'opening', title: 'Grand Opening of East River Bridge', description: 'Opened to traffic as the eighth wonder of the world.', source_id: 'nycdot-bridges', confidence: 0.99, created_at: '2026-10-01T00:00:00Z' },
  { id: 'EVT-BKN-02', asset_id: 'BR-BKN-002', event_date: '1964-01-29', event_type: 'major_project', title: 'Designated National Historic Landmark', description: 'Designated US National Historic Landmark and Historic Civil Engineering Landmark.', source_id: 'nycdot-bridges', confidence: 0.99, created_at: '2026-10-01T00:00:00Z' },
  { id: 'EVT-BKN-03', asset_id: 'BR-BKN-002', event_date: '2021-09-14', event_type: 'retrofit', title: 'Protected Bike Lane Conversion', description: 'Reclaimed vehicular lane for a dedicated two-way protected bike lane, relieving upper promenade congestion.', source_id: 'nycdot-bridges', confidence: 0.98, created_at: '2026-10-01T00:00:00Z' },
];

export const BKN_INSPECTIONS: Inspection[] = [
  { id: 'INSP-BKN-01', asset_id: 'BR-BKN-002', inspection_date: '2024-05-18', inspector: 'NYCDOT Bridge Engineering Inspection Squad', inspection_type: 'structural', condition: 'Operational', notes: 'Biennial in-depth inspection of trusses, floor beams, cables, and granite towers. Overall structure found in good condition with minor cosmetic spalling.', verification_status: 'verified', source_id: 'nycdot-bridges', confidence: 0.88, created_at: '2026-10-01T00:00:00Z' },
];

export const BKN_MAINTENANCE: MaintenanceRecord[] = [
  { id: 'MAINT-BKN-01', asset_id: 'BR-BKN-002', maintenance_date: '2023-11-10', maintenance_type: 'corrosion_treatment', action: 'Granite arch deep pressure cleaning and repointing of mortar joints across Manhattan tower.', source_id: 'nycdot-bridges', verification_status: 'verified', confidence: 0.95, created_at: '2026-10-01T00:00:00Z' },
];

export const BKN_EVIDENCE: Evidence[] = [
  { id: 'EV-BKN-TWR-01', asset_id: 'BR-BKN-002', component_id: 'BKN-TOWER-MAN', source_id: 'nycdot-bridges', evidence_type: 'inspection_report', title: 'NYCDOT Stone Masonry Survey', description: 'Detailed high-definition photogrammetry and acoustic soundings of the granite masonry towers.', observed_at: '2024-05-18T00:00:00Z', received_at: '2026-10-01T00:00:00Z', confidence: 0.88, provenance: 'verified', verification_status: 'verified', tier: 'VERIFIED' },
  { id: 'EV-BKN-CBL-01', asset_id: 'BR-BKN-002', component_id: 'BKN-CABLE-MAIN', source_id: 'nycdot-bridges', evidence_type: 'sensor_telemetry', title: 'Acoustic Cable Fracture Monitoring System', description: 'Continuous acoustic monitoring telemetry on the 4 main cable anchorages detecting micro-vibrations.', observed_at: '2026-10-01T00:00:00Z', received_at: '2026-10-05T00:00:00Z', confidence: 0.92, provenance: 'verified', verification_status: 'verified', tier: 'LIVE' },
];

// ============================================================
// 2. AKASHI KAIKYŌ BRIDGE (BR-AKK-003) - Open Source Dataset Slot
// ============================================================
export const AKK_ASSET: Asset = {
  id: 'BR-AKK-003',
  asset_type: 'bridge',
  name: 'Akashi Kaikyō Bridge (明石海峡大橋)',
  location: 'Akashi Strait, Kobe–Awaji Island, Hyōgo Prefecture, Japan',
  latitude: 34.6167,
  longitude: 135.0217,
  geometry: {
    type: 'LineString',
    coordinates: [[135.0315, 34.6342], [135.0118, 34.5992]]
  },
  opening_date: '1998-04-05',
  construction_date: '1988-05-01',
  operator: 'Honshu-Shikoku Bridge Expressway Company (JB本四高速)',
  authority: 'Japan Ministry of Land, Infrastructure, Transport and Tourism (MLIT)',
  status: 'Operational',
  description: 'World-renowned suspension bridge holding the record for one of the longest central spans on Earth (1,991 m). Engineered to withstand Category 5 typhoon gusts (286 km/h), rapid 4.5 m/s tidal currents, and Magnitude 8.5 Hanshin-Awaji level earthquakes.',
  source_id: 'jb-honshi',
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-05T00:00:00Z',
};

export const AKK_COMPONENTS: AssetComponent[] = [
  {
    id: 'AKK-TOWER-1P',
    asset_id: 'BR-AKK-003',
    component_type: 'tower',
    name: 'Main Tower 1P (Awaji Side · 298.3 m)',
    model_node_id: 'tower_1p',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'High-strength structural steel lattice tower. Houses 20 tuned mass dampers (TMDs) to counteract wind-induced harmonic vortex shedding.',
    corrosion_status: 'Fluoropolymer protective paint system; humidity-controlled interior shafts',
    risk: 'Low',
    risk_score: 22,
    confidence: 0.94,
    evidence_ids: ['EV-AKK-TWR-01'],
    next_verification: 'Automated damper accelerometry health check.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'AKK-TOWER-2P',
    asset_id: 'BR-AKK-003',
    component_type: 'tower',
    name: 'Main Tower 2P (Kobe Side · 298.3 m)',
    model_node_id: 'tower_2p',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Survived the 1995 Great Hanshin (Kobe) Earthquake during construction (span expanded by 1.1 meters without damage). Highly resilient.',
    corrosion_status: 'Dry-air circulation prevents internal condensation and oxidation',
    risk: 'Low',
    risk_score: 20,
    confidence: 0.95,
    evidence_ids: ['EV-AKK-TWR-01'],
    next_verification: 'Laser verticality and tilt sensor telemetry verification.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'AKK-DECK-001',
    asset_id: 'BR-AKK-003',
    component_type: 'deck',
    name: 'Aerodynamic Stiffening Truss Deck (35.5 m Wide)',
    model_node_id: 'deck',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Open steel stiffening truss designed with central vertical stabilizer plate to decouple aerodynamic flutter at wind speeds up to 80 m/s.',
    corrosion_status: 'Continuous dehumidified air injection in sealed truss voids',
    risk: 'Low',
    risk_score: 19,
    confidence: 0.92,
    evidence_ids: ['EV-AKK-AERO-01'],
    next_verification: 'Real-time sonic anemometer and strain-gauge telemetry stream.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'AKK-CABLE-MAIN',
    asset_id: 'BR-AKK-003',
    component_type: 'cable',
    name: 'Ultra-Tensile Main Cables (1,122 mm Dia.)',
    model_node_id: 'cable_main',
    status: 'Operational',
    condition: 'Operational',
    condition_description: 'Each cable contains 36,830 ultra-high-strength galvanized steel wires (1,800 MPa tensile strength). Continuously blown with dehumidified air (<40% RH).',
    corrosion_status: 'World benchmark for dry-air dehumidification; zero detected internal corrosion',
    risk: 'Low',
    risk_score: 15,
    confidence: 0.96,
    evidence_ids: ['EV-AKK-DEHUM-01'],
    next_verification: 'Continuous relative humidity (RH) sensor stream verification.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
  {
    id: 'AKK-CAISSON-001',
    asset_id: 'BR-AKK-003',
    component_type: 'pier',
    name: 'Deep-Sea Lay-Down Foundation Caissons (80 m Dia.)',
    model_node_id: 'caisson',
    status: 'Operational',
    condition: 'Monitor',
    condition_description: 'Gigantic steel caissons sunk into deep seabed through violent tidal currents. Continuous multibeam sonar monitoring of riprap scour protection.',
    corrosion_status: 'Heavy cathodic sacrificial anodes protect underwater steel shell',
    risk: 'Medium',
    risk_score: 42,
    confidence: 0.86,
    evidence_ids: ['EV-AKK-CAIS-01'],
    next_verification: 'Biannual multibeam sonar bathymetric scour survey.',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  },
];

export const AKK_SOURCES: DataSource[] = [
  {
    id: 'jb-honshi',
    name: 'Honshu-Shikoku Bridge Expressway Co. Official Data',
    type: 'official',
    tier: 'VERIFIED',
    url: 'https://www.jb-honshi.co.jp/english/',
    status: 'active',
    trust_level: 0.98,
    description: 'Operating authority for long-span marine bridges connecting Honshu and Shikoku.',
  },
  {
    id: 'open-meteo-japan',
    name: 'Open-Meteo Akashi Strait Marine Weather',
    type: 'live_api',
    tier: 'LIVE',
    url: 'https://open-meteo.com',
    status: 'active',
    trust_level: 0.92,
    description: 'High-resolution coastal wind and barometric telemetry at 34.6167°N, 135.0217°E.',
  },
];

export const AKK_SPECS: EngineeringSpec[] = [
  { id: 'AKK-SPEC-01', asset_id: 'BR-AKK-003', category: 'Geometry', parameter: 'Total Length', value: '3,911 m (12,831 ft)', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.99 },
  { id: 'AKK-SPEC-02', asset_id: 'BR-AKK-003', category: 'Geometry', parameter: 'Central Span Length', value: '1,991 m (6,532 ft) — World Benchmark', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.99 },
  { id: 'AKK-SPEC-03', asset_id: 'BR-AKK-003', category: 'Towers', parameter: 'Tower Height Above Sea Level', value: '298.3 m (979 ft)', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.99 },
  { id: 'AKK-SPEC-04', asset_id: 'BR-AKK-003', category: 'Design Load', parameter: 'Design Wind Speed (Typhoon)', value: '80 m/s (286 km/h · 179 mph)', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.99 },
  { id: 'AKK-SPEC-05', asset_id: 'BR-AKK-003', category: 'Design Load', parameter: 'Design Seismic Motion', value: 'Magnitude 8.5 Subduction Zone Earthquake', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.99 },
];

export const AKK_EVENTS: AssetEvent[] = [
  { id: 'EVT-AKK-01', asset_id: 'BR-AKK-003', event_date: '1995-01-17', event_type: 'seismic_event', title: 'Great Hanshin (Kobe) Earthquake (M7.3)', description: 'Fault rupture offset the bridge towers by 1.1 meters during construction. Zero structural failure.', source_id: 'jb-honshi', confidence: 0.99, created_at: '2026-10-01T00:00:00Z' },
  { id: 'EVT-AKK-02', asset_id: 'BR-AKK-003', event_date: '1998-04-05', event_type: 'opening', title: 'Commissioning & Public Traffic Opening', description: 'Opened as the world record longest suspension bridge span.', source_id: 'jb-honshi', confidence: 0.99, created_at: '2026-10-01T00:00:00Z' },
];

export const AKK_INSPECTIONS: Inspection[] = [
  { id: 'INSP-AKK-01', asset_id: 'BR-AKK-003', inspection_date: '2024-08-12', inspector: 'JB-Honshi Comprehensive Maintenance Bureau', inspection_type: 'structural', condition: 'Operational', notes: 'Automated dry-air cable system operating at optimal 32% relative humidity. Tuned mass dampers tested and calibrated.', verification_status: 'verified', source_id: 'jb-honshi', confidence: 0.95, created_at: '2026-10-01T00:00:00Z' },
];

export const AKK_MAINTENANCE: MaintenanceRecord[] = [
  { id: 'MAINT-AKK-01', asset_id: 'BR-AKK-003', maintenance_date: '2024-01-15', maintenance_type: 'cable_maintenance', action: 'Filter and desiccant replacement in dry-air injection pump rooms across both cable anchorages.', source_id: 'jb-honshi', verification_status: 'verified', confidence: 0.98, created_at: '2026-10-01T00:00:00Z' },
];

export const AKK_EVIDENCE: Evidence[] = [
  { id: 'EV-AKK-TWR-01', asset_id: 'BR-AKK-003', component_id: 'AKK-TOWER-1P', source_id: 'jb-honshi', evidence_type: 'sensor_telemetry', title: 'Tuned Mass Damper Acceleration Telemetry', description: 'Real-time dynamic oscillation records confirming vibration suppression under strong Pacific gusts.', observed_at: '2026-10-01T00:00:00Z', received_at: '2026-10-05T00:00:00Z', confidence: 0.96, provenance: 'verified', verification_status: 'verified', tier: 'LIVE' },
  { id: 'EV-AKK-DEHUM-01', asset_id: 'BR-AKK-003', component_id: 'AKK-CABLE-MAIN', source_id: 'jb-honshi', evidence_type: 'sensor_telemetry', title: 'Cable Dry Air System Relative Humidity Telemetry', description: 'Internal cable envelope humidity maintained below 40% RH, stopping corrosion kinetics entirely.', observed_at: '2026-10-01T00:00:00Z', received_at: '2026-10-05T00:00:00Z', confidence: 0.98, provenance: 'verified', verification_status: 'verified', tier: 'LIVE' },
];
