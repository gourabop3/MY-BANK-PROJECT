import { FaReact, FaNodeJs, FaGithub, FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiMongodb, SiExpress, SiJsonwebtokens, SiCloudinary, SiRazorpay, SiOpenai } from 'react-icons/si';
import { MdPayment, MdAccountBalance, MdSecurity, MdPhoneAndroid, MdReceipt, MdCreditCard, MdSupport, MdSwapHoriz } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import HeaderName from '@/components/HeaderName';

const frontendDependencies = [
  { name: 'Next.js', desc: 'React framework for server-side rendering and routing in the frontend.' },
  { name: 'React', desc: 'Component-based UI library for building interactive user interfaces.' },
  { name: 'TailwindCSS', desc: 'Utility-first CSS framework for styling and responsive layouts.' },
  { name: 'Framer Motion', desc: 'Animation library for smooth transitions and UI effects.' },
  { name: 'Axios', desc: 'HTTP client for making API requests to the backend.' },
  { name: 'Redux Toolkit', desc: 'State management for handling global app state.' },
  { name: 'Formik', desc: 'Form handling library for managing form state and validation.' },
  { name: 'Yup', desc: 'Schema validation for form inputs.' },
  { name: 'React Toastify', desc: 'Notification system for user feedback and alerts.' },
  { name: 'React Icons', desc: 'Icon library for adding vector icons to the UI.' },
  { name: 'Headless UI', desc: 'Accessible UI components for modals, dropdowns, etc.' },
  { name: 'Lucide React', desc: 'Icon set for modern UI icons.' },
  { name: 'Moment', desc: 'Date and time formatting and manipulation.' },
  { name: 'React Dropzone', desc: 'File upload component for drag-and-drop uploads.' },
  { name: 'Pro Sidebar', desc: 'Sidebar navigation component for dashboard layouts.' },
  { name: 'UUID', desc: 'Unique ID generation for keys and identifiers.' }
];

const backendDependencies = [
  { name: 'Node.js', desc: 'JavaScript runtime for running the backend server.' },
  { name: 'Express.js', desc: 'Web framework for building RESTful APIs.' },
  { name: 'MongoDB', desc: 'NoSQL database for storing user, account, and transaction data.' },
  { name: 'Mongoose', desc: 'ODM for MongoDB, providing schema and model support.' },
  { name: 'JWT', desc: 'Token-based authentication for secure API access.' },
  { name: 'BcryptJS', desc: 'Password hashing for secure user authentication.' },
  { name: 'Cloudinary', desc: 'Cloud storage for user profile images and KYC documents.' },
  { name: 'Razorpay', desc: 'Payment gateway integration for processing payments and recharges.' },
  { name: 'OpenAI', desc: 'AI chatbot integration for customer support and queries.' },
  { name: 'Nodemailer', desc: 'Email service for sending notifications and OTPs.' },
  { name: 'Express Validator', desc: 'Middleware for validating and sanitizing API inputs.' },
  { name: 'Random Int', desc: 'Random number generation for transaction IDs and card numbers.' },
  { name: 'Dotenv', desc: 'Environment variable management for configuration.' },
  { name: 'CORS', desc: 'Cross-Origin Resource Sharing middleware for API security.' },
  { name: 'Morgan', desc: 'HTTP request logger for backend debugging.' },
  { name: 'Multer', desc: 'Middleware for handling file uploads.' },
  { name: 'QRCode', desc: 'QR code generation for UPI and payment features.' },
  { name: 'Faker', desc: 'Fake data generation for testing and development.' }
];

const projectFeatures = [
  { title: 'UPI Payment System', desc: 'Instant money transfers using UPI ID with real-time balance updates and transaction history' },
  { title: 'Mobile Recharge', desc: 'Quick mobile and DTH recharge services integrated with telecom operators' },
  { title: 'Account Management', desc: 'Multiple account types (Saving, Current) with balance tracking and account statements' },
  { title: 'Bill Payments', desc: 'Utility bill payments for electricity, water, gas with automated receipt generation' },
  { title: 'ATM Card Management', desc: 'Virtual ATM card generation with CVV, expiry date, and PIN management' },
  { title: 'AI Customer Service', desc: 'OpenAI-powered chatbot for 24/7 banking assistance and query resolution' },
  { title: 'Money Transfer', desc: 'Secure peer-to-peer transfers with OTP verification and transaction limits' },
  { title: 'Security Features', desc: 'JWT authentication, password encryption, KYC verification, and fraud detection' },
  { title: 'Fixed Deposits', desc: 'FD creation and management with interest calculation and maturity tracking' },
  { title: 'Transaction History', desc: 'Detailed transaction logs with filtering, search, and export functionality' },
  { title: 'Profile Management', desc: 'User profile with KYC verification, document upload, and account settings' },
  { title: 'API Integration', desc: 'RESTful APIs for third-party integration with secure authentication tokens' }
];

const socialLinks = [
  { href: 'https://github.com/gourabop', label: 'GitHub', icon: FaGithub },
  { href: 'https://linkedin.com/in/gourabmullick', label: 'LinkedIn', icon: FaLinkedin },
  { href: 'https://instagram.com/gourab_op_84', label: 'Instagram', icon: FaInstagram },
  { href: 'https://t.me/its_me_gourab', label: 'Telegram', icon: FaTelegram },
  { href: 'mailto:gourabmullick200@gmail.com', label: 'Email', icon: AiOutlineMail }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <HeaderName />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            About SBI Payment Gateway
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A comprehensive digital banking platform built with modern technologies to provide secure, fast, and reliable financial services for the digital age.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Frontend Dependencies */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaReact className="text-2xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Frontend Dependencies</h2>
                <p className="text-gray-600">Key libraries and tools used in the frontend</p>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {frontendDependencies.map(dep => (
                <li key={dep.name}>
                  <span className="font-semibold text-gray-900">{dep.name}:</span> <span className="text-gray-700">{dep.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Backend Dependencies */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaNodeJs className="text-2xl text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Backend Dependencies</h2>
                <p className="text-gray-600">Key libraries and tools used in the backend</p>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {backendDependencies.map(dep => (
                <li key={dep.name}>
                  <span className="font-semibold text-gray-900">{dep.name}:</span> <span className="text-gray-700">{dep.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project Features */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Features</h2>
            <p className="text-gray-600">Comprehensive banking solutions for modern financial needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-3">
              {projectFeatures.slice(0, 6).map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              {projectFeatures.slice(6).map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture & Design Decisions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why These Technologies?</h2>
            <p className="text-gray-600">Strategic technology choices for a secure and scalable banking platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Security First Approach</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-1">•</span>
                  <span><strong>JWT</strong> for stateless authentication and secure API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-1">•</span>
                  <span><strong>bcryptjs</strong> for one-way password hashing protection</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-1">•</span>
                  <span><strong>Express Validator</strong> for input sanitization and validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-1">•</span>
                  <span><strong>HTTPS</strong> enforcement for all banking transactions</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Scalability & Performance</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-lg mt-1">•</span>
                  <span><strong>MongoDB</strong> for horizontal scaling and flexible data models</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-lg mt-1">•</span>
                  <span><strong>Node.js</strong> for non-blocking I/O and concurrent connections</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-lg mt-1">•</span>
                  <span><strong>Next.js</strong> for server-side rendering and optimal performance</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 text-lg mt-1">•</span>
                  <span><strong>Cloudinary</strong> for CDN-based image delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}