var Qt, $, xa, He, Zn, $a, Wa, sn, $t, yt, Da, An, vn, _n, Ut = {}, Mt = [], Fr = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, wt = Array.isArray;
function Ce(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function wn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function t(e, n, a) {
  var r, s, l, c = {};
  for (l in n) l == "key" ? r = n[l] : l == "ref" ? s = n[l] : c[l] = n[l];
  if (arguments.length > 2 && (c.children = arguments.length > 3 ? Qt.call(arguments, 2) : a), typeof e == "function" && e.defaultProps != null) for (l in e.defaultProps) c[l] === void 0 && (c[l] = e.defaultProps[l]);
  return Wt(e, c, r, s, null);
}
function Wt(e, n, a, r, s) {
  var l = { type: e, props: n, key: a, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: s ?? ++xa, __i: -1, __u: 0 };
  return s == null && $.vnode != null && $.vnode(l), l;
}
function ot(e) {
  return e.children;
}
function Le(e, n) {
  this.props = e, this.context = n;
}
function it(e, n) {
  if (n == null) return e.__ ? it(e.__, e.__i + 1) : null;
  for (var a; n < e.__k.length; n++) if ((a = e.__k[n]) != null && a.__e != null) return a.__e;
  return typeof e.type == "function" ? it(e) : null;
}
function Ur(e) {
  if (e.__P && e.__d) {
    var n = e.__v, a = n.__e, r = [], s = [], l = Ce({}, n);
    l.__v = n.__v + 1, $.vnode && $.vnode(l), En(e.__P, l, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [a] : null, r, a ?? it(n), !!(32 & n.__u), s), l.__v = n.__v, l.__.__k[l.__i] = l, Va(r, l, s), n.__e = n.__ = null, l.__e != a && Oa(l);
  }
}
function Oa(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(n) {
    if (n != null && n.__e != null) return e.__e = e.__c.base = n.__e;
  }), Oa(e);
}
function ea(e) {
  (!e.__d && (e.__d = !0) && He.push(e) && !Vt.__r++ || Zn != $.debounceRendering) && ((Zn = $.debounceRendering) || $a)(Vt);
}
function Vt() {
  try {
    for (var e, n = 1; He.length; ) He.length > n && He.sort(Wa), e = He.shift(), n = He.length, Ur(e);
  } finally {
    He.length = Vt.__r = 0;
  }
}
function Fa(e, n, a, r, s, l, c, g, f, d, h) {
  var b, u, y, p, v, P, L, k = r && r.__k || Mt, G = n.length;
  for (f = Mr(a, n, k, f, G), b = 0; b < G; b++) (y = a.__k[b]) != null && (u = y.__i != -1 && k[y.__i] || Ut, y.__i = b, P = En(e, y, u, s, l, c, g, f, d, h), p = y.__e, y.ref && u.ref != y.ref && (u.ref && Pn(u.ref, null, y), h.push(y.ref, y.__c || p, y)), v == null && p != null && (v = p), (L = !!(4 & y.__u)) || u.__k === y.__k ? (f = Ua(y, f, e, L), L && u.__e && (u.__e = null)) : typeof y.type == "function" && P !== void 0 ? f = P : p && (f = p.nextSibling), y.__u &= -7);
  return a.__e = v, f;
}
function Mr(e, n, a, r, s) {
  var l, c, g, f, d, h = a.length, b = h, u = 0;
  for (e.__k = new Array(s), l = 0; l < s; l++) (c = n[l]) != null && typeof c != "boolean" && typeof c != "function" ? (typeof c == "string" || typeof c == "number" || typeof c == "bigint" || c.constructor == String ? c = e.__k[l] = Wt(null, c, null, null, null) : wt(c) ? c = e.__k[l] = Wt(ot, { children: c }, null, null, null) : c.constructor === void 0 && c.__b > 0 ? c = e.__k[l] = Wt(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v) : e.__k[l] = c, f = l + u, c.__ = e, c.__b = e.__b + 1, g = null, (d = c.__i = Vr(c, a, f, b)) != -1 && (b--, (g = a[d]) && (g.__u |= 2)), g == null || g.__v == null ? (d == -1 && (s > h ? u-- : s < h && u++), typeof c.type != "function" && (c.__u |= 4)) : d != f && (d == f - 1 ? u-- : d == f + 1 ? u++ : (d > f ? u-- : u++, c.__u |= 4))) : e.__k[l] = null;
  if (b) for (l = 0; l < h; l++) (g = a[l]) != null && (2 & g.__u) == 0 && (g.__e == r && (r = it(g)), qa(g, g));
  return r;
}
function Ua(e, n, a, r) {
  var s, l;
  if (typeof e.type == "function") {
    for (s = e.__k, l = 0; s && l < s.length; l++) s[l] && (s[l].__ = e, n = Ua(s[l], n, a, r));
    return n;
  }
  e.__e != n && (r && (n && e.type && !n.parentNode && (n = it(e)), a.insertBefore(e.__e, n || null)), n = e.__e);
  do
    n = n && n.nextSibling;
  while (n != null && n.nodeType == 8);
  return n;
}
function Ht(e, n) {
  return n = n || [], e == null || typeof e == "boolean" || (wt(e) ? e.some(function(a) {
    Ht(a, n);
  }) : n.push(e)), n;
}
function Vr(e, n, a, r) {
  var s, l, c, g = e.key, f = e.type, d = n[a], h = d != null && (2 & d.__u) == 0;
  if (d === null && g == null || h && g == d.key && f == d.type) return a;
  if (r > (h ? 1 : 0)) {
    for (s = a - 1, l = a + 1; s >= 0 || l < n.length; ) if ((d = n[c = s >= 0 ? s-- : l++]) != null && (2 & d.__u) == 0 && g == d.key && f == d.type) return c;
  }
  return -1;
}
function ta(e, n, a) {
  n[0] == "-" ? e.setProperty(n, a ?? "") : e[n] = a == null ? "" : typeof a != "number" || Fr.test(n) ? a : a + "px";
}
function Gt(e, n, a, r, s) {
  var l, c;
  e: if (n == "style") if (typeof a == "string") e.style.cssText = a;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (n in r) a && n in a || ta(e.style, n, "");
    if (a) for (n in a) r && a[n] == r[n] || ta(e.style, n, a[n]);
  }
  else if (n[0] == "o" && n[1] == "n") l = n != (n = n.replace(Da, "$1")), c = n.toLowerCase(), n = c in e || n == "onFocusOut" || n == "onFocusIn" ? c.slice(2) : n.slice(2), e.l || (e.l = {}), e.l[n + l] = a, a ? r ? a[yt] = r[yt] : (a[yt] = An, e.addEventListener(n, l ? _n : vn, l)) : e.removeEventListener(n, l ? _n : vn, l);
  else {
    if (s == "http://www.w3.org/2000/svg") n = n.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (n != "width" && n != "height" && n != "href" && n != "list" && n != "form" && n != "tabIndex" && n != "download" && n != "rowSpan" && n != "colSpan" && n != "role" && n != "popover" && n in e) try {
      e[n] = a ?? "";
      break e;
    } catch {
    }
    typeof a == "function" || (a == null || a === !1 && n[4] != "-" ? e.removeAttribute(n) : e.setAttribute(n, n == "popover" && a == 1 ? "" : a));
  }
}
function na(e) {
  return function(n) {
    if (this.l) {
      var a = this.l[n.type + e];
      if (n[$t] == null) n[$t] = An++;
      else if (n[$t] < a[yt]) return;
      return a($.event ? $.event(n) : n);
    }
  };
}
function En(e, n, a, r, s, l, c, g, f, d) {
  var h, b, u, y, p, v, P, L, k, G, x, D, H, q, Z, Y, F = n.type;
  if (n.constructor !== void 0) return null;
  128 & a.__u && (f = !!(32 & a.__u), l = [g = n.__e = a.__e]), (h = $.__b) && h(n);
  e: if (typeof F == "function") {
    b = c.length;
    try {
      if (k = n.props, G = F.prototype && F.prototype.render, x = (h = F.contextType) && r[h.__c], D = h ? x ? x.props.value : h.__ : r, a.__c ? L = (u = n.__c = a.__c).__ = u.__E : (G ? n.__c = u = new F(k, D) : (n.__c = u = new Le(k, D), u.constructor = F, u.render = qr), x && x.sub(u), u.state || (u.state = {}), u.__n = r, y = u.__d = !0, u.__h = [], u._sb = []), G && u.__s == null && (u.__s = u.state), G && F.getDerivedStateFromProps != null && (u.__s == u.state && (u.__s = Ce({}, u.__s)), Ce(u.__s, F.getDerivedStateFromProps(k, u.__s))), p = u.props, v = u.state, u.__v = n, y) G && F.getDerivedStateFromProps == null && u.componentWillMount != null && u.componentWillMount(), G && u.componentDidMount != null && u.__h.push(u.componentDidMount);
      else {
        if (G && F.getDerivedStateFromProps == null && k !== p && u.componentWillReceiveProps != null && u.componentWillReceiveProps(k, D), n.__v == a.__v || !u.__e && u.shouldComponentUpdate != null && u.shouldComponentUpdate(k, u.__s, D) === !1) {
          n.__v != a.__v && (u.props = k, u.state = u.__s, u.__d = !1), n.__e = a.__e, n.__k = a.__k, n.__k.some(function(w) {
            w && (w.__ = n);
          }), Mt.push.apply(u.__h, u._sb), u._sb = [], u.__h.length && c.push(u);
          break e;
        }
        u.componentWillUpdate != null && u.componentWillUpdate(k, u.__s, D), G && u.componentDidUpdate != null && u.__h.push(function() {
          u.componentDidUpdate(p, v, P);
        });
      }
      if (u.context = D, u.props = k, u.__P = e, u.__e = !1, H = $.__r, q = 0, G) u.state = u.__s, u.__d = !1, H && H(n), h = u.render(u.props, u.state, u.context), Mt.push.apply(u.__h, u._sb), u._sb = [];
      else do
        u.__d = !1, H && H(n), h = u.render(u.props, u.state, u.context), u.state = u.__s;
      while (u.__d && ++q < 25);
      u.state = u.__s, u.getChildContext != null && (r = Ce(Ce({}, r), u.getChildContext())), G && !y && u.getSnapshotBeforeUpdate != null && (P = u.getSnapshotBeforeUpdate(p, v)), Z = h != null && h.type === ot && h.key == null ? Ha(h.props.children) : h, g = Fa(e, wt(Z) ? Z : [Z], n, a, r, s, l, c, g, f, d), u.base = n.__e, n.__u &= -161, u.__h.length && c.push(u), L && (u.__E = u.__ = null);
    } catch (w) {
      if (c.length = b, n.__v = null, f || l != null) {
        if (w.then) {
          for (n.__u |= f ? 160 : 128; g && g.nodeType == 8 && g.nextSibling; ) g = g.nextSibling;
          l != null && (l[l.indexOf(g)] = null), n.__e = g;
        } else if (l != null) for (Y = l.length; Y--; ) wn(l[Y]);
      } else n.__e = a.__e;
      n.__k == null && (n.__k = a.__k || []), w.then || Ma(n), $.__e(w, n, a);
    }
  } else l == null && n.__v == a.__v ? (n.__k = a.__k, n.__e = a.__e) : g = n.__e = Hr(a.__e, n, a, r, s, l, c, f, d);
  return (h = $.diffed) && h(n), 128 & n.__u ? void 0 : g;
}
function Ma(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(Ma));
}
function Va(e, n, a) {
  for (var r = 0; r < a.length; r++) Pn(a[r], a[++r], a[++r]);
  $.__c && $.__c(n, e), e.some(function(s) {
    try {
      e = s.__h, s.__h = [], e.some(function(l) {
        l.call(s);
      });
    } catch (l) {
      $.__e(l, s.__v);
    }
  });
}
function Ha(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : wt(e) ? e.map(Ha) : e.constructor !== void 0 ? null : Ce({}, e);
}
function Hr(e, n, a, r, s, l, c, g, f) {
  var d, h, b, u, y, p, v, P = a.props || Ut, L = n.props, k = n.type;
  if (k == "svg" ? s = "http://www.w3.org/2000/svg" : k == "math" ? s = "http://www.w3.org/1998/Math/MathML" : s || (s = "http://www.w3.org/1999/xhtml"), l != null) {
    for (d = 0; d < l.length; d++) if ((y = l[d]) && "setAttribute" in y == !!k && (k ? y.localName == k : y.nodeType == 3)) {
      e = y, l[d] = null;
      break;
    }
  }
  if (e == null) {
    if (k == null) return document.createTextNode(L);
    e = document.createElementNS(s, k, L.is && L), g && ($.__m && $.__m(n, l), g = !1), l = null;
  }
  if (k == null) P === L || g && e.data == L || (e.data = L);
  else {
    if (l = k == "textarea" && L.defaultValue != null ? null : l && Qt.call(e.childNodes), !g && l != null) for (P = {}, d = 0; d < e.attributes.length; d++) P[(y = e.attributes[d]).name] = y.value;
    for (d in P) y = P[d], d == "dangerouslySetInnerHTML" ? b = y : d == "children" || d in L || d == "value" && "defaultValue" in L || d == "checked" && "defaultChecked" in L || Gt(e, d, null, y, s);
    for (d in L) y = L[d], d == "children" ? u = y : d == "dangerouslySetInnerHTML" ? h = y : d == "value" ? p = y : d == "checked" ? v = y : g && typeof y != "function" || P[d] === y || Gt(e, d, y, P[d], s);
    if (h) g || b && (h.__html == b.__html || h.__html == e.innerHTML) || (e.innerHTML = h.__html), n.__k = [];
    else if (b && (e.innerHTML = ""), Fa(n.type == "template" ? e.content : e, wt(u) ? u : [u], n, a, r, k == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s, l, c, l ? l[0] : a.__k && it(a, 0), g, f), l != null) for (d = l.length; d--; ) wn(l[d]);
    g && k != "textarea" || (d = "value", k == "progress" && p == null ? e.removeAttribute("value") : p != null && (p !== e[d] || k == "progress" && !p || k == "option" && p != P[d]) && Gt(e, d, p, P[d], s), d = "checked", v != null && v != e[d] && Gt(e, d, v, P[d], s));
  }
  return e;
}
function Pn(e, n, a) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && n == null || (e.__u = e(n));
    } else e.current = n;
  } catch (s) {
    $.__e(s, a);
  }
}
function qa(e, n, a) {
  var r, s;
  if ($.unmount && $.unmount(e), (r = e.ref) && (r.current && r.current != e.__e || Pn(r, null, n)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (l) {
      $.__e(l, n);
    }
    r.base = r.__P = r.__n = null;
  }
  if (r = e.__k) for (s = 0; s < r.length; s++) r[s] && qa(r[s], n, a || typeof e.type != "function");
  a || wn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function qr(e, n, a) {
  return this.constructor(e, a);
}
function Qe(e, n, a) {
  var r, s, l, c;
  n == document && (n = document.documentElement), $.__ && $.__(e, n), s = (r = !1) ? null : n.__k, l = [], c = [], En(n, e = n.__k = t(ot, null, [e]), s || Ut, Ut, n.namespaceURI, s ? null : n.firstChild ? Qt.call(n.childNodes) : null, l, s ? s.__e : n.firstChild, r, c), Va(l, e, c), e.props.children = null;
}
Qt = Mt.slice, $ = { __e: function(e, n, a, r) {
  for (var s, l, c; n = n.__; ) if ((s = n.__c) && !s.__) try {
    if ((l = s.constructor) && l.getDerivedStateFromError != null && (s.setState(l.getDerivedStateFromError(e)), c = s.__d), s.componentDidCatch != null && (s.componentDidCatch(e, r || {}), c = s.__d), c) return s.__E = s;
  } catch (g) {
    e = g;
  }
  throw e;
} }, xa = 0, Le.prototype.setState = function(e, n) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = Ce({}, this.state), typeof e == "function" && (e = e(Ce({}, a), this.props)), e && Ce(a, e), e != null && this.__v && (n && this._sb.push(n), ea(this));
}, Le.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), ea(this));
}, Le.prototype.render = ot, He = [], $a = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Wa = function(e, n) {
  return e.__v.__b - n.__v.__b;
}, Vt.__r = 0, sn = Math.random().toString(8), $t = "__d" + sn, yt = "__a" + sn, Da = /(PointerCapture)$|Capture$/i, An = 0, vn = na(!1), _n = na(!0);
var At, Q, ln, aa, qt = 0, Ba = [], z = $, ra = z.__b, oa = z.__r, ia = z.diffed, sa = z.__c, la = z.unmount, ca = z.__;
function Nn(e, n) {
  z.__h && z.__h(Q, e, qt || n), qt = 0;
  var a = Q.__H || (Q.__H = { __: [], __h: [] });
  return e >= a.__.length && a.__.push({}), a.__[e];
}
function A(e) {
  return qt = 1, Br(Xa, e);
}
function Br(e, n, a) {
  var r = Nn(At++, 2);
  if (r.t = e, !r.__c && (r.__ = [a ? a(n) : Xa(void 0, n), function(g) {
    var f = r.__N ? r.__N[0] : r.__[0], d = r.t(f, g);
    f !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = Q, !Q.__f)) {
    var s = function(g, f, d) {
      if (!r.__c.__H) return !0;
      var h = !1, b = r.__c.props !== g;
      if (r.__c.__H.__.some(function(y) {
        if (y.__N) {
          h = !0;
          var p = y.__[0];
          y.__ = y.__N, y.__N = void 0, p !== y.__[0] && (b = !0);
        }
      }), l) {
        var u = l.call(this, g, f, d);
        return h ? u || b : u;
      }
      return !h || b;
    };
    Q.__f = !0;
    var l = Q.shouldComponentUpdate, c = Q.componentWillUpdate;
    Q.componentWillUpdate = function(g, f, d) {
      if (this.__e) {
        var h = l;
        l = void 0, s(g, f, d), l = h;
      }
      c && c.call(this, g, f, d);
    }, Q.shouldComponentUpdate = s;
  }
  return r.__N || r.__;
}
function K(e, n) {
  var a = Nn(At++, 3);
  !z.__s && ja(a.__H, n) && (a.__ = e, a.u = n, Q.__H.__h.push(a));
}
function qe(e) {
  return qt = 5, mt(function() {
    return { current: e };
  }, []);
}
function mt(e, n) {
  var a = Nn(At++, 7);
  return ja(a.__H, n) && (a.__ = e(), a.__H = n, a.__h = e), a.__;
}
function jr() {
  for (var e; e = Ba.shift(); ) {
    var n = e.__H;
    if (e.__P && n) try {
      n.__h.some(Dt), n.__h.some(mn), n.__h = [];
    } catch (a) {
      n.__h = [], z.__e(a, e.__v);
    }
  }
}
z.__b = function(e) {
  Q = null, ra && ra(e);
}, z.__ = function(e, n) {
  e && n.__k && n.__k.__m && (e.__m = n.__k.__m), ca && ca(e, n);
}, z.__r = function(e) {
  oa && oa(e), At = 0;
  var n = (Q = e.__c).__H;
  n && (ln === Q ? (n.__h = [], Q.__h = [], n.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (n.__h.some(Dt), n.__h.some(mn), n.__h = [], At = 0)), ln = Q;
}, z.diffed = function(e) {
  ia && ia(e);
  var n = e.__c;
  n && n.__H && (n.__H.__h.length && (Ba.push(n) !== 1 && aa === z.requestAnimationFrame || ((aa = z.requestAnimationFrame) || Xr)(jr)), n.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), ln = Q = null;
}, z.__c = function(e, n) {
  n.some(function(a) {
    try {
      a.__h.some(Dt), a.__h = a.__h.filter(function(r) {
        return !r.__ || mn(r);
      });
    } catch (r) {
      n.some(function(s) {
        s.__h && (s.__h = []);
      }), n = [], z.__e(r, a.__v);
    }
  }), sa && sa(e, n);
}, z.unmount = function(e) {
  la && la(e);
  var n, a = e.__c;
  a && a.__H && (a.__H.__.some(function(r) {
    try {
      Dt(r);
    } catch (s) {
      n = s;
    }
  }), a.__H = void 0, n && z.__e(n, a.__v));
};
var da = typeof requestAnimationFrame == "function";
function Xr(e) {
  var n, a = function() {
    clearTimeout(r), da && cancelAnimationFrame(n), setTimeout(e);
  }, r = setTimeout(a, 35);
  da && (n = requestAnimationFrame(a));
}
function Dt(e) {
  var n = Q, a = e.__c;
  typeof a == "function" && (e.__c = void 0, a()), Q = n;
}
function mn(e) {
  var n = Q;
  e.__c = e.__(), Q = n;
}
function ja(e, n) {
  return !e || e.length !== n.length || n.some(function(a, r) {
    return a !== e[r];
  });
}
function Xa(e, n) {
  return typeof n == "function" ? n(e) : n;
}
function Kr(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function hn(e, n) {
  for (var a in e) if (a !== "__source" && !(a in n)) return !0;
  for (var r in n) if (r !== "__source" && e[r] !== n[r]) return !0;
  return !1;
}
function ua(e, n) {
  this.props = e, this.context = n;
}
function Qr(e, n) {
  function a(s) {
    var l = this.props.ref;
    return l != s.ref && l && (typeof l == "function" ? l(null) : l.current = null), n ? !n(this.props, s) || l != s.ref : hn(this.props, s);
  }
  function r(s) {
    return this.shouldComponentUpdate = a, t(e, s);
  }
  return r.displayName = "Memo(" + (e.displayName || e.name) + ")", r.__f = r.prototype.isReactComponent = !0, r.type = e, r;
}
(ua.prototype = new Le()).isPureReactComponent = !0, ua.prototype.shouldComponentUpdate = function(e, n) {
  return hn(this.props, e) || hn(this.state, n);
};
var fa = $.__b;
$.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), fa && fa(e);
};
var Jr = $.__e;
$.__e = function(e, n, a, r) {
  if (e.then) {
    for (var s, l = n; l = l.__; ) if ((s = l.__c) && s.__c) return n.__e == null && (n.__e = a.__e, n.__k = a.__k || []), s.__c(e, n);
  }
  Jr(e, n, a, r);
};
var pa = $.unmount;
function Ka(e, n, a) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), e.__c.__H = null), (e = Kr({}, e)).__c != null && (e.__c.__P === a && (e.__c.__P = n), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(r) {
    return Ka(r, n, a);
  })), e;
}
function Qa(e, n, a) {
  return e && a && (e.__v = null, e.__k = e.__k && e.__k.map(function(r) {
    return Qa(r, n, a);
  }), e.__c && e.__c.__P === n && (e.__e && a.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = a)), e;
}
function cn() {
  this.__u = 0, this.o = null, this.__b = null;
}
function Ja(e) {
  var n = e.__ && e.__.__c;
  return n && n.__a && n.__a(e);
}
function xt() {
  this.i = null, this.l = null;
}
$.unmount = function(e) {
  var n = e.__c;
  n && (n.__z = !0), n && n.__R && n.__R(), n && 32 & e.__u && (e.type = null), pa && pa(e);
}, (cn.prototype = new Le()).__c = function(e, n) {
  var a = n.__c, r = this;
  r.o == null && (r.o = []), r.o.push(a);
  var s = Ja(r.__v), l = !1, c = function() {
    l || r.__z || (l = !0, a.__R = null, s ? s(f) : f());
  };
  a.__R = c;
  var g = a.__P;
  a.__P = null;
  var f = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var d = r.state.__a;
        r.__v.__k[0] = Qa(d, d.__c.__P, d.__c.__O);
      }
      var h;
      for (r.setState({ __a: r.__b = null }); h = r.o.pop(); ) h.__P = g, h.forceUpdate();
    }
  };
  r.__u++ || 32 & n.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), e.then(c, c);
}, cn.prototype.componentWillUnmount = function() {
  this.o = [];
}, cn.prototype.render = function(e, n) {
  if (this.__b) {
    if (this.__v.__k) {
      var a = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = Ka(this.__b, a, r.__O = r.__P);
    }
    this.__b = null;
  }
  var s = n.__a && t(ot, null, e.fallback);
  return s && (s.__u &= -33), [t(ot, null, n.__a ? null : e.children), s];
};
var ga = function(e, n, a) {
  if (++a[1] === a[0] && e.l.delete(n), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (a = e.i; a; ) {
    for (; a.length > 3; ) a.pop()();
    if (a[1] < a[0]) break;
    e.i = a = a[2];
  }
};
(xt.prototype = new Le()).__a = function(e) {
  var n = this, a = Ja(n.__v), r = n.l.get(e);
  return r[0]++, function(s) {
    var l = function() {
      n.props.revealOrder ? (r.push(s), ga(n, e, r)) : s();
    };
    a ? a(l) : l();
  };
}, xt.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var n = Ht(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && n.reverse();
  for (var a = n.length; a--; ) this.l.set(n[a], this.i = [1, 0, this.i]);
  return e.children;
}, xt.prototype.componentDidUpdate = xt.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(n, a) {
    ga(e, a, n);
  });
};
var zr = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Yr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Zr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, eo = /[A-Z0-9]/g, to = typeof document < "u", no = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
Le.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty(Le.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(n) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: n });
  } });
});
var va = $.event;
$.event = function(e) {
  return va && (e = va(e)), e.persist = function() {
  }, e.isPropagationStopped = function() {
    return this.cancelBubble;
  }, e.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, e.nativeEvent = e;
};
var ao = { configurable: !0, get: function() {
  return this.class;
} }, _a = $.vnode;
$.vnode = function(e) {
  typeof e.type == "string" && (function(n) {
    var a = n.props, r = n.type, s = {}, l = r.indexOf("-") == -1;
    for (var c in a) {
      var g = a[c];
      if (!(c === "value" && "defaultValue" in a && g == null || to && c === "children" && r === "noscript" || c === "class" || c === "className")) {
        var f = c.toLowerCase();
        c === "defaultValue" && "value" in a && a.value == null ? c = "value" : c === "download" && g === !0 ? g = "" : f === "translate" && g === "no" ? g = !1 : f[0] === "o" && f[1] === "n" ? f === "ondoubleclick" ? c = "ondblclick" : f !== "onchange" || r !== "input" && r !== "textarea" || no(a.type) ? f === "onfocus" ? c = "onfocusin" : f === "onblur" ? c = "onfocusout" : Zr.test(c) && (c = f) : f = c = "oninput" : l && Yr.test(c) ? c = c.replace(eo, "-$&").toLowerCase() : g === null && (g = void 0), f === "oninput" && s[c = f] && (c = "oninputCapture"), s[c] = g;
      }
    }
    r == "select" && (s.multiple && Array.isArray(s.value) && (s.value = Ht(a.children).forEach(function(d) {
      d.props.selected = s.value.indexOf(d.props.value) != -1;
    })), s.defaultValue != null && (s.value = Ht(a.children).forEach(function(d) {
      d.props.selected = s.multiple ? s.defaultValue.indexOf(d.props.value) != -1 : s.defaultValue == d.props.value;
    }))), a.class && !a.className ? (s.class = a.class, Object.defineProperty(s, "className", ao)) : a.className && (s.class = s.className = a.className), n.props = s;
  })(e), e.$$typeof = zr, _a && _a(e);
};
var ma = $.__r;
$.__r = function(e) {
  ma && ma(e), e.__c;
};
var ha = $.diffed;
$.diffed = function(e) {
  ha && ha(e);
  var n = e.props, a = e.__e;
  a != null && e.type === "textarea" && "value" in n && n.value !== a.value && (a.value = n.value == null ? "" : n.value);
};
const kt = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" }
], bn = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "STEERING", "FAILED", "PAUSED", "IGNORED"] }
], ro = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" }
], Jt = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "github_use_desktop", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] }
], oo = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Git/worktree paths. For plain git worktrees, Repo root is the main clone and Worktree root is where issue worktrees are created. Worktrunk root is only used when Worktree tool is wt.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize."
}, za = {
  concurrency_limit: { label: "Max parallel issues", hint: "Maximum number of issues allowed to run agents at the same time. Lower this if your machine gets overloaded." },
  scheduler_interval_seconds: { label: "Scheduler check interval", hint: "How many seconds Forge waits between queue checks." },
  ai_review_max_rounds: { label: "AI review loop limit", hint: "Maximum coder ↔ AI reviewer loops before Forge escalates to you." },
  auto_retry_max: { label: "Automatic retry limit", hint: "Maximum automatic retries for transient git-agent and fixer failures." },
  forge_reuse_pi_sessions: { label: "Reuse Pi conversations", hint: "Reuse one Pi session for the same issue and agent type to preserve agent context." },
  model: { label: "Default agent model", hint: "Model used by every agent unless that agent has an override below." },
  default_model: { label: "Legacy default model", hint: "Older setting name kept for compatibility. Prefer Default agent model." },
  model_planner: { label: "Planner model override", hint: "Model for writing implementation plans. Blank means use the default agent model." },
  model_plan_reviewer: { label: "Plan reviewer model override", hint: "Model for reviewing plans before they reach you. Blank means use the default agent model." },
  model_coder: { label: "Coder model override", hint: "Model for implementing approved plans. Blank means use the default agent model." },
  model_reviewer: { label: "Code reviewer model override", hint: "Model for AI code review. Blank means use the default agent model." },
  model_git_agent: { label: "Git/PR agent model override", hint: "Model for branch stack, commit, push, and PR creation tasks. Blank means use the default agent model." },
  model_fixer: { label: "Fixer model override", hint: "Model for addressing approved PR comments. Blank means use the default agent model." },
  model_split_planner: { label: "Split planner model override", hint: "Model for proposing stacked-PR splits. Blank means use the default agent model." },
  model_splitter: { label: "Splitter model override", hint: "Model for applying approved stacked-PR splits. Blank means use the default agent model." },
  model_rebaser: { label: "Rebaser model override", hint: "Model for carefully resolving rebase conflicts. Blank means use the default agent model." },
  linear_enabled: { label: "Run Linear CLI on backend", hint: "Enable only if the backend machine has an authenticated Linear CLI. Otherwise the desktop companion can handle Linear jobs." },
  linear_team: { label: "Linear team key", hint: "Team prefix for issues to list and enqueue, such as TEAM in TEAM-1234." },
  github_repo: { label: "GitHub repository", hint: "Repository slug in owner/name format, used for PR links, gh commands, comments, and merge status." },
  github_use_desktop: { label: "Run GitHub CLI on desktop", hint: "Use the desktop companion's local gh auth for GitHub PR polling. Leave off to run gh on the backend machine." },
  linear_poll_interval_seconds: { label: "Linear polling interval", hint: "How many seconds to wait between Linear sync/list checks when Linear integration is enabled." },
  worktree_provider: { label: "Worktree tool", hint: "Choose git for normal git worktree add. Choose wt only when Forge should call the Worktrunk CLI." },
  repo_root: { label: "Repo root / main clone", hint: "For Worktree tool = git: path to the real repository clone Forge fetches from and runs git worktree add against. Example: /home/user/repo. Do not use a Worktrunk metadata folder." },
  wt_root: { label: "Worktrunk root", hint: "Only for Worktree tool = wt. Path where the wt CLI should run. Leave blank when using normal git worktrees." },
  worktree_root: { label: "Issue worktrees folder", hint: "For Worktree tool = git: parent folder where Forge creates per-issue worktrees, e.g. /mnt/mac/Users/user/Projects." },
  branch_prefix: { label: "Branch owner prefix", hint: "Prefix added before generated branch names, for example user/TEAM-1234-fix." },
  default_branch: { label: "Default base branch", hint: "Branch Forge fetches and uses as the base for new work." },
  runtime_mode: { label: "Runtime mode", hint: "Optional high-level runtime selector used by desktop/runtime helpers." },
  vm_ssh_target: { label: "Remote command SSH host", hint: "SSH host used for remote workspace commands. Leave blank to run commands locally." },
  host_path_prefix: { label: "Local path prefix", hint: "Local path prefix to translate before SSH execution, such as /Users." },
  vm_path_prefix: { label: "Remote path prefix", hint: "Remote equivalent of the local path prefix, such as /mnt/mac/Users." },
  vm_frontend_staging_backend_command: { label: "Frontend dev command (staging API)", hint: "Command to start the frontend against a staging backend from an issue worktree." },
  vm_frontend_local_backend_command: { label: "Frontend dev command (local API)", hint: "Command to start the frontend against a local backend from an issue worktree." },
  vm_backend_staging_command: { label: "Backend dev command (staging data)", hint: "Command to start backend services configured for staging data." },
  vm_backend_local_command: { label: "Backend dev command (local data)", hint: "Command to start backend services configured for local data." },
  vm_database_command: { label: "Database/dev services command", hint: "Optional command for starting local database or support services." },
  vm_command: { label: "Custom runtime command", hint: "Optional fallback command used by runtime launch helpers." },
  terminal_command: { label: "Terminal command", hint: "Optional shell command used when opening an issue terminal." },
  project_prompt_overlay: { label: "Project-specific agent instructions", hint: "Extra repo rules appended to all agents, such as validation commands, package manager, or team conventions." },
  dashboard_port: { label: "Dashboard port", hint: "Port for the Forge dashboard HTTP server." },
  backend: { label: "Backend name", hint: "Optional label for the selected backend environment." },
  backend_mode: { label: "Backend mode", hint: "Optional mode label shown in the dashboard shell." },
  api_base_url: { label: "API base URL", hint: "Optional API origin override for the dashboard frontend." }
}, ba = {
  model: "anthropic-vertex/sonnet-4-6",
  linear_team: "TEAM",
  github_repo: "owner/repo",
  worktree_provider: "git",
  repo_root: "/path/to/repo",
  wt_root: "/path/to/worktrunk-root",
  worktree_root: "~/Projects/worktrees",
  branch_prefix: "user",
  default_branch: "main",
  vm_ssh_target: "my-vm",
  host_path_prefix: "/Users",
  vm_path_prefix: "/mnt/mac/Users",
  dashboard_port: "3142"
}, dn = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"], Ya = {
  planner: "model_planner",
  "plan-reviewer": "model_plan_reviewer",
  coder: "model_coder",
  reviewer: "model_reviewer",
  "git-agent": "model_git_agent",
  fixer: "model_fixer",
  "split-planner": "model_split_planner",
  splitter: "model_splitter",
  rebaser: "model_rebaser",
  reflector: "model_reflector"
}, io = ["model", "default_model", ...Object.values(Ya)], Rn = /* @__PURE__ */ new Set([...Jt.flatMap((e) => e.keys), ...io]), so = new Set(Jt.flatMap((e) => e.keys).filter((e) => Kt(e) === "number")), lo = new Set(Jt.flatMap((e) => e.keys).filter((e) => Kt(e) === "checkbox")), co = /* @__PURE__ */ new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]), uo = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" }
], fo = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" }
], po = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" }
], go = {
  PENDING: "SETTING_UP",
  SETTING_UP: "PLANNING",
  PLANNING: "AI_PLAN_REVIEWING",
  AI_PLAN_REVIEWING: "AWAITING_PLAN_APPROVAL",
  AWAITING_PLAN_APPROVAL: "WORKING",
  WORKING: "AI_REVIEWING",
  AI_REVIEWING: "AWAITING_CODE_REVIEW",
  AWAITING_CODE_REVIEW: "CREATING_PR",
  SPLIT_PLANNING: "AWAITING_SPLIT_APPROVAL",
  AWAITING_SPLIT_APPROVAL: "SPLITTING",
  SPLITTING: "CREATING_PR",
  CREATING_PR: "WATCHING_PR",
  WATCHING_PR: "IN_MERGE_QUEUE",
  IN_MERGE_QUEUE: "DONE",
  AWAITING_FIX_APPROVAL: "FIXING",
  FIXING: "AWAITING_FIX_REVIEW",
  AWAITING_FIX_REVIEW: "PUSHING",
  PUSHING: "WATCHING_PR",
  REBASING: "WATCHING_PR",
  FAILED: "WORKING",
  PAUSED: "WORKING",
  IGNORED: "WORKING"
};
function vo(e) {
  return go[e ?? ""] ?? "WORKING";
}
const _o = [
  { state: "PLANNING", label: "↩ Re-plan", hint: "Run the planner agent again" },
  { state: "WORKING", label: "⚡ Code", hint: "Jump straight to the coder agent" },
  { state: "AI_REVIEWING", label: "🤖 AI Review", hint: "Run the AI reviewer on current code" },
  { state: "CREATING_PR", label: "📤 Create PR", hint: "Skip to PR creation" },
  { state: "FIXING", label: "🔧 Fix", hint: "Jump to the fixer agent" },
  { state: "AWAITING_FIX_REVIEW", label: "🔍 Fix review", hint: "Review the fix before pushing" },
  { state: "WATCHING_PR", label: "👁 Watch PR", hint: "Monitor open PRs for CI / reviews" },
  { state: "REBASING", label: "Rebase", hint: "Resolve rebase conflicts and push carefully" },
  { state: "SPLIT_PLANNING", label: "✂️ Plan Split", hint: "Ask an agent to propose a stacked PR split" },
  { state: "SPLITTING", label: "✂️ Split Stack", hint: "Execute the approved stacked PR split", risky: !0 },
  { state: "IN_MERGE_QUEUE", label: "🔀 Merge Queue", hint: "Mark PRs as entered into merge queue", risky: !0 },
  { state: "DONE", label: "✅ Mark Done", hint: "Archive this issue as complete", risky: !0 },
  { state: "RETURN_TO_LINEAR", label: "↩ Return to Linear", hint: "Fully reset and remove from Forge tracking; it will appear in the Linear list again", risky: !0, destructive: !0 }
], Xe = {
  PENDING: 10,
  SETTING_UP: 20,
  PLANNING: 30,
  AI_PLAN_REVIEWING: 40,
  AWAITING_PLAN_APPROVAL: 50,
  WORKING: 60,
  AI_REVIEWING: 70,
  AWAITING_CODE_REVIEW: 80,
  SPLIT_PLANNING: 90,
  AWAITING_SPLIT_APPROVAL: 100,
  SPLITTING: 110,
  CREATING_PR: 120,
  WATCHING_PR: 130,
  IN_MERGE_QUEUE: 140,
  AWAITING_FIX_APPROVAL: 150,
  FIXING: 160,
  AWAITING_FIX_REVIEW: 165,
  PUSHING: 170,
  REBASING: 175,
  DONE: 180,
  STEERING: 190,
  FAILED: 200,
  PAUSED: 210,
  IGNORED: 220
}, mo = {
  PENDING: "available",
  SETTING_UP: "active",
  PLANNING: "active",
  AI_PLAN_REVIEWING: "active",
  SPLIT_PLANNING: "active",
  SPLITTING: "active",
  WORKING: "active",
  AI_REVIEWING: "active",
  FIXING: "active",
  AWAITING_FIX_REVIEW: "awaiting",
  PUSHING: "active",
  REBASING: "active",
  CREATING_PR: "active",
  WATCHING_PR: "active",
  IN_MERGE_QUEUE: "active",
  DONE: "active",
  AWAITING_PLAN_APPROVAL: "awaiting",
  AWAITING_SPLIT_APPROVAL: "awaiting",
  AWAITING_CODE_REVIEW: "awaiting",
  AWAITING_FIX_APPROVAL: "awaiting",
  STEERING: "awaiting",
  PAUSED: "awaiting",
  FAILED: "awaiting",
  IGNORED: "awaiting"
}, ya = {
  scheduler: "unknown",
  activeCount: 0,
  awaitingDecisionsCount: 0,
  failedCount: 0,
  doneThisWeekCount: 0,
  learningSuggestionsCount: 0,
  archiveCount: 0,
  model: "—",
  backend: "local",
  runningAgentsCount: 0,
  concurrencyLimit: 2
};
function ho(e) {
  return e.state !== "DONE";
}
const bo = [
  "PENDING",
  "SETTING_UP",
  "PLANNING",
  "AI_PLAN_REVIEWING",
  "AWAITING_PLAN_APPROVAL",
  "SPLIT_PLANNING",
  "AWAITING_SPLIT_APPROVAL",
  "SPLITTING",
  "WORKING",
  "AI_REVIEWING",
  "AWAITING_CODE_REVIEW",
  "CREATING_PR",
  "WATCHING_PR",
  "IN_MERGE_QUEUE",
  "AWAITING_FIX_APPROVAL",
  "FIXING",
  "AWAITING_FIX_REVIEW",
  "PUSHING",
  "REBASING",
  "STEERING",
  "DONE",
  "FAILED",
  "PAUSED",
  "IGNORED"
];
function Je() {
  const e = window.location.search.toLowerCase(), n = window.location.hash.toLowerCase(), a = e.includes("mockstates=1") || e.includes("mock=states") || n.includes("mockstates=1") || n.includes("mock=states") || n.includes("mock-states");
  return a && window.localStorage.setItem("forge-v3-mock-states", "1"), a || window.localStorage.getItem("forge-v3-mock-states") === "1";
}
function yo() {
  window.localStorage.setItem("forge-v3-mock-states", "1"), window.location.reload();
}
function ko() {
  window.localStorage.removeItem("forge-v3-mock-states");
  const e = new URL(window.location.href);
  e.searchParams.delete("mockStates"), e.searchParams.get("mock") === "states" && e.searchParams.delete("mock"), window.location.href = e.toString();
}
function Be(e) {
  return new Date(Date.now() - e * 6e4).toISOString();
}
const Za = "forge.v3.askConversations", er = 40;
function tr() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Za) || "{}");
    return e && typeof e == "object" && !Array.isArray(e) ? e : {};
  } catch {
    return {};
  }
}
function Io(e) {
  return tr()[String(e)] ?? { messages: [], input: "" };
}
function ka(e, n) {
  try {
    const a = tr(), r = (n.messages ?? []).filter((s) => (s.role === "user" || s.role === "assistant") && typeof s.text == "string").slice(-er);
    a[String(e)] = { messages: r, input: n.input ?? "" }, window.localStorage.setItem(Za, JSON.stringify(a));
  } catch {
  }
}
function nr(e) {
  return e.state === "AWAITING_PLAN_APPROVAL" ? { id: 9101, issue_id: e.id, type: "PLAN_REVIEW", issueTitle: e.title } : e.state === "AWAITING_CODE_REVIEW" ? { id: 9102, issue_id: e.id, type: "CODE_REVIEW", issueTitle: e.title } : e.state === "AWAITING_FIX_APPROVAL" ? { id: 9103, issue_id: e.id, type: "FIX_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) } : e.state === "AWAITING_FIX_REVIEW" ? { id: 9104, issue_id: e.id, type: "FIX_REVIEW", issueTitle: e.title, artifact_ref: "fix-review" } : e.state === "AWAITING_SPLIT_APPROVAL" ? { id: 9104, issue_id: e.id, type: "SPLIT_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) } : null;
}
function yn() {
  return bo.map((e, n) => ({
    id: 9e3 + n,
    linear_id: `MOCK-${n + 1}`,
    title: `${Ze({ state: e })} dashboard fixture`,
    state: e,
    priority: n % 4 + 1,
    created_at: Be(240 + n * 11),
    updated_at: Be(3 + n * 7),
    branch: `user/mock-${e.toLowerCase().replaceAll("_", "-")}`,
    wt_path: `/tmp/forge/mock/${e.toLowerCase()}`,
    project_file_path: `/tmp/forge/mock/${e.toLowerCase()}/plan.md`,
    prStack: ["CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(e) ? [{ pr_number: e === "CREATING_PR" ? null : 4521 + n, branch: `user/mock-${n + 1}`, status: e === "IN_MERGE_QUEUE" ? "merged" : "open" }] : []
  }));
}
function Ia(e) {
  return `# ${e.linear_id} ${e.title}

## Goal
Exercise the v3 detail panel while this issue is in **${Ze(e)}**.

## Tasks
- [x] Gather context
- [x] Draft plan
- [ ] Implement state-specific UI polish
- [ ] Validate actions and banners

## Review notes
Use this mock fixture to tidy copy, action availability, colors, and spacing before testing real Forge issues.`;
}
function Ao(e) {
  var r, s;
  const n = yn().find((l) => l.id === e) ?? yn()[0], a = nr(n);
  return {
    issue: n,
    plan: Ia(n),
    planContent: Ia(n),
    decisions: a ? [a] : [],
    agentRuns: [
      { id: n.id * 10 + 1, agent_type: "planner", started_at: Be(38), exit_code: 0 },
      { id: n.id * 10 + 2, agent_type: (r = n.state) != null && r.toLowerCase().includes("review") ? "reviewer" : "coder", started_at: Be(9), exit_code: _e(n) ? null : 0 }
    ],
    activityLog: [
      { id: n.id * 100 + 1, type: "agent_completed", actor: "planner", message: "Planner wrote the implementation plan", created_at: Be(38) },
      { id: n.id * 100 + 2, type: n.state === "FAILED" ? "agent_failed" : "steered", actor: n.state === "FAILED" ? "coder" : "user", message: n.state === "FAILED" ? "Coder failed while applying changes" : "Steering instructions added from dashboard", created_at: Be(8) }
    ],
    failureContext: n.state === "FAILED" ? { run: { id: n.id * 10 + 2, agent_type: "coder", started_at: Be(9), exit_code: 1 }, logTail: `[FATAL] Mock failure context
TypeError: Cannot read properties of undefined` } : null,
    prStack: (s = n.prStack) == null ? void 0 : s.map((l) => {
      var c;
      return { pr_number: l.pr_number, branch: l.branch ?? void 0, status: l.status ?? void 0, reviewDecision: l.pr_number ? "APPROVED" : null, mergeable: "MERGEABLE", checksTotal: l.pr_number ? 8 : 0, checksFailed: 0, checksPending: n.state === "WATCHING_PR" ? 1 : 0, liveState: ((c = l.status) == null ? void 0 : c.toUpperCase()) ?? "OPEN", url: l.pr_number ? `https://github.com/example/repo/pull/${l.pr_number}` : null };
    }),
    vmConnectCommand: `ssh my-vm # ${n.linear_id}`
  };
}
function wo() {
  const e = yn(), n = e.flatMap((a) => {
    const r = nr(a);
    return r ? [r] : [];
  });
  return {
    issues: e,
    decisions: n,
    runningAgents: e.filter(_e).map((a) => ({ issueId: a.id, state: a.state })),
    scheduler: { running: !0 },
    doneThisWeek: [{ id: 9999 }],
    learningSuggestionsCount: 0
  };
}
function ze(e) {
  return mo[e.state ?? ""] ?? "building";
}
function Eo(e) {
  const n = e.state ?? "";
  if (n === "PENDING") return 2;
  if (["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING"].includes(n)) return 10;
  if (["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(n)) return 20;
  if (["WORKING", "SPLITTING"].includes(n)) return 42;
  if (n === "AI_REVIEWING") return 55;
  if (n === "AWAITING_CODE_REVIEW") return 62;
  if (n === "AWAITING_FIX_APPROVAL") return 73;
  if (n === "AWAITING_FIX_REVIEW") return 78;
  if (["WATCHING_PR", "FIXING", "PUSHING", "REBASING"].includes(n)) return 84;
  if (n === "IN_MERGE_QUEUE") return 95;
  if (n === "DONE") return 100;
  if (n === "FAILED") return 38;
  if (n === "PAUSED") return 30;
  const a = ze(e);
  return { available: 2, active: 55, awaiting: 70 }[a];
}
function Ot(e) {
  if (!e.updated_at) return !1;
  const n = Ye(e.updated_at);
  return Number.isFinite(n) && Date.now() - n > 1440 * 60 * 1e3;
}
function Ye(e) {
  return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(e) && !e.endsWith("Z") && !e.includes("+") ? (/* @__PURE__ */ new Date(e.replace(" ", "T") + "Z")).getTime() : new Date(e).getTime();
}
function be(e) {
  if (!e) return "recent";
  const n = Ye(e);
  if (!Number.isFinite(n)) return "recent";
  const a = Math.max(0, Math.floor((Date.now() - n) / 1e3));
  if (a < 60) return `${Math.max(1, a)}s`;
  const r = Math.floor(a / 60);
  if (r < 60) return `${r}m`;
  const s = Math.floor(r / 60);
  return s < 24 ? `${s}h` : `${Math.floor(s / 24)}d`;
}
function un(e) {
  if (!e) return "date unknown";
  const n = Ye(e);
  return Number.isFinite(n) ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(n)) : e;
}
function Sn(e) {
  return e === 1 ? "▰▰▰" : e === 2 ? "▰▰░" : e === 3 ? "▰░░" : e === 4 ? "░░░" : "□□□";
}
function Tn(e) {
  return e === 1 ? "urgent" : e === 2 ? "high" : e === 3 ? "medium" : e === 4 ? "low" : "none";
}
function Cn(e) {
  return e === 1 ? "priority-urgent" : e === 2 ? "priority-high" : "priority-normal";
}
function Ze(e) {
  const n = e.state ?? "UNKNOWN";
  return {
    PENDING: "pending",
    SETTING_UP: "setting up",
    PLANNING: "planning",
    AI_PLAN_REVIEWING: "AI plan review",
    AWAITING_PLAN_APPROVAL: "awaiting your plan review",
    WORKING: "coding",
    AI_REVIEWING: "ai code review",
    AWAITING_CODE_REVIEW: "awaiting code review",
    CREATING_PR: "creating pr",
    WATCHING_PR: "watching pr",
    IN_MERGE_QUEUE: "in merge queue",
    SPLIT_PLANNING: "split planning",
    AWAITING_SPLIT_APPROVAL: "awaiting split approval",
    SPLITTING: "splitting",
    AWAITING_FIX_APPROVAL: "awaiting fix approval",
    FIXING: "fixing",
    AWAITING_FIX_REVIEW: "awaiting fix review",
    PUSHING: "pushing",
    REBASING: "rebasing",
    FAILED: "failed",
    PAUSED: "paused",
    IGNORED: "ignored",
    DONE: "done"
  }[n] ?? n.toLowerCase().replaceAll("_", " ");
}
function Po(e) {
  const n = e.state ?? "";
  return n === "AWAITING_CODE_REVIEW" ? "forge-v3-state-pill pill-code" : n === "WATCHING_PR" ? "forge-v3-state-pill pill-watching" : n === "IN_MERGE_QUEUE" ? "forge-v3-state-pill pill-merge" : n === "FAILED" ? "forge-v3-state-pill pill-failed" : `forge-v3-state-pill pill-${ze(e)}`;
}
function No(e) {
  return (e.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}
function _e(e) {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(e.state ?? "");
}
function Bt(e) {
  return !!(e.pr_approved_at || (e.prStack ?? []).some((n) => String(n.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}
function Ro(e) {
  return String(e.status ?? "").toLowerCase() === "merged" || String(e.liveState ?? "").toUpperCase() === "MERGED";
}
function So(e) {
  const n = (e.prStack ?? []).filter((a) => a.pr_number);
  return e.state !== "DONE" && n.length > 0 && n.every(Ro);
}
function To(e) {
  const n = [];
  return e.externally_managed && n.push({ className: "forge-v3-external-badge", label: "👤 External" }), e.awaiting_review && n.push({ className: "forge-v3-awaiting-review-badge", label: "👀 Awaiting review" }), _e(e) && n.push({ className: "forge-v3-live-badge", label: "Live" }), e.updated_at && n.push({ className: `forge-v3-elapsed-badge${Ot(e) ? " long" : ""}`, label: Ot(e) ? "24h+" : be(e.updated_at) }), Ot(e) && n.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" }), n;
}
function ar(e) {
  const n = e.state ?? "";
  return ["PLANNING", "SETTING_UP"].includes(n) ? [t("strong", null, "Planner"), " reading ", t("code", null, "project context"), " — exploring component structure and requirements…"] : n === "AI_PLAN_REVIEWING" ? [t("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"] : n === "AWAITING_PLAN_APPROVAL" ? ["Plan ready for you — ", t("strong", null, "review tasks"), " and AI reviewer notes before approving."] : n === "WORKING" ? [t("strong", null, "Coder"), " writing changes — implementing planned code updates…"] : n === "AI_REVIEWING" ? [t("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"] : n === "AWAITING_CODE_REVIEW" ? ["AI review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."] : n === "REBASING" ? [t("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"] : Bt(e) ? ["GitHub review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."] : n === "FAILED" ? [t("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."] : n === "PAUSED" ? ["Paused by user. Was in ", t("strong", null, "active"), " state."] : e.updated_at ? "Updated recently" : "Queued in Forge";
}
function Aa(e) {
  var a;
  const n = be(e.updated_at ?? e.created_at);
  return _e(e) ? e.state === "AI_REVIEWING" ? `In review ${n}` : `Started ${n} ago` : (a = e.state) != null && a.startsWith("AWAITING") ? `Waiting ${n}` : e.state === "FAILED" ? `Failed ${n} ago` : e.state === "PAUSED" ? `Paused ${n} ago` : ze(e) === "available" ? `Added ${n} ago` : `Updated ${n} ago`;
}
function rr(e) {
  var a;
  const n = ((a = e[0]) == null ? void 0 : a.type) ?? "";
  return n ? n.includes("PLAN") ? "plan" : n.includes("CODE") ? "code" : n === "FIX_REVIEW" ? "fix-review" : n.includes("FIX") ? "fix" : n.includes("SPLIT") ? "split" : "generic" : null;
}
function Ft(e) {
  if (!(e != null && e.artifact_ref)) return {};
  try {
    const n = JSON.parse(e.artifact_ref);
    return n && typeof n == "object" ? n : {};
  } catch {
    return { summary: e.artifact_ref };
  }
}
function wa(e) {
  return !!(e && /(?:^|[\\/])(?:plan|handoff|summary)\.md$/i.test(e.trim()));
}
function Co(e, n) {
  var g;
  const a = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), r = new RegExp(`^(#{1,6})\\s+${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), s = a.findIndex((f) => r.test(f.trim()));
  if (s < 0) return "";
  const l = ((g = a[s].match(/^\s*(#{1,6})/)) == null ? void 0 : g[1].length) ?? 1;
  let c = a.length;
  for (let f = s + 1; f < a.length; f += 1) {
    const d = a[f].match(/^\s*(#{1,6})\s+/);
    if (d && d[1].length <= l) {
      c = f;
      break;
    }
  }
  return a.slice(s, c).join(`
`).trim();
}
function Lo(e) {
  var r, s, l, c, g, f, d, h;
  if (!e.trim()) return [];
  const n = [], a = e.split(/\n(?=###\s+)/g).filter((b) => /^###\s+/.test(b.trim()));
  for (const b of a) {
    const u = (s = (r = b.match(/^###\s+(?:Part\s+\d+\s+[—-]\s+)?(.+)$/m)) == null ? void 0 : r[1]) == null ? void 0 : s.trim(), y = (c = (l = b.match(/^[-*]\s+\*\*Branch:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : l[1]) == null ? void 0 : c.trim(), p = (f = (g = b.match(/^[-*]\s+\*\*Base:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : g[1]) == null ? void 0 : f.trim(), v = (h = (d = b.match(/^[-*]\s+\*\*Commits?:\*\*\s+(.+)$/m)) == null ? void 0 : d[1]) == null ? void 0 : h.replace(/`/g, "").trim();
    (u || y) && n.push({ title: u, branch: y, summary: [p ? `Base: ${p}` : null, v ? `Commits: ${v}` : null].filter(Boolean).join(" · ") || y });
  }
  return n;
}
function Go(e, n, a) {
  const r = wa(n.summary) ? void 0 : n.summary, s = wa(n.plan) ? void 0 : n.plan, l = Co(ir(a), "Split Plan"), c = s ?? l, g = n.proposedStack ?? n.stack ?? Lo(c);
  return {
    summary: r ?? (c ? "Review the proposed PR stack split from the split planner." : "Review the proposed PR stack split."),
    markdown: c,
    stack: g
  };
}
function vt(e, n) {
  return String(e.id ?? `${e.path ?? "comment"}-${e.line ?? n}-${n}`);
}
function or(e) {
  const n = e.pr_number ?? e.prNumber, a = typeof n == "number" ? n : Number(String(n ?? "").replace(/^#/, ""));
  return Number.isFinite(a) && a > 0 ? a : null;
}
function xo(e, n) {
  const a = or(e), r = a ? n.find((c) => Number(c.pr_number) === a) : null, s = r != null && r.position ? `PR ${r.position}` : "PR", l = (r == null ? void 0 : r.gt_branch) ?? (r == null ? void 0 : r.branch);
  return [a ? `${s} #${a}` : s, l].filter(Boolean).join(" · ");
}
function $o(e) {
  return e.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
}
function Wo(e) {
  return (e ?? "No comment body").replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "").replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (n, a, r) => `<!-- ${a} START -->
${r.trim()}
<!-- ${a} END -->`).replace(/<details\b[\s\S]*?<\/details>/gi, "").replace(/<sup\b[\s\S]*?<\/sup>/gi, "").replace(/<div\b[\s\S]*?<\/div>/gi, "").trim() || "No comment body";
}
function Do(e) {
  const n = Wo(e), a = /<!--\s*([A-Z0-9_ -]+?)\s+(START|END)\s*-->/gi, r = [...n.matchAll(a)];
  if (!r.length) return t("div", { class: "forge-v3-fix-comment-body forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(n) } });
  const s = [];
  let l = null, c = 0;
  const g = (f) => {
    const d = n.slice(c, f).trim();
    d && s.push({ label: l, text: d });
  };
  for (const f of r)
    g(f.index ?? c), c = (f.index ?? c) + f[0].length, l = f[2].toUpperCase() === "START" ? $o(f[1]) : null;
  return g(n.length), t(
    "div",
    { class: "forge-v3-fix-comment-body" },
    s.length ? s.map((f, d) => t(
      "section",
      { class: "forge-v3-fix-comment-section", key: `${f.label ?? "intro"}-${d}` },
      f.label ? t("div", { class: "forge-v3-fix-comment-section-label" }, f.label) : null,
      t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(f.text) } })
    )) : t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(n.replace(a, "").trim() || "No comment body") } })
  );
}
function Oo(e) {
  return e === "AWAITING_PLAN_APPROVAL" ? "PLAN_REVIEW" : e === "AWAITING_CODE_REVIEW" ? "CODE_REVIEW" : e === "AWAITING_FIX_APPROVAL" ? "FIX_APPROVAL" : e === "AWAITING_FIX_REVIEW" ? "FIX_REVIEW" : e === "AWAITING_SPLIT_APPROVAL" ? "SPLIT_APPROVAL" : null;
}
function Fo(e, n) {
  const a = e.state ?? "", r = rr(n);
  return r === "plan" || a === "AWAITING_PLAN_APPROVAL" ? { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: !1 } : r === "code" || a === "AWAITING_CODE_REVIEW" ? { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: !1 } : r === "fix" || a === "AWAITING_FIX_APPROVAL" ? { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: !1 } : a === "AWAITING_FIX_REVIEW" ? { icon: "🔍", tone: "awaiting", title: "Fix ready for review", text: "The fixer addressed review comments. Review the diff and approve to push, or reject to send back for more changes.", live: !1 } : a === "AWAITING_SPLIT_APPROVAL" ? { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: !1 } : a === "REBASING" ? { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: !0 } : Bt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(a) ? { icon: "✓", tone: "running", title: "PR approved", text: e.pr_approved_at ? `GitHub review approved ${be(e.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: !1 } : _e(e) ? { icon: "spinner", tone: "running", title: `${Ze(e)} agent running`, text: `Active for ${be(e.updated_at)} — Forge is working on this issue.`, live: !0 } : a === "FAILED" ? { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: !1 } : { icon: dr(ze(e)), tone: ze(e), title: Ze(e), text: e.updated_at ? `Updated ${be(e.updated_at)} ago` : "Waiting for activity", live: !1 };
}
const Ea = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];
function se(e, n, a = `${n}s`) {
  return `${e} ${e === 1 ? n : a}`;
}
function Ve(e, n) {
  return (e ?? []).filter((a) => a.agent_type === n).length;
}
function Uo(e) {
  return (e ?? []).filter((n) => n.type === "FIX_APPROVAL").reduce((n, a) => {
    var r;
    return n + (((r = Ft(a).comments) == null ? void 0 : r.length) ?? 0);
  }, 0);
}
function Mo(e, n) {
  return (e ?? []).filter((a) => a.type === n).length;
}
function Vo(e, n) {
  var u, y, p;
  const a = (n == null ? void 0 : n.agentRuns) ?? [], r = (n == null ? void 0 : n.decisions) ?? [], s = (n == null ? void 0 : n.prStack) ?? ((u = n == null ? void 0 : n.issue) == null ? void 0 : u.prStack) ?? [], l = Ve(a, "planner"), c = Ve(a, "plan-reviewer"), g = Ve(a, "coder"), f = Ve(a, "reviewer"), d = Ve(a, "fixer"), h = Ve(a, "watcher"), b = Uo(r);
  return e === "Setup" ? { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [se(Ve(a, "setup"), "setup run"), (y = n == null ? void 0 : n.issue) != null && y.wt_path ? "Worktree ready" : "Worktree not recorded yet"] } : e === "Plan" ? { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [se(l, "planner pass", "planner passes"), se(c, "AI plan review"), se(Math.max(0, Math.min(l, c) - 1), "planner/reviewer loop")] } : e === "Code" ? { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [se(g, "coder pass", "coder passes"), se(Math.max(0, g - 1), "rework loop")] } : e === "Review" ? { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [se(f, "AI code review"), se(Mo(r, "CODE_REVIEW"), "human review gate"), se(Math.max(0, Math.min(g, f) - 1), "code/review loop")] } : e === "PR" ? { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [se(Ve(a, "git-agent"), "git-agent run"), se(s.length, "PR"), se(b, "PR comment/issue")] } : e === "Watch" ? { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [se(h, "watch poll"), se(d, "fix loop"), se(b, "comment/issue routed to fixer")] } : { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [((p = n == null ? void 0 : n.issue) == null ? void 0 : p.state) === "DONE" ? "Completed" : "Not completed yet"] };
}
function Ho(e) {
  return ["PENDING", "SETTING_UP"].includes(e ?? "") ? 0 : ["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "") ? 1 : ["WORKING", "SPLITTING"].includes(e ?? "") ? 2 : ["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(e ?? "") ? 3 : ["CREATING_PR"].includes(e ?? "") ? 4 : ["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(e ?? "") ? 5 : e === "DONE" ? 6 : 0;
}
function qo(e) {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "");
}
function ir(e) {
  return (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan) ?? "No plan available.";
}
function Bo(e) {
  const n = (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan);
  return !!(n != null && n.trim());
}
function sr(e) {
  return (e == null ? void 0 : e.handoffContent) ?? "";
}
function jo(e) {
  return !!sr(e).trim();
}
function Xo(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(e ?? "");
}
function Ko(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(e ?? "");
}
function Qo(e) {
  return e ? ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes(e.state ?? "") && !_e(e) && !e.locked_at && !e.agent_pid : !1;
}
function Jo(e) {
  return e.startsWith("+") ? "add" : e.startsWith("-") ? "del" : e.startsWith("@@") ? "hunk" : e.startsWith("diff --git") || e.startsWith("index ") || e.startsWith("---") || e.startsWith("+++") ? "meta" : "ctx";
}
function zo(e) {
  return e.startsWith("+") ? "+" : e.startsWith("-") ? "−" : "";
}
function Pa(e) {
  return e.split(/[\\/]/).filter(Boolean).pop() || e;
}
function It(e) {
  const n = e ?? "agent";
  return {
    planner: "Planner",
    "plan-reviewer": "Plan reviewer",
    coder: "Coder",
    reviewer: "AI reviewer",
    "git-agent": "Git agent",
    fixer: "Fixer",
    watcher: "Watcher",
    setup: "Setup"
  }[n] ?? n.replaceAll("-", " ");
}
function Yo(e, n) {
  return e.exit_code === null ? `${It(e.agent_type)} is active — streaming progress.` : e.exit_code && e.exit_code !== 0 ? `${It(e.agent_type)} failed — inspect logs before retrying.` : e.agent_type === "planner" ? "Plan created — tasks, risks, and PR stack estimated." : e.agent_type === "plan-reviewer" ? "Plan approved — scope and sequencing look ready." : e.agent_type === "coder" ? "Completed implementation pass and updated project notes." : e.agent_type === "reviewer" ? "Review completed — security, tests, and conventions checked." : e.agent_type === "git-agent" ? "Prepared branch stack and synchronized git state." : e.agent_type === "fixer" ? "Applied requested PR comment fixes." : e.agent_type === "watcher" ? "Checked PR status, reviews, and merge readiness." : `${It(e.agent_type)} completed.`;
}
function Zo(e, n) {
  const a = `${e ?? ""} ${n ?? ""}`.toLowerCase();
  return a.includes("fail") || a.includes("error") ? "err" : a.includes("approved") || a.includes("completed") || a.includes("done") ? "ok" : a.includes("user") || a.includes("steer") || a.includes("paused") || a.includes("ignored") ? "me" : a.includes("started") || a.includes("live") ? "live" : "ag";
}
function ei(e) {
  var n;
  return e.message ?? ((n = e.type) == null ? void 0 : n.replaceAll("_", " ")) ?? "Activity recorded";
}
function ht(e) {
  return e ? `/api/runs/${e}/log` : null;
}
function ti(e, n) {
  var g, f;
  const a = [...(e == null ? void 0 : e.agentRuns) ?? []].sort((d, h) => re(h.started_at) - re(d.started_at)), r = [...(e == null ? void 0 : e.activityLog) ?? []].sort((d, h) => re(h.created_at) - re(d.created_at)), s = _e(n), l = new Map(a.map((d) => [d.agent_type, d])), c = r.length ? r.map((d) => {
    var b;
    const h = l.get(d.actor ?? "") ?? ((b = d.type) != null && b.includes("agent") ? a.find((u) => u.agent_type === d.actor) : void 0);
    return { id: String(d.id ?? `${d.type}-${d.created_at}`), actor: d.actor ?? "Forge", time: d.created_at ? `${be(d.created_at)} ago` : "recent", tone: Zo(d.type, d.actor), text: ei(d), snippet: d.metadata ?? null, logUrl: ht(h == null ? void 0 : h.id) };
  }) : [
    ...s ? [{ id: "live", actor: It(((g = a[0]) == null ? void 0 : g.agent_type) ?? "agent"), time: "now", tone: "live", text: ar(n), snippet: `// live agent output
Reading files, updating the project plan, and streaming progress…`, logUrl: ht((f = a[0]) == null ? void 0 : f.id) }] : [],
    ...a.map((d) => {
      var h;
      return { id: String(d.id ?? `${d.agent_type}-${d.started_at}`), actor: It(d.agent_type), time: d.started_at ? `${be(d.started_at)} ago` : "recent", tone: d.exit_code === null ? "live" : d.exit_code && d.exit_code !== 0 ? "err" : (h = d.agent_type) != null && h.includes("review") ? "ok" : "ag", text: Yo(d), snippet: null, logUrl: ht(d.id) };
    })
  ];
  return t(
    "div",
    { class: "forge-v3-ds" },
    t(
      "div",
      { class: "forge-v3-activity-head" },
      t("div", { class: "forge-v3-ds-label" }, r.length ? "Activity log" : "Activity"),
      s ? t("span", { class: "forge-v3-live-badge forge-v3-af-live" }, "Live") : null
    ),
    e != null && e.failureContext ? t(
      "section",
      { class: "forge-v3-failure-context" },
      t("div", null, t("strong", null, "Failure context"), e.failureContext.run ? t("a", { href: ht(e.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Open run log ↗") : null),
      t("pre", null, e.failureContext.logTail ?? "No failure details available.")
    ) : null,
    t(
      "div",
      { class: "forge-v3-af-feed" },
      c.length ? c.map((d, h) => t(
        "div",
        { key: d.id, class: "forge-v3-af-item" },
        t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${d.tone}` }), h < c.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
        t(
          "div",
          { class: "forge-v3-af-content" },
          t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${d.tone === "me" ? "me" : "ag"}` }, d.actor), d.logUrl ? t("a", { class: "forge-v3-run-log-link", href: d.logUrl, target: "_blank", rel: "noreferrer" }, "log ↗") : null, t("span", { class: "forge-v3-af-time" }, d.time)),
          t("div", { class: `forge-v3-af-text ${d.tone}` }, d.text),
          d.snippet ? t("pre", { class: "forge-v3-af-snippet" }, d.snippet) : null
        )
      )) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No activity recorded yet.")
    )
  );
}
function lr(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function fn(e) {
  return lr(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function Ke(e) {
  const n = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), a = [];
  let r = !1, s = !1, l = [];
  const c = () => {
    l.length && (a.push(`<p>${fn(l.join(" "))}</p>`), l = []);
  }, g = () => {
    r && (a.push("</ul>"), r = !1);
  };
  for (const f of n) {
    const d = f.trimEnd();
    if (d.startsWith("```")) {
      c(), g(), a.push(s ? "</code></pre>" : "<pre><code>"), s = !s;
      continue;
    }
    if (s) {
      a.push(lr(f));
      continue;
    }
    if (!d.trim()) {
      c(), g();
      continue;
    }
    const h = d.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      c(), g();
      const u = Math.min(h[1].length + 1, 4);
      a.push(`<h${u}>${fn(h[2])}</h${u}>`);
      continue;
    }
    const b = d.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (b) {
      c(), r || (a.push("<ul>"), r = !0);
      const u = b[1] ? `<input type="checkbox" disabled ${b[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      a.push(`<li>${u}${fn(b[2])}</li>`);
      continue;
    }
    l.push(d.trim());
  }
  return c(), g(), s && a.push("</code></pre>"), a.join(`
`);
}
function ni(e) {
  return [e.title, e.identifier, e.state].filter(Boolean).join(" ").toLowerCase();
}
function ai(e, n) {
  const a = n.trim().toLowerCase();
  return !a || ni(e).includes(a);
}
function ri(e) {
  var n;
  return ((n = (e.prStack ?? []).find((a) => a.url)) == null ? void 0 : n.url) ?? null;
}
function oi(e) {
  const n = e.prStack ?? [];
  return (e.state ?? "") === "AWAITING_PLAN_APPROVAL" ? [{ className: "forge-v3-plan-badge", label: "plan ready" }] : n.length ? n.slice(0, 2).flatMap((r) => [
    { className: "forge-v3-pr-badge", label: r.pr_number ? `#${r.pr_number}` : r.branch ?? "PR" },
    { className: r.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : r.status === "merged" ? "forge-v3-ci-badge" : r.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: r.isInMergeQueue ? "merge queue" : r.liveState ?? r.status ?? "✓ CI" }
  ]) : [];
}
function ii(e) {
  const n = (e.prStack ?? []).map((a) => [a.branch, a.pr_number ? `#${a.pr_number}` : "", a.status].filter(Boolean).join(" ")).join(" ");
  return [e.title, e.linear_id, e.branch, n, e.state].filter(Boolean).join(" ").toLowerCase();
}
function si(e, n) {
  const a = n.trim().toLowerCase();
  return !a || ii(e).includes(a);
}
function li(e, n) {
  const a = e.state ?? "";
  return n === "needs-me" ? ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(a) : n === "running" ? _e(e) : n === "failed" ? a === "FAILED" : n === "watching-pr" ? ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(a) : n === "paused" ? ["PAUSED", "IGNORED"].includes(a) : !0;
}
function re(e) {
  const n = e ? Ye(e) : 0;
  return Number.isFinite(n) ? n : 0;
}
function ci(e, n) {
  const a = [...e];
  return n === "newest" ? a.sort((r, s) => re(s.created_at ?? s.updated_at) - re(r.created_at ?? r.updated_at)) : n === "oldest" ? a.sort((r, s) => re(r.created_at ?? r.updated_at) - re(s.created_at ?? s.updated_at)) : n === "recently-updated" ? a.sort((r, s) => re(s.updated_at) - re(r.updated_at)) : a.sort((r, s) => (r.priority ?? 99) - (s.priority ?? 99) || re(s.updated_at) - re(r.updated_at));
}
function di(e, n) {
  var s;
  if (n === "awaiting")
    return [...e].sort((l, c) => re(c.updated_at ?? c.created_at) - re(l.updated_at ?? l.created_at));
  const a = ((s = bn.find((l) => l.key === n)) == null ? void 0 : s.states) ?? [], r = (l) => {
    const c = l.state ?? "";
    if (c === "FAILED") return -1;
    const g = a.indexOf(c);
    return g >= 0 ? g : Xe[c] ?? 999;
  };
  return [...e].sort(
    (l, c) => r(l) - r(c) || (l.priority ?? 99) - (c.priority ?? 99) || re(c.updated_at) - re(l.updated_at)
  );
}
function Na(e, n) {
  const a = n.find((r) => r.id === e.issue_id);
  return a != null && a.state ? Xe[a.state] ?? 999 : e.type === "PLAN_REVIEW" ? Xe.AWAITING_PLAN_APPROVAL : e.type === "SPLIT_APPROVAL" ? Xe.AWAITING_SPLIT_APPROVAL : e.type === "CODE_REVIEW" ? Xe.AWAITING_CODE_REVIEW : e.type === "FIX_APPROVAL" ? Xe.AWAITING_FIX_APPROVAL : e.type === "FIX_REVIEW" ? Xe.AWAITING_FIX_REVIEW : 999;
}
function ui(e, n) {
  return [...e].sort((a, r) => {
    const s = n.find((c) => c.id === a.issue_id), l = n.find((c) => c.id === r.issue_id);
    return Na(a, n) - Na(r, n) || ((s == null ? void 0 : s.priority) ?? 99) - ((l == null ? void 0 : l.priority) ?? 99) || a.id - r.id;
  });
}
function fi(e, n) {
  return ui(e, n)[0] ?? null;
}
function pi(e) {
  const n = e ?? {};
  return {
    issues: n.issues ?? n.active ?? [],
    decisions: n.decisions ?? n.awaitingDecisions ?? [],
    runningAgents: n.runningAgents ?? [],
    scheduler: n.scheduler,
    doneThisWeek: n.doneThisWeek,
    doneThisWeekCount: n.doneThisWeekCount,
    learningSuggestionsCount: n.learningSuggestionsCount,
    failedCount: n.failedCount,
    archiveCount: n.archiveCount
  };
}
async function le(e) {
  if (Je()) {
    if (e === "/api/overview") return wo();
    if (e === "/api/settings") return { model: "mock-state-fixtures", concurrency_limit: "4", runtime_mode: "mock" };
    if (e === "/api/desktop-capabilities") return { notifications: !0 };
    if (e === "/api/archive") return [];
    if (e === "/api/linear/issues") return [];
    const a = e.match(/^\/api\/issues\/(\d+)\/diff$/);
    if (a != null && a[1]) return { baseBranch: "main", diff: `diff --git a/src/mock.ts b/src/mock.ts
--- a/src/mock.ts
+++ b/src/mock.ts
@@ -1,3 +1,4 @@
 export function mockFeature() {
-  return false;
+  return true;
 }` };
    const r = e.match(/^\/api\/issues\/(\d+)\/tour$/);
    if (r != null && r[1]) return { generating: !1, created_at: Be(1), tour: { summary: "AI tour: review behavior, error states, and API payload shape.", highlights: ["Diff sidecar stays issue-scoped", { title: "Decision payload", text: "Structured review feedback is sent to the agent", file: "src/mock.ts", line: 3 }], files: [{ path: "src/mock.ts", summary: "Mock review fixture", risk: "low" }] } };
    const s = e.match(/^\/api\/issues\/(\d+)$/);
    if (s != null && s[1]) return Ao(Number(s[1]));
  }
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Failed to fetch ${e}: ${n.status}`);
  return await n.json();
}
async function ye(e, n, a = "POST") {
  if (Je()) return { ok: !0, mock: !0, url: e, body: n, method: a };
  const r = JSON.stringify(n);
  let s = null;
  for (let c = 0; c < 3; c += 1) {
    const g = await fetch(e, {
      method: a,
      headers: { "Content-Type": "application/json" },
      body: r
    });
    if (g.ok) return await g.json();
    if (s = g, ![502, 503, 504].includes(g.status) || c === 2) break;
    await new Promise((f) => window.setTimeout(f, 300 * (c + 1)));
  }
  const l = await (s == null ? void 0 : s.text().catch(() => ""));
  throw new Error(`Failed to mutate ${e}: ${(s == null ? void 0 : s.status) ?? "unknown"}${l ? ` — ${l.slice(0, 200)}` : ""}`);
}
async function gi(e) {
  if (Je()) return { ok: !0, mock: !0, url: e, method: "DELETE" };
  const n = await fetch(e, { method: "DELETE" });
  if (!n.ok) throw new Error(`Failed to delete ${e}: ${n.status}`);
  return await n.json();
}
function pn(e) {
  if (!e.trim()) return [];
  const n = [];
  let a = null;
  for (const r of e.split(`
`)) {
    const s = r.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (s) {
      a = { path: s[2] ?? s[1] ?? "unknown", additions: 0, deletions: 0, hunks: [] }, n.push(a);
      continue;
    }
    a && (r.startsWith("+") && !r.startsWith("+++") && (a.additions += 1), r.startsWith("-") && !r.startsWith("---") && (a.deletions += 1), a.hunks.push(r));
  }
  return n.length ? n : [{ path: "diff", additions: 0, deletions: 0, hunks: e.split(`
`) }];
}
function vi(e, n, a) {
  return ye(`/api/decisions/${e}/resolve`, { verdict: n, feedback: a });
}
function _i(e, n, a = {}) {
  return ye(`/api/issues/${e}`, { action: n, ...a }, "PATCH");
}
function mi(e) {
  return gi(`/api/issues/${e}`);
}
function hi(e) {
  return ye(`/api/issues/${e}/vm-launch`, {});
}
function bi() {
  return ye("/api/vm/stop", {});
}
function yi(e) {
  return ye(`/api/issues/${e}/sync-prs`, {});
}
function ki(e, n, a) {
  return ye(`/api/issues/${e}/feedback`, { body: n, prNumber: a ?? null });
}
function Ii(e, n = "", a) {
  return ye("/api/issues", { title: e, description: n, ...a });
}
function Ai(e, n = "", a) {
  return ye("/api/linear/enqueue", { linearId: e, planningGuidance: n, ...a });
}
function wi() {
  return le("/api/desktop-capabilities");
}
function cr(e, n, a) {
  return ye("/api/desktop-notify", { title: e, body: n, tag: a });
}
function Ln() {
  return typeof window < "u" && "Notification" in window;
}
function Ei() {
  return Ln() ? window.Notification.permission : "unsupported";
}
async function Pi(e, n, a = !1) {
  const r = No(e) || "Forge decision needed", s = n != null && n.title ? `${n.title} needs your review` : "A Forge issue needs your review", l = `forge-decision-${e.id}`;
  if (a)
    try {
      await cr(r, s, l);
      return;
    } catch {
    }
  if (!Ln() || window.Notification.permission !== "granted") return;
  const c = new window.Notification(r, { body: s, tag: l });
  c.onclick = () => {
    window.focus();
    const g = (n == null ? void 0 : n.id) ?? e.issue_id, f = new URL(window.location.href);
    f.searchParams.set("view", "queue"), f.searchParams.set("issue", String(g)), f.searchParams.set("panel", "review"), window.location.href = f.toString();
  };
}
function Ni(e, n) {
  var s;
  const a = e.doneThisWeek ?? [], r = e.doneThisWeekCount ?? (Array.isArray(a) ? a.length : Number(a || 0));
  return {
    scheduler: (s = e.scheduler) != null && s.running ? "running" : "stopped",
    activeCount: e.issues.filter((l) => !["DONE", "PAUSED", "IGNORED", "FAILED"].includes(l.state ?? "")).length,
    awaitingDecisionsCount: e.decisions.length,
    failedCount: e.failedCount ?? e.issues.filter((l) => l.state === "FAILED").length,
    doneThisWeekCount: r,
    learningSuggestionsCount: e.learningSuggestionsCount ?? 0,
    archiveCount: e.archiveCount ?? r,
    model: n.model ?? n.default_model ?? "—",
    backend: n.backend_mode ?? n.backend ?? "local",
    runningAgentsCount: e.runningAgents.length,
    concurrencyLimit: Number(n.concurrency_limit ?? 2) || 2
  };
}
function _t(e) {
  if (!e) return null;
  const n = Number(e);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function jt(e = window.location.hash) {
  const n = new URLSearchParams(window.location.search), a = n.get("view") || void 0, r = _t(n.get("issue") || void 0), s = _t(n.get("decision") || void 0), l = n.get("tab"), c = l === "activity" || l === "ask" ? l : "overview", g = n.get("panel"), f = g === "plan" || g === "diff" || g === "review" || g === "listen" || g === "jump" ? g : null, d = kt.some((P) => P.key === a) ? a : null;
  if (d || r || f || n.has("add"))
    return {
      view: d ?? "queue",
      issueId: r,
      decisionId: s,
      detailTab: c,
      panel: f,
      diffPath: n.get("diffPath") ?? "",
      addIssue: n.get("add") === "issue"
    };
  const h = e.replace(/^#/, "").split("/").filter(Boolean), [b, u, y, p] = h;
  return b === "issue" ? { view: "queue", issueId: _t(u), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 } : b === "review" ? {
    view: "queue",
    issueId: _t(u),
    decisionId: y === "decision" ? _t(p) : null,
    detailTab: "overview",
    panel: "review",
    diffPath: "",
    addIssue: !1
  } : { view: kt.some((P) => P.key === b) ? b : "queue", issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 };
}
function Xt(e, n = !0) {
  const a = new URL(window.location.href);
  a.hash = "";
  for (const [l, c] of Object.entries(e))
    c == null || c === !1 || c === "" ? a.searchParams.delete(l) : a.searchParams.set(l, String(c));
  const r = `${a.pathname}${a.search}${a.hash}`, s = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  r !== s && window.history[n ? "replaceState" : "pushState"]({}, "", r);
}
function rt(e, n = {}) {
  Xt({ view: e, issue: e === "queue" ? n.issueId : null, decision: n.decisionId, panel: n.decisionId ? "review" : null }, !1);
}
function zt({ icon: e, title: n, subtitle: a, actions: r }) {
  return t(
    "header",
    { class: "forge-v3-page-header" },
    t(
      "div",
      null,
      t("div", { class: "forge-v3-page-title" }, e, " ", n),
      t("div", { class: "forge-v3-page-sub" }, a)
    ),
    r ? t("div", { class: "forge-v3-page-actions" }, r) : null
  );
}
function Et({ view: e, className: n = "", children: a }) {
  return t(
    "main",
    { class: `forge-v3-main forge-v3-view-scroll ${n}`, "data-active-view": e },
    t("div", { class: "forge-v3-page-wrap" }, a)
  );
}
function he(e) {
  return typeof document > "u" ? Promise.resolve(null) : new Promise((n) => {
    const a = document.createElement("div");
    document.body.appendChild(a);
    let r = e.initialValue ?? "";
    const s = (c) => {
      Qe(null, a), a.remove(), n(c);
    }, l = () => {
      if (e.requiredText && r !== e.requiredText) return s(null);
      s(r);
    };
    Qe(t(
      "div",
      { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (c) => {
        c.target === c.currentTarget && s(null);
      } },
      t(
        "section",
        { class: `forge-v3-dialog ${e.danger ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": e.title },
        t("header", { class: "forge-v3-dialog-head" }, t("h2", null, e.title), t("button", { type: "button", onClick: () => s(null), "aria-label": "Close dialog" }, "×")),
        e.message ? t("p", { class: "forge-v3-dialog-message" }, e.message) : null,
        t(
          "label",
          { class: "forge-v3-dialog-field" },
          t("span", null, e.label ?? "Response"),
          t("textarea", { autoFocus: !0, value: r, placeholder: e.placeholder, onInput: (c) => {
            r = c.currentTarget.value;
          }, onKeyDown: (c) => {
            (c.metaKey || c.ctrlKey) && c.key === "Enter" && l();
          } })
        ),
        e.requiredText ? t("p", { class: "forge-v3-dialog-hint" }, "Required confirmation text: ", t("code", null, e.requiredText)) : null,
        t(
          "footer",
          { class: "forge-v3-dialog-actions" },
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => s(null) }, "Cancel"),
          t("button", { type: "button", class: `forge-v3-da ${e.danger ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: l }, e.confirmText ?? "Submit")
        )
      )
    ), a);
  });
}
function bt({ title: e, message: n, confirmText: a = "Confirm", danger: r = !1 }) {
  return typeof document > "u" ? Promise.resolve(!1) : new Promise((s) => {
    const l = document.createElement("div");
    document.body.appendChild(l);
    const c = (g) => {
      Qe(null, l), l.remove(), s(g);
    };
    Qe(t(
      "div",
      { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (g) => {
        g.target === g.currentTarget && c(!1);
      } },
      t(
        "section",
        { class: `forge-v3-dialog ${r ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": e },
        t("header", { class: "forge-v3-dialog-head" }, t("h2", null, e), t("button", { type: "button", onClick: () => c(!1), "aria-label": "Close dialog" }, "×")),
        n ? t("p", { class: "forge-v3-dialog-message" }, n) : null,
        t(
          "footer",
          { class: "forge-v3-dialog-actions" },
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => c(!1) }, "Cancel"),
          t("button", { type: "button", class: `forge-v3-da ${r ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: () => c(!0) }, a)
        )
      )
    ), l);
  });
}
function Ri({ title: e, message: n }) {
  if (typeof document > "u") return;
  const a = document.createElement("div");
  document.body.appendChild(a);
  const r = () => {
    Qe(null, a), a.remove();
  };
  Qe(t(
    "div",
    { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (s) => {
      s.target === s.currentTarget && r();
    } },
    t(
      "section",
      { class: "forge-v3-dialog danger", role: "alertdialog", "aria-modal": "true", "aria-label": e },
      t("header", { class: "forge-v3-dialog-head" }, t("h2", null, e), t("button", { type: "button", onClick: r, "aria-label": "Close dialog" }, "×")),
      t("p", { class: "forge-v3-dialog-message" }, n),
      t(
        "footer",
        { class: "forge-v3-dialog-actions" },
        t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: r }, "Dismiss")
      )
    )
  ), a);
}
function dr(e) {
  return { available: "○", active: "▣", awaiting: "⚡" }[e];
}
function Si({ issue: e, onEnqueue: n }) {
  const a = async () => {
    var s;
    const r = ((s = await he({ title: `Enqueue ${e.identifier}`, message: "Add optional planning guidance before Forge creates the plan.", label: "Planning guidance", confirmText: "Enqueue" })) == null ? void 0 : s.trim()) ?? "";
    n(e.identifier, r);
  };
  return t(
    "article",
    { class: "forge-v3-backlog-card", "data-linear-id": e.identifier },
    t(
      "div",
      { class: "forge-v3-backlog-body" },
      t("div", { class: "forge-v3-backlog-title" }, e.title ?? "Untitled Linear issue"),
      t(
        "div",
        { class: "forge-v3-backlog-meta" },
        t("span", null, e.identifier),
        t("span", null, "·"),
        t("span", { class: `forge-v3-priority-meta ${Cn(e.priority)}` }, Sn(e.priority), " ", Tn(e.priority))
      )
    ),
    t("button", { type: "button", onClick: a }, "Enqueue →")
  );
}
function Ra(e) {
  e.stopPropagation();
}
function Sa(e) {
  return e.composedPath().some((n) => {
    var a;
    return n instanceof HTMLElement && !!((a = n.closest) != null && a.call(n, "button,a,input,select,textarea"));
  });
}
function Ti({ issue: e, selected: n, onOpenIssue: a, onIssueAction: r, onReviewIssue: s }) {
  const l = Eo(e), c = ze(e), g = c === "available", f = _e(e), d = e.state === "PAUSED" ? "unpause" : e.state === "FAILED" ? "retry" : "pause", h = d === "unpause" ? "Resume" : d === "retry" ? "Retry" : "Pause", b = To(e), u = oi(e), y = ri(e);
  return t(
    "article",
    { class: `forge-v3-issue-card ${n ? "selected" : ""} ${Bt(e) ? "pr-approved" : ""} ${(e.prStack ?? []).some((p) => p.isInMergeQueue) ? "in-merge-queue" : ""} state-${e.state ?? "unknown"} stage-${c}`, "data-issue-id": String(e.id), tabIndex: 0, "aria-label": `Open issue ${e.linear_id ?? e.id}`, onClick: (p) => {
      Sa(p) || a(e.id);
    }, onKeyDown: (p) => {
      Sa(p) || (p.key === "Enter" || p.key === " ") && a(e.id);
    } },
    t(
      "div",
      { class: "forge-v3-ic-hover", onPointerDown: Ra },
      g ? t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
        p.stopPropagation(), r(e.id, "ignore");
      } }, "Ignore") : e.state === "AWAITING_PLAN_APPROVAL" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "View plan"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "Approve")
      ] : e.state === "AWAITING_CODE_REVIEW" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), s(e.id);
        } }, "View diff"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "Approve")
      ] : e.state === "FAILED" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), r(e.id, "retry");
        } }, "Retry"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "Log")
      ] : e.state === "PAUSED" ? t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
        p.stopPropagation(), r(e.id, "unpause");
      } }, "Resume") : f ? [
        e.state === "WORKING" ? t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "Listen live") : null,
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, "Steer"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), r(e.id, "pause");
        } }, "Pause")
      ] : [
        e.state === "WATCHING_PR" && y ? t("a", { class: "forge-v3-hact", href: y, target: "_blank", rel: "noreferrer", onClick: (p) => p.stopPropagation() }, "View PR") : t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), a(e.id);
        } }, e.state === "WATCHING_PR" ? "View PR" : "Open"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
          p.stopPropagation(), s(e.id);
        } }, e.state === "WATCHING_PR" ? "Add feedback" : "Diff")
      ]
    ),
    t(
      "div",
      { class: "forge-v3-ic-body" },
      t(
        "div",
        { class: "forge-v3-issue-topline" },
        t(
          "span",
          { class: "forge-v3-issue-keyline" },
          t("span", { class: "forge-v3-issue-id" }, e.linear_id ?? `#${e.id}`),
          t("span", { class: `forge-v3-priority-glyph ${Cn(e.priority)}`, "aria-label": `Priority ${Tn(e.priority)}` }, Sn(e.priority))
        )
      ),
      t("h3", null, e.title ?? "Untitled issue"),
      So(e) ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Merged"), t("small", null, "finalizing")) : (e.prStack ?? []).some((p) => p.isInMergeQueue) ? t("div", { class: "forge-v3-merge-queue-banner" }, t("span", null, "⇄"), t("strong", null, "Merge queue"), t("small", null, "waiting to merge")) : Bt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(e.state ?? "") ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Approved"), t("small", null, e.pr_approved_at ? `${be(e.pr_approved_at)} ago` : "watching merge")) : null,
      t(
        "div",
        { class: "forge-v3-issue-state-row" },
        f ? t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
        t("span", { class: Po(e) }, Ze(e)),
        b.map((p) => t("span", { class: p.className }, p.label))
      ),
      g ? t("div", { class: "forge-v3-ic-meta" }, Aa(e)) : [
        t("p", { class: "forge-v3-activity-snippet" }, ar(e)),
        t("div", { class: "forge-v3-ic-meta" }, Aa(e), Ot(e) ? t("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
      ],
      !g && u.length ? t("div", { class: "forge-v3-pr-metadata" }, u.map((p) => t("span", { class: p.className }, p.label))) : null
    ),
    t("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, t("span", { class: "forge-v3-ic-fill", style: { width: `${l}%` } })),
    t(
      "div",
      { class: "forge-v3-issue-actions", onPointerDown: Ra },
      t("button", { type: "button", onClick: (p) => {
        p.stopPropagation(), a(e.id);
      } }, "Open"),
      t("button", { type: "button", onClick: (p) => {
        p.stopPropagation(), a(e.id);
      } }, "Open plan"),
      t("button", { type: "button", onClick: (p) => {
        p.stopPropagation(), s(e.id);
      } }, "Review diff"),
      t("button", { type: "button", onClick: (p) => {
        p.stopPropagation(), r(e.id, d);
      } }, h)
    )
  );
}
const Ta = Qr(Ti, (e, n) => e.issue === n.issue && e.selected === n.selected);
function Ci({ status: e, onStopVm: n }) {
  return t(
    "aside",
    { class: "forge-v3-runtime-dock", "aria-label": "Runtime dock" },
    t("strong", null, "Runtime"),
    t("span", { class: "forge-v3-runtime-badge" }, "Backend", ": ", e.backend),
    t("span", { class: `forge-v3-runtime-badge scheduler-${e.scheduler}` }, "Scheduler", ": ", e.scheduler),
    t("span", { class: "forge-v3-runtime-badge" }, e.runningAgentsCount, " / ", e.concurrencyLimit, " agent slots"),
    t("button", { type: "button", class: "forge-v3-runtime-stop", onClick: n }, "Stop VM")
  );
}
function Li({ open: e, decisions: n, onClose: a, onNavigate: r, onRefresh: s, onOpenIssue: l, onReviewNext: c, onAddIssue: g, onStopVm: f, onHandoverReport: d }) {
  if (!e) return null;
  const b = [
    ...n.map((u) => ({ label: `Decision: ${u.type ?? "Review"} #${u.id}`, action: () => {
      r("queue"), l(u.issue_id);
    } })),
    { label: "Review next", action: c, disabled: n.length === 0 },
    { label: "Open queue", action: () => r("queue") },
    { label: "Open archive", action: () => r("archive") },
    { label: "Open settings", action: () => r("settings") },
    { label: "Open prompts", action: () => r("prompts") },
    { label: "Open learnings", action: () => r("learnings") },
    { label: "Refresh dashboard", action: s },
    { label: "Stop VM runtime", action: f },
    { label: "Sync Linear backlog", action: () => r("queue") },
    { label: "Add issue", action: g },
    { label: "Handover report", action: d },
    { label: "Pause scheduler (use /forge stop)", action: () => r("settings"), disabled: !0 }
  ];
  return t(
    "div",
    { class: "forge-v3-command-palette", role: "dialog", "aria-modal": "true", "aria-label": "Command palette" },
    t(
      "div",
      { class: "forge-v3-command-panel" },
      t("header", null, t("strong", null, "Command palette"), t("button", { type: "button", onClick: a }, "Close")),
      t(
        "div",
        { class: "forge-v3-command-list" },
        b.map((u) => t("button", { type: "button", disabled: u.disabled, onClick: () => {
          u.disabled || (u.action(), a());
        } }, u.label))
      )
    )
  );
}
function Gi({ issues: e, decisions: n, linearBacklog: a, selectedIssueId: r, addIssueOpen: s, onOpenIssue: l, onIssueAction: c, onResolveDecision: g, onReviewNext: f, onReviewIssue: d, onAddIssue: h, onCloseAddIssue: b, onRefreshLinear: u, onCreateManualIssue: y, onEnqueueLinear: p }) {
  const [v, P] = A(""), L = mt(() => {
    try {
      const E = window.localStorage.getItem("forge.v3.queuePrefs");
      if (!E) return { filter: "all", sort: "priority" };
      const U = JSON.parse(E);
      return {
        filter: ["all", "needs-me", "running", "failed", "watching-pr", "paused"].includes(U.filter) ? U.filter : "all",
        sort: ["priority", "newest", "oldest", "recently-updated"].includes(U.sort) ? U.sort : "priority"
      };
    } catch {
      return { filter: "all", sort: "priority" };
    }
  }, []), [k, G] = A(L.filter), [x, D] = A(L.sort);
  K(() => {
    try {
      window.localStorage.setItem("forge.v3.queuePrefs", JSON.stringify({ filter: k, sort: x }));
    } catch {
    }
  }, [k, x]);
  const [H, q] = A("linear"), [Z, Y] = A(""), [F, w] = A(""), [S, V] = A(""), [T, ae] = A(""), [ce, de] = A(""), [ke, Ee] = A(""), [Ie, Ge] = A(""), [xe, pe] = A(""), ge = mt(() => ci(
    e.filter((E) => ho(E) && si(E, v) && li(E, k)),
    x
  ), [e, v, k, x]), ee = mt(() => {
    const E = /* @__PURE__ */ new Map();
    return bn.forEach((U) => E.set(U.key, [])), ge.forEach((U) => {
      var oe;
      return (oe = E.get(ze(U))) == null ? void 0 : oe.push(U);
    }), E.forEach((U, oe) => E.set(oe, di(U, oe))), E;
  }, [ge]), $e = mt(() => a.filter((E) => ai(E, v)).slice(0, 12), [a, v]), We = Je(), De = () => ({ targetKind: ce.trim(), targetPaths: ke.trim(), avoidPaths: Ie.trim(), scopeNotes: xe.trim() }), ve = () => {
    de(""), Ee(""), Ge(""), pe("");
  }, me = () => {
    const E = Z.trim();
    E && (y(E, F.trim(), De()), Y(""), w(""), ve(), b());
  }, Oe = () => {
    const E = S.trim();
    E && (p(E, T.trim(), De()), V(""), ae(""), ve(), b());
  };
  return t(Et, { view: "queue", className: `forge-v3-queue-shell ${r ? "forge-v3-has-detail" : ""}` }, [
    We ? t("div", { class: "forge-v3-mock-state-banner" }, t("strong", null, "Mock state fixtures enabled"), t("span", null, "Review every Forge state without touching real issues."), t("button", { type: "button", onClick: ko }, "Exit mock data")) : null,
    t(
      "section",
      { id: "queue-toolbar", class: "forge-v3-command-center", "aria-label": "Queue toolbar" },
      t(
        "div",
        { class: "forge-v3-toolbar-actions forge-v3-left-tools" },
        t("input", { type: "search", placeholder: "Search issues, IDs, branch", "aria-label": "Search issues", value: v, onInput: (E) => P(E.target.value) }),
        t(
          "div",
          { class: "forge-v3-filter-chips", "aria-label": "Queue filters" },
          fo.map((E) => t("button", { key: E.key, type: "button", class: k === E.key ? "active" : "", onClick: () => G(E.key) }, E.label))
        )
      ),
      t(
        "div",
        { class: "forge-v3-toolbar-actions" },
        t("select", { "aria-label": "Sort issues", value: x, onChange: (E) => D(E.target.value) }, po.map((E) => t("option", { key: E.key, value: E.key }, E.label))),
        t("button", { type: "button", disabled: n.length === 0, onClick: f }, "⚡ Review next", n.length ? ` (${n.length})` : ""),
        t("button", { type: "button", title: "Refresh Linear", onClick: u }, "↻ Sync"),
        t("button", { type: "button", disabled: !0 }, "⌘ Command"),
        We ? null : t("button", { type: "button", onClick: yo }, "Mock states"),
        t("button", { type: "button", onClick: h }, "+ Add issue")
      )
    ),
    s ? t(
      "div",
      { class: "forge-v3-add-issue-backdrop", role: "dialog", "aria-modal": "true", "aria-label": "Add issue" },
      t(
        "section",
        { class: "forge-v3-add-issue-modal" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Queue"), t("h2", null, "Add issue")),
          t("button", { type: "button", onClick: b, "aria-label": "Close add issue" }, "×")
        ),
        t(
          "nav",
          { class: "forge-v3-detail-tabs" },
          t("button", { type: "button", class: H === "linear" ? "active" : "", onClick: () => q("linear") }, "Linear issue"),
          t("button", { type: "button", class: H === "manual" ? "active" : "", onClick: () => q("manual") }, "Manual issue")
        ),
        t(
          "div",
          { class: "forge-v3-add-issue-body" },
          H === "linear" ? [
            t("label", null, "Linear ID", t("input", { type: "text", placeholder: "TEAM-1234", value: S, onInput: (E) => V(E.target.value) })),
            t("label", null, "Planning guidance", t("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: T, onInput: (E) => ae(E.target.value) }))
          ] : [
            t("label", null, "Title", t("input", { type: "text", placeholder: "Manual issue title", value: Z, onInput: (E) => Y(E.target.value) })),
            t("label", null, "Description", t("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: F, onInput: (E) => w(E.target.value) }))
          ],
          t(
            "div",
            { class: "forge-v3-scope-grid" },
            t("label", null, "Target kind", t("input", { type: "text", placeholder: "backend-shared, pricing-frontend, fullstack…", value: ce, onInput: (E) => de(E.target.value) })),
            t("label", null, "Target paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. functions/", value: ke, onInput: (E) => Ee(E.target.value) })),
            t("label", null, "Avoid paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. frontend/apps/pricing/", value: Ie, onInput: (E) => Ge(E.target.value) })),
            t("label", null, "Scope notes", t("textarea", { rows: 2, placeholder: "Generic shared endpoint; do not describe as pricing-scoped.", value: xe, onInput: (E) => pe(E.target.value) }))
          )
        ),
        t(
          "footer",
          null,
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: b }, "Cancel"),
          H === "linear" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !S.trim(), onClick: Oe }, "Enqueue Linear issue") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !Z.trim(), onClick: me }, "Create manual issue")
        )
      )
    ) : null,
    t(
      "div",
      { class: "forge-v3-pipeline-wrap" },
      t(
        "section",
        { id: "pipeline-wrapper", class: "forge-v3-pipeline", "aria-label": "Issue pipeline" },
        bn.map((E) => {
          const U = ee.get(E.key) ?? [], oe = E.key === "available" ? U.length + $e.length : U.length;
          return t(
            "section",
            { key: E.key, class: "forge-v3-pipeline-column", "data-stage": E.key },
            t(
              "header",
              { class: `forge-v3-col-head ${E.key === "awaiting" ? "needs-head" : ""}` },
              t("span", { class: `forge-v3-col-label ${E.key === "awaiting" ? "needs" : ""}` }, E.key === "available" ? E.label : `${dr(E.key)} ${E.label}`),
              E.key === "available" ? t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: u }, "↻ Sync") : null,
              t("span", { class: `forge-v3-col-count ${oe && E.key === "awaiting" ? "bad" : ""}` }, String(oe))
            ),
            t(
              "div",
              { class: `forge-v3-col-cards forge-v3-pipeline-list ${E.key === "available" ? "forge-v3-available-split" : ""}` },
              E.key === "available" ? [
                t(
                  "div",
                  { class: "forge-v3-available-backlog" },
                  $e.length ? $e.map((te) => t(Si, { key: te.identifier, issue: te, onEnqueue: p })) : t("p", { class: "forge-v3-empty" }, v ? "No Linear issues match" : "No available Linear issues")
                ),
                t("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                t(
                  "div",
                  { class: "forge-v3-available-queued" },
                  U.length ? U.map((te) => t(Ta, { key: te.id, issue: te, selected: r === te.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d })) : t("p", { class: "forge-v3-empty" }, v || k !== "all" ? "No queued issues match" : "No queued issues")
                )
              ] : U.length === 0 ? t("p", { class: "forge-v3-empty" }, v || k !== "all" ? "No issues match the active filters" : "No issues") : U.map((te) => t(Ta, { key: te.id, issue: te, selected: r === te.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d }))
            )
          );
        })
      )
    )
  ]);
}
function Kt(e) {
  return e.includes("limit") || e.includes("seconds") || e.includes("rounds") || e.endsWith("_max") || e === "dashboard_port" ? "number" : e.startsWith("enable_") || e.startsWith("use_") || e.endsWith("_enabled") || e.includes("reuse") || e.includes("use_desktop") ? "checkbox" : "text";
}
function kn(e) {
  var n;
  return ((n = za[e]) == null ? void 0 : n.label) ?? e;
}
function Ca(e) {
  var a;
  const n = (a = za[e]) == null ? void 0 : a.hint;
  return n ? `${n} · DB key: ${e}` : `Unrecognized setting · DB key: ${e}`;
}
function xi(e, n) {
  return n.keys.filter((a) => Object.prototype.hasOwnProperty.call(e, a)).map((a) => ({ key: a, value: e[a] ?? "" }));
}
function In(e, n) {
  return lo.has(e) ? n === "true" ? "true" : "false" : n;
}
function La(e, n, a) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => a || Rn.has(r)).map(([r, s]) => [r, In(r, s ?? "")]).filter(([r, s]) => In(String(r), e[String(r)] ?? "") !== s));
}
function $i(e, n) {
  const a = [];
  return Object.entries(e).forEach(([r, s]) => {
    if (!n && !Rn.has(r) || !so.has(r)) return;
    const l = String(s ?? "").trim();
    (!l || !Number.isFinite(Number(l)) || Number(l) < 0) && a.push(`${kn(r)} must be a non-negative number.`);
  }), a;
}
function Wi() {
  const [e, n] = A({}), [a, r] = A({}), [s, l] = A(null), [c, g] = A(""), [f, d] = A(""), [h, b] = A("Loading settings…"), [u, y] = A([]), [p, v] = A(!1), P = () => {
    le("/api/desktop-backend").then((w) => {
      l(w), g(w.backendOrigin ?? ""), d("");
    }).catch(() => {
      l(null), d("Desktop backend switching is available in the Forge desktop app.");
    });
  };
  K(() => {
    let w = !1;
    return le("/api/settings").then((S) => {
      w || (n(S), r(S), y([]), b(""));
    }).catch(() => {
      w || b("Unable to load settings");
    }), P(), () => {
      w = !0;
    };
  }, []);
  const L = (w, S) => {
    r((V) => ({ ...V, [w]: In(w, S) })), y((V) => V.filter((T) => !T.includes(kn(w))));
  }, k = () => {
    d("Saving backend…"), fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: c })
    }).then((w) => w.ok ? w.json() : Promise.reject(new Error("backend failed"))).then((w) => {
      l(w), g(w.backendOrigin ?? c), d("Backend saved. Refresh if the dashboard did not reconnect automatically.");
    }).catch(() => d("Unable to save desktop backend"));
  }, G = () => {
    const w = $i(a, p);
    if (w.length) {
      y(w), b("Fix validation errors before saving");
      return;
    }
    const S = La(e, a, p);
    if (Object.keys(S).length === 0) {
      b("No settings changed");
      return;
    }
    b(`Saving ${Object.keys(S).length} changed setting${Object.keys(S).length === 1 ? "" : "s"}…`), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(S)
    }).then((V) => V.json().then((T) => V.ok ? T : Promise.reject(new Error((T == null ? void 0 : T.error) ?? "Unable to save settings")))).then((V) => {
      const T = V.settings ?? { ...e, ...S };
      n(T), r(T), y([]), b("Settings saved");
    }).catch((V) => b(V.message || "Unable to save settings"));
  }, x = () => {
    r(e), y([]), b("Reset changes");
  }, D = Object.entries(a).filter(([w]) => !Rn.has(w)).map(([w, S]) => ({ key: w, value: S ?? "" })), H = La(e, a, p), q = Object.keys(H).length, Z = [...Jt, { label: "Other", keys: [] }], Y = (w, S = !1) => {
    if (w.key.includes("context") || w.key.includes("prompt") || w.key.includes("command"))
      return t("textarea", { class: "forge-v3-setting-control", value: w.value, rows: w.key === "project_prompt_overlay" ? 8 : 3, placeholder: ba[w.key], disabled: S, readOnly: S, onInput: (T) => L(w.key, T.target.value) });
    const V = Kt(w.key);
    return t("input", { class: "forge-v3-setting-control", type: Kt(w.key), checked: V === "checkbox" ? w.value === "true" : void 0, value: V === "checkbox" ? void 0 : w.value, placeholder: ba[w.key], disabled: S, readOnly: S, min: V === "number" ? "0" : void 0, onInput: (T) => {
      const ae = T.target;
      L(w.key, V === "checkbox" ? String(ae.checked) : ae.value);
    } });
  }, F = () => t(
    "div",
    { key: "desktop-backend-origin", class: "forge-v3-setting-row forge-v3-desktop-backend-row" },
    t("span", null, "Desktop backend origin"),
    t("small", null, f || (s != null && s.configFile ? `Stored in ${s.configFile}` : "All v3 dashboard reads and writes go through this backend.")),
    t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("input", { class: "forge-v3-setting-control", type: "url", value: c, placeholder: "http://127.0.0.1:3142", disabled: !s, onInput: (w) => g(w.target.value) }),
      t("button", { type: "button", disabled: !s, onClick: k }, "Use backend"),
      t("a", { class: "forge-v3-btn-primary", href: "/desktop/backend" }, "Switch page")
    )
  );
  return t(Et, { view: "settings", className: "forge-v3-settings-wrap" }, [
    t(zt, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("a", { class: "forge-v3-btn-primary", href: "/classic.html" }, "Open classic v2"),
      t("button", { type: "button", onClick: x }, "↺ Reset changes")
    ) }),
    h ? t("p", { class: `forge-v3-empty ${u.length ? "forge-v3-settings-error" : ""}` }, h) : null,
    u.length ? t("ul", { class: "forge-v3-settings-errors" }, u.map((w) => t("li", { key: w }, w))) : null,
    t("p", { class: "forge-v3-settings-helper" }, q ? `${q} changed setting${q === 1 ? "" : "s"} will be saved.` : "Only settings you change will be sent on save."),
    t(
      "section",
      { class: "forge-v3-settings-grid", "aria-label": "Settings groups" },
      Z.map((w) => {
        const S = w.label === "Other" ? D : xi(a, w), V = [
          ...w.label === "Dashboard Backend" ? [F()] : [],
          ...S.map((T) => {
            const ae = w.label === "Other", ce = co.has(T.key);
            return t(
              "label",
              { key: T.key, class: `forge-v3-setting-row ${ae ? "forge-v3-setting-unknown" : ""} ${ce ? "forge-v3-setting-runtime" : ""}` },
              t("span", null, kn(T.key), ae && !p ? t("em", null, " read-only") : null),
              t("small", null, ce ? `${Ca(T.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : Ca(T.key)),
              Y(T, ae && !p)
            );
          })
        ];
        return t(
          "section",
          { key: w.label, class: "forge-v3-settings-card forge-v3-settings-group" },
          t(
            "header",
            null,
            t("div", null, t("h2", null, w.label), t("p", null, oo[w.label])),
            w.label === "Other" ? t("label", { class: "forge-v3-other-unlock" }, t("input", { type: "checkbox", checked: p, onInput: (T) => v(T.target.checked) }), " Edit unknown") : t("span", null, String(V.length))
          ),
          V.length === 0 ? t("p", { class: "forge-v3-empty" }, "No settings in this group.") : V
        );
      })
    ),
    t(
      "div",
      { class: "forge-v3-settings-save-bar" },
      t("button", { type: "button", class: "forge-v3-btn-primary", disabled: q === 0, onClick: G }, q ? `Save ${q} change${q === 1 ? "" : "s"}` : "Save settings"),
      h === "Settings saved" ? t("span", { class: "forge-v3-saved-indicator" }, "✓ Saved") : null
    )
  ]);
}
function Di() {
  const [e, n] = A("suggestions"), [a, r] = A({ suggestions: [], events: [], changes: [] }), [s, l] = A("Loading learnings…"), c = () => {
    le("/api/learnings").then((f) => {
      r({ suggestions: f.suggestions ?? [], events: f.events ?? [], changes: f.changes ?? [] }), l("");
    }).catch(() => l("Unable to load learnings"));
  };
  K(() => {
    c();
    const f = window.setInterval(c, 3e4), d = typeof EventSource < "u" ? new EventSource("/api/events") : null;
    return d == null || d.addEventListener("message", (h) => {
      try {
        const b = JSON.parse(h.data);
        String(b.type ?? "").startsWith("learning_") && c();
      } catch {
      }
    }), () => {
      window.clearInterval(f), d == null || d.close();
    };
  }, []);
  const g = (f, d) => {
    r((h) => ({ ...h, suggestions: h.suggestions.filter((b) => b.id !== f) })), fetch(`/api/learnings/${f}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: d })
    }).then((h) => h.ok ? c() : Promise.reject(new Error("resolve failed"))).catch(() => {
      l("Unable to resolve learning suggestion"), c();
    });
  };
  return t(Et, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    t(zt, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
    t(
      "nav",
      { class: "forge-v3-learning-tabs", "aria-label": "Learning tabs" },
      uo.map((f) => t("button", { key: f.key, type: "button", class: e === f.key ? "active" : "", onClick: () => n(f.key) }, f.label))
    ),
    s ? t("p", { class: "forge-v3-empty" }, s) : null,
    e === "suggestions" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning suggestions" },
      a.suggestions.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning suggestions.") : a.suggestions.map((f) => t(
        "article",
        { key: f.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? `Issue #${f.issue_id ?? "—"}`, " · ", f.target ?? "target", " · Added ", f.created_at ? `${be(f.created_at)} ago (${un(f.created_at)})` : "date unknown"),
        t("h2", null, f.suggestion ?? "Untitled suggestion"),
        t("p", null, f.rationale ?? "No rationale provided."),
        t(
          "div",
          { class: "forge-v3-toolbar-actions" },
          t("button", { type: "button", onClick: () => g(f.id, "applied") }, "Apply suggestion"),
          t("button", { type: "button", onClick: () => g(f.id, "rejected") }, "Reject suggestion")
        )
      ))
    ),
    e === "changes" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning change log" },
      a.changes.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning changes yet.") : a.changes.map((f) => t(
        "article",
        { key: f.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? "Global", " · ", f.target ?? "target", " · ", f.change_type ?? "change", " · ", f.created_at ? un(f.created_at) : "date unknown"),
        t("h2", null, f.change_summary ?? "Learning change"),
        t("p", null, f.reason ?? "No reason recorded.")
      ))
    ),
    e === "reflections" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Reflection history" },
      a.events.length === 0 ? t("p", { class: "forge-v3-empty" }, "No reflection history yet.") : a.events.map((f) => t(
        "article",
        { key: f.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? "Global", " · ", f.event_type ?? "reflection", " · ", f.created_at ? un(f.created_at) : "date unknown"),
        t("h2", null, f.summary ?? "Reflection event")
      ))
    )
  ]);
}
function Oi() {
  const [e, n] = A(() => Object.fromEntries(
    dn.map((p) => [p, { type: p, content: "", status: "Loading…" }])
  )), [a, r] = A({}), [s, l] = A("Loading models…"), c = (p) => {
    fetch(`/api/agents/${p}/prompt`).then((v) => v.ok ? v.text() : Promise.reject(new Error("prompt failed"))).then((v) => n((P) => ({ ...P, [p]: { type: p, content: v, status: "Loaded" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to load prompt" } })));
  }, g = () => {
    le("/api/settings").then((p) => {
      r(p), l("Models loaded");
    }).catch(() => l("Unable to load model settings"));
  };
  K(() => {
    dn.forEach(c), g();
  }, []);
  const f = (p, v) => n((P) => ({ ...P, [p]: { ...P[p], content: v, status: "Unsaved" } })), d = (p, v) => {
    r((P) => ({ ...P, [p]: v })), l("Unsaved model change");
  }, h = (p) => {
    l("Saving model…"), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [p]: a[p] ?? "" })
    }).then((v) => v.ok ? v.json() : Promise.reject(new Error("save failed"))).then((v) => {
      v.settings && r(v.settings), l("Model saved");
    }).catch(() => l("Unable to save model"));
  }, b = (p) => {
    fetch(`/api/agents/${p}/prompt`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: e[p].content })
    }).then((v) => v.ok ? v.json() : Promise.reject(new Error("save failed"))).then(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Saved" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to save prompt" } })));
  }, u = (p) => {
    fetch(`/api/agents/${p}/prompt/default`).then((v) => v.ok ? v.text() : Promise.reject(new Error("default failed"))).then((v) => n((P) => ({ ...P, [p]: { type: p, content: v, status: "Reset to default" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to reset prompt" } })));
  }, y = a.model ?? a.default_model ?? "";
  return t(Et, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    t(zt, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place" }),
    t(
      "section",
      { class: "forge-v3-model-default-card", "aria-label": "Default model" },
      t(
        "div",
        null,
        t("h2", null, "Default model"),
        t("p", { class: "forge-v3-prompt-meta" }, "Used by every agent unless an override is set on that agent. ", s)
      ),
      t(
        "div",
        { class: "forge-v3-prompt-model-row" },
        t("input", { class: "forge-v3-prompt-model-input", value: y, placeholder: "anthropic-vertex/sonnet-4-6", onInput: (p) => d("model", p.target.value) }),
        t("button", { type: "button", onClick: () => h("model") }, "Save default")
      )
    ),
    t(
      "section",
      { class: "forge-v3-prompts-grid", "aria-label": "Agent prompt editors" },
      dn.map((p) => {
        const v = e[p], P = v.content.length, L = Ya[p], k = a[L] ?? "";
        return t(
          "article",
          { key: p, class: "forge-v3-prompt-card" },
          t(
            "header",
            null,
            t(
              "div",
              null,
              t("h2", null, p),
              t("p", { class: "forge-v3-prompt-meta" }, "Prompt: ", v.status, " · Model: ", k.trim() ? "override" : "default")
            ),
            p === "coder" ? t("span", { class: "forge-v3-prompt-meta" }, "learned-rules") : null
          ),
          t(
            "div",
            { class: "forge-v3-prompt-model-row" },
            t("label", { class: "forge-v3-prompt-meta" }, "Model override"),
            t("input", { class: "forge-v3-prompt-model-input", value: k, placeholder: y || "Use default model", onInput: (G) => d(L, G.target.value) }),
            t("button", { type: "button", onClick: () => h(L) }, "Save model")
          ),
          t("textarea", { class: "forge-v3-prompt-editor", value: v.content, rows: 12, onInput: (G) => f(p, G.target.value) }),
          t(
            "footer",
            { class: "forge-v3-prompt-meta" },
            t("span", null, String(P), " chars"),
            t(
              "div",
              { class: "forge-v3-toolbar-actions" },
              t("button", { type: "button", onClick: () => u(p) }, "Reset to default"),
              t("button", { type: "button", onClick: () => b(p) }, "Save prompt")
            )
          )
        );
      })
    )
  ]);
}
function Fi(e) {
  if (!e) return !1;
  const n = Ye(e);
  return Number.isFinite(n) && Date.now() - n <= 10080 * 60 * 1e3;
}
function Ui(e) {
  const n = (e.prStack ?? []).map((a) => [a.pr_number ? `#${a.pr_number}` : "", a.gt_branch, a.branch, a.status].filter(Boolean).join(" ")).join(" ");
  return [e.linear_id, e.title, e.state, e.updated_at, n].filter(Boolean).join(" ").toLowerCase();
}
function Mi({ issue: e, onClose: n }) {
  const a = e.prStack ?? [];
  return t(
    "aside",
    { class: "forge-v3-archive-sidecar", "aria-label": "Archived issue summary" },
    t(
      "header",
      null,
      t(
        "div",
        null,
        t("div", { class: "forge-v3-issue-meta" }, e.linear_id ?? `Issue #${e.id}`),
        t("h2", null, e.title ?? "Untitled issue")
      ),
      t("button", { type: "button", onClick: n, "aria-label": "Close archive summary" }, "×")
    ),
    t(
      "div",
      { class: "forge-v3-archive-sidecar-body" },
      t(
        "section",
        null,
        t("h3", null, "Summary"),
        e.summaryContent ? t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Ke(e.summaryContent) } }) : t("p", { class: "forge-v3-empty" }, e.hasSummary ? "Summary could not be loaded." : "No summary was generated for this issue.")
      ),
      t(
        "section",
        null,
        t("h3", null, "PR stack"),
        a.length ? t("div", { class: "forge-v3-archive-pr-list" }, a.map((r, s) => {
          const l = r.pr_number ? `#${r.pr_number}` : r.gt_branch ?? r.branch ?? `PR ${s + 1}`, c = r.gt_branch ?? r.branch;
          return t(
            "div",
            { class: "forge-v3-archive-pr-row", key: `${l}-${s}` },
            r.url ? t("a", { href: r.url, target: "_blank", rel: "noreferrer" }, l) : t("span", null, l),
            c ? t("code", null, c) : null,
            r.status ? t("span", { class: "forge-v3-pr-meta-badge" }, r.status) : null
          );
        })) : t("p", { class: "forge-v3-empty" }, "No PRs were tracked for this issue.")
      ),
      t(
        "section",
        null,
        t("h3", null, "Run metadata"),
        t("div", { class: "forge-v3-archive-meta" }, "Agent runs: ", String(e.run_count ?? 0)),
        t("div", { class: "forge-v3-archive-meta" }, "Completed: ", e.merged ?? e.updated_at ?? "—")
      )
    )
  );
}
function ur({ onClose: e }) {
  const [n, a] = A(""), [r, s] = A(!1), [l, c] = A(!1), g = /* @__PURE__ */ new Date(), f = new Date(g.getTime() - 7 * 864e5), d = (P) => P.toISOString().slice(0, 10), [h, b] = A(d(f)), [u, y] = A(d(g)), p = async () => {
    s(!0), c(!1);
    try {
      const P = new URLSearchParams();
      h && P.set("since", h), u && P.set("until", u);
      const L = await fetch(`/api/archive/report?${P}`);
      a(await L.text());
    } catch (P) {
      a(`Error generating report: ${P.message}`);
    } finally {
      s(!1);
    }
  }, v = async () => {
    try {
      await navigator.clipboard.writeText(n), c(!0), setTimeout(() => c(!1), 2e3);
    } catch {
    }
  };
  return K(() => {
    p();
  }, []), t(
    "div",
    { class: "forge-v3-modal-overlay", onClick: (P) => {
      P.target.classList.contains("forge-v3-modal-overlay") && e();
    } },
    t(
      "div",
      { class: "forge-v3-handover-modal" },
      t(
        "div",
        { class: "forge-v3-handover-modal-header" },
        t("h2", null, "📋 Handover Report"),
        t("button", { type: "button", class: "forge-v3-close-button", onClick: e, "aria-label": "Close" }, "×")
      ),
      t(
        "div",
        { class: "forge-v3-handover-controls" },
        t("span", { class: "forge-v3-handover-hint" }, "Completed issues date range (in-flight issues always included):"),
        t("label", null, "From ", t("input", { type: "date", value: h, onInput: (P) => b(P.target.value) })),
        t("label", null, " To ", t("input", { type: "date", value: u, onInput: (P) => y(P.target.value) })),
        t("button", { type: "button", class: "forge-v3-btn forge-v3-btn-primary", onClick: p, disabled: r }, r ? "Generating…" : "Generate"),
        t("button", { type: "button", class: "forge-v3-btn", onClick: v, disabled: !n }, l ? "✓ Copied" : "Copy")
      ),
      t(
        "div",
        { class: "forge-v3-handover-body" },
        t("pre", { class: "forge-v3-handover-report" }, n || (r ? "Loading…" : "Configure date range and click Generate."))
      )
    )
  );
}
function Vi() {
  const [e, n] = A(null), [a, r] = A(null), [s, l] = A(""), [c, g] = A(null), [f, d] = A(!1);
  K(() => {
    let k = !1;
    return le("/api/archive").then((G) => {
      k || n(G);
    }).catch(() => {
      k || r("Unable to load archive");
    }), () => {
      k = !0;
    };
  }, []);
  const h = e ?? [], b = s.trim().toLowerCase(), u = b ? h.filter((k) => Ui(k).includes(b)) : h, y = c ? h.find((k) => k.id === c) ?? null : null, p = u.length, v = u.filter((k) => Fi(k.merged ?? k.updated_at)).length, P = p ? (u.reduce((k, G) => {
    var x;
    return k + Number(G.pr_count ?? ((x = G.prStack) == null ? void 0 : x.length) ?? 0);
  }, 0) / p).toFixed(1) : "0.0", L = (() => {
    const k = u.filter((D) => D.created_at && (D.merged ?? D.updated_at)).map((D) => {
      const H = Ye(D.created_at), q = Ye(D.merged ?? D.updated_at);
      return Number.isFinite(H) && Number.isFinite(q) ? q - H : 0;
    }).filter((D) => D > 0);
    if (!k.length) return "—";
    const G = k.reduce((D, H) => D + H, 0) / k.length, x = Math.round(G / 36e5);
    return x < 24 ? `${x}h` : `${(x / 24).toFixed(1)}d`;
  })();
  return t(Et, { view: "archive", className: `forge-v3-archive-wrap ${y ? "forge-v3-has-archive-detail" : ""}` }, [
    t(zt, { icon: "🗃️", title: "Archive", subtitle: `${p} completed issues${b ? ` matching "${s.trim()}"` : ""} — all PRs merged`, actions: t("div", { class: "forge-v3-toolbar-actions" }, t("button", { type: "button", class: "forge-v3-btn", onClick: () => d(!0), title: "Generate on-call handover report" }, "📋 Handover Report"), t("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: s, onInput: (k) => l(k.target.value) })) }),
    t(
      "section",
      { class: "forge-v3-archive-stats forge-v3-stats-strip", "aria-label": "Archive stats" },
      t("article", null, t("span", null, "Total completed"), t("strong", null, String(p))),
      t("article", null, t("span", null, "Completed this week"), t("strong", null, String(v))),
      t("article", null, t("span", null, "Average time to merge"), t("strong", null, L)),
      t("article", null, t("span", null, "Average PRs per issue"), t("strong", null, P))
    ),
    a ? t("p", { class: "forge-v3-empty" }, "Unable to load archive") : e === null ? t("p", { class: "forge-v3-empty" }, "Loading archive…") : h.length === 0 ? t("p", { class: "forge-v3-empty" }, "No completed issues yet") : u.length === 0 ? t("p", { class: "forge-v3-empty" }, "No archived issues match your search") : t(
      "section",
      { class: "forge-v3-archive-grid forge-v3-archive-list", "aria-label": "Completed issues" },
      u.map((k) => {
        var G;
        return t(
          "article",
          { key: k.id, class: `forge-v3-archive-card ${c === k.id ? "is-selected" : ""}`, tabIndex: 0, role: "button", onClick: () => g(k.id), onKeyDown: (x) => {
            (x.key === "Enter" || x.key === " ") && (x.preventDefault(), g(k.id));
          } },
          t("div", { class: "forge-v3-archive-meta" }, k.linear_id ?? `Issue #${k.id}`, " · ", k.updated_at ?? "merged"),
          t("h2", null, k.title ?? "Untitled issue"),
          t("div", { class: "forge-v3-archive-meta" }, "PR links", ": ", (G = k.prStack) != null && G.length ? k.prStack.map((x, D) => {
            const H = x.pr_number ? `#${x.pr_number}` : x.gt_branch ?? x.branch ?? "pending";
            return x.url ? t("a", { key: `${H}-${D}`, href: x.url, target: "_blank", rel: "noreferrer", onClick: (q) => q.stopPropagation() }, H) : t("span", { key: `${H}-${D}` }, H);
          }) : "None"),
          t("div", { class: "forge-v3-archive-meta" }, "Agent runs", ": ", String(k.run_count ?? 0)),
          t("div", { class: "forge-v3-archive-meta" }, "Summary", ": ", k.summaryContent || k.hasSummary ? "available" : "not generated")
        );
      })
    ),
    y ? t(Mi, { issue: y, onClose: () => g(null) }) : null,
    f ? t(ur, { onClose: () => d(!1) }) : null
  ]);
}
function Hi({ issueId: e, issuePreview: n, reloadKey: a, autoOpenDiffKey: r, onClose: s, onPanelResizeStart: l, onIssueAction: c, onRemoveIssue: g, onLaunchRuntime: f, onStopVm: d, onSyncPrs: h, onSubmitFeedback: b, onResolveDecision: u }) {
  var Hn, qn, Bn, jn, Xn, Kn, Qn, Jn, zn, Yn;
  const [y, p] = A(() => jt().detailTab), [v, P] = A(null), [L, k] = A(!1), [G, x] = A(!1), [D, H] = A(""), [q, Z] = A(""), Y = qe(0), [F, w] = A(""), [S, V] = A(!1), [T, ae] = A(null), [ce, de] = A(""), [ke, Ee] = A([]), [Ie, Ge] = A([]), [xe, pe] = A(""), [ge, ee] = A([]), [$e, We] = A([]), [De, ve] = A(!1), [me, Oe] = A(!1), [E, U] = A("idle"), [oe, te] = A([]), [et, st] = A(""), [lt, tt] = A(""), [Pt, nt] = A(!1), [Yt, ct] = A(!1), [Zt, dt] = A(!1), [Fe, m] = A(""), [R, C] = A([]), [W, M] = A(""), [j, J] = A(""), ue = qe(null);
  if (K(() => {
    var I;
    if (!e) {
      P(null), k(!1), x(!1), Oe(!1), ve(!1);
      return;
    }
    P(n ? { issue: n } : null);
    const i = jt();
    p(i.detailTab), k(i.panel === "plan"), x(i.panel === "diff" || i.panel === "review"), Oe(i.panel === "listen"), ve(i.panel === "jump"), te([]), U("idle"), H(""), Z(i.panel === "diff" || i.panel === "review" ? "Loading diff…" : ""), w(i.diffPath), V(i.panel === "review"), ae(null), de(""), Ee([]), Ge([]), pe(""), ee([]), We([]), st(""), tt(""), nt(!1), ct(!1), dt(!1);
    const _ = Io(e);
    m(_.input ?? ""), C(_.messages ?? []), M(""), J(""), (I = ue.current) == null || I.abort(), ue.current = null;
  }, [e]), K(() => {
    if (!e) return;
    let i = !1;
    return le(`/api/issues/${e}?fast=1`).then((_) => {
      i || P(_);
    }).catch(() => {
      i || P({ issue: { id: e, title: "Unable to load issue" } });
    }), () => {
      i = !0;
    };
  }, [e, a]), K(() => {
    if (!e) return;
    Xt({ view: "queue", issue: e, tab: y === "overview" ? null : y, panel: G ? S ? "review" : "diff" : L ? "plan" : me ? "listen" : De ? "jump" : null, diffPath: G ? F : null });
  }, [e, y, L, G, me, De, S, F]), K(() => {
    var I;
    const i = (I = v == null ? void 0 : v.decisions) == null ? void 0 : I.find((N) => N.type === "FIX_APPROVAL"), _ = Ft(i).comments ?? [];
    ee(_.map((N, O) => vt(N, O)));
  }, [v == null ? void 0 : v.decisions]), K(() => {
    var i, _, I;
    nt(!!((i = v == null ? void 0 : v.issue) != null && i.auto_fix_enabled)), ct(!!((_ = v == null ? void 0 : v.issue) != null && _.externally_managed)), dt(!!((I = v == null ? void 0 : v.issue) != null && I.awaiting_review));
  }, [(Hn = v == null ? void 0 : v.issue) == null ? void 0 : Hn.auto_fix_enabled, (qn = v == null ? void 0 : v.issue) == null ? void 0 : qn.externally_managed, (Bn = v == null ? void 0 : v.issue) == null ? void 0 : Bn.awaiting_review]), K(() => {
    if (!me || !e) return;
    if (Je()) {
      U("mock live"), te([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    U("connecting…"), te([]);
    const i = new EventSource(`/api/issues/${e}/listen`);
    return i.addEventListener("meta", (_) => {
      const I = JSON.parse(_.data);
      U(I.agentType ? `live · ${I.agentType}` : "live");
    }), i.addEventListener("message", (_) => {
      const I = JSON.parse(_.data), N = I.kind ?? "text", O = (I.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!O) return;
      const B = N === "text_delta" || N === "thinking_delta";
      te((ie) => {
        const gt = ie[ie.length - 1];
        return B && gt && gt.kind === N ? [...ie.slice(0, -1), { kind: N, text: gt.text + O }] : [...ie.slice(-200), { kind: N, text: O }];
      });
    }), i.addEventListener("done", (_) => {
      const I = JSON.parse(_.data);
      U(I.exitCode === 0 ? "done" : `failed (${I.exitCode ?? "unknown"})`), i.close();
    }), i.addEventListener("error", () => U("no active agent")), i.onerror = () => U("disconnected"), () => i.close();
  }, [me, e]), K(() => {
    !e || r <= 0 || (V(!0), x(!0), Z("Loading diff…"));
  }, [r, e]), K(() => {
    if (!e || !G || q !== "Loading diff…") return;
    const i = ++Y.current;
    S && (de("Loading AI tour…"), le(`/api/issues/${e}/tour`).then((_) => {
      i === Y.current && (ae(_), de(_.generating ? "AI tour is generating…" : _.tour ? "" : "No AI tour yet"));
    }).catch(() => {
      i === Y.current && de("Unable to load AI tour");
    })), le(`/api/issues/${e}/diff`).then((_) => {
      if (i !== Y.current) return;
      const I = _.diff ?? "", N = pn(I);
      H(I), w((O) => {
        var B;
        return O || ((B = N[0]) == null ? void 0 : B.path) || "";
      }), Z(_.error ?? "");
    }).catch(() => {
      i === Y.current && Z("Unable to load diff");
    });
  }, [G, q, e, S]), K(() => {
    if (!G) return;
    const i = (_) => {
      const I = _.target;
      if (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.tagName === "SELECT") return;
      const N = pn(D);
      if (!N.length) return;
      const O = N.findIndex((B) => B.path === F);
      if (_.key === "j" || _.key === "J") {
        _.preventDefault();
        const B = Math.min(O + 1, N.length - 1);
        w(N[B].path);
      } else if (_.key === "k" || _.key === "K") {
        _.preventDefault();
        const B = Math.max(O - 1, 0);
        w(N[B].path);
      } else _.key === "r" && S && F ? (_.preventDefault(), Ee((B) => B.includes(F) ? B.filter((ie) => ie !== F) : [...B, F])) : _.key === "a" && S && F && (_.preventDefault(), nn(F, null));
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [G, D, F, S]), !e) return null;
  const o = v == null ? void 0 : v.issue, X = ((v == null ? void 0 : v.decisions) ?? []).filter((i) => !i.verdict && !i.resolved_at && !$e.includes(i.id)), Nt = (v == null ? void 0 : v.prStack) ?? [], ut = o ?? {}, gr = () => Oe(!0), at = Fo(ut, X), ne = rr(X), en = Ho(o == null ? void 0 : o.state), vr = `${Sn(o == null ? void 0 : o.priority)} ${Tn(o == null ? void 0 : o.priority)}`, _r = ir(v), mr = sr(v), Rt = jo(v), hr = Bo(v) && !["PENDING", "SETTING_UP", "PLANNING"].includes((o == null ? void 0 : o.state) ?? "") || Rt, br = Xo(o == null ? void 0 : o.state), yr = Ko(o == null ? void 0 : o.state), kr = Qo(o), Ir = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes((o == null ? void 0 : o.state) ?? ""), Ar = { label: "Plan" }, Gn = async () => {
    if (!(o != null && o.id)) return;
    const i = await he({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    i != null && i.trim() && c(o.id, "steer", { instructions: i.trim() });
  }, wr = async () => {
    !(o != null && o.id) || !await bt({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" }) || c(o.id, "clear-steer");
  }, Er = _o.filter((i) => i.state !== (o == null ? void 0 : o.state)), Pr = async (i) => {
    if (!(o != null && o.id)) return;
    const _ = o.linear_id ?? `issue #${o.id}`;
    if (i.state === "RETURN_TO_LINEAR") {
      if (await he({ title: "Return issue to Linear", message: `This fully resets ${_}, removes worktree/project artifacts/branches, deletes Forge tracking, and leaves the Linear issue visible in the Linear list.`, label: "Type RETURN to confirm", confirmText: "Return to Linear", danger: !0, requiredText: "RETURN" }) !== "RETURN") return;
      ve(!1), c(o.id, "return-to-linear"), s();
      return;
    }
    const I = i.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    await bt({ title: "Jump workflow state?", message: `Move ${_} to ${i.state}?${I}`, confirmText: "Jump state", danger: i.risky }) && (ve(!1), c(o.id, "advance", { nextState: i.state }));
  }, Nr = async () => {
    var ie;
    if (!(o != null && o.id)) return;
    const i = vo(o.state), I = { SETTING_UP: "setup", PLANNING: "planner", AI_PLAN_REVIEWING: "plan-reviewer", WORKING: "coder", AI_REVIEWING: "reviewer", CREATING_PR: "git-agent", FIXING: "fixer", PUSHING: "git-agent", REBASING: "rebaser", SPLIT_PLANNING: "split-planner", SPLITTING: "splitter" }[i] ?? null, N = I ? ` Forge will run the ${I} agent next.` : "", O = (ie = o.state) != null && ie.startsWith("AWAITING") ? " This skips the pending human approval gate." : "";
    await bt({ title: "Advance workflow state?", message: `Move ${o.linear_id ?? `issue #${o.id}`} from "${Ze(o)}" to "${Ze({ state: i })}"?${N}${O}`, confirmText: "Advance" }) && c(o.id, "advance", { nextState: i });
  }, Rr = async () => {
    !(o != null && o.id) || await he({ title: "Full reset issue", message: `This fully resets ${o.linear_id ?? `issue #${o.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: !0, requiredText: "RESET" }) !== "RESET" || c(o.id, "reset");
  }, Sr = async () => {
    !(o != null && o.id) || await he({ title: "Remove issue", message: `Remove ${o.linear_id ?? `issue #${o.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: !0, requiredText: "DELETE" }) !== "DELETE" || g(o.id);
  }, Tr = () => {
    o != null && o.id && (tt("Launching runtime…"), f(o.id).then((i) => tt(`Runtime launch complete${typeof i == "object" && i && "launchRef" in i ? ` · ${i.launchRef ?? "started"}` : ""}`)).catch((i) => tt(`Runtime launch failed: ${i.message}`)));
  }, Cr = (i) => {
    if (!(o != null && o.id)) return;
    const _ = Pt;
    nt(i), c(o.id, "set-auto-fix", { enabled: i }), window.setTimeout(() => {
      var I;
      !Je() && ((I = v == null ? void 0 : v.issue) == null ? void 0 : I.auto_fix_enabled) === _ && nt(_);
    }, 2e3);
  }, Lr = (i) => {
    o != null && o.id && (ct(i), c(o.id, i ? "mark-external" : "unmark-external"));
  }, Gr = (i) => {
    o != null && o.id && (dt(i), c(o.id, i ? "mark-awaiting-review" : "unmark-awaiting-review"));
  }, xr = async () => {
    var O;
    if (!(o != null && o.id)) return;
    const i = Nt.filter((B) => B.pr_number).map((B) => String(B.pr_number)), _ = i.length ? await he({ title: "Target PR", message: `Choose a PR number (${i.join(", ")}).`, label: "PR number", initialValue: i[0], confirmText: "Continue" }) : null, I = _ != null && _.trim() ? Number(_.trim().replace(/^#/, "")) : null, N = (O = await he({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" })) == null ? void 0 : O.trim();
    N && b(o.id, N, Number.isFinite(I) ? I : null);
  }, $r = (i = !1) => {
    if (!(o != null && o.id)) return;
    de(i ? "Regenerating AI tour…" : "Generating AI tour…");
    const _ = () => ye(`/api/issues/${o.id}/generate-tour`, {});
    (i ? ye(`/api/issues/${o.id}/tour`, {}, "DELETE").then(_) : _()).then((I) => {
      ae(I), de(I.tour ? "" : "AI tour is generating…");
    }).catch(() => de("Unable to start AI tour generation"));
  }, tn = (i = "diff") => {
    o != null && o.id && (Y.current += 1, V(i === "review"), ae(null), de(i === "review" ? "Loading AI tour…" : ""), H(""), w(""), x(!0), Z("Loading diff…"));
  }, St = pn(D), fe = St.find((i) => i.path === F) ?? St[0], Ue = X.find((i) => i.type === "PLAN_REVIEW") ?? (ne === "plan" ? X[0] : void 0), ft = X.find((i) => i.type === "CODE_REVIEW") ?? (ne === "code" ? X[0] : void 0), Pe = X.find((i) => i.type === "FIX_APPROVAL") ?? (ne === "fix" ? X[0] : void 0), Tt = X.find((i) => i.type === "FIX_REVIEW") ?? (ne === "fix-review" ? X[0] : void 0), Ne = X.find((i) => i.type === "SPLIT_APPROVAL") ?? (ne === "split" ? X[0] : void 0), pt = Ft(Pe).comments ?? [], Wr = Ft(Ne), Ct = Go(Ne, Wr, v), xn = Ct.stack, $n = Oo(o == null ? void 0 : o.state), Wn = $n ? X.filter((i) => i.type && i.type !== $n) : X.filter((i) => i.type), nn = async (i, _) => {
    var N;
    const I = (N = await he({ title: "Add review comment", message: _ === null ? `Comment on ${i}` : `Comment on ${i}:${_}`, label: "Comment", confirmText: "Add comment" })) == null ? void 0 : N.trim();
    I && Ge((O) => [...O, { id: `${Date.now()}-${O.length}`, file: i, line: _, body: I }]);
  }, Dn = (i) => Ee((_) => _.includes(i) ? _.filter((I) => I !== i) : [..._, i]), Ae = (i, _, I) => {
    We((N) => N.includes(i) ? N : [...N, i]), u(i, _, I);
  }, On = async () => {
    var _;
    if (!Ue) return;
    const i = (_ = await he({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" })) == null ? void 0 : _.trim();
    Ae(Ue.id, "approved", i ? { steeringComment: i } : void 0);
  }, je = async (i, _) => {
    const I = await he({ title: `Request ${_} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: !0 });
    I != null && I.trim() && Ae(i.id, "rejected", { reason: I.trim() });
  }, Dr = (i) => ee((_) => _.includes(i) ? _.filter((I) => I !== i) : [..._, i]), an = () => {
    if (!Pe) return;
    const i = pt.map((_, I) => vt(_, I));
    ee([]), Ae(Pe.id, "rejected", { skippedIds: i, reason: "Skipped all PR comments" });
  }, Fn = () => {
    if (!Pe) return;
    const i = pt.map((N, O) => vt(N, O)), _ = ge;
    if (!_.length) {
      an();
      return;
    }
    const I = i.filter((N) => !_.includes(N));
    Ae(Pe.id, "approved", { approvedIds: _, skippedIds: I });
  }, Un = (i) => {
    ft && (Ae(ft.id, i, {
      kind: "code-review",
      summary: xe.trim(),
      reviewedFiles: ke,
      comments: Ie.map(({ file: _, line: I, body: N }) => ({ file: _, line: I, body: N }))
    }), pe(""));
  }, Mn = (i, _) => {
    const I = o == null ? void 0 : o.id;
    C((N) => {
      const O = i(N).slice(-er);
      return I && ka(I, { messages: O, input: _ ?? Fe }), O;
    });
  }, rn = (i) => {
    m(i), o != null && o.id && ka(o.id, { messages: R, input: i });
  }, Vn = () => {
    if (!(o != null && o.id) || !Fe.trim() || W === "thinking") return;
    const i = Fe.trim(), _ = R.filter((N) => N.text.trim()).slice(-12);
    rn(""), M("thinking"), J("Gathering issue context…"), Mn((N) => [...N, { role: "user", text: i }, { role: "assistant", text: "" }], "");
    const I = new AbortController();
    ue.current = I, fetch(`/api/issues/${o.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: i, history: _ }),
      signal: I.signal
    }).then(async (N) => {
      if (!N.ok || !N.body) throw new Error(`Ask failed (${N.status})`);
      const O = N.body.getReader(), B = new TextDecoder();
      let ie = "";
      const gt = (Re) => Mn((Se) => {
        const Me = [...Se].map((Te) => Te.role).lastIndexOf("assistant");
        return Me < 0 ? [...Se, { role: "assistant", text: Re }] : Se.map((Te, we) => we === Me ? { ...Te, text: Te.text + Re } : Te);
      }), Lt = (Re) => J(Re), Or = (Re) => {
        const Se = Re.split(`
`).find((on) => on.startsWith("event:")), Me = Re.split(`
`).find((on) => on.startsWith("data:"));
        if (!Me) return;
        const Te = (Se == null ? void 0 : Se.replace(/^event:\s*/, "")) ?? "message", we = JSON.parse(Me.replace(/^data:\s*/, ""));
        if (Te === "done") {
          M(""), J("");
          return;
        }
        if (Te === "meta") {
          Lt("Gathered issue context. Starting assistant…");
          return;
        }
        Te === "message" && ((we.kind === "text_delta" || we.kind === "text") && gt(we.text ?? ""), we.kind === "thinking_delta" && Lt("Thinking…"), we.kind === "tool" && Lt((we.text ?? "").trim()), we.kind === "error" && Lt(`Error: ${(we.text ?? "").trim()}`));
      };
      for (; ; ) {
        const { value: Re, done: Se } = await O.read();
        if (Se) break;
        ie += B.decode(Re, { stream: !0 });
        const Me = ie.split(`

`);
        ie = Me.pop() ?? "", Me.forEach(Or);
      }
      M(""), J("");
    }).catch((N) => {
      I.signal.aborted || (M(""), J(N.message));
    });
  };
  return t(
    "aside",
    { id: "detail-panel", class: "forge-v3-detail-panel", "aria-label": "Issue detail panel" },
    t("div", { class: "forge-v3-detail-resize-handle", role: "separator", "aria-orientation": "vertical", title: "Resize sidebar", onPointerDown: l }),
    t(
      "header",
      { class: "forge-v3-detail-header" },
      t(
        "div",
        null,
        t("div", { class: "forge-v3-issue-meta" }, (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`),
        t("h2", null, (o == null ? void 0 : o.title) ?? "Loading issue…")
      ),
      t("button", { type: "button", onClick: s, "aria-label": "Close issue detail panel" }, "×")
    ),
    t(
      "nav",
      { class: "forge-v3-detail-tabs", "aria-label": "Issue detail tabs" },
      ro.map((i) => t("button", { key: i.key, type: "button", class: y === i.key ? "active" : "", onClick: () => p(i.key) }, i.label))
    ),
    t(
      "section",
      { class: "forge-v3-detail-body", "data-tab": y },
      y === "overview" && t(
        "div",
        { class: "forge-v3-detail-overview" },
        t(
          "section",
          { class: "forge-v3-ds" },
          t(
            "div",
            { class: `forge-v3-state-banner ${at.tone}` },
            at.icon === "spinner" ? t("span", { class: "forge-v3-spinner forge-v3-state-spinner", "aria-hidden": "true" }) : t("span", { class: "forge-v3-state-icon", "aria-hidden": "true" }, at.icon),
            t("div", { class: "forge-v3-sb-text" }, t("strong", null, at.title), t("br", null), at.text),
            at.live ? t("span", { class: "forge-v3-live-badge" }, "Live") : null
          ),
          t(
            "div",
            { class: "forge-v3-phase-track", "aria-label": "Workflow phase track" },
            Ea.map((i, _) => {
              const I = Vo(i, v);
              return [
                t(
                  "div",
                  { key: i, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${I.title}: ${I.summary} ${I.stats.join(". ")}` },
                  t("div", { class: `forge-v3-phase-dot ${_ < en || (o == null ? void 0 : o.state) === "DONE" ? "done" : _ === en ? qo(o == null ? void 0 : o.state) ? "wait" : "active" : ""}` }),
                  t("div", { class: "forge-v3-phase-label" }, i),
                  t(
                    "div",
                    { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    t("strong", null, I.title),
                    t("p", null, I.summary),
                    t("ul", null, I.stats.map((N) => t("li", { key: N }, N)))
                  )
                ),
                _ < Ea.length - 1 ? t("div", { key: `${i}-line`, class: `forge-v3-phase-line ${_ < en ? "done" : ""}` }) : null
              ];
            })
          )
        ),
        (o == null ? void 0 : o.state) === "FAILED" && (v != null && v.failureContext) ? t(
          "section",
          { class: "forge-v3-ds forge-v3-failure-box" },
          t(
            "div",
            { class: "forge-v3-failure-header" },
            t("span", { class: "forge-v3-failure-icon", "aria-hidden": "true" }, "✕"),
            t(
              "div",
              null,
              t("strong", null, `${((jn = v.failureContext.run) == null ? void 0 : jn.agent_type) ?? "Agent"} crashed`),
              t(
                "span",
                { class: "forge-v3-failure-meta" },
                ` · exit ${((Xn = v.failureContext.run) == null ? void 0 : Xn.exit_code) ?? "?"} · `,
                (Kn = v.failureContext.run) != null && Kn.started_at ? `${be(v.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            (Qn = v.failureContext.run) != null && Qn.id ? t("a", { class: "forge-v3-failure-log-link", href: ht(v.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗") : null
          ),
          v.failureContext.logTail ? t("pre", { class: "forge-v3-failure-log" }, v.failureContext.logTail) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Gn }, "Steer before retry")
          )
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, ne ? "Actions · Decision needed" : "Actions"),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            _e(ut) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: gr }, "Listen live") : null,
            ne === "plan" && Ue ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: On }, "✓ Approve plan") : null,
            ne === "plan" && Ue ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => k(!0) }, "✗ Request changes") : null,
            ne === "code" && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => tn("review") }, "Review code") : null,
            ne === "fix" && Pe ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Fn }, `✓ Fix selected (${ge.length})`) : null,
            ne === "fix" && Pe ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: an }, "Skip all") : null,
            ne === "fix-review" && Tt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Tt.id, "approved") }, "✓ Approve fix & push") : null,
            ne === "fix-review" && Tt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Tt, "Fix review") }, "✗ Send back to fixer") : null,
            ne === "fix-review" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => tn("diff") }, "Review diff") : null,
            ne === "split" && Ne ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Ne.id, "approved") }, "✓ Approve split plan") : null,
            ne === "split" && Ne ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Ne, "Split plan") }, "✗ Revise split") : null,
            ne === "generic" && X[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(X[0].id, "approved") }, "✓ Approve") : null,
            ne === "generic" && X[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(X[0], "Decision") }, "✗ Request changes") : null,
            hr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => k(!0) }, Rt ? "View plan / handoff" : "View plan") : null,
            br ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => tn("diff") }, "View diff") : null,
            Ir ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Gn }, "Steer") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Nr }, "Advance state"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => ve(!0) }, "Jump to state"),
            yr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              var _;
              if (!(o != null && o.id)) return;
              const i = (_ = await he({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" })) == null ? void 0 : _.trim();
              c(o.id, "split-pr-stack", i ? { instructions: i } : {});
            } }, "Split PR") : null,
            kr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              if (!(o != null && o.id)) return;
              await bt({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: !0 }) && c(o.id, "rebase");
            } }, "Rebase") : null,
            (o == null ? void 0 : o.state) === "FAILED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry") : null,
            (o == null ? void 0 : o.state) === "PAUSED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unpause") : void 0 }, "Resume") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes((o == null ? void 0 : o.state) ?? "") ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: xr }, "Add PR feedback") : null,
            _e(ut) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "pause") : void 0 }, "Pause") : null
          )
        ),
        Wn.length ? t(
          "section",
          { class: "forge-v3-ds forge-v3-stale-decisions" },
          t("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          t("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          Wn.map((i) => t("div", { class: "forge-v3-stale-decision-row", key: i.id }, t("span", null, i.type ?? "Decision"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => je(i, "Stale decision") }, "Reject with feedback")))
        ) : null,
        Pe ? t(
          "section",
          { class: "forge-v3-ds forge-v3-fix-approval" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "Fix approval"), t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ee(pt.map((i, _) => vt(i, _))) }, "Select all"), t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ee([]) }, "None"))),
          pt.length ? t("div", { class: "forge-v3-fix-comment-list" }, pt.map((i, _) => {
            const I = vt(i, _), N = i.path ? `${i.path}${i.line ? `:${i.line}` : ""}` : "general", B = or(i) ? xo(i, Nt) : null;
            return t(
              "label",
              { class: `forge-v3-fix-comment-card ${ge.includes(I) ? "selected" : ""}`, key: I },
              t("input", { type: "checkbox", checked: ge.includes(I), onChange: () => Dr(I) }),
              t(
                "div",
                null,
                t("div", { class: "forge-v3-fix-comment-meta" }, t("strong", null, i.author ?? "Reviewer"), B ? [" · ", t("span", { class: "forge-v3-fix-comment-pr" }, B)] : null, " · ", N),
                Do(i.body),
                t("div", { class: "forge-v3-fix-comment-badges" }, [i.reviewState ?? i.state, i.source, B].filter(Boolean).map((ie) => t("span", null, ie)))
              )
            );
          })) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Fn }, ge.length ? `Approve ${ge.length} selected` : "Skip all comments"), ge.length ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: an }, "Skip all") : null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Pe, "Fix approval") }, "Request different fixes"))
        ) : null,
        Ne ? t(
          "section",
          { class: "forge-v3-ds forge-v3-split-approval" },
          t("div", { class: "forge-v3-ds-label" }, "Split approval"),
          t("p", null, Ct.summary),
          xn.length ? t("div", { class: "forge-v3-split-stack" }, xn.map((i, _) => t("div", { class: "forge-v3-split-row", key: `${i.branch}-${_}` }, t("span", null, String(_ + 1)), t("strong", null, i.title ?? i.branch ?? `PR ${_ + 1}`), t("small", null, i.summary ?? i.branch ?? "pending branch")))) : null,
          Ct.markdown ? t(
            "details",
            { class: "forge-v3-split-plan-preview" },
            t("summary", null, "Full split plan"),
            t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Ke(Ct.markdown) } })
          ) : null,
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Ne.id, "approved") }, "Approve split plan"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Ne, "Split plan") }, "Request split changes"))
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, "Info"),
          t(
            "div",
            { class: "forge-v3-info-grid" },
            t("div", { class: "forge-v3-ig-label" }, "Source"),
            t("div", { class: "forge-v3-ig-value" }, o != null && o.linear_id ? t("a", { href: `https://linear.app/issue/${o.linear_id}`, target: "_blank", rel: "noreferrer" }, o.linear_id, " ↗") : `Issue #${e}`),
            t("div", { class: "forge-v3-ig-label" }, "Priority"),
            t("div", { class: `forge-v3-ig-value ${Cn(o == null ? void 0 : o.priority)}` }, vr),
            t("div", { class: "forge-v3-ig-label" }, "Branch"),
            t("div", { class: "forge-v3-ig-value forge-v3-copyable" }, (o == null ? void 0 : o.branch) ?? "—", o != null && o.branch ? t("button", { type: "button", class: "forge-v3-copy-btn", title: "Copy branch name", "aria-label": "Copy branch name", onClick: () => {
              var i;
              (i = navigator.clipboard) == null || i.writeText(o.branch).catch(() => {
              });
            } }, "📋") : null),
            t("div", { class: "forge-v3-ig-label" }, "Worktree"),
            t("div", { class: "forge-v3-ig-value forge-v3-copyable" }, (o == null ? void 0 : o.wt_path) ?? "—", o != null && o.wt_path ? t("span", { class: "forge-v3-copy-btns" }, t("button", { type: "button", class: "forge-v3-copy-btn", title: "Copy path", "aria-label": "Copy worktree path", onClick: () => {
              var i;
              (i = navigator.clipboard) == null || i.writeText(o.wt_path).catch(() => {
              });
            } }, "📋"), t("button", { type: "button", class: "forge-v3-copy-btn", title: "Copy cd command", "aria-label": "Copy cd command", onClick: () => {
              var i;
              (i = navigator.clipboard) == null || i.writeText(`cd ${o.wt_path}`).catch(() => {
              });
            } }, "cd")) : null),
            t("div", { class: "forge-v3-ig-label" }, "Added"),
            t("div", { class: "forge-v3-ig-value" }, o != null && o.created_at ? `${be(o.created_at)} ago` : "—"),
            t("div", { class: "forge-v3-ig-label" }, "Model"),
            t("div", { class: "forge-v3-ig-value" }, "configured in settings")
          )
        ),
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "PR Stack"), t("button", { type: "button", class: "forge-v3-col-head-btn", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? h(o.id) : void 0 }, "↻ Sync from GitHub")),
          t(
            "div",
            { class: "forge-v3-pr-stack-list" },
            Nt.length ? Nt.map((i, _) => {
              const I = i.pr_number, N = i.url ?? null, O = i.branch ?? i.gt_branch ?? "pending", B = Number(i.checksFailed ?? 0) > 0 ? "bad" : Number(i.checksPending ?? 0) > 0 ? "pending" : "ok";
              return t(
                "div",
                { class: "forge-v3-pr-row", key: `${O}-${I ?? _}` },
                t("span", { class: "forge-v3-pr-pos" }, String(_ + 1)),
                t("span", { class: "forge-v3-pr-branch" }, O),
                N ? t("a", { class: "forge-v3-pr-badge", href: N, target: "_blank", rel: "noreferrer" }, `#${I} ↗`) : t("span", { class: "forge-v3-pr-badge" }, "no PR"),
                t("span", { class: `forge-v3-ci-badge ${i.isInMergeQueue ? "merge-queue" : ""}` }, i.isInMergeQueue ? "MERGE QUEUE" : i.liveState ?? i.status ?? "unknown"),
                i.isInMergeQueue ? t("span", { class: "forge-v3-pr-meta-badge merge-queue" }, i.mergeQueuePosition ? `Queue #${i.mergeQueuePosition}` : "Queued") : null,
                i.reviewDecision ? t("span", { class: "forge-v3-pr-meta-badge" }, i.reviewDecision) : null,
                i.mergeable ? t("span", { class: "forge-v3-pr-meta-badge" }, i.mergeable) : null,
                i.checksTotal != null ? t("span", { class: `forge-v3-pr-meta-badge checks-${B}` }, `${i.checksFailed ?? 0} failed · ${i.checksPending ?? 0} pending · ${i.checksTotal ?? 0} checks`) : null
              );
            }) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "Auto-fix"), t("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Pt, disabled: !(o != null && o.id), onChange: (i) => Cr(i.target.checked) }), t("span", null))),
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "👤 Externally managed"), t("p", null, "Mark this issue as managed outside Forge (e.g. Cursor). Forge will not schedule agents for it while this is enabled.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Yt, disabled: !(o != null && o.id), onChange: (i) => Lr(i.target.checked) }), t("span", null))),
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "👀 Awaiting review"), t("p", null, "Flag this issue as waiting for a reviewer. Auto-set by Forge when CI passes, all comments are addressed, and no approvals exist yet.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Zt, disabled: !(o != null && o.id), onChange: (i) => Gr(i.target.checked) }), t("span", null)))
        )
      ),
      y === "activity" && ti(v, ut),
      y === "ask" && t(
        "div",
        { class: "forge-v3-ask-panel" },
        t(
          "section",
          { class: "forge-v3-ds forge-v3-ask-intro" },
          t("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          t("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          t("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((i) => t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => rn(i) }, i)))
        ),
        t(
          "section",
          { class: "forge-v3-ask-thread", ref: (i) => {
            i && (i.scrollTop = i.scrollHeight);
          } },
          R.length || W === "thinking" || j ? [
            ...R.filter((i) => i.role === "user" || i.text.trim()).map((i, _) => t(
              "div",
              { key: `${_}-${i.role}`, class: `forge-v3-ask-msg ${i.role}` },
              t("span", null, i.role === "user" ? "You" : "Forge"),
              t("pre", null, i.text)
            )),
            W === "thinking" ? t("div", { class: "forge-v3-ask-thinking", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Thinking"), t("i", null, "."), t("i", null, "."), t("i", null, ".")) : null,
            j ? t("div", { class: "forge-v3-ask-current-status" }, j) : null
          ] : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        t(
          "section",
          { class: "forge-v3-ask-compose" },
          t("textarea", { rows: 3, placeholder: "Ask about this issue…", value: Fe, onInput: (i) => rn(i.target.value), onKeyDown: (i) => {
            (i.metaKey || i.ctrlKey) && i.key === "Enter" && Vn();
          } }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !Fe.trim() || W === "thinking", onClick: Vn }, W === "thinking" ? "Asking…" : "Ask"),
            W === "thinking" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => {
              var i;
              (i = ue.current) == null || i.abort(), M(""), J("");
            } }, "Stop") : null,
            t("span", { class: "forge-v3-ask-hint" }, "⌘/Ctrl + Enter")
          )
        )
      )
    ),
    L ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Plan review" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, Rt ? "Plan + handoff · " : "Plan review · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? Ar.label)),
          t("button", { type: "button", onClick: () => k(!1), "aria-label": "Close plan modal" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-md-viewer forge-v3-doc-stack" },
          t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Plan"),
            t("div", { dangerouslySetInnerHTML: { __html: Ke(_r) } })
          ),
          Rt ? t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Handoff"),
            t("div", { dangerouslySetInnerHTML: { __html: Ke(mr) } })
          ) : null
        ),
        t(
          "footer",
          null,
          t("textarea", { placeholder: "Feedback for requested changes…", rows: 3, value: et, onInput: (i) => st(i.target.value) }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            Ue ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: On }, "✓ Approve plan") : null,
            Ue ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => et.trim() ? Ae(Ue.id, "rejected", { reason: et.trim() }) : je(Ue, "Plan review") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => k(!1) }, "Close")
          )
        )
      )
    ) : null,
    me ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Live agent output" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-live-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Live · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? "Live agent output")),
          t("button", { type: "button", onClick: () => Oe(!1), "aria-label": "Close live output" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-live-output", ref: (i) => {
            i && (i.scrollTop = i.scrollHeight);
          } },
          t("div", { class: "forge-v3-live-output-status" }, t("span", { class: "forge-v3-live-dot", "aria-hidden": "true" }), E),
          t(
            "div",
            { class: "forge-v3-live-feed forge-v3-af-feed" },
            oe.length ? oe.map((i, _) => {
              const I = i.kind === "thinking_delta" || i.kind === "thinking", N = i.kind === "error" ? "err" : i.kind === "tool" ? "ok" : I ? "me" : "live", O = i.kind === "tool" ? "tool" : I ? "thinking" : i.kind === "prompt" ? "prompt" : i.kind === "error" ? "error" : "assistant";
              return t(
                "div",
                { key: `${_}-${i.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${i.kind}` },
                t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${N}` }), _ < oe.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
                t(
                  "div",
                  { class: "forge-v3-af-content" },
                  t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${N === "me" ? "me" : "ag"}` }, O), t("span", { class: "forge-v3-af-time" }, `#${_ + 1}`)),
                  t("pre", { class: "forge-v3-af-snippet forge-v3-live-snippet" }, i.text)
                )
              );
            }) : t("p", { class: "forge-v3-empty" }, "Waiting for agent output…")
          )
        )
      )
    ) : null,
    G ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": S ? "Code review sidecar" : "Diff viewer" },
      t(
        "section",
        { class: `forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-diff-sidecar ${S ? "forge-v3-code-review-sidecar" : ""}` },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, S ? "Code review · " : "Diff · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? "Diff")),
          t("button", { type: "button", onClick: () => x(!1), "aria-label": "Close diff" }, "×")
        ),
        S ? t(
          "section",
          { class: "forge-v3-review-tour" },
          t(
            "div",
            null,
            t("strong", null, "AI tour"),
            t("p", null, ((Jn = T == null ? void 0 : T.tour) == null ? void 0 : Jn.summary) ?? ce ?? "Tour summary unavailable")
          ),
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => $r(!!(T != null && T.tour)) }, T != null && T.tour ? "Regenerate tour" : "Generate tour"),
          (Yn = (zn = T == null ? void 0 : T.tour) == null ? void 0 : zn.highlights) != null && Yn.length ? t("ul", null, T.tour.highlights.map((i) => t("li", null, typeof i == "string" ? i : [i.title ? t("b", null, i.title, ": ") : null, i.text ?? i.file ?? "Highlight", i.file ? ` (${i.file}${i.line ? `:${i.line}` : ""})` : ""]))) : null
        ) : null,
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-diff-review" },
          q === "Loading diff…" ? t("div", { class: "forge-v3-diff-loading", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Loading diff…")) : q ? t("p", { class: "forge-v3-empty forge-v3-diff-error" }, q) : St.length === 0 ? t("p", { class: "forge-v3-empty" }, "No diff available.") : [
            t(
              "aside",
              { class: "forge-v3-diff-file-list", "aria-label": "Changed files" },
              t("div", { class: "forge-v3-diff-side-label" }, "Files"),
              St.map((i) => t(
                "button",
                { key: i.path, type: "button", class: (fe == null ? void 0 : fe.path) === i.path ? "active" : "", title: i.path, onClick: () => w(i.path) },
                t("span", null, S ? t("span", { class: "forge-v3-reviewed-file" }, t("input", { type: "checkbox", checked: ke.includes(i.path), onClick: (_) => _.stopPropagation(), onChange: () => Dn(i.path) }), Pa(i.path)) : Pa(i.path)),
                t("small", { class: "forge-v3-diff-file-counts" }, t("span", { class: "add" }, `+${i.additions}`), " ", t("span", { class: "del" }, `−${i.deletions}`), Ie.some((_) => _.file === i.path) ? " · comments" : "")
              ))
            ),
            t(
              "section",
              { class: "forge-v3-diff-main" },
              fe ? t(
                "article",
                { class: "forge-v3-diff-file" },
                t("header", null, t("strong", { title: fe.path }, fe.path), t("span", null, `+${fe.additions} −${fe.deletions}`), S ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Dn(fe.path) }, ke.includes(fe.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                t(
                  "div",
                  { class: "forge-v3-diff-table-wrap" },
                  t(
                    "table",
                    { class: "forge-v3-diff-table" },
                    t("tbody", null, fe.hunks.map((i, _) => t(
                      "tr",
                      { key: `${_}-${i.slice(0, 12)}`, class: `forge-v3-diff-line ${Jo(i)}` },
                      t("td", { class: "forge-v3-diff-ln" }, S ? t("button", { type: "button", title: "Add line comment", onClick: () => nn(fe.path, _ + 1) }, String(_ + 1)) : String(_ + 1)),
                      t("td", { class: "forge-v3-diff-sign" }, zo(i)),
                      t("td", { class: "forge-v3-diff-content" }, t("code", null, i.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                S ? t("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => nn(fe.path, null) }, "+ Add file comment") : null
              ) : null
            )
          ]
        ),
        t(
          "footer",
          null,
          S ? t(
            "div",
            { class: "forge-v3-review-feedback" },
            t("label", null, "General feedback for the agent"),
            t("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: xe, onInput: (i) => pe(i.target.value) }),
            Ie.length ? t("div", { class: "forge-v3-review-comments" }, Ie.map((i) => t("span", { key: i.id }, `${i.file}${i.line ? `:${i.line}` : ""} — ${i.body}`))) : null
          ) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            S && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Un("approved") }, "✓ Approve code") : null,
            S && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Un("rejected") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => x(!1) }, "Close")
          )
        )
      )
    ) : null,
    De ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Jump to workflow state" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-jump-state-modal" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Admin recovery · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, "Jump to state")),
          t("button", { type: "button", onClick: () => ve(!1), "aria-label": "Close jump to state" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body" },
          t("p", { class: "forge-v3-jump-state-copy" }, "Move this issue to a selected workflow phase, or return it to Linear by fully clearing Forge tracking."),
          t(
            "div",
            { class: "forge-v3-jump-state-list" },
            Er.map((i) => t(
              "button",
              { key: i.state, type: "button", class: `forge-v3-jump-state-option ${i.risky ? "risky" : ""} ${i.destructive ? "destructive" : ""}`, onClick: () => Pr(i) },
              t("strong", null, i.label),
              t("code", null, i.state),
              t("span", null, i.hint),
              i.risky ? t("em", null, "Requires confirmation") : null
            ))
          )
        ),
        t("footer", null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => ve(!1) }, "Cancel"))
      )
    ) : null,
    t(
      "div",
      { class: "forge-v3-detail-bottom" },
      t(
        "section",
        { class: "forge-v3-ds forge-v3-admin-zone forge-v3-danger-zone" },
        t(
          "details",
          { class: "forge-v3-danger-accordion" },
          t("summary", null, t("span", null, "Admin & runtime"), t("span", { class: "forge-v3-danger-chevron" }, "›")),
          t("p", null, "Operational recovery controls. Destructive actions require typed confirmation."),
          lt ? t("div", { class: `forge-v3-admin-status ${lt.includes("failed") ? "failed" : ""}` }, lt) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Tr }, "Launch runtime"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: d }, "Stop VM runtime"),
            o != null && o.steering_context ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: wr }, "Clear steering") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => o != null && o.id ? c(o.id, "ignore") : void 0 }, "Ignore"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: Rr }, "Full reset"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || _e(ut), onClick: Sr }, "Remove issue")
          )
        )
      )
    )
  );
}
const fr = "forge.v3.detailPanelWidth", Ga = 500, qi = 440, Bi = 760;
function pr(e) {
  return Math.min(Bi, Math.max(qi, Math.round(e)));
}
function ji() {
  const e = window.localStorage.getItem(fr), n = e ? Number(e) : Ga;
  return Number.isFinite(n) ? pr(n) : Ga;
}
function Xi() {
  var Fe;
  const e = jt(), [n, a] = A(ya), [r, s] = A({ issues: [], decisions: [], runningAgents: [] }), [l, c] = A([]), [g, f] = A(e.view === "queue" ? e.issueId : null), [d, h] = A(0), [b, u] = A(e.view), [y, p] = A(!1), [v, P] = A(""), [L, k] = A(null), G = qe(/* @__PURE__ */ new Map()), [x, D] = A(0), [H, q] = A(e.addIssue), [Z, Y] = A(!1), [F, w] = A(ji), [S, V] = A("connecting"), [T, ae] = A(!1), [ce, de] = A(() => Ei()), ke = qe(!1), Ee = qe(/* @__PURE__ */ new Set()), Ie = qe(g), Ge = qe({ issues: [], decisions: [], runningAgents: [] }), xe = (m, R) => {
    if (!R) return "";
    const C = m.issues.find((M) => M.id === R), W = m.decisions.filter((M) => M.issue_id === R).map((M) => [M.id, M.type, M.created_at, M.resolved_at, M.artifact_ref].join(":")).sort().join(",");
    return `${(C == null ? void 0 : C.state) ?? ""}|${(C == null ? void 0 : C.updated_at) ?? ""}|${W}`;
  }, pe = (m = !1) => {
    const R = [
      le("/api/overview"),
      le("/api/settings"),
      m ? le("/api/archive").catch(() => []) : Promise.resolve([])
    ];
    return Promise.all(R).then(([C, W, M]) => {
      const j = pi(C), J = G.current;
      for (const o of j.issues) {
        const X = J.get(o.id);
        X && X !== "DONE" && o.state === "DONE" && (k(o), setTimeout(() => k(null), 6e3)), J.set(o.id, o.state ?? "");
      }
      Ge.current = j, s(j);
      const ue = m ? M.length : n.archiveCount;
      return a({ ...Ni(j, W), archiveCount: ue }), j.decisions.forEach((o) => {
        Ee.current.has(o.id) || (Ee.current.add(o.id), Pi(o, j.issues.find((X) => X.id === o.issue_id), ke.current).catch(() => {
        }));
      }), j;
    });
  }, ge = qe(/* @__PURE__ */ (() => {
    let m = null;
    return () => {
      m && clearTimeout(m), m = setTimeout(() => pe(), 300);
    };
  })()), ee = (m, R) => {
    P(`${m}…`), R().then(() => pe()).then(() => {
      D((C) => C + 1), P(`${m} complete`);
    }).catch((C) => {
      P(`${m} failed`);
      const W = C instanceof Error ? C.message : String(C);
      Ri({ title: `${m} failed`, message: W });
    });
  }, $e = (m, R, C) => {
    const W = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" }
    };
    s((M) => {
      var ue;
      const j = M.decisions.find((o) => o.id === m), J = j != null && j.type ? (ue = W[R]) == null ? void 0 : ue[j.type] : void 0;
      return {
        ...M,
        decisions: M.decisions.filter((o) => o.id !== m),
        issues: J && j ? M.issues.map((o) => o.id === j.issue_id ? { ...o, state: J } : o) : M.issues
      };
    }), ee(
      R === "approved" ? "Decision approved" : "Decision changes requested",
      () => vi(m, R, C).catch((M) => {
        const j = M instanceof Error ? M.message : String(M);
        if (!(j.includes("409") || j.toLowerCase().includes("already resolved")))
          throw s((J) => ({
            ...J,
            decisions: J.decisions.some((ue) => ue.id === m) ? J.decisions : [...J.decisions, { id: m }]
          })), M;
      })
    );
  }, We = (m, R, C) => ee(`Issue ${R}`, () => _i(m, R, C)), De = (m) => ee("Issue removed", () => mi(m).then(() => oe())), ve = (m) => hi(m), me = async () => {
    await bt({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: !0 }) && ee("VM runtime stopped", () => bi());
  }, Oe = (m) => ee("PR stack synced", () => yi(m)), E = (m, R, C) => ee("PR feedback added", () => ki(m, R, C)), U = (m) => {
    f(m), u("queue"), window.requestAnimationFrame(() => rt("queue", { issueId: m }));
  }, oe = () => {
    f(null), rt("queue");
  }, te = (m, R) => {
    f(m), u("queue"), h((C) => C + 1), rt("queue", { issueId: m });
  }, et = () => {
    const m = fi(r.decisions, r.issues);
    m && te(m.issue_id, m.id);
  }, st = () => {
    u("queue"), q(!0), Xt({ view: "queue", add: "issue" }, !1);
  }, lt = () => {
    q(!1), Xt({ add: null });
  }, tt = () => ee("Linear backlog refreshed", () => le("/api/linear/issues").then((m) => c(Array.isArray(m) ? m : []))), Pt = (m, R = "", C) => ee("Manual issue created", () => Ii(m, R, C).then((W) => {
    W.issueId && U(W.issueId);
  })), nt = (m, R = "", C) => ee(`Enqueued ${m}`, () => Ai(m, R, C).then((W) => {
    W.issueId && U(W.issueId);
  }).then(() => le("/api/linear/issues")).then((W) => c(Array.isArray(W) ? W : []))), Yt = () => {
    if (T) {
      P("Sending desktop companion notification…"), cr("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test").then(() => P("Desktop companion notification sent")).catch(() => P("Desktop companion notification failed"));
      return;
    }
    if (!Ln()) {
      de("unsupported");
      return;
    }
    window.Notification.requestPermission().then((m) => de(m));
  }, ct = (m) => {
    u(m), f(null), rt(m);
  }, Zt = (m) => {
    m.preventDefault(), document.body.classList.add("forge-v3-resizing-detail");
    const R = (W) => w(pr(window.innerWidth - W.clientX)), C = () => {
      document.body.classList.remove("forge-v3-resizing-detail"), window.removeEventListener("pointermove", R), window.removeEventListener("pointerup", C), window.removeEventListener("pointercancel", C);
    };
    window.addEventListener("pointermove", R), window.addEventListener("pointerup", C), window.addEventListener("pointercancel", C);
  };
  K(() => {
    document.documentElement.style.setProperty("--panel-w", `${F}px`), window.localStorage.setItem(fr, String(F));
  }, [F]), K(() => {
    Ie.current = g;
  }, [g]), K(() => {
    if (!v || v.endsWith("…")) return;
    const m = window.setTimeout(() => P(""), 3500);
    return () => window.clearTimeout(m);
  }, [v]), K(() => {
    let m = !1;
    return wi().then((R) => {
      if (m) return;
      const C = !!R.notifications;
      ke.current = C, ae(C);
    }).catch(() => {
      m || (ke.current = !1, ae(!1));
    }), () => {
      m = !0;
    };
  }, []), K(() => {
    const m = (R) => {
      (R.metaKey || R.ctrlKey) && R.key.toLowerCase() === "k" && (R.preventDefault(), p((C) => !C)), R.key === "Escape" && p(!1);
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, []), K(() => {
    const m = () => {
      const R = jt();
      u(R.view), f(R.issueId), q(R.addIssue), (R.decisionId || R.panel === "review") && h((C) => C + 1);
    };
    return window.addEventListener("hashchange", m), window.addEventListener("popstate", m), () => {
      window.removeEventListener("hashchange", m), window.removeEventListener("popstate", m);
    };
  }, []), K(() => {
    let m = !1;
    const R = () => {
      pe(!0).catch(() => {
        m || a(ya);
      });
    };
    R(), le("/api/linear/issues").then((W) => {
      m || c(Array.isArray(W) ? W : []);
    }).catch(() => {
    });
    const C = window.setInterval(R, S === "offline" ? 1e4 : 3e4);
    return () => {
      m = !0, window.clearInterval(C);
    };
  }, [S]), K(() => {
    if (Je()) return;
    let m = !1;
    const R = new EventSource("/api/events"), C = (W) => {
      const M = W.type === "issue_updated" || W.type === "issue_removed", j = Ie.current, J = xe(Ge.current, j);
      if (W.type === "tick") {
        ge.current();
        return;
      }
      pe(M).then((ue) => {
        j && xe(ue, j) !== J && D((o) => o + 1);
      }).catch(() => {
      });
    };
    return R.onopen = () => {
      m || V("live");
    }, R.onerror = () => {
      m || V("offline");
    }, ["tick", "issue_added", "issue_removed", "issue_updated", "decision_resolved"].forEach((W) => {
      R.addEventListener(W, C);
    }), () => {
      m = !0, R.close();
    };
  }, []);
  const dt = g ? r.issues.find((m) => m.id === g) ?? null : null;
  return t(
    "div",
    { class: "forge-v3-shell forge-v3-app-frame", "data-forge-v3-shell": "true" },
    t(
      "aside",
      { class: "forge-v3-sidebar", "aria-label": "Forge navigation" },
      t(
        "div",
        { class: "forge-v3-brand" },
        t("span", { class: "forge-v3-brand-mark", "aria-hidden": "true" }, "⚒️"),
        t("span", { class: "forge-v3-brand-text" }, "Forge"),
        t("span", { class: "forge-v3-brand-version" }, "v3.0")
      ),
      t(
        "nav",
        { class: "forge-v3-nav", "aria-label": "Primary dashboard views" },
        kt.slice(0, 2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              u(m.key), f(null), rt(m.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, m.icon),
            t("span", { class: "forge-v3-nav-label" }, m.label),
            m.key === "queue" && n.awaitingDecisionsCount > 0 ? t("span", { class: "forge-v3-nav-badge", "aria-label": `${n.awaitingDecisionsCount} pending decisions` }, String(n.awaitingDecisionsCount)) : m.key === "archive" ? t("span", { class: "forge-v3-nav-count" }, String(n.archiveCount)) : null
          )
        ),
        t("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => p(!0) }, t("span", { class: "forge-v3-nav-icon" }, "⌘"), t("span", { class: "forge-v3-nav-label" }, "Command palette"), t("kbd", null, "⌘K")),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => Y(!0) }, t("span", { class: "forge-v3-nav-icon" }, "📋"), t("span", { class: "forge-v3-nav-label" }, "Handover report")),
        kt.slice(2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              u(m.key), f(null), rt(m.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, m.icon),
            t("span", { class: "forge-v3-nav-label" }, m.label),
            m.key === "learnings" && n.learningSuggestionsCount > 0 ? t("span", { class: "forge-v3-nav-count" }, String(n.learningSuggestionsCount)) : null
          )
        )
      ),
      t(
        "footer",
        { class: "forge-v3-status", "aria-label": "Forge status" },
        t("div", { class: "forge-v3-runtime-line" }, t("span", null, t("i", { class: `forge-v3-status-dot scheduler-${n.scheduler}`, "aria-hidden": "true" }), " Scheduler ", n.scheduler)),
        t(
          "div",
          { class: "forge-v3-concurrency-wrap" },
          t(
            "div",
            { class: "forge-v3-concurrency-pips", "aria-label": `${n.runningAgentsCount} of ${n.concurrencyLimit} agent slots active` },
            Array.from({ length: Math.max(n.concurrencyLimit, n.runningAgentsCount) }).slice(0, 8).map((m, R) => t("span", { class: R < n.runningAgentsCount ? "active" : "" }))
          ),
          t("span", null, n.runningAgentsCount, " / ", n.concurrencyLimit, " agent slots")
        ),
        t(
          "div",
          { class: "forge-v3-sidebar-stats" },
          t("div", null, t("strong", null, String(n.activeCount)), t("span", null, "ACTIVE")),
          t("div", null, t("strong", null, String(n.awaitingDecisionsCount)), t("span", null, "NEEDS YOU")),
          t("div", null, t("strong", null, String(n.doneThisWeekCount)), t("span", null, "DONE WK")),
          t("div", null, t("strong", null, String(n.failedCount)), t("span", null, "FAILED"))
        ),
        t("div", { class: `forge-v3-session-chip event-${S}` }, S === "live" ? "● Live events" : S === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        t("button", { type: "button", class: `forge-v3-notification-toggle ${T ? "desktop" : "browser"}`, disabled: !T && (ce === "unsupported" || ce === "denied" || ce === "granted"), onClick: Yt }, T ? "🔔 Desktop companion" : ce === "granted" ? "🔔 Browser notifications on" : ce === "denied" ? "🔕 Notifications blocked" : ce === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        t("div", { class: "forge-v3-session-chip" }, T ? "● Native notifications available" : "○ Browser notification fallback"),
        t("div", { class: "forge-v3-session-chip" }, "● Workspace · ", n.model),
        t("div", { class: "forge-v3-model-row" }, "🤖 ", n.backend)
      )
    ),
    v ? t("div", { class: "forge-v3-action-status", role: "status" }, v) : null,
    L ? t("div", { class: "forge-v3-celebration", role: "status" }, t("strong", null, "🎉 ", L.linear_id ?? `Issue #${L.id}`, " completed!"), t("small", null, L.title ?? "Issue merged and archived")) : null,
    b === "queue" ? t(Gi, { issues: r.issues, decisions: r.decisions, linearBacklog: l, selectedIssueId: g, addIssueOpen: H, onOpenIssue: U, onIssueAction: We, onResolveDecision: $e, onReviewNext: et, onReviewIssue: te, onAddIssue: st, onCloseAddIssue: lt, onRefreshLinear: tt, onCreateManualIssue: Pt, onEnqueueLinear: nt }) : b === "archive" ? t(Vi, null) : b === "settings" ? t(Wi, null) : b === "prompts" ? t(Oi, null) : b === "learnings" ? t(Di, null) : t("main", { class: "forge-v3-main", "data-active-view": b }, t("h1", null, ((Fe = kt.find((m) => m.key === b)) == null ? void 0 : Fe.label) ?? "Dashboard"), t("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    t(Hi, { issueId: b === "queue" ? g : null, issuePreview: dt, reloadKey: x, autoOpenDiffKey: d, onClose: oe, onPanelResizeStart: Zt, onIssueAction: We, onRemoveIssue: De, onLaunchRuntime: ve, onStopVm: me, onSyncPrs: Oe, onSubmitFeedback: E, onResolveDecision: $e }),
    t(Li, { open: y, decisions: r.decisions, onClose: () => p(!1), onNavigate: ct, onRefresh: () => pe(), onOpenIssue: U, onReviewNext: et, onAddIssue: st, onStopVm: me, onHandoverReport: () => Y(!0) }),
    Z ? t(ur, { onClose: () => Y(!1) }) : null,
    n.runningAgentsCount > 0 ? t(Ci, { status: n, onStopVm: me }) : null
  );
}
(function() {
  let n = !1;
  fetch("/api/desktop/open-url", { method: "OPTIONS" }).then((a) => {
    n = a.status !== 404;
  }).catch(() => {
  }), fetch("/api/desktop-capabilities").then((a) => a.json()).then((a) => {
    a != null && a.notifications && (n = !0);
  }).catch(() => {
  }), document.addEventListener("click", (a) => {
    if (!n) return;
    const r = a.composedPath().find((l) => l instanceof HTMLAnchorElement && l.hasAttribute("href"));
    if (!r) return;
    const s = r.href;
    if (!(!s || !s.startsWith("https://") && !s.startsWith("http://"))) {
      try {
        if (new URL(s).origin === window.location.origin) return;
      } catch {
        return;
      }
      a.preventDefault(), a.stopPropagation(), fetch("/api/desktop/open-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: s })
      }).catch(() => {
        window.open(s, "_blank");
      });
    }
  }, !0);
})();
const gn = document.getElementById("forge-react-root");
gn && (Qe(t(Xi, null), gn), gn.dataset.reactiveDashboardMounted = "true");
