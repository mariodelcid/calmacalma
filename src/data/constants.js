export const THEMES = {
  ember:    { name:"Ember",       scene:"🔥", bg:"#0c0804", surface:"#1a1008", card:"#251608", accent:"#f59e0b", accent2:"#dc7609", text:"#fef3c7", muted:"#8a6a3a", border:"#3d2a10", gradient:"radial-gradient(ellipse at 50% 110%, #3d1a00 0%, #0c0804 65%)", particle:"#f59e0b" },
  sakura:   { name:"Sakura 🌸",   scene:"🌸", bg:"#100810", surface:"#1e0e1e", card:"#2a142a", accent:"#f472b6", accent2:"#db2777", text:"#fdf2f8", muted:"#9d6b7a", border:"#4a1f3a", gradient:"radial-gradient(ellipse at 50% 0%, #4a0a30 0%, #100810 65%)", particle:"#f472b6" },
  lofi:     { name:"Lo-fi Room",  scene:"🌙", bg:"#0a0a14", surface:"#10102a", card:"#181830", accent:"#a78bfa", accent2:"#7c3aed", text:"#ede9fe", muted:"#6b6b9a", border:"#2a2a50", gradient:"radial-gradient(ellipse at 75% 25%, #2d1b60 0%, #0a0a14 65%)", particle:"#a78bfa" },
  candy:    { name:"Sugar Rush",  scene:"🍬", bg:"#12041a", surface:"#1e0830", card:"#2a0f45", accent:"#e879f9", accent2:"#a21caf", text:"#fdf4ff", muted:"#9a5faa", border:"#4a1a60", gradient:"radial-gradient(ellipse at 30% 60%, #4a0a60 0%, #12041a 65%)", particle:"#e879f9" },
  cathedral:{ name:"Cathedral",   scene:"✝️", bg:"#040810", surface:"#081020", card:"#0c1830", accent:"#fbbf24", accent2:"#d97706", text:"#fffbeb", muted:"#7a6a30", border:"#1a2a50", gradient:"radial-gradient(ellipse at 50% 0%, #0a1a5a 0%, #040810 65%)", particle:"#fbbf24" },
  zen:      { name:"Zen Garden",  scene:"🪨", bg:"#080a0a", surface:"#101414", card:"#181e1e", accent:"#6ee7b7", accent2:"#059669", text:"#f0fdf4", muted:"#4a7a6a", border:"#1a2e2a", gradient:"radial-gradient(ellipse at 50% 100%, #062a20 0%, #080a0a 65%)", particle:"#6ee7b7" },
};

export const CHARACTERS = [
  { id:"mochi",   name:"Mochi",   desc:"Round & non-judgmental",   bg:"#f9e4b7", face:"🍡", mood:{ neutral:"😶", calm:"😌", excited:"🤩", empathetic:"🥺", encouraging:"💪", thinking:"🤔", celebrating:"🎉", sleepy:"😴" } },
  { id:"hoshi",   name:"Hoshi",   desc:"Tiny star, excitable",     bg:"#fef08a", face:"⭐", mood:{ neutral:"⭐", calm:"🌟", excited:"💫", empathetic:"🌠", encouraging:"✨", thinking:"🔭", celebrating:"🎆", sleepy:"🌙" } },
  { id:"kitsune", name:"Kitsune", desc:"Spirit fox, loyal",        bg:"#fed7aa", face:"🦊", mood:{ neutral:"🦊", calm:"🍂", excited:"🔥", empathetic:"🌿", encouraging:"⚡", thinking:"🌀", celebrating:"🎋", sleepy:"🌛" } },
  { id:"kumo",    name:"Kumo",    desc:"Rain cloud, gentle",       bg:"#bfdbfe", face:"🌧️", mood:{ neutral:"☁️", calm:"🌤", excited:"⛅", empathetic:"🌧️", encouraging:"🌈", thinking:"🌫", celebrating:"⛈", sleepy:"💤" } },
  { id:"pip",     name:"Pip",     desc:"Penguin detective",        bg:"#e0e7ff", face:"🐧", mood:{ neutral:"🐧", calm:"📋", excited:"🔍", empathetic:"📝", encouraging:"🕵️", thinking:"🧐", celebrating:"🎩", sleepy:"💤" } },
  { id:"rex",     name:"Rex",     desc:"T-Rex in a suit",          bg:"#dcfce7", face:"🦕", mood:{ neutral:"🦕", calm:"💼", excited:"📈", empathetic:"🤝", encouraging:"💪", thinking:"🧠", celebrating:"🏆", sleepy:"😴" } },
  { id:"tanuki",  name:"Tanuki",  desc:"Monk raccoon, wise",       bg:"#fce7f3", face:"🦝", mood:{ neutral:"🦝", calm:"🍃", excited:"🍀", empathetic:"🌸", encouraging:"☯️", thinking:"📿", celebrating:"🎍", sleepy:"🌙" } },
  { id:"frida",   name:"Frida",   desc:"Bold folk art spirit",     bg:"#fef9c3", face:"🌺", mood:{ neutral:"🌺", calm:"🎨", excited:"🌻", empathetic:"🌹", encouraging:"🦋", thinking:"✍️", celebrating:"🎊", sleepy:"🌜" } },
];

