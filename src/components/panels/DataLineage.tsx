// ============================================================
// INFRA-SIGHT — Data Lineage Panel
// Visual traceability from source to action
// ============================================================

import { useState } from 'react';

const LINEAGE_STEPS = [
  {
    id: 'source',
    icon: '🌐',
    label: 'Open-Meteo API',
    description: 'External weather API endpoint queried with GGB coordinates (37.8199, -122.4783)',
    status: 'active',
    cls: 'lc-source',
    detail: 'GET https://api.open-meteo.com/v1/forecast?latitude=37.8199&longitude=-122.4783&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m,weather_code&timezone=auto',
  },
  {
    id: 'connector',
    icon: '🔌',
    label: 'Weather Connector',
    description: 'TypeScript connector class — fetches, handles errors, records received_at timestamp',
    status: 'active',
    cls: 'lc-connector',
    detail: 'Connector sets received_at = new Date().toISOString() at time of fetch. observed_at is preserved from API response (current.time). These are stored separately and never overwritten.',
  },
  {
    id: 'raw_response',
    icon: '📄',
    label: 'Raw API Response',
    description: 'JSON payload from Open-Meteo before any transformation',
    status: 'active',
    cls: 'lc-default',
    detail: '{ "current": { "time": "...", "temperature_2m": ..., "wind_speed_10m": ..., "wind_gusts_10m": ..., "precipitation": ..., "weather_code": ... } }',
  },
  {
    id: 'validation',
    icon: '✅',
    label: 'Schema Validation',
    description: 'Validate required fields: temperature_2m, wind_speed_10m, time. Reject on schema failure.',
    status: 'active',
    cls: 'lc-validation',
    detail: 'If HTTP status ≠ 200 or required fields missing: weatherError is set, no observation is created, UI shows "Weather unavailable" with last successful observation timestamp.',
  },
  {
    id: 'normalization',
    icon: '🔄',
    label: 'Normalize to Canonical Observation',
    description: 'Convert raw API fields to canonical WeatherObservation format with full provenance',
    status: 'active',
    cls: 'lc-normalization',
    detail: 'WeatherObservation { temperature, wind_speed, wind_gust, precipitation, weather_code, weather_description, observed_at, received_at, latitude, longitude, source, confidence }',
  },
  {
    id: 'geo_match',
    icon: '📍',
    label: 'Geo + Time Match',
    description: 'Confirm coordinates match asset location. Confirm time is within acceptable window.',
    status: 'active',
    cls: 'lc-default',
    detail: 'Asset coordinates: 37.8199°N, 122.4783°W. API coordinates used in request must match. Time delta between observed_at and received_at is logged for audit.',
  },
  {
    id: 'observation',
    icon: '🗃',
    label: 'Observation Record',
    description: 'Stored as normalized observation with full lineage: source, observed_at, received_at, confidence=0.90',
    status: 'active',
    cls: 'lc-observation',
    detail: 'OBS-WEATHER-001 { asset_id: "BR-GGB-001", source_id: "open-meteo", observed_at: [from API], received_at: [fetch time], confidence: 0.90, provenance: "external_api", verification_status: "verified" }',
  },
  {
    id: 'asset',
    icon: '🌉',
    label: 'Asset Context',
    description: 'Linked to BR-GGB-001 as environmental context evidence. Not used as structural condition.',
    status: 'active',
    cls: 'lc-default',
    detail: 'Environmental data is CONTEXT only. High wind speed ≠ structural damage. It contributes to the environmental exposure factor in the risk engine, weighted appropriately.',
  },
  {
    id: 'risk_engine',
    icon: '⚖️',
    label: 'Risk Engine',
    description: 'Wind speed contributes to environmental exposure factor. Rule-based, explainable, not ML.',
    status: 'active',
    cls: 'lc-risk',
    detail: 'Risk factors: environmental_exposure (weight: 0.15) + inspection_age (weight: 0.25) + maintenance_history (weight: 0.20) + component_condition (weight: 0.30) + missing_evidence_penalty (weight: -0.25). Every factor explainable.',
  },
  {
    id: 'ai_investigator',
    icon: '✦',
    label: 'AI Investigator',
    description: 'Evidence-first reasoning. References evidence IDs. Identifies missing evidence.',
    status: 'active',
    cls: 'lc-ai',
    detail: 'AI Investigator retrieves evidence records → ranks by relevance → generates explanation → identifies missing evidence → recommends verification. Never invents evidence. Never approves repairs. Includes disclaimer.',
  },
  {
    id: 'inspection',
    icon: '🔍',
    label: 'Inspection Recommendation → Feedback',
    description: 'Field verification creates new evidence records that feed back into the evidence store.',
    status: 'active',
    cls: 'lc-inspection',
    detail: 'Field inspection → provenance=FIELD → verification_status=pending → authorized review → verified → confidence improves → next risk calculation uses updated evidence.',
  },
];

export default function DataLineage() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  return (
    <div>
      <div className="section-heading">
        Data Lineage
        <span className="section-heading-sub">Full traceability from source to action</span>
      </div>

      <div className="notice-card" style={{ marginBottom: 16 }}>
        Every displayed value is traceable through this lineage. No raw external API response directly controls the risk engine or UI. Every source becomes a normalized observation/evidence record before use.
      </div>

      {/* Example: Weather → Risk lineage */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16, boxShadow: 'var(--shadow-xs)',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-tertiary)',
          textTransform: 'uppercase', marginBottom: 14,
        }}>
          LINEAGE TRACE: LIVE WEATHER → RISK ENGINE
        </div>

        <div className="lineage-chain">
          {LINEAGE_STEPS.map((step, idx) => {
            const isSelected = selectedStep === step.id;
            return (
              <div key={step.id} className="lineage-node">
                <div className="lineage-node-line">
                  <button
                    className={`lineage-circle ${step.cls}`}
                    onClick={() => setSelectedStep(isSelected ? null : step.id)}
                    title={`Click to expand: ${step.label}`}
                    style={{ border: isSelected ? '2px solid var(--blue-500)' : undefined, cursor: 'pointer' }}
                  >
                    {step.icon}
                  </button>
                  {idx < LINEAGE_STEPS.length - 1 && (
                    <div className="lineage-connector-line" />
                  )}
                </div>
                <div className="lineage-content">
                  <div className="lineage-label">{step.label}</div>
                  <div className="lineage-desc">{step.description}</div>
                  {isSelected && (
                    <div style={{
                      marginTop: 8, padding: '10px 12px',
                      background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)', fontSize: 10,
                      fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                      lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Principles */}
      <div style={{
        background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: 16, color: 'white',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>
          DATA LINEAGE PRINCIPLES
        </div>
        {[
          'Every observation carries source, observed_at, received_at, confidence, and provenance.',
          'observed_at (from source) and received_at (fetch time) are stored separately and never overwritten.',
          'No raw external API response directly controls the risk engine.',
          'Every external source becomes a normalized evidence record before use.',
          'Missing evidence is explicitly shown as UNAVAILABLE — not converted to "Good".',
          'Confidence decreases when evidence is absent or unverified.',
          'Field inspections preserve original timestamp, GPS, inspector, and observation.',
          'All DEMO/SYNTHETIC data is clearly labelled and never presented as real authorized records.',
        ].map((principle, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ color: 'var(--green-400)', flexShrink: 0 }}>✓</span>
            <span>{principle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
