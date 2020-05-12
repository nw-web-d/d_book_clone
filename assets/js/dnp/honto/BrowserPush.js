/**
 * @fileOverview ブラウザPUSH共通スクリプト.
 * @name BrowserPush.js
 */
jQuery.noConflict()

/**
 * Load時に以下の処理を行う。
 *
 * ・ブラウザが通知に対応しているか
 * ・対応している場合、既に許可 or ブロックしているか。している場合、通知許諾は出さない
 * ・特定のcookieが設定されている場合、許諾スキップを実行したとみなし、通知許諾は一定期間出さない
 * ・通知許諾を出すと判断された場合、許可フラグを立て、ほしい本ページに訴求ボタンを表示する
 */
window.addEventListener('load', function() {
  // 訴求ボタン表示
  notificationPermission.displayTooltip()
})

var notificationPermission = {
  /**
   * 訴求ボタン表示.
   *
   * ・前提条件をチェックし、訴求ボタンを表示する
   * @param pageBlockId プラグインブロックID
   */
  displayTooltip: function(pageBlockId) {
    // 前提条件チェック
    if (!this.checkPrecondition()) {
      return
    }

    var tooltipWapper = '#dy_stTooltip02-wrapper'
    if (pageBlockId) {
      tooltipWapper = tooltipWapper + '_' + pageBlockId
    }

    // 訴求ボタン表示
    jQuery(tooltipWapper).removeClass('stHide')
  },

  /**
   * 前提条件チェック.
   *
   * ・WebPush対応ブラウザであること
   * ・通知許可 or ブロック状態でないこと
   * ・スキップ設定していないこと（対象cookieなし）
   *
   * @return true：前提条件クリア、false：前提条件NG
   */
  checkPrecondition: function() {
    if (!'Notification' in window) {
      // 通知未対応ブラウザ
      console.log('This browser does not support notifications.')
      return false
    }

    // 通知許可状態
    try {
      var permission = Notification.permission
      if (permission === 'denied' || permission === 'granted') {
        // 既に許可 or ブロックしているので処理を抜ける
        return false
      }
    } catch (e) {
      // Notificationオブジェクトが利用不可ブラウザの場合は処理を抜ける
      return false
    }

    if (document.cookie.indexOf('notification_permission_skip') !== -1) {
      // cookieに書き込みあり(スキップボタン押下)
      return false
    }

    return true
  },

  /**
   * cookie有効期限(expires)（30日）.
   *
   * @return cookieのexpiresに設定する値
   */
  getExpires: function() {
    var expires = new Date()
    expires.setMonth(expires.getMonth() + 1)
    return expires
  },

  /**
   * cookie有効期限(max-age)（30日）.
   *
   * @return cookieのmax-ageに設定する値
   */
  getMaxAge: function() {
    return 60 * 60 * 24 * 30 // 単位は秒
  },

  /**
   * 通知許諾を一定期間行わないようにcookieにフラグを立てる.
   */
  skipPermission: function() {
    // cookie設定
    document.cookie =
      'notification_permission_skip=1; path=/; expires=' +
      this.getExpires() +
      '; max-age=' +
      this.getMaxAge()

    // フローティングバナーを閉じる
    this.closeFloatingBanner()
  },

  /**
   * フローティングバナー（回遊時許諾）を閉じる.
   *
   */
  closeFloatingBanner: function() {
    jQuery('#dy_MigrationFloatingBanner').addClass('stHide')
  },

  /**
   * 許諾前のワンクッションバナーを表示.
   *
   * サイト回遊時の通知許諾ダイアログ表示前のフローティングバナー表示
   *
   */
  showBanner: function() {
    // 既に通知許可/通知ブロック or スキップしている場合は離脱
    if (!this.checkPrecondition()) return

    // フローティングバナー表示
    jQuery('#dy_MigrationFloatingBanner').removeClass('stHide')
  },

  /**
   * 許諾前のワンクッションダイアログを閉じる.
   *
   * ダイアログを閉じ、かつ許諾訴求ボタンも非表示にする
   *
   */
  closePopup: function() {
    // 許諾訴求ボタンを非表示
    jQuery('[id ^= dy_stTooltip02-wrapper').each(function(index, element) {
      jQuery(element).addClass('stHide')
    })

    // ワンクッションダイアログを閉じる
    jQuery('#dy_consentAppeal_button').click() // SP
    jQuery('#fancybox-close').click() // PC
  },

  /**
   * ツールチップを閉じる.
   *
   * 区切り線も消す
   *
   */
  closeTooltip: function() {
    // 許諾訴求ボタンを非表示
    jQuery('#dy_stTooltip02-wrapper').addClass('stHide')

    // 区切り線を非表示（ほしい本）
    jQuery('#dy_stSingleLink01').addClass('stBorderBottomNone')
  }
}

