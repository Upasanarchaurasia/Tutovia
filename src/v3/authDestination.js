// Only resume routes owned by V3. Never accept an external or version-prefixed URL.
export function authDestination(from) {
  if (typeof from !== 'string' || !/^\/(dashboard|subject\/[^/?#]+|syllabus|exams|flashcards|wellness|news|community|profile|user|analytics|pyq|tutor|study-material|gemini-voices|admin)([/?#]|$)/.test(from) || /[\\\u0000-\u001f]/.test(from)) return '/dashboard';
  return from;
}
