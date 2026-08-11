import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const componentSource = await readFile(
  new URL('./MainGuideSupportTools.jsx', import.meta.url),
  'utf8'
);
const appSource = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');

test('desktop pane keeps guide and support tools as explicit modes', () => {
  assert.match(componentSource, /MainGuideDesktopPane/);
  assert.match(componentSource, /\['guide', 'support'\]/);
  assert.match(componentSource, /aria-pressed=\{mode === value\}/);
  assert.match(componentSource, /GuideOutline/);
  assert.match(componentSource, /SupportToolsContent/);
});

test('support tools retain current task and stage actions', () => {
  for (const label of [
    "Today's Partner Focus",
    'Prenatal Support Builder',
    'Labor Coaching Pack',
    'Postpartum Meal Builder',
    'Recovery Home Planner',
    'Partner Tips',
    'Reminders',
    'My Notes'
  ]) {
    assert.ok(`${componentSource}\n${appSource}`.includes(label), `${label} should remain available`);
  }

  assert.match(componentSource, /onToggleTask\(task\.id\)/);
  assert.match(componentSource, /onPrenatalAction/);
  assert.match(componentSource, /onLaborAction/);
  assert.match(componentSource, /onMealAction/);
  assert.match(componentSource, /onOpenRecoveryPlanner/);
});

test('mobile support tools use a safe, keyboard-accessible bottom sheet', () => {
  assert.match(componentSource, /role="dialog"/);
  assert.match(componentSource, /aria-modal="true"/);
  assert.match(componentSource, /event\.key === 'Escape'/);
  assert.match(componentSource, /event\.key !== 'Tab'/);
  assert.match(componentSource, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(componentSource, /createPortal/);
  assert.match(componentSource, /appRoot\.inert = true/);
  assert.match(componentSource, /max-h-\[calc\(100dvh-1rem\)\]/);
  assert.match(componentSource, /env\(safe-area-inset-bottom\)/);
  assert.match(componentSource, /lg:hidden/);
});

test('App wires the approved guide shell without changing data or access services', () => {
  assert.match(appSource, /MainGuideDesktopPane/);
  assert.match(appSource, /MainGuideMobileSupportTools/);
  assert.match(appSource, /lg:grid-cols-\[minmax\(22rem,26\.25rem\)_minmax\(0,1fr\)\]/);
  assert.match(appSource, /onToggleTask=\{toggleTask\}/);
  assert.match(appSource, /onLaborAction=\{\(\) => handleAiAction\('coach'\)\}/);
  assert.match(appSource, /onMealAction=\{\(\) => handleAiAction\('meal'\)\}/);
  assert.match(appSource, /onPrenatalAction=\{openPrenatalSupportPack\}/);
});
