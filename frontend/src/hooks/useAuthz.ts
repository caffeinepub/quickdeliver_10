import { useInternetIdentity } from './useInternetIdentity';

export function useAuthz() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const getUnauthorizedMessage = () => {
    return 'You must be signed in to perform this action.';
  };

  return {
    isAuthenticated,
    getUnauthorizedMessage,
  };
}
