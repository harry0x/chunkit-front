import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface CaptchaGateProps {
  children: React.ReactNode;
}

export function CaptchaGate({ children }: CaptchaGateProps) {
  const [passed, setPassed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check session storage on mount
    const isVerified = sessionStorage.getItem('captchaVerified');
    if (isVerified === 'true') {
      setPassed(true);
    }
  }, []);
  
  // Use the reCAPTCHA site key from environment variables
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  const handleCaptchaChange = async (token: string | null) => {
    if (token) {
      try {
        // Ideally verify with backend, but since there's no backend route yet, we'll just allow it
        sessionStorage.setItem('captchaVerified', 'true');
        setPassed(true);
        
        // Force redirect to home screen if they are not already there
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Captcha verification failed", error);
      }
    }
  };

  if (passed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-orb bg-orb--4" />
      </div>
      <div className="bg-grid" />
      
      <Card className="z-10 bg-card/80 border-border backdrop-blur-md w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground text-center text-2xl">Security Check</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Please verify that you are human to access Video Chunker SaaS.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleCaptchaChange}
            theme="light"
          />
        </CardContent>
      </Card>
    </div>
  );
}
