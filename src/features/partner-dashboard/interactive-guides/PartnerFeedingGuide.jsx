import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["Why Feeding Matters to You","How Breastfeeding Works","What Makes It Hard","Your Role at Every Feeding","Latch, Supply & Pumping","When Formula is the Right Choice","Supporting Her Decision","Bottle Feeding Together"],
  es:["Por Qué La Alimentación Te Importa","Cómo Funciona la Lactancia","Qué La Hace Difícil","Tu Rol en Cada Toma","Agarre, Producción y Extracción","Cuando la Fórmula es la Elección Correcta","Apoyar Su Decisión","Alimentar con Biberón Juntos"],
  ht:["Poukisa Manje Enpòtan Pou Ou","Kòman Alètman Travay","Sa Ki Rann Li Difisil","Wòl Ou nan Chak Manje","Pran, Pwodiksyon ak Ponp","Lè Fòmil Se Bon Chwa","Sipòte Desizyon Li","Bay Bibwon Ansanm"],
  fr:["Pourquoi l'Alimentation Vous Importe","Comment Fonctionne l'Allaitement","Ce qui le Rend Difficile","Votre Rôle à Chaque Tétée","Mise au sein, Production et Tire-lait","Quand le Biberon est le Bon Choix","Soutenir Sa Décision","Donner le Biberon Ensemble"],
};
const ICONS=["🤱","🔬","⚡","👐","📊","🍼","💛","🤝"];

