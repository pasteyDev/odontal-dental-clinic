CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  reviewer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX reviews_approved_created_idx ON public.reviews (approved, created_at DESC);

CREATE TABLE public.daily_review_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day DATE NOT NULL UNIQUE,
  review_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.get_random_review_ids(_limit integer)
RETURNS TABLE (id UUID) LANGUAGE SQL STABLE AS $$
  SELECT id FROM public.reviews WHERE approved = TRUE ORDER BY random() LIMIT _limit;
$$;

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (approved = TRUE);
CREATE POLICY "Staff reads all reviews" ON public.reviews FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.daily_review_selection TO authenticated;
GRANT ALL ON public.daily_review_selection TO service_role;
ALTER TABLE public.daily_review_selection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage daily selection" ON public.daily_review_selection FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT EXECUTE ON FUNCTION public.get_random_review_ids(integer) TO service_role;
