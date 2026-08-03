-- Post views/likes counters (P3). Public read; writes only via security-definer RPCs.

create table if not exists public.post_views (
  slug text primary key,
  views bigint not null default 0
);

create table if not exists public.post_likes (
  slug text primary key,
  likes bigint not null default 0
);

alter table public.post_views enable row level security;
alter table public.post_likes enable row level security;

create policy "post_views are publicly readable"
  on public.post_views for select
  using (true);

create policy "post_likes are publicly readable"
  on public.post_likes for select
  using (true);

create or replace function public.increment_post_view(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  insert into public.post_views (slug, views)
  values (p_slug, 1)
  on conflict (slug) do update set views = post_views.views + 1
  returning views into new_views;
  return new_views;
end;
$$;

create or replace function public.add_post_likes(p_slug text, p_count integer)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  clamped integer;
  new_likes bigint;
begin
  clamped := greatest(0, least(p_count, 3));
  insert into public.post_likes (slug, likes)
  values (p_slug, clamped)
  on conflict (slug) do update set likes = post_likes.likes + clamped
  returning likes into new_likes;
  return new_likes;
end;
$$;

revoke all on function public.increment_post_view(text) from public;
revoke all on function public.add_post_likes(text, integer) from public;
grant execute on function public.increment_post_view(text) to anon, authenticated;
grant execute on function public.add_post_likes(text, integer) to anon, authenticated;
