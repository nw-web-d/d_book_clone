/**
 * @fileOverview ユーザーレビュー一覧スクリプト.
 * @name PrdReviewList.js
 */
jQuery.noConflict()

const prdReviewList = {
  /**
   * ブクログレビューをすべて開く.
   */
  openBooklogReview() {
    // ブクログレビューをすべて開く
    jQuery('.dyBklgReviewText').fadeIn()
    // 「レビューを見る」リンクを削除
    jQuery('.dyBklgOpenLink').hide()
    // 「ブクログレビュー表示フラグ」をcookieに追加
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = 'bklgRevDispFlg=1; path=/; expires=' + expires
  }
}
