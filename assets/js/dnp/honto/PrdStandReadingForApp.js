/**
 * @fileOverview アプリで立ち読みするボタン共通スクリプト.
 *
 * 本JavaScriptは「PrdStandReadingCommon.js」のメソッドを利用しています。
 * そのため、本JavaScriptを利用する際は「PrdStandReadingCommon.js」も併せて定義して下さい。
 *
 * @see PrdStandReadingCommon.js
 * @name PrdappStandReadingAjax.js
 */
jQuery.noConflict()

var appStandReadingAjax = {
  /** サイトカタリスト_イベントID(立ち読み) */
  SITE_CATALYST_EVENT_ID: 'event24',

  /** デバイスクラス(PC/SP) */
  deviceClass: '',
  /** 端末種別 */
  terminalType: '',
  /** lightBox表示有無フラグ */
  lightBoxFlag: false,
  /** 子windowオブジェクト(コールバック連携用) */
  childWindow: {},

  /**
   * 「アプリで立ち読み」ボタン押下時の処理関数(lightBox表示ありの場合).
   *
   * @param pageBlockId プラグインブロックID
   * @param productId 商品ID
   * @param msuProductId MSU商品ID
   * @param terminalType 端末種別
   * @param deviceClass  デバイスクラス(PC/SP)
   */
  standReadingWithLightBox: function(
    pageBlockId,
    productId,
    msuProductId,
    terminalType,
    deviceClass
  ) {
    appStandReadingAjax.lightBoxFlag = true

    appStandReadingAjax.standReading(
      pageBlockId,
      productId,
      msuProductId,
      terminalType,
      deviceClass
    )
  },

  /**
   * 「アプリで立ち読み」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param productId 商品ID
   * @param msuProductId MSU商品ID
   * @param terminalType 端末種別
   * @param deviceClass  デバイスクラス(PC/SP)
   */
  standReading: function(
    pageBlockId,
    productId,
    msuProductId,
    terminalType,
    deviceClass
  ) {
    if (!HC.isSubmitted) {
      // 多重実行を防止
      HC.isSubmitted = true

      appStandReadingAjax.productId = productId
      appStandReadingAjax.deviceClass = deviceClass
      appStandReadingAjax.terminalType = terminalType

      if (
        appStandReadingAjax.deviceClass == 'PC' &&
        appStandReadingAjax.terminalType == '00' &&
        !appStandReadingAjax.lightBoxFlag
      ) {
        // 非同期通信後に別画面を立ち上げるとブロックされる為、
        // 事前に別ブラウザを立ち上げてハンドルを退避しておく
        var style = HC.Window.Style.createObject(
          1024,
          700,
          false,
          false,
          false,
          false,
          true,
          true,
          0,
          0
        )
        appStandReadingAjax.childWindow = HC.Window.open(
          'about:blank',
          'about:blank',
          style
        )
      }

      // サイトカタリストへ分析用データを送信
      appStandReadingAjax.sendSiteCatalyst(productId)

      HC.Ajax.jsonSync(
        pageBlockId,
        this.complete,
        'ebkPrdId=' +
          productId +
          '&msuPrdId=' +
          msuProductId +
          '&appStandReading=1',
        false,
        'dy_img_' + productId,
        'dy_standReading_' + productId,
        this.error
      )
    }
  },

  /**
   * Ajax成功時コールバック処理.
   *
   * @param json APIからのレスポンス
   */
  complete: function(json) {
    var response

    if (!json) {
      appStandReadingAjax.error()
      return
    }

    response = json[0]

    if (response.useDeepLink == '1') {
      // DeepLinkを利用する場合
      window.location.href = response.url
    } else {
      // DeepLinkを利用しない場合
      if (appStandReadingAjax.deviceClass == 'SP') {
        appStandReadingAjax.executeViewerAppForSp(response)
      } else {
        appStandReadingAjax.executeViewerAppForPc(response)
      }
    }

    HC.isSubmitted = false
    appStandReadingAjax.lightBoxFlag = false
  },

  /**
   * PC用アプリ起動処理.
   *
   * @param response APIからのレスポンス
   */
  executeViewerAppForPc: function(response) {
    if (
      appStandReadingAjax.isInnerBrowserAccess(
        response.osClass,
        response.innerBrowserFlag
      )
    ) {
      // OS区分がAndroid 且つ アプリ内ブラウザの場合は、専用の処理を行う
      return appStandReadingAjax.executeViewerAppForInnerBrowser(response)
    } else {
      if (appStandReadingAjax.openConfirm(response) == false) {
        return
      }

      if (
        appStandReadingAjax.deviceClass == 'PC' &&
        appStandReadingAjax.terminalType == '00' &&
        !appStandReadingAjax.lightBoxFlag
      ) {
        if (response.stupVwrNm == 'TTPLG') {
          appStandReadingAjax.childWindow.name = 'dy_ttimepluginwindow'
          appStandReadingAjax.childWindow.location.href = response.downloadLink.split(
            "'"
          )[1]
        } else {
          appStandReadingAjax.childWindow.name = 'dy_ttimecrochetwindow'
          appStandReadingAjax.childWindow.location.href = response.downloadLink.split(
            "'"
          )[1]
        }
        appStandReadingAjax.childWindow = null
      } else {
        window.location.href = response.downloadLink
      }
    }
  },

  /**
   * SP用アプリ起動処理.
   *
   * @param response APIからのレスポンス
   */
  executeViewerAppForSp: function(response) {
    // OS区分がAndroid 且つ アプリ内ブラウザの場合は、専用の処理を行う
    if (
      appStandReadingAjax.isInnerBrowserAccess(
        response.osClass,
        response.innerBrowserFlag
      )
    ) {
      appStandReadingAjax.executeViewerAppForInnerBrowser(response)
      return
    }

    if (appStandReadingAjax.lightBoxFlag == true) {
      window.location.href = response.downloadLink
    } else {
      appStandReadingAjax.executeViewerAppForIphone(response)
    }
  },

  /**
   * iPhone用アプリ起動処理.
   *
   * @param response APIからのレスポンス
   */
  executeViewerAppForIphone: function(response) {
    var url

    if (response.downloadParameterFlag == true) {
      url = response.downloadLink + '?encryptData=' + response.downloadParameter
    } else {
      url = response.downloadUrl
    }

    if (appStandReadingAjax.openConfirm(response) == true) {
      window.location.href = url
    }
  },

  /**
   * 確認画面を表示する.
   *
   * @param response APIからのレスポンス
   * @return window.confirmの結果
   */
  openConfirm: function(response) {
    if (response.osClass == 'iOS' && response.iOsAppVersionKnownFlag != '0') {
      return openConfirmOldVersion()
    }
    return true
  },

  /**
   * アプリ内ブラウザからの起動であるか確認する.
   *
   * @param osClass OSクラス
   * @param innerBrowserFlag アプリ内ブラウザフラグ
   * @return true:アプリ内ブラウザからのアクセス、false:通常ブラウザからのアクセス
   */
  isInnerBrowserAccess: function(osClass, innerBrowserFlag) {
    if (osClass == 'Android' && innerBrowserFlag == '1') {
      return true
    }

    return false
  },

  /**
   * アプリ内ブラウザ用アプリ起動処理.
   *
   * @param response APIからのレスポンス
   */
  executeViewerAppForInnerBrowser: function(response) {
    if (response.downloadParameterFlag == true) {
      // レガシーコンテンツの場合
      return openStandReadingInnerBrowser(response.downloadLink)
    }

    // プログレッシブコンテンツの場合
    return openProgressiveInnerBrowser(response.downloadLink)
  },

  /**
   * SiteCatalystに送信する値を設定.
   *
   * @param productId 商品ID
   */
  sendSiteCatalyst: function(productId) {
    try {
      s = s_gi(s_account)
      s.events = appStandReadingAjax.SITE_CATALYST_EVENT_ID
      s.linkTrackEvents = appStandReadingAjax.SITE_CATALYST_EVENT_ID
      s.linkTrackVars = 'events'
      s.tl(true, 'o', 'app-stand-prdid-' + productId)
    } catch (e) {
    } finally {
      return true
    }
  },

  /**
   * Ajaxエラー時コールバック処理.
   *
   * @param xhr httpオブジェクト
   * @param textStatus エラー内容("timeout", "error", "notmodified", "parsererror"など)
   * @param errorThrown 補足的な例外オブジェクト
   */
  error: function(xhr, textStatus, errorThrown) {
    // アプリ立ち読み情報が取得できなかった場合は、エラー処理を行わない

    if (
      appStandReadingAjax.deviceClass == 'PC' &&
      appStandReadingAjax.terminalType == '00' &&
      !appStandReadingAjax.lightBoxFlag
    ) {
      appStandReadingAjax.childWindow.close()
      appStandReadingAjax.childWindow = null
    }

    HC.isSubmitted = false
    appStandReadingAjax.lightBoxFlag = false
  }
}
