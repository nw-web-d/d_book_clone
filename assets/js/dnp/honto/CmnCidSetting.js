/**
 * @fileOverview CID設定用ファイル
 * @name CmnCidSetting.js
 */

const CidSetting = {
  setCid(pageBlockId, device) {},
  settingData: null,
  date: new Date(),
  timestamp() {
    return (
      this.date.getFullYear().toString() +
      (this.date.getMonth() + 1).toString() +
      this.date.getDate().toString() +
      this.date.getHours().toString()
    )
  }
}

jQuery.noConflict()
jQuery(document).ready(function($) {
  $.extend(CidSetting, {
    /**
     * CID設定関数(非同期ブロック用).
     * 非同期ブロックの読み込み完了時に呼び出される。
     * @param pageBlockId ページブロックID
     * @param device デバイス(PC/SP)
     */
    setCid(pageBlockId, device) {
      if (!CidSetting.settingData) {
        // CID設定用JSONファイルの読み込みが完了していない場合は1000ミリ秒後に再度実行
        setTimeout(
          'CidSetting.setCid(' + pageBlockId + ", '" + device + "')",
          1000
        )
      } else {
        // CID設定用JSONファイルデータ
        setting = CidSetting.settingData

        const tmpArray = location.href.split('/')
        const firstDir = getDir(tmpArray[3], 'home')
        let secondDir = ''
        const len = tmpArray.length
        for (let i = 4; i < len; i++) {
          secondDir += '/' + tmpArray[i]
        }
        secondDir = getDir(secondDir, '/')

        // URL第一階層
        let subSetting = searchForwardMatch(setting[0], firstDir)
        if (!subSetting) {
          return
        }
        // URL第二階層
        subSetting = searchForwardMatch(subSetting, secondDir)
        if (!subSetting) {
          return
        }
        // デバイス
        subSetting = searchPerfectMatch(subSetting, device)
        if (!subSetting) {
          return
        }
        // ブロックID
        subSetting = searchPerfectMatch(subSetting, pageBlockId)
        if (!subSetting) {
          return
        }

        // CID設定処理
        setCid(subSetting, pageBlockId)
      }
    }
  })

  // CID設定処理(通常ブロック用)
  // CID設定用JSONファイル
  $.ajax({
    url: '/library/json/cidSetting.json?ts=' + CidSetting.timestamp(),
    dataType: 'json'
  })
    .done(function(setting) {
      // CID設定用JSONファイルデータを変数に格納
      CidSetting.settingData = setting

      const tmpArray = location.href.split('/')
      const firstDir = getDir(tmpArray[3], 'home')
      let secondDir = ''
      const len = tmpArray.length
      for (let i = 4; i < len; i++) {
        secondDir += '/' + tmpArray[i]
      }
      secondDir = getDir(secondDir, '/')

      // URL第一階層
      let subSetting = searchForwardMatch(setting[0], firstDir)
      if (!subSetting) {
        return
      }
      // URL第二階層
      subSetting = searchForwardMatch(subSetting, secondDir)
      if (!subSetting) {
        return
      }
      // デバイス
      subSetting = searchPerfectMatch(subSetting, DY.device)
      if (!subSetting) {
        return
      }

      for (key in subSetting) {
        // 非同期で表示するブロックの場合はページ読み込み完了にcid設定処理を実行しない
        if (!subSetting[key].delay_load) {
          // CID設定処理
          setCid(subSetting[key], key)
        }
      }
    })
    .fail(function() {
      return false
    })

  /**
   * URL階層取得.
   *
   * @param dir URL階層
   * @param defaultDir URL階層(デフォルト)
   * @return url URL階層
   */
  function getDir(dir, defaultDir) {
    if (dir) {
      dir = dir.split('?')
    }
    if (!dir[0]) {
      return defaultDir
    }
    return dir[0]
  }

  /**
   * URLパラメータ接続文字取得.
   *
   * @param url URL
   * @return url URLパラメータ接続文字
   */
  function getParamText(url) {
    const urlArray = url.split('?')
    if (urlArray[1]) {
      return '&'
    }
    return '?'
  }

  /**
   * CID設定検索(前方一致).
   *
   * @param setting CID設定情報(json)
   * @param searchText 検索テキスト
   * @return CID設定情報
   */
  function searchForwardMatch(setting, searchText) {
    return search(setting, searchText, 1)
  }

  /**
   * CID設定検索(完全一致).
   *
   * @param setting CID設定情報(json)
   * @param searchText 検索テキスト
   * @return CID設定情報
   */
  function searchPerfectMatch(setting, searchText) {
    return search(setting, searchText, 0)
  }

  /**
   * CID設定検索.
   *
   * @param setting CID設定情報(json)
   * @param searchText 検索テキスト
   * @param searchKind 検索種別(0:完全一致、1:前方一致)
   * @return CID設定情報
   */
  function search(setting, searchText, searchKind) {
    let subSetting = ''
    const prefix = ' '
    let postfix = ' '
    if (searchKind == 1) {
      postfix = ''
    }
    searchText = prefix + searchText + postfix
    for (key in setting) {
      if (searchText.includes(prefix + key + postfix)) {
        subSetting = setting[key]
      }
    }
    return subSetting
  }

  /**
   * CID設定処理.
   *
   * @param setting CID設定情報(json)
   * @param pageBlockId ページブロックID
   */
  function setCid(setting, pageBlockId) {
    if (setting.seq_class) {
      // 「seq_class」の指定がある場合
      setCidByClass(setting, pageBlockId)
    } else {
      // 「seq_class」の指定がない場合
      const block = $('#pbBlock' + pageBlockId)
      let cidNum = 0
      const lastIndex = block.find('a').size() - 1
      const obj = block.find('a')
      const len = obj.length
      let linkObj
      for (let index = 0; index < len; index++) {
        linkObj = obj.eq(index)
        if (!checkLink(linkObj.attr('href'))) {
          continue
        }
        // クラスに「dyNoCid」の指定があるリンクにはcidを付与しない
        if (
          !linkObj.attr('class') ||
          !linkObj.attr('class').includes('dyNoCid')
        ) {
          cidNum++
          // リンクにcidを追加
          addCidToLink(linkObj, setting, index, lastIndex, cidNum)
        }
      }
    }
  }

  /**
   * CID設定処理(クラス指定ありの場合).
   *
   * @param setting CID設定情報(json)
   * @param pageBlockId ページブロックID
   */
  function setCidByClass(setting, pageBlockId) {
    const block = $('#pbBlock' + pageBlockId)
    let cidNum = 0
    const lastIndex = block.find('a').size() - 1
    const tagList = []
    let num = 1
    const obj = block.find('.' + setting.seq_class)
    const len = obj.length

    for (var i = 0; i < len; i++) {
      var linkObj = obj.eq(i)
      const subLinkObj = linkObj.find('a')
      const subLen = subLinkObj.length
      tagList[num] = []
      for (var j = 0; j < subLen; j++) {
        tagList[num].push(subLinkObj.eq(j))
      }
      num++
    }

    let cidIndex = 0
    const tagObj = block.find('a')
    const tagObjLen = tagObj.length

    for (let index = 0; index < tagObjLen; index++) {
      var linkObj = tagObj.eq(index)
      if (!checkLink(linkObj.attr('href'))) {
        continue
      }
      const tagListLen = tagList.length
      let tagListSubLen = ''
      let hitFlg = false
      loop: for (var i = tagListLen; i--; ) {
        const tagListSub = tagList[i]
        if (!tagListSub) {
          continue
        }
        tagListSubLen = tagListSub.length
        for (var j = tagListSubLen; j--; ) {
          if (tagListSub[j].get(0) !== linkObj.get(0)) {
            continue
          }
          // リンクにcidを追加
          // クラスに「dyNoCid」の指定があるリンクにはcidを付与しない
          if (
            !linkObj.attr('class') ||
            !linkObj.attr('class').includes('dyNoCid')
          ) {
            if (cidIndex != i) {
              cidNum++
            }
            addCidToLink(linkObj, setting, null, null, cidNum)
          }
          hitFlg = true
          cidIndex = i
          break loop
        }
      }
      if (!hitFlg) {
        // クラスに「dyNoCid」の指定があるリンクにはcidを付与しない
        if (
          !linkObj.attr('class') ||
          !linkObj.attr('class').includes('dyNoCid')
        ) {
          cidNum++
          // リンクにcidを追加
          addCidToLink(linkObj, setting, index, lastIndex, cidNum)
        }
      }
    }
  }

  /**
   * CIDを設定するリンクかどうかをチェックする.
   *
   * @param link リンク
   */
  function checkLink(link) {
    // リンクが設定されていない場合
    if (!link) {
      return false
    }
    // リンクがURLでない場合
    if (!link.includes('/')) {
      return false
    }
    // リンクのパラメータにcidが付与済みの場合
    if (link.includes('?cid=') || link.includes('&cid=')) {
      return false
    }
    return true
  }

  /**
   * リンクにURLパラメータ「CID」を追加.
   *
   * @param obj リンク情報
   * @param setting CID設定情報(json)
   * @param index リンク情報連番
   * @param lastIndex リンク情報連番(最後のリンク)
   * @param cidNum cidに付与する番号
   */
  function addCidToLink(obj, setting, index, lastIndex, cidNum) {
    const link = obj.attr('href')
    let cidIndex
    if (setting.next_flag == true && index && lastIndex && index == lastIndex) {
      cidIndex = 'next'
    } else {
      cidIndex = ('0' + cidNum).slice(-2)
    }
    const paramText = getParamText(link)
    obj.attr(
      'href',
      link + paramText + 'cid=' + setting.cid_prefix + '_' + cidIndex
    )
  }
})
