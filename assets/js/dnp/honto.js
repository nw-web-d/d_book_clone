/**
 * @fileOverview 基盤共通機能用ファイル
 * @name honto.js
 */

/**
 * Honto基底名前空間
 * @namespace Honto基底名前空間
 */
var Honto = {};

/**
 * 基盤共通機能名前空間.
 * @namespace 基盤共通機能名前空間
 */
var HC = Honto.Common = {

	/**
	 * サブミット済みフラグ.<br>
	 * PC,SPの二重送信防止機能で使用.<br>
	 */
	isSubmitted : false,

	/**
	 * PC バルーン機能データ保持用名前空間.
	 * @namespace PC版バルーン機能データ保持用名前空間
	 */
	Ballon : {
		data : {}
	},

	/**
	 * デバッグ用フラグ.<br>
	 * ローカルでテストする際に必要だったため作成.<br>
	 * 呼び出し元で呼び出し前に変数_HONTO_DEBUGを定義することでtrueとなる.<br>
	 */
	DEF_DBG : (typeof (_HONTO_DEBUG) != "undefined"),

	/**
	 * 数字3桁カンマ区切り関数.<br>
	 * 数字または数値を引数とし、3桁カンマ区切りをした文字列を返却する.<br>
	 * @param value   対象の数字または数値.
	 * @returns 3桁カンマ区切りをした文字列.
	 */
	formatSeparator1000 : function(value) {
		value = parseFloat(value).toString();
		return value.replace(/^(-)?(\d{1,2})?((?:\d{3})*)((?:\d{3})(?:\.\d+)?)$/, function() {
			var args = arguments;
			return (args[1] || "") + ((args[2]) ? args[2] + "," : "") +
					((args[3]) ? args[3].replace(/(\d{3})/g, "$1,") : "") + args[4];
		});
	},

	/**
	 * PC 動画再生機能用引数配列.<br>
	 * ドキュメント読み込み完了前に以下のように指定することで対象要素に動画再生機能を適用する。<br>
	 * <pre>
	 * HC.lodMovieParams.push([
	 *   "対象要素jQueryセレクタ表現",
	 *   "mp4使用時代替画像ファイルパス",
	 *   "mp4ファイルパス",
	 *   "flv使用時代替画像ファイルパス",
	 *   "flvファイルパス"
	 * ]);
	 * </pre>
	 */
	loadMovieParams : [],

	/**
	 * sorryページURL.<br>
	 * ページ読み込み時にFWにて設定される前提.<br>
	 */
	sorryPage : "",

	/**
	 * IFrame用画面チェック関数.<br>
	 * IFrameで表示されるべき画面にて読み込み時に呼び出すことで、<br>
	 * ブラウザトップウィンドウで表示された場合にsorryページへ遷移する.<br>
	 * ただし、Site Publis管理画面の場合は遷移しない.<br>
	 * @param isSitePublisStaff  Site Publis 管理画面であるか否か. 管理画面の場合1、そうでない場合0
	 */
	checkIFrame : function(isSitePublisStaff) {
		if (!isSitePublisStaff && window == top)
			// Site Publis管理画面でなく、かつブラウザトップウィンドウで表示されている場合

			// sorryページへ遷移
			location.replace(HC.sorryPage);
	},

	/**
	 * A要素hrefハッシュ切り出し関数.<br>
	 * A要素のjQeryオブジェクトを引数に指定することで<br>
	 * そのhref属性のURLからハッシュ(#～)以前を除去する.<br>
	 * Ajax受信HTMLの場合、A要素のhrefが単にハッシュのみだったとしても<br>
	 * IEでは自動的に現在URLが先頭に付加されてしまう。<br>
	 * これに対するスクリプト機能適用時、PC版ライトボックスのインライン、IFrame型が動作しなくなる.<br>
	 * これに対応するため作成した.<br>
	 * @param a  A要素のjQeryオブジェクト
	 */
	cutOutHrefHash : function(a) {
		a.attr("href", a.attr("href").replace(/^[^#]+(?=#)/, ""));
	}
};

/**
 * 基盤Ajax関連機能名前空間.
 * @namespace 基盤Ajax関連機能名前空間.
 */
Honto.Common.Ajax = {

	/**
	 * Ajax通信対象URL<br>
	 * ページ読み込み時にFWにて設定される前提.<br>
	 */
	url : null,

	/**
	 * ブロックデータ格納用オブジェクト.<br>
	 * Ajax通信時に自プラグインを識別する情報を付加するために使用する.<br>
	 * 以下の形式でFWによりデータが設定される前提.<br>
	 * <pre>
	 * {
	 *   ページブロックID : { blockId : ブロックID, className : クラス名 },
	 *    :
	 * }
	 * </pre>
	 */
	blockData : {},

	/**
	 * ローディングアニメーション画像パス.<br>
	 */
	loadingImage : HC.DEF_DBG ? "./library/img/pc/corusel_loading.gif" : "//image.honto.jp/library/img/pc/corusel_loading.gif",

	/**
	 * ローディングアニメーション画像高さ(px).<br>
	 * 表示縦位置を中央にするために必要.<br>
	 */
	loadingImageHeight : 22,

	/**
	 * ローディングアニメーション表示用関数.<br>
	 * SPの場合はrun.jsから設定される.<br>
	 * @param width     アニメーション表示対象要素の幅(px)
	 * @param height    アニメーション表示対象要素の高さ(px)
	 * @param container アニメーション表示対象要素のjQueryオブジェクト
	 */
	loadingFunction : null,

	/**
	 * Honto.Common.Ajax.updateで要素更新後に実行する関数.<br>
	 * PC,SPのun.jsから設定される.<br>
	 * @param container 更新対象要素のjQueryオブジェクト
	 */
	onUpdateFunction : null,

	/**
	 * Ajax要求処理リダイレクト時先頭正規表現.<br>
	 */
	redirectPageHead : /^<\!DOCTYPE html/i
};

/**
 * jQuery$使用処理
 */
(function($) {

	/**
	 * 要素jQueryオブジェクト取得関数.<br>
	 * 要素のIDか要素自体を引数としてそのjQueryオブジェクトを返却する.<br>
	 * @param id      対象要素のIDもしくは要素自体
	 * @returns 対象要素のjQueryオブジェクト
	 */
	function $id(id) {
		if (typeof id == "string") {
			return $("#" + id);
		} else {
			return $(id);
		}
	}
	;

	/**
	 * Ajax用名前空間拡張.<br>
	 */
	$.extend(Honto.Common.Ajax, {

		/**
		 * ブロック、またはブロック内要素をAjaxにより更新する関数.<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param container      更新対象要素IDまたは要素オブジェクト.<br>
		 *                       指定しない(またはnull)の場合はブロック全体を更新する.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param element        処理完了まで再実行させたくない場合、起因となる要素またはそのIDを指定する.<br>
		 * @param onComplete     Ajax受信時実行関数.<br>
		 */
		update : function(pageBlockId, container, parameters, isAppendQuery, element, onComplete) {
			var isPart = (container != null);
			container = $id(container || 'pbBlock' + pageBlockId);
			if (container.length == 0) {
				// 空文字の場合は処理しない
				return;
			}
			element = $id(element);
			if (Honto.Common.Ajax._ready(element, container) == false) {
				// element指定時、前回実行が完了していない場合は処理しない
				return;
			}
			parameters = Honto.Common.Ajax._getParameters(pageBlockId, parameters, {
				isPart : isPart,
				noResponse : false
			}, isAppendQuery);
			$.ajax({
				cache : false,
				data : parameters,
				dataType : "html",
				type : "post",
				url : Honto.Common.Ajax.url,
				success : function(data) {
					// リダイレクトされている場合は処理しない
					if (HC.Ajax.redirectPageHead.test(data))
						return;
					container.html(data);
					Honto.Common.Ajax._complete(element);
					if (HC.Ajax.onUpdateFunction) {
						// Ajax要素更新後実行関数が指定されている場合は実行
						HC.Ajax.onUpdateFunction(container);
					}
					if (onComplete) {
						onComplete();
					}
				}
			});
		},

		/**
		 * Ajaxでjsonデータを取得する関数(非同期通信).<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param onComplete     Ajax受信時実行関数.指定関数の実行時には仮引数にjsonオブジェクトが渡される.<br>
		 *                       指定しない(またはnull)のときは何もしない.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param element        処理完了まで再実行させたくない場合、起因となる要素またはそのIDを指定する.<br>
		 * @param container      更新対象要素があり、かつそこに処理中アニメーションを表示したい場合に、<br>
		 *                       その要素またはそのIDを指定する.<br>
		 * @param onError        Ajax受信時エラーだった場合、指定された関数を実行する。指定されていない場合は、なにもしない.
		 */
		json : function(pageBlockId, onComplete, parameters, isAppendQuery, element, container, onError) {
			Honto.Common.Ajax._json(pageBlockId, onComplete, parameters, isAppendQuery, element, container, onError, true);
		},

		/**
		 * Ajaxでjsonデータを取得する関数(同期通信).<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param onComplete     Ajax受信時実行関数.指定関数の実行時には仮引数にjsonオブジェクトが渡される.<br>
		 *                       指定しない(またはnull)のときは何もしない.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param element        処理完了まで再実行させたくない場合、起因となる要素またはそのIDを指定する.<br>
		 * @param container      更新対象要素があり、かつそこに処理中アニメーションを表示したい場合に、<br>
		 *                       その要素またはそのIDを指定する.<br>
		 * @param onError        Ajax受信時エラーだった場合、指定された関数を実行する。指定されていない場合は、なにもしない.
		 */
		jsonSync : function(pageBlockId, onComplete, parameters, isAppendQuery, element, container, onError) {
			Honto.Common.Ajax._json(pageBlockId, onComplete, parameters, isAppendQuery, element, container, onError, false);
		},

		/**
		 * Ajaxでテキストデータを取得する関数.<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param onComplete     Ajax受信時実行関数.指定関数の実行時には仮引数にAjaxで返却されるテキストデータが渡される.<br>
		 *                       指定しない(またはnull)のときは何もしない.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param element        処理完了まで再実行させたくない場合、起因となる要素またはそのIDを指定する.<br>
		 * @param container      更新対象要素があり、かつそこに処理中アニメーションを表示したい場合に、<br>
		 *                       その要素またはそのIDを指定する.<br>
		 */
		request : function(pageBlockId, onComplete, parameters, isAppendQuery, element, container) {
			element = $id(element);
			container = $id(container);
			if (onComplete) {
				// Ajax受信時実行関数指定時
				if (Honto.Common.Ajax._ready(element, container) == false) {
					// element指定時、前回実行が完了していない場合は処理しない
					return;
				}
			}
			parameters = Honto.Common.Ajax._getParameters(pageBlockId, parameters, {
				isPart : true,
				noResponse : (onComplete == null)
			}, isAppendQuery);
			$.ajax({
				cache : false,
				data : parameters,
				dataType : "text",
				type : "post",
				url : Honto.Common.Ajax.url,
				success : function(data) {
					// リダイレクトされている場合は処理しない
					if (HC.Ajax.redirectPageHead.test(data))
						return;
					if (onComplete) {
						// Ajax受信時実行関数が指定されている場合はこれを実行
						onComplete(data);
					}
					Honto.Common.Ajax._complete(element);
				}
			});
		},

		/**
		 * Ajaxでjsonデータを取得する内部関数.<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param onComplete     Ajax受信時実行関数.指定関数の実行時には仮引数にjsonオブジェクトが渡される.<br>
		 *                       指定しない(またはnull)のときは何もしない.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param element        処理完了まで再実行させたくない場合、起因となる要素またはそのIDを指定する.<br>
		 * @param container      更新対象要素があり、かつそこに処理中アニメーションを表示したい場合に、<br>
		 *                       その要素またはそのIDを指定する.<br>
		 * @param onError        Ajax受信時エラーだった場合、指定された関数を実行する。指定されていない場合は、なにもしない.<br>
		 * @param asyncFlag      非同期通信、同期通信を指定する. 非同期通信=ture、 同期通信=false
		 */
		_json : function(pageBlockId, onComplete, parameters, isAppendQuery, element, container, onError, asyncFlag) {
			element = $id(element);
			container = $id(container);
			if (onComplete) {
				// Ajax受信時実行関数指定時
				if (Honto.Common.Ajax._ready(element, container) == false) {
					// element指定時、前回実行が完了していない場合は処理しない
					return;
				}
			}
			parameters = Honto.Common.Ajax._getParameters(pageBlockId, parameters, {
				isPart : true,
				noResponse : !!(onComplete == null)
			}, isAppendQuery);
			$.ajax({
				cache : false,
				data : parameters,
				dataType : "json",
				type : "post",
				url : Honto.Common.Ajax.url,
				async : asyncFlag,
				success : function(data) {
					//※リダイレクトは考慮しない(jsonとして評価不能なため処理されない)

					if (onComplete) {
						// Ajax受信時実行関数が指定されている場合はこれを実行
						onComplete(data);
					}
					Honto.Common.Ajax._complete(element);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {

					if(onError) {
						// 設定されている場合のみ、実行する。
						onError(XMLHttpRequest, textStatus, errorThrown);
						Honto.Common.Ajax._complete(element);
					}
				}
			});
		},

		/**
		 * Ajax関連事前処理関数.<br>
		 * @param element      起因となる要素.<br>
		 * @param container    更新対象要素.<br>
		 * @returns 処理続行可能か否か.可能な場合true、そうでない場合false.<br>
		 */
		_ready : function(element, container) {
			if (element.length > 0) {
				// 起因要素指定時
				if (element.context.disabled) {
					// 起因要素のdisabledがtrueの場合は前回処理が実行中とみなす
					return false;
				}
				element.addClass("dyDisabled");
				element.context.disabled = true;
			}
			if (container) {
				// 更新対象要素がある場合、ローディングアニメーションを表示
				container.html("");
				var height = container.height();
				var width = container.width();

				var loading;
				if (HC.Ajax.loadingFunction) {
					// ローディングアニメーション表示用関数が指定されている場合(SP)はこれを実行
					HC.Ajax.loadingFunction(width, height, container);
				} else {
					var image = Honto.Common.Ajax.loadingImage;
					var top = parseInt(container.attr("loadingImageTop"));
					if (isNaN(top))
						top = 0;
					var left = parseInt(container.attr("loadingImageLeft"));
					if (isNaN(left))
						left = 0;
					if (width > 50 && height > 50) {
						// 更新対象要素が何も子要素を持たない場合の高さ・幅がそれぞれ50ピクセルより大きい場合
						// 縦・横の中央位置に表示
						loading = $("<div style='height:100%;width:100%;text-align:center;'>"
								+ "<div style='height:50%;width:100%'></div></div>");
						loading.append($("<img src='" + image + "'" + " style='position:relative;top:" +
								(-(HC.Ajax.loadingImageHeight / 2) + top) + "px;" + "left:" + left + "px;' />"));
					} else if (width > 50) {
						// 更新対象要素が何も子要素を持たない場合の高さが50ピクセル以下、幅が50ピクセルより大きい場合
						// 横の中央位置に表示
						loading = $("<div style='width:100%;text-align:center;position:relative;top:" + top + "px;" +
								+"left:" + left + "px;'></div>");
						loading.append($("<img src='" + image + "' />"));
					} else {
						// それ以外
						// 単に要素内に表示
						loading = $("<img src='" + image + "' style='postion:relativetop:" + top + "px;" + +"left:" +
								left + "px;' />");
					}
					container.append(loading);
				}
			}
			return true;
		},

		/**
		 * Ajax関連事後処理関数.<br>
		 * @param element      起因となる要素.<br>
		 */
		_complete : function(element) {
			if (element.length > 0) {
				// 起因要素が設定されている場合
				setTimeout(function() {
					element.removeClass("dyDisabled");
					element.context.disabled = false;
				}, 100);
			}
		},

		/**
		 * Ajax関連パラメータ生成関数.<br>
		 * @param pageBlockId    対象ページブロックID.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 * @param addition       追加パラメータ.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 * @returns 生成したパラメータオブジェクト.<br>
		 */
		_getParameters : function(pageBlockId, parameters, addition, isAppendQuery) {
			var data = Honto.Common.Ajax.blockData[pageBlockId];
			if (!parameters) {
				// パラメータが設定されていない場合
				parameters = {};
			} else if (typeof (parameters) == "string") {
				// パラメータがクエリパラメータ文字列の場合
				parameters = parameters.toQueryParams();
			} else if (parameters.tagName == 'FORM') {
				// パラメータがFORM要素の場合
				parameters = Form.serialize(parameters).toQueryParams();
			}
			if (isAppendQuery && document.location && document.location.search) {
				// 現在のURLについているパラメータを付加
				parameters = Object.extend(document.location.search.replace(/\+/g, '%20').toQueryParams(), parameters);
			}
			parameters = Object.extend(parameters, addition);
			return Object.extend(parameters, {
				blockId : data.blockId,
				className : data.className
			});
		},

		/**
		 * ページ読み込み完了時にブロック内要素をAjaxにより更新する関数.<br>
		 * @param pageBlockId    対象ページブロックID.FWで設定している$pageBlockId変数を使用すること.<br>
		 * @param container      更新対象要素IDまたは要素オブジェクト.<br>
		 *                       指定しない(またはnull)の場合はブロック全体を更新する.<br>
		 * @param parameters     サーバーに送信するパラメータ.<br>
		 *                       クエリパラメータ文字列の場合は、必要に応じてURLエスケープを行う.<br>
		 *                       スクリプトで使用する場合はオブジェクトが指定可能.<br>
		 *                       各プロパティのキーがname属性、値がvalue属性扱いとなる.<br>
		 * @param isAppendQuery  現在のURLについているパラメータを付加して送信するか否か.<br>
		 *                       デフォルトはfalse(付加しない).<br>
		 * @param onComplete     Ajax受信時実行関数.
		 */
		onload : function(pageBlockId, container, parameters, isAppendQuery, onComplete) {
			$(document).ready(function() {
				Honto.Common.Ajax.update(pageBlockId, container, parameters, isAppendQuery, null, onComplete);
			});
		}
	});

	/**
	 * サブウィンドウオープン用名前空間.
	 * @namespace サブウィンドウオープン用名前空間.
	 */
	Honto.Common.Window = {

		/**
		 * ウィンドウをオープンする関数
		 * @param aUrl 表示するページのアドレス
		 * @param aName ウィンドウ名(初期値=_blank)
		 * @param aStyle ウィンドウスタイル(指定しない場合は幅・高さを親に合わせ、他はブラウザに依存)
		 * @returns オープンした画面のオブジェクト
		 */
		open : function(aUrl, aName, aStyle) {

			if (aStyle == null || aStyle == "") {
				aStyle = HC.Window.Style.createObject(window.screen.width, window.screen.height);
			}
			if (aName == null || aName == "") {
				aName = "_blank";
			}

			var x = aStyle.top;
			var y = aStyle.left;
			var w = aStyle.width;
			var h = aStyle.height;

			if (w == 0) {
				w = window.screen.width;
			}
			if (h == 0) {
				h = window.screen.height;
			}

			var styleTemplate = "top={0},left={1},width={2},height={3},toolbar={4},location={5},"
					+ "status={6},menubar={7},scrollbars={8},resizable={9}";

			var lStyle = String.format(styleTemplate, x, y, w, h, _convertYesNo(aStyle.visibleToolbar),
										_convertYesNo(aStyle.visibleAddressbar),
										_convertYesNo(aStyle.visibleStatusbar), _convertYesNo(aStyle.visibleMenubar),
										_convertYesNo(aStyle.visibleScrollbars), _convertYesNo(aStyle.resizable));

			var whandle = window.open(aUrl, aName, lStyle);
			whandle.focus();

			return whandle;

			function _convertYesNo(value) {
				if (value == true) {
					return "yes";
				} else {
					return "no";
				}
			}
		},

		/**
		 * ウィンドウに関するスタイルのオブジェクトを生成する.
		 * <pre>
		 * 主にHC.Window.openのパラメータに使用.
		 * </pre>
		 * @example
		 * //createObjectでプロパティ値を指定.ステータスバー、メニューバーを非表示で開く
		 * var style = HC.Window.Style.createObject(600,400, true, true, false, false, true, true, 10, 20);
		 * var win = HC.Window.open("http://xxx.jp", "winname", style);
		 * //インスタンスのプロパティで指定.メニューバーを非表示で開く.
		 * var style = HC.Window.Style.createObject();
		 * style.width = 600;
		 * style.height = 400;
		 * style.visibleMenubar = false;
		 * var win = HC.Window.open("http:/xxx.jp", "winname", style);
		 */
		Style : {
			/**
			 * スタイルオブジェクトを生成する.
			 * @param width 画面の幅(ピクセル)(初期値=0)
			 * @param aHeight 画面の高さ(ピクセル)(初期値=0)
			 * @param aVisibleToolbar ツールバーを表示するか(初期値=true)
			 * @param aVisibleAddressbar アドレスバーを表示するか(初期値=true)
			 * @param aVisibleStatusbar ステータスバーを表示するか(初期値=true)
			 * @param aVisibleMenubar メニューバーを表示するか(初期値=true)
			 * @param aVisibleScrollbars スクロールバーを表示するか(初期値=true)
			 * @param aResizable リサイズ可能か(初期値=true)
			 * @param aTop ウィンドウの位置（画面の上端からの距離）(初期値=0)
			 * @param aLeftウィンドウの位置（画面の左端からの距離）(初期値=0)
			 * @returns スタイルオブジェクト
			 */
			createObject : function(aWidth, aHeight, aVisibleToolbar, aVisibleAddressbar, aVisibleStatusbar,
									aVisibleMenubar, aVisibleScrollbars, aResizable, aTop, aLeft) {
				return {
					width : (aWidth || 0),
					height : (aHeight || 0),
					visibleToolbar : (typeof aVisibleToolbar == "boolean") ? aVisibleToolbar : true,
					visibleAddressbar : (typeof aVisibleAddressbar == "boolean") ? aVisibleAddressbar : true,
					visibleStatusbar : (typeof aVisibleStatusbar == "boolean") ? aVisibleStatusbar : true,
					visibleMenubar : (typeof aVisibleStatusbar == "boolean") ? aVisibleStatusbar : true,
					visibleScrollbars : (typeof aVisibleScrollbars == "boolean") ? aVisibleScrollbars : true,
					resizable : (typeof aResizable == "boolean") ? aResizable : true,
					top : (aTop || 0),
					left : (aLeft || 0)
				};
			}
		}
	};

})(jQuery);

/**
 * Stringオブジェクト拡張
 */
/**
 * 文字列フォーマット関数
 * @param format 対象文字列(argumentsから取得)
 * @param str 置き換え文字列(可変個)(argumentsから取得)
 * @returns フォーマット済み文字列
 */
String.format = function() {
	var args = [];
	for ( var i = 0; i < arguments.length; i++)
		args[i] = arguments[i];
	var format = args.shift();

	var reg = /\{((\d)|([1-9]\d+))\}/g;
	return format.replace(reg, function() {
		var index = Number(arguments[1]);
		var result = args[index];
		if (typeof (result) == "undefined")
			throw new Error("arguments[ " + index + " ] is undefined.");
		return result;
	});
};

/**
 * prototype.jsからの部分移植.<br>
 * PC、およびSITE PUBLIS管理画面では<br>
 * prototype.js自体読み込まれてしまうため、<br>
 * 存在判定を入れて衝突を回避している.<br>
 */
/*
 * Prototype JavaScript framework, version 1.5.0 (c) 2005-2007 Sam Stephenson
 *
 * Prototype is freely distributable under the terms of an MIT-style license. For details, see the Prototype web site:
 * http://prototype.conio.net/
 *
 * /*--------------------------------------------------------------------------
 */
if (!window.Prototype) {
	window.$ = function(element) {
		if (arguments.length > 1) {
			for ( var i = 0, elements = [], length = arguments.length; i < length; i++)
				elements.push($(arguments[i]));
			return elements;
		}
		if (typeof (element) == "string")
			element = document.getElementById(element);
		return element;
	};

	Object.extend = function(destination, source) {
		for ( var property in source)
			destination[property] = source[property];
		return destination;
	};

	Object.extend(String.prototype, {
		strip : function() {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		},

		toQueryParams : function(separator) {
			var match = this.strip().match(/([^?#]*)(#.*)?$/);
			if (!match)
				return {};
			return match[1].split(separator || '&').inject({}, function(hash, pair) {
				if ((pair = pair.split('='))[0]) {
					var key = decodeURIComponent(pair.shift()), value = pair.length > 1 ? pair.join('=') : pair[0];
					if (value != undefined)
						value = decodeURIComponent(value);
					if (key in hash) {
						if (!(hash[key] instanceof Array))
							hash[key] = [ hash[key] ];
						hash[key].push(value);
					} else
						hash[key] = value;
				}
				return hash;
			});
		},

		escapeHTML : function() {
			var div = document.createElement('div');
			var text = document.createTextNode(this);
			div.appendChild(text);
			return div.innerHTML;
		},

		unescapeHTML : function() {
			var div = document.createElement('div');
			div.innerHTML = this.stripTags();
			return div.childNodes[0] ? (div.childNodes.length > 1 ? $A(div.childNodes).inject('', function(memo, node) {
				return memo + node.nodeValue;
			}) : div.childNodes[0].nodeValue) : '';
		},

		stripTags : function() {
			return this.replace(/<\/?[^>]+>/gi, '');
		}
	});

	window.$break = {};

	window.Enumerable = {
		each : function(iterator, context) {
			var index = 0;
			try {
				this._each(function(value) {
					iterator.call(context, value, index++);
				});
			} catch (e) {
				if (e != $break)
					throw e;
			}
			return this;
		},

		inject : function(memo, iterator, context) {
			this.each(function(value, index) {
				memo = iterator.call(context, memo, value, index);
			});
			return memo;
		},

		include : function(pattern) {
			return this.indexOf(pattern) > -1;
		}
	};

	Object.extend(Array.prototype, Enumerable);

	Object.extend(Array.prototype, {
		_each : (Array.prototype.forEach || function(iterator, context) {
			for ( var i = 0, length = this.length >>> 0; i < length; i++) {
				if (i in this)
					iterator.call(context, this[i], i, this);
			}
		})
	});

	window.$A = Array.from = function(iterable) {
		if (!iterable)
			return [];
		if (iterable.toArray) {
			return iterable.toArray();
		} else {
			var results = [];
			for ( var i = 0, length = iterable.length; i < length; i++)
				results.push(iterable[i]);
			return results;
		}
	};

	window.Form = {
		serializeElements : function(elements, options) {
			if (typeof options != 'object')
				options = {
					hash : !!options
				};
			else if (Object.isUndefined(options.hash))
				options.hash = true;
			var key, value, submitted = false, submit = options.submit, accumulator, initial;

			if (options.hash) {
				initial = {};
				accumulator = function(result, key, value) {
					if (key in result) {
						if (!Object.isArray(result[key]))
							result[key] = [ result[key] ];
						result[key].push(value);
					} else
						result[key] = value;
					return result;
				};
			} else {
				initial = '';
				accumulator = function(result, key, value) {
					return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
				};
			}

			return elements.inject(initial,
									function(result, element) {
										if (!element.disabled && element.name) {
											key = element.name;
											value = Form.Element.getValue(element);
											if (value != null &&
													element.type != 'file' &&
													(element.type != 'submit' || (!submitted && submit !== false &&
															(!submit || key == submit) && (submitted = true)))) {
												result = accumulator(result, key, value);
											}
										}
										return result;
									});
		},

		serialize : function(form, options) {
			return Form.serializeElements(Form.getElements(form), options);
		},

		getElements : function(form) {
			var elements = $(form).getElementsByTagName('*'), element, arr = [], serializers = Form.Element.Serializers;
			for ( var i = 0; element = elements[i]; i++) {
				arr.push(element);
			}
			return arr.inject([], function(elements, child) {
				if (serializers[child.tagName.toLowerCase()])
					elements.push(child);
				return elements;
			});
		}
	};

	window.Form.Element = {
		serialize : function(element) {
			element = $(element);
			if (!element.disabled && element.name) {
				var value = element.getValue();
				if (value != undefined) {
					var pair = {};
					pair[element.name] = value;
					return Object.toQueryString(pair);
				}
			}
			return '';
		},

		getValue : function(element) {
			element = $(element);
			var method = element.tagName.toLowerCase();
			return Form.Element.Serializers[method](element);
		}
	};

	window.Form.Element.Serializers = {
		input : function(element, value) {
			switch (element.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					return Form.Element.Serializers.inputSelector(element, value);
				default:
					return Form.Element.Serializers.valueSelector(element, value);
			}
		},

		inputSelector : function(element, value) {
			if (typeof (value) == "undefined")
				return element.checked ? element.value : null;
			else
				element.checked = !!value;
		},

		valueSelector : function(element, value) {
			if (typeof (value) == "undefined")
				return element.value;
			else
				element.value = value;
		},

		select : function(element, value) {
			if (typeof (value) == "undefined")
				return (element.type === 'select-one' ? Form.Element.Serializers.selectOne
						: Form.Element.Serializers.selectMany)(element);

			var opt, currentValue, single = !(value instanceof Array);
			for ( var i = 0, length = element.length; i < length; i++) {
				opt = element.options[i];
				currentValue = this.optionValue(opt);
				if (single) {
					if (currentValue == value) {
						opt.selected = true;
						return;
					}
				} else
					opt.selected = value.include(currentValue);
			}
		},

		selectOne : function(element) {
			var index = element.selectedIndex;
			return index >= 0 ? Form.Element.Serializers.optionValue(element.options[index]) : null;
		},

		selectMany : function(element) {
			var values, length = element.length;
			if (!length)
				return null;

			for ( var i = 0, values = []; i < length; i++) {
				var opt = element.options[i];
				if (opt.selected)
					values.push(Form.Element.Serializers.optionValue(opt));
			}
			return values;
		},

		optionValue : function(opt) {
			return opt.getAttributeNode('value') ? opt.value : opt.text;
		}
	};

	if (!window.Event) {
		window.Event = new Object();
	}

	Object.extend(Event, {
		stop : function(event) {
			if (event.preventDefault) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				event.returnValue = false;
				event.cancelBubble = true;
			}
		}
	});
}