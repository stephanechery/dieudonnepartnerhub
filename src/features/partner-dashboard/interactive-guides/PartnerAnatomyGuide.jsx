import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["The Pregnant Body","Trimester by Trimester","The Cervix Explained","Fetal Positioning","Labor Progress","Reading the Monitors","Navigating Appointments","Medical Glossary"],
  es:["El Cuerpo Embarazado","Trimestre por Trimestre","El Cuello Uterino Explicado","Posición Fetal","Progreso del Parto","Leer los Monitores","Navegar Citas Médicas","Glosario Médico"],
  ht:["Kò Ansent","Trimès pa Trimès","Kou Iterin Eksplike","Pozisyon Fetyal","Pwogrè Travay","Li Monitè Yo","Navige Randevou","Glosè Medikal"],
  fr:["Le Corps Enceint","Trimestre par Trimestre","Le Col de l'Utérus Expliqué","Positionnement Foetal","Progression du Travail","Lire les Moniteurs","Naviguer les Rendez-vous","Glossaire Médical"],
};
const ICONS=["🫀","📅","🔬","👶","⏱️","📊","🏥","📖"];

const BODY_OVERVIEW={
  en:{
    title:"What Is Happening Inside  -  The Big Picture",
    intro:"Most partners understand pregnancy in terms of what they can see: the growing belly, the ultrasound images, the due date on the calendar. But understanding what is happening inside gives you a completely different level of presence. When you know what the placenta actually does, what the cervix is, and how labor physically unfolds, you stop being a visitor at your own child's birth.",
    systems:[
      {name:"The Uterus",icon:"🫀",color:"pink",desc:"The uterus is a muscular organ that expands from the size of a fist to accommodate a full-term baby. During pregnancy it grows upward into the abdomen. During labor, the uterine muscles contract rhythmically to push the baby downward through the cervix and birth canal. Contractions are the uterus working  -  not malfunctioning."},
      {name:"The Placenta",icon:"🌿",color:"green",desc:"The placenta is an organ that grows specifically for pregnancy. It attaches to the uterine wall and connects to the baby via the umbilical cord. It delivers oxygen and nutrients to the baby and removes waste. It also produces hormones that maintain the pregnancy. After birth, the placenta is delivered  -  this is the third stage of labor."},
      {name:"Amniotic Fluid",icon:"💧",color:"blue",desc:"The amniotic sac contains fluid that cushions and protects the baby, regulates temperature, allows movement for musculoskeletal development, and helps develop the baby's lungs as the baby practices breathing. When the sac ruptures  -  water breaking  -  this signals that labor is imminent or already underway. Not everyone's water breaks dramatically."},
      {name:"The Cervix",icon:"🔬",color:"purple",desc:"The cervix is the lower portion of the uterus that connects to the vagina. During pregnancy it stays closed and firm. As labor approaches it softens (ripens), thins out (effaces), and gradually opens (dilates) from 0 to 10 centimeters. 10 cm is fully dilated and ready to push. This is what providers check during cervical exams."},
      {name:"The Umbilical Cord",icon:"🌀",color:"teal",desc:"The umbilical cord connects the baby to the placenta. It contains blood vessels that carry oxygenated blood to the baby and return deoxygenated blood to the placenta. Delayed cord clamping  -  waiting to cut the cord until it stops pulsing  -  allows additional blood transfer to the baby. This is typically 1-3 minutes after birth."},
    ],
    discussion:"What has surprised you most about how pregnancy actually works? What would you ask your provider if you understood the biology better?",
  },
  es:{
    title:"Lo Que Ocurre Adentro  -  El Panorama General",
    intro:"La mayoría de las parejas entienden el embarazo en términos de lo que pueden ver. Pero entender lo que ocurre adentro te da un nivel completamente diferente de presencia. Cuando sabes lo que hace la placenta, qué es el cuello uterino y cómo se desarrolla físicamente el parto, dejas de ser un visitante en el nacimiento de tu propio hijo.",
    systems:[
      {name:"El Útero",icon:"🫀",color:"pink",desc:"El útero es un órgano muscular que se expande para acomodar un bebé a término. Durante el parto, los músculos uterinos se contraen rítmicamente para empujar al bebé hacia abajo a través del cuello uterino. Las contracciones son el útero trabajando, no fallando."},
      {name:"La Placenta",icon:"🌿",color:"green",desc:"La placenta es un órgano que crece específicamente para el embarazo. Se une a la pared uterina y se conecta al bebé a través del cordón umbilical. Entrega oxígeno y nutrientes al bebé y elimina los desechos. También produce hormonas que mantienen el embarazo."},
      {name:"El Líquido Amniótico",icon:"💧",color:"blue",desc:"El saco amniótico contiene líquido que amortigua y protege al bebé. Cuando el saco se rompe, esto señala que el parto es inminente. No todos los casos de rotura de membranas son dramáticos."},
      {name:"El Cuello Uterino",icon:"🔬",color:"purple",desc:"El cuello uterino permanece cerrado y firme durante el embarazo. A medida que se acerca el parto, se ablanda, se adelgaza (borra) y gradualmente se abre (dilata) de 0 a 10 centímetros. 10 cm es completamente dilatado."},
      {name:"El Cordón Umbilical",icon:"🌀",color:"teal",desc:"El cordón umbilical conecta al bebé con la placenta. El pinzamiento tardío del cordón, esperar a cortarlo hasta que deja de pulsar, permite la transferencia de sangre adicional al bebé."},
    ],
    discussion:"¿Qué te ha sorprendido más sobre cómo funciona realmente el embarazo? ¿Qué le preguntarías a tu proveedor si entendieras mejor la biología?",
  },
  ht:{
    title:"Sa K ap Pase Anndan  -  Gwo Imaj La",
    intro:"Pifò patnè konprann gwosès nan tèm sa yo ka wè. Men konprann sa k ap pase anndan ba ou yon nivo prezans konplètman diferan. Lè ou konnen kisa plasenta reyèlman fè, kisa kou iterin an se, epi kòman travay dewoule fizikman, ou sispann yon vizitè nan nesans pwòp pitit ou.",
    systems:[
      {name:"Utéris La",icon:"🫀",color:"pink",desc:"Utéris la se yon ògàn miskilè ki elaji pou akomode yon bebe plen tèm. Pandan travay, miskilati uterin yo kontrakte ritmikman pou pouse bebe a desann atravè kou iterin an. Kontraksiyon se utéris ki travay, pa echwe."},
      {name:"Plasenta a",icon:"🌿",color:"green",desc:"Plasenta a se yon ògàn ki grandi espesyalman pou gwosès. Li tache nan miray uterin an epi konekte ak bebe a atravè kòdon ombilikal la. Li bay bebe a oksijèn ak noutrisman epi retire dèchè."},
      {name:"Likid Amniyotik",icon:"💧",color:"blue",desc:"Sak amniyotik la gen likid ki kousinen epi pwoteje bebe a. Lè sak la kase, sa siyal travay iminans oswa deja an kou. Pa tout moun dlo kase dramatikman."},
      {name:"Kou Iterin an",icon:"🔬",color:"purple",desc:"Kou iterin an rete fèmen ak fèm pandan gwosès. Pandan travay apwoche li moulen, fin (efase), epi gradyèlman louvri (dilate) soti 0 a 10 santimèt. 10 sm se nèt dilate."},
      {name:"Kòdon Ombilikal la",icon:"🌀",color:"teal",desc:"Kòdon ombilikal la konekte bebe a ak plasenta a. Koupe kòdon anreta, tann li koupe jiskaske li sispann pouse, pèmèt transfè san siplemantè bay bebe a."},
    ],
    discussion:"Ki sa ki pi sipriz ou sou kòman gwosès reyèlman travay? Ki sa ou ta mande pwofesyonèl ou si ou te konprann biyoloji a pi byen?",
  },
  fr:{
    title:"Ce qui Se Passe à l'Intérieur  -  La Vue d'Ensemble",
    intro:"La plupart des partenaires comprennent la grossesse en termes de ce qu'ils peuvent voir. Mais comprendre ce qui se passe à l'intérieur vous donne un niveau de présence complètement différent. Quand vous savez ce que fait réellement le placenta, ce qu'est le col de l'utérus et comment le travail se déroule physiquement, vous cessez d'être un visiteur à la naissance de votre propre enfant.",
    systems:[
      {name:"L'Utérus",icon:"🫀",color:"pink",desc:"L'utérus est un organe musculaire qui s'étend pour accommoder un bébé à terme. Pendant le travail, les muscles utérins se contractent rythmiquement pour pousser le bébé vers le bas à travers le col. Les contractions sont l'utérus qui travaille, pas qui échoue."},
      {name:"Le Placenta",icon:"🌿",color:"green",desc:"Le placenta est un organe qui pousse spécifiquement pour la grossesse. Il se fixe à la paroi utérine et se connecte au bébé via le cordon ombilical. Il délivre oxygène et nutriments au bébé et élimine les déchets."},
      {name:"Le Liquide Amniotique",icon:"💧",color:"blue",desc:"Le sac amniotique contient du liquide qui amortit et protège le bébé. Quand le sac se rompt, cela signale que le travail est imminent. La rupture des eaux n'est pas toujours dramatique."},
      {name:"Le Col de l'Utérus",icon:"🔬",color:"purple",desc:"Le col reste fermé et ferme pendant la grossesse. À l'approche du travail, il se ramollit, s'amincit (s'efface) et s'ouvre progressivement (se dilate) de 0 à 10 centimètres. 10 cm est complètement dilaté."},
      {name:"Le Cordon Ombilical",icon:"🌀",color:"teal",desc:"Le cordon ombilical relie le bébé au placenta. Le clampage tardif du cordon, attendre de le couper jusqu'à ce qu'il cesse de battre, permet un transfert de sang supplémentaire vers le bébé."},
    ],
    discussion:"Qu'est-ce qui vous a le plus surpris sur le fonctionnement réel de la grossesse? Que demanderiez-vous à votre prestataire si vous compreniez mieux la biologie?",
  },
};

