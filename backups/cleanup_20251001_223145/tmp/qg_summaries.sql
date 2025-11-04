-- Tags summary
select count(*) filter (where tags is not null) as with_tags, count(*) as total from public.quantum_goals;

-- Source/Status breakdown
select coalesce(source,'unknown') as source, coalesce(status,'unknown') as status, count(*)
from public.quantum_goals
group by 1,2
order by 1,2;

