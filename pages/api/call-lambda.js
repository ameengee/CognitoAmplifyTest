export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Replace this with your actual Lambda Function URL
        const lambdaUrl = 'https://yupwyoab6zqbej4gg5olpj5j7u0jrhbs.lambda-url.us-west-1.on.aws/';
  
        const lambdaResponse = await fetch(lambdaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'value' }) // Optional payload
        });
  
        const data = await lambdaResponse.json();
        res.status(200).json({ message: 'Lambda called successfully!', data });
      } catch (error) {
        console.error('Error calling Lambda:', error);
        res.status(500).json({ error: 'Failed to call Lambda function' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }