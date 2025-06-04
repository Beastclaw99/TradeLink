-- Create error logging table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operation TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    error_message TEXT NOT NULL,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view error logs
CREATE POLICY "Only admins can view error logs"
    ON public.error_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    );

-- Function to handle project creation with transaction
CREATE OR REPLACE FUNCTION public.create_project_with_milestones(
    project_data JSONB,
    milestones_data JSONB[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_project_id UUID;
    milestone_record JSONB;
BEGIN
    -- Start transaction
    BEGIN
        -- Insert project
        INSERT INTO public.projects (
            title,
            description,
            client_id,
            status,
            budget,
            start_date,
            end_date,
            location,
            category,
            priority,
            metadata
        )
        VALUES (
            project_data->>'title',
            project_data->>'description',
            (project_data->>'client_id')::UUID,
            COALESCE(project_data->>'status', 'pending'),
            (project_data->>'budget')::DECIMAL,
            (project_data->>'start_date')::TIMESTAMPTZ,
            (project_data->>'end_date')::TIMESTAMPTZ,
            project_data->>'location',
            project_data->>'category',
            COALESCE(project_data->>'priority', 'medium'),
            project_data->'metadata'
        )
        RETURNING id INTO new_project_id;

        -- Insert milestones
        FOREACH milestone_record IN ARRAY milestones_data
        LOOP
            INSERT INTO public.milestones (
                project_id,
                title,
                description,
                due_date,
                status,
                order_index,
                metadata
            )
            VALUES (
                new_project_id,
                milestone_record->>'title',
                milestone_record->>'description',
                (milestone_record->>'due_date')::TIMESTAMPTZ,
                COALESCE(milestone_record->>'status', 'pending'),
                (milestone_record->>'order_index')::INTEGER,
                milestone_record->'metadata'
            );
        END LOOP;

        -- Commit transaction
        RETURN new_project_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Log error
            INSERT INTO public.error_logs (
                operation,
                table_name,
                record_id,
                error_message,
                error_details
            )
            VALUES (
                'create_project_with_milestones',
                'projects',
                new_project_id,
                SQLERRM,
                jsonb_build_object(
                    'project_data', project_data,
                    'milestones_data', milestones_data,
                    'error_code', SQLSTATE
                )
            );
            
            -- Re-raise the error
            RAISE;
    END;
END;
$$;

-- Function to handle milestone updates with transaction
CREATE OR REPLACE FUNCTION public.update_milestone_with_deliverables(
    milestone_id UUID,
    milestone_data JSONB,
    deliverables_data JSONB[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    project_id UUID;
BEGIN
    -- Start transaction
    BEGIN
        -- Get project_id for the milestone
        SELECT m.project_id INTO project_id
        FROM public.milestones m
        WHERE m.id = milestone_id;

        -- Update milestone
        UPDATE public.milestones
        SET
            title = milestone_data->>'title',
            description = milestone_data->>'description',
            due_date = (milestone_data->>'due_date')::TIMESTAMPTZ,
            status = milestone_data->>'status',
            order_index = (milestone_data->>'order_index')::INTEGER,
            metadata = milestone_data->'metadata',
            updated_at = now()
        WHERE id = milestone_id;

        -- Delete existing deliverables
        DELETE FROM public.deliverables
        WHERE milestone_id = milestone_id;

        -- Insert new deliverables
        FOREACH deliverable_record IN ARRAY deliverables_data
        LOOP
            INSERT INTO public.deliverables (
                milestone_id,
                title,
                description,
                status,
                file_url,
                file_name,
                metadata
            )
            VALUES (
                milestone_id,
                deliverable_record->>'title',
                deliverable_record->>'description',
                COALESCE(deliverable_record->>'status', 'pending'),
                deliverable_record->>'file_url',
                deliverable_record->>'file_name',
                deliverable_record->'metadata'
            );
        END LOOP;

        -- Commit transaction
        RETURN true;
    EXCEPTION
        WHEN OTHERS THEN
            -- Log error
            INSERT INTO public.error_logs (
                operation,
                table_name,
                record_id,
                error_message,
                error_details
            )
            VALUES (
                'update_milestone_with_deliverables',
                'milestones',
                milestone_id,
                SQLERRM,
                jsonb_build_object(
                    'milestone_data', milestone_data,
                    'deliverables_data', deliverables_data,
                    'project_id', project_id,
                    'error_code', SQLSTATE
                )
            );
            
            -- Re-raise the error
            RAISE;
    END;
END;
$$;

-- Function to handle project deletion with cleanup
CREATE OR REPLACE FUNCTION public.delete_project_with_cleanup(
    project_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    file_urls TEXT[];
BEGIN
    -- Start transaction
    BEGIN
        -- Collect all file URLs
        SELECT array_agg(file_url)
        INTO file_urls
        FROM public.deliverables
        WHERE milestone_id IN (
            SELECT id FROM public.milestones
            WHERE project_id = delete_project_with_cleanup.project_id
        );

        -- Delete project (cascade will handle related records)
        DELETE FROM public.projects
        WHERE id = project_id;

        -- Delete associated files from storage
        IF file_urls IS NOT NULL THEN
            FOREACH file_url IN ARRAY file_urls
            LOOP
                DELETE FROM storage.objects
                WHERE name = file_url;
            END LOOP;
        END IF;

        -- Commit transaction
        RETURN true;
    EXCEPTION
        WHEN OTHERS THEN
            -- Log error
            INSERT INTO public.error_logs (
                operation,
                table_name,
                record_id,
                error_message,
                error_details
            )
            VALUES (
                'delete_project_with_cleanup',
                'projects',
                project_id,
                SQLERRM,
                jsonb_build_object(
                    'file_urls', file_urls,
                    'error_code', SQLSTATE
                )
            );
            
            -- Re-raise the error
            RAISE;
    END;
END;
$$; 