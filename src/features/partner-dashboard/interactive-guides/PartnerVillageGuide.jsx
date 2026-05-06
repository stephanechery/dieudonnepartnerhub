import { useState, useEffect } from "react";
const DARK={bg:"#050914",card:"#0f172a",cardAlt:"#111c33",border:"rgba(148,163,184,0.16)",text:"#f8fafc",muted:"#cbd5e1",faint:"rgba(203,213,225,0.62)",accent:"#22d3ee",teal:"#22d3ee",purple:"#d946ef",gold:"#a78bfa",green:"#34d399",red:"#fb7185",orange:"#60a5fa",blue:"#38bdf8",pink:"#f472b6",navBg:"rgba(5,9,20,0.96)",shadow:"0 24px 80px rgba(0,0,0,0.45)",inputBg:"rgba(255,255,255,0.06)",toggleBg:"rgba(255,255,255,0.08)"};
const LIGHT={bg:"#f8fbff",card:"#ffffff",cardAlt:"#eef6ff",border:"rgba(15,23,42,0.12)",text:"#0f172a",muted:"#334155",faint:"rgba(51,65,85,0.58)",accent:"#0891b2",teal:"#0891b2",purple:"#7c3aed",gold:"#6d5dfc",green:"#059669",red:"#e11d48",orange:"#2563eb",blue:"#0284c7",pink:"#c026d3",navBg:"rgba(248,251,255,0.97)",shadow:"0 20px 55px rgba(15,23,42,0.12)",inputBg:"rgba(15,23,42,0.04)",toggleBg:"rgba(15,23,42,0.06)"};
const LANGS=[{code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},{code:"ht",label:"Kreyol",flag:"🇭🇹"},{code:"fr",label:"Français",flag:"🇫🇷"}];
const NAV={
  en:["Why This Is Your Job","Managing Family Excitement","Setting Visitor Boundaries","Responding to Advice","Cultural Traditions & Respect","Building the Postpartum Village","When Family Becomes Stress","Your Village Checklist"],
  es:["Por Qué Esto Es Tu Trabajo","Manejar la Emoción Familiar","Establecer Límites de Visitas","Responder a los Consejos","Tradiciones Culturales y Respeto","Construyendo el Pueblo Postparto","Cuando la Familia Se Convierte en Estrés","Tu Lista del Pueblo"],
  ht:["Poukisa Sa Se Travay Ou","Jere Eksite Fanmiy","Mete Limit Vizitè","Reponn Konsèy","Tradisyon Kiltirèl ak Respè","Konstwi Vilaj Apre Akouchman","Lè Fanmiy Vin Estrès","Lis Vilaj Ou"],
  fr:["Pourquoi C'est Votre Travail","Gérer l'Enthousiasme Familial","Établir des Limites de Visites","Répondre aux Conseils","Traditions Culturelles et Respect","Construire le Village Post-partum","Quand la Famille Devient du Stress","Votre Liste du Village"],
};
const ICONS=["🏘️","🎉","🚪","💬","🌍","🤝","⚡","✅"];

