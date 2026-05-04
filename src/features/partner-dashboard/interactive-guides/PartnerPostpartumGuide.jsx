import { useState, useEffect } from "react";
const DARK={bg:"#080d1a",card:"#0f1628",cardAlt:"#111827",border:"rgba(148,163,184,0.1)",text:"#f1f5f9",muted:"#e2e8f0",faint:"rgba(226,232,240,0.55)",accent:"#f59e0b",teal:"#22d3ee",purple:"#a78bfa",gold:"#fbbf24",green:"#34d399",red:"#f87171",orange:"#fb923c",blue:"#60a5fa",pink:"#e879f9",navBg:"rgba(8,13,26,0.96)",shadow:"0 4px 24px rgba(0,0,0,0.4)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f4f6fb",card:"#ffffff",cardAlt:"#f8fafc",border:"rgba(15,22,40,0.1)",text:"#0f1628",muted:"#1e293b",faint:"rgba(30,41,59,0.5)",accent:"#d97706",teal:"#0891b2",purple:"#7c3aed",gold:"#d97706",green:"#059669",red:"#dc2626",orange:"#ea580c",blue:"#2563eb",pink:"#c026d3",navBg:"rgba(244,246,251,0.97)",shadow:"0 4px 24px rgba(15,22,40,0.1)",inputBg:"rgba(15,22,40,0.04)",toggleBg:"rgba(15,22,40,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["What Is Postpartum","Her Body Is Healing","Postpartum Mood","Protecting Her Sleep","Baby Care Basics","Supporting Breastfeeding","When to Get Help","Your Role Summary"],
  es:["Qué Es el Postparto","Su Cuerpo Está Sanando","Estado de Ánimo Postparto","Proteger Su Sueño","Básicos del Cuidado del Bebé","Apoyar la Lactancia","Cuándo Buscar Ayuda","Resumen de Tu Rol"],
  ht:["Kisa Apre Akouchman Ye","Kò Li Ap Geri","Emosyon Apre Akouchman","Pwoteje Dòmi Li","Baz Swen Bebe","Sipòte Alètman","Ki Lè Pou Chèche Èd","Rezime Wòl Ou"],
  fr:["Qu'est-ce que le Post-partum","Son Corps Guérit","Humeur Post-partum","Protéger Son Sommeil","Bases des Soins du Bébé","Soutenir l'Allaitement","Quand Chercher de l'Aide","Résumé de Votre Rôle"],
};
const ICONS=["🌅","🌿","💛","😴","👶","🤱","🚨","⭐"];

