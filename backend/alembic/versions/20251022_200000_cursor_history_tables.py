"""Create Cursor AI history tables

Revision ID: 20251022_200000
Revises: 20251020_999999_merge_all_heads_final
Create Date: 2025-10-22 20:00:00.000000

Таблицы для хранения полной истории взаимодействия с Cursor AI:
- cursor_chat_messages: все сообщения в чатах (bubbles)
- cursor_composer_sessions: сессии Composer (Ctrl+K)
- cursor_checkpoints: снапшоты состояния
- cursor_request_contexts: полные контексты запросов (опционально, тяжёлые)
- cursor_code_diffs: изменения кода
- cursor_import_history: метаданные импортов
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, BIGINT

# revision identifiers, used by Alembic.
revision = '20251022_200000'
down_revision = '20251020_999999_merge_all_heads_final'
branch_labels = None
depends_on = None


def upgrade():
    # 1. cursor_chat_messages
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_chat_messages (
            id UUID PRIMARY KEY,
            bubble_id VARCHAR(64) NOT NULL UNIQUE,
            checkpoint_id VARCHAR(64),
            message_type INTEGER NOT NULL,
            text TEXT,
            rich_text JSONB,
            created_at TIMESTAMP NOT NULL,
            
            -- Model/tokens metadata
            model_info JSONB,
            token_count JSONB,
            
            -- Attached resources
            attached_code_chunks JSONB,
            relevant_files JSONB,
            suggested_code_blocks JSONB,
            assistant_suggested_diffs JSONB,
            
            -- Context
            codebase_context_chunks JSONB,
            recently_viewed_files JSONB,
            cursor_rules JSONB,
            
            -- Flags
            is_agentic BOOLEAN DEFAULT FALSE,
            use_web BOOLEAN DEFAULT FALSE,
            is_nudge BOOLEAN DEFAULT FALSE,
            
            -- Service
            raw_data JSONB,
            imported_at TIMESTAMP DEFAULT NOW(),
            workspace_hash VARCHAR(64)
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_messages_bubble ON cursor_chat_messages(bubble_id);
        CREATE INDEX IF NOT EXISTS idx_cursor_messages_created ON cursor_chat_messages(created_at);
        CREATE INDEX IF NOT EXISTS idx_cursor_messages_workspace ON cursor_chat_messages(workspace_hash, created_at);
    """)
    
    # 2. cursor_composer_sessions
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_composer_sessions (
            id UUID PRIMARY KEY,
            composer_id VARCHAR(64) NOT NULL UNIQUE,
            text TEXT,
            rich_text JSONB,
            status VARCHAR(32),
            has_loaded BOOLEAN DEFAULT FALSE,
            
            -- Context and dialog
            full_conversation_headers_only JSONB,
            conversation_map JSONB,
            context JSONB,
            
            -- Generated code
            code_block_data JSONB,
            original_file_states JSONB,
            newly_created_files JSONB,
            generating_bubble_ids JSONB,
            
            -- Git
            git_graph_file_suggestions JSONB,
            
            -- Service
            raw_data JSONB,
            imported_at TIMESTAMP DEFAULT NOW(),
            workspace_hash VARCHAR(64)
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_composers_id ON cursor_composer_sessions(composer_id);
        CREATE INDEX IF NOT EXISTS idx_cursor_composers_workspace ON cursor_composer_sessions(workspace_hash);
    """)
    
    # 3. cursor_checkpoints
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_checkpoints (
            id UUID PRIMARY KEY,
            checkpoint_id VARCHAR(64) NOT NULL UNIQUE,
            
            -- File states
            files JSONB,
            non_existent_files JSONB,
            newly_created_folders JSONB,
            
            -- Active diffs
            active_inline_diffs JSONB,
            inline_diff_newly_created_resources JSONB,
            
            -- Service
            raw_data JSONB,
            imported_at TIMESTAMP DEFAULT NOW(),
            workspace_hash VARCHAR(64)
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_checkpoints_id ON cursor_checkpoints(checkpoint_id);
        CREATE INDEX IF NOT EXISTS idx_cursor_checkpoints_workspace ON cursor_checkpoints(workspace_hash);
    """)
    
    # 4. cursor_code_diffs
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_code_diffs (
            id UUID PRIMARY KEY,
            diff_key VARCHAR(128) NOT NULL,
            diff_data JSONB NOT NULL,
            
            -- Service
            imported_at TIMESTAMP DEFAULT NOW(),
            workspace_hash VARCHAR(64)
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_diffs_key ON cursor_code_diffs(diff_key);
        CREATE INDEX IF NOT EXISTS idx_cursor_diffs_workspace ON cursor_code_diffs(workspace_hash);
    """)
    
    # 5. cursor_request_contexts
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_request_contexts (
            id UUID PRIMARY KEY,
            context_key VARCHAR(256) NOT NULL UNIQUE,
            size_bytes BIGINT NOT NULL,
            
            -- Context data (optional - large)
            context_data JSONB,
            
            -- Metadata (always imported)
            multi_file_linter_errors JSONB,
            terminal_files JSONB,
            cursor_rules JSONB,
            todos JSONB,
            project_layouts JSONB,
            
            -- Service
            imported_at TIMESTAMP DEFAULT NOW(),
            workspace_hash VARCHAR(64),
            import_full_context BOOLEAN DEFAULT FALSE
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_contexts_key ON cursor_request_contexts(context_key);
        CREATE INDEX IF NOT EXISTS idx_cursor_contexts_workspace ON cursor_request_contexts(workspace_hash);
    """)
    
    # 6. cursor_import_history
    op.execute("""
        CREATE TABLE IF NOT EXISTS cursor_import_history (
            id UUID PRIMARY KEY,
            workspace_hash VARCHAR(64) NOT NULL,
            workspace_path TEXT,
            import_started_at TIMESTAMP NOT NULL,
            import_finished_at TIMESTAMP,
            status VARCHAR(20) DEFAULT 'pending',
            
            -- Import stats
            messages_imported INTEGER DEFAULT 0,
            composers_imported INTEGER DEFAULT 0,
            checkpoints_imported INTEGER DEFAULT 0,
            diffs_imported INTEGER DEFAULT 0,
            contexts_imported INTEGER DEFAULT 0,
            
            total_size_mb NUMERIC(10, 2),
            error_message TEXT,
            metadata JSONB
        );
        
        CREATE INDEX IF NOT EXISTS idx_cursor_imports_hash ON cursor_import_history(workspace_hash);
    """)


def downgrade():
    op.execute("DROP TABLE IF EXISTS cursor_import_history CASCADE;")
    op.execute("DROP TABLE IF EXISTS cursor_request_contexts CASCADE;")
    op.execute("DROP TABLE IF EXISTS cursor_code_diffs CASCADE;")
    op.execute("DROP TABLE IF EXISTS cursor_checkpoints CASCADE;")
    op.execute("DROP TABLE IF EXISTS cursor_composer_sessions CASCADE;")
    op.execute("DROP TABLE IF EXISTS cursor_chat_messages CASCADE;")

