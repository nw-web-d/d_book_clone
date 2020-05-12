/**
 * @fileOverview ジャンルTOP画面ドリルダウン設定.
 * @name PrdGenreTopDrillDownPc.js
 */
jQuery.noConflict()

var genreTopDrillDownPc = {
  /** 遅延読込部. */
  _dyblock: {},
  /** div.genreNavi. */
  _node: {},
  /** p.stTrigger. */
  _trigger: {},
  /** div.stBlock. */
  _navigation: {},
  /** div.stBlockInner. */
  _inner: {},
  /** ul.genreList03. */
  _list: {},
  /** li. */
  _listItem: {},
  /** li.stCurrent. */
  _current: {},

  setUp() {
    this._dyblock = jQuery('#dyGenreTopDrillDownLazyLoad')
    // ロード中なら処理終了
    if (this._dyblock.find('img').length) {
      return
    }
    // ロード後にドリルダウンが存在しないなら li 要素を取り除き、処理終了
    this._node = this._dyblock.find('div.genreNavi')
    if (!this._node.length) {
      this._dyblock.parent().remove()
      return
    }
    this._trigger = this._node.find('p.stTrigger')
    this._navigation = this._node.find('div.stBlock')
    this._inner = this._navigation.find('div.stBlockInner')
    this._list = this._inner.find('ul.genreList03')
    if (this._list.find('li.stCurrent').length) {
      return
    }
    // ドリルダウンのアクション設定
    this._node.hover(
      genreTopDrillDownPc._showNavigation,
      genreTopDrillDownPc._hideNavigation
    )
    // 白背景設定
    const _prefix = new Date().getTime()
    this._list.prepend('<li class="stCurrent" id="el_' + _prefix + '"></li>')
    this._current = jQuery('#el_' + _prefix)
    this._current.css('opacity', 0)
    this._listItem = this._list.find('li')
    // 設定
    for (i = 1; i < this._listItem.length; i++) {
      jQuery(this._listItem[i]).mouseenter(function(e) {
        genreTopDrillDownPc._onListOver(this)
      })
    }
  },

  _init() {
    this._dyblock = jQuery('#dyGenreTopDrillDownLazyLoad')
    this._node = this._dyblock.find('div.genreNavi')
    this._trigger = this._node.find('p.stTrigger')
    this._navigation = this._node.find('div.stBlock')
    this._inner = this._navigation.find('div.stBlockInner')
    this._list = this._inner.find('ul.genreList03')
    this._listItem = this._list.find('li')
    this._current = this._list.find('li.stCurrent')
  },

  _showNavigation() {
    genreTopDrillDownPc._init()

    const self = this
    genreTopDrillDownPc._trigger.addClass('stCurrent')
    Velocity(genreTopDrillDownPc._navigation, 'stop')
    Velocity(
      genreTopDrillDownPc._navigation,
      { height: genreTopDrillDownPc._inner.height() },
      { duration: 500, delay: 0, easing: 'easeOutCubic' }
    )
    if (!genreTopDrillDownPc._list) {
      return
    }
    genreTopDrillDownPc._onListOver(genreTopDrillDownPc._listItem[1])
  },

  _hideNavigation() {
    genreTopDrillDownPc._init()

    const self = this
    genreTopDrillDownPc._trigger.removeClass('stCurrent')
    Velocity(genreTopDrillDownPc._navigation, 'stop')
    Velocity(
      genreTopDrillDownPc._navigation,
      { height: 0 },
      { duration: 500, delay: 0, easing: 'easeOutCubic' }
    )
    genreTopDrillDownPc._current.css('opacity', 0)
  },

  // - ===================================================================  Current <
  _onListOver(e) {
    genreTopDrillDownPc._init()
    const currentIndex = Array.prototype.indexOf.call(
      genreTopDrillDownPc._listItem,
      e
    )
    genreTopDrillDownPc._trigger.addClass('stCurrent')

    let i = 0
    for (i = 0; i < genreTopDrillDownPc._listItem.length; i++) {
      i === currentIndex
        ? jQuery(genreTopDrillDownPc._listItem[i]).addClass('stActive')
        : jQuery(genreTopDrillDownPc._listItem[i]).removeClass('stActive')
    }

    const topPos =
      jQuery(e).offset().top - genreTopDrillDownPc._list.offset().top
    Velocity(genreTopDrillDownPc._current, 'stop')
    Velocity(
      genreTopDrillDownPc._current,
      { top: topPos, opacity: 1 },
      { duration: 300, delay: 0, easing: 'easeOutCubic' }
    )
  }
}
