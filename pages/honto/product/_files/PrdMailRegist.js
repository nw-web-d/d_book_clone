/**
 * @fileOverview 電子書籍化希望のメールを登録するボタン共通スクリプト.
 * @name PrdMailRegist.js
 */

jQuery.noConflict();

var prdMailRegistAjax = {

    /** プラグインブロックID **/
    pageBlockId : '', 
    
	/** 商品ID **/
	productId : '',

    /** リクエストタイプ（メールを登録する, メール登録を解除する）*/
    requestType : '', 

	/** セレクタ **/
    selector : {},

	/** 追加ボタンのクローン **/
    buttonClone : {}, 
    
	/**
	 * 設定関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param productId 商品ID
	 * @param requestType リクエストタイプ
	 */
	_init : function(pageBlockId, productId, requestType) {
		this.pageBlockId = pageBlockId;
		this.productId = productId;
		this.requestType = requestType;
		this.selector = '#dy_ReqEbkBtn';
		this.buttonClone = jQuery(this.selector).children().clone(true);
	},


	/**
	 * 「メールを登録する」, 「メール登録を解除する」ボタン押下時の処理関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param productId 商品ID
	 * @param requestType リクエストタイプ
	 */
	add : function(pageBlockId, productId, requestType) {

		if (!HC.isSubmitted) {
			// 多重実行を防止
			HC.isSubmitted = true;

		    this._init(pageBlockId, productId, requestType);

            // Ajax リクエスト
		    HC.Ajax.json(this.pageBlockId, this.complete, 'prdid=' + this.productId + '&' + this.requestType + '=true', 
                         false, 'dy_ReqEbkBtn', 'dy_ReqEbkBtn', this.error);

        }
	},


	/**
	 * Ajax成功時コールバック処理.
	 *
	 * @param json APIからのレスポンス
	 */
	complete : function(json) {

		var rewriteElements = prdMailRegistAjax.buttonClone.children();
		var rewriteHtmlParts = [
			{ "requestType": "ebkReqExec", "text": "メールを登録する", "classAttr": "stRequest" }, 
			{ "requestType": "ebkReqCancel", "text": "メール登録を解除する", "classAttr": "stInvert" }
		];

		var regExp = new RegExp(rewriteHtmlParts[0].text);
		var rewriteHtmlIndex = (rewriteElements.text().match(regExp)) ? 1 : 0;

		var removeClassIndex = (rewriteHtmlIndex == 0) ? 1 : 0;
		rewriteElements.removeClass(rewriteHtmlParts[removeClassIndex].classAttr);
		rewriteElements.addClass(rewriteHtmlParts[rewriteHtmlIndex].classAttr);

		rewriteElements.text(rewriteHtmlParts[rewriteHtmlIndex].text);

		rewriteElements.removeAttr('onclick');
		rewriteElements.off();
		rewriteElements.click(function() {
			prdMailRegistAjax.add(prdMailRegistAjax.pageBlockId, prdMailRegistAjax.productId, rewriteHtmlParts[rewriteHtmlIndex].requestType);
		});

		jQuery(prdMailRegistAjax.selector).html(prdMailRegistAjax.buttonClone);
		HC.isSubmitted = false;
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
			if (!parameters[i].match(/^(prdid=|ebkReqExec=|ebkReqCancel=)/)) {
				newParameters.push(parameters[i]);
			}
		}

		var linkUrl = window.location.pathname + '?prdid=' + prdMailRegistAjax.productId;
		if (newParameters.length > 0) {
			linkUrl = linkUrl + '&' + newParameters.join('&');
		}
        
		// リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
		var formElement = jQuery('#form_id_dy_ReqEbkBtn');
		formElement.attr('action', linkUrl);
		formElement.submit();
	}
}
