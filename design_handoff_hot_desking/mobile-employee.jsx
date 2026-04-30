// mobile-employee.jsx - Maya's mobile screens

const I = window.Icon;

// ─── shared mobile chrome
function MobileFrame({ children, time = '9:41' }) {
  return (
    <window.IOSDevice statusBar={{ time }}>
      <div className="hd-mobile">{children}</div>
    </window.IOSDevice>
  );
}

function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home', label: 'Today', icon: 'Home' },
    { id: 'book', label: 'Book', icon: 'Calendar' },
    { id: 'map', label: 'Map', icon: 'Map' },
    { id: 'me', label: 'Me', icon: 'User' },
  ];
  return (
    <div className="hd-tabbar">
      {tabs.map(t => {
        const Ic = I[t.icon];
        return (
          <button key={t.id} className={`hd-tab ${active === t.id ? 'is-active' : ''}`}>
            <Ic/>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MHeader({ name = 'Maya', sub = 'Wednesday, 30 April' }) {
  return (
    <div className="hd-m-header">
      <div>
        <div className="hd-m-greet">{sub}</div>
        <div className="hd-m-name">Hi, {name}</div>
      </div>
      <div className="hd-avatar">MK</div>
    </div>
  );
}

// ─── 1. HOME / Today
function Screen_Home() {
  return (
    <MobileFrame>
      <div className="hd-mobile-scroll">
        <MHeader/>

        {/* Today card */}
        <div className="hd-today">
          <div className="eyebrow">Today · checked in</div>
          <h2>Desk 207, Floor 2</h2>
          <div className="hd-today-meta">
            <I.Pin style={{ width: 14, height: 14 }}/>
            General · near window · until 17:30
          </div>
          <div className="hd-today-row">
            <button className="hd-today-btn primary">
              <I.Map style={{ width: 16, height: 16 }}/>
              Navigate
            </button>
            <button className="hd-today-btn ghost">End early</button>
          </div>
        </div>

        {/* Upcoming */}
        <div className="hd-section-h">
          <h3>Upcoming</h3>
          <a className="hd-link" href="#">See all</a>
        </div>
        <div className="hd-card">
          <div className="hd-row">
            <div className="hd-iconbox"><I.Calendar style={{ width: 20, height: 20 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Tomorrow · Thu 1 May</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)', marginTop: 2 }}>
                Desk 207 · Floor 2 · 09:00–17:30
              </div>
            </div>
            <span className="hd-pill green"><I.Repeat style={{ width: 11, height: 11 }}/> Recurring</span>
          </div>
        </div>
        <div className="hd-card">
          <div className="hd-row">
            <div className="hd-iconbox"><I.Calendar style={{ width: 20, height: 20 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Tue 6 May</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)', marginTop: 2 }}>
                Floor 2 · choose desk · 09:00–17:30
              </div>
            </div>
            <I.ChevronRight style={{ width: 18, height: 18, color: 'var(--csb-ink-500)' }}/>
          </div>
        </div>

        {/* Quick actions */}
        <div className="hd-section-h">
          <h3>Quick actions</h3>
        </div>
        <div className="hd-quick-grid">
          <button className="hd-quick">
            <I.Plus style={{ width: 22, height: 22 }}/>
            <div className="hd-quick-title">Book a desk</div>
            <div className="hd-quick-sub">For another day</div>
          </button>
          <button className="hd-quick">
            <I.Users style={{ width: 22, height: 22 }}/>
            <div className="hd-quick-title">Find my team</div>
            <div className="hd-quick-sub">3 in tomorrow</div>
          </button>
          <button className="hd-quick">
            <I.Repeat style={{ width: 22, height: 22 }}/>
            <div className="hd-quick-title">Repeat usual</div>
            <div className="hd-quick-sub">Tue + Thu, Floor 2</div>
          </button>
          <button className="hd-quick">
            <I.QR style={{ width: 22, height: 22 }}/>
            <div className="hd-quick-title">Invite guest</div>
            <div className="hd-quick-sub">QR pass · no app</div>
          </button>
        </div>

        <div style={{ height: 16 }}/>
      </div>
      <TabBar active="home"/>
    </MobileFrame>
  );
}

// ─── 2. BOOKING — calendar with heatmap
function Screen_Calendar() {
  // 30-day grid starting Mon 27 Apr 2026 (so 30 Apr = Thu, position 4)
  const days = [];
  for (let i = 0; i < 35; i++) {
    const dayNum = i - 2; // start 27 Apr (Mon)... 27,28,29,30=today,1,2,3 etc
    const inMonth = dayNum >= 1 && dayNum <= 31;
    const realDay = ((dayNum - 1) % 30) + 1;
    days.push({ day: inMonth ? dayNum : (dayNum < 1 ? (30 + dayNum) : (dayNum - 31)), inMonth, idx: i });
  }
  // heat pattern (0=none/wknd, 1=red, 2=amber, 3=green)
  const heatFor = (i) => {
    const dow = i % 7; // 0=mon
    if (dow >= 5) return 0; // weekend
    return [3, 1, 2, 3, 2][i % 5]; // pseudo random
  };
  const today = 6; // 30 Apr position
  const selected = 13; // Thu next week
  return (
    <MobileFrame>
      <div className="hd-mobile-scroll">
        {/* header */}
        <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ background: '#fff', border: '1px solid var(--csb-line)', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
            <I.ChevronLeft style={{ width: 18, height: 18 }}/>
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--csb-navy-800)', lineHeight: 1.1 }}>Book a desk</div>
            <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Pick a date — Floor 2, Atrium</div>
          </div>
        </div>

        {/* month controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--csb-navy-800)' }}>April – May 2026</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ background: 'transparent', border: 0, color: 'var(--csb-navy-700)', cursor: 'pointer', padding: 4 }}><I.ChevronLeft style={{ width: 18, height: 18 }}/></button>
            <button style={{ background: 'transparent', border: 0, color: 'var(--csb-navy-700)', cursor: 'pointer', padding: 4 }}><I.ChevronRight style={{ width: 18, height: 18 }}/></button>
          </div>
        </div>

        {/* day-of-week */}
        <div className="hd-cal-grid" style={{ marginBottom: 4 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="hd-cal-dow">{d}</div>
          ))}
        </div>

        {/* calendar grid */}
        <div className="hd-cal-grid">
          {days.map((d, i) => {
            const heat = d.inMonth ? heatFor(i) : 0;
            const isToday = i === today;
            const isSelected = i === selected;
            return (
              <div
                key={i}
                className={`hd-cal-cell ${!d.inMonth ? 'is-other' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              >
                {d.day}
                {d.inMonth && heat > 0 && !isSelected && (
                  <div className={`hd-heat ${heat === 1 ? 'red' : heat === 2 ? 'amber' : 'green'}`}/>
                )}
                {isSelected && <div className="hd-cal-dot"/>}
              </div>
            );
          })}
        </div>

        {/* legend */}
        <div style={{ padding: '14px 20px 4px' }}>
          <div className="hd-legend">
            <span><i style={{ background: 'var(--csb-success)' }}/> Available</span>
            <span><i style={{ background: 'var(--csb-warning)' }}/> Limited</span>
            <span><i style={{ background: 'var(--csb-danger)' }}/> Full</span>
          </div>
        </div>

        {/* selected day summary */}
        <div className="hd-card" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Selected</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--csb-navy-800)', marginTop: 2 }}>
                Thu 7 May 2026
              </div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)', marginTop: 2 }}>
                09:00 – 17:30 · 24 of 60 desks free
              </div>
            </div>
            <span className="hd-pill green">Available</span>
          </div>

          <div style={{ borderTop: '1px solid var(--csb-line)', paddingTop: 10, display: 'flex', gap: 8 }}>
            <label style={{ flex: 1, fontSize: 12, color: 'var(--csb-ink-500)' }}>
              <span style={{ display: 'block', marginBottom: 4 }}>From</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--csb-navy-800)', fontWeight: 600 }}>09:00</span>
            </label>
            <label style={{ flex: 1, fontSize: 12, color: 'var(--csb-ink-500)' }}>
              <span style={{ display: 'block', marginBottom: 4 }}>Until</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--csb-navy-800)', fontWeight: 600 }}>17:30</span>
            </label>
            <label style={{ flex: 1, fontSize: 12, color: 'var(--csb-ink-500)' }}>
              <span style={{ display: 'block', marginBottom: 4 }}>Repeat</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--csb-navy-800)', fontWeight: 600 }}>None</span>
            </label>
          </div>
        </div>

        <div style={{ padding: '8px 16px 16px' }}>
          <button className="hd-btn primary">
            Choose a desk
            <I.ChevronRight style={{ width: 18, height: 18 }}/>
          </button>
        </div>
      </div>
      <TabBar active="book"/>
    </MobileFrame>
  );
}

// ─── 3. FLOOR MAP
function Screen_Map() {
  const [sel, setSel] = React.useState(window.FLOOR_DATA.desks.find(d => d.id === 'D-209'));
  return (
    <MobileFrame>
      <div className="hd-mobile-scroll" style={{ paddingBottom: 0 }}>
        <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--csb-navy-800)', lineHeight: 1.1 }}>Floor 2 · Atrium</div>
            <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Thu 7 May · 24 of 60 free</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ background: '#fff', border: '1px solid var(--csb-line)', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
              <I.Filter style={{ width: 16, height: 16 }}/>
            </button>
            <button style={{ background: 'var(--csb-navy-800)', color: '#fff', border: 0, borderRadius: 10, padding: '0 14px', fontSize: 13, fontWeight: 600 }}>List</button>
          </div>
        </div>

        {/* legend */}
        <div style={{ padding: '0 20px 10px' }}>
          <div className="hd-legend">
            <span><i style={{ background: '#fff', border: '1.5px solid #1FA39B' }}/> Free</span>
            <span><i style={{ background: '#D9E0EA' }}/> Booked</span>
            <span><i style={{ background: '#E8A93B' }}/> Teammate</span>
            <span><i style={{ background: '#0A2A4E' }}/> You</span>
          </div>
        </div>

        <div className="hd-floor-wrap">
          <window.FloorPlanSVG selectedId={sel?.id} onSelect={setSel}/>

          {/* bottom sheet */}
          {sel && (
            <div className="hd-sheet">
              <div className="hd-sheet-grab"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {sel.zone === 'general' ? 'General zone' : sel.zone}
                  </div>
                  <h3>{sel.id} · {sel.status === 'free' ? 'Available' : sel.status === 'booked' ? 'Booked' : sel.status}</h3>
                  <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Floor 2 · near window · two from your usual</div>
                </div>
                <span className={`hd-pill ${sel.status === 'free' ? 'green' : 'amber'}`}>
                  {sel.status === 'free' ? 'Available' : 'Booked'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="hd-pill navy"><I.Monitor style={{ width: 11, height: 11 }}/> Dual monitor</span>
                <span className="hd-pill navy"><I.Wifi style={{ width: 11, height: 11 }}/> Wi-Fi 6</span>
                <span className="hd-pill navy"><I.Sun style={{ width: 11, height: 11 }}/> Window seat</span>
              </div>

              <button className="hd-btn primary" disabled={sel.status !== 'free'} style={sel.status !== 'free' ? { opacity: 0.5 } : {}}>
                Book {sel.id} for Thu 7 May
              </button>
            </div>
          )}
        </div>
      </div>
      <TabBar active="map"/>
    </MobileFrame>
  );
}

// ─── 4. CONFIRMATION
function Screen_Confirm() {
  return (
    <MobileFrame>
      <div className="hd-mobile-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px 0' }}>
          <button style={{ background: 'transparent', border: 0, color: 'var(--csb-navy-700)', cursor: 'pointer', padding: 4, marginLeft: -4 }}>
            <I.ChevronLeft style={{ width: 22, height: 22 }}/>
          </button>
        </div>

        <div style={{ padding: '20px 24px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--csb-success-bg)', color: 'var(--csb-success)', margin: '0 auto', display: 'grid', placeItems: 'center' }}>
            <I.Check style={{ width: 32, height: 32 }}/>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: 'var(--csb-navy-800)', margin: '14px 0 4px', letterSpacing: '-0.02em' }}>
            You're all set
          </h2>
          <p style={{ fontSize: 14, color: 'var(--csb-ink-500)', margin: '0 auto', maxWidth: 280 }}>
            Desk 209 is yours for Thursday. We'll send a reminder the night before.
          </p>
        </div>

        {/* booking detail card */}
        <div className="hd-card" style={{ margin: '20px 16px 12px', padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Confirmed</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--csb-navy-800)', marginTop: 2 }}>Desk 209</div>
              <div style={{ fontSize: 13, color: 'var(--csb-ink-500)' }}>Floor 2 · General · near window</div>
            </div>
            <span className="hd-pill green">Booked</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12, paddingTop: 14, borderTop: '1px solid var(--csb-line)' }}>
            <div>
              <div style={{ color: 'var(--csb-ink-500)', marginBottom: 2 }}>When</div>
              <div style={{ fontWeight: 600, color: 'var(--csb-navy-800)', fontSize: 13 }}>Thu 7 May 2026</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--csb-ink-700)' }}>09:00 – 17:30</div>
            </div>
            <div>
              <div style={{ color: 'var(--csb-ink-500)', marginBottom: 2 }}>Building</div>
              <div style={{ fontWeight: 600, color: 'var(--csb-navy-800)', fontSize: 13 }}>Atrium HQ</div>
              <div className="hd-mono" style={{ fontFamily: 'var(--font-mono)', color: 'var(--csb-ink-700)', fontSize: 11 }}>Ref · BK-04F0-Z2</div>
            </div>
          </div>
        </div>

        {/* options */}
        <div style={{ padding: '4px 16px' }}>
          <button className="hd-card" style={{ display: 'flex', width: 'calc(100% - 0px)', margin: '0 0 8px', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
            <div className="hd-iconbox"><I.Calendar style={{ width: 18, height: 18 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Add to calendar</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Outlook · Google · Apple</div>
            </div>
            <I.ChevronRight style={{ width: 18, height: 18, color: 'var(--csb-ink-500)' }}/>
          </button>
          <button className="hd-card" style={{ display: 'flex', width: 'calc(100% - 0px)', margin: '0 0 8px', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
            <div className="hd-iconbox"><I.Users style={{ width: 18, height: 18 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Invite teammates to sit nearby</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>3 people opted in</div>
            </div>
            <I.ChevronRight style={{ width: 18, height: 18, color: 'var(--csb-ink-500)' }}/>
          </button>
          <button className="hd-card" style={{ display: 'flex', width: 'calc(100% - 0px)', margin: '0 0 8px', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
            <div className="hd-iconbox"><I.Repeat style={{ width: 18, height: 18 }}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--csb-navy-800)' }}>Make this a recurring booking</div>
              <div style={{ fontSize: 12, color: 'var(--csb-ink-500)' }}>Every Tuesday and Thursday</div>
            </div>
            <I.ChevronRight style={{ width: 18, height: 18, color: 'var(--csb-ink-500)' }}/>
          </button>
        </div>

        <div style={{ padding: '12px 16px 16px' }}>
          <button className="hd-btn primary">Done</button>
        </div>
      </div>
      <TabBar active="book"/>
    </MobileFrame>
  );
}

// ─── 5. CHECK-IN (with QR)
function Screen_CheckIn() {
  // Random-ish QR-style grid 21x21
  const qrCells = React.useMemo(() => {
    const cells = [];
    for (let i = 0; i < 21 * 21; i++) {
      const r = Math.floor(i / 21), c = i % 21;
      // finder patterns at 3 corners
      const inFinder = (
        (r < 7 && c < 7) ||
        (r < 7 && c > 13) ||
        (r > 13 && c < 7)
      );
      let on = false;
      if (inFinder) {
        const lr = r < 7 ? r : r - 14;
        const lc = c < 7 ? c : c - 14;
        on = (lr === 0 || lr === 6 || lc === 0 || lc === 6) ||
             (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        on = ((r * 13 + c * 7 + r * c) % 5 < 2);
      }
      cells.push(on);
    }
    return cells;
  }, []);
  return (
    <MobileFrame>
      <div className="hd-mobile-scroll" style={{ background: 'var(--csb-navy-900)', color: '#fff' }}>
        <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 0, color: '#fff', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
            <I.ChevronLeft style={{ width: 18, height: 18 }}/>
          </button>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Boarding pass</div>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: 0, color: '#fff', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
            <I.Download style={{ width: 16, height: 16 }}/>
          </button>
        </div>

        <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--csb-gold-400)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Today · Wed 30 Apr</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginTop: 6 }}>Desk 207</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>Floor 2 · General · 09:00 – 17:30</div>
        </div>

        {/* QR */}
        <div style={{ display: 'grid', placeItems: 'center', padding: '8px 16px 24px' }}>
          <div className="hd-qr">
            {qrCells.map((on, i) => <i key={i} style={{ background: on ? 'var(--csb-navy-900)' : 'transparent' }}/>)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 14 }}>Scan at desk to check in</div>
        </div>

        {/* OR row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }}/>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Or</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }}/>
        </div>

        <div style={{ padding: '0 16px' }}>
          <button className="hd-btn gold" style={{ marginBottom: 8 }}>
            <I.Check style={{ width: 18, height: 18 }}/> I'm here · check me in
          </button>
          <button className="hd-btn secondary" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
            My desk is taken
          </button>
        </div>

        <div style={{ padding: '20px 24px 12px', fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.5 }}>
          Auto check-in active — we'll mark you here when you connect to <span style={{ color: '#fff' }}>Acme-Office</span> Wi-Fi.
        </div>
      </div>
    </MobileFrame>
  );
}

window.HD_Mobile = { Screen_Home, Screen_Calendar, Screen_Map, Screen_Confirm, Screen_CheckIn };
