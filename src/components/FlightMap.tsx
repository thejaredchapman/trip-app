import React from 'react';
import { motion } from 'framer-motion';
import { TRAVELERS } from '../data/tripData';
import { useThemeColors } from '../hooks/useThemeColors';

const FlightMap: React.FC = () => {
  const c = useThemeColors();

  const routes = [
    { traveler: TRAVELERS[0], path: 'M 80 195 Q 200 120 380 170', label: 'LAX → LIS → LGW' },
    { traveler: TRAVELERS[1], path: 'M 160 160 Q 280 100 390 165', label: 'ORD → LHR' },
    { traveler: TRAVELERS[2], path: 'M 160 160 Q 250 80 300 100 Q 350 120 385 170', label: 'ORD → KEF → LGW' },
    { traveler: TRAVELERS[3], path: 'M 160 160 Q 250 80 300 100 Q 350 120 385 170', label: 'ORD → KEF → LGW' },
  ];

  const cities = [
    { name: 'LAX', x: 75, y: 198 },
    { name: 'ORD', x: 155, y: 163 },
    { name: 'KEF', x: 295, y: 95 },
    { name: 'LIS', x: 340, y: 190 },
    { name: 'LHR', x: 385, y: 160 },
    { name: 'LGW', x: 390, y: 172 },
  ];

  const gridStroke = c.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
  const dotFill = c.isDark ? '#fff' : '#1a1a2e';
  const pulseStroke = c.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        background: c.bgCard,
        borderRadius: 20,
        padding: '20px',
        border: `1px solid ${c.borderLight}`,
        marginBottom: 24,
        overflow: 'hidden',
      }}
    >
      <h3 style={{ color: c.textTertiary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 12px' }}>
        Flight Routes
      </h3>
      <svg viewBox="50 60 400 180" style={{ width: '100%', height: 'auto', maxHeight: 180 }}>
        {[80, 120, 160, 200].map((y) => (
          <line key={y} x1="50" y1={y} x2="450" y2={y} stroke={gridStroke} strokeWidth="0.5" />
        ))}
        {routes.map((route, i) => (
          <g key={i}>
            <motion.path
              d={route.path}
              fill="none"
              stroke={route.traveler.color}
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 0.5 + i * 0.3, duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.circle
              r="4"
              fill={route.traveler.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.5 + i * 0.3, duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <animateMotion dur="2s" repeatCount="indefinite" begin={`${0.5 + i * 0.3}s`} path={route.path} />
            </motion.circle>
          </g>
        ))}
        {cities.map((city) => (
          <g key={city.name}>
            <motion.circle cx={city.x} cy={city.y} r="4" fill={dotFill} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} />
            <motion.circle cx={city.x} cy={city.y} r="8" fill="none" stroke={pulseStroke} strokeWidth="1" initial={{ scale: 0 }} animate={{ scale: [1, 1.5, 1] }} transition={{ delay: 0.3, duration: 2, repeat: Infinity }} />
            <text x={city.x} y={city.y - 12} textAnchor="middle" fill={c.textTertiary} fontSize="9" fontWeight="600" fontFamily="monospace">
              {city.name}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        {TRAVELERS.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, background: t.color, borderRadius: 1 }} />
            <span style={{ color: c.textLabel, fontSize: 11 }}>{t.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FlightMap;
