-- Nafsah — PostgreSQL schema for the day the storefront gets a backend.
--
-- Today the site is static: the catalogue, the Kuwait areas, the delivery
-- policy and the gift boxes are JavaScript modules in src/data, and carts,
-- gift options and reviews live in the visitor's browser. This schema mirrors
-- that data model one to one, so the modules can be generated from (or seeded
-- into) these tables without reshaping anything. db/README.md maps each table
-- to its source file.
--
-- Conventions
--   * Every enumerated value has a text id that matches src/data exactly
--     ('oud-musk', 'spray50', 'salmiya'), so URLs, carts and analytics keep
--     working across the move.
--   * Every customer-facing label is stored twice, *_en and *_ar.
--   * Money is integer fils (1 KWD = 1000 fils), never a float. Column names
--     end in _fils.
--   * Times are timestamptz; Kuwait is Asia/Kuwait (UTC+3, no daylight saving).
--
-- PostgreSQL 13 or later (gen_random_uuid() is built in from 13).

BEGIN;

-- ---------------------------------------------------------------------------
-- Kuwait geography  (src/data/kuwait.js)
-- ---------------------------------------------------------------------------

CREATE TABLE governorates (
  id          text PRIMARY KEY,                -- 'capital', 'hawalli', …
  name_en     text NOT NULL,
  name_ar     text NOT NULL,
  short_en    text,                            -- 'Al Asimah' inside an address line
  short_ar    text,
  sort_order  smallint NOT NULL UNIQUE
);

CREATE TABLE areas (
  id              text PRIMARY KEY,            -- 'salmiya', 'khiran', …
  governorate_id  text NOT NULL REFERENCES governorates (id),
  name_en         text NOT NULL,
  name_ar         text NOT NULL,
  -- Outlying areas: never same-day, delivery_policy.remote_extra_days later,
  -- plus delivery_policy.remote_surcharge_fils.
  remote          boolean NOT NULL DEFAULT false,
  UNIQUE (id, governorate_id)                  -- lets an address prove its area is in its governorate
);

CREATE INDEX areas_governorate_idx ON areas (governorate_id);

-- ---------------------------------------------------------------------------
-- Taxonomy  (src/data/taxonomy.js)
-- ---------------------------------------------------------------------------

CREATE TABLE fragrance_families (
  id          text PRIMARY KEY,                -- 'oud-musk', 'amber', 'rose', 'french-arabic', …
  name_en     text NOT NULL,
  name_ar     text NOT NULL,
  short_en    text NOT NULL,
  short_ar    text NOT NULL,
  blurb_en    text NOT NULL,
  blurb_ar    text NOT NULL,
  sort_order  smallint NOT NULL UNIQUE
);

CREATE TABLE concentrations (
  id             text PRIMARY KEY,             -- 'extrait', 'edp', 'edt', 'attar'
  name_en        text NOT NULL,
  name_ar        text NOT NULL,
  short_en       text NOT NULL,
  short_ar       text NOT NULL,
  abbr           text NOT NULL,                -- printed on the glass: 'EXTRAIT', 'EDP', 'EDT', 'ATTAR'
  oil_min_pct    smallint NOT NULL CHECK (oil_min_pct BETWEEN 0 AND 100),
  oil_max_pct    smallint NOT NULL CHECK (oil_max_pct BETWEEN 0 AND 100),
  sort_order     smallint NOT NULL UNIQUE,     -- strongest first
  CHECK (oil_min_pct <= oil_max_pct)
);

CREATE TABLE sillage_levels (
  id       text PRIMARY KEY,                   -- 'intimate', 'moderate', 'strong', 'beast'
  level    smallint NOT NULL UNIQUE CHECK (level BETWEEN 1 AND 4),
  name_en  text NOT NULL,
  name_ar  text NOT NULL
);

CREATE TABLE genders (
  id       text PRIMARY KEY,                   -- 'unisex', 'men', 'women'
  name_en  text NOT NULL,
  name_ar  text NOT NULL
);

CREATE TABLE seasons (
  id       text PRIMARY KEY,                   -- 'summer', 'winter'; both = all year
  name_en  text NOT NULL,
  name_ar  text NOT NULL
);

