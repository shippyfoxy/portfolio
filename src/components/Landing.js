import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import socials from '../constants/socials';

// ─── RAW DATA (anonymized cohort retention demo) ─────────────────────────────
const RAW = [
  ["2026-02-05",0.06415,0.03019,0.01509,0.01509,0.00629,0.01132,0.00755,0.00881],
  ["2026-02-10",0.08714,0.03000,0.02857,0.02143,0.01286,0.01286,0.01000,0.00714],
  ["2026-02-15",0.08346,0.03035,0.02276,0.01214,0.00910,0.01669,0.01062,0.00152],
  ["2026-02-20",0.10268,0.03348,0.01116,0.01563,0.01339,0.00446,0.00670,0.01563],
  ["2026-02-25",0.06967,0.03689,0.02254,0.01230,0.01025,0.00410,0.01230,0.00615],
  ["2026-03-01",0.06333,0.03025,0.01040,0.00945,0.01134,0.01134,0.01040,0.00851],
  ["2026-03-06",0.09583,0.03542,0.02917,0.01250,0.00625,0.01250,0.01042,0.00417],
  ["2026-03-11",0.06349,0.03439,0.00794,0.02381,0.01852,0.01587,0.01852,0.01058],
  ["2026-03-16",0.07663,0.04023,0.01724,0.01149,0.00192,0.01341,0.01149,0.00575],
  ["2026-03-21",0.08182,0.02364,0.01818,0.00909,0.00909,0.00909,0.01091,0.00545],
  ["2026-03-26",0.06010,0.03125,0.00962,0.01683,0.01442,0.01202,0.00721,0.00240],
  ["2026-03-31",0.05808,0.01815,0.01089,0.00907,0.00726,0.00907,0.00544,0.00363],
  ["2026-04-05",0.07774,0.03357,0.01413,0.00707,0.00883,0.00883,0.00530,0.00177],
  ["2026-04-10",0.05804,0.03571,0.01563,0.01339,0.02009,0.01116,0.00446,0.00223],
  ["2026-04-15",0.06774,0.03871,0.01290,0.01613,0.01290,0.00968,0.00645,0.00323],
  ["2026-04-20",0.06268,0.05128,0.01709,0.01140,0.00570,0.01140,0.00570,null],
  ["2026-04-25",0.07852,0.02079,0.01386,0.01386,0.00693,0.01617,0.00462,null],
  ["2026-04-30",0.08458,0.04975,0.02985,0.02488,0.00498,null,null,null],
  ["2026-05-01",0.08481,0.02827,0.01060,0.00707,null,null,null,null],
  ["2026-05-02",0.10435,0.02319,0.01739,null,null,null,null,null],
  ["2026-05-03",0.07477,0.03037,null,null,null,null,null,null],
  ["2026-05-04",0.07942,null,null,null,null,null,null,null],
];

const trendData = RAW.map(r => ({
  date: r[0].slice(5),
  'Day 1': r[1] != null ? +(r[1]*100).toFixed(2) : null,
  'Day 2': r[2] != null ? +(r[2]*100).toFixed(2) : null,
  'Day 7': r[7] != null ? +(r[7]*100).toFixed(2) : null,
  'Day 14': r[8] != null ? +(r[8]*100).toFixed(2) : null,
}));

const avgCurve = [1,2,3,4,5,6,7,14].map((day, i) => {
  const vals = RAW.map(r => r[i+1]).filter(v => v != null);
  return { day: `D${day}`, avg: +(vals.reduce((a,b)=>a+b,0)/vals.length*100).toFixed(2) };
});

const weeklyD1 = [];
for (let i = 0; i < RAW.length; i += 4) {
  const slice = RAW.slice(i, i+4).filter(r => r[1] != null);
  if (!slice.length) continue;
  weeklyD1.push({ week: RAW[i][0].slice(5,10), d1: +(slice.reduce((a,r)=>a+r[1],0)/slice.length*100).toFixed(2) });
}

const d1v = RAW.map(r=>r[1]).filter(v=>v!=null);
const avgD1 = (d1v.reduce((a,b)=>a+b,0)/d1v.length*100).toFixed(1);
const d7v = RAW.map(r=>r[7]).filter(v=>v!=null);
const avgD7 = (d7v.reduce((a,b)=>a+b,0)/d7v.length*100).toFixed(1);
const d14v = RAW.map(r=>r[8]).filter(v=>v!=null);
const avgD14 = (d14v.reduce((a,b)=>a+b,0)/d14v.length*100).toFixed(1);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;600;700;800;900&family=Oswald:wght@500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#1a1410;
  --ink-soft:#2a2118;
  --cream:#f5efe0;
  --cream-2:#e8e0cc;
  --primary:#d81a1d;
  --primary-dark:#a01215;
  --gold:#e9b04d;
  --bg:#231f1a;
  --muted:#7a6f63;
}
body{
  background:var(--bg);
  font-family:'Inter',system-ui,sans-serif;
  color:var(--cream);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  font-feature-settings:'kern','liga','calt';
  font-variant-ligatures:common-ligatures;
  line-height:1.5;
}
.disp{font-family:'Bangers','Oswald',system-ui,sans-serif;letter-spacing:.02em;font-weight:400;}

