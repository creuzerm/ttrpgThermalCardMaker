const fs = require('fs');
const path = require('path');

const iconsDir = 'game-icons';
const outputFile = 'icon-lookup.json';
const iconMap = {};
const seenNames = new Set();

/**
 * Recursively scans a directory for SVG files and populates the iconMap.
 * @param {string} currentPath - The current directory path to scan.
 */
function scanDirectory(currentPath) {
    try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                scanDirectory(fullPath);
            } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.svg') {
                // Process SVG files
                const iconName = path.basename(entry.name, '.svg');
                // Use forward slashes for web compatibility
                const webPath = fullPath.replace(/\\/g, '/');

                if (seenNames.has(iconName)) {
                    // Log a warning if the icon name is a duplicate
                    console.warn(`[Warning] Duplicate icon name found: "${iconName}". Path: "${webPath}". The first one found will be used.`);
                } else {
                    // Add the icon to the map and mark it as seen
                    seenNames.add(iconName);
                    iconMap[iconName] = webPath;
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${currentPath}:`, error);
    }
}

console.log('Starting to scan for icons...');
scanDirectory(iconsDir);

try {
    // Write the generated map to the output file
    fs.writeFileSync(outputFile, JSON.stringify(iconMap, null, 2));
    console.log(`Successfully generated icon manifest at: ${outputFile}`);
    console.log(`Found and mapped ${Object.keys(iconMap).length} unique icons.`);
} catch (error) {
    console.error('Error writing icon manifest file:', error);
}