CREATE TABLE occasions (
  id       text PRIMARY KEY,                   -- 'diwaniya', 'office', 'wedding', 'everyday'
  name_en  text NOT NULL,
  name_ar  text NOT NULL
);

-- The size & sample toggle. A tola is 12 ml (11.66 g); a quarter tola 3 ml.
CREATE TABLE formats (
  id          text PRIMARY KEY,                -- 'full', 'spray50', 'tola', 'quarter-tola', 'sample'
  name_en     text NOT NULL,
  name_ar     text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('spray', 'oil', 'sample')),
  ml          numeric(5, 1) NOT NULL CHECK (ml > 0),
  try_first   boolean NOT NULL DEFAULT false, -- ships with a free 2 ml test vial of the same scent
  sort_order  smallint NOT NULL UNIQUE
);

CREATE TABLE heat_scale (
  value    smallint PRIMARY KEY CHECK (value BETWEEN 1 AND 5),
  name_en  text NOT NULL,                      -- 1 'Wilts in the heat' … 5 'Thrives at 45°C+'
  name_ar  text NOT NULL
);

-- ---------------------------------------------------------------------------
-- Notes  (src/data/notes.js)
-- ---------------------------------------------------------------------------

CREATE TABLE notes (
  id       text PRIMARY KEY,                   -- 'taif-rose', 'cambodi-oud', …
  name_en  text NOT NULL UNIQUE,
  name_ar  text NOT NULL UNIQUE,
  aliases  text[] NOT NULL DEFAULT '{}'        -- other spellings a shopper might search
);

-- ---------------------------------------------------------------------------
-- Products  (src/data/products.js)
-- ---------------------------------------------------------------------------

CREATE TABLE products (
  id                  text PRIMARY KEY,        -- 'oud-noir', 'ward-taifi', …
  catalogue_no        smallint NOT NULL UNIQUE CHECK (catalogue_no > 0),  -- shown as '01'
  name_en             text NOT NULL,
  name_ar             text NOT NULL,
  tagline_en          text NOT NULL,
  tagline_ar          text NOT NULL,
  description_en      text NOT NULL,
  description_ar      text NOT NULL,
  family_id           text NOT NULL REFERENCES fragrance_families (id),  -- the largest share in the profile
  concentration_id    text NOT NULL REFERENCES concentrations (id),      -- of the spray; oil formats are always attar
  gender_id           text NOT NULL REFERENCES genders (id),
  longevity_hours     numeric(4, 1) NOT NULL CHECK (longevity_hours > 0 AND longevity_hours <= 48),
  projection_sillage  text NOT NULL REFERENCES sillage_levels (id),
  heat_resistance     smallint NOT NULL REFERENCES heat_scale (value),   -- 1–5, in a 45°C Kuwaiti summer
  year                smallint NOT NULL CHECK (year BETWEEN 1974 AND 2100),
  bestseller          boolean NOT NULL DEFAULT false,
  is_new              boolean NOT NULL DEFAULT false,
  palette             jsonb NOT NULL,          -- { from, via, to, glass } for <BottleVisual />
  active              boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_family_idx ON products (family_id);

-- familyProfile: integer percentages, 1–4 families, summing to 100.
CREATE TABLE product_family_profile (
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  family_id   text NOT NULL REFERENCES fragrance_families (id),
  share_pct   smallint NOT NULL CHECK (share_pct BETWEEN 1 AND 100),
  PRIMARY KEY (product_id, family_id)
);

-- The sum-to-100 rule spans rows, so it is checked once per transaction.
CREATE FUNCTION check_family_profile() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  pid text := COALESCE(NEW.product_id, OLD.product_id);
  total integer;
  n integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = pid) THEN
    RETURN NULL;                                -- the product itself was deleted
  END IF;
  SELECT COALESCE(sum(share_pct), 0), count(*) INTO total, n
    FROM product_family_profile WHERE product_id = pid;
  IF total <> 100 OR n NOT BETWEEN 1 AND 4 THEN
    RAISE EXCEPTION 'family profile of % must have 1–4 families summing to 100 (has % summing to %)', pid, n, total;
  END IF;
  RETURN NULL;
