import { useState, useEffect } from "react";
const DARK={bg:"#080d1a",card:"#0f1628",cardAlt:"#111827",border:"rgba(148,163,184,0.1)",text:"#f1f5f9",muted:"#e2e8f0",faint:"rgba(226,232,240,0.55)",accent:"#f59e0b",teal:"#22d3ee",purple:"#a78bfa",gold:"#fbbf24",green:"#34d399",red:"#f87171",orange:"#fb923c",blue:"#60a5fa",pink:"#e879f9",navBg:"rgba(8,13,26,0.96)",shadow:"0 4px 24px rgba(0,0,0,0.4)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f4f6fb",card:"#ffffff",cardAlt:"#f8fafc",border:"rgba(15,22,40,0.1)",text:"#0f1628",muted:"#1e293b",faint:"rgba(30,41,59,0.5)",accent:"#d97706",teal:"#0891b2",purple:"#7c3aed",gold:"#d97706",green:"#059669",red:"#dc2626",orange:"#ea580c",blue:"#2563eb",pink:"#c026d3",navBg:"rgba(244,246,251,0.97)",shadow:"0 4px 24px rgba(15,22,40,0.1)",inputBg:"rgba(15,22,40,0.04)",toggleBg:"rgba(15,22,40,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"\u{1F1FA}\u{1F1F8}"},{code:"es",label:"Espanol",flag:"\u{1F1EA}\u{1F1F8}"},{code:"ht",label:"Kreyol",flag:"\u{1F1ED}\u{1F1F9}"},{code:"fr",label:"Francais",flag:"\u{1F1EB}\u{1F1F7}"}];
function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

const CONTENT = {
  techniques:{
    en:[
      {name:"Double Hip Squeeze",icon:"\u{1F932}",color:"teal",how:"Stand behind her as she leans forward. Cup both hands on the back of her hip bones and push inward and slightly upward. Ask: More? Less? Move higher or lower?",when:"Back labor, posterior baby. One of the highest-impact techniques available.",tip:"More pressure than you expect. Use body weight, not just arms. Switch off with the doula if your arms fatigue."},
      {name:"Sacral Counterpressure",icon:"\u270A",color:"purple",how:"Make a fist or use the heel of your hand. Press firmly and steadily on the sacrum - the flat bone at the base of her spine between the two back dimples. Hold through the contraction.",when:"Back labor. If she grabs your hand and presses it there, that is your answer.",tip:"She will tell you if you are in the right spot - immediate relief is the signal. Ask her to rate and guide."},
      {name:"Breathing Together",icon:"\u{1F32C}",color:"blue",how:"Make eye contact. Inhale slowly and audibly. Let her match your breath. Your calm nervous system co-regulates hers.",when:"Any time she is escalating, panicking, or losing her breath rhythm.",tip:"Your voice lower. Your pace slower. She will follow."},
      {name:"Position Change",icon:"\u{1F504}",color:"green",how:"Suggest a new position every 20-30 minutes. Help her move - support her weight, guide her limbs.",when:"Throughout active labor especially if progress is slow.",tip:"Hands and knees is the most underused position. Suggest it confidently for back labor."},
      {name:"Cool Cloth / Warm Compress",icon:"\u{1F321}",color:"gold",how:"Cool damp cloth on forehead and neck between contractions. Warm compress on lower back.",when:"Between contractions. During transition especially.",tip:"Always ask before applying. Temperature preferences change rapidly in labor."},
    ],
    es:[
      {name:"Compresion de Caderas",icon:"\u{1F932}",color:"teal",how:"Parate detras de ella. Pon ambas manos en la parte trasera de sus huesos de cadera. Empuja hacia adentro y ligeramente hacia arriba.",when:"Parto de espalda, posicion posterior del bebe.",tip:"Mas presion de lo que crees. Usa el peso de tu cuerpo, no solo los brazos."},
      {name:"Contrapresion Sacra",icon:"\u270A",color:"purple",how:"Haz un puno o usa el talon de tu mano. Aplica presion firme en el sacro. Mantiene durante la contraccion.",when:"Parto de espalda.",tip:"Ella te dira si estas en el lugar correcto - alivio inmediato es la senal."},
      {name:"Respirar Juntos",icon:"\u{1F32C}",color:"blue",how:"Haz contacto visual. Inhala lentamente y audiblemente. Deja que ella iguale tu respiracion.",when:"Cada vez que este escalando o perdiendo su ritmo de respiracion.",tip:"Tu voz mas baja. Tu ritmo mas lento. Ella seguira."},
      {name:"Cambio de Posicion",icon:"\u{1F504}",color:"green",how:"Sugiere una nueva posicion cada 20-30 minutos. Ayudala a moverse.",when:"Durante todo el parto activo especialmente si el progreso es lento.",tip:"Manos y rodillas es la posicion mas subutilizada."},
      {name:"Pano Frio / Compresa Caliente",icon:"\u{1F321}",color:"gold",how:"Pano frio en la frente entre contracciones. Compresa caliente en la espalda baja.",when:"Entre contracciones.",tip:"Siempre pregunta antes de aplicar."},
    ],
    ht:[
      {name:"Presyon Doub Hanch",icon:"\u{1F932}",color:"teal",how:"Kanpe deyere li. Mete de men ou sou deyere zo hanch li. Pouse anndan ak yon ti jan anlye.",when:"Travay do, bebe nan pozisyon posteryye.",tip:"Plis presyon pase ou panse. Itilize pwa tout ko ou."},
      {name:"Presyon Kont Sakral",icon:"\u270A",color:"purple",how:"Fe yon pwen oswa itilize talon men ou. Aplike presyon fem sou sakrym lan. Kenbe pandan kontraksiyon.",when:"Travay do.",tip:"Li ap di ou si ou nan bon kote - soulajman imedya se siyal la."},
      {name:"Respire Ansanm",icon:"\u{1F32C}",color:"blue",how:"Fe kontak je. Respire dousman ak odibleman. Kite li matche respirasyon ou.",when:"Nenpot le li ap eskalad oswa pe respirasyon li.",tip:"Vwa ou pi ba. Rite ou pi dousman. Li ap swiv."},
      {name:"Chanje Pozisyon",icon:"\u{1F504}",color:"green",how:"Sijere yon nouvo pozisyon chak 20-30 minit. Ede li deplase.",when:"Pandan tout travay aktif.",tip:"Men ak jenou se pozisyon ki plis sou-itilize."},
      {name:"Twal Fre / Konpres Cho",icon:"\u{1F321}",color:"gold",how:"Twal fre sou fwon ant kontraksiyon. Konpres cho sou do anba.",when:"Ant kontraksiyon.",tip:"Toujou mande anvan aplike."},
    ],
    fr:[
      {name:"Compression des Hanches",icon:"\u{1F932}",color:"teal",how:"Tenez-vous derriere elle. Placez les deux mains sur la partie arriere de ses os de la hanche. Poussez vers l interieur et legerement vers le haut.",when:"Travail dorsal, position posterieure du bebe.",tip:"Plus de pression que vous ne le pensez. Utilisez le poids de votre corps."},
      {name:"Contre-pression Sacree",icon:"\u270A",color:"purple",how:"Faites un poing ou utilisez le talon de votre main. Appliquez une pression ferme sur le sacrum. Maintenez pendant la contraction.",when:"Travail dorsal.",tip:"Elle vous dira si vous etes au bon endroit - soulagement immediat est le signal."},
      {name:"Respirer Ensemble",icon:"\u{1F32C}",color:"blue",how:"Faites un contact visuel. Inspirez lentement et audiblement. Laissez-la correspondre a votre respiration.",when:"Chaque fois qu elle escalade ou perd son rythme respiratoire.",tip:"Votre voix plus basse. Votre rythme plus lent. Elle suivra."},
      {name:"Changement de Position",icon:"\u{1F504}",color:"green",how:"Suggerez une nouvelle position toutes les 20-30 minutes. Aidez-la a bouger.",when:"Tout au long du travail actif.",tip:"Mains et genoux est la position la plus sous-utilisee."},
      {name:"Linge Frais / Compresse Chaude",icon:"\u{1F321}",color:"gold",how:"Linge frais sur le front entre les contractions. Compresse chaude dans le bas du dos.",when:"Entre les contractions.",tip:"Demandez toujours avant d appliquer."},
    ],
  },
  say:{
    en:{
      say:[
        {say:"I am right here.",why:"Presence confirmed. No pressure. No expectation."},
        {say:"You are doing it.",why:"Present tense. Not you can do it. You ARE doing it. Fact."},
        {say:"One more. Just this one.",why:"Narrows the world to one contraction."},
        {say:"Breathe with me. [then demonstrate]",why:"Co-regulation. Her nervous system follows yours when you are calm."},
        {say:"Tell me what you need.",why:"Opens the floor to her without assuming."},
        {say:"[silent - hand on her back]",why:"Sometimes wordless presence is the most powerful support."},
      ],
      avoid:[
        {avoid:"You have got this!",why:"Cheerleader energy lands wrong in active labor. It feels dismissive."},
        {avoid:"How much longer do you think?",why:"She does not know. Asking puts pressure on her to manage your anxiety."},
        {avoid:"Do you want the epidural?",why:"Unless she asks, do not offer. Offering is pressure."},
        {avoid:"Relax or just breathe",why:"Breathe WITH her instead of instructing."},
        {avoid:"You are almost there when you do not know",why:"Broken promises in labor destroy trust quickly."},
      ],
    },
    es:{
      say:[
        {say:"Estoy aqui contigo.",why:"Presencia confirmada."},
        {say:"Lo estas haciendo.",why:"Tiempo presente. No puedes hacerlo. LO ESTAS haciendo."},
        {say:"Una mas. Solo esta.",why:"Estrecha el mundo a una contraccion."},
        {say:"Respira conmigo. [luego demuestra]",why:"Co-regulacion. Su sistema nervioso sigue el tuyo."},
        {say:"Dime que necesitas.",why:"Abre el espacio sin asumir."},
        {say:"[silencio - mano en su espalda]",why:"A veces la presencia sin palabras es el apoyo mas poderoso."},
      ],
      avoid:[
        {avoid:"Puedes hacerlo!",why:"La energia de animadora suena mal en el parto activo."},
        {avoid:"Cuanto tiempo mas crees que falta?",why:"Ella no lo sabe. Preguntar le pone presion."},
        {avoid:"Quieres la epidural?",why:"A menos que lo pida, no ofrezcas."},
        {avoid:"Relatate o solo respira",why:"Respira CON ella en vez de instruir."},
        {avoid:"Ya casi cuando no lo sabes",why:"Las promesas rotas en el parto destruyen la confianza rapidamente."},
      ],
    },
    ht:{
      say:[
        {say:"Mwen la menm.",why:"Prezans konfime."},
        {say:"Ou ap fe li.",why:"Tan prezan. Ou AP FE LI. Reyalite."},
        {say:"Youn anko. Selman sa a.",why:"Retresi mond lan nan yon kontraksiyon."},
        {say:"Respire avek mwen. [epi montre]",why:"Ko-regilasyon. Sistym neval li swiv pa ou."},
        {say:"Di mwen kisa ou bezwen.",why:"Ouvri espas la pou li."},
        {say:"[silans - men sou do li]",why:"Pafwa prezans san mo se sipyo ki pi pwisan."},
      ],
      avoid:[
        {avoid:"Ou ka fe li!",why:"Eneji sipote santi mal nan travay aktif."},
        {avoid:"Konbyen tan anko ou panse?",why:"Li pa konnen. Mande mete presyon sou li."},
        {avoid:"Eske ou vle epidiral la?",why:"Sof si li mande, pa ofri."},
        {avoid:"Detann oswa jis respire",why:"Respire AVEK li olye enstriksyon."},
        {avoid:"Ou presque rive lè ou pa konnen",why:"Pwomès ki kase nan travay detwi konfyans vit."},
      ],
    },
    fr:{
      say:[
        {say:"Je suis la.",why:"Presence confirmee."},
        {say:"Tu le fais.",why:"Present. Pas tu peux le faire. Tu LE FAIS."},
        {say:"Encore une. Juste celle-ci.",why:"Reduit le monde a une contraction."},
        {say:"Respire avec moi. [puis demontrez]",why:"Co-regulation. Son systeme nerveux suit le votre."},
        {say:"Dis-moi ce dont tu as besoin.",why:"Ouvre le plancher sans supposer."},
        {say:"[silence - main dans son dos]",why:"Parfois la presence sans mots est le soutien le plus puissant."},
      ],
      avoid:[
        {avoid:"Tu peux le faire!",why:"L energie de pom-pom girl resonne mal pendant le travail actif."},
        {avoid:"Combien de temps encore selon toi?",why:"Elle ne sait pas. Demander met la pression sur elle."},
        {avoid:"Tu veux la peridurale?",why:"A moins qu elle ne le demande, ne proposez pas."},
        {avoid:"Detends-toi ou respire juste",why:"Respirez AVEC elle au lieu d instruire."},
        {avoid:"Tu y es presque quand tu ne sais pas",why:"Les promesses brisees pendant le travail detruisent rapidement la confiance."},
      ],
    },
  },
};

function TechniqueSection({lang,C}){
  const [open,setOpen]=useState(null);
  const data=CONTENT.techniques[lang]||CONTENT.techniques.en;
  const cm={teal:C.teal,purple:C.purple,blue:C.blue,green:C.green,gold:C.gold};
  return <div>
    <div style={{background:C.teal+"0d",border:"1px solid "+C.teal+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>Physical support during labor is one of the most impactful things you can do. You do not need to be a massage therapist. You need to be present, willing, and responsive to her cues.</p>
    </div>
    {data.map((t,i)=>{
      const clr=cm[t.color]||C.teal; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer",transition:"all 0.25s"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:22}}>{t.icon}</span>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{t.name}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"\u25B2":"\u25BC"}</span>
        </div>
        {isOpen&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+clr+"20",display:"flex",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 200px"}}>
            <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:6}}>HOW</div>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.65,marginBottom:10}}>{t.how}</p>
            <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:6}}>WHEN</div>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0}}>{t.when}</p>
          </div>
          <div style={{flex:"0 1 220px",background:clr+"0c",border:"1px solid "+clr+"22",borderRadius:12,padding:14}}>
            <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:6}}>PARTNER TIP</div>
            <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{t.tip}</p>
          </div>
        </div>}
      </div>;
    })}
    <DiscBox text="Have you practiced any of these techniques? Which one are you most nervous about? What does she say she wants most from you physically?" C={C}/>
  </div>;
}

