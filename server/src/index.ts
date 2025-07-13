// server.ts
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDB } from './config/mongodb'; 
import { adminRouter } from './routes/adminRoute';
import { connectCloudinary } from './config/cloudinary';
import { doctorRouter } from './routes/doctorRoute';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());

//api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor',doctorRouter)
// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Medify Server is running!' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
}

app.get('/api/test', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'TypeScript API endpoint working!',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`🚀 Medify Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
}).on('error', (err: Error) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
