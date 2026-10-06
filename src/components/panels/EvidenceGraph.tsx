// ============================================================
// INFRA-SIGHT — Evidence Graph Panel
// Visual evidence flow + source registry
// ============================================================

import { useState } from 'react';
import { useStore } from '../../stores/useStore';
import type { Evidence, DataSource } from '../../types';

const TIER_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  LIVE: { bg: 'var(--green-50)', text: 'var(--green-800)', dot: '#22c55e' },
  VERIFIED: { bg: 'var(--blue-50)', text: 'var(--blue-800)', dot: '#3b82f6' },
  FIELD: { bg: 'var(--violet-50)', text: 'var(--violet-800)', dot: '#8b5cf6' },
  DERIVED: { bg: '#FFFBEB', text: '#92400e', dot: '#f59e0b' },
  DEMO: { bg: 'var(--orange-50)', text: '#c2410c', dot: '#f97316' },
  UNAVAILABLE: { bg: 'var(--grey-50)', text: 'var(--grey-600)', dot: '#9ca3af' },
  ACCESS_DEPENDENT: { bg: '#FFF7ED', text: '#c2410c', dot: '#f97316' },
};

function EvidenceNodeDetail({ evidence }: { evidence: Evidence }) {
  const { getSources, getComponents } = useStore();
  const source = getSources().find(s => s.id === evidence.source_id);
  const component = getComponents().find(c => c.id === evidence.component_id);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1.5px solid var(--blue-100)',
      borderRadius: 'var(--radius-md)',
      padding: 14,
      marginTop: 8,
      fontSize: 11,
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: 'var(--text-primary)' }}>
        Evidence Record Detail
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>ID</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{evidence.id}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>TIER</div>
          <div style={{ color: TIER_COLOR[evidence.tier]?.text }}>{evidence.tier}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>SOURCE</div>
          <div>{source?.name ?? evidence.source_id}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>COMPONENT</div>
          <div>{component?.name ?? (evidence.component_id ?? 'Asset-level')}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>OBSERVED AT</div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>{new Date(evidence.observed_at).toISOString()}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>RECEIVED AT</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{new Date(evidence.received_at).toISOString()}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>VERIFICATION</div>
          <div>{evidence.verification_status}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>CONFIDENCE</div>
          <div>{Math.round(evidence.confidence * 100)}%</div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>DESCRIPTION</div>
          <div style={{ lineHeight: 1.5, color: 'var(--text-secondary)' }}>{evidence.description}</div>
        </div>
        {source?.url && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 3 }}>SOURCE URL</div>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="link">{source.url}</a>
          </div>
        )}
      </div>
    </div>
  );
}

function SourceRow({ source }: { source: DataSource }) {
  const tc = TIER_COLOR[source.tier] ?? TIER_COLOR.UNAVAILABLE;

  return (
    <div className="source-row">
      <div>
        <div className="source-name">
          {source.name}
          {source.url && source.status !== 'access_dependent' && (
            <a href={source.url} target="_blank" rel="noopener noreferrer">{source.url.slice(0, 40)}…</a>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{source.coverage?.slice(0, 60)}</div>
      </div>
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 'var(--radius-full)',
          fontSize: 10, fontWeight: 600,
          background: tc.bg, color: tc.text,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: tc.dot, display: 'inline-block' }} />
          {source.tier}
        </span>
      </div>
      <div>
        <div className="trust-bar">
          <div className="trust-bar-track">
            <div className="trust-bar-fill" style={{ width: `${source.trust_level * 100}%` }} />
          </div>
          <span className="trust-pct">{Math.round(source.trust_level * 100)}%</span>
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
        {source.last_checked ? new Date(source.last_checked).toLocaleDateString() : '—'}
      </div>
    </div>
  );
}

export default function EvidenceGraph() {
  const { getEvidence, getSources, getComponents } = useStore();
  const evidence = getEvidence();
  const sources = getSources();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'list' | 'sources'>('graph');

  return (
    <div>
      <div className="section-heading">
        Evidence Graph
        <span className="section-heading-sub">{evidence.length} evidence items · {sources.length} sources</span>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {(['graph', 'list', 'sources'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '6px 12px', fontSize: 11 }}
          >
            {tab === 'graph' ? '🔗 Flow' : tab === 'list' ? '📋 Evidence List' : '🗂 Source Registry'}
          </button>
        ))}
      </div>

      {activeTab === 'graph' && (
        <>
          {/* Visual evidence flow */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            boxShadow: 'var(--shadow-xs)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginBottom: 16 }}>
              EVIDENCE FLOW — DATA PIPELINE
            </div>

            <div className="evidence-graph-wrap">
              {[
                { label: 'DATA SOURCES', sub: 'GGB District · Open-Meteo · OSM', cls: 'eg-source' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'VALIDATE + NORMALIZE', sub: 'Schema check · Timestamp separation · Canonical format', cls: 'eg-process' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'EVIDENCE STORE', sub: 'Provenance preserved · Source tracked · Confidence assigned', cls: 'eg-asset' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'ASSET + COMPONENTS', sub: 'BR-GGB-001 · DECK-001 · TOWER-N-001 · …', cls: 'eg-process' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'RISK ENGINE', sub: 'Weighted evidence · Missing data penalized · Explainable', cls: 'eg-risk' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'AI INVESTIGATOR', sub: 'Evidence-first reasoning · References evidence IDs', cls: 'eg-action' },
                { label: '▼', sub: '', cls: 'eg-arrow' },
                { label: 'INSPECTION RECOMMENDATION', sub: 'Verified field feedback → Evidence Store', cls: 'eg-source' },
              ].map((node, i) => (
                node.cls === 'eg-arrow' ? (
                  <div key={i} className="eg-arrow">{node.label}</div>
                ) : (
                  <div key={i} className={`eg-node ${node.cls}`}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{node.label}</div>
                    {node.sub && <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3 }}>{node.sub}</div>}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="notice-card">
            Every evidence item has full traceability: source → connector → validation → normalization → geo/time match → observation → component → risk engine → AI Investigator. No raw external API response directly controls the risk engine.
          </div>
        </>
      )}

      {activeTab === 'list' && (
        <div>
          {evidence.map(ev => {
            const tc = TIER_COLOR[ev.tier] ?? TIER_COLOR.UNAVAILABLE;
            const isSelected = selectedEvidenceId === ev.id;
            const comp = getComponents().find(c => c.id === ev.component_id);
            return (
              <div key={ev.id}>
                <div
                  className="evidence-card"
                  onClick={() => setSelectedEvidenceId(isSelected ? null : ev.id)}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid var(--blue-400)' : undefined,
                    background: isSelected ? 'var(--blue-50)' : undefined,
                  }}
                >
                  <div className="evidence-card-header">
                    <span className="evidence-card-title">{ev.title}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px',
                      borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 600,
                      background: tc.bg, color: tc.text,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: tc.dot, display: 'inline-block' }} />
                      {ev.tier}
                    </span>
                  </div>
                  <div className="evidence-card-desc">{ev.description.slice(0, 120)}…</div>
                  <div className="evidence-card-meta">
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{ev.id}</span>
                    <span>·</span>
                    {comp && <><span>{comp.name}</span><span>·</span></>}
                    <span>Conf: {Math.round(ev.confidence * 100)}%</span>
                  </div>
                </div>
                {isSelected && <EvidenceNodeDetail evidence={ev} />}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="source-table">
          <div className="source-row source-row-head">
            <div>Source</div>
            <div>Tier</div>
            <div>Trust</div>
            <div>Last Checked</div>
          </div>
          {sources.map(source => (
            <SourceRow key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}
