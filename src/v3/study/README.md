# V3 study layer

V3 owns the pages and components in this directory. They were recreated from the V1 study experience to preserve its layout and behavior without importing V1 page/component implementations or redirecting users to V1.

All navigation is handled by the `/v3` router. Login and signup default to `/v3/dashboard`; protected study URLs resume after login. The existing authentication, API client, Supabase connection, syllabus data, and non-UI utilities remain shared platform services so existing accounts and study progress continue to work.

`study.css` scopes the dashboard design tokens and effects to `.v3-study`. The local theme adapter follows V3's existing atmosphere preference without changing the document theme or the public landing/auth screens.

Study pages are loaded on demand. Deploy the V3 build only; V1, V2, and the running API do not need rebuilding or restarting.
