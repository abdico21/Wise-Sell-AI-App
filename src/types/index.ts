export type NavTab = 
  | 'overview' 
  | 'engine'
  | 'videoaudio'
  | 'marketing' 
  | 'social' 
  | 'crm' 
  | 'inventory' 
  | 'business'
  | 'database'
  | 'seo';

export interface EthiopianSeoPackage {
  id: string;
  topic: string;
  language: 'am' | 'om' | 'en';
  holidaySeason: string;
  targetMarket: string;
  metaTags: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    canonicalUrl: string;
    jsonLd: Record<string, any>;
  };
  keywords: {
    primary: string;
    intent: string;
    secondary: string[];
    localSearchSlang: string[];
  };
  articleContent: {
    h1: string;
    intro: string;
    sections: {
      h2: string;
      body: string;
      bulletPoints?: string[];
    }[];
    localCallToAction: string;
  };
  distributionChannelTips: {
    platform: string;
    tactic: string;
  }[];
}

export interface VideoAudioCampaign {
  id: string;
  videoTitle: string;
  estimatedDuration: string;
  format: string;
  language: string;
  storyboard: {
    sceneNumber: number;
    timeCode: string;
    visualDirection: string;
    audioVoiceover: string;
    onScreenText: string;
    bRollCue: string;
  }[];
  fullAudioScript: string;
  audioProductionGuide: {
    voicePersona: string;
    recommendedBpm: number;
    backgroundMusicGenre: string;
    soundEffects: string[];
    pacing: string;
  };
}

export interface CrossPlatformChannelTelemetry {
  id: string;
  channel: 'Meta Ads' | 'TikTok Ads' | 'Google Search & Shopping' | 'Amazon Sponsored Ads';
  status: 'Active' | 'Optimizing' | 'Throttled';
  monthlySpend: number;
  roas: number;
  cpa: number;
  targetCpa: number;
  cvr: number;
  ctr: number;
  frequency: number;
  activeStrategy: string;
  adSetsCount: number;
  topPerformingAudience: string;
  creativeFatigueScore: 'Nominal' | 'Moderate' | 'Fatigued';
  shopifyAttributedRevenue: number;
  lastOptimizedTime: string;
}

export interface EngineOptimizationProposal {
  biddingStrategyAdjustments: {
    channel: string;
    currentStrategy: string;
    recommendedStrategy: string;
    bidMultiplierChange: string;
    rationale: string;
  }[];
  audienceTargetingRefinements: {
    channel: string;
    action: string;
    audienceSegment: string;
    expectedImpact: string;
  }[];
  creativeAutoRefresh: {
    channel: string;
    fatiguedAdName: string;
    currentFrequency: number;
    recommendedAction: string;
    newReplacementHook: string;
    newHeadline: string;
  }[];
  budgetAllocationMatrix: {
    channel: string;
    currentBudget: number;
    recommendedBudget: number;
    delta: number;
    percentageShift: string;
    predictedRoasLift: string;
  }[];
  projectedOverallImpact: {
    expectedBlendedRoas: string;
    expectedCpaDrop: string;
    monthlyIncrementalRevenue: string;
  };
}

export type EthiopianAdLanguage = 'English' | 'Amharic (አማርኛ)' | 'Afaan Oromoo' | 'Tigrinya (ትግርኛ)' | 'Somalian (Af-Soomaali)';

export type EthiopianRegionalHub = 
  | 'Addis Ababa (Bole, Kazanchis, Piassa, CMC)'
  | 'Adama (Oromia Central Trade Hub)'
  | 'Hawassa (Southern Lakeside Hub & Industrial Park)'
  | 'Bahir Dar (Amhara Commercial Hub)'
  | 'Mekelle (Tigray Northern Hub)'
  | 'Dire Dawa (Eastern Free Trade Zone & Harar Corridor)'
  | 'Nationwide Ethiopian Metro Scale';

export interface CampaignVariant {
  id: string;
  name: string;
  language: EthiopianAdLanguage;
  targetHub: EthiopianRegionalHub;
  headline: string;
  hook?: string;
  cta: string;
  trafficSplit: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cvr: number;
  spend: number;
  spendEtb?: number;
  cpa: number;
  cpaEtb?: number;
  roas: number;
  paymentGatewayTarget?: 'Telebirr SuperApp Merchant' | 'CBE Birr Instant' | 'Bank Card Forex Direct';
  creativeType?: 'Reels / TikTok Short (9:16)' | 'Carousel Feed (1:1)' | 'Story Ad with Swipe-Up' | 'Feed Video';
}

export interface EthiopianAdBudgetConstraint {
  dailyBurnLimitEtb: number;
  dailyForexCapUsd: number;
  currentForexSpentUsd: number;
  forexCardLimitThresholdUsd: number;
  localGatewayPreference: 'Telebirr ቴሌብር' | 'CBE Birr' | 'International Card (USD)';
  pacingStatus: 'Optimal Pacing' | 'Forex Cap Throttled' | 'CPA Scaled' | 'Pacing Alert';
  cpaThresholdEtb: number;
  cpaThresholdUsd: number;
  pacingRecommendation: string;
}

