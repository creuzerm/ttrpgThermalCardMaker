# AI Development Guidelines for Bags of Folding

This document provides guidelines for AI agents working on the "Bags of Folding" project. The goal is to ensure consistency in style, theme, and tone, aligning with the project's brand identity.

## Core Principles

### 1. Visual Style: "Dragon's Hoard"

*   **Primary Color Palette:**
    *   **Parchment:** `#f5f5dc` (Off-white, for backgrounds or primary elements on dark backgrounds)
    *   **Burgundy:** `#800020` (Rich, deep red, for text, icons on light backgrounds, or dark mode backgrounds)
    *   **Silver:** `#c0c0c0` (Accent color, for highlights, borders, or subtle magical effects)
*   **Typography:**
    *   **Primary Font:** Cinzel. This font should be used for headings, titles, and prominent text elements. It provides a clean, classic fantasy feel.
    *   **Body Font:** Lora, a serif font, is used for body text. Cinzel is preferred for headings.

### 2. Thematic Elements

*   **Portability:** The core concept of "Bags of Folding" is the ability to carry entire worlds or complex structures easily. This theme should be reflected in the ease of use and compact design of any features.
*   **Transformation:** The idea of things unfolding, expanding, or changing form is central. Visual cues of folding, unfolding, or modularity are encouraged.
*   **Fantasy Architecture:** Designs should evoke a sense of wonder and possibility, drawing inspiration from classic fantasy castles, keeps, dungeons, and magical structures. Stylized, almost paper-craft-like representations are preferred over hyper-realism.

### 3. Logo and Branding: "The Bag of Holding"

*   **Primary Logo Concept: "The Bag of Holding"**
    *   **Icon:** A simple, stylized icon of a classic drawstring pouch or bag. Emerging from the top of the open bag is the silhouette of a small, foldable castle or keep. The keep should look slightly stylized, almost like it's made of folded paper or panels. A subtle crease or fold line could be integrated into the castle silhouette.
    *   **Arrangement:** The icon typically sits above the company name "Bags of Folding".
    *   **Coloration:**
        *   Icon (bag and castle): Parchment (`#f5f5dc`).
        *   Background (dark): Burgundy (`#800020`).
        *   Background (light): Icon and text would be Burgundy.
        *   Accent: A thin, shining line of Silver (`#c0c0c0`) outlining the top of the bag where the castle emerges.
*   **Secondary Icon Concept: "The Unfolding Tower"**
    *   **Icon:** A clean, sharp silhouette of a single castle tower. A distinct, diagonal fold line runs through the middle of the tower, with one half slightly offset or shaded differently to imply it's in the process of unfolding.
    *   **Arrangement:** Can be a standalone icon or placed to the left of the company name.

### 4. Tone of Voice

*   **Target Audience:** TTRPG (Tabletop Role-Playing Game) players.
*   **Characteristics:**
    *   **Knowledgeable:** Show an understanding of TTRPG tropes and player expectations.
    *   **Slightly Whimsical:** A touch of humor or lightheartedness is appropriate.
    *   **Appreciative of Fantasy:** Embrace the fantasy genre and its conventions.
    *   **Clear and Evocative:** Language should be easy to understand while painting a vivid picture.

## Specific Instructions for AI Development

1.  **UI Element Generation:**
    *   When creating new UI components, default to the "Dragon's Hoard" color palette (Parchment, Burgundy, Silver).
    *   Use the Cinzel font for headings, titles, and buttons. Use the Lora font for body text.
    *   Incorporate subtle visual cues of folding/unfolding or modularity where appropriate (e.g., in transitions, menu expansions).

2.  **Iconography and Visual Assets:**
    *   New icons or visual assets should draw inspiration from:
        *   The "Bag of Holding" primary logo.
        *   The "Unfolding Tower" secondary icon.
        *   The themes of portability, transformation, and stylized fantasy architecture.
    *   Maintain a consistent visual style – clean lines, slightly stylized, avoiding hyper-realism.

