import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        # Capture console logs
        console_logs = []
        def handle_console(msg):
            console_logs.append(msg.text)

        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        page.on("console", handle_console)

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        await page.goto(f'file://{file_path}')

        # Wait for the page to load
        await expect(page.get_by_role("heading", name="Thermal Printer TTRPG Card Generator")).to_be_visible()

        # Enable folded card and set back content to an image
        await page.get_by_label("Folded Card").check()
        await expect(page.get_by_label("Content Type")).to_be_visible()
        await page.get_by_label("Content Type").select_option("imageUrl")
        await page.get_by_label("Image URL or Icon Name for Fold").fill("crossed-swords")

        # Click the download PDF button
        download_button = page.get_by_role("button", name="Download PDF")
        await download_button.click()

        # Wait for the success message
        await expect(page.get_by_text("PDF downloaded successfully!")).to_be_visible(timeout=10000)

        await browser.close()

        # Print console logs
        print("--- CONSOLE LOGS ---")
        for log in console_logs:
            if "Could not load image" in log:
                print(log)
        print("--------------------")


if __name__ == '__main__':
    asyncio.run(main())
