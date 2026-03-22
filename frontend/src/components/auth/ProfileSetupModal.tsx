import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';
import { useAuthz } from '../../hooks/useAuthz';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { isAuthenticated } = useAuthz();
  const { userProfile, isLoading: profileLoading, isFetched } = useCurrentUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  const showModal = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!showModal) {
      setName('');
    }
  }, [showModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <Dialog open={showModal}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Let's get started</DialogTitle>
          <DialogDescription>
            Please tell us your name to complete your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              disabled={saveProfile.isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
