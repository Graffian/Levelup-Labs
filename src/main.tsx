
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom';

// Your Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_bm9ybWFsLW1hbmF0ZWUtMzcuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

// Configure Clerk appearance
const clerkAppearance = {
  elements: {
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
    footerActionLink: 'text-blue-600 hover:text-blue-700',
  },
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <App />
    </ClerkProvider>
  </BrowserRouter>
);
