import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        where: {
          date: new Date().toISOString().split("T")[0],
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, icon, frequency } = await req.json();

  const habit = await prisma.habit.create({
    data: {
      name,
      icon,
      frequency,
      userId: session.user.id,
    },
  });

  return NextResponse.json(habit);
}