const VISITORS={
  en:{title:"Setting Visitor Boundaries  -  and Actually Enforcing Them",
    intro:"Every new parent has experienced the visitor who stayed too long, the family member who gave unsolicited opinions, the well-meaning relative who woke the baby. Visitor boundaries are not antisocial. They are medical support for postpartum recovery. Your job is to set them and enforce them so she does not have to.",
    rules:[
      {rule:"No visitors in the first 3-7 days unless she specifically requests them",detail:"The early postpartum period is not for visitors. It is for recovery, feeding establishment, and bonding. This is not negotiable based on how excited your parents are."},
      {rule:"Visitors must be invited  -  they do not drop by",detail:"No unannounced visits. Period. This applies to your parents, her parents, and your best friend. Unannounced visitors in the postpartum period disrupt feeding, sleep, and recovery."},
      {rule:"Visit length is determined by her  -  not by the visitor",detail:"Know in advance what she wants. Communicate it clearly. If someone has been there an hour and she looks exhausted, you say: 'We need to let her rest. Thank you for coming.'"},
      {rule:"Visitors hold the baby only if she is comfortable with it",detail:"She decides who holds her baby and when. If she wants the baby held, that is her choice. If she wants to keep the baby, that is also her choice."},
      {rule:"No visitors when she is breastfeeding unless she has invited them",detail:"Breastfeeding in the postpartum period is private time by default unless she says otherwise."},
    ],
    scripts:[
      {situation:"Grandparent wants to visit the same day of discharge",script:"We would love to have you soon. She needs a few days to recover and get settled. Can we plan something for next week?"},
      {situation:"Visitor has been there two hours and she is exhausted",script:"It has been so good to see you. We need to let her rest  -  new mama needs her sleep. We will reach out soon to plan the next visit."},
      {situation:"Family member gives unsolicited parenting advice",script:"We appreciate that. We are figuring out what works for us and will reach out if we need guidance."},
      {situation:"Someone wants to hold the baby and she is uncomfortable",script:"She is keeping the baby close right now. You will have plenty of time soon."},
    ],
    discussion:"Have you and she agreed on a visitor policy? Have you communicated it to both families? Who is the person most likely to violate it and how will you handle that?",
  },
  es:{title:"Establecer Límites de Visitas  -  y Realmente Hacerlos Cumplir",
    intro:"Los límites de visitas no son antisociales. Son apoyo médico para la recuperación postparto. Tu trabajo es establecerlos y hacerlos cumplir para que ella no tenga que hacerlo.",
    rules:[
      {rule:"Sin visitas en los primeros 3-7 días a menos que ella específicamente las solicite",detail:"El período postparto temprano no es para visitas. Es para recuperación, establecimiento de alimentación y vinculación."},
      {rule:"Los visitantes deben ser invitados  -  no llegan sin avisar",detail:"Sin visitas sin anunciar. Esto aplica a tus padres, sus padres y tu mejor amigo."},
      {rule:"La duración de la visita la determina ella  -  no el visitante",detail:"Conoce de antemano lo que ella quiere. Si alguien ha estado una hora y ella parece agotada, tú dices: 'Necesitamos dejarla descansar.'"},
      {rule:"Los visitantes carguen al bebé solo si ella está cómoda",detail:"Ella decide quién carga a su bebé y cuándo."},
      {rule:"Sin visitantes cuando está amamantando a menos que ella los haya invitado",detail:"La lactancia en el período postparto es tiempo privado por defecto."},
    ],
    scripts:[
      {situation:"El abuelo quiere visitar el mismo día del alta",script:"Nos encantaría tenerte pronto. Necesita unos días para recuperarse. ¿Podemos planear algo para la próxima semana?"},
      {situation:"El visitante lleva dos horas y ella está agotada",script:"Ha sido muy bueno verte. Necesitamos dejarla descansar. Nos comunicaremos pronto para planear la próxima visita."},
      {situation:"Un familiar da consejos no solicitados",script:"Lo apreciamos. Estamos descubriendo qué funciona para nosotros y te contactaremos si necesitamos orientación."},
      {situation:"Alguien quiere cargar al bebé y ella está incómoda",script:"Está manteniendo al bebé cerca ahora mismo. Tendrás mucho tiempo pronto."},
    ],
    discussion:"¿Han acordado tú y ella una política de visitas? ¿Se la has comunicado a ambas familias? ¿Quién es la persona que más probablemente la viole y cómo lo manejarás?",
  },
  ht:{title:"Mete Limit Vizitè  -  epi Reyèlman Aplike Yo",
    intro:"Limit vizitè pa antisosyal. Se sipò medikal pou rekiperasyon apre akouchman. Travay ou se mete yo epi aplike yo pou li pa bezwen fè sa.",
    rules:[
      {rule:"Pa gen vizitè nan premye 3-7 jou sof si li espesyalman mande yo",detail:"Peryòd apre akouchman bonè pa pou vizitè. Se pou rekiperasyon, etablisman manje, ak kamaradri."},
      {rule:"Vizitè dwe envite  -  yo pa vin san avètisman",detail:"Pa gen vizit san avètisman. Sa aplike pou paran ou, paran li, ak pi bon zanmi ou."},
      {rule:"Dire vizit la detèmine pa li  -  pa pa vizitè a",detail:"Si yon moun la depi yon èdtan epi li parèt epwize, ou di: 'Nou bezwen kite li repoze.'"},
      {rule:"Vizitè kenbe bebe a sèlman si li konfòtab",detail:"Li deside ki moun ki kenbe bebe li ak ki lè."},
      {rule:"Pa gen vizitè lè li ap bay tete sof si li te envite yo",detail:"Bay tete nan peryòd apre akouchman se tan prive pa defò."},
    ],
    scripts:[
      {situation:"Granparan vle vizite menm jou soti lopital",script:"Nou ta renmen genyen ou byento. Li bezwen kèk jou pou rekipere. Eske nou ka planifye yon bagay pou semèn pwochèn?"},
      {situation:"Vizitè la depi de èdtan epi li epwize",script:"Sa te trè bon pou wè ou. Nou bezwen kite li repoze. N ap kontakte ou byento pou planifye pwochen vizit la."},
      {situation:"Yon manm fanmiy bay konsèy ki pa mande",script:"Nou apresye sa. Nou ap jwenn sa ki travay pou nou epi n ap kontakte ou si nou bezwen gidans."},
      {situation:"Yon moun vle kenbe bebe a epi li inkonfortab",script:"Li ap kenbe bebe a pre kounye a. Ou pral gen anpil tan byento."},
    ],
    discussion:"Eske ou ak li te dakò sou yon politik vizitè? Eske ou te kominike li bay tou de fanmiy? Ki moun ki pi pral vyole li epi kòman ou pral jere sa?",
  },
  fr:{title:"Établir des Limites de Visites  -  et les Faire Respecter",
    intro:"Les limites de visites ne sont pas antisociales. Ce sont un soutien médical pour la récupération post-partum. Votre travail est de les établir et de les faire respecter pour qu'elle n'ait pas à le faire.",
    rules:[
      {rule:"Pas de visites dans les 3-7 premiers jours sauf si elle les demande spécifiquement",detail:"La période post-partum précoce n'est pas pour les visites. C'est pour la récupération, l'établissement de l'alimentation et le lien affectif."},
      {rule:"Les visiteurs doivent être invités  -  ils ne passent pas sans prévenir",detail:"Pas de visites sans prévenir. Cela s'applique à vos parents, ses parents et votre meilleur ami."},
      {rule:"La durée de la visite est déterminée par elle  -  pas par le visiteur",detail:"Si quelqu'un est là depuis une heure et qu'elle semble épuisée, vous dites: 'Nous devons la laisser se reposer.'"},
      {rule:"Les visiteurs portent le bébé seulement si elle est à l'aise",detail:"Elle décide qui porte son bébé et quand."},
      {rule:"Pas de visiteurs quand elle allaite sauf si elle les a invités",detail:"L'allaitement en période post-partum est du temps privé par défaut."},
    ],
    scripts:[
      {situation:"Les grands-parents veulent visiter le jour même de la sortie",script:"Nous aimerions vous voir bientôt. Elle a besoin de quelques jours pour récupérer. Pouvons-nous planifier quelque chose pour la semaine prochaine?"},
      {situation:"Le visiteur est là depuis deux heures et elle est épuisée",script:"C'était si bon de vous voir. Nous devons la laisser se reposer. Nous vous contacterons bientôt pour planifier la prochaine visite."},
      {situation:"Un membre de la famille donne des conseils non sollicités",script:"Nous l'apprécions. Nous trouvons ce qui fonctionne pour nous et nous vous contacterons si nous avons besoin de conseils."},
      {situation:"Quelqu'un veut tenir le bébé et elle est mal à l'aise",script:"Elle garde le bébé près d'elle pour l'instant. Vous aurez amplement le temps bientôt."},
    ],
    discussion:"Vous êtes-vous mis d'accord sur une politique de visites? L'avez-vous communiquée aux deux familles? Qui est la personne la plus susceptible de la violer et comment allez-vous gérer cela?",
  },
};

