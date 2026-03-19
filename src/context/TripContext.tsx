import React, { createContext, useContext, useState, useCallback } from 'react';
import { ITINERARY, DayPlan, Activity } from '../data/tripData';
import { v4 as uuidv4 } from 'uuid';

interface TripContextType {
  days: DayPlan[];
  updateActivity: (dayIndex: number, activityId: string, updates: Partial<Activity>) => void;
  addActivity: (dayIndex: number, activity: Omit<Activity, 'id'>) => void;
  removeActivity: (dayIndex: number, activityId: string) => void;
  updateAccommodation: (dayIndex: number, accommodation: string) => void;
  updateNotes: (dayIndex: number, notes: string) => void;
  reorderActivities: (dayIndex: number, fromIdx: number, toIdx: number) => void;
}

const TripContext = createContext<TripContextType>({
  days: ITINERARY,
  updateActivity: () => {},
  addActivity: () => {},
  removeActivity: () => {},
  updateAccommodation: () => {},
  updateNotes: () => {},
  reorderActivities: () => {},
});

export const useTrip = () => useContext(TripContext);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [days, setDays] = useState<DayPlan[]>(ITINERARY);

  const updateActivity = useCallback((dayIndex: number, activityId: string, updates: Partial<Activity>) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: day.activities.map((a) =>
                a.id === activityId ? { ...a, ...updates } : a
              ),
            }
          : day
      )
    );
  }, []);

  const addActivity = useCallback((dayIndex: number, activity: Omit<Activity, 'id'>) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [...day.activities, { ...activity, id: uuidv4() }] }
          : day
      )
    );
  }, []);

  const removeActivity = useCallback((dayIndex: number, activityId: string) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.filter((a) => a.id !== activityId) }
          : day
      )
    );
  }, []);

  const updateAccommodation = useCallback((dayIndex: number, accommodation: string) => {
    setDays((prev) =>
      prev.map((day, i) => (i === dayIndex ? { ...day, accommodation } : day))
    );
  }, []);

  const updateNotes = useCallback((dayIndex: number, notes: string) => {
    setDays((prev) =>
      prev.map((day, i) => (i === dayIndex ? { ...day, notes } : day))
    );
  }, []);

  const reorderActivities = useCallback((dayIndex: number, fromIdx: number, toIdx: number) => {
    setDays((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;
        const acts = [...day.activities];
        const [moved] = acts.splice(fromIdx, 1);
        acts.splice(toIdx, 0, moved);
        return { ...day, activities: acts };
      })
    );
  }, []);

  return (
    <TripContext.Provider
      value={{ days, updateActivity, addActivity, removeActivity, updateAccommodation, updateNotes, reorderActivities }}
    >
      {children}
    </TripContext.Provider>
  );
};
