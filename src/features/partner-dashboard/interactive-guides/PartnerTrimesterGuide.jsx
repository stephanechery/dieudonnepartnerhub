import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#08090f", cream:"#EEE8DC", gold:"#C8A85A", rose:"#C4786A",
  sage:"#7AAE8A", teal:"#5A9EB8", lavender:"#9A88C0", slate:"#7A92B0",
  amber:"#D4924A", muted:"rgba(238,232,220,0.52)", faint:"rgba(238,232,220,0.28)",
  uterus:"#C4786A", placenta:"#B85870", bladder:"#5A9EB8",
  intestine:"#C8A85A", stomach:"#9A88C0", lung:"#7AAE8A",
  spine:"#8898B0", baby:"rgba(230,200,170,0.6)",
};

// ─── WEEK DATA ────────────────────────────────────────────────────────────────
// Returns anatomical parameters for any given week
function getWeekData(week) {
  // Uterus: starts small in pelvis, grows up abdominally
  // Week 6: ~plum size, Week 12: grapefruit (at pubic bone), Week 20: at navel, Week 36: below ribs
  const t = Math.min(week / 40, 1);
  const ut = Math.max(0, (week - 5) / 35); // uterus growth factor
  
  // Center Y of body SVG is ~250 (pelvis ~320, navel ~220, ribs ~140)
  // Uterus top Y (ascending from pelvis upward)
  const uterusCenterY = week < 12 ? 310 - ut * 20
    : week < 20 ? 310 - ut * 80
    : week < 28 ? 310 - ut * 120
    : 310 - ut * 150;
  
  const uterusRx = 12 + ut * 55;
  const uterusRy = 14 + ut * 70;

  // Bladder: pushed down/forward as uterus grows
  const bladderY = 330 + Math.min(week / 40, 1) * 18;
  const bladderRx = 18 - ut * 8;
  const bladderRy = 12 - ut * 5;

  // Stomach: pushed up in T3
  const stomachY = week < 28 ? 178 : 178 - (week - 28) * 1.4;

  // Diaphragm/lung bottom: pushed up
  const diaphragmY = week < 28 ? 155 : 155 - (week - 28) * 1.2;

  // Intestines: pushed up and lateral
  const intestineShift = Math.min(ut * 25, 25);

  // Baby opacity grows with week
  const babyOpacity = Math.max(0, Math.min(1, (week - 8) / 12));
  // Baby size
  const babyR = week < 12 ? 6 : week < 20 ? 10 + (week - 12) * 1.2 : week < 28 ? 20 + (week - 20) * 1.5 : 32 + (week - 28) * 0.8;

  // Posture: lordosis increases
  const lordosis = Math.min(week / 40, 1) * 14;

  return { uterusCenterY, uterusRx, uterusRy, bladderY, bladderRx, bladderRy,
    stomachY, diaphragmY, intestineShift, babyOpacity, babyR, lordosis, week };
}

