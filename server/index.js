const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    phone_number TEXT NOT NULL UNIQUE
                )
            `);
            db.run(`
                CREATE TABLE IF NOT EXISTS addresses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_id INTEGER,
                    address_details TEXT NOT NULL,
                    city TEXT NOT NULL,
                    state TEXT NOT NULL,
                    pin_code TEXT NOT NULL,
                    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
                )
            `);
        });
    }
});

// --- API ROUTES ---

// === CUSTOMERS ===

// POST /api/customers
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    db.run(sql, [first_name, last_name, phone_number], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Phone number already exists." });
            }
            return res.status(500).json({ error: "Internal server error." });
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// GET /api/customers -> THIS IS THE CORRECTED ENDPOINT
app.get('/api/customers', (req, res) => {
    const { search = '', sort_by = 'first_name', order = 'ASC', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let params = [];
    let countParams = [];

    // THIS SQL QUERY NOW CORRECTLY COUNTS ADDRESSES FOR EACH CUSTOMER
    let baseSql = `SELECT c.*, COUNT(DISTINCT a.id) as address_count FROM customers c`;
    let countSql = `SELECT COUNT(DISTINCT c.id) as total FROM customers c`;

    baseSql += ` LEFT JOIN addresses a ON c.id = a.customer_id`;

    if (search) {
        const whereClause = ` WHERE (c.first_name LIKE ? OR c.last_name LIKE ? OR a.city LIKE ? OR a.state LIKE ? OR a.pin_code LIKE ?)`;
        baseSql += whereClause;
        countSql += ` LEFT JOIN addresses a ON c.id = a.customer_id` + whereClause;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    baseSql += ` GROUP BY c.id ORDER BY c.${sort_by} ${order.toUpperCase()} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.get(countSql, countParams, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const totalCustomers = row.total;

        db.all(baseSql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: "success",
                data: rows,
                pagination: {
                    total: totalCustomers,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(totalCustomers / limit)
                }
            });
        });
    });
});

// GET /api/customers/:id
app.get('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Customer not found." });
        res.json({ message: "success", data: row });
    });
});

// PUT /api/customers/:id
app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: "All fields are required." });
    }
    db.run(`UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`, [first_name, last_name, phone_number, id], function(err) {
        if (err) {
             if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Phone number already exists." });
            }
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) return res.status(404).json({ error: "Customer not found." });
        res.json({ message: "Customer updated successfully." });
    });
});

// DELETE /api/customers/:id
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM customers WHERE id = ?`, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Customer not found." });
        res.status(204).send();
    });
});

// === ADDRESSES ===

// POST /api/customers/:id/addresses
app.post('/api/customers/:id/addresses', (req, res) => {
    const customer_id = req.params.id;
    const { address_details, city, state, pin_code } = req.body;
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: "All address fields are required." });
    }
    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [customer_id, address_details, city, state, pin_code], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, customer_id, ...req.body });
    });
});

// GET /api/customers/:id/addresses
app.get('/api/customers/:id/addresses', (req, res) => {
    db.all(`SELECT * FROM addresses WHERE customer_id = ?`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// PUT /api/addresses/:addressId
app.put('/api/addresses/:addressId', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: "All address fields are required." });
    }
    db.run(`UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`, 
        [address_details, city, state, pin_code, req.params.addressId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Address not found." });
        res.json({ message: "Address updated successfully." });
    });
});

// DELETE /api/addresses/:addressId
app.delete('/api/addresses/:addressId', (req, res) => {
    db.run(`DELETE FROM addresses WHERE id = ?`, req.params.addressId, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Address not found." });
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});