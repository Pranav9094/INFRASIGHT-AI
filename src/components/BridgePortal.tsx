// ============================================================
// INFRA-SIGHT — Simple Bridge Selection
// First screen: choose the asset. More open-source assets later.
// ============================================================

import { useStore } from '../stores/useStore';
import { ASSET_REGISTRY } from '../data/ggbAsset';

export default function BridgePortal() {
  const { selectAssetAndEnter } = useStore();
  const entry = ASSET_REGISTRY[0];
  const asset = entry.asset;

  return (
    <div className="portal-container simple-portal">
      <header className="portal-header simple-portal-header">
        <div className="portal-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V9l8-6 8 6v12h-2v-7H6v7H4zm8-15.5L6 10v2h12v-2l-6-4.5zM8 19h8v-3H8v3z" /></svg>
          </div>
          <div>
            <div className="brand-name">INFRA-SIGHT</div>
            <div className="brand-tagline">BRIDGE INTELLIGENCE</div>
          </div>
        </div>
        <span className="badge badge-operational">● SYSTEM READY</span>
      </header>

      <main className="simple-portal-main">
        <section className="simple-portal-intro">
          <span className="eyebrow">INFRASTRUCTURE ASSET WORKSPACE</span>
          <h1>Select a bridge</h1>
          <p>Choose an asset to open its digital twin, condition overview, engineering evidence and inspection history.</p>
        </section>

        <section className="bridge-choice-area">
          <button type="button" className="bridge-choice-card" onClick={() => selectAssetAndEnter(asset.id)}>
            <div className="bridge-choice-top">
              <span className="bridge-choice-id">{asset.id}</span>
              <span className="badge badge-operational">READY</span>
            </div>
            <div className="bridge-choice-visual">
              <div className="bridge-choice-mark">GB</div>
              <div>
                <h2>{asset.name}</h2>
                <p>{asset.location}</p>
              </div>
            </div>
            <div className="bridge-choice-meta">
              <span>{asset.asset_type}</span>
              <span>·</span>
              <span>{entry.components.length} monitored components</span>
              <span>·</span>
              <span>3D twin ready</span>
            </div>
            <div className="bridge-choice-action">
              <span>Open bridge workspace</span>
              <span>→</span>
            </div>
          </button>

          <div className="future-assets-note">
            <div className="future-assets-plus">+</div>
            <div>
              <strong>More bridges will appear here</strong>
              <p>Open-source bridge models and datasets can be added to this selector later.</p>
            </div>
            <span>Coming soon</span>
          </div>
        </section>
      </main>
    </div>
  );
}
