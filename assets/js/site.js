// IdeaMarkdown 宣传站 — 交互脚本
// 依赖 config.js 提供的 window.SITE_CONFIG
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || { hasDownload: false, version: "", downloadUrl: "" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 主题切换 --------------------------------------------------------- */
  var STORAGE_KEY = "ideamarkdown-site-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "切换到亮色主题" : "切换到暗色主题");
    });
  }

  function initThemeToggle() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
  }

  /* ---- 导航栏滚动状态 + 移动端菜单 -------------------------------------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---- 滚动揭示动画 ----------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- 代码复制 --------------------------------------------------------- */
  var COPY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  function initCopyButtons() {
    document.querySelectorAll(".code").forEach(function (block) {
      var pre = block.querySelector("pre");
      if (!pre) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.innerHTML = COPY_SVG + "<span>复制</span>";
      btn.setAttribute("aria-label", "复制代码");
      btn.addEventListener("click", function () {
        var text = pre.innerText;
        var done = function () {
          btn.classList.add("copied");
          btn.querySelector("span").textContent = "已复制";
          setTimeout(function () {
            btn.classList.remove("copied");
            btn.querySelector("span").textContent = "复制";
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
        } else {
          fallbackCopy(text, done);
        }
      });
      block.appendChild(btn);
    });
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---- Tab 切换 --------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var tabs = group.querySelectorAll(".tab");
      var panels = group.querySelectorAll(".tab-panel");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", String(on));
          });
          panels.forEach(function (p) {
            p.classList.toggle("active", p.getAttribute("data-panel") === target);
          });
        });
      });
    });
  }

  /* ---- 文档目录滚动高亮 ------------------------------------------------- */
  function initScrollSpy() {
    var links = document.querySelectorAll(".docs-sidebar a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) { map[id] = link; sections.push(sec); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var active = map[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- 下载按钮 / 版本号接线 -------------------------------------------- */
  function initConfigWiring() {
    document.querySelectorAll("[data-version]").forEach(function (el) {
      el.textContent = cfg.version;
    });

    document.querySelectorAll("[data-download]").forEach(function (el) {
      if (cfg.hasDownload) {
        el.setAttribute("href", cfg.downloadUrl);
        el.setAttribute("rel", "noopener");
        el.classList.remove("is-pending");
      } else {
        el.setAttribute("href", "#");
        el.classList.add("is-pending");
        el.setAttribute("title", "安装包即将发布，敬请期待");
        var label = el.querySelector("[data-download-label]");
        if (label) label.textContent = "敬请期待";
        el.addEventListener("click", function (ev) { ev.preventDefault(); });
      }
    });
  }

  /* ---- 导航栏文档模式下拉菜单 ------------------------------------------ */
  var DOCS_MODE_KEY = "ideamarkdown-docs-mode";

  function getDocsMode() {
    var m = "full";
    try { m = localStorage.getItem(DOCS_MODE_KEY) || "full"; } catch (e) {}
    return m;
  }

  function applyDocsMode(mode) {
    document.body.classList.toggle("mode-simplified", mode === "simple");
    try { localStorage.setItem(DOCS_MODE_KEY, mode); } catch (e) {}

    // 更新导航栏主标签文字（.nav-dropdown 的直接子 <a>）
    var navLabel = mode === "simple" ? "简易文档" : "完整文档";
    document.querySelectorAll(".nav-dropdown > a[href='docs.html']").forEach(function (a) {
      a.textContent = navLabel;
    });

    // 下拉菜单："简易文档"项在 simple 模式下变成"完整文档"（实现互切）
    document.querySelectorAll(".nav-dropdown-menu a[data-docs-mode='simple']").forEach(function (a) {
      a.textContent = mode === "simple" ? "完整文档" : "简易文档";
    });

    // 更新下拉菜单中的 active 标记
    document.querySelectorAll(".nav-dropdown-menu a[data-docs-mode]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-docs-mode") === mode);
    });
  }

  function initDocsMode() {
    // 仅在 docs.html 上应用模式
    if (!document.querySelector(".docs")) return;
    applyDocsMode(getDocsMode());
  }

  function initNavDropdown() {
    document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
      var arrow = dd.querySelector(".nav-dropdown-arrow");
      if (!arrow) return;

      arrow.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var wasOpen = dd.classList.contains("open");
        // 关闭所有其它下拉
        document.querySelectorAll(".nav-dropdown.open").forEach(function (d) { d.classList.remove("open"); });
        if (!wasOpen) dd.classList.add("open");
      });

      dd.querySelectorAll(".nav-dropdown-menu a[data-docs-mode]").forEach(function (a) {
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          var mode = a.getAttribute("data-docs-mode");
          applyDocsMode(mode);
          dd.classList.remove("open");
          // 如果不在 docs.html，导航到 docs.html
          if (!document.querySelector(".docs")) {
            window.location.href = "docs.html";
          }
        });
      });
    });

    // 点击页面其它地方关闭下拉
    document.addEventListener("click", function () {
      document.querySelectorAll(".nav-dropdown.open").forEach(function (d) { d.classList.remove("open"); });
    });
  }

  /* ---- 启动 ------------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initThemeToggle();
    initNav();
    initReveal();
    initCopyButtons();
    initTabs();
    initScrollSpy();
    initDocsMode();
    initNavDropdown();
    initConfigWiring();
  });
})();
