// ============================================================
// INFRA-SIGHT — Main Application
// Flow: Infrastructure Dashboard → Asset → Twin → Component → Evidence
// ============================================================

import { useEffect } from 'react';
import { useStore } from './stores/useStore';
import InfrastructureDashboard from './components/InfrastructureDashboard';
import DigitalTwin from './components/DigitalTwin';
import ComponentIntelligence from './components/ComponentIntelligence';
import AssetBrief from './components/panels/AssetBrief';
import Lifecycle from './components/panels/Lifecycle';
import EvidenceGraph from './components/panels/EvidenceGraph';
import Engineering from './components/panels/Engineering';
import FieldInspection from './components/panels/FieldInspection';
import DataLineage from './components/panels/DataLineage';

export default function App() {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedComponentId,
    setSelectedComponent,
    weather,
    weatherLoading,
    fetchWeather,
    fieldInspections,
    syncInspections,
    pendingSyncCount,
  } = useStore();

  const asset = useStore((s) => s.getAsset());
  const components = useStore((s) => s.getComponents());

  const selectedComp = components.find(
    (c) => c.id === selectedComponentId
  );

  const pendingCount = pendingSyncCount();

  // ============================================================
  // GLOBAL SCROLL FIX
  // ============================================================

  useEffect(() => {
    document.body.style.overflow = 'auto';

    const root = document.getElementById('root');

    if (root) {
      root.style.height = 'auto';
      root.style.minHeight = '100vh';
      root.style.overflow = 'visible';
    }
  }, []);

  // ============================================================
  // WEATHER
  // ============================================================

  useEffect(() => {
    if (!weather && !weatherLoading) {
      fetchWeather();
    }
  }, [weather, weatherLoading, fetchWeather]);

  // ============================================================
  // INFRASTRUCTURE COMMAND CENTER
  // ============================================================

  if (viewMode === 'portal') {
    return <InfrastructureDashboard />;
  }

  // ============================================================
  // EXISTING ASSET WORKSPACE
  // ============================================================

  return (
    <div className="workspace-shell">
      <header className="topnav workspace-topnav simple-topnav">

        <button
          type="button"
          className="brand brand-button"
          onClick={() => setViewMode('portal')}
          aria-label="Back to infrastructure dashboard"
        >
          <div className="brand-logo">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 21V9l8-6 8 6v12h-2v-7H6v7H4zm8-15.5L6 10v2h12v-2l-6-4.5zM8 19h8v-3H8v3z" />
            </svg>
          </div>

          <div className="brand-text-group">
            <span className="brand-name">
              INFRA-SIGHT
            </span>

            <span className="brand-tagline">
              INFRASTRUCTURE INTELLIGENCE
            </span>
          </div>
        </button>

        <div className="simple-bridge-context">
          <span className="simple-context-label">
            ASSET
          </span>

          <strong>{asset.name}</strong>

          <span className="simple-context-id">
            {asset.id}
          </span>
        </div>

        <div className="nav-right">

          {weather && !weatherLoading && (
            <button
              type="button"
              className="status-pill live simple-weather"
              onClick={fetchWeather}
              title="Refresh weather"
            >
              <span className="pulse" />
              {weather.temperature}°C · {weather.wind_speed} km/h
            </button>
          )}

          {pendingCount > 0 ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={syncInspections}
            >
              Sync {pendingCount}
            </button>
          ) : (
            <span className="badge badge-verified">
              ✓ Synced
            </span>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setViewMode('portal')}
          >
            Dashboard
          </button>

        </div>
      </header>

      <main className="simple-workspace">

        <section className="bridge-heading">

          <div>
            <div className="eyebrow">
              ACTIVE DIGITAL TWIN
            </div>

            <h1>{asset.name}</h1>

            <p>
              {asset.location} · {asset.asset_type} · Opened{' '}
              {new Date(asset.opening_date).getFullYear()}
            </p>
          </div>

          <div className="bridge-heading-status">
            <span className="badge badge-operational">
              ● OPERATIONAL
            </span>

            <span className="badge badge-bridge">
              {components.length} COMPONENTS
            </span>
          </div>

        </section>

        <section
          className="component-selector"
          aria-label="Infrastructure components"
        >

          <div className="component-selector-title">

            <div>
              <span className="section-kicker">
                STRUCTURE
              </span>

              <strong>
                Select a component to inspect
              </strong>
            </div>

            {selectedComp && (
              <button
                type="button"
                className="clear-selection"
                onClick={() => setSelectedComponent(null)}
              >
                Clear selection
              </button>
            )}

          </div>

          <div className="component-chip-row">

            {components.map((comp) => {

              const riskClass =
                comp.risk === 'Low'
                  ? 'chip-low'
                  : comp.risk === 'Medium'
                    ? 'chip-medium'
                    : 'chip-high';

              return (
                <button
                  type="button"
                  key={comp.id}
                  className={`component-chip ${comp.id === selectedComponentId
                      ? 'selected'
                      : ''
                    }`}
                  onClick={() =>
                    setSelectedComponent(comp.id)
                  }
                >
                  <span
                    className={`chip-dot ${riskClass}`}
                  />

                  <span className="chip-name">
                    {comp.name}
                  </span>

                  <span className="chip-risk">
                    {comp.risk}
                  </span>
                </button>
              );
            })}

          </div>
        </section>

        <section className="workspace-grid">

          <div className="workspace-main-column">

            <div className="twin-card">

              <div className="twin-card-header">

                <div>
                  <span className="section-kicker">
                    DIGITAL TWIN
                  </span>

                  <strong>
                    Infrastructure model
                  </strong>
                </div>

                {selectedComp ? (
                  <div className="selected-context">
                    Inspecting{' '}
                    <strong>
                      {selectedComp.name}
                    </strong>
                  </div>
                ) : (
                  <div className="selected-context neutral">
                    Select a component to see its details
                  </div>
                )}

              </div>

              <div className="twin-viewport simple-twin-viewport">
                <DigitalTwin />
              </div>

              <div className="twin-help">
                Drag to rotate · Scroll to zoom · Click a component to inspect
              </div>

            </div>

            <div className="tab-card">

              <nav className="tab-bar simple-tab-bar">

                {[
                  ['brief', 'Overview'],
                  ['lifecycle', 'History'],
                  ['evidence', 'Evidence'],
                  ['engineering', 'Engineering'],
                  [
                    'field',
                    `Inspections${fieldInspections.length
                      ? ` (${fieldInspections.length})`
                      : ''
                    }`,
                  ],
                  ['lineage', 'Data lineage'],
                ].map(([id, label]) => (

                  <button
                    key={id}
                    type="button"
                    className={`tab-item ${activeTab === id ? 'active' : ''
                      }`}
                    onClick={() => setActiveTab(id)}
                  >
                    {label}
                  </button>

                ))}

              </nav>

              <div className="tab-content simple-tab-content">

                {activeTab === 'brief' && (
                  <AssetBrief />
                )}

                {activeTab === 'lifecycle' && (
                  <Lifecycle />
                )}

                {activeTab === 'evidence' && (
                  <EvidenceGraph />
                )}

                {activeTab === 'engineering' && (
                  <Engineering />
                )}

                {activeTab === 'field' && (
                  <FieldInspection />
                )}

                {activeTab === 'lineage' && (
                  <DataLineage />
                )}

              </div>
            </div>

          </div>

          <aside className="component-panel-card">

            <div className="component-panel-body">
              <ComponentIntelligence />
            </div>

          </aside>

        </section>

      </main>
    </div>
  );
}