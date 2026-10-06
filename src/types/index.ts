// ============================================================
// INFRA-SIGHT — Core Type Definitions
// Asset-agnostic data model
// ============================================================

export type AssetType = 'bridge' | 'road' | 'tunnel' | 'culvert' | 'drainage' | 'railway' | 'building' | 'electrical' | 'water' | 'other';
export type AssetStatus = 'Operational' | 'Restricted' | 'Closed' | 'Under Maintenance' | 'Monitoring' | 'Unknown';
export type ComponentType = 'deck' | 'tower' | 'cable' | 'pier' | 'joint' | 'hanger' | 'bearing' | 'abutment' | 'railing' | 'road' | 'other';
export type ConditionState = 'Good' | 'Operational' | 'Monitor' | 'Attention Required' | 'Critical' | 'Unknown' | 'Not Assessed';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';
export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'demo_synthetic' | 'unavailable';
export type SourceType = 'official' | 'live_api' | 'field' | 'geospatial' | 'derived' | 'demo_synthetic' | 'access_dependent';
export type SourceTier = 'LIVE' | 'VERIFIED' | 'FIELD' | 'DERIVED' | 'DEMO' | 'UNAVAILABLE' | 'ACCESS_DEPENDENT';
export type InspectionType = 'routine' | 'detailed' | 'structural' | 'field' | 'emergency' | 'post_event';
export type MaintenanceType = 'painting' | 'corrosion_treatment' | 'cable_maintenance' | 'joint_maintenance' | 'resurfacing' | 'structural_strengthening' | 'replacement' | 'seismic_retrofit' | 'general' | 'other';
export type EventType = 'construction' | 'opening' | 'inspection_finding' | 'storm' | 'seismic_event' | 'structural_observation' | 'maintenance_intervention' | 'retrofit' | 'closure' | 'major_project' | 'other';
export type DataLineageStep = 'source' | 'connector' | 'raw_response' | 'validation' | 'normalization' | 'geo_match' | 'time_match' | 'observation' | 'asset' | 'component' | 'evidence' | 'risk_engine' | 'ai_investigator' | 'inspection';

// ============================================================
// ASSET
// ============================================================