END $$;

CREATE CONSTRAINT TRIGGER product_family_profile_sums_to_100
  AFTER INSERT OR UPDATE OR DELETE ON product_family_profile
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION check_family_profile();

CREATE TABLE product_seasons (
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  season_id   text NOT NULL REFERENCES seasons (id),
  PRIMARY KEY (product_id, season_id)
);

CREATE TABLE product_occasions (
  product_id   text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  occasion_id  text NOT NULL REFERENCES occasions (id),
  PRIMARY KEY (product_id, occasion_id)
);

-- The pyramid. A note appears once per product, in one tier.
CREATE TABLE product_notes (
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  note_id     text NOT NULL REFERENCES notes (id),
  tier        text NOT NULL CHECK (tier IN ('top', 'heart', 'base')),
  position    smallint NOT NULL CHECK (position BETWEEN 1 AND 5),
  PRIMARY KEY (product_id, note_id),
  UNIQUE (product_id, tier, position)
);

-- What a fragrance is sold as, and for how much.
CREATE TABLE product_formats (
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  format_id   text NOT NULL REFERENCES formats (id),
  ml          numeric(5, 1) NOT NULL CHECK (ml > 0),
  price_fils  integer NOT NULL CHECK (price_fils > 0),
  active      boolean NOT NULL DEFAULT true,
  PRIMARY KEY (product_id, format_id)
);

-- 1–3 Gulf-style pairings per product. Bukhoor is named here; an attar or a
-- spray partner is another product in the catalogue.
CREATE TABLE layering_suggestions (
  id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id          text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  position            smallint NOT NULL CHECK (position BETWEEN 1 AND 3),
  kind                text NOT NULL CHECK (kind IN ('bukhoor', 'attar', 'spray')),
  partner_product_id  text REFERENCES products (id),
  name_en             text,
  name_ar             text,
  how_en              text NOT NULL,
  how_ar              text NOT NULL,
  UNIQUE (product_id, position),
  CHECK (
    (kind = 'bukhoor' AND partner_product_id IS NULL AND name_en IS NOT NULL AND name_ar IS NOT NULL)
    OR (kind <> 'bukhoor' AND partner_product_id IS NOT NULL AND partner_product_id <> product_id)
  )
);

-- ---------------------------------------------------------------------------
-- Gifting  (src/data/gifting.js)
-- ---------------------------------------------------------------------------

