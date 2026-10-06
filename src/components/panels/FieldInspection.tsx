// ============================================================
// INFRA-SIGHT — Field Inspection Panel
// Offline-first inspection capture with sync status
// ============================================================

import { useState } from 'react';
import { useStore } from '../../stores/useStore';
import { ASSET_REGISTRY } from '../../data/ggbAsset';
import type { ConditionState } from '../../types';

const CONDITIONS: ConditionState[] = [
  'Good', 'Operational', 'Monitor', 'Attention Required', 'Critical', 'Unknown', 'Not Assessed',
];

const INSPECTION_TYPES = [
  'Routine visual', 'Detailed structural', 'Emergency', 'Post-event', 'Corrosion assessment', 'Joint inspection',
];

const STEPS = ['Asset', 'Component', 'Condition', 'Observation', 'Location', 'Submit'];

export default function FieldInspection() {
  const { fieldInspections, addFieldInspection, isOffline, pendingSyncCount, syncInspections } = useStore();
  const components = ASSET_REGISTRY[0].components;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    asset_id: 'BR-GGB-001',
    component_id: components[0].id,
    condition: 'Unknown' as ConditionState,
    observation: '',
    notes: '',
    inspector_name: '',
    inspection_type: 'Routine visual',
    use_gps: false,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    is_demo: true,
  });

  const selectedComp = components.find(c => c.id === form.component_id);
  const pendingCount = pendingSyncCount();

  function setField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function captureGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        setField('latitude', pos.coords.latitude);
        setField('longitude', pos.coords.longitude);
        setField('use_gps', true);
      },
      () => alert('GPS unavailable')
    );
  }

  function submit() {
    addFieldInspection({
      asset_id: form.asset_id,
      component_id: form.component_id,
      component_name: selectedComp?.name ?? form.component_id,
      condition: form.condition,
      observation: form.observation,
      notes: form.notes,
      latitude: form.latitude,
      longitude: form.longitude,
      inspector_name: form.inspector_name || 'Demo Inspector',
      provenance: 'DEMO_SYNTHETIC',
      verification_status: 'pending',
    });
    setStep(0);
    setForm({
      asset_id: 'BR-GGB-001',
      component_id: components[0].id,
      condition: 'Unknown',
      observation: '',
      notes: '',
      inspector_name: '',
      inspection_type: 'Routine visual',
      use_gps: false,
      latitude: undefined,
      longitude: undefined,
      is_demo: true,
    });
  }

  const SyncStatus = () => {
    if (isOffline) {
      return (
        <div className="offline-banner">
          📴 Offline — {pendingCount > 0 ? `${pendingCount} inspection(s) pending sync` : 'Inspections will sync when connection returns'}
        </div>
      );
    }
    if (pendingCount > 0) {
      return (
        <div style={{
          background: 'var(--amber-50)', border: '1px solid var(--amber-200)',
          borderRadius: 'var(--radius-md)', padding: '10px 14px',
          fontSize: 12, color: 'var(--amber-700)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span>⏳ {pendingCount} inspection(s) pending sync</span>
          <button className="btn btn-secondary btn-sm" onClick={() => syncInspections()}>Sync now</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="section-heading">
        Field Inspection
        <span className="section-heading-sub">Offline-first capture · Sync when online · Preserved timestamp</span>
      </div>

      <SyncStatus />

      <div className="demo-banner">
        ⚠ <div>
          <strong>DEMO MODE:</strong> All field inspections captured here are labelled <code>provenance: DEMO_SYNTHETIC</code> and are stored locally only. They are never presented as real authorized inspection records. A connected backend would validate and promote verified records.
        </div>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <>
            <button
              key={s}
              className={`step-dot ${i < step ? 'step-done' : i === step ? 'step-active' : 'step-pending'}`}
              onClick={() => i < step && setStep(i)}
              title={s}
            >
              {i < step ? '✓' : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div key={`line-${i}`} className={`step-line ${i < step ? 'step-line-done' : ''}`} />
            )}
          </>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 16 }}>
        {STEPS.map((s, i) => <span key={i} style={{ fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--blue-600)' : undefined }}>{s}</span>)}
      </div>

      <div className="inspection-form">
        {/* Step 0: Asset */}
        {step === 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Step 1: Select Asset</div>
            <div className="form-group">
              <label className="form-label">Asset</label>
              <select className="form-control" value={form.asset_id} onChange={e => setField('asset_id', e.target.value)}>
                <option value="BR-GGB-001">Golden Gate Bridge — BR-GGB-001</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Inspector Name</label>
              <input type="text" className="form-control" placeholder="Your name (optional)" value={form.inspector_name} onChange={e => setField('inspector_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Inspection Type</label>
              <select className="form-control" value={form.inspection_type} onChange={e => setField('inspection_type', e.target.value)}>
                {INSPECTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(1)}>Next →</button>
          </>
        )}

        {/* Step 1: Component */}
        {step === 1 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Step 2: Select Component</div>
            <div className="form-group">
              <label className="form-label">Component</label>
              <select className="form-control" value={form.component_id} onChange={e => setField('component_id', e.target.value)}>
                {components.map(c => <option key={c.id} value={c.id}>{c.name} — {c.id}</option>)}
              </select>
            </div>
            {selectedComp && (
              <div style={{
                background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: 10, fontSize: 11, marginBottom: 12,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{selectedComp.name}</div>
                <div>Current condition: <strong>{selectedComp.condition}</strong></div>
                <div>Risk: <strong>{selectedComp.risk}</strong> · Confidence: <strong>{Math.round(selectedComp.confidence * 100)}%</strong></div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        )}

        {/* Step 2: Condition */}
        {step === 2 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Step 3: Record Condition</div>
            <div className="form-group">
              <label className="form-label">Observed Condition</label>
              <select className="form-control" value={form.condition} onChange={e => setField('condition', e.target.value as ConditionState)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="notice-card" style={{ marginBottom: 12 }}>
              "Unknown" means no sufficient evidence to assess — NOT the same as "Good." Only record what you can directly observe.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </>
        )}

        {/* Step 3: Observation */}
        {step === 3 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Step 4: Record Observation</div>
            <div className="form-group">
              <label className="form-label">Observation *</label>
              <textarea
                className="form-control"
                placeholder="Describe exactly what you observed. Be specific — describe location, extent, and nature. Do not invent or estimate percentages without measurement."
                value={form.observation}
                onChange={e => setField('observation', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                style={{ minHeight: 60 }}
                placeholder="Optional additional notes, safety concerns, access issues…"
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" disabled={!form.observation.trim()} onClick={() => setStep(4)}>Next →</button>
            </div>
          </>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Step 5: Capture Location</div>
            <div className="form-group">
              <label className="form-label">GPS Location</label>
              <button className="btn btn-secondary" onClick={captureGPS} style={{ marginBottom: 8 }}>
                📍 Capture GPS location
              </button>
              {form.latitude && (
                <div style={{ fontSize: 11, color: 'var(--green-700)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  ✓ {form.latitude.toFixed(6)}, {form.longitude?.toFixed(6)}
                </div>
              )}
              {!form.latitude && (
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  GPS location optional. Original capture timestamp is always preserved.
                </div>
              )}
            </div>
            <div style={{
              background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 12, fontSize: 11, marginBottom: 12,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Inspection Summary</div>
              <div>Asset: BR-GGB-001 — Golden Gate Bridge</div>
              <div>Component: {selectedComp?.name}</div>
              <div>Condition: {form.condition}</div>
              <div>Type: {form.inspection_type}</div>
              <div>Inspector: {form.inspector_name || 'Demo Inspector'}</div>
              <div style={{ marginTop: 6 }}>Observation: {form.observation.slice(0, 100)}{form.observation.length > 100 ? '…' : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(5)}>Review →</button>
            </div>
          </>
        )}

        {/* Step 5: Submit */}
        {step === 5 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Step 6: Submit</div>
            <div className="demo-banner" style={{ marginBottom: 12 }}>
              ⚠ <div>
                This will be saved as <strong>DEMO_SYNTHETIC</strong> — clearly labelled and NOT presented as a real authorized inspection. Original timestamp will be preserved.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 14, fontSize: 11, marginBottom: 12,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 12 }}>Final Inspection Record</div>
              {[
                ['Asset ID', 'BR-GGB-001'],
                ['Component', `${selectedComp?.name} (${form.component_id})`],
                ['Condition', form.condition],
                ['Type', form.inspection_type],
                ['Inspector', form.inspector_name || 'Demo Inspector'],
                ['GPS', form.latitude ? `${form.latitude.toFixed(6)}, ${form.longitude?.toFixed(6)}` : 'Not captured'],
                ['Timestamp', new Date().toISOString() + ' (will be set at submit)'],
                ['Provenance', 'DEMO_SYNTHETIC'],
                ['Sync status', isOffline ? 'SYNC PENDING (offline)' : 'SYNCED (online)'],
                ['Verification', 'PENDING — requires authorized review'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
                  <span style={{ fontFamily: k === 'Timestamp' || k === 'GPS' ? 'var(--font-mono)' : undefined }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep(4)}>← Back</button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--green-600)', borderColor: 'var(--green-600)' }}
                onClick={submit}
              >
                ✓ Save Inspection
              </button>
            </div>
          </>
        )}
      </div>

      {/* Inspection records */}
      {fieldInspections.length > 0 && (
        <div>
          <div className="section-heading" style={{ marginTop: 8 }}>
            Inspection Records
            <span className="section-heading-sub">{fieldInspections.length} total</span>
          </div>

          {fieldInspections.map(insp => (
            <div key={insp.id} className="inspection-record">
              <div className="inspection-record-header">
                <span className="inspection-record-comp">{insp.component_name}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className={`sync-badge ${insp.sync_status === 'pending' ? 'sync-pending' : insp.sync_status === 'synced' ? 'sync-synced' : 'sync-error'}`}>
                    {insp.sync_status === 'pending' ? '⏳ SYNC PENDING' : insp.sync_status === 'synced' ? '✓ SYNCED' : '✗ ERROR'}
                  </span>
                  <span className="badge badge-demo">DEMO</span>
                </div>
              </div>
              <div className="inspection-record-body">
                <div><strong>Condition:</strong> {insp.condition}</div>
                <div style={{ marginTop: 4 }}>{insp.observation}</div>
              </div>
              <div className="inspection-record-meta">
                <span className="text-mono">{new Date(insp.timestamp).toISOString()}</span>
                <span>Provenance: {insp.provenance}</span>
                {insp.latitude && <span>GPS: {insp.latitude.toFixed(4)}, {insp.longitude?.toFixed(4)}</span>}
                <span>Status: {insp.verification_status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
