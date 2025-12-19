// Environment validation utility
const requiredEnvVars = [
  'JWT_SECRET',
  'POSTGRES_HOST',
  'POSTGRES_PORT', 
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'TWILIO_VERIFY_SERVICE_SID',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'ADMIN_PHONE_1'
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => console.error(`  - ${envVar}`));
    console.error('\nPlease check your .env file and ENVIRONMENT_SETUP.md for configuration instructions.');
    process.exit(1);
  }
  
  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long for security');
  }
  
  // Check for development defaults in production
  if (process.env.NODE_ENV === 'production') {
    const developmentDefaults = [
      { key: 'JWT_SECRET', dev: 'your_jwt_secret' },
      { key: 'POSTGRES_PASSWORD', dev: 'password' }
    ];
    
    developmentDefaults.forEach(({ key, dev }) => {
      if (process.env[key] === dev) {
        console.error(`❌ Production environment detected but ${key} is set to development default value`);
        process.exit(1);
      }
    });
  }
  
  console.log('✅ Environment variables validated successfully');
}

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    dbHost: process.env.POSTGRES_HOST,
    hasRequiredVars: requiredEnvVars.every(envVar => process.env[envVar])
  };
}