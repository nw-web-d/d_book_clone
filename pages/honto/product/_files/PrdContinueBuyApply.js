/**
 * @fileOverview 続刊購入申し込み.
 * @name PrdContinueBuyApply.js
 */

jQuery.noConflict();
var continueBuyApply = {

    /** 商品ID **/
    productId : '',
    /** プラグインブロックID **/
    pageBlockId : '',
    /** 識別子（画面内重複IDに対する識別） **/
    formIdentifier : '',
    /** 注文サイト **/
    orderSite : '',
    /** セレクタ **/
    selecter : '',

    /** 多重実行抑止 **/
    setDoubleClickFlg : function(flg) {
        HC.isSubmitted = flg;
    },

    /**
     * ローディング画像を設定する.
     */
    setLoadingImage : function() {

        // PCの場合
        if(continueBuyApply.orderSite.match(/^pc/)) {
            HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif';
        }
    },

    /**
     * 設定関数.
     *
     * @param pageBlockId プラグインブロックID
     * @param srsId シリーズID
     * @param orderSite 注文サイト(pc/smart_phone)
     */
    _init : function(pageBlockId, srsId, orderSite) {
        this.srsId = srsId;
        this.pageBlockId = pageBlockId;
        this.selecter = '[id ^= dy_apply_link_' + srsId + ']';
        this.orderSite = orderSite;
    },

    /**
     * 「続刊購入申し込み」ボタン押下時の処理関数.
     * @param pageBlockId プラグインブロックID
     * @param srsId シリーズID
     * @param orderSite 注文サイト(pc/smart_phone)
     */
    apply : function(pageBlockId, ebkSrsId, orderSite) {

        if (!HC.isSubmitted) {
            // 多重実行を防止
            continueBuyApply.setDoubleClickFlg(true);
                        
            // 初期設定 
            this._init(pageBlockId, ebkSrsId, orderSite);
            // ローディング画像出しわけ設定
            continueBuyApply.setLoadingImage();

            var returnUrl = window.location.pathname;
            HC.Ajax.json(pageBlockId, this.complete, 'continueFlg=1&returnuri='+encodeURIComponent(returnUrl)+'&ebkSrsId='+ebkSrsId+'&orderSite='+orderSite, false, null, null, this.error);
        } else {
            // 多重実行時は1.5秒後に実行可能
            setTimeout("continueBuyApply.setDoubleClickFlg(false);", 1500);
        }
    },

    /**
     * Ajax成功時コールバック処理.
     *
     * @param json APIからのレスポンス
     */
    complete : function(json) {
        if (!json) {
            continueBuyApply.error();
            return;
        }

        // 未ログインの場合はログイン画面へ遷移
        if (json.redirecturi) {
            location.href = json.redirecturi;
            return;
        }

        if (json === 'requesting' || json === 'send_mail_failed' || json === 'stopped') {
        // 続刊申込成功
            var requestStatus = 'requesting';
            jQuery(continueBuyApply.selecter).each(function (index, element) {
                continueBuyApply._createLink(element);
            });
        }
        // 既に申込済
        else if (json === 'already_registered_next_issue_purchase_request') {
            var requestStatus = 'already_registered';
            jQuery(continueBuyApply.selecter).each(function (index, element) {
                continueBuyApply._createMessage(requestStatus, element);
            });    
        }
        // 申込停止中
        else if (json === 'now_maintenance') {
            var requestStatus = 'now_maintenance';
            jQuery(continueBuyApply.selecter).each(function (index, element) {
                continueBuyApply._createMessage(requestStatus, element);
            });    
        }
        // 申込対象外
        else if (json === 'impossible_request_next_issue_purchase') {
            var requestStatus = 'excluded';
            jQuery(continueBuyApply.selecter).each(function (index, element) {
                continueBuyApply._createMessage(requestStatus, element);
            });    
        }
        // 再度申込
        else {
            var requestStatus = 'requesting';
            jQuery(continueBuyApply.selecter).each(function (index, element) {
                continueBuyApply._createLink(element);
            });
        }

        // PCの場合はローディング画像の定義を初期設定に戻す
        if (continueBuyApply.orderSite.match(/^pc/)) {
            HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif';
        }
        
        continueBuyApply.setDoubleClickFlg(false);
    },

    /**
     * Ajaxエラー時コールバック処理.
     *
     * @param xhr httpオブジェクト
     * @param textStatus エラー内容("timeout", "error", "notmodified", "parsererror"など)
     * @param errorThrown 補足的な例外オブジェクト
     */
    error : function(xhr, textStatus, errorThrown) {

        // 現在のURLについているパラメータを付加
        var newParameters = [];
        var parameters = window.location.search.substring(1).split('&');
        for ( var i = 0; i < parameters.length; i++) {
            if (!parameters[i].match(/^(prdid=|delHst=|delHstAll=)/)) {
                newParameters.push(parameters[i]);
            }
        }

        // リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
        var linkUrl = window.location.pathname;
        window.location.href = linkUrl;
    },

    /**
     * 続刊申込一覧画面へのリンク要素を生成.
     *
     * @param element 続刊予約申し込みボタン要素
     * @return linkObj 続刊申込一覧画面へのリンク要素
     */
    _createLink : function(element) {

        var elementId = jQuery(element).attr('id');
        var errorMsgId = 'errorMsg_' + elementId;
        var linkMsgId = 'linkMsg_' + elementId;

        // 既存メッセージの削除
        jQuery('#' + errorMsgId).remove();

        if (this.orderSite == 'pc') {
            var errorText = '申込み済み';
                jQuery('#' + linkMsgId).remove();
                jQuery(element).children().attr('class', 'stBtn stSizeL stEbBtn stDisabled').html(errorText);
                jQuery(element).after('<p id="' + linkMsgId + '" class="stLink01 stMarginB15"><a href="/my/account/next-issue.html">続刊予約一覧で確認・キャンセル</a></p>');
        }
        if (this.orderSite == 'smart_phone') {
            var errorText = '申込み済み';
                jQuery('#' + linkMsgId).remove();
                jQuery(element).children().attr('class', 'stBtn stSizeM').prop("disabled",true).html(errorText);
                jQuery(element).after('<p id="' + linkMsgId + '" class="stLink01 stMarginB15 stCenter"><a href="/my/account/next-issue.html">続刊予約一覧で確認・キャンセル</a></p>');
        }

    },

    /**
     * メッセージの要素を生成.
     *
     * @param message メッセージ
     * @param element 続刊予約申し込みボタン要素
     * @return messageObj メッセージ要素
     */
    _createMessage : function(message, element) {

        var elementId = jQuery(element).attr('id');
        var errorMsgId = 'errorMsg_' + elementId;
        var linkMsgId = 'linkMsg_' + elementId;

        // 既存メッセージの削除
        jQuery('#' + errorMsgId).remove();

        // 申込み済
        if (message == 'already_registered') {
            // 既存メッセージの削除
            jQuery('#' + linkMsgId).remove();

            if (this.orderSite == 'pc') {
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg">すでにお申し込み済みの商品です。</p>');
                var errorText = '申込み済み';
                jQuery(element).children().attr('class', 'stBtn stSizeL stEbBtn stDisabled').html(errorText);
                jQuery(element).after('<p id="' + linkMsgId + '" class="stLink01 stMarginB15"><a href="/my/account/next-issue.html">続刊予約一覧で確認・キャンセル</a></p>');
            }
            if (this.orderSite == 'smart_phone'){
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg"><strong>すでにお申し込み済みの商品です。</strong></p>');
                var errorText = '申込み済み';
                jQuery(element).children().attr('class', 'stBtn stSizeM').prop("disabled",true).html(errorText);
                jQuery(element).after('<p id="' + linkMsgId + '" class="stLink01 stMarginB15 stCenter"><a href="/my/account/next-issue.html">続刊予約一覧で確認・キャンセル</a></p>');
            }
        }

        // 申込み停止中
        if (message == 'now_maintenance') {
            if (this.orderSite == 'pc') {
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg">現在、注文の受付を一時停止しております。</p>');
                var errorText = '申し込みできません';
                jQuery(element).children().attr('class', 'stBtn stSizeL stEbBtn stDisabled').html(errorText);
            }
            if (this.orderSite == 'smart_phone'){
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg"><strong>現在、注文の受付を一時停止しております。</strong></p>');
                var errorText = '申し込みできません';
                jQuery(element).children().attr('class', 'stBtn stSizeM').prop("disabled",true).html(errorText);
            }
        }

        // 申込対象外
        if (message == 'excluded') {
            if (this.orderSite == 'pc') {
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg">続刊購入できない商品です。</p>');
                var errorText = '申し込みできません';
                jQuery(element).children().attr('class', 'stBtn stSizeL stEbBtn stDisabled').html(errorText);
            }
            if (this.orderSite == 'smart_phone') {
                jQuery(element).before('<p id="' + errorMsgId + '" class="stErrorMsg"><strong>続刊購入できない商品です。</strong></p>');
                var errorText = '申し込みできません';
                jQuery(element).children().attr('class', 'stBtn stSizeM').prop("disabled",true).html(errorText);
            }
        }
    }
}
