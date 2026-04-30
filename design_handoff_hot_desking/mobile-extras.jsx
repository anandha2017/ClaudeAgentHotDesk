// mobile-extras.jsx - Visitor pass + Find my team

const I2 = window.Icon;

function VFrame({ children }) {
  return (
    <window.IOSDevice statusBar={{ time: '10:14' }}>
      <div className="hd-mobile">{children}</div>
    </window.IOSDevice>
  );
}

// ─── Visitor / guest pass (Tom)
function Screen_Guest() {
  const qrCells = React.useMemo(() => {
    const cells = [];
    for (let i = 0; i < 21 * 21; i++) {
      const r = Math.floor(i / 21), c = i % 21;
      const inFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      let on = false;
      if (inFinder) {
        const lr = r < 7 ? r : r - 14;
        const lc = c < 7 ? c : c - 14;
        on = (lr === 0 || lr === 6 || lc === 0 || lc === 6) || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        on = ((r * 11 + c * 5 + r * c * 3) % 5 < 2);
      }
      cells.push(on);
    }
    return cells;
  }, []);

  return (
    <VFrame>
      <div className="hd-mobile-scroll">
        <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--csb-navy-800)' }}>Visitor pass</div>
          <span className="hd-pill gold">Guest · no app</span>
        </div>

        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ fontSize: 13, color: 'var(--csb-ink-500)' }}>Hosted by</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--csb-navy-800)', marginTop: 2 }}>Maya Khan · Design</div>
        </div>

        <div className="hd-card" style={{ padding: 18, margin: '8px 16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your desk</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--csb-navy-800)', letterSpacing: '-0.02em' }}>G-12</div>
              <div style={{ fontSize: 13, color: 'var(--csb-ink-500)' }}>Floor 2 · Reception → straight ahead, on the right</div>
            </div>
            <div className="hd-iconbox" style={{ width: 44, height: 44 }}>
              <I2.Pin style={{ width: 22, height: 22 }}/>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--csb-line)' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--csb-ink-500)' }}>Arrival</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Thu 30 Apr · 10:00</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--csb-ink-500)' }}>Wi-Fi</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Acme-Guest · csb-2026</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', placeItems: 'center', padding: '4px 16px 12px' }}>
          <div className="hd-qr" style={{ width: 168, height: 168 }}>
            {qrCells.map((on, i) => <i key={i} style={{ background: on ? 'var(--csb-navy-900)' : 'transparent' }}/>)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--csb-ink-500)', marginTop: 10, textAlign: 'center' }}>
            Show at reception · opens turnstile
          </div>
        </div>

        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <button className="hd-btn secondary" style={{ flex: 1 }}>
            <I2.Map style={{ width: 16, height: 16 }}/> Directions
          </button>
          <button className="hd-btn primary" style={{ flex: 1 }}>Notify host</button>
        </div>

        <div style={{ padding: '0 24px 16px', fontSize: 12, color: 'var(--csb-ink-500)', textAlign: 'center', lineHeight: 1.5 }}>
          Need help? Maya is reachable on <span style={{ color: 'var(--csb-navy-700)', fontWeight: 600 }}>+44 7700 900123</span>.
        </div>
      </div>
    </VFrame>
  );
}

// ─── Find my team
function Screen_Team() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const team = [
    { n: 'Sam Patel', r: 'PM', i: 'SP', days: [0,1,1,1,0], desk: 'D-208' },
    { n: 'Jen Liu', r: 'Eng', i: 'JL', days: [0,1,0,1,0], desk: 'D-405' },
    { n: 'Rob Akin', r: 'Design', i: 'RA', days: [1,1,1,1,1], desk: 'D-209' },
    { n: 'Mia Chen', r: 'Eng', i: 'MC', days: [0,0,1,1,0], desk: 'D-406' },
    { n: 'Ade Bayo', r: 'Research', i: 'AB', days: [0,0,0,1,0], desk: '—' },
    { n: 'Hana Vos', r: 'PM', i: 'HV', days: [0,1,1,0,0], desk: 'D-404' },
  ];

  return (
    <VFrame>
      <div className="hd-mobile-scroll">
        <div style={{ padding: '8px 16px 4px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--csb-navy-800)', lineHeight: 1.1 }}>Find my team</div>
          <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>This week · 6 of 8 opted in</div>
        </div>

        {/* Day chips */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 16px 8px', overflowX: 'auto' }}>
          {days.map((d, i) => (
            <button key={d} style={{
              flex: '0 0 auto',
              padding: '10px 14px',
              borderRadius: 999,
              border: '1px solid ' + (i === 3 ? 'var(--csb-navy-800)' : 'var(--csb-line)'),
              background: i === 3 ? 'var(--csb-navy-800)' : '#fff',
              color: i === 3 ? '#fff' : 'var(--csb-ink-700)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              minWidth: 64,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 10, letterSpacing: '0.06em', opacity: 0.8 }}>{d.toUpperCase()}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700 }}>{28 + i}</span>
              <span style={{ fontSize: 10, opacity: i === 3 ? 0.85 : 0.7 }}>{[2,4,3,5,1][i]} in</span>
            </button>
          ))}
        </div>

        <div style={{ padding: '8px 20px 4px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Thursday 30 April · 5 in</div>
        </div>

        {/* Team rows */}
        <div style={{ padding: '4px 16px 16px' }}>
          {team.filter(t => t.days[3]).map(t => (
            <div key={t.n} className="hd-card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div className="hd-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{t.i}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>{t.n}</div>
                <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>{t.r} · Floor 2</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--csb-navy-800)' }}>{t.desk}</div>
                <div style={{ fontSize: 11, color: 'var(--csb-ink-500)' }}>{t.desk === 'D-209' ? 'next to you' : 'collab zone'}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <div className="hd-card" style={{ background: 'var(--csb-navy-50)', borderColor: 'var(--csb-navy-100)', display: 'flex', gap: 12 }}>
            <div className="hd-iconbox"><I2.Pin style={{ width: 18, height: 18 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Sit near your team</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Free desks within 5m of Sam, Rob, Hana — 4 available</div>
            </div>
            <I2.ChevronRight style={{ width: 18, height: 18, color: 'var(--csb-ink-500)' }}/>
          </div>
        </div>
      </div>
    </VFrame>
  );
}

window.HD_Extras = { Screen_Guest, Screen_Team };
