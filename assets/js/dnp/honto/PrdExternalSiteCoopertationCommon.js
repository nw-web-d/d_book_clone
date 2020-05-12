/**
 * @fileOverview 外部ソーシャルサイト連携用スクリプト.
 * @name PrdExternalSiteCoopertationCommon.js
 */

/**
 * SNS用ポップアップ生成関数.<br>
 * 引数で与えられたパラメータに従って外部サイトをダイアログで開く.<br>
 * @param {Object} url 外部サイトURL
 * @param {Object} _this クリック発生要素
 */
function openSnsPopUp(url, _this, width, height) {
  // サイカタ
  altCheck(_this)

  // デフォルトウィンドウサイズ
  if (!width) width = 632
  if (!height) height = 456

  const style = HC.Window.Style.createObject(
    width,
    height,
    false,
    true,
    false,
    false,
    false,
    false,
    0,
    0
  )
  HC.Window.open(url, 'dy_share', style)
}

// SNSボタンクリックイベント
function altCheck(elem) {
  const img = elem.children
  const imgL = img.length

  if (imgL !== 0) {
    // PC
    var alt = img[0].getAttribute('alt')
  } else {
    // SP
    var alt = elem.parentNode.className
  }
  s_sns_click('event45', alt)
}

/**
 * SiteCatalystに送信する値を設定<br>
 * @param value    s.eventsの値
 * @param socialname SNS名
 */
function s_sns_click(value, socialname) {
  try {
    s = s_gi(s_account)
    s.events = value
    s.prop73 = socialname
    s.linkTrackEvents = value
    s.linkTrackVars = 'events,prop73'
    s.tl(true, 'o', 'sns-' + socialname)
  } catch (e) {
  } finally {
    return true
  }
}
