const ApiError = require("../utils/ApiError");

let OpenAIApi, Configuration;
try {
  ({ OpenAIApi, Configuration } = require("openai"));
} catch (_) {
  // openai not installed yet – will be added to package.json
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class SupportService {
  static async chatWithUser(message, user) {
    if (!message || message.trim() === "") {
      throw new ApiError(400, "Message is required");
    }

    // Enhanced system prompt for authenticated users
    const enhancedSystemPrompt = `You are SBI Assistant, a helpful and intelligent customer support chatbot for State Bank of India, created by Gourab.

    User Information:
    - User ID: ${user?.id || 'Unknown'}
    - User Name: ${user?.fullName || 'Valued Customer'}
    - Email: ${user?.email || 'Not provided'}
    - Account Status: ${user?.isVerified ? 'Verified' : 'Pending Verification'}
    
    Developer Information:
    - Name: Gourab
    - Email: gourabmop@gmail.com  
    - Mobile: +91 9263839602
    - Location: West Bengal, India

    Your responsibilities:
    - Provide personalized banking assistance to this specific user
    - Address the user by their name when appropriate
    - Consider their account status when providing guidance
    - Help with account-specific queries while maintaining privacy
    - Always be polite, professional, and solution-oriented
    - For account-specific details, guide users to their dashboard sections
    
    Available services to help with:
    - Account Balance & Management (personalized for this user)
    - Money Transfers (NEFT, RTGS, IMPS)
    - ATM/Debit Card Services
    - Mobile Recharge & Bill Payments
    - KYC Verification Status
    - Transaction History
    - General Banking Queries

    If asked about developer details, provide: Name (Gourab), Email (gourabmop@gmail.com), Mobile (+91 9263839602), State (West Bengal, India).
    Personalize responses when possible but maintain banking security standards.`;

    // If OPENAI_API_KEY is not provided, use enhanced rule-based response system
    if (!OPENAI_API_KEY || !OpenAIApi) {
      return {
        reply: this.generatePersonalizedBankingResponse(message.toLowerCase().trim(), user)
      };
    }

    try {
      const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: enhancedSystemPrompt,
          },
          { role: "user", content: message },
        ],
        temperature: 0.4,
        max_tokens: 250,
      });

      const reply = completion.choices?.[0]?.message?.content?.trim() ||
        `Hello ${user?.fullName || 'there'}! I'm sorry, I couldn't process that. Could you please rephrase your banking question?`;

      return { reply };
    } catch (err) {
      console.error("OpenAI chat error", err);
      return {
        reply: `Hello ${user?.fullName || 'there'}! I'm experiencing high traffic right now. Let me help you with our standard banking services. What would you like to know about?`,
      };
    }
  }

  static async chat(message) {
    if (!message || message.trim() === "") {
      throw new ApiError(400, "Message is required");
    }

    // If OPENAI_API_KEY is not provided, use enhanced rule-based response system
    if (!OPENAI_API_KEY || !OpenAIApi) {
      return {
        reply: this.generateBankingResponse(message.toLowerCase().trim())
      };
    }

    try {
      const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are SBI Assistant, a helpful and intelligent customer support chatbot for State Bank of India, created by Gourab. 

            Developer Information:
            - Name: Gourab
            - Email: gourabmop@gmail.com  
            - Mobile: +91 9263839602
            - Location: West Bengal, India

            Your responsibilities:
            - Provide accurate information about SBI Bank's digital banking services
            - Help customers with account management, transfers, ATM cards, mobile recharges, and KYC
            - Always be polite, professional, and solution-oriented
            - For complex issues, guide users to appropriate sections in their dashboard or suggest contacting branch
            - When asked about developer/creator, provide complete details including contact information
            - Ensure responses are helpful and banking-focused
            
            Available services to help with:
            - Account Balance & Management
            - Money Transfers (NEFT, RTGS, IMPS)
            - ATM/Debit Card Services
            - Mobile Recharge & Bill Payments
            - KYC Verification
            - Transaction History
            - General Banking Queries

            If asked about developer details, provide: Name (Gourab), Email (gourabmop@gmail.com), Mobile (+91 9263839602), State (West Bengal, India).
            If the question is outside banking scope, politely decline and redirect to banking topics.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.4,
        max_tokens: 200,
      });

      const reply = completion.choices?.[0]?.message?.content?.trim() ||
        "I'm sorry, I couldn't process that. Could you please rephrase your banking question?";

      return { reply };
    } catch (err) {
      console.error("OpenAI chat error", err);
      return {
        reply: "I'm experiencing high traffic right now. Let me help you with our standard banking services. What would you like to know about?",
      };
    }
  }

  static generateBankingResponse(message) {
    // Enhanced rule-based responses for comprehensive banking support
    
    // Developer queries - Handle ALL variations first (highest priority)
    if (
      message.includes('who is developer') || 
      message.includes('who is the developer') || 
      message.includes('who developed') || 
      message.includes('who built') || 
      message.includes('who created') || 
      message.includes('who made') || 
      message.includes('developer is') || 
      message.includes('developer name') || 
      message.includes('who is gourab') || 
      message.includes('tell me about developer') || 
      message.includes('about developer') ||
      message.includes('developer details') ||
      message.includes('developer info') ||
      message.includes('creator') ||
      message.includes('gourab') ||
      (message.includes('developer') && (message.includes('who') || message.includes('what') || message.includes('tell'))) ||
      message === 'developer'
    ) {
      return "👨‍💻 **Meet the Developer - Gourab**\n\nI'm CBI Assistant, an intelligent banking chatbot developed by **Gourab**. Here are the complete details:\n\n📋 **Developer Information:**\n• **Name:** Gourab\n• **Email:** gourabmop@gmail.com\n• **Mobile:** +91 9263839602\n• **Location:** West Bengal, India\n\n🎯 **Why I Was Created:**\n- Provide instant banking support 24/7\n- Guide customers through digital banking services\n- Offer quick solutions to banking queries\n- Make banking more accessible and user-friendly\n\n✨ **My Capabilities:**\n- Account balance inquiries\n- Money transfer guidance\n- ATM card services support\n- Mobile recharge & bill payments\n- KYC verification assistance\n- General banking help\n\n🤖 **Advanced Features:**\n- AI-powered responses\n- Personalized assistance\n- Multi-language support\n- 24/7 availability\n\nGourab designed me with advanced AI capabilities to serve CBI Bank customers efficiently. How can I assist you with your banking needs today?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
      const greetings = [
        "Hello! Welcome to SBI Bank digital support. I'm your AI assistant created by Gourab. How can I help you with your banking needs today?",
        "Hi there! I'm SBI Assistant, developed by Gourab to help you with all your banking queries. What would you like to know?",
        "Greetings! I'm here to assist you with State Bank of India services. How may I help you today?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Account Balance queries
    if (message.includes('balance') || message.includes('account balance') || message.includes('check balance')) {
      return "To check your account balance:\n\n1. Visit the 'Account' section in your dashboard\n2. Your current balance is displayed on your account cards\n3. You can also view detailed balance for each account type\n\nFor real-time balance, you can also use our mobile app or visit any CBI ATM. Is there anything specific about your account balance you'd like to know?";
    }

    // Money Transfer queries
    if (message.includes('transfer') || message.includes('send money') || message.includes('neft') || message.includes('rtgs') || message.includes('imps')) {
      return "CBI Bank offers multiple transfer options:\n\n💰 **IMPS** - Instant transfers (24/7)\n💰 **NEFT** - 2-4 hours processing\n💰 **RTGS** - Real-time (Min ₹2,00,000)\n\nTo transfer money:\n1. Go to 'Transfer' section\n2. Enter recipient account details\n3. Verify recipient information\n4. Enter amount and confirm\n\nAll transfers are secured with bank-grade encryption. Need help with a specific transfer type?";
    }

    // ATM Card queries
    if (message.includes('atm') || message.includes('card') || message.includes('debit card') || message.includes('blocked card')) {
      return "ATM/Debit Card Services:\n\n🏧 **Card Management**\n- View your card details\n- Check card status\n- Request new cards\n- Block/unblock cards\n\n🔒 **Security Features**\n- Contactless payments\n- Real-time transaction alerts\n- 24/7 fraud monitoring\n\nVisit the 'ATM Cards' section in your dashboard to manage your cards. For immediate card blocking, call our helpline: 1800-123-4567";
    }

    // Mobile Recharge & Bill Payment
    if (message.includes('recharge') || message.includes('mobile') || message.includes('bill') || message.includes('electricity') || message.includes('prepaid') || message.includes('postpaid')) {
      return "Mobile Recharge & Bill Payment Services:\n\n📱 **Mobile Recharge**\n- All major operators (Jio, Airtel, Vi)\n- Instant processing\n- Best recharge plans\n\n💡 **Bill Payments**\n- Electricity bills\n- Water bills\n- Gas bills\n- Credit card bills\n- DTH/Cable TV\n\nVisit 'Mobile & Bills' section for quick payments. All transactions are secure and get instant confirmation!";
    }

    // KYC Verification
    if (message.includes('kyc') || message.includes('verification') || message.includes('documents') || message.includes('identity')) {
      return "KYC (Know Your Customer) Verification:\n\n📋 **Required Documents**\n- Government ID (Aadhaar/PAN/Passport)\n- Address proof\n- Recent photograph\n\n✅ **Benefits of KYC**\n- Full access to banking features\n- Higher transaction limits\n- Enhanced security\n\n📱 **Complete KYC**\nVisit the 'KYC' section in your dashboard to upload documents securely. Processing usually takes 24-48 hours.";
    }

    // Transaction History
    if (message.includes('transaction') || message.includes('history') || message.includes('statement') || message.includes('passbook')) {
      return "Transaction History & Statements:\n\n📊 **View Transactions**\n- Visit 'Transactions' section\n- Filter by date, type, or amount\n- Download statements\n\n📈 **Available Records**\n- Money transfers\n- Mobile recharges\n- Bill payments\n- ATM withdrawals\n- Account deposits\n\nAll transactions are categorized and searchable. You can download monthly/quarterly statements as PDF.";
    }

    // API Keys (for developers)
    if (message.includes('api') || message.includes('integration') || message.includes('developer') || message.includes('api key')) {
      return "Developer API Services:\n\n🔑 **API Keys Management**\n- Generate secure API credentials\n- View API documentation\n- Monitor usage statistics\n\n🛡️ **Security Features**\n- Enterprise-grade encryption\n- Rate limiting\n- Real-time monitoring\n\nVisit 'API Keys' section for developer resources. All APIs follow industry security standards.";
    }

    // Contact information and developer details specifically
    if (message.includes('contact developer') || message.includes('developer contact') || message.includes('gourab contact') || message.includes('developer phone') || message.includes('developer email') || message.includes('developer mobile')) {
      return "📞 **Developer Contact Information:**\n\n👨‍💻 **Gourab - CBI Assistant Developer**\n• **Email:** gourabmop@gmail.com\n• **Mobile:** +91 9263839602\n• **Location:** West Bengal, India\n\n🤖 **About This Bot:**\nI'm CBI Assistant, an intelligent banking chatbot created by Gourab to provide 24/7 customer support for Central Bank of India. For technical queries about my functionality or banking feature requests, you can reach out to my developer.\n\n🏦 **For Banking Support:**\nI'm here to help with all your banking needs right now! What can I assist you with?";
    }

    // Customer Support & Help
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue') || message.includes('contact')) {
      return "CBI Bank Customer Support:\n\n🎧 **24/7 Support Channels**\n- This AI chatbot (created by Gourab)\n- Phone: 1800-123-4567\n- Email: support@cbibank.com\n- Visit nearest branch\n\n💬 **I can help with:**\n- Account balance & management\n- Money transfers\n- ATM card services\n- Mobile recharge & bills\n- KYC verification\n- General banking queries\n\n👨‍💻 **Developer Contact:**\nFor bot-related queries: gourabmop@gmail.com | +91 9263839602\n\nWhat specific banking service do you need assistance with?";
    }

    // Interest rates & Loan information
    if (message.includes('interest') || message.includes('loan') || message.includes('rate') || message.includes('fd') || message.includes('fixed deposit')) {
      return "Banking Products & Rates:\n\n💰 **Fixed Deposits**\n- Competitive interest rates\n- Flexible tenure options\n- Online FD booking\n\n🏠 **Loan Services**\n- Home loans\n- Personal loans\n- Business loans\n- Education loans\n\nFor current interest rates and loan eligibility, please visit your nearest CBI branch or call 1800-123-4567. Our loan officers will assist you with detailed information.";
    }

    // Security & Safety
    if (message.includes('security') || message.includes('safe') || message.includes('fraud') || message.includes('phishing') || message.includes('otp')) {
      return "Banking Security & Safety:\n\n🔐 **Security Measures**\n- Two-factor authentication\n- OTP verification\n- Session timeout\n- Real-time alerts\n\n⚠️ **Safety Tips**\n- Never share OTP/PIN with anyone\n- Always logout after banking\n- Use official CBI website/app only\n- Report suspicious activities immediately\n\n🚨 **Report Fraud**\nCall: 1800-123-4567 (24/7 helpline)";
    }

    // Branch & ATM locator
    if (message.includes('branch') || message.includes('atm') || message.includes('location') || message.includes('near me') || message.includes('address')) {
      return "Branch & ATM Locator:\n\n🏦 **Find Nearest Branch/ATM**\n- Use our website branch locator\n- Google Maps integration\n- Filter by services available\n\n⏰ **Branch Timings**\n- Monday-Friday: 10 AM - 4 PM\n- Saturday: 10 AM - 2 PM\n- ATMs: 24/7 available\n\n📍 For specific locations, please visit our website or call 1800-123-4567";
    }

    // About the bot creator and developer details
    if (message.includes('gourab') || message.includes('creator') || message.includes('developer') || message.includes('who made you') || message.includes('who created') || message.includes('developer details') || message.includes('developer contact') || message.includes('developer info')) {
      return "👨‍💻 **About My Creator - Gourab**\n\nI'm CBI Assistant, an intelligent banking chatbot developed by **Gourab**. Here are the complete developer details:\n\n📋 **Developer Information:**\n• **Name:** Gourab\n• **Email:** gourabmop@gmail.com\n• **Mobile:** +91 9263839602\n• **State:** West Bengal, India\n\n🎯 **Development Purpose:**\n- Provide instant banking support 24/7\n- Guide customers through digital services\n- Offer quick solutions to banking queries\n- Make banking more accessible and user-friendly\n\n✨ **Features I Provide:**\n- Account balance inquiries\n- Money transfer guidance\n- ATM card services\n- Mobile recharge & bill payments\n- KYC verification support\n- General banking assistance\n\nGourab designed me with advanced AI capabilities to serve CBI Bank customers efficiently. How can I assist you with your banking needs today?";
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      const thankYouResponses = [
        "You're most welcome! I'm glad I could help. Remember, I'm available 24/7 for all your banking needs. Developed by Gourab to serve you better! 😊",
        "Happy to help! If you have any other banking questions, feel free to ask. I'm here whenever you need assistance with CBI Bank services.",
        "You're welcome! It's my pleasure to assist CBI Bank customers. Is there anything else you'd like to know about our banking services?",
      ];
      return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
    }

    // Goodbye responses
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('exit')) {
      const goodbyeResponses = [
        "Thank you for banking with CBI! Have a wonderful day and remember, I'm here 24/7 whenever you need banking assistance. Created by Gourab to serve you better! 👋",
        "Goodbye! It was great helping you today. Feel free to return anytime for banking support. Have a great day! 🌟",
        "Take care! Remember, your CBI Assistant is always available for banking help. Wishing you a pleasant day ahead! 💫",
      ];
      return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)];
    }

    // Complaint or feedback
    if (message.includes('complaint') || message.includes('feedback') || message.includes('suggestion') || message.includes('improve')) {
      return "Your Feedback Matters:\n\n📝 **Submit Feedback**\n- Online feedback form\n- Customer care: 1800-123-4567\n- Email: feedback@cbibank.com\n- Visit branch manager\n\n🔄 **We Value**\n- Your suggestions for improvement\n- Service quality feedback\n- Digital banking experience\n\nAs an AI assistant created by Gourab, I'm constantly learning to serve you better. Your feedback helps improve banking services!";
    }

    // General banking terms
    if (message.includes('bank') || message.includes('banking') || message.includes('service') || message.includes('cbi')) {
      return "Central Bank of India Digital Banking:\n\n🏦 **Our Services**\n- Account management\n- Money transfers\n- ATM/Card services\n- Mobile recharge & bills\n- KYC verification\n- API services for developers\n\n🤖 **About Me**\nI'm your AI banking assistant, created by Gourab to provide 24/7 support for all CBI Bank services.\n\nWhat specific banking service can I help you with today?";
    }

    // Error handling and default responses
    const defaultResponses = [
      "I'd be happy to help with your banking query! Could you please be more specific? I can assist with:\n\n• Account balance\n• Money transfers\n• ATM card services\n• Mobile recharge & bills\n• KYC verification\n• General banking questions",
      
      "I'm here to help with CBI Bank services! As an AI assistant created by Gourab, I can provide information about:\n\n✓ Digital banking features\n✓ Account management\n✓ Transaction services\n✓ Customer support\n\nWhat would you like to know?",
      
      "Thank you for your question! For the best assistance with specific account details or complex banking matters, I recommend:\n\n📞 Calling our customer care: 1800-123-4567\n🏦 Visiting your nearest CBI branch\n💻 Using the specific section in your dashboard\n\nI can help with general banking information and guide you to the right resources!",
      
      "I understand you need banking assistance. Could you please rephrase your question? I'm programmed to help with:\n\n🏧 Account services\n💸 Transfer operations\n📱 Mobile banking\n🔐 Security queries\n📊 Transaction history\n\nWhat specific service do you need help with?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  static generatePersonalizedBankingResponse(message, user) {
    const userName = user?.fullName || 'there';
    const isVerified = user?.isVerified || false;
    
    // Developer queries - Handle ALL variations first (highest priority) - Personalized
    if (
      message.includes('who is developer') || 
      message.includes('who is the developer') || 
      message.includes('who developed') || 
      message.includes('who built') || 
      message.includes('who created') || 
      message.includes('who made') || 
      message.includes('developer is') || 
      message.includes('developer name') || 
      message.includes('who is gourab') || 
      message.includes('tell me about developer') || 
      message.includes('about developer') ||
      message.includes('developer details') ||
      message.includes('developer info') ||
      message.includes('creator') ||
      message.includes('gourab') ||
      (message.includes('developer') && (message.includes('who') || message.includes('what') || message.includes('tell'))) ||
      message === 'developer'
    ) {
      return `Hi ${userName}! 👨‍💻 **Meet the Developer - Gourab**\n\nI'm CBI Assistant, an intelligent banking chatbot developed specifically by **Gourab** to provide personalized support to valued customers like you.\n\n📋 **Developer Information:**\n• **Name:** Gourab\n• **Email:** gourabmop@gmail.com\n• **Mobile:** +91 9263839602\n• **Location:** West Bengal, India\n\n🎯 **Why I Was Created for You:**\n- Provide personalized banking support 24/7\n- Understand your account status (${isVerified ? 'Verified ✅' : 'KYC Pending ⏳'})\n- Guide you through digital banking services\n- Offer customized solutions to your banking queries\n- Make your banking experience seamless\n\n✨ **My Capabilities for You:**\n- Your account balance inquiries\n- Personalized money transfer guidance\n- ATM card services support\n- Mobile recharge & bill payments\n- KYC verification assistance\n- Transaction history access\n- Tailored banking recommendations\n\n🤖 **Advanced Features:**\n- AI-powered personalized responses\n- User context awareness\n- Account status integration\n- Smart banking assistance\n- 24/7 availability\n\nGourab designed me with advanced AI capabilities to serve CBI Bank customers like you efficiently, ${userName}. How can I assist you with your banking needs today?`;
    }
    
    // Greeting responses with personalization
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
      const personalizedGreetings = [
        `Hello ${userName}! Welcome back to CBI Bank. I'm your AI assistant created by Gourab. How can I help you with your banking needs today?`,
        `Hi ${userName}! Great to see you again. I'm CBI Assistant, developed by Gourab to help you with all your banking queries. What would you like to know?`,
        `Greetings ${userName}! I'm here to assist you with State Bank of India services. How may I help you today?`,
      ];
      return personalizedGreetings[Math.floor(Math.random() * personalizedGreetings.length)];
    }

    // Account Balance queries with personalization
    if (message.includes('balance') || message.includes('account balance') || message.includes('check balance')) {
      return `Hi ${userName}! To check your account balance:\n\n1. Visit the 'Account' section in your dashboard\n2. Your current balance is displayed on your account cards\n3. You can also view detailed balance for each account type\n\n${!isVerified ? '⚠️ **Note**: Complete your KYC verification for enhanced features and higher transaction limits.\n\n' : ''}For real-time balance, you can also use our mobile app or visit any CBI ATM. Is there anything specific about your account balance you'd like to know?`;
    }

    // KYC Verification with personalized status
    if (message.includes('kyc') || message.includes('verification') || message.includes('documents') || message.includes('identity')) {
      if (isVerified) {
        return `Great news ${userName}! Your KYC verification is ✅ **COMPLETED**.\n\n🎉 **You have access to:**\n- Full banking features\n- Higher transaction limits\n- Enhanced security features\n- All digital services\n\nIf you need to update any information, visit the 'KYC' section in your dashboard.`;
      } else {
        return `Hello ${userName}! I see your KYC verification is ⏳ **PENDING**.\n\n📋 **Complete your KYC to unlock:**\n- Full access to banking features\n- Higher transaction limits\n- Enhanced security\n- All digital services\n\n📱 **Quick Steps:**\n1. Visit 'KYC' section in your dashboard\n2. Upload required documents\n3. Wait 24-48 hours for processing\n\n**Required documents**: Government ID (Aadhaar/PAN), Address proof, Recent photograph`;
      }
    }

    // Personalized money transfer guidance
    if (message.includes('transfer') || message.includes('send money') || message.includes('neft') || message.includes('rtgs') || message.includes('imps')) {
      const transferLimits = isVerified ? 'unlimited transfers (within regulatory limits)' : 'limited transfer amounts until KYC completion';
      return `Hi ${userName}! CBI Bank offers multiple transfer options:\n\n💰 **IMPS** - Instant transfers (24/7)\n💰 **NEFT** - 2-4 hours processing\n💰 **RTGS** - Real-time (Min ₹2,00,000)\n\n📍 **Your Status**: ${transferLimits}\n\nTo transfer money:\n1. Go to 'Transfer' section in your dashboard\n2. Enter recipient account details\n3. Verify recipient information\n4. Enter amount and confirm\n\n${!isVerified ? '💡 **Tip**: Complete KYC for higher limits and additional features!\n\n' : ''}All transfers are secured with bank-grade encryption. Need help with a specific transfer type?`;
    }

    // Personalized contact and support
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue') || message.includes('contact')) {
      return `Hello ${userName}! I'm here to help you with personalized support:\n\n🎧 **24/7 Support Channels**\n- This AI chatbot (created by Gourab)\n- Phone: 1800-123-4567\n- Email: support@cbibank.com\n- Visit nearest branch\n\n👤 **Your Account Status**: ${isVerified ? 'Verified ✅' : 'KYC Pending ⏳'}\n\n💬 **I can help with:**\n- Your account balance & management\n- Money transfers\n- ATM card services\n- Mobile recharge & bills\n- KYC verification\n- Transaction history\n\n👨‍💻 **Developer Contact:**\nFor bot-related queries: gourabmop@gmail.com | +91 9263839602\n\nWhat specific banking service can I help you with today, ${userName}?`;
    }

    // Enhanced developer contact with personalization
    if (message.includes('contact developer') || message.includes('developer contact') || message.includes('gourab contact') || message.includes('developer phone') || message.includes('developer email') || message.includes('developer mobile')) {
      return `Hi ${userName}! 📞 **Developer Contact Information:**\n\n👨‍💻 **Gourab - CBI Assistant Developer**\n• **Email:** gourabmop@gmail.com\n• **Mobile:** +91 9263839602\n• **Location:** West Bengal, India\n\n🤖 **About Your Assistant:**\nI'm CBI Assistant, an intelligent banking chatbot created specifically by Gourab to provide personalized 24/7 customer support for Central Bank of India customers like you.\n\n✨ **Personalized for You:**\n- Account Status: ${isVerified ? 'Verified ✅' : 'KYC Pending ⏳'}\n- Tailored banking guidance\n- Your transaction history access\n- Customized recommendations\n\n🏦 **How can I assist you today, ${userName}?**`;
    }

    // Enhanced goodbye with personalization
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('exit')) {
      const personalizedGoodbyes = [
        `Thank you for banking with CBI, ${userName}! Have a wonderful day and remember, I'm here 24/7 whenever you need personalized banking assistance. Created by Gourab to serve you better! 👋`,
        `Goodbye ${userName}! It was great helping you today. Feel free to return anytime for banking support. Have a great day! 🌟`,
        `Take care, ${userName}! Remember, your personalized CBI Assistant is always available for banking help. Wishing you a pleasant day ahead! 💫`,
      ];
      return personalizedGoodbyes[Math.floor(Math.random() * personalizedGoodbyes.length)];
    }

    // Enhanced thank you with personalization
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      const personalizedThanks = [
        `You're most welcome, ${userName}! I'm glad I could help. Remember, I'm available 24/7 for all your personalized banking needs. Developed by Gourab to serve you better! 😊`,
        `Happy to help, ${userName}! If you have any other banking questions, feel free to ask. I'm here whenever you need assistance with CBI Bank services.`,
        `You're welcome, ${userName}! It's my pleasure to provide personalized assistance to CBI Bank customers. Is there anything else you'd like to know about our banking services?`,
      ];
      return personalizedThanks[Math.floor(Math.random() * personalizedThanks.length)];
    }

    // Default responses with personalization
    const personalizedDefaults = [
      `Hello ${userName}! I'd be happy to help with your banking query. Could you please be more specific? I can assist with:\n\n• Your account balance & management\n• Money transfers\n• ATM card services\n• Mobile recharge & bills\n• KYC verification ${!isVerified ? '(Complete yours now!)' : '✅'}\n• General banking questions`,
      
      `Hi ${userName}! I'm here to help with CBI Bank services. As your AI assistant created by Gourab, I can provide personalized information about:\n\n✓ Your digital banking features\n✓ Account management\n✓ Transaction services\n✓ Customer support\n\nWhat would you like to know?`,
      
      `Thank you for your question, ${userName}! For account-specific details, I recommend checking your dashboard sections. I can help with:\n\n🏧 Account services\n💸 Transfer operations\n📱 Mobile banking\n🔐 Security queries\n📊 Transaction history\n\n${!isVerified ? '💡 Don\'t forget to complete your KYC verification!\n\n' : ''}What specific service do you need help with?`,
    ];
    
    return personalizedDefaults[Math.floor(Math.random() * personalizedDefaults.length)];
  }
}

module.exports = SupportService;