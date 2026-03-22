# ============================================
# Calma Calma - One-click APK Builder
# Run this once: right-click > Run with PowerShell
# ============================================

Write-Host ""
Write-Host "=== CALMA CALMA APK BUILDER ===" -ForegroundColor Cyan
Write-Host ""

# Set variables
$PROJECT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$SDK_DIR = "$env:LOCALAPPDATA\Android\Sdk"
$JAVA_HOME_PATH = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"

# Check Java
if (-not (Test-Path $JAVA_HOME_PATH)) {
    $jdkDir = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($jdkDir) {
        $JAVA_HOME_PATH = $jdkDir.FullName
    } else {
        Write-Host "Java not found! Installing..." -ForegroundColor Yellow
        winget install EclipseAdoptium.Temurin.17.JDK --accept-source-agreements --accept-package-agreements
        $jdkDir = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -ErrorAction SilentlyContinue | Select-Object -First 1
        $JAVA_HOME_PATH = $jdkDir.FullName
    }
}
$env:JAVA_HOME = $JAVA_HOME_PATH
Write-Host "Java: $JAVA_HOME_PATH" -ForegroundColor Green

# Check/Install Android SDK
if (-not (Test-Path "$SDK_DIR\cmdline-tools\latest\bin\sdkmanager.bat")) {
    Write-Host "Installing Android SDK command-line tools..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$SDK_DIR\cmdline-tools" | Out-Null

    $zipFile = "$env:TEMP\cmdline-tools.zip"
    Write-Host "  Downloading..." -ForegroundColor Gray
    Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $zipFile

    Write-Host "  Extracting..." -ForegroundColor Gray
    Expand-Archive $zipFile -DestinationPath "$SDK_DIR\cmdline-tools" -Force

    if (Test-Path "$SDK_DIR\cmdline-tools\cmdline-tools") {
        Rename-Item "$SDK_DIR\cmdline-tools\cmdline-tools" "latest"
    }
    Remove-Item $zipFile -Force
}
$env:ANDROID_HOME = $SDK_DIR
$env:ANDROID_SDK_ROOT = $SDK_DIR
Write-Host "Android SDK: $SDK_DIR" -ForegroundColor Green

# Accept licenses and install platform
$sdkmanager = "$SDK_DIR\cmdline-tools\latest\bin\sdkmanager.bat"
if (-not (Test-Path "$SDK_DIR\platforms\android-34")) {
    Write-Host "Installing Android platform 34 and build tools..." -ForegroundColor Yellow
    echo "y`ny`ny`ny`ny`ny`ny`n" | & $sdkmanager "platforms;android-34" "build-tools;34.0.0"
}
Write-Host "Android platform ready" -ForegroundColor Green

# Write local.properties so Gradle finds the SDK
Set-Content -Path "$PROJECT_DIR\android\local.properties" -Value "sdk.dir=$($SDK_DIR -replace '\\', '/')"

# Install npm dependencies
Set-Location $PROJECT_DIR
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Write-Host "npm install FAILED!" -ForegroundColor Red; pause; exit 1 }
Write-Host "Dependencies installed" -ForegroundColor Green

# Clear old build so we get a fresh one
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
Write-Host "Cleared old build cache" -ForegroundColor Gray

# Build web app
Write-Host "Building web app..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--openssl-legacy-provider"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Web build FAILED!" -ForegroundColor Red; pause; exit 1 }
Write-Host "Web app built" -ForegroundColor Green

# Sync to Android
Write-Host "Syncing to Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Host "Capacitor sync FAILED!" -ForegroundColor Red; pause; exit 1 }
Write-Host "Synced" -ForegroundColor Green

# Clear old APK
$oldApk = "$PROJECT_DIR\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $oldApk) { Remove-Item -Force $oldApk }

# Build APK
Write-Host ""
Write-Host "Building APK... (this may take a few minutes the first time)" -ForegroundColor Yellow
& "$PROJECT_DIR\android\gradlew.bat" -p "$PROJECT_DIR\android" assembleDebug 2>&1 | ForEach-Object {
    Write-Host $_
    if ($_ -match "BUILD SUCCESSFUL") { Write-Host $_ -ForegroundColor Green }
    elseif ($_ -match "BUILD FAILED") { Write-Host $_ -ForegroundColor Red }
}

# Check result
$apkPath = "$PROJECT_DIR\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $size = [math]::Round((Get-Item $apkPath).Length / 1MB, 1)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  APK BUILT SUCCESSFULLY! ($size MB)" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your APK is at:" -ForegroundColor Cyan
    Write-Host "  $apkPath" -ForegroundColor White
    Write-Host ""
    Write-Host "To get it on your Samsung S25 Ultra:" -ForegroundColor Cyan
    Write-Host "  1. Email it to yourself, OR" -ForegroundColor White
    Write-Host "  2. Upload to Google Drive, OR" -ForegroundColor White
    Write-Host "  3. Connect phone via USB and copy it" -ForegroundColor White
    Write-Host ""
    Write-Host "Then tap the APK on your phone to install." -ForegroundColor White
    Write-Host "(Allow 'Install from unknown sources' when prompted)" -ForegroundColor Gray
    Write-Host ""

    # Open the folder containing the APK
    explorer.exe (Split-Path $apkPath)
} else {
    Write-Host ""
    Write-Host "Build failed. Check the error messages above." -ForegroundColor Red
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