export interface Asset {
  id: string;
  asset_type: AssetType;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  geometry?: GeoGeometry;
  construction_date?: string;
  opening_date: string;
  operator?: string;
  authority?: string;
  status: AssetStatus;
  description?: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

export interface GeoGeometry {
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: number[] | number[][] | number[][][];
}

// ============================================================
// COMPONENTS
// ============================================================

export interface AssetComponent {
  id: string;
  asset_id: string;
  component_type: ComponentType;
  name: string;
  geometry?: GeoGeometry;
  model_node_id: string;
  status: AssetStatus;
  condition: ConditionState;
  condition_description: string;
  corrosion_status: string;
  risk: RiskLevel;
  risk_score: number;
  confidence: number;
  evidence_ids: string[];
  next_verification: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SOURCES
// ============================================================

export interface DataSource {
  id: string;
  name: string;
  type: SourceType;
  tier: SourceTier;
  url: string;
  status: 'active' | 'unavailable' | 'access_dependent' | 'demo';
  license?: string;
  trust_level: number; // 0-1
  last_checked?: string;
  description: string;
  coverage?: string;
}

// ============================================================
// OBSERVATIONS (Canonical Format)
// ============================================================

export interface Observation {
  id: string;
  asset_id: string;
  component_id?: string;
  source_id: string;
  observed_at: string;
  received_at: string;
  observation_type: string;
  value: number | string;
  unit?: string;
  geometry?: GeoGeometry;
  confidence: number;
  provenance: string;
  verification_status: VerificationStatus;
  metadata?: Record<string, unknown>;
}

// ============================================================
// EVIDENCE
// ============================================================

export interface Evidence {
  id: string;
  asset_id: string;
  component_id?: string;
  source_id: string;
  observation_id?: string;
  event_id?: string;
  inspection_id?: string;
  evidence_type: string;
  title: string;
  description: string;
  value?: string | number;
  unit?: string;
  observed_at: string;
  received_at: string;
  confidence: number;
  provenance: VerificationStatus;
  verification_status: VerificationStatus;
  geometry?: GeoGeometry;
  tier: SourceTier;
}

// ============================================================
// EVENTS / LIFECYCLE
// ============================================================

export interface AssetEvent {
  id: string;
  asset_id: string;
  component_id?: string;
  event_date: string;
  event_type: EventType;
  title: string;
  description: string;
  impact?: string;
  action?: string;
  source_id: string;
  confidence: number;
  created_at: string;
}

// ============================================================
// INSPECTIONS
// ============================================================

export interface Inspection {
  id: string;
  asset_id: string;
  component_id?: string;
  inspection_date: string;
  inspector?: string;
  inspection_type: InspectionType;
  condition?: ConditionState;
  notes?: string;
  photos?: string[];
  latitude?: number;
  longitude?: number;
  verification_status: VerificationStatus;
  source_id: string;
  confidence: number;
  created_at: string;
  sync_status?: 'synced' | 'pending' | 'error';
  is_demo?: boolean;
}

// ============================================================
// MAINTENANCE
// ============================================================

export interface MaintenanceRecord {
  id: string;
  asset_id: string;
  component_id?: string;
  maintenance_date: string;
  maintenance_type: MaintenanceType;
  issue?: string;
  action: string;
  status?: 'completed' | 'in_progress' | 'planned' | 'cancelled';
  authority?: string;
  source_id: string;
  evidence?: string[];
  created_at: string;
  completion_date?: string;
  verification_status?: VerificationStatus;
  confidence?: number;
}

// ============================================================
// ENGINEERING SPECS
// ============================================================

export interface EngineeringSpec {
  id: string;
  asset_id: string;
  component_id?: string;
  spec_type?: string;
  label?: string;
  parameter?: string;
  value: string;
  unit?: string;
  description?: string;
  source_id: string;
  effective_date?: string;
  confidence?: number;
  category: 'design' | 'operational' | 'restriction' | 'current_capacity' | 'Geometry' | 'Towers' | 'Cables' | 'Capacity' | 'Design Load';
  capacity_type?: 'published_design' | 'operational_restriction' | 'current_safe' | 'occupancy';
  verification_status?: VerificationStatus;
}

// ============================================================
// RISK ASSESSMENT
// ============================================================

export interface RiskAssessment {
  id: string;
  asset_id: string;
  component_id?: string;
  risk_level: RiskLevel;
  risk_score: number;
  confidence: number;
  reasoning: string;
  positive_factors: RiskFactor[];
  negative_factors: RiskFactor[];
  missing_evidence: string[];
  evidence_ids: string[];
  created_at: string;
  model_version: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  direction: '+' | '-';
  evidence_id?: string;
}

// ============================================================
// WEATHER / LIVE ENVIRONMENT
// ============================================================

export interface WeatherObservation {
  temperature: number;
  wind_speed: number;
  wind_gust: number;
  precipitation: number;
  weather_code: number;
  weather_description: string;
  observed_at: string;
  received_at: string;
  latitude: number;
  longitude: number;
  source: string;
  confidence: number;
}

// ============================================================
// DATA LINEAGE
// ============================================================

export interface LineageNode {
  id: string;
  step: DataLineageStep;
  label: string;
  description: string;
  status: 'active' | 'pending' | 'error' | 'bypassed';
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface LineageTrace {
  observation_id: string;
  nodes: LineageNode[];
}

// ============================================================
// AI INVESTIGATOR
// ============================================================

export interface AIInvestigation {
  component_id: string;
  component_name: string;
  risk_level: RiskLevel;
  confidence: number;
  summary: string;
  supporting_evidence: AIEvidenceItem[];
  missing_evidence: string[];
  conflicting_evidence: string[];
  recommended_action: string;
  disclaimer: string;
  generated_at: string;
  evidence_ids: string[];
}

export interface AIEvidenceItem {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  confidence: number;
  tier: SourceTier;
}

// ============================================================
// FIELD INSPECTION (Offline-first)
// ============================================================

export interface FieldInspectionDraft {
  id: string;
  asset_id: string;
  component_id: string;
  component_name: string;
  condition: ConditionState;
  observation: string;
  notes?: string;
  photo_data?: string; // base64 for offline
  latitude?: number;
  longitude?: number;
  timestamp: string;
  inspector_name?: string;
  sync_status: 'pending' | 'synced' | 'error';
  provenance: 'DEMO_SYNTHETIC' | 'FIELD';
  verification_status: 'pending' | 'verified';
}

// ============================================================
// APP STATE
// ============================================================

export interface AppState {
  selectedAssetId: string | null;
  selectedComponentId: string | null;
  activeTab: string;
  activePanel: string;
  isOffline: boolean;
  weatherData: WeatherObservation | null;
  weatherLoading: boolean;
  weatherError: string | null;
  weatherLastFetched: string | null;
  fieldInspections: FieldInspectionDraft[];
  pendingSyncCount: number;
}

// ============================================================
// CONNECTOR
// ============================================================

export interface Connector {
  id: string;
  source_name: string;
  endpoint: string;
  auth_status: 'none' | 'api_key' | 'oauth' | 'access_dependent';
  health_status: 'healthy' | 'degraded' | 'unavailable' | 'unchecked';
  last_checked?: string;
  error?: string;
}
