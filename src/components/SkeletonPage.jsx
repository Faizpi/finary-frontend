export default function SkeletonPage({ activeTab }) {
  return (
    <div className="skeleton-page">
      <SkeletonNavbar />
      {activeTab === 'profile' && <SkeletonProfile />}
      {activeTab === 'transactions' && <SkeletonTransactions />}
      {activeTab === 'assessment' && <SkeletonAssessment />}
      {activeTab === 'hustle' && <SkeletonHustle />}
      {activeTab === 'forum' && <SkeletonForum />}
      {(!activeTab || activeTab === 'dashboard') && <SkeletonDashboard />}
    </div>
  )
}

function SkeletonNavbar() {
  return (
    <div className="skeleton-header">
      <div className="skeleton sk-h3" style={{ width: 120 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ width: 80, height: 46, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: 80, height: 46, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: 80, height: 46, borderRadius: 999 }} />
      </div>
      <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 999 }} />
    </div>
  )
}

function SkeletonDashboard() {
  return (
    <>
      <div className="skeleton-hero">
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="skeleton sk-h4 sk-w-40" />
          <div className="skeleton sk-h2 sk-w-80" />
          <div className="skeleton sk-h1" style={{ width: '60%' }} />
          <div className="skeleton sk-text sk-w-60" />
        </div>
        <div className="skeleton" style={{ width: 240, height: 200, borderRadius: 22 }} />
      </div>
      <div className="skeleton-panel">
        <div className="skeleton sk-h3 sk-w-40" />
        <div className="skeleton-grid-2">
          <div className="skeleton-panel" style={{ alignItems: 'center' }}>
            <div className="skeleton sk-pie" />
            <div className="skeleton sk-text sk-w-60" />
            <div className="skeleton sk-text sk-w-40" />
          </div>
          <div className="skeleton-panel" style={{ alignItems: 'center' }}>
            <div className="skeleton sk-pie" />
            <div className="skeleton sk-text sk-w-60" />
            <div className="skeleton sk-text sk-w-40" />
          </div>
        </div>
        <div className="skeleton-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="skeleton sk-card-sm" />
          <div className="skeleton sk-card-sm" />
          <div className="skeleton sk-card-sm" />
          <div className="skeleton sk-card-sm" />
        </div>
      </div>
      <div className="skeleton-panel">
        <div className="skeleton sk-h3 sk-w-40" />
        <div className="skeleton-grid">
          <div className="skeleton sk-card" />
          <div className="skeleton sk-card" />
          <div className="skeleton sk-card" />
        </div>
      </div>
      <div className="skeleton-panel">
        <div className="skeleton sk-h3 sk-w-40" />
        <div className="skeleton" style={{ height: 20, borderRadius: 999 }} />
        <div className="skeleton" style={{ height: 20, borderRadius: 999, width: '70%' }} />
      </div>
    </>
  )
}

function SkeletonProfile() {
  return (
    <>
      <div className="skeleton-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'start' }}>
          <div className="skeleton sk-avatar" />
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="skeleton sk-h2 sk-w-60" />
            <div className="skeleton sk-text sk-w-40" />
            <div className="skeleton sk-h4 sk-w-40" />
            <div className="skeleton sk-text sk-w-80" />
          </div>
        </div>
        <div className="skeleton-grid-3">
          <div className="skeleton sk-card" />
          <div className="skeleton sk-card" />
          <div className="skeleton sk-card" />
        </div>
        <div className="skeleton-panel">
          <div className="skeleton sk-h3 sk-w-40" />
          <div className="skeleton-grid">
            <div className="skeleton sk-card-sm" />
            <div className="skeleton sk-card-sm" />
            <div className="skeleton sk-card-sm" />
          </div>
        </div>
      </div>
    </>
  )
}

function SkeletonTransactions() {
  return (
    <div className="skeleton-panel">
      <div className="skeleton-grid-2">
        <div className="skeleton-panel">
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton sk-btn" />
        </div>
        <div className="skeleton-panel">
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton sk-btn" />
          <div className="skeleton sk-card-sm" />
          <div className="skeleton sk-card-sm" />
        </div>
      </div>
      <div className="skeleton-panel">
        <div className="skeleton sk-h3 sk-w-40" />
        <div className="skeleton" style={{ height: 36 }} />
        <div className="skeleton" style={{ height: 36 }} />
        <div className="skeleton" style={{ height: 36 }} />
        <div className="skeleton" style={{ height: 36 }} />
      </div>
    </div>
  )
}

function SkeletonAssessment() {
  return (
    <div className="skeleton-panel">
      <div className="skeleton-grid-2">
        <div className="skeleton-panel">
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton sk-text sk-w-80" />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton sk-btn" />
        </div>
        <div className="skeleton-panel" style={{ alignItems: 'center', justifyItems: 'center' }}>
          <div className="skeleton" style={{ width: 200, height: 180, borderRadius: 22 }} />
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton sk-text sk-w-80" />
        </div>
      </div>
    </div>
  )
}

function SkeletonHustle() {
  return (
    <div className="skeleton-panel">
      <div className="skeleton-panel" style={{ gridTemplateColumns: '1fr auto', display: 'grid' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton sk-btn" />
        </div>
        <div className="skeleton" style={{ width: 220, height: 200, borderRadius: 22 }} />
      </div>
      <div className="skeleton-grid-2">
        <div className="skeleton sk-card" />
        <div className="skeleton sk-card" />
        <div className="skeleton sk-card" />
        <div className="skeleton sk-card" />
      </div>
    </div>
  )
}

function SkeletonForum() {
  return (
    <div className="skeleton-panel">
      <div className="skeleton-grid-2">
        <div className="skeleton-panel">
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 90, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 46, borderRadius: 18 }} />
          <div className="skeleton sk-btn" />
        </div>
        <div className="skeleton-panel" style={{ alignItems: 'center', justifyItems: 'center' }}>
          <div className="skeleton" style={{ width: 200, height: 180, borderRadius: 22 }} />
          <div className="skeleton sk-h3 sk-w-60" />
          <div className="skeleton sk-text sk-w-80" />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <div className="skeleton sk-card" />
        <div className="skeleton sk-card" />
        <div className="skeleton sk-card" />
      </div>
    </div>
  )
}
