import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#070c0a", card:"rgba(180,220,200,0.04)", border:"rgba(180,220,200,0.08)",
  borderS:"rgba(180,220,200,0.16)", cream:"#EBF0EB",
  teal:"#6FB5A0", gold:"#C8A96E", slate:"#8FADC8", terra:"#C87A6A",
  sage:"#8EBB9A", lavender:"#A99BC0", warn:"#D97070",
  muted:"rgba(235,240,235,0.52)", faint:"rgba(235,240,235,0.28)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const timelineStages = [
  { id:"prenatal", label:"Prenatal", weeks:"Conception → Labor", icon:"🌱", color:C.sage,
    tagline:"Building the foundation for informed, autonomous birth",
    priorities:["Attending prenatal appointments as requested","Helping clients formulate questions for providers","Reviewing birth preference options (not writing preferences for them)","Identifying potential barriers: language, culture, systemic bias","Connecting clients to childbirth education and community resources","Supporting partners in understanding their supportive role"],
    how:"The doula's prenatal role is primarily educational and relational — building trust, learning the client's values, and helping them understand the difference between preferences and plans. Critical: the doula builds the relationship before the crisis.",
    boundary:"Doulas do not interpret test results, advise on medical decisions, or attend appointments unless explicitly invited. They prepare clients to have their own conversations.",
    example:"Client says: 'My OB keeps dismissing my questions about induction.' Doula response: 'Let's write down exactly what you want to know, and I'll help you practice asking it assertively. You have the right to a complete answer.'" },
  { id:"labor", label:"Labor & Birth", weeks:"Active Labor → Delivery", icon:"🌊", color:C.teal,
    tagline:"Holding space while medical teams do their clinical work",
    priorities:["Continuous physical and emotional presence","Communicating client's documented preferences to nurses","Asking for time and information before consent is signed","Translating clinical language into plain language","Supporting comfort measures: positioning, breathing, touch","Advocating for privacy and dignity during examinations"],
    how:"Labor is when doula advocacy is most visible and most misunderstood. The doula does not intervene clinically — but they ensure the client has the information, time, and support to make their own decisions under enormous pressure.",
    boundary:"Doulas never speak over or instead of the client. They never touch clinical equipment, argue with medical staff, or override provider decisions. They ask questions — they do not give orders.",
    example:"Provider says: 'We need to do a C-section now.' Doula (quietly to client): 'Do you want me to ask the doctor to explain what's happening and what the options are? You have the right to a few minutes to understand this.'" },
  { id:"immediate", label:"Immediate PP", weeks:"Birth → 48 Hours", icon:"✨", color:C.gold,
    tagline:"The most overlooked advocacy window in the entire journey",
    priorities:["Supporting skin-to-skin contact and golden hour protection","Assisting with first latch and breastfeeding positioning","Ensuring discharge instructions are understood, not just signed","Monitoring for signs of distress: physical and emotional","Facilitating family communication and visitor boundaries","Helping client voice concerns to nursing staff before discharge"],
    how:"The first 48 hours are medically dense and emotionally overwhelming. Clients often sign forms, receive instructions, and make decisions while exhausted and in pain. Doula presence ensures nothing critical falls through the cracks of overwhelm.",
    boundary:"Doulas do not perform clinical assessments or advise on medical treatment. They watch for what the client expresses — and help them communicate it. The doula's role is to ensure the client's voice is heard, not to add their own clinical opinion.",
    example:"Nurse gives discharge paperwork to client at 2am. Doula: 'Before you sign, would you like me to go through this with you and make sure we understand the follow-up instructions and warning signs to watch for?'" },
  { id:"earlypp", label:"Early Postpartum", weeks:"Weeks 2–6", icon:"🌸", color:C.terra,
    tagline:"Where systemic gaps widen and isolation sets in",
    priorities:["Attending postpartum visits or preparing client to self-advocate","Screening conversations around PPD/PPA (not diagnosing)","Connecting to breastfeeding support, pelvic floor therapy","Ensuring partner understands recovery needs and limitations","Navigating insurance, benefits, and leave paperwork","Flagging warning signs and supporting prompt care-seeking"],
    how:"Most formal support ends at 6 weeks — right when many mothers are at their most isolated. Doulas bridge the gap by maintaining contact, normalizing the recovery experience, and actively connecting families to resources before crises develop.",
    boundary:"Doulas do not screen for or diagnose PPD. They are not mental health providers. They recognize when referral is needed and support the client in accessing care without judgment.",
    example:"Client says: 'I haven't slept in 6 days and I feel like nothing is real.' Doula: 'What you're describing sounds like more than typical new-parent exhaustion. Would you be open to reaching out to your provider today? I can help you figure out what to say.'" },
  { id:"ongoing", label:"Ongoing Support", weeks:"Months 3–12", icon:"🌿", color:C.lavender,
    tagline:"Matrescence, identity, and the long work of integration",
    priorities:["Supporting return-to-work transitions and feeding decisions","Connecting to community: support groups, parent networks","Monitoring for late-onset PPD (onset can occur up to 12 months)","Birth story processing and trauma integration","Sibling adjustment and family dynamic support","Gently closing the doula relationship with clear next steps"],
    how:"The ongoing postpartum phase is where doula work becomes most holistic. The acute crisis of the fourth trimester has passed, but the identity transformation — matrescence — is still unfolding. Doulas serve as consistent, non-judgmental witnesses to this process.",
    boundary:"Doulas are not therapists. Long-term processing of birth trauma or grief should be referred to licensed mental health professionals. The doula can hold space; they cannot provide clinical treatment.",
    example:"Client at 9 months: 'I still can't stop thinking about how my birth went.' Doula: 'That sounds like it deserves more than I can offer. Would you be open to talking to a therapist who specializes in birth experiences? I can share some names.'" },
];

