/**
 * @fileOverview 商品を本棚に登録する。
 * @name PrdAddMyBookShelf.js
 */

jQuery.noConflict()

var prdAddMyBookShelf = {
  /** 商品ID **/
  productId: '',

  /** 持っている商品ID **/
  haveProductId: '',

  /** プラグインブロックID **/
  pageBlockId: '',

  /** セレクタ **/
  selecter: {},

  /** セレクタ(ハイブリット商品リスト) **/
  selecterHbPrdList: {},

  /** 持っているボタンのクローン **/
  buttonClone: {},

  /** 登録リンクのクローン **/
  linkClone: {},

  /** 表示タイプ **/
  displayType: '',

  /** 表示タイプ **/
  ebookFlg: '',

  /**
   * 「持っている」ボタン押下時の処理関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param productId 商品ID
   * @param haveProductId 持っている商品ID
   * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcDetail:PCの詳細画面 spList:SPの一覧画面 spDetail:SPの詳細画面)
   * @param ebookFlg 電子書籍であることを表すフラグ
   */
  add: function(pageBlockId, productId, haveProductId, displayType, ebookFlg) {
    if (!HC.isSubmitted) {
      // 多重実行を防止
      HC.isSubmitted = true

      this._init(pageBlockId, productId, haveProductId, displayType, ebookFlg)

      // ローディング画像出しわけ設定
      this._setLoadingImage()

      var prefix = 'dy_addShelfBtnDisp_'

      if (displayType === 'pcDetailHbPrdList') {
        prefix = 'dy_addShelfBtnDisp_hbPrdList_'
      }

      HC.Ajax.json(
        this.pageBlockId,
        this.complete,
        'prdid=' +
          this.productId +
          '&having=on&havePrdId=' +
          this.haveProductId,
        false,
        'dy_img_' + this.productId,
        prefix + this.haveProductId,
        this.error
      )
    }
  },

  /**
   * 設定関数.
   *
   * @param pageBlockId プラグインブロックID
   * @param productId 商品ID
   * @param haveProductId 持っている商品ID
   * @param displayType 表示タイプ(pcList:PCの一覧系画面 pcDetail:PCの詳細画面 sp:SPの画面)
   * @param ebookFlg 電子書籍であることを表すフラグ
   */
  _init: function(
    pageBlockId,
    productId,
    haveProductId,
    displayType,
    ebookFlg
  ) {
    this.productId = productId
    this.haveProductId = haveProductId
    this.pageBlockId = pageBlockId
    this.selecter = '#dy_addShelfBtnDisp_' + haveProductId
    this.selecterHbPrdList = '#dy_addShelfBtnDisp_hbPrdList_' + haveProductId
    this.buttonClone = jQuery(this.selecter)
      .children()
      .clone(true)
    this.linkClone = jQuery(this.selecterHbPrdList)
      .children()
      .clone(true)
    this.displayType = displayType
    this.ebookFlg = ebookFlg
  },

  /**
   * Ajax成功時コールバック処理.
   *
   * @param json APIからのレスポンス
   */
  complete: function(json) {
    if (!json) {
      prdAddMyBookShelf.error()
      return
    }

    if (json.isRegistered === '1') {
      // 処理成功時、登録済みリンクに切替
      if (
        prdAddMyBookShelf.displayType === 'spList' ||
        prdAddMyBookShelf.displayType === 'spDetail'
      ) {
        jQuery(prdAddMyBookShelf.selecter).replaceWith(
          prdAddMyBookShelf._createShelfLinkSp()
        )
      } else if (prdAddMyBookShelf.displayType === 'pcList') {
        jQuery(prdAddMyBookShelf.selecter).replaceWith(
          prdAddMyBookShelf._createShelfLinkPcList()
        )
      } else if (
        prdAddMyBookShelf.displayType === 'pcDetail' ||
        prdAddMyBookShelf.displayType === 'pcDetailHbPrdList'
      ) {
        jQuery(prdAddMyBookShelf.selecter).replaceWith(
          prdAddMyBookShelf._createShelfLinkPcDetail()
        )
        jQuery(prdAddMyBookShelf.selecterHbPrdList).replaceWith(
          prdAddMyBookShelf._createShelfLinkPcDetailHbPrdList()
        )
      }
      // 後処理
      prdAddMyBookShelf._term()
    } else {
      if (prdAddMyBookShelf.displayType === 'pcDetailHbPrdList') {
        // 処理失敗時、ローディング画像を登録リンクに戻す
        jQuery(prdAddMyBookShelf.selecterHbPrdList).html(
          prdAddMyBookShelf.linkClone
        )
      } else {
        // 処理失敗時、ローディング画像を持っているボタンに戻す
        jQuery(prdAddMyBookShelf.selecter).html(prdAddMyBookShelf.buttonClone)
      }
    }

    // PCの場合はローディング画像の定義を初期設定に戻す
    if (prdAddMyBookShelf.displayType.match(/^pc/)) {
      HC.Ajax.loadingImage = '/library/img/pc/corusel_loading.gif'
    }

    HC.isSubmitted = false
  },

  /**
   * Ajaxエラー時コールバック処理.
   *
   * @param xhr httpオブジェクト
   * @param textStatus エラー内容("timeout", "error", "notmodified", "parsererror"など)
   * @param errorThrown 補足的な例外オブジェクト
   */
  error: function(xhr, textStatus, errorThrown) {
    // 現在のURLについているパラメータを付加
    var newParameters = []
    var parameters = window.location.search.substring(1).split('&')
    for (var i = 0; i < parameters.length; i++) {
      if (!parameters[i].match(/^(having=|prdid=|havePrdId=|wantPrdId=)/)) {
        newParameters.push(parameters[i])
      }
    }

    // リダイレクトされた場合、リダイレクト先URLを取得できないため自画面遷移
    var linkUrl =
      window.location.pathname +
      '?prdid=' +
      prdAddMyBookShelf.productId +
      '&having=on&havePrdId=' +
      prdAddMyBookShelf.haveProductId
    if (newParameters.length > 0) {
      linkUrl = linkUrl + '&' + newParameters.join('&')
    }
    window.location.href = linkUrl
  },

  /**
   * My本棚へのリンク要素を生成 PCList.
   *
   * @return linkObj My本棚へのリンク要素
   */
  _createShelfLinkPcList: function() {
    var linkObj = jQuery('<li/>').append(
      jQuery('<a/>', { href: '/my/shelf.html' }).append('<span/>')
    )
    var linkText = 'My本棚を見る'

    linkObj
      .children()
      .children()
      .addClass('stBtn stUserAction stShelf stCurrent')
      .text(linkText)

    return linkObj
  },

  /**
   * My本棚へのリンク要素を生成(アクションエリア) PCDetail.
   *
   * @return linkObj My本棚へのリンク要素
   */
  _createShelfLinkPcDetail: function() {
    var linkObj = jQuery('<li/>').append(
      jQuery('<span/>').append(jQuery('<a/>', { href: '/my/shelf.html' }))
    )
    var linkText = 'My本棚を見る'

    linkObj.children().addClass('stListLink08 stShelf stCurrent')
    linkObj
      .children()
      .children()
      .text(linkText)

    return linkObj
  },

  /**
   * My本棚へのリンク要素を生成(ハイブリット商品リスト) PCDetailHbPrdList.
   *
   * @return linkObj My本棚へのリンク要素
   */
  _createShelfLinkPcDetailHbPrdList: function() {
    var linkText = 'My本棚を見る'
    var linkUrl = '/my/shelf.html'

    return jQuery('<span/>').append(
      jQuery('<a/>', { href: linkUrl }).text(linkText)
    )
  },

  /**
   * My本棚へのリンク要素を生成 SP(List,Detail共通).
   *
   * @return linkObj My本棚へのリンク要素
   */
  _createShelfLinkSp: function() {
    var linkObj = jQuery('<p/>').append(
      jQuery('<a/>', { href: '/my/shelf.html' })
    )
    var linkText = 'My本棚を見る'

    linkObj.addClass('stShelf')
    linkObj.children().text(linkText)

    return linkObj
  },

  /**
   * 後処理
   */
  _term: function() {
    // 「ほしい本に追加する」ボタンの復活
    if (jQuery('#dy_addWntBk_' + prdAddMyBookShelf.haveProductId).size()) {
      //「ほしい本の一覧を見る」リンクが存在する場合 →  「ほしい本に追加する」ボタンの復活
      if (prdAddMyBookShelf.displayType === 'spList') {
        jQuery('#dy_addWntBk_' + prdAddMyBookShelf.haveProductId).replaceWith(
          prdAddMyBookShelf._createWantButtonSpList()
        )
      } else if (prdAddMyBookShelf.displayType === 'spDetail') {
        jQuery('#dy_addWntBk_' + prdAddMyBookShelf.haveProductId).replaceWith(
          prdAddMyBookShelf._createWantButtonSpDetail()
        )
      } else if (prdAddMyBookShelf.displayType === 'pcList') {
        jQuery('#dy_addWntBk_' + prdAddMyBookShelf.haveProductId).replaceWith(
          prdAddMyBookShelf._createWantButtonPcList()
        )
      } else if (
        prdAddMyBookShelf.displayType === 'pcDetail' ||
        prdAddMyBookShelf.displayType === 'pcDetailHbPrdList'
      ) {
        jQuery('#dy_addWntBk_' + prdAddMyBookShelf.haveProductId).replaceWith(
          prdAddMyBookShelf._createWantButtonPcDetail()
        )
        jQuery(
          '#dy_addWntBk_hbPrdList_' + prdAddMyBookShelf.haveProductId
        ).replaceWith(prdAddMyBookShelf._createWantButtonPcDetailHbPrdList())
      }
    }
    // ほしい本のエラーメッセージを除去
    prdAddMyBookShelf._clearMessage()
  },

  /**
   * ほしい本の既存メッセージを除去.
   */
  _clearMessage: function() {
    // ページ上部に表示されているメッセージがあれば除去(SPのみ)
    if (jQuery('#dy_wntBkMsg').size()) {
      jQuery('#dy_wntBkMsg').hide()
    }

    // 同一商品に対するメッセージがすでに存在すれば除去
    if (
      jQuery(
        '*[name=dy_wntBkMsg_' + prdAddMyBookShelf.haveProductId + ']'
      ).size()
    ) {
      jQuery(
        '*[name=dy_wntBkMsg_' + prdAddMyBookShelf.haveProductId + ']'
      ).remove()
    }
  },

  /**
   * ほしい本に追加するのボタン要素を生成 PCList.
   *
   * @return button ほしい本に追加するボタン要素
   */
  _createWantButtonPcList: function() {
    var innerA = jQuery('<a/>')
    innerA.attr('id', 'dy_a_' + prdAddMyBookShelf.haveProductId)
    innerA.attr(
      'href',
      'javascript:prdWantBookAjax.add(' +
        "'" +
        prdAddMyBookShelf.pageBlockId +
        "','" +
        prdAddMyBookShelf.productId +
        "','" +
        prdAddMyBookShelf.displayType +
        "');"
    )

    var innerImg = jQuery('<img/>')
    innerImg.attr('src', '/library/img/pc/btn_list_03_o.png')
    innerImg.attr('alt', '欲しい本に追加する')
    innerImg.attr('height', '22')
    innerImg.attr('width', '152')
    innerImg.attr('id', 'dy_img_' + prdAddMyBookShelf.haveProductId)

    var button = jQuery('<li/>')
    button.attr('id', 'dy_addWntBk_' + prdAddMyBookShelf.haveProductId)

    innerA.append(innerImg)
    button.append(innerA)
    return button
  },

  /**
   * ほしい本に追加するのボタンを生成(アクションエリア) PCDetail.
   *
   * @return button 欲しい本に追加するボタン要素
   */
  _createWantButtonPcDetail: function() {
    var button = jQuery('<p/>')
    button.attr('id', 'dy_addWntBk_' + prdAddMyBookShelf.haveProductId)

    var wantBookText = 'ほしい本に追加'
    // 電子書籍の場合
    if (prdAddMyBookShelf.ebookFlg === 'true') {
      wantBookText = wantBookText + '（値下がりすると通知がきます）'
    }

    if (prdAddMyBookShelf.displayType === 'pcDetailHbPrdList') {
      // IE6,7,8でattrによるonclickイベントの追加が出来ない為、直接HTMLを編集
      button.html(
        '<a href="javascript:void(0);" style="text-decoration: none;"><span class="stBtn stUserAction stWish" ' +
          'name=addWntBkBtnDisp ' +
          'id=dy_img_' +
          prdAddMyBookShelf.haveProductId +
          ' ' +
          'onclick=prdWantBookAjax.add(' +
          "'" +
          prdAddMyBookShelf.pageBlockId +
          "','" +
          prdAddMyBookShelf.productId +
          "','" +
          prdAddMyBookShelf.haveProductId +
          "','" +
          'pcDetail' +
          "');" +
          '>ほしい本に追加</span></a>'
      )
    } else {
      // IE6,7,8でattrによるonclickイベントの追加が出来ない為、直接HTMLを編集
      button.html(
        '<a href="javascript:void(0);" style="text-decoration: none;"><span class="stBtn stUserAction stWish stSizeL" ' +
          'name=addWntBkBtnDisp ' +
          'id=dy_img_' +
          prdAddMyBookShelf.haveProductId +
          ' ' +
          'onclick=prdWantBookAjax.add(' +
          "'" +
          prdAddMyBookShelf.pageBlockId +
          "','" +
          prdAddMyBookShelf.productId +
          "','" +
          prdAddMyBookShelf.haveProductId +
          "','" +
          prdAddMyBookShelf.displayType +
          "');" +
          '>' +
          wantBookText +
          '</span></a>'
      )
    }
    return button
  },

  /**
   * ほしい本に追加するのリンクを生成(ハイブリット商品リスト) pcDetailHbPrdList.
   *
   * @return link ほしい本に追加するリンク要素
   */
  _createWantButtonPcDetailHbPrdList: function() {
    var link = jQuery('<span/>')
    link.attr('id', 'dy_addWntBk_hbPrdList_' + prdAddMyBookShelf.haveProductId)

    if (prdAddMyBookShelf.displayType === 'pcDetailHbPrdList') {
      // IE6,7,8でattrによるonclickイベントの追加が出来ない為、直接HTMLを編集
      link.html(
        '<a ' +
          'href=javascript:void(0); style="text-decoration: none;" ' +
          'id=dy_img_hbPrdList_' +
          prdAddMyBookShelf.haveProductId +
          ' ' +
          'onclick=prdWantBookAjax.add(' +
          "'" +
          prdAddMyBookShelf.pageBlockId +
          "','" +
          prdAddMyBookShelf.productId +
          "','" +
          prdAddMyBookShelf.haveProductId +
          "','" +
          prdAddMyBookShelf.displayType +
          "');return false;" +
          '>' +
          '欲しい本に追加する' +
          '</a>'
      )
    } else {
      // IE6,7,8でattrによるonclickイベントの追加が出来ない為、直接HTMLを編集
      link.html(
        '<a ' +
          'href=javascript:void(0); style="text-decoration: none;" ' +
          'id=dy_img_hbPrdList_' +
          prdAddMyBookShelf.haveProductId +
          ' ' +
          'onclick=prdWantBookAjax.add(' +
          "'" +
          prdAddMyBookShelf.pageBlockId +
          "','" +
          prdAddMyBookShelf.productId +
          "','" +
          prdAddMyBookShelf.haveProductId +
          "','" +
          'pcDetailHbPrdList' +
          "');return false;" +
          '>' +
          '欲しい本に追加する' +
          '</a>'
      )
    }

    return link
  },

  /**
   * ほしい本に追加するのボタンを生成 SPList.
   *
   * @return button ほしい本に追加するボタン要素
   */
  _createWantButtonSpList: function() {
    var inner = jQuery('<button/>')
    inner.attr('id', 'dy_img_' + prdAddMyBookShelf.haveProductId)
    inner.attr('type', 'submit')
    inner.attr('name', 'regWant')
    inner.attr(
      'onclick',
      'prdWantBookAjax.add(' +
        "'" +
        prdAddMyBookShelf.pageBlockId +
        "','" +
        prdAddMyBookShelf.productId +
        "','" +
        prdAddMyBookShelf.haveProductId +
        "','sp');"
    )
    inner.addClass('stBtn stUserAction stWish dyPreventDoubleSubmit')

    var innerHtml = '欲しい本に追加'
    inner.text(innerHtml)

    var button = jQuery('<p/>')
    button.attr('id', 'dy_addWntBk_' + prdAddMyBookShelf.haveProductId)

    button.append(inner)
    return button
  },

  /**
   * ほしい本に追加するのボタンを生成 SPDetail.
   *
   * @return button ほしい本に追加するボタン要素
   */
  _createWantButtonSpDetail: function() {
    var inner = jQuery('<button/>')
    inner.attr('type', 'button')
    inner.attr(
      'onclick',
      'prdWantBookAjax.add(' +
        "'" +
        prdAddMyBookShelf.pageBlockId +
        "','" +
        prdAddMyBookShelf.productId +
        "','" +
        prdAddMyBookShelf.haveProductId +
        "','sp');"
    )
    inner.addClass('stBtn stUserAction stWish')

    var innerHtml = 'ほしい本に追加'
    inner.text(innerHtml)

    // 電子書籍の場合
    if (prdAddMyBookShelf.ebookFlg === 'true') {
      inner.append('<span>（値下がりすると通知がきます）</span>')
    }

    var button = jQuery('<p/>')
    button.attr('id', 'dy_addWntBk_' + prdAddMyBookShelf.haveProductId)

    button.append(inner)
    return button
  },

  /**
   * ローディング画像を設定する.
   */
  _setLoadingImage: function() {
    // PCの場合
    if (this.displayType.match(/^pc/)) {
      HC.Ajax.loadingImage = '/library/img/pc/loading_01.gif'
    }
  }
}
