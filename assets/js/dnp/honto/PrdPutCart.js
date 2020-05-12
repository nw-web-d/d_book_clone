/**
 * @fileOverview 買い物カゴボタン共通スクリプト.
 * @name PrdPutCart.js
 */

jQuery.noConflict()
var putCart = {
  /** 商品ID **/
  productId: '',

  /** シリーズID **/
  seriesId: '',

  /** エリアセレクタID **/
  areaSelecterId: '',

  /** 数量 **/
  productPutCount: '',

  /** プラグインブロックID **/
  pageBlockId: '',

  /** ボタンイメージパス **/
  buttonImagePath: '',

  /** ボタンイメージテキスト **/
  buttonImageText: '',

  /** 追加ボタンのクローン **/
  buttonClone: {},

  /** 買い物カゴ画面のURL **/
  cartUrl: '',

  /** 表示タイプ **/
  displayType: '',

  /** ショッピングカートタイプ **/
  cartType: '',

  /** アクションエリアセレクタ **/
  actionAreaSelecter: {},

  /** アクションメッセージエリアセレクタ **/
  actionMessageSelecter: {},

  /** 識別子（画面内重複IDに対する識別） **/
  identifier: '',

  /** 底本タイプ **/
  originalBookType: '',

  /** キャンペーンID **/
  cid: '',

  /** ストア判別 **/
  storeClass: '',

  /** ストアアクション判別 **/
  storeAction: '',

  /** ストアアクション判別 **/
  storeCart: '',

  /** ストア予約アクション判別 **/
  storeReserve: '',

  /** 多重実行抑止 **/
  setDoubleClickFlg(flg) {
    HC.isSubmitted = flg
  },

  /**
   * 「買い物カゴに入れる」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param identifier 識別子（画面内重複IDに対する識別）
   * @param productId 商品ID
   * @param seriesId シリーズID
   * @param cartUrl 買い物カゴ画面URL
   * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcImage:PCの一覧系画面（イメージ表示） pcDetail:PCの詳細画面 pcCampaign:PCのキャンペーン画面 sp:SPの画面 spCarousel:SPのカルーセルブロック)
   * @param originalBookType 底本タイプ(0:通常 1:底本（電子書籍） 2:底本（紙書籍）)
   * @param cartType ショッピングカートタイプ(1:電子 2:物販)
   */
  put(
    pageBlockId,
    identifier,
    productId,
    seriesId,
    cartUrl,
    displayType,
    originalBookType,
    cartType
  ) {
    if (!HC.isSubmitted) {
      // 多重実行を防止
      putCart.setDoubleClickFlg(true)

      putCart.init(
        pageBlockId,
        identifier,
        productId,
        seriesId,
        cartUrl,
        displayType,
        originalBookType,
        cartType,
        ''
      )

      // ローディング画像出しわけ設定
      putCart.setLoadingImage()

      const queryString =
        'prdid=' +
        putCart.productId +
        '&srsid=' +
        putCart.seriesId +
        '&productPutCount=' +
        putCart.productPutCount +
        '&cartType=' +
        putCart.cartType +
        '&putCart=1'

      // クラス取得
      const stNsBtn = jQuery(this.actionAreaSelecter).find('.stNsBtn').length
      const stAction = jQuery(this.actionAreaSelecter).find('.stAction').length
      const stCart = jQuery(this.actionAreaSelecter).find('.stCart').length
      const stReserve = jQuery(this.actionAreaSelecter).find('.stReserve')
        .length
      if (stNsBtn > 0) {
        putCart.storeClass = 'stNsBtn'
      } else {
        putCart.storeClass = 'stEbBtn'
      }
      if (stAction > 0) {
        putCart.storeAction = 'stAction'
      }
      if (stCart > 0) {
        putCart.storeCart = 'stCart'
      }
      if (stReserve > 0) {
        putCart.storeReserve = 'stReserve'
      }

      HC.Ajax.json(
        putCart.pageBlockId,
        putCart.complete,
        queryString,
        false,
        'dy_put_cart_img_' + identifier + putCart.areaSelecterId,
        'dy_put_cart_' + identifier + putCart.areaSelecterId,
        putCart.error
      )
    } else {
      // 多重実行時は1.5秒後に実行可能
      setTimeout('putCart.setDoubleClickFlg(false);', 1500)
    }
  },

  /**
   * 「買い物カゴに入れる」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param identifier 識別子（画面内重複IDに対する識別）
   * @param productId 商品ID
   * @param seriesId シリーズID
   * @param cartUrl 買い物カゴ画面URL
   * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcImage:PCの一覧系画面（イメージ表示） pcDetail:PCの詳細画面 sp:SPの画面 spCarousel:SPのカルーセルブロック)
   * @param originalBookType 底本タイプ(0:通常 1:底本（電子書籍） 2:底本（紙書籍）)
   * @param cartType ショッピングカートタイプ(1:電子 2:物販)
   * @param cid キャンペーンID
   */
  putPlusCid(
    pageBlockId,
    identifier,
    productId,
    seriesId,
    cartUrl,
    displayType,
    originalBookType,
    cartType,
    cid
  ) {
    if (!HC.isSubmitted) {
      // 多重実行を防止
      putCart.setDoubleClickFlg(true)

      putCart.init(
        pageBlockId,
        identifier,
        productId,
        seriesId,
        cartUrl,
        displayType,
        originalBookType,
        cartType,
        cid
      )

      // ローディング画像出しわけ設定
      putCart.setLoadingImage()

      const queryString =
        'prdid=' +
        putCart.productId +
        '&srsid=' +
        putCart.seriesId +
        '&productPutCount=' +
        putCart.productPutCount +
        '&cartType=' +
        putCart.cartType +
        '&putCart=1'

      // クラス取得
      const stNsBtn = jQuery(this.actionAreaSelecter).find('.stNsBtn').length
      const stAction = jQuery(this.actionAreaSelecter).find('.stAction').length
      const stCart = jQuery(this.actionAreaSelecter).find('.stCart').length
      const stReserve = jQuery(this.actionAreaSelecter).find('.stReserve')
        .length
      if (stNsBtn > 0) {
        putCart.storeClass = 'stNsBtn'
      } else {
        putCart.storeClass = 'stEbBtn'
      }
      if (stAction > 0) {
        putCart.storeAction = 'stAction'
      }
      if (stCart > 0) {
        putCart.storeCart = 'stCart'
      }
      if (stReserve > 0) {
        putCart.storeReserve = 'stReserve'
      }

      HC.Ajax.json(
        putCart.pageBlockId,
        putCart.complete,
        queryString,
        false,
        'dy_put_cart_img_' + identifier + putCart.areaSelecterId,
        'dy_put_cart_' + identifier + putCart.areaSelecterId,
        putCart.error
      )
    } else {
      // 多重実行時は1.5秒後に実行可能
      setTimeout('putCart.setDoubleClickFlg(false);', 1500)
    }
  },

  /**
   * 「全ての商品を買い物カゴに入れる」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param displayType 表示タイプ(putCartAllPc:「全ての商品を買い物カゴに入れる」ボタン表示(PC) putCartAllSp:「全ての商品を買い物カゴに入れる」ボタン表示(SP))
   */
  putAll(pageBlockId, displayType) {
    if (!HC.isSubmitted) {
      // 買い物カゴへ一括登録する商品IDを抽出
      const input = document.getElementsByTagName('input')
      let prdIdList = ''
      let startFlg = false
      let endFlg = false
      for (let i = input.length - 1; i >= 0; i--) {
        if (input[i].name == 'putCartButton[]') {
          if (startFlg && !endFlg) {
            if (input[i].value.includes('putCartAllBtn')) {
              endFlg = true
            } else {
              if (prdIdList) {
                prdIdList += ','
              }
              prdIdList += input[i].value
            }
          }
          if (!startFlg) {
            if (input[i].value == 'putCartAllBtn_' + pageBlockId) {
              startFlg = true
            }
          }
        }
      }

      // 多重実行を防止
      putCart.setDoubleClickFlg(true)

      putCart.displayType = displayType
      putCart.pageBlockId = pageBlockId
      putCart.actionAreaSelecter = '#dy_put_cart_all_' + pageBlockId

      putCart.buttonClone = jQuery(putCart.actionAreaSelecter)
        .children()
        .clone(true)
      putCart.actionMessageSelecter = 'dy_put_cart_msg_' + putCart.pageBlockId

      putCart.clearMessage()

      // ローディング画像出しわけ設定
      putCart.setLoadingImage()

      HC.Ajax.json(
        pageBlockId,
        putCart.complete,
        'prdIdList=' + prdIdList,
        false,
        'dy_put_cart_all_img_' + pageBlockId,
        'dy_put_cart_all_' + pageBlockId,
        putCart.error
      )
    } else {
      // 多重実行時は1.5秒後に実行可能
      setTimeout('putCart.setDoubleClickFlg(false);', 1500)
    }
  },

  /**
   * 設定関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param identifier 識別子（画面内重複IDに対する識別）
   * @param productId 商品ID
   * @param seriesId シリーズID
   * @param cartUrl 買い物カゴ画面URL
   * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcImage:PCの一覧系画面（イメージ表示） pcDetail:PCの詳細画面 pcCampaign:PCのキャンペーン画面 sp:SPの画面 spCarousel:SPのカルーセルブロック)
   * @param originalBookType 底本タイプ(0:通常 1:底本（電子書籍） 2:底本（紙書籍）)
   * @param cartType ショッピングカートタイプ(1:電子 2:物販)
   * @param cid キャンペーンID
   */
  init(
    pageBlockId,
    identifier,
    productId,
    seriesId,
    cartUrl,
    displayType,
    originalBookType,
    cartType,
    cid
  ) {
    putCart.pageBlockId = pageBlockId
    putCart.productId = productId
    putCart.seriesId = seriesId
    putCart.cartUrl = cartUrl
    putCart.displayType = displayType
    putCart.cartType = cartType
    putCart.identifier = identifier
    putCart.originalBookType = originalBookType

    if (putCart.productId.length > 0) {
      // 単商品
      putCart.areaSelecterId = putCart.productId
    } else {
      // シリーズ
      putCart.areaSelecterId = putCart.seriesId
    }
    putCart.actionAreaSelecter =
      '#dy_put_cart_' + identifier + putCart.areaSelecterId
    putCart.actionMessageSelecter =
      'dy_put_cart_msg_' + identifier + putCart.areaSelecterId

    putCart.clearMessage()

    putCart.buttonClone = jQuery(putCart.actionAreaSelecter)
      .children()
      .clone(true)
    if (originalBookType === '1') {
      // 底本（電子書籍）
      putCart.buttonImagePath = '/library/img/pc/btn_cart_09s_o.png'
      putCart.buttonImageText = 'カートを見る(電子書籍)'
    } else if (originalBookType === '2') {
      // 底本（紙書籍）
      putCart.buttonImagePath = '/library/img/pc/btn_cart_11s_o.png'
      putCart.buttonImageText = 'カートを見る(紙書籍)'
    } else if (displayType === 'pcImage') {
      // 通常(検索結果イメージ表示)
      putCart.buttonImagePath = '/library/img/pc/btn_cart_03s_o.png'
      putCart.buttonImageText = 'カートを見る'
    } else {
      // 通常
      // putCart.buttonImagePath = '/library/img/pc/btn_cart_01s_o.png';
      // putCart.buttonImageText = 'カートを見る';
    }
    if (jQuery('*[name=qty]').length) {
      // 物販数量
      putCart.productPutCount = jQuery('*[name=qty]').val()
    } else {
      // 電子数量
      putCart.productPutCount = 1
    }

    putCart.cid = cid
  },

  /**
   * 既存メッセージを除去.
   */
  clearMessage() {
    // ページ上部に表示されているメッセージがあれば除去(SPのみ)
    if (jQuery('#dy_put_cart_msg').size()) {
      jQuery('#dy_put_cart_msg').hide()
    }

    // 同一商品に対するメッセージがすでに存在すれば除去
    if (jQuery('*[name=' + putCart.actionMessageSelecter + ']').size()) {
      jQuery('*[name=' + putCart.actionMessageSelecter + ']').remove()
    }
  },

  /**
   * Ajax成功時コールバック処理.
   *
   * @param json APIからのレスポンス
   */
  complete(json) {
    if (!json) {
      putCart.error()
      return
    }

    let resPrdId = putCart.areaSelecterId

    if (json.prdId != null && json.prdId.length > 0) {
      // シリーズの全部ボタン以外
      resPrdId = json.prdId
    } else if (json.srsId != null && json.srsId.length > 0) {
      // シリーズの全部ボタン
      resPrdId = json.srsId
    }

    if (json.result === '1') {
      // 全ての商品を買い物カゴに入れるボタンを押下した場合
      if (putCart.displayType.match(/^putCartAll/)) {
        // 全ての商品をカゴに入れるボタンの場合
        jQuery('#dy_put_cart_all_' + putCart.pageBlockId).html(
          "<a href='" +
            json.cartUrl +
            "'><img src='" +
            json.btnImgCartPath +
            "' alt='" +
            json.btnImgCartAlt +
            "' /></a>"
        )

        // 各商品の「買い物カゴに入れる」ボタンを「カートを見る」ボタンに変更する
        if (json.prdIdList) {
          const prdIdList = json.prdIdList.split(',')
          const cartUrlList = json.cartUrlList.split(',')
          const prdIdListLen = prdIdList.length
          for (let i = 0; i < prdIdListLen; i++) {
            // PC
            jQuery('#dy_put_cart_listDataPc1_' + prdIdList[i]).html(
              "<a href='" +
                cartUrlList[i] +
                "'><span class='stBtn stAction stSizeXS stInvert stBranch05 " +
                putCart.storeClass +
                "'>カートを見る</span></a>"
            )
            jQuery('#dy_put_cart_listDataPc2_' + prdIdList[i]).html(
              "<a href='" +
                cartUrlList[i] +
                "'><span class='stBtn stAction stSizeXS stInvert stBranch05 " +
                putCart.storeClass +
                "'>カートを見る</span></a>"
            )
            jQuery('#dy_put_cart_listDataPc3_' + prdIdList[i]).html(
              "<a href='" +
                cartUrlList[i] +
                "'><span class='stBtn stAction stSizeXS stInvert stBranch05 " +
                putCart.storeClass +
                "'>カートを見る</span></a>"
            )
            // SP
            jQuery('#dy_put_cart_listDataSp_' + prdIdList[i]).html(
              "<a href='" +
                cartUrlList[i] +
                "'><button type='button' class='stBtn stSizeM stInvert " +
                putCart.storeClass +
                "'>カートを見る</button></a>"
            )
          }
        }

        // 買い物かごを見るボタンに変更
      } else if (putCart.displayType.match(/^pc/)) {
        // PCの場合
        // 商品IDを指定
        if (
          putCart.displayType.match(/^pcCarousel/) ||
          putCart.identifier == 'lb_'
        ) {
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><span class='stBtn stAction stInvert stSizeXS stBranch05 " +
              putCart.storeClass +
              "'>カートを見る</span></a>"
          )
        } else if (putCart.displayType.match(/^pcDetail/)) {
          if (putCart.storeAction.includes('stAction')) {
            // ほしい本一覧画面
            jQuery('#dy_put_cart_' + resPrdId).html(
              "<a href='" +
                putCart.cartUrl +
                "'><span class='stBtn " +
                putCart.storeAction +
                ' stSizeM ' +
                putCart.storeClass +
                " stInvert'>カートを見る</span></a>"
            )
          } else if (putCart.storeClass.includes('stEbBtn')) {
            jQuery('#dy_put_cart_' + resPrdId).html(
              "<p><a href='" +
                putCart.cartUrl +
                "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative; height: 62px;'><span class='stBtn " +
                putCart.storeCart +
                ' stSizeL ' +
                putCart.storeClass +
                " stEbookCart ebook-cart__button'>カートを見る</span></a></p>"
            )
          } else {
            jQuery('#dy_put_cart_' + resPrdId).html(
              "<p><a href='" +
                putCart.cartUrl +
                "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative; height: 62px;'><span class='stBtn " +
                putCart.storeCart +
                ' stSizeL ' +
                putCart.storeClass +
                " stCurrent'>カートを見る</span></a></p>"
            )
          }
          jQuery('#dy_put_cart_actionAreaPc_' + resPrdId).html(
            "<p><a href='" +
              putCart.cartUrl +
              "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative; height: 62px;'><span class='stBtn stCart stSizeL stEbBtn stEbookCart ebook-cart__button'>カートを見る</span></a></p>"
          )
          jQuery('#dy_put_cart_lineupPc_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><span class='stBtn stAction stSizeM stEbBtn stInvert'>カートを見る</span></a>"
          )
        } else if (putCart.storeAction.includes('stAction')) {
          // イメージ
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "' style='text-decoration: none;'><span class='stBtn " +
              putCart.storeAction +
              ' ' +
              putCart.storeClass +
              " stInvert stSizeM stBranch05'>カートを見る</span></a>"
          )
        } else if (putCart.storeCart.includes('stCart')) {
          // 一覧
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative;'><span class='stBtn " +
              putCart.storeCart +
              ' stSizeM ' +
              putCart.storeClass +
              " stInvert stBranch02'>カートを見る</span></a>"
          )
        } else if (putCart.storeReserve.includes('stReserve')) {
          // 予約購入
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative;'><span class='stBtn stCart stSizeM " +
              putCart.storeClass +
              " stInvert stBranch02'>カートを見る</span></a>"
          )
        } else {
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "' style='text-decoration: none; display: inline-block; vertical-align:bottom; position: relative;'><span class='stBtn stCart stSizeM " +
              putCart.storeClass +
              " stInvert stBranch02'>カートを見る</span></a>"
          )
        }
        // クリック前のa要素を削除
        if (jQuery('#dy_put_cart_' + resPrdId).find('a').length) {
          jQuery('#dy_put_cart_' + resPrdId)
            .find('a')
            .unwrap()
        }
        // 最新書籍を指定
        jQuery('#dy_put_cart_latest_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stAction stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // スライドインを指定
        jQuery('#dy_put_cart_slideIn_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stAction stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // 特集ページ用1商品を指定
        jQuery('#dy_put_cart_dataPc_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stAction stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // 特集ページ用5商品を指定
        jQuery('#dy_put_cart_multiDataPc_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stAction stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // 旧看板商品（横並び）を指定
        jQuery('#dy_put_cart_listDataPc_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // 看板商品を指定
        jQuery('#dy_put_cart_listDataPc1_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "' style='text-decoration: none; vertical-align: bottom; display: inline-block; position: relative;'><span class='stBtn stCart stSizeM stInvert stBranch02 " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )
        jQuery('#dy_put_cart_listDataPc2_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "' style='text-decoration: none; vertical-align: bottom; display: inline-block; position: relative;'><span class='stBtn stCart stSizeM stInvert stBranch02 " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )
        jQuery('#dy_put_cart_listDataPc3_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "' style='text-decoration: none; vertical-align: bottom; display: inline-block; position: relative;'><span class='stBtn stCart stSizeM stInvert stBranch02 " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )

        // lightboxを指定
        jQuery('#dy_put_cart_lb_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )
        jQuery('#dy_put_cart_lb_allbuy_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><span class='stBtn stSizeXS stInvert " +
            putCart.storeClass +
            "'>カートを見る</span></a>"
        )
      } else if (
        putCart.displayType.match(/^spCarousel/) ||
        ((putCart.displayType == 'sp' ||
          putCart.displayType == 'spDetailEbk') &&
          putCart.identifier == 'lb_')
      ) {
        // SPカルーセルブロックまたはlightboxの場合

        // 商品IDを指定
        jQuery('#dy_put_cart_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><button type='button' class='stBtn stSizeS stInvert stEbBtn'>カートを見る</button></a>"
        )

        // lightboxを指定
        jQuery('#dy_put_cart_lb_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><button type='button' class='stBtn stSizeXS stInvert stEbBtn'>カートを見る</button></a>"
        )
      } else {
        // その他(SP)の場合

        if (putCart.storeClass.includes('stNsBtn')) {
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stInvert stSizeM stNsCartBtn');>カートを見る</button>"
          )
        } else if (putCart.storeClass.includes('stEbBtn')) {
          jQuery('#dy_put_cart_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stInvert stSizeM stEbCartBtn ebook-cart__button');>カートを見る</button>"
          )
          jQuery('#dy_put_cart_actionAreaSp_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stInvert stSizeM stEbCartBtn ebook-cart__button');>カートを見る</button>"
          )
          jQuery('#dy_put_cart_lineupSp_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stInvert stSizeM stEbCartBtn');>カートを見る</button>"
          )
          jQuery('#dy_put_cart_toggleBoxSp_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stInvert stSizeM stEbCartBtn--pictleft');>カートを見る</button>"
          )
        }

        // 旧CMS特集ページ
        jQuery('#dy_put_cart_dataSp_' + resPrdId).html(
          "<a href='" +
            putCart.cartUrl +
            "'><button type='button' class='stBtn stCart stSizeM stInvert " +
            putCart.storeClass +
            "'>カートを見る</button></a>"
        )

        // CMS特集ページ
        if (putCart.storeClass.includes('stNsBtn')) {
          jQuery('#dy_put_cart_listDataSp_' + resPrdId).html(
            "<a href='" +
              putCart.cartUrl +
              "'><button type='button' class='stBtn stSizeM stInvert stNsCartBtn'>カートを見る</button></a>"
          )
        } else if (putCart.storeClass.includes('stEbBtn')) {
          if (putCart.displayType == 'spSizeS') {
            jQuery('#dy_put_cart_listDataSp_' + resPrdId).html(
              "<a href='" +
                putCart.cartUrl +
                "'><button type='button' class='stBtn stSizeS stInvert stEbCartBtn'>カートを見る</button></a>"
            )
          } else {
            jQuery('#dy_put_cart_listDataSp_' + resPrdId).html(
              "<a href='" +
                putCart.cartUrl +
                "'><button type='button' class='stBtn stSizeM stInvert stEbCartBtn'>カートを見る</button></a>"
            )
          }
        }

        // // ブラウザバック対応：sessionStorageの内容を削除
        // jQuery("a").on("click", function() {
        // 	DY.deleteSearchContent(jQuery(this).attr("href"));
        // });
      }

      if (putCart.displayType == 'sp' || putCart.displayType == 'spDetailEbk') {
        // SP カートに1商品でも入ってるいる場合に●アイコンを付ける
        jQuery('.stHeader .stNav .stCart').append(
          '<span class="stIcon"></span>'
        )
      }

      // 数量ボタンを非表示にする（物販のみ変更）
      if (jQuery('#dy_book_count').length && putCart.originalBookType !== '1') {
        jQuery('#dy_book_count').html('')
      }

      // ページ内にあるカートに入っている商品数を更新
      putCart.updateCartItemCount(json)

      putCart.setDoubleClickFlg(false)

      // サイトカタリストへ分析用データを送信
      putCart.sendCatalystData(json)

      // EinsteinRecommendationsのtrackCart送信スクリプトを埋め込む
      putCart.addTrackCart(json)
    } else {
      // 処理失敗時、ローディング画像を買い物かごに入れるボタンに戻す
      if (!putCart.identifier && !putCart.displayType.match(/^putCartAll/)) {
        // スライドイン、最新書籍以外
        // 押下したIDを変更
        jQuery('#dy_put_cart_' + resPrdId).html(putCart.buttonClone)
      } else {
        jQuery(putCart.actionAreaSelecter).html(putCart.buttonClone)
      }

      // ページ内にあるカートに入っている商品数を更新
      putCart.updateCartItemCount(json)

      putCart.setDoubleClickFlg(false)
    }

    // メッセージ表示
    if (json.message != null && json.message.length > 0) {
      const message = putCart.createMessage(json.message)

      if (putCart.identifier === 'slideIn_') {
        jQuery('#dy_put_cart_slideIn_ErrMsg').prepend(message)
      } else if (putCart.displayType.match(/^putCartAll/)) {
        jQuery('#stErrorMsg_' + putCart.pageBlockId).prepend(message)
      } else if (
        putCart.displayType === 'pcList' ||
        putCart.displayType === 'pcImage'
      ) {
        if (!putCart.identifier) {
          jQuery('#dy_put_cart_' + resPrdId).prepend(message)
        } else {
          jQuery(putCart.actionAreaSelecter).prepend(message)
        }
      } else if (putCart.displayType === 'pcCampaign') {
        jQuery('#dy_put_cart_cp_ErrMsg_' + resPrdId).prepend(message)
        // run.js内関数を実行
        if (DY.onAdjustDisplayFunction) {
          DY.onAdjustDisplayFunction()
        }
      } else if (putCart.identifier === 'lb_') {
        jQuery(putCart.actionAreaSelecter)
          .parent()
          .parent()
          .prepend(message)
      } else if (
        putCart.displayType === 'pcDetailEbk' ||
        putCart.displayType === 'spDetailEbk'
      ) {
        jQuery(putCart.actionAreaSelecter)
          .parent()
          .parent()
          .before(message)
      } else if (putCart.identifier === 'lb_allbuy_') {
        jQuery(putCart.actionAreaSelecter).prepend(message)
      } else if (!putCart.identifier) {
        jQuery('#dy_put_cart_' + resPrdId).before(message)
      } else {
        jQuery(putCart.actionAreaSelecter).before(message)
      }
    }

    // PCの場合はローディング画像の定義を初期設定に戻す
    if (putCart.displayType.match(/^pc/)) {
      HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif'
    }
  },

  /**
   * ページ上部買い物かごカート内商品数設定関数.
   * @param {Object} json APIからのレスポンス
   */
  updateCartItemCount(json) {
    bookCartItemCount = json.bookCartItemCount
    ebookCartItemCount = json.ebookCartItemCount

    const netstoreCartItem = jQuery(
      '#dy_netstoreCartItemCount, .dy_netstoreCartItemCount'
    )
    const ebookCartItem = jQuery(
      '#dy_ebookCartItemCount, .dy_ebookCartItemCount'
    )

    // 物販数
    for (var i = 0; netstoreCartItem.length > i; i++) {
      netstoreCartItem.eq(i).text(bookCartItemCount)
    }

    // 電子数
    for (var i = 0; ebookCartItem.length > i; i++) {
      ebookCartItem.eq(i).text(ebookCartItemCount)
    }
  },

  /**
   * Ajaxエラー時コールバック処理.
   *
   * @param xhr httpオブジェクト
   * @param textStatus エラー内容("timeout", "error", "notmodified", "parsererror"など)
   * @param errorThrown 補足的な例外オブジェクト
   */
  error(xhr, textStatus, errorThrown) {
    // 現在のURLについているパラメータを付加
    const newParameters = []
    const parameters = window.location.search.substring(1).split('&')
    for (let i = 0; i < parameters.length; i++) {
      if (!parameters[i].match(/^(prdid=|delHst=|delHstAll=)/)) {
        newParameters.push(parameters[i])
      }
    }

    // リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
    let linkUrl = window.location.pathname + '?prdid=' + putCart.productId
    if (newParameters.length > 0) {
      linkUrl = linkUrl + '&' + newParameters.join('&')
    }
    window.location.href = linkUrl
  },

  /**
   * メッセージの要素を生成.
   *
   * @param message メッセージ
   * @return messageObj メッセージ要素
   */
  createMessage(message) {
    let messageObj = {}

    if (
      putCart.displayType === 'pcList' ||
      putCart.displayType === 'pcImage' ||
      putCart.displayType === 'pcCarousel' ||
      (putCart.displayType === 'pc' && putCart.identifier === 'lb_')
    ) {
      messageObj = jQuery('<span/>').append(message)
      messageObj.addClass('stErrorMsg')
    } else if (putCart.displayType === 'pcCampaign') {
      messageObj = jQuery('<span/>').append(message)
      messageObj.addClass('stErrorMsg')
      messageObj.addClass('stRight')
    } else if (putCart.identifier === 'lb_allbuy_') {
      messageObj = jQuery('<span/>').append(message)
      messageObj.addClass('stErrorMsg')
      messageObj.addClass('stMarginB05')
    } else if (
      putCart.displayType === 'pcDetail' ||
      putCart.displayType === 'pcDetailEbk' ||
      putCart.displayType === 'putCartAllPc'
    ) {
      messageObj = jQuery('<p/>').append(message)
      messageObj.addClass('stErrorMsg')
    } else {
      messageObj = jQuery('<ul/>').append(
        jQuery('<li/>').append(jQuery('<strong/>').append(message))
      )
      messageObj.addClass('stListError')
    }

    // メッセージ削除のため、name属性指定
    messageObj.attr('name', putCart.actionMessageSelecter)

    return messageObj
  },

  /**
   * ローディング画像を設定する.
   */
  setLoadingImage() {
    // PCの場合
    if (putCart.displayType.match(/^pc/)) {
      HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif'
    }
  },

  /**
   * Adobe Analytics（サイトカタリスト）へ分析データを送信する.
   *
   * @param catalystProperties 分析データ
   */
  sendCatalystData(json) {
    try {
      const s = s_gi(s_account)
      let linkTrackVars = ''

      if ('prop3' in s) {
        s.eVar3 = 'D=c3'
        linkTrackVars = linkTrackVars + ',prop3,eVar3'
      }

      if ('prop5' in s) {
        s.eVar5 = 'D=c5'
        linkTrackVars = linkTrackVars + ',prop5,eVar5'
      }
      if ('prop6' in s) {
        s.eVar6 = 'D=c6'
        linkTrackVars = linkTrackVars + ',prop6,eVar6'
      }
      if ('prop7' in s) {
        s.eVar7 = 'D=c7'
        linkTrackVars = linkTrackVars + ',prop7,eVar7'
      }
      if ('prop8' in s) {
        s.eVar8 = 'D=c8'
        linkTrackVars = linkTrackVars + ',prop8,eVar8'
      }
      if ('prop9' in s) {
        s.eVar9 = 'D=c9'
        linkTrackVars = linkTrackVars + ',prop9,eVar9'
      }
      if ('prop10' in s) {
        s.eVar10 = 'D=c10'
        linkTrackVars = linkTrackVars + ',prop10,eVar10'
      }
      if ('prop11' in s) {
        s.eVar11 = 'D=c11'
        linkTrackVars = linkTrackVars + ',prop11,eVar11'
      }
      if ('prop12' in s) {
        s.eVar12 = 'D=c12'
        linkTrackVars = linkTrackVars + ',prop12,eVar12'
      }
      if ('prop13' in s) {
        s.eVar13 = 'D=c13'
        linkTrackVars = linkTrackVars + ',prop13,eVar13'
      }
      if ('prop14' in s) {
        s.eVar14 = 'D=c14'
        linkTrackVars = linkTrackVars + ',prop14,eVar14'
      }
      if ('prop15' in s) {
        s.eVar15 = 'D=c15'
        linkTrackVars = linkTrackVars + ',prop15,eVar15'
      }
      if ('prop16' in s) {
        s.eVar16 = 'D=c16'
        linkTrackVars = linkTrackVars + ',prop16,eVar16'
      }

      if ('prop19' in s) {
        s.eVar19 = 'D=c19'
        linkTrackVars = linkTrackVars + ',prop19,eVar19'
      }
      if ('prop20' in s) {
        s.eVar20 = 'D=c20'
        linkTrackVars = linkTrackVars + ',prop20,eVar20'
      }

      if ('s.prop22' in json) {
        s.eVar22 = 'D=c22'
        s.prop22 = decodeURIComponent(json['s.prop22'])
        linkTrackVars = linkTrackVars + ',prop22,eVar22'
      }
      if ('s.prop23' in json) {
        s.eVar23 = 'D=c23'
        s.prop23 = decodeURIComponent(json['s.prop23'])
        linkTrackVars = linkTrackVars + ',prop23,eVar23'
      }
      if ('s.prop24' in json) {
        s.eVar24 = 'D=c24'
        s.prop24 = decodeURIComponent(json['s.prop24'])
        linkTrackVars = linkTrackVars + ',prop24,eVar24'
      }

      if ('s.prop26' in json) {
        s.eVar26 = 'D=c26'
        s.prop26 = decodeURIComponent(json['s.prop26'])
        linkTrackVars = linkTrackVars + ',prop26,eVar26'
      }

      if ('s.products' in json) {
        s.products = decodeURIComponent(json['s.products'])
        linkTrackVars = linkTrackVars + ',products'
      }

      linkTrackVars = linkTrackVars + ',prop51'

      linkTrackVars = linkTrackVars + ',prop52'

      linkTrackVars = linkTrackVars + ',prop53'

      linkTrackVars = linkTrackVars + ',prop54'

      linkTrackVars = linkTrackVars + ',prop55'

      if (putCart.cid != null && putCart.cid.length > 0) {
        s.campaign = putCart.cid
        linkTrackVars = linkTrackVars + ',campaign'

        const params = s.prop51.split(';')

        let prop51Cid = putCart.cid

        if (params[1] != null && params[1].length > 0) {
          prop51Cid = prop51Cid + ';' + params[1]
        } else {
          prop51Cid = prop51Cid + ';'
        }

        if (params[2] != null && params[2].length > 0) {
          prop51Cid = prop51Cid + ';' + params[2]
        } else {
          prop51Cid = prop51Cid + ';'
        }

        s.prop51 = prop51Cid
      }

      if ('s.events' in json) {
        s.events = decodeURIComponent(json['s.events'])
        s.linkTrackEvents = decodeURIComponent(json['s.events'])
      }

      s.linkTrackVars = 'events' + linkTrackVars
      s.tl(true, 'o', 'put-cart-product')
    } catch (e) {
    } finally {
      return true
    }
  },

  /**
   * trackCart送信スクリプトを埋め込む処理関数
   *
   * @param json APIからのレスポンス
   */
  addTrackCart(json) {
    try {
      if (json.prdId == null || json.prdId.length == 0) {
        // シリーズの全部ボタン押下時は何もしない
        return
      }

      if (putCart.displayType.match(/^putCartAll/)) {
        // 全ての商品を買い物カゴに入れるボタン押下時は何もしない
        return
      }

      // trackCart送信スクリプト埋め込み
      jQuery('#pbBlock' + putCart.pageBlockId).append(
        '<script>_etmc.push(["trackCart", {"cart" : [{"item" : "' +
          json.prdId +
          '", "unique_id" : "' +
          json.prdId +
          '"}]}]);</script>'
      )
    } catch (e) {
      // 外部jsが読み込めないなど、エラーの場合はコンソールに出力
      console.error(e)
    }
  }
}
