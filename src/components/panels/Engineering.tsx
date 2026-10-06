// ============================================================
// INFRA-SIGHT — Engineering Panel
// Source-backed specifications with capacity distinction
// ============================================================

import { useStore } from '../../stores/useStore';

export default function Engineering() {
  const { getSpecs, getAsset } = useStore();
  const specs = getSpecs();
  const asset = getAsset();

  const designSpecs = specs.filter(s => s.category === 'design');
  const operationalSpecs = specs.filter(s => s.category === 'operational' || s.category === 'restriction' || s.category === 'current_capacity');

  return (
    <div>
      <div className="section-heading">
        Engineering Specifications — {asset.name}
        <span className="section-heading-sub">Asset ID: {asset.id} · Official Engineering Baseline</span>
      </div>

      {/* Critical capacity distinction notice */}
      <div className="capacity-note" style={{ marginBottom: 16 }}>
        <strong>⚠ Engineering Capacity Notice:</strong> This platform distinguishes between:
        <br />
        A. <strong>Published design specification</strong> — historical engineering design figures
        <br />
        B. <strong>Operational restriction</strong> — currently enforced operational limits
        <br />
        C. <strong>Current safe capacity</strong> — requires current authorized engineering assessment
        <br />
        D. <strong>Occupancy/crowd capacity</strong> — a separate metric, not derivable from structural load statistics
        <br /><br />
        Do NOT convert structural load capacity into "number of people." Current safe structural capacity is marked UNAVAILABLE in the absence of a current authorized engineering assessment.
      </div>

      {/* Design specifications */}
      <div className="data-table" style={{ marginBottom: 14 }}>
        <div className="data-table-header">
          Published Engineering Specifications
        </div>
        {designSpecs.length === 0 ? (
          <div style={{ padding: 12, fontSize: 11, color: 'var(--text-tertiary)' }}>
            Baseline engineering specs linked to asset metadata.
          </div>
        ) : (
          designSpecs.map(spec => (
            <div key={spec.id} className="data-row data-row-3col">
              <div>
                <div className="data-row-label">{spec.label || spec.parameter || 'Specification'}</div>
                {spec.description && (
                  <div className="data-row-source" style={{ marginTop: 2 }}>{spec.description.slice(0, 80)}</div>
                )}
              </div>
              <span className="data-row-value">{spec.value} {spec.unit || ''}</span>
              <span className="data-row-source">Conf: {Math.round((spec.confidence ?? 0) * 100)}%</span>
            </div>
          ))
        )}
      </div>

      {/* Operational information */}
      {operationalSpecs.length > 0 && (
        <div className="data-table" style={{ marginBottom: 14 }}>
          <div className="data-table-header">Operational Limits & Design Loadings</div>
          {operationalSpecs.map(spec => (
            <div key={spec.id} className="data-row data-row-3col">
              <div>
                <div className="data-row-label">{spec.label || spec.parameter || 'Specification'}</div>
                {spec.description && (
                  <div className="data-row-source" style={{ marginTop: 2 }}>{spec.description.slice(0, 80)}</div>
                )}
              </div>
              <span className="data-row-value">{spec.value} {spec.unit || ''}</span>
              <span className="data-row-source">Conf: {Math.round((spec.confidence ?? 0) * 100)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Physical characteristics */}
      <div className="data-table" style={{ marginTop: 14, marginBottom: 14 }}>
        <div className="data-table-header">Bridge Physical Characteristics</div>
        {[
          { label: 'Asset ID', value: asset.id },
          { label: 'Asset Name', value: asset.name },
          { label: 'Type', value: `${asset.asset_type.toUpperCase()} BRIDGE` },
          { label: 'Opening Date', value: asset.opening_date },
          { label: 'Operating Authority', value: asset.operator || asset.authority || 'State DOT' },
          { label: 'Location', value: asset.location },
          { label: 'Coordinates', value: `${asset.latitude.toFixed(4)}°N, ${asset.longitude.toFixed(4)}°W` },
        ].map(row => (
          <div key={row.label} className="data-row data-row-2col">
            <span className="data-row-label">{row.label}</span>
            <span className="data-row-value" style={{ fontFamily: row.label === 'Coordinates' || row.label === 'Asset ID' ? 'var(--font-mono)' : 'var(--font-sans)' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="notice-card">
        All engineering specifications sourced from official public records. Specifications represent published design and construction data, not current structural assessment results. For current structural condition, refer to authorized inspection records.
      </div>
    </div>
  );
}
