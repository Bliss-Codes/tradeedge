# TradeEdge modern UI modernization

This iteration uses the supplied dashboard references as direct visual inspiration.

LIGHT THEME:
- white editorial dashboard surface
- pale green/gray application background
- deep green active navigation
- strong green hero KPI
- rounded white cards with soft shadows
- subtle green data accents
- more spacious KPI hierarchy
- visual grid/sparkline treatment in the hero card
- cleaner controls and form fields

DARK THEME:
- remains a dark trading-terminal system with the same green accent
- refined card depth, borders, hierarchy and navigation

Changed presentation files only:
- src/components/layout/AppShell.tsx
- src/components/layout/ThemeToggle.tsx
- src/app/page.tsx
- src/components/ui/primitives.tsx
- src/app/globals.css
- src/app/layout.tsx

No Supabase files, authentication, state store, database schema, trade/account records,
metrics calculations, CSV logic, or persistence code were changed.