const HEALING = {
  en:{
    title:"Her Body Is Healing  -  What You Need to Know",
    intro:"Birth is a major physical event. Whether vaginal or cesarean, her body has done something extraordinary and needs significant time to recover. Understanding what she is going through helps you show up with appropriate support instead of unintentional pressure.",
    physical:[
      {item:"Bleeding (lochia) for 4-6 weeks",detail:"Normal postpartum bleeding. It should gradually lighten. If it becomes heavier or has large clots, call the provider."},
      {item:"Perineal soreness and swelling",detail:"Especially after vaginal birth. Ice packs, sitz baths, witch hazel pads, and the peri bottle are her friends. Keep them stocked."},
      {item:"C-section recovery",detail:"A cesarean is major abdominal surgery. No lifting over 10 lbs, no driving, incision care required. She needs even more physical help and time."},
      {item:"Breast engorgement and nipple pain",detail:"Whether breastfeeding or not, her milk comes in around day 3-5. This is uncomfortable. Offer cold compresses if not breastfeeding."},
      {item:"Night sweats and hormone shifts",detail:"Her hormones are crashing from pregnancy levels. Night sweats, hair loss (weeks 3-6), and mood swings are all normal physical responses."},
      {item:"Exhaustion unlike anything before",detail:"Interrupted sleep plus physical recovery plus feeding a newborn is uniquely depleting. This is not adjustable effort  -  it is physiological depletion."},
    ],
    your_job:["Keep the peri bottle filled and near the toilet","Stock the medicine basket: ibuprofen, Dermoplast, witch hazel pads, stool softeners","Help her position safely for breastfeeding  -  pillows, height, angle","Handle all heavy lifting, especially if c-section","Bring food and water to wherever she is","Do not expect her to host, explain herself, or be available to visitors"],
    discussion:"What surprised you most about her physical recovery? What have you done that helped? What do you wish you had known sooner?",
  },
  es:{
    title:"Su Cuerpo Está Sanando  -  Lo Que Necesitas Saber",
    intro:"El parto es un evento físico importante. Ya sea vaginal o por cesárea, su cuerpo ha hecho algo extraordinario y necesita tiempo significativo para recuperarse.",
    physical:[
      {item:"Sangrado (loquios) durante 4-6 semanas",detail:"Sangrado postparto normal. Debe aligerarse gradualmente. Si se vuelve más abundante, llama al proveedor."},
      {item:"Dolor e hinchazón perineal",detail:"Especialmente después del parto vaginal. Bolsas de hielo, baños de asiento, almohadillas de hamamelis son sus amigas."},
      {item:"Recuperación de cesárea",detail:"Una cesárea es cirugía abdominal mayor. No levantar más de 4-5 kg, sin conducir, cuidado de la incisión requerido."},
      {item:"Congestión mamaria y dolor en los pezones",detail:"Ya sea que amamante o no, la leche llega alrededor del día 3-5. Ofrece compresas frías si no amamanta."},
      {item:"Sudores nocturnos y cambios hormonales",detail:"Sus hormonas están cayendo desde los niveles del embarazo. Los sudores nocturnos, la caída del cabello y los cambios de humor son respuestas físicas normales."},
      {item:"Agotamiento como nunca antes",detail:"El sueño interrumpido más la recuperación física más alimentar a un recién nacido es uniquamente agotador."},
    ],
    your_job:["Mantén el frasco perineobottle lleno cerca del inodoro","Abastece la canasta de medicamentos: ibuprofeno, almohadillas de hamamelis, ablandadores de heces","Ayúdala a posicionarse de forma segura para amamantar","Maneja todo el levantamiento pesado","Lleva comida y agua a donde sea que esté","No esperes que reciba visitas o esté disponible"],
    discussion:"¿Qué te sorprendió más de su recuperación física? ¿Qué has hecho que ayudó? ¿Qué desearías haber sabido antes?",
  },
  ht:{
    title:"Kò Li Ap Geri  -  Kisa Ou Bezwen Konnen",
    intro:"Akouchman se yon gwo evènman fizik. Kit se vajinal oswa sezaryèn, kò li fè yon bagay ekstraòdinè epi bezwen tan enpòtan pou rekiperasyon.",
    physical:[
      {item:"Senyen (lokya) pou 4-6 semèn",detail:"Senyen nòmal apre akouchman. Ta dwe klesi gradyèlman. Si li vin pi lou, rele pwofesyonèl la."},
      {item:"Doulè ak anfle perineal",detail:"Espesyalman apre akouchman vajinal. Sak glas, sen beny, konprès hamamelis se zanmi li yo."},
      {item:"Rekiperasyon sezaryèn",detail:"Yon sezaryèn se yon gwo chiriji abdominal. Pa leve plis pase 4-5 kg, pa kondui, swen ensizyon obligatwa."},
      {item:"Konjesyon tete ak doulè pwent tete",detail:"Kit li bay tete oswa non, lèt li vin alantou jou 3-5. Sa inkonfortab."},
      {item:"Swe lannuit ak chanjman òmònal",detail:"Òmòn li ap tonbe soti nan nivo gwosès. Swe lannuit, pèt cheve, ak chanjman emosyon tout repons fizik nòmal."},
      {item:"Fatig tankou anyen anvan",detail:"Dòmi entewonpu anplis rekiperasyon fizik anplis nouri yon tibebe nouvo se inikman epwizan."},
    ],
    your_job:["Kenbe boutèy peri plen pre twalèt la","Estoke kòrbèy medikaman: ibipwofèn, konprès hamamelis, ramolisman selabou","Ede li pozisyone san danje pou bay tete","Jere tout travay lou","Pote manje ak dlo kote li ye","Pa tann li resevwa vizitè oswa disponib"],
    discussion:"Ki sa ki pi sipriz ou sou rekiperasyon fizik li? Kisa ou fè ki te ede? Kisa ou ta vle te konnen pi bonè?",
  },
  fr:{
    title:"Son Corps Guérit  -  Ce que Vous Devez Savoir",
    intro:"L'accouchement est un événement physique majeur. Qu'il soit vaginal ou par césarienne, son corps a fait quelque chose d'extraordinaire et a besoin de temps significatif pour récupérer.",
    physical:[
      {item:"Saignements (lochies) pendant 4-6 semaines",detail:"Saignements post-partum normaux. Ils devraient s'alléger progressivement. S'ils deviennent plus abondants, appelez le prestataire."},
      {item:"Douleur et gonflement périnéal",detail:"Surtout après un accouchement vaginal. Poches de glace, bains de siège, coussinets à l'hamamélis sont ses amis."},
      {item:"Récupération de la césarienne",detail:"Une césarienne est une chirurgie abdominale majeure. Pas de soulèvement de plus de 4-5 kg, pas de conduite, soins de l'incision requis."},
      {item:"Engorgement mammaire et douleur aux mamelons",detail:"Que vous allaitiez ou non, le lait arrive vers le jour 3-5."},
      {item:"Sueurs nocturnes et changements hormonaux",detail:"Ses hormones chutent des niveaux de grossesse. Les sueurs nocturnes, la perte de cheveux et les sautes d'humeur sont des réponses physiques normales."},
      {item:"Épuisement comme jamais auparavant",detail:"Sommeil interrompu plus récupération physique plus allaitement d'un nouveau-né est singulièrement épuisant."},
    ],
    your_job:["Gardez la bouteille péri remplie près des toilettes","Constituez le panier de médicaments: ibuprofène, coussinets à l'hamamélis, ramollisseurs de selles","Aidez-la à se positionner en sécurité pour allaiter","Gérez tout levage lourd","Apportez nourriture et eau où qu'elle soit","Ne vous attendez pas à ce qu'elle reçoive des visiteurs ou soit disponible"],
    discussion:"Qu'est-ce qui vous a le plus surpris dans sa récupération physique? Qu'avez-vous fait qui a aidé? Qu'auriez-vous voulu savoir plus tôt?",
  },
};

