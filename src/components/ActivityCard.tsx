import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '../data/tripData';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';
import MapPopup from './MapPopup';

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: '#e94560',
  food: '#f4a261',
  transport: '#4ecdc4',
  entertainment: '#9b59b6',
  shopping: '#ff6b6b',
  culture: '#3498db',
  nature: '#27ae60',
};

interface Props {
  activity: Activity;
  index: number;
  onUpdate: (updates: Partial<Activity>) => void;
  onRemove: () => void;
  dayColor: string;
}

const ActivityCard: React.FC<Props> = ({ activity, index, onUpdate, onRemove, dayColor }) => {
  const { canEdit } = useAuth();
  const c = useThemeColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(activity.title);
  const [editDesc, setEditDesc] = useState(activity.description || '');
  const [editTime, setEditTime] = useState(activity.time || '');
  const [showMap, setShowMap] = useState(false);
  const categoryColor = CATEGORY_COLORS[activity.category] || dayColor;

  const handleSave = () => {
    onUpdate({ title: editTitle, description: editDesc || undefined, time: editTime || undefined });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(activity.title);
    setEditDesc(activity.description || '');
    setEditTime(activity.time || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, height: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', damping: 25 }}
      whileHover={{ x: 4 }}
      style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: `1px solid ${c.borderLight}`, position: 'relative' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32, paddingTop: 2 }}>
        <motion.div whileHover={{ scale: 1.3 }} style={{ width: 12, height: 12, borderRadius: '50%', background: categoryColor, boxShadow: `0 0 10px ${categoryColor}50`, flexShrink: 0 }} />
        <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${categoryColor}30, transparent)`, marginTop: 4 }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                {activity.time && (
                  <span style={{ fontSize: 11, color: categoryColor, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5 }}>
                    {activity.time}
                  </span>
                )}
                <span style={{ fontSize: 8, color: c.textFaint, textTransform: 'uppercase', letterSpacing: 1, background: `${categoryColor}15`, padding: '2px 6px', borderRadius: 4 }}>
                  {activity.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{activity.icon}</span>
                <h4 style={{ color: c.text, margin: 0, fontSize: 15, fontWeight: 600 }}>{activity.title}</h4>
              </div>

              {activity.description && (
                <p style={{ color: c.textTertiary, fontSize: 13, margin: '4px 0 0 28px', lineHeight: 1.4 }}>
                  {activity.description}
                </p>
              )}

              {activity.contact && (
                <div style={{ margin: '6px 0 0 28px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {activity.contact.phone && (
                    <a href={`tel:${activity.contact.phone}`} onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${categoryColor}10`, border: `1px solid ${categoryColor}25`, borderRadius: 8, padding: '3px 10px', color: categoryColor, fontSize: 11, fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s' }}>
                      <span style={{ fontSize: 12 }}>📞</span> {activity.contact.phone}
                    </a>
                  )}
                  {activity.contact.url && (
                    <a href={activity.contact.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${categoryColor}10`, border: `1px solid ${categoryColor}25`, borderRadius: 8, padding: '3px 10px', color: categoryColor, fontSize: 11, fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s' }}>
                      <span style={{ fontSize: 12 }}>🔗</span> Website
                    </a>
                  )}
                  {activity.contact.address && (
                    <button onClick={(e) => { e.stopPropagation(); setShowMap(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${categoryColor}10`, border: `1px solid ${categoryColor}25`, borderRadius: 8, padding: '3px 10px', color: categoryColor, fontSize: 11, fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <span style={{ fontSize: 12 }}>📍</span> {activity.contact.address}
                    </button>
                  )}
                </div>
              )}

              {canEdit && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 28 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(true)} style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 8, padding: '4px 12px', color: c.textTertiary, fontSize: 11, cursor: 'pointer' }}>
                    Edit
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRemove} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 8, padding: '4px 12px', color: '#e74c3c', fontSize: 11, cursor: 'pointer' }}>
                    Remove
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={editTime} onChange={(e) => setEditTime(e.target.value)} placeholder="Time (e.g. 9:00 AM)" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 12px', color: c.text, fontSize: 13, outline: 'none', width: '50%' }} />
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Activity title" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 12px', color: c.text, fontSize: 14, fontWeight: 600, outline: 'none' }} />
                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description (optional)" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 12px', color: c.text, fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} style={{ background: `linear-gradient(135deg, ${dayColor}, ${dayColor}cc)`, border: 'none', borderRadius: 8, padding: '8px 20px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Save
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 8, padding: '8px 20px', color: c.textSecondary, fontSize: 12, cursor: 'pointer' }}>
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activity.contact?.address && (
        <MapPopup
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          address={activity.contact.address}
        />
      )}
    </motion.div>
  );
};

export default ActivityCard;
