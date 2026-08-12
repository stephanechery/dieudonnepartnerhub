export const MAIN_GUIDE_CARD_PROMPTS = Object.freeze({
  'Center of Gravity':
    'Lean on me. Let us slow down and find a position that feels steady.',
  'Hormonal Mood Dynamics':
    'I hear you. You do not have to explain or fix how you feel.',
  'Vital Tracking (BP & Glucose)':
    'Let us write down the numbers and questions so we can review them with your care team.',
  'Pelvic Floor Health':
    'Sit down and let me help so you do not have to balance through the pain.',
  'Informed Consent Advocacy':
    'Can you explain the benefits, risks, alternatives, and what happens if we wait?',
  'Preterm Labor Awareness':
    'These symptoms are repeating. I am calling the care team now so we can be safe.',
  'Home Recovery Prep':
    'The recovery spaces are stocked. You can rest and let me handle the setup.',
  'Dilation & Effacement':
    'Your body is doing important work, even when the numbers change slowly.',
  'Oxytocin: The Labor Engine':
    'I will quiet the room and stay close. You focus on one breath at a time.',
  'Fetal Station & Rotation':
    'Tell me where you feel the pressure. I can adjust my hands and help you move.',
  'Coaching Prompts':
    'You are doing it. Stay with me for this one wave.',
  'The B.R.A.I.N. Method':
    'Before we decide, can we review the benefits, risks, alternatives, and what happens if we wait?',
  'Cesarean Pivot':
    'The plan changed, but you are not alone. I am staying right beside you.',
  'Uterine Involution':
    'The cramping can happen while your uterus shrinks. I have heat and water ready.',
  'Lochia (Postpartum Discharge)':
    'Let us check the amount, color, and any other symptoms together.',
  'Lactation Physiology':
    'I will bring a cool compress and water. Do you want help contacting feeding support?',
  'Hormonal Reset (The Crash)':
    'I have the baby. You can sleep, and I will check in when you wake.',
  'Recovery Home Base':
    'Your water, snack, and recovery supplies are here. What can I refill next?',
  'The 1-Pad Rule (Hemorrhage)':
    'You soaked another pad quickly. I am calling the emergency line now.',
  'Postpartum Preeclampsia':
    'A severe headache and vision changes need urgent care. We are going in now.',
  'DVT & Pulmonary Embolism':
    'One-sided calf pain and redness need medical advice now. I am calling.',
  'Thoughts of Self-Harm':
    'I am staying with you. You are not alone, and we are getting help now.',
  'Prenatal Home Prep':
    'The bedroom, bathroom, meals, and walking paths are ready. You do not have to manage this.',
  'First 72-Hour Landing Plan':
    'We are keeping the first few days quiet. I will handle visitors and supplies.',
  'Six-Week Support Rhythm':
    'I am keeping our support routine going. What feels hardest today?',
  'Bedroom Recovery Setup':
    'Water, medication reminders, snacks, and baby supplies are within reach.',
  'Bathroom Recovery Setup':
    'The bathroom is restocked. Tell me what would make moving around safer.',
  'Feeding Station Setup':
    'Your water, snack, and pillows are ready. I will handle the next diaper change.',
  'Baby Care Station Setup':
    'I know where the supplies are. Rest while I take this change.',
  'Kitchen and Meal Support':
    'I brought something easy to eat and refilled your water.',
  'Laundry and Cleaning Support':
    'Laundry, dishes, and feeding supplies are handled. You do not need to assign them.',
  'Shared Living Space Setup':
    'The couch is clear and supported. Come sit when you are ready.',
  'Visitor Boundaries':
    'We are ending visits now so she can rest. We will reach out when she is ready.',
  'Emergency Readiness':
    'These symptoms need care now. I am calling the provider and getting us ready to go.'
});

export const promptForGuideCard = (item, stageTitle) => {
  const prompt = MAIN_GUIDE_CARD_PROMPTS[item?.title];
  if (prompt) return prompt;

  if (stageTitle === 'Labor & Delivery') {
    return 'I am right here. Breathe with me, one wave at a time.';
  }
  if (stageTitle === 'Postpartum Recovery') {
    return 'What can I take off your plate right now?';
  }
  if (stageTitle === 'Home Setup & Recovery Support') {
    return 'I will handle the next task. You rest.';
  }
  return 'What would make the next hour easier?';
};
