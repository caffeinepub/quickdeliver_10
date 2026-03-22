import { useGetCallerUserProfile } from './useQueries';

export function useCurrentUserProfile() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  return {
    userProfile,
    isLoading,
    isFetched,
  };
}
