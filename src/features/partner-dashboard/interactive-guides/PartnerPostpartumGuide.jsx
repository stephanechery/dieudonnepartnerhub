import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#130b07", card: "rgba(255,228,200,0.04)", cardHov: "rgba(255,228,200,0.08)",
  border: "rgba(255,228,200,0.08)", borderStrong: "rgba(255,228,200,0.16)",
  terra: "#E8956D", sand: "#C4A882", sage: "#8FBCAA", rose: "#D48A95",
  amber: "#D4A853", blue: "#8FAFD4", cream: "#F0EAE0",
  muted: "rgba(240,234,224,0.52)", faint: "rgba(240,234,224,0.28)", warn: "#E87575",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const hormones = [
  { id: "estrogen", name: "Estrogen", emoji: "🌿", color: C.sage,
    desc: "Plummets immediately after the placenta delivers — one of the fastest hormonal drops in human biology.",
    effects: ["Hot flashes & night sweats","Vaginal dryness","Mood instability","Brain fog","Joint aches"],
    insight: "Estrogen falls ~1,000× in 24 hours. Takes 6–12 weeks to stabilize — longer while breastfeeding due to prolactin suppression. Every physical and emotional postpartum challenge is amplified by this single event.",
    curveBF:  [100,3,3,5,6,7,8,10,14,20,28,42,58,72],
    curveNBF: [100,3,4,13,28,42,55,65,73,80,85,88,92,96],
  },
  { id: "progesterone", name: "Progesterone", emoji: "🌙", color: C.amber,
    desc: "Disappears almost instantly when the placenta is delivered — faster even than estrogen.",
    effects: ["Anxiety & restlessness","Sleep disruption","Emotional vulnerability","Loss of calm","Postpartum blues trigger"],
    insight: "Progesterone was the body's 'chill' hormone for 9 months. Its sudden absence is a primary driver of postpartum mood instability. The brain enters a withdrawal-like state.",
    curveBF:  [100,1,1,2,2,3,3,5,8,12,18,25,38,55],
    curveNBF: [100,1,1,4,10,20,30,40,50,58,64,70,78,86],
  },
  { id: "prolactin", name: "Prolactin", emoji: "🍼", color: C.rose,
    desc: "Surges dramatically postpartum to drive milk production. Stays high in breastfeeding mothers for months.",
    effects: ["Triggers milk production","Suppresses ovulation","Can reduce libido","Contributes to fatigue","Enhances maternal bonding"],
    insight: "Prolactin keeps estrogen and progesterone suppressed while breastfeeding — creating a prolonged low-estrogen state. Non-breastfeeding mothers recover hormonally much faster.",
    curveBF:  [20,90,100,95,90,87,84,80,76,72,68,62,54,42],
    curveNBF: [20,90,78,46,22,12,8,6,5,5,5,5,5,5],
  },
  { id: "oxytocin", name: "Oxytocin", emoji: "💗", color: C.terra,
    desc: "Pulses with every feeding, skin-to-skin contact, and gaze. The neurological glue of mother-infant bonding.",
    effects: ["Uterine contractions (afterpains)","Milk let-down reflex","Emotional bonding","Reduces anxiety","Deepens attachment"],
    insight: "Oxytocin doesn't follow a smooth curve — it spikes with each nursing session and bonding moment, acting as a neurological reward system. Every act of care literally rewires the brain.",
    curveBF:  [55,80,78,76,74,73,72,70,68,66,64,61,58,54],
    curveNBF: [55,72,55,44,38,35,33,31,30,30,29,29,29,29],
  },
  { id: "cortisol", name: "Cortisol", emoji: "⚡", color: C.blue,
    desc: "Elevated from birth stress and sleep deprivation. Chronically high cortisol amplifies every emotional challenge.",
    effects: ["Hypervigilance (adaptive)","Memory impairment","Immune suppression","Emotional volatility","Key PPD risk factor"],
    insight: "Sleep fragmentation keeps cortisol chronically elevated for weeks. This is why rest isn't just comfort — it is hormonal medicine. Cortisol begins to normalize only when sleep consolidates around 4–6 months.",
    curveBF:  [78,92,86,82,78,75,72,68,62,55,48,42,38,34],
    curveNBF: [78,88,80,74,68,62,57,52,47,43,40,37,34,32],
  },
];
const timeLabels = ["Birth","1w","2w","1m","6w","2m","10w","3m","4m","5m","6m","8m","10m","12m"];

const phases = [
  { id:"p1", label:"Birth – Week 2", icon:"🌊", color:C.terra, subtitle:"The Acute Storm",
    physical:["Uterus actively contracting back (involution)","Lochia rubra — red bleeding days 1–7","Perineal or incision healing begins","Engorgement as milk comes in Day 2–4","Profound physical exhaustion from labor"],
    hormonal:["Estrogen & progesterone near-zero","Prolactin surging to drive milk","Oxytocin pulsing with every feeding","Cortisol elevated from birth stress"],
    emotional:["Baby blues peak Days 3–5 (80% of mothers)","Emotional lability — crying without reason","Surreal detachment is common and normal","Hyper-alertness even when exhausted","Intense love OR numbness — both are valid"],
    misconceptions:["'You should feel instant love' — Bonding is a neurological process, not a switch. Many mothers feel numb or detached initially. This does not predict the relationship.","'You'll instinctively know what to do' — Newborn care is a learned skill. Needing help is normal, not failure.","'Breastfeeding is natural so it's easy' — Latch difficulties and pain affect the majority of new mothers. Support is medical, not optional."],
  },
  { id:"p2", label:"Weeks 2–6", icon:"🌱", color:C.sage, subtitle:"Initial Healing",
    physical:["Lochia transitions from pink to yellow-white","Perineal tissues actively healing","C-section scar forming and stabilizing","Uterus approaching pre-pregnancy size","Postpartum hair shedding begins (alopecia)"],
    hormonal:["Estrogen remains suppressed (esp. if breastfeeding)","Prolactin stabilizes at high levels","Progesterone still very low","Baby blues typically resolve — if they don't, screen for PPD"],
    emotional:["Symptoms persisting past Week 2 require PPD evaluation","Sleep deprivation compounding all emotions","Identity shift ('matrescence') beginning","Social isolation often peaks this window","Partnership stress frequently peaks here"],
    misconceptions:["'6 weeks = fully recovered' — The 6-week visit checks specific healing markers. Internal recovery and hormonal rebalancing continue for months.","'Baby blues and PPD are the same thing' — Baby blues resolve within 2 weeks. PPD doesn't. Same surface, different biology.","'If you're breastfeeding you can't get pregnant' — Breastfeeding is unreliable contraception. Ovulation can precede the first postpartum period."],
  },
  { id:"p3", label:"Weeks 6–12", icon:"🔄", color:C.amber, subtitle:"Rebalancing Begins",
    physical:["Cleared for exercise — start very gradually","Pelvic floor still healing internally","Postpartum alopecia peaks (alarming but normal)","Non-BF mothers: hormonal cycle restarting","BF mothers: still in prolactin-driven suppression"],
    hormonal:["Non-BF: estrogen and progesterone rising","First period may return (non-breastfeeding)","Prolactin still elevated if breastfeeding","Thyroid issues can emerge: postpartum thyroiditis (5–7%)"],
    emotional:["Cognitive fog may still be significant","Anxiety often peaks as social support decreases","DMER (dysphoric milk ejection reflex) possible","Body image challenges emerge with social pressure","Return-to-work anxiety if applicable"],
    misconceptions:["'Getting your period means you're fully recovered' — Cycles can be irregular, anovulatory, or physically different for months.","'Postpartum thyroiditis is rare' — It affects 5–7% of mothers, mimics PPD, and is regularly missed.","'You should be feeling normal by now' — 12 weeks is still early recovery by any biological measure."],
  },
  { id:"p4", label:"3–6 Months", icon:"🌸", color:C.rose, subtitle:"The New Baseline",
    physical:["Energy gradually improving with sleep consolidation","Pelvic floor strengthening with proper therapy","Hair regrowth becoming visible","Weight redistribution normalizing","Sexual interest may begin returning"],
    hormonal:["BF mothers: prolactin-dominant cycle continues","Non-BF: approaching pre-pregnancy hormone levels","Oxytocin bonds deepening with each interaction","Cortisol lowering as sleep improves"],
    emotional:["PPD can onset as late as 6 months — don't dismiss late symptoms","Attachment deepens as baby becomes interactive","Increased social engagement and enjoyment","Identity integration beginning ('I'm still me AND a mother')","Return-to-work stress if applicable"],
    misconceptions:["'PPD only happens in the first few weeks' — Late-onset PPD is common, real, and frequently missed by providers.","'If you're feeling better, you don't need support' — Maintenance and community protect against relapse.","'Sleep will be fixed by now' — Many babies do not consolidate sleep at this stage. This is normal infant biology, not failure."],
  },
  { id:"p5", label:"6–12 Months", icon:"✨", color:C.sand, subtitle:"Integration & Recovery",
    physical:["BF mothers beginning weaning — new hormonal shift","Menstrual cycle returning and regulating","Energy levels approaching pre-pregnancy norms","Pelvic floor should be formally reassessed","Diastasis recti recovery if present"],
    hormonal:["Estrogen rising as breastfeeding reduces","Progesterone re-establishing menstrual cycle","Prolactin declining with weaning","Body approaching hormonal homeostasis"],
    emotional:["Emerging sense of competence and new identity","Post-weaning depression — real and overlooked","Relationship intimacy often rebuilding","Many mothers report their strongest sense of self by 12 months","Processing the birth experience, sometimes for the first time"],
    misconceptions:["'You should be fully back to normal by 1 year' — Many aspects of the body change permanently. A new normal is the goal, not the old one.","'Post-weaning depression isn't real' — The estrogen drop from weaning can trigger significant mood changes. This is validated clinically.","'If you had PPD and recovered, it's over' — PPD history is a risk factor for future pregnancies and should be documented and monitored."],
  },
];