var browserPushAjax = {
  /**
   * 二重サブミット制御フラグ.
   * true：サブミット中、false：サブミットなし
   */
  isSubmitted: false,

  /**
   * FCM Messageオブジェクト格納用.
   */
  msg: '',

  /**
   * PUSH通知許可処理.
   */
  pushPermission: function() {
    if (browserPushAjax.isSubmitted) {
      return
    }

    var pageBlockId = jQuery('#dy_footerPageBlockId').attr('value')

    if (!this.msg) {
      firebase.initializeApp(browserPushConfig.config)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js')
      } else {
        console.info('serviceWorker NG')
        return
      }

      this.msg = firebase.messaging()

      this.msg.onMessage(function(payload) {
        console.log('Message received. ', payload)
      })
    }

    // 多重実行を防止
    browserPushAjax.isSubmitted = true

    // 許諾ポップアップ後、メンバ変数クリアされたのでローカル変数に退避
    var msglocal = this.msg

    msglocal
      .requestPermission()
      .then(function() {
        // 通知許諾ダイアログで許可が押された場合
        msglocal
          .getToken()
          .then(function(curToken) {
            console.log('token:' + curToken)

            if (pageBlockId == null) {
              console.error('Cannot get pageBlockId at pushPermission.')
              browserPushAjax.isSubmitted = false
              return // 取得出来ない場合はスキップ
            }

            localStorage.setItem('honto.fcm.token', curToken)

            // リクエストパラメータ作成
            var param = { fcmId: curToken }

            // Ajax通信
            HC.Ajax.json(pageBlockId, null, param, false, null, null)

            browserPushAjax.isSubmitted = false
          })
          .catch(function(err) {
            browserPushAjax.isSubmitted = false
            console.error(err)
          })
      })
      .catch(function(err) {
        // ブロックまたは無視された場合
        browserPushAjax.isSubmitted = false
        console.log(err)
      })
  },

  /**
   * tokenクリア処理.
   *
   * @param alias エイリアス
   */
  clearToken: function(alias) {
    if (browserPushAjax.isSubmitted) {
      return
    }

    var pageBlockId = jQuery('#dy_footerPageBlockId').attr('value')
    if (pageBlockId == null) {
      console.error('Can not get pageBlockId at clearToken.')
      return // 取得出来ない場合はスキップ
    }

    if (!this.msg) {
      firebase.initializeApp(browserPushConfig.config)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js')
      } else {
        console.info('serviceWorker NG')
        return
      }

      this.msg = firebase.messaging()
    }

    // 多重実行を防止
    browserPushAjax.isSubmitted = true

    var curToken = localStorage.getItem('honto.fcm.token')
    if (curToken == null) {
      browserPushAjax.isSubmitted = false
      return
    }
    localStorage.removeItem('honto.fcm.token')

    // ローカル変数に退避
    var msglocal = this.msg

    msglocal
      .deleteToken(curToken)
      .then(function() {
        msglocal.getToken().then(function(newToken) {
          if (newToken) {
            localStorage.setItem('honto.fcm.token', newToken)
          }

          // リクエストパラメータ作成
          var param = { fcmId: curToken, alias: alias, fcmIdToTopic: newToken }

          // Ajax通信
          HC.Ajax.json(pageBlockId, null, param, false, null, null)

          browserPushAjax.isSubmitted = false
        })
      })
      .catch(function(err) {
        // 許諾取ってない場合
        browserPushAjax.isSubmitted = false
      })
  },

  /**
   * トークン取得処理.
   *
   * ローカルストレージに保持しているトークンを引数として投げる(Ajax)
   * 渡したトークンを元にtopic購読解除を行う
   *
   * @param alias エイリアス
   */
  getTokenFromStorage: function(alias) {
    var curToken = localStorage.getItem('honto.fcm.token')

    var pageBlockId = jQuery('#dy_footerPageBlockId').attr('value')
    if (pageBlockId == null) {
      return
    }

    if (!this.msg) {
      firebase.initializeApp(browserPushConfig.config)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js')
      } else {
        console.info('serviceWorker NG')
        return
      }

      this.msg = firebase.messaging()
    }

    // ローカル変数に退避
    var msglocal = this.msg

    msglocal
      .deleteToken(curToken)
      .then(function() {
        msglocal.getToken().then(function(newToken) {
          if (newToken) {
            localStorage.setItem('honto.fcm.token', newToken)
          } else {
            newToken = ''
          }

          // リクエストパラメータ作成
          var param = {
            fcmIdFromStorage: curToken,
            alias: alias,
            fcmIdToUser: newToken
          }

          // Ajax通信
          HC.Ajax.json(pageBlockId, null, param, false, null, null)
        })
      })
      .catch(function(err) {
        // 許諾取ってない場合
      })
  }
}
