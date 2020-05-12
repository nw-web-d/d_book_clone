/**
 * @fileOverview 立ち読み共通スクリプト.
 * @name PrdStandReadingCommon.js
 */

/**
 * T-Time Pluginを開く関数.<br>
 * @param {String} url 立ち読み閲覧用URL
 */
function openStandReadingTTimePlugin(url) {
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
  HC.Window.open(url, 'dy_ttimepluginwindow', style)
}
/**
 * T-Time Crochetを開く関数.<br>
 * @param {String} url 立ち読み閲覧用URL
 */
function openStandReadingTTimeCrochet(url) {
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
  HC.Window.open(url, 'dy_ttimecrochetwindow', style)
}

/**
 * 内部ブラウザからダウンロード処理を起動する関数.<br>
 * @param {String} url ダウンロードURL
 * @return 呼び出し元での遷移抑止のための戻り値（常にfalse）
 */
function openStandReadingInnerBrowser(url) {
  try {
    var ret = window.ebook_store_jsfunction.startDL(url)
  } catch (e) {
    alert('ダウンロード処理に失敗しました。')
    return false
  }
  if (ret != 0) {
    // 正常終了でない場合
    alert('ダウンロード処理に失敗しました。')
  }
  return false
}

/**
 * 内部ブラウザからのプログレッシブダウンロード処理を起動する関数.<br>
 * @param {String} url ダウンロードURL
 * @return 呼び出し元での遷移抑止のための戻り値（常にfalse）
 */
function openProgressiveInnerBrowser(url) {
  try {
    var ret = window.ebook_store_jsfunction.progressiveDL(url)
  } catch (e) {
    alert('ダウンロード処理に失敗しました。')
    return false
  }
  if (ret != 0) {
    // 正常終了でない場合
    alert('ダウンロード処理に失敗しました。')
  }
  return false
}

/**
 * iOs標準ブラウザからアプリがバージョン未特定時の確認ダイアログ関数.<br>
 * @return ダイアログ処理結果
 */
function openConfirmUnKnownVersion() {
  //return window.confirm('最新アプリはインストール済みですか？\n古いアプリでは立ち読みできません。');
  return window.confirm(
    '立ち読みには、アプリのインストールと端末登録、\nおよびログインが必要となります。'
  )
}

/**
 * iOs標準ブラウザからアプリが旧バージョン若しくは、不明時の確認ダイアログ関数.<br>
 * @return ダイアログ処理結果
 */
function openConfirmOldVersion() {
  return window.confirm(
    '立ち読みには最新の「honto」\nアプリ（無料）が必要です。\n最新の「honto」アプリはApp Storeよりインストールができます。\n立ち読みを続けますか。'
  )
}

/**
 * iosのスキーマ起動
 */
function oepnIosViewerBrowser(url) {
  location.href = url
}
