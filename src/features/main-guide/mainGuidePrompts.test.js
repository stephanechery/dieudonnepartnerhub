import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  MAIN_GUIDE_CARD_PROMPTS,
  promptForGuideCard
} from './mainGuidePrompts.js';

const appSource = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');
const guideDataSource = appSource.slice(
  appSource.indexOf('const guideData = {'),
  appSource.indexOf('const currentLanguageMeta')
);
const guideCardTitles = Array.from(
  guideDataSource.matchAll(/^ {14}title: '([^']+)'/gm),
  (match) => match[1]
);

test('every main guide learning card has a unique spoken prompt', () => {
  assert.deepEqual(
    Object.keys(MAIN_GUIDE_CARD_PROMPTS).sort(),
    guideCardTitles.sort()
  );
  assert.equal(
    new Set(Object.values(MAIN_GUIDE_CARD_PROMPTS)).size,
    guideCardTitles.length
  );
});

test('card prompts are concise, complete, and do not use the old stage default', () => {
  Object.values(MAIN_GUIDE_CARD_PROMPTS).forEach((prompt) => {
    assert.ok(prompt.length <= 120, prompt);
    assert.match(prompt, /[.?!]$/);
    assert.notEqual(prompt, 'What would make the next hour easier?');
  });
});

test('prompt lookup follows the card before the stage fallback', () => {
  assert.equal(
    promptForGuideCard({ title: 'Informed Consent Advocacy' }, 'Prenatal Support'),
    'Can you explain the benefits, risks, alternatives, and what happens if we wait?'
  );
  assert.equal(
    promptForGuideCard({ title: 'Unknown card' }, 'Labor & Delivery'),
    'I am right here. Breathe with me, one wave at a time.'
  );
});
