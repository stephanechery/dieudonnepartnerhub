import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["What Baby Actually Costs","Parental Leave: Know Your Rights","The Money Conversation","Building Your 90-Day Budget","Insurance & Benefits","Financial Stress & Mental Health","Protecting Your Household","Moving Forward Financially"],
  es:["Lo Que el Bebé Realmente Cuesta","Licencia Parental: Conoce tus Derechos","La Conversación del Dinero","Presupuesto de 90 Días","Seguros y Beneficios","Estrés Financiero y Salud Mental","Proteger tu Hogar","Avanzar Financieramente"],
  ht:["Sa Bebe Reyèlman Koute","Konje Patènaj: Konnen Dwa Ou","Konvèsasyon Lajan","Konstriksyon Bidjè 90 Jou","Asirans ak Benefis","Estrès Finansyè ak Sante Mantal","Pwoteje Kay Ou","Avanse Finansyèlman"],
  fr:["Ce que Coûte Vraiment un Bébé","Congé Parental: Connaître Vos Droits","La Conversation Argent","Construire votre Budget de 90 Jours","Assurance et Avantages","Stress Financier et Santé Mentale","Protéger votre Foyer","Avancer Financièrement"],
};
const ICONS=["💰","📋","💬","📊","🛡️","🧠","🏠","🌅"];

