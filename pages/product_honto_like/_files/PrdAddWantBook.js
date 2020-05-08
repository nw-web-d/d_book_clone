/**
 * @fileOverview ほしい本に追加するボタン共通スクリプト.
 * @name prdAddWantBook.js
 */
jQuery.noConflict();

var prdWantBookAjax = {

	/** 商品ID **/
	productId : '',

	/** ほしい本の商品ID **/
	wantProductId : '',

	/** プラグインブロックID **/
	pageBlockId : '',

	/** セレクタ **/
	selecter : {},

	/** セレクタ(ハイブリット商品リスト) **/
	selecterHbPrdList : {},

	/** 追加ボタンのクローン **/
	buttonClone : {},

	/** 追加リンクのクローン **/
	linkClone : {},

	/** 表示タイプ **/
	displayType : '',

	/**
	 * 「ほしい本に追加する」ボタン押下時の処理関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param productId 商品ID
	 * @param wantProductId ほしい本の商品ID
	 * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcDetail:PCの詳細画面(アクションエリア) pcDetailHbPrdList:PCの詳細画面(ハイブリット商品リスト) sp:SPの画面)
	 */
	add : function(pageBlockId, productId, wantProductId, displayType) {

		if (!HC.isSubmitted) {
			// 多重実行を防止
			HC.isSubmitted = true;

			this._clearMessage(productId);
			this._init(pageBlockId, productId, wantProductId, displayType);

			// ローディング画像出しわけ設定
			this._setLoadingImage();

			if (displayType === 'pcDetailHbPrdList') {
				HC.Ajax.json(this.pageBlockId, this.complete, 'prdid=' + this.productId + '&regWant=1&wantPrdId=' + this.wantProductId, false, 'dy_img_hbPrdList_' +
						this.productId, 'dy_addWntBk_hbPrdList_' + this.wantProductId, this.error);
			} else {
				HC.Ajax.json(this.pageBlockId, this.complete, 'prdid=' + this.productId + '&regWant=1&wantPrdId=' + this.wantProductId, false, 'dy_img_' +
						this.productId, 'dy_addWntBk_' + this.wantProductId, this.error);
			}
		}
	},

	/**
	 * 設定関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param productId 商品ID
	 * @param wantProductId ほしい本の商品ID
	 * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcDetail:PCの詳細画面 sp:SPの画面)
	 */
	_init : function(pageBlockId, productId, wantProductId, displayType) {
		this.productId = productId;
		this.pageBlockId = pageBlockId;
		this.wantProductId = wantProductId;
		this.selecter = '#dy_addWntBk_' + wantProductId;
		this.selecterHbPrdList = '#dy_addWntBk_hbPrdList_' + wantProductId;
		this.buttonClone = jQuery(this.selecter).children().clone(true);
		this.linkClone = jQuery(this.selecterHbPrdList).children().clone(true);
		this.displayType = displayType;
	},

	/**
	 * 既存メッセージを除去.
	 *
	 * @param productId 商品ID
	 */
	_clearMessage : function(productId) {
		// ページ上部に表示されているメッセージがあれば除去(SPのみ)
		if (jQuery('#dy_wntBkMsg').size()) {
			jQuery('#dy_wntBkMsg').hide();
		}

		// 同一商品に対するメッセージがすでに存在すれば除去
		if (jQuery('*[name=dy_wntBkMsg_' + prdWantBookAjax.wantProductId + ']').size()) {
			jQuery('*[name=dy_wntBkMsg_' + prdWantBookAjax.wantProductId + ']').remove();
		}
	},

	/**
	 * Ajax成功時コールバック処理.
	 *
	 * @param json APIからのレスポンス
	 */
	complete : function(json) {

		if (!json) {
			prdWantBookAjax.error();
			return;
		}

		if (json.result.status === '1') {
			// 処理成功時、登録済みリンクに切替
			if (prdWantBookAjax.displayType === 'pcDetail' || prdWantBookAjax.displayType === 'pcDetailHbPrdList') {
				jQuery(prdWantBookAjax.selecter).replaceWith(prdWantBookAjax._createLink());
				jQuery(prdWantBookAjax.selecterHbPrdList).replaceWith(prdWantBookAjax._createLinkHbPrdList());

			} else {
				jQuery(prdWantBookAjax.selecter).children().replaceWith(prdWantBookAjax._createLink());
			}

			// 詳細画面の「ほしい本の一覧を見る」リンクを除去
			if (jQuery('#dy_wntBkLnk_' + prdWantBookAjax.productId).size()) {
				jQuery('#dy_wntBkLnk_' + prdWantBookAjax.productId).hide();
			}

		} else {
			if (prdWantBookAjax.displayType === 'pcDetailHbPrdList') {
				// 処理失敗時、ローディング画像をほしい本リンクに戻す
				jQuery(prdWantBookAjax.selecterHbPrdList).html(prdWantBookAjax.linkClone);
			} else {
				// 処理失敗時、ローディング画像をほしい本ボタンに戻す
				jQuery(prdWantBookAjax.selecter).html(prdWantBookAjax.buttonClone);
			}
		}

		// メッセージ表示
		if (json.result.msg) {
			var message = prdWantBookAjax._createMessage(json.result.msg);

			if (prdWantBookAjax.displayType === 'pcList') {
				jQuery(prdWantBookAjax.selecter).closest('ul').prepend(message);
			} else {
				jQuery(prdWantBookAjax.selecter).closest('p').before(message);
			}
		}

		// PCの場合はローディング画像の定義を初期設定に戻す
		if (prdWantBookAjax.displayType.match(/^pc/)) {
			HC.Ajax.loadingImage = '/library/img/pc/corusel_loading.gif';
		}

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
			if (!parameters[i].match(/^(regWant=|prdid=|delHst=|delHstAll=|wantPrdId=|havePrdId=)/)) {
				newParameters.push(parameters[i]);
			}
		}

		// リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
		var linkUrl = window.location.pathname + '?regWant=1&wantPrdId=' + prdWantBookAjax.wantProductId + '&prdid=' + prdWantBookAjax.productId;

		if (newParameters.length > 0) {
			linkUrl = linkUrl + '&' + newParameters.join('&');
		}
		window.location.href = linkUrl;

	},

	/**
	 * ほしい本一覧画面へのリンク要素を生成.
	 *
	 * @return linkObj ほしい本一覧画面へのリンク要素
	 */
	_createLink : function() {

		var linkObj = jQuery('<p/>').append(jQuery('<a/>', {href : '/my/wishlist.html'}));
		var linkText = '<span class="stBtn stUserAction stWish stSizeL stCurrent">ほしい本一覧へ</span>';
		var linkTextSp = '<button class="stBtn stUserAction stWish stCurrent">ほしい本一覧へ</button>';

		if (prdWantBookAjax.displayType === 'pcList') {
			linkObj.html(linkText);
		} else if (prdWantBookAjax.displayType === 'pcDetail' || prdWantBookAjax.displayType === 'pcDetailHbPrdList') {
			linkObj.attr('id', 'dy_addWntBk_' + prdWantBookAjax.wantProductId);
			linkObj.children().html(linkText);
		} else if(prdWantBookAjax.displayType === 'sp'){
			linkObj = jQuery('<p/>').append(jQuery('<a/>', {href : '/my/wishlist.html'}));
			linkObj.children().append(linkTextSp);
		} else {
			linkObj.children().append(linkText);
		}

		if (window != parent) {
			// ポップアップの場合は、親画面で遷移するようにclass属性を付与
			linkObj.children().addClass('stTargetTop');
		}

		return linkObj;
	},

	/**
	 * ほしい本一覧画面へのリンク要素を生成.(ハイブリット商品リスト)
	 *
	 * @return linkObj ほしい本一覧画面へのリンク要素
	 */
	_createLinkHbPrdList : function() {

		var linkObj = jQuery('<span/>').append(jQuery('<a/>', {href : '/my/wishlist.html'}));
		var linkText = '<span class="stBtn stUserAction stWish stCurrent">ほしい本一覧へ</span>';

		linkObj.attr('id', 'dy_addWntBk_hbPrdList_' + prdWantBookAjax.wantProductId);
		linkObj.children().html(linkText);

		if (window != parent) {
			// ポップアップの場合は、親画面で遷移するようにclass属性を付与
			linkObj.children().addClass('stTargetTop');
		}

		return linkObj;
	},

	/**
	 * メッセージの要素を生成.
	 *
	 * @param message メッセージ
	 * @return messageObj メッセージ要素
	 */
	_createMessage : function(message) {

		var messageObj = {};

		if (prdWantBookAjax.displayType === 'pcList') {
			messageObj = jQuery('<span/>').append(message);
			messageObj.addClass('stErrorMsg');
		} else if (prdWantBookAjax.displayType === 'pcDetail' || prdWantBookAjax.displayType === 'pcDetailHbPrdList') {
			messageObj = jQuery('<p/>').append(message);
			messageObj.addClass('stErrorMsg');
		} else {
			messageObj = jQuery('<ul/>').append(jQuery('<li/>').append(jQuery('<strong/>').append(message)));
			messageObj.addClass('stListError');
		}

		// メッセージ削除のため、name属性指定
		messageObj.attr('name', 'dy_wntBkMsg_' + prdWantBookAjax.wantProductId);

		return messageObj;
	},

	/**
	 * ローディング画像を設定する.
	 */
	_setLoadingImage : function() {

		// PCの場合
		if (prdWantBookAjax.displayType.match(/^pc/)) {
			HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif';
		}
	}

}