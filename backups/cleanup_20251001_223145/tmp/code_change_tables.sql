CREATE TABLE IF NOT EXISTS code_change_locks (
  id SERIAL PRIMARY KEY,
  file_path VARCHAR(512) NOT NULL,
  holder VARCHAR(100) NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT now(),
  expires_at TIMESTAMP NULL,
  meta JSONB NULL,
  etag VARCHAR(80) NULL
);
CREATE INDEX IF NOT EXISTS idx_code_change_locks_file ON code_change_locks(file_path);
CREATE INDEX IF NOT EXISTS idx_code_change_locks_expires ON code_change_locks(expires_at);

CREATE TABLE IF NOT EXISTS code_change_queue (
  id SERIAL PRIMARY KEY,
  file_path VARCHAR(512) NOT NULL,
  developer VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  payload JSONB NULL,
  etag VARCHAR(80) NULL
);
CREATE INDEX IF NOT EXISTS idx_code_change_queue_file ON code_change_queue(file_path);
CREATE INDEX IF NOT EXISTS idx_code_change_queue_status ON code_change_queue(status);


