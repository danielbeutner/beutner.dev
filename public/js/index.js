(function () {
    'use strict';

    var n$1, l, u, t$1, r, o, e = {
    }, c = [], s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    function a(n1, l1) {
        for(var u in l1)n1[u] = l1[u];
        return n1;
    }
    function h(n2) {
        var l2 = n2.parentNode;
        l2 && l2.removeChild(n2);
    }
    function v(l3, u1, i1) {
        var t1, r1, o1, f1 = {
        };
        for(o1 in u1)"key" == o1 ? t1 = u1[o1] : "ref" == o1 ? r1 = u1[o1] : f1[o1] = u1[o1];
        if (arguments.length > 2 && (f1.children = arguments.length > 3 ? n$1.call(arguments, 2) : i1), "function" == typeof l3 && null != l3.defaultProps) for(o1 in l3.defaultProps)void 0 === f1[o1] && (f1[o1] = l3.defaultProps[o1]);
        return y(l3, f1, t1, r1, null);
    }
    function y(n3, i2, t2, r2, o2) {
        var f2 = {
            type: n3,
            props: i2,
            key: t2,
            ref: r2,
            __k: null,
            __: null,
            __b: 0,
            __e: null,
            __d: void 0,
            __c: null,
            __h: null,
            constructor: void 0,
            __v: null == o2 ? ++u : o2
        };
        return null == o2 && null != l.vnode && l.vnode(f2), f2;
    }
    function d(n4) {
        return n4.children;
    }
    function _(n5, l4) {
        this.props = n5, this.context = l4;
    }
    function k(n6, l5) {
        if (null == l5) return n6.__ ? k(n6.__, n6.__.__k.indexOf(n6) + 1) : null;
        for(var u2; l5 < n6.__k.length; l5++)if (null != (u2 = n6.__k[l5]) && null != u2.__e) return u2.__e;
        return "function" == typeof n6.type ? k(n6) : null;
    }
    function b(n7) {
        var l6, u3;
        if (null != (n7 = n7.__) && null != n7.__c) {
            for(n7.__e = n7.__c.base = null, l6 = 0; l6 < n7.__k.length; l6++)if (null != (u3 = n7.__k[l6]) && null != u3.__e) {
                n7.__e = n7.__c.base = u3.__e;
                break;
            }
            return b(n7);
        }
    }
    function m(n8) {
        (!n8.__d && (n8.__d = !0) && t$1.push(n8) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(g);
    }
    function g() {
        for(var n9; g.__r = t$1.length;)n9 = t$1.sort(function(n10, l7) {
            return n10.__v.__b - l7.__v.__b;
        }), t$1 = [], n9.some(function(n11) {
            var l8, u4, i3, t3, r3, o3;
            n11.__d && (r3 = (t3 = (l8 = n11).__v).__e, (o3 = l8.__P) && (u4 = [], (i3 = a({
            }, t3)).__v = t3.__v + 1, j(o3, t3, i3, l8.__n, void 0 !== o3.ownerSVGElement, null != t3.__h ? [
                r3
            ] : null, u4, null == r3 ? k(t3) : r3, t3.__h), z(u4, t3), t3.__e != r3 && b(t3)));
        });
    }
    function w(n12, l9, u5, i4, t4, r4, o4, f3, s1, a1) {
        var h1, v1, p1, _1, b1, m1, g1, w1 = i4 && i4.__k || c, A1 = w1.length;
        for(u5.__k = [], h1 = 0; h1 < l9.length; h1++)if (null != (_1 = u5.__k[h1] = null == (_1 = l9[h1]) || "boolean" == typeof _1 ? null : "string" == typeof _1 || "number" == typeof _1 || "bigint" == typeof _1 ? y(null, _1, null, null, _1) : Array.isArray(_1) ? y(d, {
            children: _1
        }, null, null, null) : _1.__b > 0 ? y(_1.type, _1.props, _1.key, null, _1.__v) : _1)) {
            if (_1.__ = u5, _1.__b = u5.__b + 1, null === (p1 = w1[h1]) || p1 && _1.key == p1.key && _1.type === p1.type) w1[h1] = void 0;
            else for(v1 = 0; v1 < A1; v1++){
                if ((p1 = w1[v1]) && _1.key == p1.key && _1.type === p1.type) {
                    w1[v1] = void 0;
                    break;
                }
                p1 = null;
            }
            j(n12, _1, p1 = p1 || e, t4, r4, o4, f3, s1, a1), b1 = _1.__e, (v1 = _1.ref) && p1.ref != v1 && (g1 || (g1 = []), p1.ref && g1.push(p1.ref, null, _1), g1.push(v1, _1.__c || b1, _1)), null != b1 ? (null == m1 && (m1 = b1), "function" == typeof _1.type && _1.__k === p1.__k ? _1.__d = s1 = x(_1, s1, n12) : s1 = P(n12, _1, p1, w1, b1, s1), "function" == typeof u5.type && (u5.__d = s1)) : s1 && p1.__e == s1 && s1.parentNode != n12 && (s1 = k(p1));
        }
        for(u5.__e = m1, h1 = A1; h1--;)null != w1[h1] && ("function" == typeof u5.type && null != w1[h1].__e && w1[h1].__e == u5.__d && (u5.__d = k(i4, h1 + 1)), N(w1[h1], w1[h1]));
        if (g1) for(h1 = 0; h1 < g1.length; h1++)M(g1[h1], g1[++h1], g1[++h1]);
    }
    function x(n13, l10, u6) {
        for(var i5, t5 = n13.__k, r5 = 0; t5 && r5 < t5.length; r5++)(i5 = t5[r5]) && (i5.__ = n13, l10 = "function" == typeof i5.type ? x(i5, l10, u6) : P(u6, i5, i5, t5, i5.__e, l10));
        return l10;
    }
    function P(n16, l12, u7, i6, t6, r6) {
        var o5, f4, e1;
        if (void 0 !== l12.__d) o5 = l12.__d, l12.__d = void 0;
        else if (null == u7 || t6 != r6 || null == t6.parentNode) n: if (null == r6 || r6.parentNode !== n16) n16.appendChild(t6), o5 = null;
        else {
            for(f4 = r6, e1 = 0; (f4 = f4.nextSibling) && e1 < i6.length; e1 += 2)if (f4 == t6) break n;
            n16.insertBefore(t6, r6), o5 = r6;
        }
        return void 0 !== o5 ? o5 : t6.nextSibling;
    }
    function C(n17, l13, u8, i7, t7) {
        var r7;
        for(r7 in u8)"children" === r7 || "key" === r7 || r7 in l13 || H(n17, r7, null, u8[r7], i7);
        for(r7 in l13)t7 && "function" != typeof l13[r7] || "children" === r7 || "key" === r7 || "value" === r7 || "checked" === r7 || u8[r7] === l13[r7] || H(n17, r7, l13[r7], u8[r7], i7);
    }
    function $(n18, l14, u9) {
        "-" === l14[0] ? n18.setProperty(l14, u9) : n18[l14] = null == u9 ? "" : "number" != typeof u9 || s.test(l14) ? u9 : u9 + "px";
    }
    function H(n19, l15, u10, i8, t8) {
        var r8;
        n: if ("style" === l15) if ("string" == typeof u10) n19.style.cssText = u10;
        else {
            if ("string" == typeof i8 && (n19.style.cssText = i8 = ""), i8) for(l15 in i8)u10 && l15 in u10 || $(n19.style, l15, "");
            if (u10) for(l15 in u10)i8 && u10[l15] === i8[l15] || $(n19.style, l15, u10[l15]);
        }
        else if ("o" === l15[0] && "n" === l15[1]) r8 = l15 !== (l15 = l15.replace(/Capture$/, "")), l15 = l15.toLowerCase() in n19 ? l15.toLowerCase().slice(2) : l15.slice(2), n19.l || (n19.l = {
        }), n19.l[l15 + r8] = u10, u10 ? i8 || n19.addEventListener(l15, r8 ? T : I, r8) : n19.removeEventListener(l15, r8 ? T : I, r8);
        else if ("dangerouslySetInnerHTML" !== l15) {
            if (t8) l15 = l15.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
            else if ("href" !== l15 && "list" !== l15 && "form" !== l15 && "tabIndex" !== l15 && "download" !== l15 && l15 in n19) try {
                n19[l15] = null == u10 ? "" : u10;
                break n;
            } catch (n) {
            }
            "function" == typeof u10 || (null != u10 && (!1 !== u10 || "a" === l15[0] && "r" === l15[1]) ? n19.setAttribute(l15, u10) : n19.removeAttribute(l15));
        }
    }
    function I(n20) {
        this.l[n20.type + !1](l.event ? l.event(n20) : n20);
    }
    function T(n21) {
        this.l[n21.type + !0](l.event ? l.event(n21) : n21);
    }
    function j(n22, u11, i9, t9, r9, o6, f5, e2, c1) {
        var s2, h2, v2, y1, p2, k1, b2, m2, g2, x1, A2, P1 = u11.type;
        if (void 0 !== u11.constructor) return null;
        null != i9.__h && (c1 = i9.__h, e2 = u11.__e = i9.__e, u11.__h = null, o6 = [
            e2
        ]), (s2 = l.__b) && s2(u11);
        try {
            n: if ("function" == typeof P1) {
                if (m2 = u11.props, g2 = (s2 = P1.contextType) && t9[s2.__c], x1 = s2 ? g2 ? g2.props.value : s2.__ : t9, i9.__c ? b2 = (h2 = u11.__c = i9.__c).__ = h2.__E : ("prototype" in P1 && P1.prototype.render ? u11.__c = h2 = new P1(m2, x1) : (u11.__c = h2 = new _(m2, x1), h2.constructor = P1, h2.render = O), g2 && g2.sub(h2), h2.props = m2, h2.state || (h2.state = {
                }), h2.context = x1, h2.__n = t9, v2 = h2.__d = !0, h2.__h = []), null == h2.__s && (h2.__s = h2.state), null != P1.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = a({
                }, h2.__s)), a(h2.__s, P1.getDerivedStateFromProps(m2, h2.__s))), y1 = h2.props, p2 = h2.state, v2) null == P1.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
                else {
                    if (null == P1.getDerivedStateFromProps && m2 !== y1 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, x1), !h2.__e && null != h2.shouldComponentUpdate && !1 === h2.shouldComponentUpdate(m2, h2.__s, x1) || u11.__v === i9.__v) {
                        h2.props = m2, h2.state = h2.__s, u11.__v !== i9.__v && (h2.__d = !1), h2.__v = u11, u11.__e = i9.__e, u11.__k = i9.__k, u11.__k.forEach(function(n23) {
                            n23 && (n23.__ = u11);
                        }), h2.__h.length && f5.push(h2);
                        break n;
                    }
                    null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, x1), null != h2.componentDidUpdate && h2.__h.push(function() {
                        h2.componentDidUpdate(y1, p2, k1);
                    });
                }
                h2.context = x1, h2.props = m2, h2.state = h2.__s, (s2 = l.__r) && s2(u11), h2.__d = !1, h2.__v = u11, h2.__P = n22, s2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s, null != h2.getChildContext && (t9 = a(a({
                }, t9), h2.getChildContext())), v2 || null == h2.getSnapshotBeforeUpdate || (k1 = h2.getSnapshotBeforeUpdate(y1, p2)), A2 = null != s2 && s2.type === d && null == s2.key ? s2.props.children : s2, w(n22, Array.isArray(A2) ? A2 : [
                    A2
                ], u11, i9, t9, r9, o6, f5, e2, c1), h2.base = u11.__e, u11.__h = null, h2.__h.length && f5.push(h2), b2 && (h2.__E = h2.__ = null), h2.__e = !1;
            } else null == o6 && u11.__v === i9.__v ? (u11.__k = i9.__k, u11.__e = i9.__e) : u11.__e = L(i9.__e, u11, i9, t9, r9, o6, f5, c1);
            (s2 = l.diffed) && s2(u11);
        } catch (n24) {
            u11.__v = null, (c1 || null != o6) && (u11.__e = e2, u11.__h = !!c1, o6[o6.indexOf(e2)] = null), l.__e(n24, u11, i9);
        }
    }
    function z(n25, u12) {
        l.__c && l.__c(u12, n25), n25.some(function(u13) {
            try {
                n25 = u13.__h, u13.__h = [], n25.some(function(n26) {
                    n26.call(u13);
                });
            } catch (n27) {
                l.__e(n27, u13.__v);
            }
        });
    }
    function L(l16, u14, i10, t10, r10, o7, f6, c2) {
        var s3, a2, v3, y2 = i10.props, p3 = u14.props, d1 = u14.type, _2 = 0;
        if ("svg" === d1 && (r10 = !0), null != o7) {
            for(; _2 < o7.length; _2++)if ((s3 = o7[_2]) && "setAttribute" in s3 == !!d1 && (d1 ? s3.localName === d1 : 3 === s3.nodeType)) {
                l16 = s3, o7[_2] = null;
                break;
            }
        }
        if (null == l16) {
            if (null === d1) return document.createTextNode(p3);
            l16 = r10 ? document.createElementNS("http://www.w3.org/2000/svg", d1) : document.createElement(d1, p3.is && p3), o7 = null, c2 = !1;
        }
        if (null === d1) y2 === p3 || c2 && l16.data === p3 || (l16.data = p3);
        else {
            if (o7 = o7 && n$1.call(l16.childNodes), a2 = (y2 = i10.props || e).dangerouslySetInnerHTML, v3 = p3.dangerouslySetInnerHTML, !c2) {
                if (null != o7) for(y2 = {
                }, _2 = 0; _2 < l16.attributes.length; _2++)y2[l16.attributes[_2].name] = l16.attributes[_2].value;
                (v3 || a2) && (v3 && (a2 && v3.__html == a2.__html || v3.__html === l16.innerHTML) || (l16.innerHTML = v3 && v3.__html || ""));
            }
            if (C(l16, p3, y2, r10, c2), v3) u14.__k = [];
            else if (_2 = u14.props.children, w(l16, Array.isArray(_2) ? _2 : [
                _2
            ], u14, i10, t10, r10 && "foreignObject" !== d1, o7, f6, o7 ? o7[0] : i10.__k && k(i10, 0), c2), null != o7) for(_2 = o7.length; _2--;)null != o7[_2] && h(o7[_2]);
            c2 || ("value" in p3 && void 0 !== (_2 = p3.value) && (_2 !== y2.value || _2 !== l16.value || "progress" === d1 && !_2) && H(l16, "value", _2, y2.value, !1), "checked" in p3 && void 0 !== (_2 = p3.checked) && _2 !== l16.checked && H(l16, "checked", _2, y2.checked, !1));
        }
        return l16;
    }
    function M(n28, u15, i11) {
        try {
            "function" == typeof n28 ? n28(u15) : n28.current = u15;
        } catch (n29) {
            l.__e(n29, i11);
        }
    }
    function N(n30, u16, i12) {
        var t11, r11;
        if (l.unmount && l.unmount(n30), (t11 = n30.ref) && (t11.current && t11.current !== n30.__e || M(t11, null, u16)), null != (t11 = n30.__c)) {
            if (t11.componentWillUnmount) try {
                t11.componentWillUnmount();
            } catch (n31) {
                l.__e(n31, u16);
            }
            t11.base = t11.__P = null;
        }
        if (t11 = n30.__k) for(r11 = 0; r11 < t11.length; r11++)t11[r11] && N(t11[r11], u16, "function" != typeof n30.type);
        i12 || null == n30.__e || h(n30.__e), n30.__e = n30.__d = void 0;
    }
    function O(n32, l, u17) {
        return this.constructor(n32, u17);
    }
    function S(u18, i13, t12) {
        var r12, o8, f7;
        l.__ && l.__(u18, i13), o8 = (r12 = "function" == typeof t12) ? null : t12 && t12.__k || i13.__k, f7 = [], j(i13, u18 = (!r12 && t12 || i13).__k = v(d, null, [
            u18
        ]), o8 || e, e, void 0 !== i13.ownerSVGElement, !r12 && t12 ? [
            t12
        ] : o8 ? null : i13.firstChild ? n$1.call(i13.childNodes) : null, f7, !r12 && t12 ? t12 : o8 ? o8.__e : i13.firstChild, r12), z(f7, u18);
    }
    n$1 = c.slice, l = {
        __e: function(n39, l22) {
            for(var u22, i16, t14; l22 = l22.__;)if ((u22 = l22.__c) && !u22.__) try {
                if ((i16 = u22.constructor) && null != i16.getDerivedStateFromError && (u22.setState(i16.getDerivedStateFromError(n39)), t14 = u22.__d), null != u22.componentDidCatch && (u22.componentDidCatch(n39), t14 = u22.__d), t14) return u22.__E = u22;
            } catch (l23) {
                n39 = l23;
            }
            throw n39;
        }
    }, u = 0, _.prototype.setState = function(n41, l24) {
        var u23;
        u23 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = a({
        }, this.state), "function" == typeof n41 && (n41 = n41(a({
        }, u23), this.props)), n41 && a(u23, n41), null != n41 && this.__v && (l24 && this.__h.push(l24), m(this));
    }, _.prototype.forceUpdate = function(n42) {
        this.__v && (this.__e = !0, n42 && this.__h.push(n42), m(this));
    }, _.prototype.render = d, t$1 = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g.__r = 0;

    var n = function(t1, s, r, e) {
        var u;
        s[0] = 0;
        for(var h = 1; h < s.length; h++){
            var p = s[h++], a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
            3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {
            }, a) : 5 === p ? (e[1] = e[1] || {
            })[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t1.apply(a, n(t1, a, r, [
                "",
                null
            ])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
        }
        return e;
    }, t = new Map;
    function htm(s1) {
        var r1 = t.get(this);
        return r1 || (r1 = new Map, t.set(this, r1)), (r1 = n(this, r1.get(s1) || (r1.set(s1, r1 = function(n1) {
            for(var t2, s, r = 1, e = "", u = "", h = [
                0
            ], p = function(n2) {
                1 === r && (n2 || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n2, e) : 3 === r && (n2 || e) ? (h.push(3, n2, e), r = 2) : 2 === r && "..." === e && n2 ? h.push(4, n2, 0) : 2 === r && e && !n2 ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n2 && 5 === r) && (h.push(r, 0, e, s), r = 6), n2 && (h.push(r, n2, 0, s), r = 6)), e = "";
            }, a = 0; a < n1.length; a++){
                a && (1 === r && p(), p(a));
                for(var l = 0; l < n1[a].length; l++)t2 = n1[a][l], 1 === r ? "<" === t2 ? (p(), h = [
                    h
                ], r = 3) : e += t2 : 4 === r ? "--" === e && ">" === t2 ? (r = 1, e = "") : e = t2 + e[0] : u ? t2 === u ? u = "" : e += t2 : '"' === t2 || "'" === t2 ? u = t2 : ">" === t2 ? (p(), r = 1) : r && ("=" === t2 ? (r = 5, s = e, e = "") : "/" === t2 && (r < 5 || ">" === n1[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t2 || "\t" === t2 || "\n" === t2 || "\r" === t2 ? (p(), r = 2) : e += t2), 3 === r && "!--" === e && (r = 4, h = h[0]);
            }
            return p(), h;
        }(s1)), r1), arguments, [])).length > 1 ? r1 : r1[0];
    }

    const html = htm.bind(v);
    class Clock extends _ {
        // Called whenever our component is created
        componentDidMount() {
            // update time every second
            this.timer = setInterval(()=>{
                this.setState({
                    time: Date.now()
                });
            }, 1000);
        }
        // Called just before our component will be destroyed
        componentWillUnmount() {
            // stop when not renderable
            clearInterval(this.timer);
        }
        render() {
            let time = new Date().toLocaleTimeString();
            return html`<h1>Hello ${time}!</h1>`;
        }
        constructor(...args){
            super(...args);
            this.state = {
                time: Date.now()
            };
        }
    }
    S(html`<${Clock} />`, document.getElementById('clock'));

})();
