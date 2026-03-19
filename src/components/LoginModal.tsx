import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAVELERS } from '../data/tripData';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const c = useThemeColors();
  const [selectedTraveler, setSelectedTraveler] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraveler || !code) {
      setError('Please select your name and enter your confirmation code');
      return;
    }
    const success = login(selectedTraveler, code);
    if (success) {
      setCode('');
      setError('');
      onClose();
    } else {
      setError('Invalid confirmation code. Use your airline booking code.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: c.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={shake ? { scale: 1, y: 0, opacity: 1, x: [0, -10, 10, -10, 10, 0] } : { scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: c.modalBg,
              borderRadius: 20,
              padding: 'clamp(20px, 5vw, 40px)',
              width: '92%',
              maxWidth: 420,
              border: `1px solid ${c.border}`,
              boxShadow: c.modalShadow,
            }}
          >
            <h2 style={{ color: c.text, margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>
              Welcome, Traveler
            </h2>
            <p style={{ color: c.textTertiary, margin: '0 0 20px', fontSize: 13 }}>
              Sign in with your name and airline confirmation code to edit the itinerary.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: c.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Who are you?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  {TRAVELERS.map((t) => (
                    <motion.button
                      key={t.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedTraveler(t.id); setError(''); }}
                      style={{
                        background: selectedTraveler === t.id
                          ? `linear-gradient(135deg, ${t.color}, ${t.colorLight})`
                          : c.bgInput,
                        border: selectedTraveler === t.id
                          ? `2px solid ${t.colorLight}`
                          : `2px solid ${c.border}`,
                        borderRadius: 14,
                        padding: '14px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: selectedTraveler === t.id ? 'rgba(255,255,255,0.2)' : t.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {t.avatarInitials}
                      </span>
                      <span style={{
                        color: selectedTraveler === t.id ? '#fff' : c.text,
                        fontSize: 13,
                        fontWeight: selectedTraveler === t.id ? 600 : 400,
                        textAlign: 'left',
                      }}>
                        {t.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ color: c.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Confirmation Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="e.g. CSOUCC"
                  maxLength={10}
                  style={{
                    width: '100%',
                    marginTop: 10,
                    padding: '14px 16px',
                    background: c.bgInput,
                    border: `2px solid ${c.border}`,
                    borderRadius: 12,
                    color: c.text,
                    fontSize: 16,
                    fontFamily: 'monospace',
                    letterSpacing: 4,
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ color: '#e74c3c', fontSize: 13, marginBottom: 16 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(233,69,96,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: selectedTraveler
                    ? `linear-gradient(135deg, ${TRAVELERS.find(t => t.id === selectedTraveler)?.color || '#e94560'}, ${TRAVELERS.find(t => t.id === selectedTraveler)?.colorLight || '#e94560'})`
                    : 'linear-gradient(135deg, #e94560, #ff6b6b)',
                  border: 'none',
                  borderRadius: 14,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                }}
              >
                Unlock Itinerary
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
