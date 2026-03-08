"use client";

import React, { useState } from "react";
import { useHabits } from "@/hooks/useHabits";

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS = ["🥛", "🧘", "🏃", "📖", "💧", "🍎", "💪", "🧗"];

export default function NewHabitModal({ isOpen, onClose }: NewHabitModalProps) {
  const { addHabit } = useHabits();
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      await addHabit({
        name,
        frequency,
        icon: selectedIcon,
      });
      setName("");
      onClose();
    } catch (error) {
      console.error("Error adding habit: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-lg p-8 space-y-8 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-accent-brown">New habit</h2>
          <button onClick={onClose} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-xl hover:bg-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center py-4">
             <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center text-5xl shadow-inner">
                {selectedIcon}
             </div>
          </div>

          <div className="space-y-2 text-center overflow-x-auto flex gap-4 p-2">
            {ICONS.map(icon => (
              <button 
                key={icon} 
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`text-2xl p-3 rounded-2xl transition-all ${selectedIcon === icon ? 'bg-primary/20 scale-110' : 'bg-transparent grayscale opacity-50'}`}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-accent-brown/40 uppercase tracking-widest px-1">Name your habit</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Morning Meditations"
                className="w-full bg-secondary p-4 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none text-accent-brown placeholder:text-accent-brown/20"
                required
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setFrequency("daily")}
                className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${frequency === 'daily' ? 'bg-accent-brown text-white shadow-lg' : 'bg-secondary text-accent-brown/40'}`}
              >
                Daily
              </button>
              <button 
                type="button"
                onClick={() => setFrequency("weekly")}
                className={`flex-1 p-4 rounded-2xl font-bold text-sm transition-all ${frequency === 'weekly' ? 'bg-accent-brown text-white shadow-lg' : 'bg-secondary text-accent-brown/40'}`}
              >
                Weekly
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-[24px] font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Habit"}
          </button>
        </form>
      </div>
    </div>
  );
}
