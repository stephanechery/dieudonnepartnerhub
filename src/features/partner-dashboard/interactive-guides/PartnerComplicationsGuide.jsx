import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["When It Gets Hard","Gestational Diabetes","Preeclampsia","Preterm Labor & NICU","Bedrest Support","Pregnancy Loss","High-Risk Mindset","Finding Support"],
  es:["Cuando Se Pone Difícil","Diabetes Gestacional","Preeclampsia","Parto Prematuro y UCIN","Apoyo en Reposo","Pérdida del Embarazo","Mentalidad de Alto Riesgo","Encontrar Apoyo"],
  ht:["Lè Sa Vin Difisil","Dyabèt Gwosès","Preyeklampsi","Travay Prematire ak UCIN","Sipò Repo","Pèt Gwosès","Mantal Gwo Risk","Jwenn Sipò"],
  fr:["Quand C'est Difficile","Diabète Gestationnel","Prééclampsie","Travail Prématuré et USIN","Soutien au Repos","Perte de Grossesse","État d'Esprit Haut Risque","Trouver du Soutien"],
};
const ICONS=["⚡","🍬","⚠️","👶","🛋️","💔","🧠","🤝"];

const COMPLICATIONS={
  gd:{
    en:{title:"Gestational Diabetes: Your Role",
      what:"Gestational diabetes (GD) is a form of diabetes that develops during pregnancy. It affects how cells use sugar and can cause elevated blood sugar levels. It typically develops in the second or third trimester and affects 6-9% of pregnancies. With proper management it does not prevent a healthy birth.",
      her_experience:["Blood glucose testing 4+ times per day  -  finger pricks at specific times","Significant dietary changes  -  lower carbohydrate, higher protein, timed meals","Possible insulin injections if diet alone does not control blood sugar","Increased monitoring appointments and ultrasounds","Anxiety about the baby's size and health","Possible induction before 40 weeks"],
      your_role:[
        {action:"Learn the diet with her",detail:"Do not eat freely in front of her. If she cannot have pasta, do not make pasta. This is one of the highest-impact things you can do  -  reducing the food envy and making the diet feel like a team effort."},
        {action:"Help with blood glucose tracking",detail:"Learn how to use the glucometer. Help log the results. Notice patterns with her. This is tedious daily labor she should not have to do entirely alone."},
        {action:"Never say 'just a little won't hurt'",detail:"It might. The diet is medically prescribed. Do not undermine it even with good intentions."},
        {action:"Attend the nutrition counseling appointment",detail:"If one is offered, go. The information will make you a better support partner."},
        {action:"Prepare GD-friendly meals",detail:"Learn 3-5 meals that work within her dietary guidelines. This is one of the most practical forms of care available."},
      ],
      after:"GD typically resolves after birth. She will be tested at 6-8 weeks postpartum. Women who had GD have a higher lifetime risk of developing Type 2 diabetes  -  healthy eating and exercise habits matter long term.",
      discussion:"How has GD changed your daily routines? What has been hardest about managing this? What would make the dietary restrictions easier to live with?",
    },
    es:{title:"Diabetes Gestacional: Tu Rol",
      what:"La diabetes gestacional (DG) es una forma de diabetes que se desarrolla durante el embarazo. Afecta cómo las células usan el azúcar y puede causar niveles elevados de azúcar en sangre. Afecta al 6-9% de los embarazos. Con manejo adecuado no impide un parto saludable.",
      her_experience:["Pruebas de glucosa en sangre 4+ veces al día","Cambios dietéticos significativos  -  menos carbohidratos, más proteínas","Posibles inyecciones de insulina si la dieta sola no controla el azúcar","Aumento de citas de seguimiento y ultrasonidos","Posible inducción antes de las 40 semanas"],
      your_role:[
        {action:"Aprende la dieta con ella",detail:"No comas libremente frente a ella. Si no puede comer pasta, no hagas pasta. Reduce la envidia por la comida y hace que la dieta se sienta como un esfuerzo de equipo."},
        {action:"Ayuda con el seguimiento de glucosa",detail:"Aprende a usar el glucómetro. Ayuda a registrar los resultados. Nota los patrones con ella."},
        {action:"Nunca digas 'un poco no hará daño'",detail:"Podría hacerlo. La dieta está prescrita médicamente. No la socaves incluso con buenas intenciones."},
        {action:"Asiste a la cita de nutrición",detail:"Si se ofrece una, ve. La información te hará un mejor apoyo."},
        {action:"Prepara comidas aptas para DG",detail:"Aprende 3-5 comidas que funcionen dentro de sus pautas dietéticas."},
      ],
      after:"La DG típicamente se resuelve después del parto. Será evaluada a las 6-8 semanas postparto. Las mujeres que tuvieron DG tienen un mayor riesgo de diabetes tipo 2.",
      discussion:"¿Cómo ha cambiado la DG tus rutinas diarias? ¿Qué ha sido lo más difícil de manejar? ¿Qué haría las restricciones dietéticas más fáciles de sobrellevar?",
    },
    ht:{title:"Dyabèt Gwosès: Wòl Ou",
      what:"Dyabèt gwosès (DG) se yon fòm dyabèt ki devlope pandan gwosès. Li afekte 6-9% gwosès. Ak jestyon apwopriye li pa anpeche yon akouchman an sante.",
      her_experience:["Tès glukoz san 4+ fwa pa jou","Chanjman dyetètik enpòtan  -  mwens kabohidrat, plis pwoteyin","Enjeksyon enselin posib si dyèt sèl pa kontwole sik","Ogmantasyon randevou suivi ak ekografi","Endiksyon posib anvan 40 semèn"],
      your_role:[
        {action:"Aprann dyèt la avèk li",detail:"Pa manje libreman devan li. Si li pa ka manje pâtes, pa fè pâtes. Sa diminye jalouzi manje ak fè dyèt la santi yon efò ekip."},
        {action:"Ede ak swivi glukoz",detail:"Aprann kòman itilize glukometè a. Ede anrejistre rezilta yo. Remake modèl avèk li."},
        {action:"Janm di 'yon ti jan pa fè mal'",detail:"Li ka fè. Dyèt la preskri medikal. Pa minye li menm ak bon entansyon."},
        {action:"Asiste randevou konsèy nitrisyon",detail:"Si yo ofri youn, ale. Enfòmasyon an pral fè ou yon pi bon sipò."},
        {action:"Prepare repa apwopriye DG",detail:"Aprann 3-5 repa ki travay nan gid dyetètik li yo."},
      ],
      after:"DG tipikman rezoud apre akouchman. Li pral teste nan 6-8 semèn apre akouchman. Fanm ki te gen DG gen plis risk pou devlope Dyabèt Tip 2.",
      discussion:"Kòman DG chanje woutinn jounalyè ou? Ki sa ki pi difisil nan jere sa a? Kisa ki ta fè restriksyon dyetètik yo pi fasil pou viv ak yo?",
    },
    fr:{title:"Diabète Gestationnel: Votre Rôle",
      what:"Le diabète gestationnel (DG) est une forme de diabète qui se développe pendant la grossesse. Il affecte 6-9% des grossesses. Avec une gestion appropriée, il ne prévient pas un accouchement en bonne santé.",
      her_experience:["Tests de glycémie 4+ fois par jour","Changements alimentaires significatifs  -  moins de glucides, plus de protéines","Injections d'insuline possibles si le régime seul ne contrôle pas la glycémie","Augmentation des rendez-vous de suivi et des échographies","Induction possible avant 40 semaines"],
      your_role:[
        {action:"Apprenez le régime avec elle",detail:"Ne mangez pas librement devant elle. Si elle ne peut pas manger de pâtes, ne faites pas de pâtes. Cela réduit l'envie alimentaire et fait du régime un effort d'équipe."},
        {action:"Aidez au suivi de la glycémie",detail:"Apprenez à utiliser le glucomètre. Aidez à enregistrer les résultats. Remarquez les tendances avec elle."},
        {action:"Ne dites jamais 'un peu ne fera pas de mal'",detail:"Peut-être que si. Le régime est prescrit médicalement. Ne le sapez pas même avec de bonnes intentions."},
        {action:"Assistez au rendez-vous de conseil nutritionnel",detail:"Si un est proposé, allez-y. L'information fera de vous un meilleur soutien."},
        {action:"Préparez des repas adaptés au DG",detail:"Apprenez 3-5 repas qui fonctionnent dans ses directives alimentaires."},
      ],
      after:"Le DG se résout généralement après l'accouchement. Elle sera testée à 6-8 semaines post-partum. Les femmes qui ont eu un DG ont un risque plus élevé de développer le diabète de type 2.",
      discussion:"Comment le DG a-t-il changé vos routines quotidiennes? Qu'est-ce qui a été le plus difficile à gérer? Qu'est-ce qui rendrait les restrictions alimentaires plus faciles à vivre?",
    },
  },
  preeclampsia:{
    en:{title:"Preeclampsia: Warning Signs You Must Know",
      what:"Preeclampsia is a serious condition that develops after 20 weeks of pregnancy, characterized by high blood pressure and signs of organ damage  -  most commonly to the liver and kidneys. It affects 5-8% of pregnancies and can progress rapidly. It is one of the leading causes of maternal mortality. It is not caused by anything she did wrong.",
      warning_signs:["Severe headache that does not respond to acetaminophen","Visual changes: blurring, seeing spots or flashes, sensitivity to light","Severe pain in the upper right abdomen or shoulder  -  this is a critical sign","Sudden significant swelling of face, hands, or feet","Rapid weight gain (more than 2 lbs in a week from fluid)","Difficulty breathing"],
      critical:"If she develops severe headache, vision changes, or upper right abdominal pain  -  do not wait for a scheduled appointment. Call her provider immediately or take her to the emergency room. These are signs of severe preeclampsia that can progress to seizure (eclampsia) or HELLP syndrome.",
      your_role:[
        "Know the warning signs. Memorize them.",
        "Do not dismiss any of these symptoms as 'just pregnancy'",
        "Be the one who insists on calling the provider when she tries to wait it out",
        "Know which hospital she will deliver at and the fastest route",
        "If she is admitted for monitoring: be present, take notes, ask questions",
        "Learn to take her blood pressure if home monitoring is prescribed",
      ],
      discussion:"Do you know the warning signs of preeclampsia? Have you memorized them? What would you do if she developed a severe headache in the middle of the night?",
    },
    es:{title:"Preeclampsia: Señales de Advertencia que Debes Conocer",
      what:"La preeclampsia es una condición seria que se desarrolla después de las 20 semanas de embarazo, caracterizada por presión arterial alta y signos de daño orgánico. Afecta al 5-8% de los embarazos y puede progresar rápidamente. Es una de las principales causas de mortalidad materna.",
      warning_signs:["Dolor de cabeza severo que no responde al acetaminofén","Cambios visuales: visión borrosa, ver manchas o destellos","Dolor severo en el abdomen superior derecho o hombro  -  señal crítica","Hinchazón repentina significativa de cara, manos o pies","Aumento de peso rápido (más de 1 kg en una semana)","Dificultad para respirar"],
      critical:"Si desarrolla dolor de cabeza severo, cambios visuales o dolor abdominal superior derecho  -  no esperes una cita programada. Llama a su proveedor inmediatamente o llévala a urgencias.",
      your_role:[
        "Conoce las señales de advertencia. Memorízalas.",
        "No desestimes ninguno de estos síntomas como 'solo embarazo'",
        "Sé quien insiste en llamar al proveedor cuando ella intenta esperar",
        "Conoce cuál hospital para el parto y la ruta más rápida",
        "Si es ingresada para monitoreo: sé presente, toma notas, haz preguntas",
        "Aprende a tomar su presión arterial si se prescribe monitoreo en casa",
      ],
      discussion:"¿Conoces las señales de advertencia de la preeclampsia? ¿Las has memorizado? ¿Qué harías si desarrollara un dolor de cabeza severo en medio de la noche?",
    },
    ht:{title:"Preyeklampsi: Siy Avètisman Ou Dwe Konnen",
      what:"Preyeklampsi se yon kondisyon grav ki devlope apre 20 semèn gwosès, karakterize pa tansyon wo ak siy domaj ògàn. Li afekte 5-8% gwosès epi ka pwogresi rapidman. Se youn nan pi gwo kòz mortalite manman.",
      warning_signs:["Tèt fè mal grav ki pa reponn ak acetaminofèn","Chanjman vizyon: bwouya, wè tach oswa flash","Doulè grav nan vant anlè dwat oswa zepòl  -  siy kritik","Anfle sibit enpòtan nan figi, men, oswa pye","Pran pwa rapid (plis pase 1 kg nan yon semèn)","Difikilte respire"],
      critical:"Si li devlope tèt fè mal grav, chanjman vizyon, oswa doulè vant anlè dwat  -  pa tann yon randevou planifye. Rele pwofesyonèl li imedyatman oswa pote li nan sal ijans.",
      your_role:[
        "Konnen siy avètisman yo. Memorize yo.",
        "Pa rejte okenn nan sentòm sa yo kòm 'jis gwosès'",
        "Se ou ki enstike rele pwofesyonèl lè li eseye tann",
        "Konnen ki lopital pou akouchman ak wout ki pi rapid",
        "Si yo admèt li pou siveyans: prezan, pran nòt, poze kesyon",
        "Aprann pran tansyon li si siveyans lakay preskri",
      ],
      discussion:"Eske ou konnen siy avètisman preyeklampsi? Eske ou memorize yo? Kisa ou ta fè si li ta devlope yon tèt fè mal grav nan mitan lannuit?",
    },
    fr:{title:"Prééclampsie: Signes d'Alerte que Vous Devez Connaître",
      what:"La prééclampsie est une condition grave qui se développe après 20 semaines de grossesse, caractérisée par une tension artérielle élevée et des signes de dommages aux organes. Elle affecte 5-8% des grossesses et peut progresser rapidement. C'est l'une des principales causes de mortalité maternelle.",
      warning_signs:["Maux de tête sévères ne répondant pas au paracétamol","Changements visuels: vision floue, voir des points ou des éclairs","Douleur sévère dans l'abdomen supérieur droit ou l'épaule  -  signe critique","Gonflement soudain et significatif du visage, des mains ou des pieds","Prise de poids rapide (plus de 1 kg en une semaine)","Difficulté à respirer"],
      critical:"Si elle développe des maux de tête sévères, des changements visuels ou des douleurs abdominales supérieures droites  -  n'attendez pas un rendez-vous prévu. Appelez immédiatement son prestataire ou amenez-la aux urgences.",
      your_role:[
        "Connaissez les signes d'alerte. Mémorisez-les.",
        "Ne minimisez aucun de ces symptômes comme 'juste la grossesse'",
        "Soyez celui qui insiste pour appeler le prestataire quand elle essaie d'attendre",
        "Connaissez quel hôpital pour l'accouchement et le chemin le plus rapide",
        "Si elle est admise pour surveillance: soyez présent, prenez des notes, posez des questions",
        "Apprenez à prendre sa tension artérielle si une surveillance à domicile est prescrite",
      ],
      discussion:"Connaissez-vous les signes d'alerte de la prééclampsie? Les avez-vous mémorisés? Que feriez-vous si elle développait des maux de tête sévères au milieu de la nuit?",
    },
  },
  loss:{
    en:{title:"Pregnancy Loss: How to Walk Alongside Her",
      what:"Approximately 1 in 4 known pregnancies ends in miscarriage. Stillbirth affects approximately 1 in 100 pregnancies. These are not rare events. They are not talked about enough, and partners are frequently the most isolated people in the room  -  expected to be strong while experiencing their own profound grief.",
      her_grief:["She may feel her body failed her  -  this is almost never true, and rarely something that could have been prevented","She may feel guilt, even without logical cause","She may feel angry  -  at you, at pregnant people, at the world","She may not want comfort, information, or silver linings","She may need to talk about the baby as a baby  -  not a pregnancy, not a loss","Her grief does not have a timeline. Yours does not either."],
      your_grief:["Your grief is real even if it is less visible","You may feel pressure to be strong for her while having no one to be strong for you","You may have processed differently  -  faster or slower  -  and this can create distance","Finding someone to talk to  -  a therapist, a trusted friend, a loss support group  -  is not betrayal","Your grief does not have to look like hers to be valid"],
      what_to_say:[
        {say:"I am so sorry.",why:"Simple. True. Does not ask anything of her."},
        {say:"You do not have to say anything. I am here.",why:"Removes the pressure to perform grief in the way others expect."},
        {say:"Tell me about them.",why:"Treats the baby as a person worth naming and knowing."},
        {say:"I loved them too.",why:"Acknowledges that the loss is shared."},
        {say:"I do not know what to say but I am not going anywhere.",why:"Honesty about helplessness without abandonment."},
      ],
      avoid:["At least you know you can get pregnant","Everything happens for a reason","You can always try again","It was so early","At least it happened now and not later","She is in a better place","Try to stay positive"],
      practical:["Handle the paperwork and calls she cannot make","Research whether they want any remembrance items  -  some hospitals offer footprints, photos, or a memory box","Ask about a memorial or ritual if that would be meaningful","Check in consistently in the weeks after  -  the world moves on faster than she does","Mark the due date in your calendar and acknowledge it"],
      discussion:"How did you experience the loss differently from her? What did you need that you did not get? What can you do to make sure both of your grief is acknowledged?",
    },
    es:{title:"Pérdida del Embarazo: Cómo Caminar a Su Lado",
      what:"Aproximadamente 1 de cada 4 embarazos conocidos termina en aborto espontáneo. Los mortinatos afectan aproximadamente a 1 de cada 100 embarazos. Los compañeros son frecuentemente las personas más aisladas  -  se espera que sean fuertes mientras experimentan su propio dolor.",
      her_grief:["Puede sentir que su cuerpo la falló  -  esto casi nunca es verdad","Puede sentir culpa, incluso sin causa lógica","Puede sentir ira  -  contigo, con personas embarazadas, con el mundo","Puede necesitar hablar del bebé como un bebé  -  no una pérdida","Su duelo no tiene cronograma. El tuyo tampoco."],
      your_grief:["Tu duelo es real incluso si es menos visible","Puedes sentir presión de ser fuerte para ella sin nadie para ser fuerte para ti","Encontrar alguien con quien hablar no es traición","Tu duelo no tiene que verse como el de ella para ser válido"],
      what_to_say:[
        {say:"Lo siento mucho.",why:"Simple. Verdadero. No le pide nada."},
        {say:"No tienes que decir nada. Estoy aquí.",why:"Elimina la presión de expresar el duelo como otros esperan."},
        {say:"Cuéntame sobre ellos.",why:"Trata al bebé como una persona digna de ser nombrada."},
        {say:"Yo también los amaba.",why:"Reconoce que la pérdida es compartida."},
        {say:"No sé qué decir pero no me voy a ningún lado.",why:"Honestidad sobre la impotencia sin abandono."},
      ],
      avoid:["Al menos sabes que puedes quedar embarazada","Todo pasa por una razón","Siempre pueden intentarlo de nuevo","Era tan temprano","Trata de mantenerte positiva"],
      practical:["Maneja el papeleo y las llamadas que ella no puede hacer","Pregunta sobre artículos de recuerdo que el hospital puede ofrecer","Señala la fecha prevista de parto en tu calendario y reconócela"],
      discussion:"¿Cómo experimentaste la pérdida de manera diferente a ella? ¿Qué necesitabas que no obtuviste? ¿Qué puedes hacer para asegurarte de que el duelo de ambos sea reconocido?",
    },
    ht:{title:"Pèt Gwosès: Kòman Mache Bò Li",
      what:"Anviwon 1 nan 4 gwosès konni fini nan foskouch. Tibebe ki fèt mouri afekte anviwon 1 nan 100 gwosès. Patnè yo souvan moun ki pli izole  -  yo atann yo dwe fò pandan yo eksperyanse pwòp chagren yo.",
      her_grief:["Li ka santi kò li echwe li  -  sa a prèske janm vre","Li ka santi koulpabilite, menm san kòz lojik","Li ka santi kòlè  -  kont ou, kont moun ansent, kont mond lan","Li ka bezwen pale sou bebe a kòm yon bebe  -  pa yon pèt","Chagren li pa gen yon kronoloji. Pa ou tou."],
      your_grief:["Chagren ou reyèl menm si li mwens vizib","Ou ka santi presyon pou dwe fò pou li san pèsòn pou dwe fò pou ou","Jwenn yon moun pou pale avèk yo pa trayi","Chagren ou pa bezwen sanble pa li pou valab"],
      what_to_say:[
        {say:"Mwen trè dezole.",why:"Senp. Vre. Pa mande anyen nan li."},
        {say:"Ou pa bezwen di anyen. Mwen la.",why:"Retire presyon pou eksprime chagren jan lòt moun atann."},
        {say:"Di mwen sou yo.",why:"Trete bebe a kòm yon moun ki merite nonmen ak konnen."},
        {say:"Mwen te renmen yo tou.",why:"Rekonèt ke pèt la pataje."},
        {say:"Mwen pa konnen kisa pou di men mwen pa prale.",why:"Onèstete sou enpotans san abandone."},
      ],
      avoid:["Omwen ou konnen ou ka ansent","Tout bagay rive pou yon rezon","Ou ka toujou eseye ankò","Li te tèlman bonè","Eseye rete pozitif"],
      practical:["Jere papye ak apèl li pa ka fè","Mande sou atik souvni lopital ka ofri","Mete dat pwevi nan kalandriye ou epi rekonèt li"],
      discussion:"Kòman ou eksperyanse pèt la diferaman pase li? Kisa ou te bezwen ou pa te jwenn? Kisa ou ka fè pou asire chagren tou de nou rekonèt?",
    },
    fr:{title:"Perte de Grossesse: Comment Marcher à Ses Côtés",
      what:"Environ 1 grossesse connue sur 4 se termine par une fausse couche. Les mortinatalités affectent environ 1 grossesse sur 100. Les partenaires sont fréquemment les personnes les plus isolées  -  attendus d'être forts tout en vivant leur propre deuil profond.",
      her_grief:["Elle peut sentir que son corps l'a trahie  -  c'est presque jamais vrai","Elle peut ressentir de la culpabilité, même sans raison logique","Elle peut ressentir de la colère  -  contre vous, contre les personnes enceintes, contre le monde","Elle peut avoir besoin de parler du bébé comme d'un bébé  -  pas d'une perte","Son deuil n'a pas de calendrier. Le vôtre non plus."],
      your_grief:["Votre deuil est réel même s'il est moins visible","Vous pouvez ressentir la pression d'être fort pour elle sans personne pour être fort pour vous","Trouver quelqu'un à qui parler n'est pas une trahison","Votre deuil n'a pas à ressembler au sien pour être valide"],
      what_to_say:[
        {say:"Je suis tellement désolé.",why:"Simple. Vrai. Ne lui demande rien."},
        {say:"Tu n'as pas à dire quoi que ce soit. Je suis là.",why:"Enlève la pression d'exprimer le deuil comme les autres s'y attendent."},
        {say:"Parle-moi d'eux.",why:"Traite le bébé comme une personne méritant d'être nommée."},
        {say:"Je les aimais aussi.",why:"Reconnaît que la perte est partagée."},
        {say:"Je ne sais pas quoi dire mais je ne vais nulle part.",why:"Honnêteté sur l'impuissance sans abandon."},
      ],
      avoid:["Au moins tu sais que tu peux tomber enceinte","Tout arrive pour une raison","Vous pourrez toujours réessayer","C'était si tôt","Essaie de rester positive"],
      practical:["Gérez les paperasses et appels qu'elle ne peut pas faire","Renseignez-vous sur les objets de souvenir que l'hôpital peut offrir","Marquez la date prévue d'accouchement dans votre calendrier et reconnaissez-la"],
      discussion:"Comment avez-vous vécu la perte différemment d'elle? De quoi aviez-vous besoin que vous n'avez pas reçu? Que pouvez-vous faire pour vous assurer que le deuil de vous deux est reconnu?",
    },
  },
};