const MOOD = {
  en:{
    title:"Postpartum Mood: What Is Normal and What Is Not",
    intro:"Up to 80% of new mothers experience some form of postpartum mood change. Knowing the difference between baby blues, postpartum depression, and postpartum anxiety helps you respond appropriately  -  and potentially save her life.",
    types:[
      {name:"Baby Blues",color:"blue",what:"Crying, sadness, irritability, emotional sensitivity in the first 2 weeks after birth.",why:"Caused by the dramatic hormonal drop after delivery. Estrogen and progesterone crash from pregnancy levels in 24-48 hours.",normal:true,action:"Listen. Do not fix. Ensure rest and nutrition. If it persists past 2 weeks, contact her provider."},
      {name:"Postpartum Depression",color:"purple",what:"Persistent sadness, inability to bond with baby, feeling like a bad mother, hopelessness, withdrawing from family, difficulty functioning  -  lasting more than 2 weeks.",why:"A clinical condition, not a character failure. Hormonal, genetic, and situational factors combine. Affects 1 in 5 new mothers.",normal:false,action:"Do not wait. Contact her OB or midwife immediately. Offer to make the call or go to the appointment with her. This is medical, not a sign of weakness."},
      {name:"Postpartum Anxiety",color:"orange",what:"Relentless worry, racing thoughts, inability to sleep even when the baby sleeps, physical symptoms like heart racing or trouble breathing, intrusive thoughts.",why:"Often underdiagnosed. Can occur without depression. Very treatable.",normal:false,action:"Take it seriously. Help her describe her symptoms to her provider. Do not minimize or reassure away  -  she needs professional evaluation."},
      {name:"Postpartum Psychosis",color:"red",what:"Hallucinations, delusions, confusion, rapid mood swings, paranoia. Rare but serious.",why:"Medical emergency. Requires immediate psychiatric care.",normal:false,action:"This is a psychiatric emergency. Call her OB and if she is in danger, call 911. Do not leave her alone."},
    ],
    your_signs:["She seems to not connect with the baby","She cries most of the day and it is not improving","She says she made a mistake having this baby","She is not sleeping even when the baby sleeps","She seems afraid of being alone with the baby","She says she wishes she were not here"],
    discussion:"Do you know the warning signs for postpartum depression? Has she told you how she is feeling emotionally? What would you do if you noticed the signs?",
  },
  es:{
    title:"Estado de Ánimo Postparto: Qué Es Normal y Qué No",
    intro:"Hasta el 80% de las nuevas madres experimentan algún cambio de humor postparto. Conocer la diferencia entre el baby blues, la depresión postparto y la ansiedad postparto te ayuda a responder apropiadamente.",
    types:[
      {name:"Baby Blues",color:"blue",what:"Llanto, tristeza, irritabilidad, sensibilidad emocional en las primeras 2 semanas después del parto.",why:"Causado por la dramática caída hormonal después del parto.",normal:true,action:"Escucha. No trates de arreglar. Asegura descanso y nutrición. Si persiste más de 2 semanas, contacta a su proveedor."},
      {name:"Depresión Postparto",color:"purple",what:"Tristeza persistente, incapacidad para conectar con el bebé, sintiéndose mala madre, desesperanza  -  durando más de 2 semanas.",why:"Una condición clínica, no una falla de carácter. Afecta a 1 de cada 5 nuevas madres.",normal:false,action:"No esperes. Contacta a su OB o partera inmediatamente. Esto es médico, no una señal de debilidad."},
      {name:"Ansiedad Postparto",color:"orange",what:"Preocupación incesante, pensamientos acelerados, incapacidad para dormir incluso cuando el bebé duerme, síntomas físicos.",why:"A menudo subdiagnosticado. Muy tratable.",normal:false,action:"Tómalo en serio. Ayúdala a describir sus síntomas a su proveedor."},
      {name:"Psicosis Postparto",color:"red",what:"Alucinaciones, delirios, confusión, cambios de humor rápidos. Raro pero grave.",why:"Emergencia médica. Requiere atención psiquiátrica inmediata.",normal:false,action:"Esta es una emergencia psiquiátrica. Llama a su OB y si está en peligro, llama al 911."},
    ],
    your_signs:["Parece no conectar con el bebé","Llora la mayor parte del día y no mejora","Dice que cometió un error al tener este bebé","No está durmiendo incluso cuando el bebé duerme","Parece tener miedo de estar sola con el bebé","Dice que desearía no estar aquí"],
    discussion:"¿Conoces las señales de advertencia para la depresión postparto? ¿Te ha dicho cómo se siente emocionalmente? ¿Qué harías si notaras las señales?",
  },
  ht:{
    title:"Emosyon Apre Akouchman: Kisa Ki Nòmal ak Kisa Ki Pa Nòmal",
    intro:"Jiska 80% nan nouvo manman yo eksperyanse yon fòm chanjman emosyon apre akouchman. Konnen diferans ant baby blues, depresyon apre akouchman, ak enkyetid apre akouchman ede ou reponn apropriyeman.",
    types:[
      {name:"Baby Blues",color:"blue",what:"Kriye, tristès, iritabilite, sansibilite emosyonèl nan premye 2 semèn apre akouchman.",why:"Koze pa tonbe dramatik òmònal apre akouchman.",normal:true,action:"Koute. Pa eseye regle. Asire repo ak nitrisyon. Si li pèsiste pi lwen pase 2 semèn, kontakte pwofesyonèl li."},
      {name:"Depresyon Apre Akouchman",color:"purple",what:"Tristès pèsistan, enkapsite pou konekte ak bebe a, santi move manman, dezespwa  -  plis pase 2 semèn.",why:"Yon kondisyon klinik, pa yon echèk karaktè. Afekte 1 nan 5 nouvo manman.",normal:false,action:"Pa tann. Kontakte OB li oswa fanmsaj imedyatman. Sa medikal, pa yon siy feblès."},
      {name:"Enkyetid Apre Akouchman",color:"orange",what:"Enkyetid san rete, panse rapid, enkapsite pou dòmi menm lè bebe a dòmi.",why:"Souvan pa dyagnostike. Trè treyatab.",normal:false,action:"Pran li seryèzman. Ede li dekri sentòm li bay pwofesyonèl li."},
      {name:"Psikoz Apre Akouchman",color:"red",what:"Alisimeyasyon, delèz, konfizyon, chanjman emosyon rapid. Ra men grav.",why:"Ijans medikal. Mande swen sikyatrik imedya.",normal:false,action:"Sa a se yon ijans sikyatrik. Rele OB li epi si li an danje, rele 911."},
    ],
    your_signs:["Li parèt pa konekte ak bebe a","Li kriye pifò jounen a epi li pa amelyore","Li di li fè yon erè pou yo gen bebe sa a","Li pa dòmi menm lè bebe a dòmi","Li parèt pè pou yo sèl avèk bebe a","Li di li ta vle pa la"],
    discussion:"Eske ou konnen siy avètisman pou depresyon apre akouchman? Eske li te di ou kijan li santi li emosyonèlman? Kisa ou ta fè si ou te remake siy yo?",
  },
  fr:{
    title:"Humeur Post-partum: Ce qui Est Normal et Ce qui Ne l'Est Pas",
    intro:"Jusqu'à 80% des nouvelles mères connaissent une forme de changement d'humeur post-partum. Connaître la différence entre le baby blues, la dépression post-partum et l'anxiété post-partum vous aide à répondre de manière appropriée.",
    types:[
      {name:"Baby Blues",color:"blue",what:"Pleurs, tristesse, irritabilité, sensibilité émotionnelle dans les 2 premières semaines après la naissance.",why:"Causé par la chute hormonale dramatique après l'accouchement.",normal:true,action:"Écoutez. Ne cherchez pas à corriger. Assurez le repos et la nutrition. Si cela persiste au-delà de 2 semaines, contactez son prestataire."},
      {name:"Dépression Post-partum",color:"purple",what:"Tristesse persistante, incapacité à créer des liens avec le bébé, sentiment d'être une mauvaise mère, désespoir  -  durant plus de 2 semaines.",why:"Une condition clinique, pas un échec de caractère. Affecte 1 femme sur 5.",normal:false,action:"N'attendez pas. Contactez immédiatement son OB ou sa sage-femme. C'est médical, pas un signe de faiblesse."},
      {name:"Anxiété Post-partum",color:"orange",what:"Inquiétude incessante, pensées qui s'emballent, incapacité à dormir même quand le bébé dort.",why:"Souvent sous-diagnostiquée. Très traitable.",normal:false,action:"Prenez cela au sérieux. Aidez-la à décrire ses symptômes à son prestataire."},
      {name:"Psychose Post-partum",color:"red",what:"Hallucinations, délires, confusion, sautes d'humeur rapides. Rare mais grave.",why:"Urgence médicale. Nécessite des soins psychiatriques immédiats.",normal:false,action:"C'est une urgence psychiatrique. Appelez son OB et si elle est en danger, appelez le 15 ou le 112."},
    ],
    your_signs:["Elle semble ne pas se connecter avec le bébé","Elle pleure la plupart du temps et ça ne s'améliore pas","Elle dit qu'elle a fait une erreur d'avoir ce bébé","Elle ne dort pas même quand le bébé dort","Elle semble avoir peur d'être seule avec le bébé","Elle dit qu'elle aimerait ne pas être là"],
    discussion:"Connaissez-vous les signes d'alerte de la dépression post-partum? Vous a-t-elle dit comment elle se sent émotionnellement? Que feriez-vous si vous remarquiez les signes?",
  },
};

