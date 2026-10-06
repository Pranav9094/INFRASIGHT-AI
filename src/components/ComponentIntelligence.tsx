// ============================================================
// INFRA-SIGHT — Compact component intelligence
// One glance: condition, damage, age, live environment, history.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../stores/useStore';
import type { AssetComponent } from '../types';

const RISK_CLASS: Record<string, string> = {
  Low: 'risk-low', Medium: 'risk-medium', High: 'risk-high', Critical: 'risk-critical', Unknown: 'risk-unknown',
};

function daysBetween(a: string, b = new Date().toISOString().slice(0, 10)) {
  return Math.max(0, Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function ageLabel(openingDate: string) {
  const days = daysBetween(openingDate);
  const years = Math.floor(days / 365.2425);
  const rem = Math.max(0, days - Math.floor(years * 365.2425));
  return { years, days, rem };
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="live-clock" title="Live local time at bridge coordinates">
      {new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(now)}
      <small> PT</small>
    </span>
  );
}

function Stat({ label, value, detail, tone = '' }: { label: string; value: string; detail?: string; tone?: string }) {
  return (
    <div className={`compact-stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function ComponentDetail({ comp }: { comp: AssetComponent }) {
  const {
    getAsset, getComponentEvidence, getComponentInspections, getComponentMaintenance,
    getEvents, getSources, weather, weatherLoading, fetchWeather,
    aiLoading, aiResult, aiError, runAIInvestigation, setSelectedComponent,
  } = useStore();

  const asset = getAsset();
  const evidence = getComponentEvidence(comp.id);
  const inspections = getComponentInspections(comp.id);
  const maintenance = getComponentMaintenance(comp.id);
  const events = getEvents();
  const sources = getSources();
  const age = ageLabel(asset.opening_date);
  const latestInspection = inspections[0];
  const latestMaintenance = maintenance[0];
  const componentEvents = useMemo(() => events.filter(e => e.component_id === comp.id || !e.component_id).sort((a, b) => b.event_date.localeCompare(a.event_date)), [events, comp.id]);
  const damageText = /no .*damage|not quantified|no current component-level/i.test(comp.condition_description)
    ? 'No quantified damage published'
    : comp.condition_description.split('.')[0];

  const sourceName = (id: string) => sources.find(s => s.id === id)?.name ?? id;
  const daysSinceInspection = latestInspection ? daysBetween(latestInspection.inspection_date) : null;

  return (
    <div className="compact-intel">
      <div className="component-identity">
        <div>
          <span className="section-kicker">INSPECTING COMPONENT</span>
          <h2>{comp.name}</h2>
          <span className="component-id">{comp.component_type} · {comp.id}</span>
        </div>
        <button type="button" className="btn-clear-selection" onClick={() => setSelectedComponent(null)}>Overview</button>
      </div>

      <div className="compact-status-line">
        <span className={`condition-pill ${comp.condition.toLowerCase().replaceAll(' ', '-')}`}>● {comp.condition}</span>
        <span className={`risk-badge ${RISK_CLASS[comp.risk]}`}>{comp.risk} risk · {comp.risk_score}/100</span>
      </div>

      <div className="compact-stats-grid">
        <Stat label="AGE IN SERVICE" value={`${age.years} yr`} detail={`${age.days.toLocaleString()} days`} />
        <Stat label="DAMAGE" value={damageText} detail="public verified data" />
        <Stat label="LAST INSPECTION" value={latestInspection?.inspection_date ?? 'Unavailable'} detail={daysSinceInspection !== null ? `${daysSinceInspection} days ago` : 'No record'} />
        <Stat label="EXPECTED SERVICE LIFE" value="Not established" detail="no public end date" />
      </div>

      <div className="live-environment-card">
        <div className="live-env-heading">
          <div><span className="live-dot" /> LIVE ENVIRONMENT</div>
          <LiveClock />
        </div>
        <div className="live-env-grid">
          <div><span>Weather</span><strong>{weather?.weather_description ?? (weatherLoading ? 'Updating…' : 'Unavailable')}</strong></div>
          <div><span>Temperature</span><strong>{weather ? `${weather.temperature}°C` : '—'}</strong></div>
          <div><span>Wind</span><strong>{weather ? `${weather.wind_speed} km/h` : '—'}</strong></div>
          <div><span>Gust</span><strong>{weather ? `${weather.wind_gust} km/h` : '—'}</strong></div>
        </div>
        <button type="button" className="live-refresh" onClick={fetchWeather}>{weatherLoading ? 'Updating live data…' : 'Refresh live weather'}</button>
      </div>

      <div className="compact-section">
        <div className="compact-section-head"><span>HOW IT IS RUNNING</span><b>Operational</b></div>
        <p>{comp.condition_description}</p>
      </div>

      <div className="compact-section two-col-section">
        <div>
          <span className="mini-label">MAINTENANCE</span>
          <strong>{latestMaintenance?.status === 'in_progress' ? 'Active programme' : latestMaintenance?.status ?? 'No active record'}</strong>
          <small>{latestMaintenance?.action ?? 'No current maintenance record connected.'}</small>
        </div>
        <div>
          <span className="mini-label">CORROSION / MATERIAL</span>
          <strong>{comp.corrosion_status.startsWith('Not quantified') ? 'Not quantified' : 'Monitored'}</strong>
          <small>{comp.corrosion_status}</small>
        </div>
      </div>

      <div className="compact-history">
        <div className="compact-section-head"><span>RECENT HISTORY</span><span>{componentEvents.length} records</span></div>
        {componentEvents.slice(0, 3).map(event => (
          <div className="compact-history-row" key={event.id}>
            <time>{event.event_date.slice(0, 10)}</time>
            <div><strong>{event.title}</strong><span>{event.action || event.impact || event.description}</span></div>
          </div>
        ))}
        {latestInspection && (
          <div className="compact-history-row">
            <time>{latestInspection.inspection_date}</time>
            <div><strong>Inspection</strong><span>{latestInspection.notes?.slice(0, 120)}…</span></div>
          </div>
        )}
      </div>

      <div className="compact-confidence">
        <div><span>Evidence confidence</span><strong>{Math.round(comp.confidence * 100)}%</strong></div>
        <div className="confidence-track"><span style={{ width: `${Math.round(comp.confidence * 100)}%` }} /></div>
        <small>Verified sources only. Missing measurements are shown as unavailable.</small>
      </div>

      {aiResult && (
        <section className="prototype-summary-card" aria-live="polite">
          <div className="prototype-summary-head">
            <div>
              <span className="mini-label">PROTOTYPE INTELLIGENCE</span>
              <h3>Overall Investigation Summary</h3>
            </div>
            <span className="prototype-summary-badge">Evidence-first</span>
          </div>
          <pre>{aiResult}</pre>
        </section>
      )}
      {aiError && <div className="compact-error">{aiError}</div>}
      <button type="button" className="btn btn-primary compact-ai-button" onClick={() => runAIInvestigation(comp.id)} disabled={aiLoading}>
        {aiLoading ? 'Building prototype summary…' : '✦ Run AI investigation'}
      </button>

      {evidence.length > 0 && (
        <div className="compact-source-note">
          <span>{evidence.length} verified evidence records</span>
          <span>{sourceName(evidence[0].source_id)}</span>
        </div>
      )}
    </div>
  );
}

function BridgeHealthSummary() {
  const { getAsset, getComponents, setSelectedComponent, aiLoading, aiResult, runAIInvestigation } = useStore();
  const asset = getAsset();
  const components = getComponents();
  const monitored = components.filter(c => c.condition === 'Monitor' || c.risk === 'Medium');
  const stable = components.length - monitored.length;
  const age = ageLabel(asset.opening_date);

  return (
    <div className="compact-overview">
      <div className="overview-hero-row">
        <div><span className="section-kicker">BRIDGE HEALTH</span><h2>{asset.name}</h2><p>{asset.status} · {age.years} years in service</p></div>
        <span className="badge badge-operational">● OPERATIONAL</span>
      </div>
      <div className="compact-stats-grid overview-stats">
        <Stat label="AGE" value={`${age.years} yr`} detail={`${age.days.toLocaleString()} days`} />
        <Stat label="COMPONENTS" value={`${components.length}`} detail={`${stable} stable · ${monitored.length} monitored`} />
        <Stat label="EXPECTED SERVICE LIFE" value="Not established" detail="requires engineering assessment" />
        <Stat label="CURRENT WEATHER" value="Live" detail="see environment above" />
      </div>
      <section className="overview-ai-callout">
        <div>
          <span className="section-kicker">KEY PROTOTYPE CAPABILITY</span>
          <h3>Run AI Investigation</h3>
          <p>Generate one evidence-grounded executive summary across the asset, components, inspections, maintenance, live environment, risks and data gaps.</p>
        </div>
        <button type="button" className="btn btn-primary overview-ai-button" onClick={() => runAIInvestigation(null)} disabled={aiLoading}>
          {aiLoading ? 'Building summary…' : 'Run AI investigation'}
        </button>
      </section>

      {aiResult && (
        <section className="prototype-summary-card overview-summary-card">
          <div className="prototype-summary-head">
            <div>
              <span className="mini-label">PROTOTYPE INTELLIGENCE</span>
              <h3>Overall Investigation Summary</h3>
            </div>
            <span className="prototype-summary-badge">Evidence-first</span>
          </div>
          <pre>{aiResult}</pre>
        </section>
      )}

      <div className="overview-component-list">
        <div className="compact-section-head"><span>COMPONENT STATUS</span><span>Select one to inspect</span></div>
        {components.map(c => (
          <button type="button" className="overview-component-row" key={c.id} onClick={() => setSelectedComponent(c.id)}>
            <span className={`chip-dot ${c.risk === 'Low' ? 'chip-low' : c.risk === 'Medium' ? 'chip-medium' : 'chip-high'}`} />
            <strong>{c.name}</strong>
            <span>{c.condition}</span>
            <b>{c.risk}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ComponentIntelligence() {
  const selectedComp = useStore(s => s.getSelectedComponent());
  return selectedComp ? <ComponentDetail comp={selectedComp} /> : <BridgeHealthSummary />;
}
