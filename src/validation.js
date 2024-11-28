// document.getElementById('imp_unit').addEventListener("change", function() { update_imp(); });
// document.getElementById('f_unit').addEventListener("change", function() { change_unit(); });
// document.getElementById('c_unit').addEventListener("change", function() { change_unit(); });
// document.getElementById('l_unit').addEventListener("change", function() { change_unit(); });
// document.getElementById('src_ld_unit').addEventListener("change", function() { change_imp(); });

function validate_posnum(e, field) {
  e.preventDefault();

  const numField = document.getElementById(field);
  let valid = true;

  if (!/^[0-9]+(\.[0-9]*)?$/.test(numField.value)) {
    numField.classList.add("is-invalid");
    numField.classList.remove("is-valid");
  } else {
    numField.classList.add("is-valid");
    numField.classList.remove("is-invalid");
  }
  return valid;
}

function validate_num(e, field) {
  e.preventDefault();

  const numField = document.getElementById(field);
  let valid = true;

  if (!/^-?[0-9]+(\.[0-9]*)?$/.test(numField.value)) {
    numField.classList.add("is-invalid");
    numField.classList.remove("is-valid");
  } else {
    numField.classList.add("is-valid");
    numField.classList.remove("is-invalid");
  }
  return valid;
}

function validate_decimal(e, field) {
  e.preventDefault();

  const numField = document.getElementById(field);
  let valid = true;

  if (!/^0(\.[0-9]*)?$/.test(numField.value)) {
    numField.classList.add("is-invalid");
    numField.classList.remove("is-valid");
  } else {
    numField.classList.add("is-valid");
    numField.classList.remove("is-invalid");
  }
  return valid;
}

// const freq = document.getElementById("freq");
// freq.addEventListener('focusout', (e) => validate_posnum(e, "freq"));

// const zo = document.getElementById("zo");
// zo.addEventListener('focusout', (e) => validate_posnum(e, "zo"));

// const q = document.getElementById("q");
// q.addEventListener('focusout', (e) => validate_posnum(e, "q"));

// const rs = document.getElementById("rs");
// rs.addEventListener('focusout', (e) => validate_num(e, "rs"));

// const xs = document.getElementById("xs");
// xs.addEventListener('focusout', (e) => validate_num(e, "xs"));

// const rl = document.getElementById("rl");
// rl.addEventListener('focusout', (e) => validate_num(e, "rl"));

// const xl = document.getElementById("xl");
// xl.addEventListener('focusout', (e) => validate_num(e, "xl"));
