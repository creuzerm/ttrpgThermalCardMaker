# AI Development Guidelines for Bags of Folding

This document provides guidelines for AI agents working on the "Bags of Folding" project. The goal is to ensure consistency in style, theme, and tone, aligning with the project's brand identity.

## Core Principles

### 1\. Visual Style: "Dragon's Hoard"

  * **Primary Color Palette:**
      * **Parchment:** `#f5f5dc` (Off-white, for backgrounds or primary elements on dark backgrounds)
      * **Burgundy:** `#800020` (Rich, deep red, for text, icons on light backgrounds, or dark mode backgrounds)
      * **Silver:** `#c0c0c0` (Accent color, for highlights, borders, or subtle magical effects)
  * **Typography:**
      * **Primary Font:** Cinzel. This font should be used for headings, titles, and prominent text elements. It provides a clean, classic fantasy feel.
      * **Body Font:** Lora, a serif font, is used for body text. Cinzel is preferred for headings.

### 2\. Thematic Elements

  * **Portability:** The core concept of "Bags of Folding" is the ability to carry entire worlds or complex structures easily. This theme should be reflected in the ease of use and compact design of any features.
  * **Transformation:** The idea of things unfolding, expanding, or changing form is central. Visual cues of folding, unfolding, or modularity are encouraged.
  * **Fantasy Architecture:** Designs should evoke a sense of wonder and possibility, drawing inspiration from classic fantasy castles, keeps, dungeons, and magical structures. Stylized, almost paper-craft-like representations are preferred over hyper-realism.

### 3\. Logo and Branding: "The Bag of Holding"

  * **Primary Logo Concept: "The Bag of Holding"**
      * **Icon:** A simple, stylized icon of a classic drawstring pouch or bag. Emerging from the top of the open bag is the silhouette of a small, foldable castle or keep. The keep should look slightly stylized, almost like it's made of folded paper or panels. A subtle crease or fold line could be integrated into the castle silhouette.
      * **Arrangement:** The icon typically sits above the company name "Bags of Folding".
      * **Coloration:**
          * Icon (bag and castle): Parchment (`#f5f5dc`).
          * Background (dark): Burgundy (`#800020`).
          * Background (light): Icon and text would be Burgundy.
          * Accent: A thin, shining line of Silver (`#c0c0c0`) outlining the top of the bag where the castle emerges.
  * **Secondary Icon Concept: "The Unfolding Tower"**
      * **Icon:** A clean, sharp silhouette of a single castle tower. A distinct, diagonal fold line runs through the middle of the tower, with one half slightly offset or shaded differently to imply it's in the process of unfolding.
      * **Arrangement:** Can be a standalone icon or placed to the left of the company name.

### 4\. Tone of Voice

  * **Target Audience:** TTRPG (Tabletop Role-Playing Game) players.
  * **Characteristics:**
      * **Knowledgeable:** Show an understanding of TTRPG tropes and player expectations.
      * **Slightly Whimsical:** A touch of humor or lightheartedness is appropriate.
      * **Appreciative of Fantasy:** Embrace the fantasy genre and its conventions.
      * **Clear and Evocative:** Language should be easy to understand while painting a vivid picture.

## Specific Instructions for AI Development

1.  **UI Element Generation:**

      * When creating new UI components, default to the "Dragon's Hoard" color palette (Parchment, Burgundy, Silver).
      * Use the Cinzel font for headings, titles, and buttons. Use the Lora font for body text.
      * Incorporate subtle visual cues of folding/unfolding or modularity where appropriate (e.g., in transitions, menu expansions).

2.  **Iconography and Visual Assets:**

      * New icons or visual assets should draw inspiration from:
          * The "Bag of Holding" primary logo.
          * The "Unfolding Tower" secondary icon.
          * The themes of portability, transformation, and stylized fantasy architecture.
      * Maintain a consistent visual style – clean lines, slightly stylized, avoiding hyper-realism.

3.  **Content and Text Generation:**

      * Adopt a tone that resonates with TTRPG players (knowledgeable, whimsical, appreciative of fantasy).
      * Ensure all user-facing text aligns with the brand's voice.
      * When describing features or products, emphasize how they embody portability, transformation, and the magic of fantasy architecture.

