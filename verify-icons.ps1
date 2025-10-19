# Verify PWA Icons Script

Write-Host "`n🎨 Checking PWA Icons..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$iconsPath = "public/icons"
$required = @(72, 96, 128, 144, 152, 192, 384, 512)

# Check if icons directory exists
if (-not (Test-Path $iconsPath)) {
    Write-Host "❌ Icons directory not found at: $iconsPath" -ForegroundColor Red
    exit 1
}

# Get existing icon files
$existing = @()
Get-ChildItem "$iconsPath/icon-*.png" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -match 'icon-(\d+)x\1.png') {
        $existing += [int]$Matches[1]
    }
}

$allGood = $true

# Check each required size
foreach ($size in $required) {
    $filename = "icon-${size}x${size}.png"
    if ($existing -contains $size) {
        $file = Get-Item "$iconsPath/$filename"
        $sizeKB = [math]::Round($file.Length / 1KB, 2)
        Write-Host "✅ $filename ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ $filename - MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

if ($allGood) {
    Write-Host "🎉 All PWA icons are present!" -ForegroundColor Green
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. git add public/icons/" -ForegroundColor White
    Write-Host "2. git commit -m 'Add PWA icons'" -ForegroundColor White
    Write-Host "3. Continue with backend setup (see DEPLOY.md)" -ForegroundColor White
} else {
    Write-Host "⚠️  Some icons are missing. Please generate them." -ForegroundColor Yellow
    Write-Host "`n📝 Options:" -ForegroundColor Cyan
    Write-Host "- Use the browser generator (public/generate-icons.html)" -ForegroundColor White
    Write-Host "- Run: .\generate-pwa-icons.ps1" -ForegroundColor White
    Write-Host "- See: ICONS_SETUP.md for more options" -ForegroundColor White
}

Write-Host ""
