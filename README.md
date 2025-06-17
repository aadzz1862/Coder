# Referral Extension

Chrome extension for sending polite Gmail referral requests when applying for jobs.

## Folder Structure

```
extension/
  manifest.json
  popup.html
  options.html
  public/
    icons/
      icon.png (placeholder)
  src/
    GmailOAuth.ts
    popup/
      App.tsx
      index.tsx
    background/
      index.ts
    options/
      index.ts
    content/
      index.ts
.github/
  workflows/
    ci.yml
__tests__/
  gmailOAuth.test.ts
```