// Trimester from week
function getTrimester(week) {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

// ─── SVG ANATOMY DIAGRAM ──────────────────────────────────────────────────────
function AnatomySVG({ week, hoveredOrgan, setHoveredOrgan, showLabels }) {
  const d = getWeekData(week);
  const W = 220, H = 480;
  const cx = W / 2;

  // Body outline path (simplified female torso from shoulders to mid-thigh)
  const bodyPath = `
    M ${cx-55} 60 
    Q ${cx-70} 90 ${cx-65} 130
    Q ${cx-70} 160 ${cx-60} 180
    Q ${cx-72} 220 ${cx-68} 260
    Q ${cx-75} 300 ${cx-70} 340
    Q ${cx-68} 380 ${cx-55} 420
    L ${cx+55} 420
    Q ${cx+68} 380 ${cx+70} 340
    Q ${cx+75} 300 ${cx+68} 260
    Q ${cx+72} 220 ${cx+60} 180
    Q ${cx+70} 160 ${cx+65} 130
    Q ${cx+70} 90 ${cx+55} 60
    Q ${cx+35} 50 ${cx} 52
    Q ${cx-35} 50 ${cx-55} 60 Z
  `;

  // Spine curve (with lordosis for later weeks)
  const spineD = `M ${cx + d.lordosis * 0.3} 65 
    Q ${cx + d.lordosis * 0.5} 150 ${cx + d.lordosis * 0.6} 220 
    Q ${cx + d.lordosis} 270 ${cx + d.lordosis * 0.8} 340
    Q ${cx + d.lordosis * 0.4} 380 ${cx} 420`;

  const isHov = (id) => hoveredOrgan === id;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: 220, display:"block" }}>
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2a2228"/>
          <stop offset="100%" stopColor="#1a1620"/>
        </radialGradient>
        <radialGradient id="uterusGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#D4907A"/>
          <stop offset="100%" stopColor="#A85848"/>
        </radialGradient>
        <radialGradient id="babyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(240,215,185,0.8)"/>
          <stop offset="100%" stopColor="rgba(210,175,145,0.5)"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="bodyClip">
          <path d={bodyPath}/>
        </clipPath>
      </defs>

      {/* Body outline */}
      <path d={bodyPath} fill="url(#bodyGrad)" stroke="rgba(238,232,220,0.15)" strokeWidth="1.5"/>

      {/* Ribcage */}
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx={cx} cy={108 + i * 14} rx={38 - i * 2} ry={7}
          fill="none" stroke="rgba(138,148,176,0.18)" strokeWidth="1.2"/>
      ))}

      {/* Spine */}
      <path d={spineD} fill="none" stroke={`${C.spine}40`} strokeWidth="3" strokeDasharray="4,3"/>

      {/* Lungs — visible but shrink upward in T3 */}
      <g onMouseEnter={()=>setHoveredOrgan("lung")} onMouseLeave={()=>setHoveredOrgan(null)} style={{cursor:"pointer"}}>
        <ellipse cx={cx-28} cy={d.diaphragmY - 22} rx={20} ry={30}
          fill={isHov("lung")?`${C.lung}55`:`${C.lung}30`} stroke={C.lung} strokeWidth={isHov("lung")?1.5:0.8}
          style={{transition:"all 0.4s ease"}}/>
        <ellipse cx={cx+28} cy={d.diaphragmY - 22} rx={20} ry={30}
          fill={isHov("lung")?`${C.lung}55`:`${C.lung}30`} stroke={C.lung} strokeWidth={isHov("lung")?1.5:0.8}
          style={{transition:"all 0.4s ease"}}/>
        {showLabels && <text x={cx+50} y={d.diaphragmY-22} fontSize="8" fill={C.lung} fontFamily="'DM Mono',monospace">Lungs</text>}
      </g>

      {/* Diaphragm line */}
      <path d={`M ${cx-55} ${d.diaphragmY} Q ${cx} ${d.diaphragmY+8} ${cx+55} ${d.diaphragmY}`}
        fill="none" stroke={`${C.sage}50`} strokeWidth="1.5" strokeDasharray="3,2"
        style={{transition:"all 0.5s ease"}}/>

      {/* Stomach */}
      <g onMouseEnter={()=>setHoveredOrgan("stomach")} onMouseLeave={()=>setHoveredOrgan(null)} style={{cursor:"pointer"}}>
        <ellipse cx={cx-20} cy={d.stomachY} rx={16} ry={10}
          fill={isHov("stomach")?`${C.stomach}55`:`${C.stomach}30`} stroke={C.stomach} strokeWidth={isHov("stomach")?1.5:0.8}
          style={{transition:"all 0.5s ease"}}/>
        {showLabels && <text x={cx-45} y={d.stomachY+4} fontSize="8" fill={C.stomach} fontFamily="'DM Mono',monospace" textAnchor="end">Stomach</text>}
      </g>

      {/* Intestines */}
      <g onMouseEnter={()=>setHoveredOrgan("intestines")} onMouseLeave={()=>setHoveredOrgan(null)} style={{cursor:"pointer"}}>
        {/* Coiled intestine representation */}
        {[-1,0,1].map(row => (
          [-1,0,1].map(col => (
            <ellipse key={`${row}-${col}`}
              cx={cx + col * 14 + (row % 2 === 0 ? 5 : -5)}
              cy={215 + row * 14 - d.intestineShift}
              rx={8} ry={5}
              fill={isHov("intestines")?`${C.intestine}45`:`${C.intestine}22`}
              stroke={`${C.intestine}${isHov("intestines")?"70":"40"}`}
              strokeWidth="0.8"
              style={{transition:"all 0.5s ease"}}/>
          ))
        ))}
        {showLabels && <text x={cx+52} y={215 - d.intestineShift} fontSize="8" fill={C.intestine} fontFamily="'DM Mono',monospace">Intestines</text>}
      </g>

      {/* Uterus */}
      <g onMouseEnter={()=>setHoveredOrgan("uterus")} onMouseLeave={()=>setHoveredOrgan(null)} style={{cursor:"pointer"}}
        filter={isHov("uterus")?"url(#glow)":""}>
        <ellipse cx={cx} cy={d.uterusCenterY} rx={d.uterusRx} ry={d.uterusRy}
          fill="url(#uterusGrad)"
          fillOpacity={isHov("uterus")?0.95:0.85}
          stroke={C.uterus} strokeWidth={isHov("uterus")?2:1.2}
          style={{transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)"}}/>
        {/* Cervix */}
        {d.uterusRy > 20 && (
          <ellipse cx={cx} cy={d.uterusCenterY + d.uterusRy + 5} rx={6} ry={6}
            fill={`${C.uterus}60`} stroke={C.uterus} strokeWidth="0.8"
            style={{transition:"all 0.6s ease"}}/>
        )}
        {showLabels && <text x={cx - d.uterusRx - 5} y={d.uterusCenterY + 3} fontSize="8" fill={C.uterus} fontFamily="'DM Mono',monospace" textAnchor="end">Uterus</text>}
      </g>

      {/* Baby (grows with weeks) */}
      {week >= 8 && (
        <g opacity={d.babyOpacity} style={{transition:"opacity 0.8s ease"}}>
          {/* Baby head */}
          <circle cx={cx + (week > 32 ? -5 : 0)} cy={d.uterusCenterY - d.babyR * 0.3}
            r={Math.min(d.babyR * 0.35, 16)}
            fill="url(#babyGrad)" stroke="rgba(230,200,170,0.4)" strokeWidth="0.8"
            style={{transition:"all 0.6s ease"}}/>
          {/* Baby body */}
          <ellipse cx={cx + (week > 32 ? -3 : 0)} cy={d.uterusCenterY + d.babyR * 0.2}
            rx={Math.min(d.babyR * 0.3, 14)} ry={Math.min(d.babyR * 0.45, 20)}
            fill="url(#babyGrad)" stroke="rgba(230,200,170,0.4)" strokeWidth="0.8"
            style={{transition:"all 0.6s ease"}}/>
        </g>
      )}

      {/* Placenta (appears week 10+) */}
      {week >= 10 && (
        <g onMouseEnter={()=>setHoveredOrgan("placenta")} onMouseLeave={()=>setHoveredOrgan(null)}
          style={{cursor:"pointer"}} opacity={Math.min((week-10)/6, 1)}>
          <ellipse cx={cx + d.uterusRx * 0.6} cy={d.uterusCenterY - d.uterusRy * 0.5}
            rx={Math.min(d.uterusRx * 0.4, 20)} ry={Math.min(d.uterusRy * 0.25, 12)}
            fill={`${C.placenta}60`} stroke={C.placenta} strokeWidth="0.8"
            style={{transition:"all 0.6s ease"}}/>
          {showLabels && <text x={cx + d.uterusRx + 5} y={d.uterusCenterY - d.uterusRy * 0.4} fontSize="8" fill={C.placenta} fontFamily="'DM Mono',monospace">Placenta</text>}
        </g>
      )}

      {/* Amniotic fluid hint */}
      {week >= 8 && d.uterusRy > 25 && (
        <ellipse cx={cx} cy={d.uterusCenterY} rx={d.uterusRx - 4} ry={d.uterusRy - 4}
          fill="rgba(90,158,184,0.08)" strokeWidth="0"
          style={{transition:"all 0.6s ease"}}/>
      )}

      {/* Bladder */}
      <g onMouseEnter={()=>setHoveredOrgan("bladder")} onMouseLeave={()=>setHoveredOrgan(null)} style={{cursor:"pointer"}}>
        <ellipse cx={cx} cy={d.bladderY} rx={d.bladderRx} ry={d.bladderRy}
          fill={isHov("bladder")?`${C.bladder}50`:`${C.bladder}28`}
          stroke={C.bladder} strokeWidth={isHov("bladder")?1.5:0.8}
          style={{transition:"all 0.5s ease"}}/>
        {showLabels && <text x={cx + d.bladderRx + 5} y={d.bladderY+3} fontSize="8" fill={C.bladder} fontFamily="'DM Mono',monospace">Bladder</text>}
      </g>

      {/* Pelvic floor */}
      <path d={`M ${cx-52} 365 Q ${cx} ${370 + week*0.15} ${cx+52} 365`}
        fill="none" stroke={`${C.rose}45`} strokeWidth="2" strokeDasharray="3,2"/>
      {showLabels && <text x={cx} y={390} fontSize="7.5" fill={`${C.rose}80`} fontFamily="'DM Mono',monospace" textAnchor="middle">Pelvic Floor</text>}

      {/* Week indicator */}
      <text x={cx} y={H-8} textAnchor="middle" fontSize="9" fill="rgba(238,232,220,0.35)" fontFamily="'DM Mono',monospace">
        Week {week} · {getTrimester(week) === 1 ? "T1" : getTrimester(week) === 2 ? "T2" : "T3"}
      </text>
    </svg>
  );
}

