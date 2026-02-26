export const partnerCurriculum = {
  modules: [
    {
      id: "prenatal",
      title: "Prenatal",
      subtitle: "Pregnancy physiology, advocacy, and daily support",
      objective:
        "Understand trimester-level body changes, hormone effects, and practical support actions before labor begins.",
      lessons: [
        {
          id: "prenatal-foundations",
          title: "Prenatal Foundations",
          summary:
            "Build a strong baseline for prenatal support by learning what is changing anatomically and emotionally.",
          clinicalContent: [
            "Pregnancy changes cardiovascular, endocrine, and musculoskeletal systems in parallel. Multiple symptoms often come from one hormonal shift.",
            "Partners who can identify normal adaptation versus escalation triggers reduce both maternal stress and avoidable delays in care."
          ],
          definitions: [
            {
              term: "Lordosis",
              definition:
                "A compensatory increase in lumbar spinal curve as center of gravity moves forward."
            },
            {
              term: "Braxton Hicks",
              definition:
                "Intermittent non-progressive uterine contractions that do not consistently dilate the cervix."
            },
            {
              term: "Round Ligament Pain",
              definition:
                "Sharp lower abdominal/groin discomfort from stretching support ligaments around the uterus."
            }
          ],
          culturalNotes: [
            "Ask mother how her family interprets symptoms before correcting language; align education with lived context.",
            "Avoid labeling responses as overreaction. Validate first, then translate physiology clearly."
          ],
          scenario: {
            prompt:
              "At 30 weeks she reports new lower back pain and emotional overwhelm after a long day. How do you respond in a way that combines empathy and physiology?",
            guidance:
              "Name what may be happening biologically, offer immediate comfort actions, and identify what to monitor overnight."
          },
          quiz: [
            {
              id: "q1",
              question: "Which hormone commonly contributes to constipation during pregnancy?",
              options: ["Oxytocin", "Progesterone", "Prolactin", "Melatonin"],
              answerIndex: 1,
              rationale:
                "Progesterone relaxes smooth muscle, which slows gastrointestinal motility."
            },
            {
              id: "q2",
              question:
                "The best partner response to a distressing symptom is to first:",
              options: [
                "Dismiss and reassure quickly",
                "Validate and assess symptom pattern",
                "Wait until next appointment",
                "Search social media advice"
              ],
              answerIndex: 1,
              rationale:
                "Validation plus structured assessment improves trust and clinical decision-making."
            },
            {
              id: "q3",
              question:
                "Sudden severe headache with visual changes in late pregnancy should be treated as:",
              options: ["Normal fatigue", "Mild dehydration", "Urgent escalation", "Muscle strain"],
              answerIndex: 2,
              rationale:
                "These are high-risk symptoms for hypertensive complications and need immediate follow-up."
            }
          ]
        },
        {
          id: "prenatal-hormones",
          title: "Hormones and Maternal Experience",
          summary:
            "Translate endocrine language into practical support decisions at home and during appointments.",
          clinicalContent: [
            "Estrogen rises through pregnancy and influences vascular tone and neurotransmitter pathways; this can affect mood sensitivity, headaches, and nausea intensity.",
            "hCG rises rapidly in first trimester to sustain progesterone production and is strongly associated with nausea patterns."
          ],
          definitions: [
            {
              term: "hCG",
              definition:
                "Human chorionic gonadotropin, placental hormone that helps sustain early pregnancy endocrine signaling."
            },
            {
              term: "Relaxin",
              definition:
                "Hormone that increases ligament laxity and softens pelvic tissues in preparation for birth."
            },
            {
              term: "Cortisol",
              definition:
                "Stress-associated hormone that rises physiologically in pregnancy and can increase reactivity under poor support conditions."
            }
          ],
          culturalNotes: [
            "Use language that avoids blame around mood shifts; anchor in physiology and support planning.",
            "Discuss preferred coping rituals (faith, family, music, quiet) as protective tools rather than optional extras."
          ],
          scenario: {
            prompt:
              "She says she feels emotionally raw and physically exhausted by midday in the first trimester. Build a support plan for the next 24 hours.",
            guidance:
              "Include nutrition timing, reduced stimulation, hydration, and a short symptom watch list."
          },
          quiz: [
            {
              id: "q1",
              question: "Rapid first-trimester rise in which hormone often tracks with nausea?",
              options: ["hCG", "Oxytocin", "Dopamine", "Insulin"],
              answerIndex: 0,
              rationale: "hCG kinetics are strongly associated with early nausea/vomiting patterns."
            },
            {
              id: "q2",
              question: "Relaxin primarily affects:",
              options: [
                "Ligament laxity and pelvic stability",
                "Milk production",
                "Blood glucose control",
                "Fetal heart rate"
              ],
              answerIndex: 0,
              rationale: "Relaxin loosens ligaments and contributes to mobility changes and pain risk."
            },
            {
              id: "q3",
              question:
                "Best interpretation of increased emotional sensitivity during hormone shifts:",
              options: [
                "Behavioral exaggeration",
                "Biological signal requiring support",
                "Medication side effect only",
                "Lack of resilience"
              ],
              answerIndex: 1,
              rationale:
                "Neuroendocrine transitions can amplify emotional intensity and require structured support."
            }
          ]
        },
        {
          id: "prenatal-advocacy",
          title: "Appointment Advocacy and Risk Recognition",
          summary:
            "Prepare for prenatal visits with concise questions and escalation criteria.",
          clinicalContent: [
            "A partner can reduce cognitive load by tracking blood pressure trends, glucose screening outcomes, and symptom changes between appointments.",
            "Informed consent requires benefit-risk-alternative discussion before interventions, especially around induction and surveillance decisions."
          ],
          definitions: [
            {
              term: "Informed Consent",
              definition:
                "A process where patient-centered decisions are made after understanding benefits, risks, alternatives, and timing."
            },
            {
              term: "Gestational Diabetes",
              definition:
                "Pregnancy-onset glucose intolerance requiring monitoring to reduce maternal and neonatal risk."
            },
            {
              term: "Preeclampsia",
              definition:
                "Hypertensive disorder of pregnancy that may involve headache, vision changes, organ stress, and severe complications."
            }
          ],
          culturalNotes: [
            "Encourage mothers to bring preferred support people or interpreters to appointments when useful.",
            "Respect traditional postpartum and pregnancy beliefs while clarifying medical red flags."
          ],
          scenario: {
            prompt:
              "During a visit, induction is proposed. Draft how you would use B.R.A.I.N. questions in under two minutes.",
            guidance:
              "Keep tone collaborative, specific, and focused on clinical indication plus alternatives."
          },
          quiz: [
            {
              id: "q1",
              question: "B.R.A.I.N. stands for:",
              options: [
                "Benefits, Risks, Alternatives, Intuition, Nothing",
                "Bloodwork, Results, Assessment, Intervention, Next",
                "Baseline, Recovery, Admission, Infection, Notes",
                "Breathing, Rest, Analgesia, IV, Nutrition"
              ],
              answerIndex: 0,
              rationale: "This framework supports rapid, structured medical decision-making in real time."
            },
            {
              id: "q2",
              question:
                "A partner's best role during prenatal appointments is to:",
              options: [
                "Answer all questions for mother",
                "Stay silent unless asked",
                "Capture key decisions and clarify next steps",
                "Debate provider recommendations"
              ],
              answerIndex: 2,
              rationale:
                "Clear documentation and clarification improve continuity and reduce confusion after visits."
            },
            {
              id: "q3",
              question: "Which finding warrants urgent call to provider?",
              options: [
                "Mild heartburn after dinner",
                "Severe headache with visual disturbance",
                "Normal fetal movement",
                "Occasional fatigue"
              ],
              answerIndex: 1,
              rationale: "Neurologic symptoms with severe headache require urgent hypertensive evaluation."
            }
          ]
        }
      ]
    },
    {
      id: "labor",
      title: "Labor and Delivery",
      subtitle: "Physiology, communication, and bedside execution",
      objective:
        "Support labor progression with tactical comfort measures and informed clinical communication.",
      lessons: [
        {
          id: "labor-stages",
          title: "Stages of Labor and Partner Role",
          summary:
            "Understand latent, active, transition, and second-stage labor behaviors.",
          clinicalContent: [
            "Labor progression is nonlinear. Cervical change depends on contraction pattern, fetal position, and maternal stress state.",
            "Partners improve outcomes by preserving calm environment, hydration, and movement support."
          ],
          definitions: [
            {
              term: "Transition",
              definition:
                "High-intensity phase near full dilation often accompanied by nausea, shaking, and emotional overwhelm."
            },
            {
              term: "Effacement",
              definition: "Cervical thinning required before or with full dilation."
            },
            {
              term: "Station",
              definition:
                "Fetal descent marker in relation to maternal ischial spines, from -3 to +3."
            }
          ],
          culturalNotes: [
            "Ask how the mother prefers coaching language; some want direct command, others gentle mirroring.",
            "Integrate birth preferences respectfully while staying aligned with safety recommendations."
          ],
          scenario: {
            prompt:
              "She says, 'I cannot do this anymore' during transition. Write your exact verbal response and one physical action.",
            guidance:
              "Use short rhythm-based affirmations and practical grounding cues."
          },
          quiz: [
            {
              id: "q1",
              question: "Which behavior best supports endogenous oxytocin in labor?",
              options: ["Bright lights and frequent interruptions", "Quiet environment with supportive touch", "Long fasting periods", "Rapid questioning"],
              answerIndex: 1,
              rationale: "Calm, safety, and touch support labor hormone physiology."
            },
            {
              id: "q2",
              question: "Effacement refers to:",
              options: ["Placental delivery", "Cervical thinning", "Pain score", "Fetal heart variability"],
              answerIndex: 1,
              rationale: "Effacement is thinning of cervical tissue before birth."
            },
            {
              id: "q3",
              question: "A useful partner coaching phrase in transition is:",
              options: ["Calm down", "Are you okay?", "One wave at a time. Breathe with me.", "Stop moving"],
              answerIndex: 2,
              rationale: "Rhythmic, grounded prompts support regulation and breathing."
            }
          ]
        },
        {
          id: "labor-comfort",
          title: "Comfort Techniques and Position Strategy",
          summary:
            "Use body mechanics and position changes to reduce pain and aid fetal rotation.",
          clinicalContent: [
            "Counter-pressure, hip squeeze, and frequent position shifts can reduce perceived pain and improve pelvic mechanics.",
            "Back labor often reflects occiput posterior positioning; movement and sacral support are high-value interventions."
          ],
          definitions: [
            {
              term: "Occiput Posterior (OP)",
              definition:
                "Fetal position where the back of the baby's head faces maternal spine, often increasing back pain."
            },
            {
              term: "Counter-pressure",
              definition:
                "Firm sustained pressure over sacrum or hips during contraction peaks."
            },
            {
              term: "Cardinal Movements",
              definition:
                "Sequential fetal rotations and movements required to navigate the birth canal."
            }
          ],
          culturalNotes: [
            "Ask before touch. Confirm where pressure is wanted and at what intensity.",
            "Respect modesty and family presence preferences while preserving mobility options."
          ],
          scenario: {
            prompt:
              "She reports severe back labor and asks for help before epidural placement. Build a three-step physical support plan.",
            guidance:
              "Include technique, timing, and communication with bedside nurse."
          },
          quiz: [
            {
              id: "q1",
              question: "Best first response to intense back labor:",
              options: ["Limit movement", "Apply sacral counter-pressure and position changes", "Encourage complete bed rest", "Delay all support until dilation check"],
              answerIndex: 1,
              rationale: "Pressure plus movement can substantially reduce back labor burden."
            },
            {
              id: "q2",
              question: "Position changes are useful because they can:",
              options: ["Reduce all contractions", "Improve fetal alignment and maternal comfort", "Replace monitoring", "Eliminate pain medication"],
              answerIndex: 1,
              rationale: "Movement supports labor mechanics and comfort simultaneously."
            },
            {
              id: "q3",
              question: "A partner should coordinate comfort strategy with:",
              options: ["Only family", "No one", "Nursing team and mother's cues", "Online forums"],
              answerIndex: 2,
              rationale: "Integrated bedside communication improves safety and consistency."
            }
          ]
        },
        {
          id: "labor-decisions",
          title: "Clinical Decision-Making Under Pressure",
          summary:
            "Practice structured communication when interventions are proposed.",
          clinicalContent: [
            "Interventions may be appropriate, but rushed decisions without explanation can increase trauma and confusion.",
            "Partners should keep language calm and concise while preserving mother-centered consent."
          ],
          definitions: [
            {
              term: "Pitocin",
              definition:
                "Synthetic oxytocin used to induce or augment labor contractions."
            },
            {
              term: "Cesarean Delivery",
              definition: "Surgical birth through abdominal and uterine incisions."
            },
            {
              term: "Fetal Distress",
              definition:
                "Concerning fetal status patterns requiring rapid reassessment or intervention."
            }
          ],
          culturalNotes: [
            "Support language access and family understanding before consent where clinically possible.",
            "Honor mother's stated values even when plans change."
          ],
          scenario: {
            prompt:
              "A cesarean is recommended urgently. What should you communicate to mother and staff in the next 60 seconds?",
            guidance:
              "Prioritize emotional grounding, safety framing, and immediate practical support tasks."
          },
          quiz: [
            {
              id: "q1",
              question: "Best partner priority when plan pivots to cesarean:",
              options: ["Argue indication", "Leave room", "Provide calm orientation and stay present", "Film continuously"],
              answerIndex: 2,
              rationale: "Calm orienting support lowers panic and preserves trust."
            },
            {
              id: "q2",
              question: "B.R.A.I.N. is most useful when:",
              options: ["No decisions are pending", "Intervention options are presented", "Discharge is complete", "Visitor planning only"],
              answerIndex: 1,
              rationale: "It structures decision questions during active clinical choices."
            },
            {
              id: "q3",
              question: "Good escalation language is:",
              options: ["We refuse everything", "Can we review benefits, risks, and alternatives quickly?", "Do whatever", "No questions"],
              answerIndex: 1,
              rationale: "Clear collaborative language improves decision quality in time pressure."
            }
          ]
        }
      ]
    },
    {
      id: "postpartum",
      title: "Postpartum Recovery",
      subtitle: "Healing, warning signs, and mental health protection",
      objective:
        "Support physiologic recovery and recognize warning signs requiring immediate escalation.",
      warningSigns: {
        callProvider: [
          "Fever above 100.4°F (38°C)",
          "Persistent severe headache without relief",
          "Foul-smelling lochia or worsening pelvic pain",
          "Breast redness with flu-like symptoms",
          "Mood symptoms persisting beyond two weeks"
        ],
        emergency: [
          "Soaking one pad per hour or passing large clots",
          "Severe headache with visual changes",
          "Chest pain or shortness of breath",
          "Unilateral leg swelling, redness, or calf pain",
          "Thoughts of self-harm or harming baby"
        ]
      },
      lessons: [
        {
          id: "postpartum-healing",
          title: "Physical Recovery and Daily Systems",
          summary:
            "Organize medications, mobility, hydration, and home tasks to protect recovery.",
          clinicalContent: [
            "Postpartum recovery includes uterine involution, wound/perineal healing, fluid shifts, and sleep disruption.",
            "Partners reduce complications by making care routine proactive rather than reactive."
          ],
          definitions: [
            {
              term: "Involution",
              definition:
                "Uterus returning toward pre-pregnancy size through sustained contraction and tissue remodeling."
            },
            {
              term: "Lochia Rubra/Serosa/Alba",
              definition:
                "Expected staged postpartum discharge progression over several weeks."
            },
            {
              term: "Afterpains",
              definition:
                "Postpartum uterine cramping, often stronger during feeding due to oxytocin release."
            }
          ],
          culturalNotes: [
            "Respect postpartum rest traditions while reinforcing clinical warning thresholds.",
            "Support preferred healing foods/practices when they do not conflict with safety guidance."
          ],
          scenario: {
            prompt:
              "She reports increased cramping while breastfeeding and fears something is wrong. How do you respond and what do you monitor next?",
            guidance:
              "Differentiate expected afterpains from hemorrhage indicators using clear thresholds."
          },
          quiz: [
            {
              id: "q1",
              question: "Soaking one pad per hour postpartum is:",
              options: ["Expected in week one", "A threshold for emergency escalation", "Only relevant after cesarean", "Not clinically meaningful"],
              answerIndex: 1,
              rationale: "Heavy ongoing blood loss requires urgent evaluation."
            },
            {
              id: "q2",
              question: "A partner can best support healing by:",
              options: ["Waiting to be asked", "Running a proactive meds and hydration schedule", "Encouraging visitor traffic", "Reducing sleep windows"],
              answerIndex: 1,
              rationale: "Proactive routines prevent pain spikes, dehydration, and avoidable stress load."
            },
            {
              id: "q3",
              question: "Afterpains during feeding are often related to:",
              options: ["Infection", "Oxytocin-driven uterine contraction", "Anesthesia reaction", "DVT"],
              answerIndex: 1,
              rationale: "Feeding can trigger oxytocin, which increases uterine contraction sensations."
            }
          ]
        },
        {
          id: "postpartum-mental-health",
          title: "Mood, Sleep, and Mental Health Protection",
          summary:
            "Differentiate normal transition from concerning mental health patterns.",
          clinicalContent: [
            "Estrogen and progesterone fall rapidly postpartum, creating abrupt neurochemical shifts in early days.",
            "Sleep deprivation compounds anxiety, irritability, and emotional lability; structured rest is preventive care."
          ],
          definitions: [
            {
              term: "Baby Blues",
              definition: "Transient emotional lability in first one to two weeks postpartum."
            },
            {
              term: "Postpartum Depression",
              definition: "Persistent low mood, hopelessness, and functional decline requiring treatment."
            },
            {
              term: "Postpartum Anxiety",
              definition: "Persistent excessive worry, hypervigilance, and inability to settle even during rest windows."
            }
          ],
          culturalNotes: [
            "Avoid stigma language around postpartum mental symptoms; frame as treatable clinical conditions.",
            "Check who mother trusts for emotional support and include them intentionally."
          ],
          scenario: {
            prompt:
              "At day 16 postpartum she reports persistent dread, no appetite, and inability to sleep when baby sleeps. What is your next action plan?",
            guidance:
              "Use direct safety questions and immediate provider coordination."
          },
          quiz: [
            {
              id: "q1",
              question: "Mood symptoms persisting beyond two weeks postpartum should prompt:",
              options: ["No action", "Structured screening and provider contact", "Only family advice", "Hydration only"],
              answerIndex: 1,
              rationale: "Persistent symptoms require formal clinical evaluation."
            },
            {
              id: "q2",
              question: "Strongest partner-protective action for mood stability:",
              options: ["More visitors", "Guaranteed uninterrupted sleep block", "Skip meals", "Delay follow-up"],
              answerIndex: 1,
              rationale: "Sleep protection is a major mental health stabilizer postpartum."
            },
            {
              id: "q3",
              question: "Thoughts of self-harm are categorized as:",
              options: ["Normal postpartum stress", "Emergency escalation", "Routine follow-up next month", "Minor symptom"],
              answerIndex: 1,
              rationale: "Safety risk symptoms require immediate urgent intervention pathways."
            }
          ]
        },
        {
          id: "postpartum-warning-signs",
          title: "Warning Signs and Escalation Decisions",
          summary:
            "Practice threshold-based triage: call provider versus emergency care.",
          clinicalContent: [
            "Postpartum deterioration can occur rapidly after discharge. Partners should use explicit thresholds rather than waiting for symptoms to worsen.",
            "Clear triage language improves handoff quality when calling clinics or emergency services."
          ],
          definitions: [
            {
              term: "Postpartum Preeclampsia",
              definition:
                "Hypertensive disorder occurring after birth, potentially with neurologic and organ complications."
            },
            {
              term: "Pulmonary Embolism",
              definition:
                "A clot in the lung causing chest pain, dyspnea, and potential cardiovascular collapse."
            },
            {
              term: "Sepsis",
              definition:
                "Systemic infection response that can escalate rapidly and requires urgent treatment."
            }
          ],
          culturalNotes: [
            "When escalating, communicate urgency plainly while respecting family dynamics and fear responses.",
            "Do not minimize symptoms because of cultural pressure to appear strong postpartum."
          ],
          scenario: {
            prompt:
              "She has one-sided calf swelling and now reports chest discomfort. What do you do in the next five minutes?",
            guidance:
              "Prioritize emergency pathway and concise clinical communication."
          },
          quiz: [
            {
              id: "q1",
              question: "Chest pain or shortness of breath postpartum should be categorized as:",
              options: ["Home monitoring", "Emergency care", "Routine PCP visit", "Lifestyle coaching"],
              answerIndex: 1,
              rationale: "Potential cardiopulmonary emergencies require immediate evaluation."
            },
            {
              id: "q2",
              question: "Fever above 100.4°F postpartum should prompt:",
              options: ["No action", "Call provider", "Wait 72 hours", "Hydration only"],
              answerIndex: 1,
              rationale: "Fever can indicate infection and requires same-day clinical guidance."
            },
            {
              id: "q3",
              question: "Most accurate triage strategy is to:",
              options: ["Rely on intuition only", "Use defined thresholds and escalate early", "Wait for multiple severe signs", "Avoid calling due to overreaction concerns"],
              answerIndex: 1,
              rationale: "Threshold-based escalation prevents delay in time-sensitive conditions."
            }
          ]
        }
      ]
    }
  ]
};

