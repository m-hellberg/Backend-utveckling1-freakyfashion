--- Skapar en tabell för produkter
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    sku TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT,
    slug TEXT NOT NULL,
    publicationDate TEXT,
    isNew INTEGER DEFAULT 0
    purchasesThisMonth INTEGER DEFAULT 0,
    isPopular BOOLEAN DEFAULT 0
);

-- Trigger för att uppdatera isNew baserat på publicationDate
CREATE TRIGGER update_isNew_on_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE products
    SET isNew = CASE 
        WHEN julianday('now') - julianday(NEW.publicationDate) <= 7 THEN 1
        ELSE 0
    END
    WHERE id = NEW.id;
END;

-- Trigger för att uppdatera isNew vid uppdatering av publicationDate
CREATE TRIGGER update_isNew_on_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    UPDATE products
    SET isNew = CASE 
        WHEN julianday('now') - julianday(NEW.publicationDate) <= 7 THEN 1
        ELSE 0
    END
    WHERE id = NEW.id;
END;

-- Trigger för att uppdatera isPopular baserat på purchasesThisMonth
CREATE TRIGGER update_isPopular
AFTER UPDATE OF purchasesThisMonth ON products
FOR EACH ROW
BEGIN
    UPDATE products
    SET isPopular = CASE 
        WHEN NEW.purchasesThisMonth > 300 THEN 1 
        ELSE 0 
    END
    WHERE id = NEW.id;
END;



-- Skapar en tabell för användare
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Lägger till en admin
INSERT INTO users (email, password, admin) VALUES (
    'admin@admin.com',
    'TEMP_PASSWORD',
    1
);

-- Lägger till name-kolumn i users-tabellen
ALTER TABLE users ADD COLUMN name TEXT;



-- Skapar en kategori-tabell
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT
);

-- Lägger till fler kategorier
INSERT INTO categories (name, image)
VALUES 
  ('Toppar', '/images/glitter-beige-top.png'),
  ('Byxor', '/images/glitter-beige-top.png'),
  ('Tvådelade set', '/images/glitter-beige-top.png'),
  ('Tröjor', '/images/glitter-beige-top.png'),
  ('Jackor', '/images/glitter-beige-top.png'),
  ('Jumpsuits', '/images/glitter-beige-top.png');

-- Lägger till slug-kolumn i categories-tabellen
ALTER TABLE categories ADD COLUMN slug TEXT;

-- Uppdaterar slugs med engelska namn
UPDATE categories SET slug = 'shoes' WHERE name = 'Skor';
UPDATE categories SET slug = 'bags' WHERE name = 'Väskor';
UPDATE categories SET slug = 'tops' WHERE name = 'Toppar';
UPDATE categories SET slug = 'pants' WHERE name = 'Byxor';
UPDATE categories SET slug = 'two-piece-sets' WHERE name = 'Tvådelade set';
UPDATE categories SET slug = 'sweaters' WHERE name = 'Tröjor';
UPDATE categories SET slug = 'jackets' WHERE name = 'Jackor';
UPDATE categories SET slug = 'jumpsuits' WHERE name = 'Jumpsuits';

-- Skapar en kopplingstabell för produkter och kategorier med ON DELETE CASCADE
CREATE TABLE product_categories_new (
  product_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);


-- Skapar en tabell för kundvagnar
CREATE TABLE carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- Skapar en tabell för favoriter
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  UNIQUE(userId, productId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);