const COSTS={
  en:{
    title:"What Baby Actually Costs  -  Marketing vs Reality",
    intro:"The baby industry is a multi-billion dollar business designed to make new parents feel like they need everything. You do not. Here is what you actually need, what is optional, and what is a waste of money.",
    essential:[
      {item:"Safe sleep surface",cost:"$0-250",note:"A firm, flat crib, bassinet, or pack-n-play. Many hospitals and WIC offices have these for free or low cost. You do not need a $1,500 designer crib."},
      {item:"Car seat (infant or convertible)",cost:"$80-300",note:"Required by law to leave the hospital. Do not buy used. Install it before the due date and have it inspected at a fire station."},
      {item:"Diapers and wipes",cost:"$80-100/month",note:"Budget this as a recurring monthly expense for 2-3 years. Store brand diapers work. Buy in bulk. Most families use 8-12 diapers per day in the newborn period."},
      {item:"Feeding supplies",cost:"$0-300",note:"If breastfeeding: a breast pump (often covered by insurance), nursing pads, nipple cream. If formula: $150-250 per month. If bottle feeding: bottles and a drying rack."},
      {item:"Clothing",cost:"$0-100",note:"Babies grow extremely fast. Buy minimum. Accept all hand-me-downs. Newborn size is often skipped entirely. Size 0-3 months fits most newborns for 1-2 months."},
      {item:"Pediatric care",cost:"Varies",note:"Know your insurance copays for well-baby visits. There are many in the first year. CHIP covers children who do not qualify for Medicaid but whose parents cannot afford private insurance."},
    ],
    skip:[
      "Wipe warmer  -  unnecessary and one more thing to fail at 3 AM",
      "Diaper Genie  -  a regular trash can with a lid works fine",
      "Fancy baby monitor with 10 features  -  basic audio monitor is sufficient",
      "Coordinated nursery furniture sets  -  baby does not care",
      "Baby shoes before walking  -  purely decorative",
      "Dedicated changing table  -  a mat on any flat surface works",
    ],
    first_year:"The average first-year cost of a baby in the United States ranges from $12,000 to $21,000 including childcare. Childcare is typically the largest expense  -  $1,000 to $3,000 per month in most urban areas. Research this before the baby arrives.",
    discussion:"Have you sat down and run the actual numbers? What is your plan for childcare? What expenses are you most worried about?",
  },
  es:{
    title:"Lo Que el Bebé Realmente Cuesta  -  Marketing vs Realidad",
    intro:"La industria del bebé está diseñada para hacer que los nuevos padres sientan que necesitan todo. No es así. Aquí está lo que realmente necesitas, lo que es opcional y lo que es un desperdicio de dinero.",
    essential:[
      {item:"Superficie de sueño segura",cost:"$0-250",note:"Una cuna, moisés o cuna de viaje firme y plana. Muchos hospitales y oficinas de WIC tienen estos gratis o a bajo costo."},
      {item:"Silla de auto (infantil o convertible)",cost:"$80-300",note:"Requerida por ley para salir del hospital. No compres usada. Instálala antes de la fecha de parto."},
      {item:"Pañales y toallitas",cost:"$80-100/mes",note:"Presupuesta esto como gasto mensual recurrente por 2-3 años. Los pañales de marca propia funcionan."},
      {item:"Suministros de alimentación",cost:"$0-300",note:"Si amamanta: extractor (a menudo cubierto por seguro). Si fórmula: $150-250 por mes."},
      {item:"Ropa",cost:"$0-100",note:"Los bebés crecen muy rápido. Compra lo mínimo. Acepta toda la ropa de segunda mano."},
      {item:"Atención pediátrica",cost:"Varía",note:"Conoce los copagos de tu seguro para visitas de bebé sano. Hay muchas en el primer año."},
    ],
    skip:[
      "Calentador de toallitas  -  innecesario",
      "Cubos de pañales especiales  -  un basurero normal con tapa funciona bien",
      "Monitor de bebé con 10 funciones  -  un monitor de audio básico es suficiente",
      "Conjuntos de muebles de guardería coordinados  -  al bebé no le importa",
      "Zapatos de bebé antes de caminar  -  puramente decorativos",
    ],
    first_year:"El costo promedio del primer año de un bebé en EE.UU. varía de $12,000 a $21,000 incluyendo el cuidado infantil. El cuidado infantil es típicamente el gasto mayor  -  $1,000 a $3,000 por mes en la mayoría de las áreas urbanas.",
    discussion:"¿Te has sentado a calcular los números reales? ¿Cuál es tu plan para el cuidado infantil? ¿Cuáles gastos te preocupan más?",
  },
  ht:{
    title:"Sa Bebe Reyèlman Koute  -  Maketing vs Reyalite",
    intro:"Endistri bebe a se yon biznis ki fèt pou fè nouvo paran santi yo bezwen tout bagay. Ou pa bezwen. Sa a se sa ou reyèlman bezwen, sa ki opsyonèl, ak sa ki se gaspiyaj lajan.",
    essential:[
      {item:"Sifas dòmi san danje",cost:"$0-250",note:"Yon kabann, mòz, oswa pak-n-play fèm ak plat. Anpil lopital ak biwo WIC gen sa yo gratis oswa pri ba."},
      {item:"Chèz machin (tibebe oswa konvètibl)",cost:"$80-300",note:"Egzije pa lalwa pou kite lopital. Pa achte itilize. Enstale li anvan dat akouchman."},
      {item:"Kouchèt ak sèvyèt",cost:"$80-100/mwa",note:"Bidjete sa kòm depans mansyèl rekiran pou 2-3 an. Kouchèt mak magazen travay. Achte an vrac."},
      {item:"Fournitir manje",cost:"$0-300",note:"Si bay tete: yon ponp lèt (souvan kouvri pa asirans). Si fòmil: $150-250 pa mwa."},
      {item:"Rad",cost:"$0-100",note:"Tibebe yo grandi trè vit. Achte minimòm. Aksepte tout rad second-men."},
      {item:"Swen pedyatrik",cost:"Varye",note:"Konnen ko-peman asirans ou pou vizit bebe an sante. Genyen anpil nan premye ane a."},
    ],
    skip:[
      "Chofè twal bebe  -  pa nesesè",
      "Boubèl espesyal pou kouchèt  -  yon boubèl nòmal ak kouvèkl travay byen",
      "Monitè bebe ak 10 fonksyon  -  yon monitè odyo debaz ase",
      "Sèt mèb pou chanm bebe  -  bebe pa pran swen",
      "Soulye bebe anvan mache  -  dekoratif sèlman",
    ],
    first_year:"Pri mwayen premye ane yon bebe nan Etazini varye soti $12,000 a $21,000 enkli gadri. Gadri tipikman pi gwo depans la  -  $1,000 a $3,000 pa mwa nan pifò zòn iben.",
    discussion:"Eske ou chita ak kalkile nimewo reyèl yo? Ki plan ou pou gadri? Ki depans ou pi enkyete sou yo?",
  },
  fr:{
    title:"Ce que Coûte Vraiment un Bébé  -  Marketing vs Réalité",
    intro:"L'industrie du bébé est conçue pour faire croire aux nouveaux parents qu'ils ont besoin de tout. Ce n'est pas le cas. Voici ce dont vous avez réellement besoin, ce qui est optionnel et ce qui est un gaspillage d'argent.",
    essential:[
      {item:"Surface de sommeil sécuritaire",cost:"0-250$",note:"Un berceau ferme et plat. De nombreux hôpitaux et bureaux WIC ont ceux-ci gratuitement ou à faible coût."},
      {item:"Siège auto (nourrisson ou évolutif)",cost:"80-300$",note:"Obligatoire par la loi pour quitter l'hôpital. N'achetez pas d'occasion. Installez-le avant la date d'accouchement."},
      {item:"Couches et lingettes",cost:"80-100$/mois",note:"Budgétez cela comme dépense mensuelle récurrente pendant 2-3 ans. Les couches de marque maison fonctionnent."},
      {item:"Fournitures d'alimentation",cost:"0-300$",note:"Si allaitement: un tire-lait (souvent couvert par l'assurance). Si préparation: 150-250$ par mois."},
      {item:"Vêtements",cost:"0-100$",note:"Les bébés grandissent très vite. Achetez le minimum. Acceptez tous les vêtements de seconde main."},
      {item:"Soins pédiatriques",cost:"Variable",note:"Connaissez vos quotes-parts d'assurance pour les visites de bébé en bonne santé."},
    ],
    skip:[
      "Chauffe-lingettes  -  inutile",
      "Poubelle à couches spéciale  -  une poubelle ordinaire avec couvercle fonctionne bien",
      "Moniteur bébé avec 10 fonctions  -  un moniteur audio de base est suffisant",
      "Ensembles de meubles de chambre coordonnés  -  le bébé s'en moque",
      "Chaussures de bébé avant de marcher  -  purement décoratives",
    ],
    first_year:"Le coût moyen de la première année d'un bébé aux États-Unis varie de 12 000 à 21 000 $ incluant la garde. La garde est généralement la dépense la plus importante  -  1 000 à 3 000 $ par mois dans la plupart des zones urbaines.",
    discussion:"Vous êtes-vous assis pour calculer les vrais chiffres? Quel est votre plan pour la garde? Quelles dépenses vous inquiètent le plus?",
  },
};

