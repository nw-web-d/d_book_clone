/**
 * @fileOverview ヘッダ用共通スクリプト.
 * @name EtcHeader.js
 */
const EtcHeader = {
  /** プラグインブロックID **/
  pageBlockId: '',

  /** セーフサーチフラグ **/
  safeSearchFlag: '',

  /**  セーフサーチON/OFF切替 */
  editSafeSearch(pageBlockId, safeSearchFlag) {}
}

jQuery.noConflict()
jQuery(document).ready(function($) {
  $.extend(EtcHeader, {
    /**
     * セーフサーチON/OFF切替
     *
     * @param string pageBlockId プラグインブロックID
     * @param string safeSearchFlag セーフサーチフラグ(ON/OFF)
     */
    editSafeSearch(pageBlockId, safeSearchFlag) {
      if (HC.isSubmitted) {
        return
      }
      // 多重実行を防止
      HC.isSubmitted = true

      // チェックボックスを無効化
      this.selecter = '#stSafeSearch'
      $(this.selecter).prop('disabled', true)

      HC.Ajax.request(
        pageBlockId,
        this.editSafeSearchComplete,
        'type=safesearch&safeSearchFlag=' + safeSearchFlag
      )
    },

    /**
     * セーフサーチ切替完了処理.
     */
    editSafeSearchComplete() {
      // チェックボックスの無効化を解除
      $(EtcHeader.selecter).prop('disabled', false)

      // 多重実行防止ロック解除
      HC.isSubmitted = false
    }
  })
})
