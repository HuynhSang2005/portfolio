-- Metric writes chỉ qua service role (server Route Handlers).
-- Client anon/authenticated không còn gọi trực tiếp RPC increment được —
-- mọi ghi đi qua Next.js routes (cookie clamp + slug validation).
-- Cần SUPABASE_SERVICE_ROLE_KEY trong env trước khi apply (xem docs/deploy.md).

revoke execute on function public.increment_post_view(text) from anon, authenticated;
revoke execute on function public.add_post_likes(text, integer) from anon, authenticated;

grant execute on function public.increment_post_view(text) to service_role;
grant execute on function public.add_post_likes(text, integer) to service_role;
