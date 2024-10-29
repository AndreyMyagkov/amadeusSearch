class DurationControl {
    constructor(element, t) {
        this.element = element;
        this.$root = document.querySelector(element);
        this.$select = document.querySelector('.js-ibe-duration-select');
        this.value = "";
        this.tpl = {
            durationOption: (name, val, selectedValue) => `<option value="${val}"${selectedValue == val ? ' selected' : ''}>${name}</option>`,

        }
        this.init();
    }
    init() {
        this.eventListener();
    }

    eventListener() {
        this.$select.addEventListener('change', e => {
            this.setValue(e.target.value);
        })
    }
    setValue(value) {
        this.value = value;
        this.$select.value = value;
        this.onChange(value);
    }
    onChange() {
        _IBESearch.setDuration(this.value);
    }

    /**
     * Рендерит список опций для продолдительности
     * @param selectedValue {string} - выбранное значение
     * @return {html}
     */
    renderDurationOptions(selectedValue) {
        let html = '';
        this.tpl.durationsValues.forEach(item => {
            html += durationTpl.durationOption(item.name, item.value, selectedValue)
        })
        return html
    }
}