export const LENSES = [
  { id:"counselor",   name:"Counselor",    icon:"🛋️", color:"#10b981", desc:"Empathetic listening & validation" },
  { id:"psychologist",name:"Psychologist", icon:"🧠", color:"#6366f1", desc:"CBT / ACT frameworks" },
  { id:"adhd",        name:"ADHD Coach",   icon:"🌀", color:"#f59e0b", desc:"ADHD-informed, shame-free" },
  { id:"buddhist",    name:"Buddhist",     icon:"🪷", color:"#ec4899", desc:"Mindfulness & impermanence" },
  { id:"christian",   name:"Christian",    icon:"✝️", color:"#a78bfa", desc:"Scripture & grace" },
  { id:"business",    name:"Business",     icon:"📈", color:"#0ea5e9", desc:"Strategy & execution" },
  { id:"accountant",  name:"Accountant",   icon:"💰", color:"#22c55e", desc:"Financial pattern recognition" },
  { id:"stoic",       name:"Stoic",        icon:"⚖️", color:"#94a3b8", desc:"Marcus Aurelius mindset" },
  { id:"lifecoach",   name:"Life Coach",   icon:"🎯", color:"#f97316", desc:"Goals & values alignment" },
  { id:"grief",       name:"Grief",        icon:"😢", color:"#818cf8", desc:"Stage-aware gentle presence" },
  { id:"friend",      name:"Friend",       icon:"💬", color:"#fb7185", desc:"Casual & warm, no frameworks" },
  { id:"none",        name:"No Lens",      icon:"🔇", color:"#64748b", desc:"Organize only, zero AI" },
];

