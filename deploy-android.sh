#!/bin/bash

###############################################################################
# THE ARENA - One-Tap Android Deployment
# Deploy to Android phone in one command
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

pause_and_continue() {
    echo ""
    read -p "Press ENTER to continue..."
    echo ""
}

###############################################################################
# Step 1: Verify Prerequisites
###############################################################################

verify_prerequisites() {
    print_header "Step 1: Verifying Prerequisites"
    
    local missing=0
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found"
        missing=$((missing + 1))
    else
        print_success "Node.js installed"
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm not found"
        missing=$((missing + 1))
    else
        print_success "npm installed"
    fi
    
    if [ $missing -gt 0 ]; then
        print_error "Please install missing tools"
        exit 1
    fi
    
    echo ""
}

###############################################################################
# Step 2: Install Dependencies
###############################################################################

install_dependencies() {
    print_header "Step 2: Installing Dependencies"
    
    print_info "Installing EAS CLI..."
    npm install -g eas-cli expo-cli 2>&1 | tail -5
    
    print_success "Dependencies installed"
    echo ""
}

###############################################################################
# Step 3: Authenticate with Expo
###############################################################################

authenticate() {
    print_header "Step 3: Authenticate with Expo"
    
    print_info "You need an Expo account to deploy"
    print_info "Create one at: https://expo.dev"
    echo ""
    
    eas login
    
    print_success "Authenticated with Expo"
    echo ""
}

###############################################################################
# Step 4: Build APK
###############################################################################

build_apk() {
    print_header "Step 4: Building Android APK"
    
    print_info "Building APK for Android..."
    print_info "This may take 5-10 minutes..."
    echo ""
    
    eas build --platform android
    
    print_success "APK build complete!"
    echo ""
}

###############################################################################
# Step 5: Instructions
###############################################################################

print_instructions() {
    print_header "Step 5: Installation Instructions"
    
    echo ""
    echo -e "${GREEN}🎉 Your APK is ready!${NC}"
    echo ""
    
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Check your email for download link"
    echo "2. Download APK to your Android phone"
    echo "3. Open file manager on phone"
    echo "4. Tap the APK file"
    echo "5. Tap 'Install'"
    echo "6. Grant permissions"
    echo "7. Launch THE ARENA"
    echo ""
    
    echo -e "${BLUE}Or use USB cable:${NC}"
    echo "1. Connect Android phone via USB"
    echo "2. Enable USB debugging (Settings → Developer Options)"
    echo "3. Run: adb install the-arena-mobile.apk"
    echo ""
    
    echo -e "${BLUE}Or scan QR code:${NC}"
    echo "1. Check email for QR code"
    echo "2. Scan with phone camera"
    echo "3. Download and install"
    echo ""
    
    echo -e "${GREEN}Built by NO_GAS_LABS™${NC}"
    echo "The future of thought is collaborative"
    echo ""
}

###############################################################################
# Main
###############################################################################

main() {
    clear
    
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║        THE ARENA - One-Tap Android Deployment                 ║"
    echo "║                  Unified Cognitive Operating System           ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    verify_prerequisites
    pause_and_continue
    
    install_dependencies
    pause_and_continue
    
    authenticate
    pause_and_continue
    
    build_apk
    pause_and_continue
    
    print_instructions
}

main
