/**
 * Kirei Labs - Minimal JavaScript
 */

(function () {
  'use strict';

  /**
   * 1. スムーススクロール（ページ内アンカー）
   */
  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // # のみの場合はスキップ
        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          const headerHeight = 0; // 固定ヘッダーなしなので0
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * 2. Amazon表示切替（data-amazon）
   *
   * 使用方法:
   *   - HTML: <div data-amazon="true">...</div>
   *   - JS:   toggleAmazonDisclosure(true)  // 表示
   *           toggleAmazonDisclosure(false) // 非表示
   *   - コンソールから切り替え可能
   */
  function initAmazonToggle() {
    // グローバル関数として公開（管理用）
    window.toggleAmazonDisclosure = function (show) {
      const amazonBlocks = document.querySelectorAll('[data-amazon]');

      amazonBlocks.forEach(function (block) {
        block.setAttribute('data-amazon', show ? 'true' : 'false');
      });

      console.log('Amazon disclosure:', show ? 'ON' : 'OFF');
    };

    // 現在の状態を取得する関数
    window.getAmazonDisclosureState = function () {
      const block = document.querySelector('[data-amazon]');
      if (block) {
        return block.getAttribute('data-amazon') === 'true';
      }
      return null;
    };
  }

  /**
   * 3. クリック計測（Amazon/楽天ボタン → GA4カスタムイベント）
   *
   * data-store / data-product 属性付きリンクのクリックを
   * GA4に "affiliate_click" カスタムイベントとして送信。
   */
  function initClickTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-store]');
      if (!a) return;

      var store = a.dataset.store;
      var product = a.dataset.product;
      var url = a.href;

      // GA4 カスタムイベント送信
      if (typeof gtag === 'function') {
        gtag('event', 'affiliate_click', {
          store: store,
          product: product,
          link_url: url
        });
      }

      // デバッグ用（確認後に削除してもOK）
      console.log('[KireiLabs] click:', store, product);
    });
  }

  /**
   * 初期化
   */
  function init() {
    initSmoothScroll();
    initAmazonToggle();
    initClickTracking();
  }

  // DOMContentLoaded で実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