4.  **Feature Development:**

      * Any new features or content should align with the core themes:
          * Does it enhance **portability**?
          * Does it involve **transformation** or unfolding?
          * Does it fit within the realm of **fantasy architecture** or settings?
      * Prioritize features that directly appeal to the needs and desires of TTRPG players.

By adhering to these guidelines, AI agents can help maintain and enhance the unique identity of "Bags of Folding," creating a cohesive and engaging experience for users.

## Technical Best Practices

### Image Optimization

To ensure fast page loads and a good user experience, all images should be served through Cloudflare's image resizing service. This is done by prefixing the image URL with `/cdn-cgi/image/` and adding parameters for width, height, format, and quality.

**Example:**

```html
<img src="/cdn-cgi/image/width=400,format=auto,quality=75/images/FirstDraftFolded.jpg" alt="Descriptive alt text">
```

**Parameters:**

  * `width`: The desired width of the image in pixels.
  * `height`: The desired height of the image in pixels.
  * `format`: `auto` is recommended to allow Cloudflare to serve the most optimal format.
  * `quality`: A value between 1 and 100. `75` is a good starting point.
  * `fit`: `scale-down` is useful to ensure the image fits within the specified dimensions without being cropped.

### PDF and Image Generation with html2canvas

When generating canvases from HTML for PDFs or images, especially with the `html2canvas` library, there are critical best practices to follow to ensure images are rendered reliably.

  * **Problem:** The `html2canvas` library can fail to render images correctly if it has to fetch them from a URL (e.g., `<img src="https://...">`). This is due to the library's internal image loader having timing and cross-origin issues, which can result in missing images or black boxes in the final output.

  * **Solution:** To guarantee reliable image rendering, you **must** pre-load all images and embed them as `dataURL`s directly into the HTML *before* passing that HTML to `html2canvas`.

  * **Required Process:**

    1.  Resolve the image path to an absolute URL if necessary.
    2.  Use the `loadImage(url)` helper function to load the image into a browser `Image` object.
    3.  Create a temporary `<canvas>` element.
    4.  Draw the loaded `Image` object onto the canvas.
    5.  Generate a `dataURL` from the canvas (e.g., `canvas.toDataURL('image/png')`).
    6.  Use this `dataURL` as the `src` for the `<img>` tag in the HTML that will be rendered.

**Example:**

```javascript
// Incorrect (unreliable):
const unreliableHtml = `<img src="https://example.com/my-image.png">`;
// This may fail inside html2canvas.

// Correct (reliable):
const imageUrl = 'https://example.com/my-image.png';
const img = await loadImage(imageUrl); // Pre-load the image
const canvas = document.createElement('canvas');
canvas.width = img.naturalWidth;
canvas.height = img.naturalHeight;
canvas.getContext('2d').drawImage(img, 0, 0);
const dataUrl = canvas.toDataURL('image/png'); // Convert to dataURL

const reliableHtml = `<img src="${dataUrl}">`; // Embed the dataURL
// This will now render reliably in html2canvas.
```

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
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DZVJME5GW8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DZVJME5GW8');
</script>
```

The following events should be tracked to provide insight into user behavior:

  * **Card Navigation Events:**
      * `add_new_card`
      * `add_card_from_template` (with `template_name` parameter)
      * `import_cards` (with `import_source` and `card_count` parameters)
      * `delete_card`
  * **Bag of Holding Events:**
      * `collect_card_to_bag`
      * `create_bag`
  * **Session Summary Event (once per session):**
      * `session_summary` (with `card_count`, `bag_count`, and `total_cards_in_bags` parameters)
  * **Card Format Events:**
      * `use_folded_card`
      * `use_continuous_card`
  * **Printer Settings (tracked with generation actions):**
      * `paper_width`
      * `dpi`
      * `card_size`
      * `num_copies`
      * `include_corner_dots`
      * `output_format`
  * **Sharing/Exporting Events:**
      * `download_file` (PDF or image)
      * `share_pdf`
      * `copy_bookmark_link`
      * `open_card_in_new_tab`
  * **UI Interaction Events:**
      * `open_about_page`
      * `click_help_link` (with `topic` parameter)
      * `click_external_link` (with `url` parameter)

## Tailwind CSS Build Process

This project uses Tailwind CSS to build the final `style.css` file. The source file is located at `src/style.css`.

To build the CSS, run the following command:

```bash
npm run build:css
```

This will compile the Tailwind CSS and output the minified CSS to `style.css`.

**Important:** Do not edit `style.css` directly. All CSS changes should be made in `src/style.css`.

## Feature Requirements

AI Coding Tool Specification

This section outlines the requirements for an AI coding tool tasked with generating or modifying code for the **Portable Printer TTRPG Card Generator**. The goal is to ensure all generated code is robust, well-documented, and consistent with the project's established standards.

### 1\. Code Generation & Style

  * **Language & Frameworks:** The tool must exclusively generate **HTML, CSS, and JavaScript**. It should use **Tailwind CSS** for all styling and layout. The code must be self-contained and ready to run as a single file, typically within the `index.html` structure.
  * **Structure:** Code should be modular and clearly separated by function. Complex logic should be broken into smaller, well-named functions.
  * **Documentation:** All generated code must be extensively commented. The purpose of each function, the logic within loops, and any complex algorithms should be explained clearly in **HTML comments (\`\`) and JavaScript comments (`// ...`)**.
  * **Visuals & Aesthetics:** Generated UI components should adhere to the **"Dragon's Hoard" visual style**. Use the specified color palette and fonts. Buttons and interactive elements should be styled with rounded corners and appropriate visual cues (e.g., shadows, subtle gradients).

