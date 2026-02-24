"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AISource, AISourceFormData, CATEGORIES } from "@/lib/types";

interface SourceFormProps {
  initial?: AISource;
  onSubmit: (data: AISourceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SourceForm({ initial, onSubmit, onCancel, isLoading }: SourceFormProps) {
  const [form, setForm] = useState<AISourceFormData>({
    name: initial?.name || "",
    url: initial?.url || "",
    category: initial?.category || "",
    description: initial?.description || "",
    tags: initial?.tags || "",
    isFavorite: initial?.isFavorite || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="es. ChatGPT"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Categoria *</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm({ ...form, category: v })}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Breve descrizione della fonte..."
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tag (separati da virgola)</Label>
        <Input
          id="tags"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="es. gpt, openai, chat"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isFavorite"
          type="checkbox"
          checked={form.isFavorite}
          onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isFavorite" className="cursor-pointer">
          Aggiungi ai preferiti
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvataggio..." : initial ? "Salva modifiche" : "Aggiungi fonte"}
        </Button>
      </div>
    </form>
  );
}
