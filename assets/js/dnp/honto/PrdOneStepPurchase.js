/**
 * @fileOverview ワンステップ購入ボタン共通スクリプト.
 * @name PrdOneStepPurchase.js
 */

jQuery.noConflict()
var oneStepPurchase = {
  /** プラグインブロックID **/
  pageBlockId: '',

  /** 識別子（画面内重複IDに対する識別） **/
  formIdentifier: '',

  /** 表示タイプ **/
  displayType: '',

  /** 多重実行抑止 **/
  setDoubleClickFlg(flg) {
    HC.isSubmitted = flg
  },

  /**
   * ローディング画像を設定する.
   */
  setLoadingImage() {
    // PCの場合
    if (oneStepPurchase.displayType.match(/^pc/)) {
      HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif'
    }
  },

  /**
   * 設定関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param formIdentifier Form識別子
   * @param displayType 表示タイプ(pc:PC sp:SP)
   */
  init(pageBlockId, formIdentifier, displayType) {
    oneStepPurchase.pageBlockId = pageBlockId
    oneStepPurchase.formIdentifier = formIdentifier
    oneStepPurchase.displayType = displayType
  },

  /**
   * 「ワンステップ購入」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param formIdentifier Form識別子
   * @param displayType 表示タイプ(pc:PC sp:SP)
   */
  add(pageBlockId, formIdentifier, displayType) {
    if (!HC.isSubmitted) {
      // 多重実行を防止
      oneStepPurchase.setDoubleClickFlg(true)

      // ローディング画像出しわけ設定
      oneStepPurchase.setLoadingImage()

      const oneStepForm = jQuery('#' + formIdentifier)
      const oneStepblockData = Honto.Common.Ajax.blockData[pageBlockId]

      // FWで必要なパラメータを設定
      oneStepForm.append(
        '<input type="hidden" name="blockId" value="' +
          oneStepblockData.blockId +
          '" />'
      )
      oneStepForm.append(
        '<input type="hidden" name="className" value="' +
          oneStepblockData.className +
          '" />'
      )
      oneStepForm.append('<input type="hidden" name="isPart" value="false" />')
      oneStepForm.append(
        '<input type="hidden" name="noResponse" value="true" />'
      )

      // EinsteinRecommendationsのtrackCart送信スクリプトを埋め込む
      try {
        const productId = oneStepForm
          .children('input[name="onestep-prdId"]')
          .val()
        oneStepForm.append(
          '<script>_etmc.push(["trackCart", {"cart" : [{"item" : "' +
            productId +
            '", "unique_id" : "' +
            productId +
            '"}]}]);</script>'
        )
      } catch (e) {
        // 外部jsが読み込めないなど、エラーの場合はコンソールに出力
        console.error(e)
      }

      // ワンステップ購入リクエスト
      oneStepForm.attr('action', Honto.Common.Ajax.url)
      oneStepForm.submit()
    }
  }
}