### 2\. Functional Requirements & Constraints

  * **Self-Contained:** All code must be complete and self-contained within the provided immersive code block. Do not rely on external scripts or files unless they are already included via a CDN in the project's `index.html` file (e.g., `tailwindcss`, `marked.js`, `html2canvas`).
  * **User Interaction:** Code should be responsive to user input and provide clear feedback. Avoid using native browser alerts (`alert()`, `confirm()`); instead, use a custom-styled message box or modal.
  * **Data Handling:** Any data handling or persistence logic should be clearly documented and, if necessary, designed to work with the existing URL-based data transfer mechanism (Base64 encoding/decoding).
  * **Robustness:** Implement error handling using `try...catch` blocks where appropriate. The code should gracefully handle unexpected input or missing data without crashing.
  * **Compressed URL Sharing:** When creating or reading a shareable URL or the HTML Preview "Open Card in New Tab", the AI tool **must** follow this process to compress and decompress the card's JSON data:
    1.  **To Generate a URL:** Compress the JSON string using a library like `pako.deflate`, then convert the resulting binary data to a Base64 string for inclusion in the URL.
    2.  **To Read a URL:** When a user loads a share URL, first decode the Base64 string, then decompress the data using a library like `pako.inflate` before parsing the JSON back into a usable object.

### 3\. Special-Use Block Types

When generating content for the card generator, the AI should be aware of the following block types and their intended use, as defined by the existing `AGENTS.md` file:

  * **Text (`text`):** A standard text block that supports Markdown.
  * **Property Line (`property`):** A single line with a label and a value (e.g., "HP: 20").
  * **Horizontal Rule (`rule`, `ruler`):** A full-width line for visual separation.
  * **D\&D Stats Block (`dndstats`):** A formatted block for the six D\&D ability scores.
  * **Boxes (`boxes`):** A labeled section with checkable boxes.

The AI should prioritize using these defined blocks to maintain consistency when generating card content.

### Card Deletion

A feature needs to be implemented that allows users to delete a card directly from the "Navigate Cards" section. This action should be intuitive and provide a confirmation step to prevent accidental deletions.

### "Bag" of Holding for Cards

A "bag" feature should be created to allow users to save or "bag" cards for later use. This feature should function as a personal collection of cards, stored in the browser's local storage as part of the Progressive Web App.

**Core Functionality:**

  * **Bagging a Card:** Users should be able to "bag" a card, which saves it to their collection.
  * **Named Bags:** The collection should be organized into named "bags," which function like folders, allowing for better organization of saved cards.
  * **Bag Management UI:** A dedicated pop-up or interface, similar to the existing "import" functionality, should be created for managing the bags.
  * **Card Actions within Bags:** Inside the bag management UI, users should be able to:
      * Delete a card from a bag.
      * Move a card from one bag to another.
  * **Export Functionality:**
      * Users should be able to export a single card from a bag into the `rpg-cards` JSON format.
      * Users should be able to export an entire "bag" (all cards within it) as a single JSON file in the `rpg-cards` format.

## Content Management

This section outlines procedures for managing the content and structure of this document and other similar documents in the project.

### Card Templates

