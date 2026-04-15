-- Storage Buckets for Clarios
-- April 2026

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Bucket for captured room photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('space-images', 'space-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for AI-annotated photos with circles/labels
INSERT INTO storage.buckets (id, name, public)
VALUES ('annotated-images', 'annotated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for before/after SVG diagrams
INSERT INTO storage.buckets (id, name, public)
VALUES ('diagrams', 'diagrams', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Allow authenticated users to upload to space-images
CREATE POLICY "Users can upload space images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'space-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own space images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'space-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own space images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'space-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to upload annotated images
CREATE POLICY "Users can upload annotated images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'annotated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own annotated images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'annotated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to upload diagrams
CREATE POLICY "Users can upload diagrams"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'diagrams'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own diagrams"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'diagrams'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read access for all buckets (images are served publicly)
CREATE POLICY "Public access to space images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'space-images');

CREATE POLICY "Public access to annotated images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'annotated-images');

CREATE POLICY "Public access to diagrams"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diagrams');