const ADVICE={
  en:{title:"Responding to Unsolicited Advice  -  Without Starting a War",
    intro:"New parents receive an avalanche of unsolicited advice  -  from both families, from strangers, from social media. Most of it comes from love. None of it was asked for. Your job as the buffer is to intercept, redirect, and protect her from having to manage other people's feelings on top of her recovery.",
    types:[
      {type:"The safety contradiction",example:"'We put you on your stomach to sleep and you were fine.'",response:"'Guidelines have changed a lot since then. We are following what our pediatrician recommended.'"},
      {type:"The feeding pressure",example:"'You should give the baby formula so you can rest' or 'You should only breastfeed.'",response:"'She is working with her provider and a lactation consultant on feeding. It is going well.'"},
      {type:"The schedule instruction",example:"'You need to get that baby on a schedule' or 'You are holding the baby too much.'",response:"'We are figuring out what works for our family. Thanks for thinking of us.'"},
      {type:"The comparison",example:"'My kids turned out fine and I never did any of that' or 'Your sister never had a problem with this.'",response:"'Every family is different. This is what is working for us.'"},
      {type:"The criticism of her",example:"'She seems tired' or 'She should be doing more.'",response:"'She just had a baby. She is doing exactly what she should be doing  -  recovering.'"},
    ],
    your_rule:"You intercept it before it reaches her. If advice is directed at her, you respond first. You are the buffer. She is recovering from birth and learning to be a parent. She should not also have to manage other people's feelings about her parenting.",
    discussion:"Who in your family is most likely to give unsolicited advice? Have you and she agreed on how to handle it? Have you practiced your responses?",
  },
  es:{title:"Responder a los Consejos No Solicitados  -  Sin Comenzar una Guerra",
    intro:"Los nuevos padres reciben una avalancha de consejos no solicitados. Tu trabajo como amortiguador es interceptar, redirigir y protegerla de tener que gestionar los sentimientos de otras personas además de su recuperación.",
    types:[
      {type:"La contradicción de seguridad",example:"'Te pusimos boca abajo a dormir y estabas bien.'",response:"'Las pautas han cambiado mucho desde entonces. Seguimos lo que recomendó nuestro pediatra.'"},
      {type:"La presión sobre la alimentación",example:"'Deberías dar fórmula para que puedas descansar' o 'Solo deberías amamantar.'",response:"'Está trabajando con su proveedor y una consultora de lactancia sobre la alimentación.'"},
      {type:"La instrucción sobre horarios",example:"'Necesitas poner a ese bebé en un horario' o 'Estás cargando demasiado al bebé.'",response:"'Estamos descubriendo qué funciona para nuestra familia. Gracias por pensar en nosotros.'"},
      {type:"La comparación",example:"'Mis hijos crecieron bien y nunca hice nada de eso.'",response:"'Cada familia es diferente. Esto es lo que está funcionando para nosotros.'"},
      {type:"La crítica hacia ella",example:"'Parece cansada' o 'Debería estar haciendo más.'",response:"'Acaba de tener un bebé. Está haciendo exactamente lo que debería estar haciendo: recuperándose.'"},
    ],
    your_rule:"Tú lo interceptas antes de que llegue a ella. Si el consejo va dirigido a ella, tú respondes primero. Eres el amortiguador.",
    discussion:"¿Quién en tu familia es más probable que dé consejos no solicitados? ¿Han acordado cómo manejarlo? ¿Has practicado tus respuestas?",
  },
  ht:{title:"Reponn Konsèy Ki Pa Mande  -  San Kòmanse yon Gè",
    intro:"Nouvo paran resevwa yon avalanche konsèy ki pa mande. Travay ou kòm tanpon se entèsepte, redirijye, ak pwoteje li pou li pa bezwen jere santi lòt moun anplis rekiperasyon li.",
    types:[
      {type:"Kontradeksyon sekirite",example:"'Nou mete ou sou vant pou dòmi epi ou te an fòm.'",response:"'Gid yo chanje anpil depi lè sa a. Nou ap swiv sa pedyat nou rekòmande.'"},
      {type:"Presyon sou manje",example:"'Ou ta dwe bay fòmil pou ou ka repoze' oswa 'Ou ta dwe sèlman bay tete.'",response:"'Li ap travay ak pwofesyonèl li ak yon konseyès alètman sou manje.'"},
      {type:"Enstriksyon sou orè",example:"'Ou bezwen mete bebe sa a sou yon orè' oswa 'Ou kenbe bebe a twòp.'",response:"'Nou ap jwenn sa ki travay pou fanmiy nou. Mèsi pou panse a nou.'"},
      {type:"Konparezon",example:"'Timoun mwen yo grandi an fòm epi mwen pa t janm fè okenn bagay sa yo.'",response:"'Chak fanmiy diferan. Sa a se sa k ap travay pou nou.'"},
      {type:"Kritik sou li",example:"'Li parèt fatige' oswa 'Li ta dwe fè plis.'",response:"'Li sot fè yon bebe. Li ap fè egzakteman sa li ta dwe fè  -  rekipere.'"},
    ],
    your_rule:"Ou entèsepte li anvan li rive jwenn li. Si konsèy a dirije ba li, ou reponn an premye. Ou se tanpon an.",
    discussion:"Ki moun nan fanmiy ou ki pi pral bay konsèy ki pa mande? Eske ou ak li te dakò sou kòman pou jere sa? Eske ou pratike repons ou yo?",
  },
  fr:{title:"Répondre aux Conseils Non Sollicités  -  Sans Déclencher une Guerre",
    intro:"Les nouveaux parents reçoivent une avalanche de conseils non sollicités. Votre travail en tant que tampon est d'intercepter, de rediriger et de la protéger de devoir gérer les sentiments des autres en plus de sa récupération.",
    types:[
      {type:"La contradiction de sécurité",example:"'Nous te mettions sur le ventre pour dormir et tu allais bien.'",response:"'Les recommandations ont beaucoup changé depuis. Nous suivons ce que notre pédiatre a recommandé.'"},
      {type:"La pression sur l'alimentation",example:"'Tu devrais donner du lait infantile pour pouvoir te reposer' ou 'Tu devrais seulement allaiter.'",response:"'Elle travaille avec son prestataire et une consultante en lactation sur l'alimentation.'"},
      {type:"L'instruction sur les horaires",example:"'Tu dois mettre ce bébé sur un horaire' ou 'Tu portes trop le bébé.'",response:"'Nous trouvons ce qui fonctionne pour notre famille. Merci de penser à nous.'"},
      {type:"La comparaison",example:"'Mes enfants ont bien grandi et je n'ai jamais fait rien de tout ça.'",response:"'Chaque famille est différente. C'est ce qui fonctionne pour nous.'"},
      {type:"La critique d'elle",example:"'Elle semble fatiguée' ou 'Elle devrait en faire plus.'",response:"'Elle vient d'avoir un bébé. Elle fait exactement ce qu'elle devrait faire  -  récupérer.'"},
    ],
    your_rule:"Vous l'interceptez avant qu'il ne l'atteigne. Si le conseil est adressé à elle, vous répondez en premier. Vous êtes le tampon.",
    discussion:"Qui dans votre famille est le plus susceptible de donner des conseils non sollicités? Vous êtes-vous mis d'accord sur la façon de les gérer? Avez-vous pratiqué vos réponses?",
  },
};

