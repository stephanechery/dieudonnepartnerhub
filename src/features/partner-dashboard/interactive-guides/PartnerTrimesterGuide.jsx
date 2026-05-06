import { useState, useEffect } from "react";

const DARK = {
  bg:"#050914", card:"#0f172a", cardAlt:"#111c33",
  border:"rgba(148,163,184,0.16)", borderMed:"rgba(148,163,184,0.26)",
  text:"#f8fafc", muted:"#cbd5e1", faint:"rgba(203,213,225,0.62)",
  accent:"#22d3ee", teal:"#22d3ee", purple:"#d946ef",
  gold:"#a78bfa", green:"#34d399", red:"#fb7185",
  orange:"#60a5fa", blue:"#38bdf8", pink:"#f472b6",
  navBg:"rgba(5,9,20,0.96)", shadow:"0 24px 80px rgba(0,0,0,0.45)",
  inputBg:"rgba(255,255,255,0.06)", toggleBg:"rgba(255,255,255,0.08)",
};
const LIGHT = {
  bg:"#f8fbff", card:"#ffffff", cardAlt:"#eef6ff",
  border:"rgba(15,23,42,0.12)", borderMed:"rgba(15,23,42,0.2)",
  text:"#0f172a", muted:"#334155", faint:"rgba(51,65,85,0.58)",
  accent:"#0891b2", teal:"#0891b2", purple:"#7c3aed",
  gold:"#6d5dfc", green:"#059669", red:"#e11d48",
  orange:"#2563eb", blue:"#0284c7", pink:"#c026d3",
  navBg:"rgba(248,251,255,0.97)", shadow:"0 20px 55px rgba(15,23,42,0.12)",
  inputBg:"rgba(15,23,42,0.04)", toggleBg:"rgba(15,23,42,0.06)",
};

const LANGS = [
  { code:"en", label:"English", flag:"🇺🇸" },
  { code:"es", label:"Español", flag:"🇪🇸" },
  { code:"ht", label:"Kreyol", flag:"🇭🇹" },
  { code:"fr", label:"Français", flag:"🇫🇷" },
];

const UI = {
  en:{ title:"Your Role, Trimester by Trimester", subtitle:"A Partner's Complete Pregnancy Guide",
       tagline:"8 Sections · Partner Education", discussion:"Reflect Together",
       action:"Take Action", avoid:"What to Avoid", tip:"Partner Tip",
       dark_mode:"Dark", light_mode:"Light",
       disclaimer:"Dieudonne Partner Hub · Created by and Researched by Chery Talent Management Agency" },
  es:{ title:"Tu Rol, Trimestre por Trimestre", subtitle:"La Guía Completa del Embarazo para Parejas",
       tagline:"8 Secciones · Educación para Parejas", discussion:"Reflexionen Juntos",
       action:"Toma Acción", avoid:"Qué Evitar", tip:"Consejo para la Pareja",
       dark_mode:"Oscuro", light_mode:"Claro",
       disclaimer:"Dieudonne Partner Hub · Creado e Investigado por Chery Talent Management Agency" },
  ht:{ title:"Wòl Ou, Trimès pa Trimès", subtitle:"Gid Konplè Gwosès pou Patnè",
       tagline:"8 Seksyon · Edikasyon Patnè", discussion:"Reflechi Ansanm",
       action:"Pran Aksyon", avoid:"Sa Pou Evite", tip:"Konsèy pou Patnè",
       dark_mode:"Nwa", light_mode:"Klè",
       disclaimer:"Dieudonne Partner Hub · Kreye pa ak Rechèch pa Chery Talent Management Agency" },
  fr:{ title:"Votre Rôle, Trimestre par Trimestre", subtitle:"Le Guide Complet de la Grossesse pour les Partenaires",
       tagline:"8 Sections · Éducation des Partenaires", discussion:"Réfléchissez Ensemble",
       action:"Passez à l'Action", avoid:"Ce qu'il faut Éviter", tip:"Conseil pour le Partenaire",
       dark_mode:"Sombre", light_mode:"Clair",
       disclaimer:"Dieudonne Partner Hub · Créé et Recherché par Chery Talent Management Agency" },
};

const NAV = {
  en:["Why You Matter","First Trimester","Second Trimester","Third Trimester","Labor Prep","At the Hospital","Common Mistakes","Partner Wellness"],
  es:["Por Qué Importas","Primer Trimestre","Segundo Trimestre","Tercer Trimestre","Preparación para el Parto","En el Hospital","Errores Comunes","Bienestar del Pareja"],
  ht:["Poukisa Ou Enpòtan","Premye Trimès","Dezyèm Trimès","Twazyèm Trimès","Prepare pou Travay","Nan Lopital","Erè Kouran","Byennèt Patnè"],
  fr:["Pourquoi Vous Comptez","Premier Trimestre","Deuxième Trimestre","Troisième Trimestre","Préparation à l'Accouchement","À l'Hôpital","Erreurs Courantes","Bien-être du Partenaire"],
};
const NAV_ICONS = ["💛","🌱","🌿","🌳","🏥","👶","⚠️","🧘"];

