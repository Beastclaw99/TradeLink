-- Add review moderation fields
ALTER TABLE reviews
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reported')),
ADD COLUMN reported_at timestamp with time zone,
ADD COLUMN reported_by uuid REFERENCES profiles(id),
ADD COLUMN report_reason text,
ADD COLUMN moderated_at timestamp with time zone,
ADD COLUMN moderated_by uuid REFERENCES profiles(id),
ADD COLUMN moderation_notes text;

-- Add category-specific ratings
ALTER TABLE reviews
ADD COLUMN communication_rating integer CHECK (communication_rating BETWEEN 1 AND 5),
ADD COLUMN quality_rating integer CHECK (quality_rating BETWEEN 1 AND 5),
ADD COLUMN timeliness_rating integer CHECK (timeliness_rating BETWEEN 1 AND 5),
ADD COLUMN professionalism_rating integer CHECK (professionalism_rating BETWEEN 1 AND 5);

-- Add review helpfulness and responses
CREATE TABLE review_helpfulness (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id),
    is_helpful boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(review_id, user_id)
);

CREATE TABLE review_responses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id uuid REFERENCES profiles(id),
    response_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add review verification
ALTER TABLE reviews
ADD COLUMN is_verified boolean DEFAULT false,
ADD COLUMN verification_method text CHECK (verification_method IN ('project_completion', 'payment_confirmation', 'admin_verified'));

-- Create indexes for better query performance
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_review_helpfulness_review ON review_helpfulness(review_id);
CREATE INDEX idx_review_responses_review ON review_responses(review_id);

-- Add RLS policies
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- Review helpfulness policies
CREATE POLICY "Users can view review helpfulness"
    ON review_helpfulness FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can mark reviews as helpful"
    ON review_helpfulness FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own helpfulness votes"
    ON review_helpfulness FOR UPDATE
    USING (auth.uid() = user_id);

-- Review responses policies
CREATE POLICY "Users can view review responses"
    ON review_responses FOR SELECT
    USING (true);

CREATE POLICY "Review recipients can respond to reviews"
    ON review_responses FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM reviews r
            WHERE r.id = review_id
            AND (
                (r.client_id = auth.uid() AND r.professional_id = responder_id) OR
                (r.professional_id = auth.uid() AND r.client_id = responder_id)
            )
        )
    );

CREATE POLICY "Users can update their own responses"
    ON review_responses FOR UPDATE
    USING (auth.uid() = responder_id); 