import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAVELERS, Activity } from '../data/tripData';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';
import ActivityCard from './ActivityCard';

interface Props {
  dayIndex: number;
}

const CATEGORY_OPTIONS: Activity['category'][] = ['sightseeing', 'food', 'transport', 'entertainment', 'shopping', 'culture', 'nature'];
const EMOJI_MAP: Record<string, string> = {
  sightseeing: '🏛️', food: '🍽️', transport: '🚕', entertainment: '🎭', shopping: '🛍️', culture: '🎨', nature: '🌳',
};

const DayDetail: React.FC<Props> = ({ dayIndex }) => {
  const { days, updateActivity, removeActivity, addActivity, updateAccommodation, updateNotes } = useTrip();
  const { canEdit } = useAuth();
  const c = useThemeColors();
  const day = days[dayIndex];
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Activity['category']>('sightseeing');
  const [editingAccom, setEditingAccom] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [accomValue, setAccomValue] = useState(day.accommodation || '');
  const [notesValue, setNotesValue] = useState(day.notes || '');

  if (!day) return null;

  const presentTravelers = TRAVELERS.filter((t) => t.presentDays.includes(day.day));
  const isParis = day.city.toLowerCase().includes('paris');
  const cityColor = isParis ? '#f4a261' : '#e94560';
  const cityFlag = isParis ? '🇫🇷' : '🇬🇧';

  const handleAddActivity = () => {
    if (!newTitle.trim()) return;
    addActivity(dayIndex, {
      time: newTime || undefined,
      title: newTitle,
      description: newDesc || undefined,
      icon: EMOJI_MAP[newCategory] || '📌',
      category: newCategory,
    });
    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <motion.div
      key={dayIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* Day Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${cityColor}15, transparent)`,
          borderRadius: 20,
          padding: '20px 16px 16px',
          marginBottom: 16,
          border: `1px solid ${cityColor}20`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -20, fontSize: 80, opacity: 0.04, pointerEvents: 'none', lineHeight: 1 }}>
          {cityFlag}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'inline-block', background: `${cityColor}20`, color: cityColor, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}
            >
              Day {day.day} {cityFlag}
            </motion.span>
            <h2 style={{ color: c.text, margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>
              {day.subtitle}
            </h2>
            <p style={{ color: c.textTertiary, margin: 0, fontSize: 14 }}>
              {day.date} &middot; {day.city}
            </p>
          </div>

          <div style={{ display: 'flex', gap: -8, alignItems: 'center' }}>
            {presentTravelers.length === 0 ? (
              <span style={{ color: c.textFaint, fontSize: 13, fontStyle: 'italic' }}>No arrivals yet</span>
            ) : (
              <div style={{ display: 'flex' }}>
                {presentTravelers.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    title={t.name}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, ${t.colorLight})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 10,
                      border: `2px solid ${c.avatarBorder}`,
                      marginLeft: i > 0 ? -8 : 0,
                      zIndex: presentTravelers.length - i,
                      boxShadow: `0 2px 8px ${t.color}40`,
                    }}
                  >
                    {t.avatarInitials}
                  </motion.div>
                ))}
                <span style={{ color: c.textTertiary, fontSize: 12, marginLeft: 10, alignSelf: 'center' }}>
                  {presentTravelers.length} traveler{presentTravelers.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Accommodation */}
        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {day.accommodation && (
            <div style={{ background: c.bgSubtle, borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🏨</span>
              {editingAccom && canEdit ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    value={accomValue}
                    onChange={(e) => setAccomValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { updateAccommodation(dayIndex, accomValue); setEditingAccom(false); } }}
                    style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 6, padding: '4px 8px', color: c.text, fontSize: 12, outline: 'none', width: '100%', maxWidth: 200 }}
                    autoFocus
                  />
                  <button onClick={() => { updateAccommodation(dayIndex, accomValue); setEditingAccom(false); }} style={{ background: cityColor, border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 11, cursor: 'pointer' }}>Save</button>
                </div>
              ) : (
                <span style={{ color: c.textSecondary, fontSize: 13, cursor: canEdit ? 'pointer' : 'default' }} onClick={() => canEdit && setEditingAccom(true)}>
                  {day.accommodation}
                  {canEdit && <span style={{ color: c.textFaint, marginLeft: 6, fontSize: 10 }}>click to edit</span>}
                </span>
              )}
              {day.accommodationContact && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, marginLeft: 24 }}>
                  {day.accommodationContact.phone && (
                    <a href={`tel:${day.accommodationContact.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${cityColor}10`, border: `1px solid ${cityColor}25`, borderRadius: 8, padding: '3px 10px', color: cityColor, fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
                      📞 {day.accommodationContact.phone}
                    </a>
                  )}
                  {day.accommodationContact.url && (
                    <a href={day.accommodationContact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${cityColor}10`, border: `1px solid ${cityColor}25`, borderRadius: 8, padding: '3px 10px', color: cityColor, fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
                      🔗 Website
                    </a>
                  )}
                  {day.accommodationContact.address && (
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(day.accommodationContact.address)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${cityColor}10`, border: `1px solid ${cityColor}25`, borderRadius: 8, padding: '3px 10px', color: cityColor, fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
                      📍 Map
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {(day.notes || canEdit) && (
          <div style={{ marginTop: 10 }}>
            {editingNotes && canEdit ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { updateNotes(dayIndex, notesValue); setEditingNotes(false); } }}
                  placeholder="Add a note for this day..."
                  style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 12px', color: c.text, fontSize: 13, outline: 'none', flex: 1 }}
                  autoFocus
                />
                <button onClick={() => { updateNotes(dayIndex, notesValue); setEditingNotes(false); }} style={{ background: cityColor, border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Save</button>
              </div>
            ) : day.notes ? (
              <p
                style={{ color: '#f39c12', fontSize: 13, margin: 0, fontStyle: 'italic', cursor: canEdit ? 'pointer' : 'default', background: 'rgba(243,156,18,0.08)', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}
                onClick={() => { if (canEdit) { setNotesValue(day.notes || ''); setEditingNotes(true); } }}
              >
                {day.notes}
              </p>
            ) : canEdit ? (
              <button
                onClick={() => setEditingNotes(true)}
                style={{ background: c.bgSubtle, border: `1px dashed ${c.borderInput}`, borderRadius: 8, padding: '6px 14px', color: c.textFaint, fontSize: 12, cursor: 'pointer' }}
              >
                + Add note
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Activities List */}
      <div style={{ background: c.bgCard, borderRadius: 16, padding: '8px 14px', border: `1px solid ${c.borderLight}` }}>
        <AnimatePresence>
          {day.activities.map((activity, idx) => (
            <ActivityCard key={activity.id} activity={activity} index={idx} dayColor={cityColor} onUpdate={(updates) => updateActivity(dayIndex, activity.id, updates)} onRemove={() => removeActivity(dayIndex, activity.id)} />
          ))}
        </AnimatePresence>

        {canEdit && (
          <div style={{ padding: '16px 0' }}>
            <AnimatePresence>
              {showAddForm ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ background: c.bgSubtle, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="Time" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '10px 12px', color: c.text, fontSize: 13, outline: 'none', width: 100 }} />
                      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Activity name" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '10px 12px', color: c.text, fontSize: 13, outline: 'none', flex: 1 }} />
                    </div>
                    <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '10px 12px', color: c.text, fontSize: 13, outline: 'none' }} />
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <button key={cat} onClick={() => setNewCategory(cat)} style={{ background: newCategory === cat ? `${cityColor}30` : c.bgSubtle, border: newCategory === cat ? `1px solid ${cityColor}` : `1px solid ${c.border}`, borderRadius: 20, padding: '4px 12px', color: newCategory === cat ? cityColor : c.textTertiary, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' }}>
                          {EMOJI_MAP[cat]} {cat}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAddActivity} style={{ background: `linear-gradient(135deg, ${cityColor}, ${cityColor}cc)`, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Add Activity
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddForm(false)} style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 10, padding: '10px 24px', color: c.textTertiary, fontSize: 13, cursor: 'pointer' }}>
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: '14px', background: c.bgCard, border: `2px dashed ${c.borderLight}`, borderRadius: 14, color: c.textFaint, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>+</span> Add Activity
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DayDetail;
