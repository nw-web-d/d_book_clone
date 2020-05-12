/**
 * @fileOverview 商品情報共通スクリプト.
 * @name PrdProductInfoCommon.js
 */

/**
 * 選択済みチェックを行う関数.
 * 書籍ラインナップ用選択済みチェックを行う.
 *
 * @param {Number} limit 最大表示件数
 */
function checkSelected(limit) {
  let flg = false
  for (let i = 1; i <= limit; i++) {
    if (document.getElementById('prdid' + i) != null) {
      // チェックボックスが存在する場合
      if (document.getElementById('prdid' + i).checked) {
        // チェックボックスがチェック済みの場合
        flg = true
        break
      }
    }
  }

  if (flg) {
    // １つでもチェック済みが存在する場合
    document.lineup.submit()
  } else {
    false
  }
}

/**
 * bid用の選択済みチェックを行う関数.
 * 電子書籍ラインナップ用選択済みチェックを行う.
 *
 * @param {Number} limit 最大表示件数
 * @param {String} bid 買い物カゴパラメータ
 */
function checkSelectedBid(limit, bid) {
  let i
  let flg = false
  const prdList = document.getElementsByName('prdList')
  let prdno = 0
  const sendItemList = new Array()

  // SPの場合、最大取得件数を現在の表示件数から取得する
  if (limit == null) {
    elem = document.getElementById('lastLimit')
    if (elem) {
      limit = elem.value
    }
  }

  for (i = 1; i <= limit; i++) {
    const b = prdList[i - 1]

    if (document.getElementById('prdid' + i)) {
      // チェックボックスが存在する場合
      if (document.getElementById('prdid' + i).checked) {
        // チェックボックスがチェック済みの場合
        if (!b || b.value == '') {
          // 商品IDの情報が取得できない場合、スキップ
          continue
        } else {
          // 商品IDの情報が取得できる場合
          sendItemList[prdno] = b
          prdno++
          flg = true
        }
      }
    }
  }

  const sendItemCnt = sendItemList.length
  const allSelectedOrder = document.getElementById('allSelectedOrder')

  while (allSelectedOrder.firstChild) {
    allSelectedOrder.removeChild(allSelectedOrder.firstChild)
  }

  for (i = 0; i < sendItemCnt; i++) {
    const s = sendItemList[i]
    if (s) {
      // 送信する商品IDが存在する場合、hidden の情報を生成する
      var elem = document.createElement('input')
      elem.name = bid + '[' + i + ']'
      elem.type = 'hidden'
      elem.value = s.value

      allSelectedOrder.appendChild(elem)
    }
  }

  if (flg) {
    // 送信情報が存在する場合
    document.selectLineup.submit()
  } else {
    false
  }
}

/**
 * 欲しい本へ追加時の処理.
 * 選択済みチェックを行う.
 * 欲しい本へ追加処理を行う.
 *
 */
function checkSelectedPrdIdForSp(limit, pageBlockId, queryParam, prdId) {
  if (prdId != null && prdId != '') {
    HC.Ajax.update(
      pageBlockId,
      'errorArea',
      'prdid[0]=' + prdId,
      null,
      'errorArea'
    )
  } else {
    let i
    let flg = false
    const prdList = document.getElementsByName('prdList')
    let prdno = 0
    const sendItemList = new Array()

    // SPの場合、最大取得件数を現在の表示件数から取得する
    if (limit == null || limit == '') {
      if (prdList) {
        limit = prdList.length
      }
    }

    for (i = 1; i <= limit; i++) {
      const b = prdList[i - 1]

      if (document.getElementById('prdid' + i)) {
        // チェックボックスが存在する場合
        if (document.getElementById('prdid' + i).checked) {
          // チェックボックスがチェック済みの場合
          if (!b || b.value == '') {
            // 商品IDの情報が取得できない場合、スキップ
            continue
          } else {
            // 商品IDの情報が取得できる場合
            sendItemList[prdno] = b
            prdno++
            flg = true
          }
        }
      }
    }

    const sendItemCnt = sendItemList.length
    const allSelectedWishes = document.getElementById('allSelectedWishes')

    while (allSelectedWishes.firstChild) {
      allSelectedWishes.removeChild(allSelectedWishes.firstChild)
    }

    for (i = 0; i < sendItemCnt; i++) {
      const s = sendItemList[i]
      if (s) {
        // 送信する商品IDが存在する場合、hidden の情報を生成する
        queryParam += '&prdid' + '[' + i + ']=' + s.value
      }
    }

    if (flg) {
      // 送信情報が存在する場合
      HC.Ajax.update(pageBlockId, 'errorArea', queryParam, null, 'errorArea')
    } else {
      false
    }
  }
}

