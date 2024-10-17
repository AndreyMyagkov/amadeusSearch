const durationTpl = {
    durationsValues: [
        { value: "-1", name: " Beliebig" },
        { value: "7", name: "1 Woche" },
        { value: "14", name: "2 Wochen" },
        { value: "21", name: "3 Wochen" },
        { value: "28", name: "4 Wochen" },
        { value: "1", name: "1 Tag" },
        { value: "2", name: "2 Tage" },
        { value: "3", name: "3 Tage" },
        { value: "4", name: "4 Tage" },
        { value: "5", name: "5 Tage" },
        { value: "6", name: "6 Tage" },
        { value: "7", name: "7 Tage" },
        { value: "8", name: "8 Tage" },
        { value: "9", name: "9 Tage" },
        { value: "10", name: "10 Tage" },
        { value: "11", name: "11 Tage" },
        { value: "12", name: "12 Tage" },
        { value: "13", name: "13 Tage" },
        { value: "14", name: "14 Tage" },
        { value: "15", name: "15 Tage" },
        { value: "16", name: "16 Tage" },
        { value: "17", name: "17 Tage" },
        { value: "18", name: "18 Tage" },
        { value: "19", name: "19 Tage" },
        { value: "20", name: "20 Tage" },
        { value: "21", name: "21 Tage" },
        { value: "g", name: "&gt; 21 Tage" },
    ],
    
    durations: (durationOptions) => `
    <div class="wizardLayer__head cmsMarginTop10">
        Reisedauer
    </div>
    <div class="wizardLayer__group">
        <div class="wizardLayer__select">
            <select name="durationSelect" id="durationSelect">
                ${durationOptions}
            </select>
        </div>
    </div>
    <div class="cmsDatePicker__buttonframe">
        <button class="cmsDatePicker__button" id="btn4" onClick="return updateReturnDate(this);">Übernehmen</button>
        <div class="clear"></div>
    </div>
    `,

    durationOption: (name, val, selectedValue) => `<option value="${val}"${selectedValue == val ? ' selected' : ''}>${name}</option>`,

}

class DurationControl {
    constructor(element, t) {
        this.element = element;
        this.$root = document.querySelector(element);
        this.init();
    }
    init() {
        console.log('DurationControl start');
        this.renderControl();
    }

    renderControl() {
        const duration = '';
        const durationOptions = this.renderDurationOptions(duration)
        this.$root.innerHTML=  durationTpl.durations(durationOptions);
    }

    /**
     * Рендерит список опций для продолдительности
     * @param selectedValue {string} - выбранное значение
     * @return {html}
     */
    renderDurationOptions(selectedValue) {
        let html = '';
        durationTpl.durationsValues.forEach(item => {
            html += durationTpl.durationOption(item.name, item.value, selectedValue)
        })
        return html
    }
}