import { useUser as useClerkUser } from '@clerk/clerk-react';

export default function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    fullName: user?.fullName,
    firstName: user?.firstName,
    lastName: user?.lastName,
    imageUrl: user?.imageUrl,
  };
}
