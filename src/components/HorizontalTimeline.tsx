import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAVELERS, Activity } from '../data/tripData';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';
// ActivityCard available for future use

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: '#e94560',
  food: '#f4a261',
  transport: '#4ecdc4',
  entertainment: '#9b59b6',
  shopping: '#ff6b6b',
  culture: '#3498db',
  nature: '#27ae60',
};

const CATEGORY_OPTIONS: Activity['category'][] = ['sightseeing', 'food', 'transport', 'entertainment', 'shopping', 'culture', 'nature'];
const EMOJI_MAP: Record<string, string> = {
  sightseeing: '🏛️', food: '🍽️', transport: '🚕', entertainment: '🎭', shopping: '🛍️', culture: '🎨', nature: '🌳',
};

// Hours shown in the hourly view (7 AM to 11 PM)
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7); // 7..23

function parseTimeToHour(time?: string): number | null {
  if (!time) return null;
  const lower = time.toLowerCase().trim();
  if (lower === 'morning') return 9;
  if (lower === 'afternoon') return 14;
  if (lower === 'evening') return 19;
  // Parse "9:00 AM", "3:30 PM", etc.
  const match = lower.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const period = match[3];
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return h + m / 60;
  }
  // Try "9 AM", "3 PM"
  const match2 = lower.match(/^(\d{1,2})\s*(am|pm)$/);
  if (match2) {
    let h = parseInt(match2[1], 10);
    const period = match2[2];
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return h;
  }
  return null;
}

