(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var phone = document.getElementById("owner-phone");
  if (phone) {
    var raw = (phone.getAttribute("data-phone") || "").trim();
    if (!raw || raw === "YOUR_PHONE") {
      phone.hidden = true;
      phone.removeAttribute("href");
    } else {
      phone.hidden = false;
      phone.setAttribute("href", "tel:" + raw.replace(/[^\d+]/g, ""));
      if (phone.textContent.indexOf("YOUR_PHONE") !== -1) {
        phone.textContent = "Call " + raw;
      }
    }
  }

  var cal = document.getElementById("open-calendar");
  if (cal) {
    var url = (cal.getAttribute("data-booking-url") || "").trim();
    if (url && url !== "BOOKING_URL") {
      cal.hidden = false;
      cal.setAttribute("href", url);
      cal.removeAttribute("hidden");
    } else {
      cal.hidden = true;
      cal.removeAttribute("href");
    }
  }

  var form = document.getElementById("book-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (document.getElementById("name").value || "").trim();
      var shop = (document.getElementById("shop").value || "").trim();
      var town = (document.getElementById("town").value || "").trim();
      var phoneVal = (document.getElementById("phone").value || "").trim();
      var when = (document.getElementById("best-time").value || "").trim();
      var interestEl = document.getElementById("interest");
      var interest = interestEl ? interestEl.value : "assessment";
      var isSavings = interest === "savings";
      var subject = isSavings
        ? "Vendor savings analysis"
        : "Free 20-minute assessment";
      var ask = isSavings
        ? "I would like a free vendor savings analysis (send invoices, see the comparison, opt in per vendor)."
        : "I would like the free 20-minute process assessment.";

      var lines = [
        "Hello,",
        "",
        ask,
        "",
        "Name: " + name,
        "Business: " + shop,
        "Town: " + town,
        "Phone: " + phoneVal,
        "Best time: " + (when || "not specified"),
        "",
        "Thanks."
      ];

      var href =
        "mailto:anthony@rockwallpartners.com" +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      window.location.href = href;
    });
  }

  var printBtn = document.getElementById("print-scorecard");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
