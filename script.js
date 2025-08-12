document.addEventListener('DOMContentLoaded', () => {
    // Global application state
    let iconManifest = {}; // To be populated from icon-lookup.json
    let appState = {
        cards: [ // Array to hold all cards
            {
                id: '',
                title: 'New Card',
                type: 'Spell',
                icon: '', // This will now store the Font Awesome class name or a keyword
                color: '#ffffff',
                tags: [],
                sections: [
                    { heading: 'Description', body: 'This is a magical card.', flavorText: '' }
                ],
                cost: '',
                rarity: '',
                abilities: [],
                image: '', // This field is not directly used for display in the current preview, but kept for data integrity
                stats: {},
                footer: 'TCG.BagsOfFolding.com',
                isFolded: false,
                foldContent: {
                    type: 'text',
                    text: 'Folded content goes here.',
                    imageUrl: '', // This will store the URL for the back image (e.g., from icon_back)
                    qrCodeData: ''
                }
            }
        ],
        currentCardIndex: 0, // Index of the currently displayed card
        printerType: 'thermal', // 'thermal' or 'color'
        thermalPaperWidth: '2in',
        standardSize: 'bridge',
        customWidth: 2,
        customLength: 3.5,
        numCopies: 1, // Number of copies for the current card
        printScope: 'current', // 'current' or 'all'
        thermalDpi: 203, // 180, 200, 203, 300
        outputFormat: 'pdf', // 'pdf' or 'png'
        includeCornerDots: true,
        isScrolling: false, // New property for scrolling card option
        rememberedIcons: []
    };

    const MAX_SHARE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    let pdfShareBlob = null; // To hold the generated PDF blob for the two-click share process

    // DOM Elements (defined after appState for clarity, but before functions that use them)
    const titleInput = document.getElementById('title');
    const typeInput = document.getElementById('type');
    const iconInput = document.getElementById('icon');
    const colorInput = document.getElementById('color');
    const sectionsContainer = document.getElementById('sections-container');
    const addSectionBtn = document.getElementById('add-section-btn');
    const statsContainer = document.getElementById('stats-container');
    const addStatBtn = document.getElementById('add-stat-btn');
    const tagsInput = document.getElementById('tags');
    const footerInput = document.getElementById('footer');
    const isFoldedCheckbox = document.getElementById('is-folded');
    const isScrollingCheckbox = document.getElementById('is-scrolling');
    const foldContentOptions = document.getElementById('fold-content-options');
    const foldContentTypeSelect = document.getElementById('fold-content-type');
    const foldTextInput = document.getElementById('fold-text-input');
    const foldImageInput = document.getElementById('fold-image-input');
    const foldQrInput = document.getElementById('fold-qr-input');
    const foldContentTextarea = document.getElementById('fold-content-text');
    const foldContentImageUrlInput = document.getElementById('fold-content-image-url');
    const foldContentQrDataInput = document.getElementById('fold-content-qr-data');
    const rpgCardsJsonFile = document.getElementById('rpg-cards-json-file');
    const eToolsJsonPaste = document.getElementById('5e-tools-json-paste');
    const genericJsonPaste = document.getElementById('generic-json-paste');
    const printerTypeSelect = document.getElementById('printer-type');
    const thermalPaperSizeContainer = document.getElementById('thermal-paper-size-container');
    const thermalDpiContainer = document.getElementById('thermal-dpi-container');
    const thermalPaperWidthSelect = document.getElementById('thermal-paper-width');
    const standardSizeContainer = document.getElementById('standard-size-container');
    const standardSizeSelect = document.getElementById('standard-size');
    const customSizeContainer = document.getElementById('custom-size-container');
    const customWidthInput = document.getElementById('custom-width');
    const customLengthInput = document.getElementById('custom-length');
    const thermalDpiSelect = document.getElementById('thermal-dpi');
    const numCopiesInput = document.getElementById('num-copies');
    const includeCornerDotsCheckbox = document.getElementById('include-corner-dots');
    const cardPreviewContainer = document.getElementById('card-preview-container');
    const previewTitle = document.getElementById('preview-title');
    const cardFrontPreview = document.getElementById('card-front-preview');
    const cardBackPreviewContainer = document.getElementById('card-back-preview-container');
    const cardBackPreview = document.getElementById('card-back-preview');
    const printThermalBtn = document.getElementById('print-thermal-btn');
    const viewCardBtn = document.getElementById('view-card-btn');
    const printColorPhotoBtn = document.getElementById('print-color-photo-btn');
    const downloadImageBtn = document.getElementById('download-image-btn');
    const shareCardBtn = document.getElementById('share-card-btn');
    const copyBookmarkLinkBtn = document.getElementById('copy-bookmark-link-btn');
    const outputFormatSelect = document.getElementById('output-format');
    const pdfActions = document.getElementById('pdf-actions');
    const pngActions = document.getElementById('png-actions');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const sharePdfBtn = document.getElementById('share-pdf-btn');

    // Card Navigation Elements
    const prevCardBtn = document.getElementById('prev-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const cardSelect = document.getElementById('card-select');
    const addNewCardBtn = document.getElementById('add-new-card-btn');
    const openImportModalBtn = document.getElementById('open-import-modal-btn');

    // Import Modal Elements
    const importModal = document.getElementById('import-modal');
    const closeImportModalBtn = document.getElementById('close-import-modal-btn');
    const accordionFileImportHeading = document.getElementById('accordion-file-import-heading');
    const accordionFileImportContent = document.getElementById('accordion-file-import-content');
    const accordion5eToolsHeading = document.getElementById('accordion-5e-tools-heading');
    const accordion5eToolsContent = document.getElementById('accordion-5e-tools-content');
    const accordionGenericJsonHeading = document.getElementById('accordion-generic-json-heading');
    const accordionGenericJsonContent = document.getElementById('accordion-generic-json-content');

    // Print Scope Radio Buttons
    const printScopeRadios = document.querySelectorAll('input[name="printScope"]');


    // Utility functions (defined first to ensure availability)
    function sanitizeHTML(text) {
        if (!text) return '';
        const sanitizer = document.createElement('div');
        sanitizer.textContent = text;
        return sanitizer.innerHTML;
    }

    function formatText(text) {
        if (!text) return '';
        let formattedText = text;
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
        formattedText = formattedText.replace(/<i>/g, '<em>');
        formattedText = formattedText.replace(/<\/i>/g, '</em>');
        formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); // Links
        formattedText = formattedText.replace(/\n/g, '<br />'); // Newlines
        return formattedText;
    }

    function htmlToMarkdown(text) {
        if (!text) return '';
        let markdownText = text;
        // Replace bold tags
        markdownText = markdownText.replace(/<b>(.*?)<\/b>/gi, '**$1**');
        // Replace italic tags
        markdownText = markdownText.replace(/<i>(.*?)<\/i>/gi, '*$1*');
        return markdownText;
    }

    function showMessage(msg, isError = false) {
        const messageDisplay = document.getElementById('message-display');
        if (!messageDisplay) return;

        messageDisplay.textContent = msg;
        messageDisplay.classList.remove('hidden', 'bg-blue-500', 'bg-red-500');
        messageDisplay.classList.add(isError ? 'bg-red-500' : 'bg-blue-500');

        // Automatically hide after 5 seconds
        setTimeout(() => {
            messageDisplay.classList.add('hidden');
        }, 5000);
    }

    // Function to determine if a string is a URL
    function isURL(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }


    function getP2eActionIcon(actions) {
        const actionMap = { '0': 'F', '1': '1A', '2': '2A', '3': '3A', 'R': 'R' };
        const actionText = actionMap[actions] || actions;
        let bgColor = 'bg-slate-500';
        if (actions === '1') bgColor = 'bg-slate-600';
        if (actions === '2') bgColor = 'bg-amber-600';
        if (actions === '3') bgColor = 'bg-mauve-500';
        if (actions === 'R') bgColor = 'bg-rose-500';
        if (actions === '0') bgColor = 'bg-emerald-600';

        return `<div class="flex items-center justify-center w-8 h-5 rounded-lg text-white text-xs font-bold ${bgColor}">${actionText}</div>`;
    }

    function renderStatBlock(stats, columns) {
        const statItems = Object.entries(stats)
            .map(([key, value]) => {
                if (!value) return null;
                return `<div class="flex flex-col items-center p-1 bg-gray-100 rounded-md">
                                <strong class="text-xs uppercase font-bold">${sanitizeHTML(key)}</strong>
                                <span>${sanitizeHTML(value)}</span>
                            </div>`
            })
            .filter(Boolean)
            .join('');
        const gridClass = `grid-cols-${columns}`;
        return `<div class="grid ${gridClass} gap-1 my-2 text-center">${statItems}</div>`;
    }

    // Render functions (called by updateUIFromAppState and event handlers)
    function renderSections() {
        const currentCard = appState.cards[appState.currentCardIndex];
        sectionsContainer.innerHTML = '';
        const sectionsToRender = Array.isArray(currentCard.sections) ? currentCard.sections : [];

        const inputBaseClasses = "w-full p-2 rounded-md bg-gray-600 border border-gray-500 section-input";
        const labelBaseClasses = "block text-sm font-medium text-gray-300 mb-1";

        sectionsToRender.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'bg-gray-700 p-4 rounded-md mb-3 relative';
            let contentHtml = `<button data-index="${index}" class="remove-section-btn absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-full">X</button>`;

            switch (section.type) {
                case 'rule':
                    contentHtml += `<div class="text-center text-gray-400">--- Horizontal Rule ---</div>`;
                    break;
                case 'ruler':
                    contentHtml += `<div class="text-center text-gray-400">--- Thin Rule ---</div>`;
                    break;
                case 'fill':
                    contentHtml += `<div class="text-center text-gray-400">Fill Element (weight: ${section.weight || 1})</div>`;
                    break;
                case 'property':
                    contentHtml += `
                            <p class="text-base font-semibold text-gray-300 mb-2">Property</p>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label for="prop-key-${index}" class="${labelBaseClasses}">Key</label>
                                    <input type="text" id="prop-key-${index}" data-index="${index}" data-field="key" value="${section.key || ''}" class="${inputBaseClasses}">
                                </div>
                                <div>
                                    <label for="prop-value-${index}" class="${labelBaseClasses}">Value</label>
                                    <input type="text" id="prop-value-${index}" data-index="${index}" data-field="value" value="${section.value || ''}" class="${inputBaseClasses}">
                                </div>
                            </div>
                        `;
                    break;
                case 'dndstats':
                    const dndStatKeys = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
                    contentHtml += `<p class="text-base font-semibold text-gray-300 mb-2">D&D Stats</p><div class="grid grid-cols-3 gap-2">`;
                    dndStatKeys.forEach(key => {
                        contentHtml += `
                                <div>
                                    <label class="${labelBaseClasses}">${key}</label>
                                    <input type="text" data-index="${index}" data-field="stats" data-subfield="${key}" value="${(section.stats && section.stats[key]) || ''}" class="${inputBaseClasses}">
                                </div>`;
                    });
                    contentHtml += `</div>`;
                    break;
                case 'picture':
                    contentHtml += `
                            <p class="text-base font-semibold text-gray-300 mb-2">Picture</p>
                            <div class="grid grid-cols-1 gap-2">
                                <div>
                                    <label class="${labelBaseClasses}">Image URL</label>
                                    <input type="text" data-index="${index}" data-field="url" value="${section.url || ''}" class="${inputBaseClasses}">
                                </div>
                                <div>
                                    <label class="${labelBaseClasses}">Height (px)</label>
                                    <input type="number" data-index="${index}" data-field="height" value="${section.height ?? 50}" class="${inputBaseClasses}">
                                </div>
                            </div>`;
                    break;
                case 'boxes':
                     contentHtml += `
                            <p class="text-base font-semibold text-gray-300 mb-2">Boxes</p>
                            <div>
                                <label class="${labelBaseClasses}">Label Text</label>
                                <input type="text" data-index="${index}" data-field="text" value="${section.text || ''}" class="${inputBaseClasses} mb-2">
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="${labelBaseClasses}">Count</label>
                                    <input type="number" data-index="${index}" data-field="count" value="${section.count || 1}" class="${inputBaseClasses}">
                                </div>
                                <div>
                                    <label class="${labelBaseClasses}">Size (em)</label>
                                    <input type="number" step="0.1" data-index="${index}" data-field="size" value="${section.size || 1.0}" class="${inputBaseClasses}">
                                </div>
                            </div>`;
                    break;
                 case 'swstats':
                    const swStatKeys = ['agility', 'smarts', 'spirit', 'strength', 'vigor', 'pace', 'parry', 'toughness', 'loot'];
                    contentHtml += `<p class="text-base font-semibold text-gray-300 mb-2">Savage Worlds Stats</p><div class="grid grid-cols-3 gap-2">`;
                    swStatKeys.forEach(key => {
                        contentHtml += `
                                <div>
                                    <label class="${labelBaseClasses}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <input type="text" data-index="${index}" data-field="stats" data-subfield="${key}" value="${section.stats[key] || ''}" class="${inputBaseClasses}">
                                </div>`;
                    });
                    contentHtml += `</div>`;
                    break;
                case 'p2e_stats':
                    const p2eStatKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha', 'ac', 'fort', 'ref', 'will', 'hp'];
                    contentHtml += `<p class="text-base font-semibold text-gray-300 mb-2">Pathfinder 2e Stats</p><div class="grid grid-cols-3 gap-2">`;
                    p2eStatKeys.forEach(key => {
                         contentHtml += `
                                <div>
                                    <label class="${labelBaseClasses}">${key.toUpperCase()}</label>
                                    <input type="text" data-index="${index}" data-field="stats" data-subfield="${key}" value="${section.stats[key] || ''}" class="${inputBaseClasses}">
                                </div>`;
                    });
                    contentHtml += `</div>`;
                    break;
                case 'p2e_activity':
                    contentHtml += `
                            <p class="text-base font-semibold text-gray-300 mb-2">Pathfinder 2e Activity</p>
                            <div>
                                <label class="${labelBaseClasses}">Name</label>
                                <input type="text" data-index="${index}" data-field="name" value="${section.name || ''}" class="${inputBaseClasses} mb-2">
                            </div>
                            <div>
                                <label class="${labelBaseClasses}">Actions</label>
                                <input type="text" data-index="${index}" data-field="actions" value="${section.actions || ''}" class="${inputBaseClasses} mb-2">
                            </div>
                             <div>
                                <label class="${labelBaseClasses}">Description</label>
                                <textarea data-index="${index}" data-field="description" rows="3" class="${inputBaseClasses}">${section.description || ''}</textarea>
                            </div>`;
                    break;
                case 'p2e_traits':
                    contentHtml += `<p class="text-base font-semibold text-gray-300 mb-2">Pathfinder 2e Traits</p>`;
                    // This is a complex one. For now, we'll just allow editing existing traits.
                    section.traits.forEach((trait, traitIndex) => {
                         contentHtml += `
                                <div class="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label class="${labelBaseClasses}">Rarity</label>
                                        <input type="text" data-index="${index}" data-field="traits" data-sub-index="${traitIndex}" data-sub-field="rarity" value="${trait.rarity || ''}" class="${inputBaseClasses}">
                                    </div>
                                    <div>
                                        <label class="${labelBaseClasses}">Text</label>
                                        <input type="text" data-index="${index}" data-field="traits" data-sub-index="${traitIndex}" data-sub-field="text" value="${trait.text || ''}" class="${inputBaseClasses}">
                                    </div>
                                </div>`;
                    });
                    break;
                default: // 'content' section
                    contentHtml += `
                            <div class="grid grid-cols-2 gap-x-2 mb-2">
                                <div>
                                    <label class="${labelBaseClasses}">Heading</label>
                                    <input type="text" data-index="${index}" data-field="heading" value="${section.heading || ''}" class="${inputBaseClasses}">
                                </div>
                                <div>
                                    <label class="${labelBaseClasses}">Heading Aside</label>
                                    <input type="text" data-index="${index}" data-field="headingAside" value="${section.headingAside || ''}" class="${inputBaseClasses}">
                                </div>
                            </div>
                            <label class="${labelBaseClasses}">Body Text (Markdown-like)</label>
                            <textarea data-index="${index}" data-field="body" rows="4" class="${inputBaseClasses} mb-2" placeholder="Use **bold**, *italic*, and newlines.">${section.body || ''}</textarea>
                            <label class="${labelBaseClasses}">Flavor Text (Optional)</label>
                            <textarea data-index="${index}" data-field="flavorText" rows="2" class="${inputBaseClasses}" placeholder="Optional italicized text.">${section.flavorText || ''}</textarea>
                        `;
                    break;
            }

            sectionDiv.innerHTML = contentHtml;
            sectionsContainer.appendChild(sectionDiv);
        });

        document.querySelectorAll('.section-input').forEach(input => {
            input.addEventListener('input', handleSectionChange);
        });
        document.querySelectorAll('.remove-section-btn').forEach(button => {
            button.addEventListener('click', handleRemoveSection);
        });
        updateCardPreview();
    }

    function handleSectionChange(event) {
        const index = parseInt(event.target.dataset.index, 10);
        const field = event.target.dataset.field;
        const subfield = event.target.dataset.subfield;
        const subIndex = event.target.dataset.subIndex ? parseInt(event.target.dataset.subIndex, 10) : -1;
        const value = event.target.type === 'number' ? (event.target.value === '' ? null : parseFloat(event.target.value)) : event.target.value;

        const section = appState.cards[appState.currentCardIndex].sections[index];

        if (subfield) {
            if (Array.isArray(section[field]) && subIndex !== -1) {
                // Handle array of objects, e.g., p2e_traits
                 if (!section[field][subIndex]) section[field][subIndex] = {};
                section[field][subIndex][subfield] = value;
            } else if (typeof section[field] === 'object' && section[field] !== null) {
                 // Handle simple object, e.g., dndstats
                section[field][subfield] = value;
            } else {
                // Initialize if it doesn't exist
                section[field] = {};
                section[field][subfield] = value;
            }
        } else {
            section[field] = value;
        }

        saveState();
        updateCardPreview();
    }

    function handleRemoveSection(event) {
        const index = parseInt(event.target.dataset.index);
        appState.cards[appState.currentCardIndex].sections.splice(index, 1);
        renderSections();
        saveState();
    }

    function renderStats() {
        const currentCard = appState.cards[appState.currentCardIndex];
        statsContainer.innerHTML = '';
        const statsToRender = (currentCard.stats && typeof currentCard.stats === 'object') ? currentCard.stats : {};

        Object.entries(statsToRender).forEach(([key, value]) => {
            const statDiv = document.createElement('div');
            statDiv.className = 'flex items-center mb-2';
            statDiv.innerHTML = `
                    <input type="text" value="${key || ''}" readonly class="w-1/3 p-2 rounded-l-md bg-gray-600 border border-gray-500 cursor-not-allowed">
                    <input type="text" data-key="${key || ''}" value="${value || ''}" class="stat-input w-2/3 p-2 rounded-r-md bg-gray-600 border border-gray-500">
                    <button data-key="${key || ''}" class="remove-stat-btn ml-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded-full">X</button>
                `;
            statsContainer.appendChild(statDiv);
        });
        document.querySelectorAll('.stat-input').forEach(input => {
            input.addEventListener('input', handleStatChange);
        });
        document.querySelectorAll('.remove-stat-btn').forEach(button => {
            button.addEventListener('click', handleRemoveStat);
        });
        updateCardPreview();
    }

    function handleStatChange(event) {
        const key = event.target.dataset.key;
        appState.cards[appState.currentCardIndex].stats[key] = event.target.value;
        saveState();
        updateCardPreview();
    }

    function handleRemoveStat(event) {
        const key = event.target.dataset.key;
        delete appState.cards[appState.currentCardIndex].stats[key];
        renderStats();
        saveState();
    }

    const STANDARD_SIZES = {
        '2in': [
            { value: 'bridge', label: 'Bridge (2" x 3.5")', width: 2, length: 3.5 },
            { value: '2x3', label: '2" x 3"', width: 2, length: 3 },
            { value: 'continuous', label: 'Continuous Roll', width: 2, length: null }
        ],
        '3in': [
            { value: '3x2', label: '3" x 2"', width: 3, length: 2 },
            { value: '3x5', label: '3" x 5"', width: 3, length: 5 },
            { value: 'continuous', label: 'Continuous Roll', width: 3, length: null }
        ],
        '4in': [
            { value: '4x6', label: '4" x 6" (Standard Shipping)', width: 4, length: 6 },
            { value: '4x3', label: '4" x 3"', width: 4, length: 3 },
            { value: '4x8', label: '4" x 8"', width: 4, length: 8 },
            { value: 'continuous', label: 'Continuous Roll', width: 4, length: null }
        ],
        '58mm': [
            { value: 'continuous', label: 'Continuous Roll', width: 2.28, length: null }
        ],
        '80mm': [
            { value: 'continuous', label: 'Continuous Roll', width: 3.15, length: null }
        ]
    };

    function updateCardPreview() {
        const card = appState.cards[appState.currentCardIndex];
        const printerType = appState.printerType;

        const { cardWidth, cardHeight } = getCardDimensionsInInches();

        const widthClass = `w-[${cardWidth}in]`;
        cardFrontPreview.style.height = `${cardHeight}in`;

        const textColor = printerType === 'thermal' ? 'text-black' : 'text-gray-900';
        const bgColor = printerType === 'thermal' ? 'bg-white' : card.color || 'bg-white';
        const borderColor = printerType === 'thermal' ? 'border-gray-400' : 'border-gray-300';

        cardPreviewContainer.className = `p-4 rounded-lg shadow-lg ${bgColor} ${textColor} ${borderColor} border-2 overflow-hidden`;
        previewTitle.textContent = `Card Preview (${printerType === 'thermal' ? 'Monochrome' : 'Color'})`;

        let iconHtml = '';
        if (card.icon) {
            if (iconManifest[card.icon]) {
                const iconPath = iconManifest[card.icon];
                iconHtml = `<img src="${iconPath}" alt="${sanitizeHTML(card.icon)}" style="position: absolute; top: 0.125in; right: 0.125in; width: 0.25in; height: 0.25in; object-fit: contain;" class="${printerType === 'thermal' ? 'filter grayscale' : ''}" onerror="this.src='https://placehold.co/48x48/${printerType === 'thermal' ? '000/FFF' : 'E0E0E0/888'}?text=ICON';" />`;
            } else if (isURL(card.icon)) {
                iconHtml = `<img src="${sanitizeHTML(card.icon)}" alt="Card Icon" style="position: absolute; top: 0.125in; right: 0.125in; width: 0.25in; height: 0.25in; object-fit: contain;" class="${printerType === 'thermal' ? 'filter grayscale' : ''}" onerror="this.src='https://placehold.co/48x48/${printerType === 'thermal' ? '000/FFF' : 'E0E0E0/888'}?text=IMG';" />`;
            } else {
                // Fallback to lucide icon
                const iconName = sanitizeHTML(card.icon);
                iconHtml = `<i data-lucide="${iconName}" style="position: absolute; top: 0.125in; right: 0.125in; width: 0.25in; height: 0.25in; stroke-width: 1.5;" class="${printerType === 'thermal' ? 'filter grayscale' : ''}"></i>`;
            }
        }

        cardFrontPreview.className = `relative mx-auto p-2 border border-dashed border-gray-400 rounded-md ${widthClass} min-h-[150px] flex flex-col justify-between`;
        cardFrontPreview.innerHTML = `
                ${iconHtml}
                <div class="flex flex-col mb-2">
                    <h1 class="text-2xl font-extrabold text-center mb-1 leading-tight">${sanitizeHTML(card.title || '')}</h1>
                    ${card.type ?
            (typeof card.type === 'object' ?
                `<div class="flex justify-between items-baseline text-lg">
                                <span>${sanitizeHTML(card.type.text || '')}</span>
                                <span class="text-sm font-light">${sanitizeHTML(card.type.aside || '')}</span>
                            </div>` :
                `<p class="text-lg text-center">${sanitizeHTML(card.type)}</p>`
            )
            : ''}
                </div>

                ${(card.stats && Object.keys(card.stats).length > 0) ? `
                    <div class="flex flex-wrap justify-center text-sm mb-2">
                        ${Object.entries(card.stats).map(([key, value]) => `
                            <span class="mx-2 whitespace-nowrap">
                                <strong class="font-semibold">${sanitizeHTML(key || '')}:</strong> ${sanitizeHTML(value || '')}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="flex-grow overflow-hidden flex flex-col">
                    ${(card.sections && Array.isArray(card.sections)) ? card.sections.map((section, index) => {
                switch (section.type) {
                    case 'rule':
                        return '<hr class="border-gray-400 my-1 border-dashed"/>';
                    case 'fill':
                        return `<div style="flex-grow: ${section.weight || 1};"></div>`;
                    case 'property':
                        return `<div class="text-sm"><strong class="font-semibold">${sanitizeHTML(section.key)}:</strong> ${sanitizeHTML(section.value)}</div>`;
                    case 'dndstats':
                        const statsHtml = Object.entries(section.stats)
                            .map(([k, v]) => `<div class="flex flex-col items-center mx-0.5">
                                                        <strong class="font-bold text-sm">${sanitizeHTML(k)}</strong>
                                                        <span class="text-xs">${sanitizeHTML(v)}</span>
                                                     </div>`)
                            .join('');
                        return `<div class="flex justify-center my-1 p-1 bg-gray-100 rounded-md">${statsHtml}</div>`;
                    case 'picture':
                        return `<div class="my-2 flex justify-center"><img src="${sanitizeHTML(section.url)}" style="height: ${section.height}px;" class="rounded-md" alt="Card Picture" onerror="this.src='https://placehold.co/100x${section.height}/000/FFF?text=Image';"></div>`;
                    case 'boxes':
                        let boxesHtml = '';
                        const boxCount = section.count || 1;
                        const boxSize = section.size || 1.0;
                        for (let i = 0; i < boxCount; i++) {
                            boxesHtml += `<span style="font-size: ${boxSize}em; line-height: 1; vertical-align: middle;" class="mx-1 border border-black inline-block w-[1em] h-[1em] bg-white"></span>`;
                        }
                        const textHtml = section.text ? `<p class="text-sm mb-1">${sanitizeHTML(section.text)}</p>` : '';
                        return `<div class="my-2 text-center">
                                            ${textHtml}
                                            <div>${boxesHtml}</div>
                                        </div>`;
                    case 'ruler':
                        return '<hr class="border-gray-500 my-1 border-solid"/>';
                    case 'swstats':
                        return renderStatBlock(section.stats, 5);
                    case 'p2e_stats':
                        return renderStatBlock(section.stats, 6);
                    case 'p2e_activity':
                        const actionIconHtml = getP2eActionIcon(section.actions);
                        return `<div class="my-2">
                                            <div class="flex items-center gap-2">
                                                ${actionIconHtml}
                                                <strong class="font-bold">${sanitizeHTML(section.name)}</strong>
                                            </div>
                                            <p class="text-sm pl-10">${formatText(section.description)}</p>
                                        </div>`;
                    case 'p2e_traits':
                        const traitsHtml = section.traits.map(trait => {
                            let rarityClass = 'bg-gray-500'; // common
                            if (trait.rarity === 'uncommon') rarityClass = 'bg-blue-700';
                            if (trait.rarity === 'rare') rarityClass = 'bg-purple-700';
                            if (trait.rarity === 'unique') rarityClass = 'bg-yellow-600';
                            return `<span class="text-xs text-white ${rarityClass} rounded-full px-3 py-1 font-semibold uppercase tracking-wider">${sanitizeHTML(trait.text)}</span>`;
                        }).join('');
                        return `<div class="flex flex-wrap items-center gap-2 my-2">${traitsHtml}</div>`;
                    case 'content':
                    default:
                        return `
                                    <div class="mb-2">
                                        ${section.heading ? `
                                            <div class="flex justify-between items-baseline border-b border-gray-300 pb-1 mb-1">
                                                <h2 class="text-lg font-semibold">${sanitizeHTML(section.heading)}</h2>
                                                ${section.headingAside ? `<span class="text-sm font-light">${sanitizeHTML(section.headingAside)}</span>` : ''}
                                            </div>
                                        ` : ''}
                                        <p class="text-sm leading-snug card-content">${formatText(section.body || '')}</p>
                                        ${section.flavorText ? `<p class="text-xs italic text-gray-600 mt-1 card-content">${formatText(section.flavorText || '')}</p>` : ''}
                                    </div>
                                `;
                }
            }).join('') : ''}
                </div>

                ${(card.tags && Array.isArray(card.tags) && card.tags.length > 0) ? `
                    <p class="text-xs text-center mt-2 border-t border-gray-300 pt-1">Tags: ${sanitizeHTML(card.tags.join(', '))}</p>
                ` : ''}
                ${card.footer ? `<p class="text-xs text-center mt-1">${sanitizeHTML(card.footer || '')}</p>` : ''}
            `;

        if (card.isFolded) {
            cardBackPreviewContainer.classList.remove('hidden');
            cardBackPreview.className = `relative mx-auto p-2 border border-dashed border-gray-400 rounded-md ${widthClass} min-h-[100px] flex flex-col justify-center items-center transform rotate-180`;
            let foldContentHtml = '';
            const foldContent = card.foldContent && typeof card.foldContent === 'object' ? card.foldContent : {};

            if (foldContent.type === 'text' && foldContent.text) {
                foldContentHtml = `<p class="text-sm text-center card-content">${formatText(foldContent.text)}</p>`;
            } else if (foldContent.type === 'backgroundImageUrl' && foldContent.imageUrl) {
                foldContentHtml = `<img src="${sanitizeHTML(foldContent.imageUrl)}" alt="Card Back" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" class="${printerType === 'thermal' ? 'filter grayscale' : ''}" onerror="this.src='https://placehold.co/96x96/000/FFF?text=BG+IMG';" />`;
            } else if (foldContent.type === 'imageUrl' && foldContent.imageUrl) {
                let backImagePath = foldContent.imageUrl;
                if (iconManifest[backImagePath]) {
                    backImagePath = iconManifest[backImagePath];
                }
                foldContentHtml = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><img src="${sanitizeHTML(backImagePath)}" alt="Fold Back Image" style="width: 100%; object-fit: contain;" class="${printerType === 'thermal' ? 'filter grayscale' : ''}" onerror="this.src='https://placehold.co/96x96/${printerType === 'thermal' ? '000/FFF' : 'E0E0E0/888'}?text=BACK+IMG';" /></div>`;
            } else if (foldContent.type === 'qrCode' && foldContent.qrCodeData) {
                foldContentHtml = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(foldContent.qrCodeData)}" alt="QR Code" class="w-24 h-24 object-contain" onerror="this.src='https://placehold.co/96x96/000/FFF?text=QR';" />`;
            }
            cardBackPreview.innerHTML = foldContentHtml;
        } else {
            cardBackPreviewContainer.classList.add('hidden');
        }
        lucide.createIcons();
    }

    // Functions for toggling UI elements based on state
    function toggleFoldContentOptions() {
        const currentCard = appState.cards[appState.currentCardIndex];
        if (currentCard.isFolded) {
            foldContentOptions.classList.remove('hidden');
            updateFoldContentInputs();
        } else {
            foldContentOptions.classList.add('hidden');
        }
    }

    function updateFoldContentInputs() {
        foldTextInput.classList.add('hidden');
        foldImageInput.classList.add('hidden');
        foldQrInput.classList.add('hidden');

        const currentCard = appState.cards[appState.currentCardIndex];
        if (currentCard.foldContent.type === 'text') {
            foldTextInput.classList.remove('hidden');
        } else if (currentCard.foldContent.type === 'imageUrl') {
            foldImageInput.classList.remove('hidden');
        } else if (currentCard.foldContent.type === 'qrCode') {
            foldQrInput.classList.remove('hidden');
        }
    }

    function updateStandardSizes() {
        const width = appState.thermalPaperWidth;
        standardSizeSelect.innerHTML = '';

        if (width === 'custom') {
            standardSizeContainer.classList.add('hidden');
            customSizeContainer.classList.remove('hidden');
        } else {
            standardSizeContainer.classList.remove('hidden');
            customSizeContainer.classList.add('hidden');
            const sizes = STANDARD_SIZES[width] || [];
            sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size.value;
                option.textContent = size.label;
                standardSizeSelect.appendChild(option);
            });
            if (sizes.length > 0) {
                appState.standardSize = sizes[0].value;
                standardSizeSelect.value = appState.standardSize;
            }
        }
        updateCardPreview();
    }

    function togglePrinterTypeOptions() {
        if (appState.printerType === 'thermal') {
            thermalPaperSizeContainer.classList.remove('hidden');
            standardSizeContainer.classList.remove('hidden');
            thermalDpiContainer.classList.remove('hidden');
            printThermalBtn.classList.remove('hidden');
            printColorPhotoBtn.classList.add('hidden');
            updateStandardSizes();
        } else {
            thermalPaperSizeContainer.classList.add('hidden');
            standardSizeContainer.classList.add('hidden');
            customSizeContainer.classList.add('hidden');
            thermalDpiContainer.classList.add('hidden');
            printThermalBtn.classList.add('hidden');
            printColorPhotoBtn.classList.remove('hidden');
        }
    }

    function toggleOutputActions() {
        if (appState.outputFormat === 'pdf') {
            pdfActions.classList.remove('hidden');
            pngActions.classList.add('hidden');
        } else {
            pdfActions.classList.add('hidden');
            pngActions.classList.remove('hidden');
        }
    }

    // Card Navigation UI Update
    function updateCardNavigationUI() {
        cardSelect.innerHTML = '';
        appState.cards.forEach((card, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = card.title || `Untitled Card ${index + 1}`;
            cardSelect.appendChild(option);
        });
        cardSelect.value = appState.currentCardIndex;

        prevCardBtn.disabled = appState.currentCardIndex === 0;
        nextCardBtn.disabled = appState.currentCardIndex === appState.cards.length - 1;
    }

    // Centralized function to update all UI elements from appState
    function updateUIFromAppState() {
        const currentCard = appState.cards[appState.currentCardIndex];

        titleInput.value = currentCard.title || '';
        if (typeof currentCard.type === 'object' && currentCard.type !== null) {
            typeInput.value = currentCard.type.text || '';
            // The aside is not editable in the main UI for now.
        } else {
            typeInput.value = currentCard.type || '';
        }
        iconInput.value = currentCard.icon || ''; // Icon name or URL
        colorInput.value = currentCard.color || '#ffffff';
        tagsInput.value = (currentCard.tags && Array.isArray(currentCard.tags)) ? currentCard.tags.join(', ') : '';
        footerInput.value = currentCard.footer || '';
        isFoldedCheckbox.checked = currentCard.isFolded;
        printerTypeSelect.value = appState.printerType;
        outputFormatSelect.value = appState.outputFormat;
        isScrollingCheckbox.checked = appState.isScrolling;
        thermalPaperWidthSelect.value = appState.thermalPaperWidth;
        standardSizeSelect.value = appState.standardSize;
        customWidthInput.value = appState.customWidth;
        customLengthInput.value = appState.customLength;
        thermalDpiSelect.value = appState.thermalDpi;
        numCopiesInput.value = appState.numCopies;
        includeCornerDotsCheckbox.checked = appState.includeCornerDots;

        if (!currentCard.foldContent || typeof currentCard.foldContent !== 'object') {
            currentCard.foldContent = { type: 'text', text: '', imageUrl: '', qrCodeData: '' };
        }
        foldContentTypeSelect.value = currentCard.foldContent.type || 'text';
        foldContentTextarea.value = currentCard.foldContent.text || '';
        foldContentImageUrlInput.value = currentCard.foldContent.imageUrl || '';
        foldContentQrDataInput.value = currentCard.foldContent.qrCodeData || '';

        if (!currentCard.sections || !Array.isArray(currentCard.sections)) {
            currentCard.sections = [];
        }
        if (!currentCard.stats || typeof currentCard.stats !== 'object') {
            currentCard.stats = {};
        }

        renderSections();
        renderStats();
        toggleFoldContentOptions();
        togglePrinterTypeOptions();
        toggleOutputActions();
        updateCardNavigationUI(); // Update card navigation UI
        updateCardPreview();
        updatePrintLink();
    }

    // Save state to localStorage
    function saveState() {
        localStorage.setItem('ttrpgCardPrinterState', JSON.stringify(appState));
        updatePrintLink();
    }

    // Load state from localStorage or URL parameters
    function loadState() {
        // This function defines the data loading priority:
        // 1. Check for card data in the URL ('data' or 'cardData' parameter). This is for bookmarkable links.
        // 2. If no URL data, check for a saved state in localStorage.
        // 3. If neither is found, it uses the default initial appState.
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const cardDataParam = urlParams.get('data') || urlParams.get('cardData');

            if (cardDataParam) {
                const decodedString = decodeURIComponent(atob(cardDataParam));
                const decodedData = JSON.parse(decodedString);

                // Correctly unpack the data from the URL
                if (decodedData.card) {
                    appState.cards = [decodedData.card];
                } else {
                    // Fallback for old format or direct card data
                    appState.cards = [decodedData];
                }
                appState.currentCardIndex = 0;

                if (decodedData.settings) {
                    appState.printerType = decodedData.settings.printerType || appState.printerType;
                    appState.thermalPaperWidth = decodedData.settings.thermalPaperWidth || appState.thermalPaperWidth;
                    appState.standardSize = decodedData.settings.standardSize || appState.standardSize;
                    appState.thermalDpi = decodedData.settings.thermalDpi || appState.thermalDpi;
                    appState.numCopies = decodedData.settings.numCopies || appState.numCopies;
                }

                showMessage('Card loaded from URL bookmark!');
            } else {
                const savedState = localStorage.getItem('ttrpgCardPrinterState');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    if (parsedState.cards && Array.isArray(parsedState.cards) && parsedState.cards.length > 0) {
                        appState.cards = parsedState.cards;
                        appState.currentCardIndex = parsedState.currentCardIndex || 0;
                        if (appState.currentCardIndex >= appState.cards.length) {
                            appState.currentCardIndex = 0; // Reset if index is out of bounds
                        }
                    }
                    if (parsedState.printerType) appState.printerType = parsedState.printerType;
                    if (parsedState.thermalPaperWidth) appState.thermalPaperWidth = parsedState.thermalPaperWidth;
                    if (parsedState.standardSize) appState.standardSize = parsedState.standardSize;
                    if (parsedState.customWidth) appState.customWidth = parsedState.customWidth;
                    if (parsedState.customLength) appState.customLength = parsedState.customLength;
                    if (parsedState.thermalDpi) appState.thermalDpi = parsedState.thermalDpi;
                    if (parsedState.numCopies) {
                        let loadedNumCopies = parseInt(parsedState.numCopies, 10);
                        if (!isNaN(loadedNumCopies) && loadedNumCopies >= 1 && loadedNumCopies <= 10) {
                            appState.numCopies = loadedNumCopies;
                        } else {
                            appState.numCopies = 1;
                        }
                    }
                    if (parsedState.printScope) appState.printScope = parsedState.printScope;
                    if (typeof parsedState.includeCornerDots === 'boolean') {
                        appState.includeCornerDots = parsedState.includeCornerDots;
                    }
                    if (parsedState.rememberedIcons) appState.rememberedIcons = parsedState.rememberedIcons;

                }
            }
        } catch (error) {
            console.error("Error loading state from localStorage or URL:", error);
            // Reset to initial state on error
            appState = {
                cards: [{
                    id: '', title: 'New Card', type: 'Spell', icon: '', color: '#ffffff', tags: [],
                    sections: [{ heading: 'Description', body: 'This is a magical card.', flavorText: '' }],
                    cost: '', rarity: '', abilities: [], image: '', stats: {}, footer: 'TCG.BagsOfFolding.com',
                    isFolded: false, foldContent: { type: 'text', text: 'Folded content goes here.', imageUrl: '', qrCodeData: '' }
                }],
                currentCardIndex: 0,
                printerType: 'thermal',
                thermalPaperSize: '58mm',
                numCopies: 1,
                printScope: 'current'
            };
            showMessage('Failed to load card data. Starting with a new card.', true);
        }
        updateUIFromAppState();
        populateIconSuggestions();
    }

    // JSON Import Handlers
    rpgCardsJsonFile.addEventListener('change', (e) => handleJsonImport(e, 'rpg-cards'));
    eToolsJsonPaste.addEventListener('input', (e) => handleJsonPaste(e, '5e-tools'));
    genericJsonPaste.addEventListener('input', (e) => handleJsonPaste(e, 'generic'));

    function handleJsonImport(e, type) {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    // If it's an array of cards, use all of them. Otherwise, wrap single object in array.
                    const dataToParse = Array.isArray(importedData) ? importedData : [importedData];
                    parseAndSetCardData(dataToParse, type);
                    showMessage('JSON imported successfully!');
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    showMessage('Failed to parse JSON. Please check the format.', true);
                }
            };
            reader.readAsText(file);
        }
    }

    function handleJsonPaste(e, type) {
        try {
            const pastedData = JSON.parse(e.target.value);
            // If it's an array of cards, use all of them. Otherwise, wrap single object in array.
            const dataToParse = Array.isArray(pastedData) ? pastedData : [pastedData];
            parseAndSetCardData(dataToParse, type);
            showMessage('JSON pasted successfully!');
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showMessage('Failed to parse JSON. Please check the format.', true);
        }
    }

    function processTextGroup(textGroup) {
        const isTable = textGroup.length > 1 && textGroup.every(line => line.includes('｜'));
        if (isTable) {
            let tableHtml = '<table class="w-full text-left border-collapse">';
            textGroup.forEach((line, index) => {
                const cells = line.split('｜').map(cell => cell.trim());
                if (index === 0) {
                    tableHtml += '<thead><tr>';
                    cells.forEach(cell => {
                        tableHtml += `<th class="p-1 border-b-2 border-gray-400">${sanitizeHTML(cell)}</th>`;
                    });
                    tableHtml += '</tr></thead>';
                    tableHtml += '<tbody>';
                } else {
                    tableHtml += '<tr>';
                    cells.forEach(cell => {
                        tableHtml += `<td class="p-1 border-b border-gray-500">${sanitizeHTML(cell)}</td>`;
                    });
                    tableHtml += '</tr>';
                }
            });
            tableHtml += '</tbody></table>';
            return tableHtml;
        } else {
            return sanitizeHTML(textGroup.join('\n'));
        }
    }

    function parseAndSetCardData(dataArray, type) {
        appState.cards = []; // Clear existing cards
        dataArray.forEach(data => {
            let newCard = {
                id: crypto.randomUUID(),
                title: 'New Card',
                type: 'Spell',
                icon: '',
                color: '#ffffff',
                tags: [],
                sections: [{ heading: 'Description', body: '', flavorText: '' }],
                cost: '', rarity: '', abilities: [], image: '', stats: {}, footer: 'TCG.BagsOfFolding.com',
                isFolded: false, foldContent: { type: 'text', text: '', imageUrl: '', qrCodeData: '' }
            };

            if (type === 'rpg-cards') {
                newCard.title = htmlToMarkdown(data.title || newCard.title);
                newCard.color = data.color || newCard.color;
                newCard.icon = data.icon || '';
                newCard.tags = (data.tags && Array.isArray(data.tags)) ? data.tags : [];

                newCard.sections = [];
                newCard.stats = {};
                newCard.type = '';

                if (data.contents && Array.isArray(data.contents)) {
                    let inP2eTraitSection = false;
                    let currentTraitSection = null;
                    let currentSection = { type: 'content', heading: '', body: '', flavorText: '' };

                    function pushCurrentSection() {
                        if (currentSection.body || currentSection.heading || currentSection.flavorText) {
                            newCard.sections.push({ ...currentSection });
                        }
                        currentSection = { type: 'content', heading: '', body: '', flavorText: '' };
                    }

                    for (let i = 0; i < data.contents.length; i++) {
                        const line = data.contents[i];

                        if (line.startsWith('subtitle | ')) {
                            pushCurrentSection();
                            const parts = line.substring('subtitle | '.length).split(' | ');
                            newCard.type = {
                                text: parts[0] ? htmlToMarkdown(parts[0].trim()) : '',
                                aside: parts[1] ? htmlToMarkdown(parts[1].trim()) : ''
                            };
                        } else if (line.startsWith('rule')) {
                            pushCurrentSection();
                            newCard.sections.push({ type: 'rule' });
                        } else if (line.startsWith('fill | ')) {
                            pushCurrentSection();
                            const parts = line.substring('fill | '.length).split(' | ');
                            newCard.sections.push({ type: 'fill', weight: parseInt(parts[0], 10) || 1 });
                        } else if (line.startsWith('text | ')) {
                            const textGroup = [line.substring('text | '.length).trim()];
                            while (i + 1 < data.contents.length && data.contents[i + 1].startsWith('text | ')) {
                                i++;
                                textGroup.push(data.contents[i].substring('text | '.length).trim());
                            }

                            const convertedTextGroup = textGroup.map(line => htmlToMarkdown(line));
                            const processedText = processTextGroup(convertedTextGroup);

                            if (currentSection.body) {
                                currentSection.body += '\n' + processedText;
                            } else {
                                currentSection.body = processedText;
                            }
                        } else if (line.startsWith('property | ')) {
                            pushCurrentSection();
                            const parts = line.substring('property | '.length).split(' | ');
                            if (parts.length >= 2) {
                                newCard.sections.push({ type: 'property', key: parts[0].trim(), value: htmlToMarkdown(parts[1].trim()) });
                            }
                        } else if (line.startsWith('dndstats | ')) {
                            pushCurrentSection();
                            const statKeys = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
                            const stats = line.substring('dndstats | '.length).split(' | ').map(s => s.trim());
                            if (stats.length === statKeys.length) {
                                const statValues = {};
                                statKeys.forEach((key, index) => {
                                    statValues[key] = stats[index];
                                });
                                newCard.sections.push({ type: 'dndstats', stats: statValues });
                            }
                        } else if (line.startsWith('description | ')) {
                            pushCurrentSection();
                            const parts = line.substring('description | '.length).split(' | ').map(p => p.trim());
                            currentSection = {
                                type: 'content',
                                heading: parts.length >= 2 ? htmlToMarkdown(parts[0]) : '',
                                body: parts.length >= 2 ? htmlToMarkdown(parts[1]) : htmlToMarkdown(parts[0]),
                                flavorText: ''
                            };
                        } else if (line.startsWith('bullet | ')) {
                            const bulletText = '• ' + htmlToMarkdown(line.substring('bullet | '.length).trim());
                            if (currentSection.body) {
                                currentSection.body += '\n' + bulletText;
                            } else {
                                currentSection.body = bulletText;
                            }
                        } else if (line.startsWith('picture | ')) {
                            pushCurrentSection();
                            const parts = line.substring('picture | '.length).split(' | ');
                            newCard.sections.push({
                                type: 'picture',
                                url: parts[0] ? parts[0].trim() : '',
                                height: parts[1] ? parseInt(parts[1].trim(), 10) : 50
                            });
                        } else if (line.startsWith('ruler')) {
                            pushCurrentSection();
                            newCard.sections.push({ type: 'ruler' });
                        } else if (line.startsWith('swstats | ')) {
                            pushCurrentSection();
                            const p = line.substring('swstats | '.length).split(' | ').map(s => s.trim());
                            newCard.sections.push({
                                type: 'swstats',
                                stats: {
                                    agility: p[0] || '', smarts: p[1] || '', spirit: p[2] || '', strength: p[3] || '', vigor: p[4] || '',
                                    pace: p[5] || '', parry: p[6] || '', toughness: p[7] || '', loot: p[8] || ''
                                }
                            });
                        } else if (line.startsWith('p2e_stats | ')) {
                            pushCurrentSection();
                            const p = line.substring('p2e_stats | '.length).split(' | ').map(s => s.trim());
                            newCard.sections.push({
                                type: 'p2e_stats',
                                stats: {
                                    str: p[0] || '', dex: p[1] || '', con: p[2] || '', int: p[3] || '', wis: p[4] || '', cha: p[5] || '',
                                    ac: p[6] || '', fort: p[7] || '', ref: p[8] || '', will: p[9] || '', hp: p[10] || ''
                                }
                            });
                        } else if (line.startsWith('p2e_activity | ')) {
                            pushCurrentSection();
                            const p = line.substring('p2e_activity | '.length).split(' | ').map(s => s.trim());
                            newCard.sections.push({
                                type: 'p2e_activity',
                                name: htmlToMarkdown(p[0] || ''),
                                actions: p[1] || '',
                                description: htmlToMarkdown(p[2] || '')
                            });
                        } else if (line.startsWith('p2e_start_trait_section')) {
                            pushCurrentSection();
                            inP2eTraitSection = true;
                            currentTraitSection = { type: 'p2e_traits', traits: [] };
                        } else if (line.startsWith('p2e_end_trait_section')) {
                            if (currentTraitSection && currentTraitSection.traits.length > 0) {
                                newCard.sections.push(currentTraitSection);
                            }
                            inP2eTraitSection = false;
                            currentTraitSection = null;
                        } else if (line.startsWith('p2e_trait | ')) {
                            if (inP2eTraitSection) {
                                const parts = line.substring('p2e_trait | '.length).split(' | ');
                                currentTraitSection.traits.push({
                                    rarity: parts[0] ? parts[0].trim().toLowerCase() : 'common',
                                    text: parts[1] ? htmlToMarkdown(parts[1].trim()) : ''
                                });
                            }
                        } else if (line.startsWith('section | ')) {
                            pushCurrentSection();
                            const parts = line.substring('section | '.length).split(' | ');
                            currentSection.heading = parts[0] ? htmlToMarkdown(parts[0].trim()) : '';
                            currentSection.headingAside = parts[1] ? htmlToMarkdown(parts[1].trim()) : '';
                        } else if (line.startsWith('boxes | ')) {
                            pushCurrentSection();
                            const parts = line.substring('boxes | '.length).split(' | ');
                            newCard.sections.push({
                                type: 'boxes',
                                count: parts[0] ? parseInt(parts[0].trim(), 10) : 1,
                                size: parts[1] ? parseFloat(parts[1].trim()) : 1.0,
                                text: parts[2] ? htmlToMarkdown(parts[2].trim()) : ''
                            });
                        }
                    }
                    pushCurrentSection();
                }

                if (newCard.sections.length === 0) {
                    newCard.sections.push({ heading: 'Description', body: '', flavorText: '' });
                }

                newCard.footer = htmlToMarkdown(data.footer || newCard.footer);

                newCard.isFolded = typeof data.isFolded === 'boolean' ? data.isFolded : false;
                newCard.foldContent = (data.foldContent && typeof data.foldContent === 'object') ? data.foldContent : { type: 'text', text: '', imageUrl: '', qrCodeData: '' };

                if (data.background_image) {
                    newCard.isFolded = true;
                    newCard.foldContent = { type: 'backgroundImageUrl', imageUrl: data.background_image };
                } else if (data.icon_back) {
                    newCard.isFolded = true;
                    newCard.foldContent.type = 'imageUrl';
                    newCard.foldContent.imageUrl = data.icon_back;
                }

                newCard.numCopies = data.count ? parseInt(data.count, 10) : 1;
                if (isNaN(newCard.numCopies) || newCard.numCopies < 1 || newCard.numCopies > 10) {
                    newCard.numCopies = 1;
                }

            } else if (type === '5e-tools') {
                newCard.title = htmlToMarkdown(data.name || newCard.title);
                newCard.type = htmlToMarkdown(data.type || newCard.type);
                newCard.rarity = htmlToMarkdown(data.rarity || newCard.rarity);
                newCard.cost = htmlToMarkdown(data.cost || newCard.cost);

                const newStats = {};
                if (data.hp) newStats.HP = data.hp.average || data.hp;
                if (data.str) newStats.STR = data.str;
                if (data.dex) newStats.DEX = data.dex;
                if (data.con) newStats.CON = data.con;
                if (data.int) newStats.INT = data.int;
                if (data.wis) newStats.WIS = data.wis;
                if (data.cha) newStats.CHA = data.cha;
                if (data.cr) newStats.CR = data.cr;
                newCard.stats = newStats;

                const newSections = [];
                if (data.trait) {
                    data.trait.forEach(t => {
                        newSections.push({ heading: htmlToMarkdown(t.name), body: htmlToMarkdown(t.entries.join('\n')), flavorText: '' });
                    });
                }
                if (data.action) {
                    data.action.forEach(a => {
                        newSections.push({ heading: htmlToMarkdown(a.name), body: htmlToMarkdown(a.entries.join('\n')), flavorText: '' });
                    });
                }
                if (data.description) {
                    newSections.push({ heading: 'Description', body: htmlToMarkdown(data.description.entries.join('\n')), flavorText: '' });
                }
                newCard.sections = newSections;
                newCard.numCopies = 1;
            } else { // Generic JSON
                Object.assign(newCard, data); // Merge data into newCard

                // Apply markdown conversion to known text fields
                newCard.title = htmlToMarkdown(newCard.title);
                if (typeof newCard.type === 'string') {
                     newCard.type = htmlToMarkdown(newCard.type);
                } else if (typeof newCard.type === 'object' && newCard.type !== null) {
                    newCard.type.text = htmlToMarkdown(newCard.type.text);
                    newCard.type.aside = htmlToMarkdown(newCard.type.aside);
                }
                newCard.footer = htmlToMarkdown(newCard.footer);

                newCard.tags = (newCard.tags && Array.isArray(newCard.tags)) ? newCard.tags : [];
                newCard.sections = (newCard.sections && Array.isArray(newCard.sections)) ? newCard.sections.map(section => ({
                    ...section,
                    heading: htmlToMarkdown(section.heading),
                    headingAside: htmlToMarkdown(section.headingAside),
                    body: htmlToMarkdown(section.body),
                    flavorText: htmlToMarkdown(section.flavorText)
                })) : [];

                newCard.stats = (newCard.stats && typeof newCard.stats === 'object') ? newCard.stats : {};
                newCard.isFolded = typeof newCard.isFolded === 'boolean' ? newCard.isFolded : false;

                newCard.foldContent = (newCard.foldContent && typeof newCard.foldContent === 'object') ? newCard.foldContent : { type: 'text', text: '', imageUrl: '', qrCodeData: '' };
                if (newCard.foldContent.type === 'text') {
                    newCard.foldContent.text = htmlToMarkdown(newCard.foldContent.text);
                }

                newCard.numCopies = data.numCopies ? parseInt(data.numCopies, 10) : 1;
                if (isNaN(newCard.numCopies) || newCard.numCopies < 1 || newCard.numCopies > 10) {
                    newCard.numCopies = 1;
                }
            }
            appState.cards.push(newCard);
        });

        appState.currentCardIndex = 0; // Always show the first card after import
        updateUIFromAppState();
        saveState();
    }

    function populateIconSuggestions() {
        const suggestionsDatalist = document.getElementById('icon-suggestions');
        const defaultIcons = ['imp-laugh', 'crossed-swords', 'magic-swirl', 'family-tree', 'farmer', 'checkbox-tree'];
        const allSuggestions = [...new Set([...defaultIcons, ...appState.rememberedIcons])];

        suggestionsDatalist.innerHTML = allSuggestions.map(icon => `<option value="${icon}"></option>`).join('');
    }

    function rememberIcon(iconName) {
        if (iconName && !isURL(iconName) && !appState.rememberedIcons.includes(iconName)) {
            appState.rememberedIcons.push(iconName);
            populateIconSuggestions();
            saveState();
        }
    }

    // Event Listeners for main card inputs
    titleInput.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].title = e.target.value; saveState(); updateCardPreview(); updateCardNavigationUI(); });
    typeInput.addEventListener('input', (e) => {
        const currentCard = appState.cards[appState.currentCardIndex];
        if (typeof currentCard.type === 'object' && currentCard.type !== null) {
            currentCard.type.text = e.target.value;
        } else {
            currentCard.type = e.target.value;
        }
        saveState();
        updateCardPreview();
    });
    iconInput.addEventListener('input', (e) => {
        appState.cards[appState.currentCardIndex].icon = e.target.value;
        rememberIcon(e.target.value);
        saveState();
        updateCardPreview();
    });
    colorInput.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].color = e.target.value; saveState(); updateCardPreview(); });
    tagsInput.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].tags = e.target.value.split(',').map(tag => tag.trim()); saveState(); updateCardPreview(); });
    footerInput.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].footer = e.target.value; saveState(); updateCardPreview(); });
    numCopiesInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 10) val = 10;
        appState.numCopies = val; // This is a global setting, not per card for now
        e.target.value = val;
        saveState();
    });

    includeCornerDotsCheckbox.addEventListener('change', (e) => {
        appState.includeCornerDots = e.target.checked;
        saveState();
    });

    // Add Section button
    addSectionBtn.addEventListener('click', () => {
        appState.cards[appState.currentCardIndex].sections.push({ heading: '', body: '', flavorText: '' });
        renderSections();
        saveState();
    });

    // Add Stat button
    addStatBtn.addEventListener('click', () => {
        const statKey = prompt("Enter stat name (e.g., HP, STR):");
        if (statKey) {
            appState.cards[appState.currentCardIndex].stats[statKey] = '';
            renderStats();
            saveState();
        }
    });

    // Folded card checkbox
    isFoldedCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        appState.cards[appState.currentCardIndex].isFolded = isChecked;

        if (isChecked) {
            // Uncheck scrolling if folded is checked
            appState.isScrolling = false;
            isScrollingCheckbox.checked = false;
        }

        toggleFoldContentOptions();
        updateCardPreview();
        saveState();
    });

    // Scrolling card checkbox
    isScrollingCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        appState.isScrolling = isChecked;

        if (isChecked) {
            // Uncheck folded if scrolling is checked
            appState.cards[appState.currentCardIndex].isFolded = false;
            isFoldedCheckbox.checked = false;
            toggleFoldContentOptions();
        }
        updateCardPreview();
        saveState();
    });

    thermalPaperWidthSelect.addEventListener('change', (e) => {
        appState.thermalPaperWidth = e.target.value;
        updateStandardSizes();
        saveState();
    });

    standardSizeSelect.addEventListener('change', (e) => {
        appState.standardSize = e.target.value;
        updateCardPreview();
        saveState();
    });

    customWidthInput.addEventListener('input', (e) => {
        appState.customWidth = parseFloat(e.target.value) || 0;
        updateCardPreview();
        saveState();
    });

    customLengthInput.addEventListener('input', (e) => {
        appState.customLength = parseFloat(e.target.value) || 0;
        updateCardPreview();
        saveState();
    });

    thermalDpiSelect.addEventListener('change', (e) => {
        appState.thermalDpi = parseInt(e.target.value, 10);
        updateCardPreview();
        saveState();
    });

    // Handle fold content type change
    foldContentTypeSelect.addEventListener('change', (e) => {
        appState.cards[appState.currentCardIndex].foldContent.type = e.target.value;
        updateFoldContentInputs();
        updateCardPreview();
        saveState();
    });

    // Fold content inputs
    foldContentTextarea.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].foldContent.text = e.target.value; updateCardPreview(); saveState(); });
    foldContentImageUrlInput.addEventListener('input', (e) => {
        appState.cards[appState.currentCardIndex].foldContent.imageUrl = e.target.value;
        rememberIcon(e.target.value);
        updateCardPreview();
        saveState();
    });
    foldContentQrDataInput.addEventListener('input', (e) => { appState.cards[appState.currentCardIndex].foldContent.qrCodeData = e.target.value; updateCardPreview(); saveState(); });

    // Printer type selection
    printerTypeSelect.addEventListener('change', (e) => {
        appState.printerType = e.target.value;
        togglePrinterTypeOptions();
        updateCardPreview();
        saveState();
    });

    // Print Scope Radio Buttons
    printScopeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.printScope = e.target.value;
            saveState();
        });
    });

    outputFormatSelect.addEventListener('change', (e) => {
        appState.outputFormat = e.target.value;
        toggleOutputActions();
        saveState();
    });

    // Card Navigation Event Listeners
    prevCardBtn.addEventListener('click', () => {
        if (appState.currentCardIndex > 0) {
            appState.currentCardIndex--;
            updateUIFromAppState();
            saveState();
        }
    });

    nextCardBtn.addEventListener('click', () => {
        if (appState.currentCardIndex < appState.cards.length - 1) {
            appState.currentCardIndex++;
            updateUIFromAppState();
            saveState();
        }
    });

    cardSelect.addEventListener('change', (e) => {
        appState.currentCardIndex = parseInt(e.target.value, 10);
        updateUIFromAppState();
        saveState();
    });

    addNewCardBtn.addEventListener('click', () => {
        const newCard = {
            id: crypto.randomUUID(),
            title: 'New Card',
            type: 'Spell',
            icon: '',
            color: '#ffffff',
            tags: [],
            sections: [{ heading: 'Description', body: 'This is a magical card.', flavorText: '' }],
            cost: '', rarity: '', abilities: [], image: '', stats: {}, footer: 'TCG.BagsOfFolding.com',
            isFolded: false, foldContent: { type: 'text', text: 'Folded content goes here.', imageUrl: '', qrCodeData: '' }
        };
        appState.cards.push(newCard);
        appState.currentCardIndex = appState.cards.length - 1; // Go to the new card
        updateUIFromAppState();
        saveState();
        showMessage('New empty card added!');
    });

    // Import Modal Listeners
    openImportModalBtn.addEventListener('click', () => {
        importModal.classList.remove('hidden');
        closeImportModalBtn.focus(); // Move focus to a logical element inside the modal
    });

    const closeModal = () => {
        importModal.classList.add('hidden');
        openImportModalBtn.focus(); // Return focus to the button that opened the modal
    };

    closeImportModalBtn.addEventListener('click', closeModal);

    // Close modal if clicking on the background
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
            closeModal();
        }
    });

    // Add listener for the Escape key to close the modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !importModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Accordion Logic
    function setupAccordion(button, content) {
        button.addEventListener('click', () => {
            const isHidden = content.classList.toggle('hidden');
            const icon = button.querySelector('i');
            icon.classList.toggle('rotate-180', !isHidden);
            button.setAttribute('aria-expanded', !isHidden);
        });
    }

    setupAccordion(accordionFileImportHeading, accordionFileImportContent);
    setupAccordion(accordion5eToolsHeading, accordion5eToolsContent);
    setupAccordion(accordionGenericJsonHeading, accordionGenericJsonContent);


    // --- Start of Shared Card Rendering Configuration ---

    // Define all layout dimensions in inches. This is the single source of truth.
    const CARD_HEIGHT_RATIO = 1.4; // Ratio of height to width
    const PADDING_IN = 0.08; // General padding around the card content
    const ICON_SIZE_IN = 0.25;
    const ICON_OFFSET_IN = 0.125; // From top and right edges

    // Font sizes in points (1pt = 1/72in) are a standard way to define font size.
    const FONT_SIZE_TITLE_PT = 18;
    const FONT_SIZE_TYPE_PT = 12;
    const FONT_SIZE_STATS_PT = 10;
    const FONT_SIZE_SECTION_HEAD_PT = 14;
    const FONT_SIZE_BODY_PT = 10;
    const FONT_SIZE_FLAVOR_PT = 9;
    const FONT_SIZE_TAGS_FOOTER_PT = 8;
    const FONT_SIZE_FOLD_TEXT_PT = 10;
    const FONT_SIZE_DND_STATS_KEY_PT = 9;
    const FONT_SIZE_DND_STATS_VALUE_PT = 8;

    // Spacing
    const TITLE_MARGIN_BOTTOM_IN = 0.04;
    const TYPE_MARGIN_BOTTOM_IN = 0.08;
    const STATS_MARGIN_BOTTOM_IN = 0.08;
    const STAT_SPACING_IN = 0.08;
    const SECTION_HEAD_MARGIN_BOTTOM_IN = 0.04;
    const SECTION_HEAD_PADDING_BOTTOM_IN = 0.02;
    const SECTION_BODY_MARGIN_BOTTOM_IN = 0.04;
    const FLAVOR_MARGIN_TOP_IN = 0.04;
    const TAGS_MARGIN_TOP_IN = 0.08;
    const TAGS_PADDING_TOP_IN = 0.04;
    const FOOTER_MARGIN_TOP_IN = 0.08;

    // QR Code
    const QR_CODE_SIZE_IN = 0.8;
    const QR_CODE_MAX_SIZE_IN = 0.6;

    // Helper to convert inches to pixels based on a given DPI
    const toPx = (inches, dpi) => Math.round(inches * dpi);
    // Helper to convert points to pixels based on a given DPI
    const ptToPx = (points, dpi) => Math.round((points / 72) * dpi);

    function renderPdfStatBlock(stats, columns, dpi) {
        const statItems = Object.entries(stats)
            .map(([key, value]) => {
                if (!value) return null;
                return `<div style="display: flex; flex-direction: column; align-items: center; padding: 2px; background-color: #f3f4f6; border-radius: 4px;">
                                <strong style="font-size: ${ptToPx(8, dpi)}px; text-transform: uppercase; font-weight: bold;">${sanitizeHTML(key)}</strong>
                                <span style="font-size: ${ptToPx(10, dpi)}px;">${sanitizeHTML(value)}</span>
                            </div>`
            })
            .filter(Boolean)
            .join('');
        return `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2px; margin: ${toPx(0.08, dpi)}px 0; text-align: center;">${statItems}</div>`;
    }

    // --- Start of Refactored Dimension Calculation ---

    const FALLBACK_WIDTH_MAP_INCHES = { '58mm': 1.89, '80mm': 2.83, '2in': 1.89, '3in': 2.83, '4in': 4.09 };

    function getCardDimensionsInInches() {
        const thermalPaperWidth = appState.thermalPaperWidth;
        let cardWidth, cardHeight;

        if (thermalPaperWidth === 'custom') {
            cardWidth = appState.customWidth;
            cardHeight = appState.customLength;
        } else {
            const standardSize = STANDARD_SIZES[thermalPaperWidth]?.find(s => s.value === appState.standardSize);
            if (standardSize) {
                cardWidth = standardSize.width;
                cardHeight = standardSize.length;
            } else {
                // Fallback for default when appState is inconsistent.
                cardWidth = FALLBACK_WIDTH_MAP_INCHES[thermalPaperWidth] || FALLBACK_WIDTH_MAP_INCHES['2in'];
                cardHeight = null; // Ensure it's calculated below
            }
        }

        // If cardHeight is not set (e.g., for continuous roll or fallback), calculate it based on aspect ratio.
        if (cardHeight == null) {
            cardHeight = cardWidth * CARD_HEIGHT_RATIO;
        }

        return { cardWidth, cardHeight };
    }

    // --- End of Refactored Dimension Calculation ---

    // --- End of Shared Card Rendering Configuration ---


    function getPixelWidth(paperWidth, dpi) {
        if (appState.thermalPaperWidth === 'custom') {
            return Math.round(appState.customWidth * dpi);
        }

        const standardSize = STANDARD_SIZES[paperWidth]?.find(s => s.value === appState.standardSize);
        if (standardSize && standardSize.width) {
             return Math.round(standardSize.width * dpi);
        }

        // Fallback for continuous roll or default
        const printableWidthMm = {
            '58mm': 48,
            '80mm': 72,
            '2in': 48, // approx
            '3in': 72, // approx
            '4in': 104 // approx
        };
        const printableWidthIn = (printableWidthMm[paperWidth] || 48) / 25.4;
        return Math.round(printableWidthIn * dpi);
    }

    async function generateCardHtml(card, options = { isScrolling: false }) {
        const { isScrolling } = options;
        const dpi = appState.thermalDpi;
        const widthPx = getPixelWidth(appState.thermalPaperWidth, dpi);

        let iconRenderHtml = '';
        if (card.icon && (!card.isContinuation || isScrolling)) {
            const iconUrl = iconManifest[card.icon] || (isURL(card.icon) ? card.icon : `https://placehold.co/60x60/000/FFF?text=${encodeURIComponent(card.icon.toUpperCase())}`);

            iconRenderHtml = `<img src="${sanitizeHTML(iconUrl)}" style="position: absolute; top: ${ICON_OFFSET_IN}in; right: ${ICON_OFFSET_IN}in; width: ${ICON_SIZE_IN}in; height: ${ICON_SIZE_IN}in; object-fit: contain; filter: grayscale(100%);" onerror="this.src='https://placehold.co/60x60/000/FFF?text=ICON';" />`;
        }

        const containerHeight = isScrolling ? 'auto' : `${toPx(widthPx / dpi * CARD_HEIGHT_RATIO, dpi)}px`;
        const containerStyle = isScrolling
            ? `position: relative; width: ${widthPx}px; font-family: 'Inter', sans-serif; padding: ${toPx(PADDING_IN, dpi)}px; box-sizing: border-box; color: #000; background-color: #fff; display: flex; flex-direction: column; border-bottom: 1px dashed #ccc; margin-bottom: 10px;`
            : `position: relative; width: ${widthPx}px; height: ${containerHeight}; font-family: 'Inter', sans-serif; padding: ${toPx(PADDING_IN, dpi)}px; box-sizing: border-box; color: #000; background-color: #fff; display: flex; flex-direction: column;`;

        const contentAreaStyle = isScrolling ? "overflow: visible;" : "flex-grow: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-start;";

        let htmlContent = `
                <div style="${containerStyle}">
                    ${iconRenderHtml}
                    <div>
                        ${card.title ? `<h1 style="text-align: center; font-size: ${ptToPx(FONT_SIZE_TITLE_PT, dpi)}px; margin-bottom: ${toPx(TITLE_MARGIN_BOTTOM_IN, dpi)}px; line-height: 1.2;">${sanitizeHTML(card.title || '')}</h1>` : ''}
                        ${(!card.isContinuation || isScrolling) && card.type ? `<p style="text-align: center; font-size: ${ptToPx(FONT_SIZE_TYPE_PT, dpi)}px; margin-bottom: ${toPx(TYPE_MARGIN_BOTTOM_IN, dpi)}px;">${sanitizeHTML(card.type)}</p>` : ''}
                    </div>

                    ${(!card.isContinuation || isScrolling) && (card.stats && Object.keys(card.stats).length > 0) ? `
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: ${toPx(STATS_MARGIN_BOTTOM_IN, dpi)}px; font-size: ${ptToPx(FONT_SIZE_STATS_PT, dpi)}px;">
                            ${Object.entries(card.stats).map(([key, value]) => `
                                <span style="margin: 0 ${toPx(STAT_SPACING_IN / 2, dpi)}px; white-space: nowrap;"><strong>${sanitizeHTML(key || '')}:</strong> ${sanitizeHTML(value || '')}</span>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="card-content-area" style="${contentAreaStyle}">
                        ${(card.sections && Array.isArray(card.sections)) ? card.sections.map(section => {
            switch (section.type) {
                case 'rule':
                    return `<div style="width: 100%; height: 1px; background-color: #999; margin: ${toPx(0.05, dpi)}px 0;"></div>`;
                case 'fill':
                    return `<div style="flex-grow: ${section.weight || 1};"></div>`;
                case 'property':
                    return `<div style="font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px;"><strong>${sanitizeHTML(section.key)}:</strong> ${sanitizeHTML(section.value)}</div>`;
                case 'dndstats':
                    const statsHtml = Object.entries(section.stats)
                        .map(([k, v]) => `<div style="display: flex; flex-direction: column; align-items: center; margin: 0 ${toPx(0.02, dpi)}px;">
                                                            <strong style="font-size: ${ptToPx(FONT_SIZE_DND_STATS_KEY_PT, dpi)}px; font-weight: bold;">${sanitizeHTML(k)}</strong>
                                                            <span style="font-size: ${ptToPx(FONT_SIZE_DND_STATS_VALUE_PT, dpi)}px;">${sanitizeHTML(v)}</span>
                                                         </div>`)
                        .join('');
                    return `<div style="display: flex; justify-content: center; margin: ${toPx(0.04, dpi)}px 0; padding: ${toPx(0.04, dpi)}px; background-color: #f3f4f6; border-radius: 4px;">${statsHtml}</div>`;
                case 'picture':
                    return `<div style="margin: ${toPx(0.08, dpi)}px 0; text-align: center;"><img src="${sanitizeHTML(section.url)}" style="height: ${section.height}px; border-radius: 4px;" alt="Card Picture"></div>`;
                case 'boxes':
                    let boxesHtml = '';
                    const boxSizePt = (section.size || 1.0) * 10; // 1em ~ 10pt for PDF context
                    const boxSizePx = ptToPx(boxSizePt, dpi);
                    const boxCount = section.count || 1;
                    for (let i = 0; i < boxCount; i++) {
                        boxesHtml += `<div style="display: inline-block; width: ${boxSizePx}px; height: ${boxSizePx}px; border: 1px solid #000; margin: 0 2px; background-color: #fff;"></div>`;
                    }
                    const textHtml = section.text ? `<p style="font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px; margin-bottom: 2px;">${sanitizeHTML(section.text)}</p>` : '';
                    return `<div style="text-align: center; margin: 4px 0;">${textHtml}<div>${boxesHtml}</div></div>`;
                case 'ruler':
                    return `<div style="width: 100%; height: 0.5px; background-color: #333; margin: ${toPx(0.05, dpi)}px 0;"></div>`;
                case 'swstats':
                    return renderPdfStatBlock(section.stats, 5, dpi);
                case 'p2e_stats':
                    return renderPdfStatBlock(section.stats, 6, dpi);
                case 'p2e_activity':
                    const actionText = { '0': 'F', '1': '1A', '2': '2A', '3': '3A', 'R': 'R' }[section.actions] || section.actions;
                    return `<div style="margin: ${toPx(0.04, dpi)}px 0;">
                                                <div style="display: flex; align-items: center; gap: 4px;">
                                                    <div style="display: flex; align-items: center; justify-content: center; width: ${ptToPx(16, dpi)}px; height: ${ptToPx(12, dpi)}px; border-radius: 4px; background-color: #333; color: #fff; font-size: ${ptToPx(8, dpi)}px; font-weight: bold;">${actionText}</div>
                                                    <strong style="font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px; font-weight: bold;">${sanitizeHTML(section.name)}</strong>
                                                </div>
                                                <p style="font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px; margin-left: ${ptToPx(20, dpi)}px;">${formatText(section.description)}</p>
                                            </div>`;
                case 'p2e_traits':
                    const traitsHtml = section.traits.map(trait => {
                        return `<span style="font-size: ${ptToPx(8, dpi)}px; color: #fff; background-color: #555; border-radius: 9999px; padding: 2px 8px; text-transform: uppercase;">${sanitizeHTML(trait.text)}</span>`;
                    }).join('');
                    return `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: ${toPx(0.08, dpi)}px 0;">${traitsHtml}</div>`;
                case 'content':
                default:
                    const headingStyle = `font-size: ${ptToPx(FONT_SIZE_SECTION_HEAD_PT, dpi)}px; margin-bottom: ${toPx(SECTION_HEAD_MARGIN_BOTTOM_IN, dpi)}px; border-bottom: 1px dashed #999; padding-bottom: ${toPx(SECTION_HEAD_PADDING_BOTTOM_IN, dpi)}px;`;
                    const headingAsideStyle = `font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px; font-weight: 300;`;
                    const headingHtml = section.heading ? `
                                        <div style="display: flex; justify-content: space-between; align-items: baseline; ${headingStyle}">
                                            <h2 style="margin:0; padding:0;">${sanitizeHTML(section.heading)}</h2>
                                            ${section.headingAside ? `<span style="${headingAsideStyle}">${sanitizeHTML(section.headingAside)}</span>` : ''}
                                        </div>
                                    ` : '';

                    return `
                                        <div style="margin-bottom: ${toPx(0.08, dpi)}px;">
                                            ${headingHtml}
                                            <p style="font-size: ${ptToPx(FONT_SIZE_BODY_PT, dpi)}px; margin-top: ${toPx(0.04, dpi)}px; margin-bottom: 0; line-height: 1.4;">${formatText(section.body || '')}</p>
                                            ${section.flavorText ? `<p style="font-size: ${ptToPx(FONT_SIZE_FLAVOR_PT, dpi)}px; font-style: italic; color: #555; margin-top: ${toPx(FLAVOR_MARGIN_TOP_IN, dpi)}px;">${formatText(section.flavorText || '')}</p>` : ''}
                                        </div>
                                    `;
            }
        }).join('') : ''}
                    </div>

                    <div>
                        ${(!card.isContinuation || isScrolling) && (card.tags && Array.isArray(card.tags) && card.tags.length > 0) ? `
                            <p style="font-size: ${ptToPx(FONT_SIZE_TAGS_FOOTER_PT, dpi)}px; text-align: center; margin-top: ${toPx(TAGS_MARGIN_TOP_IN, dpi)}px; border-top: 1px dashed #999; padding-top: ${toPx(TAGS_PADDING_TOP_IN, dpi)}px;">Tags: ${sanitizeHTML(card.tags.join(', '))}</p>` : ''}

                        ${(!card.isContinuation || isScrolling) && card.footer ? `<p style="font-size: ${ptToPx(FONT_SIZE_TAGS_FOOTER_PT, dpi)}px; text-align: center; margin-top: ${toPx(FOOTER_MARGIN_TOP_IN, dpi)}px;">${sanitizeHTML(card.footer || '')}</p>` : ''}
                    </div>
                </div>
            `;

        if (card.isFolded && !isScrolling) {
            let foldContentHtml = '';
            if (card.foldContent) {
                if (card.foldContent.type === 'text' && card.foldContent.text) {
                    foldContentHtml = `<p style="font-size: ${ptToPx(FONT_SIZE_FOLD_TEXT_PT, dpi)}px; text-align: center; margin: 0; line-height: 1.4;">${formatText(card.foldContent.text)}</p>`;
                } else if (card.foldContent.type === 'imageUrl' && card.foldContent.imageUrl) {
                    const backImgUrl = iconManifest[card.foldContent.imageUrl] || card.foldContent.imageUrl;
                    foldContentHtml = `<img src="${sanitizeHTML(backImgUrl)}" style="width: 100%; object-fit: contain; filter: grayscale(100%);" onerror="this.src='https://placehold.co/100x100/000/FFF?text=BACK+IMG';" />`;
                } else if (card.foldContent.type === 'qrCode' && card.foldContent.qrCodeData) {
                    const qrSize = toPx(QR_CODE_SIZE_IN, dpi);
                    const qrMaxSize = toPx(QR_CODE_MAX_SIZE_IN, dpi);
                    foldContentHtml = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(card.foldContent.qrCodeData)}" style="display: block; margin: 0 auto; max-width: ${qrMaxSize}px; height: auto;" onerror="this.src='https://placehold.co/80x80/000/FFF?text=QR';" />`;
                }
            }
            htmlContent += `
                    <div style="width: ${widthPx}px; font-family: 'Inter', sans-serif; padding: ${toPx(PADDING_IN, dpi)}px; box-sizing: border-box; color: #000; background-color: #fff; transform: rotate(180deg); transform-origin: center center; display: flex; justify-content: center; align-items: center;">
                        ${foldContentHtml}
                    </div>
                `;
        }
        return htmlContent;
    }

    // Generate HTML for thermal printer
    async function generateThermalHtmlForCard(card) {
        return generateCardHtml(card, { isScrolling: false });
    }

    // Function to open the card view
    function openCardView(card) {
        const dataToSend = {
            card: card,
            settings: {
                thermalPaperSize: appState.thermalPaperSize,
                thermalDpi: appState.thermalDpi,
                numCopies: appState.numCopies
            }
        };
        const jsonString = JSON.stringify(dataToSend);
        const encodedData = btoa(encodeURIComponent(jsonString));
        const url = `index.html?view=card&data=${encodedData}`;
        window.open(url, '_blank');
    }

    // View Card button handler
    viewCardBtn.addEventListener('click', () => {
        showMessage('Opening card view...');
        const cardToView = appState.cards[appState.currentCardIndex];
        openCardView(cardToView);
    });

    // Event listener for the thermal print button
    printThermalBtn.addEventListener('click', async () => {
        // This function replaces the old method of using a pre-generated href.
        // It now dynamically creates the HTML content and constructs the special
        // print URL on the fly, as requested.

        // First, check if the user agent is Android, as this feature is specific to it.
        const isAndroid = /android/i.test(navigator.userAgent);
        if (!isAndroid) {
            showMessage('This feature is for Android devices with the ESC/POS Print Service app.', true);
            return;
        }

        showMessage('Generating card for printing...');

        try {
            // Determine if we are printing the current card or all cards.
            const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];

            // We will accumulate the HTML for all selected cards into a single string.
            let fullHtml = '<html><head><style>body { margin: 0; padding: 0; } @media print { @page { margin: 0; } body { margin: 0; } }</style></head><body>';
            for (const card of cardsToProcess) {
                // The generateThermalHtmlForCard function is async, so we await it.
                fullHtml += await generateThermalHtmlForCard(card);
                // Add a page break after each card to ensure they print on separate sections of the paper.
                fullHtml += "<div style='page-break-after:always'></div>";
            }
            fullHtml += '</body></html>';

            // Construct the dynamic print URL with the generated HTML embedded.
            // The example suggests the HTML content itself is not URI-encoded, so we will follow that.
            let dynHtml = `print://escpos.org/escpos/bt/print?srcTp=uri&srcObj=html&numCopies=${appState.numCopies}&src='data:text/html,${fullHtml}'`;

            // Log the full URL to the console for debugging purposes.
            console.log("Generated Print URL:", dynHtml);

            // Setting window.location.href to this special URL triggers the Android Print Service.
            window.location.href = dynHtml;
        } catch (error) {
            console.error('Error generating thermal print content:', error);
            showMessage('Failed to generate card for printing. See console for details.', true);
        }
    });

    function updatePrintLink() {
        // This function's responsibility is now only to show or hide the thermal print button
        // based on the user's browser agent. The actual printing logic is handled
        // in the 'click' event listener for the printThermalBtn.
        const printButton = document.getElementById('print-thermal-btn');
        const isAndroid = /android/i.test(navigator.userAgent);

        if (isAndroid) {
            // If the user is on Android, the button is made visible.
            printButton.classList.remove('hidden');
        } else {
            // Otherwise, the button is hidden, as the feature won't work.
            printButton.classList.add('hidden');
        }
    }

    // Print Color Photo button handler
    printColorPhotoBtn.addEventListener('click', async () => {
        // This button's primary function is to share with a printer app.
        const dummyFile = new File(["dummy"], "dummy.png", { type: "image/png" });
        if (!navigator.share || !navigator.canShare({ files: [dummyFile] })) {
            showMessage(`Web Share not supported. Please use the "Download Card Image(s)" button and print manually from your photo app.`, true);
            return;
        }

        showMessage('Generating image(s) for color photo printer...');
        const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];

        try {
            const files = [];
            for (const card of cardsToProcess) {
                const [canvas] = await generateCardCanvas(card);
                if (!canvas) continue;
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                files.push(new File([blob], `${card.title.replace(/\s/g, '_')}_card.png`, { type: 'image/png' }));
            }

            await navigator.share({
                files: files,
                title: `Print Card: ${cardsToProcess.length > 1 ? 'Multiple Cards' : cardsToProcess[0].title}`,
                text: 'Ready to print TTRPG card(s).',
            });
            showMessage('Image(s) sent to share dialog for printing.');
        } catch (error) {
            if (error.name === 'AbortError') {
                showMessage('Share cancelled.', false);
            } else {
                console.error('Error preparing image for printing:', error);
                showMessage(`Error preparing image for printing: ${error.message}`, true);
            }
        }
    });

    // Refactored function to generate a canvas for a given card
    async function generateCardCanvas(card, printBack) {
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.className = 'card-export-render-container';

        // --- Front of Card ---
        const frontContainer = document.createElement('div');
        const frontHtml = await generateThermalHtmlForCard(card);
        frontContainer.innerHTML = frontHtml;
        tempContainer.appendChild(frontContainer);

        document.body.appendChild(tempContainer);
        await new Promise(resolve => setTimeout(resolve, 100)); // Allow render

        const frontCanvas = await html2canvas(frontContainer.firstElementChild, {
            useCORS: true,
            logging: false,
            backgroundColor: null,
            removeContainer: true
        });

        if (printBack) {
            // --- Back of Card ---
            const backContainer = document.createElement('div');
            const backHtml = await generateFoldedBackHtmlForCard(card);
            backContainer.innerHTML = backHtml;
            tempContainer.innerHTML = ''; // Clear and reuse
            tempContainer.appendChild(backContainer);

            await new Promise(resolve => setTimeout(resolve, 100));

            const backCanvas = await html2canvas(backContainer.firstElementChild, {
                useCORS: true,
                logging: false,
                backgroundColor: null,
                removeContainer: true
            });

            document.body.removeChild(tempContainer);
            return [frontCanvas, backCanvas];
        }

        document.body.removeChild(tempContainer);
        return [frontCanvas];
    }

    async function generateScrollingHtmlForCard(card) {
        return generateCardHtml(card, { isScrolling: true });
    }

    async function generateBackCanvas(card) {
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';

        const backContainer = document.createElement('div');
        const backHtml = await generateFoldedBackHtmlForCard(card);
        backContainer.innerHTML = backHtml;
        tempContainer.appendChild(backContainer);
        document.body.appendChild(tempContainer);

        await new Promise(resolve => setTimeout(resolve, 100));

        const backCanvas = await html2canvas(backContainer.firstElementChild, {
            useCORS: true,
            logging: false,
            backgroundColor: null,
            removeContainer: true
        });

        document.body.removeChild(tempContainer);
        return backCanvas;
    }

    async function generateFoldedBackHtmlForCard(card) {
        const dpi = appState.thermalDpi;
        const widthPx = getPixelWidth(appState.thermalPaperWidth, dpi);
        let backContentHtml = '';

        if (card.foldContent) {
            if (card.foldContent.type === 'backgroundImageUrl' && card.foldContent.imageUrl) {
                backContentHtml = `<img src="${sanitizeHTML(card.foldContent.imageUrl)}" width="${widthPx}" height="${toPx(widthPx / dpi * CARD_HEIGHT_RATIO, dpi)}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%);" onerror="this.src='https://placehold.co/100x100/000/FFF?text=BG+IMG';" />`;
            } else if (card.foldContent.type === 'text' && card.foldContent.text) {
                backContentHtml = `<p style="font-size: ${ptToPx(FONT_SIZE_FOLD_TEXT_PT, dpi)}px; text-align: center; margin: 0; line-height: 1.4;">${formatText(card.foldContent.text)}</p>`;
            } else if (card.foldContent.type === 'imageUrl' && card.foldContent.imageUrl) {
                const backImgUrl = iconManifest[card.foldContent.imageUrl] || card.foldContent.imageUrl;
                backContentHtml = `<img src="${sanitizeHTML(backImgUrl)}" width="${widthPx}" height="${toPx(widthPx / dpi * CARD_HEIGHT_RATIO, dpi)}" style="width: 100%; object-fit: contain; filter: grayscale(100%);" onerror="this.src='https://placehold.co/100x100/000/FFF?text=BACK+IMG';" />`;
            } else if (card.foldContent.type === 'qrCode' && card.foldContent.qrCodeData) {
                const qrSize = toPx(QR_CODE_SIZE_IN, dpi);
                const qrMaxSize = toPx(QR_CODE_MAX_SIZE_IN, dpi);
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(card.foldContent.qrCodeData)}`;
                backContentHtml = `<img src="${qrUrl}" width="${qrSize}" height="${qrSize}" style="display: block; margin: 0 auto; max-width: ${qrMaxSize}px; height: auto;" onerror="this.src='https://placehold.co/80x80/000/FFF?text=QR';" />`;
            }
        }

        return `
                <div style="width: ${widthPx}px; height: ${toPx(widthPx / dpi * CARD_HEIGHT_RATIO, dpi)}px; font-family: 'Inter', sans-serif; padding: ${toPx(PADDING_IN, dpi)}px; box-sizing: border-box; color: #000; background-color: #fff; display: flex; justify-content: center; align-items: center; transform: rotate(180deg);">
                    ${backContentHtml}
                </div>
            `;
    }

    async function splitCardIntoPages(originalCard) {
        // Helper to check for overflow by rendering the card off-screen
        const checkForOverflow = async (card) => {
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.visibility = 'hidden';

            const renderWrapper = document.createElement('div');
            renderWrapper.innerHTML = await generateThermalHtmlForCard(card);
            tempContainer.appendChild(renderWrapper);
            document.body.appendChild(tempContainer);

            await new Promise(resolve => setTimeout(resolve, 50));

            const contentArea = tempContainer.querySelector('.card-content-area');
            if (!contentArea) {
                console.error("Could not find .card-content-area for overflow check.");
                document.body.removeChild(tempContainer);
                return false;
            }

            const isOverflowing = contentArea.scrollHeight > contentArea.clientHeight;
            document.body.removeChild(tempContainer);
            return isOverflowing;
        };

        const cardWithAllSections = JSON.parse(JSON.stringify(originalCard));
        if (!(await checkForOverflow(cardWithAllSections))) {
            return [originalCard];
        }

        const pages = [];
        let sectionsToProcess = JSON.parse(JSON.stringify(originalCard.sections));
        const page1 = JSON.parse(JSON.stringify(originalCard));
        page1.sections = [];

        for (const section of sectionsToProcess) {
            const testPage = { ...page1, sections: [...page1.sections, section] };
            if (await checkForOverflow(testPage)) {
                break;
            }
            page1.sections.push(section);
        }
        pages.push(page1);

        let remainingSections = sectionsToProcess.slice(page1.sections.length);

        while (remainingSections.length > 0) {
            const continuationPage = JSON.parse(JSON.stringify(originalCard));
            continuationPage.title = '';
            continuationPage.icon = '';
            continuationPage.type = '';
            continuationPage.stats = {};
            continuationPage.tags = [];
            continuationPage.footer = '';
            continuationPage.isContinuation = true;
            continuationPage.sections = [];

            for (const section of remainingSections) {
                const testPage = { ...continuationPage, sections: [...continuationPage.sections, section] };
                if (await checkForOverflow(testPage)) {
                    break;
                }
                continuationPage.sections.push(section);
            }

            if (continuationPage.sections.length === 0 && remainingSections.length > 0) {
                continuationPage.sections.push(remainingSections[0]);
            }

            pages.push(continuationPage);
            remainingSections = remainingSections.slice(continuationPage.sections.length);
        }

        return pages;
    }

    async function downsampleCanvas(sourceCanvas, targetDpi, physicalWidthInches) {
        const sourceWidth = sourceCanvas.width;
        const sourceHeight = sourceCanvas.height;

        // Calculate the target dimensions in pixels
        const targetWidth = Math.round(physicalWidthInches * targetDpi);
        // Maintain aspect ratio
        const targetHeight = sourceWidth > 0 ? Math.round((sourceHeight / sourceWidth) * targetWidth) : 0;

        // Create a new canvas with the target dimensions
        const downsampledCanvas = document.createElement('canvas');
        downsampledCanvas.width = targetWidth;
        downsampledCanvas.height = targetHeight;
        const ctx = downsampledCanvas.getContext('2d');

        // Set a white background to avoid transparency issues in the final PDF
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw the source canvas onto the new canvas, which performs the downsampling
        ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

        return downsampledCanvas;
    }

    function parseMarkdown(text) {
        const segments = [];
        if (!text) return segments;
        // This regex captures content within ***...***, **...**, or *...* and the plain text around it.
        // It prioritizes the longest match first.
        const regex = /(\*\*\*(.*?)\*\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Capture plain text before the match
            if (match.index > lastIndex) {
                segments.push({ text: text.substring(lastIndex, match.index), style: 'normal' });
            }

            // Capture the formatted text
            if (match[2] !== undefined) { // Bold and Italic
                segments.push({ text: match[2], style: 'bolditalic' });
            } else if (match[4] !== undefined) { // Bold
                segments.push({ text: match[4], style: 'bold' });
            } else if (match[6] !== undefined) { // Italic
                segments.push({ text: match[6], style: 'italic' });
            }
            lastIndex = regex.lastIndex;
        }

        // Capture any plain text after the last match
        if (lastIndex < text.length) {
            segments.push({ text: text.substring(lastIndex), style: 'normal' });
        }
        return segments;
    }

    function renderMarkdownText(doc, text, x, y, options) {
        const { maxWidth, pageHeight, margin } = options;
        // Use jsPDF's recommended way to get line height
        const lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor * 1.15;
        let currentY = y;
        const lines = text.split('\n');

        lines.forEach((line, lineIndex) => {
            // For each line from the input text, we process it word by word
            const segments = parseMarkdown(line);
            let currentX = x;

            segments.forEach(segment => {
                doc.setFont(undefined, segment.style);
                const words = segment.text.split(/(\s+)/); // Split by spaces but keep them

                words.forEach(word => {
                    if (!word) return;
                    const wordWidth = doc.getTextWidth(word);

                    // Check if the word overflows the maxWidth.
                    // The `currentX > x` check prevents wrapping if a single word is too long for a line.
                    if (currentX > x && currentX + wordWidth > x + maxWidth) {
                        currentY += lineHeight;
                        currentX = x;
                        // Check for page overflow after moving to a new line
                        if (currentY > pageHeight - margin) {
                            doc.addPage();
                            currentY = margin;
                        }
                    }
                    doc.text(word, currentX, currentY);
                    currentX += wordWidth;
                });
            });

            // After processing all segments of a line, move Y to the next line.
            currentY += lineHeight;
            if (currentY > pageHeight - margin && lineIndex < lines.length - 1) {
                doc.addPage();
                currentY = margin;
            }
        });

        doc.setFont(undefined, 'normal'); // Reset font style
        // Return the Y position for the *start* of the next element, not the baseline of the last.
        return currentY - lineHeight;
    }

    async function generatePdfWithText(doc, card) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 2; // mm
        let y = margin;

        doc.setFont('helvetica');

        if (card.icon) {
            let iconUrl = null;
            if (card.icon in iconManifest) {
                iconUrl = iconManifest[card.icon];
            } else if (isURL(card.icon)) {
                iconUrl = card.icon;
            }
            if (iconUrl) {
                try {
                    const img = await loadImage(iconUrl);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    const iconSize = 6;
                    doc.addImage(dataUrl, 'PNG', pageWidth - iconSize - margin, y, iconSize, iconSize);
                } catch (e) {
                    console.error("Could not load icon for PDF:", e);
                }
            }
        }

        if (card.title) {
            doc.setFontSize(16).setFont(undefined, 'bold');
            doc.text(card.title, pageWidth / 2, y + 5, { align: 'center' });
            y += 8;
        }
        if (card.type) {
            doc.setFontSize(10).setFont(undefined, 'normal');
            if (typeof card.type === 'object' && card.type !== null) {
                const mainText = card.type.text || '';
                const asideText = card.type.aside || '';

                doc.text(mainText, margin, y);
                if (asideText) {
                    const asideWidth = doc.getTextWidth(asideText);
                    doc.setFontSize(8).setFont(undefined, 'normal');
                    doc.text(asideText, pageWidth - margin - asideWidth, y);
                }
            } else {
                doc.text(card.type, pageWidth / 2, y, { align: 'center' });
            }
            y += 5;
        }
        if (card.stats && Object.keys(card.stats).length > 0) {
            const statsText = Object.entries(card.stats).map(([k, v]) => `${k}: ${v}`).join(' | ');
            doc.setFontSize(8).setFont(undefined, 'bold');
            doc.text(statsText, pageWidth / 2, y, { align: 'center' });
            y += 5;
        }

        if (card.sections && card.sections.length > 0) {
            const contentWidth = pageWidth - (margin * 2);

            for (const section of card.sections) {
                if (section.type === 'picture' && section.url) {
                    try {
                        const img = await loadImage(section.url);
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL('image/png');

                        const dpi = appState.thermalDpi || 203;
                        const imgHeightMm = (section.height / dpi) * 25.4;
                        const imgProps = doc.getImageProperties(dataUrl);
                        const imgWidthMm = (imgProps.width * imgHeightMm) / imgProps.height;

                        if (y + imgHeightMm > pageHeight - margin) {
                            doc.addPage();
                            y = margin;
                        }
                        const x = (pageWidth - imgWidthMm) / 2;
                        doc.addImage(dataUrl, 'PNG', x, y, imgWidthMm, imgHeightMm);
                        y += imgHeightMm + 2;
                    } catch (e) {
                        console.error("Could not load picture for PDF:", e);
                        const errorText = '[Image could not be loaded]';
                        if (y + 5 > pageHeight - margin) { doc.addPage(); y = margin; }
                        doc.text(errorText, pageWidth / 2, y, { align: 'center' });
                        y += 5;
                    }
                    continue;
                } else if (section.type === 'boxes') {
                    const boxSizeMm = ((section.size || 1.0) * 10 * 25.4) / 72; // 1em ~ 10pt -> inches -> mm
                    const boxSpacingMm = 1;
                    const boxCount = section.count || 1;
                    const totalBoxesWidth = boxCount * boxSizeMm + Math.max(0, boxCount - 1) * boxSpacingMm;
                    let textHeight = 0;

                    if (section.text) {
                        doc.setFontSize(9).setFont(undefined, 'normal');
                        const textLines = doc.splitTextToSize(section.text, contentWidth);
                        textHeight = doc.getTextDimensions(textLines).h + 2;
                    }

                    if (y + textHeight + boxSizeMm + 2 > pageHeight - margin) {
                        doc.addPage();
                        y = margin;
                    }

                    if (section.text) {
                        doc.text(section.text, pageWidth / 2, y, { align: 'center' });
                        y += textHeight;
                    }

                    let currentX = (pageWidth - totalBoxesWidth) / 2;
                    for (let i = 0; i < boxCount; i++) {
                        doc.rect(currentX, y, boxSizeMm, boxSizeMm);
                        currentX += boxSizeMm + boxSpacingMm;
                    }
                    y += boxSizeMm + 2; // Padding after the block
                    continue;
                } else if (section.type === 'ruler') {
                    if (y + 2 > pageHeight - margin) { doc.addPage(); y = margin; }
                    doc.setDrawColor(50);
                    doc.setLineWidth(0.1);
                    doc.line(margin, y, pageWidth - margin, y);
                    y += 2;
                    continue;
                } else if (section.type === 'swstats' || section.type === 'p2e_stats') {
                    const stats = Object.entries(section.stats).filter(([k, v]) => v);
                    const colCount = section.type === 'swstats' ? 5 : 6;
                    const cellWidth = (contentWidth - (colCount - 1)) / colCount; // 1mm gap
                    const cellHeight = 8; // Fixed height for stat cells

                    if (y + cellHeight > pageHeight - margin) { doc.addPage(); y = margin; }

                    let currentX = margin;
                    for (let i = 0; i < stats.length; i++) {
                        const [key, value] = stats[i];
                        doc.setFillColor(243, 244, 246);
                        doc.roundedRect(currentX, y, cellWidth, cellHeight, 1, 1, 'F');

                        doc.setFontSize(6).setFont(undefined, 'bold').setTextColor(0);
                        doc.text(key.toUpperCase(), currentX + cellWidth / 2, y + 3, { align: 'center' });

                        doc.setFontSize(8).setFont(undefined, 'normal');
                        doc.text(value, currentX + cellWidth / 2, y + 6.5, { align: 'center' });

                        currentX += cellWidth + 1;
                        if ((i + 1) % colCount === 0) {
                            currentX = margin;
                            y += cellHeight + 1;
                            if (i + 1 < stats.length && y + cellHeight > pageHeight - margin) {
                                doc.addPage();
                                y = margin;
                            }
                        }
                    }
                    y += cellHeight + 2;
                    continue;
                } else if (section.type === 'p2e_traits') {
                    if (y + 5 > pageHeight - margin) { doc.addPage(); y = margin; }
                    let currentX = margin;
                    doc.setFontSize(7).setFont(undefined, 'bold');

                    for (const trait of section.traits) {
                        const text = trait.text.toUpperCase();
                        const textWidth = doc.getTextWidth(text) + 4; // with padding

                        if (currentX + textWidth > pageWidth - margin) {
                            currentX = margin;
                            y += 5;
                            if (y + 5 > pageHeight - margin) { doc.addPage(); y = margin; }
                        }

                        doc.setFillColor(100);
                        doc.roundedRect(currentX, y, textWidth, 4, 2, 2, 'F');
                        doc.setTextColor(255);
                        doc.text(text, currentX + textWidth / 2, y + 2.8, { align: 'center' });

                        currentX += textWidth + 2;
                    }
                    y += 6;
                    continue;
                } else if (section.type === 'p2e_activity') {
                    if (y + 8 > pageHeight - margin) { doc.addPage(); y = margin; }

                    const actionText = { '0': 'F', '1': '1A', '2': '2A', '3': '3A', 'R': 'R' }[section.actions] || section.actions;
                    doc.setFillColor(50);
                    doc.roundedRect(margin, y, 6, 4, 1, 1, 'F');
                    doc.setFontSize(7).setTextColor(255).setFont(undefined, 'bold');
                    doc.text(actionText, margin + 3, y + 2.8, { align: 'center' });

                    doc.setTextColor(0).setFontSize(9).setFont(undefined, 'bold');
                    doc.text(section.name, margin + 8, y + 3);
                    y += 5;

                    doc.setFontSize(9).setFont(undefined, 'normal');
                    // Use the new markdown renderer
                    const newY = renderMarkdownText(doc, section.description || '', margin + 8, y, { maxWidth: contentWidth - 8, pageHeight, margin });
                    y = newY + doc.getLineHeight(section.description || '') / doc.internal.scaleFactor * 1.15 + 2;
                    continue;
                } else if (section.type === 'dndstats') {
                    const stats = Object.entries(section.stats).filter(([k, v]) => v);
                    if (stats.length === 0) continue;

                    const colCount = Math.min(stats.length, 6);
                    const gap = 2; // mm
                    const cellHeight = 8; // mm
                    const cellWidth = (contentWidth - ((colCount - 1) * gap)) / colCount;

                    if (y + cellHeight > pageHeight - margin) { doc.addPage(); y = margin; }

                    doc.setFillColor(243, 244, 246); // bg-gray-100
                    doc.roundedRect(margin, y, contentWidth, cellHeight, 1, 1, 'F');

                    const totalStatWidth = colCount * cellWidth + Math.max(0, colCount - 1) * gap;
                    let currentX = margin + (contentWidth - totalStatWidth) / 2; // Center the block of stats

                    for (let i = 0; i < colCount; i++) {
                        const [key, value] = stats[i];

                        doc.setFontSize(7).setFont(undefined, 'bold').setTextColor(0);
                        doc.text(key.toUpperCase(), currentX + cellWidth / 2, y + 3, { align: 'center' });

                        doc.setFontSize(8).setFont(undefined, 'normal');
                        doc.text(value, currentX + cellWidth / 2, y + 6.5, { align: 'center' });

                        currentX += cellWidth + gap;
                    }
                    y += cellHeight + 2; // Padding after the block
                    continue;
                }

                // Fallback for other types or default content sections
                const headingHeight = section.heading ? (doc.setFontSize(10).getTextDimensions(section.heading).h + 4) : 0;
                const bodyHeight = section.body ? (doc.setFontSize(9).getTextDimensions(section.body, { maxWidth: contentWidth }).h + 2) : 0;
                const flavorHeight = section.flavorText ? (doc.setFontSize(8).getTextDimensions(section.flavorText, { maxWidth: contentWidth }).h + 2) : 0;
                const sectionHeight = headingHeight + bodyHeight + flavorHeight;

                if (y + sectionHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }

                if (section.heading) {
                    doc.setFontSize(10).setFont(undefined, 'bold');
                    const headingText = section.heading;
                    doc.text(headingText, margin, y);

                    if (section.headingAside) {
                        doc.setFontSize(8).setFont(undefined, 'normal');
                        const asideText = section.headingAside;
                        const asideWidth = doc.getTextWidth(asideText);
                        doc.text(asideText, pageWidth - margin - asideWidth, y);
                    }

                    doc.setDrawColor(150);
                    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
                    y += 5;
                }
                if (section.body) {
                    doc.setFontSize(9).setFont(undefined, 'normal');
                    const newY = renderMarkdownText(doc, section.body || '', margin, y, { maxWidth: contentWidth, pageHeight, margin });
                    y = newY + (doc.getLineHeight(section.body || '') / doc.internal.scaleFactor * 1.15) + 2; // Padding after the block
                }
                if (section.flavorText) {
                    doc.setFontSize(8).setFont(undefined, 'italic').setTextColor(100);
                    const newY = renderMarkdownText(doc, section.flavorText || '', margin, y, { maxWidth: contentWidth, pageHeight, margin });
                    y = newY + (doc.getLineHeight(section.flavorText || '') / doc.internal.scaleFactor * 1.15) + 2; // Padding after the block
                    doc.setTextColor(0);
                }
            }
        }

        const footerY = pageHeight - 5;
        if (card.tags && card.tags.length > 0) {
            doc.setFontSize(7).setFont(undefined, 'normal');
            doc.text(`Tags: ${card.tags.join(', ')}`, pageWidth/2, footerY, { align: 'center' });
        }
        if (card.footer) {
            doc.setFontSize(7).setFont(undefined, 'italic');
            doc.text(card.footer, pageWidth/2, footerY + 3, { align: 'center' });
        }
    }

    async function generatePdfDocument(cards, foldOverride = null) {
        const { jsPDF } = window.jspdf;
        let doc;

        // --- TEXT-BASED PDF LOGIC (High Quality) ---
        if (appState.outputFormat === 'pdf' && !appState.isScrolling) {
            const { cardWidth, cardHeight } = getCardDimensionsInInches();
            const pdfWidthMm = cardWidth * 25.4;
            const pdfHeightMm = cardHeight * 25.4;

            doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidthMm, pdfHeightMm] });

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (i > 0) doc.addPage();

                const pageNumBefore = doc.internal.getNumberOfPages();
                await generatePdfWithText(doc, card);
                const pageNumAfter = doc.internal.getNumberOfPages();
                const pagesAdded = pageNumAfter - pageNumBefore;

                if (appState.includeCornerDots) {
                    for (let p = pageNumBefore; p < pageNumAfter; p++) {
                        doc.setPage(p + 1);
                        addCornerDots(doc, pdfWidthMm, pdfHeightMm);
                    }
                }

                const shouldPrintBack = (foldOverride !== null) ? foldOverride : card.isFolded;
                if (shouldPrintBack && card.foldContent) {
                    // If the number of pages added for the front content is odd,
                    // we add a blank page to ensure the back prints on the correct side.
                    if (pagesAdded % 2 !== 0) {
                        doc.addPage(); // Add blank page for duplex alignment
                    }
                    doc.addPage();
                    const backPageNum = doc.internal.getNumberOfPages();
                    doc.setPage(backPageNum);

                    // ... (rest of the back page generation logic is the same)
                    if (card.foldContent.type === 'backgroundImageUrl' && card.foldContent.imageUrl) {
                        try {
                            const img = await loadImage(card.foldContent.imageUrl);
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            ctx.translate(canvas.width / 2, canvas.height / 2);
                            ctx.rotate(Math.PI);
                            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
                            const dataUrl = canvas.toDataURL('image/png');
                            doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);
                        } catch (e) {
                            doc.text('BG Image could not be loaded.', pdfWidthMm / 2, pdfHeightMm / 2, { angle: 180, align: 'center', baseline: 'middle' });
                        }
                    } else if (card.foldContent.type === 'text' && card.foldContent.text) {
                        doc.setFontSize(10).setFont(undefined, 'normal');
                        doc.text(card.foldContent.text, pdfWidthMm / 2, pdfHeightMm / 2, { angle: 180, align: 'center', baseline: 'middle' });
                    } else if ((card.foldContent.type === 'imageUrl' && card.foldContent.imageUrl) || (card.foldContent.type === 'qrCode' && card.foldContent.qrCodeData)) {
                         let finalImageUrl = null;
                        if (card.foldContent.type === 'qrCode') {
                            const qrSize = toPx(QR_CODE_SIZE_IN, appState.thermalDpi);
                            finalImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(card.foldContent.qrCodeData)}`;
                        } else {
                            const backImageValue = card.foldContent.imageUrl;
                            if (backImageValue && backImageValue in iconManifest) {
                                finalImageUrl = iconManifest[backImageValue];
                            } else if (isURL(backImageValue)) {
                                finalImageUrl = backImageValue;
                            }
                        }
                        if (finalImageUrl) {
                            try {
                                const img = await loadImage(finalImageUrl);
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = img.naturalWidth;
                                canvas.height = img.naturalHeight;
                                ctx.translate(canvas.width / 2, canvas.height / 2);
                                ctx.rotate(Math.PI);
                                ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
                                const dataUrl = canvas.toDataURL('image/png');
                                const imgProps = doc.getImageProperties(dataUrl);
                                const imgHeightMm = (imgProps.height * pdfWidthMm) / imgProps.width;
                                const y = (pdfHeightMm - imgHeightMm) / 2;
                                doc.addImage(dataUrl, 'PNG', 0, y, pdfWidthMm, imgHeightMm);
                            } catch (e) {
                                doc.text('Image could not be loaded.', pdfWidthMm / 2, pdfHeightMm / 2, { angle: 180, align: 'center', baseline: 'middle' });
                            }
                        }
                    }
                    if (appState.includeCornerDots) addCornerDots(doc, pdfWidthMm, pdfHeightMm);
                }
            }
            return doc;
        }

        // --- IMAGE-BASED PDF LOGIC (Scrolling or PNG Output) ---
        if (appState.isScrolling) {
            let fullHtml = '<div>';
            for (const card of cards) {
                if (!card) continue;
                fullHtml += await generateScrollingHtmlForCard(card);
            }
            fullHtml += '</div>';

            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.innerHTML = fullHtml;
            document.body.appendChild(tempContainer);
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await html2canvas(tempContainer.firstElementChild, { useCORS: true, logging: false, backgroundColor: null, removeContainer: true });
            document.body.removeChild(tempContainer);

            const widthPx = getPixelWidth(appState.thermalPaperWidth, appState.thermalDpi);
            const physicalWidthInches = widthPx / appState.thermalDpi;
            const pdfWidthMm = physicalWidthInches * 25.4;
            const downsampled = await downsampleCanvas(canvas, appState.thermalDpi, physicalWidthInches);
            const cardWidth = downsampled.width;
            const cardHeight = downsampled.height;
            const pdfHeight = (cardHeight / cardWidth) * pdfWidthMm;

            doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidthMm, pdfHeight] });
            doc.addImage(downsampled.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeight);

        } else { // Refactored logic for non-scrolling image-based PDF
            let isFirstPage = true;

            for (const card of cards) {
                if (!card) continue;

                const frontPages = await splitCardIntoPages(card);

                for (const page of frontPages) {
                    const [frontCanvas] = await generateCardCanvas(page, false);
                    if (!frontCanvas) continue;

                    const pdfWidthMm = (appState.thermalPaperWidth === '58mm' ? 48 : (appState.thermalPaperWidth === '80mm' ? 72 : 48));
                    const physicalWidthInches = pdfWidthMm / 25.4;
                    const downsampled = await downsampleCanvas(frontCanvas, appState.thermalDpi, physicalWidthInches);
                    const cardWidth = downsampled.width;
                    const cardHeight = downsampled.height;
                    const pdfHeight = (cardHeight / cardWidth) * pdfWidthMm;

                    if (isFirstPage) {
                        doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidthMm, pdfHeight] });
                        isFirstPage = false;
                    } else {
                        doc.addPage([pdfWidthMm, pdfHeight], 'portrait');
                    }
                    doc.addImage(downsampled.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeight);
                    if (appState.includeCornerDots) addCornerDots(doc, pdfWidthMm, pdfHeight);
                }

                const shouldPrintBack = (foldOverride !== null) ? foldOverride : card.isFolded;
                const hasBackContent = card.foldContent && (card.foldContent.text || card.foldContent.imageUrl || card.foldContent.qrCodeData);

                if (shouldPrintBack && hasBackContent) {
                    if (frontPages.length % 2 !== 0) {
                        const pdfWidthMm = (appState.thermalPaperWidth === '58mm' ? 48 : (appState.thermalPaperWidth === '80mm' ? 72 : 48));
                        const physicalWidthInches = pdfWidthMm / 25.4;
                        const { cardHeight } = getCardDimensionsInInches();
                        const pdfHeight = cardHeight * 25.4;
                        doc.addPage([pdfWidthMm, pdfHeight], 'portrait');
                    }

                    const backCanvas = await generateBackCanvas(card);
                    if (!backCanvas) continue;

                    const pdfWidthMm = (appState.thermalPaperWidth === '58mm' ? 48 : (appState.thermalPaperWidth === '80mm' ? 72 : 48));
                    const physicalWidthInches = pdfWidthMm / 25.4;
                    const downsampled = await downsampleCanvas(backCanvas, appState.thermalDpi, physicalWidthInches);
                    const cardWidth = downsampled.width;
                    const cardHeight = downsampled.height;
                    const pdfHeight = (cardHeight / cardWidth) * pdfWidthMm;

                    doc.addPage([pdfWidthMm, pdfHeight], 'portrait');
                    doc.addImage(downsampled.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeight);
                    if (appState.includeCornerDots) addCornerDots(doc, pdfWidthMm, pdfHeight);
                }
            }
        }
        return doc;
    }

    function addCornerDots(doc, width, height) {
        const dotSize = 0.1;
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, dotSize, dotSize, 'F');
        doc.rect(width - dotSize, 0, dotSize, dotSize, 'F');
        doc.rect(0, height - dotSize, dotSize, dotSize, 'F');
        doc.rect(width - dotSize, height - dotSize, dotSize, 'F');
    }

    // Download Image button handler
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Handle CORS
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    }

    function downloadImage(imageDataUrl, cardTitle = 'card') {
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `${cardTitle.replace(/\s/g, '_')}_${appState.printerType}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage(`Card image "${cardTitle}" downloaded!`);
    }

    downloadImageBtn.addEventListener('click', async () => {
        showMessage('Generating image(s) for download...');
        const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];
        const originalCardIndex = appState.currentCardIndex;

        for (const card of cardsToProcess) {
            // This loop doesn't need to update the main UI, just process cards.
            try {
                const [canvas] = await generateCardCanvas(card);
                if (!canvas) continue; // Skip if canvas generation failed
                const imageDataUrl = canvas.toDataURL('image/png');
                downloadImage(imageDataUrl, card.title); // Use existing helper to download
            } catch (error) {
                console.error(`Error generating image for download for "${card.title}":`, error);
                showMessage(`Failed to generate image for download for "${card.title}".`, true);
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between downloads
        }

        // Restore original state just in case, though we didn't change it.
        appState.currentCardIndex = originalCardIndex;
        updateCardPreview();
        showMessage('Image download process completed for selected cards.');
    });

    // Download PDF button handler
    downloadPdfBtn.addEventListener('click', async () => {
        showMessage('Generating PDF for download...');
        try {
            const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];
            const foldOverride = appState.printScope === 'all' ? isFoldedCheckbox.checked : null;
            const pdf = await generatePdfDocument(cardsToProcess, foldOverride);
            const fileName = cardsToProcess.length > 1 ? 'TTRPG_Cards.pdf' : `${cardsToProcess[0].title.replace(/\s/g, '_')}.pdf`;
            pdf.save(fileName);
            showMessage('PDF downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF for download:', error);
            showMessage(`Error generating PDF: ${error.message}`, true);
        }
    });

    function resetShareButton() {
        const readyClasses = ['bg-yellow-500', 'hover:bg-yellow-600'];
        const initialClasses = ['bg-green-600', 'hover:bg-green-700'];

        pdfShareBlob = null;
        sharePdfBtn.disabled = false;
        sharePdfBtn.textContent = 'Share PDF';
        sharePdfBtn.classList.remove(...readyClasses);
        sharePdfBtn.classList.add(...initialClasses);
    }

    // Share PDF button handler
    sharePdfBtn.addEventListener('click', async () => {
        // --- Second Click Logic ---
        if (pdfShareBlob) {
            try {
                const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];
                const fileName = cardsToProcess.length > 1 ? 'TTRPG_Cards.pdf' : `${cardsToProcess[0].title.replace(/\s/g, '_')}.pdf`;
                const file = new File([pdfShareBlob], fileName, { type: 'application/pdf' });

                await navigator.share({
                    files: [file],
                    title: `TTRPG Cards`,
                    text: `Here are the TTRPG cards I made.`,
                });
                showMessage('PDF shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing PDF:', error);
                    showMessage(`Error sharing PDF: ${error.message}`, true);
                } else {
                    showMessage('Share cancelled.', false);
                }
            } finally {
                // Reset state after sharing
                resetShareButton();
            }
            return; // End execution after handling the second click
        }

        // --- First Click Logic ---
        const dummyFile = new File(["dummy"], "dummy.pdf", { type: "application/pdf" });
        if (!navigator.share || !navigator.canShare({ files: [dummyFile] })) {
            showMessage('Web Share API for files not supported on this device/browser. Please download the PDF and share manually.', true);
            return;
        }

        // Update UI to show generating state
        sharePdfBtn.disabled = true;
        sharePdfBtn.textContent = 'Generating PDF...';

        try {
            const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];
            const foldOverride = appState.printScope === 'all' ? isFoldedCheckbox.checked : null;
            const pdf = await generatePdfDocument(cardsToProcess, foldOverride);

            if (!pdf) {
                throw new Error('PDF generation failed.');
            }
            const blob = pdf.output('blob');

            // File size check
            if (blob.size > MAX_SHARE_SIZE_BYTES) {
                showMessage(`PDF is too large to share (${(blob.size / 1024 / 1024).toFixed(2)} MB). Please use the Download button.`, true);
                // Reset button on failure
                resetShareButton();
                return;
            }

            // Store blob and update UI for the second click
            pdfShareBlob = blob;
            sharePdfBtn.disabled = false;
            sharePdfBtn.textContent = 'Ready! Click again to Share';
            sharePdfBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            sharePdfBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');

        } catch (error) {
            console.error('Error preparing PDF for sharing:', error);
            showMessage(`Error preparing PDF: ${error.message}`, true);
            // Reset button on failure
            resetShareButton();
        }
    });

    // Share Card button handler
    shareCardBtn.addEventListener('click', async () => {
        const dummyFile = new File(["dummy"], "dummy.png", { type: "image/png" });
        if (!navigator.share || !navigator.canShare({ files: [dummyFile] })) {
            showMessage('Web Share API for files not supported on this device/browser. Please download the image and share manually.', true);
            return;
        }

        showMessage('Preparing card(s) for sharing...');
        try {
            const cardsToProcess = appState.printScope === 'all' ? appState.cards : [appState.cards[appState.currentCardIndex]];
            const files = [];

            for (const card of cardsToProcess) {
                const [canvas] = await generateCardCanvas(card);
                if (!canvas) continue;
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                files.push(new File([blob], `${card.title.replace(/\s/g, '_')}_card.png`, { type: 'image/png' }));
            }

            showMessage('Ready to share. Opening share dialog...');
            await navigator.share({
                files: files,
                title: 'TTRPG Cards',
                text: 'Here are the TTRPG cards I made.',
            });
            showMessage('Card(s) shared successfully!');
        } catch (error) {
            if (error.name === 'AbortError') {
                showMessage('Share cancelled.', false);
            } else {
                console.error('Error sharing files:', error);
                showMessage(`Error sharing: ${error.message}`, true);
            }
        }
    });

    // Copy Bookmarkable Link button handler
    copyBookmarkLinkBtn.addEventListener('click', () => {
        const currentCard = appState.cards[appState.currentCardIndex];
        const dataToSend = {
            card: currentCard,
            settings: {
                thermalPaperSize: appState.thermalPaperSize,
                thermalDpi: appState.thermalDpi,
                numCopies: appState.numCopies
            }
        };
        const jsonString = JSON.stringify(dataToSend);
        const encodedData = btoa(encodeURIComponent(jsonString));

        const currentUrl = new URL(window.location.href);
        // Clear existing params to create a clean link for the editor view
        currentUrl.search = '';
        currentUrl.searchParams.set('data', encodedData); // Use 'data' to be handled by loadState

        const bookmarkLink = currentUrl.toString();

        navigator.clipboard.writeText(bookmarkLink)
            .then(() => {
                showMessage('Bookmarkable link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy bookmark link: ', err);
                showMessage('Failed to copy link. Please copy manually: ' + bookmarkLink, true);
            });
    });

    async function initGeneratorView() {
        try {
            const response = await fetch('./icon-lookup.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            iconManifest = await response.json();
            console.log('Icon manifest loaded successfully.');
        } catch (error) {
            console.error('Could not load icon manifest:', error);
            showMessage('Could not load local icons. Please check the console for details.', true);
        }
        loadState();
    }

    async function initCardView() {
        // Clean up the UI for a print-only view
        const mainView = document.getElementById('main-generator-view');
        if (mainView) mainView.remove();
        const cardView = document.getElementById('card-view');
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.padding = '0';
        document.body.style.margin = '0';
        cardView.classList.remove('hidden');
        cardView.innerHTML = '<div id="card-render-area"></div>';


        // Fetch the icon manifest, which is necessary for rendering the card
        try {
            const response = await fetch('./icon-lookup.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            iconManifest = await response.json();
        } catch (error) {
            console.error('Could not load icon manifest:', error);
            document.body.innerHTML = '<p>Error: Could not load icon manifest.</p>';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data') || urlParams.get('cardData');
        if (!dataParam) {
            document.body.innerHTML = '<p>Error: No card data provided in URL.</p>';
            return;
        }

        try {
            const decodedString = decodeURIComponent(atob(dataParam));
            const decodedData = JSON.parse(decodedString);

            const card = decodedData.card || decodedData;
            const settings = decodedData.settings || {
                thermalPaperSize: urlParams.get('thermalPaperSize') || '58mm',
                thermalDpi: parseInt(urlParams.get('thermalDpi'), 10) || 203,
                numCopies: parseInt(urlParams.get('numCopies'), 10) || 1
            };

            appState.thermalPaperSize = settings.thermalPaperSize;
            appState.thermalDpi = settings.thermalDpi;

            const cardRenderArea = document.getElementById('card-render-area');
            cardRenderArea.innerHTML = await generateThermalHtmlForCard(card);

        } catch (error) {
            console.error('Error processing card view data:', error);
            document.body.innerHTML = `<p>Error: Could not read card data. ${error.message}</p>`;
        }
    }

    // Initial load and render
    window.addEventListener('load', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const viewMode = urlParams.get('view');

        if (viewMode === 'card') {
            await initCardView();
        } else {
            // This handles both normal page loads and bookmarked links with data
            await initGeneratorView();
        }
    });

    // Hamburger Menu and Modal Logic
    const menuButton = document.getElementById('menu-button');
    const menuDropdown = document.getElementById('menu-dropdown');
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModalBtn = document.getElementById('close-about-modal-btn');
    const aboutModalContent = document.getElementById('about-modal-content');

    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        menuDropdown.classList.toggle('hidden');
    });

    aboutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        menuDropdown.classList.add('hidden');

        // Check if content is already loaded
        if (aboutModalContent.innerHTML.trim() === '<!-- README content will be injected here -->') {
            try {
                aboutModalContent.innerHTML = '<p>Loading...</p>';
                const response = await fetch('README.md');
                if (!response.ok) {
                    throw new Error('README.md not found.');
                }
                const readmeText = await response.text();
                const md = window.markdownit({
                    html: true,
                    linkify: true,
                    typographer: true
                });
                // Add Tailwind classes to elements
                md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    if (token.tag === 'h1') {
                        token.attrPush(['class', 'text-3xl font-bold mb-4 text-pink-400']);
                    } else if (token.tag === 'h2') {
                        token.attrPush(['class', 'text-2xl font-semibold mb-3 text-pink-300 border-b border-slate-700 pb-2']);
                    } else if (token.tag === 'h3') {
                        token.attrPush(['class', 'text-xl font-semibold mb-2 text-pink-200']);
                    }
                    return self.renderToken(tokens, idx, options);
                };
                md.renderer.rules.table_open = () => '<div class="overflow-x-auto my-4"><table class="w-full text-sm text-left text-slate-300">';
                md.renderer.rules.table_close = () => '</table></div>';
                md.renderer.rules.thead_open = () => '<thead class="text-xs text-slate-200 uppercase bg-slate-800">';
                md.renderer.rules.th_open = () => '<th scope="col" class="px-6 py-3">';
                md.renderer.rules.tbody_open = () => '<tbody>';
                md.renderer.rules.tr_open = () => '<tr class="border-b border-slate-800 hover:bg-slate-700">';
                md.renderer.rules.td_open = () => '<td class="px-6 py-4">';
                md.renderer.rules.blockquote_open = () => '<blockquote class="p-4 my-4 border-l-4 border-slate-600 bg-slate-800">';
                md.renderer.rules.hr = () => '<hr class="my-6 border-slate-700"/>';
                md.renderer.rules.ul_open = () => '<ul class="list-disc list-inside space-y-2">';
                md.renderer.rules.ol_open = () => '<ol class="list-decimal list-inside space-y-2">';
                md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    return `<code class="bg-slate-700 text-pink-300 rounded-md px-1.5 py-1 text-xs">${token.content}</code>`;
                };


                aboutModalContent.innerHTML = md.render(readmeText);
            } catch (error) {
                aboutModalContent.innerHTML = `<p class="text-red-400">Error loading content: ${error.message}</p>`;
                console.error("Error fetching or rendering README.md:", error);
            }
        }

        aboutModal.classList.remove('hidden');
        closeAboutModalBtn.focus();
    });

    closeAboutModalBtn.addEventListener('click', () => {
        aboutModal.classList.add('hidden');
    });

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
    });

    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
            menuDropdown.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
            aboutModal.classList.add('hidden');
        }
    });

    lucide.createIcons();
});
