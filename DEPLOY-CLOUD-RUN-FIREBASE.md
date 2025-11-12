# Deploy MovieSite: Cloud Run (AI server) + Firebase Hosting (frontend)

This guide deploys the AI server to Cloud Run and the Vite frontend to Firebase Hosting.
Works great on the free tiers and scales automatically.

## Prerequisites

- Google Cloud project with billing enabled
- Google Cloud SDK installed and logged in
- Firebase CLI installed and logged in
- Node.js 18+ locally

## 1) Set up project

```powershell
# Replace with your GCP project id
## Prerequisites
- Google Cloud project with billing enabled
- Google Cloud SDK installed and logged in
- Firebase CLI installed and logged in
- Node.js 18+ locally
gcloud config set project $env:PROJECT_ID
```

## 2) Store Gemini API key in Secret Manager

````powershell
# Create secret GEMINI_API_KEY with your key value
# (Paste when prompted)
$env:SECRET_ID = "GEMINI_API_KEY"
## 1) Quick deploy with a single script (recommended)
Run this PowerShell script from the repo root; it will:
- Detect or prompt for your GCP project
- Enable APIs
- Store/rotate your GEMINI_API_KEY in Secret Manager
- Build and deploy Cloud Run (AI server)
- Build and deploy Firebase Hosting (frontend)

```powershell
./scripts/deploy-cloudrun-firebase.ps1
````

gcloud secrets create $env:SECRET_ID --data-file=-

````

Paste your key and press Ctrl+Z then Enter on Windows PowerShell.

Alternatively, create the secret in the Cloud Console: Security → Secret Manager.

## 3) Build and deploy AI server to Cloud Run

```powershell
## 2) Manual steps if you prefer (expert)

### a) Set project and region
```powershell
$env:PROJECT_ID = (gcloud config get-value project)
if (-not $env:PROJECT_ID) { $env:PROJECT_ID = "your-project-id" }
$env:REGION = "us-central1"  # change if needed
gcloud config set project $env:PROJECT_ID
````

### b) Enable required services

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com iam.googleapis.com
```

### c) Store Gemini API key in Secret Manager

```powershell
$env:SECRET_ID = "GEMINI_API_KEY"
gcloud secrets create $env:SECRET_ID --replication-policy="automatic"
Write-Host "Paste your Gemini API key, then Ctrl+Z and Enter"
gcloud secrets versions add $env:SECRET_ID --data-file=-
```

# Build image with Cloud Build

gcloud builds submit --tag gcr.io/$env:PROJECT_ID/moviesite-ai

# Deploy Cloud Run service (public)

gcloud run deploy moviesite-ai `  --image gcr.io/$env:PROJECT_ID/moviesite-ai`
--region $env:REGION `  --allow-unauthenticated`
--set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest

````

After deploy, note the URL, e.g. https://moviesite-ai-xxxx-uc.a.run.app

## 4) Build and deploy the frontend to Firebase Hosting
### d) Build and deploy AI server to Cloud Run

```powershell
# Use the Cloud Run URL for the AI base URL at build time
$env:VITE_AI_BASE_URL = "https://moviesite-ai-xxxx-uc.a.run.app"

# Build Vite app
npm run build

# Initialize Hosting once (if not already)
firebase use --add                        # choose or create a project
firebase init hosting                     # select: dist as public, SPA = Yes

# Deploy
firebase deploy --only hosting
````

The site will be available at https://<your-project>.web.app (add a custom domain later if you want).

## 5) (Optional) Restrict CORS on AI server

In `server/index.js`, replace:

```js
app.use(cors());
```

### e) Build and deploy the frontend to Firebase Hosting

with:
$env:VITE_AI_BASE_URL = (gcloud run services describe moviesite-ai --region $env:REGION --format="value(status.url)")

```js
app.use(
  cors({ origin: ["https://<your-project>.web.app", "https://<your-domain>"] })
);
```

Then rebuild and redeploy the server (step 3).

## 6) Verify

- Visit https://<your-project>.web.app
- Open DevTools console and confirm it logs: `AI_BASE_URL: https://moviesite-ai-...a.run.app`
- Natural-language searches should show the overlay and then navigate to Explore with filters.

## 3) (Optional) Restrict CORS on AI server

In `server/index.js`, replace:

## Notes

- Cloud Run sets the `PORT` env var automatically; the server listens on it.
- The Gemini API key is only stored in Secret Manager (never in the image or source).
- To update the server, re-run step 3; to update the frontend, re-run step 4.
