// Quick help responses for common queries
const QUICK_HELP_MAP = {
  'help': {
    response: 'Welcome to Neothink DAO! You can ask about our features, community, or navigation. What would you like to know?',
    keywords: ['help', 'guide', 'assistance', 'support'],
  },
  'login': {
    response: 'To log in, click "Sign In" in the top right. You can use email/password or social login.',
    keywords: ['login', 'signin', 'sign in', 'access'],
  },
  'signup': {
    response: 'To join, click "Sign Up" and follow the steps. You\'ll need to verify your email to complete registration.',
    keywords: ['signup', 'register', 'join', 'create account'],
  },
  'password': {
    response: 'Forgot your password? Click "Forgot Password" on the login page and follow the email instructions.',
    keywords: ['password', 'reset', 'forgot', 'change password'],
  },
  'features': {
    response: 'Neothink DAO offers AI-powered chat, community collaboration, and knowledge sharing. What feature interests you?',
    keywords: ['features', 'capabilities', 'what can you do', 'functionality'],
  },
  'community': {
    response: 'Our community includes Ascenders, Immortals, and Neothinkers. Each group has unique features and discussions.',
    keywords: ['community', 'groups', 'members', 'participate'],
  },
};

/**
 * Get quick help response for common queries
 * @param {string} message - User's message
 * @returns {string|null} Quick help response or null if no match
 */
export function getQuickHelp(message) {
  if (!message) return null;
  
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check for exact matches first
  for (const [key, { response }] of Object.entries(QUICK_HELP_MAP)) {
    if (normalizedMessage === key) {
      return response;
    }
  }
  
  // Check for keyword matches
  for (const { response, keywords } of Object.values(QUICK_HELP_MAP)) {
    if (keywords.some(keyword => 
      normalizedMessage.includes(keyword) || 
      normalizedMessage.startsWith(`${keyword} `) || 
      normalizedMessage.endsWith(` ${keyword}`)
    )) {
      return response;
    }
  }
  
  return null;
} 