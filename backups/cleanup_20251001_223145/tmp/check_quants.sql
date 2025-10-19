-- Check quants and MV counts
select count(*) as quants_count from quants;
select to_regclass('public.quant_rank_mv') is not null as mv_exists;
select case when to_regclass('public.quant_rank_mv') is not null then (select count(*) from quant_rank_mv) else -1 end as mv_count;