const bodySystem = [
  { id:"uterus", label:"Uterine Involution", icon:"🫀", color:C.terra,
    summary:"After birth, the uterus — which grew to 1,000× its original volume — must contract back to pre-pregnancy size. This is an active biological process, not passive.",
    stages:[
      { label:"Hours 1–24", detail:"Uterus sits at the navel, weighs ~1kg. Active contractions (afterpains) are working. Breastfeeding intensifies these contractions via oxytocin — this is a feature, not a problem." },
      { label:"Days 2–7", detail:"Uterus drops ~1 cm per day as muscle fibers shorten. Lochia is heaviest now. Afterpains peak, especially in mothers who've had previous pregnancies." },
      { label:"Week 2", detail:"Uterus no longer palpable above the pubic bone. Visible contractions largely complete. Lochia beginning to lighten." },
      { label:"Week 6", detail:"Returns to near pre-pregnancy size (~60g). Endometrium fully healed. Cervix closed. Anatomical recovery essentially complete — though pelvic floor is still healing." },
    ],
    warning:"A uterus that stays soft, heavy, or tender after Week 2 may indicate subinvolution or retained placental fragments. Fever + uterine tenderness = possible endometritis.",
  },
  { id:"pelvic", label:"Pelvic Floor", icon:"⚓", color:C.sage,
    summary:"The pelvic floor bore the entire weight of a growing pregnancy and sustained significant strain during delivery. Recovery is deeper and longer than most mothers are told.",
    stages:[
      { label:"Days 1–3", detail:"Significant swelling, bruising, possible tearing (1st–4th degree) or episiotomy. The area is largely numb initially, masking the extent of injury. Kegels can begin if comfortable." },
      { label:"Weeks 1–4", detail:"Surface healing underway. Ice, sitz baths, and rest are the tools. Avoidance of heavy lifting critical. Many mothers feel 'fine' before deep tissues are healed." },
      { label:"Weeks 4–12", detail:"Internal connective tissue, fascia, and nerve regeneration continuing — invisible on the outside. This is why 'feeling fine' is not the same as 'being healed.'" },
      { label:"3–12 Months", detail:"Pelvic floor physiotherapy is recommended for all postpartum women — not only those with symptoms. Strength, coordination, and pressure management should all be assessed." },
    ],
    warning:"Leaking urine (even small amounts), pelvic heaviness or pressure, pain with intercourse, or difficulty emptying bladder/bowel are signs to seek pelvic floor physiotherapy — not normal parts of motherhood to accept.",
  },
  { id:"lochia", label:"Lochia (Bleeding)", icon:"🌊", color:C.rose,
    summary:"Postpartum bleeding is the uterus shedding remaining pregnancy tissue and healing from the placental wound. Its progression is a direct indicator of recovery.",
    stages:[
      { label:"Days 1–4: Lochia Rubra", detail:"Bright to dark red with clots smaller than a golf ball. Heavy flow that alarms most first-time mothers. This is the placental wound site healing — it is normal." },
      { label:"Days 4–14: Lochia Serosa", detail:"Transitions to pink or brownish. Lighter flow. Tissue fluid and wound secretions. Strong odor warrants evaluation." },
      { label:"Weeks 2–6: Lochia Alba", detail:"Creamy yellow-white discharge. Gradually decreasing. May continue up to 6 weeks. Return of red bleeding after apparent cessation is common with overactivity — rest is indicated." },
      { label:"Completion", detail:"Cessation is gradual and variable. Any bright red return after full resolution warrants evaluation, especially with fever or pelvic pain." },
    ],
    warning:"Soaking more than 1 pad per hour, clots larger than a golf ball, foul-smelling discharge, or fever may indicate postpartum hemorrhage or infection. These are medical emergencies — seek care immediately.",
  },
  { id:"sleep", label:"Sleep Architecture", icon:"🌛", color:C.amber,
    summary:"Postpartum sleep isn't simply disrupted — its fundamental biological structure is altered by hormones, neurological changes, and infant care demands.",
    stages:[
      { label:"Weeks 1–4", detail:"Average new mothers lose 700+ hours of sleep in Year 1. REM and deep sleep severely fragmented. Cortisol chronically elevated. Cognitive performance equivalent to mild intoxication." },
      { label:"Weeks 4–12", detail:"The brain compensates by entering REM more quickly. Sleep efficiency improves even with short sessions. 'Sleep when the baby sleeps' is not a cliché — it is hormonal medicine." },
      { label:"Months 3–6", detail:"Many (not all) babies begin consolidating nights. Cortisol starts normalizing. Cognitive fog begins lifting. Emotional regulation noticeably improving." },
      { label:"Months 6–12", detail:"Sleep cycles approaching pre-pregnancy patterns for most families. Hormonal recovery accelerates sharply in parallel with improved sleep." },
    ],
    warning:"Chronic sleep deprivation is a primary, modifiable PPD risk factor. If a mother cannot sleep even when the baby sleeps, this is a clinical symptom — not a personality trait — and warrants screening.",
  },
  { id:"breast", label:"Breast Physiology", icon:"🌸", color:C.sand,
    summary:"From colostrum to mature milk, the breasts undergo remarkable functional transformation in 72 hours. Understanding this physiology reduces unnecessary anxiety and abandonment of breastfeeding.",
    stages:[
      { label:"Birth – Day 3: Colostrum", detail:"Dense, golden, low-volume. Rich in secretory IgA, growth factors, and white blood cells. The baby's immune primer. Volumes are tiny by design — a newborn stomach holds 5–7mL." },
      { label:"Day 3–5: Milk 'Coming In'", detail:"Prolactin triggers a dramatic volume surge. Engorgement is common and intensely uncomfortable. Heat, frequent nursing, and massage are the treatment. Skipping feeds worsens engorgement." },
      { label:"Weeks 1–4: Transitional Milk", detail:"Milk composition adjusting to baby's specific immunological needs based on feeding cues. Supply is demand-driven — responding to cluster feeding is not a problem to solve." },
      { label:"1 Month+: Mature Milk", detail:"Composition shifts within each feeding (foremilk to hindmilk) and changes with the baby's developmental needs across months. Milk continues adapting throughout the breastfeeding relationship." },
    ],
    warning:"Hard, hot, red, wedge-shaped areas of the breast with fever and flu-like symptoms indicate mastitis. Requires prompt antibiotic treatment. Do not stop feeding — cessation worsens the condition.",
  },
  { id:"cardio", label:"Cardiovascular", icon:"❤️", color:C.blue,
    summary:"Blood volume increased 50% during pregnancy. The cardiovascular system must recalibrate in the immediate postpartum period — a significant physiological event rarely discussed.",
    stages:[
      { label:"Hours 1–24", detail:"Major fluid redistribution as pregnancy fluid is released. Heart rate and blood pressure adjusting rapidly. Orthostatic hypotension (dizziness on standing) is common — change positions slowly." },
      { label:"Days 2–7", detail:"Significant postpartum diuresis — increased urination and night sweats are normal as the body releases excess pregnancy fluid. Up to 2L of fluid may be shed daily." },
      { label:"Weeks 2–6", detail:"Blood volume normalizing. Iron-deficiency anemia common if blood loss was significant. Fatigue disproportionate to sleep loss may indicate anemia — request iron levels." },
      { label:"6 Weeks+", detail:"Cardiovascular system largely normalized. Cardiac output stabilized. Graduated exercise safe and beneficial. Persistent hypertension beyond 12 weeks warrants evaluation." },
    ],
    warning:"New or worsening shortness of breath, chest pain, or leg swelling after the first week needs immediate evaluation. Peripartum cardiomyopathy is rare but serious. Late postpartum preeclampsia (weeks 2–6) is real and underrecognized.",
  },
];

