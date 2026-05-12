# Android Build Setup - Quick Fix Guide

## Issues Found & Fixes Applied

### 1. ✅ Metro File Watcher Error (FIXED)
**File Created:** `metro.config.js`
- Configures Metro bundler to exclude the `.cxx` build directory
- Prevents "ENOENT: no such file or directory" errors
- Automatically applied to future builds

### 2. ⚠️ JAVA_HOME Not Set (NEEDS ACTION)
**File Created:** `setup-java.ps1`

**Steps to Fix:**

#### Option A: Automated Setup (Recommended)
```powershell
# Run this command in PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
.\setup-java.ps1
```

#### Option B: Manual Setup
1. Extract the JDK that was downloaded:
   - File location: `C:\Temp\jdk17.zip`
   - Extract to: `C:\Java\` (or your preferred location)

2. Set Environment Variables (Control Panel → Environment Variables):
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Java\jdk-17.0.10+7` (adjust path if different)
   - Add to PATH: `%JAVA_HOME%\bin`

3. Restart your terminal/IDE after setting variables

## After Setup Complete

Run the build command again:
```bash
npm start
# Then press 'a' to open Android, OR
npx expo run:android
```

## Troubleshooting

If you still get Metro errors:
```bash
# Clear cache and rebuild
rm -r node_modules/.cache
npm run android
```

If you get "Can't find service: package" error:
- Make sure Android emulator is fully booted: `adb shell getprop sys.boot_completed` (should return 1)
- Try restarting the emulator
- Check that emulator has minimum 2GB RAM allocated

## Verification

After Java setup, verify installation:
```bash
java -version
echo %JAVA_HOME%
```

Both commands should work without errors.
