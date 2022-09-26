/**
 * E-CERTIFICATE
 * @description get file from certificate-generator repository and update index.html view
 */
const tag_id = document.getElementById.bind(document),
      create_tag = document.createElement.bind(document),
      create_tag_text = document.createTextNode.bind(document),
      modalResult = new bootstrap.Modal("#content-result", {keyboard: false, backdrop: 'static'}),
      _Duplicate = new bootstrap.Modal("#content-duplicate"),
      _Error = new bootstrap.Modal("#content-error", {keyboard: false, backdrop: 'static'}),

      /**
       * @description set a tag with multiple attribute at once
       */
      setAttributes = (element, attributes) => {for(var key in attributes) {element.setAttribute(key, attributes[key])}},

      /**
       * @description output of duplicated name
       */
      modalDuplicate = (period, data) => {

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
          setAttributes(_button, {"type": "button","class": "btn btn-outline-primary","data-bs-dismiss": "modal","onclick": `tag_id("username").value = "${value.name}"`})

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
       * @description modal error template
       */
      modalError = (message, heading) => {
        if (typeof heading !== undefined) { tag_id("error-heading").textContent = heading }
        tag_id("error-message").textContent = message
        _Error.show()
      }

/**
 * @description store all data from raw.githubusercontent.com on load
 */
let _Data = {}

document.onreadystatechange = function (e) {

  const name = tag_id("username"),
        period = tag_id("period"),
        find = tag_id("search"),
        search = async (event) => {
          event.preventDefault()
          try {

            /**
             * @description wrap all function inside if-else to avoid unexpected execution
             */
            if (name.value.trim() === "") {

              /**
               * @description return error if input "Nama Peserta" empty
               */
              modalError("Silahkan isi kolom \"Nama Peserta\" terlebih dahulu.", "Mohon maaf anda siapa?")
            } else if (period.value === "default") {

              /**
               * @description return error if input "Periode" unspecific
               */
              modalError("Silahkan isi kolom \"Periode\" terlebih dahulu.", "Sejak kapan mengikuti TECO?")
            } else {
              /**
               * @description filter by name
               */
              var result = _Data[period.value].filter(function (row) {
                var thisname = (row?.name || "").toLowerCase(),
                    username = (name.value || "").toLowerCase()
                return thisname.includes(username)
              })

              /**
               * @description return error if data cannot be found
               */
              if (typeof result === "undefined" || result.length === 0) {
                modalError(`Sepertinya ada masalah terkait nama anda, silahkan hubungi admin melalui E-Mail <tecopro.nepal@gmail.com> untuk informasi lebih lanjut.`, `Halo, ${name.value}!`)
              } else if (result.length > 1) {
                /**
                 * @description return modal with all duplicate name's data if any
                 */
                modalDuplicate(period, result)
              } else {

                /**
                 * @description if data can be found and not duplicate then modify modal element
                 */
                var result = result.shift(), _modalResult_value = [result.name, result.position, result.predicate, result.period,
                    {"href": `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/certificate/${result.file}`}]
                    _modalResult = ["result-name", "result-position", "result-predicate", "result-period", "download"]
                _modalResult.forEach((data, index) => {
                  if (data === "download") {var key = Object.keys(_modalResult_value[index]); tag_id(data).setAttribute(key.shift(), _modalResult_value[index][key])}
                  tag_id(data).textContent = _modalResult_value[index]
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
   * @description get all options child value
   */
  var periode = period.options, _period = []
  for (var item of periode) {
    if (item.value !== "default") {
      _period.push(item.value);
    }
  }

  /**
   * @description execute process based on period outside search fucntion and store in global variable
   */
  _period.forEach(async _periode => {
    var response = await axios.get(`https://raw.githubusercontent.com/tecopro/certificate-generator/${_periode}/data.json`).catch(function (e) {
      new Error(e)
      modalError("Terjadi kesalahan, silahkan coba beberapa saat lagi")
    })
    _Data[`${_periode}`] = response.data
  })

  /**
   * @description set event listener into search button
   */
  find.addEventListener("click", search)
}