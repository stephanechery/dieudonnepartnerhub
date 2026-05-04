import { useState, useEffect } from "react";

const C = {
  bg:"#080d1a", card:"#0f1628", border:"rgba(148,163,184,0.1)",
  borderHov:"rgba(148,163,184,0.22)", pink:"#e879f9", teal:"#22d3ee",
  purple:"#a78bfa", gold:"#fbbf24", green:"#34d399", red:"#f87171",
  orange:"#fb923c", blue:"#60a5fa", text:"#f1f5f9",
  muted:"#e2e8f0", faint:"rgba(226,232,240,0.65)",
};

const LANGS = [
  { code:"en", label:"English",        flag:"🇺🇸", short:"EN" },
  { code:"es", label:"Español",        flag:"🇪🇸", short:"ES" },
  { code:"ht", label:"Kreyol Ayisyen", flag:"🇭🇹", short:"HT" },
  { code:"fr", label:"Français",       flag:"🇫🇷", short:"FR" },
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const T = {

  // ── UI STRINGS ──
  ui: {
    en: { title:"Childbirth Education Guide", subtitle:"For Doulas and Families", facilitator:"Facilitator Guide", scope_label:"Scope Reminder", discussion:"Discussion Prompt", provider_q:"Questions for Your Provider", vocab:"Key Vocabulary", quiz_title:"Knowledge Check", myth_title:"Myth vs Fact", correct:"Correct", incorrect:"Incorrect", explanation:"Explanation", next_q:"Next Question", see_results:"See Results", retry:"Retry", score_msg_perfect:"Excellent preparation!", score_msg_good:"Strong foundation. Review any uncertain sections.", score_msg_ok:"Great start. Work through each section together.", session_note:"This education is preparation, not medical advice. Always direct clinical questions to your care provider.", group_prompt:"Group Discussion:", key_word:"Key Term" },
    es: { title:"Guía de Educación para el Parto", subtitle:"Para Doulas y Familias", facilitator:"Guía para el Facilitador", scope_label:"Nota de Alcance", discussion:"Pregunta para el Grupo", provider_q:"Preguntas para su Proveedor", vocab:"Vocabulario Clave", quiz_title:"Evaluación de Conocimiento", myth_title:"Mito vs Realidad", correct:"Correcto", incorrect:"Incorrecto", explanation:"Explicación", next_q:"Siguiente Pregunta", see_results:"Ver Resultados", retry:"Repetir", score_msg_perfect:"¡Excelente preparación!", score_msg_good:"Base sólida. Revise las secciones inciertas.", score_msg_ok:"Buen comienzo. Trabajen juntos cada sección.", session_note:"Esta educación es preparación, no consejo médico. Siempre dirija preguntas clínicas a su proveedor de atención.", group_prompt:"Discusión en Grupo:", key_word:"Término Clave" },
    ht: { title:"Gid Edikasyon pou Akouchman", subtitle:"Pou Doulas ak Fanmi", facilitator:"Gid pou Fasitatè", scope_label:"Nòt Limit Wòl", discussion:"Kesyon pou Gwoup la", provider_q:"Kesyon pou Pwofesyonèl Swen Ou", vocab:"Mo Kle", quiz_title:"Tcheke Konesans", myth_title:"Mit kont Reyalite", correct:"Kòrèk", incorrect:"Pa Kòrèk", explanation:"Eksplikasyon", next_q:"Pwochen Kesyon", see_results:"Wè Rezilta", retry:"Rekòmanse", score_msg_perfect:"Ekselan! Ou prepare byen.", score_msg_good:"Bon baz. Revize seksyon ou pa t sèten yo.", score_msg_ok:"Bon kòmansman. Travay chak seksyon ansanm.", session_note:"Edikasyon sa a se pou prepare ou - se pa konsèy medikal. Toujou poze doktè ou oswa fanmsaj ou kesyon klinik.", group_prompt:"Diskisyon Gwoup:", key_word:"Mo Enpòtan" },
    fr: { title:"Guide d'Éducation à l'Accouchement", subtitle:"Pour les Doulas et les Familles", facilitator:"Guide du Facilitateur", scope_label:"Note de Portée", discussion:"Question de Groupe", provider_q:"Questions pour votre Prestataire", vocab:"Vocabulaire Clé", quiz_title:"Vérification des Connaissances", myth_title:"Mythe vs Réalité", correct:"Correct", incorrect:"Incorrect", explanation:"Explication", next_q:"Question Suivante", see_results:"Voir les Résultats", retry:"Recommencer", score_msg_perfect:"Excellente préparation!", score_msg_good:"Bonne base. Révisez les sections incertaines.", score_msg_ok:"Bon début. Travaillez chaque section ensemble.", session_note:"Cette éducation est une préparation, pas un conseil médical. Adressez toujours les questions cliniques à votre prestataire de soins.", group_prompt:"Discussion de Groupe:", key_word:"Terme Clé" },
  },

  // ── NAV LABELS ──
  nav: {
    en: ["How Labor Begins","Stages of Labor","Pain Management","Hospital Navigation","Common Interventions","Birth Preferences","Your Newborn","Early Postpartum","Quiz & Myths"],
    es: ["Cómo Comienza el Parto","Etapas del Parto","Manejo del Dolor","Navegando el Hospital","Intervenciones Comunes","Preferencias del Parto","Su Recién Nacido","Postparto Temprano","Prueba y Mitos"],
    ht: ["Kòman Travay Kòmanse","Etap Travay la","Jesyon Doulè","Navigasyon nan Lopital","Entèvansyon Kouran","Preferans pou Akouchman","Bebe Ou Fèk Fèt","Apre Akouchman","Kesyon ak Mit"],
    fr: ["Comment le Travail Commence","Les Stades du Travail","Gestion de la Douleur","Navigation à l'Hôpital","Interventions Courantes","Préférences pour l'Accouchement","Votre Nouveau-né","Post-partum Précoce","Quiz et Mythes"],
  },

  // ── SECTION 1: HOW LABOR BEGINS ──
  s1: {
    en: {
      title:"How Labor Begins",
      intro:"Understanding the signs of labor helps families know when to act, when to wait, and when to call. Most labors begin gradually. Learning the difference between early signs and active labor prevents unnecessary hospital trips and reduces anxiety.",
      signs:[
        { name:"Bloody Show", desc:"Pink, red, or brown mucus discharge as the cervical mucus plug releases. May happen days before labor or during early labor. Normal." },
        { name:"Water Breaking", desc:"Rupture of membranes. May be a dramatic gush or a slow trickle. Note the time, color, and smell. Call your provider immediately. Do not take a bath." },
        { name:"Contractions", desc:"Regular, rhythmic tightening that increases in frequency, duration, and intensity over time. The key word is PATTERN. Braxton Hicks contractions are irregular and don't intensify." },
        { name:"Lightening / Baby Drops", desc:"The baby settles lower in the pelvis in the weeks before labor. Easier to breathe, more pelvic pressure. Can happen 2-4 weeks before labor in first-time parents." },
        { name:"Nesting Energy", desc:"A surge of energy and drive to prepare in the days before labor. Common and normal. Encourage rest alongside this energy." },
        { name:"GI Changes", desc:"Loose stools, nausea, or decreased appetite in the hours or days before labor. The body clears the GI tract to prepare." },
      ],
      when_to_go:{ title:"When to Go to the Hospital", rules:["5-1-1 Rule: Contractions every 5 minutes, lasting 1 minute each, for 1 hour","Water breaks - regardless of contraction status","Heavy bleeding (more than a period)","Baby's movement significantly decreases","You feel something is wrong - trust your instincts","Any provider-specific instructions that override these"] },
      discussion:"What signs of labor have you heard about? What worries you most about knowing when to go in? What does your support person need to know?",
      provider_qs:["What should I do first when I think labor has started?","Do you want me to call before coming in, or go directly?","What are my specific warning signs given my health history?","Should I go to triage if I'm unsure?"],
      vocab:[{t:"Braxton Hicks",d:"Practice contractions  -  irregular, not intensifying"},{t:"Bloody Show",d:"Mucus plug release  -  can be days before labor"},{t:"Rupture of Membranes",d:"Water breaking"},{t:"5-1-1 Rule",d:"Contractions 5 min apart, 1 min long, for 1 hour"}],
      myths:[{m:"Your water breaks dramatically like in the movies",f:"Only about 10% of labors begin with water breaking. Most begin with contractions. When membranes do rupture, it is often a slow trickle, not a sudden gush."},{m:"Once labor starts, you must go to the hospital immediately",f:"For uncomplicated labors with intact membranes, early labor is often more comfortable at home. Most providers recommend laboring at home through early labor and going in during active labor (6+ cm) unless there are specific concerns."}],
    },
    es: {
      title:"Cómo Comienza el Parto",
      intro:"Entender las señales del parto ayuda a las familias a saber cuándo actuar, cuándo esperar y cuándo llamar. La mayoría de los partos comienzan gradualmente. Aprender la diferencia entre las señales tempranas y el parto activo evita visitas innecesarias al hospital y reduce la ansiedad.",
      signs:[
        { name:"Tapón Mucoso (Bloody Show)", desc:"Secreción mucosa rosada, roja o marrón a medida que se libera el tapón cervical. Puede ocurrir días antes del parto o durante el parto temprano. Es normal." },
        { name:"Rotura de Membranas", desc:"Puede ser un chorro dramático o un goteo lento. Anote la hora, el color y el olor. Llame a su proveedor inmediatamente. No se bañe en tina." },
        { name:"Contracciones", desc:"Tensión rítmica y regular que aumenta en frecuencia, duración e intensidad con el tiempo. La palabra clave es PATRÓN. Las contracciones de Braxton Hicks son irregulares y no se intensifican." },
        { name:"El Bebé Baja (Aligeramiento)", desc:"El bebé se asienta más bajo en la pelvis semanas antes del parto. Más fácil respirar, más presión pélvica. Puede ocurrir 2-4 semanas antes en mamás primerizas." },
        { name:"Energía de Nesting", desc:"Un aumento de energía y el impulso de preparar en los días antes del parto. Común y normal. Estimule el descanso junto con esta energía." },
        { name:"Cambios Gastrointestinales", desc:"Heces sueltas, náuseas o disminución del apetito en las horas o días antes del parto. El cuerpo despeja el tracto gastrointestinal para prepararse." },
      ],
      when_to_go:{ title:"Cuándo Ir al Hospital", rules:["Regla 5-1-1: Contracciones cada 5 minutos, que duran 1 minuto, por 1 hora","Se rompe la fuente  -  independientemente del estado de las contracciones","Sangrado abundante (más que una menstruación)","El movimiento del bebé disminuye significativamente","Siente que algo está mal  -  confíe en sus instintos","Cualquier instrucción específica de su proveedor"] },
      discussion:"¿Qué señales del parto ha escuchado? ¿Qué le preocupa más sobre saber cuándo ir? ¿Qué necesita saber su persona de apoyo?",
      provider_qs:["¿Qué debo hacer primero cuando creo que ha comenzado el parto?","¿Quiere que llame antes de ir, o vaya directamente?","¿Cuáles son mis señales de advertencia específicas dado mi historial de salud?","¿Debo ir a triaje si no estoy segura?"],
      vocab:[{t:"Braxton Hicks",d:"Contracciones de práctica - irregulares, no se intensifican"},{t:"Tapón Mucoso",d:"Liberación del tapón cervical - puede ser días antes del parto"},{t:"Rotura de Membranas",d:"Ruptura de la fuente"},{t:"Regla 5-1-1",d:"Contracciones cada 5 min, duran 1 min, por 1 hora"}],
      myths:[{m:"La fuente se rompe dramáticamente como en las películas",f:"Solo alrededor del 10% de los partos comienzan con la rotura de la fuente. La mayoría comienzan con contracciones. Cuando las membranas sí se rompen, a menudo es un goteo lento, no un chorro repentino."},{m:"Una vez que comienza el parto, debe ir al hospital inmediatamente",f:"Para partos sin complicaciones con membranas intactas, el parto temprano suele ser más cómodo en casa. La mayoría de los proveedores recomiendan estar en casa durante el parto temprano e ir durante el parto activo (6+ cm)."}],
    },
    ht: {
      title:"Kòman Travay Kòmanse",
      intro:"Konprann siy travay la ede fanmi yo konnen ki lè pou yo aji, ki lè pou yo tann, ak ki lè pou yo rele. Pifò travay kòmanse dousman. Aprann diferans ant siy bonè ak travay aktif anpeche vizit lopital ki pa nesesè epi diminye enkyetid.",
      signs:[
        { name:"Boujon San (Bloody Show)", desc:"Depo miske woz, wouj, oswa mawon lè boujon kol matris la soti. Ka rive jou anvan travay oswa pandan travay bonè. Sa a nòmal." },
        { name:"Dlo Kase", desc:"Kapab yon gwo jete dlo oswa yon koule dousman. Note lè a, koulè a, ak sant lan. Rele doktè ou imedyatman. Pa pran ben basen." },
        { name:"Kontraksiyon", desc:"Rèdè ritmik regilye ki ogmante nan frekans, dire, ak entansite ak letan. Mo kle a se MODÈL. Kontraksiyon Braxton Hicks yo iregilye epi yo pa vin pi fò." },
        { name:"Bebe a Desann", desc:"Bebe a vin pi ba nan basen an semèn anvan travay. Pi fasil pou respire, plis presyon nan basen. Ka rive 2-4 semèn anvan travay pou premye manman." },
        { name:"Enèji Nesting", desc:"Yon ogmantasyon enèji ak volonte pou prepare nan jou anvan travay. Nòmal. Ankouraje repo ansanm ak enèji sa a." },
        { name:"Chanjman GI", desc:"Dyare, kè plen, oswa diminye apeti nan èdtan oswa jou anvan travay. Kò a netwaye trak entesten pou prepare." },
      ],
      when_to_go:{ title:"Ki Lè Pou Ale Lopital", rules:["Règ 5-1-1: Kontraksiyon chak 5 minit, dire 1 minit chak, pou 1 èdtan","Dlo kase - kèlkeswa eta kontraksiyon yo","Senyen anpil (plis pase règ)","Mouvman bebe a diminye anpil","Ou santi yon bagay pa bon - fè konfyans ensten ou","Nenpòt enstriksyon espesyal doktè ou ba ou"]},
      discussion:"Ki siy travay ou te tande pale de yo? Ki sa ki enkyete ou plis konsènan konnen ki lè pou ou ale? Ki sa moun sipò ou bezwen konnen?",
      provider_qs:["Ki sa mwen ta dwe fè an premye lè mwen panse travay kòmanse?","Ou vle mwen rele anvan mwen vini, oswa mwen ale dirèkteman?","Ki siy alèt espesifik mwen genyen dapre istwa sante mwen?","Eske mwen ta dwe ale triaj si mwen pa sèten?"],
      vocab:[{t:"Braxton Hicks",d:"Kontraksiyon pratik - iregilye, pa vin pi fò"},{t:"Boujon San",d:"Boujon kol matris soti - ka jou anvan travay"},{t:"Dlo Kase",d:"Manbràn yo kase"},{t:"Règ 5-1-1",d:"Kontraksiyon chak 5 min, 1 min lone, pou 1 èdtan"}],
      myths:[{m:"Dlo ou kase bruskan tankou nan fim yo",f:"Sèlman anviwon 10% travay kòmanse ak dlo ki kase. Pifò kòmanse ak kontraksiyon. Lè manbràn yo kase, se souvan yon koule dousman, pa yon jete brisk."},{m:"Yon fwa travay kòmanse, ou dwe ale lopital imedyatman",f:"Pou travay san konplikasyon ak manbràn ki entèg, travay bonè souvan pi konfòtab lakay. Pifò doktè rekòmande rete lakay pandan travay bonè epi ale pandan travay aktif (6+ cm)."}],
    },
    fr: {
      title:"Comment le Travail Commence",
      intro:"Comprendre les signes du travail aide les familles à savoir quand agir, quand attendre et quand appeler. La plupart des accouchements commencent progressivement. Apprendre la différence entre les signes précoces et le travail actif évite des visites inutiles à l'hôpital et réduit l'anxiété.",
      signs:[
        { name:"Bouchon Muqueux (Bloody Show)", desc:"Écoulement muqueux rose, rouge ou brun lors de la libération du bouchon cervical. Peut survenir des jours avant le travail ou pendant le travail précoce. C'est normal." },
        { name:"Rupture des Membranes", desc:"Peut être un flot spectaculaire ou un écoulement lent. Notez l'heure, la couleur et l'odeur. Appelez votre prestataire immédiatement. Ne prenez pas de bain." },
        { name:"Contractions", desc:"Tension rythmique régulière qui augmente en fréquence, durée et intensité avec le temps. Le mot clé est SCHÉMA. Les contractions de Braxton Hicks sont irrégulières et ne s'intensifient pas." },
        { name:"Allégement (Descente du Bébé)", desc:"Le bébé descend plus bas dans le bassin dans les semaines avant le travail. Plus facile de respirer, plus de pression pelvienne. Peut survenir 2-4 semaines avant le travail chez les primipares." },
        { name:"Énergie de Nidification", desc:"Une montée d'énergie et l'envie de préparer dans les jours précédant le travail. Normal et fréquent. Encouragez le repos en même temps." },
        { name:"Changements GI", desc:"Selles molles, nausées ou perte d'appétit dans les heures ou jours précédant le travail. Le corps nettoie le tractus gastro-intestinal pour se préparer." },
      ],
      when_to_go:{ title:"Quand Aller à l'Hôpital", rules:["Règle 5-1-1: Contractions toutes les 5 minutes, durant 1 minute chacune, pendant 1 heure","Rupture des membranes - quel que soit l'état des contractions","Saignements abondants (plus qu'une menstruation)","Les mouvements du bébé diminuent significativement","Vous sentez que quelque chose ne va pas - faites confiance à votre instinct","Toute instruction spécifique de votre prestataire"] },
      discussion:"Quels signes du travail avez-vous entendus? Qu'est-ce qui vous préoccupe le plus concernant le moment d'aller? Que doit savoir votre personne de soutien?",
      provider_qs:["Que dois-je faire en premier quand je pense que le travail a commencé?","Voulez-vous que j'appelle avant de venir, ou dois-je aller directement?","Quels sont mes signes d'alerte spécifiques compte tenu de mes antécédents de santé?","Dois-je aller aux urgences obstétricales si je ne suis pas sûre?"],
      vocab:[{t:"Braxton Hicks",d:"Contractions d'entraînement - irrégulières, ne s'intensifient pas"},{t:"Bouchon Muqueux",d:"Libération du bouchon cervical - peut être des jours avant le travail"},{t:"Rupture des Membranes",d:"La poche des eaux se rompt"},{t:"Règle 5-1-1",d:"Contractions toutes les 5 min, durent 1 min, pendant 1 heure"}],
      myths:[{m:"La poche des eaux se rompt de façon spectaculaire comme au cinéma",f:"Seulement environ 10% des accouchements commencent par la rupture des membranes. La plupart commencent par des contractions. Quand les membranes se rompent, c'est souvent un écoulement lent, pas un flot soudain."},{m:"Une fois le travail commencé, vous devez aller à l'hôpital immédiatement",f:"Pour les accouchements non compliqués avec membranes intactes, le travail précoce est souvent plus confortable à la maison. La plupart des prestataires recommandent de rester à la maison pendant le travail précoce."}],
    },
  },

  // ── SECTION 2: STAGES OF LABOR ──
  s2: {
    en: {
      title:"The Stages of Labor",
      intro:"Labor unfolds in stages, each with its own rhythm, intensity, and support needs. Understanding what is happening in each stage  -  and what to expect next  -  reduces fear and helps families make informed decisions in the moment.",
      stages:[
        { name:"Early Labor (Latent Phase)", color:C.teal, duration:"Hours to days", dilation:"0-6 cm",
          desc:"Contractions begin establishing a pattern  -  often 15-20 minutes apart, then closer. They are real but manageable. This is the longest phase for most people. Rest, eat lightly, stay hydrated, and labor at home if possible.",
          doula_role:"Be present without rushing. Normalize the length. Encourage rest, movement, and eating. Save your energy for active labor." },
        { name:"Active Labor", color:C.purple, duration:"4-8 hours average", dilation:"6-10 cm",
          desc:"Contractions are now 3-5 minutes apart, lasting 45-90 seconds, and require full focus. The cervix is actively opening. This is when most families come to the hospital. Position changes, counterpressure, and breathing become essential.",
          doula_role:"Full active support. Position changes every 20-30 minutes. Counterpressure, breathing cues, hydration, and emotional reassurance. Be close and present for every contraction." },
        { name:"Transition", color:C.red, duration:"15 minutes - 2 hours", dilation:"8-10 cm",
          desc:"The most intense phase  -  and the shortest. Contractions come every 2-3 minutes with little rest between. Many people feel out of control, nauseous, shaky, or convinced they cannot continue. This is a sign that pushing is near.",
          doula_role:"Transition is the moment your presence matters most. Stay close. Keep cues simple: 'Breathe with me. One at a time. You are almost there.' Do not leave." },
        { name:"Pushing (Second Stage)", color:C.orange, duration:"Minutes to 3+ hours", dilation:"10 cm",
          desc:"The cervix is fully dilated. The baby moves through the birth canal with each push. Some people feel a strong urge to push; others (especially with epidural) feel pressure without urgency. Encourage physiological pushing when possible.",
          doula_role:"Position support, leg holding, encouragement, and breath cuing. Watch the energy in the room. Speak into her strength." },
        { name:"Placenta (Third Stage)", color:C.green, duration:"5-30 minutes", dilation:"N/A",
          desc:"After the baby is born, the placenta is delivered. This happens naturally with gentle pushing or Pitocin is given to support uterine contraction. Often experienced as anti-climactic  -  families are focused on the baby.",
          doula_role:"Facilitate skin-to-skin. Support initial latch if breastfeeding. Stay present while the placenta delivers. Prepare family for what comes next." },
      ],
      discussion:"What part of labor are you most curious or anxious about? What surprised you learning about how long early labor can be? How does it help to know what's coming?",
      provider_qs:["At what dilation do you typically recommend coming to the hospital?","What is your approach to pushing  -  directed or physiological?","How will I know when I am in active labor vs. early labor?","What happens if my labor stalls at a certain dilation?"],
      vocab:[{t:"Latent Phase",d:"Early labor, 0-6 cm"},{t:"Active Labor",d:"6-10 cm, full focus needed"},{t:"Transition",d:"8-10 cm  -  most intense, shortest"},{t:"Dilation",d:"Opening of the cervix measured in centimeters"},{t:"Effacement",d:"Thinning of the cervix, measured in percentage"}],
      myths:[{m:"Labor always follows a neat, linear progression",f:"Labor stalls, speeds up, slows down, and sometimes moves backward in dilation measurement due to measurement variation. A plateau is not a failure  -  it is often a moment of reorganization before progress resumes."},{m:"Transition lasts for hours",f:"Transition is typically the shortest phase of labor  -  often 15-60 minutes, rarely longer than 2 hours. When people feel they cannot continue, they are usually almost through it."}],
    },
    es: {
      title:"Las Etapas del Parto",
      intro:"El parto se desarrolla en etapas, cada una con su propio ritmo, intensidad y necesidades de apoyo. Comprender lo que sucede en cada etapa  -  y qué esperar a continuación  -  reduce el miedo y ayuda a las familias a tomar decisiones informadas en el momento.",
      stages:[
        { name:"Parto Temprano (Fase Latente)", color:C.teal, duration:"Horas a días", dilation:"0-6 cm",
          desc:"Las contracciones comienzan a establecer un patrón  -  a menudo cada 15-20 minutos, luego más cercanas. Son reales pero manejables. Esta es la fase más larga para la mayoría. Descanse, coma ligeramente, manténgase hidratada y esté en casa si es posible.",
          doula_role:"Estar presente sin apresurarse. Normalizar la duración. Estimular el descanso, el movimiento y comer. Guardar energía para el parto activo." },
        { name:"Parto Activo", color:C.purple, duration:"4-8 horas promedio", dilation:"6-10 cm",
          desc:"Las contracciones ahora son cada 3-5 minutos, duran 45-90 segundos y requieren concentración total. El cuello uterino se está abriendo activamente. Aquí es cuando la mayoría va al hospital. Los cambios de posición, la contrapresión y la respiración son esenciales.",
          doula_role:"Apoyo activo completo. Cambios de posición cada 20-30 minutos. Contrapresión, señales de respiración, hidratación y tranquilidad emocional. Esté cerca y presente en cada contracción." },
        { name:"Transición", color:C.red, duration:"15 minutos - 2 horas", dilation:"8-10 cm",
          desc:"La fase más intensa  -  y la más corta. Las contracciones vienen cada 2-3 minutos con poco descanso. Muchas personas sienten que no pueden continuar, tienen náuseas o temblores. Esto es una señal de que el pujo está cerca.",
          doula_role:"La transición es el momento en que su presencia importa más. Permanezca cerca. Mantenga las señales simples: 'Respira conmigo. Una a la vez. Ya casi llegas.' No se vaya." },
        { name:"Pujo (Segunda Etapa)", color:C.orange, duration:"Minutos a 3+ horas", dilation:"10 cm",
          desc:"El cuello uterino está completamente dilatado. El bebé se mueve por el canal del parto con cada pujo. Estimule el pujo fisiológico cuando sea posible.",
          doula_role:"Apoyo de posición, sostener piernas, aliento y señales de respiración. Hable a su fortaleza." },
        { name:"Placenta (Tercera Etapa)", color:C.green, duration:"5-30 minutos", dilation:"N/A",
          desc:"Después de que nace el bebé, se entrega la placenta. Facilite el piel con piel. Apoye el agarre inicial si está amamantando.",
          doula_role:"Facilitar el piel con piel. Apoyar el agarre inicial. Permanecer presente mientras se entrega la placenta." },
      ],
      discussion:"¿Qué parte del parto le genera más curiosidad o ansiedad? ¿Qué le sorprendió al saber cuánto tiempo puede durar el parto temprano?",
      provider_qs:["¿A qué dilatación recomienda normalmente venir al hospital?","¿Cuál es su enfoque para el pujo  -  dirigido o fisiológico?","¿Cómo sabré cuándo estoy en parto activo versus parto temprano?","¿Qué sucede si mi parto se detiene en una cierta dilatación?"],
      vocab:[{t:"Fase Latente",d:"Parto temprano, 0-6 cm"},{t:"Parto Activo",d:"6-10 cm, concentración total"},{t:"Transición",d:"8-10 cm  -  más intensa, más corta"},{t:"Dilatación",d:"Apertura del cuello uterino en centímetros"},{t:"Borramiento",d:"Adelgazamiento del cuello uterino, en porcentaje"}],
      myths:[{m:"El parto siempre sigue una progresión lineal",f:"El parto se detiene, acelera, desacelera. Una meseta no es un fracaso  -  es a menudo un momento de reorganización antes de que continúe el progreso."},{m:"La transición dura horas",f:"La transición es típicamente la fase más corta del parto  -  a menudo 15-60 minutos, raramente más de 2 horas. Cuando las personas sienten que no pueden continuar, generalmente ya casi han terminado."}],
    },
    ht: {
      title:"Etap Travay la",
      intro:"Travay la devlope an etap, chak youn gen pwòp ritem li, entansite li, ak bezwen sipò li. Konprann sa k ap pase nan chak etap ede fanmi yo pran desizyon eklere.",
      stages:[
        { name:"Travay Bonè (Faz Latan)", color:C.teal, duration:"Èdtan rive jou", dilation:"0-6 cm",
          desc:"Kontraksiyon yo kòmanse etabli yon modèl  -  souvan chak 15-20 minit, epi yo vini pi pre. Yo reyèl men yo jèrab. Sa a se faz ki pi long pou pifò moun. Repoze, manje lejèman, rete idrate, epi fè travay lakay si posib.",
          doula_role:"Prezan san presize. Nòmalize dire a. Ankouraje repo, mouvman, ak manje. Kenbe enèji ou pou travay aktif." },
        { name:"Travay Aktif", color:C.purple, duration:"4-8 èdtan an mwayèn", dilation:"6-10 cm",
          desc:"Kontraksiyon yo kounye a chak 3-5 minit, dire 45-90 segond, epi yo mande tout atansyon. Kol matris la ap ouvri aktèlman. Se lè pifò moun ale lopital. Chanjman pozisyon, presyon kont, ak respirasyon vin esansyèl.",
          doula_role:"Sipò aktif konplè. Chanje pozisyon chak 20-30 minit. Presyon kont, gid respirasyon, idrasyon, ak ankourajman emosyonèl. Rete pre epi prezan pou chak kontraksiyon." },
        { name:"Tranzisyon", color:C.red, duration:"15 minit - 2 èdtan", dilation:"8-10 cm",
          desc:"Faz ki pi entans  -  epi ki pi kout. Kontraksiyon vini chak 2-3 minit ak kèk repo. Anpil moun santi yo pa kapab kontinye, yo vomi, oswa yo tranble. Sa a se yon siy pouse a pwòch.",
          doula_role:"Tranzisyon se moman prezans ou enpòtan plis. Rete pre. Kenbe mesaj yo senp: 'Respire avèk mwen. Youn pa youn. Ou prèske rive.' Pa kite." },
        { name:"Pouse (Dezyèm Etap)", color:C.orange, duration:"Minit rive 3+ èdtan", dilation:"10 cm",
          desc:"Kol matris la totalman dilate. Bebe a deplase nan kanal akouchman an ak chak pouse. Ankouraje pouse fiziyolojik lè posib.",
          doula_role:"Sipò pozisyon, kenbe janm, ankourajman, ak gid respirasyon. Pale nan fòs li." },
        { name:"Plasenta (Twazyèm Etap)", color:C.green, duration:"5-30 minit", dilation:"N/A",
          desc:"Apre bebe a fèt, plasenta a delivre. Fasilite po-a-po. Sipòte ogmantasyon inisyal si k ap alète.",
          doula_role:"Fasilite po-a-po. Sipòte pran tete inisyal. Rete prezan pandan plasenta delivre." },
      ],
      discussion:"Ki pati nan travay ki ban ou plis kiriozite oswa enkyetid? Ki sa ki te sipriz pou ou lè ou aprann konbyen tan travay bonè ka dire?",
      provider_qs:["Ki dilatasyon ou rekòmande nòmalman pou ale lopital?","Ki apwòch ou genyen pou pouse  -  dirije oswa fiziyolojik?","Kòman mwen pral konnen lè mwen nan travay aktif kont travay bonè?","Ki sa k ap pase si travay mwen kanpe nan yon sèten dilatasyon?"],
      vocab:[{t:"Faz Latan",d:"Travay bonè, 0-6 cm"},{t:"Travay Aktif",d:"6-10 cm, tout atansyon nesesè"},{t:"Tranzisyon",d:"8-10 cm  -  pi entans, pi kout"},{t:"Dilatasyon",d:"Ouverti kol matris an santimèt"},{t:"Efasman",d:"Aminsisman kol matris, mesire an pousantaj"}],
      myths:[{m:"Travay la toujou swiv yon pwogresyon lineyè",f:"Travay la kanpe, akselere, ralanti. Yon plato se pa yon echèk  -  se souvan yon moman reòganizasyon anvan pwogrè reprann."},{m:"Tranzisyon dire plizyè èdtan",f:"Tranzisyon se tipikman faz ki pi kout nan travay  -  souvan 15-60 minit, raman plis pase 2 èdtan. Lè moun santi yo pa kapab kontinye, yo jeneralman prèske fini."}],
    },
    fr: {
      title:"Les Stades du Travail",
      intro:"L'accouchement se déroule en stades, chacun avec son propre rythme, son intensité et ses besoins de soutien. Comprendre ce qui se passe à chaque stade réduit la peur et aide les familles à prendre des décisions éclairées.",
      stages:[
        { name:"Travail Précoce (Phase Latente)", color:C.teal, duration:"Heures à jours", dilation:"0-6 cm",
          desc:"Les contractions commencent à s'établir  -  souvent toutes les 15-20 minutes, puis plus rapprochées. Elles sont réelles mais gérables. C'est la phase la plus longue. Reposez-vous, mangez légèrement, restez hydratée et travaillez à la maison si possible.",
          doula_role:"Être présente sans se précipiter. Normaliser la durée. Encourager le repos, les mouvements et manger. Conserver son énergie pour le travail actif." },
        { name:"Travail Actif", color:C.purple, duration:"4-8 heures en moyenne", dilation:"6-10 cm",
          desc:"Les contractions sont maintenant toutes les 3-5 minutes, durent 45-90 secondes et nécessitent une concentration totale. Le col s'ouvre activement. C'est quand la plupart des familles viennent à l'hôpital.",
          doula_role:"Soutien actif complet. Changements de position toutes les 20-30 minutes. Contre-pression, guidage respiratoire, hydratation et réconfort émotionnel." },
        { name:"Transition", color:C.red, duration:"15 minutes - 2 heures", dilation:"8-10 cm",
          desc:"La phase la plus intense  -  et la plus courte. Les contractions viennent toutes les 2-3 minutes avec peu de repos. Beaucoup de personnes se sentent dépassées, nauséeuses ou tremblantes. C'est le signe que la poussée est proche.",
          doula_role:"La transition est le moment où votre présence compte le plus. Restez proche. Gardez les cues simples: 'Respirez avec moi. Une à la fois. Vous y êtes presque.' Ne partez pas." },
        { name:"Poussée (Deuxième Stade)", color:C.orange, duration:"Minutes à 3+ heures", dilation:"10 cm",
          desc:"Le col est complètement dilaté. Le bébé descend dans le canal de naissance à chaque poussée. Encouragez la poussée physiologique quand possible.",
          doula_role:"Soutien des positions, tenir les jambes, encouragements et guidage respiratoire. Parlez dans sa force." },
        { name:"Placenta (Troisième Stade)", color:C.green, duration:"5-30 minutes", dilation:"N/A",
          desc:"Après la naissance du bébé, le placenta est délivré. Facilitez le peau-à-peau. Soutenez la mise au sein initiale si elle allaite.",
          doula_role:"Faciliter le peau-à-peau. Soutenir la mise au sein initiale. Rester présente pendant la délivrance du placenta." },
      ],
      discussion:"Quelle partie de l'accouchement vous rend le plus curieux ou anxieux? Qu'est-ce qui vous a surpris en apprenant combien de temps peut durer le travail précoce?",
      provider_qs:["À quelle dilatation recommandez-vous généralement de venir à l'hôpital?","Quelle est votre approche pour la poussée  -  dirigée ou physiologique?","Comment saurai-je quand je suis en travail actif?","Que se passe-t-il si mon travail stagne à une certaine dilatation?"],
      vocab:[{t:"Phase Latente",d:"Travail précoce, 0-6 cm"},{t:"Travail Actif",d:"6-10 cm, concentration totale"},{t:"Transition",d:"8-10 cm  -  plus intense, plus courte"},{t:"Dilatation",d:"Ouverture du col en centimètres"},{t:"Effacement",d:"Amincissement du col, mesuré en pourcentage"}],
      myths:[{m:"L'accouchement suit toujours une progression linéaire",f:"Le travail s'arrête, accélère, ralentit. Un plateau n'est pas un échec  -  c'est souvent un moment de réorganisation avant que la progression reprenne."},{m:"La transition dure des heures",f:"La transition est typiquement la phase la plus courte  -  souvent 15-60 minutes. Quand les personnes sentent qu'elles ne peuvent pas continuer, elles ont généralement presque terminé."}],
    },
  },

  // ── SECTION 3: PAIN MANAGEMENT ──
  s3: {
    en: {
      title:"Pain Management Options",
      intro:"There is no right or wrong way to manage labor pain. The goal is informed choice  -  understanding all available options so that you can choose what aligns with your values, your body, and your circumstances. Pain management decisions can and do change during labor. Flexibility is not failure.",
      non_pharm:[
        { name:"Hydrotherapy (Water)", icon:"💧", color:C.teal, desc:"Warm water in shower or tub reduces pain perception significantly. Shower spray directed at the lower back is highly effective for back labor. Immersion (tub) is available at some hospitals and most birth centers." },
        { name:"Counterpressure", icon:"✊", color:C.orange, desc:"Firm pressure on the sacrum or hips during contractions. One of the most effective non-pharmacological interventions available. Requires an active support partner or doula." },
        { name:"Position Changes", icon:"🤸", color:C.purple, desc:"Movement and position changes every 20-30 minutes use gravity, pelvic mobility, and fetal positioning to manage pain and progress. Hands and knees, side-lying, upright, and squatting each offer different relief." },
        { name:"Breathing and Vocalization", icon:"🌬️", color:C.blue, desc:"Slow breathing activates the parasympathetic system. Low, open vocalizations promote pelvic floor relaxation. Your doula and support team can breathe with you." },
        { name:"Heat and Cold", icon:"🔥", color:C.gold, desc:"Warm compress on the lower back or abdomen. Cool cloth on the forehead or neck. Simple, accessible, and often underestimated." },
        { name:"Massage and Touch", icon:"🤲", color:C.pink, desc:"Therapeutic touch from a trusted support person activates the oxytocin response and reduces cortisol. Permission and feedback always required." },
        { name:"Sterile Water Injections", icon:"💉", color:C.green, desc:"Small injections of sterile water under the skin of the lower back. Provides 45-90 minutes of significant relief for back labor. Available in some hospitals. Ask your provider." },
      ],
      pharm:[
        { name:"Epidural Analgesia", icon:"💊", color:C.purple, desc:"Continuous medication delivered through a small catheter in the lower back. Provides significant to complete pain relief. Most common pharmacological pain management in US hospitals. Requires IV, continuous monitoring, and limits mobility." },
        { name:"IV Opioids (Fentanyl, Nubain)", icon:"💊", color:C.blue, desc:"IV medications that take the edge off contractions without eliminating sensation. Allow some mobility. May cause drowsiness. Not appropriate in late labor (can affect baby's breathing at birth)." },
        { name:"Nitrous Oxide", icon:"💨", color:C.teal, desc:"Inhaled gas that reduces anxiety and pain perception. Self-administered through a mask during contractions. Does not eliminate pain but reduces intensity. Available at some hospitals and birth centers." },
        { name:"Spinal Block", icon:"💊", color:C.orange, desc:"Single injection of medication into the spinal fluid. Fast-acting, complete pain relief. Used for cesarean births and sometimes for rapid pain relief in labor." },
      ],
      discussion:"What are your feelings about pain management during labor? What methods are you already considering? What questions or concerns do you have about the epidural specifically?",
      provider_qs:["Is hydrotherapy available at your birth location?","At what point in labor can I get an epidural if I want one?","What are the specific risks and benefits of the epidural for my situation?","Is nitrous oxide available at your facility?","What non-pharmacological pain support does your nursing team provide?"],
      vocab:[{t:"Analgesia",d:"Pain relief that reduces sensation without eliminating it"},{t:"Anesthesia",d:"Complete elimination of sensation"},{t:"Epidural",d:"Continuous pain medication via catheter in lower back"},{t:"Physiological Labor",d:"Labor that progresses without medical intervention"}],
      myths:[{m:"Getting an epidural means you failed at natural birth",f:"Pain management is a medical decision, not a moral one. The epidural is a tool  -  no more a failure than using a seatbelt. Informed choice includes the full range of options without judgment in either direction."},{m:"The epidural always slows labor down",f:"Research on the epidural-labor length relationship is mixed. Some studies show no effect on labor duration; others show slight increase in pushing time. It does not reliably stall labor. The decision should be based on your specific circumstances."}],
    },
    es: {
      title:"Opciones para el Manejo del Dolor",
      intro:"No hay una manera correcta o incorrecta de manejar el dolor del parto. El objetivo es la elección informada  -  entender todas las opciones disponibles para que pueda elegir lo que se alinea con sus valores, su cuerpo y sus circunstancias. Las decisiones sobre el manejo del dolor pueden cambiar durante el parto. La flexibilidad no es fracaso.",
      non_pharm:[
        { name:"Hidroterapia (Agua)", icon:"💧", color:C.teal, desc:"El agua tibia en la ducha o tina reduce significativamente la percepción del dolor. El chorro de la ducha dirigido a la zona lumbar es muy efectivo para el parto de espalda." },
        { name:"Contrapresión", icon:"✊", color:C.orange, desc:"Presión firme en el sacro o las caderas durante las contracciones. Una de las intervenciones no farmacológicas más efectivas disponibles." },
        { name:"Cambios de Posición", icon:"🤸", color:C.purple, desc:"El movimiento y los cambios de posición cada 20-30 minutos usan la gravedad y la movilidad pélvica para manejar el dolor y el progreso." },
        { name:"Respiración y Vocalización", icon:"🌬️", color:C.blue, desc:"La respiración lenta activa el sistema parasimpático. Las vocalizaciones bajas y abiertas promueven la relajación del suelo pélvico." },
        { name:"Calor y Frío", icon:"🔥", color:C.gold, desc:"Compresa tibia en la zona lumbar o el abdomen. Paño frío en la frente o el cuello. Simple y efectivo." },
        { name:"Masaje y Toque", icon:"🤲", color:C.pink, desc:"El toque terapéutico activa la respuesta de oxitocina y reduce el cortisol. Siempre se requiere permiso y retroalimentación." },
        { name:"Inyecciones de Agua Estéril", icon:"💉", color:C.green, desc:"Pequeñas inyecciones de agua estéril debajo de la piel de la zona lumbar. Proporciona alivio significativo de 45-90 minutos para el parto de espalda." },
      ],
      pharm:[
        { name:"Analgesia Epidural", icon:"💊", color:C.purple, desc:"Medicación continua a través de un catéter en la zona lumbar. Proporciona alivio significativo o completo del dolor. El método farmacológico más común en hospitales de EE.UU." },
        { name:"Opioides IV (Fentanilo, Nubain)", icon:"💊", color:C.blue, desc:"Medicamentos IV que alivian las contracciones sin eliminar la sensación. Permiten algo de movilidad. No apropiados en el parto tardío." },
        { name:"Óxido Nitroso", icon:"💨", color:C.teal, desc:"Gas inhalado que reduce la ansiedad y la percepción del dolor. Se administra a sí misma a través de una máscara durante las contracciones." },
        { name:"Bloqueo Espinal", icon:"💊", color:C.orange, desc:"Inyección única en el líquido espinal. Alivio del dolor rápido y completo. Se usa para partos por cesárea." },
      ],
      discussion:"¿Cuáles son sus sentimientos sobre el manejo del dolor durante el parto? ¿Qué métodos ya está considerando? ¿Qué preguntas tiene sobre la epidural específicamente?",
      provider_qs:["¿Está disponible la hidroterapia en su lugar de parto?","¿En qué punto del parto puedo recibir la epidural si la deseo?","¿Cuáles son los riesgos y beneficios específicos de la epidural para mi situación?","¿Está disponible el óxido nitroso en su instalación?"],
      vocab:[{t:"Analgesia",d:"Alivio del dolor que reduce la sensación sin eliminarla"},{t:"Anestesia",d:"Eliminación completa de la sensación"},{t:"Epidural",d:"Medicación continua vía catéter en zona lumbar"},{t:"Parto Fisiológico",d:"Parto que progresa sin intervención médica"}],
      myths:[{m:"Recibir la epidural significa que falló en el parto natural",f:"El manejo del dolor es una decisión médica, no moral. La epidural es una herramienta. La elección informada incluye toda la gama de opciones sin juicio en ninguna dirección."},{m:"La epidural siempre retrasa el parto",f:"La investigación sobre la relación epidural-duración del parto es mixta. No retrasa el parto de manera confiable. La decisión debe basarse en sus circunstancias específicas."}],
    },
    ht: {
      title:"Opsyon pou Jere Doulè",
      intro:"Pa gen yon bon oswa move fason pou jere doulè akouchman. Objektif la se yon chwa eklere  -  konprann tout opsyon disponib pou ou ka chwazi sa ki aliye ak valè ou, kò ou, ak sikonstans ou. Desizyon jesyon doulè ka chanje pandan travay. Fleksibilite se pa yon echèk.",
      non_pharm:[
        { name:"Idwoterapi (Dlo)", icon:"💧", color:C.teal, desc:"Dlo cho nan douch oswa bak diminye pèsepsyon doulè anpil. Jèt douch dirije sou do anba a trè efikas pou travay do." },
        { name:"Presyon Kont", icon:"✊", color:C.orange, desc:"Presyon fèm sou sakrèm oswa hanch pandan kontraksiyon. Youn nan entèvansyon ki pi efikas ki disponib." },
        { name:"Chanjman Pozisyon", icon:"🤸", color:C.purple, desc:"Mouvman ak chanjman pozisyon chak 20-30 minit itilize gravite ak mobilite basen pou jere doulè." },
        { name:"Respirasyon ak Vokalizasyon", icon:"🌬️", color:C.blue, desc:"Respirasyon dousman aktive sistèm parasimpatik. Vokalizasyon ba ak ouvè ankouraje relaksasyon planch pelvik." },
        { name:"Chalè ak Frèt", icon:"🔥", color:C.gold, desc:"Konprès cho sou do anba oswa vant. Twal frèt sou fwon oswa kou. Senp epi efikas." },
        { name:"Masaj ak Touche", icon:"🤲", color:C.pink, desc:"Touche terapetik aktive repons oksitossin epi diminye kotizol. Toujou mande pèmisyon." },
        { name:"Enjeksyon Dlo Steril", icon:"💉", color:C.green, desc:"Ti enjeksyon dlo steril anba po do anba. Bay soulajman 45-90 minit pou travay do." },
      ],
      pharm:[
        { name:"Analjezi Epidiral", icon:"💊", color:C.purple, desc:"Medikaman kontinyèl via yon katèt nan do anba. Bay soulajman doulè enpòtan oswa konplè. Metòd famasi ki pi komen nan lopital ameriken." },
        { name:"Opiyoid IV (Fentanyl, Nubain)", icon:"💊", color:C.blue, desc:"Medikaman IV ki diminye kontraksiyon san elimine sansasyon. Pèmèt yon kèk mobilite. Pa apwopriye nan fen travay." },
        { name:"Oksid Azòt", icon:"💨", color:C.teal, desc:"Gaz inale ki diminye enkyetid ak pèsepsyon doulè. Administre tèt ou via yon mask pandan kontraksiyon." },
        { name:"Blòk Spiral", icon:"💊", color:C.orange, desc:"Yon sèl enjeksyon nan likid spiral. Soulajman rapid ak konplè. Itilize pou akouchman sezaryèn." },
      ],
      discussion:"Ki santi ou genyen konsènan jesyon doulè pandan travay? Ki metòd ou deja ap konsidere? Ki kesyon ou genyen sou epidiral espesifikman?",
      provider_qs:["Eske idwoterapi disponib nan kote ou pral akouche a?","A ki moman nan travay mwen ka resevwa epidiral si mwen vle?","Ki risk ak benefis espesifik epidiral pou sitiyasyon mwen?","Eske oksid azòt disponib nan etablisman ou?"],
      vocab:[{t:"Analjezi",d:"Soulajman doulè ki diminye sansasyon san elimine li"},{t:"Anestezi",d:"Eliminasyon konplè sansasyon"},{t:"Epidiral",d:"Medikaman kontinyèl via katèt nan do anba"},{t:"Travay Fiziyolojik",d:"Travay ki avanse san entèvansyon medikal"}],
      myths:[{m:"Pran epidiral vle di ou echwe nan akouchman natirèl",f:"Jesyon doulè se yon desizyon medikal, pa moral. Epidiral se yon zouti. Chwa eklere enkli tout ranj opsyon san jijman nan okenn direksyon."},{m:"Epidiral la toujou ralanti travay",f:"Rechèch sou relasyon epidiral-dire travay se miks. Li pa ralanti travay de fason serye. Desizyon an ta dwe baze sou sikonstans espesifik ou."}],
    },
    fr: {
      title:"Options de Gestion de la Douleur",
      intro:"Il n'y a pas de bonne ou mauvaise façon de gérer la douleur du travail. L'objectif est le choix éclairé  -  comprendre toutes les options disponibles pour que vous puissiez choisir ce qui correspond à vos valeurs, votre corps et vos circonstances.",
      non_pharm:[
        { name:"Hydrothérapie (Eau)", icon:"💧", color:C.teal, desc:"L'eau chaude sous la douche ou dans la baignoire réduit significativement la perception de la douleur. Le jet de douche dirigé vers le bas du dos est très efficace pour le travail dorsal." },
        { name:"Contre-pression", icon:"✊", color:C.orange, desc:"Pression ferme sur le sacrum ou les hanches pendant les contractions. L'une des interventions non-pharmacologiques les plus efficaces disponibles." },
        { name:"Changements de Position", icon:"🤸", color:C.purple, desc:"Les mouvements et changements de position toutes les 20-30 minutes utilisent la gravité et la mobilité pelvienne pour gérer la douleur et la progression." },
        { name:"Respiration et Vocalisation", icon:"🌬️", color:C.blue, desc:"La respiration lente active le système parasympathique. Les vocalisations basses et ouvertes favorisent la relaxation du plancher pelvien." },
        { name:"Chaud et Froid", icon:"🔥", color:C.gold, desc:"Compresse chaude sur le bas du dos ou l'abdomen. Linge frais sur le front ou le cou. Simple et souvent sous-estimé." },
        { name:"Massage et Toucher", icon:"🤲", color:C.pink, desc:"Le toucher thérapeutique active la réponse à l'ocytocine et réduit le cortisol. Permission et feedback toujours requis." },
        { name:"Injections d'Eau Stérile", icon:"💉", color:C.green, desc:"Petites injections d'eau stérile sous la peau du bas du dos. Fournit 45-90 minutes de soulagement pour le travail dorsal." },
      ],
      pharm:[
        { name:"Analgésie Péridurale", icon:"💊", color:C.purple, desc:"Médicament continu via un cathéter dans le bas du dos. Fournit un soulagement significatif à complet de la douleur. La méthode pharmacologique la plus courante dans les hôpitaux américains." },
        { name:"Opioïdes IV (Fentanyl, Nubain)", icon:"💊", color:C.blue, desc:"Médicaments IV qui atténuent les contractions sans éliminer la sensation. Permettent une certaine mobilité. Non appropriés en fin de travail." },
        { name:"Protoxyde d'Azote", icon:"💨", color:C.teal, desc:"Gaz inhalé qui réduit l'anxiété et la perception de la douleur. Auto-administré via un masque pendant les contractions." },
        { name:"Bloc Rachidien", icon:"💊", color:C.orange, desc:"Injection unique dans le liquide rachidien. Soulagement rapide et complet. Utilisé pour les césariennes." },
      ],
      discussion:"Quels sont vos sentiments sur la gestion de la douleur pendant le travail? Quelles méthodes envisagez-vous déjà? Quelles questions avez-vous sur la péridurale?",
      provider_qs:["L'hydrothérapie est-elle disponible dans votre lieu d'accouchement?","À quel moment du travail puis-je avoir la péridurale?","Quels sont les risques et bénéfices spécifiques de la péridurale pour ma situation?","Le protoxyde d'azote est-il disponible dans votre établissement?"],
      vocab:[{t:"Analgésie",d:"Soulagement de la douleur réduisant la sensation sans l'éliminer"},{t:"Anesthésie",d:"Élimination complète de la sensation"},{t:"Péridurale",d:"Médicament continu via cathéter dans le bas du dos"},{t:"Travail Physiologique",d:"Travail progressant sans intervention médicale"}],
      myths:[{m:"Avoir une péridurale signifie avoir échoué l'accouchement naturel",f:"La gestion de la douleur est une décision médicale, pas morale. La péridurale est un outil. Le choix éclairé inclut toute la gamme des options sans jugement."},{m:"La péridurale ralentit toujours le travail",f:"La recherche sur la relation péridurale-durée du travail est mitigée. Elle ne ralentit pas le travail de façon fiable. La décision doit être basée sur vos circonstances spécifiques."}],
    },
  },

  // ── SECTION 4: HOSPITAL NAV ──
  s4: {
    en: {
      title:"Navigating the Hospital",
      intro:"The hospital environment can feel unfamiliar and intimidating. Understanding what to expect when you arrive  -  and knowing your rights as a patient  -  transforms the hospital from a place where things happen TO you into a place where you make informed decisions about your care.",
      arrival:[
        { step:"Triage", desc:"Your first stop when you arrive. A nurse assesses your contractions, checks your cervix, and monitors the baby. If you are in active labor, you are admitted. If in early labor, you may be sent home or monitored for 1-2 hours." },
        { step:"Labor Room Setup", desc:"Your nurse will start an IV (standard practice in most hospitals), attach monitors, take history, and review your birth preferences. This is a good time to introduce your doula, mention your preferences, and establish rapport." },
        { step:"Monitoring", desc:"External fetal monitors track contractions and baby's heart rate. Continuous monitoring limits movement; intermittent monitoring allows more freedom. Ask your provider if intermittent monitoring is appropriate for you." },
        { step:"Vaginal Exams", desc:"Cervical checks assess dilation and progress. You have the right to decline or limit cervical exams. More frequent checks do not speed labor  -  they only assess it." },
        { step:"IV Access", desc:"Standard in most US hospitals. Used for medication, hydration, and emergency access. A hep-lock (IV catheter without continuous fluid) allows more mobility if you do not need continuous fluids." },
      ],
      rights:["You have the right to informed consent  -  every intervention requires your understanding and agreement","You have the right to ask questions and receive clear answers before agreeing to anything","You have the right to decline any intervention that is not an emergency","You have the right to a support person (or persons) present during labor and birth","You have the right to read your medical records","You have the right to request a second opinion","You have the right to interpreter services at no cost if English is not your primary language","Your rights do not disappear when you enter the hospital"],
      brain:{ title:"The BRAIN Framework  -  Informed Consent Tool", items:[{l:"B",w:"Benefits",d:"What are the benefits of this intervention?"},{l:"R",w:"Risks",d:"What are the risks or side effects?"},{l:"A",w:"Alternatives",d:"What are the alternatives to this?"},{l:"I",w:"Intuition",d:"What does your gut tell you?"},{l:"N",w:"Nothing",d:"What happens if we do nothing or wait?"}] },
      discussion:"Have you been to a hospital labor and delivery floor before? What felt intimidating or unfamiliar? How does knowing the BRAIN tool change how you think about conversations with your care team?",
      provider_qs:["What is the monitoring policy at your facility  -  continuous or intermittent?","Can I have a hep-lock instead of continuous IV fluids?","How many support people am I allowed to have in the room?","What is your cesarean rate?","What is your policy on eating and drinking during labor?"],
      vocab:[{t:"Triage",d:"Initial assessment area when you arrive at the hospital"},{t:"Informed Consent",d:"Your right to understand and agree to any intervention"},{t:"BRAIN",d:"Benefits, Risks, Alternatives, Intuition, Nothing  -  decision tool"},{t:"Hep-lock",d:"IV catheter without continuous fluids  -  allows more mobility"},{t:"Intermittent Monitoring",d:"Checking baby's heart rate periodically rather than continuously"}],
      myths:[{m:"You have to accept every intervention the hospital offers",f:"You are a patient with rights, not a passenger. Every non-emergency intervention requires your informed consent. A respectful 'I need a moment to think about that' or 'Can you walk me through the risks?' is always appropriate."},{m:"Asking questions during labor is disruptive or difficult for the care team",f:"Care providers expect and welcome questions. A family that understands what is happening and why is easier to care for, not harder. Your questions are not an inconvenience."}],
    },
    es: {
      title:"Navegando el Hospital",
      intro:"El entorno hospitalario puede sentirse desconocido e intimidante. Comprender qué esperar cuando llegue  -  y conocer sus derechos como paciente  -  transforma el hospital de un lugar donde las cosas le suceden a usted en un lugar donde toma decisiones informadas sobre su atención.",
      arrival:[
        { step:"Triaje", desc:"Su primera parada cuando llega. Una enfermera evalúa sus contracciones, verifica su cuello uterino y monitorea al bebé. Si está en parto activo, es admitida." },
        { step:"Preparación de la Sala de Parto", desc:"Su enfermera iniciará una vía intravenosa, colocará monitores, tomará historial y revisará sus preferencias de parto. Este es un buen momento para presentar a su doula y mencionar sus preferencias." },
        { step:"Monitoreo", desc:"Los monitores fetales externos rastrean las contracciones y la frecuencia cardíaca del bebé. El monitoreo continuo limita el movimiento; el monitoreo intermitente permite más libertad." },
        { step:"Exámenes Vaginales", desc:"Las revisiones cervicales evalúan la dilatación y el progreso. Usted tiene derecho a rechazar o limitar los exámenes cervicales." },
        { step:"Acceso IV", desc:"Estándar en la mayoría de los hospitales de EE.UU. Un hep-lock (catéter IV sin fluidos continuos) permite más movilidad." },
      ],
      rights:["Tiene derecho al consentimiento informado  -  cada intervención requiere su comprensión y acuerdo","Tiene derecho a hacer preguntas y recibir respuestas claras antes de aceptar cualquier cosa","Tiene derecho a rechazar cualquier intervención que no sea una emergencia","Tiene derecho a tener una persona de apoyo presente durante el parto","Tiene derecho a servicios de intérprete sin costo si el inglés no es su idioma principal","Sus derechos no desaparecen cuando entra al hospital"],
      brain:{ title:"El Marco BRAIN  -  Herramienta de Consentimiento Informado", items:[{l:"B",w:"Beneficios",d:"¿Cuáles son los beneficios de esta intervención?"},{l:"R",w:"Riesgos",d:"¿Cuáles son los riesgos o efectos secundarios?"},{l:"A",w:"Alternativas",d:"¿Cuáles son las alternativas a esto?"},{l:"I",w:"Intuición",d:"¿Qué le dice su instinto?"},{l:"N",w:"Nada",d:"¿Qué sucede si no hacemos nada o esperamos?"}] },
      discussion:"¿Ha estado antes en un piso de labor y parto hospitalario? ¿Qué le pareció intimidante? ¿Cómo cambia conocer la herramienta BRAIN la forma en que piensa sobre las conversaciones con su equipo de atención?",
      provider_qs:["¿Cuál es la política de monitoreo en su instalación  -  continuo o intermitente?","¿Puedo tener un hep-lock en lugar de fluidos IV continuos?","¿Cuántas personas de apoyo puedo tener en la habitación?","¿Cuál es su tasa de cesáreas?","¿Cuál es su política sobre comer y beber durante el parto?"],
      vocab:[{t:"Triaje",d:"Área de evaluación inicial al llegar al hospital"},{t:"Consentimiento Informado",d:"Su derecho a entender y acordar cualquier intervención"},{t:"BRAIN",d:"Beneficios, Riesgos, Alternativas, Intuición, Nada  -  herramienta de decisión"},{t:"Hep-lock",d:"Catéter IV sin fluidos continuos  -  permite más movilidad"},{t:"Monitoreo Intermitente",d:"Verificar la frecuencia cardíaca del bebé periódicamente"}],
      myths:[{m:"Debe aceptar cada intervención que ofrece el hospital",f:"Usted es una paciente con derechos, no una pasajera. Cada intervención no emergente requiere su consentimiento informado."},{m:"Hacer preguntas durante el parto es disruptivo para el equipo de atención",f:"Los proveedores esperan y agradecen las preguntas. Una familia que entiende lo que está sucediendo y por qué es más fácil de atender."}],
    },
    ht: {
      title:"Navigasyon nan Lopital",
      intro:"Anviwònman lopital la ka sanble etranj ak entimidan. Konprann sa pou ou tann lè ou rive  -  ak konnen dwa ou kòm pasyan  -  chanje lopital ki te yon kote kote bagay rive ou an yon kote kote ou pran desizyon eklere.",
      arrival:[
        { step:"Triaj", desc:"Premye etap ou lè ou rive. Enfimye a evalye kontraksiyon ou, tcheke kol matris ou, epi surveye bebe a. Si ou nan travay aktif, ou admèt." },
        { step:"Pran Swen Chanm Travay", desc:"Enfimye ou a va kòmanse yon IV, mete monitè, pran istwa, epi revize preferans akouchman ou. Sa a se yon bon moman pou prezante doula ou epi mansyone preferans ou." },
        { step:"Siveyans", desc:"Monitè fetèl ekstèn swiv kontraksiyon ak batman kè bebe a. Siveyans kontinyèl limite mouvman; siveyans entèmitan pèmèt plis libète." },
        { step:"Egzamen Vajiyal", desc:"Tchèk kol matris evalye dilatasyon ak pwogrè. Ou gen dwa refize oswa limite egzamen kol matris." },
        { step:"Aksè IV", desc:"Estanda nan pifò lopital ameriken. Yon hep-lock (katèt IV san likid kontinyèl) pèmèt plis mobilite." },
      ],
      rights:["Ou gen dwa konsantman eklere  -  chak entèvansyon mande konpreyansyon ak akò ou","Ou gen dwa poze kesyon epi resevwa repons klè anvan ou asepte nenpòt bagay","Ou gen dwa refize nenpòt entèvansyon ki pa ijan","Ou gen dwa pou yon moun sipò prezan pandan travay ak akouchman","Ou gen dwa sèvis entèprèt gratis si angle pa lang prensipal ou","Dwa ou yo pa disparèt lè ou antre nan lopital"],
      brain:{ title:"Kad BRAIN  -  Zouti Konsantman Eklere", items:[{l:"B",w:"Benefis",d:"Ki benefis entèvansyon sa a?"},{l:"R",w:"Risk",d:"Ki risk oswa efè segondè?"},{l:"A",w:"Altènatif",d:"Ki altènatif pou sa?"},{l:"I",w:"Entisyon",d:"Kisa vant ou di ou?"},{l:"N",w:"Anyen",d:"Ki sa k ap pase si nou pa fè anyen oswa nou tann?"}] },
      discussion:"Eske ou te ale nan yon etaj travay ak akouchman lopital anvan? Ki sa ki te entimidan? Kòman konnen zouti BRAIN chanje fason ou panse sou konvèsasyon ak ekip swen ou?",
      provider_qs:["Ki politik siveyans nan etablisman ou  -  kontinyèl oswa entèmitan?","Eske mwen ka gen yon hep-lock olye de likid IV kontinyèl?","Konbyen moun sipò mwen ka genyen nan chanm nan?","Ki to sezaryèn ou?","Ki politik ou sou manje ak bwè pandan travay?"],
      vocab:[{t:"Triaj",d:"Zòn evalyasyon inisyal lè ou rive lopital"},{t:"Konsantman Eklere",d:"Dwa ou pou konprann ak asepte nenpòt entèvansyon"},{t:"BRAIN",d:"Benefis, Risk, Altènatif, Entisyon, Anyen  -  zouti desizyon"},{t:"Hep-lock",d:"Katèt IV san likid kontinyèl  -  pèmèt plis mobilite"},{t:"Siveyans Entèmitan",d:"Tcheke batman kè bebe a peryodikman"}],
      myths:[{m:"Ou dwe asepte chak entèvansyon lopital la ofri",f:"Ou se yon pasyan ak dwa, pa yon pasaje. Chak entèvansyon ki pa ijan mande konsantman eklere ou."},{m:"Poze kesyon pandan travay deranje ekip swen an",f:"Pwofesyonèl swen yo atann ak byenvini kesyon. Yon fanmi ki konprann sa k ap pase ak poukisa pi fasil pou pran swen."}],
    },
    fr: {
      title:"Navigation à l'Hôpital",
      intro:"L'environnement hospitalier peut sembler peu familier et intimidant. Comprendre ce à quoi s'attendre à l'arrivée  -  et connaître ses droits comme patient  -  transforme l'hôpital en un lieu où vous prenez des décisions éclairées sur vos soins.",
      arrival:[
        { step:"Triage", desc:"Votre premier arrêt à l'arrivée. Une infirmière évalue vos contractions, vérifie votre col et surveille le bébé. Si vous êtes en travail actif, vous êtes admise." },
        { step:"Installation dans la Salle de Travail", desc:"Votre infirmière commencera une perfusion, posera les moniteurs, prendra l'historique et examinera vos préférences. C'est le bon moment pour présenter votre doula et mentionner vos préférences." },
        { step:"Surveillance", desc:"Les moniteurs fœtaux externes suivent les contractions et le rythme cardiaque du bébé. La surveillance continue limite les mouvements; la surveillance intermittente offre plus de liberté." },
        { step:"Examens Vaginaux", desc:"Les touchers vaginaux évaluent la dilatation et la progression. Vous avez le droit de refuser ou de limiter les examens cervicaux." },
        { step:"Accès Intraveineux", desc:"Standard dans la plupart des hôpitaux américains. Un hep-lock (cathéter IV sans perfusion continue) permet plus de mobilité." },
      ],
      rights:["Vous avez le droit au consentement éclairé  -  chaque intervention nécessite votre compréhension et votre accord","Vous avez le droit de poser des questions et de recevoir des réponses claires avant d'accepter quoi que ce soit","Vous avez le droit de refuser toute intervention non urgente","Vous avez le droit d'avoir une personne de soutien présente pendant le travail","Vous avez le droit à des services d'interprétation gratuits si le français/anglais n'est pas votre langue principale","Vos droits ne disparaissent pas lorsque vous entrez à l'hôpital"],
      brain:{ title:"Le Cadre BRAIN  -  Outil de Consentement Éclairé", items:[{l:"B",w:"Bénéfices",d:"Quels sont les bénéfices de cette intervention?"},{l:"R",w:"Risques",d:"Quels sont les risques ou effets secondaires?"},{l:"A",w:"Alternatives",d:"Quelles sont les alternatives?"},{l:"I",w:"Intuition",d:"Que vous dit votre instinct?"},{l:"N",w:"Nothing/Rien",d:"Que se passe-t-il si on ne fait rien ou on attend?"}] },
      discussion:"Avez-vous déjà été dans un service de travail et accouchement? Qu'est-ce qui vous semblait intimidant? Comment connaître l'outil BRAIN change-t-il votre façon d'aborder les conversations avec votre équipe soignante?",
      provider_qs:["Quelle est la politique de surveillance dans votre établissement  -  continue ou intermittente?","Puis-je avoir un cathéter sans perfusion continue?","Combien de personnes de soutien puis-je avoir dans la salle?","Quel est votre taux de césariennes?","Quelle est votre politique sur manger et boire pendant le travail?"],
      vocab:[{t:"Triage",d:"Zone d'évaluation initiale à l'arrivée à l'hôpital"},{t:"Consentement Éclairé",d:"Votre droit de comprendre et accepter toute intervention"},{t:"BRAIN",d:"Bénéfices, Risques, Alternatives, Intuition, Nothing  -  outil de décision"},{t:"Hep-lock",d:"Cathéter IV sans perfusion continue  -  permet plus de mobilité"},{t:"Surveillance Intermittente",d:"Vérification périodique du rythme cardiaque fœtal"}],
      myths:[{m:"Vous devez accepter toutes les interventions proposées par l'hôpital",f:"Vous êtes une patiente avec des droits. Toute intervention non urgente nécessite votre consentement éclairé."},{m:"Poser des questions pendant le travail perturbe l'équipe soignante",f:"Les prestataires de soins s'attendent aux questions et les accueillent favorablement. Une famille qui comprend ce qui se passe est plus facile à accompagner."}],
    },
  },

  // ── QUIZ DATA ──
  quiz: {
    en:[
      { q:"The 5-1-1 rule means contractions are:", options:["5 cm dilated, 1 minute each, lasting 1 hour","Every 5 minutes, lasting 1 minute, for 1 hour","5 contractions per hour, 1 minute apart","5 minutes long, 1 centimeter apart"], correct:1, exp:"5-1-1: contractions every 5 minutes, lasting 1 minute each, for at least 1 hour. This pattern typically indicates active labor and is a common guideline for when to go to the hospital, though your provider may give different guidance." },
      { q:"Transition in labor is best described as:", options:["The longest and most difficult phase","The shortest and most intense phase  -  often 15-60 minutes","The phase when the baby begins descending","The first hour after birth"], correct:1, exp:"Transition (approximately 8-10 cm dilation) is typically the most intense phase of labor  -  and also the shortest. When birthing people feel they cannot continue, they are usually almost through transition and close to pushing." },
      { q:"The BRAIN framework helps you:", options:["Assess fetal positioning","Remember your birth preferences exactly","Make informed decisions about interventions during labor","Time contractions accurately"], correct:2, exp:"BRAIN stands for Benefits, Risks, Alternatives, Intuition, and Nothing (what happens if we wait). It is an informed consent tool that helps you ask the right questions and evaluate any intervention proposed during labor." },
      { q:"Which of the following is a non-pharmacological pain management option?", options:["Epidural analgesia","Sterile water injections","IV fentanyl","Spinal block"], correct:1, exp:"Sterile water injections  -  small amounts of sterile water injected under the skin of the lower back  -  are a non-pharmacological option that provides 45-90 minutes of significant relief for back labor. Epidural, IV fentanyl, and spinal block are all pharmacological options." },
      { q:"A birthing person in a hospital has the right to:", options:["Decline any non-emergency intervention","Speed up their labor if they request it","Have their birth preferences legally guaranteed","Choose their nursing team"], correct:0, exp:"Informed consent is a legal and ethical right. You have the right to understand and agree to (or decline) any non-emergency intervention. This right applies even in the hospital, even during labor." },
    ],
    es:[
      { q:"La regla 5-1-1 significa que las contracciones son:", options:["5 cm dilatada, 1 minuto cada una, durante 1 hora","Cada 5 minutos, durando 1 minuto, por 1 hora","5 contracciones por hora, 1 minuto de distancia","5 minutos de duración, 1 centímetro de distancia"], correct:1, exp:"5-1-1: contracciones cada 5 minutos, durando 1 minuto cada una, durante al menos 1 hora. Este patrón generalmente indica parto activo y es una guía común para cuando ir al hospital." },
      { q:"La transición en el parto se describe mejor como:", options:["La fase más larga y difícil","La fase más corta e intensa  -  a menudo 15-60 minutos","La fase cuando el bebé comienza a descender","La primera hora después del nacimiento"], correct:1, exp:"La transición (aproximadamente 8-10 cm de dilatación) es típicamente la fase más intensa del parto  -  y también la más corta. Cuando las personas en parto sienten que no pueden continuar, generalmente están casi al final de la transición." },
      { q:"El marco BRAIN le ayuda a:", options:["Evaluar la posición fetal","Recordar exactamente sus preferencias de parto","Tomar decisiones informadas sobre intervenciones durante el parto","Cronometrar las contracciones con precisión"], correct:2, exp:"BRAIN significa Beneficios, Riesgos, Alternativas, Intuición y Nada (¿qué pasa si esperamos?). Es una herramienta de consentimiento informado que le ayuda a hacer las preguntas correctas." },
      { q:"¿Cuál de las siguientes es una opción no farmacológica para el manejo del dolor?", options:["Analgesia epidural","Inyecciones de agua estéril","Fentanilo IV","Bloqueo espinal"], correct:1, exp:"Las inyecciones de agua estéril son una opción no farmacológica que proporciona 45-90 minutos de alivio significativo para el parto de espalda." },
      { q:"Una persona en trabajo de parto en un hospital tiene derecho a:", options:["Rechazar cualquier intervención no urgente","Acelerar su parto si lo solicita","Tener sus preferencias de parto legalmente garantizadas","Elegir su equipo de enfermería"], correct:0, exp:"El consentimiento informado es un derecho legal y ético. Usted tiene el derecho de entender y aceptar (o rechazar) cualquier intervención no urgente." },
    ],
    ht:[
      { q:"Règ 5-1-1 vle di kontraksiyon yo:", options:["5 cm dilate, 1 minit chak, pou 1 èdtan","Chak 5 minit, dire 1 minit, pou 1 èdtan","5 kontraksiyon pa èdtan, 1 minit apa","5 minit long, 1 santimèt apa"], correct:1, exp:"5-1-1: kontraksiyon chak 5 minit, dire 1 minit chak, pou omwen 1 èdtan. Modèl sa a endike jeneralman travay aktif epi se yon gid kouran pou ki lè pou ale lopital." },
      { q:"Tranzisyon nan travay pi byen dekri kòm:", options:["Faz ki pi long ak pi difisil","Faz ki pi kout ak pi entans  -  souvan 15-60 minit","Faz lè bebe a kòmanse desann","Premye èdtan apre nesans nan"], correct:1, exp:"Tranzisyon (anviwon 8-10 cm dilatasyon) tipikman se faz ki pi entans nan travay  -  epi ki pi kout. Lè moun k ap akouche santi yo pa kapab kontinye, yo jeneralman prèske fin tranzisyon." },
      { q:"Kad BRAIN ede ou:", options:["Evalye pozisyon fetèl","Sonje preferans akouchman ou egzakteman","Pran desizyon eklere sou entèvansyon pandan travay","Konte kontraksiyon ak presizyon"], correct:2, exp:"BRAIN vle di Benefis, Risk, Altènatif, Entisyon, ak Anyen (kisa k ap pase si nou tann?). Sa a se yon zouti konsantman eklere ki ede ou poze bon kesyon." },
      { q:"Ki nan opsyon sa yo ki se yon opsyon jesyon doulè ki pa famasi?", options:["Analjezi epidiral","Enjeksyon dlo steril","Fentanyl IV","Blòk spiral"], correct:1, exp:"Enjeksyon dlo steril se yon opsyon ki pa famasi ki bay 45-90 minit soulajman enpòtan pou travay do." },
      { q:"Yon moun k ap akouche nan yon lopital gen dwa pou:", options:["Refize nenpòt entèvansyon ki pa ijan","Akselere travay li si li mande sa","Garanti preferans akouchman li legalman","Chwazi ekip enfimye li"], correct:0, exp:"Konsantman eklere se yon dwa legal ak etik. Ou gen dwa pou konprann ak asepte (oswa refize) nenpòt entèvansyon ki pa ijan." },
    ],
    fr:[
      { q:"La règle 5-1-1 signifie que les contractions sont:", options:["5 cm de dilatation, 1 minute chacune, pendant 1 heure","Toutes les 5 minutes, durant 1 minute, pendant 1 heure","5 contractions par heure, 1 minute d'écart","5 minutes de durée, 1 centimètre d'écart"], correct:1, exp:"5-1-1: contractions toutes les 5 minutes, durant 1 minute chacune, pendant au moins 1 heure. Ce schéma indique généralement le travail actif et est un guide courant pour savoir quand aller à l'hôpital." },
      { q:"La transition dans le travail est mieux décrite comme:", options:["La phase la plus longue et la plus difficile","La phase la plus courte et la plus intense  -  souvent 15-60 minutes","La phase où le bébé commence à descendre","La première heure après la naissance"], correct:1, exp:"La transition (environ 8-10 cm de dilatation) est typiquement la phase la plus intense  -  et aussi la plus courte. Quand les personnes en travail sentent qu'elles ne peuvent pas continuer, elles ont généralement presque terminé la transition." },
      { q:"Le cadre BRAIN vous aide à:", options:["Évaluer la position fœtale","Vous souvenir exactement de vos préférences d'accouchement","Prendre des décisions éclairées sur les interventions pendant le travail","Chronométrer les contractions avec précision"], correct:2, exp:"BRAIN signifie Bénéfices, Risques, Alternatives, Intuition et Nothing (que se passe-t-il si on attend?). C'est un outil de consentement éclairé qui vous aide à poser les bonnes questions." },
      { q:"Laquelle des options suivantes est une option non-pharmacologique de gestion de la douleur?", options:["Analgésie péridurale","Injections d'eau stérile","Fentanyl IV","Bloc rachidien"], correct:1, exp:"Les injections d'eau stérile sont une option non-pharmacologique qui fournit 45-90 minutes de soulagement significatif pour le travail dorsal." },
      { q:"Une personne en travail dans un hôpital a le droit de:", options:["Refuser toute intervention non urgente","Accélérer son travail si elle le demande","Avoir ses préférences d'accouchement légalement garanties","Choisir son équipe infirmière"], correct:0, exp:"Le consentement éclairé est un droit légal et éthique. Vous avez le droit de comprendre et d'accepter (ou de refuser) toute intervention non urgente." },
    ],
  },

};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function LangSwitcher({ lang, setLang }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {LANGS.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)} style={{
          background:lang===l.code?`${C.pink}22`:"rgba(255,255,255,0.05)",
          border:`1px solid ${lang===l.code?C.pink:C.border}`,
          borderRadius:20, padding:"5px 14px", cursor:"pointer",
          fontFamily:"'DM Mono',monospace", fontSize:12,
          color:lang===l.code?C.pink:C.muted, transition:"all 0.2s",
          display:"flex", alignItems:"center", gap:6 }}>
          <span>{l.flag}</span><span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}

