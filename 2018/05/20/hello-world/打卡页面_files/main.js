! function(e, t) {
    function n(t) {
        this.opt = t, this.obj = e.querySelector(this.opt.id), this.carouselInner = this.obj.querySelectorAll(".carousel-inner")[0], this.innerItems = this.obj.querySelectorAll(".item"), this.arrlen = this.innerItems.length, this.index = 1, this.setIndicators(), "interval" in this.opt && this.opt.interval > 16 && (this.runCarousel = setInterval(this.toRun.bind(this), this.opt.interval))
    }

    function i(t, n) {
        function i() {
            for (var e = s.querySelectorAll(".box"), t = 0; t < e.length; t++) a(e[t], e[t].getAttribute("data-num"))
        }

        function a(e, t) {
            e && (t = -1 * parseInt(t), e.style.top = 2 * t + "rem")
        }
        if (t) {
            var s = e.querySelector(t),
                r = n || s.getAttribute("data-num").toString();
            n && s.setAttribute("data-num", n), s.innerHTML = "";
            for (var o = 0; o < r.length; o++) {
                var l = e.createElement("div"),
                    d = r.substr(o, 1);
                l.innerHTML = '<div class="box" data-num="' + d + '"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>', l.className = "num", s.appendChild(l)
            }
            setTimeout(i, 1e3)
        }
    }
    window.onload = function() {
        function a(e) {
            var t = "";
            r.isIos ? t = statInfo.download.ios : r.isAndroid && (t = statInfo.download.android), bcz.ajax({
                url: t,
                type: "get",
                success: function(e) {
                    console.log(e)
                }
            })
        }
        var s = e.querySelector("#downloadBtn"),
            r = function() {
                return {
                    isIos: /(iphone|ipad|ipod)/i.test(navigator.userAgent.toLocaleLowerCase()),
                    isAndroid: /(android)/i.test(navigator.userAgent.toLocaleLowerCase())
                }
            }(),
            o = t.bcz.getQueryParams(t.location.search);
        new n({
            id: "#carousel"
        });
        r.isIos && (s.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jiongji.andriod.card&g_f=991653"), "bcz" in t && (bcz.stat(statInfo.stat), s.addEventListener("click", a)), setTimeout(function() {
            i("#today", o.today)
        }, 500), setTimeout(function() {
            i("#days", o.days)
        }, 1500)
    }, n.prototype.setIndicators = function() {
        function e(e) {
            "preventDefault" in e ? e.preventDefault() : e.returnValue = !1;
            var t = o ? e.touches[0] : e;
            l = t.pageX, d = t.pageY, c = !1
        }

        function t(e) {
            var t = o ? e.changedTouches[0] : e,
                a = t.pageX - l,
                s = t.pageY - d,
                r = 0;
            if (c) return "preventDefault" in e ? e.preventDefault() : e.returnValue = !1, !1;
            var h = document.body.scrollTop - s;
            return u > 0 && h > 5 && u >= h && (document.body.scrollTop = h), a >= 50 ? ("preventDefault" in e ? e.preventDefault() : e.returnValue = !1, l = t.pageX, c = !0, r = i.index - 1, 0 > r && (r = i.arrlen - 1), n(r), !1) : -50 >= a ? ("preventDefault" in e ? e.preventDefault() : e.returnValue = !1, l = t.pageX, c = !0, r = i.index + 1, r >= i.arrlen && (r = 0), n(r), !1) : !1
        }

        function n(e) {
            "runCarousel" in i && clearInterval(i.runCarousel);
            var t = parseInt("number" == typeof e ? e : this.getAttribute("data-slide-to")),
                n = t < i.index || t - i.index + 1 === i.arrlen ? !0 : !1;
            t - i.index - 1 === -i.arrlen && (n = !1);
            var a = n ? -1 : 1,
                s = function(e) {
                    return (t + e) % i.arrlen < 0 ? (t + e) % i.arrlen + i.arrlen : (t + e) % i.arrlen
                },
                r = s(-a),
                o = s(-2 * a),
                l = s(a),
                d = {
                    activeCls: n ? "active-left" : "active-right",
                    hideCls: n ? "hide-left" : "hide-right",
                    oldHideRight: n ? "old-hide-left" : "old-hide-right",
                    oldInRight: n ? "old-in-right" : "old-in-left"
                };
            if (r != i.index)
                for (var c = 0; c < i.arrlen; c++) i.innerItems[c].className = "item", i.indicatorsItem[c].className = "";
            i.innerItems[r].className = "item " + d.hideCls, i.indicatorsItem[r].className = "", i.innerItems[t].className = "item " + d.activeCls, i.indicatorsItem[t].className = "active", i.innerItems[o].className = "item " + d.oldHideRight, i.innerItems[l].className = "item " + d.oldInRight, i.index = t, "interval" in i.opt && i.opt.interval > 16 && (i.runCarousel = setInterval(i.toRun.bind(i), i.opt.interval))
        }
        var i = this;
        this.indicators = this.obj.querySelectorAll(".carousel-indicators")[0];
        for (var a = "", s = 0; s < this.arrlen; s++) a += "<li data-slide-to=" + s + ' class="' + (s == i.index ? "active" : "") + '"></li>';
        this.indicators.innerHTML = a, this.indicatorsItem = this.indicators.querySelectorAll("li");
        for (var r = 0; r < this.arrlen; r++) this.indicatorsItem[r].addEventListener("click", n);
        this.carouselInner.addEventListener("touchstart", e), this.carouselInner.addEventListener("touchmove", t);
        var o = "ontouchstart" in window && !/hp-tablet/gi.test(navigator.appVersion),
            l = 0,
            d = 0,
            c = !1,
            u = document.body.scrollHeight - window.innerHeight
    }, n.prototype.toRun = function() {
        this.index++, this.index >= this.arrlen ? (this.index = 0, this.innerItems[this.arrlen - 1].className = "item", this.indicatorsItem[this.arrlen - 1].className = "") : (this.innerItems[this.index - 1].className = "item", this.indicatorsItem[this.index - 1].className = ""), this.innerItems[this.index].className = "item active", this.indicatorsItem[this.index].className = "active"
    }
}(document, window);