CREATE TABLE gift_boxes (
  id          text PRIMARY KEY,                -- 'signature', 'sadu', 'majlis'
  name_en     text NOT NULL,
  name_ar     text NOT NULL,
  blurb_en    text NOT NULL,
  blurb_ar    text NOT NULL,
  price_fils  integer NOT NULL CHECK (price_fils >= 0),   -- 0 = complimentary
  sort_order  smallint NOT NULL UNIQUE,
  active      boolean NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------------
-- Delivery policy  (src/data/delivery.js) — one row; every figure the copy
-- quotes ({threshold}, {cutoff}, {returnPeriod}…) comes from here.
-- ---------------------------------------------------------------------------

CREATE TABLE delivery_policy (
  id                     boolean PRIMARY KEY DEFAULT true CHECK (id),  -- exactly one row
  same_day_cutoff_hour   smallint NOT NULL CHECK (same_day_cutoff_hour BETWEEN 0 AND 23),
  no_delivery_weekdays   smallint[] NOT NULL DEFAULT '{5}',            -- 0 = Sunday … 5 = Friday
  shipping_fils          integer NOT NULL CHECK (shipping_fils >= 0),
  free_shipping_fils     integer NOT NULL CHECK (free_shipping_fils >= 0),  -- free when subtotal >= this
  remote_surcharge_fils  integer NOT NULL CHECK (remote_surcharge_fils >= 0),
  remote_extra_days      smallint NOT NULL CHECK (remote_extra_days >= 0),
  return_window_days     smallint NOT NULL CHECK (return_window_days > 0),
  gift_message_max       smallint NOT NULL DEFAULT 200 CHECK (gift_message_max > 0),
  CHECK (no_delivery_weekdays <@ ARRAY[0, 1, 2, 3, 4, 5, 6]::smallint[])
);

-- ---------------------------------------------------------------------------
-- Customers and addresses  (src/lib/address.js)
-- ---------------------------------------------------------------------------

CREATE TABLE customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL CHECK (btrim(full_name) <> ''),
  email       text NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- The 8 local digits, as normalizeMobile() stores them; shown as +965 9123 4567.
  mobile      text NOT NULL CHECK (mobile ~ '^[4569][0-9]{7}$'),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX customers_email_idx ON customers (lower(email));

-- A Kuwaiti address: governorate → area (or "other" + free text) → block
-- (قطعة) → street (شارع) → optional avenue (جادة) → building (مبنى / فيلا).
-- Used for a customer's own delivery and for a gift recipient's.
CREATE TABLE addresses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid REFERENCES customers (id) ON DELETE SET NULL,
  governorate_id  text NOT NULL REFERENCES governorates (id),
  area_id         text,
  area_other      text,
  block           text NOT NULL CHECK (block ~ '^[1-9][0-9]{0,2}$'),   -- 1–999, Latin digits
  street          text NOT NULL CHECK (btrim(street) <> ''),
  avenue          text,
  building        text NOT NULL CHECK (btrim(building) <> ''),
  building_type   text NOT NULL DEFAULT 'house' CHECK (building_type IN ('house', 'apartment')),
  floor           text,
  apartment       text,
  directions      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  -- Exactly one of a listed area or a typed one…
  CHECK ((area_id IS NULL) <> (area_other IS NULL OR btrim(area_other) = '')),
  -- …and a listed area must belong to the governorate.
  FOREIGN KEY (area_id, governorate_id) REFERENCES areas (id, governorate_id),
  -- Floor and apartment belong to apartment buildings only.
  CHECK (building_type = 'apartment' OR (floor IS NULL AND apartment IS NULL))
);

-- ---------------------------------------------------------------------------
-- Orders  (src/context/cart-context.js, src/components/checkout/checkout-logic.js)
-- ---------------------------------------------------------------------------

CREATE TABLE orders (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference              text NOT NULL UNIQUE CHECK (reference ~ '^NFS-[0-9A-HJKMNP-TV-Z]{6}$'),
  customer_id            uuid NOT NULL REFERENCES customers (id),
  status                 text NOT NULL DEFAULT 'placed' CHECK (status IN (
                           'placed', 'confirmed', 'packed', 'out_for_delivery',
                           'delivered', 'cancelled', 'returned', 'partially_returned')),
  placed_at              timestamptz NOT NULL DEFAULT now(),
  delivery_address_id    uuid NOT NULL REFERENCES addresses (id),
  delivery_notes         text,
  -- The promise made at checkout, from deliveryPromise() in src/lib/delivery.js.
  delivery_type          text NOT NULL CHECK (delivery_type IN ('same-day', 'next-day', 'later', 'remote')),
  promised_date          date NOT NULL,
  delivered_at           timestamptz,
  payment_method         text NOT NULL CHECK (payment_method IN ('knet', 'card', 'apple-pay', 'cod')),
  payment_reference      text,                 -- from the processor; never card data
  -- Totals in fils, as computed by cartTotals().
  subtotal_fils          integer NOT NULL CHECK (subtotal_fils >= 0),
  gift_fils              integer NOT NULL DEFAULT 0 CHECK (gift_fils >= 0),
  shipping_fils          integer NOT NULL CHECK (shipping_fils >= 0),
  remote_surcharge_fils  integer NOT NULL DEFAULT 0 CHECK (remote_surcharge_fils >= 0),
  total_fils             integer NOT NULL,
  -- Gifting: the gift object from the cart (gift.enabled …).
  is_gift                boolean NOT NULL DEFAULT false,
  gift_box_id            text REFERENCES gift_boxes (id),
  gift_message           text CHECK (char_length(gift_message) <= 200),
  gift_from              text,
  hide_prices            boolean NOT NULL DEFAULT true,   -- prices off the packing slip
  deliver_to_recipient   boolean NOT NULL DEFAULT false,
  recipient_name         text,
  recipient_mobile       text CHECK (recipient_mobile ~ '^[4569][0-9]{7}$'),
  CHECK (total_fils = subtotal_fils + gift_fils + shipping_fils + remote_surcharge_fils),
  CHECK (is_gift OR (gift_box_id IS NULL AND gift_message IS NULL AND NOT deliver_to_recipient)),
  CHECK (NOT is_gift OR gift_box_id IS NOT NULL),
  CHECK (NOT deliver_to_recipient OR (recipient_name IS NOT NULL AND recipient_mobile IS NOT NULL)),
  -- The driver cannot collect cash from someone receiving a present.
  CHECK (NOT (deliver_to_recipient AND payment_method = 'cod')),
  CHECK (delivery_type <> 'same-day' OR promised_date = (placed_at AT TIME ZONE 'Asia/Kuwait')::date)
);

