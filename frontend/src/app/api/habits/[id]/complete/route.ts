import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habitId = params.id;
  const todayStr = new Date().toISOString().split("T")[0];

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if already completed today
  const existingLog = await prisma.log.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: todayStr,
      },
    },
  });

  if (existingLog) {
    return NextResponse.json({ message: "Already completed" });
  }

  // Calculate streak
  let newStreak = 1;
  if (habit.lastCompleted) {
    const lastDate = new Date(habit.lastCompleted);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const threshold = habit.frequency === "daily" ? 1 : 7;
    if (diffDays <= threshold) {
      newStreak = habit.streakCurrent + 1;
    }
  }

  const newLongest = Math.max(habit.streakLongest, newStreak);

  // Update in a transaction
  await prisma.$transaction([
    prisma.log.create({
      data: {
        habitId,
        date: todayStr,
      },
    }),
    prisma.habit.update({
      where: { id: habitId },
      data: {
        streakCurrent: newStreak,
        streakLongest: newLongest,
        lastCompleted: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ message: "Success", streak: newStreak });
}
