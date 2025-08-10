# AGENTS.md: Guidelines

## Core Principles

1.  **Aesthetics First (but not exclusively):** Prioritize clean, modern, and visually appealing designs. Good design enhances usability and user satisfaction.
2.  **Seamless Interaction:** Ensure user flows are intuitive, responsive, and free from friction. Every click, tap, or input should feel natural and provide immediate, understandable feedback.
3.  **Emotional Resonance:** Aim for outputs that evoke positive feelings – whether it's joy, calm, efficiency, or excitement. Avoid frustration, confusion, or visual clutter.
4.  **Clarity & Readability:** The generated code itself should be a pleasure to read and understand, reflecting the same "vibe" as the end-user experience.
5.  **Anticipatory Design:** Think ahead to common user needs and potential pain points, addressing them proactively in the design and implementation.

## Design Specifications

### Visual Aesthetics

*   **Modern & Clean:** Utilize contemporary design trends. Favor ample whitespace, clear typography, and a balanced layout.
*   **Consistent Styling:** Maintain a cohesive visual language across all elements.
*   **Rounded Corners:** Apply `rounded` classes (e.g., Tailwind's `rounded-lg`, `rounded-xl`) generously to elements for a softer, more inviting feel.
*   **Thoughtful Color Palettes:** Use colors that are harmonious and contribute to the desired mood (e.g., calming blues, energetic purples, warm greens). Avoid jarring combinations.
*   **Legible Typography:** Choose fonts (like 'Inter' by default) and font sizes that ensure readability on all devices. Ensure sufficient contrast between text and background.
*   **Responsive Design:** All layouts must be fully responsive, adapting gracefully to mobile, tablet, and desktop screens. No horizontal scrolling.

### User Experience & Interaction

*   **Smooth Transitions & Animations:** Employ subtle CSS transitions and animations to make interactions feel fluid and dynamic, rather than abrupt.
*   **Clear Feedback:** Provide immediate visual or textual feedback for user actions (e.g., loading indicators, success messages, error states).
*   **Intuitive Navigation:** Design navigation paths that are easy to understand and follow.
*   **Accessible Touch Targets:** Ensure interactive elements (buttons, links) are large enough and spaced appropriately for easy tapping on touchscreens.
*   **Error Prevention & Handling:** Guide users away from errors and provide clear, helpful messages when errors occur, without interrupting the flow with native `alert()` or `confirm()` dialogs.

### Emotional Resonance

*   **Delightful Micro-interactions:** Look for opportunities to add small, pleasing details (e.g., hover effects, subtle animations on state changes).
*   **Positive Affirmation:** Frame success messages positively.
*   **User Empowerment:** Design interfaces that make users feel in control and capable.

## Code Generation Instructions

### General Code Quality

*   **Single Source of Truth:** Avoid duplicating function definitions. If a function needs to be modified, update the original definition. For example, the `saveState` function should be defined only once.
*   **Completeness:** Always provide self-contained, runnable code. No `...` placeholders.
*   **Extensive Comments:** Comment *everything*. Explain logic, algorithms, function purposes, and complex sections thoroughly. This enhances the "vibe" for anyone reading or maintaining the code.
*   **Error Handling:** Implement `try/catch` blocks for asynchronous operations and potential failures. The `window.addEventListener('load', ...)` callback should be `async` and `await` any initialization functions. Provide user-friendly error messages through custom UI elements, not native `alert()`.
*   **Safe DOM Manipulation:** Avoid destructive operations like `document.body.innerHTML = ''`. Instead, target specific elements for removal or modification (e.g., `element.remove()`).
*   **Modularity:** Break down complex logic into smaller, reusable functions or components.

### HTML & CSS (Tailwind Emphasis)

*   **Tailwind CSS ONLY for Styling:** Unless explicitly creating a game where custom CSS is encouraged for visual flair, use **only** Tailwind CSS classes for all styling.
*   **Load Tailwind CDN:** Always include `<script src="https://cdn.tailwindcss.com"></script>` in the `<head>`.
*   **Font:** Default to "Inter" unless specified otherwise.
*   **Rounded Corners:** Apply `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-full` to all appropriate elements (buttons, cards, input fields, containers).
*   **Responsive Units:** **Never use fixed pixel widths** for layout elements. Strongly prefer relative units (`%`, `vw`) or Tailwind's responsive classes (`w-full`, `md:w-1/2`).
*   **Full Responsiveness:** Utilize Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to ensure layouts, spacing, and typography adapt perfectly across all screen sizes and orientations. Avoid horizontal scrolling.
*   **Image Fallbacks:** For `<img>` tags, always include an `onerror` attribute with a `placehold.co` fallback.
*   **Content Richness:** Populate web pages with detailed and meaningful mock content to demonstrate functionality and aesthetics.

### User Feedback & Responsiveness

*   **Loading Indicators:** Implement clear loading states (e.g., spinners, skeleton screens) for asynchronous operations, especially API calls or image generation.
*   **Custom Modals/Messages:** For user confirmations or alerts, create custom, styled UI elements instead of `alert()` or `confirm()`.
*   **Smooth Input Updates:** Ensure UI elements update smoothly and immediately in response to user input.

### Avoiding Disruptive Elements

*   **No `alert()` or `confirm()`:** These native browser dialogs are disruptive and break the "vibe."
*   **No `console.log` for user-facing messages:** Use the `showMessage` utility for user feedback. `console.error` and `console.warn` are acceptable for developer debugging.

### PDF Generation Logic
*   **Multi-Page Content:** Card content must correctly flow onto subsequent pages if it is too long to fit on a single page. Text should not be cut off at the bottom of a page.
*   **Folded Card Page Count:** When generating a PDF for a folded card:
    1.  Render all content pages first.
    2.  The back image of the card must be on the final page of the document.
    3.  The total number of pages in the document (content pages + back image page + any blank pages) must be an even number.
    4.  If the number of content pages plus the back page would result in an odd total, a single blank page must be inserted just before the final back image page to make the total count even.
