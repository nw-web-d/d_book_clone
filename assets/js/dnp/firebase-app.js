/*!
 * @license Firebase v4.5.2
 * Build: rev-646dbb2
 * Terms: https://firebase.google.com/terms/
 */
var firebase = (function() {
  var e = void 0 === e ? self : e
  return (function(t) {
    function r(e) {
      if (o[e]) return o[e].exports
      var n = (o[e] = { i: e, l: !1, exports: {} })
      return t[e].call(n.exports, n, n.exports, r), (n.l = !0), n.exports
    }
    var n = e.webpackJsonpFirebase
    e.webpackJsonpFirebase = function(e, o, a) {
      for (var c, s, u, f = 0, l = []; f < e.length; f++)
        (s = e[f]), i[s] && l.push(i[s][0]), (i[s] = 0)
      for (c in o) Object.prototype.hasOwnProperty.call(o, c) && (t[c] = o[c])
      for (n && n(e, o, a); l.length; ) l.shift()()
      if (a) for (f = 0; f < a.length; f++) u = r((r.s = a[f]))
      return u
    }
    var o = {},
      i = { 5: 0 }
    return (
      (r.e = function(e) {
        function t() {
          ;(c.onerror = c.onload = null), clearTimeout(s)
          var t = i[e]
          0 !== t &&
            (t && t[1](Error('Loading chunk ' + e + ' failed.')),
            (i[e] = void 0))
        }
        var n = i[e]
        if (0 === n)
          return new Promise(function(e) {
            e()
          })
        if (n) return n[2]
        var o = new Promise(function(t, r) {
          n = i[e] = [t, r]
        })
        n[2] = o
        var a = document.getElementsByTagName('head')[0],
          c = document.createElement('script')
        ;(c.type = 'text/javascript'),
          (c.charset = 'utf-8'),
          (c.async = !0),
          (c.timeout = 12e4),
          r.nc && c.setAttribute('nonce', r.nc),
          (c.src = r.p + '' + e + '.js')
        var s = setTimeout(t, 12e4)
        return (c.onerror = c.onload = t), a.appendChild(c), o
      }),
      (r.m = t),
      (r.c = o),
      (r.d = function(e, t, n) {
        r.o(e, t) ||
          Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: n
          })
      }),
      (r.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default
              }
            : function() {
                return e
              }
        return r.d(t, 'a', t), t
      }),
      (r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (r.p = ''),
      (r.oe = function(e) {
        throw (console.error(e), e)
      }),
      r((r.s = 56))
    )
  })([
    function(e, t, r) {
      'use strict'
      function n(e) {
        for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r])
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        n(r(27)),
        n(r(28)),
        n(r(20)),
        n(r(64)),
        n(r(65)),
        n(r(66)),
        n(r(67)),
        n(r(29)),
        n(r(68)),
        n(r(30)),
        n(r(69)),
        n(r(70)),
        n(r(72)),
        n(r(73)),
        n(r(74))
    },
    ,
    ,
    ,
    ,
    ,
    function(e, t, r) {
      'use strict'
      function n() {
        function e(e) {
          h(d[e], 'delete'), delete d[e]
        }
        function t(e) {
          return (e = e || c), a(d, e) || o('no-app', { name: e }), d[e]
        }
        function r(e, t) {
          void 0 === t
            ? (t = c)
            : ('string' == typeof t && '' !== t) ||
              o('bad-app-name', { name: t + '' }),
            a(d, t) && o('duplicate-app', { name: t })
          var r = new u(e, t, b)
          return (d[t] = r), h(r, 'create'), r
        }
        function s() {
          return Object.keys(d).map(function(e) {
            return d[e]
          })
        }
        function f(e, r, n, a, c) {
          v[e] && o('duplicate-service', { name: e }),
            (v[e] = r),
            a &&
              ((y[e] = a),
              s().forEach(function(e) {
                a('create', e)
              }))
          var f = function(r) {
            return (
              void 0 === r && (r = t()),
              'function' != typeof r[e] &&
                o('invalid-app-argument', { name: e }),
              r[e]()
            )
          }
          return (
            void 0 !== n && Object(i.deepExtend)(f, n),
            (b[e] = f),
            (u.prototype[e] = function() {
              for (var t = [], r = 0; r < arguments.length; r++)
                t[r] = arguments[r]
              return this.t.bind(this, e).apply(this, c ? t : [])
            }),
            f
          )
        }
        function l(e) {
          Object(i.deepExtend)(b, e)
        }
        function h(e, t) {
          Object.keys(v).forEach(function(r) {
            var n = p(e, r)
            null !== n && y[n] && y[n](t, e)
          })
        }
        function p(e, t) {
          if ('serverAuth' === t) return null
          var r = t
          return e.options, r
        }
        var d = {},
          v = {},
          y = {},
          b = {
            __esModule: !0,
            initializeApp: r,
            app: t,
            apps: null,
            Promise: Promise,
            SDK_VERSION: '4.5.2',
            INTERNAL: {
              registerService: f,
              createFirebaseNamespace: n,
              extendNamespace: l,
              createSubscribe: i.createSubscribe,
              ErrorFactory: i.ErrorFactory,
              removeApp: e,
              factories: v,
              useAsService: p,
              Promise: Promise,
              deepExtend: i.deepExtend
            }
          }
        return (
          Object(i.patchProperty)(b, 'default', b),
          Object.defineProperty(b, 'apps', { get: s }),
          Object(i.patchProperty)(t, 'App', u),
          b
        )
      }
      function o(e, t) {
        throw l.create(e, t)
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = r(0),
        a = function(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t)
        },
        c = '[DEFAULT]',
        s = [],
        u = (function() {
          function e(e, t, r) {
            ;(this.r = r),
              (this.a = !1),
              (this.u = {}),
              (this.f = t),
              (this.h = Object(i.deepCopy)(e)),
              (this.INTERNAL = {
                getUid: function() {
                  return null
                },
                getToken: function() {
                  return Promise.resolve(null)
                },
                addAuthTokenListener: function(e) {
                  s.push(e),
                    setTimeout(function() {
                      return e(null)
                    }, 0)
                },
                removeAuthTokenListener: function(e) {
                  s = s.filter(function(t) {
                    return t !== e
                  })
                }
              })
          }
          return (
            Object.defineProperty(e.prototype, 'name', {
              get: function() {
                return this.v(), this.f
              },
              enumerable: !0,
              configurable: !0
            }),
            Object.defineProperty(e.prototype, 'options', {
              get: function() {
                return this.v(), this.h
              },
              enumerable: !0,
              configurable: !0
            }),
            (e.prototype.delete = function() {
              var e = this
              return new Promise(function(t) {
                e.v(), t()
              })
                .then(function() {
                  e.r.INTERNAL.removeApp(e.f)
                  var t = []
                  return (
                    Object.keys(e.u).forEach(function(r) {
                      Object.keys(e.u[r]).forEach(function(n) {
                        t.push(e.u[r][n])
                      })
                    }),
                    Promise.all(
                      t.map(function(e) {
                        return e.INTERNAL.delete()
                      })
                    )
                  )
                })
                .then(function() {
                  ;(e.a = !0), (e.u = {})
                })
            }),
            (e.prototype.t = function(e, t) {
              if (
                (void 0 === t && (t = c),
                this.v(),
                this.u[e] || (this.u[e] = {}),
                !this.u[e][t])
              ) {
                var r = t !== c ? t : void 0,
                  n = this.r.INTERNAL.factories[e](
                    this,
                    this.extendApp.bind(this),
                    r
                  )
                this.u[e][t] = n
              }
              return this.u[e][t]
            }),
            (e.prototype.extendApp = function(e) {
              var t = this
              Object(i.deepExtend)(this, e),
                e.INTERNAL &&
                  e.INTERNAL.addAuthTokenListener &&
                  (s.forEach(function(e) {
                    t.INTERNAL.addAuthTokenListener(e)
                  }),
                  (s = []))
            }),
            (e.prototype.v = function() {
              this.a && o('app-deleted', { name: this.f })
            }),
            e
          )
        })()
      ;(u.prototype.name && u.prototype.options) ||
        u.prototype.delete ||
        console.log('dc')
      var f = {
          'no-app':
            "No Firebase App '{$name}' has been created - call Firebase App.initializeApp()",
          'bad-app-name': "Illegal App name: '{$name}",
          'duplicate-app': "Firebase App named '{$name}' already exists",
          'app-deleted': "Firebase App named '{$name}' already deleted",
          'duplicate-service':
            "Firebase service named '{$name}' already registered",
          'sa-not-supported':
            'Initializing the Firebase SDK with a service account is only allowed in a Node.js environment. On client devices, you should instead initialize the SDK with an api key and auth domain',
          'invalid-app-argument':
            'firebase.{$name}() takes either no argument or a Firebase App instance.'
        },
        l = new i.ErrorFactory('app', 'Firebase', f)
      r.d(t, 'firebase', function() {
        return h
      })
      var h = n()
      t.default = h
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function(t, r) {
      var n
      n = (function() {
        return this
      })()
      try {
        n = n || Function('return this')() || (0, eval)('this')
      } catch (t) {
        'object' == typeof e && (n = e)
      }
      t.exports = n
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.CONSTANTS = {
          NODE_CLIENT: !1,
          NODE_ADMIN: !1,
          SDK_VERSION: '${JSCORE_VERSION}'
        })
    },
    ,
    ,
    ,
    ,
    ,
    function(e, t) {
      function r() {
        throw Error('setTimeout has not been defined')
      }
      function n() {
        throw Error('clearTimeout has not been defined')
      }
      function o(e) {
        if (f === setTimeout) return setTimeout(e, 0)
        if ((f === r || !f) && setTimeout)
          return (f = setTimeout), setTimeout(e, 0)
        try {
          return f(e, 0)
        } catch (t) {
          try {
            return f.call(null, e, 0)
          } catch (t) {
            return f.call(this, e, 0)
          }
        }
      }
      function i(e) {
        if (l === clearTimeout) return clearTimeout(e)
        if ((l === n || !l) && clearTimeout)
          return (l = clearTimeout), clearTimeout(e)
        try {
          return l(e)
        } catch (t) {
          try {
            return l.call(null, e)
          } catch (t) {
            return l.call(this, e)
          }
        }
      }
      function a() {
        v &&
          p &&
          ((v = !1), p.length ? (d = p.concat(d)) : (y = -1), d.length && c())
      }
      function c() {
        if (!v) {
          var e = o(a)
          v = !0
          for (var t = d.length; t; ) {
            for (p = d, d = []; ++y < t; ) p && p[y].run()
            ;(y = -1), (t = d.length)
          }
          ;(p = null), (v = !1), i(e)
        }
      }
      function s(e, t) {
        ;(this.fun = e), (this.array = t)
      }
      function u() {}
      var f,
        l,
        h = (e.exports = {})
      !(function() {
        try {
          f = 'function' == typeof setTimeout ? setTimeout : r
        } catch (e) {
          f = r
        }
        try {
          l = 'function' == typeof clearTimeout ? clearTimeout : n
        } catch (e) {
          l = n
        }
      })()
      var p,
        d = [],
        v = !1,
        y = -1
      ;(h.nextTick = function(e) {
        var t = Array(arguments.length - 1)
        if (arguments.length > 1)
          for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r]
        d.push(new s(e, t)), 1 !== d.length || v || o(c)
      }),
        (s.prototype.run = function() {
          this.fun.apply(null, this.array)
        }),
        (h.title = 'browser'),
        (h.browser = !0),
        (h.env = {}),
        (h.argv = []),
        (h.version = ''),
        (h.versions = {}),
        (h.on = u),
        (h.addListener = u),
        (h.once = u),
        (h.off = u),
        (h.removeListener = u),
        (h.removeAllListeners = u),
        (h.emit = u),
        (h.prependListener = u),
        (h.prependOnceListener = u),
        (h.listeners = function(e) {
          return []
        }),
        (h.binding = function(e) {
          throw Error('process.binding is not supported')
        }),
        (h.cwd = function() {
          return '/'
        }),
        (h.chdir = function(e) {
          throw Error('process.chdir is not supported')
        }),
        (h.umask = function() {
          return 0
        })
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r(20)
      ;(t.assert = function(e, r) {
        if (!e) throw t.assertionError(r)
      }),
        (t.assertionError = function(e) {
          return Error(
            'Firebase Database (' +
              n.CONSTANTS.SDK_VERSION +
              ') INTERNAL ASSERT FAILED: ' +
              e
          )
        })
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function(e) {
          for (var t = [], r = 0, n = 0; n < e.length; n++) {
            for (var o = e.charCodeAt(n); o > 255; )
              (t[r++] = 255 & o), (o >>= 8)
            t[r++] = o
          }
          return t
        },
        o = function(e) {
          if (e.length < 8192) return String.fromCharCode.apply(null, e)
          for (var t = '', r = 0; r < e.length; r += 8192) {
            var n = e.slice(r, r + 8192)
            t += String.fromCharCode.apply(null, n)
          }
          return t
        }
      ;(t.base64 = {
        y: null,
        b: null,
        _: null,
        g: null,
        ENCODED_VALS_BASE:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + '+/='
        },
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + '-_.'
        },
        HAS_NATIVE_SUPPORT: 'function' == typeof atob,
        encodeByteArray: function(e, t) {
          if (!Array.isArray(e))
            throw Error('encodeByteArray takes an array as a parameter')
          this.O()
          for (
            var r = t ? this._ : this.y, n = [], o = 0;
            o < e.length;
            o += 3
          ) {
            var i = e[o],
              a = o + 1 < e.length,
              c = a ? e[o + 1] : 0,
              s = o + 2 < e.length,
              u = s ? e[o + 2] : 0,
              f = i >> 2,
              l = ((3 & i) << 4) | (c >> 4),
              h = ((15 & c) << 2) | (u >> 6),
              p = 63 & u
            s || ((p = 64), a || (h = 64)), n.push(r[f], r[l], r[h], r[p])
          }
          return n.join('')
        },
        encodeString: function(e, t) {
          return this.HAS_NATIVE_SUPPORT && !t
            ? btoa(e)
            : this.encodeByteArray(n(e), t)
        },
        decodeString: function(e, t) {
          return this.HAS_NATIVE_SUPPORT && !t
            ? atob(e)
            : o(this.decodeStringToByteArray(e, t))
        },
        decodeStringToByteArray: function(e, t) {
          this.O()
          for (var r = t ? this.g : this.b, n = [], o = 0; o < e.length; ) {
            var i = r[e.charAt(o++)],
              a = o < e.length,
              c = a ? r[e.charAt(o)] : 0
            ++o
            var s = o < e.length,
              u = s ? r[e.charAt(o)] : 64
            ++o
            var f = o < e.length,
              l = f ? r[e.charAt(o)] : 64
            if ((++o, null == i || null == c || null == u || null == l))
              throw Error()
            var h = (i << 2) | (c >> 4)
            if ((n.push(h), 64 != u)) {
              var p = ((c << 4) & 240) | (u >> 2)
              if ((n.push(p), 64 != l)) {
                var d = ((u << 6) & 192) | l
                n.push(d)
              }
            }
          }
          return n
        },
        O: function() {
          if (!this.y) {
            ;(this.y = {}), (this.b = {}), (this._ = {}), (this.g = {})
            for (var e = 0; e < this.ENCODED_VALS.length; e++)
              (this.y[e] = this.ENCODED_VALS.charAt(e)),
                (this.b[this.y[e]] = e),
                (this._[e] = this.ENCODED_VALS_WEBSAFE.charAt(e)),
                (this.g[this._[e]] = e),
                e >= this.ENCODED_VALS_BASE.length &&
                  ((this.b[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                  (this.g[this.ENCODED_VALS.charAt(e)] = e))
          }
        }
      }),
        (t.base64Encode = function(e) {
          var r = n(e)
          return t.base64.encodeByteArray(r, !0)
        }),
        (t.base64Decode = function(e) {
          try {
            return t.base64.decodeString(e, !0)
          } catch (e) {
            console.error('base64Decode failed: ', e)
          }
          return null
        })
    },
    function(e, t, r) {
      'use strict'
      function n(e) {
        return JSON.parse(e)
      }
      function o(e) {
        return JSON.stringify(e)
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.jsonEval = n),
        (t.stringify = o)
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.contains = function(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t)
        }),
        (t.safeGet = function(e, t) {
          if (Object.prototype.hasOwnProperty.call(e, t)) return e[t]
        }),
        (t.forEach = function(e, t) {
          for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && t(r, e[r])
        }),
        (t.extend = function(e, r) {
          return (
            t.forEach(r, function(t, r) {
              e[t] = r
            }),
            e
          )
        }),
        (t.clone = function(e) {
          return t.extend({}, e)
        }),
        (t.isNonNullObject = function(e) {
          return 'object' == typeof e && null !== e
        }),
        (t.isEmpty = function(e) {
          for (var t in e) return !1
          return !0
        }),
        (t.getCount = function(e) {
          var t = 0
          for (var r in e) t++
          return t
        }),
        (t.map = function(e, t, r) {
          var n = {}
          for (var o in e) n[o] = t.call(r, e[o], o, e)
          return n
        }),
        (t.findKey = function(e, t, r) {
          for (var n in e) if (t.call(r, e[n], n, e)) return n
        }),
        (t.findValue = function(e, r, n) {
          var o = t.findKey(e, r, n)
          return o && e[o]
        }),
        (t.getAnyKey = function(e) {
          for (var t in e) return t
        }),
        (t.getValues = function(e) {
          var t = [],
            r = 0
          for (var n in e) t[r++] = e[n]
          return t
        }),
        (t.every = function(e, t) {
          for (var r in e)
            if (Object.prototype.hasOwnProperty.call(e, r) && !t(r, e[r]))
              return !1
          return !0
        })
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function(e, t, r) {
      r(57), (e.exports = r(6).default)
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r(58),
        o = (r.n(n), r(62)),
        i = (r.n(o), r(63))
      r.n(i)
    },
    function(t, r, n) {
      ;(function(t) {
        var r = (function() {
          if (void 0 !== t) return t
          if (void 0 !== e) return e
          if ('undefined' != typeof self) return self
          throw Error('unable to locate global object')
        })()
        'undefined' == typeof Promise && (r.Promise = Promise = n(59))
      }.call(r, n(19)))
    },
    function(e, t, r) {
      ;(function(t) {
        !(function(r) {
          function n() {}
          function o(e, t) {
            return function() {
              e.apply(t, arguments)
            }
          }
          function i(e) {
            if ('object' != typeof this)
              throw new TypeError('Promises must be constructed via new')
            if ('function' != typeof e) throw new TypeError('not a function')
            ;(this.T = 0),
              (this.A = !1),
              (this.j = void 0),
              (this.w = []),
              l(e, this)
          }
          function a(e, t) {
            for (; 3 === e.T; ) e = e.j
            if (0 === e.T) return void e.w.push(t)
            ;(e.A = !0),
              i.S(function() {
                var r = 1 === e.T ? t.onFulfilled : t.onRejected
                if (null === r) return void (1 === e.T ? c : s)(t.promise, e.j)
                var n
                try {
                  n = r(e.j)
                } catch (e) {
                  return void s(t.promise, e)
                }
                c(t.promise, n)
              })
          }
          function c(e, t) {
            try {
              if (t === e)
                throw new TypeError('A promise cannot be resolved with itself.')
              if (t && ('object' == typeof t || 'function' == typeof t)) {
                var r = t.then
                if (t instanceof i) return (e.T = 3), (e.j = t), void u(e)
                if ('function' == typeof r) return void l(o(r, t), e)
              }
              ;(e.T = 1), (e.j = t), u(e)
            } catch (t) {
              s(e, t)
            }
          }
          function s(e, t) {
            ;(e.T = 2), (e.j = t), u(e)
          }
          function u(e) {
            2 === e.T &&
              0 === e.w.length &&
              i.S(function() {
                e.A || i.P(e.j)
              })
            for (var t = 0, r = e.w.length; t < r; t++) a(e, e.w[t])
            e.w = null
          }
          function f(e, t, r) {
            ;(this.onFulfilled = 'function' == typeof e ? e : null),
              (this.onRejected = 'function' == typeof t ? t : null),
              (this.promise = r)
          }
          function l(e, t) {
            var r = !1
            try {
              e(
                function(e) {
                  r || ((r = !0), c(t, e))
                },
                function(e) {
                  r || ((r = !0), s(t, e))
                }
              )
            } catch (e) {
              if (r) return
              ;(r = !0), s(t, e)
            }
          }
          var h = setTimeout
          ;(i.prototype.catch = function(e) {
            return this.then(null, e)
          }),
            (i.prototype.then = function(e, t) {
              var r = new this.constructor(n)
              return a(this, new f(e, t, r)), r
            }),
            (i.all = function(e) {
              var t = Array.prototype.slice.call(e)
              return new i(function(e, r) {
                function n(i, a) {
                  try {
                    if (a && ('object' == typeof a || 'function' == typeof a)) {
                      var c = a.then
                      if ('function' == typeof c)
                        return void c.call(
                          a,
                          function(e) {
                            n(i, e)
                          },
                          r
                        )
                    }
                    ;(t[i] = a), 0 == --o && e(t)
                  } catch (e) {
                    r(e)
                  }
                }
                if (0 === t.length) return e([])
                for (var o = t.length, i = 0; i < t.length; i++) n(i, t[i])
              })
            }),
            (i.resolve = function(e) {
              return e && 'object' == typeof e && e.constructor === i
                ? e
                : new i(function(t) {
                    t(e)
                  })
            }),
            (i.reject = function(e) {
              return new i(function(t, r) {
                r(e)
              })
            }),
            (i.race = function(e) {
              return new i(function(t, r) {
                for (var n = 0, o = e.length; n < o; n++) e[n].then(t, r)
              })
            }),
            (i.S =
              ('function' == typeof t &&
                function(e) {
                  t(e)
                }) ||
              function(e) {
                h(e, 0)
              }),
            (i.P = function(e) {
              'undefined' != typeof console &&
                console &&
                console.warn('Possible Unhandled Promise Rejection:', e)
            }),
            (i.N = function(e) {
              i.S = e
            }),
            (i.C = function(e) {
              i.P = e
            }),
            void 0 !== e && e.exports
              ? (e.exports = i)
              : r.Promise || (r.Promise = i)
        })(this)
      }.call(t, r(60).setImmediate))
    },
    function(t, r, n) {
      function o(e, t) {
        ;(this.k = e), (this.M = t)
      }
      var i = Function.prototype.apply
      ;(r.setTimeout = function() {
        return new o(i.call(setTimeout, e, arguments), clearTimeout)
      }),
        (r.setInterval = function() {
          return new o(i.call(setInterval, e, arguments), clearInterval)
        }),
        (r.clearTimeout = r.clearInterval = function(e) {
          e && e.close()
        }),
        (o.prototype.unref = o.prototype.ref = function() {}),
        (o.prototype.close = function() {
          this.M.call(e, this.k)
        }),
        (r.enroll = function(e, t) {
          clearTimeout(e.D), (e.I = t)
        }),
        (r.unenroll = function(e) {
          clearTimeout(e.D), (e.I = -1)
        }),
        (r.x = r.active = function(e) {
          clearTimeout(e.D)
          var t = e.I
          t >= 0 &&
            (e.D = setTimeout(function() {
              e.F && e.F()
            }, t))
        }),
        n(61),
        (r.setImmediate = setImmediate),
        (r.clearImmediate = clearImmediate)
    },
    function(e, t, r) {
      ;(function(e, t) {
        !(function(e, r) {
          'use strict'
          function n(e) {
            'function' != typeof e && (e = Function('' + e))
            for (var t = Array(arguments.length - 1), r = 0; r < t.length; r++)
              t[r] = arguments[r + 1]
            var n = { callback: e, args: t }
            return (u[s] = n), c(s), s++
          }
          function o(e) {
            delete u[e]
          }
          function i(e) {
            var t = e.callback,
              n = e.args
            switch (n.length) {
              case 0:
                t()
                break
              case 1:
                t(n[0])
                break
              case 2:
                t(n[0], n[1])
                break
              case 3:
                t(n[0], n[1], n[2])
                break
              default:
                t.apply(r, n)
            }
          }
          function a(e) {
            if (f) setTimeout(a, 0, e)
            else {
              var t = u[e]
              if (t) {
                f = !0
                try {
                  i(t)
                } finally {
                  o(e), (f = !1)
                }
              }
            }
          }
          if (!e.setImmediate) {
            var c,
              s = 1,
              u = {},
              f = !1,
              l = e.document,
              h = Object.getPrototypeOf && Object.getPrototypeOf(e)
            ;(h = h && h.setTimeout ? h : e),
              '[object process]' === {}.toString.call(e.process)
                ? (function() {
                    c = function(e) {
                      t.nextTick(function() {
                        a(e)
                      })
                    }
                  })()
                : (function() {
                    if (e.postMessage && !e.importScripts) {
                      var t = !0,
                        r = e.onmessage
                      return (
                        (e.onmessage = function() {
                          t = !1
                        }),
                        e.postMessage('', '*'),
                        (e.onmessage = r),
                        t
                      )
                    }
                  })()
                ? (function() {
                    var t = 'setImmediate$' + Math.random() + '$',
                      r = function(r) {
                        r.source === e &&
                          'string' == typeof r.data &&
                          0 === r.data.indexOf(t) &&
                          a(+r.data.slice(t.length))
                      }
                    e.addEventListener
                      ? e.addEventListener('message', r, !1)
                      : e.attachEvent('onmessage', r),
                      (c = function(r) {
                        e.postMessage(t + r, '*')
                      })
                  })()
                : e.MessageChannel
                ? (function() {
                    var e = new MessageChannel()
                    ;(e.port1.onmessage = function(e) {
                      a(e.data)
                    }),
                      (c = function(t) {
                        e.port2.postMessage(t)
                      })
                  })()
                : l && 'onreadystatechange' in l.createElement('script')
                ? (function() {
                    var e = l.documentElement
                    c = function(t) {
                      var r = l.createElement('script')
                      ;(r.onreadystatechange = function() {
                        a(t),
                          (r.onreadystatechange = null),
                          e.removeChild(r),
                          (r = null)
                      }),
                        e.appendChild(r)
                    }
                  })()
                : (function() {
                    c = function(e) {
                      setTimeout(a, 0, e)
                    }
                  })(),
              (h.setImmediate = n),
              (h.clearImmediate = o)
          }
        })('undefined' == typeof self ? (void 0 === e ? this : e) : self)
      }.call(t, r(19), r(26)))
    },
    function(e, t) {
      Array.prototype.find ||
        Object.defineProperty(Array.prototype, 'find', {
          value: function(e) {
            if (null == this)
              throw new TypeError('"this" is null or not defined')
            var t = Object(this),
              r = t.length >>> 0
            if ('function' != typeof e)
              throw new TypeError('predicate must be a function')
            for (var n = arguments[1], o = 0; o < r; ) {
              var i = t[o]
              if (e.call(n, i, o, t)) return i
              o++
            }
          }
        })
    },
    function(e, t) {
      Array.prototype.findIndex ||
        Object.defineProperty(Array.prototype, 'findIndex', {
          value: function(e) {
            if (null == this)
              throw new TypeError('"this" is null or not defined')
            var t = Object(this),
              r = t.length >>> 0
            if ('function' != typeof e)
              throw new TypeError('predicate must be a function')
            for (var n = arguments[1], o = 0; o < r; ) {
              var i = t[o]
              if (e.call(n, i, o, t)) return o
              o++
            }
            return -1
          }
        })
    },
    function(e, t, r) {
      'use strict'
      function n(e) {
        return o(void 0, e)
      }
      function o(e, t) {
        if (!(t instanceof Object)) return t
        switch (t.constructor) {
          case Date:
            var r = t
            return new Date(r.getTime())
          case Object:
            void 0 === e && (e = {})
            break
          case Array:
            e = []
            break
          default:
            return t
        }
        for (var n in t) t.hasOwnProperty(n) && (e[n] = o(e[n], t[n]))
        return e
      }
      function i(e, t, r) {
        e[t] = r
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.deepCopy = n),
        (t.deepExtend = o),
        (t.patchProperty = i)
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = (function() {
        function e() {
          var e = this
          this.promise = new Promise(function(t, r) {
            ;(e.resolve = t), (e.reject = r)
          })
        }
        return (
          (e.prototype.wrapCallback = function(e) {
            var t = this
            return function(r, n) {
              r ? t.reject(r) : t.resolve(n),
                'function' == typeof e &&
                  (t.promise.catch(function() {}),
                  1 === e.length ? e(r) : e(r, n))
            }
          }),
          e
        )
      })()
      t.Deferred = n
    },
    function(t, r, n) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 })
      var o = n(20)
      ;(r.getUA = function() {
        return 'undefined' != typeof navigator &&
          'string' == typeof navigator.userAgent
          ? navigator.userAgent
          : ''
      }),
        (r.isMobileCordova = function() {
          return (
            void 0 !== e &&
            !!(e.cordova || e.phonegap || e.PhoneGap) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(r.getUA())
          )
        }),
        (r.isReactNative = function() {
          return (
            'object' == typeof navigator && 'ReactNative' === navigator.product
          )
        }),
        (r.isNodeSdk = function() {
          return !0 === o.CONSTANTS.NODE_CLIENT || !0 === o.CONSTANTS.NODE_ADMIN
        })
    },
    function(e, t, r) {
      'use strict'
      function n(e) {
        var t = i
        return (i = e), t
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = 'FirebaseError',
        i = Error.captureStackTrace
      t.patchCapture = n
      var a = (function() {
        function e(e, t) {
          if (((this.code = e), (this.message = t), i))
            i(this, c.prototype.create)
          else {
            var r = Error.apply(this, arguments)
            ;(this.name = o),
              Object.defineProperty(this, 'stack', {
                get: function() {
                  return r.stack
                }
              })
          }
        }
        return e
      })()
      ;(t.FirebaseError = a),
        (a.prototype = Object.create(Error.prototype)),
        (a.prototype.constructor = a),
        (a.prototype.name = o)
      var c = (function() {
        function e(e, t, r) {
          ;(this.service = e),
            (this.serviceName = t),
            (this.errors = r),
            (this.pattern = /\{\$([^}]+)}/g)
        }
        return (
          (e.prototype.create = function(e, t) {
            void 0 === t && (t = {})
            var r,
              n = this.errors[e],
              o = this.service + '/' + e
            ;(r =
              void 0 === n
                ? 'Error'
                : n.replace(this.pattern, function(e, r) {
                    var n = t[r]
                    return void 0 !== n ? '' + n : '<' + r + '?>'
                  })),
              (r = this.serviceName + ': ' + r + ' (' + o + ').')
            var i = new a(o, r)
            for (var c in t)
              t.hasOwnProperty(c) && '_' !== c.slice(-1) && (i[c] = t[c])
            return i
          }),
          e
        )
      })()
      t.ErrorFactory = c
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r(28),
        o = r(29)
      ;(t.decode = function(e) {
        var t = {},
          r = {},
          i = {},
          a = ''
        try {
          var c = e.split('.')
          ;(t = o.jsonEval(n.base64Decode(c[0]) || '')),
            (r = o.jsonEval(n.base64Decode(c[1]) || '')),
            (a = c[2]),
            (i = r.d || {}),
            delete r.d
        } catch (e) {}
        return { header: t, claims: r, data: i, signature: a }
      }),
        (t.isValidTimestamp = function(e) {
          var r,
            n,
            o = t.decode(e).claims,
            i = Math.floor(new Date().getTime() / 1e3)
          return (
            'object' == typeof o &&
              (o.hasOwnProperty('nbf')
                ? (r = o.nbf)
                : o.hasOwnProperty('iat') && (r = o.iat),
              (n = o.hasOwnProperty('exp') ? o.exp : r + 86400)),
            i && r && n && i >= r && i <= n
          )
        }),
        (t.issuedAtTime = function(e) {
          var r = t.decode(e).claims
          return 'object' == typeof r && r.hasOwnProperty('iat') ? r.iat : null
        }),
        (t.isValidFormat = function(e) {
          var r = t.decode(e),
            n = r.claims
          return (
            !!r.signature &&
            !!n &&
            'object' == typeof n &&
            n.hasOwnProperty('iat')
          )
        }),
        (t.isAdmin = function(e) {
          var r = t.decode(e).claims
          return 'object' == typeof r && !0 === r.admin
        })
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r(30)
      ;(t.querystring = function(e) {
        var t = []
        return (
          n.forEach(e, function(e, r) {
            Array.isArray(r)
              ? r.forEach(function(r) {
                  t.push(encodeURIComponent(e) + '=' + encodeURIComponent(r))
                })
              : t.push(encodeURIComponent(e) + '=' + encodeURIComponent(r))
          }),
          t.length ? '&' + t.join('&') : ''
        )
      }),
        (t.querystringDecode = function(e) {
          var t = {}
          return (
            e
              .replace(/^\?/, '')
              .split('&')
              .forEach(function(e) {
                if (e) {
                  var r = e.split('=')
                  t[r[0]] = r[1]
                }
              }),
            t
          )
        })
    },
    function(e, t, r) {
      'use strict'
      var n =
        (this && this.__extends) ||
        (function() {
          var e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t
              }) ||
            function(e, t) {
              for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
            }
          return function(t, r) {
            function n() {
              this.constructor = t
            }
            e(t, r),
              (t.prototype =
                null === r
                  ? Object.create(r)
                  : ((n.prototype = r.prototype), new n()))
          }
        })()
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = r(71),
        i = (function(e) {
          function t() {
            var t = e.call(this) || this
            ;(t.L = []),
              (t.R = []),
              (t.B = []),
              (t.V = []),
              (t.z = 0),
              (t.W = 0),
              (t.blockSize = 64),
              (t.V[0] = 128)
            for (var r = 1; r < t.blockSize; ++r) t.V[r] = 0
            return t.reset(), t
          }
          return (
            n(t, e),
            (t.prototype.reset = function() {
              ;(this.L[0] = 1732584193),
                (this.L[1] = 4023233417),
                (this.L[2] = 2562383102),
                (this.L[3] = 271733878),
                (this.L[4] = 3285377520),
                (this.z = 0),
                (this.W = 0)
            }),
            (t.prototype.U = function(e, t) {
              t || (t = 0)
              var r = this.B
              if ('string' == typeof e)
                for (var n = 0; n < 16; n++)
                  (r[n] =
                    (e.charCodeAt(t) << 24) |
                    (e.charCodeAt(t + 1) << 16) |
                    (e.charCodeAt(t + 2) << 8) |
                    e.charCodeAt(t + 3)),
                    (t += 4)
              else
                for (var n = 0; n < 16; n++)
                  (r[n] =
                    (e[t] << 24) |
                    (e[t + 1] << 16) |
                    (e[t + 2] << 8) |
                    e[t + 3]),
                    (t += 4)
              for (var n = 16; n < 80; n++) {
                var o = r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16]
                r[n] = 4294967295 & ((o << 1) | (o >>> 31))
              }
              for (
                var i,
                  a,
                  c = this.L[0],
                  s = this.L[1],
                  u = this.L[2],
                  f = this.L[3],
                  l = this.L[4],
                  n = 0;
                n < 80;
                n++
              ) {
                n < 40
                  ? n < 20
                    ? ((i = f ^ (s & (u ^ f))), (a = 1518500249))
                    : ((i = s ^ u ^ f), (a = 1859775393))
                  : n < 60
                  ? ((i = (s & u) | (f & (s | u))), (a = 2400959708))
                  : ((i = s ^ u ^ f), (a = 3395469782))
                var o =
                  (((c << 5) | (c >>> 27)) + i + l + a + r[n]) & 4294967295
                ;(l = f),
                  (f = u),
                  (u = 4294967295 & ((s << 30) | (s >>> 2))),
                  (s = c),
                  (c = o)
              }
              ;(this.L[0] = (this.L[0] + c) & 4294967295),
                (this.L[1] = (this.L[1] + s) & 4294967295),
                (this.L[2] = (this.L[2] + u) & 4294967295),
                (this.L[3] = (this.L[3] + f) & 4294967295),
                (this.L[4] = (this.L[4] + l) & 4294967295)
            }),
            (t.prototype.update = function(e, t) {
              if (null != e) {
                void 0 === t && (t = e.length)
                for (
                  var r = t - this.blockSize, n = 0, o = this.R, i = this.z;
                  n < t;

                ) {
                  if (0 == i)
                    for (; n <= r; ) this.U(e, n), (n += this.blockSize)
                  if ('string' == typeof e) {
                    for (; n < t; )
                      if (
                        ((o[i] = e.charCodeAt(n)),
                        ++i,
                        ++n,
                        i == this.blockSize)
                      ) {
                        this.U(o), (i = 0)
                        break
                      }
                  } else
                    for (; n < t; )
                      if (((o[i] = e[n]), ++i, ++n, i == this.blockSize)) {
                        this.U(o), (i = 0)
                        break
                      }
                }
                ;(this.z = i), (this.W += t)
              }
            }),
            (t.prototype.digest = function() {
              var e = [],
                t = 8 * this.W
              this.z < 56
                ? this.update(this.V, 56 - this.z)
                : this.update(this.V, this.blockSize - (this.z - 56))
              for (var r = this.blockSize - 1; r >= 56; r--)
                (this.R[r] = 255 & t), (t /= 256)
              this.U(this.R)
              for (var n = 0, r = 0; r < 5; r++)
                for (var o = 24; o >= 0; o -= 8)
                  (e[n] = (this.L[r] >> o) & 255), ++n
              return e
            }),
            t
          )
        })(o.Hash)
      t.Sha1 = i
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = (function() {
        function e() {
          this.blockSize = -1
        }
        return e
      })()
      t.Hash = n
    },
    function(e, t, r) {
      'use strict'
      function n(e, t) {
        var r = new c(e, t)
        return r.subscribe.bind(r)
      }
      function o(e, t) {
        return function() {
          for (var r = [], n = 0; n < arguments.length; n++) r[n] = arguments[n]
          Promise.resolve(!0)
            .then(function() {
              e.apply(void 0, r)
            })
            .catch(function(e) {
              t && t(e)
            })
        }
      }
      function i(e, t) {
        if ('object' != typeof e || null === e) return !1
        for (var r = 0, n = t; r < n.length; r++) {
          var o = n[r]
          if (o in e && 'function' == typeof e[o]) return !0
        }
        return !1
      }
      function a() {}
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createSubscribe = n)
      var c = (function() {
        function e(e, t) {
          var r = this
          ;(this.observers = []),
            (this.unsubscribes = []),
            (this.observerCount = 0),
            (this.task = Promise.resolve()),
            (this.finalized = !1),
            (this.onNoObservers = t),
            this.task
              .then(function() {
                e(r)
              })
              .catch(function(e) {
                r.error(e)
              })
        }
        return (
          (e.prototype.next = function(e) {
            this.forEachObserver(function(t) {
              t.next(e)
            })
          }),
          (e.prototype.error = function(e) {
            this.forEachObserver(function(t) {
              t.error(e)
            }),
              this.close(e)
          }),
          (e.prototype.complete = function() {
            this.forEachObserver(function(e) {
              e.complete()
            }),
              this.close()
          }),
          (e.prototype.subscribe = function(e, t, r) {
            var n,
              o = this
            if (void 0 === e && void 0 === t && void 0 === r)
              throw Error('Missing Observer.')
            ;(n = i(e, ['next', 'error', 'complete'])
              ? e
              : { next: e, error: t, complete: r }),
              void 0 === n.next && (n.next = a),
              void 0 === n.error && (n.error = a),
              void 0 === n.complete && (n.complete = a)
            var c = this.unsubscribeOne.bind(this, this.observers.length)
            return (
              this.finalized &&
                this.task.then(function() {
                  try {
                    o.finalError ? n.error(o.finalError) : n.complete()
                  } catch (e) {}
                }),
              this.observers.push(n),
              c
            )
          }),
          (e.prototype.unsubscribeOne = function(e) {
            void 0 !== this.observers &&
              void 0 !== this.observers[e] &&
              (delete this.observers[e],
              (this.observerCount -= 1),
              0 === this.observerCount &&
                void 0 !== this.onNoObservers &&
                this.onNoObservers(this))
          }),
          (e.prototype.forEachObserver = function(e) {
            if (!this.finalized)
              for (var t = 0; t < this.observers.length; t++) this.sendOne(t, e)
          }),
          (e.prototype.sendOne = function(e, t) {
            var r = this
            this.task.then(function() {
              if (void 0 !== r.observers && void 0 !== r.observers[e])
                try {
                  t(r.observers[e])
                } catch (e) {
                  'undefined' != typeof console &&
                    console.error &&
                    console.error(e)
                }
            })
          }),
          (e.prototype.close = function(e) {
            var t = this
            this.finalized ||
              ((this.finalized = !0),
              void 0 !== e && (this.finalError = e),
              this.task.then(function() {
                ;(t.observers = void 0), (t.onNoObservers = void 0)
              }))
          }),
          e
        )
      })()
      t.async = o
    },
    function(e, t, r) {
      'use strict'
      function n(e, t, r) {
        var n = ''
        switch (t) {
          case 1:
            n = r ? 'first' : 'First'
            break
          case 2:
            n = r ? 'second' : 'Second'
            break
          case 3:
            n = r ? 'third' : 'Third'
            break
          case 4:
            n = r ? 'fourth' : 'Fourth'
            break
          default:
            throw Error(
              'errorPrefix called with argumentNumber > 4.  Need to update it?'
            )
        }
        var o = e + ' failed: '
        return (o += n + ' argument ')
      }
      function o(e, t, r, o) {
        if ((!o || r) && 'string' != typeof r)
          throw Error(n(e, t, o) + 'must be a valid firebase namespace.')
      }
      function i(e, t, r, o) {
        if ((!o || r) && 'function' != typeof r)
          throw Error(n(e, t, o) + 'must be a valid function.')
      }
      function a(e, t, r, o) {
        if ((!o || r) && ('object' != typeof r || null === r))
          throw Error(n(e, t, o) + 'must be a valid context object.')
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.validateArgCount = function(e, t, r, n) {
          var o
          if (
            (n < t
              ? (o = 'at least ' + t)
              : n > r && (o = 0 === r ? 'none' : 'no more than ' + r),
            o)
          ) {
            var i =
              e +
              ' failed: Was called with ' +
              n +
              (1 === n ? ' argument.' : ' arguments.') +
              ' Expects ' +
              o +
              '.'
            throw Error(i)
          }
        }),
        (t.errorPrefix = n),
        (t.validateNamespace = o),
        (t.validateCallback = i),
        (t.validateContextObject = a)
    },
    function(e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r(27)
      ;(t.stringToByteArray = function(e) {
        for (var t = [], r = 0, o = 0; o < e.length; o++) {
          var i = e.charCodeAt(o)
          if (i >= 55296 && i <= 56319) {
            var a = i - 55296
            o++,
              n.assert(o < e.length, 'Surrogate pair missing trail surrogate.'),
              (i = 65536 + (a << 10) + (e.charCodeAt(o) - 56320))
          }
          i < 128
            ? (t[r++] = i)
            : i < 2048
            ? ((t[r++] = (i >> 6) | 192), (t[r++] = (63 & i) | 128))
            : i < 65536
            ? ((t[r++] = (i >> 12) | 224),
              (t[r++] = ((i >> 6) & 63) | 128),
              (t[r++] = (63 & i) | 128))
            : ((t[r++] = (i >> 18) | 240),
              (t[r++] = ((i >> 12) & 63) | 128),
              (t[r++] = ((i >> 6) & 63) | 128),
              (t[r++] = (63 & i) | 128))
        }
        return t
      }),
        (t.stringLength = function(e) {
          for (var t = 0, r = 0; r < e.length; r++) {
            var n = e.charCodeAt(r)
            n < 128
              ? t++
              : n < 2048
              ? (t += 2)
              : n >= 55296 && n <= 56319
              ? ((t += 4), r++)
              : (t += 3)
          }
          return t
        })
    }
  ])
})().default
//# sourceMappingURL=firebase-app.js.map
