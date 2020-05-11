/**
 * @fileOverview 電子の予約するボタン共通スクリプト.
 * @name ReserveEBook.js
 */

jQuery.noConflict();

var reserveEBook = {

	/** 商品ID **/
	productId : '',

	/** エリアセレクタID **/
	areaSelecterId : '',

	/** プラグインブロックID **/
	pageBlockId : '',

	/** ボタンイメージテキスト **/
	buttonImageText : '',

	/** 予約ボタンのクローン **/
	buttonClone : {},

	/** 電子書籍予約一覧画面リンク(PC) **/
	eBookReservationListLinkPc : '',

	/** 電子書籍予約一覧画面リンク(SP) **/
	eBookReservationListLinkSp : '',

	/** 表示タイプ **/
	displayType : '',

	/** アクションエリアセレクタ **/
	actionAreaSelecter : {},

	/** アクションメッセージエリアセレクタ **/
	actionMessageSelecter : {},

	/** 識別子（画面内重複IDに対する識別） **/
	identifier : '',

	/** キャンペーンID **/
	cid : '',

	/** 続刊予約モーダルウィンドウ表示フラグ **/
	continuationModalFlg : '',

	/** 続刊予約申し込みボタンID **/
	continuationButtonId : '',

	/** 多重実行抑止 **/
	setDoubleClickFlg : function(flg) {
		HC.isSubmitted = flg;
	},

	/**
	 * 「予約する」ボタン押下時の処理関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param identifier 識別子（画面内重複IDに対する識別）
	 * @param productId 商品ID
	 * @param displayType 表示タイプ(pc         :PCの画面
	 *                               pcList1    :PCの一覧系画面（検索結果一覧、新刊予約一覧）
	 *                               pcList2    :PCの一覧系画面（レビュー一覧、My系一覧、ランキング）
	 *                               pcImage    :PCの一覧系画面（イメージ表示）
	 *                               pcDetail   :PCの詳細画面
	 *                               pcCampaign1:PCのキャンペーン画面
	 *                               pcCampaign2:PCのキャンペーン画面
	 *                               pcCampaign3:PCのキャンペーン画面
	 *                               sp         :SPの画面
	 *                               spCarousel :SPのカルーセルブロック
	 *                               spList     :SPの一覧系画面
	 *                               spMy       :SPのMy系画面
	 *                               spRanking  :SPのランキング画面
	 *                               spCampaign :SPのキャンペーン画面)
	 * @param continuationModalFlg 続刊予約モーダルウィンドウ表示フラグ
	 * @param continuationButtonId 続刊予約申し込みボタンID(シリーズID＋連番)
	 */
	reserve : function(pageBlockId, identifier, productId, displayType, continuationModalFlg, continuationButtonId) {

		if (!HC.isSubmitted) {
			// 多重実行を防止
			reserveEBook.setDoubleClickFlg(true);

			// ブラウザバック対応：検索結果のHTML、表示件数、URLをsessionStorageに格納
			if (DY.sessionStorageFlg && displayType.match(/^sp/)) {
				DY.saveSearchContent();
			}

			reserveEBook.init(pageBlockId, identifier, productId, displayType, '', continuationModalFlg, continuationButtonId);

			// ローディング画像出しわけ設定
			reserveEBook.setLoadingImage();

			// サイトカタリストへ分析用データを送信
			reserveEBook.sendCatalystData(productId);

			var queryString = 'reserveEbkPrdId=' + reserveEBook.productId + '&reserveEBook=1';

			HC.Ajax.json(reserveEBook.pageBlockId,
			             reserveEBook.complete,
			             queryString,
			             false,
			             'dy_reserve_ebook_img_' +  identifier + reserveEBook.areaSelecterId,
			             'dy_reserve_ebook_'  + identifier + reserveEBook.areaSelecterId,
			             reserveEBook.error);
		} else {
			// 多重実行時は1.5秒後に実行可能
			setTimeout("reserveEBook.setDoubleClickFlg(false);", 1500);
		}
	},

	/**
	 * 「予約する」ボタン押下時の処理関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param identifier 識別子（画面内重複IDに対する識別）
	 * @param productId 商品ID
	 * @param displayType 表示タイプ(pc         :PCの画面
	 *                               pcList1    :PCの一覧系画面（検索結果一覧、新刊予約一覧）
	 *                               pcList2    :PCの一覧系画面（レビュー一覧、My系一覧、ランキング）
	 *                               pcImage    :PCの一覧系画面（イメージ表示）
	 *                               pcDetail   :PCの詳細画面
	 *                               pcCampaign1:PCのキャンペーン画面
	 *                               pcCampaign2:PCのキャンペーン画面
	 *                               pcCampaign3:PCのキャンペーン画面
	 *                               sp         :SPの画面
	 *                               spCarousel :SPのカルーセルブロック
	 *                               spList     :SPの一覧系画面
	 *                               spMy       :SPのMy系画面
	 *                               spRanking  :SPのランキング画面
	 *                               spCampaign :SPのキャンペーン画面)
	 * @param cid キャンペーンID
	 */
	reservePlusCid : function(pageBlockId, identifier, productId, displayType, cid) {

		if (!HC.isSubmitted) {
			// 多重実行を防止
			reserveEBook.setDoubleClickFlg(true);

			reserveEBook.init(pageBlockId, identifier, productId, displayType, cid, '', '');

			// ローディング画像出しわけ設定
			reserveEBook.setLoadingImage();

			// サイトカタリストへ分析用データを送信
			reserveEBook.sendCatalystData(productId);

			var queryString = 'reserveEbkPrdId=' + reserveEBook.productId + '&reserveEBook=1';

			HC.Ajax.json(reserveEBook.pageBlockId,
			             reserveEBook.complete,
			             queryString,
			             false,
			             'dy_reserve_ebook_img_' +  identifier + reserveEBook.areaSelecterId,
			             'dy_reserve_ebook_'  + identifier + reserveEBook.areaSelecterId,
			             reserveEBook.error);
		} else {
			// 多重実行時は1.5秒後に実行可能
			setTimeout("reserveEBook.setDoubleClickFlg(false);", 1500);
		}
	},

	/**
	 * 設定関数.
	 *
	 * @param pageBlockId プラグインブロックID
	 * @param identifier 識別子（画面内重複IDに対する識別）
	 * @param productId 商品ID
	 * @param displayType 表示タイプ
	 * @param cid キャンペーンID
	 * @param continuationModalFlg 続刊予約モーダルウィンドウ表示フラグ
	 * @param continuationButtonId 続刊予約申し込みボタンID
	 */
	init : function(pageBlockId, identifier, productId, displayType, cid, continuationModalFlg, continuationButtonId) {
		reserveEBook.pageBlockId = pageBlockId;
		reserveEBook.productId = productId;
		reserveEBook.displayType = displayType;
		reserveEBook.identifier = identifier;
		reserveEBook.areaSelecterId = reserveEBook.productId;
		reserveEBook.actionAreaSelecter = '#dy_reserve_ebook_' + identifier + reserveEBook.areaSelecterId;
		reserveEBook.eBookReservationListLinkPc = '<p class="stLink01 stMarginB10"><a href="/my/account/ebookreserve.html">電子予約一覧で確認・キャンセル</a></p>';
		reserveEBook.eBookReservationListLinkSp = '<p class="stDocLink01 stCenter stMgBottom15"><a href="/my/account/ebookreserve.html"><span>電子予約一覧で確認・キャンセル</span></a></p>';
		reserveEBook.actionMessageSelecter = 'dy_reserve_ebook_msg_' + identifier + reserveEBook.areaSelecterId;
		reserveEBook.cid = cid;
		reserveEBook.continuationModalFlg = continuationModalFlg;
		reserveEBook.continuationButtonId = '#dy_reserve_comp_modal_' + continuationButtonId;

		reserveEBook.clearMessage();
		// メッセージクリア後にクローン
		reserveEBook.buttonClone = jQuery(reserveEBook.actionAreaSelecter).children().clone(true);
	},

	/**
	 * Ajax成功時コールバック処理.
	 *
	 * @param json APIからのレスポンス
	 */
	complete : function(json) {

		if (!json) {
			reserveEBook.error();
			return;
		}

		var resPrdId = reserveEBook.areaSelecterId;

		resPrdId = json.prdId;

		if ('true' === json.result || 'ERROR_RESERVED' === json.code) {

			// 予約済みボタンに変更
			if (reserveEBook.displayType.match(/^pc/)) {
				// PCの場合

				if (reserveEBook.displayType === 'pcCarousel') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeXS stDisabled">予約済み</span></p>');
					jQuery('#dy_reserve_ebook_msg_success').prepend('<span name="dy_reserve_ebook_msg_success">予約しました <span class="stLink01"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></span></span>');

				} else if (reserveEBook.displayType === 'pcDetail') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<p><span class="stBtn stCart stSizeL stBranch01 stDisabled">予約済み</span></p>' + reserveEBook.eBookReservationListLinkPc);
					jQuery('#dy_reserve_ebook_actionAreaPc_' + resPrdId).html('<p><span class="stBtn stCart stSizeL stBranch01 stDisabled">予約済み</span></p>' + reserveEBook.eBookReservationListLinkPc);
					jQuery('#dy_reserve_ebook_lineupPc_' + resPrdId).html('<li><span class="stBtn stSizeM stBranch01 stDisabled">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);

				} else if (reserveEBook.displayType === 'pcCampaign1') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stMarginB05"><span class="stBtn stSizeM stBranch01 stDisabled">予約済み</span></p>' + '<p class="stLink01 stMarginB10"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign1SrsFirst') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stMarginB05"><span class="stBtn stSizeM stDisabled stSeriesReserved">始めの巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a class="stFont14px" href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign1SrsLatest') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stMarginB05"><span class="stBtn stSizeM stDisabled stSeriesReserved">最新巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a class="stFont14px" href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign2') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stBranch04">予約済み</span></p>' + '<p class="stLink01 stMarginB10"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign2SrsFirst') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stSeriesReserved">始めの巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign2SrsLatest') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stSeriesReserved">最新巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign3') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stBranch04">予約済み</span></p>' + '<p class="stLink01 stMarginB10"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign3SrsFirst') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stSeriesReserved">始めの巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcCampaign3SrsLatest') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<p class="stBtn"><span class="stBtn stAction stSizeM stDisabled stSeriesReserved">最新巻を<br/>予約済み</span></p>' + '<p class="stLink01 stMarginB10" style="text-align: left"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else if (reserveEBook.displayType === 'pcList1') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<li><span class="stBtn stSizeM stBranch01 stDisabled">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);
					jQuery('#dy_reserve_ebook_actionAreaPc_' + resPrdId).html('<p><span class="stBtn stCart stSizeL stBranch01 stDisabled">予約済み</span></p>' + reserveEBook.eBookReservationListLinkPc);
					jQuery('#dy_reserve_ebook_lineupPc_' + resPrdId).html('<li><span class="stBtn stSizeM stBranch01 stDisabled">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);

				} else if (reserveEBook.displayType === 'pcList2') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<li><span class="stBtn stSizeM stBranch01 stDisabled">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);

				} else if (reserveEBook.displayType === 'pcImage') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<li><span class="stBtn stAction stSizeM stDisabled stBranch04">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);

				} else if (reserveEBook.identifier == 'lb_') {
					jQuery('#dy_reserve_ebook_lb_' + resPrdId).html('<span class="stBtn stAction stEbBtn stSizeM stDisabled stBranch04">予約済み</span>' + '<p class="stLink01 stFont11px stMarginB00"><a href="/my/account/ebookreserve.html">予約一覧を見る</a></p>');

				} else {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<li><span class="stBtn stSizeM stEbBtn stBranch01 stDisabled">予約済み</span></li>' + reserveEBook.eBookReservationListLinkPc);
				}

			} else if (reserveEBook.displayType.match(/^sp/)) {
				// SPの場合
				if (reserveEBook.displayType === 'spCarousel') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<p><button type="button" class="stBtn stSizeXS" disabled="disabled">' + '予約済み' + '</button></p>' + '<p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧</span></a></p>');
					jQuery('#dy_reserve_ebook_msg_success').prepend('<strong name="dy_reserve_ebook_msg_success">予約しました</strong>');

				} else if (reserveEBook.displayType === 'spList') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<button type="button" class="stBtn stCart stSizeM" disabled="disabled">' + '予約済み' + '</button>' + '<p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');
					jQuery('#dy_reserve_ebook_toggleBoxSp_' + resPrdId).html('<button type="button" class="stBtn stSizeM" disabled="disabled">' + '予約済み' + '</button>' + '<p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spMy') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<button type="button" class="stBtn stCart stSizeM" disabled="disabled">' + '予約済み' + '</button>' + '<p class="stDocLink01 stCenter stPdTop03"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spRanking') {
					jQuery('#dy_reserve_ebook_' + resPrdId).html('<button type="button" class="stBtn stCart stSizeM" disabled="disabled">' + '予約済み' + '</button>' + '<p class="stDocLink01 stCenter"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spCampaign') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<button type="button" class="stBtn stSizeS" disabled="disabled">' + '予約済み' + "</button>" + '<p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spCampaignSrsFirstSingle') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<button type="button" class="stBtn stSizeM stSeriesFirstLatest" disabled="disabled"><span>始めの巻を</span>予約済み</button><p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spCampaignSrsLatestSingle') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<button type="button" class="stBtn stSizeM stSeriesFirstLatest" disabled="disabled"><span>最新巻を</span>予約済み</button><p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spCampaignSrsFirstMultiple') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<button type="button" class="stBtn stSizeS stCpSizeS stSeriesFirstLatest" disabled="disabled"><span>始めの巻を</span>予約済み</button><p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.displayType === 'spCampaignSrsLatestMultiple') {
					jQuery('#dy_reserve_ebook_' + reserveEBook.identifier + resPrdId).html('<button type="button" class="stBtn stSizeS stCpSizeS stSeriesFirstLatest" disabled="disabled"><span>最新巻を</span>予約済み</button><p class="stDocLink01"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else if (reserveEBook.identifier == 'lb_') {
					jQuery('#dy_reserve_ebook_lb_' + resPrdId).html('<p class="stMgBottom00"><button type="button" class="stBtn stSizeXS" disabled="disabled">' + '予約済み' + "</button></p>" + '<p class="stDocLink01 stMgTop05 stMgBottom00"><a href="/my/account/ebookreserve.html"><span>予約一覧を見る</span></a></p>');

				} else {
					jQuery('#dy_reserve_ebook_' + resPrdId).html("<ul class='stFormListButton01 stMgBottom10'><li><button type='button' class='stBtn stSizeM' disabled='disabled'>" + '予約済み' + "</button></li></ul>" + reserveEBook.eBookReservationListLinkSp);
					jQuery('#dy_reserve_ebook_actionAreaSp_' + resPrdId).html("<ul class='stFormListButton01 stMgBottom10'><li><button type='button' class='stBtn stSizeM' disabled='disabled'>" + '予約済み' + "</button></li></ul>" + reserveEBook.eBookReservationListLinkSp);
					jQuery('#dy_reserve_ebook_lineupSp_' + resPrdId).html("<ul class='stFormListButton01 stMgBottom10'><li><button type='button' class='stBtn stSizeM' disabled='disabled'>" + '予約済み' + "</button></li></ul>" + reserveEBook.eBookReservationListLinkSp);
				}

				// ブラウザバック対応：sessionStorageの内容を削除
				jQuery("a").on("click", function() {
					DY.deleteSearchContent(jQuery(this).attr("href"));
				});
			}

			reserveEBook.setDoubleClickFlg(false);

		} else {
			// 処理失敗時、ローディング画像を予約するボタンに戻す
			jQuery(reserveEBook.actionAreaSelecter).html(reserveEBook.buttonClone);

			reserveEBook.setDoubleClickFlg(false);
		}

		// メッセージ表示
		if (('false' === json.result && json.message != null && json.message.length > 0) ||
				('true' === json.result && json.message != null && json.message.length > 0 && reserveEBook.isAlert(json.code))) {

			var message = reserveEBook.createMessage(json.message);

			if (reserveEBook.displayType.match(/^pcList/) || reserveEBook.displayType === 'pcImage') {
				jQuery(reserveEBook.actionAreaSelecter).prepend(message);

			} else if (reserveEBook.displayType.match(/^pcCampaign/)) {
				jQuery('#dy_reserve_ebook_msg_' + reserveEBook.identifier + resPrdId).prepend(message);

			} else if (reserveEBook.displayType === 'spCampaign') {
				jQuery('#dy_reserve_ebook_msg_' + reserveEBook.identifier + resPrdId).prepend(message);

			} else if (reserveEBook.displayType === 'pcCarousel') {
				jQuery('#dy_reserve_ebook_msg_error').prepend(message);

			} else if (reserveEBook.displayType === 'spCarousel') {
				jQuery('#dy_reserve_ebook_msg_error').prepend(message);

			} else if (reserveEBook.displayType === 'spList') {
				jQuery(reserveEBook.actionAreaSelecter).parent().after(message);

			} else if (reserveEBook.identifier === 'lb_') {
				jQuery(reserveEBook.actionAreaSelecter).parent().parent().prepend(message);

			} else {
				if (!reserveEBook.identifier) {
					jQuery('#dy_reserve_ebook_' + resPrdId).before(message);
				} else {
					jQuery(reserveEBook.actionAreaSelecter).before(message);
				}
			}
		}

		// PCの場合はローディング画像の定義を初期設定に戻す
		if (reserveEBook.displayType.match(/^pc/)) {
			HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif';
		}

		// 予約処理成功、かつ、続刊予約モーダルウィンドウ表示する場合
		if (json.result === 'true' && reserveEBook.continuationModalFlg === 'true') {
			jQuery(reserveEBook.continuationButtonId).click();
		}
	},

	/**
	 * アラートコードチェック.
	 * @param code json.code
	 * @return boolean codeがアラートの場合true、アラートでない場合false
	 */
	isAlert : function(code) {

		if ('ALERT_ALL_TERMINAL_UNSUPPORTED' === code ||
				'ALERT_TERMINAL_UPDATE' === code ||
				'ALERT_SOME_TERMINAL_UNSUPPORTED' === code) {
			return true;
		}
		return false;
	},

	/**
	 * 既存メッセージを除去.
	 */
	clearMessage : function() {
		// 上部に表示されているメッセージがあれば除去
		if (jQuery("*[name='dy_reserve_ebook_msg_success']").size()) {
			jQuery("*[name='dy_reserve_ebook_msg_success']").hide();
		}

		if (jQuery("*[name='dy_reserve_ebook_msg_error']").size()) {
			jQuery("*[name='dy_reserve_ebook_msg_error']").hide();
		}

		// 同一商品に対するメッセージがすでに存在すれば除去
		if (jQuery('*[name=' + reserveEBook.actionMessageSelecter + ']').size()) {
			jQuery('*[name=' + reserveEBook.actionMessageSelecter + ']').remove();
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

		// 現在のURLについているパラメータを付加
		var newParameters = [];
		var parameters = window.location.search.substring(1).split('&');
		for ( var i = 0; i < parameters.length; i++) {
			if (!parameters[i].match(/^(reserveEbkPrdId=|reserveEBook=|pageBlockId=)/)) {
				newParameters.push(parameters[i]);
			}
		}

		// リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
		var linkUrl = window.location.pathname + '?reserveEbkPrdId=' + reserveEBook.productId + '&reserveEBook=1' + '&pageBlockId=' + reserveEBook.pageBlockId;
		if (newParameters.length > 0) {
			linkUrl = linkUrl + '&' + newParameters.join('&');
		}
		window.location.href = linkUrl;
	},

	/**
	 * メッセージの要素を生成.
	 *
	 * @param message メッセージ
	 * @return messageObj メッセージ要素
	 */
	createMessage : function(message) {

		var messageObj = {};

		if (reserveEBook.displayType.match(/^pcList/) || reserveEBook.displayType === 'pcImage' || reserveEBook.displayType === 'pc' || (reserveEBook.displayType === 'pc' && reserveEBook.identifier === 'lb_')) {
			messageObj = jQuery('<span/>').append(message);
			messageObj.addClass('stErrorMsg');

		} else if (reserveEBook.displayType.match(/^pcCampaign/)) {
			messageObj = jQuery('<p/>').append(jQuery('<strong/>').append(message));
			messageObj.addClass('stErrorMsg');

		} else if (reserveEBook.displayType === 'pcDetail') {
			messageObj = jQuery('<p/>').addClass('stSection01');
			messageObj.append(jQuery('<span/>').addClass('stErrorMsg').append(message));

		} else if (reserveEBook.displayType === 'pcCarousel') {
			messageObj = jQuery('<p/>').append(message);
			messageObj.attr('name', 'dy_reserve_ebook_msg_error');
			return messageObj;

		} else if (reserveEBook.displayType === 'spCarousel') {
			messageObj = jQuery('<li/>').append(jQuery('<strong/>').append(message));
			messageObj.attr('name', 'dy_reserve_ebook_msg_error');
			return messageObj;

		} else {
			messageObj = jQuery('<ul/>').append(jQuery('<li/>').append(jQuery('<strong/>').append(message)));
			messageObj.addClass('stListError');
		}

		// メッセージ削除のため、name属性指定
		messageObj.attr('name', reserveEBook.actionMessageSelecter);

		return messageObj;
	},

	/**
	 * ローディング画像を設定する.
	 */
	setLoadingImage : function() {

		// PCの場合
		if (reserveEBook.displayType.match(/^pc/)) {
			HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif';
		}
	},

	/**
	 * Adobe Analytics（サイトカタリスト）へ分析データを送信する.
	 *
	 * @param catalystProperties 分析データ
	 */
	sendCatalystData : function(productId) {
		try {
			s = s_gi( s_account );
			s.events = 'event47';
			s.products = ';2-' + productId + ';1;;;';
			s.linkTrackEvents = 'event47';
			s.linkTrackVars = 'events,products';
			s.tl(true, 'o', 'ebook-reserve-' + productId);
		} catch (e) {
		} finally {
			return true;
		}
	}
}