const conditions = [
  { id:"blues", title:"Baby Blues", emoji:"💧", color:C.blue,
    onset:"Days 1–5", duration:"Up to 2 weeks", prevalence:"~80% of mothers",
    symptoms:["Crying without clear reason","Mood swings","Irritability","Anxiety","Difficulty sleeping"],
    cause:"Direct result of the progesterone and estrogen crash — a physiological withdrawal response, not a psychological disorder. The brain that was bathed in these hormones for 9 months is adapting.",
    treatment:"Rest, support, and reassurance. Resolves on its own without intervention. Monitor for escalation.",
    whenToAct:"If symptoms persist beyond 2 weeks or significantly impair daily functioning — screen immediately for PPD.",
  },
  { id:"ppd", title:"Postpartum Depression", emoji:"🌑", color:C.rose,
    onset:"Anytime in first 12 months", duration:"Weeks to months untreated", prevalence:"~15–20% of mothers",
    symptoms:["Persistent sadness or emptiness","Loss of interest in the baby","Difficulty bonding","Severe fatigue beyond new-parent norm","Thoughts of self-harm"],
    cause:"Complex interaction of hormonal shifts, sleep deprivation, genetic predisposition, social isolation, and prior mental health history. A medical condition — not weakness, not character, not love.",
    treatment:"Therapy (CBT, IPT), medication (SSRIs are safe with breastfeeding), support groups, sleep intervention. Highly treatable. Early treatment produces better outcomes.",
    whenToAct:"Any time. Do not wait for it to 'pass.' PPD does not resolve without intervention in the same way baby blues do.",
  },
  { id:"ppa", title:"Postpartum Anxiety", emoji:"⚡", color:C.amber,
    onset:"Anytime in first 12 months", duration:"Variable", prevalence:"~15–18% (more common than PPD, less screened)",
    symptoms:["Constant worry and racing thoughts","Inability to rest even when exhausted","Intrusive 'what if' scenarios about baby","Physical tension, racing heart","Avoidance behaviors"],
    cause:"Elevated cortisol, oxytocin-driven hypervigilance, and the maternal brain's rewired threat-detection circuitry create a state primed for anxiety. Sleep deprivation amplifies everything.",
    treatment:"Therapy (CBT), SSRI/SNRI medication, mindfulness-based interventions. Partner and social support are critical protective factors.",
    whenToAct:"When anxiety interferes with sleep, feeding, or daily function. Sooner is measurably better. PPA is often missed because hypervigilance in new mothers appears 'normal.'",
  },
  { id:"ppp", title:"Postpartum Psychosis", emoji:"🚨", color:C.warn,
    onset:"Usually within 72 hours", duration:"Days to weeks with treatment", prevalence:"~0.1–0.2% (25% in bipolar disorder)",
    symptoms:["Confusion and disorientation","Hallucinations (seeing/hearing things)","Delusions, especially about baby","Rapid mood cycling","Extreme insomnia without fatigue"],
    cause:"Rapid hormonal shifts interacting with neurological vulnerability. Strongest risk factor is personal or family history of bipolar disorder.",
    treatment:"PSYCHIATRIC EMERGENCY. Hospitalization typically required. Highly treatable with immediate intervention. Do not leave the mother alone.",
    whenToAct:"IMMEDIATELY. This is a medical emergency equivalent to a cardiac event. Call emergency services. Do not wait for morning.",
  },
];

const brainFacts = [
  { icon:"🧠", title:"Gray Matter Specialization", body:"Pregnancy reduces gray matter volume in specific brain regions — not damage, but hyperspecialization. These areas become measurably more efficient at reading infant social cues and predicting baby's needs." },
  { icon:"👁️", title:"Threat Circuitry Rewired", body:"The amygdala (threat detection) becomes hyperresponsive. New mothers cannot tune out a crying baby — this is hardwired survival circuitry, not anxiety disorder." },
  { icon:"🔗", title:"Reward System Bonded", body:"The dopamine and oxytocin reward circuits become tightly linked to infant cues. A baby's face activates the same neural reward regions as food and sex. Love is, literally, neurological." },
  { icon:"🌫️", title:"'Mommy Brain' is Real", body:"Sleep deprivation + hormonal shifts + cortisol elevation impair verbal memory, spatial cognition, and processing speed. This is documented, physiological, and reverses with sleep and hormonal stabilization." },
  { icon:"⏳", title:"Changes Persist for Years", body:"Some maternal brain changes persist for at least 2 years — possibly much longer. This is the biological encoding of parenthood. Not a deficit. A transformation." },
];

const quizzes = [
  { q:"Baby blues typically resolve within:", options:["24 hours","2 weeks","6 weeks","3 months"], correct:1, explanation:"Baby blues resolve within 2 weeks postpartum. They are driven by the hormonal crash and resolve as the brain adapts to its new baseline. Symptoms persisting beyond 2 weeks warrant PPD evaluation." },
  { q:"Which hormone triggers the milk let-down reflex (not milk production)?", options:["Estrogen","Progesterone","Prolactin","Oxytocin"], correct:3, explanation:"Oxytocin triggers the let-down reflex that moves milk through the ducts. Prolactin produces the milk. Stress can inhibit oxytocin release — which is why a tense or anxious nursing mother may have let-down difficulty." },
  { q:"Postpartum depression can first appear:", options:["Only in the first week","Only within 6 weeks","Up to 12 months postpartum","Only while breastfeeding"], correct:2, explanation:"PPD can onset anytime within the first year. Late-onset PPD (after 3 months) is common and frequently missed. Any screening that ends at 6 weeks is insufficient." },
  { q:"Postpartum thyroiditis affects approximately what percentage of mothers?", options:["Less than 1%","1–2%","5–7%","15–20%"], correct:2, explanation:"Postpartum thyroiditis affects 5–7% of postpartum women, typically emerging 6–12 weeks postpartum. It can mimic PPD symptoms exactly and is frequently undiagnosed." },
  { q:"Which of these is a normal postpartum experience that does NOT require medical attention?", options:["Soaking more than 1 pad/hour","Postpartum hair loss at 3 months","Calf swelling and pain","Persistent fever above 38°C"], correct:1, explanation:"Postpartum alopecia (hair shedding) at 2–4 months is caused by the dramatic drop in estrogen. Up to 40% of hair can shed temporarily. It resolves completely without treatment within 12 months." },
];

