const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//const port = 8000;
const PORT = process.env.PORT || 8000;
const db = new Database("./db/freakyfashion.db", { verbose: console.log });
const app = express();

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  street TEXT NOT NULL,
  postalCode TEXT NOT NULL,
  city TEXT NOT NULL,
  newsletter INTEGER NOT NULL DEFAULT 0,
  totalAmount REAL NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
`);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(
  session({
    secret: "hemlig-session-nyckel",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./db" }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 dag
    },
  })
);

// Multer konf för uppladdning av kategori-bilder
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../client/public/images/categories");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadCategory = multer({ storage: categoryStorage });

// Multer konf för uppladdning av produkt-bilder
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../client/public/images/products");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadProduct = multer({ storage: productStorage });

// middleware för admin
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.admin) {
    return res.status(403).json({ error: 'Endast admin har åtkomst' });
  }
  next();
}

// CART helpers
function getSessionCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

function setSessionCart(req, cart) {
  req.session.cart = cart;
}

function buildCartResponse(req) {
  // inloggad från DB, annars session
  if (req.session.user) {
    const items = db.prepare(`
      SELECT products.id, products.name, products.price, products.image, carts.quantity
      FROM carts
      JOIN products ON products.id = carts.productId
      WHERE carts.userId = ?
    `).all(req.session.user.id);
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    return { items, total };
  }

  const cart = getSessionCart(req);
  const items = cart.map(row => {
    const p = db.prepare("SELECT id, name, price, image FROM products WHERE id = ?").get(row.productId);
    if (!p) return null;
    return { ...p, quantity: row.quantity };
  }).filter(Boolean);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return { items, total };
}

// populära produkter
app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products WHERE isPopular = 1").all();
    res.json(products);
  } catch (error) {
    console.error("Fel vid hämtning av produkter:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av produkter" });
  }
});

// produkt baserat på slug
app.get("/api/products/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
    if (!product) return res.status(404).json({ message: "Produkten hittades inte" });
    res.json(product);
  } catch (error) {
    console.error("Fel vid hämtning av produkt:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av produkt" });
  }
});

// sök
app.get("/api/search", (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) return res.status(400).json({ error: "Ingen sökterm angiven" });
    const products = db.prepare("SELECT * FROM products WHERE name LIKE ?").all(`%${searchQuery}%`);
    res.json(products);
  } catch (error) {
    console.error("Fel vid sökning:", error);
    res.status(500).json({ error: "Serverfel vid sökning av produkter" });
  }
});

// alla produkter
app.get("/api/all-products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  } catch (error) {
    console.error("Fel vid hämtning av alla produkter:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av alla produkter" });
  }
});

// nya produkter
app.get("/api/new-products", (req, res) => {
  try {
    const products = db
      .prepare("SELECT * FROM products WHERE isNew = 1 ORDER BY publicationDate DESC")
      .all();
    res.json(products);
  } catch (error) {
    console.error("Fel vid hämtning av nya produkter:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av nya produkter" });
  }
});

// admin: alla produkter
app.get("/api/admin/products", requireAdmin, (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Serverfel vid hämtning av produkter" });
  }
});

// radera produkt
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
    if (result.changes === 0) return res.status(404).json({ error: "Produkten hittades inte" });
    res.json({ message: "Produkten har raderats" });
  } catch (error) {
    console.error("Fel vid radering av produkt:", error);
    res.status(500).json({ error: "Serverfel vid radering av produkt" });
  }
});

// slug-generator
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// lägg till produkt
app.post("/api/products", requireAdmin, uploadProduct.single("image"), (req, res) => {
  try {
    const { name, description, brand, sku, price, publicationDate } = req.body;
    const categories = JSON.parse(req.body.categories || "[]"); // flera kategorier

    if (!req.file) {
      return res.status(400).json({ error: "Bild krävs" });
    }

    const slug = generateSlug(name);
    const purchasesThisMonth = Math.floor(Math.random() * 501);
    const isPopular = purchasesThisMonth > 300 ? 1 : 0;

    const imagePath = `/images/products/${req.file.filename}`;

    const stmt = db.prepare(
      `INSERT INTO products 
      (name, slug, description, image, brand, sku, price, publicationDate, purchasesThisMonth, isPopular) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.run(
      name,
      slug,
      description,
      imagePath,
      brand,
      sku,
      price,
      publicationDate,
      purchasesThisMonth,
      isPopular
    );

    const productId = result.lastInsertRowid;

    // Lägg till relationer i product_categories
    const insertCategory = db.prepare(
      "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)"
    );
    categories.forEach((catId) => {
      insertCategory.run(productId, catId);
    });

    res.status(201).json({
      message: "Produkt tillagd",
      productId,
      slug,
      image: imagePath,
    });
  } catch (error) {
    console.error("Fel vid tillägg av produkt:", error);
    res.status(500).json({ error: "Serverfel vid tillägg av produkt" });
  }
});

