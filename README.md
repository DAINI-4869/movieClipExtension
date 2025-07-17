# Netflix Movie Clipper

A Chrome extension that allows you to easily clip scenes from Netflix videos.

## 🚀 Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npx webpack
```

### 3. Load as a Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer Mode"
3. Click "Load unpacked" and select the `./` folder

## 🌐 API Configuration

The API endpoint is defined in `src/config/api.js`:

```js
export const API_URL = 'http://localhost:3000/api/';
```
