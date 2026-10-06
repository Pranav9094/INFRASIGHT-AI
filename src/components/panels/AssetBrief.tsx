// ============================================================
// INFRA-SIGHT — Asset Brief Panel
// Live environment + engineering + condition overview
// ============================================================

import { useEffect } from 'react';
import { useStore } from '../../stores/useStore';
import type { EngineeringSpec } from '../../types';

function WeatherCard() {
  const { weather, weatherLoading, weatherError, fetchWeather } = useStore();

  useEffect(() => {
    if (!weather && !weatherLoading) {
      fetchWeather();
    }
  }, []);

  return (
    <div className="brief-card" style={{ gridColumn: '1 / -1' }}>
      <div className="brief-card-label">
        <span className="tier-dot td-live" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block' }} />
        LIVE ENVIRONMENT — OPEN-METEO
      </div>

      {weatherLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--blue-600)', fontSize: 12 }}>
          <div className="spinner" />
          Fetching live conditions…
        </div>
      )}

      {weatherError && (
        <div style={{
          background: 'var(--amber-50)', border: '1px solid var(--amber-200)',
          borderRadius: 'var(--radius-md)', padding: '10px 12px',
          fontSize: 11, color: 'var(--amber-700)',
        }}>
          ⚠ {weatherError}
        </div>
      )}

      {weather && !weatherLoading && (
        <>
          <div className="weather-row">
            <div className="weather-cell">
              <div className="weather-cell-val">{weather.temperature}°C</div>
              <div className="weather-cell-label">TEMP</div>
            </div>
            <div className="weather-cell">
              <div className="weather-cell-val">{weather.wind_speed}</div>
              <div className="weather-cell-label">WIND km/h</div>
            </div>
            <div className="weather-cell">
              <div className="weather-cell-val">{weather.wind_gust}</div>
              <div className="weather-cell-label">GUST km/h</div>
            </div>
            <div className="weather-cell">
              <div className="weather-cell-val">{weather.precipitation}</div>
              <div className="weather-cell-label">PRECIP mm</div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
            <strong>{weather.weather_description}</strong>
          </div>

          <div className="brief-card-source">
            <span>observed_at:</span>
            <span className="text-mono" style={{ color: 'var(--text-primary)' }}>
              {new Date(weather.observed_at).toISOString()}
            </span>
          </div>
          <div className="brief-card-source" style={{ marginTop: 2 }}>
            <span>received_at:</span>
            <span className="text-mono" style={{ color: 'var(--text-secondary)' }}>
              {new Date(weather.received_at).toISOString()}
            </span>
          </div>
          <div className="brief-card-source" style={{ marginTop: 2 }}>
            <span>Conf: {Math.round(weather.confidence * 100)}%</span>
            <span>·</span>
            <span>Source: Open-Meteo (coordinate-based API)</span>
          </div>
        </>
      )}

      {!weather && !weatherLoading && !weatherError && (
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          Click "Refresh Live Conditions" to fetch current weather.
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={fetchWeather}
          disabled={weatherLoading}
        >
          {weatherLoading ? '…' : '↻'} Refresh live conditions
        </button>
      </div>

      <div className="notice-card" style={{ marginTop: 8 }}>
        Environmental data provides context only. Live weather observations do not constitute evidence of structural damage. Elevated wind is an environmental stressor; it is not equivalent to a structural finding.
      </div>
    </div>
  );
}

