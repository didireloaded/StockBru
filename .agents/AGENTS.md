# StockBru Project Rules & Mandates

## MOBILE RESPONSIVE & CROSS-DEVICE IMPLEMENTATION MANDATE

### CORE RESPONSIVE PRINCIPLE
- The same codebase must work seamlessly across all screen sizes. No separate mobile application, layouts, or duplicate pages. One responsive design system.

### TARGET BREAKPOINTS
- Mobile Small: 320px - 375px
- Mobile Large: 376px - 767px
- Tablet: 768px - 1024px
- Laptop: 1025px - 1440px
- Desktop: 1441px+

### RESPONSIVE ACCEPTANCE RULE
A page is NOT complete unless Desktop works, Tablet works, Mobile works, Touch interactions work, Layout remains readable, No horizontal scrolling, No clipped content, No overlapping components, No broken charts/tables, No inaccessible actions.

### MOBILE UX PRINCIPLES
- The user should be able to perform critical inventory tasks using one hand in 3 taps or fewer: Search inventory, Record stock, Open bottle, Record sale, Start/Complete stock take, View product details, View low stock alerts.
- Touch optimization: All mobile interactions must support tap, long press, swipe, scroll, touch gestures. No hover-only functionality.

### LAYOUT SPECIFICS
- **Sidebar**: Desktop (Permanent), Tablet (Collapsible), Mobile (Hidden, Hamburger menu, Slide-out drawer).
- **Dashboard**: Desktop (4-6 KPI cards/row), Tablet (2 KPI cards/row), Mobile (1 KPI card/row). Most important info first (Health, Low Stock, etc.).
- **Inventory Explorer**: Grid view - Desktop (4-6 columns), Tablet (2-3 columns), Mobile (1 column full width).
- **Product Detail Page**: Desktop (Multi-column), Tablet (2-column), Mobile (Single-column vertically stacked).
- **Stock Take**: Large buttons, scan controls, inputs, touch areas. Sticky action buttons. Fast scanning.
- **Tables**: Desktop (Full), Tablet (Condensed), Mobile (Card-based records). Never allow desktop tables to break mobile.
- **Charts**: Resize automatically, preserve tooltips/interactions, no cropped axes or unreadable labels.
- **Forms & Modals**: Responsive widths, large inputs/buttons. Modals: Centered (Desktop), Adaptive (Tablet), Bottom/Full sheet (Mobile).
- **Search**: Global search bar (Desktop), Full-screen instant results (Mobile).

### PERFORMANCE & ASSETS
- Targets: First Load < 3s, Dashboard < 2s, Search < 500ms, Navigation < 200ms. No layout shifts.
- Images: WebP, Lazy Loading, Responsive Sizing, Blur Placeholders.

### TESTING REQUIREMENT
Test 320px, 375px, 768px, 1024px, 1440px before marking any page complete. Verify no overflow, clipping, broken layouts, inaccessible actions, unreadable charts, or unusable tables.
