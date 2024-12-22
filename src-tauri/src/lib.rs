use crate::matching::{
    calc_bp1, calc_bp2, calc_bp3, calc_bp4, calc_hp1, calc_hp2, calc_hp_ell_cl, calc_hp_ell_cl_w_q,
    calc_hp_ell_lc, calc_hp_ell_lc_w_q, calc_lp1, calc_lp2, calc_lp_ell_cl, calc_lp_ell_cl_w_q,
    calc_lp_ell_lc, calc_lp_ell_lc_w_q, calc_pi, calc_tee, PiTee, CCLL, CL, CLQ,
};
use crate::rf_utils::{calc_gamma, calc_rc, calc_z, unscale, ComplexReturn};
use num_complex::Complex;
use std::f64::consts::PI;
use std::f64::INFINITY;
use tauri::Manager;

mod matching;
mod rf_utils;

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct MatchingReturn {
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
    hp_ell_cl_w_q: CLQ,
    hp_ell_lc: CL,
    hp_ell_lc_w_q: CLQ,
    lp_ell_cl: CL,
    lp_ell_cl_w_q: CLQ,
    lp_ell_lc: CL,
    lp_ell_lc_w_q: CLQ,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct Complex2Return {
    src: ComplexReturn,
    load: ComplexReturn,
}

#[tauri::command(rename_all = "snake_case")]
fn calc_networks(
    rs: f64,
    xs: f64,
    rl: f64,
    xl: f64,
    imp: &str,
    q_net: f64,
    q: f64,
    z0: f64,
    freq: f64,
    f_scale: &str,
    c_scale: &str,
    l_scale: &str,
    z_scale: &str,
) -> Result<MatchingReturn, String> {
    let mut out = MatchingReturn::default();

    let w = 2.0 * PI * unscale(freq, f_scale);

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
            1.0 / Complex::new(1.0 / rs, xs * 2.0 * PI * unscale(freq, f_scale)),
            1.0 / Complex::new(1.0 / rl, xl * 2.0 * PI * unscale(freq, f_scale)),
        ),
        _ => (
            Complex::new(INFINITY, INFINITY),
            Complex::new(INFINITY, INFINITY),
        ),
    };

    let (zs, zl) = match z_scale {
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

    out.hp_ell_cl = calc_hp_ell_cl(zs, zl, w, c_scale, l_scale)?;
    out.hp_ell_cl_w_q = calc_hp_ell_cl_w_q(zs, zl, q, w, c_scale, l_scale)?;
    out.hp_ell_lc = calc_hp_ell_lc(zs, zl, w, c_scale, l_scale)?;
    out.hp_ell_lc_w_q = calc_hp_ell_lc_w_q(zs, zl, q, w, c_scale, l_scale)?;
    out.lp_ell_cl = calc_lp_ell_cl(zs, zl, w, c_scale, l_scale)?;
    out.lp_ell_cl_w_q = calc_lp_ell_cl_w_q(zs, zl, q, w, c_scale, l_scale)?;
    out.lp_ell_lc = calc_lp_ell_lc(zs, zl, w, c_scale, l_scale)?;
    out.lp_ell_lc_w_q = calc_lp_ell_lc_w_q(zs, zl, q, w, c_scale, l_scale)?;
    out.tee = calc_tee(zs, zl, w, q_net, c_scale, l_scale)?;
    out.pi = calc_pi(zs, zl, w, q_net, c_scale, l_scale)?;
    out.lp1 = calc_lp1(zs, zl, w, c_scale, l_scale)?;
    out.lp2 = calc_lp2(zs, zl, w, c_scale, l_scale)?;
    out.hp1 = calc_hp1(zs, zl, w, c_scale, l_scale)?;
    out.hp2 = calc_hp2(zs, zl, w, c_scale, l_scale)?;
    out.bp1 = calc_bp1(zs, zl, w, c_scale, l_scale)?;
    out.bp2 = calc_bp2(zs, zl, w, c_scale, l_scale)?;
    out.bp3 = calc_bp3(zs, zl, w, c_scale, l_scale)?;
    out.bp4 = calc_bp4(zs, zl, w, c_scale, l_scale)?;

    Ok(out)
}