const SLEEP = {
  en:{title:"Protecting Her Sleep",
    intro:"Sleep deprivation is one of the most dangerous and underestimated factors in postpartum health. It amplifies postpartum depression, impairs judgment, and makes everything harder. Protecting her sleep is not a luxury. It is medical support.",
    rules:[
      {rule:"Take the first night shift",detail:"From birth to 3-4 AM, you are on duty. She sleeps. She feeds if breastfeeding but you bring the baby and return the baby. This is the shift that costs you the most and gives her the most."},
      {rule:"Never wake her to tell her the baby is awake",detail:"If you can handle it, handle it. Wake her only if you genuinely cannot soothe the baby or if it is a feeding window."},
      {rule:"Build a feeding station",detail:"Stock one spot in the house with everything needed for a feeding session so she does not have to search at 3 AM. Water, snacks, phone charger, burp cloth, extra wipes."},
      {rule:"Protect nap windows",detail:"When the baby naps, that is her nap window. Guard it. Silence the phone. Manage visitors. Do not ask questions."},
      {rule:"Take a full night weekly",detail:"Once per week, take the full night. She sleeps from when the baby goes down until morning. You handle everything. This is recovery, not a favor."},
    ],
    discussion:"How are you currently splitting overnight duties? What shift are you taking? What would change if you took the first shift every night for two weeks?",
  },
  es:{title:"Proteger Su Sueño",
    intro:"La privación del sueño es uno de los factores más peligrosos y subestimados en la salud postparto. Amplifica la depresión postparto, deteriora el juicio y hace todo más difícil. Proteger su sueño no es un lujo. Es apoyo médico.",
    rules:[
      {rule:"Toma el primer turno de noche",detail:"Desde el nacimiento hasta las 3-4 AM, tú estás de guardia. Ella duerme. Ella amamanta si lo hace pero tú traes al bebé y lo devuelves."},
      {rule:"Nunca la despiertes para decirle que el bebé está despierto",detail:"Si puedes manejarlo, manéjalo. Despiértala solo si genuinamente no puedes calmar al bebé."},
      {rule:"Construye una estación de alimentación",detail:"Abastece un lugar con todo lo necesario para una sesión de alimentación."},
      {rule:"Protege las ventanas de siesta",detail:"Cuando el bebé duerme la siesta, eso es la ventana de siesta de ella. Cuídala."},
      {rule:"Toma una noche completa semanalmente",detail:"Una vez por semana, toma la noche completa. Esto es recuperación, no un favor."},
    ],
    discussion:"¿Cómo estás dividiendo actualmente los deberes nocturnos? ¿Qué turno estás tomando? ¿Qué cambiaría si tomaras el primer turno cada noche durante dos semanas?",
  },
  ht:{title:"Pwoteje Dòmi Li",
    intro:"Privasyasyon dòmi se youn nan faktè ki pi danjere ak sou-estime nan sante apre akouchman. Li amplifye depresyon apre akouchman, diminye jijman, epi rann tout bagay pi difisil. Pwoteje dòmi li pa yon lukse. Se sipò medikal.",
    rules:[
      {rule:"Pran premye travay lannuit",detail:"Soti nan akouchman jiska 3-4 AM, ou an sèvis. Li dòmi. Li bay tete si li fè sa men ou pote bebe a epi retounen bebe a."},
      {rule:"Janm reveye li pou di li bebe a reveye",detail:"Si ou ka jere li, jere li. Reveye li sèlman si ou reyèlman pa ka kalme bebe a."},
      {rule:"Konstwi yon estasyon manje",detail:"Estoke yon kote kay ak tout sa ki nesesè pou yon sesyon manje."},
      {rule:"Pwoteje fenèt siyès",detail:"Lè bebe a pran siyès, se fenèt siyès pa li. Pwoteje li."},
      {rule:"Pran yon lannuit konplè chak semèn",detail:"Yon fwa pa semèn, pran lannuit konplè a. Sa a se rekiperasyon, pa yon favè."},
    ],
    discussion:"Kòman ou ap divize kouti lannuit kounye a? Ki travay ou pran? Kisa ki ta chanje si ou te pran premye travay chak lannuit pou de semèn?",
  },
  fr:{title:"Protéger Son Sommeil",
    intro:"La privation de sommeil est l'un des facteurs les plus dangereux et sous-estimés dans la santé post-partum. Elle amplifie la dépression post-partum, altère le jugement et rend tout plus difficile. Protéger son sommeil n'est pas un luxe. C'est un soutien médical.",
    rules:[
      {rule:"Prenez le premier quart de nuit",detail:"De la naissance jusqu'à 3-4h du matin, vous êtes de garde. Elle dort. Elle allaite si elle le fait mais vous amenez le bébé et le ramportez."},
      {rule:"Ne la réveillez jamais pour lui dire que le bébé est réveillé",detail:"Si vous pouvez le gérer, gérez-le. Réveillez-la seulement si vous ne pouvez vraiment pas calmer le bébé."},
      {rule:"Construisez une station d'alimentation",detail:"Stockez un endroit avec tout ce qui est nécessaire pour une session d'alimentation."},
      {rule:"Protégez les fenêtres de sieste",detail:"Quand le bébé fait la sieste, c'est sa fenêtre de sieste. Protégez-la."},
      {rule:"Prenez une nuit complète par semaine",detail:"Une fois par semaine, prenez la nuit complète. C'est de la récupération, pas une faveur."},
    ],
    discussion:"Comment divisez-vous actuellement les tâches nocturnes? Quel quart prenez-vous? Qu'est-ce qui changerait si vous preniez le premier quart chaque nuit pendant deux semaines?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecHealing({lang,C}){
  const d=HEALING[lang];
  return <div>
    <div style={{background:C.green+"0d",border:"1px solid "+C.green+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{marginBottom:20}}>
      {d.physical.map((item,i)=><div key={i} style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:12,padding:"12px 16px",marginBottom:9}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:C.teal,marginBottom:4}}>{item.item}</div>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.55,margin:0}}>{item.detail}</p>
      </div>)}
    </div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:14,padding:18,marginBottom:14}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",marginBottom:10}}>YOUR SPECIFIC JOB LIST</div>
      {d.your_job.map((item,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.accent,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{item}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecMood({lang,C}){
  const d=MOOD[lang];
  const [open,setOpen]=useState(null);
  const cm={blue:C.blue,purple:C.purple,orange:C.orange,red:C.red};
  return <div>
    <div style={{background:C.purple+"0d",border:"1px solid "+C.purple+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.types.map((t,i)=>{
      const clr=cm[t.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer",transition:"all 0.25s"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:t.normal?C.green:clr,flexShrink:0}}/>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{t.name}</div>
          <div style={{fontSize:10,color:t.normal?C.green:clr,fontFamily:"'DM Mono',monospace"}}>{t.normal?"Normal":"Seek Help"}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+clr+"20"}}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
            <div style={{flex:"1 1 180px"}}>
              <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:5}}>WHAT IT LOOKS LIKE</div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0}}>{t.what}</p>
            </div>
            <div style={{flex:"1 1 180px"}}>
              <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:5}}>WHY IT HAPPENS</div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0}}>{t.why}</p>
            </div>
          </div>
          <div style={{background:clr+"12",border:"1px solid "+clr+"25",borderRadius:10,padding:12}}>
            <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:5}}>YOUR ACTION</div>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0}}>{t.action}</p>
          </div>
        </div>}
      </div>;
    })}
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:14,padding:18,marginBottom:14}}>
      <div style={{fontSize:10,color:C.red,fontFamily:"'DM Mono',monospace",marginBottom:10}}>🚨 CALL HER PROVIDER IF YOU NOTICE:</div>
      {d.your_signs.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{s}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecSleep({lang,C}){
  const d=SLEEP[lang];
  return <div>
    <div style={{background:C.blue+"0d",border:"1px solid "+C.blue+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.rules.map((r,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.accent+"20",borderRadius:12,padding:"14px 18px",marginBottom:10}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:C.accent,marginBottom:6}}>{r.rule}</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0}}>{r.detail}</p>
    </div>)}
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC = {
  en:{
    0:{icon:"🌅",title:"What Is Postpartum?",text:"The postpartum period is the first 12 weeks after birth  -  sometimes called the fourth trimester. Her body is healing, her hormones are resetting, she is learning to feed a newborn, and her identity is shifting. This is the most vulnerable period in new parenthood. Your presence, your effort, and your willingness to do things without being asked are the most important factors in how this period goes for your whole family."},
    4:{icon:"👶",title:"Baby Care Basics",text:"Learn to diaper, swaddle, soothe, and put down to sleep. These are learnable skills. Do not wait for her to teach you. Watch videos. Ask the pediatric nurse. When you can do these things independently, she gets actual rest. If you need her to supervise you with the baby, she cannot rest. Own at least one full care routine completely."},
    5:{icon:"🤱",title:"Supporting Breastfeeding",text:"Breastfeeding is hard. It is a skill that takes weeks to establish and can involve pain, supply anxiety, latch issues, and massive time investment. Your job is not to suggest formula when it gets hard. Your job is to make breastfeeding easier by handling everything else, bringing the baby to her and taking the baby back, making sure she has water and food at every feeding, and asking what she needs without directing her choices."},
    7:{icon:"⭐",title:"Your Role Summary",text:"In the postpartum period your job is physical, not emotional performance. Do the laundry. Cook the food. Take the night shift. Call the pediatrician. Manage the visitors. You do not need to be the perfect emotional support person every moment. You need to reduce the load so her body and mind can recover. The most loving thing you can do in the fourth trimester is reduce the number of decisions she has to make."},
  },
  es:{
    0:{icon:"🌅",title:"¿Qué Es el Postparto?",text:"El período postparto son las primeras 12 semanas después del parto. Su cuerpo está sanando, sus hormonas se están reiniciando, está aprendiendo a alimentar a un recién nacido y su identidad está cambiando. Tu presencia y tu disposición a hacer las cosas sin que te lo pidan son los factores más importantes."},
    4:{icon:"👶",title:"Básicos del Cuidado del Bebé",text:"Aprende a cambiar pañales, envolver, calmar y acostar al bebé. Estas son habilidades que se pueden aprender. No esperes a que ella te enseñe. Si puedes hacer estas cosas de forma independiente, ella puede descansar."},
    5:{icon:"🤱",title:"Apoyar la Lactancia",text:"La lactancia es difícil. Tu trabajo no es sugerir fórmula cuando se pone difícil. Tu trabajo es hacer que la lactancia sea más fácil manejando todo lo demás y asegurándote de que tenga agua y comida en cada toma."},
    7:{icon:"⭐",title:"Resumen de Tu Rol",text:"En el período postparto tu trabajo es físico. Haz la ropa. Cocina la comida. Toma el turno de noche. Lo más amoroso que puedes hacer en el cuarto trimestre es reducir el número de decisiones que ella tiene que tomar."},
  },
  ht:{
    0:{icon:"🌅",title:"Kisa Apre Akouchman Ye?",text:"Peryòd apre akouchman an se premye 12 semèn apre akouchman. Kò li ap geri, òmòn li ap rekonfigire, li ap aprann nouri yon tibebe nouvo, epi idantite li ap chanje. Prezans ou ak volonte ou pou fè bagay san yo mande ou se faktè ki pi enpòtan."},
    4:{icon:"👶",title:"Baz Swen Bebe",text:"Aprann chanje kouchèt, vlope, kalme, ak kouche bebe a. Sa yo se konpetans ki ka aprann. Pa tann li anseye ou. Si ou ka fè bagay sa yo endepandamman, li ka reyèlman repoze."},
    5:{icon:"🤱",title:"Sipòte Alètman",text:"Bay tete difisil. Travay ou se pa sijere bibwon lè sa vin difisil. Travay ou se fè bay tete pi fasil lè ou jere tout lòt bagay epi asire li gen dlo ak manje nan chak manje."},
    7:{icon:"⭐",title:"Rezime Wòl Ou",text:"Nan peryòd apre akouchman an, travay ou fizik. Fè lesiv. Kwit manje. Pran travay lannuit. Pi bagay ki renmen ou ka fè nan twazyèm trimès la se diminye kantite desizyon li dwe pran."},
  },
  fr:{
    0:{icon:"🌅",title:"Qu'est-ce que le Post-partum?",text:"La période post-partum correspond aux 12 premières semaines après la naissance. Son corps guérit, ses hormones se réinitialisent, elle apprend à nourrir un nouveau-né et son identité change. Votre présence et votre volonté de faire les choses sans qu'on vous le demande sont les facteurs les plus importants."},
    4:{icon:"👶",title:"Bases des Soins du Bébé",text:"Apprenez à changer les couches, emmailloter, calmer et coucher le bébé. Ce sont des compétences qui s'apprennent. N'attendez pas qu'elle vous enseigne. Si vous pouvez faire ces choses de manière indépendante, elle peut vraiment se reposer."},
    5:{icon:"🤱",title:"Soutenir l'Allaitement",text:"L'allaitement est difficile. Votre travail n'est pas de suggérer le biberon quand c'est difficile. Votre travail est de faciliter l'allaitement en gérant tout le reste et en vous assurant qu'elle a de l'eau et de la nourriture à chaque tétée."},
    7:{icon:"⭐",title:"Résumé de Votre Rôle",text:"Pendant la période post-partum, votre travail est physique. Faites la lessive. Cuisinez. Prenez le quart de nuit. La chose la plus aimante que vous puissiez faire pendant le quatrième trimestre est de réduire le nombre de décisions qu'elle doit prendre."},
  },
};

