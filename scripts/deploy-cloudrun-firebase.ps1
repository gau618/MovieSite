# Deploy AI server (Cloud Run) + Frontend (Firebase Hosting)
# Usage: In PowerShell, run:  ./scripts/deploy-cloudrun-firebase.ps1

$ErrorActionPreference = "Stop"

function Require-Cli($name, $checkCmd) {
  try {
    & $checkCmd | Out-Null
  } catch {
    Write-Error "Missing $name CLI. Please install it and try again."
    exit 1
  }
}

Require-Cli "gcloud" { gcloud --version }
Require-Cli "firebase" { firebase --version }
Require-Cli "node" { node --version }
Require-Cli "npm" { npm --version }

# Project and region setup
$project = (gcloud config get-value project 2>$null)
if ([string]::IsNullOrWhiteSpace($project)) {
  Write-Host "No active gcloud project. Set it now (e.g. my-gcp-project):" -ForegroundColor Yellow
  $project = Read-Host "PROJECT_ID"
  if ([string]::IsNullOrWhiteSpace($project)) { Write-Error "PROJECT_ID required"; exit 1 }
  gcloud config set project $project | Out-Null
}
$env:PROJECT_ID = $project

# Default region
if ([string]::IsNullOrWhiteSpace($env:REGION)) {
  $env:REGION = "us-central1"
}

Write-Host "Using PROJECT_ID=$($env:PROJECT_ID), REGION=$($env:REGION)" -ForegroundColor Cyan

# Enable required services
Write-Host "Enabling required Google APIs..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com iam.googleapis.com | Out-Null

# Secret Manager: GEMINI_API_KEY
$secretId = "GEMINI_API_KEY"
Write-Host "Checking Secret Manager secret '$secretId'..." -ForegroundColor Cyan
$secretExists = $false
try {
  gcloud secrets describe $secretId | Out-Null
  $secretExists = $true
} catch {}

if (-not $secretExists) {
  Write-Host "Creating secret $secretId..." -ForegroundColor Yellow
  gcloud secrets create $secretId --replication-policy="automatic" | Out-Null
}

# Add a new version (prompt for key)
Write-Host "Paste your Gemini API key, then press Ctrl+Z and Enter:" -ForegroundColor Yellow
try {
  gcloud secrets versions add $secretId --data-file=-
} catch {
  Write-Error "Failed to add secret version. $_"; exit 1
}

# Grant Secret Accessor to Cloud Run runtime SA
Write-Host "Granting Secret Accessor to Cloud Run runtime SA..." -ForegroundColor Cyan
$projectNumber = (gcloud projects describe $env:PROJECT_ID --format="value(projectNumber)")
$runSa = "$projectNumber-compute@developer.gserviceaccount.com"
gcloud projects add-iam-policy-binding $env:PROJECT_ID `
  --member="serviceAccount:$runSa" `
  --role="roles/secretmanager.secretAccessor" | Out-Null

# Build and deploy Cloud Run
Write-Host "Building container with Cloud Build..." -ForegroundColor Cyan
gcloud builds submit --tag gcr.io/$env:PROJECT_ID/moviesite-ai

Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy moviesite-ai `
  --image gcr.io/$env:PROJECT_ID/moviesite-ai `
  --region $env:REGION `
  --allow-unauthenticated `
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest

# Fetch Cloud Run URL
$cloudRunUrl = (gcloud run services describe moviesite-ai --region $env:REGION --format="value(status.url)")
if ([string]::IsNullOrWhiteSpace($cloudRunUrl)) { Write-Error "Could not determine Cloud Run URL"; exit 1 }
Write-Host "Cloud Run URL: $cloudRunUrl" -ForegroundColor Green

# Build frontend with AI base URL
Write-Host "Building Vite app with VITE_AI_BASE_URL=$cloudRunUrl ..." -ForegroundColor Cyan
$env:VITE_AI_BASE_URL = $cloudRunUrl
npm run build

# Firebase: choose or use existing project
Write-Host "Configuring Firebase project..." -ForegroundColor Cyan
try {
  firebase projects:list 1>$null 2>$null
} catch {
  firebase login
}

# Let user pick or set default project for Hosting
try {
  firebase use --clear 1>$null 2>$null
} catch {}

Write-Host "Select your Firebase project (should match your GCP project if linked):" -ForegroundColor Yellow
firebase use --add

# Ensure hosting initialized
if (-not (Test-Path -Path "firebase.json")) {
  Write-Host "Initializing Firebase Hosting..." -ForegroundColor Cyan
  firebase init hosting
}

# Deploy Hosting
Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

Write-Host "All done!" -ForegroundColor Green
Write-Host "Frontend is live on Firebase Hosting. AI server is at: $cloudRunUrl" -ForegroundColor Green