.chunky{border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);}
.chunky-lg{border:4px solid var(--ink);box-shadow:10px 10px 0 0 var(--ink);}
.chunky-sm{border:3px solid var(--ink);box-shadow:4px 4px 0 0 var(--ink);}

.text-stroke{-webkit-text-stroke:2px var(--ink);paint-order:stroke fill;}
.text-stroke-lg{-webkit-text-stroke:4px var(--ink);paint-order:stroke fill;}

.bg-grid{
  background-image:
    linear-gradient(var(--ink) 1px, transparent 1px),
    linear-gradient(90deg, var(--ink) 1px, transparent 1px);
  background-size:40px 40px;
}
.bg-noise{
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.06) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0,0,0,0.18) 0%, transparent 50%);
}

/* HERO */
.hero{position:relative;overflow:hidden;border-bottom:3px solid var(--ink);background:var(--primary);}
.hero-grid{position:absolute;inset:0;opacity:.18;pointer-events:none;}
.hero-noise{position:absolute;inset:0;pointer-events:none;}
.hero-in{position:relative;max-width:1180px;margin:0 auto;padding:64px 24px 80px;display:grid;gap:40px;grid-template-columns:1.2fr 1fr;align-items:center;}
@media(max-width:860px){.hero-in{grid-template-columns:1fr;padding:48px 20px 56px;}}
.kicker{display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:var(--ink);padding:6px 16px;border-radius:9999px;font-family:'Bangers',sans-serif;font-size:.95rem;letter-spacing:.18em;border:3px solid var(--ink);box-shadow:4px 4px 0 0 var(--ink);width:fit-content;margin-bottom:18px;}
.htitle{font-family:'Bangers',sans-serif;color:var(--cream);font-size:clamp(2.6rem,7vw,5.5rem);line-height:.92;-webkit-text-stroke:3px var(--ink);paint-order:stroke fill;letter-spacing:.005em;}
.htitle .gold{color:var(--gold);}
.hsub{margin-top:22px;max-width:560px;color:var(--cream);font-weight:500;font-size:1.0625rem;line-height:1.55;letter-spacing:-.003em;}
.hctas{margin-top:28px;display:flex;gap:14px;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);font-family:'Bangers',sans-serif;font-size:1.15rem;letter-spacing:.08em;color:var(--ink);text-decoration:none;cursor:pointer;transition:transform .12s ease, box-shadow .12s ease;border-radius:12px;background:var(--cream);}
.btn:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 0 var(--ink);}
.btn-gold{background:var(--gold);}
.btn-cream{background:var(--cream);}
.btn-ink{background:var(--ink);color:var(--cream);}

/* avatar block */
.avwrap{position:relative;width:100%;max-width:360px;margin:0 auto;}
.avwrap::before{content:'';position:absolute;inset:-14px;border:3px solid var(--ink);background:var(--gold);border-radius:32px;transform:rotate(-3deg);box-shadow:10px 10px 0 0 var(--ink);}
.avcard{position:relative;border:3px solid var(--ink);background:linear-gradient(160deg,var(--cream),var(--cream-2));border-radius:32px;padding:24px;text-align:center;}
.avface{font-size:8rem;line-height:1;display:block;filter:drop-shadow(8px 8px 0 var(--ink));animation:bob 3.6s ease-in-out infinite;}
@keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.avtag{margin-top:14px;display:flex;justify-content:space-between;align-items:center;border:3px solid var(--ink);background:var(--cream);padding:8px 14px;border-radius:10px;font-family:'Bangers',sans-serif;letter-spacing:.12em;}
.avtag .ti{color:var(--ink);}
.avtag .tp{color:var(--primary);}

/* STATS STRIP */
.stats{background:var(--ink);border-bottom:3px solid var(--ink);}
.stats-in{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
@media(max-width:640px){.stats-in{grid-template-columns:repeat(2,1fr);}}
.stat{padding:32px 20px;text-align:center;border-right:1px solid rgba(245,239,224,.15);}
.stat:last-child{border-right:0;}
@media(max-width:640px){.stat{border-right:0;border-bottom:1px solid rgba(245,239,224,.15);}.stat:nth-child(2){border-right:0;}}
.stat-k{font-family:'Bangers',sans-serif;color:var(--gold);font-size:3rem;line-height:1;}
.stat-v{margin-top:6px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,239,224,.7);font-weight:700;}

