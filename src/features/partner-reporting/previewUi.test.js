import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');
test('preview retains synthetic labels, accessible filters and the existing theme selector',()=>{
 const source=read('./ReportingPreview.jsx');
 for(const phrase of ['Synthetic preview.','No real participants','Export sample CSV','Data definitions & readiness','data-theme=', 'htmlFor="report-cohort"','id="report-cohort"','htmlFor="report-month"','id="report-month"'])assert.ok(source.includes(phrase),phrase);
 assert.doesNotMatch(source,/fetch\(|localStorage|sessionStorage|supabase|authService/);
});
test('reporting is not activated in the production router or build inputs',()=>{
 assert.doesNotMatch(read('../../../vite.config.js'),/reporting-preview/);
 assert.doesNotMatch(read('../partner-dashboard/index.jsx'),/ReportingPreview/);
 assert.doesNotMatch(read('../../RootApp.jsx'),/ReportingPreview/);
});
