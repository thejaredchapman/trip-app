import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAVELERS, EMERGENCY_INFO, Traveler } from '../data/tripData';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';

const EmergencyInfo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const c = useThemeColors();
  const [expandedTraveler, setExpandedTraveler] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(EMERGENCY_INFO[0]?.city || null);

  const toggleTraveler = (id: string) => {
    setExpandedTraveler(expandedTraveler === id ? null : id);
  };

  const toggleCity = (city: string) => {
    setExpandedCity(expandedCity === city ? null : city);
  };

  return (
    <div>
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Emergency Information
      </motion.h2>
      <motion.p
        className="section-subheading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Save these numbers offline before you travel — you never know when you'll need them
      </motion.p>

      {/* Quick Dial Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8, marginBottom: 28 }}
      >
        {[
          { label: 'EU Emergency', number: '112', color: '#e94560', icon: '🆘' },
          { label: 'UK Emergency', number: '999', color: '#e94560', icon: '🇬🇧' },
          { label: 'France Ambulance', number: '15', color: '#3498db', icon: '🚑' },
          { label: 'France Police', number: '17', color: '#2b5797', icon: '👮' },
          { label: 'France Fire', number: '18', color: '#e67e22', icon: '🚒' },
          { label: 'US Embassy UK', number: '+44-20-7499-9000', color: '#22853a', icon: '🏛️' },
        ].map((item, i) => (
          <motion.a
            key={item.label}
            href={`tel:${item.number}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `${item.color}15`,
              border: `1px solid ${item.color}30`,
              borderRadius: 16,
              padding: '16px 12px',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ color: item.color, fontSize: 20, fontWeight: 800, fontFamily: 'monospace' }}>
              {item.number}
            </span>
            <span style={{ color: c.textTertiary, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {item.label}
            </span>
          </motion.a>
        ))}
      </motion.div>

      {/* City Emergency Details */}
      <h3 className="section-title" style={{ marginTop: 8 }}>Hospitals & Local Emergency Info</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {EMERGENCY_INFO.map((city, ci) => (
          <motion.div
            key={city.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + ci * 0.1 }}
            style={{
              background: c.bgCard,
              border: `1px solid ${c.borderLight}`,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <motion.button
              onClick={() => toggleCity(city.city)}
              whileHover={{ backgroundColor: c.bgHover }}
              style={{
                width: '100%',
                padding: '18px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{city.flag}</span>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: c.text, margin: 0, fontSize: 16, fontWeight: 700 }}>{city.city}</h4>
                  <p style={{ color: c.textTertiary, margin: '2px 0 0', fontSize: 12 }}>
                    Emergency: {city.generalEmergency}
                  </p>
                </div>
              </div>
              <motion.span
                animate={{ rotate: expandedCity === city.city ? 180 : 0 }}
                style={{ color: c.textMuted, fontSize: 18 }}
              >
                ▾
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {expandedCity === city.city && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 20px 20px' }}>
                    {/* Emergency Numbers Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6, marginBottom: 14 }}>
                      {[
                        { label: 'Police', number: city.police, color: '#2b5797' },
                        { label: 'Ambulance', number: city.ambulance, color: '#e94560' },
                        { label: 'Fire', number: city.fire, color: '#e67e22' },
                        { label: 'General', number: city.generalEmergency, color: '#22853a' },
                        ...(city.poisonControl ? [{ label: 'Poison Control', number: city.poisonControl, color: '#9b59b6' }] : []),
                      ].map((num) => (
                        <a
                          key={num.label}
                          href={`tel:${num.number.split(' ')[0]}`}
                          style={{
                            background: `${num.color}10`,
                            border: `1px solid ${num.color}25`,
                            borderRadius: 12,
                            padding: '10px 12px',
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <span style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{num.label}</span>
                          <span style={{ color: num.color, fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>{num.number}</span>
                        </a>
                      ))}
                    </div>

                    {/* Embassy */}
                    <div style={{ background: c.bgSubtle, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                      <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>U.S. Embassy</p>
                      <p style={{ color: c.text, fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>{city.embassy.name}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <a href={`tel:${city.embassy.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#22853a15', border: '1px solid #22853a30', borderRadius: 8, padding: '3px 10px', color: '#22853a', fontSize: 11, textDecoration: 'none' }}>
                          📞 {city.embassy.phone}
                        </a>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(city.embassy.address)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#3498db15', border: '1px solid #3498db30', borderRadius: 8, padding: '3px 10px', color: '#3498db', fontSize: 11, textDecoration: 'none' }}>
                          📍 {city.embassy.address}
                        </a>
                      </div>
                    </div>

                    {/* Hospitals */}
                    <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>Nearest Hospitals</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {city.hospitals.map((hospital) => (
                        <div
                          key={hospital.name}
                          style={{
                            background: c.bgSubtle,
                            border: `1px solid ${c.borderLight}`,
                            borderRadius: 14,
                            padding: '14px 16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>🏥</span>
                            <div>
                              <h5 style={{ color: c.text, margin: 0, fontSize: 14, fontWeight: 600 }}>{hospital.name}</h5>
                              {hospital.notes && (
                                <p style={{ color: c.textTertiary, margin: '3px 0 0', fontSize: 12, lineHeight: 1.4 }}>{hospital.notes}</p>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 30 }}>
                            <a href={`tel:${hospital.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e9456015', border: '1px solid #e9456030', borderRadius: 8, padding: '3px 10px', color: '#e94560', fontSize: 11, textDecoration: 'none' }}>
                              📞 {hospital.phone}
                            </a>
                            {hospital.erPhone && hospital.erPhone !== hospital.phone && (
                              <a href={`tel:${hospital.erPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#c0392b15', border: '1px solid #c0392b30', borderRadius: 8, padding: '3px 10px', color: '#c0392b', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                                🚨 ER: {hospital.erPhone}
                              </a>
                            )}
                            <a href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#3498db15', border: '1px solid #3498db30', borderRadius: 8, padding: '3px 10px', color: '#3498db', fontSize: 11, textDecoration: 'none' }}>
                              📍 Directions
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    {city.tips.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Good to Know</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {city.tips.map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <span style={{ color: '#f4a261', fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                              <p style={{ color: c.textSecondary, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Traveler Profiles */}
      <h3 className="section-title">Traveler Emergency Profiles</h3>

      {!isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(233,69,96,0.08)',
            border: '1px solid rgba(233,69,96,0.2)',
            borderRadius: 16,
            padding: '24px 20px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>🔒</span>
          <p style={{ color: c.text, fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>
            Sign in to view health & emergency contact info
          </p>
          <p style={{ color: c.textTertiary, fontSize: 13, margin: 0 }}>
            This sensitive information is only visible to trip members
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TRAVELERS.map((traveler: Traveler, ti: number) => (
            <motion.div
              key={traveler.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ti * 0.08 }}
              style={{
                background: `${traveler.color}08`,
                border: `1px solid ${traveler.color}25`,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <motion.button
                onClick={() => toggleTraveler(traveler.id)}
                whileHover={{ backgroundColor: `${traveler.color}12` }}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${traveler.color}, ${traveler.colorLight})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 15,
                      boxShadow: `0 3px 12px ${traveler.color}30`,
                    }}
                  >
                    {traveler.avatarInitials}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: c.text, margin: 0, fontSize: 15, fontWeight: 700 }}>{traveler.name}</h4>
                    <p style={{ color: c.textTertiary, margin: '2px 0 0', fontSize: 12 }}>
                      Emergency Contact & Health Profile
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: expandedTraveler === traveler.id ? 180 : 0 }}
                  style={{ color: c.textMuted, fontSize: 18 }}
                >
                  ▾
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {expandedTraveler === traveler.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px' }}>
                      {/* Emergency Contact */}
                      <div style={{ background: c.bgSubtle, borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                        <p style={{ color: traveler.colorLight, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, margin: '0 0 10px' }}>
                          Emergency Contact
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Name</p>
                            <p style={{ color: c.text, fontSize: 13, fontWeight: 600, margin: '3px 0 0' }}>{traveler.emergencyContact.name}</p>
                          </div>
                          <div>
                            <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>Relationship</p>
                            <p style={{ color: c.text, fontSize: 13, fontWeight: 600, margin: '3px 0 0' }}>{traveler.emergencyContact.relationship}</p>
                          </div>
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          <a href={`tel:${traveler.emergencyContact.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${traveler.color}15`, border: `1px solid ${traveler.color}30`, borderRadius: 8, padding: '4px 12px', color: traveler.colorLight, fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
                            📞 {traveler.emergencyContact.phone}
                          </a>
                          {traveler.emergencyContact.email && (
                            <a href={`mailto:${traveler.emergencyContact.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${traveler.color}15`, border: `1px solid ${traveler.color}30`, borderRadius: 8, padding: '4px 12px', color: traveler.colorLight, fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
                              ✉️ {traveler.emergencyContact.email}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Health Profile */}
                      <div style={{ background: c.bgSubtle, borderRadius: 14, padding: '14px 16px' }}>
                        <p style={{ color: traveler.colorLight, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, margin: '0 0 10px' }}>
                          Health Profile
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <InfoField label="Blood Type" value={traveler.healthProfile.bloodType} color={c} />
                          <InfoField label="Insurance" value={traveler.healthProfile.insuranceProvider} color={c} />
                          <InfoField label="Policy #" value={traveler.healthProfile.insurancePolicyNumber} color={c} />
                          <InfoField label="Doctor" value={traveler.healthProfile.doctorName} color={c} />
                        </div>
                        {traveler.healthProfile.doctorPhone && (
                          <a href={`tel:${traveler.healthProfile.doctorPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${traveler.color}15`, border: `1px solid ${traveler.color}30`, borderRadius: 8, padding: '3px 10px', color: traveler.colorLight, fontSize: 11, textDecoration: 'none', marginTop: 8 }}>
                            📞 Dr: {traveler.healthProfile.doctorPhone}
                          </a>
                        )}

                        {traveler.healthProfile.allergies && traveler.healthProfile.allergies.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: '0 0 4px' }}>Allergies</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {traveler.healthProfile.allergies.map((a) => (
                                <span key={a} style={{ background: '#e9456015', border: '1px solid #e9456030', borderRadius: 8, padding: '3px 10px', color: '#e94560', fontSize: 11, fontWeight: 600 }}>
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {traveler.healthProfile.medications && traveler.healthProfile.medications.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: '0 0 4px' }}>Medications</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {traveler.healthProfile.medications.map((m) => (
                                <span key={m} style={{ background: '#3498db15', border: '1px solid #3498db30', borderRadius: 8, padding: '3px 10px', color: '#3498db', fontSize: 11, fontWeight: 600 }}>
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {traveler.healthProfile.conditions && traveler.healthProfile.conditions.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: '0 0 4px' }}>Conditions</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {traveler.healthProfile.conditions.map((cond) => (
                                <span key={cond} style={{ background: '#f4a26115', border: '1px solid #f4a26130', borderRadius: 8, padding: '3px 10px', color: '#f4a261', fontSize: 11, fontWeight: 600 }}>
                                  {cond}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {traveler.healthProfile.notes && (
                          <div style={{ marginTop: 10, background: 'rgba(243,156,18,0.08)', borderRadius: 8, padding: '8px 12px' }}>
                            <p style={{ color: '#f39c12', fontSize: 12, margin: 0, fontStyle: 'italic' }}>
                              {traveler.healthProfile.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoField: React.FC<{ label: string; value?: string; color: ReturnType<typeof useThemeColors> }> = ({ label, value, color: c }) => {
  if (!value) return null;
  return (
    <div>
      <p style={{ color: c.textLabel, fontSize: 10, textTransform: 'uppercase', margin: 0 }}>{label}</p>
      <p style={{ color: c.text, fontSize: 13, fontWeight: 500, margin: '3px 0 0' }}>{value}</p>
    </div>
  );
};

export default EmergencyInfo;
