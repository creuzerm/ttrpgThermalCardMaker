from playwright.sync_api import sync_playwright
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the local file
    page.goto(f"file:///app/index.html")

    # JSON data to import
    json_data = {
        "title": "Test Card",
        "type": {
            "text": "Spell",
            "aside": "Level 3"
        }
    }

    # Use evaluate to run JavaScript in the page context
    page.evaluate(f"""
        (function() {{
            const data = {json.dumps(json_data)};
            const cardObj = {{
                id: crypto.randomUUID(),
                title: String(data.title || 'Untitled Card'),
                type: {{
                    text: String(data.type.text || ''),
                    aside: String(data.type.aside || '')
                }},
                icon: String(data.icon || ''),
                color: String(data.color || '#ffffff'),
                tags: [],
                sections: [],
                stats: {{}},
                footer: String(data.footer || ''),
                isFolded: !!data.isFolded,
                foldContent: {{
                    type: String(data.foldContent?.type || 'text'),
                    text: String(data.foldContent?.text || ''),
                    imageUrl: String(data.foldContent?.imageUrl || ''),
                    qrCodeData: String(data.foldContent?.qrCodeData || '')
                }}
            }};
            appState.cards = [cardObj];
            appState.currentCardIndex = 0;
            updateUIFromAppState();
        }})()
    """)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
