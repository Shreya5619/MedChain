# *MedChain - Practical DBMS Integration Guide* 🗄

## *Overview*
This document presents a *lean, academically-focused* database integration strategy for MedChain - a blockchain-based drug supply chain system. The architecture demonstrates both *SQL (MySQL)* and *NoSQL (MongoDB)* use cases while remaining *feasible for a 4-6 week academic project*.

---

## *📊 Current System Architecture*

### *Existing Data Storage:*
- *JSON Files*: blockchain.json stores blockchain blocks and transactions
- *localStorage*: Browser-based storage for user private/public keys
- *In-Memory*: Temporary session data in Flask backend

### *Core Problems:*
- ❌ No user authentication system
- ❌ Slow drug search (must parse entire blockchain)
- ❌ No audit trail or analytics
- ❌ Security vulnerabilities (keys in localStorage)

---

## *🎯 PRACTICAL DATABASE INTEGRATION STRATEGY*

### *Core Principle:*
Keep *blockchain for immutability, **MySQL for structure, and **MongoDB for logs & analytics* — but only at *two integration points* each. This is enough to:
- ✅ Demonstrate relational design and NoSQL flexibility
- ✅ Keep blockchain integrity intact
- ✅ Stay feasible for academic timeline
- ✅ Show impressive yet practical implementation

---

## *📐 FINAL ARCHITECTURE OVERVIEW*

| Component | Purpose | Database | Reason |
|-----------|---------|----------|--------|
| *User Authentication* | Secure login + role-based access | *MySQL* | Relational, structured |
| *Drug Registry* | Manufacturer adds drugs/batches | *MySQL* | Shows JOINs, normalization |
| *Blockchain Transactions* | Immutable supply chain records | *JSON* | Core blockchain (unchanged) |
| *Transaction Logs* | Detailed event tracking | *MongoDB* | High-write, flexible schema |
| *QR Scan Events* | Consumer verification logs | *MongoDB* | Real-time, semi-structured |
| *Analytics Dashboard* | System statistics | *MongoDB* | Aggregation queries |

---

## *🎯 CHOSEN DATABASE INTEGRATIONS*


---

## *1️⃣ MySQL USE CASE: User Authentication + Drug Registry* ⭐⭐⭐

### *Purpose:*
Implement secure user management and drug catalog using relational database design principles.

### *Why MySQL?*
- ✅ Perfect for structured data with clear relationships
- ✅ Demonstrates ER modeling, normalization, JOINs
- ✅ ACID compliance for critical master data
- ✅ Essential for academic DBMS evaluation

### *Database Schema (Simple & Practical):*

sql
-- 1. Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Manufacturer', 'Intermediary', 'Hospital', 'Consumer') NOT NULL,
    org_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 2. Organizations Table
