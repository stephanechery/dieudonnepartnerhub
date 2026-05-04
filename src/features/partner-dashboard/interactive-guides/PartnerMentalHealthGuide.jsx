import { useState, useEffect } from "react";
const DARK={bg:"#080d1a",card:"#0f1628",cardAlt:"#111827",border:"rgba(148,163,184,0.1)",text:"#f1f5f9",muted:"#e2e8f0",faint:"rgba(226,232,240,0.55)",accent:"#f59e0b",teal:"#22d3ee",purple:"#a78bfa",gold:"#fbbf24",green:"#34d399",red:"#f87171",orange:"#fb923c",blue:"#60a5fa",pink:"#e879f9",navBg:"rgba(8,13,26,0.96)",shadow:"0 4px 24px rgba(0,0,0,0.4)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f4f6fb",card:"#ffffff",cardAlt:"#f8fafc",border:"rgba(15,22,40,0.1)",text:"#0f1628",muted:"#1e293b",faint:"rgba(30,41,59,0.5)",accent:"#d97706",teal:"#0891b2",purple:"#7c3aed",gold:"#d97706",green:"#059669",red:"#dc2626",orange:"#ea580c",blue:"#2563eb",pink:"#c026d3",navBg:"rgba(244,246,251,0.97)",shadow:"0 4px 24px rgba(15,22,40,0.1)",inputBg:"rgba(15,22,40,0.04)",toggleBg:"rgba(15,22,40,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["You Matter Too","Paternal Depression","Identity Shift","Relationship Changes","Practical Coping","When to Get Help","Supporting Each Other","Moving Forward Together"],
  es:["Tú También Importas","Depresión Paterna","Cambio de Identidad","Cambios en la Relación","Afrontamiento Práctico","Cuándo Buscar Ayuda","Apoyarse Mutuamente","Avanzar Juntos"],
  ht:["Ou Enpòtan Tou","Depresyon Patènèl","Chanjman Idantite","Chanjman Relasyon","Fè Fas Pratik","Ki Lè Pou Chèche Èd","Sipòte Youn lòt","Avanse Ansanm"],
  fr:["Vous Comptez Aussi","Dépression Paternelle","Changement d'Identité","Changements Relationnels","Adaptation Pratique","Quand Chercher de l'Aide","Se Soutenir Mutuellement","Avancer Ensemble"],
};
const ICONS=["💛","🧠","🔄","💑","🛠️","🚨","🤝","🌅"];

