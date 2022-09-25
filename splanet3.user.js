// ==UserScript==
// @name         イカリング3 PCレイアウト修正 & Cookie自動セット
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  イカリング3をPC向けにレイアウトを修正する & Cookie自動セットするスクリプト
// @author       wolfria
// @match        https://api.lp1.av5ja.srv.nintendo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nintendo.net
// @grant        GM.cookie
// @require      file:///.../s3s/configToObj.js
// @require      file:///.../s3s/config.txt
// @require      file:///.../s3s/semicolon.js
// @run-at       document-start
// ==/UserScript==

const css = `
@media (min-width: 600px) {
  div, a, p, span, button, li {
     font-size: 16px !important;
  }
  [class^="InAppContent_children__"] div, a, p, span, button, li {
     font-size: 18px !important;
  }

  /* サーモンラン */
  [class^="RunItem_roes__"] {
     min-width: 100px;
  }

  /* バトル */
  [class^="VsPlayerResult_ScoreDetail__"] {
     justify-content: center;
     min-width: 110px;
  }

  /* きろく */
  [class^="ClearedStage_weaponImg__"] {
     margin-left: 22px;
  }
  [class^="HeroHistory_circle__"] {
     margin-left: 16px;
  }
  [class^="HeroHistory_siteMapMessage__"] p {
     max-width: 100%;
  }

  /* ナビゲーション */
  [class^="NavigationTab_Wrapper__"] {
    flex-basis: 250px;
  }
  [class^="NavigationTab_TabItem__"] {
    font-size: 16px !important;
  }
  [class^="NavigationTab_TabletTabItemLabel__"] {
    font-size: 20px !important;
  }
  [class^="App_name__"] {
    font-size: 14px !important;
  }
  /* QRコードリーダー */
  [class^="ListItem_eventDate__"] {
    margin-left: -20px;
  }

  /* ゲソタウン */
  [class^="BrandFriendlyGearPower_wrapper__"] {
    min-width: 100%;
  }
  [class^="Gesotown_aboutGesotownText__"] {
    min-width: 100%;
  }
  [class^="MyOutfits_myOutfitItemContent__"] {
    max-width: 500px;
  }
  [class^="ItemInfo_itemInfoMainImage__"] {
    height: 100px;
    width: 100px;
  }
  [class^="ItemInfo_itemInfoMeta__"] {
    gap: 5px;
  }
  [class^="CurrentItems_currentItemsItem__"] {
    gap: 20px;
  }
  [class^="RoundedIcon_wrapper__"] {
    width: 25px !important;
    height: 25px !important;
  }
}

@media (min-width: 900px) {
  /* ホーム */
  [class^="Carousel_container__"] {
    height: 280px;
  }
  [class^="ResponsiveWrapper_Inner__"] {
    max-width: 1000px;
  }
  [class^="Apps_container__"] {
    justify-content: center;
    padding-bottom: 45px;
  }
  [class^="Apps_bigApps__"] {
    min-width: 600px;
    column-gap: 15%;
  }
  [class^="Apps_bigApps__"] a {
    max-width: 10rem;
  }
  [class^="Apps_normalApps__"] {
    grid-template-columns: repeat(5, 6rem);
    column-gap: 5%;
    justify-content: center;
  }
}

/* スクロールバー */
::-webkit-scrollbar {
  width: 10px;
  background: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar-thumb {
  background: var(--color-yellow);
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0);
}
[data-testid="app"]::-webkit-scrollbar {
  width: 0;
  height: 0;
}
`;

(async function () {
  "use strict";

  // set s3s.config.gtoken
  GM.cookie.set({
    name: "_gtoken",
    value: config.gtoken,
    secure: true,
    path: "/",
  });

  let currentPath = location.pathname;
  changeTitle(currentPath);

  waitForElement('[alt="ホーム"]').then((elm) => {
    const favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/svg+xml");
    favicon.href = elm.src;
    document.head.append(favicon);
  });

  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.append(style);

  window.addEventListener("click", (evt) => {
    if (
      (!!evt.srcElement.closest('[class^="NavigationTab_Wrapper__"]') ||
        !!evt.srcElement.closest(
          '[class^="HomeIndicatorSpacer_HomeIndicatorSpacer__"]'
        )) &&
      currentPath !== location.pathname
    ) {
      currentPath = location.pathname;
      changeTitle(currentPath);
    }
  });
})();

function changeTitle(currentPath) {
  let title = "イカリング3";
  if (currentPath.includes("gesotown")) {
    title += " - ゲソタウン";
  } else if (currentPath.includes("schedule")) {
    title += " - スケジュール";
  } else if (currentPath.includes("history")) {
    title += " - バトル";
    if (currentPath.includes("bankara")) {
      addTotalUdemaePoint();
    }
  } else if (currentPath.includes("coop")) {
    title += " - サーモンラン";
  } else if (currentPath.includes("record")) {
    title += " - きろく";
  } else {
    // ホーム
    fixCarouselImage();
    window.addEventListener("resize", async () => {
      fixCarouselImage();
    });
  }

  if (document.querySelector("title")) {
    document.querySelector("title").innerHTML = title;
  } else {
    const titleElm = document.createElement("title");
    titleElm.innerHTML = title;
    document.head.append(titleElm);
  }
}

async function fixCarouselImage() {
  await waitForElement('[class^="Carousel_container__"]');
  await waitForElement('[class^="CarouselItem_img__"]');
  document.querySelectorAll('[class^="CarouselItem_img__"]').forEach((elm) => {
    elm.width = document.querySelector(
      '[class^="Carousel_container__"]'
    ).clientWidth;
  });
}

async function addTotalUdemaePoint() {
  await waitForElement('[class^="Bankara_right__"]');
  await waitForElement('[class^="NavigationBar_content__"]');
  setTimeout(() => {
    let totalPoint = 0;
    document
      .querySelectorAll(
        '[style="display: block; transform: none;"] [class^="Bankara_right__"]'
      )
      .forEach((elm) => {
        totalPoint += parseInt(elm.innerHTML, "10");
      });

    if (totalPoint === 0) return;
    const headerTitle = document.querySelector(
      '[class^="NavigationBar_content__"] span'
    );
    headerTitle.innerHTML = `${
      headerTitle.innerHTML
    } ウデマエポイントのトータル ${
      Math.sign(totalPoint) ? `+${totalPoint}` : String(totalPoint)
    }`;
  }, 1000);
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
