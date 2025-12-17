# Planning Guide

A dynasty fantasy sports trade calculator that allows users to upload custom player valuations via Excel spreadsheet and evaluate multi-player trades using NB10 metrics and Value Scores.

**Experience Qualities**: 
1. **Analytical** - Provides clear numerical comparisons that help users make data-driven trade decisions
2. **Efficient** - Streamlines the trade evaluation process with drag-and-drop player selection and instant calculations
3. **Trustworthy** - Displays transparent metrics (NB10, Value Score) so users understand exactly how trades are being valued

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with file upload, data parsing, player search/selection, and trade calculation features. It maintains state for uploaded data and current trade scenarios but doesn't require complex workflows or multiple views.

## Essential Features

### Excel Upload & Data Parsing
- **Functionality**: Accepts Excel files (.xlsx, .xls) containing player data with columns for player names, NB10 metric, PPG values, and Value Score
- **Purpose**: Allows users to use their own custom valuations rather than hardcoded data
- **Trigger**: User clicks upload button or drags file into drop zone
- **Progression**: Select file → Parse spreadsheet → Validate required columns → Store player data → Display success message
- **Success criteria**: All players with valid NB10 and Value Score data are available for selection in trade interface

### Player Search & Selection
- **Functionality**: Search/filter through uploaded players and add them to either side of a trade
- **Purpose**: Build multi-player trade scenarios by assigning players to Team A or Team B
- **Trigger**: User types in search field or clicks on player from list
- **Progression**: Type player name → See filtered results → Click to add to Team A or Team B → Player appears in respective trade column with NB10 and Value Score displayed
- **Success criteria**: Users can quickly find and assign players to either side of the trade with visible metrics

### Trade Value Calculation
- **Functionality**: Automatically calculates and compares total Value Scores for both sides of the trade
- **Purpose**: Shows which side is "winning" the trade based on the uploaded valuations
- **Trigger**: Players are added or removed from either trade side
- **Progression**: Player added to team → Value Score totals recalculate → Difference highlighted → Visual indicator shows which team gets better value
- **Success criteria**: Trade calculations update instantly and clearly show which side has the advantage and by how much

### Trade State Management
- **Functionality**: Clear current trade and start fresh evaluation
- **Purpose**: Allows users to evaluate multiple different trade scenarios
- **Trigger**: User clicks "Clear Trade" button
- **Progression**: Click clear → Confirmation if needed → All players removed from both sides → Totals reset to zero
- **Success criteria**: Trade interface resets cleanly while preserving uploaded player data

## Edge Case Handling

- **Missing or Invalid File**: Display helpful error message explaining required spreadsheet format with column examples
- **Missing Required Columns**: Identify which specific columns (NB10, Value Score) are missing and guide user to fix the file
- **Duplicate Players**: Handle by keeping all instances or using the first occurrence, showing count of players loaded
- **Invalid Number Values**: Skip rows with non-numeric NB10 or Value Score values, log count of skipped rows
- **Empty Spreadsheet**: Display message prompting user to upload a valid file with player data
- **Large Files**: Show loading indicator during parsing, handle files with hundreds/thousands of players efficiently

## Design Direction

The design should evoke confidence and clarity - like a professional sports analytics dashboard. It should feel precise, data-driven, and purposeful with a modern sports tech aesthetic. Users should feel like they're using a serious tool that gives them an analytical edge.

## Color Selection

A bold sports analytics theme with deep navy as the foundation and electric blue accents for data highlights.

- **Primary Color**: Deep Navy (oklch(0.25 0.05 250)) - Communicates professionalism and analytical depth, reminiscent of premium sports platforms
- **Secondary Colors**: 
  - Slate Gray (oklch(0.35 0.02 250)) - For secondary actions and supporting UI elements
  - Cool Gray (oklch(0.92 0.01 250)) - For backgrounds and subtle containers
- **Accent Color**: Electric Blue (oklch(0.65 0.18 245)) - High-energy highlight for CTAs, active states, and data emphasis
- **Foreground/Background Pairings**: 
  - Primary Navy (oklch(0.25 0.05 250)): White text (oklch(0.99 0 0)) - Ratio 11.2:1 ✓
  - Accent Blue (oklch(0.65 0.18 245)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Background Cool Gray (oklch(0.92 0.01 250)): Deep Navy text (oklch(0.25 0.05 250)) - Ratio 9.8:1 ✓
  - Success Green (oklch(0.60 0.15 145)): White text (oklch(0.99 0 0)) - Ratio 4.7:1 ✓
  - Warning Red (oklch(0.60 0.20 25)): White text (oklch(0.99 0 0)) - Ratio 4.6:1 ✓

## Font Selection

Typography should feel technical and precise while remaining highly readable - like reading statistical reports from a professional analytics firm.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Space Grotesk Bold/32px/tight tracking (-0.02em)
  - H2 (Section Headers): Space Grotesk Semibold/20px/tight tracking (-0.01em)
  - H3 (Card Titles): Space Grotesk Medium/16px/normal tracking
  - Body (UI Labels): Inter Regular/14px/relaxed leading (1.6)
  - Data Values (Metrics): JetBrains Mono Medium/14px/normal tracking - for NB10 and Value Score displays
  - Small (Helper Text): Inter Regular/12px/relaxed leading (1.5)

## Animations

Animations should enhance the feeling of precision and responsiveness - data should snap into place with confidence, and state changes should feel immediate. Use subtle spring physics for player additions/removals, smooth number count-ups when values change, and gentle color transitions to highlight which team is ahead. Avoid distracting motion; every animation should reinforce the analytical nature of the tool.

## Component Selection

- **Components**: 
  - Card: For trade sides (Team A/B) and summary sections with subtle shadows
  - Input: For player search with clear focus states
  - Button: Primary (upload, add player) with solid fills; Secondary (clear trade) with outline style
  - Badge: Display player metrics (NB10, Value Score) with monospace font
  - Alert: Show upload errors or validation messages with appropriate severity colors
  - Separator: Divide trade sides visually
  - ScrollArea: Handle long player lists in search results
  
- **Customizations**: 
  - Custom file upload zone with dashed border and icon using native input
  - Custom player card component showing name + metrics in compact format
  - Custom trade summary display with large value comparison and visual indicator of which side wins
  - Remove button on player cards with icon only (trash/X)
  
- **States**: 
  - Buttons: Hover shows slight scale (1.02) and brightness increase; active shows slight depression; disabled shows 50% opacity
  - Inputs: Focus shows electric blue ring; filled shows subtle background change
  - Player cards: Hover shows elevated shadow; selected/added shows checkmark or removal state
  - File upload zone: Drag-over shows background color shift and border color change to accent
  
- **Icon Selection**: 
  - Upload: UploadSimple (Phosphor)
  - Remove player: X or Trash (Phosphor)
  - Search: MagnifyingGlass (Phosphor)
  - Success: CheckCircle (Phosphor)
  - Warning/Error: Warning or WarningCircle (Phosphor)
  - Trade balance: Scales or TrendUp/TrendDown (Phosphor)
  
- **Spacing**: 
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Stack spacing: gap-4 (16px) for major sections, gap-2 (8px) for related items
  - Player list: gap-2 (8px) between items
  
- **Mobile**: 
  - Stack trade sides vertically instead of side-by-side
  - Upload zone expands to full width
  - Player cards remain horizontal but with responsive text sizing
  - Summary bar sticks to bottom on mobile for constant visibility
  - Search bar full width on mobile