const LEAVE={
  en:{
    title:"Parental Leave: Know Your Rights Before You Need Them",
    intro:"Parental leave in the United States is among the least generous in the developed world. Understanding what you are entitled to  -  and what you might negotiate  -  before the birth gives you time to plan.",
    federal:"The Family and Medical Leave Act (FMLA) provides up to 12 weeks of unpaid, job-protected leave for eligible employees at companies with 50 or more employees. FMLA applies to both parents. You must have worked at the company for at least 12 months and 1,250 hours in the past year.",
    state_note:"Many states have more generous paid leave laws than the federal baseline. California, New York, New Jersey, Massachusetts, Connecticut, Oregon, Colorado, Washington, and others have paid family leave programs. Check your state's program  -  you may be eligible for partial wage replacement.",
    employer_note:"Some employers offer paid parental leave beyond legal requirements. Review your employee handbook or ask HR specifically. Do this during pregnancy, not after.",
    steps:[
      "Locate your employee handbook and read the parental leave policy completely",
      "Talk to HR at least 8 weeks before the due date to understand paperwork requirements",
      "Ask specifically: Is leave paid, unpaid, or partial? How many weeks? Do I need to use PTO first?",
      "If your partner's employer offers leave, understand their policy too",
      "If you are self-employed or freelance: plan 4-8 weeks of reduced income into your budget",
      "Do not assume your manager knows the policy  -  go to HR directly",
    ],
    negotiation:"If your employer offers less leave than you need, consider negotiating additional unpaid time, remote work flexibility, or a phased return to work. Many employers are willing to accommodate new parents informally. Ask before the birth.",
    discussion:"Have you read your parental leave policy? Do you know how many weeks you are entitled to and whether they are paid? Have you talked to HR yet?",
  },
  es:{
    title:"Licencia Parental: Conoce tus Derechos Antes de Necesitarlos",
    intro:"La licencia parental en los Estados Unidos es una de las menos generosas del mundo desarrollado. Comprender a qué tienes derecho  -  y qué podrías negociar  -  antes del nacimiento te da tiempo para planificar.",
    federal:"La Ley de Licencia Familiar y Médica (FMLA) proporciona hasta 12 semanas de licencia no remunerada y protegida por el trabajo para empleados elegibles en empresas con 50 o más empleados.",
    state_note:"Muchos estados tienen leyes de licencia pagada más generosas que el estándar federal. California, Nueva York, Nueva Jersey, Massachusetts y otros tienen programas de licencia familiar pagada.",
    employer_note:"Algunos empleadores ofrecen licencia parental pagada más allá de los requisitos legales. Revisa tu manual del empleado o pregunta a RRHH específicamente.",
    steps:[
      "Localiza tu manual del empleado y lee la política de licencia parental completamente",
      "Habla con RRHH al menos 8 semanas antes de la fecha de parto",
      "Pregunta específicamente: ¿La licencia es pagada, no pagada o parcial? ¿Cuántas semanas?",
      "Si el empleador de tu pareja ofrece licencia, comprende también su política",
      "Si eres autónomo: planifica 4-8 semanas de ingresos reducidos en tu presupuesto",
    ],
    negotiation:"Si tu empleador ofrece menos licencia de lo que necesitas, considera negociar tiempo no remunerado adicional, flexibilidad de trabajo remoto o un regreso gradual al trabajo.",
    discussion:"¿Has leído tu política de licencia parental? ¿Sabes cuántas semanas tienes derecho y si son pagadas? ¿Ya hablaste con RRHH?",
  },
  ht:{
    title:"Konje Patènaj: Konnen Dwa Ou Anvan Ou Bezwen Yo",
    intro:"Konje patènaj nan Etazini se youn nan ki mwens jenerè nan mond devlope a. Konprann kisa ou gen dwa - epi kisa ou ka negosye - anvan nesans ba ou tan pou planifye.",
    federal:"Lwa Konje Fanmiy ak Medikal (FMLA) bay jiska 12 semèn konje san salè, pwoteje pa travay pou anplwaye kalifikasyon nan konpayi ki gen 50 oswa plis anplwaye.",
    state_note:"Anpil eta gen lwa konje peye ki pi jenerè pase baz federal la. Kalifòni, Nouyòk, New Jersey, Massachusetts ak lòt yo gen pwogram konje fanmiy peye.",
    employer_note:"Kèk anplwayè ofri konje patènaj peye pi lwen pase egzijans legal. Revize manyèl anplwaye ou oswa mande RH espesyalman.",
    steps:[
      "Jwenn manyèl anplwaye ou epi li politik konje patènaj la nèt",
      "Pale ak RH omwen 8 semèn anvan dat akouchman",
      "Mande espesyalman: Konje a peye, san peye, oswa pasyèl? Konbyen semèn?",
      "Si anplwayè patnè ou ofri konje, konprann politik li tou",
      "Si ou travay pou pwòp tèt ou: planifye 4-8 semèn revni diminye nan bidjè ou",
    ],
    negotiation:"Si anplwayè ou ofri mwens konje pase ou bezwen, konsidere negosye tan san peye siplemantè, fleksibilite travay adistans, oswa yon retounen gradyèl nan travay.",
    discussion:"Eske ou te li politik konje patènaj ou? Eske ou konnen konbyen semèn ou gen dwa ak si yo peye? Eske ou te pale ak RH deja?",
  },
  fr:{
    title:"Congé Parental: Connaître Vos Droits Avant d'en Avoir Besoin",
    intro:"Le congé parental aux États-Unis est parmi les moins généreux du monde développé. Comprendre ce à quoi vous avez droit  -  et ce que vous pourriez négocier  -  avant la naissance vous donne le temps de planifier.",
    federal:"La Loi sur le Congé Familial et Médical (FMLA) prévoit jusqu'à 12 semaines de congé non rémunéré et protégé pour les employés éligibles dans les entreprises de 50 employés ou plus.",
    state_note:"De nombreux États ont des lois sur les congés payés plus généreuses que le niveau fédéral de base. La Californie, New York, le New Jersey, le Massachusetts et d'autres ont des programmes de congé familial payé.",
    employer_note:"Certains employeurs offrent des congés parentaux payés au-delà des exigences légales. Consultez votre manuel de l'employé ou demandez spécifiquement aux RH.",
    steps:[
      "Localisez votre manuel de l'employé et lisez complètement la politique de congé parental",
      "Parlez aux RH au moins 8 semaines avant la date d'accouchement",
      "Demandez spécifiquement: Le congé est-il payé, non payé ou partiel? Combien de semaines?",
      "Si l'employeur de votre partenaire offre un congé, comprenez également sa politique",
      "Si vous êtes indépendant: planifiez 4-8 semaines de revenus réduits dans votre budget",
    ],
    negotiation:"Si votre employeur offre moins de congé que nécessaire, envisagez de négocier du temps non payé supplémentaire, de la flexibilité de travail à distance ou un retour progressif au travail.",
    discussion:"Avez-vous lu votre politique de congé parental? Savez-vous à combien de semaines vous avez droit et si elles sont payées? Avez-vous déjà parlé aux RH?",
  },
};

