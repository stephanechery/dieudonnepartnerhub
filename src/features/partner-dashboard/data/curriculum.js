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
          course: {
            sections: [
              {
                id: "concept",
                phase: "Start",
                title: "Concept Explanation",
                summary:
                  "Pregnancy symptoms often connect to predictable body systems. The partner role starts with seeing patterns instead of isolated complaints.",
                teachingPoints: [
                  "Cardiovascular, hormonal, and musculoskeletal changes often appear together.",
                  "Normal discomfort still deserves care, tracking, and language that lowers stress."
                ],
                appliedExamples: [
                  "Back pain after standing may connect to lordosis, pelvic ligament stretch, and fatigue.",
                  "Emotional overwhelm after a long day can reflect hormonal sensitivity plus depleted energy."
                ],
                quickCheck: {
                  question:
                    "If she reports back pain and overwhelm, what should you do first?",
                  options: [
                    "Dismiss it as normal pregnancy",
                    "Validate, support comfort, and track the symptom pattern",
                    "Wait until the next appointment without action"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Validation and pattern tracking protect trust while helping you notice escalation."
                }
              },
              {
                id: "application",
                phase: "Middle",
                title: "Applied Example",
                summary:
                  "Use physiology to choose useful support actions without making her teach you what she needs.",
                teachingPoints: [
                  "Translate a symptom into one comfort action and one monitoring question.",
                  "Avoid over-talking. Name what may be happening and move into practical support."
                ],
                appliedExamples: [
                  "For lower back pain: offer water, side-lying rest, warm compress, and ask whether pain is worsening or paired with other symptoms.",
                  "For sudden severe headache or vision changes: do not monitor casually, escalate promptly."
                ],
                reflectionPrompt:
                  "Write a two-sentence response that combines empathy with one practical action.",
                quickCheck: {
                  question:
                    "Which symptom pairing requires urgent escalation in late pregnancy?",
                  options: [
                    "Mild evening fatigue and hunger",
                    "Severe headache with visual changes",
                    "Occasional hip soreness after walking"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Severe headache with visual changes can signal hypertensive complications."
                }
              },
              {
                id: "practice",
                phase: "End",
                title: "Practice and Readiness",
                summary:
                  "Before the quiz, prove you can turn the lesson into a calm support plan.",
                teachingPoints: [
                  "A good response includes empathy, comfort, and a clear threshold for calling the care team.",
                  "The goal is not diagnosis. The goal is steady support and timely escalation."
                ],
                appliedExamples: [
                  "You might say: 'I believe you. Your body is carrying a lot today. Let me help you get settled, then we will track whether this improves.'"
                ],
                reflectionPrompt:
                  "Create a short overnight plan for comfort, hydration, rest, and symptom watch points.",
                quickCheck: {
                  question: "What makes the partner response clinically useful?",
                  options: [
                    "It is short, supportive, and includes what to watch next",
                    "It replaces the provider's guidance",
                    "It avoids discussing symptoms"
                  ],
                  answerIndex: 0,
                  rationale:
                    "A useful response supports her now and keeps escalation criteria visible."
                }
              }
            ]
          },
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
          course: {
            sections: [
              {
                id: "concept",
                phase: "Start",
                title: "Concept Explanation",
                summary:
                  "Hormones shape symptoms, mood, digestion, pain sensitivity, and energy. Support improves when partners can translate those shifts into daily care.",
                teachingPoints: [
                  "hCG often tracks with early nausea patterns.",
                  "Relaxin can increase pelvic and back discomfort by changing joint stability."
                ],
                appliedExamples: [
                  "First-trimester nausea may call for smaller food timing, hydration reminders, and reduced stimulation.",
                  "Pelvic discomfort may call for movement support, rest positions, and fewer standing tasks."
                ],
                quickCheck: {
                  question: "Which hormone is strongly linked with early nausea patterns?",
                  options: ["hCG", "Melatonin", "Adrenaline"],
                  answerIndex: 0,
                  rationale:
                    "hCG rises rapidly in early pregnancy and often tracks with nausea intensity."
                }
              },
              {
                id: "application",
                phase: "Middle",
                title: "Applied Example",
                summary:
                  "Hormone literacy is only useful when it leads to more patient support at home.",
                teachingPoints: [
                  "Name the biological reason without blaming her mood or fatigue.",
                  "Pair each symptom with a small support action that removes load."
                ],
                appliedExamples: [
                  "For midday exhaustion: prep food, lower noise, bring water, and protect a rest window.",
                  "For emotional sensitivity: validate first, then ask whether she wants quiet, touch, prayer, music, or space."
                ],
                reflectionPrompt:
                  "Draft a 24-hour support plan for nausea, fatigue, and emotional sensitivity.",
                quickCheck: {
                  question: "What is the best framing for emotional sensitivity during hormone shifts?",
                  options: [
                    "A biological signal requiring support",
                    "An overreaction",
                    "A reason to stop discussing symptoms"
                  ],
                  answerIndex: 0,
                  rationale:
                    "Hormonal transitions can heighten emotional intensity and need support, not blame."
                }
              },
              {
                id: "practice",
                phase: "End",
                title: "Practice and Readiness",
                summary:
                  "Finish by turning endocrine language into a clear, low-friction care plan.",
                teachingPoints: [
                  "Support plans should include food timing, hydration, rest, and symptom thresholds.",
                  "Use her preferred coping rituals as part of the plan."
                ],
                appliedExamples: [
                  "A useful plan might include crackers by the bed, water refills, a quiet midday reset, and a note of symptoms to ask about at the next visit."
                ],
                reflectionPrompt:
                  "Write the exact support plan you would use for the next 24 hours.",
                quickCheck: {
                  question: "What should a hormone-informed support plan include?",
                  options: [
                    "Food timing, rest, hydration, and symptom watch points",
                    "Only reassurance",
                    "More questions without practical help"
                  ],
                  answerIndex: 0,
                  rationale:
                    "The plan should reduce load and keep symptom changes visible."
                }
              }
            ]
          },
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
          course: {
            sections: [
              {
                id: "concept",
                phase: "Start",
                title: "Concept Explanation",
                summary:
                  "Prenatal advocacy means helping the mother leave appointments with clear decisions, next steps, and warning thresholds.",
                teachingPoints: [
                  "Partners can track blood pressure trends, glucose screening outcomes, symptoms, and questions.",
                  "Informed consent requires benefits, risks, alternatives, intuition, and the option of doing nothing when safe."
                ],
                appliedExamples: [
                  "Before a visit, prepare the top three symptoms and the one decision that needs clarity.",
                  "During a visit, write down the plan, timing, and who to call if symptoms change."
                ],
                quickCheck: {
                  question: "What is the partner's best role in a prenatal appointment?",
                  options: [
                    "Answer every question for her",
                    "Capture decisions and clarify next steps",
                    "Avoid asking questions"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Documentation and clarification help the family follow the plan after the visit."
                }
              },
              {
                id: "application",
                phase: "Middle",
                title: "Applied Example",
                summary:
                  "When a recommendation is made, use short respectful questions to clarify the decision.",
                teachingPoints: [
                  "B.R.A.I.N. keeps questions calm under time pressure.",
                  "The partner can protect her voice without turning the room into a conflict."
                ],
                appliedExamples: [
                  "Ask: 'Can we quickly review the benefit, risk, and alternatives so we understand the recommendation?'",
                  "Ask: 'What would make this urgent today versus safe to monitor?'"
                ],
                reflectionPrompt:
                  "Write a two-minute B.R.A.I.N. script for an induction recommendation.",
                quickCheck: {
                  question: "Which question best supports informed consent?",
                  options: [
                    "Can we review benefits, risks, and alternatives?",
                    "Can we ignore this plan?",
                    "Can you decide without explaining?"
                  ],
                  answerIndex: 0,
                  rationale:
                    "The question keeps the tone collaborative while making the decision clearer."
                }
              },
              {
                id: "practice",
                phase: "End",
                title: "Practice and Readiness",
                summary:
                  "Close the lesson by preparing an appointment note that can be used in real care.",
                teachingPoints: [
                  "Good notes are brief: symptom, timing, severity, provider plan, and call-back threshold.",
                  "Urgent warning signs should never be buried in a general list."
                ],
                appliedExamples: [
                  "For headache with vision changes: document timing, severity, blood pressure if known, and call promptly."
                ],
                reflectionPrompt:
                  "Create a visit prep note with three questions and one symptom threshold.",
                quickCheck: {
                  question: "Which symptom should be treated as urgent?",
                  options: [
                    "Severe headache with visual disturbance",
                    "Mild heartburn after dinner",
                    "Occasional tiredness"
                  ],
                  answerIndex: 0,
                  rationale:
                    "This can reflect hypertensive complications and needs urgent guidance."
                }
              }
            ]
          },
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
        },
        {
          id: "prenatal-nutrition-rest",
          title: "Nutrition, Rest, and Daily Load",
          summary:
            "Build practical support around food, hydration, sleep, and daily physical strain.",
          course: {
            sections: [
              {
                id: "concept",
                phase: "Start",
                title: "Concept Explanation",
                summary:
                  "Daily support is clinical support when it protects hydration, food access, movement, and rest.",
                teachingPoints: [
                  "Pregnancy increases metabolic demand and can make nausea, reflux, constipation, and fatigue harder to manage.",
                  "Partners can reduce symptom spikes by planning meals, water, rest blocks, and physical load before the day gets hard."
                ],
                appliedExamples: [
                  "Pack a water bottle, protein snack, and nausea-safe option before leaving home.",
                  "Move heavier chores to the partner and protect a predictable rest window."
                ],
                quickCheck: {
                  question: "Which action best reduces daily prenatal strain?",
                  options: [
                    "Waiting until symptoms become severe",
                    "Planning hydration, food, rest, and task support",
                    "Encouraging her to push through fatigue"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Simple routines lower preventable stress and help symptoms get noticed earlier."
                }
              },
              {
                id: "application",
                phase: "Middle",
                title: "Applied Example",
                summary:
                  "Support plans work best when they are specific enough to use during a real workday.",
                teachingPoints: [
                  "A partner should ask what foods are tolerable instead of assuming one meal plan fits every day.",
                  "Rest support includes limiting late-night logistics, visitor demands, and avoidable physical tasks."
                ],
                appliedExamples: [
                  "If nausea peaks in the morning, place crackers, water, and medication reminders within reach.",
                  "If pelvic pain increases after errands, shorten trips and add seated breaks."
                ],
                reflectionPrompt:
                  "Write a one-day support plan that protects meals, water, movement, and rest.",
                quickCheck: {
                  question: "What should a partner do when food tolerance changes?",
                  options: [
                    "Keep serving the same meals",
                    "Ask what is tolerable and adjust the plan",
                    "Skip meals to avoid nausea"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Food tolerance can shift quickly, so support needs to follow her real symptoms."
                }
              },
              {
                id: "practice",
                phase: "End",
                title: "Practice and Readiness",
                summary:
                  "End by turning support into a repeatable home rhythm.",
                teachingPoints: [
                  "The goal is not perfection. The goal is fewer avoidable stress peaks.",
                  "Partners should track patterns that affect care, such as poor intake, dizziness, or worsening swelling."
                ],
                appliedExamples: [
                  "Create a shared note for meals, water, symptoms, movement, and call-worthy changes."
                ],
                reflectionPrompt:
                  "Name two daily tasks you will fully own during pregnancy and how you will track whether they help.",
                quickCheck: {
                  question: "Which symptom pattern should be tracked and discussed with the care team?",
                  options: [
                    "Dizziness with poor intake",
                    "A single preferred snack",
                    "Normal mild tiredness after activity"
                  ],
                  answerIndex: 0,
                  rationale:
                    "Dizziness with poor intake can affect safety and should be communicated if persistent or severe."
                }
              }
            ]
          },
          clinicalContent: [
            "Pregnancy changes fluid needs, digestion, sleep quality, and physical tolerance. Support should be practical and repeated, not occasional.",
            "Partners can reduce daily burden by taking ownership of food access, hydration prompts, transportation planning, and heavier household tasks."
          ],
          definitions: [
            {
              term: "Hyperemesis",
              definition:
                "Severe pregnancy nausea and vomiting that can cause dehydration, weight loss, and need for medical treatment."
            },
            {
              term: "Pelvic Girdle Pain",
              definition:
                "Pregnancy-related pain around the pelvis or hips that can worsen with stairs, lifting, or long walking."
            },
            {
              term: "Reflux",
              definition:
                "Burning or regurgitation caused by stomach contents moving upward, often worsened later in pregnancy."
            }
          ],
          culturalNotes: [
            "Honor preferred foods and family traditions while watching for hydration and symptom safety.",
            "Do not frame rest as laziness. Rest is part of prenatal risk reduction."
          ],
          scenario: {
            prompt:
              "She is nauseated, exhausted, and still trying to handle dinner, laundry, and errands. Build a realistic evening plan.",
            guidance:
              "Include what you take over, what gets delayed, and what symptoms you would track."
          },
          quiz: [
            {
              id: "q1",
              question: "The strongest partner move for daily prenatal support is to:",
              options: [
                "Wait for instructions",
                "Own predictable routines before symptoms spike",
                "Reduce all movement",
                "Focus only on appointments"
              ],
              answerIndex: 1,
              rationale:
                "Predictable routines protect energy and reduce the need for the mother to manage every detail."
            },
            {
              id: "q2",
              question: "Persistent vomiting with dizziness may indicate:",
              options: [
                "Need for medical guidance",
                "Normal hunger only",
                "A reason to skip fluids",
                "A non-issue"
              ],
              answerIndex: 0,
              rationale:
                "Dehydration risk needs clinical guidance when vomiting and dizziness persist."
            },
            {
              id: "q3",
              question: "A useful support plan should include:",
              options: [
                "Food, hydration, rest, and task ownership",
                "Only motivational language",
                "Extra chores for mother",
                "No symptom tracking"
              ],
              answerIndex: 0,
              rationale:
                "Concrete support reduces daily load and improves pattern recognition."
            }
          ]
        },
        {
          id: "prenatal-birth-prep",
          title: "Birth Prep and Home Readiness",
          summary:
            "Prepare for birth with practical plans, hospital logistics, and shared expectations.",
          course: {
            sections: [
              {
                id: "concept",
                phase: "Start",
                title: "Concept Explanation",
                summary:
                  "Birth preparation is the process of making choices, roles, and logistics clear before labor begins.",
                teachingPoints: [
                  "A birth plan should be short, flexible, and focused on values, preferences, and safety needs.",
                  "Prepared partners know where to go, what to bring, who to call, and how to communicate when plans change."
                ],
                appliedExamples: [
                  "Store hospital address, triage phone number, insurance card, and medication list in one shared place.",
                  "Practice a short script for pain support, consent questions, and family updates."
                ],
                quickCheck: {
                  question: "What makes a birth plan useful?",
                  options: [
                    "It is long and rigid",
                    "It is short, flexible, and values-based",
                    "It replaces clinical advice"
                  ],
                  answerIndex: 1,
                  rationale:
                    "A focused plan helps the team understand priorities while leaving room for safety changes."
                }
              },
              {
                id: "application",
                phase: "Middle",
                title: "Applied Example",
                summary:
                  "Logistics should be clear enough that neither person has to solve everything during contractions.",
                teachingPoints: [
                  "The partner can handle bags, transport, visitor boundaries, and update messages.",
                  "Clear roles reduce conflict when labor starts at an inconvenient time."
                ],
                appliedExamples: [
                  "Create a go-time checklist: contractions, fluid, bleeding, fetal movement, call provider, leave time.",
                  "Assign one person for family updates so the mother does not manage messages."
                ],
                reflectionPrompt:
                  "Draft your go-time checklist and identify who handles each item.",
                quickCheck: {
                  question: "Who should manage family updates during labor when possible?",
                  options: [
                    "The mother between contractions",
                    "A designated support person",
                    "No one under any circumstance"
                  ],
                  answerIndex: 1,
                  rationale:
                    "A designated person protects the mother's focus and reduces stress."
                }
              },
              {
                id: "practice",
                phase: "End",
                title: "Practice and Readiness",
                summary:
                  "Finish by rehearsing how you will respond when labor begins.",
                teachingPoints: [
                  "Rehearsal builds calm because the first steps are already decided.",
                  "Partners should know emergency symptoms that bypass routine planning."
                ],
                appliedExamples: [
                  "If she has heavy bleeding, severe headache, or decreased fetal movement, call the care team or seek urgent care based on guidance."
                ],
                reflectionPrompt:
                  "Write the first five actions you will take when she says labor may be starting.",
                quickCheck: {
                  question: "Which situation should override routine plans?",
                  options: [
                    "A packed bag is missing socks",
                    "Heavy bleeding or decreased fetal movement",
                    "A family member wants an update"
                  ],
                  answerIndex: 1,
                  rationale:
                    "Potential emergency symptoms require prompt clinical guidance."
                }
              }
            ]
          },
          clinicalContent: [
            "Birth preparation improves response time by clarifying logistics, support roles, preferences, and escalation criteria before labor starts.",
            "A partner can reduce stress by owning transport, communication, packed items, visitor boundaries, and decision notes."
          ],
          definitions: [
            {
              term: "Birth Preferences",
              definition:
                "A short list of values and care preferences that helps the team understand what matters to the mother."
            },
            {
              term: "Triage",
              definition:
                "The clinical process of assessing symptoms and deciding the next level of care."
            },
            {
              term: "Rupture of Membranes",
              definition:
                "When the amniotic sac breaks and fluid leaks or gushes before or during labor."
            }
          ],
          culturalNotes: [
            "Include faith, family, modesty, and language needs in birth preferences when they matter.",
            "Set visitor boundaries early so support does not become another demand on the mother."
          ],
          scenario: {
            prompt:
              "Contractions begin at night, the bag is not fully packed, and family members are texting. What do you do first?",
            guidance:
              "Prioritize clinical guidance, transport readiness, and reducing the mother's communication load."
          },
          quiz: [
            {
              id: "q1",
              question: "A partner should know before labor starts:",
              options: [
                "Only the due date",
                "Where to go, who to call, and what symptoms change the plan",
                "Everyone's visitor preferences except mother's",
                "Nothing until contractions begin"
              ],
              answerIndex: 1,
              rationale:
                "Prepared logistics reduce stress and support faster decisions."
            },
            {
              id: "q2",
              question: "A birth preference plan should be:",
              options: [
                "Flexible and clear",
                "Secret from the care team",
                "Focused only on visitors",
                "Used to refuse all changes"
              ],
              answerIndex: 0,
              rationale:
                "Clear preferences help the care team support values while adapting to safety needs."
            },
            {
              id: "q3",
              question: "The partner's communication role is to:",
              options: [
                "Protect focus and share concise updates",
                "Send every detail to everyone",
                "Hand the phone to mother",
                "Avoid all provider questions"
              ],
              answerIndex: 0,
              rationale:
                "Good communication protects the mother's energy and keeps support aligned."
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
        },
        {
          id: "labor-advocacy-monitoring",
          title: "Monitoring, Advocacy, and Team Communication",
          summary:
            "Understand bedside monitoring and practice clear communication with the care team.",
          clinicalContent: [
            "Labor monitoring gives the team information about contraction pattern, fetal response, and maternal status. Partners do not need to interpret every tracing, but they should understand why monitoring changes.",
            "Strong partner advocacy is calm, concise, and specific. It helps the mother understand what is happening without disrupting urgent care."
          ],
          definitions: [
            {
              term: "Fetal Monitoring",
              definition:
                "Assessment of fetal heart rate patterns during labor using external or internal tools."
            },
            {
              term: "Variability",
              definition:
                "Normal beat-to-beat fetal heart rate changes that can help clinicians assess fetal well-being."
            },
            {
              term: "Tachysystole",
              definition:
                "Excessively frequent contractions that can reduce fetal recovery time between contractions."
            }
          ],
          culturalNotes: [
            "Ask for plain-language explanations when clinical terms move too quickly.",
            "Support the mother's preference for who hears updates, especially when family is present."
          ],
          scenario: {
            prompt:
              "The monitor alarm sounds, staff enter quickly, and she becomes frightened. What do you say to her and what do you ask the nurse?",
            guidance:
              "Ground her first, then ask for a short explanation of what is being watched and what happens next."
          },
          quiz: [
            {
              id: "q1",
              question: "A partner's best response to urgent monitor activity is to:",
              options: [
                "Panic and interpret the tracing alone",
                "Stay calm, orient the mother, and ask for a concise update",
                "Disconnect the monitor",
                "Leave the room"
              ],
              answerIndex: 1,
              rationale:
                "Calm orientation and clear questions support safety and reduce fear."
            },
            {
              id: "q2",
              question: "Fetal monitoring is used to assess:",
              options: [
                "Fetal heart rate patterns and response to labor",
                "Visitor timing",
                "Only maternal hunger",
                "The exact birth time"
              ],
              answerIndex: 0,
              rationale:
                "Monitoring helps clinicians assess fetal response and labor status."
            },
            {
              id: "q3",
              question: "Effective advocacy language during labor is:",
              options: [
                "Clear, respectful, and specific",
                "Loud and accusatory",
                "Silent at all times",
                "Focused on winning arguments"
              ],
              answerIndex: 0,
              rationale:
                "Specific, respectful questions protect understanding while keeping care moving."
            }
          ]
        },
        {
          id: "labor-immediate-postbirth",
          title: "Immediate Postbirth Support",
          summary:
            "Support the first hour after birth, including bonding, recovery checks, and role transitions.",
          clinicalContent: [
            "The immediate postbirth period includes placental delivery, bleeding assessment, newborn transition, feeding initiation, and emotional decompression.",
            "Partners can help by staying present, watching communication, taking notes, and protecting skin-to-skin or feeding goals when clinically safe."
          ],
          definitions: [
            {
              term: "Golden Hour",
              definition:
                "The early postbirth period often used for skin-to-skin, bonding, feeding initiation, and recovery observation."
            },
            {
              term: "Uterine Tone",
              definition:
                "The firmness of the uterus after birth, assessed to reduce hemorrhage risk."
            },
            {
              term: "Apgar Score",
              definition:
                "A quick newborn assessment of appearance, pulse, grimace, activity, and respiration after birth."
            }
          ],
          culturalNotes: [
            "Protect cultural or spiritual first moments when they are safe and requested.",
            "Clarify photo, visitor, and announcement preferences before birth when possible."
          ],
          scenario: {
            prompt:
              "Baby is being assessed, staff are checking bleeding, and family is asking for updates. What do you prioritize?",
            guidance:
              "Focus on mother-baby status, provider updates, and protecting the mother's stated preferences."
          },
          quiz: [
            {
              id: "q1",
              question: "The immediate postbirth partner role includes:",
              options: [
                "Managing updates, staying present, and tracking care instructions",
                "Leaving all decisions to visitors",
                "Ignoring maternal bleeding updates",
                "Only taking photos"
              ],
              answerIndex: 0,
              rationale:
                "The partner can reduce stress by managing communication and listening for care details."
            },
            {
              id: "q2",
              question: "Uterine tone matters because it helps assess:",
              options: [
                "Hemorrhage risk",
                "Hair color",
                "Visitor flow",
                "Contraction music"
              ],
              answerIndex: 0,
              rationale:
                "A firm uterus reduces bleeding risk after birth."
            },
            {
              id: "q3",
              question: "Skin-to-skin should be supported:",
              options: [
                "When clinically safe and desired",
                "Only if visitors request it",
                "Never after vaginal birth",
                "Only after discharge"
              ],
              answerIndex: 0,
              rationale:
                "Skin-to-skin can support bonding and feeding when mother and baby are stable."
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
        },
        {
          id: "postpartum-feeding-support",
          title: "Feeding Support and Partner Logistics",
          summary:
            "Support feeding goals with practical help, symptom awareness, and low-pressure coordination.",
          clinicalContent: [
            "Feeding can involve breastfeeding, pumping, formula, or combined plans. Partners support success by protecting rest, supplies, hydration, and timely help.",
            "Pain, poor latch, dehydration signs, low diaper counts, breast redness, and flu-like symptoms should prompt skilled support or provider guidance."
          ],
          definitions: [
            {
              term: "Latch",
              definition:
                "How the baby attaches to the breast during feeding, affecting milk transfer and nipple comfort."
            },
            {
              term: "Mastitis",
              definition:
                "Breast inflammation or infection that can cause redness, pain, fever, and flu-like symptoms."
            },
            {
              term: "Cluster Feeding",
              definition:
                "Periods when a newborn feeds very frequently, often during growth or regulation phases."
            }
          ],
          culturalNotes: [
            "Respect the mother's feeding goals without using shame or pressure.",
            "Family feeding advice may conflict. Help center the plan she chose with her care team."
          ],
          scenario: {
            prompt:
              "She is crying during feeds, family is giving conflicting advice, and the baby wants to feed again. What is your next support plan?",
            guidance:
              "Include emotional support, practical setup, and when to contact feeding or medical support."
          },
          quiz: [
            {
              id: "q1",
              question: "A partner supports feeding best by:",
              options: [
                "Reducing pressure and managing practical needs",
                "Criticizing the feeding method",
                "Ignoring pain",
                "Inviting more conflicting advice"
              ],
              answerIndex: 0,
              rationale:
                "Support should protect the mother's goals and reduce avoidable stress."
            },
            {
              id: "q2",
              question: "Breast redness with fever or flu-like symptoms may indicate:",
              options: [
                "Mastitis",
                "Normal hunger",
                "A visitor issue",
                "No need for follow-up"
              ],
              answerIndex: 0,
              rationale:
                "Mastitis symptoms require prompt provider guidance."
            },
            {
              id: "q3",
              question: "Cluster feeding means:",
              options: [
                "Frequent feeding over a period of time",
                "Baby should never feed again",
                "A guaranteed milk supply problem",
                "A reason to stop all support"
              ],
              answerIndex: 0,
              rationale:
                "Cluster feeding can be common, but pain, dehydration, or low output still need attention."
            }
          ]
        },
        {
          id: "postpartum-return-rhythm",
          title: "Return Home Rhythm and Long-Term Recovery",
          summary:
            "Build a home routine that supports recovery beyond the first week.",
          clinicalContent: [
            "Postpartum recovery continues for weeks and months. Pain, bleeding, mood, sleep, feeding, and appointment follow-through all need ongoing support.",
            "Partners can create a simple home operating rhythm: rest protection, meals, meds, hydration, symptom checks, appointments, and visitor boundaries."
          ],
          definitions: [
            {
              term: "Postpartum Visit",
              definition:
                "A clinical follow-up after birth to assess recovery, mood, feeding, contraception, and medical concerns."
            },
            {
              term: "Pelvic Floor",
              definition:
                "Muscles and connective tissue that support bladder, bowel, sexual function, and core stability."
            },
            {
              term: "Care Load",
              definition:
                "The combined physical, emotional, and planning work required to keep recovery and newborn care moving."
            }
          ],
          culturalNotes: [
            "Use community and family help in ways that reduce work for the mother instead of creating hosting duties.",
            "Some families expect the mother to resume duties quickly. Partners can protect recovery with clear boundaries."
          ],
          scenario: {
            prompt:
              "Two weeks after birth, visitors keep coming, sleep is fragmented, and appointments are being missed. Reset the home plan.",
            guidance:
              "Prioritize rest, appointment follow-through, visitor limits, and shared task ownership."
          },
          quiz: [
            {
              id: "q1",
              question: "A strong return-home rhythm includes:",
              options: [
                "Rest, meals, meds, symptom checks, appointments, and visitor limits",
                "Only baby photos",
                "Unlimited visitors",
                "No follow-up care"
              ],
              answerIndex: 0,
              rationale:
                "Recovery needs practical systems that protect the mother over time."
            },
            {
              id: "q2",
              question: "Missed postpartum appointments matter because:",
              options: [
                "Recovery, mood, feeding, and medical concerns may be missed",
                "Appointments are only paperwork",
                "They only matter after six months",
                "Partners cannot help with them"
              ],
              answerIndex: 0,
              rationale:
                "Follow-up care can catch physical and mental health concerns early."
            },
            {
              id: "q3",
              question: "Visitor boundaries should be based on:",
              options: [
                "Mother's recovery needs and household capacity",
                "Who texts the most",
                "Avoiding all help",
                "Keeping everyone entertained"
              ],
              answerIndex: 0,
              rationale:
                "Help should reduce care load, not create more work."
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
