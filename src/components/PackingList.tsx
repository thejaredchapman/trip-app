import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface PackingItem {
  id: string;
  name: string;
  essential?: boolean;
}

interface PackingCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: PackingItem[];
}

const PACKING_CATEGORIES: PackingCategory[] = [
  {
    id: 'documents',
    title: 'Documents & Money',
    icon: '📄',
    color: '#e94560',
    items: [
      { id: 'passport', name: 'Passport (valid 6+ months)', essential: true },
      { id: 'passport-copies', name: 'Passport copies (digital + paper)', essential: true },
      { id: 'boarding-passes', name: 'Boarding passes / Expedia confirmations', essential: true },
      { id: 'hotel-confirmations', name: 'Hotel booking confirmations', essential: true },
      { id: 'eurostar-ticket', name: 'Eurostar ticket (Day 3)', essential: true },
      { id: 'travel-insurance', name: 'Travel insurance docs', essential: true },
      { id: 'credit-cards', name: 'Credit/debit cards (notify bank!)', essential: true },
      { id: 'cash-gbp', name: 'Cash — British Pounds (GBP)' },
      { id: 'cash-eur', name: 'Cash — Euros (EUR)' },
      { id: 'emergency-contacts', name: 'Emergency contact card (printed)' },
      { id: 'drivers-license', name: "Driver's license (backup ID)" },
    ],
  },
  {
    id: 'tech',
    title: 'Tech & Electronics',
    icon: '🔌',
    color: '#3498db',
    items: [
      { id: 'phone', name: 'Phone + charger', essential: true },
      { id: 'uk-adapter', name: 'UK power adapter (Type G — 3 prong)', essential: true },
      { id: 'eu-adapter', name: 'EU power adapter (Type C — 2 round prong)', essential: true },
      { id: 'portable-charger', name: 'Portable battery pack' },
      { id: 'headphones', name: 'Headphones / earbuds' },
      { id: 'camera', name: 'Camera + memory card' },
      { id: 'intl-data', name: 'International phone plan / eSIM activated' },
      { id: 'laptop-tablet', name: 'Laptop or tablet (optional)' },
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing',
    icon: '👔',
    color: '#9b59b6',
    items: [
      { id: 'outfits', name: 'Outfits for 9 days (mix & match)' },
      { id: 'underwear', name: 'Underwear & socks (9+ pairs)' },
      { id: 'walking-shoes', name: 'Comfortable walking shoes', essential: true },
      { id: 'dress-shoes', name: 'Dress shoes (for dinners / nights out)' },
      { id: 'rain-jacket', name: 'Rain jacket / waterproof layer', essential: true },
      { id: 'light-jacket', name: 'Light jacket or hoodie' },
      { id: 'jeans-pants', name: 'Jeans / pants (3-4)' },
      { id: 'tshirts', name: 'T-shirts / casual tops (5-6)' },
      { id: 'nice-shirt', name: 'Nice shirt for going out (2)' },
      { id: 'pajamas', name: 'Pajamas / sleepwear' },
      { id: 'belt', name: 'Belt' },
      { id: 'sunglasses', name: 'Sunglasses' },
      { id: 'hat', name: 'Hat or cap' },
    ],
  },
  {
    id: 'toiletries',
    title: 'Toiletries & Health',
    icon: '🧴',
    color: '#27ae60',
    items: [
      { id: 'toothbrush', name: 'Toothbrush + toothpaste', essential: true },
      { id: 'deodorant', name: 'Deodorant', essential: true },
      { id: 'body-wash', name: 'Body wash / soap (travel size)' },
      { id: 'shampoo', name: 'Shampoo / conditioner (travel size)' },
      { id: 'face-wash', name: 'Face wash / skincare' },
      { id: 'sunscreen', name: 'Sunscreen' },
      { id: 'medications', name: 'Prescription medications', essential: true },
      { id: 'pain-relief', name: 'Pain relief (ibuprofen / Tylenol)' },
      { id: 'allergy-meds', name: 'Allergy medication' },
      { id: 'band-aids', name: 'Band-aids / blister pads' },
      { id: 'hand-sanitizer', name: 'Hand sanitizer' },
      { id: 'tissues', name: 'Travel tissues' },
      { id: 'lip-balm', name: 'Lip balm' },
    ],
  },
  {
    id: 'travel',
    title: 'Travel Comfort',
    icon: '✈️',
    color: '#f4a261',
    items: [
      { id: 'carry-on', name: 'Carry-on bag', essential: true },
      { id: 'checked-bag', name: 'Checked luggage' },
      { id: 'daypack', name: 'Day backpack / crossbody bag', essential: true },
      { id: 'neck-pillow', name: 'Neck pillow' },
      { id: 'eye-mask', name: 'Eye mask + earplugs' },
      { id: 'snacks', name: 'Snacks for the flight' },
      { id: 'water-bottle', name: 'Reusable water bottle (empty for security)' },
      { id: 'packing-cubes', name: 'Packing cubes' },
      { id: 'laundry-bag', name: 'Dirty laundry bag' },
      { id: 'luggage-lock', name: 'TSA-approved luggage lock' },
    ],
  },
  {
    id: 'london-paris',
    title: 'London & Paris Specifics',
    icon: '🗼',
    color: '#4ecdc4',
    items: [
      { id: 'oyster-card', name: 'Oyster card or contactless payment for Tube' },
      { id: 'navigo-card', name: 'Navigo card or Paris Metro tickets' },
      { id: 'comfy-shoes-2', name: 'Extra comfy shoes (you WILL walk 15k+ steps/day)' },
      { id: 'umbrella', name: 'Compact umbrella (London weather!)' },
      { id: 'museum-bag', name: 'Small bag for museums (no large backpacks)' },
      { id: 'phrase-card', name: 'French phrases cheat sheet' },
      { id: 'guidebook', name: 'Guidebook or offline maps downloaded' },
      { id: 'hp-tour-ticket', name: 'Harry Potter Studio Tour ticket (Day 2)' },
      { id: 'louvre-ticket', name: 'Louvre timed entry ticket (Day 4)' },
    ],
  },
];

const STORAGE_KEY = 'trip-packing-checked';

const PackingList: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const c = useThemeColors();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(PACKING_CATEGORIES.map((cat) => cat.id))
  );
  const [customItems, setCustomItems] = useState<Record<string, { id: string; name: string }[]>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  // Load from localStorage per user
  useEffect(() => {
    const userId = currentUser?.id || 'guest';
    const saved = localStorage.getItem(`${STORAGE_KEY}-${userId}`);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
    const savedCustom = localStorage.getItem(`${STORAGE_KEY}-custom-${userId}`);
    if (savedCustom) {
      try { setCustomItems(JSON.parse(savedCustom)); } catch {}
    }
  }, [currentUser]);

  const saveChecked = useCallback((newChecked: Record<string, boolean>) => {
    const userId = currentUser?.id || 'guest';
    localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(newChecked));
  }, [currentUser]);

  const saveCustom = useCallback((newCustom: Record<string, { id: string; name: string }[]>) => {
    const userId = currentUser?.id || 'guest';
    localStorage.setItem(`${STORAGE_KEY}-custom-${userId}`, JSON.stringify(newCustom));
  }, [currentUser]);

  const toggleItem = (itemId: string) => {
    const newChecked = { ...checked, [itemId]: !checked[itemId] };
    setChecked(newChecked);
    saveChecked(newChecked);
  };

  const toggleCategory = (catId: string) => {
    const next = new Set(expandedCategories);
    if (next.has(catId)) next.delete(catId);
    else next.add(catId);
    setExpandedCategories(next);
  };

  const addCustomItem = (catId: string) => {
    if (!newItemName.trim()) return;
    const id = `custom-${catId}-${Date.now()}`;
    const newCustom = {
      ...customItems,
      [catId]: [...(customItems[catId] || []), { id, name: newItemName.trim() }],
    };
    setCustomItems(newCustom);
    saveCustom(newCustom);
    setNewItemName('');
    setAddingTo(null);
  };

  const removeCustomItem = (catId: string, itemId: string) => {
    const newCustom = {
      ...customItems,
      [catId]: (customItems[catId] || []).filter((i) => i.id !== itemId),
    };
    setCustomItems(newCustom);
    saveCustom(newCustom);
    const newChecked = { ...checked };
    delete newChecked[itemId];
    setChecked(newChecked);
    saveChecked(newChecked);
  };

  // Stats
  const allItems = PACKING_CATEGORIES.flatMap((cat) => [
    ...cat.items,
    ...(customItems[cat.id] || []),
  ]);
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((item) => checked[item.id]).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
  const essentialItems = PACKING_CATEGORIES.flatMap((cat) => cat.items.filter((i) => i.essential));
  const essentialChecked = essentialItems.filter((i) => checked[i.id]).length;

  return (
    <div>
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Packing List
      </motion.h2>
      <motion.p
        className="section-subheading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        9 days, 2 countries — don't forget the power adapters
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          background: c.bgCard,
          border: `1px solid ${c.borderLight}`,
          borderRadius: 18,
          padding: '18px 20px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ color: c.text, fontSize: 22, fontWeight: 800 }}>{checkedCount}</span>
            <span style={{ color: c.textTertiary, fontSize: 14 }}> / {totalItems} packed</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: essentialChecked === essentialItems.length ? '#27ae60' : '#f4a261', fontSize: 12, fontWeight: 600 }}>
              {essentialChecked}/{essentialItems.length} essentials
            </span>
          </div>
        </div>
        <div style={{ background: c.bgSubtle, borderRadius: 8, height: 10, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: 8,
              background: progress === 100
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : 'linear-gradient(90deg, #e94560, #f4a261)',
            }}
          />
        </div>
        {progress === 100 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: '#27ae60', fontSize: 13, fontWeight: 700, margin: '8px 0 0', textAlign: 'center' }}
          >
            You're all packed! Ready for London & Paris!
          </motion.p>
        )}
      </motion.div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PACKING_CATEGORIES.map((cat, ci) => {
          const catItems = [...cat.items, ...(customItems[cat.id] || [])];
          const catChecked = catItems.filter((i) => checked[i.id]).length;
          const isExpanded = expandedCategories.has(cat.id);
          const allDone = catChecked === catItems.length && catItems.length > 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + ci * 0.05 }}
              style={{
                background: allDone ? `${cat.color}08` : c.bgCard,
                border: `1px solid ${allDone ? `${cat.color}30` : c.borderLight}`,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Category header */}
              <motion.button
                onClick={() => toggleCategory(cat.id)}
                whileHover={{ backgroundColor: c.bgHover }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: c.text, margin: 0, fontSize: 14, fontWeight: 700 }}>
                      {cat.title}
                      {allDone && <span style={{ marginLeft: 8, color: '#27ae60', fontSize: 14 }}>✓</span>}
                    </h4>
                    <p style={{ color: c.textTertiary, margin: '2px 0 0', fontSize: 11 }}>
                      {catChecked}/{catItems.length} packed
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Mini progress */}
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: c.bgSubtle, overflow: 'hidden' }}>
                    <div style={{ width: `${catItems.length > 0 ? (catChecked / catItems.length) * 100 : 0}%`, height: '100%', background: cat.color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    style={{ color: c.textMuted, fontSize: 16 }}
                  >
                    ▾
                  </motion.span>
                </div>
              </motion.button>

              {/* Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 12px' }}>
                      {catItems.map((item) => {
                        const isChecked = checked[item.id];
                        const isEssential = 'essential' in item && item.essential;
                        const isCustom = item.id.startsWith('custom-');

                        return (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 0',
                              borderBottom: `1px solid ${c.borderLight}`,
                            }}
                          ><>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => toggleItem(item.id)}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                border: `2px solid ${isChecked ? cat.color : c.border}`,
                                background: isChecked ? cat.color : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                              }}
                            >
                              {isChecked && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  style={{ color: '#fff', fontSize: 12, fontWeight: 800, lineHeight: 1 }}
                                >
                                  ✓
                                </motion.span>
                              )}
                            </motion.button>
                            <span
                              style={{
                                flex: 1,
                                color: isChecked ? c.textMuted : c.text,
                                fontSize: 13,
                                textDecoration: isChecked ? 'line-through' : 'none',
                                transition: 'color 0.2s',
                              }}
                            >
                              {item.name}
                            </span>
                            {isEssential && !isChecked && (
                              <span style={{ background: `${cat.color}15`, color: cat.color, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>
                                Essential
                              </span>
                            )}
                            {isCustom && isAuthenticated && (
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => removeCustomItem(cat.id, item.id)}
                                style={{ background: 'none', border: 'none', color: c.textFaint, fontSize: 14, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}
                                title="Remove item"
                              >
                                ×
                              </motion.button>
                            )}
                          </></div>
                        );
                      })}

                      {/* Add custom item */}
                      {isAuthenticated && (
                        <div style={{ marginTop: 8 }}>
                          {addingTo === cat.id ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ display: 'flex', gap: 6 }}
                            >
                              <input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') addCustomItem(cat.id); if (e.key === 'Escape') { setAddingTo(null); setNewItemName(''); } }}
                                placeholder="Add your own item..."
                                autoFocus
                                style={{
                                  flex: 1,
                                  background: c.bgInput,
                                  border: `1px solid ${c.borderInput}`,
                                  borderRadius: 8,
                                  padding: '8px 12px',
                                  color: c.text,
                                  fontSize: 13,
                                  outline: 'none',
                                  fontFamily: 'inherit',
                                }}
                              />
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addCustomItem(cat.id)}
                                style={{ background: cat.color, border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                              >
                                Add
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setAddingTo(null); setNewItemName(''); }}
                                style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 8, padding: '8px 12px', color: c.textTertiary, fontSize: 12, cursor: 'pointer' }}
                              >
                                Cancel
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setAddingTo(cat.id)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                background: 'none',
                                border: `1px dashed ${c.borderLight}`,
                                borderRadius: 8,
                                color: c.textFaint,
                                fontSize: 12,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              + Add custom item
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Collapse / Expand all */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpandedCategories(new Set(PACKING_CATEGORIES.map((c) => c.id)))}
          style={{ background: c.bgSubtle, border: `1px solid ${c.border}`, borderRadius: 10, padding: '8px 16px', color: c.textTertiary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Expand All
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpandedCategories(new Set())}
          style={{ background: c.bgSubtle, border: `1px solid ${c.border}`, borderRadius: 10, padding: '8px 16px', color: c.textTertiary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Collapse All
        </motion.button>
      </div>
    </div>
  );
};

export default PackingList;
