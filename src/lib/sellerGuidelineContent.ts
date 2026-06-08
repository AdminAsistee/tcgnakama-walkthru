/** Literal text transcribed from TCGNakama-Seller-Page-Guidelines.pdf (one entry per PDF page) */

export interface GuidelineStep {
  title: string
  body: string
}

export interface GuidelineDefinition {
  term: string
  definition: string
}

export interface GuidelineCallout {
  type: 'tip' | 'warning' | 'info' | 'success'
  title?: string
  body: string
}

export interface GuidelinePageContent {
  page: number
  eyebrow?: string
  title: string
  subtitle?: string
  url?: string
  paragraphs?: string[]
  bullets?: string[]
  steps?: GuidelineStep[]
  definitions?: GuidelineDefinition[]
  callouts?: GuidelineCallout[]
  isBlank?: boolean
}

export const SELLER_GUIDELINE_PAGES: GuidelinePageContent[] = [
  {
    page: 1,
    eyebrow: 'OFFICIAL SELLER GUIDE · 2026',
    title: 'TCGNakama',
    subtitle: 'Seller Dashboard Onboarding Guide',
    paragraphs: [
      'Everything you need to start listing, managing, and selling your TCG cards on the TCGNakama marketplace.',
    ],
    bullets: ['5 Core Features', 'AI Powered Pricing', '50 Cards per Upload'],
    callouts: [
      {
        type: 'info',
        body: 'Version 1.0 · May 2026 · tcgnakama.com',
      },
    ],
  },
  {
    page: 2,
    title: 'Page 2',
    isBlank: true,
  },
  {
    page: 3,
    title: 'Table of Contents',
    subtitle: 'Your complete guide to the TCGNakama Seller Dashboard',
    bullets: [
      '1 Getting Started — Dashboard Overview',
      '2 My Vault — Managing Your Inventory',
      '3 Bulk Upload — Upload Multiple Cards at Once',
      '4 Add Card — Edit Individual Product Details',
      '★ Bulk Upload vs Add Card — The Most Common Confusion',
      '5 My Orders — Tracking Your Sales',
      '6 My Storefront — Your Brand Identity',
    ],
    callouts: [
      {
        type: 'tip',
        title: 'New Seller? Start Here',
        body:
          'The recommended workflow for new sellers is: Bulk Upload your cards first to create listings quickly, then use Add Card to fine-tune each listing individually. See page 7 for the full explanation.',
      },
    ],
  },
  {
    page: 4,
    title: 'Page 4',
    isBlank: true,
  },
  {
    page: 5,
    title: '1. Dashboard Overview',
    url: 'tcgnakama.com/seller/dashboard — Your starting point',
    paragraphs: [
      'After logging in, you land on your Seller Dashboard. This is your control center. It shows your store profile and gives you quick access to all 5 seller tools.',
    ],
    bullets: [
      'My Vault — View and manage all your listed products. Edit stock, appraise values, delete listings, and sync to Shopify.',
      'Add Single Card — List one card at a time with full control over every detail. Best for editing existing listings or adding a single premium item.',
    ],
  },
  {
    page: 6,
    title: '1. Dashboard Overview (continued)',
    bullets: [
      'Bulk Upload — Upload up to 50 card images at once. AI automatically identifies each card and suggests pricing. Best for batch listing.',
      'My Orders — View all customer orders, filter by status, and track total revenue.',
      'My Storefront — Customize your seller brand — upload logo, banner, tagline and social links.',
    ],
  },
  {
    page: 7,
    title: '2. My Vault',
    url: 'tcgnakama.com/seller-admin — Your inventory command center',
    paragraphs: [
      'The Vault is where all your listings live. Every card you upload (via Bulk Upload or Add Card) appears here. You can monitor inventory value, appraise cards, and manage each listing.',
    ],
    definitions: [
      { term: 'Asset', definition: 'Card name and thumbnail image' },
      { term: 'Stock', definition: 'How many units you have available' },
      { term: 'Age', definition: 'How long this card has been listed' },
    ],
  },
  {
    page: 8,
    title: '2. My Vault (continued)',
    definitions: [
      { term: 'Value (¥)', definition: 'Current market appraisal value' },
      { term: 'Market (¥)', definition: 'Live market price reference' },
      { term: 'Sell Price', definition: 'The price buyers see on your storefront' },
      { term: 'Actions', definition: 'Edit, Delete, or toggle visibility' },
    ],
    callouts: [
      {
        type: 'tip',
        title: 'Tip',
        body:
          'Click APPRAISE next to any card to let AI re-evaluate its current market value based on the latest data.',
      },
      {
        type: 'tip',
        title: 'Sync Shopify',
        body:
          'Use the SYNC SHOPIFY button to push all vault listings to your connected Shopify store instantly.',
      },
    ],
  },
  {
    page: 9,
    title: '3. Bulk Upload',
    url: 'tcgnakama.com/seller-admin/bulk-upload — Upload many cards at once',
    paragraphs: [
      'Bulk Upload is designed for speed. Upload photos of your card fronts and let AI do the heavy lifting — it identifies every card, writes descriptions, and suggests market prices automatically.',
    ],
    steps: [
      {
        title: 'Select card images',
        body:
          'Click the drop zone or drag and drop up to 50 PNG/JPG/JPEG images. Max 10MB each. Only upload the front side of each card.',
      },
      {
        title: 'Click "Appraise Cards"',
        body:
          'AI analyzes every image simultaneously — identifying the card name, set, rarity, condition, and suggested market price.',
      },
    ],
    callouts: [
      {
        type: 'info',
        title: 'First time here? Check out this quick guide.',
        body:
          '1. Select up to 50 card photos or drag them into the box below.\n2. Tap the appraise button, AI will identify every card for you.\n3. Review the results in the table to ensure everything looks correct.\n4. Hit "Confirm & Add" to instantly list them in your vault.',
      },
    ],
  },
  {
    page: 10,
    title: '3. Bulk Upload (continued)',
    steps: [
      {
        title: 'Review the results table',
        body:
          'Check that AI identified each card correctly. You can adjust any field in the table before confirming.',
      },
      {
        title: 'Click "Confirm & Add"',
        body: 'All cards are instantly added to your Vault and made live on your storefront.',
      },
    ],
    callouts: [
      {
        type: 'tip',
        title: 'Pro Tip',
        body:
          'Name your files with underscores for the shelf location (e.g. shelf_A_pikachu.jpg) to auto-tag storage locations. PRO TIP: USE LIBRARIES/BOXES AS FILENAMES (E.G. SHELF_A_PRISM.JPG) TO AUTO-TAG LOCATIONS',
      },
      {
        type: 'warning',
        title: 'Limit',
        body:
          'Maximum 50 cards per upload session. For larger collections, run multiple upload sessions.',
      },
    ],
  },
  {
    page: 11,
    title: '4. Add Card',
    url: 'tcgnakama.com/seller-admin/add-card — Edit individual product details',
    paragraphs: [
      'Add Card gives you full control over a single listing. Use it to edit an existing card\'s details, add extra photos, or create a carefully curated listing for a premium item.',
    ],
    steps: [
      {
        title: 'Upload card image(s)',
        body:
          'Drop images or paste an image URL. You can upload multiple angles (front, back, close-up of condition).',
      },
      {
        title: 'Click "Appraise Card with AI"',
        body:
          'AI fills in Card Name, Set, Rarity, Description, and suggested Sell Price automatically.',
      },
      {
        title: 'Review & edit all fields',
        body:
          'Check Core Identity (name, description, price) and TCG Parameters (vendor, set code, rarity, condition, storage).',
      },
    ],
  },
  {
    page: 12,
    title: '4. Add Card (continued)',
    steps: [
      {
        title: 'Click "Save All Changes"',
        body: 'The listing is saved to your Vault and published to your storefront.',
      },
    ],
    callouts: [
      {
        type: 'tip',
        title: 'Just adding photos?',
        body:
          'Upload your extra images, skip the Appraise step, and hit Save directly — no need to re-analyze the card.',
      },
    ],
  },
  {
    page: 13,
    eyebrow: 'MOST COMMON CONFUSION',
    title: 'Bulk Upload vs. Add Card — What\'s the Difference?',
    subtitle: 'Understanding when to use each tool will save you a lot of time.',
    bullets: [
      'Bulk Upload — Use when you have multiple cards to list at the same time. Upload 2–50 card front images at once. AI identifies and prices all cards together. Creates multiple listings in one action. Only needs the front-side photo. Best for: new stock, batch listing.',
      'Add Card — Use when you need to edit or fine-tune a single listing. Edit one listing at a time. Full control over every field. Add multiple photos (front + back). Adjust price, condition, description. Best for: editing after bulk upload.',
    ],
    callouts: [
      {
        type: 'success',
        title: 'The Recommended Workflow',
        body:
          'For a seller with 10 new cards to list, here is the correct step-by-step process: 1. Bulk Upload (10 card images) → 2. AI Appraises all 10 cards → 3. Confirm & Add (all 10 go live) → 4. Add Card (edit each one if needed).',
      },
      {
        type: 'info',
        title: 'Simple Rule to Remember',
        body:
          'Bulk Upload = CREATE listings fast (front image only, AI does the rest). Add Card = EDIT listings individually (full details, multiple photos). Think of Bulk Upload as the "factory" that creates your listings, and Add Card as the "workshop" where you polish each one.',
      },
      {
        type: 'warning',
        title: 'Common Mistake',
        body:
          'Sellers sometimes go directly to Add Card to list 10 cards — this means filling the form 10 times separately. Use Bulk Upload first, then edit with Add Card only if needed.',
      },
    ],
  },
  {
    page: 14,
    title: 'Page 14',
    isBlank: true,
  },
  {
    page: 15,
    title: '5. My Orders',
    url: 'tcgnakama.com/seller-admin/orders — Track your sales',
    paragraphs: [
      'The Orders page shows all customer purchases that include your cards. Use the date filter and status tabs to track payments and fulfillment.',
    ],
    definitions: [
      { term: 'All', definition: 'Every order ever placed' },
      { term: 'Unfulfilled', definition: 'Orders that need to be shipped' },
      { term: 'Unpaid', definition: 'Orders awaiting payment' },
    ],
  },
  {
    page: 16,
    title: '5. My Orders (continued)',
    definitions: [
      { term: 'Open', definition: 'Active orders in progress' },
      { term: 'Archived', definition: 'Completed and closed orders' },
    ],
    callouts: [
      {
        type: 'tip',
        title: 'Tip',
        body:
          'Use the Date Filter to view orders within a specific period and calculate your revenue for that time range.',
      },
      {
        type: 'tip',
        body: 'Total Revenue is shown in Japanese Yen (¥) at the top of the page.',
      },
    ],
  },
  {
    page: 17,
    title: '6. My Storefront',
    url: 'tcgnakama.com/seller-admin/storefront — Build your brand',
    paragraphs: [
      'Your Storefront is your public seller profile on TCGNakama. Buyers see your logo, banner, tagline, and social handles when they visit your store page.',
    ],
    steps: [
      {
        title: 'Upload your Logo',
        body: 'Square image recommended. This appears next to your store name everywhere on the site.',
      },
      {
        title: 'Upload your Banner',
        body: 'Wide landscape image (min 1200x400px). Shown as the hero image at the top of your store page.',
      },
      {
        title: 'Add your Tagline',
        body: 'A short memorable phrase under your store name. Example: "Catch Japan\'s Finest."',
      },
    ],
  },
  {
    page: 18,
    title: '6. My Storefront (continued)',
    steps: [
      {
        title: 'Add Social Links',
        body:
          'Instagram and Twitter/X handles. These appear as clickable @handles on your storefront, helping buyers follow you.',
      },
    ],
    callouts: [
      {
        type: 'success',
        title: 'Stores with complete profiles get more trust',
        body:
          'Sellers with a logo, banner, and tagline receive a Trusted Seller badge displayed on their store page, which increases buyer confidence and conversion rates.',
      },
      {
        type: 'info',
        body: 'Need help? Contact our seller support team — support@tcgnakama.com',
      },
      {
        type: 'info',
        body: 'TCGNakama Seller Onboarding Guide v1.0 · May 2026',
      },
    ],
  },
]

export function getGuidelinePageContent(page: number): GuidelinePageContent {
  return (
    SELLER_GUIDELINE_PAGES.find((entry) => entry.page === page) ?? {
      page,
      title: `Page ${page}`,
      isBlank: true,
    }
  )
}

export function guidelinePageNarration(pageContent: GuidelinePageContent): string {
  const parts: string[] = [pageContent.title, ...(pageContent.paragraphs ?? [])]
  if (pageContent.subtitle) parts.push(pageContent.subtitle)
  if (pageContent.bullets?.length) parts.push(pageContent.bullets.join('. '))
  if (pageContent.steps?.length) {
    parts.push(pageContent.steps.map((step) => `${step.title}: ${step.body}`).join('. '))
  }
  if (pageContent.definitions?.length) {
    parts.push(pageContent.definitions.map((row) => `${row.term}: ${row.definition}`).join('. '))
  }
  if (pageContent.callouts?.length) {
    parts.push(pageContent.callouts.map((callout) => callout.body).join('. '))
  }
  return parts.filter(Boolean).join('. ')
}