const PPD_PARTNER = {
  en:{
    title:"Paternal Postpartum Depression: It Is Real and It Is Common",
    intro:"Up to 1 in 10 fathers and partners experience postpartum depression. This number is likely higher because it is significantly underreported  -  partners are rarely screened, rarely asked, and often carry the cultural expectation of being strong for the family. You cannot pour from an empty cup. Your mental health is not a luxury. It is infrastructure.",
    what:"Paternal postpartum depression (PPPD) typically appears in the first year after birth. It often looks different than maternal PPD  -  more irritability, withdrawal, numbness, and reckless behavior than classic sadness. Many partners describe it as feeling checked out, disconnected, or like they are watching their life happen from outside it.",
    signs:[
      "Persistent irritability or anger that feels disproportionate",
      "Withdrawing from the baby, the partner, or social life",
      "Numbness  -  feeling very little rather than feeling sad",
      "Increasing use of alcohol or other numbing behaviors",
      "Difficulty sleeping even when you have the opportunity",
      "Intrusive thoughts about something bad happening to the baby",
      "Feeling like a fraud or like you made a terrible mistake",
      "Loss of interest in things you used to enjoy",
      "Feeling like everyone would be better off without you",
    ],
    important:"If you are experiencing thoughts of harming yourself or feeling like everyone would be better off without you, please reach out to your primary care provider today or call or text 988 (Suicide and Crisis Lifeline in the US).",
    why:"The causes are hormonal (testosterone levels drop in new fathers), psychological (identity shift, loss of the previous life), and social (isolation, lack of support, cultural expectations to be stoic). This is not weakness. It is a medical condition with biological roots.",
    discussion:"Have you noticed any of these signs in yourself? When was the last time someone asked how you were doing  -  not as a parent, but as a person?",
  },
  es:{
    title:"Depresión Postparto Paterna: Es Real y Es Común",
    intro:"Hasta 1 de cada 10 padres y parejas experimentan depresión postparto. Este número es probablemente mayor porque está significativamente sub-reportado. Tu salud mental no es un lujo. Es infraestructura.",
    what:"La depresión postparto paterna (DPPP) generalmente aparece en el primer año después del nacimiento. A menudo se ve diferente que la DPP materna  -  más irritabilidad, retraimiento, entumecimiento y comportamiento imprudente que tristeza clásica.",
    signs:[
      "Irritabilidad o ira persistente que se siente desproporcionada",
      "Retiro del bebé, la pareja o la vida social",
      "Entumecimiento  -  sentir muy poco en lugar de tristeza",
      "Aumento del uso de alcohol u otros comportamientos que adormecen",
      "Dificultad para dormir incluso cuando tienes la oportunidad",
      "Pensamientos intrusivos sobre que algo malo le sucede al bebé",
      "Sentirse un fraude o como si hubieras cometido un terrible error",
      "Pérdida de interés en cosas que solías disfrutar",
      "Sentir que todos estarían mejor sin ti",
    ],
    important:"Si estás teniendo pensamientos de hacerte daño, comunícate con tu médico de atención primaria hoy o llama al 988 (Lifeline de Crisis en EE.UU.).",
    why:"Las causas son hormonales, psicológicas y sociales. Los niveles de testosterona caen en los nuevos padres. Esto no es debilidad. Es una condición médica con raíces biológicas.",
    discussion:"¿Has notado alguno de estos signos en ti mismo? ¿Cuándo fue la última vez que alguien te preguntó cómo estabas  -  no como padre, sino como persona?",
  },
  ht:{
    title:"Depresyon Apre Akouchman Patènèl: Li Reyèl epi Li Kouran",
    intro:"Jiska 1 nan 10 papa ak patnè eksperyanse depresyon apre akouchman. Nimewo sa a pwobabalman pi wo paske li siyifikativman pa rapòte. Sante mantal ou pa yon lukse. Se enfrastrikti.",
    what:"Depresyon apre akouchman patènèl (DAAP) tipikman parèt nan premye ane apre nesans. Li souvan sanble diferan pase depresyon manman - plis iritabilite, retrè, anbisyon, ak konpòtman enpridans pase tristès klasik.",
    signs:[
      "Iritabilite oswa kòlè pèsistan ki parèt dispreyorsyonèl",
      "Retire tèt ou nan bebe a, patnè a, oswa lavi sosyal",
      "Anbisyon - santi trè ti pase santi tris",
      "Ogmantasyon itilizasyon alkòl oswa lòt konpòtman ki moufi",
      "Difikilte dòmi menm lè ou gen opòtinite",
      "Panse entrizif sou yon bagay mal ki rive bebe a",
      "Santi ou yon fo oswa tankou ou te fè yon erè terib",
      "Pèt enterè nan bagay ou te konn pran plezi",
      "Santi tout moun ta pi bon san ou",
    ],
    important:"Si ou ap fè eksperyans panse pou blese tèt ou oswa santi tout moun ta pi bon san ou, tanpri kontakte pwofesyonèl swen prensipal ou jodi a oswa rele oswa voye 988 (Liy Kriz Etazini).",
    why:"Kòz yo hormonal, sikolojik, ak sosyal. Nivo testostewòn tonbe nan nouvo papa. Sa a pa feblès. Se yon kondisyon medikal ak rasin byolojik.",
    discussion:"Eske ou te remake youn nan siy sa yo nan tèt ou? Ki lè dènye fwa yon moun te mande kòman ou te ye - pa kòm yon paran, men kòm yon moun?",
  },
  fr:{
    title:"Dépression Post-partum Paternelle: Elle Est Réelle et Courante",
    intro:"Jusqu'à 1 père ou partenaire sur 10 souffre de dépression post-partum. Ce chiffre est probablement plus élevé car il est significativement sous-déclaré. Votre santé mentale n'est pas un luxe. C'est une infrastructure.",
    what:"La dépression post-partum paternelle (DPPP) apparaît généralement dans la première année après la naissance. Elle ressemble souvent différemment de la DPP maternelle  -  plus d'irritabilité, de retrait, d'engourdissement et de comportement imprudent que de tristesse classique.",
    signs:[
      "Irritabilité ou colère persistante qui semble disproportionnée",
      "Retrait du bébé, du partenaire ou de la vie sociale",
      "Engourdissement  -  ressentir très peu plutôt que de la tristesse",
      "Augmentation de la consommation d'alcool ou d'autres comportements anesthésiants",
      "Difficulté à dormir même quand vous en avez l'occasion",
      "Pensées intrusives sur quelque chose de mauvais arrivant au bébé",
      "Sentir comme un imposteur ou comme si vous aviez fait une terrible erreur",
      "Perte d'intérêt pour les choses que vous aimiez",
      "Sentir que tout le monde serait mieux sans vous",
    ],
    important:"Si vous avez des pensées de vous faire du mal, veuillez contacter votre médecin traitant aujourd'hui ou appeler le 3114 (numéro national de prévention du suicide en France).",
    why:"Les causes sont hormonales, psychologiques et sociales. Les niveaux de testostérone chutent chez les nouveaux pères. Ce n'est pas de la faiblesse. C'est une condition médicale aux racines biologiques.",
    discussion:"Avez-vous remarqué l'un de ces signes en vous-même? Quand quelqu'un vous a-t-il demandé pour la dernière fois comment vous alliez  -  pas en tant que parent, mais en tant que personne?",
  },
};

