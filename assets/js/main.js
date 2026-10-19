/* Expotech redesign — shared behaviour
   Renders the global header/footer, then wires up animations and widgets.
   Pages mark their section with <body data-page="..."> and drop
   <div data-include="header"></div> / <div data-include="footer"></div> placeholders. */
(function () {
  "use strict";
  window.EXP_READY = true;
  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------------- Icon sprite ---------------- */
  var ICONS = {
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    "arrow-up": '<path d="M12 19V5M5 12l7-7 7 7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v2M15 13v2M2 13v3M22 13v3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    "shield-check":
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    refresh:
      '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    layers:
      '<path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    factory:
      '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M17 18h1M12 18h1M7 18h1"/>',
    smartphone:
      '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    chart: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
    message:
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    workflow:
      '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    share:
      '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    target:
      '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    gauge: '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    "zoom-in":
      '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>',
    "zoom-out":
      '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/>',
    maximize:
      '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    award:
      '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    users:
      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    heart:
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    bank: '<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>',
    droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    blocks:
      '<rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/><path d="M13 6.5h4.5a2 2 0 0 1 2 2V11M11 17.5H6.5a2 2 0 0 1-2-2V13"/>',
    alert:
      '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    stop: '<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86z"/><path d="m15 9-6 6M9 9l6 6"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    compass:
      '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
    tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
    power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/>',
    dollar:
      '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    server:
      '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    sparkles:
      '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4"/>',
    trending: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    briefcase:
      '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    truck:
      '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>',
    receipt:
      '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8H8M16 12H8M13 16H8"/>',
    scale:
      '<path d="M12 3v18M5 7l7-4 7 4"/><path d="m2 15 3-8 3 8a3 3 0 0 1-6 0zM16 15l3-8 3 8a3 3 0 0 1-6 0z"/>',
    wrench:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    headset:
      '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  };
  var sprite =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    Object.keys(ICONS)
      .map(function (k) {
        return (
          '<symbol id="i-' +
          k +
          '" viewBox="0 0 24 24">' +
          ICONS[k] +
          "</symbol>"
        );
      })
      .join("") +
    "</svg>";
  document.body.insertAdjacentHTML("afterbegin", sprite);
  function icon(name, cls) {
    return (
      '<svg class="i' +
      (cls ? " " + cls : "") +
      '" aria-hidden="true"><use href="#i-' +
      name +
      '"/></svg>'
    );
  }

  /* ---------------- Global header & footer ---------------- */
  var page = document.body.getAttribute("data-page") || "";
  var NAV = [
    { key: "ai", label: "AI Agents", href: "ai-agent-development.html" },
    {
      key: "aim",
      label: "AIM™ Governance",
      short: "AIM™",
      href: "aim-governance.html",
    },
    { key: "cyber", label: "Cybersecurity", href: "cyber-security.html" },
    {
      key: "services",
      label: "Services",
      mega: true,
      items: [
        {
          label: "AI Agent Development",
          sub: "Custom agents with designed authority",
          href: "ai-agent-development.html",
          icon: "bot",
        },
        {
          label: "RevIT ERP",
          sub: "Blockchain cloud ERP platform",
          href: "revit-erp.html",
          icon: "grid",
        },
        {
          label: "SAP & JDA Implementation",
          sub: "Turnkey delivery and rescue",
          href: "manufacturing.html",
          icon: "factory",
        },
        {
          label: "Data Warehouse",
          sub: "Single version of the truth",
          href: "data-warehouse.html",
          icon: "database",
        },
        {
          label: "Data Analytics",
          sub: "Reports, ETL and BI platform",
          href: "data-analytics.html",
          icon: "chart",
        },
        {
          label: "Mobile Development",
          sub: "PWA, mobile apps, field service",
          href: "mobile-development.html",
          icon: "smartphone",
        },
        {
          label: "Blockchain & UI Development",
          sub: "Ethereum, Hyperledger, React",
          href: "blockchain-ui-development.html",
          icon: "blocks",
        },
        {
          label: "Learning Management Systems",
          sub: "Your own branded learning platform",
          href: "learning-management-system.html",
          icon: "cap",
        },
      ],
    },
    {
      key: "industries",
      label: "Industries",
      items: [
        {
          label: "Manufacturing & Logistics",
          href: "manufacturing.html",
          icon: "factory",
        },
        {
          label: "Healthcare & Telemedicine",
          href: "healthcare-telemedicine.html",
          icon: "heart",
        },
        {
          label: "Banking & Financial Services",
          href: "financial-services.html",
          icon: "bank",
        },
        {
          label: "Utilities & Alternative Energy",
          href: "utilities.html",
          icon: "zap",
        },
        { label: "Oil & Gas", href: "oil-gas.html", icon: "droplet" },
      ],
    },
    {
      key: "about",
      label: "About",
      items: [
        { label: "About Expotech", href: "about.html", icon: "users" },
        { label: "Clients", href: "clients.html", icon: "briefcase" },
        {
          label: "Awards & Certifications",
          href: "awards.html",
          icon: "award",
        },
      ],
    },
    {
      key: "innovation",
      label: "Innovation",
      wide: true,
      items: [
        {
          label: "Books & Publications",
          sub: "The Last Command and previously published books",
          href: "innovation.html#books",
          icon: "book",
        },
        {
          label: "Patents & Inventions",
          sub: "Granted patents, patent numbers, inventors and technologies",
          href: "innovation.html#patents",
          icon: "award",
        },
        {
          label: "Research & White Papers",
          sub: "Technical research, methodologies and executive guides",
          href: "innovation.html#research",
          icon: "file",
        },
        {
          label: "Case Studies",
          sub: "Real enterprise projects and measurable outcomes",
          href: "innovation.html#case-studies",
          icon: "briefcase",
        },
        {
          label: "Articles & News",
          sub: "Technology perspectives, announcements and updates",
          href: "innovation.html#articles",
          icon: "message",
        },
      ],
    },
  ];
  function extAttrs(it) {
    return it.ext
      ? ' target="_blank" rel="noopener" title="Opens the current expotechinc.com page"'
      : "";
  }

  function headerHTML() {
    var items = NAV.map(function (n) {
      var cur = n.key === page ? ' aria-current="page"' : "";
      // Long labels get a short form that CSS swaps in on narrower desktops
      var label = n.short
        ? '<span class="nav__full">' +
          n.label +
          '</span><span class="nav__short" aria-hidden="true">' +
          n.short +
          "</span>"
        : n.label;
      if (!n.items)
        return (
          '<li class="nav__item"><a class="nav__link" href="' +
          n.href +
          '"' +
          (n.short ? ' aria-label="' + n.label + '"' : "") +
          cur +
          ">" +
          label +
          "</a></li>"
        );
      var links = n.items
        .map(function (it) {
          return (
            '<a href="' +
            it.href +
            '"' +
            extAttrs(it) +
            ">" +
            icon(it.icon) +
            "<span>" +
            it.label +
            (it.ext ? ' <span class="ext">↗</span>' : "") +
            (it.sub ? "<small>" + it.sub + "</small>" : "") +
            "</span></a>"
          );
        })
        .join("");
      return (
        '<li class="nav__item"><button class="nav__link" type="button" aria-haspopup="true"' +
        cur +
        ">" +
        n.label +
        icon("chevron-down") +
        "</button>" +
        '<div class="dropdown' +
        (n.mega ? " dropdown--mega" : "") +
        (n.wide ? " dropdown--wide" : "") +
        '">' +
        links +
        "</div></li>"
      );
    }).join("");
    var drawer = NAV.map(function (n, i) {
      var cur = n.key === page ? ' aria-current="page"' : "";
      if (!n.items)
        return (
          '<li><a class="drawer__link" href="' +
          n.href +
          '"' +
          cur +
          ">" +
          n.label +
          icon("chevron-right") +
          "</a></li>"
        );
      return (
        '<li><button class="drawer__toggle" type="button" aria-expanded="false" aria-controls="dsub' +
        i +
        '">' +
        n.label +
        icon("plus") +
        "</button>" +
        '<div class="drawer__sub" id="dsub' +
        i +
        '"><ul>' +
        n.items
          .map(function (it) {
            return (
              '<li><a href="' +
              it.href +
              '"' +
              extAttrs(it) +
              ">" +
              it.label +
              (it.ext ? "&nbsp;↗" : "") +
              "</a></li>"
            );
          })
          .join("") +
        "</ul></div></li>"
      );
    }).join("");
    return (
      '<div class="scroll-progress" aria-hidden="true"><span></span></div>' +
      '<header class="site-header">' +
      '<div class="topbar"><div class="container topbar__inner">' +
      '<div class="topbar__group"><a href="tel:+16238007660">' +
      icon("phone") +
      '(623) 800-7660</a><a href="mailto:Info@expotechinc.com">' +
      icon("mail") +
      'Info@expotechinc.com</a><span class="topbar__hours" style="display:inline-flex;align-items:center;gap:6px">' +
      icon("clock") +
      "Mon–Fri, 9:00 am – 5:30 pm</span></div>" +
      '<div class="topbar__group"><a href="https://www.aimcommandcenter.com/" target="_blank" rel="noopener">AIM Command Center ' +
      icon("arrow-up-right") +
      '</a><a href="contact.html#newsletter">Newsletter</a></div>' +
      "</div></div>" +
      '<div class="navbar"><div class="container navbar__inner">' +
      '<a class="brand" href="index.html" aria-label="Expotech Inc, home"><img src="assets/img/logo.png" alt="" width="89" height="60"><span class="brand__text">EXPOTECH <span>INC</span></span></a>' +
      '<nav class="nav" aria-label="Main"><ul>' +
      items +
      "</ul></nav>" +
      '<a class="btn btn--primary btn--sm nav-cta" href="contact.html">Contact us' +
      icon("arrow-right") +
      "</a>" +
      '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>' +
      "</div></div>" +
      "</header>" +
      '<div class="drawer-overlay" data-drawer-close></div>' +
      '<aside class="drawer" id="drawer" aria-label="Menu">' +
      '<div class="drawer__head"><a class="brand" href="index.html"><img src="assets/img/logo.png" alt="" width="89" height="60" style="height:38px"><span class="brand__text">EXPOTECH <span>INC</span></span></a>' +
      '<button class="drawer__close" type="button" aria-label="Close menu" data-drawer-close>' +
      icon("x") +
      "</button></div>" +
      '<nav aria-label="Mobile"><ul>' +
      drawer +
      "</ul></nav>" +
      '<div class="drawer__foot"><a class="btn btn--primary" href="contact.html">Contact us' +
      icon("arrow-right") +
      "</a>" +
      '<a href="tel:+16238007660">' +
      icon("phone") +
      '(623) 800-7660</a><a href="mailto:Info@expotechinc.com">' +
      icon("mail") +
      "Info@expotechinc.com</a></div>" +
      "</aside>"
    );
  }

  function footerHTML() {
    function col(title, links) {
      return (
        '<div class="footer__col"><span class="footer__title">' +
        title +
        "</span>" +
        links
          .map(function (l) {
            return (
              '<a href="' +
              l[1] +
              '"' +
              (l[2] ? ' target="_blank" rel="noopener"' : "") +
              ">" +
              l[0] +
              (l[2] ? " ↗" : "") +
              "</a>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    return (
      '<footer class="site-footer"><div class="container footer__main">' +
      '<div class="footer__brand"><a class="brand" href="index.html"><span class="brand__text">EXPOTECH <span>INC</span></span></a>' +
      '<p style="color:#e6e6e6;max-width:24em">AI agent development, AIM™ governance and enterprise systems, executed flawlessly and consistently.</p>' +
      '<div class="footer__contact"><span style="display:inline-flex;gap:8px;align-items:flex-start">' +
      icon("pin") +
      "<span>8787 North Scottsdale Road, Suite 150<br>Scottsdale, AZ 85253</span></span>" +
      '<a href="tel:+16238007660">' +
      icon("phone") +
      '(623) 800-7660</a><a href="mailto:Info@expotechinc.com">' +
      icon("mail") +
      "Info@expotechinc.com</a>" +
      '<span style="display:inline-flex;gap:8px;align-items:center">' +
      icon("clock") +
      "Monday – Friday, 9:00 am – 5:30 pm</span></div></div>" +
      col("AI & Security", [
        ["AI Agent Development", "ai-agent-development.html"],
        ["AIM™ AI Governance", "aim-governance.html"],
        ["Cybersecurity", "cyber-security.html"],
        ["AIM Command Center", "https://www.aimcommandcenter.com/", 1],
      ]) +
      col("Services", [
        ["RevIT ERP", "revit-erp.html"],
        ["SAP & JDA", "manufacturing.html"],
        ["Data Warehouse", "data-warehouse.html"],
        ["Data Analytics", "data-analytics.html"],
        ["Learning Management Systems", "learning-management-system.html"],
      ]) +
      col("Company", [
        ["About", "about.html"],
        ["Clients", "clients.html"],
        ["Awards", "awards.html"],
        ["Innovation", "innovation.html"],
        ["Contact", "contact.html"],
      ]) +
      '<div class="footer__col footer__news"><span class="footer__title">Newsletter</span><p>Insights on AI governance, ERP and enterprise systems.</p>' +
      '<form class="subscribe" data-subscribe><label class="sr-only" for="f-news">Email address</label><input class="input" id="f-news" type="email" required placeholder="you@company.com"><button class="btn btn--primary btn--sm" type="submit">Subscribe</button></form></div>' +
      '</div><div class="footer__bottom"><div class="container"><span>© <span data-year></span> Expotech Inc. All rights reserved.</span><span>Business Partners, Not Just Clients</span></div></div></footer>' +
      '<button class="to-top" type="button" aria-label="Back to top"><svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/></svg>' +
      icon("arrow-up") +
      "</button>"
    );
  }

  document.querySelectorAll('[data-include="header"]').forEach(function (el) {
    el.outerHTML = headerHTML();
  });
  document.querySelectorAll('[data-include="footer"]').forEach(function (el) {
    el.outerHTML = footerHTML();
  });
  document.querySelectorAll("[data-icon]").forEach(function (el) {
    el.outerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("class"));
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Header behaviour ---------------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress span");
  var toTop = document.querySelector(".to-top");
  var ring = toTop && toTop.querySelector("circle");
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, y / max) : 0;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (progress) progress.style.transform = "scaleX(" + p + ")";
    if (toTop) {
      toTop.classList.toggle("is-shown", y > 600);
      if (ring) ring.style.strokeDashoffset = String(151 - 151 * p);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop)
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

  var burger = document.querySelector(".burger");
  function setDrawer(open) {
    document.body.classList.toggle("drawer-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (open) {
      var c = document.querySelector(".drawer__close");
      if (c) c.focus();
    } else if (burger) burger.focus();
  }
  if (burger)
    burger.addEventListener("click", function () {
      setDrawer(true);
    });
  document.querySelectorAll("[data-drawer-close]").forEach(function (b) {
    b.addEventListener("click", function () {
      setDrawer(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("drawer-open"))
      setDrawer(false);
  });
  document.querySelectorAll(".drawer__toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      b.setAttribute(
        "aria-expanded",
        String(b.getAttribute("aria-expanded") !== "true"),
      );
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var kind = group.getAttribute("data-stagger") || "up";
    var step = parseInt(group.getAttribute("data-stagger-step") || "90", 10);
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (!child.hasAttribute("data-reveal"))
        child.setAttribute("data-reveal", kind);
      child.style.setProperty("--delay", i * step + "ms");
    });
  });
  // Split headline words for the rising-text effect (keeps inline tags like <strong>)
  document.querySelectorAll(".words").forEach(function (el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
              return;
            }
            var w = document.createElement("span");
            w.className = "w";
            var s = document.createElement("span");
            s.textContent = part;
            s.style.setProperty("--i", n++);
            w.appendChild(s);
            frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") {
          walk(c);
        }
      });
    })(el);
  });
  var revealTargets = document.querySelectorAll(
    "[data-reveal], .words, .steps, .timeline, .htimeline, .mark, [data-count]",
  );
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          if (en.target.hasAttribute("data-count")) countUp(en.target);
          io.unobserve(en.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
    // Safety sweep: anything already above the fold line (e.g. after an anchor jump) is revealed too
    var sweepTimer = null;
    var sweep = function () {
      var limit = window.innerHeight * 0.94;
      revealTargets.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add("is-visible");
          if (el.hasAttribute("data-count")) countUp(el);
          io.unobserve(el);
        }
      });
    };
    window.addEventListener(
      "scroll",
      function () {
        clearTimeout(sweepTimer);
        sweepTimer = setTimeout(sweep, 120);
      },
      { passive: true },
    );
    window.addEventListener("load", sweep);
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
      if (el.hasAttribute("data-count"))
        el.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------------- Counters ---------------- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dur = 1700,
      start = null;
    function tick(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Marquee (duplicate for a seamless loop) ---------------- */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var clone = c.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      if (clone.tagName === "IMG") clone.alt = "";
      track.appendChild(clone);
    });
  });

  /* ---------------- Tabs ---------------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(
      root.querySelectorAll('[role="tab"]'),
    );
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        select(t);
      });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          var nt = tabs[(i + d + tabs.length) % tabs.length];
          select(nt);
          nt.focus();
        }
      });
    });
  });

  /* ---------------- Rotating words (homepage hero) ---------------- */
  document.querySelectorAll("[data-rotator]").forEach(function (root) {
    var items = Array.prototype.slice.call(root.children);
    if (!items.length) return;
    var i = 0;
    items[0].classList.add("is-active");
    if (reduceMotion || items.length < 2) return;
    var ms = parseInt(root.getAttribute("data-interval") || "2600", 10);
    setInterval(function () {
      var cur = items[i];
      cur.classList.remove("is-active");
      cur.classList.add("is-leaving");
      setTimeout(function () {
        cur.classList.remove("is-leaving");
      }, 700);
      i = (i + 1) % items.length;
      items[i].classList.add("is-active");
    }, ms);
  });

  /* ---------------- AIM lifecycle stepper (auto-advances while visible) ---------------- */
  document.querySelectorAll("[data-stepper]").forEach(function (root) {
    var btns = Array.prototype.slice.call(
      root.querySelectorAll(".stepper__btn"),
    );
    var panel = root.querySelector(".stepper__panel");
    var ms = parseInt(root.getAttribute("data-interval") || "5000", 10);
    root.style.setProperty("--step-ms", ms + "ms");
    var idx = 0,
      timer = null,
      inView = false,
      paused = false;
    function show(i, user) {
      idx = (i + btns.length) % btns.length;
      btns.forEach(function (b, k) {
        b.setAttribute("aria-selected", String(k === idx));
        var bar = b.querySelector(".stepper__bar");
        if (bar) {
          bar.style.animation = "none";
          void bar.offsetWidth;
          bar.style.animation = "";
        }
      });
      var b = btns[idx];
      root.querySelector("[data-step-num]").textContent = String(
        idx + 1,
      ).padStart(2, "0");
      root.querySelector("[data-step-name]").textContent =
        b.getAttribute("data-name");
      root.querySelector("[data-step-text]").textContent =
        b.getAttribute("data-text");
      root.querySelector("[data-step-count]").textContent =
        "Stage " + (idx + 1) + " of " + btns.length;
      panel.classList.remove("swap");
      void panel.offsetWidth;
      panel.classList.add("swap");
      if (user) restart();
    }
    function restart() {
      clearInterval(timer);
      if (inView && !paused && !reduceMotion)
        timer = setInterval(function () {
          show(idx + 1);
        }, ms);
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        show(i, true);
      });
    });
    root.addEventListener("mouseenter", function () {
      paused = true;
      root.classList.add("is-paused");
      clearInterval(timer);
    });
    root.addEventListener("mouseleave", function () {
      paused = false;
      root.classList.remove("is-paused");
      show(idx, true);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (en) {
          inView = en[0].isIntersecting;
          if (inView) show(idx, true);
          else clearInterval(timer);
        },
        { threshold: 0.35 },
      ).observe(root);
    }
    show(0);
  });

  /* ---------------- Filters (downloads) ---------------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var items = document.querySelectorAll(
      group.getAttribute("data-filter-group"),
    );
    var label = document.querySelector(
      group.getAttribute("data-filter-count") || "",
    );
    var btns = group.querySelectorAll("[data-filter]");
    function apply(cat) {
      var shown = 0;
      items.forEach(function (it) {
        var on = cat === "all" || it.getAttribute("data-cat") === cat;
        it.classList.toggle("is-hidden", !on);
        if (on) {
          shown++;
          it.style.animation = "none";
          void it.offsetWidth;
          it.style.animation = "swap-in .5s var(--ease) both";
          it.style.animationDelay = shown * 35 + "ms";
        }
      });
      btns.forEach(function (b) {
        b.setAttribute(
          "aria-pressed",
          String(b.getAttribute("data-filter") === cat),
        );
      });
      if (label)
        label.textContent =
          "Showing " + shown + " of " + items.length + " downloads";
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-filter"));
      });
    });
    apply("all");
  });

  /* ---------------- Accordion ---------------- */
  document.querySelectorAll(".accordion__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      b.setAttribute(
        "aria-expanded",
        String(b.getAttribute("aria-expanded") !== "true"),
      );
    });
  });

  /* ---------------- 3D tilt ---------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (wrap) {
      var target = wrap.querySelector("[data-tilt-target]") || wrap;
      var max = parseFloat(wrap.getAttribute("data-tilt") || "6");
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        target.style.transform =
          "rotateY(" +
          (x * max * 2).toFixed(2) +
          "deg) rotateX(" +
          (-y * max * 2).toFixed(2) +
          "deg)";
      });
      wrap.addEventListener("mouseleave", function () {
        target.style.transform = "";
      });
    });
  }

  /* ---------------- Parallax ---------------- */
  var para = Array.prototype.slice.call(
    document.querySelectorAll("[data-parallax]"),
  );
  if (para.length && !reduceMotion) {
    var ticking = false;
    var update = function () {
      para.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var f = parseFloat(el.getAttribute("data-parallax"));
        el.style.translate = "0 " + (-r.top * f).toFixed(1) + "px";
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  /* ---------------- Demo forms ---------------- */
  document.querySelectorAll("[data-demo-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var wrap = f.closest(".form-wrap");
      if (wrap) wrap.classList.add("is-sent");
      var focusEl =
        wrap && wrap.querySelector(".form-success h2, .form-success h3");
      if (focusEl) {
        focusEl.tabIndex = -1;
        focusEl.focus();
      }
    });
  });
  document.querySelectorAll(".form-wrap [data-reset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var w = b.closest(".form-wrap");
      w.classList.remove("is-sent");
      var f = w.querySelector("form");
      if (f) f.reset();
    });
  });
  document.querySelectorAll("[data-subscribe]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = f.querySelector("button");
      var old = btn.textContent;
      btn.textContent = "Subscribed ✓";
      btn.disabled = true;
      f.reset();
      setTimeout(function () {
        btn.textContent = old;
        btn.disabled = false;
      }, 3000);
    });
  });

  /* ---------------- Lightbox with zoom in / out / pan ---------------- */
  var lb = null,
    lbImg,
    lbStage,
    lbZoomLabel,
    lbTitle,
    lastFocus;
  var st = { s: 1, x: 0, y: 0, fit: 1, w: 0, h: 0 };
  function buildLightbox() {
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">' +
        '<div class="lightbox__bar"><span class="lightbox__title"></span><div class="lightbox__tools">' +
        '<button type="button" data-lb="out" aria-label="Zoom out">' +
        icon("zoom-out") +
        "</button>" +
        '<span class="lightbox__zoom" aria-live="polite">100%</span>' +
        '<button type="button" data-lb="in" aria-label="Zoom in">' +
        icon("zoom-in") +
        "</button>" +
        '<button type="button" data-lb="fit" aria-label="Fit to screen">' +
        icon("maximize") +
        "</button>" +
        '<button type="button" data-lb="close" aria-label="Close viewer">' +
        icon("x") +
        "</button>" +
        "</div></div>" +
        '<div class="lightbox__stage"><img alt=""></div>' +
        '<p class="lightbox__help">Scroll or pinch to zoom · drag to move · double-click to zoom · Esc to close</p>' +
        "</div>",
    );
    lb = document.querySelector(".lightbox");
    lbImg = lb.querySelector("img");
    lbStage = lb.querySelector(".lightbox__stage");
    lbZoomLabel = lb.querySelector(".lightbox__zoom");
    lbTitle = lb.querySelector(".lightbox__title");
    lb.querySelector('[data-lb="in"]').addEventListener("click", function () {
      zoomAt(st.s * 1.35);
    });
    lb.querySelector('[data-lb="out"]').addEventListener("click", function () {
      zoomAt(st.s / 1.35);
    });
    lb.querySelector('[data-lb="fit"]').addEventListener("click", fit);
    lb.querySelector('[data-lb="close"]').addEventListener("click", closeLb);
    lbStage.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var r = lbStage.getBoundingClientRect();
        zoomAt(
          st.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15),
          e.clientX - r.left,
          e.clientY - r.top,
        );
      },
      { passive: false },
    );
    lbStage.addEventListener("dblclick", function (e) {
      var r = lbStage.getBoundingClientRect();
      if (st.s > st.fit * 1.05) fit();
      else zoomAt(st.fit * 2.5, e.clientX - r.left, e.clientY - r.top);
    });
    var pts = new Map(),
      drag = null,
      pinch = null;
    lbStage.addEventListener("pointerdown", function (e) {
      lbStage.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) drag = { x: e.clientX - st.x, y: e.clientY - st.y };
      if (pts.size === 2) {
        var p = Array.from(pts.values());
        pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), s: st.s };
      }
      lbStage.classList.add("is-dragging");
    });
    lbStage.addEventListener("pointermove", function (e) {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) {
        var p = Array.from(pts.values()),
          r = lbStage.getBoundingClientRect();
        var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        zoomAt(
          (pinch.s * d) / pinch.d,
          (p[0].x + p[1].x) / 2 - r.left,
          (p[0].y + p[1].y) / 2 - r.top,
        );
      } else if (drag) {
        st.x = e.clientX - drag.x;
        st.y = e.clientY - drag.y;
        apply();
      }
    });
    function end(e) {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (pts.size === 0) {
        drag = null;
        lbStage.classList.remove("is-dragging");
      }
    }
    lbStage.addEventListener("pointerup", end);
    lbStage.addEventListener("pointercancel", end);
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "+" || e.key === "=") zoomAt(st.s * 1.35);
      else if (e.key === "-") zoomAt(st.s / 1.35);
      else if (e.key === "0") fit();
    });
    window.addEventListener("resize", function () {
      if (lb.classList.contains("is-open")) fit();
    });
  }
  function apply() {
    lbImg.style.transform =
      "translate(" + st.x + "px," + st.y + "px) scale(" + st.s + ")";
    lbZoomLabel.textContent = Math.round(st.s * 100) + "%";
  }
  function zoomAt(ns, px, py) {
    var r = lbStage.getBoundingClientRect();
    if (px === undefined) {
      px = r.width / 2;
      py = r.height / 2;
    }
    ns = Math.max(st.fit * 0.5, Math.min(ns, Math.max(4, st.fit * 8)));
    st.x = px - (px - st.x) * (ns / st.s);
    st.y = py - (py - st.y) * (ns / st.s);
    st.s = ns;
    apply();
  }
  function fit() {
    var r = lbStage.getBoundingClientRect();
    st.fit = Math.min((r.width - 32) / st.w, (r.height - 32) / st.h, 1.5);
    st.s = st.fit;
    st.x = (r.width - st.w * st.s) / 2;
    st.y = (r.height - st.h * st.s) / 2;
    apply();
  }
  function openLb(src, title) {
    if (!lb) buildLightbox();
    lastFocus = document.activeElement;
    lbTitle.textContent = title || "";
    lbImg.alt = title || "";
    lbImg.style.left = "0";
    lbImg.style.top = "0";
    lbImg.onload = function () {
      st.w = lbImg.naturalWidth;
      st.h = lbImg.naturalHeight;
      fit();
    };
    lbImg.src = src;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector('[data-lb="close"]').focus();
    if (lbImg.complete && lbImg.naturalWidth) lbImg.onload();
  }
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    var src =
      el.getAttribute("data-lightbox") || (img && img.getAttribute("src"));
    var title = el.getAttribute("data-title") || (img && img.alt) || "";
    if (el.tagName !== "BUTTON" && el.tagName !== "A") {
      el.setAttribute("role", "button");
      el.tabIndex = 0;
    }
    el.setAttribute("aria-label", "Open larger view: " + title);
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openLb(src, title);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLb(src, title);
      }
    });
  });
})();