const DATA = {
  why:{
    en:{
      title:"Why Your Presence Changes Everything",
      core:"Research is clear: when partners are actively involved during pregnancy, birth outcomes improve. Partners who are present, informed, and emotionally engaged reduce maternal stress hormones, improve satisfaction with the birth experience, and are more likely to form strong early bonds with their baby. You don't need to have all the answers. You need to show up.",
      stats:[
        { value:"28%", label:"Lower stress hormones when partner is actively supportive", color:"green" },
        { value:"2x", label:"More likely to breastfeed successfully with partner support", color:"teal" },
        { value:"40%", label:"Lower postpartum depression risk with engaged partner involvement", color:"blue" },
        { value:"Stronger", label:"Early father-child bond when present at birth and postpartum", color:"gold" },
      ],
      what_she_needs:["To feel like you are going through this with her  -  not watching from the sideline","To know you have read something, learned something, asked a question","To not have to manage your emotions about the pregnancy on top of her own","For practical help, not just offers of help that she has to direct","To be asked how she feels  -  and for you to actually listen to the answer","To feel chosen and supported even when pregnancy makes her feel unlike herself"],
      honest:"Many partners feel sidelined during pregnancy. The appointments feel clinical, the body changes are happening to someone else, and it can be hard to know your role. That feeling is real. But the antidote isn't stepping back  -  it's stepping in. Learning. Attending. Asking. The partner who reads this guide is already doing it right.",
      discussion:"When did you first realize this pregnancy was real for you? What do you want her to know about how you feel? What worries you most about the next several months?",
    },
    es:{
      title:"Por Qué Tu Presencia Cambia Todo",
      core:"La investigación es clara: cuando las parejas se involucran activamente durante el embarazo, los resultados mejoran. Las parejas presentes, informadas y emocionalmente comprometidas reducen las hormonas del estrés materno, mejoran la satisfacción con la experiencia del parto y es más probable que formen vínculos tempranos sólidos con su bebé. No necesitas tener todas las respuestas. Necesitas estar presente.",
      stats:[
        { value:"28%", label:"Menos hormonas de estrés cuando la pareja apoya activamente", color:"green" },
        { value:"2x", label:"Más probabilidad de lactancia exitosa con apoyo de la pareja", color:"teal" },
        { value:"40%", label:"Menor riesgo de depresión postparto con participación activa", color:"blue" },
        { value:"Más fuerte", label:"Vínculo temprano padre-hijo cuando está presente", color:"gold" },
      ],
      what_she_needs:["Sentir que estás pasando por esto con ella","Saber que has leído algo, aprendido algo, hecho una pregunta","No tener que gestionar tus emociones sobre el embarazo además de las suyas","Ayuda práctica, no solo ofertas de ayuda que ella tenga que dirigir","Que le preguntes cómo se siente  -  y que realmente escuches la respuesta"],
      honest:"Muchas parejas se sienten al margen durante el embarazo. Pero el antídoto no es retroceder  -  es involucrarse. Aprender. Asistir. Preguntar. La pareja que lee esta guía ya lo está haciendo bien.",
      discussion:"¿Cuándo te diste cuenta por primera vez de que este embarazo era real para ti? ¿Qué quieres que ella sepa sobre cómo te sientes?",
    },
    ht:{
      title:"Poukisa Prezans Ou Chanje Tout",
      core:"Rechèch la klè: lè patnè yo enplike aktèlman pandan gwosès, rezilta amelyore. Patnè ki prezan, enfòme, ak angaje emosyonèlman diminye òmòn estrès matènèl, amelyore satisfaksyon ak eksperyans akouchman, epi gen plis posibilite pou fòme lyen bonè fò ak bebe yo. Ou pa bezwen gen tout repons yo. Ou bezwen parèt.",
      stats:[
        { value:"28%", label:"Mwens òmòn estrès lè patnè sipòte aktèlman", color:"green" },
        { value:"2x", label:"Plis posibilite pou bay tete avèk sipò patnè", color:"teal" },
        { value:"40%", label:"Mwens risk depresyon apre akouchman ak enplikasyon patnè", color:"blue" },
        { value:"Pi fò", label:"Lyen bonè papa-pitit lè prezan nan akouchman", color:"gold" },
      ],
      what_she_needs:["Santi ou ap pase sa a avèk li  -  pa gade sou bò","Konnen ou li yon bagay, aprann yon bagay, poze yon kesyon","Pa bezwen jere emosyon ou sou gwosès lan anplis pa li yo","Èd pratik, pa sèlman ofri èd li dwe dirije","Mande li kijan li santi li  -  epi reyèlman koute repons lan"],
      honest:"Anpil patnè santi yo sou maren pandan gwosès. Men antidòt la pa fè yon pa dèyè  -  se angaje. Aprann. Asiste. Mande. Patnè ki li gid sa a ap deja fè sa ki kòrèk.",
      discussion:"Ki lè ou te reyalize premye fwa gwosès sa a te reyèl pou ou? Kisa ou vle li konnen sou kijan ou santi ou?",
    },
    fr:{
      title:"Pourquoi Votre Présence Change Tout",
      core:"La recherche est claire: quand les partenaires s'impliquent activement pendant la grossesse, les résultats s'améliorent. Les partenaires présents, informés et engagés émotionnellement réduisent les hormones de stress maternelles, améliorent la satisfaction avec l'expérience de l'accouchement et sont plus susceptibles de former des liens précoces solides avec leur bébé. Vous n'avez pas besoin d'avoir toutes les réponses. Vous avez besoin d'être présent.",
      stats:[
        { value:"28%", label:"Moins d'hormones de stress quand le partenaire soutient activement", color:"green" },
        { value:"2x", label:"Plus de chances d'allaitement réussi avec le soutien du partenaire", color:"teal" },
        { value:"40%", label:"Risque moindre de dépression post-partum avec implication active", color:"blue" },
        { value:"Plus fort", label:"Lien précoce père-enfant quand présent à la naissance", color:"gold" },
      ],
      what_she_needs:["Sentir que vous traversez cela avec elle","Savoir que vous avez lu quelque chose, appris quelque chose, posé une question","Ne pas avoir à gérer vos émotions sur la grossesse en plus des siennes","De l'aide pratique, pas seulement des offres d'aide qu'elle doit diriger","Qu'on lui demande comment elle se sent  -  et que vous écoutiez vraiment"],
      honest:"Beaucoup de partenaires se sentent mis à l'écart pendant la grossesse. Mais l'antidote n'est pas de reculer  -  c'est de s'impliquer. Apprendre. Assister. Demander. Le partenaire qui lit ce guide le fait déjà correctement.",
      discussion:"Quand avez-vous réalisé pour la première fois que cette grossesse était réelle pour vous? Qu'est-ce que vous voulez qu'elle sache sur ce que vous ressentez?",
    },
  },

  t1:{
    en:{
      title:"First Trimester: Weeks 1-13",
      what_shes_going_through:"Her body is undergoing a seismic hormonal shift. Progesterone, estrogen, and hCG surge dramatically. She may feel nauseous  -  sometimes all day, not just in the morning. She's exhausted in a way that sleep doesn't fix. Her emotions may swing quickly. She may not look pregnant yet but feel profoundly different.",
      key_symptoms:["Nausea and vomiting  -  often worst in weeks 6-10","Extreme fatigue that hits without warning","Breast tenderness and sensitivity","Food aversions  -  smells that never bothered her may now trigger nausea","Heightened emotions and anxiety","Frequent urination","Headaches"],
      your_role:[
        { action:"Take over cooking if smells trigger her nausea", icon:"🍳" },
        { action:"Go to the first prenatal appointment  -  all of them if possible", icon:"🏥" },
        { action:"Stop expecting her to entertain, socialize, or perform at previous energy levels", icon:"😴" },
        { action:"Stock snacks she can tolerate  -  crackers, ginger candies, cold foods", icon:"🍪" },
        { action:"Do not tell her she 'doesn't look pregnant'  -  she feels it intensely", icon:"🤐" },
        { action:"Research the pregnancy with her  -  read the same app or book she is reading", icon:"📖" },
        { action:"Handle household tasks she can no longer tolerate (strong smells, heavy lifting)", icon:"🏠" },
        { action:"Let her rest without guilt, commentary, or suggestions to 'push through'", icon:"💤" },
      ],
      avoid:["Complaining about her changed appetite or energy","Telling her she should be excited when she feels terrible","Sharing the news before she is ready","Dismissing her symptoms as 'just pregnancy'","Asking if the baby is yours to joke  -  this lands differently than you think"],
      discussion:"What has surprised you most about the first trimester? What has been hardest for you to understand or accept? What does she need most right now that you haven't figured out how to give yet?",
    },
    es:{
      title:"Primer Trimestre: Semanas 1-13",
      what_shes_going_through:"Su cuerpo está pasando por un cambio hormonal sísmico. Puede sentir náuseas durante todo el día. Está agotada de una manera que el sueño no puede arreglar. Sus emociones pueden cambiar rápidamente. Puede que aún no parezca embarazada pero se siente profundamente diferente.",
      key_symptoms:["Náuseas y vómitos  -  a menudo peores en las semanas 6-10","Fatiga extrema que llega sin aviso","Sensibilidad en los senos","Aversiones a los alimentos y olores","Emociones intensificadas y ansiedad","Micción frecuente"],
      your_role:[
        { action:"Toma el control de cocinar si los olores le provocan náuseas", icon:"🍳" },
        { action:"Ve a la primera cita prenatal  -  todas si es posible", icon:"🏥" },
        { action:"No esperes que done entretena o socialice a los niveles anteriores", icon:"😴" },
        { action:"Ten bocadillos que pueda tolerar: galletas, caramelos de jengibre", icon:"🍪" },
        { action:"Investiga el embarazo con ella  -  lee la misma aplicación o libro", icon:"📖" },
        { action:"Encárgate de las tareas del hogar que ya no puede tolerar", icon:"🏠" },
      ],
      avoid:["Quejarte de su apetito o energía cambiados","Decirle que debería estar emocionada cuando se siente terrible","Compartir la noticia antes de que ella esté lista","Desestimar sus síntomas como 'solo embarazo'"],
      discussion:"¿Qué te ha sorprendido más del primer trimestre? ¿Qué ha sido más difícil de entender o aceptar para ti?",
    },
    ht:{
      title:"Premye Trimès: Semèn 1-13",
      what_shes_going_through:"Kò li ap pase nan yon chanjman òmònal sismik. Li ka santi kè plen tout jounen. Li fatige nan yon fason dòmi pa ka règle. Emosyon li ka chanje vit. Li ka pa parèt ansent toujou men santi pwofondman diferan.",
      key_symptoms:["Kè plen ak vomisman  -  souvan pi mal nan semèn 6-10","Fatig ekstrem ki rive san avètisman","Sansibilite nan tete","Avèsyon manje ak sant","Emosyon ogmante ak enkyetid","Pipi souvan"],
      your_role:[
        { action:"Pran responsablite kwit manje si sant yo deklanchen kè plen li", icon:"🍳" },
        { action:"Ale nan premye vizit prenatal  -  tout si posib", icon:"🏥" },
        { action:"Pa tann li jwenn distraksyon oswa sosyalize nan nivo anvan yo", icon:"😴" },
        { action:"Estoke goute li ka tolere: krakers, bonbon jenjab", icon:"🍪" },
        { action:"Fè rechèch gwosès avèk li  -  li menm aplikasyon oswa liv li ap li", icon:"📖" },
        { action:"Okipe travay kay li pa ka tolere ankò", icon:"🏠" },
      ],
      avoid:["Plenyen sou apeti oswa enèji chanje li","Di li li ta dwe eksitan lè li santi terib","Pataje nouvèl la anvan li pare","Rejte sentòm li kòm 'jis gwosès'"],
      discussion:"Ki sa ki pi sipriz ou nan premye trimès la? Ki sa ki pi difisil pou ou konprann oswa aksepte?",
    },
    fr:{
      title:"Premier Trimestre: Semaines 1-13",
      what_shes_going_through:"Son corps subit un changement hormonal sismique. Elle peut se sentir nauséeuse toute la journée. Elle est épuisée d'une façon que le sommeil ne peut pas corriger. Ses émotions peuvent changer rapidement. Elle ne paraît peut-être pas encore enceinte mais se sent profondément différente.",
      key_symptoms:["Nausées et vomissements  -  souvent pires aux semaines 6-10","Fatigue extrême qui arrive sans avertissement","Sensibilité des seins","Aversions alimentaires et olfactives","Émotions intensifiées et anxiété","Mictions fréquentes"],
      your_role:[
        { action:"Prenez en charge la cuisine si les odeurs déclenchent ses nausées", icon:"🍳" },
        { action:"Allez au premier rendez-vous prénatal  -  tous si possible", icon:"🏥" },
        { action:"Ne vous attendez pas à ce qu'elle divertisse ou socialise comme avant", icon:"😴" },
        { action:"Gardez des collations qu'elle peut tolérer: crackers, bonbons au gingembre", icon:"🍪" },
        { action:"Faites des recherches sur la grossesse avec elle", icon:"📖" },
        { action:"Gérez les tâches ménagères qu'elle ne peut plus tolérer", icon:"🏠" },
      ],
      avoid:["Se plaindre de son appétit ou de son énergie changés","Lui dire qu'elle devrait être enthousiaste quand elle se sent terrible","Partager la nouvelle avant qu'elle soit prête","Minimiser ses symptômes comme 'juste la grossesse'"],
      discussion:"Qu'est-ce qui vous a le plus surpris au premier trimestre? Qu'est-ce qui a été le plus difficile à comprendre ou accepter?",
    },
  },

  t2:{
    en:{
      title:"Second Trimester: Weeks 14-27",
      what_shes_going_through:"For many people, the second trimester brings relief  -  nausea fades, energy returns, and the pregnancy becomes visible. She starts feeling the baby move. This is often when the pregnancy becomes emotionally real for partners too. But body image shifts, round ligament pain, heartburn, and growing anxiety about birth are also present.",
      key_symptoms:["Visible baby bump  -  she may feel self-conscious or proud or both","Baby movement begins (quickening)  -  around weeks 18-22","Round ligament pain  -  sharp pains on the sides of the abdomen","Heartburn and indigestion","Back pain begins","Possible sex drive changes  -  in either direction","Increased emotional investment and anxiety about the future"],
      your_role:[
        { action:"Feel the baby move with her  -  put your hand on her belly when she invites you", icon:"🤲" },
        { action:"Attend the anatomy scan (20-week ultrasound)  -  this is a major milestone", icon:"🔬" },
        { action:"Affirm her changing body  -  with words and presence, not just performance", icon:"💛" },
        { action:"Begin building the nursery or baby space together", icon:"🛏️" },
        { action:"Take a childbirth education class together this trimester", icon:"📚" },
        { action:"Help her research pediatricians and build the care team", icon:"👩‍⚕️" },
        { action:"Have the hard conversations now: birth preferences, parenting values, finances", icon:"💬" },
        { action:"Plan something special together  -  babymoon, date nights, connection time", icon:"💑" },
      ],
      avoid:["Commenting on her weight or size  -  even positively, unless she invites it","Assuming her energy return means everything is 'back to normal'","Skipping the anatomy scan","Postponing the important conversations about birth and parenting"],
      discussion:"Have you felt the baby move yet? What did that feel like? What conversations have you been avoiding that you need to have before the birth?",
    },
    es:{
      title:"Segundo Trimestre: Semanas 14-27",
      what_shes_going_through:"Para muchas personas, el segundo trimestre trae alivio  -  las náuseas desaparecen, la energía regresa y el embarazo se hace visible. Comienza a sentir al bebé moverse. Pero también están presentes los cambios en la imagen corporal, el dolor de ligamento redondo, la acidez y la creciente ansiedad sobre el parto.",
      key_symptoms:["Barriga visible  -  puede sentirse insegura o orgullosa o ambas","Los movimientos del bebé comienzan (alrededor de semanas 18-22)","Dolor de ligamento redondo  -  dolores agudos en los lados del abdomen","Acidez e indigestión","Inicio de dolor de espalda","Posibles cambios en el deseo sexual"],
      your_role:[
        { action:"Siente al bebé moverse con ella cuando te invite", icon:"🤲" },
        { action:"Asiste a la ecografía de anatomía (semana 20)", icon:"🔬" },
        { action:"Afirma su cuerpo cambiante con palabras y presencia", icon:"💛" },
        { action:"Comienza a preparar el espacio del bebé juntos", icon:"🛏️" },
        { action:"Tomen juntos una clase de educación para el parto", icon:"📚" },
        { action:"Ten las conversaciones difíciles ahora: preferencias del parto, valores de crianza", icon:"💬" },
      ],
      avoid:["Comentar su peso o tamaño","Asumir que el regreso de energía significa que todo está 'de vuelta a la normalidad'","Saltarse la ecografía anatómica","Posponer las conversaciones importantes sobre el parto"],
      discussion:"¿Has sentido al bebé moverse? ¿Qué se sintió eso? ¿Qué conversaciones has estado evitando que necesitas tener antes del nacimiento?",
    },
    ht:{
      title:"Dezyèm Trimès: Semèn 14-27",
      what_shes_going_through:"Pou anpil moun, dezyèm trimès la pote soulajman  -  kè plen diminye, enèji tounen, epi gwosès la vin vizib. Li kòmanse santi bebe a deplase. Men chanjman imaj kò, doulè ligaman won, brile lestomak, ak enkyetid sou akouchman prezant tou.",
      key_symptoms:["Vant gwosès vizib","Mouvman bebe kòmanse (semèn 18-22)","Doulè ligaman won","Brile lestomak ak endijestyon","Doulè do kòmanse","Posib chanjman nan dezir seksyèl"],
      your_role:[
        { action:"Santi bebe a deplase avèk li lè li envite ou", icon:"🤲" },
        { action:"Ale nan ekografi anatomi (semèn 20)", icon:"🔬" },
        { action:"Afime kò ki ap chanje li avèk mo ak prezans", icon:"💛" },
        { action:"Kòmanse prepare espas bebe a ansanm", icon:"🛏️" },
        { action:"Pran yon klas edikasyon akouchman ansanm", icon:"📚" },
        { action:"Fè konvèsasyon difisil kounye a: preferans akouchman, valè patènaj", icon:"💬" },
      ],
      avoid:["Komante pwa oswa gwosè li","Sipoze retounen enèji vle di tout bagay 'tounen nòmal'","Manke ekografi anatomi","Remèt konvèsasyon enpòtan sou akouchman"],
      discussion:"Eske ou te santi bebe a deplase deja? Kijan sa te santi? Ki konvèsasyon ou ap evite ki ou bezwen fè anvan akouchman?",
    },
    fr:{
      title:"Deuxième Trimestre: Semaines 14-27",
      what_shes_going_through:"Pour beaucoup, le deuxième trimestre apporte du soulagement  -  les nausées s'estompent, l'énergie revient et la grossesse devient visible. Elle commence à sentir le bébé bouger. Mais les changements d'image corporelle, les douleurs ligamentaires, les brûlures d'estomac et l'anxiété croissante sur l'accouchement sont aussi présents.",
      key_symptoms:["Ventre visible","Les mouvements du bébé commencent (semaines 18-22)","Douleurs ligamentaires rondes","Brûlures d'estomac et indigestion","Début de douleurs dorsales","Possibles changements de libido"],
      your_role:[
        { action:"Sentez le bébé bouger avec elle quand elle vous y invite", icon:"🤲" },
        { action:"Assistez à l'échographie morphologique (semaine 20)", icon:"🔬" },
        { action:"Affirmez son corps qui change avec des mots et de la présence", icon:"💛" },
        { action:"Commencez à préparer l'espace bébé ensemble", icon:"🛏️" },
        { action:"Suivez ensemble un cours de préparation à l'accouchement", icon:"📚" },
        { action:"Ayez maintenant les conversations difficiles: préférences d'accouchement, valeurs parentales", icon:"💬" },
      ],
      avoid:["Commenter son poids ou sa taille","Supposer que le retour d'énergie signifie que tout est 'revenu à la normale'","Manquer l'échographie morphologique","Reporter les conversations importantes sur l'accouchement"],
      discussion:"Avez-vous senti le bébé bouger? Qu'est-ce que c'était? Quelles conversations avez-vous évitées et que vous devez avoir avant la naissance?",
    },
  },

  t3:{
    en:{
      title:"Third Trimester: Weeks 28-40",
      what_shes_going_through:"The third trimester is the home stretch  -  and often the hardest. Her body is carrying significant weight, sleep becomes difficult, and birth anxiety is real. The baby is running out of room. She is likely doing her own internal preparation  -  mentally rehearsing birth, thinking about who she is becoming as a mother, potentially experiencing fear. She needs a partner who is prepared, calm, and actively ready.",
      key_symptoms:["Difficulty sleeping  -  cannot find a comfortable position","Shortness of breath as baby crowds the diaphragm","Swelling in feet, ankles, hands","Braxton Hicks contractions (practice contractions)","Increased back and pelvic pain","Frequent urination returns","Nesting energy  -  strong drive to prepare and organize","Anxiety and emotional intensity about birth and becoming a parent"],
      your_role:[
        { action:"Know the birth plan  -  read it, discuss it, be able to speak to it", icon:"📋" },
        { action:"Prepare the hospital bag together before Week 36", icon:"🎒" },
        { action:"Know the route to the hospital and backup routes", icon:"🗺️" },
        { action:"Learn the 5-1-1 rule for when to go to the hospital", icon:"⏱️" },
        { action:"Help her set up for postpartum recovery at home", icon:"🏠" },
        { action:"Take over as many physical tasks as possible  -  dishes, laundry, groceries", icon:"💪" },
        { action:"Sit with her anxiety  -  do not dismiss it or try to fix it immediately", icon:"🤝" },
        { action:"Make sure your own bags are packed and your job knows about leave plans", icon:"💼" },
      ],
      avoid:["'You're almost there' as if it's a complaint to be managed","Waiting for her to tell you what to do  -  anticipate","Leaving town or being unavailable after Week 36","Underestimating how physically uncomfortable she is"],
      discussion:"Have you read the birth plan? What parts feel unclear or uncomfortable to you? What is your biggest fear about the birth itself? Have you told her that?",
    },
    es:{
      title:"Tercer Trimestre: Semanas 28-40",
      what_shes_going_through:"El tercer trimestre es la recta final  -  y a menudo la más difícil. Su cuerpo carga un peso significativo, el sueño se vuelve difícil y la ansiedad por el parto es real. Necesita una pareja que esté preparada, tranquila y activamente lista.",
      key_symptoms:["Dificultad para dormir","Falta de aliento cuando el bebé presiona el diafragma","Hinchazón en pies, tobillos, manos","Contracciones de Braxton Hicks","Mayor dolor de espalda y pélvico","Energía de nidificación  -  impulso fuerte de preparar","Ansiedad e intensidad emocional sobre el parto"],
      your_role:[
        { action:"Conoce el plan de parto  -  léelo, discútelo, sé capaz de hablar sobre él", icon:"📋" },
        { action:"Prepara la bolsa del hospital juntos antes de la semana 36", icon:"🎒" },
        { action:"Conoce la ruta al hospital y rutas alternativas", icon:"🗺️" },
        { action:"Aprende la regla 5-1-1 para saber cuándo ir al hospital", icon:"⏱️" },
        { action:"Ayúdala a prepararse para la recuperación postparto en casa", icon:"🏠" },
        { action:"Siéntate con su ansiedad  -  no la desestimes ni intentes solucionarla inmediatamente", icon:"🤝" },
      ],
      avoid:["'Ya casi llegas' como si fuera una queja a gestionar","Esperar a que ella te diga qué hacer  -  anticipa","Salir de la ciudad o estar no disponible después de la semana 36"],
      discussion:"¿Has leído el plan de parto? ¿Qué partes te parecen poco claras o incómodas? ¿Cuál es tu mayor miedo sobre el parto?",
    },
    ht:{
      title:"Twazyèm Trimès: Semèn 28-40",
      what_shes_going_through:"Twazyèm trimès la se dènye pati  -  epi souvan pi difisil la. Kò li pote pwa enpòtan, dòmi vin difisil, epi enkyetid sou akouchman reyèl. Li bezwen yon patnè ki pare, trankil, epi aktèlman prèt.",
      key_symptoms:["Difikilte pou dòmi","Souf kout lè bebe pouse dyafragm lan","Anfle nan pye, cheviy, men","Kontraksiyon Braxton Hicks","Plis doulè do ak pelvik","Enèji nesting  -  pouse fò pou prepare","Enkyetid ak entansite emosyonèl sou akouchman"],
      your_role:[
        { action:"Konnen plan akouchman  -  li li, diskite li, kapab pale sou li", icon:"📋" },
        { action:"Prepare sak lopital ansanm anvan Semèn 36", icon:"🎒" },
        { action:"Konnen wout lopital ak wout altènatif", icon:"🗺️" },
        { action:"Aprann règ 5-1-1 pou ki lè pou ale lopital", icon:"⏱️" },
        { action:"Ede li prepare pou rekiperasyon apre akouchman lakay", icon:"🏠" },
        { action:"Chita ak enkyetid li  -  pa rejte li oswa eseye regle li imedyatman", icon:"🤝" },
      ],
      avoid:["'Ou prèske rive' tankou yon plent pou jere","Tann li di ou kisa pou fè  -  antisipe","Kite lavil oswa pa disponib apre Semèn 36"],
      discussion:"Eske ou te li plan akouchman an? Ki pati ki parèt pa klè oswa inkonfortab pou ou? Ki pi gwo pè ou sou akouchman an?",
    },
    fr:{
      title:"Troisième Trimestre: Semaines 28-40",
      what_shes_going_through:"Le troisième trimestre est la dernière ligne droite  -  et souvent la plus difficile. Son corps porte un poids significatif, le sommeil devient difficile et l'anxiété concernant l'accouchement est réelle. Elle a besoin d'un partenaire préparé, calme et activement prêt.",
      key_symptoms:["Difficulté à dormir","Essoufflement quand le bébé comprime le diaphragme","Gonflement des pieds, chevilles, mains","Contractions de Braxton Hicks","Douleurs dorsales et pelviennes accrues","Énergie de nidification  -  forte envie de préparer","Anxiété et intensité émotionnelle sur l'accouchement"],
      your_role:[
        { action:"Connaissez le plan d'accouchement  -  lisez-le, discutez-le", icon:"📋" },
        { action:"Préparez le sac de maternité ensemble avant la semaine 36", icon:"🎒" },
        { action:"Connaissez le chemin vers l'hôpital et les itinéraires alternatifs", icon:"🗺️" },
        { action:"Apprenez la règle 5-1-1 pour savoir quand aller à l'hôpital", icon:"⏱️" },
        { action:"Aidez-la à se préparer pour la récupération post-partum à la maison", icon:"🏠" },
        { action:"Asseyez-vous avec son anxiété  -  ne la rejetez pas ni n'essayez de la résoudre immédiatement", icon:"🤝" },
      ],
      avoid:["'Vous y êtes presque' comme si c'était une plainte à gérer","Attendre qu'elle vous dise quoi faire  -  anticipez","Quitter la ville ou être indisponible après la semaine 36"],
      discussion:"Avez-vous lu le plan d'accouchement? Quelles parties vous semblent peu claires? Quelle est votre plus grande peur concernant l'accouchement?",
    },
  },

  labor_prep:{
    en:{
      title:"Preparing for Labor: Your Homework",
      intro:"Labor support is a skill. Partners who have done zero preparation freeze, panic, or become bystanders. Partners who have done even basic preparation are calmer, more helpful, and better advocates. Here is your minimum preparation list.",
      checklist:[
        { task:"Take a childbirth education class together  -  in person if possible", done:false, priority:"essential" },
        { task:"Read the birth plan at least twice and ask questions about parts you don't understand", done:false, priority:"essential" },
        { task:"Know the name and phone number of the doula if one is hired", done:false, priority:"essential" },
        { task:"Know when to call the provider vs. when to go directly to the hospital", done:false, priority:"essential" },
        { task:"Have the hospital bag packed and in the car by Week 36", done:false, priority:"essential" },
        { task:"Know how to time contractions (5-1-1 rule)", done:false, priority:"essential" },
        { task:"Practice one comfort technique: hip squeeze, back pressure, breathing together", done:false, priority:"high" },
        { task:"Know what an epidural is and when she does or doesn't want to be offered one", done:false, priority:"high" },
        { task:"Know her feelings about induction and cesarean  -  not to argue, but to support informed consent", done:false, priority:"high" },
        { task:"Charge your phone. Bring snacks for yourself. You will be there a long time.", done:false, priority:"practical" },
      ],
      language:[
        { situation:"She says she can't do this", say:"'You ARE doing this. I'm right here. One contraction at a time.'" },
        { situation:"She asks for the epidural you both agreed she didn't want", say:"'Tell me how you feel right now. I'm with you whatever you decide.'" },
        { situation:"You don't know what to do", say:"Nothing. Put your hand on her. Stay close. Breathe with her." },
        { situation:"The nurse or doctor says something that contradicts the birth plan", say:"'Can you walk us through why you're recommending that? We want to understand our options.'" },
      ],
      discussion:"Have you done the items on this list? Which ones feel most intimidating? What would make you feel more prepared?",
    },
    es:{
      title:"Preparándose para el Parto: Tu Tarea",
      intro:"El apoyo durante el parto es una habilidad. Las parejas que no se han preparado se paralizan, entran en pánico o se convierten en espectadores. Las parejas que se han preparado son más tranquilas, más útiles y mejores defensoras.",
      checklist:[
        { task:"Tomar juntos una clase de educación para el parto", done:false, priority:"essential" },
        { task:"Leer el plan de parto al menos dos veces y hacer preguntas", done:false, priority:"essential" },
        { task:"Conocer el número de teléfono de la doula si se contrató una", done:false, priority:"essential" },
        { task:"Saber cuándo llamar al proveedor vs. cuándo ir directamente al hospital", done:false, priority:"essential" },
        { task:"Tener la bolsa del hospital empacada y en el auto para la semana 36", done:false, priority:"essential" },
        { task:"Saber cómo cronometrar las contracciones (regla 5-1-1)", done:false, priority:"essential" },
        { task:"Practicar una técnica de confort: compresión de caderas, presión de espalda", done:false, priority:"high" },
        { task:"Saber cuándo ella quiere o no quiere que le ofrezcan la epidural", done:false, priority:"high" },
      ],
      language:[
        { situation:"Ella dice que no puede hacer esto", say:"'LO ESTÁS haciendo. Estoy aquí. Una contracción a la vez.'" },
        { situation:"Pide la epidural aunque acordaron no quererla", say:"'Dime cómo te sientes ahora mismo. Estoy contigo sea cual sea tu decisión.'" },
        { situation:"No sabes qué hacer", say:"Nada. Pon tu mano en ella. Quédate cerca. Respira con ella." },
        { situation:"El médico dice algo que contradice el plan de parto", say:"'¿Puede explicarnos por qué recomienda eso? Queremos entender nuestras opciones.'" },
      ],
      discussion:"¿Has completado los elementos de esta lista? ¿Cuáles se sienten más intimidantes? ¿Qué te haría sentir más preparado?",
    },
    ht:{
      title:"Prepare pou Travay: Devwa Ou",
      intro:"Sipò pandan travay se yon konpetans. Patnè ki pa fè okenn preparasyon jele, panique, oswa vin temwen. Patnè ki fè menm preparasyon debaz yo pi trankil, plis itil, ak pi bon defansè.",
      checklist:[
        { task:"Pran yon klas edikasyon akouchman ansanm", done:false, priority:"essential" },
        { task:"Li plan akouchman an omwen de fwa epi poze kesyon", done:false, priority:"essential" },
        { task:"Konnen nimewo telefòn doula a si yo te angaje youn", done:false, priority:"essential" },
        { task:"Konnen ki lè pou rele pwofesyonèl kont ki lè pou ale dirèkteman lopital", done:false, priority:"essential" },
        { task:"Sak lopital pakote epi nan machin anvan Semèn 36", done:false, priority:"essential" },
        { task:"Konnen kòman konte kontraksiyon (règ 5-1-1)", done:false, priority:"essential" },
        { task:"Pratike yon teknik konfò: presyon hanch, presyon do", done:false, priority:"high" },
        { task:"Konnen kijan li santi sou epidiral", done:false, priority:"high" },
      ],
      language:[
        { situation:"Li di li pa ka fè sa", say:"'OU AP FÈ LI. Mwen la. Youn kontraksiyon nan yon tan.'" },
        { situation:"Li mande epidiral malgre ou de te dakò li pa vle", say:"'Di mwen kijan ou santi ou kounye a. Mwen avèk ou kèlkeswa desizyon ou pran.'" },
        { situation:"Ou pa konnen kisa pou fè", say:"Anyen. Mete men ou sou li. Rete pre. Respire avèk li." },
        { situation:"Doktè a di yon bagay ki kontredit plan akouchman an", say:"'Èske ou ka eksplike nou poukisa ou rekòmande sa? Nou vle konprann opsyon nou yo.'" },
      ],
      discussion:"Eske ou fè atik yo nan lis sa a? Ki youn ki parèt pi entimidan? Kisa ki ta fè ou santi plis prepare?",
    },
    fr:{
      title:"Se Préparer pour l'Accouchement: Vos Devoirs",
      intro:"Le soutien pendant le travail est une compétence. Les partenaires qui n'ont pas préparé se figent, paniquent ou deviennent des spectateurs. Les partenaires qui ont préparé même les bases sont plus calmes, plus utiles et de meilleurs défenseurs.",
      checklist:[
        { task:"Suivre ensemble un cours de préparation à l'accouchement", done:false, priority:"essential" },
        { task:"Lire le plan d'accouchement au moins deux fois et poser des questions", done:false, priority:"essential" },
        { task:"Connaître le numéro de téléphone de la doula si une a été engagée", done:false, priority:"essential" },
        { task:"Savoir quand appeler le prestataire vs. quand aller directement à l'hôpital", done:false, priority:"essential" },
        { task:"Avoir le sac de maternité préparé et dans la voiture avant la semaine 36", done:false, priority:"essential" },
        { task:"Savoir chronométrer les contractions (règle 5-1-1)", done:false, priority:"essential" },
        { task:"Pratiquer une technique de confort: compression des hanches, pression dorsale", done:false, priority:"high" },
        { task:"Savoir quand elle veut ou ne veut pas que la péridurale lui soit proposée", done:false, priority:"high" },
      ],
      language:[
        { situation:"Elle dit qu'elle ne peut pas faire ça", say:"'Tu LE FAIS. Je suis là. Une contraction à la fois.'" },
        { situation:"Elle demande la péridurale qu'ils avaient décidé de ne pas vouloir", say:"'Dis-moi comment tu te sens maintenant. Je suis avec toi quelle que soit ta décision.'" },
        { situation:"Vous ne savez pas quoi faire", say:"Rien. Posez votre main sur elle. Restez proche. Respirez avec elle." },
        { situation:"Le médecin dit quelque chose qui contredit le plan d'accouchement", say:"'Pouvez-vous nous expliquer pourquoi vous recommandez cela? Nous voulons comprendre nos options.'" },
      ],
      discussion:"Avez-vous accompli les éléments de cette liste? Lesquels vous semblent les plus intimidants? Qu'est-ce qui vous ferait vous sentir plus préparé?",
    },
  },

  hospital:{
    en:{
      title:"At the Hospital: Your Job Description",
      intro:"When labor begins and you walk into that hospital, your role shifts from supporter to active partner. Here is what that actually looks like  -  moment by moment.",
      phases:[
        { phase:"Triage / Admission", color:"teal", icon:"🚪",
          role:"Stay calm  -  your calm is contagious. Know her name, due date, provider name, allergies, and insurance. Have the birth plan ready. Let her speak first when nurses ask questions. Do not let her carry bags." },
        { phase:"Early Labor at Hospital", color:"blue", icon:"🌊",
          role:"Help her move. Change positions every 20-30 minutes. Offer water and ice chips. Time contractions and report changes to the nurse. Keep the room calm  -  dim lights, quiet music if she wants it. Do not scroll your phone visibly." },
        { phase:"Active Labor", color:"purple", icon:"⚡",
          role:"This is your most important window. Be physically close for every contraction. Apply counterpressure if she wants it. Breathe with her. Speak only to encourage  -  not to explain, distract, or minimize. 'You're doing it. I'm right here.' is enough." },
        { phase:"Transition", color:"orange", icon:"🔥",
          role:"Say almost nothing. She may be shaking, overwhelmed, or saying she can't continue. This is transition  -  it means birth is close. Do not panic. Stay closer. 'One more. You're almost there.' Do not leave." },
        { phase:"Pushing", color:"green", icon:"⬇️",
          role:"Follow the lead of the care team and your partner. Hold her leg if asked. Count with her if that helps. Look at her face, not the delivery  -  stay in connection, not spectating. Speak into her strength." },
        { phase:"Immediately After Birth", color:"pink", icon:"💛",
          role:"Let the first moments be hers and the baby's. Facilitate skin-to-skin. Cut the cord if invited. Do not immediately call or text family  -  ask her when she wants that. Take photos she can use. Tell her she was extraordinary." },
      ],
      discussion:"What part of being in the labor room feels most intimidating to you? Have you told her? What do you think she needs most from you in that room?",
    },
    es:{
      title:"En el Hospital: Tu Descripción de Trabajo",
      intro:"Cuando comienza el parto y entras a ese hospital, tu rol cambia de apoyo a pareja activa. Esto es lo que realmente se parece  -  momento a momento.",
      phases:[
        { phase:"Triaje / Admisión", color:"teal", icon:"🚪",
          role:"Mantén la calma  -  tu calma es contagiosa. Ten el plan de parto listo. Déjala hablar primero cuando las enfermeras hagan preguntas. No la dejes cargar bolsas." },
        { phase:"Parto Temprano en el Hospital", color:"blue", icon:"🌊",
          role:"Ayúdala a moverse. Cambia de posición cada 20-30 minutos. Ofrece agua y cubitos de hielo. No uses el teléfono visiblemente." },
        { phase:"Parto Activo", color:"purple", icon:"⚡",
          role:"Esta es tu ventana más importante. Esté físicamente cerca en cada contracción. Aplica contrapresión si ella lo desea. Respira con ella. Habla solo para alentar: 'Lo estás haciendo. Estoy aquí.'" },
        { phase:"Transición", color:"orange", icon:"🔥",
          role:"Di casi nada. Puede estar temblando o diciendo que no puede continuar. Esto es transición  -  significa que el parto está cerca. No te vayas." },
        { phase:"Pujo", color:"green", icon:"⬇️",
          role:"Sigue el liderazgo del equipo de atención y tu pareja. Sostén su pierna si se lo piden. Habla a su fortaleza." },
        { phase:"Inmediatamente Después del Nacimiento", color:"pink", icon:"💛",
          role:"Deja que los primeros momentos sean de ella y el bebé. Facilita el piel con piel. No llames ni envíes mensajes a la familia de inmediato. Dile que fue extraordinaria." },
      ],
      discussion:"¿Qué parte de estar en la sala de parto te parece más intimidante? ¿Se lo has dicho? ¿Qué crees que ella necesita más de ti en esa sala?",
    },
    ht:{
      title:"Nan Lopital: Deskripsyon Travay Ou",
      intro:"Lè travay kòmanse epi ou antre nan lopital sa a, wòl ou chanje de sipòtè a patnè aktif. Sa a se sa sa reyèlman sanble  -  moman pa moman.",
      phases:[
        { phase:"Triaj / Admisyon", color:"teal", icon:"🚪",
          role:"Rete trankil  -  trankil ou kontajye. Gen plan akouchman an prèt. Kite li pale an premye lè enfimye yo poze kesyon. Pa kite li pote sak." },
        { phase:"Travay Bonè nan Lopital", color:"blue", icon:"🌊",
          role:"Ede li deplase. Chanje pozisyon chak 20-30 minit. Ofri dlo ak glas. Pa itilize telefòn ou vizibleman." },
        { phase:"Travay Aktif", color:"purple", icon:"⚡",
          role:"Sa a se fenèt ou ki pi enpòtan. Rete fizikman pre pou chak kontraksiyon. Respire avèk li. Pale sèlman pou ankouraje: 'Ou ap fè li. Mwen la.'" },
        { phase:"Tranzisyon", color:"orange", icon:"🔥",
          role:"Di prèske anyen. Li ka ap tranble oswa di li pa ka kontinye. Sa a se tranzisyon  -  sa vle di akouchman pre. Pa ale." },
        { phase:"Pouse", color:"green", icon:"⬇️",
          role:"Swiv gidans ekip swen ak patnè ou. Kenbe janm li si yo mande. Pale nan fòs li." },
        { phase:"Imedyatman Apre Nesans", color:"pink", icon:"💛",
          role:"Kite premye moman yo pou li ak bebe a. Fasilite po-a-po. Pa rele oswa voye mesaj fanmiy imedyatman. Di li li te ekstraòdinè." },
      ],
      discussion:"Ki pati yo nan chann travay la ki parèt pi entimidan pou ou? Eske ou te di li? Kisa ou panse li bezwen plis nan ou nan chanm sa a?",
    },
    fr:{
      title:"À l'Hôpital: Votre Description de Poste",
      intro:"Quand le travail commence et que vous entrez dans cet hôpital, votre rôle passe de soutien à partenaire actif. Voici ce que ça ressemble vraiment  -  moment par moment.",
      phases:[
        { phase:"Triage / Admission", color:"teal", icon:"🚪",
          role:"Restez calme  -  votre calme est contagieux. Ayez le plan d'accouchement prêt. Laissez-la parler en premier quand les infirmières posent des questions. Ne la laissez pas porter les sacs." },
        { phase:"Travail Précoce à l'Hôpital", color:"blue", icon:"🌊",
          role:"Aidez-la à bouger. Changez de position toutes les 20-30 minutes. Proposez de l'eau et des glaçons. N'utilisez pas votre téléphone visiblement." },
        { phase:"Travail Actif", color:"purple", icon:"⚡",
          role:"C'est votre fenêtre la plus importante. Soyez physiquement proche pour chaque contraction. Respirez avec elle. Parlez seulement pour encourager: 'Tu le fais. Je suis là.'" },
        { phase:"Transition", color:"orange", icon:"🔥",
          role:"Ne dites presque rien. Elle peut trembler ou dire qu'elle ne peut pas continuer. C'est la transition  -  ça signifie que la naissance est proche. Ne partez pas." },
        { phase:"Poussée", color:"green", icon:"⬇️",
          role:"Suivez le lead de l'équipe soignante et de votre partenaire. Tenez sa jambe si on vous le demande. Parlez dans sa force." },
        { phase:"Immédiatement Après la Naissance", color:"pink", icon:"💛",
          role:"Laissez les premiers moments être les siens et ceux du bébé. Facilitez le peau-à-peau. Ne appelez pas ni n'envoyez de messages à la famille immédiatement. Dites-lui qu'elle était extraordinaire." },
      ],
      discussion:"Quelle partie d'être dans la salle de travail vous semble la plus intimidante? Le lui avez-vous dit? De quoi pensez-vous qu'elle a le plus besoin de votre part dans cette salle?",
    },
  },

  mistakes:{
    en:{
      title:"Common Partner Mistakes  -  and How to Course Correct",
      intro:"These are the most common ways partners, with genuinely good intentions, make things harder. None of these make you a bad partner. They make you a normal one. The goal is awareness  -  so you can catch yourself and shift.",
      items:[
        { mistake:"Trying to fix instead of feel", impact:"She does not want her pain solved. She wants to feel accompanied in it.", fix:"Instead of 'Have you tried...', try 'Tell me more about what that's like.'" },
        { mistake:"Comparing her experience to someone else's pregnancy", impact:"Every pregnancy is different. 'My sister sailed through hers' is not helpful information.", fix:"'Your experience is your experience. I'm not comparing you to anyone.'" },
        { mistake:"Making the pregnancy about your feelings", impact:"Your feelings matter  -  but when she shares something hard, that moment is about her.", fix:"Listen first. Process your feelings with a friend, a journal, or a therapist  -  not in her moment." },
        { mistake:"Disappearing into work or stress", impact:"She notices. It reads as abandonment, not busyness.", fix:"Name what's happening: 'Work is intense right now and I know I've been absent. I want to be more present. What do you need?'" },
        { mistake:"Only helping when asked", impact:"She becomes the project manager of her own care. That is exhausting.", fix:"Anticipate. If the dishes aren't done, do them. If she looks tired, offer before she has to ask." },
        { mistake:"Invalidating her fear about birth", impact:"'It'll be fine' shuts down the conversation. She needs to voice the fear.", fix:"'What are you most afraid of? I want to understand.' Then listen without rushing to reassure." },
        { mistake:"Treating the baby's needs as hers to manage", impact:"The message received: this is her job, not ours.", fix:"Own specific tasks  -  'I'll handle the pediatrician research'  -  and follow through without reminders." },
        { mistake:"Not knowing the birth plan", impact:"She cannot advocate for herself in labor if you don't know it. You are her backup.", fix:"Read it. Tonight." },
      ],
      discussion:"Which of these have you done? Which does she wish you would stop doing? What is the single most useful change you could make this week?",
    },
    es:{
      title:"Errores Comunes de las Parejas  -  y Cómo Corregir el Rumbo",
      intro:"Estos son los errores más comunes que cometen las parejas, con genuenamente buenas intenciones, hacen las cosas más difíciles. Ninguno de estos te hace mala pareja. Te hacen normal. El objetivo es la conciencia.",
      items:[
        { mistake:"Intentar solucionar en lugar de sentir", impact:"Ella no quiere que su dolor sea resuelto. Quiere sentirse acompañada en él.", fix:"En lugar de '¿Has probado...?', prueba 'Cuéntame más sobre cómo se siente eso.'" },
        { mistake:"Comparar su experiencia con el embarazo de alguien más", impact:"Cada embarazo es diferente.", fix:"'Tu experiencia es tu experiencia. No te estoy comparando con nadie.'" },
        { mistake:"Hacer que el embarazo gire en torno a tus sentimientos", impact:"Cuando ella comparte algo difícil, ese momento es sobre ella.", fix:"Escucha primero. Procesa tus sentimientos con un amigo o terapeuta, no en su momento." },
        { mistake:"Desaparecer en el trabajo o el estrés", impact:"Ella nota. Se lee como abandono, no como ocupado.", fix:"Nombra lo que está pasando y reconecta activamente." },
        { mistake:"Solo ayudar cuando se le pide", impact:"Ella se convierte en la gestora de proyecto de su propio cuidado.", fix:"Anticipa. Si los platos no están hechos, hazlos." },
        { mistake:"Invalidar su miedo sobre el parto", impact:"'Va a estar bien' cierra la conversación.", fix:"'¿A qué tienes más miedo? Quiero entender.' Luego escucha sin apresurarte a tranquilizarla." },
        { mistake:"No conocer el plan de parto", impact:"Ella no puede abogar por sí misma en el parto si tú no lo conoces.", fix:"Léelo. Esta noche." },
      ],
      discussion:"¿Cuál de estos has hecho? ¿Cuál desearía ella que dejaras de hacer? ¿Cuál es el cambio más útil que podrías hacer esta semana?",
    },
    ht:{
      title:"Erè Kouran Patnè  -  ak Kòman Korije Kou a",
      intro:"Sa yo se erè ki pi kouran patnè yo, ak bon entansyon vrèman, rann bagay yo pi difisil. Okenn nan sa yo pa fè ou yon move patnè. Yo fè ou yon moun nòmal. Objektif la se konsyans.",
      items:[
        { mistake:"Eseye regle olye santi", impact:"Li pa vle doulè li rezoud. Li vle santi yo akonpaye li ladan.", fix:"Olye 'Eske ou te eseye...?', eseye 'Di mwen plis sou kijan sa santi.'" },
        { mistake:"Konpare eksperyans li ak gwosès yon lòt moun", impact:"Chak gwosès diferan.", fix:"'Eksperyans ou se eksperyans ou. Mwen pa konpare ou ak pèsòn.'" },
        { mistake:"Fè gwosès lan tounin sou santi ou", impact:"Lè li pataje yon bagay difisil, moman sa a se pou li.", fix:"Koute an premye. Trete santi ou avèk yon zanmi oswa terapis, pa nan moman pa li." },
        { mistake:"Disparèt nan travay oswa estrès", impact:"Li remake. Li li kòm abandone, pa okipe.", fix:"Nonmen sa k ap pase epi rekonekte aktèlman." },
        { mistake:"Sèlman ede lè yo mande", impact:"Li vin jestyon pwojè swen pwòp tèt li.", fix:"Antisipe. Si plat yo pa lave, lave yo." },
        { mistake:"Enfòme pè li sou akouchman", impact:"'Va gen bèl' fèmen konvèsasyon an.", fix:"'Ki sa ou pi pè? Mwen vle konprann.' Epi koute san presize rekonsilye." },
        { mistake:"Pa konnen plan akouchman an", impact:"Li pa ka defann tèt li nan travay si ou pa konnen li.", fix:"Li li. Aswè a." },
      ],
      discussion:"Ki youn nan sa yo ou fè? Ki youn li ta vle ou sispann fè? Ki chanjman ki pi itil ou ka fè semèn sa a?",
    },
    fr:{
      title:"Erreurs Courantes des Partenaires  -  et Comment Corriger le Tir",
      intro:"Ce sont les erreurs les plus courantes que font les partenaires, avec de genuinement bonnes intentions, qui rendent les choses plus difficiles. Aucune de ces erreurs ne fait de vous un mauvais partenaire. Elles vous font normal. L'objectif est la conscience.",
      items:[
        { mistake:"Essayer de résoudre plutôt que de ressentir", impact:"Elle ne veut pas que sa douleur soit résolue. Elle veut se sentir accompagnée en elle.", fix:"Au lieu de 'As-tu essayé...?', essayez 'Dis-moi plus sur ce que ça fait.'" },
        { mistake:"Comparer son expérience à la grossesse de quelqu'un d'autre", impact:"Chaque grossesse est différente.", fix:"'Ton expérience est ton expérience. Je ne te compare à personne.'" },
        { mistake:"Faire de la grossesse quelque chose qui tourne autour de vos sentiments", impact:"Quand elle partage quelque chose de difficile, ce moment est pour elle.", fix:"Écoutez d'abord. Traitez vos sentiments avec un ami ou un thérapeute, pas dans son moment." },
        { mistake:"Disparaître dans le travail ou le stress", impact:"Elle remarque. Ça se lit comme de l'abandon, pas comme de l'occupé.", fix:"Nommez ce qui se passe et reconnectez activement." },
        { mistake:"N'aider que lorsqu'on le demande", impact:"Elle devient la chef de projet de ses propres soins.", fix:"Anticipez. Si la vaisselle n'est pas faite, faites-la." },
        { mistake:"Invalider sa peur de l'accouchement", impact:"'Ça va aller' ferme la conversation.", fix:"'De quoi as-tu le plus peur? Je veux comprendre.' Puis écoutez sans vous précipiter à rassurer." },
        { mistake:"Ne pas connaître le plan d'accouchement", impact:"Elle ne peut pas se défendre pendant le travail si vous ne le connaissez pas.", fix:"Lisez-le. Ce soir." },
      ],
      discussion:"Laquelle de ces erreurs avez-vous commises? Laquelle souhaiterait-elle que vous cessiez? Quel est le changement le plus utile que vous pourriez faire cette semaine?",
    },
  },

  wellness:{
    en:{
      title:"Your Wellbeing Matters Too",
      intro:"You cannot pour from an empty cup. Partners who neglect their own mental health, physical health, and emotional needs during pregnancy end up less available, more reactive, and more likely to struggle postpartum. This is not selfishness  -  it is sustainability.",
      your_experience:["Your feelings about the pregnancy are valid  -  even if they are complicated","Fear, uncertainty, financial worry, and grief about the relationship change are all normal","You do not have to pretend to feel ready if you do not","You are allowed to have a support system  -  friends, a therapist, other fathers","Your relationship with the pregnancy will likely deepen when the baby arrives and becomes real"],
      needs:[
        { need:"Social connection", action:"Do not isolate. Find other expectant or new fathers to talk to. Their experience normalizes yours." },
        { need:"Physical health", action:"Sleep, exercise, and eating well during pregnancy support your availability postpartum. You cannot show up depleted." },
        { need:"Emotional processing", action:"Find somewhere to process your feelings that is not her. A therapist, a close friend, a journal. Your emotions need a container too." },
        { need:"Relationship investment", action:"Date nights, non-baby conversations, physical affection, and laughter matter. Do not let the pregnancy consume the relationship." },
        { need:"Learning", action:"Read. Watch. Ask questions. Preparation reduces anxiety and increases confidence  -  for you and for her." },
      ],
      honest:"Most pregnancy content is written for mothers. You have been navigating a major life change with very little directed support. That is real. The fact that you are reading this guide is a significant act of investment in your family. That matters.",
      discussion:"How are you actually doing? Not 'fine'  -  actually. What do you need that you haven't asked for? Who in your life can you talk to about this honestly?",
    },
    es:{
      title:"Tu Bienestar También Importa",
      intro:"No puedes dar de una copa vacía. Las parejas que descuidan su propia salud mental, física y necesidades emocionales durante el embarazo terminan menos disponibles y más propensas a tener dificultades en el postparto. Esto no es egoísmo  -  es sostenibilidad.",
      your_experience:["Tus sentimientos sobre el embarazo son válidos  -  incluso si son complicados","El miedo, la incertidumbre, la preocupación financiera y el duelo por el cambio de relación son normales","No tienes que fingir sentirte listo si no lo estás","Se te permite tener un sistema de apoyo  -  amigos, un terapeuta, otros padres"],
      needs:[
        { need:"Conexión social", action:"No te aísles. Encuentra otros padres expectantes o nuevos con quienes hablar." },
        { need:"Salud física", action:"El sueño, el ejercicio y la buena alimentación durante el embarazo apoyan tu disponibilidad postparto." },
        { need:"Procesamiento emocional", action:"Encuentra un lugar para procesar tus sentimientos que no sea ella. Un terapeuta, un amigo cercano, un diario." },
        { need:"Inversión en la relación", action:"Las citas, las conversaciones sin bebé, el afecto físico y la risa importan." },
        { need:"Aprendizaje", action:"Lee. Mira. Haz preguntas. La preparación reduce la ansiedad y aumenta la confianza." },
      ],
      honest:"La mayoría del contenido de embarazo está escrito para las madres. Has estado navegando un cambio de vida importante con muy poco apoyo dirigido a ti. El hecho de que estés leyendo esta guía es un acto significativo de inversión en tu familia.",
      discussion:"¿Cómo estás realmente? No 'bien'  -  realmente. ¿Qué necesitas que no has pedido? ¿Con quién en tu vida puedes hablar de esto honestamente?",
    },
    ht:{
      title:"Byennèt Ou Enpòtan Tou",
      intro:"Ou pa ka bay nan yon tas vid. Patnè ki neglije sante mantal, fizik, ak bezwen emosyonèl pwòp tèt yo pandan gwosès vin mwens disponib epi plis posib pou lite apre akouchman. Sa a pa egoyis  -  se dirab.",
      your_experience:["Santi ou sou gwosès la valid  -  menm si yo konpliye","Pè, ensetitid, enkyetid finansyè, ak dèy sou chanjman relasyon tout nòmal","Ou pa bezwen pretann santi ou pare si ou pa ye","Ou gen dwa gen yon sistèm sipò  -  zanmi, yon terapis, lòt papa"],
      needs:[
        { need:"Koneksyon sosyal", action:"Pa izole tèt ou. Jwenn lòt papa k ap tann oswa nouvo pou pale avèk yo." },
        { need:"Sante fizik", action:"Dòmi, egzèsis, ak manje byen pandan gwosès sipòte disponibilite ou apre akouchman." },
        { need:"Pwosesis emosyonèl", action:"Jwenn kote pou trete santi ou ki pa li. Yon terapis, yon zanmi pwòch, yon jounal." },
        { need:"Envestisman relasyon", action:"Dat lannuit, konvèsasyon san bebe, afeksyon fizik, ak ri enpòtan." },
        { need:"Aprann", action:"Li. Gade. Poze kesyon. Preparasyon diminye enkyetid epi ogmante konfyans." },
      ],
      honest:"Pifò kontni gwosès ekri pou manman yo. Ou ap navige yon gwo chanjman lavi ak très ti sipò dirije sou ou. Lefèt ke ou ap li gid sa a se yon akto enpòtan envestisman nan fanmi ou.",
      discussion:"Kijan ou reyèlman ye? Pa 'an fòm'  -  reyèlman. Kisa ou bezwen ou pa te mande? Avèk ki moun nan lavi ou ou ka pale sou sa onètman?",
    },
    fr:{
      title:"Votre Bien-être Compte Aussi",
      intro:"Vous ne pouvez pas donner d'une tasse vide. Les partenaires qui négligent leur propre santé mentale, physique et leurs besoins émotionnels pendant la grossesse finissent moins disponibles et plus susceptibles de lutter en post-partum. Ce n'est pas de l'égoïsme  -  c'est de la durabilité.",
      your_experience:["Vos sentiments sur la grossesse sont valides  -  même s'ils sont compliqués","La peur, l'incertitude, les inquiétudes financières et le deuil du changement de relation sont tous normaux","Vous n'avez pas à prétendre vous sentir prêt si vous ne l'êtes pas","Vous êtes autorisé à avoir un système de soutien  -  amis, thérapeute, autres pères"],
      needs:[
        { need:"Connexion sociale", action:"Ne vous isolez pas. Trouvez d'autres futurs ou nouveaux pères à qui parler." },
        { need:"Santé physique", action:"Le sommeil, l'exercice et une bonne alimentation pendant la grossesse soutiennent votre disponibilité post-partum." },
        { need:"Traitement émotionnel", action:"Trouvez un endroit pour traiter vos sentiments qui n'est pas elle. Un thérapeute, un ami proche, un journal." },
        { need:"Investissement dans la relation", action:"Les sorties, les conversations sans bébé, l'affection physique et le rire comptent." },
        { need:"Apprentissage", action:"Lisez. Regardez. Posez des questions. La préparation réduit l'anxiété et augmente la confiance." },
      ],
      honest:"La plupart des contenus sur la grossesse sont écrits pour les mères. Vous naviguez un changement de vie majeur avec très peu de soutien dirigé vers vous. Le fait que vous lisiez ce guide est un acte significatif d'investissement dans votre famille.",
      discussion:"Comment allez-vous vraiment? Pas 'bien'  -  vraiment. De quoi avez-vous besoin que vous n'avez pas demandé? Avec qui dans votre vie pouvez-vous parler de cela honnêtement?",
    },
  },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function LangBtn({ code, label, flag, active, C, onClick }) {
  return (
    <button onClick={() => onClick(code)} style={{
      background:active?`${C.accent}25`:C.inputBg,
      border:`1px solid ${active?C.accent:C.border}`,
      borderRadius:20, padding:"5px 13px", cursor:"pointer",
      display:"flex", alignItems:"center", gap:6,
      fontFamily:"'DM Mono',monospace", fontSize:12,
      color:active?C.accent:C.muted, transition:"all 0.2s",
    }}>
      <span>{flag}</span><span>{label}</span>
    </button>
  );
}

function DiscBox({ text, ui, C }) {
  return (
    <div style={{ background:`${C.purple}12`, border:`1px solid ${C.purple}28`,
      borderRadius:12, padding:16, marginTop:18 }}>
      <div style={{ fontSize:10, color:C.purple, fontFamily:"'DM Mono',monospace",
        marginBottom:8, letterSpacing:"0.12em" }}>💬 {ui.discussion.toUpperCase()}</div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, margin:0, fontStyle:"italic" }}>{text}</p>
    </div>
  );
}

