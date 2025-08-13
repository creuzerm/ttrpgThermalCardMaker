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

AI Coding Tool Specification

This section outlines the requirements for an AI coding tool tasked with generating or modifying code for the **Portable Printer TTRPG Card Generator**. The goal is to ensure all generated code is robust, well-documented, and consistent with the project's established standards.

### 1. Code Generation & Style

* **Language & Frameworks:** The tool must exclusively generate **HTML, CSS, and JavaScript**. It should use **Tailwind CSS** for all styling and layout. The code must be self-contained and ready to run as a single file, typically within the `index.html` structure.
* **Structure:** Code should be modular and clearly separated by function. Complex logic should be broken into smaller, well-named functions.
* **Documentation:** All generated code must be extensively commented. The purpose of each function, the logic within loops, and any complex algorithms should be explained clearly in **HTML comments (`<!-- ... -->`) and JavaScript comments (`// ...`)**.
* **Visuals & Aesthetics:** Generated UI components should adhere to the **"Dragon's Hoard" visual style**. Use the specified color palette and fonts. Buttons and interactive elements should be styled with rounded corners and appropriate visual cues (e.g., shadows, subtle gradients).

### 2. Functional Requirements & Constraints

* **Self-Contained:** All code must be complete and self-contained within the provided immersive code block. Do not rely on external scripts or files unless they are already included via a CDN in the project's `index.html` file (e.g., `tailwindcss`, `marked.js`, `html2canvas`).
* **User Interaction:** Code should be responsive to user input and provide clear feedback. Avoid using native browser alerts (`alert()`, `confirm()`); instead, use a custom-styled message box or modal.
* **Data Handling:** Any data handling or persistence logic should be clearly documented and, if necessary, designed to work with the existing URL-based data transfer mechanism (Base64 encoding/decoding).
* **Robustness:** Implement error handling using `try...catch` blocks where appropriate. The code should gracefully handle unexpected input or missing data without crashing.
* **Compressed URL Sharing:** When creating or reading a shareable URL or the HTML Preview "Open Card in New Tab", the AI tool **must** follow this process to compress and decompress the card's JSON data:
  1. **To Generate a URL:** Compress the JSON string using a library like `pako.deflate`, then convert the resulting binary data to a Base64 string for inclusion in the URL.
  2. **To Read a URL:** When a user loads a share URL, first decode the Base64 string, then decompress the data using a library like `pako.inflate` before parsing the JSON back into a usable object.

### 3. Special-Use Block Types

When generating content for the card generator, the AI should be aware of the following block types and their intended use, as defined by the existing `AGENTS.md` file:

* **Text (`text`):** A standard text block that supports Markdown.
* **Property Line (`property`):** A single line with a label and a value (e.g., "HP: 20").
* **Horizontal Rule (`rule`, `ruler`):** A full-width line for visual separation.
* **D&D Stats Block (`dndstats`):** A formatted block for the six D&D ability scores.
* **Boxes (`boxes`):** A labeled section with checkable boxes.

The AI should prioritize using these defined blocks to maintain consistency when generating card content.

### Card Deletion

A feature needs to be implemented that allows users to delete a card directly from the "Navigate Cards" section. This action should be intuitive and provide a confirmation step to prevent accidental deletions.

### "Bag" of Holding for Cards

A "bag" feature should be created to allow users to save or "bag" cards for later use. This feature should function as a personal collection of cards, stored in the browser's local storage as part of the Progressive Web App.

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

## Content Management

This section outlines procedures for managing the content and structure of this document and other similar documents in the project.

### New Card  Templates

To ensure consistency and efficiency when creating new TTRPG cards, make the following templates available to pick from. These templates define the base structure for different card types, which should be used as a starting point for a new card creation if selected.

#### Template Structure
All templates are provided in a JSON format that is compatible with the card generator. They include a default count of 1, a placeholder color, and a default icon and icon_back that should be updated to match the new card's theme.

The contents array is the most critical part of the template. It uses specific string formats to define card content:

property | key | value: Creates a key-value pair for stats (e.g., Casting Time | 1 action).

description | key | value: Creates a key-value pair for longer text blocks.

text | value: Creates a block of plain text.

rule: Inserts a horizontal line.

section | heading: Creates a section heading.

Available Templates
Creature: For monsters and NPCs. Default ability scores are set to 10.

Item: For magical or mundane equipment.

Spell: For spells and magical effects.

Species: For playable races or other creature types.

Background: For character backgrounds.

Feat: For character feats and special abilities.

Option/Feature: A general-purpose template for class features or other special rules.

To create a new card:

Select the appropriate JSON template for the card type.

Copy the JSON object into the generator's editor.

Modify the title, color, icon, tags, and contents as needed.

