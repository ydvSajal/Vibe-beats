<#
Setup Backend Helper

Usage:
  .\scripts\setup-backend.ps1 -ProjectRef <your-project-ref>

This script will:
 - Ensure Supabase CLI is installed
 - Link to your Supabase project
 - Push the SQL migration to create the KV table
 - Display reminders for environment variables
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectRef
)

function Test-SupabaseCLI {
    $supabase = Get-Command supabase -ErrorAction SilentlyContinue
    if (-not $supabase) {
        Write-Host "Supabase CLI not found. Installing..." -ForegroundColor Yellow
        npm install -g supabase
    } else {
        Write-Host "Supabase CLI is installed." -ForegroundColor Green
    }
}

function Connect-Project {
    Write-Host "Linking to Supabase project: $ProjectRef" -ForegroundColor Cyan
    supabase link --project-ref $ProjectRef
}

function Push-Migration {
    Write-Host "Pushing database migrations..." -ForegroundColor Cyan
    supabase db push
}

# Run
Test-SupabaseCLI
Connect-Project
Push-Migration

Write-Host "\nDone. Don't forget to add the following environment variables to your Supabase function settings:" -ForegroundColor Green
Write-Host "SUPABASE_URL -> https://$ProjectRef.supabase.co"
Write-Host "SUPABASE_ANON_KEY -> <your-anon-key>"
Write-Host "SUPABASE_SERVICE_ROLE_KEY -> <your-service-role-key> (KEEP THIS SECRET)"
Write-Host "\nIf you prefer to run SQL manually, run: psql -h <host> -U <user> -d <db> -f supabase/migrations/001_create_kv_store.sql"
