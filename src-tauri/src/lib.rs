use num_complex::Complex;
use std::f64::consts::PI;
use std::f64::{INFINITY, NAN};

fn get_mult(scale: &str) -> f64 {
    match scale {
        "tera" | "T" | "THz" | "thz" => 1e-12,
        "giga" | "G" | "GHz" | "ghz" | "GΩ" => 1e-9,
        "mega" | "M" | "MHz" | "mhz" | "MΩ" => 1e-6,
        "kilo" | "k" | "kHz" | "khz" | "kΩ" => 1e-3,
        "milli" | "m" | "mΩ" | "mF" | "mH" => 1e3,
        "micro" | "u" | "μΩ" | "μF" | "μH" => 1e6,
        "nano" | "n" | "nΩ" | "nF" | "nH" => 1e9,
        "pico" | "p" | "pΩ" | "pF" | "pH" => 1e12,
        "femto" | "f" | "fΩ" | "fF" | "fH" => 1e15,
        _ => 1.0,
    }
}

fn scale(val: f64, scale: &str) -> f64 {
    val * get_mult(scale)
}

fn unscale(val: f64, scale: &str) -> f64 {
    val / get_mult(scale)
}

fn calc_gamma(z: Complex<f64>, z0: f64) -> Complex<f64> {
    let z0: f64 = z0;

    (z - z0) / (z + z0)
}

fn calc_z(gamma: Complex<f64>, z0: f64) -> Complex<f64> {
    z0 * (1.0 + gamma) / (1.0 - gamma)
}