Ensure the contents array adheres to the specified formatting to render correctly.


Based on the structure of the provided JSON files, here are templates for the different card types you requested. The card generation system appears to use a flexible `contents` array where each string follows a specific format (e.g., `key | value` or `key | subkey | value`). These templates are designed to fit that structure.

-----

#### Card Structure Definitions

All cards share a common base structure with specific fields for customization:

  * **`count`**: The number of copies to create. This can be set to `1` by default.
  * **`color`**: A hex code for the card's background.
  * **`title`**: The title of the card.
  * **`icon`**: An icon name or URL. The `index.html` file suggests you can find a full list of icons at `game-icons.net`.
  * **`icon_back`**: The icon for the back of a folded card.
  * **`tags`**: An array of strings for organizing and searching cards.
  * **`footer`**: Text for the bottom of the card.
  * **`contents`**: An array of strings that defines the main body of the card. It uses specific keywords to format content.
      * **`property`**: Used for key-value stat blocks.
      * **`description`**: A key-value pair for longer descriptive text.
      * **`text`**: A block of plain text.
      * **`rule`**: A horizontal line separator.
  * **`isFolded`**: A boolean (`true` or `false`) to indicate a folded card.
  * **`foldContent`**: An object containing the content for the back of a folded card, with `type` (e.g., `"text"`) and `content`.

-----

#### D&D Templates

##### **Creature (Monster)**

This template creates a stat block with ability scores all set to `10`, as you requested. It also includes standard fields for a monster.

