# Backend Setup Automation Script Guide

If you want **one command to do it all**, use the provided setup script.

## What the Script Does

1. Checks if Supabase CLI is installed (installs if missing)
2. Links your project to Supabase
3. Pushes database migrations (creates the KV store table)
4. Reminds you to add environment variables

**Time saved:** ~5 minutes of manual terminal commands

---

## How to Run

### In PowerShell (Windows)

```powershell
# Navigate to project directory
cd "c:\Users\sajal\OneDrive\Documents\GitHub\Vibe-beats"

# Run the script with your project ref
.\scripts\setup-backend.ps1 -ProjectRef "your-project-ref"
```

Replace `your-project-ref` with your actual Supabase project reference (e.g., `ezovnklmvqqfiojjvmel`).

### In Bash (Mac/Linux)

If you want to use it on Mac/Linux, modify the first few lines:

```bash
./scripts/setup-backend.sh --project-ref "your-project-ref"
```

(You'd need to create the bash version from the PowerShell version)

---

## What Happens After

The script will:
1. Install Supabase CLI globally
2. Link your Supabase project
3. Create the `kv_store_2e8e40fd` table
4. Print reminders to add environment variables

### Next Manual Steps

1. **Add Environment Variables** (via Supabase Dashboard)
   - Functions → server → Settings
   - Add: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`

2. **Update Client Config**
   - Edit `src/utils/supabase/info.tsx`
   - Set `projectId` and `publicAnonKey`

3. **Test**
   ```powershell
   curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/health
   ```

---

## If the Script Fails

### Issue: "Supabase CLI failed to link"
- **Fix:** Run manually:
  ```powershell
  supabase link --project-ref <your-project-ref>
  ```

### Issue: "db push failed"
- **Fix:** Create the table manually in Supabase Dashboard SQL Editor (see BACKEND_SETUP.md)

### Issue: "Permission denied running script"
- **Fix:** Allow script execution:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

## Alternative: Manual Setup (If script doesn't work)

```powershell
# 1. Install Supabase CLI
npm install -g supabase

# 2. Link project
supabase link --project-ref <your-project-ref>

# 3. Push migrations
supabase db push

# 4. Deploy function
supabase functions deploy server
```

Or just use the Supabase Dashboard to run the SQL directly (easiest if CLI has issues).

---

## Script Source Code

Location: `scripts/setup-backend.ps1`

The script is just PowerShell calling Supabase CLI commands. You can view/edit it if needed.
