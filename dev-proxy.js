#!/usr/bin/env node

/**
 * Development Proxy Server for ShipShipShip Template
 *
 * This proxy allows frontend developers to work against protected backends
 * without exposing JWT tokens in frontend environment variables.
 *
 * Usage:
 *   node dev-proxy.js
 *
 * Environment Variables:
 *   BACKEND_URL - The ShipShipShip backend URL (default: http://localhost:8080)
 *   JWT_TOKEN - JWT token for backend authentication (server-side only)
 *   PROXY_PORT - Port for the proxy server (default: 3001)
 */

const http = require('http');
const https = require('https');
const url = require('url');

// Configuration from environment variables
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const JWT_TOKEN = process.env.JWT_TOKEN || '';
const PROXY_PORT = process.env.PROXY_PORT || 3001;

// Parse backend URL
const backendUrl = new URL(BACKEND_URL);
const isHttps = backendUrl.protocol === 'https:';
const httpModule = isHttps ? https : http;

/**
 * Create proxy server
 */
const proxyServer = http.createServer((req, res) => {
  // Enable CORS for frontend development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse request URL
  const requestUrl = url.parse(req.url);

  // Only proxy API requests
  if (!requestUrl.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Only /api/* endpoints are proxied' }));
    return;
  }

  // Prepare proxy request options
  const proxyOptions = {
    hostname: backendUrl.hostname,
    port: backendUrl.port || (isHttps ? 443 : 80),
    path: requestUrl.pathname + (requestUrl.search || ''),
    method: req.method,
    headers: {
      ...req.headers,
      host: backendUrl.host,
    }
  };

  // Add JWT token if available (server-side only)
  if (JWT_TOKEN) {
    proxyOptions.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
  }

  // Remove connection headers that can cause issues
  delete proxyOptions.headers.connection;
  delete proxyOptions.headers['keep-alive'];

  console.log(`🔀 Proxying ${req.method} ${req.url} → ${BACKEND_URL}${requestUrl.pathname}`);

  // Create proxy request
  const proxyReq = httpModule.request(proxyOptions, (proxyRes) => {
    // Forward response headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    // Forward status code
    res.writeHead(proxyRes.statusCode);

    // Pipe response data
    proxyRes.pipe(res);
  });

  // Handle proxy request errors
  proxyReq.on('error', (error) => {
    console.error('❌ Proxy request error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Proxy request failed',
      details: error.message
    }));
  });

  // Handle client request errors
  req.on('error', (error) => {
    console.error('❌ Client request error:', error.message);
    proxyReq.destroy();
  });

  // Pipe request data
  req.pipe(proxyReq);
});

// Handle server errors
proxyServer.on('error', (error) => {
  console.error('❌ Proxy server error:', error.message);
  process.exit(1);
});

// Start the proxy server
proxyServer.listen(PROXY_PORT, () => {
  console.log('\n🚀 ShipShipShip Development Proxy Server');
  console.log('==========================================');
  console.log(`📡 Proxy URL: http://localhost:${PROXY_PORT}`);
  console.log(`🎯 Backend: ${BACKEND_URL}`);
  console.log(`🔐 JWT Token: ${JWT_TOKEN ? '✅ Configured' : '❌ Not set'}`);
  console.log('==========================================');
  console.log('\n📋 Usage:');
  console.log('1. Set your frontend environment:');
  console.log(`   VITE_ADMIN_API_URL=http://localhost:${PROXY_PORT}`);
  console.log('2. Start your frontend dev server:');
  console.log('   npm run dev');
  console.log('\n🔧 Configuration:');
  console.log('   BACKEND_URL - Backend URL (current: ' + BACKEND_URL + ')');
  console.log('   JWT_TOKEN - JWT token for auth (current: ' + (JWT_TOKEN ? 'set' : 'not set') + ')');
  console.log('   PROXY_PORT - Proxy port (current: ' + PROXY_PORT + ')');
  console.log('\n🛡️ Security Notes:');
  console.log('   • JWT token stays on your local machine (not in frontend)');
  console.log('   • Use this only for development');
  console.log('   • Never commit JWT tokens to version control');
  console.log('\n✨ Ready for development!\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down proxy server...');
  proxyServer.close(() => {
    console.log('✅ Proxy server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down proxy server...');
  proxyServer.close(() => {
    console.log('✅ Proxy server stopped');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
