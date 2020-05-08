/**
 * @fileOverview ブラウザで立ち読みするボタン共通スクリプト.
 * 
 * @name PrdStandReadingForBrowser.js
 */
jQuery.noConflict();

var browserStandReadingAjax = {

    /** 子windowオブジェクト(コールバック連携用) */
    childWindow : {},
    /** アプリ内ブラウザ判定 */
    isInnerBrowser : false,
    /** MSU商品ID */
    msuPrdId : '',

    /**
     * 「ブラウザで立ち読み」ボタン押下時の処理関数.
     *
     * @param pageBlockId プラグインブロックID
     * @param msuPrdId MSU商品ID
     * @param venderPrdId 仕入先商品ID
     * @param fileFormatId ファイル形式ID
     * @param sampleFileName サンプルファイル名
     * @param itemId 商品ID
     * @param isInnerBrowser アプリ内ブラウザか判定 ※Booleanメソッドで判定する（true=1,'1'・・・、false='',null・・・） 
     */
    standReading : function(pageBlockId, msuPrdId, venderPrdId, fileFormatId, sampleFileName, itemId, isInnerBrowser) {

        if (!HC.isSubmitted) {
            // 多重実行を防止
            HC.isSubmitted = true;

            browserStandReadingAjax.msuPrdId = msuPrdId;
            browserStandReadingAjax.isInnerBrowser = Boolean(isInnerBrowser);

            if (!browserStandReadingAjax.isInnerBrowser) {
                // 非同期通信後に別画面を立ち上げるとブロックされる為、
                // 事前に別ブラウザを立ち上げてハンドルを退避しておく
                browserStandReadingAjax.childWindow = window.open('about:blank');
            }

            var query = 'browserStandReading=1'
                        + '&msuPrdId=' + msuPrdId
                        + '&venderPrdId=' + venderPrdId
                        + '&fileFormatId=' + fileFormatId
                        + '&sampleFileName=' + sampleFileName
                        + '&redirectToUrl=' + encodeURIComponent(window.location.href)
                        + '&itemId=' + itemId;

            HC.Ajax.json(pageBlockId, this.complete, query, false, 'dy_img_' + msuPrdId, 'dy_standReading_' + msuPrdId, this.error);
        }
    },

    /**
     * Ajax成功時コールバック処理.
     *
     * @param json APIからのレスポンス
     */
    complete : function(json) {

        if (!json) {
            browserStandReadingAjax.error();
            return;
        }

        browserStandReadingAjax.s_click(json.siteCatalystEventName);
        if (browserStandReadingAjax.isInnerBrowser) {
            location.href = json.url;
        } else {
            browserStandReadingAjax.childWindow.location.href = json.url;
            browserStandReadingAjax.childWindow = null;
        }

        HC.isSubmitted = false;
    },

    /**
     * SiteCatalystに送信する値を設定<br>
     * @param value    s.eventsの値
    */
    s_click : function(events) {
        try {
            s = s_gi( s_account );
            s.events = events;
            s.linkTrackEvents = events;
            s.linkTrackVars = 'events';
            s.tl(true, 'o', 'browser-stand-msuprdid-'+browserStandReadingAjax.msuPrdId);
        } catch (e) {
        } finally {
            return true;
        }
    },

    /**
     * Ajaxエラー時コールバック処理.
     *
     * @param xhr httpオブジェクト
     * @param textStatus エラー内容("timeout", "error", "notmodified", "parsererror"など)
     * @param errorThrown 補足的な例外オブジェクト
     */
    error : function(xhr, textStatus, errorThrown) {
        // アプリ立ち読み情報が取得できなかった場合は、エラー処理を行わない

        // 事前に立ち上げた画面をクローズする
        if (!browserStandReadingAjax.isInnerBrowser) {
            browserStandReadingAjax.childWindow.close();
            browserStandReadingAjax.childWindow = null;
        }

        HC.isSubmitted = false;
    }
}