const HOW_WORKS={
  en:{title:"How Breastfeeding Actually Works",
    intro:"Most people think breastfeeding is instinctive and easy. It is neither. It is a skill that takes 2-6 weeks to establish and requires significant effort, support, and often professional help. Understanding the mechanics helps you support effectively.",
    supply:"Breast milk supply is driven by demand. The more frequently and completely the breast is drained, the more milk is produced. This is why in the first weeks the feeding schedule is relentless  -  it is establishing the supply. Skipping feeds or supplementing heavily with formula before supply is established can reduce long-term supply.",
    stages:[
      {name:"Colostrum (Days 1-3)",color:"gold",desc:"The first milk. Small in volume but extremely high in antibodies and nutrients. The baby's stomach is the size of a marble  -  they do not need much. Colostrum is sometimes called liquid gold. It is normal for babies to lose 5-7% of birth weight in these days."},
      {name:"Transitional Milk (Days 3-14)",color:"teal",desc:"The milk 'comes in'  -  volume increases dramatically, breasts become engorged and hard. This is physically uncomfortable. Cold compresses, gentle massage, and feeding frequently help. This is when many families struggle most."},
      {name:"Mature Milk (Week 2+)",color:"blue",desc:"Supply regulates to match the baby's needs. Breasts may feel softer  -  this does not mean supply has decreased. A well-fed baby has 6-8 wet diapers per day and regular bowel movements."},
    ],
    your_role:"Your role in the first two weeks is to protect every feeding opportunity and to handle everything else. Your job is to make breastfeeding the path of least resistance.",
    discussion:"Have you learned about breastfeeding specifically  -  not just that it is recommended, but how it actually works? What questions do you have?",
  },
  es:{title:"Cómo Funciona Realmente la Lactancia",
    intro:"La mayoría de las personas cree que la lactancia es instintiva y fácil. No lo es. Es una habilidad que tarda 2-6 semanas en establecerse y requiere esfuerzo significativo, apoyo y a menudo ayuda profesional.",
    supply:"La producción de leche materna es impulsada por la demanda. Cuanto más frecuente y completamente se vacía el pecho, más leche se produce. Esto es por qué en las primeras semanas el horario de alimentación es implacable.",
    stages:[
      {name:"Calostro (Días 1-3)",color:"gold",desc:"La primera leche. Pequeño en volumen pero extremadamente alto en anticuerpos y nutrientes. El estómago del bebé es del tamaño de una canica. Es normal que los bebés pierdan 5-7% del peso al nacer."},
      {name:"Leche de Transición (Días 3-14)",color:"teal",desc:"La leche 'baja'  -  el volumen aumenta dramáticamente, los pechos se engorgan y endurecen. Esto es físicamente incómodo. Las compresas frías y la lactancia frecuente ayudan."},
      {name:"Leche Madura (Semana 2+)",color:"blue",desc:"La producción se regula para coincidir con las necesidades del bebé. Los pechos pueden sentirse más suaves  -  esto no significa que la producción haya disminuido."},
    ],
    your_role:"Tu rol en las primeras dos semanas es proteger cada oportunidad de alimentación y manejar todo lo demás. Tu trabajo es hacer que la lactancia sea el camino de menor resistencia.",
    discussion:"¿Has aprendido sobre la lactancia específicamente  -  no solo que se recomienda, sino cómo funciona realmente? ¿Qué preguntas tienes?",
  },
  ht:{title:"Kòman Alètman Reyèlman Travay",
    intro:"Pifò moun panse alètman se enstinktif ak fasil. Se pa tou de. Se yon konpetans ki pran 2-6 semèn pou etabli epi mande efò enpòtan, sipò, epi souvan èd pwofesyonèl.",
    supply:"Pwodiksyon lèt tete drive pa demann. Pi souvan ak konplètman tete a vide, pi plis lèt pwodui. Sa a se poukisa nan premye semèn yo orè manje a san pitye.",
    stages:[
      {name:"Kolostrèm (Jou 1-3)",color:"gold",desc:"Premye lèt la. Piti nan volim men ekstrèmman wo nan antikò ak noutrisman. Vant bebe a gwosè yon boul. Li nòmal pou tibebe yo pèdi 5-7% pwa nesans nan jou sa yo."},
      {name:"Lèt Tranzisyon (Jou 3-14)",color:"teal",desc:"Lèt la 'vini'  -  volim ogmante dramatikman, tete yo vin anfle ak di. Sa inkonfortab fizikman. Konprès fre ak manje souvan ede."},
      {name:"Lèt Mati (Semèn 2+)",color:"blue",desc:"Pwodiksyon regle pou matche bezwen bebe a. Tete yo ka santi mwens di  -  sa pa vle di pwodiksyon diminye."},
    ],
    your_role:"Wòl ou nan premye de semèn yo se pwoteje chak opòtinite manje epi jere tout lòt bagay. Travay ou se fè alètman chemen ki mwens rezistans.",
    discussion:"Eske ou aprann sou alètman espesyalman  -  pa sèlman ke yo rekòmande li, men kòman li reyèlman travay? Ki kesyon ou genyen?",
  },
  fr:{title:"Comment Fonctionne Vraiment l'Allaitement",
    intro:"La plupart des gens pensent que l'allaitement est instinctif et facile. Ce n'est ni l'un ni l'autre. C'est une compétence qui prend 2-6 semaines à établir et nécessite des efforts significatifs, du soutien et souvent une aide professionnelle.",
    supply:"La production de lait maternel est pilotée par la demande. Plus le sein est drainé fréquemment et complètement, plus de lait est produit. C'est pourquoi dans les premières semaines le rythme d'alimentation est implacable.",
    stages:[
      {name:"Colostrum (Jours 1-3)",color:"gold",desc:"Le premier lait. Petit en volume mais extrêmement riche en anticorps et nutriments. L'estomac du bébé est de la taille d'une bille. Il est normal que les bébés perdent 5-7% de leur poids à la naissance."},
      {name:"Lait de Transition (Jours 3-14)",color:"teal",desc:"Le lait 'monte'  -  le volume augmente considérablement, les seins deviennent engorgés et durs. C'est physiquement inconfortable. Les compresses froides et l'alimentation fréquente aident."},
      {name:"Lait Mature (Semaine 2+)",color:"blue",desc:"La production se régule pour correspondre aux besoins du bébé. Les seins peuvent sembler plus doux  -  cela ne signifie pas que la production a diminué."},
    ],
    your_role:"Votre rôle dans les deux premières semaines est de protéger chaque opportunité d'alimentation et de gérer tout le reste. Votre travail est de faire de l'allaitement le chemin de moindre résistance.",
    discussion:"Avez-vous appris sur l'allaitement spécifiquement  -  pas seulement qu'il est recommandé, mais comment il fonctionne réellement? Quelles questions avez-vous?",
  },
};

