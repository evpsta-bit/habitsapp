"use client";

import React from "react";
import { Habit } from "@/hooks/useHabits";

interface ProgressChartsProps {
  habits: Habit[];
}

const COLORS = [
  "bg-accent-brown",
  "bg-primary",
  "bg-accent-green",
  "bg-accent-pink"
];

export default function ProgressCharts({ habits }: ProgressChartsProps) {
  return (
    <div className="glass-card p-6 space-y-8">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-accent-brown">Your progress and insights</h2>
        <button className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs text-accent-brown/40">✕</button>
      </div>

      <div className="flex justify-between items-end gap-2 h-48 px-2">
        {habits.slice(0, 4).map((habit, i) => {
          const percentage = Math.min(100, Math.max(20, (habit.streakCurrent / 30) * 100)); // Mock logic for visualization
          return (
            <div key={habit.id} className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-secondary rounded-full h-full relative overflow-hidden flex items-end">
                <div 
                   className={`${COLORS[i % COLORS.length]} w-full rounded-2xl transition-all duration-1000 ease-out`}
                   style={{ height: `${percentage}%` }}
                >
                    <span className="absolute bottom-2 left-0 right-0 text-[10px] text-white font-bold text-center">
                        {Math.floor(percentage)}%
                    </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-accent-brown/40 uppercase tracking-tighter truncate w-full text-center">
                {habit.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-white/40 p-5 rounded-[24px] space-y-4">
        <div className="flex justify-between items-baseline">
            <h3 className="text-xs font-bold text-accent-brown/50 uppercase tracking-widest">Points Earned</h3>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">842</span>
                <span className="text-xs font-bold text-accent-brown/40">Points</span>
            </div>
        </div>
        <p className="text-[10px] font-medium text-accent-brown/30">For this week</p>
        
        <div className="flex justify-between pt-2 border-t border-accent-brown/5">
            <div className="text-center">
                <p className="text-[10px] text-accent-brown/30 font-bold uppercase">Post</p>
                <p className="text-xs font-black text-accent-brown">440 lb</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-accent-brown/30 font-bold uppercase">Forest area</p>
                <p className="text-xs font-black text-accent-brown">200 ft²</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-accent-brown/30 font-bold uppercase">Time</p>
                <p className="text-xs font-black text-accent-brown">7h 30m</p>
            </div>
        </div>
      </div>

      <button className="w-full py-4 bg-primary text-white rounded-[20px] font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
        Share Progress
      </button>
    </div>
  );
}