const myths = [
  { myth:"You'll instantly bond with your baby at birth", fact:"Bonding is a neurological process that develops over time. Many mothers feel disconnected or numb initially. This is common, does not reflect love, and does not predict the quality of the relationship.", id:"m1" },
  { myth:"Breastfeeding is effective birth control", fact:"Lactational amenorrhea provides ~98% protection only when all three criteria are met simultaneously: baby under 6 months, exclusive breastfeeding with no pacifier, and no return of menstrual period. Many mothers ovulate before their first postpartum period, making pregnancy possible before any period returns.", id:"m2" },
  { myth:"The 6-week clearance means you're fully recovered", fact:"The 6-week visit checks specific healing markers — not the pelvic floor, not hormonal rebalancing, not brain changes, not mental health in most practices. Full recovery is a 6–18 month process.", id:"m3" },
  { myth:"Postpartum depression means you're a bad mother or don't love your baby", fact:"PPD is a medical condition driven by neurobiological changes to a brain under hormonal withdrawal and chronic sleep deprivation. It has no relationship to love, character, or parenting quality.", id:"m4" },
  { myth:"Baby blues and postpartum depression are the same thing", fact:"Baby blues is a brief, self-resolving hormonal adjustment under 2 weeks. PPD is a clinical disorder requiring treatment that does not resolve on its own. The key distinctions are duration, severity, and functional impact.", id:"m5" },
  { myth:"You should be back to your old self within 3 months", fact:"Matrescence — the identity transformation into motherhood — is a profound neurological and psychological process that unfolds over years. The goal is not returning to who you were. It is integrating who you are becoming.", id:"m6" },
];

const supportData = {
  mothers: { label:"New Mothers", icon:"🤱", color:C.terra,
    tips:[
      { title:"Accept the Hormone Reality", body:"Your estrogen dropped ~1,000× in 24 hours. You are not broken — you are in one of the most extreme hormonal environments a human body can experience. Every emotion has a molecular cause." },
      { title:"Rest IS Medical Treatment", body:"Sleep deprivation elevates cortisol, suppresses immunity, and amplifies every emotional challenge. Choosing rest over housework is a clinical decision, not a character flaw." },
      { title:"Matrescence is Real", body:"You are not 'getting back to normal' — you are becoming someone new. This identity transformation is neurologically driven and deserves the same respect as any major life passage." },
      { title:"Ask for the Pelvic Floor Referral", body:"All postpartum women benefit from pelvic floor physiotherapy — not just those with symptoms. Leaking, heaviness, or pain are not inevitable parts of motherhood. Ask your provider explicitly for the referral." },
      { title:"Know the Timeline for Baby Blues", body:"Crying and emotional waves in Days 3–5 are hormonal — not your parenting. But if symptoms persist past 2 weeks, tell your provider. That is the moment to speak up, not wait and hope." },
    ],
    warnings:["Thoughts of harming yourself or your baby","Unable to sleep even when baby sleeps for multiple nights in a row","Feeling completely disconnected from your baby beyond 2 weeks","Confusion, paranoia, or hearing or seeing things (call emergency services immediately)","Soaking more than 1 pad/hour or passing clots larger than a golf ball"],
  },
  partners: { label:"Partners", icon:"🤝", color:C.sage,
    tips:[
      { title:"Learn the Biology — Then Use It", body:"The hormonal crash after birth is pharmacological, not emotional weakness. Estrogen and progesterone fell 1,000× in 24 hours. 'You should feel happy' is physiologically impossible. Empathy without minimizing is everything." },
      { title:"Night Duty is Medical Support", body:"Even one full night of sleep per week measurably reduces PPD risk. Partner involvement in nighttime care is one of the strongest protective factors documented in the literature." },
      { title:"Take Over Without Asking", body:"Decision fatigue is a real cognitive load. A brain managing hormonal withdrawal + sleep deprivation + infant care cannot also manage household logistics. Take over decisions, meals, and communications without waiting to be asked." },
      { title:"Watch Yourself Too", body:"10% of fathers and co-parents experience postpartum depression. Testosterone drops, cortisol rises, and identity shifts in partners too. Check in with yourself. Getting support is not weakness." },
      { title:"Physical Recovery is Invisible", body:"She may look fine externally. Internal healing, pelvic floor recovery, and hormonal rebalancing are invisible. Do not assume recovery by appearance or by what she says when she's protecting your feelings." },
    ],
    warnings:["Partner expressing thoughts of self-harm or harm to baby","Partner seeming confused, paranoid, or behaving in ways that are out of character (call emergency services)","Partner completely unable to bond with or care for baby after 2 weeks","Partner unable to sleep at all, even when baby is cared for"],
  },
  doulas: { label:"Doulas", icon:"🌸", color:C.rose,
    tips:[
      { title:"Name the Hormones", body:"When a mother is overwhelmed on Day 4, naming the biology is profoundly validating: 'Your progesterone just hit near-zero. Your estrogen crashed 1,000-fold yesterday. This is pharmacological — not personal, not permanent.'" },
      { title:"Normalize AND Validate Simultaneously", body:"'This is normal' and 'Your feelings matter enormously' are both true and should be said together. Neither minimizes the other." },
      { title:"Screen Actively — Refer Quickly", body:"Use the EPDS at every postpartum visit. Know your local mental health referral pathways before they are ever needed. The barrier to referral should be zero." },
      { title:"Watch for Postpartum Thyroiditis", body:"Fatigue and mood changes at 6–12 weeks that don't fit the typical PPD trajectory — especially with heart palpitations, hair loss, or temperature sensitivity — may indicate thyroid dysfunction. Advocate for a thyroid panel." },
      { title:"Include the Partner in Every Visit", body:"Postpartum care that actively includes and supports the partner measurably improves maternal outcomes. Extend your care intentionally beyond the mother." },
    ],
    warnings:["Any report of intrusive thoughts about harming baby — requires immediate clinical escalation, not reassurance","Signs of postpartum psychosis: confusion, paranoia, hallucinations, mania, or disorientation","Unresolved fever combined with breast pain (mastitis requiring antibiotics)","Excessive or recurring bright-red bleeding beyond the first week"],
  },
  hcp: { label:"Healthcare Providers", icon:"🩺", color:C.blue,
    tips:[
      { title:"Extend the Screening Window to 12 Months", body:"ACOG recommends PPD screening at birth hospitalization, 3-week contact, and 1, 2, 4, and 6 month well-child visits. PPD can onset up to 12 months postpartum. A single 6-week screen is insufficient." },
      { title:"Screen for PPA as Actively as PPD", body:"Postpartum anxiety affects more women than PPD but is less frequently screened. Generalized anxiety, OCD-type intrusive thoughts, and panic disorder are all common and treatable postpartum presentations." },
      { title:"Consider Postpartum Thyroiditis", body:"Up to 7% of postpartum women develop PPT, typically at 6–12 weeks. When the mood presentation is atypical — especially with somatic symptoms — include TSH and free T4 in the workup before defaulting to an antidepressant." },
      { title:"Make Pelvic Floor Referral Universal Protocol", body:"All postpartum patients benefit from pelvic floor physiotherapy — not only those presenting with dysfunction. Normalize this referral the same way you normalize newborn hearing screening." },
      { title:"Adopt the '4th Trimester' Framework", body:"Framing the first 3 months as a continuation of the pregnancy-care continuum — with proactive rather than reactive medical support — measurably improves engagement, outcomes, and patient trust." },
    ],
    warnings:["EPDS score ≥10: follow-up assessment; ≥13: referral to mental health","Any report of psychotic symptoms: emergency psychiatric evaluation — do not delay","Post-birth fever >38°C: workup for endometritis, mastitis, wound infection","Persistent hypertension >12 weeks postpartum: evaluate for late postpartum preeclampsia","New or worsening cardiac symptoms at any point: rule out peripartum cardiomyopathy"],
  },
};

