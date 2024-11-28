function digits(val, sd) {
    return val.toFixed(sd)
}

function scale(val, unit) {
    if (unit == "milli") {
        return val * 1e3
    } else if (unit == "micro") {
        return val * 1e6
    } else if (unit == "nano") {
        return val * 1e9
    } else if (unit == "pico") {
        return val * 1e12
    } else if (unit == "femto") {
        return val * 1e15
    } else if (unit == "kilo") {
        return val * 1e-3
    } else if (unit == "mega") {
        return val * 1e-6
    } else if (unit == "giga") {
        return val * 1e-9
    } else if (unit == "tera") {
        return val * 1e-12
    } else {
        return val
    }
}

function unscale(val, unit) {
    if (unit == "milli") {
        return val * 1e-3
    } else if (unit == "micro") {
        return val * 1e-6
    } else if (unit == "nano") {
        return val * 1e-9
    } else if (unit == "pico") {
        return val * 1e-12
    } else if (unit == "femto") {
        return val * 1e-15
    } else if (unit == "kilo") {
        return val * 1e3
    } else if (unit == "mega") {
        return val * 1e6
    } else if (unit == "giga") {
        return val * 1e9
    } else if (unit == "tera") {
        return val * 1e12
    } else {
        return val
    }
}

function scale_imp(val, unit) {
    if (unit == "diff") {
        return val / 2
    }
    return val
}

function print_val(val, unit, sd) {
    if (Number.isFinite(val)) {
        return "" + digits(scale(val, unit), sd)
    }
    return "" + val
}

function print_unit(unit) {
    if (unit == "milli") {
        return "m"
    } else if (unit == "micro") {
        return "μ"
    } else if (unit == "nano") {
        return "n"
    } else if (unit == "pico") {
        return "p"
    } else if (unit == "femto") {
        return "f"
    } else {
        return ""
    }
}

class Config {
    constructor(z0, freq, q, sd, c_unit, l_unit, f_unit, imp_unit, src_ld_unit) {
        this._z0 = parseFloat(z0)
        this.freq = unscale(freq, f_unit)
        this.q = parseFloat(q)
        this.sd = parseInt(sd)
        this.c = c_unit
        this.l = l_unit
        this.f = f_unit
        this.i = imp_unit
        this.srcld = src_ld_unit
    }
    get freq_scaled() {
        return scale(this.freq, this.f)
    }
    get z0() {
        return parseFloat(this._z0).toFixed(this.sd)
    }
    get w() {
        return 2 * Math.PI * this.freq
    }
    set freq_scaled(val) {
        this.freq = unscale(val, this.f)
    }
    set z0(val) {
        this._z0 = parseFloat(val)
    }
}

class Impedance {
    constructor(val) {
        this.config = val
        this._zre = 50
        this._zim = 0

    }
    get zre() {
        return parseFloat(this._zre).toFixed(this.config.sd)
    }
    get zim() {
        return parseFloat(this._zim).toFixed(this.config.sd)
    }
    get z() {
        return [this.zre, this.zim]
    }
    get yre() {
        return this.zre / (this.zre**2 + this.zim**2)
    }
    get yim() {
        return -this.zim / (this.zre**2 + this.zim**2)
    }
    get y() {
        return [this.yre, this.yim]
    }
    get gre() {
        return (this.zre**2 - this.config.z0**2 + this.zim**2) / (this.zre**2 + 2 * this.zre * this.config.z0 + this.config.z0**2 + this.zim**2)
    }
    get gim() {
        return 2 * this.zim * this.config.z0 / (this.zre**2 + 2 * this.zre * this.config.z0 + this.config.z0**2 + this.zim**2)
    }
    get gri() {
        return [this.gre, this.gim]
    }
    get gmag() {
        return Math.sqrt(this.gre**2 + this.gim**2)
    }
    get gang() {
        return Math.atan2(this.gim, this.gre) * 180.0 / Math.PI
    }
    get gmagang() {
        return [this.gmag, this.gang]
    }
    get res() {
        return 1 / this.yre
    }
    get cap() {
        return scale(this.yim / this.config.w, this.config.c)
    }
    get rc() {
        return [this.res, this.cap]
    }
    set zre(val) {
        this._zre = parseFloat(val).toFixed(this.config.sd)
    }
    set zim(val) {
        this._zim = parseFloat(val).toFixed(this.config.sd)
    }
    set y(val) {
        this.zre = val[0] / (val[0]**2 + val[1]**2)
        this.zim = -val[1] / (val[0]**2 + val[1]**2)
    }
    set gri(val) {
        var d

        d = (1 - val[0])**2 + val[1]**2
        this.zre = this.config.z0 * (1 - val[0]**2 - val[1]**2) / d
        this.zim = this.config.z0 * 2 * val[1] / d
    }
    set gmagang(val) {
        this.gri = [val[0] * Math.cos(val[1] * Math.PI / 180.0), val[0] * Math.sin(val[1] * Math.PI / 180.0)]
    }
    set rc(val) {
        this.y = [1 / val[0], unscale(val[1], this.config.c) * this.config.w]
    }
}