function SaySection({lang,C}){
  const d=CONTENT.say[lang]||CONTENT.say.en;
  const [tab,setTab]=useState("say");
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{v:"say",l:"Say This",c:C.green},{v:"avoid",l:"Avoid This",c:C.red}].map(o=>(
        <button key={o.v} onClick={()=>setTab(o.v)} style={{background:tab===o.v?o.c+"20":C.inputBg,border:"1px solid "+(tab===o.v?o.c:C.border),borderRadius:20,padding:"6px 18px",fontSize:12,fontFamily:"'DM Mono',monospace",color:tab===o.v?o.c:C.muted,cursor:"pointer"}}>{o.l}</button>
      ))}
    </div>
    {tab==="say"&&d.say.map((item,i)=>(
      <div key={i} style={{background:C.green+"08",border:"1px solid "+C.green+"20",borderRadius:12,padding:14,marginBottom:10}}>
        <p style={{fontSize:14,color:C.green,fontFamily:"'DM Mono',monospace",margin:"0 0 6px"}}>{item.say}</p>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{item.why}</p>
      </div>
    ))}
    {tab==="avoid"&&d.avoid.map((item,i)=>(
      <div key={i} style={{background:C.red+"08",border:"1px solid "+C.red+"20",borderRadius:12,padding:14,marginBottom:10}}>
        <p style={{fontSize:14,color:C.red,fontFamily:"'DM Mono',monospace",margin:"0 0 6px"}}>{item.avoid}</p>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{item.why}</p>
      </div>
    ))}
    <DiscBox text="What is your instinct when she is in pain - words or action? What has she told you she needs from you in hard moments?" C={C}/>
  </div>;
}

