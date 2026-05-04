import { useState, useEffect } from "react";

const C = {
  bg:"#080d1a", card:"#0f1628", border:"rgba(148,163,184,0.1)",
  borderHov:"rgba(148,163,184,0.22)", pink:"#e879f9", teal:"#22d3ee",
  purple:"#a78bfa", gold:"#fbbf24", green:"#34d399", red:"#f87171",
  orange:"#fb923c", blue:"#60a5fa", text:"#f1f5f9",
  muted:"#e2e8f0", faint:"rgba(226,232,240,0.65)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SCOPE_PRINCIPLES = [
  { icon:"✅", label:"Within Your Role", color:C.green, items:[
    "Being a calm, grounded, non-judgmental presence",
    "Reflecting back what you hear without interpretation",
    "Naming what you observe: 'You seem really exhausted today'",
    "Asking open, curious questions that create space",
    "Normalizing common postpartum emotions without minimizing them",
    "Connecting clients to professional support warmly and without stigma",
    "Facilitating peer support circles centered on shared experience",
    "Staying present during difficult emotional conversations",
    "Recognizing signs that suggest a professional referral is needed",
    "Following up after a referral to ensure the connection was made",
  ]},
  { icon:"🚫", label:"Outside Your Role", color:C.red, items:[
    "Diagnosing depression, anxiety, PTSD, or any mental health condition",
    "Providing therapy, counseling, or clinical mental health treatment",
    "Interpreting the meaning of a client's emotions or experiences",
    "Advising on psychiatric medications or suggesting changes to existing prescriptions",
    "Positioning yourself as a substitute for licensed mental health care",
    "Leading structured therapeutic interventions (CBT, EMDR, etc.)",
    "Conducting clinical risk assessments",
    "Making decisions about hospitalization or level of care",
    "Promising confidentiality when safety is at risk",
    "Continuing to hold space when a situation requires emergency services",
  ]},
];

const EMOTIONAL_SIGNS = [
  { category:"Watch For", color:C.gold, urgency:"low",
    desc:"These signs suggest emotional difficulty that warrants extra attentiveness, check-in questions, and warm monitoring  -  not immediate escalation.",
    signs:[
      { sign:"Excessive tearfulness without clear context", what:"Grief, overwhelm, or early PPD symptoms. Create space  -  don't rush to fix." },
      { sign:"Flat affect or emotional disconnection", what:"Emotional numbing can indicate dissociation or depression. Note the pattern across visits." },
      { sign:"Expressing feeling like 'a bad mother'", what:"Shame-based cognition is a hallmark of perinatal mood disorders. Normalize gently, monitor closely." },
      { sign:"Withdrawing from partner, family, or baby", what:"Social withdrawal is both a symptom and a risk factor. Ask about support systems." },
      { sign:"Sleep disruption beyond normal newborn care", what:"When a parent cannot sleep even when the baby is sleeping, this warrants attention." },
      { sign:"Losing interest in things that normally bring joy", what:"Anhedonia  -  present in depression. One of the most diagnostically significant signs." },
      { sign:"Increased irritability or anger without clear cause", what:"Often misread as 'personality.' Irritability is one of the most common presentations of PPD  -  especially in Black women." },
    ]},
  { category:"Refer Promptly", color:C.orange, urgency:"medium",
    desc:"These signs indicate that a warm referral to a perinatal mental health professional should happen at this visit  -  not deferred.",
    signs:[
      { sign:"Persistent anxiety that interferes with daily functioning", what:"Can't eat, sleep, or care for baby due to worry. Postpartum anxiety is as common as PPD and often more intense." },
      { sign:"Intrusive thoughts (scary thoughts about the baby)", what:"Common and NOT predictive of harm  -  but deeply distressing. Requires compassionate normalization AND referral." },
      { sign:"Disconnection from the baby  -  difficulty bonding", what:"Not a character flaw. Can be a trauma response or symptom of PPOCD or PPD. Needs professional support." },
      { sign:"Expressing hopelessness about the future", what:"Hopelessness is a high-weight risk factor. Refer to mental health provider same day if possible." },
      { sign:"Partner or family reporting significant behavioral changes", what:"Others often notice before the client discloses. Take these reports seriously." },
      { sign:"Expressing that the baby or family would be 'better off without me'", what:"Passive suicidal ideation. This requires immediate crisis response, not deferral." },
    ]},
  { category:"Escalate Immediately", color:C.red, urgency:"high",
    desc:"These signs require crisis response NOW. Do not leave the client alone. Do not defer to the next visit.",
    signs:[
      { sign:"Active suicidal ideation with plan or intent", what:"CALL 988 or 911. Stay with the client. Do not leave them alone with the baby." },
      { sign:"Postpartum psychosis  -  confusion, delusions, hallucinations", what:"Medical emergency. Extremely rare (1–2/1000) but requires immediate emergency hospitalization. Call 911." },
      { sign:"Parent expressing intent to harm themselves or the baby", what:"Call 911 immediately. Ensure baby's safety first. Remain calm. Do not leave the scene." },
      { sign:"Complete inability to function  -  not eating, not moving, unresponsive", what:"Severe depressive episode. Requires same-day medical evaluation. Call OB or call 988 for guidance." },
    ]},
];

const LANGUAGE_GUIDE = [
  { situation:"Client says: 'I don't feel like myself'", avoid:"'That's normal  -  it will pass'", use:"'Tell me more about what that feels like for you. When did you start noticing it?'", why:"Rushing to reassurance closes the conversation. Curiosity opens it." },
  { situation:"Client says: 'I'm a terrible mother'", avoid:"'That's not true  -  you're doing great!'", use:"'It sounds like you're being really hard on yourself. What happened that's making you feel that way?'", why:"Contradicting shame doesn't resolve it. Exploring it with them gives it somewhere to go." },
  { situation:"Client is crying without explanation", avoid:"'Don't cry  -  everything is okay'", use:"Sit quietly. Then: 'I'm right here. You don't have to explain anything. Take all the time you need.'", why:"Presence without pressure is the most therapeutic thing a non-therapist can offer." },
  { situation:"Client expresses intrusive thoughts about the baby", avoid:"'Oh no  -  that sounds really scary. Have you hurt them?'", use:"'Thank you for trusting me with that. Those kinds of thoughts are more common than most people know  -  they don't mean you're dangerous. They're your mind's way of processing fear. I want to connect you with someone who specializes in exactly this.'", why:"Panic or interrogation increases shame and closes disclosure. Calm normalization + immediate referral is the correct response." },
  { situation:"Client hasn't left the house in two weeks", avoid:"'You need to get out more  -  it'll help!'", use:"'It sounds like getting out feels really hard right now. Can you tell me what gets in the way?'", why:"Unsolicited advice on behavior creates shame. Curiosity uncovers the actual barrier." },
  { situation:"Client says: 'I don't think I'm bonding with my baby'", avoid:"'Give it time  -  bonding takes a while for some people'", use:"'That takes courage to say out loud. What does that feel like from the inside? Is it more like disconnection, or numbness, or something else?'", why:"Dismissing bonding concerns delays care. Exploring the experience helps you understand what kind of support is actually needed." },
  { situation:"Client expresses anger at partner or baby", avoid:"'I'm sure they didn't mean it  -  or  -  try to remember this phase won't last'", use:"'That sounds really exhausting and isolating. You're allowed to feel frustrated. What do you need most right now?'", why:"Invalidating anger shuts down disclosure of what might be important relationship safety information." },
  { situation:"Client becomes overwhelmed mid-conversation", avoid:"Continuing with your agenda or asking more questions", use:"Pause everything. Lower your voice. 'Let's slow down. I'm not going anywhere. Can I just sit with you for a minute?'", why:"An overwhelmed nervous system cannot process information. Co-regulation through calm presence comes first." },
];

