"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AISource } from "@/lib/types";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: AISource;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  source,
  onConfirm,
  isLoading,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Elimina fonte</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler eliminare{" "}
            <span className="font-semibold text-foreground">{source?.name}</span>?
            Questa azione non può essere annullata.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Eliminazione..." : "Elimina"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
