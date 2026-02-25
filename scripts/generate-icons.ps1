$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot '..\public\images\logo-snack.png'
if (!(Test-Path $src)) {
  throw "Logo introuvable: $src"
}

function New-ContainedSquareBitmap([System.Drawing.Image]$img) {
  # Eviter de couper le logo: on "contient" l'image dans un carré avec un peu de marge.
  $base = [Math]::Max($img.Width, $img.Height)
  $size = [int][Math]::Ceiling($base * 1.02) # ~2% de marge

  $square = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($square)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Black)

  $x = [Math]::Floor(($size - $img.Width) / 2)
  $y = [Math]::Floor(($size - $img.Height) / 2)
  $g.DrawImage($img, $x, $y, $img.Width, $img.Height)
  $g.Dispose()

  return $square
}

function Save-Png([System.Drawing.Bitmap]$bmp, [int]$w, [int]$h, [string]$path) {
  $out = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($bmp, 0, 0, $w, $h)
  $g.Dispose()

  $dir = Split-Path -Parent $path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

function Save-Ico256([System.Drawing.Bitmap]$bmp, [string]$path) {
  $icoBmp = New-Object System.Drawing.Bitmap 256, 256
  $g = [System.Drawing.Graphics]::FromImage($icoBmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($bmp, 0, 0, 256, 256)
  $g.Dispose()

  $dir = Split-Path -Parent $path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  $icon = [System.Drawing.Icon]::FromHandle($icoBmp.GetHicon())
  $fs = [System.IO.File]::Open($path, [System.IO.FileMode]::Create)
  $icon.Save($fs)
  $fs.Close()
  $icon.Dispose()
  $icoBmp.Dispose()
}

$img = [System.Drawing.Image]::FromFile($src)
try {
  $square = New-ContainedSquareBitmap $img
  try {
    # Next.js app icons (served at /icon.png, /apple-icon.png, /favicon.ico)
    Save-Png $square 512 512 (Join-Path $PSScriptRoot '..\app\icon.png')
    Save-Png $square 180 180 (Join-Path $PSScriptRoot '..\app\apple-icon.png')
    Save-Ico256 $square (Join-Path $PSScriptRoot '..\app\favicon.ico')

    # Manifest icons (served from /public)
    Save-Png $square 192 192 (Join-Path $PSScriptRoot '..\public\icons\icon-192.png')
    Save-Png $square 512 512 (Join-Path $PSScriptRoot '..\public\icons\icon-512.png')
  } finally {
    $square.Dispose()
  }
} finally {
  $img.Dispose()
}

Write-Output 'OK: icons generated'

