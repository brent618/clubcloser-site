/* Club Closer — site behaviour. Settings live in config.js. */
(function () {
  "use strict";
  var C = window.CC_CONFIG || {};
  var ATTR_KEY = "cc_attribution";

  /* ---------- 1. Attribution: remember where the visitor came from ---------- */
  function getAttribution() {
    var keep = {};
    try {
      var params = new URLSearchParams(window.location.search);
      params.forEach(function (v, k) {
        if (/^(utm_|gclid|gbraid|wbraid|fbclid|ttclid)/i.test(k)) keep[k] = v;
      });
      if (Object.keys(keep).length) {
        localStorage.setItem(ATTR_KEY, JSON.stringify({ q: keep, t: Date.now() }));
      } else {
        var saved = JSON.parse(localStorage.getItem(ATTR_KEY) || "null");
        if (saved && saved.q) keep = saved.q;
      }
    } catch (e) {}
    return keep;
  }
  var attribution = getAttribution();

  function withAttribution(url) {
    var q = Object.assign({}, attribution);
    if (!q.utm_content) q.utm_content = "lp_" + (C.variant || "a");
    q.lp_variant = C.variant || "a";
    var parts = Object.keys(q).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(q[k]);
    });
    return url + (url.indexOf("?") > -1 ? "&" : "?") + parts.join("&");
  }

  function loadScript(src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement("script");
    s.src = src; s.async = true;
    document.head.appendChild(s);
  }

  /* ---------- 2. Booking calendar ---------- */
  var cal = document.getElementById("calendar");
  if (cal && C.calendarUrl) {
    var url = withAttribution(C.calendarUrl);
    cal.innerHTML = "";
    if (C.calendarType === "iclosed") {
      var w = document.createElement("div");
      w.className = "iclosed-widget";
      w.setAttribute("data-url", url);
      w.setAttribute("title", "Club Closer Strategy Call");
      w.style.width = "100%"; w.style.height = "640px";
      cal.appendChild(w);
      loadScript("https://app.iclosed.io/assets/widget.js");
    } else if (C.calendarType === "calendly") {
      var c = document.createElement("div");
      c.className = "calendly-inline-widget";
      c.setAttribute("data-url", url);
      c.style.minWidth = "320px"; c.style.height = "700px";
      cal.appendChild(c);
      loadScript("https://assets.calendly.com/assets/external/widget.js");
    } else {
      var f = document.createElement("iframe");
      f.src = url; f.title = "Book a Club Closer strategy call";
      f.style.width = "100%"; f.style.minHeight = "700px"; f.style.border = "0";
      cal.appendChild(f);
      loadScript("https://link.msgsndr.com/js/form_embed.js");
    }
  }

  /* ---------- 3. Wistia videos ---------- */
  var wistiaNeeded = false;
  function wistiaEmbed(id, opts) {
    wistiaNeeded = true;
    var d = document.createElement("div");
    d.className = "wistia_embed wistia_async_" + id + " playerColor=CBDD66 videoFoam=false " + (opts || "");
    d.style.width = "100%"; d.style.height = "100%";
    return d;
  }
  document.querySelectorAll("[data-video-slot]").forEach(function (box) {
    var id = (C.videos || {})[box.getAttribute("data-video-slot")];
    if (!id) return;
    var autoplay = box.hasAttribute("data-autoplay") ? "autoPlay=true silentAutoPlay=true" : "";
    box.innerHTML = "";
    box.appendChild(wistiaEmbed(id, autoplay));
  });
  document.querySelectorAll("[data-wistia]").forEach(function (box) {
    var id = box.getAttribute("data-wistia");
    if (!id || box.tagName === "BUTTON") return;
    box.innerHTML = "";
    box.appendChild(wistiaEmbed(id));
  });

  /* ---------- 4. Interview pop-up player ---------- */
  var vModal = document.getElementById("video-modal");
  var vPlayer = document.getElementById("video-modal-player");
  var lastFocus = null;
  function openVideo(id) {
    if (!vModal || !id) return;
    lastFocus = document.activeElement;
    vPlayer.innerHTML = "";
    vPlayer.appendChild(wistiaEmbed(id, "autoPlay=true"));
    loadScript("https://fast.wistia.com/assets/external/E-v1.js");
    vModal.hidden = false;
    document.body.style.overflow = "hidden";
    vModal.querySelector(".modal-close").focus();
  }
  function closeModal(m) {
    if (!m) return;
    if (m === vModal) {
      try {
        var api = window.Wistia && window.Wistia.api && window.Wistia.api.all();
        (api || []).forEach(function (v) { if (vPlayer.contains(v.container)) v.remove(); });
      } catch (e) {}
      vPlayer.innerHTML = "";
    }
    m.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll("button[data-wistia]").forEach(function (b) {
    b.addEventListener("click", function () { openVideo(b.getAttribute("data-wistia")); });
  });

  /* ---------- 5. Win wall lightbox + show all ---------- */
  var iModal = document.getElementById("image-modal");
  var iImg = document.getElementById("image-modal-img");
  document.querySelectorAll(".win").forEach(function (w) {
    w.addEventListener("click", function () {
      var img = w.querySelector("img");
      if (!img || !iModal) return;
      lastFocus = w;
      iImg.src = img.src; iImg.alt = img.alt || "Member win";
      iModal.hidden = false;
      document.body.style.overflow = "hidden";
      iModal.querySelector(".modal-close").focus();
    });
  });
  var showAll = document.getElementById("show-all-wins");
  if (showAll) {
    var hidden = document.querySelectorAll(".win.is-hidden");
    if (!hidden.length) showAll.hidden = true;
    showAll.addEventListener("click", function () {
      hidden.forEach(function (w) { w.classList.remove("is-hidden"); });
      showAll.hidden = true;
    });
  }
  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.closest(".modal-close")) closeModal(m);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
  });

  /* ---------- 6. FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var open = q.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-q").forEach(function (o) {
        o.setAttribute("aria-expanded", "false");
        o.querySelector(".faq-sign").textContent = "+";
        document.getElementById(o.getAttribute("aria-controls")).hidden = true;
      });
      if (!open) {
        q.setAttribute("aria-expanded", "true");
        q.querySelector(".faq-sign").textContent = "−";
        document.getElementById(q.getAttribute("aria-controls")).hidden = false;
      }
    });
  });

  /* ---------- 7. Free join form ---------- */
  var form = document.getElementById("join");
  if (form) {
    var msg = document.getElementById("join-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        first_name: form.first_name.value.trim(),
        email: form.email.value.trim(),
        lp_variant: C.variant || "a",
        page: location.pathname
      };
      Object.assign(data, attribution);
      if (!data.email) { msg.textContent = "Please add your email."; return; }
      if (!C.joinFormEndpoint) {
        msg.textContent = "Sign-ups open very soon — book a call above in the meantime.";
        return;
      }
      var btn = form.querySelector("button");
      btn.disabled = true; msg.textContent = "Joining…";
      fetch(C.joinFormEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function () {
        if (window.fbq) window.fbq("track", "Lead");
        if (C.joinRedirect) { location.href = C.joinRedirect; return; }
        msg.textContent = "You're in. Check your inbox for your access details.";
        form.reset();
      }).catch(function () {
        msg.textContent = "Something went wrong — please try again.";
      }).finally(function () { btn.disabled = false; });
    });
  }

  /* ---------- 8. Meta Pixel ---------- */
  if (C.metaPixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", C.metaPixelId);
    window.fbq("track", "PageView");
    if (document.body.hasAttribute("data-booked")) window.fbq("track", "Schedule");
  }

  /* ---------- 9. Scroll reveal + footer year ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });

  if (wistiaNeeded) loadScript("https://fast.wistia.com/assets/external/E-v1.js");
})();
