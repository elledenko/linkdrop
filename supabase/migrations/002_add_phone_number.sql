-- Add phone number and SMS fields to profiles
ALTER TABLE public.profiles ADD COLUMN phone_number TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN sms_enabled BOOLEAN DEFAULT false;

-- Index for fast webhook lookups by phone number
CREATE INDEX idx_profiles_phone ON public.profiles(phone_number) WHERE phone_number IS NOT NULL;