```json
{
  "count": 1,
  "color": "#e05c5c",
  "title": "New Creature",
  "icon": "dragon-head",
  "icon_back": "dragon-head",
  "tags": ["Creature", "Monster"],
  "footer": "Source: Custom",
  "contents": [
    "property | Size | Medium",
    "property | Type | Aberration",
    "property | Alignment | Lawful Evil",
    "rule",
    "property | Armor Class | 10",
    "property | Hit Points | 10 (1d8 + 5)",
    "property | Speed | 30 ft.",
    "rule",
    "property | STR | 10 (+0)",
    "property | DEX | 10 (+0)",
    "property | CON | 10 (+0)",
    "property | INT | 10 (+0)",
    "property | WIS | 10 (+0)",
    "property | CHA | 10 (+0)",
    "rule",
    "description | Senses | passive Perception 10",
    "description | Languages | Common",
    "description | Challenge | 1/2 (100 XP)",
    "rule",
    "section | Actions",
    "description | Multiattack | The creature makes two attacks.",
    "description | Attack | Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 (1d4) bludgeoning damage."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Item**

A template for a magical or mundane item, including fields for its rarity and a description.

```json
{
  "count": 1,
  "color": "#4a6898",
  "title": "New Item",
  "icon": "sword",
  "icon_back": "sword",
  "tags": ["Item", "Magic Item"],
  "footer": "Source: Custom",
  "contents": [
    "property | Type | Wondrous item",
    "property | Rarity | Common",
    "rule",
    "description | Description | A detailed description of the item and its appearance.",
    "description | Effect | The magical properties or benefits of the item."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Spell**

This template includes all the essential components of a spell card, such as level, school, casting time, and range.

```json
{
  "count": 1,
  "color": "#a7894b",
  "title": "New Spell",
  "icon": "magic-swirl",
  "icon_back": "magic-swirl",
  "tags": ["Spell", "Evocation"],
  "footer": "Source: Custom",
  "contents": [
    "property | Level | 1st-level evocation",
    "property | Casting Time | 1 action",
    "property | Range | 60 feet",
    "property | Components | V, S, M (a pinch of sulfur)",
    "property | Duration | Instantaneous",
    "rule",
    "description | Description | The spell's effect and what happens when it is cast.",
    "description | At Higher Levels | A description of how the spell's power increases when cast using a higher-level spell slot."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Species**

This template is for a playable race or species, with placeholders for ability score increases, size, and racial features, similar to the "Centaur" example found in the file.

```json
{
  "count": 1,
  "color": "#30432f",
  "title": "New Species",
  "icon": "family-tree",
  "icon_back": "family-tree",
  "tags": ["Species", "Race"],
  "footer": "Source: Custom",
  "contents": [
    "property | Ability Scores | Choose any +2; choose any other +1",
    "property | Size | Medium",
    "property | Speed | 30 ft.",
    "rule",
    "description | Creature Type | You are a Humanoid.",
    "description | Trait Name | A detailed description of the species' trait.",
    "description | Trait Name 2 | Another trait's description."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Background**

This template is designed for a character background, detailing proficiencies and features.

```json
{
  "count": 1,
  "color": "#6e4a2a",
  "title": "New Background",
  "icon": "book-cover",
  "icon_back": "book-cover",
  "tags": ["Background"],
  "footer": "Source: Custom",
  "contents": [
    "property | Skill Proficiencies | Two of your choice",
    "property | Tool Proficiencies | One of your choice",
    "rule",
    "description | Feature: Background Name | A description of the feature associated with this background.",
    "description | Personality Traits | A suggestion for personality traits.",
    "description | Ideals | A suggestion for ideals.",
    "description | Bonds | A suggestion for bonds.",
    "description | Flaws | A suggestion for flaws."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Feat**

A template for a feat, which usually includes a prerequisite and a description of the benefit.

```json
{
  "count": 1,
  "color": "#5b5b5b",
  "title": "New Feat",
  "icon": "checked-shield",
  "icon_back": "checked-shield",
  "tags": ["Feat"],
  "footer": "Source: Custom",
  "contents": [
    "property | Prerequisite | None",
    "rule",
    "description | Benefit | A description of the feat's benefits and how it changes a character's abilities."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

##### **Option/Feature**

This is a general-purpose template for a character feature, class option, or other special ability.

```json
{
  "count": 1,
  "color": "#8f8b7f",
  "title": "New Feature",
  "icon": "crown",
  "icon_back": "crown",
  "tags": ["Feature", "Option"],
  "footer": "Source: Custom",
  "contents": [
    "property | Prerequisite | Level 3",
    "rule",
    "description | Description | A detailed description of what the feature does.",
    "description | Special | Additional rules or a deeper explanation of the feature's mechanics."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

### Daggerheart Card Templates

Here are the JSON templates for the Daggerheart card types, designed to fit the structure used by your mobile card creation tool. The `contents` array in each template provides the specific data fields for that card type.

-----

#### 1\. Ancestry Card

This template is for a character's ancestry, including descriptive text and a list of traits. It focuses on narrative and core abilities.

```json
{
  "count": 1,
  "color": "#4a6898",
  "title": "New Ancestry",
  "icon": "family-tree",
  "icon_back": "family-tree",
  "tags": ["Daggerheart", "Ancestry"],
  "footer": "Source: Daggerheart Core",
  "contents": [
    "text | *A description of the ancestry's lore and place in the world.*",
    "rule",
    "description | Feature Name | A detailed description of an ancestry trait.",
    "description | Second Feature | A description of a second ancestry trait."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 2\. Community Card

A template for a character's community, detailing the benefits and features they gain from their background.

```json
{
  "count": 1,
  "color": "#30432f",
  "title": "New Community",
  "icon": "village",
  "icon_back": "village",
  "tags": ["Daggerheart", "Community"],
  "footer": "Source: Daggerheart Core",
  "contents": [
    "text | *A description of the community's culture, values, and location.*",
    "rule",
    "description | Community Trait | A detailed description of a feature granted by this community.",
    "description | Another Community Trait | The description of an additional community feature."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 3\. Subclass Card

This template is for a character's subclass, providing their specific abilities and features.

```json
{
  "count": 1,
  "color": "#a7894b",
  "title": "New Subclass",
  "icon": "crown",
  "icon_back": "crown",
  "tags": ["Daggerheart", "Subclass"],
  "footer": "Source: Daggerheart Core",
  "contents": [
    "property | Class | Fighter",
    "text | *A description of the subclass and its role within the class.*",
    "rule",
    "description | Subclass Feature | A detailed description of a feature or ability gained from this subclass.",
    "description | Another Feature | The description of another feature."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 4\. Domain Card (Ability/Spell/Grimoire)

A general template for Domain cards that can be used for Abilities, Spells, or Grimoires. The `tags` and `icon` should be updated to specify the card type.

```json
{
  "count": 1,
  "color": "#79294e",
  "title": "New Ability",
  "icon": "lightning-bow",
  "icon_back": "lightning-bow",
  "tags": ["Daggerheart", "Domain", "Ability"],
  "footer": "Source: Daggerheart Core",
  "contents": [
    "property | Domain | Chaos",
    "property | Level | 1",
    "rule",
    "description | Cost | A description of the ability's cost (e.g., spending Stress).",
    "description | Effect | A detailed description of the ability's mechanical effect.",
    "description | Upgraded | The enhanced effect when spent with Hope."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 5\. Transformation Card

This template represents a transformation that provides both a mechanical benefit and a drawback.

```json
{
  "count": 1,
  "color": "#800020",
  "title": "New Transformation",
  "icon": "rune-sword",
  "icon_back": "rune-sword",
  "tags": ["Daggerheart", "Transformation"],
  "footer": "Source: Daggerheart Core",
  "contents": [
    "text | *A description of the transformation's theme and origin.*",
    "rule",
    "section | Benefits",
    "text | **Benefit 1:** The primary mechanical advantage of the transformation.",
    "text | **Benefit 2:** An additional benefit.",
    "rule",
    "section | Drawbacks",
    "text | **Drawback 1:** A significant mechanical disadvantage of the transformation.",
    "text | **Drawback 2:** A second, negative effect."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 6\. Adversary Card (Community Homebrew)

This template is based on a community-made design and includes fields for a creature's tier, difficulty, HP, Stress, and features.

```json
{
  "count": 1,
  "color": "#b22222",
  "title": "New Adversary",
  "icon": "crossed-swords",
  "icon_back": "crossed-swords",
  "tags": ["Daggerheart", "Adversary", "Homebrew"],
  "footer": "Source: Community Homebrew",
  "contents": [
    "property | Tier | 1",
    "property | Difficulty | Moderate",
    "property | Damage Die | 1d6",
    "rule",
    "description | Tactics | A brief description of how the adversary fights.",
    "description | Features | **Feature Name:** The description of a special ability.",
    "description | Feature 2 | **Feature Name 2:** The description of a second ability.",
    "boxes | HP | 10",
    "boxes | Stress | 6",
    "boxes | Major Threshold | 1",
    "boxes | Severe Threshold | 1"
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 7\. Item Card (Community Homebrew)

This template is for equipment or other items, including a type, damage, and traits. It is based on community-made card designs.

```json
{
  "count": 1,
  "color": "#d2b48c",
  "title": "New Item",
  "icon": "sword",
  "icon_back": "sword",
  "tags": ["Daggerheart", "Item", "Homebrew"],
  "footer": "Source: Community Homebrew",
  "contents": [
    "property | Item Type | Weapon",
    "property | Damage Dice | 1d6",
    "property | Damage Type | Physical",
    "property | Range | Melee",
    "rule",
    "description | Traits | **Trait Name:** The effect of a special trait.",
    "description | Description | A detailed description of the item."
  ],
  "isFolded": false,
  "isScrolling": false
}
```

#### 8\. Ritual Card (Community Homebrew)

A template for a ritual, which is a community-driven card type focused on narrative and a flexible approach to magic.

```json
{
  "count": 1,
  "color": "#5b5b5b",
  "title": "New Ritual",
  "icon": "pentagram-star",
  "icon_back": "pentagram-star",
  "tags": ["Daggerheart", "Ritual", "Homebrew"],
  "footer": "Source: Community Homebrew",
  "contents": [
    "text | *A description of the ritual's purpose and its narrative implications.*",
    "rule",
    "property | Stress Cost | 3",
    "property | Difficulty | Hard",
    "property | Time | 1 hour",
    "description | Components | Any resources or specific items required to perform the ritual.",
    "rule",
    "description | Effect | A description of the ritual's outcome."
  ],
  "isFolded": false,
  "isScrolling": false
}
```


### Adding New Sections

To ensure consistency, adding new sections should follow a structured process. When requested to add a new section, offer the following predefined section types to the user. These types correspond to the formats supported by the `rpg-cards` JSON import.

*   **Content Section:** A standard section with an optional heading, body text (supports markdown-like syntax), and optional italicized flavor text. This is the default section type.
*   **Property:** A simple key-value pair, displayed as "**Key:** Value".
*   **Picture:** An image, specified by a URL and an optional height.
*   **Horizontal Rule:** A full-width horizontal line. There are two styles:
    *   `rule`: A standard dashed line.
    *   `ruler`: A thin solid line.
*   **D&D Stats Block (`dndstats`):** A formatted block for the six D&D ability scores (STR, DEX, CON, INT, WIS, CHA).
*   **Savage Worlds Stats Block (`swstats`):** A formatted block for Savage Worlds stats (e.g., Agility, Smarts, Spirit, Pace, Parry).
*   **Pathfinder 2e Stats Block (`p2e_stats`):** A formatted block for Pathfinder 2e stats (e.g., STR, DEX, AC, Fort, Ref, Will, HP).
*   **Pathfinder 2e Activity (`p2e_activity`):** A formatted block for a Pathfinder 2e activity, including name, action cost, and description.
*   **Pathfinder 2e Traits (`p2e_traits`):** A block to display a list of Pathfinder 2e traits with rarities.
*   **Boxes:** A section with a label and a specified number of checkable boxes.
*   **Fill:** An invisible element that takes up flexible space, useful for layout adjustments.

When adding a section, use the appropriate type to ensure correct rendering.

### Reordering Card Content Sections

The order of the content sections within a card can be adjusted. These are the blocks that appear in the main content area of the card, such as text sections, property lines, stat blocks, and pictures.

To reorder these sections, you can specify the desired new order. For example, you can list the current section headings or types and describe the order you want them to be in.