// ─── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function HormoneChart({ selectedId, setSelectedId, bfMode, setBfMode }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const W = 760, H = 210;
  const pad = { l:10, r:10, t:10, b:22 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const pts = (h) => {
    const curve = bfMode ? h.curveBF : h.curveNBF;
    return curve.map((v, i) => [pad.l + (i/(curve.length-1))*pw, pad.t + ph - (v/100)*ph]);
  };
  const str = (p) => p.map(([x,y])=>`${x},${y}`).join(" ");
  const sel = hormones.find(h => h.id === selectedId);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:14 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {hormones.map(h => (
            <button key={h.id} onClick={() => setSelectedId(selectedId===h.id ? null : h.id)} style={{
              background: selectedId===h.id ? h.color : "rgba(255,220,185,0.06)",
              border:`1px solid ${selectedId===h.id ? h.color : "rgba(255,220,185,0.12)"}`,
              color: selectedId===h.id ? "#130b07" : h.color,
              borderRadius:20, padding:"4px 12px", fontSize:12,
              fontFamily:"'DM Mono',monospace", cursor:"pointer", transition:"all 0.2s",
            }}>{h.emoji} {h.name}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:3, background:"rgba(255,220,185,0.06)", borderRadius:20, padding:3, border:"1px solid rgba(255,220,185,0.1)" }}>
          {["Breastfeeding","Not Breastfeeding"].map((lbl,i) => (
            <button key={i} onClick={() => setBfMode(i===0)} style={{
              background: bfMode===(i===0) ? "rgba(255,220,185,0.14)" : "transparent",
              border:"none", color: bfMode===(i===0) ? C.cream : C.muted,
              borderRadius:16, padding:"4px 12px", fontSize:11,
              fontFamily:"'DM Mono',monospace", cursor:"pointer", transition:"all 0.2s",
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ position:"relative" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ overflow:"visible" }}>
          {[25,50,75].map(v => (
            <line key={v} x1={pad.l} y1={pad.t+ph-(v/100)*ph} x2={W-pad.r} y2={pad.t+ph-(v/100)*ph}
              stroke="rgba(255,220,185,0.06)" strokeWidth="1" />
          ))}
          {[260,540].map((x,i) => (
            <g key={i}>
              <line x1={x} y1={pad.t} x2={x} y2={pad.t+ph} stroke="rgba(255,220,185,0.08)" strokeWidth="1" strokeDasharray="4,4" />
              <text x={x+5} y={pad.t+8} fontSize={8} fill="rgba(240,234,224,0.22)" fontFamily="'DM Mono',monospace">
                {i===0?"3m":"6m"}
              </text>
            </g>
          ))}
          {hormones.map(h => {
            const p = pts(h), isVis = !selectedId||selectedId===h.id;
            return (
              <g key={h.id}>
                <polyline points={str(p)} fill="none" stroke={h.color}
                  strokeWidth={selectedId===h.id?2.5:1.5} strokeOpacity={isVis?1:0.12} style={{ transition:"all 0.3s" }} />
                {selectedId===h.id && p.map(([x,y],i2) => (
                  <circle key={i2} cx={x} cy={y} r={hoverIdx===i2?5:3} fill={h.color} opacity={0.9}
                    onMouseEnter={()=>setHoverIdx(i2)} onMouseLeave={()=>setHoverIdx(null)}
                    style={{ cursor:"pointer", transition:"r 0.15s" }} />
                ))}
              </g>
            );
          })}
          {hoverIdx!==null && selectedId && (() => {
            const p=pts(sel); if(!p[hoverIdx]) return null;
            return <line x1={p[hoverIdx][0]} y1={pad.t} x2={p[hoverIdx][0]} y2={pad.t+ph}
              stroke="rgba(255,220,185,0.22)" strokeWidth="1" />;
          })()}
          {timeLabels.map((l,i) => (
            <text key={i} x={pad.l+(i/(timeLabels.length-1))*pw} y={H-3}
              textAnchor="middle" fontSize={8} fill="rgba(240,234,224,0.3)" fontFamily="'DM Mono',monospace">{l}</text>
          ))}
        </svg>
        {hoverIdx!==null && sel && (
          <div style={{ position:"absolute",top:8,right:8,background:"rgba(19,11,7,0.92)",border:`1px solid ${sel.color}40`,borderRadius:8,padding:"6px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",color:sel.color,pointerEvents:"none" }}>
            {timeLabels[hoverIdx]}: {(bfMode?sel.curveBF:sel.curveNBF)[hoverIdx]}%
          </div>
        )}
      </div>

      {sel && (
        <div style={{ marginTop:16,padding:18,background:`linear-gradient(135deg,${sel.color}12,rgba(19,11,7,0.4))`,border:`1px solid ${sel.color}30`,borderRadius:14 }}>
          <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 220px" }}>
              <h4 style={{ fontFamily:"'Cormorant Garamond',serif",color:sel.color,margin:"0 0 6px",fontSize:19 }}>{sel.emoji} {sel.name}</h4>
              <p style={{ color:C.muted,fontSize:13,lineHeight:1.65,margin:0 }}>{sel.desc}</p>
            </div>
            <div style={{ flex:"1 1 180px" }}>
              <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8 }}>EFFECTS</div>
              {sel.effects.map((e,i) => (
                <div key={i} style={{ display:"flex",gap:8,alignItems:"center",marginBottom:5 }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:sel.color,flexShrink:0 }} />
                  <span style={{ fontSize:12,color:C.muted }}>{e}</span>
                </div>
              ))}
            </div>
            <div style={{ flex:"1 1 220px" }}>
              <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8 }}>🎢 THE PATTERN</div>
              <div style={{ background:`${sel.color}10`,border:`1px solid ${sel.color}22`,borderRadius:10,padding:12,fontSize:12.5,color:C.muted,lineHeight:1.65 }}>{sel.insight}</div>
            </div>
          </div>
        </div>
      )}
      {!sel && (
        <div style={{ marginTop:12,textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"10px 0" }}>
          ↑ Click a hormone above to isolate its curve and reveal its effects
        </div>
      )}
    </div>
  );
}

