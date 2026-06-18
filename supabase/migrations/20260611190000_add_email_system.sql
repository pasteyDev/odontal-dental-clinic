CREATE TYPE public.email_campaign_status AS ENUM ('draft', 'queued', 'sending', 'sent', 'cancelled');
CREATE TYPE public.email_queue_status AS ENUM ('pending', 'sending', 'sent', 'failed', 'cancelled');

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN unsubscribe_token TEXT,
  ADD COLUMN unsubscribed_at TIMESTAMPTZ;

UPDATE public.newsletter_subscribers
SET unsubscribe_token = encode(gen_random_bytes(24), 'hex')
WHERE unsubscribe_token IS NULL;

ALTER TABLE public.newsletter_subscribers
  ALTER COLUMN unsubscribe_token SET DEFAULT encode(gen_random_bytes(24), 'hex'),
  ALTER COLUMN unsubscribe_token SET NOT NULL;

CREATE UNIQUE INDEX newsletter_subscribers_unsubscribe_token_unique
  ON public.newsletter_subscribers(unsubscribe_token);

CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL DEFAULT 'custom' CHECK (kind IN ('newsletter', 'review_request', 'custom')),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status public.email_campaign_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  queued_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX email_campaigns_created_idx ON public.email_campaigns(created_at DESC);
CREATE INDEX email_campaigns_status_idx ON public.email_campaigns(status);

CREATE TABLE public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  unsubscribe_token TEXT,
  status public.email_queue_status NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  brevo_message_id TEXT,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX email_queue_campaign_email_unique
  ON public.email_queue(campaign_id, recipient_email);
CREATE INDEX email_queue_campaign_status_idx ON public.email_queue(campaign_id, status);
CREATE INDEX email_queue_status_created_idx ON public.email_queue(status, created_at);
CREATE INDEX email_queue_sent_at_idx ON public.email_queue(sent_at);

GRANT SELECT, INSERT, UPDATE ON public.email_campaigns TO authenticated;
GRANT ALL ON public.email_campaigns TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.email_queue TO authenticated;
GRANT ALL ON public.email_queue TO service_role;

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff reads email campaigns" ON public.email_campaigns
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins and receptionists manage email campaigns" ON public.email_campaigns
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'receptionist'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Staff reads email queue" ON public.email_queue
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins and receptionists manage email queue" ON public.email_queue
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'receptionist'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'receptionist'));