const BUDGET={
  en:{
    title:"The 90-Day Postpartum Budget",
    intro:"The first 90 days after birth are the most financially disruptive. Income may drop due to leave. Expenses surge. This is the window to plan specifically.",
    categories:[
      {cat:"Income",items:["Calculate your take-home pay during leave (0%, 60%, or 100% depending on your leave policy)","Factor in your partner's leave income","Identify any government benefits you may qualify for: SNAP, WIC, Medicaid, CHIP","Note any savings you plan to draw down"]},
      {cat:"Fixed Expenses",items:["Rent or mortgage","Car payment and insurance","Health insurance (does the baby need to be added within 30 days of birth?)","Utilities","Debt payments"]},
      {cat:"New Baby Expenses",items:["Diapers and wipes: $80-100/month","Formula if not breastfeeding: $150-250/month","Pediatric visits and copays","Any medications or supplements","Childcare if returning to work"]},
      {cat:"Recovery Expenses",items:["Postpartum supplies (pads, sitz bath, witch hazel, stool softeners)","Lactation consultant if needed ($100-300 per session, often covered by insurance)","Mental health support if needed","Food delivery or meal prep  -  this is not a luxury, it is injury recovery logistics"]},
    ],
    rule:"Build a financial cushion of 1-2 months of expenses before the birth if at all possible. Financial stress is one of the top predictors of postpartum depression in both partners. Money problems that feel unmanageable in the fourth trimester often feel different once both partners are sleeping more.",
    discussion:"Have you built a 90-day postpartum budget? What is the biggest financial gap you need to close before the birth? What resources have you not fully explored?",
  },
  es:{
    title:"El Presupuesto de 90 Días Postparto",
    intro:"Los primeros 90 días después del parto son los más financieramente disruptivos. Los ingresos pueden caer. Los gastos aumentan. Esta es la ventana para planificar específicamente.",
    categories:[
      {cat:"Ingresos",items:["Calcula tu pago neto durante la licencia","Considera los ingresos de licencia de tu pareja","Identifica beneficios gubernamentales: SNAP, WIC, Medicaid, CHIP"]},
      {cat:"Gastos Fijos",items:["Alquiler o hipoteca","Pago de auto y seguro","Seguro de salud (¿el bebé necesita ser agregado en 30 días del nacimiento?)","Servicios públicos","Pagos de deudas"]},
      {cat:"Gastos del Nuevo Bebé",items:["Pañales y toallitas: $80-100/mes","Fórmula si no amamanta: $150-250/mes","Visitas pediátricas y copagos","Cuidado infantil si regresa al trabajo"]},
      {cat:"Gastos de Recuperación",items:["Suministros postparto","Consultora de lactancia si es necesario","Apoyo de salud mental si es necesario","Entrega de comida o preparación de comidas  -  esto no es un lujo"]},
    ],
    rule:"Construye un colchón financiero de 1-2 meses de gastos antes del parto si es posible. El estrés financiero es uno de los principales predictores de depresión postparto en ambas parejas.",
    discussion:"¿Has construido un presupuesto postparto de 90 días? ¿Cuál es la mayor brecha financiera que necesitas cerrar antes del nacimiento?",
  },
  ht:{
    title:"Bidjè 90 Jou Apre Akouchman",
    intro:"Premye 90 jou apre akouchman yo se ki plis disrupsyon finansyè. Revni ka bese. Depans ogmante. Sa a se fenèt pou planifye espesyalman.",
    categories:[
      {cat:"Revni",items:["Kalkile peman lakay ou pandan konje","Konsidere revni konje patnè ou","Idantifye nenpòt benefis gouvènman ou ka kalifye pou: SNAP, WIC, Medicaid, CHIP"]},
      {cat:"Depans Fiks",items:["Lwaye oswa ipotèk","Peman machin ak asirans","Asirans sante (eske bebe a bezwen ajoute nan 30 jou nesans?)","Sèvis piblik","Peman dèt"]},
      {cat:"Nouvo Depans Bebe",items:["Kouchèt ak sèvyèt: $80-100/mwa","Fòmil si pa bay tete: $150-250/mwa","Vizit pedyatrik ak ko-peman","Gadri si tounen nan travay"]},
      {cat:"Depans Rekiperasyon",items:["Fournitir apre akouchman","Konsiltasyon alètman si nesesè","Sipò sante mantal si nesesè","Livrezon manje oswa prepare manje  -  sa a pa yon lukse"]},
    ],
    rule:"Konstwi yon kousen finansyè 1-2 mwa depans anvan akouchman si posib ditou. Estrès finansyè se youn nan pi gwo predikatè depresyon apre akouchman nan de patnè yo.",
    discussion:"Eske ou te konstwi yon bidjè apre akouchman 90 jou? Ki pi gwo twou finansyè ou bezwen fèmen anvan nesans?",
  },
  fr:{
    title:"Le Budget Post-partum de 90 Jours",
    intro:"Les 90 premiers jours après la naissance sont les plus perturbateurs financièrement. Les revenus peuvent chuter. Les dépenses augmentent. C'est la fenêtre pour planifier spécifiquement.",
    categories:[
      {cat:"Revenus",items:["Calculez votre salaire net pendant le congé","Tenez compte des revenus de congé de votre partenaire","Identifiez les aides gouvernementales auxquelles vous pourriez avoir droit"]},
      {cat:"Dépenses Fixes",items:["Loyer ou hypothèque","Paiement de voiture et assurance","Assurance maladie (le bébé doit-il être ajouté dans les 30 jours suivant la naissance?)","Factures","Remboursements de dettes"]},
      {cat:"Nouvelles Dépenses Bébé",items:["Couches et lingettes: 80-100$/mois","Préparation si non allaitement: 150-250$/mois","Visites pédiatriques et quotes-parts","Garde si retour au travail"]},
      {cat:"Dépenses de Récupération",items:["Fournitures post-partum","Consultante en lactation si nécessaire","Soutien en santé mentale si nécessaire","Livraison de repas  -  ce n'est pas un luxe, c'est de la logistique de récupération"]},
    ],
    rule:"Constituez un coussin financier de 1-2 mois de dépenses avant la naissance si possible. Le stress financier est l'un des principaux prédicteurs de dépression post-partum chez les deux partenaires.",
    discussion:"Avez-vous établi un budget post-partum de 90 jours? Quel est le plus grand écart financier que vous devez combler avant la naissance?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecCosts({lang,C}){
  const d=COSTS[lang];
  const [tab,setTab]=useState("need");
  return <div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{v:"need",l:lang==="en"?"What You Need":lang==="es"?"Lo Que Necesitas":lang==="ht"?"Sa Ou Bezwen":"Ce Dont Vous Avez Besoin",c:C.green},
        {v:"skip",l:lang==="en"?"What to Skip":lang==="es"?"Lo Que Omitir":lang==="ht"?"Sa Pou Pase":"Ce qu'il Faut Ignorer",c:C.orange}].map(o=>(
        <button key={o.v} onClick={()=>setTab(o.v)} style={{background:tab===o.v?o.c+"20":C.inputBg,border:"1px solid "+(tab===o.v?o.c:C.border),borderRadius:20,padding:"6px 18px",fontSize:12,fontFamily:"'DM Mono',monospace",color:tab===o.v?o.c:C.muted,cursor:"pointer"}}>{o.l}</button>
      ))}
    </div>
    {tab==="need"&&d.essential.map((item,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.green+"20",borderRadius:12,padding:"12px 16px",marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:C.green}}>{item.item}</div>
        <div style={{fontSize:11,color:C.accent,fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:8}}>{item.cost}</div>
      </div>
      <p style={{fontSize:12.5,color:C.muted,lineHeight:1.55,margin:0}}>{item.note}</p>
    </div>)}
    {tab==="skip"&&d.skip.map((item,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8,background:C.orange+"08",border:"1px solid "+C.orange+"22",borderRadius:10,padding:"10px 14px"}}>
      <div style={{width:4,height:4,borderRadius:"50%",background:C.orange,flexShrink:0,marginTop:5}}/>
      <span style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{item}</span>
    </div>)}
    <div style={{background:C.blue+"0a",border:"1px solid "+C.blue+"22",borderRadius:12,padding:14,marginTop:16,marginBottom:14}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.first_year}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecLeave({lang,C}){
  const d=LEAVE[lang];
  return <div>
    <div style={{background:C.teal+"0d",border:"1px solid "+C.teal+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{fontSize:10,color:C.teal,fontFamily:"'DM Mono',monospace",marginBottom:6}}>FEDERAL LAW (US)</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.federal}</p>
    </div>
    <div style={{background:C.blue+"0a",border:"1px solid "+C.blue+"22",borderRadius:12,padding:14,marginBottom:12}}>
      <div style={{fontSize:10,color:C.blue,fontFamily:"'DM Mono',monospace",marginBottom:6}}>STATE PROGRAMS</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.state_note}</p>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>YOUR ACTION STEPS</div>
      {d.steps.map((s,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:9}}>
        <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:C.accent+"20",border:"1px solid "+C.accent+"35",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{i+1}</div>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{s}</span>
      </div>)}
    </div>
    <div style={{background:C.green+"0a",border:"1px solid "+C.green+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:6}}>NEGOTIATION NOTE</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.negotiation}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecBudget({lang,C}){
  const d=BUDGET[lang];
  const [open,setOpen]=useState(null);
  const clrs=[C.green,C.blue,C.accent,C.purple];
  return <div>
    <div style={{background:C.green+"0d",border:"1px solid "+C.green+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.categories.map((cat,i)=>{
      const clr=clrs[i]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"10":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?clr:C.text}}>{cat.cat}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+clr+"20"}}>
          {cat.items.map((item,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:7}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:clr,flexShrink:0,marginTop:5}}/>
            <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{item}</span>
          </div>)}
        </div>}
      </div>;
    })}
    <div style={{background:C.orange+"0a",border:"1px solid "+C.orange+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.rule}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC_TEXT={
  en:{
    0:{icon:"💰",text:"Most couples do not talk about money until it becomes a crisis. The birth of a child is the single largest financial event most families experience in a decade  -  not because babies are expensive (they can be surprisingly affordable), but because it coincides with income disruption, unexpected costs, and the highest stress period in the relationship. This guide helps you have the conversation before it becomes a conflict."},
    2:{icon:"💬",title:"The Money Conversation",text:"The money conversation that matters most is not about how much you earn. It is about values, expectations, and division of financial labor. Who pays which bills? Who tracks the budget? What happens if one of you stops working? How do you make financial decisions together? Couples who have explicit conversations about money before the baby arrives are better equipped to handle the financial stress that comes after. The goal is not agreement on every detail. The goal is no surprises."},
    4:{icon:"🛡️",title:"Insurance and Benefits You May Be Missing",text:"Review your health insurance and add the baby within 30 days of birth  -  this is a qualifying life event. Check if your plan covers lactation consultants and mental health services. Life insurance: if you do not have it, get it before the birth. Disability insurance protects your income if you cannot work. Ask your employer about dependent care FSA  -  pre-tax dollars for childcare expenses. WIC provides nutritional support for pregnant women and children under 5 and is income-based. Do not leave these on the table."},
    5:{icon:"🧠",title:"Financial Stress and Mental Health",text:"Financial stress is one of the strongest predictors of postpartum depression and relationship conflict. When money feels unmanageable, everything else feels harder too. If you are in financial difficulty, the most important thing is to name it honestly with your partner and make a specific plan  -  not to avoid the conversation. A plan, even an imperfect one, reduces anxiety more than avoidance. Free financial counseling is available through many community organizations, credit unions, and nonprofits. You do not have to figure this out alone."},
    6:{icon:"🏠",title:"Protecting Your Household",text:"Review your will and beneficiaries. If you do not have a will, get a basic one before the birth  -  many states have free or low-cost resources. Update the beneficiary on your retirement accounts, life insurance, and any financial accounts. Create a shared document with passwords, account information, and emergency contacts. This is not morbid. It is responsible. The person who handles the family finances should not be the only one who knows how everything works."},
    7:{icon:"🌅",title:"Moving Forward Financially",text:"Financial preparation for parenthood is not about having everything figured out. It is about reducing uncertainty enough that money is not the thing that breaks you in the hardest months. Know your leave. Know your budget. Know your insurance. Know what you need versus what you think you need. The families who navigate the financial transition best are not the wealthiest ones. They are the ones who communicated honestly, planned specifically, and gave each other grace when the plan did not survive contact with reality."},
  },
  es:{
    0:{icon:"💰",text:"La mayoría de las parejas no hablan de dinero hasta que se convierte en una crisis. El nacimiento de un niño es el evento financiero más grande que la mayoría de las familias experimentan en una década. Esta guía te ayuda a tener la conversación antes de que se convierta en un conflicto."},
    2:{icon:"💬",title:"La Conversación del Dinero",text:"La conversación más importante no se trata de cuánto ganas. Se trata de valores, expectativas y división del trabajo financiero. Las parejas que tienen conversaciones explícitas sobre el dinero antes de que llegue el bebé están mejor equipadas para manejar el estrés financiero posterior."},
    4:{icon:"🛡️",title:"Seguros y Beneficios que Puedes Estar Perdiendo",text:"Revisa tu seguro de salud y agrega al bebé dentro de los 30 días del nacimiento. El seguro de vida: si no lo tienes, consíguelo antes del parto. Pregunta a tu empleador sobre la FSA de cuidado de dependientes. WIC proporciona apoyo nutricional para mujeres embarazadas y niños menores de 5 años."},
    5:{icon:"🧠",title:"Estrés Financiero y Salud Mental",text:"El estrés financiero es uno de los predictores más fuertes de la depresión postparto y el conflicto de pareja. Si estás en dificultades financieras, lo más importante es nombrarlo honestamente con tu pareja y hacer un plan específico. La asesoría financiera gratuita está disponible a través de muchas organizaciones comunitarias."},
    6:{icon:"🏠",title:"Proteger tu Hogar",text:"Revisa tu testamento y beneficiarios. Si no tienes testamento, consigue uno básico antes del nacimiento. Actualiza el beneficiario en tus cuentas de jubilación y seguros de vida. Crea un documento compartido con contraseñas e información de cuentas."},
    7:{icon:"🌅",title:"Avanzar Financieramente",text:"La preparación financiera para la paternidad no se trata de tenerlo todo resuelto. Se trata de reducir la incertidumbre lo suficiente para que el dinero no sea lo que te rompa en los meses más difíciles. Las familias que mejor navegan la transición financiera son las que comunicaron honestamente y planificaron específicamente."},
  },
  ht:{
    0:{icon:"💰",text:"Pifò koup pa pale sou lajan jiskaske li vin yon kriz. Nesans yon timoun se pi gwo evènman finansyè pifò fanmiy eksperyanse nan yon deseni. Gid sa a ede ou fè konvèsasyon an anvan li vin yon konfli."},
    2:{icon:"💬",title:"Konvèsasyon Lajan",text:"Konvèsasyon lajan ki pi enpòtan pa konsène konbyen ou touche. Se sou valè, atant, ak divize travay finansyè. Koup ki gen konvèsasyon esplis sou lajan anvan bebe a rive pi bon ekipe pou jere estrès finansyè ki vin apre."},
    4:{icon:"🛡️",title:"Asirans ak Benefis Ou Ka Rate",text:"Revize asirans sante ou epi ajoute bebe a nan 30 jou nesans. Asirans lavi: si ou pa genyen, jwenn youn anvan akouchman. Mande anplwayè ou sou FSA swen depandan. WIC bay sipò nitrisyonèl pou fanm ansent ak timoun pou mwens pase 5 an."},
    5:{icon:"🧠",title:"Estrès Finansyè ak Sante Mantal",text:"Estrès finansyè se youn nan pi fò predikatè depresyon apre akouchman ak konfli relasyon. Si ou nan difikilte finansyè, bagay ki pi enpòtan se nonmen li onètman ak patnè ou epi fè yon plan espesifik. Konsèy finansyè gratis disponib atravè anpil òganizasyon kominotè."},
    6:{icon:"🏠",title:"Pwoteje Kay Ou",text:"Revize testaman ou ak benefisyè. Si ou pa gen testaman, jwenn youn baz anvan nesans. Mete ajou benefisyè sou kont retrèt ou ak asirans lavi. Kreye yon dokiman pataje ak modpas ak enfòmasyon kont."},
    7:{icon:"🌅",title:"Avanse Finansyèlman",text:"Preparasyon finansyè pou patènaj pa konsène genyen tout bagay regle. Se konsène diminye ensètitid ase pou lajan pa la bagay ki kraze ou nan mwa ki pi difisil yo. Fanmiy ki pi byen navige tranzisyon finansyè a se pa ki pi rich yo. Se sa ki kominike onètman epi planifye espesyalman."},
  },
  fr:{
    0:{icon:"💰",text:"La plupart des couples ne parlent pas d'argent jusqu'à ce que ça devienne une crise. La naissance d'un enfant est le plus grand événement financier que la plupart des familles vivent en une décennie. Ce guide vous aide à avoir la conversation avant qu'elle ne devienne un conflit."},
    2:{icon:"💬",title:"La Conversation Argent",text:"La conversation la plus importante ne porte pas sur combien vous gagnez. Elle porte sur les valeurs, les attentes et la répartition des tâches financières. Les couples qui ont des conversations explicites sur l'argent avant l'arrivée du bébé sont mieux équipés pour gérer le stress financier qui suit."},
    4:{icon:"🛡️",title:"Assurance et Avantages que Vous Manquez Peut-être",text:"Vérifiez votre assurance maladie et ajoutez le bébé dans les 30 jours suivant la naissance. L'assurance-vie: si vous n'en avez pas, souscrivez-en une avant la naissance. Demandez à votre employeur les avantages disponibles pour les soins aux personnes à charge."},
    5:{icon:"🧠",title:"Stress Financier et Santé Mentale",text:"Le stress financier est l'un des prédicteurs les plus forts de la dépression post-partum et du conflit conjugal. Si vous êtes en difficulté financière, la chose la plus importante est de le nommer honnêtement avec votre partenaire et de faire un plan spécifique. Des conseils financiers gratuits sont disponibles."},
    6:{icon:"🏠",title:"Protéger votre Foyer",text:"Vérifiez votre testament et vos bénéficiaires. Si vous n'avez pas de testament, obtenez-en un basique avant la naissance. Mettez à jour le bénéficiaire de vos comptes de retraite et assurances-vie. Créez un document partagé avec mots de passe et informations de compte."},
    7:{icon:"🌅",title:"Avancer Financièrement",text:"La préparation financière à la parentalité ne consiste pas à tout avoir résolu. Il s'agit de réduire suffisamment l'incertitude pour que l'argent ne soit pas ce qui vous brise dans les mois les plus difficiles. Les familles qui naviguent le mieux la transition financière sont celles qui ont communiqué honnêtement et planifié spécifiquement."},
  },
};

export default function PartnerFinanceGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_TEXT[lang]||GENERIC_TEXT.en;
  const kpis=[
    {icon:"💰",value:"$21K",label:lang==="en"?"AVG FIRST-YEAR COST":lang==="es"?"COSTO PROMEDIO AÑO 1":lang==="ht"?"KOU MWAYEN PREMYE ANE":lang==="fr"?"":"",color:C.accent},
    {icon:"📋",value:"12wks",label:lang==="en"?"FMLA FEDERAL LEAVE":lang==="es"?"LICENCIA FEDERAL FMLA":lang==="ht"?"KONJE FEDERAL FMLA":lang==="fr"?"":"",color:C.teal},
    {icon:"📊",value:"90",label:lang==="en"?"DAYS TO PLAN FOR":lang==="es"?"DÍAS PARA PLANIFICAR":lang==="ht"?"JOU POU PLANIFYE":lang==="fr"?"":"",color:C.green},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":lang==="fr"?"":"",color:C.blue},
  ];
  const genDiv=(icon,title,text)=><div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{icon}</div>{title&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>}<p style={{fontSize:13.5,color:C.muted,maxWidth:540,margin:"0 auto",lineHeight:1.75}}>{text}</p></div>;
  const renderSection=()=>{
    switch(section){
      case 0: return genDiv(g[0].icon,null,g[0].text);
      case 1: return <SecLeave lang={lang} C={C}/>;
      case 2: return genDiv(g[2].icon,g[2].title,g[2].text);
      case 3: return <SecBudget lang={lang} C={C}/>;
      case 4: return genDiv(g[4].icon,g[4].title,g[4].text);
      case 5: return genDiv(g[5].icon,g[5].title,g[5].text);
      case 6: return genDiv(g[6].icon,g[6].title,g[6].text);
      case 7: return <SecCosts lang={lang} C={C}/>;
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Finances </span>
                  <span style={{background:"linear-gradient(135deg,"+C.green+","+C.teal+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>&amp; Family </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>Preparing Your Household for Baby</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Financial Preparation</div>
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