const phases = [
  { id:"ph1", label:"Pregnancy", sub:"Prenatal Planning", icon:"🌱", color:C.sage,
    needs:["Building a birth preferences document with flexibility built in","Finding a provider whose values align with the client's","Understanding hospital policies: monitoring, IV, movement, visitors","Identifying if there are cultural or language support needs","Preparing for VBAC, GBS+ status, or other clinical considerations"],
    actions:["Conducting 2–3 prenatal visits to learn values, fears, and goals","Creating a 'What Matters Most' list separate from a birth plan","Role-playing difficult conversations with providers and nurses","Researching the hospital's cesarean rate, induction policies, and staffing","Providing curated, evidence-based resources — not personal opinions"],
    comms:["'What would an ideal birth experience feel like for you?'","'What are you most worried about? Let's talk about what you'd want to happen if that occurs.'","'Your doctor recommended X — do you want me to help you find questions to ask about it?'","'Providers have the final clinical word. Our job is to make sure you understand your options fully before deciding.'"],
    barriers:["Clients confuse doula advocacy with medical decision-making authority","Providers who see the birth plan as adversarial rather than informational","Cultural norms where questioning the doctor is seen as disrespectful","Over-medicalization framing that positions birth preferences as 'difficult patient' behavior"],
  },
  { id:"ph2", label:"Labor & Birth", sub:"In the Room", icon:"🌊", color:C.teal,
    needs:["Continuous emotional and physical support during contractions","Understanding what interventions are being recommended and why","Having informed consent conversations that are genuine, not perfunctory","Maintaining dignity during vaginal exams and procedures","Communicating preferences when client is unable to speak for themselves","Navigating sudden changes in birth plan with information and calm"],
    actions:["Using BRAIN framework to slow decisions when time permits","Physically positioning client for comfort and optimal fetal positioning","Serving as the calm, consistent presence when staff changes","Whispering real-time context to client during clinical conversations","Asking 'Is this an emergency or do we have a moment to discuss?'","Documenting the timeline of events for post-birth processing"],
    comms:["'You're doing this. What do you need right now?'","'The nurse is recommending Pitocin. Do you want a moment to hear more about why?'","'I'm right here. You don't have to decide anything alone.'","'I noticed you seemed unsure when you signed that consent form. Do you want to ask the doctor to come back?'"],
    barriers:["Busy L&D floors where doulas may feel like extra people in the room","Implicit bias affecting care quality — doulas can witness and document","Rapid clinical decisions that feel pressured or coercive","Partners who become overwhelmed and need support too"],
  },
  { id:"ph3", label:"Birth to Week 2", sub:"The Acute Window", icon:"✨", color:C.gold,
    needs:["Understanding what happened during birth — debrief and narrative","Breastfeeding support and realistic expectation-setting","Understanding normal vs. concerning postpartum symptoms","Navigating family visitors and holding space for bonding","Discharge instructions comprehension — not just signature","Sleep planning for the first two weeks"],
    actions:["Offering a gentle birth debrief in first days or weeks","Attending the first postpartum home visit within 24–48 hours of discharge","Teaching cue recognition vs. clock-based feeding","Educating partners on what 'recovery' actually means physically","Checking that client has emergency contacts and knows warning signs","Reviewing lochia, incision care, and when to call provider"],
    comms:["'Before I leave today, let's go over the three warning signs to call your doctor about.'","'How are you feeling about how your birth went? Do you have questions about why things happened the way they did?'","'Your body just did something extraordinary. You deserve real support right now, not just visitors.'","'What do you need to feel safe and cared for this week?'"],
    barriers:["'She just had a baby — she seems fine' minimization by family and providers","Overwhelming visitor culture that disrupts rest and bonding","Breastfeeding challenges misread as failure rather than normal learning","Discharge happening before client feels ready or informed"],
  },
  { id:"ph4", label:"Weeks 2–6", sub:"The Isolation Zone", icon:"🌸", color:C.terra,
    needs:["Ongoing breastfeeding support as supply regulates","Pelvic floor assessment referral for all clients","Mental health screening conversations and warm referrals","Processing unexpected aspects of birth or newborn care","Returning to provider at 6 weeks: preparation and self-advocacy","Household management, sleep strategy, and partner education"],
    actions:["Making regular check-in calls — not just when crisis appears","Normalizing the emotional range of early postpartum without minimizing","Actively asking 'How is your partner doing?' — not just the mother","Providing written list of red flag symptoms with clear 'call now' guidance","Helping client prepare for their 6-week appointment: what to ask, what to report","Beginning gentle conversation about matrescence and identity shift"],
    comms:["'How are you feeling — and I mean emotionally, not just physically?'","'Have you been having any thoughts that are worrying you? You can tell me anything.'","'When was the last time you had 4 consecutive hours of sleep?'","'Your 6-week visit will be quick. Let's make sure you don't leave without getting your questions answered.'"],
    barriers:["Baby blues vs PPD distinction not understood by families","'6 weeks = fully recovered' myth causing premature withdrawal of support","Partners returning to work and leaving mothers isolated","Social media comparison culture accelerating postpartum identity distress"],
  },
  { id:"ph5", label:"Months 3–12", sub:"The Long Integration", icon:"🌿", color:C.lavender,
    needs:["Birth story processing — often happens for the first time here","Return to work: identity, feeding, pumping logistics","Weaning decision support — physical and emotional dimensions","Late-onset PPD identification — can appear up to 12 months","Relationship and intimacy support for the couple","Community connection: peer support, parent groups, online networks"],
    actions:["Scheduling intentional closing visit to mark the end of formal support","Ensuring client has a 'warm handoff' to long-term community resources","Documenting any unresolved concerns for future reference","Affirming the mother's competence and the work she has done","Sharing referrals for therapy, pelvic floor, and peer support","Leaving the door open for future pregnancies — relationship is ongoing"],
    comms:["'You've navigated an extraordinary amount this year. How do you feel about where you are?'","'Is there anything from your birth or early postpartum that you feel unfinished with?'","'The support system I'm handing you to: here are three people who can continue what we started.'","'You are the expert on your baby and yourself. Trust what you've learned.'"],
    barriers:["Post-weaning hormonal mood changes mistaken for personal failure","Late-onset PPD missed because screening ended at 6 weeks","Pressure to 'be back to normal' when a new normal is more accurate","Doula relationships ending without a formal, intentional close"],
  },
];

const supportTypes = [
  { id:"emotional", label:"Emotional Support", icon:"💗", color:C.terra,
    desc:"Being present with someone in their experience without trying to fix or redirect it. The foundation of all effective doula work.",
    examples:["Holding a client's hand during contractions without speaking","Acknowledging fear without minimizing: 'This is scary and you're handling it'","Sitting with a mother who is crying without immediately problem-solving","Validating identity confusion in early parenthood"],
    stressEffect:"Under acute stress, the prefrontal cortex (reasoning) goes offline. A person in labor or acute postpartum distress cannot access logic — they can access connection. Emotional support activates the parasympathetic nervous system and literally makes the other support types more effective.",
    boundary:"Emotional support is not therapy. Doulas hold space — they do not process deep trauma or provide mental health treatment." },
  { id:"info", label:"Informational Support", icon:"📋", color:C.slate,
    desc:"Providing evidence-based, balanced information so clients can make genuinely informed decisions — not directing them toward any particular choice.",
    examples:["Sharing what research says about intermittent vs. continuous fetal monitoring","Explaining what an epidural does physiologically and what the alternatives are","Describing the stages of labor so a client can contextualize what they're experiencing","Translating 'your Bishop score is 4' into plain English"],
    stressEffect:"Cortisol and fear narrow cognitive processing. A frightened person absorbs less information and tends toward black-and-white thinking. Informational support must be simple, paced, and offered — not imposed. The goal is to widen the decision-making window.",
    boundary:"Doulas do not recommend specific medical interventions or advise against a provider's recommendation. They present information without a persuasive agenda." },
  { id:"physical", label:"Physical Support", icon:"🤲", color:C.sage,
    desc:"Hands-on and presence-based support that reduces pain perception, promotes physiological birth progress, and signals safety to the nervous system.",
    examples:["Counterpressure on the sacrum during back labor","Helping a client rotate between positions to optimize fetal position","Assisting with warm compresses, massage, or cool cloths","Guiding breathing patterns during contractions"],
    stressEffect:"The stress hormone cascade — particularly cortisol and adrenaline — actively inhibits oxytocin and slows labor. Physical support interrupts this cascade. Research shows continuous labor support reduces cesarean rates by ~39% and epidural use by ~10%.",
    boundary:"Physical support does not include clinical procedures. Doulas do not perform vaginal exams, place IVs, administer medications, or operate hospital equipment." },
  { id:"advocacy", label:"Advocacy Support", icon:"🗣️", color:C.gold,
    desc:"Ensuring the client has the information, confidence, and time to exercise their rights and make autonomous decisions — without the doula speaking over them or in their place.",
    examples:["Asking 'Is this an emergency, or do we have a few minutes to discuss options?'","Reminding a frightened client 'You can ask the doctor to explain that again'","Noting a client's previously expressed birth preference to the nursing staff","Helping a client find the words to say 'I'd like to wait before deciding'"],
    stressEffect:"Under duress, people often say yes to things they would say no to with more time and information. Advocacy support creates a buffer between pressure and decision — ensuring consent is genuine. This is the doula's most powerful and most misunderstood function.",
    boundary:"Advocacy support does not mean overriding provider judgment, speaking on behalf of the client without permission, or positioning the doula as a clinical decision-maker." },
];

const brainFactors = [
  { icon:"⚡",label:"Acute Stress",effect:"Narrows attention to immediate threat. Reasoning and planning become nearly impossible. Client may agree to interventions without fully processing them." },
  { icon:"😴",label:"Sleep Deprivation",effect:"After 24+ hrs of labor or postpartum, cognitive processing resembles mild intoxication. Memory formation is impaired — clients may not recall what they were told." },
  { icon:"🩸",label:"Pain",effect:"High pain activates the same brain regions as emotional distress. Decision-making under pain is demonstrably less autonomous. Comfort measures are cognitive support." },
  { icon:"😨",label:"Fear and Trauma",effect:"Prior birth trauma or medical PTSD can activate freeze responses. A client who goes silent may not be consenting — they may be dissociating." },
  { icon:"🧪",label:"Hormonal Flux",effect:"Oxytocin, cortisol, and adrenaline fluctuate rapidly during labor. These hormones directly modulate emotional processing and risk perception." },
  { icon:"🧠",label:"Information Overload",effect:"L&D environments produce an enormous amount of unfamiliar information rapidly. Without a trusted interpreter, clients default to whatever the provider says — not from agreement, but from overwhelm." },
];