class CCLL {
    constructor(id) {
        this.id = id
        this.cs = 0
        this.cl = 0
        this.ls = 0
        this.ll = 0
    }
    write(c, l, sd) {
        document.getElementById(this.id + "_cs_val").value = print_val(this.cs, c, sd)
        document.getElementById(this.id + "_cl_val").value = print_val(this.cl, c, sd)
        document.getElementById(this.id + "_ls_val").value = print_val(this.ls, l, sd)
        document.getElementById(this.id + "_ll_val").value = print_val(this.ll, l, sd)
        const csField = document.getElementById(this.id + "_cs_val")
        const clField = document.getElementById(this.id + "_cl_val")
        const lsField = document.getElementById(this.id + "_ls_val")
        const llField = document.getElementById(this.id + "_ll_val")

        csField.innerHTML = "<div class=\"text_box\">" + print_val(this.cs, c, sd) + "</div>"
        clField.innerHTML = "<div class=\"text_box\">" + print_val(this.cl, c, sd) + "</div>"
        lsField.innerHTML = "<div class=\"text_box\">" + print_val(this.ls, l, sd) + "</div>"
        llField.innerHTML = "<div class=\"text_box\">" + print_val(this.ll, l, sd) + "</div>"
    }
    get valid() {
        if (this.cs < 0 || this.cl < 0 || this.ls < 0 || this.ll < 0 || Number.isNaN(this.cs) || Number.isNaN(this.cl) || Number.isNaN(this.ls) || Number.isNaN(this.ll)) {
            return false
        }
        return true
    }
}

class CLL {
    constructor(id) {
        this.id = id
        this.c = 0
        this.ls = 0
        this.ll = 0
        this.q = 1
    }
    write(c, l, sd) {
        const cField = document.getElementById(this.id + "_c_val")
        const lsField = document.getElementById(this.id + "_ls_val")
        const llField = document.getElementById(this.id + "_ll_val")
        const qField = document.getElementById(this.id + "_q_val")

        cField.value = print_val(this.c, c, sd)
        lsField.value = print_val(this.ls, l, sd)
        llField.value = print_val(this.ll, l, sd)
        qField.value = print_val(this.q, "", sd)
        cField.innerHTML = "<div class=\"text_box\">" + print_val(this.c, c, sd) + "</div>"
        lsField.innerHTML = "<div class=\"text_box\">" + print_val(this.ls, l, sd) + "</div>"
        llField.innerHTML = "<div class=\"text_box\">" + print_val(this.ll, l, sd) + "</div>"
        qField.innerHTML = "<div class=\"text_box\">" + print_val(this.q, "", sd) + "</div>"
    }
    get valid() {
        if (this.c < 0 || this.ls < 0 || this.ll < 0 || Number.isNaN(this.c) || Number.isNaN(this.ls) || Number.isNaN(this.ll)) {
            return false
        }
        return true
    }
}

class CCL {
    constructor(id) {
        this.id = id
        this.cs = 0
        this.cl = 0
        this.l = 0
        this.q = 1
    }
    write(c, l, sd) {
        const csField = document.getElementById(this.id + "_cs_val")
        const clField = document.getElementById(this.id + "_cl_val")
        const lField = document.getElementById(this.id + "_l_val")
        const qField = document.getElementById(this.id + "_q_val")

        csField.innerHTML = "<div class=\"text_box\">" + print_val(this.cs, c, sd) + "</div>"
        clField.innerHTML = "<div class=\"text_box\">" + print_val(this.cl, c, sd) + "</div>"
        lField.innerHTML = "<div class=\"text_box\">" + print_val(this.l, l, sd) + "</div>"
        qField.innerHTML = "<div class=\"text_box\">" + print_val(this.q, "", sd) + "</div>"
    }
    get valid() {
        if (this.cs < 0 || this.cl < 0 || this.l < 0 || Number.isNaN(this.cs) || Number.isNaN(this.cl) || Number.isNaN(this.l)) {
            return false
        }
        return true
    }
}

class CL {
    constructor(id) {
        this.id = id
        this.c = 0
        this.l = 0
        this.q = 1
    }
    write(c, l, sd) {
        const cField = document.getElementById(this.id + "_c_val")
        const lField = document.getElementById(this.id + "_l_val")
        const qField = document.getElementById(this.id + "_q_val")

        cField.innerHTML = "<div class=\"text_box\">" + print_val(this.c, c, sd) + "</div>"
        lField.innerHTML = "<div class=\"text_box\">" + print_val(this.l, l, sd) + "</div>"
        qField.innerHTML = "<div class=\"text_box\">" + print_val(this.q, "", sd) + "</div>"
    }
    get valid() {
        if (this.c < 0 || this.l < 0 || Number.isNaN(this.c) || Number.isNaN(this.l)) {
            return false
        }
        return true
    }
}