// ─── ORGAN DATA ───────────────────────────────────────────────────────────────
const organInfo = {
  uterus: { label:"Uterus", color:C.uterus, icon:"🫀",
    desc:"The uterus begins pregnancy as a small, pear-shaped pelvic organ weighing about 60g. By full term it weighs approximately 1,100g — an 18× increase — and has risen from the pelvis to just below the rib cage.",
    sensations:["Cramping or 'growing pains' in early pregnancy","Round ligament pain as uterus rises into abdomen","Braxton Hicks contractions in T2-T3","Heaviness and pressure increasing throughout"] },
  placenta: { label:"Placenta", color:C.placenta, icon:"🌙",
    desc:"The placenta develops from the same cells as the embryo and becomes the primary producer of progesterone and estrogen by Week 10. It transfers oxygen, nutrients, and hormones to the baby while removing waste products.",
    sensations:["No direct sensations from the placenta itself","Its hormone production drives nausea (hCG peak = Week 10)","Placental growth correlates with uterine stretching feelings"] },
  bladder: { label:"Bladder", color:C.bladder, icon:"💧",
    desc:"In the first trimester, the growing uterus presses directly on the bladder from above. In the third trimester, the baby's head descends and compresses it further — explaining the return of urinary frequency after a relatively comfortable second trimester.",
    sensations:["Increased urinary frequency throughout T1","Relative relief in T2 as uterus rises above bladder","Return of urgency and frequency in T3 as baby descends","Leaking with coughing or sneezing (stress incontinence)"] },
  intestines: { label:"Intestines", color:C.intestine, icon:"🌀",
    desc:"Progesterone relaxes smooth muscle throughout the body — including the intestines. This slows peristalsis (bowel movement) and is responsible for pregnancy constipation. By the third trimester, intestines have been displaced upward and laterally by as much as 15cm.",
    sensations:["Constipation and bloating throughout pregnancy","Gas and cramping as intestines slow","Reduced appetite in T3 as stomach is compressed","Heartburn as stomach is pushed upward"] },
  stomach: { label:"Stomach", color:C.stomach, icon:"🫁",
    desc:"By the third trimester, the uterus pushes the stomach upward into the thoracic cavity, reducing its capacity and pushing stomach acid into the esophagus. This is why heartburn peaks in the third trimester regardless of diet.",
    sensations:["Heartburn and acid reflux (peaks T3)","Feeling full after small meals","Nausea in T1 driven by hCG (different mechanism)","Relief of heartburn when baby drops (lightening)"] },
  lung: { label:"Lungs", color:C.sage, icon:"🫧",
    desc:"The diaphragm is pushed upward by up to 4cm in late pregnancy, reducing lung volume by about 20%. Despite this, oxygen uptake actually increases because progesterone drives deeper breathing (hyperventilation). Many pregnant people feel breathless on exertion.",
    sensations:["Shortness of breath on exertion (normal in T3)","Deep sighing as progesterone raises breathing drive","Difficulty breathing deeply when lying flat","Relief at 'lightening' when baby drops into pelvis"] },
};

// ─── HORMONE DATA ─────────────────────────────────────────────────────────────
const hormones = [
  { id:"hcg", name:"hCG", full:"Human Chorionic Gonadotropin", color:C.rose, icon:"🌊",
    source:"Trophoblast cells → Placenta", peak:"Weeks 8–10, then declines",
    role:"Maintains the corpus luteum in early pregnancy, sustaining progesterone production until the placenta takes over. Also suppresses the immune system to prevent rejection of the embryo.",
    body:["Triggers nausea and vomiting (morning sickness)","Stimulates thyroid hormone production","Drives breast tenderness","Detectable in urine pregnancy tests from ~10 days post-conception"],
    curve:[5,25,80,100,80,55,35,22,18,15,14,13],
  },
  { id:"progesterone", name:"Progesterone", full:"Progesterone", color:C.amber, icon:"🌙",
    source:"Corpus luteum → Placenta (from Week 10)", peak:"Rises throughout, peaks at term",
    role:"Maintains uterine lining, prevents contractions, supports implantation. Relaxes smooth muscle throughout the body — including the uterus, intestines, and blood vessels.",
    body:["Deep fatigue and sleepiness","Constipation and bloating (slows intestinal motility)","Relaxes pelvic joints and ligaments","Emotional sensitivity","Breast tenderness and growth"],
    curve:[5,10,20,35,45,55,62,70,76,82,88,95],
  },
  { id:"estrogen", name:"Estrogen", full:"Estrogen (Estriol)", color:C.sage, icon:"🌿",
    source:"Ovaries → Placenta (in collaboration with fetal adrenal glands)", peak:"Rises throughout, peaks at term",
    role:"Drives uterine growth, stimulates blood vessel development, promotes breast changes, and regulates other hormones. Essential for fetal organ development.",
    body:["Uterine muscle growth (myometrial hypertrophy)","Increased blood volume and circulation","'Pregnancy glow' — increased blood flow to skin","Spider veins and varicose veins","Heightened sense of smell","Pigmentation changes (linea nigra, melasma)"],
    curve:[3,7,14,22,32,42,52,61,70,78,85,95],
  },
  { id:"relaxin", name:"Relaxin", full:"Relaxin", color:C.teal, icon:"💫",
    source:"Corpus luteum → Placenta", peak:"Weeks 10–14, then smaller rise near term",
    role:"Loosens ligaments and joints throughout the body — particularly the pubic symphysis and sacroiliac joints — to prepare the pelvis for delivery.",
    body:["Pelvic girdle pain and instability","Hypermobility in all joints","Risk of overstretching during exercise","Low back pain and waddling gait","Loosening of feet arches (permanent in some cases)"],
    curve:[10,60,80,100,65,50,42,40,42,45,55,80],
  },
  { id:"oxytocin", name:"Oxytocin", full:"Oxytocin", color:C.lavender, icon:"💗",
    source:"Hypothalamus (stored in posterior pituitary)", peak:"Pulses during labor and breastfeeding",
    role:"Drives uterine contractions during labor. Released in pulses rather than continuously. Peaks dramatically during birth and with breastfeeding.",
    body:["Braxton Hicks contractions in T3","Uterine contractions driving labor","Milk let-down reflex during breastfeeding","Bonding and maternal attachment","Pain threshold elevation during labor"],
    curve:[5,5,6,6,7,8,8,9,10,12,20,55],
  },
];

