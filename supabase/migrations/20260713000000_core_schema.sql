-- Create custom enums
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'cancelled', 'past_due', 'unpaid');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 1. Profiles Table (Linked to Supabase Auth Users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    premium_badge BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Industries Table
CREATE TABLE public.industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Creator Sizes Table
CREATE TABLE public.creator_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE, -- e.g., Nano (1k-10k), Micro (10k-50k)
    min_range INT NOT NULL,
    max_range INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Companies Table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website TEXT NOT NULL,
    industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
    country TEXT,
    description TEXT,
    affiliate_program BOOLEAN DEFAULT FALSE NOT NULL,
    creator_program BOOLEAN DEFAULT FALSE NOT NULL,
    application_url TEXT,
    public_partnership_url TEXT,
    popularity_score INT DEFAULT 0 NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0.00,
    verification_status verification_status DEFAULT 'pending'::verification_status NOT NULL,
    ai_summary TEXT,
    search_vector TSVECTOR,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Many-to-Many Mappings
CREATE TABLE public.company_categories (
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, category_id)
);

CREATE TABLE public.company_creator_sizes (
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    creator_size_id UUID REFERENCES public.creator_sizes(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, creator_size_id)
);

-- 6. Campaign Examples Table
CREATE TABLE public.campaign_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    video_url TEXT NOT NULL,
    title TEXT,
    published_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Subscriptions Table (PayPal Linked)
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    paypal_subscription_id TEXT UNIQUE,
    status subscription_status NOT NULL,
    plan_id TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Favorites Table
CREATE TABLE public.favorites (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, company_id)
);

-- 9. Saved Searches Table
CREATE TABLE public.saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Audit Logs Table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

---
--- DATABASE TRIGGERS & FUNCTIONS
---

-- Automatic tsvector update for full-text search
CREATE OR REPLACE FUNCTION companies_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION companies_tsvector_trigger();

-- Setup Profile Routing via DB Trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Creative User'),
    new.raw_user_meta_data->>'avatar_url',
    'user'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

---
--- ROW LEVEL SECURITY (RLS) POLICIES
---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles 
  FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Companies are viewable by verified users" ON public.companies 
  FOR SELECT USING (true);
CREATE POLICY "Only admins/mods can modify companies" ON public.companies 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'moderator')
    )
  );

-- Favorites Policies
CREATE POLICY "Users can manage their own favorites" ON public.favorites 
  FOR ALL USING (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can track their own subscription status" ON public.subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for lightning-fast search & query lookups
CREATE INDEX idx_companies_search ON public.companies USING gin(search_vector);
CREATE INDEX idx_companies_industry ON public.companies(industry_id);
CREATE INDEX idx_companies_popularity ON public.companies(popularity_score DESC);
