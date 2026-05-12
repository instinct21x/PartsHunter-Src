# Android Development Setup Script
# This script sets up Java and configures the environment for Expo Android builds

# Extract the downloaded JDK
Write-Host "Extracting OpenJDK 17..." -ForegroundColor Green
if (Test-Path "C:\Temp\jdk17.zip") {
    Expand-Archive -Path "C:\Temp\jdk17.zip" -DestinationPath "C:\Java" -Force
    
    # Find the actual JDK folder (it's nested inside the extracted archive)
    $jdkFolder = Get-ChildItem -Path "C:\Java" -Directory | Select-Object -First 1
    $jdkPath = $jdkFolder.FullName
    
    Write-Host "JDK extracted to: $jdkPath" -ForegroundColor Green
    
    # Set JAVA_HOME environment variable (User level - persistent)
    Write-Host "Setting JAVA_HOME environment variable..." -ForegroundColor Green
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $jdkPath, "User")
    
    # Add Java to PATH (User level - persistent)
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$jdkPath*") {
        $newPath = "$jdkPath\bin;$currentPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added Java bin directory to PATH" -ForegroundColor Green
    }
    
    # Set JAVA_HOME for current session
    $env:JAVA_HOME = $jdkPath
    $env:Path = "$jdkPath\bin;$env:Path"
    
    # Verify Java installation
    Write-Host "Verifying Java installation..." -ForegroundColor Green
    & "$jdkPath\bin\java.exe" -version
    
    Write-Host "Java setup complete! You may need to restart your terminal or IDE." -ForegroundColor Green
} else {
    Write-Host "JDK zip not found at C:\Temp\jdk17.zip" -ForegroundColor Red
}