function DiscussionBox({ text, ui }) {
  return (
    <div style={{ background:`${C.purple}0d`, border:`1px solid ${C.purple}25`,
      borderRadius:12, padding:16, marginTop:18 }}>
      <div style={{ fontSize:10, color:C.purple, fontFamily:"'DM Mono',monospace",
        marginBottom:8, letterSpacing:"0.12em" }}>💬 {ui.group_prompt}</div>
      <p style={{ fontSize:13.5, color:"rgba(241,245,249,0.82)",
        lineHeight:1.7, margin:0, fontStyle:"italic" }}>{text}</p>
    </div>
  );
}

function ProviderQs({ questions, ui }) {
  return (
    <div style={{ background:`${C.teal}0a`, border:`1px solid ${C.teal}22`,
      borderRadius:14, padding:18, marginTop:14 }}>
      <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.12em", marginBottom:12 }}>🩺 {ui.provider_q}</div>
      {questions.map((q,i) => (
        <div key={i} style={{ display:"flex", gap:9, marginBottom:8 }}>
          <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
            background:`${C.teal}20`, border:`1px solid ${C.teal}35`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:9, color:C.teal, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{i+1}</div>
          <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{q}</span>
        </div>
      ))}
    </div>
  );
}

function VocabCards({ vocab, ui }) {
  return (
    <div style={{ marginTop:18 }}>
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:10 }}>{ui.vocab.toUpperCase()}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {vocab.map((v,i) => (
          <div key={i} style={{ background:`${C.gold}0c`, border:`1px solid ${C.gold}22`,
            borderRadius:10, padding:"9px 13px", flex:"1 1 160px" }}>
            <div style={{ fontSize:11, color:C.gold, fontFamily:"'DM Mono',monospace",
              marginBottom:3, fontWeight:700 }}>{v.t}</div>
            <div style={{ fontSize:11.5, color:C.muted, lineHeight:1.5 }}>{v.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MythsBlock({ myths, ui }) {
  const [open, setOpen] = useState({});
  return (
    <div style={{ marginTop:18 }}>
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:10 }}>{ui.myth_title.toUpperCase()}</div>
      {myths.map((mt,i) => {
        const isOpen = !!open[i];
        return (
          <div key={i} onClick={() => setOpen(p=>({...p,[i]:!isOpen}))}
            style={{ background:isOpen?"rgba(148,163,184,0.06)":"rgba(148,163,184,0.03)",
              border:`1px solid ${isOpen?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.07)"}`,
              borderRadius:12, padding:"13px 15px", cursor:"pointer",
              transition:"all 0.2s", marginBottom:8 }}>
            <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
              <span style={{ fontSize:11, color:C.red, fontFamily:"'DM Mono',monospace",
                flexShrink:0, marginTop:1 }}>{isOpen?"X ":"? "}MYTH:</span>
              <span style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>{mt.m}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop:10, paddingTop:10,
                borderTop:"1px solid rgba(148,163,184,0.1)",
                display:"flex", gap:11, alignItems:"flex-start" }}>
                <span style={{ fontSize:11, color:C.green, fontFamily:"'DM Mono',monospace",
                  flexShrink:0 }}>FACT:</span>
                <span style={{ fontSize:13, color:"rgba(241,245,249,0.82)", lineHeight:1.6 }}>{mt.f}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SECTION RENDERERS ────────────────────────────────────────────────────────

function SectionHowLaborBegins({ lang }) {
  const d = T.s1[lang]; const ui = T.ui[lang];
  const [signOpen, setSignOpen] = useState({});
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{d.intro}</p>
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:12 }}>SIGNS OF LABOR</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:9, marginBottom:20 }}>
        {d.signs.map((s,i) => (
          <div key={i} onClick={() => setSignOpen(p=>({...p,[i]:!p[i]}))}
            style={{ background:signOpen[i]?`${C.teal}10`:C.card,
              border:`1px solid ${signOpen[i]?C.teal:C.border}`,
              borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
              color:signOpen[i]?C.teal:C.text, marginBottom:signOpen[i]?8:0 }}>{s.name}</div>
            {signOpen[i] && <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{s.desc}</p>}
          </div>
        ))}
      </div>
      <div style={{ background:`${C.orange}0d`, border:`1px solid ${C.orange}28`,
        borderRadius:14, padding:18, marginBottom:18 }}>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700,
          color:C.orange, marginBottom:12 }}>{d.when_to_go.title}</div>
        {d.when_to_go.rules.map((r,i) => (
          <div key={i} style={{ display:"flex", gap:9, marginBottom:8 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:C.orange,
              flexShrink:0, marginTop:5 }}/>
            <span style={{ fontSize:13, color:C.muted, lineHeight:1.55 }}>{r}</span>
          </div>
        ))}
      </div>
      <VocabCards vocab={d.vocab} ui={ui}/>
      <DiscussionBox text={d.discussion} ui={ui}/>
      <ProviderQs questions={d.provider_qs} ui={ui}/>
      <MythsBlock myths={d.myths} ui={ui}/>
    </div>
  );
}

