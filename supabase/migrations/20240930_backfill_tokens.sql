-- Retroactively award tokens for existing reports
-- This script awards 50 tokens for each existing report that a user has submitted

-- First, ensure all users who have submitted reports have profiles
INSERT INTO public.profiles (id, points, created_at, updated_at)
SELECT DISTINCT reporter_id, 0, NOW(), NOW()
FROM public.reports 
WHERE reporter_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Award 50 tokens for each existing report
UPDATE public.profiles 
SET points = (
  SELECT COUNT(*) * 50 
  FROM public.reports 
  WHERE reports.reporter_id = profiles.id
),
updated_at = NOW()
WHERE id IN (
  SELECT DISTINCT reporter_id 
  FROM public.reports 
  WHERE reporter_id IS NOT NULL
);