/**
 * PrdId用の選択済みチェックを行う関数.
 * 電子書籍ラインナップ用選択済みチェックを行う.
 *
 * @param {Number} limit 最大表示件数
 */
function checkSelectedPrdId(limit) {
  let i
  let flg = false
  const prdList = document.getElementsByName('prdList')
  let prdno = 0
  const sendItemList = new Array()

  // SPの場合、最大取得件数を現在の表示件数から取得する
  if (limit == null || limit == '') {
    if (prdList) {
      limit = prdList.length
    }
  }

  for (i = 1; i <= limit; i++) {
    const b = prdList[i - 1]

    if (document.getElementById('prdid' + i)) {
      // チェックボックスが存在する場合
      if (document.getElementById('prdid' + i).checked) {
        // チェックボックスがチェック済みの場合
        if (!b || b.value == '') {
          // 商品IDの情報が取得できない場合、スキップ
          continue
        } else {
          // 商品IDの情報が取得できる場合
          sendItemList[prdno] = b
          prdno++
          flg = true
        }
      }
    }
  }
  const sendItemCnt = sendItemList.length
  const allSelectedWishes = document.getElementById('allSelectedWishes')

  while (allSelectedWishes.firstChild) {
    allSelectedWishes.removeChild(allSelectedWishes.firstChild)
  }

  for (i = 0; i < sendItemCnt; i++) {
    const s = sendItemList[i]
    if (s) {
      // 送信する商品IDが存在する場合、hidden の情報を生成する
      const elem = document.createElement('input')
      elem.name = 'prdid' + '[' + i + ']'
      elem.type = 'hidden'
      elem.value = s.value
      allSelectedWishes.appendChild(elem)
    }
  }

  if (flg) {
    // 送信情報が存在する場合
    document.selectWishList.submit()
  } else {
    false
  }
}

/**
 * 検索ボックス用サブミット送信を行う関数.
 * 検索ボックス用にパラメータを現在の画面に従って送信する.
 *
 * @param hontoModulePrefix プレフィックス
 * @param screenUrl 画面から指定されたURL
 * @param cid cidパラメータ
 */
function searchBox(hontoModulePrefix, screenUrl, cid, slideInFlg) {
  const elemId_1 = hontoModulePrefix + 'stGenre'
  const elemId_3 = hontoModulePrefix + 'stSearchGenre'

  const l = document.getElementById(elemId_1)
  const u = screenUrl

  // 擬似静的URL生成
  let createdUrl = u
  createdUrl = createdUrl.replace('.html', '')

  // ジャンルコード
  if (l != null && l.value != '') {
    createdUrl = createdUrl + '_02' + l.value
  }

  // 検索キーワード
  if (slideInFlg) {
    var keyWord = document.getElementById('stSearchTextBoxSlideIn')
    var tbtyVal = document.getElementById('stSearchTbtySlideIn').value
  } else {
    var keyWord = document.getElementById('stSearchTextBox')
    var tbtyVal = document.getElementById('stSearchTbty').value
  }
  const keyWordValue = keyWord.value.toString()

  if (keyWord != null && keyWordValue != '') {
    createdUrl = createdUrl + '_10' + encodeURIComponent(keyWordValue)
  }

  createdUrl = createdUrl + '.html'

  document.getElementById(elemId_3).value = l.value

  // 子フォームを作成（検索キーワードを重複させない為、送信用の新しいフォームを作成）
  const f = document.createElement('form')
  f.style.display = 'none'
  document.body.appendChild(f)
  f.method = 'get'
  f.action = createdUrl

  const srchf = document.createElement('input')
  srchf.setAttribute('name', 'srchf')
  srchf.setAttribute('value', '1')
  f.appendChild(srchf)

  const tbty = document.createElement('input')
  tbty.setAttribute('name', 'tbty')
  tbty.setAttribute('value', tbtyVal)
  f.appendChild(tbty)

  if (cid) {
    const cidTag = document.createElement('input')
    cidTag.setAttribute('name', 'cid')
    cidTag.setAttribute('value', cid)
    f.appendChild(cidTag)
  }

  // 検索用ジャンル
  if (l != null && l.value != '') {
    const srchGnrNm = document.createElement('input')
    srchGnrNm.setAttribute('name', 'srchGnrNm')
    srchGnrNm.setAttribute('value', l.value)
    f.appendChild(srchGnrNm)
  }

  f.submit()
}