// hämta produkter för en kategori
app.get("/api/categories/:slug/products", (req, res) => {
  try {
    const { slug } = req.params;
    const category = db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug);
    if (!category) return res.status(404).json({ error: "Kategorin hittades inte" });

    const products = db.prepare(`
      SELECT products.*
      FROM products
      JOIN product_categories ON products.id = product_categories.product_id
      WHERE product_categories.category_id = ?
    `).all(category.id);

    res.json(products);
  } catch (error) {
    console.error("Fel vid hämtning av produkter för kategori:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av produkter för kategori" });
  }
});

// admin: alla kategorier
app.get("/api/admin/categories", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

// lägg till ny kategori med filuppladdning
app.post("/api/admin/categories", requireAdmin, uploadCategory.single("image"), (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) return res.status(400).json({ error: "Namn och bild krävs" });

    const slug = generateSlug(name);
    const imagePath = `/images/categories/${req.file.filename}`; // OBS! Nu i client/public

    const stmt = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
    const result = stmt.run(name, slug, imagePath);

    res.status(201).json({ id: result.lastInsertRowid, name, slug, image: imagePath });
  } catch (error) {
    console.error("Fel vid upplägg av kategori:", error);
    res.status(500).json({ error: "Serverfel vid upplägg av kategori" });
  }
});

// ta bort kategori
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Kategorin hittades inte" });
  res.json({ message: "Kategori raderad" });
});

// auth-rutter
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email och lösenord krävs' });

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, hashedPassword);
    const user = db.prepare("SELECT id, name, email, admin FROM users WHERE id = ?").get(result.lastInsertRowid);
    req.session.user = user;
    res.status(201).json({ message: 'Användare registrerad och inloggad', user });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ error: 'Email är redan registrerad' });
    res.status(500).json({ error: 'Serverfel vid registrering' });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(400).json({ message: "Felaktig email eller lösenord" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Felaktig email eller lösenord" });

    req.session.user = { id: user.id, name: user.name, email: user.email, admin: user.admin };

    // slå ihop cart
    if (req.session.cart && req.session.cart.length) {
      for (const item of req.session.cart) {
        const existing = db.prepare("SELECT * FROM carts WHERE userId = ? AND productId = ?")
                           .get(user.id, item.productId);
        if (existing) {
          db.prepare("UPDATE carts SET quantity = quantity + ? WHERE userId = ? AND productId = ?")
            .run(item.quantity, user.id, item.productId);
        } else {
          db.prepare("INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)")
            .run(user.id, item.productId, item.quantity);
        }
      }
      delete req.session.cart; 
    }

    // slå ihop favorites
    if (req.session.favorites && req.session.favorites.length) {
      for (const productId of req.session.favorites) {
        db.prepare("INSERT OR IGNORE INTO favorites (userId, productId) VALUES (?, ?)")
          .run(user.id, productId);
      }
      delete req.session.favorites;
    }

    res.json({ message: "Inloggad", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfel vid login" });
  }
});

app.get("/api/me", (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.json({ user: null });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Kunde inte logga ut" });
    res.clearCookie("connect.sid");
    res.json({ message: "Utloggad" });
  });
});