const domains = [
  { id:"consent", label:"Informed Consent & Refusal", icon:"✅", color:C.teal,
    summary:"Informed consent is not a signature — it is a conversation. The right to refuse care is equally protected under law and medical ethics.",
    points:["Every competent adult has the legal right to refuse any medical treatment, including during labor","Consent must be informed: the patient must understand the procedure, its purpose, its risks, its alternatives, and the consequence of refusal","A signature on a form does not substitute for a genuine informed consent conversation","'Therapeutic privilege' — withholding information because the provider thinks the patient can't handle it — is ethically contested and legally precarious"],
    doulas:["Ask: 'Do you feel like you fully understand what they're proposing before you decide?'","Note: 'You are allowed to say no. You're allowed to ask for more time.'","Never: Sign consent forms for the client, advise refusal of a specific treatment, or argue with clinical staff on the client's behalf"],
    script:"BRAIN is a structured decision-making tool used to slow consent conversations:\n🧠 Benefits — What are the benefits of this procedure?\n⚠️ Risks — What are the risks?\n🔄 Alternatives — What are the alternatives?\n🤔 Intuition — What does your gut say?\n⏳ Nothing — What happens if we wait or do nothing?\n\nDoula: 'Would you like to BRAIN this before you decide?'",
    scenario:"A nurse says 'We need to start Pitocin, just sign here.' The client has not been told why, what the dose is, or what the alternatives are. Doula response: 'Could we ask the doctor to come in for a quick minute to explain what's happening so she fully understands before she signs?' — then step back and let the client lead.",
  },
  { id:"birthpref", label:"Birth Preferences & Flexibility", icon:"📄", color:C.sage,
    summary:"A birth preferences document expresses values and priorities — it is not a contract, and flexibility is a feature, not a failure.",
    points:["'Birth plan' language sets up an adversarial frame. 'Birth preferences' or 'values document' communicates collaboration","Providers who dismiss birth plans entirely are communicating a values misalignment worth discussing before labor","A strong preferences document includes 'If X happens, we would prefer Y because Z'","The most important preference is: 'Please talk to us before making decisions, unless there is genuine emergency'"],
    doulas:["Help clients distinguish between high-priority and flexible preferences","Identify which items are evidence-supported and which are personal values","Ensure the document is short, positive in framing, and includes emergency contingencies","Bring copies to the hospital — one for the chart, one for the nurse, one to keep visible"],
    script:"'I'd like to be fully present and involved in decisions made about my care and my baby's care. Please explain procedures before performing them and give me the opportunity to ask questions. I understand that birth is unpredictable and that safety will always come first — I simply ask to be treated as a full participant in my care.'\n\nThis framing opens the door rather than creating walls.",
    scenario:"Client's birth preferences say 'no epidural.' At 8cm, she's in significant pain and asking for pain relief. Doula response: 'Your preferences are yours to change at any moment. Would you like to ask the nurse about your options right now?' — then support whatever choice she makes, without commentary or judgment.",
  },
  { id:"comms", label:"Respectful Provider Communication", icon:"🤝", color:C.gold,
    summary:"The most effective advocacy is collaborative, not confrontational. Doulas who antagonize providers ultimately harm the clients they're trying to help.",
    points:["Nurses and OBs are allies, not adversaries — most entered their fields to help people","Respectful advocacy is more effective than assertive advocacy — providers respond to calm, clear questions","The doula's tone in the room sets the tone for the entire care team dynamic","Documenting a concern is often more powerful than voicing it confrontationally"],
    doulas:["Introduce yourself clearly and positively at every shift change","Learn the nurse's name and use it — relationship matters in every direction","Communicate concerns as questions, not accusations","If a conflict arises, de-escalate with the client, then use the hospital chain of concern (charge nurse, patient advocate, attending physician)"],
    script:"Nurse-shift introduction: 'Hi, I'm [name], I'm [client]'s doula. My role is to support her emotionally and help her communicate her preferences — I'll never interfere with clinical care. Is there anything you'd like me to know about our plan for today?'\n\nThis disarms defensiveness, creates partnership, and opens communication immediately.",
    scenario:"A nurse seems dismissive when the client mentions her pain. Doula response: Not 'You're not listening to her' — but: 'She's been experiencing this since about 3am and it seems to be getting worse. Can we make sure it's noted in her chart and someone reviews it with us?'",
  },
  { id:"culture", label:"Cultural Humility & Bias Awareness", icon:"🌍", color:C.lavender,
    summary:"Racial and ethnic disparities in maternal outcomes are documented, significant, and driven partly by implicit bias in healthcare systems. Cultural humility is core doula competency, not optional.",
    points:["Black mothers in the US die from pregnancy-related causes at 2–3× the rate of white mothers, regardless of income or education","Provider implicit bias has been documented affecting pain assessment, intervention rates, and communication quality","Cultural humility means ongoing learning — not assuming you understand a client's culture, but asking","Language barriers multiply every advocacy challenge — interpretation services are a legal right under Title VI"],
    doulas:["Ask directly: 'Are there cultural or spiritual practices that are important to you during birth or postpartum?'","Never assume family structure, decision-making dynamics, or cultural norms","Actively learn about health disparities affecting the communities you serve","Advocate loudly (but professionally) when a client's concerns appear to be dismissed due to bias — and document it"],
    script:"'I want to make sure your care is consistent with what matters to you culturally and spiritually. Can you tell me what your family's practices are around birth and the first days with your baby? Are there specific things that are important to include or avoid?'\n\nThen: Listen. Do not interpret. Do not compare. Do not assess.",
    scenario:"A Black client reports that her pain is being undertreated. Doula response: Document the time, what was said, and what was requested. Ask the nurse to escalate to the doctor. If the pattern continues: request the patient advocate. Name what you're observing, clearly and professionally: 'She has reported her pain level multiple times and it has not been addressed. I'd like this documented and I'd like a clinical review of her pain management plan.'",
  },
  { id:"mentalhealth", label:"Mental Health & Referral", icon:"🧠", color:C.terra,
    summary:"Doulas are often the first consistent support figure to notice mental health concerns. Recognition without diagnosis, and referral without judgment, is the gold standard.",
    points:["Postpartum depression affects 15–20% of mothers — but is vastly underreported due to stigma","Postpartum anxiety is more common than PPD and less frequently identified","Doulas are not mental health providers but they are often closer to the daily emotional experience than any clinical staff","Warm referral — connecting clients to a specific person, not just a resource list — significantly increases follow-through"],
    doulas:["Screen informally every visit: 'How are you feeling emotionally? Any thoughts that are worrying you?'","Know your local resources: perinatal mental health therapists, psychiatrists who specialize in postpartum, support groups","If a client discloses thoughts of self-harm or harm to baby: this is a mandatory referral — do not hold this alone","Normalize seeking support by mentioning it proactively: 'Many of my clients find it helpful to check in with a therapist around Week 3 — not because something is wrong, but because of how much is happening'"],
    script:"'What you're describing — the way you're feeling — sounds like more than the typical adjustment period. That's not a judgment, it's just something worth checking on. I'd love to connect you with someone who specializes in exactly this. Can we look at a few names together right now, while I'm here?'",
    scenario:"Client at Week 3 says: 'I feel like my baby would be better off without me.' Doula response: 'I hear you, and I'm glad you told me. What you're feeling has a name and it's treatable. This is not about what kind of mother you are — this is your brain and your hormones asking for help. I'm calling your provider with you right now.'",
  },
  { id:"resources", label:"Resource Navigation & Referrals", icon:"🗺️", color:C.slate,
    summary:"A doula's community knowledge is often their most undervalued asset. Knowing who to call, where to go, and how to access care is transformative for families who don't.",
    points:["Systemic barriers to care — cost, transportation, language, insurance — are advocacy targets, not personal failures","Doulas serve as connectors between families and a healthcare system that was not designed for easy navigation","A warm referral (personal contact with a specific provider) is measurably more effective than a list of phone numbers","Postpartum resource knowledge should be built before it is needed — not constructed at the moment of crisis"],
    doulas:["Maintain an updated local resource list: lactation consultants, pelvic floor PTs, perinatal mental health, PPD support groups, WIC offices, home visiting programs","Build genuine relationships with referral providers so the handoff is real, not just a name","Know what each family's insurance covers and proactively address gaps","Document all referrals given — follow up to ensure they were accessed"],
    script:"'I want to make sure you have real people — not just websites — to call when you need something. Let me give you three contacts: one for breastfeeding, one if you're ever feeling emotionally overwhelmed, and one if you need help with anything practical like food or household. You might not need any of them. But I want you to have them before you do.'",
    scenario:"Client is discharged without being told about home visiting programs or lactation support. Doula response: 'Before you go home, let me make sure you have everything you actually need — not just what the hospital paperwork covers. Here's who to call if...' — then walk through a personalized resource map together.",
  },
];

