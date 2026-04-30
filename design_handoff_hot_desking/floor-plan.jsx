// FloorPlan.jsx - reusable interactive floor plan SVG

// Sample desk layout: zones, desks with status
const FLOOR_DATA = {
  zones: [
    { id: 'quiet', name: 'Quiet', x: 20, y: 20, w: 220, h: 160, fill: '#EEF2F8', label: 'Quiet zone' },
    { id: 'collab', name: 'Collab', x: 260, y: 20, w: 200, h: 160, fill: '#DFF3F1', label: 'Collaboration' },
    { id: 'general', name: 'General', x: 20, y: 200, w: 280, h: 180, fill: '#F6F8FB', label: 'General' },
    { id: 'phone', name: 'Phone booths', x: 320, y: 200, w: 140, h: 90, fill: '#F3E2EE', label: 'Phone' },
    { id: 'focus', name: 'Focus', x: 320, y: 300, w: 140, h: 80, fill: '#FFF8E8', label: 'Focus' },
  ],
  // amenities/landmarks
  rooms: [
    { x: 20, y: 400, w: 100, h: 60, label: 'Kitchen', icon: 'coffee' },
    { x: 130, y: 400, w: 90, h: 60, label: 'WC', icon: null },
    { x: 230, y: 400, w: 110, h: 60, label: 'Reception', icon: null },
    { x: 350, y: 400, w: 110, h: 60, label: 'Lift', icon: null },
  ],
  desks: [
    // zone, status: free/booked/yours/oos, label
    // Quiet zone (top-left)
    { id: 'D-301', x: 50, y: 60, status: 'free', zone: 'quiet' },
    { id: 'D-302', x: 95, y: 60, status: 'booked', zone: 'quiet' },
    { id: 'D-303', x: 140, y: 60, status: 'free', zone: 'quiet' },
    { id: 'D-304', x: 185, y: 60, status: 'booked', zone: 'quiet' },
    { id: 'D-305', x: 50, y: 130, status: 'booked', zone: 'quiet' },
    { id: 'D-306', x: 95, y: 130, status: 'free', zone: 'quiet' },
    { id: 'D-307', x: 140, y: 130, status: 'free', zone: 'quiet', accessible: true },
    { id: 'D-308', x: 185, y: 130, status: 'oos', zone: 'quiet' },

    // Collab
    { id: 'D-401', x: 290, y: 60, status: 'booked', zone: 'collab' },
    { id: 'D-402', x: 335, y: 60, status: 'booked', zone: 'collab' },
    { id: 'D-403', x: 385, y: 60, status: 'free', zone: 'collab' },
    { id: 'D-404', x: 430, y: 60, status: 'team', zone: 'collab' },
    { id: 'D-405', x: 290, y: 130, status: 'team', zone: 'collab' },
    { id: 'D-406', x: 335, y: 60 + 70, status: 'team', zone: 'collab' },
    { id: 'D-407', x: 385, y: 130, status: 'free', zone: 'collab' },
    { id: 'D-408', x: 430, y: 130, status: 'booked', zone: 'collab' },

    // General (your desk in here)
    { id: 'D-201', x: 50, y: 240, status: 'free', zone: 'general' },
    { id: 'D-202', x: 95, y: 240, status: 'free', zone: 'general' },
    { id: 'D-203', x: 140, y: 240, status: 'booked', zone: 'general' },
    { id: 'D-204', x: 185, y: 240, status: 'free', zone: 'general' },
    { id: 'D-205', x: 230, y: 240, status: 'booked', zone: 'general' },
    { id: 'D-206', x: 50, y: 310, status: 'booked', zone: 'general' },
    { id: 'D-207', x: 95, y: 310, status: 'yours', zone: 'general' },
    { id: 'D-208', x: 140, y: 310, status: 'free', zone: 'general' },
    { id: 'D-209', x: 185, y: 310, status: 'free', zone: 'general' },
    { id: 'D-210', x: 230, y: 310, status: 'booked', zone: 'general' },

    // Phone booths
    { id: 'PB-1', x: 350, y: 230, status: 'free', zone: 'phone', mini: true },
    { id: 'PB-2', x: 395, y: 230, status: 'booked', zone: 'phone', mini: true },
    { id: 'PB-3', x: 440, y: 230, status: 'free', zone: 'phone', mini: true },

    // Focus pods
    { id: 'F-1', x: 360, y: 330, status: 'booked', zone: 'focus', mini: true },
    { id: 'F-2', x: 410, y: 330, status: 'free', zone: 'focus', mini: true },
  ],
};