const IDENTITY = {
  en:{
    title:"Identity Shift: Who Are You Now?",
    intro:"Becoming a parent is one of the most significant identity shifts a person experiences. It is not just a role change  -  it is a fundamental reorganization of how you understand yourself, your time, your relationships, and your future. Most partners are not prepared for how disorienting this is.",
    shifts:[
      {shift:"Loss of the previous self",desc:"Activities, freedoms, and parts of your identity that feel unavailable. This is a real loss even inside a wanted pregnancy. Grieving it is healthy, not selfish."},
      {shift:"Relationship with your own father",desc:"Becoming a parent brings up everything about how you were parented  -  what you want to repeat and what you desperately want to change. This can surface complicated grief, anger, and tenderness."},
      {shift:"Redefining manhood or partnership",desc:"Cultural scripts about what a father or male partner should be may conflict with what you actually want to do or feel. Examining those scripts is healthy."},
      {shift:"New relationship with vulnerability",desc:"Having a child makes the world feel more fragile. Fear, protectiveness, and tenderness that were previously inaccessible may arrive. This is not weakness. It is expansion."},
      {shift:"Purpose and legacy",desc:"Many new parents experience a deepening sense of purpose and connection to the future. This can co-exist with overwhelm and fear. Both are true at once."},
    ],
    honest:"If you feel like you are losing yourself in parenthood, that feeling is real and valid. The goal is not to return to who you were before. The goal is to integrate who you are now with who you are becoming. That takes time, support, and grace.",
    discussion:"How has your sense of yourself changed since you found out about the pregnancy? What parts of your previous life do you most miss? What new parts of yourself have surprised you?",
  },
  es:{
    title:"Cambio de Identidad: ¿Quién Eres Ahora?",
    intro:"Convertirse en padre es uno de los cambios de identidad más significativos que experimenta una persona. La mayoría de las parejas no están preparadas para lo desorientador que es esto.",
    shifts:[
      {shift:"Pérdida del yo anterior",desc:"Actividades, libertades y partes de tu identidad que se sienten no disponibles. Esto es una pérdida real incluso dentro de un embarazo deseado. Lamentarlo es saludable, no egoísta."},
      {shift:"Relación con tu propio padre",desc:"Convertirse en padre evoca todo sobre cómo fuiste criado  -  lo que quieres repetir y lo que desesperadamente quieres cambiar."},
      {shift:"Redefinir la masculinidad o la pareja",desc:"Los guiones culturales sobre lo que debe ser un padre pueden entrar en conflicto con lo que realmente quieres hacer o sentir."},
      {shift:"Nueva relación con la vulnerabilidad",desc:"Tener un hijo hace que el mundo se sienta más frágil. El miedo, la protección y la ternura pueden llegar. Esto no es debilidad. Es expansión."},
      {shift:"Propósito y legado",desc:"Muchos nuevos padres experimentan un profundo sentido de propósito. Esto puede coexistir con el agobio y el miedo."},
    ],
    honest:"Si sientes que te estás perdiendo en la paternidad, ese sentimiento es real y válido. El objetivo no es volver a quien eras antes. El objetivo es integrar quién eres ahora con quién te estás convirtiendo.",
    discussion:"¿Cómo ha cambiado tu sentido de ti mismo desde que te enteraste del embarazo? ¿Qué partes de tu vida anterior extrañas más? ¿Qué nuevas partes de ti mismo te han sorprendido?",
  },
  ht:{
    title:"Chanjman Idantite: Ki Moun Ou Ye Kounye a?",
    intro:"Vin yon paran se youn nan chanjman idantite ki pi enpòtan yon moun eksperyanse. Pifò patnè pa prepare pou konbyen sa dezoryante.",
    shifts:[
      {shift:"Pèt moi anvan an",desc:"Aktivite, libète, ak pati nan idantite ou ki parèt pa disponib. Sa a se yon pèt reyèl menm nan yon gwosès vle. Dèy li sante, pa egoyis."},
      {shift:"Relasyon ak papa pwòp tèt ou",desc:"Vin yon paran leve tout bagay sou kòman ou te elve - kisa ou vle repete ak kisa ou dezespewaman vle chanje."},
      {shift:"Redefinisyon virilite oswa patènaj",desc:"Skri kiltirèl sou kisa yon papa ta dwe ka konfli avèk sa ou reyèlman vle fè oswa santi."},
      {shift:"Nouvo relasyon ak vilnerabilite",desc:"Gen yon timoun rann mond lan parèt plis frajil. Pè, pwoteksyon, ak tandrès ka rive. Sa a pa feblès. Se ekspansyon."},
      {shift:"Objektif ak eritaj",desc:"Anpil nouvo paran eksperyanse yon sans objektif pi pwofon. Sa a ka koegziste ak debòde ak pè."},
    ],
    honest:"Si ou santi ou pèdi tèt ou nan patènaj, santi sa reyèl ak valid. Objektif la se pa retounen nan ki moun ou te ye anvan. Objektif la se entegre ki moun ou ye kounye a ak ki moun ou ap vin.",
    discussion:"Kòman sans ou menm chanje depi ou te aprann sou gwosès la? Ki pati nan lavi ou anvan ou pi mal? Ki nouvo pati nan tèt ou te sipriz ou?",
  },
  fr:{
    title:"Changement d'Identité: Qui Êtes-vous Maintenant?",
    intro:"Devenir parent est l'un des changements d'identité les plus significatifs qu'une personne expérimente. La plupart des partenaires ne sont pas préparés à quel point c'est désorientant.",
    shifts:[
      {shift:"Perte du moi précédent",desc:"Des activités, des libertés et des parties de votre identité qui semblent indisponibles. C'est une vraie perte même dans une grossesse désirée. La pleurer est sain, pas égoïste."},
      {shift:"Relation avec votre propre père",desc:"Devenir parent fait remonter tout ce qui concerne la façon dont vous avez été élevé  -  ce que vous voulez répéter et ce que vous voulez désespérément changer."},
      {shift:"Redéfinir la virilité ou le partenariat",desc:"Les scripts culturels sur ce que doit être un père peuvent entrer en conflit avec ce que vous voulez réellement faire ou ressentir."},
      {shift:"Nouvelle relation avec la vulnérabilité",desc:"Avoir un enfant rend le monde plus fragile. La peur, la protection et la tendresse peuvent arriver. Ce n'est pas de la faiblesse. C'est de l'expansion."},
      {shift:"But et héritage",desc:"De nombreux nouveaux parents vivent un sens profond du but. Cela peut coexister avec l'accablement et la peur."},
    ],
    honest:"Si vous avez l'impression de vous perdre dans la parentalité, ce sentiment est réel et valide. L'objectif n'est pas de revenir à qui vous étiez avant. L'objectif est d'intégrer qui vous êtes maintenant avec qui vous devenez.",
    discussion:"Comment votre sens de vous-même a-t-il changé depuis que vous avez appris la grossesse? Quelles parties de votre vie précédente vous manquent le plus? Quelles nouvelles parties de vous-même vous ont surpris?",
  },
};