const REFLECTIVE_LISTENING = {
  overview:"Reflective listening is one of the most powerful tools a non-therapist can use  -  precisely because it doesn't require clinical training. It is not advice, interpretation, or problem-solving. It is the practice of hearing what someone says and reflecting it back in a way that communicates: I heard you. I'm with you. You don't have to manage this alone.",
  skills:[
    { skill:"Simple Reflection", icon:"🔄", color:C.teal,
      desc:"Repeat back the core of what you heard in your own words  -  briefly.",
      example_in:"'I just feel like no matter what I do, it's never enough. I can't keep up with anything.'",
      example_out:"'It sounds like you're carrying a lot and nothing feels like enough right now.'",
      pitfall:"Don't add to it. Don't interpret. Don't immediately offer a solution. Just reflect." },
    { skill:"Feeling Reflection", icon:"💗", color:C.pink,
      desc:"Name the emotion you're hearing  -  not to label them, but to check if you heard correctly.",
      example_in:"'My husband keeps telling me to sleep when the baby sleeps but I just can't.'",
      example_out:"'It sounds really frustrating when you're getting advice that just doesn't fit where you are right now.'",
      pitfall:"If you name the wrong emotion, they will correct you  -  and that correction is useful information. Don't be afraid to get it 'wrong'." },
    { skill:"Validation", icon:"🌿", color:C.green,
      desc:"Communicate that their feelings make sense  -  not that everything is fine.",
      example_in:"'I don't know why I'm crying. There's nothing even wrong.'",
      example_out:"'You don't need a reason for this to be hard. Your body and mind have been through something significant. Feelings don't always follow logic.'",
      pitfall:"Validation is NOT agreement that the situation is hopeless. It is acknowledgment that their feelings are a reasonable response to their circumstances." },
    { skill:"Open Questions", icon:"🔑", color:C.gold,
      desc:"Questions that invite exploration rather than yes/no answers. Start with What, How, Tell me more.",
      example_in:"[After client shares difficult moment]",
      example_out:"'What's that been like for you?' / 'How long has this been feeling this way?' / 'Tell me more about that part.'",
      pitfall:"'Why' questions can feel interrogative. 'Why do you feel that way?' puts people on the defensive. 'What do you think might be underneath that?' is gentler." },
    { skill:"Comfortable Silence", icon:"🤫", color:C.purple,
      desc:"Not all silences need to be filled. A pause after emotional disclosure is not awkward  -  it is respectful.",
      example_in:"[Client finishes sharing something difficult and goes quiet]",
      example_out:"[Wait. Stay present. Make eye contact. Let 5–10 full seconds pass. Then, if needed: 'I'm right here. Take all the time you need.']",
      pitfall:"Rushing to fill silence with reassurance communicates that their emotion is uncomfortable for YOU. Sitting in it communicates that you can hold it." },
    { skill:"Soft Redirect to Support", icon:"🔗", color:C.blue,
      desc:"Transitioning from reflective presence to a referral without it feeling like a dismissal.",
      example_in:"[After listening fully to a client who describes ongoing depression symptoms]",
      example_out:"'What you've just shared matters, and you deserve more support than I'm able to offer. There's someone who specializes in exactly what you're describing  -  and I want to help you connect with them. Would it be okay if we figured that out together right now?'",
      pitfall:"A referral without a full listen first feels like rejection. Always reflect and validate BEFORE transitioning to referral language." },
  ]
};

const WARM_REFERRAL = {
  overview:"A warm referral is not a resource list. It is an active bridge between the client and the support they need  -  made in a way that honors their dignity, reduces shame, and increases the likelihood that they actually follow through. The difference between a warm referral and a cold one is relationship.",
  steps:[
    { step:1, title:"Listen fully first", color:C.teal,
      desc:"A referral before a full listen communicates that you want to offload rather than support. Complete the emotional conversation before transitioning.",
      language:"'Before we talk about next steps, I want to make sure I really heard you. Is there anything else on your heart right now?'" },
    { step:2, title:"Normalize without minimizing", color:C.purple,
      desc:"Reduce the stigma of seeking help by framing professional support as the expected, smart response  -  not a sign of failure.",
      language:"'What you're describing is something a lot of women go through  -  and it's also something that responds really well to the right support. You deserve specialized care for this, not just pushing through.'" },
    { step:3, title:"Name the resource specifically", color:C.gold,
      desc:"Vague referrals ('you should talk to someone') rarely convert. Name a specific person, program, or number and explain what it is.",
      language:"'Postpartum Support International has a warmline  -  it's specifically for exactly what you're describing. The number is 1-800-944-4773. You can call or text, and there's no appointment needed. I've connected other clients with them and they felt heard from the first call.'" },
    { step:4, title:"Offer to help make the connection", color:C.pink,
      desc:"The distance between knowing about a resource and actually using it is often just friction. Reducing that friction dramatically improves follow-through.",
      language:"'Would it help if we pulled up the number together right now? Or I could text it to you so you have it on your phone. You don't have to call today  -  but I want to make sure it's easy when you're ready.'" },
    { step:5, title:"Follow up", color:C.green,
      desc:"A referral is not complete when the conversation ends. Following up communicates that you are still holding this person in mind.",
      language:"'I'm going to check in with you in a few days  -  not to pressure you, just because I want to know how you're doing and whether you were able to connect with anyone. Is that okay?'" },
  ],
  resources:[
    { name:"PSI Warmline  -  Postpartum Support International", contact:"1-800-944-4773", detail:"Call or text. English + Spanish. Perinatal mental health specialists. 24/7.", color:C.pink, urgent:true },
    { name:"National Maternal Mental Health Hotline (HRSA)", contact:"1-833-943-5746", detail:"24/7. Confidential. Call or text. Spanish available.", color:C.purple, urgent:true },
    { name:"988 Suicide & Crisis Lifeline", contact:"988", detail:"Dial or text. 24/7. LGBTQ+ option (press 3). Spanish available.", color:C.red, urgent:true },
    { name:"PSI Indiana Provider Directory", contact:"postpartum.net/get-help/find-a-psi-provider", detail:"Search by zip for local perinatal therapists, psychiatrists, and support groups.", color:C.teal, urgent:false },
    { name:"Indiana Behavioral Health Coalition  -  Perinatal", contact:"ibhc.org", detail:"Directory of Indiana perinatal mental health specialists. Updated regularly.", color:C.gold, urgent:false },
    { name:"Eskenazi Midtown Community Mental Health (Indy)", contact:"317-880-8491", detail:"Safety-net mental health. Walk-in crisis. Medicaid accepted. No one turned away.", color:C.orange, urgent:false },
  ]
};

const SUPPORT_CIRCLES = {
  overview:"A postpartum support circle is a facilitated peer gathering where new parents share experiences, reduce isolation, and feel witnessed by others who understand. Doulas can hold this kind of space powerfully  -  not as therapists, but as community anchors. The goal is connection, not treatment.",
  doula_vs_therapy:[
    { role:"Doula Facilitated Circle", items:["Peer-to-peer sharing and connection","Normalizing common experiences","Creating a safe, non-judgmental container","Community support and reduced isolation","Referral to professional support when needed","Group presence and witnessed experience"] },
    { role:"Therapy / Clinical Group", items:["Clinical diagnosis and treatment","Structured therapeutic interventions","Processing trauma with licensed guidance","Prescription and medication management","Clinical risk assessment","HIPAA-regulated documentation"] },
  ],
  groundrules:[
    { rule:"What's shared here, stays here", icon:"🔒", desc:"Confidentiality is the foundation. Be explicit: no sharing names, stories, or details outside the circle  -  including on social media." },
    { rule:"No advice unless asked", icon:"🤐", desc:"The circle is for sharing, not fixing. 'Have you tried...' closes people down. Listening and witnessing opens them up. Save advice for when it's specifically invited." },
    { rule:"Speak only for yourself", icon:"🗣️", desc:"'I feel...' not 'You should feel...' or 'All mamas feel...' Every person's experience is their own." },
    { rule:"Feelings are welcome here  -  all of them", icon:"💗", desc:"Joy, grief, rage, numbness, love, resentment  -  all of it has a place. No feeling is wrong or too much. This is one of the few spaces where all of it is allowed." },
    { rule:"The right to pass", icon:"✋", desc:"No one is required to share. Witnessing the circle is participation. The invitation is always open but never mandatory." },
    { rule:"Make space, take space", icon:"↔️", desc:"Invite quieter voices. Notice if any one person is filling all the space. The facilitator gently tends the balance." },
    { rule:"We are not here to diagnose or fix each other", icon:"⚕️", desc:"If someone shares something that sounds serious  -  the group can witness with care, and the facilitator handles any referral needs privately, not in the group." },
  ],
  opening_prompts:[
    "What's one word that describes where you are today  -  no explanation needed, just the word?",
    "What's something about this season that nobody warned you about?",
    "What's one thing you wish someone had said to you in your first weeks postpartum?",
    "What has surprised you most about yourself as a parent?",
    "If you could send a message to the version of yourself who was 9 months pregnant, what would it be?",
    "What's one thing that has felt hard to say out loud  -  that you might be willing to say here?",
    "Where in your body do you most feel the weight of this season?",
  ],
  facilitation_moves:[
    { move:"The Gentle Redirect", icon:"↩️", color:C.teal,
      when:"When a conversation is heading toward advice-giving, comparison, or one-upping experiences",
      say:"'Thank you for that. I want to make sure [Name] feels fully heard first  -  [Name], is there anything else you wanted to share before we open it up?'" },
    { move:"The Bridge", icon:"🌉", color:C.purple,
      when:"When you want to connect one person's experience to the group's shared humanity",
      say:"'I notice that what [Name] is sharing might resonate for others in the room. Is anyone else sitting with something similar?'" },
    { move:"The Check-In", icon:"👁️", color:C.gold,
      when:"When someone has gone quiet or seems to be carrying something they haven't shared",
      say:"'[Name], I just want to check in  -  you don't have to share anything, but I want to make sure you know there's space for you here if you want it.'" },
    { move:"The Pause", icon:"🤫", color:C.pink,
      when:"When an emotional moment needs room to breathe",
      say:"[Simply hold silence for 10–15 seconds. Lower your voice before speaking again.] 'Let's just sit with that for a moment.'" },
    { move:"The Grounding Close", icon:"🌿", color:C.green,
      when:"Closing the circle or after a particularly heavy share",
      say:"'Before we close, I want to acknowledge what everyone brought today. What happened here mattered. You were seen. Carry that with you.'" },
    { move:"The Private Follow-Up", icon:"🔗", color:C.orange,
      when:"A circle member shares something that suggests they need more than peer support",
      say:"[Wait until after the group. Privately:] 'What you shared today took courage. I want to make sure you have support beyond our circle. Can I share a resource with you?'" },
  ],
  session_structure:[
    { time:"0–5 min", phase:"Welcome & Ground Rules", detail:"Open the circle. State the ground rules. Set the intention: 'This is a space to be witnessed, not to be fixed.'" },
    { time:"5–10 min", phase:"Opening Round", detail:"One word or brief check-in from each person. No cross-talk. Just presence." },
    { time:"10–40 min", phase:"Open Sharing", detail:"Theme-based or open. Use facilitation moves as needed. Tend the balance of voices." },
    { time:"40–50 min", phase:"Closing Round", detail:"Each person shares one thing they're taking with them. Brief, no pressure." },
    { time:"50–60 min", phase:"After-Circle Space", detail:"Informal connection. The facilitator stays available for any private follow-up needed." },
  ]
};