// ─── POSTURE DATA ─────────────────────────────────────────────────────────────
const postureChanges = [
  { label:"Lumbar Lordosis", icon:"🔄", color:C.amber,
    what:"The lower back curves inward more deeply as the growing uterus shifts the center of gravity forward. This lordotic curve compensates for anterior weight.",
    sensation:"Lower back ache and fatigue, especially after prolonged standing",
    week:"Begins T2, peaks T3" },
  { label:"Thoracic Kyphosis", icon:"↩️", color:C.slate,
    what:"The upper back may round forward as breast weight increases and the body compensates for lumbar lordosis. Shoulders often roll inward.",
    sensation:"Upper back and neck tension, shoulder discomfort",
    week:"Worsens progressively" },
  { label:"Center of Gravity", icon:"⚖️", color:C.rose,
    what:"As the uterus grows anteriorly, the center of gravity shifts forward. The body compensates by leaning back slightly and widening the stance.",
    sensation:"Balance changes, waddling gait, increased fall risk",
    week:"Significant from Week 24 onward" },
  { label:"Pelvic Tilt", icon:"↔️", color:C.sage,
    what:"Relaxin loosens the pubic symphysis and sacroiliac joints. Combined with the anterior weight, the pelvis tilts forward (anterior pelvic tilt), flaring the tailbone backward.",
    sensation:"Pelvic girdle pain, hip discomfort, difficulty walking",
    week:"T2 onset, T3 peak" },
  { label:"Rib Flare", icon:"⬆️", color:C.teal,
    what:"The ribcage expands laterally (up to 10cm in circumference) to accommodate the elevated diaphragm and increased respiratory demands. The lower ribs flare outward.",
    sensation:"Rib pain and tenderness, especially on the right side in late pregnancy",
    week:"T3 primarily" },
];

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const quizzes = [
  { q:"By full term, the uterus has grown to approximately how many times its pre-pregnancy weight?", options:["3× heavier","10× heavier","18× heavier","50× heavier"], correct:2, exp:"The uterus grows from approximately 60g before pregnancy to 1,100g at full term — about 18 times its original weight. This represents one of the most dramatic organ growth events in human biology." },
  { q:"Why does urinary frequency return in the third trimester after improving in the second trimester?", options:["hCG levels rise again","The baby's head descends and compresses the bladder","Progesterone relaxes the bladder more","Water retention increases pressure"], correct:1, exp:"In the second trimester, the uterus rises above the bladder providing temporary relief. In the third trimester, the baby begins to descend (engage) into the pelvis, directly compressing the bladder again and causing the return of urinary urgency and frequency." },
  { q:"Which hormone is primarily responsible for pregnancy constipation?", options:["hCG","Relaxin","Oxytocin","Progesterone"], correct:3, exp:"Progesterone relaxes smooth muscle throughout the body — including the intestinal walls. This slows peristalsis (the wave-like muscle contractions that move food through the bowel), resulting in constipation, bloating, and gas throughout pregnancy." },
  { q:"Relaxin's primary anatomical role during pregnancy is:", options:["Growing the uterus","Loosening joints and ligaments throughout the body","Triggering nausea","Increasing blood volume"], correct:1, exp:"Relaxin softens and loosens the ligaments and joints of the pelvis (particularly the pubic symphysis and sacroiliac joints) to prepare for delivery. Its effects are systemic — it loosens all joints in the body, not just the pelvis — which is why joint hypermobility and pelvic girdle pain are common pregnancy experiences." },
  { q:"Why does lung capacity decrease in late pregnancy even though breathing rate increases?", options:["The baby pushes on the throat","The diaphragm is displaced upward by up to 4cm","Blood steals oxygen from the lungs","Progesterone constricts the airways"], correct:1, exp:"The growing uterus pushes the diaphragm upward by 3–4cm, reducing the total volume available for lung expansion. Despite this, progesterone stimulates deeper breathing, so oxygen delivery actually increases. The subjective feeling of breathlessness comes from the reduced mechanical room for lung expansion, not from reduced oxygen." },
];