/* NAV TABS */
.nav{max-width:1180px;margin:36px auto 0;padding:0 24px;display:flex;justify-content:center;flex-wrap:wrap;gap:12px;}
.nb{padding:10px 20px;border:3px solid var(--ink);box-shadow:4px 4px 0 0 var(--ink);font-family:'Bangers',sans-serif;font-size:1.1rem;letter-spacing:.1em;background:var(--cream);color:var(--ink);cursor:pointer;border-radius:10px;transition:transform .12s ease, box-shadow .12s ease;}
.nb:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 0 var(--ink);}
.nb.on{background:var(--primary);color:var(--cream);}

.wrap{max-width:1180px;margin:0 auto;padding:48px 24px 72px;}

/* SECTION HEADER */
.sh{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 0 32px;flex-wrap:wrap;}
.sh h2{font-family:'Bangers',sans-serif;font-size:clamp(2.2rem,4.5vw,3.4rem);color:var(--cream);letter-spacing:.015em;line-height:1;}
.sh h2 .accent{color:var(--primary);}
.sh p{max-width:380px;font-weight:500;color:#b8aea0;font-size:.9375rem;line-height:1.5;}

/* SKILLS GRID */
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;}
.sc{background:var(--cream);border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);border-radius:20px;padding:22px;transition:transform .15s ease, box-shadow .15s ease;}
.sc:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 0 var(--ink);}
.sc-icon{display:grid;place-items:center;width:50px;height:50px;border:3px solid var(--ink);background:var(--primary);color:var(--cream);border-radius:12px;font-size:1.4rem;}
.sc h3{font-family:'Bangers',sans-serif;font-size:1.5rem;color:var(--ink);margin-top:14px;letter-spacing:.02em;line-height:1.05;}
.sc p{margin-top:8px;color:rgba(26,20,16,.75);font-size:.9375rem;line-height:1.55;font-weight:400;letter-spacing:-.003em;}

/* PROJECTS */
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;}
.pc{background:var(--cream);border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);border-radius:20px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .15s ease, box-shadow .15s ease;display:flex;flex-direction:column;}
.pc.live{cursor:pointer;}
.pc.live:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 0 var(--ink);}
.pc.study{background:var(--cream-2);box-shadow:4px 4px 0 0 var(--ink);}
.pc-cta{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font-family:'Bangers',sans-serif;letter-spacing:.08em;color:var(--primary);font-size:.95rem;}
.pt{height:170px;background-size:cover;background-position:center;border-bottom:3px solid var(--ink);position:relative;background-color:var(--cream-2);}
.ptag{position:absolute;top:12px;left:12px;background:var(--primary);color:var(--cream);font-family:'Bangers',sans-serif;letter-spacing:.12em;font-size:.85rem;padding:4px 12px;border:3px solid var(--ink);border-radius:9999px;}
.pb{padding:18px 20px 20px;}
.pn{font-family:'Bangers',sans-serif;font-size:1.5rem;color:var(--ink);letter-spacing:.02em;line-height:1.05;}
.pmeta{margin-top:6px;color:rgba(26,20,16,.65);font-size:.8125rem;font-weight:500;letter-spacing:.01em;}
.prow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:14px;}
.pchip{background:var(--gold);color:var(--ink);font-family:'Bangers',sans-serif;letter-spacing:.08em;font-size:.85rem;padding:3px 10px;border:3px solid var(--ink);border-radius:9999px;}
.pchip.alt{background:var(--cream-2);}

/* TIMELINE / EXPERIENCE */
.tl{display:flex;flex-direction:column;gap:22px;}
.tc{background:var(--cream);border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);border-radius:20px;padding:22px;}
.tc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:8px;}
.tc-co{font-family:'Bangers',sans-serif;font-size:1.5rem;color:var(--ink);letter-spacing:.02em;line-height:1.05;}
.tc-r{color:var(--primary);font-weight:700;font-size:.875rem;margin-top:3px;letter-spacing:.005em;}
.tc-d{font-family:'Bangers',sans-serif;background:var(--ink);color:var(--cream);padding:4px 12px;border-radius:9999px;font-size:.82rem;letter-spacing:.14em;}
.tc-x{color:rgba(26,20,16,.78);font-size:.9375rem;line-height:1.6;font-weight:400;letter-spacing:-.003em;}

/* BADGES */
.bgg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px;}
.bd{background:var(--cream);border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);border-radius:20px;padding:18px;display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit;transition:transform .15s ease, box-shadow .15s ease;}
.bd:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 0 var(--ink);}
.bd-i{width:54px;height:54px;display:grid;place-items:center;border:3px solid var(--ink);border-radius:12px;font-size:1.6rem;flex-shrink:0;}
.bd-n{font-family:'Bangers',sans-serif;font-size:1.25rem;color:var(--ink);letter-spacing:.02em;line-height:1.05;}
.bd-s{margin-top:4px;font-size:.8125rem;color:rgba(26,20,16,.65);font-weight:500;letter-spacing:.005em;}