export default function PartnerPostpartumGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(true);
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const kpis=[
    {icon:"🌿",value:"12wks",label:lang==="en"?"THE FOURTH TRIMESTER":lang==="es"?"EL CUARTO TRIMESTRE":lang==="ht"?"TWAZYÈM TRIMÈS":"LE QUATRIÈME TRIMESTRE",color:C.accent},
    {icon:"💛",value:"1 in 5",label:lang==="en"?"MOTHERS GET PPD":lang==="es"?"MADRES TIENEN DPP":lang==="ht"?"MANMAN GEN DEPRESYON":"MÈRES ONT DPP",color:C.purple},
    {icon:"😴",value:"#1",label:lang==="en"?"JOB: PROTECT HER SLEEP":lang==="es"?"TRABAJO: PROTEGER SU SUEÑO":lang==="ht"?"TRAVAY: PWOTEJE DÒMI LI":"TRAVAIL: PROTÉGER SON SOMMEIL",color:C.blue},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.teal},
  ];
  const g=GENERIC[lang]||GENERIC.en;
  const renderSection=()=>{
    switch(section){
      case 0: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[0].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[0].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[0].text}</p></div>;
      case 1: return <SecHealing lang={lang} C={C}/>;
      case 2: return <SecMood lang={lang} C={C}/>;
      case 3: return <SecSleep lang={lang} C={C}/>;
      case 4: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[4].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[4].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[4].text}</p></div>;
      case 5: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[5].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[5].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[5].text}</p></div>;
      case 6: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>🚨</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.red,marginBottom:16}}>{lang==="en"?"When to Get Help":lang==="es"?"Cuándo Buscar Ayuda":lang==="ht"?"Ki Lè Pou Chèche Èd":"Quand Chercher de l'Aide"}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto 20px",lineHeight:1.75}}>{lang==="en"?"Call her provider if she is not sleeping at all even when the baby sleeps, if she says the baby would be better off without her, if she is not eating, if she is expressing thoughts of harming herself or the baby, or if she seems disconnected from reality. These are not signs of weakness. They are medical symptoms. You noticing and acting is you being a partner.":lang==="es"?"Llama a su proveedor si no está durmiendo en absoluto, si dice que el bebé estaría mejor sin ella, si no está comiendo, o si expresa pensamientos de hacerse daño. Estos no son signos de debilidad. Son síntomas médicos.":lang==="ht"?"Rele pwofesyonèl li si li pa dòmi menm lè bebe a dòmi, si li di bebe a ta pi bon san li, si li pa manje, oswa si li eksprime panse pou blese tèt li. Sa yo pa siy feblès. Yo se sentòm medikal.":"Appelez son prestataire si elle ne dort pas du tout, si elle dit que le bébé serait mieux sans elle, si elle ne mange pas, ou si elle exprime des pensées de se faire du mal. Ce ne sont pas des signes de faiblesse. Ce sont des symptômes médicaux."}</p></div>;
      case 7: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[7].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.accent,marginBottom:16}}>{g[7].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[7].text}</p></div>;
      default: return null;
    }
  };
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;}button{outline:none;font-family:inherit;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${C.accent}40;border-radius:2px;}`}</style>
      <div style={{background:C.navBg,backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.border,padding:"20px 24px 0",position:"sticky",top:0,zIndex:50,boxShadow:C.shadow}}>
        <div style={{maxWidth:1080,margin:"0 auto"}}>
          <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
              <div style={{flex:1,minWidth:260}}>
                <div style={{fontSize:9.5,letterSpacing:"0.28em",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:5,color:C.faint}}>Dieudonne Partner Hub · Partner Education Series</div>
                <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(20px,3vw,30px)",margin:0,lineHeight:1.05,fontWeight:900}}>
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>The Fourth Trimester: </span>
                  <span style={{background:"linear-gradient(135deg,"+C.teal+","+C.blue+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Showing Up for Recovery </span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Postpartum Support</div>
                  <button onClick={()=>setDark(d=>!d)} style={{background:C.toggleBg,border:"1px solid "+C.border,borderRadius:20,padding:"5px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:11.5,color:C.muted}}>
                    <span>{dark?"☀️":"🌙"}</span><span>{dark?"Light":"Dark"}</span>
                  </button>
                </div>
                <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"9px 12px"}}>
                  <div style={{fontSize:9,color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:7,letterSpacing:"0.15em"}}>SELECT LANGUAGE / CHWAZI LANG</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{LANGS.map(l=><LangBtn key={l.code} {...l} active={lang===l.code} C={C} onClick={setLang}/>)}</div>
                </div>
              </div>
            </div>
            <div style={{paddingBottom:14}}>
              <div style={{position:"relative"}}>
                <select value={section} onChange={e=>setSection(Number(e.target.value))} style={{width:"100%",appearance:"none",WebkitAppearance:"none",background:C.inputBg,border:"1px solid "+C.accent+"50",borderRadius:10,padding:"9px 40px 9px 14px",color:C.accent,fontSize:12,fontFamily:"'DM Mono',monospace",cursor:"pointer",outline:"none",boxShadow:"0 0 0 1px "+C.accent+"20"}}>
                  {navLabels.map((label,i)=><option key={i} value={i} style={{background:dark?"#0f1628":"#fff",color:dark?C.text:"#0f1628"}}>{ICONS[i]}  {label}  ({i+1}/{navLabels.length})</option>)}
                </select>
                <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.accent,fontSize:10,fontFamily:"'DM Mono',monospace"}}>▼</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1080,margin:"0 auto",padding:"26px 20px 80px"}}>
        <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(14px)",transition:"all 0.5s ease 0.08s"}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:22}}>
            {kpis.map((k,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:"14px 18px",flex:"1 1 160px"}}>
              <div style={{fontSize:18,marginBottom:5}}>{k.icon}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(18px,3vw,26px)",color:k.color,lineHeight:1}}>{k.value}</div>
              <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",marginTop:5,lineHeight:1.4}}>{k.label}</div>
            </div>)}
          </div>
          <div style={{marginBottom:20}}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(20px,2.8vw,26px)",margin:"0 0 4px",fontWeight:800}}>{ICONS[section]} {navLabels[section]}</h2>
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
              <div style={{height:2,flex:1,background:"linear-gradient(90deg,"+C.accent+"70,transparent)",borderRadius:1}}/>
              <span style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace"}}>{section+1} / {navLabels.length}</span>
            </div>
          </div>
          <div style={{background:dark?C.accent+"03":C.card,border:"1px solid "+C.border,borderRadius:22,padding:"24px 22px",boxShadow:dark?"none":C.shadow}}>
            {renderSection()}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:22,paddingTop:18,borderTop:"1px solid "+C.border}}>
            {section>0?<button onClick={()=>setSection(s=>s-1)} style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"8px 18px",color:C.muted,fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{ICONS[section-1]} {navLabels[section-1]}</button>:<div/>}
            {section<navLabels.length-1?<button onClick={()=>setSection(s=>s+1)} style={{background:C.accent+"18",border:"1px solid "+C.accent+"45",borderRadius:10,padding:"8px 18px",color:C.accent,fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{navLabels[section+1]} {ICONS[section+1]} {"->"}</button>:<div/>}
          </div>
          <div style={{textAlign:"center",fontSize:10.5,marginTop:24,lineHeight:1.7,color:dark?"rgba(148,163,184,0.22)":"rgba(30,41,59,0.35)",fontFamily:"'DM Mono',monospace"}}>Dieudonne Partner Hub · Created by and Researched by Chery Talent Management Agency</div>
        </div>
      </div>
    </div>
  );
}
