/**
 * E-CERTIFICATE
 * @description get file from certificate-generator repository and update index.html view
 */
document.addEventListener("DOMContentLoaded", function () {
    const period = document.getElementById("nemos-year");
    const name = document.getElementById("nemos-name");
    const find = document.getElementById("finding-nemo");
    const finder = document.getElementById("nemo-finder");
    const finded = document.getElementById("nemo-result");

    /**
     * @description choices.js for period
     */
    const periodChoices = new Choices(period, {
        classNames: {
            containerInner: period.className,
            input: "form-control",
            inputCloned: "form-control-sm",
            listDropdown: "dropdown-menu",
            itemChoice: "dropdown-item",
            activeState: "show",
            selectedState: "active"
        },
        shouldSort: false,
        searchEnabled: false
    });

    const search = async (evt) => {
        evt.preventDefault();
        let element = this;
        let icon = element.querySelector("#find-nemo-icon");

        try {
            /**
             * @description change search icon to loader
             */
            icon.classList.remove("ti", "ti-search");
            icon.classList.add("spinner-border", "spinner-border-sm");

            /**
             * @description disable name & button section
             */
            name.setAttribute("disabled", "disabled");
            find.setAttribute("disabled", "disabled");

            /**
             * @description hide error message
             */
            document.getElementById("alert").style.display = "none";

            /**
             * @description disable period field
             */
            periodChoices.disable();

            /**
             * @description if name is empty
             */
            if (name.value.trim() === "") {
                throw new Error("Kolom nama tidak boleh kosong.");
            }

            /**
             * @description execute process if all requirement accepted
             */
            let url = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/data.json`;
            let response = await axios.get(url).catch(function (error) {
                throw new Error("Terjadi kesalahan, silahkan coba beberapa saat lagi.");
            });

            /**
             * @description filter by name and get first index
             */
            let result = response.data.filter(function (row) {
                let thisname = (row?.name || "").toLowerCase();
                let nemoname = (name.value || "").toLowerCase();
                return thisname.includes(nemoname);
            }).shift();

            /**
             * @description if data cannot be found
             */
            if (typeof result === "undefined") {
                throw new Error("Maaf, sertifikat yang kamu cari tidak dapat ditemukan.");
            }

            /**
             * @description if data can be found
             */
            document.querySelectorAll("[nemo-result-name]").forEach(function (element) {
                element.textContent = result.name;
            })
            document.querySelector("[nemo-result-position]").textContent = result.position;
            document.querySelector("[nemo-result-predicate]").textContent = result.predicate;
            document.querySelector("[nemo-result-period]").textContent = result.period;
            let download = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/certificate/${result.file}`;
            document.querySelector("[nemo-result-download]").setAttribute("href", download);

            /**
             * @description remove & display multiple sections
             */
            finder.remove();
            finded.removeAttribute("style");
            find.parentNode.parentNode.remove();
            document.getElementById("refresh-the-nemo").removeAttribute("style");
        } catch (error) {
            /**
             * @description show error message
             */
            document.getElementById("alert").removeAttribute("style");
            document.getElementById("error-message").textContent = error.message;

            /**
             * @description change loader icon to search
             */
            icon.classList.remove("spinner-border", "spinner-border-sm");
            icon.classList.add("ti", "ti-search");

            /**
             * @description enable name & button section
             */
            name.removeAttribute("disabled");
            find.removeAttribute("disabled");

            /**
             * @description enable period field and focus to name field
             */
            periodChoices.enable();
            name.focus();
        }
    }

    /**
     * @description find button on click
     */
    find.addEventListener("click", search);

    /**
     * @description hide preloader if dom is ready
     */
    const preloader = document.getElementById("preloader");
    preloader.style.transition = ".5s";
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
}, {
    once: true
});