const moduleSupplementalQuizBank = {
  prenatal: [
    {
      id: "q4",
      question: "Which prenatal symptom pattern should be documented and trended over time?",
      options: [
        "Blood pressure, headache severity, and vision symptoms",
        "Only cravings",
        "Only shoe size",
        "None if she is resting"
      ],
      answerIndex: 0,
      rationale: "Trend data helps detect deterioration and supports faster clinical escalation."
    },
    {
      id: "q5",
      type: "multi",
      question: "Select all that apply: Which signs warrant same-day provider communication in late pregnancy?",
      options: [
        "Severe headache",
        "Visual changes or sparkly vision",
        "Mild fatigue after work",
        "Sudden swelling of face or hands"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Neurologic symptoms and abrupt edema can indicate hypertensive complications."
    },
    {
      id: "q6",
      question: "Most effective first partner step when mother reports a new concerning symptom:",
      options: [
        "Minimize it to reduce anxiety",
        "Validate, assess pattern, and note timing/intensity",
        "Wait several days before tracking",
        "Ask friends before contacting care team"
      ],
      answerIndex: 1,
      rationale: "Validation plus structured assessment improves trust and clinical quality."
    },
    {
      id: "q7",
      type: "multi",
      question: "Select all that apply: Which actions reduce prenatal physical strain at home?",
      options: [
        "Frequent hydration prompts",
        "Supportive footwear and mobility pacing",
        "Encouraging heavy lifting",
        "Position changes and pillow support for sleep"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Hydration, ergonomic support, and movement adjustments reduce symptom burden."
    },
    {
      id: "q8",
      question: "In informed consent discussions, the partner's role is to:",
      options: [
        "Override maternal preferences",
        "Translate options into clear next-step questions",
        "Reject all interventions automatically",
        "Avoid questions to save time"
      ],
      answerIndex: 1,
      rationale: "Partners should support clarity and shared decision-making without replacing maternal autonomy."
    },
    {
      id: "q9",
      type: "multi",
      question: "Select all that apply: Which prep steps improve prenatal appointment quality?",
      options: [
        "Bring a short question list",
        "Track symptoms since last visit",
        "Skip note-taking to stay relaxed",
        "Clarify thresholds for urgent follow-up"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Preparation and clear thresholds improve continuity and reduce missed risk signals."
    },
    {
      id: "q10",
      question: "Regular contractions that increase in intensity before 37 weeks are best categorized as:",
      options: [
        "Normal adaptation only",
        "Clinical priority requiring immediate guidance",
        "Hydration issue only",
        "Expected Braxton Hicks pattern"
      ],
      answerIndex: 1,
      rationale: "Preterm labor patterns require urgent evaluation and potential intervention."
    }
  ],
  labor: [
    {
      id: "q4",
      question: "During labor, partner communication should primarily be:",
      options: [
        "Long and complex",
        "Short, rhythmic, and grounded",
        "Highly technical at all times",
        "Silent unless spoken to"
      ],
      answerIndex: 1,
      rationale: "Short rhythmic coaching supports breathing and nervous system regulation."
    },
    {
      id: "q5",
      type: "multi",
      question: "Select all that apply: Which environmental changes support labor physiology?",
      options: [
        "Dim lights",
        "Reduce unnecessary interruptions",
        "Increase noise and stimulation",
        "Maintain calm supportive touch"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Calm sensory conditions and safety cues support effective oxytocin signaling."
    },
    {
      id: "q6",
      question: "Effacement and dilation are best understood as:",
      options: [
        "Interchangeable terms",
        "Cervical thinning and opening processes that both matter",
        "Measures of pain tolerance only",
        "Indicators used only after delivery"
      ],
      answerIndex: 1,
      rationale: "Both processes guide labor progress and timing of pushing."
    },
    {
      id: "q7",
      type: "multi",
      question: "Select all that apply: Useful partner actions during active contractions include:",
      options: [
        "Counter-pressure where requested",
        "Breath pacing and eye contact",
        "Asking rapid unrelated questions",
        "Offer hydration between waves"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Physical comfort plus regulated coaching improves coping and stamina."
    },
    {
      id: "q8",
      question: "When an intervention is proposed, the strongest first partner prompt is:",
      options: [
        "No questions, proceed immediately",
        "Can we review benefits, risks, and alternatives quickly?",
        "We refuse all options",
        "Let's decide after discharge"
      ],
      answerIndex: 1,
      rationale: "A concise B.R.A.I.N.-style prompt preserves informed, collaborative decisions."
    },
    {
      id: "q9",
      type: "multi",
      question: "Select all that apply: If labor plan pivots unexpectedly (e.g., cesarean), partner priorities are:",
      options: [
        "Emotional grounding and orientation",
        "Clear handoff communication with team",
        "Leave to avoid stress",
        "Stay physically present when allowed"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Calm presence and structured communication reduce panic and improve care continuity."
    },
    {
      id: "q10",
      question: "A statement like 'I can't do this anymore' in late labor most often indicates:",
      options: [
        "Failure of labor",
        "Transition intensity and need for focused support",
        "Immediate discharge readiness",
        "No need for partner coaching"
      ],
      answerIndex: 1,
      rationale: "This often signals transition; partner regulation and reassurance are high-value."
    }
  ],
  postpartum: [
    {
      id: "q4",
      question: "Which postpartum pattern is most concerning for immediate escalation?",
      options: [
        "Gradual lochia color shift over weeks",
        "Soaking one heavy pad in an hour",
        "Mild fatigue after poor sleep",
        "Expected afterpains while feeding"
      ],
      answerIndex: 1,
      rationale: "Heavy rapid bleeding meets emergency threshold."
    },
    {
      id: "q5",
      type: "multi",
      question: "Select all that apply: Which findings belong in emergency care category postpartum?",
      options: [
        "Chest pain or shortness of breath",
        "Severe headache with visual changes",
        "Unilateral leg swelling and calf pain",
        "Mild hunger between feeds"
      ],
      answerIndexes: [0, 1, 2],
      rationale: "These can indicate cardiopulmonary or hypertensive emergencies."
    },
    {
      id: "q6",
      question: "Best routine partner strategy for early recovery weeks:",
      options: [
        "Wait for instructions each time",
        "Run proactive medication, hydration, and rest support systems",
        "Increase visitor flow daily",
        "Prioritize chores over sleep protection"
      ],
      answerIndex: 1,
      rationale: "Proactive systems prevent symptom spikes and reduce cognitive load."
    },
    {
      id: "q7",
      type: "multi",
      question: "Select all that apply: Mental health escalation indicators include:",
      options: [
        "Persistent dread beyond two weeks",
        "Intrusive self-harm thoughts",
        "Inability to sleep despite opportunity",
        "Single emotional moment on day 3"
      ],
      answerIndexes: [0, 1, 2],
      rationale: "Persistent or safety-risk symptoms need prompt clinical screening/escalation."
    },
    {
      id: "q8",
      question: "Fever above 100.4°F postpartum should prompt:",
      options: [
        "No action unless after 72 hours",
        "Call provider same day",
        "Only hydration and rest",
        "Routine monthly follow-up"
      ],
      answerIndex: 1,
      rationale: "Fever may indicate infection and should trigger same-day clinical guidance."
    },
    {
      id: "q9",
      type: "multi",
      question: "Select all that apply: Protective partner actions for postpartum mood stability are:",
      options: [
        "Guaranteed uninterrupted sleep block",
        "Load-sharing for household tasks",
        "Ignoring escalating anxiety symptoms",
        "Early provider contact when distress persists"
      ],
      answerIndexes: [0, 1, 3],
      rationale: "Sleep protection, load-sharing, and timely screening reduce prolonged deterioration risk."
    },
    {
      id: "q10",
      question: "Most accurate postpartum triage principle:",
      options: [
        "Wait for multiple severe signs before acting",
        "Use explicit thresholds and escalate early",
        "Rely on guesswork to avoid overreaction",
        "Treat all symptoms as non-urgent"
      ],
      answerIndex: 1,
      rationale: "Threshold-based escalation reduces delays in time-sensitive complications."
    }
  ]
};

const isMultiQuestion = (question) =>
  question?.type === "multi" || Array.isArray(question?.answerIndexes);

const normalizeQuizQuestions = (questions = []) =>
  questions.slice(0, 10).map((question, index) => ({
    ...question,
    id: `q${index + 1}`,
    ...(isMultiQuestion(question)
      ? { answerIndexes: Array.isArray(question.answerIndexes) ? question.answerIndexes : [] }
      : {})
  }));

partnerCurriculum.modules = partnerCurriculum.modules.map((module) => ({
  ...module,
  lessons: module.lessons.map((lesson) => {
    const supplemental = moduleSupplementalQuizBank[module.id] || [];
    return {
      ...lesson,
      quiz: normalizeQuizQuestions([...(lesson.quiz || []), ...supplemental])
    };
  })
}));

export const moduleOrder = partnerCurriculum.modules.map((module) => module.id);