const quizzes = [
  { q:"What does informed consent require beyond a signature?", options:["A medical license number","Understanding of the procedure, risks, alternatives, and right to refuse","Presence of a family member","24 hours of waiting"], correct:1, explanation:"Informed consent requires genuine comprehension — not just a signature. The client must understand what is being proposed, why, the risks, alternatives, and their right to refuse. A signature under duress, confusion, or without explanation does not constitute valid informed consent." },
  { q:"When a doula asks 'Is this an emergency or do we have a moment to discuss?', they are:", options:["Overstepping their scope","Practicing medicine without a license","Creating space for informed decision-making","Arguing with medical staff"], correct:2, explanation:"This question is one of the most effective doula tools. It does not challenge clinical judgment — it clarifies whether there is time for a genuine consent conversation. Most clinical recommendations are non-emergent, and a few minutes to process meaningfully changes the quality of consent." },
  { q:"Which of the following is OUTSIDE a doula's scope of practice?", options:["Helping a client formulate questions for their provider","Explaining what research says about different labor positions","Advising a client to refuse a recommended intervention","Reminding a client they have the right to ask for more information"], correct:2, explanation:"Doulas provide information and support — they do not advise for or against specific medical interventions. Advising refusal of treatment crosses into practicing medicine without a license and could harm both the client and the doula professionally. The doula's job is to help the client make their own decision, fully informed." },
  { q:"Black maternal mortality in the US compared to white maternal mortality is approximately:", options:["The same across all income levels","Slightly higher — about 20% more","2–3× higher, regardless of income or education","Only higher in rural areas"], correct:2, explanation:"Black mothers in the US die from pregnancy-related causes at 2–3 times the rate of white mothers. Critically, this disparity persists across income, education, and access to care — meaning it is not primarily explained by socioeconomic factors, but by systemic and implicit bias in healthcare delivery." },
  { q:"The BRAIN tool stands for:", options:["Body, Rest, Activity, Intervention, Nutrition","Benefits, Risks, Alternatives, Intuition, Nothing (wait)","Birth, Recovery, Advocacy, Information, Needs","Breathing, Relaxation, Awareness, Intimacy, Nourishment"], correct:1, explanation:"BRAIN is a structured decision-making framework: Benefits, Risks, Alternatives, Intuition/gut feeling, and Nothing (what happens if we wait). It is designed to slow down consent conversations and ensure all relevant information is considered before a decision is made under pressure." },
  { q:"A client at Week 5 postpartum says she's been crying every day and feels disconnected from her baby. The doula's BEST next step is:", options:["Reassure her that baby blues are normal","Tell her she has PPD and needs medication","Provide a warm referral to a perinatal mental health provider while offering support","Give her a list of self-care tips"], correct:2, explanation:"Persistent low mood and disconnection at Week 5 exceeds the baby blues window (which resolves by Week 2) and warrants clinical evaluation. The doula does not diagnose — but does recognize, normalize without minimizing, and actively connect the client to a clinical provider through a warm referral." },
];

const myths = [
  { m:"A signed birth plan means the hospital has to follow it", f:"A birth plan expresses preferences and values — it is not a legally binding contract. What it DOES do: set expectations, communicate priorities, and give staff a window into who this person is before labor intensifies.", id:"my1" },
  { m:"Doulas speak for the client and can make decisions on their behalf", f:"Doulas never speak instead of the client — only alongside them. They help clients find their voice and ask their own questions. Decision-making authority always remains with the client and their medical team.", id:"my2" },
  { m:"Advocacy means challenging providers and standing your ground", f:"Effective advocacy is collaborative, calm, and respectful. Confrontational approaches harm the client by damaging the care team relationship. The most powerful doula phrase is usually a quiet question.", id:"my3" },
  { m:"If your birth plan changes during labor, the doula failed", f:"Birth is unpredictable. A birth plan that changes because of medical necessity is not a failure — it's evidence that the plan was appropriately flexible. The doula's job is to ensure the change was understood and consented to, not to prevent it.", id:"my4" },
  { m:"Doulas are only for people who want natural, unmedicated births", f:"Doulas provide evidence-based support for every birth type — including planned cesareans, epidurals, inductions, and high-risk pregnancies. The support needed is the same: information, presence, and advocacy.", id:"my5" },
  { m:"Cultural competency means knowing facts about other cultures", f:"Cultural HUMILITY is the standard — not competency. Humility means recognizing that you will never fully know another person's cultural experience, asking rather than assuming, and continuously learning. Competency implies mastery that can cause complacency and harm.", id:"my6" },
];

const scenarios = [
  { title:"The Rushed Consent", color:C.teal, situation:"At 5am, a nurse enters with a form. 'We need to add Pitocin to help things along. Sign here.' The client has not been told why, at what dose, or what happens if she doesn't.",
    wrong:"Signing the form because the nurse seemed busy and confident.",
    doula:"(Quietly to client) 'You don't have to sign this right now. Would you like me to ask for a moment to have the doctor explain why they're recommending this?' (To nurse, warmly): 'Could we get just two minutes with the doctor to understand why Pitocin is being recommended at this point?'",
    lesson:"Advocacy is not refusal — it's asking for the conversation that should have already happened." },
  { title:"The Dismissed Pain Report", color:C.terra, situation:"A client has reported her pain as an 8/10 twice in the last hour. The nurse notes it and continues. No change is made to her pain management plan.",
    wrong:"Telling the nurse 'You're not listening to her' or escalating to anger.",
    doula:"'She's reported her pain at an 8 twice in the last hour. I want to make sure that's in her chart and that someone has reviewed her pain management plan. If it's not possible right now, can we set a specific time to revisit this?'",
    lesson:"Documentation requests are powerful. Formal review requests are powerful. Accusations are not." },
  { title:"The Late-Night Discharge Push", color:C.gold, situation:"At 11pm, a nurse brings discharge paperwork. The client had a surgical birth 28 hours ago, has not had a successful breastfeeding session, and has not been shown how to care for her incision.",
    wrong:"Letting the client sign because she's too exhausted to object.",
    doula:"'Before we sign, I want to make sure we have three things clear: we know what warning signs to call about, we have a breastfeeding plan we're comfortable with, and we understand incision care. Can we take 15 minutes to walk through those together? And if she's not feeling ready for discharge, she has the right to ask to stay an additional night.'",
    lesson:"The right to request additional clinical review before discharge is real. Exhaustion is not informed consent." },
  { title:"The Dismissed Concern", color:C.lavender, situation:"A Black client in active labor tells her nurse 'Something feels wrong — the pain is different.' The nurse says 'You're just in labor, that's normal.' 10 minutes later she reports it again.",
    wrong:"Staying silent because the nurse is the clinical expert.",
    doula:"'She's reported this twice now — that something feels different from her normal labor pain. I'd like to request that her vitals be rechecked and that the attending be notified. Please note in her chart the time she reported this and the time it was escalated.'",
    lesson:"Pattern recognition and documentation are advocacy. A client who feels unheard and something is wrong — that is never 'just labor.'" },
];