class Result {
    constructor(z0, freq, q, sd, c_unit, l_unit, f_unit, imp_unit, src_ld_unit) {
        this.config = new Config(z0, freq, q, sd, c_unit, l_unit, f_unit, imp_unit, src_ld_unit)
        this.src = new Impedance(this.config)
        this.load = new Impedance(this.config)
        this.hp1 = new CCLL("hp1")
        this.hp2 = new CCLL("hp2")
        this.lp1 = new CCLL("lp1")
        this.lp2 = new CCLL("lp2")
        this.bp1 = new CCLL("bp1")
        this.bp2 = new CCLL("bp2")
        this.bp3 = new CCLL("bp3")
        this.bp4 = new CCLL("bp4")
        this.pihp = new CLL("pihp")
        this.pilp = new CCL("pilp")
        this.teehp = new CCL("teehp")
        this.teelp = new CLL("teelp")
        this.ellhpcl = new CL("hpcl")
        this.ellhplc = new CL("hplc")
        this.elllpcl = new CL("lpcl")
        this.elllplc = new CL("lplc")
    }
    get c() {
        return this.config.c
    }
    get f() {
        return this.config.f
    }
    get l() {
        return this.config.l
    }
    get q() {
        return this.config.q
    }
    get z0() {
        return this.config.z0
    }
    get freq() {
        return this.config.freq
    }
    get freq_scaled() {
        return this.config.freq_scaled
    }
    get q() {
        return this.config.q
    }
    get sd() {
        return this.config.sd
    }
    get sdd() {
        return this.config.sd + this.config.sd
    }
    get w() {
        return this.config.w
    }
}

let result = new Result(100, 275, 1, 2, "femto", "pico", "giga", "diff")

function update_imp() {
    result.config.sd = parseInt(document.getElementById("sig_digits").value)
    result.config.i = document.getElementById("imp_unit").value
    result.config.c = document.getElementById("c_unit").value
    result.config.l = document.getElementById("l_unit").value
    result.config.f = document.getElementById("f_unit").value
    const src_ld_unit = document.getElementById("src_ld_unit").value
    result.config.z0 = parseFloat(document.getElementById("z0").value)
    result.config.q = parseFloat(document.getElementById("q").value)
    result.config.freq_scaled = parseFloat(document.getElementById("freq").value)

    if (src_ld_unit == "adm") {
        result.src.y = [document.getElementById("rs").value, document.getElementById("xs").value]
        result.load.y = [document.getElementById("rl").value, document.getElementById("xl").value]
    } else if (src_ld_unit == "ma") {
        result.src.gmagang = [document.getElementById("rs").value, document.getElementById("xs").value, result.z0]
        result.load.gmagang = [document.getElementById("rl").value, document.getElementById("xl").value, result.z0]
    } else if (src_ld_unit == "ri") {
        result.src.gri = [document.getElementById("rs").value, document.getElementById("xs").value, result.z0]
        result.load.gri = [document.getElementById("rl").value, document.getElementById("xl").value, result.z0]
    } else if (src_ld_unit == "rc") {
        result.src.rc = [document.getElementById("rs").value, document.getElementById("xs").value, result.w]
        result.load.rc = [document.getElementById("rl").value, document.getElementById("xl").value, result.w]
    } else {
        result.src.zre = document.getElementById("rs").value
        result.src.zim = document.getElementById("xs").value
        result.load.zre = document.getElementById("rl").value
        result.load.zim = document.getElementById("xl").value
    }

    setCircuit()
}

function change_imp() {
    const src_ld_unit = document.getElementById("src_ld_unit").value

    if (src_ld_unit == "adm") {
        document.getElementById("zs_label").innerHTML = "Y";
        document.getElementById("zl_label").innerHTML = "Y";
        document.getElementById("rs_label").innerHTML = "+";
        document.getElementById("xs_label").innerHTML = "jS";
        document.getElementById("rl_label").innerHTML = "+";
        document.getElementById("xl_label").innerHTML = "jS";
        document.getElementById("rs").innerText = print_val(result.src.yre, "", 8)
        document.getElementById("xs").innerText = print_val(result.src.yim, "", 8)
        document.getElementById("rl").innerText = print_val(result.load.yre, "", 8)
        document.getElementById("xl").innerText = print_val(result.load.yim, "", 8)
    } else if (src_ld_unit == "ma") {
        document.getElementById("zs_label").innerHTML = "Γ";
        document.getElementById("zl_label").innerHTML = "Γ";
        document.getElementById("rs_label").innerHTML = "&ang;";
        document.getElementById("xs_label").innerHTML = "&deg;";
        document.getElementById("rl_label").innerHTML = "&ang;";
        document.getElementById("xl_label").innerHTML = "&deg;";
        document.getElementById("rs").innerText = print_val(result.src.gmag, "", 5)
        document.getElementById("xs").innerText = print_val(result.src.gang, "", 2)
        document.getElementById("rl").innerText = print_val(result.load.gmag, "", 5)
        document.getElementById("xl").innerText = print_val(result.load.gang, "", 2)
    } else if (src_ld_unit == "ri") {
        document.getElementById("zs_label").innerHTML = "Γ";
        document.getElementById("zl_label").innerHTML = "Γ";
        document.getElementById("rs_label").innerHTML = "+";
        document.getElementById("xs_label").innerHTML = "j";
        document.getElementById("rl_label").innerHTML = "+";
        document.getElementById("xl_label").innerHTML = "j";
        document.getElementById("rs").innerText = print_val(result.src.gre, "", 6)
        document.getElementById("xs").innerText = print_val(result.src.gim, "", 6)
        document.getElementById("rl").innerText = print_val(result.load.gre, "", 6)
        document.getElementById("xl").innerText = print_val(result.load.gim, "", 6)
    } else if (src_ld_unit == "rc") {
        var unit
        if (result.c == "milli") {
            unit = "mF"
        } else if (result.c == "micro") {
            unit = "uF"
        } else if (result.c == "nano") {
            unit = "nF"
        } else if (result.c == "pico") {
            unit = "pF"
        } else {
            unit = "fF"
        }
        document.getElementById("zs_label").innerHTML = "RC";
        document.getElementById("zl_label").innerHTML = "RC";
        document.getElementById("rs_label").innerHTML = "Ω";
        document.getElementById("xs_label").innerHTML = unit;
        document.getElementById("rl_label").innerHTML = "Ω  C =";
        document.getElementById("xl_label").innerHTML = unit;
        document.getElementById("rs").innerText = print_val(result.src.res, "", result.sd)
        document.getElementById("xs").innerText = print_val(result.src.cap, "", result.sd)
        document.getElementById("rl").innerText = print_val(result.load.res, "", result.sd)
        document.getElementById("xl").innerText = print_val(result.load.cap, "", result.sd)
    } else {
        document.getElementById("zs_label").innerHTML = "Z";
        document.getElementById("zl_label").innerHTML = "Z";
        document.getElementById("rs_label").innerHTML = "+";
        document.getElementById("xs_label").innerHTML = "jΩ";
        document.getElementById("rl_label").innerHTML = "+";
        document.getElementById("xl_label").innerHTML = "jΩ";
        document.getElementById("rs").innerText = print_val(result.src.zre, "", result.sd)
        document.getElementById("xs").innerText = print_val(result.src.zim, "", result.sd)
        document.getElementById("rl").innerText = print_val(result.load.zre, "", result.sd)
        document.getElementById("xl").innerText = print_val(result.load.zim, "", result.sd)
    }

    update_imp()
}

