# Antarious MSME — ডিজাইন টোকেন
নির্বাচিত মুড: অ্যান্টারিয়াস ব্লু (antarious)
তারিখ: ২/৬/২০২৬, ৭:২৯:০৪ PM

## নির্বাচন (Selections)
- ফন্ট: Baloo Da 2
- কর্নার রেডিয়াস: 20px
- বাটন আকৃতি / ফিল: rounded / gradient
- গ্রেডিয়েন্ট স্টাইল: diagonal
- আইকন স্টাইল: emoji
- ব্যাকগ্রাউন্ড / কার্ড: soft / white
- এন্ট্রান্স অ্যানিমেশন: slide
- মোড: light

## রং (Colors)
Primary    #27a7e1
Primary-2  #6fc4ec
Accent     #1f87b8
Accent-2   #a8dbf4
Income     #16b886
Expense    #ff5a78
Background #eef8fd → #f3fbff
Card       #ffffff
Ink (text) #0f3a52
Muted      #6b94a8
Chip       #d3edfa
AI accent  #1f87b8

## গ্রেডিয়েন্ট
linear-gradient(135deg,#27a7e1,#4fb8e8 55%,#8fd2f0)

## CSS Variables
```css
:root{
  --primary:#27a7e1;
  --primary-2:#6fc4ec;
  --accent:#1f87b8;
  --accent-2:#a8dbf4;
  --income:#16b886;
  --expense:#ff5a78;
  --bg-1:#eef8fd;
  --bg-2:#f3fbff;
  --card:#ffffff;
  --ink:#0f3a52;
  --muted:#6b94a8;
  --chip:#d3edfa;
  --ai:#1f87b8;
  /* primary shades */
  --primary-50:#eef8fd; --primary-100:#d8effa; --primary-200:#addef4;
  --primary-300:#7dcaed; --primary-400:#4eb7e6; --primary-500:#27a7e1;
  --primary-600:#228fc1; --primary-700:#1c77a2; --primary-800:#175f82; --primary-900:#134b67;
  /* brand */
  --brand:#27a7e1; --brand-100:#d8effa; --brand-300:#7dcaed; --brand-700:#1c77a2;
  --radius:20px;
  --hero:linear-gradient(135deg,#27a7e1,#4fb8e8 55%,#8fd2f0);
  --font:'Baloo Da 2';
}
```

## JSON Tokens
```json
{
  "theme": "antarious",
  "name": "অ্যান্টারিয়াস ব্লু",
  "font": "Baloo Da 2",
  "radius": 20,
  "buttonShape": "rounded",
  "buttonFill": "gradient",
  "gradient": "diagonal",
  "gradientCss": "linear-gradient(135deg,#27a7e1,#4fb8e8 55%,#8fd2f0)",
  "icon": "emoji",
  "bgStyle": "soft",
  "cardStyle": "white",
  "entrance": "slide",
  "mode": "light",
  "colors": {
    "primary": "#27a7e1",
    "primary2": "#6fc4ec",
    "accent": "#1f87b8",
    "accent2": "#a8dbf4",
    "income": "#16b886",
    "expense": "#ff5a78",
    "bg1": "#eef8fd",
    "bg2": "#f3fbff",
    "card": "#ffffff",
    "ink": "#0f3a52",
    "muted": "#6b94a8",
    "chip": "#d3edfa",
    "ai": "#1f87b8"
  },
  "primaryShades": {
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
