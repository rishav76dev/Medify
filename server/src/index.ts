import express, { Request, Response, Application } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Routes with proper TypeScript types
app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'Medify Server is running!' });
});

app.get('/api/health', (req: Request, res: Response): void => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API route example with typed response
interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
}

app.get('/api/test', (req: Request, res: Response<ApiResponse>): void => {
  res.json({
    success: true,
    message: 'TypeScript API endpoint working!',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware with types
app.use((err: Error, req: Request, res: Response, next: Function): void => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server with proper error handling
app.listen(PORT, (): void => {
  console.log(`🚀 Medify Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err: Error): void => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});