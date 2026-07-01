# MDJ Electric — Astro Project

## Stack
- **Astro** (static output) · **React** (contact form island) · **Tailwind CSS** · **TypeScript**
- **Backend**: AWS API Gateway → Lambda → SES (managed via Terraform)

---

## File Map

```
src/
├── components/
│   ├── Navbar.astro          # Fixed nav with mobile hamburger
│   ├── BoltDivider.astro     # Reusable lightning bolt section divider
│   ├── Hero.astro            # Hero section with family photo
│   ├── Services.astro        # Service cards (data-driven)
│   ├── Gallery.astro         # 3×2 project photo grid (data-driven)
│   ├── FAQ.astro             # Accordion FAQ (data-driven)
│   ├── About.astro           # Why choose us + story + reviews
│   ├── Contact.astro         # Info cards + React form shell
│   └── ContactForm.tsx       # ← React island, POSTs to API Gateway
├── layouts/
│   └── Layout.astro          # HTML shell + Google Fonts
├── pages/
│   └── index.astro           # Assembles all sections + client-side JS
└── styles/
    └── global.css            # All custom CSS + Tailwind directives

tailwind.config.mjs            # Gold/coal/ash color tokens
astro.config.mjs               # React + Tailwind integrations, static output
.env.example                   # Copy to .env, set PUBLIC_API_URL
```

---

## Setup

```bash
# 1. Install dependencies (in your skeleton project root)
npm install @astrojs/react @astrojs/tailwind tailwindcss react react-dom
npm install -D @types/react @types/react-dom

# 2. Copy environment file
cp .env.example .env
# Then edit .env and set PUBLIC_API_URL

# 3. Drop your images into public/images/
#    logoMDJnobackground.png
#    family-photo.JPG  (goes in public/Images/ — capital I, matches HTML)
#    kitchenlighting.JPG
#    Pilatesstudioprospect.JPG
#    Surgicalvetveterinarianlight.png
#    teslacharger.png
#    Ringfloodlight.png
#    coffeeshop.jpg
#    wrc-logo.png
#    cheshireprospectchamber.webp

# 4. Dev server
npm run dev

# 5. Build for CloudFront
npm run build
# Output goes to dist/ — deploy that folder to S3/CloudFront
```

---

## AWS API Gateway Integration

`ContactForm.tsx` sends a `POST` to `PUBLIC_API_URL` with this JSON body:

```json
{
  "firstName": "string",
  "lastName":  "string",
  "phone":     "string",
  "email":     "string",
  "service":   "string",
  "message":   "string",
  "source":    "mdj-electric-contact"
}
```

Your Lambda should return `200` on success (any non-2xx triggers the error UI).

### Expected Lambda response (success)
```json
{ "message": "Success" }
```

### CORS
API Gateway needs `Access-Control-Allow-Origin: *` (or your CloudFront domain) on the Lambda
response headers, and an OPTIONS preflight method on the `/contact` resource.

### Terraform Terraform tip
After `terraform apply`, grab the invoke URL from the output and set it in your CI/CD
environment or `.env`:

```hcl
output "api_url" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/contact"
}
```

---

## Deployment to CloudFront

```bash
npm run build   # produces dist/

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```
