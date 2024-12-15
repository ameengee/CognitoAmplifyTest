import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    // Parse the query params from the callback URL
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && idToken && refreshToken) {
      // Store tokens or user info in state/store or session
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('id_token', idToken);
      localStorage.setItem('refresh_token', refreshToken);

      console.log('access_token', accessToken);
      console.log('id_token', idToken);
      console.log('refresh_token', refreshToken);

      // Redirect to the main page after successful login
      router.push('/');
    } else {
      console.error('Failed to retrieve tokens.');
    }
  }, [router]);

  return (
    <div>
      <h2>Processing authentication...</h2>
    </div>
  );
};

export default Callback;