const STATUS_FILL = {
  free: '#fff',
  booked: '#D9E0EA',
  yours: '#0A2A4E',
  team: '#E8A93B',
  oos: '#F5F8FC',
};
const STATUS_STROKE = {
  free: '#1FA39B',
  booked: '#B8C3D3',
  yours: '#0A2A4E',
  team: '#B07A1E',
  oos: '#D9E0EA',
};

function FloorPlanSVG({ selectedId, onSelect, mode = 'mobile', showHeat = false, viewBox = '0 0 480 470' }) {
  return (
    <svg viewBox={viewBox} className="hd-floor-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,42,78,0.04)" strokeWidth="1"/>
        </pattern>
        <pattern id="oosPattern" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#B8C3D3" strokeWidth="2"/>
        </pattern>
      </defs>

      {/* floor background */}
      <rect x="0" y="0" width="480" height="470" fill="#fff"/>
      <rect x="0" y="0" width="480" height="470" fill="url(#grid)"/>

      {/* zones */}
      {FLOOR_DATA.zones.map(z => (
        <g key={z.id}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="6" fill={z.fill} stroke="rgba(10,42,78,0.08)"/>
          <text x={z.x + 10} y={z.y + 18} fontSize="10" fontWeight="600" fill="rgba(10,42,78,0.55)" letterSpacing="0.06em" style={{ textTransform: 'uppercase' }}>
            {z.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* rooms (kitchen / wc / reception / lift) */}
      {FLOOR_DATA.rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="4" fill="#F6F8FB" stroke="rgba(10,42,78,0.12)"/>
          <text x={r.x + r.w/2} y={r.y + r.h/2 + 4} fontSize="10" fontWeight="600" fill="rgba(10,42,78,0.55)" textAnchor="middle">
            {r.label}
          </text>
        </g>
      ))}

      {/* desks */}
      {FLOOR_DATA.desks.map(d => {
        const size = d.mini ? 22 : 32;
        const isSelected = selectedId === d.id;
        const fill = STATUS_FILL[d.status];
        const stroke = isSelected ? '#B07A1E' : STATUS_STROKE[d.status];
        const useFill = d.status === 'oos' ? 'url(#oosPattern)' : fill;
        return (
          <g key={d.id} className="desk-tile" onClick={() => onSelect && onSelect(d)}>
            <rect
              x={d.x} y={d.y}
              width={size} height={size}
              rx="5"
              fill={useFill}
              stroke={stroke}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {d.status === 'yours' && (
              <text x={d.x + size/2} y={d.y + size/2 + 3} fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle">YOU</text>
            )}
            {d.status === 'team' && (
              <circle cx={d.x + size/2} cy={d.y + size/2} r={3} fill="#fff"/>
            )}
            {d.accessible && d.status === 'free' && (
              <circle cx={d.x + size - 5} cy={d.y + 5} r={3} fill="#1FA39B"/>
            )}
            {isSelected && (
              <rect
                x={d.x - 4} y={d.y - 4}
                width={size + 8} height={size + 8}
                rx="8"
                fill="none" stroke="#E8A93B" strokeWidth="2"
                strokeDasharray="3 3"
              />
            )}
          </g>
        );
      })}

      {/* compass */}
      <g transform="translate(440, 430)">
        <circle r="14" fill="#fff" stroke="rgba(10,42,78,0.15)"/>
        <path d="M 0 -8 L 3 4 L 0 1 L -3 4 Z" fill="#0A2A4E"/>
        <text y="-16" fontSize="8" fontWeight="700" fill="rgba(10,42,78,0.55)" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

window.FloorPlanSVG = FloorPlanSVG;
window.FLOOR_DATA = FLOOR_DATA;
