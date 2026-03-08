import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: "daily" | "weekly";
  streakCurrent: number;
  streakLongest: number;
  lastCompleted: string | null;
  logs?: any[];
}

export const useHabits = () => {
  const { data: session } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(data.map((h: any) => ({
        ...h,
        lastCompleted: h.lastCompleted || null,
        // Map logs to show if completed today
        isCompletedToday: h.logs?.length > 0
      })));
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHabits();
    }
  }, [session]);

  const toggleComplete = async (habit: Habit) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/habits/${habit.id}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchHabits(); // Refresh list
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const addHabit = async (habitData: { name: string; icon: string; frequency: string }) => {
    if (!session) return;

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });
      if (res.ok) {
        await fetchHabits();
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return { habits, loading, toggleComplete, addHabit };
};
