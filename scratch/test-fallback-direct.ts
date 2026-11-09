import { getFallbackResponse } from '../src/lib/chatbot-fallback';

const queries = [
  'van timing',
  'school timing',
  'what is the van timing',
  'bus timing',
  'school bus timing',
  'school hours',
  'timing',
  'van details',
  'van facility'
];

console.log('Testing chatbot fallback logic:');
console.log('===============================');

queries.forEach(q => {
  console.log(`\nQuery: "${q}"`);
  console.log('Response:');
  console.log(getFallbackResponse(q));
});
