import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Download, 
  Radio, 
  Film, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Share2, 
  ArrowRight,
  Smartphone,
  Music,
  Headphones,
  Sliders,
  Send
} from 'lucide-react';
import { VideoAudioCampaign } from '../types';
import { SupportedLanguage, CurrencyMode, translations } from '../i18n/translations';

interface VideoAudioMarketingAgentProps {
  lang: SupportedLanguage;
  currency: CurrencyMode;
  onAddAgentLog: (action: string, impact: string, category: 'Automation' | 'Optimization') => void;
}

export const VideoAudioMarketingAgent: React.FC<VideoAudioMarketingAgentProps> = ({
  lang,
  currency,
  onAddAgentLog,
}) => {
  const t = translations[lang];

  // Campaign generator state
  const [productName, setProductName] = useState<string>('Autonomous MagSafe 3-in-1 Charging Hub');
  const [campaignGoal, setCampaignGoal] = useState<string>('Drive instant checkouts with Telebirr & CBE Birr using code FLASH15');
  const [adFormat, setAdFormat] = useState<'Vertical 9:16 (TikTok, Reels)' | 'Horizontal 16:9 (YouTube)' | 'Radio / Audio Commercial' | 'Square 1:1 (Feed)'>('Vertical 9:16 (TikTok, Reels)');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(lang);
  const [voiceTone, setVoiceTone] = useState<string>('High-Energy & Viral Creator');
  const [duration, setDuration] = useState<string>('30s');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<VideoAudioCampaign | null>(null);

  // Audio Playback & Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlayingStoryboard, setIsPlayingStoryboard] = useState<boolean>(false);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<any>(null);

  // Default initial campaign for instant productivity
  useEffect(() => {
    if (!campaign) {
      setCampaign({
        id: 'camp-default',
        videoTitle: 'MagSafe 3-in-1 Hub - Viral Telebirr Social Commerce Video',
        estimatedDuration: '30s',
        format: 'Vertical 9:16 (TikTok, Reels)',
        language: lang,
        storyboard: [
          {
            sceneNumber: 1,
            timeCode: '0:00 - 0:03',
            visualDirection: 'Dynamic close-up fast zoom: Hand throwing 3 tangled phone charger cords into a trash bin with frustration.',
            audioVoiceover: lang === 'am'
              ? 'የተዘበራረቁ ገመዶች በቤትዎ ወይም በቢሮዎ ውስጥ ሰልችተዋል?'
              : 'Tired of messy charging cables cluttering your workspace and nightstand?',
            onScreenText: lang === 'am' ? 'ገመዶችን ይሰናበቱ! ⚡' : 'STOP THE CABLE MESS ⚡',
            bRollCue: 'Natural desk lighting, 60fps slow motion drop'
          },
          {
            sceneNumber: 2,
            timeCode: '0:03 - 0:12',
            visualDirection: 'Sleek product reveal: Single snap onto the matte black magnetic hub. Phone, watch, and earbuds all charging simultaneously with amber LED glow.',
            audioVoiceover: lang === 'am'
              ? 'ይህ በኢትዮጵያ የመጀመሪያው ይፋዊ Qi2 ባለ 3-በ-1 ፈጣን ቻርጀር ነው። ስልክዎን፣ ሰዓትዎንና ጆሮ ማዳመጫዎን በአንድ ላይ በአጭር ጊዜ ውስጥ ይሞላል!'
              : 'Meet the official Qi2 3-in-1 Fast Charging Hub. Powers your phone, smartwatch, and earbuds all on one single aerospace-aluminum stand!',
            onScreenText: lang === 'am' ? '15W ይፋዊ የፈጣን ቻርጅ 🚀' : 'OFFICIAL 15W Qi2 FAST CHARGE',
            bRollCue: 'Macro shot of magnetic snap connection with haptic sound effect'
          },
          {
            sceneNumber: 3,
            timeCode: '0:12 - 0:22',
            visualDirection: 'Split screen: Left shows Telebirr / CBE Birr instant checkout payment; Right shows unboxing with premium packaging and accessories.',
            audioVoiceover: lang === 'am'
              ? 'በቴሌብር ወይም በንግድ ባንክ (CBE Birr) በቀላሉ ይዘዙ! በ24 ሰዓት ውስጥ በነፃ ትራንስፖርት እስከ ደጃፍዎ ይደርሳል።'
              : 'Order instantly with Telebirr or CBE Birr! Free 24-hour door-to-door express delivery nationwide.',
            onScreenText: lang === 'am' ? 'በቴሌብር ይክፈሉ · ነፃ ትራንስፖርት 📦' : 'PAY WITH TELEBIRR · FREE DELIVERY',
            bRollCue: 'Screen recording of Telebirr QR scan confirmation'
          },
          {
            sceneNumber: 4,
            timeCode: '0:22 - 0:30',
            visualDirection: 'Bold final graphic lockup: WiseSell AI product showcase with promo code FLASH15 and direct purchase link.',
            audioVoiceover: lang === 'am'
              ? 'አሁኑኑ ከታች ባለው ሊንክ ይዘዙና የ15% ቅናሽ ያግኙ! ዕቃው ከማለቁ በፊት ዛሬውኑ ይዘዙ።'
              : 'Tap the link below now and use code FLASH15 for 15% off today only before stock sells out!',
            onScreenText: lang === 'am' ? 'ኮድ: FLASH15 · አሁኑኑ ይዘዙ 🛒' : 'CODE: FLASH15 · ORDER NOW',
            bRollCue: 'Floating glowing CTA button with Telebirr & Visa badges'
          }
        ],
        fullAudioScript: lang === 'am'
          ? 'የተዘበራረቁ ገመዶች በቤትዎ ወይም በቢሮዎ ውስጥ ሰልችተዋል? ይህ በኢትዮጵያ የመጀመሪያው ይፋዊ Qi2 ባለ 3-በ-1 ፈጣን ቻርጀር ነው። ስልክዎን፣ ሰዓትዎንና ጆሮ ማዳመጫዎን በአንድ ላይ በአጭር ጊዜ ውስጥ ይሞላል! በቴሌብር ወይም በንግድ ባንክ በቀላሉ ይዘዙ! በ24 ሰዓት ውስጥ በነፃ ትራንስፖርት እስከ ደጃፍዎ ይደርሳል። አሁኑኑ ከታች ባለው ሊንክ ይዘዙና የ15% ቅናሽ ያግኙ!'
          : 'Tired of messy charging cables cluttering your workspace and nightstand? Meet the official Qi2 3-in-1 Fast Charging Hub. Powers your phone, smartwatch, and earbuds all on one single aerospace-aluminum stand! Order instantly with Telebirr or CBE Birr with free 24-hour delivery. Tap the link below and use code FLASH15 for 15% off today only!',
        audioProductionGuide: {
          voicePersona: 'Energetic, confident, authentic commercial announcer',
          recommendedBpm: 124,
          backgroundMusicGenre: 'Modern Afrobeat Lo-Fi Synth or Upbeat Electronic Boom-Bap',
          soundEffects: ['Fast whoosh on hook', 'Magnetic snap click on 0:04', 'Telebirr payment chime on 0:14', 'Sub bass drop on CTA'],
          pacing: 'Dynamic and fast-paced, 140-150 words per minute'
        }
      });
    }
  }, [lang]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Run AI Video & Audio Generation via Gemini
  const handleGenerateCampaign = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/video-audio-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          campaignGoal,
          format: adFormat,
          language: selectedLang,
          targetAudience: 'Mobile social commerce shoppers and tech consumers in Ethiopia & worldwide',
          voiceTone,
          durationSeconds: duration,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCampaign({
          id: `camp-${Date.now()}`,
          ...data.data,
        });
        setActiveSceneIndex(0);
        onAddAgentLog(
          `Video & Audio Agent generated ${duration} commercial in ${selectedLang.toUpperCase()}`,
          `Storyboard and audio voiceover synthesized for ${adFormat}`,
          'Automation'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real Audio Voiceover Playback using Web Speech Synthesis
  const handleToggleAudioPlayback = () => {
    if (!campaign?.fullAudioScript) return;

    if (isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsPlayingAudio(false);
      setAudioProgress(0);
      return;
    }

    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(campaign.fullAudioScript);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLangPrefix = selectedLang === 'am' ? 'am' : selectedLang === 'om' ? 'om' : 'en';
      const matched = voices.find((v) => v.lang.startsWith(targetLangPrefix)) || voices[0];
      if (matched) utterance.voice = matched;
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setAudioProgress(0);

      // Progress bar ticker
      const estDurationMs = 26000 / playbackSpeed;
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / estDurationMs) * 100));
        setAudioProgress(pct);
        if (pct >= 100) {
          clearInterval(progressIntervalRef.current);
        }
      }, 200);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Play full Storyboard scenes in sequence
  const handlePlayStoryboard = () => {
    if (!campaign?.storyboard) return;
    setIsPlayingStoryboard(true);
    setActiveSceneIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= campaign.storyboard.length) {
        clearInterval(interval);
        setIsPlayingStoryboard(false);
        setActiveSceneIndex(0);
      } else {
        setActiveSceneIndex(current);
      }
    }, 4500);
  };

  // Export / Download Audio Script
  const handleExportScript = () => {
    if (!campaign) return;
    const content = `=====================================================
WiseSell AI - Video & Audio Marketing Commercial Spec
=====================================================
Title: ${campaign.videoTitle}
Format: ${campaign.format}
Duration: ${campaign.estimatedDuration}
Language: ${campaign.language.toUpperCase()}
Generated: ${new Date().toISOString()}

AUDIO VOICEOVER SCRIPT:
${campaign.fullAudioScript}

PRODUCTION & SOUND DESIGN GUIDE:
- Persona: ${campaign.audioProductionGuide.voicePersona}
- Music Genre: ${campaign.audioProductionGuide.backgroundMusicGenre}
- Recommended BPM: ${campaign.audioProductionGuide.recommendedBpm} BPM
- Sound FX Cues: ${campaign.audioProductionGuide.soundEffects.join(', ')}
- Pacing: ${campaign.audioProductionGuide.pacing}

SCENE-BY-SCENE STORYBOARD:
${campaign.storyboard.map((s) => `
Scene ${s.sceneNumber} (${s.timeCode})
Visual Direction: ${s.visualDirection}
Voiceover: "${s.audioVoiceover}"
On-Screen Graphic: "${s.onScreenText}"
B-Roll Cue: ${s.bRollCue}
-----------------------------------------------------`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WiseSell_${campaign.language}_commercial_spec.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onAddAgentLog('Exported video & audio commercial script spec', 'Saved local broadcast bundle', 'Automation');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span className="text-orange-500 font-semibold flex items-center gap-1">
              <Film className="w-3.5 h-3.5" /> Video & Audio Marketing Agent
            </span>
            <span aria-hidden="true">·</span>
            <span>Multilingual Voiceover & Storyboard</span>
            <span aria-hidden="true">·</span>
            <span>Telebirr & Global Ready</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous Video & Audio Ad Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Generates high-converting video ad storyboards, broadcast voiceover scripts in Ethiopian languages (Amharic, Afaan Oromoo, Tigrinya, Somali, English), and sound design directions with real audio playback.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerateCampaign}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 disabled:opacity-60 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Studio Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Video & Audio Ad</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Campaign Configuration Grid */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Campaign & Creative Audio Setup</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Product / Service</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Ad Format & Aspect Ratio</label>
            <select
              value={adFormat}
              onChange={(e) => setAdFormat(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Vertical 9:16 (TikTok, Reels)">Vertical 9:16 (TikTok, Reels, Shorts)</option>
              <option value="Horizontal 16:9 (YouTube)">Horizontal 16:9 (YouTube, Web)</option>
              <option value="Radio / Audio Commercial">Radio / Podcast Audio Ad</option>
              <option value="Square 1:1 (Feed)">Square 1:1 (Meta / Telegram)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Language (የማስታወቂያ ቋንቋ)</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="am">🇪🇹 አማርኛ (Amharic)</option>
              <option value="om">🇪🇹 Afaan Oromoo</option>
              <option value="ti">🇪🇹 ትግርኛ (Tigrinya)</option>
              <option value="so">🇪🇹 Af-Soomaali (Somali)</option>
              <option value="en">🌐 English (Global)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Voice Tone & Announcer</label>
            <select
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="High-Energy & Viral Creator">High-Energy & Viral Creator (TikTok)</option>
              <option value="Warm & Friendly Local Storyteller">Warm & Friendly Ethiopian Storyteller</option>
              <option value="Professional & Authoritative Broadcast">Professional Commercial Broadcast</option>
              <option value="Urgent Flash Sale & Telebirr CTA">Urgent Flash Sale & Telebirr Promo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Conversion Goal & Offer</label>
          <input
            type="text"
            value={campaignGoal}
            onChange={(e) => setCampaignGoal(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Main Campaign Output: Audio Studio & Video Storyboard */}
      {campaign && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Real Audio Player & Voiceover Studio */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 space-y-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Voiceover Studio</h3>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {selectedLang.toUpperCase()} Voice · 140 WPM Pace
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleExportScript}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Export script & audio production spec"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export</span>
                </button>
              </div>

              {/* Working Audio Waveform Visualizer & Player Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Voice Synthesizer:</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isPlayingAudio 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                      : 'bg-slate-900 text-slate-400'
                  }`}>
                    {isPlayingAudio ? 'Live Audio Speaking' : 'Ready'}
                  </span>
                </div>

                {/* Simulated Audio Waveform Bars */}
                <div className="h-12 bg-slate-900/60 rounded-lg p-2 flex items-center justify-center gap-1 overflow-hidden">
                  {[18, 42, 68, 90, 48, 80, 95, 60, 32, 70, 85, 100, 72, 45, 90, 60, 30, 78, 92, 54, 88, 62, 38, 70, 96, 44, 28].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isPlayingAudio 
                          ? 'bg-gradient-to-t from-blue-600 to-orange-500 animate-pulse' 
                          : 'bg-slate-700'
                      }`}
                      style={{ height: isPlayingAudio ? `${Math.max(15, (h * (0.4 + (i % 3) * 0.3)))}%` : '20%' }}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-blue-600 transition-all duration-200"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{isPlayingAudio ? `${audioProgress}%` : '0:00'}</span>
                    <span>{campaign.estimatedDuration}</span>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleAudioPlayback}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="text-xs">
                      <div className="font-bold text-white text-xs">
                        {isPlayingAudio ? 'Stop Speech' : 'Play Voiceover Ad'}
                      </div>
                      <div className="text-[10px] text-slate-400">Web Speech API Voice</div>
                    </div>
                  </div>

                  {/* Playback speed selector */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {[0.8, 1.0, 1.25].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          playbackSpeed === speed 
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complete Monologue Voiceover Script */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                  Full Voiceover Monologue ({selectedLang.toUpperCase()}):
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans select-text">
                  "{campaign.fullAudioScript}"
                </p>
              </div>

              {/* Music & Sound Design Cues */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                  <Music className="w-3.5 h-3.5" />
                  <span>Audio Production Blueprint:</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">Backing Track:</span> {campaign.audioProductionGuide.backgroundMusicGenre} ({campaign.audioProductionGuide.recommendedBpm} BPM)
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">Sound FX:</span> {campaign.audioProductionGuide.soundEffects.join(' · ')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Video Storyboard & Scene Director */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-black border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{campaign.videoTitle}</h3>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {campaign.format} · {campaign.estimatedDuration} · {campaign.storyboard.length} Scenes
                </div>
              </div>

              <button
                onClick={handlePlayStoryboard}
                disabled={isPlayingStoryboard}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-orange-400 fill-current" />
                <span>{isPlayingStoryboard ? 'Previewing Scenes...' : 'Preview Storyboard'}</span>
              </button>
            </div>

            {/* Active Scene Spotlight Visual Player */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-400 font-mono">
                  Scene {campaign.storyboard[activeSceneIndex]?.sceneNumber} of {campaign.storyboard.length}
                </span>
                <span className="text-slate-400 font-mono">
                  {campaign.storyboard[activeSceneIndex]?.timeCode}
                </span>
              </div>

              {/* Graphic Text Simulation Screen */}
              <div className="h-32 sm:h-36 rounded-lg bg-black border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative shadow-inner">
                {/* On-screen animated badge */}
                <div className="text-sm sm:text-base font-extrabold text-white tracking-wide drop-shadow-md">
                  {campaign.storyboard[activeSceneIndex]?.onScreenText}
                </div>
                <div className="text-xs text-slate-400 italic mt-2 line-clamp-2 max-w-md">
                  "{campaign.storyboard[activeSceneIndex]?.audioVoiceover}"
                </div>

                {/* Telebirr / CBE Birr Tag watermark */}
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-800/40">
                  Telebirr ቴሌብር Sync
                </div>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-blue-400 font-semibold">Visual Direction: </span>
                {campaign.storyboard[activeSceneIndex]?.visualDirection}
              </div>

              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500 font-medium">B-Roll Cut: </span>
                {campaign.storyboard[activeSceneIndex]?.bRollCue}
              </div>
            </div>

            {/* Scene Selector Strip */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Select Scene to Inspect:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {campaign.storyboard.map((scene, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeSceneIndex === idx
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="font-bold text-orange-400">Scene {scene.sceneNumber}</span>
                      <span>{scene.timeCode.split(' - ')[0]}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-200 truncate">
                      {scene.onScreenText}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