const CERVIX={
  en:{
    title:"The Cervix Explained: The Number Everyone Watches",
    intro:"During labor, the question everyone keeps asking is 'how dilated is she?' Understanding what dilation and effacement actually mean makes you a better advocate and reduces your anxiety when you hear the numbers.",
    concepts:[
      {term:"Effacement",number:"0-100%",color:"blue",explain:"Effacement is the thinning and shortening of the cervix. Before labor the cervix is about 3-4 cm long and firm. As labor begins it thins out to become part of the lower uterine wall. 0% = thick and uneffaced. 100% = completely thinned. Effacement often begins before dilation."},
      {term:"Dilation",number:"0-10cm",color:"green",explain:"Dilation is the opening of the cervix. It progresses from 0 (closed) to 10 cm (fully open). Latent labor is 0-6 cm. Active labor is 6-10 cm. Active labor typically progresses faster than latent labor. At 10 cm pushing can begin. Partners often feel like 1-2 cm of progress is too slow  -  in early labor this is normal."},
      {term:"Station",number:"-3 to +3",color:"purple",explain:"Station describes how far down the baby's head has descended into the pelvis. Negative stations (-3, -2, -1) mean the head is above the ischial spines. Zero station means the head is at the spines. Positive stations (+1, +2, +3) mean the head is descending. +3 is crowning. A baby at -3 station with a closed cervix at 38 weeks may still have weeks to go."},
      {term:"Position",number:"Anterior/Posterior",color:"teal",explain:"Cervical position refers to where the cervix is pointing. A posterior cervix (pointing toward the back) is typical early in labor. An anterior cervix (pointing toward the front) means labor is progressing well. 'The cervix is becoming anterior' is good news."},
    ],
    partner_notes:[
      "When she is at 4 cm she is in early active labor  -  this is significant progress, not 'only 4 cm'",
      "Progress from 1-4 cm can take many hours. Progress from 7-10 cm often happens much faster.",
      "A cervical exam tells you where she is right now  -  not how long until birth",
      "She can go from 5 cm to pushing in two hours or in ten hours. Both are within normal range.",
      "If you hear 'no change' after several hours, this is information for clinical assessment  -  not cause for panic",
    ],
    discussion:"Have you asked your provider to explain what they find at each prenatal exam? What numbers have you already heard that you did not fully understand?",
  },
  es:{
    title:"El Cuello Uterino Explicado: El Número que Todos Observan",
    intro:"Durante el parto, la pregunta que todos siguen haciendo es '¿cuánto está dilatada?' Entender qué significa realmente la dilatación y el borramiento te convierte en un mejor defensor y reduce tu ansiedad cuando escuchas los números.",
    concepts:[
      {term:"Borramiento",number:"0-100%",color:"blue",explain:"El borramiento es el adelgazamiento y acortamiento del cuello uterino. 0% = grueso y sin borrar. 100% = completamente adelgazado. El borramiento a menudo comienza antes de la dilatación."},
      {term:"Dilatación",number:"0-10cm",color:"green",explain:"La dilatación es la apertura del cuello uterino de 0 (cerrado) a 10 cm (completamente abierto). El parto latente es 0-6 cm. El parto activo es 6-10 cm. A los 10 cm puede comenzar a pujar."},
      {term:"Estación",number:"-3 a +3",color:"purple",explain:"La estación describe qué tan lejos ha descendido la cabeza del bebé hacia la pelvis. Las estaciones negativas significan que la cabeza está por encima de las espinas isquiáticas. La estación +3 es el coronamiento."},
      {term:"Posición",number:"Anterior/Posterior",color:"teal",explain:"La posición cervical se refiere a hacia dónde apunta el cuello uterino. Un cuello anterior significa que el parto progresa bien. 'El cuello está volviéndose anterior' es buena señal."},
    ],
    partner_notes:[
      "Cuando está en 4 cm está en trabajo de parto activo temprano  -  esto es un progreso significativo",
      "El progreso de 1-4 cm puede tomar muchas horas. El progreso de 7-10 cm a menudo ocurre mucho más rápido.",
      "Un examen cervical te dice dónde está ahora mismo, no cuánto tiempo falta para el nacimiento",
      "Puede pasar de 5 cm a pujar en dos horas o en diez horas. Ambos están dentro del rango normal.",
    ],
    discussion:"¿Le has pedido a tu proveedor que te explique lo que encuentra en cada examen prenatal? ¿Qué números has escuchado ya que no comprendiste completamente?",
  },
  ht:{
    title:"Kou Iterin Eksplike: Nimewo Tout Moun Gade",
    intro:"Pandan travay, kesyon tout moun kontinye mande se 'konbyen li dilate?' Konprann kisa dilatasyon ak efasman reyèlman vle di fè ou yon pi bon defansè epi diminye enkyetid ou lè ou tande nimewo yo.",
    concepts:[
      {term:"Efasman",number:"0-100%",color:"blue",explain:"Efasman se amincissement ak reyositman kou iterin an. 0% = epè ak pa efase. 100% = nèt aminci. Efasman souvan kòmanse anvan dilatasyon."},
      {term:"Dilatasyon",number:"0-10cm",color:"green",explain:"Dilatasyon se louvri kou iterin an soti 0 (fèmen) a 10 cm (nèt louvri). Travay latan se 0-6 cm. Travay aktif se 6-10 cm. A 10 cm, pouse ka kòmanse."},
      {term:"Estasyon",number:"-3 a +3",color:"purple",explain:"Estasyon dekri konbyen tèt bebe a desann nan basen an. Estasyon negatif vle di tèt la anlè epine iskyatik yo. Estasyon +3 se kouwonn."},
      {term:"Pozisyon",number:"Anteryè/Pòsteryè",color:"teal",explain:"Pozisyon kou iterin an refere a kote kou a ap montre. Yon kou iterin anteryè vle di travay ap pwogresi byen. 'Kou iterin an ap vin anteryè' se bon nouvèl."},
    ],
    partner_notes:[
      "Lè li nan 4 cm li nan travay aktif bonè  -  sa se pwogrè enpòtan, pa 'sèlman 4 cm'",
      "Pwogrè soti 1-4 cm ka pran anpil èdtan. Pwogrè soti 7-10 cm souvan rive pi vit.",
      "Yon egzamen kou iterin di ou kote li ye kounye a, pa konbyen tan jiska nesans",
      "Li ka pase soti 5 cm nan pouse nan de èdtan oswa nan dis èdtan. Tou de nan nòmal.",
    ],
    discussion:"Eske ou mande pwofesyonèl ou eksplike kisa yo jwenn nan chak egzamen prenatal? Ki nimewo ou te deja tande ou pa t konprann nèt?",
  },
  fr:{
    title:"Le Col de l'Utérus Expliqué: Le Chiffre que Tout le Monde Surveille",
    intro:"Pendant le travail, la question que tout le monde pose est 'à combien de cm est-elle dilatée?' Comprendre ce que signifient réellement la dilatation et l'effacement fait de vous un meilleur défenseur et réduit votre anxiété quand vous entendez les chiffres.",
    concepts:[
      {term:"Effacement",number:"0-100%",color:"blue",explain:"L'effacement est l'amincissement et le raccourcissement du col. 0% = épais et non effacé. 100% = complètement aminci. L'effacement commence souvent avant la dilatation."},
      {term:"Dilatation",number:"0-10cm",color:"green",explain:"La dilatation est l'ouverture du col de 0 (fermé) à 10 cm (complètement ouvert). Le travail latent est de 0-6 cm. Le travail actif est de 6-10 cm. À 10 cm la poussée peut commencer."},
      {term:"Station",number:"-3 à +3",color:"purple",explain:"La station décrit à quel point la tête du bébé est descendue dans le bassin. Les stations négatives signifient que la tête est au-dessus des épines sciatiques. La station +3 est le couronnement."},
      {term:"Position",number:"Antérieure/Postérieure",color:"teal",explain:"La position cervicale fait référence à la direction du col. Un col antérieur signifie que le travail progresse bien. 'Le col devient antérieur' est une bonne nouvelle."},
    ],
    partner_notes:[
      "Quand elle est à 4 cm elle est en travail actif précoce  -  c'est un progrès significatif, pas 'seulement 4 cm'",
      "La progression de 1-4 cm peut prendre plusieurs heures. La progression de 7-10 cm se produit souvent beaucoup plus vite.",
      "Un examen cervical vous dit où elle en est maintenant, pas combien de temps jusqu'à la naissance",
      "Elle peut passer de 5 cm à pousser en deux heures ou en dix heures. Les deux sont dans la normale.",
    ],
    discussion:"Avez-vous demandé à votre prestataire d'expliquer ce qu'il trouve à chaque examen prénatal? Quels chiffres avez-vous déjà entendus que vous ne compreniez pas complètement?",
  },
};

