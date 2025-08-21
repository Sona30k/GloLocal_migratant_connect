import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Users, Search, Briefcase, AlertTriangle, Settings,
  Globe, Shield, Phone, MapPin, User, Mail, Menu, X,
  Sun, Moon, Plus, Minus, Volume2, Filter, Download,
  Utensils, Building, Heart, FileText, BarChart3, Navigation,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';

// Define interfaces for better type safety
interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface Migrant {
  id: number;
  name: string;
  nameEn: string;
  phone: string;
  origin: string;
  destination: string;
  work: string;
  status: 'active' | 'pending' | 'resolved';
  registeredDate: string;
}

interface EmergencyRequest {
  id: number;
  name: string;
  nameEn: string;
  phone: string;
  type: string;
  description: string;
  descriptionHi: string;
  status: 'pending' | 'resolved';
  timestamp: string;
}

const MigrationConnect = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [adminTab, setAdminTab] = useState('migrants');

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Create a stable ref for the chat input
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Sample data
  const [migrants, setMigrants] = useState<Migrant[]>([
    { id: 1, name: 'राज कुमार', nameEn: 'Raj Kumar', phone: '+91 9876543210', origin: 'Patna', destination: 'Mumbai', work: 'Construction', status: 'active', registeredDate: '2024-01-15' },
    { id: 2, name: 'अनिता देवी', nameEn: 'Anita Devi', phone: '+91 8765432109', origin: 'Gaya', destination: 'Delhi', work: 'Domestic Help', status: 'active', registeredDate: '2024-01-10' },
    { id: 3, name: 'रमेश यादव', nameEn: 'Ramesh Yadav', phone: '+91 7654321098', origin: 'Muzaffarpur', destination: 'Bangalore', work: 'Factory Worker', status: 'pending', registeredDate: '2024-01-20' }
  ]);

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([
    { id: 1, name: 'सुनीता कुमारी', nameEn: 'Sunita Kumari', phone: '+91 9876543211', type: 'medical', description: 'Need immediate medical help', descriptionHi: 'तुरंत चिकित्सा सहायता चाहिए', status: 'pending', timestamp: '2024-01-22 14:30' },
    { id: 2, name: 'विकास सिंह', nameEn: 'Vikas Singh', phone: '+91 8765432110', type: 'shelter', description: 'Lost job, need shelter', descriptionHi: 'नौकरी खो गई, आश्रय चाहिए', status: 'resolved', timestamp: '2024-01-21 10:15' }
  ]);

  const texts = {
    en: {
      // Navigation
      home: 'Home',
      findSupport: 'Find Support',
      jobBoard: 'Job Board',
      emergency: 'Emergency',
      admin: 'Admin',
      language: 'Language',
      settings: 'Settings',

      // Home page
      migrantWorkers: 'Migration Connect',
      tagline: 'Supporting Bihar\'s Migrant Workers',
      welcomeText: 'Empowering migrant workers from Bihar with essential services, job opportunities, emergency assistance, and community support across India.',
      iAmMigrant: 'I am a Migrant Worker',
      needHelpNow: 'I Need Help Now',

      // Registration
      register: 'Migrant Registration',
      name: 'Full Name',
      phone: 'Mobile Number',
      aadhaar: 'Aadhaar Number (Optional)',
      origin: 'Home District (Bihar)',
      destination: 'Current City/State',
      workType: 'Type of Work',
      submit: 'Register Now',

      // Support
      selectCity: 'Select Your City',
      food: 'Food',
      shelter: 'Shelter',
      helpline: 'Helpline',
      listen: 'Listen',
      call: 'Call Now',
      getDirections: 'Directions',

      // Jobs
      apply: 'Apply Now',
      jobDetails: 'Job Details',

      // Emergency
      requestHelp: 'Request Emergency Help',
      emergencyType: 'Type of Emergency',
      description: 'Describe Your Situation',

      // Admin
      migrantsList: 'Migrants Database',
      requests: 'Emergency Requests',
      mapView: 'Migration Map',
      reports: 'Reports & Analytics',
      downloadReports: 'Download Reports',
      totalMigrants: 'Total Migrants',
      activeRequests: 'Active Requests',
      availableJobs: 'Available Jobs',
      supportCenters: 'Support Centers'
    },
    hi: {
      // Navigation  
      home: 'मुख्य पृष्ठ',
      findSupport: 'सहायता खोजें',
      jobBoard: 'नौकरी बोर्ड',
      emergency: 'आपातकाल',
      admin: 'प्रशासक',
      language: 'भाषा',
      settings: 'सेटिंग्स',

      // Home page
      migrantWorkers: 'माइग्रेशन कनेक्ट',
      tagline: 'बिहार के प्रवासी मजदूरों का सहारा',
      welcomeText: 'बिहार के प्रवासी मजदूरों को भारत भर में आवश्यक सेवाएं, नौकरी के अवसर, आपातकालीन सहायता और सामुदायिक सहयोग प्रदान करना।',
      iAmMigrant: 'मैं एक प्रवासी मजदूर हूं',
      needHelpNow: 'मुझे तुरंत मदद चाहिए',

      // Registration
      register: 'प्रवासी पंजीकरण',
      name: 'पूरा नाम',
      phone: 'मोबाइल नंबर',
      aadhaar: 'आधार नंबर (वैकल्पिक)',
      origin: 'गृह जिला (बिहार)',
      destination: 'वर्तमान शहर/राज्य',
      workType: 'काम का प्रकार',
      submit: 'अभी पंजीकरण करें',

      // Support
      selectCity: 'अपना शहर चुनें',
      food: 'भोजन',
      shelter: 'आश्रय',
      helpline: 'हेल्पलाइन',
      listen: 'सुनें',
      call: 'अभी कॉल करें',
      getDirections: 'दिशा-निर्देश',

      // Jobs
      apply: 'आवेदन करें',
      jobDetails: 'नौकरी विवरण',

      // Emergency
      requestHelp: 'आपातकालीन सहायता मांगें',
      emergencyType: 'आपातकाल का प्रकार',
      description: 'अपनी स्थिति का वर्णन करें',

      // Admin
      migrantsList: 'प्रवासी डेटाबेस',
      requests: 'आपातकालीन अनुरोध',
      mapView: 'माइग्रेशन मैप',
      reports: 'रिपोर्ट और विश्लेषण',
      downloadReports: 'रिपोर्ट डाउनलोड करें',
      totalMigrants: 'कुल प्रवासी',
      activeRequests: 'सक्रिय अनुरोध',
      availableJobs: 'उपलब्ध नौकरियां',
      supportCenters: 'सहायता केंद्र'
    }
  };

  // Color scheme - warm, earthy tones
  const colors = {
    primary: '#8B0000', // Deep red
    accent: '#FFC107', // Mustard yellow  
    background: '#FFF8E7', // Soft beige
    backgroundDark: '#2C1810', // Dark brown
    text: '#3E2723', // Dark brown
    textDark: '#F5F5F5', // Off-white
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  };

  // Dynamic support services based on language
  const getSupportServices = () => [
    {
      id: 1,
      name: language === 'hi' ? 'श्रमिक आश्रय केंद्र' : 'Worker Shelter Center',
      address: language === 'hi' ? 'अंधेरी, मुंबई, महाराष्ट्र' : 'Andheri, Mumbai, Maharashtra',
      contact: '+91 9876543210',
      category: 'shelter',
      icon: Building,
      city: 'mumbai'
    },
    {
      id: 2,
      name: language === 'hi' ? 'मुफ्त भोजन वितरण' : 'Free Food Distribution',
      address: language === 'hi' ? 'करोल बाग, दिल्ली' : 'Karol Bagh, Delhi',
      contact: '+91 8765432109',
      category: 'food',
      icon: Utensils,
      city: 'delhi'
    },
    {
      id: 3,
      name: language === 'hi' ? '24x7 मजदूर हेल्पलाइन' : '24x7 Worker Helpline',
      address: language === 'hi' ? 'राष्ट्रीय सेवा' : 'National Service',
      contact: '1800-891-1291',
      category: 'helpline',
      icon: Phone,
      city: 'all'
    },
    {
      id: 4,
      name: language === 'hi' ? 'बिहारी समुदाय केंद्र' : 'Bihari Community Center',
      address: language === 'hi' ? 'कोरमंगला, बेंगलुरु' : 'Koramangala, Bangalore',
      contact: '+91 7654321098',
      category: 'shelter',
      icon: Building,
      city: 'bangalore'
    }
  ];

  // Dynamic jobs based on language
  const getJobs = () => [
    {
      id: 1,
      title: language === 'hi' ? 'निर्माण मजदूर (Construction Worker)' : 'Construction Worker',
      location: language === 'hi' ? 'मुंबई, महाराष्ट्र' : 'Mumbai, Maharashtra',
      wage: '₹500-600/day',
      employer: 'ABC Construction Ltd.',
      contact: '+91 9876543210',
      description: language === 'hi' ? 'निर्माण कार्य, 8 घंटे की शिफ्ट' : 'Building construction work, 8-hour shifts'
    },
    {
      id: 2,
      title: language === 'hi' ? 'फैक्ट्री ऑपरेटर (Factory Operator)' : 'Factory Operator',
      location: language === 'hi' ? 'गुड़गांव, हरियाणा' : 'Gurgaon, Haryana',
      wage: language === 'hi' ? '₹18,000-22,000/महीना' : '₹18,000-22,000/month',
      employer: 'XYZ Industries Pvt. Ltd.',
      contact: '+91 8765432109',
      description: language === 'hi' ? 'विनिर्माण इकाई का काम, दिन की शिफ्ट' : 'Manufacturing unit work, day shift'
    },
    {
      id: 3,
      title: language === 'hi' ? 'घरेलू सहायक (Domestic Helper)' : 'Domestic Helper',
      location: language === 'hi' ? 'दिल्ली' : 'Delhi',
      wage: language === 'hi' ? '₹12,000-15,000/महीना' : '₹12,000-15,000/month',
      employer: 'Home Care Services',
      contact: '+91 7654321098',
      description: language === 'hi' ? 'घरेलू काम, लचीले घंटे' : 'Household work, flexible hours'
    },
    {
      id: 4,
      title: language === 'hi' ? 'डिलीवरी पार्टनर (Delivery Partner)' : 'Delivery Partner',
      location: language === 'hi' ? 'बेंगलुरु, कर्नाटक' : 'Bangalore, Karnataka',
      wage: '₹400-500/day',
      employer: 'Quick Delivery Co.',
      contact: '+91 6543210987',
      description: language === 'hi' ? 'पैकेज डिलीवरी, बाइक प्रदान की जाती है' : 'Package delivery, bike provided'
    }
  ];

  const t = texts[language];
  const supportServices = getSupportServices();
  const jobs = getJobs();

  // Filtered support services based on city and category
  const filteredServices = supportServices.filter(service =>
    (selectedCity === '' || service.city === selectedCity || service.city === 'all') &&
    (selectedFilter === 'all' || service.category === selectedFilter)
  );

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const toggleAudio = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(id);
      setTimeout(() => setIsPlaying(null), 3000);
    }
  };

  // Fixed chatbot send message function
  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    // Clear input immediately after adding message
    const messageText = chatInput;
    setChatInput('');

    try {
      // Simulate API call with mock response for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock bot responses
      const mockResponses = [
        language === 'hi'
          ? 'मैं आपकी सहायता करने के लिए यहाँ हूँ। आप क्या जानना चाहते हैं?'
          : 'I am here to help you. What would you like to know?',
        language === 'hi'
          ? 'आप नौकरी की तलाश में हैं या आपको आपातकालीन सहायता चाहिए?'
          : 'Are you looking for jobs or do you need emergency assistance?',
        language === 'hi'
          ? 'मैं आपको सहायता सेवाएं खोजने में मदद कर सकता हूँ।'
          : 'I can help you find support services.',
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const botMessage: ChatMessage = { sender: 'bot', text: randomResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: language === 'hi'
          ? 'क्षमा करें, कनेक्शन में समस्या है।'
          : 'Sorry, there was a connection error.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setChatLoading(false);

    // Focus the input after message is sent
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 100);
  };

  // Handle input change with proper focus management
  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const AccessibilityToolbar = () => (
    <div className={`fixed bottom-6 right-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-xl border p-4 flex flex-col space-y-3 z-50`}>
      <div className="text-xs font-medium text-center mb-1" style={{ color: darkMode ? colors.textDark : colors.text }}>
        Accessibility
      </div>
      <button
        onClick={() => setFontSize(Math.min(fontSize + 2, 24))}
        className="p-3 rounded-lg text-white font-medium transition-all hover:shadow-md"
        style={{ backgroundColor: colors.primary }}
        aria-label="Increase font size"
      >
        <Plus size={16} className="mx-auto" />
      </button>
      <button
        onClick={() => setFontSize(Math.max(fontSize - 2, 12))}
        className="p-3 rounded-lg text-white font-medium transition-all hover:shadow-md"
        style={{ backgroundColor: colors.primary }}
        aria-label="Decrease font size"
      >
        <Minus size={16} className="mx-auto" />
      </button>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-3 rounded-lg text-white font-medium transition-all hover:shadow-md"
        style={{ backgroundColor: colors.primary }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={16} className="mx-auto" /> : <Moon size={16} className="mx-auto" />}
      </button>
    </div>
  );

  const Navbar = () => (
    <nav className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'} shadow-lg sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-10 w-10 mr-3" style={{ color: colors.primary }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                  Migration Connect
                </div>
                <div className="text-sm opacity-75">{t.tagline}</div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavButton page="home" icon={Home} label={t.home} />
            <NavButton page="support" icon={Search} label={t.findSupport} />
            <NavButton page="jobs" icon={Briefcase} label={t.jobBoard} />
            <NavButton page="emergency" icon={AlertTriangle} label={t.emergency} />

            {/* Separator */}
            <div className="h-8 w-px bg-gray-300 mx-4"></div>

            <NavButton page="admin" icon={Shield} label={t.admin} />
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Globe size={18} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="px-2 pt-4 pb-6 space-y-2">
              <MobileNavButton page="home" icon={Home} label={t.home} />
              <MobileNavButton page="support" icon={Search} label={t.findSupport} />
              <MobileNavButton page="jobs" icon={Briefcase} label={t.jobBoard} />
              <MobileNavButton page="emergency" icon={AlertTriangle} label={t.emergency} />
              <MobileNavButton page="admin" icon={Shield} label={t.admin} />
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
              >
                <Globe size={20} />
                <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const NavButton = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${currentPage === page
        ? 'text-white'
        : 'hover:bg-gray-100'
        }`}
      style={currentPage === page ? { backgroundColor: colors.primary } : {}}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const MobileNavButton = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-colors ${currentPage === page
        ? 'text-white'
        : 'hover:bg-gray-100'
        }`}
      style={currentPage === page ? { backgroundColor: colors.primary } : {}}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const HomePage = () => (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background, color: darkMode ? colors.textDark : colors.text }}>
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: colors.primary }}>
              {t.migrantWorkers}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              {t.welcomeText}
            </p>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-12 mb-12 mx-auto max-w-lg`}>
              <Users size={150} className="mx-auto mb-6" style={{ color: colors.primary }} />
              <p className="text-lg font-medium" style={{ color: colors.accent }}>
                {language === 'hi' ? 'बिहार से भारत तक - आपका साथी' : 'From Bihar to India - Your Companion'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button
                onClick={() => setCurrentPage('register')}
                className="text-white font-bold py-6 px-10 rounded-xl text-xl transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-3"
                style={{ backgroundColor: colors.primary }}
              >
                <User size={24} />
                <span>{t.iAmMigrant}</span>
              </button>
              <button
                onClick={() => setCurrentPage('emergency')}
                className="text-white font-bold py-6 px-10 rounded-xl text-xl transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-3"
                style={{ backgroundColor: colors.accent, color: colors.text }}
              >
                <AlertTriangle size={24} />
                <span>{t.needHelpNow}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <StatCard number="2,500+" label={language === 'hi' ? 'पंजीकृत मजदूर' : 'Registered Workers'} />
              <StatCard number="150+" label={language === 'hi' ? 'नौकरी के अवसर' : 'Job Opportunities'} />
              <StatCard number="50+" label={language === 'hi' ? 'सहायता केंद्र' : 'Support Centers'} />
              <StatCard number="24/7" label={language === 'hi' ? 'हेल्पलाइन सेवा' : 'Helpline Service'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ number, label }: { number: string; label: string }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
      <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>{number}</div>
      <div className="text-sm opacity-75">{label}</div>
    </div>
  );

  // Simplified registration page for demo
  const RegistrationPage = () => (
    <div className="min-h-screen py-12" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-10 text-center`}>
          <User size={60} className="mx-auto mb-4" style={{ color: colors.primary }} />
          <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>{t.register}</h2>
          <p className="text-lg opacity-75 mb-8">Registration form would be here</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-white font-bold py-4 px-8 rounded-xl text-xl transition-all hover:shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            {t.submit}
          </button>
        </div>
      </div>
    </div>
  );

  // Chatbot Widget with Fixed Focus Management
  const ChatbotWidget = () => {
    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <div className="fixed bottom-6 left-6 z-50">
        {chatOpen && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl mb-4`} style={{ width: '350px', maxHeight: '500px' }}>
            <div className="p-4 border-b" style={{ borderColor: colors.primary }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></div>
                  <h3 className="font-bold" style={{ color: colors.primary }}>
                    {language === 'hi' ? 'सहायक चैटबॉट' : 'Helper Chatbot'}
                  </h3>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center opacity-75 py-8">
                  <Heart size={40} className="mx-auto mb-2" style={{ color: colors.primary }} />
                  <p className="text-sm">
                    {language === 'hi'
                      ? 'नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ।'
                      : 'Hello! I am here to help you.'}
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user'
                      ? 'text-white'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    style={msg.sender === 'user' ? { backgroundColor: colors.primary } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t" style={{ borderColor: colors.primary + '30' }}>
              <div className="flex space-x-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={handleChatInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : 'Type your message...'}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  style={{
                    focusRingColor: colors.primary
                  }}
                  disabled={chatLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setChatOpen(!chatOpen);
            // Focus input when opening chat
            if (!chatOpen) {
              setTimeout(() => {
                if (chatInputRef.current) {
                  chatInputRef.current.focus();
                }
              }, 100);
            }
          }}
          className="w-16 h-16 rounded-full text-white shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          {chatOpen ? <X size={24} /> : <Phone size={24} />}
        </button>
      </div>
    );
  };

  // Simplified other pages for demo
  const SupportPage = () => (
    <div className="min-h-screen py-12" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <Search size={60} className="mx-auto mb-4" style={{ color: colors.primary }} />
        <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>{t.findSupport}</h2>
        <p className="text-xl opacity-75 max-w-2xl mx-auto mb-8">
          {language === 'hi'
            ? 'आपके शहर में उपलब्ध सहायता सेवाएं खोजें'
            : 'Find available support services in your city'}
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
          {supportServices.slice(0, 3).map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all`}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl mr-4" style={{ backgroundColor: colors.primary + '20' }}>
                    <IconComponent size={32} style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{service.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2 opacity-75" />
                    {service.address}
                  </p>
                  <p className="flex items-center text-sm">
                    <Phone size={16} className="mr-2 opacity-75" />
                    {service.contact}
                  </p>
                </div>
                <button className="w-full text-white py-3 px-4 rounded-xl font-medium transition-all hover:shadow-lg"
                  style={{ backgroundColor: colors.primary }}>
                  <Phone size={18} className="inline mr-2" />
                  {t.call}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const JobBoardPage = () => (
    <div className="min-h-screen py-12" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <Briefcase size={60} className="mx-auto mb-4" style={{ color: colors.primary }} />
        <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>{t.jobBoard}</h2>
        <p className="text-xl opacity-75 max-w-2xl mx-auto mb-8">
          {language === 'hi'
            ? 'बिहार के मजदूरों के लिए नौकरी के अवसर'
            : 'Job opportunities for Bihar workers'}
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {jobs.slice(0, 2).map((job) => (
            <div key={job.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all`}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: colors.accent + '30', color: colors.text }}>
                    {job.wage}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                    {job.location}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <User size={18} className="mr-3 opacity-75" />
                  <span className="font-medium">{job.employer}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={18} className="mr-3 opacity-75" />
                  <span>{job.contact}</span>
                </div>
                <div className="flex items-start">
                  <FileText size={18} className="mr-3 opacity-75 mt-1" />
                  <p className="opacity-75">{job.description}</p>
                </div>
              </div>

              <button className="w-full text-white py-4 px-6 rounded-xl font-bold text-lg transition-all hover:shadow-lg"
                style={{ backgroundColor: colors.primary }}>
                {t.apply}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmergencyPage = () => (
    <div className="min-h-screen py-12" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-6 rounded-full mx-auto w-fit mb-4" style={{ backgroundColor: colors.error + '20' }}>
          <AlertTriangle size={60} style={{ color: colors.error }} />
        </div>
        <h2 className="text-4xl font-bold mb-4" style={{ color: colors.error }}>
          {t.emergency}
        </h2>
        <p className="text-lg opacity-75 mb-8">
          {language === 'hi'
            ? 'आपातकालीन स्थिति में तुरंत सहायता के लिए संपर्क करें'
            : 'Contact immediately for help in emergency situations'}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <h3 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
              {language === 'hi' ? '⚡ आपातकालीन संपर्क' : '⚡ Emergency Contacts'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚔</span>
                  <span className="font-medium">{language === 'hi' ? 'पुलिस' : 'Police'}</span>
                </div>
                <button
                  className="text-white px-4 py-2 rounded-lg font-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  100
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚑</span>
                  <span className="font-medium">{language === 'hi' ? 'एम्बुलेंस' : 'Ambulance'}</span>
                </div>
                <button
                  className="text-white px-4 py-2 rounded-lg font-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  108
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <span className="font-medium">{language === 'hi' ? 'मजदूर हेल्पलाइन' : 'Worker Helpline'}</span>
                </div>
                <button
                  className="text-white px-4 py-2 rounded-lg font-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  1800-891-1291
                </button>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <h3 className="text-xl font-bold mb-6" style={{ color: colors.accent }}>
              {language === 'hi' ? '💡 सुरक्षा सुझाव' : '💡 Safety Tips'}
            </h3>
            <ul className="space-y-3 text-left">
              <li>• {language === 'hi' ? 'शांत रहें और स्पष्ट जानकारी दें' : 'Stay calm and provide clear information'}</li>
              <li>• {language === 'hi' ? 'अपना सटीक स्थान बताएं' : 'Give your exact location'}</li>
              <li>• {language === 'hi' ? 'फोन को चालू रखें' : 'Keep your phone on'}</li>
              <li>• {language === 'hi' ? 'अकेले न रहें, मदद लें' : 'Do not stay alone, seek help'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="min-h-screen py-12" style={{ backgroundColor: darkMode ? colors.backgroundDark : colors.background }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <Shield size={60} className="mx-auto mb-4" style={{ color: colors.primary }} />
        <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
          {language === 'hi' ? 'प्रशासक पैनल' : 'Admin Panel'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: colors.primary + '20' }}>
                <Users size={28} style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: colors.primary }}>{migrants.length}</p>
                <p className="text-sm opacity-75">{t.totalMigrants}</p>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: colors.error + '20' }}>
                <AlertTriangle size={28} style={{ color: colors.error }} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: colors.error }}>
                  {emergencyRequests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-sm opacity-75">{t.activeRequests}</p>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: colors.accent + '20' }}>
                <Briefcase size={28} style={{ color: colors.accent }} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: colors.accent }}>{jobs.length}</p>
                <p className="text-sm opacity-75">{t.availableJobs}</p>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: colors.success + '20' }}>
                <Heart size={28} style={{ color: colors.success }} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: colors.success }}>{supportServices.length}</p>
                <p className="text-sm opacity-75">{t.supportCenters}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'register': return <RegistrationPage />;
      case 'support': return <SupportPage />;
      case 'jobs': return <JobBoardPage />;
      case 'emergency': return <EmergencyPage />;
      case 'admin': return <AdminDashboard />;
      default: return <HomePage />;
    }
  };

  return (
    <div
      className="transition-colors duration-300"
      style={{
        fontSize: `${fontSize}px`,
        backgroundColor: darkMode ? colors.backgroundDark : colors.background,
        color: darkMode ? colors.textDark : colors.text
      }}
    >
      <Navbar />
      {renderCurrentPage()}
      <AccessibilityToolbar />
      <ChatbotWidget />

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t-2 mt-16`} style={{ borderColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 mr-3" style={{ color: colors.primary }} />
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                Migration Connect
              </div>
              <div className="opacity-75">{t.tagline}</div>
            </div>
          </div>
          <p className="text-lg opacity-75 mb-6 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'बिहार के प्रवासी मजदूरों के लिए एक विश्वसनीय सहायता मंच। हमारा उद्देश्य हर मजदूर को उनके अधिकार और सुविधाएं दिलाना है।'
              : 'A trusted support platform for migrant workers from Bihar. Our mission is to ensure every worker gets their rights and facilities.'}
          </p>
          <p className="opacity-75">
            &copy; 2024 Migration Connect.
            {language === 'hi'
              ? ' सभी अधिकार सुरक्षित। बिहार सरकार के सहयोग से।'
              : ' All rights reserved. In collaboration with Government of Bihar.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MigrationConnect;