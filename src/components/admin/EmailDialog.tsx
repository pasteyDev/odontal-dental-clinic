import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Send } from "lucide-react";
import { sendIndividualEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type EmailDialogProps = {
  toEmail?: string | null;
  toName?: string | null;
  initialSubject: string;
  initialBody: string;
  replacements?: Record<string, string | null | undefined>;
  triggerLabel?: string;
  size?: "sm" | "default";
  variant?: "default" | "outline" | "secondary" | "ghost";
  onSent?: () => void;
};

function applyReplacements(value: string, replacements: EmailDialogProps["replacements"]) {
  let next = value;
  for (const [key, replacement] of Object.entries(replacements ?? {})) {
    next = next.replaceAll(`{${key}}`, replacement ?? "");
  }
  return next;
}

export function EmailDialog({
  toEmail,
  toName,
  initialSubject,
  initialBody,
  replacements,
  triggerLabel = "Email",
  size = "sm",
  variant = "outline",
  onSent,
}: EmailDialogProps) {
  const sendEmail = useServerFn(sendIndividualEmail);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!toEmail) {
      toast.error("This record has no email address.");
      return;
    }
    setLoading(true);
    try {
      await sendEmail({
        data: {
          toEmail,
          toName: toName ?? "",
          subject: applyReplacements(subject, replacements),
          body: applyReplacements(body, replacements),
        },
      });
      toast.success("Email sent");
      setOpen(false);
      onSent?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className="rounded-full"
        onClick={() => {
          if (!toEmail) {
            toast.error("This record has no email address.");
            return;
          }
          setSubject(initialSubject);
          setBody(initialBody);
          setOpen(true);
        }}
      >
        <Mail className="h-4 w-4" /> {triggerLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Send email</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <div>
              <Label>To</Label>
              <Input className="mt-1.5" value={toEmail ?? ""} readOnly />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="mt-1.5"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                className="mt-1.5 min-h-48"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading} className="rounded-full">
                <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