/**
 * チェックボックスの選択数をチェックする.
 *
 * @param chkBxNm チェックボックス名
 * @param limit 選択上限値
 */
function chkBoxLimitCheck(elm, chkBxNm, limit) {
  let cnt = 0 // チェックの合計
  const Flag = new Array() // チェックの有無を格納する配列
  const chkBx = document.getElementsByName(chkBxNm) // 指定したnameの要素をすべて取得

  for (i = 0; i < chkBx.length; i++) {
    Flag[i] = i
    if (chkBx[i].checked) {
      Flag[i] = 'chk' // チェックが入っていれば文字列 "chk" を代入
      cnt++ // チェックの合計数を 1 増やします
    }
  }

  if (cnt > limit) {
    elm.checked = false
  }

  if (cnt >= limit) {
    // チェックの合計数が制限数の場合

    for (i = 0; i < chkBx.length; i++) {
      if (Flag[i] == 'chk') {
        chkBx[i].disabled = false
      } else {
        chkBx[i].disabled = true
      }
    }
  } else {
    for (i = 0; i < chkBx.length; i++) {
      chkBx[i].disabled = false
    }
  }
}

/**
 * 引数で指定されたidのvalueを消去する.
 *
 * @param targetId valueを消去するid
 */
function clearTextBox(targetId) {
  const targetObject = document.getElementById(targetId)
  targetObject.value = ''
  targetObject.focus()
  clearIcon(targetId)
}

/**
 * 引数で指定されたidのクリアアイコンを消去する.
 *
 * @param targetId クリアアイコンを消去するid
 */
function clearIcon(targetId) {
  const targetObject = document.getElementById(targetId)
  if (targetObject.value == '') {
    document.getElementById('stIconCross').style.display = 'none'
  } else {
    document.getElementById('stIconCross').style.display = 'block'
  }
}

/**
 * サジェストのデータをSiteCatalystに送信する
 *
 * @param slideInFlg スライドインしてくる検索窓かどうか
 */
function sendSiteCatalystSuggestData(slideInFlg) {
  if (!DY.suggestList) {
    // サジェスト自体の有無（キーワード入力後、サジェスト表示までに検索を押下された際の対応）
    return
  }
  // サジェスト件数
  const suggestCount = DY.suggestList.length
  if (suggestCount == 0) {
    return
  }
  // サジェスト選択箇所
  let suggestSelectedNumber = '0'
  let suggestWord = ''
  for (let i = suggestCount - 1; i >= 0; i--) {
    if (DY.suggestList[i].className == 'stCurrent') {
      suggestSelectedNumber = i + 1
      // innerHTMLの値にaタグ、emタグが含まれるため空文字に置換
      suggestWord = DY.suggestList[i].innerHTML.replace(
        /<[aA][^>]*>|<[eE][mM]>|<\/[eE][mM]>|<\/[aA]>/g,
        ''
      )
    }
  }

  if (slideInFlg) {
    var keyWord = document.getElementById('stSearchTextBoxSlideIn')
  } else {
    var keyWord = document.getElementById('stSearchTextBox')
  }
  s.prop30 = suggestWord
  if (suggestWord == '') {
    s.prop30 = keyWord.value.toString()
  }

  s.prop43 = suggestSelectedNumber
  s.prop44 = suggestCount
  s.eVar43 = suggestSelectedNumber
  s.eVar44 = suggestCount
  // SiteCatalyst用データ送信
  s_sc(s)
}
