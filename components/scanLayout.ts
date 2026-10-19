// Layout of the pinned 3D figure's clip buttons, shared by ScanFigure and LandingPage
// (which lines page elements up with the buttons). Kept apart from ScanFigure so
// importing these doesn't pull three.js into the main bundle.

// Band under the figure that holds the row of clip buttons
export const SCAN_STRIP = { desktop: 72, mobile: 56 }
export const SCAN_BUTTON_SIZE = { desktop: 40, mobile: 36 }
// Mobile: the button strip sits this far above the bottom of the screen
export const SCAN_BUTTONS_LIFT_MOBILE = 200