function SectionWhy({ lang, C, ui }) {
  const d = DATA.why[lang];
  const clr = { green:C.green, teal:C.teal, blue:C.blue, gold:C.gold };
  return (
    <div>
      <div style={{ background:`${C.accent}10`, border:`1px solid ${C.accent}28`,
        borderRadius:12, padding:16, marginBottom:20 }}>
        <p style={{ fontSize:14, color:C.muted, lineHeight:1.75, margin:0 }}>{d.core}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",
        gap:10, marginBottom:20 }}>
        {d.stats.map((s,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${clr[s.color]}30`,
            borderRadius:12, padding:16 }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:26, fontWeight:800,
              color:clr[s.color], marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.faint, fontFamily:"'DM Mono',monospace",
              lineHeight:1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:`${C.blue}0d`, border:`1px solid ${C.blue}25`,
        borderRadius:14, padding:18, marginBottom:16 }}>
        <div style={{ fontSize:10, color:C.blue, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.15em", marginBottom:10 }}>
          {lang==="en"?"WHAT SHE NEEDS FROM YOU":lang==="es"?"LO QUE ELLA NECESITA DE TI":
           lang==="ht"?"KISA LI BEZWEN NAN OU":lang==="fr"?"CE QU'ELLE A BESOIN DE VOUS":""}
        </div>
        {d.what_she_needs.map((item,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <div style={{ width:4, height:4, borderRadius:"50%",
              background:C.blue, flexShrink:0, marginTop:5 }}/>
            <span style={{ fontSize:13, color:C.muted, lineHeight:1.55 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ background:`${C.accent}0a`, border:`1px solid ${C.accent}22`,
        borderRadius:12, padding:16, marginBottom:14 }}>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0, fontStyle:"italic" }}>{d.honest}</p>
      </div>
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

function SectionTrimester({ tKey, lang, C, ui }) {
  const d = DATA[tKey][lang];
  const [open, setOpen] = useState(null);
  const pColors = { essential:C.red, high:C.orange, practical:C.blue };
  return (
    <div>
      <div style={{ background:`${C.green}0d`, border:`1px solid ${C.green}25`,
        borderRadius:12, padding:16, marginBottom:20 }}>
        <div style={{ fontSize:10, color:C.green, fontFamily:"'DM Mono',monospace",
          marginBottom:8 }}>
          {lang==="en"?"WHAT SHE'S GOING THROUGH":lang==="es"?"POR LO QUE ESTÁ PASANDO":
           lang==="ht"?"KISA LI AP PASE":lang==="fr"?"CE QU'ELLE TRAVERSE":""}
        </div>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, margin:0 }}>{d.what_shes_going_through}</p>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.15em", marginBottom:10 }}>
            {lang==="en"?"COMMON SYMPTOMS":lang==="es"?"SÍNTOMAS COMUNES":
             lang==="ht"?"SENTÒM KOURAN":lang==="fr"?"SYMPTÔMES COURANTS":""}
          </div>
          {d.key_symptoms.map((s,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:7 }}>
              <div style={{ width:4, height:4, borderRadius:"50%",
                background:C.purple, flexShrink:0, marginTop:5 }}/>
              <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.15em", marginBottom:10 }}>
            {lang==="en"?"YOUR ROLE":lang==="es"?"TU ROL":lang==="ht"?"WÒL OU":lang==="fr"?"VOTRE RÔLE":""}
          </div>
          {d.your_role.map((r,i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:9,
              background:`${C.accent}08`, border:`1px solid ${C.accent}18`,
              borderRadius:10, padding:"9px 12px" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{r.icon}</span>
              <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>{r.action}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:`${C.red}0a`, border:`1px solid ${C.red}22`,
        borderRadius:14, padding:16, marginBottom:14 }}>
        <div style={{ fontSize:10, color:C.red, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.15em", marginBottom:10 }}>
          🚫 {ui.avoid.toUpperCase()}
        </div>
        {d.avoid.map((a,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
            <div style={{ width:4, height:4, borderRadius:"50%",
              background:C.red, flexShrink:0, marginTop:5 }}/>
            <span style={{ fontSize:12.5, color:C.muted, lineHeight:1.5 }}>{a}</span>
          </div>
        ))}
      </div>
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

function SectionLaborPrep({ lang, C, ui }) {
  const d = DATA.labor_prep[lang];
  const [checked, setChecked] = useState({});
  const pColors = { essential:C.red, high:C.orange, practical:C.blue };
  const pLabels = { essential:"Essential", high:"High Priority", practical:"Practical" };
  return (
    <div>
      <div style={{ background:`${C.accent}0d`, border:`1px solid ${C.accent}28`,
        borderRadius:12, padding:16, marginBottom:20 }}>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, margin:0 }}>{d.intro}</p>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.15em", marginBottom:12 }}>PREPARATION CHECKLIST</div>
        {d.checklist.map((item,i) => {
          const clr = pColors[item.priority];
          const isDone = !!checked[i];
          return (
            <div key={i} onClick={() => setChecked(p=>({...p,[i]:!isDone}))}
              style={{ display:"flex", gap:12, alignItems:"flex-start",
                background:isDone?`${C.green}0a`:C.cardAlt,
                border:`1px solid ${isDone?C.green:clr}20`,
                borderRadius:10, padding:"11px 14px", marginBottom:8, cursor:"pointer" }}>
              <div style={{ width:20, height:20, borderRadius:4, flexShrink:0,
                border:`2px solid ${isDone?C.green:clr}`,
                background:isDone?`${C.green}30`:"transparent",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isDone && <span style={{ fontSize:11, color:C.green }}>✓</span>}
              </div>
              <span style={{ fontSize:12.5, color:isDone?`${C.muted}70`:C.muted,
                lineHeight:1.55, textDecoration:isDone?"line-through":"none" }}>{item.task}</span>
              <span style={{ fontSize:9.5, color:clr, fontFamily:"'DM Mono',monospace",
                flexShrink:0, marginLeft:"auto" }}>{item.priority}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.15em", marginBottom:12 }}>
        {lang==="en"?"WHAT TO SAY IN THE MOMENT":lang==="es"?"QUÉ DECIR EN EL MOMENTO":
         lang==="ht"?"KISA POU DI NAN MOMAN AN":lang==="fr"?"QUOI DIRE DANS LE MOMENT":""}
      </div>
      {d.language.map((item,i) => (
        <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`,
          borderRadius:12, padding:14, marginBottom:10 }}>
          <div style={{ fontSize:11, color:C.faint, fontFamily:"'DM Mono',monospace",
            marginBottom:6 }}>WHEN: {item.situation}</div>
          <div style={{ background:`${C.green}0d`, border:`1px solid ${C.green}22`,
            borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:9.5, color:C.green, fontFamily:"'DM Mono',monospace",
              marginBottom:5 }}>SAY</div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0,
              fontStyle:"italic" }}>{item.say}</p>
          </div>
        </div>
      ))}
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