function FortyEightHours() {
  const [step, setStep] = useState(0);
  const steps = [
    { title:"Peak: During Labor", sub:"Hours before delivery", color:C.sage,
      bars:[{label:"Estrogen",val:100,c:C.sage},{label:"Progesterone",val:100,c:C.amber},{label:"Oxytocin",val:88,c:C.terra},{label:"Cortisol",val:84,c:C.blue},{label:"Prolactin",val:28,c:C.rose}],
      desc:"At the moment of birth, estrogen and progesterone are at their absolute peak — levels the body will never see again. The brain is flooded with oxytocin driving contractions and bonding. Cortisol is elevated from labor stress. Prolactin is quietly building." },
    { title:"The Placenta Delivers", sub:"Minutes after delivery", color:C.terra,
      bars:[{label:"Estrogen",val:8,c:C.sage},{label:"Progesterone",val:2,c:C.amber},{label:"Oxytocin",val:82,c:C.terra},{label:"Cortisol",val:90,c:C.blue},{label:"Prolactin",val:88,c:C.rose}],
      desc:"The placenta — sole source of estrogen and progesterone — is gone. Both hormones collapse toward zero within minutes. Prolactin surges. Oxytocin peaks during skin-to-skin. This is the most rapid, largest-scale hormonal change in human biology. Nothing else comes close." },
    { title:"Hours 24–48: The Crash", sub:"Baby blues window opens", color:C.rose,
      bars:[{label:"Estrogen",val:3,c:C.sage},{label:"Progesterone",val:1,c:C.amber},{label:"Oxytocin",val:72,c:C.terra},{label:"Cortisol",val:93,c:C.blue},{label:"Prolactin",val:95,c:C.rose}],
      desc:"Estrogen and progesterone are near-zero. The brain in hormonal withdrawal. Milk is coming in. Afterpains are active. Sleep deprivation is compounding cortisol. This is why Day 3–5 is often the emotional peak of baby blues — every biological pressure is simultaneously maximal.",
      alert:"Baby blues resolves within 2 weeks as the brain adapts. If emotional symptoms persist or worsen beyond 2 weeks, PPD evaluation is indicated. Both are real — only one requires clinical intervention." },
    { title:"Week 2: Adapting", sub:"Baby blues resolving", color:C.sand,
      bars:[{label:"Estrogen",val:12,c:C.sage},{label:"Progesterone",val:5,c:C.amber},{label:"Oxytocin",val:72,c:C.terra},{label:"Cortisol",val:83,c:C.blue},{label:"Prolactin",val:92,c:C.rose}],
      desc:"Baby blues typically resolve as the brain begins calibrating to its new hormonal baseline. Cortisol remains high from sleep deprivation. Prolactin continues driving milk. Estrogen and progesterone remain very low — especially in breastfeeding mothers." },
  ];
  const s = steps[step];
  return (
    <div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
        {steps.map((st,i) => (
          <button key={i} onClick={()=>setStep(i)} style={{
            flex:"1 1 140px",background:step===i?`${st.color}18`:"rgba(255,220,185,0.04)",
            border:`1px solid ${step===i?st.color:"rgba(255,220,185,0.08)"}`,
            borderRadius:12,padding:"12px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",
          }}>
            <div style={{ fontSize:10,fontFamily:"'DM Mono',monospace",color:step===i?st.color:C.faint,letterSpacing:"0.1em",marginBottom:2 }}>{st.sub}</div>
            <div style={{ fontSize:13,fontFamily:"'Cormorant Garamond',serif",color:step===i?C.cream:C.muted }}>{st.title}</div>
          </button>
        ))}
      </div>
      <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
        <div style={{ flex:"1 1 200px" }}>
          {s.bars.map((b,i) => (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:12,fontFamily:"'DM Mono',monospace",color:b.c }}>{b.label}</span>
                <span style={{ fontSize:11,color:C.faint,fontFamily:"'DM Mono',monospace" }}>{b.val}%</span>
              </div>
              <div style={{ height:8,background:"rgba(255,220,185,0.07)",borderRadius:4,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${b.val}%`,background:b.c,borderRadius:4,transition:"width 0.6s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",marginTop:4 }}>Relative levels — illustrative</div>
        </div>
        <div style={{ flex:"1 1 240px" }}>
          <div style={{ background:`${s.color}10`,border:`1px solid ${s.color}25`,borderRadius:14,padding:18,marginBottom:s.alert?14:0 }}>
            <div style={{ fontSize:10,color:s.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8 }}>{s.sub.toUpperCase()}</div>
            <p style={{ color:C.muted,fontSize:13,lineHeight:1.7,margin:0 }}>{s.desc}</p>
          </div>
          {s.alert && (
            <div style={{ background:"rgba(232,117,117,0.1)",border:"1px solid rgba(232,117,117,0.25)",borderRadius:12,padding:14 }}>
              <div style={{ fontSize:10,color:C.warn,fontFamily:"'DM Mono',monospace",marginBottom:6 }}>⚠️ BABY BLUES vs PPD</div>
              <div style={{ fontSize:12,color:C.muted,lineHeight:1.6 }}>{s.alert}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhasesSection() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("physical");
  const tabs = [{id:"physical",label:"🩺 Physical"},{id:"hormonal",label:"🧪 Hormonal"},{id:"emotional",label:"💭 Emotional"},{id:"misconceptions",label:"❌ Myths"}];
  const p = phases.find(ph=>ph.id===active);
  return (
    <div>
      <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:20 }}>
        {phases.map(ph => (
          <button key={ph.id} onClick={()=>{setActive(active===ph.id?null:ph.id);setTab("physical");}} style={{
            flex:"1 1 140px",background:active===ph.id?`${ph.color}18`:"rgba(255,220,185,0.04)",
            border:`1px solid ${active===ph.id?ph.color:"rgba(255,220,185,0.08)"}`,
            borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{ fontSize:22,marginBottom:6 }}>{ph.icon}</div>
            <div style={{ fontSize:11,fontFamily:"'DM Mono',monospace",color:ph.color,marginBottom:3 }}>{ph.label}</div>
            <div style={{ fontSize:13,fontFamily:"'Cormorant Garamond',serif",color:C.cream,fontStyle:"italic" }}>{ph.subtitle}</div>
          </button>
        ))}
      </div>
      {p && (
        <div style={{ background:`linear-gradient(135deg,${p.color}0a,rgba(19,11,7,0.5))`,border:`1px solid ${p.color}25`,borderRadius:18,padding:22 }}>
          <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:18 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                background:tab===t.id?`${p.color}20`:"rgba(255,220,185,0.05)",
                border:`1px solid ${tab===t.id?p.color:"rgba(255,220,185,0.1)"}`,
                borderRadius:20,padding:"5px 14px",fontSize:12,
                fontFamily:"'DM Mono',monospace",color:tab===t.id?p.color:C.muted,cursor:"pointer",transition:"all 0.2s",
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10 }}>
            {(p[tab]||[]).map((item,i) => (
              <div key={i} style={{ background:"rgba(255,220,185,0.04)",border:"1px solid rgba(255,220,185,0.07)",borderRadius:10,padding:13 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:p.color,marginBottom:8 }} />
                {tab==="misconceptions" ? (
                  <div style={{ fontSize:12.5,color:C.muted,lineHeight:1.6 }}>
                    <span style={{ color:C.warn,fontFamily:"'DM Mono',monospace",fontSize:9.5 }}>MYTH: </span>
                    {item.includes(" — ") ? item.split(" — ")[0] : item}
                    {item.includes(" — ") && <><br/><span style={{ color:p.color,fontFamily:"'DM Mono',monospace",fontSize:9.5 }}>FACT: </span>
                    <span style={{ color:"rgba(240,234,224,0.65)" }}>{item.split(" — ")[1]}</span></>}
                  </div>
                ) : (
                  <div style={{ fontSize:12.5,color:C.muted,lineHeight:1.6 }}>{item}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {!active && (
        <div style={{ textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"20px 0" }}>
          ↑ Select a recovery phase above to explore physical, hormonal, and emotional milestones
        </div>
      )}
    </div>
  );
}

function BrainSection() {
  const [active, setActive] = useState(null);
  const c = conditions.find(cond=>cond.id===active);
  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>THE MATERNAL BRAIN — KEY CHANGES</div>
        <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
          {brainFacts.map((f,i) => (
            <div key={i} style={{ flex:"1 1 175px",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14 }}>
              <div style={{ fontSize:20,marginBottom:6 }}>{f.icon}</div>
              <div style={{ fontSize:13,color:C.terra,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,marginBottom:5 }}>{f.title}</div>
              <div style={{ fontSize:12,color:C.muted,lineHeight:1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>MENTAL HEALTH SPECTRUM — CLICK TO EXPAND</div>
      <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:16 }}>
        {conditions.map(cond => (
          <button key={cond.id} onClick={()=>setActive(active===cond.id?null:cond.id)} style={{
            flex:"1 1 155px",background:active===cond.id?`${cond.color}18`:"rgba(255,220,185,0.04)",
            border:`1px solid ${active===cond.id?cond.color:"rgba(255,220,185,0.08)"}`,
            borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{ fontSize:24,marginBottom:6 }}>{cond.emoji}</div>
            <div style={{ fontSize:14,color:cond.color,fontFamily:"'Cormorant Garamond',serif",fontWeight:600 }}>{cond.title}</div>
            <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",marginTop:4 }}>{cond.prevalence}</div>
          </button>
        ))}
      </div>
      {c && (
        <div style={{ background:`linear-gradient(135deg,${c.color}0e,rgba(19,11,7,0.5))`,border:`1px solid ${c.color}30`,borderRadius:16,padding:20 }}>
          <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 200px" }}>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
                {[{l:"Onset",v:c.onset},{l:"Duration",v:c.duration},{l:"Prevalence",v:c.prevalence}].map((item,i) => (
                  <div key={i} style={{ background:"rgba(255,220,185,0.05)",borderRadius:8,padding:"8px 12px" }}>
                    <div style={{ fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace" }}>{item.l}</div>
                    <div style={{ fontSize:11.5,color:c.color }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8 }}>SYMPTOMS</div>
              {c.symptoms.map((s,i) => (
                <div key={i} style={{ display:"flex",gap:8,alignItems:"center",marginBottom:5 }}>
                  <div style={{ width:4,height:4,borderRadius:"50%",background:c.color,flexShrink:0 }} />
                  <span style={{ fontSize:12,color:C.muted }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ flex:"1 1 220px" }}>
              <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:6 }}>CAUSE</div>
              <p style={{ fontSize:12.5,color:C.muted,lineHeight:1.65,marginBottom:14 }}>{c.cause}</p>
              <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:6 }}>TREATMENT</div>
              <p style={{ fontSize:12.5,color:C.muted,lineHeight:1.65,marginBottom:14 }}>{c.treatment}</p>
              <div style={{ background:c.id==="ppp"?"rgba(232,117,117,0.14)":"rgba(255,220,185,0.05)",border:`1px solid ${c.color}30`,borderRadius:10,padding:12 }}>
                <div style={{ fontSize:10,color:c.color,fontFamily:"'DM Mono',monospace",marginBottom:4 }}>⏰ WHEN TO ACT</div>
                <div style={{ fontSize:12.5,color:C.muted,lineHeight:1.5 }}>{c.whenToAct}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BodySection() {
  const [active, setActive] = useState(null);
  const [stage, setStage] = useState(0);
  const sys = bodySystem.find(s=>s.id===active);
  return (
    <div>
      <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:20 }}>
        {bodySystem.map(s => (
          <button key={s.id} onClick={()=>{setActive(active===s.id?null:s.id);setStage(0);}} style={{
            flex:"1 1 130px",background:active===s.id?`${s.color}18`:"rgba(255,220,185,0.04)",
            border:`1px solid ${active===s.id?s.color:"rgba(255,220,185,0.08)"}`,
            borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{ fontSize:22,marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:13,color:active===s.id?s.color:C.muted,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,lineHeight:1.3 }}>{s.label}</div>
          </button>
        ))}
      </div>
      {sys && (
        <div style={{ background:`linear-gradient(135deg,${sys.color}0c,rgba(19,11,7,0.5))`,border:`1px solid ${sys.color}28`,borderRadius:18,padding:22 }}>
          <p style={{ color:C.muted,fontSize:13.5,lineHeight:1.65,marginBottom:18 }}>{sys.summary}</p>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
            {sys.stages.map((st,i) => (
              <button key={i} onClick={()=>setStage(i)} style={{
                background:stage===i?`${sys.color}20`:"rgba(255,220,185,0.05)",
                border:`1px solid ${stage===i?sys.color:"rgba(255,220,185,0.08)"}`,
                borderRadius:20,padding:"5px 14px",fontSize:11,
                fontFamily:"'DM Mono',monospace",color:stage===i?sys.color:C.muted,cursor:"pointer",transition:"all 0.2s",
              }}>{st.label}</button>
            ))}
          </div>
          <div style={{ background:"rgba(255,220,185,0.04)",border:"1px solid rgba(255,220,185,0.08)",borderRadius:12,padding:16,marginBottom:14 }}>
            <p style={{ color:"rgba(240,234,224,0.72)",fontSize:13.5,lineHeight:1.65,margin:0 }}>{sys.stages[stage].detail}</p>
          </div>
          <div style={{ background:"rgba(232,117,117,0.09)",border:"1px solid rgba(232,117,117,0.2)",borderRadius:12,padding:14 }}>
            <div style={{ fontSize:10,color:C.warn,fontFamily:"'DM Mono',monospace",marginBottom:6 }}>⚠️ WARNING SIGNS</div>
            <p style={{ color:"rgba(240,234,224,0.65)",fontSize:12.5,lineHeight:1.6,margin:0 }}>{sys.warning}</p>
          </div>
        </div>
      )}
      {!active && (
        <div style={{ textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"20px 0" }}>
          ↑ Select a body system above to explore its recovery stages and warning signs
        </div>
      )}
    </div>
  );
}

function LearningSection() {
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [mythOpen, setMythOpen] = useState({});
  const q = quizzes[qIdx];

  const answer = (i) => {
    if (sel!==null) return;
    setSel(i);
    if (i===q.correct) setScore(s=>s+1);
  };
  const next = () => {
    if (qIdx<quizzes.length-1) { setQIdx(q=>q+1); setSel(null); }
    else setDone(true);
  };
  const reset = () => { setQIdx(0);setSel(null);setScore(0);setDone(false); };

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>
          KNOWLEDGE CHECK {done?`— ${score}/${quizzes.length} CORRECT`:`— QUESTION ${qIdx+1} OF ${quizzes.length}`}
        </div>
        {!done ? (
          <div style={{ background:"rgba(255,220,185,0.04)",border:"1px solid rgba(255,220,185,0.1)",borderRadius:16,padding:22 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.cream,lineHeight:1.5,marginBottom:18 }}>{q.q}</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:sel!==null?16:0 }}>
              {q.options.map((opt,i) => {
                let bg="rgba(255,220,185,0.04)",bdr="rgba(255,220,185,0.1)",clr=C.muted;
                if (sel!==null) {
                  if (i===q.correct){bg="rgba(143,188,170,0.2)";bdr=C.sage;clr=C.sage;}
                  else if (i===sel){bg="rgba(232,117,117,0.15)";bdr=C.warn;clr=C.warn;}
                }
                return (
                  <button key={i} onClick={()=>answer(i)} style={{
                    background:bg,border:`1px solid ${bdr}`,borderRadius:10,
                    padding:"10px 14px",textAlign:"left",cursor:sel!==null?"default":"pointer",
                    color:clr,fontSize:13,fontFamily:"'DM Mono',monospace",transition:"all 0.2s",
                  }}>
                    <span style={{ opacity:0.5 }}>{String.fromCharCode(65+i)}. </span>{opt}
                  </button>
                );
              })}
            </div>
            {sel!==null && (
              <>
                <div style={{ background:"rgba(255,220,185,0.05)",border:"1px solid rgba(255,220,185,0.1)",borderRadius:10,padding:14,marginBottom:14,marginTop:16 }}>
                  <div style={{ fontSize:10,color:C.terra,fontFamily:"'DM Mono',monospace",marginBottom:6 }}>EXPLANATION</div>
                  <p style={{ fontSize:13,color:C.muted,lineHeight:1.65,margin:0 }}>{q.explanation}</p>
                </div>
                <button onClick={next} style={{
                  background:`${C.terra}20`,border:`1px solid ${C.terra}`,borderRadius:10,
                  padding:"8px 20px",color:C.terra,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer",
                }}>{qIdx<quizzes.length-1?"Next Question →":"See Results →"}</button>
              </>
            )}
          </div>
        ) : (
          <div style={{ background:"rgba(255,220,185,0.04)",border:"1px solid rgba(255,220,185,0.1)",borderRadius:16,padding:28,textAlign:"center" }}>
            <div style={{ fontSize:44,marginBottom:12 }}>{score===quizzes.length?"🌟":score>=3?"🌸":"🌱"}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:C.cream,marginBottom:8 }}>{score}/{quizzes.length} Correct</div>
            <p style={{ color:C.muted,fontSize:14,marginBottom:20,maxWidth:400,margin:"0 auto 20px" }}>
              {score===quizzes.length?"Excellent understanding of postpartum physiology and care.":score>=3?"Good foundation — review the sections where you felt uncertain.":"Great start. The Hormone Timeline and Brain & Mental Health sections will deepen your understanding."}
            </p>
            <button onClick={reset} style={{
              background:`${C.terra}20`,border:`1px solid ${C.terra}`,
              borderRadius:10,padding:"8px 20px",color:C.terra,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer",
            }}>Retry Quiz</button>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>
          MYTH vs FACT — CLICK ANY ROW TO REVEAL
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {myths.map(m => {
            const open = !!mythOpen[m.id];
            return (
              <div key={m.id} onClick={()=>setMythOpen(p=>({...p,[m.id]:!open}))} style={{
                background:open?"rgba(255,220,185,0.06)":"rgba(255,220,185,0.03)",
                border:`1px solid ${open?"rgba(255,220,185,0.18)":"rgba(255,220,185,0.07)"}`,
                borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.2s",
              }}>
                <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                  <span style={{ fontSize:12,color:C.warn,fontFamily:"'DM Mono',monospace",flexShrink:0,marginTop:1 }}>{open?"✗":"?"} MYTH:</span>
                  <span style={{ fontSize:13,color:C.muted,lineHeight:1.5 }}>{m.myth}</span>
                </div>
                {open && (
                  <div style={{ marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,220,185,0.08)" }}>
                    <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                      <span style={{ fontSize:12,color:C.sage,fontFamily:"'DM Mono',monospace",flexShrink:0,marginTop:1 }}>✓ FACT:</span>
                      <span style={{ fontSize:13,color:"rgba(240,234,224,0.72)",lineHeight:1.6 }}>{m.fact}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SupportSection() {
  const [aud, setAud] = useState("mothers");
  const d = supportData[aud];
  return (
    <div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
        {Object.entries(supportData).map(([key,val]) => (
          <button key={key} onClick={()=>setAud(key)} style={{
            flex:"1 1 120px",background:aud===key?`${val.color}18`:"rgba(255,220,185,0.04)",
            border:`1px solid ${aud===key?val.color:"rgba(255,220,185,0.08)"}`,
            borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.25s",textAlign:"left",
          }}>
            <div style={{ fontSize:20,marginBottom:4 }}>{val.icon}</div>
            <div style={{ fontSize:12,fontFamily:"'DM Mono',monospace",color:aud===key?val.color:C.muted }}>{val.label}</div>
          </button>
        ))}
      </div>
      <div style={{ fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>
        GUIDANCE FOR {d.label.toUpperCase()}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:22 }}>
        {d.tips.map((tip,i) => (
          <div key={i} style={{ background:"rgba(255,220,185,0.04)",border:"1px solid rgba(255,220,185,0.08)",borderRadius:12,padding:16,display:"flex",gap:14 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:`${d.color}20`,border:`1px solid ${d.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:d.color,fontFamily:"'DM Mono',monospace",flexShrink:0 }}>{i+1}</div>
            <div>
              <div style={{ fontSize:14,color:d.color,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,marginBottom:4 }}>{tip.title}</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.65 }}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"rgba(232,117,117,0.08)",border:"1px solid rgba(232,117,117,0.2)",borderRadius:16,padding:18 }}>
        <div style={{ fontSize:10,color:C.warn,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14 }}>⚠️ WARNING SIGNS — SEEK CARE IMMEDIATELY</div>
        {d.warnings.map((w,i) => (
          <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:9 }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:C.warn,flexShrink:0,marginTop:5 }} />
            <span style={{ fontSize:13,color:"rgba(240,234,224,0.72)",lineHeight:1.5 }}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAVIGATION DATA ──────────────────────────────────────────────────────────
