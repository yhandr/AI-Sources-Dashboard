"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SourceForm } from "./source-form";
import { AISource, AISourceFormData } from "@/lib/types";

interface SourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: AISource;
  onSubmit: (data: AISourceFormData) => Promise<void>;
  isLoading?: boolean;
}

export function SourceDialog({
  open,
  onOpenChange,
  source,
  onSubmit,
  isLoading,
}: SourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {source ? "Modifica fonte" : "Aggiungi nuova fonte"}
          </DialogTitle>
        </DialogHeader>
        <SourceForm
          initial={source}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
