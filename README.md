# Thermal Printer TTRPG Card Generator

This web application provides a seamless, mobile-first experience for Tabletop Role-Playing Game (TTRPG) players and Game Masters (GMs) to generate and print custom game cards using thermal or color photo printers quickly at the table during game. It bridges the gap between digital content and physical play, allowing you to create tangible tokens, reminders, or quick references for your games.

There is little more exciting than the spontnaity of a spur of the moment custom magical item discovered mid encounter that gets handed to a player on the spot. 

Use your favorite AI tool to create descriptions and images ("Create B&W Line Drawing of a ..." is a great start for the AI) or download card content from a favorite source as the https://rpg-cards.vercel.app/ card format is supported.

## Quickly Create Cards at the Table

The core advantage of this tool is its ability to create play cards or readily disposable paper sheets for your TTRPG sessions quickly and easily, right at the table with minimal disruption to the game. Need to give your players a tangible receipt for the loot they've just found? Want to hand out a physical reminder of a curse or a special item? You can design, print, and hand over custom-made cards on demand, keeping the game flowing and immersive.

Whether you're a Game Master needing to generate monster stats on the fly or a player wanting a physical copy of a new spell, this generator is designed for rapid, in-the-moment creation of all your tabletop gaming needs.

### Quality Cards
This tool's goal isn't intended to be eyestunning gorgious cards, rather a quick and functional cards on demand. There are other tools avalable which will produce much nicer looking cards. If you need better looking cards, try one of the following.

https://rpg-cards.vercel.app/ - great for DnD 5e cards. Duplex printing cards that look great.

https://cardcreator.daggerheart.com/ Daggerheart's own card creator. 

https://www.daggerheartbrews.com/ A homebrew card creator with stunning results.


## Features

*   **Custom Card Creation:** Design your own TTRPG cards with titles, types, icons, stats, and multiple content sections.
*   **Card Creation from Templates:** Kickstart your card design using a library of pre-made templates for various game systems like D&D and Daggerheart.
*   **Bags of Holding for Card Collections:** Save your creations into named "bags" for easy organization. Keep separate bags for different characters, campaigns, or game systems.
*   **Dynamic Content Sections:** Add various types of content blocks, including text with Markdown support, property lines, stat blocks for popular TTRPGs (D&D 5e, Pathfinder 2e, Savage Worlds), and more.
*   **Flexible Card Formats:** Supports standard cards, folded cards (with back content), and long scrolling cards for continuous paper.
*   **Multi-Card Management:** Load, navigate, delete, and manage multiple cards within the editor at once.
*   **Powerful JSON Import:** Easily import card data from `rpg-cards.vercel.app` JSON format, `5e.tools`, or other generic JSON structures.
*   **Live Preview:** See a real-time preview of your card that adapts to your chosen printer type (Monochrome Thermal or Color Photo).
*   **Direct Android Printing:** On Android devices, a "Print to Thermal Printer" button allows for direct printing via the Looped Labs ESC/POS Print Service app.
*   **Versatile Export Options:** Download your creations as PDF or PNG files.
*   **Easy Sharing:** Share card images directly to other apps using the Web Share API or copy a permanent, bookmarkable link to your card design.
*   **Local Storage Persistence:** Your cards and bags are automatically saved in your browser, so you can pick up where you left off.
*   **Offline Access (PWA):** As a Progressive Web App, it can be installed on your device for offline use.

## How to Use


### 1. Editing Card Details

This is your workshop for forging custom game aids. Create anything from a magic item's description to a full monster stat block.

*   **Card Title:** The name of the spell, item, or creature (e.g., "Fireball," "Vorpal Sword," "Ancient Red Dragon").
*   **Card Type:** A subtitle or category for your card (e.g., "Evocation Spell," "Legendary Magic Item," "Gargantuan Dragon").
*   **Icon Name or Image URL:** Give your card some flair.
    *   Enter an icon name (e.g., `magic-swirl`, `crossed-swords`) from the `game-icons.net` library to display a scalable icon. (Note, we are not affiliated with game-icons.net but they have great icons available)
    *   Alternatively, paste a direct URL to any image on the web.
*   **Card Color (Hex, Optional):** Select a color for the card's background. This is primarily for color photo printing; B&W thermal printers will convert this to grayscale.
*   **Content Sections:** This is where you add the meat of your card.
    *   Click "Add Section" to choose from a variety of content blocks (text, properties, stat blocks, etc.).
    *   Each section can have an optional **Heading**, **Body Text** (which supports `**bold**`, `*italic*`, and `[links](url)`), and **Flavor Text**.
*   **Stats (Key-Value Pairs):** Add simple key-value pairs for quick reference, like "HP: 150" or "Range: 120 ft.".
*   **Tags (Comma-separated):** Add keywords to your card for organization (e.g., `Fire, Spell, Evocation`).
*   **Footer Text (Optional):** Add a source reference or a small note at the bottom (e.g., "Source: DMG p. 157").

### 2. Start Fast with Card Templates

When you click the "Add New" button, you'll be presented with the template library. This feature helps you get started quickly without having to build everything from scratch.

*   **Create a Blank Card:** If you prefer to start with a clean slate, simply click the "Create Blank Card" button.
*   **Create from a Template:** Browse the list of available game systems (like "D&D" or "Pathfinder"). Clicking on a system will reveal a set of pre-configured templates for common items like spells, monsters, or character abilities. Click on any template button to create a new card pre-filled with that template's structure and content, ready for you to customize.