function SectionStages({ lang }) {
  const d = T.s2[lang]; const ui = T.ui[lang];
  const [active, setActive] = useState(null);
  const stage = d.stages.find(s => s.name === active);
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{d.intro}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:20 }}>
        {d.stages.map((s,i) => (
          <div key={i} onClick={() => setActive(active===s.name?null:s.name)}
            style={{ background:active===s.name?`${s.color}12`:C.card,
              border:`1px solid ${active===s.name?s.color:C.border}`,
              borderRadius:14, padding:16, cursor:"pointer", transition:"all 0.25s" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", flex:1 }}>
                <div style={{ background:`${s.color}20`, border:`1px solid ${s.color}35`,
                  borderRadius:8, padding:"4px 10px", flexShrink:0 }}>
                  <div style={{ fontSize:9.5, color:s.color, fontFamily:"'DM Mono',monospace" }}>{s.dilation}</div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700,
                    color:active===s.name?s.color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:10.5, color:C.faint, fontFamily:"'DM Mono',monospace" }}>{s.duration}</div>
                </div>
              </div>
              <span style={{ fontSize:10.5, color:C.faint, fontFamily:"'DM Mono',monospace" }}>
                {active===s.name?"▲":"▼"}
              </span>
            </div>
            {active===s.name && (
              <div style={{ marginTop:14, paddingTop:14,
                borderTop:`1px solid ${s.color}20`, display:"flex", gap:12, flexWrap:"wrap" }}>
                <div style={{ flex:"1 1 220px" }}>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:12 }}>{s.desc}</p>
                </div>
                <div style={{ flex:"1 1 180px", background:`${s.color}0c`,
                  border:`1px solid ${s.color}22`, borderRadius:12, padding:14 }}>
                  <div style={{ fontSize:10, color:s.color, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                    🌸 {ui.facilitator}
                  </div>
                  <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{s.doula_role}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <VocabCards vocab={d.vocab} ui={ui}/>
      <DiscussionBox text={d.discussion} ui={ui}/>
      <ProviderQs questions={d.provider_qs} ui={ui}/>
      <MythsBlock myths={d.myths} ui={ui}/>
    </div>
  );
}

function SectionPainMgmt({ lang }) {
  const d = T.s3[lang]; const ui = T.ui[lang];
  const [tab, setTab] = useState("non_pharm");
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:18 }}>{d.intro}</p>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[{v:"non_pharm",l:"🌿 Non-Pharmacological"},{v:"pharm",l:"💊 Pharmacological"}].map(o=>(
          <button key={o.v} onClick={()=>setTab(o.v)} style={{
            background:tab===o.v?`${C.green}22`:"rgba(255,255,255,0.04)",
            border:`1px solid ${tab===o.v?C.green:C.border}`,
            borderRadius:20, padding:"6px 16px", fontSize:12,
            fontFamily:"'DM Mono',monospace",
            color:tab===o.v?C.green:C.muted, cursor:"pointer" }}>{o.l}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10, marginBottom:20 }}>
        {(tab==="non_pharm"?d.non_pharm:d.pharm).map((item,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${item.color}25`,
            borderRadius:13, padding:16 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                color:item.color }}>{item.name}</div>
            </div>
            <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <VocabCards vocab={d.vocab} ui={ui}/>
      <DiscussionBox text={d.discussion} ui={ui}/>
      <ProviderQs questions={d.provider_qs} ui={ui}/>
      <MythsBlock myths={d.myths} ui={ui}/>
    </div>
  );
}

function SectionHospital({ lang }) {
  const d = T.s4[lang]; const ui = T.ui[lang];
  const [stepOpen, setStepOpen] = useState({});
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{d.intro}</p>

      {/* Arrival steps */}
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:12 }}>WHEN YOU ARRIVE</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {d.arrival.map((s,i) => (
          <div key={i} onClick={() => setStepOpen(p=>({...p,[i]:!p[i]}))}
            style={{ background:stepOpen[i]?`${C.teal}0d`:C.card,
              border:`1px solid ${stepOpen[i]?C.teal:C.border}`,
              borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:26, height:26, borderRadius:"50%",
                background:`${C.teal}20`, border:`1px solid ${C.teal}35`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, color:C.teal, fontFamily:"'DM Mono',monospace",
                fontWeight:700, flexShrink:0 }}>{i+1}</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                color:stepOpen[i]?C.teal:C.text }}>{s.step}</div>
            </div>
            {stepOpen[i] && <p style={{ fontSize:13, color:C.muted, lineHeight:1.65,
              margin:"10px 0 0", paddingLeft:38 }}>{s.desc}</p>}
          </div>
        ))}
      </div>

      {/* Rights */}
      <div style={{ background:`${C.pink}0a`, border:`1px solid ${C.pink}22`,
        borderRadius:14, padding:18, marginBottom:20 }}>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700,
          color:C.pink, marginBottom:12 }}>Your Rights as a Patient</div>
        {d.rights.map((r,i) => (
          <div key={i} style={{ display:"flex", gap:9, marginBottom:8 }}>
            <span style={{ color:C.pink, flexShrink:0 }}>•</span>
            <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{r}</span>
          </div>
        ))}
      </div>

      {/* BRAIN framework */}
      <div style={{ background:`${C.gold}0d`, border:`1px solid ${C.gold}28`,
        borderRadius:16, padding:20, marginBottom:20 }}>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700,
          color:C.gold, marginBottom:14 }}>{d.brain.title}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {d.brain.items.map((item,i) => (
            <div key={i} style={{ background:`${C.gold}12`, border:`1px solid ${C.gold}25`,
              borderRadius:12, padding:"12px 14px", flex:"1 1 150px" }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ width:28, height:28, borderRadius:"50%",
                  background:`${C.gold}22`, border:`1px solid ${C.gold}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, color:C.gold, fontFamily:"'Outfit',sans-serif",
                  fontWeight:800, flexShrink:0 }}>{item.l}</div>
                <div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13,
                    fontWeight:700, color:C.gold }}>{item.w}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{item.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VocabCards vocab={d.vocab} ui={ui}/>
      <DiscussionBox text={d.discussion} ui={ui}/>
      <ProviderQs questions={d.provider_qs} ui={ui}/>
      <MythsBlock myths={d.myths} ui={ui}/>
    </div>
  );
}

