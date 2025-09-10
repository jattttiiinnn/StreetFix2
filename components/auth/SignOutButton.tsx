'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SignOutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'link';
}

export default function SignOutButton({ className, variant = 'ghost', ...props }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/signin');
  };

  return (
    <Button 
      variant={variant}
      onClick={handleSignOut}
      className={cn("text-sm font-medium text-gray-700 hover:bg-gray-100", className)}
      {...props}
    >
      Sign out
    </Button>
  );
}