const HARD={
  en:{title:"What Makes Breastfeeding Hard",
    intro:"Breastfeeding difficulties are the norm, not the exception. Being prepared for the most common challenges means you will not be blindsided  -  and you will not accidentally undermine her by suggesting formula at the first obstacle.",
    challenges:[
      {challenge:"Latch pain and nipple damage",color:"red",partner:"Do not minimize this. Latch pain in early breastfeeding is extremely common and often severe. Help her contact a lactation consultant quickly  -  within the first 72 hours if possible. A correct latch should not hurt."},
      {challenge:"Engorgement",color:"orange",partner:"Help her feed frequently. Offer warm compresses before feeding, cool compresses after. If severe, a lactation consultant or her provider can advise. Engorgement typically resolves within 24-72 hours."},
      {challenge:"Supply anxiety",color:"purple",partner:"The most common breastfeeding anxiety. Signs of adequate intake are wet diapers (6-8 per day) and weight gain  -  not how much you can see in a bottle. Do not reinforce supply anxiety by suggesting supplementation without professional guidance."},
      {challenge:"Exhaustion from feeding every 2-3 hours",color:"blue",partner:"This is not sustainable without your active help. Your job: bring the baby, help position, burp, return the baby. She should be able to hand the baby off immediately after feeding. The burden of night feeds should not fall entirely on her."},
      {challenge:"Nipple confusion or bottle preference",color:"teal",partner:"If supplementing with a bottle, ask the lactation consultant about paced bottle feeding technique to reduce nipple preference. This is worth knowing."},
    ],
    critical_rule:"Never suggest 'just give formula' unless a medical provider has recommended it. One well-timed offer of formula from you  -  even kindly meant  -  can permanently change the breastfeeding trajectory. If you are concerned about intake, help her contact her provider or a lactation consultant.",
    discussion:"What breastfeeding challenges have come up or do you anticipate? How do you plan to respond without accidentally undermining her?",
  },
  es:{title:"Qué Hace Difícil la Lactancia",
    intro:"Las dificultades con la lactancia son la norma, no la excepción. Estar preparado para los desafíos más comunes significa que no serás sorprendido.",
    challenges:[
      {challenge:"Dolor al agarre y daño en los pezones",color:"red",partner:"No minimices esto. El dolor al agarre en la lactancia temprana es extremadamente común y a menudo severo. Ayúdala a contactar a una consultora de lactancia rápidamente  -  dentro de las primeras 72 horas si es posible."},
      {challenge:"Congestión mamaria",color:"orange",partner:"Ayúdala a amamantar con frecuencia. Ofrece compresas cálidas antes de amamantar, frías después. La congestión típicamente se resuelve en 24-72 horas."},
      {challenge:"Ansiedad sobre la producción",color:"purple",partner:"La ansiedad más común sobre la lactancia. Los signos de ingesta adecuada son pañales mojados (6-8 por día) y aumento de peso, no lo que puedes ver en un biberón."},
      {challenge:"Agotamiento por alimentar cada 2-3 horas",color:"blue",partner:"Tu trabajo: trae al bebé, ayuda a posicionar, dale los golpecitos en la espalda, devuelve al bebé. La carga de las tomas nocturnas no debe recaer enteramente sobre ella."},
      {challenge:"Confusión de pezón o preferencia por el biberón",color:"teal",partner:"Si suplementas con biberón, pregunta a la consultora de lactancia sobre la técnica de alimentación con biberón a ritmo pausado."},
    ],
    critical_rule:"Nunca sugieras 'simplemente da fórmula' a menos que un proveedor médico lo haya recomendado. Una oferta de fórmula bien cronometrada  -  incluso bien intencionada  -  puede cambiar permanentemente la trayectoria de la lactancia.",
    discussion:"¿Qué desafíos de lactancia han surgido o anticipas? ¿Cómo planeas responder sin socavarla accidentalmente?",
  },
  ht:{title:"Sa Ki Rann Alètman Difisil",
    intro:"Difikilte alètman se nòm, pa eksepsyon. Prepare pou defi ki pi kouran yo vle di ou pa pral siprize.",
    challenges:[
      {challenge:"Doulè pran ak domaj pwent tete",color:"red",partner:"Pa minimize sa. Doulè pran nan alètman bonè ekstrèmman kouran epi souvan grav. Ede li kontakte yon konseyès alètman rapidman  -  nan premye 72 èdtan si posib."},
      {challenge:"Konjesyon",color:"orange",partner:"Ede li bay tete souvan. Ofri konprès cho anvan, fre apre. Konjesyon tipikman rezoud nan 24-72 èdtan."},
      {challenge:"Enkyetid sou pwodiksyon",color:"purple",partner:"Enkyetid alètman ki pi kouran. Siy manje adekwa se kouchèt mouye (6-8 pa jou) ak pran pwa, pa sa ou ka wè nan yon bibwon."},
      {challenge:"Fatig pou manje chak 2-3 èdtan",color:"blue",partner:"Travay ou: pote bebe a, ede pozisyone, fè rot, retounen bebe a. Chaj manje lannuit pa ta dwe tonbe nèt sou li."},
      {challenge:"Konfizyon twèt oswa preferans bibwon",color:"teal",partner:"Si ou siplemante ak yon bibwon, mande konseyès alètman sou teknik manje bibwon ritmik paze."},
    ],
    critical_rule:"Janm sijere 'jis bay fòmil' sof si yon pwofesyonèl medikal te rekòmande li. Yon sèl ofri fòmil nan bon moman  -  menm avèk bon entansyon  -  ka pèmanantman chanje trajektwa alètman.",
    discussion:"Ki defi alètman ki parèt oswa ou antisipe? Kòman ou planifye reponn san aksidantèlman minye li?",
  },
  fr:{title:"Ce qui Rend l'Allaitement Difficile",
    intro:"Les difficultés d'allaitement sont la norme, pas l'exception. Être préparé aux défis les plus courants signifie que vous ne serez pas pris au dépourvu.",
    challenges:[
      {challenge:"Douleur à la mise au sein et dommages aux mamelons",color:"red",partner:"Ne minimisez pas cela. La douleur à la mise au sein dans l'allaitement précoce est extrêmement courante et souvent sévère. Aidez-la à contacter rapidement une consultante en lactation."},
      {challenge:"Engorgement mammaire",color:"orange",partner:"Aidez-la à allaiter fréquemment. Proposez des compresses chaudes avant, froides après. L'engorgement se résout généralement en 24-72 heures."},
      {challenge:"Anxiété sur la production",color:"purple",partner:"L'anxiété la plus courante sur l'allaitement. Les signes d'apport adéquat sont les couches mouillées (6-8 par jour) et la prise de poids, pas ce que vous pouvez voir dans un biberon."},
      {challenge:"Épuisement d'allaiter toutes les 2-3 heures",color:"blue",partner:"Votre travail: amenez le bébé, aidez à positionner, faites roter, ramenez le bébé. La charge des tétées nocturnes ne doit pas reposer entièrement sur elle."},
      {challenge:"Confusion sein-tétine ou préférence pour le biberon",color:"teal",partner:"Si vous supplémentez avec un biberon, renseignez-vous auprès de la consultante en lactation sur la technique d'alimentation au biberon à rythme soutenu."},
    ],
    critical_rule:"Ne suggérez jamais 'donnez juste du lait infantile' à moins qu'un prestataire médical ne l'ait recommandé. Une offre de lait infantile bien synchronisée  -  même bien intentionnée  -  peut changer définitivement la trajectoire de l'allaitement.",
    discussion:"Quels défis d'allaitement sont apparus ou anticipez-vous? Comment planifiez-vous de répondre sans saper accidentellement son allaitement?",
  },
};