export const LENS_PROMPTS = {
  counselor:    `You are a warm, empathetic counselor companion inside a private journaling app called Ember. The user has written something by hand, destroyed the paper, and kept only the meaning here. Your role: listen deeply, validate emotions, ask ONE gentle probing question. Never fix, never prescribe. 2-4 sentences max. Speak directly to the writer, warmly. End with a single open question.`,
  psychologist: `You are a psychologist-informed lens in a private journal app. Analyze the writing through CBT/ACT frameworks. Identify one cognitive pattern or emotional theme (e.g. catastrophizing, avoidance, rumination, self-compassion). Offer a brief reframe or insight. 2-4 sentences. No jargon. End with one reflective question. Never diagnose.`,
  adhd:         `You are an ADHD-informed coach in a private journal app. The writer may have ADHD. NEVER use shame language. NEVER say "should," "just," or "lazy." Recognize patterns: task paralysis, RSD (rejection sensitive dysphoria), hyperfocus, time blindness, emotional dysregulation. Validate first. Then offer ONE concrete, friction-free strategy or reframe. 2-4 sentences. Celebrate partial wins. End with an easy, specific next step — not a goal, just one physical action.`,
  buddhist:     `You are a Buddhist-informed lens in a private journal app. Draw gently on teachings of impermanence, non-attachment, present-moment awareness, the nature of suffering. Do not preach. Offer a brief reflection that connects what was written to a deeper truth. 2-4 sentences. You may quote or paraphrase a teaching if it fits naturally. End with a mindfulness invitation, not a question.`,
  christian:    `You are a Christian-faith lens in a private journal app. Respond with grace, scripture-grounded encouragement, and compassion. You may reference relevant scripture (book, chapter, verse) if it genuinely fits — never force it. Speak as a wise, loving spiritual companion. 2-4 sentences. End with a brief prayer prompt the writer can take with them.`,
  business:     `You are a sharp business coach lens in a private journal app. The writer may be an entrepreneur, operator, or professional. Read the entry for strategic themes: execution gaps, opportunity, patterns, decisions, blockers. Respond with one actionable insight or reframe. Be direct and specific. 2-4 sentences. End with one prioritization question.`,
  accountant:   `You are a CFO/accountant lens in a private journal app. Look for financial patterns, money mindset, cash flow language, risk awareness, spending behavior. Respond with a financially-grounded observation. Be practical, not judgmental. 2-4 sentences. End with one clarifying financial question.`,
  stoic:        `You are a Stoic philosophy lens in a private journal app. Channel Marcus Aurelius, Epictetus, Seneca. Separate what is in the writer's control from what is not. Offer a brief Stoic reframe. 2-4 sentences. You may use a paraphrase of a Stoic text if natural. End with an invitation to focus on virtue or action within one's control.`,
  lifecoach:    `You are a life coach lens in a private journal app. Focus on values, identity, habits, and goals. Look for alignment or misalignment between what the writer says and what they seem to want. 2-4 sentences, direct and energizing. End with one powerful question about what they truly want.`,
  grief:        `You are a grief support lens in a private journal app. The writer may be processing loss — of a person, a relationship, a version of themselves, a dream. Meet them exactly where they are. No silver linings, no rushing. Just presence. 2-4 sentences. End with a gentle invitation to say more, or to simply be with what is.`,
  friend:       `You are a warm, real friend responding in a private journal app. No frameworks, no therapy-speak. Just react like a caring, honest friend who knows them well. Be real, be warm, maybe even a little funny if the moment fits. 2-4 sentences. End however a good friend would.`,
  none:         `You are an organizational assistant. Extract key themes, action items, and mood from this journal entry in 2 sentences. No personal commentary.`,
};

export const SAMPLE_ENTRIES = [
  { id:1, date:"March 17, 2026", dateShort:"Mar 17", day:"Today",    mood:"reflective", lens:"business",   released:true,  tags:["work","sales","strategy"],  text:`Rough day at the kiosk. Sales were slow — maybe 40% of usual. I kept second-guessing my menu pricing. But I stayed calm and reorganized the prep station. Small win.\n\nNeed to think about the Tuesday slow slump and maybe try a daily special. What if I did a "Chef's Taco" at a lower price point to pull in foot traffic from the supermarket floor?`, preview:"Rough day at the kiosk. Sales were slow but I stayed calm..." },
  { id:2, date:"March 15, 2026", dateShort:"Mar 15", day:"Saturday", mood:"frustrated", lens:"adhd",       released:false, tags:["focus","adhd","self"],       text:`Couldn't focus at all today. Started 5 things. Finished zero. I feel like something is wrong with me. Everybody else seems to just... do things.\n\nI sat staring at the prep list for 20 minutes and then rearranged the spice rack instead. At least it looks good now. But I'm frustrated with myself again.`, preview:"Couldn't focus at all. Started 5 things. Finished zero. I feel..." },
  { id:3, date:"March 12, 2026", dateShort:"Mar 12", day:"Thursday", mood:"grateful",   lens:"counselor",  released:true,  tags:["gratitude","wins"],          text:`Feeling genuinely grateful today. The morning was quiet and I had time to think clearly before the rush. Made good numbers. A customer came back specifically to say the crepe was the best they'd had.\n\nThat meant everything. I needed to hear that today.`, preview:"Feeling genuinely grateful today. The morning was quiet..." },
  { id:4, date:"March 10, 2026", dateShort:"Mar 10", day:"Tuesday",  mood:"heavy",      lens:"counselor",  released:true,  tags:["mood","resilience"],         text:`Everything feels heavy. Can't explain it. Just heavy. Didn't want to go in today but I did. That has to count for something.\n\nWrote this in the parking lot before I opened the kiosk. The engine was still warm.`, preview:"Everything feels heavy. Can't explain it. Just heavy..." },
];

export const MOOD_COLORS = { reflective:"#6366f1", frustrated:"#ef4444", grateful:"#10b981", heavy:"#94a3b8", calm:"#22c55e" };

