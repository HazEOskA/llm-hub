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

Set these variables in Vercel Project Settings → Environment Variables:

```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5
```

`ANTHROPIC_MODEL` is optional. The backend defaults to `claude-sonnet-5`.

The browser calls `/api/analyze`. Only the Vercel serverless function contacts Anthropic, so the API key is never exposed to the frontend. The backend also caps output tokens and ignores any client-provided model name.