const SCENARIOS = [
  { id:"s1", title:"Client discloses intrusive thoughts", icon:"💭", color:C.purple, difficulty:"High",
    setup:"During a postpartum visit, your client  -  Day 12 postpartum  -  becomes tearful and haltingly tells you she's been having scary thoughts about something happening to the baby while she's holding it. She says she would never hurt the baby but the thoughts won't stop and she's terrified of herself.",
    options:[
      { label:"A. Tell her these thoughts mean she's not safe to be alone with the baby and call her husband immediately", outcome:"wrong", feedback:"This response catastrophizes normal postpartum cognition, destroys trust, and is not clinically accurate. Intrusive thoughts are common (up to 91% of new parents have them) and are NOT predictive of harm. This response could cause irreparable harm to the relationship and delay her getting real support." },
      { label:"B. Reassure her that lots of moms feel this way and it's just hormones  -  it will pass", outcome:"partial", feedback:"The normalization is correct  -  intrusive thoughts are very common. But stopping there doesn't get her the support she needs. 'It will pass' without a referral misses the severity of her distress. This is a warm referral moment, not a reassurance-and-move-on moment." },
      { label:"C. Thank her for trusting you, normalize the experience calmly, stay present, and then offer a warm referral to a perinatal mental health provider today", outcome:"correct", feedback:"This is the correct response. Calm normalization ('these thoughts are more common than most people know and don't mean you're dangerous') preserves trust and reduces shame. Immediate warm referral to a perinatal mental health specialist ensures she gets clinical support for what is a real symptom requiring professional care." },
      { label:"D. Ask her to describe the thoughts in detail so you can assess the risk level", outcome:"wrong", feedback:"Clinical risk assessment is outside your scope. Asking a client to detail intrusive thoughts without clinical training can increase distress and reinforce the thoughts. Your role is to stay calm, normalize, and refer  -  not assess." },
    ],
    debrief:"Intrusive thoughts (unwanted, distressing thoughts about harm coming to the baby) affect the majority of new parents and are one of the most misunderstood perinatal mental health experiences. They are ego-dystonic  -  meaning they horrify the person having them, which is actually a clinical sign that differentiates them from genuine risk. Your calm in this moment is the intervention. Then: refer." },

  { id:"s2", title:"Circle member escalates to crisis", icon:"⚡", color:C.red, difficulty:"High",
    setup:"Twenty minutes into a support circle, a participant begins crying heavily and says: 'I don't see the point anymore. I feel like my family would be better off without me. I just want to disappear.' The group goes quiet.",
    options:[
      { label:"A. Gently acknowledge what she said and continue the circle  -  she probably just needs to be heard", outcome:"wrong", feedback:"Passive suicidal ideation ('my family would be better off without me,' 'I want to disappear') requires immediate response  -  not continuation of the group agenda. This statement cannot be absorbed into the circle and moved past." },
      { label:"B. Pause the circle immediately, tend to the group, then follow up with the individual privately and connect her to crisis support", outcome:"correct", feedback:"Correct. Pause the circle gracefully ('Let's take a breath together'). Tend to group members who may be activated. Follow up privately with the individual: stay with her, don't leave her alone, connect her to 988 or PSI warmline immediately. This is a crisis response  -  not a circle facilitation moment." },
      { label:"C. Ask the group to support her and let the circle hold the weight of her pain", outcome:"wrong", feedback:"The circle is a peer support space  -  not a crisis intervention tool. Asking the group to hold a crisis situation is unsafe for the individual (who needs professional support, not peer witnessing) and potentially traumatizing for other circle members." },
      { label:"D. Calmly ask her directly: 'Are you thinking about suicide?' and document her answer", outcome:"partial", feedback:"Asking directly about suicide is not harmful  -  it does not increase risk and can actually reduce it. However, clinical assessment and documentation is outside scope. The correct move is to stay calm, stay present, and connect her to 988 or PSI Warmline where trained crisis counselors can provide the actual assessment. You do not need to assess  -  you need to bridge." },
    ],
    debrief:"'My family would be better off without me' and 'I want to disappear' are passive suicidal ideation statements. Do not minimize, absorb into the group, or defer. Pause the circle gracefully, ensure the individual is not left alone, and connect her to 988 (call or text) or PSI Warmline (1-800-944-4773). Your role is bridge, not assessor." },

  { id:"s3", title:"Client refuses referral", icon:"🚪", color:C.gold, difficulty:"Medium",
    setup:"You've noticed increasing signs of PPD in your client over three visits  -  tearfulness, sleep disruption beyond newborn demands, disconnection from the baby, and expressed hopelessness. You've gently suggested connecting with a perinatal therapist twice. Today she says: 'I'm fine. I just need more sleep. I don't need a therapist  -  I'm not crazy.'",
    options:[
      { label:"A. Respect her autonomy  -  she said she's fine, so drop the subject", outcome:"partial", feedback:"Respecting autonomy is correct  -  you cannot force referral. But dropping the subject entirely when someone has three visits of escalating symptoms is not the same as honoring their autonomy. You can hold the concern with care without coercion." },
      { label:"B. Tell her what you've observed directly and calmly, reframe the referral away from 'therapy' language, leave the resource, and honor her choice while keeping the door open", outcome:"correct", feedback:"Correct. Name what you've observed without diagnosis: 'I've noticed over a few visits that you seem more depleted each time  -  and I want to make sure you have support beyond what I can offer.' Reframe: 'This isn't about being in crisis  -  it's about having someone in your corner who knows this terrain.' Leave the PSI Warmline number. Then honor her choice. She may reach out on her own timeline." },
      { label:"C. Tell her family members about your concerns so they can apply pressure", outcome:"wrong", feedback:"This violates client trust and confidentiality. Family members do not have a right to clinical or personal information you've gathered in the care relationship. If safety is not immediately at risk, the decision to seek support is hers." },
      { label:"D. Increase visit frequency and provide more emotional support yourself to compensate for her not seeking therapy", outcome:"wrong", feedback:"Intensifying your own emotional support as a substitute for professional care crosses scope boundaries and ultimately delays the client getting appropriate help. More of what you can offer is not the answer when what's needed is clinical support." },
    ],
    debrief:"Refusal of referral is common and must be respected  -  but it doesn't mean the conversation is over. What you can do: name what you observe (factually, not diagnostically), reframe the resource without stigma, leave the number, and honor her choice. Many clients reach out weeks later. A seed planted respectfully is still a seed." },

  { id:"s4", title:"Group member gives unsolicited advice", icon:"💬", color:C.teal, difficulty:"Low",
    setup:"In your support circle, a parent who had a very positive postpartum experience begins responding to other members' struggles with 'You just need to...' advice. The room energy is shifting and you notice a quieter member retreating.",
    options:[
      { label:"A. Let it continue  -  they're trying to help and it's peer support, not therapy", outcome:"wrong", feedback:"The ground rule 'no advice unless asked' exists precisely for this reason. Unsolicited advice in a support circle communicates 'your experience is a problem to be solved' rather than 'your experience is valid as it is.' Over time, it erodes the safety of the space and silences the members who most need to be heard." },
      { label:"B. Gently redirect using facilitation language that honors both members without shaming the advice-giver", outcome:"correct", feedback:"Correct. A gentle redirect: 'I love that you want to support [Name]  -  and let's make sure [Name] feels fully heard first. [Name], is there more you wanted to share?' This honors the impulse to help while redirecting the behavior without shame. The advice-giver stays in the circle. The quieter member feels witnessed." },
      { label:"C. Announce the ground rule again to the whole group to make the point clear", outcome:"partial", feedback:"Re-stating the ground rule to the group is sometimes appropriate  -  but targeting it at one person's behavior publicly creates embarrassment. A gentler facilitation move redirects the conversation without spotlighting the person. Save the ground rule re-statement for when the pattern is group-wide." },
      { label:"D. End the session early to prevent further harm to the dynamic", outcome:"wrong", feedback:"Ending early teaches the group that difficult moments end the space rather than being held within it. The facilitator's skill is using these moments as opportunities to demonstrate exactly the kind of care the circle exists to model." },
    ],
    debrief:"Advice-giving in peer support circles is one of the most common facilitation challenges. It comes from a place of care  -  which is why direct confrontation backfires. The graceful redirect honors the impulse while protecting the container. Practice it until it feels natural, because you will use it every single circle." },

  { id:"s5", title:"Client with birth trauma history", icon:"🌀", color:C.blue, difficulty:"High",
    setup:"During a prenatal visit, a client mentions for the first time that her previous birth was traumatic  -  she describes feeling held down, not listened to, and 'like something happened to her.' She has never spoken to anyone about it. She tears up and then immediately changes the subject.",
    options:[
      { label:"A. Follow her lead  -  if she changed the subject, she's not ready to talk about it", outcome:"partial", feedback:"Respecting her redirect is appropriate  -  don't force continuation. But following her lead without any acknowledgment misses an opportunity. A brief, gentle acknowledgment before following her redirect communicates that you heard what she said and that the space is still there." },
      { label:"B. Acknowledge what she shared briefly and warmly, let her know you heard it, and leave the door open without pushing", outcome:"correct", feedback:"Correct. Something like: 'Before we move on  -  I just want to say that what you shared matters, and I'm glad you felt able to say it. We don't have to go further right now, but I want you to know I'm here if you ever want to.' Then follow her redirect. This plants a seed without coercion." },
      { label:"C. Explore the trauma in depth  -  she brought it up, which means she's ready to process it", outcome:"wrong", feedback:"Bringing something up is not the same as being ready to process it. Pushing someone into trauma narrative without clinical skill and their explicit consent can re-traumatize. Your role is to be a safe enough presence that she COULD go further  -  not to guide her there." },
      { label:"D. Refer her immediately to a trauma therapist and document the disclosure", outcome:"partial", feedback:"A referral is appropriate  -  birth trauma deserves professional support. But immediately transitioning to referral without any acknowledgment of what she shared can feel clinical and distancing. Acknowledge first, then offer the resource gently: 'There are people who specialize in exactly this, and I'd love to share a name with you when you feel ready.'" },
    ],
    debrief:"Birth trauma disclosure mid-conversation is one of the most delicate moments in doula work. The client is testing safety  -  seeing how you receive what they just said. A brief, warm acknowledgment followed by respecting their redirect is the correct response. The referral can follow in the same conversation or a later one." },
];

