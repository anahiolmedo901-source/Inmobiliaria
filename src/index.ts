import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import { testConnection } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import agentRoutes from './routes/agents';
import developmentRoutes from './routes/developments';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: ENV.CORS_ORIGIN.split(',').map(s => s.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

if (ENV.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && ENV.SSL_CERT_PATH) {
      return res.redirect(`https://${req.hostname}${ENV.HTTPS_PORT !== 443 ? `:${ENV.HTTPS_PORT}` : ''}${req.url}`);
    }
    next();
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', env: ENV.NODE_ENV } });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/developments', developmentRoutes);

app.use(errorHandler);

async function start() {
  try {
    await testConnection();

    const httpServer = app.listen(ENV.PORT, () => {
      console.log(`[HTTP]  http://localhost:${ENV.PORT}/api/health`);
    });

    if (ENV.SSL_CERT_PATH && ENV.SSL_KEY_PATH) {
      try {
        const fs = await import('fs');
        const https = await import('https');
        const key = fs.readFileSync(ENV.SSL_KEY_PATH, 'utf8');
        const cert = fs.readFileSync(ENV.SSL_CERT_PATH, 'utf8');
        https.createServer({ key, cert }, app).listen(ENV.HTTPS_PORT, () => {
          console.log(`[HTTPS] https://localhost:${ENV.HTTPS_PORT}/api/health`);
        });
      } catch (sslErr) {
        console.error('[HTTPS] No se pudo iniciar servidor HTTPS:', sslErr instanceof Error ? sslErr.message : sslErr);
      }
    }

    if (ENV.NODE_ENV === 'production' && !ENV.SSL_CERT_PATH) {
      console.warn('[HTTPS] ADVERTENCIA: SSL no configurado. Usa HTTPS_PORT + SSL_CERT_PATH + SSL_KEY_PATH.');
    }
  } catch (err) {
    console.error('[Server] Error al iniciar:', err);
    process.exit(1);
  }
}

start();