const VILLAGE={
  en:{title:"Building the Postpartum Village Before You Need It",
    intro:"The village does not assemble itself. It is recruited, organized, and activated intentionally  -  before the birth, while you have the energy to do it. Families who try to build their support network in the fourth trimester are doing it during the hardest possible time.",
    categories:[
      {cat:"Practical Help",color:"green",people:["Someone who can make and deliver food  -  2-3 people committed to specific days","Someone who can do a load of laundry or dishes without needing direction","Someone who can run errands or pick up groceries","Someone who can watch older children if you have them"]},
      {cat:"Emotional Support for Her",color:"purple",people:["One or two friends she can be honest with  -  not just supportive, but honest","A therapist or counselor she has already met with before the birth if possible","Other new mothers at similar stages  -  a mom group, a birth cohort"]},
      {cat:"Professional Support",color:"teal",people:["A pediatrician selected before birth, with a first appointment scheduled","A lactation consultant identified and contacted before birth","A postpartum doula if the budget allows  -  even a few visits make a significant difference","Her OB or midwife's after-hours contact information saved in both your phones"]},
      {cat:"Your Support",color:"blue",people:["One person you can be honest with about how you are doing  -  not just how she is doing","A new father or partner in a similar stage you can talk to","Access to mental health support if needed","Physical help: someone who can take a shift so you can sleep"]},
    ],
    meal_train:"A meal train  -  a coordinated schedule of people delivering food on specific days  -  is one of the most useful postpartum resources and one of the most underused. Set it up on a free platform like mealtrain.com or TakeThemAMeal.com before the birth. Assign a person to coordinate it so it does not fall to her.",
    discussion:"Who is in your village right now? Who needs to be added? What has been the hardest support to find? Who can coordinate the meal train?",
  },
  es:{title:"Construyendo el Pueblo Postparto Antes de Necesitarlo",
    intro:"El pueblo no se ensambla solo. Se recluta, organiza y activa intencionalmente  -  antes del nacimiento, mientras tienes la energía para hacerlo.",
    categories:[
      {cat:"Ayuda Práctica",color:"green",people:["Alguien que pueda hacer y entregar comida  -  2-3 personas comprometidas en días específicos","Alguien que pueda hacer una carga de ropa o platos sin necesitar dirección","Alguien que pueda hacer recados o comprar comestibles","Alguien que pueda cuidar a niños mayores si los tienes"]},
      {cat:"Apoyo Emocional para Ella",color:"purple",people:["Una o dos amigas con las que pueda ser honesta","Un terapeuta o consejero que ya haya visitado antes del nacimiento si es posible","Otras nuevas madres en etapas similares"]},
      {cat:"Apoyo Profesional",color:"teal",people:["Un pediatra seleccionado antes del nacimiento","Una consultora de lactancia identificada antes del nacimiento","Una doula postparto si el presupuesto lo permite","Información de contacto fuera de horario de su OB guardada en ambos teléfonos"]},
      {cat:"Tu Apoyo",color:"blue",people:["Una persona con la que puedas ser honesto sobre cómo estás tú","Un nuevo padre en una etapa similar con quien puedas hablar","Acceso a apoyo de salud mental si es necesario","Ayuda física: alguien que pueda tomar un turno para que puedas dormir"]},
    ],
    meal_train:"Un tren de comidas  -  un horario coordinado de personas que entregan comida en días específicos  -  es uno de los recursos postparto más útiles. Configúralo en una plataforma gratuita como mealtrain.com antes del nacimiento.",
    discussion:"¿Quién está en tu pueblo ahora mismo? ¿Quién necesita ser añadido? ¿Qué apoyo ha sido más difícil de encontrar?",
  },
  ht:{title:"Konstwi Vilaj Apre Akouchman Anvan Ou Bezwen Li",
    intro:"Vilaj la pa asanble tèt li. Li rekrite, òganize, epi aktive entansyonèlman  -  anvan akouchman, pandan ou gen enèji pou fè sa.",
    categories:[
      {cat:"Èd Pratik",color:"green",people:["Yon moun ki ka fè ak livrezon manje  -  2-3 moun angaje nan jou espesifik","Yon moun ki ka fè yon chaj rad oswa plat san bezwen direksyon","Yon moun ki ka fè komisyon oswa achte pwovizyon","Yon moun ki ka veye pi gran timoun si ou genyen"]},
      {cat:"Sipò Emosyonèl pou Li",color:"purple",people:["Youn oswa de zanmi li ka onèt avèk  -  pa sèlman sipòtif, men onèt","Yon terapis oswa konseyè li te deja rankontre anvan akouchman si posib","Lòt nouvo manman nan etap ki sanble"]},
      {cat:"Sipò Pwofesyonèl",color:"teal",people:["Yon pedyat chwazi anvan akouchman","Yon konseyès alètman idantifye anvan akouchman","Yon doula apre akouchman si bidjè pèmèt","Enfòmasyon kontak apre-èd OB li sovgadè nan tou de telefòn nou yo"]},
      {cat:"Sipò Pa Ou",color:"blue",people:["Yon moun ou ka onèt avèk sou kòman ou ye  -  pa sèlman kòman li ye","Yon nouvo papa nan etap ki sanble ou ka pale avèk","Aksè nan sipò sante mantal si nesesè","Èd fizik: yon moun ki ka pran yon travay pou ou ka dòmi"]},
    ],
    meal_train:"Yon tren repa  -  yon orè kòdone moun ki livrezon manje nan jou espesifik  -  se youn nan resous apre akouchman ki pi itil. Mete li kanpe sou yon platfòm gratis tankou mealtrain.com anvan akouchman.",
    discussion:"Ki moun ki nan vilaj ou kounye a? Ki moun ki bezwen ajoute? Ki sipò ki te pi difisil pou jwenn?",
  },
  fr:{title:"Construire le Village Post-partum Avant d'en Avoir Besoin",
    intro:"Le village ne s'assemble pas tout seul. Il est recruté, organisé et activé intentionnellement  -  avant la naissance, pendant que vous avez l'énergie pour le faire.",
    categories:[
      {cat:"Aide Pratique",color:"green",people:["Quelqu'un qui peut cuisiner et livrer de la nourriture  -  2-3 personnes engagées pour des jours spécifiques","Quelqu'un qui peut faire une lessive ou la vaisselle sans avoir besoin de direction","Quelqu'un qui peut faire des courses ou acheter des provisions","Quelqu'un qui peut surveiller les enfants plus âgés si vous en avez"]},
      {cat:"Soutien Émotionnel pour Elle",color:"purple",people:["Une ou deux amies avec qui elle peut être honnête  -  pas seulement de soutien, mais honnêtes","Un thérapeute ou conseiller qu'elle a déjà rencontré avant la naissance si possible","D'autres nouvelles mères à des étapes similaires"]},
      {cat:"Soutien Professionnel",color:"teal",people:["Un pédiatre sélectionné avant la naissance","Une consultante en lactation identifiée avant la naissance","Une doula post-partum si le budget le permet","Les coordonnées d'urgence de son OB sauvegardées dans les deux téléphones"]},
      {cat:"Votre Soutien",color:"blue",people:["Une personne avec qui vous pouvez être honnête sur comment vous allez  -  pas seulement elle","Un nouveau père à une étape similaire avec qui vous pouvez parler","Accès au soutien en santé mentale si nécessaire","Aide physique: quelqu'un qui peut prendre un quart pour que vous puissiez dormir"]},
    ],
    meal_train:"Un train de repas  -  un calendrier coordonné de personnes livrant de la nourriture des jours spécifiques  -  est l'une des ressources post-partum les plus utiles. Configurez-le sur une plateforme gratuite comme mealtrain.com avant la naissance.",
    discussion:"Qui est dans votre village en ce moment? Qui doit être ajouté? Quel soutien a été le plus difficile à trouver?",
  },
};