const quizzes = [
  { q:"A client during a postpartum visit shares that she's having intrusive thoughts about dropping the baby. Your best first response is:", options:["Tell her this means she needs to be supervised with the baby immediately","Thank her for trusting you, calmly normalize the experience, and offer a warm referral to a perinatal mental health provider","Ask her to describe the thoughts in detail so you can assess the level of risk","Reassure her it's just hormones and it will pass with more sleep"], correct:1, exp:"Intrusive thoughts are common, deeply distressing, and not predictive of harm. Your calm response preserves trust and reduces shame  -  which is the intervention. Clinical risk assessment is outside scope. Normalization without referral is incomplete. The correct response is calm acknowledgment, normalization, and an immediate warm referral to a perinatal specialist." },
  { q:"What distinguishes a doula-facilitated postpartum support circle from a therapy group?", options:["Doula circles are less regulated but cover the same clinical goals","Doula circles are peer support spaces centered on connection, shared experience, and reducing isolation  -  not clinical treatment","Doula circles are appropriate for any mental health concern as long as the facilitator has good listening skills","There is no meaningful difference  -  both provide emotional healing"], correct:1, exp:"The distinction is foundational. A doula-facilitated circle holds peer-to-peer connection, witnessed experience, and community support. A therapy group provides clinical assessment, structured treatment, and licensed guidance. Understanding this boundary protects both the facilitator and the participants  -  and prevents doulas from being positioned as a substitute for clinical care." },
  { q:"A client declines your referral to a perinatal therapist and says 'I don't need a therapist, I'm fine.' The correct response is:", options:["Document that she refused and stop raising the subject","Increase your own emotional support visits to compensate","Name what you've observed factually, reframe the referral without stigma, leave the resource, and honor her choice","Contact her family to express your concerns"], correct:2, exp:"Autonomy is paramount  -  you cannot and should not coerce a referral. But you can observe, reframe, and plant a seed. Many clients reach out to resources weeks after they were introduced. What you can always do: name what you observe (without diagnosis), remove the stigma of seeking help, and leave the door open. Increasing your own scope as a substitute for clinical care is not the answer." },
  { q:"The most important difference between reflective listening and giving advice is:", options:["Reflective listening requires clinical training; giving advice does not","Reflective listening communicates 'I hear you'; advice communicates 'I know what you need'","Giving advice is more helpful in a crisis situation","Reflective listening is passive  -  advice demonstrates genuine care"], correct:1, exp:"Reflective listening doesn't solve  -  it witnesses. Advice, even well-intentioned, communicates that the speaker's experience is a problem requiring a fix. In emotional distress, feeling heard is often more healing than receiving guidance. Reflective listening is an active skill, not passivity  -  it requires full presence and restraint of the impulse to fix." },
  { q:"During a support circle, a participant says 'I feel like my family would be better off without me.' Your immediate action should be:", options:["Let the group hold the weight of what she shared and continue the circle","Acknowledge the feeling and invite her to say more in the group setting","Pause the circle, tend to other group members, follow up privately with the individual, and connect her to crisis support","Ask her directly if she has a plan, document her answer, and resume the circle"], correct:2, exp:"'My family would be better off without me' is passive suicidal ideation and requires immediate response. The circle cannot continue as though this was said. Pause gracefully, tend to the group, and then stay with the individual privately. Connect her to 988 or PSI Warmline  -  do not leave her alone. Documentation and clinical risk assessment are outside your scope; crisis bridging is not." },
  { q:"Which of the following is an example of reflective listening rather than advice or interpretation?", options:["'You're probably feeling this way because you're sleep deprived  -  let's talk about sleep strategies'","'It sounds like you're carrying a lot right now and there isn't much space left for you'","'I know exactly how you feel  -  I went through something similar after my birth'","'Have you tried journaling? It really helps with processing difficult emotions'"], correct:1, exp:"Reflective listening reflects back the emotional content without adding interpretation, advice, or your own experience. 'It sounds like you're carrying a lot and there isn't much space for you' communicates: I heard you, I'm with you, I'm not going to fix you. All other options add something the client didn't say  -  whether diagnosis, advice, or the facilitator's own experience." },
];

const myths = [
  { m:"If a doula is good enough at emotional support, therapy may not be necessary", f:"Doula emotional support and clinical mental health care address different needs through different means. A doula's grounded presence reduces isolation and promotes wellbeing  -  but it cannot treat perinatal mood disorders, process trauma, or manage psychiatric conditions. Positioning doula support as a substitute for therapy delays needed care and places inappropriate burden on the doula.", id:"mh1" },
  { m:"Asking someone directly about suicidal thoughts will plant the idea or make things worse", f:"Research consistently shows that asking directly about suicide does not increase risk and often decreases it. People in crisis frequently feel relief when someone acknowledges the unspeakable. For doulas: you are not conducting a clinical assessment, but you can ask 'Are you having thoughts of hurting yourself?' calmly and compassionately, then bridge to 988 or PSI Warmline.", id:"mh2" },
  { m:"Intrusive thoughts about harming the baby mean a parent is dangerous", f:"Intrusive thoughts  -  unwanted, distressing thoughts about harm coming to the baby  -  affect the majority of new parents and are ego-dystonic (they horrify the person having them). This is a key clinical marker that differentiates normal postpartum cognition from genuine risk. Intrusive thoughts require support and referral, not alarm or surveillance.", id:"mh3" },
  { m:"Support circles should let any emotional topic run as long as needed  -  no time limits", f:"Facilitation structure actually creates safety, not constraint. Time limits, structured opening and closing rounds, and gentle facilitation moves help the circle feel contained and predictable  -  which allows people to go deeper. A circle with no structure often runs longer, exhausts participants, and ends without the grounded close that protects group members.", id:"mh4" },
  { m:"'I understand exactly how you feel' is a good way to validate a client", f:"'I understand exactly how you feel' centers the facilitator's experience and assumes similarity. Each person's experience is their own. More validating: 'What you're describing sounds really hard  -  I want to make sure I understand what this is like for you.' Curiosity validates better than assumed shared experience.", id:"mh5" },
  { m:"If a client is refusing professional help, there's nothing more you can do", f:"You can name what you observe without diagnosis, reframe professional support without stigma, leave the resource, and follow up. You cannot compel help  -  but you can plant seeds with care. Many clients access resources weeks or months after they were introduced, when they feel ready. The referral you make today may be the one they use in six weeks.", id:"mh6" },
];

