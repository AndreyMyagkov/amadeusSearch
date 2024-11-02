/**
 * Класс уповления контролом выбора аэропортов
 */
class AirportControl {
    constructor(selector) {
        this.$root = document.querySelector(selector);
        this.init();
    }
    init() {
        this.render();
        this.addEventListener();
    }
    render() {
        let html = '';
        let countryHtml = '';
        IBEAirports.forEach((country, i) => {
            let groupHTML = '';
            country.groups.forEach(group => {
                let itemsHTML = '';
                group.items.forEach(item => {
                    itemsHTML += this.renderItem(item.name, item.code)
                })
                
                groupHTML += this.renderGroup(group.name, itemsHTML)
            })
            countryHtml += this.renderCountry(country.countryName, groupHTML, i === 0);
        })
        html += countryHtml;
        this.$root.innerHTML = html

    }
    addEventListener() {
        document.querySelectorAll('.js-ibe-airport__ch-item').forEach(_ => _.addEventListener('change', e => this.processChangeItem(e)))
        document.querySelectorAll('.js-ibe-airport__ch-group').forEach(_ => _.addEventListener('change', e => this.processChangeGroup(e)))
    }
    processChangeItem(e) {
        const $root = e.target.closest('.js-ibe-airport-col');
        const $groupCh = $root.querySelector('.js-ibe-airport__ch-group');
        const $itemsCh = $root.querySelectorAll('.js-ibe-airport__ch-item');
        const $itemsChChecked = $root.querySelectorAll('.js-ibe-airport__ch-item:checked');

        if ($itemsChChecked.length < $itemsCh.length) {
            $groupCh.checked = false
        } else {
            $groupCh.checked = true
        }

        this.onChange();
    }
    processChangeGroup(e) {
        const $root = e.target.closest('.js-ibe-airport-col');
        const $groupCh = e.target;
        const $itemsCh = $root.querySelectorAll('.js-ibe-airport__ch-item');

        $itemsCh.forEach(_ => _.checked = !!$groupCh.checked);
        this.onChange();
    }

    getValue() {
        const value = [];
        const $AllitemsCh = this.$root.querySelectorAll('.js-ibe-airport__ch-item:checked');
        $AllitemsCh.forEach(_ => {
            _.checked && value.push({
                name: _.dataset.name,
                code: _.value
            })
        })
        return value
    }
    onChange() {
        const value = this.getValue();
        _IBESearch.setAirports(value);
    }
    renderCountry(countryName, groups, open) {
        return `
        <details class="ibe-details" ${open ? 'open' : ''}>
            <summary class="ibe-summary">${countryName}</summary>
            <div class="row">
                ${groups}
            </div>
        </details>
        `
    }
    renderGroup(groupName, items) {
        return `
        <div class="col-6 col-md-3 col-lg-3 js-ibe-airport-col">
            <div class="ibe-airport__group">
                <label class="ibe-airport__label">
                    <input type="checkbox" value="all" class="ibe-airport__checkbox js-ibe-airport__ch-group"><span>${groupName}</span>
                </label>
            </div>
            <div class="ibe-airport__list">
                ${items}
            </div>
        </div>
        `
    }
    renderItem(name, code) {
        return `
        <div class="ibe-airport__item">
            <label class="ibe-airport__label">
                <input type="checkbox" value="${code}" class="ibe-airport__checkbox js-ibe-airport__ch-item" data-name="${name}"><span>${name}</span>
            </label>
        </div>
        `
    }

}