/**
 * @fileOverview ユーザーレビュー一覧スクリプト.
 * @name PrdReviewList.js
 */
jQuery.noConflict()

var prdReviewList = {
  /**
   * ブクログレビューをすべて開く.
   */
  openBooklogReview: function() {
    // ブクログレビューをすべて開く
    jQuery('.dyBklgReviewText').fadeIn()
    // 「レビューを見る」リンクを削除
    jQuery('.dyBklgOpenLink').hide()
    // 「ブクログレビュー表示フラグ」をcookieに追加
    var expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = 'bklgRevDispFlg=1; path=/; expires=' + expires
  }
}