### 3. Card Format Options

This section provides options to control the physical layout of your card.

*   **Folded Card:** Check this box to create a card designed to be folded in half. This enables the "Back/Bottom Fold Content" section, where you can add content to the other side of the card. You can choose between text, an image/icon, or a QR code for the back.
*   **Scrolling Card (Single Page PDF):** Check this box if you have a lot of content that won't fit on a standard-sized card. This format will generate a single, long PDF page that is ideal for continuous roll thermal printers, preventing your content from being split across multiple pages.

### 4. Navigating Multiple Cards

The "Navigate Cards" section helps you manage multiple card entries:

*   **Previous / Next Buttons:** Cycle through the loaded cards.
*   **Card Select Dropdown:** Choose a specific card by its title from the list.
*   **Add New:** Opens a dialog to create a new blank card or start from a template.
*   **Import:** Opens the import dialog to load cards from JSON.
*   **Bag-o-Cards:** Opens the "Bag of Holding" interface to manage your saved collections.
*   **Delete Card:** Deletes the currently selected card from the editor.

### 5. Organize Your Collection with Bags of Holding

The "Bag of Holding" feature allows you to save and organize your card creations into persistent collections, stored right in your browser.

*   **Accessing Your Bags:** Click the "Bag-o-Cards" button in the "Navigate Cards" section to open the management interface.
*   **Creating a New Bag:** In the Bag of Holding popup, type a name for your new collection (e.g., "My D&D Campaign," "Player Loot") and click "Create."
*   **Adding a Card to a Bag:** Once you have a bag created, select it from the dropdown menu. Then, click the "Bag Current Card" button to save a copy of the card you are currently editing into that bag.
*   **Managing Bag Contents:**
    *   **Load a Card:** Click the name of a card in the "Bag Contents" list to load it into the main editor. This is great for when you need to make quick edits or print a saved item.
    *   **Move a Card:** Use the "Move to..." dropdown next to a card to transfer it to another bag.
    *   **Delete a Card from a Bag:** Click the trash can icon to remove a specific card from the collection.
    *   **Export a Card:** Click the download icon to export a single card as a `.json` file.
*   **Exporting an Entire Bag:** Select a bag and click the "Export Selected Bag" button to download all cards in that collection as a single JSON file, perfect for backups or sharing with other players.
*   **Deleting a Bag:** Select a bag from the dropdown and click the trash can icon next to the bag list to permanently delete the entire collection.

### 6. Importing Card Data

Found a cool monster on 5e.tools or have a collection of items from rpg-cards? You can import them directly.

*   **Import from rpg-cards (.json file):** Upload a JSON file generated by or compatible with the `rpg-cards.vercel.app` tool.

**Note:** When you import a file containing multiple cards, they will all be loaded into the editor, ready for you to cycle through, edit, or print.

### 7. Printer Settings & Preview

This is where you configure the final output for your physical cards.

*   **Select Printer Type:** Choose between **Thermal Receipt Printer** (for classic black-and-white paper slips) or **Color Photo Printer** (for vibrant, Zink-style cards).
*   **Thermal Paper Width:** If you're using a thermal printer, select your paper roll width here. Common sizes like `2in` (`58mm`), `3in` (`80mm`), and `4in` (`101.6mm`) are available, or you can specify a custom width.
*   **Standard Size:** For thermal printers, you can pick a standard label size (like `Bridge` or `4" x 6"`) or choose `Continuous Roll` for cards of any length.
*   **Number of Copies:** Print multiple copies for the whole party.
*   **Output Format:** Generate a `PDF` for high-quality printing or a `PNG` for a quick image file.
*   **Card Preview:** See a live preview of your card that updates with every change you make.
*   **Print/Export Scope:** Decide whether to process only the **Current Card** or **All Cards** loaded in the editor.

### 8. Printing and Exporting

Once your masterpiece is ready, you have several ways to bring it into the physical world.

*   **Download PDF / Download Image:** The most reliable method. This saves the file directly to your device, which you can then print manually.
*   **Copy Bookmarkable Link:** Creates a special, shareable URL that contains all the data for your current card. Save it for later or send it to a friend.
*   **Print to Thermal Printer:** (Android only) If you have the ESC/POS Print Service app, this button sends your card directly to your connected thermal printer.
*   **Share Card:** Uses your device's native share feature to send the card image or PDF to other apps like Discord, Google Drive, or your photo gallery.

## Important Notes

*   **Direct Printing:** Direct printing from a web browser to a thermal printer is a bit of a dark art and requires a companion mobile app. This tool is designed to integrate with the Looped Labs ESC/POS Print Service on Android.
*   **Offline Access (PWA):** This tool is a Progressive Web App (PWA). If you're on a secure connection (HTTPS), you can "install" it to your device's home screen for quick access, even when you're offline in a dungeon with no Wi-Fi.
*   **Your Data Stays With You:** All your cards and bags are stored in your browser's local storage. They are never uploaded to a server. This means your creations are private, but it also means you should use the "Export" features to back them up!

Enjoy generating your TTRPG cards!

-----
## Supported Paper Sizes

The tool's UI allows you to select from the most common thermal paper widths and standard card sizes.

*   **Thermal Paper Width:** `2in`, `3in`, `4in`, `58mm`, `80mm`, 101mm.
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
