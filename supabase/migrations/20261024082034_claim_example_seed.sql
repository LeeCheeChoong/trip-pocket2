-- Lets exactly one browser tab/device seed the example trips for an account.
create or replace function public.claim_example_seed() returns boolean
language plpgsql security invoker set search_path = '' as $$
declare claimed boolean;
begin
  insert into public.prefs (user_id) values ((select auth.uid())) on conflict (user_id) do nothing;
  update public.prefs set example_seeded = true
    where user_id = (select auth.uid()) and example_seeded = false
    returning true into claimed;
  return coalesce(claimed, false);
end $$;
revoke execute on function public.claim_example_seed() from public, anon;
grant execute on function public.claim_example_seed() to authenticated;