CREATE TABLE organizations (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    org_name VARCHAR(255) NOT NULL,
    org_type ENUM('Manufacturer', 'Distributor', 'Hospital', 'Pharmacy') NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Drugs Table
CREATE TABLE drugs (
    drug_id VARCHAR(255) PRIMARY KEY,  -- Blockchain-generated hash
    drug_name VARCHAR(200) NOT NULL,
    drug_category VARCHAR(100),
    description TEXT,
    manufacturer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES users(user_id),
    INDEX idx_drug_name (drug_name)
);

-- 4. Drug Batches Table
CREATE TABLE drug_batches (
    batch_id VARCHAR(100) PRIMARY KEY,
    drug_id VARCHAR(255),
    manufacturer_id INT,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INT NOT NULL,
    status ENUM('Active', 'Expired', 'Recalled') DEFAULT 'Active',
    blockchain_block_height INT,  -- Link to blockchain
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES drugs(drug_id),
    FOREIGN KEY (manufacturer_id) REFERENCES users(user_id),
    INDEX idx_expiry (expiry_date),
    INDEX idx_drug (drug_id)
);

-- Add foreign key to users table
ALTER TABLE users ADD FOREIGN KEY (org_id) REFERENCES organizations(org_id);


### *What You'll Actually Implement:*

#### *Backend Changes:*

1. **Blockchain/Backend/core/database/mysql_db.py** (NEW FILE)
   python
   # Create MySQL connection class
   # Key methods:
   - connect() / disconnect()
   - register_user(username, email, password, role)
   - authenticate_user(username, password)
   - add_drug(drug_id, drug_name, category, manufacturer_id)
   - add_batch(batch_id, drug_id, mfg_date, exp_date, qty)
   - get_drug_info(drug_id)
   - get_batches_by_manufacturer(manufacturer_id)
   

2. **Blockchain/Frontend/run.py** - Add 4 new endpoints:
   python
   @app.route("/register", methods=["POST"])
   # Register new user in MySQL
   
   @app.route("/login", methods=["POST"])
   # Authenticate user, return session token
   
   @app.route("/add-drug", methods=["POST"])
   # Store drug metadata in MySQL when manufacturer creates drug
   
   @app.route("/get-drug-info", methods=["GET"])
   # Fetch drug details from MySQL (fast query)
   

3. **Blockchain/Backend/core/blockchain.py** - Minor modification:
   python
   # In create_unique_drug_id() method:
   # After generating drug_id, also store in MySQL
   
   # In addBlock() for drug creation:
   # Store batch info in MySQL alongside blockchain write
   

#### *Frontend Changes:*

1. **src/components/manulogincard.tsx**
   - Replace account creation with proper registration form
   - Call /register endpoint instead of localStorage

2. **src/Manufacturer.jsx**
   - Add login flow: call /login endpoint
   - On drug creation: store in MySQL via /add-drug
   - Display drugs from MySQL (faster than blockchain parsing)

3. **Create src/components/Login.tsx** (NEW)
   - Universal login component for all user types
   - Validates credentials via MySQL

### *DBMS Concepts Demonstrated:*
- ✅ ER Diagram → Relational Schema conversion
- ✅ Normalization (3NF achieved)
- ✅ Primary Keys, Foreign Keys, Referential Integrity
- ✅ JOINS (User ↔ Drugs ↔ Batches)
- ✅ Indexes for query optimization
- ✅ ACID transactions (user registration)
- ✅ Role-based access control

### *Expected Queries for Demo:*
sql
-- 1. Get all drugs by a manufacturer
SELECT d.drug_name, db.batch_id, db.manufacturing_date, db.expiry_date
FROM drugs d
JOIN drug_batches db ON d.drug_id = db.drug_id
WHERE d.manufacturer_id = ?;

-- 2. Find drugs expiring soon
SELECT d.drug_name, db.batch_id, db.expiry_date
FROM drugs d
JOIN drug_batches db ON d.drug_id = db.drug_id
WHERE db.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
AND db.status = 'Active';

-- 3. User authentication with organization details
SELECT u.user_id, u.username, u.role, o.org_name, o.org_type
FROM users u
LEFT JOIN organizations o ON u.org_id = o.org_id
WHERE u.username = ? AND u.password_hash = ?;


### *Implementation Complexity:* ⭐⭐ Medium

### *Academic Impact:* ⭐⭐⭐ Very High

### *Timeline:* Week 1-2

---

## *2️⃣ MongoDB USE CASE: Transaction Logs + QR Scan Analytics* ⭐⭐⭐

### *Purpose:*
Fast, flexible logging system for blockchain events and user interactions with real-time analytics.

### *Why MongoDB?*
- ✅ Perfect for high-frequency, append-only logs
- ✅ Flexible schema (different transaction types)
- ✅ Excellent aggregation pipeline for analytics
- ✅ Demonstrates NoSQL strengths vs SQL

### *Collections Schema (Simple & Practical):*

javascript
// Collection 1: transaction_logs
{
    _id: ObjectId("..."),
    transaction_id: "hash_abc123",
    drug_id: "drug_hash_def456",
    batch_id: "B1234",
    sender: "MFG001",
    sender_name: "Pharma Inc",
    receiver: "DIST002",
    receiver_name: "MedDistributor",
    status: "Transferred",
    location: "Mumbai, India",
    blockchain_block_height: 100,
    blockchain_block_hash: "blockhash_xyz",
    timestamp: ISODate("2025-01-15T10:30:00Z"),
    metadata: {
        temperature: "25C",
        vehicle: "Truck-TN01AB1234"
    }
}

// Collection 2: qr_scan_logs
{
    _id: ObjectId("..."),
    qr_code_data: "drug_hash_def456",
    drug_id: "drug_hash_def456",
    batch_id: "B1234",
    drug_name: "Aspirin",  // Denormalized for speed
    scanner_location: "Bangalore",
    scanner_ip: "192.168.1.100",
    verification_result: "Genuine",
    scan_timestamp: ISODate("2025-01-15T14:20:00Z")
}


### *What You'll Actually Implement:*

#### *Backend Changes:*

1. **Blockchain/Backend/core/database/mongodb_db.py** (NEW FILE)
   python
   # Create MongoDB connection class
   # Key methods:
   - connect() / disconnect()
   - log_transaction(transaction_data)  # Insert transaction log
   - log_qr_scan(qr_data, drug_id, location)  # Insert scan log
   - get_transaction_history(drug_id)  # Query logs by drug
   - get_analytics_summary()  # Aggregation pipeline
   - get_top_scanned_drugs(limit=5)  # Popular drugs
   

2. **Blockchain/Backend/core/blockchain.py** - Add logging:
   python
   def addBlock(self, BlockHeight, prevBlockHash, ...):
       # ... existing blockchain write ...
       
       # NEW: Also log to MongoDB
       mongo_db = MongoDBDatabase()
       if mongo_db.connect():
           mongo_db.log_transaction({
               'transaction_id': trans_id,
               'drug_id': drug_id,
               'batch_id': batch_id,
               'sender': manufacturer,
               'receiver': dist,
               'status': status,
               'location': location,
               'blockchain_block_height': BlockHeight,
               'blockchain_block_hash': blockheader.blockHash,
               'timestamp': datetime.utcnow()
           })
   

3. **Blockchain/Frontend/run.py** - Add 3 new endpoints:
   python
   @app.route("/log-qr-scan", methods=["POST"])
   # Log QR scan event to MongoDB
   
   @app.route("/analytics", methods=["GET"])
   # Return summary statistics
   
   @app.route("/transaction-history/<drug_id>", methods=["GET"])
   # Fast retrieval from MongoDB instead of blockchain parsing
   

#### *Frontend Changes:*

1. **src/components/drugTransactionCard.tsx**
   typescript
   // Modify handleScan to log scan events
   const handleScan = async (data: any) => {
       if (data?.text) {
           // Log scan to MongoDB
           await fetch(`${VITE_BACKEND_URL}/log-qr-scan`, {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                   qr_code_data: data.text,
                   scanner_location: 'User Location',
                   drug_id: data.text
               })
           });
           
           // Fetch from MongoDB (100x faster than blockchain)
           fetchDrugData(data.text.trim());
       }
   };
   

