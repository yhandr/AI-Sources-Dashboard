"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SourceDialog } from "@/components/sources/source-dialog";
import { DeleteDialog } from "@/components/sources/delete-dialog";
import { SourcesTable } from "@/components/sources/sources-table";
import { AISource, AISourceFormData, CATEGORIES } from "@/lib/types";
import Image from "next/image";
import { Plus, Search, Star } from "lucide-react";

export default function Home() {
  const [sources, setSources] = useState<AISource[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editSource, setEditSource] = useState<AISource | undefined>();
  const [deleteSource, setDeleteSource] = useState<AISource | undefined>();

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category && category !== "all") params.set("category", category);

      const res = await fetch(`/api/sources?${params}`);
      const data = await res.json();
      setSources(data);
    } catch {
      toast.error("Errore nel caricamento delle fonti");
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleAdd = async (data: AISourceFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Fonte aggiunta con successo");
      setAddOpen(false);
      fetchSources();
    } catch {
      toast.error("Errore durante l'aggiunta della fonte");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: AISourceFormData) => {
    if (!editSource) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/sources/${editSource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Fonte aggiornata con successo");
      setEditSource(undefined);
      fetchSources();
    } catch {
      toast.error("Errore durante la modifica della fonte");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSource) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/sources/${deleteSource.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Fonte eliminata");
      setDeleteSource(undefined);
      fetchSources();
    } catch {
      toast.error("Errore durante l'eliminazione");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (source: AISource) => {
    try {
      await fetch(`/api/sources/${source.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !source.isFavorite }),
      });
      fetchSources();
    } catch {
      toast.error("Errore nell'aggiornamento dei preferiti");
    }
  };

  const filteredSources = favoritesOnly
    ? sources.filter((s) => s.isFavorite)
    : sources;

  const favoriteCount = sources.filter((s) => s.isFavorite).length;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/xsolve_logo_black.png"
              alt="XSolve"
              width={120}
              height={40}
              className="dark:invert"
              priority
            />
            <div className="w-px h-8 bg-border" />
            <div>
              <h1 className="text-sm font-semibold leading-tight">AI Sources Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Gestisci le tue fonti e risorse AI
              </p>
            </div>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi fonte
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Totale fonti</p>
            <p className="text-2xl font-bold mt-1">{sources.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Preferiti</p>
            <p className="text-2xl font-bold mt-1">{favoriteCount}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Categorie</p>
            <p className="text-2xl font-bold mt-1">
              {new Set(sources.map((s) => s.category)).size}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome, tag, descrizione..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={favoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className="gap-2"
          >
            <Star className="h-4 w-4" fill={favoritesOnly ? "currentColor" : "none"} />
            Preferiti
            {favoriteCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {favoriteCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            Caricamento...
          </div>
        ) : (
          <SourcesTable
            sources={filteredSources}
            onEdit={setEditSource}
            onDelete={setDeleteSource}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Dialogs */}
      <SourceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        isLoading={isSubmitting}
      />
      <SourceDialog
        open={!!editSource}
        onOpenChange={(open) => !open && setEditSource(undefined)}
        source={editSource}
        onSubmit={handleEdit}
        isLoading={isSubmitting}
      />
      <DeleteDialog
        open={!!deleteSource}
        onOpenChange={(open) => !open && setDeleteSource(undefined)}
        source={deleteSource}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
