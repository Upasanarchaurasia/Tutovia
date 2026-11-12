# V3 study layer

V3 owns the pages and components in this directory. They were recreated from the V1 study experience to preserve its layout and behavior without importing V1 page/component implementations or redirecting users to V1.

All navigation is handled by the `/v3` router. Login and signup default to `/v3/dashboard`; protected study URLs resume after login. The existing authentication, API client, Supabase connection, syllabus data, and non-UI utilities remain shared platform services so existing accounts and study progress continue to work.

`study.css` scopes the dashboard design tokens and effects to `.v3-study`. The local theme adapter follows V3's existing atmosphere preference without changing the document theme or the public landing/auth screens.

Study pages are loaded on demand. Deploy the V3 build only; V1, V2, and the running API do not need rebuilding or restarting.

## Daily companion dashboard

Sections follow the daily workflow: compact exam/welcome header, dated daily summary, next session with Pomodoro, responsive timetable, subjects, revision, progress, and collapsible exam strategy.

- `dailyStudy.js` holds IST date, task-selection, status, revision and dated-activity rules. A future or undated flashcard is never labelled due. A streak counter is never expanded into an invented activity history.
- Session state, focus segments, answered-exam resume points, section preferences, reflection dismissals, scenario marks, Zen settings and milestones are scoped to the authenticated user. Unowned legacy milestone/Zen/scenario keys are not silently assigned to a user. New milestone checklists start unchecked.
- Daily focus minutes and session counts cover dated V3 timer records on this browser. The existing server exposes cumulative study totals and only a last-active date; those totals are labelled cumulative and missing historical activity remains unknown. Saved exam-attempt timestamps and the streak service's confirmed last-active date also contribute to the weekly strip; check-ins are explicitly labelled.
- Starting a task saves `In Progress`, never `Completed`. Timers keep a wall-clock deadline across refreshes and navigation. Completing a focus block records actual elapsed segments; task completion remains explicit. The legacy progress API's incidental task-status change is reconciled back to the freshly read task statuses, with a recoverable warning if that save fails. Its API has no idempotency token, so unconfirmed progress writes are not automatically retried.
- Schedule writes use the user-scoped custom schedule API, check for intervening edits, and require a confirmed response. Tomorrow's tasks retain their time and ordering with `scheduled_date`; the dashboard separates them from today's work. Reflection and timetable generation require explicit actions.
- Within the V3 study shell, zero-minute background sync requests are suppressed: the legacy endpoint otherwise interprets zero as a 25-minute study session. Cloud reads and genuine study writes remain intact. V1, V2 and shared backend files are unchanged.
- VM checks: `node --test src/v3/study/tests/dailyStudy.test.mjs` and `node src/v3/study/tests/dashboard.browser.cjs`. Browser write tests are isolated fixtures against deployed V3 assets; real production API checks are read-only. No live student data should be modified for verification.
