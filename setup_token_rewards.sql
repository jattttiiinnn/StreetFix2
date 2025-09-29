-- Run this SQL in your Supabase SQL Editor to set up token rewards

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

-- Grant permission to use the function
GRANT EXECUTE ON FUNCTION public.increment_user_points TO authenticated;

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for the function to update profiles
CREATE POLICY "Allow token function to update profiles" ON public.profiles
  FOR ALL USING (true);