# Thermal Printer TTRPG Card Generator

This web application provides a seamless, mobile-first experience for Tabletop Role-Playing Game (TTRPG) players and Game Masters (GMs) to generate and print custom game cards using thermal or color photo printers. It bridges the gap between digital content and physical play, allowing you to create tangible tokens, reminders, or quick references for your games.

## Features

*   **Custom Card Creation:** Design your own TTRPG cards with various fields.
*   **Dynamic Content Sections:** Add multiple sections for descriptions, abilities, or flavor text, supporting Markdown-like formatting.
*   **Customizable Stats:** Include key-value pair statistics relevant to your card.
*   **Icon Support:** Use icon names from the included manifest or direct image URLs for card visuals.
*   **Card Color Selection:** Choose a background color for your cards (for color printers).
*   **Flexible Card Formats:** Supports standard cards, folded cards (with back content), and long scrolling cards for continuous paper.
*   **Multi-Card Management:** Load, navigate, and manage multiple cards within the application.
*   **JSON Import:** Easily import card data from `rpg-cards.vercel.app` JSON format, `5e.tools` JSON, or generic JSON structures.
*   **Live Preview:** See a real-time preview of your card as you design it, adapting to chosen printer type.
*   **Direct Android Printing:** On Android, a "Print to Thermal Printer" button appears, allowing for direct printing via the Looped Labs ESC/POS Print Service.
*   **Card View:** A clean, clutter-free view of your card, perfect for sharing or manual printing.
*   **Color Photo Printer Export:** Generate high-resolution images suitable for color photo printers (e.g., Kodak Zink, Fujifilm Instax).
*   **Image Download:** Download card images (single or all) for offline use or manual printing.
*   **Web Share API Integration:** Share generated card images directly to compatible apps on your mobile device.
*   **Bookmarkable Links:** Generate a unique URL for your current card's data, allowing you to save and share specific card designs easily.
*   **Local Storage Persistence:** Your current card data and settings are automatically saved in your browser's local storage.

## How to Use

