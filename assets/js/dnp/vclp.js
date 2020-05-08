function VcLp() {
  function l(a) {
    var d = document.URL.match(/[?&]vc_lpp=([^&]+)/)
    if (null == d) p(void 0, a)
    else {
      var e = d[1]
      d = ''
      try {
        for (var f = '', b = 0, h = e.length; b < h; b += 4) {
          var c = [0, 0, 0, 0]
          c[0] = n(e.charCodeAt(b))
          h > b + 1 && (c[1] = n(e.charCodeAt(b + 1)))
          h > b + 2 && (c[2] = n(e.charCodeAt(b + 2)))
          h > b + 3 && (c[3] = n(e.charCodeAt(b + 3)))
          b + 3 < h
            ? ((f += String.fromCharCode(((c[0] << 2) + (c[1] >> 4)) & 255)),
              (f += String.fromCharCode(((c[1] << 4) + (c[2] >> 2)) & 255)),
              (f += String.fromCharCode(((c[2] << 6) + c[3]) & 255)))
            : b + 2 < h
            ? ((f += String.fromCharCode(((c[0] << 2) + (c[1] >> 4)) & 255)),
              (f += String.fromCharCode(((c[1] << 4) + (c[2] >> 2)) & 255)),
              (f += String.fromCharCode((c[2] << 6) & 255)))
            : b + 1 < h
            ? ((f += String.fromCharCode(((c[0] << 2) + (c[1] >> 4)) & 255)),
              (f += String.fromCharCode((c[1] << 4) & 255)))
            : b < h && (f += String.fromCharCode((c[0] << 2) & 255))
        }
        d = f.replace(/\0/g, '')
      } catch (r) {
        p(void 0, a)
        return
      }
      p(d, a)
      a = Math.floor(new Date().getTime() / 1e3)
      d = d.split(',')
      h = d.length
      for (e = 0; e < h; e++)
        a: {
          f = d[e]
          var m = a
          b = f.split('&')
          if (!(5 > b.length)) {
            var g = 1,
              k = 2
            c = 3
            b[0].match(/^[1-9]$/) && ((g = 2), (k = 3), (c = 4), (f = b[5]))
            g = parseInt(b[g], 16)
            if (
              !(
                isNaN(g) ||
                m > g + 10800 ||
                ((m = parseInt(b[k], 16)),
                isNaN(m) || ((b = parseInt(b[c], 16)), isNaN(b)))
              )
            ) {
              c = ''
              try {
                c = new Date(1e3 * b).toUTCString()
              } catch (r) {
                break a
              }
              k = document.domain.split('.')
              g = k.length
              if (3 <= g) {
                var l = '.' + k[g - 3] + '.' + k[g - 2] + '.' + k[g - 1]
                q(m, c, 'l', f, l)
              }
              2 <= g &&
                ((l = '.' + k[g - 2] + '.' + k[g - 1]), q(m, c, 'l', f, l))
              'undefined' != typeof localStorage &&
                null != localStorage &&
                localStorage.setItem('_vc_lsc_' + m, 'ls' + f + '&' + b)
            }
          }
        }
    }
  }
  function p(a, d) {
    if ('undefined' != typeof a) {
      var e =
        'undefined' !== typeof a ? '?p=' + encodeURIComponent(a) + '&' : '?'
      'undefined' !== typeof d && (e += 'vf=' + encodeURIComponent(d) + '&')
      e += '_s=' + encodeURIComponent(document.URL) + '&_rand=' + Math.random()
      e = 'https://b.imgvc.com/l' + e
      document.createElement('img').src = e
    }
  }
  function q(a, d, e, f, b) {
    document.cookie =
      '_vc_citi_' + a + '=' + e + f + '; expires=' + d + '; path=/; domain=' + b
  }
  function n(a) {
    if (65 <= a && 90 >= a) return a - 65
    if (97 <= a && 122 >= a) return a - 97 + 26
    if (48 <= a && 57 >= a) return a - 48 + 52
    if (45 == a) return 62
    if (95 == a) return 63
    throw Error('unvalid char')
  }
  this.finishLoad = function() {
    var a = document.createElement('img'),
      d = document.createElement('canvas')
    a.addEventListener && 'undefined' != typeof d
      ? (a.addEventListener(
          'load',
          function() {
            try {
              d.width = a.naturalWidth
              d.height = a.naturalHeight
              d.getContext('2d').drawImage(a, 0, 0)
              var e = d.toDataURL('image/png')
              l(e.replace(/^data:image\/(png|jpg);base64,/, ''))
            } catch (f) {
              l(void 0)
            }
          },
          !1
        ),
        (a.crossOrigin = 'anonymous'),
        (a.style.display = 'none'),
        (a.src = 'https://a.imgvc.com/i/bf.png?v=1'),
        document.getElementsByTagName('body')[0].appendChild(a))
      : l(void 0)
  }
}
if ('undefined' == typeof vclpObj) {
  var vclpObj = new VcLp()
  if (document.addEventListener)
    'loading' != document.readyState
      ? vclpObj.finishLoad()
      : document.addEventListener('DOMContentLoaded', vclpObj.finishLoad, !1)
  else if (document.attachEvent) {
    var CheckReadyState = function() {
      'complete' == document.readyState &&
        (document.detachEvent('onreadystatechange', CheckReadyState),
        vclpObj.finishLoad())
    }
    document.attachEvent('onreadystatechange', CheckReadyState)
    ;(function() {
      try {
        document.documentElement.doScroll('left')
      } catch (l) {
        return
      }
      document.detachEvent('onreadystatechange', CheckReadyState)
      vclpObj.finishLoad()
    })()
  } else vclpObj.finishLoad()
}
