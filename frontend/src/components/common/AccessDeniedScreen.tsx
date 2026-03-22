import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            You need to be signed in to access this page. Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={login} disabled={loginStatus === 'logging-in'}>
            {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