function GenericSection({title,icon,text,C}){
  return <div style={{textAlign:"center",padding:"32px 16px"}}>
    <div style={{fontSize:52,marginBottom:16}}>{icon}</div>
    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>
    <p style={{fontSize:13.5,color:C.muted,maxWidth:500,margin:"0 auto",lineHeight:1.75}}>{text}</p>
  </div>;
}

const SECTION_DATA={
  en:{
    0:{title:"Your Role Defined",icon:"\u2693",text:"Your job in the labor room is not to fix, manage, or direct. It is to be a steady, informed, present witness. Prepared means you know the birth plan. Present means your phone is away. Calm means your steadiness is her steadiness. Humble means this is her birth, not your performance."},
    1:{title:"Reading the Room",icon:"\u{1F441}",text:"In active labor she communicates mostly through sound, breath, and movement - not words. Learn to read: is she holding her breath (needs coaching), is she gripping you tighter (contraction peak), is she pulling away from touch (do not push). Follow her body language, not your assumptions."},
    3:{title:"Emotional Support",icon:"\u{1F49B}",text:"Emotional support in labor is not cheerleading. It is grounded presence - sitting with her in the intensity without trying to manage, minimize or accelerate it. The most emotionally supportive thing you can do is stay calm and stay close. Her nervous system responds to yours. Your calm is not passive - it is the intervention."},
    6:{title:"When Plans Change",icon:"\u{1F504}",text:"When birth plans change your job is to help her make informed decisions, not to panic. Ask what the alternatives are. Ask what happens if we wait. Then support whatever she decides. A change in plan is not a failure. Some of the most beautiful birth experiences happen when flexibility meets presence."},
    7:{title:"After Birth",icon:"\u{1F305}",text:"Give her the first moments. Facilitate skin-to-skin. Do not immediately announce to the world - ask when she is ready. Take photos she can use later. Tell her she was extraordinary. Then take care of yourself too - you have been through something significant. Both of you have."},
  },
  es:{
    0:{title:"Tu Rol Definido",icon:"\u2693",text:"Tu trabajo en la sala de parto no es arreglar, gestionar o dirigir. Es ser un testigo estable, informado y presente. Preparado significa que conoces el plan de parto. Presente significa que tu telefono esta guardado. Tranquilo significa que tu estabilidad es la suya."},
    1:{title:"Leer el Ambiente",icon:"\u{1F441}",text:"En el parto activo ella comunica principalmente a traves del sonido, la respiracion y el movimiento. Aprende a leer sus senales: si contiene la respiracion necesita orientacion, si te agarra mas fuerte es el pico de contraccion."},
    3:{title:"Apoyo Emocional",icon:"\u{1F49B}",text:"El apoyo emocional en el parto no es animar. Es presencia arraigada - estar con ella en la intensidad sin tratar de gestionar, minimizar o acelerar. Tu calma no es pasiva - es la intervencion."},
    6:{title:"Cuando los Planes Cambian",icon:"\u{1F504}",text:"Cuando los planes de parto cambian tu trabajo es ayudarla a tomar decisiones informadas. Pregunta cuales son las alternativas. Luego apoya lo que ella decida. Un cambio de plan no es un fracaso."},
    7:{title:"Despues del Nacimiento",icon:"\u{1F305}",text:"Dale los primeros momentos. Facilita el piel con piel. No anuncies al mundo de inmediato. Toma fotos que pueda usar. Dile que fue extraordinaria. Luego cuidade tambien a ti mismo."},
  },
  ht:{
    0:{title:"Wol Ou Defini",icon:"\u2693",text:"Travay ou nan chanm akouchman se pa pou regle, jere, oswa dirije. Se pou yon temwen estab, enfome, prezan. Prepare vle di ou konnen plan akouchman an. Prezan vle di telefon ou lwen. Trankil vle di stabilite ou se stabilite pa li."},
    1:{title:"Li Anviwonman an",icon:"\u{1F441}",text:"Nan travay aktif li kominike prensipalman atrave son, respirasyon, ak mouvman. Aprann li siy li yo: si li kenbe respirasyon li bezwen gidans, si li kase ou plis fot se pik kontraksiyon."},
    3:{title:"Sipyo Emosyonel",icon:"\u{1F49B}",text:"Sipyo emosyonel nan travay se pa ankouraje. Se prezans anrasine - chita avek li nan entansite a. Trankil ou pa pasif - se entevansyon an."},
    6:{title:"Le Plan Yo Chanje",icon:"\u{1F504}",text:"Le plan akouchman yo chanje travay ou se ede li pran desizyon eklere. Mande ki altnatif yo. Epi sipote sa li deside. Yon chanjman plan se pa yon echek."},
    7:{title:"Apre Akouchman",icon:"\u{1F305}",text:"Ba li premye moman yo. Fasilite po-a-po. Pa anonse nan mond imedyatman. Pran foto li ka itilize. Di li li te ekstraodine. Epi pran swen tete ou tou."},
  },
  fr:{
    0:{title:"Votre Role Defini",icon:"\u2693",text:"Votre travail dans la salle d accouchement n est pas de resoudre, gerer ou diriger. C est d etre un temoin stable, informe et present. Prepare signifie que vous connaissez le plan. Present signifie que votre telephone est range. Calme signifie que votre stabilite est la sienne."},
    1:{title:"Lire l Ambiance",icon:"\u{1F441}",text:"Pendant le travail actif elle communique principalement a travers le son, la respiration et le mouvement. Apprenez a lire ses signaux: si elle retient son souffle elle a besoin de guidage, si elle vous serre plus fort c est le pic de contraction."},
    3:{title:"Soutien Emotionnel",icon:"\u{1F49B}",text:"Le soutien emotionnel pendant le travail n est pas des encouragements. C est une presence ancree - rester avec elle dans l intensite. Votre calme n est pas passif - c est l intervention."},
    6:{title:"Quand les Plans Changent",icon:"\u{1F504}",text:"Quand les plans d accouchement changent votre travail est de l aider a prendre des decisions eclairees. Demandez quelles sont les alternatives. Puis soutenez ce qu elle decide."},
    7:{title:"Apres la Naissance",icon:"\u{1F305}",text:"Donnez-lui les premiers moments. Facilitez le peau-a-peau. N annoncez pas immediatement au monde. Dites-lui qu elle etait extraordinaire. Puis prenez soin de vous aussi."},
  },
};

