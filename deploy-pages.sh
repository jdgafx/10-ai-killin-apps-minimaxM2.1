#!/bin/bash
set -e

echo "🚀 Deploying to Cloudflare Pages..."

# Build each app
for app in app-01-ai-code-reviewer \
           app-02-document-chat \
           app-03-image-generator \
           app-04-voice-assistant \
           app-05-code-explainer \
           app-06-test-generator \
           app-07-api-integrator \
           app-08-data-visualizer \
           app-09-autonomous-agent \
           app-10-rag-knowledge-base; do
  echo "Building $app..."
  cd apps/$app
  npm run build
  cd ../..
done

echo "✅ All apps built successfully"
echo "📦 Deploying to Cloudflare Pages..."
cd apps/app-01-ai-code-reviewer
wrangler pages deploy dist --project-name=10-ai-killin-apps --commit-dirty=true

echo "🎉 Deployed successfully!"
