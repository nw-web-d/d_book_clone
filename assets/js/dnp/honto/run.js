/**
 * @fileOverview PC版共通機能用ファイル
 * @name run.js
 */

/**
 * 制作名前空間 Design
 * @namespace 制作名前空間
 */
if (typeof DE === 'undefined') {
  var DE = {}
}

/**
 * クッキー保存
 * @param cName 名前
 * @param value 値
 */
DE.setCookie = function(cName, value) {
  var s = cName + '=' + value
  document.cookie = s
}

/**
 * クッキーの値を取得
 * @param cName 名前
 */
DE.getCookie = function(cName) {
  if (document.cookie.length > 0) {
    // クッキーの値を取り出す
    var st = document.cookie.indexOf(cName + '=')
    if (st != -1) {
      st = st + cName.length + 1
      var ed = document.cookie.indexOf(';', st)
      if (ed == -1) ed = document.cookie.length
      return document.cookie.substring(st, ed)
    }
  }
  return ''
}

/**
 * 開発名前空間
 * @namespace 開発名前空間
 */
if (typeof DY === 'undefined') {
  var DY = {
    onPreloadFunction: null,
    onAdjustDisplayFunction: null,
    device: 'pc',
    suggestList: null
  }
}

// Debug for IE
if (!('console' in window)) {
  window.console = {}
  window.console.log = function() {}
}

/**
 * jQuery$使用処理
 */
jQuery.noConflict()
jQuery(document).ready(function($) {
  // IE Cashe
  try {
    document.execCommand('BackgroundImageCache', false, true)
  } catch (e) {}

  // Get User Agent
  var _ua = navigator.userAgent.toLowerCase(),
    touchFlag = 'ontouchstart' in window,
    WIN = $(window)

  // IE6
  var tyIE6 =
    typeof window.addEventListener === 'undefined' &&
    typeof document.documentElement.style.maxHeight === 'undefined'

  /**
   * jQuery filter() と find() の返値を合成した結果を返す
   * @param {string|Element|jQuery} param
   *     jQuery find() および filter() に与えられる第1引数のうち共通するもの
   * @see http://api.jquery.com/find/
   */
  $.fn.findWithSelf = function(param) {
    return this.filter(param).add(this.find(param))
  }

  /**
   * スクリプト機能適用関数(先読み処理用).
   * 先読み完了時に呼び出される。
   * @param container スクリプト機能適用対象要素
   */
  DY.onPreloadFunction = function(container) {
    // ライトボックス
    makeFancybox(container)
    // タブナビゲーション
    if (0 < $('.stTabNav01').length) {
      $('.stTabNav01 ul.stTabs').each(function() {
        setTabNavi($(this))
      })
    }
    // 検索結果高さ調整
    if (
      $('div.stLiquidProduct01').length ||
      $('div.stLiquidProduct02').length
    ) {
      setLiquidList($('div.stLiquidProduct01'), 130)
      setLiquidList($('div.stLiquidProduct02'), 190)
    }
    // 外部からイベント取得の為の処理
    $(window).trigger('ajaxLoad', container)
  }

  /**
   * スクリプト機能適用関数(商品カラム表示高さ調整用).
   * 商品カラム表示高さ調整時に呼び出される。
   */
  DY.onAdjustDisplayFunction = function() {
    // 商品カラム表示の高さを揃える
    setHeightFunctions()
  }

  /**
   * スクリプト機能適用関数.<br>
   * Ajax受信HTMLにもスクリプトを適用する必要が生じたため、NSSOL側で追加した.<br>
   * ドキュメント読み込み完了時と、Ajax受信HTMLによる要素の更新時に呼び出される.<br>
   * 前者はドキュメント全体、後者は受信HTMLを対象とする.<br>
   * @param container スクリプト機能適用対象要素
   */
  var onInit = (HC.Ajax.onUpdateFunction = function(container) {
    //専用AP外部リンク対応
    if (window.openOutsideSite) {
      container
        .find('a')
        .filter(function() {
          var href = $(this).attr('href')
          //hrefの設定がない場合は対象外
          if (!href) return false
          //メール、通話用リンクも対象
          if (/^(?:mailto|tel):/i.test(href)) return true
          //http:// or https://から始まらなければ対象外
          if (!/^https?:\/\//i.test(href)) return false
          //DEBUG用(本番に影響ありません)
          if (HC.DEF_DBG && /^https?:\/\/localhost/i.test(href)) return false
          //hontoサイト外へのリンクを対象とする
          return !/^https?:\/\/(?:[^\/]+\.)?honto\.jp(?:\/|$)/i.test(href)
        })
        .click(function(event) {
          event.preventDefault()
          event.stopPropagation()
          window.openOutsideSite($(this).attr('href'))
        })
    }
    //二重送信防止
    container.findWithSelf('.dyPreventDoubleSubmit').each(function() {
      var onclick = $(this).prop('onclick') || function() {}
      $(this)
        .attr('onclick', '')
        .prop('onclick', null)
        .click(function(event) {
          onclick.call(this, event)
          if (!Honto.Common.isSubmitted) {
            //未サブミットの場合
            Honto.Common.isSubmitted = true
            return true
          } else {
            //サブミット済みの場合
            event.preventDefault()
            event.stopPropagation()
            return false
          }
        })
    })
    //すべて選択
    if (container.find('.stChoiceAll .stChoiceAll').length)
      setAllSelected(container)
    // スターレイティング
    container.findWithSelf('.stStar .star').rating(ratingSetting)
    //リキッドリスト（面陳）
    if (container.find('.stLiquidProduct01').length)
      setLiquidList(container.find('.stLiquidProduct01'), 130)
    if (container.find('.stLiquidProduct02').length)
      setLiquidList(container.find('.stLiquidProduct02'), 190)
    // 検索結果利用ブロック（カルーセル）
    if (container.find('.stSearchResultCarousel01').length)
      setLiquidList(container.find('.stSearchResultCarousel01'), 190)
    //ライトボックス
    makeFancybox(container)
    // 新刊お知らせメール
    if (container.find('.stSwitch li.stSelected').length > 0) settingMail()
    // 欲しい本情報の取得
    if (!(typeof wantBookLink === 'undefined')) {
      wantBookLink.init($('body'))
    }
    // 欲しい本の書影全てに対してホバーアクションでの処理
    $('body').on('mouseover', '.stBookItem', function(e) {
      var _target = jQuery(e.currentTarget)
      //欲しい本情報の取得
      if (!(typeof wantBookLink === 'undefined')) {
        wantBookLink.hoverAction(_target)
      }
    })
    //ブックツリーの高さ合わせ
    if (WIN.width() < 1920 && WIN.width() > 1640) {
      var stBtRecommendColumn = 6
    } else {
      var stBtRecommendColumn = 5
    }
    $('.stBtRecommendList .stBtTitle a').autoHeight({
      column: stBtRecommendColumn
    })
    $('.stBtRecommendList .stBtCard').autoHeight({
      column: stBtRecommendColumn
    })
    // 特集一覧バナーブロックの高さ合わせ
    $('.stListBanner01.stItem3 > li:last-child .stItem a img').on(
      'load',
      function() {
        setHeightFunctions()
      }
    )
    // 外部からイベント取得の為の処理
    $(window).trigger('ajaxLoad', container)
  })

  /**
   * ライトボックス作成関数.<br>
   * @param context スクリプト機能適用対象要素
   */
  function makeFancybox(context) {
    //Fancybox
    //インライン指定ライトボックス
    context.find("a[rel='lightbox']").fancybox({
      showNavArrows: false,
      overlayOpacity: 0.8,
      padding: 0,
      width: 860,
      autoScale: false,
      onStart: function(ary, i) {
        jQuery('#fancybox-wrap').removeClass('stBranch01')
        var a = ary[i]
        var qa = $(a)
        HC.cutOutHrefHash(qa)
        var lightboxWidth = qa.attr('lightboxWidth')
        if (lightboxWidth) {
          //lightboxWidth属性が指定されている場合は表示幅として設定
          this.width = parseInt(lightboxWidth)
        }
        var onClosed = qa.attr('onClosed')
        if (onClosed) {
          //onClosed属性にコードが設定されている場合はこれをクローズ時に実行するよう設定
          this.onClosed = function(currentArray, currentIndex, currentOpts) {
            new Function(
              'currentArray',
              'currentIndex',
              'currentOpts',
              onClosed
            ).call(a, currentArray, currentIndex, currentOpts)
          }
        }
        var showCloseButton = qa.attr('showCloseButton')
        if (showCloseButton && showCloseButton == 'false') {
          //showCloseButton属性が"false"の場合はモーダルで表示
          this.modal = true
        }
        var onOpen = qa.attr('onOpen')
        if (onOpen) {
          //onOpen属性にコードが設定されている場合はこれを実行
          new Function(onOpen).call(a)
        }
      },
      onComplete: function() {
        //画像切り替え
        imgSiwtcherForLB($('#fancybox-content .stThumb img'))
        //タブナビゲーション
        if (0 < $('#fancybox-content .stTabNav01').size()) {
          $('#fancybox-content .stTabNav01 ul.stTabs').each(function() {
            setTabNavi($(this))
          })
        }
        //メールの設定
        if (0 < $('#fancybox-content .stSwitch li.stSelected').size())
          settingMail()
      }
    })

    //Ajax使用ライトボックス
    context.find("a[rel='lightboxAjax']").fancybox({
      showNavArrows: false,
      overlayOpacity: 0.8,
      padding: 0,
      width: 860,
      autoScale: false,
      type: 'ajax',
      onStart: function(ary, i) {
        var a = ary[i]
        var qa = $(a)
        jQuery('#fancybox-wrap').removeClass('stBranch01')
        HC.cutOutHrefHash(qa)
        var lightboxWidth = qa.attr('lightboxWidth')
        if (lightboxWidth) {
          //lightboxWidth属性が指定されている場合は表示幅として設定
          this.width = parseInt(lightboxWidth)
        }
        this.ajax.data = Honto.Common.Ajax._getParameters(
          qa.attr('pageBlockId'),
          qa.attr('lightboxData') || '',
          { isPart: true, noResponse: false, type: 'lightbox' },
          false
        )
        var onClosed = $(a).attr('onClosed')
        if (onClosed) {
          //onClosed属性にコードが設定されている場合はこれをクローズ時に実行するよう設定
          this.onClosed = function(currentArray, currentIndex, currentOpts) {
            new Function(
              'currentArray',
              'currentIndex',
              'currentOpts',
              onClosed
            ).call(a, currentArray, currentIndex, currentOpts)
          }
        }
        var showCloseButton = qa.attr('showCloseButton')
        if (showCloseButton && showCloseButton == 'false') {
          //showCloseButton属性が"false"の場合はモーダルで表示
          this.modal = true
        }
        var onOpen = qa.attr('onOpen')
        if (onOpen) {
          //onOpen属性にコードが設定されている場合はこれを実行
          new Function(onOpen).call(a)
        }
      },
      ajax: {
        cache: false,
        dataType: 'html',
        type: 'post',
        url: Honto.Common.Ajax.url
      },
      onComplete: function() {
        //画像切り替え
        imgSiwtcherForLB($('#fancybox-content .stThumb img'))
        //タブナビゲーション
        if (0 < $('#fancybox-content .stTabNav01').size()) {
          $('#fancybox-content .stTabNav01 ul.stTabs').each(function() {
            setTabNavi($(this))
          })
        }
        //メールの設定
        if (0 < $('#fancybox-content .stSwitch li.stSelected').size())
          settingMail()
        onInit($('#fancybox-content'))

        var onComplete = $(this.orig.context).attr('onComplete')
        if (onComplete) {
          //onComplete属性にコードが設定されている場合はこれを実行
          new Function(onComplete).call()
        }
      }
    })

    //IFrame使用ライトボックス
    context.find("a[rel='lightboxIFrame']").fancybox({
      showNavArrows: false,
      overlayOpacity: 0.8,
      padding: 0,
      width: 860,
      autoScale: false,
      type: 'iframe',
      onStart: function(ary, i) {
        jQuery('#fancybox-wrap').removeClass('stBranch01')
        var a = ary[i]
        var qa = $(a)
        var lightboxWidth = qa.attr('lightboxWidth')
        var lightboxHeight = qa.attr('lightboxHeight')
        if (lightboxWidth) {
          //lightboxWidth属性が指定されている場合は表示幅として設定
          this.width = parseInt(lightboxWidth)
        }
        if (lightboxHeight) {
          //lightboxHeight属性が指定されている場合は表示高さとして設定
          this.height = parseInt(lightboxHeight)
        }
        var onClosed = qa.attr('onClosed')
        if (onClosed) {
          //onClosed属性にコードが設定されている場合はこれをクローズ時に実行するよう設定
          this.onClosed = function(currentArray, currentIndex, currentOpts) {
            new Function(
              'currentArray',
              'currentIndex',
              'currentOpts',
              onClosed
            ).call(a, currentArray, currentIndex, currentOpts)
          }
        }
        var showCloseButton = qa.attr('showCloseButton')
        if (showCloseButton && showCloseButton == 'false') {
          //showCloseButton属性が"false"の場合はモーダルで表示
          this.modal = true
        }

        var onOpen = qa.attr('onOpen')
        if (onOpen) {
          //onOpen属性にコードが設定されている場合はこれを実行
          new Function(onOpen).call(a)
        }
      },
      onComplete: function(ary, i) {
        var a = ary[i]
        var qa = $(a)

        jQuery('#fancybox-wrap').addClass('stBranch01')

        //画像切り替え
        imgSiwtcherForLB($('#fancybox-content .stThumb img'))
        //タブナビゲーション
        if (0 < $('#fancybox-content .stTabNav01').size()) {
          $('#fancybox-content .stTabNav01 ul.stTabs').each(function() {
            setTabNavi($(this))
          })
        }
        //メールの設定
        if (0 < $('#fancybox-content .stSwitch li.stSelected').size())
          settingMail()

        //高さの自動調整
        var autoHeight = qa.attr('autoheight')
        if (autoHeight === 'true') {
          var fbFrame = $('#fancybox-frame')
          fbFrame.iframeAutoHeight({
            heightOffset: 10,
            minHeight: 220, // 高さ0pxの回避
            resetToMinHeight: true, // webkit系のために最小の高さを解除
            callback: function(obj) {
              // iFrame用調整クラス付与
              fbFrame
                .contents()
                .find('body')
                .addClass('stIframe')

              // iframe内のコンテンツ高さ取得と調整
              var ifHeight = Number(obj.newFrameHeight) + 150
              fbFrame.height(ifHeight)

              // iframe親要素の高さをautoにし、スクロールを消すクラスを付与
              $('#fancybox-content')
                .css('height', 'auto')
                .addClass('stScrollHidden')
              fbFrame.addClass('stScrollHidden')

              if (WIN.height() < ifHeight) {
                // スクリーンサイズよりもiframeが長い場合
                $('#fancybox-wrap').css('top', '20px')
                $('html,body').scrollTop('0')

                var docHeight = $(document).height()
                if (docHeight > ifHeight) {
                  // コンテンツよりiframeが短い場合
                  $('#fancybox-overlay').css('height', docHeight)
                } else {
                  $('#fancybox-overlay').css('height', ifHeight)
                }
              } else {
                $.fancybox.center(true)
              }
            }
          })
        }
      }
    })
  }

  //トップウィンドウでの遷移
  $('a.stTargetTop').on('click', function(e) {
    if (window == window.top) return
    e.preventDefault()
    window.top.location.href = this.href
  })

  //ポップアップ
  $("a[rel='popup']").click(function() {
    window.open(this.href, 'popup', 'width=830, resizable=yes, scrollbars=yes')
    return false
  })

  //高さ揃え
  function setHeightFunctions() {
    //ブロックをまたいで高さ調整してしまうためul要素毎に高さ合わせをする

    var $stItem = $('ul.stListItem01.stItem3')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 3 })
    }
    $stItem = $('ul.stListItem01.stItem4')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 4 })
    }
    $stItem = $('ul.stListItem01.stItem5')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 5 })
    }
    $stItem = $('ul.stListItem01.stItem6')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 6 })
    }
    $stItem = $('ul.stListBanner01.stItem2')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 2 })
    }
    $stItem = $('ul.stListBanner01.stItem3')
    for (var i = 0; $stItem.length > i; i++) {
      $stItem
        .eq(i)
        .children('li')
        .autoHeight({ column: 3 })
    }

    $('ul.stListItem01.stItem5 .stDetail').autoHeight({ column: 5 })
    $('div.stBoxChannel01 .stInner .stLink01 li').autoHeight({ column: 4 })
    $('ul.stPickup01.stItem3 > li').autoHeight({ column: 3 })
    $('ul.stPickup01.stItem4 > li').autoHeight({ column: 4 })
    $('ul.stPickup01.stItem5 > li').autoHeight({ column: 5 })
    $('ul.stPickup01 .stHeight').autoHeight({ column: 4 })
    $('ul.stWrapping > li').autoHeight({ column: 2 })
    $('ul.stListForm06 > li').autoHeight({ column: 2 })
    $('div.stRanking01 .stFirst').autoHeight({ column: 3 })
    $('div.stRanking01 .stSecond,div.stRanking01 .stThird').autoHeight({
      column: 6
    })
    $('div.stRanking01 .stUnder').autoHeight({ column: 3 })
    $('div.stRanking02 div.stInner').autoHeight({ column: 3 })
    $('div.stRanking05 div.stInner').autoHeight({ column: 3 })
    $('ul.stRanking06 > li').autoHeight({ column: 5 })
    $('div.stRankingFeature01 div.stInner').autoHeight({ column: 3 })
    $('div.stRankingFeature02 div.stInner').autoHeight({ column: 3 })
    $('div.stBoxStore01 div.stBlockInner').autoHeight({ column: 3 })
    $('div.stBoxStore02 div.stBlockInner').autoHeight({ column: 3 })
    $('div.stBoxStore02 div.stBlockInner .stHeading').autoHeight({ column: 3 })
    $('div.stPointmall div.stInner').autoHeight({ column: 2 })
    $('#stDlOS div.stCol').autoHeight({ column: 3 })
    $('div.stCol2 div.stAccount01').autoHeight({ column: 2 })
    $('div.stColumn.stCol3 div.stBoxHead03').autoHeight({ column: 3 })
    $('.stSetHeight .stHeightCol2').autoHeight({ column: 2 })
    $('.stSetHeight .stHeightCol3').autoHeight({ column: 3 })
    $('.stSetHeight .stHeightCol4').autoHeight({ column: 4 })
    $('.stSearchResultCarousel01 ul.stView li > .stDetail').autoHeight()
    $('.stSearchResultCarousel01 ul.stView li > .stBtnBox').autoHeight()
    //ブックツリーレコメンドの高さ合わせ
    if (WIN.width() < 1920 && WIN.width() > 1640) {
      var stBtRecommendColumn = 6
    } else {
      var stBtRecommendColumn = 5
    }
    $('.stBtRecommendList .stBtTitle a').css('min-height', 'auto')
    $('.stBtRecommendList .stBtCard').css('min-height', 'auto')
    $('.stBtRecommendList .stBtTitle a').autoHeight({
      column: stBtRecommendColumn
    })
    $('.stBtRecommendList .stBtCard').autoHeight({
      column: stBtRecommendColumn
    })
  }

  if (
    _ua.indexOf('chrome') >= 0 ||
    _ua.indexOf('safari') >= 0 ||
    _ua.indexOf('firefox') >= 0
  ) {
    window.addEventListener('load', setHeightFunctions, false)
  } else {
    setHeightFunctions()
  }

  resizeWindow(setHeightFunctions)

  /**
   * ウィンドウリサイズ
   */
  function resizeWindow(event, argument) {
    var timer = false
    WIN.resize(function() {
      if (timer !== false) clearTimeout(timer)
      timer = setTimeout(function() {
        event(argument)
      }, 200)
    })
  }

  /**
   * 画像の切り替え
   * @param [jQuery Object] 対象画像のjQueryObjcet
   */
  function imgSiwtcher(aTarget) {
    aTarget.on('mouseenter', function() {
      var img = $(this)
      var str = img.attr('src')
      str = str
        .replace('item/1/48/', 'item/1/265/')
        .replace('series/1/48/', 'series/1/265/')
        .replace('BC.png', '.png')
      var prev = img.closest('.stThumb').prev()
      prev.find('img:last').attr('src', str)
      if (prev.is('.stLightbox')) {
        var href = img.parent().attr('href')
        prev.find('a:last').attr('href', href)
      }
    })
  }
  if ($('.stProduct01 .stThumb').length)
    imgSiwtcher($('.stProduct01 .stThumb img'))

  /**
   * 画像の切り替え(ライトボックス用)
   * @param 対象画像のjQueryObjcet
   */
  function imgSiwtcherForLB(aTarget) {
    aTarget.on('mouseenter', function() {
      var img = $(this)
      var str = img.attr('src')
      str = str
        .replace('item/1/48/', 'item/1/324/')
        .replace('series/1/48/', 'series/1/324/')
        .replace('BC.png', '.jpg')
      var prev = img.closest('.stThumb').prev()
      prev.find('img:last').attr('src', str)
      if (prev.is('.stLightbox')) {
        var href = img.parent().attr('href')
        prev.find('a:last').attr('href', href)
      }
    })
  }

  /**
   * 動画の再生
   * @param selector 対象要素jQueryセレクタ表現
   * @param mp4jpg   mp4使用時代替画像ファイルパス
   * @param mp4      mp4ファイルパス
   * @param flvjpg   flv使用時代替画像ファイルパス
   * @param flv      flvファイルパス
   */
  function loadMovie(selector, mp4jpg, mp4, flvjpg, flv) {
    if (0 == $(selector).size()) return
    var v = document.createElement('video')
    var m = ''
    if (
      v &&
      v.canPlayType &&
      v.canPlayType('video/mp4').match(/^(probably|maybe)$/i)
    ) {
      if (mp4jpg && mp4) {
        m =
          '<video controls poster="' +
          mp4jpg +
          '" src="' +
          mp4 +
          '" width="320" height="240">' +
          '</video>'
      }
    } else {
      if (flvjpg && flv) {
        m =
          '<object type="application/x-shockwave-flash" data="/library/movie/movie.swf" width="320" height="240">' +
          '<param name="movie" value="/library/movie/movie.swf" />' +
          '<param name="FlashVars" value="flvPath=' +
          flv +
          '&picPath=' +
          flvjpg +
          '" />' +
          '<param name="wmode" value="transparent">' +
          '</object>'
      }
    }
    $(selector).html(m)
  }
  $.each(HC.loadMovieParams, function(index, value) {
    loadMovie.apply(this, value)
  })

  /**
   * 評価ボタンのスワップイメージ
   */
  function swapSurvey() {
    var star = $('.stFormRate01 .stStar img')
    var inputAll = $('.stFormRate01 input:radio')
    var starSrc = star.attr('src')
    var starAlt = star.attr('alt')

    // 評価ボタンと連動してレーティング画像を切り替え
    $('.stFormRate01 .stChoice li').each(function() {
      var input = $(this).children('input:radio')
      var val = input.attr('value')
      var check = input.attr('checked')
      var replaceSrc = starSrc.replace(/(_star)[0-9]/, '$1' + val)
      var replaceAlt = starAlt.replace(/[0-9]$/, val)
      // リロード時の処理
      if (check == 'checked') {
        star.attr({
          src: replaceSrc,
          alt: replaceAlt
        })
      }
      // クリック時の処理
      $(this).click(function() {
        inputAll.removeAttr('checked')
        input.attr('checked', 'checked')
        star.attr({
          src: replaceSrc,
          alt: replaceAlt
        })
      })
    })
  }
  swapSurvey()

  /**
   * チェックボックスをすべて選択する関数
   */
  function setAllSelected(context) {
    // 対象チェックボックス
    var _checkBox = context.find(
      '.stProduct02 .stCheckBox input[type=checkbox] , .stTableCart input[type=checkbox], .stChoiceInput [type=checkbox]'
    )
    // 全選択ボタン要素
    var _choiceAll = context.find('.stChoiceAll .stChoiceAll')
    // コントロールエリア表示用エリア
    var _deleateArea = $('.stChoiceDeleate')
    // コントロールエリア表示用ボタン
    var _deleateBtn = $('.stChoiceDeleateBtn')

    _choiceAll.on('click', function() {
      // 同画面内で追加・削除される動作があるので、クリックするたびに要素を取得
      _checkBox = context.find(
        '.stProduct02 .stCheckBox input[type=checkbox] , .stTableCart input[type=checkbox], .stChoiceInput [type=checkbox]'
      )

      // クリックで切替
      _choiceAll.toggleClass('active')

      var i = 0
      if ($(this).hasClass('active')) {
        _choiceAll.text('選択解除')
        for (i = 0; i < _checkBox.length; i++) {
          _checkBox[i].checked = true
        }
      } else {
        _choiceAll.text('すべて選択')
        for (i = 0; i < _checkBox.length; i++) {
          _checkBox[i].checked = false
        }
      }
    })

    _checkBox.on('change', function(e) {
      //同画面内で削除される動作があるので、クリックするたびに個数を取得
      var _cbLength = context.find(
        '.stProduct02 .stCheckBox input[type=checkbox] , .stTableCart input[type=checkbox], .stChoiceInput [type=checkbox]'
      ).length
      var _cbAcLength = context.find(
        '.stProduct02 .stCheckBox input[type=checkbox]:checked , .stTableCart input[type=checkbox]:checked, .stChoiceInput [type=checkbox]:checked'
      ).length

      if (_cbLength > _cbAcLength) {
        _choiceAll.removeClass('active').text('すべて選択')
      } else if (_cbLength == _cbAcLength) {
        _choiceAll.addClass('active').text('選択解除')
      } else {
        _choiceAll.removeClass('active').text('すべて選択')
      }
    })

    _deleateBtn.on('click', function(e) {
      //同画面内で削除される動作があるので、クリック時に取得
      $('.stChoiceInput, .stChoiceControl').removeClass('stHide')
      $('.stChoiceDeleate').hide()
    })
  }

  // キャンペーン挿入エリアID設定
  var insertCampaignId = 'stAutoCompleteCampagin'

  //キャンペーンタイトルID設定
  var campaignTitleId = 'stCampaignTitle'

  /**
   * フリーワード検索（インクリメンタルサーチ）
   */
  function setSuggest() {
    //要素の生成
    $('body').append('<div id="stSuggest" class="stSuggest"></div>')

    var margin = 5,
      stSuggest = $('#stSuggest')

    stSuggest.hide()
    stSuggest.closest('.pbNestedWrapper').css('overflow', 'visible')
    stSuggest.css({ position: 'absolute' })

    var fx = null,
      fy = null,
      watchTimer = null,
      blurTimer = null

    $('#stSearchTextBox, #stSearchTextBoxSlideIn').focus(function(e) {
      var lastValue = '',
        stSearchTextBox = $(this)

      //先行して監視が行われていない場合のみデータを取得し、監視を開始する。
      if (!watchTimer) getSuggestData()

      stSearchTextBox.unbind('keydown')
      stSearchTextBox.bind('keydown', function(KEY) {
        if (stSuggest.find('li').length && KEY.keyCode != 229) {
          var target = stSuggest.find('.stCurrent')
          if (KEY.keyCode == 38) {
            if (target.length) {
              if (target.prev().length) {
                target
                  .prev()
                  .addClass('stCurrent')
                  .siblings()
                  .removeClass('stCurrent')
              } else {
                stSuggest
                  .find('li:last')
                  .addClass('stCurrent')
                  .siblings()
                  .removeClass('stCurrent')
              }
            } else {
              target = stSuggest.find('li:last')
              target.addClass('stCurrent')
            }
            var current = stSuggest.find('.stCurrent')
            lastValue = current.find('a').text()
            stSearchTextBox.val(current.find('a').text())
          } else if (KEY.keyCode == 40) {
            if (target.length) {
              if (target.next().length) {
                target
                  .next()
                  .addClass('stCurrent')
                  .siblings()
                  .removeClass('stCurrent')
              } else {
                stSuggest
                  .find('li:first')
                  .addClass('stCurrent')
                  .siblings()
                  .removeClass('stCurrent')
              }
            } else {
              target = stSuggest.find('li:first')
              target.addClass('stCurrent')
            }
            var current = stSuggest.find('.stCurrent')
            lastValue = current.find('a').text()
            stSearchTextBox.val(current.find('a').text())
          }
        }
      })

      /**
       * インクリメンタルサーチデータ取得関数.<br>
       * 入力要素フォーカス時、および以降0.5秒毎に実行.<br>
       * フォーカスアウト時に実行が停止される.<br>
       */
      function getSuggestData() {
        var value = stSearchTextBox.val()
        if (value.length == 0) {
          //入力なしの場合
          stSuggest.html('').hide()
          lastValue = ''
        } else {
          //入力ありの場合
          var obj = stSearchTextBox.offset()
          fx = obj.left
          fy = obj.top + (stSearchTextBox.height() + margin)
          stSuggest.width(stSearchTextBox.width())
          if (stSuggest.find('li').length) stSuggest.show()
          else stSuggest.hide()
          stSuggest.css({ top: fy + 'px', left: fx + 'px' })
          // 検索BOXスライドイン表示が消えた場合は検索候補も消す(検索候補表示のx座標が左端になることで判定)
          if (fx == 0) {
            stSuggest.html('').hide()
            lastValue = ''
          }
          if (value != lastValue) {
            //前回と入力内容に変化があった場合
            lastValue = value
            var searchTextBoxParam = stSearchTextBox.attr('searchTextBoxParam')
            searchTextBoxParam = searchTextBoxParam
              ? searchTextBoxParam.toQueryParams()
              : {}
            HC.Ajax.json(
              stSearchTextBox.attr('pageBlockId'),
              function(result) {
                if (result.suggestValue || result.campaign) {
                  stSuggest.html('')
                  if (result.suggestValue) {
                    //受信データがある場合
                    var stSuggestList = $('<ul></ul>')
                    DY.suggestList = stSuggestList[0].childNodes
                    //検索候補の作成
                    for (
                      var i = 0, len = result.suggestValue.length;
                      i < len;
                      i += 1
                    ) {
                      var stSuggestLink = $('<a href="#"></a>')
                      // イベント設定
                      stSuggestLink
                        .mouseover(function(event) {
                          $(this).attr('id', 'ui-active-menuitem')
                        })
                        .mouseout(function(event) {
                          $(this).removeAttr('id', 'ui-active-menuitem')
                        })
                        .click(function(event) {
                          event.preventDefault()
                          if (blurTimer) {
                            //候補クリック時は検索候補を非表示にしない
                            clearTimeout(blurTimer)
                            blurTimer = null
                          }
                          stSearchTextBox.val($(this).text())
                          stSuggest.html('').hide()
                          stSearchTextBox.get(0).form.submit()
                        })

                      escapedValue = value.escapeHTML()
                      stSuggestLink.html(
                        result.suggestValue[i]
                          .escapeHTML()
                          .replace(
                            escapedValue,
                            '<em>' + escapedValue + '</em>'
                          )
                      )
                      var stSuggestItem = $('<li></li>')
                      stSuggestItem.html(stSuggestLink)
                      stSuggestList.append(stSuggestItem)
                    }
                    stSuggest.html(stSuggestList)
                  }

                  if (result.campaign) {
                    // キャンペーン情報タイトル要素
                    var campaignTitle = $(
                      '<p id="' +
                        campaignTitleId +
                        '" class="' +
                        campaignTitleId +
                        '" style="display:none;">キャンペーン情報</p>'
                    )
                    stSuggest.append(campaignTitle)
                    // キャンペーン情報挿入要素
                    stSuggest.append('<ul id="' + insertCampaignId + '"></ul>')
                    // キャンペーン情報セット
                    setCampaign(result.campaign)
                  }
                } else {
                  //受信データがない場合
                  stSuggest.html('').hide()
                }
              },
              $.extend(searchTextBoxParam, { q: value, type: 'suggest' })
            )
          }
        }
        watchTimer = setTimeout(getSuggestData, 500)
      }
    })
    $('#stSearchTextBox, #stSearchTextBoxSlideIn').blur(function() {
      if (watchTimer) {
        //インクリメンタルサーチデータ取得を停止
        clearTimeout(watchTimer)
        watchTimer = null
      }
      //すぐに消去すると候補クリック時の入力要素更新ができないため、少し待つ
      blurTimer = setTimeout(function() {
        stSuggest.html('').hide()
      }, 400)
    })
    var w = null
    function reSetSuggest() {
      if ($(':focus').attr('id')) {
        var focusId = $(':focus').attr('id')
        if ($('#' + focusId).width() == w) return
        stSuggest.width($('#' + focusId).width() + margin)
        var obj = $('#' + focusId).offset()
        fx = obj.left
        fy = obj.top + ($('#' + focusId).height() + margin)
        stSuggest.css({ top: fy + 'px', left: fx + 'px' })
        w = $('#' + focusId).width()
      }
    }

    if (!tyIE6) {
      //IE6以外の処理
      WIN.resize(function() {
        reSetSuggest()
      })
    } else {
      //IE6の処理
      var timer = setInterval(reSetSuggest, 100)
    }

    function sendSuggestData() {
      // s_code.jsの読み込みが無い場合は除外
      // あしあと抽選ページ、あしあと抽選結果ページで読み込みを除外している
      if (!(typeof s === 'undefined')) {
        var suggestCount = DY.suggestList.length
        for (var j = suggestCount - 1; j >= 0; j--) {
          if (
            $(DY.suggestList[j].firstChild).attr('id') == 'ui-active-menuitem'
          ) {
            // innerHTMLの値にaタグ、emタグが含まれるため空文字に置換
            s.prop30 = DY.suggestList[j].innerHTML.replace(
              /<[aA][^>]*>|<[eE][mM]>|<\/[eE][mM]>|<\/[aA]>/g,
              ''
            )
            s.prop43 = j + 1
            s.prop44 = suggestCount
            s.eVar43 = j + 1
            s.eVar44 = suggestCount
          }
        }
        s_sc(s)
      }
    }

    /**
     * キャンペーン情報セット
     * @param _data キャンペーン情報配列
     */
    function setCampaign(_data) {
      // 要素を削除
      $('#' + insertCampaignId).empty()
      // タイトル表示
      $('#' + campaignTitleId).show()

      var len = _data.length,
        campaignList = ''
      for (var i = 0; len > i; i++) {
        campaignList +=
          '<li><a href="' + _data[i].url + '">' + _data[i].label + '</a></li>'
      }
      $('#' + insertCampaignId).append(campaignList)
    }
  }
  if ($('#stSearchTextBox, #stSearchTextBoxSlideIn').length) setSuggest()

  /**
   * フリーワード検索(インクリメンタルサーチ)と同じブロック(プラグイン)に属しているジャンルプルダウン用.<br>
   * 動的に選択肢を切り替える.<br>
   */
  $('#stGenreList').change(function() {
    var l = this
    var selected = l.value
    var fncOnComplete = function(result) {
      if (result && result.genreLabel) {
        l.options.length = 1
        for (var i = 0, len = result.genreLabel.length; i < len; i += 1) {
          var flg = result.genreValue[i] === selected
          l.options[l.options.length] = new Option(
            result.genreLabel[i],
            result.genreValue[i],
            flg,
            flg
          )
        }
      }
    }
    HC.Ajax.json($('#stSearchTextBox').attr('pageBlockId'), fncOnComplete, {
      srchGnrNm: selected,
      type: 'genre'
    })
    HC.Ajax.json(
      $('#stSearchTextBoxSlideIn').attr('pageBlockId'),
      fncOnComplete,
      {
        srchGnrNm: selected,
        type: 'genre'
      }
    )
  })

  /**
   * バルーン表示
   */
  function setBlloons() {
    //バルーン要素の属しているブロックがoverflow:hidden;の場合に、
    //バルーンが隠れてしまう現象を回避するため、バルーン要素をbody直下に移動する
    $('.stBallon')
      .appendTo(document.body)
      .hide()
      .closest('.pbNestedWrapper')
      .css('overflow', 'visible')

    var bodyW = $('body').width(),
      clickHide = false, // 表示非表示フラグ
      clickOther = false, // 他トリガーをクリックしたか
      bllnHover = false, // バルーンへのホバー
      bllnHoverCk = false, // バルーン内クリック判定
      thisInd // 自他トリガーの位置

    $('body')
      .on('click', '.stTriggerC', function(e) {
        // 自他トリガーの保存
        var orderInd = thisInd
        ;(thisInd = $(this).index('.stTriggerC')),
          (prBallon = $(this).closest('.stBallon'))

        // バルーン内のトリガーなら閉じる
        if (prBallon[0]) {
          $('div.stBallon').hide()
          return false
        }

        // 他のトリガーをクリック
        if (orderInd !== thisInd) {
          $('div.stBallon').hide()
          clickHide = false
        }

        // 他のトリガーをクリックした2回目
        if (clickOther) {
          $('div.stBallon').hide()
          clickHide = false
          clickOther = false

          // 3回目が同じリンクなら
          if (orderInd === thisInd) {
            return false
          }
        }

        // バルーン表示
        if (clickHide === false || bllnHoverCk === true) {
          setBalloonPostion(getLocation(e), $(this))
          clickHide = true

          // バルーン表示を隠す処理
          $('html').on('click', function() {
            if (bllnHover == false) {
              $('div.stBallon').hide()
              $('html').off('click')

              setTimeout(function() {
                clickHide = false
                clickOther = false
                bllnHoverCk = false
              }, 300)
            } else {
              bllnHoverCk = true
            }
          })
        }
        return false
      })
      .on('hover click', '.stTriggerH', function(e) {
        if (e.type === 'click') {
          return false
        }
        setBalloonPostion(getLocation(e), $(this))
      })
      .on('mouseenter mouseleave', 'div.stBallon', function(e) {
        if (e.type === 'mouseenter') {
          bllnHover = true
        } else {
          bllnHover = false
        }
      })

    function getLocation(event) {
      if (document.all) {
        // for IE
        var nowX =
          event.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft
        var nowY =
          event.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop
      } else {
        var nowX = event.pageX
        var nowY = event.pageY
      }
      var hy = event.clientY
      /**
       * @param [number,number,number] 要素のx座標 要素のy座標 要素のwindowからのy座標
       */
      return [nowX, nowY, hy]
    }

    function setBalloonPostion(loc, element) {
      if (element.is('input')) {
        var syncList = element.attr('class')
        syncList = String(syncList).split(' ')
        for (var i = 0; i < syncList.length; i++) {
          if (syncList[i] == 'stTriggerC' || syncList[i] == 'stTriggerH')
            continue
          if ($('#' + syncList[i]).length > 0) {
            var syncBalloon = syncList[i]
            break
          }
        }
      } else {
        var syncBalloon = element.attr('href')
        syncBalloon = syncBalloon.substring(1)
      }

      if ($('#' + syncBalloon).is(':hidden')) {
        if (element.attr('onBallon')) {
          //onBallon属性にコードが設定されている場合はこれを実行
          new Function(element.attr('onBallon')).call(element.context)
        } else if (element.context.onballon) {
          //onballonプロパティに関数が設定されている場合はこれを実行
          element.context.onballon.call(element.context)
        }
        $('#' + syncBalloon).show()
      } else {
        $('#' + syncBalloon).hide()
        //バルーン機能用データを初期化
        HC.Ballon.data = {}
        return false
      }
      $('#' + syncBalloon).css({
        position: 'absolute',
        zIndex: '9999'
      })

      //出し分け
      var margin = 30
      var windowW = $('body').width() / 2
      var windowH = document.documentElement.clientHeight / 2
      if (loc[2] > windowH) {
        //上表示
        var elementH = $('#' + syncBalloon).height() + margin
        $('#' + syncBalloon + ' .stBalloonTip').remove()
        $('#' + syncBalloon).append(
          '<span class="stBalloonTip"><img src="' +
            (HC.DEF_DBG ? '.' : '') +
            '/library/img/pc/bg_ballon_04.png" alt="" width="20" height="17" style="vertical-align:top !important;" /></span>'
        )
        if ($.browser.msie && $.browser.version == 6) {
          $('.stBalloonTip').css('bottom', '-3px')
        } else if ($.browser.msie && $.browser.version == 7) {
          $('.stBalloonTip').css('bottom', '-4px')
        } else {
          $('.stBalloonTip').css('bottom', '-15px')
        }
      } else {
        //下表示
        var elementH = margin * -1
        $('#' + syncBalloon + ' .stBalloonTip').remove()
        $('#' + syncBalloon).append(
          '<span class="stBalloonTip"><img src="' +
            (HC.DEF_DBG ? '.' : '') +
            '/library/img/pc/bg_ballon_03.png" alt="" width="20" height="17" /></span>'
        )
        if (_ua.indexOf('msie') >= 0) {
          $('.stBalloonTip').css('top', '-15px')
        } else {
          $('.stBalloonTip').css('top', '-15px')
        }
      }
      var elementW = 16

      $('.stBalloonTip').css('position', 'absolute')
      $('.stBalloonTip').css('left', '50%')
      $('.stBalloonTip').css('margin-left', '-8px')
      // if ( loc[0] > windowW ) {
      // 	//左表示
      // 	var elementW = $("#"+syncBalloon).width() -16;
      // 	$(".stBalloonTip").css("right","10px");
      // } else {
      // 	//右表示
      // 	var elementW = 16;
      // 	$(".stBalloonTip").css("left","20px");
      // 	$(".stBalloonTip").css("margin-left","-10px");
      // }

      $('#' + syncBalloon).css({
        position: 'absolute',
        top: loc[1] - elementH + 'px',
        left: loc[0] - $('#' + syncBalloon).width() / 2 + 'px'
      })

      return false
    }
  }
  setBlloons()

  /**
   * タブナビゲーション
   * @param {Object} jQuery Object タブナビゲーションの対象親要素
   */
  function setTabNavi(target) {
    var targetNum = target.find('li').length
    var ie6Flag = false
    if (_ua.indexOf('msie 6.0') > 0) {
      ie6Flag = true
      targetNum = targetNum * 3
    }

    target.each(function() {
      if ($(this).hasClass('stTabs')) {
        var firstShow = $(this)
          .find('.current, .stCurrent')
          .find('a')
        setContent(firstShow)
      }
    })

    //アンカーリンク名と同名のidを紐付けて表示・非表示を行う
    function setContent(aLinkObj) {
      var tabName = String(aLinkObj.attr('href')).substring(1)
      var showObj = $(aLinkObj)
        .closest('.stTabContainer01')
        .find('.stTabContents01')
        .find('#' + tabName)
      showObj.siblings('div').hide()
      showObj.show()
    }

    function ie6BugFix(obj) {
      obj.find('li a').each(function() {
        $(this)[0].fireEvent('onFocus')
        $(this)[0].fireEvent('onBlur')
      })
    }

    // ショッピングカートのタブのボーダー色切り替え
    function setborderColor() {
      var border = $('.jsBorderColor')
      if (border.find('li.electronCart').hasClass('stCurrent')) {
        border.addClass('ele')
      } else {
        border.removeClass('ele')
      }
    }
    setborderColor()

    target
      .children()
      .children()
      .each(function(i) {
        var parentLi = $(this).closest('li')
        if (parentLi.hasClass('current') || parentLi.hasClass('stCurrent')) {
          parentLi.css('z-index', targetNum + 1)
        } else {
          parentLi.css('z-index', targetNum - i)
        }

        if ($(this).is('a')) {
          $(this).click(function() {
            //アンカーリンク時の処理
            //通常のリンクの場合はページ遷移
            if (String($(this).attr('href')).indexOf('#') >= 0) {
              if (
                $(this)
                  .parent('li')
                  .hasClass('current') ||
                $(this)
                  .parent('li')
                  .hasClass('stCurrent')
              )
                return false
              var tabName = String($(this).attr('href')).substring(1)
              var targetLi = $(this)
                .closest('.stTabContainer01')
                .find('.stTabNav01, .stTabNav02')
                .find('.stTabs')
              var parentUL = targetLi.closest('ul')
              targetNum++
              targetLi
                .find('li')
                .removeClass('current')
                .children('a')
              targetLi
                .find('li')
                .removeClass('stCurrent')
                .children('a')

              //IE6
              if (ie6Flag) ie6BugFix(targetLi)
              targetLi
                .find("a[href='#" + tabName + "']")
                .parent('li')
                .addClass('current')
                .addClass('stCurrent')
                .css('z-index', targetNum)
              targetLi
                .find("a[href='#" + tabName + "']")
                .parent('li')
                .hasClass('stEb')
                ? parentUL.addClass('stEb')
                : parentUL.removeClass('stEb')
              targetLi
                .find("a[href='#" + tabName + "']")
                .parent('li')
                .hasClass('stNs')
                ? parentUL.addClass('stNs')
                : parentUL.removeClass('stNs')
              setContent($(this))
              // ショッピングカートのタブのボーダー色切り替え
              setborderColor()

              return false
            }
          })
        }
      })
  }
  if (0 < $('.stTabNav01').size()) {
    $('.stTabNav01 ul.stTabs').each(function() {
      setTabNavi($(this))
    })
  }
  if (0 < $('#stGlobalNav').size()) setTabNavi($('#stGlobalNav').children('ul'))

  /**
   * ランキングタブナビゲーション
   * @param {Object} jQuery Object タブナビゲーションの対象親要素
   */
  function setTabNavi2(target) {
    var targetNum = target.find('li').length

    if (target.hasClass('stTabNav02')) {
      var firstShow = target.find('.stCurrent').find('a')
      setContent(firstShow)
    }

    //アンカーリンク名と同名のidを紐付けて表示・非表示を行う
    function setContent(aLinkObj) {
      var parentUL = aLinkObj.closest('ul')
      var tabName = String(aLinkObj.attr('href')).substring(1)
      var showObj = $(aLinkObj)
        .closest('.stTabContainer02')
        .find('.stTabContents02')
        .find('#' + tabName)
      showObj.siblings('div').hide()
      showObj.show()
    }

    target.find('a').each(function(i) {
      $(this).click(function() {
        //アンカーリンク時の処理
        //通常のリンクの場合はページ遷移
        if (String($(this).attr('href')).indexOf('#') >= 0) {
          if (
            $(this)
              .parent('li')
              .hasClass('current')
          )
            return false
          var tabName = String($(this).attr('href')).substring(1)
          var targetLi = $(this)
            .closest('.stTabContainer02')
            .find('.stTabNav02')
          targetNum++
          targetLi
            .find('li')
            .removeClass('stCurrent')
            .children('a')
          targetLi
            .find("a[href='#" + tabName + "']")
            .parent('li')
            .addClass('stCurrent')
          setContent($(this))
          return false
        }
      })
    })
  }
  if (0 < $('.stTabNav02').size()) {
    $('.stTabNav02').each(function() {
      setTabNavi2($(this))
    })
  }

  /**
   * メール受信設定
   */
  function settingMail() {
    // 選択済み
    $('.stSwitch li.stSelected').each(function() {
      var elem = $(this)
      elem
        .find('a')
        .contents()
        .unwrap('a')
    })

    // 操作
    $('.stSwitch').on('click', 'span', function() {
      var _this = this,
        elem = $(this),
        li = elem.closest('li'),
        pageBlockId = elem.attr('pageBlockId')

      // ブロックID指定なし or 選択状態
      if (pageBlockId == null || li.hasClass('stSelected')) return

      var isRes = elem.closest('li').is('.stRes')
      HC.Ajax.json(
        pageBlockId,
        isRes
          ? function(data) {
              if (data.isOK) {
                switchButton.call(_this)
              } else {
                $($(_this).attr('mailSettingMsg')).html(data.message)
              }
            }
          : null,
        $.extend(
          $(this)
            .attr('mailSettingParam')
            .toQueryParams(),
          {
            type: 'mailSetting',
            mailSettingVal: $(this).attr('mailSettingVal')
          }
        ),
        isRes ? this : null
      )

      function switchButton() {
        //クリックした要素
        li.siblings()
          .removeClass('stSelected')
          .not(":has('a')")
          .wrapInner("<a href='#'></a>")
        //対の要素
        li.addClass('stSelected')
          .find('span')
          .unwrap()
      }
      if (!isRes) switchButton.call(this)

      return false
    })
  }
  if ($('.stSwitch li.stSelected').length) settingMail()

  /**
   * スターレーティング
   */
  var ratingSetting = {
    callback: function(value) {
      var reteParam = $(this).attr('rateParam')
      reteParam = reteParam ? reteParam.toQueryParams() : {}
      try {
        HC.Ajax.request(
          $(this).attr('pageBlockId'),
          null,
          $.extend(reteParam, {
            name: $(this).attr('name'),
            rateVal: value,
            type: 'rate'
          })
        )
      } catch (e) {}
      var stValue = $(this)
        .closest('.stRating')
        .find('.stValue')
      stValue.children('.stBefore').addClass('dyNoDisplay')
      stValue.children('.stAfter').removeClass('dyNoDisplay')
    }
  }
  $('.stStar').each(function() {
    $(this)
      .find('.star')
      .rating(ratingSetting)
  })

  $('.star-rating-live').each(function() {
    $(this).bind('click', function(e) {
      var k = $(e.currentTarget).index()
      $('.stStarClear').css({
        display: 'block',
        left: $(e.currentTarget).position().left,
        top: $(e.currentTarget).position().top + 2
      })

      $(this)
        .parent('.star-rating-control')
        .find('.star-rating-live')
        .each(function(i) {
          if (i <= k) {
            $(this).addClass('star-rating-on')
          } else {
            $(this).removeClass('star-rating-on')
          }
        })
    })
  })

  //スターレーティング クリアボタン
  $('.stStarClear').on('click', function() {
    $(this).css({ display: 'none' })
    var reteParam = $(this).attr('rateParam')
    reteParam = reteParam ? reteParam.toQueryParams() : {}
    try {
      HC.Ajax.request(
        $(this).attr('pageBlockId'),
        null,
        $.extend(reteParam, {
          name: $(this).attr('name'),
          rateClear: true,
          type: 'rate'
        })
      )
    } catch (e) {}

    var stRaiting = $(this).closest('.stRating')
    stRaiting.find('.stStar .star').rating('select', null, false)
    var stValue = stRaiting.find('.stValue')
    stValue.children('.stAfter').addClass('dyNoDisplay')
    stValue.children('.stBefore').removeClass('dyNoDisplay')
    return false
  })

  /**
   * 入力文字数カウンタ
   */
  $('.stTextCounter').each(function() {
    var root = $(this),
      // カウント対象
      target = root.find('.stTextCounterTarget'),
      // 表示エリア
      view = root.find(root.find('.stTextCounterViewTarget').val()),
      // 最大カウント数
      maxLength,
      // Shift_JIS 1Byte 範囲
      // see also:
      //   http://www.itscj.ipsj.or.jp/ISO-IR/168.pdf
      condSjisBytes = /[ -~]+/g,
      // 入力文字数を取得
      getLength = function(node) {
        // 改行文字は 1 文字とする
        var str = (node.value || '').replace(/\r\n/g, '\n'),
          fullLength = str.length,
          normalLength = str.replace(condSjisBytes, '').length
        // Shift_JIS 1Byte 範囲は 0.5 文字としてカウント
        // 端数は四捨五入（0.5 単位なので常に繰り上げ）
        return normalLength + Math.round((fullLength - normalLength) / 2)
      },
      // 値セット
      setValue = function() {
        var currentLength = getLength(this)
        view.text(
          // 「XX/XX文字」
          currentLength + '/' + maxLength + '\u6587\u5B57'
        )

        // 上限エラー表示
        if (currentLength > maxLength) {
          view.addClass('stStr01')
        } else if (view.hasClass('stStr01') && currentLength <= maxLength) {
          view.removeClass('stStr01')
        }
      },
      // 監視用タイマ ID
      timerId = null,
      // 入力チェック開始
      startCheck = function() {
        var obj = this
        // 2重起動防止
        if (null === timerId) {
          // textinput イベント未サポート
          //   * IME による入力が取得できない
          //   * ユーザによるペーストに対応できない
          timerId = setInterval(function() {
            // タイマーによるチェックで代用
            setValue.call(obj)
          }, 16)
        }
      },
      // 入力チェック終了
      endCheck = function() {
        if (null !== timerId) {
          clearInterval(timerId)
          timerId = null
        }
      }
    // 表示エリアが見つからなければ何もしない
    if (0 < view.length) {
      maxLength = parseInt(
        target.attr('maxlength') || root.find('.stTextCounterMaxLength').val(),
        10
      )
      if (isNaN(maxLength)) maxLength = 1500
      // 初期化
      target
        .bind('focus', startCheck)
        .bind('blur', endCheck)
        .each(setValue)
    }
  })

  /**
   * ドロップダウン
   */
  function dropDownList() {
    // タッチイベントがあるなら無効
    if (touchFlag && !$('#stDropdown').hasClass('stSelectList')) return

    // IEチェック
    var appVersion = window.navigator.appVersion.toLowerCase(),
      _uaIE6 = _ua.indexOf('msie') != -1 && appVersion.indexOf('msie 6.') != -1,
      _uaIE7 = _ua.indexOf('msie') != -1 && appVersion.indexOf('msie 7.') != -1,
      _uaIE8 = _ua.indexOf('msie') != -1 && appVersion.indexOf('msie 8.') != -1

    if (_uaIE6 || _uaIE7) return

    var elem = $('#stDropdown'),
      timer1,
      timer2,
      permitX = 4.2,
      delay = 300,
      halfDelay = 150,
      subFlag = false,
      cdFlag = false,
      mouseX = [
        [9999, 9999, 0],
        [9999, 9999, 0]
      ],
      mouseY = [
        [0, 0, 0],
        [0, 0, 0]
      ]

    // IE8用クラス追加
    if (_uaIE8) elem.addClass('ie8')

    // 自要素配下のドロップ関連要素を返す
    var findCdDrop = function(_this, num) {
        if (num === '3') {
          var stDrop = $(_this)
              .parent()
              .parent()
              .find('.active'),
            stDropList = $(_this)
              .parent()
              .parent()
              .find('ul.show')
        } else {
          var stDrop = elem.find('.active'),
            stDropList = elem.find('ul.show')
        }
        return { a: stDrop, list: stDropList }
      },
      // ドロップダウン切り替え処理
      changeDD = function(_this, num, show) {
        findCdDrop(_this, num).a.removeClass('active')
        findCdDrop(_this, num).list.removeClass('show')

        if (show) {
          $(_this).addClass('active')
          $(_this)
            .next()
            .addClass('show')
        }
      },
      // サブメニュー非表示処理
      resetMx = function() {
        mouseX[0] = [9999, 9999, 0]
        mouseX[1] = [9999, 9999, 0]
      },
      // 無効マウスイベント
      dropMouseOff = function(e, _this, num) {
        if (e.type === 'mouseenter') {
          timer1 = setTimeout(function() {
            // 各NoDropクラス
            findCdDrop(_this, num).a.removeClass('active')
            findCdDrop(_this, num).list.removeClass('show')
            resetMx()
          }, halfDelay)
        } else if (e.type === 'mouseleave') {
          clearTimeout(timer1)
        }
      },
      // マウスイベント
      dropMouseOn = function(e, _this, num) {
        var i = 0
        if (num === '3') i = 1

        if (e.type === 'mousemove') {
          var targetleft = 170
          if (num === '3') targetleft += 160 // 左サイドバーの幅を加算

          if (e.pageX < targetleft) {
            mouseX[i].push(e.pageX)
          } else {
            mouseX[i] = [1]
          }
          mouseY[i].push(e.pageY)
        } else if (e.type === 'mouseleave') {
          var con01 =
            mouseX[i][mouseX[i].length - 3] >= e.pageX ||
            mouseY[i][mouseY[i].length - 3] > e.pageY ||
            mouseX[i][0] == 1
          if (con01) mouseX[i] = [9999, 9999, 0]
        } else if (e.type === 'mouseenter') {
          var a = $(_this),
            subTarget = a.next(),
            thisTop = a.position().top

          // ドロップダウンの縦位置の調整
          subTarget.css('top', thisTop)

          if (num < 3 && subFlag) {
            // ドロップダウンから第1,2メニューへの復帰
            changeDD(_this, num, true)
          } else if (cdFlag) {
            // 第2ドロップダウンから第1ドロップダウンへの復帰
            changeDD(_this, num, true)
            cdFlag = false
          } else {
            // 通常切り替え処理
            var con02 = mouseX[i][mouseX[i].length - 3] >= e.pageX - permitX
            if (con02) changeDD(_this, num, true)
          }

          // ドロップダウンのホバーフラグリセット
          subFlag = false
          if (num === '3') subFlag = true
        }
      }

    // ジャンルナビ全体の無効マウスイベント（領域外に移動したら非表示処理を行う）
    elem
      .on('mouseenter mouseleave', function(e) {
        if (e.type === 'mouseenter') {
          clearTimeout(timer1)
        } else if (e.type === 'mouseleave') {
          timer1 = setTimeout(function() {
            // ジャンルナビ全体
            elem.find('ul.show').removeClass('show')
            elem.find('.active').removeClass('active')
            resetMx()
          }, delay)
        }
      })

      // 無効トリガーマウスイベント
      .on('mouseenter mouseleave', '.stNoDrop01', function(e) {
        dropMouseOff(e, this, '1')
      })
      .on('mouseenter mouseleave', '.stNoDrop02', function(e) {
        dropMouseOff(e, this, '2')
      })
      .on('mouseenter mouseleave', '.stNoDrop03', function(e) {
        dropMouseOff(e, this, '3')
      })

      // トリガーマウスイベント
      .on('mousemove mouseenter mouseleave', '.stDrop01', function(e) {
        dropMouseOn(e, this, '1')
      })
      .on('mousemove mouseenter mouseleave', '.stDrop02', function(e) {
        dropMouseOn(e, this, '2')
      })
      .on('mousemove mouseenter mouseleave', '.stDrop03', function(e) {
        dropMouseOn(e, this, '3')
      })

      // ドロップダウンのホバーイベント
      .on('mouseenter', 'ul.stDropList', function(e) {
        subFlag = true
      })

      // 第2ドロップダウンのホバーイベント
      .on('mouseenter', 'ul.stDropList ul.stDropList', function() {
        cdFlag = true
      })
  }
  if ($('#stDropdown').length) dropDownList()

  /**
   * 専用アプリ内ブラウザ外部リンク対応.<br>
   * 専用AP内ブラウザでは、hontoサイト内の遷移は内部ブラウザで行うが、<br>
   * hontoサイト外への遷移時は外部のデフォルトブラウザで表示する.<br>
   */
  if (
    window.ebook_store_jsfunction &&
    window.ebook_store_jsfunction.displaySite
  ) {
    //window.ebook_store_jsfunction.displaySiteが定義されている場合は専用アプリ内ブラウザとみなす
    var matches = _ua.match(/^dnps[^, ]+(?:,dnps[^, ]+)* (\d+)\.(\d+)/)
    if (matches && parseInt(matches[1]) == 3 && parseInt(matches[2]) >= 3) {
      //ver3.3.0以上～4.0.0未満（暗号化URLを前提としているバージョン）
      window.openOutsideSite = function(url) {
        var msg =
          'アプリ内ブラウザで「honto.jp」外のサイトへリンクいたします。\n' +
          '標準ブラウザでアクセスするためには最新バージョンのアプリをインストールする必要があります。\n' +
          'このまま、アプリ内ブラウザでアクセスを続けますか？\n' +
          '（hontoサイトへは戻るボタンもしくはStoreボタンで戻る必要があります）\n'
        if (confirm(msg)) {
          location.href = url
        }
      }
    } else {
      //ver1.0.0～3.3.0未満および、4.0.0以上
      window.openOutsideSite = function(url) {
        var ret = window.ebook_store_jsfunction.displaySite(url)
        if (ret != 0) {
          alert('指定サイトの表示に失敗しました。')
        }
      }
    }
  }

  /**
   * リキッドリスト 幅可変面陳ブロック
   * shelfH：書影の高さを設定する
   */
  function setLiquidList(elem, shelfH) {
    var webKitBrower = _ua.toLowerCase(),
      contentWidth = 100,
      addHeight = 0

    elem.each(function() {
      var elem = $(this),
        list = elem.find('ul:first').children('li'),
        heading = $('h3', elem),
        listNum = list.length,
        whileNum1 = listNum,
        headMaxH = 0,
        listMaxH = 0,
        blMaxH = 0,
        flexibleBoxMaxHeight = 0

      function reHeight1() {
        var flexibleBox = []
        // 書影＆商品情報の最大高さを取得
        for (var i = 0; listNum > i; i++) {
          flexibleBox[i] = list
            .eq(i)
            .find('.stFlexibleBox')
            .eq(0)[0]
          if ($(flexibleBox).eq(i)[0]) {
            var flexibleBoxHeight = $(flexibleBox)
              .eq(i)
              .height()
            if (flexibleBoxHeight > flexibleBoxMaxHeight)
              flexibleBoxMaxHeight = flexibleBoxHeight
          }
        }

        $(flexibleBox).css('height', flexibleBoxMaxHeight)

        // 1ブロックの最大高さを取得
        for (var i = 0; listNum > i; i++) {
          var listHeight = list.eq(i).height()
          if (listHeight > listMaxH) listMaxH = listHeight
        }

        blMaxH = listMaxH + addHeight
        list.css('minHeight', blMaxH)
      }

      function reHeight2() {
        // 書影の最大高さを取得
        while (whileNum1--) {
          var headH = heading
            .eq(whileNum1)
            .children()
            .height()
          if (headH > headMaxH) headMaxH = headH
        }
        heading.css('minHeight', headMaxH)

        // 1ブロックの最大高さを再定義
        var listMaxReH = blMaxH + headMaxH - shelfH
        list.css('minHeight', listMaxReH)
      }

      function reWidth() {
        if (shelfH == 190) {
          return this
        } else {
          var elemW = elem.width(),
            dispNum = Math.floor(elemW / 133) // 133=1ブロックのpx幅

          if (dispNum > listNum) dispNum = listNum

          var perWidth1 = contentWidth / dispNum,
            perWidth2 = Math.floor(contentWidth / listNum)

          if (listNum > dispNum) {
            list.css('width', perWidth1 + '%')
          } else {
            list.css('width', perWidth2 + '%')
          }
        }
      }

      // Dom Event
      reHeight1()
      reWidth()

      // Window Event
      // WIN.bind({ load:reHeight2 , resize:reWidth });
    })
    return this
  }
  if (
    $('div.stLiquidProduct01').length ||
    $('div.stLiquidProduct02').length ||
    $('.stSearchResultCarousel01').length
  ) {
    setLiquidList($('div.stLiquidProduct01'), 130)
    setLiquidList($('div.stLiquidProduct02'), 190)
    setLiquidList($('.stSearchResultCarousel01'), 190)
  }

  /**
   * スクロール追跡
   */
  function setScChase() {
    var elem = $('#stChase'),
      elemW = elem.width(),
      elemOff = elem.offset()

    WIN.scroll(function() {
      if (WIN.scrollTop() > elemOff.top + 20) {
        elem.addClass('stPosFix').css({
          width: elemW
        })
      } else {
        elem.removeClass('stPosFix')
      }
    })
  }
  if ($('#stChase').length) setScChase()

  /**
   * 著名人レビュー
   */
  function setReviewOver() {
    var elem = $('#stReviewOver'),
      stRevB = elem.find('.stBoxReview04'),
      stRevN = elem.find('.stReviewerName'),
      h1 = $('h1'),
      h1Text = h1.text().replace('さんのレビュー一覧', ''),
      icon = ' <span class="stIconType04">公式</span>'
    stRevlen = stRevB.length

    $.ajax({
      url: '/library/json/author.json',
      dataType: 'json'
    })
      .done(function(obj) {
        if (obj.indexOf(h1Text) !== -1) {
          // ユーザーレビュー一覧
          while (stRevlen--) {
            reviewOff(stRevlen)
          }
          h1.next('p').append(icon)
        } else {
          while (stRevlen--) {
            var rName = stRevN.eq(stRevlen).text()
            if (obj.indexOf(rName) !== -1) {
              reviewOff(stRevlen)
              stRevN.eq(stRevlen).after(icon)
            }
          }
        }
      })
      .fail(function() {
        return false
      })

    function reviewOff(num) {
      var target = stRevB.eq(num)
      target.find('.stVote').hide()
      target.find('.stUtility').hide()
    }
  }
  if ($('#stReviewOver').length) setReviewOver()

  //SNSボタン
  $(
    '#stSocialBtn, .stCpSnsList01, .stCpSnsList02, .stCpSnsList03'
  ).customSocialButton()

  /**
   * SNSシェアボタンリスト
   */
  var stCpSnsList = {
    togggleBtnClass: '.stCpSnsListToggle',
    flgClass: 'stOpen',

    init: function() {
      var elems = jQuery('.stCpSnsList01, .stCpSnsList02, .stCpSnsList03')
      var len = elems.length

      //シェアボタンが同画面内に複数存在した場合の為にそれぞれの要素に適用する
      for (var i = 0; len > i; i++) {
        var elem = elems.eq(i)
        var btn = elem.children(this.togggleBtnClass)
        var fixedFlag = elem.hasClass('stCpSnsList01')

        this.setHeight(elem, btn, fixedFlag)
        // イベントをセット
        this.setEventHandler(elem, btn, fixedFlag)
      }
    },

    setEventHandler: function(elem, btn, fixedFlag) {
      var self = this
      var offsetTop = elem.offset().top

      btn.on('click', function() {
        self.toggle(elem, btn, fixedFlag)
      })

      jQuery(window).on('resize', function() {
        self.setHeight(elem, btn, fixedFlag)
      })

      // 固定配置の要素以外スキップ
      if (!fixedFlag) return
      jQuery(window).on('scroll', function() {
        var scrollTop = jQuery(window).scrollTop()
        if (!fixedFlag) return

        if (scrollTop > offsetTop - 20) {
          elem.css({
            position: 'fixed',
            top: 20
          })
        } else {
          elem.css({
            position: 'absolute',
            top: 'inherit'
          })
        }
      })
    },

    toggle: function(elem, btn, fixedFlag) {
      var flag = btn.hasClass(this.flgClass)
      // flagがtrueの時は開く処理
      if (flag) {
        btn.removeClass(this.flgClass)
      } else {
        btn.addClass(this.flgClass)
      }
      this.setHeight(elem, btn, fixedFlag)
    },

    setHeight: function(elem, btn, fixedFlag) {
      var flag = btn.hasClass(this.flgClass)
      var list = elem.find('li')
      var listWidth = list.width()
      var listOpenWidth = 0

      //閉じた時の長さ
      var listCloseWidth =
        (listWidth + parseInt(list.css('margin-bottom'), 10)) * 4

      // すべての要素の長さ格納
      for (var j = 0; j < list.length; j++) {
        if ('none' === list.eq(j).css('display')) {
          continue
        }
        listOpenWidth =
          listOpenWidth + listWidth + parseInt(list.css('margin-bottom'), 10)
      }

      // flagがtrueの時は開く処理
      if (flag) {
        if (fixedFlag) {
          elem.children('ul').css({ height: listCloseWidth + 'px' })
        } else {
          elem.children('ul').css({ width: listCloseWidth + 'px' })
        }
      } else {
        if (fixedFlag) {
          elem.children('ul').css({ height: listOpenWidth + 'px' })
        } else {
          elem.children('ul').css({ width: listOpenWidth + 'px' })
        }
      }
    }
  }

  /**
   * インフォメーション吹き出し用関数
   */
  var stInfoBox = {
    target: '',
    closeBtn: '',
    cookie: '',
    cookiename: '',

    // _targetにjQueryオブジェクトを指定
    init: function(_target) {
      // 自身を変数に格納
      var self = stInfoBox
      // 各要素を格納
      this.target = _target
      this.closeBtn = _target.find('.stInfoBoxClose')

      //cookieが無効の場合は離脱
      if (!navigator.cookieEnabled) return
      //インフォメーションボックスがない場合は離脱
      if (!this.target) return
      // 設定する要素のcookieの名前を取得
      this.cookiename = this.target.data('cookiename')
      // cookieを取得
      this.cookie = this.getCookie()
      // 表示制御
      this.toggleDisplay()
      // 削除ボタンクリック
      this.closeBtn.on('click', function() {
        self.hide()
      })
    },

    // cookieを取得する
    getCookie: function() {
      return Cookies.get(this.cookiename)
    },

    // cookieをセットする
    setCookie: function() {
      var cExpires = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 730) //2年後の日付を設定
      Cookies.set(this.cookiename, '1', { expires: cExpires, path: '/' })
    },

    //インフォメーションボックスがない場合は離脱
    toggleDisplay: function() {
      if (this.cookie === '1') {
        //1の場合は削除ずみ
        this.target.hide()
      } else {
        this.target.show()
      }
    },

    hide: function() {
      this.target.hide()
      this.setCookie()
    }
  }

  var $stInfoBox = $('.stInfoBox')
  for (var i = 0; $stInfoBox.length > i; i++) {
    stInfoBox.init($('.stInfoBox'))
  }

  stCpSnsList.init()

  //欲しい本リンク（♡）機能の適用
  wantBookLink.initRegist()

  //ドキュメント読み込み時スクリプト機能適用
  onInit($(this))
})

/*
 * jquery-auto-height.js
 *
 * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 * Licensed under MIT Lisence:
 * http://www.opensource.org/licenses/mit-license.php
 * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
 *
 */
;(function(g) {
  g.fn.autoHeight = function(a) {
    a = g.extend(
      { column: 0, clear: 0, height: 'minHeight', reset: '' },
      a || {}
    )
    var d = g(this)
    'reset' === a.reset && d.removeAttr('style')
    var b = d
        .map(function() {
          return g(this).height()
        })
        .get(),
      e = []
    if (1 < a.column)
      for (var f = 0, c = b.length; f < Math.ceil(c / a.column); f++) {
        var h = f * a.column
        e.push(Math.max.apply(null, b.slice(h, h + a.column)))
      }
    f =
      'undefined' === typeof window.addEventListener &&
      'undefined' === typeof document.documentElement.style.maxHeight
    if (1 < a.column)
      for (b = 0; b < e.length; b++)
        for (c = 0; c < a.column; c++)
          f
            ? d.eq(b * a.column + c).height(e[b])
            : d.eq(b * a.column + c).css(a.height, e[b]),
            0 === c &&
              0 !== a.clear &&
              d.eq(b * a.column + c).css('clear', 'both')
    else (e = Math.max.apply(null, b)), f ? d.height(e) : d.css(a.height, e)
  }
})(jQuery)

// jQuery setHeight plugin
;(function(a) {
  a.fn.set_height = function(q) {
    var g = { items_per_row: false, delay: 1000, group_by_parent: false }
    if (q) {
      jQuery.extend(g, q)
    }
    if (a('#js_etalon').length) {
      var o = a('#js_etalon').get(0)
    } else {
      var o = a('body')
        .append(
          '<span id="js_etalon_wrapper" style="height:0px;overflow:hidden;display:block;"><span id="js_etalon">m</span></span>'
        )
        .find('#js_etalon')
        .get(0)
    }
    var e = function(t, s) {
      for (var r = 0; r < t.length; r++) {
        if (t[r] == s) {
          return
        }
      }
      t.push(s)
    }
    var b = this
    var f = []
    var m = []
    var l = []
    var k = function() {
      for (var t = 0; t < f.length; t++) {
        var s = 0
        var u = f[t][0].currentStyle
          ? parseInt(f[t][0].currentStyle.paddingTop) +
            parseInt(f[t][0].currentStyle.paddingBottom)
          : parseInt(
              document.defaultView
                .getComputedStyle(f[t][0], null)
                .getPropertyValue('padding-top')
            ) +
            parseInt(
              document.defaultView
                .getComputedStyle(f[t][0], null)
                .getPropertyValue('padding-bottom')
            )
        for (var r = 0; r < f[t].length; r++) {
          f[t][r].style.height = 'auto'
          s = Math.max(f[t][r].offsetHeight - u, s)
        }
        for (var r = 0; r < f[t].length; r++) {
          f[t][r].style.height = s + 'px'
        }
      }
    }
    var n = function() {
      var z = 0
      var x = 0
      var r = null
      var u = null
      f[z] = []
      var A = false
      for (var v = 0; v < b.length; v++) {
        if (g.group_by_parent) {
          r = a(b[v]).parents(g.group_by_parent)[0]
          if (v > 0 && r != u && !A) {
            f[++z] = []
            x = 0
          }
          u = r
        }
        if (g.items_per_row) {
          b[v].className += ' nb' + parseInt((x % g.items_per_row) + 1)
          if (!(x % g.items_per_row) && x > 0) {
            f[++z] = []
            x = 0
            A = true
          }
        }
        f[z][x++] = b[v]
        A = false
      }
      for (var v = 0; v < f.length; v++) {
        if (!f[v][0].offsetHeight) {
          var y = f[v][0]
          while (y.style.display != 'none') {
            y = y.parentNode
          }
          m.push(y)
        }
        for (var t = 0; t < f[v].length; t++) {
          var w = f[v][t].getElementsByTagName('img')
          for (var s = 0; s < w.length; s++) {
            e(l, w[s].src)
          }
        }
      }
    }
    if (b.length) {
      n()
      var d = o.offsetHeight
      var c = setInterval(function() {
        var t = o.offsetHeight
        if (t != d) {
          d = t
          k()
        }
        for (var s = 0; s < m.length; s++) {
          if (m[s].style.display != 'none') {
            k()
            m = []
            for (var r = 0; r < f.length; r++) {
              if (!f[r][0].offsetHeight) {
                var u = f[r][0]
                while (u.style.display != 'none') {
                  u = u.parentNode
                }
                m.push(u)
              }
            }
          }
        }
      }, g.delay)
      k()
      if (l.length) {
        var h = []
        var p = 0
        for (var j = 0; j < l.length; j++) {
          h[j] = document.createElement('img')
          h[j].onload = function() {
            p++
            if (p == l.length) {
              k()
            }
          }
          h[j].src = l[j]
        }
      }
    }
    return this
  }
})(jQuery)

//StarRating plugin
/*
 ### jQuery Star Rating Plugin v3.13 - 2009-03-26 ###
 * Home: http://www.fyneworks.com/jquery/star-rating/
 * Code: http://code.google.com/p/jquery-star-rating-plugin/
 *
	* Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
*/
if (window.jQuery)
  (function($) {
    if ($.browser.msie)
      try {
        document.execCommand('BackgroundImageCache', false, true)
      } catch (e) {}
    $.fn.rating = function(options) {
      if (this.length == 0) return this
      if (typeof arguments[0] == 'string') {
        if (this.length > 1) {
          var args = arguments
          return this.each(function() {
            $.fn.rating.apply($(this), args)
          })
        }
        $.fn.rating[arguments[0]].apply(
          this,
          $.makeArray(arguments).slice(1) || []
        )
        return this
      }
      var options = $.extend({}, $.fn.rating.options, options || {})
      $.fn.rating.calls++
      this.not('.star-rating-applied')
        .addClass('star-rating-applied')
        .each(function() {
          var control,
            input = $(this)
          var eid = (this.name || 'unnamed-rating')
            .replace(/\[|\]/g, '_')
            .replace(/^\_+|\_+$/g, '')
          var context = $(this.form || document.body)
          var raters = context.data('rating')
          if (!raters || raters.call != $.fn.rating.calls)
            raters = { count: 0, call: $.fn.rating.calls }
          var rater = raters[eid]
          if (rater) control = rater.data('rating')
          if (rater && control) control.count++
          else {
            control = $.extend(
              {},
              options || {},
              ($.metadata ? input.metadata() : $.meta ? input.data() : null) ||
                {},
              { count: 0, stars: [], inputs: [] }
            )
            control.serial = raters.count++
            rater = $('<span class="star-rating-control"/>')
            input.before(rater)
            rater.addClass('rating-to-be-drawn')
            if (input.attr('disabled')) control.readOnly = true
          }
          var star = $(
            '<div class="star-rating rater-' +
              control.serial +
              '"><a title="' +
              (this.title || this.value) +
              '">' +
              this.value +
              '</a></div>'
          )
          rater.append(star)
          if (this.id) star.attr('id', this.id)
          if (this.className) star.addClass(this.className)
          if (control.half) control.split = 2
          if (typeof control.split == 'number' && control.split > 0) {
            var stw = ($.fn.width ? star.width() : 0) || control.starWidth
            var spi = control.count % control.split,
              spw = Math.floor(stw / control.split)
            star
              .width(spw)
              .find('a')
              .css({ 'margin-left': '-' + spi * spw + 'px' })
          }
          if (control.readOnly) star.addClass('star-rating-readonly')
          else
            star
              .addClass('star-rating-live')
              .mouseover(function() {
                $(this).rating('fill')
                $(this).rating('focus')
              })
              .mouseout(function() {
                $(this).rating('draw')
                $(this).rating('blur')
              })
              .click(function() {
                $(this).rating('select')
              })
          if (this.checked) control.current = star
          input.hide()
          input.change(function() {
            $(this).rating('select')
          })
          star.data('rating.input', input.data('rating.star', star))
          control.stars[control.stars.length] = star[0]
          control.inputs[control.inputs.length] = input[0]
          control.rater = raters[eid] = rater
          control.context = context
          input.data('rating', control)
          rater.data('rating', control)
          star.data('rating', control)
          context.data('rating', raters)
        })
      $('.rating-to-be-drawn')
        .rating('draw')
        .removeClass('rating-to-be-drawn')
      return this
    }
    $.extend($.fn.rating, {
      calls: 0,
      focus: function() {
        var control = this.data('rating')
        if (!control) return this
        if (!control.focus) return this
        var input =
          $(this).data('rating.input') ||
          $(this.tagName == 'INPUT' ? this : null)
        if (control.focus)
          control.focus.apply(input[0], [
            input.val(),
            $('a', input.data('rating.star'))[0]
          ])
      },
      blur: function() {
        var control = this.data('rating')
        if (!control) return this
        if (!control.blur) return this
        var input =
          $(this).data('rating.input') ||
          $(this.tagName == 'INPUT' ? this : null)
        if (control.blur)
          control.blur.apply(input[0], [
            input.val(),
            $('a', input.data('rating.star'))[0]
          ])
      },
      fill: function() {
        var control = this.data('rating')
        if (!control) return this
        if (control.readOnly) return
        this.rating('drain')
        this.prevAll()
          .andSelf()
          .filter('.rater-' + control.serial)
          .addClass('star-rating-hover')
      },
      drain: function() {
        var control = this.data('rating')
        if (!control) return this
        if (control.readOnly) return
        control.rater
          .children()
          .filter('.rater-' + control.serial)
          .removeClass('star-rating-on')
          .removeClass('star-rating-hover')
      },
      draw: function() {
        var control = this.data('rating')
        if (!control) return this
        this.rating('drain')
        if (control.current) {
          control.current.data('rating.input').attr('checked', 'checked')
          control.current
            .prevAll()
            .andSelf()
            .filter('.rater-' + control.serial)
            .addClass('star-rating-on')
        } else $(control.inputs).removeAttr('checked')
      },
      select: function(value, wantCallBack) {
        var control = this.data('rating')
        if (!control) return this
        if (control.readOnly) return
        control.current = null
        if (typeof value != 'undefined') {
          if (typeof value == 'number')
            return $(control.stars[value]).rating(
              'select',
              undefined,
              wantCallBack
            )
          if (typeof value == 'string')
            $.each(control.stars, function() {
              if (
                $(this)
                  .data('rating.input')
                  .val() == value
              )
                $(this).rating('select', undefined, wantCallBack)
            })
        } else
          control.current =
            this[0].tagName == 'INPUT'
              ? this.data('rating.star')
              : this.is('.rater-' + control.serial)
              ? this
              : null
        this.data('rating', control)
        this.rating('draw')
        var input = $(
          control.current ? control.current.data('rating.input') : null
        )
        if ((wantCallBack || wantCallBack == undefined) && control.callback)
          control.callback.apply(input[0], [
            input.val(),
            $('a', control.current)[0]
          ])
      },
      readOnly: function(toggle, disable) {
        var control = this.data('rating')
        if (!control) return this
        control.readOnly = toggle || toggle == undefined ? true : false
        if (disable) $(control.inputs).attr('disabled', 'disabled')
        else $(control.inputs).removeAttr('disabled')
        this.data('rating', control)
        this.rating('draw')
      },
      disable: function() {
        this.rating('readOnly', true, true)
      },
      enable: function() {
        this.rating('readOnly', false, false)
      }
    })
    $.fn.rating.options = {
      cancel: 'Cancel Rating',
      cancelValue: '',
      split: 0,
      starWidth: 16
    }
    $(function() {
      $('input[type=radio].star').rating()
    })
  })(jQuery)

/*
  Plugin: iframe autoheight jQuery Plugin
  Version: 1.9.3
  Description: when the page loads set the height of an iframe based on the height of its contents
  see README: http://github.com/house9/jquery-iframe-auto-height
*/
!(function(e) {
  e.fn.iframeAutoHeight = function(t) {
    function i(e) {
      s.debug && s.debug === !0 && window.console && console.log(e)
    }
    function n(t, n) {
      i("Diagnostics from '" + n + "'")
      try {
        i(
          '  ' +
            e(t, window.top.document)
              .contents()
              .find('body')[0].scrollHeight +
            " for ...find('body')[0].scrollHeight"
        ),
          i(
            '  ' +
              e(t.contentWindow.document).height() +
              ' for ...contentWindow.document).height()'
          ),
          i(
            '  ' +
              e(t.contentWindow.document.body).height() +
              ' for ...contentWindow.document.body).height()'
          )
      } catch (r) {
        i('  unable to check in this state')
      }
      i(
        'End diagnostics -> results vary by browser and when diagnostics are requested'
      )
    }
    var r
    if (e.browser === r) {
      var o = []
      return (
        o.push(
          'WARNING: you appear to be using a newer version of jquery which does not support the $.browser variable.'
        ),
        o.push(
          'The jQuery iframe auto height plugin relies heavly on the $.browser features.'
        ),
        o.push(
          'Install jquery-browser: https://raw.github.com/house9/jquery-iframe-auto-height/master/release/jquery.browser.js'
        ),
        alert(o.join('\n')),
        e
      )
    }
    var s = e.extend(
      {
        heightOffset: 0,
        minHeight: 0,
        callback: function() {},
        animate: !1,
        debug: !1,
        diagnostics: !1,
        resetToMinHeight: !1,
        triggerFunctions: [],
        heightCalculationOverrides: []
      },
      t
    )
    return (
      i(s),
      this.each(function() {
        function t(e) {
          var t = null
          return (
            jQuery.each(o, function(i, n) {
              return e[n] ? ((t = h[n]), !1) : void 0
            }),
            null === t && (t = h['default']),
            t
          )
        }
        function r(r) {
          s.diagnostics && n(r, 'resizeHeight'),
            s.resetToMinHeight &&
              s.resetToMinHeight === !0 &&
              (r.style.height = s.minHeight + 'px')
          var o = e(r, window.top.document)
              .contents()
              .find('body'),
            h = t(e.browser),
            a = h(r, o, s, e.browser)
          i(a),
            a < s.minHeight &&
              (i('new height is less than minHeight'),
              (a = s.minHeight + s.heightOffset)),
            i('New Height: ' + a),
            s.animate
              ? e(r).animate({ height: a + 'px' }, { duration: 500 })
              : (r.style.height = a + 'px'),
            s.callback.apply(e(r), [{ newFrameHeight: a }])
        }
        var o = ['webkit', 'mozilla', 'msie', 'opera'],
          h = []
        ;(h['default'] = function(e, t, i) {
          return t[0].scrollHeight + i.heightOffset
        }),
          jQuery.each(o, function(e, t) {
            h[t] = h['default']
          }),
          jQuery.each(s.heightCalculationOverrides, function(e, t) {
            h[t.browser] = t.calculation
          })
        var a = 0
        if (
          (i(this),
          s.diagnostics && n(this, 'each iframe'),
          s.triggerFunctions.length > 0)
        ) {
          i(s.triggerFunctions.length + ' trigger Functions')
          for (var u = 0; u < s.triggerFunctions.length; u++)
            s.triggerFunctions[u](r, this)
        }
        e(this).load(function() {
          r(this)
        })
      })
    )
  }
})(jQuery)

/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, J・n Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/**
 * Sets the type of metadata to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * There are three supported types of metadata storage:
 *
 *   attr:  Inside an attribute. The name parameter indicates *which* attribute.
 *
 *   class: Inside the class attribute, wrapped in curly braces: { }
 *
 *   elem:  Inside a child element (e.g. a script tag). The
 *          name parameter indicates *which* element.
 *
 * The metadata for an element is loaded the first time the element is accessed via jQuery.
 *
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 *
 * @name $.metadata.setType
 *
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("class")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from the class attribute
 *
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("attr", "data")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a "data" attribute
 *
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.metadata.setType("elem", "script")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a nested script element
 *
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 * @see metadata()
 */
;(function($) {
  $.extend({
    metadata: {
      defaults: {
        type: 'class',
        name: 'metadata',
        cre: /({.*})/,
        single: 'metadata'
      },
      setType: function(type, name) {
        this.defaults.type = type
        this.defaults.name = name
      },
      get: function(elem, opts) {
        var settings = $.extend({}, this.defaults, opts)
        if (!settings.single.length) settings.single = 'metadata'
        var data = $.data(elem, settings.single)
        if (data) return data
        data = '{}'
        if (settings.type == 'class') {
          var m = settings.cre.exec(elem.className)
          if (m) data = m[1]
        } else if (settings.type == 'elem') {
          if (!elem.getElementsByTagName) return
          var e = elem.getElementsByTagName(settings.name)
          if (e.length) data = $.trim(e[0].innerHTML)
        } else if (elem.getAttribute != undefined) {
          var attr = elem.getAttribute(settings.name)
          if (attr) data = attr
        }
        if (data.indexOf('{') < 0) data = '{' + data + '}'
        data = eval('(' + data + ')')
        $.data(elem, settings.single, data)
        return data
      }
    }
  })
  $.fn.metadata = function(opts) {
    return $.metadata.get(this[0], opts)
  }
})(jQuery)
/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
!(function(a) {
  var b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o = 0,
    p = {},
    q = [],
    r = 0,
    s = {},
    t = [],
    u = null,
    v = new Image(),
    w = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,
    x = /[^\.]\.(swf)\s*$/i,
    y = 1,
    z = 0,
    A = '',
    B = !1,
    C = a.extend(a('<div/>')[0], { prop: 0 }),
    D = a.browser.msie && a.browser.version < 7 && !window.XMLHttpRequest,
    E = function() {
      c.hide(), (v.onerror = v.onload = null), u && u.abort(), b.empty()
    },
    F = function() {
      return !1 === p.onError(q, o, p)
        ? (c.hide(), void (B = !1))
        : ((p.titleShow = !1),
          (p.width = 'auto'),
          (p.height = 'auto'),
          b.html(
            '<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>'
          ),
          void H())
    },
    G = function() {
      var d,
        e,
        f,
        h,
        i,
        j,
        k = q[o]
      if (
        (E(),
        (p = a.extend(
          {},
          a.fn.fancybox.defaults,
          'undefined' == typeof a(k).data('fancybox')
            ? p
            : a(k).data('fancybox')
        )),
        (j = p.onStart(q, o, p)),
        j === !1)
      )
        return void (B = !1)
      if (
        ('object' == typeof j && (p = a.extend(p, j)),
        (f = p.title || (k.nodeName ? a(k).attr('title') : k.title) || ''),
        k.nodeName &&
          !p.orig &&
          (p.orig = a(k).children('img:first').length
            ? a(k).children('img:first')
            : a(k)),
        '' === f && p.orig && p.titleFromAlt && (f = p.orig.attr('alt')),
        (d = p.href || (k.nodeName ? a(k).attr('href') : k.href) || null),
        (/^(?:javascript)/i.test(d) || '#' == d) && (d = null),
        p.type
          ? ((e = p.type), d || (d = p.content))
          : p.content
          ? (e = 'html')
          : d &&
            (e = d.match(w)
              ? 'image'
              : d.match(x)
              ? 'swf'
              : a(k).hasClass('iframe')
              ? 'iframe'
              : 0 === d.indexOf('#')
              ? 'inline'
              : 'ajax'),
        !e)
      )
        return void F()
      switch (
        ('inline' == e &&
          ((k = d.substr(d.indexOf('#'))),
          (e = a(k).length > 0 ? 'inline' : 'ajax')),
        (p.type = e),
        (p.href = d),
        (p.title = f),
        p.autoDimensions &&
          ('html' == p.type || 'inline' == p.type || 'ajax' == p.type
            ? ((p.width = p.width), (p.height = 'auto'))
            : (p.autoDimensions = !1)),
        p.modal &&
          ((p.overlayShow = !0),
          (p.hideOnOverlayClick = !1),
          (p.hideOnContentClick = !1),
          (p.enableEscapeButton = !1),
          (p.showCloseButton = !1)),
        (p.padding = parseInt(p.padding, 10)),
        (p.margin = parseInt(p.margin, 10)),
        b.css('padding', p.padding + p.margin),
        a('.fancybox-inline-tmp')
          .unbind('fancybox-cancel')
          .bind('fancybox-change', function() {
            a(this).replaceWith(g.children())
          }),
        e)
      ) {
        case 'html':
          b.html(p.content), H()
          break
        case 'inline':
          if (
            a(k)
              .parent()
              .is('#fancybox-content') === !0
          )
            return void (B = !1)
          a('<div class="fancybox-inline-tmp" />')
            .hide()
            .insertBefore(a(k))
            .bind('fancybox-cleanup', function() {
              a(this).replaceWith(g.children())
            })
            .bind('fancybox-cancel', function() {
              a(this).replaceWith(b.children())
            }),
            a(k).appendTo(b),
            H()
          break
        case 'image':
          ;(B = !1),
            a.fancybox.showActivity(),
            (v = new Image()),
            (v.onerror = function() {
              F()
            }),
            (v.onload = function() {
              ;(B = !0), (v.onerror = v.onload = null), I()
            }),
            (v.src = d)
          break
        case 'swf':
          ;(p.scrolling = 'no'),
            (h =
              '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' +
              p.width +
              '" height="' +
              p.height +
              '"><param name="movie" value="' +
              d +
              '"></param>'),
            (i = ''),
            a.each(p.swf, function(a, b) {
              ;(h += '<param name="' + a + '" value="' + b + '"></param>'),
                (i += ' ' + a + '="' + b + '"')
            }),
            (h +=
              '<embed src="' +
              d +
              '" type="application/x-shockwave-flash" width="' +
              p.width +
              '" height="' +
              p.height +
              '"' +
              i +
              '></embed></object>'),
            b.html(h),
            H()
          break
        case 'ajax':
          ;(B = !1),
            a.fancybox.showActivity(),
            (p.ajax.win = p.ajax.success),
            (u = a.ajax(
              a.extend({}, p.ajax, {
                url: d,
                data: p.ajax.data || {},
                error: function(a) {
                  a.status > 0 && F()
                },
                success: function(a, e, f) {
                  var g = 'object' == typeof f ? f : u
                  if (200 == g.status || 304 == g.status) {
                    if ('function' == typeof p.ajax.win) {
                      if (((j = p.ajax.win(d, a, e, f)), j === !1))
                        return void c.hide()
                      ;('string' == typeof j || 'object' == typeof j) && (a = j)
                    }
                    b.html(a), H()
                  }
                }
              })
            ))
          break
        case 'iframe':
          J()
      }
    },
    H = function() {
      var c = p.width,
        d = p.height
      ;(c =
        c.toString().indexOf('%') > -1
          ? parseInt(
              ((a(window).width() - 2 * p.margin) * parseFloat(c)) / 100,
              10
            ) + 'px'
          : 'auto' == c
          ? 'auto'
          : c + 'px'),
        (d =
          d.toString().indexOf('%') > -1
            ? parseInt(
                ((a(window).height() - 2 * p.margin) * parseFloat(d)) / 100,
                10
              ) + 'px'
            : 'auto' == d
            ? 'auto'
            : d + 'px'),
        b.wrapInner(
          '<div style="width:' +
            c +
            ';height:' +
            d +
            ';overflow: ' +
            ('auto' == p.scrolling
              ? 'auto'
              : 'yes' == p.scrolling
              ? 'scroll'
              : 'hidden') +
            ';position:relative;"></div>'
        ),
        (p.width = b.width()),
        (p.height = b.height()),
        J()
    },
    I = function() {
      ;(p.width = v.width),
        (p.height = v.height),
        a('<img />')
          .attr({ id: 'fancybox-img', src: v.src, alt: p.title })
          .appendTo(b),
        J()
    },
    J = function() {
      var f, l
      return (
        c.hide(),
        e.is(':visible') && !1 === s.onCleanup(t, r, s)
          ? (a.event.trigger('fancybox-cancel'), void (B = !1))
          : ((B = !0),
            a(g.add(d)).unbind(),
            a(window).unbind('resize.fb scroll.fb'),
            a(document).unbind('keydown.fb'),
            e.is(':visible') &&
              'outside' !== s.titlePosition &&
              e.css('height', e.height()),
            (t = q),
            (r = o),
            (s = p),
            s.overlayShow
              ? (d.css({
                  'background-color': s.overlayColor,
                  opacity: s.overlayOpacity,
                  cursor: s.hideOnOverlayClick ? 'pointer' : 'auto',
                  height: a(document).height()
                }),
                d.is(':visible') ||
                  (D &&
                    a('select:not(#fancybox-tmp select)')
                      .filter(function() {
                        return 'hidden' !== this.style.visibility
                      })
                      .css({ visibility: 'hidden' })
                      .one('fancybox-cleanup', function() {
                        this.style.visibility = 'inherit'
                      }),
                  d.show()))
              : d.hide(),
            (n = R()),
            L(),
            e.is(':visible')
              ? (a(h.add(j).add(k)).hide(),
                (f = e.position()),
                (m = {
                  top: f.top,
                  left: f.left,
                  width: e.width(),
                  height: e.height()
                }),
                (l = m.width == n.width && m.height == n.height),
                void g.fadeTo(s.changeFade, 0.3, function() {
                  var c = function() {
                    g.html(b.contents()).fadeTo(s.changeFade, 1, N)
                  }
                  a.event.trigger('fancybox-change'),
                    g
                      .empty()
                      .removeAttr('filter')
                      .css({
                        'border-width': s.padding,
                        width: n.width - 2 * s.padding,
                        height: p.autoDimensions
                          ? 'auto'
                          : n.height - z - 2 * s.padding
                      }),
                    l
                      ? c()
                      : ((C.prop = 0),
                        a(C).animate(
                          { prop: 1 },
                          {
                            duration: s.changeSpeed,
                            easing: s.easingChange,
                            step: P,
                            complete: c
                          }
                        ))
                }))
              : (e.removeAttr('style'),
                g.css('border-width', s.padding),
                'elastic' == s.transitionIn
                  ? ((m = T()),
                    g.html(b.contents()),
                    e.show(),
                    s.opacity && (n.opacity = 0),
                    (C.prop = 0),
                    void a(C).animate(
                      { prop: 1 },
                      {
                        duration: s.speedIn,
                        easing: s.easingIn,
                        step: P,
                        complete: N
                      }
                    ))
                  : ('inside' == s.titlePosition && z > 0 && i.show(),
                    g
                      .css({
                        width: n.width - 2 * s.padding,
                        height: p.autoDimensions
                          ? 'auto'
                          : n.height - z - 2 * s.padding
                      })
                      .html(b.contents()),
                    void e
                      .css(n)
                      .fadeIn('none' == s.transitionIn ? 0 : s.speedIn, N))))
      )
    },
    K = function(a) {
      return a && a.length
        ? 'float' == s.titlePosition
          ? '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' +
            a +
            '</td><td id="fancybox-title-float-right"></td></tr></table>'
          : '<div id="fancybox-title-' + s.titlePosition + '">' + a + '</div>'
        : !1
    },
    L = function() {
      if (
        ((A = s.title || ''),
        (z = 0),
        i
          .empty()
          .removeAttr('style')
          .removeClass(),
        s.titleShow === !1)
      )
        return void i.hide()
      if (
        ((A = a.isFunction(s.titleFormat) ? s.titleFormat(A, t, r, s) : K(A)),
        !A || '' === A)
      )
        return void i.hide()
      switch (
        (i
          .addClass('fancybox-title-' + s.titlePosition)
          .html(A)
          .appendTo('body')
          .show(),
        s.titlePosition)
      ) {
        case 'inside':
          i.css({
            width: n.width - 2 * s.padding,
            marginLeft: s.padding,
            marginRight: s.padding
          }),
            (z = i.outerHeight(!0)),
            i.appendTo(f),
            (n.height += z)
          break
        case 'over':
          i.css({
            marginLeft: s.padding,
            width: n.width - 2 * s.padding,
            bottom: s.padding
          }).appendTo(f)
          break
        case 'float':
          i.css(
            'left',
            -1 * parseInt((i.width() - n.width - 40) / 2, 10)
          ).appendTo(e)
          break
        default:
          i.css({
            width: n.width - 2 * s.padding,
            paddingLeft: s.padding,
            paddingRight: s.padding
          }).appendTo(e)
      }
      i.hide()
    },
    M = function() {
      return (
        (s.enableEscapeButton || s.enableKeyboardNav) &&
          a(document).bind('keydown.fb', function(b) {
            27 == b.keyCode && s.enableEscapeButton
              ? (b.preventDefault(), a.fancybox.close())
              : (37 != b.keyCode && 39 != b.keyCode) ||
                !s.enableKeyboardNav ||
                'INPUT' === b.target.tagName ||
                'TEXTAREA' === b.target.tagName ||
                'SELECT' === b.target.tagName ||
                (b.preventDefault(),
                a.fancybox[37 == b.keyCode ? 'prev' : 'next']())
          }),
        s.showNavArrows
          ? (((s.cyclic && t.length > 1) || 0 !== r) && j.show(),
            void (
              ((s.cyclic && t.length > 1) || r != t.length - 1) &&
              k.show()
            ))
          : (j.hide(), void k.hide())
      )
    },
    N = function() {
      a.support.opacity ||
        (g.get(0).style.removeAttribute('filter'),
        e.get(0).style.removeAttribute('filter')),
        p.autoDimensions && g.css('height', 'auto'),
        e.css('height', 'auto'),
        A && A.length && i.show(),
        s.showCloseButton && h.show(),
        M(),
        s.hideOnContentClick && g.bind('click', a.fancybox.close),
        s.hideOnOverlayClick && d.bind('click', a.fancybox.close),
        a(window).bind('resize.fb', a.fancybox.resize),
        s.centerOnScroll && a(window).bind('scroll.fb', a.fancybox.center),
        'iframe' == s.type &&
          a(
            '<iframe id="fancybox-frame" name="fancybox-frame' +
              new Date().getTime() +
              '" frameborder="0" hspace="0" ' +
              (a.browser.msie ? 'allowtransparency="true""' : '') +
              ' scrolling="' +
              p.scrolling +
              '" src="' +
              s.href +
              '"></iframe>'
          ).appendTo(g),
        e.show(),
        (B = !1),
        a.fancybox.center(),
        s.onComplete(t, r, s),
        O()
    },
    O = function() {
      var a, b
      t.length - 1 > r &&
        ((a = t[r + 1].href),
        'undefined' != typeof a &&
          a.match(w) &&
          ((b = new Image()), (b.src = a))),
        r > 0 &&
          ((a = t[r - 1].href),
          'undefined' != typeof a &&
            a.match(w) &&
            ((b = new Image()), (b.src = a)))
    },
    P = function(a) {
      var b = {
        width: parseInt(m.width + (n.width - m.width) * a, 10),
        height: parseInt(m.height + (n.height - m.height) * a, 10),
        top: parseInt(m.top + (n.top - m.top) * a, 10),
        left: parseInt(m.left + (n.left - m.left) * a, 10)
      }
      'undefined' != typeof n.opacity && (b.opacity = 0.5 > a ? 0.5 : a),
        e.css(b),
        g.css({
          width: b.width - 2 * s.padding,
          height: b.height - z * a - 2 * s.padding
        })
    },
    Q = function() {
      return [
        a(window).width() - 2 * s.margin,
        a(window).height() - 2 * s.margin,
        a(document).scrollLeft() + s.margin,
        a(document).scrollTop() + s.margin
      ]
    },
    R = function() {
      var a,
        b = Q(),
        c = {},
        d = s.autoScale,
        e = 2 * s.padding
      return (
        (c.width =
          s.width.toString().indexOf('%') > -1
            ? parseInt((b[0] * parseFloat(s.width)) / 100, 10)
            : s.width + e),
        (c.height =
          s.height.toString().indexOf('%') > -1
            ? parseInt((b[1] * parseFloat(s.height)) / 100, 10)
            : s.height + e),
        d &&
          (c.width > b[0] || c.height > b[1]) &&
          ('image' == p.type || 'swf' == p.type
            ? ((a = s.width / s.height),
              c.width > b[0] &&
                ((c.width = b[0]),
                (c.height = parseInt((c.width - e) / a + e, 10))),
              c.height > b[1] &&
                ((c.height = b[1]),
                (c.width = parseInt((c.height - e) * a + e, 10))))
            : ((c.width = Math.min(c.width, b[0])),
              (c.height = Math.min(c.height, b[1])))),
        (c.top = parseInt(
          Math.max(b[3] - 20, b[3] + 0.5 * (b[1] - c.height - 40)),
          10
        )),
        (c.left = parseInt(
          Math.max(b[2] - 20, b[2] + 0.5 * (b[0] - c.width - 40)),
          10
        )),
        c
      )
    },
    S = function(a) {
      var b = a.offset()
      return (
        (b.top += parseInt(a.css('paddingTop'), 10) || 0),
        (b.left += parseInt(a.css('paddingLeft'), 10) || 0),
        (b.top += parseInt(a.css('border-top-width'), 10) || 0),
        (b.left += parseInt(a.css('border-left-width'), 10) || 0),
        (b.width = a.width()),
        (b.height = a.height()),
        b
      )
    },
    T = function() {
      var b,
        c,
        d = p.orig ? a(p.orig) : !1,
        e = {}
      return (
        d && d.length
          ? ((b = S(d)),
            (e = {
              width: b.width + 2 * s.padding,
              height: b.height + 2 * s.padding,
              top: b.top - s.padding - 20,
              left: b.left - s.padding - 20
            }))
          : ((c = Q()),
            (e = {
              width: 2 * s.padding,
              height: 2 * s.padding,
              top: parseInt(c[3] + 0.5 * c[1], 10),
              left: parseInt(c[2] + 0.5 * c[0], 10)
            })),
        e
      )
    },
    U = function() {
      return c.is(':visible')
        ? (a('div', c).css('top', -60 * y + 'px'), void (y = (y + 1) % 12))
        : void clearInterval(l)
    }
  ;(a.fn.fancybox = function(b) {
    return a(this).length
      ? (a(this)
          .data(
            'fancybox',
            a.extend({}, b, a.metadata ? a(this).metadata() : {})
          )
          .unbind('click.fb')
          .bind('click.fb', function(b) {
            if ((b.preventDefault(), !B)) {
              ;(B = !0), a(this).blur(), (q = []), (o = 0)
              var c = a(this).attr('rel') || ''
              c && '' != c && 'nofollow' !== c
                ? ((q = a('a[rel=' + c + '], area[rel=' + c + ']')),
                  (o = q.index(this)))
                : q.push(this),
                G()
            }
          }),
        this)
      : this
  }),
    (a.fancybox = function(b) {
      var c
      if (!B) {
        if (
          ((B = !0),
          (c = 'undefined' != typeof arguments[1] ? arguments[1] : {}),
          (q = []),
          (o = parseInt(c.index, 10) || 0),
          a.isArray(b))
        ) {
          for (var d = 0, e = b.length; e > d; d++)
            'object' == typeof b[d]
              ? a(b[d]).data('fancybox', a.extend({}, c, b[d]))
              : (b[d] = a({}).data('fancybox', a.extend({ content: b[d] }, c)))
          q = jQuery.merge(q, b)
        } else
          'object' == typeof b
            ? a(b).data('fancybox', a.extend({}, c, b))
            : (b = a({}).data('fancybox', a.extend({ content: b }, c))),
            q.push(b)
        ;(o > q.length || 0 > o) && (o = 0), G()
      }
    }),
    (a.fancybox.showActivity = function() {
      clearInterval(l), c.show(), (l = setInterval(U, 66))
    }),
    (a.fancybox.hideActivity = function() {
      c.hide()
    }),
    (a.fancybox.next = function() {
      return a.fancybox.pos(r + 1)
    }),
    (a.fancybox.prev = function() {
      return a.fancybox.pos(r - 1)
    }),
    (a.fancybox.pos = function(a) {
      B ||
        ((a = parseInt(a)),
        (q = t),
        a > -1 && a < t.length
          ? ((o = a), G())
          : s.cyclic &&
            t.length > 1 &&
            ((o = a >= t.length ? 0 : t.length - 1), G()))
    }),
    (a.fancybox.cancel = function() {
      B ||
        ((B = !0),
        a.event.trigger('fancybox-cancel'),
        E(),
        p.onCancel(q, o, p),
        (B = !1))
    }),
    (a.fancybox.close = function() {
      function b() {
        d.fadeOut('fast'),
          i.empty().hide(),
          e.hide(),
          a.event.trigger('fancybox-cleanup'),
          g.empty(),
          s.onClosed(t, r, s),
          (t = p = []),
          (r = o = 0),
          (s = p = {}),
          (B = !1)
      }
      if (!B && !e.is(':hidden')) {
        if (((B = !0), s && !1 === s.onCleanup(t, r, s))) return void (B = !1)
        if (
          (E(),
          a(h.add(j).add(k)).hide(),
          a(g.add(d)).unbind(),
          a(window).unbind('resize.fb scroll.fb'),
          a(document).unbind('keydown.fb'),
          g
            .find('iframe')
            .attr(
              'src',
              D && /^https/i.test(window.location.href || '')
                ? 'javascript:void(false)'
                : 'about:blank'
            ),
          'inside' !== s.titlePosition && i.empty(),
          e.stop(),
          'elastic' == s.transitionOut)
        ) {
          m = T()
          var c = e.position()
          ;(n = {
            top: c.top,
            left: c.left,
            width: e.width(),
            height: e.height()
          }),
            s.opacity && (n.opacity = 1),
            i.empty().hide(),
            (C.prop = 1),
            a(C).animate(
              { prop: 0 },
              {
                duration: s.speedOut,
                easing: s.easingOut,
                step: P,
                complete: b
              }
            )
        } else e.fadeOut('none' == s.transitionOut ? 0 : s.speedOut, b)
      }
    }),
    (a.fancybox.resize = function() {
      d.is(':visible') && d.css('height', a(document).height()),
        a.fancybox.center(!0)
    }),
    (a.fancybox.center = function() {
      var a, b
      B ||
        ((b = arguments[0] === !0 ? 1 : 0),
        (a = Q()),
        (b || !(e.width() > a[0] || e.height() > a[1])) &&
          e.stop().animate(
            {
              top: parseInt(
                Math.max(
                  a[3] - 20,
                  a[3] + 0.5 * (a[1] - g.height() - 40) - s.padding
                )
              ),
              left: parseInt(
                Math.max(
                  a[2] - 20,
                  a[2] + 0.5 * (a[0] - g.width() - 40) - s.padding
                )
              )
            },
            'number' == typeof arguments[0] ? arguments[0] : 200
          ))
    }),
    (a.fancybox.init = function() {
      a('#fancybox-wrap').length ||
        (a('body').append(
          (b = a('<div id="fancybox-tmp"></div>')),
          (c = a('<div id="fancybox-loading"><div></div></div>')),
          (d = a('<div id="fancybox-overlay"></div>')),
          (e = a('<div id="fancybox-wrap"></div>'))
        ),
        (f = a('<div id="fancybox-outer"></div>')
          .append(
            '<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>'
          )
          .appendTo(e)),
        f.append(
          (g = a('<div id="fancybox-content"></div>')),
          (h = a('<a id="fancybox-close"></a>')),
          (i = a('<div id="fancybox-title"></div>')),
          (j = a(
            '<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'
          )),
          (k = a(
            '<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'
          ))
        ),
        h.click(a.fancybox.close),
        c.click(a.fancybox.cancel),
        j.click(function(b) {
          b.preventDefault(), a.fancybox.prev()
        }),
        k.click(function(b) {
          b.preventDefault(), a.fancybox.next()
        }),
        a.fn.mousewheel &&
          e.bind('mousewheel.fb', function(b, c) {
            B
              ? b.preventDefault()
              : (0 == a(b.target).get(0).clientHeight ||
                  a(b.target).get(0).scrollHeight ===
                    a(b.target).get(0).clientHeight) &&
                (b.preventDefault(), a.fancybox[c > 0 ? 'prev' : 'next']())
          }),
        a.support.opacity || e.addClass('fancybox-ie'),
        D &&
          (c.addClass('fancybox-ie6'),
          e.addClass('fancybox-ie6'),
          a(
            '<iframe id="fancybox-hide-sel-frame" src="' +
              (/^https/i.test(window.location.href || '')
                ? 'javascript:void(false)'
                : 'about:blank') +
              '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>'
          ).prependTo(f)))
    }),
    (a.fn.fancybox.defaults = {
      padding: 10,
      margin: 40,
      opacity: !1,
      modal: !1,
      cyclic: !1,
      scrolling: 'auto',
      width: 560,
      height: 340,
      autoScale: !0,
      autoDimensions: !0,
      centerOnScroll: !1,
      ajax: {},
      swf: { wmode: 'transparent' },
      hideOnOverlayClick: !0,
      hideOnContentClick: !1,
      overlayShow: !0,
      overlayOpacity: 0.7,
      overlayColor: '#777',
      titleShow: !0,
      titlePosition: 'float',
      titleFormat: null,
      titleFromAlt: !1,
      transitionIn: 'fade',
      transitionOut: 'fade',
      speedIn: 300,
      speedOut: 300,
      changeSpeed: 300,
      changeFade: 'fast',
      easingIn: 'swing',
      easingOut: 'swing',
      showCloseButton: !0,
      showNavArrows: !0,
      enableEscapeButton: !0,
      enableKeyboardNav: !0,
      onStart: function() {},
      onCancel: function() {},
      onComplete: function() {},
      onCleanup: function() {},
      onClosed: function() {},
      onError: function() {}
    }),
    a(document).ready(function() {
      a.fancybox.init()
    })
})(jQuery)

/*!
 * @fileOverview 欲しい本リンク共通スクリプト.
 * @name MemWantBookLink.js
 */
jQuery(document).ready(function() {
  wantBookLink.initRegist()
}),
  jQuery.noConflict()
var wantBookLink = {
    acquired: !1,
    initRegist: function() {
      var t = wantBookLink.getRequestParam(window.location.search),
        e = t.wantBookMode,
        i = t.wantPrdId
      if ('regist' == e && i) {
        var n = registStateManage.getWantBookState(i),
          s = new WantBookRegist(i, n, !0)
        s.execute()
      }
    },
    getRequestParam: function(t) {
      var e = t.split('?'),
        i = {}
      if (e.length > 1)
        for (var n = e[1], s = n.split('&'), o = s.length, a = o; a--; ) {
          var r = s[a].split('='),
            c = decodeURIComponent(r[0]),
            u = decodeURIComponent(r[1])
          i[c] = u
        }
      return i
    },
    init: function(t) {
      0 != t.find('.stBookItem').length &&
        (wantBookLink.acquired ||
          ((wantBookLink.acquired = !0), wantBookListGet.execute()))
    },
    hoverAction: function(t) {
      var e = $(t).find('.stFav'),
        i = $(t)
          .find('a')
          .attr('href')
      if (
        ((i = i.replace(/(\.html).*$/, '')),
        (productId = i.substr(i.length - 8)),
        e)
      ) {
        var n = registStateManage.getWantBookState(productId),
          s = $(t).find('.stFav span')
        n.displayLink() &&
          (n.isRegistered()
            ? (e.addClass('stCurrent'),
              s.unbind('click'),
              s.on(
                'click',
                (function(t, e, i) {
                  return function() {
                    wantBookLink.deleteAction(t, e, i)
                  }
                })(productId, n, s)
              ))
            : (e.removeClass('stCurrent'),
              s.unbind('click'),
              s.on(
                'click',
                (function(t, e, i) {
                  return function() {
                    return wantBookLink.registAction(t, e, i)
                  }
                })(productId, n, e)
              )))
      }
    },
    registAction: function(t, e, i) {
      var n = new WantBookRegist(t, e, !1)
      n.execute()
      var s = wantBookLink.getCampaign(i)
      e.setCampaign(s)
    },
    getCampaign: function(t) {
      var e = ''
      return (
        jQuery('a', t.parent()).each(function() {
          var t = jQuery(this).attr('href'),
            i = wantBookLink.getRequestParam(t)
          i.recid ? (e = i.recid) : i.cid && (e = i.cid)
        }),
        e
      )
    },
    deleteAction: function(t, e, i) {
      var n = new WantBookDelete(t, e)
      n.execute()
    }
  },
  wantBookListGet = {
    execute: function() {
      var t = 'wantBookMode=list'
      this.json(t)
    },
    json: function(t) {
      ;(t = this.getParameters(t, { isPart: !0, noResponse: !1 })),
        jQuery.ajax({
          cache: !1,
          data: t,
          dataType: 'json',
          type: 'post',
          url: HC.Ajax.url,
          success: function(t) {
            if (t)
              for (var e = t.productIdList.length, i = e; i--; ) {
                var n = registStateManage.getWantBookState(t.productIdList[i])
                n.setRegist()
              }
          },
          error: function(t, e, i) {}
        })
    },
    getParameters: function(t, e) {
      return (
        (t = t.toQueryParams()),
        (t = Object.extend(t, e)),
        Object.extend(t, { className: 'MemWantBookAjax' })
      )
    }
  },
  WantBookRegist = function(t, e, i) {
    ;(this.productId = t),
      (this.wantBookRegistState = e),
      (this.displaySuccessMessage = i)
  }
WantBookRegist.prototype = {
  execute: function() {
    if (this.wantBookRegistState.isProcessing())
      return void this.wantBookRegistState.setWaitRegist()
    this.wantBookRegistState.setProcessRegist()
    for (
      var t = [], e = window.location.search.substring(1).split('&'), i = 0;
      i < e.length;
      i++
    )
      e[i].match(
        /^(regWant=|prdid=|delHst=|delHstAll=|wantPrdId=|havePrdId=)/
      ) || t.push(e[i])
    var n = 'https:' == document.location.protocol ? 'https' : 'http',
      s =
        window.location.pathname +
        '?wantBookMode=regist&wantPrdId=' +
        this.productId
    t.length > 0 && (s = s + '&' + t.join('&'))
    var o =
      '?wantBookMode=regist&wantPrdId=' +
      this.productId +
      '&returnuri=' +
      encodeURIComponent(s) +
      '&host=' +
      n
    this.json(o, this)
  },
  json: function(t, e) {
    ;(t = this.getParameters(t, { isPart: !0, noResponse: !1 })),
      jQuery.ajax({
        cache: !1,
        data: t,
        dataType: 'json',
        type: 'post',
        url: HC.Ajax.url,
        context: e,
        success: function(t) {
          if (!t) return void this.error(this)
          if (t.redirecturi) return void (window.location.href = t.redirecturi)
          if ('1' == t.result.status) {
            if (
              (this.wantBookRegistState.setRegist(),
              this.wantBookRegistState.setProcessNothing(),
              this.wantBookRegistState.waitingDelete())
            ) {
              var e = new WantBookDelete(
                this.productId,
                this.wantBookRegistState
              )
              e.execute()
            }
            this.wantBookRegistState.setWaitNothing(),
              this.sendCatalystData(this.wantBookRegistState),
              this.displaySuccessMessage && this.successMessage()
          } else
            this.setAllRegistAction(this),
              this.wantBookRegistState.setWaitNothing(),
              this.wantBookRegistState.setProcessNothing(),
              this.message(t.result.msg)
        },
        error: function(t, e, i) {
          this.error(this)
        }
      })
  },
  getParameters: function(t, e) {
    return (
      (t = t.toQueryParams()),
      (t = Object.extend(t, e)),
      Object.extend(t, { className: 'MemWantBookAjax' })
    )
  },
  error: function(t) {
    this.setAllRegistAction(t),
      this.wantBookRegistState.setProcessNothing(),
      this.wantBookRegistState.setWaitNothing(),
      this.message('システムエラーが発生しました。')
  },
  successMessage: function() {},
  message: function(t) {},
  sendCatalystData: function(t) {
    try {
      ;(s.events = 'event18'),
        (s.campaign = t.getCampaign()),
        (s.products = decodeURIComponent(t.productId)),
        s_sc(s)
    } catch (e) {
    } finally {
      return !0
    }
  },
  setAllRegistAction: function(t) {
    jQuery("a[href*='" + t.productId + ".html']").each(function() {
      var e = jQuery(this).find('.stFav')
      e &&
        (jQuery(e).unbind('click'),
        jQuery(e).on(
          'click',
          (function(t, e, i) {
            return function() {
              wantBookLink.registAction(t, e, i)
            }
          })(t.productId, t.wantBookRegistState, e)
        ))
    })
  }
}
var WantBookDelete = function(t, e) {
  ;(this.productId = t), (this.wantBookRegistState = e)
}
WantBookDelete.prototype = {
  execute: function() {
    if (this.wantBookRegistState.isProcessing())
      return void this.wantBookRegistState.setWaitDelete()
    this.wantBookRegistState.setProcessDelete()
    var t = '?wantBookMode=delete&wantPrdId=' + this.productId
    this.json(t, this)
  },
  json: function(t, e) {
    ;(t = this.getParameters(t, { isPart: !0, noResponse: !1 })),
      jQuery.ajax({
        cache: !1,
        data: t,
        dataType: 'json',
        type: 'post',
        url: HC.Ajax.url,
        context: e,
        success: function(t) {
          if (!t) return void this.error(this)
          if (
            (this.wantBookRegistState.setDelete(),
            this.wantBookRegistState.setProcessNothing(),
            this.wantBookRegistState.waitingRegist())
          ) {
            var e = new WantBookRegist(
              this.productId,
              this.wantBookRegistState,
              !1
            )
            e.execute()
          }
          this.wantBookRegistState.setWaitNothing()
        },
        error: function(t, e, i) {
          this.error(this)
        }
      })
  },
  getParameters: function(t, e) {
    return (
      (t = t.toQueryParams()),
      (t = Object.extend(t, e)),
      Object.extend(t, { className: 'MemWantBookAjax' })
    )
  },
  error: function(t) {
    this.setAllDeleteAction(t),
      this.wantBookRegistState.setProcessNothing(),
      this.wantBookRegistState.setWaitNothing(),
      this.message('システムエラーが発生しました。')
  },
  message: function(t) {},
  setAllDeleteAction: function(t) {
    jQuery("a[href*='" + t.productId + ".html']").each(function() {
      var e = jQuery(this).find('.stFav')
      e &&
        (jQuery(e).html('apathy'),
        jQuery(e).unbind('click'),
        jQuery(e).on(
          'click',
          (function(t, e, i) {
            return function() {
              wantBookLink.deleteAction(t, e, i)
            }
          })(t.productId, t.wantBookRegistState, e)
        ))
    })
  }
}
var registStateManage = {
    stateList: {},
    getWantBookState: function(t) {
      if (null != registStateManage.stateList[t])
        return registStateManage.stateList[t]
      var e = new WantBookRegistState(
        t,
        !1,
        WantBookRegistState.NOTHING,
        WantBookRegistState.NOTHING
      )
      return (registStateManage.stateList[t] = e), e
    }
  },
  WantBookRegistState = function(t, e, i, n) {
    ;(this.productId = t),
      (this.registered = e),
      (this.runningProcess = i),
      (this.waitingProcess = n),
      (this.campaign = '')
  }
;(WantBookRegistState.NOTHING = 'nothing'),
  (WantBookRegistState.REGIST = 'regist'),
  (WantBookRegistState.DELETE = 'delete'),
  (WantBookRegistState.prototype = {
    setRegist: function() {
      this.registered = !0
    },
    setDelete: function() {
      this.registered = !1
    },
    setProcessNothing: function() {
      this.runningProcess = WantBookRegistState.NOTHING
    },
    setProcessRegist: function() {
      this.runningProcess = WantBookRegistState.REGIST
    },
    setProcessDelete: function() {
      this.runningProcess = WantBookRegistState.DELETE
    },
    setWaitNothing: function() {
      this.waitingProcess = WantBookRegistState.NOTHING
    },
    setWaitRegist: function() {
      this.waitingProcess = WantBookRegistState.REGIST
    },
    setWaitDelete: function() {
      this.waitingProcess = WantBookRegistState.DELETE
    },
    setCampaign: function(t) {
      this.campaign = t
    },
    getCampaign: function() {
      return this.campaign
    },
    isCdDvd: function() {
      var t = new RegExp('^8[0-9]+')
      return !!t.test(this.productId)
    },
    displayLink: function() {
      return !this.isCdDvd()
    },
    isProcessing: function() {
      return this.runningProcess != WantBookRegistState.NOTHING
    },
    waitingRegist: function() {
      return this.waitingProcess == WantBookRegistState.REGIST
    },
    waitingDelete: function() {
      return this.waitingProcess == WantBookRegistState.DELETE
    },
    isRegistered: function() {
      return this.waitingProcess == WantBookRegistState.REGIST
        ? !0
        : this.waitingProcess == WantBookRegistState.DELETE
        ? !1
        : this.runningProcess == WantBookRegistState.REGIST
        ? !0
        : this.runningProcess == WantBookRegistState.DELETE
        ? !1
        : this.registered
    }
  })

/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
!(function(a) {
  function b(a) {
    var b = a.length,
      d = c.type(a)
    return 'function' === d || c.isWindow(a)
      ? !1
      : 1 === a.nodeType && b
      ? !0
      : 'array' === d ||
        0 === b ||
        ('number' == typeof b && b > 0 && b - 1 in a)
  }
  if (!a.jQuery) {
    var c = function(a, b) {
      return new c.fn.init(a, b)
    }
    ;(c.isWindow = function(a) {
      return null != a && a == a.window
    }),
      (c.type = function(a) {
        return null == a
          ? a + ''
          : 'object' == typeof a || 'function' == typeof a
          ? e[g.call(a)] || 'object'
          : typeof a
      }),
      (c.isArray =
        Array.isArray ||
        function(a) {
          return 'array' === c.type(a)
        }),
      (c.isPlainObject = function(a) {
        var b
        if (!a || 'object' !== c.type(a) || a.nodeType || c.isWindow(a))
          return !1
        try {
          if (
            a.constructor &&
            !f.call(a, 'constructor') &&
            !f.call(a.constructor.prototype, 'isPrototypeOf')
          )
            return !1
        } catch (d) {
          return !1
        }
        for (b in a);
        return void 0 === b || f.call(a, b)
      }),
      (c.each = function(a, c, d) {
        var e,
          f = 0,
          g = a.length,
          h = b(a)
        if (d) {
          if (h) for (; g > f && ((e = c.apply(a[f], d)), e !== !1); f++);
          else for (f in a) if (((e = c.apply(a[f], d)), e === !1)) break
        } else if (h)
          for (; g > f && ((e = c.call(a[f], f, a[f])), e !== !1); f++);
        else for (f in a) if (((e = c.call(a[f], f, a[f])), e === !1)) break
        return a
      }),
      (c.data = function(a, b, e) {
        if (void 0 === e) {
          var f = a[c.expando],
            g = f && d[f]
          if (void 0 === b) return g
          if (g && b in g) return g[b]
        } else if (void 0 !== b) {
          var f = a[c.expando] || (a[c.expando] = ++c.uuid)
          return (d[f] = d[f] || {}), (d[f][b] = e), e
        }
      }),
      (c.removeData = function(a, b) {
        var e = a[c.expando],
          f = e && d[e]
        f &&
          c.each(b, function(a, b) {
            delete f[b]
          })
      }),
      (c.extend = function() {
        var a,
          b,
          d,
          e,
          f,
          g,
          h = arguments[0] || {},
          i = 1,
          j = arguments.length,
          k = !1
        for (
          'boolean' == typeof h && ((k = h), (h = arguments[i] || {}), i++),
            'object' != typeof h && 'function' !== c.type(h) && (h = {}),
            i === j && ((h = this), i--);
          j > i;
          i++
        )
          if (null != (f = arguments[i]))
            for (e in f)
              (a = h[e]),
                (d = f[e]),
                h !== d &&
                  (k && d && (c.isPlainObject(d) || (b = c.isArray(d)))
                    ? (b
                        ? ((b = !1), (g = a && c.isArray(a) ? a : []))
                        : (g = a && c.isPlainObject(a) ? a : {}),
                      (h[e] = c.extend(k, g, d)))
                    : void 0 !== d && (h[e] = d))
        return h
      }),
      (c.queue = function(a, d, e) {
        function f(a, c) {
          var d = c || []
          return (
            null != a &&
              (b(Object(a))
                ? !(function(a, b) {
                    for (var c = +b.length, d = 0, e = a.length; c > d; )
                      a[e++] = b[d++]
                    if (c !== c) for (; void 0 !== b[d]; ) a[e++] = b[d++]
                    return (a.length = e), a
                  })(d, 'string' == typeof a ? [a] : a)
                : [].push.call(d, a)),
            d
          )
        }
        if (a) {
          d = (d || 'fx') + 'queue'
          var g = c.data(a, d)
          return e
            ? (!g || c.isArray(e) ? (g = c.data(a, d, f(e))) : g.push(e), g)
            : g || []
        }
      }),
      (c.dequeue = function(a, b) {
        c.each(a.nodeType ? [a] : a, function(a, d) {
          b = b || 'fx'
          var e = c.queue(d, b),
            f = e.shift()
          'inprogress' === f && (f = e.shift()),
            f &&
              ('fx' === b && e.unshift('inprogress'),
              f.call(d, function() {
                c.dequeue(d, b)
              }))
        })
      }),
      (c.fn = c.prototype = {
        init: function(a) {
          if (a.nodeType) return (this[0] = a), this
          throw new Error('Not a DOM node.')
        },
        offset: function() {
          var b = this[0].getBoundingClientRect
            ? this[0].getBoundingClientRect()
            : { top: 0, left: 0 }
          return {
            top:
              b.top +
              (a.pageYOffset || document.scrollTop || 0) -
              (document.clientTop || 0),
            left:
              b.left +
              (a.pageXOffset || document.scrollLeft || 0) -
              (document.clientLeft || 0)
          }
        },
        position: function() {
          function a() {
            for (
              var a = this.offsetParent || document;
              a &&
              'html' === !a.nodeType.toLowerCase &&
              'static' === a.style.position;

            )
              a = a.offsetParent
            return a || document
          }
          var b = this[0],
            a = a.apply(b),
            d = this.offset(),
            e = /^(?:body|html)$/i.test(a.nodeName)
              ? { top: 0, left: 0 }
              : c(a).offset()
          return (
            (d.top -= parseFloat(b.style.marginTop) || 0),
            (d.left -= parseFloat(b.style.marginLeft) || 0),
            a.style &&
              ((e.top += parseFloat(a.style.borderTopWidth) || 0),
              (e.left += parseFloat(a.style.borderLeftWidth) || 0)),
            { top: d.top - e.top, left: d.left - e.left }
          )
        }
      })
    var d = {}
    ;(c.expando = 'velocity' + new Date().getTime()), (c.uuid = 0)
    for (
      var e = {},
        f = e.hasOwnProperty,
        g = e.toString,
        h = 'Boolean Number String Function Array Date RegExp Object Error'.split(
          ' '
        ),
        i = 0;
      i < h.length;
      i++
    )
      e['[object ' + h[i] + ']'] = h[i].toLowerCase()
    ;(c.fn.init.prototype = c.fn), (a.Velocity = { Utilities: c })
  }
})(window),
  (function(a) {
    'object' == typeof module && 'object' == typeof module.exports
      ? (module.exports = a())
      : 'function' == typeof define && define.amd
      ? define(a)
      : a()
  })(function() {
    return (function(a, b, c, d) {
      function e(a) {
        for (var b = -1, c = a ? a.length : 0, d = []; ++b < c; ) {
          var e = a[b]
          e && d.push(e)
        }
        return d
      }
      function f(a) {
        return (
          p.isWrapped(a) ? (a = [].slice.call(a)) : p.isNode(a) && (a = [a]), a
        )
      }
      function g(a) {
        var b = m.data(a, 'velocity')
        return null === b ? d : b
      }
      function h(a) {
        return function(b) {
          return Math.round(b * a) * (1 / a)
        }
      }
      function i(a, c, d, e) {
        function f(a, b) {
          return 1 - 3 * b + 3 * a
        }
        function g(a, b) {
          return 3 * b - 6 * a
        }
        function h(a) {
          return 3 * a
        }
        function i(a, b, c) {
          return ((f(b, c) * a + g(b, c)) * a + h(b)) * a
        }
        function j(a, b, c) {
          return 3 * f(b, c) * a * a + 2 * g(b, c) * a + h(b)
        }
        function k(b, c) {
          for (var e = 0; p > e; ++e) {
            var f = j(c, a, d)
            if (0 === f) return c
            var g = i(c, a, d) - b
            c -= g / f
          }
          return c
        }
        function l() {
          for (var b = 0; t > b; ++b) x[b] = i(b * u, a, d)
        }
        function m(b, c, e) {
          var f,
            g,
            h = 0
          do
            (g = c + (e - c) / 2),
              (f = i(g, a, d) - b),
              f > 0 ? (e = g) : (c = g)
          while (Math.abs(f) > r && ++h < s)
          return g
        }
        function n(b) {
          for (var c = 0, e = 1, f = t - 1; e != f && x[e] <= b; ++e) c += u
          --e
          var g = (b - x[e]) / (x[e + 1] - x[e]),
            h = c + g * u,
            i = j(h, a, d)
          return i >= q ? k(b, h) : 0 == i ? h : m(b, c, c + u)
        }
        function o() {
          ;(y = !0), (a != c || d != e) && l()
        }
        var p = 4,
          q = 0.001,
          r = 1e-7,
          s = 10,
          t = 11,
          u = 1 / (t - 1),
          v = 'Float32Array' in b
        if (4 !== arguments.length) return !1
        for (var w = 0; 4 > w; ++w)
          if (
            'number' != typeof arguments[w] ||
            isNaN(arguments[w]) ||
            !isFinite(arguments[w])
          )
            return !1
        ;(a = Math.min(a, 1)),
          (d = Math.min(d, 1)),
          (a = Math.max(a, 0)),
          (d = Math.max(d, 0))
        var x = v ? new Float32Array(t) : new Array(t),
          y = !1,
          z = function(b) {
            return (
              y || o(),
              a === c && d === e ? b : 0 === b ? 0 : 1 === b ? 1 : i(n(b), c, e)
            )
          }
        z.getControlPoints = function() {
          return [
            { x: a, y: c },
            { x: d, y: e }
          ]
        }
        var A = 'generateBezier(' + [a, c, d, e] + ')'
        return (
          (z.toString = function() {
            return A
          }),
          z
        )
      }
      function j(a, b) {
        var c = a
        return (
          p.isString(a)
            ? t.Easings[a] || (c = !1)
            : (c =
                p.isArray(a) && 1 === a.length
                  ? h.apply(null, a)
                  : p.isArray(a) && 2 === a.length
                  ? u.apply(null, a.concat([b]))
                  : p.isArray(a) && 4 === a.length
                  ? i.apply(null, a)
                  : !1),
          c === !1 &&
            (c = t.Easings[t.defaults.easing] ? t.defaults.easing : s),
          c
        )
      }
      function k(a) {
        if (a) {
          var b = new Date().getTime(),
            c = t.State.calls.length
          c > 1e4 && (t.State.calls = e(t.State.calls))
          for (var f = 0; c > f; f++)
            if (t.State.calls[f]) {
              var h = t.State.calls[f],
                i = h[0],
                j = h[2],
                n = h[3],
                o = !!n,
                q = null
              n || (n = t.State.calls[f][3] = b - 16)
              for (
                var r = Math.min((b - n) / j.duration, 1), s = 0, u = i.length;
                u > s;
                s++
              ) {
                var w = i[s],
                  y = w.element
                if (g(y)) {
                  var z = !1
                  if (
                    j.display !== d &&
                    null !== j.display &&
                    'none' !== j.display
                  ) {
                    if ('flex' === j.display) {
                      var A = [
                        '-webkit-box',
                        '-moz-box',
                        '-ms-flexbox',
                        '-webkit-flex'
                      ]
                      m.each(A, function(a, b) {
                        v.setPropertyValue(y, 'display', b)
                      })
                    }
                    v.setPropertyValue(y, 'display', j.display)
                  }
                  j.visibility !== d &&
                    'hidden' !== j.visibility &&
                    v.setPropertyValue(y, 'visibility', j.visibility)
                  for (var B in w)
                    if ('element' !== B) {
                      var C,
                        D = w[B],
                        E = p.isString(D.easing)
                          ? t.Easings[D.easing]
                          : D.easing
                      if (1 === r) C = D.endValue
                      else {
                        var F = D.endValue - D.startValue
                        if (
                          ((C = D.startValue + F * E(r, j, F)),
                          !o && C === D.currentValue)
                        )
                          continue
                      }
                      if (((D.currentValue = C), 'tween' === B)) q = C
                      else {
                        if (v.Hooks.registered[B]) {
                          var G = v.Hooks.getRoot(B),
                            H = g(y).rootPropertyValueCache[G]
                          H && (D.rootPropertyValue = H)
                        }
                        var I = v.setPropertyValue(
                          y,
                          B,
                          D.currentValue +
                            (0 === parseFloat(C) ? '' : D.unitType),
                          D.rootPropertyValue,
                          D.scrollData
                        )
                        v.Hooks.registered[B] &&
                          (g(y).rootPropertyValueCache[G] = v.Normalizations
                            .registered[G]
                            ? v.Normalizations.registered[G](
                                'extract',
                                null,
                                I[1]
                              )
                            : I[1]),
                          'transform' === I[0] && (z = !0)
                      }
                    }
                  j.mobileHA &&
                    g(y).transformCache.translate3d === d &&
                    ((g(y).transformCache.translate3d = '(0px, 0px, 0px)'),
                    (z = !0)),
                    z && v.flushTransformCache(y)
                }
              }
              j.display !== d &&
                'none' !== j.display &&
                (t.State.calls[f][2].display = !1),
                j.visibility !== d &&
                  'hidden' !== j.visibility &&
                  (t.State.calls[f][2].visibility = !1),
                j.progress &&
                  j.progress.call(
                    h[1],
                    h[1],
                    r,
                    Math.max(0, n + j.duration - b),
                    n,
                    q
                  ),
                1 === r && l(f)
            }
        }
        t.State.isTicking && x(k)
      }
      function l(a, b) {
        if (!t.State.calls[a]) return !1
        for (
          var c = t.State.calls[a][0],
            e = t.State.calls[a][1],
            f = t.State.calls[a][2],
            h = t.State.calls[a][4],
            i = !1,
            j = 0,
            k = c.length;
          k > j;
          j++
        ) {
          var l = c[j].element
          if (
            (b ||
              f.loop ||
              ('none' === f.display &&
                v.setPropertyValue(l, 'display', f.display),
              'hidden' === f.visibility &&
                v.setPropertyValue(l, 'visibility', f.visibility)),
            f.loop !== !0 &&
              (m.queue(l)[1] === d ||
                !/\.velocityQueueEntryFlag/i.test(m.queue(l)[1])) &&
              g(l))
          ) {
            ;(g(l).isAnimating = !1), (g(l).rootPropertyValueCache = {})
            var n = !1
            m.each(v.Lists.transforms3D, function(a, b) {
              var c = /^scale/.test(b) ? 1 : 0,
                e = g(l).transformCache[b]
              g(l).transformCache[b] !== d &&
                new RegExp('^\\(' + c + '[^.]').test(e) &&
                ((n = !0), delete g(l).transformCache[b])
            }),
              f.mobileHA && ((n = !0), delete g(l).transformCache.translate3d),
              n && v.flushTransformCache(l),
              v.Values.removeClass(l, 'velocity-animating')
          }
          if (!b && f.complete && !f.loop && j === k - 1)
            try {
              f.complete.call(e, e)
            } catch (o) {
              setTimeout(function() {
                throw o
              }, 1)
            }
          h && f.loop !== !0 && h(e),
            g(l) &&
              f.loop === !0 &&
              !b &&
              (m.each(g(l).tweensContainer, function(a, b) {
                ;/^rotate/.test(a) &&
                  360 === parseFloat(b.endValue) &&
                  ((b.endValue = 0), (b.startValue = 360)),
                  /^backgroundPosition/.test(a) &&
                    100 === parseFloat(b.endValue) &&
                    '%' === b.unitType &&
                    ((b.endValue = 0), (b.startValue = 100))
              }),
              t(l, 'reverse', { loop: !0, delay: f.delay })),
            f.queue !== !1 && m.dequeue(l, f.queue)
        }
        t.State.calls[a] = !1
        for (var p = 0, q = t.State.calls.length; q > p; p++)
          if (t.State.calls[p] !== !1) {
            i = !0
            break
          }
        i === !1 &&
          ((t.State.isTicking = !1), delete t.State.calls, (t.State.calls = []))
      }
      var m,
        n = (function() {
          if (c.documentMode) return c.documentMode
          for (var a = 7; a > 4; a--) {
            var b = c.createElement('div')
            if (
              ((b.innerHTML =
                '<!--[if IE ' + a + ']><span></span><![endif]-->'),
              b.getElementsByTagName('span').length)
            )
              return (b = null), a
          }
          return d
        })(),
        o = (function() {
          var a = 0
          return (
            b.webkitRequestAnimationFrame ||
            b.mozRequestAnimationFrame ||
            function(b) {
              var c,
                d = new Date().getTime()
              return (
                (c = Math.max(0, 16 - (d - a))),
                (a = d + c),
                setTimeout(function() {
                  b(d + c)
                }, c)
              )
            }
          )
        })(),
        p = {
          isString: function(a) {
            return 'string' == typeof a
          },
          isArray:
            Array.isArray ||
            function(a) {
              return '[object Array]' === Object.prototype.toString.call(a)
            },
          isFunction: function(a) {
            return '[object Function]' === Object.prototype.toString.call(a)
          },
          isNode: function(a) {
            return a && a.nodeType
          },
          isNodeList: function(a) {
            return (
              'object' == typeof a &&
              /^\[object (HTMLCollection|NodeList|Object)\]$/.test(
                Object.prototype.toString.call(a)
              ) &&
              a.length !== d &&
              (0 === a.length || ('object' == typeof a[0] && a[0].nodeType > 0))
            )
          },
          isWrapped: function(a) {
            return a && (a.jquery || (b.Zepto && b.Zepto.zepto.isZ(a)))
          },
          isSVG: function(a) {
            return b.SVGElement && a instanceof b.SVGElement
          },
          isEmptyObject: function(a) {
            for (var b in a) return !1
            return !0
          }
        },
        q = !1
      if (
        (a.fn && a.fn.jquery ? ((m = a), (q = !0)) : (m = b.Velocity.Utilities),
        8 >= n && !q)
      )
        throw new Error(
          'Velocity: IE8 and below require jQuery to be loaded before Velocity.'
        )
      if (7 >= n) return void (jQuery.fn.velocity = jQuery.fn.animate)
      var r = 400,
        s = 'swing',
        t = {
          State: {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ),
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: b.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            prefixElement: c.createElement('div'),
            prefixMatches: {},
            scrollAnchor: null,
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            isTicking: !1,
            calls: []
          },
          CSS: {},
          Utilities: m,
          Redirects: {},
          Easings: {},
          Promise: b.Promise,
          defaults: {
            queue: '',
            duration: r,
            easing: s,
            begin: d,
            complete: d,
            progress: d,
            display: d,
            visibility: d,
            loop: !1,
            delay: !1,
            mobileHA: !0,
            _cacheValues: !0
          },
          init: function(a) {
            m.data(a, 'velocity', {
              isSVG: p.isSVG(a),
              isAnimating: !1,
              computedStyle: null,
              tweensContainer: null,
              rootPropertyValueCache: {},
              transformCache: {}
            })
          },
          hook: null,
          mock: !1,
          version: { major: 1, minor: 2, patch: 2 },
          debug: !1
        }
      b.pageYOffset !== d
        ? ((t.State.scrollAnchor = b),
          (t.State.scrollPropertyLeft = 'pageXOffset'),
          (t.State.scrollPropertyTop = 'pageYOffset'))
        : ((t.State.scrollAnchor =
            c.documentElement || c.body.parentNode || c.body),
          (t.State.scrollPropertyLeft = 'scrollLeft'),
          (t.State.scrollPropertyTop = 'scrollTop'))
      var u = (function() {
        function a(a) {
          return -a.tension * a.x - a.friction * a.v
        }
        function b(b, c, d) {
          var e = {
            x: b.x + d.dx * c,
            v: b.v + d.dv * c,
            tension: b.tension,
            friction: b.friction
          }
          return { dx: e.v, dv: a(e) }
        }
        function c(c, d) {
          var e = { dx: c.v, dv: a(c) },
            f = b(c, 0.5 * d, e),
            g = b(c, 0.5 * d, f),
            h = b(c, d, g),
            i = (1 / 6) * (e.dx + 2 * (f.dx + g.dx) + h.dx),
            j = (1 / 6) * (e.dv + 2 * (f.dv + g.dv) + h.dv)
          return (c.x = c.x + i * d), (c.v = c.v + j * d), c
        }
        return function d(a, b, e) {
          var f,
            g,
            h,
            i = { x: -1, v: 0, tension: null, friction: null },
            j = [0],
            k = 0,
            l = 1e-4,
            m = 0.016
          for (
            a = parseFloat(a) || 500,
              b = parseFloat(b) || 20,
              e = e || null,
              i.tension = a,
              i.friction = b,
              f = null !== e,
              f ? ((k = d(a, b)), (g = (k / e) * m)) : (g = m);
            ;

          )
            if (
              ((h = c(h || i, g)),
              j.push(1 + h.x),
              (k += 16),
              !(Math.abs(h.x) > l && Math.abs(h.v) > l))
            )
              break
          return f
            ? function(a) {
                return j[(a * (j.length - 1)) | 0]
              }
            : k
        }
      })()
      ;(t.Easings = {
        linear: function(a) {
          return a
        },
        swing: function(a) {
          return 0.5 - Math.cos(a * Math.PI) / 2
        },
        spring: function(a) {
          return 1 - Math.cos(4.5 * a * Math.PI) * Math.exp(6 * -a)
        }
      }),
        m.each(
          [
            ['ease', [0.25, 0.1, 0.25, 1]],
            ['ease-in', [0.42, 0, 1, 1]],
            ['ease-out', [0, 0, 0.58, 1]],
            ['ease-in-out', [0.42, 0, 0.58, 1]],
            ['easeInSine', [0.47, 0, 0.745, 0.715]],
            ['easeOutSine', [0.39, 0.575, 0.565, 1]],
            ['easeInOutSine', [0.445, 0.05, 0.55, 0.95]],
            ['easeInQuad', [0.55, 0.085, 0.68, 0.53]],
            ['easeOutQuad', [0.25, 0.46, 0.45, 0.94]],
            ['easeInOutQuad', [0.455, 0.03, 0.515, 0.955]],
            ['easeInCubic', [0.55, 0.055, 0.675, 0.19]],
            ['easeOutCubic', [0.215, 0.61, 0.355, 1]],
            ['easeInOutCubic', [0.645, 0.045, 0.355, 1]],
            ['easeInQuart', [0.895, 0.03, 0.685, 0.22]],
            ['easeOutQuart', [0.165, 0.84, 0.44, 1]],
            ['easeInOutQuart', [0.77, 0, 0.175, 1]],
            ['easeInQuint', [0.755, 0.05, 0.855, 0.06]],
            ['easeOutQuint', [0.23, 1, 0.32, 1]],
            ['easeInOutQuint', [0.86, 0, 0.07, 1]],
            ['easeInExpo', [0.95, 0.05, 0.795, 0.035]],
            ['easeOutExpo', [0.19, 1, 0.22, 1]],
            ['easeInOutExpo', [1, 0, 0, 1]],
            ['easeInCirc', [0.6, 0.04, 0.98, 0.335]],
            ['easeOutCirc', [0.075, 0.82, 0.165, 1]],
            ['easeInOutCirc', [0.785, 0.135, 0.15, 0.86]]
          ],
          function(a, b) {
            t.Easings[b[0]] = i.apply(null, b[1])
          }
        )
      var v = (t.CSS = {
        RegEx: {
          isHex: /^#([A-f\d]{3}){1,2}$/i,
          valueUnwrap: /^[A-z]+\((.*)\)$/i,
          wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
          valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
        },
        Lists: {
          colors: [
            'fill',
            'stroke',
            'stopColor',
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
            'outlineColor'
          ],
          transformsBase: [
            'translateX',
            'translateY',
            'scale',
            'scaleX',
            'scaleY',
            'skewX',
            'skewY',
            'rotateZ'
          ],
          transforms3D: [
            'transformPerspective',
            'translateZ',
            'scaleZ',
            'rotateX',
            'rotateY'
          ]
        },
        Hooks: {
          templates: {
            textShadow: ['Color X Y Blur', 'black 0px 0px 0px'],
            boxShadow: ['Color X Y Blur Spread', 'black 0px 0px 0px 0px'],
            clip: ['Top Right Bottom Left', '0px 0px 0px 0px'],
            backgroundPosition: ['X Y', '0% 0%'],
            transformOrigin: ['X Y Z', '50% 50% 0px'],
            perspectiveOrigin: ['X Y', '50% 50%']
          },
          registered: {},
          register: function() {
            for (var a = 0; a < v.Lists.colors.length; a++) {
              var b =
                'color' === v.Lists.colors[a] ? '0 0 0 1' : '255 255 255 1'
              v.Hooks.templates[v.Lists.colors[a]] = ['Red Green Blue Alpha', b]
            }
            var c, d, e
            if (n)
              for (c in v.Hooks.templates) {
                ;(d = v.Hooks.templates[c]), (e = d[0].split(' '))
                var f = d[1].match(v.RegEx.valueSplit)
                'Color' === e[0] &&
                  (e.push(e.shift()),
                  f.push(f.shift()),
                  (v.Hooks.templates[c] = [e.join(' '), f.join(' ')]))
              }
            for (c in v.Hooks.templates) {
              ;(d = v.Hooks.templates[c]), (e = d[0].split(' '))
              for (var a in e) {
                var g = c + e[a],
                  h = a
                v.Hooks.registered[g] = [c, h]
              }
            }
          },
          getRoot: function(a) {
            var b = v.Hooks.registered[a]
            return b ? b[0] : a
          },
          cleanRootPropertyValue: function(a, b) {
            return (
              v.RegEx.valueUnwrap.test(b) &&
                (b = b.match(v.RegEx.valueUnwrap)[1]),
              v.Values.isCSSNullValue(b) && (b = v.Hooks.templates[a][1]),
              b
            )
          },
          extractValue: function(a, b) {
            var c = v.Hooks.registered[a]
            if (c) {
              var d = c[0],
                e = c[1]
              return (
                (b = v.Hooks.cleanRootPropertyValue(d, b)),
                b.toString().match(v.RegEx.valueSplit)[e]
              )
            }
            return b
          },
          injectValue: function(a, b, c) {
            var d = v.Hooks.registered[a]
            if (d) {
              var e,
                f,
                g = d[0],
                h = d[1]
              return (
                (c = v.Hooks.cleanRootPropertyValue(g, c)),
                (e = c.toString().match(v.RegEx.valueSplit)),
                (e[h] = b),
                (f = e.join(' '))
              )
            }
            return c
          }
        },
        Normalizations: {
          registered: {
            clip: function(a, b, c) {
              switch (a) {
                case 'name':
                  return 'clip'
                case 'extract':
                  var d
                  return (
                    v.RegEx.wrappedValueAlreadyExtracted.test(c)
                      ? (d = c)
                      : ((d = c.toString().match(v.RegEx.valueUnwrap)),
                        (d = d ? d[1].replace(/,(\s+)?/g, ' ') : c)),
                    d
                  )
                case 'inject':
                  return 'rect(' + c + ')'
              }
            },
            blur: function(a, b, c) {
              switch (a) {
                case 'name':
                  return t.State.isFirefox ? 'filter' : '-webkit-filter'
                case 'extract':
                  var d = parseFloat(c)
                  if (!d && 0 !== d) {
                    var e = c.toString().match(/blur\(([0-9]+[A-z]+)\)/i)
                    d = e ? e[1] : 0
                  }
                  return d
                case 'inject':
                  return parseFloat(c) ? 'blur(' + c + ')' : 'none'
              }
            },
            opacity: function(a, b, c) {
              if (8 >= n)
                switch (a) {
                  case 'name':
                    return 'filter'
                  case 'extract':
                    var d = c.toString().match(/alpha\(opacity=(.*)\)/i)
                    return (c = d ? d[1] / 100 : 1)
                  case 'inject':
                    return (
                      (b.style.zoom = 1),
                      parseFloat(c) >= 1
                        ? ''
                        : 'alpha(opacity=' +
                          parseInt(100 * parseFloat(c), 10) +
                          ')'
                    )
                }
              else
                switch (a) {
                  case 'name':
                    return 'opacity'
                  case 'extract':
                    return c
                  case 'inject':
                    return c
                }
            }
          },
          register: function() {
            9 >= n ||
              t.State.isGingerbread ||
              (v.Lists.transformsBase = v.Lists.transformsBase.concat(
                v.Lists.transforms3D
              ))
            for (var a = 0; a < v.Lists.transformsBase.length; a++)
              !(function() {
                var b = v.Lists.transformsBase[a]
                v.Normalizations.registered[b] = function(a, c, e) {
                  switch (a) {
                    case 'name':
                      return 'transform'
                    case 'extract':
                      return g(c) === d || g(c).transformCache[b] === d
                        ? /^scale/i.test(b)
                          ? 1
                          : 0
                        : g(c).transformCache[b].replace(/[()]/g, '')
                    case 'inject':
                      var f = !1
                      switch (b.substr(0, b.length - 1)) {
                        case 'translate':
                          f = !/(%|px|em|rem|vw|vh|\d)$/i.test(e)
                          break
                        case 'scal':
                        case 'scale':
                          t.State.isAndroid &&
                            g(c).transformCache[b] === d &&
                            1 > e &&
                            (e = 1),
                            (f = !/(\d)$/i.test(e))
                          break
                        case 'skew':
                          f = !/(deg|\d)$/i.test(e)
                          break
                        case 'rotate':
                          f = !/(deg|\d)$/i.test(e)
                      }
                      return (
                        f || (g(c).transformCache[b] = '(' + e + ')'),
                        g(c).transformCache[b]
                      )
                  }
                }
              })()
            for (var a = 0; a < v.Lists.colors.length; a++)
              !(function() {
                var b = v.Lists.colors[a]
                v.Normalizations.registered[b] = function(a, c, e) {
                  switch (a) {
                    case 'name':
                      return b
                    case 'extract':
                      var f
                      if (v.RegEx.wrappedValueAlreadyExtracted.test(e)) f = e
                      else {
                        var g,
                          h = {
                            black: 'rgb(0, 0, 0)',
                            blue: 'rgb(0, 0, 255)',
                            gray: 'rgb(128, 128, 128)',
                            green: 'rgb(0, 128, 0)',
                            red: 'rgb(255, 0, 0)',
                            white: 'rgb(255, 255, 255)'
                          }
                        ;/^[A-z]+$/i.test(e)
                          ? (g = h[e] !== d ? h[e] : h.black)
                          : v.RegEx.isHex.test(e)
                          ? (g = 'rgb(' + v.Values.hexToRgb(e).join(' ') + ')')
                          : /^rgba?\(/i.test(e) || (g = h.black),
                          (f = (g || e)
                            .toString()
                            .match(v.RegEx.valueUnwrap)[1]
                            .replace(/,(\s+)?/g, ' '))
                      }
                      return (
                        8 >= n || 3 !== f.split(' ').length || (f += ' 1'), f
                      )
                    case 'inject':
                      return (
                        8 >= n
                          ? 4 === e.split(' ').length &&
                            (e = e
                              .split(/\s+/)
                              .slice(0, 3)
                              .join(' '))
                          : 3 === e.split(' ').length && (e += ' 1'),
                        (8 >= n ? 'rgb' : 'rgba') +
                          '(' +
                          e.replace(/\s+/g, ',').replace(/\.(\d)+(?=,)/g, '') +
                          ')'
                      )
                  }
                }
              })()
          }
        },
        Names: {
          camelCase: function(a) {
            return a.replace(/-(\w)/g, function(a, b) {
              return b.toUpperCase()
            })
          },
          SVGAttribute: function(a) {
            var b = 'width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2'
            return (
              (n || (t.State.isAndroid && !t.State.isChrome)) &&
                (b += '|transform'),
              new RegExp('^(' + b + ')$', 'i').test(a)
            )
          },
          prefixCheck: function(a) {
            if (t.State.prefixMatches[a]) return [t.State.prefixMatches[a], !0]
            for (
              var b = ['', 'Webkit', 'Moz', 'ms', 'O'], c = 0, d = b.length;
              d > c;
              c++
            ) {
              var e
              if (
                ((e =
                  0 === c
                    ? a
                    : b[c] +
                      a.replace(/^\w/, function(a) {
                        return a.toUpperCase()
                      })),
                p.isString(t.State.prefixElement.style[e]))
              )
                return (t.State.prefixMatches[a] = e), [e, !0]
            }
            return [a, !1]
          }
        },
        Values: {
          hexToRgb: function(a) {
            var b,
              c = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
            return (
              (a = a.replace(c, function(a, b, c, d) {
                return b + b + c + c + d + d
              })),
              (b = d.exec(a)),
              b
                ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)]
                : [0, 0, 0]
            )
          },
          isCSSNullValue: function(a) {
            return (
              0 == a ||
              /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)
            )
          },
          getUnitType: function(a) {
            return /^(rotate|skew)/i.test(a)
              ? 'deg'
              : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(
                  a
                )
              ? ''
              : 'px'
          },
          getDisplayType: function(a) {
            var b = a && a.tagName.toString().toLowerCase()
            return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(
              b
            )
              ? 'inline'
              : /^(li)$/i.test(b)
              ? 'list-item'
              : /^(tr)$/i.test(b)
              ? 'table-row'
              : /^(table)$/i.test(b)
              ? 'table'
              : /^(tbody)$/i.test(b)
              ? 'table-row-group'
              : 'block'
          },
          addClass: function(a, b) {
            a.classList
              ? a.classList.add(b)
              : (a.className += (a.className.length ? ' ' : '') + b)
          },
          removeClass: function(a, b) {
            a.classList
              ? a.classList.remove(b)
              : (a.className = a.className
                  .toString()
                  .replace(
                    new RegExp(
                      '(^|\\s)' + b.split(' ').join('|') + '(\\s|$)',
                      'gi'
                    ),
                    ' '
                  ))
          }
        },
        getPropertyValue: function(a, c, e, f) {
          function h(a, c) {
            function e() {
              j && v.setPropertyValue(a, 'display', 'none')
            }
            var i = 0
            if (8 >= n) i = m.css(a, c)
            else {
              var j = !1
              if (
                (/^(width|height)$/.test(c) &&
                  0 === v.getPropertyValue(a, 'display') &&
                  ((j = !0),
                  v.setPropertyValue(a, 'display', v.Values.getDisplayType(a))),
                !f)
              ) {
                if (
                  'height' === c &&
                  'border-box' !==
                    v
                      .getPropertyValue(a, 'boxSizing')
                      .toString()
                      .toLowerCase()
                ) {
                  var k =
                    a.offsetHeight -
                    (parseFloat(v.getPropertyValue(a, 'borderTopWidth')) || 0) -
                    (parseFloat(v.getPropertyValue(a, 'borderBottomWidth')) ||
                      0) -
                    (parseFloat(v.getPropertyValue(a, 'paddingTop')) || 0) -
                    (parseFloat(v.getPropertyValue(a, 'paddingBottom')) || 0)
                  return e(), k
                }
                if (
                  'width' === c &&
                  'border-box' !==
                    v
                      .getPropertyValue(a, 'boxSizing')
                      .toString()
                      .toLowerCase()
                ) {
                  var l =
                    a.offsetWidth -
                    (parseFloat(v.getPropertyValue(a, 'borderLeftWidth')) ||
                      0) -
                    (parseFloat(v.getPropertyValue(a, 'borderRightWidth')) ||
                      0) -
                    (parseFloat(v.getPropertyValue(a, 'paddingLeft')) || 0) -
                    (parseFloat(v.getPropertyValue(a, 'paddingRight')) || 0)
                  return e(), l
                }
              }
              var o
              ;(o =
                g(a) === d
                  ? b.getComputedStyle(a, null)
                  : g(a).computedStyle
                  ? g(a).computedStyle
                  : (g(a).computedStyle = b.getComputedStyle(a, null))),
                'borderColor' === c && (c = 'borderTopColor'),
                (i = 9 === n && 'filter' === c ? o.getPropertyValue(c) : o[c]),
                ('' === i || null === i) && (i = a.style[c]),
                e()
            }
            if ('auto' === i && /^(top|right|bottom|left)$/i.test(c)) {
              var p = h(a, 'position')
              ;('fixed' === p || ('absolute' === p && /top|left/i.test(c))) &&
                (i = m(a).position()[c] + 'px')
            }
            return i
          }
          var i
          if (v.Hooks.registered[c]) {
            var j = c,
              k = v.Hooks.getRoot(j)
            e === d && (e = v.getPropertyValue(a, v.Names.prefixCheck(k)[0])),
              v.Normalizations.registered[k] &&
                (e = v.Normalizations.registered[k]('extract', a, e)),
              (i = v.Hooks.extractValue(j, e))
          } else if (v.Normalizations.registered[c]) {
            var l, o
            ;(l = v.Normalizations.registered[c]('name', a)),
              'transform' !== l &&
                ((o = h(a, v.Names.prefixCheck(l)[0])),
                v.Values.isCSSNullValue(o) &&
                  v.Hooks.templates[c] &&
                  (o = v.Hooks.templates[c][1])),
              (i = v.Normalizations.registered[c]('extract', a, o))
          }
          if (!/^[\d-]/.test(i))
            if (g(a) && g(a).isSVG && v.Names.SVGAttribute(c))
              if (/^(height|width)$/i.test(c))
                try {
                  i = a.getBBox()[c]
                } catch (p) {
                  i = 0
                }
              else i = a.getAttribute(c)
            else i = h(a, v.Names.prefixCheck(c)[0])
          return (
            v.Values.isCSSNullValue(i) && (i = 0),
            t.debug >= 2 && console.log('Get ' + c + ': ' + i),
            i
          )
        },
        setPropertyValue: function(a, c, d, e, f) {
          var h = c
          if ('scroll' === c)
            f.container
              ? (f.container['scroll' + f.direction] = d)
              : 'Left' === f.direction
              ? b.scrollTo(d, f.alternateValue)
              : b.scrollTo(f.alternateValue, d)
          else if (
            v.Normalizations.registered[c] &&
            'transform' === v.Normalizations.registered[c]('name', a)
          )
            v.Normalizations.registered[c]('inject', a, d),
              (h = 'transform'),
              (d = g(a).transformCache[c])
          else {
            if (v.Hooks.registered[c]) {
              var i = c,
                j = v.Hooks.getRoot(c)
              ;(e = e || v.getPropertyValue(a, j)),
                (d = v.Hooks.injectValue(i, d, e)),
                (c = j)
            }
            if (
              (v.Normalizations.registered[c] &&
                ((d = v.Normalizations.registered[c]('inject', a, d)),
                (c = v.Normalizations.registered[c]('name', a))),
              (h = v.Names.prefixCheck(c)[0]),
              8 >= n)
            )
              try {
                a.style[h] = d
              } catch (k) {
                t.debug &&
                  console.log(
                    'Browser does not support [' + d + '] for [' + h + ']'
                  )
              }
            else
              g(a) && g(a).isSVG && v.Names.SVGAttribute(c)
                ? a.setAttribute(c, d)
                : (a.style[h] = d)
            t.debug >= 2 && console.log('Set ' + c + ' (' + h + '): ' + d)
          }
          return [h, d]
        },
        flushTransformCache: function(a) {
          function b(b) {
            return parseFloat(v.getPropertyValue(a, b))
          }
          var c = ''
          if ((n || (t.State.isAndroid && !t.State.isChrome)) && g(a).isSVG) {
            var d = {
              translate: [b('translateX'), b('translateY')],
              skewX: [b('skewX')],
              skewY: [b('skewY')],
              scale:
                1 !== b('scale')
                  ? [b('scale'), b('scale')]
                  : [b('scaleX'), b('scaleY')],
              rotate: [b('rotateZ'), 0, 0]
            }
            m.each(g(a).transformCache, function(a) {
              ;/^translate/i.test(a)
                ? (a = 'translate')
                : /^scale/i.test(a)
                ? (a = 'scale')
                : /^rotate/i.test(a) && (a = 'rotate'),
                d[a] && ((c += a + '(' + d[a].join(' ') + ') '), delete d[a])
            })
          } else {
            var e, f
            m.each(g(a).transformCache, function(b) {
              return (
                (e = g(a).transformCache[b]),
                'transformPerspective' === b
                  ? ((f = e), !0)
                  : (9 === n && 'rotateZ' === b && (b = 'rotate'),
                    void (c += b + e + ' '))
              )
            }),
              f && (c = 'perspective' + f + ' ' + c)
          }
          v.setPropertyValue(a, 'transform', c)
        }
      })
      v.Hooks.register(),
        v.Normalizations.register(),
        (t.hook = function(a, b, c) {
          var e = d
          return (
            (a = f(a)),
            m.each(a, function(a, f) {
              if ((g(f) === d && t.init(f), c === d))
                e === d && (e = t.CSS.getPropertyValue(f, b))
              else {
                var h = t.CSS.setPropertyValue(f, b, c)
                'transform' === h[0] && t.CSS.flushTransformCache(f), (e = h)
              }
            }),
            e
          )
        })
      var w = function() {
        function a() {
          return h ? B.promise || null : i
        }
        function e() {
          function a() {
            function a(a, b) {
              var c = d,
                e = d,
                g = d
              return (
                p.isArray(a)
                  ? ((c = a[0]),
                    (!p.isArray(a[1]) && /^[\d-]/.test(a[1])) ||
                    p.isFunction(a[1]) ||
                    v.RegEx.isHex.test(a[1])
                      ? (g = a[1])
                      : ((p.isString(a[1]) && !v.RegEx.isHex.test(a[1])) ||
                          p.isArray(a[1])) &&
                        ((e = b ? a[1] : j(a[1], h.duration)),
                        a[2] !== d && (g = a[2])))
                  : (c = a),
                b || (e = e || h.easing),
                p.isFunction(c) && (c = c.call(f, y, x)),
                p.isFunction(g) && (g = g.call(f, y, x)),
                [c || 0, e, g]
              )
            }
            function l(a, b) {
              var c, d
              return (
                (d = (b || '0')
                  .toString()
                  .toLowerCase()
                  .replace(/[%A-z]+$/, function(a) {
                    return (c = a), ''
                  })),
                c || (c = v.Values.getUnitType(a)),
                [d, c]
              )
            }
            function n() {
              var a = {
                  myParent: f.parentNode || c.body,
                  position: v.getPropertyValue(f, 'position'),
                  fontSize: v.getPropertyValue(f, 'fontSize')
                },
                d =
                  a.position === I.lastPosition && a.myParent === I.lastParent,
                e = a.fontSize === I.lastFontSize
              ;(I.lastParent = a.myParent),
                (I.lastPosition = a.position),
                (I.lastFontSize = a.fontSize)
              var h = 100,
                i = {}
              if (e && d)
                (i.emToPx = I.lastEmToPx),
                  (i.percentToPxWidth = I.lastPercentToPxWidth),
                  (i.percentToPxHeight = I.lastPercentToPxHeight)
              else {
                var j = g(f).isSVG
                  ? c.createElementNS('//www.w3.org/2000/svg', 'rect')
                  : c.createElement('div')
                t.init(j),
                  a.myParent.appendChild(j),
                  m.each(['overflow', 'overflowX', 'overflowY'], function(
                    a,
                    b
                  ) {
                    t.CSS.setPropertyValue(j, b, 'hidden')
                  }),
                  t.CSS.setPropertyValue(j, 'position', a.position),
                  t.CSS.setPropertyValue(j, 'fontSize', a.fontSize),
                  t.CSS.setPropertyValue(j, 'boxSizing', 'content-box'),
                  m.each(
                    [
                      'minWidth',
                      'maxWidth',
                      'width',
                      'minHeight',
                      'maxHeight',
                      'height'
                    ],
                    function(a, b) {
                      t.CSS.setPropertyValue(j, b, h + '%')
                    }
                  ),
                  t.CSS.setPropertyValue(j, 'paddingLeft', h + 'em'),
                  (i.percentToPxWidth = I.lastPercentToPxWidth =
                    (parseFloat(v.getPropertyValue(j, 'width', null, !0)) ||
                      1) / h),
                  (i.percentToPxHeight = I.lastPercentToPxHeight =
                    (parseFloat(v.getPropertyValue(j, 'height', null, !0)) ||
                      1) / h),
                  (i.emToPx = I.lastEmToPx =
                    (parseFloat(v.getPropertyValue(j, 'paddingLeft')) || 1) /
                    h),
                  a.myParent.removeChild(j)
              }
              return (
                null === I.remToPx &&
                  (I.remToPx =
                    parseFloat(v.getPropertyValue(c.body, 'fontSize')) || 16),
                null === I.vwToPx &&
                  ((I.vwToPx = parseFloat(b.innerWidth) / 100),
                  (I.vhToPx = parseFloat(b.innerHeight) / 100)),
                (i.remToPx = I.remToPx),
                (i.vwToPx = I.vwToPx),
                (i.vhToPx = I.vhToPx),
                t.debug >= 1 &&
                  console.log('Unit ratios: ' + JSON.stringify(i), f),
                i
              )
            }
            if (h.begin && 0 === y)
              try {
                h.begin.call(o, o)
              } catch (r) {
                setTimeout(function() {
                  throw r
                }, 1)
              }
            if ('scroll' === C) {
              var u,
                w,
                z,
                A = /^x$/i.test(h.axis) ? 'Left' : 'Top',
                D = parseFloat(h.offset) || 0
              h.container
                ? p.isWrapped(h.container) || p.isNode(h.container)
                  ? ((h.container = h.container[0] || h.container),
                    (u = h.container['scroll' + A]),
                    (z = u + m(f).position()[A.toLowerCase()] + D))
                  : (h.container = null)
                : ((u = t.State.scrollAnchor[t.State['scrollProperty' + A]]),
                  (w =
                    t.State.scrollAnchor[
                      t.State[
                        'scrollProperty' + ('Left' === A ? 'Top' : 'Left')
                      ]
                    ]),
                  (z = m(f).offset()[A.toLowerCase()] + D)),
                (i = {
                  scroll: {
                    rootPropertyValue: !1,
                    startValue: u,
                    currentValue: u,
                    endValue: z,
                    unitType: '',
                    easing: h.easing,
                    scrollData: {
                      container: h.container,
                      direction: A,
                      alternateValue: w
                    }
                  },
                  element: f
                }),
                t.debug &&
                  console.log('tweensContainer (scroll): ', i.scroll, f)
            } else if ('reverse' === C) {
              if (!g(f).tweensContainer) return void m.dequeue(f, h.queue)
              'none' === g(f).opts.display && (g(f).opts.display = 'auto'),
                'hidden' === g(f).opts.visibility &&
                  (g(f).opts.visibility = 'visible'),
                (g(f).opts.loop = !1),
                (g(f).opts.begin = null),
                (g(f).opts.complete = null),
                s.easing || delete h.easing,
                s.duration || delete h.duration,
                (h = m.extend({}, g(f).opts, h))
              var E = m.extend(!0, {}, g(f).tweensContainer)
              for (var F in E)
                if ('element' !== F) {
                  var G = E[F].startValue
                  ;(E[F].startValue = E[F].currentValue = E[F].endValue),
                    (E[F].endValue = G),
                    p.isEmptyObject(s) || (E[F].easing = h.easing),
                    t.debug &&
                      console.log(
                        'reverse tweensContainer (' +
                          F +
                          '): ' +
                          JSON.stringify(E[F]),
                        f
                      )
                }
              i = E
            } else if ('start' === C) {
              var E
              g(f).tweensContainer &&
                g(f).isAnimating === !0 &&
                (E = g(f).tweensContainer),
                m.each(q, function(b, c) {
                  if (RegExp('^' + v.Lists.colors.join('$|^') + '$').test(b)) {
                    var e = a(c, !0),
                      f = e[0],
                      g = e[1],
                      h = e[2]
                    if (v.RegEx.isHex.test(f)) {
                      for (
                        var i = ['Red', 'Green', 'Blue'],
                          j = v.Values.hexToRgb(f),
                          k = h ? v.Values.hexToRgb(h) : d,
                          l = 0;
                        l < i.length;
                        l++
                      ) {
                        var m = [j[l]]
                        g && m.push(g),
                          k !== d && m.push(k[l]),
                          (q[b + i[l]] = m)
                      }
                      delete q[b]
                    }
                  }
                })
              for (var H in q) {
                var K = a(q[H]),
                  L = K[0],
                  M = K[1],
                  N = K[2]
                H = v.Names.camelCase(H)
                var O = v.Hooks.getRoot(H),
                  P = !1
                if (
                  g(f).isSVG ||
                  'tween' === O ||
                  v.Names.prefixCheck(O)[1] !== !1 ||
                  v.Normalizations.registered[O] !== d
                ) {
                  ;((h.display !== d &&
                    null !== h.display &&
                    'none' !== h.display) ||
                    (h.visibility !== d && 'hidden' !== h.visibility)) &&
                    /opacity|filter/.test(H) &&
                    !N &&
                    0 !== L &&
                    (N = 0),
                    h._cacheValues && E && E[H]
                      ? (N === d && (N = E[H].endValue + E[H].unitType),
                        (P = g(f).rootPropertyValueCache[O]))
                      : v.Hooks.registered[H]
                      ? N === d
                        ? ((P = v.getPropertyValue(f, O)),
                          (N = v.getPropertyValue(f, H, P)))
                        : (P = v.Hooks.templates[O][1])
                      : N === d && (N = v.getPropertyValue(f, H))
                  var Q,
                    R,
                    S,
                    T = !1
                  if (
                    ((Q = l(H, N)),
                    (N = Q[0]),
                    (S = Q[1]),
                    (Q = l(H, L)),
                    (L = Q[0].replace(/^([+-\/*])=/, function(a, b) {
                      return (T = b), ''
                    })),
                    (R = Q[1]),
                    (N = parseFloat(N) || 0),
                    (L = parseFloat(L) || 0),
                    '%' === R &&
                      (/^(fontSize|lineHeight)$/.test(H)
                        ? ((L /= 100), (R = 'em'))
                        : /^scale/.test(H)
                        ? ((L /= 100), (R = ''))
                        : /(Red|Green|Blue)$/i.test(H) &&
                          ((L = (L / 100) * 255), (R = ''))),
                    /[\/*]/.test(T))
                  )
                    R = S
                  else if (S !== R && 0 !== N)
                    if (0 === L) R = S
                    else {
                      e = e || n()
                      var U =
                        /margin|padding|left|right|width|text|word|letter/i.test(
                          H
                        ) ||
                        /X$/.test(H) ||
                        'x' === H
                          ? 'x'
                          : 'y'
                      switch (S) {
                        case '%':
                          N *=
                            'x' === U ? e.percentToPxWidth : e.percentToPxHeight
                          break
                        case 'px':
                          break
                        default:
                          N *= e[S + 'ToPx']
                      }
                      switch (R) {
                        case '%':
                          N *=
                            1 /
                            ('x' === U
                              ? e.percentToPxWidth
                              : e.percentToPxHeight)
                          break
                        case 'px':
                          break
                        default:
                          N *= 1 / e[R + 'ToPx']
                      }
                    }
                  switch (T) {
                    case '+':
                      L = N + L
                      break
                    case '-':
                      L = N - L
                      break
                    case '*':
                      L = N * L
                      break
                    case '/':
                      L = N / L
                  }
                  ;(i[H] = {
                    rootPropertyValue: P,
                    startValue: N,
                    currentValue: N,
                    endValue: L,
                    unitType: R,
                    easing: M
                  }),
                    t.debug &&
                      console.log(
                        'tweensContainer (' + H + '): ' + JSON.stringify(i[H]),
                        f
                      )
                } else
                  t.debug &&
                    console.log(
                      'Skipping [' + O + '] due to a lack of browser support.'
                    )
              }
              i.element = f
            }
            i.element &&
              (v.Values.addClass(f, 'velocity-animating'),
              J.push(i),
              '' === h.queue && ((g(f).tweensContainer = i), (g(f).opts = h)),
              (g(f).isAnimating = !0),
              y === x - 1
                ? (t.State.calls.push([J, o, h, null, B.resolver]),
                  t.State.isTicking === !1 && ((t.State.isTicking = !0), k()))
                : y++)
          }
          var e,
            f = this,
            h = m.extend({}, t.defaults, s),
            i = {}
          switch (
            (g(f) === d && t.init(f),
            parseFloat(h.delay) &&
              h.queue !== !1 &&
              m.queue(f, h.queue, function(a) {
                ;(t.velocityQueueEntryFlag = !0),
                  (g(f).delayTimer = {
                    setTimeout: setTimeout(a, parseFloat(h.delay)),
                    next: a
                  })
              }),
            h.duration.toString().toLowerCase())
          ) {
            case 'fast':
              h.duration = 200
              break
            case 'normal':
              h.duration = r
              break
            case 'slow':
              h.duration = 600
              break
            default:
              h.duration = parseFloat(h.duration) || 1
          }
          t.mock !== !1 &&
            (t.mock === !0
              ? (h.duration = h.delay = 1)
              : ((h.duration *= parseFloat(t.mock) || 1),
                (h.delay *= parseFloat(t.mock) || 1))),
            (h.easing = j(h.easing, h.duration)),
            h.begin && !p.isFunction(h.begin) && (h.begin = null),
            h.progress && !p.isFunction(h.progress) && (h.progress = null),
            h.complete && !p.isFunction(h.complete) && (h.complete = null),
            h.display !== d &&
              null !== h.display &&
              ((h.display = h.display.toString().toLowerCase()),
              'auto' === h.display &&
                (h.display = t.CSS.Values.getDisplayType(f))),
            h.visibility !== d &&
              null !== h.visibility &&
              (h.visibility = h.visibility.toString().toLowerCase()),
            (h.mobileHA =
              h.mobileHA && t.State.isMobile && !t.State.isGingerbread),
            h.queue === !1
              ? h.delay
                ? setTimeout(a, h.delay)
                : a()
              : m.queue(f, h.queue, function(b, c) {
                  return c === !0
                    ? (B.promise && B.resolver(o), !0)
                    : ((t.velocityQueueEntryFlag = !0), void a(b))
                }),
            ('' !== h.queue && 'fx' !== h.queue) ||
              'inprogress' === m.queue(f)[0] ||
              m.dequeue(f)
        }
        var h,
          i,
          n,
          o,
          q,
          s,
          u =
            arguments[0] &&
            (arguments[0].p ||
              (m.isPlainObject(arguments[0].properties) &&
                !arguments[0].properties.names) ||
              p.isString(arguments[0].properties))
        if (
          (p.isWrapped(this)
            ? ((h = !1), (n = 0), (o = this), (i = this))
            : ((h = !0),
              (n = 1),
              (o = u ? arguments[0].elements || arguments[0].e : arguments[0])),
          (o = f(o)))
        ) {
          u
            ? ((q = arguments[0].properties || arguments[0].p),
              (s = arguments[0].options || arguments[0].o))
            : ((q = arguments[n]), (s = arguments[n + 1]))
          var x = o.length,
            y = 0
          if (!/^(stop|finish|finishAll)$/i.test(q) && !m.isPlainObject(s)) {
            var z = n + 1
            s = {}
            for (var A = z; A < arguments.length; A++)
              p.isArray(arguments[A]) ||
              (!/^(fast|normal|slow)$/i.test(arguments[A]) &&
                !/^\d/.test(arguments[A]))
                ? p.isString(arguments[A]) || p.isArray(arguments[A])
                  ? (s.easing = arguments[A])
                  : p.isFunction(arguments[A]) && (s.complete = arguments[A])
                : (s.duration = arguments[A])
          }
          var B = { promise: null, resolver: null, rejecter: null }
          h &&
            t.Promise &&
            (B.promise = new t.Promise(function(a, b) {
              ;(B.resolver = a), (B.rejecter = b)
            }))
          var C
          switch (q) {
            case 'scroll':
              C = 'scroll'
              break
            case 'reverse':
              C = 'reverse'
              break
            case 'finish':
            case 'finishAll':
            case 'stop':
              m.each(o, function(a, b) {
                g(b) &&
                  g(b).delayTimer &&
                  (clearTimeout(g(b).delayTimer.setTimeout),
                  g(b).delayTimer.next && g(b).delayTimer.next(),
                  delete g(b).delayTimer),
                  'finishAll' !== q ||
                    (s !== !0 && !p.isString(s)) ||
                    (m.each(m.queue(b, p.isString(s) ? s : ''), function(a, b) {
                      p.isFunction(b) && b()
                    }),
                    m.queue(b, p.isString(s) ? s : '', []))
              })
              var D = []
              return (
                m.each(t.State.calls, function(a, b) {
                  b &&
                    m.each(b[1], function(c, e) {
                      var f = s === d ? '' : s
                      return f === !0 ||
                        b[2].queue === f ||
                        (s === d && b[2].queue === !1)
                        ? void m.each(o, function(c, d) {
                            d === e &&
                              ((s === !0 || p.isString(s)) &&
                                (m.each(
                                  m.queue(d, p.isString(s) ? s : ''),
                                  function(a, b) {
                                    p.isFunction(b) && b(null, !0)
                                  }
                                ),
                                m.queue(d, p.isString(s) ? s : '', [])),
                              'stop' === q
                                ? (g(d) &&
                                    g(d).tweensContainer &&
                                    f !== !1 &&
                                    m.each(g(d).tweensContainer, function(
                                      a,
                                      b
                                    ) {
                                      b.endValue = b.currentValue
                                    }),
                                  D.push(a))
                                : ('finish' === q || 'finishAll' === q) &&
                                  (b[2].duration = 1))
                          })
                        : !0
                    })
                }),
                'stop' === q &&
                  (m.each(D, function(a, b) {
                    l(b, !0)
                  }),
                  B.promise && B.resolver(o)),
                a()
              )
            default:
              if (!m.isPlainObject(q) || p.isEmptyObject(q)) {
                if (p.isString(q) && t.Redirects[q]) {
                  var E = m.extend({}, s),
                    F = E.duration,
                    G = E.delay || 0
                  return (
                    E.backwards === !0 && (o = m.extend(!0, [], o).reverse()),
                    m.each(o, function(a, b) {
                      parseFloat(E.stagger)
                        ? (E.delay = G + parseFloat(E.stagger) * a)
                        : p.isFunction(E.stagger) &&
                          (E.delay = G + E.stagger.call(b, a, x)),
                        E.drag &&
                          ((E.duration =
                            parseFloat(F) ||
                            (/^(callout|transition)/.test(q) ? 1e3 : r)),
                          (E.duration = Math.max(
                            E.duration *
                              (E.backwards ? 1 - a / x : (a + 1) / x),
                            0.75 * E.duration,
                            200
                          ))),
                        t.Redirects[q].call(
                          b,
                          b,
                          E || {},
                          a,
                          x,
                          o,
                          B.promise ? B : d
                        )
                    }),
                    a()
                  )
                }
                var H =
                  'Velocity: First argument (' +
                  q +
                  ') was not a property map, a known action, or a registered redirect. Aborting.'
                return (
                  B.promise ? B.rejecter(new Error(H)) : console.log(H), a()
                )
              }
              C = 'start'
          }
          var I = {
              lastParent: null,
              lastPosition: null,
              lastFontSize: null,
              lastPercentToPxWidth: null,
              lastPercentToPxHeight: null,
              lastEmToPx: null,
              remToPx: null,
              vwToPx: null,
              vhToPx: null
            },
            J = []
          m.each(o, function(a, b) {
            p.isNode(b) && e.call(b)
          })
          var K,
            E = m.extend({}, t.defaults, s)
          if (((E.loop = parseInt(E.loop)), (K = 2 * E.loop - 1), E.loop))
            for (var L = 0; K > L; L++) {
              var M = { delay: E.delay, progress: E.progress }
              L === K - 1 &&
                ((M.display = E.display),
                (M.visibility = E.visibility),
                (M.complete = E.complete)),
                w(o, 'reverse', M)
            }
          return a()
        }
      }
      ;(t = m.extend(w, t)), (t.animate = w)
      var x = b.requestAnimationFrame || o
      return (
        t.State.isMobile ||
          c.hidden === d ||
          c.addEventListener('visibilitychange', function() {
            c.hidden
              ? ((x = function(a) {
                  return setTimeout(function() {
                    a(!0)
                  }, 16)
                }),
                k())
              : (x = b.requestAnimationFrame || o)
          }),
        (a.Velocity = t),
        a !== b && ((a.fn.velocity = w), (a.fn.velocity.defaults = t.defaults)),
        m.each(['Down', 'Up'], function(a, b) {
          t.Redirects['slide' + b] = function(a, c, e, f, g, h) {
            var i = m.extend({}, c),
              j = i.begin,
              k = i.complete,
              l = {
                height: '',
                marginTop: '',
                marginBottom: '',
                paddingTop: '',
                paddingBottom: ''
              },
              n = {}
            i.display === d &&
              (i.display =
                'Down' === b
                  ? 'inline' === t.CSS.Values.getDisplayType(a)
                    ? 'inline-block'
                    : 'block'
                  : 'none'),
              (i.begin = function() {
                j && j.call(g, g)
                for (var c in l) {
                  n[c] = a.style[c]
                  var d = t.CSS.getPropertyValue(a, c)
                  l[c] = 'Down' === b ? [d, 0] : [0, d]
                }
                ;(n.overflow = a.style.overflow), (a.style.overflow = 'hidden')
              }),
              (i.complete = function() {
                for (var b in n) a.style[b] = n[b]
                k && k.call(g, g), h && h.resolver(g)
              }),
              t(a, l, i)
          }
        }),
        m.each(['In', 'Out'], function(a, b) {
          t.Redirects['fade' + b] = function(a, c, e, f, g, h) {
            var i = m.extend({}, c),
              j = { opacity: 'In' === b ? 1 : 0 },
              k = i.complete
            ;(i.complete =
              e !== f - 1
                ? (i.begin = null)
                : function() {
                    k && k.call(g, g), h && h.resolver(g)
                  }),
              i.display === d && (i.display = 'In' === b ? 'auto' : 'none'),
              t(this, j, i)
          }
        }),
        t
      )
    })(window.jQuery || window.Zepto || window, window, document)
  })

/**
 * @license addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
 * https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
 *
 * sounisi5011 version:
 * http://qiita.com/sounisi5011/items/a8fc80e075e4f767b79a#11
 */
!(function(e, t, n) {
  if (
    (!e.addEventListener || !e.removeEventListener) &&
    e.attachEvent &&
    e.detachEvent
  ) {
    var r = function(e) {
        return 'function' == typeof e
      },
      a = function(e, t) {
        var r = t[n]
        if (r)
          for (var a, i = r.length; i--; )
            if (((a = r[i]), a[0] === e)) return a[1]
      },
      i = function(e, t, r) {
        var i = t[n] || (t[n] = [])
        return a(e, t) || ((i[i.length] = [e, r]), r)
      },
      o = function(e) {
        var n = t[e]
        t[e] = function(e) {
          return u(n(e))
        }
      },
      v = function(n, a) {
        if (r(a)) {
          var o = this
          o.attachEvent(
            'on' + n,
            i(o, a, function(n) {
              ;(n = n || e.event),
                (n.preventDefault =
                  n.preventDefault ||
                  function() {
                    n.returnValue = !1
                  }),
                (n.stopPropagation =
                  n.stopPropagation ||
                  function() {
                    n.cancelBubble = !0
                  }),
                (n.target = n.target || n.srcElement || t.documentElement),
                (n.currentTarget = n.currentTarget || o),
                (n.timeStamp = n.timeStamp || new Date().getTime()),
                a.call(o, n)
            })
          )
        }
      },
      c = function(e, t) {
        if (r(t)) {
          var n = this,
            i = a(n, t)
          i && n.detachEvent('on' + e, i)
        }
      },
      u = function(e) {
        var t = e.length
        if (t)
          for (; t--; )
            (e[t].addEventListener = v), (e[t].removeEventListener = c)
        else (e.addEventListener = v), (e.removeEventListener = c)
        return e
      }
    if ((u([t, e]), 'Element' in e)) {
      var f = e.Element
      ;(f.prototype.addEventListener = v), (f.prototype.removeEventListener = c)
    } else
      t.attachEvent('onreadystatechange', function() {
        u(t.all)
      }),
        o('getElementsByTagName'),
        o('getElementById'),
        o('createElement'),
        u(t.all)
  }
})(window, document, 'x-ms-event-listeners')

/*!
 * selectivizr v1.0.2 - (c) Keith Clark, freely distributable under the terms of the MIT license.
 * selectivizr.com
 */
;(function(j) {
  function A(a) {
    return a.replace(B, h).replace(C, function(a, d, b) {
      for (var a = b.split(','), b = 0, e = a.length; b < e; b++) {
        var s = D(a[b].replace(E, h).replace(F, h)) + o,
          l = []
        a[b] = s.replace(G, function(a, b, c, d, e) {
          if (b) {
            if (l.length > 0) {
              var a = l,
                f,
                e = s.substring(0, e).replace(H, i)
              if (e == i || e.charAt(e.length - 1) == o) e += '*'
              try {
                f = t(e)
              } catch (k) {}
              if (f) {
                e = 0
                for (c = f.length; e < c; e++) {
                  for (
                    var d = f[e], h = d.className, j = 0, m = a.length;
                    j < m;
                    j++
                  ) {
                    var g = a[j]
                    if (
                      !RegExp('(^|\\s)' + g.className + '(\\s|$)').test(
                        d.className
                      ) &&
                      g.b &&
                      (g.b === !0 || g.b(d) === !0)
                    )
                      h = u(h, g.className, !0)
                  }
                  d.className = h
                }
              }
              l = []
            }
            return b
          } else {
            if (
              (b = c
                ? I(c)
                : !v || v.test(d)
                ? { className: w(d), b: !0 }
                : null)
            )
              return l.push(b), '.' + b.className
            return a
          }
        })
      }
      return d + a.join(',')
    })
  }
  function I(a) {
    var c = !0,
      d = w(a.slice(1)),
      b = a.substring(0, 5) == ':not(',
      e,
      f
    b && (a = a.slice(5, -1))
    var l = a.indexOf('(')
    l > -1 && (a = a.substring(0, l))
    if (a.charAt(0) == ':')
      switch (a.slice(1)) {
        case 'root':
          c = function(a) {
            return b ? a != p : a == p
          }
          break
        case 'target':
          if (m == 8) {
            c = function(a) {
              function c() {
                var d = location.hash,
                  e = d.slice(1)
                return b ? d == i || a.id != e : d != i && a.id == e
              }
              k(j, 'hashchange', function() {
                g(a, d, c())
              })
              return c()
            }
            break
          }
          return !1
        case 'checked':
          c = function(a) {
            J.test(a.type) &&
              k(a, 'propertychange', function() {
                event.propertyName == 'checked' && g(a, d, a.checked !== b)
              })
            return a.checked !== b
          }
          break
        case 'disabled':
          b = !b
        case 'enabled':
          c = function(c) {
            if (K.test(c.tagName))
              return (
                k(c, 'propertychange', function() {
                  event.propertyName == '$disabled' && g(c, d, c.a === b)
                }),
                q.push(c),
                (c.a = c.disabled),
                c.disabled === b
              )
            return a == ':enabled' ? b : !b
          }
          break
        case 'focus':
          ;(e = 'focus'), (f = 'blur')
        case 'hover':
          e || ((e = 'mouseenter'), (f = 'mouseleave'))
          c = function(a) {
            k(a, b ? f : e, function() {
              g(a, d, !0)
            })
            k(a, b ? e : f, function() {
              g(a, d, !1)
            })
            return b
          }
          break
        default:
          if (!L.test(a)) return !1
      }
    return { className: d, b: c }
  }
  function w(a) {
    return (
      M +
      '-' +
      (m == 6 && N
        ? O++
        : a.replace(P, function(a) {
            return a.charCodeAt(0)
          }))
    )
  }
  function D(a) {
    return a.replace(x, h).replace(Q, o)
  }
  function g(a, c, d) {
    var b = a.className,
      c = u(b, c, d)
    if (c != b) (a.className = c), (a.parentNode.className += i)
  }
  function u(a, c, d) {
    var b = RegExp('(^|\\s)' + c + '(\\s|$)'),
      e = b.test(a)
    return d ? (e ? a : a + o + c) : e ? a.replace(b, h).replace(x, h) : a
  }
  function k(a, c, d) {
    a.attachEvent('on' + c, d)
  }
  function r(a, c) {
    if (/^https?:\/\//i.test(a))
      return c.substring(0, c.indexOf('/', 8)) ==
        a.substring(0, a.indexOf('/', 8))
        ? a
        : null
    if (a.charAt(0) == '/') return c.substring(0, c.indexOf('/', 8)) + a
    var d = c.split(/[?#]/)[0]
    a.charAt(0) != '?' &&
      d.charAt(d.length - 1) != '/' &&
      (d = d.substring(0, d.lastIndexOf('/') + 1))
    return d + a
  }
  function y(a) {
    if (a)
      return (
        n.open('GET', a, !1),
        n.send(),
        (n.status == 200 ? n.responseText : i)
          .replace(R, i)
          .replace(S, function(c, d, b, e, f) {
            return y(r(b || f, a))
          })
          .replace(T, function(c, d, b) {
            d = d || i
            return ' url(' + d + r(b, a) + d + ') '
          })
      )
    return i
  }
  function U() {
    var a, c
    a = f.getElementsByTagName('BASE')
    for (
      var d = a.length > 0 ? a[0].href : f.location.href, b = 0;
      b < f.styleSheets.length;
      b++
    )
      if (((c = f.styleSheets[b]), c.href != i && (a = r(c.href, d))))
        c.cssText = A(y(a))
    q.length > 0 &&
      setInterval(function() {
        for (var a = 0, c = q.length; a < c; a++) {
          var b = q[a]
          if (b.disabled !== b.a)
            b.disabled
              ? ((b.disabled = !1), (b.a = !0), (b.disabled = !0))
              : (b.a = b.disabled)
        }
      }, 250)
  }
  if (!(/*@cc_on!@*/ true)) {
    var f = document,
      p = f.documentElement,
      n = (function() {
        if (j.XMLHttpRequest) return new XMLHttpRequest()
        try {
          return new ActiveXObject('Microsoft.XMLHTTP')
        } catch (a) {
          return null
        }
      })(),
      m = /MSIE (\d+)/.exec(navigator.userAgent)[1]
    if (!(f.compatMode != 'CSS1Compat' || m < 6 || m > 8 || !n)) {
      var z = {
          NW: '*.Dom.select',
          MooTools: '$$',
          DOMAssistant: '*.$',
          Prototype: '$$',
          YAHOO: '*.util.Selector.query',
          Sizzle: '*',
          jQuery: '*',
          dojo: '*.query'
        },
        t,
        q = [],
        O = 0,
        N = !0,
        M = 'slvzr',
        R = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*/g,
        S = /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))[^;]*;/g,
        T = /\burl\(\s*(["']?)(?!data:)([^"')]+)\1\s*\)/g,
        L = /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/,
        B = /:(:first-(?:line|letter))/g,
        C = /(^|})\s*([^\{]*?[\[:][^{]+)/g,
        G = /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g,
        H = /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g,
        P = /[^\w-]/g,
        K = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/,
        J = /^(checkbox|radio)$/,
        v = m > 6 ? /[\$\^*]=(['"])\1/ : null,
        E = /([(\[+~])\s+/g,
        F = /\s+([)\]+~])/g,
        Q = /\s+/g,
        x = /^\s*((?:[\S\s]*\S)?)\s*$/,
        i = '',
        o = ' ',
        h = '$1'
      ;(function(a, c) {
        function d() {
          try {
            p.doScroll('left')
          } catch (a) {
            setTimeout(d, 50)
            return
          }
          b('poll')
        }
        function b(d) {
          if (
            !(d.type == 'readystatechange' && f.readyState != 'complete') &&
            ((d.type == 'load' ? a : f).detachEvent('on' + d.type, b, !1),
            !e && (e = !0))
          )
            c.call(a, d.type || d)
        }
        var e = !1,
          g = !0
        if (f.readyState == 'complete') c.call(a, i)
        else {
          if (f.createEventObject && p.doScroll) {
            try {
              g = !a.frameElement
            } catch (h) {}
            g && d()
          }
          k(f, 'readystatechange', b)
          k(a, 'load', b)
        }
      })(j, function() {
        for (var a in z) {
          var c,
            d,
            b = j
          if (j[a]) {
            for (
              c = z[a].replace('*', a).split('.');
              (d = c.shift()) && (b = b[d]);

            );
            if (typeof b == 'function') {
              t = b
              U()
              break
            }
          }
        }
      })
    }
  }
})(this)

/*!
 * JavaScript Cookie v2.1.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    var OldCookies = window.Cookies
    var api = (window.Cookies = factory())
    api.noConflict = function() {
      window.Cookies = OldCookies
      return api
    }
  }
})(function() {
  function extend() {
    var i = 0
    var result = {}
    for (; i < arguments.length; i++) {
      var attributes = arguments[i]
      for (var key in attributes) {
        result[key] = attributes[key]
      }
    }
    return result
  }

  function init(converter) {
    function api(key, value, attributes) {
      var result
      if (typeof document === 'undefined') {
        return
      }

      // Write

      if (arguments.length > 1) {
        attributes = extend(
          {
            path: '/'
          },
          api.defaults,
          attributes
        )

        if (typeof attributes.expires === 'number') {
          var expires = new Date()
          expires.setMilliseconds(
            expires.getMilliseconds() + attributes.expires * 864e5
          )
          attributes.expires = expires
        }

        try {
          result = JSON.stringify(value)
          if (/^[\{\[]/.test(result)) {
            value = result
          }
        } catch (e) {}

        if (!converter.write) {
          value = encodeURIComponent(String(value)).replace(
            /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
            decodeURIComponent
          )
        } else {
          value = converter.write(value, key)
        }

        key = encodeURIComponent(String(key))
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
        key = key.replace(/[\(\)]/g, escape)

        return (document.cookie = [
          key,
          '=',
          value,
          attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
          attributes.path && '; path=' + attributes.path,
          attributes.domain && '; domain=' + attributes.domain,
          attributes.secure ? '; secure' : ''
        ].join(''))
      }

      // Read

      if (!key) {
        result = {}
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling "get()"
      var cookies = document.cookie ? document.cookie.split('; ') : []
      var rdecode = /(%[0-9A-Z]{2})+/g
      var i = 0

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=')
        var name = parts[0].replace(rdecode, decodeURIComponent)
        var cookie = parts.slice(1).join('=')

        if (cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1)
        }

        try {
          cookie = converter.read
            ? converter.read(cookie, name)
            : converter(cookie, name) ||
              cookie.replace(rdecode, decodeURIComponent)

          if (this.json) {
            try {
              cookie = JSON.parse(cookie)
            } catch (e) {}
          }

          if (key === name) {
            result = cookie
            break
          }

          if (!key) {
            result[name] = cookie
          }
        } catch (e) {}
      }

      return result
    }

    api.set = api
    api.get = function(key) {
      return api(key)
    }
    api.getJSON = function() {
      return api.apply(
        {
          json: true
        },
        [].slice.call(arguments)
      )
    }
    api.defaults = {}

    api.remove = function(key, attributes) {
      api(
        key,
        '',
        extend(attributes, {
          expires: -1
        })
      )
    }

    api.withConverter = init

    return api
  }

  return init(function() {})
})

/* ============================================================================
 * honto：書店、通販、電子書籍のハイブリッド総合書店
/* ============================================================================ */
!(function(modules) {
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports
    var module = (installedModules[moduleId] = {
      exports: {},
      id: moduleId,
      loaded: !1
    })
    return (
      modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ),
      (module.loaded = !0),
      module.exports
    )
  }
  var installedModules = {}
  return (
    (__webpack_require__.m = modules),
    (__webpack_require__.c = installedModules),
    (__webpack_require__.p = ''),
    __webpack_require__(0)
  )
})([
  function(module, exports, __webpack_require__) {
    'use strict'
    var _d = __webpack_require__(1),
      Statics = __webpack_require__(2),
      MouseEvent = __webpack_require__(3),
      Header = __webpack_require__(4),
      BookDetail = __webpack_require__(10),
      BookItem = __webpack_require__(13),
      Accordion = __webpack_require__(14),
      ForceBtn = __webpack_require__(16),
      Carousel = __webpack_require__(17),
      LineClamper = __webpack_require__(20),
      stAccMenu = __webpack_require__(21),
      BookJadge = __webpack_require__(22),
      ClipSelect = __webpack_require__(23),
      RecommendBook = __webpack_require__(24),
      TimeLine = __webpack_require__(25),
      Selection = __webpack_require__(28),
      BookShelf = __webpack_require__(29),
      GenreNavi = __webpack_require__(30),
      BookShelfLiquid = __webpack_require__(32),
      StBoxStore = __webpack_require__(34),
      MoreAccordion = __webpack_require__(35),
      JapanMap = __webpack_require__(36),
      BookTreeCarousel = __webpack_require__(37),
      BookTreeDetailCarousel = __webpack_require__(38),
      PullDown = __webpack_require__(39),
      CouponDetailAccordion = __webpack_require__(40),
      HdgSearch = __webpack_require__(41)
    if (
      ((window.requestAnimFrame = (function() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            return window.setTimeout(callback, 1e3 / 60)
          }
        )
      })()),
      (window.cancelAnimFrame = (function() {
        return (
          window.cancelAnimationFrame ||
          window.cancelRequestAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.webkitCancelRequestAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.mozCancelRequestAnimationFrame ||
          window.msCancelAnimationFrame ||
          window.msCancelRequestAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.oCancelRequestAnimationFrame ||
          function(id) {
            window.clearTimeout(id)
          }
        )
      })()),
      (window._userAgent = window.navigator.userAgent.toLowerCase()),
      (window._appVersion = window.navigator.appVersion.toLowerCase()),
      (window._isLegacy = !1),
      window._userAgent.indexOf('msie') != -1)
    ) {
      if (
        window._appVersion.indexOf('msie 6.') != -1 ||
        window._appVersion.indexOf('msie 7.') != -1 ||
        window._appVersion.indexOf('msie 8.') != -1 ||
        window._appVersion.indexOf('msie 9.') != -1
      ) {
        var _prefix_timeStamp = document
            .getElementsByTagName('head')[0]
            .getElementsByTagName('link'),
          i = 0,
          _ts_prefix = ''
        for (i = 0; i < _prefix_timeStamp.length; i++)
          _prefix_timeStamp[i].getAttribute('href').indexOf('import') >= 0 &&
            (_ts_prefix +=
              '?' + _prefix_timeStamp[i].getAttribute('href').split('?')[1])
        var cssPath,
          _splitStyleSheet = document.createElement('link'),
          domain = location.hostname
        ;(cssPath =
          'honto.jp' !== domain
            ? '//honto.jp/library/css/pc/import2.css'
            : '/library/css/pc/import2.css'),
          _splitStyleSheet.setAttribute('rel', 'stylesheet'),
          _splitStyleSheet.setAttribute('href', cssPath + _ts_prefix),
          document.getElementsByTagName('head')[0].appendChild(_splitStyleSheet)
      }
      window._userAgent.indexOf('msie') != -1 &&
        (window._appVersion.indexOf('msie 6.') != -1
          ? (Statics.IS_LEGACY = !0)
          : window._appVersion.indexOf('msie 7.') != -1
          ? (Statics.IS_LEGACY = !0)
          : window._appVersion.indexOf('msie 8.') != -1
          ? (Statics.IS_LEGACY = !0)
          : window._appVersion.indexOf('msie 9.') != -1 &&
            (Statics.IS_LEGACY = !0))
    }
    var Main = (function() {
      function Main() {
        var _this = this
        ;(this.jadgeTouchEvent = function() {
          if (
            ((MouseEvent.MOUSE_DOWN =
              'ontouchstart' in window ? 'touchstart' : 'mousedown'),
            (MouseEvent.MOUSE_UP =
              'ontouchend' in window ? 'touchend' : 'mouseup'),
            (MouseEvent.MOUSE_MOVE =
              'ontouchmove' in window ? 'touchmove' : 'mousemove'),
            (Statics.HAS_TOUCH = 'tablet' === _this.getDevice()),
            Statics.HAS_TOUCH)
          ) {
            var viewport = document.createElement('meta')
            viewport.setAttribute('name', 'viewport'),
              viewport.setAttribute('content', 'width=1084'),
              document.head.appendChild(viewport)
          }
        }),
          (this.getDevice = function() {
            var ua = navigator.userAgent
            return ua.indexOf('iPhone') > 0 ||
              ua.indexOf('iPod') > 0 ||
              (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)
              ? 'sp'
              : ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0
              ? 'tablet'
              : 'other'
          }),
          (this.getIE = function() {
            return (
              'Microsoft Internet Explorer' == navigator.appName ||
              ('Netscape' == navigator.appName &&
                navigator.appVersion.indexOf('Trident') > -1)
            )
          }),
          (this.getChrome = function() {
            return !!navigator.appVersion.indexOf('Chrome')
          }),
          (this.addCoreElements = function() {
            var i = 0,
              _header = document.querySelectorAll('.stHeader')
            for (i = 0; i < _header.length; i++) new Header(_header[i])
            var _carousel = document.querySelectorAll('.stCorusel01')
            for (i = 0; i < _carousel.length; i++) new Carousel(_carousel[i])
            var _forcebtn = document.querySelectorAll('.stBtn')
            for (i = 0; i < _forcebtn.length; i++) new ForceBtn(_forcebtn[i])
          }),
          (this.addSubModules = function() {
            var i = 0,
              _store01 = document.querySelectorAll('.stBoxStore01')
            for (i = 0; i < _store01.length; i++) new StBoxStore(_store01[i])
            var _store02 = document.querySelectorAll('.stBoxStore02')
            for (i = 0; i < _store02.length; i++) new StBoxStore(_store02[i])
            var _map = document.querySelectorAll('.stMap01')
            for (i = 0; i < _map.length; i++) new JapanMap(_map[i])
            var _moreAccordion = document.querySelectorAll('.stMoreAccordion')
            for (i = 0; i < _moreAccordion.length; i++)
              new MoreAccordion(_moreAccordion[i])
            var _selection = document.querySelectorAll('.stSelectionViewer01')
            for (i = 0; i < _selection.length; i++) new Selection(_selection[i])
            var _timeline = document.querySelectorAll('.stBookTimeLine01')
            for (i = 0; i < _timeline.length; i++) new TimeLine(_timeline[i])
            var _product1 = document.querySelectorAll('.stBookDetail01')
            for (i = 0; i < _product1.length; i++) new BookDetail(_product1[i])
            var _accordion = document.querySelectorAll('[class*=stAccordion0]')
            for (i = 0; i < _accordion.length; i++) new Accordion(_accordion[i])
            var _recommend = document.querySelectorAll('.stRecommendBook01')
            for (i = 0; i < _recommend.length; i++)
              new RecommendBook(_recommend[i])
            var _item = document.querySelectorAll('.stBookItem')
            for (i = 0; i < _item.length; i++) new BookItem(_item[i])
            var _genreNavi = document.querySelectorAll('.genreNavi')
            for (i = 0; i < _genreNavi.length; i++) new GenreNavi(_genreNavi[i])
            var _accMenu = document.querySelectorAll("[class*='stAccMenu']")
            for (i = 0; i < _accMenu.length; i++) new stAccMenu(_accMenu[i])
            var _details = document.querySelectorAll('[class*=stProduct0]')
            for (i = 0; i < _details.length; i++) new BookJadge(_details[i])
            var _bookShelf03 = document.querySelectorAll('.stShelf03')
            for (i = 0; i < _bookShelf03.length; i++)
              new BookShelfLiquid(_bookShelf03[i])
            var _clipSelect = document.querySelectorAll('.stClipSelect')
            for (i = 0; i < _clipSelect.length; i++)
              new ClipSelect(_clipSelect[i])
            var _storeNews = document.querySelector('.stStoreNews01'),
              _footer = document.querySelector('.stFooter')
            _storeNews &&
              (_d.addClass(_footer, 'stBranch01'),
              (document.getElementById('footerArea').style.marginTop =
                '-100px'))
            var _pullDown = document.querySelectorAll('.stPullDown01')
            for (i = 0; i < _pullDown.length; i++) new PullDown(_pullDown[i])
            var _booktreeCarousel = document.querySelectorAll(
              '.stBookTreeCarousel01'
            )
            for (i = 0; i < _booktreeCarousel.length; i++)
              new BookTreeCarousel(_booktreeCarousel[i])
            var _booktreeCarousel2 = document.querySelectorAll(
              '.stBookTreeCarousel02'
            )
            for (i = 0; i < _booktreeCarousel2.length; i++)
              new BookTreeCarousel(_booktreeCarousel2[i])
            var _booktreeCarousel3 = document.querySelectorAll(
              '.stBookTreeCarousel03'
            )
            for (i = 0; i < _booktreeCarousel3.length; i++)
              new BookTreeDetailCarousel(
                _booktreeCarousel3[i].querySelector('.stContents')
              )
            var _couponDetailAccordion = document.querySelectorAll(
              '.coupon-detail-accordion'
            )
            for (i = 0; i < _couponDetailAccordion.length; i++)
              new CouponDetailAccordion(_couponDetailAccordion[i])
            var _hdgSearch = document.querySelectorAll('.stHdgSearch')
            for (i = 0; i < _hdgSearch.length; i++)
              new HdgSearch(_hdgSearch[i], !1)
          }),
          (this.getIE() || this.getChrome()) &&
            jQuery(window).on('click', '.stOverview a[href^=#]', function() {
              var href = jQuery(this).attr('href'),
                target = jQuery('#' == href || '' == href ? 'html' : href),
                position = target.offset().top
              return (
                jQuery('html, body').animate(
                  { scrollTop: position },
                  0,
                  'swing'
                ),
                !1
              )
            }),
          this.jadgeTouchEvent(),
          this.addCoreElements(),
          this.addSubModules()
      }
      return Main
    })()
    jQuery(function() {
      window.jQuery && (window.Velocity = window.jQuery.fn.velocity)
      var _div = document.createElement('div')
      ;(Statics.HAS_CSS = 'string' == typeof _div.style.transform),
        Statics.HAS_CSS ||
          (Statics.HAS_CSS = 'string' == typeof _div.style['-ms-transform']),
        void 0 == _div.innerText &&
          Object.defineProperty(HTMLElement.prototype, 'innerText', {
            get: function() {
              return this.textContent
            },
            set: function(v) {
              this.textContent = v
            }
          }),
        jQuery(window).on('ajaxLoad', function(e, container) {
          var _carousel = container.querySelectorAll('.stCorusel01')
          for (i = 0; i < _carousel.length; i++) new Carousel(_carousel[i])
          var _item = container.querySelectorAll('.stBookItem'),
            _bookShelf = container.querySelector('.stShelf02')
          for (i = 0; i < _item.length; i++) new BookItem(_item[i])
          if (_bookShelf)
            if (navigator.userAgent.indexOf('CriOS') >= 0)
              for (
                var imgLength = _bookShelf.querySelectorAll('img').length,
                  loadCount = 0,
                  i = 0;
                i < imgLength;
                i++
              )
                _bookShelf
                  .querySelectorAll('img')
                  [i].addEventListener('load', function() {
                    loadCount++,
                      loadCount == imgLength &&
                        new BookShelf(_bookShelf).onResizeHD()
                  })
            else
              _bookShelf.querySelector('img').addEventListener(
                'load',
                function() {
                  new BookShelf(_bookShelf).onResizeHD()
                },
                !1
              )
          var _details = container.querySelectorAll('[class*=stProduct0]')
          for (i = 0; i < _details.length; i++) new BookJadge(_details[i])
          var _forcebtn = container.querySelectorAll('.stBtn')
          for (i = 0; i < _forcebtn.length; i++) new ForceBtn(_forcebtn[i])
          var _booktreeCarousel = container.querySelectorAll(
            '.stBookTreeCarousel01'
          )
          for (i = 0; i < _booktreeCarousel.length; i++)
            new BookTreeCarousel(_booktreeCarousel[i])
          var _booktreeCarousel2 = container.querySelectorAll(
            '.stBookTreeCarousel02'
          )
          for (i = 0; i < _booktreeCarousel2.length; i++)
            new BookTreeCarousel(_booktreeCarousel2[i])
          var _booktreeCarousel3 = container.querySelectorAll(
            '.stBookTreeCarousel03'
          )
          for (i = 0; i < _booktreeCarousel3.length; i++)
            new BookTreeDetailCarousel(
              _booktreeCarousel3[i].querySelector('.stContents')
            )
          var i = 0,
            _lineClamp = document.querySelectorAll('.stLineClamp')
          for (i = 0; i < _lineClamp.length; i++) new LineClamper(_lineClamp[i])
          var _hdgSearch = document.querySelectorAll('.stHdgSearch')
          for (i = 0; i < _hdgSearch.length; i++)
            new HdgSearch(_hdgSearch[i], !0)
        }),
        new Main()
    }),
      (window.onload = function() {
        var i = 0,
          _lineClamp = document.querySelectorAll('.stLineClamp')
        for (i = 0; i < _lineClamp.length; i++) new LineClamper(_lineClamp[i])
      }),
      (module.exports = Main)
  },
  function(module, exports) {
    'use strict'
    var _s = (function() {
      function _s() {}
      return (
        (_s.addClass = function(_elem, _class) {
          _elem.classList
            ? _elem.classList.add(_class)
            : (_elem.className += ' ' + _class)
        }),
        (_s.removeClass = function(_elem, _class) {
          _elem.classList
            ? _elem.classList.remove(_class)
            : (_elem.className = _elem.className.replace(
                new RegExp(
                  '(^|\\b)' + _class.split(' ').join('|') + '(\\b|$)',
                  'gi'
                ),
                ' '
              ))
        }),
        (_s.hasClass = function(_elem, _className) {
          return _elem.classList
            ? _elem.classList.contains(_className)
            : new RegExp('(^| )' + _className + '( |$)', 'gi').test(
                _elem.className
              )
        }),
        _s
      )
    })()
    module.exports = _s
  },
  function(module, exports) {
    'use strict'
    var Statics = (function() {
      function Statics() {}
      return (
        (Statics.PREFIX = new Date().getTime()),
        (Statics.HAS_CSS = !0),
        (Statics.IS_LEGACY = !1),
        (Statics.HAS_TOUCH = !1),
        (Statics.TIMELINE = !0),
        (Statics.GENRENAVI = !1),
        (Statics.ACCORDION = !0),
        Statics
      )
    })()
    module.exports = Statics
  },
  function(module, exports) {
    'use strict'
    var MouseEvent = (function() {
      function MouseEvent() {}
      return (
        (MouseEvent.CLICK = 'click'),
        (MouseEvent.MOUSE_ENTER = 'mouseenter'),
        (MouseEvent.MOUSE_LEAVE = 'mouseleave'),
        (MouseEvent.MOUSE_DOWN = 'mousedown'),
        (MouseEvent.MOUSE_MOVE = 'mousemove'),
        (MouseEvent.MOUSE_UP = 'mouseup'),
        (MouseEvent.MOUSE_OVER = 'mouseover'),
        (MouseEvent.MOUSE_OUT = 'mouseout'),
        MouseEvent
      )
    })()
    module.exports = MouseEvent
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      Event = __webpack_require__(5),
      Ease = __webpack_require__(6),
      UserAgent = __webpack_require__(7),
      GlobalNavi = __webpack_require__(8),
      CheckBox = __webpack_require__(9),
      Header = (function() {
        function Header(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isShow = !1),
            (this._isPadding = !1),
            (this.onResizeHD = function() {
              document.body.clientWidth >= 1084 && !_this._isPadding
                ? ((_this._isPadding = !0),
                  _s.addClass(_this._header, 'stPadding'))
                : document.body.clientWidth < 1084 &&
                  _this._isPadding &&
                  ((_this._isPadding = !1),
                  _s.removeClass(_this._header, 'stPadding'))
            }),
            (this.fixMe = function() {
              ;(_this._node.style.display = 'none'),
                window.addEventListener(Event.SCROLL, _this.onScrollHD, !1)
            }),
            (this.onScrollHD = function() {
              var _top =
                (document.documentElement &&
                  document.documentElement.scrollTop) ||
                document.body.scrollTop
              _top >= 220 ? _this.show() : _this.hide()
            }),
            (this.show = function() {
              _this._isShow ||
                ((_this._isShow = !0),
                (_this._node.style.display = 'block'),
                Velocity(_this._node, 'stop'),
                Velocity(
                  _this._node,
                  { top: 0 },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                ))
            }),
            (this.hide = function() {
              _this._isShow &&
                ((_this._isShow = !1),
                Velocity(_this._node, 'stop'),
                Velocity(
                  _this._node,
                  { top: -90 },
                  {
                    duration: 500,
                    delay: 0,
                    easing: Ease.EaseOutCubic,
                    complete: _this.hideComplete
                  }
                ))
            }),
            (this.hideComplete = function() {
              _this._node.style.display = 'none'
            }),
            (this.jadgeCouponSize = function() {
              var _target = _this._header.querySelector('li.stCart')
              if (_target) {
                var _length = 0,
                  _num = _target.querySelectorAll('.stNum'),
                  i = 0
                for (i = 0; i < _num.length; i++)
                  _length = Math.max(_length, _num[i].innerText.length)
                _length > 2 && _s.addClass(_target, 'stMinify')
              }
            }),
            (this.jadgeTextSize = function() {
              var _target = _this._header.querySelector(
                'p.stPoint > span.stNum'
              )
              if (_target) {
                var _length = _target.innerText.length
                _length > 5 &&
                  _s.addClass(
                    _this._header.querySelector('p.stPoint'),
                    'stMinify'
                  )
              }
            }),
            (this.addGlobalNavigation = function() {
              var i = 0,
                _item = _this._header.querySelectorAll('.stHdNavItem')
              if (_item.length)
                for (i = 0; i < _item.length; i++) new GlobalNavi(_item[i])
            }),
            (this.addCheckBox = function() {
              var _checkBox = _this._header.querySelector('.stFormCheck')
              _checkBox && new CheckBox(_checkBox, _this._header)
            }),
            (this.removeIconHref = function() {
              var header = document.getElementsByClassName('stHeader')[0]
              if (header) {
                var icons = [
                    header.getElementsByClassName('stInfo')[0],
                    header.getElementsByClassName('stMyMenu')[0]
                  ],
                  removeChildHref = function(el) {
                    var a
                    el && (a = el.getElementsByTagName('a')[0]),
                      a && a.removeAttribute('href')
                  }
                icons.forEach(function(icon) {
                  removeChildHref(icon)
                })
              }
            }),
            (this._header = this._node),
            this.addGlobalNavigation(),
            this.addCheckBox(),
            UserAgent.isTablet && this.removeIconHref(),
            this.jadgeTextSize(),
            this.jadgeCouponSize(),
            _s.hasClass(this._header, 'stFixed') && this.fixMe(),
            window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
            this.onResizeHD()
        }
        return Header
      })()
    module.exports = Header
  },
  function(module, exports) {
    'use strict'
    var Event = (function() {
      function Event(type) {
        ;(this.type = type), (this.data = {}), (this.defaultPrevented = !1)
      }
      return (
        (Event.prototype.preventDefault = function() {
          this.defaultPrevented = !0
        }),
        (Event.COMPLETE = 'complete'),
        (Event.CONNECT = 'connect'),
        (Event.INIT = 'init'),
        (Event.CHANGE = 'change'),
        (Event.RESIZE = 'resize'),
        (Event.SCROLL = 'scroll'),
        (Event.REMOVED = 'removed'),
        (Event.SUCCESS = 'success'),
        (Event.ERROR = 'error'),
        (Event.IO_ERROR = 'error'),
        (Event.SCENE_CHANGE = 'scene_change'),
        Event
      )
    })()
    module.exports = Event
  },
  function(module, exports) {
    'use strict'
    var Ease
    !(function(Ease_1) {
      ;(Ease_1.Linear = 'linear'),
        (Ease_1.Ease = 'ease'),
        (Ease_1.Ease_IN = 'ease-in'),
        (Ease_1.Ease_OUT = 'ease-out'),
        (Ease_1.Ease_IN_OUT = 'ease-in-out'),
        (Ease_1.EaseInSine = 'easeInSine'),
        (Ease_1.EaseOutSine = 'easeOutSine'),
        (Ease_1.EaseInOutSine = 'easeInOutSine'),
        (Ease_1.EaseInQuad = 'easeInQuad'),
        (Ease_1.EaseOutQuad = 'easeOutQuad'),
        (Ease_1.EaseInOutQuad = 'easeInOutQuad'),
        (Ease_1.EaseInCubic = 'easeInCubic'),
        (Ease_1.EaseOutCubic = 'easeOutCubic'),
        (Ease_1.EaseInOutCubic = 'easeInOutCubic'),
        (Ease_1.EaseInQuart = 'easeInQuart'),
        (Ease_1.EaseOutQuart = 'easeOutQuart'),
        (Ease_1.EaseInOutQuart = 'easeInOutQuart'),
        (Ease_1.EaseInQuint = 'easeInQuint'),
        (Ease_1.EaseOutQuint = 'easeOutQuint'),
        (Ease_1.EaseInOutQuint = 'easeInOutQuint'),
        (Ease_1.EaseInExpo = 'easeInExpo'),
        (Ease_1.EaseOutExpo = 'easeOutExpo'),
        (Ease_1.EaseInOutExpo = 'easeInOutExpo'),
        (Ease_1.EaseInCirc = 'easeInCirc'),
        (Ease_1.EaseOutCirc = 'easeOutCirc'),
        (Ease_1.EaseInOutCirc = 'easeInOutCirc')
    })(Ease || (Ease = {})),
      (module.exports = Ease)
  },
  function(module, exports) {
    'use strict'
    var UserAgent = (function() {
      function UserAgent() {}
      return (
        Object.defineProperty(UserAgent, 'isIPad', {
          get: function() {
            var ua = navigator.userAgent.toLowerCase()
            return ua.indexOf('ipad') > -1
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(UserAgent, 'isAndroid', {
          get: function() {
            var ua = navigator.userAgent.toLowerCase()
            return ua.indexOf('android') > -1
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(UserAgent, 'isSP', {
          get: function() {
            var ua = navigator.userAgent.toLowerCase()
            return ua.indexOf('mobile') > -1
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(UserAgent, 'isAndroidTablet', {
          get: function() {
            return this.isAndroid && !this.isSP
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(UserAgent, 'isTablet', {
          get: function() {
            return this.isIPad || this.isAndroidTablet
          },
          enumerable: !0,
          configurable: !0
        }),
        UserAgent
      )
    })()
    module.exports = UserAgent
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var UserAgent = __webpack_require__(7),
      GlobalNavi = (function() {
        function GlobalNavi(_node) {
          var _this = this
          return (
            (this._node = _node),
            (this.addElem = function() {
              var anchor = _this._node.querySelector('a'),
                href = anchor.getAttribute('href')
              anchor.removeAttribute('href')
              var a = document.createElement('a')
              ;(a.innerHTML = anchor.querySelector('span').innerHTML),
                a.setAttribute('href', href),
                a.classList.add('header-sub-navigation__link')
              var li = document.createElement('li')
              li.appendChild(a)
              var ul = _this._subNav.querySelector('ul'),
                liElms = _this._subNav.querySelectorAll('li')
              ul.insertBefore(li, liElms[0])
            }),
            (this._subNav = this._node.querySelector('.stHdSubNav')),
            this._subNav
              ? void (UserAgent.isTablet && this.addElem())
              : void (this._node = void 0)
          )
        }
        return GlobalNavi
      })()
    module.exports = GlobalNavi
  },
  function(module, exports) {
    'use strict'
    var CheckBox = (function() {
      function CheckBox(_node, _header) {
        var _this = this
        ;(this._node = _node),
          (this._checkState = [!0, !0]),
          (this.onChangeHD = function(e) {
            e.currentTarget === _this._ebBtn
              ? (_this._checkState[0] = !_this._checkState[0])
              : (_this._checkState[1] = !_this._checkState[1]),
              _this._checkState[0] ||
                _this._checkState[1] ||
                (e.currentTarget === _this._ebBtn
                  ? (_this._checkState[1] = !0)
                  : (_this._checkState[0] = !0),
                _this._checkState[0] && (_this._ebBtn.checked = !0),
                _this._checkState[1] && (_this._nsBtn.checked = !0)),
              _this._checkState[1]
                ? (_this._form.setAttribute(
                    'action',
                    _this._formAction.replace('ebook', 'netstore')
                  ),
                  _this._form.setAttribute(
                    'onsubmit',
                    _this._formSubmit.replace('ebook', 'netstore')
                  ),
                  _this._tbty && (_this._tbty.value = 1))
                : !_this._checkState[1] &&
                  _this._checkState[0] &&
                  (_this._form.setAttribute(
                    'action',
                    _this._formAction.replace('netstore', 'ebook')
                  ),
                  _this._form.setAttribute(
                    'onsubmit',
                    _this._formSubmit.replace('netstore', 'ebook')
                  ),
                  _this._tbty && (_this._tbty.value = 0)),
              _this._checkState[1] &&
                _this._checkState[0] &&
                _this._tbty &&
                (_this._tbty.value = 0)
          }),
          (this._wordSch = _header.querySelector('.stHdWordSch')),
          (this._form = this._wordSch.getElementsByTagName('form')[0]),
          this._form &&
            ((this._tbty = this._form.tbty),
            (this._formAction = this._form.getAttribute('action')),
            (this._formSubmit = this._form.getAttribute('onsubmit'))),
          (this._ebBtn = this._node.querySelector('.stEbBtn')),
          (this._nsBtn = this._node.querySelector('.stNsBtn')),
          (this._checkState[0] = this._ebBtn.checked),
          (this._checkState[1] = this._nsBtn.checked),
          this._ebBtn.addEventListener('change', this.onChangeHD, !1),
          this._nsBtn.addEventListener('change', this.onChangeHD, !1)
      }
      return CheckBox
    })()
    module.exports = CheckBox
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Event = __webpack_require__(5),
      MouseEvent = __webpack_require__(3),
      Cart = __webpack_require__(11),
      SNS = __webpack_require__(12),
      _s = __webpack_require__(1),
      BookDetail = (function() {
        function BookDetail(_node) {
          var _this = this
          ;(this._node = _node),
            (this._currentIndex = 0),
            (this._dw = 265),
            (this._dh = 360),
            (this.changePhoto = function(e) {
              var _index = Array.prototype.indexOf.call(
                _this._thumbnails,
                e.currentTarget
              )
              if (_this._currentIndex !== _index) {
                ;(_this._currentIndex = _index),
                  (_this._photoArea.innerHTML = e.currentTarget.innerHTML)
                var i = 0
                for (i = 0; i < _this._thumbnails.length; i++)
                  i === _index
                    ? _s.addClass(_this._thumbnails[i], 'stCurrent')
                    : _s.removeClass(_this._thumbnails[i], 'stCurrent')
              }
            }),
            (this.onResizeHD = function() {
              _this._node.offsetWidth >= 1388
                ? _s.addClass(_this._node, 'stLong')
                : _s.removeClass(_this._node, 'stLong')
            }),
            (this._photoArea = this._node.querySelector('.stCover'))
          var i = 0,
            _cart = this._node.querySelectorAll('.stCart01')
          for (i = 0; i < _cart.length; i++) new Cart(_cart[i])
          var _sns = this._node.querySelectorAll('.stSns01')
          for (i = 0; i < _sns.length; i++) new SNS(_sns[i])
          for (
            this._thumbnails = this._node.querySelectorAll(
              '.stCoverList01 > li'
            ),
              i = 0;
            i < this._thumbnails.length;
            i++
          )
            this._thumbnails[i].addEventListener(
              MouseEvent.MOUSE_ENTER,
              this.changePhoto,
              !1
            )
          window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
            this.onResizeHD()
        }
        return BookDetail
      })()
    module.exports = BookDetail
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      Cart = (function() {
        function Cart(_node) {
          var _this = this
          ;(this._node = _node),
            (this._currentChecked = 0),
            (this._details = []),
            (this._radios = []),
            (this._headers = []),
            (this.changeItem = function(e) {
              _this._currentChecked = Array.prototype.indexOf.call(
                _this._headers,
                e.currentTarget
              )
              var i = 0
              for (i = 0; i < _this._details.length; i++)
                i === _this._currentChecked ? _this.show(i) : _this.hide(i)
            }),
            (this.show = function(_num) {
              var _target = _this._details[_num]
              ;(_this._radios[_num].checked = !0),
                _s.addClass(_this._headers[_num], 'stCurrent')
              var _toHeight = _target.querySelector('.stBlockInner')
                .offsetHeight
              Velocity(_target, 'stop'),
                Velocity(
                  _target,
                  { height: _toHeight },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function(_num) {
              var _target = _this._details[_num]
              ;(_this._radios[_num].checked = !1),
                _s.removeClass(_this._headers[_num], 'stCurrent'),
                Velocity(_target, 'stop'),
                Velocity(
                  _target,
                  { height: 0 },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this._details = this._node.querySelectorAll('.stContents')),
            (this._radios = this._node.querySelectorAll('input[type="radio"]')),
            (this._headers = this._node.querySelectorAll('.stHeading'))
          var i = 0,
            _checkedItem = 0
          for (i = 0; i < this._radios.length; i++)
            this._headers[i].addEventListener(
              MouseEvent.CLICK,
              this.changeItem,
              !1
            ),
              this._radios[i].checked &&
                ((_checkedItem = i), _s.addClass(this._headers[i], 'stCurrent'))
          this._details[_checkedItem].style.height = 'auto'
        }
        return Cart
      })()
    module.exports = Cart
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      SNS = (function() {
        function SNS(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this._listOpenWidth = 0),
            (this.toggleHD = function() {
              ;(_this._isOpen = !_this._isOpen),
                _this._isOpen ? _this.show() : _this.hide()
            }),
            (this.show = function() {
              _s.addClass(_this._trigger, 'stCurrent'),
                Velocity(_this._ul, 'stop'),
                Velocity(_this._node, 'stop'),
                Velocity(
                  _this._ul,
                  { width: _this._listOpenWidth },
                  { duration: 100, delay: 0, easing: Ease.EaseOutCubic }
                ),
                Velocity(
                  _this._node,
                  { width: _this._listOpenWidth },
                  { duration: 100, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function() {
              _s.removeClass(_this._trigger, 'stCurrent'),
                Velocity(_this._ul, 'stop'),
                Velocity(_this._node, 'stop'),
                Velocity(
                  _this._ul,
                  { width: 112 },
                  { duration: 100, delay: 0, easing: Ease.EaseOutCubic }
                ),
                Velocity(
                  _this._node,
                  { width: 112 },
                  { duration: 100, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.calcOpenListWidth = function(ul) {
              var list = ul.querySelectorAll('li'),
                listItem = list.item(0),
                listWidth = listItem.clientWidth,
                marginLeftValue = 0
              list.length > 1 &&
                (marginLeftValue = parseInt(
                  window
                    .getComputedStyle(list.item(1))
                    .getPropertyValue('margin-left')
                    .replace('px', '')
                ))
              var listOpenWidth = (listWidth + marginLeftValue) * list.length
              return listOpenWidth
            }),
            (this._ul = this._node.querySelector('ul')),
            (this._listOpenWidth = this.calcOpenListWidth(this._ul)),
            (this._trigger = this._node.querySelector('.stPlus')),
            this._trigger.addEventListener(MouseEvent.CLICK, this.toggleHD, !1)
        }
        return SNS
      })()
    module.exports = SNS
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      BookItem = (function() {
        function BookItem(_node) {
          var _this = this
          ;(this._node = _node),
            (this.CLICKHD = function(e) {
              _s.hasClass(_this._btn, 'stCurrent')
                ? _s.removeClass(_this._btn, 'stCurrent')
                : _s.addClass(_this._btn, 'stCurrent'),
                e.preventDefault()
            }),
            (this.overHD = function() {
              Statics.HAS_TOUCH ||
                (Velocity(_this._aTag, 'stop'),
                Velocity(
                  _this._aTag,
                  { opacity: 1 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                ),
                Velocity(_this._btn, 'stop'),
                Velocity(
                  _this._btn,
                  { right: 0, top: 0 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                ))
            }),
            (this.outHD = function() {
              Statics.HAS_TOUCH ||
                (Velocity(_this._aTag, 'stop'),
                Velocity(
                  _this._aTag,
                  { opacity: 0 },
                  { duration: 300, delay: 300, easing: Ease.EaseOutCubic }
                ),
                Velocity(_this._btn, 'stop'),
                Velocity(
                  _this._btn,
                  { right: -56, top: -56 },
                  { duration: 300, delay: 300, easing: Ease.EaseOutCubic }
                ))
            }),
            (this._aTag = this._node.getElementsByTagName('a')[0]),
            (this._btn = this._aTag.getElementsByTagName('span')[0]),
            this._btn &&
              (Velocity.hook(this._btn, 'right', '-56px'),
              Velocity.hook(this._btn, 'top', '-56px'),
              this._btn.insertAdjacentHTML('afterbegin', '<span></span>'),
              (this._hit = this._btn.getElementsByTagName('span')[0]),
              this._node.addEventListener(
                MouseEvent.MOUSE_ENTER,
                this.overHD,
                !1
              ),
              this._node.addEventListener(
                MouseEvent.MOUSE_LEAVE,
                this.outHD,
                !1
              ),
              this._hit.addEventListener(MouseEvent.CLICK, this.CLICKHD, !1))
        }
        return BookItem
      })()
    module.exports = BookItem
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      Cookie = __webpack_require__(15),
      Accordion = (function() {
        function Accordion(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this._isBookLife = !1),
            (this._isScrollTop = !0),
            (this.toggleHD = function() {
              ;(_this._isOpen = !_this._isOpen),
                _this._isOpen ? _this.show() : _this.hide()
            }),
            (this.hideHD = function() {
              ;(_this._isOpen = !1), _this.hide()
            }),
            (this.show = function() {
              ;(Statics.ACCORDION = !0), Cookie.setCookie()
              var _toHeight = _this._inner.offsetHeight
              ;(_this._spd = (1e3 * _toHeight) / 1500),
                _s.addClass(_this._trigger, 'stCurrent'),
                Velocity(_this._wrapper, 'stop'),
                Velocity(
                  _this._wrapper,
                  { height: _toHeight },
                  { duration: _this._spd, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function() {
              ;(Statics.ACCORDION = !1),
                Cookie.setCookie(),
                _s.removeClass(_this._trigger, 'stCurrent'),
                Velocity(_this._wrapper, 'stop'),
                Velocity(
                  _this._wrapper,
                  { height: 0 },
                  { duration: _this._spd, delay: 0, easing: Ease.EaseOutCubic }
                ),
                _this._isScrollTop &&
                  Velocity(_this._node, 'scroll', {
                    duration: _this._spd,
                    delay: 0,
                    easing: Ease.EaseOutCubic
                  })
            }),
            (this._isBookLife =
              this._node.getAttribute('class').indexOf('stAccordion01') >= 0),
            (this._trigger = this._node.querySelector('.stTrigger')),
            (this._wrapper = this._node.querySelector('.stAccordionView')),
            'false' === this._trigger.getAttribute('data-scrollTop') &&
              (this._isScrollTop = !1),
            this._isBookLife &&
              ((this._cookie = Cookie.getCookie()),
              (this._isOpen = !this._cookie || this._cookie.accordion),
              this._isOpen
                ? (_s.addClass(this._trigger, 'stCurrent'),
                  (this._wrapper.style.height = 'auto'))
                : (_s.removeClass(this._trigger, 'stCurrent'),
                  (this._wrapper.style.height = '0px'))),
            (this._inner = this._node.querySelector('.stAccordionInner')),
            (this._force_close = this._node.querySelector(
              '.stAccordionClose01'
            )),
            this._isBookLife ||
              ('true' === this._trigger.getAttribute('data-default') &&
                ((this._isOpen = !0),
                _s.addClass(this._trigger, 'stCurrent'),
                (this._wrapper.style.height = 'auto'))),
            this._trigger.addEventListener(MouseEvent.CLICK, this.toggleHD, !1),
            this._force_close &&
              this._force_close.addEventListener(
                MouseEvent.CLICK,
                this.hideHD,
                !1
              )
        }
        return Accordion
      })()
    module.exports = Accordion
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      Cookie = (function() {
        function Cookie() {}
        return (
          (Cookie.removeCookie = function(key) {
            Cookies.remove(key)
          }),
          (Cookie.getCookie = function() {
            var _path = '/'
            location.href.indexOf('/ebook') >= 0 && (_path = 'ebook'),
              location.href.indexOf('/netstore') >= 0 && (_path = 'netstore')
            var _key = ''
            switch (_path) {
              case 'netstore':
                _key = 'netstore'
                break
              case 'ebook':
                _key = 'ebook'
                break
              default:
                _key = 'home'
            }
            var _cookie = Cookies.getJSON('setting')
            return (
              (_cookie && _cookie[_key]) || Cookie.setCookie(),
              (_cookie = Cookies.getJSON('setting')),
              _cookie[_key]
            )
          }),
          (Cookie.setCookie = function() {
            var _path = '/'
            location.href.indexOf('/ebook') >= 0 && (_path = 'ebook'),
              location.href.indexOf('/netstore') >= 0 && (_path = 'netstore')
            var _key = ''
            switch (_path) {
              case 'netstore':
                _key = 'netstore'
                break
              case 'ebook':
                _key = 'ebook'
                break
              default:
                _key = 'home'
            }
            var _obj = {}
            _obj[_key] = {
              timeline: Statics.TIMELINE,
              genrenavi: Statics.GENRENAVI,
              accordion: Statics.ACCORDION
            }
            var _cookie = Cookies.getJSON('setting')
            _cookie &&
              ('home' != _key && _cookie.home && (_obj.home = _cookie.home),
              'ebook' != _key && _cookie.ebook && (_obj.ebook = _cookie.ebook),
              'netstore' != _key &&
                _cookie.netstore &&
                (_obj.netstore = _cookie.netstore)),
              Cookies.set('setting', JSON.stringify(_obj), {
                expires: 30,
                path: '/'
              })
          }),
          Cookie
        )
      })()
    module.exports = Cookie
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      ForceBtn = (function() {
        function ForceBtn(_node) {
          this._node = _node
          var _node = this._node.parentNode
          if (
            ((_node.style.textDecoration = 'none'),
            (_s.hasClass(this._node, 'stCart') ||
              _s.hasClass(this._node, 'stSeriesZero') ||
              _s.hasClass(this._node, 'stForceBtn')) &&
              'A' === _node.tagName)
          ) {
            ;(_node.style.textDecoration = 'none'),
              (_node.style.display = 'inline-block'),
              (_node.style.verticalAlign = 'bottom'),
              (_node.style.position = 'relative')
            var _height = Math.max(this._node.offsetHeight, 52)
            _node.style.height = _height + 'px'
          }
        }
        return ForceBtn
      })()
    module.exports = ForceBtn
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var CarouselEngine = __webpack_require__(18),
      _s = __webpack_require__(1),
      BookItem = __webpack_require__(13),
      Carousel = (function() {
        function Carousel(_target) {
          var _this = this
          ;(this._target = _target),
            (this.loadHD = function() {
              if (
                ((_this._pageBlockID = _this._target
                  .querySelector('.stLazyLoad')
                  .getAttribute('pageBlockId')),
                !_this._pageBlockID)
              )
                return void _this.setUpHD()
              ;(_this._coruselParam = _this._target
                .querySelector('.stLazyLoad')
                .getAttribute('coruselParam')),
                (_this._coruselParam = _this._coruselParam
                  ? _this._coruselParam.toQueryParams()
                  : {})
              var _self = _this,
                i = 0
              window.HC.Ajax.request(
                _this._pageBlockID,
                function(data) {
                  var node = jQuery(_self._ul).html(data)
                  window.HC.Ajax.onUpdateFunction(node),
                    _self.setUpHD(),
                    'undefined' != typeof window.CidSetting &&
                      window.CidSetting.setCid(
                        _self._pageBlockID,
                        window.DY.device
                      )
                  var _item = _self._ul.querySelectorAll('.stBookItem')
                  if (_item)
                    for (i = 0; i < _item.length; i++) new BookItem(_item[i])
                },
                jQuery.extend(_this._coruselParam, {
                  type: 'carousel',
                  filteredItemNum: 0,
                  startItemNum: 0,
                  cashLength: 0
                })
              )
            }),
            (this.setUpHD = function() {
              new CarouselEngine({
                _node: _this._target,
                auto: !1,
                responsive: !0,
                snap: !0
              })
            }),
            (this._ul = this._target.querySelector('ul')),
            (this._isLazyLoad = _s.hasClass(this._ul, 'stLazyLoad')),
            this._isLazyLoad ? this.loadHD() : this.setUpHD()
        }
        return Carousel
      })()
    module.exports = Carousel
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var __extends =
        (this && this.__extends) ||
        function(d, b) {
          function __() {
            this.constructor = d
          }
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p])
          d.prototype =
            null === b
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __())
        },
      Statics = __webpack_require__(2),
      EventDispatcher = __webpack_require__(19),
      Event = __webpack_require__(5),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      _d = __webpack_require__(1),
      CarouselEngine = (function(_super) {
        function CarouselEngine(_options) {
          var _this = this
          if (
            (void 0 === _options && (_options = null),
            _super.call(this),
            (this._options = _options),
            (this._indicatorNodes = []),
            (this._hasNavigation = !1),
            (this._hasIndicator = !1),
            (this._isPause = !1),
            (this._isAutoSlide = !1),
            (this._isSerialMove = !0),
            (this._isAnimate = !1),
            (this._isLoop = !1),
            (this._isSnap = !1),
            (this._autoTime = 8e3),
            (this._startTime = 0),
            (this._endTime = 0),
            (this._offsetX = 0),
            (this._velocityX = 0),
            (this._currentX = 0),
            (this._needsW = 0),
            (this._slideSpan = 0),
            (this._padding = 0),
            (this._maxSlide = 0),
            (this._prevSlide = 0),
            (this._currentSlide = 0),
            (this._startTouch = 0),
            (this._currentTouch = 0),
            (this._prevTouch = 0),
            (this._endTouch = 0),
            (this._captureCount = 0),
            (this._captureX = 0),
            (this._captureY = 0),
            (this._responsive = 0),
            (this._hasInfo = !1),
            (this._hasItems = !1),
            (this._isPrev = !1),
            (this.setup = function() {
              if (
                (_this._needsW ||
                  (_this._needsW = _this._slideSpan * _this._maxSlide),
                (_this._slideList.style.width = _this._needsW + 'px'),
                _this._isLoop && _this.setUpLoop(),
                'touchstart' === MouseEvent.MOUSE_DOWN &&
                  _this._slideList.addEventListener(
                    MouseEvent.MOUSE_DOWN,
                    _this.startFlick
                  ),
                _this.onSlideChange(),
                _this.setSlidePosition(),
                Velocity(_this._slideView, 'stop'),
                _this._navigation &&
                  ((_this._hasNavigation = !0),
                  (_this._btnPrev = _this._node.querySelector('.stPrev')),
                  (_this._btnNext = _this._node.querySelector('.stNext')),
                  (_this._btnPause = _this._node.querySelector('.btn_pause')),
                  _this._btnPause &&
                    _this._btnPause.addEventListener(
                      MouseEvent.CLICK,
                      _this.pauseHD
                    ),
                  _this._btnPrev &&
                    _this._btnPrev.addEventListener(
                      MouseEvent.CLICK,
                      _this.prevHD
                    ),
                  _this._btnNext &&
                    _this._btnNext.addEventListener(
                      MouseEvent.CLICK,
                      _this.nextHD
                    ),
                  _this.onSlideChange(),
                  _this._indicator))
              ) {
                _this._hasIndicator = !0
                var i = 0,
                  _html = ''
                for (i = 0; i < _this._maxSlide; i++)
                  _html += 0 === i ? '<li class="active"></li>' : '<li></li>'
                for (
                  _this._indicator.innerHTML = _html,
                    _this._indicatorNodes = _this._indicator.querySelectorAll(
                      'li'
                    ),
                    i = 0;
                  i < _this._indicatorNodes.length;
                  i++
                )
                  _this._indicatorNodes[i].addEventListener(
                    MouseEvent.CLICK,
                    _this.directChange
                  )
                _this.onSlideChange()
              }
            }),
            (this.directChange = function(e) {
              _this._isAnimate ||
                (_this._slideTimer && window.cancelAnimFrame(_this._slideTimer),
                _this._autoTimer && clearInterval(_this._autoTimer),
                Velocity(_this._slideList, 'stop'),
                (_this._slideTimer = window.requestAnimFrame(
                  _this.onSlideChange
                )))
            }),
            (this.pauseHD = function() {
              ;(_this._isPause = !_this._isPause),
                _this._isPause
                  ? _this._btnPause.addClass('active')
                  : _this._btnPause.removeClass('active')
            }),
            (this.prevHD = function(e) {
              return _this._isAnimate
                ? void e.preventDefault()
                : _d.hasClass(e.currentTarget, 'stDisabled')
                ? void e.preventDefault()
                : ((_this._isAnimate = !0),
                  _this._slideTimer &&
                    window.cancelAnimFrame(_this._slideTimer),
                  _this._autoTimer && clearInterval(_this._autoTimer),
                  Velocity(_this._slideList, 'stop'),
                  (_this._prevSlide = _this._currentSlide),
                  _this._currentSlide--,
                  (_this._isPrev = !0),
                  _this._isLoop &&
                    _this._currentSlide < 0 &&
                    !_this._hasItems &&
                    ((_this._currentSlide = _this._maxSlide - 1),
                    (_this._currentX -= _this._needsW),
                    _this.setSlidePosition()),
                  (_this._slideTimer = window.requestAnimFrame(
                    _this.onSlideChange
                  )),
                  void e.preventDefault())
            }),
            (this.nextHD = function(e) {
              return _this._isAnimate
                ? void e.preventDefault()
                : _d.hasClass(e.currentTarget, 'stDisabled')
                ? void e.preventDefault()
                : ((_this._isAnimate = !0),
                  _this._slideTimer &&
                    window.cancelAnimFrame(_this._slideTimer),
                  _this._autoTimer && clearInterval(_this._autoTimer),
                  Velocity(_this._slideList, 'stop'),
                  (_this._prevSlide = _this._currentSlide),
                  _this._currentSlide++,
                  (_this._isPrev = !1),
                  _this._isLoop &&
                    _this._currentSlide >= _this._maxSlide &&
                    !_this._hasItems &&
                    ((_this._currentSlide = 0),
                    (_this._currentX = -_this._needsW + _this._slideSpan),
                    _this.setSlidePosition()),
                  (_this._slideTimer = window.requestAnimFrame(
                    _this.onSlideChange
                  )),
                  void e.preventDefault())
            }),
            (this.prepResize = function() {
              _this._resizeTimer && clearTimeout(_this._resizeTimer),
                (_this._resizeTimer = setTimeout(_this.onResizeHD, 400))
            }),
            (this.onResizeHD = function() {
              var i = 0
              if (_this._responsive) {
                var _width = _this._node.offsetWidth,
                  _ItemPerSlide = Math.floor(_width / 133)
                _ItemPerSlide = Math.min(10, _ItemPerSlide)
                var _margin = Math.floor(
                  (_width - 133 * _ItemPerSlide) / (_ItemPerSlide - 1)
                )
                for (
                  _margin < 10 &&
                    (_ItemPerSlide--,
                    (_margin = Math.floor(
                      (_width - 133 * _ItemPerSlide) / (_ItemPerSlide - 1)
                    ))),
                    _this._needsW =
                      (133 + _margin) * _this._slides.length - _margin,
                    _this._slideList.style.width = _this._needsW + 'px',
                    _this._slideSpan = (133 + _margin) * _ItemPerSlide,
                    i = 0;
                  i < _this._slides.length;
                  i++
                )
                  i < _this._slides.length &&
                    (_this._slides[i].style.marginRight = _margin + 'px')
                _this._maxSlide = Math.floor(_this._needsW / _this._slideSpan)
              } else
                (_this._slideSpan = window.innerWidth - _this._padding),
                  (_this._needsW = _this._slideSpan * _this._maxSlide)
              _this._isLoop
                ? ((_this._needsW = _this._slideSpan * _this._maxSlide),
                  (_this._slideList.style.width = 3 * _this._needsW + 'px'),
                  (_this._offsetX = -_this._needsW))
                : (_this._slideList.style.width = _this._needsW + 'px'),
                _this.setSlidePosition(),
                _this.onSlideChange()
            }),
            (this.setUpLoop = function() {
              ;(_this._offsetX = -_this._needsW),
                (_this._currentX = _this._offsetX),
                Statics.HAS_CSS &&
                  (_this._slideList.style.transform = 'translate(0px 0px)')
              var _dummy = _this._slideList.innerHTML
              ;(_this._slideList.innerHTML += _dummy),
                (_this._slideList.innerHTML += _dummy),
                (_this._slides = _this._slideList.querySelectorAll('li')),
                (_this._slideList.style.width = 3 * _this._needsW + 'px'),
                _this.setSlidePosition()
            }),
            (this.resize = function(_slideSpan) {
              ;(_this._slideSpan = _slideSpan),
                (_this._needsW = (_this._slideSpan * _this._slides.length) / 3),
                (_this._slideList.style.width = 3 * _this._needsW + 'px'),
                (_this._offsetX = -_this._needsW),
                (_this._currentX =
                  _this._offsetX - _this._currentSlide * _this._slideSpan)
              var i = 0
              for (i = 0; i < _this._slides.length; i++)
                _this._slides[i].style.width = _this._slideSpan + 'px'
              ;(_this._isAnimate = !1), _this.setSlidePosition()
            }),
            (this.startFlick = function(e) {
              _this._slideTimer && window.cancelAnimFrame(_this._slideTimer),
                _this._autoTimer && clearInterval(_this._autoTimer),
                Velocity(_this._slideList, 'stop'),
                (_this._startTime = new Date().getTime()),
                (_this._startTouch =
                  'touchstart' === MouseEvent.MOUSE_DOWN
                    ? e.touches[0].clientX
                    : e.pageX),
                (_this._captureCount = 0),
                (_this._captureX =
                  'touchstart' === MouseEvent.MOUSE_DOWN
                    ? e.touches[0].clientX
                    : e.pageX),
                (_this._captureY =
                  'touchstart' === MouseEvent.MOUSE_DOWN
                    ? e.touches[0].clientY
                    : e.pageY),
                _this.dispatcher.addEventListener(
                  MouseEvent.MOUSE_MOVE,
                  _this.captureDirection
                )
            }),
            (this.captureDirection = function(e) {
              if ((_this._captureCount++, _this._captureCount > 5)) {
                _this.dispatcher.removeEventListener(
                  MouseEvent.MOUSE_MOVE,
                  _this.captureDirection
                )
                var _captureEndX =
                    'touchstart' === MouseEvent.MOUSE_DOWN
                      ? e.touches[0].clientX
                      : e.pageX,
                  _captureEndY =
                    'touchstart' === MouseEvent.MOUSE_DOWN
                      ? e.touches[0].clientY
                      : e.pageY,
                  _jadgeX = Math.abs(_captureEndX - _this._captureX),
                  _jadgeY = Math.abs(_captureEndY - _this._captureY)
                _jadgeX > _jadgeY
                  ? ((_this._startTime = new Date().getTime()),
                    (_this._startTouch =
                      'touchstart' === MouseEvent.MOUSE_DOWN
                        ? e.touches[0].clientX
                        : e.pageX),
                    (_this._currentTouch = _this._startTouch),
                    (_this._prevTouch = _this._startTouch),
                    _this.dispatcher.addEventListener(
                      MouseEvent.MOUSE_UP,
                      _this.stopFlick
                    ),
                    _this.dispatcher.addEventListener(
                      MouseEvent.MOUSE_MOVE,
                      _this.flicking
                    ))
                  : _this._isAutoSlide &&
                    (_this._autoTimer = setInterval(
                      _this.autoSlide,
                      _this._autoTime
                    ))
              }
            }),
            (this.flicking = function(e) {
              _this._autoTimer && clearInterval(_this._autoTimer),
                (_this._prevTouch = _this._currentTouch),
                (_this._currentTouch =
                  'touchmove' === MouseEvent.MOUSE_MOVE
                    ? e.touches[0].clientX
                    : e.pageX)
              var _diff = _this._prevTouch - _this._currentTouch
              ;(_this._currentX -= _diff),
                _this._isLoop ? _this.jadgeLoop() : _this.setSlideMax(),
                _this.setSlidePosition()
            }),
            (this.stopFlick = function(e) {
              if (
                (_this.dispatcher.removeEventListener(
                  MouseEvent.MOUSE_UP,
                  _this.stopFlick
                ),
                _this.dispatcher.removeEventListener(
                  MouseEvent.MOUSE_MOVE,
                  _this.flicking
                ),
                (_this._endTime = new Date().getTime()),
                (_this._endTouch =
                  'touchend' === MouseEvent.MOUSE_UP
                    ? e.changedTouches[0].clientX
                    : e.pageX),
                _this._isSnap)
              )
                _this._isLoop && _this.jadgeLoop(),
                  _this._endTouch > _this._startTouch &&
                    ((_this._prevSlide = _this._currentSlide),
                    _this._currentSlide--,
                    (_this._isPrev = !0),
                    _this._isLoop
                      ? _this._currentSlide < 0 &&
                        ((_this._currentSlide = _this._maxSlide - 1),
                        (_this._currentX -= _this._needsW),
                        _this.setSlidePosition())
                      : (_this._currentSlide = Math.max(
                          0,
                          _this._currentSlide
                        ))),
                  _this._endTouch < _this._startTouch &&
                    ((_this._prevSlide = _this._currentSlide),
                    _this._currentSlide++,
                    (_this._isPrev = !1),
                    _this._isLoop
                      ? _this._currentSlide >= _this._maxSlide &&
                        ((_this._currentSlide = 0),
                        (_this._currentX += _this._needsW),
                        _this.setSlidePosition())
                      : (_this._currentSlide = Math.min(
                          _this._maxSlide,
                          _this._currentSlide
                        ))),
                  (_this._slideTimer = window.requestAnimFrame(
                    _this.onSlideChange
                  )),
                  _this._isAutoSlide &&
                    (_this._autoTimer = setInterval(
                      _this.autoSlide,
                      _this._autoTime
                    ))
              else {
                var _moveRatio = 1 - (_this._endTime - _this._startTime) / 200
                ;(_moveRatio = Math.max(0, _moveRatio)),
                  (_this._velocityX =
                    (_this._endTouch - _this._startTouch) * _moveRatio),
                  (_this._slideTimer = window.requestAnimFrame(_this.accelHD))
              }
            }),
            (this.accelHD = function() {
              ;(_this._velocityX *= 0.9),
                (_this._currentX += _this._velocityX),
                _this._isLoop ? _this.jadgeLoop() : _this.setSlideMax(),
                (_this._currentSlide = _this.getCurrentSlide()),
                _this._hasNavigation && _this.setNavigation(),
                _this.setSlidePosition(),
                Math.abs(_this._velocityX) < 0.5
                  ? _this._isAutoSlide &&
                    (_this._autoTimer = setInterval(
                      _this.autoSlide,
                      _this._autoTime
                    ))
                  : (_this._slideTimer = window.requestAnimFrame(_this.accelHD))
            }),
            (this.setSlideMax = function() {
              ;(_this._currentX = Math.min(0, _this._currentX)),
                (_this._currentX = Math.max(
                  _this._slideView.offsetWidth - _this._needsW,
                  _this._currentX
                ))
            }),
            (this.autoSlide = function() {
              _this._isPause ||
                (_this._currentSlide++,
                _this._currentSlide >= _this._maxSlide &&
                  ((_this._currentSlide = 0),
                  (_this._currentX = -_this._needsW + _this._slideSpan),
                  _this.setSlidePosition()),
                (_this._slideTimer = window.requestAnimFrame(
                  _this.onSlideChange
                )))
            }),
            (this.onSlideChange = function() {
              _this._isAnimate = !0
              var i = 0,
                _gotoX = _this._offsetX - _this._slideSpan * _this._currentSlide
              if (
                (_this._isLoop ||
                  ((_gotoX = Math.max(
                    _this._slideView.offsetWidth - _this._needsW,
                    _gotoX
                  )),
                  (_gotoX = Math.min(0, _gotoX))),
                !_this._isLoop)
              )
                try {
                  _this._currentSlide === _this._maxSlide
                    ? _d.addClass(_this._btnNext, 'stDisabled')
                    : _d.removeClass(_this._btnNext, 'stDisabled'),
                    0 === _this._currentSlide
                      ? _d.addClass(_this._btnPrev, 'stDisabled')
                      : _d.removeClass(_this._btnPrev, 'stDisabled')
                } catch (e) {}
              if (_this._isLoop && _this._hasItems) {
                var _gotoX = 0
                ;(_gotoX = _this._isPrev
                  ? Number(_this._currentX) + _this._slideSpan
                  : _this._currentX - _this._slideSpan),
                  _this._prevSlide === _this._currentSlide &&
                    (_gotoX = _this._currentX),
                  _gotoX > _this._offsetX &&
                    ((_this._currentX -= _this._needsW),
                    (_gotoX -= _this._needsW),
                    _this.setSlidePosition()),
                  _gotoX < _this._offsetX - _this._needsW &&
                    ((_this._currentX =
                      Number(_this._currentX) + Number(_this._needsW)),
                    (_gotoX += Number(_this._needsW)),
                    _this.setSlidePosition())
              }
              if (
                (Velocity(_this._slideList, 'stop'),
                Statics.HAS_CSS
                  ? Velocity(
                      _this._slideList,
                      { translateX: _gotoX },
                      {
                        duration: 800,
                        delay: 0,
                        easing: Ease.EaseInOutCubic,
                        progress: _this.onVelocityProgress,
                        complete: _this.slideComplete
                      }
                    )
                  : Velocity(
                      _this._slideList,
                      { 'margin-left': _gotoX },
                      {
                        duration: 800,
                        delay: 0,
                        easing: Ease.EaseInOutCubic,
                        progress: _this.onVelocityProgress,
                        complete: _this.slideComplete
                      }
                    ),
                _this._isAutoSlide &&
                  (clearInterval(_this._autoTimer),
                  (_this._autoTimer = setInterval(
                    _this.autoSlide,
                    _this._autoTime
                  ))),
                _this._hasIndicator)
              )
                for (i = 0; i < _this._indicatorNodes.length; i++)
                  i === _this._currentSlide
                    ? _d.addClass(_this._indicatorNodes[i], 'active')
                    : _d.removeClass(_this._indicatorNodes[i], 'active')
              try {
                _this.dispatchEvent(Event.CHANGE)
              } catch (e) {
                jQuery(window).trigger('SLIDE_CHANGE')
              }
            }),
            (this.onVelocityProgress = function(e) {
              if (Statics.HAS_CSS) {
                var _matrix = Velocity.hook(_this._slideList, 'transform')
                0 !== _matrix &&
                  ((_matrix = _matrix.replace(/[^0-9\-.,]/g, '').split(',')),
                  (_this._currentX = _matrix[12] || _matrix[4]))
              } else
                _this._currentX = Number(
                  _this._slideList.style.marginLeft.replace('px', '')
                )
              _this._isLoop && (_this._currentSlide = _this.getCurrentSlide()),
                _this._hasNavigation && _this.setNavigation()
            }),
            (this.slideComplete = function() {
              _this._isAnimate = !1
            }),
            (this.jadgeLoop = function() {
              _this._currentX < _this._offsetX - _this._slideSpan / 2 &&
                (_this._currentX += _this._needsW),
                _this._currentX > _this._offsetX + _this._slideSpan / 2 &&
                  (_this._currentX -= _this._needsW),
                _this.setSlidePosition()
            }),
            (this.getCurrentSlide = function() {
              var _slide = Math.abs(
                Math.round(
                  (_this._currentX - _this._offsetX) / _this._slideSpan
                )
              )
              return (
                _slide === _this._maxSlide && (_slide = 0),
                _slide != _this._currentSlide && (_this._currentSlide = _slide),
                _slide
              )
            }),
            (this.setSlidePosition = function() {
              if (!_this._isLoop) {
                var _width = _this._node.offsetWidth
                _this._currentX + _this._needsW < _width &&
                  (_this._currentX = _width - _this._needsW),
                  _this._currentX > 0 && (_this._currentX = 0),
                  (_this._currentSlide = Math.abs(
                    Math.round(
                      (_this._currentX - _this._offsetX) / _this._slideSpan
                    )
                  ))
              }
              Velocity(_this._slideList, 'stop'),
                Statics.HAS_CSS
                  ? Velocity.hook(
                      _this._slideList,
                      'translateX',
                      _this._currentX + 'px'
                    )
                  : Velocity.hook(
                      _this._slideList,
                      'margin-left',
                      _this._currentX + 'px'
                    )
            }),
            (this.setNavigation = function() {}),
            (this.dispatcher = window),
            void 0 !== _options._node)
          ) {
            _options.autoTime && (this._autoTime = _options.autoTime),
              _options.padding && (this._padding = _options.padding),
              _options.responsive && (this._responsive = _options.responsive),
              _options.slideSpan && (this._slideSpan = _options.slideSpan),
              _options.hasItems && (this._hasItems = _options.hasItems),
              (this._isAutoSlide = _options.auto),
              (this._isLoop = _options.loop),
              (this._isSnap = _options.snap),
              (this._node = _options._node),
              (this._slideView = this._node.querySelector('.stView')),
              (this._slideList = this._slideView.querySelector('ul')),
              this._slideList ||
                (this._slideView.insertAdjacentHTML(
                  'beforebegin',
                  '<div class="stView"></div>'
                ),
                (this._slideList = this._node.querySelector('ul')),
                (this._slideView = this._node.querySelector('.stView')),
                this._slideView.appendChild(this._slideList),
                (this._slideList = this._slideView.querySelector('ul')),
                (this._hasInfo = this._slideList.querySelector('.stTitle')),
                this._hasInfo || (this._slideView.style.height = '180px')),
              (this._slides = this._slideList.children)
            var i = 0
            for (i = 0; i < this._slides.length; i++)
              this._slides[i].setAttribute('data-index', i)
            ;(this._navigation = this._node.querySelector('.stPrev')),
              (this._indicator = this._node.querySelector('.slide_indicator')),
              this._hasItems
                ? ((this._needsW = this._slides[0].offsetWidth),
                  (this._currentSlide = 0),
                  (this._maxSlide = Math.ceil(this._needsW / this._slideSpan)))
                : (this._maxSlide = this._slides.length),
              (this._style = this._slideList.style),
              (void 0 !== _options.slideSpan && 0 == this._responsive) ||
                (this.dispatcher.addEventListener(
                  Event.RESIZE,
                  this.prepResize
                ),
                setTimeout(this.onResizeHD, 1e3)),
              this.setup()
          }
        }
        return __extends(CarouselEngine, _super), CarouselEngine
      })(EventDispatcher)
    module.exports = CarouselEngine
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Event = __webpack_require__(5),
      EventDispatcher = (function() {
        function EventDispatcher(_target) {
          var _this = this
          void 0 === _target && (_target = null),
            (this._target = _target),
            (this._listeners = {}),
            (this.addEventListener = function(types, listener, useCapture) {
              if ((void 0 === useCapture && (useCapture = !1), _this._target))
                return void _this._target.addEventListener(
                  types,
                  listener,
                  useCapture
                )
              for (
                var typeList = types.split(/\s+/), i = 0, l = typeList.length;
                i < l;
                i++
              )
                _this._listeners[typeList[i]] = listener
            }),
            (this.removeEventListener = function(types, listener) {
              if (_this._target)
                return void _this._target.removeEventListener(types, listener)
              for (
                var type,
                  typeList = types.split(/\s+/),
                  i = 0,
                  l = typeList.length;
                i < l;
                i++
              )
                (type = typeList[i]),
                  (null != listener && _this._listeners[type] !== listener) ||
                    delete _this._listeners[type]
            }),
            (this.dispatchEvent = function(type, data, context) {
              if (
                (void 0 === data && (data = {}),
                void 0 === context && (context = _this),
                _this._target)
              ) {
                if (window.CustomEvent)
                  try {
                    var event = new CustomEvent(type, data)
                  } catch (e) {
                    var event = document.createEvent('CustomEvent')
                    event.initCustomEvent(type, !0, !0, data)
                  }
                else {
                  var event = document.createEvent('CustomEvent')
                  event.initCustomEvent(type, !0, !0, data)
                }
                return void _this._target.dispatchEvent(event)
              }
              var listener
              if ((listener = _this._listeners[type])) {
                var e = new Event(type)
                ;(e.data = data), listener.call(context, e)
              }
              return !0
            }),
            (this.clearEventListener = function() {
              _this._listeners = {}
            })
        }
        return EventDispatcher
      })()
    module.exports = EventDispatcher
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      Event = __webpack_require__(5),
      Statics = __webpack_require__(2),
      LineClamper = (function() {
        function LineClamper(_target) {
          var _this = this
          if (
            ((this._target = _target),
            (this._ellipsis = '…'),
            (this._isCenter = !1),
            (this.onResizeHD = function() {
              ;(_this._target.style.display = 'inline-block'),
                (_this._target.innerHTML = _this._origin)
              for (
                var _index = _this._origin.length,
                  _height = Math.ceil(
                    _this._target.offsetHeight / _this._lineHeight
                  );
                _height > _this._line;

              )
                (_this._target.innerHTML =
                  _this._origin.substr(0, _index) + _this._ellipsis),
                  (_height = Math.ceil(
                    _this._target.offsetHeight / _this._lineHeight
                  )),
                  _index--
              _this._target.innerHTML.substr(
                _this._target.innerHTML.length - 1,
                1
              ) === _this._ellipsis
                ? _s.addClass(_this._target, 'stCurrent')
                : _s.removeClass(_this._target, 'stCurrent')
            }),
            (this._line = Number(this._target.getAttribute('data-line'))),
            (this._isCenter = !!this._target.getAttribute('data-center')),
            this._line)
          ) {
            if (Statics.IS_LEGACY)
              return (
                (this._target.style.display = 'block'),
                (this._target.style.width = '100%'),
                (this._target.style.overflow = 'hidden'),
                (this._target.style.whiteSpace = 'nowrap'),
                void (this._target.style.textOverflow = 'ellipsis')
              )
            this._origin = this._target.innerHTML
            var elemStyle =
                this._target.currentStyle ||
                document.defaultView.getComputedStyle(this._target, null),
              _div = document.createElement('div')
            ;(_div.innerHTML = '　'),
              (_div.style.display = 'block'),
              (_div.style.position = 'absolute'),
              (_div.style.height = 'auto'),
              (_div.style.lineHeight = elemStyle.lineHeight),
              (_div.style.fontSize = elemStyle.fontSize),
              document.body.appendChild(_div),
              (this._lineHeight = _div.offsetHeight),
              document.body.removeChild(_div),
              (_div = void 0),
              window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
              this.onResizeHD(),
              (this._target.style.position = 'relative'),
              this._isCenter &&
                ((this._target.style.display = 'table-cell'),
                (this._target.style.width =
                  this._target.parentNode.offsetWidth + 'px'),
                (this._target.style.height =
                  this._lineHeight * this._line + 'px'),
                (this._target.style.verticalAlign = 'middle'))
          }
        }
        return LineClamper
      })()
    module.exports = LineClamper
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      Ease = __webpack_require__(6),
      MouseEvent = __webpack_require__(3),
      stAccMenu = (function() {
        function stAccMenu(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this.toggleHD = function(e) {
              e.preventDefault(),
                (_this._isOpen = !_this._isOpen),
                _this._isOpen ? _this.show() : _this.hide()
            }),
            (this.show = function() {
              _s.addClass(_this._node, 'stAccOpenL'),
                Velocity(_this._target, 'stop'),
                Velocity(
                  _this._target,
                  { height: _this._inner.offsetHeight },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function() {
              _s.removeClass(_this._node, 'stAccOpenL'),
                Velocity(_this._target, 'stop'),
                Velocity(
                  _this._target,
                  { height: 0 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this._aTag = this._node.querySelector('a'))
          var _href = this._aTag.getAttribute('href').replace('#', '')
          ;(this._target = document.getElementById(_href)),
            this._node.addEventListener(MouseEvent.CLICK, this.toggleHD, !1),
            _s.hasClass(this._node, 'stAccOpenL')
              ? (this._isOpen = !0)
              : (this._target.style.height = '0px'),
            (this._target.style.overflow = 'hidden'),
            (this._inner = this._target.querySelector('*')),
            (this._inner.style.paddingBottom = '15px'),
            (this._inner.style.marginBottom = '0px')
        }
        return stAccMenu
      })()
    module.exports = stAccMenu
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      BookJadge = (function() {
        function BookJadge(_target) {
          if (
            ((this._target = _target), !_s.hasClass(_target, 'noBookJadge'))
          ) {
            var _flag = this._target.querySelectorAll('.stIdentifier')
            _flag.length
              ? _s.addClass(_target, 'stEb')
              : _s.addClass(_target, 'stNs')
          }
        }
        return BookJadge
      })()
    module.exports = BookJadge
  },
  function(module, exports) {
    'use strict'
    var ClipSelect = (function() {
      function ClipSelect(_node) {
        ;(this._node = _node),
          (this._select = this._node.querySelectorAll('option'))
        var i = 0
        for (i = 0; i < this._select.length; i++) {
          var _label = this._select[i].getAttribute('label')
          _label.length > 8 && (_label = _label.substr(0, 7) + '…'),
            this._select[i].setAttribute('label', _label)
        }
      }
      return ClipSelect
    })()
    module.exports = ClipSelect
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      Event = __webpack_require__(5),
      BookItem = __webpack_require__(13),
      RecommendBook = (function() {
        function RecommendBook(_node) {
          var _this = this
          if (
            ((this._node = _node),
            (this._strLength = 25),
            (this._blockHideFlag = !0),
            (this._max = 0),
            (this._current = 0),
            (this.loadHD = function() {
              function json(
                pageBlockId,
                container,
                parameters,
                isAppendQuery,
                onComplete
              ) {
                ;(parameters = window.HC.Ajax._getParameters(
                  pageBlockId,
                  parameters,
                  { isPart: !0, noResponse: !(null != onComplete) },
                  isAppendQuery
                )),
                  jQuery.ajax({
                    cache: !1,
                    data: parameters,
                    dataType: 'json',
                    type: 'post',
                    url: window.HC.Ajax.url,
                    success: function(data) {
                      onComplete(data)
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {}
                  })
              }
              function onComplete(json) {
                if (json) {
                  var productId = json.recmDspDescriptionDto.prdId,
                    recmBookNum = 1
                  null != json.recmDspDescriptionDto.prdListDesc
                    ? (_self.isClass(
                        'Array',
                        json.recmDspDescriptionDto.prdListDesc
                      )
                        ? (recmBookNum =
                            json.recmDspDescriptionDto.prdListDesc.length)
                        : _self.isClass(
                            'Object',
                            json.recmDspDescriptionDto.prdListDesc
                          ) && (recmBookNum = 1),
                      (_self._blockHideFlag = !1))
                    : null == json.recmDspDescriptionDto.prdListDesc &&
                      ((recmBookNum = 0),
                      jQuery('#dy_get_recommend_' + productId).remove())
                  var deleteFlg = !1
                  jQuery('.dy_replace_get_recommend_' + productId).each(
                    function(i) {
                      if (
                        (0 === recmBookNum && jQuery(this).remove(),
                        recmBookNum <= i)
                      )
                        (deleteFlg = !0),
                          jQuery(this).css('visibility', 'hidden')
                      else {
                        var recmBook
                        ;(recmBook =
                          1 == recmBookNum
                            ? json.recmDspDescriptionDto.prdListDesc
                            : json.recmDspDescriptionDto.prdListDesc[i]),
                          (recmBook.prdImgUrl = recmBook.prdImgUrl
                            .replace('/75/', '/81/')
                            .replace('.jpg', 'BC.png'))
                        var html = ''
                        if (
                          ((html += '<div class="stItem">'),
                          (html += '<div class="stPhoto">'),
                          0 === i)
                        ) {
                          var wantBookNm = jQuery(
                              '#dy_get_want_book_nm_' + productId
                            ).text(),
                            rcmLdBfTxt =
                              'string' == typeof json.rcmLdBfTxt
                                ? json.rcmLdBfTxt
                                : '',
                            rcmLdAfTxt =
                              'string' == typeof json.rcmLdAfTxt
                                ? json.rcmLdAfTxt
                                : ''
                          html +=
                            '<h3 class="stSummary">' +
                            rcmLdBfTxt +
                            '<span class="stNum03">' +
                            wantBookNm +
                            '</span>' +
                            rcmLdAfTxt +
                            '</h3>'
                        }
                        ;(html += '<div class="stBookItem">'),
                          (html += '<a href="' + recmBook.prdUrl + '">'),
                          (html +=
                            '<span class="stBtn stFav">' +
                            recmBook.prdNm +
                            '</span>'),
                          (html +=
                            '<div class="stSummary"><p class="stTitle" style="font-size:11px;">' +
                            recmBook.prdNm +
                            '</p></div>'),
                          (html += '</a>'),
                          (html += '<p class="stCover">'),
                          (html +=
                            '<img src="' +
                            recmBook.prdImgUrl +
                            '" width="75" height="110" alt="' +
                            recmBook.prdNm +
                            '">'),
                          (html += '</p>'),
                          (html += '</div>'),
                          (html += '</div>'),
                          (html += '</div>'),
                          jQuery(this).html(html),
                          _self.addBookItem(this)
                      }
                    }
                  ),
                    _self._current++,
                    _self._current >= _self._max &&
                      _self._blockHideFlag &&
                      jQuery('#pbBlock' + _self._pageBlockId).hide()
                  var wantBookLink = void 0
                  'undefined' != typeof wantBookLink &&
                    wantBookLink.init(jQuery('#want_recommend_list')),
                    _self.addBookItemClass(),
                    _self.onResizeHD()
                }
              }
              var _self = _this
              document.getElementById('randomWantBookPageBlockId') &&
                ((_self._pageBlockId = document
                  .getElementById('randomWantBookPageBlockId')
                  .getAttribute('value')),
                jQuery('li[id^=dy_get_recommend]').each(function() {
                  var productId = jQuery(this)
                      .attr('id')
                      .replace('dy_get_recommend_', ''),
                    queryString =
                      (jQuery('#pageAlias').attr('value'),
                      'prdid=' + productId),
                    i = 0
                  jQuery('li[id^=dy_get_recommend]').each(function() {
                    ;(queryString +=
                      '&excludePrdIdList[' +
                      i +
                      ']=' +
                      jQuery(this)
                        .attr('id')
                        .replace('dy_get_recommend_', '')),
                      i++
                  })
                  var container = jQuery(
                    '#dy_replace_get_recommend_' + productId
                  )
                  window.Honto.Common.Ajax.blockData[_self._pageBlockId]
                  json(
                    _self._pageBlockId,
                    container,
                    queryString,
                    !1,
                    onComplete
                  )
                }))
            }),
            (this.onResizeHD = function() {
              var _count,
                _width = _this._node.offsetWidth,
                i = 0
              _s.removeClass(_this._node, 'stCount3'),
                _s.removeClass(_this._node, 'stCount4'),
                _s.removeClass(_this._node, 'stCount5'),
                _width >= 1378
                  ? (_s.addClass(_this._node, 'stCount5'), (_count = 5))
                  : _width >= 1197
                  ? (_s.addClass(_this._node, 'stCount4'), (_count = 4))
                  : (_s.addClass(_this._node, 'stCount3'), (_count = 3)),
                (_this._evens = _this._node.querySelectorAll('.stEven')),
                (_this._odds = _this._node.querySelectorAll('.stOdd')),
                (_this._summarys = _this._node.querySelectorAll('h3.stSummary'))
              var _itemW = 189 + 80 * _count + 10 * (_count - 1) + 20
              for (i = 0; i < _this._evens.length; i++)
                _this._evens[i].style.marginLeft =
                  _this._node.offsetWidth - 30 - 2 * _itemW + 'px'
              for (i = 0; i < _this._odds.length; i++)
                _this._odds[i].style.marginLeft = '0px'
              for (i = 0; i < _this._summarys.length; i++)
                _this._summarys[i].style.width = _itemW - 189 + 'px'
              for (i = 0; i < _this._stShelfBar.length; i++)
                _this._stShelfBar[i].style.width = _itemW + 'px'
            }),
            (this.debugHD = function() {}),
            (this.addBookItem = function(_elm) {
              var i = 0,
                _items = _elm.querySelectorAll('.stBookItem')
              for (i = 0; i < _items.length; i++) new BookItem(_items[i])
            }),
            (this.addBookItemClass = function() {
              var i = 0
              for (
                _this._heads = _this._node.querySelectorAll('.stRecommendHead'),
                  i = 0;
                i < _this._heads.length;
                i++
              )
                i % 2 === 0
                  ? (_s.removeClass(_this._heads[i], 'stEven'),
                    _s.addClass(_this._heads[i], 'stOdd'))
                  : (_s.removeClass(_this._heads[i], 'stOdd'),
                    _s.addClass(_this._heads[i], 'stEven'))
            }),
            (this.isClass = function(type, obj) {
              var clas = Object.prototype.toString.call(obj).slice(8, -1)
              return void 0 !== obj && null !== obj && clas === type
            }),
            (this._list = this._node.querySelectorAll('li')),
            this._list.length)
          ) {
            var _count = 0,
              i = 0
            for (i = 0; i < this._list.length; i++) {
              this._list[i].getAttribute('id')
                ? (_s.addClass(this._list[i], 'stRecommendHead'),
                  (_count = 0),
                  this._max++)
                : _s.addClass(this._list[i], 'stCount' + _count),
                _count++
              var _str = this._list[i].querySelector('.stSummary span')
              if (_str) {
                var _string = _str.innerText
                _string.length > this._strLength &&
                  (_string = _string.substring(0, this._strLength) + '…'),
                  (_str.innerText = _string)
              }
            }
            ;(this._evens = this._node.querySelectorAll('.stEven')),
              (this._stShelfBar = this._node.querySelectorAll('.stShelfBar')),
              window.addEventListener(
                'catchRecommendItems',
                this.addBookItem,
                !1
              ),
              window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
              this.onResizeHD()
            var _url = location.href
            return _url.indexOf('test01') >= 0 || _url.indexOf('192.') >= 0
              ? void this.debugHD()
              : void this.loadHD()
          }
        }
        return RecommendBook
      })()
    module.exports = RecommendBook
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      API = __webpack_require__(26),
      Loader = __webpack_require__(27),
      Event = __webpack_require__(5),
      Ease = __webpack_require__(6),
      MouseEvent = __webpack_require__(3),
      _s = __webpack_require__(1),
      Cookie = __webpack_require__(15),
      BookItem = __webpack_require__(13),
      TimeLine = (function() {
        function TimeLine(_node) {
          var _this = this
          ;(this._node = _node),
            (this._alreadyItems = []),
            (this._currentX = -546),
            (this._isPause = !1),
            (this._isOpen = !1),
            (this._panelSize = { w: 0, h: 0 }),
            (this._params = []),
            (this._spd = 0),
            (this._isNext = !1),
            (this._isPrev = !1),
            (this._isLoading = !1),
            (this.prevHD = function() {
              ;(_this._isPrev = !0),
                _s.removeClass(_this._btnNext, 'stDisabled'),
                _this._btnNext.addEventListener(
                  MouseEvent.MOUSE_DOWN,
                  _this.nextHD,
                  !1
                )
            }),
            (this.nextHD = function() {
              _this._isNext = !0
            }),
            (this.resumeHD = function() {
              ;(_this._isPrev = !1),
                (_this._isNext = !1),
                _this._currentX <= _this._nowX &&
                  _s.addClass(_this._btnNext, 'stDisabled')
            }),
            (this.loadJson = function() {
              _this._isLoading = !0
              var _pageBlockID = _this._node.getAttribute('pageblockid'),
                _param = window.Honto.Common.Ajax._getParameters(_pageBlockID),
                _self = _this
              jQuery.ajax({
                cache: !1,
                data: _param,
                dataType: 'json',
                type: 'post',
                url: window.Honto.Common.Ajax.url,
                success: function(data) {
                  _self.loadCompleteAPI(data)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log('timeline_get_error')
                }
              })
            }),
            (this.loadCompleteAPI = function(data) {
              _this._isLoading = !1
              var i = 0,
                _html = ''
              if (
                (_this._windowSize < 1700
                  ? (_this._stopThreshold = 25)
                  : _this._windowSize < 1200
                  ? (_this._stopThreshold = 20)
                  : (_this._stopThreshold = 30),
                data.Array.length < _this._stopThreshold)
              )
                return (
                  (_this._disablePanel.style.display = 'block'),
                  void (_this._ul.style.display = 'none')
                )
              for (i = 0; i < data.Array.length; i++) {
                var _item = data.Array[i].timeline_items
                ;(_html += '<li id="' + _item.item.item_id + '">'),
                  (_html +=
                    '<span class="stStore">' +
                    _item.sales_result_group_name +
                    '</span>'),
                  (_html += '<div class="stBookItem standBy">'),
                  (_html += '<div class="stImg">'),
                  (_html +=
                    '<a href="' +
                    _item.item.item_url +
                    '"><span class="stBtn stFav"></span>'),
                  (_html +=
                    '<div class="stSummary"><p class="stTitle" style="font-size:11px; line-height:1.3;">' +
                    _item.item.dsp_item_name2 +
                    '</p></div></a>'),
                  (_html +=
                    '<img src="' +
                    _item.item.image_url +
                    '" alt="' +
                    _item.item.dsp_item_name2 +
                    '"/>'),
                  (_html += '</div>'),
                  (_html += '</div>'),
                  (_html += '</li>')
              }
              for (
                _this._ul.insertAdjacentHTML('beforeend', _html);
                _this._ul.getElementsByTagName('li').length >= 100;

              )
                _this._ul.removeChild(_this._ul.getElementsByTagName('li')[0]),
                  (_this._currentX += 91),
                  (_this._currentX = Math.min(0, _this._currentX))
              Statics.HAS_CSS
                ? Velocity.hook(_this._ul, 'translateX', _this._currentX + 'px')
                : Velocity.hook(
                    _this._ul,
                    'margin-left',
                    _this._currentX + 'px'
                  ),
                (_this._ul.style.width =
                  91 * _this._ul.getElementsByTagName('li').length + 'px')
              var _item = _this._ul.querySelectorAll('.standBy')
              for (i = 0; i < _item.length; i++)
                _s.removeClass(_item[i], 'standBy'), new BookItem(_item[i])
              data.stock_quantity < 500 ? (_this._spd = 0.5) : (_this._spd = 1),
                _this._currentX + _this._ul.offsetWidth >=
                  document.body.clientWidth &&
                  (_this._timer ||
                    (_this._timer = window.requestAnimFrame(_this.movingList))),
                (_this._nowX = _this._currentX)
            }),
            (this.movingList = function() {
              if (
                ((_this._timer = window.requestAnimFrame(_this.movingList)),
                _this._isPause)
              )
                return (
                  _this._isPrev &&
                    ((_this._currentX += 3),
                    (_this._currentX = Math.min(_this._currentX, 0))),
                  _this._isNext &&
                    _this._currentX > _this._nowX &&
                    ((_this._currentX -= 3),
                    (_this._currentX = Math.max(
                      _this._currentX,
                      document.body.clientWidth - _this._ul.offsetWidth
                    ))),
                  void (Statics.HAS_CSS
                    ? Velocity.hook(
                        _this._ul,
                        'translateX',
                        _this._currentX + 'px'
                      )
                    : Velocity.hook(
                        _this._ul,
                        'margin-left',
                        _this._currentX + 'px'
                      ))
                )
              if (
                ((_this._currentX -= _this._spd),
                _this._currentX < _this._nowX &&
                  ((_this._nowX = _this._currentX),
                  _s.addClass(_this._btnNext, 'stDisabled')),
                _this._currentX + _this._ul.offsetWidth <=
                  document.body.clientWidth + 300 && !_this._isLoading)
              ) {
                _this._isLoading = !0
                var _url = location.href
                return _url.indexOf('test01') >= 0 || _url.indexOf('192.') >= 0
                  ? void _this.loadJson2()
                  : void _this.loadJson()
              }
              Statics.HAS_CSS
                ? Velocity.hook(_this._ul, 'translateX', _this._currentX + 'px')
                : Velocity.hook(
                    _this._ul,
                    'margin-left',
                    _this._currentX + 'px'
                  )
            }),
            (this.loadJson2 = function() {
              ;(_this._loader = new Loader()),
                _this._loader.addEventListener(
                  Event.COMPLETE,
                  _this.loadComplete,
                  !1
                ),
                _this._loader.load({ url: API.TIME_LINE })
            }),
            (this.loadComplete = function() {
              var _data = _this._loader.content.timeline_items
              _this._isLoading = !1
              var i = 0,
                _html = '',
                _date = _data[i].made_time
              for (i = 0; i < _data.length; i++)
                (_html += '<li id="stTimelineItem_' + _date + '">'),
                  (_html +=
                    '<span class="stStore">' +
                    _data[i].sales_result_group_name +
                    '</span>'),
                  (_html += '<div class="stBookItem standBy">'),
                  (_html += '<div class="stImg">'),
                  (_html +=
                    '<a href="' +
                    _data[i].item.item_url +
                    '"><span class="stBtn stFav"></span></a>'),
                  (_html +=
                    '<img src="' +
                    _data[i].item.image_url +
                    '" alt="' +
                    _data[i].item.dsp_item_name1 +
                    '"/>'),
                  (_html += '</div>'),
                  (_html += '</div>'),
                  (_html += '</li>')
              for (i = 0; i < 3; i++) _html += _html
              for (
                _this._ul.insertAdjacentHTML('beforeend', _html);
                _this._ul.getElementsByTagName('li').length >= 100;

              )
                _this._ul.removeChild(_this._ul.getElementsByTagName('li')[0]),
                  (_this._currentX += 91),
                  (_this._currentX = Math.min(0, _this._currentX))
              Statics.HAS_CSS
                ? Velocity.hook(_this._ul, 'translateX', _this._currentX + 'px')
                : Velocity.hook(
                    _this._ul,
                    'margin-left',
                    _this._currentX + 'px'
                  ),
                (_this._ul.style.width =
                  91 * _this._ul.getElementsByTagName('li').length + 'px'),
                (_this._spd =
                  (1 * _this._ul.getElementsByTagName('li').length) / 60)
              var _item = _this._ul.querySelectorAll('.standBy')
              for (i = 0; i < _item.length; i++)
                _s.removeClass(_item[i], 'standBy'), new BookItem(_item[i])
              _this._timer ||
                (_this._timer = window.requestAnimFrame(_this.movingList))
            }),
            (this.openSettingPanel = function(e) {
              _this.settingPanelInit(),
                (_this._isPause = !0),
                (_this._setting.style.display = 'block'),
                Velocity(_this._bg, 'stop'),
                Velocity(
                  _this._bg,
                  { opacity: 1 },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                ),
                e.preventDefault(),
                _this.onScrollHD(),
                Velocity(_this._panel, 'stop'),
                Velocity(
                  _this._panel,
                  { opacity: 1, scale: 1 },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.settingPanelInit = function() {
              Statics.TIMELINE &&
                (_s.addClass(_this._settingToggles[0], 'stCurrent'),
                (_this._settingChecks[0].checked = !0))
              var i = 0
              for (i = 1; i < _this._settingChecks.length; i++)
                _this._settingChecks[i].checked &&
                  _s.addClass(_this._settingToggles[i], 'stCurrent')
            }),
            (this.paramChange = function(e) {
              var _index = Array.prototype.indexOf.call(
                  _this._settingChecks,
                  e.currentTarget
                ),
                _hasMoveing = 0 === _index
              if (
                (e.currentTarget.checked
                  ? (_s.addClass(_this._settingToggles[_index], 'stCurrent'),
                    _hasMoveing &&
                      ((Statics.TIMELINE = !0), Cookie.setCookie()))
                  : (_s.removeClass(_this._settingToggles[_index], 'stCurrent'),
                    _hasMoveing &&
                      ((Statics.TIMELINE = !1), Cookie.setCookie())),
                window.CustomEvent)
              )
                try {
                  var event = new CustomEvent('TIMELINE_PARAM_CHANGE', {})
                } catch (e) {
                  var event = document.createEvent('CustomEvent')
                  event.initCustomEvent('TIMELINE_PARAM_CHANGE', !0, !0, {})
                }
              else {
                var event = document.createEvent('CustomEvent')
                event.initCustomEvent('TIMELINE_PARAM_CHANGE', !0, !0, {})
              }
              window.dispatchEvent(event)
            }),
            (this.onParamChange = function() {
              _this._isPause = !Statics.TIMELINE
            }),
            (this.closeSettingPanel = function() {
              Velocity(_this._bg, 'stop'),
                Velocity(
                  _this._bg,
                  { opacity: 0 },
                  { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                ),
                Velocity(_this._panel, 'stop'),
                Velocity(
                  _this._panel,
                  { opacity: 0, scale: 0.8 },
                  {
                    duration: 500,
                    delay: 0,
                    easing: Ease.EaseOutCubic,
                    complete: _this.hideSettingPanel
                  }
                )
            }),
            (this.hideSettingPanel = function() {
              ;(_this._isPause = !1), (_this._setting.style.display = 'none')
            }),
            (this.onScrollHD = function() {
              var _top =
                (document.documentElement &&
                  document.documentElement.scrollTop) ||
                document.body.scrollTop
              _this._panel.style.top = _top + 50 + 'px'
            }),
            (this.pauseHD = function() {
              _this._isPause = !0
            }),
            (this.playHD = function() {
              _this._isPause = !Statics.TIMELINE
            })
          var i = 0
          ;(this._ul = this._node.getElementsByTagName('ul')[0]),
            (this._timeLine = this._node.querySelector('.stBookTimeLine02')),
            (this._btnPrev = this._node.querySelector('.stPrev')),
            (this._btnNext = this._node.querySelector('.stNext')),
            (this._disablePanel = this._node.querySelector('.stDisablePanel')),
            (this._windowSize =
              window.innerWidth || document.documentElement.clientWidth || 0)
          try {
            for (
              this._setting = this._node.querySelector('.stTimelineSetting01'),
                this._bg = this._node.querySelector('.stFloatBg'),
                Velocity.hook(this._bg, 'opacity', '0'),
                this._close = this._node.querySelector('.stBtn.stClose'),
                this._trigger = this._node.querySelector('.stHdg2 a'),
                this._panel = this._node.querySelector('.stSettingPanel01'),
                this._panelBg = this._node.querySelector('.stFloatBg'),
                this._panelSize.w = this._panel.offsetWidth,
                this._panelSize.h = this._panel.offsetHeight,
                Velocity.hook(this._panel, 'opacity', '0'),
                Velocity.hook(this._panel, 'scale', '0.8'),
                this._settingToggles = this._panel.querySelectorAll('p.stBtn'),
                this._settingToggleBtn = this._panel.querySelectorAll('label'),
                this._settingChecks = this._panel.querySelectorAll('input'),
                this._trigger.addEventListener(
                  MouseEvent.CLICK,
                  this.openSettingPanel,
                  !1
                ),
                this._close.addEventListener(
                  MouseEvent.CLICK,
                  this.closeSettingPanel,
                  !1
                ),
                this._panelBg.addEventListener(
                  MouseEvent.CLICK,
                  this.closeSettingPanel,
                  !1
                ),
                i = 0;
              i < this._settingToggles.length;
              i++
            )
              this._settingChecks[i].addEventListener(
                'change',
                this.paramChange,
                !1
              )
          } catch (e) {}
          ;(this._cookie = Cookie.getCookie()),
            (Statics.TIMELINE = !this._cookie || this._cookie.timeline),
            (this._isPause = !Statics.TIMELINE)
          var _url = location.href
          return _url.indexOf('debug') >= 0
            ? ((this._ul.style.display = 'none'),
              _s.addClass(this._btnPrev, 'stDisabled'),
              _s.addClass(this._btnNext, 'stDisabled'),
              void (this._disablePanel.style.display = 'table'))
            : (window.addEventListener(
                'TIMELINE_PARAM_CHANGE',
                this.onParamChange,
                !1
              ),
              this._btnPrev &&
                (this._btnPrev.addEventListener(
                  MouseEvent.MOUSE_DOWN,
                  this.prevHD,
                  !1
                ),
                this._btnPrev.addEventListener(
                  MouseEvent.MOUSE_UP,
                  this.resumeHD,
                  !1
                )),
              this._btnNext &&
                (_s.addClass(this._btnNext, 'stDisabled'),
                this._btnNext.addEventListener(
                  MouseEvent.MOUSE_UP,
                  this.resumeHD,
                  !1
                )),
              Statics.HAS_TOUCH ||
                (this._node.addEventListener(
                  MouseEvent.MOUSE_ENTER,
                  this.pauseHD,
                  !1
                ),
                this._node.addEventListener(
                  MouseEvent.MOUSE_LEAVE,
                  this.playHD,
                  !1
                )),
              this._node.getAttribute('pageblockid')
                ? _url.indexOf('test01') >= 0 || _url.indexOf('192.') >= 0
                  ? void this.loadJson2()
                  : void this.loadJson()
                : void 0)
        }
        return TimeLine
      })()
    module.exports = TimeLine
  },
  function(module, exports) {
    'use strict'
    var API = (function() {
      function API() {}
      return (API.TIME_LINE = '/library/json/timeline.json'), API
    })()
    module.exports = API
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var __extends =
        (this && this.__extends) ||
        function(d, b) {
          function __() {
            this.constructor = d
          }
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p])
          d.prototype =
            null === b
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __())
        },
      EventDispatcher = __webpack_require__(19),
      Event = __webpack_require__(5),
      Loader = (function(_super) {
        function Loader() {
          var _this = this
          _super.call(this),
            (this.method = 'GET'),
            (this.type = 'json'),
            (this.load = function(_param) {
              void 0 === _param && (_param = null)
              var _self = _this
              _param.type && (_this.type = _param.type),
                (_this.request = new XMLHttpRequest()),
                _this.request.open(_this.method, _param.url, !0)
              var _sendData = {}
              void 0 === _param.data || (_sendData = _param.data),
                'POST' === _this.method.toUpperCase() &&
                  _this.request.setRequestHeader(
                    'Content-Type',
                    'application/x-www-form-urlencoded; charset=UTF-8'
                  ),
                (_this.request.onreadystatechange = function() {
                  4 === this.readyState &&
                    (this.status >= 200 && this.status < 400
                      ? ((_self.content = this.responseText),
                        _self.type.indexOf('json') >= 0 &&
                          (_self.content = JSON.parse(_self.content)),
                        _self.dispatchEvent(Event.COMPLETE))
                      : _self.dispatchEvent(Event.IO_ERROR))
                }),
                _this.request.send(_sendData)
            }),
            (this.unload = function() {
              _this.content = void 0
            }),
            (this.close = function() {
              _this.request.abort(),
                _this.request.removeEventListener('onreadystatechange'),
                (_this.request = void 0)
            }),
            (this.EncodeHTMLForm = function(data) {
              var params = []
              for (var name in data) {
                var value = data[name],
                  param =
                    encodeURIComponent(name) + '=' + encodeURIComponent(value)
                params.push(param)
              }
              return params.join('&').replace(/%20/g, '+')
            })
        }
        return __extends(Loader, _super), Loader
      })(EventDispatcher)
    module.exports = Loader
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var __extends =
        (this && this.__extends) ||
        function(d, b) {
          function __() {
            this.constructor = d
          }
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p])
          d.prototype =
            null === b
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __())
        },
      _s = __webpack_require__(1),
      CarouselEngine = __webpack_require__(18),
      Event = __webpack_require__(5),
      MouseEvent = __webpack_require__(3),
      Selection = (function(_super) {
        function Selection(_target) {
          var _this = this
          _super.call(this, {
            _node: _target.querySelector('.stStaticCarousel01'),
            slideSpan: 520,
            loop: !0,
            snap: !0,
            auto: !1
          }),
            (this._target = _target),
            (this._indexList = []),
            (this._prevHeight = 0),
            (this._ajustText = function() {
              var i = 0,
                _toHeight = 0
              for (i = 0; i < _this._slideNodes.length; i++)
                _toHeight = Math.max(
                  _this._slideNodes[i].offsetHeight,
                  _toHeight
                )
              _this._prevHeight !== _toHeight &&
                ((_this._prevHeight = _toHeight),
                (_this._view.style.height = _toHeight + 'px'))
            }),
            (this.onResize = function() {
              var _toWidth = _this._target.offsetWidth - 407
              ;(_this._targetNode.style.width = _toWidth + 'px'),
                _this.resize(_toWidth)
            }),
            (this.directChoose = function(e) {
              ;(_this._currentSlide = Array.prototype.indexOf.call(
                _this._indexList,
                e.currentTarget
              )),
                _this.directChange(null)
            }),
            (this._setIndexItem = function() {
              var i = 0
              for (i = 0; i < _this._indexList.length; i++)
                i === _this._currentSlide
                  ? _this.setCurrent(_this._indexList[i])
                  : _this.resetCurrent(_this._indexList[i])
            }),
            (this.setCurrent = function(_item) {
              _s.addClass(_item, 'stCurrent')
            }),
            (this.resetCurrent = function(_item) {
              _s.removeClass(_item, 'stCurrent')
            }),
            (this.onChange = function(e) {
              _this._setIndexItem()
            }),
            (this._targetNode = this._target.querySelector(
              '.stStaticCarousel01'
            )),
            (this._view = this._targetNode.querySelector('.stView'))
          var i = 0
          for (
            this._indexList = this._target.querySelectorAll(
              '.stSelectionIndex li'
            ),
              i = 0;
            i < this._indexList.length;
            i++
          )
            this._indexList[i].addEventListener(
              MouseEvent.CLICK,
              this.directChoose,
              !1
            )
          this._slideNodes = this._target.querySelectorAll(
            '.stStaticCarousel01 li'
          )
          try {
            this.addEventListener(Event.CHANGE, this.onChange, !1)
          } catch (e) {
            jQuery(window).bind('SLIDE_CHANGE', this.onChange)
          }
          this._setIndexItem(),
            window.addEventListener(Event.RESIZE, this.onResize, !1),
            this.onResize(),
            setInterval(this._ajustText, 500)
        }
        return __extends(Selection, _super), Selection
      })(CarouselEngine)
    module.exports = Selection
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Event = __webpack_require__(5),
      Ease = __webpack_require__(6),
      BookShelf = (function() {
        function BookShelf(_node) {
          var _this = this
          ;(this._node = _node),
            (this._items = []),
            (this._images = []),
            (this._prevX = []),
            (this._prevY = []),
            (this._gotoX = []),
            (this._gotoY = []),
            (this._isFirst = !0),
            (this._img = new Image()),
            (this._width = 0),
            (this._height = 0),
            (this.prepResizeHD = function() {
              _this._resizeTimer && clearTimeout(_this._resizeTimer),
                (_this._resizeTimer = setTimeout(_this.onResizeHD, 400))
            }),
            (this.onResizeHD = function() {
              _this.clone()
              var i = 0
              for (i = 0; i < _this._items.length; i++)
                _this._items[i].style.width = 'auto'
            }),
            (this.clone = function() {
              var i = 0
              for (
                _this._prevX = [], _this._prevY = [], i = 0;
                i < _this._gotoX.length;
                i++
              )
                _this._prevX.push(_this._gotoX[i]),
                  _this._prevY.push(_this._gotoY[i])
            }),
            (this.setUp = function() {
              _this._isFirst = !1
              var i = 0
              for (i = 0; i < _this._items.length; i++)
                (_this._items[i].style.left = _this._gotoX[i] + 'px'),
                  (_this._items[i].style.top = _this._gotoY[i] + 'px')
            }),
            (this.update = function() {
              var i = 0
              for (i = 0; i < _this._items.length; i++) {
                var _toX = _this._gotoX[i],
                  _toY = _this._gotoY[i]
                if (
                  (Velocity(_this._items[i], 'stop'), _toY === _this._prevY[i])
                )
                  Velocity(
                    _this._items[i],
                    { left: _toX, top: _toY },
                    { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                  )
                else {
                  var _hideX =
                      _toY < _this._prevY[i]
                        ? -_this._prevX[i] - 80
                        : _this._node.offsetWidth,
                    _showX =
                      _toY < _this._prevY[i]
                        ? _this._node.offsetWidth + _this._prevX[i]
                        : -_this._prevX[i]
                  Velocity(
                    _this._items[i],
                    { left: _hideX },
                    { duration: 250, delay: 0, easing: Ease.EaseOutCubic }
                  ),
                    Velocity(
                      _this._items[i],
                      { top: _this._gotoY[i], left: _showX },
                      { duration: 0, delay: 0, easing: Ease.EaseOutCubic }
                    ),
                    Velocity(
                      _this._items[i],
                      { left: _this._gotoX[i] },
                      { duration: 250, delay: 0, easing: Ease.EaseOutCubic }
                    )
                }
              }
            }),
            (this._contents = this._node.querySelector('.stContents')),
            (this._items = this._contents.querySelectorAll('li')),
            (this._images = this._contents.querySelectorAll('img')),
            window.addEventListener(Event.RESIZE, this.prepResizeHD, !1),
            window.addEventListener('load', this.onResizeHD, !1)
        }
        return BookShelf
      })()
    module.exports = BookShelf
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      Cookie = __webpack_require__(15),
      GenreNaviDetail = __webpack_require__(31),
      GenreNavi = (function() {
        function GenreNavi(_node) {
          var _this = this
          if (
            ((this._node = _node),
            (this._currentIndex = 0),
            (this._isSafe = !0),
            (this._triAngle = []),
            (this._safeTime = 1e3),
            (this._isLoaded = []),
            (this._isFirst = !1),
            (this._hasContainer = !1),
            (this._isOpen = !1),
            (this.setUpCore = function() {
              Statics.HAS_TOUCH
                ? (_this._trigger.addEventListener(
                    MouseEvent.MOUSE_DOWN,
                    _this.toggleHD,
                    !1
                  ),
                  document
                    .getElementById('areaWrapper1')
                    .addEventListener(
                      MouseEvent.MOUSE_DOWN,
                      _this.hideNavigation,
                      !1
                    ))
                : (_this._node.addEventListener(
                    MouseEvent.MOUSE_ENTER,
                    _this.showNavigation,
                    !1
                  ),
                  _this._node.addEventListener(
                    MouseEvent.MOUSE_LEAVE,
                    _this.hideNavigation,
                    !1
                  ))
            }),
            (this.setUpDetail = function() {
              ;(_this._detailList = _this._node.querySelectorAll(
                '.genreNaviDetail01'
              )),
                _this._detailList || (_this._detailList = void 0)
            }),
            (this.setUpList = function() {
              if (
                ((_this._list = _this._node.querySelector('.genreList01')),
                _this._list ||
                  (_this._list = _this._node.querySelector('.genreList03')),
                _this._list)
              ) {
                ;(_this._listItem = _this._list.querySelectorAll('li')),
                  _this._list.insertAdjacentHTML(
                    'afterbegin',
                    '<li class="stCurrent" id="el_' + Statics.PREFIX + '"></li>'
                  ),
                  (_this._current = document.getElementById(
                    'el_' + Statics.PREFIX
                  )),
                  Statics.PREFIX++,
                  (_this._current.style.opacity = 0)
                var i = 0
                for (i = 0; i < _this._listItem.length; i++)
                  if (
                    (_this._listItem[i].addEventListener(
                      MouseEvent.MOUSE_ENTER,
                      _this.onListOver,
                      !1
                    ),
                    _this._isLoaded.push(!1),
                    Statics.HAS_TOUCH)
                  ) {
                    var href = _this._listItem[i].querySelector('a').href
                    if (_this._genreNaviDetails[i]) {
                      var targetElm = _this._genreNaviDetails[i].querySelector(
                        'h3'
                      )
                      targetElm.outerHTML =
                        '<a href="' + href + '">' + targetElm.outerHTML + '</a>'
                    }
                  }
              }
            }),
            (this.loadCookie = function() {
              ;(_this._cookie = Cookie.getCookie()),
                (Statics.GENRENAVI =
                  !!_this._cookie && _this._cookie.genrenavi),
                1 != Statics.GENRENAVI && _this.showNavigation()
            }),
            (this.onListOver = function(e) {
              if (
                ((_this._currentIndex = Array.prototype.indexOf.call(
                  _this._listItem,
                  e.currentTarget
                )),
                _s.addClass(_this._trigger, 'stCurrent'),
                _this._detailList)
              ) {
                var _atag = e.currentTarget.querySelector('a'),
                  _path = _atag.getAttribute('data-path')
                !_this._isLoaded[_this._currentIndex] &&
                  _path &&
                  ((_this._isLoaded[_this._currentIndex] = !0),
                  new GenreNaviDetail(
                    _this._detailList[_this._currentIndex].querySelector(
                      '.stContents'
                    ),
                    _path
                  ))
                var _rect = _this.getBounds(_this._list),
                  _cursorX = e.pageX - _rect.left,
                  _cursorY = e.pageY - _rect.top
                if (
                  (_cursorX ||
                    ((_cursorX =
                      e.clientX +
                      document.body.scrollLeft +
                      document.documentElement.scrollLeft -
                      _rect.left),
                    (_cursorY =
                      e.clientY +
                      document.body.scrollTop +
                      document.documentElement.scrollTop -
                      _rect.top)),
                  !_this._isSafe &&
                    _this.calc(
                      _this._triAngle[0],
                      _this._triAngle[1],
                      _this._triAngle[2],
                      { x: _cursorX, y: _cursorY }
                    ))
                )
                  return
                for (
                  _this._safeTimer && clearTimeout(_this._safeTimer),
                    _this._safeTimer = setTimeout(
                      _this.toSafe,
                      _this._safeTime
                    ),
                    _this._isSafe = !1,
                    _this._triAngle = [],
                    _this._triAngle.push({ x: _cursorX, y: _cursorY }),
                    _this._triAngle.push({ x: 252, y: 0 }),
                    _this._triAngle.push({
                      x: 252,
                      y: _this._inner.offsetHeight
                    }),
                    i = 0;
                  i < _this._detailList.length;
                  i++
                )
                  _this._detailList[i].style.display =
                    i === _this._currentIndex ? 'block' : 'none'
              }
              var i = 0
              for (i = 0; i < _this._listItem.length; i++)
                i === _this._currentIndex
                  ? _s.addClass(_this._listItem[i], 'stActive')
                  : _s.removeClass(_this._listItem[i], 'stActive')
              Velocity(_this._current, 'stop'),
                Velocity(
                  _this._current,
                  { top: e.currentTarget.offsetTop, opacity: 1 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.toSafe = function() {
              _this._isSafe = !0
            }),
            (this.calcVector = function(_a, _b) {
              var _returnVec = { x: 0, y: 0 }
              return (
                (_returnVec.x = _a.x - _b.x),
                (_returnVec.y = _a.y - _b.y),
                _returnVec
              )
            }),
            (this.calc = function(_a, _b, _c, _p) {
              var _ab = _this.calcVector(_b, _a),
                _bp = _this.calcVector(_p, _b),
                _bc = _this.calcVector(_c, _b),
                _cp = _this.calcVector(_p, _c),
                _ca = _this.calcVector(_a, _c),
                _ap = _this.calcVector(_p, _a),
                _c1 = _ab.x * _bp.y - _ab.y * _bp.x,
                _c2 = _bc.x * _cp.y - _bc.y * _cp.x,
                _c3 = _ca.x * _ap.y - _ca.y * _ap.x
              return (
                (_c1 > 0 && _c2 > 0 && _c3 > 0) ||
                (_c1 < 0 && _c2 < 0 && _c3 < 0)
              )
            }),
            (this.getBounds = function(_elem) {
              var rect = _elem.getBoundingClientRect()
              return {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
              }
            }),
            (this.showNavigation = function() {
              var self = _this
              _s.addClass(_this._trigger, 'stCurrent'),
                Velocity(_this._navigation, 'stop'),
                Velocity(
                  _this._navigation,
                  { height: _this._inner.offsetHeight },
                  {
                    duration: 500,
                    delay: 0,
                    easing: Ease.EaseOutCubic,
                    complete: function() {
                      self._isOpen = !0
                    }
                  }
                ),
                _this._list &&
                  _this.onListOver({ currentTarget: _this._listItem[0] })
            }),
            (this.hideNavigation = function(e) {
              var target = e.target,
                flg = !0
              if (Statics.HAS_TOUCH)
                for (; target !== document.getElementById('page'); ) {
                  if (target === _this._stBtMyResult) {
                    flg = !1
                    break
                  }
                  if (target === _this._trigger) {
                    flg = !!_this._isOpen
                    break
                  }
                  target = target.parentNode
                }
              if (flg) {
                if (
                  ((_this._isOpen = !1),
                  (Statics.GENRENAVI = !0),
                  Cookie.setCookie(),
                  _s.removeClass(_this._trigger, 'stCurrent'),
                  Velocity(_this._navigation, 'stop'),
                  Velocity(
                    _this._navigation,
                    { height: 0 },
                    { duration: 500, delay: 0, easing: Ease.EaseOutCubic }
                  ),
                  !_this._current)
                )
                  return
                _this._current.style.opacity = 0
              }
            }),
            (this.toggleHD = function(e) {
              _this._isOpen ? _this.hideNavigation(e) : _this.showNavigation()
            }),
            (this._trigger = this._node.querySelector('.stTrigger')),
            (this._navigation = this._node.querySelector('.stBlock')),
            (this._inner = this._node.querySelector('.stBlockInner')),
            (this._genreListTags = this._node.querySelector('.genreListTags')),
            (this._tabContainer = document.body.querySelector(
              '.stTabContainer01'
            )),
            (this._genreNaviDetails = this._inner.querySelectorAll(
              '.genreNaviDetail01'
            )),
            (this._stBtMyResult = document.body.querySelector('.stBtMyResult')),
            (this._wrapper = this._node.parentNode),
            this.setUpCore(),
            this.setUpDetail(),
            this.setUpList(),
            this.loadCookie(),
            this._genreListTags && this._tabContainer)
          ) {
            for (
              this._genreListTags.style.height =
                this._inner.offsetHeight + 'px';
              !this._hasContainer;

            )
              (this._wrapper = this._wrapper.parentNode),
                (this._hasContainer = _s.hasClass(
                  this._wrapper,
                  'stTabContainer01'
                ))
            this._inner.offsetHeight > this._tabContainer.offsetHeight &&
              (this._wrapper.style.height =
                this._inner.offsetHeight + 150 + 'px')
          }
        }
        return GenreNavi
      })()
    module.exports = GenreNavi
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Loader = __webpack_require__(27),
      Event = __webpack_require__(5),
      Ease = __webpack_require__(6),
      BookItem = __webpack_require__(13),
      GenreNaviDetail = (function() {
        function GenreNaviDetail(_target, _path) {
          var _this = this
          ;(this._target = _target),
            (this._path = _path),
            (this.onLoadComplete = function() {
              _this._loader.removeEventListener(
                Event.COMPLETE,
                _this.onLoadComplete,
                !1
              )
              var _loadingImg = _this._target.querySelector('.stLoader')
              _loadingImg.parentNode.removeChild(_loadingImg),
                (_loadingImg = void 0),
                _this._target.insertAdjacentHTML(
                  'beforeend',
                  _this._loader.content
                )
              var _contents = _this._target.querySelector('.genreNaviDetail02')
              ;(_contents.style.opacity = 0),
                Velocity(
                  _contents,
                  { opacity: 1 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutSine }
                )
              var i = 0,
                _item = _this._target.querySelectorAll('.stBookItem')
              for (i = 0; i < _item.length; i++) new BookItem(_item[i])
            }),
            (this._loader = new Loader())
          var _date = new Date()
          this._loader.addEventListener(
            Event.COMPLETE,
            this.onLoadComplete,
            !1
          ),
            this._loader.load({
              type: 'text',
              url:
                this._path +
                '.html?rev_' +
                _date.getDate() +
                '_' +
                _date.getHours()
            })
        }
        return GenreNaviDetail
      })()
    module.exports = GenreNaviDetail
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Event = __webpack_require__(5),
      BookShelfLiquidItem = __webpack_require__(33),
      BookShelfLiquid = (function() {
        function BookShelfLiquid(_node) {
          var _this = this
          ;(this._node = _node),
            (this.onResizeHD = function() {
              _this._ul.removeAttribute('style')
              var _itemCount = Math.floor(_this._ul.offsetWidth / 119)
              _this._ul.style.width = 119 * _itemCount + 20 + 'px'
            }),
            (this._ul = this._node.querySelector('ul'))
          var _li = this._ul.querySelectorAll('li'),
            i = 0
          for (i = 0; i < _li.length; i++) new BookShelfLiquidItem(_li[i])
          window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
            this.onResizeHD()
        }
        return BookShelfLiquid
      })()
    module.exports = BookShelfLiquid
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      BookShelfLiquidItem = (function() {
        function BookShelfLiquidItem(_node) {
          var _this = this
          ;(this._node = _node),
            (this.overHD = function() {
              Statics.HAS_TOUCH ||
                ((_this._contents.style.display = 'block'),
                Velocity.hook(_this._contents, 'translateY', '10px'),
                Velocity.hook(_this._contents, 'opacity', '0'),
                Velocity(
                  _this._contents,
                  { opacity: 1, translateY: 0 },
                  { duration: 300, delay: 0, easing: Ease.EaseOutCubic }
                ))
            }),
            (this.outHD = function() {
              Statics.HAS_TOUCH ||
                Velocity(
                  _this._contents,
                  { opacity: 0, translateY: 10 },
                  {
                    duration: 300,
                    delay: 0,
                    easing: Ease.EaseOutCubic,
                    complete: _this.hideComplete
                  }
                )
            }),
            (this.hideComplete = function() {
              _this._contents.style.display = 'none'
            }),
            (this._contents = this._node.querySelector('.stContents')),
            this._contents &&
              (this._node.addEventListener(
                MouseEvent.MOUSE_ENTER,
                this.overHD,
                !1
              ),
              this._node.addEventListener(
                MouseEvent.MOUSE_LEAVE,
                this.outHD,
                !1
              ))
        }
        return BookShelfLiquidItem
      })()
    module.exports = BookShelfLiquidItem
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Event = __webpack_require__(5),
      StBoxStore = (function() {
        function StBoxStore(_node) {
          var _this = this
          ;(this._node = _node),
            (this._targets = []),
            (this.onResizeHD = function() {
              var _height = 0,
                i = 0
              for (_this._targets = [], i = 0; i < _this._items.length; i++)
                _this._targets.push(_this._items[i].querySelector('p'))
              for (i = 0; i < _this._targets.length; i++)
                _height = Math.max(_height, _this._targets[i].offsetHeight)
              for (i = 0; i < _this._targets.length; i++)
                _this._targets[i].style.height = _height + 'px'
            })
          var i = 0
          for (
            this._items = this._node.querySelectorAll('.stBlockInner'), i = 0;
            i < this._items.length;
            i++
          )
            this._targets.push(this._items[i].querySelector('p'))
          window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
            this.onResizeHD()
        }
        return StBoxStore
      })()
    module.exports = StBoxStore
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      Event = __webpack_require__(5),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      MoreAccordion = (function() {
        function MoreAccordion(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this.toggleHD = function() {
              ;(_this._isOpen = !_this._isOpen),
                _this._isOpen ? _this.show() : _this.hide()
            }),
            (this.show = function() {
              _s.addClass(_this._node, 'stCurrent'),
                (_this._trigger.innerHTML = '閉じる'),
                Velocity(_this._view, 'stop'),
                Velocity(
                  _this._view,
                  { height: _this._inner.offsetHeight },
                  { duration: 600, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function() {
              _s.removeClass(_this._node, 'stCurrent'),
                (_this._trigger.innerHTML = '続きを読む'),
                Velocity(_this._view, 'stop'),
                Velocity(
                  _this._view,
                  { height: 72 },
                  { duration: 600, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.onResizeHD = function() {
              var _height = _this._inner.offsetHeight
              ;(_this._isOpen = !1),
                _s.removeClass(_this._node, 'stCurrent'),
                Velocity.hook(_this._view, 'height', '72px'),
                (_this._trigger.style.display =
                  _height <= _this._view.offsetHeight ? 'none' : 'block')
            }),
            (this._view = this._node.querySelector('.stAccordionView')),
            (this._inner = this._node.querySelector('.stAccordionInner')),
            (this._trigger = this._node.querySelector('.stTrigger')),
            window.addEventListener(Event.RESIZE, this.onResizeHD, !1),
            this.onResizeHD(),
            this._trigger.addEventListener(MouseEvent.CLICK, this.toggleHD, !1)
        }
        return MoreAccordion
      })()
    module.exports = MoreAccordion
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var MouseEvent = __webpack_require__(3),
      JapanMap = (function() {
        function JapanMap(_node) {
          var _this = this
          ;(this._node = _node),
            (this.overHD = function(e) {
              switch (
                Array.prototype.indexOf.call(_this._imageMap, e.currentTarget)
              ) {
                case 0:
                  _this._node.style.backgroundPosition = '0px -3204px'
                  break
                case 1:
                  _this._node.style.backgroundPosition = '0px -2670px'
                  break
                case 2:
                  _this._node.style.backgroundPosition = '0px -3738px'
                  break
                case 3:
                  _this._node.style.backgroundPosition = '0px -4272px'
                  break
                case 4:
                  _this._node.style.backgroundPosition = '0px -4806px'
                  break
                case 5:
                  _this._node.style.backgroundPosition = '0px -2136px'
                  break
                case 6:
                  _this._node.style.backgroundPosition = '0px -1602px'
                  break
                case 7:
                  _this._node.style.backgroundPosition = '0px -534px'
                  break
                case 8:
                  _this._node.style.backgroundPosition = '0px -1068px'
                  break
                case 9:
                  _this._node.style.backgroundPosition = '0px 0px'
                  break
                case 10:
                  _this._node.style.backgroundPosition = '0px -5874px'
              }
            }),
            (this.outHD = function(e) {}),
            (this._imageMap = this._node.querySelectorAll('area'))
          var i = 0
          for (i = 0; i < this._imageMap.length; i++)
            this._imageMap[i].addEventListener(
              MouseEvent.MOUSE_ENTER,
              this.overHD,
              !1
            ),
              this._imageMap[i].addEventListener(
                MouseEvent.MOUSE_LEAVE,
                this.outHD,
                !1
              )
        }
        return JapanMap
      })()
    module.exports = JapanMap
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _d = __webpack_require__(1),
      CarouselEngine = __webpack_require__(18),
      BookItem = __webpack_require__(13),
      BookTreeCarousel = (function() {
        function BookTreeCarousel(_node) {
          var _this = this
          ;(this._node = _node),
            (this._list = []),
            (this._isSet = !1),
            (this.addClass = function() {
              var i = 0
              for (i = 0; i < _this._list.length; i = (i + 1) | 0) {
                var _class = 'stCount' + ((i % 8) + 1)
                _d.addClass(_this._list[i], _class)
              }
            }),
            (this.carc = function() {
              var i = 0,
                _x = 0,
                _y = 0,
                _spacePoint = null,
                _maxX = 0
              for (i = 0; i < _this._list.length; i = (i + 1) | 0) {
                var _gotoX = _x,
                  _gotoY = _y
                _spacePoint
                  ? ((_gotoX = _spacePoint.x),
                    (_gotoY = _spacePoint.y),
                    (_spacePoint = null))
                  : _gotoY + _this._list[i].offsetHeight > 300 &&
                    ((_spacePoint = { x: _gotoX, y: _gotoY }),
                    (_gotoX += 196),
                    (_gotoY = 0))
                var _style = _this._list[i].style
                ;(_style.position = 'absolute'),
                  (_style.left = _gotoX + 'px'),
                  (_style.top = _gotoY + 'px'),
                  (_y = _gotoY + _this._list[i].offsetHeight),
                  _y >= 298 &&
                    ((_y = 0),
                    (_x += _this._list[i].offsetWidth),
                    i % 8 === 6 && (_y += 122)),
                  (_maxX = Math.max(_maxX, _x))
              }
              ;(_this._ul.style.width = _maxX + 'px'), _this.setup(_maxX)
            }),
            (this.setup = function(_maxX) {
              new CarouselEngine({
                _node: _this._node,
                slideSpan: 1260,
                loop: !0,
                snap: !0,
                auto: !1,
                hasItems: !0
              })
              var _item = _this._node.querySelectorAll('.stBookItem'),
                i = 0
              for (i = 0; i < _item.length; i = (i + 1) | 0)
                new BookItem(_item[i])
            }),
            (this._ul = this._node.getElementsByTagName('li')[0]),
            this._ul &&
              ((this._list = this._ul.querySelectorAll('.stBookTreeItem')),
              this._list.length && (this.addClass(), this.carc()))
        }
        return BookTreeCarousel
      })()
    module.exports = BookTreeCarousel
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var __extends =
        (this && this.__extends) ||
        function(d, b) {
          function __() {
            this.constructor = d
          }
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p])
          d.prototype =
            null === b
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __())
        },
      CarouselEngine = __webpack_require__(18),
      BookTreeDetailCarousel = (function(_super) {
        function BookTreeDetailCarousel(_node) {
          _super.call(this, {
            _node: _node,
            slideSpan: 874,
            loop: !0,
            snap: !0,
            auto: !1
          })
        }
        return __extends(BookTreeDetailCarousel, _super), BookTreeDetailCarousel
      })(CarouselEngine)
    module.exports = BookTreeDetailCarousel
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var Statics = __webpack_require__(2),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      _s = __webpack_require__(1),
      PullDown = (function() {
        function PullDown(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this._isOver = !1),
            (this._hasWrapper = !1),
            (this.toggleHD = function(e) {
              _this._isOpen ? _this.hideHD(e) : _this.showHD(e)
            }),
            (this.showHD = function(e) {
              ;(_this._contents.style.display = 'block'),
                (_this._contents.style.zIndex = 100),
                Velocity(_this._contents, 'stop'),
                Velocity(
                  _this._contents,
                  { opacity: 1 },
                  {
                    duration: 500,
                    delay: 0,
                    easing: Ease.EaseOutCubic,
                    complete: _this.outHD
                  }
                )
            }),
            (this.hideHD = function(e) {
              _this._isOver ||
                ((_this._isOpen = !1),
                (!Statics.HAS_TOUCH ||
                  (e.target !== _this._node &&
                    e.target.parentNode !== _this._node)) &&
                  ((_this._contents.style.zIndex = 'initial'),
                  Velocity(_this._contents, 'stop'),
                  Velocity(
                    _this._contents,
                    { opacity: 0 },
                    {
                      duration: 200,
                      delay: 0,
                      easing: Ease.EaseOutCubic,
                      complete: _this.hide
                    }
                  )))
            }),
            (this.hide = function() {
              ;(_this._contents.style.display = 'none'),
                (_this._isOpen = !1),
                (_this._isOver = !0)
            }),
            (this.overHD = function(e) {
              _this._isOver = !0
            }),
            (this.outHD = function(e) {
              _this._isOver = !1
            }),
            (this._nav = this._node.querySelector('.stPullDownHook')),
            (this._contents = this._node.querySelector('.stPullDownList')),
            (this._list = this._contents.querySelectorAll('li')),
            (this._wrapper = this._node.parentNode),
            (this._hasWrapper = _s.hasClass(this._wrapper, 'pbNestedWrapper'))
          for (var i = 0; this._list.length > i; i++)
            _s.hasClass(this._list[i], 'stCurrent') &&
              (this._nav.innerText = this._list[i].innerText)
          for (; !this._hasWrapper; )
            (this._wrapper = this._wrapper.parentNode),
              (this._hasWrapper = _s.hasClass(this._wrapper, 'pbNestedWrapper'))
          ;(this._wrapper.style.overflow = 'visible'),
            this._nav.addEventListener(MouseEvent.CLICK, this.toggleHD, !1),
            document.body.addEventListener(MouseEvent.CLICK, this.hideHD, !1),
            this._node.addEventListener(MouseEvent.MOUSE_OVER, this.overHD, !1),
            this._node.addEventListener(MouseEvent.MOUSE_LEAVE, this.outHD, !1)
        }
        return PullDown
      })()
    module.exports = PullDown
  },
  function(module, exports, __webpack_require__) {
    'use strict'
    var _s = __webpack_require__(1),
      MouseEvent = __webpack_require__(3),
      Ease = __webpack_require__(6),
      CouponDetailAccordion = (function() {
        function CouponDetailAccordion(_node) {
          var _this = this
          ;(this._node = _node),
            (this._isOpen = !1),
            (this.toggleHD = function() {
              ;(_this._isOpen = !_this._isOpen),
                _this._isOpen ? _this.show() : _this.hide()
            }),
            (this.hideHD = function() {
              ;(_this._isOpen = !1), _this.hide()
            }),
            (this.show = function() {
              var _toHeight = _this._inner.offsetHeight
              ;(_this._spd = (1e3 * _toHeight) / 1500),
                _s.addClass(_this._trigger, 'current'),
                (_this._trigger.innerHTML = '閉じる'),
                Velocity(_this._view, 'stop'),
                Velocity(
                  _this._view,
                  { height: _toHeight },
                  { duration: _this._spd, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this.hide = function() {
              _s.removeClass(_this._trigger, 'current'),
                (_this._trigger.innerHTML = 'クーポン詳細'),
                Velocity(_this._view, 'stop'),
                Velocity(
                  _this._view,
                  { height: 0 },
                  { duration: _this._spd, delay: 0, easing: Ease.EaseOutCubic }
                )
            }),
            (this._trigger = this._node.querySelector(
              '.coupon-detail-accordion__trigger'
            )),
            (this._view = this._node.querySelector(
              '.coupon-detail-accordion__view'
            )),
            (this._inner = this._node.querySelector(
              '.coupon-detail-accordion__inner'
            )),
            this._trigger.addEventListener(MouseEvent.CLICK, this.toggleHD, !1)
        }
        return CouponDetailAccordion
      })()
    module.exports = CouponDetailAccordion
  },
  function(module, exports) {
    'use strict'
    var HdgSearch = (function() {
      function HdgSearch(_node, _ajax) {
        var _this = this
        return (
          (this._node = _node),
          (this._ajax = _ajax),
          (this.constructForStyleguide = function(_node) {
            ;(_this._orderSelect = _this._node.querySelector(
              '.stHdgSearchOrderSelect'
            )),
              (_this._orderLabel = _this._node.querySelector(
                '.stHdgSearchOrderLabel'
              )),
              _this._orderSelect.addEventListener(
                'change',
                _this.changeSelectOrder,
                !1
              ),
              _this.changeLabel(_this._orderSelect, _this._orderLabel, 5),
              (_this._keyword = _this._node.querySelectorAll(
                '.stHdgSearchKeyword'
              )),
              (_this._textbox = _this._node.querySelector(
                '.stHdgSearchTextbox'
              ))
            for (var i = 0; i < _this._keyword.length; i++)
              _this._keyword[i].addEventListener(
                'click',
                _this.clickKeyword,
                !1
              )
          }),
          (this.changeSelectOrder = function(e) {
            _this.changeLabel(_this._orderSelect, _this._orderLabel, 5)
          }),
          (this.changeLabel = function(_select, _label, _limit) {
            for (
              var elements = _select.options, i = 0;
              i < elements.length;
              i++
            )
              if (elements[i].selected) {
                var output = elements[i].textContent
                elements[i].textContent.length > _limit &&
                  (output = elements[i].textContent.substring(0, _limit)),
                  '並び順の変更' === elements[i].textContent &&
                    (output = '並び順'),
                  (_label.textContent = output)
                break
              }
          }),
          (this.clickKeyword = function(e) {
            _this._textbox.value = e.srcElement.textContent
          }),
          (this.constructForFrontend = function(_node) {
            ;(_this._pageBlockId = _this._node.querySelector(
              '.stHdgSearchBlockId'
            ).value),
              (_this._orderSelect = _this._node.querySelector(
                '.stHdgSearchOrderSelect'
              )),
              (_this._orderLabel = _this._node.querySelector(
                '.stHdgSearchOrderLabel'
              )),
              _this._orderSelect.addEventListener(
                'change',
                _this.changeSelectOrderAndReload,
                !1
              ),
              _this.changeLabel(_this._orderSelect, _this._orderLabel, 5),
              (_this._genreSelect = _this._node.querySelector('.stSelectbox')),
              _this._genreSelect.addEventListener(
                'change',
                _this.changeSelectGenreAndReload,
                !1
              ),
              (_this._textbox = _this._node.querySelector(
                '.stHdgSearchTextbox'
              )),
              (_this._keyword = _this._node.querySelectorAll(
                '.stHdgSearchKeyword'
              ))
            for (var i = 0; i < _this._keyword.length; i++)
              _this._keyword[i].addEventListener(
                'click',
                _this.clickKeywordAndReload,
                !1
              )
            _this._node
              .querySelector('.stHdgSearchButton')
              .addEventListener('click', _this.clickSearchButton, !1)
          }),
          (this.changeSelectOrderAndReload = function(e) {
            _this.changeLabel(_this._orderSelect, _this._orderLabel, 5),
              _this.reloadBlock()
          }),
          (this.changeSelectGenreAndReload = function(e) {
            _this.reloadBlock()
          }),
          (this.clickKeywordAndReload = function(e) {
            ;(_this._textbox.value = e.srcElement.textContent),
              _this.reloadBlock()
          }),
          (this.clickSearchButton = function(e) {
            _this.reloadBlock()
          }),
          (this.reloadBlock = function() {
            for (
              var objParam = {},
                orderElements = _this._orderSelect.options,
                i = 0;
              i < orderElements.length;
              i++
            )
              if (orderElements[i].selected) {
                var orderParam = orderElements[i].value
                objParam.srt = orderParam
                break
              }
            for (
              var genreElements = _this._genreSelect.options, i = 0;
              i < genreElements.length;
              i++
            )
              if (genreElements[i].selected) {
                var genreParam = genreElements[i].value
                objParam.gnrcd = genreParam
                break
              }
            objParam.k = _this._textbox.value
            var pageBlockElement = document.querySelector(
                '#pbBlock' + _this._pageBlockId
              ),
              elementHeight = pageBlockElement.clientHeight
            ;(pageBlockElement.style.height = elementHeight + 'px'),
              window.HC.Ajax.update(
                _this._pageBlockId,
                'pbBlock' + _this._pageBlockId,
                objParam,
                !0,
                pageBlockElement,
                function() {
                  pageBlockElement.style.height = null
                }
              )
          }),
          _ajax
            ? void this.constructForFrontend(_node)
            : void this.constructForStyleguide(_node)
        )
      }
      return HdgSearch
    })()
    module.exports = HdgSearch
  }
])
/*! lazysizes - v4.0.1 */
!(function(a, b) {
  var c = b(a, a.document)
  ;(a.lazySizes = c),
    'object' == typeof module && module.exports && (module.exports = c)
})(window, function(a, b) {
  'use strict'
  if (b.getElementsByClassName) {
    var c,
      d,
      e = b.documentElement,
      f = a.Date,
      g = a.HTMLPictureElement,
      h = 'addEventListener',
      i = 'getAttribute',
      j = a[h],
      k = a.setTimeout,
      l = a.requestAnimationFrame || k,
      m = a.requestIdleCallback,
      n = /^picture$/i,
      o = ['load', 'error', 'lazyincluded', '_lazyloaded'],
      p = {},
      q = Array.prototype.forEach,
      r = function(a, b) {
        return (
          p[b] || (p[b] = new RegExp('(\\s|^)' + b + '(\\s|$)')),
          p[b].test(a[i]('class') || '') && p[b]
        )
      },
      s = function(a, b) {
        r(a, b) ||
          a.setAttribute('class', (a[i]('class') || '').trim() + ' ' + b)
      },
      t = function(a, b) {
        var c
        ;(c = r(a, b)) &&
          a.setAttribute('class', (a[i]('class') || '').replace(c, ' '))
      },
      u = function(a, b, c) {
        var d = c ? h : 'removeEventListener'
        c && u(a, b),
          o.forEach(function(c) {
            a[d](c, b)
          })
      },
      v = function(a, d, e, f, g) {
        var h = b.createEvent('CustomEvent')
        return (
          e || (e = {}),
          (e.instance = c),
          h.initCustomEvent(d, !f, !g, e),
          a.dispatchEvent(h),
          h
        )
      },
      w = function(b, c) {
        var e
        !g && (e = a.picturefill || d.pf)
          ? e({ reevaluate: !0, elements: [b] })
          : c && c.src && (b.src = c.src)
      },
      x = function(a, b) {
        return (getComputedStyle(a, null) || {})[b]
      },
      y = function(a, b, c) {
        for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth; )
          (c = b.offsetWidth), (b = b.parentNode)
        return c
      },
      z = (function() {
        var a,
          c,
          d = [],
          e = [],
          f = d,
          g = function() {
            var b = f
            for (f = d.length ? e : d, a = !0, c = !1; b.length; ) b.shift()()
            a = !1
          },
          h = function(d, e) {
            a && !e
              ? d.apply(this, arguments)
              : (f.push(d), c || ((c = !0), (b.hidden ? k : l)(g)))
          }
        return (h._lsFlush = g), h
      })(),
      A = function(a, b) {
        return b
          ? function() {
              z(a)
            }
          : function() {
              var b = this,
                c = arguments
              z(function() {
                a.apply(b, c)
              })
            }
      },
      B = function(a) {
        var b,
          c = 0,
          e = 125,
          g = d.ricTimeout,
          h = function() {
            ;(b = !1), (c = f.now()), a()
          },
          i =
            m && d.ricTimeout
              ? function() {
                  m(h, { timeout: g }), g !== d.ricTimeout && (g = d.ricTimeout)
                }
              : A(function() {
                  k(h)
                }, !0)
        return function(a) {
          var d
          ;(a = a === !0) && (g = 33),
            b ||
              ((b = !0),
              (d = e - (f.now() - c)),
              0 > d && (d = 0),
              a || (9 > d && m) ? i() : k(i, d))
        }
      },
      C = function(a) {
        var b,
          c,
          d = 99,
          e = function() {
            ;(b = null), a()
          },
          g = function() {
            var a = f.now() - c
            d > a ? k(g, d - a) : (m || e)(e)
          }
        return function() {
          ;(c = f.now()), b || (b = k(g, d))
        }
      }
    !(function() {
      var b,
        c = {
          lazyClass: 'lazyload',
          loadedClass: 'lazyloaded',
          loadingClass: 'lazyloading',
          preloadClass: 'lazypreload',
          errorClass: 'lazyerror',
          autosizesClass: 'lazyautosizes',
          srcAttr: 'data-src',
          srcsetAttr: 'data-srcset',
          sizesAttr: 'data-sizes',
          minSize: 40,
          customMedia: {},
          init: !0,
          expFactor: 1.5,
          hFac: 0.8,
          loadMode: 2,
          loadHidden: !0,
          ricTimeout: 300
        }
      d = a.lazySizesConfig || a.lazysizesConfig || {}
      for (b in c) b in d || (d[b] = c[b])
      ;(a.lazySizesConfig = d),
        k(function() {
          d.init && F()
        })
    })()
    var D = (function() {
        var g,
          l,
          m,
          o,
          p,
          y,
          D,
          F,
          G,
          H,
          I,
          J,
          K,
          L,
          M = /^img$/i,
          N = /^iframe$/i,
          O = 'onscroll' in a && !/glebot/.test(navigator.userAgent),
          P = 0,
          Q = 0,
          R = 0,
          S = -1,
          T = function(a) {
            R--,
              a && a.target && u(a.target, T),
              (!a || 0 > R || !a.target) && (R = 0)
          },
          U = function(a, c) {
            var d,
              f = a,
              g =
                'hidden' == x(b.body, 'visibility') ||
                'hidden' != x(a, 'visibility')
            for (
              F -= c, I += c, G -= c, H += c;
              g && (f = f.offsetParent) && f != b.body && f != e;

            )
              (g = (x(f, 'opacity') || 1) > 0),
                g &&
                  'visible' != x(f, 'overflow') &&
                  ((d = f.getBoundingClientRect()),
                  (g =
                    H > d.left &&
                    G < d.right &&
                    I > d.top - 1 &&
                    F < d.bottom + 1))
            return g
          },
          V = function() {
            var a,
              f,
              h,
              j,
              k,
              m,
              n,
              p,
              q,
              r = c.elements
            if ((o = d.loadMode) && 8 > R && (a = r.length)) {
              ;(f = 0),
                S++,
                null == K &&
                  ('expand' in d ||
                    (d.expand =
                      e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370),
                  (J = d.expand),
                  (K = J * d.expFactor)),
                K > Q && 1 > R && S > 2 && o > 2 && !b.hidden
                  ? ((Q = K), (S = 0))
                  : (Q = o > 1 && S > 1 && 6 > R ? J : P)
              for (; a > f; f++)
                if (r[f] && !r[f]._lazyRace)
                  if (O)
                    if (
                      (((p = r[f][i]('data-expand')) && (m = 1 * p)) || (m = Q),
                      q !== m &&
                        ((y = innerWidth + m * L),
                        (D = innerHeight + m),
                        (n = -1 * m),
                        (q = m)),
                      (h = r[f].getBoundingClientRect()),
                      (I = h.bottom) >= n &&
                        (F = h.top) <= D &&
                        (H = h.right) >= n * L &&
                        (G = h.left) <= y &&
                        (I || H || G || F) &&
                        (d.loadHidden || 'hidden' != x(r[f], 'visibility')) &&
                        ((l && 3 > R && !p && (3 > o || 4 > S)) || U(r[f], m)))
                    ) {
                      if ((ba(r[f]), (k = !0), R > 9)) break
                    } else
                      !k &&
                        l &&
                        !j &&
                        4 > R &&
                        4 > S &&
                        o > 2 &&
                        (g[0] || d.preloadAfterLoad) &&
                        (g[0] ||
                          (!p &&
                            (I ||
                              H ||
                              G ||
                              F ||
                              'auto' != r[f][i](d.sizesAttr)))) &&
                        (j = g[0] || r[f])
                  else ba(r[f])
              j && !k && ba(j)
            }
          },
          W = B(V),
          X = function(a) {
            s(a.target, d.loadedClass),
              t(a.target, d.loadingClass),
              u(a.target, Z),
              v(a.target, 'lazyloaded')
          },
          Y = A(X),
          Z = function(a) {
            Y({ target: a.target })
          },
          $ = function(a, b) {
            try {
              a.contentWindow.location.replace(b)
            } catch (c) {
              a.src = b
            }
          },
          _ = function(a) {
            var b,
              c = a[i](d.srcsetAttr)
            ;(b = d.customMedia[a[i]('data-media') || a[i]('media')]) &&
              a.setAttribute('media', b),
              c && a.setAttribute('srcset', c)
          },
          aa = A(function(a, b, c, e, f) {
            var g, h, j, l, o, p
            ;(o = v(a, 'lazybeforeunveil', b)).defaultPrevented ||
              (e && (c ? s(a, d.autosizesClass) : a.setAttribute('sizes', e)),
              (h = a[i](d.srcsetAttr)),
              (g = a[i](d.srcAttr)),
              f && ((j = a.parentNode), (l = j && n.test(j.nodeName || ''))),
              (p = b.firesLoad || ('src' in a && (h || g || l))),
              (o = { target: a }),
              p &&
                (u(a, T, !0),
                clearTimeout(m),
                (m = k(T, 2500)),
                s(a, d.loadingClass),
                u(a, Z, !0)),
              l && q.call(j.getElementsByTagName('source'), _),
              h
                ? a.setAttribute('srcset', h)
                : g && !l && (N.test(a.nodeName) ? $(a, g) : (a.src = g)),
              f && (h || l) && w(a, { src: g })),
              a._lazyRace && delete a._lazyRace,
              t(a, d.lazyClass),
              z(function() {
                ;(!p || (a.complete && a.naturalWidth > 1)) &&
                  (p ? T(o) : R--, X(o))
              }, !0)
          }),
          ba = function(a) {
            var b,
              c = M.test(a.nodeName),
              e = c && (a[i](d.sizesAttr) || a[i]('sizes')),
              f = 'auto' == e
            ;((!f && l) ||
              !c ||
              (!a[i]('src') && !a.srcset) ||
              a.complete ||
              r(a, d.errorClass) ||
              !r(a, d.lazyClass)) &&
              ((b = v(a, 'lazyunveilread').detail),
              f && E.updateElem(a, !0, a.offsetWidth),
              (a._lazyRace = !0),
              R++,
              aa(a, b, f, e, c))
          },
          ca = function() {
            if (!l) {
              if (f.now() - p < 999) return void k(ca, 999)
              var a = C(function() {
                ;(d.loadMode = 3), W()
              })
              ;(l = !0),
                (d.loadMode = 3),
                W(),
                j(
                  'scroll',
                  function() {
                    3 == d.loadMode && (d.loadMode = 2), a()
                  },
                  !0
                )
            }
          }
        return {
          _: function() {
            ;(p = f.now()),
              (c.elements = b.getElementsByClassName(d.lazyClass)),
              (g = b.getElementsByClassName(
                d.lazyClass + ' ' + d.preloadClass
              )),
              (L = d.hFac),
              j('scroll', W, !0),
              j('resize', W, !0),
              a.MutationObserver
                ? new MutationObserver(W).observe(e, {
                    childList: !0,
                    subtree: !0,
                    attributes: !0
                  })
                : (e[h]('DOMNodeInserted', W, !0),
                  e[h]('DOMAttrModified', W, !0),
                  setInterval(W, 999)),
              j('hashchange', W, !0),
              [
                'focus',
                'mouseover',
                'click',
                'load',
                'transitionend',
                'animationend',
                'webkitAnimationEnd'
              ].forEach(function(a) {
                b[h](a, W, !0)
              }),
              /d$|^c/.test(b.readyState)
                ? ca()
                : (j('load', ca), b[h]('DOMContentLoaded', W), k(ca, 2e4)),
              c.elements.length ? (V(), z._lsFlush()) : W()
          },
          checkElems: W,
          unveil: ba
        }
      })(),
      E = (function() {
        var a,
          c = A(function(a, b, c, d) {
            var e, f, g
            if (
              ((a._lazysizesWidth = d),
              (d += 'px'),
              a.setAttribute('sizes', d),
              n.test(b.nodeName || ''))
            )
              for (
                e = b.getElementsByTagName('source'), f = 0, g = e.length;
                g > f;
                f++
              )
                e[f].setAttribute('sizes', d)
            c.detail.dataAttr || w(a, c.detail)
          }),
          e = function(a, b, d) {
            var e,
              f = a.parentNode
            f &&
              ((d = y(a, f, d)),
              (e = v(a, 'lazybeforesizes', { width: d, dataAttr: !!b })),
              e.defaultPrevented ||
                ((d = e.detail.width),
                d && d !== a._lazysizesWidth && c(a, f, e, d)))
          },
          f = function() {
            var b,
              c = a.length
            if (c) for (b = 0; c > b; b++) e(a[b])
          },
          g = C(f)
        return {
          _: function() {
            ;(a = b.getElementsByClassName(d.autosizesClass)), j('resize', g)
          },
          checkElems: g,
          updateElem: e
        }
      })(),
      F = function() {
        F.i || ((F.i = !0), E._(), D._())
      }
    return (c = {
      cfg: d,
      autoSizer: E,
      loader: D,
      init: F,
      uP: w,
      aC: s,
      rC: t,
      hC: r,
      fire: v,
      gW: y,
      rAF: z
    })
  }
})
!(function(t) {
  t.fn.customSocialButton = function(a) {
    function e(a) {
      var e = a.attr('data-url'),
        r = encodeURIComponent(e),
        n = a.attr('class')
      'stFacebook' === n || 'stCpFacebook' === n
        ? t.ajax({
            url: '//graph.facebook.com/' + r,
            dataType: 'jsonp',
            timeout: 5e3,
            success: function(t) {
              var e = t.stShares
              s(a, n, r, e)
            },
            error: function(t) {
              s(a, n, r, 0)
            }
          })
        : s(a, n, r)
    }
    function s(a, e, s, r) {
      var n,
        i,
        c = (a.attr('data-url'), encodeURIComponent(o))
      switch (((r = r || 0), e)) {
        case 'stTwitter':
        case 'stCpTwitter':
          ;(n = 'https://twitter.com/share?text=' + c + '&url=' + s),
            (i = 'ツイート')
          break
        case 'stFacebook':
        case 'stCpFacebook':
          ;(n = 'https://www.facebook.com/sharer/sharer.php?u=' + s),
            (i = 'シェア')
          break
        case 'stCpLine':
          ;(n = 'https://line.me/R/msg/text/?' + c + s), (i = 'LINE')
          break
        case 'stCpMixi':
          ;(n =
            'https://mixi.jp/share.pl?u=' +
            s +
            '&k=78b1f71e8d011d9845ee14ca7b83c181cd716a15'),
            (i = 'mixi')
          break
        case 'stCpHatena':
          ;(n =
            'http://b.hatena.ne.jp/add?mode=confirm&title=' + c + '&url=' + s),
            (i = 'はてブ')
          break
        case 'stCpPocket':
          ;(n = 'https://getpocket.com/edit?url=' + s + '&title=' + c),
            (i = 'pockets')
          break
        case 'stCpMail':
          ;(n = 'mailto:?subject=' + c + '&body=' + s), (i = 'mail')
          break
        case 'stCpEight':
          ;(n =
            'https://8card.net/posts/links/new?application_id=902593464169451&url=' +
            s),
            (i = 'シェア')
      }
      'stCpMail' === e
        ? a.append(
            t('<a>')
              .addClass('stShareBtn')
              .attr('href', n)
              .html(i)
              .wrapInner('<span>')
          )
        : a.append(
            t('<a>')
              .addClass('stShareBtn')
              .attr('href', n)
              .attr('target', '_blank')
              .html(i)
              .wrapInner('<span>')
          ),
        r > 0 &&
          (a.addClass('stShares'),
          a.append(
            t('<a>')
              .addClass('stCount')
              .attr('href', void 0)
              .attr('target', '_blank')
              .html(r)
              .wrapInner('<span>')
          ))
    }
    var r = this,
      n = location.href,
      o = document.title
    return (
      (n = n.match('help.honto.jp/')
        ? n
        : n.match(/\/(info|store\/news)\/detail/g)
        ? n.replace(/\/index\.html?/, '.html').replace(/(\?|#).*$/, '')
        : n.replace(/(\?|#).*$/, '')),
      r.find('li').each(function() {
        var a = t(this)
        a.attr('data-url') || a.attr('data-url', n).attr('data-title', o), e(a)
      }),
      (function() {
        r.on('click', 'a', function(a) {
          var e = t(this).attr('href'),
            s = t(this).hasClass('stCount')
          if (
            !t(this)
              .closest('li')
              .hasClass('stCpMail')
          ) {
            if (s) var r = 'width=960, height=600,'
            else var r = 'width=600, height=400,'
            return (
              window.open(
                '',
                'child',
                r + ' menubar=no, toolbar=no, scrollbars=yes, status=no'
              ),
              window.open(e, 'child'),
              !1
            )
          }
        })
      })(),
      this
    )
  }
})(jQuery)