fn calc_rc(z: Complex<f64>, freq: f64, fscale: &str, rscale: &str, cscale: &str) -> (f64, f64) {
    let y = 1.0 / z;

    (
        1.0 / scale(y.re, rscale),
        scale(
            y.im / (2.0 * std::f64::consts::PI * unscale(freq, fscale)),
            cscale,
        ),
    )
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct CCLL {
    cs: f64,
    cl: f64,
    ls: f64,
    ll: f64,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct PiTee {
    c: f64,
    cs: f64,
    cl: f64,
    l: f64,
    ls: f64,
    ll: f64,
    q: f64,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct CL {
    c: f64,
    l: f64,
    q: f64,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct ResultsReturn {
    hp1: CCLL,
    hp2: CCLL,
    lp1: CCLL,
    lp2: CCLL,
    bp1: CCLL,
    bp2: CCLL,
    bp3: CCLL,
    bp4: CCLL,
    pi: PiTee,
    tee: PiTee,
    hp_ell_cl: CL,
    hp_ell_lc: CL,
    lp_ell_cl: CL,
    lp_ell_lc: CL,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct ComplexReturn {
    rs: f64,
    xs: f64,
    rl: f64,
    xl: f64,
}

// ---CAP---------
//          |
//         IND
//          |
//         GND
fn calc_hp_ell_cl(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CL, String> {
    let mut out = CL::default();

    if (zs.re == zl.re) && (zs.im == (-zl.im)) {
        out.c = 0.0;
        out.l = 0.0;
        out.q = zs.im / zs.re;
        return Ok(out);
    }

    let qs = zl.im / zl.re;
    let c1 = -1.0 / (w * zs.im);
    let l1 = (1.0 + qs.powi(2)) * zl.im / (w * qs.powi(2));
    let rp = (1.0 + qs.powi(2)) * zl.re;

    if zs.re > rp {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        out.q = (rp / zs.re - 1.0).sqrt();
        out.l = rp / (w * out.q);
        out.c = 1.0 / (out.q * w * zs.re);

        if zs.im != 0.0 {
            if c1 == out.c {
                out.c = INFINITY;
            } else {
                out.c *= c1 / (c1 - out.c);
            }
        }

        if zl.im != 0.0 {
            if l1 == out.l {
                out.l = INFINITY;
            } else {
                out.l *= l1 / (l1 - out.l);
            }
        }
    }

    out.c = scale(out.c, cscale);
    out.l = scale(out.l, lscale);

    if (out.c < 0.0) || (out.l < 0.0) {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
    }

    Ok(out)
}

// --------CAP----
//     |
//    IND
//     |
//    GND
fn calc_hp_ell_lc(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CL, String> {
    let mut out = CL::default();

    if (zs.re == zl.re) && (zs.im == (-zl.im)) {
        out.c = 0.0;
        out.l = 0.0;
        out.q = zs.im / zs.re;
        return Ok(out);
    }

    let qs = zs.im / zs.re;
    let c1 = -1.0 / (w * zl.im);
    let l1 = (1.0 + qs.powi(2)) * zs.im / (w * qs.powi(2));
    let rp = (1.0 + qs.powi(2)) * zs.re;
    let rs = zl.re + 0.0;

    if rs > rp {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        out.q = (rp / rs - 1.0).sqrt();
        out.l = rp / (w * out.q);
        out.c = 1.0 / (out.q * w * rs);

        if zl.im != 0.0 {
            if c1 == out.c {
                out.c = INFINITY;
            } else {
                out.c *= c1 / (c1 - out.c);
            }
        }

        if zs.im != 0.0 {
            if l1 == out.l {
                out.l = INFINITY;
            } else {
                out.l *= l1 / (l1 - out.l);
            }
        }
    }

    out.c = scale(out.c, cscale);
    out.l = scale(out.l, lscale);

    if (out.c < 0.0) || (out.l < 0.0) {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
    }

    Ok(out)
}

// --------IND----
//     |
//    CAP
//     |
//    GND
fn calc_lp_ell_cl(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CL, String> {
    let mut out = CL::default();

    if (zs.re == zl.re) && (zs.im == (-zl.im)) {
        out.c = 0.0;
        out.l = 0.0;
        out.q = zs.im / zs.re;
        return Ok(out);
    }

    let qs = -zs.im / zs.re;
    let rp = zs.re * (1.0 + qs.powi(2));

    if zl.re > rp {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        out.q = (rp / zl.re - 1.0).sqrt();
        let cp = out.q / (rp * w);
        let c1 = qs / (rp * w);
        out.c = cp - c1;
        let ls = out.q * zl.re / w;
        let l1 = zl.im / w;
        out.l = ls - l1;
    }

    out.c = scale(out.c, cscale);
    out.l = scale(out.l, lscale);

    if (out.c < 0.0) || (out.l < 0.0) {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
    }

    Ok(out)
}

// ---IND---------
//          |
//         CAP
//          |
//         GND
fn calc_lp_ell_lc(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CL, String> {
    let mut out = CL::default();

    if (zs.re == zl.re) && (zs.im == (-zl.im)) {
        out.c = 0.0;
        out.l = 0.0;
        out.q = zs.im / zs.re;
        return Ok(out);
    }

    let qs = -zl.im / zl.re;
    let rp = zl.re * (1.0 + qs.powi(2));

    if zs.re > rp {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        out.q = (rp / zs.re - 1.0).sqrt();
        let cp = out.q / (rp * w);
        let c1 = qs / (rp * w);
        out.c = cp - c1;
        let ls = out.q * zs.re / w;
        let l1 = zs.im / w;
        out.l = ls - l1;
    }

    out.c = scale(out.c, cscale);
    out.l = scale(out.l, lscale);

    if (out.c < 0.0) || (out.l < 0.0) {
        out.c = NAN;
        out.l = NAN;
        out.q = NAN;
    }

    Ok(out)
}

fn calc_tee(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    q_tgt: f64,
    cscale: &str,
    lscale: &str,
) -> Result<PiTee, String> {
    let mut out = PiTee::default();
    out.q = q_tgt;

    if q_tgt < 0.0 {
        out.c = NAN;
        out.cs = NAN;
        out.cl = NAN;
        out.l = NAN;
        out.ls = NAN;
        out.ll = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        if (q_tgt == 0.0) && (zs.re == zl.re) {
            out.cs = 0.0;
            out.cl = 0.0;
            out.l = 0.0;
            out.ls = 0.0;
            out.ll = 0.0;
            out.c = 0.0;
            out.q = 0.0;
            return Ok(out);
        } else {
            if q_tgt < (zs.re.max(zl.re) / zs.re.min(zl.re) - 1.0).sqrt() {
                out.c = NAN;
                out.cs = NAN;
                out.cl = NAN;
                out.l = NAN;
                out.ls = NAN;
                out.ll = NAN;
                out.q = NAN;
                return Ok(out);
            } else {
                let rv = zs.re.min(zl.re) * (q_tgt.powi(2) + 1.0);

                let mut q = (rv / zs.re - 1.0).sqrt();
                out.cs = 1.0 / (w * zs.re * q);
                if zs.im != 0.0 {
                    if out.cs == -1.0 / (w * zs.im) {
                        out.cs = INFINITY;
                    } else {
                        out.cs *= -1.0 / (w * zs.im) / (out.cs + 1.0 / (w * zs.im));
                    }
                }

                let ls = rv / (w * q);
                q = (rv / zl.re - 1.0).sqrt();
                out.cl = 1.0 / (w * zl.re * q);
                if zl.im != 0.0 {
                    if out.cl == -1.0 / (w * zs.im) {
                        out.cl = INFINITY;
                    } else {
                        out.cl *= -1.0 / (w * zs.im) / (out.cl + 1.0 / (w * zs.im));
                    }
                }

                let ll = rv / (w * q);
                out.l = ll * ls / (ll + ls);

                q = (rv / zs.re - 1.0).sqrt();
                out.ls = q * zs.re / w - zs.im / w;
                let cs = q / (w * rv);
                q = (rv / zl.re - 1.0).sqrt();
                out.ll = q * zl.re / w - zl.im / w;
                let cl = q / (w * rv);
                out.c = cs + cl;
            }
        }
    }

    out.c = scale(out.c, cscale);
    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.l = scale(out.l, lscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.c < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.c = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }
    if (out.l < 0.0)
        || (out.cs < 0.0)
        || (out.cl < 0.0)
        || (out.cs == INFINITY)
        || (out.cl == INFINITY)
    {
        out.l = NAN;
        out.cs = NAN;
        out.cl = NAN;
    }

    Ok(out)
}

fn calc_pi(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    q_tgt: f64,
    cscale: &str,
    lscale: &str,
) -> Result<PiTee, String> {
    let mut out = PiTee::default();
    out.q = q_tgt;

    if q_tgt < 0.0 {
        out.c = NAN;
        out.cs = NAN;
        out.cl = NAN;
        out.l = NAN;
        out.ls = NAN;
        out.ll = NAN;
        out.q = NAN;
        return Ok(out);
    } else {
        if (q_tgt == 0.0) && (zs.re == zl.re) {
            out.cs = 0.0;
            out.cl = 0.0;
            out.l = 0.0;
            out.ls = 0.0;
            out.ll = 0.0;
            out.c = 0.0;
            out.q = 0.0;
            return Ok(out);
        } else {
            if q_tgt < (zs.re.max(zl.re) / zs.re.min(zl.re) - 1.0).sqrt() {
                out.c = NAN;
                out.cs = NAN;
                out.cl = NAN;
                out.l = NAN;
                out.ls = NAN;
                out.ll = NAN;
                out.q = NAN;
                return Ok(out);
            } else {
                let rv = zs.re.max(zl.re) / (q_tgt.powi(2) + 1.0);

                let qs = -zs.im / zs.re;
                let ql = -zl.im / zl.re;
                let rps = zs.re * (1.0 + qs.powi(2));
                let rpl = zl.re * (1.0 + ql.powi(2));

                //cs-l-cl pi network matching
                let cps = qs / (rps * w);
                let cpl = ql / (rpl * w);
                let mut q = (rps / rv - 1.0).sqrt();
                out.cs = q / (w * rps) - cps;
                let ls = q * rv / w;
                q = (rpl / rv - 1.0).sqrt();
                out.cl = q / (w * rpl) - cpl;
                let ll = q * rv / w;
                out.l = ls + ll;

                //ls-c-ll pi network matching
                q = (rps / rv - 1.0).sqrt();
                out.ls = rps / (w * q);
                if qs != 0.0 {
                    let lps = rps / (qs * w);
                    out.ls *= lps / (out.ls - lps);
                }
                let cs = 1.0 / (w * q * rv);
                q = (rpl / rv - 1.0).sqrt();
                out.ll = rpl / (w * q);
                if ql != 0.0 {
                    let lpl = rpl / (ql * w);
                    out.ll *= lpl / (out.ll - lpl);
                }
                let cl = 1.0 / (w * q * rv);
                out.c = cl * cs / (cl + cs);
            }
        }
    }

    out.c = scale(out.c, cscale);
    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.l = scale(out.l, lscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.c < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.c = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }
    if (out.l < 0.0) || (out.cs < 0.0) || (out.cl < 0.0) {
        out.l = NAN;
        out.cs = NAN;
        out.cl = NAN;
    }

    Ok(out)
}

fn calc_lp1(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = -zs.im / zs.re;
    let rp = (1.0 + q.powi(2)) * zs.re;
    let rv = (rp * zl.re).sqrt();

    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zl.re - 1.0).sqrt();
        let cp = q / (w * rp);
        out.cs = qs / (w * rp) - cp;
        out.ls = qs * rv / w;
        out.ll = zl.re * ql / w - zl.im / w;
        out.cl = ql / (w * rv);
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

fn calc_lp2(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = -zl.im / zl.re;
    let rp = (1.0 + q.powi(2)) * zl.re;
    let rv = (rp * zs.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zs.re - 1.0).sqrt();
        let cp = q / (w * rp);
        out.cs = qs / (w * rp) - cp;
        out.ls = qs * rv / w;
        out.ll = zs.re * ql / w - zs.im / w;
        out.cl = ql / (w * rv);
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

fn calc_hp1(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = zs.im / zs.re;
    let rp = (1.0 + q.powi(2)) * zs.re;
    let rv = (rp * zl.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zl.re - 1.0).sqrt();
        let lp = rp / (w * q);
        out.cs = 1.0 / (w * rv * qs);
        out.ls = rp / (w * qs);
        if zs.im != 0.0 {
            if lp == out.ls {
                out.ls = INFINITY;
            } else {
                out.ls *= lp / (lp - out.ls);
            }
        }

        let cs = -1.0 / (w * zl.im);
        out.ll = rv / (w * ql);
        out.cl = 1.0 / (w * zl.re * ql);
        if zl.im != 0.0 {
            if cs == out.cl {
                out.cl = INFINITY;
            } else {
                out.cl *= cs / (cs - out.cl);
            }
        }
    } else {
        out.ls = NAN;
        out.ll = NAN;
        out.cs = NAN;
        out.cl = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

fn calc_hp2(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = zl.im / zl.re;
    let rp = (1.0 + q.powi(2)) * zl.re;
    let rv = (rp * zs.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zs.re - 1.0).sqrt();
        let lp = rp / (w * q);
        out.cs = 1.0 / (w * rv * qs);
        out.ls = rp / (w * qs);
        if zl.im != 0.0 {
            if lp == out.ls {
                out.ls = INFINITY;
            } else {
                out.ls *= lp / (lp - out.ls);
            }
        }

        let cs = -1.0 / (w * zs.im);
        out.ll = rv / (w * ql);
        out.cl = 1.0 / (w * zs.re * ql);
        if zs.im != 0.0 {
            if cs == out.cl {
                out.cs = INFINITY;
            } else {
                out.cl *= cs / (cs - out.cl);
            }
        }
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

// --------CAP-------IND--
//     |         |
//    IND       CAP
//     |         |
//    GND       GND
fn calc_bp1(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = zs.im / zs.re;
    let rp = (1.0 + q.powi(2)) * zs.re;
    let rv = (rp * zl.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zl.re - 1.0).sqrt();
        let lp = rp / (w * q);
        out.cs = 1.0 / (w * rv * qs);
        out.ls = rp / (w * qs);
        if zs.im != 0.0 {
            if lp == out.ls {
                out.ls = INFINITY;
            } else {
                out.ls *= lp / (lp - out.ls);
            }
        }

        out.ll = ql * zl.re / w - zl.im / w;
        out.cl = ql / (w * rv);
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

// ---IND-------CAP-------
//          |         |
//         CAP       IND
//          |         |
//         GND       GND
fn calc_bp2(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = zl.im / zl.re;
    let rp = (1.0 + q.powi(2)) * zl.re;
    let rv = (rp * zs.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zs.re - 1.0).sqrt();
        let lp = rp / (w * q);
        out.cs = 1.0 / (w * rv * qs);
        out.ls = rp / (w * qs);
        if zl.im != 0.0 {
            if lp == out.ls {
                out.ls = INFINITY;
            } else {
                out.ls *= lp / (lp - out.ls);
            }
        }

        out.ll = ql * zs.re / w - zs.im / w;
        out.cl = ql / (w * rv);
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

// --------IND-------CAP--
//     |         |
//    CAP       IND
//     |         |
//    GND       GND
fn calc_bp3(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = -zs.im / zs.re;
    let rp = (1.0 + q.powi(2)) * zs.re;
    let rv = (rp * zl.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zl.re - 1.0).sqrt();
        let cp = q / (w * rp);
        out.cs = qs / (w * rp) - cp;
        out.ls = qs * rv / w;
        out.ll = rv / (w * ql);
        let cs = -1.0 / (w * zl.im);
        out.cl = 1.0 / (w * zl.re * ql);
        if zl.im != 0.0 {
            if cs == out.cl {
                out.cl = INFINITY;
            } else {
                out.cl *= cs / (cs - out.cl);
            }
        }
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

// ---CAP-------IND-------
//          |         |
//         IND       CAP
//          |         |
//         GND       GND
fn calc_bp4(
    zs: Complex<f64>,
    zl: Complex<f64>,
    w: f64,
    cscale: &str,
    lscale: &str,
) -> Result<CCLL, String> {
    let mut out = CCLL::default();

    let q = -zl.im / zl.re;
    let rp = (1.0 + q.powi(2)) * zl.re;
    let rv = (rp * zs.re).sqrt();
    if rp > rv {
        let qs = (rp / rv - 1.0).sqrt();
        let ql = (rv / zs.re - 1.0).sqrt();
        let cp = q / (w * rp);
        out.cs = qs / (w * rp) - cp;
        out.ls = qs * rv / w;
        out.ll = rv / (w * ql);
        let cs = -1.0 / (w * zs.im);
        out.cl = 1.0 / (w * zs.re * ql);
        if zs.im != 0.0 {
            if cs == out.cl {
                out.cl = INFINITY;
            } else {
                out.cl *= cs / (cs - out.cl);
            }
        }
    } else {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
        return Ok(out);
    }

    out.cs = scale(out.cs, cscale);
    out.cl = scale(out.cl, cscale);
    out.ls = scale(out.ls, lscale);
    out.ll = scale(out.ll, lscale);

    if (out.cs < 0.0) || (out.cl < 0.0) || (out.ls < 0.0) || (out.ll < 0.0) {
        out.cs = NAN;
        out.cl = NAN;
        out.ls = NAN;
        out.ll = NAN;
    }

    Ok(out)
}

#[tauri::command]
fn calc_networks(
    rs: f64,
    xs: f64,
    rl: f64,
    xl: f64,
    imp: &str,
    q: f64,
    z0: f64,
    freq: f64,
    fscale: &str,
    cscale: &str,
    lscale: &str,
    zscale: &str,
) -> Result<ResultsReturn, String> {
    let mut out = ResultsReturn::default();

    let w = 2.0 * PI * unscale(freq, fscale);

    let (zs_init, zl_init) = match imp {
        "zri" => (Complex::new(rs, xs), Complex::new(rl, xl)),
        "yri" => (1.0 / Complex::new(rs, xs), 1.0 / Complex::new(rl, xl)),
        "gma" => (
            calc_z(Complex::from_polar(rs, xs * PI / 180.0), z0),
            calc_z(Complex::from_polar(rl, xl * PI / 180.0), z0),
        ),
        "gri" => (
            calc_z(Complex::new(rs, xs), z0),
            calc_z(Complex::new(rl, xl), z0),
        ),
        "rc" => (
            1.0 / Complex::new(1.0 / rs, xs * 2.0 * PI * unscale(freq, fscale)),
            1.0 / Complex::new(1.0 / rl, xl * 2.0 * PI * unscale(freq, fscale)),
        ),
        _ => (
            Complex::new(INFINITY, INFINITY),
            Complex::new(INFINITY, INFINITY),
        ),
    };

    let (zs, zl) = match zscale {
        "diff" => (zs_init / 2.0, zl_init / 2.0),
        "se" => (zs_init, zl_init),
        _ => (
            Complex::new(INFINITY, INFINITY),
            Complex::new(INFINITY, INFINITY),
        ),
    };

    if zs == Complex::new(INFINITY, INFINITY) || zl == Complex::new(INFINITY, INFINITY) {
        return Err("Impedance type not recognized".to_string());
    }

    out.hp_ell_cl = calc_hp_ell_cl(zs, zl, w, cscale, lscale)?;
    out.hp_ell_lc = calc_hp_ell_lc(zs, zl, w, cscale, lscale)?;
    out.lp_ell_cl = calc_lp_ell_cl(zs, zl, w, cscale, lscale)?;
    out.lp_ell_lc = calc_lp_ell_lc(zs, zl, w, cscale, lscale)?;
    out.tee = calc_tee(zs, zl, w, q, cscale, lscale)?;
    out.pi = calc_pi(zs, zl, w, q, cscale, lscale)?;
    out.lp1 = calc_lp1(zs, zl, w, cscale, lscale)?;
    out.lp2 = calc_lp2(zs, zl, w, cscale, lscale)?;
    out.hp1 = calc_hp1(zs, zl, w, cscale, lscale)?;
    out.hp2 = calc_hp2(zs, zl, w, cscale, lscale)?;
    out.bp1 = calc_bp1(zs, zl, w, cscale, lscale)?;
    out.bp2 = calc_bp2(zs, zl, w, cscale, lscale)?;
    out.bp3 = calc_bp3(zs, zl, w, cscale, lscale)?;
    out.bp4 = calc_bp4(zs, zl, w, cscale, lscale)?;

    Ok(out)
}

#[tauri::command]
fn change_impedance(
    rs: f64,
    xs: f64,
    rl: f64,
    xl: f64,
    imp_in: &str,
    imp_out: &str,
    z0: f64,
    freq: f64,
    fscale: &str,
    cscale: &str,
) -> Result<ComplexReturn, String> {
    match (imp_in, imp_out) {
        ("zri", "zri") => Ok(ComplexReturn {
            rs: rs,
            xs: xs,
            rl: rl,
            xl: xl,
        }),
        ("zri", "yri") => {
            let ys = Complex::new(rs, xs).inv();
            let yl = Complex::new(rl, xl).inv();
            Ok(ComplexReturn {
                rs: ys.re,
                xs: ys.im,
                rl: yl.re,
                xl: yl.im,
            })
        }
        ("zri", "gma") => {
            let gs = calc_gamma(Complex::new(rs, xs), z0);
            let gl = calc_gamma(Complex::new(rl, xl), z0);
            Ok(ComplexReturn {
                rs: gs.norm(),
                xs: gs.arg() * 180.0 / PI,
                rl: gl.norm(),
                xl: gl.arg() * 180.0 / PI,
            })
        }
        ("zri", "gri") => {
            let gs = calc_gamma(Complex::new(rs, xs), z0);
            let gl = calc_gamma(Complex::new(rl, xl), z0);
            Ok(ComplexReturn {
                rs: gs.re,
                xs: gs.im,
                rl: gl.re,
                xl: gl.im,
            })
        }
        ("zri", "rc") => {
            let (src_r, src_c) = calc_rc(Complex::new(rs, xs), freq, fscale, "", cscale);
            let (load_r, load_c) = calc_rc(Complex::new(rl, xl), freq, fscale, "", cscale);
            Ok(ComplexReturn {
                rs: src_r,
                xs: src_c,
                rl: load_r,
                xl: load_c,
            })
        }
        ("yri", "zri") => {
            let zs = Complex::new(rs, xs).inv();
            let zl = Complex::new(rl, xl).inv();
            Ok(ComplexReturn {
                rs: zs.re,
                xs: zs.im,
                rl: zl.re,
                xl: zl.im,
            })
        }
        ("yri", "yri") => Ok(ComplexReturn {
            rs: rs,
            xs: xs,
            rl: rl,
            xl: xl,
        }),
        ("yri", "gma") => {
            let gs = calc_gamma(Complex::new(rs, xs).inv(), z0);
            let gl = calc_gamma(Complex::new(rl, xl).inv(), z0);
            Ok(ComplexReturn {
                rs: gs.norm(),
                xs: gs.arg() * 180.0 / PI,
                rl: gl.norm(),
                xl: gl.arg() * 180.0 / PI,
            })
        }
        ("yri", "gri") => {
            let gs = calc_gamma(Complex::new(rs, xs).inv(), z0);
            let gl = calc_gamma(Complex::new(rl, xl).inv(), z0);
            Ok(ComplexReturn {
                rs: gs.re,
                xs: gs.im,
                rl: gl.re,
                xl: gl.im,
            })
        }
        ("yri", "rc") => {
            let (src_r, src_c) = calc_rc(Complex::new(rs, xs).inv(), freq, fscale, "", cscale);
            let (load_r, load_c) = calc_rc(Complex::new(rl, xl).inv(), freq, fscale, "", cscale);
            Ok(ComplexReturn {
                rs: src_r,
                xs: src_c,
                rl: load_r,
                xl: load_c,
            })
        }
        ("gma", "zri") => {
            let zs = calc_z(Complex::new(rs, xs), z0);
            let zl = calc_z(Complex::new(rl, xl), z0);
            Ok(ComplexReturn {
                rs: zs.re,
                xs: zs.im,
                rl: zl.re,
                xl: zl.im,
            })
        }
        ("gma", "yri") => {
            let ys = calc_z(Complex::from_polar(rs, xs * PI / 180.0), z0).inv();
            let yl = calc_z(Complex::from_polar(rl, xl * PI / 180.0), z0).inv();
            Ok(ComplexReturn {
                rs: ys.re,
                xs: ys.im,
                rl: yl.re,
                xl: yl.im,
            })
        }
        ("gma", "gma") => Ok(ComplexReturn {
            rs: rs,
            xs: xs,
            rl: rl,
            xl: xl,
        }),
        ("gma", "gri") => {
            let gs = Complex::from_polar(rs, xs * PI / 180.0);
            let gl = Complex::from_polar(rl, xl * PI / 180.0);
            Ok(ComplexReturn {
                rs: gs.re,
                xs: gs.im,
                rl: gl.re,
                xl: gl.im,
            })
        }
        ("gma", "rc") => {
            let (src_r, src_c) =
                calc_rc(calc_z(Complex::new(rs, xs), z0), freq, fscale, "", cscale);
            let (load_r, load_c) =
                calc_rc(calc_z(Complex::new(rl, xl), z0), freq, fscale, "", cscale);
            Ok(ComplexReturn {
                rs: src_r,
                xs: src_c,
                rl: load_r,
                xl: load_c,
            })
        }
        ("gri", "zri") => {
            let zs = calc_z(Complex::new(rs, xs), z0);
            let zl = calc_z(Complex::new(rl, xl), z0);
            Ok(ComplexReturn {
                rs: zs.re,
                xs: zs.im,
                rl: zl.re,
                xl: zl.im,
            })
        }
        ("gri", "yri") => {
            let ys = calc_z(Complex::new(rs, xs), z0).inv();
            let yl = calc_z(Complex::new(rl, xl), z0).inv();
            Ok(ComplexReturn {
                rs: ys.re,
                xs: ys.im,
                rl: yl.re,
                xl: yl.im,
            })
        }
        ("gri", "gma") => {
            let gs = Complex::new(rs, xs);
            let gl = Complex::new(rl, xl);
            Ok(ComplexReturn {
                rs: gs.norm(),
                xs: gs.arg() * 180.0 / PI,
                rl: gl.norm(),
                xl: gl.arg() * 180.0 / PI,
            })
        }
        ("gri", "gri") => Ok(ComplexReturn {
            rs: rs,
            xs: xs,
            rl: rl,
            xl: xl,
        }),
        ("gri", "rc") => {
            let (src_r, src_c) =
                calc_rc(calc_z(Complex::new(rs, xs), z0), freq, fscale, "", cscale);
            let (load_r, load_c) =
                calc_rc(calc_z(Complex::new(rl, xl), z0), freq, fscale, "", cscale);
            Ok(ComplexReturn {
                rs: src_r,
                xs: src_c,
                rl: load_r,
                xl: load_c,
            })
        }
        ("rc", "zri") => {
            let zs = Complex::new(
                1.0 / rs,
                unscale(xs, cscale) * 2.0 * PI * unscale(freq, fscale),
            )
            .inv();
            let zl = Complex::new(
                1.0 / rl,
                unscale(xl, cscale) * 2.0 * PI * unscale(freq, fscale),
            )
            .inv();
            Ok(ComplexReturn {
                rs: zs.re,
                xs: zs.im,
                rl: zl.re,
                xl: zl.im,
            })
        }
        ("rc", "yri") => {
            let ys = Complex::new(
                1.0 / rs,
                unscale(xs, cscale) * 2.0 * PI * unscale(freq, fscale),
            );
            let yl = Complex::new(
                1.0 / rl,
                unscale(xl, cscale) * 2.0 * PI * unscale(freq, fscale),
            );
            Ok(ComplexReturn {
                rs: ys.re,
                xs: ys.im,
                rl: yl.re,
                xl: yl.im,
            })
        }
        ("rc", "gma") => {
            let gs = calc_gamma(
                Complex::new(
                    1.0 / rs,
                    unscale(xs, cscale) * 2.0 * PI * unscale(freq, fscale),
                )
                .inv(),
                z0,
            );
            let gl = calc_gamma(
                Complex::new(
                    1.0 / rl,
                    unscale(xl, cscale) * 2.0 * PI * unscale(freq, fscale),
                )
                .inv(),
                z0,
            );
            Ok(ComplexReturn {
                rs: gs.norm(),
                xs: gs.arg() * 180.0 / PI,
                rl: gl.norm(),
                xl: gl.arg() * 180.0 / PI,
            })
        }
        ("rc", "gri") => {
            let gs = calc_gamma(
                Complex::new(
                    1.0 / rs,
                    unscale(xs, cscale) * 2.0 * PI * unscale(freq, fscale),
                )
                .inv(),
                z0,
            );
            let gl = calc_gamma(
                Complex::new(
                    1.0 / rl,
                    unscale(xl, cscale) * 2.0 * PI * unscale(freq, fscale),
                )
                .inv(),
                z0,
            );
            Ok(ComplexReturn {
                rs: gs.re,
                xs: gs.im,
                rl: gl.re,
                xl: gl.im,
            })
        }
        ("rc", "rc") => Ok(ComplexReturn {
            rs: rs,
            xs: xs,
            rl: rl,
            xl: xl,
        }),
        _ => Err("impedance unit(s) not recognized".to_string()),
    }
}

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![calc_networks, change_impedance])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calc_gamma() {
        let z = Complex::new(42.4, -19.6);
        let z0 = 50.0;
        let gamma = Complex::new(-0.03565151895556114, -0.21968365553602814);

        assert_eq!(calc_gamma(z, z0), gamma);
    }

    #[test]
    fn test_calc_z() {
        let gamma = Complex::new(0.2464, -0.8745);
        let z0 = 100.0;
        let z = Complex::new(13.096841624374102, -131.24096072255193);

        assert_eq!(calc_z(gamma, z0), z);
    }

    #[test]
    fn test_calc_rc() {
        let z = Complex::new(42.4, -19.6);
        let f = 275.0;
        let r = 51.46037735849057;
        let c = 5.198818862788317;

        assert_eq!(calc_rc(z, f, "giga", "", "femto"), (r, c));
    }

    #[test]
    fn test_calc_hp_ell_cl() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CL {
            c: 8.58125245724517,
            l: 69.18681390709257,
            q: 2.0529004985170953,
        };
        assert_eq!(calc_hp_ell_cl(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(62.4, -14.6);
        let zl = Complex::new(202.3, 23.2);
        let w = 2.0 * PI * 175.0e6;
        let cscale = "pico";
        let lscale = "nano";
        let exemplar = CL {
            c: 11.408503434826747,
            l: 133.4483264614267,
            q: 1.5114976179652644,
        };
        assert_eq!(calc_hp_ell_cl(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 175.0e9;
        let cscale = "pico";
        let lscale = "nano";
        let _exemplar = CL {
            c: NAN,
            l: NAN,
            q: NAN,
        };
        let test = calc_hp_ell_cl(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.l.is_nan());
        assert!(test.q.is_nan());
    }

    #[test]
    fn test_calc_hp_ell_lc() {
        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CL {
            c: 8.58125245724517,
            l: 69.18681390709257,
            q: 2.0529004985170953,
        };
        assert_eq!(calc_hp_ell_lc(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(202.3, 23.2);
        let zl = Complex::new(62.4, -14.6);
        let w = 2.0 * PI * 175.0e6;
        let cscale = "pico";
        let lscale = "nano";
        let exemplar = CL {
            c: 11.408503434826747,
            l: 133.4483264614267,
            q: 1.5114976179652644,
        };
        assert_eq!(calc_hp_ell_lc(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CL {
            c: NAN,
            l: NAN,
            q: NAN,
        };
        let test = calc_hp_ell_lc(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.l.is_nan());
        assert!(test.q.is_nan());
    }

    #[test]
    fn test_calc_lp_ell_cl() {
        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CL {
            c: 5.906505625073422,
            l: 61.719118523742445,
            q: 2.0529004985170953,
        };
        assert_eq!(calc_lp_ell_cl(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(202.3, 23.2);
        let zl = Complex::new(62.4, -14.6);
        let w = 2.0 * PI * 175.0e6;
        let cscale = "pico";
        let lscale = "nano";
        let exemplar = CL {
            c: 7.2157251698188345,
            l: 99.0557187033109,
            q: 1.5114976179652644,
        };
        assert_eq!(calc_lp_ell_cl(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CL {
            c: NAN,
            l: NAN,
            q: NAN,
        };
        let test = calc_lp_ell_cl(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.l.is_nan());
        assert!(test.q.is_nan());
    }

    #[test]
    fn test_calc_lp_ell_lc() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CL {
            c: 5.906505625073422,
            l: 61.719118523742445,
            q: 2.0529004985170953,
        };
        assert_eq!(calc_lp_ell_lc(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(62.4, -14.6);
        let zl = Complex::new(202.3, 23.2);
        let w = 2.0 * PI * 175.0e6;
        let cscale = "pico";
        let lscale = "nano";
        let exemplar = CL {
            c: 7.2157251698188345,
            l: 99.0557187033109,
            q: 1.5114976179652644,
        };
        assert_eq!(calc_lp_ell_lc(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CL {
            c: NAN,
            l: NAN,
            q: NAN,
        };
        let test = calc_lp_ell_lc(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.l.is_nan());
        assert!(test.q.is_nan());
    }

    #[test]
    fn test_calc_tee() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let q = 4.32;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = PiTee {
            c: 4.186603177852454,
            cs: -3.5382547173462546,
            cl: -1.6843173326757916,
            l: 80.00425342422247,
            ls: 117.35101636675431,
            ll: 185.20322518485523,
            q: 4.32,
        };
        // assert_eq!(calc_tee(zs, zl, w, q, cscale, lscale).unwrap(), exemplar);
        let test = calc_tee(zs, zl, w, q, cscale, lscale).unwrap();
        assert_eq!(test.c, exemplar.c);
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.l.is_nan());
        assert_eq!(test.ls, exemplar.ls);
        assert_eq!(test.ll, exemplar.ll);
        assert_eq!(test.q, exemplar.q);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let q = 1.99;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = PiTee {
            c: NAN,
            cs: NAN,
            cl: NAN,
            l: NAN,
            ls: NAN,
            ll: NAN,
            q: NAN,
        };
        let test = calc_tee(zs, zl, w, q, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.l.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
        assert!(test.q.is_nan());

        let zs = Complex::new(212.3, -363.20820041403255);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let q = 4.32;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = PiTee {
            c: 4.186603177852454,
            cs: INFINITY,
            cl: 3.214533455728058,
            l: 80.00425342422247,
            ls: 420.4100397629459,
            ll: 117.35101636675431,
            q: 4.32,
        };
        assert_eq!(calc_tee(zs, zl, w, q, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, -183.168);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let q = 4.32;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = PiTee {
            c: 4.186603177852454,
            cs: -3.214533455728058,
            cl: INFINITY,
            l: 80.00425342422247,
            ls: 316.2126293951322,
            ll: 117.35101636675431,
            q: 4.32,
        };
        // assert_eq!(calc_tee(zs, zl, w, q, cscale, lscale).unwrap(), exemplar);
        let test = calc_tee(zs, zl, w, q, cscale, lscale).unwrap();
        assert_eq!(test.c, exemplar.c);
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.l.is_nan());
        assert_eq!(test.ls, exemplar.ls);
        assert_eq!(test.ll, exemplar.ll);
        assert_eq!(test.q, exemplar.q);
    }

    #[test]
    fn test_calc_pi() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let q = 4.32;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = PiTee {
            c: 8.435997609374349,
            cs: 16.62637373190316,
            cl: 12.08508737222243,
            l: 39.704380813877926,
            ls: -20.145466896660622,
            ll: -27.71565081088584,
            q: 4.32,
        };
        // assert_eq!(calc_pi(zs, zl, w, q, cscale, lscale).unwrap(), exemplar);
        let test = calc_pi(zs, zl, w, q, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert_eq!(test.cs, exemplar.cs);
        assert_eq!(test.cl, exemplar.cl);
        assert_eq!(test.l, exemplar.l);
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
        assert_eq!(test.q, exemplar.q);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let q = 1.99;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = PiTee {
            c: NAN,
            cs: NAN,
            cl: NAN,
            l: NAN,
            ls: NAN,
            ll: NAN,
            q: NAN,
        };
        let test = calc_pi(zs, zl, w, q, cscale, lscale).unwrap();
        assert!(test.c.is_nan());
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.l.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
        assert!(test.q.is_nan());

        let zs = Complex::new(42.4, 0.0);
        let zl = Complex::new(212.3, 0.0);
        let w = 2.0 * PI * 275.0e9;
        let q = 3.88;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = PiTee {
            c: 8.157016433395613,
            cs: 20.27486954435912,
            cl: 10.57716232084193,
            l: 41.06232522178837,
            ls: 16.520257301519933,
            ll: 31.666911357459586,
            q: 3.88,
        };
        assert_eq!(calc_pi(zs, zl, w, q, cscale, lscale).unwrap(), exemplar);
    }

    #[test]
    fn test_calc_lp1() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_lp1(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 3.498285705078592,
            cl: 6.772022183008002,
            ls: 63.48256505664435,
            ll: 39.14388565971301,
        };

        assert_eq!(calc_lp1(zs, zl, w, cscale, lscale).unwrap(), exemplar);
    }

    #[test]
    fn test_calc_lp2() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 3.498285705078592,
            cl: 6.772022183008002,
            ls: 63.48256505664435,
            ll: 39.14388565971301,
        };

        assert_eq!(calc_lp2(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_lp2(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
    }

    #[test]
    fn test_calc_hp1() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_hp1(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 5.276189790514869,
            cl: 20.352712959723295,
            ls: 137.66998607438342,
            ll: 49.4602723641384,
        };
        assert_eq!(calc_hp1(zs, zl, w, cscale, lscale).unwrap(), exemplar);
    }

    #[test]
    fn test_calc_hp2() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 5.276189790514869,
            cl: 20.352712959723295,
            ls: 137.66998607438342,
            ll: 49.4602723641384,
        };
        assert_eq!(calc_hp2(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_hp2(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
    }

    #[test]
    fn test_calc_bp1() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_bp1(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 5.276189790514869,
            cl: 6.772022183008002,
            ls: 137.66998607438342,
            ll: 39.14388565971301,
        };
        assert_eq!(calc_bp1(zs, zl, w, cscale, lscale).unwrap(), exemplar);
    }

    #[test]
    fn test_calc_bp2() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 5.276189790514869,
            cl: 6.772022183008002,
            ls: 137.66998607438342,
            ll: 39.14388565971301,
        };
        assert_eq!(calc_bp2(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_bp2(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
    }

    #[test]
    fn test_calc_bp3() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_bp3(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 3.498285705078592,
            cl: 20.352712959723295,
            ls: 63.48256505664435,
            ll: 49.4602723641384,
        };
        assert_eq!(calc_bp3(zs, zl, w, cscale, lscale).unwrap(), exemplar);
    }

    #[test]
    fn test_calc_bp4() {
        let zs = Complex::new(42.4, -19.6);
        let zl = Complex::new(212.3, 43.2);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let exemplar = CCLL {
            cs: 3.498285705078592,
            cl: 20.352712959723295,
            ls: 63.48256505664435,
            ll: 49.4602723641384,
        };
        assert_eq!(calc_bp4(zs, zl, w, cscale, lscale).unwrap(), exemplar);

        let zs = Complex::new(212.3, 43.2);
        let zl = Complex::new(42.4, -19.6);
        let w = 2.0 * PI * 275.0e9;
        let cscale = "femto";
        let lscale = "pico";
        let _exemplar = CCLL {
            cs: NAN,
            cl: NAN,
            ls: NAN,
            ll: NAN,
        };
        let test = calc_bp4(zs, zl, w, cscale, lscale).unwrap();
        assert!(test.cs.is_nan());
        assert!(test.cl.is_nan());
        assert!(test.ls.is_nan());
        assert!(test.ll.is_nan());
    }
}