const NAV={
  en:["Your Role Defined","Reading the Room","Physical Support","Emotional Support","What to Say","Being Her Advocate","When Plans Change","After Birth"],
  es:["Tu Rol Definido","Leyendo el Ambiente","Apoyo Fisico","Apoyo Emocional","Que Decir","Ser Su Defensor","Cuando los Planes Cambian","Despues del Parto"],
  ht:["Wol Ou Defini","Li Anviwonman an","Sipyo Fizik","Sipyo Emosyonel","Kisa Pou Di","Defann Li","Le Plan Yo Chanje","Apre Akouchman"],
  fr:["Votre Role Defini","Lire l Ambiance","Soutien Physique","Soutien Emotionnel","Quoi Dire","Etre Son Defenseur","Quand les Plans Changent","Apres la Naissance"],
};
const ICONS=["\u2693","\u{1F441}","\u{1F932}","\u{1F49B}","\u{1F4AC}","\u{1F6E1}","\u{1F504}","\u{1F305}"];

export default function PartnerLaborGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(true);
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const kpis=[
    {icon:"\u{1F932}",value:"5",label:lang==="en"?"PHYSICAL TECHNIQUES":lang==="es"?"TECNICAS FISICAS":lang==="ht"?"TEKNIK FIZIK":"TECHNIQUES PHYSIQUES",color:C.teal},
    {icon:"\u{1F4AC}",value:"6",label:lang==="en"?"PHRASES THAT HELP":lang==="es"?"FRASES QUE AYUDAN":lang==="ht"?"FRAZ KI EDE":"PHRASES QUI AIDENT",color:C.green},
    {icon:"\u{1F6E1}",value:"3",label:lang==="en"?"ADVOCACY SCRIPTS":lang==="es"?"GUIONES DE DEFENSA":lang==="ht"?"SKRI DEFANS":"SCRIPTS DE DEFENSE",color:C.purple},
    {icon:"\u{1F5E3}",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.accent},
  ];
  const sd=SECTION_DATA[lang]||SECTION_DATA.en;
  const renderSection=()=>{
    if(section===2) return <TechniqueSection lang={lang} C={C}/>;
    if(section===4) return <SaySection lang={lang} C={C}/>;
    const d=sd[section]||sd[0];
    return <GenericSection title={d.title} icon={d.icon} text={d.text} C={C}/>;
  };
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;}button{outline:none;font-family:inherit;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${C.accent}40;border-radius:2px;}`}</style>
      <div style={{background:C.navBg,backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.border,padding:"20px 24px 0",position:"sticky",top:0,zIndex:50,boxShadow:C.shadow}}>
        <div style={{maxWidth:1080,margin:"0 auto"}}>
          <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
              <div style={{flex:1,minWidth:260}}>
                <div style={{fontSize:9.5,letterSpacing:"0.28em",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:5,color:C.faint}}>Dieudonne Partner Hub - Partner Education Series</div>
                <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(20px,3vw,30px)",margin:0,lineHeight:1.05,fontWeight:900}}>
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>How to Support Her </span>
                  <span style={{background:"linear-gradient(135deg,"+C.teal+","+C.blue+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>in Labor </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>Your Active Role in the Birth Room</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections - Labor Support</div>
                  <button onClick={()=>setDark(d=>!d)} style={{background:C.toggleBg,border:"1px solid "+C.border,borderRadius:20,padding:"5px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:11.5,color:C.muted,transition:"all 0.25s"}}>
                    <span>{dark?"\u2600\uFE0F":"\u{1F319}"}</span><span>{dark?"Light":"Dark"}</span>
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
                <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.accent,fontSize:10}}>v</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1080,margin:"0 auto",padding:"26px 20px 80px"}}>
        <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(14px)",transition:"all 0.5s ease 0.08s"}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:22}}>
            {kpis.map((k,i)=>(
              <div key={i} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:"14px 18px",flex:"1 1 160px"}}>
                <div style={{fontSize:18,marginBottom:5}}>{k.icon}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(20px,3vw,28px)",color:k.color,lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",marginTop:5,lineHeight:1.4}}>{k.label}</div>
              </div>
            ))}
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
          <div style={{textAlign:"center",fontSize:10.5,marginTop:24,lineHeight:1.7,color:dark?"rgba(148,163,184,0.22)":"rgba(30,41,59,0.35)",fontFamily:"'DM Mono',monospace"}}>Dieudonne Partner Hub - Created by and Researched by Chery Talent Management Agency</div>
        </div>
      </div>
    </div>
  );
}
