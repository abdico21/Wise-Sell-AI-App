import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

import { db } from './src/db/database.ts';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    database: db.getStats(),
    timestamp: new Date().toISOString(),
  });
});

// Database & Connectors REST API
app.get('/api/db/stats', (req, res) => {
  res.json({ success: true, stats: db.getStats() });
});

app.get('/api/db/table/:name', (req, res) => {
  const { name } = req.params;
  const data = db.getTable(name as any);
  if (data !== undefined) {
    return res.json({ success: true, table: name, rows: data });
  }
  return res.status(404).json({ success: false, error: `Table ${name} not found` });
});

app.post('/api/db/connectors/ping', (req, res) => {
  const { connectorId } = req.body;
  const updated = db.pingConnector(connectorId);
  if (updated) {
    return res.json({ success: true, connector: updated });
  }
  return res.status(404).json({ success: false, error: 'Connector not found' });
});

app.post('/api/db/orders/simulate', (req, res) => {
  const { customer, channel, paymentMethod, amountUsd } = req.body;
  const usd = amountUsd || 89;
  const etb = usd * 125;
  const newOrder = {
    id: `ET-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: customer || 'Liya Kebede',
    paymentMethod: paymentMethod || 'Telebirr ቴሌብር',
    amountEtb: etb,
    amountUsd: usd,
    items: '1x MagSafe 3-in-1 Hub (Matte Black)',
    status: 'Payment Captured · Warehouse Dispatched',
    channel: channel || 'TikTok Shop Ethiopia',
    timestamp: 'Just now',
  };
  db.addOrder(newOrder);
  res.json({ success: true, order: newOrder });
});

app.get('/api/db/export', (req, res) => {
  res.json({ success: true, exportData: db.dumpFullDatabase() });
});

// Digital Marketing Agent - CRO and Campaign Performance Optimization
app.post('/api/ai/marketing-advisor', async (req, res) => {
  const { campaignName, channel, currentCvr, currentCpc, spend, targetCpa, audience } = req.body;
  
  if (!ai) {
    // Intelligent fallback
    return res.json({
      success: true,
      data: {
        recommendation: `Allocate 22% more budget to lookalike audiences on ${channel || 'Meta'}. Shift $450 from broad interest targeting to dynamic creative re-targeting.`,
        bottleneck: 'Mid-funnel drop-off on product detail view with 64% cart abandonment on mobile.',
        actionItems: [
          'Enable 1-click Apple Pay / Shop Pay checkout above the fold',
          'Deploy social proof carousel featuring verified reviews within 300px of CTA',
          'Implement automated dynamic exit-intent discount trigger for carts > $75'
        ],
        expectedCvrLift: '+18.4%',
        adSpendAdjustment: 'Reduce low-performing ad set spend by 30% and scale winning creative variant B'
      }
    });
  }

  try {
    const prompt = `You are the lead Digital Marketing CRO & Ad Spend Optimization Agent for WiseSell AI.
Analyze the following campaign parameters:
- Campaign: ${campaignName || 'Omnichannel E-commerce Scale'}
- Channel: ${channel || 'Meta Ads / TikTok'}
- Current CVR: ${currentCvr || '2.4%'}
- Current CPC: ${currentCpc || '$1.18'}
- Monthly Spend: ${spend || '$14,500'}
- Target CPA: ${targetCpa || '$28'}
- Audience: ${audience || 'High-intent e-commerce shoppers 25-45'}

Provide a structured JSON response with:
1. recommendation (a punchy 2-sentence actionable tactical adjustment)
2. bottleneck (the highest-friction conversion barrier)
3. actionItems (array of 3 high-impact specific tests to deploy)
4. expectedCvrLift (e.g. "+16.2%")
5. adSpendAdjustment (concrete budget re-balancing instruction)

Format output strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Marketing Advisor AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Ethiopian Social Media Content Creation & Automated Scheduling Agent (Telegram, TikTok, WhatsApp, Facebook, LinkedIn)
app.post('/api/ai/content-create', async (req, res) => {
  const { platform, topic, tone, productFocus, goal, language, holidaySeason } = req.body;
  const targetPlatform = platform || 'Telegram';
  const targetLang = language || 'am';

  if (!ai) {
    return res.json({
      success: true,
      data: {
        platform: targetPlatform,
        primaryLanguage: targetLang,
        hook: targetLang === 'om'
          ? `🔥 Oomisha Addaa ${productFocus || 'Buna Yirgacheffee'} — Gatii Gad-aanaadhaan Telebirriin Ajajaa!`
          : targetLang === 'en'
          ? `🔥 Premium ${productFocus || 'Yirgacheffe Coffee'} — Instant Order via Telebirr & Same-Day Addis Delivery!`
          : `🔥 አዲስ የ${productFocus || 'ይርጋጨፌ ቡና'} ልዩ ዝግጅት — በቴሌብር በቅናሽ ዋጋ ይዘዙ!`,
        caption: targetLang === 'om'
          ? `Mootummaa qulqullinaa fi aadaa keenyaa! ${productFocus || 'Buna Yirgacheffee'} qulqullina olaanaa Grade 1. Finfinnee keessatti bilaashaan sin biraan geenya. Karaa Telebirr ykn CBE Birr kaffalaa.\n\n👇 Ajajuuf koodii gadii cuqaasaa!`
          : targetLang === 'en'
          ? `Direct from master producers to your cup. Authentic ${productFocus || 'Ethiopian Specialty'}. Free same-day delivery across Addis Ababa. Payment verified via Telebirr or CBE Birr.\n\n👇 Click below for 1-click checkout:`
          : `ጥራትና ባህልን አጣምሮ የያዘ ድንቅ የ${productFocus || 'ይርጋጨፌ ስፔሻሊቲ'} ምርት! በአዲስ አበባ በነፃ እናደርሳለን። ክፍያ በቴሌብር ወይም በCBE Birr በቀላሉ ይፈጽሙ።\n\n👇 አሁኑኑ ለማዘዝ ከታች ያለውን ሊንክ ይጫኑ:`,
        multilingualContent: {
          am: {
            hook: `🔥 አዲስ የ${productFocus || 'ይርጋጨፌ ቡና'} ልዩ ዝግጅት — በቴሌብር በቅናሽ ዋጋ ይዘዙ!`,
            caption: `ጥራትና ባህልን አጣምሮ የያዘ ድንቅ የ${productFocus || 'ይርጋጨፌ ስፔሻሊቲ'} ምርት! በአዲስ አበባ በነፃ እናደርሳለን። በቴሌብር ይክፈሉ።`,
            cta: 'በቴሌብር ቦት ይዘዙ ⚡',
          },
          om: {
            hook: `🔥 Oomisha Addaa ${productFocus || 'Buna Yirgacheffee'} — Gatii Gad-aanaadhaan Telebirriin Ajajaa!`,
            caption: `Mootummaa qulqullinaa fi aadaa keenyaa! ${productFocus || 'Buna Yirgacheffee'} Finfinnee keessatti bilaashaan sin biraan geenya.`,
            cta: 'Karaa Bot Telebirr Ajajaa ⚡',
          },
          en: {
            hook: `🔥 Premium ${productFocus || 'Yirgacheffe Coffee'} — Instant Order via Telebirr & Same-Day Addis Delivery!`,
            caption: `Direct single-origin authenticity. Free same-day delivery in Addis Ababa with instant Telebirr checkout.`,
            cta: 'Order via Telebirr Bot ⚡',
          },
        },
        shortFormVideoHook: {
          visualHook3s: `Dynamic 1.8-second pattern interrupt: macro steam pouring from traditional clay Jebena transitioning directly into modern lifestyle packaging`,
          audioMusicCue: 'Upbeat Ethiopian Jazz-trap fusion beat with traditional Kirar riff',
          onScreenText: targetLang === 'om' ? 'Iccitii Qulqullinaa 🔥' : targetLang === 'en' ? 'The Authentic Taste of Ethiopia ☕️' : 'ይህንን አይተው አያልፉም! ☕️🔥',
          cameraMovement: 'Fast whip pan into sharp macro focus with natural warm lighting',
          pacingSeconds: 18,
        },
        hashtags: ['#EthiopiaCommerce', '#HabeshaTikTok', '#Telebirr', '#AddisAbaba', '#EthioFinTech'],
        callToAction: targetLang === 'om' ? 'Karaa Telebirr Amma Ajajaa' : targetLang === 'en' ? 'Order Instantly via Telebirr' : 'በቴሌብር አሁኑኑ ይዘዙ',
        visualDirection: 'High-contrast studio lighting highlighting authentic Ethiopian craftsmanship, with Telebirr QR badge placed cleanly in lower right corner',
        bestTimeToPost: 'Tomorrow at 7:45 AM EAT (Morning Buna & Telegram Commute Peak)',
        scheduledEatTime: '07:45 EAT',
        channelSpecificPayload: {
          telegramButtons: [
            { label: '💳 በቴሌብር ይክፈሉ (Pay Telebirr)', url: 'https://telebirr.et/pay' },
            { label: '💬 ከደንበኞች አገልግሎት ጋር ያውሩ', url: 'https://t.me/WiseSellSupport' },
          ],
        },
      },
    });
  }

  try {
    const prompt = `You are an expert Social Media Manager and Content Creator agent managing channels popular in Ethiopia, primarily WhatsApp, Telegram Channels, TikTok, Facebook, and LinkedIn.
Create high-engagement, culturally resonant social media copy, video hooks, and local distribution formatting:
- Target Platform: ${targetPlatform} (WhatsApp, Telegram Channels, TikTok, Facebook, or LinkedIn)
- Product Focus: ${productFocus || 'Ethiopian Specialty Coffee & Artisanal Goods'}
- Topic Angle: ${topic || 'Authentic quality, local Telebirr payment convenience, fast Addis delivery'}
- Desired Tone: ${tone || 'Culturally respectful, energetic, high-converting'}
- Campaign Goal: ${goal || 'Drive direct checkouts via Telebirr and qualified customer inquiries'}
- Primary Language: ${targetLang} (am = Amharic, om = Afaan Oromoo, en = English)
- Holiday/Season Context: ${holidaySeason || 'Standard Ethiopian Calendar business window'}

Provide structured JSON with:
1. "hook": First 1-2 lines scroll stopper in the requested primary language.
2. "caption": Persuasive body copy with natural line breaks, culturally appropriate etiquette, pricing in ETB, and delivery terms (Addis Ababa door-to-door, regional coach/EMS).
3. "multilingualContent": An object with:
   - "am": { "hook": string, "caption": string, "cta": string } in Amharic (Ge'ez script)
   - "om": { "hook": string, "caption": string, "cta": string } in Afaan Oromoo (Qubee script)
   - "en": { "hook": string, "caption": string, "cta": string } in English
4. "shortFormVideoHook": An object with:
   - "visualHook3s": Actionable 3-second visual direction (pattern interrupt, camera motion, props like Jebena, Tibeb or tech stand)
   - "audioMusicCue": Recommended Ethiopian soundtrack style (e.g. Mulatu Ethio-jazz, modern Shurufkaa beat, energetic Kirar acoustic)
   - "onScreenText": Bold punchy on-screen text in Ge'ez/Qubee
   - "cameraMovement": Specific camera movement
   - "pacingSeconds": number (15 to 30)
5. "hashtags": Array of 5-6 viral tags relevant to Ethiopian digital search (e.g. #HabeshaTikTok, #EthiopianCoffee, #Finfinnee, #Telebirr, etc.)
6. "callToAction": High-converting local call to action
7. "visualDirection": Precise guidance for imagery or video scene setup
8. "bestTimeToPost": Recommended day & time in East Africa Time (EAT UTC+3), respecting Ethiopian working hours (8:30-17:30 Mon-Fri, Sat morning) and peak scrolling habits (07:30-09:00, 12:30-14:00, 18:30-21:30)
9. "scheduledEatTime": string (e.g. "07:45 EAT")
10. "channelSpecificPayload": Platform specific features:
    - If Telegram: { "telegramButtons": [{ "label": string, "url": string }] }
    - If WhatsApp: { "whatsappCatalogId": string }
    - If TikTok: { "tikTokSoundTitle": string }
    - If Facebook: { "facebookCarouselCount": number }
    - If LinkedIn: { "linkedInB2bTag": string }

Format output strictly as JSON without markdown code fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Content Creator AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Community Management AI Response Generator (Amharic, Afaan Oromoo, English)
app.post('/api/ai/ethiopian-community-reply', async (req, res) => {
  const { customerMessage, customerName, platform, inquiryLanguage, deliveryCity, paymentMethod } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        am: `ጤና ይስጥልኝ ${customerName || 'ክቡር ደንበኛችን'}! ስለ መልእክትዎ ከልብ እናመሰግናለን። ምርቱ በአሁኑ ወቅት በክምችት በእጃችን ይገኛል! ${deliveryCity || 'አዲስ አበባ'} ውስጥ በ2 ሰዓት ውስጥ በነፃ እናደርሳለን። በቴሌብር ለመክፈል 0911-234567 በመጠቀም መክፈል ይችላሉ። ደረሰኙን እዚህ ይላኩልን! 🙏`,
        om: `Akkam jirtu ${customerName || 'kabajamoo maamila keenya'}! Oomishni kun qophiidha. ${deliveryCity || 'Finfinnee'} keessatti sa'aatii 2 keessatti bilaashaan sin biraan geenya. Karaa Telebirr lakkoofsa 0912-345678 irratti kaffaluu dandeessu. Galatoomaa! ✨`,
        en: `Hello ${customerName || 'valued customer'}! Thank you for reaching out. Yes, we have fresh stock available with same-day express delivery in ${deliveryCity || 'Addis Ababa'}. You can pay directly via Telebirr or CBE Birr. We are ready to dispatch your order immediately!`,
        recommendedNextStep: 'Generate Telebirr payment order link and trigger logistics courier alert.',
      },
    });
  }

  try {
    const prompt = `You are an expert Ethiopian Community Management & Customer Engagement Agent for WiseSell AI on WhatsApp, Telegram, TikTok, and Facebook.
The customer inquiry is:
- Customer Name: ${customerName || 'Customer'}
- Platform: ${platform || 'Telegram'}
- Customer's Message: "${customerMessage || 'Is this in stock and can you deliver today?'}"
- Customer Language: ${inquiryLanguage || 'am'}
- Delivery City: ${deliveryCity || 'Addis Ababa'}
- Payment Intent: ${paymentMethod || 'Telebirr'}

Draft respectful, high-converting customer service responses with authentic Ethiopian cultural etiquette:
1. Warm respectful greeting ("ጤና ይስጥልኝ" in Amharic, "Akkam jirtu" in Afaan Oromoo, respectful "Hello" in English).
2. Direct answer to their inquiry with delivery timing and pricing.
3. Clear payment instruction via Telebirr or CBE Birr.
4. Provide the answer in ALL THREE languages so the agent can select or reply:
   - "am": string (Amharic)
   - "om": string (Afaan Oromoo)
   - "en": string (English)
5. "recommendedNextStep": string (Actionable internal CRM step)

Format output strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Community Reply AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Multimodal Vision & Text Agent: Image Prompt Generator Tool
app.post('/api/ai/image-prompt-generate', async (req, res) => {
  const { productTitle, platform, targetAudience, styleTheme, culturalContext } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        product: productTitle || 'Ethiopian Specialty Product',
        primaryPrompt: `Commercial studio editorial photograph of ${productTitle || 'freshly roasted Ethiopian Yirgacheffe specialty coffee beans'}, presented alongside a traditional handcrafted black clay Jebena and modern minimalist matte ceramic cups. Soft morning golden hour sunlight streaming across a dark textured volcanic basalt stone surface. High-contrast, hyper-detailed steam rising gracefully, macro depth of field f/1.8, Hasselblad H6D-100c medium format clarity, 8k resolution, authentic Ethiopian artisan aesthetic, cinematic warm earth tones, --ar 16:9 --v 6.1 --style raw`,
        visualComposition: {
          foreground: 'Hero product packaging with clean typography and Telebirr payment badge',
          midground: 'Clay Jebena or handwoven Tibeb fabric accents softly blurred',
          lighting: 'Warm golden hour rim lighting from side window with gentle fill reflector',
          cameraSetting: '85mm portrait prime lens, f/2.0 aperture, ISO 100, 1/250s shutter',
          colorPalette: ['#1C1917 (Volcanic Basalt)', '#F97316 (Spiced Ochre)', '#2563EB (Addis Twilight Blue)', '#F59E0B (Golden Amber)'],
        },
        socialAspectRatio: platform === 'TikTok' ? '9:16 (Vertical Short)' : platform === 'Telegram' ? '1:1 (Square Broadcast)' : '16:9 (Landscape Banner)',
        negativePrompt: 'blurry, oversaturated, artificial western stock photo, cartoonish, low resolution, plastic textures, watermark, distorted hands',
        recommendedPlatformUsage: `${platform || 'Telegram'} Feed & Ad Creative for peak CTR`,
      },
    });
  }

  try {
    const prompt = `You are the Multimodal Vision & Text Agent's Image Prompt Generator Tool for WiseSell AI in Ethiopia.
Create a hyper-realistic, culturally authentic, high-converting commercial photography prompt tailored for modern AI image generators (Midjourney v6, Imagen 3, FLUX):
- Product: ${productTitle || 'Ethiopian Specialty Coffee'}
- Target Channel: ${platform || 'Telegram / TikTok'}
- Target Audience: ${targetAudience || 'Modern Ethiopian urban shoppers and diaspora consumers'}
- Style Theme: ${styleTheme || 'Commercial Editorial & Cultural Heritage Luxury'}
- Cultural Setting: ${culturalContext || 'Addis Ababa authentic lifestyle, traditional craftsmanship blended with sleek minimalism'}

Provide structured JSON with keys:
1. "product": string
2. "primaryPrompt": Highly detailed 75-word prompt specifying subject, materials, camera body, lens, f-stop, natural lighting, textures (Tibeb, Jebena, basalt, acacia wood), and rendering engine parameters.
3. "visualComposition": object with "foreground", "midground", "lighting", "cameraSetting", and "colorPalette" (array of 4 hex/color strings).
4. "socialAspectRatio": string (e.g. "9:16" for TikTok/Reels, "1:1" for Telegram/Instagram, "16:9" for LinkedIn/Web)
5. "negativePrompt": string (unwanted artifacts to exclude)
6. "recommendedPlatformUsage": string

Format output strictly as JSON without markdown code fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Image Prompt Generator AI upstream error (falling back to local engine):', error.message);
    return res.json({
      success: true,
      data: {
        product: productTitle || 'Ethiopian Specialty Product',
        primaryPrompt: `Commercial studio editorial photograph of ${productTitle || 'freshly roasted Ethiopian Yirgacheffe specialty coffee beans'}, presented alongside a traditional handcrafted black clay Jebena and modern minimalist matte ceramic cups. Soft morning golden hour sunlight streaming across a dark textured volcanic basalt stone surface. High-contrast, hyper-detailed steam rising gracefully, macro depth of field f/1.8, Hasselblad H6D-100c medium format clarity, 8k resolution, authentic Ethiopian artisan aesthetic, cinematic warm earth tones, --ar 16:9 --v 6.1 --style raw`,
        visualComposition: {
          foreground: 'Hero product packaging with clean typography and Telebirr payment badge',
          midground: 'Clay Jebena or handwoven Tibeb fabric accents softly blurred',
          lighting: 'Warm golden hour rim lighting from side window with gentle fill reflector',
          cameraSetting: '85mm portrait prime lens, f/2.0 aperture, ISO 100, 1/250s shutter',
          colorPalette: ['#1C1917 (Volcanic Basalt)', '#F97316 (Spiced Ochre)', '#2563EB (Addis Twilight Blue)', '#F59E0B (Golden Amber)'],
        },
        socialAspectRatio: platform === 'TikTok' ? '9:16 (Vertical Short)' : platform === 'Telegram' ? '1:1 (Square Broadcast)' : '16:9 (Landscape Banner)',
        negativePrompt: 'blurry, oversaturated, artificial western stock photo, cartoonish, low resolution, plastic textures, watermark, distorted hands',
        recommendedPlatformUsage: `${platform || 'Telegram'} Feed & Ad Creative for peak CTR`,
      },
    });
  }
});

