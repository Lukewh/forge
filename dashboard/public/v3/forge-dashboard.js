var Xt, x, Ra, Fe, Xn, Sa, Ta, nn, Gt, mt, Ca, bn, un, fn, Ot = {}, Ft = [], Tr = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, It = Array.isArray;
function xe(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function kn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function t(e, n, a) {
  var r, s, l, c = {};
  for (l in n) l == "key" ? r = n[l] : l == "ref" ? s = n[l] : c[l] = n[l];
  if (arguments.length > 2 && (c.children = arguments.length > 3 ? Xt.call(arguments, 2) : a), typeof e == "function" && e.defaultProps != null) for (l in e.defaultProps) c[l] === void 0 && (c[l] = e.defaultProps[l]);
  return xt(e, c, r, s, null);
}
function xt(e, n, a, r, s) {
  var l = { type: e, props: n, key: a, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: s ?? ++Ra, __i: -1, __u: 0 };
  return s == null && x.vnode != null && x.vnode(l), l;
}
function ot(e) {
  return e.children;
}
function $e(e, n) {
  this.props = e, this.context = n;
}
function it(e, n) {
  if (n == null) return e.__ ? it(e.__, e.__i + 1) : null;
  for (var a; n < e.__k.length; n++) if ((a = e.__k[n]) != null && a.__e != null) return a.__e;
  return typeof e.type == "function" ? it(e) : null;
}
function Cr(e) {
  if (e.__P && e.__d) {
    var n = e.__v, a = n.__e, r = [], s = [], l = xe({}, n);
    l.__v = n.__v + 1, x.vnode && x.vnode(l), In(e.__P, l, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [a] : null, r, a ?? it(n), !!(32 & n.__u), s), l.__v = n.__v, l.__.__k[l.__i] = l, Wa(r, l, s), n.__e = n.__ = null, l.__e != a && La(l);
  }
}
function La(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(n) {
    if (n != null && n.__e != null) return e.__e = e.__c.base = n.__e;
  }), La(e);
}
function Kn(e) {
  (!e.__d && (e.__d = !0) && Fe.push(e) && !Vt.__r++ || Xn != x.debounceRendering) && ((Xn = x.debounceRendering) || Sa)(Vt);
}
function Vt() {
  try {
    for (var e, n = 1; Fe.length; ) Fe.length > n && Fe.sort(Ta), e = Fe.shift(), n = Fe.length, Cr(e);
  } finally {
    Fe.length = Vt.__r = 0;
  }
}
function Ga(e, n, a, r, s, l, c, g, u, d, h) {
  var b, f, k, p, v, I, T, P = r && r.__k || Ft, L = n.length;
  for (u = Lr(a, n, P, u, L), b = 0; b < L; b++) (k = a.__k[b]) != null && (f = k.__i != -1 && P[k.__i] || Ot, k.__i = b, I = In(e, k, f, s, l, c, g, u, d, h), p = k.__e, k.ref && f.ref != k.ref && (f.ref && yn(f.ref, null, k), h.push(k.ref, k.__c || p, k)), v == null && p != null && (v = p), (T = !!(4 & k.__u)) || f.__k === k.__k ? (u = xa(k, u, e, T), T && f.__e && (f.__e = null)) : typeof k.type == "function" && I !== void 0 ? u = I : p && (u = p.nextSibling), k.__u &= -7);
  return a.__e = v, u;
}
function Lr(e, n, a, r, s) {
  var l, c, g, u, d, h = a.length, b = h, f = 0;
  for (e.__k = new Array(s), l = 0; l < s; l++) (c = n[l]) != null && typeof c != "boolean" && typeof c != "function" ? (typeof c == "string" || typeof c == "number" || typeof c == "bigint" || c.constructor == String ? c = e.__k[l] = xt(null, c, null, null, null) : It(c) ? c = e.__k[l] = xt(ot, { children: c }, null, null, null) : c.constructor === void 0 && c.__b > 0 ? c = e.__k[l] = xt(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v) : e.__k[l] = c, u = l + f, c.__ = e, c.__b = e.__b + 1, g = null, (d = c.__i = Gr(c, a, u, b)) != -1 && (b--, (g = a[d]) && (g.__u |= 2)), g == null || g.__v == null ? (d == -1 && (s > h ? f-- : s < h && f++), typeof c.type != "function" && (c.__u |= 4)) : d != u && (d == u - 1 ? f-- : d == u + 1 ? f++ : (d > u ? f-- : f++, c.__u |= 4))) : e.__k[l] = null;
  if (b) for (l = 0; l < h; l++) (g = a[l]) != null && (2 & g.__u) == 0 && (g.__e == r && (r = it(g)), Oa(g, g));
  return r;
}
function xa(e, n, a, r) {
  var s, l;
  if (typeof e.type == "function") {
    for (s = e.__k, l = 0; s && l < s.length; l++) s[l] && (s[l].__ = e, n = xa(s[l], n, a, r));
    return n;
  }
  e.__e != n && (r && (n && e.type && !n.parentNode && (n = it(e)), a.insertBefore(e.__e, n || null)), n = e.__e);
  do
    n = n && n.nextSibling;
  while (n != null && n.nodeType == 8);
  return n;
}
function Mt(e, n) {
  return n = n || [], e == null || typeof e == "boolean" || (It(e) ? e.some(function(a) {
    Mt(a, n);
  }) : n.push(e)), n;
}
function Gr(e, n, a, r) {
  var s, l, c, g = e.key, u = e.type, d = n[a], h = d != null && (2 & d.__u) == 0;
  if (d === null && g == null || h && g == d.key && u == d.type) return a;
  if (r > (h ? 1 : 0)) {
    for (s = a - 1, l = a + 1; s >= 0 || l < n.length; ) if ((d = n[c = s >= 0 ? s-- : l++]) != null && (2 & d.__u) == 0 && g == d.key && u == d.type) return c;
  }
  return -1;
}
function Qn(e, n, a) {
  n[0] == "-" ? e.setProperty(n, a ?? "") : e[n] = a == null ? "" : typeof a != "number" || Tr.test(n) ? a : a + "px";
}
function Ct(e, n, a, r, s) {
  var l, c;
  e: if (n == "style") if (typeof a == "string") e.style.cssText = a;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (n in r) a && n in a || Qn(e.style, n, "");
    if (a) for (n in a) r && a[n] == r[n] || Qn(e.style, n, a[n]);
  }
  else if (n[0] == "o" && n[1] == "n") l = n != (n = n.replace(Ca, "$1")), c = n.toLowerCase(), n = c in e || n == "onFocusOut" || n == "onFocusIn" ? c.slice(2) : n.slice(2), e.l || (e.l = {}), e.l[n + l] = a, a ? r ? a[mt] = r[mt] : (a[mt] = bn, e.addEventListener(n, l ? fn : un, l)) : e.removeEventListener(n, l ? fn : un, l);
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
function Jn(e) {
  return function(n) {
    if (this.l) {
      var a = this.l[n.type + e];
      if (n[Gt] == null) n[Gt] = bn++;
      else if (n[Gt] < a[mt]) return;
      return a(x.event ? x.event(n) : n);
    }
  };
}
function In(e, n, a, r, s, l, c, g, u, d) {
  var h, b, f, k, p, v, I, T, P, L, W, j, Y, X, J, te, $ = n.type;
  if (n.constructor !== void 0) return null;
  128 & a.__u && (u = !!(32 & a.__u), l = [g = n.__e = a.__e]), (h = x.__b) && h(n);
  e: if (typeof $ == "function") {
    b = c.length;
    try {
      if (P = n.props, L = $.prototype && $.prototype.render, W = (h = $.contextType) && r[h.__c], j = h ? W ? W.props.value : h.__ : r, a.__c ? T = (f = n.__c = a.__c).__ = f.__E : (L ? n.__c = f = new $(P, j) : (n.__c = f = new $e(P, j), f.constructor = $, f.render = $r), W && W.sub(f), f.state || (f.state = {}), f.__n = r, k = f.__d = !0, f.__h = [], f._sb = []), L && f.__s == null && (f.__s = f.state), L && $.getDerivedStateFromProps != null && (f.__s == f.state && (f.__s = xe({}, f.__s)), xe(f.__s, $.getDerivedStateFromProps(P, f.__s))), p = f.props, v = f.state, f.__v = n, k) L && $.getDerivedStateFromProps == null && f.componentWillMount != null && f.componentWillMount(), L && f.componentDidMount != null && f.__h.push(f.componentDidMount);
      else {
        if (L && $.getDerivedStateFromProps == null && P !== p && f.componentWillReceiveProps != null && f.componentWillReceiveProps(P, j), n.__v == a.__v || !f.__e && f.shouldComponentUpdate != null && f.shouldComponentUpdate(P, f.__s, j) === !1) {
          n.__v != a.__v && (f.props = P, f.state = f.__s, f.__d = !1), n.__e = a.__e, n.__k = a.__k, n.__k.some(function(A) {
            A && (A.__ = n);
          }), Ft.push.apply(f.__h, f._sb), f._sb = [], f.__h.length && c.push(f);
          break e;
        }
        f.componentWillUpdate != null && f.componentWillUpdate(P, f.__s, j), L && f.componentDidUpdate != null && f.__h.push(function() {
          f.componentDidUpdate(p, v, I);
        });
      }
      if (f.context = j, f.props = P, f.__P = e, f.__e = !1, Y = x.__r, X = 0, L) f.state = f.__s, f.__d = !1, Y && Y(n), h = f.render(f.props, f.state, f.context), Ft.push.apply(f.__h, f._sb), f._sb = [];
      else do
        f.__d = !1, Y && Y(n), h = f.render(f.props, f.state, f.context), f.state = f.__s;
      while (f.__d && ++X < 25);
      f.state = f.__s, f.getChildContext != null && (r = xe(xe({}, r), f.getChildContext())), L && !k && f.getSnapshotBeforeUpdate != null && (I = f.getSnapshotBeforeUpdate(p, v)), J = h != null && h.type === ot && h.key == null ? Da(h.props.children) : h, g = Ga(e, It(J) ? J : [J], n, a, r, s, l, c, g, u, d), f.base = n.__e, n.__u &= -161, f.__h.length && c.push(f), T && (f.__E = f.__ = null);
    } catch (A) {
      if (c.length = b, n.__v = null, u || l != null) {
        if (A.then) {
          for (n.__u |= u ? 160 : 128; g && g.nodeType == 8 && g.nextSibling; ) g = g.nextSibling;
          l != null && (l[l.indexOf(g)] = null), n.__e = g;
        } else if (l != null) for (te = l.length; te--; ) kn(l[te]);
      } else n.__e = a.__e;
      n.__k == null && (n.__k = a.__k || []), A.then || $a(n), x.__e(A, n, a);
    }
  } else l == null && n.__v == a.__v ? (n.__k = a.__k, n.__e = a.__e) : g = n.__e = xr(a.__e, n, a, r, s, l, c, u, d);
  return (h = x.diffed) && h(n), 128 & n.__u ? void 0 : g;
}
function $a(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some($a));
}
function Wa(e, n, a) {
  for (var r = 0; r < a.length; r++) yn(a[r], a[++r], a[++r]);
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
function Da(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : It(e) ? e.map(Da) : e.constructor !== void 0 ? null : xe({}, e);
}
function xr(e, n, a, r, s, l, c, g, u) {
  var d, h, b, f, k, p, v, I = a.props || Ot, T = n.props, P = n.type;
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
    if (l = P == "textarea" && T.defaultValue != null ? null : l && Xt.call(e.childNodes), !g && l != null) for (I = {}, d = 0; d < e.attributes.length; d++) I[(k = e.attributes[d]).name] = k.value;
    for (d in I) k = I[d], d == "dangerouslySetInnerHTML" ? b = k : d == "children" || d in T || d == "value" && "defaultValue" in T || d == "checked" && "defaultChecked" in T || Ct(e, d, null, k, s);
    for (d in T) k = T[d], d == "children" ? f = k : d == "dangerouslySetInnerHTML" ? h = k : d == "value" ? p = k : d == "checked" ? v = k : g && typeof k != "function" || I[d] === k || Ct(e, d, k, I[d], s);
    if (h) g || b && (h.__html == b.__html || h.__html == e.innerHTML) || (e.innerHTML = h.__html), n.__k = [];
    else if (b && (e.innerHTML = ""), Ga(n.type == "template" ? e.content : e, It(f) ? f : [f], n, a, r, P == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s, l, c, l ? l[0] : a.__k && it(a, 0), g, u), l != null) for (d = l.length; d--; ) kn(l[d]);
    g && P != "textarea" || (d = "value", P == "progress" && p == null ? e.removeAttribute("value") : p != null && (p !== e[d] || P == "progress" && !p || P == "option" && p != I[d]) && Ct(e, d, p, I[d], s), d = "checked", v != null && v != e[d] && Ct(e, d, v, I[d], s));
  }
  return e;
}
function yn(e, n, a) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && n == null || (e.__u = e(n));
    } else e.current = n;
  } catch (s) {
    x.__e(s, a);
  }
}
function Oa(e, n, a) {
  var r, s;
  if (x.unmount && x.unmount(e), (r = e.ref) && (r.current && r.current != e.__e || yn(r, null, n)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (l) {
      x.__e(l, n);
    }
    r.base = r.__P = r.__n = null;
  }
  if (r = e.__k) for (s = 0; s < r.length; s++) r[s] && Oa(r[s], n, a || typeof e.type != "function");
  a || kn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function $r(e, n, a) {
  return this.constructor(e, a);
}
function Je(e, n, a) {
  var r, s, l, c;
  n == document && (n = document.documentElement), x.__ && x.__(e, n), s = (r = !1) ? null : n.__k, l = [], c = [], In(n, e = n.__k = t(ot, null, [e]), s || Ot, Ot, n.namespaceURI, s ? null : n.firstChild ? Xt.call(n.childNodes) : null, l, s ? s.__e : n.firstChild, r, c), Wa(l, e, c), e.props.children = null;
}
Xt = Ft.slice, x = { __e: function(e, n, a, r) {
  for (var s, l, c; n = n.__; ) if ((s = n.__c) && !s.__) try {
    if ((l = s.constructor) && l.getDerivedStateFromError != null && (s.setState(l.getDerivedStateFromError(e)), c = s.__d), s.componentDidCatch != null && (s.componentDidCatch(e, r || {}), c = s.__d), c) return s.__E = s;
  } catch (g) {
    e = g;
  }
  throw e;
} }, Ra = 0, $e.prototype.setState = function(e, n) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = xe({}, this.state), typeof e == "function" && (e = e(xe({}, a), this.props)), e && xe(a, e), e != null && this.__v && (n && this._sb.push(n), Kn(this));
}, $e.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), Kn(this));
}, $e.prototype.render = ot, Fe = [], Sa = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Ta = function(e, n) {
  return e.__v.__b - n.__v.__b;
}, Vt.__r = 0, nn = Math.random().toString(8), Gt = "__d" + nn, mt = "__a" + nn, Ca = /(PointerCapture)$|Capture$/i, bn = 0, un = Jn(!1), fn = Jn(!0);
var kt, Q, an, zn, Ut = 0, Fa = [], z = x, Yn = z.__b, Zn = z.__r, ea = z.diffed, ta = z.__c, na = z.unmount, aa = z.__;
function An(e, n) {
  z.__h && z.__h(Q, e, Ut || n), Ut = 0;
  var a = Q.__H || (Q.__H = { __: [], __h: [] });
  return e >= a.__.length && a.__.push({}), a.__[e];
}
function w(e) {
  return Ut = 1, Wr(Ma, e);
}
function Wr(e, n, a) {
  var r = An(kt++, 2);
  if (r.t = e, !r.__c && (r.__ = [a ? a(n) : Ma(void 0, n), function(g) {
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
  var a = An(kt++, 3);
  !z.__s && Va(a.__H, n) && (a.__ = e, a.u = n, Q.__H.__h.push(a));
}
function Ve(e) {
  return Ut = 5, gt(function() {
    return { current: e };
  }, []);
}
function gt(e, n) {
  var a = An(kt++, 7);
  return Va(a.__H, n) && (a.__ = e(), a.__H = n, a.__h = e), a.__;
}
function Dr() {
  for (var e; e = Fa.shift(); ) {
    var n = e.__H;
    if (e.__P && n) try {
      n.__h.some($t), n.__h.some(pn), n.__h = [];
    } catch (a) {
      n.__h = [], z.__e(a, e.__v);
    }
  }
}
z.__b = function(e) {
  Q = null, Yn && Yn(e);
}, z.__ = function(e, n) {
  e && n.__k && n.__k.__m && (e.__m = n.__k.__m), aa && aa(e, n);
}, z.__r = function(e) {
  Zn && Zn(e), kt = 0;
  var n = (Q = e.__c).__H;
  n && (an === Q ? (n.__h = [], Q.__h = [], n.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (n.__h.some($t), n.__h.some(pn), n.__h = [], kt = 0)), an = Q;
}, z.diffed = function(e) {
  ea && ea(e);
  var n = e.__c;
  n && n.__H && (n.__H.__h.length && (Fa.push(n) !== 1 && zn === z.requestAnimationFrame || ((zn = z.requestAnimationFrame) || Or)(Dr)), n.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), an = Q = null;
}, z.__c = function(e, n) {
  n.some(function(a) {
    try {
      a.__h.some($t), a.__h = a.__h.filter(function(r) {
        return !r.__ || pn(r);
      });
    } catch (r) {
      n.some(function(s) {
        s.__h && (s.__h = []);
      }), n = [], z.__e(r, a.__v);
    }
  }), ta && ta(e, n);
}, z.unmount = function(e) {
  na && na(e);
  var n, a = e.__c;
  a && a.__H && (a.__H.__.some(function(r) {
    try {
      $t(r);
    } catch (s) {
      n = s;
    }
  }), a.__H = void 0, n && z.__e(n, a.__v));
};
var ra = typeof requestAnimationFrame == "function";
function Or(e) {
  var n, a = function() {
    clearTimeout(r), ra && cancelAnimationFrame(n), setTimeout(e);
  }, r = setTimeout(a, 35);
  ra && (n = requestAnimationFrame(a));
}
function $t(e) {
  var n = Q, a = e.__c;
  typeof a == "function" && (e.__c = void 0, a()), Q = n;
}
function pn(e) {
  var n = Q;
  e.__c = e.__(), Q = n;
}
function Va(e, n) {
  return !e || e.length !== n.length || n.some(function(a, r) {
    return a !== e[r];
  });
}
function Ma(e, n) {
  return typeof n == "function" ? n(e) : n;
}
function Fr(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function gn(e, n) {
  for (var a in e) if (a !== "__source" && !(a in n)) return !0;
  for (var r in n) if (r !== "__source" && e[r] !== n[r]) return !0;
  return !1;
}
function oa(e, n) {
  this.props = e, this.context = n;
}
function Vr(e, n) {
  function a(s) {
    var l = this.props.ref;
    return l != s.ref && l && (typeof l == "function" ? l(null) : l.current = null), n ? !n(this.props, s) || l != s.ref : gn(this.props, s);
  }
  function r(s) {
    return this.shouldComponentUpdate = a, t(e, s);
  }
  return r.displayName = "Memo(" + (e.displayName || e.name) + ")", r.__f = r.prototype.isReactComponent = !0, r.type = e, r;
}
(oa.prototype = new $e()).isPureReactComponent = !0, oa.prototype.shouldComponentUpdate = function(e, n) {
  return gn(this.props, e) || gn(this.state, n);
};
var ia = x.__b;
x.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), ia && ia(e);
};
var Mr = x.__e;
x.__e = function(e, n, a, r) {
  if (e.then) {
    for (var s, l = n; l = l.__; ) if ((s = l.__c) && s.__c) return n.__e == null && (n.__e = a.__e, n.__k = a.__k || []), s.__c(e, n);
  }
  Mr(e, n, a, r);
};
var sa = x.unmount;
function Ua(e, n, a) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), e.__c.__H = null), (e = Fr({}, e)).__c != null && (e.__c.__P === a && (e.__c.__P = n), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(r) {
    return Ua(r, n, a);
  })), e;
}
function Ha(e, n, a) {
  return e && a && (e.__v = null, e.__k = e.__k && e.__k.map(function(r) {
    return Ha(r, n, a);
  }), e.__c && e.__c.__P === n && (e.__e && a.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = a)), e;
}
function rn() {
  this.__u = 0, this.o = null, this.__b = null;
}
function qa(e) {
  var n = e.__ && e.__.__c;
  return n && n.__a && n.__a(e);
}
function Lt() {
  this.i = null, this.l = null;
}
x.unmount = function(e) {
  var n = e.__c;
  n && (n.__z = !0), n && n.__R && n.__R(), n && 32 & e.__u && (e.type = null), sa && sa(e);
}, (rn.prototype = new $e()).__c = function(e, n) {
  var a = n.__c, r = this;
  r.o == null && (r.o = []), r.o.push(a);
  var s = qa(r.__v), l = !1, c = function() {
    l || r.__z || (l = !0, a.__R = null, s ? s(u) : u());
  };
  a.__R = c;
  var g = a.__P;
  a.__P = null;
  var u = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var d = r.state.__a;
        r.__v.__k[0] = Ha(d, d.__c.__P, d.__c.__O);
      }
      var h;
      for (r.setState({ __a: r.__b = null }); h = r.o.pop(); ) h.__P = g, h.forceUpdate();
    }
  };
  r.__u++ || 32 & n.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), e.then(c, c);
}, rn.prototype.componentWillUnmount = function() {
  this.o = [];
}, rn.prototype.render = function(e, n) {
  if (this.__b) {
    if (this.__v.__k) {
      var a = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = Ua(this.__b, a, r.__O = r.__P);
    }
    this.__b = null;
  }
  var s = n.__a && t(ot, null, e.fallback);
  return s && (s.__u &= -33), [t(ot, null, n.__a ? null : e.children), s];
};
var la = function(e, n, a) {
  if (++a[1] === a[0] && e.l.delete(n), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (a = e.i; a; ) {
    for (; a.length > 3; ) a.pop()();
    if (a[1] < a[0]) break;
    e.i = a = a[2];
  }
};
(Lt.prototype = new $e()).__a = function(e) {
  var n = this, a = qa(n.__v), r = n.l.get(e);
  return r[0]++, function(s) {
    var l = function() {
      n.props.revealOrder ? (r.push(s), la(n, e, r)) : s();
    };
    a ? a(l) : l();
  };
}, Lt.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var n = Mt(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && n.reverse();
  for (var a = n.length; a--; ) this.l.set(n[a], this.i = [1, 0, this.i]);
  return e.children;
}, Lt.prototype.componentDidUpdate = Lt.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(n, a) {
    la(e, a, n);
  });
};
var Ur = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Hr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, qr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Br = /[A-Z0-9]/g, jr = typeof document < "u", Xr = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
$e.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty($e.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(n) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: n });
  } });
});
var ca = x.event;
x.event = function(e) {
  return ca && (e = ca(e)), e.persist = function() {
  }, e.isPropagationStopped = function() {
    return this.cancelBubble;
  }, e.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, e.nativeEvent = e;
};
var Kr = { configurable: !0, get: function() {
  return this.class;
} }, da = x.vnode;
x.vnode = function(e) {
  typeof e.type == "string" && (function(n) {
    var a = n.props, r = n.type, s = {}, l = r.indexOf("-") == -1;
    for (var c in a) {
      var g = a[c];
      if (!(c === "value" && "defaultValue" in a && g == null || jr && c === "children" && r === "noscript" || c === "class" || c === "className")) {
        var u = c.toLowerCase();
        c === "defaultValue" && "value" in a && a.value == null ? c = "value" : c === "download" && g === !0 ? g = "" : u === "translate" && g === "no" ? g = !1 : u[0] === "o" && u[1] === "n" ? u === "ondoubleclick" ? c = "ondblclick" : u !== "onchange" || r !== "input" && r !== "textarea" || Xr(a.type) ? u === "onfocus" ? c = "onfocusin" : u === "onblur" ? c = "onfocusout" : qr.test(c) && (c = u) : u = c = "oninput" : l && Hr.test(c) ? c = c.replace(Br, "-$&").toLowerCase() : g === null && (g = void 0), u === "oninput" && s[c = u] && (c = "oninputCapture"), s[c] = g;
      }
    }
    r == "select" && (s.multiple && Array.isArray(s.value) && (s.value = Mt(a.children).forEach(function(d) {
      d.props.selected = s.value.indexOf(d.props.value) != -1;
    })), s.defaultValue != null && (s.value = Mt(a.children).forEach(function(d) {
      d.props.selected = s.multiple ? s.defaultValue.indexOf(d.props.value) != -1 : s.defaultValue == d.props.value;
    }))), a.class && !a.className ? (s.class = a.class, Object.defineProperty(s, "className", Kr)) : a.className && (s.class = s.className = a.className), n.props = s;
  })(e), e.$$typeof = Ur, da && da(e);
};
var ua = x.__r;
x.__r = function(e) {
  ua && ua(e), e.__c;
};
var fa = x.diffed;
x.diffed = function(e) {
  fa && fa(e);
  var n = e.props, a = e.__e;
  a != null && e.type === "textarea" && "value" in n && n.value !== a.value && (a.value = n.value == null ? "" : n.value);
};
const ht = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" }
], vn = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "STEERING", "FAILED", "PAUSED", "IGNORED"] }
], Qr = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" }
], Kt = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "github_use_desktop", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] }
], Jr = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Git/worktree paths. For plain git worktrees, Repo root is the main clone and Worktree root is where issue worktrees are created. Worktrunk root is only used when Worktree tool is wt.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize."
}, Ba = {
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
}, pa = {
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
}, on = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"], ja = {
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
}, zr = ["model", "default_model", ...Object.values(ja)], wn = /* @__PURE__ */ new Set([...Kt.flatMap((e) => e.keys), ...zr]), Yr = new Set(Kt.flatMap((e) => e.keys).filter((e) => jt(e) === "number")), Zr = new Set(Kt.flatMap((e) => e.keys).filter((e) => jt(e) === "checkbox")), eo = /* @__PURE__ */ new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]), to = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" }
], no = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" }
], ao = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" }
], ro = {
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
function oo(e) {
  return ro[e ?? ""] ?? "WORKING";
}
const io = [
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
], Ke = {
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
}, so = {
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
}, ga = {
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
function lo(e) {
  return e.state !== "DONE";
}
const co = [
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
function ze() {
  const e = window.location.search.toLowerCase(), n = window.location.hash.toLowerCase(), a = e.includes("mockstates=1") || e.includes("mock=states") || n.includes("mockstates=1") || n.includes("mock=states") || n.includes("mock-states");
  return a && window.localStorage.setItem("forge-v3-mock-states", "1"), a || window.localStorage.getItem("forge-v3-mock-states") === "1";
}
function uo() {
  window.localStorage.setItem("forge-v3-mock-states", "1"), window.location.reload();
}
function fo() {
  window.localStorage.removeItem("forge-v3-mock-states");
  const e = new URL(window.location.href);
  e.searchParams.delete("mockStates"), e.searchParams.get("mock") === "states" && e.searchParams.delete("mock"), window.location.href = e.toString();
}
function Me(e) {
  return new Date(Date.now() - e * 6e4).toISOString();
}
const Xa = "forge.v3.askConversations", Ka = 40;
function Qa() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Xa) || "{}");
    return e && typeof e == "object" && !Array.isArray(e) ? e : {};
  } catch {
    return {};
  }
}
function po(e) {
  return Qa()[String(e)] ?? { messages: [], input: "" };
}
function va(e, n) {
  try {
    const a = Qa(), r = (n.messages ?? []).filter((s) => (s.role === "user" || s.role === "assistant") && typeof s.text == "string").slice(-Ka);
    a[String(e)] = { messages: r, input: n.input ?? "" }, window.localStorage.setItem(Xa, JSON.stringify(a));
  } catch {
  }
}
function Ja(e) {
  return e.state === "AWAITING_PLAN_APPROVAL" ? { id: 9101, issue_id: e.id, type: "PLAN_REVIEW", issueTitle: e.title } : e.state === "AWAITING_CODE_REVIEW" ? { id: 9102, issue_id: e.id, type: "CODE_REVIEW", issueTitle: e.title } : e.state === "AWAITING_FIX_APPROVAL" ? { id: 9103, issue_id: e.id, type: "FIX_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) } : e.state === "AWAITING_FIX_REVIEW" ? { id: 9104, issue_id: e.id, type: "FIX_REVIEW", issueTitle: e.title, artifact_ref: "fix-review" } : e.state === "AWAITING_SPLIT_APPROVAL" ? { id: 9104, issue_id: e.id, type: "SPLIT_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) } : null;
}
function _n() {
  return co.map((e, n) => ({
    id: 9e3 + n,
    linear_id: `MOCK-${n + 1}`,
    title: `${et({ state: e })} dashboard fixture`,
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
function _a(e) {
  return `# ${e.linear_id} ${e.title}

## Goal
Exercise the v3 detail panel while this issue is in **${et(e)}**.

## Tasks
- [x] Gather context
- [x] Draft plan
- [ ] Implement state-specific UI polish
- [ ] Validate actions and banners

## Review notes
Use this mock fixture to tidy copy, action availability, colors, and spacing before testing real Forge issues.`;
}
function go(e) {
  var r, s;
  const n = _n().find((l) => l.id === e) ?? _n()[0], a = Ja(n);
  return {
    issue: n,
    plan: _a(n),
    planContent: _a(n),
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
function vo() {
  const e = _n(), n = e.flatMap((a) => {
    const r = Ja(a);
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
function Ye(e) {
  return so[e.state ?? ""] ?? "building";
}
function _o(e) {
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
  const a = Ye(e);
  return { available: 2, active: 55, awaiting: 70 }[a];
}
function Wt(e) {
  if (!e.updated_at) return !1;
  const n = Ze(e.updated_at);
  return Number.isFinite(n) && Date.now() - n > 1440 * 60 * 1e3;
}
function Ze(e) {
  return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(e) && !e.endsWith("Z") && !e.includes("+") ? (/* @__PURE__ */ new Date(e.replace(" ", "T") + "Z")).getTime() : new Date(e).getTime();
}
function he(e) {
  if (!e) return "recent";
  const n = Ze(e);
  if (!Number.isFinite(n)) return "recent";
  const a = Math.max(0, Math.floor((Date.now() - n) / 1e3));
  if (a < 60) return `${Math.max(1, a)}s`;
  const r = Math.floor(a / 60);
  if (r < 60) return `${r}m`;
  const s = Math.floor(r / 60);
  return s < 24 ? `${s}h` : `${Math.floor(s / 24)}d`;
}
function sn(e) {
  if (!e) return "date unknown";
  const n = Ze(e);
  return Number.isFinite(n) ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(n)) : e;
}
function Pn(e) {
  return e === 1 ? "▰▰▰" : e === 2 ? "▰▰░" : e === 3 ? "▰░░" : e === 4 ? "░░░" : "□□□";
}
function En(e) {
  return e === 1 ? "urgent" : e === 2 ? "high" : e === 3 ? "medium" : e === 4 ? "low" : "none";
}
function Nn(e) {
  return e === 1 ? "priority-urgent" : e === 2 ? "priority-high" : "priority-normal";
}
function et(e) {
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
function mo(e) {
  const n = e.state ?? "";
  return n === "AWAITING_CODE_REVIEW" ? "forge-v3-state-pill pill-code" : n === "WATCHING_PR" ? "forge-v3-state-pill pill-watching" : n === "IN_MERGE_QUEUE" ? "forge-v3-state-pill pill-merge" : n === "FAILED" ? "forge-v3-state-pill pill-failed" : `forge-v3-state-pill pill-${Ye(e)}`;
}
function ho(e) {
  return (e.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}
function fe(e) {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(e.state ?? "");
}
function Ht(e) {
  return !!(e.pr_approved_at || (e.prStack ?? []).some((n) => String(n.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}
function bo(e) {
  return String(e.status ?? "").toLowerCase() === "merged" || String(e.liveState ?? "").toUpperCase() === "MERGED";
}
function ko(e) {
  const n = (e.prStack ?? []).filter((a) => a.pr_number);
  return e.state !== "DONE" && n.length > 0 && n.every(bo);
}
function Io(e) {
  const n = [];
  return fe(e) && n.push({ className: "forge-v3-live-badge", label: "Live" }), e.updated_at && n.push({ className: `forge-v3-elapsed-badge${Wt(e) ? " long" : ""}`, label: Wt(e) ? "24h+" : he(e.updated_at) }), Wt(e) && n.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" }), n;
}
function za(e) {
  const n = e.state ?? "";
  return ["PLANNING", "SETTING_UP"].includes(n) ? [t("strong", null, "Planner"), " reading ", t("code", null, "project context"), " — exploring component structure and requirements…"] : n === "AI_PLAN_REVIEWING" ? [t("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"] : n === "AWAITING_PLAN_APPROVAL" ? ["Plan ready for you — ", t("strong", null, "review tasks"), " and AI reviewer notes before approving."] : n === "WORKING" ? [t("strong", null, "Coder"), " writing changes — implementing planned code updates…"] : n === "AI_REVIEWING" ? [t("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"] : n === "AWAITING_CODE_REVIEW" ? ["AI review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."] : n === "REBASING" ? [t("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"] : Ht(e) ? ["GitHub review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."] : n === "FAILED" ? [t("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."] : n === "PAUSED" ? ["Paused by user. Was in ", t("strong", null, "active"), " state."] : e.updated_at ? "Updated recently" : "Queued in Forge";
}
function ma(e) {
  var a;
  const n = he(e.updated_at ?? e.created_at);
  return fe(e) ? e.state === "AI_REVIEWING" ? `In review ${n}` : `Started ${n} ago` : (a = e.state) != null && a.startsWith("AWAITING") ? `Waiting ${n}` : e.state === "FAILED" ? `Failed ${n} ago` : e.state === "PAUSED" ? `Paused ${n} ago` : Ye(e) === "available" ? `Added ${n} ago` : `Updated ${n} ago`;
}
function Ya(e) {
  var a;
  const n = ((a = e[0]) == null ? void 0 : a.type) ?? "";
  return n ? n.includes("PLAN") ? "plan" : n.includes("CODE") ? "code" : n === "FIX_REVIEW" ? "fix-review" : n.includes("FIX") ? "fix" : n.includes("SPLIT") ? "split" : "generic" : null;
}
function Dt(e) {
  if (!(e != null && e.artifact_ref)) return {};
  try {
    const n = JSON.parse(e.artifact_ref);
    return n && typeof n == "object" ? n : {};
  } catch {
    return { summary: e.artifact_ref };
  }
}
function ha(e) {
  return !!(e && /(?:^|[\\/])(?:plan|handoff|summary)\.md$/i.test(e.trim()));
}
function yo(e, n) {
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
function Ao(e) {
  var r, s, l, c, g, u, d, h;
  if (!e.trim()) return [];
  const n = [], a = e.split(/\n(?=###\s+)/g).filter((b) => /^###\s+/.test(b.trim()));
  for (const b of a) {
    const f = (s = (r = b.match(/^###\s+(?:Part\s+\d+\s+[—-]\s+)?(.+)$/m)) == null ? void 0 : r[1]) == null ? void 0 : s.trim(), k = (c = (l = b.match(/^[-*]\s+\*\*Branch:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : l[1]) == null ? void 0 : c.trim(), p = (u = (g = b.match(/^[-*]\s+\*\*Base:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : g[1]) == null ? void 0 : u.trim(), v = (h = (d = b.match(/^[-*]\s+\*\*Commits?:\*\*\s+(.+)$/m)) == null ? void 0 : d[1]) == null ? void 0 : h.replace(/`/g, "").trim();
    (f || k) && n.push({ title: f, branch: k, summary: [p ? `Base: ${p}` : null, v ? `Commits: ${v}` : null].filter(Boolean).join(" · ") || k });
  }
  return n;
}
function wo(e, n, a) {
  const r = ha(n.summary) ? void 0 : n.summary, s = ha(n.plan) ? void 0 : n.plan, l = yo(er(a), "Split Plan"), c = s ?? l, g = n.proposedStack ?? n.stack ?? Ao(c);
  return {
    summary: r ?? (c ? "Review the proposed PR stack split from the split planner." : "Review the proposed PR stack split."),
    markdown: c,
    stack: g
  };
}
function ft(e, n) {
  return String(e.id ?? `${e.path ?? "comment"}-${e.line ?? n}-${n}`);
}
function Za(e) {
  const n = e.pr_number ?? e.prNumber, a = typeof n == "number" ? n : Number(String(n ?? "").replace(/^#/, ""));
  return Number.isFinite(a) && a > 0 ? a : null;
}
function Po(e, n) {
  const a = Za(e), r = a ? n.find((c) => Number(c.pr_number) === a) : null, s = r != null && r.position ? `PR ${r.position}` : "PR", l = (r == null ? void 0 : r.gt_branch) ?? (r == null ? void 0 : r.branch);
  return [a ? `${s} #${a}` : s, l].filter(Boolean).join(" · ");
}
function Eo(e) {
  return e.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
}
function No(e) {
  return (e ?? "No comment body").replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "").replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (n, a, r) => `<!-- ${a} START -->
${r.trim()}
<!-- ${a} END -->`).replace(/<details\b[\s\S]*?<\/details>/gi, "").replace(/<sup\b[\s\S]*?<\/sup>/gi, "").replace(/<div\b[\s\S]*?<\/div>/gi, "").trim() || "No comment body";
}
function Ro(e) {
  const n = No(e), a = /<!--\s*([A-Z0-9_ -]+?)\s+(START|END)\s*-->/gi, r = [...n.matchAll(a)];
  if (!r.length) return t("div", { class: "forge-v3-fix-comment-body forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Qe(n) } });
  const s = [];
  let l = null, c = 0;
  const g = (u) => {
    const d = n.slice(c, u).trim();
    d && s.push({ label: l, text: d });
  };
  for (const u of r)
    g(u.index ?? c), c = (u.index ?? c) + u[0].length, l = u[2].toUpperCase() === "START" ? Eo(u[1]) : null;
  return g(n.length), t(
    "div",
    { class: "forge-v3-fix-comment-body" },
    s.length ? s.map((u, d) => t(
      "section",
      { class: "forge-v3-fix-comment-section", key: `${u.label ?? "intro"}-${d}` },
      u.label ? t("div", { class: "forge-v3-fix-comment-section-label" }, u.label) : null,
      t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Qe(u.text) } })
    )) : t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Qe(n.replace(a, "").trim() || "No comment body") } })
  );
}
function So(e) {
  return e === "AWAITING_PLAN_APPROVAL" ? "PLAN_REVIEW" : e === "AWAITING_CODE_REVIEW" ? "CODE_REVIEW" : e === "AWAITING_FIX_APPROVAL" ? "FIX_APPROVAL" : e === "AWAITING_FIX_REVIEW" ? "FIX_REVIEW" : e === "AWAITING_SPLIT_APPROVAL" ? "SPLIT_APPROVAL" : null;
}
function To(e, n) {
  const a = e.state ?? "", r = Ya(n);
  return r === "plan" || a === "AWAITING_PLAN_APPROVAL" ? { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: !1 } : r === "code" || a === "AWAITING_CODE_REVIEW" ? { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: !1 } : r === "fix" || a === "AWAITING_FIX_APPROVAL" ? { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: !1 } : a === "AWAITING_FIX_REVIEW" ? { icon: "🔍", tone: "awaiting", title: "Fix ready for review", text: "The fixer addressed review comments. Review the diff and approve to push, or reject to send back for more changes.", live: !1 } : a === "AWAITING_SPLIT_APPROVAL" ? { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: !1 } : a === "REBASING" ? { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: !0 } : Ht(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(a) ? { icon: "✓", tone: "running", title: "PR approved", text: e.pr_approved_at ? `GitHub review approved ${he(e.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: !1 } : fe(e) ? { icon: "spinner", tone: "running", title: `${et(e)} agent running`, text: `Active for ${he(e.updated_at)} — Forge is working on this issue.`, live: !0 } : a === "FAILED" ? { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: !1 } : { icon: rr(Ye(e)), tone: Ye(e), title: et(e), text: e.updated_at ? `Updated ${he(e.updated_at)} ago` : "Waiting for activity", live: !1 };
}
const ba = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];
function se(e, n, a = `${n}s`) {
  return `${e} ${e === 1 ? n : a}`;
}
function Oe(e, n) {
  return (e ?? []).filter((a) => a.agent_type === n).length;
}
function Co(e) {
  return (e ?? []).filter((n) => n.type === "FIX_APPROVAL").reduce((n, a) => {
    var r;
    return n + (((r = Dt(a).comments) == null ? void 0 : r.length) ?? 0);
  }, 0);
}
function Lo(e, n) {
  return (e ?? []).filter((a) => a.type === n).length;
}
function Go(e, n) {
  var f, k, p;
  const a = (n == null ? void 0 : n.agentRuns) ?? [], r = (n == null ? void 0 : n.decisions) ?? [], s = (n == null ? void 0 : n.prStack) ?? ((f = n == null ? void 0 : n.issue) == null ? void 0 : f.prStack) ?? [], l = Oe(a, "planner"), c = Oe(a, "plan-reviewer"), g = Oe(a, "coder"), u = Oe(a, "reviewer"), d = Oe(a, "fixer"), h = Oe(a, "watcher"), b = Co(r);
  return e === "Setup" ? { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [se(Oe(a, "setup"), "setup run"), (k = n == null ? void 0 : n.issue) != null && k.wt_path ? "Worktree ready" : "Worktree not recorded yet"] } : e === "Plan" ? { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [se(l, "planner pass", "planner passes"), se(c, "AI plan review"), se(Math.max(0, Math.min(l, c) - 1), "planner/reviewer loop")] } : e === "Code" ? { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [se(g, "coder pass", "coder passes"), se(Math.max(0, g - 1), "rework loop")] } : e === "Review" ? { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [se(u, "AI code review"), se(Lo(r, "CODE_REVIEW"), "human review gate"), se(Math.max(0, Math.min(g, u) - 1), "code/review loop")] } : e === "PR" ? { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [se(Oe(a, "git-agent"), "git-agent run"), se(s.length, "PR"), se(b, "PR comment/issue")] } : e === "Watch" ? { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [se(h, "watch poll"), se(d, "fix loop"), se(b, "comment/issue routed to fixer")] } : { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [((p = n == null ? void 0 : n.issue) == null ? void 0 : p.state) === "DONE" ? "Completed" : "Not completed yet"] };
}
function xo(e) {
  return ["PENDING", "SETTING_UP"].includes(e ?? "") ? 0 : ["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "") ? 1 : ["WORKING", "SPLITTING"].includes(e ?? "") ? 2 : ["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(e ?? "") ? 3 : ["CREATING_PR"].includes(e ?? "") ? 4 : ["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(e ?? "") ? 5 : e === "DONE" ? 6 : 0;
}
function $o(e) {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "");
}
function er(e) {
  return (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan) ?? "No plan available.";
}
function Wo(e) {
  const n = (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan);
  return !!(n != null && n.trim());
}
function tr(e) {
  return (e == null ? void 0 : e.handoffContent) ?? "";
}
function Do(e) {
  return !!tr(e).trim();
}
function Oo(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(e ?? "");
}
function Fo(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING"].includes(e ?? "");
}
function Vo(e) {
  return e ? ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes(e.state ?? "") && !fe(e) && !e.locked_at && !e.agent_pid : !1;
}
function Mo(e) {
  return e.startsWith("+") ? "add" : e.startsWith("-") ? "del" : e.startsWith("@@") ? "hunk" : e.startsWith("diff --git") || e.startsWith("index ") || e.startsWith("---") || e.startsWith("+++") ? "meta" : "ctx";
}
function Uo(e) {
  return e.startsWith("+") ? "+" : e.startsWith("-") ? "−" : "";
}
function ka(e) {
  return e.split(/[\\/]/).filter(Boolean).pop() || e;
}
function bt(e) {
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
function Ho(e, n) {
  return e.exit_code === null ? `${bt(e.agent_type)} is active — streaming progress.` : e.exit_code && e.exit_code !== 0 ? `${bt(e.agent_type)} failed — inspect logs before retrying.` : e.agent_type === "planner" ? "Plan created — tasks, risks, and PR stack estimated." : e.agent_type === "plan-reviewer" ? "Plan approved — scope and sequencing look ready." : e.agent_type === "coder" ? "Completed implementation pass and updated project notes." : e.agent_type === "reviewer" ? "Review completed — security, tests, and conventions checked." : e.agent_type === "git-agent" ? "Prepared branch stack and synchronized git state." : e.agent_type === "fixer" ? "Applied requested PR comment fixes." : e.agent_type === "watcher" ? "Checked PR status, reviews, and merge readiness." : `${bt(e.agent_type)} completed.`;
}
function qo(e, n) {
  const a = `${e ?? ""} ${n ?? ""}`.toLowerCase();
  return a.includes("fail") || a.includes("error") ? "err" : a.includes("approved") || a.includes("completed") || a.includes("done") ? "ok" : a.includes("user") || a.includes("steer") || a.includes("paused") || a.includes("ignored") ? "me" : a.includes("started") || a.includes("live") ? "live" : "ag";
}
function Bo(e) {
  var n;
  return e.message ?? ((n = e.type) == null ? void 0 : n.replaceAll("_", " ")) ?? "Activity recorded";
}
function vt(e) {
  return e ? `/api/runs/${e}/log` : null;
}
function jo(e, n) {
  var g, u;
  const a = [...(e == null ? void 0 : e.agentRuns) ?? []].sort((d, h) => re(h.started_at) - re(d.started_at)), r = [...(e == null ? void 0 : e.activityLog) ?? []].sort((d, h) => re(h.created_at) - re(d.created_at)), s = fe(n), l = new Map(a.map((d) => [d.agent_type, d])), c = r.length ? r.map((d) => {
    var b;
    const h = l.get(d.actor ?? "") ?? ((b = d.type) != null && b.includes("agent") ? a.find((f) => f.agent_type === d.actor) : void 0);
    return { id: String(d.id ?? `${d.type}-${d.created_at}`), actor: d.actor ?? "Forge", time: d.created_at ? `${he(d.created_at)} ago` : "recent", tone: qo(d.type, d.actor), text: Bo(d), snippet: d.metadata ?? null, logUrl: vt(h == null ? void 0 : h.id) };
  }) : [
    ...s ? [{ id: "live", actor: bt(((g = a[0]) == null ? void 0 : g.agent_type) ?? "agent"), time: "now", tone: "live", text: za(n), snippet: `// live agent output
Reading files, updating the project plan, and streaming progress…`, logUrl: vt((u = a[0]) == null ? void 0 : u.id) }] : [],
    ...a.map((d) => {
      var h;
      return { id: String(d.id ?? `${d.agent_type}-${d.started_at}`), actor: bt(d.agent_type), time: d.started_at ? `${he(d.started_at)} ago` : "recent", tone: d.exit_code === null ? "live" : d.exit_code && d.exit_code !== 0 ? "err" : (h = d.agent_type) != null && h.includes("review") ? "ok" : "ag", text: Ho(d), snippet: null, logUrl: vt(d.id) };
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
      t("div", null, t("strong", null, "Failure context"), e.failureContext.run ? t("a", { href: vt(e.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Open run log ↗") : null),
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
function nr(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function ln(e) {
  return nr(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function Qe(e) {
  const n = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), a = [];
  let r = !1, s = !1, l = [];
  const c = () => {
    l.length && (a.push(`<p>${ln(l.join(" "))}</p>`), l = []);
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
      a.push(nr(u));
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
      a.push(`<h${f}>${ln(h[2])}</h${f}>`);
      continue;
    }
    const b = d.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (b) {
      c(), r || (a.push("<ul>"), r = !0);
      const f = b[1] ? `<input type="checkbox" disabled ${b[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      a.push(`<li>${f}${ln(b[2])}</li>`);
      continue;
    }
    l.push(d.trim());
  }
  return c(), g(), s && a.push("</code></pre>"), a.join(`
`);
}
function Xo(e) {
  return [e.title, e.identifier, e.state].filter(Boolean).join(" ").toLowerCase();
}
function Ko(e, n) {
  const a = n.trim().toLowerCase();
  return !a || Xo(e).includes(a);
}
function Qo(e) {
  var n;
  return ((n = (e.prStack ?? []).find((a) => a.url)) == null ? void 0 : n.url) ?? null;
}
function Jo(e) {
  const n = e.prStack ?? [];
  return (e.state ?? "") === "AWAITING_PLAN_APPROVAL" ? [{ className: "forge-v3-plan-badge", label: "plan ready" }] : n.length ? n.slice(0, 2).flatMap((r) => [
    { className: "forge-v3-pr-badge", label: r.pr_number ? `#${r.pr_number}` : r.branch ?? "PR" },
    { className: r.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : r.status === "merged" ? "forge-v3-ci-badge" : r.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: r.isInMergeQueue ? "merge queue" : r.liveState ?? r.status ?? "✓ CI" }
  ]) : [];
}
function zo(e) {
  const n = (e.prStack ?? []).map((a) => [a.branch, a.pr_number ? `#${a.pr_number}` : "", a.status].filter(Boolean).join(" ")).join(" ");
  return [e.title, e.linear_id, e.branch, n, e.state].filter(Boolean).join(" ").toLowerCase();
}
function Yo(e, n) {
  const a = n.trim().toLowerCase();
  return !a || zo(e).includes(a);
}
function Zo(e, n) {
  const a = e.state ?? "";
  return n === "needs-me" ? ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(a) : n === "running" ? fe(e) : n === "failed" ? a === "FAILED" : n === "watching-pr" ? ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(a) : n === "paused" ? ["PAUSED", "IGNORED"].includes(a) : !0;
}
function re(e) {
  const n = e ? Ze(e) : 0;
  return Number.isFinite(n) ? n : 0;
}
function ei(e, n) {
  const a = [...e];
  return n === "newest" ? a.sort((r, s) => re(s.created_at ?? s.updated_at) - re(r.created_at ?? r.updated_at)) : n === "oldest" ? a.sort((r, s) => re(r.created_at ?? r.updated_at) - re(s.created_at ?? s.updated_at)) : n === "recently-updated" ? a.sort((r, s) => re(s.updated_at) - re(r.updated_at)) : a.sort((r, s) => (r.priority ?? 99) - (s.priority ?? 99) || re(s.updated_at) - re(r.updated_at));
}
function ti(e, n) {
  var s;
  if (n === "awaiting")
    return [...e].sort((l, c) => re(c.updated_at ?? c.created_at) - re(l.updated_at ?? l.created_at));
  const a = ((s = vn.find((l) => l.key === n)) == null ? void 0 : s.states) ?? [], r = (l) => {
    const c = l.state ?? "";
    if (c === "FAILED") return -1;
    const g = a.indexOf(c);
    return g >= 0 ? g : Ke[c] ?? 999;
  };
  return [...e].sort(
    (l, c) => r(l) - r(c) || (l.priority ?? 99) - (c.priority ?? 99) || re(c.updated_at) - re(l.updated_at)
  );
}
function Ia(e, n) {
  const a = n.find((r) => r.id === e.issue_id);
  return a != null && a.state ? Ke[a.state] ?? 999 : e.type === "PLAN_REVIEW" ? Ke.AWAITING_PLAN_APPROVAL : e.type === "SPLIT_APPROVAL" ? Ke.AWAITING_SPLIT_APPROVAL : e.type === "CODE_REVIEW" ? Ke.AWAITING_CODE_REVIEW : e.type === "FIX_APPROVAL" ? Ke.AWAITING_FIX_APPROVAL : e.type === "FIX_REVIEW" ? Ke.AWAITING_FIX_REVIEW : 999;
}
function ni(e, n) {
  return [...e].sort((a, r) => {
    const s = n.find((c) => c.id === a.issue_id), l = n.find((c) => c.id === r.issue_id);
    return Ia(a, n) - Ia(r, n) || ((s == null ? void 0 : s.priority) ?? 99) - ((l == null ? void 0 : l.priority) ?? 99) || a.id - r.id;
  });
}
function ai(e, n) {
  return ni(e, n)[0] ?? null;
}
function ri(e) {
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
  if (ze()) {
    if (e === "/api/overview") return vo();
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
    if (s != null && s[1]) return go(Number(s[1]));
  }
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Failed to fetch ${e}: ${n.status}`);
  return await n.json();
}
async function be(e, n, a = "POST") {
  if (ze()) return { ok: !0, mock: !0, url: e, body: n, method: a };
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
async function oi(e) {
  if (ze()) return { ok: !0, mock: !0, url: e, method: "DELETE" };
  const n = await fetch(e, { method: "DELETE" });
  if (!n.ok) throw new Error(`Failed to delete ${e}: ${n.status}`);
  return await n.json();
}
function cn(e) {
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
function ii(e, n, a) {
  return be(`/api/decisions/${e}/resolve`, { verdict: n, feedback: a });
}
function si(e, n, a = {}) {
  return be(`/api/issues/${e}`, { action: n, ...a }, "PATCH");
}
function li(e) {
  return oi(`/api/issues/${e}`);
}
function ci(e) {
  return be(`/api/issues/${e}/vm-launch`, {});
}
function di() {
  return be("/api/vm/stop", {});
}
function ui(e) {
  return be(`/api/issues/${e}/sync-prs`, {});
}
function fi(e, n, a) {
  return be(`/api/issues/${e}/feedback`, { body: n, prNumber: a ?? null });
}
function pi(e, n = "", a) {
  return be("/api/issues", { title: e, description: n, ...a });
}
function gi(e, n = "", a) {
  return be("/api/linear/enqueue", { linearId: e, planningGuidance: n, ...a });
}
function vi() {
  return le("/api/desktop-capabilities");
}
function ar(e, n, a) {
  return be("/api/desktop-notify", { title: e, body: n, tag: a });
}
function Rn() {
  return typeof window < "u" && "Notification" in window;
}
function _i() {
  return Rn() ? window.Notification.permission : "unsupported";
}
async function mi(e, n, a = !1) {
  const r = ho(e) || "Forge decision needed", s = n != null && n.title ? `${n.title} needs your review` : "A Forge issue needs your review", l = `forge-decision-${e.id}`;
  if (a)
    try {
      await ar(r, s, l);
      return;
    } catch {
    }
  if (!Rn() || window.Notification.permission !== "granted") return;
  const c = new window.Notification(r, { body: s, tag: l });
  c.onclick = () => {
    window.focus();
    const g = (n == null ? void 0 : n.id) ?? e.issue_id, u = new URL(window.location.href);
    u.searchParams.set("view", "queue"), u.searchParams.set("issue", String(g)), u.searchParams.set("panel", "review"), window.location.href = u.toString();
  };
}
function hi(e, n) {
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
function pt(e) {
  if (!e) return null;
  const n = Number(e);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function qt(e = window.location.hash) {
  const n = new URLSearchParams(window.location.search), a = n.get("view") || void 0, r = pt(n.get("issue") || void 0), s = pt(n.get("decision") || void 0), l = n.get("tab"), c = l === "activity" || l === "ask" ? l : "overview", g = n.get("panel"), u = g === "plan" || g === "diff" || g === "review" || g === "listen" || g === "jump" ? g : null, d = ht.some((I) => I.key === a) ? a : null;
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
  return b === "issue" ? { view: "queue", issueId: pt(f), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 } : b === "review" ? {
    view: "queue",
    issueId: pt(f),
    decisionId: k === "decision" ? pt(p) : null,
    detailTab: "overview",
    panel: "review",
    diffPath: "",
    addIssue: !1
  } : { view: ht.some((I) => I.key === b) ? b : "queue", issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 };
}
function Bt(e, n = !0) {
  const a = new URL(window.location.href);
  a.hash = "";
  for (const [l, c] of Object.entries(e))
    c == null || c === !1 || c === "" ? a.searchParams.delete(l) : a.searchParams.set(l, String(c));
  const r = `${a.pathname}${a.search}${a.hash}`, s = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  r !== s && window.history[n ? "replaceState" : "pushState"]({}, "", r);
}
function rt(e, n = {}) {
  Bt({ view: e, issue: e === "queue" ? n.issueId : null, decision: n.decisionId, panel: n.decisionId ? "review" : null }, !1);
}
function Qt({ icon: e, title: n, subtitle: a, actions: r }) {
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
function yt({ view: e, className: n = "", children: a }) {
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
      Je(null, a), a.remove(), n(c);
    }, l = () => {
      if (e.requiredText && r !== e.requiredText) return s(null);
      s(r);
    };
    Je(t(
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
function _t({ title: e, message: n, confirmText: a = "Confirm", danger: r = !1 }) {
  return typeof document > "u" ? Promise.resolve(!1) : new Promise((s) => {
    const l = document.createElement("div");
    document.body.appendChild(l);
    const c = (g) => {
      Je(null, l), l.remove(), s(g);
    };
    Je(t(
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
function bi({ title: e, message: n }) {
  if (typeof document > "u") return;
  const a = document.createElement("div");
  document.body.appendChild(a);
  const r = () => {
    Je(null, a), a.remove();
  };
  Je(t(
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
function rr(e) {
  return { available: "○", active: "▣", awaiting: "⚡" }[e];
}
function ki({ issue: e, onEnqueue: n }) {
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
        t("span", { class: `forge-v3-priority-meta ${Nn(e.priority)}` }, Pn(e.priority), " ", En(e.priority))
      )
    ),
    t("button", { type: "button", onClick: a }, "Enqueue →")
  );
}
function ya(e) {
  e.stopPropagation();
}
function Aa(e) {
  return e.composedPath().some((n) => {
    var a;
    return n instanceof HTMLElement && !!((a = n.closest) != null && a.call(n, "button,a,input,select,textarea"));
  });
}
function Ii({ issue: e, selected: n, onOpenIssue: a, onIssueAction: r, onReviewIssue: s }) {
  const l = _o(e), c = Ye(e), g = c === "available", u = fe(e), d = e.state === "PAUSED" ? "unpause" : e.state === "FAILED" ? "retry" : "pause", h = d === "unpause" ? "Resume" : d === "retry" ? "Retry" : "Pause", b = Io(e), f = Jo(e), k = Qo(e);
  return t(
    "article",
    { class: `forge-v3-issue-card ${n ? "selected" : ""} ${Ht(e) ? "pr-approved" : ""} ${(e.prStack ?? []).some((p) => p.isInMergeQueue) ? "in-merge-queue" : ""} state-${e.state ?? "unknown"} stage-${c}`, "data-issue-id": String(e.id), tabIndex: 0, "aria-label": `Open issue ${e.linear_id ?? e.id}`, onClick: (p) => {
      Aa(p) || a(e.id);
    }, onKeyDown: (p) => {
      Aa(p) || (p.key === "Enter" || p.key === " ") && a(e.id);
    } },
    t(
      "div",
      { class: "forge-v3-ic-hover", onPointerDown: ya },
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
          t("span", { class: `forge-v3-priority-glyph ${Nn(e.priority)}`, "aria-label": `Priority ${En(e.priority)}` }, Pn(e.priority))
        )
      ),
      t("h3", null, e.title ?? "Untitled issue"),
      ko(e) ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Merged"), t("small", null, "finalizing")) : (e.prStack ?? []).some((p) => p.isInMergeQueue) ? t("div", { class: "forge-v3-merge-queue-banner" }, t("span", null, "⇄"), t("strong", null, "Merge queue"), t("small", null, "waiting to merge")) : Ht(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(e.state ?? "") ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Approved"), t("small", null, e.pr_approved_at ? `${he(e.pr_approved_at)} ago` : "watching merge")) : null,
      t(
        "div",
        { class: "forge-v3-issue-state-row" },
        u ? t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
        t("span", { class: mo(e) }, et(e)),
        b.map((p) => t("span", { class: p.className }, p.label))
      ),
      g ? t("div", { class: "forge-v3-ic-meta" }, ma(e)) : [
        t("p", { class: "forge-v3-activity-snippet" }, za(e)),
        t("div", { class: "forge-v3-ic-meta" }, ma(e), Wt(e) ? t("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
      ],
      !g && f.length ? t("div", { class: "forge-v3-pr-metadata" }, f.map((p) => t("span", { class: p.className }, p.label))) : null
    ),
    t("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, t("span", { class: "forge-v3-ic-fill", style: { width: `${l}%` } })),
    t(
      "div",
      { class: "forge-v3-issue-actions", onPointerDown: ya },
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
const wa = Vr(Ii, (e, n) => e.issue === n.issue && e.selected === n.selected);
function yi({ status: e, onStopVm: n }) {
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
function Ai({ open: e, decisions: n, onClose: a, onNavigate: r, onRefresh: s, onOpenIssue: l, onReviewNext: c, onAddIssue: g, onStopVm: u }) {
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
function wi({ issues: e, decisions: n, linearBacklog: a, selectedIssueId: r, addIssueOpen: s, onOpenIssue: l, onIssueAction: c, onResolveDecision: g, onReviewNext: u, onReviewIssue: d, onAddIssue: h, onCloseAddIssue: b, onRefreshLinear: f, onCreateManualIssue: k, onEnqueueLinear: p }) {
  const [v, I] = w(""), T = gt(() => {
    try {
      const E = window.localStorage.getItem("forge.v3.queuePrefs");
      if (!E) return { filter: "all", sort: "priority" };
      const M = JSON.parse(E);
      return {
        filter: ["all", "needs-me", "running", "failed", "watching-pr", "paused"].includes(M.filter) ? M.filter : "all",
        sort: ["priority", "newest", "oldest", "recently-updated"].includes(M.sort) ? M.sort : "priority"
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
  const [Y, X] = w("linear"), [J, te] = w(""), [$, A] = w(""), [C, V] = w(""), [G, ne] = w(""), [pe, ce] = w(""), [Ee, Ne] = w(""), [ke, ge] = w(""), [Ue, ae] = w(""), de = gt(() => ei(
    e.filter((E) => lo(E) && Yo(E, v) && Zo(E, P)),
    W
  ), [e, v, P, W]), ve = gt(() => {
    const E = /* @__PURE__ */ new Map();
    return vn.forEach((M) => E.set(M.key, [])), de.forEach((M) => {
      var oe;
      return (oe = E.get(Ye(M))) == null ? void 0 : oe.push(M);
    }), E.forEach((M, oe) => E.set(oe, ti(M, oe))), E;
  }, [de]), He = gt(() => a.filter((E) => Ko(E, v)).slice(0, 12), [a, v]), qe = ze(), Ie = () => ({ targetKind: pe.trim(), targetPaths: Ee.trim(), avoidPaths: ke.trim(), scopeNotes: Ue.trim() }), _e = () => {
    ce(""), Ne(""), ge(""), ae("");
  }, Re = () => {
    const E = J.trim();
    E && (k(E, $.trim(), Ie()), te(""), A(""), _e(), b());
  }, me = () => {
    const E = C.trim();
    E && (p(E, G.trim(), Ie()), V(""), ne(""), _e(), b());
  };
  return t(yt, { view: "queue", className: `forge-v3-queue-shell ${r ? "forge-v3-has-detail" : ""}` }, [
    qe ? t("div", { class: "forge-v3-mock-state-banner" }, t("strong", null, "Mock state fixtures enabled"), t("span", null, "Review every Forge state without touching real issues."), t("button", { type: "button", onClick: fo }, "Exit mock data")) : null,
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
          no.map((E) => t("button", { key: E.key, type: "button", class: P === E.key ? "active" : "", onClick: () => L(E.key) }, E.label))
        )
      ),
      t(
        "div",
        { class: "forge-v3-toolbar-actions" },
        t("select", { "aria-label": "Sort issues", value: W, onChange: (E) => j(E.target.value) }, ao.map((E) => t("option", { key: E.key, value: E.key }, E.label))),
        t("button", { type: "button", disabled: n.length === 0, onClick: u }, "⚡ Review next", n.length ? ` (${n.length})` : ""),
        t("button", { type: "button", title: "Refresh Linear", onClick: f }, "↻ Sync"),
        t("button", { type: "button", disabled: !0 }, "⌘ Command"),
        qe ? null : t("button", { type: "button", onClick: uo }, "Mock states"),
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
            t("label", null, "Linear ID", t("input", { type: "text", placeholder: "TEAM-1234", value: C, onInput: (E) => V(E.target.value) })),
            t("label", null, "Planning guidance", t("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: G, onInput: (E) => ne(E.target.value) }))
          ] : [
            t("label", null, "Title", t("input", { type: "text", placeholder: "Manual issue title", value: J, onInput: (E) => te(E.target.value) })),
            t("label", null, "Description", t("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: $, onInput: (E) => A(E.target.value) }))
          ],
          t(
            "div",
            { class: "forge-v3-scope-grid" },
            t("label", null, "Target kind", t("input", { type: "text", placeholder: "backend-shared, pricing-frontend, fullstack…", value: pe, onInput: (E) => ce(E.target.value) })),
            t("label", null, "Target paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. functions/", value: Ee, onInput: (E) => Ne(E.target.value) })),
            t("label", null, "Avoid paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. frontend/apps/pricing/", value: ke, onInput: (E) => ge(E.target.value) })),
            t("label", null, "Scope notes", t("textarea", { rows: 2, placeholder: "Generic shared endpoint; do not describe as pricing-scoped.", value: Ue, onInput: (E) => ae(E.target.value) }))
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
        vn.map((E) => {
          const M = ve.get(E.key) ?? [], oe = E.key === "available" ? M.length + He.length : M.length;
          return t(
            "section",
            { key: E.key, class: "forge-v3-pipeline-column", "data-stage": E.key },
            t(
              "header",
              { class: `forge-v3-col-head ${E.key === "awaiting" ? "needs-head" : ""}` },
              t("span", { class: `forge-v3-col-label ${E.key === "awaiting" ? "needs" : ""}` }, E.key === "available" ? E.label : `${rr(E.key)} ${E.label}`),
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
                  He.length ? He.map((Z) => t(ki, { key: Z.identifier, issue: Z, onEnqueue: p })) : t("p", { class: "forge-v3-empty" }, v ? "No Linear issues match" : "No available Linear issues")
                ),
                t("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                t(
                  "div",
                  { class: "forge-v3-available-queued" },
                  M.length ? M.map((Z) => t(wa, { key: Z.id, issue: Z, selected: r === Z.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d })) : t("p", { class: "forge-v3-empty" }, v || P !== "all" ? "No queued issues match" : "No queued issues")
                )
              ] : M.length === 0 ? t("p", { class: "forge-v3-empty" }, v || P !== "all" ? "No issues match the active filters" : "No issues") : M.map((Z) => t(wa, { key: Z.id, issue: Z, selected: r === Z.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d }))
            )
          );
        })
      )
    )
  ]);
}
function jt(e) {
  return e.includes("limit") || e.includes("seconds") || e.includes("rounds") || e.endsWith("_max") || e === "dashboard_port" ? "number" : e.startsWith("enable_") || e.startsWith("use_") || e.endsWith("_enabled") || e.includes("reuse") || e.includes("use_desktop") ? "checkbox" : "text";
}
function mn(e) {
  var n;
  return ((n = Ba[e]) == null ? void 0 : n.label) ?? e;
}
function Pa(e) {
  var a;
  const n = (a = Ba[e]) == null ? void 0 : a.hint;
  return n ? `${n} · DB key: ${e}` : `Unrecognized setting · DB key: ${e}`;
}
function Pi(e, n) {
  return n.keys.filter((a) => Object.prototype.hasOwnProperty.call(e, a)).map((a) => ({ key: a, value: e[a] ?? "" }));
}
function hn(e, n) {
  return Zr.has(e) ? n === "true" ? "true" : "false" : n;
}
function Ea(e, n, a) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => a || wn.has(r)).map(([r, s]) => [r, hn(r, s ?? "")]).filter(([r, s]) => hn(String(r), e[String(r)] ?? "") !== s));
}
function Ei(e, n) {
  const a = [];
  return Object.entries(e).forEach(([r, s]) => {
    if (!n && !wn.has(r) || !Yr.has(r)) return;
    const l = String(s ?? "").trim();
    (!l || !Number.isFinite(Number(l)) || Number(l) < 0) && a.push(`${mn(r)} must be a non-negative number.`);
  }), a;
}
function Ni() {
  const [e, n] = w({}), [a, r] = w({}), [s, l] = w(null), [c, g] = w(""), [u, d] = w(""), [h, b] = w("Loading settings…"), [f, k] = w([]), [p, v] = w(!1), I = () => {
    le("/api/desktop-backend").then((A) => {
      l(A), g(A.backendOrigin ?? ""), d("");
    }).catch(() => {
      l(null), d("Desktop backend switching is available in the Forge desktop app.");
    });
  };
  K(() => {
    let A = !1;
    return le("/api/settings").then((C) => {
      A || (n(C), r(C), k([]), b(""));
    }).catch(() => {
      A || b("Unable to load settings");
    }), I(), () => {
      A = !0;
    };
  }, []);
  const T = (A, C) => {
    r((V) => ({ ...V, [A]: hn(A, C) })), k((V) => V.filter((G) => !G.includes(mn(A))));
  }, P = () => {
    d("Saving backend…"), fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: c })
    }).then((A) => A.ok ? A.json() : Promise.reject(new Error("backend failed"))).then((A) => {
      l(A), g(A.backendOrigin ?? c), d("Backend saved. Refresh if the dashboard did not reconnect automatically.");
    }).catch(() => d("Unable to save desktop backend"));
  }, L = () => {
    const A = Ei(a, p);
    if (A.length) {
      k(A), b("Fix validation errors before saving");
      return;
    }
    const C = Ea(e, a, p);
    if (Object.keys(C).length === 0) {
      b("No settings changed");
      return;
    }
    b(`Saving ${Object.keys(C).length} changed setting${Object.keys(C).length === 1 ? "" : "s"}…`), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(C)
    }).then((V) => V.json().then((G) => V.ok ? G : Promise.reject(new Error((G == null ? void 0 : G.error) ?? "Unable to save settings")))).then((V) => {
      const G = V.settings ?? { ...e, ...C };
      n(G), r(G), k([]), b("Settings saved");
    }).catch((V) => b(V.message || "Unable to save settings"));
  }, W = () => {
    r(e), k([]), b("Reset changes");
  }, j = Object.entries(a).filter(([A]) => !wn.has(A)).map(([A, C]) => ({ key: A, value: C ?? "" })), Y = Ea(e, a, p), X = Object.keys(Y).length, J = [...Kt, { label: "Other", keys: [] }], te = (A, C = !1) => {
    if (A.key.includes("context") || A.key.includes("prompt") || A.key.includes("command"))
      return t("textarea", { class: "forge-v3-setting-control", value: A.value, rows: A.key === "project_prompt_overlay" ? 8 : 3, placeholder: pa[A.key], disabled: C, readOnly: C, onInput: (G) => T(A.key, G.target.value) });
    const V = jt(A.key);
    return t("input", { class: "forge-v3-setting-control", type: jt(A.key), checked: V === "checkbox" ? A.value === "true" : void 0, value: V === "checkbox" ? void 0 : A.value, placeholder: pa[A.key], disabled: C, readOnly: C, min: V === "number" ? "0" : void 0, onInput: (G) => {
      const ne = G.target;
      T(A.key, V === "checkbox" ? String(ne.checked) : ne.value);
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
  return t(yt, { view: "settings", className: "forge-v3-settings-wrap" }, [
    t(Qt, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: t(
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
        const C = A.label === "Other" ? j : Pi(a, A), V = [
          ...A.label === "Dashboard Backend" ? [$()] : [],
          ...C.map((G) => {
            const ne = A.label === "Other", pe = eo.has(G.key);
            return t(
              "label",
              { key: G.key, class: `forge-v3-setting-row ${ne ? "forge-v3-setting-unknown" : ""} ${pe ? "forge-v3-setting-runtime" : ""}` },
              t("span", null, mn(G.key), ne && !p ? t("em", null, " read-only") : null),
              t("small", null, pe ? `${Pa(G.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : Pa(G.key)),
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
            t("div", null, t("h2", null, A.label), t("p", null, Jr[A.label])),
            A.label === "Other" ? t("label", { class: "forge-v3-other-unlock" }, t("input", { type: "checkbox", checked: p, onInput: (G) => v(G.target.checked) }), " Edit unknown") : t("span", null, String(V.length))
          ),
          V.length === 0 ? t("p", { class: "forge-v3-empty" }, "No settings in this group.") : V
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
function Ri() {
  const [e, n] = w("suggestions"), [a, r] = w({ suggestions: [], events: [], changes: [] }), [s, l] = w("Loading learnings…"), c = () => {
    le("/api/learnings").then((u) => {
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
  return t(yt, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    t(Qt, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
    t(
      "nav",
      { class: "forge-v3-learning-tabs", "aria-label": "Learning tabs" },
      to.map((u) => t("button", { key: u.key, type: "button", class: e === u.key ? "active" : "", onClick: () => n(u.key) }, u.label))
    ),
    s ? t("p", { class: "forge-v3-empty" }, s) : null,
    e === "suggestions" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning suggestions" },
      a.suggestions.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning suggestions.") : a.suggestions.map((u) => t(
        "article",
        { key: u.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? `Issue #${u.issue_id ?? "—"}`, " · ", u.target ?? "target", " · Added ", u.created_at ? `${he(u.created_at)} ago (${sn(u.created_at)})` : "date unknown"),
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
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? "Global", " · ", u.target ?? "target", " · ", u.change_type ?? "change", " · ", u.created_at ? sn(u.created_at) : "date unknown"),
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
        t("div", { class: "forge-v3-learning-meta" }, u.linear_id ?? "Global", " · ", u.event_type ?? "reflection", " · ", u.created_at ? sn(u.created_at) : "date unknown"),
        t("h2", null, u.summary ?? "Reflection event")
      ))
    )
  ]);
}
function Si() {
  const [e, n] = w(() => Object.fromEntries(
    on.map((p) => [p, { type: p, content: "", status: "Loading…" }])
  )), [a, r] = w({}), [s, l] = w("Loading models…"), c = (p) => {
    fetch(`/api/agents/${p}/prompt`).then((v) => v.ok ? v.text() : Promise.reject(new Error("prompt failed"))).then((v) => n((I) => ({ ...I, [p]: { type: p, content: v, status: "Loaded" } }))).catch(() => n((v) => ({ ...v, [p]: { ...v[p], status: "Unable to load prompt" } })));
  }, g = () => {
    le("/api/settings").then((p) => {
      r(p), l("Models loaded");
    }).catch(() => l("Unable to load model settings"));
  };
  K(() => {
    on.forEach(c), g();
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
  return t(yt, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    t(Qt, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place" }),
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
      on.map((p) => {
        const v = e[p], I = v.content.length, T = ja[p], P = a[T] ?? "";
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
function Ti(e) {
  if (!e) return !1;
  const n = Ze(e);
  return Number.isFinite(n) && Date.now() - n <= 10080 * 60 * 1e3;
}
function Ci(e) {
  const n = (e.prStack ?? []).map((a) => [a.pr_number ? `#${a.pr_number}` : "", a.gt_branch, a.branch, a.status].filter(Boolean).join(" ")).join(" ");
  return [e.linear_id, e.title, e.state, e.updated_at, n].filter(Boolean).join(" ").toLowerCase();
}
function Li({ issue: e, onClose: n }) {
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
        e.summaryContent ? t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Qe(e.summaryContent) } }) : t("p", { class: "forge-v3-empty" }, e.hasSummary ? "Summary could not be loaded." : "No summary was generated for this issue.")
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
function Gi() {
  const [e, n] = w(null), [a, r] = w(null), [s, l] = w(""), [c, g] = w(null);
  K(() => {
    let I = !1;
    return le("/api/archive").then((T) => {
      I || n(T);
    }).catch(() => {
      I || r("Unable to load archive");
    }), () => {
      I = !0;
    };
  }, []);
  const u = e ?? [], d = s.trim().toLowerCase(), h = d ? u.filter((I) => Ci(I).includes(d)) : u, b = c ? u.find((I) => I.id === c) ?? null : null, f = h.length, k = h.filter((I) => Ti(I.merged ?? I.updated_at)).length, p = f ? (h.reduce((I, T) => {
    var P;
    return I + Number(T.pr_count ?? ((P = T.prStack) == null ? void 0 : P.length) ?? 0);
  }, 0) / f).toFixed(1) : "0.0", v = (() => {
    const I = h.filter((L) => L.created_at && (L.merged ?? L.updated_at)).map((L) => {
      const W = Ze(L.created_at), j = Ze(L.merged ?? L.updated_at);
      return Number.isFinite(W) && Number.isFinite(j) ? j - W : 0;
    }).filter((L) => L > 0);
    if (!I.length) return "—";
    const T = I.reduce((L, W) => L + W, 0) / I.length, P = Math.round(T / 36e5);
    return P < 24 ? `${P}h` : `${(P / 24).toFixed(1)}d`;
  })();
  return t(yt, { view: "archive", className: `forge-v3-archive-wrap ${b ? "forge-v3-has-archive-detail" : ""}` }, [
    t(Qt, { icon: "🗃️", title: "Archive", subtitle: `${f} completed issues${d ? ` matching "${s.trim()}"` : ""} — all PRs merged`, actions: t("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: s, onInput: (I) => l(I.target.value) }) }),
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
    b ? t(Li, { issue: b, onClose: () => g(null) }) : null
  ]);
}
function xi({ issueId: e, issuePreview: n, reloadKey: a, autoOpenDiffKey: r, onClose: s, onPanelResizeStart: l, onIssueAction: c, onRemoveIssue: g, onLaunchRuntime: u, onStopVm: d, onSyncPrs: h, onSubmitFeedback: b, onResolveDecision: f }) {
  var Fn, Vn, Mn, Un, Hn, qn, Bn, jn;
  const [k, p] = w(() => qt().detailTab), [v, I] = w(null), [T, P] = w(!1), [L, W] = w(!1), [j, Y] = w(""), [X, J] = w(""), te = Ve(0), [$, A] = w(""), [C, V] = w(!1), [G, ne] = w(null), [pe, ce] = w(""), [Ee, Ne] = w([]), [ke, ge] = w([]), [Ue, ae] = w(""), [de, ve] = w([]), [He, qe] = w([]), [Ie, _e] = w(!1), [Re, me] = w(!1), [E, M] = w("idle"), [oe, Z] = w([]), [st, At] = w(""), [lt, tt] = w(""), [wt, nt] = w(!1), [Be, Pt] = w(""), [je, m] = w([]), [R, S] = w(""), [O, D] = w(""), q = Ve(null);
  if (K(() => {
    var y;
    if (!e) {
      I(null), P(!1), W(!1), me(!1), _e(!1);
      return;
    }
    I(n ? { issue: n } : null);
    const i = qt();
    p(i.detailTab), P(i.panel === "plan"), W(i.panel === "diff" || i.panel === "review"), me(i.panel === "listen"), _e(i.panel === "jump"), Z([]), M("idle"), Y(""), J(i.panel === "diff" || i.panel === "review" ? "Loading diff…" : ""), A(i.diffPath), V(i.panel === "review"), ne(null), ce(""), Ne([]), ge([]), ae(""), ve([]), qe([]), At(""), tt(""), nt(!1);
    const _ = po(e);
    Pt(_.input ?? ""), m(_.messages ?? []), S(""), D(""), (y = q.current) == null || y.abort(), q.current = null;
  }, [e]), K(() => {
    if (!e) return;
    let i = !1;
    return le(`/api/issues/${e}?fast=1`).then((_) => {
      i || I(_);
    }).catch(() => {
      i || I({ issue: { id: e, title: "Unable to load issue" } });
    }), () => {
      i = !0;
    };
  }, [e, a]), K(() => {
    if (!e) return;
    Bt({ view: "queue", issue: e, tab: k === "overview" ? null : k, panel: L ? C ? "review" : "diff" : T ? "plan" : Re ? "listen" : Ie ? "jump" : null, diffPath: L ? $ : null });
  }, [e, k, T, L, Re, Ie, C, $]), K(() => {
    var y;
    const i = (y = v == null ? void 0 : v.decisions) == null ? void 0 : y.find((N) => N.type === "FIX_APPROVAL"), _ = Dt(i).comments ?? [];
    ve(_.map((N, F) => ft(N, F)));
  }, [v == null ? void 0 : v.decisions]), K(() => {
    var i;
    nt(!!((i = v == null ? void 0 : v.issue) != null && i.auto_fix_enabled));
  }, [(Fn = v == null ? void 0 : v.issue) == null ? void 0 : Fn.auto_fix_enabled]), K(() => {
    if (!Re || !e) return;
    if (ze()) {
      M("mock live"), Z([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    M("connecting…"), Z([]);
    const i = new EventSource(`/api/issues/${e}/listen`);
    return i.addEventListener("meta", (_) => {
      const y = JSON.parse(_.data);
      M(y.agentType ? `live · ${y.agentType}` : "live");
    }), i.addEventListener("message", (_) => {
      const y = JSON.parse(_.data), N = y.kind ?? "text", F = (y.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!F) return;
      const H = N === "text_delta" || N === "thinking_delta";
      Z((ie) => {
        const ut = ie[ie.length - 1];
        return H && ut && ut.kind === N ? [...ie.slice(0, -1), { kind: N, text: ut.text + F }] : [...ie.slice(-200), { kind: N, text: F }];
      });
    }), i.addEventListener("done", (_) => {
      const y = JSON.parse(_.data);
      M(y.exitCode === 0 ? "done" : `failed (${y.exitCode ?? "unknown"})`), i.close();
    }), i.addEventListener("error", () => M("no active agent")), i.onerror = () => M("disconnected"), () => i.close();
  }, [Re, e]), K(() => {
    !e || r <= 0 || (V(!0), W(!0), J("Loading diff…"));
  }, [r, e]), K(() => {
    if (!e || !L || X !== "Loading diff…") return;
    const i = ++te.current;
    C && (ce("Loading AI tour…"), le(`/api/issues/${e}/tour`).then((_) => {
      i === te.current && (ne(_), ce(_.generating ? "AI tour is generating…" : _.tour ? "" : "No AI tour yet"));
    }).catch(() => {
      i === te.current && ce("Unable to load AI tour");
    })), le(`/api/issues/${e}/diff`).then((_) => {
      if (i !== te.current) return;
      const y = _.diff ?? "", N = cn(y);
      Y(y), A((F) => {
        var H;
        return F || ((H = N[0]) == null ? void 0 : H.path) || "";
      }), J(_.error ?? "");
    }).catch(() => {
      i === te.current && J("Unable to load diff");
    });
  }, [L, X, e, C]), K(() => {
    if (!L) return;
    const i = (_) => {
      const y = _.target;
      if (y.tagName === "INPUT" || y.tagName === "TEXTAREA" || y.tagName === "SELECT") return;
      const N = cn(j);
      if (!N.length) return;
      const F = N.findIndex((H) => H.path === $);
      if (_.key === "j" || _.key === "J") {
        _.preventDefault();
        const H = Math.min(F + 1, N.length - 1);
        A(N[H].path);
      } else if (_.key === "k" || _.key === "K") {
        _.preventDefault();
        const H = Math.max(F - 1, 0);
        A(N[H].path);
      } else _.key === "r" && C && $ ? (_.preventDefault(), Ne((H) => H.includes($) ? H.filter((ie) => ie !== $) : [...H, $])) : _.key === "a" && C && $ && (_.preventDefault(), Yt($, null));
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [L, j, $, C]), !e) return null;
  const o = v == null ? void 0 : v.issue, U = ((v == null ? void 0 : v.decisions) ?? []).filter((i) => !i.verdict && !i.resolved_at && !He.includes(i.id)), B = (v == null ? void 0 : v.prStack) ?? [], ye = o ?? {}, sr = () => me(!0), at = To(ye, U), ee = Ya(U), Jt = xo(o == null ? void 0 : o.state), lr = `${Pn(o == null ? void 0 : o.priority)} ${En(o == null ? void 0 : o.priority)}`, cr = er(v), dr = tr(v), Et = Do(v), ur = Wo(v) && !["PENDING", "SETTING_UP", "PLANNING"].includes((o == null ? void 0 : o.state) ?? "") || Et, fr = Oo(o == null ? void 0 : o.state), pr = Fo(o == null ? void 0 : o.state), gr = Vo(o), vr = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes((o == null ? void 0 : o.state) ?? ""), _r = { label: "Plan" }, Sn = async () => {
    if (!(o != null && o.id)) return;
    const i = await Pe({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    i != null && i.trim() && c(o.id, "steer", { instructions: i.trim() });
  }, mr = async () => {
    !(o != null && o.id) || !await _t({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" }) || c(o.id, "clear-steer");
  }, hr = io.filter((i) => i.state !== (o == null ? void 0 : o.state)), br = async (i) => {
    if (!(o != null && o.id)) return;
    const _ = o.linear_id ?? `issue #${o.id}`, y = i.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    await _t({ title: "Jump workflow state?", message: `Move ${_} to ${i.state}?${y}`, confirmText: "Jump state", danger: i.risky }) && (_e(!1), c(o.id, "advance", { nextState: i.state }));
  }, kr = async () => {
    var ie;
    if (!(o != null && o.id)) return;
    const i = oo(o.state), y = { SETTING_UP: "setup", PLANNING: "planner", AI_PLAN_REVIEWING: "plan-reviewer", WORKING: "coder", AI_REVIEWING: "reviewer", CREATING_PR: "git-agent", FIXING: "fixer", PUSHING: "git-agent", REBASING: "rebaser", SPLIT_PLANNING: "split-planner", SPLITTING: "splitter" }[i] ?? null, N = y ? ` Forge will run the ${y} agent next.` : "", F = (ie = o.state) != null && ie.startsWith("AWAITING") ? " This skips the pending human approval gate." : "";
    await _t({ title: "Advance workflow state?", message: `Move ${o.linear_id ?? `issue #${o.id}`} from "${et(o)}" to "${et({ state: i })}"?${N}${F}`, confirmText: "Advance" }) && c(o.id, "advance", { nextState: i });
  }, Ir = async () => {
    !(o != null && o.id) || await Pe({ title: "Full reset issue", message: `This fully resets ${o.linear_id ?? `issue #${o.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: !0, requiredText: "RESET" }) !== "RESET" || c(o.id, "reset");
  }, yr = async () => {
    !(o != null && o.id) || await Pe({ title: "Remove issue", message: `Remove ${o.linear_id ?? `issue #${o.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: !0, requiredText: "DELETE" }) !== "DELETE" || g(o.id);
  }, Ar = () => {
    o != null && o.id && (tt("Launching runtime…"), u(o.id).then((i) => tt(`Runtime launch complete${typeof i == "object" && i && "launchRef" in i ? ` · ${i.launchRef ?? "started"}` : ""}`)).catch((i) => tt(`Runtime launch failed: ${i.message}`)));
  }, wr = (i) => {
    if (!(o != null && o.id)) return;
    const _ = wt;
    nt(i), c(o.id, "set-auto-fix", { enabled: i }), window.setTimeout(() => {
      var y;
      !ze() && ((y = v == null ? void 0 : v.issue) == null ? void 0 : y.auto_fix_enabled) === _ && nt(_);
    }, 2e3);
  }, Pr = async () => {
    var F;
    if (!(o != null && o.id)) return;
    const i = B.filter((H) => H.pr_number).map((H) => String(H.pr_number)), _ = i.length ? await Pe({ title: "Target PR", message: `Choose a PR number (${i.join(", ")}).`, label: "PR number", initialValue: i[0], confirmText: "Continue" }) : null, y = _ != null && _.trim() ? Number(_.trim().replace(/^#/, "")) : null, N = (F = await Pe({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" })) == null ? void 0 : F.trim();
    N && b(o.id, N, Number.isFinite(y) ? y : null);
  }, Er = (i = !1) => {
    if (!(o != null && o.id)) return;
    ce(i ? "Regenerating AI tour…" : "Generating AI tour…");
    const _ = () => be(`/api/issues/${o.id}/generate-tour`, {});
    (i ? be(`/api/issues/${o.id}/tour`, {}, "DELETE").then(_) : _()).then((y) => {
      ne(y), ce(y.tour ? "" : "AI tour is generating…");
    }).catch(() => ce("Unable to start AI tour generation"));
  }, zt = (i = "diff") => {
    o != null && o.id && (te.current += 1, V(i === "review"), ne(null), ce(i === "review" ? "Loading AI tour…" : ""), Y(""), A(""), W(!0), J("Loading diff…"));
  }, Nt = cn(j), ue = Nt.find((i) => i.path === $) ?? Nt[0], We = U.find((i) => i.type === "PLAN_REVIEW") ?? (ee === "plan" ? U[0] : void 0), ct = U.find((i) => i.type === "CODE_REVIEW") ?? (ee === "code" ? U[0] : void 0), Se = U.find((i) => i.type === "FIX_APPROVAL") ?? (ee === "fix" ? U[0] : void 0), Rt = U.find((i) => i.type === "FIX_REVIEW") ?? (ee === "fix-review" ? U[0] : void 0), Te = U.find((i) => i.type === "SPLIT_APPROVAL") ?? (ee === "split" ? U[0] : void 0), dt = Dt(Se).comments ?? [], Nr = Dt(Te), St = wo(Te, Nr, v), Tn = St.stack, Cn = So(o == null ? void 0 : o.state), Ln = Cn ? U.filter((i) => i.type && i.type !== Cn) : U.filter((i) => i.type), Yt = async (i, _) => {
    var N;
    const y = (N = await Pe({ title: "Add review comment", message: _ === null ? `Comment on ${i}` : `Comment on ${i}:${_}`, label: "Comment", confirmText: "Add comment" })) == null ? void 0 : N.trim();
    y && ge((F) => [...F, { id: `${Date.now()}-${F.length}`, file: i, line: _, body: y }]);
  }, Gn = (i) => Ne((_) => _.includes(i) ? _.filter((y) => y !== i) : [..._, i]), Ae = (i, _, y) => {
    qe((N) => N.includes(i) ? N : [...N, i]), f(i, _, y);
  }, xn = async () => {
    var _;
    if (!We) return;
    const i = (_ = await Pe({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" })) == null ? void 0 : _.trim();
    Ae(We.id, "approved", i ? { steeringComment: i } : void 0);
  }, Xe = async (i, _) => {
    const y = await Pe({ title: `Request ${_} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: !0 });
    y != null && y.trim() && Ae(i.id, "rejected", { reason: y.trim() });
  }, Rr = (i) => ve((_) => _.includes(i) ? _.filter((y) => y !== i) : [..._, i]), Zt = () => {
    if (!Se) return;
    const i = dt.map((_, y) => ft(_, y));
    ve([]), Ae(Se.id, "rejected", { skippedIds: i, reason: "Skipped all PR comments" });
  }, $n = () => {
    if (!Se) return;
    const i = dt.map((N, F) => ft(N, F)), _ = de;
    if (!_.length) {
      Zt();
      return;
    }
    const y = i.filter((N) => !_.includes(N));
    Ae(Se.id, "approved", { approvedIds: _, skippedIds: y });
  }, Wn = (i) => {
    ct && (Ae(ct.id, i, {
      kind: "code-review",
      summary: Ue.trim(),
      reviewedFiles: Ee,
      comments: ke.map(({ file: _, line: y, body: N }) => ({ file: _, line: y, body: N }))
    }), ae(""));
  }, Dn = (i, _) => {
    const y = o == null ? void 0 : o.id;
    m((N) => {
      const F = i(N).slice(-Ka);
      return y && va(y, { messages: F, input: _ ?? Be }), F;
    });
  }, en = (i) => {
    Pt(i), o != null && o.id && va(o.id, { messages: je, input: i });
  }, On = () => {
    if (!(o != null && o.id) || !Be.trim() || R === "thinking") return;
    const i = Be.trim(), _ = je.filter((N) => N.text.trim()).slice(-12);
    en(""), S("thinking"), D("Gathering issue context…"), Dn((N) => [...N, { role: "user", text: i }, { role: "assistant", text: "" }], "");
    const y = new AbortController();
    q.current = y, fetch(`/api/issues/${o.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: i, history: _ }),
      signal: y.signal
    }).then(async (N) => {
      if (!N.ok || !N.body) throw new Error(`Ask failed (${N.status})`);
      const F = N.body.getReader(), H = new TextDecoder();
      let ie = "";
      const ut = (Ce) => Dn((Le) => {
        const De = [...Le].map((Ge) => Ge.role).lastIndexOf("assistant");
        return De < 0 ? [...Le, { role: "assistant", text: Ce }] : Le.map((Ge, we) => we === De ? { ...Ge, text: Ge.text + Ce } : Ge);
      }), Tt = (Ce) => D(Ce), Sr = (Ce) => {
        const Le = Ce.split(`
`).find((tn) => tn.startsWith("event:")), De = Ce.split(`
`).find((tn) => tn.startsWith("data:"));
        if (!De) return;
        const Ge = (Le == null ? void 0 : Le.replace(/^event:\s*/, "")) ?? "message", we = JSON.parse(De.replace(/^data:\s*/, ""));
        if (Ge === "done") {
          S(""), D("");
          return;
        }
        if (Ge === "meta") {
          Tt("Gathered issue context. Starting assistant…");
          return;
        }
        Ge === "message" && ((we.kind === "text_delta" || we.kind === "text") && ut(we.text ?? ""), we.kind === "thinking_delta" && Tt("Thinking…"), we.kind === "tool" && Tt((we.text ?? "").trim()), we.kind === "error" && Tt(`Error: ${(we.text ?? "").trim()}`));
      };
      for (; ; ) {
        const { value: Ce, done: Le } = await F.read();
        if (Le) break;
        ie += H.decode(Ce, { stream: !0 });
        const De = ie.split(`

`);
        ie = De.pop() ?? "", De.forEach(Sr);
      }
      S(""), D("");
    }).catch((N) => {
      y.signal.aborted || (S(""), D(N.message));
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
      Qr.map((i) => t("button", { key: i.key, type: "button", class: k === i.key ? "active" : "", onClick: () => p(i.key) }, i.label))
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
            { class: `forge-v3-state-banner ${at.tone}` },
            at.icon === "spinner" ? t("span", { class: "forge-v3-spinner forge-v3-state-spinner", "aria-hidden": "true" }) : t("span", { class: "forge-v3-state-icon", "aria-hidden": "true" }, at.icon),
            t("div", { class: "forge-v3-sb-text" }, t("strong", null, at.title), t("br", null), at.text),
            at.live ? t("span", { class: "forge-v3-live-badge" }, "Live") : null
          ),
          t(
            "div",
            { class: "forge-v3-phase-track", "aria-label": "Workflow phase track" },
            ba.map((i, _) => {
              const y = Go(i, v);
              return [
                t(
                  "div",
                  { key: i, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${y.title}: ${y.summary} ${y.stats.join(". ")}` },
                  t("div", { class: `forge-v3-phase-dot ${_ < Jt || (o == null ? void 0 : o.state) === "DONE" ? "done" : _ === Jt ? $o(o == null ? void 0 : o.state) ? "wait" : "active" : ""}` }),
                  t("div", { class: "forge-v3-phase-label" }, i),
                  t(
                    "div",
                    { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    t("strong", null, y.title),
                    t("p", null, y.summary),
                    t("ul", null, y.stats.map((N) => t("li", { key: N }, N)))
                  )
                ),
                _ < ba.length - 1 ? t("div", { key: `${i}-line`, class: `forge-v3-phase-line ${_ < Jt ? "done" : ""}` }) : null
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
              t("strong", null, `${((Vn = v.failureContext.run) == null ? void 0 : Vn.agent_type) ?? "Agent"} crashed`),
              t(
                "span",
                { class: "forge-v3-failure-meta" },
                ` · exit ${((Mn = v.failureContext.run) == null ? void 0 : Mn.exit_code) ?? "?"} · `,
                (Un = v.failureContext.run) != null && Un.started_at ? `${he(v.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            (Hn = v.failureContext.run) != null && Hn.id ? t("a", { class: "forge-v3-failure-log-link", href: vt(v.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗") : null
          ),
          v.failureContext.logTail ? t("pre", { class: "forge-v3-failure-log" }, v.failureContext.logTail) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Sn }, "Steer before retry")
          )
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, ee ? "Actions · Decision needed" : "Actions"),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            fe(ye) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: sr }, "Listen live") : null,
            ee === "plan" && We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: xn }, "✓ Approve plan") : null,
            ee === "plan" && We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => P(!0) }, "✗ Request changes") : null,
            ee === "code" && ct ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => zt("review") }, "Review code") : null,
            ee === "fix" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: $n }, `✓ Fix selected (${de.length})`) : null,
            ee === "fix" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Zt }, "Skip all") : null,
            ee === "fix-review" && Rt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Rt.id, "approved") }, "✓ Approve fix & push") : null,
            ee === "fix-review" && Rt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Xe(Rt, "Fix review") }, "✗ Send back to fixer") : null,
            ee === "fix-review" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => zt("diff") }, "Review diff") : null,
            ee === "split" && Te ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Te.id, "approved") }, "✓ Approve split plan") : null,
            ee === "split" && Te ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Xe(Te, "Split plan") }, "✗ Revise split") : null,
            ee === "generic" && U[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(U[0].id, "approved") }, "✓ Approve") : null,
            ee === "generic" && U[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Xe(U[0], "Decision") }, "✗ Request changes") : null,
            ur ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => P(!0) }, Et ? "View plan / handoff" : "View plan") : null,
            fr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => zt("diff") }, "View diff") : null,
            vr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Sn }, "Steer") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: kr }, "Advance state"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => _e(!0) }, "Jump to state"),
            pr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              var _;
              if (!(o != null && o.id)) return;
              const i = (_ = await Pe({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" })) == null ? void 0 : _.trim();
              c(o.id, "split-pr-stack", i ? { instructions: i } : {});
            } }, "Split PR") : null,
            gr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              if (!(o != null && o.id)) return;
              await _t({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: !0 }) && c(o.id, "rebase");
            } }, "Rebase") : null,
            (o == null ? void 0 : o.state) === "FAILED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry") : null,
            (o == null ? void 0 : o.state) === "PAUSED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unpause") : void 0 }, "Resume") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes((o == null ? void 0 : o.state) ?? "") ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: Pr }, "Add PR feedback") : null,
            fe(ye) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "pause") : void 0 }, "Pause") : null
          )
        ),
        Ln.length ? t(
          "section",
          { class: "forge-v3-ds forge-v3-stale-decisions" },
          t("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          t("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          Ln.map((i) => t("div", { class: "forge-v3-stale-decision-row", key: i.id }, t("span", null, i.type ?? "Decision"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Xe(i, "Stale decision") }, "Reject with feedback")))
        ) : null,
        Se ? t(
          "section",
          { class: "forge-v3-ds forge-v3-fix-approval" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "Fix approval"), t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ve(dt.map((i, _) => ft(i, _))) }, "Select all"), t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => ve([]) }, "None"))),
          dt.length ? t("div", { class: "forge-v3-fix-comment-list" }, dt.map((i, _) => {
            const y = ft(i, _), N = i.path ? `${i.path}${i.line ? `:${i.line}` : ""}` : "general", H = Za(i) ? Po(i, B) : null;
            return t(
              "label",
              { class: `forge-v3-fix-comment-card ${de.includes(y) ? "selected" : ""}`, key: y },
              t("input", { type: "checkbox", checked: de.includes(y), onChange: () => Rr(y) }),
              t(
                "div",
                null,
                t("div", { class: "forge-v3-fix-comment-meta" }, t("strong", null, i.author ?? "Reviewer"), H ? [" · ", t("span", { class: "forge-v3-fix-comment-pr" }, H)] : null, " · ", N),
                Ro(i.body),
                t("div", { class: "forge-v3-fix-comment-badges" }, [i.reviewState ?? i.state, i.source, H].filter(Boolean).map((ie) => t("span", null, ie)))
              )
            );
          })) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: $n }, de.length ? `Approve ${de.length} selected` : "Skip all comments"), de.length ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Zt }, "Skip all") : null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Xe(Se, "Fix approval") }, "Request different fixes"))
        ) : null,
        Te ? t(
          "section",
          { class: "forge-v3-ds forge-v3-split-approval" },
          t("div", { class: "forge-v3-ds-label" }, "Split approval"),
          t("p", null, St.summary),
          Tn.length ? t("div", { class: "forge-v3-split-stack" }, Tn.map((i, _) => t("div", { class: "forge-v3-split-row", key: `${i.branch}-${_}` }, t("span", null, String(_ + 1)), t("strong", null, i.title ?? i.branch ?? `PR ${_ + 1}`), t("small", null, i.summary ?? i.branch ?? "pending branch")))) : null,
          St.markdown ? t(
            "details",
            { class: "forge-v3-split-plan-preview" },
            t("summary", null, "Full split plan"),
            t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Qe(St.markdown) } })
          ) : null,
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Te.id, "approved") }, "Approve split plan"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Xe(Te, "Split plan") }, "Request split changes"))
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
            t("div", { class: `forge-v3-ig-value ${Nn(o == null ? void 0 : o.priority)}` }, lr),
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
              const y = i.pr_number, N = i.url ?? null, F = i.branch ?? i.gt_branch ?? "pending", H = Number(i.checksFailed ?? 0) > 0 ? "bad" : Number(i.checksPending ?? 0) > 0 ? "pending" : "ok";
              return t(
                "div",
                { class: "forge-v3-pr-row", key: `${F}-${y ?? _}` },
                t("span", { class: "forge-v3-pr-pos" }, String(_ + 1)),
                t("span", { class: "forge-v3-pr-branch" }, F),
                N ? t("a", { class: "forge-v3-pr-badge", href: N, target: "_blank", rel: "noreferrer" }, `#${y} ↗`) : t("span", { class: "forge-v3-pr-badge" }, "no PR"),
                t("span", { class: `forge-v3-ci-badge ${i.isInMergeQueue ? "merge-queue" : ""}` }, i.isInMergeQueue ? "MERGE QUEUE" : i.liveState ?? i.status ?? "unknown"),
                i.isInMergeQueue ? t("span", { class: "forge-v3-pr-meta-badge merge-queue" }, i.mergeQueuePosition ? `Queue #${i.mergeQueuePosition}` : "Queued") : null,
                i.reviewDecision ? t("span", { class: "forge-v3-pr-meta-badge" }, i.reviewDecision) : null,
                i.mergeable ? t("span", { class: "forge-v3-pr-meta-badge" }, i.mergeable) : null,
                i.checksTotal != null ? t("span", { class: `forge-v3-pr-meta-badge checks-${H}` }, `${i.checksFailed ?? 0} failed · ${i.checksPending ?? 0} pending · ${i.checksTotal ?? 0} checks`) : null
              );
            }) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        t("section", { class: "forge-v3-ds" }, t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "Auto-fix"), t("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: wt, disabled: !(o != null && o.id), onChange: (i) => wr(i.target.checked) }), t("span", null))))
      ),
      k === "activity" && jo(v, ye),
      k === "ask" && t(
        "div",
        { class: "forge-v3-ask-panel" },
        t(
          "section",
          { class: "forge-v3-ds forge-v3-ask-intro" },
          t("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          t("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          t("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((i) => t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => en(i) }, i)))
        ),
        t(
          "section",
          { class: "forge-v3-ask-thread", ref: (i) => {
            i && (i.scrollTop = i.scrollHeight);
          } },
          je.length || R === "thinking" || O ? [
            ...je.filter((i) => i.role === "user" || i.text.trim()).map((i, _) => t(
              "div",
              { key: `${_}-${i.role}`, class: `forge-v3-ask-msg ${i.role}` },
              t("span", null, i.role === "user" ? "You" : "Forge"),
              t("pre", null, i.text)
            )),
            R === "thinking" ? t("div", { class: "forge-v3-ask-thinking", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Thinking"), t("i", null, "."), t("i", null, "."), t("i", null, ".")) : null,
            O ? t("div", { class: "forge-v3-ask-current-status" }, O) : null
          ] : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        t(
          "section",
          { class: "forge-v3-ask-compose" },
          t("textarea", { rows: 3, placeholder: "Ask about this issue…", value: Be, onInput: (i) => en(i.target.value), onKeyDown: (i) => {
            (i.metaKey || i.ctrlKey) && i.key === "Enter" && On();
          } }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !Be.trim() || R === "thinking", onClick: On }, R === "thinking" ? "Asking…" : "Ask"),
            R === "thinking" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => {
              var i;
              (i = q.current) == null || i.abort(), S(""), D("");
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
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, Et ? "Plan + handoff · " : "Plan review · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? _r.label)),
          t("button", { type: "button", onClick: () => P(!1), "aria-label": "Close plan modal" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-md-viewer forge-v3-doc-stack" },
          t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Plan"),
            t("div", { dangerouslySetInnerHTML: { __html: Qe(cr) } })
          ),
          Et ? t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Handoff"),
            t("div", { dangerouslySetInnerHTML: { __html: Qe(dr) } })
          ) : null
        ),
        t(
          "footer",
          null,
          t("textarea", { placeholder: "Feedback for requested changes…", rows: 3, value: st, onInput: (i) => At(i.target.value) }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: xn }, "✓ Approve plan") : null,
            We ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => st.trim() ? Ae(We.id, "rejected", { reason: st.trim() }) : Xe(We, "Plan review") }, "✗ Request changes") : null,
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
              const y = i.kind === "thinking_delta" || i.kind === "thinking", N = i.kind === "error" ? "err" : i.kind === "tool" ? "ok" : y ? "me" : "live", F = i.kind === "tool" ? "tool" : y ? "thinking" : i.kind === "prompt" ? "prompt" : i.kind === "error" ? "error" : "assistant";
              return t(
                "div",
                { key: `${_}-${i.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${i.kind}` },
                t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${N}` }), _ < oe.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
                t(
                  "div",
                  { class: "forge-v3-af-content" },
                  t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${N === "me" ? "me" : "ag"}` }, F), t("span", { class: "forge-v3-af-time" }, `#${_ + 1}`)),
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
            t("p", null, ((qn = G == null ? void 0 : G.tour) == null ? void 0 : qn.summary) ?? pe ?? "Tour summary unavailable")
          ),
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Er(!!(G != null && G.tour)) }, G != null && G.tour ? "Regenerate tour" : "Generate tour"),
          (jn = (Bn = G == null ? void 0 : G.tour) == null ? void 0 : Bn.highlights) != null && jn.length ? t("ul", null, G.tour.highlights.map((i) => t("li", null, typeof i == "string" ? i : [i.title ? t("b", null, i.title, ": ") : null, i.text ?? i.file ?? "Highlight", i.file ? ` (${i.file}${i.line ? `:${i.line}` : ""})` : ""]))) : null
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
                { key: i.path, type: "button", class: (ue == null ? void 0 : ue.path) === i.path ? "active" : "", title: i.path, onClick: () => A(i.path) },
                t("span", null, C ? t("span", { class: "forge-v3-reviewed-file" }, t("input", { type: "checkbox", checked: Ee.includes(i.path), onClick: (_) => _.stopPropagation(), onChange: () => Gn(i.path) }), ka(i.path)) : ka(i.path)),
                t("small", { class: "forge-v3-diff-file-counts" }, t("span", { class: "add" }, `+${i.additions}`), " ", t("span", { class: "del" }, `−${i.deletions}`), ke.some((_) => _.file === i.path) ? " · comments" : "")
              ))
            ),
            t(
              "section",
              { class: "forge-v3-diff-main" },
              ue ? t(
                "article",
                { class: "forge-v3-diff-file" },
                t("header", null, t("strong", { title: ue.path }, ue.path), t("span", null, `+${ue.additions} −${ue.deletions}`), C ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Gn(ue.path) }, Ee.includes(ue.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                t(
                  "div",
                  { class: "forge-v3-diff-table-wrap" },
                  t(
                    "table",
                    { class: "forge-v3-diff-table" },
                    t("tbody", null, ue.hunks.map((i, _) => t(
                      "tr",
                      { key: `${_}-${i.slice(0, 12)}`, class: `forge-v3-diff-line ${Mo(i)}` },
                      t("td", { class: "forge-v3-diff-ln" }, C ? t("button", { type: "button", title: "Add line comment", onClick: () => Yt(ue.path, _ + 1) }, String(_ + 1)) : String(_ + 1)),
                      t("td", { class: "forge-v3-diff-sign" }, Uo(i)),
                      t("td", { class: "forge-v3-diff-content" }, t("code", null, i.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                C ? t("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => Yt(ue.path, null) }, "+ Add file comment") : null
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
            t("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: Ue, onInput: (i) => ae(i.target.value) }),
            ke.length ? t("div", { class: "forge-v3-review-comments" }, ke.map((i) => t("span", { key: i.id }, `${i.file}${i.line ? `:${i.line}` : ""} — ${i.body}`))) : null
          ) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            C && ct ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Wn("approved") }, "✓ Approve code") : null,
            C && ct ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Wn("rejected") }, "✗ Request changes") : null,
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
            hr.map((i) => t(
              "button",
              { key: i.state, type: "button", class: `forge-v3-jump-state-option ${i.risky ? "risky" : ""}`, onClick: () => br(i) },
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
          lt ? t("div", { class: `forge-v3-admin-status ${lt.includes("failed") ? "failed" : ""}` }, lt) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Ar }, "Launch runtime"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: d }, "Stop VM runtime"),
            o != null && o.steering_context ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: mr }, "Clear steering") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => o != null && o.id ? c(o.id, "ignore") : void 0 }, "Ignore"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: Ir }, "Full reset"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || fe(ye), onClick: yr }, "Remove issue")
          )
        )
      )
    )
  );
}
const or = "forge.v3.detailPanelWidth", Na = 500, $i = 440, Wi = 760;
function ir(e) {
  return Math.min(Wi, Math.max($i, Math.round(e)));
}
function Di() {
  const e = window.localStorage.getItem(or), n = e ? Number(e) : Na;
  return Number.isFinite(n) ? ir(n) : Na;
}
function Oi() {
  var je;
  const e = qt(), [n, a] = w(ga), [r, s] = w({ issues: [], decisions: [], runningAgents: [] }), [l, c] = w([]), [g, u] = w(e.view === "queue" ? e.issueId : null), [d, h] = w(0), [b, f] = w(e.view), [k, p] = w(!1), [v, I] = w(""), [T, P] = w(null), L = Ve(/* @__PURE__ */ new Map()), [W, j] = w(0), [Y, X] = w(e.addIssue), [J, te] = w(Di), [$, A] = w("connecting"), [C, V] = w(!1), [G, ne] = w(() => _i()), pe = Ve(!1), ce = Ve(/* @__PURE__ */ new Set()), Ee = Ve(g), Ne = Ve({ issues: [], decisions: [], runningAgents: [] }), ke = (m, R) => {
    if (!R) return "";
    const S = m.issues.find((D) => D.id === R), O = m.decisions.filter((D) => D.issue_id === R).map((D) => [D.id, D.type, D.created_at, D.resolved_at, D.artifact_ref].join(":")).sort().join(",");
    return `${(S == null ? void 0 : S.state) ?? ""}|${(S == null ? void 0 : S.updated_at) ?? ""}|${O}`;
  }, ge = (m = !1) => {
    const R = [
      le("/api/overview"),
      le("/api/settings"),
      m ? le("/api/archive").catch(() => []) : Promise.resolve([])
    ];
    return Promise.all(R).then(([S, O, D]) => {
      const q = ri(S), o = L.current;
      for (const B of q.issues) {
        const ye = o.get(B.id);
        ye && ye !== "DONE" && B.state === "DONE" && (P(B), setTimeout(() => P(null), 6e3)), o.set(B.id, B.state ?? "");
      }
      Ne.current = q, s(q);
      const U = m ? D.length : n.archiveCount;
      return a({ ...hi(q, O), archiveCount: U }), q.decisions.forEach((B) => {
        ce.current.has(B.id) || (ce.current.add(B.id), mi(B, q.issues.find((ye) => ye.id === B.issue_id), pe.current).catch(() => {
        }));
      }), q;
    });
  }, Ue = Ve(/* @__PURE__ */ (() => {
    let m = null;
    return () => {
      m && clearTimeout(m), m = setTimeout(() => ge(), 300);
    };
  })()), ae = (m, R) => {
    I(`${m}…`), R().then(() => ge()).then(() => {
      j((S) => S + 1), I(`${m} complete`);
    }).catch((S) => {
      I(`${m} failed`);
      const O = S instanceof Error ? S.message : String(S);
      bi({ title: `${m} failed`, message: O });
    });
  }, de = (m, R, S) => {
    const O = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" }
    };
    s((D) => {
      var U;
      const q = D.decisions.find((B) => B.id === m), o = q != null && q.type ? (U = O[R]) == null ? void 0 : U[q.type] : void 0;
      return {
        ...D,
        decisions: D.decisions.filter((B) => B.id !== m),
        issues: o && q ? D.issues.map((B) => B.id === q.issue_id ? { ...B, state: o } : B) : D.issues
      };
    }), ae(
      R === "approved" ? "Decision approved" : "Decision changes requested",
      () => ii(m, R, S).catch((D) => {
        const q = D instanceof Error ? D.message : String(D);
        if (!(q.includes("409") || q.toLowerCase().includes("already resolved")))
          throw s((o) => ({
            ...o,
            decisions: o.decisions.some((U) => U.id === m) ? o.decisions : [...o.decisions, { id: m }]
          })), D;
      })
    );
  }, ve = (m, R, S) => ae(`Issue ${R}`, () => si(m, R, S)), He = (m) => ae("Issue removed", () => li(m).then(() => E())), qe = (m) => ci(m), Ie = async () => {
    await _t({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: !0 }) && ae("VM runtime stopped", () => di());
  }, _e = (m) => ae("PR stack synced", () => ui(m)), Re = (m, R, S) => ae("PR feedback added", () => fi(m, R, S)), me = (m) => {
    u(m), f("queue"), window.requestAnimationFrame(() => rt("queue", { issueId: m }));
  }, E = () => {
    u(null), rt("queue");
  }, M = (m, R) => {
    u(m), f("queue"), h((S) => S + 1), rt("queue", { issueId: m });
  }, oe = () => {
    const m = ai(r.decisions, r.issues);
    m && M(m.issue_id, m.id);
  }, Z = () => {
    f("queue"), X(!0), Bt({ view: "queue", add: "issue" }, !1);
  }, st = () => {
    X(!1), Bt({ add: null });
  }, At = () => ae("Linear backlog refreshed", () => le("/api/linear/issues").then((m) => c(Array.isArray(m) ? m : []))), lt = (m, R = "", S) => ae("Manual issue created", () => pi(m, R, S).then((O) => {
    O.issueId && me(O.issueId);
  })), tt = (m, R = "", S) => ae(`Enqueued ${m}`, () => gi(m, R, S).then((O) => {
    O.issueId && me(O.issueId);
  }).then(() => le("/api/linear/issues")).then((O) => c(Array.isArray(O) ? O : []))), wt = () => {
    if (C) {
      I("Sending desktop companion notification…"), ar("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test").then(() => I("Desktop companion notification sent")).catch(() => I("Desktop companion notification failed"));
      return;
    }
    if (!Rn()) {
      ne("unsupported");
      return;
    }
    window.Notification.requestPermission().then((m) => ne(m));
  }, nt = (m) => {
    f(m), u(null), rt(m);
  }, Be = (m) => {
    m.preventDefault(), document.body.classList.add("forge-v3-resizing-detail");
    const R = (O) => te(ir(window.innerWidth - O.clientX)), S = () => {
      document.body.classList.remove("forge-v3-resizing-detail"), window.removeEventListener("pointermove", R), window.removeEventListener("pointerup", S), window.removeEventListener("pointercancel", S);
    };
    window.addEventListener("pointermove", R), window.addEventListener("pointerup", S), window.addEventListener("pointercancel", S);
  };
  K(() => {
    document.documentElement.style.setProperty("--panel-w", `${J}px`), window.localStorage.setItem(or, String(J));
  }, [J]), K(() => {
    Ee.current = g;
  }, [g]), K(() => {
    if (!v || v.endsWith("…")) return;
    const m = window.setTimeout(() => I(""), 3500);
    return () => window.clearTimeout(m);
  }, [v]), K(() => {
    let m = !1;
    return vi().then((R) => {
      if (m) return;
      const S = !!R.notifications;
      pe.current = S, V(S);
    }).catch(() => {
      m || (pe.current = !1, V(!1));
    }), () => {
      m = !0;
    };
  }, []), K(() => {
    const m = (R) => {
      (R.metaKey || R.ctrlKey) && R.key.toLowerCase() === "k" && (R.preventDefault(), p((S) => !S)), R.key === "Escape" && p(!1);
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, []), K(() => {
    const m = () => {
      const R = qt();
      f(R.view), u(R.issueId), X(R.addIssue), (R.decisionId || R.panel === "review") && h((S) => S + 1);
    };
    return window.addEventListener("hashchange", m), window.addEventListener("popstate", m), () => {
      window.removeEventListener("hashchange", m), window.removeEventListener("popstate", m);
    };
  }, []), K(() => {
    let m = !1;
    const R = () => {
      ge(!0).catch(() => {
        m || a(ga);
      });
    };
    R(), le("/api/linear/issues").then((O) => {
      m || c(Array.isArray(O) ? O : []);
    }).catch(() => {
    });
    const S = window.setInterval(R, $ === "offline" ? 1e4 : 3e4);
    return () => {
      m = !0, window.clearInterval(S);
    };
  }, [$]), K(() => {
    if (ze()) return;
    let m = !1;
    const R = new EventSource("/api/events"), S = (O) => {
      const D = O.type === "issue_updated" || O.type === "issue_removed", q = Ee.current, o = ke(Ne.current, q);
      if (O.type === "tick") {
        Ue.current();
        return;
      }
      ge(D).then((U) => {
        q && ke(U, q) !== o && j((B) => B + 1);
      }).catch(() => {
      });
    };
    return R.onopen = () => {
      m || A("live");
    }, R.onerror = () => {
      m || A("offline");
    }, ["tick", "issue_added", "issue_removed", "issue_updated", "decision_resolved"].forEach((O) => {
      R.addEventListener(O, S);
    }), () => {
      m = !0, R.close();
    };
  }, []);
  const Pt = g ? r.issues.find((m) => m.id === g) ?? null : null;
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
        ht.slice(0, 2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              f(m.key), u(null), rt(m.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, m.icon),
            t("span", { class: "forge-v3-nav-label" }, m.label),
            m.key === "queue" && n.awaitingDecisionsCount > 0 ? t("span", { class: "forge-v3-nav-badge", "aria-label": `${n.awaitingDecisionsCount} pending decisions` }, String(n.awaitingDecisionsCount)) : m.key === "archive" ? t("span", { class: "forge-v3-nav-count" }, String(n.archiveCount)) : null
          )
        ),
        t("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => p(!0) }, t("span", { class: "forge-v3-nav-icon" }, "⌘"), t("span", { class: "forge-v3-nav-label" }, "Command palette"), t("kbd", null, "⌘K")),
        ht.slice(2).map(
          (m) => t(
            "button",
            { key: m.key, type: "button", class: `forge-v3-nav-item ${b === m.key ? "active" : ""}`, "data-view": m.key, onClick: () => {
              f(m.key), u(null), rt(m.key);
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
        t("div", { class: `forge-v3-session-chip event-${$}` }, $ === "live" ? "● Live events" : $ === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        t("button", { type: "button", class: `forge-v3-notification-toggle ${C ? "desktop" : "browser"}`, disabled: !C && (G === "unsupported" || G === "denied" || G === "granted"), onClick: wt }, C ? "🔔 Desktop companion" : G === "granted" ? "🔔 Browser notifications on" : G === "denied" ? "🔕 Notifications blocked" : G === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        t("div", { class: "forge-v3-session-chip" }, C ? "● Native notifications available" : "○ Browser notification fallback"),
        t("div", { class: "forge-v3-session-chip" }, "● Workspace · ", n.model),
        t("div", { class: "forge-v3-model-row" }, "🤖 ", n.backend)
      )
    ),
    v ? t("div", { class: "forge-v3-action-status", role: "status" }, v) : null,
    T ? t("div", { class: "forge-v3-celebration", role: "status" }, t("strong", null, "🎉 ", T.linear_id ?? `Issue #${T.id}`, " completed!"), t("small", null, T.title ?? "Issue merged and archived")) : null,
    b === "queue" ? t(wi, { issues: r.issues, decisions: r.decisions, linearBacklog: l, selectedIssueId: g, addIssueOpen: Y, onOpenIssue: me, onIssueAction: ve, onResolveDecision: de, onReviewNext: oe, onReviewIssue: M, onAddIssue: Z, onCloseAddIssue: st, onRefreshLinear: At, onCreateManualIssue: lt, onEnqueueLinear: tt }) : b === "archive" ? t(Gi, null) : b === "settings" ? t(Ni, null) : b === "prompts" ? t(Si, null) : b === "learnings" ? t(Ri, null) : t("main", { class: "forge-v3-main", "data-active-view": b }, t("h1", null, ((je = ht.find((m) => m.key === b)) == null ? void 0 : je.label) ?? "Dashboard"), t("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    t(xi, { issueId: b === "queue" ? g : null, issuePreview: Pt, reloadKey: W, autoOpenDiffKey: d, onClose: E, onPanelResizeStart: Be, onIssueAction: ve, onRemoveIssue: He, onLaunchRuntime: qe, onStopVm: Ie, onSyncPrs: _e, onSubmitFeedback: Re, onResolveDecision: de }),
    t(Ai, { open: k, decisions: r.decisions, onClose: () => p(!1), onNavigate: nt, onRefresh: () => ge(), onOpenIssue: me, onReviewNext: oe, onAddIssue: Z, onStopVm: Ie }),
    n.runningAgentsCount > 0 ? t(yi, { status: n, onStopVm: Ie }) : null
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
const dn = document.getElementById("forge-react-root");
dn && (Je(t(Oi, null), dn), dn.dataset.reactiveDashboardMounted = "true");
