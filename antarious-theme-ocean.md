# Antarious MSME — ডিজাইন টোকেন
নির্বাচিত মুড: ওশান (ocean)
তারিখ: ২/৬/২০২৬, ৬:৩০:২৩ PM

## নির্বাচন (Selections)
- ফন্ট: Tiro Bangla
- কর্নার রেডিয়াস: 20px
- বাটন আকৃতি / ফিল: soft / solid
- গ্রেডিয়েন্ট স্টাইল: diagonal
- আইকন স্টাইল: emoji
- ব্যাকগ্রাউন্ড / কার্ড: soft / white
- এন্ট্রান্স অ্যানিমেশন: pop
- মোড: light

## রং (Colors)
Primary    #0e7490
Primary-2  #22b8cf
Accent     #155e75
Accent-2   #67e8f9
Income     #14b8a6
Expense    #fb7185
Background #ecfeff → #f0fdfa
Card       #ffffff
Ink (text) #083344
Muted      #5f8a96
Chip       #cffafe
AI accent  #0891b2

## গ্রেডিয়েন্ট
linear-gradient(135deg,#0e7490,#0891b2 55%,#22d3ee)

## CSS Variables
```css
:root{
  --primary:#0e7490;
  --primary-2:#22b8cf;
  --accent:#155e75;
  --accent-2:#67e8f9;
  --income:#14b8a6;
  --expense:#fb7185;
  --bg-1:#ecfeff;
  --bg-2:#f0fdfa;
  --card:#ffffff;
  --ink:#083344;
  --muted:#5f8a96;
  --chip:#cffafe;
  --ai:#0891b2;
  /* primary shades */
  --primary-50:#ecf4f6; --primary-100:#d4e6eb; --primary-200:#a3cad5;
  --primary-300:#6eacbc; --primary-400:#398da4; --primary-500:#0e7490;
  --primary-600:#0d647d; --primary-700:#0b556b; --primary-800:#0a4558; --primary-900:#093748;
  /* brand */
  --brand:#27a7e1; --brand-100:#d8effa; --brand-300:#7dcaed; --brand-700:#1c77a2;
  --radius:20px;
  --hero:linear-gradient(135deg,#0e7490,#0891b2 55%,#22d3ee);
  --font:'Tiro Bangla';
}
```

## JSON Tokens
```json
{
  "theme": "ocean",
  "name": "ওশান",
  "font": "Tiro Bangla",
  "radius": 20,
  "buttonShape": "soft",
  "buttonFill": "solid",
  "gradient": "diagonal",
  "gradientCss": "linear-gradient(135deg,#0e7490,#0891b2 55%,#22d3ee)",
  "icon": "emoji",
  "bgStyle": "soft",
  "cardStyle": "white",
  "entrance": "pop",
  "mode": "light",
  "colors": {
    "primary": "#0e7490",
    "primary2": "#22b8cf",
    "accent": "#155e75",
    "accent2": "#67e8f9",
    "income": "#14b8a6",
    "expense": "#fb7185",
    "bg1": "#ecfeff",
    "bg2": "#f0fdfa",
    "card": "#ffffff",
    "ink": "#083344",
    "muted": "#5f8a96",
    "chip": "#cffafe",
    "ai": "#0891b2"
  },
  "primaryShades": {
    "50": "#ecf4f6",
    "100": "#d4e6eb",
    "200": "#a3cad5",
    "300": "#6eacbc",
    "400": "#398da4",
    "500": "#0e7490",
    "600": "#0d647d",
    "700": "#0b556b",
    "800": "#0a4558",
    "900": "#093748"
  },
  "brandShades": {
    "50": "#eef8fd",
    "100": "#d8effa",
    "200": "#addef4",
    "300": "#7dcaed",
    "400": "#4eb7e6",
    "500": "#27a7e1",
    "600": "#228fc1",
    "700": "#1c77a2",
    "800": "#175f82",
    "900": "#134b67"
  }
}
```

> নোট: ব্র্যান্ড রং #27a7e1 — শেড: 50:#eef8fd  100:#d8effa  200:#addef4  300:#7dcaed  400:#4eb7e6  500:#27a7e1  600:#228fc1  700:#1c77a2  800:#175f82  900:#134b67