function LangBtn({code,label,flag,active,C,onClick}){return <button onClick={()=>onClick(code)} style={{background:active?C.accent+"25":C.inputBg,border:"1px solid "+(active?C.accent:C.border),borderRadius:20,padding:"5px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:12,color:active?C.accent:C.muted,transition:"all 0.2s"}}><span>{flag}</span><span>{label}</span></button>;}
function DiscBox({text,C}){return <div style={{background:C.purple+"12",border:"1px solid "+C.purple+"28",borderRadius:12,padding:16,marginTop:18}}><div style={{fontSize:10,color:C.purple,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.12em"}}>💬 REFLECT TOGETHER</div><p style={{fontSize:13.5,color:C.muted,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{text}</p></div>;}

function SecVisitors({lang,C}){
  const d=VISITORS[lang];
  const [open,setOpen]=useState(null);
  return <div>
    <div style={{background:C.accent+"0d",border:"1px solid "+C.accent+"28",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.rules.map((r,i)=>{
      const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?C.teal+"10":C.cardAlt,border:"1px solid "+(isOpen?C.teal:C.border),borderRadius:12,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:C.teal,flexShrink:0}}/>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:isOpen?C.teal:C.text,flex:1}}>{r.rule}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:"12px 0 0",paddingTop:12,borderTop:"1px solid "+C.teal+"20"}}>{r.detail}</p>}
      </div>;
    })}
    <div style={{fontSize:10,color:C.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginTop:20,marginBottom:12}}>SCRIPTS TO HAVE READY</div>
    {d.scripts.map((s,i)=><div key={i} style={{background:C.cardAlt,border:"1px solid "+C.border,borderRadius:12,padding:14,marginBottom:10}}>
      <div style={{fontSize:11,color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>WHEN: {s.situation}</div>
      <div style={{background:C.green+"0d",border:"1px solid "+C.green+"22",borderRadius:8,padding:"10px 12px"}}>
        <div style={{fontSize:9.5,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:5}}>SAY</div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0,fontStyle:"italic"}}>{s.script}</p>
      </div>
    </div>)}
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecAdvice({lang,C}){
  const d=ADVICE[lang];
  return <div>
    <div style={{background:C.orange+"0d",border:"1px solid "+C.orange+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.types.map((t,i)=><div key={i} style={{marginBottom:12}}>
      <div style={{background:C.red+"08",border:"1px solid "+C.red+"20",borderRadius:"12px 12px 0 0",padding:"10px 14px"}}>
        <div style={{fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{t.type.toUpperCase()}</div>
        <p style={{fontSize:13,color:C.muted,fontStyle:"italic",margin:0}}>{t.example}</p>
      </div>
      <div style={{background:C.green+"08",border:"1px solid "+C.green+"20",borderTopWidth:0,borderRadius:"0 0 12px 12px",padding:"10px 14px"}}>
        <div style={{fontSize:9.5,color:C.green,fontFamily:"'DM Mono',monospace",marginBottom:4}}>YOUR RESPONSE</div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.6,margin:0,fontStyle:"italic"}}>{t.response}</p>
      </div>
    </div>)}
    <div style={{background:C.accent+"0a",border:"1px solid "+C.accent+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.accent,fontFamily:"'DM Mono',monospace",marginBottom:6}}>YOUR RULE</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.your_rule}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

function SecVillage({lang,C}){
  const d=VILLAGE[lang];
  const [open,setOpen]=useState(null);
  const cm={green:C.green,purple:C.purple,teal:C.teal,blue:C.blue};
  return <div>
    <div style={{background:C.teal+"0d",border:"1px solid "+C.teal+"25",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{fontSize:13.5,color:C.muted,lineHeight:1.65,margin:0}}>{d.intro}</p>
    </div>
    {d.categories.map((cat,i)=>{
      const clr=cm[cat.color]; const isOpen=open===i;
      return <div key={i} onClick={()=>setOpen(isOpen?null:i)} style={{background:isOpen?clr+"0e":C.cardAlt,border:"1px solid "+(isOpen?clr:C.border),borderRadius:14,padding:16,marginBottom:9,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:isOpen?clr:C.text}}>{cat.cat}</div>
          <span style={{fontSize:10,color:C.faint}}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+clr+"20"}}>
          {cat.people.map((p,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:7}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:clr,flexShrink:0,marginTop:5}}/>
            <span style={{fontSize:12.5,color:C.muted,lineHeight:1.55}}>{p}</span>
          </div>)}
        </div>}
      </div>;
    })}
    <div style={{background:C.gold+"0a",border:"1px solid "+C.gold+"22",borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.gold,fontFamily:"'DM Mono',monospace",marginBottom:6}}>MEAL TRAIN</div>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.65,margin:0}}>{d.meal_train}</p>
    </div>
    <DiscBox text={d.discussion} C={C}/>
  </div>;
}