#[tauri::command(rename_all = "snake_case")]
fn change_impedance(
    rs: f64,
    xs: f64,
    rl: f64,
    xl: f64,
    imp_in: &str,
    imp_out: &str,
    z0: f64,
    freq: f64,
    f_scale: &str,
    c_scale: &str,
) -> Result<Complex2Return, String> {
    if imp_in == imp_out {
        return Ok(Complex2Return {
            src: ComplexReturn { re: rs, im: xs },
            load: ComplexReturn { re: rl, im: xl },
        });
    }

    match imp_in {
        "zri" => match imp_out {
            "yri" => {
                let ys = Complex::new(rs, xs).inv();
                let yl = Complex::new(rl, xl).inv();
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: ys.re,
                        im: ys.im,
                    },
                    load: ComplexReturn {
                        re: yl.re,
                        im: yl.im,
                    },
                })
            }
            "gma" => {
                let gs = calc_gamma(Complex::new(rs, xs), z0);
                let gl = calc_gamma(Complex::new(rl, xl), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.norm(),
                        im: gs.arg() * 180.0 / PI,
                    },
                    load: ComplexReturn {
                        re: gl.norm(),
                        im: gl.arg() * 180.0 / PI,
                    },
                })
            }
            "gri" => {
                let gs = calc_gamma(Complex::new(rs, xs), z0);
                let gl = calc_gamma(Complex::new(rl, xl), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.re,
                        im: gs.im,
                    },
                    load: ComplexReturn {
                        re: gl.re,
                        im: gl.im,
                    },
                })
            }
            "rc" => {
                let (src_r, src_c) = calc_rc(Complex::new(rs, xs), freq, f_scale, "", c_scale);
                let (load_r, load_c) = calc_rc(Complex::new(rl, xl), freq, f_scale, "", c_scale);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: src_r,
                        im: src_c,
                    },
                    load: ComplexReturn {
                        re: load_r,
                        im: load_c,
                    },
                })
            }
            _ => Err("impedance unit(s) not recognized".to_string()),
        },
        "yri" => match imp_out {
            "zri" => {
                let zs = Complex::new(rs, xs).inv();
                let zl = Complex::new(rl, xl).inv();
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: zs.re,
                        im: zs.im,
                    },
                    load: ComplexReturn {
                        re: zl.re,
                        im: zl.im,
                    },
                })
            }
            "gma" => {
                let gs = calc_gamma(Complex::new(rs, xs).inv(), z0);
                let gl = calc_gamma(Complex::new(rl, xl).inv(), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.norm(),
                        im: gs.arg() * 180.0 / PI,
                    },
                    load: ComplexReturn {
                        re: gl.norm(),
                        im: gl.arg() * 180.0 / PI,
                    },
                })
            }
            "gri" => {
                let gs = calc_gamma(Complex::new(rs, xs).inv(), z0);
                let gl = calc_gamma(Complex::new(rl, xl).inv(), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.re,
                        im: gs.im,
                    },
                    load: ComplexReturn {
                        re: gl.re,
                        im: gl.im,
                    },
                })
            }
            "rc" => {
                let (src_r, src_c) =
                    calc_rc(Complex::new(rs, xs).inv(), freq, f_scale, "", c_scale);
                let (load_r, load_c) =
                    calc_rc(Complex::new(rl, xl).inv(), freq, f_scale, "", c_scale);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: src_r,
                        im: src_c,
                    },
                    load: ComplexReturn {
                        re: load_r,
                        im: load_c,
                    },
                })
            }
            _ => Err("impedance unit(s) not recognized".to_string()),
        },
        "gma" => match imp_out {
            "zri" => {
                let zs = calc_z(Complex::new(rs, xs), z0);
                let zl = calc_z(Complex::new(rl, xl), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: zs.re,
                        im: zs.im,
                    },
                    load: ComplexReturn {
                        re: zl.re,
                        im: zl.im,
                    },
                })
            }
            "yri" => {
                let ys = calc_z(Complex::from_polar(rs, xs * PI / 180.0), z0).inv();
                let yl = calc_z(Complex::from_polar(rl, xl * PI / 180.0), z0).inv();
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: ys.re,
                        im: ys.im,
                    },
                    load: ComplexReturn {
                        re: yl.re,
                        im: yl.im,
                    },
                })
            }
            "gri" => {
                let gs = Complex::from_polar(rs, xs * PI / 180.0);
                let gl = Complex::from_polar(rl, xl * PI / 180.0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.re,
                        im: gs.im,
                    },
                    load: ComplexReturn {
                        re: gl.re,
                        im: gl.im,
                    },
                })
            }
            "rc" => {
                let (src_r, src_c) =
                    calc_rc(calc_z(Complex::new(rs, xs), z0), freq, f_scale, "", c_scale);
                let (load_r, load_c) =
                    calc_rc(calc_z(Complex::new(rl, xl), z0), freq, f_scale, "", c_scale);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: src_r,
                        im: src_c,
                    },
                    load: ComplexReturn {
                        re: load_r,
                        im: load_c,
                    },
                })
            }
            _ => Err("impedance unit(s) not recognized".to_string()),
        },
        "gri" => match imp_out {
            "zri" => {
                let zs = calc_z(Complex::new(rs, xs), z0);
                let zl = calc_z(Complex::new(rl, xl), z0);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: zs.re,
                        im: zs.im,
                    },
                    load: ComplexReturn {
                        re: zl.re,
                        im: zl.im,
                    },
                })
            }
            "yri" => {
                let ys = calc_z(Complex::new(rs, xs), z0).inv();
                let yl = calc_z(Complex::new(rl, xl), z0).inv();
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: ys.re,
                        im: ys.im,
                    },
                    load: ComplexReturn {
                        re: yl.re,
                        im: yl.im,
                    },
                })
            }
            "gma" => {
                let gs = Complex::new(rs, xs);
                let gl = Complex::new(rl, xl);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.norm(),
                        im: gs.arg() * 180.0 / PI,
                    },
                    load: ComplexReturn {
                        re: gl.norm(),
                        im: gl.arg() * 180.0 / PI,
                    },
                })
            }
            "rc" => {
                let (src_r, src_c) =
                    calc_rc(calc_z(Complex::new(rs, xs), z0), freq, f_scale, "", c_scale);
                let (load_r, load_c) =
                    calc_rc(calc_z(Complex::new(rl, xl), z0), freq, f_scale, "", c_scale);
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: src_r,
                        im: src_c,
                    },
                    load: ComplexReturn {
                        re: load_r,
                        im: load_c,
                    },
                })
            }
            _ => Err("impedance unit(s) not recognized".to_string()),
        },
        "rc" => match imp_out {
            "zri" => {
                let zs = Complex::new(
                    1.0 / rs,
                    unscale(xs, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                )
                .inv();
                let zl = Complex::new(
                    1.0 / rl,
                    unscale(xl, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                )
                .inv();
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: zs.re,
                        im: zs.im,
                    },
                    load: ComplexReturn {
                        re: zl.re,
                        im: zl.im,
                    },
                })
            }
            "yri" => {
                let ys = Complex::new(
                    1.0 / rs,
                    unscale(xs, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                );
                let yl = Complex::new(
                    1.0 / rl,
                    unscale(xl, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                );
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: ys.re,
                        im: ys.im,
                    },
                    load: ComplexReturn {
                        re: yl.re,
                        im: yl.im,
                    },
                })
            }
            "gma" => {
                let gs = calc_gamma(
                    Complex::new(
                        1.0 / rs,
                        unscale(xs, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                    )
                    .inv(),
                    z0,
                );
                let gl = calc_gamma(
                    Complex::new(
                        1.0 / rl,
                        unscale(xl, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                    )
                    .inv(),
                    z0,
                );
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.norm(),
                        im: gs.arg() * 180.0 / PI,
                    },
                    load: ComplexReturn {
                        re: gl.norm(),
                        im: gl.arg() * 180.0 / PI,
                    },
                })
            }
            "gri" => {
                let gs = calc_gamma(
                    Complex::new(
                        1.0 / rs,
                        unscale(xs, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                    )
                    .inv(),
                    z0,
                );
                let gl = calc_gamma(
                    Complex::new(
                        1.0 / rl,
                        unscale(xl, c_scale) * 2.0 * PI * unscale(freq, f_scale),
                    )
                    .inv(),
                    z0,
                );
                Ok(Complex2Return {
                    src: ComplexReturn {
                        re: gs.re,
                        im: gs.im,
                    },
                    load: ComplexReturn {
                        re: gl.re,
                        im: gl.im,
                    },
                })
            }
            _ => Err("impedance unit(s) not recognized".to_string()),
        },
        _ => Err("impedance unit(s) not recognized".to_string()),
    }
}

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
