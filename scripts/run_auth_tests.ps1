# Script PowerShell para ejecutar todas las pruebas de autenticación
# Uso: .\run_auth_tests.ps1 [-BackendOnly] [-FrontendOnly] [-IntegrationOnly]

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$IntegrationOnly,
    [switch]$Help
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

if ($Help) {
    Write-Host "Usage: .\run_auth_tests.ps1 [-BackendOnly] [-FrontendOnly] [-IntegrationOnly]" -ForegroundColor $Blue
    Write-Host "  -BackendOnly       Run only backend authentication tests" -ForegroundColor $Blue
    Write-Host "  -FrontendOnly      Run only frontend authentication tests" -ForegroundColor $Blue
    Write-Host "  -IntegrationOnly   Run only integration tests" -ForegroundColor $Blue
    Write-Host "  (no params)        Run all tests" -ForegroundColor $Blue
    exit 0
}

# Default options
$RunBackend = $true
$RunFrontend = $true
$RunIntegration = $true

if ($BackendOnly) {
    $RunFrontend = $false
    $RunIntegration = $false
}
elseif ($FrontendOnly) {
    $RunBackend = $false
    $RunIntegration = $false
}
elseif ($IntegrationOnly) {
    $RunBackend = $false
    $RunFrontend = $false
}

# Function to print colored output
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

# Function to check if command exists
function Test-Command {
    param($Command)
    return (Get-Command $Command -ErrorAction SilentlyContinue) -ne $null
}

# Check prerequisites
Write-Status "Checking prerequisites..."

if (-not (Test-Command "python")) {
    Write-Error "Python is not installed or not in PATH"
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Error "Node.js is not installed or not in PATH"
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Error "npm is not installed or not in PATH"
    exit 1
}

Write-Success "Prerequisites check passed"

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Status "Project root: $ProjectRoot"

# Backend Tests
if ($RunBackend) {
    Write-Status "Running Backend Authentication Tests..."
    
    Set-Location $BackendDir
    
    # Check if virtual environment exists
    if (-not (Test-Path ".venv")) {
        Write-Warning "Virtual environment not found. Creating one..."
        python -m venv .venv
    }
    
    # Activate virtual environment
    $ActivateScript = ".venv\Scripts\Activate.ps1"
    if (Test-Path $ActivateScript) {
        & $ActivateScript
    } else {
        Write-Error "Could not find virtual environment activation script"
        exit 1
    }
    
    # Install dependencies if needed
    if (-not (Test-Path ".venv\installed")) {
        Write-Status "Installing backend dependencies..."
        pip install -r requirements.txt
        New-Item -Path ".venv\installed" -ItemType File -Force | Out-Null
    }
    
    # Run backend tests
    Write-Status "Executing backend authentication tests..."
    
    Write-Host "1. Firebase Auth Tests..." -ForegroundColor $Blue
    $result = & python -m pytest tests/test_auth_firebase.py -v
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Firebase auth tests failed"
        exit 1
    }
    
    Write-Host "2. User Controller Tests..." -ForegroundColor $Blue
    $result = & python -m pytest tests/test_user_controller.py -v
    if ($LASTEXITCODE -ne 0) {
        Write-Error "User controller tests failed"
        exit 1
    }
    
    Write-Host "3. Auth Endpoints Tests..." -ForegroundColor $Blue
    $result = & python -m pytest tests/test_users_auth_endpoints.py -v
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Auth endpoints tests failed"
        exit 1
    }
    
    Write-Success "Backend authentication tests completed successfully"
}

# Frontend Tests
if ($RunFrontend) {
    Write-Status "Running Frontend Authentication Tests..."
    
    Set-Location $FrontendDir
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Status "Installing frontend dependencies..."
        npm ci
    }
    
    # Run frontend tests
    Write-Status "Executing frontend authentication tests..."
    
    Write-Host "1. Auth Store Tests..." -ForegroundColor $Blue
    $result = & npm test -- auth.store.test.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Auth store tests failed"
        exit 1
    }
    
    Write-Host "2. Auth Component Tests..." -ForegroundColor $Blue
    $result = & npm test -- Auth.component.test.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Auth component tests failed"
        exit 1
    }
    
    Write-Success "Frontend authentication tests completed successfully"
}

# Integration Tests
if ($RunIntegration) {
    Write-Status "Running Integration Tests..."
    
    # Check if backend is running
    Write-Status "Checking if backend is running..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
        $BackendRunning = $response.StatusCode -eq 200
    } catch {
        $BackendRunning = $false
    }
    
    $BackendProcess = $null
    
    if (-not $BackendRunning) {
        Write-Warning "Backend is not running. Starting backend for integration tests..."
        
        Set-Location $BackendDir
        
        # Activate virtual environment
        & ".venv\Scripts\Activate.ps1"
        
        # Start backend in background
        $BackendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000" -PassThru -NoNewWindow
        
        # Wait for backend to start
        Write-Status "Waiting for backend to start..."
        $timeout = 30
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 1
            $elapsed++
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2
                if ($response.StatusCode -eq 200) {
                    Write-Success "Backend is now running"
                    $BackendRunning = $true
                    break
                }
            } catch {
                # Continue waiting
            }
            
            if ($elapsed -ge $timeout) {
                Write-Error "Backend failed to start within 30 seconds"
                if ($BackendProcess) {
                    Stop-Process -Id $BackendProcess.Id -Force
                }
                exit 1
            }
        } while (-not $BackendRunning)
    } else {
        Write-Success "Backend is already running"
    }
    
    # Run integration tests
    Set-Location $BackendDir
    $result = & python -m pytest tests/test_auth_integration.py -v
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Integration tests failed"
        if ($BackendProcess) {
            Stop-Process -Id $BackendProcess.Id -Force
        }
        exit 1
    }
    
    # Run E2E frontend tests
    Set-Location $FrontendDir
    $result = & npm test -- auth.e2e.test.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Error "E2E tests failed"
        if ($BackendProcess) {
            Stop-Process -Id $BackendProcess.Id -Force
        }
        exit 1
    }
    
    # Clean up background processes
    if ($BackendProcess) {
        Write-Status "Stopping background backend process..."
        Stop-Process -Id $BackendProcess.Id -Force
    }
    
    Write-Success "Integration tests completed successfully"
}

# Summary
Write-Host ""
Write-Success "🎉 All Authentication Tests Completed Successfully! 🎉"
Write-Host ""
Write-Host "Test Summary:" -ForegroundColor $Blue
if ($RunBackend) {
    Write-Host "  ✅ Backend Authentication Tests" -ForegroundColor $Green
}
if ($RunFrontend) {
    Write-Host "  ✅ Frontend Authentication Tests" -ForegroundColor $Green
}
if ($RunIntegration) {
    Write-Host "  ✅ Integration Tests" -ForegroundColor $Green
}
Write-Host ""

Write-Status "Authentication system is working correctly!"
