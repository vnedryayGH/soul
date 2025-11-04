COPY (
  SELECT json_build_object(
    'from_id', from_quant_id::text,
    'to_id', to_quant_id::text,
    'strength', connection_strength,
    'ko', keyword_overlap
  )::text
  FROM quant_connections
) TO '/tmp/quant_connections_rows.jsonl';
