import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function SSOCallback() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleSSOCallback = async () => {
      try {
        // Verify the token from the URL
        const token = searchParams.get('token');
        const redirectUrl = searchParams.get('redirect_url') || '/';

        if (token) {
          // Store the token in localStorage or your state management
          localStorage.setItem('clerk_token', token);
          
          // Navigate to the intended URL
          window.location.href = redirectUrl;
        } else {
          throw new Error('No token found in URL');
        }
      } catch (error) {
        console.error('Error during SSO callback:', error);
        navigate('/sign-in?error=authentication_failed');
      }
    };

    handleSSOCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Completing sign in...</h1>
        <p className="text-gray-600">Please wait while we log you in.</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
