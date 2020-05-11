/**
 * @fileOverview アクションエリアボタン共通スクリプト.
 * @name PrdActionAreaCommon.js
 */

/**
 * 商品基底名前空間.
 * @namespace 商品基底名前空間.
 */
var Prd = {};
var PD = Prd.ActionAreaCommon = {

	/**
	 * ボタンのパラメータの設定する関数.<br>
	 * 各ボタンのパラメータを設定し、画面表示する.<br>
	 * @param {Object} aFormId フォームID
	 * @param {Object} aPrdId 商品ID
	 * @param {Object} aQuick 簡単購入パラメータ
	 * @param {Object} aActionDest ActionのURI
	 */
	onSubmit : function(aFormId, aPrdId, aQuick, aActionDest) {
		document.getElementById("dy_prdId").value = aPrdId;
		if (aQuick != '') {
			// かんたん購入の場合
			document.getElementById("dy_quick").value = aQuick;
		} else {
			// かんたん購入以外の場合
			document.getElementById("dy_quick").disabled = true;
		}
		document.getElementById(aFormId).action = aActionDest;
		document.getElementById(aFormId).submit();
	}
};

/**
 * かんたん購入の数量設定関数関数.<br>
 * 数量選択時に、かんたん購入の数量を設定する.<br>
 * @param {String} n 購入数量
 */
function quickIns(n) {
	if (document.getElementById("prdDisplayPaperBookActionAreaQty")) {
		document.getElementById("prdDisplayPaperBookActionAreaQty").value = n;
	}

}