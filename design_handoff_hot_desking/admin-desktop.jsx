// admin-desktop.jsx - David (facilities) + Priya (IT admin)

const I3 = window.Icon;

function Sidebar({ active, role = 'facilities' }) {
  const navItems = role === 'facilities' ? [
    { sect: 'Workplace' },
    { id: 'dash', label: 'Dashboard', icon: 'Home' },
    { id: 'floors', label: 'Floor plans', icon: 'Map' },
    { id: 'desks', label: 'Desks', icon: 'Building' },
    { id: 'bookings', label: 'Bookings', icon: 'Calendar' },
    { sect: 'Insights' },
    { id: 'reports', label: 'Utilisation', icon: 'Chart' },
    { id: 'issues', label: 'Issues', icon: 'Bell' },
  ] : [
    { sect: 'Configure' },
    { id: 'policy', label: 'Policies', icon: 'Shield' },
    { id: 'roles', label: 'Roles & access', icon: 'Lock' },
    { id: 'users', label: 'Users & teams', icon: 'Users' },
    { sect: 'Integrations' },
    { id: 'sso', label: 'Identity & SSO', icon: 'Lock' },
    { id: 'apps', label: 'Connected apps', icon: 'Settings' },
    { sect: 'Compliance' },
    { id: 'audit', label: 'Audit log', icon: 'Shield' },
  ];
  return (
    <div className="hd-admin-side">
      <div className="hd-admin-brand">
        <div className="hd-admin-brand-mark">D</div>
        <div>
          <div className="hd-admin-brand-name">DeskHub</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Acme Corp · Atrium HQ</div>
        </div>
      </div>
      {navItems.map((it, i) => {
        if (it.sect) return <div key={i} className="hd-admin-nav-section">{it.sect}</div>;
        const Ic = I3[it.icon];
        return (
          <div key={it.id} className={`hd-admin-nav ${active === it.id ? 'is-active' : ''}`}>
            <Ic/>{it.label}
          </div>
        );
      })}

      <div style={{ flex: 1 }}/>
      <div className="hd-admin-nav" style={{ marginTop: 'auto' }}>
        <I3.User/>{role === 'facilities' ? 'David Reed' : 'Priya Shah'}
      </div>
    </div>
  );
}

function Topbar({ title, sub, action }) {
  return (
    <div className="hd-admin-topbar">
      <div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--csb-navy-800)', letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--csb-ink-500)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <input placeholder="Search desks, users, sites…" style={{
            background: '#FAFBFD', border: '1px solid var(--csb-line)', borderRadius: 8,
            padding: '8px 12px 8px 34px', fontSize: 13, fontFamily: 'inherit',
            width: 280, color: 'var(--csb-ink-900)', outline: 'none',
          }}/>
          <I3.Search style={{ position: 'absolute', left: 10, top: 9, width: 16, height: 16, color: 'var(--csb-ink-500)' }}/>
        </div>
        {action}
      </div>
    </div>
  );
}

