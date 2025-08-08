#!/bin/bash

# Script para ejecutar todas las pruebas de autenticación
# Uso: ./run_auth_tests.sh [--backend-only|--frontend-only|--integration-only]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
RUN_BACKEND=true
RUN_FRONTEND=true
RUN_INTEGRATION=true

# Parse command line arguments
case "$1" in
    --backend-only)
        RUN_FRONTEND=false
        RUN_INTEGRATION=false
        ;;
    --frontend-only)
        RUN_BACKEND=false
        RUN_INTEGRATION=false
        ;;
    --integration-only)
        RUN_BACKEND=false
        RUN_FRONTEND=false
        RUN_INTEGRATION=true
        ;;
    --help)
        echo "Usage: $0 [--backend-only|--frontend-only|--integration-only]"
        echo "  --backend-only     Run only backend authentication tests"
        echo "  --frontend-only    Run only frontend authentication tests"
        echo "  --integration-only Run only integration tests"
        echo "  (no args)          Run all tests"
        exit 0
        ;;
esac

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists python; then
    print_error "Python is not installed or not in PATH"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed or not in PATH"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed or not in PATH"
    exit 1
fi

print_success "Prerequisites check passed"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

print_status "Project root: $PROJECT_ROOT"

# Backend Tests
if [ "$RUN_BACKEND" = true ]; then
    print_status "Running Backend Authentication Tests..."
    
    cd "$BACKEND_DIR"
    
    # Check if virtual environment exists
    if [ ! -d ".venv" ]; then
        print_warning "Virtual environment not found. Creating one..."
        python -m venv .venv
    fi
    
    # Activate virtual environment
    if [ -f ".venv/Scripts/activate" ]; then
        # Windows
        source .venv/Scripts/activate
    elif [ -f ".venv/bin/activate" ]; then
        # Unix/Linux/Mac
        source .venv/bin/activate
    else
        print_error "Could not find virtual environment activation script"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -f ".venv/installed" ]; then
        print_status "Installing backend dependencies..."
        pip install -r requirements.txt
        touch .venv/installed
    fi
    
    # Run backend tests
    print_status "Executing backend authentication tests..."
    
    echo "1. Firebase Auth Tests..."
    python -m pytest tests/test_auth_firebase.py -v || {
        print_error "Firebase auth tests failed"
        exit 1
    }
    
    echo "2. User Controller Tests..."
    python -m pytest tests/test_user_controller.py -v || {
        print_error "User controller tests failed"
        exit 1
    }
    
    echo "3. Auth Endpoints Tests..."
    python -m pytest tests/test_users_auth_endpoints.py -v || {
        print_error "Auth endpoints tests failed"
        exit 1
    }
    
    print_success "Backend authentication tests completed successfully"
fi

# Frontend Tests
if [ "$RUN_FRONTEND" = true ]; then
    print_status "Running Frontend Authentication Tests..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm ci
    fi
    
    # Run frontend tests
    print_status "Executing frontend authentication tests..."
    
    echo "1. Auth Store Tests..."
    npm test -- auth.store.test.ts || {
        print_error "Auth store tests failed"
        exit 1
    }
    
    echo "2. Auth Component Tests..."
    npm test -- Auth.component.test.ts || {
        print_error "Auth component tests failed"
        exit 1
    }
    
    print_success "Frontend authentication tests completed successfully"
fi

# Integration Tests
if [ "$RUN_INTEGRATION" = true ]; then
    print_status "Running Integration Tests..."
    
    # Check if backend is running
    print_status "Checking if backend is running..."
    if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
        print_warning "Backend is not running. Starting backend for integration tests..."
        
        cd "$BACKEND_DIR"
        # Start backend in background
        source .venv/bin/activate || source .venv/Scripts/activate
        uvicorn app.main:app --reload --port 8000 &
        BACKEND_PID=$!
        
        # Wait for backend to start
        print_status "Waiting for backend to start..."
        for i in {1..30}; do
            if curl -f http://localhost:8000/health >/dev/null 2>&1; then
                print_success "Backend is now running"
                break
            fi
            if [ $i -eq 30 ]; then
                print_error "Backend failed to start within 30 seconds"
                kill $BACKEND_PID 2>/dev/null || true
                exit 1
            fi
            sleep 1
        done
    else
        print_success "Backend is already running"
        BACKEND_PID=""
    fi
    
    # Run integration tests
    cd "$BACKEND_DIR"
    python -m pytest tests/test_auth_integration.py -v || {
        print_error "Integration tests failed"
        if [ ! -z "$BACKEND_PID" ]; then
            kill $BACKEND_PID 2>/dev/null || true
        fi
        exit 1
    }
    
    # Run E2E frontend tests
    cd "$FRONTEND_DIR"
    npm test -- auth.e2e.test.ts || {
        print_error "E2E tests failed"
        if [ ! -z "$BACKEND_PID" ]; then
            kill $BACKEND_PID 2>/dev/null || true
        fi
        exit 1
    }
    
    # Clean up background processes
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Stopping background backend process..."
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    
    print_success "Integration tests completed successfully"
fi

# Summary
echo
print_success "🎉 All Authentication Tests Completed Successfully! 🎉"
echo
echo "Test Summary:"
if [ "$RUN_BACKEND" = true ]; then
    echo "  ✅ Backend Authentication Tests"
fi
if [ "$RUN_FRONTEND" = true ]; then
    echo "  ✅ Frontend Authentication Tests"
fi
if [ "$RUN_INTEGRATION" = true ]; then
    echo "  ✅ Integration Tests"
fi
echo

print_status "Authentication system is working correctly!"
