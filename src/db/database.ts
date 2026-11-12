import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialCampaignTests, initialLeads, initialInventory, initialSocialPosts, initialCustomerEngagement, initialActivityLogs, initialChannelTelemetry } from '../data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.resolve(__dirname, '../../wisesell_db.json');

export interface ConnectorStatus {
  id: string;
  name: string;
  category: 'Mobile Money' | 'E-Commerce' | 'Social Commerce' | 'CRM' | 'Ad Network';
  country: 'Ethiopia' | 'Global';
  status: 'Connected' | 'Syncing' | 'Idle' | 'Degraded';
  latencyMs: number;
  lastSyncTime: string;
  eventsProcessedToday: number;
  apiEndpoint: string;
  webhookSecretSet: boolean;
}

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  connectors: ConnectorStatus[];
  leads: any[];
  inventory: any[];
  campaigns: any[];
  socialPosts: any[];
  customerEngagements: any[];
  channelTelemetry: any[];
  activityLogs: any[];
  orders: any[];
}

const initialConnectors: ConnectorStatus[] = [
  {
    id: 'conn-telebirr',
    name: 'Telebirr Merchant API (ቴሌብር)',
    category: 'Mobile Money',
    country: 'Ethiopia',
    status: 'Connected',
    latencyMs: 42,
    lastSyncTime: 'Just now',
    eventsProcessedToday: 412,
    apiEndpoint: 'https://api.telebirr.et/v2/payment/checkout',
    webhookSecretSet: true,
  },
  {
    id: 'conn-cbe',
    name: 'CBE Birr (የኢትዮጵያ ንግድ ባንክ)',
    category: 'Mobile Money',
    country: 'Ethiopia',
    status: 'Connected',
    latencyMs: 68,
    lastSyncTime: '2 mins ago',
    eventsProcessedToday: 184,
    apiEndpoint: 'https://cbebirr.cbe.com.et/merchant/ipn',
    webhookSecretSet: true,
  },
  {
    id: 'conn-chapa',
    name: 'Chapa Payment Gateway (ቻፓ)',
    category: 'Mobile Money',
    country: 'Ethiopia',
    status: 'Connected',
    latencyMs: 55,
    lastSyncTime: '1 min ago',
    eventsProcessedToday: 260,
    apiEndpoint: 'https://api.chapa.co/v1/transaction/initialize',
    webhookSecretSet: true,
  },
  {
    id: 'conn-telegram',
    name: 'Telegram Commerce Bot (@WiseSellBot)',
    category: 'Social Commerce',
    country: 'Ethiopia',
    status: 'Connected',
    latencyMs: 38,
    lastSyncTime: 'Just now',
    eventsProcessedToday: 890,
    apiEndpoint: 'https://api.telegram.org/bot/wisesell_webhook',
    webhookSecretSet: true,
  },
  {
    id: 'conn-shopify',
    name: 'Shopify Plus Server CAPI',
    category: 'E-Commerce',
    country: 'Global',
    status: 'Connected',
    latencyMs: 82,
    lastSyncTime: 'Just now',
    eventsProcessedToday: 1420,
    apiEndpoint: 'https://wisesell.myshopify.com/admin/api/2026-10/graphql',
    webhookSecretSet: true,
  },
  {
    id: 'conn-tiktok',
    name: 'TikTok Shop & Events API',
    category: 'Social Commerce',
    country: 'Global',
    status: 'Connected',
    latencyMs: 95,
    lastSyncTime: 'Just now',
    eventsProcessedToday: 935,
    apiEndpoint: 'https://business-api.tiktok.com/open_api/v1.3/',
    webhookSecretSet: true,
  },
  {
    id: 'conn-meta',
    name: 'Meta Marketing & Conversions API',
    category: 'Ad Network',
    country: 'Global',
    status: 'Connected',
    latencyMs: 110,
    lastSyncTime: '1 min ago',
    eventsProcessedToday: 2840,
    apiEndpoint: 'https://graph.facebook.com/v21.0/act_wisesell',
    webhookSecretSet: true,
  },
  {
    id: 'conn-salesforce',
    name: 'Salesforce Enterprise CRM (NA124)',
    category: 'CRM',
    country: 'Global',
    status: 'Connected',
    latencyMs: 85,
    lastSyncTime: '2 mins ago',
    eventsProcessedToday: 320,
    apiEndpoint: 'https://wisesell.my.salesforce.com/services/data/v61.0',
    webhookSecretSet: true,
  },
  {
    id: 'conn-firestore',
    name: 'Firebase Cloud Firestore (lunar-option-jbvhw)',
    category: 'CRM',
    country: 'Global',
    status: 'Connected',
    latencyMs: 34,
    lastSyncTime: 'Just now',
    eventsProcessedToday: 1840,
    apiEndpoint: 'https://firestore.googleapis.com/v1/projects/lunar-option-jbvhw',
    webhookSecretSet: true,
  },
];

