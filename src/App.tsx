import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ParticleBackground from './components/ParticleBackground';
import CountdownHeader from './components/CountdownHeader';
import TravelerCard from './components/TravelerCard';
import FlightMap from './components/FlightMap';
import PresenceTimeline from './components/PresenceTimeline';
import DayDetail from './components/DayDetail';
import LoginModal from './components/LoginModal';
import EmergencyInfo from './components/EmergencyInfo';
import HorizontalTimeline from './components/HorizontalTimeline';
import PackingList from './components/PackingList';
import { TRAVELERS, ITINERARY } from './data/tripData';
import './App.css';

type TabType = 'overview' | 'itinerary' | 'travelers' | 'packing' | 'emergency';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedDay, setSelectedDay] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [timelineView, setTimelineView] = useState<'detail' | 'horizontal'>('detail');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🗺️' },
    { id: 'itinerary', label: 'Itinerary', icon: '📅' },
    { id: 'travelers', label: 'Travelers', icon: '✈️' },
    { id: 'packing', label: 'Packing', icon: '🧳' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' },
  ];

  return (
    <div className="app">
      <ParticleBackground />

      {/* Nav Bar */}
      <motion.nav
        className="navbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="nav-left">
          <motion.div
            className="logo"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="logo-icon">🌍</span>
            <div>
              <h1 className="logo-title">London & Paris 2026</h1>
              <p className="logo-subtitle">May 18 – 26, 2026</p>
            </div>
          </motion.div>
        </div>

        <div className="nav-tabs">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className="tab-indicator" layoutId="tab-indicator" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="nav-right">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
          {isAuthenticated ? (
            <div className="user-badge">
              <motion.div
                className="user-avatar"
                style={{ background: `linear-gradient(135deg, ${currentUser?.color}, ${currentUser?.colorLight})` }}
                whileHover={{ scale: 1.1 }}
              >
                {currentUser?.avatarInitials}
              </motion.div>
              <span className="user-name">{currentUser?.name.split(' ')[0]}</span>
              <motion.button
                className="logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <motion.button
              className="login-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(233,69,96,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
            >
              Sign In to Edit
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className={`main-content${activeTab === 'itinerary' && timelineView === 'horizontal' ? ' wide' : ''}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Hero Section */}
              <div className="hero-section">
                <motion.div
                  className="hero-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  9 DAYS &middot; 2 CITIES &middot; 4 TRAVELERS
                </motion.div>
                <motion.h1
                  className="hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  The Grand European<br />
                  <span className="hero-gradient">Adventure</span>
                </motion.h1>
                <motion.p
                  className="hero-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  London &middot; Eurostar &middot; Paris — a journey through history, culture, art, and unforgettable vibes.
                </motion.p>
              </div>

              <CountdownHeader />
              <FlightMap />

              {/* Quick day overview grid */}
              <div className="overview-grid">
                <h3 className="section-title">Trip at a Glance</h3>
                <div className="day-grid">
                  {ITINERARY.map((dayPlan) => {
                    const dayNum = dayPlan.day;
                    const presentCount = TRAVELERS.filter(t => t.presentDays.includes(dayNum)).length;
                    const isParis = dayPlan.city.toLowerCase().includes('paris');
                    const cityColor = isParis ? '#f4a261' : '#e94560';
                    return (
                      <motion.div
                        key={dayNum}
                        className="day-chip"
                        whileHover={{ scale: 1.08, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSelectedDay(dayNum - 1); setActiveTab('itinerary'); }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: dayNum * 0.06 }}
                        style={{ borderColor: `${cityColor}30` }}
                      >
                        <span className="day-chip-date">{dayPlan.dateShort}</span>
                        <span className="day-chip-number" style={{ color: cityColor }}>
                          Day {dayNum}
                        </span>
                        <span className="day-chip-city">{isParis ? '🇫🇷' : '🇬🇧'}</span>
                        <div className="day-chip-dots">
                          {TRAVELERS.map(t => (
                            <div
                              key={t.id}
                              className="mini-dot"
                              style={{
                                background: t.color,
                                opacity: t.presentDays.includes(dayNum) ? 1 : 0.15,
                              }}
                            />
                          ))}
                        </div>
                        <span className="day-chip-count">{presentCount}/4</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Traveler quick cards */}
              <div style={{ marginTop: 32 }}>
                <h3 className="section-title">The Squad</h3>
                <div className="traveler-grid">
                  {TRAVELERS.map((t, i) => (
                    <TravelerCard key={t.id} traveler={t} index={i} />
                  ))}
                </div>
              </div>

              <motion.div
                className="edit-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <a
                  href="https://docs.google.com/document/d/1-STOLgUseoJzyLuagEqVgmZ9z1ZrS-98wC2nPnSEBW4/edit?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Link to Activities Document
                </a>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* View Toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div className="nav-tabs" style={{ display: 'inline-flex' }}>
                  <motion.button
                    className={`nav-tab ${timelineView === 'detail' ? 'active' : ''}`}
                    onClick={() => setTimelineView('detail')}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '6px 16px', fontSize: 12 }}
                  >
                    <span className="tab-icon" style={{ fontSize: 13 }}>📋</span>
                    <span className="tab-label">Day Detail</span>
                    {timelineView === 'detail' && (
                      <motion.div className="tab-indicator" layoutId="view-toggle" />
                    )}
                  </motion.button>
                  <motion.button
                    className={`nav-tab ${timelineView === 'horizontal' ? 'active' : ''}`}
                    onClick={() => setTimelineView('horizontal')}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '6px 16px', fontSize: 12 }}
                  >
                    <span className="tab-icon" style={{ fontSize: 13 }}>🗓️</span>
                    <span className="tab-label">Timeline</span>
                    {timelineView === 'horizontal' && (
                      <motion.div className="tab-indicator" layoutId="view-toggle" />
                    )}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {timelineView === 'detail' ? (
                  <motion.div
                    key="detail-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PresenceTimeline selectedDay={selectedDay} onDaySelect={setSelectedDay} />
                    <DayDetail dayIndex={selectedDay} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="horizontal-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HorizontalTimeline />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'travelers' && (
            <motion.div
              key="travelers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h2 className="section-heading">Meet the Travelers</h2>
              <p className="section-subheading">Tap any card to flip and see flight details</p>

              <div className="traveler-grid-large">
                {TRAVELERS.map((t, i) => (
                  <TravelerCard key={t.id} traveler={t} index={i} />
                ))}
              </div>

              {/* Presence matrix */}
              <div className="presence-matrix">
                <h3 className="section-title">Who's Where, When</h3>
                <div className="matrix-table">
                  <div className="matrix-header">
                    <div className="matrix-cell matrix-label">Day</div>
                    {TRAVELERS.map(t => (
                      <div key={t.id} className="matrix-cell matrix-name" style={{ color: t.color }}>
                        {t.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(dayNum => {
                    const isParis = dayNum >= 3 && dayNum <= 6;
                    return (
                      <motion.div
                        key={dayNum}
                        className="matrix-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dayNum * 0.05 }}
                      >
                        <div className="matrix-cell matrix-label">
                          <span className="matrix-day">Day {dayNum}</span>
                          <span className="matrix-flag">{isParis ? '🇫🇷' : '🇬🇧'}</span>
                        </div>
                        {TRAVELERS.map(t => {
                          const isPresent = t.presentDays.includes(dayNum);
                          return (
                            <div key={t.id} className="matrix-cell">
                              <motion.div
                                animate={{ scale: isPresent ? 1 : 0.4, opacity: isPresent ? 1 : 0.15 }}
                                className="matrix-dot"
                                style={{ background: isPresent ? t.color : 'rgba(255,255,255,0.2)' }}
                              />
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'packing' && (
            <motion.div
              key="packing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <PackingList />
            </motion.div>
          )}

          {activeTab === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <EmergencyInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
