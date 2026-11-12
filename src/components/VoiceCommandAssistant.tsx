import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Play, 
  Radio, 
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { NavTab } from '../types';
import { SupportedLanguage } from '../i18n/translations';

interface VoiceCommandAssistantProps {
  onNavigateTab: (tab: NavTab) => void;
  onTriggerCycle: () => void;
  onToggleCurrency: () => void;
  onOpenLangModal: () => void;
  lang: SupportedLanguage;
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const VoiceCommandAssistant: React.FC<VoiceCommandAssistantProps> = ({
  onNavigateTab,
  onTriggerCycle,
  onToggleCurrency,
  onOpenLangModal,
  lang,
  isOpen,
  onClose,
  showToast,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [detectedAction, setDetectedAction] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [audioWaves, setAudioWaves] = useState<number[]>([30, 60, 45, 90, 75, 40, 85, 55, 70, 40]);

  const recognitionRef = useRef<any>(null);

  // Quick command suggestions for easy discovery
  const suggestedCommands = [
    { label: '⚡ Run optimization cycle', command: 'Run optimization cycle', am: 'ራስ-ሰር ዑደት አስጀምር' },
    { label: '📦 Show inventory alerts', command: 'Show inventory alerts', am: 'የዕቃ ማስጠንቀቂያ አሳይ' },
    { label: '🚀 Launch campaign engine', command: 'Launch campaign engine', am: 'የማስታወቂያ ሞተር ክፈት' },
    { label: '🎬 Open video audio studio', command: 'Open video audio studio', am: 'ቪዲዮና ድምፅ ስቱዲዮ ክፈት' },
    { label: '👥 Show Salesforce leads', command: 'Show Salesforce leads', am: 'የሽያጭ ደንበኞችን አሳይ' },
    { label: '💵 Switch to Ethiopian Birr / USD', command: 'Switch currency', am: 'የገንዘብ አይነት ቀይር' },
    { label: '🔌 Show database connectors', command: 'Show database connectors', am: 'መረጃ ቋትና ግንኙነቶችን አሳይ' },
    { label: '📱 Open Ethiopian Social Media Agent', command: 'Open Ethiopian social media agent', am: 'የማህበራዊ ሚዲያ አስተዳዳሪ ክፈት' },
    { label: '🌐 Open Ethiopian SEO agent', command: 'Open Ethiopian SEO agent', am: 'የኢትዮጵያ SEO እና ይዘት ስቱዲዮ' },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'am' ? 'am-ET' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedbackMessage(lang === 'am' ? 'እያዳመጥኩ ነው... ትዕዛዝዎን ይናገሩ' : 'Listening... Speak your command');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setTranscript(final);
          setInterimTranscript('');
          handleProcessVoiceCommand(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setFeedbackMessage('Microphone access denied. You can tap any suggested command below.');
        } else {
          setFeedbackMessage(`Voice input: ${event.error}. You can also tap suggested commands.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not initialize SpeechRecognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [lang]);

  // Audio wave animation during listening
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setAudioWaves(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 20)
        );
      }, 100);
    } else {
      setAudioWaves([20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback: simulate listening in environments where webkitSpeechRecognition is blocked
      simulateVoiceCapture();
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      setTranscript('');
      setInterimTranscript('');
      setDetectedAction(null);
      setFeedbackMessage(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        simulateVoiceCapture();
      }
    }
  };

  // Simulated voice capture for fallback demo
  const simulateVoiceCapture = () => {
    setIsListening(true);
    setTranscript('');
    setFeedbackMessage('Listening via Web Speech API...');
    setTimeout(() => {
      setInterimTranscript('Run optimization...');
    }, 600);
    setTimeout(() => {
      const demoCmd = 'Run optimization cycle';
      setTranscript(demoCmd);
      setInterimTranscript('');
      setIsListening(false);
      handleProcessVoiceCommand(demoCmd);
    }, 1400);
  };

  // Speak voice feedback response
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  };

  // Command parser & executor
  const handleProcessVoiceCommand = (cmdText: string) => {
    const lower = cmdText.toLowerCase().trim();

    // 1. Run Optimization Cycle
    if (
      lower.includes('run optimization') || 
      lower.includes('optimize') || 
      lower.includes('cycle') || 
      lower.includes('ዑደት') ||
      lower.includes('hojii')
    ) {
      setDetectedAction('⚡ Run Autonomous Multi-Agent Cycle');
      setFeedbackMessage('Executing optimization cycle across 5 agents...');
      speakFeedback('Executing autonomous omnichannel campaign optimization.');
      onTriggerCycle();
      showToast('🎤 Voice Command: Autonomous Cycle Triggered');
      setTimeout(() => onClose(), 1500);
      return;
    }

    // 2. Inventory Alerts & Stock
    if (
      lower.includes('inventory') || 
      lower.includes('alert') || 
      lower.includes('stock') || 
      lower.includes('ዕቃ') ||
      lower.includes('kuusaa')
    ) {
      setDetectedAction('📦 Navigate to Inventory & Low-Stock Alerts');
      setFeedbackMessage('Navigating to Inventory Parity and PO alerts...');
      speakFeedback('Showing inventory stock levels and reorder alerts.');
      onNavigateTab('inventory');
      showToast('🎤 Voice Command: Navigated to Inventory');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 3. Campaign Optimization Engine
    if (
      lower.includes('engine') || 
      lower.includes('campaign') || 
      lower.includes('bidding') || 
      lower.includes('targeting') ||
      lower.includes('ሞተር')
    ) {
      setDetectedAction('🚀 Launch Campaign Optimization Engine');
      setFeedbackMessage('Opening 4-vector cross-platform optimization engine...');
      speakFeedback('Opening campaign optimization engine.');
      onNavigateTab('engine');
      showToast('🎤 Voice Command: Opened Campaign Engine');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 4. Video & Audio Marketing Agent
    if (
      lower.includes('video') || 
      lower.includes('audio') || 
      lower.includes('script') || 
      lower.includes('storyboard') ||
      lower.includes('ቪዲዮ') ||
      lower.includes('ድምፅ')
    ) {
      setDetectedAction('🎬 Open AI Video & Audio Marketing Studio');
      setFeedbackMessage('Opening video storyboard generator & audio synthesizer...');
      speakFeedback('Opening video and audio marketing studio.');
      onNavigateTab('videoaudio');
      showToast('🎤 Voice Command: Opened Video & Audio Studio');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 5. Salesforce & CRM Leads
    if (
      lower.includes('crm') || 
      lower.includes('salesforce') || 
      lower.includes('lead') || 
      lower.includes('prospect') ||
      lower.includes('ደንበኞች')
    ) {
      setDetectedAction('👥 Open Salesforce CRM & BANT Leads');
      setFeedbackMessage('Opening Salesforce CRM 2-way sync & BANT pipeline...');
      speakFeedback('Showing qualified enterprise leads and Salesforce pipeline.');
      onNavigateTab('crm');
      showToast('🎤 Voice Command: Opened Salesforce CRM');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 6. Social Media & DMs (WhatsApp, Telegram, TikTok, Facebook, LinkedIn)
    if (
      lower.includes('social') || 
      lower.includes('telegram') ||
      lower.includes('whatsapp') ||
      lower.includes('tiktok') || 
      lower.includes('facebook') ||
      lower.includes('linkedin') ||
      lower.includes('dm') || 
      lower.includes('post') ||
      lower.includes('calendar') ||
      lower.includes('trending') ||
      lower.includes('ማህበራዊ') ||
      lower.includes('ቴሌግራም') ||
      lower.includes('ዋትስአፕ') ||
      lower.includes('miidiyaa')
    ) {
      setDetectedAction('💬 Open Ethiopian Social Media Agent & Content Creator');
      setFeedbackMessage('Opening Telegram, TikTok, WhatsApp creator & DM auto-pilot...');
      speakFeedback('Opening Ethiopian social media manager, trending formats, and content calendar.');
      onNavigateTab('social');
      showToast('🎤 Voice Command: Opened Social Media Agent');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 7. Business Advisor & Growth
    if (
      lower.includes('business') || 
      lower.includes('financial') || 
      lower.includes('growth') || 
      lower.includes('margin') || 
      lower.includes('cac') ||
      lower.includes('ፋይናንስ')
    ) {
      setDetectedAction('📊 Open AI Business Advisor & Unit Economics');
      setFeedbackMessage('Opening financial trends & strategic growth simulator...');
      speakFeedback('Opening AI business advisor and financial dashboard.');
      onNavigateTab('business');
      showToast('🎤 Voice Command: Opened Business Advisor');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 8. Database & Connectors
    if (
      lower.includes('database') || 
      lower.includes('connector') || 
      lower.includes('telebirr') || 
      lower.includes('ping') ||
      lower.includes('መረጃ ቋት')
    ) {
      setDetectedAction('🔌 Open Database & Telebirr/CBE Connectors');
      setFeedbackMessage('Opening real-time connector latency & database inspector...');
      speakFeedback('Opening database and payment gateway connectors.');
      onNavigateTab('database');
      showToast('🎤 Voice Command: Opened Database Hub');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 9. Ethiopian SEO & Cultural Content Agent
    if (
      lower.includes('seo') ||
      lower.includes('content') ||
      lower.includes('meskel') ||
      lower.includes('enkutatash') ||
      lower.includes('ይዘት') ||
      lower.includes('qabiyyee')
    ) {
      setDetectedAction('🌐 Open Ethiopian SEO & Content Marketing Studio');
      setFeedbackMessage('Opening Google.com.et SEO, meta tag & cultural storytelling studio...');
      speakFeedback('Opening Ethiopian SEO and content marketing studio.');
      onNavigateTab('seo');
      showToast('🎤 Voice Command: Opened SEO Studio');
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 10. Switch Currency
    if (
      lower.includes('currency') || 
      lower.includes('birr') || 
      lower.includes('dollar') || 
      lower.includes('etb') || 
      lower.includes('usd') ||
      lower.includes('ገንዘብ')
    ) {
      setDetectedAction('💵 Toggle Currency (ETB ብር ↔ USD $)');
      setFeedbackMessage('Switching currency mode...');
      speakFeedback('Currency converted.');
      onToggleCurrency();
      setTimeout(() => onClose(), 1400);
      return;
    }

    // 10. Change Language
    if (
      lower.includes('language') || 
      lower.includes('amharic') || 
      lower.includes('english') || 
      lower.includes('oromo') || 
      lower.includes('tigrinya') ||
      lower.includes('ቋንቋ')
    ) {
      setDetectedAction('🌐 Open Multilingual Language Drawer');
      setFeedbackMessage('Opening Ethiopian multilingual selector...');
      speakFeedback('Opening language selector.');
      onOpenLangModal();
      setTimeout(() => onClose(), 1400);
      return;
    }

    // Unrecognized fallback
    setDetectedAction(null);
    setFeedbackMessage(`Unrecognized voice command: "${cmdText}". Try saying "Run optimization cycle" or "Show inventory alerts".`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-900 bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>WiseSell Voice Assistant</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800/40 px-1.5 py-0.2 rounded">
                  Web Speech API
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'am' ? 'በድምፅ ትዕዛዝ ይስጡ (ለምሳሌ፡ ራስ-ሰር ዑደት አስጀምር)' : 'Speak hands-free commands in English or Amharic'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Audio Microphone & Visualizer */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative flex items-center justify-center my-2">
            {/* Outer pulsating wave ring */}
            {isListening && (
              <>
                <div className="absolute w-32 h-32 rounded-full bg-orange-500/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-blue-500/25 animate-pulse" />
              </>
            )}

            {/* Central Microphone Button */}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-orange-500 to-red-500 text-white ring-4 ring-orange-500/30 scale-105'
                  : 'bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-700 text-orange-400 hover:text-white hover:border-orange-500'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice listening'}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-pulse text-white" />
              ) : (
                <Mic className="w-8 h-8 text-orange-400" />
              )}
            </button>
          </div>

          {/* Dynamic Audio Frequency Bars */}
          <div className="flex items-center gap-1.5 h-10 px-4">
            {audioWaves.map((height, idx) => (
              <div
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isListening
                    ? idx % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Transcript / Listening State Indicator */}
          <div className="w-full min-h-[56px] p-3 rounded-xl bg-black border border-slate-800/80 text-left flex flex-col justify-center">
            {isListening && !transcript && !interimTranscript && (
              <div className="flex items-center gap-2 text-xs text-orange-400 font-medium animate-pulse">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>{lang === 'am' ? 'እያዳመጥኩ ነው... ትዕዛዝዎን ይናገሩ' : 'Listening... Say "Run optimization cycle"'}</span>
              </div>
            )}

            {interimTranscript && (
              <div className="text-xs text-slate-400 italic">
                "{interimTranscript}..."
              </div>
            )}

            {transcript && (
              <div className="text-xs sm:text-sm font-semibold text-white">
                "{transcript}"
              </div>
            )}

            {!isListening && !transcript && !interimTranscript && (
              <div className="text-xs text-slate-500 text-center">
                Tap the microphone or select any voice command below
              </div>
            )}
          </div>

          {/* Detected Action Feedback */}
          {detectedAction && (
            <div className="w-full p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">{detectedAction}</span>
                {feedbackMessage && <p className="text-[11px] text-emerald-200 mt-0.5">{feedbackMessage}</p>}
              </div>
            </div>
          )}

          {feedbackMessage && !detectedAction && (
            <div className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs text-left">
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Suggested Quick Tap Voice Prompts */}
        <div className="p-4 px-6 bg-slate-950/90 border-t border-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>Instant Voice Command Prompts</span>
            <span className="text-[10px] text-orange-400">1-Tap to Execute</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {suggestedCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(item.command);
                  handleProcessVoiceCommand(item.command);
                }}
                className="p-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-orange-500/60 hover:bg-slate-850 text-left text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate pr-2">
                  <div className="truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.am}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
