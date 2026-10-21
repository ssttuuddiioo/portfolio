// Layout of the pinned 3D figure's clip buttons, shared by ScanFigure and LandingPage
// (which lines page elements up with the buttons). Kept apart from ScanFigure so
// importing these doesn't pull three.js into the main bundle.

// Band under the figure that holds the row of clip buttons (on desktop, also the base
// size/line the page's bottom-left links and footer dot are laid out on)
export const SCAN_STRIP = { desktop: 72, mobile: 56 }
export const SCAN_BUTTON_SIZE = { desktop: 40, mobile: 36 }
// Mobile: the button strip sits this far above the bottom of the screen (centred under YOPABLO)
export const SCAN_BUTTONS_LIFT_MOBILE = 200
// Desktop: the button row is centred under the last O of the landing YOPABLO wordmark
export const SCAN_ROW_DESKTOP = {
  buttonSize: 64,
  iconSize: 26,
  centerFromBottom: 120, // px from the bottom of the screen to the row's centre line
}
// Desktop landing wordmark: 88px page margins, and its last O's centre as a fraction of the
// wordmark width (measured from the SVG glyph extents)
export const WORDMARK_MARGIN_DESKTOP = 88
export const WORDMARK_LAST_O_CENTER = 0.9165