const navItems = [
  {id:"hormones",label:"Hormone Timeline",short:"Hormones",icon:"📈"},
  {id:"48h",label:"First 48 Hours",short:"48 Hours",icon:"⏰"},
  {id:"phases",label:"Recovery Phases",short:"Phases",icon:"🗓️"},
  {id:"brain",label:"Brain & Mental Health",short:"Brain",icon:"🧠"},
  {id:"body",label:"Body Recovery",short:"Body",icon:"🩺"},
  {id:"learning",label:"Quizzes & Myths",short:"Learn",icon:"📚"},
  {id:"support",label:"Support Guide",short:"Support",icon:"🤝"},
];
const sectionMeta = {
  hormones: { title:"Postpartum Hormone Timeline", sub:"12-month interactive chart — isolate any hormone to understand its effects" },
  "48h": { title:"The First 48 Hours", sub:"The most rapid hormonal collapse in human biology, visualized step by step" },
  phases: { title:"Recovery Phases", sub:"Five stages from birth to 12 months — click any phase to explore physical, hormonal, and emotional milestones" },
  brain: { title:"Brain & Mental Health", sub:"Maternal brain rewiring, bonding science, and the full mental health spectrum" },
  body: { title:"Body Recovery Dashboard", sub:"Six recovery systems — select each to explore stages and warning signs" },
  learning: { title:"Knowledge Checks & Myth Busting", sub:"Quiz yourself and challenge the misconceptions that cause real harm" },
  support: { title:"Practical Support Guide", sub:"Targeted guidance for mothers, partners, doulas, and healthcare providers" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PostpartumGuide() {
  const [section, setSection] = useState("hormones");
  const [bfMode, setBfMode] = useState(true);
  const [selectedHormone, setSelectedHormone] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(()=>setReady(true),100); },[]);

  const meta = sectionMeta[section]||{title:"",sub:""};
  const idx = navItems.findIndex(n=>n.id===section);
  const prev = navItems[idx-1], next = navItems[idx+1];

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#130b07 0%,#160e0b 45%,#0d1016 100%)",
      fontFamily:"'Georgia',serif", color:C.cream,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');
        button{outline:none;} *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,220,185,0.18);border-radius:2px;}
      `}</style>

      {/* Sticky Header + Nav */}
      <div style={{
        background:"rgba(19,11,7,0.88)",backdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,220,185,0.08)",
        padding:"20px 24px 0",position:"sticky",top:0,zIndex:50,
      }}>
        <div style={{ maxWidth:980,margin:"0 auto" }}>
          <div style={{ opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s ease" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8,marginBottom:16 }}>
              <div>
                <div style={{ fontSize:9.5,letterSpacing:"0.32em",color:"rgba(240,234,224,0.3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:4 }}>
                  Interactive Learning Guide · Postpartum Science
                </div>
                <h1 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(22px,3.8vw,36px)",
                  margin:0,lineHeight:1.1,fontWeight:700,
                  background:"linear-gradient(135deg,#F0EAE0,#E8956D,#D48A95,#8FBCAA)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                }}>
                  The Fourth Trimester
                  <span style={{ fontWeight:400,fontStyle:"italic",fontSize:"0.68em" }}> — Birth Through One Year</span>
                </h1>
              </div>
              <div style={{ fontSize:10,color:"rgba(240,234,224,0.25)",fontFamily:"'DM Mono',monospace",textAlign:"right" }}>
                7 Sections · Birth → 12 Months
              </div>
            </div>
            <div style={{ display:"flex",gap:0,overflowX:"auto",marginLeft:-4 }}>
              {navItems.map(nav => (
                <button key={nav.id} onClick={()=>setSection(nav.id)} style={{
                  background:"transparent",border:"none",
                  borderBottom:`2px solid ${section===nav.id?C.terra:"transparent"}`,
                  padding:"8px 14px",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",
                  color:section===nav.id?C.terra:"rgba(240,234,224,0.4)",
                  fontSize:11.5,fontFamily:"'DM Mono',monospace",
                }}>
                  {nav.icon} {nav.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth:980,margin:"0 auto",padding:"30px 20px 70px" }}>
        <div style={{ opacity:ready?1:0,transform:ready?"none":"translateY(18px)",transition:"all 0.5s ease 0.08s" }}>

          {/* Section Header */}
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,30px)",margin:"0 0 4px",fontWeight:600 }}>{meta.title}</h2>
            <p style={{ color:C.faint,fontSize:12.5,margin:0,fontFamily:"'DM Mono',monospace" }}>{meta.sub}</p>
          </div>

          {/* Section Body */}
          <div style={{ background:"rgba(255,228,200,0.025)",border:"1px solid rgba(255,228,200,0.07)",borderRadius:22,padding:"26px 24px" }}>
            {section==="hormones" && <HormoneChart selectedId={selectedHormone} setSelectedId={setSelectedHormone} bfMode={bfMode} setBfMode={setBfMode} />}
            {section==="48h" && <FortyEightHours />}
            {section==="phases" && <PhasesSection />}
            {section==="brain" && <BrainSection />}
            {section==="body" && <BodySection />}
            {section==="learning" && <LearningSection />}
            {section==="support" && <SupportSection />}
          </div>

          {/* Prev / Next Nav */}
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:20,borderTop:"1px solid rgba(255,228,200,0.06)" }}>
            {prev ? (
              <button onClick={()=>setSection(prev.id)} style={{
                background:"rgba(255,228,200,0.05)",border:"1px solid rgba(255,228,200,0.1)",
                borderRadius:10,padding:"8px 18px",color:"rgba(240,234,224,0.5)",
                fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer",
              }}>← {prev.short}</button>
            ) : <div />}
            {next ? (
              <button onClick={()=>setSection(next.id)} style={{
                background:`${C.terra}18`,border:`1px solid ${C.terra}40`,
                borderRadius:10,padding:"8px 18px",color:C.terra,
                fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer",
              }}>{next.short} →</button>
            ) : <div />}
          </div>

          {/* Disclaimer */}
          <div style={{ textAlign:"center",fontSize:10,color:"rgba(240,234,224,0.18)",fontFamily:"'DM Mono',monospace",marginTop:30,lineHeight:1.6 }}>
            Educational resource. Hormone curves are illustrative relative levels, not absolute clinical values.<br />
            Individual variation is significant. Always consult qualified healthcare providers for clinical decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