const GLOSSARY={
  en:[
    {term:"Braxton Hicks",def:"Practice contractions that tighten and release without progressing. Usually irregular and not intensifying. Real labor contractions get longer, stronger, and closer together."},
    {term:"Effacement",def:"Thinning of the cervix, measured 0-100%. Must happen along with dilation for birth to occur."},
    {term:"Dilation",def:"Opening of the cervix from 0-10 centimeters. 10 cm is fully dilated and ready to push."},
    {term:"Station",def:"How far down the baby's head has descended in the pelvis. Scale from -3 (high) to +3 (crowning)."},
    {term:"Fundal height",def:"Measurement from pubic bone to top of uterus in centimeters. Roughly correlates with weeks of pregnancy."},
    {term:"Crowning",def:"When the baby's head is visible at the vaginal opening during pushing. This is station +3."},
    {term:"Engagement / Lightening",def:"When the baby drops lower into the pelvis. She may feel she can breathe better but has more pelvic pressure."},
    {term:"Bloody show",def:"Mucus tinged with blood that indicates the cervix is beginning to change. Normal sign of early labor."},
    {term:"Rupture of membranes",def:"Water breaking. Can be a gush or a trickle. Call the provider immediately."},
    {term:"Oxytocin",def:"The hormone that drives contractions. Synthetic oxytocin (Pitocin) is used to induce or augment labor."},
    {term:"Epidural",def:"Regional anesthesia injected into the epidural space in the lower back. Reduces or eliminates pain below the injection site."},
    {term:"VBAC",def:"Vaginal Birth After Cesarean. A vaginal birth attempted by someone who had a previous c-section."},
    {term:"Meconium",def:"Baby's first bowel movement. If present in amniotic fluid before birth, providers monitor closely."},
    {term:"Apgar score",def:"Assessment of the newborn at 1 and 5 minutes after birth. Scores 0-10. 7-10 is reassuring."},
  ],
  es:[
    {term:"Contracciones de Braxton Hicks",def:"Contracciones de práctica que se tensan y liberan sin progresar. Generalmente irregulares. Las contracciones reales se vuelven más largas, fuertes y cercanas."},
    {term:"Borramiento",def:"Adelgazamiento del cuello uterino, medido de 0-100%."},
    {term:"Dilatación",def:"Apertura del cuello uterino de 0-10 centímetros. 10 cm es completamente dilatado."},
    {term:"Estación",def:"Qué tan abajo ha descendido la cabeza del bebé en la pelvis. Escala de -3 (alta) a +3 (coronación)."},
    {term:"Altura del fondo",def:"Medida del hueso púbico a la parte superior del útero. Corresponde aproximadamente con las semanas de embarazo."},
    {term:"Coronamiento",def:"Cuando la cabeza del bebé es visible en la abertura vaginal durante el pujo."},
    {term:"Encajamiento",def:"Cuando el bebé desciende hacia la pelvis. Puede respirar mejor pero siente más presión pélvica."},
    {term:"Tapón mucoso",def:"Moco con tinte de sangre que indica que el cuello comienza a cambiar. Señal normal de parto temprano."},
    {term:"Ruptura de membranas",def:"Rotura de aguas. Llama al proveedor inmediatamente."},
    {term:"Epidural",def:"Anestesia regional que reduce o elimina el dolor debajo del sitio de inyección."},
    {term:"Puntuación Apgar",def:"Evaluación del recién nacido al 1 y 5 minutos. Escala 0-10. 7-10 es tranquilizador."},
  ],
  ht:[
    {term:"Kontraksiyon Braxton Hicks",def:"Kontraksiyon pratik ki sere epi relache san pwogresi. Nòmalman iregilye. Kontraksiyon reyèl vin pi long, pi fò, ak pi pre."},
    {term:"Efasman",def:"Amincissement kou iterin an, mezire 0-100%."},
    {term:"Dilatasyon",def:"Louvri kou iterin an soti 0-10 santimèt. 10 cm se nèt dilate."},
    {term:"Estasyon",def:"Konbyen tèt bebe a desann nan basen an. Echèl soti -3 (wo) a +3 (kouwonn)."},
    {term:"Wo fondal",def:"Mezirman soti zo pibik a somè itéris. Koresponn apwoksimativman ak semèn gwosès."},
    {term:"Kouwonn",def:"Lè tèt bebe a vizib nan ouvèti vajinal pandan pouse."},
    {term:"Ranplasman",def:"Lè bebe a desann pi ba nan basen an. Li ka respire pi byen men li santi plis presyon pelvik."},
    {term:"Bouchon mukè",def:"Mukis ak tach san ki endike kou a kòmanse chanje. Siy nòmal travay bonè."},
    {term:"Woup manbràn",def:"Dlo kase. Rele pwofesyonèl imedyatman."},
    {term:"Epidiral",def:"Anestezi rejyonal ki diminye oswa elimine doulè anba kote piki a."},
    {term:"Skò Apgar",def:"Evalyasyon tibebe nouvo-ne a 1 ak 5 minit. Echèl 0-10. 7-10 rasiran."},
  ],
  fr:[
    {term:"Contractions de Braxton Hicks",def:"Contractions de pratique qui se contractent et se relâchent sans progresser. Généralement irrégulières. Les vraies contractions deviennent plus longues, plus fortes et plus rapprochées."},
    {term:"Effacement",def:"Amincissement du col, mesuré de 0-100%."},
    {term:"Dilatation",def:"Ouverture du col de 0-10 centimètres. 10 cm est complètement dilaté."},
    {term:"Station",def:"À quel point la tête du bébé est descendue dans le bassin. Échelle de -3 (haute) à +3 (couronnement)."},
    {term:"Hauteur utérine",def:"Mesure de l'os pubien au sommet de l'utérus. Correspond approximativement aux semaines de grossesse."},
    {term:"Couronnement",def:"Quand la tête du bébé est visible à l'ouverture vaginale pendant la poussée."},
    {term:"Engagement",def:"Quand le bébé descend dans le bassin. Elle peut mieux respirer mais ressent plus de pression pelvienne."},
    {term:"Bouchon muqueux",def:"Mucus teinté de sang indiquant que le col commence à changer. Signe normal de travail précoce."},
    {term:"Rupture des membranes",def:"La poche des eaux se rompt. Appelez le prestataire immédiatement."},
    {term:"Péridurale",def:"Anesthésie régionale qui réduit ou élimine la douleur sous le site d'injection."},
    {term:"Score d'Apgar",def:"Évaluation du nouveau-né à 1 et 5 minutes. Échelle 0-10. 7-10 est rassurant."},
  ],
};

