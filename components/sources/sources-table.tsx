"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AISource } from "@/lib/types";
import { MoreHorizontal, Pencil, Trash2, Star, ExternalLink } from "lucide-react";

interface SourcesTableProps {
  sources: AISource[];
  onEdit: (source: AISource) => void;
  onDelete: (source: AISource) => void;
  onToggleFavorite: (source: AISource) => void;
}

export function SourcesTable({
  sources,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SourcesTableProps) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Nessuna fonte trovata</p>
        <p className="text-sm mt-1">Aggiungi la prima fonte AI per iniziare.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell>
                <button
                  onClick={() => onToggleFavorite(source)}
                  className="text-muted-foreground hover:text-yellow-400 transition-colors"
                  title={source.isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                >
                  <Star
                    className="h-4 w-4"
                    fill={source.isFavorite ? "currentColor" : "none"}
                    color={source.isFavorite ? "#facc15" : undefined}
                  />
                </button>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline flex items-center gap-1"
                  >
                    {source.name}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {source.url}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{source.category}</Badge>
              </TableCell>
              <TableCell className="max-w-[250px]">
                <p className="text-sm text-muted-foreground truncate">
                  {source.description || "—"}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {source.tags
                    ? source.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                    : "—"}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(source)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(source)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
