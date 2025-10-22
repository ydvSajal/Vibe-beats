# 🎯 QUICK DATABASE SETUP - Copy & Paste Instructions

**Don't want to read the long guide?** Just follow these 4 simple steps:

---

## Step 1️⃣ Go to SQL Editor

Link: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/sql/new

---

## Step 2️⃣ Run Migration 1: Create Tables

**Copy this command:**
```
Open file: supabase/migrations/002_create_proper_schema.sql
Select ALL content
Copy it
Go to Supabase SQL Editor
Paste it
Click "Run"
```

**Expected Result:** ✅ "Query executed successfully"

---

## Step 3️⃣ Run Migration 2: Create Security Policies

**Copy this command:**
```
Open file: supabase/migrations/003_create_rls_policies.sql
Select ALL content
Copy it
Go to Supabase SQL Editor → New Query
Paste it
Click "Run"
```

**Expected Result:** ✅ "Query executed successfully"

---

## Step 4️⃣ Create Storage Buckets (Manual UI)

Go to: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/storage/buckets

**Create 3 Buckets:**

### Bucket 1: avatars
- Click **+ New Bucket**
- Name: `avatars`
- Toggle **Public bucket** ✅
- Click **Create bucket**

### Bucket 2: profile-pictures
- Click **+ New Bucket**
- Name: `profile-pictures`
- Toggle **Public bucket** ✅
- Click **Create bucket**

### Bucket 3: cover-photos
- Click **+ New Bucket**
- Name: `cover-photos`
- Toggle **Public bucket** ✅
- Click **Create bucket**

---

## Step 5️⃣ Run Migration 3: Storage Policies

**Copy this command:**
```
Open file: supabase/migrations/004_create_storage_buckets.sql
Select ALL content
Copy it
Go to Supabase SQL Editor → New Query
Paste it
Click "Run"
```

**Expected Result:** ✅ "Query executed successfully"

---

## ✅ Verify Everything Works

**Run this test in SQL Editor:**
```sql
-- Insert a test user
INSERT INTO public.users (email, name) 
VALUES ('test@bennett.edu.in', 'Test User')
RETURNING id, email, name, created_at;
```

**You should see:**
```
id                                    | email                    | name       | created_at
9f8d3e2c-1a4b-5c6d-7e8f-9a0b1c2d3e4f | test@bennett.edu.in     | Test User  | 2025-10-22T...
```

✅ **SUCCESS!** Your database is ready!

---

## 🎊 What You Now Have

✅ 8 Professional Tables
✅ Security Policies (RLS)
✅ 3 Storage Buckets
✅ Ready for Production

---

## 📞 Need More Info?

See: `docs/DATABASE_SETUP.md` for complete guide with verification steps.

