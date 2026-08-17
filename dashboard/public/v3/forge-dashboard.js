var jt, x, wa, Ve, qn, Pa, Ea, en, Lt, ht, Na, mn, cn, dn, Dt = {}, Ot = [], Ar = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, yt = Array.isArray;
function xe(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function hn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function t(e, n, a) {
  var r, s, l, c = {};
  for (l in n) l == "key" ? r = n[l] : l == "ref" ? s = n[l] : c[l] = n[l];
  if (arguments.length > 2 && (c.children = arguments.length > 3 ? jt.call(arguments, 2) : a), typeof e == "function" && e.defaultProps != null) for (l in e.defaultProps) c[l] === void 0 && (c[l] = e.defaultProps[l]);
  return Gt(e, c, r, s, null);
}
function Gt(e, n, a, r, s) {
  var l = { type: e, props: n, key: a, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: s ?? ++wa, __i: -1, __u: 0 };
  return s == null && x.vnode != null && x.vnode(l), l;
}
function it(e) {
  return e.children;
}
function $e(e, n) {
  this.props = e, this.context = n;
}
function st(e, n) {
  if (n == null) return e.__ ? st(e.__, e.__i + 1) : null;
  for (var a; n < e.__k.length; n++) if ((a = e.__k[n]) != null && a.__e != null) return a.__e;
  return typeof e.type == "function" ? st(e) : null;
}
function wr(e) {
  if (e.__P && e.__d) {
    var n = e.__v, a = n.__e, r = [], s = [], l = xe({}, n);
    l.__v = n.__v + 1, x.vnode && x.vnode(l), bn(e.__P, l, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [a] : null, r, a ?? st(n), !!(32 & n.__u), s), l.__v = n.__v, l.__.__k[l.__i] = l, La(r, l, s), n.__e = n.__ = null, l.__e != a && Ra(l);
  }
}
function Ra(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(n) {
    if (n != null && n.__e != null) return e.__e = e.__c.base = n.__e;
  }), Ra(e);
}
function Bn(e) {
  (!e.__d && (e.__d = !0) && Ve.push(e) && !Ft.__r++ || qn != x.debounceRendering) && ((qn = x.debounceRendering) || Pa)(Ft);
}
function Ft() {
  try {
    for (var e, n = 1; Ve.length; ) Ve.length > n && Ve.sort(Ea), e = Ve.shift(), n = Ve.length, wr(e);
  } finally {
    Ve.length = Ft.__r = 0;
  }
}
function Sa(e, n, a, r, s, l, c, g, u, d, h) {
  var b, f, k, p, v, I, T, P = r && r.__k || Ot, L = n.length;
  for (u = Pr(a, n, P, u, L), b = 0; b < L; b++) (k = a.__k[b]) != null && (f = k.__i != -1 && P[k.__i] || Dt, k.__i = b, I = bn(e, k, f, s, l, c, g, u, d, h), p = k.__e, k.ref && f.ref != k.ref && (f.ref && kn(f.ref, null, k), h.push(k.ref, k.__c || p, k)), v == null && p != null && (v = p), (T = !!(4 & k.__u)) || f.__k === k.__k ? (u = Ta(k, u, e, T), T && f.__e && (f.__e = null)) : typeof k.type == "function" && I !== void 0 ? u = I : p && (u = p.nextSibling), k.__u &= -7);
  return a.__e = v, u;
}
function Pr(e, n, a, r, s) {
  var l, c, g, u, d, h = a.length, b = h, f = 0;
  for (e.__k = new Array(s), l = 0; l < s; l++) (c = n[l]) != null && typeof c != "boolean" && typeof c != "function" ? (typeof c == "string" || typeof c == "number" || typeof c == "bigint" || c.constructor == String ? c = e.__k[l] = Gt(null, c, null, null, null) : yt(c) ? c = e.__k[l] = Gt(it, { children: c }, null, null, null) : c.constructor === void 0 && c.__b > 0 ? c = e.__k[l] = Gt(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v) : e.__k[l] = c, u = l + f, c.__ = e, c.__b = e.__b + 1, g = null, (d = c.__i = Er(c, a, u, b)) != -1 && (b--, (g = a[d]) && (g.__u |= 2)), g == null || g.__v == null ? (d == -1 && (s > h ? f-- : s < h && f++), typeof c.type != "function" && (c.__u |= 4)) : d != u && (d == u - 1 ? f-- : d == u + 1 ? f++ : (d > u ? f-- : f++, c.__u |= 4))) : e.__k[l] = null;
  if (b) for (l = 0; l < h; l++) (g = a[l]) != null && (2 & g.__u) == 0 && (g.__e == r && (r = st(g)), xa(g, g));
  return r;
}
function Ta(e, n, a, r) {
  var s, l;
  if (typeof e.type == "function") {
    for (s = e.__k, l = 0; s && l < s.length; l++) s[l] && (s[l].__ = e, n = Ta(s[l], n, a, r));
    return n;
  }
  e.__e != n && (r && (n && e.type && !n.parentNode && (n = st(e)), a.insertBefore(e.__e, n || null)), n = e.__e);
  do
    n = n && n.nextSibling;
  while (n != null && n.nodeType == 8);
  return n;
}
function Vt(e, n) {
  return n = n || [], e == null || typeof e == "boolean" || (yt(e) ? e.some(function(a) {
    Vt(a, n);
  }) : n.push(e)), n;
}
function Er(e, n, a, r) {
  var s, l, c, g = e.key, u = e.type, d = n[a], h = d != null && (2 & d.__u) == 0;
  if (d === null && g == null || h && g == d.key && u == d.type) return a;
  if (r > (h ? 1 : 0)) {
    for (s = a - 1, l = a + 1; s >= 0 || l < n.length; ) if ((d = n[c = s >= 0 ? s-- : l++]) != null && (2 & d.__u) == 0 && g == d.key && u == d.type) return c;
  }
  return -1;
}
function jn(e, n, a) {
  n[0] == "-" ? e.setProperty(n, a ?? "") : e[n] = a == null ? "" : typeof a != "number" || Ar.test(n) ? a : a + "px";
}
function Tt(e, n, a, r, s) {
  var l, c;
  e: if (n == "style") if (typeof a == "string") e.style.cssText = a;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (n in r) a && n in a || jn(e.style, n, "");
    if (a) for (n in a) r && a[n] == r[n] || jn(e.style, n, a[n]);
  }
  else if (n[0] == "o" && n[1] == "n") l = n != (n = n.replace(Na, "$1")), c = n.toLowerCase(), n = c in e || n == "onFocusOut" || n == "onFocusIn" ? c.slice(2) : n.slice(2), e.l || (e.l = {}), e.l[n + l] = a, a ? r ? a[ht] = r[ht] : (a[ht] = mn, e.addEventListener(n, l ? dn : cn, l)) : e.removeEventListener(n, l ? dn : cn, l);
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
function Xn(e) {
  return function(n) {
    if (this.l) {
      var a = this.l[n.type + e];
      if (n[Lt] == null) n[Lt] = mn++;
      else if (n[Lt] < a[ht]) return;
      return a(x.event ? x.event(n) : n);
    }
  };
}
function bn(e, n, a, r, s, l, c, g, u, d) {
  var h, b, f, k, p, v, I, T, P, L, W, j, Y, X, J, te, $ = n.type;
  if (n.constructor !== void 0) return null;
  128 & a.__u && (u = !!(32 & a.__u), l = [g = n.__e = a.__e]), (h = x.__b) && h(n);
  e: if (typeof $ == "function") {
    b = c.length;
    try {
      if (P = n.props, L = $.prototype && $.prototype.render, W = (h = $.contextType) && r[h.__c], j = h ? W ? W.props.value : h.__ : r, a.__c ? T = (f = n.__c = a.__c).__ = f.__E : (L ? n.__c = f = new $(P, j) : (n.__c = f = new $e(P, j), f.constructor = $, f.render = Rr), W && W.sub(f), f.state || (f.state = {}), f.__n = r, k = f.__d = !0, f.__h = [], f._sb = []), L && f.__s == null && (f.__s = f.state), L && $.getDerivedStateFromProps != null && (f.__s == f.state && (f.__s = xe({}, f.__s)), xe(f.__s, $.getDerivedStateFromProps(P, f.__s))), p = f.props, v = f.state, f.__v = n, k) L && $.getDerivedStateFromProps == null && f.componentWillMount != null && f.componentWillMount(), L && f.componentDidMount != null && f.__h.push(f.componentDidMount);
      else {
        if (L && $.getDerivedStateFromProps == null && P !== p && f.componentWillReceiveProps != null && f.componentWillReceiveProps(P, j), n.__v == a.__v || !f.__e && f.shouldComponentUpdate != null && f.shouldComponentUpdate(P, f.__s, j) === !1) {
          n.__v != a.__v && (f.props = P, f.state = f.__s, f.__d = !1), n.__e = a.__e, n.__k = a.__k, n.__k.some(function(A) {
            A && (A.__ = n);
          }), Ot.push.apply(f.__h, f._sb), f._sb = [], f.__h.length && c.push(f);
          break e;
        }
        f.componentWillUpdate != null && f.componentWillUpdate(P, f.__s, j), L && f.componentDidUpdate != null && f.__h.push(function() {
          f.componentDidUpdate(p, v, I);
        });
      }
      if (f.context = j, f.props = P, f.__P = e, f.__e = !1, Y = x.__r, X = 0, L) f.state = f.__s, f.__d = !1, Y && Y(n), h = f.render(f.props, f.state, f.context), Ot.push.apply(f.__h, f._sb), f._sb = [];
      else do
        f.__d = !1, Y && Y(n), h = f.render(f.props, f.state, f.context), f.state = f.__s;
      while (f.__d && ++X < 25);
      f.state = f.__s, f.getChildContext != null && (r = xe(xe({}, r), f.getChildContext())), L && !k && f.getSnapshotBeforeUpdate != null && (I = f.getSnapshotBeforeUpdate(p, v)), J = h != null && h.type === it && h.key == null ? Ga(h.props.children) : h, g = Sa(e, yt(J) ? J : [J], n, a, r, s, l, c, g, u, d), f.base = n.__e, n.__u &= -161, f.__h.length && c.push(f), T && (f.__E = f.__ = null);
    } catch (A) {
      if (c.length = b, n.__v = null, u || l != null) {
        if (A.then) {
          for (n.__u |= u ? 160 : 128; g && g.nodeType == 8 && g.nextSibling; ) g = g.nextSibling;
          l != null && (l[l.indexOf(g)] = null), n.__e = g;
        } else if (l != null) for (te = l.length; te--; ) hn(l[te]);
      } else n.__e = a.__e;
      n.__k == null && (n.__k = a.__k || []), A.then || Ca(n), x.__e(A, n, a);
    }
  } else l == null && n.__v == a.__v ? (n.__k = a.__k, n.__e = a.__e) : g = n.__e = Nr(a.__e, n, a, r, s, l, c, u, d);
  return (h = x.diffed) && h(n), 128 & n.__u ? void 0 : g;
}
function Ca(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(Ca));
}
function La(e, n, a) {
  for (var r = 0; r < a.length; r++) kn(a[r], a[++r], a[++r]);
  x.__c && x.__c(n, e), e.some(function(s) {
    try {
      e = s.__h, s.__h = [], e.some(function(l) {
        l.call(s);
      });
    } catch (l) {
      x.__e(l, s.__v);
    }
  });
}
function Ga(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : yt(e) ? e.map(Ga) : e.constructor !== void 0 ? null : xe({}, e);
}
function Nr(e, n, a, r, s, l, c, g, u) {
  var d, h, b, f, k, p, v, I = a.props || Dt, T = n.props, P = n.type;
  if (P == "svg" ? s = "http://www.w3.org/2000/svg" : P == "math" ? s = "http://www.w3.org/1998/Math/MathML" : s || (s = "http://www.w3.org/1999/xhtml"), l != null) {
    for (d = 0; d < l.length; d++) if ((k = l[d]) && "setAttribute" in k == !!P && (P ? k.localName == P : k.nodeType == 3)) {
      e = k, l[d] = null;
      break;
    }
  }
  if (e == null) {
    if (P == null) return document.createTextNode(T);
    e = document.createElementNS(s, P, T.is && T), g && (x.__m && x.__m(n, l), g = !1), l = null;
  }
  if (P == null) I === T || g && e.data == T || (e.data = T);
  else {
    if (l = P == "textarea" && T.defaultValue != null ? null : l && jt.call(e.childNodes), !g && l != null) for (I = {}, d = 0; d < e.attributes.length; d++) I[(k = e.attributes[d]).name] = k.value;
    for (d in I) k = I[d], d == "dangerouslySetInnerHTML" ? b = k : d == "children" || d in T || d == "value" && "defaultValue" in T || d == "checked" && "defaultChecked" in T || Tt(e, d, null, k, s);
    for (d in T) k = T[d], d == "children" ? f = k : d == "dangerouslySetInnerHTML" ? h = k : d == "value" ? p = k : d == "checked" ? v = k : g && typeof k != "function" || I[d] === k || Tt(e, d, k, I[d], s);
    if (h) g || b && (h.__html == b.__html || h.__html == e.innerHTML) || (e.innerHTML = h.__html), n.__k = [];
    else if (b && (e.innerHTML = ""), Sa(n.type == "template" ? e.content : e, yt(f) ? f : [f], n, a, r, P == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s, l, c, l ? l[0] : a.__k && st(a, 0), g, u), l != null) for (d = l.length; d--; ) hn(l[d]);
    g && P != "textarea" || (d = "value", P == "progress" && p == null ? e.removeAttribute("value") : p != null && (p !== e[d] || P == "progress" && !p || P == "option" && p != I[d]) && Tt(e, d, p, I[d], s), d = "checked", v != null && v != e[d] && Tt(e, d, v, I[d], s));
  }
  return e;
}
function kn(e, n, a) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && n == null || (e.__u = e(n));
    } else e.current = n;
  } catch (s) {
    x.__e(s, a);
  }
}
function xa(e, n, a) {
  var r, s;
  if (x.unmount && x.unmount(e), (r = e.ref) && (r.current && r.current != e.__e || kn(r, null, n)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (l) {
      x.__e(l, n);
    }
    r.base = r.__P = r.__n = null;
  }
  if (r = e.__k) for (s = 0; s < r.length; s++) r[s] && xa(r[s], n, a || typeof e.type != "function");
  a || hn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function Rr(e, n, a) {
  return this.constructor(e, a);
}
function Qe(e, n, a) {
  var r, s, l, c;
  n == document && (n = document.documentElement), x.__ && x.__(e, n), s = (r = !1) ? null : n.__k, l = [], c = [], bn(n, e = n.__k = t(it, null, [e]), s || Dt, Dt, n.namespaceURI, s ? null : n.firstChild ? jt.call(n.childNodes) : null, l, s ? s.__e : n.firstChild, r, c), La(l, e, c), e.props.children = null;
}
jt = Ot.slice, x = { __e: function(e, n, a, r) {
  for (var s, l, c; n = n.__; ) if ((s = n.__c) && !s.__) try {
    if ((l = s.constructor) && l.getDerivedStateFromError != null && (s.setState(l.getDerivedStateFromError(e)), c = s.__d), s.componentDidCatch != null && (s.componentDidCatch(e, r || {}), c = s.__d), c) return s.__E = s;
  } catch (g) {
    e = g;
  }
  throw e;
} }, wa = 0, $e.prototype.setState = function(e, n) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = xe({}, this.state), typeof e == "function" && (e = e(xe({}, a), this.props)), e && xe(a, e), e != null && this.__v && (n && this._sb.push(n), Bn(this));
}, $e.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), Bn(this));
}, $e.prototype.render = it, Ve = [], Pa = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Ea = function(e, n) {
  return e.__v.__b - n.__v.__b;
}, Ft.__r = 0, en = Math.random().toString(8), Lt = "__d" + en, ht = "__a" + en, Na = /(PointerCapture)$|Capture$/i, mn = 0, cn = Xn(!1), dn = Xn(!0);
var It, Q, tn, Kn, Ut = 0, $a = [], z = x, Qn = z.__b, Jn = z.__r, zn = z.diffed, Yn = z.__c, Zn = z.unmount, ea = z.__;
function In(e, n) {
  z.__h && z.__h(Q, e, Ut || n), Ut = 0;
  var a = Q.__H || (Q.__H = { __: [], __h: [] });
  return e >= a.__.length && a.__.push({}), a.__[e];
}
function w(e) {
  return Ut = 1, Sr(Da, e);
}
function Sr(e, n, a) {
  var r = In(It++, 2);
  if (r.t = e, !r.__c && (r.__ = [a ? a(n) : Da(void 0, n), function(g) {
    var u = r.__N ? r.__N[0] : r.__[0], d = r.t(u, g);
    u !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = Q, !Q.__f)) {
    var s = function(g, u, d) {
      if (!r.__c.__H) return !0;
      var h = !1, b = r.__c.props !== g;
      if (r.__c.__H.__.some(function(k) {
        if (k.__N) {
          h = !0;
          var p = k.__[0];
          k.__ = k.__N, k.__N = void 0, p !== k.__[0] && (b = !0);
        }
      }), l) {
        var f = l.call(this, g, u, d);
        return h ? f || b : f;
      }
      return !h || b;
    };
    Q.__f = !0;
    var l = Q.shouldComponentUpdate, c = Q.componentWillUpdate;
    Q.componentWillUpdate = function(g, u, d) {
      if (this.__e) {
        var h = l;
        l = void 0, s(g, u, d), l = h;
      }
      c && c.call(this, g, u, d);
    }, Q.shouldComponentUpdate = s;
  }
  return r.__N || r.__;
}
function K(e, n) {
  var a = In(It++, 3);
  !z.__s && Wa(a.__H, n) && (a.__ = e, a.u = n, Q.__H.__h.push(a));
}
function Ue(e) {
  return Ut = 5, vt(function() {
    return { current: e };
  }, []);
}
function vt(e, n) {
  var a = In(It++, 7);
  return Wa(a.__H, n) && (a.__ = e(), a.__H = n, a.__h = e), a.__;
}
function Tr() {
  for (var e; e = $a.shift(); ) {
    var n = e.__H;
    if (e.__P && n) try {
      n.__h.some(xt), n.__h.some(un), n.__h = [];
    } catch (a) {
      n.__h = [], z.__e(a, e.__v);
    }
  }
}
z.__b = function(e) {
  Q = null, Qn && Qn(e);
}, z.__ = function(e, n) {
  e && n.__k && n.__k.__m && (e.__m = n.__k.__m), ea && ea(e, n);
}, z.__r = function(e) {
  Jn && Jn(e), It = 0;
  var n = (Q = e.__c).__H;
  n && (tn === Q ? (n.__h = [], Q.__h = [], n.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (n.__h.some(xt), n.__h.some(un), n.__h = [], It = 0)), tn = Q;
}, z.diffed = function(e) {
  zn && zn(e);
  var n = e.__c;
  n && n.__H && (n.__H.__h.length && ($a.push(n) !== 1 && Kn === z.requestAnimationFrame || ((Kn = z.requestAnimationFrame) || Cr)(Tr)), n.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), tn = Q = null;
}, z.__c = function(e, n) {
  n.some(function(a) {
    try {
      a.__h.some(xt), a.__h = a.__h.filter(function(r) {
        return !r.__ || un(r);
      });
    } catch (r) {
      n.some(function(s) {
        s.__h && (s.__h = []);
      }), n = [], z.__e(r, a.__v);
    }
  }), Yn && Yn(e, n);
}, z.unmount = function(e) {
  Zn && Zn(e);
  var n, a = e.__c;
  a && a.__H && (a.__H.__.some(function(r) {
    try {
      xt(r);
    } catch (s) {
      n = s;
    }
  }), a.__H = void 0, n && z.__e(n, a.__v));
};
var ta = typeof requestAnimationFrame == "function";
function Cr(e) {
  var n, a = function() {
    clearTimeout(r), ta && cancelAnimationFrame(n), setTimeout(e);
  }, r = setTimeout(a, 35);
  ta && (n = requestAnimationFrame(a));
}
function xt(e) {
  var n = Q, a = e.__c;
  typeof a == "function" && (e.__c = void 0, a()), Q = n;
}
function un(e) {
  var n = Q;
  e.__c = e.__(), Q = n;
}
function Wa(e, n) {
  return !e || e.length !== n.length || n.some(function(a, r) {
    return a !== e[r];
  });
}
function Da(e, n) {
  return typeof n == "function" ? n(e) : n;
}
function Lr(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function fn(e, n) {
  for (var a in e) if (a !== "__source" && !(a in n)) return !0;
  for (var r in n) if (r !== "__source" && e[r] !== n[r]) return !0;
  return !1;
}
function na(e, n) {
  this.props = e, this.context = n;
}
function Gr(e, n) {
  function a(s) {
    var l = this.props.ref;
    return l != s.ref && l && (typeof l == "function" ? l(null) : l.current = null), n ? !n(this.props, s) || l != s.ref : fn(this.props, s);
  }
  function r(s) {
    return this.shouldComponentUpdate = a, t(e, s);
  }
  return r.displayName = "Memo(" + (e.displayName || e.name) + ")", r.__f = r.prototype.isReactComponent = !0, r.type = e, r;
}
(na.prototype = new $e()).isPureReactComponent = !0, na.prototype.shouldComponentUpdate = function(e, n) {
  return fn(this.props, e) || fn(this.state, n);
};
var aa = x.__b;
x.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), aa && aa(e);
};
var xr = x.__e;
x.__e = function(e, n, a, r) {
  if (e.then) {
    for (var s, l = n; l = l.__; ) if ((s = l.__c) && s.__c) return n.__e == null && (n.__e = a.__e, n.__k = a.__k || []), s.__c(e, n);
  }
  xr(e, n, a, r);
};
var ra = x.unmount;
function Oa(e, n, a) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), e.__c.__H = null), (e = Lr({}, e)).__c != null && (e.__c.__P === a && (e.__c.__P = n), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(r) {
    return Oa(r, n, a);
  })), e;
}
function Fa(e, n, a) {
  return e && a && (e.__v = null, e.__k = e.__k && e.__k.map(function(r) {
    return Fa(r, n, a);
  }), e.__c && e.__c.__P === n && (e.__e && a.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = a)), e;
}
function nn() {
  this.__u = 0, this.o = null, this.__b = null;
}
function Va(e) {
  var n = e.__ && e.__.__c;
  return n && n.__a && n.__a(e);
}
function Ct() {
  this.i = null, this.l = null;
}
x.unmount = function(e) {
  var n = e.__c;
  n && (n.__z = !0), n && n.__R && n.__R(), n && 32 & e.__u && (e.type = null), ra && ra(e);
}, (nn.prototype = new $e()).__c = function(e, n) {
  var a = n.__c, r = this;
  r.o == null && (r.o = []), r.o.push(a);
  var s = Va(r.__v), l = !1, c = function() {
    l || r.__z || (l = !0, a.__R = null, s ? s(u) : u());
  };
  a.__R = c;
  var g = a.__P;
  a.__P = null;
  var u = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var d = r.state.__a;
        r.__v.__k[0] = Fa(d, d.__c.__P, d.__c.__O);
      }
      var h;
      for (r.setState({ __a: r.__b = null }); h = r.o.pop(); ) h.__P = g, h.forceUpdate();
    }
  };
  r.__u++ || 32 & n.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), e.then(c, c);
}, nn.prototype.componentWillUnmount = function() {
  this.o = [];
}, nn.prototype.render = function(e, n) {
  if (this.__b) {
    if (this.__v.__k) {
      var a = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = Oa(this.__b, a, r.__O = r.__P);
    }
    this.__b = null;
  }
  var s = n.__a && t(it, null, e.fallback);
  return s && (s.__u &= -33), [t(it, null, n.__a ? null : e.children), s];
};
var oa = function(e, n, a) {
  if (++a[1] === a[0] && e.l.delete(n), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (a = e.i; a; ) {
    for (; a.length > 3; ) a.pop()();
    if (a[1] < a[0]) break;
    e.i = a = a[2];
  }
};
(Ct.prototype = new $e()).__a = function(e) {
  var n = this, a = Va(n.__v), r = n.l.get(e);
  return r[0]++, function(s) {
    var l = function() {
      n.props.revealOrder ? (r.push(s), oa(n, e, r)) : s();
    };
    a ? a(l) : l();
  };
}, Ct.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var n = Vt(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && n.reverse();
  for (var a = n.length; a--; ) this.l.set(n[a], this.i = [1, 0, this.i]);
  return e.children;
}, Ct.prototype.componentDidUpdate = Ct.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(n, a) {
    oa(e, a, n);
  });
};
var $r = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Wr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Dr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Or = /[A-Z0-9]/g, Fr = typeof document < "u", Vr = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
$e.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty($e.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(n) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: n });
  } });
});
var ia = x.event;
x.event = function(e) {
  return ia && (e = ia(e)), e.persist = function() {
  }, e.isPropagationStopped = function() {
    return this.cancelBubble;
  }, e.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, e.nativeEvent = e;
};
var Ur = { configurable: !0, get: function() {
  return this.class;
} }, sa = x.vnode;
x.vnode = function(e) {
  typeof e.type == "string" && (function(n) {
    var a = n.props, r = n.type, s = {}, l = r.indexOf("-") == -1;
    for (var c in a) {
      var g = a[c];
      if (!(c === "value" && "defaultValue" in a && g == null || Fr && c === "children" && r === "noscript" || c === "class" || c === "className")) {
        var u = c.toLowerCase();
        c === "defaultValue" && "value" in a && a.value == null ? c = "value" : c === "download" && g === !0 ? g = "" : u === "translate" && g === "no" ? g = !1 : u[0] === "o" && u[1] === "n" ? u === "ondoubleclick" ? c = "ondblclick" : u !== "onchange" || r !== "input" && r !== "textarea" || Vr(a.type) ? u === "onfocus" ? c = "onfocusin" : u === "onblur" ? c = "onfocusout" : Dr.test(c) && (c = u) : u = c = "oninput" : l && Wr.test(c) ? c = c.replace(Or, "-$&").toLowerCase() : g === null && (g = void 0), u === "oninput" && s[c = u] && (c = "oninputCapture"), s[c] = g;
      }
    }
    r == "select" && (s.multiple && Array.isArray(s.value) && (s.value = Vt(a.children).forEach(function(d) {
      d.props.selected = s.value.indexOf(d.props.value) != -1;
    })), s.defaultValue != null && (s.value = Vt(a.children).forEach(function(d) {
      d.props.selected = s.multiple ? s.defaultValue.indexOf(d.props.value) != -1 : s.defaultValue == d.props.value;
    }))), a.class && !a.className ? (s.class = a.class, Object.defineProperty(s, "className", Ur)) : a.className && (s.class = s.className = a.className), n.props = s;
  })(e), e.$$typeof = $r, sa && sa(e);
};
var la = x.__r;
x.__r = function(e) {
  la && la(e), e.__c;
};
var ca = x.diffed;
x.diffed = function(e) {
  ca && ca(e);
  var n = e.props, a = e.__e;
  a != null && e.type === "textarea" && "value" in n && n.value !== a.value && (a.value = n.value == null ? "" : n.value);
};
const bt = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" }
], pn = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "STEERING", "FAILED", "PAUSED", "IGNORED"] }
], Mr = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" }
], Xt = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "github_use_desktop", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] }
], Hr = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Git/worktree paths. For plain git worktrees, Repo root is the main clone and Worktree root is where issue worktrees are created. Worktrunk root is only used when Worktree tool is wt.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize."
}, Ua = {
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
}, da = {
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
}, an = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"], Ma = {
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
}, qr = ["model", "default_model", ...Object.values(Ma)], yn = /* @__PURE__ */ new Set([...Xt.flatMap((e) => e.keys), ...qr]), Br = new Set(Xt.flatMap((e) => e.keys).filter((e) => Bt(e) === "number")), jr = new Set(Xt.flatMap((e) => e.keys).filter((e) => Bt(e) === "checkbox")), Xr = /* @__PURE__ */ new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]), Kr = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" }
], Qr = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" }
], Jr = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" }
], zr = {
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
function Yr(e) {
  return zr[e ?? ""] ?? "WORKING";
}
const Zr = [
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
  { state: "DONE", label: "✅ Mark Done", hint: "Archive this issue as complete", risky: !0 }
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
}, eo = {
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
}, ua = {
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
function to(e) {
  return e.state !== "DONE";
}
const no = [
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
function ao() {
  window.localStorage.setItem("forge-v3-mock-states", "1"), window.location.reload();
}
function ro() {
  window.localStorage.removeItem("forge-v3-mock-states");
  const e = new URL(window.location.href);
  e.searchParams.delete("mockStates"), e.searchParams.get("mock") === "states" && e.searchParams.delete("mock"), window.location.href = e.toString();
}
function Me(e) {
  return new Date(Date.now() - e * 6e4).toISOString();
}
function Ha(e) {
  return e.state === "AWAITING_PLAN_APPROVAL" ? { id: 9101, issue_id: e.id, type: "PLAN_REVIEW", issueTitle: e.title } : e.state === "AWAITING_CODE_REVIEW" ? { id: 9102, issue_id: e.id, type: "CODE_REVIEW", issueTitle: e.title } : e.state === "AWAITING_FIX_APPROVAL" ? { id: 9103, issue_id: e.id, type: "FIX_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) } : e.state === "AWAITING_FIX_REVIEW" ? { id: 9104, issue_id: e.id, type: "FIX_REVIEW", issueTitle: e.title, artifact_ref: "fix-review" } : e.state === "AWAITING_SPLIT_APPROVAL" ? { id: 9104, issue_id: e.id, type: "SPLIT_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) } : null;
}
function gn() {
  return no.map((e, n) => ({
    id: 9e3 + n,
    linear_id: `MOCK-${n + 1}`,
    title: `${Ze({ state: e })} dashboard fixture`,
    state: e,
    priority: n % 4 + 1,
    created_at: Me(240 + n * 11),
    updated_at: Me(3 + n * 7),
    branch: `user/mock-${e.toLowerCase().replaceAll("_", "-")}`,
    wt_path: `/tmp/forge/mock/${e.toLowerCase()}`,
    project_file_path: `/tmp/forge/mock/${e.toLowerCase()}/plan.md`,
    prStack: ["CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(e) ? [{ pr_number: e === "CREATING_PR" ? null : 4521 + n, branch: `user/mock-${n + 1}`, status: e === "IN_MERGE_QUEUE" ? "merged" : "open" }] : []
  }));
}
function fa(e) {
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
function oo(e) {
  var r, s;
  const n = gn().find((l) => l.id === e) ?? gn()[0], a = Ha(n);
  return {
    issue: n,
    plan: fa(n),
    planContent: fa(n),
    decisions: a ? [a] : [],
    agentRuns: [
      { id: n.id * 10 + 1, agent_type: "planner", started_at: Me(38), exit_code: 0 },
      { id: n.id * 10 + 2, agent_type: (r = n.state) != null && r.toLowerCase().includes("review") ? "reviewer" : "coder", started_at: Me(9), exit_code: fe(n) ? null : 0 }
    ],
    activityLog: [
      { id: n.id * 100 + 1, type: "agent_completed", actor: "planner", message: "Planner wrote the implementation plan", created_at: Me(38) },
      { id: n.id * 100 + 2, type: n.state === "FAILED" ? "agent_failed" : "steered", actor: n.state === "FAILED" ? "coder" : "user", message: n.state === "FAILED" ? "Coder failed while applying changes" : "Steering instructions added from dashboard", created_at: Me(8) }
    ],
    failureContext: n.state === "FAILED" ? { run: { id: n.id * 10 + 2, agent_type: "coder", started_at: Me(9), exit_code: 1 }, logTail: `[FATAL] Mock failure context
TypeError: Cannot read properties of undefined` } : null,
    prStack: (s = n.prStack) == null ? void 0 : s.map((l) => {
      var c;
      return { pr_number: l.pr_number, branch: l.branch ?? void 0, status: l.status ?? void 0, reviewDecision: l.pr_number ? "APPROVED" : null, mergeable: "MERGEABLE", checksTotal: l.pr_number ? 8 : 0, checksFailed: 0, checksPending: n.state === "WATCHING_PR" ? 1 : 0, liveState: ((c = l.status) == null ? void 0 : c.toUpperCase()) ?? "OPEN", url: l.pr_number ? `https://github.com/example/repo/pull/${l.pr_number}` : null };
    }),
    vmConnectCommand: `ssh my-vm # ${n.linear_id}`
  };
}
function io() {
  const e = gn(), n = e.flatMap((a) => {
    const r = Ha(a);
    return r ? [r] : [];
  });
  return {
    issues: e,
    decisions: n,
    runningAgents: e.filter(fe).map((a) => ({ issueId: a.id, state: a.state })),
    scheduler: { running: !0 },
    doneThisWeek: [{ id: 9999 }],
    learningSuggestionsCount: 0
  };
}
function ze(e) {
  return eo[e.state ?? ""] ?? "building";
}
function so(e) {
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
function $t(e) {
  if (!e.updated_at) return !1;
  const n = Ye(e.updated_at);
  return Number.isFinite(n) && Date.now() - n > 1440 * 60 * 1e3;
}
function Ye(e) {
  return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(e) && !e.endsWith("Z") && !e.includes("+") ? (/* @__PURE__ */ new Date(e.replace(" ", "T") + "Z")).getTime() : new Date(e).getTime();
}
function he(e) {
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
function rn(e) {
  if (!e) return "date unknown";
  const n = Ye(e);
  return Number.isFinite(n) ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(n)) : e;
}
function An(e) {
  return e === 1 ? "▰▰▰" : e === 2 ? "▰▰░" : e === 3 ? "▰░░" : e === 4 ? "░░░" : "□□□";
}
function wn(e) {
  return e === 1 ? "urgent" : e === 2 ? "high" : e === 3 ? "medium" : e === 4 ? "low" : "none";
}
function Pn(e) {
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
function lo(e) {
  const n = e.state ?? "";
  return n === "AWAITING_CODE_REVIEW" ? "forge-v3-state-pill pill-code" : n === "WATCHING_PR" ? "forge-v3-state-pill pill-watching" : n === "IN_MERGE_QUEUE" ? "forge-v3-state-pill pill-merge" : n === "FAILED" ? "forge-v3-state-pill pill-failed" : `forge-v3-state-pill pill-${ze(e)}`;
}
function co(e) {
  return (e.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}
function fe(e) {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(e.state ?? "");
}
function Mt(e) {
  return !!(e.pr_approved_at || (e.prStack ?? []).some((n) => String(n.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}
function uo(e) {
  return String(e.status ?? "").toLowerCase() === "merged" || String(e.liveState ?? "").toUpperCase() === "MERGED";
}
function fo(e) {
  const n = (e.prStack ?? []).filter((a) => a.pr_number);
  return e.state !== "DONE" && n.length > 0 && n.every(uo);
}
function po(e) {
  const n = [];
  return fe(e) && n.push({ className: "forge-v3-live-badge", label: "Live" }), e.updated_at && n.push({ className: `forge-v3-elapsed-badge${$t(e) ? " long" : ""}`, label: $t(e) ? "24h+" : he(e.updated_at) }), $t(e) && n.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" }), n;
}
function qa(e) {
  const n = e.state ?? "";
  return ["PLANNING", "SETTING_UP"].includes(n) ? [t("strong", null, "Planner"), " reading ", t("code", null, "project context"), " — exploring component structure and requirements…"] : n === "AI_PLAN_REVIEWING" ? [t("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"] : n === "AWAITING_PLAN_APPROVAL" ? ["Plan ready for you — ", t("strong", null, "review tasks"), " and AI reviewer notes before approving."] : n === "WORKING" ? [t("strong", null, "Coder"), " writing changes — implementing planned code updates…"] : n === "AI_REVIEWING" ? [t("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"] : n === "AWAITING_CODE_REVIEW" ? ["AI review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."] : n === "REBASING" ? [t("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"] : Mt(e) ? ["GitHub review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."] : n === "FAILED" ? [t("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."] : n === "PAUSED" ? ["Paused by user. Was in ", t("strong", null, "active"), " state."] : e.updated_at ? "Updated recently" : "Queued in Forge";
}
function pa(e) {
  var a;
  const n = he(e.updated_at ?? e.created_at);
  return fe(e) ? e.state === "AI_REVIEWING" ? `In review ${n}` : `Started ${n} ago` : (a = e.state) != null && a.startsWith("AWAITING") ? `Waiting ${n}` : e.state === "FAILED" ? `Failed ${n} ago` : e.state === "PAUSED" ? `Paused ${n} ago` : ze(e) === "available" ? `Added ${n} ago` : `Updated ${n} ago`;
}
function Ba(e) {
  var a;
  const n = ((a = e[0]) == null ? void 0 : a.type) ?? "";
  return n ? n.includes("PLAN") ? "plan" : n.includes("CODE") ? "code" : n === "FIX_REVIEW" ? "fix-review" : n.includes("FIX") ? "fix" : n.includes("SPLIT") ? "split" : "generic" : null;
}
function Wt(e) {
  if (!(e != null && e.artifact_ref)) return {};
  try {
    const n = JSON.parse(e.artifact_ref);
    return n && typeof n == "object" ? n : {};
  } catch {
    return { summary: e.artifact_ref };
  }
}
function ga(e) {
  return !!(e && /(?:^|[\\/])(?:plan|handoff|summary)\.md$/i.test(e.trim()));
}
function go(e, n) {
  var g;
  const a = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), r = new RegExp(`^(#{1,6})\\s+${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), s = a.findIndex((u) => r.test(u.trim()));
  if (s < 0) return "";
  const l = ((g = a[s].match(/^\s*(#{1,6})/)) == null ? void 0 : g[1].length) ?? 1;
  let c = a.length;
  for (let u = s + 1; u < a.length; u += 1) {
    const d = a[u].match(/^\s*(#{1,6})\s+/);
    if (d && d[1].length <= l) {
      c = u;
      break;
    }
  }
  return a.slice(s, c).join(`
`).trim();
}
function vo(e) {
  var r, s, l, c, g, u, d, h;
  if (!e.trim()) return [];
  const n = [], a = e.split(/\n(?=###\s+)/g).filter((b) => /^###\s+/.test(b.trim()));
  for (const b of a) {
    const f = (s = (r = b.match(/^###\s+(?:Part\s+\d+\s+[—-]\s+)?(.+)$/m)) == null ? void 0 : r[1]) == null ? void 0 : s.trim(), k = (c = (l = b.match(/^[-*]\s+\*\*Branch:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : l[1]) == null ? void 0 : c.trim(), p = (u = (g = b.match(/^[-*]\s+\*\*Base:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : g[1]) == null ? void 0 : u.trim(), v = (h = (d = b.match(/^[-*]\s+\*\*Commits?:\*\*\s+(.+)$/m)) == null ? void 0 : d[1]) == null ? void 0 : h.replace(/`/g, "").trim();
    (f || k) && n.push({ title: f, branch: k, summary: [p ? `Base: ${p}` : null, v ? `Commits: ${v}` : null].filter(Boolean).join(" · ") || k });
  }
  return n;
}
function _o(e, n, a) {
  const r = ga(n.summary) ? void 0 : n.summary, s = ga(n.plan) ? void 0 : n.plan, l = go(Xa(a), "Split Plan"), c = s ?? l, g = n.proposedStack ?? n.stack ?? vo(c);
  return {
    summary: r ?? (c ? "Review the proposed PR stack split from the split planner." : "Review the proposed PR stack split."),
    markdown: c,
    stack: g
  };
}
function pt(e, n) {
  return String(e.id ?? `${e.path ?? "comment"}-${e.line ?? n}-${n}`);
}
function ja(e) {
  const n = e.pr_number ?? e.prNumber, a = typeof n == "number" ? n : Number(String(n ?? "").replace(/^#/, ""));
  return Number.isFinite(a) && a > 0 ? a : null;
}
function mo(e, n) {
  const a = ja(e), r = a ? n.find((c) => Number(c.pr_number) === a) : null, s = r != null && r.position ? `PR ${r.position}` : "PR", l = (r == null ? void 0 : r.gt_branch) ?? (r == null ? void 0 : r.branch);
  return [a ? `${s} #${a}` : s, l].filter(Boolean).join(" · ");
}
function ho(e) {
  return e.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
}
function bo(e) {
  return (e ?? "No comment body").replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "").replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (n, a, r) => `<!-- ${a} START -->
${r.trim()}
<!-- ${a} END -->`).replace(/<details\b[\s\S]*?<\/details>/gi, "").replace(/<sup\b[\s\S]*?<\/sup>/gi, "").replace(/<div\b[\s\S]*?<\/div>/gi, "").trim() || "No comment body";
}
function ko(e) {
  const n = bo(e), a = /<!--\s*([A-Z0-9_ -]+?)\s+(START|END)\s*-->/gi, r = [...n.matchAll(a)];
  if (!r.length) return t("div", { class: "forge-v3-fix-comment-body forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(n) } });
  const s = [];
  let l = null, c = 0;
  const g = (u) => {
    const d = n.slice(c, u).trim();
    d && s.push({ label: l, text: d });
  };
  for (const u of r)
    g(u.index ?? c), c = (u.index ?? c) + u[0].length, l = u[2].toUpperCase() === "START" ? ho(u[1]) : null;
  return g(n.length), t(
    "div",
    { class: "forge-v3-fix-comment-body" },
    s.length ? s.map((u, d) => t(
      "section",
      { class: "forge-v3-fix-comment-section", key: `${u.label ?? "intro"}-${d}` },
      u.label ? t("div", { class: "forge-v3-fix-comment-section-label" }, u.label) : null,
      t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(u.text) } })
    )) : t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ke(n.replace(a, "").trim() || "No comment body") } })
  );
}
function Io(e) {
  return e === "AWAITING_PLAN_APPROVAL" ? "PLAN_REVIEW" : e === "AWAITING_CODE_REVIEW" ? "CODE_REVIEW" : e === "AWAITING_FIX_APPROVAL" ? "FIX_APPROVAL" : e === "AWAITING_FIX_REVIEW" ? "FIX_REVIEW" : e === "AWAITING_SPLIT_APPROVAL" ? "SPLIT_APPROVAL" : null;
}
function yo(e, n) {
  const a = e.state ?? "", r = Ba(n);
  return r === "plan" || a === "AWAITING_PLAN_APPROVAL" ? { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: !1 } : r === "code" || a === "AWAITING_CODE_REVIEW" ? { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: !1 } : r === "fix" || a === "AWAITING_FIX_APPROVAL" ? { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: !1 } : a === "AWAITING_FIX_REVIEW" ? { icon: "🔍", tone: "awaiting", title: "Fix ready for review", text: "The fixer addressed review comments. Review the diff and approve to push, or reject to send back for more changes.", live: !1 } : a === "AWAITING_SPLIT_APPROVAL" ? { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: !1 } : a === "REBASING" ? { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: !0 } : Mt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(a) ? { icon: "✓", tone: "running", title: "PR approved", text: e.pr_approved_at ? `GitHub review approved ${he(e.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: !1 } : fe(e) ? { icon: "spinner", tone: "running", title: `${Ze(e)} agent running`, text: `Active for ${he(e.updated_at)} — Forge is working on this issue.`, live: !0 } : a === "FAILED" ? { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: !1 } : { icon: za(ze(e)), tone: ze(e), title: Ze(e), text: e.updated_at ? `Updated ${he(e.updated_at)} ago` : "Waiting for activity", live: !1 };
}
const va = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];
function ie(e, n, a = `${n}s`) {
  return `${e} ${e === 1 ? n : a}`;
}
function Fe(e, n) {
  return (e ?? []).filter((a) => a.agent_type === n).length;
}
function Ao(e) {
  return (e ?? []).filter((n) => n.type === "FIX_APPROVAL").reduce((n, a) => {
    var r;
    return n + (((r = Wt(a).comments) == null ? void 0 : r.length) ?? 0);
  }, 0);
}
function wo(e, n) {
  return (e ?? []).filter((a) => a.type === n).length;
}
function Po(e, n) {
  var f, k, p;
  const a = (n == null ? void 0 : n.agentRuns) ?? [], r = (n == null ? void 0 : n.decisions) ?? [], s = (n == null ? void 0 : n.prStack) ?? ((f = n == null ? void 0 : n.issue) == null ? void 0 : f.prStack) ?? [], l = Fe(a, "planner"), c = Fe(a, "plan-reviewer"), g = Fe(a, "coder"), u = Fe(a, "reviewer"), d = Fe(a, "fixer"), h = Fe(a, "watcher"), b = Ao(r);
  return e === "Setup" ? { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [ie(Fe(a, "setup"), "setup run"), (k = n == null ? void 0 : n.issue) != null && k.wt_path ? "Worktree ready" : "Worktree not recorded yet"] } : e === "Plan" ? { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [ie(l, "planner pass", "planner passes"), ie(c, "AI plan review"), ie(Math.max(0, Math.min(l, c) - 1), "planner/reviewer loop")] } : e === "Code" ? { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [ie(g, "coder pass", "coder passes"), ie(Math.max(0, g - 1), "rework loop")] } : e === "Review" ? { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [ie(u, "AI code review"), ie(wo(r, "CODE_REVIEW"), "human review gate"), ie(Math.max(0, Math.min(g, u) - 1), "code/review loop")] } : e === "PR" ? { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [ie(Fe(a, "git-agent"), "git-agent run"), ie(s.length, "PR"), ie(b, "PR comment/issue")] } : e === "Watch" ? { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [ie(h, "watch poll"), ie(d, "fix loop"), ie(b, "comment/issue routed to fixer")] } : { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [((p = n == null ? void 0 : n.issue) == null ? void 0 : p.state) === "DONE" ? "Completed" : "Not completed yet"] };
}
function Eo(e) {
  return ["PENDING", "SETTING_UP"].includes(e ?? "") ? 0 : ["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "") ? 1 : ["WORKING", "SPLITTING"].includes(e ?? "") ? 2 : ["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(e ?? "") ? 3 : ["CREATING_PR"].includes(e ?? "") ? 4 : ["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(e ?? "") ? 5 : e === "DONE" ? 6 : 0;
}
function No(e) {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "");
}
function Xa(e) {
  return (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan) ?? "No plan available.";
}
function Ro(e) {
  const n = (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan);
  return !!(n != null && n.trim());
}
function Ka(e) {
  return (e == null ? void 0 : e.handoffContent) ?? "";
}
function So(e) {
  return !!Ka(e).trim();
}
function To(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(e ?? "");
}
function Co(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(e ?? "");
}
function Lo(e) {
  return e ? ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes(e.state ?? "") && !fe(e) && !e.locked_at && !e.agent_pid : !1;
}
function Go(e) {
  return e.startsWith("+") ? "add" : e.startsWith("-") ? "del" : e.startsWith("@@") ? "hunk" : e.startsWith("diff --git") || e.startsWith("index ") || e.startsWith("---") || e.startsWith("+++") ? "meta" : "ctx";
}
function xo(e) {
  return e.startsWith("+") ? "+" : e.startsWith("-") ? "−" : "";
}
function _a(e) {
  return e.split(/[\\/]/).filter(Boolean).pop() || e;
}
function kt(e) {
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
function $o(e, n) {
  return e.exit_code === null ? `${kt(e.agent_type)} is active — streaming progress.` : e.exit_code && e.exit_code !== 0 ? `${kt(e.agent_type)} failed — inspect logs before retrying.` : e.agent_type === "planner" ? "Plan created — tasks, risks, and PR stack estimated." : e.agent_type === "plan-reviewer" ? "Plan approved — scope and sequencing look ready." : e.agent_type === "coder" ? "Completed implementation pass and updated project notes." : e.agent_type === "reviewer" ? "Review completed — security, tests, and conventions checked." : e.agent_type === "git-agent" ? "Prepared branch stack and synchronized git state." : e.agent_type === "fixer" ? "Applied requested PR comment fixes." : e.agent_type === "watcher" ? "Checked PR status, reviews, and merge readiness." : `${kt(e.agent_type)} completed.`;
}
function Wo(e, n) {
  const a = `${e ?? ""} ${n ?? ""}`.toLowerCase();
  return a.includes("fail") || a.includes("error") ? "err" : a.includes("approved") || a.includes("completed") || a.includes("done") ? "ok" : a.includes("user") || a.includes("steer") || a.includes("paused") || a.includes("ignored") ? "me" : a.includes("started") || a.includes("live") ? "live" : "ag";
}
function Do(e) {
  var n;
  return e.message ?? ((n = e.type) == null ? void 0 : n.replaceAll("_", " ")) ?? "Activity recorded";
}
function _t(e) {
  return e ? `/api/runs/${e}/log` : null;
}
function Oo(e, n) {
  var g, u;
  const a = [...(e == null ? void 0 : e.agentRuns) ?? []].sort((d, h) => re(h.started_at) - re(d.started_at)), r = [...(e == null ? void 0 : e.activityLog) ?? []].sort((d, h) => re(h.created_at) - re(d.created_at)), s = fe(n), l = new Map(a.map((d) => [d.agent_type, d])), c = r.length ? r.map((d) => {
    var b;
    const h = l.get(d.actor ?? "") ?? ((b = d.type) != null && b.includes("agent") ? a.find((f) => f.agent_type === d.actor) : void 0);
    return { id: String(d.id ?? `${d.type}-${d.created_at}`), actor: d.actor ?? "Forge", time: d.created_at ? `${he(d.created_at)} ago` : "recent", tone: Wo(d.type, d.actor), text: Do(d), snippet: d.metadata ?? null, logUrl: _t(h == null ? void 0 : h.id) };
  }) : [
    ...s ? [{ id: "live", actor: kt(((g = a[0]) == null ? void 0 : g.agent_type) ?? "agent"), time: "now", tone: "live", text: qa(n), snippet: `// live agent output
Reading files, updating the project plan, and streaming progress…`, logUrl: _t((u = a[0]) == null ? void 0 : u.id) }] : [],
    ...a.map((d) => {
      var h;
      return { id: String(d.id ?? `${d.agent_type}-${d.started_at}`), actor: kt(d.agent_type), time: d.started_at ? `${he(d.started_at)} ago` : "recent", tone: d.exit_code === null ? "live" : d.exit_code && d.exit_code !== 0 ? "err" : (h = d.agent_type) != null && h.includes("review") ? "ok" : "ag", text: $o(d), snippet: null, logUrl: _t(d.id) };
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
      t("div", null, t("strong", null, "Failure context"), e.failureContext.run ? t("a", { href: _t(e.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Open run log ↗") : null),
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
function Qa(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function on(e) {
  return Qa(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function Ke(e) {
  const n = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), a = [];
  let r = !1, s = !1, l = [];
  const c = () => {
    l.length && (a.push(`<p>${on(l.join(" "))}</p>`), l = []);
  }, g = () => {
    r && (a.push("</ul>"), r = !1);
  };
  for (const u of n) {
    const d = u.trimEnd();
    if (d.startsWith("```")) {
      c(), g(), a.push(s ? "</code></pre>" : "<pre><code>"), s = !s;
      continue;
    }
    if (s) {
      a.push(Qa(u));
      continue;
    }
    if (!d.trim()) {
      c(), g();
      continue;
    }
    const h = d.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      c(), g();
      const f = Math.min(h[1].length + 1, 4);
      a.push(`<h${f}>${on(h[2])}</h${f}>`);
      continue;
    }
    const b = d.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (b) {
      c(), r || (a.push("<ul>"), r = !0);
      const f = b[1] ? `<input type="checkbox" disabled ${b[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      a.push(`<li>${f}${on(b[2])}</li>`);
      continue;
    }
    l.push(d.trim());
  }
  return c(), g(), s && a.push("</code></pre>"), a.join(`
`);
}
function Fo(e) {
  return [e.title, e.identifier, e.state].filter(Boolean).join(" ").toLowerCase();
}
function Vo(e, n) {
  const a = n.trim().toLowerCase();
  return !a || Fo(e).includes(a);
}
function Uo(e) {
  var n;
  return ((n = (e.prStack ?? []).find((a) => a.url)) == null ? void 0 : n.url) ?? null;
}
function Mo(e) {
  const n = e.prStack ?? [];
  return (e.state ?? "") === "AWAITING_PLAN_APPROVAL" ? [{ className: "forge-v3-plan-badge", label: "plan ready" }] : n.length ? n.slice(0, 2).flatMap((r) => [
    { className: "forge-v3-pr-badge", label: r.pr_number ? `#${r.pr_number}` : r.branch ?? "PR" },
    { className: r.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : r.status === "merged" ? "forge-v3-ci-badge" : r.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: r.isInMergeQueue ? "merge queue" : r.liveState ?? r.status ?? "✓ CI" }
  ]) : [];
}
function Ho(e) {
  const n = (e.prStack ?? []).map((a) => [a.branch, a.pr_number ? `#${a.pr_number}` : "", a.status].filter(Boolean).join(" ")).join(" ");
  return [e.title, e.linear_id, e.branch, n, e.state].filter(Boolean).join(" ").toLowerCase();
}
function qo(e, n) {
  const a = n.trim().toLowerCase();
  return !a || Ho(e).includes(a);
}
function Bo(e, n) {
  const a = e.state ?? "";
  return n === "needs-me" ? ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(a) : n === "running" ? fe(e) : n === "failed" ? a === "FAILED" : n === "watching-pr" ? ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(a) : n === "paused" ? ["PAUSED", "IGNORED"].includes(a) : !0;
}
function re(e) {
  const n = e ? Ye(e) : 0;
  return Number.isFinite(n) ? n : 0;
}
function jo(e, n) {
  const a = [...e];
  return n === "newest" ? a.sort((r, s) => re(s.created_at ?? s.updated_at) - re(r.created_at ?? r.updated_at)) : n === "oldest" ? a.sort((r, s) => re(r.created_at ?? r.updated_at) - re(s.created_at ?? s.updated_at)) : n === "recently-updated" ? a.sort((r, s) => re(s.updated_at) - re(r.updated_at)) : a.sort((r, s) => (r.priority ?? 99) - (s.priority ?? 99) || re(s.updated_at) - re(r.updated_at));
}
function Xo(e, n) {
  var s;
  if (n === "awaiting")
    return [...e].sort((l, c) => re(c.updated_at ?? c.created_at) - re(l.updated_at ?? l.created_at));
  const a = ((s = pn.find((l) => l.key === n)) == null ? void 0 : s.states) ?? [], r = (l) => {
    const c = l.state ?? "";
    if (c === "FAILED") return -1;
    const g = a.indexOf(c);
    return g >= 0 ? g : Xe[c] ?? 999;
  };
  return [...e].sort(
    (l, c) => r(l) - r(c) || (l.priority ?? 99) - (c.priority ?? 99) || re(c.updated_at) - re(l.updated_at)
  );
}
function ma(e, n) {
  const a = n.find((r) => r.id === e.issue_id);
  return a != null && a.state ? Xe[a.state] ?? 999 : e.type === "PLAN_REVIEW" ? Xe.AWAITING_PLAN_APPROVAL : e.type === "SPLIT_APPROVAL" ? Xe.AWAITING_SPLIT_APPROVAL : e.type === "CODE_REVIEW" ? Xe.AWAITING_CODE_REVIEW : e.type === "FIX_APPROVAL" ? Xe.AWAITING_FIX_APPROVAL : e.type === "FIX_REVIEW" ? Xe.AWAITING_FIX_REVIEW : 999;
}
function Ko(e, n) {
  return [...e].sort((a, r) => {
    const s = n.find((c) => c.id === a.issue_id), l = n.find((c) => c.id === r.issue_id);
    return ma(a, n) - ma(r, n) || ((s == null ? void 0 : s.priority) ?? 99) - ((l == null ? void 0 : l.priority) ?? 99) || a.id - r.id;
  });
}
function Qo(e, n) {
  return Ko(e, n)[0] ?? null;
}
function Jo(e) {
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
async function se(e) {
  if (Je()) {
    if (e === "/api/overview") return io();
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
    if (r != null && r[1]) return { generating: !1, created_at: Me(1), tour: { summary: "AI tour: review behavior, error states, and API payload shape.", highlights: ["Diff sidecar stays issue-scoped", { title: "Decision payload", text: "Structured review feedback is sent to the agent", file: "src/mock.ts", line: 3 }], files: [{ path: "src/mock.ts", summary: "Mock review fixture", risk: "low" }] } };
    const s = e.match(/^\/api\/issues\/(\d+)$/);
    if (s != null && s[1]) return oo(Number(s[1]));
  }
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Failed to fetch ${e}: ${n.status}`);
  return await n.json();
}
async function be(e, n, a = "POST") {
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
    await new Promise((u) => window.setTimeout(u, 300 * (c + 1)));
  }
  const l = await (s == null ? void 0 : s.text().catch(() => ""));
  throw new Error(`Failed to mutate ${e}: ${(s == null ? void 0 : s.status) ?? "unknown"}${l ? ` — ${l.slice(0, 200)}` : ""}`);
}
async function zo(e) {
  if (Je()) return { ok: !0, mock: !0, url: e, method: "DELETE" };
  const n = await fetch(e, { method: "DELETE" });
  if (!n.ok) throw new Error(`Failed to delete ${e}: ${n.status}`);
  return await n.json();
}
function sn(e) {
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
function Yo(e, n, a) {
  return be(`/api/decisions/${e}/resolve`, { verdict: n, feedback: a });
}
function Zo(e, n, a = {}) {
  return be(`/api/issues/${e}`, { action: n, ...a }, "PATCH");
}
function ei(e) {
  return zo(`/api/issues/${e}`);
}
function ti(e) {
  return be(`/api/issues/${e}/vm-launch`, {});
}
function ni() {
  return be("/api/vm/stop", {});
}
function ai(e) {
  return be(`/api/issues/${e}/sync-prs`, {});
}
function ri(e, n, a) {
  return be(`/api/issues/${e}/feedback`, { body: n, prNumber: a ?? null });
}
function oi(e, n = "", a) {
  return be("/api/issues", { title: e, description: n, ...a });
}
function ii(e, n = "", a) {
  return be("/api/linear/enqueue", { linearId: e, planningGuidance: n, ...a });
}
function si() {
  return se("/api/desktop-capabilities");
}
function Ja(e, n, a) {
  return be("/api/desktop-notify", { title: e, body: n, tag: a });
}
function En() {
  return typeof window < "u" && "Notification" in window;
}
function li() {
  return En() ? window.Notification.permission : "unsupported";
}
async function ci(e, n, a = !1) {
  const r = co(e) || "Forge decision needed", s = n != null && n.title ? `${n.title} needs your review` : "A Forge issue needs your review", l = `forge-decision-${e.id}`;
  if (a)
    try {
      await Ja(r, s, l);
      return;
    } catch {
    }
  if (!En() || window.Notification.permission !== "granted") return;
  const c = new window.Notification(r, { body: s, tag: l });
  c.onclick = () => {
    window.focus();
    const g = (n == null ? void 0 : n.id) ?? e.issue_id, u = new URL(window.location.href);
    u.searchParams.set("view", "queue"), u.searchParams.set("issue", String(g)), u.searchParams.set("panel", "review"), window.location.href = u.toString();
  };
}
function di(e, n) {
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
function gt(e) {
  if (!e) return null;
  const n = Number(e);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function Ht(e = window.location.hash) {
  const n = new URLSearchParams(window.location.search), a = n.get("view") || void 0, r = gt(n.get("issue") || void 0), s = gt(n.get("decision") || void 0), l = n.get("tab"), c = l === "activity" || l === "ask" ? l : "overview", g = n.get("panel"), u = g === "plan" || g === "diff" || g === "review" || g === "listen" || g === "jump" ? g : null, d = bt.some((I) => I.key === a) ? a : null;
  if (d || r || u || n.has("add"))
    return {
      view: d ?? "queue",
      issueId: r,
      decisionId: s,
      detailTab: c,
      panel: u,
      diffPath: n.get("diffPath") ?? "",
      addIssue: n.get("add") === "issue"
    };
  const h = e.replace(/^#/, "").split("/").filter(Boolean), [b, f, k, p] = h;
  return b === "issue" ? { view: "queue", issueId: gt(f), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 } : b === "review" ? {
    view: "queue",
    issueId: gt(f),
    decisionId: k === "decision" ? gt(p) : null,
    detailTab: "overview",
    panel: "review",
    diffPath: "",
    addIssue: !1
  } : { view: bt.some((I) => I.key === b) ? b : "queue", issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 };
}
function qt(e, n = !0) {
  const a = new URL(window.location.href);
  a.hash = "";
  for (const [l, c] of Object.entries(e))
    c == null || c === !1 || c === "" ? a.searchParams.delete(l) : a.searchParams.set(l, String(c));
  const r = `${a.pathname}${a.search}${a.hash}`, s = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  r !== s && window.history[n ? "replaceState" : "pushState"]({}, "", r);
}
function ot(e, n = {}) {
  qt({ view: e, issue: e === "queue" ? n.issueId : null, decision: n.decisionId, panel: n.decisionId ? "review" : null }, !1);
}
function Kt({ icon: e, title: n, subtitle: a, actions: r }) {
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
function At({ view: e, className: n = "", children: a }) {
  return t(
    "main",
    { class: `forge-v3-main forge-v3-view-scroll ${n}`, "data-active-view": e },
    t("div", { class: "forge-v3-page-wrap" }, a)
  );
}
function Pe(e) {
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
function mt({ title: e, message: n, confirmText: a = "Confirm", danger: r = !1 }) {
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
function ui({ title: e, message: n }) {
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
function za(e) {
  return { available: "○", active: "▣", awaiting: "⚡" }[e];
}
function fi({ issue: e, onEnqueue: n }) {
  const a = async () => {
    var s;
    const r = ((s = await Pe({ title: `Enqueue ${e.identifier}`, message: "Add optional planning guidance before Forge creates the plan.", label: "Planning guidance", confirmText: "Enqueue" })) == null ? void 0 : s.trim()) ?? "";
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
        t("span", { class: `forge-v3-priority-meta ${Pn(e.priority)}` }, An(e.priority), " ", wn(e.priority))
      )
    ),
    t("button", { type: "button", onClick: a }, "Enqueue →")
  );
}
function ha(e) {
  e.stopPropagation();
}
function ba(e) {
  return e.composedPath().some((n) => {
    var a;
    return n instanceof HTMLElement && !!((a = n.closest) != null && a.call(n, "button,a,input,select,textarea"));
  });
}
function pi({ issue: e, selected: n, onOpenIssue: a, onIssueAction: r, onReviewIssue: s }) {
  const l = so(e), c = ze(e), g = c === "available", u = fe(e), d = e.state === "PAUSED" ? "unpause" : e.state === "FAILED" ? "retry" : "pause", h = d === "unpause" ? "Resume" : d === "retry" ? "Retry" : "Pause", b = po(e), f = Mo(e), k = Uo(e);
  return t(
    "article",
    { class: `forge-v3-issue-card ${n ? "selected" : ""} ${Mt(e) ? "pr-approved" : ""} ${(e.prStack ?? []).some((p) => p.isInMergeQueue) ? "in-merge-queue" : ""} state-${e.state ?? "unknown"} stage-${c}`, "data-issue-id": String(e.id), tabIndex: 0, "aria-label": `Open issue ${e.linear_id ?? e.id}`, onClick: (p) => {
      ba(p) || a(e.id);
    }, onKeyDown: (p) => {
      ba(p) || (p.key === "Enter" || p.key === " ") && a(e.id);
    } },
    t(
      "div",
      { class: "forge-v3-ic-hover", onPointerDown: ha },
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
      } }, "Resume") : u ? [
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
        e.state === "WATCHING_PR" && k ? t("a", { class: "forge-v3-hact", href: k, target: "_blank", rel: "noreferrer", onClick: (p) => p.stopPropagation() }, "View PR") : t("button", { class: "forge-v3-hact", type: "button", onClick: (p) => {
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
          t("span", { class: `forge-v3-priority-glyph ${Pn(e.priority)}`, "aria-label": `Priority ${wn(e.priority)}` }, An(e.priority))
        )
      ),
      t("h3", null, e.title ?? "Untitled issue"),
      fo(e) ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Merged"), t("small", null, "finalizing")) : (e.prStack ?? []).some((p) => p.isInMergeQueue) ? t("div", { class: "forge-v3-merge-queue-banner" }, t("span", null, "⇄"), t("strong", null, "Merge queue"), t("small", null, "waiting to merge")) : Mt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(e.state ?? "") ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Approved"), t("small", null, e.pr_approved_at ? `${he(e.pr_approved_at)} ago` : "watching merge")) : null,
      t(
        "div",
        { class: "forge-v3-issue-state-row" },
        u ? t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
        t("span", { class: lo(e) }, Ze(e)),
        b.map((p) => t("span", { class: p.className }, p.label))
      ),
      g ? t("div", { class: "forge-v3-ic-meta" }, pa(e)) : [
        t("p", { class: "forge-v3-activity-snippet" }, qa(e)),
        t("div", { class: "forge-v3-ic-meta" }, pa(e), $t(e) ? t("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
      ],
      !g && f.length ? t("div", { class: "forge-v3-pr-metadata" }, f.map((p) => t("span", { class: p.className }, p.label))) : null
    ),
    t("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, t("span", { class: "forge-v3-ic-fill", style: { width: `${l}%` } })),
    t(
      "div",
      { class: "forge-v3-issue-actions", onPointerDown: ha },
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
const ka = Gr(pi, (e, n) => e.issue === n.issue && e.selected === n.selected);
function gi({ status: e, onStopVm: n }) {
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
function vi({ open: e, decisions: n, onClose: a, onNavigate: r, onRefresh: s, onOpenIssue: l, onReviewNext: c, onAddIssue: g, onStopVm: u }) {
  if (!e) return null;
  const h = [
    ...n.map((b) => ({ label: `Decision: ${b.type ?? "Review"} #${b.id}`, action: () => {
      r("queue"), l(b.issue_id);
    } })),
    { label: "Review next", action: c, disabled: n.length === 0 },
    { label: "Open queue", action: () => r("queue") },
    { label: "Open archive", action: () => r("archive") },
    { label: "Open settings", action: () => r("settings") },
    { label: "Open prompts", action: () => r("prompts") },
    { label: "Open learnings", action: () => r("learnings") },
    { label: "Refresh dashboard", action: s },
    { label: "Stop VM runtime", action: u },
    { label: "Sync Linear backlog", action: () => r("queue") },
    { label: "Add issue", action: g },
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
        h.map((b) => t("button", { type: "button", disabled: b.disabled, onClick: () => {
          b.disabled || (b.action(), a());
        } }, b.label))
      )
    )
  );
}
function _i({ issues: e, decisions: n, linearBacklog: a, selectedIssueId: r, addIssueOpen: s, onOpenIssue: l, onIssueAction: c, onResolveDecision: g, onReviewNext: u, onReviewIssue: d, onAddIssue: h, onCloseAddIssue: b, onRefreshLinear: f, onCreateManualIssue: k, onEnqueueLinear: p }) {
  const [v, I] = w(""), T = vt(() => {
    try {
      const E = window.localStorage.getItem("forge.v3.queuePrefs");
      if (!E) return { filter: "all", sort: "priority" };
      const V = JSON.parse(E);
      return {
        filter: ["all", "needs-me", "running", "failed", "watching-pr", "paused"].includes(V.filter) ? V.filter : "all",
        sort: ["priority", "newest", "oldest", "recently-updated"].includes(V.sort) ? V.sort : "priority"
      };
    } catch {
      return { filter: "all", sort: "priority" };
    }
  }, []), [P, L] = w(T.filter), [W, j] = w(T.sort);
  K(() => {
    try {
      window.localStorage.setItem("forge.v3.queuePrefs", JSON.stringify({ filter: P, sort: W }));
    } catch {
    }
  }, [P, W]);
  const [Y, X] = w("linear"), [J, te] = w(""), [$, A] = w(""), [C, F] = w(""), [G, ne] = w(""), [pe, le] = w(""), [Ee, Ne] = w(""), [ke, ge] = w(""), [He, ae] = w(""), ce = vt(() => jo(
    e.filter((E) => to(E) && qo(E, v) && Bo(E, P)),
    W
  ), [e, v, P, W]), ve = vt(() => {
    const E = /* @__PURE__ */ new Map();
    return pn.forEach((V) => E.set(V.key, [])), ce.forEach((V) => {
      var oe;
      return (oe = E.get(ze(V))) == null ? void 0 : oe.push(V);
    }), E.forEach((V, oe) => E.set(oe, Xo(V, oe))), E;
  }, [ce]), qe = vt(() => a.filter((E) => Vo(E, v)).slice(0, 12), [a, v]), Be = Je(), Ie = () => ({ targetKind: pe.trim(), targetPaths: Ee.trim(), avoidPaths: ke.trim(), scopeNotes: He.trim() }), _e = () => {
    le(""), Ne(""), ge(""), ae("");
  }, Re = () => {
    const E = J.trim();
    E && (k(E, $.trim(), Ie()), te(""), A(""), _e(), b());
  }, me = () => {
    const E = C.trim();
    E && (p(E, G.trim(), Ie()), F(""), ne(""), _e(), b());
  };
  return t(At, { view: "queue", className: `forge-v3-queue-shell ${r ? "forge-v3-has-detail" : ""}` }, [
    Be ? t("div", { class: "forge-v3-mock-state-banner" }, t("strong", null, "Mock state fixtures enabled"), t("span", null, "Review every Forge state without touching real issues."), t("button", { type: "button", onClick: ro }, "Exit mock data")) : null,
    t(
      "section",
      { id: "queue-toolbar", class: "forge-v3-command-center", "aria-label": "Queue toolbar" },
      t(
        "div",
        { class: "forge-v3-toolbar-actions forge-v3-left-tools" },
        t("input", { type: "search", placeholder: "Search issues, IDs, branch", "aria-label": "Search issues", value: v, onInput: (E) => I(E.target.value) }),
        t(
          "div",
          { class: "forge-v3-filter-chips", "aria-label": "Queue filters" },
          Qr.map((E) => t("button", { key: E.key, type: "button", class: P === E.key ? "active" : "", onClick: () => L(E.key) }, E.label))
        )
      ),
      t(
        "div",
        { class: "forge-v3-toolbar-actions" },
        t("select", { "aria-label": "Sort issues", value: W, onChange: (E) => j(E.target.value) }, Jr.map((E) => t("option", { key: E.key, value: E.key }, E.label))),
        t("button", { type: "button", disabled: n.length === 0, onClick: u }, "⚡ Review next", n.length ? ` (${n.length})` : ""),
        t("button", { type: "button", title: "Refresh Linear", onClick: f }, "↻ Sync"),
        t("button", { type: "button", disabled: !0 }, "⌘ Command"),
        Be ? null : t("button", { type: "button", onClick: ao }, "Mock states"),
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
          t("button", { type: "button", class: Y === "linear" ? "active" : "", onClick: () => X("linear") }, "Linear issue"),
          t("button", { type: "button", class: Y === "manual" ? "active" : "", onClick: () => X("manual") }, "Manual issue")
        ),
        t(
          "div",
          { class: "forge-v3-add-issue-body" },
          Y === "linear" ? [
            t("label", null, "Linear ID", t("input", { type: "text", placeholder: "TEAM-1234", value: C, onInput: (E) => F(E.target.value) })),
            t("label", null, "Planning guidance", t("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: G, onInput: (E) => ne(E.target.value) }))
          ] : [
            t("label", null, "Title", t("input", { type: "text", placeholder: "Manual issue title", value: J, onInput: (E) => te(E.target.value) })),
            t("label", null, "Description", t("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: $, onInput: (E) => A(E.target.value) }))
          ],
          t(
            "div",
            { class: "forge-v3-scope-grid" },
            t("label", null, "Target kind", t("input", { type: "text", placeholder: "backend-shared, pricing-frontend, fullstack…", value: pe, onInput: (E) => le(E.target.value) })),
            t("label", null, "Target paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. functions/", value: Ee, onInput: (E) => Ne(E.target.value) })),
            t("label", null, "Avoid paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. frontend/apps/pricing/", value: ke, onInput: (E) => ge(E.target.value) })),
            t("label", null, "Scope notes", t("textarea", { rows: 2, placeholder: "Generic shared endpoint; do not describe as pricing-scoped.", value: He, onInput: (E) => ae(E.target.value) }))
          )
        ),
        t(
          "footer",
          null,
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: b }, "Cancel"),
          Y === "linear" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !C.trim(), onClick: me }, "Enqueue Linear issue") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !J.trim(), onClick: Re }, "Create manual issue")
        )
      )
    ) : null,
    t(
      "div",
      { class: "forge-v3-pipeline-wrap" },
      t(
        "section",
        { id: "pipeline-wrapper", class: "forge-v3-pipeline", "aria-label": "Issue pipeline" },
        pn.map((E) => {
          const V = ve.get(E.key) ?? [], oe = E.key === "available" ? V.length + qe.length : V.length;
          return t(
            "section",
            { key: E.key, class: "forge-v3-pipeline-column", "data-stage": E.key },
            t(
              "header",
              { class: `forge-v3-col-head ${E.key === "awaiting" ? "needs-head" : ""}` },
              t("span", { class: `forge-v3-col-label ${E.key === "awaiting" ? "needs" : ""}` }, E.key === "available" ? E.label : `${za(E.key)} ${E.label}`),
              E.key === "available" ? t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: f }, "↻ Sync") : null,
              t("span", { class: `forge-v3-col-count ${oe && E.key === "awaiting" ? "bad" : ""}` }, String(oe))
            ),
            t(
              "div",
              { class: `forge-v3-col-cards forge-v3-pipeline-list ${E.key === "available" ? "forge-v3-available-split" : ""}` },
              E.key === "available" ? [
                t(
                  "div",
                  { class: "forge-v3-available-backlog" },
                  qe.length ? qe.map((Z) => t(fi, { key: Z.identifier, issue: Z, onEnqueue: p })) : t("p", { class: "forge-v3-empty" }, v ? "No Linear issues match" : "No available Linear issues")
                ),
                t("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                t(
                  "div",
                  { class: "forge-v3-available-queued" },
                  V.length ? V.map((Z) => t(ka, { key: Z.id, issue: Z, selected: r === Z.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d })) : t("p", { class: "forge-v3-empty" }, v || P !== "all" ? "No queued issues match" : "No queued issues")
                )
              ] : V.length === 0 ? t("p", { class: "forge-v3-empty" }, v || P !== "all" ? "No issues match the active filters" : "No issues") : V.map((Z) => t(ka, { key: Z.id, issue: Z, selected: r === Z.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d }))
            )
          );
        })
      )
    )
  ]);
}
function Bt(e) {
  return e.includes("limit") || e.includes("seconds") || e.includes("rounds") || e.endsWith("_max") || e === "dashboard_port" ? "number" : e.startsWith("enable_") || e.startsWith("use_") || e.endsWith("_enabled") || e.includes("reuse") || e.includes("use_desktop") ? "checkbox" : "text";
}
function vn(e) {
  var n;
  return ((n = Ua[e]) == null ? void 0 : n.label) ?? e;
}
function Ia(e) {
  var a;
  const n = (a = Ua[e]) == null ? void 0 : a.hint;
  return n ? `${n} · DB key: ${e}` : `Unrecognized setting · DB key: ${e}`;
}
function mi(e, n) {
  return n.keys.filter((a) => Object.prototype.hasOwnProperty.call(e, a)).map((a) => ({ key: a, value: e[a] ?? "" }));
}
function _n(e, n) {
  return jr.has(e) ? n === "true" ? "true" : "false" : n;
}
function ya(e, n, a) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => a || yn.has(r)).map(([r, s]) => [r, _n(r, s ?? "")]).filter(([r, s]) => _n(String(r), e[String(r)] ?? "") !== s));
}
function hi(e, n) {
  const a = [];
  return Object.entries(e).forEach(([r, s]) => {
    if (!n && !yn.has(r) || !Br.has(r)) return;
    const l = String(s ?? "").trim();
    (!l || !Number.isFinite(Number(l)) || Number(l) < 0) && a.push(`${vn(r)} must be a non-negative number.`);
  }), a;
}
function bi() {
  const [e, n] = w({}), [a, r] = w({}), [s, l] = w(null), [c, g] = w(""), [u, d] = w(""), [h, b] = w("Loading settings…"), [f, k] = w([]), [p, v] = w(!1), I = () => {
    se("/api/desktop-backend").then((A) => {
      l(A), g(A.backendOrigin ?? ""), d("");
    }).catch(() => {
      l(null), d("Desktop backend switching is available in the Forge desktop app.");
    });
  };
  K(() => {
    let A = !1;
    return se("/api/settings").then((C) => {
      A || (n(C), r(C), k([]), b(""));
    }).catch(() => {
      A || b("Unable to load settings");
    }), I(), () => {
      A = !0;
    };
  }, []);
  const T = (A, C) => {
    r((F) => ({ ...F, [A]: _n(A, C) })), k((F) => F.filter((G) => !G.includes(vn(A))));
  }, P = () => {
    d("Saving backend…"), fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: c })
    }).then((A) => A.ok ? A.json() : Promise.reject(new Error("backend failed"))).then((A) => {
      l(A), g(A.backendOrigin ?? c), d("Backend saved. Refresh if the dashboard did not reconnect automatically.");
    }).catch(() => d("Unable to save desktop backend"));
  }, L = () => {
    const A = hi(a, p);
    if (A.length) {
      k(A), b("Fix validation errors before saving");
      return;
    }
    const C = ya(e, a, p);
    if (Object.keys(C).length === 0) {
      b("No settings changed");
      return;
    }
    b(`Saving ${Object.keys(C).length} changed setting${Object.keys(C).length === 1 ? "" : "s"}…`), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(C)
    }).then((F) => F.json().then((G) => F.ok ? G : Promise.reject(new Error((G == null ? void 0 : G.error) ?? "Unable to save settings")))).then((F) => {
      const G = F.settings ?? { ...e, ...C };
      n(G), r(G), k([]), b("Settings saved");
    }).catch((F) => b(F.message || "Unable to save settings"));
  }, W = () => {
    r(e), k([]), b("Reset changes");
  }, j = Object.entries(a).filter(([A]) => !yn.has(A)).map(([A, C]) => ({ key: A, value: C ?? "" })), Y = ya(e, a, p), X = Object.keys(Y).length, J = [...Xt, { label: "Other", keys: [] }], te = (A, C = !1) => {
    if (A.key.includes("context") || A.key.includes("prompt") || A.key.includes("command"))
      return t("textarea", { class: "forge-v3-setting-control", value: A.value, rows: A.key === "project_prompt_overlay" ? 8 : 3, placeholder: da[A.key], disabled: C, readOnly: C, onInput: (G) => T(A.key, G.target.value) });
    const F = Bt(A.key);
    return t("input", { class: "forge-v3-setting-control", type: Bt(A.key), checked: F === "checkbox" ? A.value === "true" : void 0, value: F === "checkbox" ? void 0 : A.value, placeholder: da[A.key], disabled: C, readOnly: C, min: F === "number" ? "0" : void 0, onInput: (G) => {
      const ne = G.target;
      T(A.key, F === "checkbox" ? String(ne.checked) : ne.value);
    } });
  }, $ = () => t(
    "div",
    { key: "desktop-backend-origin", class: "forge-v3-setting-row forge-v3-desktop-backend-row" },
    t("span", null, "Desktop backend origin"),
    t("small", null, u || (s != null && s.configFile ? `Stored in ${s.configFile}` : "All v3 dashboard reads and writes go through this backend.")),
    t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("input", { class: "forge-v3-setting-control", type: "url", value: c, placeholder: "http://127.0.0.1:3142", disabled: !s, onInput: (A) => g(A.target.value) }),
      t("button", { type: "button", disabled: !s, onClick: P }, "Use backend"),
      t("a", { class: "forge-v3-btn-primary", href: "/desktop/backend" }, "Switch page")
    )
  );
  return t(At, { view: "settings", className: "forge-v3-settings-wrap" }, [
    t(Kt, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("a", { class: "forge-v3-btn-primary", href: "/classic.html" }, "Open classic v2"),
      t("button", { type: "button", onClick: W }, "↺ Reset changes")
    ) }),
    h ? t("p", { class: `forge-v3-empty ${f.length ? "forge-v3-settings-error" : ""}` }, h) : null,
    f.length ? t("ul", { class: "forge-v3-settings-errors" }, f.map((A) => t("li", { key: A }, A))) : null,
    t("p", { class: "forge-v3-settings-helper" }, X ? `${X} changed setting${X === 1 ? "" : "s"} will be saved.` : "Only settings you change will be sent on save."),
    t(
      "section",
      { class: "forge-v3-settings-grid", "aria-label": "Settings groups" },
      J.map((A) => {
        const C = A.label === "Other" ? j : mi(a, A), F = [
          ...A.label === "Dashboard Backend" ? [$()] : [],
          ...C.map((G) => {
            const ne = A.label === "Other", pe = Xr.has(G.key);
            return t(
              "label",
              { key: G.key, class: `forge-v3-setting-row ${ne ? "forge-v3-setting-unknown" : ""} ${pe ? "forge-v3-setting-runtime" : ""}` },
              t("span", null, vn(G.key), ne && !p ? t("em", null, " read-only") : null),
              t("small", null, pe ? `${Ia(G.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : Ia(G.key)),
              te(G, ne && !p)
            );
          })
        ];
        return t(
          "section",
          { key: A.label, class: "forge-v3-settings-card forge-v3-settings-group" },
          t(
            "header",
            null,
            t("div", null, t("h2", null, A.label), t("p", null, Hr[A.label])),
            A.label === "Other" ? t("label", { class: "forge-v3-other-unlock" }, t("input", { type: "checkbox", checked: p, onInput: (G) => v(G.target.checked) }), " Edit unknown") : t("span", null, String(F.length))
          ),
          F.length === 0 ? t("p", { class: "forge-v3-empty" }, "No settings in this group.") : F
        );
      })
    ),
    t(
      "div",
      { class: "forge-v3-settings-save-bar" },
      t("button", { type: "button", class: "forge-v3-btn-primary", disabled: X === 0, onClick: L }, X ? `Save ${X} change${X === 1 ? "" : "s"}` : "Save settings"),
      h === "Settings saved" ? t("span", { class: "forge-v3-saved-indicator" }, "✓ Saved") : null
    )
  ]);
}
function ki() {
  const [e, n] = w("suggestions"), [a, r] = w({ suggestions: [], events: [], changes: [] }), [s, l] = w("Loading learnings…"), c = () => {
    se("/api/learnings").then((u) => {
      r({ suggestions: u.suggestions ?? [], events: u.events ?? [], changes: u.changes ?? [] }), l("");
    }).catch(() => l("Unable to load learnings"));
  };
  K(() => {
    c();
    const u = window.setInterval(c, 3e4), d = typeof EventSource < "u" ? new EventSource("/api/events") : null;
    return d == null || d.addEventListener("message", (h) => {
      try {
        const b = JSON.parse(h.data);
        String(b.type ?? "").startsWith("learning_") && c();
      } catch {
      }
    }), () => {
      window.clearInterval(u), d == null || d.close();
    };
  }, []);
  const g = (u, d) => {
    r((h) => ({ ...h, suggestions: h.suggestions.filter((b) => b.id !== u) })), fetch(`/api/learnings/${u}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: d })
    }).then((h) => h.ok ? c() : Promise.reject(new Error("resolve failed"))).catch(() => {
      l("Unable to resolve learning suggestion"), c();
    });
  };
  return t(At, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    t(Kt, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
    t(
      "nav",
      { class: "forge-v3-learning-tabs", "aria-label": "Learning tabs" },
      Kr.map((u) => t("button", { key: u.key, type: "button", class: e === u.key ? "active" : "", onClick: () => n(u.key) }, u.label))
    ),
    s ? t("p", { class: "forge-v3-empty" }, s) : null,
    e === "suggestions" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning suggestions" },
      a.suggestions.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning suggestions.") : a.suggestions.map((u) => t(
        "article",
        { key: u.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? `Issue #${u.issue_id ?? "—"}`, " · ", u.target ?? "target", " · Added ", u.created_at ? `${he(u.created_at)} ago (${rn(u.created_at)})` : "date unknown"),
        t("h2", null, u.suggestion ?? "Untitled suggestion"),
        t("p", null, u.rationale ?? "No rationale provided."),
        t(
          "div",
          { class: "forge-v3-toolbar-actions" },
          t("button", { type: "button", onClick: () => g(u.id, "applied") }, "Apply suggestion"),
          t("button", { type: "button", onClick: () => g(u.id, "rejected") }, "Reject suggestion")
        )
      ))
    ),
    e === "changes" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning change log" },
      a.changes.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning changes yet.") : a.changes.map((u) => t(
        "article",
        { key: u.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? "Global", " · ", u.target ?? "target", " · ", u.change_type ?? "change", " · ", u.created_at ? rn(u.created_at) : "date unknown"),
        t("h2", null, u.change_summary ?? "Learning change"),
        t("p", null, u.reason ?? "No reason recorded.")
      ))
    ),
    e === "reflections" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Reflection history" },
      a.events.length === 0 ? t("p", { class: "forge-v3-empty" }, "No reflection history yet.") : a.events.map((u) => t(
        "article",
        { key: u.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? "Global", " · ", u.event_type ?? "reflection", " · ", u.created_at ? rn(u.created_at) : "date unknown"),
        t("h2", null, u.summary ?? "Reflection event")
      ))
    )
  ]);
}
function Ii() {
  const [e, n] = w(() => Object.fromEntries(
    an.map((p) => [p, { type: p, content: "", status: "Loading…" }])
  )), [a, r] = w({}), [s, l] = w("Loading models…"), c = (p) => {
    fetch(`/api/agents/${p}/prompt`).then((v) => v.ok ? v.text() : Promise.reject(new Error("prompt failed"))).then((v) => n((I) => ({ ...I, [p]: { type: p, content: v, status: "Loaded" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to load prompt" } })));
  }, g = () => {
    se("/api/settings").then((p) => {
      r(p), l("Models loaded");
    }).catch(() => l("Unable to load model settings"));
  };
  K(() => {
    an.forEach(c), g();
  }, []);
  const u = (p, v) => n((I) => ({ ...I, [p]: { ...I[p], content: v, status: "Unsaved" } })), d = (p, v) => {
    r((I) => ({ ...I, [p]: v })), l("Unsaved model change");
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
  }, f = (p) => {
    fetch(`/api/agents/${p}/prompt/default`).then((v) => v.ok ? v.text() : Promise.reject(new Error("default failed"))).then((v) => n((I) => ({ ...I, [p]: { type: p, content: v, status: "Reset to default" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to reset prompt" } })));
  }, k = a.model ?? a.default_model ?? "";
  return t(At, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    t(Kt, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place" }),
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
        t("input", { class: "forge-v3-prompt-model-input", value: k, placeholder: "anthropic-vertex/sonnet-4-6", onInput: (p) => d("model", p.target.value) }),
        t("button", { type: "button", onClick: () => h("model") }, "Save default")
      )
    ),
    t(
      "section",
      { class: "forge-v3-prompts-grid", "aria-label": "Agent prompt editors" },
      an.map((p) => {
        const v = e[p], I = v.content.length, T = Ma[p], P = a[T] ?? "";
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
              t("p", { class: "forge-v3-prompt-meta" }, "Prompt: ", v.status, " · Model: ", P.trim() ? "override" : "default")
            ),
            p === "coder" ? t("span", { class: "forge-v3-prompt-meta" }, "learned-rules") : null
          ),
          t(
            "div",
            { class: "forge-v3-prompt-model-row" },
            t("label", { class: "forge-v3-prompt-meta" }, "Model override"),
            t("input", { class: "forge-v3-prompt-model-input", value: P, placeholder: k || "Use default model", onInput: (L) => d(T, L.target.value) }),
            t("button", { type: "button", onClick: () => h(T) }, "Save model")
          ),
          t("textarea", { class: "forge-v3-prompt-editor", value: v.content, rows: 12, onInput: (L) => u(p, L.target.value) }),
          t(
            "footer",
            { class: "forge-v3-prompt-meta" },
            t("span", null, String(I), " chars"),
            t(
              "div",
              { class: "forge-v3-toolbar-actions" },
              t("button", { type: "button", onClick: () => f(p) }, "Reset to default"),
              t("button", { type: "button", onClick: () => b(p) }, "Save prompt")
            )
          )
        );
      })
    )
  ]);
}
function yi(e) {
  if (!e) return !1;
  const n = Ye(e);
  return Number.isFinite(n) && Date.now() - n <= 10080 * 60 * 1e3;
}
function Ai(e) {
  const n = (e.prStack ?? []).map((a) => [a.pr_number ? `#${a.pr_number}` : "", a.gt_branch, a.branch, a.status].filter(Boolean).join(" ")).join(" ");
  return [e.linear_id, e.title, e.state, e.updated_at, n].filter(Boolean).join(" ").toLowerCase();
}
function wi({ issue: e, onClose: n }) {
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
function Pi() {
  const [e, n] = w(null), [a, r] = w(null), [s, l] = w(""), [c, g] = w(null);
  K(() => {
    let I = !1;
    return se("/api/archive").then((T) => {
      I || n(T);
    }).catch(() => {
      I || r("Unable to load archive");
    }), () => {
      I = !0;
    };
  }, []);
  const u = e ?? [], d = s.trim().toLowerCase(), h = d ? u.filter((I) => Ai(I).includes(d)) : u, b = c ? u.find((I) => I.id === c) ?? null : null, f = h.length, k = h.filter((I) => yi(I.merged ?? I.updated_at)).length, p = f ? (h.reduce((I, T) => {
    var P;
    return I + Number(T.pr_count ?? ((P = T.prStack) == null ? void 0 : P.length) ?? 0);
  }, 0) / f).toFixed(1) : "0.0", v = (() => {
    const I = h.filter((L) => L.created_at && (L.merged ?? L.updated_at)).map((L) => {
      const W = Ye(L.created_at), j = Ye(L.merged ?? L.updated_at);
      return Number.isFinite(W) && Number.isFinite(j) ? j - W : 0;
    }).filter((L) => L > 0);
    if (!I.length) return "—";
    const T = I.reduce((L, W) => L + W, 0) / I.length, P = Math.round(T / 36e5);
    return P < 24 ? `${P}h` : `${(P / 24).toFixed(1)}d`;
  })();
  return t(At, { view: "archive", className: `forge-v3-archive-wrap ${b ? "forge-v3-has-archive-detail" : ""}` }, [
    t(Kt, { icon: "🗃️", title: "Archive", subtitle: `${f} completed issues${d ? ` matching "${s.trim()}"` : ""} — all PRs merged`, actions: t("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: s, onInput: (I) => l(I.target.value) }) }),
    t(
      "section",
      { class: "forge-v3-archive-stats forge-v3-stats-strip", "aria-label": "Archive stats" },
      t("article", null, t("span", null, "Total completed"), t("strong", null, String(f))),
      t("article", null, t("span", null, "Completed this week"), t("strong", null, String(k))),
      t("article", null, t("span", null, "Average time to merge"), t("strong", null, v)),
      t("article", null, t("span", null, "Average PRs per issue"), t("strong", null, p))
    ),
    a ? t("p", { class: "forge-v3-empty" }, "Unable to load archive") : e === null ? t("p", { class: "forge-v3-empty" }, "Loading archive…") : u.length === 0 ? t("p", { class: "forge-v3-empty" }, "No completed issues yet") : h.length === 0 ? t("p", { class: "forge-v3-empty" }, "No archived issues match your search") : t(
      "section",
      { class: "forge-v3-archive-grid forge-v3-archive-list", "aria-label": "Completed issues" },
      h.map((I) => {
        var T;
        return t(
          "article",
          { key: I.id, class: `forge-v3-archive-card ${c === I.id ? "is-selected" : ""}`, tabIndex: 0, role: "button", onClick: () => g(I.id), onKeyDown: (P) => {
            (P.key === "Enter" || P.key === " ") && (P.preventDefault(), g(I.id));
          } },
          t("div", { class: "forge-v3-archive-meta" }, I.linear_id ?? `Issue #${I.id}`, " · ", I.updated_at ?? "merged"),
          t("h2", null, I.title ?? "Untitled issue"),
          t("div", { class: "forge-v3-archive-meta" }, "PR links", ": ", (T = I.prStack) != null && T.length ? I.prStack.map((P, L) => {
            const W = P.pr_number ? `#${P.pr_number}` : P.gt_branch ?? P.branch ?? "pending";
            return P.url ? t("a", { key: `${W}-${L}`, href: P.url, target: "_blank", rel: "noreferrer", onClick: (j) => j.stopPropagation() }, W) : t("span", { key: `${W}-${L}` }, W);
          }) : "None"),
          t("div", { class: "forge-v3-archive-meta" }, "Agent runs", ": ", String(I.run_count ?? 0)),
          t("div", { class: "forge-v3-archive-meta" }, "Summary", ": ", I.summaryContent || I.hasSummary ? "available" : "not generated")
        );
      })
    ),
    b ? t(wi, { issue: b, onClose: () => g(null) }) : null
  ]);
}
function Ei({ issueId: e, issuePreview: n, reloadKey: a, autoOpenDiffKey: r, onClose: s, onPanelResizeStart: l, onIssueAction: c, onRemoveIssue: g, onLaunchRuntime: u, onStopVm: d, onSyncPrs: h, onSubmitFeedback: b, onResolveDecision: f }) {
  var Wn, Dn, On, Fn, Vn, Un, Mn, Hn;
  const [k, p] = w(() => Ht().detailTab), [v, I] = w(null), [T, P] = w(!1), [L, W] = w(!1), [j, Y] = w(""), [X, J] = w(""), te = Ue(0), [$, A] = w(""), [C, F] = w(!1), [G, ne] = w(null), [pe, le] = w(""), [Ee, Ne] = w([]), [ke, ge] = w([]), [He, ae] = w(""), [ce, ve] = w([]), [qe, Be] = w([]), [Ie, _e] = w(!1), [Re, me] = w(!1), [E, V] = w("idle"), [oe, Z] = w([]), [lt, wt] = w(""), [ct, et] = w(""), [Pt, tt] = w(!1), [nt, at] = w(""), [dt, m] = w([]), [N, R] = w(""), [O, D] = w(""), q = Ue(null);
  if (K(() => {
    var _;
    if (!e) {
      I(null), P(!1), W(!1), me(!1), _e(!1);
      return;
    }
    I(n ? { issue: n } : null);
    const i = Ht();
    p(i.detailTab), P(i.panel === "plan"), W(i.panel === "diff" || i.panel === "review"), me(i.panel === "listen"), _e(i.panel === "jump"), Z([]), V("idle"), Y(""), J(i.panel === "diff" || i.panel === "review" ? "Loading diff…" : ""), A(i.diffPath), F(i.panel === "review"), ne(null), le(""), Ne([]), ge([]), ae(""), ve([]), Be([]), wt(""), et(""), tt(!1), at(""), m([]), R(""), D(""), (_ = q.current) == null || _.abort(), q.current = null;
  }, [e]), K(() => {
    if (!e) return;
    let i = !1;
    return se(`/api/issues/${e}?fast=1`).then((_) => {
      i || I(_);
    }).catch(() => {
      i || I({ issue: { id: e, title: "Unable to load issue" } });
    }), () => {
      i = !0;
    };
  }, [e, a]), K(() => {
    if (!e) return;
    qt({ view: "queue", issue: e, tab: k === "overview" ? null : k, panel: L ? C ? "review" : "diff" : T ? "plan" : Re ? "listen" : Ie ? "jump" : null, diffPath: L ? $ : null });
  }, [e, k, T, L, Re, Ie, C, $]), K(() => {
    var y;
    const i = (y = v == null ? void 0 : v.decisions) == null ? void 0 : y.find((S) => S.type === "FIX_APPROVAL"), _ = Wt(i).comments ?? [];
    ve(_.map((S, M) => pt(S, M)));
  }, [v == null ? void 0 : v.decisions]), K(() => {
    var i;
    tt(!!((i = v == null ? void 0 : v.issue) != null && i.auto_fix_enabled));
  }, [(Wn = v == null ? void 0 : v.issue) == null ? void 0 : Wn.auto_fix_enabled]), K(() => {
    if (!Re || !e) return;
    if (Je()) {
      V("mock live"), Z([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    V("connecting…"), Z([]);
    const i = new EventSource(`/api/issues/${e}/listen`);
    return i.addEventListener("meta", (_) => {
      const y = JSON.parse(_.data);
      V(y.agentType ? `live · ${y.agentType}` : "live");
    }), i.addEventListener("message", (_) => {
      const y = JSON.parse(_.data), S = y.kind ?? "text", M = (y.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!M) return;
      const U = S === "text_delta" || S === "thinking_delta";
      Z((ue) => {
        const De = ue[ue.length - 1];
        return U && De && De.kind === S ? [...ue.slice(0, -1), { kind: S, text: De.text + M }] : [...ue.slice(-200), { kind: S, text: M }];
      });
    }), i.addEventListener("done", (_) => {
      const y = JSON.parse(_.data);
      V(y.exitCode === 0 ? "done" : `failed (${y.exitCode ?? "unknown"})`), i.close();
    }), i.addEventListener("error", () => V("no active agent")), i.onerror = () => V("disconnected"), () => i.close();
  }, [Re, e]), K(() => {
    !e || r <= 0 || (F(!0), W(!0), J("Loading diff…"));
  }, [r, e]), K(() => {
    if (!e || !L || X !== "Loading diff…") return;
    const i = ++te.current;
    C && (le("Loading AI tour…"), se(`/api/issues/${e}/tour`).then((_) => {
      i === te.current && (ne(_), le(_.generating ? "AI tour is generating…" : _.tour ? "" : "No AI tour yet"));
    }).catch(() => {
      i === te.current && le("Unable to load AI tour");
    })), se(`/api/issues/${e}/diff`).then((_) => {
      if (i !== te.current) return;
      const y = _.diff ?? "", S = sn(y);
      Y(y), A((M) => {
        var U;
        return M || ((U = S[0]) == null ? void 0 : U.path) || "";
      }), J(_.error ?? "");
    }).catch(() => {
      i === te.current && J("Unable to load diff");
    });
  }, [L, X, e, C]), K(() => {
    if (!L) return;
    const i = (_) => {
      const y = _.target;
      if (y.tagName === "INPUT" || y.tagName === "TEXTAREA" || y.tagName === "SELECT") return;
      const S = sn(j);
      if (!S.length) return;
      const M = S.findIndex((U) => U.path === $);
      if (_.key === "j" || _.key === "J") {
        _.preventDefault();
        const U = Math.min(M + 1, S.length - 1);
        A(S[U].path);
      } else if (_.key === "k" || _.key === "K") {
        _.preventDefault();
        const U = Math.max(M - 1, 0);
        A(S[U].path);
      } else _.key === "r" && C && $ ? (_.preventDefault(), Ne((U) => U.includes($) ? U.filter((ue) => ue !== $) : [...U, $])) : _.key === "a" && C && $ && (_.preventDefault(), zt($, null));
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [L, j, $, C]), !e) return null;
  const o = v == null ? void 0 : v.issue, H = ((v == null ? void 0 : v.decisions) ?? []).filter((i) => !i.verdict && !i.resolved_at && !qe.includes(i.id)), B = (v == null ? void 0 : v.prStack) ?? [], ye = o ?? {}, er = () => me(!0), rt = yo(ye, H), ee = Ba(H), Qt = Eo(o == null ? void 0 : o.state), tr = `${An(o == null ? void 0 : o.priority)} ${wn(o == null ? void 0 : o.priority)}`, nr = Xa(v), ar = Ka(v), Et = So(v), rr = Ro(v) && !["PENDING", "SETTING_UP", "PLANNING"].includes((o == null ? void 0 : o.state) ?? "") || Et, or = To(o == null ? void 0 : o.state), ir = Co(o == null ? void 0 : o.state), sr = Lo(o), lr = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes((o == null ? void 0 : o.state) ?? ""), cr = { label: "Plan" }, Nn = async () => {
    if (!(o != null && o.id)) return;
    const i = await Pe({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    i != null && i.trim() && c(o.id, "steer", { instructions: i.trim() });
  }, dr = async () => {
    !(o != null && o.id) || !await mt({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" }) || c(o.id, "clear-steer");
  }, ur = Zr.filter((i) => i.state !== (o == null ? void 0 : o.state)), fr = async (i) => {
    if (!(o != null && o.id)) return;
    const _ = o.linear_id ?? `issue #${o.id}`, y = i.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    await mt({ title: "Jump workflow state?", message: `Move ${_} to ${i.state}?${y}`, confirmText: "Jump state", danger: i.risky }) && (_e(!1), c(o.id, "advance", { nextState: i.state }));
  }, pr = async () => {
    var ue;
    if (!(o != null && o.id)) return;
    const i = Yr(o.state), y = { SETTING_UP: "setup", PLANNING: "planner", AI_PLAN_REVIEWING: "plan-reviewer", WORKING: "coder", AI_REVIEWING: "reviewer", CREATING_PR: "git-agent", FIXING: "fixer", PUSHING: "git-agent", REBASING: "rebaser", SPLIT_PLANNING: "split-planner", SPLITTING: "splitter" }[i] ?? null, S = y ? ` Forge will run the ${y} agent next.` : "", M = (ue = o.state) != null && ue.startsWith("AWAITING") ? " This skips the pending human approval gate." : "";
    await mt({ title: "Advance workflow state?", message: `Move ${o.linear_id ?? `issue #${o.id}`} from "${Ze(o)}" to "${Ze({ state: i })}"?${S}${M}`, confirmText: "Advance" }) && c(o.id, "advance", { nextState: i });
  }, gr = async () => {
    !(o != null && o.id) || await Pe({ title: "Full reset issue", message: `This fully resets ${o.linear_id ?? `issue #${o.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: !0, requiredText: "RESET" }) !== "RESET" || c(o.id, "reset");
  }, vr = async () => {
    !(o != null && o.id) || await Pe({ title: "Remove issue", message: `Remove ${o.linear_id ?? `issue #${o.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: !0, requiredText: "DELETE" }) !== "DELETE" || g(o.id);
  }, _r = () => {
    o != null && o.id && (et("Launching runtime…"), u(o.id).then((i) => et(`Runtime launch complete${typeof i == "object" && i && "launchRef" in i ? ` · ${i.launchRef ?? "started"}` : ""}`)).catch((i) => et(`Runtime launch failed: ${i.message}`)));
  }, mr = (i) => {
    if (!(o != null && o.id)) return;
    const _ = Pt;
    tt(i), c(o.id, "set-auto-fix", { enabled: i }), window.setTimeout(() => {
      var y;
      !Je() && ((y = v == null ? void 0 : v.issue) == null ? void 0 : y.auto_fix_enabled) === _ && tt(_);
    }, 2e3);
  }, hr = async () => {
    var M;
    if (!(o != null && o.id)) return;
    const i = B.filter((U) => U.pr_number).map((U) => String(U.pr_number)), _ = i.length ? await Pe({ title: "Target PR", message: `Choose a PR number (${i.join(", ")}).`, label: "PR number", initialValue: i[0], confirmText: "Continue" }) : null, y = _ != null && _.trim() ? Number(_.trim().replace(/^#/, "")) : null, S = (M = await Pe({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" })) == null ? void 0 : M.trim();
    S && b(o.id, S, Number.isFinite(y) ? y : null);
  }, br = (i = !1) => {
    if (!(o != null && o.id)) return;
    le(i ? "Regenerating AI tour…" : "Generating AI tour…");
    const _ = () => be(`/api/issues/${o.id}/generate-tour`, {});
    (i ? be(`/api/issues/${o.id}/tour`, {}, "DELETE").then(_) : _()).then((y) => {
      ne(y), le(y.tour ? "" : "AI tour is generating…");
    }).catch(() => le("Unable to start AI tour generation"));
  }, Jt = (i = "diff") => {
    o != null && o.id && (te.current += 1, F(i === "review"), ne(null), le(i === "review" ? "Loading AI tour…" : ""), Y(""), A(""), W(!0), J("Loading diff…"));
  }, Nt = sn(j), de = Nt.find((i) => i.path === $) ?? Nt[0], We = H.find((i) => i.type === "PLAN_REVIEW") ?? (ee === "plan" ? H[0] : void 0), ut = H.find((i) => i.type === "CODE_REVIEW") ?? (ee === "code" ? H[0] : void 0), Se = H.find((i) => i.type === "FIX_APPROVAL") ?? (ee === "fix" ? H[0] : void 0), Rt = H.find((i) => i.type === "FIX_REVIEW") ?? (ee === "fix-review" ? H[0] : void 0), Te = H.find((i) => i.type === "SPLIT_APPROVAL") ?? (ee === "split" ? H[0] : void 0), ft = Wt(Se).comments ?? [], kr = Wt(Te), St = _o(Te, kr, v), Rn = St.stack, Sn = Io(o == null ? void 0 : o.state), Tn = Sn ? H.filter((i) => i.type && i.type !== Sn) : H.filter((i) => i.type), zt = async (i, _) => {
    var S;
    const y = (S = await Pe({ title: "Add review comment", message: _ === null ? `Comment on ${i}` : `Comment on ${i}:${_}`, label: "Comment", confirmText: "Add comment" })) == null ? void 0 : S.trim();
    y && ge((M) => [...M, { id: `${Date.now()}-${M.length}`, file: i, line: _, body: y }]);
  }, Cn = (i) => Ne((_) => _.includes(i) ? _.filter((y) => y !== i) : [..._, i]), Ae = (i, _, y) => {
    Be((S) => S.includes(i) ? S : [...S, i]), f(i, _, y);
  }, Ln = async () => {
    var _;
    if (!We) return;
    const i = (_ = await Pe({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" })) == null ? void 0 : _.trim();
    Ae(We.id, "approved", i ? { steeringComment: i } : void 0);
  }, je = async (i, _) => {
    const y = await Pe({ title: `Request ${_} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: !0 });
    y != null && y.trim() && Ae(i.id, "rejected", { reason: y.trim() });
  }, Ir = (i) => ve((_) => _.includes(i) ? _.filter((y) => y !== i) : [..._, i]), Yt = () => {
    if (!Se) return;
    const i = ft.map((_, y) => pt(_, y));
    ve([]), Ae(Se.id, "rejected", { skippedIds: i, reason: "Skipped all PR comments" });
  }, Gn = () => {
    if (!Se) return;
    const i = ft.map((S, M) => pt(S, M)), _ = ce;
    if (!_.length) {
      Yt();
      return;
    }
    const y = i.filter((S) => !_.includes(S));
    Ae(Se.id, "approved", { approvedIds: _, skippedIds: y });
  }, xn = (i) => {
    ut && (Ae(ut.id, i, {
      kind: "code-review",
      summary: He.trim(),
      reviewedFiles: Ee,
      comments: ke.map(({ file: _, line: y, body: S }) => ({ file: _, line: y, body: S }))
    }), ae(""));
  }, $n = () => {
    if (!(o != null && o.id) || !nt.trim() || N === "thinking") return;
    const i = nt.trim();
    at(""), R("thinking"), D("Gathering issue context…"), m((y) => [...y, { role: "user", text: i }, { role: "assistant", text: "" }]);
    const _ = new AbortController();
    q.current = _, fetch(`/api/issues/${o.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: i }),
      signal: _.signal
    }).then(async (y) => {
      if (!y.ok || !y.body) throw new Error(`Ask failed (${y.status})`);
      const S = y.body.getReader(), M = new TextDecoder();
      let U = "";
      const ue = (Ce) => m((Le) => {
        const Oe = [...Le].map((Ge) => Ge.role).lastIndexOf("assistant");
        return Oe < 0 ? [...Le, { role: "assistant", text: Ce }] : Le.map((Ge, we) => we === Oe ? { ...Ge, text: Ge.text + Ce } : Ge);
      }), De = (Ce) => D(Ce), yr = (Ce) => {
        const Le = Ce.split(`
`).find((Zt) => Zt.startsWith("event:")), Oe = Ce.split(`
`).find((Zt) => Zt.startsWith("data:"));
        if (!Oe) return;
        const Ge = (Le == null ? void 0 : Le.replace(/^event:\s*/, "")) ?? "message", we = JSON.parse(Oe.replace(/^data:\s*/, ""));
        if (Ge === "done") {
          R(""), D("");
          return;
        }
        if (Ge === "meta") {
          De("Gathered issue context. Starting assistant…");
          return;
        }
        Ge === "message" && ((we.kind === "text_delta" || we.kind === "text") && ue(we.text ?? ""), we.kind === "thinking_delta" && De("Thinking…"), we.kind === "tool" && De((we.text ?? "").trim()), we.kind === "error" && De(`Error: ${(we.text ?? "").trim()}`));
      };
      for (; ; ) {
        const { value: Ce, done: Le } = await S.read();
        if (Le) break;
        U += M.decode(Ce, { stream: !0 });
        const Oe = U.split(`

`);
        U = Oe.pop() ?? "", Oe.forEach(yr);
      }
      R(""), D("");
    }).catch((y) => {
      _.signal.aborted || (R(""), D(y.message));
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
      Mr.map((i) => t("button", { key: i.key, type: "button", class: k === i.key ? "active" : "", onClick: () => p(i.key) }, i.label))
    ),
    t(
      "section",
      { class: "forge-v3-detail-body", "data-tab": k },
      k === "overview" && t(
        "div",
        { class: "forge-v3-detail-overview" },
        t(
          "section",
          { class: "forge-v3-ds" },
          t(
            "div",
            { class: `forge-v3-state-banner ${rt.tone}` },
            rt.icon === "spinner" ? t("span", { class: "forge-v3-spinner forge-v3-state-spinner", "aria-hidden": "true" }) : t("span", { class: "forge-v3-state-icon", "aria-hidden": "true" }, rt.icon),
            t("div", { class: "forge-v3-sb-text" }, t("strong", null, rt.title), t("br", null), rt.text),
            rt.live ? t("span", { class: "forge-v3-live-badge" }, "Live") : null
          ),
          t(
            "div",
            { class: "forge-v3-phase-track", "aria-label": "Workflow phase track" },
            va.map((i, _) => {
              const y = Po(i, v);
              return [
                t(
                  "div",
                  { key: i, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${y.title}: ${y.summary} ${y.stats.join(". ")}` },
                  t("div", { class: `forge-v3-phase-dot ${_ < Qt || (o == null ? void 0 : o.state) === "DONE" ? "done" : _ === Qt ? No(o == null ? void 0 : o.state) ? "wait" : "active" : ""}` }),
                  t("div", { class: "forge-v3-phase-label" }, i),
                  t(
                    "div",
                    { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    t("strong", null, y.title),
                    t("p", null, y.summary),
                    t("ul", null, y.stats.map((S) => t("li", { key: S }, S)))
                  )
                ),
                _ < va.length - 1 ? t("div", { key: `${i}-line`, class: `forge-v3-phase-line ${_ < Qt ? "done" : ""}` }) : null
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
              t("strong", null, `${((Dn = v.failureContext.run) == null ? void 0 : Dn.agent_type) ?? "Agent"} crashed`),
              t(
                "span",
                { class: "forge-v3-failure-meta" },
                ` · exit ${((On = v.failureContext.run) == null ? void 0 : On.exit_code) ?? "?"} · `,
                (Fn = v.failureContext.run) != null && Fn.started_at ? `${he(v.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            (Vn = v.failureContext.run) != null && Vn.id ? t("a", { class: "forge-v3-failure-log-link", href: _t(v.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗") : null
          ),
          v.failureContext.logTail ? t("pre", { class: "forge-v3-failure-log" }, v.failureContext.logTail) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Nn }, "Steer before retry")
          )
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, ee ? "Actions · Decision needed" : "Actions"),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            fe(ye) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: er }, "Listen live") : null,
            ee === "plan" && We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Ln }, "✓ Approve plan") : null,
            ee === "plan" && We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => P(!0) }, "✗ Request changes") : null,
            ee === "code" && ut ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => Jt("review") }, "Review code") : null,
            ee === "fix" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Gn }, `✓ Fix selected (${ce.length})`) : null,
            ee === "fix" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Yt }, "Skip all") : null,
            ee === "fix-review" && Rt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Rt.id, "approved") }, "✓ Approve fix & push") : null,
            ee === "fix-review" && Rt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Rt, "Fix review") }, "✗ Send back to fixer") : null,
            ee === "fix-review" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Jt("diff") }, "Review diff") : null,
            ee === "split" && Te ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Te.id, "approved") }, "✓ Approve split plan") : null,
            ee === "split" && Te ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Te, "Split plan") }, "✗ Revise split") : null,
            ee === "generic" && H[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(H[0].id, "approved") }, "✓ Approve") : null,
            ee === "generic" && H[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(H[0], "Decision") }, "✗ Request changes") : null,
            rr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => P(!0) }, Et ? "View plan / handoff" : "View plan") : null,
            or ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Jt("diff") }, "View diff") : null,
            lr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Nn }, "Steer") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: pr }, "Advance state"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => _e(!0) }, "Jump to state"),
            ir ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              var _;
              if (!(o != null && o.id)) return;
              const i = (_ = await Pe({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" })) == null ? void 0 : _.trim();
              c(o.id, "split-pr-stack", i ? { instructions: i } : {});
            } }, "Split PR") : null,
            sr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              if (!(o != null && o.id)) return;
              await mt({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: !0 }) && c(o.id, "rebase");
            } }, "Rebase") : null,
            (o == null ? void 0 : o.state) === "FAILED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry") : null,
            (o == null ? void 0 : o.state) === "PAUSED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unpause") : void 0 }, "Resume") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes((o == null ? void 0 : o.state) ?? "") ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: hr }, "Add PR feedback") : null,
            fe(ye) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "pause") : void 0 }, "Pause") : null
          )
        ),
        Tn.length ? t(
          "section",
          { class: "forge-v3-ds forge-v3-stale-decisions" },
          t("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          t("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          Tn.map((i) => t("div", { class: "forge-v3-stale-decision-row", key: i.id }, t("span", null, i.type ?? "Decision"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => je(i, "Stale decision") }, "Reject with feedback")))
        ) : null,
        Se ? t(
          "section",
          { class: "forge-v3-ds forge-v3-fix-approval" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "Fix approval"), t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ve(ft.map((i, _) => pt(i, _))) }, "Select all"), t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ve([]) }, "None"))),
          ft.length ? t("div", { class: "forge-v3-fix-comment-list" }, ft.map((i, _) => {
            const y = pt(i, _), S = i.path ? `${i.path}${i.line ? `:${i.line}` : ""}` : "general", U = ja(i) ? mo(i, B) : null;
            return t(
              "label",
              { class: `forge-v3-fix-comment-card ${ce.includes(y) ? "selected" : ""}`, key: y },
              t("input", { type: "checkbox", checked: ce.includes(y), onChange: () => Ir(y) }),
              t(
                "div",
                null,
                t("div", { class: "forge-v3-fix-comment-meta" }, t("strong", null, i.author ?? "Reviewer"), U ? [" · ", t("span", { class: "forge-v3-fix-comment-pr" }, U)] : null, " · ", S),
                ko(i.body),
                t("div", { class: "forge-v3-fix-comment-badges" }, [i.reviewState ?? i.state, i.source, U].filter(Boolean).map((ue) => t("span", null, ue)))
              )
            );
          })) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Gn }, ce.length ? `Approve ${ce.length} selected` : "Skip all comments"), ce.length ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Yt }, "Skip all") : null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Se, "Fix approval") }, "Request different fixes"))
        ) : null,
        Te ? t(
          "section",
          { class: "forge-v3-ds forge-v3-split-approval" },
          t("div", { class: "forge-v3-ds-label" }, "Split approval"),
          t("p", null, St.summary),
          Rn.length ? t("div", { class: "forge-v3-split-stack" }, Rn.map((i, _) => t("div", { class: "forge-v3-split-row", key: `${i.branch}-${_}` }, t("span", null, String(_ + 1)), t("strong", null, i.title ?? i.branch ?? `PR ${_ + 1}`), t("small", null, i.summary ?? i.branch ?? "pending branch")))) : null,
          St.markdown ? t(
            "details",
            { class: "forge-v3-split-plan-preview" },
            t("summary", null, "Full split plan"),
            t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Ke(St.markdown) } })
          ) : null,
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Te.id, "approved") }, "Approve split plan"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Te, "Split plan") }, "Request split changes"))
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
            t("div", { class: `forge-v3-ig-value ${Pn(o == null ? void 0 : o.priority)}` }, tr),
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
            t("div", { class: "forge-v3-ig-value" }, o != null && o.created_at ? `${he(o.created_at)} ago` : "—"),
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
            B.length ? B.map((i, _) => {
              const y = i.pr_number, S = i.url ?? null, M = i.branch ?? i.gt_branch ?? "pending", U = Number(i.checksFailed ?? 0) > 0 ? "bad" : Number(i.checksPending ?? 0) > 0 ? "pending" : "ok";
              return t(
                "div",
                { class: "forge-v3-pr-row", key: `${M}-${y ?? _}` },
                t("span", { class: "forge-v3-pr-pos" }, String(_ + 1)),
                t("span", { class: "forge-v3-pr-branch" }, M),
                S ? t("a", { class: "forge-v3-pr-badge", href: S, target: "_blank", rel: "noreferrer" }, `#${y} ↗`) : t("span", { class: "forge-v3-pr-badge" }, "no PR"),
                t("span", { class: `forge-v3-ci-badge ${i.isInMergeQueue ? "merge-queue" : ""}` }, i.isInMergeQueue ? "MERGE QUEUE" : i.liveState ?? i.status ?? "unknown"),
                i.isInMergeQueue ? t("span", { class: "forge-v3-pr-meta-badge merge-queue" }, i.mergeQueuePosition ? `Queue #${i.mergeQueuePosition}` : "Queued") : null,
                i.reviewDecision ? t("span", { class: "forge-v3-pr-meta-badge" }, i.reviewDecision) : null,
                i.mergeable ? t("span", { class: "forge-v3-pr-meta-badge" }, i.mergeable) : null,
                i.checksTotal != null ? t("span", { class: `forge-v3-pr-meta-badge checks-${U}` }, `${i.checksFailed ?? 0} failed · ${i.checksPending ?? 0} pending · ${i.checksTotal ?? 0} checks`) : null
              );
            }) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        t("section", { class: "forge-v3-ds" }, t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "Auto-fix"), t("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Pt, disabled: !(o != null && o.id), onChange: (i) => mr(i.target.checked) }), t("span", null))))
      ),
      k === "activity" && Oo(v, ye),
      k === "ask" && t(
        "div",
        { class: "forge-v3-ask-panel" },
        t(
          "section",
          { class: "forge-v3-ds forge-v3-ask-intro" },
          t("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          t("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          t("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((i) => t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => at(i) }, i)))
        ),
        t(
          "section",
          { class: "forge-v3-ask-thread", ref: (i) => {
            i && (i.scrollTop = i.scrollHeight);
          } },
          dt.length || N === "thinking" || O ? [
            ...dt.filter((i) => i.role === "user" || i.text.trim()).map((i, _) => t(
              "div",
              { key: `${_}-${i.role}`, class: `forge-v3-ask-msg ${i.role}` },
              t("span", null, i.role === "user" ? "You" : "Forge"),
              t("pre", null, i.text)
            )),
            N === "thinking" ? t("div", { class: "forge-v3-ask-thinking", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Thinking"), t("i", null, "."), t("i", null, "."), t("i", null, ".")) : null,
            O ? t("div", { class: "forge-v3-ask-current-status" }, O) : null
          ] : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        t(
          "section",
          { class: "forge-v3-ask-compose" },
          t("textarea", { rows: 3, placeholder: "Ask about this issue…", value: nt, onInput: (i) => at(i.target.value), onKeyDown: (i) => {
            (i.metaKey || i.ctrlKey) && i.key === "Enter" && $n();
          } }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !nt.trim() || N === "thinking", onClick: $n }, N === "thinking" ? "Asking…" : "Ask"),
            N === "thinking" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => {
              var i;
              (i = q.current) == null || i.abort(), R(""), D("");
            } }, "Stop") : null,
            t("span", { class: "forge-v3-ask-hint" }, "⌘/Ctrl + Enter")
          )
        )
      )
    ),
    T ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Plan review" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, Et ? "Plan + handoff · " : "Plan review · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? cr.label)),
          t("button", { type: "button", onClick: () => P(!1), "aria-label": "Close plan modal" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-md-viewer forge-v3-doc-stack" },
          t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Plan"),
            t("div", { dangerouslySetInnerHTML: { __html: Ke(nr) } })
          ),
          Et ? t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Handoff"),
            t("div", { dangerouslySetInnerHTML: { __html: Ke(ar) } })
          ) : null
        ),
        t(
          "footer",
          null,
          t("textarea", { placeholder: "Feedback for requested changes…", rows: 3, value: lt, onInput: (i) => wt(i.target.value) }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Ln }, "✓ Approve plan") : null,
            We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => lt.trim() ? Ae(We.id, "rejected", { reason: lt.trim() }) : je(We, "Plan review") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => P(!1) }, "Close")
          )
        )
      )
    ) : null,
    Re ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Live agent output" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-live-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Live · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? "Live agent output")),
          t("button", { type: "button", onClick: () => me(!1), "aria-label": "Close live output" }, "×")
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
              const y = i.kind === "thinking_delta" || i.kind === "thinking", S = i.kind === "error" ? "err" : i.kind === "tool" ? "ok" : y ? "me" : "live", M = i.kind === "tool" ? "tool" : y ? "thinking" : i.kind === "prompt" ? "prompt" : i.kind === "error" ? "error" : "assistant";
              return t(
                "div",
                { key: `${_}-${i.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${i.kind}` },
                t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${S}` }), _ < oe.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
                t(
                  "div",
                  { class: "forge-v3-af-content" },
                  t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${S === "me" ? "me" : "ag"}` }, M), t("span", { class: "forge-v3-af-time" }, `#${_ + 1}`)),
                  t("pre", { class: "forge-v3-af-snippet forge-v3-live-snippet" }, i.text)
                )
              );
            }) : t("p", { class: "forge-v3-empty" }, "Waiting for agent output…")
          )
        )
      )
    ) : null,
    L ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": C ? "Code review sidecar" : "Diff viewer" },
      t(
        "section",
        { class: `forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-diff-sidecar ${C ? "forge-v3-code-review-sidecar" : ""}` },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, C ? "Code review · " : "Diff · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? "Diff")),
          t("button", { type: "button", onClick: () => W(!1), "aria-label": "Close diff" }, "×")
        ),
        C ? t(
          "section",
          { class: "forge-v3-review-tour" },
          t(
            "div",
            null,
            t("strong", null, "AI tour"),
            t("p", null, ((Un = G == null ? void 0 : G.tour) == null ? void 0 : Un.summary) ?? pe ?? "Tour summary unavailable")
          ),
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => br(!!(G != null && G.tour)) }, G != null && G.tour ? "Regenerate tour" : "Generate tour"),
          (Hn = (Mn = G == null ? void 0 : G.tour) == null ? void 0 : Mn.highlights) != null && Hn.length ? t("ul", null, G.tour.highlights.map((i) => t("li", null, typeof i == "string" ? i : [i.title ? t("b", null, i.title, ": ") : null, i.text ?? i.file ?? "Highlight", i.file ? ` (${i.file}${i.line ? `:${i.line}` : ""})` : ""]))) : null
        ) : null,
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-diff-review" },
          X === "Loading diff…" ? t("div", { class: "forge-v3-diff-loading", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Loading diff…")) : X ? t("p", { class: "forge-v3-empty forge-v3-diff-error" }, X) : Nt.length === 0 ? t("p", { class: "forge-v3-empty" }, "No diff available.") : [
            t(
              "aside",
              { class: "forge-v3-diff-file-list", "aria-label": "Changed files" },
              t("div", { class: "forge-v3-diff-side-label" }, "Files"),
              Nt.map((i) => t(
                "button",
                { key: i.path, type: "button", class: (de == null ? void 0 : de.path) === i.path ? "active" : "", title: i.path, onClick: () => A(i.path) },
                t("span", null, C ? t("span", { class: "forge-v3-reviewed-file" }, t("input", { type: "checkbox", checked: Ee.includes(i.path), onClick: (_) => _.stopPropagation(), onChange: () => Cn(i.path) }), _a(i.path)) : _a(i.path)),
                t("small", { class: "forge-v3-diff-file-counts" }, t("span", { class: "add" }, `+${i.additions}`), " ", t("span", { class: "del" }, `−${i.deletions}`), ke.some((_) => _.file === i.path) ? " · comments" : "")
              ))
            ),
            t(
              "section",
              { class: "forge-v3-diff-main" },
              de ? t(
                "article",
                { class: "forge-v3-diff-file" },
                t("header", null, t("strong", { title: de.path }, de.path), t("span", null, `+${de.additions} −${de.deletions}`), C ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Cn(de.path) }, Ee.includes(de.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                t(
                  "div",
                  { class: "forge-v3-diff-table-wrap" },
                  t(
                    "table",
                    { class: "forge-v3-diff-table" },
                    t("tbody", null, de.hunks.map((i, _) => t(
                      "tr",
                      { key: `${_}-${i.slice(0, 12)}`, class: `forge-v3-diff-line ${Go(i)}` },
                      t("td", { class: "forge-v3-diff-ln" }, C ? t("button", { type: "button", title: "Add line comment", onClick: () => zt(de.path, _ + 1) }, String(_ + 1)) : String(_ + 1)),
                      t("td", { class: "forge-v3-diff-sign" }, xo(i)),
                      t("td", { class: "forge-v3-diff-content" }, t("code", null, i.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                C ? t("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => zt(de.path, null) }, "+ Add file comment") : null
              ) : null
            )
          ]
        ),
        t(
          "footer",
          null,
          C ? t(
            "div",
            { class: "forge-v3-review-feedback" },
            t("label", null, "General feedback for the agent"),
            t("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: He, onInput: (i) => ae(i.target.value) }),
            ke.length ? t("div", { class: "forge-v3-review-comments" }, ke.map((i) => t("span", { key: i.id }, `${i.file}${i.line ? `:${i.line}` : ""} — ${i.body}`))) : null
          ) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            C && ut ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => xn("approved") }, "✓ Approve code") : null,
            C && ut ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => xn("rejected") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => W(!1) }, "Close")
          )
        )
      )
    ) : null,
    Ie ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Jump to workflow state" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-jump-state-modal" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Admin recovery · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, "Jump to state")),
          t("button", { type: "button", onClick: () => _e(!1), "aria-label": "Close jump to state" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body" },
          t("p", { class: "forge-v3-jump-state-copy" }, "Move this issue to a selected workflow phase. History is preserved; Forge continues from that phase on the next scheduler tick."),
          t(
            "div",
            { class: "forge-v3-jump-state-list" },
            ur.map((i) => t(
              "button",
              { key: i.state, type: "button", class: `forge-v3-jump-state-option ${i.risky ? "risky" : ""}`, onClick: () => fr(i) },
              t("strong", null, i.label),
              t("code", null, i.state),
              t("span", null, i.hint),
              i.risky ? t("em", null, "Requires confirmation") : null
            ))
          )
        ),
        t("footer", null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => _e(!1) }, "Cancel"))
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
          ct ? t("div", { class: `forge-v3-admin-status ${ct.includes("failed") ? "failed" : ""}` }, ct) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: _r }, "Launch runtime"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: d }, "Stop VM runtime"),
            o != null && o.steering_context ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: dr }, "Clear steering") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => o != null && o.id ? c(o.id, "ignore") : void 0 }, "Ignore"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: gr }, "Full reset"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || fe(ye), onClick: vr }, "Remove issue")
          )
        )
      )
    )
  );
}
const Ya = "forge.v3.detailPanelWidth", Aa = 500, Ni = 440, Ri = 760;
function Za(e) {
  return Math.min(Ri, Math.max(Ni, Math.round(e)));
}
function Si() {
  const e = window.localStorage.getItem(Ya), n = e ? Number(e) : Aa;
  return Number.isFinite(n) ? Za(n) : Aa;
}
function Ti() {
  var dt;
  const e = Ht(), [n, a] = w(ua), [r, s] = w({ issues: [], decisions: [], runningAgents: [] }), [l, c] = w([]), [g, u] = w(e.view === "queue" ? e.issueId : null), [d, h] = w(0), [b, f] = w(e.view), [k, p] = w(!1), [v, I] = w(""), [T, P] = w(null), L = Ue(/* @__PURE__ */ new Map()), [W, j] = w(0), [Y, X] = w(e.addIssue), [J, te] = w(Si), [$, A] = w("connecting"), [C, F] = w(!1), [G, ne] = w(() => li()), pe = Ue(!1), le = Ue(/* @__PURE__ */ new Set()), Ee = Ue(g), Ne = Ue({ issues: [], decisions: [], runningAgents: [] }), ke = (m, N) => {
    if (!N) return "";
    const R = m.issues.find((D) => D.id === N), O = m.decisions.filter((D) => D.issue_id === N).map((D) => [D.id, D.type, D.created_at, D.resolved_at, D.artifact_ref].join(":")).sort().join(",");
    return `${(R == null ? void 0 : R.state) ?? ""}|${(R == null ? void 0 : R.updated_at) ?? ""}|${O}`;
  }, ge = (m = !1) => {
    const N = [
      se("/api/overview"),
      se("/api/settings"),
      m ? se("/api/archive").catch(() => []) : Promise.resolve([])
    ];
    return Promise.all(N).then(([R, O, D]) => {
      const q = Jo(R), o = L.current;
      for (const B of q.issues) {
        const ye = o.get(B.id);
        ye && ye !== "DONE" && B.state === "DONE" && (P(B), setTimeout(() => P(null), 6e3)), o.set(B.id, B.state ?? "");
      }
      Ne.current = q, s(q);
      const H = m ? D.length : n.archiveCount;
      return a({ ...di(q, O), archiveCount: H }), q.decisions.forEach((B) => {
        le.current.has(B.id) || (le.current.add(B.id), ci(B, q.issues.find((ye) => ye.id === B.issue_id), pe.current).catch(() => {
        }));
      }), q;
    });
  }, He = Ue(/* @__PURE__ */ (() => {
    let m = null;
    return () => {
      m && clearTimeout(m), m = setTimeout(() => ge(), 300);
    };
  })()), ae = (m, N) => {
    I(`${m}…`), N().then(() => ge()).then(() => {
      j((R) => R + 1), I(`${m} complete`);
    }).catch((R) => {
      I(`${m} failed`);
      const O = R instanceof Error ? R.message : String(R);
      ui({ title: `${m} failed`, message: O });
    });
  }, ce = (m, N, R) => {
    const O = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" }
    };
    s((D) => {
      var H;
      const q = D.decisions.find((B) => B.id === m), o = q != null && q.type ? (H = O[N]) == null ? void 0 : H[q.type] : void 0;
      return {
        ...D,
        decisions: D.decisions.filter((B) => B.id !== m),
        issues: o && q ? D.issues.map((B) => B.id === q.issue_id ? { ...B, state: o } : B) : D.issues
      };
    }), ae(
      N === "approved" ? "Decision approved" : "Decision changes requested",
      () => Yo(m, N, R).catch((D) => {
        const q = D instanceof Error ? D.message : String(D);
        if (!(q.includes("409") || q.toLowerCase().includes("already resolved")))
          throw s((o) => ({
            ...o,
            decisions: o.decisions.some((H) => H.id === m) ? o.decisions : [...o.decisions, { id: m }]
          })), D;
      })
    );
  }, ve = (m, N, R) => ae(`Issue ${N}`, () => Zo(m, N, R)), qe = (m) => ae("Issue removed", () => ei(m).then(() => E())), Be = (m) => ti(m), Ie = async () => {
    await mt({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: !0 }) && ae("VM runtime stopped", () => ni());
  }, _e = (m) => ae("PR stack synced", () => ai(m)), Re = (m, N, R) => ae("PR feedback added", () => ri(m, N, R)), me = (m) => {
    u(m), f("queue"), window.requestAnimationFrame(() => ot("queue", { issueId: m }));
  }, E = () => {
    u(null), ot("queue");
  }, V = (m, N) => {
    u(m), f("queue"), h((R) => R + 1), ot("queue", { issueId: m });
  }, oe = () => {
    const m = Qo(r.decisions, r.issues);
    m && V(m.issue_id, m.id);
  }, Z = () => {
    f("queue"), X(!0), qt({ view: "queue", add: "issue" }, !1);
  }, lt = () => {
    X(!1), qt({ add: null });
  }, wt = () => ae("Linear backlog refreshed", () => se("/api/linear/issues").then((m) => c(Array.isArray(m) ? m : []))), ct = (m, N = "", R) => ae("Manual issue created", () => oi(m, N, R).then((O) => {
    O.issueId && me(O.issueId);
  })), et = (m, N = "", R) => ae(`Enqueued ${m}`, () => ii(m, N, R).then((O) => {
    O.issueId && me(O.issueId);
  }).then(() => se("/api/linear/issues")).then((O) => c(Array.isArray(O) ? O : []))), Pt = () => {
    if (C) {
      I("Sending desktop companion notification…"), Ja("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test").then(() => I("Desktop companion notification sent")).catch(() => I("Desktop companion notification failed"));
      return;
    }
    if (!En()) {
      ne("unsupported");
      return;
    }
    window.Notification.requestPermission().then((m) => ne(m));
  }, tt = (m) => {
    f(m), u(null), ot(m);
  }, nt = (m) => {
    m.preventDefault(), document.body.classList.add("forge-v3-resizing-detail");
    const N = (O) => te(Za(window.innerWidth - O.clientX)), R = () => {
      document.body.classList.remove("forge-v3-resizing-detail"), window.removeEventListener("pointermove", N), window.removeEventListener("pointerup", R), window.removeEventListener("pointercancel", R);
    };
    window.addEventListener("pointermove", N), window.addEventListener("pointerup", R), window.addEventListener("pointercancel", R);
  };
  K(() => {
    document.documentElement.style.setProperty("--panel-w", `${J}px`), window.localStorage.setItem(Ya, String(J));
  }, [J]), K(() => {
    Ee.current = g;
  }, [g]), K(() => {
    if (!v || v.endsWith("…")) return;
    const m = window.setTimeout(() => I(""), 3500);
    return () => window.clearTimeout(m);
  }, [v]), K(() => {
    let m = !1;
    return si().then((N) => {
      if (m) return;
      const R = !!N.notifications;
      pe.current = R, F(R);
    }).catch(() => {
      m || (pe.current = !1, F(!1));
    }), () => {
      m = !0;
    };
  }, []), K(() => {
    const m = (N) => {
      (N.metaKey || N.ctrlKey) && N.key.toLowerCase() === "k" && (N.preventDefault(), p((R) => !R)), N.key === "Escape" && p(!1);
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, []), K(() => {
    const m = () => {
      const N = Ht();
      f(N.view), u(N.issueId), X(N.addIssue), (N.decisionId || N.panel === "review") && h((R) => R + 1);
    };
    return window.addEventListener("hashchange", m), window.addEventListener("popstate", m), () => {
      window.removeEventListener("hashchange", m), window.removeEventListener("popstate", m);
    };
  }, []), K(() => {
    let m = !1;
    const N = () => {
      ge(!0).catch(() => {
        m || a(ua);
      });
    };
    N(), se("/api/linear/issues").then((O) => {
      m || c(Array.isArray(O) ? O : []);
    }).catch(() => {
    });
    const R = window.setInterval(N, $ === "offline" ? 1e4 : 3e4);
    return () => {
      m = !0, window.clearInterval(R);
    };
  }, [$]), K(() => {
    if (Je()) return;
    let m = !1;
    const N = new EventSource("/api/events"), R = (O) => {
      const D = O.type === "issue_updated" || O.type === "issue_removed", q = Ee.current, o = ke(Ne.current, q);
      if (O.type === "tick") {
        He.current();
        return;
      }
      ge(D).then((H) => {
        q && ke(H, q) !== o && j((B) => B + 1);
      }).catch(() => {
      });
    };
    return N.onopen = () => {
      m || A("live");
    }, N.onerror = () => {
      m || A("offline");
    }, ["tick", "issue_added", "issue_removed", "issue_updated", "decision_resolved"].forEach((O) => {
      N.addEventListener(O, R);
    }), () => {
      m = !0, N.close();
    };
  }, []);
  const at = g ? r.issues.find((m) => m.id === g) ?? null : null;
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
        bt.slice(0, 2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              f(m.key), u(null), ot(m.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, m.icon),
            t("span", { class: "forge-v3-nav-label" }, m.label),
            m.key === "queue" && n.awaitingDecisionsCount > 0 ? t("span", { class: "forge-v3-nav-badge", "aria-label": `${n.awaitingDecisionsCount} pending decisions` }, String(n.awaitingDecisionsCount)) : m.key === "archive" ? t("span", { class: "forge-v3-nav-count" }, String(n.archiveCount)) : null
          )
        ),
        t("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => p(!0) }, t("span", { class: "forge-v3-nav-icon" }, "⌘"), t("span", { class: "forge-v3-nav-label" }, "Command palette"), t("kbd", null, "⌘K")),
        bt.slice(2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              f(m.key), u(null), ot(m.key);
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
            Array.from({ length: Math.max(n.concurrencyLimit, n.runningAgentsCount) }).slice(0, 8).map((m, N) => t("span", { class: N < n.runningAgentsCount ? "active" : "" }))
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
        t("div", { class: `forge-v3-session-chip event-${$}` }, $ === "live" ? "● Live events" : $ === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        t("button", { type: "button", class: `forge-v3-notification-toggle ${C ? "desktop" : "browser"}`, disabled: !C && (G === "unsupported" || G === "denied" || G === "granted"), onClick: Pt }, C ? "🔔 Desktop companion" : G === "granted" ? "🔔 Browser notifications on" : G === "denied" ? "🔕 Notifications blocked" : G === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        t("div", { class: "forge-v3-session-chip" }, C ? "● Native notifications available" : "○ Browser notification fallback"),
        t("div", { class: "forge-v3-session-chip" }, "● Workspace · ", n.model),
        t("div", { class: "forge-v3-model-row" }, "🤖 ", n.backend)
      )
    ),
    v ? t("div", { class: "forge-v3-action-status", role: "status" }, v) : null,
    T ? t("div", { class: "forge-v3-celebration", role: "status" }, t("strong", null, "🎉 ", T.linear_id ?? `Issue #${T.id}`, " completed!"), t("small", null, T.title ?? "Issue merged and archived")) : null,
    b === "queue" ? t(_i, { issues: r.issues, decisions: r.decisions, linearBacklog: l, selectedIssueId: g, addIssueOpen: Y, onOpenIssue: me, onIssueAction: ve, onResolveDecision: ce, onReviewNext: oe, onReviewIssue: V, onAddIssue: Z, onCloseAddIssue: lt, onRefreshLinear: wt, onCreateManualIssue: ct, onEnqueueLinear: et }) : b === "archive" ? t(Pi, null) : b === "settings" ? t(bi, null) : b === "prompts" ? t(Ii, null) : b === "learnings" ? t(ki, null) : t("main", { class: "forge-v3-main", "data-active-view": b }, t("h1", null, ((dt = bt.find((m) => m.key === b)) == null ? void 0 : dt.label) ?? "Dashboard"), t("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    t(Ei, { issueId: b === "queue" ? g : null, issuePreview: at, reloadKey: W, autoOpenDiffKey: d, onClose: E, onPanelResizeStart: nt, onIssueAction: ve, onRemoveIssue: qe, onLaunchRuntime: Be, onStopVm: Ie, onSyncPrs: _e, onSubmitFeedback: Re, onResolveDecision: ce }),
    t(vi, { open: k, decisions: r.decisions, onClose: () => p(!1), onNavigate: tt, onRefresh: () => ge(), onOpenIssue: me, onReviewNext: oe, onAddIssue: Z, onStopVm: Ie }),
    n.runningAgentsCount > 0 ? t(gi, { status: n, onStopVm: Ie }) : null
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
const ln = document.getElementById("forge-react-root");
ln && (Qe(t(Ti, null), ln), ln.dataset.reactiveDashboardMounted = "true");
