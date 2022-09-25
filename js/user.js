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
      setAttributes = (el, attrs) => {for(var key in attrs) {el.setAttribute(key, attrs[key])}},

      /**
       * @description output of duplicated name
       */
      modalDuplicate = (period, data) => {

        /**
         * @description create and clear tbody in duplicate section
         */
        const tbody = tag_id("content-tbody-duplicate")
        tbody.textContent = ""

        /**
         * @description convert duplicate name's object into table
         */
        data.forEach(value => {
          const _tr = create_tag("tr"), _th = create_tag("th"), _td = create_tag("td"), _button = create_tag("button")
                _th_text = create_tag_text(`${value.name} [${value.position}]`),
                _button_text = create_tag_text("Pilih")
          setAttributes(_button, {"type": "button","class": "btn btn-outline-primary","data-bs-dismiss": "modal","onclick": `tag_id("username").value = "${value.name}"`})
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
      modalError = (msg, h) => {
        if (typeof h !== undefined) { tag_id("error-heading").textContent = h }
        tag_id("error-message").textContent = msg
        _Error.show()
      }

document.onreadystatechange = function (e) {
  const name = tag_id("username"),
        period = tag_id("period"),
        find = tag_id("search"),
        search = async (evt) => {
          evt.preventDefault()
          try {

            /**
             * @description wrap all function inside if-else to avoid unexpected execution
             */
            if (name.value.trim() === "") {

              /**
               * @description return error if input "Nama Peserta" empty
               */
              modalError("Silahkan isi kolom \"Nama Peserta\" terlebih dahulu.", "Mohon maaf dengan siapa?")
            } else {

              /**
               * @description execute process if all requirement accepted
               */
              var url = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/data.json`,
                  response = await axios.get(url).catch(function (e) {
                    new Error("Kolom nama tidak boleh kosong.")
                    modalError("Terjadi kesalahan, silahkan coba beberapa saat lagi. Error: ")
                  })

              /**
               * @description filter by name
               */
              var result = response.data.filter(function (row) {
                var thisname = (row?.name || "").toLowerCase(),
                    nemoname = (name.value || "").toLowerCase()
                return thisname.includes(nemoname)
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
                 * @description if data can be found and not duplicate
                 */
                result = result.shift()
                tag_id("result-name").textContent = result.name
                tag_id("result-position").textContent = result.position
                tag_id("result-predicate").textContent = result.predicate
                tag_id("result-period").textContent = result.period
                tag_id("download").setAttribute("href", `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/certificate/${result.file}`)

                /**
                 * @description return modal showing data in database
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
   * @description set event listener into search button
   */
  find.addEventListener("click", search)
}