function SectionHospital({ lang, C, ui }) {
  const d = DATA.hospital[lang];
  const [open, setOpen] = useState(null);
  const clrMap = { teal:C.teal, blue:C.blue, purple:C.purple, orange:C.orange, green:C.green, pink:C.pink };
  return (
    <div>
      <div style={{ background:`${C.teal}0d`, border:`1px solid ${C.teal}25`,
        borderRadius:12, padding:16, marginBottom:20 }}>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.65, margin:0 }}>{d.intro}</p>
      </div>
      {d.phases.map((phase,i) => {
        const clr = clrMap[phase.color];
        const isOpen = open===i;
        return (
          <div key={i} onClick={() => setOpen(isOpen?null:i)}
            style={{ background:isOpen?`${clr}10`:C.cardAlt,
              border:`1px solid ${isOpen?clr:C.border}`,
              borderRadius:14, padding:16, marginBottom:9, cursor:"pointer" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:22 }}>{phase.icon}</span>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700,
                color:isOpen?clr:C.text, flex:1 }}>{phase.phase}</div>
              <span style={{ fontSize:10, color:C.faint }}>{isOpen?"▲":"▼"}</span>
            </div>
            {isOpen && <p style={{ fontSize:13, color:C.muted, lineHeight:1.65,
              margin:"12px 0 0", paddingTop:12,
              borderTop:`1px solid ${clr}20` }}>{phase.role}</p>}
          </div>
        );
      })}
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

