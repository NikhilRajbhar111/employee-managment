import { app } from './app';
import { connectDatabase } from './config/database';
import { config } from './config/config';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`
🚀 Server running in ${config.NODE_ENV} mode
🌐 Port: ${config.PORT}
📊 Database: Connected to MongoDB
🔐 JWT Authentication: Enabled
📍 Location API: ${config.COUNTRIES_API_URL}
      `);
    });

    // Handle server shutdown gracefully
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();