function change_unit() {
    result.config.f = document.getElementById("f_unit").value
    result.config.c = document.getElementById("c_unit").value
    result.config.l = document.getElementById("l_unit").value

    document.getElementById("freq").value = result.config.freq_scaled
    const cLabel = document.querySelectorAll("#c_label")
    const lLabel = document.querySelectorAll("#l_label")

    var prefix
    if (result.c == "milli") {
        prefix = "m"
    } else if (result.c  == "micro") {
        prefix = "μ";
    } else if (result.c  == "nano") {
        prefix = "n"
    } else if (result.c == "pico") {
        prefix = "p"
    } else if (result.c  == "femto") {
        prefix = "f"
    }

    cLabel.forEach(e => {
        e.innerHTML = prefix + "F"
    })
    lLabel.forEach(e => {
        e.innerHTML = prefix + "H"
    })

    update_imp()
}

function HP1 () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var q, rp, rv

    q = xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, lp, csx, csx

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        lp = rp / (result.w * q)
        result.hp1.cs = 1 / (result.w * rv * qs)
        result.hp1.ls = rp / (result.w * qs)
        if (xs != 0) {
            if (lp == result.hp1.ls) { result.hp1.ls = Number.POSITIVE_INFINITY } else { result.hp1.ls = result.hp1.ls * lp / (lp - result.hp1.ls) }
        }
        csx = -1 / (result.w * xl)
        result.hp1.ll = rv / (result.w * ql)
        result.hp1.cl = 1 / (result.w * rl * ql)
        if (xl != 0) {
            if (csx == result.hp1.cl) { result.hp1.cl = Number.POSITIVE_INFINITY } else { result.hp1.cl = result.hp1.cl * csx / (csx - result.hp1.cl) }
        }
        if (!result.hp1.valid) {
            result.hp1.cs = Number.NaN
            result.hp1.cl = Number.NaN
            result.hp1.ls = Number.NaN
            result.hp1.ll = Number.NaN
        }
    } else {
        result.hp1.cs = Number.NaN
        result.hp1.cl = Number.NaN
        result.hp1.ls = Number.NaN
        result.hp1.ll = Number.NaN
    }
}
function HP2 () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var q, rp, rv

    q = xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, lp, csx

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        lp = rp / (result.w * q)
        result.hp2.cs = 1 / (result.w * rv * qs)
        result.hp2.ls = rp / (result.w * qs)
        if (xs != 0) {
            if (lp == result.hp2.ls) { result.hp2.ls = Number.POSITIVE_INFINITY } else { result.hp2.ls = result.hp2.ls * lp / (lp - result.hp2.ls) }
        }
        csx = -1 / (result.w * xl)
        result.hp2.ll = rv / (result.w * ql)
        result.hp2.cl = 1 / (result.w * rl * ql)
        if (xl != 0) {
            if (csx == result.hp2.cl) { result.hp2.cl = Number.POSITIVE_INFINITY } else { result.hp2.cl = result.hp2.cl * csx / (csx - result.hp2.cl) }
        }
        if (!result.hp2.valid) {
            result.hp2.cs = Number.NaN
            result.hp2.cl = Number.NaN
            result.hp2.ls = Number.NaN
            result.hp2.ll = Number.NaN
        }
    } else {
        result.hp2.cs = Number.NaN
        result.hp2.cl = Number.NaN
        result.hp2.ls = Number.NaN
        result.hp2.ll = Number.NaN
    }
}
function LP1 () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var q, rp, rv

    q = -xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, cp

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        cp = q / (result.w * rp)
        result.lp1.cs = qs / (result.w * rp) - cp
        result.lp1.ls = qs * rv / result.w
        result.lp1.ll = rl * ql / result.w - xl / result.w
        result.lp1.cl = ql / (result.w * rv)
        if (!result.lp1.valid) {
            result.lp1.cs = Number.NaN
            result.lp1.cl = Number.NaN
            result.lp1.ls = Number.NaN
            result.lp1.ll = Number.NaN
        }
    } else {
        result.lp1.cs = Number.NaN
        result.lp1.cl = Number.NaN
        result.lp1.ls = Number.NaN
        result.lp1.ll = Number.NaN
    }
}
function LP2 () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var q, rp, rv

    q = -xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, cp

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        cp = q / (result.w * rp)
        result.lp2.cs = qs / (result.w * rp) - cp
        result.lp2.ls = qs * rv / result.w
        result.lp2.ll = rl * ql / result.w - xl / result.w
        result.lp2.cl = ql / (result.w * rv)
        if (!result.lp2.valid) {
            result.lp2.cs = Number.NaN
            result.lp2.cl = Number.NaN
            result.lp2.ls = Number.NaN
            result.lp2.ll = Number.NaN
        }
    } else {
        result.lp2.cs = Number.NaN
        result.lp2.cl = Number.NaN
        result.lp2.ls = Number.NaN
        result.lp2.ll = Number.NaN
    }
}
function BP1 () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var q, rp, rv

    q = xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, lp

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        lp = rp / (result.w * q)
        result.bp1.cs = 1 / (result.w * rv * qs)
        result.bp1.ls = rp / (result.w * qs)
        if (xs != 0) {
            if (lp == result.bp1.ls) { result.bp1.ls = Number.POSITIVE_INFINITY } else { result.bp1.ls = result.bp1.ls * lp / (lp - result.bp1.ls) }
        }
        result.bp1.ll = ql * rl / result.w - xl / result.w
        result.bp1.cl = ql / (result.w * rv)
        if (!result.bp1.valid) {
            result.bp1.cs = Number.NaN
            result.bp1.cl = Number.NaN
            result.bp1.ls = Number.NaN
            result.bp1.ll = Number.NaN
        }
    } else {
        result.bp1.cs = Number.NaN
        result.bp1.cl = Number.NaN
        result.bp1.ls = Number.NaN
        result.bp1.ll = Number.NaN
    }
}
function BP2 () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var q, rp, rv

    q = xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, lp

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        lp = rp / (result.w * q)
        result.bp2.cs = 1 / (result.w * rv * qs)
        result.bp2.ls = rp / (result.w * qs)
        if (xs != 0) {
            if (lp == result.bp2.ls) { result.bp2.ls = Number.POSITIVE_INFINITY } else { result.bp2.ls = result.bp2.ls * lp / (lp - result.bp2.ls) }
        }
        result.bp2.ll = ql * rl / result.w - (xl / result.w)
        result.bp2.cl = ql / (result.w * rv)
        if (!result.bp2.valid) {
            result.bp2.cs = Number.NaN
            result.bp2.cl = Number.NaN
            result.bp2.ls = Number.NaN
            result.bp2.ll = Number.NaN
        }
    } else {
        result.bp2.cs = Number.NaN
        result.bp2.cl = Number.NaN
        result.bp2.ls = Number.NaN
        result.bp2.ll = Number.NaN
    }
}
function BP3 () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var q, rp, rv

    q = -xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, cp, csx

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        cp = q / (result.w * rp)
        result.bp3.cs = qs / (result.w * rp) - cp
        result.bp3.ls = qs * rv / result.w
        result.bp3.ll = rv / (result.w * ql)
        csx = -1 / (result.w * xl)
        result.bp3.cl = 1 / (result.w * rl * ql)
        if (xl != 0) {
            if (csx == result.bp3.cl) { result.bp3.cl = Number.POSITIVE_INFINITY } else { result.bp3.cl = result.bp3.cl * csx / (csx - result.bp3.cl) }
        }
        if (!result.bp3.valid) {
            result.bp3.cs = Number.NaN
            result.bp3.cl = Number.NaN
            result.bp3.ls = Number.NaN
            result.bp3.ll = Number.NaN
        }
    } else {
        result.bp3.cs = Number.NaN
        result.bp3.cl = Number.NaN
        result.bp3.ls = Number.NaN
        result.bp3.ll = Number.NaN
    }
}
function BP4 () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var q, rp, rv

    q = -xs / rs
    rp = (1 + q**2) * rs
    rv = Math.sqrt(rp * rl)
    if (rp > rv) {
        var qs, ql, cp, csx

        qs = Math.sqrt(rp / rv - 1)
        ql = Math.sqrt(rv / rl - 1)
        cp = q / (result.w * rp)
        result.bp4.cs = qs / (result.w * rp) - cp
        result.bp4.ls = qs * rv / result.w
        result.bp4.ll = rv / (result.w * ql)
        csx = -1 / (result.w * xl)
        result.bp4.cl = 1 / (result.w * rl * ql)
        if (xl != 0) {
            if (csx == result.bp4.cl) { result.bp4.cl = Number.POSITIVE_INFINITY } else { result.bp4.cl = result.bp4.cl * csx / (csx - result.bp4.cl) }
        }
        if (!result.bp4.valid) {
            result.bp4.cs = Number.NaN
            result.bp4.cl = Number.NaN
            result.bp4.ls = Number.NaN
            result.bp4.ll = Number.NaN
        }
    } else {
        result.bp4.cs = Number.NaN
        result.bp4.cl = Number.NaN
        result.bp4.ls = Number.NaN
        result.bp4.ll = Number.NaN
}
}
function Pi_HP_Orig () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    if (result.config.q < 0) {
        result.pihp.c = Number.NaN
        result.pihp.ls = Number.NaN
        result.pihp.ll = Number.NaN
        result.pihp.q = Number.NaN
    } else { 
        if (result.config.q == 0 && rs == rl) {
            result.pihp.c = 0
            result.pihp.ls = 0
            result.pihp.ll = 0
            result.pihp.q = 0
        } else { 
            if (result.config.q < Math.sqrt(Math.max(rs, rl) / Math.min(rs, rl) - 1)) {
                result.pihp.c = Number.NaN
                result.pihp.ls = Number.NaN
                result.pihp.ll = Number.NaN
                result.pihp.q = Number.NaN
            } else {
                var rv, q, qs, ql, rps, rpl, lps, cs, lpl, cl

                rv = Math.max(rs, rl) / (result.config.q**2 + 1)
                qs = -xs / rs
                ql = -xl / rl
                rps = rs * (1 + qs**2)
                rpl = rl * (1 + ql**2)
                q = Math.sqrt(rps / rv - 1)
                result.pihp.ls = rps / (result.w * q)
                if (qs != 0) {
                    lps = rps / (qs * result.w)
                    result.pihp.ls *= lps / (result.pihp.ls - lps)
                }
                cs = 1 / (result.w * q * rv)
                q = Math.sqrt(rpl / rv - 1)
                result.pihp.ll = rpl / (result.w * q)
                if (ql != 0) {
                    lpl = rpl / (ql * result.w)
                    result.pihp.ll = result.pihp.ll * lpl / (result.pihp.ll - lpl)
                }
                cl = 1 / (result.w * q * rv)
                result.pihp.c = cl * cs / (cl + cs)
                result.pihp.q = result.config.q
                if (!result.pihp.valid) {
                    result.pihp.c = Number.NaN
                    result.pihp.ls = Number.NaN
                    result.pihp.ll = Number.NaN
                    result.pihp.q = Number.NaN
                }
            }
        }
    }
}
function Pi_LP_Orig () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    if (result.config.q < 0) {
        result.pilp.cs = Number.NaN
        result.pilp.cl = Number.NaN
        result.pilp.l = Number.NaN
        result.pilp.q = Number.NaN
    } else { if (result.config.q == 0 && rs == rl) {
        result.pilp.cs = 0
        result.pilp.cl = 0
        result.pilp.l = 0
        result.pilp.q = 0
        } else { 
            if (result.config.q < Math.sqrt(Math.max(rs, rl) / Math.min(rs, rl) - 1)) {
                result.pilp.cs = Number.NaN
                result.pilp.cl = Number.NaN
                result.pilp.l = Number.NaN
                result.pilp.q = Number.NaN
            } else {
                var rv, qs, ql, rps, rpl, cps, cpl, q, ls, ll

                rv = Math.max(rs, rl) / (result.config.q**2 + 1)
                qs = -xs / rs
                ql = -xl / rl
                rps = rs * (1 + qs**2)
                rpl = rl * (1 + ql**2)
                cps = qs / (rps * result.w)
                cpl = ql / (rpl * result.w)
                q = Math.sqrt(rps / rv - 1)
                result.pilp.cs = q / (result.w * rps) - cps
                ls = q * rv / result.w
                q = Math.sqrt(rpl / rv - 1)
                result.pilp.cl = q / (result.w * rpl) - cpl
                ll = q * rv / result.w
                result.pilp.l = ls + ll
                result.pilp.q = result.config.q
                if (!result.pilp.valid) {
                    result.pilp.cs = Number.NaN
                    result.pilp.cl = Number.NaN
                    result.pilp.l = Number.NaN
                    result.pilp.q = Number.NaN
                }
            }
        }
    }
}
function Tee_HP_Orig () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    if (result.config.q < 0) {
        result.teehp.cs = Number.NaN
        result.teehp.cl = Number.NaN
        result.teehp.l = Number.NaN
        result.teehp.q = Number.NaN
    } else {
        if (result.config.q == 0 && rs == rl) {
            result.teehp.cs = 0
            result.teehp.cl = 0
            result.teehp.l = 0
            result.teehp.q = 0
        } else {
            if (result.config.q < Math.sqrt(Math.max(rs, rl) / Math.min(rs, rl) - 1)) {
                result.teehp.cs = Number.NaN
                result.teehp.cl = Number.NaN
                result.teehp.l = Number.NaN
                result.teehp.q = Number.NaN
            } else {
                var rv, q, ls, ll

                rv = Math.min(rs, rl) * (result.config.q**2 + 1)
                q = Math.sqrt(rv / rs - 1)   //start source matching
                result.teehp.cs = 1 / (result.w * rs * q)
                if (xs != 0) {
                    if (result.teehp.cs == -1 / (result.w * xs)) {
                        result.teehp.cs = Number.POSITIVE_INFINITY
                    } else {
                        result.teehp.cs = result.teehp.cs * -1 / (result.w * xs) / (result.teehp.cs + 1 / (result.w * xs))
                    }
                }
                ls = rv / (result.w * q)
                q = Math.sqrt(rv / rl - 1)   //start load matching
                result.teehp.cl = 1 / (result.w * rl * q)
                if (xl != 0) {
                    if (result.teehp.cl == -1 / (result.w * xs)) {
                        result.teehp.cl = Number.POSITIVE_INFINITY
                    } else {
                        result.teehp.cl = result.teehp.cl * -1 / (result.w * xs) / (result.teehp.cl + 1 / (result.w * xs))
                    }
                }
                ll = rv / (result.w * q)
                result.teehp.l = ll * ls / (ll + ls)
                result.teehp.q = result.config.q
                if (!result.teehp.valid) {
                    result.teehp.cs = Number.NaN
                    result.teehp.cl = Number.NaN
                    result.teehp.l = Number.NaN
                    result.teehp.q = Number.NaN
                }
            }
        }
    }
}
function Tee_LP_Orig () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    if (result.config.q < 0) {
        result.teelp.c = Number.NaN
        result.teelp.ls = Number.NaN
        result.teelp.ll = Number.NaN
        result.teelp.q = Number.NaN
    } else { 
        if (result.config.q == 0 && rs == rl) {
            result.teelp.c = 0
            result.teelp.ls = 0
            result.teelp.ll = 0
            result.teelp.q = 0
        } else {
            if (result.config.q < Math.sqrt(Math.max(rs, rl) / Math.min(rs, rl) - 1)) {
                result.teelp.c = Number.NaN
                result.teelp.ls = Number.NaN
                result.teelp.ll = Number.NaN
                result.teelp.q = Number.NaN
            } else {
                var rv, q, cs, cl

                rv = Math.min(rs, rl) * (result.config.q**2 + 1)
                q = Math.sqrt(rv / rs - 1)
                result.teelp.ls = q * rs / result.w - (xs / result.w)
                cs = q / (result.w * rv)
                q = Math.sqrt(rv / rl - 1)
                result.teelp.ll = q * rl / result.w - (xl / result.w)
                cl = q / (result.w * rv)
                result.teelp.c = cs + cl
                result.teelp.q = result.config.q
                if (!result.teelp.valid) {
                    result.teelp.c = Number.NaN
                    result.teelp.ls = Number.NaN
                    result.teelp.ll = Number.NaN
                    result.teelp.q = Number.NaN
                }
            }
        }
    }
}
function LCLP () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var qs, ql, rp, c1, l1

    // This is the same as CLLP except the source and load are swapped
    qs = -xs / rs
    ql = xl / rl
    rp = rs * (1 + qs**2)
    c1 = qs / (rp * result.w)
    l1 = xl / result.w
    if (rl > rp) {
        result.elllplc.c = Number.NaN
        result.elllplc.l = Number.NaN
        result.elllplc.q = Number.NaN
    } else {
        var cp, ls

        result.elllplc.q = Math.sqrt(rp / rl - 1)
        cp = result.elllplc.q / (rp * result.w)
        result.elllplc.c = cp - c1
        ls = result.elllplc.q * rl / result.w
        result.elllplc.l = ls - l1
        if (!result.elllplc.valid) {
            result.elllplc.c = Number.NaN
            result.elllplc.l = Number.NaN
            result.elllplc.q = Number.NaN
        }
    }
}
function CLLP () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var qs, ql, rp, c1, l1

    qs = -xs / rs
    ql = xl / rl
    rp = rs * (1 + qs**2)
    c1 = qs / (rp * result.w)
    l1 = xl / result.w
    if (rl > rp) {
        result.elllpcl.c = Number.NaN
        result.elllpcl.l = Number.NaN
        result.elllpcl.q = Number.NaN
    } else {
        var cp, ls
    
        result.elllpcl.q = Math.sqrt(rp / rl - 1)
        cp = result.elllpcl.q / (rp * result.w)
        result.elllpcl.c = cp - c1
        ls = result.elllpcl.q * rl / result.w
        result.elllpcl.l = ls - l1
        if (!result.elllpcl.valid) {
            result.elllpcl.c = Number.NaN
            result.elllpcl.l = Number.NaN
            result.elllpcl.q = Number.NaN
        }
    }
}
function LCHP () {
    var rs = scale_imp(result.src.zre, result.config.i)
    var xs = scale_imp(result.src.zim, result.config.i)
    var rl = scale_imp(result.load.zre, result.config.i)
    var xl = scale_imp(result.load.zim, result.config.i)

    var ql, qs, c1, l1, rp

    ql = -xl / rl
    qs = xs / rs
    c1 = -1 / (result.w * xl)
    l1 = (1 + qs**2) * xs / (result.w * qs**2)
    rp = (1 + qs**2) * rs
    rs = rl
    if (rs > rp) {
        result.ellhplc.c = Number.NaN
        result.ellhplc.l = Number.NaN
        result.ellhplc.q = Number.NaN
    } else {
        var lp, cs

        result.ellhplc.q = Math.sqrt((rp / rs) - 1)
        lp = rp / (result.w * result.ellhplc.q)
        cs = 1 / (result.ellhplc.q * result.w * rs)
        result.ellhplc.c = cs
        if (xl != 0) {
            if (c1 == cs) { 
                result.ellhplc.c = Number.POSITIVE_INFINITY
            } else { 
                result.ellhplc.c = c1 * cs / (c1 - cs)
            }
        }
        result.ellhplc.l = lp
        if (xs != 0) {
            if (l1 == lp) {
                result.ellhplc.l = Number.POSITIVE_INFINITY
            } else { 
                result.ellhplc.l = lp * l1 / (l1 - lp)
            }
        }
        if (!result.ellhplc.valid) {
            result.ellhplc.c = Number.NaN
            result.ellhplc.l = Number.NaN
            result.ellhplc.q = Number.NaN
        }
    }
}
function CLHP () {
    var rs = scale_imp(result.load.zre, result.config.i)
    var xs = scale_imp(result.load.zim, result.config.i)
    var rl = scale_imp(result.src.zre, result.config.i)
    var xl = scale_imp(result.src.zim, result.config.i)

    var ql, qs, c1, l1, rp

    // This is the same as LCHP except the source and load are swapped
    ql = -xl / rl
    qs = xs / rs
    c1 = -1 / (result.w * xl)
    l1 = (1 + qs**2) * xs / (result.w * qs**2)
    rp = (1 + qs**2) * rs
    rs = rl
    if (rs > rp) {
        result.ellhpcl.c = Number.NaN
        result.ellhpcl.l = Number.NaN
        result.ellhpcl.q = Number.NaN
    } else {
        var lp, cs

        result.ellhpcl.q = Math.sqrt(rp / rs - 1)
        lp = rp / (result.w * result.ellhpcl.q)
        cs = 1 / (result.ellhpcl.q * result.w * rs)
        result.ellhpcl.c = cs
        if (xl != 0) {
            if (c1 == cs) { 
                result.ellhpcl.c = Number.POSITIVE_INFINITY 
            } else { 
                result.ellhpcl.c = c1 * cs / (c1 - cs)
            }
        }
        result.ellhpcl.l = lp
        if (xs != 0) {
            if (l1 == lp) { 
                result.ellhpcl.l = Number.POSITIVE_INFINITY 
            } else { 
                result.ellhpcl.l = lp * l1 /(l1 - lp) 
            }
        }
        if (!result.ellhpcl.valid) {
            result.ellhpcl.c = Number.NaN
            result.ellhpcl.l = Number.NaN
            result.ellhpcl.q = Number.NaN
        }
    }
}

