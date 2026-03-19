import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';

const TRIP_DATE = new Date('2026-05-18T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownHeader: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTripTime, setIsTripTime] = useState(false);
  const c = useThemeColors();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = TRIP_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setIsTripTime(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="countdown-wrapper" style={{ textAlign: 'center', padding: '16px 0 10px' }}>
      {isTripTime ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            background: 'linear-gradient(135deg, #e94560, #f4a261)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          THE ADVENTURE IS LIVE!
        </motion.div>
      ) : (
        <>
          <p style={{ color: c.textLabel, fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, margin: '0 0 10px' }}>
            Countdown to takeoff
          </p>
          <div className="countdown-units" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {units.map((u, i) => (
              <motion.div
                key={u.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="countdown-unit"
                style={{
                  background: c.bgSubtle,
                  border: `1px solid ${c.borderLight}`,
                  borderRadius: 12,
                  padding: '10px 12px',
                  minWidth: 56,
                }}
              >
                <motion.span
                  key={u.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{
                    display: 'block',
                    fontSize: 24,
                    fontWeight: 800,
                    color: c.text,
                    fontFamily: 'monospace',
                  }}
                >
                  {String(u.value).padStart(2, '0')}
                </motion.span>
                <span style={{ color: c.textFaint, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {u.label}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountdownHeader;
