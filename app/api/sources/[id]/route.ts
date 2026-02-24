import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const source = await prisma.aISource.findUnique({ where: { id } });

  if (!source) {
    return NextResponse.json({ error: "Fonte non trovata" }, { status: 404 });
  }

  return NextResponse.json(source);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, url, category, description, tags, isFavorite } = body;

  const existing = await prisma.aISource.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Fonte non trovata" }, { status: 404 });
  }

  const source = await prisma.aISource.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      url: url ?? existing.url,
      category: category ?? existing.category,
      description: description !== undefined ? description : existing.description,
      tags: tags !== undefined
        ? Array.isArray(tags) ? tags.join(",") : tags
        : existing.tags,
      isFavorite: isFavorite !== undefined ? isFavorite : existing.isFavorite,
    },
  });

  return NextResponse.json(source);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.aISource.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Fonte non trovata" }, { status: 404 });
  }

  await prisma.aISource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
