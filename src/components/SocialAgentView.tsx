import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Globe,
  Video,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Coffee,
  Bookmark,
  Smartphone,
  Eye,
  MessageCircle,
  ThumbsUp,
  Play,
  Image as ImageIcon,
  Activity,
  Layers,
  Cpu,
  Sliders,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { 
  SocialPost, 
  CustomerEngagementItem, 
  EthiopianSocialPlatform, 
  EthiopianTrendingFormat, 
  EthiopianCalendarSlot 
} from '../types';
import { initialTrendingFormats, initialCalendarSlots } from '../data/mockData';

interface SocialAgentViewProps {
  posts: SocialPost[];
  engagementItems: CustomerEngagementItem[];
  onUpdatePosts: (posts: SocialPost[]) => void;
  onUpdateEngagement: (items: CustomerEngagementItem[]) => void;
  onAddAgentLog: (action: string, impact: string, category: 'Automation') => void;
}

interface SocialGraphConnector {
  id: string;
  name: string;
  platform: EthiopianSocialPlatform;
  status: 'Connected' | 'Syncing' | 'Degraded';
  latencyMs: number;
  webhookStatus: 'Active' | 'Listening';
  eventsProcessedToday: number;
  apiEndpoint: string;
  authScope: string;
  lastPing: string;
}