const COPING = {
  en:{
    title:"Practical Coping: What Actually Helps",
    intro:"Coping during this season is not about being stoic or pushing through. It is about building sustainable habits that preserve your capacity. Here is what research and experience say actually helps for partners.",
    strategies:[
      {name:"Sleep protection",icon:"😴",color:"blue",detail:"Sleep deprivation is a primary driver of mood disruption, irritability, and impaired judgment. Protecting your sleep  -  even imperfectly  -  is one of the most effective mental health interventions available. This means negotiating shifts, napping strategically, and not sacrificing all recovery sleep to productivity."},
      {name:"Physical movement",icon:"🏃",color:"green",detail:"Exercise is one of the most evidence-supported interventions for depression and anxiety. It does not need to be formal. A 20-minute walk creates measurable mood benefit. Prioritize it even when  -  especially when  -  it feels impossible."},
      {name:"Social connection",icon:"👥",color:"teal",detail:"Isolation amplifies everything negative. Find at least one other new father or partner to talk to honestly. You do not need a support group. You need one honest conversation about how hard this actually is. The normalization alone helps."},
      {name:"Something that is yours",icon:"⚽",color:"purple",detail:"One activity that is not parenting or working or supporting her. One thing that is just for you. This is not selfishness  -  it is sustainability. You cannot give what you do not have."},
      {name:"Talk to someone",icon:"💬",color:"orange",detail:"A therapist, a doctor, a close friend, a pastor, a coach. Someone who asks about you specifically and has capacity to hold what you share. Asking for support is not weakness. It is intelligence."},
    ],
    not_helpful:["Alcohol or substances as the primary coping mechanism","Disappearing into work as a way to avoid the emotional intensity at home","Minimizing your feelings ('I shouldn't feel this way, she has it harder')","Waiting until crisis to seek help"],
    discussion:"What is your current primary coping strategy? Is it actually helping or is it numbing? What would it take to add one healthy strategy this week?",
  },
  es:{
    title:"Afrontamiento Práctico: Lo Que Realmente Ayuda",
    intro:"Afrontar esta temporada no se trata de ser estoico o resistir. Se trata de construir hábitos sostenibles que preserven tu capacidad.",
    strategies:[
      {name:"Protección del sueño",icon:"😴",color:"blue",detail:"La privación del sueño es un motor primario de la interrupción del estado de ánimo. Proteger tu sueño  -  incluso imperfectamente  -  es una de las intervenciones de salud mental más efectivas disponibles."},
      {name:"Movimiento físico",icon:"🏃",color:"green",detail:"El ejercicio es una de las intervenciones más respaldadas por evidencia para la depresión y la ansiedad. Un paseo de 20 minutos crea beneficio medible en el estado de ánimo."},
      {name:"Conexión social",icon:"👥",color:"teal",detail:"El aislamiento amplifica todo lo negativo. Encuentra al menos otro nuevo padre con quien hablar honestamente."},
      {name:"Algo que sea tuyo",icon:"⚽",color:"purple",detail:"Una actividad que no sea paternidad, trabajo o apoyarla. Algo solo para ti. Esto no es egoísmo  -  es sostenibilidad."},
      {name:"Habla con alguien",icon:"💬",color:"orange",detail:"Un terapeuta, un médico, un amigo cercano. Alguien que te pregunte específicamente sobre ti. Pedir apoyo no es debilidad."},
    ],
    not_helpful:["Alcohol o sustancias como mecanismo principal de afrontamiento","Desaparecer en el trabajo para evitar la intensidad emocional en casa","Minimizar tus sentimientos ('No debería sentirme así, ella lo tiene más difícil')","Esperar hasta la crisis para buscar ayuda"],
    discussion:"¿Cuál es tu estrategia principal de afrontamiento actual? ¿Realmente ayuda o adormece? ¿Qué se necesitaría para agregar una estrategia saludable esta semana?",
  },
  ht:{
    title:"Fe Fas Pratik: Kisa Ki Reyèlman Ede",
    intro:"Fè fas nan sezon sa a pa konsène pou estoik oswa pouse pase. Se konstwi abitid dirab ki konsève kapasite ou.",
    strategies:[
      {name:"Pwoteksyon dòmi",icon:"😴",color:"blue",detail:"Privasyasyon dòmi se yon chofè prensipal pwoblèm emosyonèl. Pwoteje dòmi ou - menm impafen - se youn nan entèvansyon sante mantal ki pi efikas disponib."},
      {name:"Mouvman fizik",icon:"🏃",color:"green",detail:"Egzèsis se youn nan entèvansyon ki pi sipòte prèv pou depresyon ak enkyetid. Yon mach 20 minit kreye benefis emosyonèl mezurab."},
      {name:"Koneksyon sosyal",icon:"👥",color:"teal",detail:"Izolasyon amplifye tout bagay negatif. Jwenn omwen yon lòt nouvo papa pou pale onètman avèk."},
      {name:"Yon bagay ki se pa ou",icon:"⚽",color:"purple",detail:"Yon aktivite ki pa patènaj, travay, oswa sipòte li. Yon bagay jis pou ou. Sa a pa egoyis  -  se dirab."},
      {name:"Pale ak yon moun",icon:"💬",color:"orange",detail:"Yon terapis, yon doktè, yon zanmi pwòch. Yon moun ki mande sou ou espesyalman. Mande sipò pa feblès."},
    ],
    not_helpful:["Alkòl oswa sibstans kòm mekanis prensipal pou fè fas","Disparèt nan travay pou evite entansite emosyonèl lakay","Minimize santi ou ('Mwen pa ta dwe santi konsa, li gen li pi difisil')","Tann jiska kriz pou chèche èd"],
    discussion:"Ki estrateji fè fas prensipal ou kounye a? Eske li reyèlman ede oswa li moufi? Kisa ki ta pran pou ajoute yon estrateji an sante semèn sa a?",
  },
  fr:{
    title:"Adaptation Pratique: Ce qui Aide Vraiment",
    intro:"S'adapter pendant cette saison ne consiste pas à être stoïque ou à pousser. Il s'agit de construire des habitudes durables qui préservent votre capacité.",
    strategies:[
      {name:"Protection du sommeil",icon:"😴",color:"blue",detail:"La privation de sommeil est un moteur principal des perturbations de l'humeur. Protéger votre sommeil  -  même imparfaitement  -  est l'une des interventions de santé mentale les plus efficaces disponibles."},
      {name:"Mouvement physique",icon:"🏃",color:"green",detail:"L'exercice est l'une des interventions les plus soutenues par les preuves pour la dépression et l'anxiété. Une marche de 20 minutes crée un bénéfice mesurable sur l'humeur."},
      {name:"Connexion sociale",icon:"👥",color:"teal",detail:"L'isolement amplifie tout ce qui est négatif. Trouvez au moins un autre nouveau père avec qui parler honnêtement."},
      {name:"Quelque chose qui vous appartient",icon:"⚽",color:"purple",detail:"Une activité qui n'est pas la parentalité, le travail ou la soutenir. Quelque chose juste pour vous. Ce n'est pas de l'égoïsme  -  c'est de la durabilité."},
      {name:"Parlez à quelqu'un",icon:"💬",color:"orange",detail:"Un thérapeute, un médecin, un ami proche. Quelqu'un qui vous pose des questions spécifiquement sur vous. Demander du soutien n'est pas de la faiblesse."},
    ],
    not_helpful:["L'alcool ou les substances comme mécanisme d'adaptation principal","Disparaître dans le travail pour éviter l'intensité émotionnelle à la maison","Minimiser vos sentiments ('Je ne devrais pas me sentir ainsi, elle a plus difficile')","Attendre la crise pour chercher de l'aide"],
    discussion:"Quelle est votre stratégie d'adaptation principale actuelle? Aide-t-elle vraiment ou anesthésie-t-elle? Qu'est-ce qu'il faudrait pour ajouter une stratégie saine cette semaine?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecPPD({lang,C}){
  const d=PPD_PARTNER[lang];
  return <div>
    <div style={{background:C.blue+"0d",border:"1px solid "+C.blue+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0}}>{d.what}</p>
    </div>
    <div style={{background:C.orange+"0a",border:"1px solid "+C.orange+"22",borderRadius:14,padding:18,marginBottom:16}}>
      <div style={{fontSize:10,color:C.orange,fontFamily:"'DM Mono',monospace",marginBottom:10}}>SIGNS TO WATCH FOR IN YOURSELF</div>
      {d.signs.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.orange,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{s}</span>
      </div>)}
    </div>
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:10,padding:14,marginBottom:16}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.important}</p>
    </div>
    <div style={{background:C.teal+"0a",border:"1px solid "+C.teal+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.why}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecIdentity({lang,C}){
  const d=IDENTITY[lang];
  const [open,setOpen]=useState(null);
  return <div>
    <div style={{background:C.purple+"0d",border:"1px solid "+C.purple+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.shifts.map((s,i)=>{
      const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?C.purple+"0e":C.cardAlt,border:"1px solid "+(isOpen?C.purple:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?C.purple:C.text,flex:1}}>{s.shift}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:"12px 0 0",paddingTop:12,borderTop:"1px solid "+C.purple+"20"}}>{s.desc}</p>}
      </div>;
    })}
    <div style={{background:C.accent+"0a",border:"1px solid "+C.accent+"22",borderRadius:12,padding:16,marginBottom:14}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0,fontStyle:"italic"}}>{d.honest}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecCoping({lang,C}){
  const d=COPING[lang];
  const [open,setOpen]=useState(null);
  const cm={blue:C.blue,green:C.green,teal:C.teal,purple:C.purple,orange:C.orange};
  return <div>
    <div style={{background:C.green+"0d",border:"1px solid "+C.green+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.strategies.map((s,i)=>{
      const clr=cm[s.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:20}}>{s.icon}</span>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{s.name}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:"12px 0 0",paddingTop:12,borderTop:"1px solid "+clr+"20"}}>{s.detail}</p>}
      </div>;
    })}
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:14,padding:16,marginBottom:14}}>
      <div style={{fontSize:10,color:C.red,fontFamily:"'DM Mono',monospace",marginBottom:10}}>🚫 WHAT DOES NOT HELP LONG TERM</div>
      {d.not_helpful.map((item,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{item}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC_DATA={
  en:{
    0:{icon:"💛",text:"This guide is not about making you a better partner. It is about making sure you survive this season too. Partners are expected to support, provide, protect, and be present  -  while receiving very little specific support themselves. The mental health of the partner matters for the family's wellbeing, the baby's development, and the relationship's survival. You are not secondary. You are essential. And essential things require care."},
    3:{icon:"💑",title:"Relationship Changes",text:"Your relationship before baby and your relationship after baby are two different relationships. The transition can feel like loss even when it is also growth. Less spontaneous time together, changed intimacy, new friction over division of labor  -  all of this is normal and all of it is workable with communication. The couples who name what is hard are better positioned to navigate it. The couples who pretend nothing has changed are the ones who drift."},
    5:{icon:"🚨",title:"When to Get Help",text:"Get help when: you cannot feel anything positive for several weeks running, you are using alcohol or substances daily to cope, you have thoughts of harming yourself or the family, you cannot function at work or at home, she is scared of you, you are scared of yourself, or you have not slept more than 3 hours in multiple days. In the US: call your primary care doctor, call 988 (Crisis Lifeline), or go to your nearest emergency room. Getting help is the most courageous and the most responsible thing you can do for your family."},
    6:{icon:"🤝",title:"Supporting Each Other",text:"Two depleted people cannot pour from empty cups into each other. Supporting each other during this season requires honesty about your own state, tolerance for imperfection, gratitude for small things, and a commitment to not making the other person's exhaustion a competition. The most powerful thing you can do is ask: How are you actually doing? And then listen to the answer without immediately pivoting to yourself or trying to fix it."},
    7:{icon:"🌅",title:"Moving Forward Together",text:"This season is temporary. The overwhelm, the exhaustion, the identity confusion, the relationship friction  -  these are features of a transition, not permanent states. The families who navigate new parenthood best are not the ones who feel it less. They are the ones who face it together, ask for help, say what is hard, and choose each other deliberately even when it is not easy. You are doing something extraordinary. Give yourself the grace you give everyone else."},
  },
  es:{
    0:{icon:"💛",text:"Esta guía no se trata de hacerte un mejor pareja. Se trata de asegurarse de que tú también sobrevivas esta temporada. La salud mental del pareja importa para el bienestar de la familia. No eres secundario. Eres esencial. Y las cosas esenciales requieren cuidado."},
    3:{icon:"💑",title:"Cambios en la Relación",text:"Tu relación antes del bebé y tu relación después del bebé son dos relaciones diferentes. La transición puede sentirse como una pérdida incluso cuando también es crecimiento. Las parejas que nombran lo que es difícil están mejor posicionadas para navegarlo."},
    5:{icon:"🚨",title:"Cuándo Buscar Ayuda",text:"Busca ayuda cuando: no puedes sentir nada positivo durante varias semanas, estás usando alcohol o sustancias diariamente para afrontar, tienes pensamientos de hacerte daño, no puedes funcionar en el trabajo o en casa. En EE.UU.: llama al 988 (Línea de Crisis) o ve a la sala de emergencias más cercana."},
    6:{icon:"🤝",title:"Apoyarse Mutuamente",text:"Dos personas agotadas no pueden verterse mutuamente de tazas vacías. Apoyarse mutuamente durante esta temporada requiere honestidad sobre tu propio estado y compromiso de no hacer de el agotamiento del otro una competencia."},
    7:{icon:"🌅",title:"Avanzar Juntos",text:"Esta temporada es temporal. Las familias que navegan mejor la nueva paternidad no son las que la sienten menos. Son las que la enfrentan juntas, piden ayuda, dicen lo que es difícil y se eligen deliberadamente incluso cuando no es fácil."},
  },
  ht:{
    0:{icon:"💛",text:"Gid sa a pa konsène pou fè ou yon pi bon patnè. Se pou asire ou siviv sezon sa a tou. Sante mantal patnè a enpòtan pou byennèt fanmiy nan. Ou pa segondè. Ou esansyèl. Epi bagay esansyèl mande swen."},
    3:{icon:"💑",title:"Chanjman Relasyon",text:"Relasyon ou anvan bebe ak relasyon ou apre bebe se de relasyon diferan. Tranzisyon an ka sanble pèt menm lè li tou kwasans. Koup ki nonmen sa ki difisil yo pi bon pozisyon pou navige li."},
    5:{icon:"🚨",title:"Ki Lè Pou Chèche Èd",text:"Chèche èd lè: ou pa ka santi anyen pozitif pou plizyè semèn, ou itilize alkòl oswa sibstans chak jou pou fè fas, ou gen panse pou blese tèt ou. Nan Etazini: rele 988 (Liy Kriz) oswa ale nan salman ijans ki pi pre ou."},
    6:{icon:"🤝",title:"Sipòte Youn lòt",text:"De moun epwize pa ka vèse nan youn lòt nan tas vid. Sipòte youn lòt pandan sezon sa a mande onèstete sou eta pwòp tèt ou ak angajman pou pa fè fatig lòt moun yon konpetisyon."},
    7:{icon:"🌅",title:"Avanse Ansanm",text:"Sezon sa a tanporè. Fanmiy ki pi byen navige patènaj nouvo yo pa sa ki santi li mwens. Se sa ki fè fas avèk li ansanm, mande èd, di kisa ki difisil, epi chwazi youn lòt delibereman menm lè se pa fasil."},
  },
  fr:{
    0:{icon:"💛",text:"Ce guide ne concerne pas vous rendre un meilleur partenaire. Il s'agit de vous assurer que vous survivez également à cette saison. La santé mentale du partenaire est importante pour le bien-être de la famille. Vous n'êtes pas secondaire. Vous êtes essentiel. Et les choses essentielles nécessitent des soins."},
    3:{icon:"💑",title:"Changements Relationnels",text:"Votre relation avant bébé et votre relation après bébé sont deux relations différentes. Les couples qui nomment ce qui est difficile sont mieux positionnés pour le naviguer."},
    5:{icon:"🚨",title:"Quand Chercher de l'Aide",text:"Cherchez de l'aide quand: vous ne pouvez rien ressentir de positif pendant plusieurs semaines, vous utilisez de l'alcool ou des substances quotidiennement. En France: appelez le 3114 (numéro national de prévention du suicide) ou allez aux urgences les plus proches."},
    6:{icon:"🤝",title:"Se Soutenir Mutuellement",text:"Deux personnes épuisées ne peuvent pas se verser mutuellement de tasses vides. Se soutenir mutuellement pendant cette saison nécessite une honnêteté sur votre propre état et un engagement à ne pas faire de l'épuisement de l'autre une compétition."},
    7:{icon:"🌅",title:"Avancer Ensemble",text:"Cette saison est temporaire. Les familles qui naviguent le mieux la nouvelle parentalité ne sont pas celles qui la ressentent moins. Ce sont celles qui l'affrontent ensemble, demandent de l'aide, disent ce qui est difficile, et se choisissent délibérément même quand ce n'est pas facile."},
  },
};

export default function PartnerMentalHealthGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(true);
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_DATA[lang]||GENERIC_DATA.en;
  const kpis=[
    {icon:"🧠",value:"1 in 10",label:lang==="en"?"PARTNERS GET PATERNAL PPD":lang==="es"?"PAREJAS TIENEN DPP PATERNA":lang==="ht"?"PATNÈ GEN DEPRESYON":"PARTENAIRES ONT DPP PATERNELLE",color:C.blue},
    {icon:"💛",value:"You",label:lang==="en"?"MATTER TOO":lang==="es"?"IMPORTAS TAMBIÉN":lang==="ht"?"ENPÒTAN TOU":"COMPTEZ AUSSI",color:C.accent},
    {icon:"🛠️",value:"5",label:lang==="en"?"COPING STRATEGIES":lang==="es"?"ESTRATEGIAS DE AFRONTAMIENTO":lang==="ht"?"ESTRATEJI FÈ FAS":"STRATÉGIES D'ADAPTATION",color:C.green},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.teal},
  ];
  const renderSection=()=>{
    const genDiv=(icon,title,text)=><div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{icon}</div>{title&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>}<p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{text}</p></div>;
    switch(section){
      case 0: return genDiv(g[0].icon,null,g[0].text);
      case 1: return <SecPPD lang={lang} C={C}/>;
      case 2: return <SecIdentity lang={lang} C={C}/>;
      case 3: return genDiv(g[3].icon,g[3].title,g[3].text);
      case 4: return <SecCoping lang={lang} C={C}/>;
      case 5: return genDiv(g[5].icon,g[5].title,g[5].text);
      case 6: return genDiv(g[6].icon,g[6].title,g[6].text);
      case 7: return genDiv(g[7].icon,g[7].title,g[7].text);
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Your Mental Health </span>
                  <span style={{background:"linear-gradient(135deg,"+C.blue+","+C.purple+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Matters Too </span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Partner Mental Health</div>
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
