use num_complex::Complex;

#[derive(serde::Serialize, Default, Debug, PartialEq)]
pub struct ComplexReturn {
    pub re: f64,
    pub im: f64,
}

pub enum Element {
    Capacitor,
    Inductor,
    Resistor,
    Frequency,
}

pub fn get_mult(scale: &str) -> f64 {
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

pub fn get_unit(scale: &str, elem: Element) -> String {
    match scale {
        "tera" | "T" | "THz" | "thz" => match elem {
            Element::Capacitor => "TF".to_string(),
            Element::Inductor => "TH".to_string(),
            Element::Resistor => "TΩ".to_string(),
            Element::Frequency => "THz".to_string(),
        },
        "giga" | "G" | "GHz" | "ghz" | "GΩ" => match elem {
            Element::Capacitor => "GF".to_string(),
            Element::Inductor => "GH".to_string(),
            Element::Resistor => "GΩ".to_string(),
            Element::Frequency => "GHz".to_string(),
        },
        "mega" | "M" | "MHz" | "mhz" | "MΩ" => match elem {
            Element::Capacitor => "MF".to_string(),
            Element::Inductor => "MH".to_string(),
            Element::Resistor => "MΩ".to_string(),
            Element::Frequency => "MHz".to_string(),
        },
        "kilo" | "k" | "kHz" | "khz" | "kΩ" => match elem {
            Element::Capacitor => "kF".to_string(),
            Element::Inductor => "kH".to_string(),
            Element::Resistor => "kΩ".to_string(),
            Element::Frequency => "kHz".to_string(),
        },
        "milli" | "m" | "mΩ" | "mF" | "mH" => match elem {
            Element::Capacitor => "mF".to_string(),
            Element::Inductor => "mH".to_string(),
            Element::Resistor => "mΩ".to_string(),
            Element::Frequency => "mHz".to_string(),
        },
        "micro" | "u" | "μΩ" | "μF" | "μH" => match elem {
            Element::Capacitor => "μF".to_string(),
            Element::Inductor => "μH".to_string(),
            Element::Resistor => "μΩ".to_string(),
            Element::Frequency => "μHz".to_string(),
        },
        "nano" | "n" | "nΩ" | "nF" | "nH" => match elem {
            Element::Capacitor => "nF".to_string(),
            Element::Inductor => "nH".to_string(),
            Element::Resistor => "nΩ".to_string(),
            Element::Frequency => "nHz".to_string(),
        },
        "pico" | "p" | "pΩ" | "pF" | "pH" => match elem {
            Element::Capacitor => "pF".to_string(),
            Element::Inductor => "pH".to_string(),
            Element::Resistor => "pΩ".to_string(),
            Element::Frequency => "pHz".to_string(),
        },
        "femto" | "f" | "fΩ" | "fF" | "fH" => match elem {
            Element::Capacitor => "fF".to_string(),
            Element::Inductor => "fH".to_string(),
            Element::Resistor => "fΩ".to_string(),
            Element::Frequency => "fHz".to_string(),
        },
        _ => match elem {
            Element::Capacitor => "F".to_string(),
            Element::Inductor => "H".to_string(),
            Element::Resistor => "Ω".to_string(),
            Element::Frequency => "Hz".to_string(),
        },
    }
}

pub fn scale(val: f64, scale: &str) -> f64 {
    val * get_mult(scale)
}

pub fn unscale(val: f64, scale: &str) -> f64 {
    val * get_mult(scale).powi(-1)
}

pub fn calc_gamma(z: Complex<f64>, z0: f64) -> Complex<f64> {
    let z0: f64 = z0;

    (z - z0) / (z + z0)
}

pub fn calc_z(gamma: Complex<f64>, z0: f64) -> Complex<f64> {
    z0 * (1.0 + gamma) / (1.0 - gamma)
}

pub fn calc_rc(z: Complex<f64>, freq: f64, fscale: &str, rscale: &str, cscale: &str) -> (f64, f64) {
    let y = 1.0 / z;

    (
        1.0 / scale(y.re, rscale),
        scale(
            y.im / (2.0 * std::f64::consts::PI * unscale(freq, fscale)),
            cscale,
        ),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_unit() {
        let tera = ["tera", "T", "THz", "thz"];
        let giga = ["giga", "G", "GHz", "ghz", "GΩ"];
        let mega = ["mega", "M", "MHz", "mhz", "MΩ"];
        let kilo = ["kilo", "k", "kHz", "khz", "kΩ"];
        let milli = ["milli", "m", "mΩ", "mF", "mH"];
        let micro = ["micro", "u", "μΩ", "μF", "μH"];
        let nano = ["nano", "n", "nΩ", "nF", "nH"];
        let pico = ["pico", "p", "pΩ", "pF", "pH"];
        let femto = ["femto", "f", "fΩ", "fF", "fH"];
        let nada = ["", "google", ".sfwe"];

        for mult in tera.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "TF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "TH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "TΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "THz".to_string());
        }

        for mult in giga.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "GF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "GH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "GΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "GHz".to_string());
        }

        for mult in mega.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "MF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "MH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "MΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "MHz".to_string());
        }

        for mult in kilo.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "kF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "kH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "kΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "kHz".to_string());
        }

        for mult in milli.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "mF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "mH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "mΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "mHz".to_string());
        }

        for mult in micro.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "μF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "μH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "μΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "μHz".to_string());
        }

        for mult in nano.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "nF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "nH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "nΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "nHz".to_string());
        }

        for mult in pico.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "pF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "pH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "pΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "pHz".to_string());
        }

        for mult in femto.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "fF".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "fH".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "fΩ".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "fHz".to_string());
        }

        for mult in nada.iter() {
            assert_eq!(get_unit(mult, Element::Capacitor), "F".to_string());
            assert_eq!(get_unit(mult, Element::Inductor), "H".to_string());
            assert_eq!(get_unit(mult, Element::Resistor), "Ω".to_string());
            assert_eq!(get_unit(mult, Element::Frequency), "Hz".to_string());
        }
    }

    #[test]
    fn test_scale_unscale() {
        let tera = ["tera", "T", "THz", "thz"];
        let giga = ["giga", "G", "GHz", "ghz", "GΩ"];
        let mega = ["mega", "M", "MHz", "mhz", "MΩ"];
        let kilo = ["kilo", "k", "kHz", "khz", "kΩ"];
        let milli = ["milli", "m", "mΩ", "mF", "mH"];
        let micro = ["micro", "u", "μΩ", "μF", "μH"];
        let nano = ["nano", "n", "nΩ", "nF", "nH"];
        let pico = ["pico", "p", "pΩ", "pF", "pH"];
        let femto = ["femto", "f", "fΩ", "fF", "fH"];
        let nada = ["", "google", ".sfwe"];
        let val: f64 = 3.24;

        for mult in tera.iter() {
            assert_eq!(scale(val, mult), val * 1e-12);
            assert_eq!(unscale(val, mult), val * 1e12);
        }

        for mult in giga.iter() {
            assert_eq!(scale(val, mult), val * 1e-9);
            assert_eq!(unscale(val, mult), val * 1e9);
        }

        for mult in mega.iter() {
            assert_eq!(scale(val, mult), val * 1e-6);
            assert_eq!(unscale(val, mult), val * 1e6);
        }

        for mult in kilo.iter() {
            assert_eq!(scale(val, mult), val * 1e-3);
            assert_eq!(unscale(val, mult), val * 1e3);
        }

        for mult in milli.iter() {
            assert_eq!(scale(val, mult), val * 1e3);
            assert_eq!(unscale(val, mult), val * 1e-3);
        }

        for mult in micro.iter() {
            assert_eq!(scale(val, mult), val * 1e6);
            assert_eq!(unscale(val, mult), val * 1e-6);
        }

        for mult in nano.iter() {
            assert_eq!(scale(val, mult), val * 1e9);
            assert_eq!(unscale(val, mult), val * 1e-9);
        }

        for mult in pico.iter() {
            assert_eq!(scale(val, mult), val * 1e12);
            assert_eq!(unscale(val, mult), val * 1e-12);
        }

        for mult in femto.iter() {
            assert_eq!(scale(val, mult), val * 1e15);
            assert_eq!(unscale(val, mult), val * 1e-15);
        }

        for mult in nada.iter() {
            assert_eq!(scale(val, mult), val);
            assert_eq!(unscale(val, mult), val);
        }
    }

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
        let c = 5.198818862788319;

        assert_eq!(calc_rc(z, f, "giga", "", "femto"), (r, c));
    }
}