const supportData = {
  doulas:{ label:"Doulas", icon:"🌸", color:C.teal,
    tips:[
      {t:"Master the Pause", b:"The single most effective tool in your advocacy toolkit is silence after a question. Ask 'Do you want a moment to think about this?' and then stop talking. The pause creates the decision-making space."},
      {t:"Introduce Yourself as a Partner", b:"At every shift change: 'Hi, I'm [name], [client]'s doula. I'm here to support her emotionally and help her communicate her preferences — I'll step back whenever clinical work is happening.' Disarms every defensive nurse in 15 seconds."},
      {t:"Document Everything Quietly", b:"Keep a quiet log of time, events, and what was said. This serves the client if they want to process the birth later, and protects you if there is ever a dispute about what happened."},
      {t:"Know Your Scope Deeply", b:"You are most powerful when you are clearest about your boundaries. Practicing within scope builds trust with providers. Crossing it — even with good intentions — damages the client, your reputation, and the profession."},
      {t:"Build Your Referral Network Before You Need It", b:"Before a crisis is the only time you should be building your mental health, lactation, and pelvic floor referral network. Keep it updated. Use it proactively, not reactively."},
    ],
    warnings:["Client reports thoughts of harming herself or her baby — immediate provider referral, do not hold this alone","Signs of postpartum psychosis: confusion, hallucinations, extreme agitation (emergency services if needed)","Client is being pressured to sign consent without adequate information — document and request clinical review","Pain, fever, or foul discharge that client has not reported to provider — support her in reporting today, not later"],
  },
  mothers:{ label:"Mothers & Families", icon:"🤱", color:C.terra,
    tips:[
      {t:"You Always Have the Right to Ask", b:"No matter how busy the floor is, how late it is, or how confident the provider sounds — you have the right to ask 'Can you explain why?' before you consent to anything. Always."},
      {t:"Your Birth Preferences Are Communication, Not Combat", b:"A birth preferences document tells your care team who you are and what matters to you. Frame it as partnership: 'Here's how you can best support me.' That framing opens doors."},
      {t:"Ask Your Doula to Be Your Memory", b:"In labor and early postpartum, you will not remember everything you're told. Ask your doula to keep notes so you can process information after the fact, when your brain is working better."},
      {t:"Name Concerns Clearly and Promptly", b:"The healthcare system rewards self-advocacy. 'I'd like this noted in my chart' is one of the most powerful things a patient can say. If something is concerning you, say it aloud to a clinical staff member. Do not only tell your doula."},
      {t:"Recovery Takes As Long As It Takes", b:"You will be pressured — directly and culturally — to bounce back. Your doula supports your actual recovery, not the socially expected one. Rest is medicine. Boundaries with visitors are self-care."},
    ],
    warnings:["Soaking more than 1 pad/hour, clots larger than a golf ball, or bright red bleeding after first week — call provider","Fever above 38°C (100.4°F) at any time postpartum","Persistent depression, anxiety, or inability to bond with baby beyond 2 weeks","Any thought of harming yourself or your baby — call your provider or a crisis line immediately","Signs of infection at incision or perineum: heat, pus, opening of wound"],
  },
  partners:{ label:"Partners & Family", icon:"🤝", color:C.gold,
    tips:[
      {t:"Your Job Is to Amplify, Not Replace", b:"Your partner has a voice. Your job is to make sure that voice is heard — by handing her water, reminding her of her preferences, and asking if she needs help communicating — not by taking over."},
      {t:"Know the Birth Preferences Better Than the Medical Staff Does", b:"Read the document. Know the top three priorities. Know what she would want if things change. This is the most important preparation you can do."},
      {t:"Follow the Doula's Lead in the Room", b:"Your doula has been trained for the environment you're in. When you're unsure what to do, match their energy, mirror their approach, and ask them quietly rather than improvising in a clinical moment."},
      {t:"Check In With the Care Team, Not Against Them", b:"Introduce yourself warmly to every nurse. Learn their names. Express appreciation. A room where everyone feels respected produces better care — this is not a power struggle."},
      {t:"Your Mental Health Matters Too", b:"Partners experience postpartum anxiety and depression at significant rates. If you're struggling: tell someone. The doula is a resource for you too, and your wellbeing directly shapes the family's recovery."},
    ],
    warnings:["Mother reporting thoughts of self-harm or harm to baby — do not leave her alone, call provider or emergency services immediately","Signs of postpartum psychosis in partner: confusion, paranoia, hearing/seeing things — emergency services","Partner unable to sleep even when baby is cared for — this is a clinical symptom worth reporting","Mother seeming completely unable to care for or connect with baby after Week 2 — compassionate, direct conversation followed by provider contact"],
  },
  hcp:{ label:"Healthcare Providers", icon:"🩺", color:C.slate,
    tips:[
      {t:"The Doula Is Not the Adversary", b:"A trained doula reduces cesarean rates, reduces epidural use, improves patient satisfaction, and improves breastfeeding initiation. They are a clinical ally. A tense room with an excluded doula has worse outcomes than one where they're welcomed."},
      {t:"Informed Consent Is a Process, Not a Form", b:"In busy labor environments, consent conversations become abbreviated. The doula's question — 'Can we have a moment to discuss this?' — is not an obstruction. It is a patient rights reminder that benefits the provider legally and ethically."},
      {t:"Maternal Mortality Disparities Are a Clinical Issue", b:"Providers who understand that Black, Indigenous, and other women of color face measurably different care quality — and who actively counteract that in their own practice — save lives. Doulas can flag and document. Providers must act."},
      {t:"Postpartum Mental Health Screening Should Extend to 12 Months", b:"A single 6-week EPDS is clinically insufficient. PPD can onset up to 12 months postpartum. Doulas often see clients more frequently in this window than clinical staff — consider them a warm handoff partner."},
      {t:"Birth Preferences Are Requests for Partnership, Not Complaints", b:"A client who brings a birth preferences document is communicating care values — the same thing every patient does implicitly but this patient is doing explicitly. Acknowledging it positively ('I read your document — here's what I can honor and let's talk about the rest') transforms the care relationship."},
    ],
    warnings:["Doula reporting client's consistent pain dismissal — this warrants immediate clinical review and chart documentation","Doula present during consent conversation where patient appears confused or coerced — review the conversation directly with the patient privately","Any report of a client experiencing psychotic symptoms — emergency psychiatric evaluation regardless of presentation","Signs of late postpartum preeclampsia (hypertension, headache, visual changes weeks 2–6) — do not dismiss as stress or anxiety"],
  },
};

const navItems = [
  {id:"timeline",label:"Advocacy Timeline",short:"Timeline",icon:"📍"},
  {id:"48h",label:"First 48 Hours",short:"First 48h",icon:"⏰"},
  {id:"phases",label:"Advocacy Phases",short:"Phases",icon:"🗓️"},
  {id:"brain",label:"Decision-Making",short:"Brain",icon:"🧠"},
  {id:"dashboard",label:"Advocacy Domains",short:"Domains",icon:"🗺️"},
  {id:"learning",label:"Quizzes & Scenarios",short:"Learn",icon:"📚"},
  {id:"support",label:"Support Guide",short:"Support",icon:"🤝"},
];

