/**
 * @fileOverview EinsteinRecommendationsのtrackPageView送信
 * @name PrdEinsteinRecommendationsTrackPageView.js
 */

jQuery.noConflict()
var einsteinRecommendationsTrackPageView = {
  /**
   * trackPageView送信スクリプトを埋め込む処理関数
   *
   * @param targetId 商品ID／シリーズID
   * @param genreCode ジャンルコード
   */
  addTrackPageView: function(targetId, genreCode) {
    try {
      var trackPageViewArea = jQuery(
        '#einstein-recommendations-track-page-view'
      )
      if (typeof adultauth === 'undefined') {
        // アダルト認証BOXが表示されない場合（アダルト以外、または、アダルト認証済み）
        if (targetId != '') {
          // 商品ID／シリーズIDが設定されている場合（商品詳細／シリーズ詳細の場合）
          trackPageViewArea.append(
            '<script>_etmc.push(["trackPageView", {"item" : "' +
              targetId +
              '"}]);</script>'
          )
        }

        if (genreCode != '') {
          // ジャンルコードが設定されている場合
          trackPageViewArea.append(
            '<script>_etmc.push(["trackPageView", {"category" : "' +
              genreCode +
              '"}]);</script>'
          )
        }

        return
      }

      // アダルト認証BOXが表示される場合（アダルト、かつ、アダルト未認証）は、認証後に設定するため、
      // 商品ID／シリーズID、ジャンルコードを埋め込んでおく
      trackPageViewArea.attr('data-target-id', targetId)
      trackPageViewArea.attr('data-genre-code', genreCode)
    } catch (e) {
      // 外部jsが読み込めないなど、エラーの場合はコンソールに出力
      console.error(e)
    }
  }
}
