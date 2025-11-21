# Test Guide - Blog Grid Layout Fix

## Quick Test Checklist

### ✅ Desktop View (1024px+)
1. Open browser di `http://localhost:3000/blog`
2. Set browser width ke ≥1024px (full screen di laptop/desktop)
3. **Expected**: Lihat 4 kolom card (8 card dalam 2 baris)
4. **Example Layout**:
   ```
   [Card 1] [Card 2] [Card 3] [Card 4]
   [Card 5] [Card 6] [Card 7] [Card 8]
   ```

### ✅ Tablet Landscape View (768px-1023px)
1. Resize browser width ke ~800px
2. **Expected**: Lihat 3 kolom card
3. **Example Layout**:
   ```
   [Card 1] [Card 2] [Card 3]
   [Card 4] [Card 5] [Card 6]
   [Card 7] [Card 8]
   ```

### ✅ Tablet Portrait View (640px-767px)
1. Resize browser width ke ~700px
2. **Expected**: Lihat 2 kolom card
3. **Example Layout**:
   ```
   [Card 1] [Card 2]
   [Card 3] [Card 4]
   [Card 5] [Card 6]
   [Card 7] [Card 8]
   ```

### ✅ Mobile View (<640px)
1. Resize browser width ke ~400px
2. **Expected**: Lihat 1-2 kolom card (tergantung width)
3. **Example Layout** (480px-639px):
   ```
   [Card 1] [Card 2]
   [Card 3] [Card 4]
   ...
   ```
4. **Example Layout** (<480px):
   ```
   [Card 1]
   [Card 2]
   [Card 3]
   ...
   ```

## Browser DevTools Testing

### Quick Way to Test All Breakpoints:

1. **Open DevTools**: `F12` atau `Ctrl+Shift+I`
2. **Toggle Device Toolbar**: `Ctrl+Shift+M`
3. **Test Presets**:
   - Desktop: 1920x1080 → Should show 4 columns
   - iPad Pro: 1024x1366 → Should show 4 columns
   - iPad: 768x1024 → Should show 3 columns
   - iPhone 14 Pro Max: 430x932 → Should show 2 columns
   - iPhone SE: 375x667 → Should show 2 columns

## What to Look For

### ✅ Good Signs:
- Cards arranged horizontally in grid
- All cards in same row have equal height
- Proper spacing between cards
- Cards wrap to next row when screen is too narrow
- Smooth transitions when resizing

### ❌ Bad Signs (Still Broken):
- All cards stacked vertically in single column
- Cards have different heights in same row
- Cards overlapping each other
- No spacing between cards
- Layout doesn't change when resizing

## If Still Not Working

### 1. Clear Browser Cache
```bash
Ctrl+Shift+Delete
# Then clear cache and reload
```

### 2. Hard Refresh
```bash
Ctrl+Shift+R  # atau Ctrl+F5
```

### 3. Check DevTools Console
Look for CSS errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Check for any CSS loading errors

### 4. Verify CSS is Loaded
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by CSS
4. Check if `light-mode-components.css` is loaded (status 200)

### 5. Inspect Element
1. Right-click on blog card
2. Select "Inspect" atau "Inspect Element"
3. Check if `.blog-grid` has these styles:
   - `display: grid`
   - `grid-template-columns: repeat(4, 1fr)` (at 1024px+)

## Terminal Commands to Restart Dev Server

If changes not appearing:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev

# Or if using different command:
yarn dev
# atau
pnpm dev
```

## Screenshots Locations

After testing, if you want to verify visually:
1. Desktop view (1024px+): Should show 4x2 grid
2. Tablet view (768px): Should show 3 columns
3. Mobile view (480px): Should show 2 columns

---

**Expected Result**: Blog cards should display in proper grid format, NOT stacked vertically!

**Success Criteria**: At 1024px+ screen width, you should see 8 blog cards arranged in 4 columns × 2 rows.

