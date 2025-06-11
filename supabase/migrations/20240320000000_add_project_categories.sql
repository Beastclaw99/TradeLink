-- Create enum for category status
CREATE TYPE category_status_enum AS ENUM ('active', 'inactive', 'archived');

-- Create project_categories table
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.project_categories(id),
    status category_status_enum DEFAULT 'active',
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    CONSTRAINT project_categories_name_length CHECK (char_length(name) >= 2),
    CONSTRAINT project_categories_display_order_positive CHECK (display_order >= 0)
);

-- Add RLS policies
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

-- Policy for viewing categories (everyone can view active categories)
CREATE POLICY "Anyone can view active categories"
    ON public.project_categories
    FOR SELECT
    USING (status = 'active');

-- Policy for admins to manage categories
CREATE POLICY "Admins can manage categories"
    ON public.project_categories
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.admin_permissions @> ARRAY['manage_categories']::text[]
        )
    );

-- Create index for faster lookups
CREATE INDEX idx_project_categories_parent_id ON public.project_categories(parent_id);
CREATE INDEX idx_project_categories_status ON public.project_categories(status);
CREATE INDEX idx_project_categories_display_order ON public.project_categories(display_order);
CREATE INDEX idx_project_categories_name ON public.project_categories(name);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_categories_updated_at
    BEFORE UPDATE ON public.project_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert categories based on frontend usage
INSERT INTO public.project_categories (name, description, display_order)
VALUES 
    ('Plumbing', 'Plumbing and water system related projects', 1),
    ('Electrical', 'Electrical system installation and repair', 2),
    ('Carpentry', 'Woodworking and structural projects', 3),
    ('Masonry', 'Brick, stone, and concrete work', 4),
    ('Painting', 'Interior and exterior painting projects', 5),
    ('Roofing', 'Roof installation, repair, and maintenance', 6),
    ('Landscaping', 'Garden and outdoor space projects', 7),
    ('HVAC', 'Heating, ventilation, and air conditioning', 8),
    ('Tile Work', 'Tile installation and repair', 9),
    ('Flooring', 'Floor installation and repair', 10),
    ('General Renovation', 'General construction and renovation projects', 11),
    ('Construction', 'New building construction projects', 12),
    ('Interior Design', 'Interior space design and decoration', 13);

-- Add comment to table
COMMENT ON TABLE public.project_categories IS 'Stores project categories and their hierarchy';

-- Create a function to handle category updates
CREATE OR REPLACE FUNCTION handle_category_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the category in projects table if the name changes
    IF OLD.name != NEW.name THEN
        UPDATE public.projects
        SET category = NEW.name
        WHERE category = OLD.name;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for category updates
CREATE TRIGGER update_project_categories
    AFTER UPDATE ON public.project_categories
    FOR EACH ROW
    EXECUTE FUNCTION handle_category_update();

-- Add foreign key to projects table
ALTER TABLE public.projects
ADD CONSTRAINT fk_project_category
FOREIGN KEY (category)
REFERENCES public.project_categories(name)
ON DELETE SET NULL;

-- Create a rollback function
CREATE OR REPLACE FUNCTION rollback_project_categories()
RETURNS void AS $$
BEGIN
    -- Remove the foreign key constraint
    ALTER TABLE public.projects
    DROP CONSTRAINT IF EXISTS fk_project_category;

    -- Drop the triggers
    DROP TRIGGER IF EXISTS update_project_categories ON public.project_categories;
    DROP TRIGGER IF EXISTS update_project_categories_updated_at ON public.project_categories;

    -- Drop the functions
    DROP FUNCTION IF EXISTS handle_category_update();
    DROP FUNCTION IF EXISTS update_updated_at_column();

    -- Drop the table
    DROP TABLE IF EXISTS public.project_categories;

    -- Drop the enum
    DROP TYPE IF EXISTS category_status_enum;
END;
$$ language 'plpgsql'; 