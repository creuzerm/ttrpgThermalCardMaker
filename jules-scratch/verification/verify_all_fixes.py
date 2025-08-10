import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        await page.goto(f'file://{file_path}')
        await expect(page.get_by_role("heading", name="Thermal Printer TTRPG Card Generator")).to_be_visible()

        # --- Test 1: Folded Card with Image Back ---
        print("Testing folded card with image back...")

        # Use a more direct click action to force the event
        await page.locator("#is-folded").click(force=True)

        # Explicitly wait for the dependent UI to become visible
        content_type_selector = page.get_by_label("Content Type")
        await expect(content_type_selector).to_be_visible()
        await content_type_selector.select_option("imageUrl")

        image_url_input = page.get_by_label("Image URL or Icon Name for Fold")
        await expect(image_url_input).to_be_visible()
        await image_url_input.fill("crossed-swords")

        await page.get_by_role("button", name="Download PDF").click()
        await expect(page.get_by_text("PDF downloaded successfully!")).to_be_visible(timeout=10000)
        print("Folded card test successful.")

        # Hide the message to reset for the next test
        await page.evaluate("document.getElementById('message-display').classList.add('hidden')")


        # --- Test 2: Scrolling Card with Icon ---
        print("Testing scrolling card with icon...")
        # Reset options
        await page.locator("#is-folded").click(force=True) # Uncheck it
        await page.locator("#is-scrolling").check() # Use check here, this one wasn't problematic
        await page.get_by_label("Icon Name or Image URL").fill("magic-swirl")

        await page.get_by_role("button", name="Download PDF").click()
        await expect(page.get_by_text("PDF downloaded successfully!")).to_be_visible(timeout=10000)
        print("Scrolling card test successful.")

        # Take a final screenshot
        screenshot_path = 'jules-scratch/verification/verification_all_fixes.png'
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