const GENERIC_G10={
  en:{
    0:{icon:"🏘️",text:"Most of the burden of managing family expectations, setting visitor boundaries, receiving unsolicited advice, and building a postpartum support network falls on the birthing person by default. This is unfair and unsustainable. This guide equips you to take that load. You become the buffer, the scheduler, the boundary enforcer, and the village architect. When you do this well, she can focus on recovering and bonding. When you do not, she manages her own recovery AND everyone else's feelings simultaneously."},
    1:{icon:"🎉",title:"Managing Family Excitement",text:"Family excitement about a new baby is beautiful and also relentless. Your job is to channel it productively. Create specific ways for excited family members to help: sign up for a meal, offer to do laundry on a specific date, watch older children for a specific window. This redirects energy from dropping by and holding the baby into actual support. Acknowledge the excitement genuinely and then give it a job."},
    4:{icon:"🌍",title:"Cultural Traditions and Respect",text:"Many families have cultural traditions around birth and postpartum that carry deep meaning  -  confinement periods, specific foods, visitors who come to support not socialize, rituals that honor the new mother. These traditions deserve respect and exploration. Ask both of your families what matters to them. Share what you discover with each other. Look for the overlap between cultural practice and evidence-based care. When there is tension, have the conversation openly rather than dismissing either side."},
    6:{icon:"⚡",title:"When Family Becomes a Source of Stress",text:"Sometimes family presence is not supportive  -  it is additional work. A parent who criticizes, a sibling who needs reassurance, an in-law who takes over. When this happens your job is not to manage her relationship with her family for her. It is to reduce your family's impact on her. Limit visits when she says she is tired. Intercept difficult relatives before they reach her. If someone has repeatedly caused stress, it is appropriate to limit access temporarily. Protecting her is not keeping family away. It is ensuring that contact happens on terms that support her recovery."},
    7:{icon:"✅",title:"Your Village Checklist",text:"Before the birth: Who brings meals and on which days? Who has agreed to be on call for specific tasks? Is the pediatrician selected and the first appointment scheduled? Is the lactation consultant identified? Is the meal train set up? Does your family know the visitor policy? Does her family know the visitor policy? Do both of your phones have the after-hours number for her provider? Do you have a therapist or support person of your own identified? If you cannot answer yes to most of these: start there."},
  },
  es:{
    0:{icon:"🏘️",text:"La mayor parte de la carga de gestionar las expectativas familiares, establecer límites de visitas, recibir consejos no solicitados y construir una red de apoyo postparto recae sobre la persona que da a luz por defecto. Esta guía te equipa para asumir esa carga."},
    1:{icon:"🎉",title:"Manejar la Emoción Familiar",text:"Crea formas específicas para que los miembros de la familia emocionados ayuden: inscribirse para una comida, ofrecer hacer la ropa en una fecha específica, cuidar a niños mayores por un tiempo específico. Esto redirige la energía hacia apoyo real."},
    4:{icon:"🌍",title:"Tradiciones Culturales y Respeto",text:"Muchas familias tienen tradiciones culturales en torno al nacimiento y el postparto que tienen un significado profundo  -  períodos de reposo, alimentos específicos, rituales que honran a la nueva madre. Estas tradiciones merecen respeto y exploración. Pregunta a ambas familias qué les importa."},
    6:{icon:"⚡",title:"Cuando la Familia Se Convierte en Estrés",text:"A veces la presencia familiar no es de apoyo  -  es trabajo adicional. Cuando esto sucede, tu trabajo es reducir el impacto de tu familia en ella. Protegerla no es mantener a la familia alejada. Es asegurar que el contacto ocurra en términos que apoyen su recuperación."},
    7:{icon:"✅",title:"Tu Lista del Pueblo",text:"Antes del nacimiento: ¿Quién trae comidas y en qué días? ¿Está el pediatra seleccionado? ¿Está el tren de comidas configurado? ¿Conoce tu familia la política de visitas? Si no puedes responder sí a la mayoría de estas: empieza por ahí."},
  },
  ht:{
    0:{icon:"🏘️",text:"Pifò chaj jere atant fanmiy, mete limit vizitè, resevwa konsèy ki pa mande, ak konstwi yon rezo sipò apre akouchman tonbe sou moun ki akouche pa defò. Gid sa a ekipe ou pou pran chaj sa a."},
    1:{icon:"🎉",title:"Jere Eksite Fanmiy",text:"Kreye fason espesifik pou manm fanmiy eksite ede: enskri pou yon repa, ofri pou fè rad nan yon dat espesifik, siveye pi gran timoun pou yon fenèt espesifik. Sa redirijye enèji nan sipò reyèl."},
    4:{icon:"🌍",title:"Tradisyon Kiltirèl ak Respè",text:"Anpil fanmiy gen tradisyon kiltirèl otou akouchman ak apre akouchman ki gen siyifikasyon pwofon  -  peryòd klotiraj, manje espesifik, rityèl ki onore nouvo manman. Tradisyon sa yo merite respè ak eksplorasyon."},
    6:{icon:"⚡",title:"Lè Fanmiy Vin Estrès",text:"Pafwa prezans fanmiy pa sipòtif  -  se travay siplemantè. Lè sa rive, travay ou se diminye enpak fanmiy ou sou li. Pwoteje li pa kenbe fanmiy lwen. Se asire kontak rive nan tèm ki sipòte rekiperasyon li."},
    7:{icon:"✅",title:"Lis Vilaj Ou",text:"Anvan akouchman: Ki moun ki pote repa ak nan ki jou? Eske pedyat la chwazi? Eske tren repa a mete kanpe? Eske fanmiy ou konnen politik vizitè a? Si ou pa ka di wi pou pifò nan sa yo: kòmanse la."},
  },
  fr:{
    0:{icon:"🏘️",text:"La majeure partie du fardeau de gérer les attentes familiales, d'établir des limites de visites, de recevoir des conseils non sollicités et de construire un réseau de soutien post-partum incombe par défaut à la personne qui accouche. Ce guide vous équipe pour prendre cette charge."},
    1:{icon:"🎉",title:"Gérer l'Enthousiasme Familial",text:"Créez des façons spécifiques pour les membres de la famille enthousiastes d'aider: s'inscrire pour un repas, offrir de faire la lessive à une date précise, surveiller les enfants plus âgés pour une fenêtre spécifique. Cela redirige l'énergie vers un vrai soutien."},
    4:{icon:"🌍",title:"Traditions Culturelles et Respect",text:"De nombreuses familles ont des traditions culturelles autour de la naissance et du post-partum qui ont une signification profonde  -  périodes de confinement, aliments spécifiques, rituels honorant la nouvelle mère. Ces traditions méritent respect et exploration."},
    6:{icon:"⚡",title:"Quand la Famille Devient du Stress",text:"Parfois la présence familiale n'est pas soutenante  -  c'est du travail supplémentaire. Quand cela se produit, votre travail est de réduire l'impact de votre famille sur elle. La protéger ne signifie pas éloigner la famille. C'est s'assurer que le contact se fait dans des conditions qui soutiennent sa récupération."},
    7:{icon:"✅",title:"Votre Liste du Village",text:"Avant la naissance: Qui apporte des repas et quels jours? Le pédiatre est-il sélectionné? Le train de repas est-il mis en place? Votre famille connaît-elle la politique de visites? Si vous ne pouvez pas répondre oui à la plupart: commencez par là."},
  },
};