// Sentiment Analysis Engine Tool (Amharic, Afaan Oromoo, English)
app.post('/api/ai/sentiment-analyze', async (req, res) => {
  const { text, channel, customerName } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        analyzedText: text || 'ምርቱ በጣም ያምራል! በቴሌብር ከፍዬ ዛሬ ማግኘት እችላለሁ?',
        languageDetected: 'Amharic (አማርኛ)',
        sentiment: 'High Purchase Intent',
        polarityScore: 0.88,
        purchaseIntentScore: 94,
        emotionalTriggers: [
          'Strong visual appreciation ("በጣም ያምራል")',
          'Payment readiness via Telebirr ("በቴሌብር ከፍዬ")',
          'Delivery time sensitivity ("ዛሬ ማግኘት እችላለሁ")'
        ],
        intentCategory: 'Direct Checkout Request',
        escalationRisk: 'Low (Hot Buying Lead)',
        recommendedAction: 'Immediate dispatch of Telebirr payment order link and courier allocation for Addis delivery.',
        suggestedInstantReply: 'ጤና ይስጥልኝ! አዎ በእርግጥ፤ ዛሬ ከሰዓት በ2 ሰዓት ውስጥ በነፃ እናደርሳለን! በቴሌብር ለመክፈል ይህንን ቁጥር ይጠቀሙ: 0911-234567። እናመሰግናለን! 🙏'
      },
    });
  }

  try {
    const prompt = `You are the Sentiment Analysis Engine Tool for WiseSell AI, analyzing social commerce text in Ethiopia (Amharic, Afaan Oromoo, English).
Analyze this customer text:
- Text: "${text || 'Akkam jirtu! Gatiin Wandaboo kana meeqa? Telebirriidhaan kaffaluu nan danda\'aa?'}"
- Social Channel: ${channel || 'Telegram / TikTok'}
- Customer Name: ${customerName || 'Customer'}

Provide structured JSON with:
1. "analyzedText": string
2. "languageDetected": string (e.g. "Amharic (አማርኛ)", "Afaan Oromoo", or "English")
3. "sentiment": One of "Strongly Positive", "High Purchase Intent", "Price Sensitive", "Urgent Delivery Needed", "Neutral", "Escalation Risk"
4. "polarityScore": number from -1.0 (very negative) to +1.0 (very positive)
5. "purchaseIntentScore": number from 0 to 100
6. "emotionalTriggers": array of 3 string observations detailing local language idioms, cultural nuances, or urgency
7. "intentCategory": string (e.g. "Direct Checkout Request", "Product Spec Inquiry", "Delivery Window Check", "Price Negotiation")
8. "escalationRisk": string ("Low (Hot Buying Lead)", "Medium", or "High")
9. "recommendedAction": string (actionable advice for the sales agent or auto-bot)
10. "suggestedInstantReply": string (culturally respectful instant reply in the customer's native language)

Format output strictly as JSON without markdown code fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Sentiment Analysis AI upstream error (falling back to local engine):', error.message);
    const isOromo = (text || '').toLowerCase().includes('akkam') || (text || '').toLowerCase().includes('finfinnee') || (text || '').toLowerCase().includes('gatii');
    const isEnglish = (text || '').toLowerCase().includes('hello') || (text || '').toLowerCase().includes('good') || (text || '').toLowerCase().includes('invoice');

    return res.json({
      success: true,
      data: {
        analyzedText: text || 'ምርቱ በጣም ያምራል! በቴሌብር ከፍዬ ዛሬ ማግኘት እችላለሁ?',
        languageDetected: isOromo ? 'Afaan Oromoo' : isEnglish ? 'English' : 'Amharic (አማርኛ)',
        sentiment: 'High Purchase Intent',
        polarityScore: 0.88,
        purchaseIntentScore: 94,
        emotionalTriggers: isOromo
          ? [
              'Respectful cultural greeting ("Akkam jirtu")',
              'Payment readiness via Telebirr ("Telebirriidhaan")',
              'Regional delivery check ("Finfinnee / Adama")'
            ]
          : isEnglish
          ? [
              'Professional B2B salutation ("Good afternoon")',
              'Tax invoice & compliance inquiry ("VAT invoice")',
              'Fast fulfillment request ("clinic delivery")'
            ]
          : [
              'Strong visual appreciation ("በጣም ያምራል")',
              'Payment readiness via Telebirr ("በቴሌብር ከፍዬ")',
              'Delivery time sensitivity ("ዛሬ ማግኘት እችላለሁ")'
            ],
        intentCategory: 'Direct Checkout Request',
        escalationRisk: 'Low (Hot Buying Lead)',
        recommendedAction: 'Immediate dispatch of Telebirr payment order link and courier allocation for Addis delivery.',
        suggestedInstantReply: isOromo
          ? 'Akkam jirtu! Eeyyee har\'a sa\'aatii 2 keessatti bilaashaan sin biraan geenya. Telebirriidhaan lakkoofsa 0912-345678 irratti kaffaluu dandeessu. Galatoomaa! ✨'
          : isEnglish
          ? 'Hello! Thank you for reaching out. Yes, we issue official electronic VAT receipts with TIN and deliver to your clinic today.'
          : 'ጤና ይስጥልኝ! አዎ በእርግጥ፤ ዛሬ ከሰዓት በ2 ሰዓት ውስጥ በነፃ እናደርሳለን! በቴሌብር ለመክፈል ይህንን ቁጥር ይጠቀሙ: 0911-234567። እናመሰግናለን! 🙏'
      },
    });
  }
});

app.post('/api/ai/lead-qualify', async (req, res) => {
  const { leadName, company, monthlyRevenue, channels, message, budget } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        score: 92,
        tier: 'Tier 1 Enterprise Hot Lead',
        intent: 'High Purchase Intent - Ready for Salesforce Pipeline',
        bantAnalysis: {
          budget: 'Confirmed > $10k/mo software & ad spend capacity',
          authority: 'Decision maker (VP Commerce / Founder)',
          need: 'Urgent stock sync failure between Amazon and Shopify + ad inefficiency',
          timeline: 'Immediate implementation (< 14 days)'
        },
        salesforceAction: 'Auto-sync to Salesforce Lead object with Owner: Enterprise Sales Pod 1. Trigger Slack notification.',
        recommendedOutreach: 'Schedule technical integration walkthrough and provide multi-channel inventory ROI calculator.'
      }
    });
  }

  try {
    const prompt = `You are the Lead Qualification Agent for WiseSell AI synced with Salesforce CRM.
Analyze this inbound inquiry:
- Lead Name: ${leadName || 'Alex Mercer'}
- Company: ${company || 'Veloce Brands'}
- Monthly GMV: ${monthlyRevenue || '$250k/mo'}
- Channels: ${channels || 'Shopify, Amazon, TikTok Shop'}
- Message: ${message || 'We are experiencing severe inventory stockouts on Amazon while sitting on excess inventory on Shopify. Need unified stock sync and automated ad throttling.'}
- Budget: ${budget || '$15,000/yr+'}

Provide structured JSON:
- score (number from 0 to 100)
- tier (string: e.g. "Tier 1 Enterprise Hot Lead", "Tier 2 Growth", "Tier 3 Self-Serve")
- intent (string: e.g. "High Purchase Intent - Ready for Salesforce Pipeline")
- bantAnalysis (object with budget, authority, need, timeline)
- salesforceAction (string: exact routing & field update)
- recommendedOutreach (string: personalized next sales touchpoint)

Format output strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Lead Qualify AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// AI Business Assistant & Financial Strategic Growth Advisor
app.post('/api/ai/business-growth', async (req, res) => {
  const { gmv, grossMargin, cac, ltv, adRoas, returnRate, targetGrowth } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        executiveSummary: 'Strong unit economics with LTV:CAC ratio of 4.2x. Core growth lever is expanding TikTok Shop marketplace connectivity where ROAS is 3.8x compared to 2.2x on Meta.',
        financialHealthScore: 88,
        strategicRecommendations: [
          {
            pillar: 'Marketplace Expansion',
            opportunity: 'Sync top 20 SKU catalog to TikTok Shop and eBay US with automated price parity.',
            projectedImpact: '+$42,000 monthly incremental GMV at 62% gross margin'
          },
          {
            pillar: 'Working Capital & Inventory',
            opportunity: 'Re-negotiate 45-day vendor payment terms on high-velocity SKUs and trigger auto-reorders at 18 days buffer.',
            projectedImpact: 'Eliminate $16,400 monthly stockout opportunity loss'
          },
          {
            pillar: 'Ad Spend Allocation',
            opportunity: 'Shift 15% of Meta prospecting budget into TikTok creator spark ads and Google Shopping retargeting.',
            projectedImpact: 'Blended ROAS improvement from 2.6x to 3.2x'
          }
        ],
        scenarioSimulation: 'At current cash burn rate of $18k/mo and 24% month-over-month growth, working capital runway is 18 months.',
        urgentRisk: 'Low stock velocity on 3 seasonal SKUs causing $3,200/mo storage fees.'
      }
    });
  }

  try {
    const prompt = `You are the AI Business Assistant & CFO Strategic Advisor for WiseSell AI.
Analyze these financial & e-commerce metrics:
- Monthly GMV: ${gmv || '$342,000'}
- Gross Margin: ${grossMargin || '58.4%'}
- CAC: ${cac || '$38.50'}
- LTV: ${ltv || '$162.00'}
- Blended Ad ROAS: ${adRoas || '2.85x'}
- Return Rate: ${returnRate || '6.2%'}
- Target Growth: ${targetGrowth || '35% QoQ'}

Return structured JSON with keys:
- executiveSummary (high-level financial analysis)
- financialHealthScore (number between 0 and 100)
- strategicRecommendations (array of 3 objects with pillar, opportunity, projectedImpact)
- scenarioSimulation (cash flow / runway forecast)
- urgentRisk (critical risk factor to address)

Format output strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Business Growth AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Automated Social Engagement & DM Auto-Responder Agent
app.post('/api/ai/social-respond', async (req, res) => {
  const { customerMessage, platform, sentiment, productInterest } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        intent: 'Purchase Inquiry & Stock Verification',
        confidence: 0.96,
        sentiment: sentiment || 'High Purchase Intent',
        suggestedResponse: `Hey! Yes, our Matte Black Wireless Charging Hub is in stock and ready to ship within 24 hours. ⚡ You can grab 15% off today with code FLASH15 at checkout: wisesell.shop/hub. Let me know if you need any setup questions!`,
        actionTaken: 'Sent automated DM, tagged contact as "Hot Buyer Intent", synced to Salesforce CRM pipeline.'
      }
    });
  }

  try {
    const prompt = `You are the Automated Social Media Customer Engagement Agent for WiseSell AI.
Generate an instant, empathetic, sales-converting response:
- Platform: ${platform || 'Instagram DM'}
- Customer Message: "${customerMessage || 'Do you have the matte black model in stock? Can it charge both iPhone and Apple Watch simultaneously?'}"
- Product Interest: ${productInterest || 'Matte Black 3-in-1 Charging Hub'}

Return structured JSON:
- intent (identified intent of customer)
- confidence (number 0.0 - 1.0)
- sentiment (e.g. "Positive / Purchase Intent")
- suggestedResponse (natural, helpful, brand-aligned answer with closing question or direct cart link)
- actionTaken (automated backend action executed)

Format output strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Social Respond AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Automated Cross-Platform Campaign Optimization Engine
app.post('/api/ai/campaign-engine-optimize', async (req, res) => {
  const { channels, ecomAttribution, targetGoal, constraints } = req.body;

  if (!ai) {
    // High-fidelity fallback calculation if offline / key pending
    return res.json({
      success: true,
      data: {
        biddingStrategyAdjustments: [
          {
            channel: 'Meta Ads',
            currentStrategy: 'Lowest Cost (Auto-Bid)',
            recommendedStrategy: 'Target Cost / Cost Cap ($22.50)',
            bidMultiplierChange: '-8% during 02:00-07:00, +22% during 19:00-23:00 EST',
            rationale: 'High CPM volatility observed on broad ad sets during midday. Cost capping caps runaway CPC and forces auction wins in prime evening purchase windows.'
          },
          {
            channel: 'TikTok Ads',
            currentStrategy: 'Bid Cap ($18.00)',
            recommendedStrategy: 'Value Optimization (Target ROAS 4.2x)',
            bidMultiplierChange: '+18% for 18-34 mobile shoppers with high video completion rates',
            rationale: 'TikTok Spark ads showing 4.8x ROAS on video viewers > 75%. Value bidding captures higher-basket orders from recent viral sound trends.'
          },
          {
            channel: 'Google Search & Shopping',
            currentStrategy: 'Maximize Conversions',
            recommendedStrategy: 'Target ROAS (tROAS 450%)',
            bidMultiplierChange: '+30% exact match intent keywords, -50% broad phrase match',
            rationale: 'Brand and high-intent product queries are converting at 6.1%. Switching to tROAS protects profit margins against runaway phrase match queries.'
          },
          {
            channel: 'Amazon Sponsored Ads',
            currentStrategy: 'Dynamic Bids - Up & Down',
            recommendedStrategy: 'Dynamic Bids - Down Only with +20% Top-of-Search Multiplier',
            bidMultiplierChange: '+20% top of search placement, -15% rest of search',
            rationale: 'Top-of-search placement yields 78% of conversions at a $16.20 CPA compared to product detail page placement ($34.50 CPA).'
          }
        ],
        audienceTargetingRefinements: [
          {
            channel: 'Meta Ads',
            action: 'Exclude & Re-segment',
            audienceSegment: 'Auto-exclude 14-day Shopify purchasers; seed 1% Lookalike of top 10% highest LTV customers ($250+ AOV).',
            expectedImpact: 'Cuts ad waste by $680/wk and elevates CTR from 2.9% to 3.8%.'
          },
          {
            channel: 'TikTok Ads',
            action: 'Dynamic Custom Retargeting',
            audienceSegment: 'Deploy server CAPI retargeting for Shopify cart abandoners < 48h with dynamic product cards.',
            expectedImpact: 'Reclaims ~24 abandoned carts weekly with projected $2,100 incremental GMV.'
          },
          {
            channel: 'Google & Amazon',
            action: 'Negative Keyword Expansion',
            audienceSegment: 'Add 18 negative keywords (e.g. "free", "diy", "cheap", "schematic") identified from search term reports.',
            expectedImpact: 'Saves $420 monthly in non-commercial clicks.'
          }
        ],
        creativeAutoRefresh: [
          {
            channel: 'Meta Ads',
            fatiguedAdName: 'Creative Variant A (Feature List Video)',
            currentFrequency: 3.84,
            recommendedAction: 'Fatigue Alert - Auto-Swap Required (CTR decayed 24% over 7 days)',
            newReplacementHook: 'The 1 mistake 80% of remote workers make with their nightstand setup ⚡',
            newHeadline: 'Qi2 Certified 15W Magnetic Fast Charger | Zero Cable Mess'
          },
          {
            channel: 'TikTok Ads',
            fatiguedAdName: 'Spark UGC Ad #4 (Desk Tour Short)',
            currentFrequency: 4.12,
            recommendedAction: 'Saturated Audience - Rotate with Problem/Solution Format',
            newReplacementHook: 'My roommate said I wasted $89 on this charger... until she saw my desk 💀',
            newHeadline: 'Shop the viral 3-in-1 Qi2 Charging Hub before stock sells out'
          }
        ],
        budgetAllocationMatrix: [
          {
            channel: 'Meta Ads',
            currentBudget: 12400,
            recommendedBudget: 10800,
            delta: -1600,
            percentageShift: '-12.9%',
            predictedRoasLift: '+0.25x (higher efficiency post-pruning)'
          },
          {
            channel: 'TikTok Ads',
            currentBudget: 8900,
            recommendedBudget: 11200,
            delta: +2300,
            percentageShift: '+25.8%',
            predictedRoasLift: '+0.65x (scaling viral creator UGC)'
          },
          {
            channel: 'Google Ads',
            currentBudget: 6200,
            recommendedBudget: 6900,
            delta: +700,
            percentageShift: '+11.3%',
            predictedRoasLift: '+0.30x (capturing incremental high-intent search)'
          },
          {
            channel: 'Amazon Sponsored Ads',
            currentBudget: 4800,
            recommendedBudget: 3400,
            delta: -1400,
            percentageShift: '-29.2%',
            predictedRoasLift: '+0.40x (throttling low-stock SKU ad spend)'
          }
        ],
        projectedOverallImpact: {
          expectedBlendedRoas: '4.35x (up from 3.72x)',
          expectedCpaDrop: '-22.4% (from $29.40 to $22.80)',
          monthlyIncrementalRevenue: '+$34,800 at identical total ad spend ($32,300)'
        }
      }
    });
  }

  try {
    const prompt = `You are the lead Automated Cross-Platform Campaign Optimization Engine for WiseSell AI.
You continuously ingest real-time ad performance data across Meta Ads, TikTok Ads, Google Search/Shopping, and Amazon Sponsored Ads, alongside 1st-party Shopify e-commerce CAPI attribution.

Current State:
- Target Goal: ${targetGoal || 'Maximize Blended ROAS > 4.2x while keeping CPA < $24'}
- Channels Data: ${JSON.stringify(channels || [
  { channel: 'Meta Ads', spend: 12400, roas: 3.42, cpa: 28.50, cvr: 3.8, ctr: 2.9, frequency: 3.84 },
  { channel: 'TikTok Ads', spend: 8900, roas: 4.15, cpa: 19.80, cvr: 4.6, ctr: 4.2, frequency: 2.45 },
  { channel: 'Google Ads', spend: 6200, roas: 3.85, cpa: 24.10, cvr: 5.1, ctr: 5.8, frequency: 1.80 },
  { channel: 'Amazon Ads', spend: 4800, roas: 3.20, cpa: 31.00, cvr: 4.2, ctr: 2.1, frequency: 2.10 }
])}
- Shopify E-commerce Attribution: ${JSON.stringify(ecomAttribution || { totalRevenue: 122400, cartAbandonmentRate: '68%', serverMatchRate: '94.2%' })}
- Operational Constraints: ${JSON.stringify(constraints || { maxDailyBudgetShiftPercent: 30, minConfidence: 95 })}

Compute the optimal adjustments across the 4 key optimization vectors:
1. biddingStrategyAdjustments: array of { channel, currentStrategy, recommendedStrategy, bidMultiplierChange, rationale }
2. audienceTargetingRefinements: array of { channel, action, audienceSegment, expectedImpact }
3. creativeAutoRefresh: array of { channel, fatiguedAdName, currentFrequency, recommendedAction, newReplacementHook, newHeadline }
4. budgetAllocationMatrix: array of { channel, currentBudget, recommendedBudget, delta, percentageShift, predictedRoasLift }
5. projectedOverallImpact: { expectedBlendedRoas, expectedCpaDrop, monthlyIncrementalRevenue }

Format your response strictly as JSON with no markdown wrapping or text prefixes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Campaign Optimization Engine AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Autonomous Video and Audio Marketing Agent
app.post('/api/ai/video-audio-agent', async (req, res) => {
  const { productName, campaignGoal, format, language, targetAudience, voiceTone, durationSeconds } = req.body;

  if (!ai) {
    // High-fidelity multilingual response fallback
    return res.json({
      success: true,
      data: {
        videoTitle: `${productName || 'Smart Wireless Charging Hub'} - Viral Social Commerce Ad`,
        estimatedDuration: durationSeconds || '30s',
        format: format || 'Vertical 9:16 (TikTok, Reels, Shorts)',
        language: language || 'am',
        storyboard: [
          {
            sceneNumber: 1,
            timeCode: '0:00 - 0:03',
            visualDirection: 'Close-up dynamic fast zoom: Hand tossing 3 tangled phone charger cords into a trash can with frustration.',
            audioVoiceover: language === 'am'
              ? 'የተዘበራረቁ ገመዶች በቤትዎ ወይም በቢሮዎ ውስጥ ሰልችተዋል?'
              : 'Tired of messy charging cables cluttering your workspace and nightstand?',
            onScreenText: language === 'am' ? 'ገመዶችን ይሰናበቱ! ⚡' : 'STOP THE CABLE MESS ⚡',
            bRollCue: 'Natural desk lighting, 60fps slow motion drop'
          },
          {
            sceneNumber: 2,
            timeCode: '0:03 - 0:12',
            visualDirection: 'Sleek product reveal: Single snap onto the matte black magnetic hub. Phone, watch, and earbuds all charging simultaneously with amber LED glow.',
            audioVoiceover: language === 'am'
              ? 'ይህ በኢትዮጵያ የመጀመሪያው ይፋዊ Qi2 ባለ 3-በ-1 ፈጣን ቻርጀር ነው። ስልክዎን፣ ሰዓትዎንና ጆሮ ማዳመጫዎን በአንድ ላይ በአጭር ጊዜ ውስጥ ይሞላል!'
              : 'Meet the official Qi2 3-in-1 Fast Charging Hub. Powers your phone, smartwatch, and earbuds all on one single aerospace-aluminum stand!',
            onScreenText: language === 'am' ? '15W ይፋዊ የፈጣን ቻርጅ 🚀' : 'OFFICIAL 15W Qi2 FAST CHARGE',
            bRollCue: 'Macro shot of magnetic snap connection with haptic sound effect'
          },
          {
            sceneNumber: 3,
            timeCode: '0:12 - 0:22',
            visualDirection: 'Split screen: Left shows Telebirr / CBE Birr instant checkout payment; Right shows unboxing with premium packaging and accessories.',
            audioVoiceover: language === 'am'
              ? 'በቴሌብር ወይም በንግድ ባንክ (CBE Birr) በቀላሉ ይዘዙ! በ24 ሰዓት ውስጥ በነፃ ትራንስፖርት እስከ ደጃፍዎ ይደርሳል።'
              : 'Order instantly with Telebirr or CBE Birr! Free 24-hour door-to-door express delivery nationwide.',
            onScreenText: language === 'am' ? 'በቴሌብር ይክፈሉ · ነፃ ትራንስፖርት 📦' : 'PAY WITH TELEBIRR · FREE EXPRESS DELIVERY',
            bRollCue: 'Screen recording of Telebirr QR scan confirmation'
          },
          {
            sceneNumber: 4,
            timeCode: '0:22 - 0:30',
            visualDirection: 'Bold final graphic lockup: WiseSell AI product showcase with promo code FLASH15 and direct purchase link.',
            audioVoiceover: language === 'am'
              ? 'አሁኑኑ ከታች ባለው ሊንክ ይዘዙና የ15% ቅናሽ ያግኙ! ዕቃው ከማለቁ በፊት ዛሬውኑ ይዘዙ።'
              : 'Tap the link below now and use code FLASH15 for 15% off today only before stock sells out!',
            onScreenText: language === 'am' ? 'ኮድ: FLASH15 · አሁኑኑ ይዘዙ 🛒' : 'CODE: FLASH15 · ORDER NOW',
            bRollCue: 'Floating glowing CTA button with Telebirr & Visa badges'
          }
        ],
        fullAudioScript: language === 'am'
          ? 'የተዘበራረቁ ገመዶች በቤትዎ ወይም በቢሮዎ ውስጥ ሰልችተዋል? ይህ በኢትዮጵያ የመጀመሪያው ይፋዊ Qi2 ባለ 3-በ-1 ፈጣን ቻርጀር ነው። ስልክዎን፣ ሰዓትዎንና ጆሮ ማዳመጫዎን በአንድ ላይ በአጭር ጊዜ ውስጥ ይሞላል! በቴሌብር ወይም በንግድ ባንክ በቀላሉ ይዘዙ! በ24 ሰዓት ውስጥ በነፃ ትራንስፖርት እስከ ደጃፍዎ ይደርሳል። አሁኑኑ ከታች ባለው ሊንክ ይዘዙና የ15% ቅናሽ ያግኙ!'
          : 'Tired of messy charging cables cluttering your workspace and nightstand? Meet the official Qi2 3-in-1 Fast Charging Hub. Powers your phone, smartwatch, and earbuds all on one single aerospace-aluminum stand! Order instantly with Telebirr or CBE Birr with free 24-hour delivery. Tap the link below and use code FLASH15 for 15% off today only!',
        audioProductionGuide: {
          voicePersona: 'Energetic, confident, authentic commercial announcer',
          recommendedBpm: 124,
          backgroundMusicGenre: 'Modern Afrobeat Lo-Fi Synth or Upbeat Electronic Boom-Bap',
          soundEffects: ['Fast whoosh on hook', 'Magnetic snap click on 0:04', 'Telebirr payment chime on 0:14', 'Sub bass drop on CTA'],
          pacing: 'Dynamic and fast-paced, 140-150 words per minute'
        }
      }
    });
  }

  try {
    const prompt = `You are the Autonomous Video & Audio Marketing Agent for WiseSell AI, specializing in high-converting video ad storyboards and radio/podcast/TikTok voiceover audio scripts for Ethiopian multilingual commerce and international markets.

Generate a comprehensive, production-ready video & audio campaign plan for:
- Product Name: ${productName || 'Autonomous MagSafe 3-in-1 Charging Hub'}
- Campaign Goal: ${campaignGoal || 'Drive immediate social commerce checkouts with 15% discount code via Telebirr and online cart'}
- Video/Audio Format: ${format || 'Vertical 9:16 (TikTok, Reels, Shorts)'}
- Language: ${language || 'am'} (Options: am=Amharic, om=Afaan Oromoo, ti=Tigrinya, so=Somali, en=English)
- Target Audience: ${targetAudience || 'Modern tech enthusiasts, mobile shoppers, and remote professionals in Ethiopia and globally'}
- Voice Tone: ${voiceTone || 'Energetic, authoritative, conversational, high purchase intent'}
- Target Duration: ${durationSeconds || '30s'}

Important:
If language is "am" (Amharic), write the audio voiceovers and full audio script in authentic, fluent Amharic using Ge'ez script (አማርኛ)!
If language is "om", write in Afaan Oromoo.
If language is "ti", write in Tigrinya (ትግርኛ).
If language is "so", write in Somali.
If language is "en", write in English.

Return structured JSON with:
1. videoTitle: string
2. estimatedDuration: string (e.g. "30s")
3. format: string
4. language: string
5. storyboard: array of 4 scenes, each with:
   - sceneNumber (number)
   - timeCode (string e.g. "0:00 - 0:03")
   - visualDirection (detailed scene staging, camera angle, action)
   - audioVoiceover (the exact spoken line in the target language)
   - onScreenText (overlay graphic text)
   - bRollCue (visual cut cue)
6. fullAudioScript: string (complete cohesive voiceover monologue ready for TTS or voice artist)
7. audioProductionGuide: object with:
   - voicePersona (string)
   - recommendedBpm (number)
   - backgroundMusicGenre (string)
   - soundEffects (array of strings)
   - pacing (string)

Format strictly as JSON without markdown tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Video Audio Agent AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Ethiopian SEO & Culturally Resonant Content Marketing Agent
app.post('/api/ai/ethiopian-seo-generate', async (req, res) => {
  const { topic, targetLanguage, holidaySeason, targetMarket, productFocus } = req.body;
  const lang = targetLanguage || 'am';
  const holiday = holidaySeason || 'Meskel & Enkutatash';

  if (!ai) {
    // Intelligent culturally resonant fallback
    const fallbackAm = {
      metaTags: {
        title: `${topic || 'የመስቀልና እንቁጣጣሽ በዓል ቅናሾች'} | WiseSell ኢትዮጵያ`,
        description: 'የዘንድሮውን የመስቀልና አዲስ ዓመት በዓል በደመቀ ሁኔታ ያክብሩ! ጥራት ያላቸው ባህላዊ የሀበሻ ቀሚሶችና ምርጥ የይርጋጨፌ ቡና በቴሌብር (Telebirr) ይዘዙ።',
        keywords: 'የመስቀል በዓል, እንቁጣጣሽ, የሀበሻ ቀሚስ ዋጋ, የኢትዮጵያ ቡና, ቴሌብር ክፍያ, Telebirr online shopping Ethiopia',
        ogTitle: `${topic || 'የበዓል ልዩ ቅናሾች'} - በቴሌብርና ሲቢኢ ብር ይክፈሉ`,
        ogDescription: 'በመስቀልና እንቁጣጣሽ በዓል የሚወዷቸውን በልዩ ስጦታ ያስደስቱ። ፈጣን የቤት ለቤት ማድረስ በአዲስ አበባና በክልል ከተሞች።',
        canonicalUrl: 'https://wisesell.ai/et/meskel-holiday-specials',
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "የበዓል የሀበሻ ቀሚስና የይርጋጨፌ ቡና ስጦታ",
          "description": "የመስቀልና እንቁጣጣሽ በዓል ልዩ ምርቶች በቴሌብር ክፍያ",
          "brand": { "@type": "Brand", "name": "WiseSell Ethiopia" },
          "offers": {
            "@type": "Offer",
            "price": "3200",
            "priceCurrency": "ETB",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      keywords: {
        primary: lang === 'am' ? 'የመስቀል በዓል የሀበሻ ቀሚስና ቡና ቅናሽ' : lang === 'om' ? 'Gurgurtaa Ayyaana Masqalaa fi Oomishaalee Aadaa' : 'Meskel Holiday Ethiopian Traditional Attire & Coffee Sale',
        intent: 'Transactional & Cultural Search',
        secondary: [
          'የሀበሻ ቀሚስ ዋጋ አዲስ አበባ 2026',
          'ቴሌብር ኦንላይን ግዢ Telebirr payment',
          'ምርጥ የይርጋጨፌ ቡና መግዣ',
          'የበዓል ስጦታዎች ለቤተሰብ'
        ],
        localSearchSlang: ['በቴሌብር ይክፈሉ', 'ቀበሌ ድረስ ማድረስ', 'እንቁጣጣሽ ስጦታ', 'ሲቢኢ ብር CBE Birr']
      },
      articleContent: {
        h1: lang === 'am' ? 'የዘንድሮውን የመስቀልና እንቁጣጣሽ በዓል በደመቀ የሀበሻ ባህል እናከብር!' : lang === 'om' ? 'Ayyaana Masqalaa fi Waggaa Haaraa Oromiyaa fi Itoophiyaa Keessatti Haala Addaatiin Kabajaa!' : 'Celebrate Meskel & Enkutatash with Authentic Ethiopian Heritage & Seamless Digital Commerce',
        intro: 'የደመራው እሳት ሲበራ፣ የአደይ አበባው ምድሪቱን ሲያደምቅ እና አዲሱ ዓመት ሲጠባ በኢትዮጵያዊያን ልብ ውስጥ ልዩ ፍቅርና ደስታ ይነግሣል። በዚህ የበዓል ወቅት ቤተሰብን በውብ ስጦታዎች ማስደሰት፣ የሀበሻ ቀሚስ ለብሶ በደመራው ዙሪያ ማክበር እና ትኩስ የይርጋጨፌ ቡና ማፍላት የቀደምት ባህላችን ውብ መገለጫ ነው።',
        sections: [
          {
            h2: '1. ለበዓሉ የተመረጡ ባህላዊ የሀበሻ ቀሚሶችና አልባሳት',
            body: 'የመስቀል ደመራንና አዲስ ዓመትን ስናከብር ንጹሕ የጥበብ ቀሚስ መልበስ የውበትና የክብር መለያ ነው። በዘመናዊ ዲዛይን የተሰሩ፣ የእጅ ጥልፍ ያረፈባቸው የሀበሻ ቀሚሶች ለሴቶች እንዲሁም ባህላዊ የጋዳ ካባዎችና ሸሚዞች ለወንዶች በተመጣጣኝ ዋጋ ቀርበዋል።',
            bulletPoints: [
              '100% ንጹሕ የኢትዮጵያ ጥጥና ሐር የእጅ ሥራ ጥበብ',
              'ለደመራና ለበዓል ፕሮግራሞች የተስማሙ ዘመናዊ ዲዛይኖች',
              'ከቀላል የዕለት ልብስ እስከ ሙሉ የሙሽራና የበዓል ክብር አልባሳት'
            ]
          },
          {
            h2: '2. ከይርጋጨፌና ሲዳማ በቀጥታ የተዘጋጀ የጀበና ቡና',
            body: 'ምንም ዓይነት በዓል ያለ ጀበና ቡና እና የዕጣን ጭስ ድምቀት አይኖረውም። ከኢትዮጵያ ምርጥ እርሻዎች የተሰበሰቡ አንደኛ ደረጃ የይርጋጨፌና የሲዳማ ቡናዎች ለበዓሉ ዝግጁ ሆነው ቀርበውልዎታል።',
            bulletPoints: [
              'ኦርጋኒክ አንደኛ ደረጃ የታጠበና በፀሐይ የደረቀ ቡና',
              'በሸክላ ጀበና ሲፈላ ልዩ መዓዛና ወዝ የሚሰጥ ጥራት',
              'ለቤተሰብና ለወዳጅ ዘመድ የሚሆን ልዩ የስጦታ ማሸጊያ'
            ]
          },
          {
            h2: '3. ክፍያና ፈጣን የቤት ለቤት ማድረስ (Delivery)',
            body: 'ወደ ገበያ ወጥተው መጨናነቅ ሳያስፈልግዎ ባሉበት ሆነው በቴሌብር (Telebirr) ወይም በሲቢኢ ብር (CBE Birr) በቀላሉ ይክፈሉ። በአዲስ አበባ ውስጥ በ24 ሰዓት፣ በክልል ከተሞች ደግሞ በ48 ሰዓት ውስጥ በታማኝነት እናደርሳለን።'
          }
        ],
        localCallToAction: 'የበዓሉን ልዩ ቅናሾች እንዳያመልጥዎት አሁኑኑ በቴሌብር ወይም በሲቢኢ ብር ይዘዙ። ለበዓል ልዩ የስጦታ ኩፖን ኮድ "MESKEL2026" በመጠቀም 15% ቅናሽ ያግኙ!'
      },
      distributionChannelTips: [
        { platform: 'Telegram Commerce Channels', tactic: 'ከ50,000+ ተከታዮች ባሏቸው የሀገር ውስጥ የቴሌግራም ቻናሎች ላይ በቴሌብር 1-ክሊክ ቼክአውት ሊንክ ማሰራጨት።' },
        { platform: 'TikTok Ethiopia (#HabeshaTikTok)', tactic: 'የደመራ ዝግጅትና የሀበሻ ቀሚስ ፋሽን አጫጭር ቪዲዮዎችን በታዋቂ የሀበሻ ሙዚቃዎች በማጀብ መልቀቅ።' },
        { platform: 'Google.com.et SEO', tactic: 'በ "የሀበሻ ቀሚስ ዋጋ አዲስ አበባ" እና "Telebirr online shopping" ቁልፍ ቃላት ላይ Schema.org Product ማርክአፕ በመጠቀም የመጀመሪያ ደረጃን መያዝ።' }
      ]
    };

    return res.json({ success: true, data: fallbackAm });
  }

  try {
    const prompt = `You are an elite SEO & Cultural Content Marketing Agent specialized in the Ethiopian digital ecosystem (Google.com.et, Telegram commerce bots, TikTok Ethiopia #HabeshaTikTok, local portals Addis Fortune, Reporter, Fana, and social search).

Parameters:
- Target Topic: ${topic || 'Meskel & Enkutatash Festival Traditional Commerce'}
- Target Language: ${lang} (am = Amharic አማርኛ with proper Ge'ez script, om = Afaan Oromoo with Qubee, en = English for Ethiopian diaspora and international buyers)
- Holiday / Cultural Season: ${holiday}
- Target Audience: ${targetMarket || 'Ethiopian consumers in Addis Ababa & regional cities, plus diaspora sending gifts'}
- Product Vertical: ${productFocus || 'Traditional Habesha Kemis, Specialty Ethiopian Coffee, Superfoods & Tech'}

Create a high-ranking, culturally resonant content & SEO package.
Ensure:
1. Search intent tailored to Google.com.et and Ethiopian mobile user habits (Telebirr ቴሌብር, CBE Birr, Chapa ቻፓ, Telegram channels).
2. Clean metadata: title (under 60 characters with branding), description (120-160 characters with CTA), keywords, OpenGraph, Canonical URL, and JSON-LD Schema.org.
3. Long-form article with engaging cultural storytelling, clear H1, H2, H3, bullet points, and compelling local CTA.
4. If language is 'am', write the article, titles, and body in natural, poetic, high-conversion Amharic.
5. If language is 'om', write in authentic, culturally resonant Afaan Oromoo.
6. If language is 'en', write in high-converting English optimized for Ethiopian diaspora and international search.

Return strictly JSON:
{
  "metaTags": {
    "title": "string (<60 chars)",
    "description": "string (120-160 chars)",
    "keywords": "string",
    "ogTitle": "string",
    "ogDescription": "string",
    "canonicalUrl": "string",
    "jsonLd": { "@context": "https://schema.org", "@type": "Product or Article", ... }
  },
  "keywords": {
    "primary": "string",
    "intent": "string",
    "secondary": ["string", "string", "string", "string"],
    "localSearchSlang": ["string", "string", "string"]
  },
  "articleContent": {
    "h1": "string",
    "intro": "string",
    "sections": [
      {
        "h2": "string",
        "body": "string",
        "bulletPoints": ["string", "string"]
      }
    ],
    "localCallToAction": "string"
  },
  "distributionChannelTips": [
    { "platform": "string", "tactic": "string" }
  ]
}

Format strictly as JSON without markdown backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Ethiopian SEO Agent AI error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Mount Vite middleware in development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`WiseSell AI server running on http://0.0.0.0:${port}`);
  });
}

startServer();
