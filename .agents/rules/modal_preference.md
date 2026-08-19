# UI Design Preference: Modals / Popups for CRUD Operations

## Core Guideline
For all admin panel modules and future features across the website:
- **Always use overlay Modals / Popups** for Create, Edit, View Details, Status Changes, and Delete Confirmation actions.
- **Do NOT navigate away to complete separate pages** (e.g. avoid separate `/create`, `/new`, or `/:id` pages for forms/details). Keep the user on the main management list page and show interactive popups/modals over the background list.