function SectionMistakes({ lang, C, ui }) {
  const d = DATA.mistakes[lang];
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{d.intro}</p>
      {d.items.map((item,i) => {
        const isOpen = open===i;
        return (
          <div key={i} onClick={() => setOpen(isOpen?null:i)}
            style={{ background:isOpen?`${C.orange}0d`:C.cardAlt,
              border:`1px solid ${isOpen?C.orange:C.border}`,
              borderRadius:14, padding:16, marginBottom:9, cursor:"pointer" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:5, height:5, borderRadius:"50%",
                background:C.orange, flexShrink:0 }}/>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700,
                color:isOpen?C.orange:C.text, flex:1 }}>{item.mistake}</div>
              <span style={{ fontSize:10, color:C.faint }}>{isOpen?"▲":"▼"}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.orange}20`,
                display:"flex", gap:12, flexWrap:"wrap" }}>
                <div style={{ flex:"1 1 190px", background:`${C.red}08`,
                  border:`1px solid ${C.red}20`, borderRadius:10, padding:12 }}>
                  <div style={{ fontSize:9.5, color:C.red, fontFamily:"'DM Mono',monospace",
                    marginBottom:5 }}>IMPACT</div>
                  <p style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, margin:0 }}>{item.impact}</p>
                </div>
                <div style={{ flex:"1 1 190px", background:`${C.green}08`,
                  border:`1px solid ${C.green}20`, borderRadius:10, padding:12 }}>
                  <div style={{ fontSize:9.5, color:C.green, fontFamily:"'DM Mono',monospace",
                    marginBottom:5 }}>INSTEAD</div>
                  <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0,
                    fontStyle:"italic" }}>{item.fix}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

function SectionWellness({ lang, C, ui }) {
  const d = DATA.wellness[lang];
  return (
    <div>
      <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{d.intro}</p>
      <div style={{ background:`${C.blue}0d`, border:`1px solid ${C.blue}25`,
        borderRadius:14, padding:18, marginBottom:20 }}>
        <div style={{ fontSize:10, color:C.blue, fontFamily:"'DM Mono',monospace",
          marginBottom:10 }}>
          {lang==="en"?"YOUR EXPERIENCE IS REAL":lang==="es"?"TU EXPERIENCIA ES REAL":
           lang==="ht"?"EKSPERYANS OU REYÈL":lang==="fr"?"VOTRE EXPÉRIENCE EST RÉELLE":""}
        </div>
        {d.your_experience.map((item,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:7 }}>
            <div style={{ width:4, height:4, borderRadius:"50%",
              background:C.blue, flexShrink:0, marginTop:5 }}/>
            <span style={{ fontSize:13, color:C.muted, lineHeight:1.55 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {d.needs.map((item,i) => (
          <div key={i} style={{ background:C.card, border:`1px solid ${C.accent}20`,
            borderRadius:12, padding:"12px 16px", display:"flex", gap:14 }}>
            <div style={{ background:`${C.accent}18`, border:`1px solid ${C.accent}30`,
              borderRadius:8, padding:"5px 10px", fontSize:11, color:C.accent,
              fontFamily:"'DM Mono',monospace", flexShrink:0, alignSelf:"flex-start" }}>
              {item.need}
            </div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, margin:0 }}>{item.action}</p>
          </div>
        ))}
      </div>
      <div style={{ background:`${C.accent}0a`, border:`1px solid ${C.accent}22`,
        borderRadius:12, padding:16, marginBottom:14 }}>
        <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, margin:0, fontStyle:"italic" }}>{d.honest}</p>
      </div>
      <DiscBox text={d.discussion} ui={ui} C={C}/>
    </div>
  );
}

export default function PartnerTrimesterGuide() {
  const [lang, setLang] = useState("en");
  const [section, setSection] = useState(0);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("dph-guide-theme") !== "light";
  });
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("dph-guide-theme", dark ? "dark" : "light");
  }, [dark]);

  const C = dark ? DARK : LIGHT;
  const ui = UI[lang];
  const navLabels = NAV[lang];

  const kpis = [
    { icon:"🤰", value:"9mo", label:lang==="en"?"JOURNEY YOU'RE SHARING":lang==="es"?"VIAJE QUE COMPARTES":lang==="ht"?"VWAYAJ OU PATAJE":lang==="fr"?"":"", color:C.accent },
    { icon:"📋", value:"8", label:lang==="en"?"TRIMESTER GUIDES":lang==="es"?"GUÍAS DE TRIMESTRE":lang==="ht"?"GID TRIMÈS":lang==="fr"?"":"", color:C.teal },
    { icon:"✅", value:"10+", label:lang==="en"?"ACTIONS PER TRIMESTER":lang==="es"?"ACCIONES POR TRIMESTRE":lang==="ht"?"AKSYON PAR TRIMÈS":lang==="fr"?"":"", color:C.green },
    { icon:"🗣️", value:"4", label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":lang==="fr"?"":"", color:C.blue },
  ];

  const renderSection = () => {
    switch(section) {
      case 0: return <SectionWhy lang={lang} C={C} ui={ui}/>;
      case 1: return <SectionTrimester tKey="t1" lang={lang} C={C} ui={ui}/>;
      case 2: return <SectionTrimester tKey="t2" lang={lang} C={C} ui={ui}/>;
      case 3: return <SectionTrimester tKey="t3" lang={lang} C={C} ui={ui}/>;
      case 4: return <SectionLaborPrep lang={lang} C={C} ui={ui}/>;
      case 5: return <SectionHospital lang={lang} C={C} ui={ui}/>;
      case 6: return <SectionMistakes lang={lang} C={C} ui={ui}/>;
      case 7: return <SectionWellness lang={lang} C={C} ui={ui}/>;
      default: return <SectionWhy lang={lang} C={C} ui={ui}/>;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text,
      fontFamily:"'DM Sans',sans-serif", transition:"background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing:border-box; } button { outline:none; font-family:inherit; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:${C.accent}40; border-radius:2px; }
      `}</style>
      <div style={{ background:C.navBg, backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`, padding:"20px 24px 0",
        position:"sticky", top:0, zIndex:50, boxShadow:C.shadow }}>
        <div style={{ maxWidth:1080, margin:"0 auto" }}>
          <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(-10px)", transition:"all 0.5s" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:14 }}>
              <div style={{ flex:1, minWidth:260 }}>
                <div style={{ fontSize:9.5, letterSpacing:"0.28em", fontFamily:"'DM Mono',monospace",
                  textTransform:"uppercase", marginBottom:5, color:C.faint }}>
                  Dieudonne Partner Hub · Partner Education Series
                </div>
                <h1 style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(20px,3vw,30px)", margin:0, lineHeight:1.05, fontWeight:900 }}>
                  <span style={{ background:`linear-gradient(135deg,${C.accent},${C.gold})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Your Role, </span>
                  <span style={{ background:`linear-gradient(135deg,${C.teal},${C.blue})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Trimester by Trimester </span>
                  <span style={{ fontWeight:400, fontSize:"0.6em",
                    WebkitTextFillColor:C.faint }}>{ui.subtitle}</span>
                </h1>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ background:C.inputBg, border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"6px 12px", fontSize:9.5, color:C.faint, fontFamily:"'DM Mono',monospace" }}>
                    FOCUS &nbsp; {ui.tagline}
                  </div>
                  <button onClick={() => setDark(d=>!d)} style={{
                    background:C.toggleBg, border:`1px solid ${C.border}`,
                    borderRadius:20, padding:"5px 14px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:6,
                    fontFamily:"'DM Mono',monospace", fontSize:11.5,
                    color:C.muted, transition:"all 0.25s" }}>
                    <span>{dark?"☀️":"🌙"}</span><span>{dark?ui.light_mode:ui.dark_mode}</span>
                  </button>
                </div>
                <div style={{ background:C.inputBg, border:`1px solid ${C.border}`,
                  borderRadius:10, padding:"9px 12px" }}>
                  <div style={{ fontSize:9, color:C.faint, fontFamily:"'DM Mono',monospace",
                    marginBottom:7, letterSpacing:"0.15em" }}>SELECT LANGUAGE / CHWAZI LANG</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {LANGS.map(l => <LangBtn key={l.code} {...l} active={lang===l.code} C={C} onClick={setLang}/>)}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ paddingBottom:14 }}>
              <div style={{ position:"relative" }}>
                <select value={section} onChange={e=>setSection(Number(e.target.value))}
                  style={{ width:"100%", appearance:"none", WebkitAppearance:"none",
                    background:C.inputBg, border:`1px solid ${C.accent}50`,
                    borderRadius:10, padding:"9px 40px 9px 14px",
                    color:C.accent, fontSize:12, fontFamily:"'DM Mono',monospace",
                    cursor:"pointer", outline:"none", boxShadow:`0 0 0 1px ${C.accent}20` }}>
                  {navLabels.map((label,i) => (
                    <option key={i} value={i} style={{ background:dark?"#0f1628":"#fff", color:dark?C.text:"#0f1628" }}>
                      {NAV_ICONS[i]}  {label}  ({i+1}/{navLabels.length})
                    </option>
                  ))}
                </select>
                <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  pointerEvents:"none", color:C.accent, fontSize:10, fontFamily:"'DM Mono',monospace" }}>▼</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"26px 20px 80px" }}>
        <div style={{ opacity:ready?1:0, transform:ready?"none":"translateY(14px)", transition:"all 0.5s ease 0.08s" }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:22 }}>
            {kpis.map((k,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`,
                borderRadius:14, padding:"14px 18px", flex:"1 1 160px" }}>
                <div style={{ fontSize:18, marginBottom:5 }}>{k.icon}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
                  fontSize:"clamp(20px,3vw,28px)", color:k.color, lineHeight:1 }}>{k.value}</div>
                <div style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace",
                  marginTop:5, letterSpacing:"0.04em", lineHeight:1.4 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(20px,2.8vw,26px)", margin:"0 0 4px", fontWeight:800 }}>
              {NAV_ICONS[section]} {navLabels[section]}
            </h2>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
              <div style={{ height:2, flex:1, background:`linear-gradient(90deg,${C.accent}70,transparent)`, borderRadius:1 }}/>
              <span style={{ fontSize:10, color:C.faint, fontFamily:"'DM Mono',monospace" }}>{section+1} / {navLabels.length}</span>
            </div>
          </div>
          <div style={{ background:dark?`${C.accent}03`:C.card, border:`1px solid ${C.border}`,
            borderRadius:22, padding:"24px 22px", boxShadow:dark?"none":C.shadow }}>
            {renderSection()}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between",
            marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
            {section>0 ? (
              <button onClick={()=>setSection(s=>s-1)} style={{
                background:C.inputBg, border:`1px solid ${C.border}`,
                borderRadius:10, padding:"8px 18px", color:C.muted,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {NAV_ICONS[section-1]} {navLabels[section-1]}
              </button>
            ) : <div/>}
            {section<navLabels.length-1 ? (
              <button onClick={()=>setSection(s=>s+1)} style={{
                background:`${C.accent}18`, border:`1px solid ${C.accent}45`,
                borderRadius:10, padding:"8px 18px", color:C.accent,
                fontSize:11.5, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>
                {navLabels[section+1]} {NAV_ICONS[section+1]} {"->"}
              </button>
            ) : <div/>}
          </div>
          <div style={{ textAlign:"center", fontSize:10.5, marginTop:24, lineHeight:1.7,
            color:dark?"rgba(148,163,184,0.22)":"rgba(30,41,59,0.35)",
            fontFamily:"'DM Mono',monospace" }}>
            {ui.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
