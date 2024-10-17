/**
 * +0. Мультияз
 * +1. Клик инпут - открыть дроп
 * 2. Грузить список, если нет, показать лоадер TODO:
 * 3. Показать популярные, если пусто или <3
 * 4. По вводу фильтровать список
 * 5. Клик - выбор, отправить в общий класс
 */
/**
 * Класс контрола поиска региона по строке
 * Если строка ввода пустая или короче 3 символов
 * выводит популярные регионы, иначе полный список, отфильтрованный
 * по введенным символам
 */
class DestinationControl {
    constructor(i18n) {
        console.log('DestinationControl start');

        this.t = i18n;
        this.$root = document.querySelector('.ibe-destination__content')
        this.$componentInput = document.querySelector('.ibe-destination__input');

       // this.$closeBtn = document.querySelector('.js-closeDestinationDropDown');

        this.regions = this.flatRegions(window.regions);
        this.topRegions = window.topRegions;


        this.searchStr = '';

        this.tpl = {
            //TODO: translate
            //TODO: loader
            component: (t) => {
                return `
                <ul class="ibe-destination__list"></ul>
                <div class="ibe-destination__noresult hide">${t.destination_no_result}</div>`
            },
            item: (rid, name) => {
                return `
                <li data-value="${rid}">${name}</li>`
            },
        }
        

        this.init();
        
    }

    init() {
        this.renderComponent();
        this.eventListener();
        
    }

    /** 
     * Рендерит корень компонента
     */
    renderComponent() {
        this.$root.innerHTML = this.tpl.component(this.t)
    }


    /**
     * Обработчик ивентов
     */
    eventListener() {
        //keyup change
        
        // Инпут в форме
        this.$componentInput.addEventListener('click', e => this.inputProcess(e.target.value))
        this.$componentInput.addEventListener('keyup', e => this.inputProcess(e.target.value))
        this.$componentInput.addEventListener('change', e => this.inputProcess(e.target.value))

        // Выбор региона
        document.addEventListener('click', e => {
            const regionItem = e.target.closest('.ibe-destination__list li');
            if (regionItem) {
                this.onChange(regionItem.dataset.value, regionItem.innerText)
            }
            
        })
    }

    /**
     * Действия по изменении региона
     * @param {*} id 
     * @param {*} name 
     */
    onChange(id, name) {
        _IBESearch.setRegion({id, name});
    }


    inputProcess(value) {
        value = value.trim();

        if (value !== '' && value === this.searchStr) {
            return
        }
        this.searchStr = value;
        this.renderRegionsDropBox(value);
    }

    /**
     * Возращает одномерный массив объектов из родительских и дочерних регионов
     * @param regions {array} - входной массив данных
     * @return {array}
     */
    flatRegions(regions = []) {
        const ret = [];
        regions.forEach(item => {
            ret.push(
                {
                    id: item.id,
                    name: item.name
                }
            );
            ret.push(...item.regions);
        })
        return ret;
    }

    /**
     * Возращает отрендеренный дропбокс регионов в зависимости от наличия поисковой строки.
     * Если она не указана - возращает топовые регионы, иначе поиск по всем регионам по подстроке
     * @param searchInput {string} - поисковая строка
     * @return {html}
     */
    renderRegionsDropBox(searchInput = '') {
        const $results = document.querySelector('.ibe-destination__list');
        if (searchInput.length < 3) {
            $results.innerHTML = this.renderRegionsTpl(this.topRegions);
        } else {
            const regionsFiltered = this.regions.filter(item => {
                return item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
            })

            $results.innerHTML = this.renderRegionsTpl(regionsFiltered, searchInput);
        }
    }

    /**
     * Рендерит дропдаун регионов
     * Если есть поисковая строка, выделяет ее жирным
     * @param data {array} - входной массив регионов
     * @param searchInput {string} - поисковая строка
     * @return {html}
     */

    renderRegionsTpl(data, searchInput = '') {
        const items = (data) => {
            let ret = '';
            data.forEach(item => {
                let item_name = item.name;
                if (searchInput) {
                    const re = new RegExp("(" + searchInput + ")", "gi");
                    //item.name = item.name.replace(re, '<b>$1</b>');
                    item_name = item.name.replace(re, '<b>$1</b>');
                }
                ret += this.tpl.item(item.id, item_name);
            })
            return ret
        }
        return items(data)
    }
}