const navItems = [
  { id:"scope",      label:"Scope & Foundation",       short:"Scope",      icon:"⚖️" },
  { id:"recognize",  label:"Recognizing Distress",      short:"Recognize",  icon:"👁️" },
  { id:"language",   label:"Supportive Language",       short:"Language",   icon:"💬" },
  { id:"listening",  label:"Reflective Listening",      short:"Listening",  icon:"👂" },
  { id:"referral",   label:"Warm Referral",             short:"Referral",   icon:"🔗" },
  { id:"circles",    label:"Support Circles",           short:"Circles",    icon:"🌸" },
  { id:"scenarios",  label:"Scenarios",                 short:"Scenarios",  icon:"🎭" },
  { id:"learn",      label:"Quiz & Myths",              short:"Learn",      icon:"📚" },
];

const sectionMeta = {
  scope:     { title:"Scope of Practice  -  The Foundation",              sub:"What doulas do and do not do in the emotional support space  -  non-negotiable clarity before everything else" },
  recognize: { title:"Recognizing Emotional Distress",                  sub:"Signs to watch for, signs to act on, and signs that require immediate crisis response" },
  language:  { title:"Supportive Language  -  What to Say & What to Avoid", sub:"Eight common client moments with exact language for each  -  and the reasoning behind it" },
  listening: { title:"Reflective Listening  -  The Core Skill",           sub:"Six reflective listening skills with examples, non-examples, and common pitfalls" },
  referral:  { title:"Warm Referral  -  The Art of Bridging",             sub:"A five-step framework for connecting clients to professional support with dignity" },
  circles:   { title:"Postpartum Support Circles  -  Facilitation Guide", sub:"Ground rules, opening prompts, facilitation moves, and session structure" },
  scenarios: { title:"Scenarios  -  Decision Points in Practice",         sub:"Five real-world situations with interactive decision trees and detailed debriefs" },
  learn:     { title:"Knowledge Checks & Myth Busting",                 sub:"Test your understanding and clear the most dangerous misconceptions" },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScopeBox({ text }) {
  return (
    <div style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)",
      borderRadius:10, padding:"9px 13px", marginTop:14, display:"flex", gap:9, alignItems:"flex-start" }}>
      <span style={{ fontSize:13, flexShrink:0 }}>⚖️</span>
      <span style={{ fontSize:12, color:C.gold, lineHeight:1.55, fontFamily:"'DM Mono',monospace" }}>{text}</span>
    </div>
  );
}

function ScopeSection() {
  return (
    <div>
      <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)",
        borderRadius:14, padding:20, marginBottom:22 }}>
        <div style={{ fontSize:13, color:C.red, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.08em", marginBottom:10 }}>⚖️ NON-NEGOTIABLE BOUNDARY  -  READ BEFORE CONTINUING</div>
        <p style={{ fontSize:14, color:"rgba(241,245,249,0.88)", lineHeight:1.75, margin:0 }}>
          This guide gives doulas practical tools for <strong style={{ color:C.text }}>emotional recognition,
          supportive presence, warm referral, and peer support circle facilitation</strong>  -  not clinical mental
          health treatment. Doulas are not therapists. The content here does not qualify you to diagnose, treat,
          or clinically assess any mental health condition. What it does is give you the language, frameworks,
          and referral pathways to support your clients through difficult emotional moments  -  and to know when
          and how to bridge them to licensed professional care.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {SCOPE_PRINCIPLES.map((group,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${group.color}25`,
            borderRadius:16, padding:20 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:22 }}>{group.icon}</span>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:800,
                color:group.color }}>{group.label}</div>
            </div>
            {group.items.map((item,j) => (
              <div key={j} style={{ display:"flex", gap:9, marginBottom:8 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:group.color,
                  flexShrink:0, marginTop:5 }}/>
                <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background:`${C.purple}09`, border:`1px solid ${C.purple}25`,
        borderRadius:14, padding:18, marginTop:18 }}>
        <div style={{ fontSize:12, color:C.purple, fontFamily:"'DM Mono',monospace", marginBottom:10 }}>
          🌸 THE DOULA VALUE PROPOSITION IN MENTAL HEALTH SUPPORT
        </div>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, margin:0 }}>
          The doula's unique power in the emotional health space is not clinical expertise  -  it is
          <strong style={{ color:C.text }}> consistent, trusted, non-clinical presence</strong>. You are
          the person who shows up at the house when the therapist is unavailable. You are the one
          who notices the shift across three visits that no one else has seen. You are the one who
          can bridge a client to professional support before a crisis becomes an emergency. That
          role is irreplaceable  -  and it is entirely within scope.
        </p>
      </div>
    </div>
  );
}

function RecognizeSection() {
  const [active, setActive] = useState(null);
  const [signOpen, setSignOpen] = useState({});
  const cat = EMOTIONAL_SIGNS.find(c => c.category === active);

  return (
    <div>
      <div style={{ background:"rgba(148,163,184,0.06)", border:`1px solid ${C.border}`,
        borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>
          Recognition is not diagnosis. Your role is to observe, note patterns, and respond  -  not to
          assess or label. These signs are organized by what action they call for, not by severity of condition.
        </p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        {EMOTIONAL_SIGNS.map(c => (
          <button key={c.category} onClick={() => setActive(active===c.category?null:c.category)}
            style={{ flex:"1 1 200px", background:active===c.category?`${c.color}18`:C.card,
              border:`1px solid ${active===c.category?c.color:C.border}`,
              borderRadius:14, padding:"14px 13px", cursor:"pointer",
              textAlign:"left", transition:"all 0.25s" }}>
            <div style={{ background:`${c.color}18`, border:`1px solid ${c.color}28`,
              borderRadius:20, padding:"3px 10px", display:"inline-block", marginBottom:8 }}>
              <span style={{ fontSize:10, color:c.color, fontFamily:"'DM Mono',monospace" }}>
                {c.urgency === "high" ? "⚡ ESCALATE NOW" : c.urgency === "medium" ? "⏰ REFER PROMPTLY" : "👁️ WATCH & MONITOR"}
              </span>
            </div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:800,
              color:active===c.category?c.color:C.text }}>{c.category}</div>
          </button>
        ))}
      </div>
      {cat && (
        <div style={{ background:`linear-gradient(135deg,${cat.color}0d,rgba(8,13,26,0.5))`,
          border:`1px solid ${cat.color}28`, borderRadius:18, padding:22 }}>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:18 }}>{cat.desc}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {cat.signs.map((s,i) => {
              const key = `${cat.category}-${i}`;
              const open = !!signOpen[key];
              return (
                <div key={i} onClick={() => setSignOpen(p => ({...p,[key]:!open}))}
                  style={{ background:open?`${cat.color}10`:C.card,
                    border:`1px solid ${open?cat.color:C.border}`,
                    borderRadius:12, padding:"13px 16px", cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                      color:open?cat.color:C.text }}>{s.sign}</div>
                    <span style={{ fontSize:10.5, color:C.faint, fontFamily:"'DM Mono',monospace",
                      flexShrink:0, marginLeft:10 }}>{open?"▲":"▼"}</span>
                  </div>
                  {open && (
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.65,
                      margin:"10px 0 0" }}>{s.what}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!active && <div style={{ textAlign:"center", fontSize:12, color:C.faint,
        fontFamily:"'DM Mono',monospace", padding:"18px 0" }}>
        ↑ Click a category to explore signs and what they call for
      </div>}
      <ScopeBox text="You are observing patterns across visits  -  not diagnosing. 'I've noticed over a few visits that...' is always within scope. 'I think you have postpartum depression' is not." />
    </div>
  );
}

function LanguageSection() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {LANGUAGE_GUIDE.map((item,i) => {
          const open = active === i;
          return (
            <div key={i} onClick={() => setActive(open?null:i)}
              style={{ background:open?`${C.purple}0d`:C.card,
                border:`1px solid ${open?C.purple:C.border}`,
                borderRadius:14, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                  color:open?C.purple:C.text, lineHeight:1.3, flex:1 }}>{item.situation}</div>
                <span style={{ fontSize:10.5, color:C.faint, fontFamily:"'DM Mono',monospace",
                  flexShrink:0, marginLeft:10 }}>{open?"▲":"▼"}</span>
              </div>
              {open && (
                <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ background:"rgba(248,113,113,0.09)", border:"1px solid rgba(248,113,113,0.22)",
                    borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:10, color:C.red, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                      🚫 AVOID
                    </div>
                    <p style={{ fontSize:13, color:"rgba(241,245,249,0.75)", lineHeight:1.65,
                      margin:0, fontStyle:"italic" }}>"{item.avoid}"</p>
                  </div>
                  <div style={{ background:`${C.green}0d`, border:`1px solid ${C.green}25`,
                    borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:10, color:C.green, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                      ✓ USE INSTEAD
                    </div>
                    <p style={{ fontSize:13.5, color:"rgba(241,245,249,0.88)", lineHeight:1.7,
                      margin:0, fontStyle:"italic" }}>"{item.use}"</p>
                  </div>
                  <div style={{ background:`${C.purple}0a`, border:`1px solid ${C.purple}20`,
                    borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:10, color:C.purple, fontFamily:"'DM Mono',monospace", marginBottom:5 }}>
                      💡 WHY
                    </div>
                    <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{item.why}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListeningSection() {
  const [active, setActive] = useState(null);
  const skill = REFLECTIVE_LISTENING.skills.find(s => s.skill === active);

  return (
    <div>
      <div style={{ background:`${C.teal}08`, border:`1px solid ${C.teal}20`,
        borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
        <p style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.65, margin:0 }}>
          {REFLECTIVE_LISTENING.overview}
        </p>
      </div>
      <div style={{ display:"flex", gap:9, flexWrap:"wrap", marginBottom:18 }}>
        {REFLECTIVE_LISTENING.skills.map(s => (
          <button key={s.skill} onClick={() => setActive(active===s.skill?null:s.skill)}
            style={{ flex:"1 1 155px", background:active===s.skill?`${s.color}18`:C.card,
              border:`1px solid ${active===s.skill?s.color:C.border}`,
              borderRadius:13, padding:"13px 12px", cursor:"pointer",
              textAlign:"left", transition:"all 0.25s" }}>
            <div style={{ fontSize:20, marginBottom:5 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700,
              color:active===s.skill?s.color:C.text, lineHeight:1.3 }}>{s.skill}</div>
          </button>
        ))}
      </div>
      {skill && (
        <div style={{ background:`linear-gradient(135deg,${skill.color}0d,rgba(8,13,26,0.5))`,
          border:`1px solid ${skill.color}28`, borderRadius:18, padding:22 }}>
          <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, marginBottom:18 }}>{skill.desc}</p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <div style={{ flex:"1 1 230px" }}>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
                  letterSpacing:"0.15em", marginBottom:6 }}>CLIENT SAYS</div>
                <div style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`,
                  borderRadius:10, padding:13 }}>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0,
                    fontStyle:"italic" }}>"{skill.example_in}"</p>
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, color:skill.color, fontFamily:"'DM Mono',monospace",
                  letterSpacing:"0.15em", marginBottom:6 }}>YOU REFLECT</div>
                <div style={{ background:`${skill.color}0e`, border:`1px solid ${skill.color}28`,
                  borderRadius:10, padding:13 }}>
                  <p style={{ fontSize:13.5, color:"rgba(241,245,249,0.88)", lineHeight:1.7,
                    margin:0, fontStyle:"italic" }}>"{skill.example_out}"</p>
                </div>
              </div>
            </div>
            <div style={{ flex:"1 1 190px" }}>
              <div style={{ background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)",
                borderRadius:14, padding:16 }}>
                <div style={{ fontSize:10, color:C.red, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
                  ⚠️ COMMON PITFALL
                </div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>{skill.pitfall}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {!active && <div style={{ textAlign:"center", fontSize:12, color:C.faint,
        fontFamily:"'DM Mono',monospace", padding:"18px 0" }}>
        ↑ Select a skill to see examples, reflections, and pitfalls
      </div>}
      <ScopeBox text="Reflective listening does not require clinical training  -  it requires restraint. The hardest part is not filling silence, not offering solutions, and not sharing your own experience. Practice it before you need it." />
    </div>
  );
}