The application supports creating new cards from a set of predefined templates. These templates are now managed in the `templates.json` file at the root of the repository, which is loaded by the application on startup.

#### `templates.json` Structure

The `templates.json` file is a JSON object where:

  - The **keys** are the names of the game systems (e.g., `"D&D"`, `"Daggerheart"`). These names are used to create the accordion headers in the UI.
  - The **values** are arrays of template objects for that system.

Each template object within the array has two properties:

1.  `"title"`: A string that will be displayed on the button for that template in the UI.
2.  `"json"`: An object that conforms to the `rpg-json` data structure used by the application. This object defines the actual content and properties of the card to be created.

#### Adding a New Template

To add a new template or a new game system:

1.  Open the `templates.json` file.
2.  To add a template to an existing system, find the appropriate key (e.g., `"D&D"`) and add a new template object to its array.
3.  To add a new game system, add a new key-value pair to the root object. The key should be the system's name, and the value should be an array containing at least one template object.
4.  Ensure the `"json"` property for any new template contains valid card data that follows the established `rpg-json` format.

### Adding New Sections

To ensure consistency, adding new sections should follow a structured process. When requested to add a new section, offer the following predefined section types to the user. These types correspond to the formats supported by the `rpg-cards` JSON import.

  * **Content Section:** A standard section with an optional heading, body text (supports markdown-like syntax), and optional italicized flavor text. This is the default section type.
  * **Property:** A simple key-value pair, displayed as "**Key:** Value".
  * **Picture:** An image, specified by a URL and an optional height.
  * **Horizontal Rule:** A full-width horizontal line. There are two styles:
      * `rule`: A standard dashed line.
      * `ruler`: A thin solid line.
  * **D\&D Stats Block (`dndstats`):** A formatted block for the six D\&D ability scores (STR, DEX, CON, INT, WIS, CHA).
  * **Savage Worlds Stats Block (`swstats`):** A formatted block for Savage Worlds stats (e.g., Agility, Smarts, Spirit, Pace, Parry).
  * **Pathfinder 2e Stats Block (`p2e_stats`):** A formatted block for Pathfinder 2e stats (e.g., STR, DEX, AC, Fort, Ref, Will, HP).
  * **Pathfinder 2e Activity (`p2e_activity`):** A formatted block for a Pathfinder 2e activity, including name, action cost, and description.
  * **Pathfinder 2e Traits (`p2e_traits`):** A block to display a list of Pathfinder 2e traits with rarities.
  * **Boxes:** A section with a label and a specified number of checkable boxes.
  * **Fill:** An invisible element that takes up flexible space, useful for layout adjustments.

When adding a section, use the appropriate type to ensure correct rendering.

### Reordering Card Content Sections

The order of the content sections within a card can be adjusted. These are the blocks that appear in the main content area of the card, such as text sections, property lines, stat blocks, and pictures.

To reorder these sections, you can specify the desired new order. For example, you can list the current section headings or types and describe the order you want them to be in.

### In-App Help Linking

The application features contextual help links (e.g., small question mark icons) that link from various UI sections directly to the relevant documentation section in the "About" modal. The "About" modal renders the `README.md` file.

This linking is achieved using automatically generated header IDs created by the `marked.js` library. For example, a Markdown header like `### My Awesome Feature` will be rendered as an HTML tag with an ID like `id="my-awesome-feature"`.

**Important Considerations for Future Development:**

  * **Header Text is Tied to Links:** When editing headers in `README.md`, be aware that changing the text of a header will also change its auto-generated ID. This will break any help links pointing to the old ID.
  * **Verify Links After Changes:** If you modify a header in `README.md`, you **must** verify that the corresponding help link in `index.html` is updated to point to the new ID.
  * **ID Generation:** The IDs are generated by "slugifying" the header text: converting to lowercase, replacing spaces with hyphens, and removing most punctuation. You can predict the ID or inspect the DOM in the running application to confirm the exact ID.

## Progressive Web App (PWA) Requirements

  * Reliable: The app should work offline and on low-quality networks using a Service Worker.
  * Installable: The app must be able to be added to the user's home screen.
  * Secure: The site must be served over HTTPS.
  * Discoverable: The app needs a Web App Manifest file to be indexed as an application.
  * App-like: It should provide a responsive, full-screen, and immersive user experience.
  * Re-engageable: The app should be able to send push notifications to users.