const GENERIC={
  en:{
    1:{icon:"📅",title:"Trimester by Trimester  -  Inside View",text:"First trimester (weeks 1-13): Organs form, the neural tube closes, the heart begins beating, limb buds appear. The embryo becomes a fetus at week 8. This is the period of greatest vulnerability to environmental factors. Second trimester (weeks 14-27): Rapid growth. Fetal movement begins. The baby develops distinct sleep and wake cycles. By week 20 the baby can hear. Third trimester (weeks 28-40): Significant brain development, fat accumulation, lung maturation. The baby positions for birth, usually head-down by week 36. These are the weeks when your presence at appointments starts to feel most urgent and most real."},
    3:{icon:"👶",title:"Fetal Positioning: Why It Matters",text:"The position of the baby in the uterus affects how labor unfolds. Vertex (head-down, facing back) is ideal  -  this is occiput anterior, the most favorable position for birth. Posterior position (facing forward) causes back labor  -  intense back pain with contractions. This is when hip squeezes and position changes make the biggest difference. Breech (bottom-down or feet-first) may require cesarean. Transverse (sideways) is rare at term. Providers check positioning at late prenatal visits. Partners who understand positioning understand why movement and position changes in labor matter."},
    4:{icon:"⏱️",title:"Labor Progress: What You Are Watching For",text:"Labor has three stages. Stage 1 is dilation: latent phase (0-6cm, can be many hours), active phase (6-10cm, faster), and transition (8-10cm, most intense and shortest). Stage 2 is pushing: can be 20 minutes or 3 hours, both normal. Stage 3 is delivery of the placenta: typically 5-30 minutes after birth. A rule of thumb: active labor progresses approximately 0.5-1 cm per hour, but this varies enormously. Partners who understand this do not expect linear, predictable progress  -  and do not panic when progress seems slow."},
    5:{icon:"📊",title:"Reading the Monitors",text:"Electronic fetal monitoring shows two things on the readout: the fetal heart rate (top line) and contraction intensity (bottom line). Normal fetal heart rate is 110-160 beats per minute. Accelerations (brief increases above baseline) are reassuring  -  they mean the baby is responding well. Decelerations (drops below baseline) are assessed by type. Variable decelerations are common and often position-related. Late decelerations after contractions can indicate the baby is not tolerating labor well and require assessment. You do not need to interpret the monitor. You need to know that the nurse is always watching it, and if you see something that concerns you, you can ask."},
    6:{icon:"🏥",title:"Navigating Prenatal Appointments",text:"Go to as many appointments as possible  -  especially the anatomy scan (20 weeks), Group B Strep test (35-37 weeks), and all third trimester visits. Prepare two questions before each appointment. Write down what the provider says. If a number is given (blood pressure, fundal height, dilation) ask what it means for your pregnancy specifically. If a recommendation is made, ask: what are the alternatives and what happens if we wait? You are not interrogating the provider. You are practicing informed consent as a team."},
  },
  es:{
    1:{icon:"📅",title:"Trimestre por Trimestre  -  Vista Interior",text:"Primer trimestre: Los órganos se forman, el tubo neural se cierra, el corazón comienza a latir. El embrión se convierte en feto en la semana 8. Segundo trimestre: Crecimiento rápido. El movimiento fetal comienza. Hacia la semana 20, el bebé puede oír. Tercer trimestre: Desarrollo cerebral significativo, acumulación de grasa, maduración pulmonar. El bebé se posiciona para el nacimiento, generalmente cabeza abajo en la semana 36."},
    3:{icon:"👶",title:"Posición Fetal: Por Qué Importa",text:"La posición del bebé afecta cómo se desarrolla el parto. La posición vértex (cabeza abajo, mirando hacia la espalda) es ideal. La posición posterior (mirando hacia adelante) causa parto de espalda. La posición de nalgas puede requerir cesárea. Los proveedores verifican el posicionamiento en las últimas visitas prenatales."},
    4:{icon:"⏱️",title:"Progreso del Parto: Qué Estás Observando",text:"El parto tiene tres etapas. Etapa 1 es la dilatación. Etapa 2 es pujar. Etapa 3 es la entrega de la placenta. Una regla general: el parto activo progresa aproximadamente 0.5-1 cm por hora, pero esto varía enormemente."},
    5:{icon:"📊",title:"Leer los Monitores",text:"El monitoreo fetal electrónico muestra la frecuencia cardíaca fetal y la intensidad de las contracciones. La frecuencia cardíaca normal es 110-160 latidos por minuto. Las aceleraciones son tranquilizadoras. Las desaceleraciones son evaluadas por tipo. No necesitas interpretar el monitor  -  la enfermera siempre lo está observando."},
    6:{icon:"🏥",title:"Navegar Citas Médicas",text:"Ve a tantas citas como sea posible. Prepara dos preguntas antes de cada cita. Si se hace una recomendación, pregunta: cuáles son las alternativas y qué pasa si esperamos. Estás practicando el consentimiento informado como equipo."},
  },
  ht:{
    1:{icon:"📅",title:"Trimès pa Trimès  -  Vi Anndan",text:"Premye trimès: Ògàn yo fòme, tib neral la fèmen, kè a kòmanse bat. Embriyo a vin yon feto nan semèn 8. Dezyèm trimès: Kwasans rapid. Mouvman fetyal kòmanse. Nan semèn 20, bebe a ka tande. Twazyèm trimès: Devlopman sèvo enpòtan, akimilasyon grès, matireman poumon. Bebe a pozisyone pou akouchman, tipikman tèt anba nan semèn 36."},
    3:{icon:"👶",title:"Pozisyon Fetyal: Poukisa Li Enpòtan",text:"Pozisyon bebe a nan utéris la afekte kòman travay dewoule. Pozisyon vetèks (tèt anba, gade dèyè) ideal. Pozisyon pòsteryè (gade devan) koze travay do. Pozisyon brèch ka mande sezaryèn. Pwofesyonèl yo tcheke pozisyon nan vizit prenatal ta yo."},
    4:{icon:"⏱️",title:"Pwogrè Travay: Sa Ou Ap Gade",text:"Travay gen twa etap. Etap 1 se dilatasyon. Etap 2 se pouse. Etap 3 se delivrans plasenta. Yon règ jenerèl: travay aktif pwogresi anviwon 0.5-1 cm pa èdtan, men sa varye anpil."},
    5:{icon:"📊",title:"Li Monitè Yo",text:"Monitè fetyal elektwonik montre frekans batman kè fetyal ak entansite kontraksiyon. Frekans kè nòmal se 110-160 batman pa minit. Akselerasyon rasiran. Deselerasyon evalye pa tip. Enfimye a toujou ap gade li."},
    6:{icon:"🏥",title:"Navige Randevou Prenatal",text:"Ale nan plis randevou posib. Prepare de kesyon anvan chak randevou. Si yo fè yon rekòmandasyon, mande: ki altènatif yo ak kisa ki pase si nou tann. Ou ap pratike konsantman eklere kòm yon ekip."},
  },
  fr:{
    1:{icon:"📅",title:"Trimestre par Trimestre  -  Vue Intérieure",text:"Premier trimestre: Les organes se forment, le tube neural se ferme, le coeur commence à battre. L'embryon devient un foetus à la semaine 8. Deuxième trimestre: Croissance rapide. Les mouvements foetaux commencent. Vers la semaine 20, le bébé peut entendre. Troisième trimestre: Développement cérébral significatif, accumulation de graisse, maturation pulmonaire. Le bébé se positionne pour la naissance, généralement tête en bas à la semaine 36."},
    3:{icon:"👶",title:"Positionnement Foetal: Pourquoi Cela Compte",text:"La position du bébé affecte le déroulement du travail. La position vertex (tête en bas, regardant vers le dos) est idéale. La position postérieure (regardant vers l'avant) cause un travail dorsal. La présentation par le siège peut nécessiter une césarienne. Les prestataires vérifient le positionnement lors des dernières visites prénatales."},
    4:{icon:"⏱️",title:"Progression du Travail: Ce que Vous Observez",text:"Le travail a trois stades. Stade 1 est la dilatation. Stade 2 est la poussée. Stade 3 est la délivrance du placenta. En règle générale, le travail actif progresse d'environ 0,5-1 cm par heure, mais cela varie énormément."},
    5:{icon:"📊",title:"Lire les Moniteurs",text:"Le monitoring foetal électronique montre la fréquence cardiaque foetale et l'intensité des contractions. La fréquence cardiaque normale est de 110-160 battements par minute. Les accélérations sont rassurantes. Les décélérations sont évaluées par type. L'infirmière surveille toujours."},
    6:{icon:"🏥",title:"Naviguer les Rendez-vous Prénatals",text:"Assistez à autant de rendez-vous que possible. Préparez deux questions avant chaque rendez-vous. Si une recommandation est faite, demandez: quelles sont les alternatives et que se passe-t-il si on attend. Vous pratiquez le consentement éclairé en équipe."},
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecBody({lang,C}){
  const d=BODY_OVERVIEW[lang];
  const [open,setOpen]=useState(null);
  const cm={pink:C.pink,green:C.green,blue:C.blue,purple:C.purple,teal:C.teal};
  return <div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.systems.map((s,i)=>{
      const clr=cm[s.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer",transition:"all 0.25s"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:22}}>{s.icon}</span>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?clr:C.text,flex:1}}>{s.name}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:"12px 0 0",paddingTop:12,borderTop:"1px solid "+clr+"20"}}>{s.desc}</p>}
      </div>;
    })}
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecCervix({lang,C}){
  const d=CERVIX[lang];
  const [open,setOpen]=useState(null);
  const cm={blue:C.blue,green:C.green,purple:C.purple,teal:C.teal};
  return <div>
    <div style={{background:C.teal+"0d",border:"1px solid "+C.teal+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
      {d.concepts.map((c,i)=>{
        const clr=cm[c.color]; const isOpen=open===i;
        return <button key={i} onClick={()=>setOpen(isOpen?null:i)} style={{flex:"1 1 180px",background:isOpen?clr+"18":C.card,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,cursor:"pointer",textAlign:"left",transition:"all 0.25s"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:700,color:clr,marginBottom:4}}>{c.number}</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?clr:C.text}}>{c.term}</div>
          {isOpen&&<p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:"10px 0 0"}}>{c.explain}</p>}
        </button>;
      })}
    </div>
    <div style={{background:C.green+"0a",border:"1px solid "+C.green+"22",borderRadius:14,padding:18,marginBottom:14}}>
      <div style={{fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:10}}>WHAT THIS MEANS FOR YOU</div>
      {d.partner_notes.map((n,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{n}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecGlossary({lang,C}){
  const [search,setSearch]=useState("");
  const terms=GLOSSARY[lang]||GLOSSARY.en;
  const filtered=search?terms.filter(t=>t.term.toLowerCase().includes(search.toLowerCase())||t.def.toLowerCase().includes(search.toLowerCase())):terms;
  return <div>
    <div style={{marginBottom:16}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="en"?"Search terms...":lang==="es"?"Buscar términos...":lang==="ht"?"Chèche tèm...":"Rechercher..."} style={{width:"100%",background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 14px",color:C.muted,fontSize:13,fontFamily:"'DM Mono',monospace",outline:"none"}}/>
    </div>
    {filtered.map((item,i)=><div key={i} style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:12,padding:"12px 16px",marginBottom:9}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:C.accent,marginBottom:4}}>{item.term}</div>
      <p style={{fontSize:12.5,color:C.muted,lineHeight:1.55,margin:0}}>{item.def}</p>
    </div>)}
  </div>;
}

function GenSec({icon,title,text,C}){
  return <div style={{textAlign:"center",padding:"32px 16px"}}>
    <div style={{fontSize:52,marginBottom:16}}>{icon}</div>
    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>
    <p style={{fontSize:13.5,color:C.muted,maxWidth:540,margin:"0 auto",lineHeight:1.75}}>{text}</p>
  </div>;
}

export default function PartnerAnatomyGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC[lang]||GENERIC.en;
  const kpis=[
    {icon:"🫀",value:"5",label:lang==="en"?"KEY BODY SYSTEMS":lang==="es"?"SISTEMAS CORPORALES":lang==="ht"?"SISTÈM KO":lang==="fr"?"":"",color:C.pink},
    {icon:"🔬",value:"4",label:lang==="en"?"CERVIX CONCEPTS":lang==="es"?"CONCEPTOS CERVICALES":lang==="ht"?"KONSÈP KOU ITERIN":lang==="fr"?"":"",color:C.teal},
    {icon:"📖",value:"13+",label:lang==="en"?"TERMS DEFINED":lang==="es"?"TÉRMINOS DEFINIDOS":lang==="ht"?"TÈM DEFINI":lang==="fr"?"":"",color:C.accent},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":lang==="fr"?"":"",color:C.blue},
  ];
  const renderSection=()=>{
    switch(section){
      case 0: return <SecBody lang={lang} C={C}/>;
      case 1: return <GenSec icon={g[1].icon} title={g[1].title} text={g[1].text} C={C}/>;
      case 2: return <SecCervix lang={lang} C={C}/>;
      case 3: return <GenSec icon={g[3].icon} title={g[3].title} text={g[3].text} C={C}/>;
      case 4: return <GenSec icon={g[4].icon} title={g[4].title} text={g[4].text} C={C}/>;
      case 5: return <GenSec icon={g[5].icon} title={g[5].title} text={g[5].text} C={C}/>;
      case 6: return <GenSec icon={g[6].icon} title={g[6].title} text={g[6].text} C={C}/>;
      case 7: return <SecGlossary lang={lang} C={C}/>;
      default: return null;
    }
  };
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;}button{outline:none;font-family:inherit;}input{outline:none;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${C.accent}40;border-radius:2px;}`}</style>
      <div style={{background:C.navBg,backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.border,padding:"20px 24px 0",position:"sticky",top:0,zIndex:50,boxShadow:C.shadow}}>
        <div style={{maxWidth:1080,margin:"0 auto"}}>
          <div style={{opacity:ready?1:0,transform:ready?"none":"translateY(-10px)",transition:"all 0.5s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
              <div style={{flex:1,minWidth:260}}>
                <div style={{fontSize:9.5,letterSpacing:"0.28em",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:5,color:C.faint}}>Dieudonne Partner Hub · Partner Education Series</div>
                <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(20px,3vw,30px)",margin:0,lineHeight:1.05,fontWeight:900}}>
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Understanding </span>
                  <span style={{background:"linear-gradient(135deg,"+C.teal+","+C.blue+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Her Body </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>A Partner's Anatomy Primer</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Anatomy Education</div>
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
                <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.accent,fontSize:10,fontFamily:"'DM Mono',monospace"}}>v</div>
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