export interface CampaignABTest {
  id: string;
  name: string;
  channel: 'Meta Ads' | 'TikTok Ads' | 'Google Search' | 'Pinterest Ads';
  status: 'Running' | 'Completed' | 'Analyzing';
  confidence: number;
  winnerVariantId?: string;
  targetRegion?: EthiopianRegionalHub;
  budgetConstraints?: EthiopianAdBudgetConstraint;
  variants: CampaignVariant[];
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  monthlyGmv: string;
  channels: string[];
  score: number;
  tier: 'Tier 1 Enterprise' | 'Tier 2 Growth' | 'Tier 3 Starter';
  intent: string;
  salesforceStatus: 'Synced' | 'Pending Sync' | 'In Review' | 'Converted';
  salesforceLeadId?: string;
  assignedRep: string;
  lastInteraction: string;
  inquirySnippet: string;
  bant: {
    budget: string;
    authority: string;
    need: string;
    timeline: string;
  };
}

export type IndustryType = 
  | 'Coffee & Agriculture' 
  | 'Fashion & Traditional Apparel' 
  | 'Consumer Electronics' 
  | 'Natural Cosmetics & Wellness' 
  | 'Handcrafted Home & Artisan';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'Enterprise Admin' | 'Growth Marketer' | 'Store Manager' | 'Inventory Lead';
  companyName: string;
  primaryIndustry: IndustryType | 'Multi-Industry Enterprise';
  location: string;
  is2faVerified: boolean;
  avatarUrl?: string;
  lastLoginTime: string;
}

export interface SparklinePoint {
  day: string;
  value: number;
  formatted: string;
}

export interface VoiceCommandLog {
  id: string;
  transcript: string;
  confidence: number;
  timestamp: string;
  status: 'executed' | 'unrecognized';
  actionName: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  industry: IndustryType;
  productType: string;
  price: number;
  marginPercent?: number;
  totalStock: number;
  reorderPoint: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Critical Reorder' | 'Surplus';
  channels: {
    name: 'Shopify' | 'Amazon' | 'TikTok Shop' | 'eBay' | 'WooCommerce' | 'Telebirr Store' | 'Telegram Commerce';
    allocatedStock: number;
    synced: boolean;
    lastSyncTime: string;
  }[];
  monthlyVelocity: number;
  supplierLeadDays: number;
}

export type EthiopianSocialPlatform = 'Telegram' | 'TikTok' | 'WhatsApp' | 'Facebook' | 'LinkedIn' | 'Instagram' | 'X';

export interface MultilingualPostContent {
  hook: string;
  caption: string;
  cta: string;
}

export interface EthiopianShortFormVideoHook {
  visualHook3s: string;
  audioMusicCue: string;
  onScreenText: string;
  cameraMovement: string;
  pacingSeconds: number;
}

export interface SocialPost {
  id: string;
  platform: EthiopianSocialPlatform;
  hook: string;
  caption: string;
  primaryLanguage: 'am' | 'om' | 'en';
  multilingualContent?: {
    am: MultilingualPostContent;
    om: MultilingualPostContent;
    en: MultilingualPostContent;
  };
  shortFormVideoHook?: EthiopianShortFormVideoHook;
  scheduledTime: string;
  scheduledEatTime?: string;
  status: 'Scheduled' | 'Published' | 'Draft' | 'Generating';
  engagementRate?: string;
  impressions?: number;
  clicks?: number;
  tags: string[];
  holidaySeason?: string;
  channelSpecificPayload?: {
    telegramButtons?: { label: string; url: string }[];
    whatsappCatalogId?: string;
    tikTokSoundTitle?: string;
    facebookCarouselCount?: number;
    linkedInB2bTag?: string;
  };
}

export interface CustomerEngagementItem {
  id: string;
  platform: EthiopianSocialPlatform | 'Shopify Chat';
  customerName: string;
  handle: string;
  message: string;
  language: 'am' | 'om' | 'en';
  receivedTime: string;
  sentiment: 'High Purchase Intent' | 'Product Inquiry' | 'Support Request' | 'Neutral';
  status: 'AI Responded' | 'Awaiting Approval' | 'Escalated to Rep';
  aiDraftedResponse: string;
  multilingualResponses?: {
    am: string;
    om: string;
    en: string;
  };
  crmSynced: boolean;
  paymentMethodIntent?: 'Telebirr ቴሌብር' | 'CBE Birr' | 'Cash on Delivery' | 'Bank Transfer';
  deliveryCity?: string;
}

export interface EthiopianTrendingFormat {
  id: string;
  platform: EthiopianSocialPlatform;
  title: string;
  category: 'Visual & Video' | 'Textual & Copywriting' | 'Community & DM Conversion';
  viralityScore: number;
  engagementBenchmark: string;
  description: string;
  keyElements: string[];
  exampleTemplate: {
    am: string;
    om: string;
    en: string;
  };
  bestPostingWindowEAT: string;
  culturalNuance: string;
}

export interface EthiopianCalendarSlot {
  id: string;
  dayOfWeek: string;
  dateStr: string;
  timeSlotEAT: string;
  windowType: 'Morning Commute & Buna' | 'Midday Work Break' | 'Evening Peak Leisure' | 'Weekend Family & Spiritual';
  recommendedPlatforms: EthiopianSocialPlatform[];
  scheduledPostsCount: number;
  holidayContext?: string;
  status: 'Optimal Peak' | 'Standard Working' | 'Quiet Cultural Rest' | 'Holiday Rush';
  etiquetteTip: string;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agent: 'Marketing Agent' | 'Social Media Agent' | 'Salesforce Agent' | 'Inventory Agent' | 'Business Advisor';
  action: string;
  impact: string;
  category: 'Optimization' | 'Automation' | 'Sync' | 'Lead Routing' | 'Financial';
}

export interface FinancialMetric {
  label: string;
  currentValue: string;
  previousValue: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  benchmark: string;
}
