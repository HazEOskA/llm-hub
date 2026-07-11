# LLM Hub

Interaktywny dashboard modeli LLM z analizą generowaną przez Anthropic API.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Environment

Set `ANTHROPIC_API_KEY` in Vercel project settings. The key is used only by the serverless function at `api/analyze.js` and is never exposed to the browser.
