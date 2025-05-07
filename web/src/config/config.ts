type Environment = 'development' | 'production';

interface EnvironmentConfig {
    API_BASE_URL: string;
    DEBUG_MODE: boolean;
}

const ENV_CONFIG: Record<Environment, EnvironmentConfig> = {
    development: {
        API_BASE_URL: "http://127.0.0.1:3500",
        DEBUG_MODE: true,
    },
    production: {
        API_BASE_URL: "https://91.134.96.11:3500",
        DEBUG_MODE: false,
    },
};



const currentEnv: Environment = (process.env.NODE_ENV as Environment) || 'development';

export const CONFIG = ENV_CONFIG[currentEnv];
