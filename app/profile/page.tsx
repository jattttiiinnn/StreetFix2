import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Auth from '@/components/auth/Auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SignOutButton from '@/components/auth/SignOutButton';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to StreetFix</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to view your profile</p>
          </div>
          <Auth />
        </div>
      </div>
    );
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get user's reported reports (real data)
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false });

  // Get user's points from the profile or default to 0
  const points = profile?.points || 0;
  const username = profile?.username || user.email?.split('@')[0] || 'User';
  
  // Handle avatar URL - check if it's a full URL or needs the Supabase storage URL
  let avatarUrl = '';
  if (profile?.avatar_url) {
    // If it's already a full URL, use it as is
    if (profile.avatar_url.startsWith('http')) {
      avatarUrl = profile.avatar_url;
    } 
    // If it's a path in Supabase Storage, construct the full URL
    else if (profile.avatar_url.startsWith('avatars/')) {
      const { data: { publicUrl } } = await supabase
        .storage
        .from('avatars')
        .getPublicUrl(profile.avatar_url.replace('avatars/', ''));
      avatarUrl = publicUrl;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback className="text-2xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{username}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{reports?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Reports</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">{points}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignOutButton />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Recent Reports</h2>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          report.status === 'resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/reports/${report.id}`}>View</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You haven't reported any issues yet.</p>
                <Button className="mt-4" asChild>
                  <a href="/report">Report an Issue</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
