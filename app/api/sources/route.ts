import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const sources = await prisma.aISource.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } },
              ],
            }
          : {},
        category ? { category } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sources);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, url, category, description, tags, isFavorite } = body;

  if (!name || !url || !category) {
    return NextResponse.json(
      { error: "name, url e category sono obbligatori" },
      { status: 400 }
    );
  }

  const source = await prisma.aISource.create({
    data: {
      name,
      url,
      category,
      description: description || null,
      tags: Array.isArray(tags) ? tags.join(",") : tags || "",
      isFavorite: isFavorite || false,
    },
  });

  return NextResponse.json(source, { status: 201 });
}
