import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["Why Talk Now","Birth Preferences","Parenting Values","Managing Fear Together","Hard Conversations","What NOT to Say","Staying Connected","Discussion Starters"],
  es:["Por Qué Hablar Ahora","Preferencias del Parto","Valores de Crianza","Manejar el Miedo Juntos","Conversaciones Difíciles","Qué NO Decir","Mantenerse Conectados","Iniciadores de Discusión"],
  ht:["Poukisa Pale Kounye a","Preferans Akouchman","Valè Patènaj","Jere Pè Ansanm","Konvèsasyon Difisil","Kisa POU PA Di","Rete Konekte","Kòmansè Diskisyon"],
  fr:["Pourquoi Parler Maintenant","Préférences d'Accouchement","Valeurs Parentales","Gérer la Peur Ensemble","Conversations Difficiles","Ce qu'il ne Faut PAS Dire","Rester Connectés","Amorces de Discussion"],
};
const ICONS=["💬","📋","🌱","😨","🔥","🚫","💑","🎯"];

const BIRTH_PREFS = {
  en:{
    title:"Birth Preferences: The Conversation That Cannot Wait",
    intro:"The birth plan is not bureaucracy. It is a communication tool that tells every provider, nurse, and support person what she wants  -  and what she does not. Your job is to know it better than she does, because she will not be able to speak for herself at peak labor.",
    topics:[
      {topic:"Pain management",questions:["Does she want to try unmedicated birth?","If so, at what point is she open to reconsidering?","What comfort measures does she want tried first?","What words does she want you to use if she asks for an epidural mid-labor?"]},
      {topic:"Interventions",questions:["How does she feel about induction if offered?","What is her preference about breaking her water artificially?","Under what conditions would she want a cesarean discussed?","What does she want to know before consenting to anything?"]},
      {topic:"Support in the room",questions:["Who does she want in the room?","Who does she NOT want?","Does she want photos taken? Video?","At what point does she want visitors after birth?"]},
      {topic:"Immediate after birth",questions:["Does she want delayed cord clamping?","Who cuts the cord?","Skin-to-skin immediately  -  for how long?","When does she want the baby bathed and weighed?"]},
    ],
    your_job:"Your job is not to agree or disagree with her preferences. It is to know them, communicate them, and advocate for them when she cannot speak for herself.",
    discussion:"Have you read her birth plan? What parts feel unclear to you? What would you do if a nurse recommended something not on the plan?",
  },
  es:{
    title:"Preferencias del Parto: La Conversación que No Puede Esperar",
    intro:"El plan de parto no es burocracia. Es una herramienta de comunicación que le dice a cada proveedor qué quiere ella  -  y qué no. Tu trabajo es conocerlo mejor que ella.",
    topics:[
      {topic:"Manejo del dolor",questions:["¿Quiere intentar un parto sin medicación?","Si es así, ¿en qué punto está abierta a reconsiderar?","¿Qué medidas de confort quiere que se intenten primero?","¿Qué palabras quiere que uses si pide una epidural?"]},
      {topic:"Intervenciones",questions:["¿Cómo se siente con respecto a la inducción si se ofrece?","¿Cuál es su preferencia sobre la ruptura artificial de aguas?","¿Bajo qué condiciones querría que se discutiera una cesárea?"]},
      {topic:"Apoyo en la sala",questions:["¿A quién quiere en la sala?","¿A quién NO quiere?","¿Quiere que se tomen fotos? ¿Video?","¿Cuándo quiere visitas después del parto?"]},
      {topic:"Inmediatamente después del parto",questions:["¿Quiere el pinzamiento tardío del cordón?","¿Quién corta el cordón?","¿Piel con piel inmediatamente  -  por cuánto tiempo?"]},
    ],
    your_job:"Tu trabajo no es estar de acuerdo o en desacuerdo con sus preferencias. Es conocerlas, comunicarlas y defenderlas cuando ella no pueda hablar por sí misma.",
    discussion:"¿Has leído su plan de parto? ¿Qué partes te parecen poco claras? ¿Qué harías si una enfermera recomendara algo que no está en el plan?",
  },
  ht:{
    title:"Preferans Akouchman: Konvèsasyon Ki Pa Ka Tann",
    intro:"Plan akouchman an pa biwokrasi. Se yon zouti kominikasyon ki di chak pwofesyonèl kisa li vle  -  ak kisa li pa vle. Travay ou se konnen li pi bien pase li, paske li pa ka pale pou tèt li nan travay pik.",
    topics:[
      {topic:"Jestyon doulè",questions:["Eske li vle eseye akouchman san medikaman?","Si wi, nan ki pwen li ouvè pou rekonsidere?","Ki mezi konfò li vle eseye an premye?","Ki mo li vle ou itilize si li mande epidiral?"]},
      {topic:"Entèvansyon",questions:["Kòman li santi sou indikasyon si yo ofri?","Ki preferans li sou kase dlo atifisyèlman?","Anba ki kondisyon li ta vle yon sezaryèn diskite?"]},
      {topic:"Sipò nan chanm nan",questions:["Ki moun li vle nan chanm nan?","Ki moun li PA vle?","Eske li vle foto pran? Videyo?","Ki lè li vle vizitè apre akouchman?"]},
      {topic:"Imedyatman apre akouchman",questions:["Eske li vle retade koupe kòdon?","Ki moun ki koupe kòdon an?","Po-a-po imedyatman  -  pou konbyen tan?"]},
    ],
    your_job:"Travay ou pa pou dakò oswa dezakò ak preferans li yo. Se pou konnen yo, kominike yo, epi defann yo lè li pa ka pale pou tèt li.",
    discussion:"Eske ou te li plan akouchman li? Ki pati ki parèt pa klè pou ou? Kisa ou ta fè si yon enfimye rekòmande yon bagay ki pa nan plan an?",
  },
  fr:{
    title:"Préférences d'Accouchement: La Conversation qui Ne Peut Pas Attendre",
    intro:"Le plan d'accouchement n'est pas de la bureaucratie. C'est un outil de communication qui dit à chaque prestataire ce qu'elle veut  -  et ce qu'elle ne veut pas. Votre travail est de le connaître mieux qu'elle.",
    topics:[
      {topic:"Gestion de la douleur",questions:["Veut-elle essayer un accouchement sans médicaments?","Si oui, à quel moment est-elle ouverte à reconsidérer?","Quelles mesures de confort veut-elle essayer en premier?","Quels mots veut-elle que vous utilisiez si elle demande une péridurale?"]},
      {topic:"Interventions",questions:["Comment se sent-elle à l'égard du déclenchement si proposé?","Quelle est sa préférence concernant la rupture artificielle des membranes?","Dans quelles conditions voudrait-elle discuter d'une césarienne?"]},
      {topic:"Soutien dans la salle",questions:["Qui veut-elle dans la salle?","Qui ne veut-elle PAS?","Veut-elle des photos prises? Vidéo?","Quand veut-elle des visiteurs après la naissance?"]},
      {topic:"Immédiatement après la naissance",questions:["Veut-elle un clampage tardif du cordon?","Qui coupe le cordon?","Peau-à-peau immédiatement  -  pendant combien de temps?"]},
    ],
    your_job:"Votre travail n'est pas d'être d'accord ou en désaccord avec ses préférences. C'est de les connaître, les communiquer et les défendre quand elle ne peut pas parler pour elle-même.",
    discussion:"Avez-vous lu son plan d'accouchement? Quelles parties vous semblent peu claires? Que feriez-vous si une infirmière recommandait quelque chose qui n'est pas dans le plan?",
  },
};