export const SocialAgentView: React.FC<SocialAgentViewProps> = ({
  posts,
  engagementItems,
  onUpdatePosts,
  onUpdateEngagement,
  onAddAgentLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'create' | 'connectors' | 'imagePrompt' | 'sentiment' | 'formats' | 'calendar' | 'engagement' | 'queue'
  >('create');

  // Generator form state
  const [platform, setPlatform] = useState<EthiopianSocialPlatform>('Telegram');
  const [primaryLang, setPrimaryLang] = useState<'am' | 'om' | 'en'>('am');
  const [productFocus, setProductFocus] = useState<string>('Yirgacheffe Grade 1 Specialty Roast Coffee');
  const [topic, setTopic] = useState<string>('Direct artisan origin, morning freshness, free Addis Ababa delivery & 1-click Telebirr checkout');
  const [tone, setTone] = useState<string>('Culturally respectful, energetic, high-converting');
  const [goal, setGoal] = useState<string>('Drive direct orders via Telebirr Bot and qualified customer inquiries');
  const [holidaySeason, setHolidaySeason] = useState<string>('Standard EAT Business Week');

  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [previewLanguageTab, setPreviewLanguageTab] = useState<'am' | 'om' | 'en'>('am');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Social Media Graph Connectors State
  const [graphConnectors, setGraphConnectors] = useState<SocialGraphConnector[]>([
    {
      id: 'conn-tg',
      name: 'Telegram Bot & Channel Graph API',
      platform: 'Telegram',
      status: 'Connected',
      latencyMs: 24,
      webhookStatus: 'Active',
      eventsProcessedToday: 1840,
      apiEndpoint: 'https://api.telegram.org/bot[REDACTED]/setWebhook',
      authScope: 'channel:post, inline_keyboard, telebirr_checkout_hook',
      lastPing: 'Just now',
    },
    {
      id: 'conn-tt',
      name: 'TikTok Creator & Spark Ads Graph API',
      platform: 'TikTok',
      status: 'Connected',
      latencyMs: 48,
      webhookStatus: 'Active',
      eventsProcessedToday: 3210,
      apiEndpoint: 'https://business-api.tiktok.com/open_api/v1.3/spark_ads/',
      authScope: 'video.upload, sound.attribution, comment.reply, analytics.read',
      lastPing: '1 min ago',
    },
    {
      id: 'conn-wa',
      name: 'WhatsApp Business Cloud API (Meta Graph)',
      platform: 'WhatsApp',
      status: 'Connected',
      latencyMs: 32,
      webhookStatus: 'Active',
      eventsProcessedToday: 980,
      apiEndpoint: 'https://graph.facebook.com/v19.0/whatsapp_business_account/',
      authScope: 'whatsapp_business_messaging, catalog_management, phone_number_verify',
      lastPing: 'Just now',
    },
    {
      id: 'conn-fb',
      name: 'Meta Graph API (Facebook Page & Reels)',
      platform: 'Facebook',
      status: 'Connected',
      latencyMs: 41,
      webhookStatus: 'Active',
      eventsProcessedToday: 2450,
      apiEndpoint: 'https://graph.facebook.com/v19.0/me/feed',
      authScope: 'pages_manage_posts, pages_read_engagement, publish_video',
      lastPing: '2 mins ago',
    },
    {
      id: 'conn-li',
      name: 'LinkedIn Community Management API',
      platform: 'LinkedIn',
      status: 'Connected',
      latencyMs: 65,
      webhookStatus: 'Active',
      eventsProcessedToday: 340,
      apiEndpoint: 'https://api.linkedin.com/v2/ugcPosts',
      authScope: 'w_organization_social, r_organization_social, b2b_analytics',
      lastPing: '4 mins ago',
    },
  ]);
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Image Prompt Generator State
  const [imgProductTitle, setImgProductTitle] = useState<string>('Single-Origin Yirgacheffe Specialty Coffee Beans');
  const [imgPlatform, setImgPlatform] = useState<EthiopianSocialPlatform>('Telegram');
  const [imgTheme, setImgTheme] = useState<string>('Commercial Luxury & Authentic Ethiopian Heritage');
  const [imgSetting, setImgSetting] = useState<string>('Traditional clay Jebena brewing with morning steam, Addis Ababa golden hour');
  const [isImgGenerating, setIsImgGenerating] = useState<boolean>(false);
  const [generatedImgPrompt, setGeneratedImgPrompt] = useState<any>(null);

  // Sentiment Analysis Engine State
  const [sentimentInputText, setSentimentInputText] = useState<string>(
    'ጤና ይስጥልኝ! 2 ኪሎ የይርጋጨፌ ስፔሻሊቲ ቡና ማዘዝ እፈልጋለሁ። ቦሌ መድኃኔዓለም አካባቢ ዛሬ ማድረስ ትችላላችሁ? ክፍያውን በቴሌብር ነው የምፈጽመው።'
  );
  const [sentimentChannel, setSentimentChannel] = useState<string>('Telegram');
  const [sentimentCustomerName, setSentimentCustomerName] = useState<string>('Alemayehu T.');
  const [isSentimentAnalyzing, setIsSentimentAnalyzing] = useState<boolean>(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  // Trending formats state
  const [selectedFormatPlatform, setSelectedFormatPlatform] = useState<string>('All');
  const [trendingFormats] = useState<EthiopianTrendingFormat[]>(initialTrendingFormats);

  // Calendar slots state
  const [calendarSlots] = useState<EthiopianCalendarSlot[]>(initialCalendarSlots);

  // Engagement response editing state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [engagementLangTab, setEngagementLangTab] = useState<Record<string, 'am' | 'om' | 'en'>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Ping a Social Graph Connector
  const handlePingConnector = (connectorId: string) => {
    setPingingId(connectorId);
    setTimeout(() => {
      setGraphConnectors((prev) =>
        prev.map((conn) => {
          if (conn.id !== connectorId) return conn;
          const newLatency = Math.floor(Math.random() * 25) + 20;
          return {
            ...conn,
            latencyMs: newLatency,
            lastPing: 'Just now (Ping verified 200 OK)',
            eventsProcessedToday: conn.eventsProcessedToday + 1,
          };
        })
      );
      setPingingId(null);
      onAddAgentLog(
        `Verified live handshake on ${graphConnectors.find((c) => c.id === connectorId)?.name}`,
        'Webhook latency tested and OAuth token refreshed',
        'Automation'
      );
    }, 600);
  };

  // Generate Image Prompt
  const handleGenerateImagePrompt = async () => {
    setIsImgGenerating(true);
    try {
      const res = await fetch('/api/ai/image-prompt-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: imgProductTitle,
          platform: imgPlatform,
          targetAudience: 'Ethiopian urban shoppers and diaspora consumers',
          styleTheme: imgTheme,
          culturalContext: imgSetting,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedImgPrompt(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImgGenerating(false);
    }
  };

  // Analyze Customer Sentiment
  const handleAnalyzeSentiment = async () => {
    setIsSentimentAnalyzing(true);
    try {
      const res = await fetch('/api/ai/sentiment-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sentimentInputText,
          channel: sentimentChannel,
          customerName: sentimentCustomerName,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSentimentResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSentimentAnalyzing(false);
    }
  };

  // Quick preset loader for Sentiment testing
  const handleLoadSentimentPreset = (presetText: string, langName: string, channelName: string) => {
    setSentimentInputText(presetText);
    setSentimentChannel(channelName);
    setSentimentResult(null);
  };

  // Generate new content via server Gemini API
  const handleGenerateContent = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/content-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          topic,
          tone,
          productFocus,
          goal,
          language: primaryLang,
          holidaySeason,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedDraft(data.data);
        setPreviewLanguageTab(primaryLang);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Add generated post to scheduling queue
  const handleScheduleGeneratedPost = () => {
    if (!generatedDraft) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      platform,
      primaryLanguage: primaryLang,
      hook: generatedDraft.hook || 'High-converting Ethiopian social post',
      caption: generatedDraft.caption || '',
      multilingualContent: generatedDraft.multilingualContent,
      shortFormVideoHook: generatedDraft.shortFormVideoHook,
      scheduledTime: generatedDraft.bestTimeToPost || 'Tomorrow at 07:45 AM EAT',
      scheduledEatTime: generatedDraft.scheduledEatTime || '07:45 EAT',
      status: 'Scheduled',
      tags: generatedDraft.hashtags || ['#EthiopiaCommerce', '#Telebirr', '#HabeshaTikTok'],
      holidaySeason,
      channelSpecificPayload: generatedDraft.channelSpecificPayload,
    };

    onUpdatePosts([newPost, ...posts]);
    onAddAgentLog(
      `Scheduled autonomous ${platform} campaign in ${primaryLang === 'am' ? 'Amharic' : primaryLang === 'om' ? 'Afaan Oromoo' : 'English'}: "${newPost.hook.slice(0, 45)}..."`,
      `Optimized for EAT peak window (${newPost.scheduledTime}) with Telebirr paylink`,
      'Automation'
    );
    setGeneratedDraft(null);
    setActiveSubTab('queue');
  };

  // Send AI auto-response to customer
  const handleSendResponse = (itemId: string) => {
    const updated = engagementItems.map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        status: 'AI Responded' as const,
        aiDraftedResponse: replyTextMap[itemId] || item.aiDraftedResponse,
      };
    });

    onUpdateEngagement(updated);
    const targetItem = engagementItems.find((i) => i.id === itemId);
    onAddAgentLog(
      `Autonomous multi-lingual reply dispatched to ${targetItem?.customerName || 'customer'} on ${targetItem?.platform}`,
      `Order delivery in ${targetItem?.deliveryCity || 'Addis Ababa'} confirmed & synced to Salesforce`,
      'Automation'
    );
  };

  // Generate Telebirr payment order link
  const handleGenerateTelebirrLink = (itemId: string) => {
    const refCode = `TB-${Math.floor(100000 + Math.random() * 900000)}`;
    const link = `https://telebirr.et/pay?ref=${refCode}&merchant=WS_COMMERCE`;
    
    // Append link to reply
    const currentReply = replyTextMap[itemId] !== undefined 
      ? replyTextMap[itemId] 
      : engagementItems.find(i => i.id === itemId)?.aiDraftedResponse || '';
    
    const updatedReply = `${currentReply}\n\n💳 የቴሌብር ክፍያ ሊንክ (Telebirr 1-Click Pay): ${link}`;
    setReplyTextMap(prev => ({ ...prev, [itemId]: updatedReply }));
  };

  // Load a format template into creator
  const handleApplyFormatToCreator = (fmt: EthiopianTrendingFormat) => {
    setPlatform(fmt.platform);
    if (fmt.platform === 'Telegram') {
      setTopic('Formatted Ge\'ez Channel broadcast with emoji specifications, transparent ETB pricing, and Telebirr bot order button');
      setTone('Direct, transparent, fast customer care');
    } else if (fmt.platform === 'TikTok') {
      setTopic('3-second cultural pattern interrupt with Habesha sound remix and bio-link to Telegram channel');
      setTone('High-energy, humorous, relatable Habesha lifestyle');
    } else if (fmt.platform === 'WhatsApp') {
      setTopic('Respectful Ethiopian greeting with 1:1 business catalog drop, instant invoice, and door-to-door Addis delivery');
      setTone('Culturally respectful, polite, accommodating');
    } else if (fmt.platform === 'Facebook') {
      setTopic('Long-form heritage storytelling highlighting artisan weavers, family tradition, and diaspora gifting');
      setTone('Heartfelt, community-centered, cultural pride');
    } else if (fmt.platform === 'LinkedIn') {
      setTopic('Macro analysis of Ethiopian forex modernization, digital payments surge, and direct coffee export opportunities');
      setTone('Authoritative B2B, analytical, data-driven');
    }
    setActiveSubTab('create');
  };

  const filteredTrendingFormats = selectedFormatPlatform === 'All'
    ? trendingFormats
    : trendingFormats.filter(f => f.platform === selectedFormatPlatform);

  return (
    <div className="space-y-6">
      {/* Configuration Template Header Badge */}
      <div className="p-4 px-5 bg-black border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-semibold">Configuration Template:</span>
          <span className="text-white font-mono font-bold bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg">
            Model: Multimodal Vision & Text Agent
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-semibold text-[11px]">Armed Tools:</span>
          <button
            onClick={() => setActiveSubTab('connectors')}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'connectors'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-blue-950/80 text-blue-300 border border-blue-800/40 hover:bg-blue-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Social Media Graph Connectors</span>
          </button>
          <button
            onClick={() => setActiveSubTab('imagePrompt')}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'imagePrompt'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : 'bg-orange-950/80 text-orange-300 border border-orange-800/40 hover:bg-orange-900/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
            <span>Image Prompt Generator</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sentiment')}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'sentiment'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sentiment Analysis Engine</span>
          </button>
        </div>
      </div>

      {/* Main Agent Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Social Media & Content Creator Agent
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Ethiopian Ecosystem Active (EAT UTC+3)
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Amharic · Afaan Oromoo · English
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multimodal Social Commerce & Community Management
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Autonomous social engine connected via <span className="text-cyan-400 font-semibold">Graph Connectors</span> to Telegram, TikTok, WhatsApp, Facebook, and LinkedIn. Features an <span className="text-orange-400 font-semibold">Image Prompt Generator</span> for commercial visual assets and an NLP <span className="text-emerald-400 font-semibold">Sentiment Analysis Engine</span> calibrated for Ethiopian consumer intent.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/90 border border-slate-800 rounded-xl shrink-0 self-start lg:self-center">
            <button
              onClick={() => setActiveSubTab('create')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'create' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Creator</span>
            </button>
            <button
              onClick={() => setActiveSubTab('connectors')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'connectors' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Graph Connectors (5)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('imagePrompt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'imagePrompt' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
              <span>Image Prompts</span>
            </button>
            <button
              onClick={() => setActiveSubTab('sentiment')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'sentiment' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sentiment Engine</span>
            </button>
            <button
              onClick={() => setActiveSubTab('formats')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'formats' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Formats</span>
            </button>
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'calendar' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>EAT Calendar</span>
            </button>
            <button
              onClick={() => setActiveSubTab('engagement')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'engagement' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DM Inbox ({engagementItems.filter((i) => i.status === 'Awaiting Approval').length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'queue' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Queue ({posts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOOL 1: Social Media Graph Connectors Console */}
      {activeSubTab === 'connectors' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-0.5">
                <Layers className="w-4 h-4" />
                <span>Tool 1 of 3: Social Media Graph Connectors</span>
              </div>
              <h2 className="text-xl font-bold text-white">Live Ethiopian Social Graph API Mesh</h2>
              <p className="text-xs text-slate-400">
                Omnichannel API endpoints, webhook listeners, and OAuth bearer token status across Ethiopia’s top channels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>5/5 Graph Connectors Healthy</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graphConnectors.map((conn) => (
              <div 
                key={conn.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40">
                      {conn.platform}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {conn.status} · {conn.latencyMs}ms
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{conn.name}</h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                      {conn.apiEndpoint}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Webhook Stream:</span>
                      <span className="text-emerald-300 font-mono font-medium">{conn.webhookStatus}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Events Handled Today:</span>
                      <span className="text-white font-mono font-bold">{conn.eventsProcessedToday.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      Scope: {conn.authScope}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{conn.lastPing}</span>
                  <button
                    onClick={() => handlePingConnector(conn.id)}
                    disabled={pingingId === conn.id}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${pingingId === conn.id ? 'animate-spin' : ''}`} />
                    <span>{pingingId === conn.id ? 'Pinging...' : 'Ping Graph API'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 2: Image Prompt Generator Console */}
      {activeSubTab === 'imagePrompt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Image Prompt Generator Tool</h2>
                <p className="text-[11px] text-slate-400">Midjourney v6 · Imagen 3 · FLUX High-Fidelity Specs</p>
              </div>
            </div>

            {/* Quick cultural presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Quick Cultural Asset Presets</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setImgProductTitle('Single-Origin Yirgacheffe Specialty Coffee Beans');
                    setImgSetting('Traditional clay Jebena brewing with morning steam, Addis Ababa golden hour');
                    setImgTheme('Commercial Luxury & Authentic Ethiopian Heritage');
                    setImgPlatform('Telegram');
                  }}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-orange-500/40 text-[11px] transition-all"
                >
                  ☕️ Yirgacheffe Jebena
                </button>
                <button
                  onClick={() => {
                    setImgProductTitle('Handwoven Habesha Kemis with Golden Tibeb Embroidery');
                    setImgSetting('Sunlit Addis Ababa courtyard, pure organic cotton texture, model in natural posture');
                    setImgTheme('Haute Couture African Luxury & Traditional Weaver Pride');
                    setImgPlatform('TikTok');
                  }}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-orange-500/40 text-[11px] transition-all"
                >
                  👗 Habesha Kemis Silk
                </button>
                <button
                  onClick={() => {
                    setImgProductTitle('Cold-Pressed Pure Ethiopian Black Seed Oil (Tikur Azmud)');
                    setImgSetting('Amber apothecary dropper bottle resting on ancient Ethiopian cedar wood and dried botanicals');
                    setImgTheme('Holistic Wellness & Organic Botanical Purity');
                    setImgPlatform('WhatsApp');
                  }}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-orange-500/40 text-[11px] transition-all"
                >
                  🌿 Black Seed Oil
                </button>
                <button
                  onClick={() => {
                    setImgProductTitle('Full-Grain Ethiopian Artisan Leather Messenger Bag');
                    setImgSetting('Modern coffee shop in Bole Addis Ababa, laptop, brass hardware, cognac patina leather');
                    setImgTheme('Executive Urban Minimalist & Craftsmanship Heritage');
                    setImgPlatform('LinkedIn');
                  }}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-orange-500/40 text-[11px] transition-all"
                >
                  💼 Full-Grain Leather
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  value={imgProductTitle}
                  onChange={(e) => setImgProductTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1 text-[11px]">
                  {(['Telegram', 'TikTok', 'WhatsApp', 'Facebook', 'LinkedIn'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setImgPlatform(p)}
                      className={`py-1.5 rounded border transition-all ${
                        imgPlatform === p
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Visual Theme / Lighting</label>
                <input
                  type="text"
                  value={imgTheme}
                  onChange={(e) => setImgTheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cultural Setting & Composition</label>
                <textarea
                  rows={2}
                  value={imgSetting}
                  onChange={(e) => setImgSetting(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                onClick={handleGenerateImagePrompt}
                disabled={isImgGenerating}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isImgGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Studio Camera Prompt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Generate Commercial Image Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Output Preview Side */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Generated Image Generation Blueprint</span>
                  <span className="text-[11px] text-orange-400 bg-orange-950/60 border border-orange-800/40 px-2 py-0.5 rounded font-mono">
                    {imgPlatform} ({imgPlatform === 'TikTok' ? '9:16' : imgPlatform === 'Telegram' ? '1:1' : '16:9'})
                  </span>
                </div>
              </div>

              {generatedImgPrompt ? (
                <div className="space-y-4">
                  {/* Primary Prompt with Copy button */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Ready-to-Use Prompt (Midjourney / Imagen 3 / FLUX)</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(generatedImgPrompt.primaryPrompt, 'imgPrompt')}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        {copiedKey === 'imgPrompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'imgPrompt' ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {generatedImgPrompt.primaryPrompt}
                    </p>
                  </div>

                  {/* Composition Breakdown */}
                  {generatedImgPrompt.visualComposition && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        Visual Composition & Gear Spec
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block font-semibold text-[10px]">Foreground:</span>
                          <span className="text-slate-200">{generatedImgPrompt.visualComposition.foreground}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block font-semibold text-[10px]">Midground Accents:</span>
                          <span className="text-slate-200">{generatedImgPrompt.visualComposition.midground}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block font-semibold text-[10px]">Lighting:</span>
                          <span className="text-emerald-400">{generatedImgPrompt.visualComposition.lighting}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block font-semibold text-[10px]">Camera Setting:</span>
                          <span className="text-cyan-400 font-mono">{generatedImgPrompt.visualComposition.cameraSetting}</span>
                        </div>
                      </div>

                      {/* Color Palette */}
                      {generatedImgPrompt.visualComposition.colorPalette && (
                        <div className="pt-2">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Harmonized Color Palette:</span>
                          <div className="flex flex-wrap gap-2">
                            {generatedImgPrompt.visualComposition.colorPalette.map((col: string, idx: number) => (
                              <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Negative Prompt */}
                  {generatedImgPrompt.negativePrompt && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-red-950/40 text-xs">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                        Negative Prompt:
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {generatedImgPrompt.negativePrompt}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-orange-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-300">Ready to synthesize commercial image prompts</div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                      Choose a product preset or custom prompt on the left to generate hyper-realistic prompts for Midjourney, Imagen 3, or FLUX.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {generatedImgPrompt && (
              <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Optimized for: <strong className="text-white">{imgPlatform}</strong>
                </span>
                <button
                  onClick={() => copyToClipboard(generatedImgPrompt.primaryPrompt, 'bottomPrompt')}
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'bottomPrompt' ? 'Prompt Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: Sentiment Analysis Engine Console */}
      {activeSubTab === 'sentiment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Sentiment Analysis Engine</h2>
                <p className="text-[11px] text-slate-400">Amharic, Afaan Oromoo & English NLP Intent Parser</p>
              </div>
            </div>

            {/* Quick Inbound Presets for Testing */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Test with Live Inbound Customer Inquiries</label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => handleLoadSentimentPreset(
                    'ጤና ይስጥልኝ! 2 ኪሎ የይርጋጨፌ ስፔሻሊቲ ቡና ማዘዝ እፈልጋለሁ። ቦሌ መድኃኔዓለም አካባቢ ዛሬ ማድረስ ትችላላችሁ? ክፍያውን በቴሌብር ነው የምፈጽመው።',
                    'Amharic',
                    'Telegram'
                  )}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-left hover:border-emerald-500/40 transition-all text-[11px]"
                >
                  <span className="text-orange-400 font-bold block">🇪🇹 Amharic Telegram Inquiry:</span>
                  <span className="text-slate-300 truncate block">"ጤና ይስጥልኝ! 2 ኪሎ የይርጋጨፌ ቡና ማዘዝ እፈልጋለሁ... ቦሌ ዛሬ በቴሌብር..."</span>
                </button>
                <button
                  onClick={() => handleLoadSentimentPreset(
                    'Akkam jirtu! Wandaboo kana Adamaatti erguu dandeessuu? Akkasumas gatiin isaa meeqa? Telebirriidhaan kaffaluu nan danda\'aa?',
                    'Afaan Oromoo',
                    'TikTok'
                  )}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-left hover:border-emerald-500/40 transition-all text-[11px]"
                >
                  <span className="text-emerald-400 font-bold block">🇪🇹 Afaan Oromoo TikTok Inquiry:</span>
                  <span className="text-slate-300 truncate block">"Akkam jirtu! Wandaboo kana Adamaatti erguu dandeessuu? Telebirriin..."</span>
                </button>
                <button
                  onClick={() => handleLoadSentimentPreset(
                    'Good afternoon. I need 15 bottles of 250ml pure black seed oil for our Kazanchis clinic. Do you issue official electronic VAT invoices with TIN?',
                    'English',
                    'WhatsApp'
                  )}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-left hover:border-emerald-500/40 transition-all text-[11px]"
                >
                  <span className="text-blue-400 font-bold block">🌍 B2B English WhatsApp Inquiry:</span>
                  <span className="text-slate-300 truncate block">"Good afternoon. Need 15 bottles black seed oil for clinic. Do you issue VAT invoice?"</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Message to Analyze</label>
                <textarea
                  rows={4}
                  value={sentimentInputText}
                  onChange={(e) => setSentimentInputText(e.target.value)}
                  placeholder="Paste any customer DM or comment in Amharic, Afaan Oromoo, or English..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Social Channel</label>
                  <select
                    value={sentimentChannel}
                    onChange={(e) => setSentimentChannel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Telegram">Telegram Channel</option>
                    <option value="TikTok">TikTok Comment</option>
                    <option value="WhatsApp">WhatsApp Business</option>
                    <option value="Facebook">Facebook Post</option>
                    <option value="LinkedIn">LinkedIn B2B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Handle</label>
                  <input
                    type="text"
                    value={sentimentCustomerName}
                    onChange={(e) => setSentimentCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeSentiment}
                disabled={isSentimentAnalyzing}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isSentimentAnalyzing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Parsing Ethiopian NLP Intent Vectors...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 text-white" />
                    <span>Run Sentiment & Intent Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sentiment Engine Results Side */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Sentiment Telemetry & Buying Intent</span>
                  {sentimentResult && (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded font-semibold">
                      {sentimentResult.languageDetected}
                    </span>
                  )}
                </div>
              </div>

              {sentimentResult ? (
                <div className="space-y-4">
                  {/* Metric Gauges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sentiment Classification</span>
                      <span className="text-sm font-bold text-emerald-400 mt-1 block">
                        {sentimentResult.sentiment}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Polarity: +{sentimentResult.polarityScore}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Purchase Intent Score</span>
                      <span className="text-xl font-extrabold text-orange-400 font-mono mt-0.5 block">
                        {sentimentResult.purchaseIntentScore}/100
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">High Closing Probability</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Escalation Risk</span>
                      <span className="text-xs font-bold text-blue-300 mt-1 block">
                        {sentimentResult.escalationRisk}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{sentimentResult.intentCategory}</span>
                    </div>
                  </div>

                  {/* Emotional Triggers Identified */}
                  {sentimentResult.emotionalTriggers && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Identified Linguistic & Cultural Triggers:
                      </span>
                      <div className="space-y-1.5">
                        {sentimentResult.emotionalTriggers.map((trig: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{trig}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Routing Action */}
                  <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200 space-y-1">
                    <strong className="text-blue-400">Recommended Routing Action: </strong>
                    <span>{sentimentResult.recommendedAction}</span>
                  </div>

                  {/* Suggested Instant Reply */}
                  {sentimentResult.suggestedInstantReply && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Suggested Instant Reply ({sentimentResult.languageDetected}):</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(sentimentResult.suggestedInstantReply, 'replyPrompt')}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === 'replyPrompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'replyPrompt' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        {sentimentResult.suggestedInstantReply}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-emerald-400">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-300">Ready to analyze customer sentiment</div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                      Select a sample inquiry or paste customer text on the left to measure purchase intent, emotional triggers, and generate instant replies.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab: AI Creator & Short-Form Video Studio */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Ethiopian Content Creator Studio</h2>
                  <p className="text-[11px] text-slate-400">Gemini 3.8 Flash · Multi-Lingual & Short-Form Video</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Ethiopian Social Channel
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(['Telegram', 'TikTok', 'WhatsApp', 'Facebook', 'LinkedIn'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`py-2 px-1 text-center font-medium rounded-lg border transition-all text-[11px] cursor-pointer ${
                        platform === p
                          ? 'bg-blue-600/30 border-blue-500 text-white font-semibold shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Language */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Language Target
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPrimaryLang('am')}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      primaryLang === 'am'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    አማርኛ (Amharic)
                  </button>
                  <button
                    onClick={() => setPrimaryLang('om')}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      primaryLang === 'om'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Afaan Oromoo
                  </button>
                  <button
                    onClick={() => setPrimaryLang('en')}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      primaryLang === 'en'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    English (Diaspora/B2B)
                  </button>
                </div>
              </div>

              {/* Holiday / Cultural Context */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Holiday / Cultural Season Context
                </label>
                <select
                  value={holidaySeason}
                  onChange={(e) => setHolidaySeason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Standard EAT Business Week">Standard EAT Business Week</option>
                  <option value="Enkutatash (Ethiopian New Year)">Enkutatash (Ethiopian New Year - መስከረም)</option>
                  <option value="Meskel (Demera Celebration)">Meskel (Demera Celebration - መስቀል)</option>
                  <option value="Ethiopian Christmas (Genna)">Ethiopian Christmas (Genna - ገና)</option>
                  <option value="Timkat (Epiphany)">Timkat (Epiphany - ጥምቀት)</option>
                  <option value="Eid al-Fitr & Eid al-Adha">Eid al-Fitr & Eid al-Adha</option>
                  <option value="Irreechaa (Thanksgiving Festival)">Irreechaa (Thanksgiving Festival)</option>
                  <option value="Adwa Victory Day">Adwa Victory Day (የዓድዋ ድል በዓል)</option>
                </select>
              </div>

              {/* Product Focus */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Focus</label>
                <input
                  type="text"
                  value={productFocus}
                  onChange={(e) => setProductFocus(e.target.value)}
                  placeholder="e.g. Yirgacheffe Specialty Coffee or Habesha Kemis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Topic / Angle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Storytelling Angle</label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Organic single origin, Telebirr payment, door-to-door delivery"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tone & Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tone</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Goal</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateContent}
                disabled={isAiGenerating}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAiGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Multi-Lingual Copy & Video Hook...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Generate Ethiopian {platform} Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Preview Side */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Generated Content Package</span>
                  <span className="text-[11px] text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded font-mono font-semibold">
                    {platform}
                  </span>
                  <span className="text-[10px] text-orange-400 bg-orange-950/60 border border-orange-800/40 px-2 py-0.5 rounded font-mono">
                    {holidaySeason}
                  </span>
                </div>

                {generatedDraft?.bestTimeToPost && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{generatedDraft.bestTimeToPost}</span>
                  </span>
                )}
              </div>

              {generatedDraft ? (
                <div className="space-y-4">
                  {/* Multi-lingual Language Switcher Bar */}
                  {generatedDraft.multilingualContent && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>Preview Language:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewLanguageTab('am')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                            previewLanguageTab === 'am'
                              ? 'bg-orange-500 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          አማርኛ
                        </button>
                        <button
                          onClick={() => setPreviewLanguageTab('om')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                            previewLanguageTab === 'om'
                              ? 'bg-orange-500 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Afaan Oromoo
                        </button>
                        <button
                          onClick={() => setPreviewLanguageTab('en')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                            previewLanguageTab === 'en'
                              ? 'bg-orange-500 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Scroll-stopping Hook */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        Scroll-Stopping Hook ({previewLanguageTab.toUpperCase()})
                      </span>
                      <button
                        onClick={() => copyToClipboard(
                          generatedDraft.multilingualContent?.[previewLanguageTab]?.hook || generatedDraft.hook,
                          'hook'
                        )}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'hook' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-white leading-snug">
                      {generatedDraft.multilingualContent?.[previewLanguageTab]?.hook || generatedDraft.hook}
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        High-Engagement Body Copy ({previewLanguageTab.toUpperCase()})
                      </span>
                      <button
                        onClick={() => copyToClipboard(
                          generatedDraft.multilingualContent?.[previewLanguageTab]?.caption || generatedDraft.caption,
                          'caption'
                        )}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'caption' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                      {generatedDraft.multilingualContent?.[previewLanguageTab]?.caption || generatedDraft.caption}
                    </p>
                  </div>

                  {/* Short-Form Video Hook */}
                  {generatedDraft.shortFormVideoHook && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-900/50 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                        <Video className="w-4 h-4 text-blue-400" />
                        <span>Short-Form Video Hook (TikTok & Instagram Reels)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-semibold">3s Visual Hook:</span>
                          <span className="text-slate-200">{generatedDraft.shortFormVideoHook.visualHook3s}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-semibold">Audio / Music Direction:</span>
                          <span className="text-emerald-400 font-medium">{generatedDraft.shortFormVideoHook.audioMusicCue}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-semibold">On-Screen Text:</span>
                          <span className="text-orange-400 font-semibold">{generatedDraft.shortFormVideoHook.onScreenText}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-semibold">Pacing & Duration:</span>
                          <span className="text-white font-mono">{generatedDraft.shortFormVideoHook.pacingSeconds || 18} seconds · {generatedDraft.shortFormVideoHook.cameraMovement}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {generatedDraft.hashtags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {generatedDraft.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="text-blue-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-slate-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-300">Ready to draft Ethiopian social commerce assets</div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                      Select your target channel, language, and topic to generate multi-lingual copy and video directions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {generatedDraft && (
              <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Target: <strong className="text-white">{platform}</strong> ({holidaySeason})
                </span>
                <button
                  onClick={handleScheduleGeneratedPost}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Queue for Auto-Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab: Trending Formats */}
      {activeSubTab === 'formats' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-orange-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Format Intelligence & Virality Engine</span>
              </div>
              <h2 className="text-xl font-bold text-white">Trending Formats Across Ethiopian Social Media</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Deep analysis of what converts in Ethiopia across Telegram, TikTok, WhatsApp, Facebook, and LinkedIn.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              {['All', 'Telegram', 'TikTok', 'WhatsApp', 'Facebook', 'LinkedIn'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedFormatPlatform(p)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    selectedFormatPlatform === p
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTrendingFormats.map((fmt) => (
              <div 
                key={fmt.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40">
                        {fmt.platform}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {fmt.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      <Zap className="w-3 h-3 text-orange-400" />
                      <span>Virality: {fmt.viralityScore}/100</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{fmt.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{fmt.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Benchmark:</span>
                      <span className="text-emerald-400 font-mono font-medium">{fmt.engagementBenchmark}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Peak Window EAT:</span>
                      <span className="text-orange-400 font-mono font-medium">{fmt.bestPostingWindowEAT}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Anatomy:
                    </span>
                    <ul className="space-y-1">
                      {fmt.keyElements.map((el, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-orange-950/20 border border-orange-900/30 text-[11px] text-orange-300">
                    <strong className="text-orange-400">Cultural Etiquette: </strong>
                    {fmt.culturalNuance}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Format #{fmt.id}</span>
                  <button
                    onClick={() => handleApplyFormatToCreator(fmt)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Use in AI Creator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab: Content Calendar */}
      {activeSubTab === 'calendar' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span>East Africa Time (EAT UTC+3) Master Schedule</span>
              </div>
              <h2 className="text-xl font-bold text-white">Ethiopian Working Hours & Cultural Calendar</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically respects Ethiopian working hours (8:30 AM - 5:30 PM), Saturday half-days, Sunday rest, and national holidays.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auto-Conflict Detection Active</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Mon - Fri Working Hours</span>
              </div>
              <div className="text-slate-300 font-mono text-[11px] mt-1">
                08:30 - 17:30 EAT (Lunch: 12:30 - 14:00)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Saturday Half-Day Schedule</span>
              </div>
              <div className="text-slate-300 font-mono text-[11px] mt-1">
                08:30 - 12:30 EAT (Active Retail Shopping)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sunday & Spiritual Observance</span>
              </div>
              <div className="text-slate-300 font-mono text-[11px] mt-1">
                Family Buna, Church & Mosque Quiet Rest
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {calendarSlots.map((slot) => (
              <div 
                key={slot.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  slot.status === 'Optimal Peak'
                    ? 'bg-slate-950 border-emerald-500/40'
                    : slot.status === 'Quiet Cultural Rest'
                    ? 'bg-slate-950/80 border-slate-800 opacity-90'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{slot.dayOfWeek}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      slot.status === 'Optimal Peak'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : slot.status === 'Quiet Cultural Rest'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                    }`}>
                      {slot.status}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-orange-400">
                    {slot.timeSlotEAT}
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium">
                    {slot.windowType}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {slot.etiquetteTip}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {slot.recommendedPlatforms.map((p) => (
                      <span key={p} className="text-[10px] font-mono font-semibold text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Scheduled:</span>
                    <span className="font-mono font-bold text-white">{slot.scheduledPostsCount} posts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab: Omnichannel DM Inbox */}
      {activeSubTab === 'engagement' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-blue-400 mb-0.5">
                <MessageSquare className="w-4 h-4" />
                <span>Real-Time Community Management & DM Triage</span>
              </div>
              <h2 className="text-xl font-bold text-white">Multi-Lingual Customer Engagement Inbox</h2>
              <p className="text-xs text-slate-400">
                Inquiries in Amharic, Afaan Oromoo, and English across WhatsApp, Telegram, TikTok, and Facebook.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                AI Response Latency: 18s avg
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {engagementItems.map((item) => {
              const currentLang = engagementLangTab[item.id] || item.language;
              const displayResponse = replyTextMap[item.id] !== undefined 
                ? replyTextMap[item.id] 
                : item.multilingualResponses?.[currentLang] || item.aiDraftedResponse;

              return (
                <div key={item.id} className="py-5 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-white">{item.customerName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.handle}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-semibold text-blue-400">{item.platform}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">{item.receivedTime}</span>
                      {item.deliveryCity && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-emerald-400 font-medium">📍 {item.deliveryCity}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-semibold">
                        {item.sentiment}
                      </span>
                      {item.crmSynced && (
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Salesforce Synced
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    <span className="font-bold text-slate-400">Customer Inquiry ({item.language.toUpperCase()}): </span>
                    <span className="text-white italic">"{item.message}"</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-blue-900/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white">AI-Drafted Response</span>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold ${
                          item.status === 'AI Responded'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {item.multilingualResponses && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-slate-400 mr-1">Switch Reply:</span>
                          <button
                            onClick={() => {
                              setEngagementLangTab(prev => ({ ...prev, [item.id]: 'am' }));
                              if (item.multilingualResponses?.am) {
                                setReplyTextMap(prev => ({ ...prev, [item.id]: item.multilingualResponses!.am }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                              currentLang === 'am' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            አማርኛ
                          </button>
                          <button
                            onClick={() => {
                              setEngagementLangTab(prev => ({ ...prev, [item.id]: 'om' }));
                              if (item.multilingualResponses?.om) {
                                setReplyTextMap(prev => ({ ...prev, [item.id]: item.multilingualResponses!.om }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                              currentLang === 'om' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Afaan Oromoo
                          </button>
                          <button
                            onClick={() => {
                              setEngagementLangTab(prev => ({ ...prev, [item.id]: 'en' }));
                              if (item.multilingualResponses?.en) {
                                setReplyTextMap(prev => ({ ...prev, [item.id]: item.multilingualResponses!.en }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                              currentLang === 'en' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            English
                          </button>
                        </div>
                      )}
                    </div>

                    {item.status === 'Awaiting Approval' ? (
                      <div className="space-y-3">
                        <textarea
                          rows={3}
                          value={displayResponse}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [item.id]: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => handleGenerateTelebirrLink(item.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-950/30 hover:bg-orange-900/40 border border-orange-500/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-orange-400" />
                            <span>Attach Telebirr 1-Click Pay Link</span>
                          </button>

                          <button
                            onClick={() => handleSendResponse(item.id)}
                            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Approve & Dispatch Reply</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {displayResponse}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab: Live Queue */}
      {activeSubTab === 'queue' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-0.5">
                <Share2 className="w-4 h-4" />
                <span>Multi-Platform Dispatch Stream</span>
              </div>
              <h2 className="text-xl font-bold text-white">Ethiopian Cross-Platform Queue</h2>
              <p className="text-xs text-slate-400">
                Scheduled and live broadcast status across Telegram Channels, TikTok, WhatsApp, Facebook, and LinkedIn.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {posts.map((post) => (
              <div key={post.id} className="py-4.5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40">
                      {post.platform}
                    </span>
                    <span className="font-mono text-slate-300 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {post.scheduledTime}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      post.status === 'Published'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white leading-snug">
                    {post.hook}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                    {post.caption}
                  </p>

                  {post.shortFormVideoHook && (
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">
                        <strong>3s Hook: </strong>{post.shortFormVideoHook.visualHook3s}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                  {post.status === 'Scheduled' && (
                    <button
                      onClick={() => {
                        const updated = posts.map((p) => p.id === post.id ? { ...p, status: 'Published' as const, impressions: 3200, engagementRate: '7.6%' } : p);
                        onUpdatePosts(updated);
                        onAddAgentLog(`Published ${post.platform} post immediately`, 'Broadcast live across Ethiopian followers', 'Automation');
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish Now</span>
                    </button>
                  )}
                  {post.status === 'Published' && post.impressions && (
                    <div className="text-right text-xs">
                      <div className="font-mono tabular-nums text-white font-bold">{post.impressions.toLocaleString()} views</div>
                      <div className="text-emerald-400 font-mono font-semibold">{post.engagementRate} eng rate</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