function formatHour(h: number): string {
  if (h === 0 || h === 24) return '12 AM';
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

const HorizontalTimeline: React.FC = () => {
  const { days, removeActivity, addActivity, updateAccommodation, updateNotes } = useTrip();
  const { canEdit } = useAuth();
  const c = useThemeColors();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Add activity form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Activity['category']>('sightseeing');

  // Accommodation / notes editing
  const [editingAccom, setEditingAccom] = useState(false);
  const [accomValue, setAccomValue] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  const handleSelectDay = (idx: number) => {
    if (selectedDay === idx) {
      setSelectedDay(null);
    } else {
      setSelectedDay(idx);
      setShowAddForm(false);
      setEditingAccom(false);
      setEditingNotes(false);
      // Reset add form
      setNewTitle('');
      setNewTime('');
      setNewDesc('');
      // Set accommodation/notes values
      const day = days[idx];
      if (day) {
        setAccomValue(day.accommodation || '');
        setNotesValue(day.notes || '');
      }
    }
  };

  const handleAddActivity = () => {
    if (selectedDay === null || !newTitle.trim()) return;
    addActivity(selectedDay, {
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

  const expandedDay = selectedDay !== null ? days[selectedDay] : null;
  const expandedCityColor = expandedDay
    ? expandedDay.city.toLowerCase().includes('paris') ? '#f4a261' : '#e94560'
    : '#e94560';
  const expandedPresentTravelers = expandedDay
    ? TRAVELERS.filter((t) => t.presentDays.includes(expandedDay.day))
    : [];

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {/* Scroll buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          className="timeline-scroll-btn"
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: 32, height: 32, borderRadius: '50%', border: `1px solid ${c.border}`,
            background: c.bgCard, backdropFilter: 'blur(10px)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: c.textSecondary, fontSize: 14, boxShadow: `0 2px 12px rgba(0,0,0,0.2)`,
          }}
        >
          ◀
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          className="timeline-scroll-btn"
          style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: 32, height: 32, borderRadius: '50%', border: `1px solid ${c.border}`,
            background: c.bgCard, backdropFilter: 'blur(10px)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: c.textSecondary, fontSize: 14, boxShadow: `0 2px 12px rgba(0,0,0,0.2)`,
          }}
        >
          ▶
        </motion.button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            padding: '10px 12px 20px',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          <div style={{ display: 'flex', gap: 0, minWidth: 'min-content', position: 'relative' }}>
            {/* Horizontal connector line */}
            <div style={{
              position: 'absolute', top: 34, left: 20, right: 20, height: 3,
              background: `linear-gradient(90deg, #e94560, #e94560 28%, #f4a261 28%, #f4a261 66%, #e94560 66%, #e94560)`,
              borderRadius: 2, opacity: 0.25, zIndex: 0,
            }} />

            {days.map((day, idx) => {
              const isParis = day.city.toLowerCase().includes('paris');
              const cityColor = isParis ? '#f4a261' : '#e94560';
              const presentTravelers = TRAVELERS.filter((t) => t.presentDays.includes(day.day));
              const isTransit = day.city.includes('→');
              const isSelected = selectedDay === idx;

              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', damping: 20 }}
                  onClick={() => handleSelectDay(idx)}
                  style={{
                    minWidth: 240,
                    maxWidth: 280,
                    padding: '0 6px',
                    position: 'relative',
                    zIndex: 1,
                    scrollSnapAlign: 'start',
                    cursor: 'pointer',
                  }}
                >
                  {/* Day node */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      animate={isSelected ? { scale: 1.15, boxShadow: `0 6px 24px ${cityColor}60` } : { scale: 1 }}
                      style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${cityColor}, ${cityColor}cc)`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 16px ${cityColor}40`,
                        border: isSelected ? `3px solid ${cityColor}` : `3px solid ${c.isDark ? '#1a1a2e' : '#f5f0e8'}`,
                        position: 'relative', zIndex: 2,
                        transition: 'border 0.2s',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, lineHeight: 1 }}>DAY</span>
                      <span style={{ color: '#fff', fontSize: 16, fontWeight: 900, lineHeight: 1 }}>{day.day}</span>
                    </motion.div>
                    <span style={{ color: c.textTertiary, fontSize: 10, fontWeight: 600, marginTop: 4 }}>
                      {day.dateShort}
                    </span>
                    <span style={{ color: cityColor, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {isTransit ? 'London → Paris' : day.city} {isParis ? '🇫🇷' : '🇬🇧'}
                    </span>
                  </div>

                  {/* Day card */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      background: isSelected ? `${cityColor}12` : c.bgCard,
                      border: isSelected ? `2px solid ${cityColor}50` : `1px solid ${cityColor}25`,
                      borderRadius: 16,
                      padding: 14,
                      minHeight: 200,
                      transition: 'background 0.2s, border 0.2s',
                    }}
                  >
                    <h4 style={{ color: c.text, margin: '0 0 6px', fontSize: 13, fontWeight: 700 }}>
                      {day.subtitle}
                    </h4>

                    {/* Traveler avatars */}
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      {presentTravelers.map((t, i) => (
                        <div
                          key={t.id}
                          title={t.name}
                          style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${t.color}, ${t.colorLight})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: 8,
                            border: `2px solid ${c.isDark ? '#1a1a2e' : '#f5f0e8'}`,
                            marginLeft: i > 0 ? -5 : 0, zIndex: presentTravelers.length - i,
                          }}
                        >
                          {t.avatarInitials}
                        </div>
                      ))}
                      <span style={{ color: c.textFaint, fontSize: 9, marginLeft: 5, alignSelf: 'center' }}>
                        {presentTravelers.length}/4
                      </span>
                    </div>

                    {/* Accommodation */}
                    {day.accommodation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, background: c.bgSubtle, borderRadius: 6, padding: '4px 8px' }}>
                        <span style={{ fontSize: 10 }}>🏨</span>
                        <span style={{ color: c.textTertiary, fontSize: 10 }}>{day.accommodation}</span>
                      </div>
                    )}

                    {/* Activities */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {day.activities.map((activity, ai) => {
                        const catColor = CATEGORY_COLORS[activity.category] || cityColor;
                        return (
                          <div
                            key={activity.id}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: 6,
                              padding: '4px 0',
                              borderBottom: ai < day.activities.length - 1 ? `1px solid ${c.borderLight}` : 'none',
                            }}
                          >
                            <div style={{
                              width: 6, height: 6, borderRadius: '50%', background: catColor,
                              boxShadow: `0 0 4px ${catColor}40`, flexShrink: 0, marginTop: 4,
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 12 }}>{activity.icon}</span>
                                <span style={{ color: c.text, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {activity.title}
                                </span>
                              </div>
                              {activity.time && (
                                <span style={{ color: catColor, fontSize: 9, fontWeight: 600, fontFamily: 'monospace' }}>
                                  {activity.time}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notes */}
                    {day.notes && (
                      <div style={{ marginTop: 6, background: 'rgba(243,156,18,0.08)', borderRadius: 6, padding: '4px 8px' }}>
                        <p style={{ color: '#f39c12', fontSize: 9, margin: 0, fontStyle: 'italic' }}>{day.notes}</p>
                      </div>
                    )}

                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', marginTop: 8 }}
                      >
                        <span style={{ color: cityColor, fontSize: 10, fontWeight: 600 }}>▼ Expanded Below</span>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Hourly View Panel */}
      <AnimatePresence>
        {selectedDay !== null && expandedDay && (
          <motion.div
            key={`expanded-${selectedDay}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: `linear-gradient(135deg, ${expandedCityColor}10, transparent)`,
              border: `1px solid ${expandedCityColor}25`,
              borderRadius: 20,
              padding: '20px 16px',
              marginTop: 16,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ background: `${expandedCityColor}20`, color: expandedCityColor, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Day {expandedDay.day} {expandedDay.city.toLowerCase().includes('paris') ? '🇫🇷' : '🇬🇧'}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedDay(null)}
                      style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 8, padding: '4px 10px', color: c.textTertiary, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      ✕ Close
                    </motion.button>
                  </div>
                  <h3 style={{ color: c.text, margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>
                    {expandedDay.subtitle}
                  </h3>
                  <p style={{ color: c.textTertiary, margin: 0, fontSize: 13 }}>
                    {expandedDay.date} &middot; {expandedDay.city}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex' }}>
                    {expandedPresentTravelers.map((t, i) => (
                      <div
                        key={t.id}
                        title={t.name}
                        style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${t.color}, ${t.colorLight})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 10,
                          border: `2px solid ${c.isDark ? '#1a1a2e' : '#f5f0e8'}`,
                          marginLeft: i > 0 ? -6 : 0, zIndex: expandedPresentTravelers.length - i,
                        }}
                      >
                        {t.avatarInitials}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accommodation & Notes row */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                {(expandedDay.accommodation || canEdit) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: c.bgSubtle, borderRadius: 10, padding: '6px 12px' }}>
                    <span style={{ fontSize: 14 }}>🏨</span>
                    {editingAccom && canEdit ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          value={accomValue}
                          onChange={(e) => setAccomValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { updateAccommodation(selectedDay, accomValue); setEditingAccom(false); } }}
                          style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 6, padding: '4px 8px', color: c.text, fontSize: 12, outline: 'none', width: 180 }}
                          autoFocus
                        />
                        <button onClick={() => { updateAccommodation(selectedDay, accomValue); setEditingAccom(false); }} style={{ background: expandedCityColor, border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 11, cursor: 'pointer' }}>Save</button>
                      </div>
                    ) : (
                      <span
                        style={{ color: c.textSecondary, fontSize: 12, cursor: canEdit ? 'pointer' : 'default' }}
                        onClick={(e) => { e.stopPropagation(); if (canEdit) setEditingAccom(true); }}
                      >
                        {expandedDay.accommodation || 'No accommodation'}
                      </span>
                    )}
                  </div>
                )}
                {(expandedDay.notes || canEdit) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(243,156,18,0.08)', borderRadius: 10, padding: '6px 12px' }}>
                    {editingNotes && canEdit ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { updateNotes(selectedDay, notesValue); setEditingNotes(false); } }}
                          placeholder="Note..."
                          style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 6, padding: '4px 8px', color: c.text, fontSize: 12, outline: 'none', width: 200 }}
                          autoFocus
                        />
                        <button onClick={() => { updateNotes(selectedDay, notesValue); setEditingNotes(false); }} style={{ background: expandedCityColor, border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 11, cursor: 'pointer' }}>Save</button>
                      </div>
                    ) : expandedDay.notes ? (
                      <span
                        style={{ color: '#f39c12', fontSize: 12, fontStyle: 'italic', cursor: canEdit ? 'pointer' : 'default' }}
                        onClick={() => { if (canEdit) { setNotesValue(expandedDay.notes || ''); setEditingNotes(true); } }}
                      >
                        {expandedDay.notes}
                      </span>
                    ) : canEdit ? (
                      <span
                        style={{ color: c.textFaint, fontSize: 12, cursor: 'pointer' }}
                        onClick={() => setEditingNotes(true)}
                      >
                        + Add note
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Hourly Schedule Grid */}
              <div style={{
                background: c.bgCard,
                borderRadius: 16,
                border: `1px solid ${c.borderLight}`,
                overflow: 'hidden',
              }}>
                {/* Hour rows */}
                {HOURS.map((hour) => {
                  const activitiesAtHour = expandedDay.activities.filter((a) => {
                    const parsed = parseTimeToHour(a.time);
                    return parsed !== null && Math.floor(parsed) === hour;
                  });
                  const hasActivity = activitiesAtHour.length > 0;

                  return (
                    <div
                      key={hour}
                      style={{
                        display: 'flex',
                        minHeight: hasActivity ? 'auto' : 44,
                        borderBottom: `1px solid ${c.borderLight}`,
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* Time label */}
                      <div style={{
                        width: 70,
                        flexShrink: 0,
                        padding: '10px 8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        borderRight: `2px solid ${hasActivity ? expandedCityColor : c.borderLight}`,
                        position: 'relative',
                      }}>
                        <span style={{
                          color: hasActivity ? expandedCityColor : c.textFaint,
                          fontSize: 11,
                          fontWeight: hasActivity ? 700 : 500,
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                        }}>
                          {formatHour(hour)}
                        </span>
                        {/* Dot on timeline */}
                        {hasActivity && (
                          <div style={{
                            position: 'absolute',
                            right: -5,
                            top: 12,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: expandedCityColor,
                            boxShadow: `0 0 8px ${expandedCityColor}60`,
                          }} />
                        )}
                      </div>

                      {/* Activity content area */}
                      <div style={{ flex: 1, padding: hasActivity ? '6px 12px' : '6px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {activitiesAtHour.length > 0 ? (
                          activitiesAtHour.map((activity) => {
                            const catColor = CATEGORY_COLORS[activity.category] || expandedCityColor;
                            return (
                              <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                  background: `${catColor}12`,
                                  border: `1px solid ${catColor}30`,
                                  borderRadius: 12,
                                  padding: '10px 14px',
                                  cursor: canEdit ? 'pointer' : 'default',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: activity.description ? 4 : 0 }}>
                                  <span style={{ fontSize: 18 }}>{activity.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ color: c.text, fontSize: 14, fontWeight: 700 }}>{activity.title}</span>
                                      <span style={{
                                        background: `${catColor}20`,
                                        color: catColor,
                                        fontSize: 9,
                                        fontWeight: 600,
                                        padding: '2px 8px',
                                        borderRadius: 10,
                                        textTransform: 'capitalize',
                                      }}>
                                        {activity.category}
                                      </span>
                                    </div>
                                    {activity.time && (
                                      <span style={{ color: catColor, fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>
                                        {activity.time}
                                      </span>
                                    )}
                                  </div>
                                  {canEdit && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => { e.stopPropagation(); removeActivity(selectedDay, activity.id); }}
                                      style={{ background: 'rgba(255,59,48,0.1)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#ff3b30', fontSize: 10, cursor: 'pointer' }}
                                    >
                                      Remove
                                    </motion.button>
                                  )}
                                </div>
                                {activity.description && (
                                  <p style={{ color: c.textSecondary, fontSize: 12, margin: '2px 0 0 26px', lineHeight: 1.4 }}>
                                    {activity.description}
                                  </p>
                                )}
                                {activity.contact && (
                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, marginLeft: 26 }}>
                                    {activity.contact.phone && (
                                      <a href={`tel:${activity.contact.phone}`} style={{ color: catColor, fontSize: 10, textDecoration: 'none', background: `${catColor}10`, padding: '2px 8px', borderRadius: 8 }}>
                                        📞 {activity.contact.phone}
                                      </a>
                                    )}
                                    {activity.contact.address && (
                                      <a href={`https://maps.google.com/?q=${encodeURIComponent(activity.contact.address)}`} target="_blank" rel="noopener noreferrer" style={{ color: catColor, fontSize: 10, textDecoration: 'none', background: `${catColor}10`, padding: '2px 8px', borderRadius: 8 }}>
                                        📍 Map
                                      </a>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })
                        ) : (
                          canEdit && (
                            <motion.div
                              whileHover={{ background: c.bgHover }}
                              onClick={() => { setNewTime(formatHour(hour)); setShowAddForm(true); }}
                              style={{
                                borderRadius: 8,
                                padding: '4px 8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                opacity: 0.4,
                                transition: 'opacity 0.2s',
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.4'; }}
                            >
                              <span style={{ color: c.textFaint, fontSize: 14 }}>+</span>
                              <span style={{ color: c.textFaint, fontSize: 11 }}>Add activity</span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Unscheduled activities (no time or unparseable time) */}
                {(() => {
                  const unscheduled = expandedDay.activities.filter((a) => {
                    const parsed = parseTimeToHour(a.time);
                    return parsed === null || Math.floor(parsed) < 7 || Math.floor(parsed) > 23;
                  });
                  if (unscheduled.length === 0) return null;
                  return (
                    <div style={{ borderTop: `2px solid ${expandedCityColor}20`, padding: '12px 14px' }}>
                      <span style={{ color: c.textFaint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
                        Unscheduled
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {unscheduled.map((activity) => {
                          const catColor = CATEGORY_COLORS[activity.category] || expandedCityColor;
                          return (
                            <div key={activity.id} style={{ background: `${catColor}10`, border: `1px solid ${catColor}25`, borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{activity.icon}</span>
                              <div style={{ flex: 1 }}>
                                <span style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{activity.title}</span>
                                {activity.time && <span style={{ color: c.textTertiary, fontSize: 11, marginLeft: 6 }}>({activity.time})</span>}
                              </div>
                              {canEdit && (
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeActivity(selectedDay, activity.id)}
                                  style={{ background: 'rgba(255,59,48,0.1)', border: 'none', borderRadius: 6, padding: '3px 8px', color: '#ff3b30', fontSize: 10, cursor: 'pointer' }}
                                >
                                  ✕
                                </motion.button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Add Activity Form (floating) */}
              {canEdit && (
                <div style={{ marginTop: 12 }}>
                  <AnimatePresence>
                    {showAddForm ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ overflow: 'hidden' }}>
                        <div style={{ background: c.bgSubtle, borderRadius: 14, padding: 14, border: `1px solid ${c.borderLight}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span style={{ color: expandedCityColor, fontSize: 12, fontWeight: 700 }}>New Activity</span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="Time (e.g. 2:00 PM)" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 10px', color: c.text, fontSize: 13, outline: 'none', width: 140 }} />
                            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Activity name" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 10px', color: c.text, fontSize: 13, outline: 'none', flex: 1 }} />
                          </div>
                          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" style={{ background: c.bgInput, border: `1px solid ${c.borderInput}`, borderRadius: 8, padding: '8px 10px', color: c.text, fontSize: 13, outline: 'none' }} />
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {CATEGORY_OPTIONS.map((cat) => (
                              <button key={cat} onClick={() => setNewCategory(cat)} style={{ background: newCategory === cat ? `${expandedCityColor}30` : c.bgSubtle, border: newCategory === cat ? `1px solid ${expandedCityColor}` : `1px solid ${c.border}`, borderRadius: 20, padding: '3px 10px', color: newCategory === cat ? expandedCityColor : c.textTertiary, fontSize: 10, cursor: 'pointer', textTransform: 'capitalize' }}>
                                {EMOJI_MAP[cat]} {cat}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAddActivity} style={{ background: `linear-gradient(135deg, ${expandedCityColor}, ${expandedCityColor}cc)`, border: 'none', borderRadius: 10, padding: '8px 20px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                              Add Activity
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddForm(false)} style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 10, padding: '8px 20px', color: c.textTertiary, fontSize: 12, cursor: 'pointer' }}>
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: '12px', background: c.bgCard, border: `2px dashed ${c.borderLight}`, borderRadius: 12, color: c.textFaint, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16 }}>+</span> Add Activity
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HorizontalTimeline;
