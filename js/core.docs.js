/**
 * E-CERTIFICATE
 * @author Sofa Machabba Haeta
 * @copyright Technology Community
 * @description get file from certificate-generator repository and update index.html view
 */

/**
 * Table Of Content
 * 1. Global Variable
 *    A. Tag
 *    B. Input
 *    C. Modal
 *    D. Utility
 * 2. Document Execution
 *    A. Period Parser
 *    B. API & Database
 *    C. Event Listener
 */

/**
 * 1. Global Variable --- Start
 */

/**
 * A. Tag --- Start
 */
const tag = {
  id: document.getElementById.bind(document),
  create: document.createElement.bind(document),
  content: document.createTextNode.bind(document),
};
/**
 * A. Tag --- End
 */

// @ <----- BREAK -----> @ //

/**
 * B. Input --- Start
 */
const input = {
  user: tag.id("username"),
  period: tag.id("period"),
  search: tag.id("search"),
};
/**
 * B. Input --- End
 */

// @ <----- BREAK -----> @ //

/**
 * C. Modal --- Start
 */
const modal = {
  /**
   * @description create modal and store inside variable
   */
  result: new bootstrap.Modal("#content-result", { keyboard: false, backdrop: "static" }),
  error: new bootstrap.Modal("#content-error", { keyboard: false, backdrop: "static" }),
  duplicate: new bootstrap.Modal("#content-duplicate"),

  /**
   * @function modal.Error
   * @description show error message using bootstrap modal
   * @param message {string} error message
   * @param heading {string} title/heading message
   * @returns {void} show modal error
   */
  Error(message, heading) {
    if (typeof heading !== undefined) {
      tag.id("error-heading").textContent = heading;
    }
    tag.id("error-message").textContent = message;
    this.error.show();
  },

  /**
   * @function modal.Duplicate
   * @description modify table and show duplicated data using bootstrap modal
   * @param data {Object} array of duplicated data from result
   * @returns {void} show modal duplicate
   */
  Duplicate(data) {
    const tbody = tag.id("content-tbody-duplicate");
    tbody.textContent = "";
    data.forEach((value) => {
      const { code, name, position } = value,
        tr = tag.create("tr"),
        th = tag.create("th"),
        td = tag.create("td"),
        button = tag.create("button"),
        th_c = tag.content(`${name} [${position}]`),
        button_c = tag.content("Pilih");
      var button_attr = { type: "button", class: "btn btn-outline-primary", "data-bs-dismiss": "modal", onclick: `tag.id("username").value = "${name} @ ${code}"` };
      utility.setAttr(button, button_attr);
      button.appendChild(button_c);
      th.appendChild(th_c);
      td.appendChild(button);
      tr.insertBefore(th, null);
      tr.insertBefore(td, null);
      tbody.insertBefore(tr, null);
    });
    this.duplicate.show();
  },
};
/**
 * C. Modal --- End
 */

// @ <----- BREAK -----> @ //

/**
 * D. Utility --- Start
 */
const utility = {
  /**
   * @function utility.setAttr
   * @description create multiple element attribute
   * @param element {object} HTML element
   * @param attributes {object} array of attributes
   * @returns {void} void
   */
  setAttr(element, attributes) {
    for (var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  },

  /**
   * @function utility.checkInput
   * @param user {string} value from user input
   * @param period {string} year from available period
   * @returns {boolean} true or false
   */
  checkInput(user, period) {
    if (user.trim() === "") {
      return modal.Error('Silahkan isi kolom "Nama Peserta" terlebih dahulu.', "Mohon maaf dengan siapa?");
    } else if (period === "default") {
      return modal.Error('Silahkan isi kolom "Periode" terlebih dahulu.', "Sejak kapan mengikuti TECO?");
    } else {
      return true;
    }
  },

  /**
   * @function utility.checkResult
   * @param result {object} list of filtered people
   * @param username {string} a person name
   * @returns {boolean} true or false
   */
  checkResult(result, username) {
    if (typeof result === "undefined" || result.length === 0) {
      return modal.Error(`Sepertinya ada masalah terkait nama anda, silahkan hubungi admin melalui E-Mail <tecopro.nepal@gmail.com> untuk informasi lebih lanjut.`, `Halo, ${input.user.value.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase())}!`);
    } else if (result.length > 1 && username === undefined) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * @async
   * @function utility.search
   * @param event {any} an event listener
   * @returns {any} show error or modal based on specific condition
   */
  search(event) {
    event.preventDefault();
    try {
      if (utility.checkInput(input.user.value, input.period.value)) {
        var username = input.user.value.split(" @ "),
          result = JSON.parse(sessionStorage[`${input.period.value}`]).filter((array) => {
            const people = (array?.name || "").toLowerCase(),
              person = (username[0] || "").toLowerCase();
            return people.includes(person);
          });
        if (utility.checkResult(result, username[1])) {
          if (typeof username[1] === "string") {
            result = result.find(({ code }) => code === username[1]);
            if (result === undefined) {
              result = false;
              modal.Error(`Kepemilikan kode unik yang anda masukkan tidak sesuai dengan hasil pencarian, anda dapat mencoba untuk mengganti periode atau silahkan hubungi admin melalui E-Mail <tecopro.nepal@gmail.com> untuk informasi lebih lanjut.`, `Halo, ${username[0]} [${username[1]}]!`);
            }
          } else {
            result = result.shift();
          }
          if (result) {
            const { file, name, period, position, predicate } = result;
            var resultValue = [name, position, predicate, period, { href: `https://raw.githubusercontent.com/tecopro/certificate-generator/${input.period.value}/certificate/${file}` }],
              resultAttr = ["result-name", "result-position", "result-predicate", "result-period", "download"];
            resultAttr.forEach((data, index) => {
              if (data === "download") {
                var key = Object.keys(resultValue[index]).shift();
                tag.id(data).setAttribute(key, resultValue[index][key]);
              } else {
                tag.id(data).textContent = resultValue[index];
              }
            });
            modal.result.show();
          }
        } else {
          if (result.length !== 0) {
            modal.Duplicate(result);
          }
        }
      }
    } catch (error) {
      new Error(error);
      modal.Error(error);
    }
  },
};
/**
 * D. Utility --- End
 */

/**
 * 1. Global Variable --- End
 */

// @ <----- BREAK -----> @ //

/**
 * 2. Document Execution --- Start
 */
document.onreadystatechange = function () {
  /**
   * A. Period Parser --- Start
   */
  var periodLists = new Array();
  for (const item of input.period.options) {
    if (item.value !== "default") {
      periodLists.push(item.value);
    }
  }
  /**
   * A. Period Parser --- End
   */

  // @ <----- BREAK -----> @ //

  /**
   * B. API & Database --- Start
   */
  periodLists.forEach(async (year) => {
    var response = await axios.get(`https://raw.githubusercontent.com/tecopro/certificate-generator/${year}/data.json`).catch(function (error) {
      new Error(error);
      modal.Error("Terjadi kesalahan, silahkan coba beberapa saat lagi");
    });
    sessionStorage.setItem(`${year}`, JSON.stringify(response.data));
  });
  /**
   * B. API & Database --- End
   */

  // @ <----- BREAK -----> @ //

  /**
   * C. Event Listener --- Start
   */
  input.search.addEventListener("click", utility.search);
  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      input.search.click();
    }
  });
  /**
   * C. Event Listener --- End
   */
};
/**
 * 2. Document Execution --- End
 */
