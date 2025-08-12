# AGENTS.md: AI Code Generation Guidelines

## 1. The Vibe: Core Principles

The primary goal is to create web experiences that feel modern, intuitive, and emotionally resonant. The AI's output should reflect a "vibe" that is clean, delightful, and slightly playful, while remaining highly functional.

* **Aesthetics First**: Prioritize clean, modern, and visually appealing designs. The default aesthetic should be dark mode. Good design enhances usability and user satisfaction.
* **Seamless Interaction**: User flows must be intuitive and responsive. Every interaction should feel natural and provide immediate, understandable feedback.
* **Emotional Resonance**: Aim for outputs that evoke positive feelings—calm, efficiency, or delight. The interface should feel like a helpful partner, not a cold tool. Avoid frustration, confusion, or visual clutter.
* **Clarity & Readability**: The generated code itself should be a pleasure to read and understand, reflecting the same quality as the end-user experience.
* **Anticipatory Design**: Proactively address common user needs and potential pain points in the design and implementation.

## 2. Design Specifications

### Visual Aesthetics
All visual style rules are defined in [BagsOfFolding.com/AGENTS.md](https://bagsoffolding.com/AGENTS.md).  
* **Default to Dark Mode**: All designs should start with a dark theme. The primary background color should be a dark slate (slate-900 or slate-950).
* **Aurora Backgrounds**: For primary pages or dashboards, implement a subtle, slow-moving "aurora" background effect using CSS. This effect should use shades from the approved color palette (mauve, pink, rose) to create a gentle, shifting gradient behind the main content.
* **Color Palette**: Use a specific, harmonious color palette.
    * **Background**: slate-900 / slate-950
    * **Content Panels/Cards**: slate-800 / slate-900 with subtle borders (slate-700).
    * **Primary Accent/Action**: mauve-500 / pink-500
    * **Secondary Accent**: rose-500
    * **Text (Primary)**: slate-100 / slate-200
    * **Text (Secondary)**: slate-400
* **Typography**: Use the "Inter" font. Ensure text is highly legible with sufficient contrast.
* **Rounded Corners**: Apply rounded-lg or rounded-xl generously to all elements (buttons, cards, inputs, containers) for a soft, modern feel.
* **Icons**: Use lucide-react for all icons. They should be clean, consistent, and generally have a stroke-width of 1.5 for a lighter feel.
* **Layout**: Use ample whitespace and balanced layouts. Avoid clutter. All layouts must be fully responsive using Tailwind's responsive prefixes (sm:, md:, lg:).


### User Experience & Interaction

* **Bubble Buttons**: Buttons should have a "bubble-like" feel.
    * **Style**: Use a gradient from the accent colors (e.g., bg-gradient-to-br from-mauve-500 to-pink-500).
    * **Interaction**: On hover, the gradient should subtly shift or brighten. On click (active:), the button should scale down slightly (scale-95) to provide tactile feedback.
* **Smooth Transitions**: Employ subtle CSS transitions (transition-all duration-300) for all state changes (hover, focus, active) to make interactions feel fluid.
* **Clear Feedback**: Use non-intrusive loading indicators (like spinners or skeleton loaders) and custom-styled toast messages or modals for success/error states.
* **No Native Alerts**: Never use `alert()` or `confirm()`. They are disruptive and break the "vibe".
*  All layouts must be responsive (Tailwind responsive classes).
* Maintain `max-w-2xl` constraints for main panels.
* Preserve `aria-` attributes for modals and interactive controls.
* Avoid fixed heights except where absolutely required.

## 2.1 UI/UX Context Integration

All generated code must integrate seamlessly with the current HTML structure, respecting existing IDs, classes, and DOM flow.

**Card Navigation & Management**
- Buttons: `prev-card-btn`, `next-card-btn`, `add-new-card-btn`
- Dropdown: `card-select`
- Sync navigation with `appState.currentCardIndex`.

**Card Editing**
- Fields: `title`, `type`, `icon`, `color`, `tags`, `footer`
- Sections container: `sections-container`
- Stats container: `stats-container`
- Folded card options: `is-folded`, `fold-content-type`, `fold-content-text`, `fold-content-image-url`, `fold-content-qr-data`

**Preview Area**
- Front preview: `card-front-preview`
- Back preview: `card-back-preview` (rotated 180° for folded cards)
- Always update previews via `updateUIFromAppState()`

**Import Modal**
- Modal: `import-modal` with close button `close-import-modal-btn`
- Sections:
  - RPG-cards file import (`rpg-cards-json-file`)
  - 5e.tools JSON paste (`5e-tools-json-paste`)
  - Generic JSON paste (`generic-json-paste`)

**Header & Modals**
- Header container: `<header>`
- Menu Button: `menu-btn`
- Menu Dropdown: `menu-dropdown`
- About Link: `about-link`
- About Modal: `about-modal`
- About Modal Content: `about-modal-content`
- About Modal Close Button: `close-about-modal-btn`

---


## 3. Architectural Mandates

* **Single-File Structure**: This project must be maintained within a single `index.html` file. All CSS (via Tailwind CDN), HTML, and JavaScript logic must reside in this file. Do not create or suggest external .js or .css files. This is a deliberate choice for project simplicity.
* **Global appState**: All application data and settings must be stored in the global `appState` object. Any function that changes what the user sees must do so by first modifying `appState` and then calling `updateUIFromAppState()`.

### Key Functions Overview

* **`appState` (Global Object)**: The single source of truth. Holds all card data, the current card index, and all user settings.
* **`updateUIFromAppState()`**: The primary rendering function. Call this after any change to `appState` to update the UI.
* **`saveState()` & `loadState()`**: Handle persistence to `localStorage`.
* **`generateCardHtml()`**: Generates the raw HTML for a card. This is a primary target for visual modifications.
* **`generatePdfDocument()`**: The core function for creating PDFs, containing complex logic for scaling and formatting.
* **`parseAndSetCardData()`**: The entry point for all JSON import logic.

## 4. Code Generation Instructions

* **Completeness**: Always provide self-contained, runnable code. No `...` placeholders.
* **Extensive Comments**: Comment everything to explain logic, algorithms, and the purpose of functions.
* **Error Handling**: Use `try/catch` blocks and provide user-friendly error messages through custom UI elements.
* **Modularity & DRY**: Break down complex logic into smaller, reusable functions. Don't Repeat Yourself.
* **Tailwind CSS ONLY**: Use only Tailwind CSS classes for all styling. Always include `<script src="https://cdn.tailwindcss.com"></script>` in the `<head>`.

## 3.1 Application State & Functions Map

Generated features must work with the existing **`appState`** structure:

```js
appState = {
  cards: [ { /* card object */ } ],
  currentCardIndex: 0,
  printerType: 'thermal',
  thermalPaperWidth: '2in',
  standardSize: 'bridge',
  customWidth: 2,
  customLength: 3.5,
  numCopies: 1,
  printScope: 'current',
  thermalDpi: 203,
  outputFormat: 'pdf',
  includeCornerDots: true,
  isScrolling: false,
  rememberedIcons: []
};
```

Key functions:
- `updateUIFromAppState()` — Re-render UI from `appState` after any changes.
- `renderSections()` / `renderStats()` — Populate editable fields.
- `saveState()` / `loadState()` — Persist to `localStorage`.
- `generateCardHtml()` — Produces printable card HTML.
- `generatePdfDocument()` / `generatePngImage()` — Handles exports.
- `parseAndSetCardData()` — Entry point for imports.

---


## 5. PDF Generation Logic (For Thermal Printers)

This process is specifically designed for continuous-feed thermal printers and requires a precise sequence to correctly scale a card's content to a narrow, physically constrained printable area.

### Rendering Method: Text vs. Image

The application supports two primary methods for generating PDF content:

1.  **Text-Based (Preferred):** Whenever possible, the generator **must** use a text-based rendering method via `jsPDF`. This approach creates high-quality, resolution-independent PDFs with selectable text and vector shapes. This method provides a superior user experience due to smaller file sizes and the ability to copy text from the generated document.

2.  **Image-Based (Fallback):** An image-based method using `html2canvas` is acceptable as a fallback or for specific features like the "Scrolling Card" where a single, continuous image is required. This method should follow the sequence described below.
* **Ensure Full Render Parity**: When modifying or adding card elements, ensure that rendering logic is implemented for **both** the image-based path (`generateCardHtml`) and the text-based path (`generatePdfWithText`). A failure to do so will cause elements to appear in the live preview and image-based exports, but be completely missing from the high-quality paginated PDF exports, as was the case with the `dndstats` block initially.

### Key Concepts

* **Logical Size**: The ideal, intended dimensions of the card (e.g., a "Bridge" card is 2.25" wide by 3.5" long). The logical width is critical for determining the layout, text wrapping, and element flow of the card's content.
* **Printable Area Width**: A user-configurable setting based on the specific printer and paper combination. This is the maximum physical width that the printer can mark (e.g., 47mm on 58mm paper). This value dictates the final width of the PDF page itself.
* **Content Length**: Because the printer may use a continuous roll, the "page" length is variable. It is determined dynamically by the amount of content rendered within the logical width. Alternativly it may use pre-cut labels which we need to fit into.
  * If content is too wide for the allotted size—even by a few characters—it must be addressed. For continuous roll cards where horizontal space is paramount, combine strategies: first, reduce inter-element spacing (e.g., in `dndstats`), and if necessary, also reduce font sizes incrementally.
* 'Cards' can be either paginated, or continous roll.
  * Paginated strictly honor the card size selection
   * Paginated cards may have an optional back which is an image, text or QR code. When this is in use, it shall always be on an even page with a blank page added just prior if needed to ensure even page placement.
  * Continious Roll only honor the width and otherwise print out full content.

### PDF Generation Sequence

The AI must follow these steps exactly:

1.  **Render to Off-Screen Container**: Create a temporary, off-screen `<div>` element and append it to the `<body>`. This container must be styled to have the card's logical width (e.g., `style="width: 2.25in;"`) and be positioned off-screen (e.g., `position: absolute; left: -9999px;`).
2.  **Render Card Content**: Render the complete card content, generated by `generateCardHtml()`, inside this container.
3.  **Measure True Content Height**: Once the content is fully rendered in the off-screen container, measure its `scrollHeight`. This value represents the true, unconstrained height of the card content and will become the length of our PDF page.
4.  **Initialize PDF Document**: Using a library like `jsPDF`, create a new PDF document. The page dimensions must be set explicitly:
    * **Width**: The user-defined `printableAreaWidth`.
    * **Height**: The measured `scrollHeight` from Step 3.
5.  **Capture and Scale Content**: Use `html2canvas` to generate a canvas image of the off-screen container from Step 1. Then, draw this captured image onto the PDF page created in Step 3. The image must be scaled down proportionally to fit the `printableAreaWidth` while maintaining its original aspect ratio.
6.  **Handle Folded Cards**:
    * The entire front of the card is rendered and drawn onto the first page of the PDF as described above.
    * The back content is then rendered and drawn onto a second PDF page.
    * This second page must have the exact same dimensions as the first page.
    * The content on this back page must be rotated 180 degrees (`transform: rotate(180deg)`).
    * If the card front itself requires multiple pages, ensure the back page is added after all front pages, and that the total page count is even to facilitate duplex printing. Add a blank page if necessary before the final back page.
7.  **Optimize and Clean Up**: Use `jsPDF` and `html2canvas` settings that prioritize a small file size (< 10MB), such as adjusting image quality or resolution. After the PDF is generated, it is critical to remove the off-screen container from the DOM to prevent memory leaks or layout issues.

## 5.1 Export Logic

**PDF Export** — Follow the precise 7-step sequence for continuous-feed thermal printers and folded card handling.

**PNG Export**
- Render card to an off-screen container with logical width.
- Capture via `html2canvas` at printer-appropriate scaling.
- For multiple cards, export as ZIP or sequential PNGs.
- Respect `printScope` (current/all).

**Web Share API**
- PNG: share via `navigator.share()` if available.
- PDF: share only if size < 10 MB.

---


## 6. JSON Import Specifications

This section details the expected JSON formats for the "Import Cards" functionality.

### 1. `rpg-cards` Format

This format is based on the [rpg-cards project by crobi](https://crobi.github.io/rpg-cards/). The importer supports a subset of the official specification.

#### Top-Level Card Properties

| Key                | Type            | Description                                                                                                                      |
| :----------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | `string`        | The title of the card.                                                                                                           |
| `count`            | `number`        | The number of copies of this card to create. Parsed into the `numCopies` field.                                                  |
| `color`            | `string`        | A CSS color name or hex code for the card's theme color (used in 'Color' printer mode).                                          |
| `icon`             | `string`        | The name of a game-icon.net icon (e.g., "magic-swirl") or a Font Awesome class name.                                              |
| `icon_back`        | `string`        | The icon for the back of a folded card. If present, sets `isFolded: true` and `foldContent.type: 'imageUrl'`.                      |
| `contents`         | `Array<string>` | An array of strings that define the card's layout and content, processed in order.                                               |
| `background_image` | `string`        | A URL for a background image on the card back. Takes precedence over `icon_back`.                                                |

#### Card `contents` Elements

Each element in the `contents` array is a string formatted as `"element_name | parameter1 | parameter2 | ..."`.

| Element Name   | Parameters                            | Description                                                                                                                                  |
| :------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle`     | `text`, `aside_text`                  | Sets the `type` property of the card, with an optional second parameter for right-aligned text.                                              |
| `rule`         | (none)                                | Adds a dashed horizontal separator.                                                                                                          |
| `property`     | `name`, `description`                 | Adds an inline key-value property line. Parsed as a distinct section type to preserve order.                                                 |
| `dndstats`     | `STR`, `DEX`, `CON`, `INT`, `WIS`, `CHA` | Adds a D&D-style stat block.                                                                                                                 |
| `text`         | `text`                                | Appends text to the `body` of the current section. Handles multi-line text and basic tables (using `｜` as a separator).                         |
| `description`  | `heading`, `body`                     | Creates a new section with a heading and body text.                                                                                          |
| `bullet`       | `text`                                | Adds a bullet point (`•`) to the body of the current section.                                                                                |
| `section`      | `heading`, `aside_text`               | Creates a new section with the given heading, with an optional second parameter for right-aligned text.                                      |
| `fill`         | `weight`                              | Dynamically resized empty element for vertical spacing.                                                                                      |
| `boxes`        | `count`, `size`, `text`               | A line of empty boxes for tracking charges, with optional descriptive text.                                                                  |
| `swstats`      | (various)                             | A stat block for Savage Worlds.                                                                                                              |
| `picture`      | `url`, `height`                       | An inline picture, centered in the card content area.                                                                                        |
| `p2e_stats`    | (various)                             | A stat block for Pathfinder 2nd Edition.                                                                                                     |
| `p2e_activity` | `name`, `actions`, `description`      | An activity block for Pathfinder 2nd Edition, with action icons.                                                                             |
| `p2e_trait`    | `rarity`, `text`                      | A trait badge for Pathfinder 2nd Edition. Must be wrapped in `p2e_start_trait_section` and `p2e_end_trait_section`.                             |
| `ruler`        | (none)                                | A thin, solid horizontal line for content separation.                                                                                        |

### Example `rpg-cards` JSON

```json
[
    {
        "count": 1,
        "color": "#4a6898",
        "title": "Alarm",
        "icon": "magic-swirl",
        "icon_back": "magic-swirl",
        "contents": [
            "subtitle | Level 1 Abjuration",
            "rule",
            "property | Casting Time | 1 minute or Ritual",
            "property | Range | 30 feet",
            "property | Components | V, S, M (a bell and silver wire)",
            "property | Duration | 8 hours",
            "rule",
            "text | You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast \nthe spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is audible or mental:",
            "bullet | <b>Audible Alarm.</b> The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area.",
            "bullet | <b>Mental Alarm.</b> You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you're asleep."
        ],
        "tags": [
            "spell",
            "PHB'24",
            "1st level",
            "Abjuration",
            "Ranger",
            "Wizard",
            "Artificer",
            "ritual"
        ]
    }
]
```
### 5e.tools JSON
- Accepts single object or array.
- Map:
  - `name` → `title`
  - `hp` / `ac` → `stats`
  - `trait` / `action` → new sections
  - Descriptions → body text

### Generic JSON
- Must match internal card shape:
```json
{
  "title": "Fireball",
  "type": "Spell",
  "icon": "magic-swirl",
  "color": "#ff0000",
  "tags": ["Fire", "Spell"],
  "footer": "Source: PHB",
  "stats": { "Level": "3", "Range": "150 ft" },
  "sections": [
    { "heading": "Description", "body": "A fiery explosion...", "flavorText": "" }
  ]
}
```
- Default missing keys to safe values.



## 7. Walkthrough: Adding a New Feature 

**Scenario**: Add a 'rarity' badge to the top-left corner of a card.

1.  **Modify State**: First, add a `rarity` property (e.g., 'common', 'uncommon', 'rare') to the card object schema within the default `appState`.
2.  **Update HTML Generation**: Next, modify the `generateCardHtml()` function. Add a `div` that conditionally renders based on the `card.rarity` property.
3.  **Style with Tailwind**: Use Tailwind CSS to style the badge. It should be positioned absolutely and use the approved color palette. For example:
      * `rare` -\> `bg-mauve-500 text-white` 
      * `uncommon` -\> `bg-slate-600 text-slate-100` 
      * `common` -\> `bg-slate-700 text-slate-300` 
4.  **Trigger Render**: Ensure `updateUIFromAppState()` is called after the state changes. This function will call `updateCardPreview()`, which in turn uses the modified `generateCardHtml()`, automatically displaying the new badge[cite: 143]. No other functions need to be called.

## 8. Image & Icon Handling

This section details how images and icons are sourced, placed, and sized within the application. Understanding this system is crucial for correctly displaying visual elements on cards.

### Sourcing Priority

The application resolves image and icon references from different fields using specific priority rules. It's important to use the correct format for each field.

#### Main Icon (`icon` field)

The primary card icon uses a three-tiered priority system:

1.  **Local Icon Manifest (Primary):** The application first checks if the provided name (e.g., `magic-swirl`) exists as a key in the `icon-lookup.json` manifest file. If found, it uses the local SVG file path. This is the preferred method.
2.  **Direct URL (Secondary):** If not in the manifest, it checks if the value is a valid URL (e.g., `https://example.com/image.png`) and uses it directly.
3.  **Font Awesome (Fallback):** If neither of the above, it's treated as a Font Awesome icon class (e.g., `fa-user`).

#### Folded Card Back Icon (`icon_back` field)

The icon on the back of a folded card uses a two-tiered priority:

1.  **Local Icon Manifest:** Checks `icon-lookup.json` first.
2.  **Direct URL:** If not in the manifest, the value is used directly as a URL.
    *Note: Font Awesome is not supported for `icon_back`.*

#### Other Image Fields

The following fields expect a direct URL only and do not use the manifest or Font Awesome:

*   **`background_image`**: A URL for an image to cover the entire card back.
*   **`picture` content element**: The URL for an inline image within the card body.

### Types of Images

The application supports several distinct types of images on cards:

*   **Main Icon**: The primary icon for the card, typically displayed in the top-right corner.
*   **Inline Picture**: An image embedded within the card's content flow. This is added via the `picture` content type in the JSON data, which specifies a URL and height.
*   **Folded Card Back Image**: An image or icon centered on the back of a folded card. This is sourced from the `icon_back` property.
*   **Folded Card Background Image**: A special image URL that is stretched to cover the entire back surface of a folded card. This is sourced from the `background_image` property in the input JSON.
*   **QR Code**: A dynamically generated image based on data provided in the `foldContent.qrCodeData` property.

### Adding New Local Icons

To add a new icon to the local manifest for easy reuse:

1.  **Add the File**: Place the new `.svg` file into the appropriate subdirectory within the `game-icons/` directory. The folder structure helps organize icons by artist or category.
2.  **Name the Icon**: The name used to reference the icon will be its filename without the `.svg` extension. For example, `game-icons/lorc/my-new-icon.svg` will be referenced as `my-new-icon`.
3.  **Update the Manifest**: Run the build script from the project's root directory:
    ```bash
    node build-icon-manifest.js
    ```
4.  **Verify**: The script will overwrite `icon-lookup.json`. Check the file to ensure your new icon and its correct path have been added. The script will also warn you about any duplicate icon names.

### Placement and Sizing

Image sizing is handled differently for the on-screen preview versus the final generated output.

*   **Placement**:
    *   **Main Icon**: Positioned absolutely in the top-right corner of the card.
    *   **Inline/Back Images**: Centered within their respective containers.
    *   **Background Images**: Stretched to fill their container.

*   **Sizing**:
    *   **Live Preview**: The on-screen preview uses CSS with inch (`in`) units to simulate the final physical dimensions. This provides a rough but useful approximation of the final look.
    *   **Final Output (PDF/PNG)**: For generating the final output, the `generateCardHtml` function performs precise calculations. It converts all layout dimensions (defined in inches or points, e.g., `ICON_SIZE_IN = 0.25`) into exact pixel values based on the user-selected printer DPI. This pixel-perfect HTML is then rendered to a canvas using `html2canvas`, ensuring that the final image is accurately scaled for the chosen physical paper size.
 
## 9. Developer Workflow Guidance

- Modify only `index.html`; keep all CSS/JS inline with CDN imports intact.
- Always change `appState` first, then call `updateUIFromAppState()`.
- Preserve existing handlers unless intentionally replacing them.
- Test in both thermal and color printer modes.
- Avoid native `alert()` / `confirm()` dialogs — use the app’s messaging system.
- Update AGENTS.md when new constraints or criteria are defined.
- Update README.md when new user experience is defined.