const FEAR = {
  en:{
    title:"Managing Fear Together",
    intro:"Fear during pregnancy is normal  -  for her and for you. The mistake is managing fear alone or pretending it does not exist. Shared fear is lighter. Named fear is less powerful. Here is how to create a space where both of you can be honest.",
    her_fears:["That something will go wrong with the birth","That she will be a bad mother","That the baby will not be healthy","That her body will not work the way it should","That she will lose herself in motherhood","That you will not show up the way she needs"],
    your_fears:["That something will go wrong and you will be helpless","That she will be in pain you cannot fix","That you will not know what to do","That you will not be a good father","That your relationship will not survive the change","That you are not ready financially or emotionally"],
    how:[
      {action:"Name your fears out loud to each other",detail:"Not to solve them. Just to say them. 'I am scared that I will freeze in the room.' 'I am scared you will feel alone.' Say it. Hear it. Do not rush to fix."},
      {action:"Do not compete for who has it harder",detail:"Her fear and your fear are both real. This is not a hierarchy. Acknowledging your fear does not minimize hers."},
      {action:"Ask: What would help you feel less scared?",detail:"For her the answer might be more information, a practice run, a conversation with a doula, or just being held. For you it might be reading or watching or asking questions. Find out."},
      {action:"Let preparation be your answer to fear",detail:"You cannot eliminate fear but you can reduce it. Preparation reduces anxiety for both of you. Read. Attend. Practice. Ask."},
    ],
    discussion:"What are you most afraid of? Have you told her? What is she most afraid of that you think you can actually help with?",
  },
  es:{
    title:"Manejar el Miedo Juntos",
    intro:"El miedo durante el embarazo es normal  -  para ella y para ti. El error es manejarlo solo o fingir que no existe. El miedo compartido es más ligero. El miedo nombrado es menos poderoso.",
    her_fears:["Que algo salga mal con el parto","Que sea una mala madre","Que el bebé no esté sano","Que su cuerpo no funcione como debería","Que se pierda a sí misma en la maternidad","Que tú no aparezco de la manera que ella necesita"],
    your_fears:["Que algo salga mal y estés impotente","Que esté en dolor que no puedas arreglar","Que no sepas qué hacer","Que no seas un buen padre","Que tu relación no sobreviva el cambio","Que no estés listo financiera o emocionalmente"],
    how:[
      {action:"Nombra tus miedos en voz alta el uno al otro",detail:"No para resolverlos. Solo para decirlos. 'Tengo miedo de congelarme en la sala.' Di la frase. Escúchala. No te apresures a arreglar."},
      {action:"No compitas por quién lo tiene más difícil",detail:"Su miedo y tu miedo son ambos reales. No hay jerarquía."},
      {action:"Pregunta: ¿Qué te ayudaría a sentir menos miedo?",detail:"Para ella podría ser más información o simplemente ser sostenida. Para ti podría ser leer o hacer preguntas."},
      {action:"Deja que la preparación sea tu respuesta al miedo",detail:"No puedes eliminar el miedo pero puedes reducirlo. Lee. Asiste. Practica."},
    ],
    discussion:"¿A qué tienes más miedo? ¿Se lo has dicho? ¿A qué tiene más miedo ella con lo que crees que realmente puedes ayudar?",
  },
  ht:{
    title:"Jere Pè Ansanm",
    intro:"Pè pandan gwosès nòmal  -  pou li ak pou ou. Erè a se jere li poukont ou oswa pretann li pa egziste. Pè pataje pi lejè. Pè nome mwens pwisan.",
    her_fears:["Ke yon bagay pral mal nan akouchman an","Ke li pral yon move manman","Ke bebe a pa pral an sante","Ke kò li pa pral travay jan li ta dwe","Ke li pral pèdi tèt li nan matènite","Ke ou pa pral parèt jan li bezwen"],
    your_fears:["Ke yon bagay pral mal ak ou san pouvwa","Ke li pral nan doulè ou pa ka regle","Ke ou pa pral konnen kisa pou fè","Ke ou pa pral yon bon papa","Ke relasyon ou yo pa pral siviv chanjman an","Ke ou pa prèt finansyèlman oswa emosyonèlman"],
    how:[
      {action:"Nonmen pè ou nan vwa yo pou youn ak lòt",detail:"Pa pou rezoud yo. Jis pou di yo. 'Mwen pè mwen pral jele nan chanm nan.' Di li. Tande li. Pa presize regle."},
      {action:"Pa konpete pou ki moun ki gen li pi difisil",detail:"Pè li ak pè ou de vrè. Pa gen yerachi."},
      {action:"Mande: Kisa ki ta ede ou santi mwens pè?",detail:"Pou li repons lan ka plis enfòmasyon oswa jis teni. Pou ou li ka li oswa poze kesyon."},
      {action:"Kite preparasyon se repons ou pou pè",detail:"Ou pa ka elimine pè men ou ka diminye li. Li. Asiste. Pratike."},
    ],
    discussion:"Ki sa ou pi pè? Eske ou di li? Ki sa li pi pè ke ou panse ou ka reyèlman ede?",
  },
  fr:{
    title:"Gérer la Peur Ensemble",
    intro:"La peur pendant la grossesse est normale  -  pour elle et pour vous. L'erreur est de la gérer seul ou de prétendre qu'elle n'existe pas. La peur partagée est plus légère. La peur nommée est moins puissante.",
    her_fears:["Que quelque chose se passe mal pendant l'accouchement","Qu'elle sera une mauvaise mère","Que le bébé ne sera pas en bonne santé","Que son corps ne fonctionnera pas comme il le devrait","Qu'elle se perdra dans la maternité","Que vous n'apparaîtrez pas de la façon dont elle a besoin"],
    your_fears:["Que quelque chose se passe mal et que vous soyez impuissant","Qu'elle souffre d'une douleur que vous ne pouvez pas corriger","Que vous ne sachiez pas quoi faire","Que vous ne soyez pas un bon père","Que votre relation ne survive pas au changement","Que vous ne soyez pas prêt financièrement ou émotionnellement"],
    how:[
      {action:"Nommez vos peurs à voix haute l'un à l'autre",detail:"Pas pour les résoudre. Juste pour les dire. 'J'ai peur de me figer dans la salle.' Dites-le. Entendez-le. Ne vous précipitez pas à corriger."},
      {action:"Ne rivalisez pas pour savoir qui a le plus difficile",detail:"Sa peur et votre peur sont toutes les deux réelles. Il n'y a pas de hiérarchie."},
      {action:"Demandez: Qu'est-ce qui vous aiderait à avoir moins peur?",detail:"Pour elle la réponse pourrait être plus d'informations ou simplement être tenue. Pour vous ça pourrait être lire ou poser des questions."},
      {action:"Laissez la préparation être votre réponse à la peur",detail:"Vous ne pouvez pas éliminer la peur mais vous pouvez la réduire. Lisez. Assistez. Pratiquez."},
    ],
    discussion:"De quoi avez-vous le plus peur? Le lui avez-vous dit? De quoi a-t-elle le plus peur avec laquelle vous pensez pouvoir réellement aider?",
  },
};

