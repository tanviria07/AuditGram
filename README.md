# AuditGram

AuditGram is a privacy-first, client-side tool to analyze your Instagram followers and following data. Discover who doesn't follow you back, your fans, and mutuals without ever sending your data to a server.

## How to Run Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser.

## How to Deploy (Firebase Hosting)

1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login to Firebase: `firebase login`
4. Initialize Firebase: `firebase init hosting` (Select the `dist` folder as the public directory)
5. Deploy: `firebase deploy --only hosting`

## Privacy Statement

AuditGram processes all data locally in your browser. Your Instagram ZIP file or JSON files are never uploaded, stored, or transmitted to any server.

## Expected Files

AuditGram expects either:
- The full Instagram data ZIP file containing `followers_and_following/followers_1.json` and `followers_and_following/following.json`.
- The individual `followers_1.json` and `following.json` files.