const sectionMeta = {
  timeline:{title:"The Doula Advocacy Timeline",sub:"How advocacy needs evolve from conception through the first year — click any stage to reveal priorities and examples"},
  "48h":{title:"First 48 Hours: Advocacy in Action",sub:"The most critical and most overlooked advocacy window — step by step"},
  phases:{title:"Advocacy Phases in Depth",sub:"Five stages with advocacy needs, doula actions, communication strategies, and common barriers"},
  brain:{title:"Brain, Emotion & Decision-Making",sub:"How stress, pain, and fatigue affect autonomy — and how doulas create space for genuine choice"},
  dashboard:{title:"Advocacy Domains Dashboard",sub:"Six core domains of doula advocacy — select each to explore principles, scripts, and real-world responses"},
  learning:{title:"Knowledge Checks & Scenario Training",sub:"Test your understanding and practice through realistic advocacy situations"},
  support:{title:"Practical Support Guide",sub:"Targeted guidance for doulas, families, partners, and healthcare providers"},
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TimelineSection() {
  const [active, setActive] = useState(null);
  const s = timelineStages.find(st=>st.id===active);
  const W=760, H=90;
  const pts = timelineStages.map((_,i)=>({ x: 40 + (i/(timelineStages.length-1))*(W-80), y:H/2 }));
  return (
    <div>
      <div style={{marginBottom:20,overflowX:"auto"}}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <line x1={pts[0].x} y1={H/2} x2={pts[pts.length-1].x} y2={H/2} stroke="rgba(180,220,200,0.15)" strokeWidth="2"/>
          {timelineStages.map((st,i) => {
            const p=pts[i], isSel=active===st.id;
            return (
              <g key={st.id} onClick={()=>setActive(active===st.id?null:st.id)} style={{cursor:"pointer"}}>
                <circle cx={p.x} cy={p.y} r={isSel?16:12} fill={isSel?st.color:"rgba(180,220,200,0.08)"} stroke={st.color} strokeWidth="2" style={{transition:"all 0.25s"}}/>
                <text x={p.x} y={p.y+4} textAnchor="middle" fontSize={14} fill={isSel?"#070c0a":st.color}>{st.icon}</text>
                <text x={p.x} y={p.y+28} textAnchor="middle" fontSize={9} fill={isSel?st.color:"rgba(235,240,235,0.4)"} fontFamily="'DM Mono',monospace">{st.label}</text>
                <text x={p.x} y={p.y-20} textAnchor="middle" fontSize={8} fill="rgba(235,240,235,0.25)" fontFamily="'DM Mono',monospace">{st.weeks}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {s ? (
        <div style={{background:`linear-gradient(135deg,${s.color}12,rgba(7,12,10,0.5))`,border:`1px solid ${s.color}30`,borderRadius:18,padding:22}}>
          <div style={{marginBottom:6,fontSize:10,color:s.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em"}}>{s.weeks.toUpperCase()}</div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",color:C.cream,margin:"0 0 4px",fontSize:22}}>{s.icon} {s.label}</h3>
          <p style={{color:s.color,fontSize:13,fontStyle:"italic",margin:"0 0 18px"}}>{s.tagline}</p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 200px"}}>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8}}>KEY ADVOCACY PRIORITIES</div>
              {s.priorities.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:s.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{flex:"1 1 220px"}}>
              <div style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.08)",borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:10,color:s.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>HOW DOULAS HELP</div>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{s.how}</p>
              </div>
              <div style={{background:"rgba(201,169,110,0.08)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:10,color:C.gold,fontFamily:"'DM Mono',monospace",marginBottom:6}}>⚖️ SCOPE REMINDER</div>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{s.boundary}</p>
              </div>
              <div style={{background:`${s.color}0e`,border:`1px solid ${s.color}25`,borderRadius:12,padding:14}}>
                <div style={{fontSize:10,color:s.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>💬 EXAMPLE IN PRACTICE</div>
                <p style={{fontSize:12,color:"rgba(235,240,235,0.7)",lineHeight:1.6,fontStyle:"italic",margin:0}}>{s.example}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"24px 0"}}>
          ↑ Click any stage on the timeline to reveal its advocacy priorities and examples
        </div>
      )}
    </div>
  );
}

function FortyEightSection() {
  const [step,setStep]=useState(0);
  const moments=[
    {t:"Golden Hour (0–2 hrs)",sub:"Immediate post-birth",color:C.sage,icon:"🌅",
      situation:"The first two hours after birth are a critical bonding and physiological window. Interruptions are common — newborn assessments, maternal vitals, provider documentation.",
      advocacy:["Ask staff to delay non-urgent newborn procedures to protect skin-to-skin time","Ensure mother is informed of every intervention before it happens to her or baby","Assist with positioning for first latch if breastfeeding is intended","Monitor that the mother's physical needs (warmth, water, food) are being met"],
      script:"'Before the assessment, is there any reason the baby can't stay on her chest for the next 30 minutes? We'd like to protect this window if it's clinically safe.'",
      prevent:"Without advocacy: NICU-style newborn assessments happen table-side while mother lies alone. With advocacy: the same assessments happen on the mother's chest."},
    {t:"First Nursing Assessment",sub:"Hours 2–8",color:C.teal,icon:"📋",
      situation:"Nurses shift-change. The new nurse has no context for what the client experienced or wants. Vital checks, fundal massage, feeding assessments begin.",
      advocacy:["Re-introduce client's key priorities to the new nurse","Ensure fundal massage technique is explained before it is performed","Note any concerns the client hasn't yet reported to staff","Confirm mother understands what each assessment is for"],
      script:"'Hi, I'm [name], [client]'s doula. She had [brief relevant birth summary]. Her key priorities are [top 2–3 items]. Is there anything from the last few hours we should make sure you know?'",
      prevent:"Without advocacy: third shift nurse performs care with no context, client feels processed. With advocacy: shift change becomes a real handoff."},
    {t:"Breastfeeding Initiation",sub:"Hours 6–24",color:C.gold,icon:"🍼",
      situation:"Breastfeeding initiation is the most support-dense moment of early postpartum. Latch difficulties, engorgement fears, and formula pressure all peak here.",
      advocacy:["Ensure a lactation consultant is requested if not automatically offered","Normalize cluster feeding, colostrum volume, and newborn weight loss","Support informed decision-making around supplementation — not a dogmatic position","If formula is given, help ensure it is an informed decision, not a default"],
      script:"'She'd like to give breastfeeding the best start possible. Can we get a lactation consultant here before discharge? If that's not available today, can we make sure she has the lactation helpline number and a scheduled follow-up?'",
      prevent:"Without advocacy: breastfeeding challenges interpreted as failure at Hour 18. With advocacy: challenges normalized, support activated, decision made with information."},
    {t:"Discharge Instructions",sub:"Hours 24–48",color:C.lavender,icon:"📄",
      situation:"Discharge paperwork arrives when the client is at peak exhaustion. Instructions are read aloud quickly. Signatures are requested on forms rarely fully explained.",
      advocacy:["Ask for printed copies of all instructions — do not rely on verbal-only information","Identify the three most critical warning signs and repeat them back","Confirm follow-up appointments have been scheduled before leaving","Ensure client has lactation support, mental health resources, and doula follow-up contact"],
      script:"'Before we sign discharge, can we take 10 minutes to walk through: what are the three things that should bring her back immediately, what does her follow-up look like, and does she have support at home for the first week?'",
      prevent:"Without advocacy: discharge happens faster than comprehension. With advocacy: client leaves knowing exactly when to call and who."},
    {t:"Home Arrival",sub:"Days 2–3",color:C.terra,icon:"🏠",
      situation:"The first 24–48 hours home are often the hardest — baby blues peak, milk comes in, support disperses, exhaustion compounds.",
      advocacy:["Make contact within 24 hours of discharge — not to check in performatively, but meaningfully","Assess for adequate support: food, sleep, visitor management","Normalize baby blues while watching for PPD escalation","Confirm all follow-up appointments are understood and accessible"],
      script:"'I'm calling because I mean it — not just because I'm supposed to. How are you actually doing? What does your house look like right now? What do you need?'",
      prevent:"Without advocacy: first postpartum home days handled alone in overwhelm. With advocacy: a known support figure actively checking in during the window when crises emerge."},
  ];
  const m=moments[step];
  return (
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {moments.map((mo,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{
            flex:"1 1 130px",background:step===i?`${mo.color}18`:"rgba(180,220,200,0.04)",
            border:`1px solid ${step===i?mo.color:"rgba(180,220,200,0.08)"}`,
            borderRadius:12,padding:"12px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",
          }}>
            <div style={{fontSize:18,marginBottom:4}}>{mo.icon}</div>
            <div style={{fontSize:11,color:step===i?mo.color:C.muted,fontFamily:"'DM Mono',monospace",lineHeight:1.3}}>{mo.t}</div>
            <div style={{fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace",marginTop:2}}>{mo.sub}</div>
          </button>
        ))}
      </div>
      <div style={{background:`linear-gradient(135deg,${m.color}0e,rgba(7,12,10,0.5))`,border:`1px solid ${m.color}28`,borderRadius:18,padding:22}}>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 210px"}}>
            <div style={{fontSize:10,color:m.color,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8}}>THE SITUATION</div>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.65,marginBottom:18}}>{m.situation}</p>
            <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8}}>DOULA ADVOCACY ACTIONS</div>
            {m.advocacy.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:m.color,flexShrink:0,marginTop:5}}/>
                <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{flex:"1 1 220px"}}>
            <div style={{background:`${m.color}12`,border:`1px solid ${m.color}28`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{fontSize:10,color:m.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>💬 SAMPLE SCRIPT</div>
              <p style={{fontSize:12,color:"rgba(235,240,235,0.75)",lineHeight:1.65,fontStyle:"italic",margin:0}}>{m.script}</p>
            </div>
            <div style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.08)",borderRadius:12,padding:14}}>
              <div style={{fontSize:10,color:C.teal,fontFamily:"'DM Mono',monospace",marginBottom:6}}>✨ WITH vs WITHOUT ADVOCACY</div>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.6,margin:0}}>{m.prevent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhasesSection() {
  const [active,setActive]=useState(null);
  const [tab,setTab]=useState("needs");
  const tabs=[{id:"needs",l:"📋 Needs"},{id:"actions",l:"🌸 Actions"},{id:"comms",l:"💬 Scripts"},{id:"barriers",l:"⚠️ Barriers"}];
  const p=phases.find(ph=>ph.id===active);
  return (
    <div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        {phases.map(ph=>(
          <button key={ph.id} onClick={()=>{setActive(active===ph.id?null:ph.id);setTab("needs");}} style={{
            flex:"1 1 140px",background:active===ph.id?`${ph.color}18`:"rgba(180,220,200,0.04)",
            border:`1px solid ${active===ph.id?ph.color:"rgba(180,220,200,0.08)"}`,
            borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{fontSize:22,marginBottom:5}}>{ph.icon}</div>
            <div style={{fontSize:11,color:ph.color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>{ph.label}</div>
            <div style={{fontSize:13,color:C.cream,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>{ph.sub}</div>
          </button>
        ))}
      </div>
      {p && (
        <div style={{background:`linear-gradient(135deg,${p.color}0b,rgba(7,12,10,0.5))`,border:`1px solid ${p.color}28`,borderRadius:18,padding:22}}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                background:tab===t.id?`${p.color}20`:"rgba(180,220,200,0.05)",
                border:`1px solid ${tab===t.id?p.color:"rgba(180,220,200,0.1)"}`,
                borderRadius:20,padding:"5px 14px",fontSize:12,
                fontFamily:"'DM Mono',monospace",color:tab===t.id?p.color:C.muted,cursor:"pointer",transition:"all 0.2s",
              }}>{t.l}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
            {(p[tab]||[]).map((item,i)=>(
              <div key={i} style={{background:"rgba(180,220,200,0.03)",border:"1px solid rgba(180,220,200,0.07)",borderRadius:10,padding:13}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:p.color,marginBottom:8}}/>
                <div style={{fontSize:12.5,color:tab==="comms"?"rgba(235,240,235,0.72)":C.muted,lineHeight:1.6,fontStyle:tab==="comms"?"italic":"normal"}}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!active && (
        <div style={{textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"20px 0"}}>
          ↑ Select a phase above to explore advocacy needs, actions, scripts, and barriers
        </div>
      )}
    </div>
  );
}

function BrainSection() {
  const [activeSup,setActiveSup]=useState(null);
  const s=supportTypes.find(st=>st.id===activeSup);
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:12}}>HOW STRESS AFFECTS DECISION-MAKING</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {brainFactors.map((f,i)=>(
            <div key={i} style={{flex:"1 1 170px",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:20,marginBottom:6}}>{f.icon}</div>
              <div style={{fontSize:13,color:C.teal,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,marginBottom:5}}>{f.label}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{f.effect}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>THE FOUR SUPPORT TYPES — CLICK TO EXPLORE</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
        {supportTypes.map(st=>(
          <button key={st.id} onClick={()=>setActiveSup(activeSup===st.id?null:st.id)} style={{
            flex:"1 1 160px",background:activeSup===st.id?`${st.color}18`:"rgba(180,220,200,0.04)",
            border:`1px solid ${activeSup===st.id?st.color:"rgba(180,220,200,0.08)"}`,
            borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{fontSize:24,marginBottom:6}}>{st.icon}</div>
            <div style={{fontSize:14,color:st.color,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{st.label}</div>
          </button>
        ))}
      </div>
      {s && (
        <div style={{background:`linear-gradient(135deg,${s.color}0e,rgba(7,12,10,0.5))`,border:`1px solid ${s.color}30`,borderRadius:16,padding:20}}>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 220px"}}>
              <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,marginBottom:14}}>{s.desc}</p>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:8}}>EXAMPLES IN PRACTICE</div>
              {s.examples.map((e,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:s.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{e}</span>
                </div>
              ))}
            </div>
            <div style={{flex:"1 1 200px"}}>
              <div style={{background:`${s.color}10`,border:`1px solid ${s.color}22`,borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:10,color:s.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>🧠 WHY STRESS MAKES THIS CRUCIAL</div>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.65,margin:0}}>{s.stressEffect}</p>
              </div>
              <div style={{background:"rgba(201,169,110,0.08)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:12,padding:14}}>
                <div style={{fontSize:10,color:C.gold,fontFamily:"'DM Mono',monospace",marginBottom:6}}>⚖️ SCOPE BOUNDARY</div>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.65,margin:0}}>{s.boundary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSection() {
  const [active,setActive]=useState(null);
  const [view,setView]=useState("points");
  const d=domains.find(dm=>dm.id===active);
  const views=[{id:"points",l:"📌 Principles"},{id:"doulas",l:"🌸 Doula Actions"},{id:"script",l:"💬 Sample Script"},{id:"scenario",l:"🎭 Scenario"}];
  return (
    <div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        {domains.map(dm=>(
          <button key={dm.id} onClick={()=>{setActive(active===dm.id?null:dm.id);setView("points");}} style={{
            flex:"1 1 145px",background:active===dm.id?`${dm.color}18`:"rgba(180,220,200,0.04)",
            border:`1px solid ${active===dm.id?dm.color:"rgba(180,220,200,0.08)"}`,
            borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.25s",
          }}>
            <div style={{fontSize:22,marginBottom:5}}>{dm.icon}</div>
            <div style={{fontSize:13,color:active===dm.id?dm.color:C.muted,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,lineHeight:1.3}}>{dm.label}</div>
          </button>
        ))}
      </div>
      {d && (
        <div style={{background:`linear-gradient(135deg,${d.color}0c,rgba(7,12,10,0.5))`,border:`1px solid ${d.color}28`,borderRadius:18,padding:22}}>
          <p style={{color:C.muted,fontSize:13.5,lineHeight:1.65,marginBottom:16}}>{d.summary}</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
            {views.map(v=>(
              <button key={v.id} onClick={()=>setView(v.id)} style={{
                background:view===v.id?`${d.color}20`:"rgba(180,220,200,0.05)",
                border:`1px solid ${view===v.id?d.color:"rgba(180,220,200,0.1)"}`,
                borderRadius:20,padding:"5px 14px",fontSize:12,
                fontFamily:"'DM Mono',monospace",color:view===v.id?d.color:C.muted,cursor:"pointer",transition:"all 0.2s",
              }}>{v.l}</button>
            ))}
          </div>
          {view==="points" && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
              {d.points.map((p,i)=>(
                <div key={i} style={{background:"rgba(180,220,200,0.03)",border:"1px solid rgba(180,220,200,0.07)",borderRadius:10,padding:13}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:d.color,marginBottom:8}}/>
                  <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>{p}</div>
                </div>
              ))}
            </div>
          )}
          {view==="doulas" && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
              {d.doulas.map((p,i)=>(
                <div key={i} style={{background:"rgba(180,220,200,0.03)",border:"1px solid rgba(180,220,200,0.07)",borderRadius:10,padding:13}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:d.color,marginBottom:8}}/>
                  <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>{p}</div>
                </div>
              ))}
            </div>
          )}
          {view==="script" && (
            <div style={{background:`${d.color}0e`,border:`1px solid ${d.color}28`,borderRadius:14,padding:18}}>
              <div style={{fontSize:10,color:d.color,fontFamily:"'DM Mono',monospace",marginBottom:10}}>💬 SAMPLE SCRIPT</div>
              <p style={{fontSize:13,color:"rgba(235,240,235,0.78)",lineHeight:1.75,fontStyle:"italic",margin:0,whiteSpace:"pre-line"}}>{d.script}</p>
            </div>
          )}
          {view==="scenario" && (
            <div style={{background:"rgba(180,220,200,0.03)",border:"1px solid rgba(180,220,200,0.08)",borderRadius:14,padding:18}}>
              <div style={{fontSize:10,color:d.color,fontFamily:"'DM Mono',monospace",marginBottom:8}}>🎭 REAL-WORLD SCENARIO</div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.7,margin:0}}>{d.scenario}</p>
            </div>
          )}
        </div>
      )}
      {!active && (
        <div style={{textAlign:"center",fontSize:12,color:C.faint,fontFamily:"'DM Mono',monospace",padding:"20px 0"}}>
          ↑ Select an advocacy domain to explore principles, doula actions, scripts, and scenarios
        </div>
      )}
    </div>
  );
}

function LearningSection() {
  const [qIdx,setQIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const [mythOpen,setMythOpen]=useState({});
  const [scenIdx,setScenIdx]=useState(0);
  const [showScen,setShowScen]=useState(false);
  const q=quizzes[qIdx];
  const sc=scenarios[scenIdx];

  const answer=(i)=>{ if(sel!==null)return; setSel(i); if(i===q.correct) setScore(s=>s+1); };
  const next=()=>{ if(qIdx<quizzes.length-1){setQIdx(q=>q+1);setSel(null);}else setDone(true); };
  const reset=()=>{ setQIdx(0);setSel(null);setScore(0);setDone(false); };

  return (
    <div>
      <div style={{marginBottom:36}}>
        <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>
          KNOWLEDGE CHECK {done?`— ${score}/${quizzes.length} CORRECT`:`— QUESTION ${qIdx+1} OF ${quizzes.length}`}
        </div>
        {!done ? (
          <div style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.1)",borderRadius:16,padding:22}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.cream,lineHeight:1.5,marginBottom:18}}>{q.q}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:sel!==null?16:0}}>
              {q.options.map((opt,i)=>{
                let bg="rgba(180,220,200,0.04)",bdr="rgba(180,220,200,0.1)",clr=C.muted;
                if(sel!==null){
                  if(i===q.correct){bg="rgba(111,181,160,0.2)";bdr=C.teal;clr=C.teal;}
                  else if(i===sel){bg="rgba(217,112,112,0.15)";bdr=C.warn;clr=C.warn;}
                }
                return (
                  <button key={i} onClick={()=>answer(i)} style={{
                    background:bg,border:`1px solid ${bdr}`,borderRadius:10,
                    padding:"10px 14px",textAlign:"left",cursor:sel!==null?"default":"pointer",
                    color:clr,fontSize:13,fontFamily:"'DM Mono',monospace",transition:"all 0.2s",
                  }}><span style={{opacity:0.5}}>{String.fromCharCode(65+i)}. </span>{opt}</button>
                );
              })}
            </div>
            {sel!==null && (
              <>
                <div style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.1)",borderRadius:10,padding:14,marginBottom:14,marginTop:16}}>
                  <div style={{fontSize:10,color:C.teal,fontFamily:"'DM Mono',monospace",marginBottom:6}}>EXPLANATION</div>
                  <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{q.explanation}</p>
                </div>
                <button onClick={next} style={{background:`${C.teal}20`,border:`1px solid ${C.teal}`,borderRadius:10,padding:"8px 20px",color:C.teal,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
                  {qIdx<quizzes.length-1?"Next Question →":"See Results →"}
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.1)",borderRadius:16,padding:28,textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12}}>{score===quizzes.length?"🌟":score>=4?"🌸":"🌱"}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:C.cream,marginBottom:8}}>{score}/{quizzes.length} Correct</div>
            <p style={{color:C.muted,fontSize:14,marginBottom:20,maxWidth:420,margin:"0 auto 20px"}}>
              {score===quizzes.length?"Excellent foundation in doula advocacy principles.":score>=4?"Strong understanding. Review the areas where you felt uncertain.":"Great start — the Advocacy Domains and Timeline sections will deepen your foundation."}
            </p>
            <button onClick={reset} style={{background:`${C.teal}20`,border:`1px solid ${C.teal}`,borderRadius:10,padding:"8px 20px",color:C.teal,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Retry Quiz</button>
          </div>
        )}
      </div>

      <div style={{marginBottom:36}}>
        <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>MYTH vs FACT — CLICK TO REVEAL</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {myths.map(mt=>{
            const open=!!mythOpen[mt.id];
            return (
              <div key={mt.id} onClick={()=>setMythOpen(p=>({...p,[mt.id]:!open}))} style={{
                background:open?"rgba(180,220,200,0.06)":"rgba(180,220,200,0.03)",
                border:`1px solid ${open?"rgba(180,220,200,0.18)":"rgba(180,220,200,0.07)"}`,
                borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.2s",
              }}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:12,color:C.warn,fontFamily:"'DM Mono',monospace",flexShrink:0,marginTop:1}}>{open?"✗":"?"} MYTH:</span>
                  <span style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{mt.m}</span>
                </div>
                {open && (
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(180,220,200,0.08)"}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:12,color:C.teal,fontFamily:"'DM Mono',monospace",flexShrink:0,marginTop:1}}>✓ FACT:</span>
                      <span style={{fontSize:13,color:"rgba(235,240,235,0.72)",lineHeight:1.6}}>{mt.f}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>SCENARIO-BASED TRAINING</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {scenarios.map((sc,i)=>(
            <button key={i} onClick={()=>{setScenIdx(i);setShowScen(false);}} style={{
              flex:"1 1 130px",background:scenIdx===i?"rgba(180,220,200,0.07)":"rgba(180,220,200,0.03)",
              border:`1px solid ${scenIdx===i?"rgba(180,220,200,0.22)":"rgba(180,220,200,0.07)"}`,
              borderRadius:12,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",background:sc.color,marginBottom:6}}/>
              <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",lineHeight:1.3}}>{sc.title}</div>
            </button>
          ))}
        </div>
        <div style={{background:`${sc.color}0c`,border:`1px solid ${sc.color}28`,borderRadius:16,padding:20}}>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:sc.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>📋 THE SITUATION</div>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{sc.situation}</p>
          </div>
          <div style={{background:"rgba(217,112,112,0.08)",border:"1px solid rgba(217,112,112,0.2)",borderRadius:10,padding:12,marginBottom:12}}>
            <div style={{fontSize:10,color:C.warn,fontFamily:"'DM Mono',monospace",marginBottom:6}}>❌ WITHOUT ADVOCACY</div>
            <p style={{fontSize:12.5,color:"rgba(235,240,235,0.65)",lineHeight:1.6,margin:0}}>{sc.wrong}</p>
          </div>
          {!showScen ? (
            <button onClick={()=>setShowScen(true)} style={{background:`${sc.color}18`,border:`1px solid ${sc.color}`,borderRadius:10,padding:"8px 20px",color:sc.color,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
              Reveal Doula Response →
            </button>
          ) : (
            <>
              <div style={{background:`${sc.color}12`,border:`1px solid ${sc.color}28`,borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontSize:10,color:sc.color,fontFamily:"'DM Mono',monospace",marginBottom:6}}>✅ DOULA RESPONSE</div>
                <p style={{fontSize:13,color:"rgba(235,240,235,0.78)",lineHeight:1.65,fontStyle:"italic",margin:0}}>{sc.doula}</p>
              </div>
              <div style={{background:"rgba(111,181,160,0.08)",border:"1px solid rgba(111,181,160,0.2)",borderRadius:10,padding:12}}>
                <div style={{fontSize:10,color:C.teal,fontFamily:"'DM Mono',monospace",marginBottom:6}}>💡 THE LESSON</div>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{sc.lesson}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SupportSection() {
  const [aud,setAud]=useState("doulas");
  const d=supportData[aud];
  return (
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {Object.entries(supportData).map(([key,val])=>(
          <button key={key} onClick={()=>setAud(key)} style={{
            flex:"1 1 120px",background:aud===key?`${val.color}18`:"rgba(180,220,200,0.04)",
            border:`1px solid ${aud===key?val.color:"rgba(180,220,200,0.08)"}`,
            borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.25s",textAlign:"left",
          }}>
            <div style={{fontSize:20,marginBottom:4}}>{val.icon}</div>
            <div style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:aud===key?val.color:C.muted}}>{val.label}</div>
          </button>
        ))}
      </div>
      <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>GUIDANCE FOR {d.label.toUpperCase()}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
        {d.tips.map((tip,i)=>(
          <div key={i} style={{background:"rgba(180,220,200,0.04)",border:"1px solid rgba(180,220,200,0.08)",borderRadius:12,padding:16,display:"flex",gap:14}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:`${d.color}20`,border:`1px solid ${d.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:d.color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{i+1}</div>
            <div>
              <div style={{fontSize:14,color:d.color,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,marginBottom:4}}>{tip.t}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.65}}>{tip.b}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(217,112,112,0.08)",border:"1px solid rgba(217,112,112,0.2)",borderRadius:16,padding:18}}>
        <div style={{fontSize:10,color:C.warn,fontFamily:"'DM Mono',monospace",letterSpacing:"0.18em",marginBottom:14}}>⚠️ WARNING SIGNS — REFER OR ESCALATE IMMEDIATELY</div>
        {d.warnings.map((w,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:9}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.warn,flexShrink:0,marginTop:5}}/>
            <span style={{fontSize:13,color:"rgba(235,240,235,0.72)",lineHeight:1.5}}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DoulaGuide() {
  const [section,setSection]=useState("timeline");
  const [ready,setReady]=useState(false);
  useEffect(()=>{ setTimeout(()=>setReady(true),100); },[]);
  const meta=sectionMeta[section]||{title:"",sub:""};
  const idx=navItems.findIndex(n=>n.id===section);
  const prev=navItems[idx-1], next=navItems[idx+1];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#070c0a 0%,#0a100c 50%,#080c12 100%)",fontFamily:"'Georgia',serif",color:C.cream}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');
        button{outline:none;} *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(111,181,160,0.2);border-radius:2px;}
      `}</style>

      <div style={{background:"rgba(7,12,10,0.9)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(180,220,200,0.07)",padding:"20px 24px 0",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8,marginBottom:16}}>
              <div>
                <div style={{fontSize:9.5,letterSpacing:"0.32em",color:"rgba(235,240,235,0.28)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:4}}>
                  Interactive Learning Guide · Doula Advocacy
                </div>
                <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,3.8vw,36px)",margin:0,lineHeight:1.1,fontWeight:700,background:"linear-gradient(135deg,#EBF0EB,#6FB5A0,#C8A96E,#A99BC0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  The Art of Advocacy
                  <span style={{fontWeight:400,fontStyle:"italic",fontSize:"0.68em"}}> — Doula Support Across the Journey</span>
                </h1>
              </div>
              <div style={{fontSize:10,color:"rgba(235,240,235,0.22)",fontFamily:"'DM Mono',monospace",textAlign:"right"}}>7 Sections · Conception → 12 Months</div>
            </div>
            <div style={{display:"flex",gap:0,overflowX:"auto",marginLeft:-4}}>
              {navItems.map(nav=>(
                <button key={nav.id} onClick={()=>setSection(nav.id)} style={{
                  background:"transparent",border:"none",
                  borderBottom:`2px solid ${section===nav.id?C.teal:"transparent"}`,
                  padding:"8px 14px",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",
                  color:section===nav.id?C.teal:"rgba(235,240,235,0.38)",
                  fontSize:11.5,fontFamily:"'DM Mono',monospace",
                }}>{nav.icon} {nav.short}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"30px 20px 70px"}}>
        <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(18px)",transition:"all 0.5s ease 0.08s"}}>
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,30px)",margin:"0 0 4px",fontWeight:600}}>{meta.title}</h2>
            <p style={{color:C.faint,fontSize:12.5,margin:0,fontFamily:"'DM Mono',monospace"}}>{meta.sub}</p>
          </div>
          <div style={{background:"rgba(180,220,200,0.025)",border:"1px solid rgba(180,220,200,0.07)",borderRadius:22,padding:"26px 24px"}}>
            {section==="timeline" && <TimelineSection/>}
            {section==="48h" && <FortyEightSection/>}
            {section==="phases" && <PhasesSection/>}
            {section==="brain" && <BrainSection/>}
            {section==="dashboard" && <DashboardSection/>}
            {section==="learning" && <LearningSection/>}
            {section==="support" && <SupportSection/>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:20,borderTop:"1px solid rgba(180,220,200,0.06)"}}>
            {prev ? (
              <button onClick={()=>setSection(prev.id)} style={{background:"rgba(180,220,200,0.05)",border:"1px solid rgba(180,220,200,0.1)",borderRadius:10,padding:"8px 18px",color:"rgba(235,240,235,0.45)",fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>← {prev.short}</button>
            ) : <div/>}
            {next ? (
              <button onClick={()=>setSection(next.id)} style={{background:`${C.teal}18`,border:`1px solid ${C.teal}40`,borderRadius:10,padding:"8px 18px",color:C.teal,fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{next.short} →</button>
            ) : <div/>}
          </div>
          <div style={{textAlign:"center",fontSize:10,color:"rgba(235,240,235,0.16)",fontFamily:"'DM Mono',monospace",marginTop:28,lineHeight:1.6}}>
            Educational resource for doulas, families, and providers.<br/>
            This guide does not constitute legal advice, clinical guidance, or a substitute for professional doula training.
          </div>
        </div>
      </div>
    </div>
  );
}