const NOT_SAY = {
  en:[
    {say:"You're so big now.",why:"She knows. This is not a compliment regardless of how it is meant."},
    {say:"My mom did it fine without all this.",why:"Dismisses her experience and positions you against her care choices."},
    {say:"Are you sure you should be eating that?",why:"Her provider is managing her nutrition. You are not."},
    {say:"You just need to relax.",why:"Not actionable. Creates shame. Never helpful."},
    {say:"When do you think you'll feel normal again?",why:"Puts a timeline on recovery that she cannot control."},
    {say:"I'm tired too.",why:"In the first weeks postpartum especially, this comparison is not helpful even if true."},
    {say:"Other babies sleep through the night at this age.",why:"Every baby is different. This adds pressure and implies failure."},
    {say:"Do you think it could be postpartum depression?",why:"If you genuinely think this, the right path is to gently encourage her to call her provider  -  not to diagnose her yourself in a moment of frustration."},
    {say:"What do you do all day?",why:"She is keeping a human alive. The answer to this question is always more than you realize."},
    {say:"I can't wait for things to go back to normal.",why:"This signals that her current state is a problem to be managed rather than a season to walk through together."},
  ],
  es:[
    {say:"Qué grande estás.",why:"Ella lo sabe. Esto no es un cumplido sin importar cómo se intente."},
    {say:"Mi mamá lo hizo bien sin todo esto.",why:"Descarta su experiencia y te posiciona contra sus elecciones de cuidado."},
    {say:"¿Estás segura de que deberías comer eso?",why:"Su proveedor está gestionando su nutrición. Tú no."},
    {say:"Solo necesitas relajarte.",why:"No es accionable. Crea vergüenza. Nunca es útil."},
    {say:"¿Cuándo crees que te sentirás normal de nuevo?",why:"Pone un plazo en la recuperación que ella no puede controlar."},
    {say:"Yo también estoy cansado.",why:"En las primeras semanas postparto especialmente, esta comparación no ayuda."},
    {say:"Otros bebés duermen toda la noche a esta edad.",why:"Cada bebé es diferente. Esto añade presión e implica fracaso."},
    {say:"¿Qué haces todo el día?",why:"Está manteniendo vivo a un ser humano."},
    {say:"No puedo esperar a que las cosas vuelvan a la normalidad.",why:"Esto señala que su estado actual es un problema a gestionar."},
  ],
  ht:[
    {say:"Ou gwo anpil kounye a.",why:"Li konnen. Sa a pa yon konpliman kèlkeswa jan sa vle di."},
    {say:"Manman m te fè li an fòm san tout bagay sa yo.",why:"Rejte eksperyans li epi pozisyone ou kont chwa swen li."},
    {say:"Ou sèten ou ta dwe manje sa?",why:"Pwofesyonèl li jere nitrisyon li. Ou pa."},
    {say:"Ou jis bezwen detann.",why:"Pa aksyonab. Kreye wont. Janm itil."},
    {say:"Konbyen tan ou panse ou pral santi nòmal ankò?",why:"Mete yon délai sou rekiperasyon li pa ka kontwole."},
    {say:"Mwen fatige tou.",why:"Nan premye semèn apre akouchman espesyalman, konparezon sa a pa itil."},
    {say:"Lòt bebe dòmi tout lannuit nan laj sa a.",why:"Chak bebe diferan. Sa ajoute presyon epi enplike echèk."},
    {say:"Kisa ou fè tout jounen?",why:"Li ap kenbe yon moun alavi. Repons lan toujou plis pase ou reyalize."},
    {say:"Mwen pa ka tann pou bagay yo tounen nòmal.",why:"Sa siyal ke eta aktyèl li se yon pwoblèm pou jere."},
  ],
  fr:[
    {say:"Tu es tellement grande maintenant.",why:"Elle le sait. Ce n'est pas un compliment peu importe comment c'est voulu."},
    {say:"Ma mère s'en est bien sortie sans tout ça.",why:"Cela rejette son expérience et vous positionne contre ses choix de soins."},
    {say:"Tu es sûre que tu devrais manger ça?",why:"Son prestataire gère sa nutrition. Pas vous."},
    {say:"Tu as juste besoin de te détendre.",why:"Pas réalisable. Crée de la honte. Jamais utile."},
    {say:"Quand penses-tu que tu te sentiras normale à nouveau?",why:"Impose un délai sur la récupération qu'elle ne peut pas contrôler."},
    {say:"Moi aussi je suis fatigué.",why:"Surtout dans les premières semaines post-partum, cette comparaison n'aide pas."},
    {say:"Les autres bébés dorment toute la nuit à cet âge.",why:"Chaque bébé est différent. Cela ajoute de la pression."},
    {say:"Qu'est-ce que tu fais toute la journée?",why:"Elle maintient un être humain en vie."},
    {say:"J'ai hâte que les choses reviennent à la normale.",why:"Cela signale que son état actuel est un problème à gérer."},
  ],
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecBirthPrefs({lang,C}){
  const d=BIRTH_PREFS[lang];
  const [open,setOpen]=useState(null);
  return <div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.topics.map((t,i)=>{
      const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?C.teal+"10":C.cardAlt,border:"1px solid "+(isOpen?C.teal:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?C.teal:C.text,flex:1}}>{t.topic}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+C.teal+"20"}}>
          {t.questions.map((q,j)=><div key={j} style={{display:"flex",gap:9,marginBottom:8}}>
            <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:C.teal+"22",border:"1px solid "+C.teal+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.teal,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{j+1}</div>
            <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{q}</span>
          </div>)}
        </div>}
      </div>;
    })}
    <div style={{background:C.green+"0d",border:"1px solid "+C.green+"25",borderRadius:12,padding:16,marginBottom:14}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0,fontStyle:"italic"}}>{d.your_job}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecFear({lang,C}){
  const d=FEAR[lang];
  const [tab,setTab]=useState("hers");
  return <div>
    <div style={{background:C.orange+"0d",border:"1px solid "+C.orange+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{v:"hers",l:"Her Fears",c:C.pink},{v:"yours",l:"Your Fears",c:C.blue}].map(o=>(
        <button key={o.v} onClick={()=>setTab(o.v)} style={{background:tab===o.v?o.c+"20":C.inputBg,border:"1px solid "+(tab===o.v?o.c:C.border),borderRadius:20,padding:"6px 18px",fontSize:12,fontFamily:"'DM Mono',monospace",color:tab===o.v?o.c:C.muted,cursor:"pointer"}}>{o.l}</button>
      ))}
    </div>
    <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:14,padding:18,marginBottom:20}}>
      {(tab==="hers"?d.her_fears:d.your_fears).map((item,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:tab==="hers"?C.pink:C.blue,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{item}</span>
      </div>)}
    </div>
    <div style={{marginBottom:16}}>
      {d.how.map((item,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.accent+"20",borderRadius:12,padding:"12px 16px",marginBottom:9}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:C.accent,marginBottom:4}}>{item.action}</div>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{item.detail}</p>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecNotSay({lang,C}){
  const items=NOT_SAY[lang]||NOT_SAY.en;
  return <div>
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{lang==="en"?"These are real things that partners say, usually with good intentions. All of them land badly. None of them are helpful. Knowing what not to say is as important as knowing what to say.":lang==="es"?"Estas son cosas reales que dicen las parejas, generalmente con buenas intenciones. Todas ellas tienen un impacto negativo. Saber qué no decir es tan importante como saber qué decir.":lang==="ht"?"Sa yo se bagay reyèl patnè di, souvan ak bon entansyon. Yo tout aterir mal. Konnen kisa pou pa di osi enpòtan pase konnen kisa pou di.":"Ce sont des choses réelles que disent les partenaires, généralement avec de bonnes intentions. Elles atterrissent toutes mal. Savoir quoi ne pas dire est aussi important que savoir quoi dire."}</p>
    </div>
    {items.map((item,i)=><div key={i} style={{marginBottom:10}}>
      <div style={{background:C.red+"08",border:"1px solid "+C.red+"20",borderRadius:"12px 12px 0 0",padding:"10px 14px"}}>
        <div style={{fontSize:9.5,color:C.red,fontFamily:"'DM Mono',monospace",marginBottom:4}}>DON'T SAY</div>
        <p style={{fontSize:13.5,color:C.red,fontFamily:"'DM Mono',monospace",margin:0}}>{item.say}</p>
      </div>
      <div style={{background:C.green+"08",border:"1px solid "+C.green+"20",borderTopWidth:0,borderRadius:"0 0 12px 12px",padding:"10px 14px"}}>
        <div style={{fontSize:9.5,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:4}}>WHY IT LANDS BADLY</div>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{item.why}</p>
      </div>
    </div>)}
  </div>;
}

const GENERIC_DATA={
  en:{
    0:{icon:"💬",text:"The conversations that happen during pregnancy shape the birth experience and the early parenting relationship. Partners who wait until labor to communicate preferences, fears, and expectations arrive unprepared. Start the hard conversations now  -  not because it is comfortable, but because it becomes significantly harder later."},
    2:{icon:"🌱",title:"Parenting Values",text:"What values do you want to raise this child with? How will you handle discipline  -  and what does discipline even mean to you both? What role will your families of origin play? What are your non-negotiables? These conversations do not need to be resolved in one sitting. They need to begin. Couples who discover they have fundamentally different values at month six postpartum have missed a significant window."},
    5:{icon:"🔥",title:"Hard Conversations",text:"The hardest conversations during pregnancy are often about finances, division of labor, and what happens to the relationship. How are you splitting parental leave? Who handles what at night? What is the plan if she develops postpartum depression? These are not romantic conversations. They are necessary ones. The couples who have them early weather the transition better."},
    6:{icon:"💑",title:"Staying Connected",text:"Pregnancy and new parenthood put enormous strain on the relationship. Date nights, uninterrupted conversation, physical affection, and laughter require intentional investment. You do not stay connected by accident. Schedule the time. Ask her what connection feels like for her right now. Do not assume it looks the same as before pregnancy."},
    7:{icon:"🎯",title:"Discussion Starters",text:"Try these: What are you most excited about? What are you most afraid of? What do you wish I would do more of? What do you wish I would stop doing? What does support feel like to you right now? What would make you feel more ready? What do you need from me this week specifically?"},
  },
  es:{
    0:{icon:"💬",text:"Las conversaciones que ocurren durante el embarazo dan forma a la experiencia del parto y la relación de crianza temprana. Comienza las conversaciones difíciles ahora  -  no porque sea cómodo, sino porque se vuelve significativamente más difícil después."},
    2:{icon:"🌱",title:"Valores de Crianza",text:"¿Qué valores quieres criar en este niño? ¿Cómo manejarás la disciplina? ¿Qué papel jugarán sus familias de origen? Las parejas que descubren que tienen valores fundamentalmente diferentes en el mes seis postparto han perdido una ventana significativa."},
    5:{icon:"🔥",title:"Conversaciones Difíciles",text:"Las conversaciones más difíciles durante el embarazo a menudo son sobre finanzas, división del trabajo doméstico y lo que le pasa a la relación. ¿Cómo dividen la licencia parental? ¿Quién maneja qué por la noche? Las parejas que las tienen temprano navegan mejor la transición."},
    6:{icon:"💑",title:"Mantenerse Conectados",text:"El embarazo y la nueva paternidad ejercen una enorme presión sobre la relación. Las citas, la conversación ininterrumpida y el afecto físico requieren inversión intencional. No permanecen conectados por accidente."},
    7:{icon:"🎯",title:"Iniciadores de Discusión",text:"Prueba estos: ¿De qué estás más emocionado? ¿Qué te da más miedo? ¿Qué desearías que hiciera más? ¿Qué desearías que dejara de hacer? ¿Cómo se siente el apoyo para ti ahora mismo?"},
  },
  ht:{
    0:{icon:"💬",text:"Konvèsasyon ki rive pandan gwosès fòme eksperyans akouchman ak relasyon patènaj bonè. Kòmanse konvèsasyon difisil kounye a - pa paske li konfòtab, men paske li vin pi difisil yon fason enpòtan apre."},
    2:{icon:"🌱",title:"Valè Patènaj",text:"Ki valè ou vle elve timoun sa a avèk? Kòman ou pral jere disiplin? Ki wòl fanmiy orijin ou yo pral jwe? Koup ki dekouvri yo gen valè fondamantalman diferan nan mwa sis apre akouchman rate yon fenèt enpòtan."},
    5:{icon:"🔥",title:"Konvèsasyon Difisil",text:"Konvèsasyon ki pi difisil pandan gwosès souvan sou finans, divize travay, ak kisa ki pase nan relasyon an. Kòman ou ap divize konje parantal? Ki moun ki jere kisa lannuit? Koup ki fè yo bonè navige tranzisyon an pi byen."},
    6:{icon:"💑",title:"Rete Konekte",text:"Gwosès ak paran nouvo mete enòm presyon sou relasyon an. Dat lannuit, konvèsasyon san entèripsyon, ak afeksyon fizik mande envestisman entansyonèl. Ou pa rete konekte pa aksidan."},
    7:{icon:"🎯",title:"Kòmansè Diskisyon",text:"Eseye sa yo: Ki sa ou pi eksitan sou? Ki sa ou pi pè? Kisa ou ta vle mwen ta fè plis? Kisa ou ta vle mwen ta sispann fè? Kòman sipò santi pou ou kounye a?"},
  },
  fr:{
    0:{icon:"💬",text:"Les conversations qui se passent pendant la grossesse façonnent l'expérience de l'accouchement et la relation parentale précoce. Commencez les conversations difficiles maintenant  -  non pas parce que c'est confortable, mais parce que cela devient beaucoup plus difficile plus tard."},
    2:{icon:"🌱",title:"Valeurs Parentales",text:"Avec quelles valeurs voulez-vous élever cet enfant? Comment gérerez-vous la discipline? Quel rôle joueront vos familles d'origine? Les couples qui découvrent qu'ils ont des valeurs fondamentalement différentes au sixième mois post-partum ont manqué une fenêtre significative."},
    5:{icon:"🔥",title:"Conversations Difficiles",text:"Les conversations les plus difficiles pendant la grossesse portent souvent sur les finances, le partage des tâches et ce qui arrive à la relation. Comment partagez-vous le congé parental? Les couples qui les ont tôt traversent mieux la transition."},
    6:{icon:"💑",title:"Rester Connectés",text:"La grossesse et la nouvelle parentalité mettent une pression énorme sur la relation. Les sorties, la conversation non interrompue et l'affection physique nécessitent un investissement intentionnel. Vous ne restez pas connectés par accident."},
    7:{icon:"🎯",title:"Amorces de Discussion",text:"Essayez ceux-ci: De quoi êtes-vous le plus enthousiaste? De quoi avez-vous le plus peur? Qu'aimeriez-vous que je fasse davantage? Qu'aimeriez-vous que j'arrête de faire? Comment le soutien vous semble-t-il en ce moment?"},
  },
};

export default function PartnerCommunicationGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_DATA[lang]||GENERIC_DATA.en;
  const kpis=[
    {icon:"💬",value:"7",label:lang==="en"?"CONVERSATION TOPICS":lang==="es"?"TEMAS DE CONVERSACIÓN":lang==="ht"?"SIJÈ KONVÈSASYON":"SUJETS DE CONVERSATION",color:C.accent},
    {icon:"😨",value:"12",label:lang==="en"?"FEARS NAMED":lang==="es"?"MIEDOS NOMBRADOS":lang==="ht"?"PÈ NOME":"PEURS NOMMÉES",color:C.orange},
    {icon:"🚫",value:"9",label:lang==="en"?"PHRASES TO NEVER SAY":lang==="es"?"FRASES QUE NUNCA DECIR":lang==="ht"?"FRAZ POU JANM DI":"PHRASES À NE JAMAIS DIRE",color:C.red},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.teal},
  ];
  const renderSection=()=>{
    switch(section){
      case 0: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[0].icon}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:520,margin:"0 auto",lineHeight:1.75}}>{g[0].text}</p></div>;
      case 1: return <SecBirthPrefs lang={lang} C={C}/>;
      case 2: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[2].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[2].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[2].text}</p></div>;
      case 3: return <SecFear lang={lang} C={C}/>;
      case 4: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[5].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[5].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[5].text}</p></div>;
      case 5: return <SecNotSay lang={lang} C={C}/>;
      case 6: return <div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{g[6].icon}</div><div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{g[6].title}</div><p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{g[6].text}</p></div>;
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Conversations </span>
                  <span style={{background:"linear-gradient(135deg,"+C.teal+","+C.blue+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>That Matter </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>Talking Through Every Stage</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Partner Communication</div>
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