// VARUKORG

// hämta varukorg
app.get("/api/cart", (req, res) => {
  try {
    return res.json(buildCartResponse(req));
  } catch (e) {
    console.error("Fel vid GET /api/cart:", e);
    res.status(500).json({ error: "Serverfel vid hämtning av varukorg" });
  }
});

// lägg till i varukorg
app.post("/api/cart", (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const q = Math.max(1, parseInt(quantity || 1, 10));

    const exists = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
    if (!exists) return res.status(404).json({ error: "Produkten finns inte" });

    if (req.session.user) {
      const userId = req.session.user.id;
      const row = db.prepare("SELECT quantity FROM carts WHERE userId = ? AND productId = ?")
        .get(userId, productId);
      if (row) {
        db.prepare("UPDATE carts SET quantity = quantity + ? WHERE userId = ? AND productId = ?")
          .run(q, userId, productId);
      } else {
        db.prepare("INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)")
          .run(userId, productId, q);
      }
    } else {
      const cart = getSessionCart(req);
      const existing = cart.find(c => c.productId === productId);
      if (existing) existing.quantity += q;
      else cart.push({ productId, quantity: q });
      setSessionCart(req, cart);
    }

    return res.json(buildCartResponse(req));
  } catch (e) {
    console.error("Fel vid POST /api/cart:", e);
    res.status(500).json({ error: "Serverfel vid uppdatering av varukorg" });
  }
});

// uppdatera antal
app.patch("/api/cart/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const q = parseInt(req.body.quantity, 10);

    if (req.session.user) {
      const userId = req.session.user.id;
      if (q <= 0) {
        db.prepare("DELETE FROM carts WHERE userId = ? AND productId = ?")
          .run(userId, productId);
      } else {
        db.prepare("UPDATE carts SET quantity = ? WHERE userId = ? AND productId = ?")
          .run(q, userId, productId);
      }
    } else {
      const cart = getSessionCart(req);
      const idx = cart.findIndex(c => c.productId === productId);
      if (idx === -1) return res.status(404).json({ error: "Produkten finns inte i varukorgen" });
      if (q <= 0) cart.splice(idx, 1);
      else cart[idx].quantity = q;
      setSessionCart(req, cart);
    }

    return res.json(buildCartResponse(req));
  } catch (e) {
    console.error("Fel vid PATCH /api/cart/:productId:", e);
    res.status(500).json({ error: "Serverfel vid uppdatering av varukorg" });
  }
});

// ta bort produkt
app.delete("/api/cart/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);

    if (req.session.user) {
      db.prepare("DELETE FROM carts WHERE userId = ? AND productId = ?")
        .run(req.session.user.id, productId);
    } else {
      const cart = getSessionCart(req).filter(c => c.productId !== productId);
      setSessionCart(req, cart);
    }

    return res.json(buildCartResponse(req));
  } catch (e) {
    console.error("Fel vid DELETE /api/cart/:productId:", e);
    res.status(500).json({ error: "Serverfel vid uppdatering av varukorg" });
  }
});

// töm varukorg
app.delete("/api/cart", (req, res) => {
  try {
    if (req.session.user) {
      db.prepare("DELETE FROM carts WHERE userId = ?").run(req.session.user.id);
    } else {
      setSessionCart(req, []);
    }
    return res.json({ items: [], total: 0 });
  } catch (e) {
    console.error("Fel vid DELETE /api/cart:", e);
    res.status(500).json({ error: "Serverfel vid tömning av varukorg" });
  }
});

// ORDRAR