const initialOrders = [
  { id: 'ET-ORD-901', customer: 'Yohannes Bekele', paymentMethod: 'Telebirr ቴሌብር', amountEtb: 11125, amountUsd: 89, items: '1x MagSafe 3-in-1 Hub', status: 'Payment Confirmed · Express Delivery', channel: 'TikTok Shop Ethiopia', timestamp: '3 mins ago' },
  { id: 'ET-ORD-902', customer: 'Bethlehem Tadesse', paymentMethod: 'CBE Birr', amountEtb: 8000, amountUsd: 64, items: '1x Aluminum Laptop Stand', status: 'In Transit via Addis Post', channel: 'Telegram Bot', timestamp: '14 mins ago' },
  { id: 'ET-ORD-903', customer: 'Dawit Mengistu', paymentMethod: 'Chapa ቻፓ', amountEtb: 3000, amountUsd: 24, items: '1x USB-C 240W Cable', status: 'Warehouse Dispatched', channel: 'Shopify Store', timestamp: '28 mins ago' },
  { id: 'ET-ORD-904', customer: 'Fatima Abdi', paymentMethod: 'Telebirr ቴሌብር', amountEtb: 14875, amountUsd: 119, items: '1x Monitor ScreenBar Light', status: 'Delivered', channel: 'Instagram Shop', timestamp: '45 mins ago' },
];

export class AppDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        let modified = false;
        if (parsed.inventory && parsed.inventory.length < initialInventory.length) {
          parsed.inventory = initialInventory;
          modified = true;
        }
        if (!parsed.socialPosts || parsed.socialPosts.length < initialSocialPosts.length || !parsed.socialPosts.some((p: any) => p.platform === 'Telegram')) {
          parsed.socialPosts = initialSocialPosts;
          modified = true;
        }
        if (!parsed.customerEngagements || !parsed.customerEngagements.some((e: any) => e.platform === 'Telegram')) {
          parsed.customerEngagements = initialCustomerEngagement;
          modified = true;
        }
        if (!parsed.campaigns || !parsed.campaigns.some((c: any) => c.name.includes('Yirgacheffe'))) {
          parsed.campaigns = initialCampaignTests;
          modified = true;
        }
        if (!parsed.connectors || !parsed.connectors.some((c: any) => c.id === 'conn-firestore')) {
          parsed.connectors = initialConnectors;
          modified = true;
        }
        if (modified) {
          this.saveDatabase(parsed);
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Initializing fresh database file...', err);
    }

    const defaultDb: DatabaseSchema = {
      version: '3.8.0',
      lastUpdated: new Date().toISOString(),
      connectors: initialConnectors,
      leads: initialLeads,
      inventory: initialInventory,
      campaigns: initialCampaignTests,
      socialPosts: initialSocialPosts,
      customerEngagements: initialCustomerEngagement,
      channelTelemetry: initialChannelTelemetry,
      activityLogs: initialActivityLogs,
      orders: initialOrders,
    };

    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  public saveDatabase(state?: DatabaseSchema) {
    try {
      const dataToSave = state || this.data;
      dataToSave.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public getStats() {
    return {
      version: this.data.version,
      lastUpdated: this.data.lastUpdated,
      counts: {
        connectors: this.data.connectors.length,
        leads: this.data.leads.length,
        inventory: this.data.inventory.length,
        campaigns: this.data.campaigns.length,
        socialPosts: this.data.socialPosts.length,
        customerEngagements: this.data.customerEngagements.length,
        orders: this.data.orders.length,
        activityLogs: this.data.activityLogs.length,
      },
      fileSizeBytes: fs.existsSync(DB_FILE_PATH) ? fs.statSync(DB_FILE_PATH).size : 0,
      activeConnectors: this.data.connectors.filter((c) => c.status === 'Connected').length,
    };
  }

  public getTable<T = any>(tableName: keyof DatabaseSchema): T {
    return (this.data[tableName] as unknown) as T;
  }

  public updateTable(tableName: keyof DatabaseSchema, rows: any[]) {
    (this.data as any)[tableName] = rows;
    this.saveDatabase();
  }

  public pingConnector(connectorId: string) {
    const conn = this.data.connectors.find((c) => c.id === connectorId);
    if (conn) {
      // Simulate real jitter around network ping
      conn.latencyMs = Math.floor(25 + Math.random() * 45);
      conn.lastSyncTime = 'Just now';
      conn.eventsProcessedToday += 1;
      this.saveDatabase();
      return conn;
    }
    return null;
  }

  public addOrder(order: any) {
    this.data.orders.unshift(order);
    this.saveDatabase();
    return order;
  }

  public dumpFullDatabase(): DatabaseSchema {
    return this.data;
  }
}

export const db = new AppDatabase();
