import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Traveler } from '../data/tripData';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  traveler: Traveler;
  index: number;
}

const TravelerCard: React.FC<Props> = ({ traveler, index }) => {
  const [flipped, setFlipped] = useState(false);
  const c = useThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 20 }}
      style={{ perspective: 1000, cursor: 'pointer' }}
      onClick={() => setFlipped(!flipped)}
    >
      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `linear-gradient(145deg, ${traveler.color}22, ${traveler.color}11)`,
              border: `1px solid ${traveler.color}44`,
              borderRadius: 20,
              padding: '24px 20px',
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${traveler.color}30 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${traveler.color}, ${traveler.colorLight})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: `0 4px 20px ${traveler.color}40`,
                }}
              >
                {traveler.avatarInitials}
              </motion.div>
              <div>
                <h3 style={{ color: c.text, margin: 0, fontSize: 15, fontWeight: 700 }}>{traveler.name}</h3>
                <p style={{ color: c.textTertiary, margin: '2px 0 0', fontSize: 12 }}>
                  {traveler.airline} {traveler.emoji}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: c.bgSubtle, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                  Arrives
                </p>
                <p style={{ color: c.text, fontSize: 14, fontWeight: 600, margin: '4px 0 0' }}>
                  {traveler.arrivalTime}
                </p>
                <p style={{ color: c.textTertiary, fontSize: 11, margin: '2px 0 0' }}>
                  {traveler.arrivalAirport}
                </p>
              </div>
              <div style={{ background: c.bgSubtle, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                  Days
                </p>
                <p style={{ color: traveler.colorLight, fontSize: 24, fontWeight: 800, margin: '2px 0 0' }}>
                  {traveler.totalDays}
                </p>
              </div>
            </div>

            <p style={{ color: c.textFaint, fontSize: 10, textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
              tap to flip for flight details
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `linear-gradient(145deg, ${traveler.color}33, ${traveler.color}15)`,
              border: `1px solid ${traveler.color}55`,
              borderRadius: 20,
              padding: '24px 20px',
              minHeight: 200,
              backdropFilter: 'blur(10px)',
            }}
          >
            <h4 style={{ color: traveler.colorLight, margin: '0 0 16px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
              Flight Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Outbound</p>
                <p style={{ color: c.text, fontSize: 13, margin: '4px 0 0', fontFamily: 'monospace' }}>{traveler.routeOut}</p>
              </div>
              <div>
                <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Return</p>
                <p style={{ color: c.text, fontSize: 13, margin: '4px 0 0', fontFamily: 'monospace' }}>{traveler.routeReturn}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Conf Code</p>
                  <p style={{ color: traveler.colorLight, fontSize: 16, fontWeight: 700, margin: '4px 0 0', fontFamily: 'monospace' }}>
                    {traveler.confirmationCode}
                  </p>
                </div>
                {traveler.returnConfirmationCode && (
                  <div>
                    <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Return Conf</p>
                    <p style={{ color: traveler.colorLight, fontSize: 16, fontWeight: 700, margin: '4px 0 0', fontFamily: 'monospace' }}>
                      {traveler.returnConfirmationCode}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Departs</p>
                <p style={{ color: c.text, fontSize: 13, margin: '4px 0 0' }}>{traveler.departureDetails}</p>
              </div>
              {traveler.soloDays && (
                <div>
                  <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Solo Days</p>
                  <p style={{ color: c.text, fontSize: 13, margin: '4px 0 0' }}>{traveler.soloDays}</p>
                </div>
              )}
              {traveler.airlineContact && (
                <div style={{ marginTop: 4, paddingTop: 10, borderTop: `1px solid ${traveler.color}30` }}>
                  <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: '0 0 6px' }}>Airline Contact</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {traveler.airlineContact.phone && (
                      <a href={`tel:${traveler.airlineContact.phone}`} onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${traveler.color}20`, border: `1px solid ${traveler.color}35`, borderRadius: 8, padding: '4px 10px', color: traveler.colorLight, fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
                        📞 {traveler.airlineContact.phone}
                      </a>
                    )}
                    {traveler.airlineContact.url && (
                      <a href={traveler.airlineContact.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${traveler.color}20`, border: `1px solid ${traveler.color}35`, borderRadius: 8, padding: '4px 10px', color: traveler.colorLight, fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
                        🔗 Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p style={{ color: c.textFaint, fontSize: 10, textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
              tap to flip back
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TravelerCard;