// skapa order
app.post("/api/orders", (req, res) => {
  try {
    const { firstName, lastName, email, street, postalCode, city, newsletter } = req.body;

    const { items, total } = buildCartResponse(req);
    if (!items.length) return res.status(400).json({ error: "Varukorgen är tom" });

    const userId = req.session.user ? req.session.user.id : null;
    const newsletterInt = newsletter ? 1 : 0;

    const insertOrder = db.prepare(`
      INSERT INTO orders (userId, firstName, lastName, email, street, postalCode, city, newsletter, totalAmount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const orderResult = insertOrder.run(
      userId, firstName, lastName, email, street, postalCode, city, newsletterInt, total
    );
    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, name, price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((rows) => {
      for (const it of rows) {
        insertItem.run(orderId, it.id, it.name, it.price, it.quantity, it.price * it.quantity);
      }
    });
    insertMany(items);

    // töm varukorg efter köp (DB/Session)
    if (req.session.user) {
      db.prepare("DELETE FROM carts WHERE userId = ?").run(req.session.user.id);
    } else {
      setSessionCart(req, []);
    }

    return res.status(201).json({ orderId });
  } catch (e) {
    console.error("Fel vid POST /api/orders:", e);
    res.status(500).json({ error: "Serverfel vid skapande av order" });
  }
});

// hämta order för bekräftelsesidan
app.get("/api/orders/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    if (!order) return res.status(404).json({ error: "Ordern finns inte" });
    const items = db.prepare("SELECT * FROM order_items WHERE orderId = ?").all(id);
    return res.json({ order, items });
  } catch (e) {
    console.error("Fel vid GET /api/orders/:id:", e);
    res.status(500).json({ error: "Serverfel vid hämtning av order" });
  }
});

// hämta användarens beställningar
app.get("/api/my-orders", (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Inte inloggad" });

  const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC")
                   .all(req.session.user.id);
  res.json(orders);
});

// FAVORITER

// hämta favoriter, DB om inloggad, annars session
app.get("/api/favorites", (req, res) => {
  try {
    if (req.session.user) {
      const rows = db.prepare(`
        SELECT products.*
        FROM favorites
        JOIN products ON products.id = favorites.productId
        WHERE favorites.userId = ?
      `).all(req.session.user.id);
      return res.json(rows);
    }

    const favIds = req.session.favorites || [];
    const products = favIds.map(id => db.prepare("SELECT * FROM products WHERE id = ?").get(id))
                          .filter(Boolean);
    return res.json(products);
  } catch (e) {
    console.error("Fel vid GET /api/favorites:", e);
    res.status(500).json({ error: "Serverfel vid hämtning av favoriter" });
  }
});

// lägg till favorit
app.post("/api/favorites/add/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const exists = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
    if (!exists) return res.status(404).json({ error: "Produkten finns inte" });

    if (req.session.user) {
      db.prepare("INSERT OR IGNORE INTO favorites (userId, productId) VALUES (?, ?)")
        .run(req.session.user.id, productId);
      return res.json({ success: true, source: "db" });
    }

    req.session.favorites = req.session.favorites || [];
    if (!req.session.favorites.includes(productId)) {
      req.session.favorites.push(productId);
    }
    return res.json({ success: true, source: "session" });
  } catch (e) {
    console.error("Fel vid POST /api/favorites/add:", e);
    res.status(500).json({ error: "Serverfel vid uppdatering av favoriter" });
  }
});

// ta bort favorit
app.delete("/api/favorites/remove/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);

    if (req.session.user) {
      db.prepare("DELETE FROM favorites WHERE userId = ? AND productId = ?")
        .run(req.session.user.id, productId);
      return res.json({ success: true, source: "db" });
    }

    req.session.favorites = (req.session.favorites || []).filter(id => id !== productId);
    return res.json({ success: true, source: "session" });
  } catch (e) {
    console.error("Fel vid DELETE /api/favorites/remove:", e);
    res.status(500).json({ error: "Serverfel vid uppdatering av favoriter" });
  }
});

// Serve frontend statiska filer (För Render)
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all: skicka alla andra requests till index.html (För Render)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

//app.listen(port, () => console.log(`Server started on port ${port}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