const BEDREST={
  en:{title:"Bedrest Support: When She Cannot Get Up",
    intro:"Prescribed bedrest  -  whether partial or complete  -  is one of the most emotionally and practically challenging complications a pregnant person can face. It removes independence, career, social life, and the ability to prepare for the baby. Your role during bedrest is the most concrete care role of the entire pregnancy.",
    practical:[
      "Handle all cooking, cleaning, laundry, and household management",
      "Set up her bedrest station: water, snacks, remote, phone charger, medications, comfort items all in reach",
      "Coordinate visitors so she has company without being drained",
      "Handle all communications with family who want updates",
      "Research and order any equipment she may need: bed tray, pregnancy pillow, streaming services",
      "Attend all appointments  -  she may need assistance getting there",
    ],
    emotional:[
      "She may feel guilty for 'doing nothing'  -  remind her that keeping the baby safe IS doing something",
      "She may be bored, frustrated, anxious, or all three simultaneously",
      "Ask what she needs emotionally each day  -  it changes",
      "Do not make her feel like a burden by performing martyrdom about how much you are doing",
      "Find activities you can do together from her bedrest location",
    ],
    discussion:"What has been the hardest part of bedrest for each of you? What has helped? What is still missing?",
  },
  es:{title:"Apoyo en Reposo: Cuando Ella No Puede Levantarse",
    intro:"El reposo prescrito es uno de los desafíos más emocionalmente y prácticamente difíciles que una persona embarazada puede enfrentar. Tu rol durante el reposo es el rol de cuidado más concreto de todo el embarazo.",
    practical:[
      "Maneja toda la cocina, limpieza, lavandería y gestión del hogar",
      "Configura su estación de reposo: agua, bocadillos, control remoto, cargador de teléfono, medicamentos al alcance",
      "Coordina visitantes para que tenga compañía sin agotarse",
      "Maneja todas las comunicaciones con la familia que quiere actualizaciones",
      "Asiste a todas las citas  -  puede necesitar asistencia para llegar",
    ],
    emotional:[
      "Puede sentirse culpable por 'no hacer nada'  -  recuérdale que mantener al bebé seguro ES hacer algo",
      "Puede estar aburrida, frustrada, ansiosa, o las tres simultáneamente",
      "Pregunta qué necesita emocionalmente cada día  -  cambia",
      "No la hagas sentir como una carga realizando martirio sobre cuánto estás haciendo",
    ],
    discussion:"¿Qué ha sido lo más difícil del reposo para cada uno? ¿Qué ha ayudado? ¿Qué todavía falta?",
  },
  ht:{title:"Sipò Repo: Lè Li Pa Ka Leve",
    intro:"Repo preskri se youn nan konplikasyon ki plis defi emosyonèlman ak pratikman yon moun ansent ka fè fas. Wòl ou pandan repo se wòl swen ki plis konkrè nan tout gwosès la.",
    practical:[
      "Jere tout kwizin, netwayaj, lesiv, ak jestyon kay",
      "Mete estasyon repo li: dlo, goute, telekomand, chajè telefòn, medikaman touche",
      "Kòdone vizitè pou li gen konpayi san epwize",
      "Jere tout kominikasyon ak fanmiy ki vle nouvo",
      "Asiste tout randevou  -  li ka bezwen asistans pou rive la",
    ],
    emotional:[
      "Li ka santi koulpabilite pou 'pa fè anyen'  -  raple li kenbe bebe a an sekirite SE fè yon bagay",
      "Li ka annwi, fristire, enkyete, oswa twa an menm tan",
      "Mande kisa li bezwen emosyonèlman chak jou  -  li chanje",
      "Pa fè li santi kòm yon chaj lè ou pèfòme martirizasyon sou konbyen ou ap fè",
    ],
    discussion:"Ki sa ki te pi difisil pou chak youn sou repo? Ki sa ki te ede? Ki sa ki toujou manke?",
  },
  fr:{title:"Soutien au Repos: Quand Elle Ne Peut Pas Se Lever",
    intro:"Le repos prescrit est l'un des défis les plus émotionnellement et pratiquement difficiles qu'une personne enceinte puisse rencontrer. Votre rôle pendant le repos est le rôle de soins le plus concret de toute la grossesse.",
    practical:[
      "Gérez toute la cuisine, le nettoyage, la lessive et la gestion du foyer",
      "Installez sa station de repos: eau, collations, télécommande, chargeur, médicaments à portée",
      "Coordonnez les visiteurs pour qu'elle ait de la compagnie sans être épuisée",
      "Gérez toutes les communications avec la famille qui veut des nouvelles",
      "Assistez à tous les rendez-vous  -  elle peut avoir besoin d'aide pour y arriver",
    ],
    emotional:[
      "Elle peut se sentir coupable de 'ne rien faire'  -  rappelez-lui que garder le bébé en sécurité EST faire quelque chose",
      "Elle peut s'ennuyer, être frustrée, anxieuse, ou les trois simultanément",
      "Demandez ce dont elle a besoin émotionnellement chaque jour  -  cela change",
      "Ne la faites pas se sentir comme un fardeau en performant le martyre de tout ce que vous faites",
    ],
    discussion:"Qu'est-ce qui a été le plus difficile pour chacun de vous pendant le repos? Qu'est-ce qui a aidé? Qu'est-ce qui manque encore?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecGD({lang,C}){
  const d=COMPLICATIONS.gd[lang];
  return <div>
    <div style={{background:C.teal+"0d",border:"1px solid "+C.teal+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.what}</p>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>WHAT SHE IS EXPERIENCING</div>
      {d.her_experience.map((e,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.orange,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{e}</span>
      </div>)}
    </div>
    {d.your_role.map((r,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.green+"20",borderRadius:12,padding:"12px 16px",marginBottom:9}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:C.green,marginBottom:4}}>{r.action}</div>
      <p style={{fontSize:12.5,color:C.muted,lineHeight:1.55,margin:0}}>{r.detail}</p>
    </div>)}
    <div style={{background:C.blue+"0a",border:"1px solid "+C.blue+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.blue,fontFamily:"'DM Mono',monospace",marginBottom:6}}>AFTER BIRTH</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.after}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecPreeclampsia({lang,C}){
  const d=COMPLICATIONS.preeclampsia[lang];
  return <div>
    <div style={{background:C.orange+"0d",border:"1px solid "+C.orange+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.what}</p>
    </div>
    <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:14,padding:18,marginBottom:16}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:C.red,marginBottom:12}}>
        {lang==="en"?"WARNING SIGNS  -  MEMORIZE THESE":lang==="es"?"SEÑALES DE ADVERTENCIA  -  MEMORIZA ESTAS":lang==="ht"?"SIY AVÈTISMAN  -  MEMORIZE SA YO":"SIGNES D'ALERTE  -  MÉMORISEZ-LES"}
      </div>
      {d.warning_signs.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:4}}/>
        <span style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{s}</span>
      </div>)}
    </div>
    <div style={{background:C.red+"0a",border:"1px solid "+C.red+"22",borderRadius:12,padding:14,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0,fontWeight:600}}>{d.critical}</p>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:10}}>YOUR ROLE</div>
      {d.your_role.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.accent,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:12.5,color:C.muted,lineHeight:1.5}}>{r}</span>
      </div>)}
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecLoss({lang,C}){
  const d=COMPLICATIONS.loss[lang];
  const [tab,setTab]=useState("say");
  return <div>
    <div style={{background:C.blue+"0d",border:"1px solid "+C.blue+"25",borderRadius:12,padding:16,marginBottom:16}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.what}</p>
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
      {[{v:"say",l:lang==="en"?"What to Say":lang==="es"?"Qué Decir":lang==="ht"?"Kisa Pou Di":"Quoi Dire",c:C.green},
        {v:"avoid",l:lang==="en"?"What to Avoid":lang==="es"?"Qué Evitar":lang==="ht"?"Kisa Pou Evite":"Ce qu'il Faut Éviter",c:C.red},
        {v:"her",l:lang==="en"?"Her Grief":lang==="es"?"Su Duelo":lang==="ht"?"Chagren Li":"Son Deuil",c:C.pink},
        {v:"yours",l:lang==="en"?"Your Grief":lang==="es"?"Tu Duelo":lang==="ht"?"Chagren Ou":"Votre Deuil",c:C.blue}].map(o=>(
        <button key={o.v} onClick={()=>setTab(o.v)} style={{background:tab===o.v?o.c+"20":C.inputBg,border:"1px solid "+(tab===o.v?o.c:C.border),borderRadius:20,padding:"6px 16px",fontSize:11,fontFamily:"'DM Mono',monospace",color:tab===o.v?o.c:C.muted,cursor:"pointer"}}>{o.l}</button>
      ))}
    </div>
    {tab==="say"&&d.what_to_say.map((item,i)=><div key={i} style={{marginBottom:10}}>
      <div style={{background:C.green+"08",border:"1px solid "+C.green+"20",borderRadius:"10px 10px 0 0",padding:"9px 14px"}}>
        <p style={{fontSize:13.5,color:C.green,fontFamily:"'DM Mono',monospace",margin:0}}>{item.say}</p>
      </div>
      <div style={{background:C.cardAlt,border:"1px solid "+C.border,borderTopWidth:0,borderRadius:"0 0 10px 10px",padding:"9px 14px"}}>
        <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0}}>{item.why}</p>
      </div>
    </div>)}
    {tab==="avoid"&&<div style={{background:C.red+"08",border:"1px solid "+C.red+"22",borderRadius:14,padding:16}}>
      {d.avoid.map((a,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{a}</span>
      </div>)}
    </div>}
    {tab==="her"&&<div style={{background:C.pink+"08",border:"1px solid "+C.pink+"22",borderRadius:14,padding:16}}>
      {d.her_grief.map((g,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.pink,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{g}</span>
      </div>)}
    </div>}
    {tab==="yours"&&<div style={{background:C.blue+"08",border:"1px solid "+C.blue+"22",borderRadius:14,padding:16}}>
      {d.your_grief.map((g,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
        <div style={{width:4,height:4,borderRadius:"50%",background:C.blue,flexShrink:0,marginTop:5}}/>
        <span style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{g}</span>
      </div>)}
    </div>}
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecBedrest({lang,C}){
  const d=BEDREST[lang];
  return <div>
    <div style={{background:C.purple+"0d",border:"1px solid "+C.purple+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,marginBottom:14}}>
      <div style={{background:C.accent+"0a",border:"1px solid "+C.accent+"22",borderRadius:14,padding:16}}>
        <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",marginBottom:10}}>PRACTICAL CARE</div>
        {d.practical.map((p,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:C.accent,flexShrink:0,marginTop:5}}/>
          <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{p}</span>
        </div>)}
      </div>
      <div style={{background:C.blue+"0a",border:"1px solid "+C.blue+"22",borderRadius:14,padding:16}}>
        <div style={{fontSize:10,color:C.blue,fontFamily:"'DM Mono',monospace",marginBottom:10}}>EMOTIONAL CARE</div>
        {d.emotional.map((e,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:C.blue,flexShrink:0,marginTop:5}}/>
          <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{e}</span>
        </div>)}
      </div>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC_G8={
  en:{
    0:{icon:"⚡",text:"Most partner education assumes a smooth, uncomplicated pregnancy. But gestational diabetes, preeclampsia, preterm labor, bedrest, and pregnancy loss are far more common than most people know. This guide addresses the complications nobody wants to talk about  -  because knowing how to show up when things go wrong is one of the most important things a partner can do."},
    3:{icon:"👶",title:"Preterm Labor and NICU Preparation",text:"Preterm birth (before 37 weeks) affects approximately 1 in 10 pregnancies in the United States. A NICU stay is one of the most emotionally intense experiences new parents face. Partners should know the signs of preterm labor  -  regular contractions before 37 weeks, pelvic pressure, low back pain, discharge changes, fluid leaking  -  and take them seriously. If a NICU stay occurs: learn the staff names, ask questions at rounds, advocate for skin-to-skin as early as medically possible, take notes, and do not underestimate how much her mental health needs protecting in this period."},
    6:{icon:"🧠",title:"High-Risk Mindset",text:"A high-risk pregnancy requires a partner who can stay calm when information is scary, advocate consistently, absorb information on behalf of both of you, and maintain hope without denying the reality. This is one of the most demanding emotional roles in parenthood. Give yourself permission to struggle. Get support for yourself. You cannot be her rock if you are drowning. The goal is not to be fearless. The goal is to be present and functional despite the fear."},
    7:{icon:"🤝",title:"Finding Support",text:"High-risk pregnancy and pregnancy loss both come with inadequate support systems. For complications: ask your provider specifically for a social worker referral, a maternal-fetal medicine specialist if not already involved, and support resources for partners. For pregnancy loss: The National Share Office (nationalshare.org), Still Standing Magazine, and local hospital grief programs serve both parents. You are not expected to navigate this without support. Finding it is not weakness. It is wisdom."},
  },
  es:{
    0:{icon:"⚡",text:"La mayoría de la educación para parejas asume un embarazo sin complicaciones. Pero la diabetes gestacional, la preeclampsia, el parto prematuro, el reposo y la pérdida del embarazo son mucho más comunes de lo que la mayoría de la gente sabe. Esta guía aborda las complicaciones de las que nadie quiere hablar."},
    3:{icon:"👶",title:"Parto Prematuro y Preparación para la UCIN",text:"El parto prematuro afecta aproximadamente a 1 de cada 10 embarazos. Los signos de trabajo de parto prematuro incluyen contracciones regulares antes de las 37 semanas, presión pélvica, dolor de espalda baja y cambios en las secreciones. Si ocurre una estadía en la UCIN: aprende los nombres del personal, haz preguntas en las rondas, aboga por el método canguro lo antes posible médicamente."},
    6:{icon:"🧠",title:"Mentalidad de Alto Riesgo",text:"Un embarazo de alto riesgo requiere una pareja que pueda mantenerse tranquila cuando la información es aterradora, abogar consistentemente y mantener la esperanza sin negar la realidad. El objetivo no es ser valiente. El objetivo es estar presente y funcional a pesar del miedo."},
    7:{icon:"🤝",title:"Encontrar Apoyo",text:"El embarazo de alto riesgo y la pérdida del embarazo vienen con sistemas de apoyo inadecuados. Para complicaciones: pide a tu proveedor una derivación a trabajo social. Para la pérdida del embarazo: The National Share Office (nationalshare.org) sirve a ambos padres. Encontrar apoyo no es debilidad. Es sabiduría."},
  },
  ht:{
    0:{icon:"⚡",text:"Pifò edikasyon patnè sipoze yon gwosès san konplikasyon. Men dyabèt gwosès, preyeklampsi, travay prematire, repo, ak pèt gwosès pi kouran pase pifò moun konnen. Gid sa a adrese konplikasyon pèsòn pa vle pale sou yo."},
    3:{icon:"👶",title:"Travay Prematire ak Preparasyon UCIN",text:"Akouchman prematire afekte anviwon 1 nan 10 gwosès. Siy travay prematire enkli kontraksiyon regilye anvan 37 semèn, presyon pelvik, doulè do ba, ak chanjman secresyon. Si yon séjou UCIN rive: aprann non anplwaye yo, poze kesyon nan wòn, defann metòd kangourou pi bonè posib medikal."},
    6:{icon:"🧠",title:"Mantal Gwo Risk",text:"Yon gwosès gwo risk mande yon patnè ki ka rete trankil lè enfòmasyon pè, defann konsistaman, epi kenbe espwa san nye reyalite. Objektif la pa pou san pè. Objektif la se prezan ak fonksyonèl malgre pè a."},
    7:{icon:"🤝",title:"Jwenn Sipò",text:"Gwosès gwo risk ak pèt gwosès vini ak sistèm sipò ki pa ase. Pou konplikasyon: mande pwofesyonèl ou yon referans travay sosyal. Pou pèt gwosès: The National Share Office (nationalshare.org) sèvi tou de paran. Jwenn sipò pa feblès. Se sajès."},
  },
  fr:{
    0:{icon:"⚡",text:"La plupart de l'éducation des partenaires suppose une grossesse sans complications. Mais le diabète gestationnel, la prééclampsie, le travail prématuré, le repos au lit et la perte de grossesse sont beaucoup plus courants que la plupart des gens ne le savent. Ce guide aborde les complications dont personne ne veut parler."},
    3:{icon:"👶",title:"Travail Prématuré et Préparation à l'USIN",text:"La naissance prématurée affecte environ 1 grossesse sur 10. Les signes de travail prématuré comprennent des contractions régulières avant 37 semaines, une pression pelvienne, des douleurs lombaires et des changements de pertes. Si un séjour en USIN survient: apprenez les noms du personnel, posez des questions lors des visites, défendez le peau-à-peau dès que médicalement possible."},
    6:{icon:"🧠",title:"État d'Esprit Haut Risque",text:"Une grossesse à haut risque nécessite un partenaire capable de rester calme quand l'information fait peur, de défendre constamment et de maintenir l'espoir sans nier la réalité. L'objectif n'est pas d'être sans peur. L'objectif est d'être présent et fonctionnel malgré la peur."},
    7:{icon:"🤝",title:"Trouver du Soutien",text:"La grossesse à haut risque et la perte de grossesse viennent avec des systèmes de soutien inadéquats. Pour les complications: demandez à votre prestataire une référence en travail social. Pour la perte de grossesse: The National Share Office (nationalshare.org) sert les deux parents. Trouver du soutien n'est pas une faiblesse. C'est de la sagesse."},
  },
};

export default function PartnerComplicationsGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_G8[lang]||GENERIC_G8.en;
  const kpis=[
    {icon:"🍬",value:"6-9%",label:lang==="en"?"PREGNANCIES GET GD":lang==="es"?"EMBARAZOS CON DG":lang==="ht"?"GWOSÈS GEN DG":"GROSSESSES ONT DG",color:C.teal},
    {icon:"⚠️",value:"5-8%",label:lang==="en"?"PREECLAMPSIA RATE":lang==="es"?"TASA DE PREECLAMPSIA":lang==="ht"?"TO PREYEKLAMPSI":"TAUX DE PRÉÉCLAMPSIE",color:C.orange},
    {icon:"💔",value:"1 in 4",label:lang==="en"?"PREGNANCIES END IN LOSS":lang==="es"?"EMBARAZOS TERMINAN EN PÉRDIDA":lang==="ht"?"GWOSÈS FIN NAN PÈT":"GROSSESSES FINISSENT EN PERTE",color:C.red},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.accent},
  ];
  const genDiv=(icon,title,text)=><div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{icon}</div>{title&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>}<p style={{fontSize:13.5,color:C.muted,maxWidth:540,margin:"0 auto",lineHeight:1.75}}>{text}</p></div>;
  const renderSection=()=>{
    switch(section){
      case 0: return genDiv(g[0].icon,null,g[0].text);
      case 1: return <SecGD lang={lang} C={C}/>;
      case 2: return <SecPreeclampsia lang={lang} C={C}/>;
      case 3: return genDiv(g[3].icon,g[3].title,g[3].text);
      case 4: return <SecBedrest lang={lang} C={C}/>;
      case 5: return <SecLoss lang={lang} C={C}/>;
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>When Pregnancy </span>
                  <span style={{background:"linear-gradient(135deg,"+C.red+","+C.orange+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Gets Hard </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>Supporting Through Complications</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Complications Support</div>
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
