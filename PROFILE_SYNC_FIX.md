# Profile sync fix

The current Supabase `profiles` table contains only `user_id` and `custom_tags`.
This fix does **not** add, alter, or remove database columns.

Profile UI data (`displayName`, `avatarDataUrl`, `tagline`, custom violations and emotions) is stored in the authenticated user's `user_metadata.tradeedge_profile`.

The `profiles.custom_tags` column continues to be used for custom tags.