/* CONTACT */
.cbox{margin-top:48px;background:var(--gold);border:3px solid var(--ink);box-shadow:10px 10px 0 0 var(--ink);border-radius:24px;padding:34px;text-align:center;}
.ct{font-family:'Bangers',sans-serif;font-size:2.2rem;color:var(--ink);letter-spacing:.015em;line-height:1;}
.cs{margin-top:8px;color:rgba(26,20,16,.75);font-weight:500;font-size:.9375rem;line-height:1.55;}
.cbs{margin-top:22px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(26,20,16,.85);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px 40px;overflow-y:auto;}
.modal{width:100%;max-width:960px;background:var(--cream);border:4px solid var(--ink);box-shadow:10px 10px 0 0 var(--ink);border-radius:24px;overflow:hidden;}
.m-hero{background:var(--primary);color:var(--cream);padding:28px 28px 22px;border-bottom:3px solid var(--ink);position:relative;}
.m-close{position:absolute;top:16px;right:16px;background:var(--cream);color:var(--ink);border:3px solid var(--ink);width:40px;height:40px;border-radius:9999px;font-family:'Bangers',sans-serif;font-size:1.1rem;cursor:pointer;box-shadow:3px 3px 0 0 var(--ink);}
.m-tag{display:inline-block;background:var(--gold);color:var(--ink);font-family:'Bangers',sans-serif;letter-spacing:.14em;font-size:.85rem;padding:4px 12px;border:3px solid var(--ink);border-radius:9999px;margin-bottom:10px;}
.m-title{font-family:'Bangers',sans-serif;font-size:2rem;letter-spacing:.015em;line-height:1;}
.m-sub{margin-top:8px;font-weight:500;line-height:1.55;font-size:.9375rem;}
.m-body{padding:24px 28px 28px;}
.nda{background:#fff5d6;border:3px solid var(--ink);border-radius:14px;padding:12px 16px;margin-bottom:20px;font-weight:600;color:var(--ink);font-size:.875rem;line-height:1.5;letter-spacing:-.003em;}
.sr{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
@media(max-width:560px){.sr{grid-template-columns:repeat(2,1fr);}}
.sb{background:var(--cream-2);border:3px solid var(--ink);border-radius:14px;padding:14px;text-align:center;box-shadow:4px 4px 0 0 var(--ink);}
.sv{font-family:'Bangers',sans-serif;font-size:1.7rem;color:var(--primary);line-height:1;}
.slbl{margin-top:6px;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:rgba(26,20,16,.65);}
.charts{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
@media(max-width:700px){.charts{grid-template-columns:1fr;}}
.chart-card{background:var(--cream-2);border:3px solid var(--ink);border-radius:18px;padding:18px;box-shadow:4px 4px 0 0 var(--ink);}
.chart-card.full{grid-column:1/-1;}
.chart-title{font-family:'Bangers',sans-serif;font-size:1.2rem;color:var(--ink);letter-spacing:.02em;line-height:1.1;}
.chart-sub{font-size:.8125rem;color:rgba(26,20,16,.6);font-weight:500;margin-top:3px;margin-bottom:14px;line-height:1.45;}

/* TOAST */
.toast{position:fixed;bottom:26px;right:26px;z-index:9999;background:var(--gold);color:var(--ink);padding:14px 22px;border:3px solid var(--ink);box-shadow:6px 6px 0 0 var(--ink);font-family:'Bangers',sans-serif;letter-spacing:.08em;font-size:1rem;border-radius:12px;}
`;

const TABS = ['🏠 Home','💼 Experience','📊 Projects','🏅 Credentials'];

const HERO = {
  kicker: '✦ NOW QUESTING · LIBERTY PR',
  pre: 'I TURN ',
  mid: 'PLAYERS',
  bridge: ' INTO ',
  end: 'PATTERNS',
  tail: '.',
  sub: "Senior Data Analyst with 5+ years in enterprise analytics and firsthand Roblox platform fluency. I build retention models, run A/B experiments, and translate player behavior into product wins. Gaming, aerospace, and telecom.",
};

const STATS = [
  { k: '5+',   v: 'Years Analytics' },
  { k: '3',    v: 'Industries' },
  { k: '40%',  v: 'Targets Beaten' },
  { k: '1k+',  v: 'Structures Mapped' },
];

const skills = [
  { icon:'🎮', title:'Player Analytics', body:'Roblox platform expertise, player behavior analysis, retention metrics, game loop optimization, A/B experimentation.' },
  { icon:'🤖', title:'AI & Automation', body:'Workflows with Claude and Microsoft Copilot. Prompt engineering, automated reporting, and Power Automate playbook design.' },
  { icon:'📊', title:'Data & Strategy', body:'SQL, Power BI dashboard design, geospatial analysis (GIS), KPI monitoring, SAP and Oracle systems, data pipeline maintenance.' },
  { icon:'⚙️', title:'Process Improvement', body:'Workflow automation, SOP development, QA & compliance, multi team collaboration, and internal tooling documentation.' },
  { icon:'🌎', title:'Bilingual Edge', body:'Native English/Spanish proficiency. Expert in Puerto Rico market dynamics. Strategic bridge between executive leadership and field teams.' },
  { icon:'🛰️', title:'Geospatial Intelligence', body:'2D/3D spatial analysis for aerospace and defense. Refining geospatial data for critical mapping and logistics under regulated QA.' },
];

const projects = [
  {
    name:'Roblox Pulse',
    tag:'LIVE DEMO · ROBLOX',
    client:'Personal Project',
    desc:'Live analytics dashboard exploring Roblox platform data. Built start to finish as a working portfolio demo. Click through to interact.',
    chips:['Live Site','Roblox','Dashboard'],
    url:'https://project-ba-ten.vercel.app/',
  },
  {
    name:'Liberty Executive BI Dashboards',
    tag:'POWER BI · LIBERTY PR',
    client:'Liberty Puerto Rico',
    desc:'Designed and maintained dynamic executive dashboards in Power BI to analyze system data and recurring service failures, identifying root causes that drove process improvements and supported continuous operational decisions.',
    chips:['Power BI','SQL','Telecom'],
  },
  {
    name:'SAP Material Analysis Pipeline',
    tag:'SAP · UID ANALYSIS',
    client:'Liberty Puerto Rico',
    desc:'Extracted and analyzed material data from SAP, cross referencing UIDs to conduct price analysis, track material usage, and forecast projections. Beat fiscal and operational targets by 40%.',
    chips:['SAP','Forecasting','+40% Targets'],
  },
  {
    name:'AI Accelerated Reporting Workflows',
    tag:'CLAUDE · COPILOT',
    client:'Liberty Puerto Rico',
    desc:'Integrated AI tools (Claude, Microsoft Copilot) into daily reporting workflows to automate data interpretation, accelerate root cause analysis, and generate polished executive insights. Report turnaround time dropped significantly.',
    chips:['Claude','Copilot','Prompt Eng.'],
  },
  {
    name:'Power Automate Enterprise Playbooks',
    tag:'AUTOMATION · ORACLE',
    client:'Liberty Puerto Rico',
    desc:'Built automated playbooks and documented workflows using Power Automate to streamline reporting and cut inefficiencies. Adapted to Oracle systems to ensure live data integrity for business stakeholders.',
    chips:['Power Automate','Oracle','SOP'],
  },
  {
    name:'Maxar Geospatial QA Pipeline',
    tag:'GIS · AEROSPACE',
    client:'Maxar Technologies',
    desc:'Conducted broad spatial analysis of satellite data for 1,000+ aerospace and defense structures. Implemented Peer Reviewer QA workflows that cut rework time by 15% across highly regulated military contracts.',
    chips:['GIS','2D/3D','-15% Rework'],
  },
  {
    name:'Roblox Asset Pipeline Automation',
    tag:'C# · ROBLOX',
    client:'Firebit Dev. (Roblox)',
    desc:'Partnered with game developers to track asset delivery pipelines and implement C# scripting automation, cutting manual data entry and speeding delivery cycles. Managed broad digital libraries. Team communication improved and production rework dropped by 20%.',
    chips:['C#','Asset Ops','-20% Rework'],
  },
  {
    name:'Player Retention Dashboard',
    tag:'ANALYTICS DEMO',
    client:'Anonymized Cohort Data',
    desc:'Live dashboard tracking D1 through D14 cohort retention over 89 days. Real anonymized analytics data. Open the demo from the home tab to explore the charts.',
    chips:['Recharts','Cohorting','Live Demo'],
    onClick:'modal',
  },
];

const experience = [
  {
    company:'Liberty Puerto Rico',
    role:'Data Analyst / Business Systems Analyst (Contractor)',
    date:'SINCE APR 2025',
    location:'San Juan, PR',
    bullets:[
      'Recruited directly by the VP and Director of VPTO to expand scope from regional data analysis to company wide business systems analysis.',
      'Integrated Claude and Microsoft Copilot into daily reporting workflows to automate data interpretation and generate polished executive insights.',
      'Extracted and analyzed material data from SAP. Cross referenced UIDs for price analysis, usage tracking, and forecasting. Beat fiscal targets by 40%.',
      'Designed dynamic executive Power BI dashboards to analyze recurring service failures and surface root causes.',
      'Built Power Automate playbooks; adapted to Oracle systems to ensure live data integrity.',
      'Served as strategic bridge between executive leadership and field teams.',
    ],
  },
  {
    company:'Maxar Technologies Holdings Inc.',
    role:'GIS Data Analyst, Geospatial Intelligence & Quality',
    date:'MAR 2023 TO MAR 2025',
    location:'San Juan, PR',
    bullets:[
      'Conducted broad 2D/3D spatial analysis of satellite data for 1,000+ aerospace and defense structures.',
      'Implemented new QA workflows and compliance procedures as Peer Reviewer. Cut rework time by 15% across regulated military contracts.',
      'Prepared user guides and trained new analysts on complex spatial business systems.',
    ],
  },
  {
    company:'Firebit Dev. (Roblox)',
    role:'Technical Operations Coordinator',
    date:'DEC 2020 TO FEB 2023',
    location:'Remote',
    bullets:[
      'Worked directly within Roblox’s internal product and developer teams as a long time platform veteran. Operational analyst and engaged player perspective.',
      'Partnered with game developers to track asset delivery pipelines and implement C# scripting automation.',
      'Leveraged firsthand understanding of Roblox game loops, engagement patterns, and retention mechanics to support data driven content decisions.',
      'Managed broad digital libraries. Production rework dropped 20% through improved team coordination.',
    ],
  },
];

const badges = [
  {icon:'📊',name:'Google Data Analytics Professional Certificate',issuer:'Google',bg:'#d81a1d',color:'#f5efe0'},
  {icon:'🌍',name:'Going Places with Spatial Analysis',issuer:'ESRI',bg:'#e9b04d',color:'#1a1410'},
  {icon:'🔧',name:'Computer Repair and Technician Certificate',issuer:'Senator José Nadal Power Program',bg:'#1a1410',color:'#f5efe0'},
];

const education = [
  {icon:'🎮',name:'B.S. Video Game Design & Programming',issuer:'Atlantic University · Concentration in C# · 3 Years Completed',bg:'#d81a1d',color:'#f5efe0'},
  {icon:'💻',name:'Computer Engineering',issuer:'Polytechnic University of Puerto Rico · 1 Year Completed',bg:'#1a1410',color:'#f5efe0'},
];

const CONTACT = {
  email: 'eduardo_trabajos007@outlook.com',
  phone: '(787) 205 7014',
  location: 'San Juan, PR',
};

const LCOLS = {'Day 1':'#d81a1d','Day 2':'#a01215','Day 7':'#e9b04d','Day 14':'#1a1410'};

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:'#f5efe0',border:'3px solid #1a1410',borderRadius:10,padding:'10px 14px',fontFamily:'Inter,sans-serif',fontSize:'0.78rem',boxShadow:'4px 4px 0 0 #1a1410'}}>
      <div style={{color:'#1a1410',fontWeight:800,marginBottom:6}}>{label}</div>
      {payload.filter(p=>p.value!=null).map(p=>(
        <div key={p.name} style={{color:p.color,fontWeight:800,display:'flex',gap:14,justifyContent:'space-between'}}>
          <span>{p.name}</span><span>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

function RetentionModal({ onClose }) {
  return (
    <div className='overlay' onClick={e=>{ if(e.target.classList.contains('overlay')) onClose(); }}>
      <div className='modal'>
        <div className='m-hero'>
          <button className='m-close' onClick={onClose}>✕</button>
          <div className='m-tag'>📊 ANALYTICS DEMO</div>
          <div className='m-title'>PLAYER RETENTION DASHBOARD</div>
          <div className='m-sub'>Anonymized cohort retention over 89 days. D1 through D14 return rates across daily player cohorts.</div>
        </div>

        <div className='m-body'>
          <div className='nda'>🔒 Anonymized. Game name withheld. Real internal analytics tooling.</div>

          <div className='sr'>
            <div className='sb'><div className='sv'>{avgD1}%</div><div className='slbl'>AVG D1</div></div>
            <div className='sb'><div className='sv'>{avgD7}%</div><div className='slbl'>AVG D7</div></div>
            <div className='sb'><div className='sv'>{avgD14}%</div><div className='slbl'>AVG D14</div></div>
            <div className='sb'><div className='sv'>89</div><div className='slbl'>DAYS</div></div>
          </div>

          <div className='charts'>
            <div className='chart-card'>
              <div className='chart-title'>AVG RETENTION CURVE</div>
              <div className='chart-sub'>Player drop off, averaged across all cohorts.</div>
              <ResponsiveContainer width='100%' height={200}>
                <AreaChart data={avgCurve} margin={{top:4,right:6,left:-22,bottom:0}}>
                  <defs>
                    <linearGradient id='rg' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#d81a1d' stopOpacity={0.55}/>
                      <stop offset='95%' stopColor='#d81a1d' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#1a141033'/>
                  <XAxis dataKey='day' tick={{fill:'#1a1410',fontSize:11,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}}/>
                  <YAxis tick={{fill:'#1a1410',fontSize:10,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type='monotone' dataKey='avg' stroke='#d81a1d' fill='url(#rg)' strokeWidth={3} dot={{fill:'#d81a1d',r:4,strokeWidth:0}} name='Retention'/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className='chart-card'>
              <div className='chart-title'>D1 BY PERIOD</div>
              <div className='chart-sub'>Avg first day return rate across cohort windows.</div>
              <ResponsiveContainer width='100%' height={200}>
                <BarChart data={weeklyD1} margin={{top:4,right:6,left:-22,bottom:0}}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#1a141033'/>
                  <XAxis dataKey='week' tick={{fill:'#1a1410',fontSize:10,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}}/>
                  <YAxis tick={{fill:'#1a1410',fontSize:10,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey='d1' fill='#e9b04d' stroke='#1a1410' strokeWidth={2} radius={[4,4,0,0]} name='Day 1 Ret.'/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='chart-card full'>
              <div className='chart-title'>MULTI COHORT TREND. D1, D2, D7, D14</div>
              <div className='chart-sub'>Day by day retention across four windows (Feb to May 2026).</div>
              <ResponsiveContainer width='100%' height={240}>
                <LineChart data={trendData} margin={{top:4,right:16,left:-22,bottom:0}}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#1a141033'/>
                  <XAxis dataKey='date' tick={{fill:'#1a1410',fontSize:10,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}} interval={3}/>
                  <YAxis tick={{fill:'#1a1410',fontSize:10,fontFamily:'Inter',fontWeight:700}} axisLine={{stroke:'#1a1410'}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <Legend wrapperStyle={{fontFamily:'Inter',fontSize:'0.78rem',color:'#1a1410',fontWeight:700,paddingTop:10}}/>
                  {Object.entries(LCOLS).map(([k,c])=>(
                    <Line key={k} type='monotone' dataKey={k} stroke={c} strokeWidth={2.5} dot={false} connectNulls={false} activeDot={{r:5,strokeWidth:0}}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [tab,setTab] = useState(0);
  const [toast,setToast] = useState(null);
  const [modal,setModal] = useState(false);

  const show = msg => { setToast(msg); setTimeout(()=>setToast(null),2400); };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: S}} />

      {/* HERO */}
      <section className='hero'>
        <div className='hero-grid bg-grid'/>
        <div className='hero-noise bg-noise'/>
        <div className='hero-in'>
          <div>
            <div className='kicker'>{HERO.kicker}</div>
            <h1 className='htitle'>
              {HERO.pre}<span className='gold'>{HERO.mid}</span><br/>{HERO.bridge}<span className='gold'>{HERO.end}</span>{HERO.tail}
            </h1>
            <p className='hsub'>{HERO.sub}</p>
            <div className='hctas'>
              <button className='btn' style={{background:'#FFD600',color:'#000',fontSize:'1rem',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale'}} onClick={()=>setTab(2)}>VIEW PROJECTS →</button>
              <button className='btn btn-cream' style={{fontSize:'1rem',WebkitFontSmoothing:'antialiased',MozOsxFontSmoothing:'grayscale'}} onClick={()=>setModal(true)}>SEE DATA DEMO</button>
            </div>
          </div>

          <div className='avwrap'>
            <div className='avcard'>
              <span className='avface'>🦊</span>
              <div className='avtag'>
                <span className='ti'>LVL 99</span>
                <span className='tp'>DATA SAMURAI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className='stats'>
        <div className='stats-in'>
          {STATS.map(s => (
            <div key={s.v} className='stat'>
              <div className='stat-k'>{s.k}</div>
              <div className='stat-v'>{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TABS */}
      <nav className='nav'>
        {TABS.map((t,i) => (
          <button key={t} className={`nb${tab===i?' on':''}`} onClick={()=>setTab(i)}>{t}</button>
        ))}
      </nav>

      <main className='wrap'>

        {tab===0 && <>
          <div className='sh'>
            <h2>CLASS <span className='accent'>SKILLS</span></h2>
            <p>The toolkit I bring into every game studio raid.</p>
          </div>
          <div className='sg'>
            {skills.map(s => (
              <div key={s.title} className='sc'>
                <div className='sc-icon'>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div className='cbox'>
            <div className='ct'>RECRUIT ME</div>
            <div className='cs'>{CONTACT.location} · Open to full time, contract, and remote data analyst roles.</div>
            <div className='cbs'>
              <a className='btn btn-ink' href={`mailto:${CONTACT.email}`}>EMAIL →</a>
              <a className='btn btn-ink' href={`tel:+1${CONTACT.phone.replace(/\D/g,'')}`}>{CONTACT.phone}</a>
              <a
                className='btn btn-ink'
                href={socials.linkedin}
                target='_blank'
                rel='noopener noreferrer'
              >
                LINKEDIN →
              </a>
            </div>
          </div>
        </>}

        {tab===1 && <>
          <div className='sh'>
            <h2>QUEST <span className='accent'>LOG</span></h2>
            <p>Gaming, aerospace, and telecom. Where I&apos;ve built data systems.</p>
          </div>
          <div className='tl'>
            {experience.map((e,i) => (
              <div key={i} className='tc'>
                <div className='tc-top'>
                  <div>
                    <div className='tc-co'>{e.company}</div>
                    <div className='tc-r'>{e.role} · {e.location}</div>
                  </div>
                  <div className='tc-d'>{e.date}</div>
                </div>
                <ul className='tc-x' style={{paddingLeft:'1.25rem',listStyle:'disc'}}>
                  {e.bullets.map((b,j) => <li key={j} style={{marginTop:j===0?0:6}}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>}

        {tab===2 && <>
          {(() => {
            const demos = projects.filter(p => p.url || p.onClick === 'modal');
            const studies = projects.filter(p => !p.url && p.onClick !== 'modal');
            const renderInner = (p, ctaLabel) => (
              <>
                <div className='pt' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div className='ptag'>{p.tag}</div>
                </div>
                <div className='pb'>
                  <div className='pn'>{p.name}</div>
                  <div className='pmeta'>{p.client}</div>
                  <p style={{marginTop:10,color:'rgba(26,20,16,.78)',fontSize:'.92rem',lineHeight:1.5,fontWeight:500}}>{p.desc}</p>
                  <div className='prow'>
                    {p.chips.map(c => <div key={c} className='pchip alt'>{c}</div>)}
                  </div>
                  {ctaLabel && <div className='pc-cta'>{ctaLabel}</div>}
                </div>
              </>
            );
            return (
              <>
                <div className='sh'>
                  <h2>LIVE <span className='accent'>DEMOS</span></h2>
                  <p>Clickable, interactive. Built for this site or live in production.</p>
                </div>
                <div className='pg'>
                  {demos.map(p => p.url ? (
                    <a key={p.name} className='pc live' href={p.url} target='_blank' rel='noopener noreferrer'>
                      {renderInner(p,'OPEN LIVE SITE ↗')}
                    </a>
                  ) : (
                    <button
                      key={p.name}
                      className='pc live'
                      onClick={()=>setModal(true)}
                      style={{textAlign:'left',font:'inherit'}}
                    >
                      {renderInner(p,'OPEN DEMO →')}
                    </button>
                  ))}
                </div>

                <div className='sh' style={{marginTop:56}}>
                  <h2>CASE <span className='accent'>STUDIES</span></h2>
                  <p>Selected work from past roles. Not standalone artifacts. Just descriptions of what I shipped.</p>
                </div>
                <div className='pg'>
                  {studies.map(p => (
                    <div key={p.name} className='pc study'>
                      {renderInner(p)}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </>}

        {tab===3 && <>
          <div className='sh'>
            <h2>CERTIFICATIONS <span className='accent'>&amp; CREDS</span></h2>
            <p>Issued and verifiable.</p>
          </div>
          <div className='bgg'>
            {badges.map((b,i) => (
              <div key={i} className='bd' onClick={()=>show(`🏅 ${b.name}`)} style={{cursor:'pointer'}}>
                <div className='bd-i' style={{background:b.bg,color:b.color}}>{b.icon}</div>
                <div>
                  <div className='bd-n'>{b.name}</div>
                  <div className='bd-s'>{b.issuer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='sh' style={{marginTop:48}}>
            <h2>EDUCATION <span className='accent'>LOG</span></h2>
          </div>
          <div className='bgg'>
            {education.map((b,i) => (
              <div key={i} className='bd' style={{cursor:'default'}}>
                <div className='bd-i' style={{background:b.bg,color:b.color}}>{b.icon}</div>
                <div>
                  <div className='bd-n'>{b.name}</div>
                  <div className='bd-s'>{b.issuer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='sh' style={{marginTop:48}}>
            <h2>FIND <span className='accent'>ME</span></h2>
          </div>
          <div className='bgg'>
            <a className='bd' href={`mailto:${CONTACT.email}`}>
              <div className='bd-i' style={{background:'#d81a1d',color:'#f5efe0'}}>📧</div>
              <div>
                <div className='bd-n'>EMAIL</div>
                <div className='bd-s'>{CONTACT.email}</div>
              </div>
            </a>
            <a className='bd' href={`tel:+1${CONTACT.phone.replace(/\D/g,'')}`}>
              <div className='bd-i' style={{background:'#e9b04d',color:'#1a1410'}}>📞</div>
              <div>
                <div className='bd-n'>PHONE</div>
                <div className='bd-s'>{CONTACT.phone}</div>
              </div>
            </a>
            <a
              className='bd'
              href={socials.linkedin}
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='bd-i' style={{background:'#1a1410',color:'#f5efe0'}}>in</div>
              <div>
                <div className='bd-n'>LINKEDIN</div>
                <div className='bd-s'>{socials.linkedin.replace(/^https?:\/\//,'')}</div>
              </div>
            </a>
          </div>
        </>}

      </main>

      {modal && <RetentionModal onClose={()=>setModal(false)}/>}
      {toast && <div className='toast'>{toast}</div>}
    </>
  );
}
