var Jt, O, Wa, He, na, Da, Oa, ln, Wt, kt, Fa, Nn, _n, mn, Ut = {}, Vt = [], Fr = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, wt = Array.isArray;
function xe(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function Pn(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function t(e, n, a) {
  var r, s, l, c = {};
  for (l in n) l == "key" ? r = n[l] : l == "ref" ? s = n[l] : c[l] = n[l];
  if (arguments.length > 2 && (c.children = arguments.length > 3 ? Jt.call(arguments, 2) : a), typeof e == "function" && e.defaultProps != null) for (l in e.defaultProps) c[l] === void 0 && (c[l] = e.defaultProps[l]);
  return Dt(e, c, r, s, null);
}
function Dt(e, n, a, r, s) {
  var l = { type: e, props: n, key: a, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: s ?? ++Wa, __i: -1, __u: 0 };
  return s == null && O.vnode != null && O.vnode(l), l;
}
function ot(e) {
  return e.children;
}
function Ge(e, n) {
  this.props = e, this.context = n;
}
function it(e, n) {
  if (n == null) return e.__ ? it(e.__, e.__i + 1) : null;
  for (var a; n < e.__k.length; n++) if ((a = e.__k[n]) != null && a.__e != null) return a.__e;
  return typeof e.type == "function" ? it(e) : null;
}
function Mr(e) {
  if (e.__P && e.__d) {
    var n = e.__v, a = n.__e, r = [], s = [], l = xe({}, n);
    l.__v = n.__v + 1, O.vnode && O.vnode(l), Rn(e.__P, l, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [a] : null, r, a ?? it(n), !!(32 & n.__u), s), l.__v = n.__v, l.__.__k[l.__i] = l, qa(r, l, s), n.__e = n.__ = null, l.__e != a && Ma(l);
  }
}
function Ma(e) {
  if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(n) {
    if (n != null && n.__e != null) return e.__e = e.__c.base = n.__e;
  }), Ma(e);
}
function aa(e) {
  (!e.__d && (e.__d = !0) && He.push(e) && !Ht.__r++ || na != O.debounceRendering) && ((na = O.debounceRendering) || Da)(Ht);
}
function Ht() {
  try {
    for (var e, n = 1; He.length; ) He.length > n && He.sort(Oa), e = He.shift(), n = He.length, Mr(e);
  } finally {
    He.length = Ht.__r = 0;
  }
}
function Ua(e, n, a, r, s, l, c, p, f, d, h) {
  var k, u, y, v, b, S, W, I = r && r.__k || Vt, D = n.length;
  for (f = Ur(a, n, I, f, D), k = 0; k < D; k++) (y = a.__k[k]) != null && (u = y.__i != -1 && I[y.__i] || Ut, y.__i = k, S = Rn(e, y, u, s, l, c, p, f, d, h), v = y.__e, y.ref && u.ref != y.ref && (u.ref && Sn(u.ref, null, y), h.push(y.ref, y.__c || v, y)), b == null && v != null && (b = v), (W = !!(4 & y.__u)) || u.__k === y.__k ? (f = Va(y, f, e, W), W && u.__e && (u.__e = null)) : typeof y.type == "function" && S !== void 0 ? f = S : v && (f = v.nextSibling), y.__u &= -7);
  return a.__e = b, f;
}
function Ur(e, n, a, r, s) {
  var l, c, p, f, d, h = a.length, k = h, u = 0;
  for (e.__k = new Array(s), l = 0; l < s; l++) (c = n[l]) != null && typeof c != "boolean" && typeof c != "function" ? (typeof c == "string" || typeof c == "number" || typeof c == "bigint" || c.constructor == String ? c = e.__k[l] = Dt(null, c, null, null, null) : wt(c) ? c = e.__k[l] = Dt(ot, { children: c }, null, null, null) : c.constructor === void 0 && c.__b > 0 ? c = e.__k[l] = Dt(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v) : e.__k[l] = c, f = l + u, c.__ = e, c.__b = e.__b + 1, p = null, (d = c.__i = Vr(c, a, f, k)) != -1 && (k--, (p = a[d]) && (p.__u |= 2)), p == null || p.__v == null ? (d == -1 && (s > h ? u-- : s < h && u++), typeof c.type != "function" && (c.__u |= 4)) : d != f && (d == f - 1 ? u-- : d == f + 1 ? u++ : (d > f ? u-- : u++, c.__u |= 4))) : e.__k[l] = null;
  if (k) for (l = 0; l < h; l++) (p = a[l]) != null && (2 & p.__u) == 0 && (p.__e == r && (r = it(p)), ja(p, p));
  return r;
}
function Va(e, n, a, r) {
  var s, l;
  if (typeof e.type == "function") {
    for (s = e.__k, l = 0; s && l < s.length; l++) s[l] && (s[l].__ = e, n = Va(s[l], n, a, r));
    return n;
  }
  e.__e != n && (r && (n && e.type && !n.parentNode && (n = it(e)), a.insertBefore(e.__e, n || null)), n = e.__e);
  do
    n = n && n.nextSibling;
  while (n != null && n.nodeType == 8);
  return n;
}
function qt(e, n) {
  return n = n || [], e == null || typeof e == "boolean" || (wt(e) ? e.some(function(a) {
    qt(a, n);
  }) : n.push(e)), n;
}
function Vr(e, n, a, r) {
  var s, l, c, p = e.key, f = e.type, d = n[a], h = d != null && (2 & d.__u) == 0;
  if (d === null && p == null || h && p == d.key && f == d.type) return a;
  if (r > (h ? 1 : 0)) {
    for (s = a - 1, l = a + 1; s >= 0 || l < n.length; ) if ((d = n[c = s >= 0 ? s-- : l++]) != null && (2 & d.__u) == 0 && p == d.key && f == d.type) return c;
  }
  return -1;
}
function ra(e, n, a) {
  n[0] == "-" ? e.setProperty(n, a ?? "") : e[n] = a == null ? "" : typeof a != "number" || Fr.test(n) ? a : a + "px";
}
function xt(e, n, a, r, s) {
  var l, c;
  e: if (n == "style") if (typeof a == "string") e.style.cssText = a;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (n in r) a && n in a || ra(e.style, n, "");
    if (a) for (n in a) r && a[n] == r[n] || ra(e.style, n, a[n]);
  }
  else if (n[0] == "o" && n[1] == "n") l = n != (n = n.replace(Fa, "$1")), c = n.toLowerCase(), n = c in e || n == "onFocusOut" || n == "onFocusIn" ? c.slice(2) : n.slice(2), e.l || (e.l = {}), e.l[n + l] = a, a ? r ? a[kt] = r[kt] : (a[kt] = Nn, e.addEventListener(n, l ? mn : _n, l)) : e.removeEventListener(n, l ? mn : _n, l);
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
function oa(e) {
  return function(n) {
    if (this.l) {
      var a = this.l[n.type + e];
      if (n[Wt] == null) n[Wt] = Nn++;
      else if (n[Wt] < a[kt]) return;
      return a(O.event ? O.event(n) : n);
    }
  };
}
function Rn(e, n, a, r, s, l, c, p, f, d) {
  var h, k, u, y, v, b, S, W, I, D, $, M, F, q, te, Y, U = n.type;
  if (n.constructor !== void 0) return null;
  128 & a.__u && (f = !!(32 & a.__u), l = [p = n.__e = a.__e]), (h = O.__b) && h(n);
  e: if (typeof U == "function") {
    k = c.length;
    try {
      if (I = n.props, D = U.prototype && U.prototype.render, $ = (h = U.contextType) && r[h.__c], M = h ? $ ? $.props.value : h.__ : r, a.__c ? W = (u = n.__c = a.__c).__ = u.__E : (D ? n.__c = u = new U(I, M) : (n.__c = u = new Ge(I, M), u.constructor = U, u.render = qr), $ && $.sub(u), u.state || (u.state = {}), u.__n = r, y = u.__d = !0, u.__h = [], u._sb = []), D && u.__s == null && (u.__s = u.state), D && U.getDerivedStateFromProps != null && (u.__s == u.state && (u.__s = xe({}, u.__s)), xe(u.__s, U.getDerivedStateFromProps(I, u.__s))), v = u.props, b = u.state, u.__v = n, y) D && U.getDerivedStateFromProps == null && u.componentWillMount != null && u.componentWillMount(), D && u.componentDidMount != null && u.__h.push(u.componentDidMount);
      else {
        if (D && U.getDerivedStateFromProps == null && I !== v && u.componentWillReceiveProps != null && u.componentWillReceiveProps(I, M), n.__v == a.__v || !u.__e && u.shouldComponentUpdate != null && u.shouldComponentUpdate(I, u.__s, M) === !1) {
          n.__v != a.__v && (u.props = I, u.state = u.__s, u.__d = !1), n.__e = a.__e, n.__k = a.__k, n.__k.some(function(N) {
            N && (N.__ = n);
          }), Vt.push.apply(u.__h, u._sb), u._sb = [], u.__h.length && c.push(u);
          break e;
        }
        u.componentWillUpdate != null && u.componentWillUpdate(I, u.__s, M), D && u.componentDidUpdate != null && u.__h.push(function() {
          u.componentDidUpdate(v, b, S);
        });
      }
      if (u.context = M, u.props = I, u.__P = e, u.__e = !1, F = O.__r, q = 0, D) u.state = u.__s, u.__d = !1, F && F(n), h = u.render(u.props, u.state, u.context), Vt.push.apply(u.__h, u._sb), u._sb = [];
      else do
        u.__d = !1, F && F(n), h = u.render(u.props, u.state, u.context), u.state = u.__s;
      while (u.__d && ++q < 25);
      u.state = u.__s, u.getChildContext != null && (r = xe(xe({}, r), u.getChildContext())), D && !y && u.getSnapshotBeforeUpdate != null && (S = u.getSnapshotBeforeUpdate(v, b)), te = h != null && h.type === ot && h.key == null ? Ba(h.props.children) : h, p = Ua(e, wt(te) ? te : [te], n, a, r, s, l, c, p, f, d), u.base = n.__e, n.__u &= -161, u.__h.length && c.push(u), W && (u.__E = u.__ = null);
    } catch (N) {
      if (c.length = k, n.__v = null, f || l != null) {
        if (N.then) {
          for (n.__u |= f ? 160 : 128; p && p.nodeType == 8 && p.nextSibling; ) p = p.nextSibling;
          l != null && (l[l.indexOf(p)] = null), n.__e = p;
        } else if (l != null) for (Y = l.length; Y--; ) Pn(l[Y]);
      } else n.__e = a.__e;
      n.__k == null && (n.__k = a.__k || []), N.then || Ha(n), O.__e(N, n, a);
    }
  } else l == null && n.__v == a.__v ? (n.__k = a.__k, n.__e = a.__e) : p = n.__e = Hr(a.__e, n, a, r, s, l, c, f, d);
  return (h = O.diffed) && h(n), 128 & n.__u ? void 0 : p;
}
function Ha(e) {
  e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(Ha));
}
function qa(e, n, a) {
  for (var r = 0; r < a.length; r++) Sn(a[r], a[++r], a[++r]);
  O.__c && O.__c(n, e), e.some(function(s) {
    try {
      e = s.__h, s.__h = [], e.some(function(l) {
        l.call(s);
      });
    } catch (l) {
      O.__e(l, s.__v);
    }
  });
}
function Ba(e) {
  return typeof e != "object" || e == null || e.__b > 0 ? e : wt(e) ? e.map(Ba) : e.constructor !== void 0 ? null : xe({}, e);
}
function Hr(e, n, a, r, s, l, c, p, f) {
  var d, h, k, u, y, v, b, S = a.props || Ut, W = n.props, I = n.type;
  if (I == "svg" ? s = "http://www.w3.org/2000/svg" : I == "math" ? s = "http://www.w3.org/1998/Math/MathML" : s || (s = "http://www.w3.org/1999/xhtml"), l != null) {
    for (d = 0; d < l.length; d++) if ((y = l[d]) && "setAttribute" in y == !!I && (I ? y.localName == I : y.nodeType == 3)) {
      e = y, l[d] = null;
      break;
    }
  }
  if (e == null) {
    if (I == null) return document.createTextNode(W);
    e = document.createElementNS(s, I, W.is && W), p && (O.__m && O.__m(n, l), p = !1), l = null;
  }
  if (I == null) S === W || p && e.data == W || (e.data = W);
  else {
    if (l = I == "textarea" && W.defaultValue != null ? null : l && Jt.call(e.childNodes), !p && l != null) for (S = {}, d = 0; d < e.attributes.length; d++) S[(y = e.attributes[d]).name] = y.value;
    for (d in S) y = S[d], d == "dangerouslySetInnerHTML" ? k = y : d == "children" || d in W || d == "value" && "defaultValue" in W || d == "checked" && "defaultChecked" in W || xt(e, d, null, y, s);
    for (d in W) y = W[d], d == "children" ? u = y : d == "dangerouslySetInnerHTML" ? h = y : d == "value" ? v = y : d == "checked" ? b = y : p && typeof y != "function" || S[d] === y || xt(e, d, y, S[d], s);
    if (h) p || k && (h.__html == k.__html || h.__html == e.innerHTML) || (e.innerHTML = h.__html), n.__k = [];
    else if (k && (e.innerHTML = ""), Ua(n.type == "template" ? e.content : e, wt(u) ? u : [u], n, a, r, I == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s, l, c, l ? l[0] : a.__k && it(a, 0), p, f), l != null) for (d = l.length; d--; ) Pn(l[d]);
    p && I != "textarea" || (d = "value", I == "progress" && v == null ? e.removeAttribute("value") : v != null && (v !== e[d] || I == "progress" && !v || I == "option" && v != S[d]) && xt(e, d, v, S[d], s), d = "checked", b != null && b != e[d] && xt(e, d, b, S[d], s));
  }
  return e;
}
function Sn(e, n, a) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && n == null || (e.__u = e(n));
    } else e.current = n;
  } catch (s) {
    O.__e(s, a);
  }
}
function ja(e, n, a) {
  var r, s;
  if (O.unmount && O.unmount(e), (r = e.ref) && (r.current && r.current != e.__e || Sn(r, null, n)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (l) {
      O.__e(l, n);
    }
    r.base = r.__P = r.__n = null;
  }
  if (r = e.__k) for (s = 0; s < r.length; s++) r[s] && ja(r[s], n, a || typeof e.type != "function");
  a || Pn(e.__e), e.__c = e.__ = e.__e = void 0;
}
function qr(e, n, a) {
  return this.constructor(e, a);
}
function Qe(e, n, a) {
  var r, s, l, c;
  n == document && (n = document.documentElement), O.__ && O.__(e, n), s = (r = !1) ? null : n.__k, l = [], c = [], Rn(n, e = n.__k = t(ot, null, [e]), s || Ut, Ut, n.namespaceURI, s ? null : n.firstChild ? Jt.call(n.childNodes) : null, l, s ? s.__e : n.firstChild, r, c), qa(l, e, c), e.props.children = null;
}
Jt = Vt.slice, O = { __e: function(e, n, a, r) {
  for (var s, l, c; n = n.__; ) if ((s = n.__c) && !s.__) try {
    if ((l = s.constructor) && l.getDerivedStateFromError != null && (s.setState(l.getDerivedStateFromError(e)), c = s.__d), s.componentDidCatch != null && (s.componentDidCatch(e, r || {}), c = s.__d), c) return s.__E = s;
  } catch (p) {
    e = p;
  }
  throw e;
} }, Wa = 0, Ge.prototype.setState = function(e, n) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = xe({}, this.state), typeof e == "function" && (e = e(xe({}, a), this.props)), e && xe(a, e), e != null && this.__v && (n && this._sb.push(n), aa(this));
}, Ge.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), aa(this));
}, Ge.prototype.render = ot, He = [], Da = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Oa = function(e, n) {
  return e.__v.__b - n.__v.__b;
}, Ht.__r = 0, ln = Math.random().toString(8), Wt = "__d" + ln, kt = "__a" + ln, Fa = /(PointerCapture)$|Capture$/i, Nn = 0, _n = oa(!1), mn = oa(!0);
var At, ee, cn, ia, Bt = 0, Xa = [], re = O, sa = re.__b, la = re.__r, ca = re.diffed, da = re.__c, ua = re.unmount, fa = re.__;
function Tn(e, n) {
  re.__h && re.__h(ee, e, Bt || n), Bt = 0;
  var a = ee.__H || (ee.__H = { __: [], __h: [] });
  return e >= a.__.length && a.__.push({}), a.__[e];
}
function E(e) {
  return Bt = 1, Br(Qa, e);
}
function Br(e, n, a) {
  var r = Tn(At++, 2);
  if (r.t = e, !r.__c && (r.__ = [a ? a(n) : Qa(void 0, n), function(p) {
    var f = r.__N ? r.__N[0] : r.__[0], d = r.t(f, p);
    f !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = ee, !ee.__f)) {
    var s = function(p, f, d) {
      if (!r.__c.__H) return !0;
      var h = !1, k = r.__c.props !== p;
      if (r.__c.__H.__.some(function(y) {
        if (y.__N) {
          h = !0;
          var v = y.__[0];
          y.__ = y.__N, y.__N = void 0, v !== y.__[0] && (k = !0);
        }
      }), l) {
        var u = l.call(this, p, f, d);
        return h ? u || k : u;
      }
      return !h || k;
    };
    ee.__f = !0;
    var l = ee.shouldComponentUpdate, c = ee.componentWillUpdate;
    ee.componentWillUpdate = function(p, f, d) {
      if (this.__e) {
        var h = l;
        l = void 0, s(p, f, d), l = h;
      }
      c && c.call(this, p, f, d);
    }, ee.shouldComponentUpdate = s;
  }
  return r.__N || r.__;
}
function z(e, n) {
  var a = Tn(At++, 3);
  !re.__s && Ka(a.__H, n) && (a.__ = e, a.u = n, ee.__H.__h.push(a));
}
function qe(e) {
  return Bt = 5, mt(function() {
    return { current: e };
  }, []);
}
function mt(e, n) {
  var a = Tn(At++, 7);
  return Ka(a.__H, n) && (a.__ = e(), a.__H = n, a.__h = e), a.__;
}
function jr() {
  for (var e; e = Xa.shift(); ) {
    var n = e.__H;
    if (e.__P && n) try {
      n.__h.some(Ot), n.__h.some(hn), n.__h = [];
    } catch (a) {
      n.__h = [], re.__e(a, e.__v);
    }
  }
}
re.__b = function(e) {
  ee = null, sa && sa(e);
}, re.__ = function(e, n) {
  e && n.__k && n.__k.__m && (e.__m = n.__k.__m), fa && fa(e, n);
}, re.__r = function(e) {
  la && la(e), At = 0;
  var n = (ee = e.__c).__H;
  n && (cn === ee ? (n.__h = [], ee.__h = [], n.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (n.__h.some(Ot), n.__h.some(hn), n.__h = [], At = 0)), cn = ee;
}, re.diffed = function(e) {
  ca && ca(e);
  var n = e.__c;
  n && n.__H && (n.__H.__h.length && (Xa.push(n) !== 1 && ia === re.requestAnimationFrame || ((ia = re.requestAnimationFrame) || Xr)(jr)), n.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), cn = ee = null;
}, re.__c = function(e, n) {
  n.some(function(a) {
    try {
      a.__h.some(Ot), a.__h = a.__h.filter(function(r) {
        return !r.__ || hn(r);
      });
    } catch (r) {
      n.some(function(s) {
        s.__h && (s.__h = []);
      }), n = [], re.__e(r, a.__v);
    }
  }), da && da(e, n);
}, re.unmount = function(e) {
  ua && ua(e);
  var n, a = e.__c;
  a && a.__H && (a.__H.__.some(function(r) {
    try {
      Ot(r);
    } catch (s) {
      n = s;
    }
  }), a.__H = void 0, n && re.__e(n, a.__v));
};
var pa = typeof requestAnimationFrame == "function";
function Xr(e) {
  var n, a = function() {
    clearTimeout(r), pa && cancelAnimationFrame(n), setTimeout(e);
  }, r = setTimeout(a, 35);
  pa && (n = requestAnimationFrame(a));
}
function Ot(e) {
  var n = ee, a = e.__c;
  typeof a == "function" && (e.__c = void 0, a()), ee = n;
}
function hn(e) {
  var n = ee;
  e.__c = e.__(), ee = n;
}
function Ka(e, n) {
  return !e || e.length !== n.length || n.some(function(a, r) {
    return a !== e[r];
  });
}
function Qa(e, n) {
  return typeof n == "function" ? n(e) : n;
}
function Kr(e, n) {
  for (var a in n) e[a] = n[a];
  return e;
}
function bn(e, n) {
  for (var a in e) if (a !== "__source" && !(a in n)) return !0;
  for (var r in n) if (r !== "__source" && e[r] !== n[r]) return !0;
  return !1;
}
function ga(e, n) {
  this.props = e, this.context = n;
}
function Qr(e, n) {
  function a(s) {
    var l = this.props.ref;
    return l != s.ref && l && (typeof l == "function" ? l(null) : l.current = null), n ? !n(this.props, s) || l != s.ref : bn(this.props, s);
  }
  function r(s) {
    return this.shouldComponentUpdate = a, t(e, s);
  }
  return r.displayName = "Memo(" + (e.displayName || e.name) + ")", r.__f = r.prototype.isReactComponent = !0, r.type = e, r;
}
(ga.prototype = new Ge()).isPureReactComponent = !0, ga.prototype.shouldComponentUpdate = function(e, n) {
  return bn(this.props, e) || bn(this.state, n);
};
var va = O.__b;
O.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), va && va(e);
};
var Jr = O.__e;
O.__e = function(e, n, a, r) {
  if (e.then) {
    for (var s, l = n; l = l.__; ) if ((s = l.__c) && s.__c) return n.__e == null && (n.__e = a.__e, n.__k = a.__k || []), s.__c(e, n);
  }
  Jr(e, n, a, r);
};
var _a = O.unmount;
function Ja(e, n, a) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), e.__c.__H = null), (e = Kr({}, e)).__c != null && (e.__c.__P === a && (e.__c.__P = n), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(r) {
    return Ja(r, n, a);
  })), e;
}
function za(e, n, a) {
  return e && a && (e.__v = null, e.__k = e.__k && e.__k.map(function(r) {
    return za(r, n, a);
  }), e.__c && e.__c.__P === n && (e.__e && a.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = a)), e;
}
function dn() {
  this.__u = 0, this.o = null, this.__b = null;
}
function Ya(e) {
  var n = e.__ && e.__.__c;
  return n && n.__a && n.__a(e);
}
function Gt() {
  this.i = null, this.l = null;
}
O.unmount = function(e) {
  var n = e.__c;
  n && (n.__z = !0), n && n.__R && n.__R(), n && 32 & e.__u && (e.type = null), _a && _a(e);
}, (dn.prototype = new Ge()).__c = function(e, n) {
  var a = n.__c, r = this;
  r.o == null && (r.o = []), r.o.push(a);
  var s = Ya(r.__v), l = !1, c = function() {
    l || r.__z || (l = !0, a.__R = null, s ? s(f) : f());
  };
  a.__R = c;
  var p = a.__P;
  a.__P = null;
  var f = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var d = r.state.__a;
        r.__v.__k[0] = za(d, d.__c.__P, d.__c.__O);
      }
      var h;
      for (r.setState({ __a: r.__b = null }); h = r.o.pop(); ) h.__P = p, h.forceUpdate();
    }
  };
  r.__u++ || 32 & n.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), e.then(c, c);
}, dn.prototype.componentWillUnmount = function() {
  this.o = [];
}, dn.prototype.render = function(e, n) {
  if (this.__b) {
    if (this.__v.__k) {
      var a = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = Ja(this.__b, a, r.__O = r.__P);
    }
    this.__b = null;
  }
  var s = n.__a && t(ot, null, e.fallback);
  return s && (s.__u &= -33), [t(ot, null, n.__a ? null : e.children), s];
};
var ma = function(e, n, a) {
  if (++a[1] === a[0] && e.l.delete(n), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (a = e.i; a; ) {
    for (; a.length > 3; ) a.pop()();
    if (a[1] < a[0]) break;
    e.i = a = a[2];
  }
};
(Gt.prototype = new Ge()).__a = function(e) {
  var n = this, a = Ya(n.__v), r = n.l.get(e);
  return r[0]++, function(s) {
    var l = function() {
      n.props.revealOrder ? (r.push(s), ma(n, e, r)) : s();
    };
    a ? a(l) : l();
  };
}, Gt.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var n = qt(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && n.reverse();
  for (var a = n.length; a--; ) this.l.set(n[a], this.i = [1, 0, this.i]);
  return e.children;
}, Gt.prototype.componentDidUpdate = Gt.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(n, a) {
    ma(e, a, n);
  });
};
var zr = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Yr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Zr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, eo = /[A-Z0-9]/g, to = typeof document < "u", no = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
Ge.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty(Ge.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(n) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: n });
  } });
});
var ha = O.event;
O.event = function(e) {
  return ha && (e = ha(e)), e.persist = function() {
  }, e.isPropagationStopped = function() {
    return this.cancelBubble;
  }, e.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, e.nativeEvent = e;
};
var ao = { configurable: !0, get: function() {
  return this.class;
} }, ba = O.vnode;
O.vnode = function(e) {
  typeof e.type == "string" && (function(n) {
    var a = n.props, r = n.type, s = {}, l = r.indexOf("-") == -1;
    for (var c in a) {
      var p = a[c];
      if (!(c === "value" && "defaultValue" in a && p == null || to && c === "children" && r === "noscript" || c === "class" || c === "className")) {
        var f = c.toLowerCase();
        c === "defaultValue" && "value" in a && a.value == null ? c = "value" : c === "download" && p === !0 ? p = "" : f === "translate" && p === "no" ? p = !1 : f[0] === "o" && f[1] === "n" ? f === "ondoubleclick" ? c = "ondblclick" : f !== "onchange" || r !== "input" && r !== "textarea" || no(a.type) ? f === "onfocus" ? c = "onfocusin" : f === "onblur" ? c = "onfocusout" : Zr.test(c) && (c = f) : f = c = "oninput" : l && Yr.test(c) ? c = c.replace(eo, "-$&").toLowerCase() : p === null && (p = void 0), f === "oninput" && s[c = f] && (c = "oninputCapture"), s[c] = p;
      }
    }
    r == "select" && (s.multiple && Array.isArray(s.value) && (s.value = qt(a.children).forEach(function(d) {
      d.props.selected = s.value.indexOf(d.props.value) != -1;
    })), s.defaultValue != null && (s.value = qt(a.children).forEach(function(d) {
      d.props.selected = s.multiple ? s.defaultValue.indexOf(d.props.value) != -1 : s.defaultValue == d.props.value;
    }))), a.class && !a.className ? (s.class = a.class, Object.defineProperty(s, "className", ao)) : a.className && (s.class = s.className = a.className), n.props = s;
  })(e), e.$$typeof = zr, ba && ba(e);
};
var ka = O.__r;
O.__r = function(e) {
  ka && ka(e), e.__c;
};
var ya = O.diffed;
O.diffed = function(e) {
  ya && ya(e);
  var n = e.props, a = e.__e;
  a != null && e.type === "textarea" && "value" in n && n.value !== a.value && (a.value = n.value == null ? "" : n.value);
};
const yt = [
  { label: "Queue", key: "queue", hint: "Pipeline", icon: "⚡" },
  { label: "Archive", key: "archive", hint: "Completed", icon: "🗃️" },
  { label: "Settings", key: "settings", hint: "Runtime", icon: "⚙️" },
  { label: "Agent Prompts", key: "prompts", hint: "System prompts", icon: "📖" },
  { label: "Learnings", key: "learnings", hint: "Reflections", icon: "🧠" }
], kn = [
  { key: "available", label: "Available", states: ["PENDING"] },
  { key: "active", label: "Active", states: ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "WORKING", "AI_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "CREATING_PR", "WATCHING_PR", "IN_MERGE_QUEUE", "FIXING", "PUSHING", "REBASING"] },
  { key: "awaiting", label: "Awaiting You", states: ["AWAITING_PLAN_APPROVAL", "AWAITING_SPLIT_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "STEERING", "FAILED", "PAUSED", "IGNORED"] }
], ro = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "ask", label: "Ask" }
], zt = [
  { label: "Automation", keys: ["concurrency_limit", "scheduler_interval_seconds", "ai_review_max_rounds", "auto_retry_max", "agent_max_runtime_minutes", "forge_reuse_pi_sessions"] },
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
}, Za = {
  concurrency_limit: { label: "Max parallel issues", hint: "Maximum number of issues allowed to run agents at the same time. Lower this if your machine gets overloaded." },
  scheduler_interval_seconds: { label: "Scheduler check interval", hint: "How many seconds Forge waits between queue checks." },
  ai_review_max_rounds: { label: "AI review loop limit", hint: "Maximum coder ↔ AI reviewer loops before Forge escalates to you." },
  auto_retry_max: { label: "Automatic retry limit", hint: "Maximum automatic retries for transient git-agent and fixer failures." },
  agent_max_runtime_minutes: { label: "Agent max runtime (minutes)", hint: "Maximum time any agent (coder, fixer, etc.) can run before being killed. Default: 45." },
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
}, Ia = {
  model: "vertex-anthropic/claude-sonnet-4-5@20250929",
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
}, $t = ["planner", "plan-reviewer", "coder", "reviewer", "git-agent", "fixer", "split-planner", "splitter", "rebaser", "reflector"], yn = {
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
}, io = ["model", "default_model", ...Object.values(yn)], Cn = /* @__PURE__ */ new Set([...zt.flatMap((e) => e.keys), ...io]), so = new Set(zt.flatMap((e) => e.keys).filter((e) => Qt(e) === "number")), lo = new Set(zt.flatMap((e) => e.keys).filter((e) => Qt(e) === "checkbox")), co = /* @__PURE__ */ new Set(["runtime_mode", "vm_ssh_target", "host_path_prefix", "vm_path_prefix", "vm_frontend_staging_backend_command", "vm_backend_staging_command", "vm_command", "terminal_command", "backend", "backend_mode", "api_base_url", "dashboard_port"]), uo = [
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
}, Aa = {
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
function ko() {
  window.localStorage.setItem("forge-v3-mock-states", "1"), window.location.reload();
}
function yo() {
  window.localStorage.removeItem("forge-v3-mock-states");
  const e = new URL(window.location.href);
  e.searchParams.delete("mockStates"), e.searchParams.get("mock") === "states" && e.searchParams.delete("mock"), window.location.href = e.toString();
}
function Be(e) {
  return new Date(Date.now() - e * 6e4).toISOString();
}
const er = "forge.v3.askConversations", tr = 40;
function nr() {
  try {
    const e = JSON.parse(window.localStorage.getItem(er) || "{}");
    return e && typeof e == "object" && !Array.isArray(e) ? e : {};
  } catch {
    return {};
  }
}
function Io(e) {
  return nr()[String(e)] ?? { messages: [], input: "" };
}
function wa(e, n) {
  try {
    const a = nr(), r = (n.messages ?? []).filter((s) => (s.role === "user" || s.role === "assistant") && typeof s.text == "string").slice(-tr);
    a[String(e)] = { messages: r, input: n.input ?? "" }, window.localStorage.setItem(er, JSON.stringify(a));
  } catch {
  }
}
function ar(e) {
  return e.state === "AWAITING_PLAN_APPROVAL" ? { id: 9101, issue_id: e.id, type: "PLAN_REVIEW", issueTitle: e.title } : e.state === "AWAITING_CODE_REVIEW" ? { id: 9102, issue_id: e.id, type: "CODE_REVIEW", issueTitle: e.title } : e.state === "AWAITING_FIX_APPROVAL" ? { id: 9103, issue_id: e.id, type: "FIX_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ comments: [{ id: "c1", author: "Reviewer", body: "Please cover the empty-state path before merging.", path: "src/mock.ts", line: 3, pr_number: 4521, reviewState: "CHANGES_REQUESTED" }, { id: "ci-1", author: "CI", body: "Typecheck failure in mock review fixture.", path: "src/mock.ts", line: null, pr_number: 4521, source: "ci" }] }) } : e.state === "AWAITING_FIX_REVIEW" ? { id: 9104, issue_id: e.id, type: "FIX_REVIEW", issueTitle: e.title, artifact_ref: "fix-review" } : e.state === "AWAITING_SPLIT_APPROVAL" ? { id: 9104, issue_id: e.id, type: "SPLIT_APPROVAL", issueTitle: e.title, artifact_ref: JSON.stringify({ summary: "Split generated code review prep from dashboard polish.", proposedStack: [{ branch: "mock/review-foundation", title: "Review foundation" }, { branch: "mock/review-polish", title: "Review polish" }] }) } : null;
}
function In() {
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
function Ea(e) {
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
  const n = In().find((l) => l.id === e) ?? In()[0], a = ar(n);
  return {
    issue: n,
    plan: Ea(n),
    planContent: Ea(n),
    decisions: a ? [a] : [],
    agentRuns: [
      { id: n.id * 10 + 1, agent_type: "planner", started_at: Be(38), exit_code: 0 },
      { id: n.id * 10 + 2, agent_type: (r = n.state) != null && r.toLowerCase().includes("review") ? "reviewer" : "coder", started_at: Be(9), exit_code: ye(n) ? null : 0 }
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
  const e = In(), n = e.flatMap((a) => {
    const r = ar(a);
    return r ? [r] : [];
  });
  return {
    issues: e,
    decisions: n,
    runningAgents: e.filter(ye).map((a) => ({ issueId: a.id, state: a.state })),
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
function Ft(e) {
  if (!e.updated_at) return !1;
  const n = Ye(e.updated_at);
  return Number.isFinite(n) && Date.now() - n > 1440 * 60 * 1e3;
}
function Ye(e) {
  return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(e) && !e.endsWith("Z") && !e.includes("+") ? (/* @__PURE__ */ new Date(e.replace(" ", "T") + "Z")).getTime() : new Date(e).getTime();
}
function we(e) {
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
function Ln(e) {
  return e === 1 ? "▰▰▰" : e === 2 ? "▰▰░" : e === 3 ? "▰░░" : e === 4 ? "░░░" : "□□□";
}
function xn(e) {
  return e === 1 ? "urgent" : e === 2 ? "high" : e === 3 ? "medium" : e === 4 ? "low" : "none";
}
function Gn(e) {
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
function No(e) {
  const n = e.state ?? "";
  return n === "AWAITING_CODE_REVIEW" ? "forge-v3-state-pill pill-code" : n === "WATCHING_PR" ? "forge-v3-state-pill pill-watching" : n === "IN_MERGE_QUEUE" ? "forge-v3-state-pill pill-merge" : n === "FAILED" ? "forge-v3-state-pill pill-failed" : `forge-v3-state-pill pill-${ze(e)}`;
}
function Po(e) {
  return (e.type ?? "Decision").toLowerCase().replaceAll("_", " ");
}
function ye(e) {
  return ["SETTING_UP", "PLANNING", "AI_PLAN_REVIEWING", "SPLIT_PLANNING", "SPLITTING", "WORKING", "AI_REVIEWING", "FIXING", "PUSHING", "REBASING", "CREATING_PR"].includes(e.state ?? "");
}
function jt(e) {
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
  return e.externally_managed && n.push({ className: "forge-v3-external-badge", label: "👤 External" }), e.awaiting_review && n.push({ className: "forge-v3-awaiting-review-badge", label: "👀 Awaiting review" }), ye(e) && n.push({ className: "forge-v3-live-badge", label: "Live" }), e.updated_at && n.push({ className: `forge-v3-elapsed-badge${Ft(e) ? " long" : ""}`, label: Ft(e) ? "24h+" : we(e.updated_at) }), Ft(e) && n.push({ className: "forge-v3-stuck-indicator", label: "⚠ long" }), n;
}
function rr(e) {
  const n = e.state ?? "";
  return ["PLANNING", "SETTING_UP"].includes(n) ? [t("strong", null, "Planner"), " reading ", t("code", null, "project context"), " — exploring component structure and requirements…"] : n === "AI_PLAN_REVIEWING" ? [t("strong", null, "AI plan reviewer"), " checking scope, risks, and task sequencing…"] : n === "AWAITING_PLAN_APPROVAL" ? ["Plan ready for you — ", t("strong", null, "review tasks"), " and AI reviewer notes before approving."] : n === "WORKING" ? [t("strong", null, "Coder"), " writing changes — implementing planned code updates…"] : n === "AI_REVIEWING" ? [t("strong", null, "Reviewer"), " checking security, test coverage, and conventions…"] : n === "AWAITING_CODE_REVIEW" ? ["AI review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), ". Review changed files and tests."] : n === "REBASING" ? [t("strong", null, "Rebaser"), " updating branch history against the base branch — resolving conflicts cautiously if needed…"] : jt(e) ? ["GitHub review ", t("strong", { style: { color: "var(--emerald)" } }, "approved"), " — ready for merge queue or final checks."] : n === "FAILED" ? [t("strong", { style: { color: "var(--red)" } }, "Agent crashed"), " — inspect logs and retry."] : n === "PAUSED" ? ["Paused by user. Was in ", t("strong", null, "active"), " state."] : e.updated_at ? "Updated recently" : "Queued in Forge";
}
function Na(e) {
  var a;
  const n = we(e.updated_at ?? e.created_at);
  return ye(e) ? e.state === "AI_REVIEWING" ? `In review ${n}` : `Started ${n} ago` : (a = e.state) != null && a.startsWith("AWAITING") ? `Waiting ${n}` : e.state === "FAILED" ? `Failed ${n} ago` : e.state === "PAUSED" ? `Paused ${n} ago` : ze(e) === "available" ? `Added ${n} ago` : `Updated ${n} ago`;
}
function or(e) {
  var a;
  const n = ((a = e[0]) == null ? void 0 : a.type) ?? "";
  return n ? n.includes("PLAN") ? "plan" : n.includes("CODE") ? "code" : n === "FIX_REVIEW" ? "fix-review" : n.includes("FIX") ? "fix" : n.includes("SPLIT") ? "split" : "generic" : null;
}
function Mt(e) {
  if (!(e != null && e.artifact_ref)) return {};
  try {
    const n = JSON.parse(e.artifact_ref);
    return n && typeof n == "object" ? n : {};
  } catch {
    return { summary: e.artifact_ref };
  }
}
function fn(e) {
  return !!(e && /(?:^|[\\/])(?:plan|handoff|summary)\.md$/i.test(e.trim()));
}
function Co(e, n) {
  var p;
  const a = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), r = new RegExp(`^(#{1,6})\\s+${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), s = a.findIndex((f) => r.test(f.trim()));
  if (s < 0) return "";
  const l = ((p = a[s].match(/^\s*(#{1,6})/)) == null ? void 0 : p[1].length) ?? 1;
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
  var r, s, l, c, p, f, d, h;
  if (!e.trim()) return [];
  const n = [], a = e.split(/\n(?=###\s+)/g).filter((k) => /^###\s+/.test(k.trim()));
  for (const k of a) {
    const u = (s = (r = k.match(/^###\s+(?:Part\s+\d+\s+[—-]\s+)?(.+)$/m)) == null ? void 0 : r[1]) == null ? void 0 : s.trim(), y = (c = (l = k.match(/^[-*]\s+\*\*Branch:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : l[1]) == null ? void 0 : c.trim(), v = (f = (p = k.match(/^[-*]\s+\*\*Base:\*\*\s+`?([^`\n]+)`?/m)) == null ? void 0 : p[1]) == null ? void 0 : f.trim(), b = (h = (d = k.match(/^[-*]\s+\*\*Commits?:\*\*\s+(.+)$/m)) == null ? void 0 : d[1]) == null ? void 0 : h.replace(/`/g, "").trim();
    (u || y) && n.push({ title: u, branch: y, summary: [v ? `Base: ${v}` : null, b ? `Commits: ${b}` : null].filter(Boolean).join(" · ") || y });
  }
  return n;
}
function xo(e, n, a) {
  const r = fn(n.summary) ? void 0 : n.summary, s = fn(n.plan) ? void 0 : n.plan, l = Co(An(a), "Split Plan"), c = An(a), p = s ?? l ?? (e && fn(e.artifact_ref ?? "") ? c : void 0), f = n.proposedStack ?? n.stack ?? Lo(p);
  return {
    summary: r ?? (p ? "Review the proposed PR stack split from the split planner." : "Review the proposed PR stack split."),
    markdown: p,
    stack: f
  };
}
function vt(e, n) {
  return String(e.id ?? `${e.path ?? "comment"}-${e.line ?? n}-${n}`);
}
function ir(e) {
  const n = e.pr_number ?? e.prNumber, a = typeof n == "number" ? n : Number(String(n ?? "").replace(/^#/, ""));
  return Number.isFinite(a) && a > 0 ? a : null;
}
function Go(e, n) {
  const a = ir(e), r = a ? n.find((c) => Number(c.pr_number) === a) : null, s = r != null && r.position ? `PR ${r.position}` : "PR", l = (r == null ? void 0 : r.gt_branch) ?? (r == null ? void 0 : r.branch);
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
  const p = (f) => {
    const d = n.slice(c, f).trim();
    d && s.push({ label: l, text: d });
  };
  for (const f of r)
    p(f.index ?? c), c = (f.index ?? c) + f[0].length, l = f[2].toUpperCase() === "START" ? $o(f[1]) : null;
  return p(n.length), t(
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
  const a = e.state ?? "", r = or(n);
  return r === "plan" || a === "AWAITING_PLAN_APPROVAL" ? { icon: "📋", tone: "awaiting", title: "Plan ready for review", text: "Planner generated a plan. AI plan reviewer approved with notes for your review.", live: !1 } : r === "code" || a === "AWAITING_CODE_REVIEW" ? { icon: "⬡", tone: "awaiting", title: "Code review ready", text: "AI reviewer finished. Review the diff, then approve or request changes.", live: !1 } : r === "fix" || a === "AWAITING_FIX_APPROVAL" ? { icon: "💬", tone: "awaiting", title: "PR comments ready for review", text: "Select which comments and failures should be sent to the fixer agent.", live: !1 } : a === "AWAITING_FIX_REVIEW" ? { icon: "🔍", tone: "awaiting", title: "Fix ready for review", text: "The fixer addressed review comments. Review the diff and approve to push, or reject to send back for more changes.", live: !1 } : a === "AWAITING_SPLIT_APPROVAL" ? { icon: "⑂", tone: "awaiting", title: "Split plan ready", text: "Review the proposed PR stack split before Forge creates branch work.", live: !1 } : a === "REBASING" ? { icon: "↥", tone: "running", title: "Rebasing branch", text: "Forge is rebasing onto the base branch. If conflicts appear, the rebaser agent will resolve them carefully and stop rather than guess.", live: !0 } : jt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(a) ? { icon: "✓", tone: "running", title: "PR approved", text: e.pr_approved_at ? `GitHub review approved ${we(e.pr_approved_at)} ago. Forge is watching for merge queue and merge status.` : "GitHub review is approved. Forge is watching for merge queue and merge status.", live: !1 } : ye(e) ? { icon: "spinner", tone: "running", title: `${Ze(e)} agent running`, text: `Active for ${we(e.updated_at)} — Forge is working on this issue.`, live: !0 } : a === "FAILED" ? { icon: "!", tone: "failed", title: "Issue needs attention", text: "The last agent run failed. Review activity and retry when ready.", live: !1 } : { icon: dr(ze(e)), tone: ze(e), title: Ze(e), text: e.updated_at ? `Updated ${we(e.updated_at)} ago` : "Waiting for activity", live: !1 };
}
const Pa = ["Setup", "Plan", "Code", "Review", "PR", "Watch", "Done"];
function pe(e, n, a = `${n}s`) {
  return `${e} ${e === 1 ? n : a}`;
}
function Ve(e, n) {
  return (e ?? []).filter((a) => a.agent_type === n).length;
}
function Mo(e) {
  return (e ?? []).filter((n) => n.type === "FIX_APPROVAL").reduce((n, a) => {
    var r;
    return n + (((r = Mt(a).comments) == null ? void 0 : r.length) ?? 0);
  }, 0);
}
function Uo(e, n) {
  return (e ?? []).filter((a) => a.type === n).length;
}
function Vo(e, n) {
  var u, y, v;
  const a = (n == null ? void 0 : n.agentRuns) ?? [], r = (n == null ? void 0 : n.decisions) ?? [], s = (n == null ? void 0 : n.prStack) ?? ((u = n == null ? void 0 : n.issue) == null ? void 0 : u.prStack) ?? [], l = Ve(a, "planner"), c = Ve(a, "plan-reviewer"), p = Ve(a, "coder"), f = Ve(a, "reviewer"), d = Ve(a, "fixer"), h = Ve(a, "watcher"), k = Mo(r);
  return e === "Setup" ? { title: "Setup", summary: "Creates the worktree, branch, and project file before agent work starts.", stats: [pe(Ve(a, "setup"), "setup run"), (y = n == null ? void 0 : n.issue) != null && y.wt_path ? "Worktree ready" : "Worktree not recorded yet"] } : e === "Plan" ? { title: "Plan", summary: "Planner drafts the project plan, then the AI plan reviewer checks scope and sequencing.", stats: [pe(l, "planner pass", "planner passes"), pe(c, "AI plan review"), pe(Math.max(0, Math.min(l, c) - 1), "planner/reviewer loop")] } : e === "Code" ? { title: "Code", summary: "Coder implements the approved plan and applies requested changes from review loops.", stats: [pe(p, "coder pass", "coder passes"), pe(Math.max(0, p - 1), "rework loop")] } : e === "Review" ? { title: "Review", summary: "AI reviewer inspects the implementation before handing it to you for code review.", stats: [pe(f, "AI code review"), pe(Uo(r, "CODE_REVIEW"), "human review gate"), pe(Math.max(0, Math.min(p, f) - 1), "code/review loop")] } : e === "PR" ? { title: "PR", summary: "Git agent prepares the branch stack and opens or updates GitHub PRs.", stats: [pe(Ve(a, "git-agent"), "git-agent run"), pe(s.length, "PR"), pe(k, "PR comment/issue")] } : e === "Watch" ? { title: "Watch", summary: "Watcher polls reviews, checks, and merge state. Fixer loops run when PR feedback needs changes.", stats: [pe(h, "watch poll"), pe(d, "fix loop"), pe(k, "comment/issue routed to fixer")] } : { title: "Done", summary: "Issue is complete once Forge observes the PR stack merged and writes the summary.", stats: [((v = n == null ? void 0 : n.issue) == null ? void 0 : v.state) === "DONE" ? "Completed" : "Not completed yet"] };
}
function Ho(e) {
  return ["PENDING", "SETTING_UP"].includes(e ?? "") ? 0 : ["PLANNING", "AI_PLAN_REVIEWING", "AWAITING_PLAN_APPROVAL", "SPLIT_PLANNING", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "") ? 1 : ["WORKING", "SPLITTING"].includes(e ?? "") ? 2 : ["AI_REVIEWING", "AWAITING_CODE_REVIEW"].includes(e ?? "") ? 3 : ["CREATING_PR"].includes(e ?? "") ? 4 : ["WATCHING_PR", "AWAITING_FIX_APPROVAL", "FIXING", "AWAITING_FIX_REVIEW", "PUSHING", "REBASING", "IN_MERGE_QUEUE"].includes(e ?? "") ? 5 : e === "DONE" ? 6 : 0;
}
function qo(e) {
  return ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL"].includes(e ?? "");
}
function An(e) {
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
  return e ? ["AWAITING_CODE_REVIEW", "WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes(e.state ?? "") && !ye(e) && !e.locked_at && !e.agent_pid : !1;
}
function Jo(e) {
  return e.startsWith("+") ? "add" : e.startsWith("-") ? "del" : e.startsWith("@@") ? "hunk" : e.startsWith("diff --git") || e.startsWith("index ") || e.startsWith("---") || e.startsWith("+++") ? "meta" : "ctx";
}
function zo(e) {
  return e.startsWith("+") ? "+" : e.startsWith("-") ? "−" : "";
}
function Ra(e) {
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
  var p, f;
  const a = [...(e == null ? void 0 : e.agentRuns) ?? []].sort((d, h) => ce(h.started_at) - ce(d.started_at)), r = [...(e == null ? void 0 : e.activityLog) ?? []].sort((d, h) => ce(h.created_at) - ce(d.created_at)), s = ye(n), l = new Map(a.map((d) => [d.agent_type, d])), c = r.length ? r.map((d) => {
    var k;
    const h = l.get(d.actor ?? "") ?? ((k = d.type) != null && k.includes("agent") ? a.find((u) => u.agent_type === d.actor) : void 0);
    return { id: String(d.id ?? `${d.type}-${d.created_at}`), actor: d.actor ?? "Forge", time: d.created_at ? `${we(d.created_at)} ago` : "recent", tone: Zo(d.type, d.actor), text: ei(d), snippet: d.metadata ?? null, logUrl: ht(h == null ? void 0 : h.id) };
  }) : [
    ...s ? [{ id: "live", actor: It(((p = a[0]) == null ? void 0 : p.agent_type) ?? "agent"), time: "now", tone: "live", text: rr(n), snippet: `// live agent output
Reading files, updating the project plan, and streaming progress…`, logUrl: ht((f = a[0]) == null ? void 0 : f.id) }] : [],
    ...a.map((d) => {
      var h;
      return { id: String(d.id ?? `${d.agent_type}-${d.started_at}`), actor: It(d.agent_type), time: d.started_at ? `${we(d.started_at)} ago` : "recent", tone: d.exit_code === null ? "live" : d.exit_code && d.exit_code !== 0 ? "err" : (h = d.agent_type) != null && h.includes("review") ? "ok" : "ag", text: Yo(d), snippet: null, logUrl: ht(d.id) };
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
function pn(e) {
  return lr(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function Ke(e) {
  const n = e.replace(/^---[\s\S]*?---\s*/, "").split(`
`), a = [];
  let r = !1, s = !1, l = [];
  const c = () => {
    l.length && (a.push(`<p>${pn(l.join(" "))}</p>`), l = []);
  }, p = () => {
    r && (a.push("</ul>"), r = !1);
  };
  for (const f of n) {
    const d = f.trimEnd();
    if (d.startsWith("```")) {
      c(), p(), a.push(s ? "</code></pre>" : "<pre><code>"), s = !s;
      continue;
    }
    if (s) {
      a.push(lr(f));
      continue;
    }
    if (!d.trim()) {
      c(), p();
      continue;
    }
    const h = d.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      c(), p();
      const u = Math.min(h[1].length + 1, 4);
      a.push(`<h${u}>${pn(h[2])}</h${u}>`);
      continue;
    }
    const k = d.match(/^[-*]\s+(\[[ xX]\]\s+)?(.+)$/);
    if (k) {
      c(), r || (a.push("<ul>"), r = !0);
      const u = k[1] ? `<input type="checkbox" disabled ${k[1].toLowerCase().includes("x") ? "checked" : ""}> ` : "";
      a.push(`<li>${u}${pn(k[2])}</li>`);
      continue;
    }
    l.push(d.trim());
  }
  return c(), p(), s && a.push("</code></pre>"), a.join(`
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
  return n === "needs-me" ? ["AWAITING_PLAN_APPROVAL", "AWAITING_CODE_REVIEW", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW", "AWAITING_SPLIT_APPROVAL", "STEERING"].includes(a) : n === "running" ? ye(e) : n === "failed" ? a === "FAILED" : n === "watching-pr" ? ["WATCHING_PR", "CREATING_PR", "IN_MERGE_QUEUE"].includes(a) : n === "paused" ? ["PAUSED", "IGNORED"].includes(a) : !0;
}
function ce(e) {
  const n = e ? Ye(e) : 0;
  return Number.isFinite(n) ? n : 0;
}
function ci(e, n) {
  const a = [...e];
  return n === "newest" ? a.sort((r, s) => ce(s.created_at ?? s.updated_at) - ce(r.created_at ?? r.updated_at)) : n === "oldest" ? a.sort((r, s) => ce(r.created_at ?? r.updated_at) - ce(s.created_at ?? s.updated_at)) : n === "recently-updated" ? a.sort((r, s) => ce(s.updated_at) - ce(r.updated_at)) : a.sort((r, s) => (r.priority ?? 99) - (s.priority ?? 99) || ce(s.updated_at) - ce(r.updated_at));
}
function di(e, n) {
  var s;
  if (n === "awaiting")
    return [...e].sort((l, c) => ce(c.updated_at ?? c.created_at) - ce(l.updated_at ?? l.created_at));
  const a = ((s = kn.find((l) => l.key === n)) == null ? void 0 : s.states) ?? [], r = (l) => {
    const c = l.state ?? "";
    if (c === "FAILED") return -1;
    const p = a.indexOf(c);
    return p >= 0 ? p : Xe[c] ?? 999;
  };
  return [...e].sort(
    (l, c) => r(l) - r(c) || (l.priority ?? 99) - (c.priority ?? 99) || ce(c.updated_at) - ce(l.updated_at)
  );
}
function Sa(e, n) {
  const a = n.find((r) => r.id === e.issue_id);
  return a != null && a.state ? Xe[a.state] ?? 999 : e.type === "PLAN_REVIEW" ? Xe.AWAITING_PLAN_APPROVAL : e.type === "SPLIT_APPROVAL" ? Xe.AWAITING_SPLIT_APPROVAL : e.type === "CODE_REVIEW" ? Xe.AWAITING_CODE_REVIEW : e.type === "FIX_APPROVAL" ? Xe.AWAITING_FIX_APPROVAL : e.type === "FIX_REVIEW" ? Xe.AWAITING_FIX_REVIEW : 999;
}
function ui(e, n) {
  return [...e].sort((a, r) => {
    const s = n.find((c) => c.id === a.issue_id), l = n.find((c) => c.id === r.issue_id);
    return Sa(a, n) - Sa(r, n) || ((s == null ? void 0 : s.priority) ?? 99) - ((l == null ? void 0 : l.priority) ?? 99) || a.id - r.id;
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
async function de(e) {
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
async function Ee(e, n, a = "POST") {
  if (Je()) return { ok: !0, mock: !0, url: e, body: n, method: a };
  const r = JSON.stringify(n);
  let s = null;
  for (let c = 0; c < 3; c += 1) {
    const p = await fetch(e, {
      method: a,
      headers: { "Content-Type": "application/json" },
      body: r
    });
    if (p.ok) return await p.json();
    if (s = p, ![502, 503, 504].includes(p.status) || c === 2) break;
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
function gn(e) {
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
  return Ee(`/api/decisions/${e}/resolve`, { verdict: n, feedback: a });
}
function _i(e, n, a = {}) {
  return Ee(`/api/issues/${e}`, { action: n, ...a }, "PATCH");
}
function mi(e) {
  return gi(`/api/issues/${e}`);
}
function hi(e) {
  return Ee(`/api/issues/${e}/vm-launch`, {});
}
function bi() {
  return Ee("/api/vm/stop", {});
}
function ki(e) {
  return Ee(`/api/issues/${e}/sync-prs`, {});
}
function yi(e, n, a) {
  return Ee(`/api/issues/${e}/feedback`, { body: n, prNumber: a ?? null });
}
function Ii(e, n = "", a) {
  return Ee("/api/issues", { title: e, description: n, ...a });
}
function Ai(e, n = "", a) {
  return Ee("/api/linear/enqueue", { linearId: e, planningGuidance: n, ...a });
}
function wi() {
  return de("/api/desktop-capabilities");
}
function cr(e, n, a) {
  return Ee("/api/desktop-notify", { title: e, body: n, tag: a });
}
function $n() {
  return typeof window < "u" && "Notification" in window;
}
function Ei() {
  return $n() ? window.Notification.permission : "unsupported";
}
async function Ni(e, n, a = !1) {
  const r = Po(e) || "Forge decision needed", s = n != null && n.title ? `${n.title} needs your review` : "A Forge issue needs your review", l = `forge-decision-${e.id}`;
  if (a)
    try {
      await cr(r, s, l);
      return;
    } catch {
    }
  if (!$n() || window.Notification.permission !== "granted") return;
  const c = new window.Notification(r, { body: s, tag: l });
  c.onclick = () => {
    window.focus();
    const p = (n == null ? void 0 : n.id) ?? e.issue_id, f = new URL(window.location.href);
    f.searchParams.set("view", "queue"), f.searchParams.set("issue", String(p)), f.searchParams.set("panel", "review"), window.location.href = f.toString();
  };
}
function Pi(e, n) {
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
function Xt(e = window.location.hash) {
  const n = new URLSearchParams(window.location.search), a = n.get("view") || void 0, r = _t(n.get("issue") || void 0), s = _t(n.get("decision") || void 0), l = n.get("tab"), c = l === "activity" || l === "ask" ? l : "overview", p = n.get("panel"), f = p === "plan" || p === "diff" || p === "review" || p === "listen" || p === "jump" ? p : null, d = yt.some((S) => S.key === a) ? a : null;
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
  const h = e.replace(/^#/, "").split("/").filter(Boolean), [k, u, y, v] = h;
  return k === "issue" ? { view: "queue", issueId: _t(u), decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 } : k === "review" ? {
    view: "queue",
    issueId: _t(u),
    decisionId: y === "decision" ? _t(v) : null,
    detailTab: "overview",
    panel: "review",
    diffPath: "",
    addIssue: !1
  } : { view: yt.some((S) => S.key === k) ? k : "queue", issueId: null, decisionId: null, detailTab: "overview", panel: null, diffPath: "", addIssue: !1 };
}
function Kt(e, n = !0) {
  const a = new URL(window.location.href);
  a.hash = "";
  for (const [l, c] of Object.entries(e))
    c == null || c === !1 || c === "" ? a.searchParams.delete(l) : a.searchParams.set(l, String(c));
  const r = `${a.pathname}${a.search}${a.hash}`, s = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  r !== s && window.history[n ? "replaceState" : "pushState"]({}, "", r);
}
function rt(e, n = {}) {
  Kt({ view: e, issue: e === "queue" ? n.issueId : null, decision: n.decisionId, panel: n.decisionId ? "review" : null }, !1);
}
function Yt({ icon: e, title: n, subtitle: a, actions: r }) {
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
function Ae(e) {
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
    const c = (p) => {
      Qe(null, l), l.remove(), s(p);
    };
    Qe(t(
      "div",
      { class: "forge-v3-dialog-backdrop", role: "presentation", onMouseDown: (p) => {
        p.target === p.currentTarget && c(!1);
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
    const r = ((s = await Ae({ title: `Enqueue ${e.identifier}`, message: "Add optional planning guidance before Forge creates the plan.", label: "Planning guidance", confirmText: "Enqueue" })) == null ? void 0 : s.trim()) ?? "";
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
        t("span", { class: `forge-v3-priority-meta ${Gn(e.priority)}` }, Ln(e.priority), " ", xn(e.priority))
      )
    ),
    t("button", { type: "button", onClick: a }, "Enqueue →")
  );
}
function Ta(e) {
  e.stopPropagation();
}
function Ca(e) {
  return e.composedPath().some((n) => {
    var a;
    return n instanceof HTMLElement && !!((a = n.closest) != null && a.call(n, "button,a,input,select,textarea"));
  });
}
function Ti({ issue: e, selected: n, onOpenIssue: a, onIssueAction: r, onReviewIssue: s }) {
  const l = Eo(e), c = ze(e), p = c === "available", f = ye(e), d = e.state === "PAUSED" ? "unpause" : e.state === "FAILED" ? "retry" : "pause", h = d === "unpause" ? "Resume" : d === "retry" ? "Retry" : "Pause", k = To(e), u = oi(e), y = ri(e);
  return t(
    "article",
    { class: `forge-v3-issue-card ${n ? "selected" : ""} ${jt(e) ? "pr-approved" : ""} ${(e.prStack ?? []).some((v) => v.isInMergeQueue) ? "in-merge-queue" : ""} state-${e.state ?? "unknown"} stage-${c}`, "data-issue-id": String(e.id), tabIndex: 0, "aria-label": `Open issue ${e.linear_id ?? e.id}`, onClick: (v) => {
      Ca(v) || a(e.id);
    }, onKeyDown: (v) => {
      Ca(v) || (v.key === "Enter" || v.key === " ") && a(e.id);
    } },
    t(
      "div",
      { class: "forge-v3-ic-hover", onPointerDown: Ta },
      p ? t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
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
        } }, "Retry"),
        t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
          v.stopPropagation(), a(e.id);
        } }, "Log")
      ] : e.state === "PAUSED" ? t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
        v.stopPropagation(), r(e.id, "unpause");
      } }, "Resume") : f ? [
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
        e.state === "WATCHING_PR" && y ? t("a", { class: "forge-v3-hact", href: y, target: "_blank", rel: "noreferrer", onClick: (v) => v.stopPropagation() }, "View PR") : t("button", { class: "forge-v3-hact", type: "button", onClick: (v) => {
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
          t("span", { class: `forge-v3-priority-glyph ${Gn(e.priority)}`, "aria-label": `Priority ${xn(e.priority)}` }, Ln(e.priority))
        )
      ),
      t("h3", null, e.title ?? "Untitled issue"),
      So(e) ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Merged"), t("small", null, "finalizing")) : (e.prStack ?? []).some((v) => v.isInMergeQueue) ? t("div", { class: "forge-v3-merge-queue-banner" }, t("span", null, "⇄"), t("strong", null, "Merge queue"), t("small", null, "waiting to merge")) : jt(e) && ["WATCHING_PR", "IN_MERGE_QUEUE"].includes(e.state ?? "") ? t("div", { class: "forge-v3-approved-banner" }, t("span", null, "✓"), t("strong", null, "Approved"), t("small", null, e.pr_approved_at ? `${we(e.pr_approved_at)} ago` : "watching merge")) : null,
      t(
        "div",
        { class: "forge-v3-issue-state-row" },
        f ? t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }) : null,
        t("span", { class: No(e) }, Ze(e)),
        k.map((v) => t("span", { class: v.className }, v.label))
      ),
      p ? t("div", { class: "forge-v3-ic-meta" }, Na(e)) : [
        t("p", { class: "forge-v3-activity-snippet" }, rr(e)),
        t("div", { class: "forge-v3-ic-meta" }, Na(e), Ft(e) ? t("span", { class: "forge-v3-long-meta" }, "⚠ long") : null)
      ],
      !p && u.length ? t("div", { class: "forge-v3-pr-metadata" }, u.map((v) => t("span", { class: v.className }, v.label))) : null
    ),
    t("div", { class: "forge-v3-ic-progress forge-v3-issue-progress", "aria-hidden": "true" }, t("span", { class: "forge-v3-ic-fill", style: { width: `${l}%` } })),
    t(
      "div",
      { class: "forge-v3-issue-actions", onPointerDown: Ta },
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
const La = Qr(Ti, (e, n) => e.issue === n.issue && e.selected === n.selected);
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
function Li({ open: e, decisions: n, onClose: a, onNavigate: r, onRefresh: s, onOpenIssue: l, onReviewNext: c, onAddIssue: p, onStopVm: f, onHandoverReport: d }) {
  if (!e) return null;
  const k = [
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
    { label: "Add issue", action: p },
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
        k.map((u) => t("button", { type: "button", disabled: u.disabled, onClick: () => {
          u.disabled || (u.action(), a());
        } }, u.label))
      )
    )
  );
}
function xi({ issues: e, decisions: n, linearBacklog: a, selectedIssueId: r, addIssueOpen: s, onOpenIssue: l, onIssueAction: c, onResolveDecision: p, onReviewNext: f, onReviewIssue: d, onAddIssue: h, onCloseAddIssue: k, onRefreshLinear: u, onCreateManualIssue: y, onEnqueueLinear: v }) {
  const [b, S] = E(""), W = mt(() => {
    try {
      const P = window.localStorage.getItem("forge.v3.queuePrefs");
      if (!P) return { filter: "all", sort: "priority" };
      const j = JSON.parse(P);
      return {
        filter: ["all", "needs-me", "running", "failed", "watching-pr", "paused"].includes(j.filter) ? j.filter : "all",
        sort: ["priority", "newest", "oldest", "recently-updated"].includes(j.sort) ? j.sort : "priority"
      };
    } catch {
      return { filter: "all", sort: "priority" };
    }
  }, []), [I, D] = E(W.filter), [$, M] = E(W.sort);
  z(() => {
    try {
      window.localStorage.setItem("forge.v3.queuePrefs", JSON.stringify({ filter: I, sort: $ }));
    } catch {
    }
  }, [I, $]);
  const [F, q] = E("linear"), [te, Y] = E(""), [U, N] = E(""), [C, B] = E(""), [L, ne] = E(""), [m, A] = E(""), [x, K] = E(""), [le, me] = E(""), [ge, he] = E(""), be = mt(() => ci(
    e.filter((P) => ho(P) && si(P, b) && li(P, I)),
    $
  ), [e, b, I, $]), oe = mt(() => {
    const P = /* @__PURE__ */ new Map();
    return kn.forEach((j) => P.set(j.key, [])), be.forEach((j) => {
      var ue;
      return (ue = P.get(ze(j))) == null ? void 0 : ue.push(j);
    }), P.forEach((j, ue) => P.set(ue, di(j, ue))), P;
  }, [be]), $e = mt(() => a.filter((P) => ai(P, b)).slice(0, 12), [a, b]), We = Je(), De = () => ({ targetKind: m.trim(), targetPaths: x.trim(), avoidPaths: le.trim(), scopeNotes: ge.trim() }), ke = () => {
    A(""), K(""), me(""), he("");
  }, Ie = () => {
    const P = te.trim();
    P && (y(P, U.trim(), De()), Y(""), N(""), ke(), k());
  }, Oe = () => {
    const P = C.trim();
    P && (v(P, L.trim(), De()), B(""), ne(""), ke(), k());
  };
  return t(Et, { view: "queue", className: `forge-v3-queue-shell ${r ? "forge-v3-has-detail" : ""}` }, [
    We ? t("div", { class: "forge-v3-mock-state-banner" }, t("strong", null, "Mock state fixtures enabled"), t("span", null, "Review every Forge state without touching real issues."), t("button", { type: "button", onClick: yo }, "Exit mock data")) : null,
    t(
      "section",
      { id: "queue-toolbar", class: "forge-v3-command-center", "aria-label": "Queue toolbar" },
      t(
        "div",
        { class: "forge-v3-toolbar-actions forge-v3-left-tools" },
        t("input", { type: "search", placeholder: "Search issues, IDs, branch", "aria-label": "Search issues", value: b, onInput: (P) => S(P.target.value) }),
        t(
          "div",
          { class: "forge-v3-filter-chips", "aria-label": "Queue filters" },
          fo.map((P) => t("button", { key: P.key, type: "button", class: I === P.key ? "active" : "", onClick: () => D(P.key) }, P.label))
        )
      ),
      t(
        "div",
        { class: "forge-v3-toolbar-actions" },
        t("select", { "aria-label": "Sort issues", value: $, onChange: (P) => M(P.target.value) }, po.map((P) => t("option", { key: P.key, value: P.key }, P.label))),
        t("button", { type: "button", disabled: n.length === 0, onClick: f }, "⚡ Review next", n.length ? ` (${n.length})` : ""),
        t("button", { type: "button", title: "Refresh Linear", onClick: u }, "↻ Sync"),
        t("button", { type: "button", disabled: !0 }, "⌘ Command"),
        We ? null : t("button", { type: "button", onClick: ko }, "Mock states"),
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
          t("button", { type: "button", onClick: k, "aria-label": "Close add issue" }, "×")
        ),
        t(
          "nav",
          { class: "forge-v3-detail-tabs" },
          t("button", { type: "button", class: F === "linear" ? "active" : "", onClick: () => q("linear") }, "Linear issue"),
          t("button", { type: "button", class: F === "manual" ? "active" : "", onClick: () => q("manual") }, "Manual issue")
        ),
        t(
          "div",
          { class: "forge-v3-add-issue-body" },
          F === "linear" ? [
            t("label", null, "Linear ID", t("input", { type: "text", placeholder: "TEAM-1234", value: C, onInput: (P) => B(P.target.value) })),
            t("label", null, "Planning guidance", t("textarea", { rows: 5, placeholder: "Optional notes for the planner…", value: L, onInput: (P) => ne(P.target.value) }))
          ] : [
            t("label", null, "Title", t("input", { type: "text", placeholder: "Manual issue title", value: te, onInput: (P) => Y(P.target.value) })),
            t("label", null, "Description", t("textarea", { rows: 6, placeholder: "Optional issue description or project notes…", value: U, onInput: (P) => N(P.target.value) }))
          ],
          t(
            "div",
            { class: "forge-v3-scope-grid" },
            t("label", null, "Target kind", t("input", { type: "text", placeholder: "backend-shared, pricing-frontend, fullstack…", value: m, onInput: (P) => A(P.target.value) })),
            t("label", null, "Target paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. functions/", value: x, onInput: (P) => K(P.target.value) })),
            t("label", null, "Avoid paths", t("textarea", { rows: 2, placeholder: "One per line, e.g. frontend/apps/pricing/", value: le, onInput: (P) => me(P.target.value) })),
            t("label", null, "Scope notes", t("textarea", { rows: 2, placeholder: "Generic shared endpoint; do not describe as pricing-scoped.", value: ge, onInput: (P) => he(P.target.value) }))
          )
        ),
        t(
          "footer",
          null,
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: k }, "Cancel"),
          F === "linear" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !C.trim(), onClick: Oe }, "Enqueue Linear issue") : t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !te.trim(), onClick: Ie }, "Create manual issue")
        )
      )
    ) : null,
    t(
      "div",
      { class: "forge-v3-pipeline-wrap" },
      t(
        "section",
        { id: "pipeline-wrapper", class: "forge-v3-pipeline", "aria-label": "Issue pipeline" },
        kn.map((P) => {
          const j = oe.get(P.key) ?? [], ue = P.key === "available" ? j.length + $e.length : j.length;
          return t(
            "section",
            { key: P.key, class: "forge-v3-pipeline-column", "data-stage": P.key },
            t(
              "header",
              { class: `forge-v3-col-head ${P.key === "awaiting" ? "needs-head" : ""}` },
              t("span", { class: `forge-v3-col-label ${P.key === "awaiting" ? "needs" : ""}` }, P.key === "available" ? P.label : `${dr(P.key)} ${P.label}`),
              P.key === "available" ? t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: u }, "↻ Sync") : null,
              t("span", { class: `forge-v3-col-count ${ue && P.key === "awaiting" ? "bad" : ""}` }, String(ue))
            ),
            t(
              "div",
              { class: `forge-v3-col-cards forge-v3-pipeline-list ${P.key === "available" ? "forge-v3-available-split" : ""}` },
              P.key === "available" ? [
                t(
                  "div",
                  { class: "forge-v3-available-backlog" },
                  $e.length ? $e.map((ie) => t(Si, { key: ie.identifier, issue: ie, onEnqueue: v })) : t("p", { class: "forge-v3-empty" }, b ? "No Linear issues match" : "No available Linear issues")
                ),
                t("div", { class: "forge-v3-col-sub forge-v3-available-divider" }, "Queued in Forge"),
                t(
                  "div",
                  { class: "forge-v3-available-queued" },
                  j.length ? j.map((ie) => t(La, { key: ie.id, issue: ie, selected: r === ie.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d })) : t("p", { class: "forge-v3-empty" }, b || I !== "all" ? "No queued issues match" : "No queued issues")
                )
              ] : j.length === 0 ? t("p", { class: "forge-v3-empty" }, b || I !== "all" ? "No issues match the active filters" : "No issues") : j.map((ie) => t(La, { key: ie.id, issue: ie, selected: r === ie.id, onOpenIssue: l, onIssueAction: c, onReviewIssue: d }))
            )
          );
        })
      )
    )
  ]);
}
function Qt(e) {
  return e.includes("limit") || e.includes("seconds") || e.includes("rounds") || e.endsWith("_max") || e === "dashboard_port" ? "number" : e.startsWith("enable_") || e.startsWith("use_") || e.endsWith("_enabled") || e.includes("reuse") || e.includes("use_desktop") ? "checkbox" : "text";
}
function wn(e) {
  var n;
  return ((n = Za[e]) == null ? void 0 : n.label) ?? e;
}
function xa(e) {
  var a;
  const n = (a = Za[e]) == null ? void 0 : a.hint;
  return n ? `${n} · DB key: ${e}` : `Unrecognized setting · DB key: ${e}`;
}
function Gi(e, n) {
  return n.keys.filter((a) => Object.prototype.hasOwnProperty.call(e, a)).map((a) => ({ key: a, value: e[a] ?? "" }));
}
function En(e, n) {
  return lo.has(e) ? n === "true" ? "true" : "false" : n;
}
function Ga(e, n, a) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => a || Cn.has(r)).map(([r, s]) => [r, En(r, s ?? "")]).filter(([r, s]) => En(String(r), e[String(r)] ?? "") !== s));
}
function $i(e, n) {
  const a = [];
  return Object.entries(e).forEach(([r, s]) => {
    if (!n && !Cn.has(r) || !so.has(r)) return;
    const l = String(s ?? "").trim();
    (!l || !Number.isFinite(Number(l)) || Number(l) < 0) && a.push(`${wn(r)} must be a non-negative number.`);
  }), a;
}
function Wi() {
  const [e, n] = E({}), [a, r] = E({}), [s, l] = E(null), [c, p] = E(""), [f, d] = E(""), [h, k] = E("Loading settings…"), [u, y] = E([]), [v, b] = E(!1), S = () => {
    de("/api/desktop-backend").then((N) => {
      l(N), p(N.backendOrigin ?? ""), d("");
    }).catch(() => {
      l(null), d("Desktop backend switching is available in the Forge desktop app.");
    });
  };
  z(() => {
    let N = !1;
    return de("/api/settings").then((C) => {
      N || (n(C), r(C), y([]), k(""));
    }).catch(() => {
      N || k("Unable to load settings");
    }), S(), () => {
      N = !0;
    };
  }, []);
  const W = (N, C) => {
    r((B) => ({ ...B, [N]: En(N, C) })), y((B) => B.filter((L) => !L.includes(wn(N))));
  }, I = () => {
    d("Saving backend…"), fetch("/api/desktop-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backendOrigin: c })
    }).then((N) => N.ok ? N.json() : Promise.reject(new Error("backend failed"))).then((N) => {
      l(N), p(N.backendOrigin ?? c), d("Backend saved. Refresh if the dashboard did not reconnect automatically.");
    }).catch(() => d("Unable to save desktop backend"));
  }, D = () => {
    const N = $i(a, v);
    if (N.length) {
      y(N), k("Fix validation errors before saving");
      return;
    }
    const C = Ga(e, a, v);
    if (Object.keys(C).length === 0) {
      k("No settings changed");
      return;
    }
    k(`Saving ${Object.keys(C).length} changed setting${Object.keys(C).length === 1 ? "" : "s"}…`), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(C)
    }).then((B) => B.json().then((L) => B.ok ? L : Promise.reject(new Error((L == null ? void 0 : L.error) ?? "Unable to save settings")))).then((B) => {
      const L = B.settings ?? { ...e, ...C };
      n(L), r(L), y([]), k("Settings saved");
    }).catch((B) => k(B.message || "Unable to save settings"));
  }, $ = () => {
    r(e), y([]), k("Reset changes");
  }, M = Object.entries(a).filter(([N]) => !Cn.has(N)).map(([N, C]) => ({ key: N, value: C ?? "" })), F = Ga(e, a, v), q = Object.keys(F).length, te = [...zt, { label: "Other", keys: [] }], Y = (N, C = !1) => {
    if (N.key.includes("context") || N.key.includes("prompt") || N.key.includes("command"))
      return t("textarea", { class: "forge-v3-setting-control", value: N.value, rows: N.key === "project_prompt_overlay" ? 8 : 3, placeholder: Ia[N.key], disabled: C, readOnly: C, onInput: (L) => W(N.key, L.target.value) });
    const B = Qt(N.key);
    return t("input", { class: "forge-v3-setting-control", type: Qt(N.key), checked: B === "checkbox" ? N.value === "true" : void 0, value: B === "checkbox" ? void 0 : N.value, placeholder: Ia[N.key], disabled: C, readOnly: C, min: B === "number" ? "0" : void 0, onInput: (L) => {
      const ne = L.target;
      W(N.key, B === "checkbox" ? String(ne.checked) : ne.value);
    } });
  }, U = () => t(
    "div",
    { key: "desktop-backend-origin", class: "forge-v3-setting-row forge-v3-desktop-backend-row" },
    t("span", null, "Desktop backend origin"),
    t("small", null, f || (s != null && s.configFile ? `Stored in ${s.configFile}` : "All v3 dashboard reads and writes go through this backend.")),
    t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("input", { class: "forge-v3-setting-control", type: "url", value: c, placeholder: "http://127.0.0.1:3142", disabled: !s, onInput: (N) => p(N.target.value) }),
      t("button", { type: "button", disabled: !s, onClick: I }, "Use backend"),
      t("a", { class: "forge-v3-btn-primary", href: "/desktop/backend" }, "Switch page")
    )
  );
  return t(Et, { view: "settings", className: "forge-v3-settings-wrap" }, [
    t(Yt, { icon: "⚙️", title: "Settings", subtitle: "Configure Forge scheduler, models, integrations, and repository", actions: t(
      "div",
      { class: "forge-v3-toolbar-actions" },
      t("a", { class: "forge-v3-btn-primary", href: "/classic.html" }, "Open classic v2"),
      t("button", { type: "button", onClick: $ }, "↺ Reset changes")
    ) }),
    h ? t("p", { class: `forge-v3-empty ${u.length ? "forge-v3-settings-error" : ""}` }, h) : null,
    u.length ? t("ul", { class: "forge-v3-settings-errors" }, u.map((N) => t("li", { key: N }, N))) : null,
    t("p", { class: "forge-v3-settings-helper" }, q ? `${q} changed setting${q === 1 ? "" : "s"} will be saved.` : "Only settings you change will be sent on save."),
    t(
      "section",
      { class: "forge-v3-settings-grid", "aria-label": "Settings groups" },
      te.map((N) => {
        const C = N.label === "Other" ? M : Gi(a, N), B = [
          ...N.label === "Dashboard Backend" ? [U()] : [],
          ...C.map((L) => {
            const ne = N.label === "Other", m = co.has(L.key);
            return t(
              "label",
              { key: L.key, class: `forge-v3-setting-row ${ne ? "forge-v3-setting-unknown" : ""} ${m ? "forge-v3-setting-runtime" : ""}` },
              t("span", null, wn(L.key), ne && !v ? t("em", null, " read-only") : null),
              t("small", null, m ? `${xa(L.key)} · Runtime/backend changes may require reconnecting the dashboard or restarting agents.` : xa(L.key)),
              Y(L, ne && !v)
            );
          })
        ];
        return t(
          "section",
          { key: N.label, class: "forge-v3-settings-card forge-v3-settings-group" },
          t(
            "header",
            null,
            t("div", null, t("h2", null, N.label), t("p", null, oo[N.label])),
            N.label === "Other" ? t("label", { class: "forge-v3-other-unlock" }, t("input", { type: "checkbox", checked: v, onInput: (L) => b(L.target.checked) }), " Edit unknown") : t("span", null, String(B.length))
          ),
          B.length === 0 ? t("p", { class: "forge-v3-empty" }, "No settings in this group.") : B
        );
      })
    ),
    t(
      "div",
      { class: "forge-v3-settings-save-bar" },
      t("button", { type: "button", class: "forge-v3-btn-primary", disabled: q === 0, onClick: D }, q ? `Save ${q} change${q === 1 ? "" : "s"}` : "Save settings"),
      h === "Settings saved" ? t("span", { class: "forge-v3-saved-indicator" }, "✓ Saved") : null
    )
  ]);
}
function Di() {
  const [e, n] = E("suggestions"), [a, r] = E({ suggestions: [], events: [], changes: [] }), [s, l] = E("Loading learnings…"), c = () => {
    de("/api/learnings").then((f) => {
      r({ suggestions: f.suggestions ?? [], events: f.events ?? [], changes: f.changes ?? [] }), l("");
    }).catch(() => l("Unable to load learnings"));
  };
  z(() => {
    c();
    const f = window.setInterval(c, 3e4), d = typeof EventSource < "u" ? new EventSource("/api/events") : null;
    return d == null || d.addEventListener("message", (h) => {
      try {
        const k = JSON.parse(h.data);
        String(k.type ?? "").startsWith("learning_") && c();
      } catch {
      }
    }), () => {
      window.clearInterval(f), d == null || d.close();
    };
  }, []);
  const p = (f, d) => {
    r((h) => ({ ...h, suggestions: h.suggestions.filter((k) => k.id !== f) })), fetch(`/api/learnings/${f}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: d })
    }).then((h) => h.ok ? c() : Promise.reject(new Error("resolve failed"))).catch(() => {
      l("Unable to resolve learning suggestion"), c();
    });
  };
  return t(Et, { view: "learnings", className: "forge-v3-learnings-wrap" }, [
    t(Yt, { icon: "🧠", title: "Learnings", subtitle: "Suggestions, reflection history, and prompt change log" }),
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
        t("div", { class: "forge-v3-learning-meta" }, f.linear_id ?? `Issue #${f.issue_id ?? "—"}`, " · ", f.target ?? "target", " · Added ", f.created_at ? `${we(f.created_at)} ago (${un(f.created_at)})` : "date unknown"),
        t("h2", null, f.suggestion ?? "Untitled suggestion"),
        t("p", null, f.rationale ?? "No rationale provided."),
        t(
          "div",
          { class: "forge-v3-toolbar-actions" },
          t("button", { type: "button", onClick: () => p(f.id, "applied") }, "Apply suggestion"),
          t("button", { type: "button", onClick: () => p(f.id, "rejected") }, "Reject suggestion")
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
  const [e, n] = E(() => Object.fromEntries(
    $t.map((m) => [m, { type: m, content: "", status: "Loading…" }])
  )), [a, r] = E({}), [s, l] = E([]), [c, p] = E("Loading model settings…"), [f, d] = E("Loading available models…"), [h, k] = E({}), u = (m) => {
    fetch(`/api/agents/${m}/prompt`).then((A) => A.ok ? A.text() : Promise.reject(new Error("prompt failed"))).then((A) => n((x) => ({ ...x, [m]: { type: m, content: A, status: "Loaded" } }))).catch(() => n((A) => ({ ...A, [m]: { ...A[m], status: "Unable to load prompt" } })));
  }, y = () => {
    de("/api/settings").then((m) => {
      r(m), p("Model settings loaded");
    }).catch(() => p("Unable to load model settings"));
  }, v = () => {
    de("/api/models").then((m) => {
      l(m.models ?? []), d(m.error ? `Unable to load some models: ${m.error}` : m.warning ? `Available models loaded · ${m.warning}` : "Available models loaded");
    }).catch(() => d("Unable to load available models"));
  };
  z(() => {
    $t.forEach(u), y(), v();
  }, []);
  const b = (m, A) => n((x) => ({ ...x, [m]: { ...x[m], content: A, status: "Unsaved" } })), S = (m, A) => {
    r((x) => ({ ...x, [m]: A })), p("Unsaved model change");
  }, W = (m) => {
    p("Saving model…"), fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [m]: a[m] ?? "" })
    }).then((A) => A.ok ? A.json() : Promise.reject(new Error("save failed"))).then((A) => {
      A.settings && r(A.settings), p("Model saved");
    }).catch(() => p("Unable to save model"));
  }, I = (m) => {
    const A = m.trim();
    A && (k((x) => ({ ...x, [A]: { checking: !0 } })), fetch("/api/models/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: A, force: !0 })
    }).then((x) => x.json()).then((x) => k((K) => ({ ...K, [A]: x }))).catch((x) => k((K) => ({ ...K, [A]: { ok: !1, model: A, error: (x == null ? void 0 : x.message) || "Unable to check model" } }))));
  }, D = () => {
    [F, ...$t.map((A) => a[yn[A]] || "")].filter(Boolean).forEach((A) => k((x) => ({ ...x, [A]: { checking: !0 } }))), fetch("/api/models/check-configured", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ force: !0 }) }).then((A) => A.json()).then((A) => k((x) => ({ ...x, ...Object.fromEntries((A.results ?? []).map((K) => [K.model || "", K]).filter(([K]) => K)) }))).catch((A) => p((A == null ? void 0 : A.message) || "Unable to check configured models"));
  }, $ = (m) => {
    fetch(`/api/agents/${m}/prompt`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: e[m].content })
    }).then((A) => A.ok ? A.json() : Promise.reject(new Error("save failed"))).then(() => n((A) => ({ ...A, [m]: { ...A[m], status: "Saved" } }))).catch(() => n((A) => ({ ...A, [m]: { ...A[m], status: "Unable to save prompt" } })));
  }, M = (m) => {
    fetch(`/api/agents/${m}/prompt/default`).then((A) => A.ok ? A.text() : Promise.reject(new Error("default failed"))).then((A) => n((x) => ({ ...x, [m]: { type: m, content: A, status: "Reset to default" } }))).catch(() => n((A) => ({ ...A, [m]: { ...A[m], status: "Unable to reset prompt" } })));
  }, F = a.model ?? a.default_model ?? "", q = (m) => m ? m >= 1e3 ? `${Math.round(m / 1e3)}k` : String(m) : "—", te = new Map(s.map((m) => [m.key || `${m.provider}/${m.id}`, m])), Y = (m) => te.get(m) ?? s.find((A) => A.id === m) ?? null, U = (m) => m.key || `${m.provider}/${m.id}`, N = (m) => m && !Y(m) ? { id: m, key: m, name: m, provider: "custom" } : null, C = (m) => m ? `${m.provider ?? "provider unknown"}${m.reasoning ? " · reasoning" : ""} · context ${q(m.contextWindow)} · max ${q(m.maxTokens)}` : s.length ? "Select an available model." : f, B = (m) => `${m.name || m.id} (${m.provider || "provider unknown"})`, L = (m) => {
    const A = m.trim();
    if (!A) return null;
    const x = h[A];
    return x ? "checking" in x ? t("span", { class: "forge-v3-model-health checking" }, "Checking…") : t("span", { class: `forge-v3-model-health ${x.ok ? "ok" : "failed"}`, title: x.error || x.responsePreview || "" }, x.ok ? `Working${x.latencyMs ? ` · ${Math.round(x.latencyMs / 1e3)}s` : ""}` : "Failed") : t("span", { class: "forge-v3-model-health" }, "Untested");
  }, ne = (m, A, x) => {
    const K = A ? Y(A) ?? N(A) : null, le = K ? U(K) : "", me = N(A) ? [N(A), ...s] : s;
    return t("div", { class: "forge-v3-model-picker" }, [
      t("select", { class: "forge-v3-prompt-model-input", value: le, onChange: (ge) => S(m, ge.target.value) }, [
        x ? t("option", { value: "" }, `Use default (${F || "not set"})`) : null,
        me.map((ge) => t("option", { key: U(ge), value: U(ge) }, B(ge)))
      ]),
      t("div", { class: "forge-v3-model-details" }, K ? [
        t("strong", null, K.id),
        t("span", null, C(K)),
        L(A)
      ] : t("span", null, C(x ? Y(F) ?? N(F) : null)))
    ]);
  };
  return t(Et, { view: "prompts", className: "forge-v3-prompts-wrap" }, [
    t(Yt, { icon: "✎", title: "Agent Prompts", subtitle: "Edit each agent's prompt and model in one place", actions: t("button", { type: "button", onClick: D }, "Test configured models") }),
    t(
      "section",
      { class: "forge-v3-model-default-card", "aria-label": "Default model" },
      t(
        "div",
        null,
        t("h2", null, "Default model"),
        t("p", { class: "forge-v3-prompt-meta" }, "Used by every agent unless an override is set on that agent. ", c, " · ", f)
      ),
      t(
        "div",
        { class: "forge-v3-prompt-model-row" },
        ne("model", F, !1),
        t("button", { type: "button", onClick: () => I(F), disabled: !F.trim() }, "Test"),
        t("button", { type: "button", onClick: () => W("model") }, "Save default")
      )
    ),
    t(
      "section",
      { class: "forge-v3-prompts-grid", "aria-label": "Agent prompt editors" },
      $t.map((m) => {
        const A = e[m], x = A.content.length, K = yn[m], le = a[K] ?? "";
        return t(
          "article",
          { key: m, class: "forge-v3-prompt-card" },
          t(
            "header",
            null,
            t(
              "div",
              null,
              t("h2", null, m),
              t("p", { class: "forge-v3-prompt-meta" }, "Prompt: ", A.status, " · Model: ", le.trim() ? "override" : "default")
            ),
            m === "coder" ? t("span", { class: "forge-v3-prompt-meta" }, "learned-rules") : null
          ),
          t(
            "div",
            { class: "forge-v3-prompt-model-row" },
            t("label", { class: "forge-v3-prompt-meta" }, "Model override"),
            ne(K, le, !0),
            t("button", { type: "button", onClick: () => I(le || F), disabled: !(le || F).trim() }, "Test"),
            t("button", { type: "button", onClick: () => W(K) }, "Save model")
          ),
          t("textarea", { class: "forge-v3-prompt-editor", value: A.content, rows: 12, onInput: (me) => b(m, me.target.value) }),
          t(
            "footer",
            { class: "forge-v3-prompt-meta" },
            t("span", null, String(x), " chars"),
            t(
              "div",
              { class: "forge-v3-toolbar-actions" },
              t("button", { type: "button", onClick: () => M(m) }, "Reset to default"),
              t("button", { type: "button", onClick: () => $(m) }, "Save prompt")
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
function Mi(e) {
  const n = (e.prStack ?? []).map((a) => [a.pr_number ? `#${a.pr_number}` : "", a.gt_branch, a.branch, a.status].filter(Boolean).join(" ")).join(" ");
  return [e.linear_id, e.title, e.state, e.updated_at, n].filter(Boolean).join(" ").toLowerCase();
}
function Ui({ issue: e, onClose: n }) {
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
  const [n, a] = E(""), [r, s] = E(!1), [l, c] = E(!1), p = /* @__PURE__ */ new Date(), f = new Date(p.getTime() - 7 * 864e5), d = (S) => S.toISOString().slice(0, 10), [h, k] = E(d(f)), [u, y] = E(d(p)), v = async () => {
    s(!0), c(!1);
    try {
      const S = new URLSearchParams();
      h && S.set("since", h), u && S.set("until", u);
      const W = await fetch(`/api/archive/report?${S}`);
      a(await W.text());
    } catch (S) {
      a(`Error generating report: ${S.message}`);
    } finally {
      s(!1);
    }
  }, b = async () => {
    try {
      await navigator.clipboard.writeText(n), c(!0), setTimeout(() => c(!1), 2e3);
    } catch {
    }
  };
  return z(() => {
    v();
  }, []), t(
    "div",
    { class: "forge-v3-modal-overlay", onClick: (S) => {
      S.target.classList.contains("forge-v3-modal-overlay") && e();
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
        t("label", null, "From ", t("input", { type: "date", value: h, onInput: (S) => k(S.target.value) })),
        t("label", null, " To ", t("input", { type: "date", value: u, onInput: (S) => y(S.target.value) })),
        t("button", { type: "button", class: "forge-v3-btn forge-v3-btn-primary", onClick: v, disabled: r }, r ? "Generating…" : "Generate"),
        t("button", { type: "button", class: "forge-v3-btn", onClick: b, disabled: !n }, l ? "✓ Copied" : "Copy")
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
  const [e, n] = E(null), [a, r] = E(null), [s, l] = E(""), [c, p] = E(null), [f, d] = E(!1);
  z(() => {
    let I = !1;
    return de("/api/archive").then((D) => {
      I || n(D);
    }).catch(() => {
      I || r("Unable to load archive");
    }), () => {
      I = !0;
    };
  }, []);
  const h = e ?? [], k = s.trim().toLowerCase(), u = k ? h.filter((I) => Mi(I).includes(k)) : h, y = c ? h.find((I) => I.id === c) ?? null : null, v = u.length, b = u.filter((I) => Fi(I.merged ?? I.updated_at)).length, S = v ? (u.reduce((I, D) => {
    var $;
    return I + Number(D.pr_count ?? (($ = D.prStack) == null ? void 0 : $.length) ?? 0);
  }, 0) / v).toFixed(1) : "0.0", W = (() => {
    const I = u.filter((M) => M.created_at && (M.merged ?? M.updated_at)).map((M) => {
      const F = Ye(M.created_at), q = Ye(M.merged ?? M.updated_at);
      return Number.isFinite(F) && Number.isFinite(q) ? q - F : 0;
    }).filter((M) => M > 0);
    if (!I.length) return "—";
    const D = I.reduce((M, F) => M + F, 0) / I.length, $ = Math.round(D / 36e5);
    return $ < 24 ? `${$}h` : `${($ / 24).toFixed(1)}d`;
  })();
  return t(Et, { view: "archive", className: `forge-v3-archive-wrap ${y ? "forge-v3-has-archive-detail" : ""}` }, [
    t(Yt, { icon: "🗃️", title: "Archive", subtitle: `${v} completed issues${k ? ` matching "${s.trim()}"` : ""} — all PRs merged`, actions: t("div", { class: "forge-v3-toolbar-actions" }, t("button", { type: "button", class: "forge-v3-btn", onClick: () => d(!0), title: "Generate on-call handover report" }, "📋 Handover Report"), t("input", { class: "forge-v3-toolbar-search", type: "search", placeholder: "Search archive…", "aria-label": "Search archive", value: s, onInput: (I) => l(I.target.value) })) }),
    t(
      "section",
      { class: "forge-v3-archive-stats forge-v3-stats-strip", "aria-label": "Archive stats" },
      t("article", null, t("span", null, "Total completed"), t("strong", null, String(v))),
      t("article", null, t("span", null, "Completed this week"), t("strong", null, String(b))),
      t("article", null, t("span", null, "Average time to merge"), t("strong", null, W)),
      t("article", null, t("span", null, "Average PRs per issue"), t("strong", null, S))
    ),
    a ? t("p", { class: "forge-v3-empty" }, "Unable to load archive") : e === null ? t("p", { class: "forge-v3-empty" }, "Loading archive…") : h.length === 0 ? t("p", { class: "forge-v3-empty" }, "No completed issues yet") : u.length === 0 ? t("p", { class: "forge-v3-empty" }, "No archived issues match your search") : t(
      "section",
      { class: "forge-v3-archive-grid forge-v3-archive-list", "aria-label": "Completed issues" },
      u.map((I) => {
        var D;
        return t(
          "article",
          { key: I.id, class: `forge-v3-archive-card ${c === I.id ? "is-selected" : ""}`, tabIndex: 0, role: "button", onClick: () => p(I.id), onKeyDown: ($) => {
            ($.key === "Enter" || $.key === " ") && ($.preventDefault(), p(I.id));
          } },
          t("div", { class: "forge-v3-archive-meta" }, I.linear_id ?? `Issue #${I.id}`, " · ", I.updated_at ?? "merged"),
          t("h2", null, I.title ?? "Untitled issue"),
          t("div", { class: "forge-v3-archive-meta" }, "PR links", ": ", (D = I.prStack) != null && D.length ? I.prStack.map(($, M) => {
            const F = $.pr_number ? `#${$.pr_number}` : $.gt_branch ?? $.branch ?? "pending";
            return $.url ? t("a", { key: `${F}-${M}`, href: $.url, target: "_blank", rel: "noreferrer", onClick: (q) => q.stopPropagation() }, F) : t("span", { key: `${F}-${M}` }, F);
          }) : "None"),
          t("div", { class: "forge-v3-archive-meta" }, "Agent runs", ": ", String(I.run_count ?? 0)),
          t("div", { class: "forge-v3-archive-meta" }, "Summary", ": ", I.summaryContent || I.hasSummary ? "available" : "not generated")
        );
      })
    ),
    y ? t(Ui, { issue: y, onClose: () => p(null) }) : null,
    f ? t(ur, { onClose: () => d(!1) }) : null
  ]);
}
function Hi({ issueId: e, issuePreview: n, reloadKey: a, autoOpenDiffKey: r, onClose: s, onPanelResizeStart: l, onIssueAction: c, onRemoveIssue: p, onLaunchRuntime: f, onStopVm: d, onSyncPrs: h, onSubmitFeedback: k, onResolveDecision: u }) {
  var jn, Xn, Kn, Qn, Jn, zn, Yn, Zn, ea, ta;
  const [y, v] = E(() => Xt().detailTab), [b, S] = E(null), [W, I] = E(!1), [D, $] = E(!1), [M, F] = E(""), [q, te] = E(""), Y = qe(0), [U, N] = E(""), [C, B] = E(!1), [L, ne] = E(null), [m, A] = E(""), [x, K] = E([]), [le, me] = E([]), [ge, he] = E(""), [be, oe] = E([]), [$e, We] = E([]), [De, ke] = E(!1), [Ie, Oe] = E(!1), [P, j] = E("idle"), [ue, ie] = E([]), [et, st] = E(""), [lt, tt] = E(""), [Nt, nt] = E(!1), [Zt, ct] = E(!1), [en, dt] = E(!1), [Fe, _] = E(""), [T, G] = E([]), [V, X] = E(""), [J, ae] = E(""), ve = qe(null);
  if (z(() => {
    var w;
    if (!e) {
      S(null), I(!1), $(!1), Oe(!1), ke(!1);
      return;
    }
    S(n ? { issue: n } : null);
    const i = Xt();
    v(i.detailTab), I(i.panel === "plan"), $(i.panel === "diff" || i.panel === "review"), Oe(i.panel === "listen"), ke(i.panel === "jump"), ie([]), j("idle"), F(""), te(i.panel === "diff" || i.panel === "review" ? "Loading diff…" : ""), N(i.diffPath), B(i.panel === "review"), ne(null), A(""), K([]), me([]), he(""), oe([]), We([]), st(""), tt(""), nt(!1), ct(!1), dt(!1);
    const g = Io(e);
    _(g.input ?? ""), G(g.messages ?? []), X(""), ae(""), (w = ve.current) == null || w.abort(), ve.current = null;
  }, [e]), z(() => {
    !e || !n || S((i) => {
      var g;
      return ((g = i == null ? void 0 : i.issue) == null ? void 0 : g.id) !== e ? { issue: n } : { ...i, issue: { ...i.issue, ...n } };
    });
  }, [e, n == null ? void 0 : n.id, n == null ? void 0 : n.state, n == null ? void 0 : n.updated_at, n == null ? void 0 : n.locked_at, n == null ? void 0 : n.agent_pid, n == null ? void 0 : n.auto_fix_enabled, n == null ? void 0 : n.externally_managed, n == null ? void 0 : n.awaiting_review]), z(() => {
    if (!e) return;
    let i = !1;
    return de(`/api/issues/${e}?fast=1`).then((g) => {
      i || S(g);
    }).catch(() => {
      i || S({ issue: { id: e, title: "Unable to load issue" } });
    }), () => {
      i = !0;
    };
  }, [e, a]), z(() => {
    if (!e) return;
    Kt({ view: "queue", issue: e, tab: y === "overview" ? null : y, panel: D ? C ? "review" : "diff" : W ? "plan" : Ie ? "listen" : De ? "jump" : null, diffPath: D ? U : null });
  }, [e, y, W, D, Ie, De, C, U]), z(() => {
    var w;
    const i = (w = b == null ? void 0 : b.decisions) == null ? void 0 : w.find((R) => R.type === "FIX_APPROVAL"), g = Mt(i).comments ?? [];
    oe(g.map((R, H) => vt(R, H)));
  }, [b == null ? void 0 : b.decisions]), z(() => {
    var i, g, w;
    nt(!!((i = b == null ? void 0 : b.issue) != null && i.auto_fix_enabled)), ct(!!((g = b == null ? void 0 : b.issue) != null && g.externally_managed)), dt(!!((w = b == null ? void 0 : b.issue) != null && w.awaiting_review));
  }, [(jn = b == null ? void 0 : b.issue) == null ? void 0 : jn.auto_fix_enabled, (Xn = b == null ? void 0 : b.issue) == null ? void 0 : Xn.externally_managed, (Kn = b == null ? void 0 : b.issue) == null ? void 0 : Kn.awaiting_review]), z(() => {
    if (!Ie || !e) return;
    if (Je()) {
      j("mock live"), ie([{ kind: "text", text: "Mock live agent stream — real issues connect to /api/issues/:id/listen." }]);
      return;
    }
    j("connecting…"), ie([]);
    const i = new EventSource(`/api/issues/${e}/listen`);
    return i.addEventListener("meta", (g) => {
      const w = JSON.parse(g.data);
      j(w.agentType ? `live · ${w.agentType}` : "live");
    }), i.addEventListener("message", (g) => {
      const w = JSON.parse(g.data), R = w.kind ?? "text", H = (w.text ?? "").replace(/\x1b\[[\d;]*[A-Za-z]|\x1b[^\[]/g, "");
      if (!H) return;
      const Q = R === "text_delta" || R === "thinking_delta";
      ie((fe) => {
        const gt = fe[fe.length - 1];
        return Q && gt && gt.kind === R ? [...fe.slice(0, -1), { kind: R, text: gt.text + H }] : [...fe.slice(-200), { kind: R, text: H }];
      });
    }), i.addEventListener("done", (g) => {
      const w = JSON.parse(g.data);
      j(w.exitCode === 0 ? "done" : `failed (${w.exitCode ?? "unknown"})`), i.close();
    }), i.addEventListener("error", () => j("no active agent")), i.onerror = () => j("disconnected"), () => i.close();
  }, [Ie, e]), z(() => {
    !e || r <= 0 || (B(!0), $(!0), te("Loading diff…"));
  }, [r, e]), z(() => {
    if (!e || !D || q !== "Loading diff…") return;
    const i = ++Y.current;
    C && (A("Loading AI tour…"), de(`/api/issues/${e}/tour`).then((g) => {
      i === Y.current && (ne(g), A(g.generating ? "AI tour is generating…" : g.tour ? "" : "No AI tour yet"));
    }).catch(() => {
      i === Y.current && A("Unable to load AI tour");
    })), de(`/api/issues/${e}/diff`).then((g) => {
      if (i !== Y.current) return;
      const w = g.diff ?? "", R = gn(w);
      F(w), N((H) => {
        var Q;
        return H || ((Q = R[0]) == null ? void 0 : Q.path) || "";
      }), te(g.error ?? "");
    }).catch(() => {
      i === Y.current && te("Unable to load diff");
    });
  }, [D, q, e, C]), z(() => {
    if (!D) return;
    const i = (g) => {
      const w = g.target;
      if (w.tagName === "INPUT" || w.tagName === "TEXTAREA" || w.tagName === "SELECT") return;
      const R = gn(M);
      if (!R.length) return;
      const H = R.findIndex((Q) => Q.path === U);
      if (g.key === "j" || g.key === "J") {
        g.preventDefault();
        const Q = Math.min(H + 1, R.length - 1);
        N(R[Q].path);
      } else if (g.key === "k" || g.key === "K") {
        g.preventDefault();
        const Q = Math.max(H - 1, 0);
        N(R[Q].path);
      } else g.key === "r" && C && U ? (g.preventDefault(), K((Q) => Q.includes(U) ? Q.filter((fe) => fe !== U) : [...Q, U])) : g.key === "a" && C && U && (g.preventDefault(), an(U, null));
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [D, M, U, C]), !e) return null;
  const o = b == null ? void 0 : b.issue, Z = ((b == null ? void 0 : b.decisions) ?? []).filter((i) => !i.verdict && !i.resolved_at && !$e.includes(i.id)), Pt = (b == null ? void 0 : b.prStack) ?? [], ut = o ?? {}, gr = () => Oe(!0), at = Fo(ut, Z), se = or(Z), tn = Ho(o == null ? void 0 : o.state), vr = `${Ln(o == null ? void 0 : o.priority)} ${xn(o == null ? void 0 : o.priority)}`, _r = An(b), mr = sr(b), Rt = jo(b), hr = Bo(b) && !["PENDING", "SETTING_UP", "PLANNING"].includes((o == null ? void 0 : o.state) ?? "") || Rt, br = Xo(o == null ? void 0 : o.state), kr = Ko(o == null ? void 0 : o.state), yr = Qo(o), Ir = !["PENDING", "SETTING_UP", "DONE", "IGNORED", "FAILED"].includes((o == null ? void 0 : o.state) ?? ""), Ar = { label: "Plan" }, Wn = async () => {
    if (!(o != null && o.id)) return;
    const i = await Ae({ title: "Steer issue", message: "Instructions will be read by the next agent run.", label: "Steering instructions", confirmText: "Queue steering" });
    i != null && i.trim() && c(o.id, "steer", { instructions: i.trim() });
  }, wr = async () => {
    !(o != null && o.id) || !await bt({ title: "Clear steering?", message: "Remove queued steering context for this issue.", confirmText: "Clear steering" }) || c(o.id, "clear-steer");
  }, Er = _o.filter((i) => i.state !== (o == null ? void 0 : o.state)), Nr = async (i) => {
    if (!(o != null && o.id)) return;
    const g = o.linear_id ?? `issue #${o.id}`;
    if (i.state === "RETURN_TO_LINEAR") {
      if (await Ae({ title: "Return issue to Linear", message: `This fully resets ${g}, removes worktree/project artifacts/branches, deletes Forge tracking, and leaves the Linear issue visible in the Linear list.`, label: "Type RETURN to confirm", confirmText: "Return to Linear", danger: !0, requiredText: "RETURN" }) !== "RETURN") return;
      ke(!1), c(o.id, "return-to-linear"), s();
      return;
    }
    const w = i.risky ? " This is a risky recovery action and may clear or bypass pending workflow gates." : "";
    await bt({ title: "Jump workflow state?", message: `Move ${g} to ${i.state}?${w}`, confirmText: "Jump state", danger: i.risky }) && (ke(!1), c(o.id, "advance", { nextState: i.state }));
  }, Pr = async () => {
    var fe;
    if (!(o != null && o.id)) return;
    const i = vo(o.state), w = { SETTING_UP: "setup", PLANNING: "planner", AI_PLAN_REVIEWING: "plan-reviewer", WORKING: "coder", AI_REVIEWING: "reviewer", CREATING_PR: "git-agent", FIXING: "fixer", PUSHING: "git-agent", REBASING: "rebaser", SPLIT_PLANNING: "split-planner", SPLITTING: "splitter" }[i] ?? null, R = w ? ` Forge will run the ${w} agent next.` : "", H = (fe = o.state) != null && fe.startsWith("AWAITING") ? " This skips the pending human approval gate." : "";
    await bt({ title: "Advance workflow state?", message: `Move ${o.linear_id ?? `issue #${o.id}`} from "${Ze(o)}" to "${Ze({ state: i })}"?${R}${H}`, confirmText: "Advance" }) && c(o.id, "advance", { nextState: i });
  }, Rr = async () => {
    !(o != null && o.id) || await Ae({ title: "Full reset issue", message: `This fully resets ${o.linear_id ?? `issue #${o.id}`}, removes worktree/project artifacts, and restarts from PENDING.`, label: "Type RESET to confirm", confirmText: "Reset issue", danger: !0, requiredText: "RESET" }) !== "RESET" || c(o.id, "reset");
  }, Sr = async () => {
    !(o != null && o.id) || await Ae({ title: "Remove issue", message: `Remove ${o.linear_id ?? `issue #${o.id}`} from Forge.`, label: "Type DELETE to confirm", confirmText: "Remove issue", danger: !0, requiredText: "DELETE" }) !== "DELETE" || p(o.id);
  }, Tr = () => {
    o != null && o.id && (tt("Launching runtime…"), f(o.id).then((i) => tt(`Runtime launch complete${typeof i == "object" && i && "launchRef" in i ? ` · ${i.launchRef ?? "started"}` : ""}`)).catch((i) => tt(`Runtime launch failed: ${i.message}`)));
  }, Cr = (i) => {
    if (!(o != null && o.id)) return;
    const g = Nt;
    nt(i), c(o.id, "set-auto-fix", { enabled: i }), window.setTimeout(() => {
      var w;
      !Je() && ((w = b == null ? void 0 : b.issue) == null ? void 0 : w.auto_fix_enabled) === g && nt(g);
    }, 2e3);
  }, Lr = (i) => {
    o != null && o.id && (ct(i), c(o.id, i ? "mark-external" : "unmark-external"));
  }, xr = (i) => {
    o != null && o.id && (dt(i), c(o.id, i ? "mark-awaiting-review" : "unmark-awaiting-review"));
  }, Gr = async () => {
    var H;
    if (!(o != null && o.id)) return;
    const i = Pt.filter((Q) => Q.pr_number).map((Q) => String(Q.pr_number)), g = i.length ? await Ae({ title: "Target PR", message: `Choose a PR number (${i.join(", ")}).`, label: "PR number", initialValue: i[0], confirmText: "Continue" }) : null, w = g != null && g.trim() ? Number(g.trim().replace(/^#/, "")) : null, R = (H = await Ae({ title: "Add PR feedback", message: "Feedback will be sent to the fixer agent.", label: "Feedback", confirmText: "Add feedback" })) == null ? void 0 : H.trim();
    R && k(o.id, R, Number.isFinite(w) ? w : null);
  }, $r = (i = !1) => {
    if (!(o != null && o.id)) return;
    A(i ? "Regenerating AI tour…" : "Generating AI tour…");
    const g = () => Ee(`/api/issues/${o.id}/generate-tour`, {});
    (i ? Ee(`/api/issues/${o.id}/tour`, {}, "DELETE").then(g) : g()).then((w) => {
      ne(w), A(w.tour ? "" : "AI tour is generating…");
    }).catch(() => A("Unable to start AI tour generation"));
  }, nn = (i = "diff") => {
    o != null && o.id && (Y.current += 1, B(i === "review"), ne(null), A(i === "review" ? "Loading AI tour…" : ""), F(""), N(""), $(!0), te("Loading diff…"));
  }, St = gn(M), _e = St.find((i) => i.path === U) ?? St[0], Me = Z.find((i) => i.type === "PLAN_REVIEW") ?? (se === "plan" ? Z[0] : void 0), ft = Z.find((i) => i.type === "CODE_REVIEW") ?? (se === "code" ? Z[0] : void 0), Re = Z.find((i) => i.type === "FIX_APPROVAL") ?? (se === "fix" ? Z[0] : void 0), Tt = Z.find((i) => i.type === "FIX_REVIEW") ?? (se === "fix-review" ? Z[0] : void 0), Se = Z.find((i) => i.type === "SPLIT_APPROVAL") ?? (se === "split" ? Z[0] : void 0), pt = Mt(Re).comments ?? [], Wr = Mt(Se), Ct = xo(Se, Wr, b), Dn = Ct.stack, On = Oo(o == null ? void 0 : o.state), Fn = On ? Z.filter((i) => i.type && i.type !== On) : Z.filter((i) => i.type), an = async (i, g) => {
    var R;
    const w = (R = await Ae({ title: "Add review comment", message: g === null ? `Comment on ${i}` : `Comment on ${i}:${g}`, label: "Comment", confirmText: "Add comment" })) == null ? void 0 : R.trim();
    w && me((H) => [...H, { id: `${Date.now()}-${H.length}`, file: i, line: g, body: w }]);
  }, Mn = (i) => K((g) => g.includes(i) ? g.filter((w) => w !== i) : [...g, i]), Ne = (i, g, w) => {
    We((R) => R.includes(i) ? R : [...R, i]), u(i, g, w);
  }, Un = async () => {
    var g;
    if (!Me) return;
    const i = (g = await Ae({ title: "Approve plan", message: "Optional steering/commentary for the coder agent.", label: "Steering commentary", confirmText: "Approve plan" })) == null ? void 0 : g.trim();
    Ne(Me.id, "approved", i ? { steeringComment: i } : void 0);
  }, je = async (i, g) => {
    const w = await Ae({ title: `Request ${g} changes`, message: "Feedback will be sent to the agent.", label: "Feedback", confirmText: "Request changes", danger: !0 });
    w != null && w.trim() && Ne(i.id, "rejected", { reason: w.trim() });
  }, Dr = (i) => oe((g) => g.includes(i) ? g.filter((w) => w !== i) : [...g, i]), rn = () => {
    if (!Re) return;
    const i = pt.map((g, w) => vt(g, w));
    oe([]), Ne(Re.id, "rejected", { skippedIds: i, reason: "Skipped all PR comments" });
  }, Vn = () => {
    if (!Re) return;
    const i = pt.map((R, H) => vt(R, H)), g = be;
    if (!g.length) {
      rn();
      return;
    }
    const w = i.filter((R) => !g.includes(R));
    Ne(Re.id, "approved", { approvedIds: g, skippedIds: w });
  }, Hn = (i) => {
    ft && (Ne(ft.id, i, {
      kind: "code-review",
      summary: ge.trim(),
      reviewedFiles: x,
      comments: le.map(({ file: g, line: w, body: R }) => ({ file: g, line: w, body: R }))
    }), he(""));
  }, qn = (i, g) => {
    const w = o == null ? void 0 : o.id;
    G((R) => {
      const H = i(R).slice(-tr);
      return w && wa(w, { messages: H, input: g ?? Fe }), H;
    });
  }, on = (i) => {
    _(i), o != null && o.id && wa(o.id, { messages: T, input: i });
  }, Bn = () => {
    if (!(o != null && o.id) || !Fe.trim() || V === "thinking") return;
    const i = Fe.trim(), g = T.filter((R) => R.text.trim()).slice(-12);
    on(""), X("thinking"), ae("Gathering issue context…"), qn((R) => [...R, { role: "user", text: i }, { role: "assistant", text: "" }], "");
    const w = new AbortController();
    ve.current = w, fetch(`/api/issues/${o.id}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: i, history: g }),
      signal: w.signal
    }).then(async (R) => {
      if (!R.ok || !R.body) throw new Error(`Ask failed (${R.status})`);
      const H = R.body.getReader(), Q = new TextDecoder();
      let fe = "";
      const gt = (Te) => qn((Ce) => {
        const Ue = [...Ce].map((Le) => Le.role).lastIndexOf("assistant");
        return Ue < 0 ? [...Ce, { role: "assistant", text: Te }] : Ce.map((Le, Pe) => Pe === Ue ? { ...Le, text: Le.text + Te } : Le);
      }), Lt = (Te) => ae(Te), Or = (Te) => {
        const Ce = Te.split(`
`).find((sn) => sn.startsWith("event:")), Ue = Te.split(`
`).find((sn) => sn.startsWith("data:"));
        if (!Ue) return;
        const Le = (Ce == null ? void 0 : Ce.replace(/^event:\s*/, "")) ?? "message", Pe = JSON.parse(Ue.replace(/^data:\s*/, ""));
        if (Le === "done") {
          X(""), ae("");
          return;
        }
        if (Le === "meta") {
          Lt("Gathered issue context. Starting assistant…");
          return;
        }
        Le === "message" && ((Pe.kind === "text_delta" || Pe.kind === "text") && gt(Pe.text ?? ""), Pe.kind === "thinking_delta" && Lt("Thinking…"), Pe.kind === "tool" && Lt((Pe.text ?? "").trim()), Pe.kind === "error" && Lt(`Error: ${(Pe.text ?? "").trim()}`));
      };
      for (; ; ) {
        const { value: Te, done: Ce } = await H.read();
        if (Ce) break;
        fe += Q.decode(Te, { stream: !0 });
        const Ue = fe.split(`

`);
        fe = Ue.pop() ?? "", Ue.forEach(Or);
      }
      X(""), ae("");
    }).catch((R) => {
      w.signal.aborted || (X(""), ae(R.message));
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
      ro.map((i) => t("button", { key: i.key, type: "button", class: y === i.key ? "active" : "", onClick: () => v(i.key) }, i.label))
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
            Pa.map((i, g) => {
              const w = Vo(i, b);
              return [
                t(
                  "div",
                  { key: i, class: "forge-v3-phase-node", tabIndex: 0, "aria-label": `${w.title}: ${w.summary} ${w.stats.join(". ")}` },
                  t("div", { class: `forge-v3-phase-dot ${g < tn || (o == null ? void 0 : o.state) === "DONE" ? "done" : g === tn ? qo(o == null ? void 0 : o.state) ? "wait" : "active" : ""}` }),
                  t("div", { class: "forge-v3-phase-label" }, i),
                  t(
                    "div",
                    { class: "forge-v3-phase-tooltip", role: "tooltip" },
                    t("strong", null, w.title),
                    t("p", null, w.summary),
                    t("ul", null, w.stats.map((R) => t("li", { key: R }, R)))
                  )
                ),
                g < Pa.length - 1 ? t("div", { key: `${i}-line`, class: `forge-v3-phase-line ${g < tn ? "done" : ""}` }) : null
              ];
            })
          )
        ),
        (o == null ? void 0 : o.state) === "FAILED" && (b != null && b.failureContext) ? t(
          "section",
          { class: "forge-v3-ds forge-v3-failure-box" },
          t(
            "div",
            { class: "forge-v3-failure-header" },
            t("span", { class: "forge-v3-failure-icon", "aria-hidden": "true" }, "✕"),
            t(
              "div",
              null,
              t("strong", null, `${((Qn = b.failureContext.run) == null ? void 0 : Qn.agent_type) ?? "Agent"} crashed`),
              t(
                "span",
                { class: "forge-v3-failure-meta" },
                ` · exit ${((Jn = b.failureContext.run) == null ? void 0 : Jn.exit_code) ?? "?"} · `,
                (zn = b.failureContext.run) != null && zn.started_at ? `${we(b.failureContext.run.started_at)} ago` : "recently"
              )
            ),
            (Yn = b.failureContext.run) != null && Yn.id ? t("a", { class: "forge-v3-failure-log-link", href: ht(b.failureContext.run.id) ?? "#", target: "_blank", rel: "noreferrer" }, "Full log ↗") : null
          ),
          b.failureContext.logTail ? t("pre", { class: "forge-v3-failure-log" }, b.failureContext.logTail) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No log output captured."),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Wn }, "Steer before retry")
          )
        ) : null,
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-ds-label" }, se ? "Actions · Decision needed" : "Actions"),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            ye(ut) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: gr }, "Listen live") : null,
            se === "plan" && Me ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Un }, "✓ Approve plan") : null,
            se === "plan" && Me ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => I(!0) }, "✗ Request changes") : null,
            se === "code" && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: () => nn("review") }, "Review code") : null,
            se === "fix" && Re ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Vn }, `✓ Fix selected (${be.length})`) : null,
            se === "fix" && Re ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: rn }, "Skip all") : null,
            se === "fix-review" && Tt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ne(Tt.id, "approved") }, "✓ Approve fix & push") : null,
            se === "fix-review" && Tt ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Tt, "Fix review") }, "✗ Send back to fixer") : null,
            se === "fix-review" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => nn("diff") }, "Review diff") : null,
            se === "split" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ne(Se.id, "approved") }, "✓ Approve split plan") : null,
            se === "split" && Se ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Se, "Split plan") }, "✗ Revise split") : null,
            se === "generic" && Z[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ne(Z[0].id, "approved") }, "✓ Approve") : null,
            se === "generic" && Z[0] ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Z[0], "Decision") }, "✗ Request changes") : null,
            hr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => I(!0) }, Rt ? "View plan / handoff" : "View plan") : null,
            br ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => nn("diff") }, "View diff") : null,
            Ir ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Wn }, "Steer") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: Pr }, "Advance state"),
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id) || (o == null ? void 0 : o.state) === "DONE", onClick: () => ke(!0) }, "Jump to state"),
            kr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              var g;
              if (!(o != null && o.id)) return;
              const i = (g = await Ae({ title: "Split PR stack", message: "Optional instructions for the split planner.", label: "Split instructions", confirmText: "Request split" })) == null ? void 0 : g.trim();
              c(o.id, "split-pr-stack", i ? { instructions: i } : {});
            } }, "Split PR") : null,
            yr ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: async () => {
              if (!(o != null && o.id)) return;
              await bt({ title: "Rebase and push?", message: "Rebase this issue's open branch(es) onto their base branch, then push with --force-with-lease.", confirmText: "Rebase", danger: !0 }) && c(o.id, "rebase");
            } }, "Rebase") : null,
            (o == null ? void 0 : o.state) === "FAILED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "retry") : void 0 }, "Retry") : null,
            (o == null ? void 0 : o.state) === "PAUSED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unpause") : void 0 }, "Resume") : null,
            (o == null ? void 0 : o.state) === "IGNORED" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "unignore") : void 0 }, "Unignore") : null,
            ["WATCHING_PR", "IN_MERGE_QUEUE", "AWAITING_FIX_APPROVAL", "AWAITING_FIX_REVIEW"].includes((o == null ? void 0 : o.state) ?? "") ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !(o != null && o.id), onClick: Gr }, "Add PR feedback") : null,
            ye(ut) ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", disabled: !(o != null && o.id), onClick: () => o != null && o.id ? c(o.id, "pause") : void 0 }, "Pause") : null
          )
        ),
        Fn.length ? t(
          "section",
          { class: "forge-v3-ds forge-v3-stale-decisions" },
          t("div", { class: "forge-v3-ds-label" }, "Stale pending decision"),
          t("p", null, "This issue has pending decision records that do not match the current workflow state. Review safely before approving."),
          Fn.map((i) => t("div", { class: "forge-v3-stale-decision-row", key: i.id }, t("span", null, i.type ?? "Decision"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => je(i, "Stale decision") }, "Reject with feedback")))
        ) : null,
        Re ? t(
          "section",
          { class: "forge-v3-ds forge-v3-fix-approval" },
          t("div", { class: "forge-v3-pr-head" }, t("div", { class: "forge-v3-ds-label" }, "Fix approval"), t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => oe(pt.map((i, g) => vt(i, g))) }, "Select all"), t("button", { type: "button", class: "forge-v3-col-head-btn", onClick: () => oe([]) }, "None"))),
          pt.length ? t("div", { class: "forge-v3-fix-comment-list" }, pt.map((i, g) => {
            const w = vt(i, g), R = i.path ? `${i.path}${i.line ? `:${i.line}` : ""}` : "general", Q = ir(i) ? Go(i, Pt) : null;
            return t(
              "label",
              { class: `forge-v3-fix-comment-card ${be.includes(w) ? "selected" : ""}`, key: w },
              t("input", { type: "checkbox", checked: be.includes(w), onChange: () => Dr(w) }),
              t(
                "div",
                null,
                t("div", { class: "forge-v3-fix-comment-meta" }, t("strong", null, i.author ?? "Reviewer"), Q ? [" · ", t("span", { class: "forge-v3-fix-comment-pr" }, Q)] : null, " · ", R),
                Do(i.body),
                t("div", { class: "forge-v3-fix-comment-badges" }, [i.reviewState ?? i.state, i.source, Q].filter(Boolean).map((fe) => t("span", null, fe)))
              )
            );
          })) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No review comments were attached to this fix approval."),
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Vn }, be.length ? `Approve ${be.length} selected` : "Skip all comments"), be.length ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: rn }, "Skip all") : null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Re, "Fix approval") }, "Request different fixes"))
        ) : null,
        Se ? t(
          "section",
          { class: "forge-v3-ds forge-v3-split-approval" },
          t("div", { class: "forge-v3-ds-label" }, "Split approval"),
          t("p", null, Ct.summary),
          Dn.length ? t("div", { class: "forge-v3-split-stack" }, Dn.map((i, g) => t("div", { class: "forge-v3-split-row", key: `${i.branch}-${g}` }, t("span", null, String(g + 1)), t("strong", null, i.title ?? i.branch ?? `PR ${g + 1}`), t("small", null, i.summary ?? i.branch ?? "pending branch")))) : null,
          Ct.markdown ? t(
            "details",
            { class: "forge-v3-split-plan-preview" },
            t("summary", null, "Full split plan"),
            t("div", { class: "forge-v3-md-viewer", dangerouslySetInnerHTML: { __html: Ke(Ct.markdown) } })
          ) : null,
          t("div", { class: "forge-v3-dp-actions" }, t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Ne(Se.id, "approved") }, "Approve split plan"), t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => je(Se, "Split plan") }, "Request split changes"))
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
            t("div", { class: `forge-v3-ig-value ${Gn(o == null ? void 0 : o.priority)}` }, vr),
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
            t("div", { class: "forge-v3-ig-value" }, o != null && o.created_at ? `${we(o.created_at)} ago` : "—"),
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
            Pt.length ? Pt.map((i, g) => {
              const w = i.pr_number, R = i.url ?? null, H = i.branch ?? i.gt_branch ?? "pending", Q = Number(i.checksFailed ?? 0) > 0 ? "bad" : Number(i.checksPending ?? 0) > 0 ? "pending" : "ok";
              return t(
                "div",
                { class: "forge-v3-pr-row", key: `${H}-${w ?? g}` },
                t("span", { class: "forge-v3-pr-pos" }, String(g + 1)),
                t("span", { class: "forge-v3-pr-branch" }, H),
                R ? t("a", { class: "forge-v3-pr-badge", href: R, target: "_blank", rel: "noreferrer" }, `#${w} ↗`) : t("span", { class: "forge-v3-pr-badge" }, "no PR"),
                t("span", { class: `forge-v3-ci-badge ${i.isInMergeQueue ? "merge-queue" : ""}` }, i.isInMergeQueue ? "MERGE QUEUE" : i.liveState ?? i.status ?? "unknown"),
                i.isInMergeQueue ? t("span", { class: "forge-v3-pr-meta-badge merge-queue" }, i.mergeQueuePosition ? `Queue #${i.mergeQueuePosition}` : "Queued") : null,
                i.reviewDecision ? t("span", { class: "forge-v3-pr-meta-badge" }, i.reviewDecision) : null,
                i.mergeable ? t("span", { class: "forge-v3-pr-meta-badge" }, i.mergeable) : null,
                i.checksTotal != null ? t("span", { class: `forge-v3-pr-meta-badge checks-${Q}` }, `${i.checksFailed ?? 0} failed · ${i.checksPending ?? 0} pending · ${i.checksTotal ?? 0} checks`) : null
              );
            }) : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No PRs yet — will be created after code review")
          )
        ),
        t(
          "section",
          { class: "forge-v3-ds" },
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "Auto-fix"), t("p", null, "Automatically send new PR comments and CI failures to the fixer agent.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Nt, disabled: !(o != null && o.id), onChange: (i) => Cr(i.target.checked) }), t("span", null))),
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "👤 Externally managed"), t("p", null, "Mark this issue as managed outside Forge (e.g. Cursor). Forge will not schedule agents for it while this is enabled.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: Zt, disabled: !(o != null && o.id), onChange: (i) => Lr(i.target.checked) }), t("span", null))),
          t("div", { class: "forge-v3-auto-fix-row" }, t("div", null, t("h4", null, "👀 Awaiting review"), t("p", null, "Flag this issue as waiting for a reviewer. Auto-set by Forge when CI passes, all comments are addressed, and no approvals exist yet.")), t("label", { class: "forge-v3-switch" }, t("input", { type: "checkbox", checked: en, disabled: !(o != null && o.id), onChange: (i) => xr(i.target.checked) }), t("span", null)))
        )
      ),
      y === "activity" && ti(b, ut),
      y === "ask" && t(
        "div",
        { class: "forge-v3-ask-panel" },
        t(
          "section",
          { class: "forge-v3-ds forge-v3-ask-intro" },
          t("div", { class: "forge-v3-ds-label" }, "Ask Forge"),
          t("p", null, "Ask about this issue's branch, changed files, plan, handoff, PR stack, and recent agent history. Forge can inspect the worktree if it needs code details."),
          t("div", { class: "forge-v3-ask-prompts" }, ["Summarize changes vs plan", "What should I review first?", "What risks or tests matter?"].map((i) => t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => on(i) }, i)))
        ),
        t(
          "section",
          { class: "forge-v3-ask-thread", ref: (i) => {
            i && (i.scrollTop = i.scrollHeight);
          } },
          T.length || V === "thinking" || J ? [
            ...T.filter((i) => i.role === "user" || i.text.trim()).map((i, g) => t(
              "div",
              { key: `${g}-${i.role}`, class: `forge-v3-ask-msg ${i.role}` },
              t("span", null, i.role === "user" ? "You" : "Forge"),
              t("pre", null, i.text)
            )),
            V === "thinking" ? t("div", { class: "forge-v3-ask-thinking", role: "status" }, t("span", { class: "forge-v3-spinner", "aria-hidden": "true" }), t("span", null, "Thinking"), t("i", null, "."), t("i", null, "."), t("i", null, ".")) : null,
            J ? t("div", { class: "forge-v3-ask-current-status" }, J) : null
          ] : t("p", { class: "forge-v3-empty forge-v3-compact-empty" }, "No questions yet.")
        ),
        t(
          "section",
          { class: "forge-v3-ask-compose" },
          t("textarea", { rows: 3, placeholder: "Ask about this issue…", value: Fe, onInput: (i) => on(i.target.value), onKeyDown: (i) => {
            (i.metaKey || i.ctrlKey) && i.key === "Enter" && Bn();
          } }),
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", disabled: !Fe.trim() || V === "thinking", onClick: Bn }, V === "thinking" ? "Asking…" : "Ask"),
            V === "thinking" ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => {
              var i;
              (i = ve.current) == null || i.abort(), X(""), ae("");
            } }, "Stop") : null,
            t("span", { class: "forge-v3-ask-hint" }, "⌘/Ctrl + Enter")
          )
        )
      )
    ),
    W ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": "Plan review" },
      t(
        "section",
        { class: "forge-v3-plan-modal forge-v3-plan-sidecar" },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, Rt ? "Plan + handoff · " : "Plan review · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? Ar.label)),
          t("button", { type: "button", onClick: () => I(!1), "aria-label": "Close plan modal" }, "×")
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
            Me ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: Un }, "✓ Approve plan") : null,
            Me ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => et.trim() ? Ne(Me.id, "rejected", { reason: et.trim() }) : je(Me, "Plan review") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => I(!1) }, "Close")
          )
        )
      )
    ) : null,
    Ie ? t(
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
          t("div", { class: "forge-v3-live-output-status" }, t("span", { class: "forge-v3-live-dot", "aria-hidden": "true" }), P),
          t(
            "div",
            { class: "forge-v3-live-feed forge-v3-af-feed" },
            ue.length ? ue.map((i, g) => {
              const w = i.kind === "thinking_delta" || i.kind === "thinking", R = i.kind === "error" ? "err" : i.kind === "tool" ? "ok" : w ? "me" : "live", H = i.kind === "tool" ? "tool" : w ? "thinking" : i.kind === "prompt" ? "prompt" : i.kind === "error" ? "error" : "assistant";
              return t(
                "div",
                { key: `${g}-${i.kind}`, class: `forge-v3-live-line forge-v3-af-item kind-${i.kind}` },
                t("div", { class: "forge-v3-af-dc" }, t("div", { class: `forge-v3-af-dot ${R}` }), g < ue.length - 1 ? t("div", { class: "forge-v3-af-line" }) : null),
                t(
                  "div",
                  { class: "forge-v3-af-content" },
                  t("div", { class: "forge-v3-af-row" }, t("span", { class: `forge-v3-af-actor ${R === "me" ? "me" : "ag"}` }, H), t("span", { class: "forge-v3-af-time" }, `#${g + 1}`)),
                  t("pre", { class: "forge-v3-af-snippet forge-v3-live-snippet" }, i.text)
                )
              );
            }) : t("p", { class: "forge-v3-empty" }, "Waiting for agent output…")
          )
        )
      )
    ) : null,
    D ? t(
      "div",
      { class: "forge-v3-plan-sidecar-wrap", role: "dialog", "aria-modal": "false", "aria-label": C ? "Code review sidecar" : "Diff viewer" },
      t(
        "section",
        { class: `forge-v3-plan-modal forge-v3-plan-sidecar forge-v3-diff-sidecar ${C ? "forge-v3-code-review-sidecar" : ""}` },
        t(
          "header",
          null,
          t("div", null, t("div", { class: "forge-v3-issue-meta" }, C ? "Code review · " : "Diff · ", (o == null ? void 0 : o.linear_id) ?? `Issue #${e}`), t("h2", null, (o == null ? void 0 : o.title) ?? "Diff")),
          t("button", { type: "button", onClick: () => $(!1), "aria-label": "Close diff" }, "×")
        ),
        C ? t(
          "section",
          { class: "forge-v3-review-tour" },
          t(
            "div",
            null,
            t("strong", null, "AI tour"),
            t("p", null, ((Zn = L == null ? void 0 : L.tour) == null ? void 0 : Zn.summary) ?? m ?? "Tour summary unavailable")
          ),
          t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => $r(!!(L != null && L.tour)) }, L != null && L.tour ? "Regenerate tour" : "Generate tour"),
          (ta = (ea = L == null ? void 0 : L.tour) == null ? void 0 : ea.highlights) != null && ta.length ? t("ul", null, L.tour.highlights.map((i) => t("li", null, typeof i == "string" ? i : [i.title ? t("b", null, i.title, ": ") : null, i.text ?? i.file ?? "Highlight", i.file ? ` (${i.file}${i.line ? `:${i.line}` : ""})` : ""]))) : null
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
                { key: i.path, type: "button", class: (_e == null ? void 0 : _e.path) === i.path ? "active" : "", title: i.path, onClick: () => N(i.path) },
                t("span", null, C ? t("span", { class: "forge-v3-reviewed-file" }, t("input", { type: "checkbox", checked: x.includes(i.path), onClick: (g) => g.stopPropagation(), onChange: () => Mn(i.path) }), Ra(i.path)) : Ra(i.path)),
                t("small", { class: "forge-v3-diff-file-counts" }, t("span", { class: "add" }, `+${i.additions}`), " ", t("span", { class: "del" }, `−${i.deletions}`), le.some((g) => g.file === i.path) ? " · comments" : "")
              ))
            ),
            t(
              "section",
              { class: "forge-v3-diff-main" },
              _e ? t(
                "article",
                { class: "forge-v3-diff-file" },
                t("header", null, t("strong", { title: _e.path }, _e.path), t("span", null, `+${_e.additions} −${_e.deletions}`), C ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => Mn(_e.path) }, x.includes(_e.path) ? "Reviewed ✓" : "Mark reviewed") : null),
                t(
                  "div",
                  { class: "forge-v3-diff-table-wrap" },
                  t(
                    "table",
                    { class: "forge-v3-diff-table" },
                    t("tbody", null, _e.hunks.map((i, g) => t(
                      "tr",
                      { key: `${g}-${i.slice(0, 12)}`, class: `forge-v3-diff-line ${Jo(i)}` },
                      t("td", { class: "forge-v3-diff-ln" }, C ? t("button", { type: "button", title: "Add line comment", onClick: () => an(_e.path, g + 1) }, String(g + 1)) : String(g + 1)),
                      t("td", { class: "forge-v3-diff-sign" }, zo(i)),
                      t("td", { class: "forge-v3-diff-content" }, t("code", null, i.replace(/^[+-]/, "")))
                    )))
                  )
                ),
                C ? t("button", { type: "button", class: "forge-v3-inline-comment-button", onClick: () => an(_e.path, null) }, "+ Add file comment") : null
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
            t("textarea", { rows: 3, placeholder: "Summarize concerns, test asks, or approval notes…", value: ge, onInput: (i) => he(i.target.value) }),
            le.length ? t("div", { class: "forge-v3-review-comments" }, le.map((i) => t("span", { key: i.id }, `${i.file}${i.line ? `:${i.line}` : ""} — ${i.body}`))) : null
          ) : null,
          t(
            "div",
            { class: "forge-v3-dp-actions" },
            C && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-success", onClick: () => Hn("approved") }, "✓ Approve code") : null,
            C && ft ? t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", onClick: () => Hn("rejected") }, "✗ Request changes") : null,
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => $(!1) }, "Close")
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
          t("button", { type: "button", onClick: () => ke(!1), "aria-label": "Close jump to state" }, "×")
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
              { key: i.state, type: "button", class: `forge-v3-jump-state-option ${i.risky ? "risky" : ""} ${i.destructive ? "destructive" : ""}`, onClick: () => Nr(i) },
              t("strong", null, i.label),
              t("code", null, i.state),
              t("span", null, i.hint),
              i.risky ? t("em", null, "Requires confirmation") : null
            ))
          )
        ),
        t("footer", null, t("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => ke(!1) }, "Cancel"))
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
            t("button", { type: "button", class: "forge-v3-da forge-v3-da-danger", disabled: !(o != null && o.id) || ye(ut), onClick: Sr }, "Remove issue")
          )
        )
      )
    )
  );
}
const fr = "forge.v3.detailPanelWidth", $a = 500, qi = 440, Bi = 760;
function pr(e) {
  return Math.min(Bi, Math.max(qi, Math.round(e)));
}
function ji() {
  const e = window.localStorage.getItem(fr), n = e ? Number(e) : $a;
  return Number.isFinite(n) ? pr(n) : $a;
}
function Xi() {
  var Fe;
  const e = Xt(), [n, a] = E(Aa), [r, s] = E({ issues: [], decisions: [], runningAgents: [] }), [l, c] = E([]), [p, f] = E(e.view === "queue" ? e.issueId : null), [d, h] = E(0), [k, u] = E(e.view), [y, v] = E(!1), [b, S] = E(""), [W, I] = E(null), D = qe(/* @__PURE__ */ new Map()), [$, M] = E(0), [F, q] = E(e.addIssue), [te, Y] = E(!1), [U, N] = E(ji), [C, B] = E("connecting"), [L, ne] = E(!1), [m, A] = E(() => Ei()), x = qe(!1), K = qe(/* @__PURE__ */ new Set()), le = qe(p), me = qe({ issues: [], decisions: [], runningAgents: [] }), ge = (_, T) => {
    if (!T) return "";
    const G = _.issues.find((X) => X.id === T), V = _.decisions.filter((X) => X.issue_id === T).map((X) => [X.id, X.type, X.created_at, X.resolved_at, X.artifact_ref].join(":")).sort().join(",");
    return `${(G == null ? void 0 : G.state) ?? ""}|${(G == null ? void 0 : G.updated_at) ?? ""}|${V}`;
  }, he = (_ = !1) => {
    const T = [
      de("/api/overview"),
      de("/api/settings"),
      _ ? de("/api/archive").catch(() => []) : Promise.resolve([])
    ];
    return Promise.all(T).then(([G, V, X]) => {
      const J = pi(G), ae = D.current;
      for (const o of J.issues) {
        const Z = ae.get(o.id);
        Z && Z !== "DONE" && o.state === "DONE" && (I(o), setTimeout(() => I(null), 6e3)), ae.set(o.id, o.state ?? "");
      }
      me.current = J, s(J);
      const ve = _ ? X.length : n.archiveCount;
      return a({ ...Pi(J, V), archiveCount: ve }), J.decisions.forEach((o) => {
        K.current.has(o.id) || (K.current.add(o.id), Ni(o, J.issues.find((Z) => Z.id === o.issue_id), x.current).catch(() => {
        }));
      }), J;
    });
  }, be = qe(/* @__PURE__ */ (() => {
    let _ = null;
    return () => {
      _ && clearTimeout(_), _ = setTimeout(() => he(), 300);
    };
  })()), oe = (_, T) => {
    S(`${_}…`), T().then(() => he()).then(() => {
      M((G) => G + 1), S(`${_} complete`);
    }).catch((G) => {
      S(`${_} failed`);
      const V = G instanceof Error ? G.message : String(G);
      Ri({ title: `${_} failed`, message: V });
    });
  }, $e = (_, T, G) => {
    const V = {
      approved: { PLAN_REVIEW: "WORKING", CODE_REVIEW: "CREATING_PR", FIX_APPROVAL: "FIXING", SPLIT_APPROVAL: "SPLITTING" },
      rejected: { PLAN_REVIEW: "PLANNING", CODE_REVIEW: "WORKING", FIX_APPROVAL: "WATCHING_PR", SPLIT_APPROVAL: "WATCHING_PR" }
    };
    s((X) => {
      var ve;
      const J = X.decisions.find((o) => o.id === _), ae = J != null && J.type ? (ve = V[T]) == null ? void 0 : ve[J.type] : void 0;
      return {
        ...X,
        decisions: X.decisions.filter((o) => o.id !== _),
        issues: ae && J ? X.issues.map((o) => o.id === J.issue_id ? { ...o, state: ae } : o) : X.issues
      };
    }), oe(
      T === "approved" ? "Decision approved" : "Decision changes requested",
      () => vi(_, T, G).catch((X) => {
        const J = X instanceof Error ? X.message : String(X);
        if (!(J.includes("409") || J.toLowerCase().includes("already resolved")))
          throw s((ae) => ({
            ...ae,
            decisions: ae.decisions.some((ve) => ve.id === _) ? ae.decisions : [...ae.decisions, { id: _ }]
          })), X;
      })
    );
  }, We = (_, T, G) => oe(`Issue ${T}`, () => _i(_, T, G)), De = (_) => oe("Issue removed", () => mi(_).then(() => ue())), ke = (_) => hi(_), Ie = async () => {
    await bt({ title: "Stop VM runtime?", message: "Stop the VM/runtime used by Forge. Running app processes may be terminated.", confirmText: "Stop VM", danger: !0 }) && oe("VM runtime stopped", () => bi());
  }, Oe = (_) => oe("PR stack synced", () => ki(_)), P = (_, T, G) => oe("PR feedback added", () => yi(_, T, G)), j = (_) => {
    f(_), u("queue"), window.requestAnimationFrame(() => rt("queue", { issueId: _ }));
  }, ue = () => {
    f(null), rt("queue");
  }, ie = (_, T) => {
    f(_), u("queue"), h((G) => G + 1), rt("queue", { issueId: _ });
  }, et = () => {
    const _ = fi(r.decisions, r.issues);
    _ && ie(_.issue_id, _.id);
  }, st = () => {
    u("queue"), q(!0), Kt({ view: "queue", add: "issue" }, !1);
  }, lt = () => {
    q(!1), Kt({ add: null });
  }, tt = () => oe("Linear backlog refreshed", () => de("/api/linear/issues").then((_) => c(Array.isArray(_) ? _ : []))), Nt = (_, T = "", G) => oe("Manual issue created", () => Ii(_, T, G).then((V) => {
    V.issueId && j(V.issueId);
  })), nt = (_, T = "", G) => oe(`Enqueued ${_}`, () => Ai(_, T, G).then((V) => {
    V.issueId && j(V.issueId);
  }).then(() => de("/api/linear/issues")).then((V) => c(Array.isArray(V) ? V : []))), Zt = () => {
    if (L) {
      S("Sending desktop companion notification…"), cr("Forge notifications enabled", "Desktop companion notifications are available", "forge-desktop-test").then(() => S("Desktop companion notification sent")).catch(() => S("Desktop companion notification failed"));
      return;
    }
    if (!$n()) {
      A("unsupported");
      return;
    }
    window.Notification.requestPermission().then((_) => A(_));
  }, ct = (_) => {
    u(_), f(null), rt(_);
  }, en = (_) => {
    _.preventDefault(), document.body.classList.add("forge-v3-resizing-detail");
    const T = (V) => N(pr(window.innerWidth - V.clientX)), G = () => {
      document.body.classList.remove("forge-v3-resizing-detail"), window.removeEventListener("pointermove", T), window.removeEventListener("pointerup", G), window.removeEventListener("pointercancel", G);
    };
    window.addEventListener("pointermove", T), window.addEventListener("pointerup", G), window.addEventListener("pointercancel", G);
  };
  z(() => {
    document.documentElement.style.setProperty("--panel-w", `${U}px`), window.localStorage.setItem(fr, String(U));
  }, [U]), z(() => {
    le.current = p;
  }, [p]), z(() => {
    if (!b || b.endsWith("…")) return;
    const _ = window.setTimeout(() => S(""), 3500);
    return () => window.clearTimeout(_);
  }, [b]), z(() => {
    let _ = !1;
    return wi().then((T) => {
      if (_) return;
      const G = !!T.notifications;
      x.current = G, ne(G);
    }).catch(() => {
      _ || (x.current = !1, ne(!1));
    }), () => {
      _ = !0;
    };
  }, []), z(() => {
    const _ = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === "k" && (T.preventDefault(), v((G) => !G)), T.key === "Escape" && v(!1);
    };
    return window.addEventListener("keydown", _), () => window.removeEventListener("keydown", _);
  }, []), z(() => {
    const _ = () => {
      const T = Xt();
      u(T.view), f(T.issueId), q(T.addIssue), (T.decisionId || T.panel === "review") && h((G) => G + 1);
    };
    return window.addEventListener("hashchange", _), window.addEventListener("popstate", _), () => {
      window.removeEventListener("hashchange", _), window.removeEventListener("popstate", _);
    };
  }, []), z(() => {
    let _ = !1;
    const T = () => {
      he(!0).catch(() => {
        _ || a(Aa);
      });
    };
    T(), de("/api/linear/issues").then((V) => {
      _ || c(Array.isArray(V) ? V : []);
    }).catch(() => {
    });
    const G = window.setInterval(T, C === "offline" ? 1e4 : 3e4);
    return () => {
      _ = !0, window.clearInterval(G);
    };
  }, [C]), z(() => {
    if (Je()) return;
    let _ = !1;
    const T = new EventSource("/api/events"), G = (V) => {
      const X = V.type === "issue_updated" || V.type === "issue_removed", J = le.current, ae = ge(me.current, J);
      if (V.type === "tick") {
        be.current();
        return;
      }
      he(X).then((ve) => {
        J && ge(ve, J) !== ae && M((o) => o + 1);
      }).catch(() => {
      });
    };
    return T.onopen = () => {
      _ || B("live");
    }, T.onerror = () => {
      _ || B("offline");
    }, ["tick", "issue_added", "issue_removed", "issue_updated", "decision_resolved"].forEach((V) => {
      T.addEventListener(V, G);
    }), () => {
      _ = !0, T.close();
    };
  }, []);
  const dt = p ? r.issues.find((_) => _.id === p) ?? null : null;
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
        yt.slice(0, 2).map(
          (_) => t(
            "button",
            { key: _.key, type: "button", class: `forge-v3-nav-item ${k === _.key ? "active" : ""}`, "data-view": _.key, onClick: () => {
              u(_.key), f(null), rt(_.key);
            } },
            t("span", { class: "forge-v3-nav-icon", "aria-hidden": "true" }, _.icon),
            t("span", { class: "forge-v3-nav-label" }, _.label),
            _.key === "queue" && n.awaitingDecisionsCount > 0 ? t("span", { class: "forge-v3-nav-badge", "aria-label": `${n.awaitingDecisionsCount} pending decisions` }, String(n.awaitingDecisionsCount)) : _.key === "archive" ? t("span", { class: "forge-v3-nav-count" }, String(n.archiveCount)) : null
          )
        ),
        t("div", { class: "forge-v3-nav-section" }, "TOOLS"),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => v(!0) }, t("span", { class: "forge-v3-nav-icon" }, "⌘"), t("span", { class: "forge-v3-nav-label" }, "Command palette"), t("kbd", null, "⌘K")),
        t("button", { type: "button", class: "forge-v3-nav-item", onClick: () => Y(!0) }, t("span", { class: "forge-v3-nav-icon" }, "📋"), t("span", { class: "forge-v3-nav-label" }, "Handover report")),
        yt.slice(2).map(
          (_) => t(
            "button",
            { key: _.key, type: "button", class: `forge-v3-nav-item ${k === _.key ? "active" : ""}`, "data-view": _.key, onClick: () => {
              u(_.key), f(null), rt(_.key);
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
            Array.from({ length: Math.max(n.concurrencyLimit, n.runningAgentsCount) }).slice(0, 8).map((_, T) => t("span", { class: T < n.runningAgentsCount ? "active" : "" }))
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
        t("div", { class: `forge-v3-session-chip event-${C}` }, C === "live" ? "● Live events" : C === "offline" ? "○ Events offline · polling" : "◌ Connecting events"),
        t("button", { type: "button", class: `forge-v3-notification-toggle ${L ? "desktop" : "browser"}`, disabled: !L && (m === "unsupported" || m === "denied" || m === "granted"), onClick: Zt }, L ? "🔔 Desktop companion" : m === "granted" ? "🔔 Browser notifications on" : m === "denied" ? "🔕 Notifications blocked" : m === "unsupported" ? "🔕 Notifications unavailable" : "🔔 Enable browser notifications"),
        t("div", { class: "forge-v3-session-chip" }, L ? "● Native notifications available" : "○ Browser notification fallback"),
        t("div", { class: "forge-v3-session-chip" }, "● Workspace · ", n.model),
        t("div", { class: "forge-v3-model-row" }, "🤖 ", n.backend)
      )
    ),
    b ? t("div", { class: "forge-v3-action-status", role: "status" }, b) : null,
    W ? t("div", { class: "forge-v3-celebration", role: "status" }, t("strong", null, "🎉 ", W.linear_id ?? `Issue #${W.id}`, " completed!"), t("small", null, W.title ?? "Issue merged and archived")) : null,
    k === "queue" ? t(xi, { issues: r.issues, decisions: r.decisions, linearBacklog: l, selectedIssueId: p, addIssueOpen: F, onOpenIssue: j, onIssueAction: We, onResolveDecision: $e, onReviewNext: et, onReviewIssue: ie, onAddIssue: st, onCloseAddIssue: lt, onRefreshLinear: tt, onCreateManualIssue: Nt, onEnqueueLinear: nt }) : k === "archive" ? t(Vi, null) : k === "settings" ? t(Wi, null) : k === "prompts" ? t(Oi, null) : k === "learnings" ? t(Di, null) : t("main", { class: "forge-v3-main", "data-active-view": k }, t("h1", null, ((Fe = yt.find((_) => _.key === k)) == null ? void 0 : Fe.label) ?? "Dashboard"), t("p", { class: "forge-v3-empty" }, "This v3 view will migrate in a later phase.")),
    t(Hi, { issueId: k === "queue" ? p : null, issuePreview: dt, reloadKey: $, autoOpenDiffKey: d, onClose: ue, onPanelResizeStart: en, onIssueAction: We, onRemoveIssue: De, onLaunchRuntime: ke, onStopVm: Ie, onSyncPrs: Oe, onSubmitFeedback: P, onResolveDecision: $e }),
    t(Li, { open: y, decisions: r.decisions, onClose: () => v(!1), onNavigate: ct, onRefresh: () => he(), onOpenIssue: j, onReviewNext: et, onAddIssue: st, onStopVm: Ie, onHandoverReport: () => Y(!0) }),
    te ? t(ur, { onClose: () => Y(!1) }) : null,
    n.runningAgentsCount > 0 ? t(Ci, { status: n, onStopVm: Ie }) : null
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
const vn = document.getElementById("forge-react-root");
vn && (Qe(t(Xi, null), vn), vn.dataset.reactiveDashboardMounted = "true");
