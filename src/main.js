const { invoke } = window.__TAURI__.core;


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
    invoke("calc_networks", { rs: rs, xs: xs, rl: rl, xl: xl, imp: imp_unit, q_net: q_net, q: q, z0: z0, freq: freq, f_scale: freq_unit, c_scale: cap_unit, l_scale: ind_unit, z_scale: mode_unit })
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

        document.getElementById("hplcq_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc_w_q.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("hplcq_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc_w_q.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("hplcq_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_lc_w_q.q_net, "", "", sd) + "</div>";
        console.log("hplcq: " + result.hp_ell_lc_w_q.sol);

        document.getElementById("hpcl_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("hpcl_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("hpcl_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl.q, "", "", sd) + "</div>";

        document.getElementById("hpclq_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl_w_q.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("hpclq_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl_w_q.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("hpclq_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.hp_ell_cl_w_q.q_net, "", "", sd) + "</div>";
        console.log("hpclq: " + result.hp_ell_cl_w_q.sol);

        document.getElementById("lplc_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lplc_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lplc_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc.q, "", "", sd) + "</div>";

        document.getElementById("lplcq_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc_w_q.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lplcq_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc_w_q.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lplcq_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_lc_w_q.q_net, "", "", sd) + "</div>";
        console.log("lpclq: " + result.lp_ell_cl_w_q.sol);

        document.getElementById("lpcl_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lpcl_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lpcl_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl.q, "", "", sd) + "</div>";

        document.getElementById("lpclq_c_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl_w_q.c, cap_unit, "F", sd) + "</div>";
        document.getElementById("lpclq_l_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl_w_q.l, ind_unit, "H", sd) + "</div>";
        document.getElementById("lpclq_q_val").innerHTML = "<div class=\"text_box\">" + print_val(result.lp_ell_cl_w_q.q_net, "", "", sd) + "</div>";
        console.log("lplcq: " + result.lp_ell_lc_w_q.sol);
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

        document.getElementById("hplcq_c_val").innerHTML = txt;
        document.getElementById("hplcq_l_val").innerHTML = txt;
        document.getElementById("hplcq_q_val").innerHTML = txt;

        document.getElementById("hpcl_c_val").innerHTML = txt;
        document.getElementById("hpcl_l_val").innerHTML = txt;
        document.getElementById("hpcl_q_val").innerHTML = txt;

        document.getElementById("hpclq_c_val").innerHTML = txt;
        document.getElementById("hpclq_l_val").innerHTML = txt;
        document.getElementById("hpclq_q_val").innerHTML = txt;

        document.getElementById("lplc_c_val").innerHTML = txt;
        document.getElementById("lplc_l_val").innerHTML = txt;
        document.getElementById("lplc_q_val").innerHTML = txt;

        document.getElementById("lplcq_c_val").innerHTML = txt;
        document.getElementById("lplcq_l_val").innerHTML = txt;
        document.getElementById("lplcq_q_val").innerHTML = txt;

        document.getElementById("lpcl_c_val").innerHTML = txt;
        document.getElementById("lpcl_l_val").innerHTML = txt;
        document.getElementById("lpcl_q_val").innerHTML = txt;

        document.getElementById("lpclq_c_val").innerHTML = txt;
        document.getElementById("lpclq_l_val").innerHTML = txt;
        document.getElementById("lpclq_q_val").innerHTML = txt;
    });
}

function change_imp() {
    invoke("change_impedance", { rs: rs, xs: xs, rl: rl, xl: xl, imp_in: imp_unit, imp_out: impUnitEl.value, z0: z0, freq: freq, f_scale: freq_unit, c_scale: cap_unit })
    .then((result) => {
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
                switch (cap_unit) {
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

        zsLabelEl.innerHTML = z_label;
        zlLabelEl.innerHTML = z_label;
        rsLabelEl.innerHTML = r_label;
        xsLabelEl.innerHTML = x_label;
        rlLabelEl.innerHTML = r_label;
        xlLabelEl.innerHTML = x_label;

        rsEl.innerText = print_val(result.src.re, "", "", result.sd);
        xsEl.innerText = print_val(result.src.im, "", "", result.sd);
        rlEl.innerText = print_val(result.load.re, "", "", result.sd);
        xlEl.innerText = print_val(result.load.im, "", "", result.sd);

        update_imp()
    })
    .catch((err) => {
        console.log("ERROR: " + err);
        var txt = "<div class=\"text_box\">ERROR";
        rsEl.innerText = txt;
        xsEl.innerText = txt;
        rlEl.innerText = txt;
        xlEl.innerText = txt;
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
    q_net = parseFloat(qNetEl.value);
    q = parseFloat(qEl.value);
    z0 = parseFloat(z0El.value);
    rs = parseFloat(rsEl.value);
    xs = parseFloat(xsEl.value);
    rl = parseFloat(rlEl.value);
    xl = parseFloat(xlEl.value);

    rsCalc = rs;
    xsCalc = xs;
    rlCalc = rl;
    xlCalc = xl;
    if (mode_unit == "diff") {
        if (imp_unit == "rc") {
            rsCalc = rs / 2.0;
            xsCalc = xs * 2.0;
            rlCalc = rl / 2.0;
            xlCalc = xl * 2.0;
        } else if (imp_unit == "yri") {
            rsCalc = rs * 2.0;
            xsCalc = xs * 2.0;
            rlCalc = rl * 2.0;
            xlCalc = xl * 2.0;
        } else if (imp_unit == "zri") {
            rsCalc = rs / 2.0;
            xsCalc = xs / 2.0;
            rlCalc = rl / 2.0;
            xlCalc = xl / 2.0;
        }
    }

    if (xs < 0 && !(imp_unit == "gma" || imp_unit == "rc")) {
        zsEl.innerHTML = print_val(rsCalc, "", "", sd) + " - " + print_val(Math.abs(xsCalc), "", "", sd) + x_label;
    } else {
        zsEl.innerHTML = print_val(rsCalc, "", "", sd) + r_label + " " + print_val(xsCalc, "", "", sd) + x_label;
    }
    if (xl < 0 && !(imp_unit == "gma" || imp_unit == "rc")) {
        zlEl.innerHTML = print_val(rlCalc, "", "", sd) + " - " + print_val(Math.abs(xlCalc), "", "", sd) + x_label;
    } else {
        zlEl.innerHTML = print_val(rlCalc, "", "", sd) + r_label + " " + print_val(xlCalc, "", "", sd) + x_label;
    }

    calc_nets();
}

let sigDigitsEl, modeUnitEl, capUnitEl, indUnitEl, freqUnitEl, impUnitEl, z0El, qNetEl, qEl, freqEl, rsLabelEl, rsEl, xsLabelEl, xsEl, rlLabelEl, rlEl, xlLabelEl, xlEl, calcEl, zsLabelEl, zsEl, zlLabelEl, zlEl;
let mode_unit, cap_unit, ind_unit, freq_unit, imp_unit, z0, q_net, q, freq, rs, xs, rl, xl, rsCalc, xsCalc, rlCalc, xlCalc;
let z_label, r_label, x_label;
let sd = 2;

window.addEventListener("DOMContentLoaded", () => {
    z_label = "Z";
    r_label = "+";
    x_label = "jΩ";

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
    qNetEl = document.getElementById("q_net");
    q_net = parseFloat(qNetEl.value);
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
    zsLabelEl = document.getElementById("zs_label");
    zsEl = document.getElementById("zs");
    zlLabelEl = document.getElementById("zl_label");
    zlEl = document.getElementById("zl");

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

    qNetEl.addEventListener("change", (e) => {
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
