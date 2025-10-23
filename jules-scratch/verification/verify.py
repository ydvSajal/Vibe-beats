import re
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/landing_page.png")

    print("On Landing Page")
    # Use the demo login to bypass onboarding and profile creation
    page.get_by_role("button", name="see demo").click()

    # The rest of the script from the main screen onwards
    print("On Main Screen")
    # Wait for navigation to complete. A simple way is to wait for an element on the next page.
    # Let's assume the main screen has a "Profile" button and wait for it.
    page.wait_for_selector('button:has-text("Profile")')
    page.get_by_role("button", name="Profile").click()

    print("On Profile Screen")
    page.wait_for_selector('button:has-text("Settings")')
    page.get_by_role("button", name="Settings").click()

    print("On Settings Screen")
    # Wait for the settings screen to load. Wait for the main switch.
    page.wait_for_selector('div:has-text("Push Notifications")')
    page.screenshot(path="jules-scratch/verification/initial.png")
    page.get_by_role("switch", name=re.compile("Push Notifications", re.IGNORECASE)).click()
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
