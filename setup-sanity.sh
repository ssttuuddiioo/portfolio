#!/bin/bash

echo "🎨 Sanity Setup Helper"
echo "====================="
echo ""
echo "This will help you set up Sanity CMS for your portfolio."
echo ""
echo "Step 1: Create a Sanity Project"
echo "-------------------------------"
echo "1. Go to: https://www.sanity.io/manage"
echo "2. Login or create a free account"
echo "3. Click 'Create project' button"
echo "4. Name it 'Portfolio' (or anything you like)"
echo "5. Choose dataset: 'production'"
echo ""
read -p "Press Enter when you've created your project..."
echo ""
echo "Step 2: Get Your Project ID"
echo "---------------------------"
read -p "Enter your Sanity Project ID: " PROJECT_ID
echo ""
echo "Step 3: Create API Token"
echo "------------------------"
echo "1. In Sanity dashboard, go to: Settings → API → Tokens"
echo "2. Click 'Add API token'"
echo "3. Name it 'Portfolio Token'"
echo "4. Choose permissions: 'Editor'"
echo "5. Copy the token"
echo ""
read -p "Enter your Sanity API Token: " API_TOKEN
echo ""

# Update .env.local
cat > .env.local << EOF
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=$API_TOKEN
EOF

echo "✅ Configuration saved to .env.local"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Studio: http://localhost:3000/studio"
echo ""