function ReferralSection() {
  const [step, setStep] = useState(0);
  const s = WARM_REFERRAL.steps[step];

  return (
    <div>
      <div style={{ background:`${C.pink}08`, border:`1px solid ${C.pink}20`,
        borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
        <p style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.65, margin:0 }}>
          {WARM_REFERRAL.overview}
        </p>
      </div>

      {/* Step nav */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {WARM_REFERRAL.steps.map((st,i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ flex:"1 1 130px", background:step===i?`${st.color}18`:C.card,
              border:`1px solid ${step===i?st.color:C.border}`,
              borderRadius:12, padding:"11px 11px", cursor:"pointer",
              textAlign:"left", transition:"all 0.25s" }}>
            <div style={{ fontSize:10, color:step===i?st.color:C.faint,
              fontFamily:"'DM Mono',monospace", marginBottom:3 }}>STEP {st.step}</div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700,
              color:step===i?st.color:C.text, lineHeight:1.3 }}>{st.title}</div>
          </button>
        ))}
      </div>

      <div style={{ background:`linear-gradient(135deg,${s.color}0d,rgba(8,13,26,0.5))`,
        border:`1px solid ${s.color}28`, borderRadius:18, padding:22, marginBottom:24 }}>
        <div style={{ fontSize:10, color:s.color, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.1em", marginBottom:10 }}>STEP {s.step}  -  {s.title.toUpperCase()}</div>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, marginBottom:16 }}>{s.desc}</p>
        <div style={{ background:`${s.color}0d`, border:`1px solid ${s.color}25`,
          borderRadius:12, padding:16 }}>
          <div style={{ fontSize:10, color:s.color, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
            💬 SAMPLE LANGUAGE
          </div>
          <p style={{ fontSize:13.5, color:"rgba(241,245,249,0.88)", lineHeight:1.75,
            margin:0, fontStyle:"italic" }}>"{s.language}"</p>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:16,
          paddingTop:14, borderTop:`1px solid ${s.color}20` }}>
          <button onClick={() => setStep(s => Math.max(0,s-1))}
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
              borderRadius:8, padding:"6px 14px", color:step===0?C.faint:C.muted,
              fontSize:11, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>← Previous</button>
          <span style={{ fontSize:10.5, color:C.faint, fontFamily:"'DM Mono',monospace",
            alignSelf:"center" }}>Step {step+1} of {WARM_REFERRAL.steps.length}</span>
          <button onClick={() => setStep(s => Math.min(WARM_REFERRAL.steps.length-1,s+1))}
            style={{ background:`${C.pink}18`, border:`1px solid ${C.pink}40`,
              borderRadius:8, padding:"6px 14px",
              color:step===WARM_REFERRAL.steps.length-1?C.faint:C.pink,
              fontSize:11, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>Next →</button>
        </div>
      </div>

      {/* Resources */}
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:12 }}>REFERRAL RESOURCES  -  KNOW THESE BY HEART</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
        {WARM_REFERRAL.resources.map((r,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${r.color}25`,
            borderRadius:12, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                color:r.color, lineHeight:1.3 }}>{r.name}</div>
              {r.urgent && <span style={{ background:"rgba(248,113,113,0.12)",
                border:"1px solid rgba(248,113,113,0.25)", borderRadius:20,
                padding:"2px 8px", fontSize:9.5, color:C.red,
                fontFamily:"'DM Mono',monospace", flexShrink:0, marginLeft:8 }}>⚡ Crisis</span>}
            </div>
            <a href={r.contact.startsWith("1-") || r.contact === "988"
                ? `tel:${r.contact.replace(/\D/g,"")}`
                : `https://${r.contact}`}
              target={r.contact.includes(".")?"_blank":undefined}
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:700,
                color:r.color, textDecoration:"none",
                borderBottom:`1px solid ${r.color}40`, display:"inline-block",
                marginBottom:8 }}>
              {r.contact.startsWith("1-") || r.contact === "988" ? "📞 " : "🌐 "}{r.contact}
            </a>
            <p style={{ fontSize:11.5, color:C.faint, lineHeight:1.5, margin:0 }}>{r.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CirclesSection() {
  const [view, setView] = useState("groundrules");

  return (
    <div>
      <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}20`,
        borderRadius:12, padding:"12px 16px", marginBottom:18 }}>
        <p style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.65, margin:0 }}>
          {SUPPORT_CIRCLES.overview}
        </p>
      </div>

      {/* Scope distinction */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
        gap:12, marginBottom:22 }}>
        {SUPPORT_CIRCLES.doula_vs_therapy.map((role,i) => (
          <div key={i} style={{ background:C.card,
            border:`1px solid ${i===0?C.green:C.faint}25`,
            borderRadius:14, padding:18 }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700,
              color:i===0?C.green:C.muted, marginBottom:12 }}>{role.role}</div>
            {role.items.map((item,j) => (
              <div key={j} style={{ display:"flex", gap:8, marginBottom:7 }}>
                <div style={{ width:5, height:5, borderRadius:"50%",
                  background:i===0?C.green:C.faint, flexShrink:0, marginTop:5 }}/>
                <span style={{ fontSize:12, color:i===0?C.muted:C.faint,
                  lineHeight:1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:18 }}>
        {[{v:"groundrules",l:"🛡️ Ground Rules"},{v:"prompts",l:"💬 Opening Prompts"},
          {v:"moves",l:"🎭 Facilitation Moves"},{v:"structure",l:"⏱️ Session Structure"}].map(o => (
          <button key={o.v} onClick={() => setView(o.v)}
            style={{ background:view===o.v?`${C.green}22`:"rgba(255,255,255,0.04)",
              border:`1px solid ${view===o.v?C.green:C.border}`,
              borderRadius:20, padding:"5px 14px", fontSize:12,
              fontFamily:"'DM Mono',monospace",
              color:view===o.v?C.green:C.muted, cursor:"pointer" }}>{o.l}</button>
        ))}
      </div>

      {view === "groundrules" && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {SUPPORT_CIRCLES.groundrules.map((r,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.green}18`,
              borderRadius:12, padding:"13px 16px", display:"flex", gap:14 }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{r.icon}</span>
              <div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                  color:C.green, marginBottom:4 }}>{r.rule}</div>
                <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "prompts" && (
        <div>
          <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14 }}>
            Opening prompts invite the circle to arrive. Choose one  -  not all of them. The power is in
            giving everyone the same simple question to answer in their own way.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {SUPPORT_CIRCLES.opening_prompts.map((p,i) => (
              <div key={i} style={{ background:`${C.green}09`, border:`1px solid ${C.green}22`,
                borderRadius:12, padding:"13px 16px", display:"flex", gap:12 }}>
                <div style={{ width:24, height:24, borderRadius:"50%",
                  background:`${C.green}20`, border:`1px solid ${C.green}35`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, color:C.green, fontFamily:"'DM Mono',monospace",
                  fontWeight:700, flexShrink:0 }}>{i+1}</div>
                <p style={{ fontSize:13.5, color:"rgba(241,245,249,0.88)", lineHeight:1.65,
                  margin:0, fontStyle:"italic" }}>"{p}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "moves" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {SUPPORT_CIRCLES.facilitation_moves.map((m,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${m.color}20`,
              borderRadius:14, padding:18 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:22 }}>{m.icon}</span>
                <div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700,
                    color:m.color, marginBottom:2 }}>{m.move}</div>
                  <div style={{ fontSize:11, color:C.faint,
                    fontFamily:"'DM Mono',monospace" }}>USE WHEN: {m.when}</div>
                </div>
              </div>
              <div style={{ background:`${m.color}0d`, border:`1px solid ${m.color}22`,
                borderRadius:10, padding:13 }}>
                <div style={{ fontSize:10, color:m.color, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                  💬 SAY
                </div>
                <p style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.7,
                  margin:0, fontStyle:"italic" }}>{m.say}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "structure" && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {SUPPORT_CIRCLES.session_structure.map((s,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.green}18`,
              borderRadius:12, padding:"14px 16px", display:"flex", gap:14, flexWrap:"wrap" }}>
              <div style={{ background:`${C.green}18`, border:`1px solid ${C.green}30`,
                borderRadius:8, padding:"6px 12px", flexShrink:0, alignSelf:"flex-start" }}>
                <div style={{ fontSize:11, color:C.green,
                  fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{s.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700,
                  color:C.green, marginBottom:4 }}>{s.phase}</div>
                <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{s.detail}</p>
              </div>
            </div>
          ))}
          <ScopeBox text="If a circle member discloses something that suggests crisis or requires professional support, do not address it in the group. Wait for the session to close, then follow up privately. The circle is not a crisis intervention space." />
        </div>
      )}
    </div>
  );
}

function ScenariosSection() {
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState({});
  const scenario = SCENARIOS.find(s => s.id === active);

  const outcomeColor = { correct:C.green, partial:C.gold, wrong:C.red };

  return (
    <div>
      <div style={{ background:"rgba(148,163,184,0.06)", border:`1px solid ${C.border}`,
        borderRadius:12, padding:"12px 16px", marginBottom:18 }}>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>
          Interactive scenarios with realistic decision points. Select your response to see the outcome and
          a full debrief. There may be more than one reasonable answer  -  the feedback explains the nuance.
        </p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => { setActive(active===s.id?null:s.id); }}
            style={{ flex:"1 1 200px", background:active===s.id?`${s.color}18`:C.card,
              border:`1px solid ${active===s.id?s.color:C.border}`,
              borderRadius:14, padding:"14px 12px", cursor:"pointer",
              textAlign:"left", transition:"all 0.25s" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ background:`${s.color}18`, border:`1px solid ${s.color}28`,
                borderRadius:20, padding:"2px 8px", fontSize:9.5,
                color:s.color, fontFamily:"'DM Mono',monospace" }}>{s.difficulty}</span>
            </div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700,
              color:active===s.id?s.color:C.text, lineHeight:1.3 }}>{s.title}</div>
          </button>
        ))}
      </div>

      {scenario && (
        <div style={{ background:`linear-gradient(135deg,${scenario.color}0d,rgba(8,13,26,0.5))`,
          border:`1px solid ${scenario.color}28`, borderRadius:18, padding:22 }}>
          <div style={{ background:`${scenario.color}10`, border:`1px solid ${scenario.color}22`,
            borderRadius:12, padding:16, marginBottom:18 }}>
            <div style={{ fontSize:10, color:scenario.color, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
              📋 SCENARIO
            </div>
            <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, margin:0 }}>{scenario.setup}</p>
          </div>
          <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.15em", marginBottom:12 }}>SELECT YOUR RESPONSE:</div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {scenario.options.map((opt,i) => {
              const sel = selected[scenario.id];
              const revealed = sel !== undefined;
              let bg = C.card, bdr = C.border, clr = C.muted;
              if (revealed) {
                const c = outcomeColor[opt.outcome];
                bg = `${c}10`; bdr = `${c}30`; clr = c;
              }
              if (revealed && sel === i) {
                bg = `${outcomeColor[opt.outcome]}18`;
                bdr = outcomeColor[opt.outcome];
              }
              return (
                <div key={i}>
                  <button onClick={() => !revealed && setSelected(p=>({...p,[scenario.id]:i}))}
                    style={{ width:"100%", background:bg, border:`1px solid ${bdr}`,
                      borderRadius:11, padding:"12px 15px", textAlign:"left",
                      cursor:revealed?"default":"pointer",
                      color:clr, fontSize:13, fontFamily:"'DM Mono',monospace",
                      transition:"all 0.2s", lineHeight:1.5 }}>
                    <span style={{ opacity:0.55 }}>{String.fromCharCode(65+i)}. </span>{opt.label}
                  </button>
                  {revealed && (
                    <div style={{ background:`${outcomeColor[opt.outcome]}0d`,
                      border:`1px solid ${outcomeColor[opt.outcome]}25`,
                      borderRadius:"0 0 11px 11px", padding:"10px 15px",
                      marginTop:-1 }}>
                      <div style={{ fontSize:10, color:outcomeColor[opt.outcome],
                        fontFamily:"'DM Mono',monospace", marginBottom:4 }}>
                        {opt.outcome==="correct"?"✓ CORRECT":opt.outcome==="partial"?"◐ PARTIAL":"✗ INCORRECT"}
                      </div>
                      <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.65, margin:0 }}>{opt.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selected[scenario.id] !== undefined && (
            <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
              borderRadius:14, padding:18, marginTop:18 }}>
              <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>
                📖 FULL DEBRIEF
              </div>
              <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.72, margin:0 }}>{scenario.debrief}</p>
            </div>
          )}
        </div>
      )}
      {!active && <div style={{ textAlign:"center", fontSize:12, color:C.faint,
        fontFamily:"'DM Mono',monospace", padding:"18px 0" }}>
        ↑ Select a scenario to work through the decision points
      </div>}
    </div>
  );
}

function LearnSection() {
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [mythOpen, setMythOpen] = useState({});
  const q = quizzes[qIdx];
  const answer = i => { if (sel !== null) return; setSel(i); if (i === q.correct) setScore(s=>s+1); };
  const next = () => { if (qIdx < quizzes.length-1) { setQIdx(q=>q+1); setSel(null); } else setDone(true); };
  const reset = () => { setQIdx(0); setSel(null); setScore(0); setDone(false); };

  return (
    <div>
      <div style={{ marginBottom:36 }}>
        <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.18em", marginBottom:14 }}>
          KNOWLEDGE CHECK {done?` -  ${score}/${quizzes.length} CORRECT`:` -  QUESTION ${qIdx+1} OF ${quizzes.length}`}
        </div>
        {!done ? (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
            <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, color:C.text,
              lineHeight:1.55, marginBottom:18 }}>{q.q}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:sel!==null?16:0 }}>
              {q.options.map((opt,i) => {
                let bg=C.card, bdr=C.border, clr=C.muted;
                if (sel !== null) {
                  if (i===q.correct) { bg="rgba(52,211,153,0.15)"; bdr=C.green; clr=C.green; }
                  else if (i===sel) { bg="rgba(248,113,113,0.15)"; bdr=C.red; clr=C.red; }
                }
                return (
                  <button key={i} onClick={() => answer(i)} style={{
                    background:bg, border:`1px solid ${bdr}`, borderRadius:10,
                    padding:"10px 14px", textAlign:"left",
                    cursor:sel!==null?"default":"pointer",
                    color:clr, fontSize:13, fontFamily:"'DM Mono',monospace", transition:"all 0.2s" }}>
                    <span style={{ opacity:0.5 }}>{String.fromCharCode(65+i)}. </span>{opt}
                  </button>
                );
              })}
            </div>
            {sel !== null && (
              <>
                <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                  borderRadius:10, padding:14, marginTop:14, marginBottom:14 }}>
                  <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>EXPLANATION</div>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>{q.exp}</p>
                </div>
                <button onClick={next} style={{ background:`${C.pink}20`, border:`1px solid ${C.pink}`,
                  borderRadius:10, padding:"8px 20px", color:C.pink,
                  fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                  {qIdx < quizzes.length-1 ? "Next Question →" : "See Results →"}
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:16, padding:28, textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>
              {score===quizzes.length?"🌸":score>=4?"💜":"🌱"}
            </div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:30,
              color:C.text, marginBottom:8 }}>{score}/{quizzes.length} Correct</div>
            <p style={{ color:C.muted, fontSize:14, marginBottom:20, maxWidth:420, margin:"0 auto 20px" }}>
              {score===quizzes.length?"Excellent scope awareness and supportive practice knowledge.":
               score>=4?"Strong foundation  -  review sections where you felt uncertain.":
               "Great start  -  the Scope, Scenarios, and Referral sections will build your confidence."}
            </p>
            <button onClick={reset} style={{ background:`${C.pink}20`, border:`1px solid ${C.pink}`,
              borderRadius:10, padding:"8px 20px", color:C.pink,
              fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>Retry Quiz</button>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.18em", marginBottom:14 }}>MYTH vs FACT  -  MENTAL HEALTH SUPPORT EDITION</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {myths.map(mt => {
            const open = !!mythOpen[mt.id];
            return (
              <div key={mt.id} onClick={() => setMythOpen(p=>({...p,[mt.id]:!open}))}
                style={{ background:open?"rgba(148,163,184,0.06)":"rgba(148,163,184,0.03)",
                  border:`1px solid ${open?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.07)"}`,
                  borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:12, color:C.red, fontFamily:"'DM Mono',monospace",
                    flexShrink:0, marginTop:1 }}>{open?"✗":"?"} MYTH:</span>
                  <span style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>{mt.m}</span>
                </div>
                {open && (
                  <div style={{ marginTop:10, paddingTop:10,
                    borderTop:"1px solid rgba(148,163,184,0.1)",
                    display:"flex", gap:12, alignItems:"flex-start" }}>
                    <span style={{ fontSize:12, color:C.green, fontFamily:"'DM Mono',monospace",
                      flexShrink:0, marginTop:1 }}>✓ FACT:</span>
                    <span style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.6 }}>{mt.f}</span>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MentalHealthGuide() {
  const [section, setSection] = useState("scope");
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);

  const meta = sectionMeta[section] || { title:"", sub:"" };
  const idx = navItems.findIndex(n => n.id === section);
  const prev = navItems[idx-1], next = navItems[idx+1];

  const kpis = [
    { icon:"⚖️", value:"Clear", label:"SCOPE BOUNDARIES  -  READ FIRST",           color:C.gold   },
    { icon:"💬", value:"8",     label:"LANGUAGE SCENARIOS WITH EXACT WORDING",   color:C.purple },
    { icon:"🔗", value:"5",     label:"STEP WARM REFERRAL FRAMEWORK",            color:C.pink   },
    { icon:"🌸", value:"6",     label:"SUPPORT CIRCLE FACILITATION MOVES",       color:C.green  },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg,
      fontFamily:"'DM Sans',sans-serif", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        button{outline:none;} *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(232,121,249,0.2);border-radius:2px;}
      `}</style>

      {/* Header */}
      <div style={{ background:"rgba(8,13,26,0.95)", backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`, padding:"20px 24px 0",
        position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1040, margin:"0 auto" }}>
          <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(-10px)",
            transition:"all 0.5s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-end", flexWrap:"wrap", gap:8, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:9.5, letterSpacing:"0.28em",
                  color:"rgba(148,163,184,0.38)", fontFamily:"'DM Mono',monospace",
                  textTransform:"uppercase", marginBottom:4 }}>
                  Interactive Learning Guide · Birth Worker Series
                </div>
                <h1 style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(20px,3.4vw,32px)", margin:0, lineHeight:1.1, fontWeight:800,
                  background:`linear-gradient(135deg,${C.text},${C.purple},${C.pink},${C.green})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Mental Health Facilitation, Warm Referral & Support Circles
                  <span style={{ fontWeight:400, fontSize:"0.6em",
                    WebkitTextFillColor:C.muted }}>  -  Supporting Safely Within Scope</span>
                </h1>
              </div>
              <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)",
                borderRadius:8, padding:"6px 12px", fontSize:10.5,
                color:C.red, fontFamily:"'DM Mono',monospace" }}>
                ⚖️ Scope boundaries are non-negotiable
              </div>
            </div>
            <div style={{ display:"flex", gap:0, overflowX:"auto", marginLeft:-4 }}>
              {navItems.map(nav => (
                <button key={nav.id} onClick={() => setSection(nav.id)} style={{
                  background:"transparent", border:"none",
                  borderBottom:`2px solid ${section===nav.id?C.pink:"transparent"}`,
                  padding:"8px 12px", cursor:"pointer", transition:"all 0.2s",
                  whiteSpace:"nowrap",
                  color:section===nav.id?C.pink:"rgba(148,163,184,0.45)",
                  fontSize:11.5, fontFamily:"'DM Mono',monospace" }}>
                  {nav.icon} {nav.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:1040, margin:"0 auto", padding:"28px 20px 70px" }}>
        <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(16px)",
          transition:"all 0.5s ease 0.08s" }}>

          {/* KPIs */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
            {kpis.map((k,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:14, padding:"16px 18px", flex:"1 1 160px" }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{k.icon}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(20px,3.2vw,30px)", fontWeight:800,
                  color:k.color, lineHeight:1 }}>{k.value}</div>
                <div style={{ fontSize:10.5, color:C.muted, fontFamily:"'DM Mono',monospace",
                  marginTop:6, letterSpacing:"0.05em" }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(20px,3vw,28px)", margin:"0 0 4px", fontWeight:700 }}>{meta.title}</h2>
            <p style={{ color:C.faint, fontSize:12.5, margin:0,
              fontFamily:"'DM Mono',monospace" }}>{meta.sub}</p>
          </div>

          <div style={{ background:`${C.pink}03`, border:`1px solid ${C.border}`,
            borderRadius:22, padding:"24px 22px" }}>
            {section==="scope"     && <ScopeSection/>}
            {section==="recognize" && <RecognizeSection/>}
            {section==="language"  && <LanguageSection/>}
            {section==="listening" && <ListeningSection/>}
            {section==="referral"  && <ReferralSection/>}
            {section==="circles"   && <CirclesSection/>}
            {section==="scenarios" && <ScenariosSection/>}
            {section==="learn"     && <LearnSection/>}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:24, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
            {prev ? (
              <button onClick={() => setSection(prev.id)} style={{
                background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                borderRadius:10, padding:"8px 18px", color:C.muted,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                ← {prev.short}
              </button>
            ) : <div/>}
            {next ? (
              <button onClick={() => setSection(next.id)} style={{
                background:`${C.pink}18`, border:`1px solid ${C.pink}40`,
                borderRadius:10, padding:"8px 18px", color:C.pink,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {next.short} →
              </button>
            ) : <div/>}
          </div>

          <div style={{ textAlign:"center", fontSize:10.5,
            color:"rgba(148,163,184,0.2)", fontFamily:"'DM Mono',monospace",
            marginTop:24, lineHeight:1.7 }}>
            Educational resource for doulas and birth workers. This guide supports emotional awareness, supportive presence, and warm referral  -  not clinical mental health assessment or treatment.<br/>
            In a crisis: call 988 (Suicide & Crisis Lifeline) or 1-800-944-4773 (PSI Warmline) · Emergency: 911
          </div>
        </div>
      </div>
    </div>
  );
}