CREATE INDEX orders_customer_idx ON orders (customer_id, placed_at DESC);
CREATE INDEX orders_promised_idx ON orders (promised_date) WHERE status IN ('placed', 'confirmed', 'packed', 'out_for_delivery');

CREATE TABLE order_items (
  order_id            uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id          text NOT NULL,
  format_id           text NOT NULL,
  qty                 smallint NOT NULL CHECK (qty BETWEEN 1 AND 10),     -- MAX_QTY
  unit_fils           integer NOT NULL CHECK (unit_fils > 0),             -- the price paid, frozen
  includes_test_vial  boolean NOT NULL DEFAULT false,                     -- Try First: formats.try_first
  returned_qty        smallint NOT NULL DEFAULT 0 CHECK (returned_qty >= 0),
  PRIMARY KEY (order_id, product_id, format_id),
  FOREIGN KEY (product_id, format_id) REFERENCES product_formats (product_id, format_id),
  CHECK (returned_qty <= qty)
);

-- One Try First return per fragrance, per customer (contract with the shopper,
-- enforced here rather than trusted to the support desk).
CREATE TABLE try_first_returns (
  customer_id  uuid NOT NULL REFERENCES customers (id),
  product_id   text NOT NULL REFERENCES products (id),
  order_id     uuid NOT NULL REFERENCES orders (id),
  returned_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (customer_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Reviews  (src/lib/reviews.js) — real customer reviews only, moderated
-- before they are published. Nothing is seeded.
-- ---------------------------------------------------------------------------

CREATE TABLE reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       text NOT NULL REFERENCES products (id),
  customer_id      uuid REFERENCES customers (id) ON DELETE SET NULL,
  order_id         uuid REFERENCES orders (id) ON DELETE SET NULL,   -- set when the purchase is verified
  name             text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 60),
  area             text CHECK (char_length(area) <= 40),
  rating_overall   smallint NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_longevity_heat smallint NOT NULL CHECK (rating_longevity_heat BETWEEN 1 AND 5),
  rating_sillage   smallint NOT NULL CHECK (rating_sillage BETWEEN 1 AND 5),
  rating_compliment smallint NOT NULL CHECK (rating_compliment BETWEEN 1 AND 5),
  body             text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 20 AND 1000),
  lang             text NOT NULL CHECK (lang IN ('en', 'ar')),
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  published_at     timestamptz,
  CHECK ((status = 'published') = (published_at IS NOT NULL))
);

CREATE INDEX reviews_product_published_idx ON reviews (product_id, published_at DESC) WHERE status = 'published';

-- The aggregates the badge, the reviews section and the "Top rated" sort read
-- (aggregate() in src/lib/reviews.js): one-decimal averages, published only.
CREATE VIEW review_aggregates AS
SELECT product_id,
       count(*)                                  AS review_count,
       round(avg(rating_overall), 1)             AS overall,
       round(avg(rating_longevity_heat), 1)      AS longevity_heat,
       round(avg(rating_sillage), 1)             AS sillage,
       round(avg(rating_compliment), 1)          AS compliment
  FROM reviews
 WHERE status = 'published'
 GROUP BY product_id;

COMMIT;
