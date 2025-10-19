param([switch]$Auto)

# Minimal PWA placeholder icon generator using System.Drawing
$iconsDir = "public\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

$sizes = @(72,96,128,144,152,192,384,512)
Add-Type -AssemblyName System.Drawing

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $bg = [System.Drawing.Color]::FromArgb(0xFF,0xFF,0x17,0x44) # #FF1744
    $g.Clear($bg)

    $white = [System.Drawing.Color]::White
    $wbrush = New-Object System.Drawing.SolidBrush $white
    $diam = [math]::Floor($size * 0.5)
    $x = [math]::Floor(($size - $diam) / 2)
    $y = [math]::Floor(($size - $diam) / 2)
    $g.FillEllipse($wbrush, $x, $y, $diam, $diam)

    $fontSize = [math]::Floor($size * 0.35)
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0xFF,0xFF,0x17,0x44))
    $rect = New-Object System.Drawing.RectangleF(0,0,$size,$size)
    $g.DrawString("V", $font, $textBrush, $rect, $sf)

    $filename = Join-Path $iconsDir ("icon-${size}x${size}.png")
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $filename"
}

Write-Host "All placeholder icons created in $iconsDir"