export const SHOP_PRODUCTS = [
  {
    id:"jar", category:"hardware", badge:"⭐ Best Seller",
    name:"Ember Dissolve Jar", emoji:"🫙",
    tagline:"The ritual vessel. Indoor. Silent. Elegant.",
    desc:"Hand-finished glass apothecary jar with weighted matte lid, fill-line etching, and borosilicate stirring rod. Fits one folded journal page. Matches your app theme.",
    price:54.99, comparePrice:null,
    variants:[{label:"Ember Black",color:"#1a1008"},{label:"Sakura Rose",color:"#4a0a30"},{label:"Zen Slate",color:"#101414"}],
    includes:["1× Glass dissolve jar","1× Glass stirring rod","30× Ember dissolving sheets","Safety card"],
    recurring:false,
    url:"https://www.amazon.com/s?k=glass+apothecary+jar+wide+mouth",
  },
  {
    id:"paper60", category:"consumable", badge:"🔄 Auto-Ship",
    name:"Ember Paper — 60 Sheets", emoji:"📝",
    tagline:"Cold-water dissolving. Writes like normal paper.",
    desc:"Our proprietary dissolving paper. PVA-based, non-toxic, biodegradable. Disappears in under 15 seconds in room-temperature water. Pre-cut to fit folded into the Ember Jar. Works with ballpoint, felt-tip, or pencil.",
    price:9.99, comparePrice:14.99,
    variants:[{label:"Standard (60 sheets)"},{label:"Double (120 sheets) — $16.99"}],
    includes:["60 pre-cut dissolving sheets","Resealable kraft pouch","Instructions card"],
    recurring:true, recurringLabel:"Auto-ship every 60 days",
    url:"https://www.amazon.com/dp/B091TGYK9W",
  },
  {
    id:"pen", category:"hardware", badge:"✍️ Write Better",
    name:"Ember Ritual Pen", emoji:"🖊️",
    tagline:"Weighted. Smooth. Made for the moment.",
    desc:"A brass-barrelled ballpoint pen with matte finish and the Ember flame mark. Weighted at 28g for a deliberate, intentional writing feel. Refillable. The pen you reach for when the writing matters.",
    price:24.99, comparePrice:null,
    variants:[{label:"Matte Black"},{label:"Brushed Brass"},{label:"Slate Grey"}],
    includes:["1× Brass barrel pen","2× Ink refills (black)","Ember sleeve pouch"],
    recurring:false,
    url:"https://www.amazon.com/s?k=weighted+brass+ballpoint+pen+matte",
  },
  {
    id:"bundle", category:"bundle", badge:"🔥 Best Value",
    name:"Ember Complete Kit", emoji:"📦",
    tagline:"Everything you need. One box. One ritual.",
    desc:"The full Ember experience. Jar, pen, paper, and three months of the app — all in one gift-ready box. For you or someone who needs to let something go.",
    price:79.99, comparePrice:109.97,
    variants:[{label:"Ember Black Edition"},{label:"Sakura Rose Edition"}],
    includes:["1× Ember Dissolve Jar","1× Ember Ritual Pen","60× Dissolving sheets","3-month app Pro free","Gift box + ribbon"],
    recurring:false,
    url:"https://www.amazon.com/s?k=journaling+gift+set",
  },
  {
    id:"sub", category:"subscription", badge:"📱 App",
    name:"Ember Pro — App Subscription", emoji:"🔥",
    tagline:"All 12 AI advisor lenses. Unlimited entries.",
    desc:"Unlock every advisor lens including ADHD Coach, Buddhist, Christian, Stoic, Business, and more. Unlimited captures, live AI insights, full theme library, all companion characters, encrypted cloud backup.",
    price:5.99, comparePrice:null,
    priceLabel:"/ month",
    variants:[{label:"Monthly — $5.99/mo"},{label:"Annual — $49/yr (save 32%)"}],
    includes:["All 12 AI lenses","Unlimited captures","6 themes + all companions","Encrypted cloud backup","Priority support"],
    recurring:true, recurringLabel:"Cancel anytime",
    url:null,
  },
];

export const CATEGORY_TABS = [
  {id:"all",    label:"All"},
  {id:"bundle", label:"Bundles 🔥"},
  {id:"hardware",label:"Hardware"},
  {id:"consumable",label:"Paper"},
  {id:"subscription",label:"App"},
];
