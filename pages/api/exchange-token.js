// /pages/api/exchange-token.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  try {
    const clientId = '217rc9ici3mqaa768m3u2pllti';
    const clientSecret = '1oh0egllgs3coo5s34j75m6msecbgim8qkho535m6igcrs20iq96'; // Store this in environment variables for security
    const redirectUri = 'http://localhost:3000';

    const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://us-west-1ychwtpjpy.auth.us-west-1.amazoncognito.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code
      })
    });

    const data = await response.json();

    if (!data.id_token) {
      return res.status(400).json({ message: 'Token exchange failed', error: data });
    }

    // Decode the ID token to extract the username
    const payloadBase64 = data.id_token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const username = decodedPayload['cognito:username'] || decodedPayload['email'];

    console.log('Extracted Username:', username);

    res.status(200).json({ username });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
