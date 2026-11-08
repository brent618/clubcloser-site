/* =========================================================
   CLUB CLOSER — SITE SETTINGS
   This is the only file you need to touch to plug things in.
   Leave a value as "" and the site shows a tidy placeholder.
   ========================================================= */
window.CC_CONFIG = {
  // Which page version this is (for split tests). Every booking is
  // tagged with it, e.g. lp_variant=a. Make a copy of the page as "b" later.
  variant: "a",

  // Booking calendar. calendarType: "iclosed", "ghl" or "calendly".
  // calendarUrl: the event link from that tool, e.g.
  //   iClosed  → https://app.iclosed.io/e/clubcloser/strategy-call
  //   GHL      → https://api.leadconnectorhq.com/widget/booking/XXXX
  //   Calendly → https://calendly.com/clubcloser/strategy-call
  // In the tool itself, set the "after booking" redirect to
  //   https://YOUR-DOMAIN/thank-you
  calendarType: "iclosed",
  calendarUrl: "",

  // Free "Join the club" form. Paste a webhook URL from GoHighLevel,
  // Zapier, Make, Kit/ConvertKit etc. It receives first_name, email and
  // the visitor's UTM tags. joinRedirect is where people go after joining.
  joinFormEndpoint: "",
  joinRedirect: "",

  // Wistia video IDs (the 10-character code in the Wistia link).
  videos: {
    founder: "",   // landing page main video (autoplays muted)
    precall: ""    // thank-you page "watch this first" video
  },

  // Meta (Facebook/Instagram) Pixel ID — leave "" until you have one.
  metaPixelId: ""
};
