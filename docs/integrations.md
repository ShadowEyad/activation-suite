# Storefront integrations

Deploy the Worker first. Embed files need your HTTPS Worker URL; browser integrations must never receive database or provider secrets. Match the OTP or `-no-otp` files to your intended customer flow.

## Generic HTML

Copy `integrations/activation-widget.html` into a page that permits inline styles and scripts. Set `data-api` on `ap-root` to your Worker URL, with no trailing slash. Set the brand and support email attributes as needed. The `-no-otp` file calls direct activation.

Use one widget per page: its element IDs are fixed.

## Shopify

These are **theme files**, not page rich-text content.

1. Add `integrations/shopify/sections/activation-portal.liquid` to your theme's `sections/` folder.
2. Add `integrations/shopify/snippets/activation-widget-content.liquid` to `snippets/`.
3. Add the Activation Portal section in the theme editor and set its backend URL, branding, and support email.
4. For direct activation, use the matching `activation-portal-no-otp.liquid` section and `activation-widget-content-no-otp.liquid` snippet.

The original package omitted the snippet referenced by its sections. This repository supplies it from the corresponding standalone widget. The top-level `shopify-section*.liquid` files are convenience copies; the matching snippet is still required.

## WordPress / Elementor

Use `integrations/wordpress-elementor-embed.html` in a Custom HTML block or Elementor HTML widget. Set `backendApiUrl`, `brandName`, and `supportEmail` in the script. The embed fetches the Worker portal and writes it to an iframe. Your hosting/editor permissions must allow these scripts.

## BigCommerce

Use `integrations/bigcommerce-custom-template.html` in a page or template that permits scripts. Configure the backend URL and branding variables in the file before publishing.

## Wix

Use `integrations/wix-velo-embed.html` in an HTML embed and set its `data-api` and branding values. Check the published site as well as the editor preview.

## Compatibility checks

The files were inspected and their browser scripts were syntax-checked. Installation in live Shopify, Wix, BigCommerce, and WordPress sites has not been tested. Check activation, mobile layout, iframe behavior, and email delivery on your own storefront. Current CORS configuration is not an authorization boundary; see [security findings](security.md).
