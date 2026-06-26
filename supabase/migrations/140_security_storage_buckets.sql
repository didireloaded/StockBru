-- 140_security_storage_buckets.sql

-- Insert dedicated storage buckets as outlined in blueprint
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('brand-logos', 'brand-logos', true),
('company-logos', 'company-logos', true),
('branch-images', 'branch-images', true),
('user-avatars', 'user-avatars', true),
('reports', 'reports', false),
('exports', 'exports', false),
('imports', 'imports', false),
('backups', 'backups', false),
('documents', 'documents', false),
('supplier-files', 'supplier-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy for images
CREATE POLICY "Public Read Images" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'brand-logos', 'company-logos', 'branch-images', 'user-avatars'));