// ─── 1. Utilisation dashboard
function Screen_Dashboard() {
  const stats = [
    { label: 'Avg occupancy this week', n: '64%', t: '+8 pts', up: true },
    { label: 'Peak occupancy · Wed', n: '92%', t: 'vs 87% last wk', up: true },
    { label: 'No-show rate', n: '4.1%', t: '−1.2 pts', up: false, good: true },
    { label: 'Active bookings · today', n: '184', t: 'of 240 desks', up: true },
  ];

  // Heatmap data per zone × hour
  const zones = ['Atrium · Quiet', 'Atrium · Collab', 'Atrium · General', 'Atrium · Phone', 'East · Quiet', 'East · General'];
  const hours = ['08','09','10','11','12','13','14','15','16','17','18'];
  const heatVal = (z, h) => {
    const bell = 1 - Math.abs(h - 5) / 6;
    const zMod = [0.6, 0.85, 0.95, 0.4, 0.5, 0.78][z];
    return Math.min(1, bell * zMod * (0.85 + ((z*7 + h*3) % 13) / 60));
  };
  const heatColor = (v) => {
    if (v < 0.2) return '#EAF1F8';
    if (v < 0.4) return '#C9D8EA';
    if (v < 0.6) return '#F8E2AE';
    if (v < 0.8) return '#F1C06A';
    return '#E8A93B';
  };

  // line chart 7 days
  const week = [54, 58, 72, 64, 76, 62, 28];
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div className="hd-admin">
      <Sidebar active="dash" role="facilities"/>
      <div className="hd-admin-main">
        <Topbar
          title="Utilisation dashboard"
          sub="Atrium HQ · Apr 24 – Apr 30, 2026"
          action={
            <>
              <button className="hd-btn secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
                <I3.Download style={{ width: 14, height: 14 }}/> Export CSV
              </button>
              <button className="hd-btn primary" style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>
                Schedule report
              </button>
            </>
          }
        />
        <div className="hd-admin-content">
          <div className="hd-stat-grid">
            {stats.map(s => (
              <div key={s.label} className="hd-stat">
                <div className="hd-stat-label">{s.label}</div>
                <div className="hd-stat-num">{s.n}</div>
                <div className={`hd-stat-trend ${s.good ? 'up' : (s.up ? 'up' : 'down')}`}>
                  {(s.good || s.up) ? '↑' : '↓'} {s.t}
                </div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="hd-panel">
              <div className="hd-panel-h">
                <h3>Daily occupancy</h3>
                <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--csb-ink-500)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--csb-navy-700)' }}/> Booked</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--csb-gold-500)' }}/> Checked-in</span>
                </div>
              </div>
              <div style={{ padding: 20, height: 260 }}>
                <svg viewBox="0 0 600 240" style={{ width: '100%', height: '100%' }}>
                  {/* gridlines */}
                  {[0, 25, 50, 75, 100].map(p => (
                    <g key={p}>
                      <line x1="40" x2="590" y1={210 - p * 1.7} y2={210 - p * 1.7} stroke="#EEF2F8" strokeWidth="1"/>
                      <text x="32" y={214 - p * 1.7} fontSize="10" fill="#8A97AC" textAnchor="end">{p}%</text>
                    </g>
                  ))}
                  {/* bars */}
                  {week.map((v, i) => {
                    const w = 50, gap = 24, x = 60 + i * (w + gap);
                    const checked = Math.round(v * 0.93);
                    return (
                      <g key={i}>
                        <rect x={x} y={210 - v * 1.7} width={w} height={v * 1.7} fill="var(--csb-navy-700)" rx="3"/>
                        <rect x={x} y={210 - checked * 1.7} width={w} height={checked * 1.7} fill="var(--csb-gold-500)" rx="3"/>
                        <text x={x + w/2} y="228" fontSize="11" fill="#51627A" textAnchor="middle" fontWeight="500">{days[i]}</text>
                        <text x={x + w/2} y={205 - v * 1.7} fontSize="11" fill="#0A2A4E" textAnchor="middle" fontWeight="600">{v}%</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="hd-panel">
              <div className="hd-panel-h">
                <h3>Today, by zone</h3>
                <span className="hd-pill navy">Live</span>
              </div>
              <div style={{ padding: 16 }}>
                {[
                  { z: 'Atrium · General', cap: 60, used: 49, c: 'var(--csb-success)' },
                  { z: 'Atrium · Collab', cap: 24, used: 22, c: 'var(--csb-warning)' },
                  { z: 'Atrium · Quiet', cap: 32, used: 19, c: 'var(--csb-success)' },
                  { z: 'East · General', cap: 48, used: 38, c: 'var(--csb-success)' },
                  { z: 'East · Phone', cap: 8, used: 7, c: 'var(--csb-danger)' },
                ].map(r => (
                  <div key={r.z} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, color: 'var(--csb-navy-800)' }}>{r.z}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--csb-ink-700)' }}>{r.used}/{r.cap}</span>
                    </div>
                    <div style={{ background: 'var(--csb-navy-50)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                      <div style={{ background: r.c, height: '100%', width: (r.used / r.cap * 100) + '%', borderRadius: 999 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="hd-panel">
            <div className="hd-panel-h">
              <h3>Hourly heatmap · this week</h3>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Average occupancy %</div>
            </div>
            <div style={{ padding: 16, overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(11, 1fr)', gap: 4, alignItems: 'center' }}>
                <div/>
                {hours.map(h => (
                  <div key={h} style={{ fontSize: 11, color: 'var(--csb-ink-500)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{h}</div>
                ))}
                {zones.map((z, zi) => (
                  <React.Fragment key={z}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--csb-navy-800)', paddingRight: 8 }}>{z}</div>
                    {hours.map((h, hi) => {
                      const v = heatVal(zi, hi);
                      return <div key={hi} className="hd-heat-cell" style={{ background: heatColor(v) }}/>;
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Floor plan editor
function Screen_FloorEditor() {
  const [sel, setSel] = React.useState(window.FLOOR_DATA.desks.find(d => d.id === 'D-209'));
  return (
    <div className="hd-admin">
      <Sidebar active="floors" role="facilities"/>
      <div className="hd-admin-main">
        <Topbar
          title="Floor plans"
          sub="Atrium HQ · Floor 2 · v3 · published 12 Apr 2026"
          action={
            <>
              <button className="hd-btn secondary" style={{ padding: '8px 14px', fontSize: 13 }}>Preview</button>
              <button className="hd-btn primary" style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>Publish v4 →</button>
            </>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1, minHeight: 0 }}>
          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* toolbar */}
            <div style={{ borderBottom: '1px solid var(--csb-line)', padding: '10px 20px', display: 'flex', gap: 6, alignItems: 'center', background: '#fff' }}>
              {['Select','Add desk','Zone','Room','Mark out of service'].map((t, i) => (
                <button key={t} style={{
                  padding: '7px 12px',
                  borderRadius: 7,
                  border: '1px solid ' + (i === 0 ? 'var(--csb-navy-800)' : 'var(--csb-line)'),
                  background: i === 0 ? 'var(--csb-navy-50)' : '#fff',
                  color: i === 0 ? 'var(--csb-navy-800)' : 'var(--csb-ink-700)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{t}</button>
              ))}
              <div style={{ width: 1, height: 20, background: 'var(--csb-line)', margin: '0 6px' }}/>
              <span style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>60 desks · 5 zones · 12 amenities</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 12, color: 'var(--csb-warning)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--csb-warning)' }}/> Unsaved changes
              </span>
            </div>
            {/* canvas */}
            <div style={{ flex: 1, background: '#FAFBFD', padding: 24, overflow: 'auto' }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--csb-line)', height: '100%', minHeight: 480, position: 'relative' }}>
                <window.FloorPlanSVG selectedId={sel?.id} onSelect={setSel}/>
              </div>
            </div>
          </div>

          {/* Inspector */}
          <div style={{ borderLeft: '1px solid var(--csb-line)', background: '#fff', padding: 20, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Selected</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'var(--csb-navy-800)', letterSpacing: '-0.01em', marginTop: 4 }}>
              Desk {sel?.id}
            </div>
            <div style={{ fontSize: 13, color: 'var(--csb-ink-500)' }}>Zone: General · Floor 2</div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Properties</div>
              {[
                { l: 'Label', v: sel?.id || '—' },
                { l: 'Type', v: 'Standard · dual monitor' },
                { l: 'Coordinates', v: `(${sel?.x || 0}, ${sel?.y || 0})` },
                { l: 'Bookable', v: '08:00 – 19:00' },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--csb-line)', fontSize: 13 }}>
                  <span style={{ color: 'var(--csb-ink-500)' }}>{r.l}</span>
                  <span style={{ color: 'var(--csb-navy-800)', fontWeight: 500 }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Amenities</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Dual monitor', 'Standing', 'Wi-Fi 6', 'Window', 'Power × 4'].map(a => (
                  <span key={a} className="hd-pill navy">{a}</span>
                ))}
                <span className="hd-pill" style={{ background: '#fff', border: '1px dashed var(--csb-line-strong)', color: 'var(--csb-ink-500)' }}>+ add</span>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Status</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Available', 'Out of service', 'Reserved'].map((s, i) => (
                  <button key={s} style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 7,
                    border: '1px solid ' + (i === 0 ? 'var(--csb-success)' : 'var(--csb-line)'),
                    background: i === 0 ? 'var(--csb-success-bg)' : '#fff',
                    color: i === 0 ? 'var(--csb-success)' : 'var(--csb-ink-700)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Upcoming bookings</div>
              {[
                { d: 'Thu 30 Apr', u: 'Maya Khan', t: '09:00–17:30' },
                { d: 'Fri 1 May', u: 'Maya Khan', t: '09:00–17:30' },
                { d: 'Tue 5 May', u: 'Sam Patel', t: '10:00–16:00' },
              ].map(b => (
                <div key={b.d} style={{ padding: '8px 0', borderBottom: '1px solid var(--csb-line)', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, color: 'var(--csb-navy-800)' }}>
                    <span>{b.d}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--csb-ink-700)' }}>{b.t}</span>
                  </div>
                  <div style={{ color: 'var(--csb-ink-500)' }}>{b.u}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Policy / RBAC (Priya)
function Screen_Policy() {
  return (
    <div className="hd-admin">
      <Sidebar active="policy" role="it"/>
      <div className="hd-admin-main">
        <Topbar
          title="Booking policies"
          sub="Org-wide defaults · 3 site overrides active"
          action={
            <button className="hd-btn primary" style={{ padding: '8px 14px', fontSize: 13, width: 'auto' }}>Save changes</button>
          }
        />
        <div className="hd-admin-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Booking rules */}
            <div className="hd-panel">
              <div className="hd-panel-h">
                <h3>Booking horizon &amp; limits</h3>
                <span className="hd-pill navy">Org default</span>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <PolicyRow label="Booking horizon" desc="How far in advance employees can book" value="14 days" />
                <PolicyRow label="Max active bookings" desc="Per user, across all sites" value="5" />
                <PolicyRow label="Cancellation window" desc="Free cancellations until" value="2 hours before" />
                <PolicyRow label="No-show grace period" desc="Auto-release if not checked in" value="15 minutes" />
                <PolicyRow label="Same-day booking" desc="Allow walk-in bookings" value="Enabled" toggle/>
              </div>
            </div>

            {/* Roles */}
            <div className="hd-panel">
              <div className="hd-panel-h">
                <h3>Roles &amp; access</h3>
                <button style={{ background: 'transparent', border: 0, color: 'var(--csb-navy-700)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ New role</button>
              </div>
              <table className="hd-table">
                <thead><tr><th>Role</th><th>Scope</th><th>Members</th></tr></thead>
                <tbody>
                  {[
                    { r: 'Org Admin', s: 'Global', m: 4 },
                    { r: 'Site Admin', s: 'Atrium HQ, East', m: 7 },
                    { r: 'Floor Admin', s: 'Atrium · F2, F3', m: 12 },
                    { r: 'Team Lead', s: 'Department-scoped', m: 38 },
                    { r: 'Auditor', s: 'Read-only · global', m: 2 },
                    { r: 'Employee', s: 'Self', m: 1284 },
                  ].map(r => (
                    <tr key={r.r}>
                      <td style={{ fontWeight: 600, color: 'var(--csb-navy-800)' }}>{r.r}</td>
                      <td className="hd-mono">{r.s}</td>
                      <td>{r.m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrations */}
          <div className="hd-panel">
            <div className="hd-panel-h">
              <h3>Connected integrations</h3>
              <div style={{ fontSize: 13, color: 'var(--csb-ink-500)' }}>4 of 8 enabled</div>
            </div>
            <table className="hd-table">
              <thead><tr><th>Service</th><th>Type</th><th>Status</th><th>Last sync</th><th></th></tr></thead>
              <tbody>
                {[
                  { s: 'Microsoft Entra ID', t: 'SSO · OIDC', st: 'Healthy', sg: 'green', sync: '12 sec ago' },
                  { s: 'Microsoft 365 Calendar', t: 'Bi-directional sync', st: 'Healthy', sg: 'green', sync: '1 min ago' },
                  { s: 'Microsoft Teams', t: 'Bot · Adaptive Cards', st: 'Healthy', sg: 'green', sync: '4 min ago' },
                  { s: 'HID OnGuard', t: 'Building access', st: 'Degraded', sg: 'amber', sync: '38 min ago' },
                  { s: 'Workday HRIS', t: 'SCIM 2.0', st: 'Healthy', sg: 'green', sync: '6 hr ago' },
                  { s: 'Slack', t: 'Slash commands', st: 'Disabled', sg: 'gray', sync: '—' },
                ].map(r => (
                  <tr key={r.s}>
                    <td style={{ fontWeight: 600, color: 'var(--csb-navy-800)' }}>{r.s}</td>
                    <td className="hd-mono">{r.t}</td>
                    <td>
                      <span className={`hd-pill ${r.sg === 'green' ? 'green' : r.sg === 'amber' ? 'amber' : ''}`} style={r.sg === 'gray' ? { background: 'var(--csb-surface-tint)', color: 'var(--csb-ink-500)' } : {}}>{r.st}</span>
                    </td>
                    <td className="hd-mono" style={{ color: 'var(--csb-ink-500)' }}>{r.sync}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button style={{ background: 'transparent', border: 0, color: 'var(--csb-navy-700)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Configure</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyRow({ label, desc, value, toggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>{desc}</div>
      </div>
      {toggle ? (
        <div style={{ width: 36, height: 22, background: 'var(--csb-success)', borderRadius: 999, position: 'relative', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
        </div>
      ) : (
        <div style={{
          padding: '7px 12px', borderRadius: 8, border: '1px solid var(--csb-line)',
          fontSize: 13, fontWeight: 600, color: 'var(--csb-navy-800)', background: '#fff',
          minWidth: 130, textAlign: 'center',
        }}>{value}</div>
      )}
    </div>
  );
}

window.HD_Admin = { Screen_Dashboard, Screen_FloorEditor, Screen_Policy };
