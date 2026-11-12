import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Globe, 
  Code2, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Tag,
  Layers,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { EthiopianSeoPackage } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface EthiopianSeoAgentViewProps {
  lang: SupportedLanguage;
  onAddAgentLog: (action: string, impact: string, category: 'Optimization' | 'Automation') => void;
}

export const EthiopianSeoAgentView: React.FC<EthiopianSeoAgentViewProps> = ({
  lang,
  onAddAgentLog,
}) => {
  const [targetLanguage, setTargetLanguage] = useState<'am' | 'om' | 'en'>(
    lang === 'om' ? 'om' : lang === 'am' ? 'am' : 'am'
  );
  const [holidaySeason, setHolidaySeason] = useState<string>('Meskel & Enkutatash');
  const [topic, setTopic] = useState<string>('ባህላዊ የሀበሻ ቀሚሶችና የይርጋጨፌ ቡና የበዓል ቅናሽ');
  const [productFocus, setProductFocus] = useState<string>('Handwoven Habesha Kemis, Specialty Coffee & Jebena Sets');
  const [targetMarket, setTargetMarket] = useState<string>('Addis Ababa urban shoppers & diaspora sending gifts');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [seoResult, setSeoResult] = useState<EthiopianSeoPackage | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'article' | 'markdown' | 'meta' | 'keywords' | 'schema' | 'distribution'>('article');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Cultural moment presets
  const culturalPresets = [
    {
      title: '✝️ Meskel Festival (መስቀል)',
      topicAm: 'የመስቀል ደመራ በዓል የሀበሻ ቀሚስና የይርጋጨፌ ቡና ልዩ ቅናሽ',
      topicOm: 'Gurgurtaa Addaa Ayyaana Masqalaa: Uffata Aadaa fi Buna Oromiyaa',
      topicEn: 'Meskel Festival Traditional Habesha Kemis & Coffee Celebration Sale',
      holiday: 'Meskel (Finding of True Cross)',
      product: 'Handwoven Habesha Kemis, Jebena Coffee Sets & Pure Black Seed Oil'
    },
    {
      title: '🌼 Enkutatash New Year (እንቁጣጣሽ)',
      topicAm: 'የእንቁጣጣሽ አዲስ ዓመት ልዩ የስጦታ እቃዎችና የቤት ማስጌጫዎች',
      topicOm: 'Ayyaana Waggaa Haaraa Itoophiyaa: Kennaa fi Oomishaalee Addaa',
      topicEn: 'Enkutatash Ethiopian New Year Gift Packages & Traditional Attire',
      holiday: 'Enkutatash (Ethiopian New Year)',
      product: 'Cultural Attire, Teff Superfoods & Traditional Clay Ceramics'
    },
    {
      title: '🎄 Genna Christmas (ገና)',
      topicAm: 'የገና በዓል የቤተሰብ ስጦታዎችና የይርጋጨፌ ጀበና ቡና ዝግጅት',
      topicOm: 'Ayyaana Qillee / Genna: Buna Qulqulluu fi Uffata Aadaa',
      topicEn: 'Genna Ethiopian Christmas Gifting & Ceremonial Coffee Sets',
      holiday: 'Genna (Ethiopian Christmas)',
      product: 'Single-Origin Coffee, Ceramic Sets & Leather Accessories'
    },
    {
      title: '🌙 Eid al-Fitr & Arafa (ዒድ)',
      topicAm: 'የዒድ አል-ፊጥር እና አረፋ በዓል ባህላዊ አልባሳትና የተፈጥሮ ሽቶዎች',
      topicOm: 'Ayyaana Iidaa: Uffata Aadaa fi Urgooftuu Qulqulluu',
      topicEn: 'Eid al-Fitr Cultural Couture, Modest Fashion & Natural Oud Oils',
      holiday: 'Eid al-Fitr / Eid al-Adha',
      product: 'Modest Silk Attire, Black Seed Wellness & Natural Fragrances'
    },
    {
      title: '🌾 Irreechaa Thanksgiving (ኢሬቻ)',
      topicAm: 'የኢሬቻ በዓል ባህላዊ የኦሮሞ አልባሳትና የጋዳ ጌጣጌጦች',
      topicOm: 'Ayyaana Irreechaa Hora Finfinnee fi Malkaa: Uffata Aadaa fi Faaya',
      topicEn: 'Irreechaa Cultural Thanksgiving Attire & Oromo Heritage Wear',
      holiday: 'Irreechaa Festival (Hora Finfinnee)',
      product: 'Oromo Cultural Gadaa Vests, Scarves & Pure Teff Grain'
    },
  ];

  const handleApplyPreset = (p: typeof culturalPresets[0]) => {
    setHolidaySeason(p.holiday);
    setProductFocus(p.product);
    if (targetLanguage === 'am') setTopic(p.topicAm);
    else if (targetLanguage === 'om') setTopic(p.topicOm);
    else setTopic(p.topicEn);
  };

  const handleGenerateSeo = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/ethiopian-seo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetLanguage,
          holidaySeason,
          targetMarket,
          productFocus,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSeoResult(data.data);
        onAddAgentLog(
          `Generated culturally resonant SEO & long-form content package for ${holidaySeason} in ${targetLanguage.toUpperCase()}`,
          `Rank-optimized for Google.com.et, Telegram search, and local payment integration`,
          'Optimization'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Active Configuration Template Badge */}
      <div className="p-3.5 px-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-semibold">Configuration Template:</span>
          <span className="text-white font-mono font-bold bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
            Qwen3.8-Max / GPT-4o Equivalent
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-semibold">Armed Tool Suite:</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/40 font-mono text-[11px] flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400" />
            <span>Web Search (Google.com.et)</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-mono text-[11px] flex items-center gap-1">
            <Search className="w-3 h-3 text-emerald-400" />
            <span>Semantic Keyword Analyzer</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-950/80 text-orange-300 border border-orange-800/40 font-mono text-[11px] flex items-center gap-1">
            <FileText className="w-3 h-3 text-orange-400" />
            <span>Markdown Generator</span>
          </span>
        </div>
      </div>

      {/* Top Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-orange-400 font-semibold">SEO & Content Marketing Agent</span>
            <span aria-hidden="true">·</span>
            <span>Google.com.et & Social Search Specialist</span>
            <span aria-hidden="true">·</span>
            <span>🇪🇹 Ethiopian Cultural Holidays</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ethiopian SEO & Cultural Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Generates high-ranking, culturally rich content in Amharic (አማርኛ), Afaan Oromoo, and English tailored to Ethiopian holidays (Meskel, Enkutatash, Genna, Eid, Irreechaa) and local search intent.
          </p>
        </div>

        <button
          onClick={handleGenerateSeo}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 disabled:opacity-60 rounded-xl shadow-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>{isGenerating ? 'Synthesizing SEO Package...' : 'Generate SEO & Storytelling'}</span>
        </button>
      </div>

      {/* Cultural Moments & Holidays Preset Row */}
      <div className="p-4 bg-black border border-slate-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Select Ethiopian Cultural Moment or Holiday:</span>
          </span>
          <span className="text-[11px] text-slate-500">1-Tap to Load Strategy</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {culturalPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-850 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language & Target Market */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">Target Language & Script</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTargetLanguage('am');
                if (holidaySeason.includes('Meskel')) setTopic('የመስቀል ደመራ በዓል የሀበሻ ቀሚስና የይርጋጨፌ ቡና ልዩ ቅናሽ');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                targetLanguage === 'am'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              አማርኛ (Am)
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetLanguage('om');
                if (holidaySeason.includes('Meskel')) setTopic('Gurgurtaa Addaa Ayyaana Masqalaa: Uffata Aadaa fi Buna Oromiyaa');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                targetLanguage === 'om'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Oromoo (Om)
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetLanguage('en');
                if (holidaySeason.includes('Meskel')) setTopic('Meskel Festival Traditional Habesha Kemis & Coffee Celebration Sale');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                targetLanguage === 'en'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English (En)
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Target Audience</label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Campaign Topic & Holiday */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Holiday / Cultural Season</label>
            <input
              type="text"
              value={holidaySeason}
              onChange={(e) => setHolidaySeason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Article Headline & Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Product Focus & Payment Ecosystem */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Featured Products</label>
            <input
              type="text"
              value={productFocus}
              onChange={(e) => setProductFocus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-white block">🇪🇹 Integrated Commerce Call-outs:</span>
            <div className="flex flex-wrap gap-1 text-[10px] text-orange-400 font-mono">
              <span>Telebirr ቴሌብር</span> · <span>CBE Birr</span> · <span>Chapa</span> · <span>Telegram Shop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated SEO Output View */}
      {seoResult && (
        <div className="p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-2xl space-y-5">
          {/* Output Navigation Subtabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveOutputTab('article')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'article'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Storytelling Article</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('markdown')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'markdown'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Markdown Generator</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('meta')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'meta'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Meta Tags & Search Snippet</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('keywords')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'keywords'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Semantic Keywords</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('schema')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'schema'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Schema.org JSON-LD</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('distribution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeOutputTab === 'distribution'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Distribution Strategy</span>
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(JSON.stringify(seoResult, null, 2), 'all')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'Copied Full JSON' : 'Export JSON'}</span>
            </button>
          </div>

          {/* TAB 1: STORYTELLING ARTICLE */}
          {activeOutputTab === 'article' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Culturally Resonant Long-Form Article ({targetLanguage.toUpperCase()})
                </span>
                <button
                  onClick={() => copyToClipboard(
                    `${seoResult.articleContent.h1}\n\n${seoResult.articleContent.intro}\n\n` +
                    seoResult.articleContent.sections.map(s => `${s.h2}\n${s.body}\n${s.bulletPoints?.join('\n') || ''}`).join('\n\n') +
                    `\n\n${seoResult.articleContent.localCallToAction}`,
                    'article'
                  )}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'article' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Article Markdown</span>
                </button>
              </div>

              {/* H1 Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {seoResult.articleContent.h1}
              </h1>

              {/* Intro Narrative */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {seoResult.articleContent.intro}
              </p>

              {/* Article Sections (H2 + Body + Bullet Points) */}
              <div className="space-y-4 pt-2">
                {seoResult.articleContent.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-orange-400 flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-orange-500" />
                      <span>{section.h2}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-3.5 border-l border-slate-800">
                      {section.body}
                    </p>
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <ul className="space-y-1.5 pl-6 pt-1 list-disc text-xs sm:text-sm text-slate-400">
                        {section.bulletPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            <span className="text-slate-200">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Local Ethiopian Call To Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-slate-900 border border-orange-500/30 text-white space-y-2 mt-4">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Call to Action (Conversion Closing)</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {seoResult.articleContent.localCallToAction}
                </p>
              </div>
            </div>
          )}

          {/* TAB: RAW MARKDOWN GENERATOR */}
          {activeOutputTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Generated Markdown Document</h3>
                  <p className="text-[11px] text-slate-400">Ready for headless CMS, Hugo, Astro, or static site generation</p>
                </div>
                <button
                  onClick={() => {
                    const fullMd = 
                      `---\n` +
                      `title: "${seoResult.metaTags.title}"\n` +
                      `description: "${seoResult.metaTags.description}"\n` +
                      `keywords: "${seoResult.metaTags.keywords}"\n` +
                      `canonical: "${seoResult.metaTags.canonicalUrl}"\n` +
                      `language: "${targetLanguage}"\n` +
                      `holiday: "${holidaySeason}"\n` +
                      `---\n\n` +
                      `# ${seoResult.articleContent.h1}\n\n` +
                      `${seoResult.articleContent.intro}\n\n` +
                      seoResult.articleContent.sections.map(s => 
                        `## ${s.h2}\n\n${s.body}\n` + 
                        (s.bulletPoints && s.bulletPoints.length > 0 ? `\n` + s.bulletPoints.map(p => `- ${p}`).join('\n') + `\n` : '')
                      ).join('\n\n') +
                      `\n\n### Call to Action\n${seoResult.articleContent.localCallToAction}`;
                    copyToClipboard(fullMd, 'raw-md');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:text-white rounded-lg cursor-pointer"
                >
                  {copiedKey === 'raw-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'raw-md' ? 'Copied Markdown' : 'Copy Raw Markdown'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-[500px]">
{`---
title: "${seoResult.metaTags.title}"
description: "${seoResult.metaTags.description}"
keywords: "${seoResult.metaTags.keywords}"
canonical: "${seoResult.metaTags.canonicalUrl}"
language: "${targetLanguage}"
holiday: "${holidaySeason}"
---

# ${seoResult.articleContent.h1}

${seoResult.articleContent.intro}

` + seoResult.articleContent.sections.map(s => 
  `## ${s.h2}\n\n${s.body}\n` + 
  (s.bulletPoints && s.bulletPoints.length > 0 ? `\n` + s.bulletPoints.map(p => `- ${p}`).join('\n') + `\n` : '')
).join('\n\n') + `

### Call to Action
${seoResult.articleContent.localCallToAction}`}
              </pre>
            </div>
          )}

          {/* TAB 2: META TAGS & GOOGLE.COM.ET SEARCH SNIPPET */}
          {activeOutputTab === 'meta' && (
            <div className="space-y-5">
              {/* Google Search Simulation Snippet */}
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">
                  Google.com.et Mobile Search Snippet Preview:
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-xl space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">🌐</span>
                    <span className="truncate">wisesell.ai › et › {holidaySeason.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                    {seoResult.metaTags.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {seoResult.metaTags.description}
                  </p>
                </div>
              </div>

              {/* Meta Tags Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">HTML Meta Tags</span>
                  <button
                    onClick={() => copyToClipboard(
                      `<title>${seoResult.metaTags.title}</title>\n` +
                      `<meta name="description" content="${seoResult.metaTags.description}" />\n` +
                      `<meta name="keywords" content="${seoResult.metaTags.keywords}" />\n` +
                      `<link rel="canonical" href="${seoResult.metaTags.canonicalUrl}" />\n` +
                      `<meta property="og:title" content="${seoResult.metaTags.ogTitle}" />\n` +
                      `<meta property="og:description" content="${seoResult.metaTags.ogDescription}" />\n` +
                      `<meta name="twitter:card" content="summary_large_image" />`,
                      'meta'
                    )}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Meta Tags</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
                  <div>&lt;title&gt;<span className="text-orange-400">{seoResult.metaTags.title}</span>&lt;/title&gt;</div>
                  <div>&lt;meta name="description" content="<span className="text-blue-300">{seoResult.metaTags.description}</span>" /&gt;</div>
                  <div>&lt;meta name="keywords" content="<span className="text-emerald-300">{seoResult.metaTags.keywords}</span>" /&gt;</div>
                  <div>&lt;link rel="canonical" href="<span className="text-cyan-300">{seoResult.metaTags.canonicalUrl}</span>" /&gt;</div>
                  <div>&lt;meta property="og:title" content="<span className="text-purple-300">{seoResult.metaTags.ogTitle}</span>" /&gt;</div>
                  <div>&lt;meta property="og:description" content="<span className="text-purple-300">{seoResult.metaTags.ogDescription}</span>" /&gt;</div>
                  <div>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEMANTIC KEYWORDS */}
          {activeOutputTab === 'keywords' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Primary Target Keyword</span>
                  <div className="text-sm font-bold text-orange-400 font-mono">
                    {seoResult.keywords.primary}
                  </div>
                  <div className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Intent: {seoResult.keywords.intent}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Local Search Slang & Vernacular</span>
                  <div className="flex flex-wrap gap-1.5">
                    {seoResult.keywords.localSearchSlang.map((slang, idx) => (
                      <span key={idx} className="text-xs font-semibold text-white bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
                        {slang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Secondary High-Volume Clusters</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {seoResult.keywords.secondary.map((sec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>{sec}</span>
                      <Search className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEMA.ORG JSON-LD */}
          {activeOutputTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Schema.org JSON-LD Structured Data</h3>
                  <p className="text-[11px] text-slate-400">Embed within &lt;script type="application/ld+json"&gt; in index.html</p>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(seoResult.metaTags.jsonLd, null, 2), 'schema')}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Schema JSON-LD</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(seoResult.metaTags.jsonLd, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 5: DISTRIBUTION STRATEGY */}
          {activeOutputTab === 'distribution' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white">Multi-Channel Ethiopian Distribution Strategy</h3>
              <p className="text-xs text-slate-400">
                Actionable tactics to syndicate this content across Ethiopian news aggregators, Telegram channels, and #HabeshaTikTok
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {seoResult.distributionChannelTips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-orange-400">{tip.platform}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{tip.tactic}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
