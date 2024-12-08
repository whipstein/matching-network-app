const { invoke } = window.__TAURI__.core;

let sig_digits = 2;

function digits(val, sd) {
    return val.toFixed(sd);
}

function print_unit(unit) {
    switch (unit) {
        case "milli":
            return "m";
        case "micro":
            return "μ";
        case "nano":
            return "n";
        case "pico":
            return "p";
        case "femto":
            return "f";
        default:
            return "";
    }
}
  
function print_val(val, unit, suffix, sd) {
    if (Number.isFinite(val)) {
        return "" + digits(val, sd) + " " + print_unit(unit) + suffix;
    }
    return "" + Number.NaN;
}

function calc_nets() {
    invoke("calc_networks", { rs: rs, xs: xs, rl: rl, xl: xl, imp: imp_unit, q: q, z0: z0, freq: freq, fscale: freq_unit, cscale: cap_unit, lscale: ind_unit, zscale: mode_unit })
    .then((result) => {
        document.getElementById("hp1_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp1.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("hp1_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp1.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("hp1_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp1.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("hp1_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp1.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("hp2_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp2.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("hp2_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp2.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("hp2_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp2.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("hp2_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp2.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("lp1_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp1.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("lp1_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp1.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("lp1_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp1.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("lp1_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp1.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("lp2_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp2.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("lp2_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp2.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("lp2_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp2.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("lp2_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp2.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("bp1_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp1.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp1_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp1.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp1_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp1.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("bp1_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp1.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("bp2_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp2.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp2_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp2.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp2_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp2.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("bp2_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp2.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("bp3_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp3.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp3_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp3.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp3_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp3.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("bp3_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp3.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("bp4_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp4.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp4_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp4.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("bp4_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp4.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("bp4_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.bp4.ll, ind_unit, "H", sd) + "</div>";

        document.getElementById("teehp_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("teehp_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("teehp_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.l, ind_unit, "H", sd) + "</div>";
        if (Number.isFinite(result.tee.cs) || Number.isFinite(result.tee.cl) || Number.isFinite(result.tee.l)) {
            document.getElementById("teehp_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.q, "", "", sd) + "</div>";
        } else {
            document.getElementById("teehp_q_val").innerHTML = "<div class=\"text_box\">" + Number.NaN + "</div>";
        }

        document.getElementById("teelp_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("teelp_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.ll, ind_unit, "H", sd) + "</div>";
        document.getElementById("teelp_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.c, cap_unit, "F", sd) + "</div>";
        if (Number.isFinite(result.tee.ls) || Number.isFinite(result.tee.ll) || Number.isFinite(result.tee.c)) {
            document.getElementById("teelp_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.tee.q, "", "", sd) + "</div>";
        } else {
            document.getElementById("teelp_q_val").innerHTML = "<div class=\"text_box\">" + Number.NaN + "</div>";
        }

        document.getElementById("pilp_cs_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.cs, cap_unit, "F", sd) + "</div>";
        document.getElementById("pilp_cl_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.cl, cap_unit, "F", sd) + "</div>";
        document.getElementById("pilp_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.l, ind_unit, "H", sd) + "</div>";
        if (Number.isFinite(result.pi.cs) || Number.isFinite(result.pi.cl) || Number.isFinite(result.pi.l)) {
            document.getElementById("pilp_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.q, "", "", sd) + "</div>";
        } else {
            document.getElementById("pilp_q_val").innerHTML = "<div class=\"text_box\">" + Number.NaN + "</div>";
        }

        document.getElementById("pihp_ls_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.ls, ind_unit, "H", sd) + "</div>";
        document.getElementById("pihp_ll_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.ll, ind_unit, "H", sd) + "</div>";
        document.getElementById("pihp_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.c, cap_unit, "F", sd) + "</div>";
        if (Number.isFinite(result.pi.ls) || Number.isFinite(result.pi.ll) || Number.isFinite(result.pi.c)) {
            document.getElementById("pihp_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.pi.q, "", "", sd) + "</div>";
        } else {
            document.getElementById("pihp_q_val").innerHTML = "<div class=\"text_box\">" + Number.NaN + "</div>";
        }

        document.getElementById("hplc_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("hplc_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("hplc_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc.q, "", "", sd) + "</div>";

        document.getElementById("hpcl_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("hpcl_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("hpcl_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.q, "", "", sd) + "</div>";

        document.getElementById("lplc_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lplc_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lplc_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.q, "", "", sd) + "</div>";

        document.getElementById("lpcl_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lpcl_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lpcl_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.q, "", "", sd) + "</div>";
    })
    .catch((err) => {
        console.log("ERROR: " + err);
        var txt = "<div class=\"text_box\">ERROR";
        document.getElementById("hp1_cs_val").innerHTML = txt;
        document.getElementById("hp1_cl_val").innerHTML = txt;
        document.getElementById("hp1_ls_val").innerHTML = txt;
        document.getElementById("hp1_ll_val").innerHTML = txt;

        document.getElementById("hp2_cs_val").innerHTML = txt;
        document.getElementById("hp2_cl_val").innerHTML = txt;
        document.getElementById("hp2_ls_val").innerHTML = txt;
        document.getElementById("hp2_ll_val").innerHTML = txt;

        document.getElementById("lp1_cs_val").innerHTML = txt;
        document.getElementById("lp1_cl_val").innerHTML = txt;
        document.getElementById("lp1_ls_val").innerHTML = txt;
        document.getElementById("lp1_ll_val").innerHTML = txt;

        document.getElementById("lp2_cs_val").innerHTML = txt;
        document.getElementById("lp2_cl_val").innerHTML = txt;
        document.getElementById("lp2_ls_val").innerHTML = txt;
        document.getElementById("lp2_ll_val").innerHTML = txt;

        document.getElementById("bp1_cs_val").innerHTML = txt;
        document.getElementById("bp1_cl_val").innerHTML = txt;
        document.getElementById("bp1_ls_val").innerHTML = txt;
        document.getElementById("bp1_ll_val").innerHTML = txt;

        document.getElementById("bp2_cs_val").innerHTML = txt;
        document.getElementById("bp2_cl_val").innerHTML = txt;
        document.getElementById("bp2_ls_val").innerHTML = txt;
        document.getElementById("bp2_ll_val").innerHTML = txt;

        document.getElementById("bp3_cs_val").innerHTML = txt;
        document.getElementById("bp3_cl_val").innerHTML = txt;
        document.getElementById("bp3_ls_val").innerHTML = txt;
        document.getElementById("bp3_ll_val").innerHTML = txt;

        document.getElementById("bp4_cs_val").innerHTML = txt;
        document.getElementById("bp4_cl_val").innerHTML = txt;
        document.getElementById("bp4_ls_val").innerHTML = txt;
        document.getElementById("bp4_ll_val").innerHTML = txt;

        document.getElementById("teehp_cs_val").innerHTML = txt;
        document.getElementById("teehp_cl_val").innerHTML = txt;
        document.getElementById("teehp_l_val").innerHTML = txt;
        document.getElementById("teehp_q_val").innerHTML = txt;

        document.getElementById("teelp_ls_val").innerHTML = txt;
        document.getElementById("teelp_ll_val").innerHTML = txt;
        document.getElementById("teelp_c_val").innerHTML = txt;
        document.getElementById("teelp_q_val").innerHTML = txt;

        document.getElementById("pilp_cs_val").innerHTML = txt;
        document.getElementById("pilp_cl_val").innerHTML = txt;
        document.getElementById("pilp_l_val").innerHTML = txt;
        document.getElementById("pilp_q_val").innerHTML = txt;

        document.getElementById("pihp_ls_val").innerHTML = txt;
        document.getElementById("pihp_ll_val").innerHTML = txt;
        document.getElementById("pihp_c_val").innerHTML = txt;
        document.getElementById("pihp_q_val").innerHTML = txt;

        document.getElementById("hplc_c_val").innerHTML = txt;
        document.getElementById("hplc_l_val").innerHTML = txt;
        document.getElementById("hplc_q_val").innerHTML = txt;

        document.getElementById("hpcl_c_val").innerHTML = txt;
        document.getElementById("hpcl_l_val").innerHTML = txt;
        document.getElementById("hpcl_q_val").innerHTML = txt;

        document.getElementById("lplc_c_val").innerHTML = txt;
        document.getElementById("lplc_l_val").innerHTML = txt;
        document.getElementById("lplc_q_val").innerHTML = txt;

        document.getElementById("lpcl_c_val").innerHTML = txt;
        document.getElementById("lpcl_l_val").innerHTML = txt;
        document.getElementById("lpcl_q_val").innerHTML = txt;
    });
}

function change_imp() {
    console.log("invoke(\"change_impedance\", { src_re: " + rs + ", src_im: " + xs + ", load_re: " + rl + ", load_im: " + xl + ", imp_in: " + imp_unit + ", imp_out: " + impUnitEl.value + ", z0: " + z0 + ", freq: " + freq + ", fscale: " + freq_unit + ", cscale: " + cap_unit + " })");
    invoke("change_impedance", { rs: rs, xs: xs, rl: rl, xl: xl, imp_in: imp_unit, imp_out: impUnitEl.value, z0: z0, freq: freq, fscale: freq_unit, cscale: cap_unit })
    .then((result) => {
        var z_label, r_label, x_label;
        switch (imp_unit) {
            case "zri":
                z_label = "Z";
                r_label = "+";
                x_label = "jΩ";
                break;
            case "yri":
                z_label = "Y";
                r_label = "+";
                x_label = "jS";
                break;
            case "gma":
                z_label = "Γ";
                r_label = "&ang;";
                x_label = "&deg;";
                break;
            case "gri":
                z_label = "Γ";
                r_label = "+";
                x_label = "j";
                break;
            case "rc":
                var unit
                switch (result.c) {
                    case "milli":
                        unit = "mF"
                        break;
                    case "micro":
                        unit = "uF"
                        break;
                    case "nano":
                        unit = "nF"
                        break;
                    case "pico":
                        unit = "pF"
                        break;
                    case "femto":
                        unit = "fF"
                        break;
                }
                z_label = "RC";
                r_label = "Ω";
                x_label = unit;
                break;
        }

        document.getElementById("zs_label").innerHTML = z_label;
        document.getElementById("zl_label").innerHTML = z_label;
        document.getElementById("rs_label").innerHTML = r_label;
        document.getElementById("xs_label").innerHTML = x_label;
        document.getElementById("rl_label").innerHTML = r_label;
        document.getElementById("xl_label").innerHTML = x_label;

        document.getElementById("rs").innerText = print_val(result.src_re, "", "", result.sd);
        document.getElementById("xs").innerText = print_val(result.src_im, "", "", result.sd);
        document.getElementById("rl").innerText = print_val(result.load_re, "", "", result.sd);
        document.getElementById("xl").innerText = print_val(result.load_im, "", "", result.sd);

        calc_nets()
    })
    .catch((err) => {
        console.log("ERROR: " + err);
        var txt = "<div class=\"text_box\">ERROR";
        document.getElementById("rs").innerText = txt;
        document.getElementById("xs").innerText = txt;
        document.getElementById("rl").innerText = txt;
        document.getElementById("xl").innerText = txt;
    });

    imp_unit = impUnitEl.value;
}

function change_unit() {
    freq_unit = freqUnitEl.value;
    cap_unit = capUnitEl.value;
    ind_unit = indUnitEl.value;
    mode_unit = modeUnitEl.value;

    update_imp();
}

function update_imp() {
    sd = parseInt(sigDigitsEl.value);
    freq = parseFloat(freqEl.value);
    q = parseFloat(qEl.value);
    z0 = parseFloat(z0El.value);
    rs = parseFloat(rsEl.value);
    xs = parseFloat(xsEl.value);
    rl = parseFloat(rlEl.value);
    xl = parseFloat(xlEl.value);

    calc_nets();
}

let sigDigitsEl, modeUnitEl, capUnitEl, indUnitEl, freqUnitEl, impUnitEl, z0El, qEl, freqEl, rsLabelEl, rsEl, xsLabelEl, xsEl, rlLabelEl, rlEl, xlLabelEl, xlEl, calcEl;
let sd, mode_unit, cap_unit, ind_unit, freq_unit, imp_unit, z0, q, freq, rs, xs, rl, xl;

window.addEventListener("DOMContentLoaded", () => {
    sigDigitsEl = document.getElementById("sig_digits");
    sd = parseInt(sigDigitsEl.value);
    modeUnitEl = document.getElementById("mode_unit");
    mode_unit = modeUnitEl.value;
    capUnitEl = document.getElementById("cap_unit");
    cap_unit = capUnitEl.value;
    indUnitEl = document.getElementById("ind_unit");
    ind_unit = indUnitEl.value;
    freqUnitEl = document.getElementById("freq_unit");
    freq_unit = freqUnitEl.value;
    impUnitEl = document.getElementById("imp_unit");
    imp_unit = impUnitEl.value;
    z0El = document.getElementById("z0");
    z0 = parseFloat(z0El.value);
    qEl = document.getElementById("q");
    q = parseFloat(qEl.value);
    freqEl = document.getElementById("freq");
    freq = parseFloat(freqEl.value);
    rsLabelEl = document.getElementById("rs_label");
    rsEl = document.getElementById("rs");
    rs = parseFloat(rsEl.value);
    xsLabelEl = document.getElementById("xs_label");
    xsEl = document.getElementById("xs");
    xs = parseFloat(xsEl.value);
    rlLabelEl = document.getElementById("rl_label");
    rlEl = document.getElementById("rl");
    rl = parseFloat(rlEl.value);
    xlLabelEl = document.getElementById("xl_label");
    xlEl = document.getElementById("xl");
    xl = parseFloat(xlEl.value);
    calcEl = document.getElementById("calc");

    sigDigitsEl.addEventListener("change", (e) => {
        e.preventDefault();
        sig_digits = parseInt(sigDigitsEl.value, 10);
        update_imp();
    });

    modeUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        change_unit();
    });

    capUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        change_unit();
    });

    indUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        change_unit();
    });

    freqUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        change_unit();
    });

    impUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        change_imp();
    });

    z0El.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    qEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    freqEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    rsEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    xsEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    rlEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    xlEl.addEventListener("change", (e) => {
        e.preventDefault();
        update_imp();
    });

    calcEl.addEventListener("click", (e) => {
        e.preventDefault();
        update_imp();
    });
});