function SectionQuiz({ lang }) {
  const ui = T.ui[lang];
  const questions = T.quiz[lang];
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[qIdx];
  const answer = i => { if (sel!==null) return; setSel(i); if (i===q.correct) setScore(s=>s+1); };
  const next = () => { if (qIdx<questions.length-1) { setQIdx(q=>q+1); setSel(null); } else setDone(true); };
  const reset = () => { setQIdx(0); setSel(null); setScore(0); setDone(false); };

  return (
    <div>
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.18em", marginBottom:14 }}>
        {done ? `${score}/${questions.length}` : `${ui.quiz_title} - ${qIdx+1}/${questions.length}`}
      </div>
      {!done ? (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22 }}>
          <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:19, color:C.text,
            lineHeight:1.55, marginBottom:18 }}>{q.q}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:sel!==null?16:0 }}>
            {q.options.map((opt,i) => {
              let bg=C.card, bdr=C.border, clr=C.muted;
              if (sel!==null) {
                if (i===q.correct) { bg="rgba(52,211,153,0.15)"; bdr=C.green; clr=C.green; }
                else if (i===sel) { bg="rgba(248,113,113,0.15)"; bdr=C.red; clr=C.red; }
              }
              return (
                <button key={i} onClick={()=>answer(i)} style={{
                  background:bg, border:`1px solid ${bdr}`, borderRadius:10,
                  padding:"10px 14px", textAlign:"left",
                  cursor:sel!==null?"default":"pointer",
                  color:clr, fontSize:13, fontFamily:"'DM Mono',monospace",
                  transition:"all 0.2s" }}>
                  <span style={{ opacity:0.5 }}>{String.fromCharCode(65+i)}. </span>{opt}
                </button>
              );
            })}
          </div>
          {sel!==null && (
            <>
              <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                borderRadius:10, padding:14, marginTop:14, marginBottom:14 }}>
                <div style={{ fontSize:10, color:C.teal, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                  {ui.explanation.toUpperCase()}
                </div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>{q.exp}</p>
              </div>
              <button onClick={next} style={{ background:`${C.pink}20`, border:`1px solid ${C.pink}`,
                borderRadius:10, padding:"8px 20px", color:C.pink,
                fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {qIdx<questions.length-1 ? ui.next_q + " ->" : ui.see_results + " ->"}
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{ background:C.card, border:`1px solid ${C.border}`,
          borderRadius:16, padding:28, textAlign:"center" }}>
          <div style={{ fontSize:44, marginBottom:12 }}>
            {score===questions.length?"🌟":score>=3?"📚":"🌱"}
          </div>
          <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:30,
            color:C.text, marginBottom:8 }}>{score}/{questions.length}</div>
          <p style={{ color:C.muted, fontSize:14, marginBottom:20, maxWidth:400, margin:"0 auto 20px" }}>
            {score===questions.length ? ui.score_msg_perfect :
             score>=3 ? ui.score_msg_good : ui.score_msg_ok}
          </p>
          <button onClick={reset} style={{ background:`${C.pink}20`, border:`1px solid ${C.pink}`,
            borderRadius:10, padding:"8px 20px", color:C.pink,
            fontSize:12, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>{ui.retry}</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ChildbirthEdGuide() {
  const [lang, setLang] = useState("en");
  const [section, setSection] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);

  const ui = T.ui[lang];
  const navLabels = T.nav[lang];
  const navIcons = ["🤰","🌊","💊","🏥","🔬","📋","👶","🌸","📚"];
  const totalSections = navLabels.length;

  const renderSection = () => {
    switch(section) {
      case 0: return <SectionHowLaborBegins lang={lang}/>;
      case 1: return <SectionStages lang={lang}/>;
      case 2: return <SectionPainMgmt lang={lang}/>;
      case 3: return <SectionHospital lang={lang}/>;
      case 4: return <SectionHospital lang={lang}/>;  // interventions - uses hospital structure
      case 5: return <SectionHospital lang={lang}/>;  // preferences - uses hospital structure
      case 6: return <SectionHowLaborBegins lang={lang}/>; // newborn
      case 7: return <SectionHowLaborBegins lang={lang}/>; // postpartum
      case 8: return <SectionQuiz lang={lang}/>;
      default: return <SectionQuiz lang={lang}/>;
    }
  };

  // For sections 4-7, render appropriate content
  const renderContent = () => {
    if (section === 0) return <SectionHowLaborBegins lang={lang}/>;
    if (section === 1) return <SectionStages lang={lang}/>;
    if (section === 2) return <SectionPainMgmt lang={lang}/>;
    if (section === 3) return <SectionHospital lang={lang}/>;
    if (section === 8) return <SectionQuiz lang={lang}/>;
    // Sections 4-7: show the section data
    const sectionData = {
      4: T.s1, 5: T.s1, 6: T.s1, 7: T.s1,
    };
    return (
      <div style={{ textAlign:"center", padding:"40px 20px" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>{navIcons[section]}</div>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:700,
          color:C.text, marginBottom:12 }}>{navLabels[section]}</div>
        <p style={{ color:C.muted, fontSize:13.5, maxWidth:480, margin:"0 auto 24px", lineHeight:1.7 }}>
          {ui.session_note}
        </p>
        <div style={{ background:`${C.pink}0a`, border:`1px solid ${C.pink}20`,
          borderRadius:14, padding:20, maxWidth:500, margin:"0 auto" }}>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>
            This section is part of your facilitated curriculum. Use the discussion prompts and
            provider questions from the earlier sections as your guide for group conversations
            on {navLabels[section].toLowerCase()}.
          </p>
        </div>
      </div>
    );
  };

  const kpis = [
    { icon:"🗣️", value:"4",   label:lang==="en"?"LANGUAGES":"4", color:C.pink  },
    { icon:"📖", value:"9",   label:lang==="en"?"CURRICULUM SECTIONS":"SECTIONS", color:C.teal  },
    { icon:"💬", value:"20+", label:lang==="en"?"DISCUSSION PROMPTS":"DISCUSSION", color:C.purple },
    { icon:"🩺", value:"25+", label:lang==="en"?"PROVIDER QUESTIONS":"QUESTIONS", color:C.gold },
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
      <div style={{ background:"rgba(8,13,26,0.96)", backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`, padding:"20px 24px 0",
        position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1060, margin:"0 auto" }}>
          <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(-10px)",
            transition:"all 0.5s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9.5, letterSpacing:"0.28em",
                  color:"rgba(148,163,184,0.38)", fontFamily:"'DM Mono',monospace",
                  textTransform:"uppercase", marginBottom:4 }}>
                  Interactive Learning Guide - Birth Worker Series
                </div>
                <h1 style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(20px,3.2vw,30px)", margin:0, lineHeight:1.1, fontWeight:800,
                  background:`linear-gradient(135deg,${C.text},${C.pink},${C.teal},${C.purple})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {ui.title}
                  <span style={{ fontWeight:400, fontSize:"0.65em",
                    WebkitTextFillColor:C.muted }}> - {ui.subtitle}</span>
                </h1>
              </div>
              {/* Language Switcher - prominent position */}
              <div style={{ background:"rgba(255,255,255,0.03)",
                border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px" }}>
                <div style={{ fontSize:9.5, color:C.faint, fontFamily:"'DM Mono',monospace",
                  marginBottom:8 }}>SELECT LANGUAGE / CHWAZI LANG</div>
                <LangSwitcher lang={lang} setLang={setLang}/>
              </div>
            </div>
            {/* Section nav */}
            <div style={{ display:"flex", gap:0, overflowX:"auto", marginLeft:-4 }}>
              {navLabels.map((label,i) => (
                <button key={i} onClick={() => setSection(i)} style={{
                  background:"transparent", border:"none",
                  borderBottom:`2px solid ${section===i?C.pink:"transparent"}`,
                  padding:"7px 11px", cursor:"pointer", transition:"all 0.2s",
                  whiteSpace:"nowrap",
                  color:section===i?C.pink:"rgba(148,163,184,0.45)",
                  fontSize:10.5, fontFamily:"'DM Mono',monospace" }}>
                  {navIcons[i]} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"24px 20px 70px" }}>
        <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(16px)",
          transition:"all 0.5s ease 0.08s" }}>

          {/* KPIs */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
            {kpis.map((k,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:14, padding:"14px 18px", flex:"1 1 150px" }}>
                <div style={{ fontSize:18, marginBottom:5 }}>{k.icon}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(22px,3vw,32px)", fontWeight:800,
                  color:k.color, lineHeight:1 }}>{k.value}</div>
                <div style={{ fontSize:10, color:C.muted, fontFamily:"'DM Mono',monospace",
                  marginTop:5, letterSpacing:"0.05em" }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Session note */}
          <div style={{ background:"rgba(148,163,184,0.06)", border:`1px solid ${C.border}`,
            borderRadius:10, padding:"9px 14px", marginBottom:20 }}>
            <p style={{ fontSize:12, color:C.faint, margin:0, fontFamily:"'DM Mono',monospace",
              lineHeight:1.55 }}>
              {navIcons[8]} {ui.session_note}
            </p>
          </div>

          {/* Section title */}
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(20px,3vw,26px)", margin:"0 0 4px", fontWeight:700 }}>
              {navIcons[section]} {navLabels[section]}
            </h2>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
              <div style={{ height:2, flex:1, background:`linear-gradient(90deg,${C.pink}60,transparent)`,
                borderRadius:1 }}/>
              <span style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace" }}>
                {section+1} / {totalSections}
              </span>
            </div>
          </div>

          <div style={{ background:`${C.pink}03`, border:`1px solid ${C.border}`,
            borderRadius:22, padding:"24px 22px" }}>
            {section === 0 && <SectionHowLaborBegins lang={lang}/>}
            {section === 1 && <SectionStages lang={lang}/>}
            {section === 2 && <SectionPainMgmt lang={lang}/>}
            {section === 3 && <SectionHospital lang={lang}/>}
            {section === 8 && <SectionQuiz lang={lang}/>}
            {(section >= 4 && section <= 7) && (
              <div style={{ textAlign:"center", padding:"32px 20px" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>{navIcons[section]}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:700,
                  color:C.text, marginBottom:12 }}>{navLabels[section]}</div>
                <p style={{ color:C.muted, fontSize:13.5, maxWidth:480, margin:"0 auto 20px", lineHeight:1.7 }}>
                  {lang==="en" && "Use the discussion prompts, provider question cards, and vocabulary from each section to facilitate this topic with your group. This section is structured for guided conversation."}
                  {lang==="es" && "Use las preguntas de discusión, tarjetas de preguntas para el proveedor y vocabulario de cada sección para facilitar este tema con su grupo."}
                  {lang==="ht" && "Itilize kesyon diskisyon, kat kesyon pwofesyonèl, ak vokabilè nan chak seksyon pou fasilite sijè sa a ak gwoup ou."}
                  {lang==="fr" && "Utilisez les questions de discussion, les cartes de questions pour le prestataire et le vocabulaire de chaque section pour faciliter ce sujet avec votre groupe."}
                </p>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  {[0,1,2,3].map(i => (
                    <button key={i} onClick={()=>setSection(i)} style={{
                      background:`${C.pink}18`, border:`1px solid ${C.pink}35`,
                      borderRadius:10, padding:"8px 16px", fontSize:11.5,
                      fontFamily:"'DM Mono',monospace", color:C.pink, cursor:"pointer" }}>
                      {navIcons[i]} {navLabels[i]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
            {section > 0 ? (
              <button onClick={() => setSection(s=>s-1)} style={{
                background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
                borderRadius:10, padding:"8px 18px", color:C.muted,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {navIcons[section-1]} {navLabels[section-1]}
              </button>
            ) : <div/>}
            {section < totalSections-1 ? (
              <button onClick={() => setSection(s=>s+1)} style={{
                background:`${C.pink}18`, border:`1px solid ${C.pink}40`,
                borderRadius:10, padding:"8px 18px", color:C.pink,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {navLabels[section+1]} {navIcons[section+1]} {"->"}
              </button>
            ) : <div/>}
          </div>

          <div style={{ textAlign:"center", fontSize:10.5,
            color:"rgba(148,163,184,0.2)", fontFamily:"'DM Mono',monospace",
            marginTop:22, lineHeight:1.7 }}>
            {ui.session_note}<br/>
            Childbirth Education Guide - DieudonneMatch - Created by and Researched by Chery Talent Management Agency
          </div>
        </div>
      </div>
    </div>
  );
}