2. **Create src/components/AnalyticsDashboard.tsx** (NEW)
   typescript
   // Simple analytics component showing:
   - Total transactions count
   - Total QR scans today
   - Top 5 most scanned drugs (bar chart)
   - Recent transaction timeline
   

3. **Update /searchDrug to use MongoDB first:**
   - Query MongoDB logs (milliseconds)
   - Cross-verify with blockchain (for integrity)
   - Display results

### *DBMS Concepts Demonstrated:*
- ✅ NoSQL CRUD operations
- ✅ Flexible schema design
- ✅ Document-based storage
- ✅ Aggregation pipeline (GROUP BY equivalent)
- ✅ Indexing in NoSQL
- ✅ High-write performance
- ✅ Real-time analytics

### *Expected MongoDB Queries for Demo:*

javascript
// 1. Count transactions by drug
db.transaction_logs.aggregate([
    { $group: { _id: "$drug_id", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
])

// 2. QR scans per day (last 7 days)
db.qr_scan_logs.aggregate([
    { $match: { scan_timestamp: { $gte: ISODate("2025-01-08") } } },
    { $group: { 
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$scan_timestamp" } },
        count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
])

// 3. Get full transaction history for a drug
db.transaction_logs.find({ drug_id: "drug_hash_def456" }).sort({ timestamp: -1 })

// 4. Analytics summary
db.transaction_logs.aggregate([
    {
        $facet: {
            total_transactions: [{ $count: "count" }],
            by_status: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            recent: [{ $sort: { timestamp: -1 } }, { $limit: 10 }]
        }
    }
])


### *Implementation Complexity:* ⭐⭐ Medium

### *Academic Impact:* ⭐⭐⭐ Very High

### *Timeline:* Week 2-3

---

## *⚡ BONUS: Simple Analytics Dashboard* (Optional but Impressive)

### **Create /analytics Endpoint:**

python
@app.route("/analytics", methods=["GET"])
def get_analytics():
    mongo_db = MongoDBDatabase()
    mongo_db.connect()
    
    # Fetch from MySQL
    mysql_db = MySQLDatabase()
    mysql_db.connect()
    total_users = mysql_db.get_user_count()
    total_drugs = mysql_db.get_drug_count()
    
    # Fetch from MongoDB
    total_transactions = mongo_db.get_transaction_count()
    total_scans = mongo_db.get_scan_count()
    top_drugs = mongo_db.get_top_scanned_drugs(5)
    
    return jsonify({
        'users': total_users,
        'drugs': total_drugs,
        'transactions': total_transactions,
        'qr_scans': total_scans,
        'top_scanned': top_drugs
    })


### *Simple React Dashboard Component:*
- Display stats in cards
- Bar chart for top 5 drugs (use react-chartjs-2)
- Recent activity feed

### *Timeline:* Week 4 (if time permits)

---

## *❌ WHAT NOT TO IMPLEMENT (Academic Overkill)*

Skip these to stay focused:
- ❌ Full inventory management system
- ❌ Real-time notifications with WebSockets
- ❌ Blockchain performance metrics
- ❌ Supply chain transaction double-indexing
- ❌ Drug recall workflows
- ❌ Multi-level role permissions
- ❌ Email/SMS alerts
- ❌ Advanced encryption for private keys

*Why skip?* These are production features that dilute core DBMS learning outcomes and blow up timeline.

---

## *📋 IMPLEMENTATION ROADMAP (4 Weeks)*

| Week | Task | Database | Deliverable |
|------|------|----------|-------------|
| *Week 1* | Set up MySQL schema + connection | MySQL | Users, Organizations, Drugs, Batches tables created |
| *Week 1-2* | Implement registration/login | MySQL | /register and /login endpoints working |
| *Week 2* | Drug creation stores in MySQL | MySQL | Manufacturers can add drugs via /add-drug |
| *Week 2-3* | Set up MongoDB + log transactions | MongoDB | Every blockchain transaction logged |
| *Week 3* | QR scan logging | MongoDB | Consumer scans logged to qr_scan_logs |
| *Week 3-4* | Analytics endpoint + dashboard | MongoDB | /analytics returns aggregated stats |
| *Week 4* | Testing + Documentation | Both | Final report with queries, ER diagram |

---

## *🔧 SETUP INSTRUCTIONS*

### *MySQL Setup:*

1. *Install MySQL Server*
   bash
   # Windows
   choco install mysql
   # Or download: https://dev.mysql.com/downloads/mysql/
   

2. *Install Python package*
   bash
   pip install mysql-connector-python
   

3. *Create database*
   sql
   CREATE DATABASE medchain_db;
   USE medchain_db;
   -- Run the table creation scripts above
   

4. **Add to requirements.txt:**
   txt
   mysql-connector-python==8.0.33
   

---

### *MongoDB Setup:*

1. *Install MongoDB Community Server*
   bash
   # Windows
   choco install mongodb
   # Or download: https://www.mongodb.com/try/download/community
   

2. *Install Python package*
   bash
   pip install pymongo
   

3. *Start MongoDB*
   bash
   # Windows
   net start MongoDB
   

4. **Add to requirements.txt:**
   txt
   pymongo==4.3.3
   

---

## *🏗 SIMPLIFIED HYBRID ARCHITECTURE*


┌─────────────────────────────────────────┐
│          MedChain System                │
└─────────────────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
   ┌────────┐ ┌─────┐ ┌────────┐
   │ MySQL  │ │JSON │ │MongoDB │
   └────────┘ └─────┘ └────────┘
        │        │        │
   Structure  Immutable  Flexible
        │        │        │
   • Users    • Blocks  • Tx Logs
   • Drugs    • Hashes  • QR Scans
   • Batches  • Proof   • Analytics


### *Data Flow Example:*


Manufacturer Creates Drug:
1. User logs in → MySQL authentication
2. Generates drug_id → Blockchain
3. Stores metadata → MySQL (drugs, drug_batches)
4. Blockchain transaction → JSON file
5. Log event → MongoDB (transaction_logs)

Consumer Scans QR:
1. Scan event → MongoDB (qr_scan_logs)
2. Query drug info → MySQL (drugs table) — FAST
3. Query history → MongoDB (transaction_logs) — FAST
4. Verify hash → Blockchain — SECURE


---

## *✅ WHY THIS ARCHITECTURE WORKS*

| Aspect | Benefit |
|--------|---------|
| *Feasible* | Can be implemented in 4 weeks |
| *Demonstrates SQL* | ER modeling, JOINs, normalization, indexes |
| *Demonstrates NoSQL* | Flexible schema, aggregation, high writes |
| *Practical* | Solves real problems (auth, analytics) |
| *Impressive* | Shows hybrid architecture understanding |
| *Academic* | Covers all DBMS course learning outcomes |

---

## *📊 EXPECTED PERFORMANCE*

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| User Login | N/A (localStorage) | 50ms | New Feature ✅ |
| Drug Search | 2-5 seconds | 10-50ms | *100x faster* |
| Transaction History | 1-3 seconds | 10-50ms | *100x faster* |
| Analytics | Not possible | 100ms | New Feature ✅ |

---

## *🎓 ACADEMIC DELIVERABLES*

### *For Project Report:*

1. *ER Diagram* (MySQL)
   - Show Users, Organizations, Drugs, Batches with relationships

2. *Relational Schema* (MySQL)
   - All tables with primary keys, foreign keys, data types

3. *Normalization Proof* (MySQL)
   - Show 1NF → 2NF → 3NF steps

4. *Sample SQL Queries* (MySQL)
   - At least 5 queries demonstrating JOINs, aggregation, subqueries

5. *MongoDB Collection Design* (MongoDB)
   - Document structure with explanation

6. *Aggregation Pipeline Examples* (MongoDB)
   - At least 3 analytics queries

7. *Comparison Table*
   - When to use SQL vs NoSQL for different data types

---

## *📚 REQUIRED PACKAGES*

Update requirements.txt:

txt
# Existing
Flask==2.0.2
Flask-QRcode==3.0.0
requests==2.26.0

# NEW: MySQL
mysql-connector-python==8.0.33

# NEW: MongoDB  
pymongo==4.3.3

# Optional: For password hashing
bcrypt==4.0.1


---

## *💡 FINAL RECOMMENDATIONS*

### *DO THIS:*
✅ Implement MySQL for users + drugs (Week 1-2)
✅ Implement MongoDB for logs + analytics (Week 2-3)
✅ Create simple analytics dashboard (Week 3-4)
✅ Document everything with queries and diagrams
✅ Keep blockchain core unchanged

### *DON'T DO THIS:*
❌ Try to implement full inventory system
❌ Build complex notification system
❌ Over-engineer with too many tables
❌ Add features not related to DBMS concepts

---

## *🎯 SUCCESS CRITERIA*

Your project will be considered successful if:

1. ✅ Users can register and login (MySQL working)
2. ✅ Manufacturers can add drugs (MySQL + Blockchain integration)
3. ✅ All transactions are logged (MongoDB working)
4. ✅ QR scans are tracked (MongoDB working)
5. ✅ Analytics dashboard shows basic stats
6. ✅ You can demonstrate SQL JOINs and MongoDB aggregations
7. ✅ Code is clean and documented

---

## *📞 RESOURCES*

- *MySQL Tutorial*: https://dev.mysql.com/doc/refman/8.0/en/tutorial.html
- *MongoDB Tutorial*: https://docs.mongodb.com/manual/tutorial/
- *Flask + MySQL*: https://flask.palletsprojects.com/
- *PyMongo Docs*: https://pymongo.readthedocs.io/

---

*Last Updated*: November 11, 2025  
*MedChain Version*: 1.0 (Academic Edition)  
*Document Version*: 2.0 (Practical Focus)

---

## *📝 APPENDIX: Quick Reference*

### *MySQL Tables Summary:*
- users — User accounts
- organizations — Company details
- drugs — Drug master data
- drug_batches — Batch information

### *MongoDB Collections Summary:*
- transaction_logs — All blockchain transactions
- qr_scan_logs — QR code scan events

### *Key Endpoints to Build:*
- POST /register — Register user (MySQL)
- POST /login — Authenticate (MySQL)
- POST /add-drug — Add drug (MySQL + Blockchain)
- POST /log-qr-scan — Log scan (MongoDB)
- GET /analytics — Get stats (MongoDB aggregation)
- GET /transaction-history/<drug_id> — Get logs (MongoDB)