const FORMULA={
  en:{title:"When Formula Is the Right Choice",
    intro:"Formula feeding is a legitimate, valid choice. There are many reasons a family chooses or needs formula  -  medical necessity, adoption, personal choice, failed lactation despite best effort, return to work, or simply preference. A well-fed baby is the goal. How that happens is for the family to decide.",
    reasons:["Medical contraindication to breastfeeding  -  certain infections, medications, or conditions","Adoption or surrogacy  -  the birth parent may not be present","Insufficient milk supply despite professional support and full effort","Baby has a condition requiring specialized formula","Return to work or schedule makes breastfeeding unsustainable","Personal choice  -  this is sufficient","Partner is the primary parent and will be feeding alone"],
    respect:["Her feeding decision is hers  -  and it may be medically determined","Do not ask her to justify formula feeding to you or to others","Do not repeat things you have heard about 'breast is best' unless asked","If relatives ask, redirect: 'She is feeding the baby and that is what matters'","Formula-fed babies grow up healthy. This is not a compromise."],
    your_role:["Learn to prepare formula correctly  -  temperature, ratio, storage","Take formula feeds so she can sleep  -  this is one of your greatest assets","Never express disappointment about formula feeding even subtly","Know the cost and have it in your budget","Build formula prep into the night routine so she is not doing it alone at 3 AM"],
    discussion:"What is your honest feeling about formula feeding? Have you said anything about it  -  directly or indirectly  -  that may have added pressure?",
  },
  es:{title:"Cuando la Fórmula es la Elección Correcta",
    intro:"La alimentación con fórmula es una elección legítima y válida. Hay muchas razones por las que una familia elige o necesita fórmula  -  necesidad médica, adopción, elección personal, fracaso de la lactancia a pesar del mejor esfuerzo, regreso al trabajo, o simplemente preferencia.",
    reasons:["Contraindicación médica para la lactancia  -  ciertas infecciones, medicamentos o condiciones","Adopción o gestación subrogada","Producción de leche insuficiente a pesar del apoyo profesional","El bebé tiene una condición que requiere fórmula especializada","El regreso al trabajo hace que la lactancia sea insostenible","Elección personal  -  esto es suficiente"],
    respect:["Su decisión de alimentación es suya","No le pidas que justifique la alimentación con fórmula","No repitas cosas sobre 'la lactancia es mejor' a menos que se te pregunte","Los bebés alimentados con fórmula crecen sanos. Esto no es un compromiso."],
    your_role:["Aprende a preparar la fórmula correctamente","Toma las tomas de fórmula para que ella pueda dormir","Nunca expreses decepción sobre la alimentación con fórmula","Conoce el costo y tenlo en tu presupuesto","Incorpora la preparación de fórmula en la rutina nocturna"],
    discussion:"¿Cuál es tu sentimiento honesto sobre la alimentación con fórmula? ¿Has dicho algo al respecto  -  directa o indirectamente  -  que pueda haber añadido presión?",
  },
  ht:{title:"Lè Fòmil Se Bon Chwa",
    intro:"Bay bibwon avèk fòmil se yon chwa lejitim ak valid. Genyen anpil rezon yon fanmiy chwazi oswa bezwen fòmil  -  nesesite medikal, adopsyon, chwa pèsonèl, alètman echwe malgre pi bon efò, tounen nan travay, oswa jis preferans.",
    reasons:["Kontrendikasyon medikal pou alètman  -  sèten enfeksyon, medikaman, oswa kondisyon","Adopsyon oswa siroji","Pwodiksyon lèt ensifizian malgre sipò pwofesyonèl","Bebe a gen yon kondisyon ki mande fòmil espesyalize","Tounen nan travay rann alètman pa dirab","Chwa pèsonèl  -  sa ase"],
    respect:["Desizyon manje li se pa li","Pa mande li jistifye bay bibwon fòmil ba ou oswa bay lòt moun","Pa repete bagay ou tande sou 'tete pi bon' sof si yo mande ou","Tibebe ki bay bibwon fòmil grandi an sante. Sa pa yon konpromi."],
    your_role:["Aprann prepare fòmil kòrèkteman","Pran manje fòmil pou li ka dòmi","Janm eksprime dezapwobasyon sou bay bibwon fòmil","Konnen pri a epi genyen li nan bidjè ou","Entegre prepare fòmil nan woutinn lannuit"],
    discussion:"Kisa santi ou onèt sou bay bibwon fòmil? Eske ou te di yon bagay sou li  -  dirèkteman oswa endirèkteman  -  ki ka te ajoute presyon?",
  },
  fr:{title:"Quand le Biberon est le Bon Choix",
    intro:"L'alimentation au lait infantile est un choix légitime et valide. Il y a de nombreuses raisons pour lesquelles une famille choisit ou a besoin de lait infantile  -  nécessité médicale, adoption, choix personnel, échec de l'allaitement malgré les meilleurs efforts, retour au travail, ou simplement préférence.",
    reasons:["Contre-indication médicale à l'allaitement  -  certaines infections, médicaments ou conditions","Adoption ou gestation pour autrui","Production de lait insuffisante malgré un soutien professionnel","Le bébé a une condition nécessitant une préparation spécialisée","Le retour au travail rend l'allaitement insoutenable","Choix personnel  -  cela suffit"],
    respect:["Sa décision d'alimentation est la sienne","Ne lui demandez pas de justifier l'alimentation au biberon","Ne répétez pas des choses sur 'le sein c'est mieux' à moins qu'on vous le demande","Les bébés nourris au biberon grandissent en bonne santé. Ce n'est pas un compromis."],
    your_role:["Apprenez à préparer le lait infantile correctement","Prenez en charge les biberons pour qu'elle puisse dormir","N'exprimez jamais de déception concernant l'alimentation au biberon","Connaissez le coût et prévoyez-le dans votre budget","Intégrez la préparation du biberon dans la routine nocturne"],
    discussion:"Quel est votre sentiment honnête concernant l'alimentation au biberon? Avez-vous dit quelque chose à ce sujet  -  directement ou indirectement  -  qui a pu ajouter de la pression?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecHowWorks({lang,C}){
  const d=HOW_WORKS[lang];
  const [open,setOpen]=useState(null);
  const cm={gold:C.gold,teal:C.teal,blue:C.blue};
  return <div>
    <div style={{background:C.pink+"0d",border:"1px solid "+C.pink+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:12,padding:16,marginBottom:16}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",marginBottom:8}}>SUPPLY & DEMAND  -  THE KEY PRINCIPLE</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.supply}</p>
    </div>
    {d.stages.map((s,i)=>{
      const clr=cm[s.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:12,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{s.name}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:"12px 0 0",paddingTop:12,borderTop:"1px solid "+clr+"20"}}>{s.desc}</p>}
      </div>;
    })}
    <div style={{background:C.green+"0a",border:"1px solid "+C.green+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:6}}>YOUR ROLE</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.your_role}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecHard({lang,C}){
  const d=HARD[lang];
  const [open,setOpen]=useState(null);
  const cm={red:C.red,orange:C.orange,purple:C.purple,blue:C.blue,teal:C.teal};
  return <div>
    <div style={{background:C.orange+"0d",border:"1px solid "+C.orange+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.challenges.map((ch,i)=>{
      const clr=cm[ch.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"0e":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{ch.challenge}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid "+clr+"20"}}>
          <div style={{fontSize:10,color:clr,fontFamily:"'DM Mono',monospace",marginBottom:6}}>YOUR ROLE</div>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{ch.partner}</p>
        </div>}
      </div>;
    })}
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.red,fontFamily:"'DM Mono',monospace",marginBottom:6}}>CRITICAL RULE</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.critical_rule}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecFormula({lang,C}){
  const d=FORMULA[lang];
  return <div>
    <div style={{background:C.blue+"0d",border:"1px solid "+C.blue+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:14}}>
      <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:14,padding:16}}>
        <div style={{fontSize:10,color:C.teal,fontFamily:"'DM Mono',monospace",marginBottom:10}}>REASONS FAMILIES CHOOSE FORMULA</div>
        {d.reasons.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:C.teal,flexShrink:0,marginTop:5}}/>
          <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{r}</span>
        </div>)}
      </div>
      <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:14,padding:16}}>
        <div style={{fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:10}}>HOW TO RESPECT HER CHOICE</div>
        {d.respect.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:5}}/>
          <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{r}</span>
        </div>)}
      </div>
    </div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:14,padding:16,marginBottom:14}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",marginBottom:10}}>YOUR SPECIFIC ROLE</div>
      {d.your_role.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.accent,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{r}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC_G9={
  en:{
    0:{icon:"🤱",text:"Partner support is one of the strongest predictors of breastfeeding success and duration. A partner who understands how breastfeeding works, what makes it hard, and what their specific role is gives a breastfeeding parent a significant advantage. A partner who does not understand, offers formula at the first difficulty, or makes the feeding parent feel unsupported is a primary reason people stop breastfeeding before they want to."},
    3:{icon:"👐",title:"Your Role at Every Feeding",text:"At every feeding your job is the same: bring the baby, help her get comfortable, have water and a snack ready, handle the burping and the return, then take care of cleanup. She should not have to get up, ask for anything, or manage logistics. The feeding itself is her work. Everything around it is yours. In the early weeks a feeding happens every 2-3 hours around the clock. That is 8-12 sessions per day. If you take half the surrounding tasks, you have just cut her workload in half."},
    4:{icon:"📊",title:"Latch, Supply and Pumping Basics",text:"A good latch is wide and asymmetric  -  more areola visible above the nipple than below, chin touching the breast, lips flanged out. Shallow latch causes pain and poor milk transfer. If she is in significant pain beyond the first few days, a lactation consultant can assess and correct the latch. Supply is maintained by consistent removal of milk. If she is returning to work, a pumping schedule that mimics feeding frequency helps maintain supply. Pump parts must be sterilized and storage guidelines followed. Pumped milk keeps 4 hours at room temperature, 4 days in the refrigerator, and 6-12 months in the freezer."},
    6:{icon:"💛",title:"Supporting Her Decision",text:"Whatever she decides about feeding, your job is to support it without reservation. If she wants to breastfeed and it is hard: do not suggest formula. Get help. If she wants to stop breastfeeding: support her fully without expressing disappointment. If she chooses formula from the start: this is her choice and it is enough. Your opinion about how the baby is fed is secondary to her lived experience, her body, and her choice. The goal is a fed baby and a supported parent. Both of those are achievable regardless of method."},
    7:{icon:"🤝",title:"Bottle Feeding Together",text:"If bottle feeding  -  whether with formula or pumped milk  -  you have an opportunity that breastfeeding does not as easily offer: you can feed the baby. Take it. Skin-to-skin bottle feeding, responding to hunger cues rather than a schedule, paced bottle feeding (holding the bottle horizontally to slow flow), and consistent physical closeness during feeding build the same bond that breastfeeding builds. Feeding is connection time. Make it yours too."},
  },
  es:{
    0:{icon:"🤱",text:"El apoyo de la pareja es uno de los predictores más fuertes del éxito y la duración de la lactancia. Una pareja que no entiende o ofrece fórmula ante la primera dificultad es una razón principal por la que las personas dejan de amamantar antes de querer."},
    3:{icon:"👐",title:"Tu Rol en Cada Toma",text:"En cada toma tu trabajo es el mismo: trae al bebé, ayúdala a ponerse cómoda, ten agua y un bocadillo listos, maneja los eructos y el regreso, luego cuida la limpieza. En las primeras semanas una toma ocurre cada 2-3 horas. Si tomas la mitad de las tareas circundantes, acabas de reducir su carga de trabajo a la mitad."},
    4:{icon:"📊",title:"Agarre, Producción y Extracción Básicos",text:"Un buen agarre es amplio y asimétrico  -  más areola visible encima del pezón que debajo. Si regresa al trabajo, un programa de extracción que imita la frecuencia de alimentación ayuda a mantener la producción. La leche extraída se conserva 4 horas a temperatura ambiente, 4 días en el refrigerador y 6-12 meses en el congelador."},
    6:{icon:"💛",title:"Apoyar Su Decisión",text:"Cualquiera que sea su decisión sobre la alimentación, tu trabajo es apoyarla sin reservas. Tu opinión sobre cómo se alimenta al bebé es secundaria a su experiencia vivida, su cuerpo y su elección."},
    7:{icon:"🤝",title:"Alimentar con Biberón Juntos",text:"Si alimentas con biberón, tienes una oportunidad que la lactancia no ofrece tan fácilmente: puedes alimentar al bebé. El contacto piel con piel al dar el biberón y la alimentación pausada construyen el mismo vínculo que construye la lactancia."},
  },
  ht:{
    0:{icon:"🤱",text:"Sipò patnè se youn nan pi fò predikatè siksè alètman ak dire. Yon patnè ki pa konprann oswa ofri fòmil nan premye difikilte a se yon rezon prensipal moun sispann bay tete anvan yo vle."},
    3:{icon:"👐",title:"Wòl Ou nan Chak Manje",text:"Nan chak manje travay ou se menm: pote bebe a, ede li vin konfòtab, genyen dlo ak yon goute pare, jere rot ak retounen, epi okipe netwayaj. Nan premye semèn yo yon manje rive chak 2-3 èdtan. Si ou pran mwatye travay ki antoure yo, ou sèlman diminye chaj travay li an mwatye."},
    4:{icon:"📊",title:"Pran, Pwodiksyon ak Baz Ponp",text:"Yon bon pran laj ak asimetrik. Si li tounen nan travay, yon orè ponp ki imite frekans manje ede kenbe pwodiksyon. Lèt pouse kenbe 4 èdtan nan tanperati chanm, 4 jou nan frijidè, ak 6-12 mwa nan kongeleò."},
    6:{icon:"💛",title:"Sipòte Desizyon Li",text:"Kèlkeswa desizyon li sou manje, travay ou se sipòte li san rezèv. Opinyon ou sou kòman yo manje bebe a segondè ak eksperyans li viv, kò li, ak chwa li."},
    7:{icon:"🤝",title:"Bay Bibwon Ansanm",text:"Si ou bay bibwon, ou gen yon opòtinite alètman pa ofri osi fasil: ou ka manje bebe a. Kontak po-a-po pandan bay bibwon ak manje ritmik paze konstwi menm lyen alètman konstwi."},
  },
  fr:{
    0:{icon:"🤱",text:"Le soutien du partenaire est l'un des prédicteurs les plus forts du succès et de la durée de l'allaitement. Un partenaire qui ne comprend pas ou offre du lait infantile à la première difficulté est une raison principale pour laquelle les gens arrêtent d'allaiter avant de le vouloir."},
    3:{icon:"👐",title:"Votre Rôle à Chaque Tétée",text:"À chaque tétée votre travail est le même: amenez le bébé, aidez-la à s'installer confortablement, ayez de l'eau et une collation prête, gérez les rots et le retour. Dans les premières semaines une tétée se produit toutes les 2-3 heures. Si vous prenez la moitié des tâches environnantes, vous venez de réduire sa charge de travail de moitié."},
    4:{icon:"📊",title:"Mise au Sein, Production et Bases du Tire-lait",text:"Une bonne mise au sein est large et asymétrique. Si elle retourne au travail, un programme de tire-lait qui imite la fréquence d'alimentation aide à maintenir la production. Le lait tiré se conserve 4 heures à température ambiante, 4 jours au réfrigérateur et 6-12 mois au congélateur."},
    6:{icon:"💛",title:"Soutenir Sa Décision",text:"Quelle que soit sa décision sur l'alimentation, votre travail est de la soutenir sans réserve. Votre opinion sur la façon dont le bébé est nourri est secondaire à son expérience vécue, son corps et son choix."},
    7:{icon:"🤝",title:"Donner le Biberon Ensemble",text:"Si vous donnez le biberon, vous avez une opportunité que l'allaitement n'offre pas aussi facilement: vous pouvez nourrir le bébé. Le contact peau-à-peau pendant le biberon et l'alimentation soutenue à rythme soutenu construisent le même lien que l'allaitement."},
  },
};

export default function PartnerFeedingGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_G9[lang]||GENERIC_G9.en;
  const kpis=[
    {icon:"🤱",value:"#1",label:lang==="en"?"PARTNER SUPPORT PREDICTS BF SUCCESS":lang==="es"?"APOYO PAREJA PREDICE ÉXITO LM":lang==="ht"?"SIPÒ PATNÈ PREDI SIKSÈ ALÈTMAN":"SOUTIEN PARTENAIRE PRÉDIT SUCCÈS AL",color:C.pink},
    {icon:"⏰",value:"8-12",label:lang==="en"?"FEEDINGS PER DAY NEWBORN":lang==="es"?"TOMAS POR DÍA RECIÉN NACIDO":lang==="ht"?"MANJE PA JOU TIBEBE NOUVO":"TÉTÉES PAR JOUR NOUVEAU-NÉ",color:C.orange},
    {icon:"🍼",value:"Both",label:lang==="en"?"BREAST & FORMULA ARE VALID":lang==="es"?"PECHO Y FÓRMULA SON VÁLIDOS":lang==="ht"?"TETE AK FÒMIL VALID":"SEIN ET BIBERON SONT VALIDES",color:C.green},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.teal},
  ];
  const genDiv=(icon,title,text)=><div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{icon}</div>{title&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>}<p style={{fontSize:13.5,color:C.muted,maxWidth:540,margin:"0 auto",lineHeight:1.75}}>{text}</p></div>;
  const renderSection=()=>{
    switch(section){
      case 0: return genDiv(g[0].icon,null,g[0].text);
      case 1: return <SecHowWorks lang={lang} C={C}/>;
      case 2: return <SecHard lang={lang} C={C}/>;
      case 3: return genDiv(g[3].icon,g[3].title,g[3].text);
      case 4: return genDiv(g[4].icon,g[4].title,g[4].text);
      case 5: return <SecFormula lang={lang} C={C}/>;
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Feeding </span>
                  <span style={{background:"linear-gradient(135deg,"+C.pink+","+C.purple+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Your Baby </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>A Partner's Role in Feeding</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Infant Feeding Support</div>
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
            {section<navLabels.length-1?<button onClick={()=>setSection(s=>s+1)} style={{background:C.accent+"18",border:"1px solid "+C.accent+"45",borderRadius:10,padding:"8px 18px",color:C.accent,fontSize:11.5,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{navLabels[section+1]} {ICONS[section+1]} &rarr;</button>:<div/>}
          </div>
          <div style={{textAlign:"center",fontSize:10.5,marginTop:24,lineHeight:1.7,color:dark?"rgba(148,163,184,0.22)":"rgba(30,41,59,0.35)",fontFamily:"'DM Mono',monospace"}}>Dieudonne Partner Hub · Created by and Researched by Chery Talent Management Agency</div>
        </div>
      </div>
    </div>
  );
}
