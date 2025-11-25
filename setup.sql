
-- SQL script for setting up the Scentify database in Supabase.
-- IMPORTANT: You must run this entire script in your Supabase project's SQL Editor
-- to apply the new security policies for the admin section.

-- Drop existing tables in reverse order of dependency to ensure a clean slate.
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.contact_messages;
DROP TABLE IF EXISTS public.newsletter_subscriptions;

-- 1. Create the 'categories' table with an image_url column
CREATE TABLE public.categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- 2. Create the 'products' table
create table public.products (
  id bigint generated always as identity not null,
  name text not null,
  brand text not null,
  description text null,
  price numeric(10, 2) not null,
  image_url text null,
  category_id bigint null,
  stock integer not null default 100,
  notes_top text null,
  notes_middle text null,
  notes_base text null,
  created_at timestamp with time zone null default now(),
  zoho_item_id text null,
  zoho_raw jsonb null,
  constraint products_pkey primary key (id),
  constraint products_zoho_item_id_key unique (zoho_item_id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id)
) TABLESPACE pg_default;

-- 3. Create 'contact_messages' table
CREATE TABLE public.contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'newsletter_subscriptions' table
CREATE TABLE public.newsletter_subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) for all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for public read/insert access
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- 7. NEW: Create policies for authenticated users (admins) to manage products
-- In a production app, you would check for a specific admin role, e.g., `(auth.uid() IN (SELECT user_id FROM admin_users))`
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);


-- 8. Insert new, realistic data into 'categories' with new working image URLs from Unsplash
INSERT INTO categories (name, description, image_url) VALUES
('Floral', 'Scents derived from flowers, ranging from single notes to complex bouquets.', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'),
('Woody', 'Warm and opulent scents with notes like sandalwood, cedar, and patchouli.', 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800'),
('Fresh', 'Clean, bright scents featuring citrus, green, and aquatic notes.', 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'),
('Oriental', 'Rich and sensual scents with notes of spice, vanilla, and resins.', 'https://images.unsplash.com/photo-1605522466906-614074f31540?auto=format&fit=crop&q=80&w=800');

-- 9. Insert new, realistic product data with new working image URLs from Unsplash
INSERT INTO products (name, brand, description, price, image_url, category_id, notes_top, notes_middle, notes_base) VALUES
(
  'Sauvage Eau de Parfum', 
  'Dior', 
  'A radically fresh composition, dictated by a name that has the ring of a manifesto. A raw and noble fragrance all at once.', 
  11500.00, 
  'https://images.unsplash.com/photo-1523293188086-b520e5409286?auto=format&fit=crop&q=80&w=800', 
  3, 
  'Bergamot, Sichuan Pepper', 
  'Lavender, Star Anise', 
  'Ambroxan, Vanilla'
),
(
  'Tobacco Vanille', 
  'Tom Ford', 
  'A modern take on an old-world men''s club. A smooth, oriental scent featuring creamy tonka bean, vanilla, cocoa, and sweet wood sap.', 
  24500.00, 
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', 
  4, 
  'Tobacco Leaf, Spicy Notes', 
  'Vanilla, Cacao, Tonka Bean', 
  'Dried Fruits, Woody Notes'
),
(
  'Peony & Blush Suede Cologne', 
  'Jo Malone London', 
  'The essence of charm. Peonies in voluptuous bloom, exquisitely fragile. Flirtatious with the juicy bite of red apple and the opulence of jasmine, rose and gillyflower.', 
  12800.00, 
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800', 
  1, 
  'Red Apple', 
  'Peony, Jasmine, Rose', 
  'Suede'
),
(
  'Aventus', 
  'Creed', 
  'A sophisticated blend for individuals who savor a life well-lived. It opens with tantalizing top notes of blackcurrant and Italian bergamot.', 
  34000.00, 
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', 
  2, 
  'Bergamot, Blackcurrant, Pineapple', 
  'Juniper Berries, Birch, Patchouli', 
  'Musk, Oakmoss, Ambergris'
),
(
  'Light Blue Eau de Toilette',
  'Dolce&Gabbana',
  'A casual and breezy, sparkling fruity-floral scent that evokes the spirit of the Sicilian summer.',
  9200.00,
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800',
  3,
  'Sicilian Lemon, Apple, Cedar',
  'Bamboo, Jasmine, White Rose',
  'Amber, Musk'
),
(
  'Good Girl Eau de Parfum',
  'Carolina Herrera',
  'A bold and sophisticated fragrance, with an audacious blend of dark and light elements. For the woman who loves her good side and celebrates her bad side.',
  10500.00,
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
  4,
  'Almond, Coffee, Bergamot',
  'Tuberose, Jasmine Sambac',
  'Tonka Bean, Cacao, Vanilla'
),
(
  'Miss Dior Eau de Parfum',
  'Dior',
  'A colorful floral bouquet, like a "millefiori" in which notes of Grasse Rose, Peony, Iris and Lily-of-the-Valley come alive.',
  13500.00,
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
  1,
  'Lily-of-the-Valley, Peony',
  'Centifolia Rose, Iris',
  'Tonka Bean, Musk, Sandalwood'
),
(
  'Bleu de Chanel',
  'Chanel',
  'An aromatic-woody fragrance with ambery and musky notes. A timeless scent housed in a bottle of a deep and mysterious blue.',
  12500.00,
  'https://images.unsplash.com/photo-1523293188086-b520e5409286?auto=format&fit=crop&q=80&w=800',
  2,
  'Grapefruit, Lemon, Mint',
  'Ginger, Nutmeg, Jasmine',
  'Sandalwood, Cedar, Incense'
);