// ─── TRIMESTER SUMMARY DATA ───────────────────────────────────────────────────
const trimesterData = {
  1: {
    color:C.sage, weeks:"Weeks 1–13", icon:"🌱", name:"First Trimester",
    headline:"The foundational transformation — invisible externally, extraordinary internally",
    changes:["Uterus grows from plum to grapefruit size, still within the pelvis","hCG doubles every 48 hours, driving nausea in 70–80% of pregnancies","Placenta begins forming and takes over hormone production by Week 10","Blood volume begins increasing (will ultimately rise 50% by term)","Corpus luteum maintains progesterone until placenta is ready","All major fetal organs are forming — most vulnerable period for teratogens"],
    sensations:["Nausea and vomiting (peak Weeks 8–10)","Profound fatigue from progesterone surge","Breast tenderness and growth","Frequent urination as uterus presses on bladder","Heightened sense of smell"],
    doula:"The T1 client's visible body may not reflect the enormity of their physiological experience. Nausea, fatigue, and hormonal overwhelm are clinical realities. Validate what they're feeling — it is biologically justified."
  },
  2: {
    color:C.teal, weeks:"Weeks 14–27", icon:"🌸", name:"Second Trimester",
    headline:"The visible expansion — energy returns, anatomy reveals its work",
    changes:["Uterus enters the abdominal cavity, rising to the navel by Week 20","hCG drops, typically relieving first trimester nausea","Intestines begin to shift upward and laterally","Bladder pressure temporarily relieves as uterus rises above it","Relaxin loosens pelvic ligaments — round ligament pain common","Cardiac output increases by 40–50% — heart is working significantly harder"],
    sensations:["'Quickening' — first fetal movements felt (Weeks 16–22)","Round ligament pain as uterus stretches into abdomen","Heartburn begins as stomach starts shifting","Nasal congestion from increased blood flow","Skin changes: linea nigra, stretch marks may appear","Improved energy for most people"],
    doula:"T2 is when the pregnancy becomes physically visible and emotionally real for many families. Positioning, movement, and comfort support become relevant as the body changes. Watch for round ligament pain and help clients understand it is normal — not a warning sign."
  },
  3: {
    color:C.rose, weeks:"Weeks 28–40", icon:"🌟", name:"Third Trimester",
    headline:"Maximum occupation — every organ system at capacity",
    changes:["Uterus reaches the base of the ribcage by Week 36","Diaphragm elevated 4cm — lung capacity reduced by ~20%","Stomach compressed — heartburn, reflux, and early satiety peak","Intestines maximally displaced upward and laterally","Baby engages into the pelvis in late T3 ('lightening') — relieving diaphragm, worsening bladder pressure","Relaxin preparing pubic symphysis and cervix for delivery"],
    sensations:["Shortness of breath on exertion","Heartburn regardless of diet","Urinary urgency and frequency returns","Pelvic pressure and heaviness","Difficulty lying flat (aortocaval compression)","Sleep disruption from all of the above","Relief at lightening — breathing improves, heartburn reduces"],
    doula:"T3 is when physical discomfort is most significant. Understanding what's causing each symptom allows you to explain, normalize, and support. Heartburn = stomach compression, not diet failure. Breathlessness = diaphragm elevation, not unfitness. Knowledge is the most powerful comfort tool."
  }
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const navItems = [
  {id:"explorer",label:"Trimester Explorer",short:"Explorer",icon:"🔬"},
  {id:"organs",label:"Organ Shifting",short:"Organs",icon:"🫁"},
  {id:"hormones",label:"Hormones",short:"Hormones",icon:"🧪"},
  {id:"posture",label:"Posture & Spine",short:"Posture",icon:"🦴"},
  {id:"summaries",label:"Trimester Summaries",short:"Summaries",icon:"📋"},
  {id:"quiz",label:"Knowledge Check",short:"Quiz",icon:"📚"},
];

// ─── MINI HORMONE CHART ───────────────────────────────────────────────────────
function HormoneSparkline({ curve, color }) {
  const W = 120, H = 32, pad = 4;
  const maxV = Math.max(...curve);
  const pts = curve.map((v, i) => [
    pad + (i / (curve.length - 1)) * (W - pad * 2),
    H - pad - ((v / maxV) * (H - pad * 2))
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" opacity="0.85"/>
      <path d={`${d} L ${pts[pts.length-1][0]} ${H} L ${pts[0][0]} ${H} Z`}
        fill={color} opacity="0.1"/>
    </svg>
  );
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

function ExplorerSection() {
  const [week, setWeek] = useState(8);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const trimester = getTrimester(week);
  const organ = hoveredOrgan ? organInfo[hoveredOrgan] : null;
  const td = trimesterData[trimester];

  return (
    <div>
      {/* Week slider */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
          <div>
            <span style={{fontSize:22,fontFamily:"'Cormorant Garamond',serif",color:td.color}}>{td.icon} Week {week}</span>
            <span style={{fontSize:11,color:td.color,fontFamily:"'DM Mono',monospace",marginLeft:10}}>{td.name}</span>
          </div>
          <button onClick={()=>setShowLabels(l=>!l)} style={{
            background:showLabels?"rgba(238,232,220,0.1)":"rgba(238,232,220,0.04)",
            border:"1px solid rgba(238,232,220,0.15)",borderRadius:20,padding:"4px 12px",
            color:C.muted,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer",
          }}>
            {showLabels ? "Hide Labels" : "Show Labels"}
          </button>
        </div>
        <div style={{position:"relative",padding:"0 4px"}}>
          <input type="range" min={4} max={40} value={week} onChange={e=>setWeek(Number(e.target.value))}
            style={{width:"100%",accentColor:td.color,cursor:"pointer",height:4}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            {["4w","T1","T2","T3","40w"].map((l,i)=>(
              <span key={i} style={{fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace"}}>{l}</span>
            ))}
          </div>
          {/* Trimester markers */}
          <div style={{display:"flex",position:"relative",height:3,marginTop:2}}>
            {[{w:0,c:C.sage},{w:33,c:C.teal},{w:60,c:C.rose}].map((seg,i)=>(
              <div key={i} style={{flex:i===0?33:i===1?27:40,height:3,background:`${seg.c}50`,borderRadius:2}}/>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
        {/* SVG Diagram */}
        <div style={{flex:"0 0 auto",display:"flex",justifyContent:"center"}}>
          <div style={{background:"rgba(20,15,25,0.6)",borderRadius:18,padding:16,border:`1px solid ${td.color}25`}}>
            <AnatomySVG week={week} hoveredOrgan={hoveredOrgan} setHoveredOrgan={setHoveredOrgan} showLabels={showLabels}/>
          </div>
        </div>

        {/* Info panel */}
        <div style={{flex:"1 1 260px"}}>
          {organ ? (
            <div style={{background:`${organ.color}0e`,border:`1px solid ${organ.color}30`,borderRadius:16,padding:18}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:24}}>{organ.icon}</span>
                <div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",color:organ.color,margin:0,fontSize:20}}>{organ.label}</h3>
                  <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace"}}>HOVER OR CLICK TO EXPLORE</div>
                </div>
              </div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:14}}>{organ.desc}</p>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8}}>PHYSICAL SENSATIONS</div>
              {organ.sensations.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:organ.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{background:`${td.color}0e`,border:`1px solid ${td.color}25`,borderRadius:14,padding:16,marginBottom:14}}>
                <div style={{fontSize:10,color:td.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:6}}>{td.weeks}</div>
                <p style={{fontSize:13,color:"rgba(238,232,220,0.72)",lineHeight:1.65,margin:0,fontStyle:"italic"}}>{td.headline}</p>
              </div>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>KEY CHANGES AT WEEK {week}</div>
              {td.changes.slice(0,4).map((ch,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:td.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{ch}</span>
                </div>
              ))}
              <div style={{marginTop:16,background:"rgba(238,232,220,0.04)",border:"1px solid rgba(238,232,220,0.08)",borderRadius:10,padding:12}}>
                <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>👆 HOVER OVER THE DIAGRAM</div>
                <p style={{fontSize:12,color:C.faint,lineHeight:1.5,margin:0}}>Hover over any organ in the anatomical diagram to see how it is affected at this stage of pregnancy.</p>
              </div>
            </div>
          )}

          {/* Uterus size indicator */}
          <div style={{marginTop:14,background:"rgba(196,120,106,0.08)",border:"1px solid rgba(196,120,106,0.2)",borderRadius:12,padding:12}}>
            <div style={{fontSize:10,color:C.uterus,fontFamily:"'DM Mono',monospace",marginBottom:6}}>🫀 UTERUS SIZE AT WEEK {week}</div>
            <div style={{fontSize:13,color:C.muted}}>
              {week <= 6 ? "Pea to grape (in pelvis)" :
               week <= 8 ? "Plum size (in pelvis)" :
               week <= 10 ? "Large orange (in pelvis)" :
               week <= 12 ? "Grapefruit (at pubic bone)" :
               week <= 16 ? "Avocado to mango (low abdomen)" :
               week <= 20 ? "Cantaloupe (at the navel)" :
               week <= 24 ? "Large cantaloupe (above navel)" :
               week <= 28 ? "Coconut (well above navel)" :
               week <= 32 ? "Head of cabbage (upper abdomen)" :
               week <= 36 ? "Large watermelon (below ribs)" :
               "Full watermelon (fundus at ribs)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgansSection() {
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [compareWeek, setCompareWeek] = useState(12);
  const org = selectedOrgan ? organInfo[selectedOrgan] : null;

  const organs = [
    {id:"bladder", label:"Bladder", desc:"Compressed early and late"},
    {id:"intestines", label:"Intestines", desc:"Shifted upward 15cm"},
    {id:"stomach", label:"Stomach", desc:"Pushed into thorax"},
    {id:"lung", label:"Lungs", desc:"Reduced capacity 20%"},
    {id:"uterus", label:"Uterus", desc:"18× weight increase"},
  ];

  return (
    <div>
      <div style={{background:"rgba(90,158,184,0.07)",border:"1px solid rgba(90,158,184,0.18)",borderRadius:12,padding:14,marginBottom:20}}>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>As the uterus grows from the pelvis to the ribcage, every surrounding organ must adapt. This is one of the most remarkable aspects of pregnancy physiology — the body reorganizes its internal architecture to accommodate new life.</p>
      </div>

      {/* Organ selector */}
      <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:20}}>
        {organs.map(o=>(
          <button key={o.id} onClick={()=>setSelectedOrgan(selectedOrgan===o.id?null:o.id)} style={{
            flex:"1 1 120px",
            background:selectedOrgan===o.id?`${organInfo[o.id].color}18`:"rgba(238,232,220,0.04)",
            border:`1px solid ${selectedOrgan===o.id?organInfo[o.id].color:"rgba(238,232,220,0.08)"}`,
            borderRadius:12,padding:"12px 11px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{fontSize:10,color:selectedOrgan===o.id?organInfo[o.id].color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:3}}>{o.desc}</div>
            <div style={{fontSize:13,color:selectedOrgan===o.id?organInfo[o.id].color:C.muted,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{o.label}</div>
          </button>
        ))}
      </div>

      {org && (
        <div style={{background:`linear-gradient(135deg,${org.color}0d,rgba(8,9,15,0.5))`,border:`1px solid ${org.color}28`,borderRadius:18,padding:22,marginBottom:20}}>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 220px"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:28}}>{org.icon}</span>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",color:org.color,margin:0,fontSize:22}}>{org.label}</h3>
              </div>
              <p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,marginBottom:14}}>{org.desc}</p>
            </div>
            <div style={{flex:"1 1 200px"}}>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>PHYSICAL SENSATIONS</div>
              {org.sensations.map((s,i)=>(
                <div key={i} style={{background:"rgba(238,232,220,0.04)",border:"1px solid rgba(238,232,220,0.07)",borderRadius:8,padding:"9px 12px",marginBottom:7}}>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{width:4,height:4,borderRadius:"50%",background:org.color,flexShrink:0,marginTop:5}}/>
                    <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compare tool */}
      <div style={{background:"rgba(238,232,220,0.03)",border:"1px solid rgba(238,232,220,0.08)",borderRadius:16,padding:20}}>
        <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>COMPARE ANATOMY — WEEK 6 vs WEEK {compareWeek}</div>
        <input type="range" min={20} max={40} value={compareWeek} onChange={e=>setCompareWeek(Number(e.target.value))}
          style={{width:"100%",accentColor:C.rose,cursor:"pointer",marginBottom:16}}/>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          {[6, compareWeek].map((wk,idx)=>(
            <div key={idx} style={{flex:"0 0 auto",textAlign:"center"}}>
              <div style={{fontSize:10,color:idx===0?C.sage:C.rose,fontFamily:"'DM Mono',monospace",marginBottom:8}}>
                WEEK {wk} — {getTrimester(wk)===1?"T1":getTrimester(wk)===2?"T2":"T3"}
              </div>
              <div style={{background:idx===0?"rgba(122,174,138,0.08)":"rgba(196,120,106,0.08)",border:`1px solid ${idx===0?C.sage:C.rose}25`,borderRadius:14,padding:12}}>
                <AnatomySVG week={wk} hoveredOrgan={null} setHoveredOrgan={()=>{}} showLabels={true}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HormonesSection() {
  const [active, setActive] = useState(null);
  const h = hormones.find(x=>x.id===active);
  return (
    <div>
      <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:18}}>
        {hormones.map(hor=>(
          <button key={hor.id} onClick={()=>setActive(active===hor.id?null:hor.id)} style={{
            flex:"1 1 130px",
            background:active===hor.id?`${hor.color}18`:"rgba(238,232,220,0.04)",
            border:`1px solid ${active===hor.id?hor.color:"rgba(238,232,220,0.08)"}`,
            borderRadius:13,padding:"13px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{fontSize:20,marginBottom:4}}>{hor.icon}</div>
            <div style={{fontSize:13,color:active===hor.id?hor.color:C.muted,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{hor.name}</div>
            <div style={{marginTop:6}}>
              <HormoneSparkline curve={hor.curve} color={hor.color}/>
            </div>
          </button>
        ))}
      </div>
      {h && (
        <div style={{background:`linear-gradient(135deg,${h.color}0d,rgba(8,9,15,0.5))`,border:`1px solid ${h.color}28`,borderRadius:18,padding:22}}>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 220px"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:28}}>{h.icon}</span>
                <div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",color:h.color,margin:0,fontSize:22}}>{h.name}</h3>
                  <div style={{fontSize:11,color:C.faint,fontFamily:"'DM Mono',monospace"}}>{h.full}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                <div style={{background:`${h.color}12`,border:`1px solid ${h.color}25`,borderRadius:8,padding:"6px 10px"}}>
                  <div style={{fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace"}}>SOURCE</div>
                  <div style={{fontSize:11,color:h.color}}>{h.source}</div>
                </div>
                <div style={{background:`${h.color}12`,border:`1px solid ${h.color}25`,borderRadius:8,padding:"6px 10px"}}>
                  <div style={{fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace"}}>PEAK</div>
                  <div style={{fontSize:11,color:h.color}}>{h.peak}</div>
                </div>
              </div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.7,margin:0}}>{h.role}</p>
            </div>
            <div style={{flex:"1 1 200px"}}>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>BODY EFFECTS</div>
              {h.body.map((b,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:h.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!active && <div style={{textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"22px 0"}}>↑ Select a hormone to explore its role, source, and physical effects</div>}
    </div>
  );
}

function PostureSection() {
  const [active, setActive] = useState(null);
  const [week, setWeek] = useState(28);
  const lordosis = Math.min(week / 40, 1) * 16;
  const pc = postureChanges.find(p=>p.label===active);

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:8}}>ADJUST WEEK TO SEE POSTURE CHANGES</div>
        <input type="range" min={4} max={40} value={week} onChange={e=>setWeek(Number(e.target.value))}
          style={{width:"100%",accentColor:C.amber,cursor:"pointer"}}/>
        <div style={{textAlign:"center",fontSize:11,color:C.amber,fontFamily:"'DM Mono',monospace",marginTop:4}}>Week {week}</div>
      </div>
      <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
        {/* Posture SVG */}
        <div style={{flex:"0 0 auto"}}>
          <div style={{background:"rgba(20,15,25,0.6)",borderRadius:16,padding:16,border:"1px solid rgba(184,152,88,0.2)"}}>
            <svg width={160} height={360} viewBox="0 0 160 360">
              <defs>
                <radialGradient id="figGrad"><stop offset="0%" stopColor="#2a2030"/><stop offset="100%" stopColor="#1a1525"/></radialGradient>
              </defs>
              {/* Baseline posture reference (very faint) */}
              <path d={`M 80 30 Q 80 120 80 200 Q 80 260 80 320`}
                fill="none" stroke="rgba(238,232,220,0.08)" strokeWidth="1.5" strokeDasharray="2,4"/>
              {/* Actual spine with lordosis */}
              <path d={`M ${80+lordosis*0.2} 30 Q ${80+lordosis*0.4} 100 ${80+lordosis*0.6} 160 Q ${80+lordosis} 220 ${80+lordosis*0.7} 270 Q ${80+lordosis*0.3} 310 80 340`}
                fill="none" stroke={C.amber} strokeWidth="3" strokeLinecap="round"
                style={{transition:"all 0.5s ease"}}/>
              {/* Vertebrae dots */}
              {[30,60,90,120,150,180,210,240,270,300,330].map((y,i)=>{
                const xOff = i < 3 ? lordosis * 0.2 : i < 6 ? lordosis * 0.7 : i < 8 ? lordosis * 0.9 : lordosis * 0.4;
                return <circle key={i} cx={80+xOff} cy={y} r={3.5} fill={C.amber} opacity={0.7}
                  style={{transition:"all 0.5s ease"}}/>;
              })}
              {/* Center of gravity indicator */}
              <line x1={80} y1={60} x2={80} y2={340} stroke="rgba(238,232,220,0.12)" strokeWidth="1" strokeDasharray="3,3"/>
              {week > 16 && (
                <g style={{transition:"all 0.5s ease"}}>
                  <circle cx={80+lordosis*0.6} cy={200} r={Math.min(week/40*22+5, 28)}
                    fill="rgba(196,120,106,0.25)" stroke={C.rose} strokeWidth="1"
                    style={{transition:"all 0.5s ease"}}/>
                  <text x={80+lordosis*0.6+2} y={204} textAnchor="middle" fontSize={8} fill={C.rose} fontFamily="'DM Mono',monospace">⊕</text>
                </g>
              )}
              {/* Pelvis tilt indicator */}
              <path d={`M ${62+lordosis*0.3} 290 Q ${80+lordosis*0.3} ${285+lordosis*0.3} ${98+lordosis*0.3} 290`}
                fill="none" stroke={C.rose} strokeWidth="2"
                style={{transition:"all 0.5s ease"}}/>
              {/* Labels */}
              <text x={8} y={34} fontSize={8} fill="rgba(238,232,220,0.4)" fontFamily="'DM Mono',monospace">Cervical</text>
              <text x={8} y={110} fontSize={8} fill="rgba(238,232,220,0.4)" fontFamily="'DM Mono',monospace">Thoracic</text>
              <text x={8} y={210} fontSize={8} fill={`${C.amber}90`} fontFamily="'DM Mono',monospace">Lumbar</text>
              <text x={8} y={290} fontSize={8} fill="rgba(238,232,220,0.4)" fontFamily="'DM Mono',monospace">Sacral</text>
              <text x={80} y={356} fontSize={8} fill="rgba(238,232,220,0.3)" fontFamily="'DM Mono',monospace" textAnchor="middle">Week {week} spine</text>
            </svg>
          </div>
        </div>
        {/* Posture changes */}
        <div style={{flex:"1 1 250px"}}>
          <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:12}}>POSTURAL ADAPTATIONS — CLICK TO EXPLORE</div>
          {postureChanges.map((p,i)=>(
            <div key={i} onClick={()=>setActive(active===p.label?null:p.label)} style={{
              background:active===p.label?`${p.color}14`:"rgba(238,232,220,0.03)",
              border:`1px solid ${active===p.label?p.color:"rgba(238,232,220,0.07)"}`,
              borderRadius:12,padding:"13px 15px",cursor:"pointer",transition:"all 0.2s",marginBottom:8,
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:16}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:13,color:active===p.label?p.color:C.muted,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{p.label}</div>
                    <div style={{fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>{p.week}</div>
                  </div>
                </div>
                <span style={{fontSize:11,color:C.faint,fontFamily:"'DM Mono',monospace"}}>{active===p.label?"▲":"▼"}</span>
              </div>
              {active===p.label&&(
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${p.color}20`}}>
                  <p style={{fontSize:12.5,color:C.muted,lineHeight:1.65,marginBottom:8}}>{p.what}</p>
                  <div style={{background:`${p.color}0e`,borderRadius:8,padding:"8px 12px"}}>
                    <div style={{fontSize:9.5,color:p.color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>SENSATION</div>
                    <p style={{fontSize:12,color:C.muted,margin:0,lineHeight:1.5}}>{p.sensation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummariesSection() {
  const [active, setActive] = useState(1);
  const td = trimesterData[active];
  return (
    <div>
      <div style={{display:"flex",gap:9,marginBottom:20}}>
        {[1,2,3].map(t=>{
          const td2 = trimesterData[t];
          return (
            <button key={t} onClick={()=>setActive(t)} style={{
              flex:1,background:active===t?`${td2.color}18`:"rgba(238,232,220,0.04)",
              border:`1px solid ${active===t?td2.color:"rgba(238,232,220,0.08)"}`,
              borderRadius:14,padding:"14px 10px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
            }}>
              <div style={{fontSize:22,marginBottom:5}}>{td2.icon}</div>
              <div style={{fontSize:11,color:active===t?td2.color:C.muted,fontFamily:"'DM Mono',monospace"}}>{td2.weeks}</div>
              <div style={{fontSize:13,color:active===t?C.cream:C.muted,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>{td2.name}</div>
            </button>
          );
        })}
      </div>
      <div style={{background:`linear-gradient(135deg,${td.color}0d,rgba(8,9,15,0.5))`,border:`1px solid ${td.color}28`,borderRadius:18,padding:22}}>
        <p style={{fontSize:14,color:"rgba(238,232,220,0.78)",lineHeight:1.65,fontStyle:"italic",marginBottom:20}}>{td.headline}</p>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:18}}>
          <div style={{flex:"1 1 210px"}}>
            <div style={{fontSize:10,color:td.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>ANATOMICAL CHANGES</div>
            {td.changes.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:td.color,flexShrink:0,marginTop:5}}/>
                <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{c}</span>
              </div>
            ))}
          </div>
          <div style={{flex:"1 1 200px"}}>
            <div style={{fontSize:10,color:td.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>COMMON SENSATIONS</div>
            {td.sensations.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:`${td.color}80`,flexShrink:0,marginTop:5}}/>
                <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:`${td.color}0c`,border:`1px solid ${td.color}22`,borderRadius:12,padding:14}}>
          <div style={{fontSize:10,color:td.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>🌸 DOULA INSIGHT</div>
          <p style={{fontSize:13,color:"rgba(238,232,220,0.75)",lineHeight:1.65,margin:0}}>{td.doula}</p>
        </div>
      </div>
    </div>
  );
}

function QuizSection() {
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quizzes[qIdx];
  const answer = (i) => { if(sel!==null)return; setSel(i); if(i===q.correct)setScore(s=>s+1); };
  const next = () => { if(qIdx<quizzes.length-1){setQIdx(q=>q+1);setSel(null);}else setDone(true); };
  const reset = () => { setQIdx(0);setSel(null);setScore(0);setDone(false); };
  return (
    <div>
      {!done ? (
        <div style={{background:"rgba(238,232,220,0.04)",border:"1px solid rgba(238,232,220,0.1)",borderRadius:16,padding:22}}>
          <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>
            QUESTION {qIdx+1} OF {quizzes.length}
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.cream,lineHeight:1.5,marginBottom:18}}>{q.q}</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:sel!==null?16:0}}>
            {q.options.map((opt,i)=>{
              let bg="rgba(238,232,220,0.04)",bdr="rgba(238,232,220,0.1)",clr=C.muted;
              if(sel!==null){if(i===q.correct){bg="rgba(122,174,138,0.2)";bdr=C.sage;clr=C.sage;}else if(i===sel){bg="rgba(200,120,106,0.15)";bdr=C.rose;clr=C.rose;}}
              return <button key={i} onClick={()=>answer(i)} style={{background:bg,border:`1px solid ${bdr}`,borderRadius:10,padding:"10px 14px",textAlign:"left",cursor:sel!==null?"default":"pointer",color:clr,fontSize:13,fontFamily:"'DM Mono',monospace",transition:"all 0.2s"}}><span style={{opacity:0.5}}>{String.fromCharCode(65+i)}. </span>{opt}</button>;
            })}
          </div>
          {sel!==null&&(
            <>
              <div style={{background:"rgba(238,232,220,0.04)",border:"1px solid rgba(238,232,220,0.1)",borderRadius:10,padding:14,marginTop:14,marginBottom:14}}>
                <div style={{fontSize:10,color:C.gold,fontFamily:"'DM Mono',monospace",marginBottom:6}}>EXPLANATION</div>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{q.exp}</p>
              </div>
              <button onClick={next} style={{background:`${C.gold}20`,border:`1px solid ${C.gold}`,borderRadius:10,padding:"8px 20px",color:C.gold,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{qIdx<quizzes.length-1?"Next Question →":"See Results →"}</button>
            </>
          )}
        </div>
      ) : (
        <div style={{background:"rgba(238,232,220,0.04)",border:"1px solid rgba(238,232,220,0.1)",borderRadius:16,padding:28,textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:12}}>{score===quizzes.length?"🌟":score>=3?"🌸":"🌱"}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:C.cream,marginBottom:8}}>{score}/{quizzes.length} Correct</div>
          <p style={{color:C.muted,fontSize:14,marginBottom:20,maxWidth:420,margin:"0 auto 20px"}}>{score===quizzes.length?"Excellent understanding of pregnancy anatomy.":score>=3?"Good foundation — explore the sections where you felt uncertain.":"Great start — the Trimester Explorer and Organ Shifting sections will build your visual understanding."}</p>
          <button onClick={reset} style={{background:`${C.gold}20`,border:`1px solid ${C.gold}`,borderRadius:10,padding:"8px 20px",color:C.gold,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Retry Quiz</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AnatomyGuide() {
  const [section, setSection] = useState("explorer");
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);

  const meta = {
    explorer:{title:"Trimester Timeline Explorer",sub:"Drag the week slider to watch the body transform — hover over organs to explore each structure"},
    organs:{title:"Organ Shifting Explorer",sub:"How every organ repositions as the uterus grows — and what that feels like"},
    hormones:{title:"Hormone-Driven Changes",sub:"Five key hormones and how they sculpt the pregnant body week by week"},
    posture:{title:"Posture & Spinal Changes",sub:"How the spine, pelvis, and center of gravity adapt to pregnancy weight"},
    summaries:{title:"Trimester Summaries",sub:"Key anatomical changes, sensations, and doula insights for each trimester"},
    quiz:{title:"Knowledge Check",sub:"Test your understanding of pregnancy anatomy"},
  };
  const m = meta[section];
  const idx = navItems.findIndex(n=>n.id===section);
  const prev = navItems[idx-1], next = navItems[idx+1];

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(155deg,${C.bg} 0%,#0a0a12 50%,#0c0808 100%)`,fontFamily:"'Georgia',serif",color:C.cream}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');button{outline:none;}*{box-sizing:border-box;}input[type=range]{height:4px;border-radius:2px;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-thumb{background:rgba(200,168,90,0.2);border-radius:2px;}`}</style>
      {/* Header */}
      <div style={{background:"rgba(8,9,15,0.92)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(200,168,90,0.08)",padding:"20px 24px 0",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1020,margin:"0 auto"}}>
          <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8,marginBottom:16}}>
              <div>
                <div style={{fontSize:9.5,letterSpacing:"0.32em",color:"rgba(238,232,220,0.28)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:4}}>Interactive Learning Guide · Birth Worker Series</div>
                <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3.8vw,36px)",margin:0,lineHeight:1.1,fontWeight:700,background:`linear-gradient(135deg,#EEE8DC,${C.gold},${C.rose},${C.sage})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Pregnancy Body Changes
                  <span style={{fontWeight:400,fontStyle:"italic",fontSize:"0.68em"}}> — Trimester by Trimester</span>
                </h1>
              </div>
              <div style={{fontSize:10,color:"rgba(238,232,220,0.22)",fontFamily:"'DM Mono',monospace",textAlign:"right"}}>6 Sections · Interactive Anatomy</div>
            </div>
            <div style={{display:"flex",gap:0,overflowX:"auto",marginLeft:-4}}>
              {navItems.map(nav=>(
                <button key={nav.id} onClick={()=>setSection(nav.id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${section===nav.id?C.gold:"transparent"}`,padding:"8px 13px",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",color:section===nav.id?C.gold:"rgba(238,232,220,0.38)",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{nav.icon} {nav.short}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div style={{maxWidth:1020,margin:"0 auto",padding:"30px 20px 70px"}}>
        <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(18px)",transition:"all 0.5s ease 0.08s"}}>
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,30px)",margin:"0 0 4px",fontWeight:600}}>{m.title}</h2>
            <p style={{color:C.faint,fontSize:12.5,margin:0,fontFamily:"'DM Mono',monospace"}}>{m.sub}</p>
          </div>
          <div style={{background:"rgba(200,168,90,0.025)",border:"1px solid rgba(200,168,90,0.07)",borderRadius:22,padding:"26px 24px"}}>
            {section==="explorer" && <ExplorerSection/>}
            {section==="organs" && <OrgansSection/>}
            {section==="hormones" && <HormonesSection/>}
            {section==="posture" && <PostureSection/>}
            {section==="summaries" && <SummariesSection/>}
            {section==="quiz" && <QuizSection/>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:20,borderTop:"1px solid rgba(200,168,90,0.07)"}}>
            {prev?<button onClick={()=>setSection(prev.id)} style={{background:"rgba(238,232,220,0.05)",border:"1px solid rgba(238,232,220,0.1)",borderRadius:10,padding:"8px 18px",color:"rgba(238,232,220,0.45)",fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>← {prev.short}</button>:<div/>}
            {next?<button onClick={()=>setSection(next.id)} style={{background:`${C.gold}18`,border:`1px solid ${C.gold}40`,borderRadius:10,padding:"8px 18px",color:C.gold,fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{next.short} →</button>:<div/>}
          </div>
          <div style={{textAlign:"center",fontSize:10,color:"rgba(238,232,220,0.16)",fontFamily:"'DM Mono',monospace",marginTop:28,lineHeight:1.6}}>
            Educational resource. Anatomical diagrams are illustrative, not clinical-grade imaging.<br/>
            All anatomical values are approximate and reflect average pregnancy progression.
          </div>
        </div>
      </div>
    </div>
  );
}