export default function AssetBrief() {
  const { getAsset, getSpecs, getComponents, getInspections, getMaintenance } = useStore();
  const asset = getAsset();
  const specs = getSpecs();
  const components = getComponents();
  const inspections = getInspections();
  const maintenance = getMaintenance();

  const openingDate = new Date(asset.opening_date);
  const ageYears = ((Date.now() - openingDate.getTime()) / 31557600000).toFixed(1);

  const latestInsp = [...inspections].sort((a, b) => b.inspection_date.localeCompare(a.inspection_date))[0];
  const latestMaint = [...maintenance].sort((a, b) => b.maintenance_date.localeCompare(a.maintenance_date))[0];

  const avgConf = components.reduce((sum: number, c: { confidence: number }) => sum + c.confidence, 0) / components.length;
  const riskCounts = components.reduce((acc: Record<string, number>, c: { risk: string }) => {
    acc[c.risk] = (acc[c.risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Overview metrics */}
      <div className="brief-grid">
        <div className="brief-card">
          <div className="brief-card-label">
            <span className="tier-dot td-verified" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block' }} />
            ASSET STATUS
          </div>
          <div className="brief-card-value" style={{ color: 'var(--green-600)' }}>{asset.status}</div>
          <div className="brief-card-sub">{asset.name}</div>
          <div className="brief-card-source">Source: GGB District Official — VERIFIED</div>
        </div>

        <div className="brief-card">
          <div className="brief-card-label">AGE IN SERVICE</div>
          <div className="brief-card-value">{ageYears}</div>
          <div className="brief-card-sub">years · Opened {openingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="brief-card-source">Dynamically calculated from {asset.opening_date}</div>
        </div>

        <div className="brief-card">
          <div className="brief-card-label">
            <span className="tier-dot td-unavailable" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block' }} />
            CURRENT STRUCTURAL DAMAGE
          </div>
          <div className="brief-card-value" style={{ fontSize: 14, color: 'var(--grey-500)' }}>Not asserted</div>
          <div className="brief-card-sub">No current quantified structural damage in the public source set.</div>
          <div className="brief-card-source">⚪ UNAVAILABLE — Not equivalent to "no damage"</div>
        </div>

        <div className="brief-card">
          <div className="brief-card-label">DATA CONFIDENCE</div>
          <div className="brief-card-value">{Math.round(avgConf * 100)}%</div>
          <div className="brief-card-sub">
            Average across {components.length} components.
            Missing evidence reduces confidence.
          </div>
          <div className="brief-card-source">Evidence-based calculation</div>
        </div>
      </div>

      {/* Risk overview */}
      <div className="brief-card" style={{ marginBottom: 12 }}>
        <div className="brief-card-label">COMPONENT RISK OVERVIEW</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          {Object.entries(riskCounts).map(([risk, count]) => (
            <div key={risk} style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: risk === 'Low' ? 'var(--green-600)' : risk === 'Medium' ? 'var(--amber-600)' : risk === 'High' ? 'var(--red-600)' : 'var(--grey-500)' }}>
                {String(count)}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>
                {risk.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 8, fontStyle: 'italic' }}>
          Risk is not equivalent to confirmed failure. Confidence is separate from risk level.
        </div>
      </div>

      {/* Live weather */}
      <div className="brief-grid" style={{ gridTemplateColumns: '1fr' }}>
        <WeatherCard />
      </div>

      {/* Latest inspection & maintenance */}
      <div className="brief-grid" style={{ marginTop: 12 }}>
        <div className="brief-card">
          <div className="brief-card-label">
            <span className="tier-dot td-verified" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block' }} />
            LATEST INSPECTION
          </div>
          {latestInsp ? (
            <>
              <div className="brief-card-value" style={{ fontSize: 14 }}>{latestInsp.inspection_date}</div>
              <div className="brief-card-sub">{latestInsp.inspection_type.replace('_', ' ')} · {latestInsp.inspector}</div>
              <div className="brief-card-source">Status: {latestInsp.verification_status} · Conf: {Math.round(latestInsp.confidence * 100)}%</div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No inspection record connected.</div>
          )}
        </div>

        <div className="brief-card">
          <div className="brief-card-label">
            <span className="tier-dot td-verified" style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block' }} />
            LATEST MAINTENANCE
          </div>
          {latestMaint ? (
            <>
              <div className="brief-card-value" style={{ fontSize: 14 }}>{latestMaint.maintenance_date.slice(0, 10)}</div>
              <div className="brief-card-sub">{latestMaint.maintenance_type.replace(/_/g, ' ')}</div>
              <div className="brief-card-source">{(latestMaint.status ?? 'unavailable').replace('_', ' ')} · {latestMaint.authority?.slice(0, 40)}</div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No maintenance record connected.</div>
          )}
        </div>
      </div>

      {/* Engineering summary */}
      <div className="data-table" style={{ marginTop: 12 }}>
        <div className="data-table-header">
          Engineering Specifications
          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-tertiary)' }}>
            Source: GGB District Official — VERIFIED
          </span>
        </div>
        {specs.slice(0, 7).map((spec: EngineeringSpec) => (
          <div key={spec.id} className={`data-row data-row-3col`}>
            <span className="data-row-label">{spec.label}</span>
            <span className="data-row-value">{spec.value} {spec.unit}</span>
            <span className="data-row-source">{spec.category}</span>
          </div>
        ))}
      </div>

      {/* Capacity notice */}
      <div className="capacity-note" style={{ marginTop: 10 }}>
        <strong>⚠ Capacity Notice:</strong> The published live-load statistic (4,000 lb/ft) is a historical design figure from official GGB engineering statistics. It is NOT a current authorized safe occupancy limit and must NOT be converted into a crowd capacity. Current safe structural capacity requires a current authorized engineering assessment and is marked UNAVAILABLE.
      </div>
    </div>
  );
}
