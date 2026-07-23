var Vt, G, ya, De, Vn, ka, Ia, Jt, Nt, ft, Aa, pn, rn, on, Gt = {}, $t = [], _r = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, mt = Array.isArray;
function Ne(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function gn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function t(e, n, a) {
  var r, s, l, c = {};
  for (l in n) l == "key" ? r = n[l] : l == "ref" ? s = n[l] : c[l] = n[l];
  if (arguments.length > 2 && (c.children = arguments.length > 3 ? Vt.call(arguments, 2) : a), typeof e == "function" && e.defaultProps != null) for (l in e.defaultProps) c[l] === void 0 && (c[l] = e.defaultProps[l]);
  return St(e, c, r, s, null);
}
function St(e, n, a, r, s) {
  var l = { type: e, props: n, key: a, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: s ?? ++ya, __i: -1, __u: 0 };
  return s == null && G.vnode != null && G.vnode(l), l;
}
function Ze(e) {
  return e.children;
}
function Se(e, n) {
  this.props = e, this.context = n;
}
function et(e, n) {
  if (n == null) return e.__ ? et(e.__, e.__i + 1) : null;
  for (var a; n < e.__k.length; n++) if ((a = e.__k[n]) != null && a.__e != null) return a.__e;
  return typeof e.type == "function" ? et(e) : null;
}
function mr(e) {
  if (e.__P && e.__d) {
    var n = e.__v, a = n.__e, r = [], s = [], l = Ne({}, n);
    l.__v = n.__v + 1, G.vnode && G.vnode(l), vn(e.__P, l, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [a] : null, r, a ?? et(n), !!(32 & n.__u), s), l.__v = n.__v, l.__.__k[l.__i] = l, Sa(r, l, s), n.__e = n.__ = null, l.__e != a && wa(l);
  }
}
function wa(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(n) {
    if (n != null && n.__e != null) return e.__e = e.__c.base = n.__e;
  }), wa(e);
}
function Hn(e) {
  (!e.__d && (e.__d = !0) && De.push(e) && !xt.__r++ || Vn != G.debounceRendering) && ((Vn = G.debounceRendering) || ka)(xt);
}
function xt() {
  try {
    for (var e, n = 1; De.length; ) De.length > n && De.sort(Ia), e = De.shift(), n = De.length, mr(e);
  } finally {
    De.length = xt.__r = 0;
  }
}
function Pa(e, n, a, r, s, l, c, g, f, d, h) {
  var y, u, v, b, p, P, N, R = r && r.__k || $t, $ = n.length;
  for (f = hr(a, n, R, f, $), y = 0; y < $; y++) (v = a.__k[y]) != null && (u = v.__i != -1 && R[v.__i] || Gt, v.__i = y, P = vn(e, v, u, s, l, c, g, f, d, h), b = v.__e, v.ref && u.ref != v.ref && (u.ref && _n(u.ref, null, v), h.push(v.ref, v.__c || b, v)), p == null && b != null && (p = b), (N = !!(4 & v.__u)) || u.__k === v.__k ? (f = Ea(v, f, e, N), N && u.__e && (u.__e = null)) : typeof v.type == "function" && P !== void 0 ? f = P : b && (f = b.nextSibling), v.__u &= -7);
  return a.__e = p, f;
}
function hr(e, n, a, r, s) {
  var l, c, g, f, d, h = a.length, y = h, u = 0;
  for (e.__k = new Array(s), l = 0; l < s; l++) (c = n[l]) != null && typeof c != "boolean" && typeof c != "function" ? (typeof c == "string" || typeof c == "number" || typeof c == "bigint" || c.constructor == String ? c = e.__k[l] = St(null, c, null, null, null) : mt(c) ? c = e.__k[l] = St(Ze, { children: c }, null, null, null) : c.constructor === void 0 && c.__b > 0 ? c = e.__k[l] = St(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v) : e.__k[l] = c, f = l + u, c.__ = e, c.__b = e.__b + 1, g = null, (d = c.__i = br(c, a, f, y)) != -1 && (y--, (g = a[d]) && (g.__u |= 2)), g == null || g.__v == null ? (d == -1 && (s > h ? u-- : s < h && u++), typeof c.type != "function" && (c.__u |= 4)) : d != f && (d == f - 1 ? u-- : d == f + 1 ? u++ : (d > f ? u-- : u++, c.__u |= 4))) : e.__k[l] = null;
  if (y) for (l = 0; l < h; l++) (g = a[l]) != null && (2 & g.__u) == 0 && (g.__e == r && (r = et(g)), Ta(g, g));
  return r;
}
function Ea(e, n, a, r) {
  var s, l;
  if (typeof e.type == "function") {
    for (s = e.__k, l = 0; s && l < s.length; l++) s[l] && (s[l].__ = e, n = Ea(s[l], n, a, r));
    return n;
  }
  e.__e != n && (r && (n && e.type && !n.parentNode && (n = et(e)), a.insertBefore(e.__e, n || null)), n = e.__e);
  do
    n = n && n.nextSibling;
  while (n != null && n.nodeType == 8);
  return n;
}
function Dt(e, n) {
  return n = n || [], e == null || typeof e == "boolean" || (mt(e) ? e.some(function(a) {
    Dt(a, n);
  }) : n.push(e)), n;
}
function br(e, n, a, r) {
  var s, l, c, g = e.key, f = e.type, d = n[a], h = d != null && (2 & d.__u) == 0;
  if (d === null && g == null || h && g == d.key && f == d.type) return a;
  if (r > (h ? 1 : 0)) {
    for (s = a - 1, l = a + 1; s >= 0 || l < n.length; ) if ((d = n[c = s >= 0 ? s-- : l++]) != null && (2 & d.__u) == 0 && g == d.key && f == d.type) return c;
  }
  return -1;
}
function qn(e, n, a) {
  n[0] == "-" ? e.setProperty(n, a ?? "") : e[n] = a == null ? "" : typeof a != "number" || _r.test(n) ? a : a + "px";
}
function Pt(e, n, a, r, s) {
  var l, c;
  e: if (n == "style") if (typeof a == "string") e.style.cssText = a;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (n in r) a && n in a || qn(e.style, n, "");
    if (a) for (n in a) r && a[n] == r[n] || qn(e.style, n, a[n]);
  }
  else if (n[0] == "o" && n[1] == "n") l = n != (n = n.replace(Aa, "$1")), c = n.toLowerCase(), n = c in e || n == "onFocusOut" || n == "onFocusIn" ? c.slice(2) : n.slice(2), e.l || (e.l = {}), e.l[n + l] = a, a ? r ? a[ft] = r[ft] : (a[ft] = pn, e.addEventListener(n, l ? on : rn, l)) : e.removeEventListener(n, l ? on : rn, l);
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
function Bn(e) {
  return function(n) {
    if (this.l) {
      var a = this.l[n.type + e];
      if (n[Nt] == null) n[Nt] = pn++;
      else if (n[Nt] < a[ft]) return;
      return a(G.event ? G.event(n) : n);
    }
  };
}
function vn(e, n, a, r, s, l, c, g, f, d) {
  var h, y, u, v, b, p, P, N, R, $, U, B, Y, W, X, H, M = n.type;
  if (n.constructor !== void 0) return null;
  128 & a.__u && (f = !!(32 & a.__u), l = [g = n.__e = a.__e]), (h = G.__b) && h(n);
  e: if (typeof M == "function") {
    y = c.length;
    try {
      if (R = n.props, $ = M.prototype && M.prototype.render, U = (h = M.contextType) && r[h.__c], B = h ? U ? U.props.value : h.__ : r, a.__c ? N = (u = n.__c = a.__c).__ = u.__E : ($ ? n.__c = u = new M(R, B) : (n.__c = u = new Se(R, B), u.constructor = M, u.render = kr), U && U.sub(u), u.state || (u.state = {}), u.__n = r, v = u.__d = !0, u.__h = [], u._sb = []), $ && u.__s == null && (u.__s = u.state), $ && M.getDerivedStateFromProps != null && (u.__s == u.state && (u.__s = Ne({}, u.__s)), Ne(u.__s, M.getDerivedStateFromProps(R, u.__s))), b = u.props, p = u.state, u.__v = n, v) $ && M.getDerivedStateFromProps == null && u.componentWillMount != null && u.componentWillMount(), $ && u.componentDidMount != null && u.__h.push(u.componentDidMount);
      else {
        if ($ && M.getDerivedStateFromProps == null && R !== b && u.componentWillReceiveProps != null && u.componentWillReceiveProps(R, B), n.__v == a.__v || !u.__e && u.shouldComponentUpdate != null && u.shouldComponentUpdate(R, u.__s, B) === !1) {
          n.__v != a.__v && (u.props = R, u.state = u.__s, u.__d = !1), n.__e = a.__e, n.__k = a.__k, n.__k.some(function(k) {
            k && (k.__ = n);
          }), $t.push.apply(u.__h, u._sb), u._sb = [], u.__h.length && c.push(u);
          break e;
        }
        u.componentWillUpdate != null && u.componentWillUpdate(R, u.__s, B), $ && u.componentDidUpdate != null && u.__h.push(function() {
          u.componentDidUpdate(b, p, P);
        });
      }
      if (u.context = B, u.props = R, u.__P = e, u.__e = !1, Y = G.__r, W = 0, $) u.state = u.__s, u.__d = !1, Y && Y(n), h = u.render(u.props, u.state, u.context), $t.push.apply(u.__h, u._sb), u._sb = [];
      else do
        u.__d = !1, Y && Y(n), h = u.render(u.props, u.state, u.context), u.state = u.__s;
      while (u.__d && ++W < 25);
      u.state = u.__s, u.getChildContext != null && (r = Ne(Ne({}, r), u.getChildContext())), $ && !v && u.getSnapshotBeforeUpdate != null && (P = u.getSnapshotBeforeUpdate(b, p)), X = h != null && h.type === Ze && h.key == null ? Ra(h.props.children) : h, g = Pa(e, mt(X) ? X : [X], n, a, r, s, l, c, g, f, d), u.base = n.__e, n.__u &= -161, u.__h.length && c.push(u), N && (u.__E = u.__ = null);
    } catch (k) {
      if (c.length = y, n.__v = null, f || l != null) {
        if (k.then) {
          for (n.__u |= f ? 160 : 128; g && g.nodeType == 8 && g.nextSibling; ) g = g.nextSibling;
          l != null && (l[l.indexOf(g)] = null), n.__e = g;
        } else if (l != null) for (H = l.length; H--; ) gn(l[H]);
      } else n.__e = a.__e;
      n.__k == null && (n.__k = a.__k || []), k.then || Na(n), G.__e(k, n, a);
    }
  } else l == null && n.__v == a.__v ? (n.__k = a.__k, n.__e = a.__e) : g = n.__e = yr(a.__e, n, a, r, s, l, c, f, d);
  return (h = G.diffed) && h(n), 128 & n.__u ? void 0 : g;
}
function Na(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(Na));
}
function Sa(e, n, a) {
  for (var r = 0; r < a.length; r++) _n(a[r], a[++r], a[++r]);
  G.__c && G.__c(n, e), e.some(function(s) {
    try {
      e = s.__h, s.__h = [], e.some(function(l) {
        l.call(s);
      });
    } catch (l) {
      G.__e(l, s.__v);
    }
  });
}
function Ra(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : mt(e) ? e.map(Ra) : e.constructor !== void 0 ? null : Ne({}, e);
}
function yr(e, n, a, r, s, l, c, g, f) {
  var d, h, y, u, v, b, p, P = a.props || Gt, N = n.props, R = n.type;
  if (R == "svg" ? s = "http://www.w3.org/2000/svg" : R == "math" ? s = "http://www.w3.org/1998/Math/MathML" : s || (s = "http://www.w3.org/1999/xhtml"), l != null) {
    for (d = 0; d < l.length; d++) if ((v = l[d]) && "setAttribute" in v == !!R && (R ? v.localName == R : v.nodeType == 3)) {
      e = v, l[d] = null;
      break;
    }
  }
  if (e == null) {
    if (R == null) return document.createTextNode(N);
    e = document.createElementNS(s, R, N.is && N), g && (G.__m && G.__m(n, l), g = !1), l = null;
  }
  if (R == null) P === N || g && e.data == N || (e.data = N);
  else {
    if (l = R == "textarea" && N.defaultValue != null ? null : l && Vt.call(e.childNodes), !g && l != null) for (P = {}, d = 0; d < e.attributes.length; d++) P[(v = e.attributes[d]).name] = v.value;
    for (d in P) v = P[d], d == "dangerouslySetInnerHTML" ? y = v : d == "children" || d in N || d == "value" && "defaultValue" in N || d == "checked" && "defaultChecked" in N || Pt(e, d, null, v, s);
    for (d in N) v = N[d], d == "children" ? u = v : d == "dangerouslySetInnerHTML" ? h = v : d == "value" ? b = v : d == "checked" ? p = v : g && typeof v != "function" || P[d] === v || Pt(e, d, v, P[d], s);
    if (h) g || y && (h.__html == y.__html || h.__html == e.innerHTML) || (e.innerHTML = h.__html), n.__k = [];
    else if (y && (e.innerHTML = ""), Pa(n.type == "template" ? e.content : e, mt(u) ? u : [u], n, a, r, R == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s, l, c, l ? l[0] : a.__k && et(a, 0), g, f), l != null) for (d = l.length; d--; ) gn(l[d]);
    g && R != "textarea" || (d = "value", R == "progress" && b == null ? e.removeAttribute("value") : b != null && (b !== e[d] || R == "progress" && !b || R == "option" && b != P[d]) && Pt(e, d, b, P[d], s), d = "checked", p != null && p != e[d] && Pt(e, d, p, P[d], s));
  }
  return e;
}
function _n(e, n, a) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && n == null || (e.__u = e(n));
    } else e.current = n;
  } catch (s) {
    G.__e(s, a);
  }
}
function Ta(e, n, a) {
  var r, s;
  if (G.unmount && G.unmount(e), (r = e.ref) && (r.current && r.current != e.__e || _n(r, null, n)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (l) {
      G.__e(l, n);
    }
    r.base = r.__P = r.__n = null;
  }
  if (r = e.__k) for (s = 0; s < r.length; s++) r[s] && Ta(r[s], n, a || typeof e.type != "function");
  a || gn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function kr(e, n, a) {
  return this.constructor(e, a);
}
function Ue(e, n, a) {
  var r, s, l, c;
  n == document && (n = document.documentElement), G.__ && G.__(e, n), s = (r = !1) ? null : n.__k, l = [], c = [], vn(n, e = n.__k = t(Ze, null, [e]), s || Gt, Gt, n.namespaceURI, s ? null : n.firstChild ? Vt.call(n.childNodes) : null, l, s ? s.__e : n.firstChild, r, c), Sa(l, e, c), e.props.children = null;
}
Vt = $t.slice, G = { __e: function(e, n, a, r) {
  for (var s, l, c; n = n.__; ) if ((s = n.__c) && !s.__) try {
    if ((l = s.constructor) && l.getDerivedStateFromError != null && (s.setState(l.getDerivedStateFromError(e)), c = s.__d), s.componentDidCatch != null && (s.componentDidCatch(e, r || {}), c = s.__d), c) return s.__E = s;
  } catch (g) {
    e = g;
  }
  throw e;
} }, ya = 0, Se.prototype.setState = function(e, n) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = Ne({}, this.state), typeof e == "function" && (e = e(Ne({}, a), this.props)), e && Ne(a, e), e != null && this.__v && (n && this._sb.push(n), Hn(this));
}, Se.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), Hn(this));
}, Se.prototype.render = Ze, De = [], ka = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Ia = function(e, n) {
  return e.__v.__b - n.__v.__b;
}, xt.__r = 0, Jt = Math.random().toString(8), Nt = "__d" + Jt, ft = "__a" + Jt, Aa = /(PointerCapture)$|Capture$/i, pn = 0, rn = Bn(!1), on = Bn(!0);
var vt, q, Yt, jn, Wt = 0, Ca = [], Q = G, Qn = Q.__b, Kn = Q.__r, Xn = Q.diffed, zn = Q.__c, Jn = Q.unmount, Yn = Q.__;
function mn(e, n) {
  Q.__h && Q.__h(q, e, Wt || n), Wt = 0;
  var a = q.__H || (q.__H = { __: [], __h: [] });
  return e >= a.__.length && a.__.push({}), a.__[e];
}
function A(e) {
  return Wt = 1, Ir(Ga, e);
}
function Ir(e, n, a) {
  var r = mn(vt++, 2);
  if (r.t = e, !r.__c && (r.__ = [a ? a(n) : Ga(void 0, n), function(g) {
    var f = r.__N ? r.__N[0] : r.__[0], d = r.t(f, g);
    f !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = q, !q.__f)) {
    var s = function(g, f, d) {
      if (!r.__c.__H) return !0;
      var h = !1, y = r.__c.props !== g;
      if (r.__c.__H.__.some(function(v) {
        if (v.__N) {
          h = !0;
          var b = v.__[0];
          v.__ = v.__N, v.__N = void 0, b !== v.__[0] && (y = !0);
        }
      }), l) {
        var u = l.call(this, g, f, d);
        return h ? u || y : u;
      }
      return !h || y;
    };
    q.__f = !0;
    var l = q.shouldComponentUpdate, c = q.componentWillUpdate;
    q.componentWillUpdate = function(g, f, d) {
      if (this.__e) {
        var h = l;
        l = void 0, s(g, f, d), l = h;
      }
      c && c.call(this, g, f, d);
    }, q.shouldComponentUpdate = s;
  }
  return r.__N || r.__;
}
function K(e, n) {
  var a = mn(vt++, 3);
  !Q.__s && La(a.__H, n) && (a.__ = e, a.u = n, q.__H.__h.push(a));
}
function Je(e) {
  return Wt = 5, Rt(function() {
    return { current: e };
  }, []);
}
function Rt(e, n) {
  var a = mn(vt++, 7);
  return La(a.__H, n) && (a.__ = e(), a.__H = n, a.__h = e), a.__;
}
function Ar() {
  for (var e; e = Ca.shift(); ) {
    var n = e.__H;
    if (e.__P && n) try {
      n.__h.some(Tt), n.__h.some(sn), n.__h = [];
    } catch (a) {
      n.__h = [], Q.__e(a, e.__v);
    }
  }
}
Q.__b = function(e) {
  q = null, Qn && Qn(e);
}, Q.__ = function(e, n) {
  e && n.__k && n.__k.__m && (e.__m = n.__k.__m), Yn && Yn(e, n);
}, Q.__r = function(e) {
  Kn && Kn(e), vt = 0;
  var n = (q = e.__c).__H;
  n && (Yt === q ? (n.__h = [], q.__h = [], n.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (n.__h.some(Tt), n.__h.some(sn), n.__h = [], vt = 0)), Yt = q;
}, Q.diffed = function(e) {
  Xn && Xn(e);
  var n = e.__c;
  n && n.__H && (n.__H.__h.length && (Ca.push(n) !== 1 && jn === Q.requestAnimationFrame || ((jn = Q.requestAnimationFrame) || wr)(Ar)), n.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), Yt = q = null;
}, Q.__c = function(e, n) {
  n.some(function(a) {
    try {
      a.__h.some(Tt), a.__h = a.__h.filter(function(r) {
        return !r.__ || sn(r);
      });
    } catch (r) {
      n.some(function(s) {
        s.__h && (s.__h = []);
      }), n = [], Q.__e(r, a.__v);
    }
  }), zn && zn(e, n);
}, Q.unmount = function(e) {
  Jn && Jn(e);
  var n, a = e.__c;
  a && a.__H && (a.__H.__.some(function(r) {
    try {
      Tt(r);
    } catch (s) {
      n = s;
    }
  }), a.__H = void 0, n && Q.__e(n, a.__v));
};
var Zn = typeof requestAnimationFrame == "function";
function wr(e) {
  var n, a = function() {
    clearTimeout(r), Zn && cancelAnimationFrame(n), setTimeout(e);
  }, r = setTimeout(a, 35);
  Zn && (n = requestAnimationFrame(a));
}
function Tt(e) {
  var n = q, a = e.__c;
  typeof a == "function" && (e.__c = void 0, a()), q = n;
}
function sn(e) {
  var n = q;
  e.__c = e.__(), q = n;
}
function La(e, n) {
  return !e || e.length !== n.length || n.some(function(a, r) {
    return a !== e[r];
  });
}
function Ga(e, n) {
  return typeof n == "function" ? n(e) : n;
}
function Pr(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function ln(e, n) {
  for (var a in e) if (a !== "__source" && !(a in n)) return !0;
  for (var r in n) if (r !== "__source" && e[r] !== n[r]) return !0;
  return !1;
}
function ea(e, n) {
  this.props = e, this.context = n;
}
function Er(e, n) {
  function a(s) {
    var l = this.props.ref;
    return l != s.ref && l && (typeof l == "function" ? l(null) : l.current = null), n ? !n(this.props, s) || l != s.ref : ln(this.props, s);
  }
  function r(s) {
    return this.shouldComponentUpdate = a, t(e, s);
  }
  return r.displayName = "Memo(" + (e.displayName || e.name) + ")", r.__f = r.prototype.isReactComponent = !0, r.type = e, r;
}
(ea.prototype = new Se()).isPureReactComponent = !0, ea.prototype.shouldComponentUpdate = function(e, n) {
  return ln(this.props, e) || ln(this.state, n);
};
var ta = G.__b;
G.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), ta && ta(e);
};
var Nr = G.__e;
G.__e = function(e, n, a, r) {
  if (e.then) {
    for (var s, l = n; l = l.__; ) if ((s = l.__c) && s.__c) return n.__e == null && (n.__e = a.__e, n.__k = a.__k || []), s.__c(e, n);
  }
  Nr(e, n, a, r);
};
var na = G.unmount;
function $a(e, n, a) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), e.__c.__H = null), (e = Pr({}, e)).__c != null && (e.__c.__P === a && (e.__c.__P = n), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(r) {
    return $a(r, n, a);
  })), e;
}
function xa(e, n, a) {
  return e && a && (e.__v = null, e.__k = e.__k && e.__k.map(function(r) {
    return xa(r, n, a);
  }), e.__c && e.__c.__P === n && (e.__e && a.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = a)), e;
}
function Zt() {
  this.__u = 0, this.o = null, this.__b = null;
}
function Da(e) {
  var n = e.__ && e.__.__c;
  return n && n.__a && n.__a(e);
}
function Et() {
  this.i = null, this.l = null;
}
G.unmount = function(e) {
  var n = e.__c;
  n && (n.__z = !0), n && n.__R && n.__R(), n && 32 & e.__u && (e.type = null), na && na(e);
}, (Zt.prototype = new Se()).__c = function(e, n) {
  var a = n.__c, r = this;
  r.o == null && (r.o = []), r.o.push(a);
  var s = Da(r.__v), l = !1, c = function() {
    l || r.__z || (l = !0, a.__R = null, s ? s(f) : f());
  };
  a.__R = c;
  var g = a.__P;
  a.__P = null;
  var f = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var d = r.state.__a;
        r.__v.__k[0] = xa(d, d.__c.__P, d.__c.__O);
      }
      var h;
      for (r.setState({ __a: r.__b = null }); h = r.o.pop(); ) h.__P = g, h.forceUpdate();
    }
  };
  r.__u++ || 32 & n.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), e.then(c, c);
}, Zt.prototype.componentWillUnmount = function() {
  this.o = [];
}, Zt.prototype.render = function(e, n) {
  if (this.__b) {
    if (this.__v.__k) {
      var a = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = $a(this.__b, a, r.__O = r.__P);
    }
    this.__b = null;
  }
  var s = n.__a && t(Ze, null, e.fallback);
  return s && (s.__u &= -33), [t(Ze, null, n.__a ? null : e.children), s];
};
var aa = function(e, n, a) {
  if (++a[1] === a[0] && e.l.delete(n), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (a = e.i; a; ) {
    for (; a.length > 3; ) a.pop()();
    if (a[1] < a[0]) break;
    e.i = a = a[2];
  }
};
(Et.prototype = new Se()).__a = function(e) {
  var n = this, a = Da(n.__v), r = n.l.get(e);
  return r[0]++, function(s) {
    var l = function() {
      n.props.revealOrder ? (r.push(s), aa(n, e, r)) : s();
    };
    a ? a(l) : l();
  };
}, Et.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var n = Dt(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && n.reverse();
  for (var a = n.length; a--; ) this.l.set(n[a], this.i = [1, 0, this.i]);
  return e.children;
}, Et.prototype.componentDidUpdate = Et.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(n, a) {
    aa(e, a, n);
  });
};
var Sr = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Rr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Tr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Cr = /[A-Z0-9]/g, Lr = typeof document < "u", Gr = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
Se.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty(Se.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(n) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: n });
  } });
});
var ra = G.event;
G.event = function(e) {
  return ra && (e = ra(e)), e.persist = function() {
  }, e.isPropagationStopped = function() {
    return this.cancelBubble;
  }, e.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, e.nativeEvent = e;
};
var $r = { configurable: !0, get: function() {
  return this.class;
} }, oa = G.vnode;
G.vnode = function(e) {
  typeof e.type == "string" && (function(n) {
    var a = n.props, r = n.type, s = {}, l = r.indexOf("-") == -1;
    for (var c in a) {
      var g = a[c];
      if (!(c === "value" && "defaultValue" in a && g == null || Lr && c === "children" && r === "noscript" || c === "class" || c === "className")) {
        var f = c.toLowerCase();
        c === "defaultValue" && "value" in a && a.value == null ? c = "value" : c === "download" && g === !0 ? g = "" : f === "translate" && g === "no" ? g = !1 : f[0] === "o" && f[1] === "n" ? f === "ondoubleclick" ? c = "ondblclick" : f !== "onchange" || r !== "input" && r !== "textarea" || Gr(a.type) ? f === "onfocus" ? c = "onfocusin" : f === "onblur" ? c = "onfocusout" : Tr.test(c) && (c = f) : f = c = "oninput" : l && Rr.test(c) ? c = c.replace(Cr, "-$&").toLowerCase() : g === null && (g = void 0), f === "oninput" && s[c = f] && (c = "oninputCapture"), s[c] = g;
      }
    }
    r == "select" && (s.multiple && Array.isArray(s.value) && (s.value = Dt(a.children).forEach(function(d) {
      d.props.selected = s.value.indexOf(d.props.value) != -1;
    })), s.defaultValue != null && (s.value = Dt(a.children).forEach(function(d) {
      d.props.selected = s.multiple ? s.defaultValue.indexOf(d.props.value) != -1 : s.defaultValue == d.props.value;
    }))), a.class && !a.className ? (s.class = a.class, Object.defineProperty(s, "className", $r)) : a.className && (s.class = s.className = a.className), n.props = s;
  })(e), e.$$typeof = Sr, oa && oa(e);
};
var ia = G.__r;
G.__r = function(e) {
  ia && ia(e), e.__c;
};
var sa = G.diffed;
G.diffed = function(e) {
  sa && sa(e);
  var n = e.props, a = e.__e;
  a != null && e.type === "textarea" && "value" in n && n.value !== a.value && (a.value = n.value == null ? "" : n.value);
};
const pt = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" }
], cn = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "STEERING", "FAILED", "PAUSED", "IGNORED"] }
], xr = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" }
], Ht = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "forge_reuse_pi_sessions"] },
  { label: "External Services", keys: ["linear_enabled", "linear_team", "github_repo", "linear_poll_interval_seconds"] },
  { label: "Code Workspace", keys: ["worktree_provider", "repo_root", "wt_root", "worktree_root", "branch_prefix", "default_branch"] },
  { label: "Command Runtime", keys: ["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_frontend_local_backend_command", "vm_backend_staging_command", "vm_backend_local_command", "vm_database_command", "vm_command", "terminal_command"] },
  { label: "Agent Context", keys: ["project_prompt_overlay"] },
  { label: "Dashboard Backend", keys: ["dashboard_port", "backend", "backend_mode", "api_base_url"] }
], Dr = {
  Automation: "How many issues Forge can run, how often it wakes up, and how hard it should retry or loop before asking you.",
  "External Services": "Linear and GitHub identifiers used for issue lookup, PR links, review comments, and merge status.",
  "Code Workspace": "Where Forge finds your repository and where it creates issue worktrees and branches.",
  "Command Runtime": "How project commands are launched. Leave SSH fields blank for local-only command execution.",
  "Agent Context": "Repo-specific instructions appended to every agent prompt without editing the base prompt files.",
  "Dashboard Backend": "Connection details for this dashboard process and the desktop companion.",
  Other: "Settings in the database that this dashboard does not yet recognize."
}, Wa = {
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
  linear_poll_interval_seconds: { label: "Linear polling interval", hint: "How many seconds to wait between Linear sync/list checks when Linear integration is enabled." },
  worktree_provider: { label: "Worktree tool", hint: "Use git for plain git worktrees, or wt if you use Worktrunk." },
  repo_root: { label: "Main repository path", hint: "Path to the primary local clone. Required when Worktree tool is git." },
  wt_root: { label: "Worktrunk root path", hint: "Path to the Worktrunk repo root. Only used when Worktree tool is wt." },
  worktree_root: { label: "New worktrees folder", hint: "Directory where Forge creates new git worktrees for each issue." },
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
}, la = {
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
}, en = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser"], Oa = {
  planner: "model_planner",
  "plan-reviewer": "model_plan_reviewer",
  coder: "model_coder",
  reviewer: "model_reviewer",
  "git-agent": "model_git_agent",
  fixer: "model_fixer",
  "split-planner": "model_split_planner",
  splitter: "model_splitter",
  rebaser: "model_rebaser"
}, Wr = ["model", "default_model", ...Object.values(Oa)], hn = /* @__PURE__ */ new Set([...Ht.flatMap((e) => e.keys), ...Wr]), Or = new Set(Ht.flatMap((e) => e.keys).filter((e) => Mt(e) === "number")), Fr = new Set(Ht.flatMap((e) => e.keys).filter((e) => Mt(e) === "checkbox")), Ur = /* @__PURE__ */ new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]), Mr = [
  { key: "suggestions", label: "Suggestions" },
  { key: "changes", label: "Change log" },
  { key: "reflections", label: "Reflection history" }
], Vr = [
  { key: "all", label: "All" },
  { key: "needs-me", label: "Needs me" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "watching-pr", label: "Watching PR" },
  { key: "paused", label: "Paused" }
], Hr = [
  { key: "priority", label: "Priority" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "recently-updated", label: "Recently updated" }
], qr = {
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
  FIXING: "PUSHING",
  PUSHING: "WATCHING_PR",
  REBASING: "WATCHING_PR",
  FAILED: "WORKING",
  PAUSED: "WORKING",
  IGNORED: "WORKING"
};
function Br(e) {
  return qr[e ?? ""] ?? "WORKING";
}
const jr = [
  { state: "PLANNING", label: "↩ Re-plan", hint: "Run the planner agent again" },
  { state: "WORKING", label: "⚡ Code", hint: "Jump straight to the coder agent" },
  { state: "AI_REVIEWING", label: "🤖 AI Review", hint: "Run the AI reviewer on current code" },
  { state: "CREATING_PR", label: "📤 Create PR", hint: "Skip to PR creation" },
  { state: "FIXING", label: "🔧 Fix", hint: "Jump to the fixer agent" },
  { state: "WATCHING_PR", label: "👁 Watch PR", hint: "Monitor open PRs for CI / reviews" },
  { state: "REBASING", label: "↥ Rebase", hint: "Resolve rebase conflicts and push carefully" },
  { state: "SPLIT_PLANNING", label: "✂️ Plan Split", hint: "Ask an agent to propose a stacked PR split" },
  { state: "SPLITTING", label: "✂️ Split Stack", hint: "Execute the approved stacked PR split", risky: !0 },
  { state: "IN_MERGE_QUEUE", label: "🔀 Merge Queue", hint: "Mark PRs as entered into merge queue", risky: !0 },
  { state: "DONE", label: "✅ Mark Done", hint: "Archive this issue as complete", risky: !0 }
], ze = {
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
  PUSHING: 170,
  REBASING: 175,
  DONE: 180,
  STEERING: 190,
  FAILED: 200,
  PAUSED: 210,
  IGNORED: 220
}, Qr = {
  PENDING: "available",
  SETTING_UP: "active",
  PLANNING: "active",
  AI_PLAN_REVIEWING: "active",
  SPLIT_PLANNING: "active",
  SPLITTING: "active",
  WORKING: "active",
  AI_REVIEWING: "active",
  FIXING: "active",
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
}, ca = {
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
function Kr(e) {
  return e.state !== "DONE";
}
const Xr = [
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
  "PUSHING",
  "REBASING",
  "STEERING",
  "DONE",
  "FAILED",
  "PAUSED",
  "IGNORED"
];
function Me() {
  const e = window.location.search.toLowerCase(), n = window.location.hash.toLowerCase(), a = e.includes("mockstates=1") || e.includes("mock=states") || n.includes("mockstates=1") || n.includes("mock=states") || n.includes("mock-states");
  return a && window.localStorage.setItem("forge-v3-mock-states", "1"), a || window.localStorage.getItem("forge-v3-mock-states") === "1";
}
function zr() {
  window.localStorage.setItem("forge-v3-mock-states", "1"), window.location.reload();
}
function Jr() {
  window.localStorage.removeItem("forge-v3-mock-states");
  const e = new URL(window.location.href);
  e.searchParams.delete("mockStates"), e.searchParams.get("mock") === "states" && e.searchParams.delete("mock"), window.location.href = e.toString();
}
function We(e) {
  return new Date(Date.now() - e * 6e4).toISOString();
}
function Fa(e) {
  return e.state === "AWAITING_PLAN_APPROVAL" ? { id: 9101, issue_id: e.id, type: "PLAN_REVIEW", issueTitle: e.title } : e.state === "AWAITING_CODE_REVIEW" ? { id: 9102, issue_id: e.id, type: "CODE_REVIEW", issueTitle: e.title } : e.state === "AWAITING_FIX_APPROVAL" ? { id: 9103, issue_id: e.id, type: "FIX_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) } : e.state === "AWAITING_SPLIT_APPROVAL" ? { id: 9104, issue_id: e.id, type: "SPLIT_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) } : null;
}
function dn() {
  return Xr.map((e, n) => ({
    id: 9e3 + n,
    linear_id: `MOCK-${n + 1}`,
    title: `${_t({ state: e })} dashboard fixture`,
    state: e,
    priority: n % 4 + 1,
    created_at: We(240 + n * 11),
    updated_at: We(3 + n * 7),
    branch: `user/mock-${e.toLowerCase().replaceAll("_", "-")}`,
    wt_path: `/tmp/forge/mock/${e.toLowerCase()}`,
    project_file_path: `/tmp/forge/mock/${e.toLowerCase()}/plan.md`,
    prStack: ["CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"].includes(e) ? [{ pr_number: e === "CREATING_PR" ? null : 4521 + n, branch: `user/mock-${n + 1}`, status: e === "IN_MERGE_QUEUE" ? "merged" : "open" }] : []
  }));
}
function da(e) {
  return `# ${e.linear_id} ${e.title}

## Goal
Exercise the v3 detail panel while this issue is in **${_t(e)}**.

## Tasks
- [x] Gather context
- [x] Draft plan
- [ ] Implement state-specific UI polish
- [ ] Validate actions and banners

## Review notes
Use this mock fixture to tidy copy, action availability, colors, and spacing before testing real Forge issues.`;
}
function Yr(e) {
  var r, s;
  const n = dn().find((l) => l.id === e) ?? dn()[0], a = Fa(n);
  return {
    issue: n,
    plan: da(n),
    planContent: da(n),
    decisions: a ? [a] : [],
    agentRuns: [
      { id: n.id * 10 + 1, agent_type: "planner", started_at: We(38), exit_code: 0 },
      { id: n.id * 10 + 2, agent_type: (r = n.state) != null && r.toLowerCase().includes("review") ? "reviewer" : "coder", started_at: We(9), exit_code: ue(n) ? null : 0 }
    ],
    activityLog: [
      { id: n.id * 100 + 1, type: "agent_completed", actor: "planner", message: "Planner wrote the implementation plan", created_at: We(38) },
      { id: n.id * 100 + 2, type: n.state === "FAILED" ? "agent_failed" : "steered", actor: n.state === "FAILED" ? "coder" : "user", message: n.state === "FAILED" ? "Coder failed while applying changes" : "Steering instructions added from dashboard", created_at: We(8) }
    ],
    failureContext: n.state === "FAILED" ? { run: { id: n.id * 10 + 2, agent_type: "coder", started_at: We(9), exit_code: 1 }, logTail: `[FATAL] Mock failure context
TypeError: Cannot read properties of undefined` } : null,
    prStack: (s = n.prStack) == null ? void 0 : s.map((l) => {
      var c;
      return { pr_number: l.pr_number, branch: l.branch ?? void 0, status: l.status ?? void 0, reviewDecision: l.pr_number ? "APPROVED" : null, mergeable: "MERGEABLE", checksTotal: l.pr_number ? 8 : 0, checksFailed: 0, checksPending: n.state === "WATCHING_PR" ? 1 : 0, liveState: ((c = l.status) == null ? void 0 : c.toUpperCase()) ?? "OPEN", url: l.pr_number ? `https://github.com/example/repo/pull/${l.pr_number}` : null };
    }),
    vmConnectCommand: `ssh my-vm # ${n.linear_id}`
  };
}
function Zr() {
  const e = dn(), n = e.flatMap((a) => {
    const r = Fa(a);
    return r ? [r] : [];
  });
  return {
    issues: e,
    decisions: n,
    runningAgents: e.filter(ue).map((a) => ({ issueId: a.id, state: a.state })),
    scheduler: { running: !0 },
    doneThisWeek: [{ id: 9999 }],
    learningSuggestionsCount: 0
  };
}
function Ve(e) {
  return Qr[e.state ?? ""] ?? "building";
}
function eo(e) {
  const n = e.state ?? "";
  if (n === "PENDING") return 2;
  if (["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING"].includes(n)) return 10;
  if (["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(n)) return 20;
  if (["WORKING", "SPLITTING"].includes(n)) return 42;
  if (n === "AI_REVIEWING") return 55;
  if (n === "AWAITING_CODE_REVIEW") return 62;
  if (n === "AWAITING_FIX_APPROVAL") return 73;
  if (["WATCHING_PR", "FIXING", "PUSHING", "REBASING"].includes(n)) return 84;
  if (n === "IN_MERGE_QUEUE") return 95;
  if (n === "DONE") return 100;
  if (n === "FAILED") return 38;
  if (n === "PAUSED") return 30;
  const a = Ve(e);
  return { available: 2, active: 55, awaiting: 70 }[a];
}
function Ct(e) {
  if (!e.updated_at) return !1;
  const n = ht(e.updated_at);
  return Number.isFinite(n) && Date.now() - n > 1440 * 60 * 1e3;
}
function ht(e) {
  return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(e) && !e.endsWith("Z") && !e.includes("+") ? (/* @__PURE__ */ new Date(e.replace(" ", "T") + "Z")).getTime() : new Date(e).getTime();
}
function pe(e) {
  if (!e) return "recent";
  const n = ht(e);
  if (!Number.isFinite(n)) return "recent";
  const a = Math.max(0, Math.floor((Date.now() - n) / 1e3));
  if (a < 60) return `${Math.max(1, a)}s`;
  const r = Math.floor(a / 60);
  if (r < 60) return `${r}m`;
  const s = Math.floor(r / 60);
  return s < 24 ? `${s}h` : `${Math.floor(s / 24)}d`;
}
function tn(e) {
  if (!e) return "date unknown";
  const n = ht(e);
  return Number.isFinite(n) ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(n)) : e;
}
function bn(e) {
  return e === 1 ? "▰▰▰" : e === 2 ? "▰▰░" : e === 3 ? "▰░░" : e === 4 ? "░░░" : "□□□";
}
function yn(e) {
  return e === 1 ? "urgent" : e === 2 ? "high" : e === 3 ? "medium" : e === 4 ? "low" : "none";
}
function kn(e) {
  return e === 1 ? "priority-urgent" : e === 2 ? "priority-high" : "priority-normal";
}
function _t(e) {
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
    PUSHING: "pushing",
    REBASING: "rebasing",
    FAILED: "failed",
    PAUSED: "paused",
    IGNORED: "ignored",
    DONE: "done"
  }[n] ?? n.toLowerCase().replaceAll("_", " ");
}
function to(e) {
  const n = e.state ?? "";
  return n === "AWAITING_CODE_REVIEW" ? "forge-v3-state-pill pill-code" : n === "WATCHING_PR" ? "forge-v3-state-pill pill-watching" : n === "IN_MERGE_QUEUE" ? "forge-v3-state-pill pill-merge" : n === "FAILED" ? "forge-v3-state-pill pill-failed" : `forge-v3-state-pill pill-${Ve(e)}`;
}
function no(e) {
  return (e.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}
function ue(e) {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(e.state ?? "");
}
function Ot(e) {
  return !!(e.pr_approved_at || (e.prStack ?? []).some((n) => String(n.reviewDecision ?? "").toUpperCase() === "APPROVED"));
}
function ao(e) {
  return String(e.status ?? "").toLowerCase() === "merged" || String(e.liveState ?? "").toUpperCase() === "MERGED";
}
function ro(e) {
  const n = (e.prStack ?? []).filter((a) => a.pr_number);
  return e.state !== "DONE" && n.length > 0 && n.every(ao);
}
function oo(e) {
  const n = [];
  return ue(e) && n.push({ className: "forge-v3-live-badge", label: "Live" }), e.updated_at && n.push({ className: `forge-v3-elapsed-badge${Ct(e) ? " long" : ""}`, label: Ct(e) ? "24h+" : pe(e.updated_at) }), Ct(e) && n.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" }), n;
}
function Ua(e) {
  const n = e.state ?? "";
  return ["PLANNING", "SETTING_UP"].includes(n) ? [t("strong", null, "Planner"), " reading ", t("code", null, "project context"), " — exploring component structure and requirements…"] : n === "AI_PLAN_REVIEWING" ? [t("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"] : n === "AWAITING_PLAN_APPROVAL" ? ["Plan ready for you — ", t("strong", null, "review tasks"), " and AI reviewer notes before approving."] : n === "WORKING" ? [t("strong", null, "Coder"), " writing changes — implementing planned code updates…"] : n === "AI_REVIEWING" ? [t("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"] : n === "AWAITING_CODE_REVIEW" ? ["AI review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."] : n === "REBASING" ? [t("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"] : Ot(e) ? ["GitHub review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."] : n === "FAILED" ? [t("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."] : n === "PAUSED" ? ["Paused by user. Was in ", t("strong", null, "active"), " state."] : e.updated_at ? "Updated recently" : "Queued in Forge";
}
function ua(e) {
  var a;
  const n = pe(e.updated_at ?? e.created_at);
  return ue(e) ? e.state === "AI_REVIEWING" ? `In review ${n}` : `Started ${n} ago` : (a = e.state) != null && a.startsWith("AWAITING") ? `Waiting ${n}` : e.state === "FAILED" ? `Failed ${n} ago` : e.state === "PAUSED" ? `Paused ${n} ago` : Ve(e) === "available" ? `Added ${n} ago` : `Updated ${n} ago`;
}
function Ma(e) {
  var a;
  const n = ((a = e[0]) == null ? void 0 : a.type) ?? "";
  return n ? n.includes("PLAN") ? "plan" : n.includes("CODE") ? "code" : n.includes("FIX") ? "fix" : n.includes("SPLIT") ? "split" : "generic" : null;
}
function Lt(e) {
  if (!(e != null && e.artifact_ref)) return {};
  try {
    const n = JSON.parse(e.artifact_ref);
    return n && typeof n == "object" ? n : {};
  } catch {
    return { summary: e.artifact_ref };
  }
}
function lt(e, n) {
  return String(e.id ?? `${e.path ?? "comment"}-${e.line ?? n}-${n}`);
}
function io(e) {
  return e.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
}
function so(e) {
  return (e ?? "No comment body").replace(/<!--\s*BUGBOT_BUG_ID:\s*[^>]*?-->/gi, "").replace(/<!--\s*([A-Z0-9_ -]+?)\s+START\s*([\s\S]*?)\s+\1\s+END\s*-->/gi, (n, a, r) => `<!-- ${a} START -->
${r.trim()}
<!-- ${a} END -->`).replace(/<details\b[\s\S]*?<\/details>/gi, "").replace(/<sup\b[\s\S]*?<\/sup>/gi, "").replace(/<div\b[\s\S]*?<\/div>/gi, "").trim() || "No comment body";
}
function lo(e) {
  const n = so(e), a = /<!--\s*([A-Z0-9_ -]+?)\s+(START|END)\s*-->/gi, r = [...n.matchAll(a)];
  if (!r.length) return t("div", { class: "forge-v3-fix-comment-body forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ye(n) } });
  const s = [];
  let l = null, c = 0;
  const g = (f) => {
    const d = n.slice(c, f).trim();
    d && s.push({ label: l, text: d });
  };
  for (const f of r)
    g(f.index ?? c), c = (f.index ?? c) + f[0].length, l = f[2].toUpperCase() === "START" ? io(f[1]) : null;
  return g(n.length), t(
    "div",
    { class: "forge-v3-fix-comment-body" },
    s.length ? s.map((f, d) => t(
      "section",
      { class: "forge-v3-fix-comment-section", key: `${f.label ?? "intro"}-${d}` },
      f.label ? t("div", { class: "forge-v3-fix-comment-section-label" }, f.label) : null,
      t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ye(f.text) } })
    )) : t("div", { class: "forge-v3-fix-comment-md", dangerouslySetInnerHTML: { __html: Ye(n.replace(a, "").trim() || "No comment body") } })
  );
}
function co(e) {
  return e === "AWAITING_PLAN_APPROVAL" ? "PLAN_REVIEW" : e === "AWAITING_CODE_REVIEW" ? "CODE_REVIEW" : e === "AWAITING_FIX_APPROVAL" ? "FIX_APPROVAL" : e === "AWAITING_SPLIT_APPROVAL" ? "SPLIT_APPROVAL" : null;
}
function uo(e, n) {
  const a = e.state ?? "", r = Ma(n);
  return r === "plan" || a === "AWAITING_PLAN_APPROVAL" ? { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: !1 } : r === "code" || a === "AWAITING_CODE_REVIEW" ? { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: !1 } : r === "fix" || a === "AWAITING_FIX_APPROVAL" ? { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: !1 } : a === "AWAITING_SPLIT_APPROVAL" ? { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: !1 } : a === "REBASING" ? { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: !0 } : Ot(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(a) ? { icon: "✓", tone: "running", title: "PR approved", text: e.pr_approved_at ? `GitHub review approved ${pe(e.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: !1 } : ue(e) ? { icon: "spinner", tone: "running", title: `${_t(e)} agent running`, text: `Active for ${pe(e.updated_at)} — Forge is working on this issue.`, live: !0 } : a === "FAILED" ? { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: !1 } : { icon: Ba(Ve(e)), tone: Ve(e), title: _t(e), text: e.updated_at ? `Updated ${pe(e.updated_at)} ago` : "Waiting for activity", live: !1 };
}
const fa = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];
function re(e, n, a = `${n}s`) {
  return `${e} ${e === 1 ? n : a}`;
}
function xe(e, n) {
  return (e ?? []).filter((a) => a.agent_type === n).length;
}
function fo(e) {
  return (e ?? []).filter((n) => n.type === "FIX_APPROVAL").reduce((n, a) => {
    var r;
    return n + (((r = Lt(a).comments) == null ? void 0 : r.length) ?? 0);
  }, 0);
}
function po(e, n) {
  return (e ?? []).filter((a) => a.type === n).length;
}
function go(e, n) {
  var u, v, b;
  const a = (n == null ? void 0 : n.agentRuns) ?? [], r = (n == null ? void 0 : n.decisions) ?? [], s = (n == null ? void 0 : n.prStack) ?? ((u = n == null ? void 0 : n.issue) == null ? void 0 : u.prStack) ?? [], l = xe(a, "planner"), c = xe(a, "plan-reviewer"), g = xe(a, "coder"), f = xe(a, "reviewer"), d = xe(a, "fixer"), h = xe(a, "watcher"), y = fo(r);
  return e === "Setup" ? { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [re(xe(a, "setup"), "setup run"), (v = n == null ? void 0 : n.issue) != null && v.wt_path ? "Worktree ready" : "Worktree not recorded yet"] } : e === "Plan" ? { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [re(l, "planner pass", "planner passes"), re(c, "AI plan review"), re(Math.max(0, Math.min(l, c) - 1), "planner/reviewer loop")] } : e === "Code" ? { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [re(g, "coder pass", "coder passes"), re(Math.max(0, g - 1), "rework loop")] } : e === "Review" ? { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [re(f, "AI code review"), re(po(r, "CODE_REVIEW"), "human review gate"), re(Math.max(0, Math.min(g, f) - 1), "code/review loop")] } : e === "PR" ? { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [re(xe(a, "git-agent"), "git-agent run"), re(s.length, "PR"), re(y, "PR comment/issue")] } : e === "Watch" ? { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [re(h, "watch poll"), re(d, "fix loop"), re(y, "comment/issue routed to fixer")] } : { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [((b = n == null ? void 0 : n.issue) == null ? void 0 : b.state) === "DONE" ? "Completed" : "Not completed yet"] };
}
function vo(e) {
  return ["PENDING", "SETTING_UP"].includes(e ?? "") ? 0 : ["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "") ? 1 : ["WORKING", "SPLITTING"].includes(e ?? "") ? 2 : ["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(e ?? "") ? 3 : ["CREATING_PR"].includes(e ?? "") ? 4 : ["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(e ?? "") ? 5 : e === "DONE" ? 6 : 0;
}
function _o(e) {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "");
}
function mo(e) {
  return (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan) ?? "No plan available.";
}
function ho(e) {
  const n = (e == null ? void 0 : e.planContent) ?? (e == null ? void 0 : e.plan);
  return !!(n != null && n.trim());
}
function Va(e) {
  return (e == null ? void 0 : e.handoffContent) ?? "";
}
function bo(e) {
  return !!Va(e).trim();
}
function yo(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING", "FAILED", "PAUSED"].includes(e ?? "");
}
function ko(e) {
  return ["AI_REVIEWING", "AWAITING_CODE_REVIEW", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "FIXING", "PUSHING", "REBASING"].includes(e ?? "");
}
function Io(e) {
  return e ? ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes(e.state ?? "") && !ue(e) && !e.locked_at && !e.agent_pid : !1;
}
function Ao(e) {
  return e.startsWith("+") ? "add" : e.startsWith("-") ? "del" : e.startsWith("@@") ? "hunk" : e.startsWith("diff --git") || e.startsWith("index ") || e.startsWith("---") || e.startsWith("+++") ? "meta" : "ctx";
}
function wo(e) {
  return e.startsWith("+") ? "+" : e.startsWith("-") ? "−" : "";
}
function pa(e) {
  return e.split(/[\\/]/).filter(Boolean).pop() || e;
}
function gt(e) {
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
function Po(e, n) {
  return e.exit_code === null ? `${gt(e.agent_type)} is active — streaming progress.` : e.exit_code && e.exit_code !== 0 ? `${gt(e.agent_type)} failed — inspect logs before retrying.` : e.agent_type === "planner" ? "Plan created — tasks, risks, and PR stack estimated." : e.agent_type === "plan-reviewer" ? "Plan approved — scope and sequencing look ready." : e.agent_type === "coder" ? "Completed implementation pass and updated project notes." : e.agent_type === "reviewer" ? "Review completed — security, tests, and conventions checked." : e.agent_type === "git-agent" ? "Prepared branch stack and synchronized git state." : e.agent_type === "fixer" ? "Applied requested PR comment fixes." : e.agent_type === "watcher" ? "Checked PR status, reviews, and merge readiness." : `${gt(e.agent_type)} completed.`;
}
function Eo(e, n) {
  const a = `${e ?? ""} ${n ?? ""}`.toLowerCase();
  return a.includes("fail") || a.includes("error") ? "err" : a.includes("approved") || a.includes("completed") || a.includes("done") ? "ok" : a.includes("user") || a.includes("steer") || a.includes("paused") || a.includes("ignored") ? "me" : a.includes("started") || a.includes("live") ? "live" : "ag";
}
function No(e) {
  var n;
  return e.message ?? ((n = e.type) == null ? void 0 : n.replaceAll("_", " ")) ?? "Activity recorded";
}
function dt(e) {
  return e ? `/api/runs/${e}/log` : null;
}
function So(e, n) {
  var g, f;
  const a = [...(e == null ? void 0 : e.agentRuns) ?? []].sort((d, h) => te(h.started_at) - te(d.started_at)), r = [...(e == null ? void 0 : e.activityLog) ?? []].sort((d, h) => te(h.created_at) - te(d.created_at)), s = ue(n), l = new Map(a.map((d) => [d.agent_type, d])), c = r.length ? r.map((d) => {
    var y;
    const h = l.get(d.actor ?? "") ?? ((y = d.type) != null && y.includes("agent") ? a.find((u) => u.agent_type === d.actor) : void 0);
    return { id: String(d.id ?? `${d.type}-${d.created_at}`), actor: d.actor ?? "Forge", time: d.created_at ? `${pe(d.created_at)} ago` : "recent", tone: Eo(d.type, d.actor), text: No(d), snippet: d.metadata ?? null, logUrl: dt(h == null ? void 0 : h.id) };
  }) : [
    ...s ? [{ id: "live", actor: gt(((g = a[0]) == null ? void 0 : g.agent_type) ?? "agent"), time: "now", tone: "live", text: Ua(n), snippet: `// live agent output
Reading files, updating the project plan, and streaming progress…`, logUrl: dt((f = a[0]) == null ? void 0 : f.id) }] : [],
    ...a.map((d) => {
      var h;
      return { id: String(d.id ?? `${d.agent_type}-${d.started_at}`), actor: gt(d.agent_type), time: d.started_at ? `${pe(d.started_at)} ago` : "recent", tone: d.exit_code === null ? "live" : d.exit_code && d.exit_code !== 0 ? "err" : (h = d.agent_type) != null && h.includes("review") ? "ok" : "ag", text: Po(d), snippet: null, logUrl: dt(d.id) };
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
      t("div", null, t("strong", null, "Failure context"), e.failureContext.run ? t("a", { href: dt(e.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Open run log ↗") : null),
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
function Ha(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function nn(e) {
  return Ha(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function Ye(e) {
  const n = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), a = [];
  let r = !1, s = !1, l = [];
  const c = () => {
    l.length && (a.push(`<p>${nn(l.join(" "))}</p>`), l = []);
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
      a.push(Ha(f));
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
      a.push(`<h${u}>${nn(h[2])}</h${u}>`);
      continue;
    }
    const y = d.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (y) {
      c(), r || (a.push("<ul>"), r = !0);
      const u = y[1] ? `<input type="checkbox" disabled ${y[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      a.push(`<li>${u}${nn(y[2])}</li>`);
      continue;
    }
    l.push(d.trim());
  }
  return c(), g(), s && a.push("</code></pre>"), a.join(`
`);
}
function Ro(e) {
  return [e.title, e.identifier, e.state].filter(Boolean).join(" ").toLowerCase();
}
function To(e, n) {
  const a = n.trim().toLowerCase();
  return !a || Ro(e).includes(a);
}
function Co(e) {
  const n = e.prStack ?? [];
  return (e.state ?? "") === "AWAITING_PLAN_APPROVAL" ? [{ className: "forge-v3-plan-badge", label: "plan ready" }] : n.length ? n.slice(0, 2).flatMap((r) => [
    { className: "forge-v3-pr-badge", label: r.pr_number ? `#${r.pr_number}` : r.branch ?? "PR" },
    { className: r.isInMergeQueue ? "forge-v3-ci-badge merge-queue" : r.status === "merged" ? "forge-v3-ci-badge" : r.status === "closed" ? "forge-v3-ci-badge fail" : "forge-v3-ci-badge", label: r.isInMergeQueue ? "merge queue" : r.liveState ?? r.status ?? "✓ CI" }
  ]) : [];
}
function Lo(e) {
  const n = (e.prStack ?? []).map((a) => [a.branch, a.pr_number ? `#${a.pr_number}` : "", a.status].filter(Boolean).join(" ")).join(" ");
  return [e.title, e.linear_id, e.branch, n, e.state].filter(Boolean).join(" ").toLowerCase();
}
function Go(e, n) {
  const a = n.trim().toLowerCase();
  return !a || Lo(e).includes(a);
}
function $o(e, n) {
  const a = e.state ?? "";
  return n === "needs-me" ? ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(a) : n === "running" ? ue(e) : n === "failed" ? a === "FAILED" : n === "watching-pr" ? ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(a) : n === "paused" ? ["PAUSED", "IGNORED"].includes(a) : !0;
}
function te(e) {
  const n = e ? ht(e) : 0;
  return Number.isFinite(n) ? n : 0;
}
function xo(e, n) {
  const a = [...e];
  return n === "newest" ? a.sort((r, s) => te(s.created_at ?? s.updated_at) - te(r.created_at ?? r.updated_at)) : n === "oldest" ? a.sort((r, s) => te(r.created_at ?? r.updated_at) - te(s.created_at ?? s.updated_at)) : n === "recently-updated" ? a.sort((r, s) => te(s.updated_at) - te(r.updated_at)) : a.sort((r, s) => (r.priority ?? 99) - (s.priority ?? 99) || te(s.updated_at) - te(r.updated_at));
}
function Do(e, n) {
  var s;
  if (n === "awaiting")
    return [...e].sort((l, c) => te(c.updated_at ?? c.created_at) - te(l.updated_at ?? l.created_at));
  const a = ((s = cn.find((l) => l.key === n)) == null ? void 0 : s.states) ?? [], r = (l) => {
    const c = l.state ?? "";
    if (c === "FAILED") return -1;
    const g = a.indexOf(c);
    return g >= 0 ? g : ze[c] ?? 999;
  };
  return [...e].sort(
    (l, c) => r(l) - r(c) || (l.priority ?? 99) - (c.priority ?? 99) || te(c.updated_at) - te(l.updated_at)
  );
}
function ga(e, n) {
  const a = n.find((r) => r.id === e.issue_id);
  return a != null && a.state ? ze[a.state] ?? 999 : e.type === "PLAN_REVIEW" ? ze.AWAITING_PLAN_APPROVAL : e.type === "SPLIT_APPROVAL" ? ze.AWAITING_SPLIT_APPROVAL : e.type === "CODE_REVIEW" ? ze.AWAITING_CODE_REVIEW : e.type === "FIX_APPROVAL" ? ze.AWAITING_FIX_APPROVAL : 999;
}
function Wo(e, n) {
  return [...e].sort((a, r) => {
    const s = n.find((c) => c.id === a.issue_id), l = n.find((c) => c.id === r.issue_id);
    return ga(a, n) - ga(r, n) || ((s == null ? void 0 : s.priority) ?? 99) - ((l == null ? void 0 : l.priority) ?? 99) || a.id - r.id;
  });
}
function Oo(e, n) {
  return Wo(e, n)[0] ?? null;
}
function Fo(e) {
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
async function oe(e) {
  if (Me()) {
    if (e === "/api/overview") return Zr();
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
    if (r != null && r[1]) return { generating: !1, created_at: We(1), tour: { summary: "AI tour: review behavior, error states, and API payload shape.", highlights: ["Diff sidecar stays issue-scoped", { title: "Decision payload", text: "Structured review feedback is sent to the agent", file: "src/mock.ts", line: 3 }], files: [{ path: "src/mock.ts", summary: "Mock review fixture", risk: "low" }] } };
    const s = e.match(/^\/api\/issues\/(\d+)$/);
    if (s != null && s[1]) return Yr(Number(s[1]));
  }
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Failed to fetch ${e}: ${n.status}`);
  return await n.json();
}
async function ge(e, n, a = "POST") {
  if (Me()) return { ok: !0, mock: !0, url: e, body: n, method: a };
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
async function Uo(e) {
  if (Me()) return { ok: !0, mock: !0, url: e, method: "DELETE" };
  const n = await fetch(e, { method: "DELETE" });
  if (!n.ok) throw new Error(`Failed to delete ${e}: ${n.status}`);
  return await n.json();
}
function va(e) {
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
function Mo(e, n, a) {
  return ge(`/api/decisions/${e}/resolve`, { verdict: n, feedback: a });
}
function Vo(e, n, a = {}) {
  return ge(`/api/issues/${e}`, { action: n, ...a }, "PATCH");
}
function Ho(e) {
  return Uo(`/api/issues/${e}`);
}
function qo(e) {
  return ge(`/api/issues/${e}/vm-launch`, {});
}
function Bo() {
  return ge("/api/vm/stop", {});
}
function jo(e) {
  return ge(`/api/issues/${e}/sync-prs`, {});
}
function Qo(e, n, a) {
  return ge(`/api/issues/${e}/feedback`, { body: n, prNumber: a ?? null });
}
function Ko(e, n = "") {
  return ge("/api/issues", { title: e, description: n });
}
function Xo(e, n = "") {
  return ge("/api/linear/enqueue", { linearId: e, planningGuidance: n });
}
function zo() {
  return oe("/api/desktop-capabilities");
}
function qa(e, n, a) {
  return ge("/api/desktop-notify", { title: e, body: n, tag: a });
}
function In() {
  return typeof window < "u" && "Notification" in window;
}
function Jo() {
  return In() ? window.Notification.permission : "unsupported";
}
async function Yo(e, n, a = !1) {
  const r = no(e) || "Forge decision needed", s = n != null && n.title ? `${n.title} needs your review` : "A Forge issue needs your review", l = `forge-decision-${e.id}`;
  if (a)
    try {
      await qa(r, s, l);
      return;
    } catch {
    }
  !In() || window.Notification.permission !== "granted" || new window.Notification(r, { body: s, tag: l });
}
function Zo(e, n) {
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
function ct(e) {
  if (!e) return null;
  const n = Number(e);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function Ft(e = window.location.hash) {
  const n = new URLSearchParams(window.location.search), a = n.get("view") || void 0, r = ct(n.get("issue") || void 0), s = ct(n.get("decision") || void 0), l = n.get("tab"), c = l === "activity" || l === "ask" ? l : "overview", g = n.get("panel"), f = g === "plan" || g === "diff" || g === "review" || g === "listen" || g === "jump" ? g : null, d = pt.some((P) => P.key === a) ? a : null;
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
  const h = e.replace(/^#/, "").split("/").filter(Boolean), [y, u, v, b] = h;
  return y === "issue" ? { view: "queue", issueId: ct(u), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 } : y === "review" ? {
    view: "queue",
    issueId: ct(u),
    decisionId: v === "decision" ? ct(b) : null,
    detailTab: "overview",
    panel: "review",
    diffPath: "",
    addIssue: !1
  } : { view: pt.some((P) => P.key === y) ? y : "queue", issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 };
}
function Ut(e, n = !0) {
  const a = new URL(window.location.href);
  a.hash = "";
  for (const [l, c] of Object.entries(e))
    c == null || c === !1 || c === "" ? a.searchParams.delete(l) : a.searchParams.set(l, String(c));
  const r = `${a.pathname}${a.search}${a.hash}`, s = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  r !== s && window.history[n ? "replaceState" : "pushState"]({}, "", r);
}
function Xe(e, n = {}) {
  Ut({ view: e, issue: e === "queue" ? n.issueId : null, decision: n.decisionId, panel: n.decisionId ? "review" : null }, !1);
}
function qt({ icon: e, title: n, subtitle: a, actions: r }) {
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
function bt({ view: e, className: n = "", children: a }) {
  return t(
    "main",
    { class: `forge-v3-main forge-v3-view-scroll ${n}`, "data-active-view": e },
    t("div", { class: "forge-v3-page-wrap" }, a)
  );
}
function me(e) {
  return typeof document > "u" ? Promise.resolve(null) : new Promise((n) => {
    const a = document.createElement("div");
    document.body.appendChild(a);
    let r = e.initialValue ?? "";
    const s = (c) => {
      Ue(null, a), a.remove(), n(c);
    }, l = () => {
      if (e.requiredText && r !== e.requiredText) return s(null);
      s(r);
    };
    Ue(t(
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
function ut({ title: e, message: n, confirmText: a = "Confirm", danger: r = !1 }) {
  return typeof document > "u" ? Promise.resolve(!1) : new Promise((s) => {
    const l = document.createElement("div");
    document.body.appendChild(l);
    const c = (g) => {
      Ue(null, l), l.remove(), s(g);
    };
    Ue(t(
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
function ei({ title: e, message: n }) {
  if (typeof document > "u") return;
  const a = document.createElement("div");
  document.body.appendChild(a);
  const r = () => {
    Ue(null, a), a.remove();
  };
  Ue(t(
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
function Ba(e) {
  return { available: "○", active: "▣", awaiting: "⚡" }[e];
}
function ti({ issue: e, onEnqueue: n }) {
  const a = async () => {
    var s;
    const r = ((s = await me({ title: `Enqueue ${e.identifier}`, message: "Add optional planning guidance before Forge creates the plan.", label: "Planning guidance", confirmText: "Enqueue" })) == null ? void 0 : s.trim()) ?? "";
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
        t("span", { class: `forge-v3-priority-meta ${kn(e.priority)}` }, bn(e.priority), " ", yn(e.priority))
      )
    ),
    t("button", { type: "button", onClick: a }, "Enqueue →")
  );
}
function ni({ issue: e, selected: n, onOpenIssue: a, onIssueAction: r, onReviewIssue: s }) {
  const l = eo(e), c = Ve(e), g = c === "available", f = ue(e), d = e.state === "PAUSED" ? "unpause" : e.state === "FAILED" ? "retry" : "pause", h = d === "unpause" ? "Resume" : d === "retry" ? "Retry" : "Pause", y = oo(e), u = Co(e);
  return t(
    "article",
    { class: `forge-v3-issue-card ${n ? "selected" : ""} ${Ot(e) ? "pr-approved" : ""} ${(e.prStack ?? []).some((v) => v.isInMergeQueue) ? "in-merge-queue" : ""} state-${e.state ?? "unknown"} stage-${c}`, "data-issue-id": String(e.id), tabIndex: 0, "aria-label": `Open issue ${e.linear_id ?? e.id}`, onPointerDown: (v) => {
      v.target.closest("button,a,input,select,textarea") || a(e.id);
    }, onKeyDown: (v) => {
      (v.key === "Enter" || v.key === " ") && a(e.id);
    } },
    t(
      "div",
      { class: "forge-v3-ic-hover", "aria-hidden": "true" },
      g ? t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
        v.stopPropagation(), r(e.id, "ignore");
      } }, "Ignore") : e.state === "AWAITING_PLAN_APPROVAL" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "View plan"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Approve")
      ] : e.state === "AWAITING_CODE_REVIEW" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), s(e.id);
        } }, "View diff"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Approve")
      ] : e.state === "FAILED" ? [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), r(e.id, "retry");
        } }, "↺ Retry"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Log")
      ] : e.state === "PAUSED" ? t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
        v.stopPropagation(), r(e.id, "unpause");
      } }, "▶ Resume") : f ? [
        e.state === "WORKING" ? t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Listen live") : null,
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Steer"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), r(e.id, "pause");
        } }, "Pause")
      ] : [
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, e.state === "WATCHING_PR" ? "View PR" : "Open"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), s(e.id);
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
          t("span", { class: `forge-v3-priority-glyph ${kn(e.priority)}`, "aria-label": `Priority ${yn(e.priority)}` }, bn(e.priority))
        )
      ),
      t("h3", null, e.title ?? "Untitled issue"),
      ro(e) ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Merged"), t("small", null, "finalizing")) : (e.prStack ?? []).some((v) => v.isInMergeQueue) ? t("div", { class: "forge-v3-merge-queue-banner" }, t("span", null, "⇄"), t("strong", null, "Merge queue"), t("small", null, "waiting to merge")) : Ot(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(e.state ?? "") ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Approved"), t("small", null, e.pr_approved_at ? `${pe(e.pr_approved_at)} ago` : "watching merge")) : null,
      t(
        "div",
        { class: "forge-v3-issue-state-row" },
        f ? t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
        t("span", { class: to(e) }, _t(e)),
        y.map((v) => t("span", { class: v.className }, v.label))
      ),
      g ? t("div", { class: "forge-v3-ic-meta" }, ua(e)) : [
        t("p", { class: "forge-v3-activity-snippet" }, Ua(e)),
        t("div", { class: "forge-v3-ic-meta" }, ua(e), Ct(e) ? t("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
      ],
      !g && u.length ? t("div", { class: "forge-v3-pr-metadata" }, u.map((v) => t("span", { class: v.className }, v.label))) : null
    ),
    t("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, t("span", { class: "forge-v3-ic-fill", style: { width: `${l}%` } })),
    t(
      "div",
      { class: "forge-v3-issue-actions" },
      t("button", { type: "button", onClick: (v) => {
        v.stopPropagation(), a(e.id);
      } }, "Open"),
      t("button", { type: "button", onClick: (v) => {
        v.stopPropagation(), a(e.id);
      } }, "Open plan"),
      t("button", { type: "button", onClick: (v) => {
        v.stopPropagation(), s(e.id);
      } }, "Review diff"),
      t("button", { type: "button", onClick: (v) => {
        v.stopPropagation(), r(e.id, d);
      } }, h)
    )
  );
}
const _a = Er(ni, (e, n) => e.issue === n.issue && e.selected === n.selected);
function ai({ status: e, onStopVm: n }) {
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
function ri({ open: e, decisions: n, onClose: a, onNavigate: r, onRefresh: s, onOpenIssue: l, onReviewNext: c, onAddIssue: g, onStopVm: f }) {
  if (!e) return null;
  const h = [
    ...n.map((y) => ({ label: `Decision: ${y.type ?? "Review"} #${y.id}`, action: () => {
      r("queue"), l(y.issue_id);
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
        h.map((y) => t("button", { type: "button", disabled: y.disabled, onClick: () => {
          y.disabled || (y.action(), a());
        } }, y.label))
      )
    )
  );
}
function oi({ issues: e, decisions: n, linearBacklog: a, selectedIssueId: r, addIssueOpen: s, onOpenIssue: l, onIssueAction: c, onResolveDecision: g, onReviewNext: f, onReviewIssue: d, onAddIssue: h, onCloseAddIssue: y, onRefreshLinear: u, onCreateManualIssue: v, onEnqueueLinear: b }) {
  const [p, P] = A(""), [N, R] = A("all"), [$, U] = A("priority"), [B, Y] = A("linear"), [W, X] = A(""), [H, M] = A(""), [k, C] = A(""), [x, T] = A(""), J = Rt(() => xo(
    e.filter((w) => Kr(w) && Go(w, p) && $o(w, N)),
    $
  ), [e, p, N, $]), he = Rt(() => {
    const w = /* @__PURE__ */ new Map();
    return cn.forEach((z) => w.set(z.key, [])), J.forEach((z) => {
      var se;
      return (se = w.get(Ve(z))) == null ? void 0 : se.push(z);
    }), w.forEach((z, se) => w.set(se, Do(z, se))), w;
  }, [J]), ne = Rt(() => a.filter((w) => To(w, p)).slice(0, 12), [a, p]), fe = Me(), ie = () => {
    const w = W.trim();
    w && (v(w, H.trim()), X(""), M(""), y());
  }, be = () => {
    const w = k.trim();
    w && (b(w, x.trim()), C(""), T(""), y());
  };
  return t(bt, { view: "queue", className: `forge-v3-queue-shell ${r ? "forge-v3-has-detail" : ""}` }, [
    fe ? t("div", { class: "forge-v3-mock-state-banner" }, t("strong", null, "Mock state fixtures enabled"), t("span", null, "Review every Forge state without touching real issues."), t("button", { type: "button", onClick: Jr }, "Exit mock data")) : null,
    t(
      "section",
      { id: "queue-toolbar", class: "forge-v3-command-center", "aria-label": "Queue toolbar" },
      t(
        "div",
        { class: "forge-v3-toolbar-actions forge-v3-left-tools" },
        t("input", { type: "search", placeholder: "Search issues, IDs, branch", "aria-label": "Search issues", value: p, onInput: (w) => P(w.target.value) }),
        t(
          "div",
          { class: "forge-v3-filter-chips", "aria-label": "Queue filters" },
          Vr.map((w) => t("button", { key: w.key, type: "button", class: N === w.key ? "active" : "", onClick: () => R(w.key) }, w.label))
        )
      ),
      t(
        "div",
        { class: "forge-v3-toolbar-actions" },
        t("select", { "aria-label": "Sort issues", value: $, onChange: (w) => U(w.target.value) }, Hr.map((w) => t("option", { key: w.key, value: w.key }, w.label))),
        t("button", { type: "button", disabled: n.length === 0, onClick: f }, "⚡ Review next", n.length ? ` (${n.length})` : ""),
        t("button", { type: "button", title: "Refresh Linear", onClick: u }, "↻ Sync"),
        t("button", { type: "button", disabled: !0 }, "⌘ Command"),
        fe ? null : t("button", { type: "button", onClick: zr }, "Mock states"),
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
          t("button", { type: "button", onClick: y, "aria-label": "Close add issue" }, "×")
        ),
        t(
          "nav",
          { class: "forge-v3-detail-tabs" },
          t("button", { type: "button", class: B === "linear" ? "active" : "", onClick: () => Y("linear") }, "Linear issue"),
          t("button", { type: "button", class: B === "manual" ? "active" : "", onClick: () => Y("manual") }, "Manual issue")
        ),
        t(
          "div",
          { class: "forge-v3-add-issue-body" },
          B === "linear" ? [
            t("label", null, "Linear ID", t("input", { type: "text", placeholder: "TEAM-1234", value: k, onInput: (w) => C(w.target.value) })),
            t("label", null, "Planning guidance", t("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: x, onInput: (w) => T(w.target.value) }))
          ] : [
            t("label", null, "Title", t("input", { type: "text", placeholder: "Manual issue title", value: W, onInput: (w) => X(w.target.value) })),
            t("label", null, "Description", t("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: H, onInput: (w) => M(w.target.value) }))
          ]
        ),
        t(
          "footer",
          null,
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: y }, "Cancel"),
          B === "linear" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !k.trim(), onClick: be }, "Enqueue Linear issue") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !W.trim(), onClick: ie }, "Create manual issue")
        )
      )
    ) : null,
    t(
      "div",
      { class: "forge-v3-pipeline-wrap" },
      t(
        "section",
        { id: "pipeline-wrapper", class: "forge-v3-pipeline", "aria-label": "Issue pipeline" },
        cn.map((w) => {
          const z = he.get(w.key) ?? [], se = w.key === "available" ? z.length + ne.length : z.length;
          return t(
            "section",
            { key: w.key, class: "forge-v3-pipeline-column", "data-stage": w.key },
            t(
              "header",
              { class: `forge-v3-col-head ${w.key === "awaiting" ? "needs-head" : ""}` },
              t("span", { class: `forge-v3-col-label ${w.key === "awaiting" ? "needs" : ""}` }, w.key === "available" ? w.label : `${Ba(w.key)} ${w.label}`),
              w.key === "available" ? t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: u }, "↻ Sync") : null,
              t("span", { class: `forge-v3-col-count ${se && w.key === "awaiting" ? "bad" : ""}` }, String(se))
            ),
            t(
              "div",
              { class: `forge-v3-col-cards forge-v3-pipeline-list ${w.key === "available" ? "forge-v3-available-split" : ""}` },
              w.key === "available" ? [
                t(
                  "div",
                  { class: "forge-v3-available-backlog" },
                  ne.length ? ne.map((V) => t(ti, { key: V.identifier, issue: V, onEnqueue: b })) : t("p", { class: "forge-v3-empty" }, p ? "No Linear issues match" : "No available Linear issues")
                ),
                t("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                t(
                  "div",
                  { class: "forge-v3-available-queued" },
                  z.length ? z.map((V) => t(_a, { key: V.id, issue: V, selected: r === V.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d })) : t("p", { class: "forge-v3-empty" }, p || N !== "all" ? "No queued issues match" : "No queued issues")
                )
              ] : z.length === 0 ? t("p", { class: "forge-v3-empty" }, p || N !== "all" ? "No issues match the active filters" : "No issues") : z.map((V) => t(_a, { key: V.id, issue: V, selected: r === V.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d }))
            )
          );
        })
      )
    )
  ]);
}
function Mt(e) {
  return e.includes("limit") || e.includes("seconds") || e.includes("rounds") || e.endsWith("_max") || e === "dashboard_port" ? "number" : e.startsWith("enable_") || e.startsWith("use_") || e.endsWith("_enabled") || e.includes("reuse") ? "checkbox" : "text";
}
function un(e) {
  var n;
  return ((n = Wa[e]) == null ? void 0 : n.label) ?? e;
}
function ma(e) {
  var a;
  const n = (a = Wa[e]) == null ? void 0 : a.hint;
  return n ? `${n} · DB key: ${e}` : `Unrecognized setting · DB key: ${e}`;
}
function ii(e, n) {
  return n.keys.filter((a) => Object.prototype.hasOwnProperty.call(e, a)).map((a) => ({ key: a, value: e[a] ?? "" }));
}
function fn(e, n) {
  return Fr.has(e) ? n === "true" ? "true" : "false" : n;
}
function ha(e, n, a) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => a || hn.has(r)).map(([r, s]) => [r, fn(r, s ?? "")]).filter(([r, s]) => fn(String(r), e[String(r)] ?? "") !== s));
}
function si(e, n) {
  const a = [];
  return Object.entries(e).forEach(([r, s]) => {
    if (!n && !hn.has(r) || !Or.has(r)) return;
    const l = String(s ?? "").trim();
    (!l || !Number.isFinite(Number(l)) || Number(l) < 0) && a.push(`${un(r)} must be a non-negative number.`);
  }), a;
}
function li() {
  const [e, n] = A({}), [a, r] = A({}), [s, l] = A(null), [c, g] = A(""), [f, d] = A(""), [h, y] = A("Loading settings…"), [u, v] = A([]), [b, p] = A(!1), P = () => {
    oe("/api/desktop-backend").then((k) => {
      l(k), g(k.backendOrigin ?? ""), d("");
    }).catch(() => {
      l(null), d("Desktop backend switching is available in the Forge desktop app.");
    });
  };
  K(() => {
    let k = !1;
    return oe("/api/settings").then((C) => {
      k || (n(C), r(C), v([]), y(""));
    }).catch(() => {
      k || y("Unable to load settings");
    }), P(), () => {
      k = !0;
    };
  }, []);
  const N = (k, C) => {
    r((x) => ({ ...x, [k]: fn(k, C) })), v((x) => x.filter((T) => !T.includes(un(k))));
  }, R = () => {
    d("Saving backend…"), fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: c })
    }).then((k) => k.ok ? k.json() : Promise.reject(new Error("backend failed"))).then((k) => {
      l(k), g(k.backendOrigin ?? c), d("Backend saved. Refresh if the dashboard did not reconnect automatically.");
    }).catch(() => d("Unable to save desktop backend"));
  }, $ = () => {
    const k = si(a, b);
    if (k.length) {
      v(k), y("Fix validation errors before saving");
      return;
    }
    const C = ha(e, a, b);
    if (Object.keys(C).length === 0) {
      y("No settings changed");
      return;
    }
    y(`Saving ${Object.keys(C).length} changed setting${Object.keys(C).length === 1 ? "" : "s"}…`), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(C)
    }).then((x) => x.json().then((T) => x.ok ? T : Promise.reject(new Error((T == null ? void 0 : T.error) ?? "Unable to save settings")))).then((x) => {
      const T = x.settings ?? { ...e, ...C };
      n(T), r(T), v([]), y("Settings saved");
    }).catch((x) => y(x.message || "Unable to save settings"));
  }, U = () => {
    r(e), v([]), y("Reset changes");
  }, B = Object.entries(a).filter(([k]) => !hn.has(k)).map(([k, C]) => ({ key: k, value: C ?? "" })), Y = ha(e, a, b), W = Object.keys(Y).length, X = [...Ht, { label: "Other", keys: [] }], H = (k, C = !1) => {
    if (k.key.includes("context") || k.key.includes("prompt") || k.key.includes("command"))
      return t("textarea", { class: "forge-v3-setting-control", value: k.value, rows: k.key === "project_prompt_overlay" ? 8 : 3, placeholder: la[k.key], disabled: C, readOnly: C, onInput: (T) => N(k.key, T.target.value) });
    const x = Mt(k.key);
    return t("input", { class: "forge-v3-setting-control", type: Mt(k.key), checked: x === "checkbox" ? k.value === "true" : void 0, value: x === "checkbox" ? void 0 : k.value, placeholder: la[k.key], disabled: C, readOnly: C, min: x === "number" ? "0" : void 0, onInput: (T) => {
      const J = T.target;
      N(k.key, x === "checkbox" ? String(J.checked) : J.value);
    } });
  }, M = () => t(
    "div",
    { key: "desktop-backend-origin", class: "forge-v3-setting-row forge-v3-desktop-backend-row" },
    t("span", null, "Desktop backend origin"),
    t("small", null, f || (s != null && s.configFile ? `Stored in ${s.configFile}` : "All v3 dashboard reads and writes go through this backend.")),
    t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("input", { class: "forge-v3-setting-control", type: "url", value: c, placeholder: "http://127.0.0.1:3142", disabled: !s, onInput: (k) => g(k.target.value) }),
      t("button", { type: "button", disabled: !s, onClick: R }, "Use backend"),
      t("a", { class: "forge-v3-btn-primary", href: "/desktop/backend" }, "Switch page")
    )
  );
  return t(bt, { view: "settings", className: "forge-v3-settings-wrap" }, [
    t(qt, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("a", { class: "forge-v3-btn-primary", href: "/classic.html" }, "Open classic v2"),
      t("button", { type: "button", onClick: U }, "↺ Reset changes")
    ) }),
    h ? t("p", { class: `forge-v3-empty ${u.length ? "forge-v3-settings-error" : ""}` }, h) : null,
    u.length ? t("ul", { class: "forge-v3-settings-errors" }, u.map((k) => t("li", { key: k }, k))) : null,
    t("p", { class: "forge-v3-settings-helper" }, W ? `${W} changed setting${W === 1 ? "" : "s"} will be saved.` : "Only settings you change will be sent on save."),
    t(
      "section",
      { class: "forge-v3-settings-grid", "aria-label": "Settings groups" },
      X.map((k) => {
        const C = k.label === "Other" ? B : ii(a, k), x = [
          ...k.label === "Dashboard Backend" ? [M()] : [],
          ...C.map((T) => {
            const J = k.label === "Other", he = Ur.has(T.key);
            return t(
              "label",
              { key: T.key, class: `forge-v3-setting-row ${J ? "forge-v3-setting-unknown" : ""} ${he ? "forge-v3-setting-runtime" : ""}` },
              t("span", null, un(T.key), J && !b ? t("em", null, " read-only") : null),
              t("small", null, he ? `${ma(T.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : ma(T.key)),
              H(T, J && !b)
            );
          })
        ];
        return t(
          "section",
          { key: k.label, class: "forge-v3-settings-card forge-v3-settings-group" },
          t(
            "header",
            null,
            t("div", null, t("h2", null, k.label), t("p", null, Dr[k.label])),
            k.label === "Other" ? t("label", { class: "forge-v3-other-unlock" }, t("input", { type: "checkbox", checked: b, onInput: (T) => p(T.target.checked) }), " Edit unknown") : t("span", null, String(x.length))
          ),
          x.length === 0 ? t("p", { class: "forge-v3-empty" }, "No settings in this group.") : x
        );
      })
    ),
    t(
      "div",
      { class: "forge-v3-settings-save-bar" },
      t("button", { type: "button", class: "forge-v3-btn-primary", disabled: W === 0, onClick: $ }, W ? `Save ${W} change${W === 1 ? "" : "s"}` : "Save settings"),
      h === "Settings saved" ? t("span", { class: "forge-v3-saved-indicator" }, "✓ Saved") : null
    )
  ]);
}
function ci() {
  const [e, n] = A("suggestions"), [a, r] = A({ suggestions: [], events: [], changes: [] }), [s, l] = A("Loading learnings…"), c = () => {
    oe("/api/learnings").then((f) => {
      r({ suggestions: f.suggestions ?? [], events: f.events ?? [], changes: f.changes ?? [] }), l("");
    }).catch(() => l("Unable to load learnings"));
  };
  K(() => {
    c();
    const f = window.setInterval(c, 3e4), d = typeof EventSource < "u" ? new EventSource("/api/events") : null;
    return d == null || d.addEventListener("message", (h) => {
      try {
        const y = JSON.parse(h.data);
        String(y.type ?? "").startsWith("learning_") && c();
      } catch {
      }
    }), () => {
      window.clearInterval(f), d == null || d.close();
    };
  }, []);
  const g = (f, d) => {
    r((h) => ({ ...h, suggestions: h.suggestions.filter((y) => y.id !== f) })), fetch(`/api/learnings/${f}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: d })
    }).then((h) => h.ok ? c() : Promise.reject(new Error("resolve failed"))).catch(() => {
      l("Unable to resolve learning suggestion"), c();
    });
  };
  return t(bt, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    t(qt, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
    t(
      "nav",
      { class: "forge-v3-learning-tabs", "aria-label": "Learning tabs" },
      Mr.map((f) => t("button", { key: f.key, type: "button", class: e === f.key ? "active" : "", onClick: () => n(f.key) }, f.label))
    ),
    s ? t("p", { class: "forge-v3-empty" }, s) : null,
    e === "suggestions" && t(
      "section",
      { class: "forge-v3-learning-timeline", "aria-label": "Learning suggestions" },
      a.suggestions.length === 0 ? t("p", { class: "forge-v3-empty" }, "No learning suggestions.") : a.suggestions.map((f) => t(
        "article",
        { key: f.id, class: "forge-v3-learning-card" },
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? `Issue #${f.issue_id ?? "—"}`, " · ", f.target ?? "target", " · Added ", f.created_at ? `${pe(f.created_at)} ago (${tn(f.created_at)})` : "date unknown"),
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
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? "Global", " · ", f.target ?? "target", " · ", f.change_type ?? "change", " · ", f.created_at ? tn(f.created_at) : "date unknown"),
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
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? "Global", " · ", f.event_type ?? "reflection", " · ", f.created_at ? tn(f.created_at) : "date unknown"),
        t("h2", null, f.summary ?? "Reflection event")
      ))
    )
  ]);
}
function di() {
  const [e, n] = A(() => Object.fromEntries(
    en.map((b) => [b, { type: b, content: "", status: "Loading…" }])
  )), [a, r] = A({}), [s, l] = A("Loading models…"), c = (b) => {
    fetch(`/api/agents/${b}/prompt`).then((p) => p.ok ? p.text() : Promise.reject(new Error("prompt failed"))).then((p) => n((P) => ({ ...P, [b]: { type: b, content: p, status: "Loaded" } }))).catch(() => n((p) => ({ ...p, [b]: { ...p[b], status: "Unable to load prompt" } })));
  }, g = () => {
    oe("/api/settings").then((b) => {
      r(b), l("Models loaded");
    }).catch(() => l("Unable to load model settings"));
  };
  K(() => {
    en.forEach(c), g();
  }, []);
  const f = (b, p) => n((P) => ({ ...P, [b]: { ...P[b], content: p, status: "Unsaved" } })), d = (b, p) => {
    r((P) => ({ ...P, [b]: p })), l("Unsaved model change");
  }, h = (b) => {
    l("Saving model…"), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [b]: a[b] ?? "" })
    }).then((p) => p.ok ? p.json() : Promise.reject(new Error("save failed"))).then((p) => {
      p.settings && r(p.settings), l("Model saved");
    }).catch(() => l("Unable to save model"));
  }, y = (b) => {
    fetch(`/api/agents/${b}/prompt`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: e[b].content })
    }).then((p) => p.ok ? p.json() : Promise.reject(new Error("save failed"))).then(() => n((p) => ({ ...p, [b]: { ...p[b], status: "Saved" } }))).catch(() => n((p) => ({ ...p, [b]: { ...p[b], status: "Unable to save prompt" } })));
  }, u = (b) => {
    fetch(`/api/agents/${b}/prompt/default`).then((p) => p.ok ? p.text() : Promise.reject(new Error("default failed"))).then((p) => n((P) => ({ ...P, [b]: { type: b, content: p, status: "Reset to default" } }))).catch(() => n((p) => ({ ...p, [b]: { ...p[b], status: "Unable to reset prompt" } })));
  }, v = a.model ?? a.default_model ?? "";
  return t(bt, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    t(qt, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place" }),
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
        t("input", { class: "forge-v3-prompt-model-input", value: v, placeholder: "anthropic-vertex/sonnet-4-6", onInput: (b) => d("model", b.target.value) }),
        t("button", { type: "button", onClick: () => h("model") }, "Save default")
      )
    ),
    t(
      "section",
      { class: "forge-v3-prompts-grid", "aria-label": "Agent prompt editors" },
      en.map((b) => {
        const p = e[b], P = p.content.length, N = Oa[b], R = a[N] ?? "";
        return t(
          "article",
          { key: b, class: "forge-v3-prompt-card" },
          t(
            "header",
            null,
            t(
              "div",
              null,
              t("h2", null, b),
              t("p", { class: "forge-v3-prompt-meta" }, "Prompt: ", p.status, " · Model: ", R.trim() ? "override" : "default")
            ),
            b === "coder" ? t("span", { class: "forge-v3-prompt-meta" }, "learned-rules") : null
          ),
          t(
            "div",
            { class: "forge-v3-prompt-model-row" },
            t("label", { class: "forge-v3-prompt-meta" }, "Model override"),
            t("input", { class: "forge-v3-prompt-model-input", value: R, placeholder: v || "Use default model", onInput: ($) => d(N, $.target.value) }),
            t("button", { type: "button", onClick: () => h(N) }, "Save model")
          ),
          t("textarea", { class: "forge-v3-prompt-editor", value: p.content, rows: 12, onInput: ($) => f(b, $.target.value) }),
          t(
            "footer",
            { class: "forge-v3-prompt-meta" },
            t("span", null, String(P), " chars"),
            t(
              "div",
              { class: "forge-v3-toolbar-actions" },
              t("button", { type: "button", onClick: () => u(b) }, "Reset to default"),
              t("button", { type: "button", onClick: () => y(b) }, "Save prompt")
            )
          )
        );
      })
    )
  ]);
}
function ui(e) {
  if (!e) return !1;
  const n = ht(e);
  return Number.isFinite(n) && Date.now() - n <= 10080 * 60 * 1e3;
}
function fi(e) {
  const n = (e.prStack ?? []).map((a) => [a.pr_number ? `#${a.pr_number}` : "", a.gt_branch, a.branch, a.status].filter(Boolean).join(" ")).join(" ");
  return [e.linear_id, e.title, e.state, e.updated_at, n].filter(Boolean).join(" ").toLowerCase();
}
function pi({ issue: e, onClose: n }) {
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
        e.summaryContent ? t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Ye(e.summaryContent) } }) : t("p", { class: "forge-v3-empty" }, e.hasSummary ? "Summary could not be loaded." : "No summary was generated for this issue.")
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
function gi() {
  const [e, n] = A(null), [a, r] = A(null), [s, l] = A(""), [c, g] = A(null);
  K(() => {
    let p = !1;
    return oe("/api/archive").then((P) => {
      p || n(P);
    }).catch(() => {
      p || r("Unable to load archive");
    }), () => {
      p = !0;
    };
  }, []);
  const f = e ?? [], d = s.trim().toLowerCase(), h = d ? f.filter((p) => fi(p).includes(d)) : f, y = c ? f.find((p) => p.id === c) ?? null : null, u = h.length, v = h.filter((p) => ui(p.merged ?? p.updated_at)).length, b = u ? (h.reduce((p, P) => {
    var N;
    return p + Number(P.pr_count ?? ((N = P.prStack) == null ? void 0 : N.length) ?? 0);
  }, 0) / u).toFixed(1) : "0.0";
  return t(bt, { view: "archive", className: `forge-v3-archive-wrap ${y ? "forge-v3-has-archive-detail" : ""}` }, [
    t(qt, { icon: "🗃️", title: "Archive", subtitle: `${u} completed issues${d ? ` matching “${s.trim()}”` : ""} — all PRs merged`, actions: t("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: s, onInput: (p) => l(p.target.value) }) }),
    t(
      "section",
      { class: "forge-v3-archive-stats forge-v3-stats-strip", "aria-label": "Archive stats" },
      t("article", null, t("span", null, "Total completed"), t("strong", null, String(u))),
      t("article", null, t("span", null, "Completed this week"), t("strong", null, String(v))),
      t("article", null, t("span", null, "Average time to merge"), t("strong", null, "—")),
      t("article", null, t("span", null, "Average PRs per issue"), t("strong", null, b))
    ),
    a ? t("p", { class: "forge-v3-empty" }, "Unable to load archive") : e === null ? t("p", { class: "forge-v3-empty" }, "Loading archive…") : f.length === 0 ? t("p", { class: "forge-v3-empty" }, "No completed issues yet") : h.length === 0 ? t("p", { class: "forge-v3-empty" }, "No archived issues match your search") : t(
      "section",
      { class: "forge-v3-archive-grid forge-v3-archive-list", "aria-label": "Completed issues" },
      h.map((p) => {
        var P;
        return t(
          "article",
          { key: p.id, class: `forge-v3-archive-card ${c === p.id ? "is-selected" : ""}`, tabIndex: 0, role: "button", onClick: () => g(p.id), onKeyDown: (N) => {
            (N.key === "Enter" || N.key === " ") && (N.preventDefault(), g(p.id));
          } },
          t("div", { class: "forge-v3-archive-meta" }, p.linear_id ?? `Issue #${p.id}`, " · ", p.updated_at ?? "merged"),
          t("h2", null, p.title ?? "Untitled issue"),
          t("div", { class: "forge-v3-archive-meta" }, "PR links", ": ", (P = p.prStack) != null && P.length ? p.prStack.map((N, R) => {
            const $ = N.pr_number ? `#${N.pr_number}` : N.gt_branch ?? N.branch ?? "pending";
            return N.url ? t("a", { key: `${$}-${R}`, href: N.url, target: "_blank", rel: "noreferrer", onClick: (U) => U.stopPropagation() }, $) : t("span", { key: `${$}-${R}` }, $);
          }) : "None"),
          t("div", { class: "forge-v3-archive-meta" }, "Agent runs", ": ", String(p.run_count ?? 0)),
          t("div", { class: "forge-v3-archive-meta" }, "Summary", ": ", p.summaryContent || p.hasSummary ? "available" : "not generated")
        );
      })
    ),
    y ? t(pi, { issue: y, onClose: () => g(null) }) : null
  ]);
}
function vi({ issueId: e, issuePreview: n, reloadKey: a, autoOpenDiffKey: r, onClose: s, onPanelResizeStart: l, onIssueAction: c, onRemoveIssue: g, onLaunchRuntime: f, onStopVm: d, onSyncPrs: h, onSubmitFeedback: y, onResolveDecision: u }) {
  var $n, xn, Dn, Wn, On, Fn, Un, Mn;
  const [v, b] = A(() => Ft().detailTab), [p, P] = A(null), [N, R] = A(!1), [$, U] = A(!1), [B, Y] = A(""), [W, X] = A(""), H = Je(0), [M, k] = A(""), [C, x] = A(!1), [T, J] = A(null), [he, ne] = A(""), [fe, ie] = A([]), [be, w] = A([]), [z, se] = A(""), [V, Re] = A([]), [Bt, Oe] = A([]), [He, ye] = A(!1), [Te, Fe] = A(!1), [jt, ke] = A("idle"), [tt, qe] = A([]), [nt, yt] = A(""), [at, Be] = A(""), [rt, _] = A(!1), [E, S] = A(""), [O, D] = A([]), [j, Z] = A(""), [ve, ae] = A(""), kt = Je(null);
  if (K(() => {
    var m;
    if (!e) {
      P(null), R(!1), U(!1), Fe(!1), ye(!1);
      return;
    }
    P(n ? { issue: n } : null);
    const o = Ft();
    b(o.detailTab), R(o.panel === "plan"), U(o.panel === "diff" || o.panel === "review"), Fe(o.panel === "listen"), ye(o.panel === "jump"), qe([]), ke("idle"), Y(""), X(o.panel === "diff" || o.panel === "review" ? "Loading diff…" : ""), k(o.diffPath), x(o.panel === "review"), J(null), ne(""), ie([]), w([]), se(""), Re([]), Oe([]), yt(""), Be(""), _(!1), S(""), D([]), Z(""), ae(""), (m = kt.current) == null || m.abort(), kt.current = null;
  }, [e]), K(() => {
    if (!e) return;
    let o = !1;
    return oe(`/api/issues/${e}?fast=1`).then((m) => {
      o || P(m);
    }).catch(() => {
      o || P({ issue: { id: e, title: "Unable to load issue" } });
    }), () => {
      o = !0;
    };
  }, [e, a]), K(() => {
    if (!e) return;
    Ut({ view: "queue", issue: e, tab: v === "overview" ? null : v, panel: $ ? C ? "review" : "diff" : N ? "plan" : Te ? "listen" : He ? "jump" : null, diffPath: $ ? M : null });
  }, [e, v, N, $, Te, He, C, M]), K(() => {
    var I;
    const o = (I = p == null ? void 0 : p.decisions) == null ? void 0 : I.find((L) => L.type === "FIX_APPROVAL"), m = Lt(o).comments ?? [];
    Re(m.map((L, F) => lt(L, F)));
  }, [p == null ? void 0 : p.decisions]), K(() => {
    var o;
    _(!!((o = p == null ? void 0 : p.issue) != null && o.auto_fix_enabled));
  }, [($n = p == null ? void 0 : p.issue) == null ? void 0 : $n.auto_fix_enabled]), K(() => {
    if (!Te || !e) return;
    if (Me()) {
      ke("mock live"), qe([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    ke("connecting…"), qe([]);
    const o = new EventSource(`/api/issues/${e}/listen`);
    return o.addEventListener("meta", (m) => {
      const I = JSON.parse(m.data);
      ke(I.agentType ? `live · ${I.agentType}` : "live");
    }), o.addEventListener("message", (m) => {
      const I = JSON.parse(m.data), L = I.kind ?? "text", F = (I.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!F) return;
      const ce = L === "text_delta" || L === "thinking_delta";
      qe((Ke) => {
        const Ge = Ke[Ke.length - 1];
        return ce && Ge && Ge.kind === L ? [...Ke.slice(0, -1), { kind: L, text: Ge.text + F }] : [...Ke.slice(-200), { kind: L, text: F }];
      });
    }), o.addEventListener("done", (m) => {
      const I = JSON.parse(m.data);
      ke(I.exitCode === 0 ? "done" : `failed (${I.exitCode ?? "unknown"})`), o.close();
    }), o.addEventListener("error", () => ke("no active agent")), o.onerror = () => ke("disconnected"), () => o.close();
  }, [Te, e]), K(() => {
    !e || r <= 0 || (x(!0), U(!0), X("Loading diff…"));
  }, [r, e]), K(() => {
    if (!e || !$ || W !== "Loading diff…") return;
    const o = ++H.current;
    C && (ne("Loading AI tour…"), oe(`/api/issues/${e}/tour`).then((m) => {
      o === H.current && (J(m), ne(m.generating ? "AI tour is generating…" : m.tour ? "" : "No AI tour yet"));
    }).catch(() => {
      o === H.current && ne("Unable to load AI tour");
    })), oe(`/api/issues/${e}/diff`).then((m) => {
      if (o !== H.current) return;
      const I = m.diff ?? "", L = va(I);
      Y(I), k((F) => {
        var ce;
        return F || ((ce = L[0]) == null ? void 0 : ce.path) || "";
      }), X(m.error ?? "");
    }).catch(() => {
      o === H.current && X("Unable to load diff");
    });
  }, [$, W, e, C]), !e) return null;
  const i = p == null ? void 0 : p.issue, ee = ((p == null ? void 0 : p.decisions) ?? []).filter((o) => !o.verdict && !o.resolved_at && !Bt.includes(o.id)), Qt = (p == null ? void 0 : p.prStack) ?? [], ot = i ?? {}, Ka = () => Fe(!0), je = uo(ot, ee), le = Ma(ee), Kt = vo(i == null ? void 0 : i.state), Xa = `${bn(i == null ? void 0 : i.priority)} ${yn(i == null ? void 0 : i.priority)}`, za = mo(p), Ja = Va(p), It = bo(p), Ya = ho(p) && !["PENDING", "SETTING_UP", "PLANNING"].includes((i == null ? void 0 : i.state) ?? "") || It, Za = yo(i == null ? void 0 : i.state), er = ko(i == null ? void 0 : i.state), tr = Io(i), nr = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes((i == null ? void 0 : i.state) ?? ""), ar = { label: "Plan" }, An = async () => {
    if (!(i != null && i.id)) return;
    const o = await me({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    o != null && o.trim() && c(i.id, "steer", { instructions: o.trim() });
  }, rr = async () => {
    !(i != null && i.id) || !await ut({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" }) || c(i.id, "clear-steer");
  }, or = jr.filter((o) => o.state !== (i == null ? void 0 : i.state)), ir = async (o) => {
    if (!(i != null && i.id)) return;
    const m = i.linear_id ?? `issue #${i.id}`, I = o.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    await ut({ title: "Jump workflow state?", message: `Move ${m} to ${o.state}?${I}`, confirmText: "Jump state", danger: o.risky }) && (ye(!1), c(i.id, "advance", { nextState: o.state }));
  }, sr = async () => {
    if (!(i != null && i.id)) return;
    const o = Br(i.state);
    await ut({ title: "Advance workflow state?", message: `Manually advance ${i.linear_id ?? `issue #${i.id}`} to ${o}?`, confirmText: "Advance" }) && c(i.id, "advance", { nextState: o });
  }, lr = async () => {
    !(i != null && i.id) || await me({ title: "Full reset issue", message: `This fully resets ${i.linear_id ?? `issue #${i.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: !0, requiredText: "RESET" }) !== "RESET" || c(i.id, "reset");
  }, cr = async () => {
    !(i != null && i.id) || await me({ title: "Remove issue", message: `Remove ${i.linear_id ?? `issue #${i.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: !0, requiredText: "DELETE" }) !== "DELETE" || g(i.id);
  }, dr = () => {
    i != null && i.id && (Be("Launching runtime…"), f(i.id).then((o) => Be(`Runtime launch complete${typeof o == "object" && o && "launchRef" in o ? ` · ${o.launchRef ?? "started"}` : ""}`)).catch((o) => Be(`Runtime launch failed: ${o.message}`)));
  }, ur = (o) => {
    if (!(i != null && i.id)) return;
    const m = rt;
    _(o), c(i.id, "set-auto-fix", { enabled: o }), window.setTimeout(() => {
      var I;
      !Me() && ((I = p == null ? void 0 : p.issue) == null ? void 0 : I.auto_fix_enabled) === m && _(m);
    }, 2e3);
  }, fr = async () => {
    var F;
    if (!(i != null && i.id)) return;
    const o = Qt.filter((ce) => ce.pr_number).map((ce) => String(ce.pr_number)), m = o.length ? await me({ title: "Target PR", message: `Choose a PR number (${o.join(", ")}).`, label: "PR number", initialValue: o[0], confirmText: "Continue" }) : null, I = m != null && m.trim() ? Number(m.trim().replace(/^#/, "")) : null, L = (F = await me({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" })) == null ? void 0 : F.trim();
    L && y(i.id, L, Number.isFinite(I) ? I : null);
  }, pr = (o = !1) => {
    if (!(i != null && i.id)) return;
    ne(o ? "Regenerating AI tour…" : "Generating AI tour…");
    const m = () => ge(`/api/issues/${i.id}/generate-tour`, {});
    (o ? ge(`/api/issues/${i.id}/tour`, {}, "DELETE").then(m) : m()).then((I) => {
      J(I), ne(I.tour ? "" : "AI tour is generating…");
    }).catch(() => ne("Unable to start AI tour generation"));
  }, wn = (o = "diff") => {
    i != null && i.id && (H.current += 1, x(o === "review"), J(null), ne(o === "review" ? "Loading AI tour…" : ""), Y(""), k(""), U(!0), X("Loading diff…"));
  }, At = va(B), de = At.find((o) => o.path === M) ?? At[0], Ce = ee.find((o) => o.type === "PLAN_REVIEW") ?? (le === "plan" ? ee[0] : void 0), it = ee.find((o) => o.type === "CODE_REVIEW") ?? (le === "code" ? ee[0] : void 0), Ie = ee.find((o) => o.type === "FIX_APPROVAL") ?? (le === "fix" ? ee[0] : void 0), Le = ee.find((o) => o.type === "SPLIT_APPROVAL") ?? (le === "split" ? ee[0] : void 0), st = Lt(Ie).comments ?? [], wt = Lt(Le), Pn = wt.proposedStack ?? wt.stack ?? [], En = co(i == null ? void 0 : i.state), Nn = En ? ee.filter((o) => o.type && o.type !== En) : ee.filter((o) => o.type), Sn = async (o, m) => {
    var L;
    const I = (L = await me({ title: "Add review comment", message: m === null ? `Comment on ${o}` : `Comment on ${o}:${m}`, label: "Comment", confirmText: "Add comment" })) == null ? void 0 : L.trim();
    I && w((F) => [...F, { id: `${Date.now()}-${F.length}`, file: o, line: m, body: I }]);
  }, Rn = (o) => ie((m) => m.includes(o) ? m.filter((I) => I !== o) : [...m, o]), Ae = (o, m, I) => {
    Oe((L) => L.includes(o) ? L : [...L, o]), u(o, m, I);
  }, Tn = async () => {
    var m;
    if (!Ce) return;
    const o = (m = await me({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" })) == null ? void 0 : m.trim();
    Ae(Ce.id, "approved", o ? { steeringComment: o } : void 0);
  }, Qe = async (o, m) => {
    const I = await me({ title: `Request ${m} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: !0 });
    I != null && I.trim() && Ae(o.id, "rejected", { reason: I.trim() });
  }, gr = (o) => Re((m) => m.includes(o) ? m.filter((I) => I !== o) : [...m, o]), Xt = () => {
    if (!Ie) return;
    const o = st.map((m, I) => lt(m, I));
    Re([]), Ae(Ie.id, "rejected", { skippedIds: o, reason: "Skipped all PR comments" });
  }, Cn = () => {
    if (!Ie) return;
    const o = st.map((L, F) => lt(L, F)), m = V;
    if (!m.length) {
      Xt();
      return;
    }
    const I = o.filter((L) => !m.includes(L));
    Ae(Ie.id, "approved", { approvedIds: m, skippedIds: I });
  }, Ln = (o) => {
    it && (Ae(it.id, o, {
      kind: "code-review",
      summary: z.trim(),
      reviewedFiles: fe,
      comments: be.map(({ file: m, line: I, body: L }) => ({ file: m, line: I, body: L }))
    }), se(""));
  }, Gn = () => {
    if (!(i != null && i.id) || !E.trim() || j === "thinking") return;
    const o = E.trim();
    S(""), Z("thinking"), ae("Gathering issue context…"), D((I) => [...I, { role: "user", text: o }, { role: "assistant", text: "" }]);
    const m = new AbortController();
    kt.current = m, fetch(`/api/issues/${i.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: o }),
      signal: m.signal
    }).then(async (I) => {
      if (!I.ok || !I.body) throw new Error(`Ask failed (${I.status})`);
      const L = I.body.getReader(), F = new TextDecoder();
      let ce = "";
      const Ke = (we) => D((Pe) => {
        const $e = [...Pe].map((Ee) => Ee.role).lastIndexOf("assistant");
        return $e < 0 ? [...Pe, { role: "assistant", text: we }] : Pe.map((Ee, _e) => _e === $e ? { ...Ee, text: Ee.text + we } : Ee);
      }), Ge = (we) => ae(we), vr = (we) => {
        const Pe = we.split(`
`).find((zt) => zt.startsWith("event:")), $e = we.split(`
`).find((zt) => zt.startsWith("data:"));
        if (!$e) return;
        const Ee = (Pe == null ? void 0 : Pe.replace(/^event:\s*/, "")) ?? "message", _e = JSON.parse($e.replace(/^data:\s*/, ""));
        if (Ee === "done") {
          Z(""), ae("");
          return;
        }
        if (Ee === "meta") {
          Ge("Gathered issue context. Starting assistant…");
          return;
        }
        Ee === "message" && ((_e.kind === "text_delta" || _e.kind === "text") && Ke(_e.text ?? ""), _e.kind === "thinking_delta" && Ge("Thinking…"), _e.kind === "tool" && Ge((_e.text ?? "").trim()), _e.kind === "error" && Ge(`Error: ${(_e.text ?? "").trim()}`));
      };
      for (; ; ) {
        const { value: we, done: Pe } = await L.read();
        if (Pe) break;
        ce += F.decode(we, { stream: !0 });
        const $e = ce.split(`

`);
        ce = $e.pop() ?? "", $e.forEach(vr);
      }
      Z(""), ae("");
    }).catch((I) => {
      m.signal.aborted || (Z(""), ae(I.message));
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
        t("div", { class: "forge-v3-issue-meta" }, (i == null ? void 0 : i.linear_id) ?? `Issue #${e}`),
        t("h2", null, (i == null ? void 0 : i.title) ?? "Loading issue…")
      ),
      t("button", { type: "button", onClick: s, "aria-label": "Close issue detail panel" }, "×")
    ),
    t(
      "nav",
      { class: "forge-v3-detail-tabs", "aria-label": "Issue detail tabs" },
      xr.map((o) => t("button", { key: o.key, type: "button", class: v === o.key ? "active" : "", onClick: () => b(o.key) }, o.label))
    ),
    t(
      "section",
      { class: "forge-v3-detail-body", "data-tab": v },
      v === "overview" && t(
        "div",
        { class: "forge-v3-detail-overview" },
        t(
          "section",
          { class: "forge-v3-ds" },
          t(
            "div",
            { class: `forge-v3-state-banner ${je.tone}` },
            je.icon === "spinner" ? t("span", { class: "forge-v3-spinner forge-v3-state-spinner", "aria-hidden": "true" }) : t("span", { class: "forge-v3-state-icon", "aria-hidden": "true" }, je.icon),
            t("div", { class: "forge-v3-sb-text" }, t("strong", null, je.title), t("br", null), je.text),
            je.live ? t("span", { class: "forge-v3-live-badge" }, "Live") : null
          ),
          t(
            "div",
            { class: "forge-v3-phase-track", "aria-label": "Workflow phase track" },
            fa.map((o, m) => {
              const I = go(o, p);
              return [
                t(
                  "div",
                  { key: o, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${I.title}: ${I.summary} ${I.stats.join(". ")}` },
                  t("div", { class: `forge-v3-phase-dot ${m < Kt || (i == null ? void 0 : i.state) === "DONE" ? "done" : m === Kt ? _o(i == null ? void 0 : i.state) ? "wait" : "active" : ""}` }),
                  t("div", { class: "forge-v3-phase-label" }, o),
                  t(
                    "div",
                    { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    t("strong", null, I.title),
                    t("p", null, I.summary),
                    t("ul", null, I.stats.map((L) => t("li", { key: L }, L)))
                  )
                ),
                m < fa.length - 1 ? t("div", { key: `${o}-line`, class: `forge-v3-phase-line ${m < Kt ? "done" : ""}` }) : null
              ];
            })
          )
        ),
        (i == null ? void 0 : i.state) === "FAILED" && (p != null && p.failureContext) ? t(
          "section",
          { class: "forge-v3-ds forge-v3-failure-box" },
          t(
            "div",
            { class: "forge-v3-failure-header" },
            t("span", { class: "forge-v3-failure-icon", "aria-hidden": "true" }, "✕"),
            t(
              "div",
              null,
              t("strong", null, `${((xn = p.failureContext.run) == null ? void 0 : xn.agent_type) ?? "Agent"} crashed`),
              t(
                "span",
                { class: "forge-v3-failure-meta" },
                ` · exit ${((Dn = p.failureContext.run) == null ? void 0 : Dn.exit_code) ?? "?"} · `,
                (Wn = p.failureContext.run) != null && Wn.started_at ? `${pe(p.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            (On = p.failureContext.run) != null && On.id ? t("a", { class: "forge-v3-failure-log-link", href: dt(p.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗") : null
          ),
          p.failureContext.logTail ? t("pre", { class: "forge-v3-failure-log" }, p.failureContext.logTail) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "retry") : void 0 }, "↺ Retry"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: An }, "💬 Steer before retry")
          )
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, le ? "Actions · Decision needed" : "Actions"),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            ue(ot) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: Ka }, "👁 Listen live") : null,
            le === "plan" && Ce ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Tn }, "✓ Approve plan") : null,
            le === "plan" && Ce ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => R(!0) }, "✗ Request changes") : null,
            le === "code" && it ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => wn("review") }, "⬡ Review code") : null,
            le === "fix" && Ie ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Cn }, `✓ Fix selected (${V.length})`) : null,
            le === "fix" && Ie ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Xt }, "Skip all") : null,
            le === "split" && Le ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Le.id, "approved") }, "✓ Approve split plan") : null,
            le === "split" && Le ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Qe(Le, "Split plan") }, "✗ Revise split") : null,
            le === "generic" && ee[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(ee[0].id, "approved") }, "✓ Approve") : null,
            le === "generic" && ee[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Qe(ee[0], "Decision") }, "✗ Request changes") : null,
            Ya ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => R(!0) }, It ? "📋 View plan / handoff" : "📋 View plan") : null,
            Za ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => wn("diff") }, "📊 View diff") : null,
            nr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: An }, "💬 Steer") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: sr }, "⤴ Advance state"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id) || (i == null ? void 0 : i.state) === "DONE", onClick: () => ye(!0) }, "↕ Jump to state"),
            er ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: async () => {
              var m;
              if (!(i != null && i.id)) return;
              const o = (m = await me({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" })) == null ? void 0 : m.trim();
              c(i.id, "split-pr-stack", o ? { instructions: o } : {});
            } }, "⑂ Split PR") : null,
            tr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: async () => {
              if (!(i != null && i.id)) return;
              await ut({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: !0 }) && c(i.id, "rebase");
            } }, "↥ Rebase") : null,
            (i == null ? void 0 : i.state) === "FAILED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "retry") : void 0 }, "↺ Retry") : null,
            (i == null ? void 0 : i.state) === "PAUSED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "unpause") : void 0 }, "▶ Resume") : null,
            (i == null ? void 0 : i.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "unignore") : void 0 }, "▶ Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL"].includes((i == null ? void 0 : i.state) ?? "") ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: fr }, "💬 Add PR feedback") : null,
            ue(ot) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "pause") : void 0 }, "⏸ Pause") : null
          )
        ),
        Nn.length ? t(
          "section",
          { class: "forge-v3-ds forge-v3-stale-decisions" },
          t("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          t("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          Nn.map((o) => t("div", { class: "forge-v3-stale-decision-row", key: o.id }, t("span", null, o.type ?? "Decision"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Qe(o, "Stale decision") }, "Reject with feedback")))
        ) : null,
        Ie ? t(
          "section",
          { class: "forge-v3-ds forge-v3-fix-approval" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "Fix approval"), t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => Re(st.map((o, m) => lt(o, m))) }, "Select all"), t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => Re([]) }, "None"))),
          st.length ? t("div", { class: "forge-v3-fix-comment-list" }, st.map((o, m) => {
            const I = lt(o, m), L = o.path ? `${o.path}${o.line ? `:${o.line}` : ""}` : "general";
            return t(
              "label",
              { class: `forge-v3-fix-comment-card ${V.includes(I) ? "selected" : ""}`, key: I },
              t("input", { type: "checkbox", checked: V.includes(I), onChange: () => gr(I) }),
              t(
                "div",
                null,
                t("div", { class: "forge-v3-fix-comment-meta" }, t("strong", null, o.author ?? "Reviewer"), " · ", L, o.pr_number ?? o.prNumber ? ` · PR #${o.pr_number ?? o.prNumber}` : ""),
                lo(o.body),
                t("div", { class: "forge-v3-fix-comment-badges" }, [o.reviewState ?? o.state, o.source].filter(Boolean).map((F) => t("span", null, F)))
              )
            );
          })) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Cn }, V.length ? `Approve ${V.length} selected` : "Skip all comments"), V.length ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: Xt }, "Skip all") : null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Qe(Ie, "Fix approval") }, "Request different fixes"))
        ) : null,
        Le ? t(
          "section",
          { class: "forge-v3-ds forge-v3-split-approval" },
          t("div", { class: "forge-v3-ds-label" }, "Split approval"),
          t("p", null, wt.summary ?? wt.plan ?? "Review the proposed PR stack split."),
          Pn.length ? t("div", { class: "forge-v3-split-stack" }, Pn.map((o, m) => t("div", { class: "forge-v3-split-row", key: `${o.branch}-${m}` }, t("span", null, String(m + 1)), t("strong", null, o.title ?? o.branch ?? `PR ${m + 1}`), t("small", null, o.summary ?? o.branch ?? "pending branch")))) : null,
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ae(Le.id, "approved") }, "Approve split plan"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Qe(Le, "Split plan") }, "Request split changes"))
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, "Info"),
          t(
            "div",
            { class: "forge-v3-info-grid" },
            t("div", { class: "forge-v3-ig-label" }, "Source"),
            t("div", { class: "forge-v3-ig-value" }, i != null && i.linear_id ? t("a", { href: `https://linear.app/issue/${i.linear_id}`, target: "_blank", rel: "noreferrer" }, i.linear_id, " ↗") : `Issue #${e}`),
            t("div", { class: "forge-v3-ig-label" }, "Priority"),
            t("div", { class: `forge-v3-ig-value ${kn(i == null ? void 0 : i.priority)}` }, Xa),
            t("div", { class: "forge-v3-ig-label" }, "Branch"),
            t("div", { class: "forge-v3-ig-value" }, (i == null ? void 0 : i.branch) ?? "—"),
            t("div", { class: "forge-v3-ig-label" }, "Worktree"),
            t("div", { class: "forge-v3-ig-value" }, (i == null ? void 0 : i.wt_path) ?? "—"),
            t("div", { class: "forge-v3-ig-label" }, "Added"),
            t("div", { class: "forge-v3-ig-value" }, i != null && i.created_at ? `${pe(i.created_at)} ago` : "—"),
            t("div", { class: "forge-v3-ig-label" }, "Model"),
            t("div", { class: "forge-v3-ig-value" }, "configured in settings")
          )
        ),
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "PR Stack"), t("button", { type: "button", class: "forge-v3-col-head-btn", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? h(i.id) : void 0 }, "↻ Sync from GitHub")),
          t(
            "div",
            { class: "forge-v3-pr-stack-list" },
            Qt.length ? Qt.map((o, m) => {
              const I = o.pr_number, L = o.url ?? null, F = o.branch ?? o.gt_branch ?? "pending", ce = Number(o.checksFailed ?? 0) > 0 ? "bad" : Number(o.checksPending ?? 0) > 0 ? "pending" : "ok";
              return t(
                "div",
                { class: "forge-v3-pr-row", key: `${F}-${I ?? m}` },
                t("span", { class: "forge-v3-pr-pos" }, String(m + 1)),
                t("span", { class: "forge-v3-pr-branch" }, F),
                L ? t("a", { class: "forge-v3-pr-badge", href: L, target: "_blank", rel: "noreferrer" }, `#${I} ↗`) : t("span", { class: "forge-v3-pr-badge" }, "no PR"),
                t("span", { class: `forge-v3-ci-badge ${o.isInMergeQueue ? "merge-queue" : ""}` }, o.isInMergeQueue ? "MERGE QUEUE" : o.liveState ?? o.status ?? "unknown"),
                o.isInMergeQueue ? t("span", { class: "forge-v3-pr-meta-badge merge-queue" }, o.mergeQueuePosition ? `Queue #${o.mergeQueuePosition}` : "Queued") : null,
                o.reviewDecision ? t("span", { class: "forge-v3-pr-meta-badge" }, o.reviewDecision) : null,
                o.mergeable ? t("span", { class: "forge-v3-pr-meta-badge" }, o.mergeable) : null,
                o.checksTotal != null ? t("span", { class: `forge-v3-pr-meta-badge checks-${ce}` }, `${o.checksFailed ?? 0} failed · ${o.checksPending ?? 0} pending · ${o.checksTotal ?? 0} checks`) : null
              );
            }) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        t("section", { class: "forge-v3-ds" }, t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "Auto-fix"), t("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: rt, disabled: !(i != null && i.id), onChange: (o) => ur(o.target.checked) }), t("span", null))))
      ),
      v === "activity" && So(p, ot),
      v === "ask" && t(
        "div",
        { class: "forge-v3-ask-panel" },
        t(
          "section",
          { class: "forge-v3-ds forge-v3-ask-intro" },
          t("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          t("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          t("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((o) => t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => S(o) }, o)))
        ),
        t(
          "section",
          { class: "forge-v3-ask-thread", ref: (o) => {
            o && (o.scrollTop = o.scrollHeight);
          } },
          O.length || j === "thinking" || ve ? [
            ...O.filter((o) => o.role === "user" || o.text.trim()).map((o, m) => t(
              "div",
              { key: `${m}-${o.role}`, class: `forge-v3-ask-msg ${o.role}` },
              t("span", null, o.role === "user" ? "You" : "Forge"),
              t("pre", null, o.text)
            )),
            j === "thinking" ? t("div", { class: "forge-v3-ask-thinking", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Thinking"), t("i", null, "."), t("i", null, "."), t("i", null, ".")) : null,
            ve ? t("div", { class: "forge-v3-ask-current-status" }, ve) : null
          ] : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        t(
          "section",
          { class: "forge-v3-ask-compose" },
          t("textarea", { rows: 3, placeholder: "Ask about this issue…", value: E, onInput: (o) => S(o.target.value), onKeyDown: (o) => {
            (o.metaKey || o.ctrlKey) && o.key === "Enter" && Gn();
          } }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !E.trim() || j === "thinking", onClick: Gn }, j === "thinking" ? "Asking…" : "Ask"),
            j === "thinking" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => {
              var o;
              (o = kt.current) == null || o.abort(), Z(""), ae("");
            } }, "Stop") : null,
            t("span", { class: "forge-v3-ask-hint" }, "⌘/Ctrl + Enter")
          )
        )
      )
    ),
    N ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Plan review" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, It ? "Plan + handoff · " : "Plan review · ", (i == null ? void 0 : i.linear_id) ?? `Issue #${e}`), t("h2", null, (i == null ? void 0 : i.title) ?? ar.label)),
          t("button", { type: "button", onClick: () => R(!1), "aria-label": "Close plan modal" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-md-viewer forge-v3-doc-stack" },
          t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Plan"),
            t("div", { dangerouslySetInnerHTML: { __html: Ye(za) } })
          ),
          It ? t(
            "section",
            { class: "forge-v3-doc-section" },
            t("h2", null, "Handoff"),
            t("div", { dangerouslySetInnerHTML: { __html: Ye(Ja) } })
          ) : null
        ),
        t(
          "footer",
          null,
          t("textarea", { placeholder: "Feedback for requested changes…", rows: 3, value: nt, onInput: (o) => yt(o.target.value) }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            Ce ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Tn }, "✓ Approve plan") : null,
            Ce ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => nt.trim() ? Ae(Ce.id, "rejected", { reason: nt.trim() }) : Qe(Ce, "Plan review") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => R(!1) }, "Close")
          )
        )
      )
    ) : null,
    Te ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Live agent output" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-live-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Live · ", (i == null ? void 0 : i.linear_id) ?? `Issue #${e}`), t("h2", null, (i == null ? void 0 : i.title) ?? "Live agent output")),
          t("button", { type: "button", onClick: () => Fe(!1), "aria-label": "Close live output" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-live-output", ref: (o) => {
            o && (o.scrollTop = o.scrollHeight);
          } },
          t("div", { class: "forge-v3-live-output-status" }, t("span", { class: "forge-v3-live-dot", "aria-hidden": "true" }), jt),
          t(
            "div",
            { class: "forge-v3-live-feed forge-v3-af-feed" },
            tt.length ? tt.map((o, m) => {
              const I = o.kind === "thinking_delta" || o.kind === "thinking", L = o.kind === "error" ? "err" : o.kind === "tool" ? "ok" : I ? "me" : "live", F = o.kind === "tool" ? "tool" : I ? "thinking" : o.kind === "prompt" ? "prompt" : o.kind === "error" ? "error" : "assistant";
              return t(
                "div",
                { key: `${m}-${o.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${o.kind}` },
                t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${L}` }), m < tt.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
                t(
                  "div",
                  { class: "forge-v3-af-content" },
                  t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${L === "me" ? "me" : "ag"}` }, F), t("span", { class: "forge-v3-af-time" }, `#${m + 1}`)),
                  t("pre", { class: "forge-v3-af-snippet forge-v3-live-snippet" }, o.text)
                )
              );
            }) : t("p", { class: "forge-v3-empty" }, "Waiting for agent output…")
          )
        )
      )
    ) : null,
    $ ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": C ? "Code review sidecar" : "Diff viewer" },
      t(
        "section",
        { class: `forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-diff-sidecar ${C ? "forge-v3-code-review-sidecar" : ""}` },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, C ? "Code review · " : "Diff · ", (i == null ? void 0 : i.linear_id) ?? `Issue #${e}`), t("h2", null, (i == null ? void 0 : i.title) ?? "Diff")),
          t("button", { type: "button", onClick: () => U(!1), "aria-label": "Close diff" }, "×")
        ),
        C ? t(
          "section",
          { class: "forge-v3-review-tour" },
          t(
            "div",
            null,
            t("strong", null, "AI tour"),
            t("p", null, ((Fn = T == null ? void 0 : T.tour) == null ? void 0 : Fn.summary) ?? he ?? "Tour summary unavailable")
          ),
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => pr(!!(T != null && T.tour)) }, T != null && T.tour ? "Regenerate tour" : "Generate tour"),
          (Mn = (Un = T == null ? void 0 : T.tour) == null ? void 0 : Un.highlights) != null && Mn.length ? t("ul", null, T.tour.highlights.map((o) => t("li", null, typeof o == "string" ? o : [o.title ? t("b", null, o.title, ": ") : null, o.text ?? o.file ?? "Highlight", o.file ? ` (${o.file}${o.line ? `:${o.line}` : ""})` : ""]))) : null
        ) : null,
        t(
          "div",
          { class: "forge-v3-plan-modal-body forge-v3-diff-review" },
          W === "Loading diff…" ? t("div", { class: "forge-v3-diff-loading", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Loading diff…")) : W ? t("p", { class: "forge-v3-empty forge-v3-diff-error" }, W) : At.length === 0 ? t("p", { class: "forge-v3-empty" }, "No diff available.") : [
            t(
              "aside",
              { class: "forge-v3-diff-file-list", "aria-label": "Changed files" },
              t("div", { class: "forge-v3-diff-side-label" }, "Files"),
              At.map((o) => t(
                "button",
                { key: o.path, type: "button", class: (de == null ? void 0 : de.path) === o.path ? "active" : "", title: o.path, onClick: () => k(o.path) },
                t("span", null, C ? t("span", { class: "forge-v3-reviewed-file" }, t("input", { type: "checkbox", checked: fe.includes(o.path), onClick: (m) => m.stopPropagation(), onChange: () => Rn(o.path) }), pa(o.path)) : pa(o.path)),
                t("small", { class: "forge-v3-diff-file-counts" }, t("span", { class: "add" }, `+${o.additions}`), " ", t("span", { class: "del" }, `−${o.deletions}`), be.some((m) => m.file === o.path) ? " · comments" : "")
              ))
            ),
            t(
              "section",
              { class: "forge-v3-diff-main" },
              de ? t(
                "article",
                { class: "forge-v3-diff-file" },
                t("header", null, t("strong", { title: de.path }, de.path), t("span", null, `+${de.additions} −${de.deletions}`), C ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Rn(de.path) }, fe.includes(de.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                t(
                  "div",
                  { class: "forge-v3-diff-table-wrap" },
                  t(
                    "table",
                    { class: "forge-v3-diff-table" },
                    t("tbody", null, de.hunks.map((o, m) => t(
                      "tr",
                      { key: `${m}-${o.slice(0, 12)}`, class: `forge-v3-diff-line ${Ao(o)}` },
                      t("td", { class: "forge-v3-diff-ln" }, C ? t("button", { type: "button", title: "Add line comment", onClick: () => Sn(de.path, m + 1) }, String(m + 1)) : String(m + 1)),
                      t("td", { class: "forge-v3-diff-sign" }, wo(o)),
                      t("td", { class: "forge-v3-diff-content" }, t("code", null, o.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                C ? t("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => Sn(de.path, null) }, "+ Add file comment") : null
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
            t("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: z, onInput: (o) => se(o.target.value) }),
            be.length ? t("div", { class: "forge-v3-review-comments" }, be.map((o) => t("span", { key: o.id }, `${o.file}${o.line ? `:${o.line}` : ""} — ${o.body}`))) : null
          ) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            C && it ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ln("approved") }, "✓ Approve code") : null,
            C && it ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Ln("rejected") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => U(!1) }, "Close")
          )
        )
      )
    ) : null,
    He ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Jump to workflow state" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-jump-state-modal" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, "Admin recovery · ", (i == null ? void 0 : i.linear_id) ?? `Issue #${e}`), t("h2", null, "Jump to state")),
          t("button", { type: "button", onClick: () => ye(!1), "aria-label": "Close jump to state" }, "×")
        ),
        t(
          "div",
          { class: "forge-v3-plan-modal-body" },
          t("p", { class: "forge-v3-jump-state-copy" }, "Move this issue to a selected workflow phase. History is preserved; Forge continues from that phase on the next scheduler tick."),
          t(
            "div",
            { class: "forge-v3-jump-state-list" },
            or.map((o) => t(
              "button",
              { key: o.state, type: "button", class: `forge-v3-jump-state-option ${o.risky ? "risky" : ""}`, onClick: () => ir(o) },
              t("strong", null, o.label),
              t("code", null, o.state),
              t("span", null, o.hint),
              o.risky ? t("em", null, "Requires confirmation") : null
            ))
          )
        ),
        t("footer", null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => ye(!1) }, "Cancel"))
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
          at ? t("div", { class: `forge-v3-admin-status ${at.includes("failed") ? "failed" : ""}` }, at) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id), onClick: dr }, "🚀 Launch runtime"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: d }, "■ Stop VM runtime"),
            i != null && i.steering_context ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: rr }, "⌫ Clear steering") : null,
            (i == null ? void 0 : i.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(i != null && i.id), onClick: () => i != null && i.id ? c(i.id, "unignore") : void 0 }, "▶ Unignore") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(i != null && i.id) || (i == null ? void 0 : i.state) === "DONE", onClick: () => i != null && i.id ? c(i.id, "ignore") : void 0 }, "🚫 Ignore"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(i != null && i.id) || (i == null ? void 0 : i.state) === "DONE", onClick: lr }, "↺ Full reset"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(i != null && i.id) || ue(ot), onClick: cr }, "🗑 Remove issue")
          )
        )
      )
    )
  );
}
const ja = "forge.v3.detailPanelWidth", ba = 500, _i = 440, mi = 760;
function Qa(e) {
  return Math.min(mi, Math.max(_i, Math.round(e)));
}
function hi() {
  const e = window.localStorage.getItem(ja), n = e ? Number(e) : ba;
  return Number.isFinite(n) ? Qa(n) : ba;
}
function bi() {
  var rt;
  const e = Ft(), [n, a] = A(ca), [r, s] = A({ issues: [], decisions: [], runningAgents: [] }), [l, c] = A([]), [g, f] = A(e.view === "queue" ? e.issueId : null), [d, h] = A(0), [y, u] = A(e.view), [v, b] = A(!1), [p, P] = A(""), [N, R] = A(0), [$, U] = A(e.addIssue), [B, Y] = A(hi), [W, X] = A("connecting"), [H, M] = A(!1), [k, C] = A(() => Jo()), x = Je(!1), T = Je(/* @__PURE__ */ new Set()), J = Je(g), he = Je({ issues: [], decisions: [], runningAgents: [] }), ne = (_, E) => {
    if (!E) return "";
    const S = _.issues.find((D) => D.id === E), O = _.decisions.filter((D) => D.issue_id === E).map((D) => `${D.id}:${D.type}`).sort().join(",");
    return `${(S == null ? void 0 : S.state) ?? ""}|${(S == null ? void 0 : S.updated_at) ?? ""}|${O}`;
  }, fe = () => Promise.all([oe("/api/overview"), oe("/api/settings"), oe("/api/archive").catch(() => [])]).then(([_, E, S]) => {
    const O = Fo(_);
    return he.current = O, s(O), a({ ...Zo(O, E), archiveCount: S.length }), O.decisions.forEach((D) => {
      T.current.has(D.id) || (T.current.add(D.id), Yo(D, O.issues.find((j) => j.id === D.issue_id), x.current).catch(() => {
      }));
    }), O;
  }), ie = (_, E) => {
    P(`${_}…`), E().then(() => fe()).then(() => {
      R((S) => S + 1), P(`${_} complete`);
    }).catch((S) => {
      P(`${_} failed`);
      const O = S instanceof Error ? S.message : String(S);
      ei({ title: `${_} failed`, message: O });
    });
  }, be = (_, E, S) => {
    const O = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" }
    };
    s((D) => {
      var ve;
      const j = D.decisions.find((ae) => ae.id === _), Z = j != null && j.type ? (ve = O[E]) == null ? void 0 : ve[j.type] : void 0;
      return {
        ...D,
        decisions: D.decisions.filter((ae) => ae.id !== _),
        issues: Z && j ? D.issues.map((ae) => ae.id === j.issue_id ? { ...ae, state: Z } : ae) : D.issues
      };
    }), ie(
      E === "approved" ? "Decision approved" : "Decision changes requested",
      () => Mo(_, E, S).catch((D) => {
        const j = D instanceof Error ? D.message : String(D);
        if (!(j.includes("409") || j.toLowerCase().includes("already resolved")))
          throw s((Z) => ({
            ...Z,
            decisions: Z.decisions.some((ve) => ve.id === _) ? Z.decisions : [...Z.decisions, { id: _ }]
          })), D;
      })
    );
  }, w = (_, E, S) => ie(`Issue ${E}`, () => Vo(_, E, S)), z = (_) => ie("Issue removed", () => Ho(_).then(() => He())), se = (_) => qo(_), V = async () => {
    await ut({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: !0 }) && ie("VM runtime stopped", () => Bo());
  }, Re = (_) => ie("PR stack synced", () => jo(_)), Bt = (_, E, S) => ie("PR feedback added", () => Qo(_, E, S)), Oe = (_) => {
    f(_), u("queue"), window.requestAnimationFrame(() => Xe("queue", { issueId: _ }));
  }, He = () => {
    f(null), Xe("queue");
  }, ye = (_, E) => {
    f(_), u("queue"), h((S) => S + 1), Xe("queue", { issueId: _ });
  }, Te = () => {
    const _ = Oo(r.decisions, r.issues);
    _ && ye(_.issue_id, _.id);
  }, Fe = () => {
    u("queue"), U(!0), Ut({ view: "queue", add: "issue" }, !1);
  }, jt = () => {
    U(!1), Ut({ add: null });
  }, ke = () => ie("Linear backlog refreshed", () => oe("/api/linear/issues").then((_) => c(Array.isArray(_) ? _ : []))), tt = (_, E = "") => ie("Manual issue created", () => Ko(_, E).then((S) => {
    S.issueId && Oe(S.issueId);
  })), qe = (_, E = "") => ie(`Enqueued ${_}`, () => Xo(_, E).then((S) => {
    S.issueId && Oe(S.issueId);
  }).then(() => oe("/api/linear/issues")).then((S) => c(Array.isArray(S) ? S : []))), nt = () => {
    if (H) {
      P("Sending desktop companion notification…"), qa("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test").then(() => P("Desktop companion notification sent")).catch(() => P("Desktop companion notification failed"));
      return;
    }
    if (!In()) {
      C("unsupported");
      return;
    }
    window.Notification.requestPermission().then((_) => C(_));
  }, yt = (_) => {
    u(_), f(null), Xe(_);
  }, at = (_) => {
    _.preventDefault(), document.body.classList.add("forge-v3-resizing-detail");
    const E = (O) => Y(Qa(window.innerWidth - O.clientX)), S = () => {
      document.body.classList.remove("forge-v3-resizing-detail"), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", S), window.removeEventListener("pointercancel", S);
    };
    window.addEventListener("pointermove", E), window.addEventListener("pointerup", S), window.addEventListener("pointercancel", S);
  };
  K(() => {
    document.documentElement.style.setProperty("--panel-w", `${B}px`), window.localStorage.setItem(ja, String(B));
  }, [B]), K(() => {
    J.current = g;
  }, [g]), K(() => {
    if (!p || p.endsWith("…")) return;
    const _ = window.setTimeout(() => P(""), 3500);
    return () => window.clearTimeout(_);
  }, [p]), K(() => {
    let _ = !1;
    return zo().then((E) => {
      if (_) return;
      const S = !!E.notifications;
      x.current = S, M(S);
    }).catch(() => {
      _ || (x.current = !1, M(!1));
    }), () => {
      _ = !0;
    };
  }, []), K(() => {
    const _ = (E) => {
      (E.metaKey || E.ctrlKey) && E.key.toLowerCase() === "k" && (E.preventDefault(), b((S) => !S)), E.key === "Escape" && b(!1);
    };
    return window.addEventListener("keydown", _), () => window.removeEventListener("keydown", _);
  }, []), K(() => {
    const _ = () => {
      const E = Ft();
      u(E.view), f(E.issueId), U(E.addIssue), (E.decisionId || E.panel === "review") && h((S) => S + 1);
    };
    return window.addEventListener("hashchange", _), window.addEventListener("popstate", _), () => {
      window.removeEventListener("hashchange", _), window.removeEventListener("popstate", _);
    };
  }, []), K(() => {
    let _ = !1;
    const E = () => {
      fe().catch(() => {
        _ || a(ca);
      });
    };
    E(), oe("/api/linear/issues").then((O) => {
      _ || c(Array.isArray(O) ? O : []);
    }).catch(() => {
    });
    const S = window.setInterval(E, W === "offline" ? 1e4 : 3e4);
    return () => {
      _ = !0, window.clearInterval(S);
    };
  }, [W]), K(() => {
    if (Me()) return;
    let _ = !1;
    const E = new EventSource("/api/events"), S = (O) => {
      const D = J.current, j = ne(he.current, D);
      fe().then((Z) => {
        D && (O.type !== "tick" || ne(Z, D) !== j) && R((ve) => ve + 1);
      }).catch(() => {
      });
    };
    return E.onopen = () => {
      _ || X("live");
    }, E.onerror = () => {
      _ || X("offline");
    }, ["tick", "issue_added", "issue_removed", "decision_resolved"].forEach((O) => {
      E.addEventListener(O, S);
    }), () => {
      _ = !0, E.close();
    };
  }, []);
  const Be = g ? r.issues.find((_) => _.id === g) ?? null : null;
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
        pt.slice(0, 2).map(
          (_) => t(
            "button",
            { key: _.key, type: "button", class: `forge-v3-nav-item ${y === _.key ? "active" : ""}`, "data-view": _.key, onClick: () => {
              u(_.key), f(null), Xe(_.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, _.icon),
            t("span", { class: "forge-v3-nav-label" }, _.label),
            _.key === "queue" && n.awaitingDecisionsCount > 0 ? t("span", { class: "forge-v3-nav-badge", "aria-label": `${n.awaitingDecisionsCount} pending decisions` }, String(n.awaitingDecisionsCount)) : _.key === "archive" ? t("span", { class: "forge-v3-nav-count" }, String(n.archiveCount)) : null
          )
        ),
        t("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => b(!0) }, t("span", { class: "forge-v3-nav-icon" }, "⌘"), t("span", { class: "forge-v3-nav-label" }, "Command palette"), t("kbd", null, "⌘K")),
        pt.slice(2).map(
          (_) => t(
            "button",
            { key: _.key, type: "button", class: `forge-v3-nav-item ${y === _.key ? "active" : ""}`, "data-view": _.key, onClick: () => {
              u(_.key), f(null), Xe(_.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, _.icon),
            t("span", { class: "forge-v3-nav-label" }, _.label),
            _.key === "learnings" && n.learningSuggestionsCount > 0 ? t("span", { class: "forge-v3-nav-count" }, String(n.learningSuggestionsCount)) : null
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
            Array.from({ length: Math.max(n.concurrencyLimit, n.runningAgentsCount) }).slice(0, 8).map((_, E) => t("span", { class: E < n.runningAgentsCount ? "active" : "" }))
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
        t("div", { class: `forge-v3-session-chip event-${W}` }, W === "live" ? "● Live events" : W === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        t("button", { type: "button", class: `forge-v3-notification-toggle ${H ? "desktop" : "browser"}`, disabled: !H && (k === "unsupported" || k === "denied" || k === "granted"), onClick: nt }, H ? "🔔 Desktop companion" : k === "granted" ? "🔔 Browser notifications on" : k === "denied" ? "🔕 Notifications blocked" : k === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        t("div", { class: "forge-v3-session-chip" }, H ? "● Native notifications available" : "○ Browser notification fallback"),
        t("div", { class: "forge-v3-session-chip" }, "● Workspace · ", n.model),
        t("div", { class: "forge-v3-model-row" }, "🤖 ", n.backend)
      )
    ),
    p ? t("div", { class: "forge-v3-action-status", role: "status" }, p) : null,
    y === "queue" ? t(oi, { issues: r.issues, decisions: r.decisions, linearBacklog: l, selectedIssueId: g, addIssueOpen: $, onOpenIssue: Oe, onIssueAction: w, onResolveDecision: be, onReviewNext: Te, onReviewIssue: ye, onAddIssue: Fe, onCloseAddIssue: jt, onRefreshLinear: ke, onCreateManualIssue: tt, onEnqueueLinear: qe }) : y === "archive" ? t(gi, null) : y === "settings" ? t(li, null) : y === "prompts" ? t(di, null) : y === "learnings" ? t(ci, null) : t("main", { class: "forge-v3-main", "data-active-view": y }, t("h1", null, ((rt = pt.find((_) => _.key === y)) == null ? void 0 : rt.label) ?? "Dashboard"), t("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    t(vi, { issueId: y === "queue" ? g : null, issuePreview: Be, reloadKey: N, autoOpenDiffKey: d, onClose: He, onPanelResizeStart: at, onIssueAction: w, onRemoveIssue: z, onLaunchRuntime: se, onStopVm: V, onSyncPrs: Re, onSubmitFeedback: Bt, onResolveDecision: be }),
    t(ri, { open: v, decisions: r.decisions, onClose: () => b(!1), onNavigate: yt, onRefresh: () => fe(), onOpenIssue: Oe, onReviewNext: Te, onAddIssue: Fe, onStopVm: V }),
    t(ai, { status: n, onStopVm: V })
  );
}
const an = document.getElementById("forge-react-root");
an && (Ue(t(bi, null), an), an.dataset.reactiveDashboardMounted = "true");
