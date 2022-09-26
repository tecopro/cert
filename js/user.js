/**
 * E-CERTIFICATE
 * @description get file from certificate-generator repository and update index.html view
 */

/**
 * @description declare all variables
 */
const tag_id = document.getElementById.bind(document),
      create_tag = document.createElement.bind(document),
      create_tag_text = document.createTextNode.bind(document),
      modalResult = new bootstrap.Modal("#content-result", {keyboard: false, backdrop: 'static'}),
      _Duplicate = new bootstrap.Modal("#content-duplicate"),
      _Error = new bootstrap.Modal("#content-error", {keyboard: false, backdrop: 'static'}),
      _username_ = tag_id("username"),
      _period_ = tag_id("period"),
      _search_ = tag_id("search")

let _Data = {}

/**
 * @description declare all function
 */

/**
 * @function setAttributes
 * @param element (string)
 * @param attributes (object)
 * @description set a tag with multiple attribute at once
 */
const setAttributes = (element, attributes) => {
  for(var key in attributes) {
    element.setAttribute(key, attributes[key])
  }
},

/**
 * @function modalError
 * @param message (string)
 * @param heading (string)
 * @description modal error template
 */
modalError = (message, heading) => {
  if (typeof heading !== undefined) { tag_id("error-heading").textContent = heading }
  tag_id("error-message").textContent = message
  _Error.show()
},

/**
 * @function modalDuplicate
 * @param data (object)
 * @description output of duplicated name
 */
modalDuplicate = (data) => {

  /**
   * @description get and clear tbody in duplicate section
   */
  const tbody = tag_id("content-tbody-duplicate")
  tbody.textContent = ""

  /**
   * @description convert duplicate name's object into table
   */
  data.forEach(value => {
    /**
     * @description creating new element and it is content
     */
    const _tr = create_tag("tr"), _th = create_tag("th"), _td = create_tag("td"), _button = create_tag("button"),
          _th_text = create_tag_text(`${value.name} [${value.position}]`), _button_text = create_tag_text("Pilih")

    /**
     * @description set attribute into button element
     */
    setAttributes(_button, {"type": "button","class": "btn btn-outline-primary","data-bs-dismiss": "modal","onclick": `tag_id("username").value = "${value.name} @ ${value.code}"`})

    /**
     * @description insert element or child into specific parent
     */
    _button.appendChild(_button_text)
    _th.appendChild(_th_text)
    _td.appendChild(_button)
    _tr.insertBefore(_th, null)
    _tr.insertBefore(_td, null)
    tbody.insertBefore(_tr, null)
  })

  /**
   * @description show all generatated table in modal
   */
  _Duplicate.show()
},

/**
 * @function search
 * @param event (object)
 * @description asynchronus core function to searching username data inside database
 */
search = async (event) => {
  event.preventDefault()
  try {

    /**
     * @description wrap all function inside if-else to avoid unexpected execution
     */
    if (_username_.value.trim() === "") {

      /**
       * @description return error if input "Nama Peserta" empty
       */
      modalError("Silahkan isi kolom \"Nama Peserta\" terlebih dahulu.", "Mohon maaf anda siapa?")
    } else if (_period_.value === "default") {

      /**
       * @description return error if input "Periode" unspecific
       */
      modalError("Silahkan isi kolom \"Periode\" terlebih dahulu.", "Sejak kapan mengikuti TECO?")
    } else {
      /**
       * @description filter by name
       */
      var username_duplicate_trim = _username_.value.split(" @ "), result = _Data[_period_.value].filter(function (row) {
        var thisname = (row?.name || "").toLowerCase(),
            username = (username_duplicate_trim[0] || "").toLowerCase()
        return thisname.includes(username)
      })

      if (typeof result === "undefined" || result.length === 0) {
        /**
         * @description return error if data cannot be found
         */
        modalError(`Sepertinya ada masalah terkait nama anda, silahkan hubungi admin melalui E-Mail <tecopro.nepal@gmail.com> untuk informasi lebih lanjut.`, `Halo, ${_username_.value}!`)
      } else if (result.length > 1 && username_duplicate_trim[1] === undefined) {
        /**
         * @description return modal with all duplicate name's data if any
         */
        modalDuplicate(result)
      } else {

        /**
         * @description filter result data based on code value if any
         */
        if (typeof username_duplicate_trim[1] === "string") {
          result.filter((e,i) => {
            if (e.code === username_duplicate_trim[1]) {
              result = e
            }
          })
        } else {
          result = result.shift()
        }

        /**
         * @description if data can be found and not duplicate then modify modal element
         */
        var _modalResult_value = [result.name, result.position, result.predicate, result.period, {"href": `https://raw.githubusercontent.com/tecopro/certificate-generator/${_period_.value}/certificate/${result.file}`}],
          _modalResult = ["result-name", "result-position", "result-predicate", "result-period", "download"]
        _modalResult.forEach((data, index) => {
          if (data === "download") {
            var key = Object.keys(_modalResult_value[index]).shift()
            tag_id(data).setAttribute(key, _modalResult_value[index][key])
          } else {
            tag_id(data).textContent = _modalResult_value[index]
          }
        })

        /**
         * @description return modal showing data based on result
         */
        modalResult.show()
      }
    }
  } catch (e) {

    /**
     * @description catch all unexpected error
     */
    new Error(e)
    modalError(e)
  }
}

/**
 * @description execute core process
 */
document.onreadystatechange = function () {

  /**
   * @description get all options child value
   */
  var periode = _period_.options, _period = []
  for (var item of periode) {
    if (item.value !== "default") {
      _period.push(item.value);
    }
  }

  /**
    * @description execute process based on period outside search fucntion and store in global variable
    */
  _period.forEach(async _periode => {
    var response = await axios.get(`https://raw.githubusercontent.com/tecopro/certificate-generator/${_periode}/data.json`).catch(function (e) { new Error(e)
      modalError("Terjadi kesalahan, silahkan coba beberapa saat lagi")
    })
    _Data[`${_periode}`] = response.data
  })

  /**
    * @description set event listener into search button
    */
  _search_.addEventListener("click", search)
}