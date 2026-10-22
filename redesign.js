
(function () {
  "use strict";

  var css = `
    :root {
      --zc-green: #18794e;
      --zc-deep: #105c3a;
      --zc-light: #e8f6ed;
      --zc-mint: #f2faf4;
      --zc-ink: #19352a;
      --zc-muted: #6c8075;
      --zc-border: #dfece3;
      --zc-white: #ffffff;
      --zc-shadow: 0 18px 55px rgba(22, 75, 48, .09);
    }

    body {
      background: #f5faf6 !important;
      color: var(--zc-ink);
      font-family: Inter, "Segoe UI", Arial, sans-serif;
    }

    #root {
      min-height: 100vh;
    }

    #root .top {
      background: rgba(255,255,255,.96);
      border-bottom: 1px solid var(--zc-border);
      box-shadow: 0 3px 20px rgba(20,70,42,.035);
      position: relative;
      z-index: 10;
    }

    #root .topbar {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    #root .brand {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      color: var(--zc-deep);
      font-size: 25px;
      font-weight: 850;
      letter-spacing: -1px;
      text-decoration: none;
    }

    #root .brand::before {
      content: "Z";
      display: grid;
      place-items: center;
      width: 39px;
      height: 39px;
      border-radius: 13px;
      background: linear-gradient(145deg, #269b61, #12633e);
      color: white;
      font-size: 22px;
      box-shadow: 0 6px 15px #18794e30;
    }

    #root .top-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 12px;
    }

    #root .top-actions > a {
      color: var(--zc-green);
      text-decoration: none;
      font-weight: 700;
      padding: 10px 15px;
      border-radius: 12px;
    }

    #root .top-actions > a:last-child {
      background: var(--zc-green);
      color: white;
    }

    #root .meta {
      color: var(--zc-muted);
      line-height: 1.6;
    }

    #root .btn {
      border: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, #218653, #12633e);
      color: white;
      padding: 11px 17px;
      font-weight: 750;
      cursor: pointer;
      transition: transform .18s ease, box-shadow .18s ease;
      box-shadow: 0 5px 13px rgba(24,121,78,.12);
    }

    #root .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 18px rgba(24,121,78,.18);
    }

    #root .btn.alt {
      background: white;
      color: var(--zc-green);
      border: 1px solid #cfe4d5;
      box-shadow: none;
    }

    #root .btn.warn {
      background: #fff1e9;
      color: #a84422;
      border: 1px solid #f4d4c4;
      box-shadow: none;
    }

    #root input,
    #root select,
    #root textarea {
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      border: 1px solid #d7e5da;
      border-radius: 11px;
      background: #fbfefb;
      padding: 11px 13px;
      color: var(--zc-ink);
      font: inherit;
      outline: none;
      transition: border-color .18s ease, box-shadow .18s ease;
    }

    #root input:focus,
    #root select:focus,
    #root textarea:focus {
      border-color: #43a66d;
      box-shadow: 0 0 0 4px rgba(49,155,91,.11);
      background: white;
    }

    #root label {
      display: block;
      margin: 13px 0 7px;
      color: #355644;
      font-size: 13px;
      font-weight: 750;
    }

    /* Login and signup layouts */

    #root .auth-main {
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 32px 24px 48px;
      box-sizing: border-box;
    }

    #root .auth-page {
      width: min(1120px, 100%);
      min-height: 610px;
      margin: 10px auto;
      display: grid;
      grid-template-columns: 1fr .92fr;
      overflow: hidden;
      border: 1px solid var(--zc-border);
      border-radius: 30px;
      background: white;
      box-shadow: var(--zc-shadow);
    }

    #root .auth-story {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      overflow: hidden;
      padding: 44px;
      color: white;
      background:
        radial-gradient(ellipse at 90% 5%, rgba(191,255,203,.34), transparent 34%),
        radial-gradient(ellipse at 5% 90%, rgba(94,209,135,.22), transparent 34%),
        linear-gradient(145deg, #176d45 0%, #105b39 55%, #0b4c31 100%);
    }

    #root .auth-story::before,
    #root .auth-story::after {
      content: "";
      position: absolute;
      z-index: -1;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 50%;
      pointer-events: none;
    }

    #root .auth-story::before {
      width: 370px;
      height: 370px;
      right: -155px;
      top: 110px;
    }

    #root .auth-story::after {
      width: 270px;
      height: 270px;
      right: -105px;
      top: 160px;
    }

    #root .auth-kicker {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: #d5f6df;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 1.8px;
    }

    #root .auth-kicker span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #a6f1b8;
      box-shadow: 0 0 0 5px rgba(166,241,184,.12);
    }

    #root .auth-story-copy {
      position: relative;
      z-index: 1;
      margin-top: 34px;
    }

    #root .auth-story-copy h1 {
      max-width: 440px;
      margin: 0;
      color: white;
      font-size: clamp(37px, 4vw, 55px);
      line-height: 1.08;
      letter-spacing: -2px;
    }

    #root .auth-story-copy p {
      max-width: 350px;
      margin: 18px 0 0;
      color: #d6eee0;
      font-size: 15px;
      line-height: 1.8;
    }

    #root .auth-art {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 205px;
      margin: 10px 0;
    }

    #root .auth-food-orbit {
      display: grid;
      place-items: center;
      width: 166px;
      height: 166px;
      border: 1px solid rgba(255,255,255,.32);
      border-radius: 50%;
      background: rgba(255,255,255,.09);
      box-shadow: 0 0 0 17px rgba(255,255,255,.035),
                  0 0 0 35px rgba(255,255,255,.025);
      font-size: 78px;
      animation: zc-float 4s ease-in-out infinite;
    }

    #root .auth-art-card {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 15px;
      background: rgba(255,255,255,.96);
      color: #244e35;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 12px 30px rgba(0,0,0,.12);
    }

    #root .auth-art-card small {
      display: block;
      margin-top: 3px;
      color: #738678;
      font-size: 10px;
      font-weight: 500;
    }

    #root .auth-art-card.one {
      left: 0;
      top: 22px;
    }

    #root .auth-art-card.two {
      right: 0;
      bottom: 12px;
    }

    #root .auth-story-foot {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #d3ecdc;
      font-size: 12px;
    }

    #root .auth-story-foot .foot-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9beab0;
    }

    #root .auth-side {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 38px;
      min-width: 0;
      background: linear-gradient(180deg, #fff, #fcfefc);
    }

    #root .auth-card {
      width: 100%;
      max-width: 390px;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }

    #root .auth-card-wide {
      max-width: 540px;
    }

    #root .auth-mark {
      display: grid;
      place-items: center;
      width: 47px;
      height: 47px;
      margin-bottom: 23px;
      border-radius: 15px;
      background: var(--zc-light);
      color: var(--zc-green);
      font-size: 23px;
      font-weight: 900;
    }

    #root .auth-eyebrow {
      margin: 0 0 9px;
      color: var(--zc-green);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 1.7px;
    }

    #root .auth-title {
      margin: 0;
      color: #183c29;
      font-size: 33px;
      font-weight: 850;
      letter-spacing: -1.2px;
    }

    #root .auth-subtitle {
      margin: 9px 0 23px;
      color: var(--zc-muted);
      font-size: 13px;
    }

    #root .auth-card .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    #root .auth-card .auth-submit {
      width: 100%;
      min-height: 49px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      padding: 13px 17px;
    }

    #root .auth-card .auth-switch {
      margin: 21px 0 0;
      color: var(--zc-muted);
      font-size: 13px;
      text-align: center;
    }

    #root .auth-switch a {
      color: var(--zc-green);
      font-weight: 800;
      text-decoration: none;
    }

    #root .auth-card .grid2 {
      gap: 7px 18px;
    }

    #root .auth-card .meta[data-geo] {
      font-size: 11px;
    }

    #root .auth-card .err {
      color: #bd3e31;
      font-size: 13px;
      font-weight: 650;
    }

    #root .auth-card .coord {
      display: flex;
      align-items: stretch;
      gap: 7px;
    }

    #root .auth-card .coord input {
      min-width: 0;
    }

    #root .auth-card .coord .btn {
      flex-shrink: 0;
    }

    /* Dashboard layout */

    #root .app-layout {
      display: grid;
      grid-template-columns: 245px minmax(0, 1fr);
      gap: 26px;
      align-items: start;
      width: min(1440px, calc(100% - 48px));
      margin: 28px auto 54px;
    }

    #root .sidebar {
      position: sticky;
      top: 22px;
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 550px;
      max-height: calc(100vh - 44px);
      overflow-y: auto;
      padding: 22px 15px;
      box-sizing: border-box;
      border: 1px solid #d6e9dc;
      border-radius: 23px;
      background:
        radial-gradient(ellipse at 0% 0%, #e1f5e7 0, transparent 45%),
        linear-gradient(180deg, #ffffff 0%, #f5fbf6 100%);
      box-shadow: 0 14px 35px rgba(26,82,47,.07);
    }

    #root .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 7px 22px;
      border-bottom: 1px solid var(--zc-border);
    }

    #root .sidebar-brand-mark {
      display: grid;
      place-items: center;
      width: 41px;
      height: 41px;
      flex-shrink: 0;
      border-radius: 14px;
      background: linear-gradient(145deg, #279a60, #12633e);
      color: white;
      font-size: 21px;
      font-weight: 900;
      box-shadow: 0 6px 13px #18794e25;
    }

    #root .sidebar-brand strong,
    #root .sidebar-brand small {
      display: block;
    }

    #root .sidebar-brand strong {
      color: #174a30;
      font-size: 15px;
      font-weight: 850;
    }

    #root .sidebar-brand small {
      margin-top: 4px;
      color: #819287;
      font-size: 10px;
    }

    #root .sidebar-home {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-top: 20px;
      padding: 12px 13px;
      border: 1px solid #cde6d5;
      border-radius: 13px;
      background: #e8f6ed;
      color: #17663e;
      font-size: 13px;
      font-weight: 800;
      text-decoration: none;
    }

    #root .sidebar-home::before {
      content: "⌂";
      font-size: 20px;
      line-height: 1;
    }

    #root .sidebar-label {
      margin: 24px 12px 9px;
      color: #8a9d90;
      font-size: 10px;
      font-weight: 850;
      letter-spacing: 1.5px;
    }

    #root .sidebar-role {
      align-self: flex-start;
      margin: 0 10px 9px;
      padding: 6px 10px;
      border: 1px solid #cde8d5;
      border-radius: 100px;
      background: #f0faf3;
      color: #267448;
      font-size: 11px;
      font-weight: 800;
    }

    #root .dash-nav {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 4px;
    }

    #root .dash-nav a {
      display: flex;
      align-items: center;
      gap: 11px;
      min-height: 43px;
      box-sizing: border-box;
      padding: 11px 12px;
      border: 1px solid transparent;
      border-radius: 12px;
      color: #526c5c;
      font-size: 13px;
      font-weight: 650;
      text-decoration: none;
      transition: background .18s ease, color .18s ease;
    }

    #root .dash-nav a::before {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #edf6ef;
      color: #398358;
      font-size: 13px;
    }

    #root .dash-nav a[href*="overview"]::before { content: "⌂"; }
    #root .dash-nav a[href*="post"]::before { content: "+"; }
    #root .dash-nav a[href*="listings"]::before { content: "▤"; }
    #root .dash-nav a[href*="browse"]::before { content: "⌕"; }
    #root .dash-nav a[href*="claims"]::before { content: "✓"; }
    #root .dash-nav a[href*="jobs"]::before { content: "↗"; }
    #root .dash-nav a[href*="active"]::before { content: "➜"; }
    #root .dash-nav a[href*="completed"]::before { content: "✓"; }
    #root .dash-nav a[href*="accounts"]::before { content: "♙"; }

    #root .dash-nav a:hover {
      background: #edf7ef;
      color: #14643b;
    }

    #root .dash-nav a.active {
      border-color: #cde6d5;
      background: #dff3e5;
      color: #125c37;
      font-weight: 850;
    }

    #root .dash-nav a.active::before {
      background: #18794e;
      color: white;
    }

    #root .sidebar-bottom {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: auto;
      padding: 15px 10px 4px;
    }

    #root .sidebar-bottom-icon {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      border-radius: 12px;
      background: #e0f4e6;
      color: #21804b;
      font-size: 19px;
    }

    #root .sidebar-bottom strong,
    #root .sidebar-bottom small {
      display: block;
    }

    #root .sidebar-bottom strong {
      color: #315c40;
      font-size: 12px;
    }

    #root .sidebar-bottom small {
      margin-top: 4px;
      color: #82958a;
      font-size: 10px;
    }

    #root .app-main {
      width: 100%;
      max-width: none;
      min-width: 0;
      margin: 0;
      padding: 8px 0;
    }

    #root .app-main > h1 {
      margin: 0 0 23px;
      color: #1b442e;
      font-size: clamp(27px, 3vw, 36px);
      font-weight: 850;
      letter-spacing: -1.2px;
    }

    #root .dash-section {
      margin: 0 0 23px;
      padding: 24px;
      border: 1px solid #e1ece4;
      border-radius: 22px;
      background: white;
      box-shadow: 0 8px 28px rgba(30,75,44,.045);
    }

    #root .section-title {
      margin: 0 0 18px;
      color: #254b34;
      font-size: 20px;
      font-weight: 800;
    }

    #root .strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
      gap: 13px;
      margin: 19px 0;
    }

    #root .strip > div {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 95px;
      padding: 17px;
      border: 1px solid #dceee1;
      border-radius: 17px;
      background: linear-gradient(145deg, #f6fcf7, #edf8f0);
    }

    #root .strip span {
      color: #6c8373;
      font-size: 12px;
      font-weight: 650;
    }

    #root .strip b {
      color: #176b40;
      font-size: 29px;
      font-weight: 850;
    }

    #root .panel,
    #root .card {
      padding: 22px;
      border: 1px solid #deebe1;
      border-radius: 18px;
      background: white;
      box-shadow: 0 6px 22px rgba(29,73,43,.04);
    }

    #root .card {
      margin: 16px 0;
    }

    #root .card h3 {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      color: #254c35;
      font-size: 18px;
    }

    #root .tag {
      display: inline-flex;
      align-items: center;
      padding: 5px 9px;
      border-radius: 100px;
      background: #e8f6ed;
      color: #18794e;
      font-size: 11px;
      font-weight: 800;
    }

    #root .tag.ok {
      background: #e5f7ed;
      color: #167548;
    }

    #root .tag.bad {
      background: #fff0e9;
      color: #a64728;
    }

    #root .facts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 2px 16px;
      margin: 14px 0;
    }

    #root .facts .meta {
      overflow-wrap: anywhere;
    }

    #root .track {
      padding-left: 0;
    }

    #root .toolbar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 15px;
      margin-bottom: 18px;
      padding: 18px;
      border: 1px solid #e0eee3;
      border-radius: 16px;
      background: #f7fcf8;
    }

    #root .route {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 12px;
      margin: 15px 0;
    }

    #root .route > div {
      padding: 13px;
      border: 1px solid #e0eee3;
      border-radius: 12px;
      background: #f7fbf8;
      overflow-wrap: anywhere;
    }

    #root .route span {
      display: block;
      margin-bottom: 6px;
      color: #75897b;
      font-size: 11px;
      font-weight: 750;
    }

    #root .table-wrap {
      max-width: 100%;
      overflow-x: auto;
      border: 1px solid #e1ece4;
      border-radius: 13px;
    }

    #root table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    #root th {
      background: #f0f8f2;
      color: #42644d;
      font-size: 12px;
      text-align: left;
    }

    #root th,
    #root td {
      padding: 13px;
      border-bottom: 1px solid #e7efe9;
    }

    #root td {
      font-size: 13px;
    }

    #root .notes {
      position: absolute;
      top: 70px;
      right: 22px;
      z-index: 30;
      width: min(400px, calc(100vw - 30px));
      max-height: 70vh;
      overflow: auto;
      border: 1px solid #d9e9dd;
      border-radius: 18px;
      background: white;
      box-shadow: 0 20px 55px rgba(20,60,35,.17);
    }

    #root footer {
      margin-top: 30px;
      padding: 22px 0;
      border-top: 1px solid #e0ebe3;
      background: white;
      color: #718477;
      font-size: 12px;
    }

    #root footer .wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    #root footer a {
      color: #397c53;
      text-decoration: none;
    }

    #root .doc {
      max-width: 900px;
      margin: 30px auto;
      padding: 32px;
      border: 1px solid #e0ebe3;
      border-radius: 20px;
      background: white;
      box-shadow: var(--zc-shadow);
    }

    @keyframes zc-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @media (max-width: 850px) {
      #root .auth-page {
        grid-template-columns: 1fr;
      }

      #root .auth-story {
        min-height: 350px;
        padding: 28px;
      }

      #root .auth-story-copy {
        margin-top: 25px;
      }

      #root .auth-story-copy h1 {
        font-size: 39px;
      }

      #root .auth-art {
        min-height: 150px;
      }

      #root .auth-food-orbit {
        width: 115px;
        height: 115px;
        font-size: 57px;
      }

      #root .auth-art-card.one {
        left: 1%;
        top: 0;
      }

      #root .auth-art-card.two {
        right: 1%;
        bottom: 0;
      }

      #root .app-layout {
        grid-template-columns: 1fr;
        gap: 18px;
        width: calc(100% - 30px);
        margin-top: 18px;
      }

      #root .sidebar {
        position: relative;
        top: auto;
        min-height: 0;
        max-height: none;
        padding: 14px;
      }

      #root .sidebar-brand {
        padding-bottom: 13px;
      }

      #root .sidebar-home {
        margin-top: 12px;
      }

      #root .sidebar-label {
        margin-top: 16px;
      }

      #root .dash-nav {
        flex-direction: row;
        flex-wrap: wrap;
      }

      #root .dash-nav a {
        flex: 1 1 145px;
      }

      #root .sidebar-bottom {
        margin-top: 18px;
        border-top: 1px solid var(--zc-border);
        padding-top: 13px;
      }

      #root .app-main {
        padding-top: 0;
      }
    }

    @media (max-width: 520px) {
      #root .topbar {
        align-items: flex-start;
        flex-direction: column;
        padding-top: 14px;
        padding-bottom: 14px;
      }

      #root .top-actions {
        justify-content: flex-start;
      }

      #root .auth-main {
        padding: 12px;
      }

      #root .auth-page {
        border-radius: 20px;
      }

      #root .auth-story {
        min-height: 310px;
        padding: 23px;
      }

      #root .auth-story-copy h1 {
        font-size: 34px;
      }

      #root .auth-story-copy p {
        font-size: 13px;
      }

      #root .auth-side {
        padding: 28px 21px;
      }

      #root .auth-title {
        font-size: 29px;
      }

      #root .auth-art-card {
        padding: 9px;
        font-size: 10px;
      }

      #root .app-layout {
        width: calc(100% - 22px);
      }

      #root .dash-section {
        padding: 17px;
        border-radius: 17px;
      }

      #root .panel,
      #root .card {
        padding: 16px;
      }

      #root .strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      #root .strip > div {
        min-height: 80px;
        padding: 13px;
      }

      #root .strip b {
        font-size: 25px;
      }

      #root .coord {
        flex-wrap: wrap;
      }

      #root .doc {
        margin: 15px auto;
        padding: 20px;
      }
    }
  `;

  var style = document.createElement("style");
  style.id = "zerocrumb-redesign-styles";
  style.textContent = css;
  document.head.appendChild(style);

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function makeStory(isSignup) {
    var story = el("section", "auth-story");

    var kicker = el("div", "auth-kicker");
    kicker.appendChild(el("span"));
    kicker.appendChild(document.createTextNode("FOOD RESCUE, REIMAGINED"));
    story.appendChild(kicker);

    var copy = el("div", "auth-story-copy");
    var heading = el("h1");
    heading.appendChild(document.createTextNode(
      isSignup ? "Make surplus count." : "Good food."
    ));
    heading.appendChild(document.createElement("br"));
    heading.appendChild(document.createTextNode(
      isSignup ? "Be part of the change." : "Better futures."
    ));
    copy.appendChild(heading);

    var paragraph = el("p", "", isSignup
      ? "Join the community connecting surplus food with people who need it."
      : "A little less waste. A little more good. One food rescue at a time."
    );
    copy.appendChild(paragraph);
    story.appendChild(copy);

    var art = el("div", "auth-art");
    const logo = el("img", "auth-food-orbit");
    logo.src = "assests/logo.png";
    logo.alt = "ZeroCrumb logo";
    art.appendChild(logo);
    var card1 = el("div", "auth-art-card one");
    card1.appendChild(el("span", "", "🥬"));
    var firstText = el("div");
    firstText.appendChild(el("div", "", "Fresh food"));
    firstText.appendChild(el("small", "", "Given a second chance"));
    card1.appendChild(firstText);
    art.appendChild(card1);

    var card2 = el("div", "auth-art-card two");
    card2.appendChild(el("span", "", "💚"));
    var secondText = el("div");
    secondText.appendChild(el("div", "", "Good things grow"));
    secondText.appendChild(el("small", "", "When we share"));
    card2.appendChild(secondText);
    art.appendChild(card2);
    story.appendChild(art);

    var foot = el("div", "auth-story-foot");
    foot.appendChild(el("span", "foot-dot"));
    foot.appendChild(document.createTextNode("Rescue food. Reduce waste. Share hope."));
    story.appendChild(foot);

    return story;
  }

  
function decorateAuth() {
  var root = document.getElementById("root");
  if (!root) return;

  var oldForm = root.querySelector(
    'form[data-form="login"], form[data-form="signup"]'
  );

  if (!oldForm || oldForm.dataset.redesigned === "yes") return;

  var isSignup = oldForm.dataset.form === "signup";
  var oldMain = oldForm.closest("main");
  if (!oldMain) return;

  var page = document.createElement("section");
  page.className = "auth-page " + (isSignup ? "auth-signup" : "auth-login");

  var story = makeStory(isSignup);
  var side = document.createElement("div");
  side.className = "auth-side";

  // Reuse the ORIGINAL form and fields. Do not recreate or move its inputs.
  oldForm.dataset.redesigned = "yes";
  oldForm.classList.add("auth-card");
  if (isSignup) oldForm.classList.add("auth-card-wide");

  var mark = document.createElement("div");
  mark.className = "auth-mark";
  mark.textContent = "Z";
  oldForm.insertBefore(mark, oldForm.firstChild);

  var eyebrow = document.createElement("p");
  eyebrow.className = "auth-eyebrow";
  eyebrow.textContent = isSignup ? "GET STARTED" : "WELCOME BACK";
  mark.after(eyebrow);

  var title = document.createElement("h2");
  title.className = "auth-title";
  title.textContent = isSignup ? "Create account" : "Sign in";
  eyebrow.after(title);

  if (!isSignup) {
    var subtitle = document.createElement("p");
    subtitle.className = "auth-subtitle";
    subtitle.textContent = "Your next food rescue starts here.";
    title.after(subtitle);
  }

  // Remove old headings and unnecessary explanatory paragraphs only.
  oldForm.querySelectorAll("h2").forEach(function (node) {
    if (node !== title) node.remove();
  });

  oldForm.querySelectorAll("p.meta").forEach(function (node) {
    if (!node.hasAttribute("data-geo")) node.remove();
  });

  // Keep all original input fields, error message, and submit handler.
  var oldRow = oldForm.querySelector(".row");
  if (oldRow) {
    var buttons = Array.from(oldRow.querySelectorAll("button[type='submit']"));
    buttons.forEach(function (button) {
      button.classList.add("auth-submit");
    });
  }

  var submit = oldForm.querySelector("button[type='submit']");
  if (submit) {
    submit.classList.add("auth-submit");
    submit.textContent = isSignup ? "Create account  →" : "Sign in  →";
  }

  // Add a simple account-switch link.
  var switchText = document.createElement("p");
  switchText.className = "auth-switch";

  var link = document.createElement("a");
  if (isSignup) {
    switchText.appendChild(document.createTextNode("Already have an account? "));
    link.href = "#/";
    link.textContent = "Sign in";
  } else {
    switchText.appendChild(document.createTextNode("New to ZeroCrumb? "));
    link.href = "#/signup";
    link.textContent = "Create an account";
  }

  switchText.appendChild(link);
  oldForm.appendChild(switchText);

  side.appendChild(oldForm);
  page.appendChild(story);
  page.appendChild(side);

  oldMain.replaceChildren(page);
}

  function decorateSidebar() {
    var sidebar = document.querySelector("#root .sidebar");
    if (!sidebar || sidebar.dataset.redesigned === "yes") return;

    sidebar.dataset.redesigned = "yes";

    var brand = el("div", "sidebar-brand");
    brand.appendChild(el("span", "sidebar-brand-mark", "Z"));

    var words = el("div");
    words.appendChild(el("strong", "", "ZeroCrumb"));
    words.appendChild(el("small", "", "Food rescue workspace"));
    brand.appendChild(words);

    sidebar.insertBefore(brand, sidebar.firstChild);

    var label = el("p", "sidebar-label", "YOUR WORKSPACE");
    var home = sidebar.querySelector(".sidebar-home");
    if (home && home.nextSibling) {
      sidebar.insertBefore(label, home.nextSibling);
    } else {
      sidebar.appendChild(label);
    }

    var bottom = el("div", "sidebar-bottom");
    bottom.appendChild(el("span", "sidebar-bottom-icon", "✦"));

    var bottomText = el("div");
    bottomText.appendChild(el("strong", "", "Rescue more."));
    bottomText.appendChild(el("small", "", "Waste less, together."));
    bottom.appendChild(bottomText);
    sidebar.appendChild(bottom);
  }

  function decorate() {
    decorateAuth();
    decorateSidebar();

    var root = document.getElementById("root");
    if (root) {
      root.querySelectorAll(".doc").forEach(function (doc) {
        if (!doc.closest(".auth-page")) {
          doc.style.maxWidth = "900px";
        }
      });
    }
  }

  function start() {
    decorate();

    var root = document.getElementById("root");
    if (!root) return;

    var observer = new MutationObserver(function () {
      decorate();
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