export default function PartnerVillageGuide(){
  const [lang,setLang]=useState("en");
  const [section,setSection]=useState(0);
  const [dark,setDark]=useState(()=>{if(typeof window==="undefined")return true;return window.localStorage.getItem("dph-guide-theme")!=="light";});
  const [ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80);},[]);
  useEffect(()=>{if(typeof window!=="undefined")window.localStorage.setItem("dph-guide-theme",dark?"dark":"light");},[dark]);
  const C=dark?DARK:LIGHT;
  const navLabels=NAV[lang];
  const g=GENERIC_G10[lang]||GENERIC_G10.en;
  const kpis=[
    {icon:"🚪",value:"3-7",label:lang==="en"?"DAYS BEFORE VISITORS":lang==="es"?"DÍAS ANTES DE VISITAS":lang==="ht"?"JOU ANVAN VIZITÈ":"JOURS AVANT VISITES",color:C.teal},
    {icon:"🍽️",value:"Meal",label:lang==="en"?"TRAIN: SET IT UP NOW":lang==="es"?"TREN DE COMIDAS: AHORA":lang==="ht"?"TREN REPA: KOUNYE A":"TRAIN DE REPAS: MAINTENANT",color:C.gold},
    {icon:"🛡️",value:"You",label:lang==="en"?"ARE THE BUFFER":lang==="es"?"ERES EL AMORTIGUADOR":lang==="ht"?"SE TANPON AN":"ÊTES LE TAMPON",color:C.accent},
    {icon:"🗣️",value:"4",label:lang==="en"?"LANGUAGES":lang==="es"?"IDIOMAS":lang==="ht"?"LANG":"LANGUES",color:C.blue},
  ];
  const genDiv=(icon,title,text)=><div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:52,marginBottom:16}}>{icon}</div>{title&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:16}}>{title}</div>}<p style={{fontSize:13.5,color:C.muted,maxWidth:540,margin:"0 auto",lineHeight:1.75}}>{text}</p></div>;
  const renderSection=()=>{
    switch(section){
      case 0: return genDiv(g[0].icon,null,g[0].text);
      case 1: return genDiv(g[1].icon,g[1].title,g[1].text);
      case 2: return <SecVisitors lang={lang} C={C}/>;
      case 3: return <SecAdvice lang={lang} C={C}/>;
      case 4: return genDiv(g[4].icon,g[4].title,g[4].text);
      case 5: return <SecVillage lang={lang} C={C}/>;
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
                  <span style={{background:"linear-gradient(135deg,"+C.accent+","+C.gold+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Building </span>
                  <span style={{background:"linear-gradient(135deg,"+C.teal+","+C.green+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Your Village </span>
                  <span style={{fontWeight:400,fontSize:"0.6em",WebkitTextFillColor:C.faint}}>Family, Visitors & Community</span>
                </h1>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{background:C.inputBg,border:"1px solid "+C.border,borderRadius:10,padding:"6px 12px",fontSize:9.5,color:C.faint,fontFamily:"'DM Mono',monospace"}}>FOCUS   8 Sections · Community Building</div>
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
