-- Add token rewards system
-- This migration adds the RPC function to safely award tokens to users

-- Create RPC function to increment user points
CREATE OR REPLACE FUNCTION public.increment_user_points(user_id UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET points = COALESCE(points, 0) + points_to_add,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- If no row was updated, insert a new profile
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, points, created_at, updated_at)
    VALUES (user_id, points_to_add, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET 
      points = COALESCE(profiles.points, 0) + points_to_add,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_user_points TO authenticated;