function displayResults() {
    result.hp1.write(result.c, result.l, result.sd)
    result.hp2.write(result.c, result.l, result.sd)
    result.lp1.write(result.c, result.l, result.sd)
    result.lp2.write(result.c, result.l, result.sd)
    result.bp1.write(result.c, result.l, result.sd)
    result.bp2.write(result.c, result.l, result.sd)
    result.bp3.write(result.c, result.l, result.sd)
    result.bp4.write(result.c, result.l, result.sd)
    result.pihp.write(result.c, result.l, result.sd)
    result.pilp.write(result.c, result.l, result.sd)
    result.teehp.write(result.c, result.l, result.sd)
    result.teelp.write(result.c, result.l, result.sd)
    result.elllplc.write(result.c, result.l, result.sd)
    result.elllpcl.write(result.c, result.l, result.sd)
    result.ellhplc.write(result.c, result.l, result.sd)
    result.ellhpcl.write(result.c, result.l, result.sd)
}

function setCircuit() {
    Tee_LP_Orig()
    Tee_HP_Orig()
    Pi_LP_Orig()
    Pi_HP_Orig()
    LP1()
    LP2()
    HP1()
    HP2()
    BP1()
    BP2()
    BP3()
    BP4()

    if (result.src.zre == result.load.zre && result.src.zim == -result.load.zim) {
        result.ellhplc.c = 0
        result.ellhplc.l = 0
        result.ellhplc.q = result.src.zim / result.src.zre
        result.elllpcl.c = 0
        result.elllpcl.l = 0
        result.elllpcl.q = result.src.zim / result.src.zre
        result.elllplc.c = 0
        result.elllplc.l = 0
        result.elllplc.q = result.src.zim / result.src.zre
        result.ellhpcl.c = 0
        result.ellhpcl.l = 0
        result.ellhpcl.q = result.src.zim / result.src.zre
    } else {
        LCHP()
        CLLP()
        LCLP()
        CLHP()
    }

    displayResults()
}

window.setCircuit = setCircuit
window.update_imp = update_imp
window.change_imp = change_imp
window.change_unit = change_unit