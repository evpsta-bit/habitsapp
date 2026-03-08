"use client";

import { useSession, signOut } from "next-auth/react";
import { useHabits, Habit } from "@/hooks/useHabits";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NewHabitModal from "@/components/NewHabitModal";
import ProgressCharts from "@/components/ProgressCharts";

export default function Home() {
  const { data: session, status } = useSession();
  const { habits, loading: habitsLoading, toggleComplete } = useHabits();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  if (status === "loading" || habitsLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-brown tracking-tight">Morning, {session.user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-accent-brown/60 text-sm font-medium">{currentDate}</p>
        </div>
        <button onClick={() => signOut()} className="relative group">
          <img 
            src={session.user?.image || ""} 
            alt="avatar" 
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm group-hover:ring-4 group-hover:ring-primary/20 transition-all" 
          />
        </button>
      </header>

      {/* Hero / CTA */}
      <section className="bg-secondary rounded-[32px] p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
        <div className="space-y-3 z-10">
          <h2 className="text-xl font-bold text-accent-brown">Set the reminder</h2>
          <p className="text-accent-brown/60 text-xs max-w-[180px] leading-relaxed">
            Never miss your morning routine! Set a reminder to stay on track.
          </p>
          <button className="bg-accent-brown text-white px-6 py-2 rounded-full text-xs font-bold hover:scale-[1.05] transition-transform">
            Set Now
          </button>
        </div>
        <div className="w-24 h-24 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4 shadow-inner">
            <span className="text-5xl">📅</span>
        </div>
      </section>

      {/* Habits List */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-bold text-accent-brown">Daily routine</h2>
          <button className="text-primary text-sm font-bold hover:underline">See all</button>
        </div>
        
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-12 space-y-4">
               <div className="text-6xl opacity-20">✨</div>
               <p className="text-accent-brown/40 font-medium">No habits yet. Start small!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div 
                key={habit.id}
                onClick={() => toggleComplete(habit)}
                className="glass-card p-5 flex items-center justify-between group cursor-pointer hover:bg-white transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-secondary rounded-[20px] flex items-center justify-center text-3xl shadow-sm group-hover:bg-primary/10 transition-colors">
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-accent-brown text-base">{habit.name}</h3>
                    <p className="text-accent-brown/50 text-xs font-semibold">Streak {habit.streakCurrent} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-accent-brown/40 text-[10px] font-bold uppercase tracking-widest">{habit.frequency}</span>
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center group-hover:border-primary transition-all duration-300">
                        <div className={`w-4 h-4 rounded-full bg-primary transition-transform duration-300 ${habit.lastCompleted ? 'scale-100' : 'scale-0'}`}></div>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-12 right-6 md:right-12 w-16 h-16 bg-accent-brown text-white rounded-[24px] flex items-center justify-center text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
      >
        +
      </button>

      <NewHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Progress & Insights Section */}
      {habits.length > 0 && (
        <section className="pb-12">
          <ProgressCharts habits={habits} />
        </section>
      )}
    </main>
  );
}