![Application Screenshot](https://raw.githubusercontent.com/loopeds/thermal-printer-card-generator/main/docs/screenshot.png)

### 1. Editing Card Details

The "Card Details" section allows you to customize the front of your card:

*   **Card Title:** The main title of your card.
*   **Card Type:** A subtitle or category for your card (e.g., "Spell," "Item," "Creature").
*   **Icon Name or Image URL:**
    *   Enter an icon name (e.g., `magic-swirl`, `crossed-swords`) to display a scalable icon. A list of available icons is provided in a datalist.
    *   Alternatively, paste a direct URL to an image (e.g., `https://example.com/my-icon.png`).
*   **Card Color (Hex, Optional):** Select a color for the card's background. This is primarily for color photo printing; thermal printers will convert to grayscale.
*   **Content Sections:**
    *   Click "Add Section" to add new content blocks.
    *   Each section can have an optional **Heading**, **Body Text** (supports `**bold**`, `*italic*`, and `[links](url)`), and optional **Flavor Text** (displayed in italic).
    *   Use the "X" button to remove a section.
*   **Stats (Key-Value Pairs):**
    *   Click "Add Stat" and enter a stat name (e.g., "HP", "STR", "Damage").
    *   Enter the corresponding value for the stat.
    *   Use the "X" button to remove a stat.
*   **Tags (Comma-separated):** Enter keywords related to your card, separated by commas (e.g., `Fire, Spell, Evocation`).
*   **Footer Text (Optional):** Small text displayed at the bottom of the card (e.g., "Source: PHB").

### 2. Card Format Options

This section provides options to control the physical layout of your card.

*   **Folded Card:** Check this box to create a card designed to be folded in half. This enables the "Back/Bottom Fold Content" section, where you can add content to the other side of the card. You can choose between text, an image/icon, or a QR code for the back.
*   **Scrolling Card (Single Page PDF):** Check this box if you have a lot of content that won't fit on a standard-sized card. This format will generate a single, long PDF page that is ideal for continuous roll thermal printers, preventing your content from being split across multiple pages.

### 3. Navigating Multiple Cards

The "Navigate Cards" section helps you manage multiple card entries:

*   **Previous / Next Buttons:** Cycle through the loaded cards.
*   **Card Select Dropdown:** Choose a specific card by its title from the list.
*   **Add New Empty Card:** Create a blank card to start a new design.

### 4. Importing Card Data

You can import existing card data from JSON files or pasted JSON:

*   **Import from rpg-cards.vercel.app (.json file):** Upload a JSON file generated by or compatible with the `rpg-cards.vercel.app` tool.
*   **Paste JSON from 5e.tools/makecards.html or 5e.tools/converter.html:** Paste JSON data copied directly from these 5e.tools utilities.
*   **Paste Generic JSON:** Paste any other JSON data that roughly matches the internal card structure. The application will attempt to map fields.

**Note:** When importing multiple cards from a JSON file, all cards will be loaded into the application, and you can navigate them using the "Navigate Cards" section.

### 5. Printer Settings & Preview

*   **Select Printer Type:**
    *   **Thermal Receipt Printer (Monochrome):** Optimizes the preview and output for black-and-white thermal printers.
    *   **Color Photo Printer (Kodak Zink / Fujifilm Instax):** Optimizes the preview and output for color photo printers.
*   **Thermal Paper Width:** (For Thermal Printers) Choose from common thermal paper widths (`2in`, `3in`, `4in`, `58mm`, `80mm`). You can also select `Other (Custom)` to define your own card dimensions in inches.
*   **Standard Size:** (For Thermal Printers) Based on the selected paper width, choose a standard card size (e.g., `Bridge`, `3" x 5"`) or `Continuous Roll` for a variable length card.
*   **Number of Copies (1-10):** Specify how many copies of the card(s) you want to print or download.
*   **Output Format:** Choose whether you want to generate a `PDF` or a `PNG` file. This selection will change the available "Download" and "Share" buttons.
*   **Card Preview:** A live representation of your card, updating as you make changes.
*   **Print/Export Scope:**
    *   **Current Card:** Only the currently displayed card will be processed for printing or downloading.
    *   **All Cards:** All cards loaded in the application will be processed.

### 6. Printing and Exporting

*   **View Card:** Opens a clean, print-friendly preview of the card in a new tab. This is ideal for sharing a link to a specific card or for manual printing from a desktop browser.
*   **Print to Thermal Printer:** (Android devices only) This button will appear if you are on an Android device. It uses a special `print://` link to send the card directly to the Looped Labs ESC/POS Print Service app for thermal printing.
*   **Print Color Photo Card:** (Visible for Color Printer type) Generates a high-resolution image of the card(s) and attempts to share it with compatible photo printer apps via the Web Share API.
*   **Download Card Image(s):** Downloads the current card (or all cards, based on scope) as a PNG image file(s).
*   **Share Card (via Web Share API):** Attempts to share the current card's image with other applications on your device (e.g., messaging apps, cloud storage).
*   **Copy Bookmarkable Link:** Generates a unique URL that encodes the current card's data and settings. You can save this link to easily return to your design in the editor later or share it with others.

## Important Notes

*   **Direct Printing:** Direct printing from a web browser to a thermal printer requires a companion mobile app. This web app is specifically designed to integrate with the Looped Labs ESC/POS Print Service on Android.
*   **Offline Access (PWA):** This application is a Progressive Web App (PWA). If accessed via HTTPS or on localhost, it can be "installed" to your device's home screen for offline use.
*   **Data Persistence:** Your card data and application settings are saved in your browser's local storage, so they will persist even if you close and reopen the browser tab.

Enjoy generating your TTRPG cards!

-----
## Supported Paper Sizes

The tool's UI allows you to select from the most common thermal paper widths and standard card sizes.

*   **Thermal Paper Width:** `2in`, `3in`, `4in`, `58mm`, `80mm`.
*   **Standard Sizes:** Depending on the width, you can select common label sizes (e.g., `Bridge (2" x 3.5")`, `4" x 6"`) or `Continuous Roll`.
*   **Custom Size:** You can select `Other (Custom)` to input your own card dimensions (width and length) in inches.

<details>
<summary>Technical Paper Size & DPI Details (Click to Expand)</summary>

The tool supports various thermal paper sizes and printer resolutions. The final output is padded to the *printable width* to ensure accurate sizing.
                                       |
| Paper Size (Total Width) | Printable Width (Approx.) | DPI (Dots Per Inch) | Calculation (in Inches) | Actual Pixels (Dots/Line) | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 58mm (2.28 in) | 48mm (1.89 in) | 180 DPI | 1.89" × 180 | 340 pixels | Older or more basic receipt printers. |
| 58mm (2.28 in) | 48mm (1.89 in) | 200 DPI | 1.89" × 200 | 378 pixels | Common for many modern entry-level models. |
| 58mm (2.28 in) | 48mm (1.89 in) | 203 DPI | 1.89" × 203 | 384 pixels | The most common standard for receipts and basic labels. |
| 58mm (2.28 in) | 48mm (1.89 in) | 300 DPI | 1.89" × 300 | 567 pixels | Specialized for high-quality receipts or small labels. |
| 80mm (3.15 in) | 72mm (2.83 in) | 180 DPI | 2.83" × 180 | 509 pixels | Older or more basic POS printers. |
| 80mm (3.15 in) | 72mm (2.83 in) | 200 DPI | 2.83" × 200 | 566 pixels | Common for many modern entry-level models. |
| 80mm (3.15 in) | 72mm (2.83 in) | 203 DPI | 2.83" × 203 | 576 pixels | The most prevalent standard for retail and hospitality POS. |
| 80mm (3.15 in) | 72mm (2.83 in) | 300 DPI | 2.83" × 300 | 849 pixels | Used for high-detail receipts, logos, and intricate barcodes. |
| 2 in (50.8 mm) | 1.89 in (48 mm) | 180 DPI | 1.89" × 180 | 340 pixels | Very basic receipts and labels where resolution isn't a priority. |
| 2 in (50.8 mm) | 1.89 in (48 mm) | 203 DPI | 1.89" × 203 | 384 pixels | Small barcodes, product tags, price tags, and shelf labels. |
| 2 in (50.8 mm) | 1.89 in (48 mm) | 300 DPI | 1.89" × 300 | 567 pixels | Jewelry labels, small asset tracking tags, or detailed QR codes. |
| 3 in (76.2 mm) | 2.83 in (72 mm) | 180 DPI | 2.83" × 180 | 509 pixels | Older point-of-sale (POS) systems, basic receipts, or parking tickets. |
| 3 in (76.2 mm) | 2.83 in (72 mm) | 203 DPI | 2.83" × 203 | 576 pixels | General-purpose labels, shipping labels for small packages, and basic inventory tracking. |
| 3 in (76.2 mm) | 2.83 in (72 mm) | 300 DPI | 2.83" × 300 | 849 pixels | High-density barcodes, medication labels in pharmacies, and product labels with detailed text. |
| 4 in (101.6 mm) | 4.09 in (104 mm) | 203 DPI | 4.09" × 203 | 830 pixels | The standard for shipping labels (4" x 6"), warehouse and pallet labels, and large barcodes. |
| 4 in (101.6 mm) | 4.09 in (104 mm) | 300 DPI | 4.09" × 300 | 1227 pixels | High-resolution shipping labels, large product labels with logos, or detailed compliance information. |
| Letter (8.5 in) | 8.5 in (215.9 mm) | 203 DPI | 8.5" × 203 | 1726 pixels | Printing single-page documents, forms, or reports that need to be generated quickly without ink. |
| Letter (8.5 in) | 8.5 in (215.9 mm) | 300 DPI | 8.5" × 300 | 2550 pixels | High-detail documents, contracts, or high-quality forms in a specific setting like a mobile office. |
| A4 (8.27 in) | 8.27 in (210 mm) | 203 DPI | 8.27" × 203 | 1680 pixels | European standard for thermal documents, similar uses to Letter size but with international compatibility. |
| A4 (8.27 in) | 8.27 in (210 mm) | 300 DPI | 8.27" × 300 | 2480 pixels | High-resolution international documents or forms requiring high-quality, inkless printing. |

</details>

### Standard Thermal Label Sizes (2x3 inches and larger)

| Label Dimensions (W x H) | Common Use Cases |
| :--- | :--- |
| **2" x 3"** (50.8mm x 76.2mm) | Inventory, asset tags, small shipping labels, and product information. |
| **2" x ?"** (50.8mm x ?mm) | Continious Roll - common for this size |
| **3" x 2"** (76.2mm x 50.8mm) | General-purpose labels, bin labels, and barcodes for small items. |
| **3" x 5"** (76.2mm x 127mm) | Shipping labels for smaller packages, compliance labels, and shelf tags. |
| **3" x ?"** (76.2mm x ?mm) | Continous Roll |
| **4" x 2"** (101.6mm x 50.8mm) | Large barcodes, compliance labels, and shipping labels for small items. |
| **4" x 3"** (101.6mm x 76.2mm) | Pallet and carton labeling, shipping labels for medium-sized boxes. |
| **4" x 6"** (101.6mm x 152.4mm) | **Industry standard for shipping labels** (UPS, FedEx, USPS), warehouse, and industrial labeling. |
| **4" x 8"** (101.6mm x 203.2mm) | Large shipping labels, detailed packing slips, and specialized logistics. |
| **4.5" x ?"** (114.3mm x ?mm) | Continious Roll |
