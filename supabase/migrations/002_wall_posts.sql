create table public.wall_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  photo_path text not null unique,
  caption text not null default '' check (char_length(caption) <= 280),
  created_at timestamptz not null default now(),
  check (split_part(photo_path, '/', 1) = author_id::text)
);

create index wall_posts_recent_idx on public.wall_posts (created_at desc, id desc);

alter table public.wall_posts enable row level security;
revoke all on public.wall_posts from anon, authenticated;
grant select on public.wall_posts to authenticated;
grant insert (photo_path, caption) on public.wall_posts to authenticated;

create policy "Signed-in users can read wall posts"
on public.wall_posts for select to authenticated using (true);

create policy "Users can publish their own wall photos"
on public.wall_posts for insert to authenticated
with check (author_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wall-photos', 'wall-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Users can upload wall photos to their folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'wall-photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "Signed-in users can read published wall photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'wall-photos'
  and exists (select 1 from public.wall_posts where photo_path = storage.objects.name)
);
