# Expense Tracker Web App
This is a simple web-based **Income & Expense Tracker** built using HTML,CSS and JS that lets users manage their personal finances. Users can add income and expenses, categorize them, see total balances, visualize expenses via a pie chart, and export/import transaction history.

##  Features

-  Add income and expenses with:
  - Description
  - Amount
  - Type (Income or Expense)
  - Category (Salary, Rent, Groceries, etc.)
  - Date
-  Real-time **Pie Chart** visualization for expense categories.
-  Filter transactions by type (Income / Expense / All).
-  View and edit transaction history.
-  Delete single or all transactions.
-  Persistent data with **LocalStorage**.
-  Export to`.json`and Import from `.json`.

---

##  How to Use

1. **Clone or Download** this repository.
2. Open `index.html` in any modern browser.
3. Start by adding income or expense using the form.
4. View your balance, income, and expense totals.
5. Use the dropdown to filter by category.
6. Use the pie chart to visually understand your spending.
7. Click "Clear All Transactions" to reset.
8. Export your data as a `.json` file or import existing data.

---

##  Code Structure

### `index.html`
- Contains the entire UI layout:
  - Header
  - Balance summary
  - Income/Expense display
  - Transaction form
  - Pie chart section
  - History list
  - Import/export controls

### `style.css`
- Handles styling and layout
- Responsive design via media queries
- Uses Flexbox for layout (especially to place form and chart **side-by-side** on larger screens)
- Colors defined for categories in the pie chart

### `app2.js`
Contains all the logic:
-  Add, edit, delete, and clear transactions
-  Render pie chart using Chart.js
-  Save and load data from LocalStorage
-  Sync UI after every update (`init()` function)
-  Import/export transaction history as JSON
-  Category-color mapping (custom color for “Other” added)

---

## Pie Chart Notes

- Only **Expense** categories are visualized.
- Categories without a known label are grouped as **"Other"** (color: `#e183c5`).
- If a transaction lacks a category, it defaults to **"Other"**.

---

## 🔧 Requirements

- A modern web browser (Chrome, Firefox, Edge)
- No installation required – open `index.html` directly

---
> Created with ❤️ for learning and personal finance management.
