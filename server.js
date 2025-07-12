import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Mock API endpoint for testing
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Mock response for testing
    // TODO: Replace with actual OpenRouter API integration
    // You'll need to:
    // 1. Get an API key from https://openrouter.ai/
    // 2. Use the correct API endpoint: https://openrouter.ai/api/v1/chat/completions
    // 3. Set the Authorization header with your API key
    
    const mockResponse = {
      suggestedComponents: ["Button", "TextInput", "Card", "Container"],
      codeSnippet: `import React from 'react';
import { Button, TextInput, Card, Container } from '@visa/nova-react';

const GeneratedComponent = () => {
  return (
    <Container className="p-6">
      <Card className="max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Generated UI for: "${prompt}"
          </h2>
          <div className="space-y-4">
            <TextInput
              label="Example Input"
              placeholder="Enter some text..."
              className="w-full"
            />
            <Button
              variant="primary"
              className="w-full"
              onClick={() => console.log('Button clicked!')}
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default GeneratedComponent;`
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json(mockResponse);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate code',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 