3.  **Content and Text Generation:**
    *   Adopt a tone that resonates with TTRPG players (knowledgeable, whimsical, appreciative of fantasy).
    *   Ensure all user-facing text aligns with the brand's voice.
    *   When describing features or products, emphasize how they embody portability, transformation, and the magic of fantasy architecture.

4.  **Feature Development:**
    *   Any new features or content should align with the core themes:
        *   Does it enhance **portability**?
        *   Does it involve **transformation** or unfolding?
        *   Does it fit within the realm of **fantasy architecture** or settings?
    *   Prioritize features that directly appeal to the needs and desires of TTRPG players.

By adhering to these guidelines, AI agents can help maintain and enhance the unique identity of "Bags of Folding," creating a cohesive and engaging experience for users.

## Technical Best Practices

### Image Optimization

To ensure fast page loads and a good user experience, all images should be served through Cloudflare's image resizing service. This is done by prefixing the image URL with `/cdn-cgi/image/` and adding parameters for width, height, format, and quality.

**Example:**

To display a 400px wide version of the image at `/images/FirstDraftFolded.jpg`, you would use the following URL:

```html
<img src="/cdn-cgi/image/width=400,format=auto,quality=75/images/FirstDraftFolded.jpg" alt="Descriptive alt text">
```

**Parameters:**

*   `width`: The desired width of the image in pixels.
*   `height`: The desired height of the image in pixels.
*   `format`: `auto` is recommended to allow Cloudflare to serve the most optimal format.
*   `quality`: A value between 1 and 100. `75` is a good starting point.
*   `fit`: `scale-down` is useful to ensure the image fits within the specified dimensions without being cropped.

## SEO

### Meta Descriptions

A meta description is an HTML attribute that provides a brief summary of a web page. Search engines often display the meta description in search results, which can influence click-through rates.

When creating a new page, ensure you add a compelling and relevant meta description (around 155-160 characters) to the `<head>` section.

**Example:**

```html
<meta name="description" content="Your concise and engaging page description goes here.">
```

### Sitemap

A `sitemap.xml` file is present in the root of the project. When adding new pages, please ensure they are added to thesitemap to help search engines crawl the site effectively. The primary domain for the site is `https://BagsOfFolding.com`.

### Analytics

All pages on the site should include the Google Analytics tracking code. This helps us understand user behavior and improve the site. The tracking code should be placed in the `<head>` section of each HTML file.

**Google Analytics Tracking Code:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DZVJME5GW8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DZVJME5GW8');
</script>
```

## Tailwind CSS Build Process

This project uses Tailwind CSS to build the final `style.css` file. The source file is located at `src/style.css`.

To build the CSS, run the following command:

```bash
npm run build:css
```

This will compile the Tailwind CSS and output the minified CSS to `style.css`.

**Important:** Do not edit `style.css` directly. All CSS changes should be made in `src/style.css`.

## Feature Requirements

### Card Deletion

A feature needs to be implemented that allows users to delete a card directly from the "Navigate Cards" section. This action should be intuitive and provide a confirmation step to prevent accidental deletions.

### "Bag" of Holding for Cards

A "bag" feature should be created to allow users to save or "bag" cards for later use. This feature should function as a personal collection of cards, stored in the browser's local storage.

**Core Functionality:**

*   **Bagging a Card:** Users should be able to "bag" a card, which saves it to their collection.
*   **Named Bags:** The collection should be organized into named "bags," which function like folders, allowing for better organization of saved cards.
*   **Bag Management UI:** A dedicated pop-up or interface, similar to the existing "import" functionality, should be created for managing the bags.
*   **Card Actions within Bags:** Inside the bag management UI, users should be able to:
    *   Delete a card from a bag.
    *   Move a card from one bag to another.
*   **Export Functionality:**
    *   Users should be able to export a single card from a bag into the `rpg-cards` JSON format.
    *   Users should be able to export an entire "bag" (all cards within it) as a single JSON file in the `rpg-cards` format.
