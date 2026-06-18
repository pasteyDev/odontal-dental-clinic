import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMessages, toggleMessageHandled } from "@/lib/admin.functions";
import { EmailDialog } from "@/components/admin/EmailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({ component: Messages });

function Messages() {
  const fn = useServerFn(listMessages);
  const tog = useServerFn(toggleMessageHandled);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["messages"], queryFn: () => fn() });

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Messages</h1>
      <div className="mt-4 grid gap-3">
        {data.map((m) => (
          <Card key={m.id} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {m.name} <span className="text-muted-foreground">- {m.email}</span>
                  </div>
                  {m.phone && <div className="text-sm text-muted-foreground">{m.phone}</div>}
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <EmailDialog
                    toEmail={m.email}
                    toName={m.name}
                    triggerLabel="Reply"
                    initialSubject="Re: Your message to Odontal Dental Clinic"
                    initialBody={`Hello ${m.name},

Thank you for contacting Odontal Dental Clinic.

Odontal Dental Clinic`}
                  />
                  <Button
                    variant={m.handled ? "outline" : "default"}
                    size="sm"
                    className="rounded-full"
                    onClick={async () => {
                      await tog({ data: { id: m.id, handled: !m.handled } });
                      qc.invalidateQueries({ queryKey: ["messages"] });
                      toast.success("Updated");
                    }}
                  >
                    {m.handled ? "Reopen" : "Mark handled"}
                  </Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}
