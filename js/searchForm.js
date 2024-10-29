
const i18n_ibe = {
    de: {
        tab_package: "Pauschal",
        tab_hot: "Last Minute",
        tab_hotel: "Hotel",
        tab_avia: "Flug",
        tab_visa: "Visum",
        tab_cruise: "Kreuzfahrt",

        destination_placeholder: 'Reiseziel',
        destination_drop_header: 'Top Reiseziel',
        destination_no_result: 'No result',

        departure_placeholder: "Abflughafen",
        departure_drop_header: "Abflughafen",
        departure_airports: "Flughafen|Flughäfen",

        tourist_adults: "Erw.", //TODO:
        tourist_child_none: "keine Kinder",
        tourist_child: "Kinder",
        tourist_drop_header: "Reisende",
        tourist_drop_adult: "Erwachsene",
        tourist_drop_child: "Kinder",
        tourist_drop_child_age_header: "Alter der Kinder",
        tourist_drop_child_header: "Kind",

        departure_date_placeholder: "Anreise",
        departure_date_drop_header: "Früheste Hinreise",
        arrival_date_placeholder: "Rückreise",
        arrival_date_drop_header: "Späteste Rückreise",

        duration_drop_header: "Reisedauer",
        duration_any: "Beliebig", 
        btn_submit: "Suchen",
        week: "Woche|Wochen",
        day: "Tag|Tage",
        month: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],

        days_of_week: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    },
    ru: {
        tab_package: "Туры",
        tab_hot: "Горящие туры",
        tab_hotel: "Отели",
        tab_avia: "Авиа",
        tab_visa: "Визы",
        tab_cruise: "Круизы",

        destination_placeholder: 'Куда',
        destination_drop_header: 'Популярное',
        destination_no_result: 'Не найдено',

        departure_placeholder: "Вылет из",
        departure_drop_header: "Вылет из",
        departure_airports: "Аэропорт|Аэропорта|Аэропортов",

        tourist_adults: "взр.",
        tourist_child_none: "без детей",
        tourist_child: "реб.",
        tourist_drop_header: "Туристы",
        tourist_drop_adult: "Взрослых",
        tourist_drop_child: "Детей",
        tourist_drop_child_age_header: "Возраст детей",
        tourist_drop_child_header: "Ребенок",

        departure_date_placeholder: "Туда",
        departure_date_drop_header: "Дата туда",
        arrival_date_placeholder: "Обратно",
        arrival_date_drop_header: "Дата обратно",

        duration_drop_header: "Длительность",
        duration_any: "Любая",
        btn_submit: "Поиск",
        week: "Неделя|Недели|Недель",
        day: "День|Дня|Дней",
        month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],

        days_of_week: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    }
}

class IBESearch {
    constructor(i18n_ibe, lng, targetPage) {
       

        this.i18n_ibe = i18n_ibe;
        this.currentLng = lng;
        this.t = this.i18n_ibe[this.currentLng];

        this.$root = document.querySelector('.ibe');

        this.targetPage = targetPage;

        this.form = {
            ibe: 'package',
            rid: 0,
            depap: '',
            adult: 2,
            child: '',
            ddate: '',
            rdate: '',
            dur: '',
            taid: 'buchdeinereise',
            colors: 'p-082e39,a-0cb6b1'
        }
        this.init();
    }

    init() {
        this.renderTranslates();
        this.eventListeners();
        this.initControls();
        this.setTourists({adult: this.form.adult, child: 0, ages: ''})
    }

    eventListeners() {
        this.tabListener();
        this.togglerListener();
        this.btnCloseDropDownListener();
        this.btnSubmitListener();
        this.clickOutside();
    }

    clickOutside(e) {
        document.addEventListener('click', (e) => {
            if (!(this.$root == e.target || this.$root.contains(e.target))) {
                this.closeAllDropDown();
            }
        })
        
    }

    tabListener() {
        document.querySelectorAll('.js-ibe-tabs__tab').forEach(tab => {
            tab.addEventListener('click', e => {
                document.querySelectorAll('.js-ibe-tabs__tab').forEach(_ => _.classList.remove('active'))
                tab.classList.add('active');
                const ibe = tab.dataset.ibe;
                this.form.ibe = ibe
                if (ibe === 'hotel') {
                    this.$root.querySelector('.js-ibe-departure').classList.add('hide')
                } else {
                    this.$root.querySelector('.js-ibe-departure').classList.remove('hide')
                }
            })
        })
    }

    /**
     * Закрывает все дропдауны, кроме текущего. Текущий реверсит
     */
    togglerListener() {
        document.querySelectorAll('.js-ibe__toggler').forEach(_ => {
            _.addEventListener('click', e => {
                document.querySelectorAll('.js-ibe__dropdown').forEach(drop => {
                    if (drop !== _.parentElement.querySelector('.js-ibe__dropdown')) {
                        drop.classList.add('hide')
                    } else {
                        // Исключение для направления, тут только открываем
                        if (_.classList.contains('ibe-destination__toggler')) {
                            _.parentElement.querySelector('.js-ibe__dropdown').classList.remove('hide');
                        } else {
                            _.parentElement.querySelector('.js-ibe__dropdown').classList.toggle('hide');
                        }
                    }
                })
                //TODO: включать подложку?
            })
        })
    }

    /**
     * Закрыть дропдаун по крестику
     */
    btnCloseDropDownListener() {
        document.querySelectorAll('.js-ibe__close-dropdown').forEach(_ => {
            _.addEventListener('click', () => {
                _.closest('.js-ibe__control').querySelector('.js-ibe__dropdown').classList.add('hide')
            })
        })
    }

    closeAllDropDown() {
        document.querySelectorAll('.js-ibe__dropdown').forEach(_ => {
            _.classList.add('hide')
        })
    }

    btnSubmitListener() {
        document.querySelector('.js-ibe-btn-submit').addEventListener('click', () => {
            this.formSubmit();
        })
    }

    formSubmit() {
        const searchParam = new URLSearchParams(this.form);
        if (this.form.ibe === 'hotel') {
            searchParam.delete('depap')
        }
        
        console.log('submit', searchParam.toString())
        document.location.href = this.targetPage + '?' + searchParam.toString()
    }

    /**
     * Рендерит фразы UI на нужном языке. В нужном блоке прописать аттрибут i18n со значением ключа перевода
     */
    renderTranslates() {
        this.$root.querySelectorAll("[i18n]").forEach(_ => {
            const key = _.getAttribute('i18n')
            const value = this.t[key] ?? '*';
            _.innerText = value;
        })

        // TODO: i18n-placeholder i18n-value и тп
        this.$root.querySelectorAll("[i18n-placeholder]").forEach(_ => {
            const key = _.getAttribute('i18n-placeholder')
            const value = this.t[key] ?? '*';
            _.setAttribute('placeholder', value);
        })

        // i18ntc - со склонением числительных
        this.$root.querySelectorAll("[i18ntc]").forEach(_ => {
            const key = _.getAttribute('i18ntc')
            const n = +_.innerText.trim();
            console.log(n, key)
            const value = this.tc(n, this.t[key]);
            _.innerText = `${n} ${value}`;
        })
    }

    /**
     * Склонение числительных
     * @param {*} n 
     * @param {*} phrases 
     * @returns 
     */
    tc(n, phrases) {
        n = +n;
        phrases = phrases.split('|');
     
        const cases = {
            'ru': (n) => (n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2,
            'de': (n) => (n === 1 ? 0 : 1),
            'en': (n) => (n === 1 ? 0 : 1),
        }
        return phrases[cases[this.currentLng](n)]
    }

    /**
     * Инициализация контролов формы
     */
    initControls() {
        this.destinationControl = new DestinationControl(this.t);
        this.aiportControl = new AirportControl('.js-ibe-departure-control', this.t);
        this.touristsControl = new TouristsControl('.js-ibe-tourist-control', this.t);
        this.destinationDateControl = new CalendarControl('.js-ibe-deparure-calendar', 'ddate', this.t);
        this.arrivalDateControl = new CalendarControl('.js-ibe-arrival-calendar', 'rdate', this.t);
        this.durationControl = new DurationControl('.js-ibe-duration-control', this.t[this.currentLng]);
    }

    /**
     * Устанавливает значение формы для региона
     * @param {*} param0 
     */
    setRegion({id, name}) {
        const $componentInput = document.querySelector('.ibe-destination__input');
        $componentInput.value = name;
        document.querySelector('.ibe-destination__dropdown').classList.add('hide');

        this.form.rid = id

        console.log(`region: ${id} ${name}`)

    }

    setDuration(value) {
        console.log(`duration: ${value}`)
        this.form.dur = value - 1;
    }

    setAirports(value) {
        console.log(`airports: ${value}`)
        let valueString = '';
        if (!value.length) {

        }
        if (value.length === 1) {
            valueString = value[0].name;
        }
        if (value.length > 1) {
            valueString = this.tc(value.length, this.t.departure_airports)
        }
        document.querySelector('.js-ibe-departure__val').innerHTML = valueString;

        this.form.depap = value.map(_ => _.code).toString()
    }

    setDate(name, d, m, y) {
        if (name === 'ddate') {
            this.setDateDeparture(d, m, y);
        }
        if (name === 'rdate') {
            this.setDateArrival(d, m, y)
        }
    }
    setDateDeparture(d, m, y) {
        console.log('ddate', d, m, y)
        const $dateDeparure = document.querySelector('.js-ibe-departure-date__val');
        $dateDeparure.innerHTML = this.dateToFormat(d, m, y, 'dd.mm.yyyy');

        document.querySelector('.js-ibe-departure-date__dropdown').classList.add('hide');

        this.form.ddate = this.dateToFormat(d, m, y, 'yyyy-mm-dd');

        if (!this.form.rdate || (this.form.rdate && this.form.rdate < this.form.ddate)) {
            const [sd, sm, sy] = this.destinationDateControl.getSelectedDate();
            console.log('sd', sd, sm, sy)
            this.arrivalDateControl.setMinDate(sd, sm, sy);
            // this.arrivalDateControl.setDay(d, m, y);
            // this.arrivalDateControl.renderDays(m, y)
            document.querySelector('.js-ibe-arrival-date__dropdown').classList.remove('hide');
        }
    }

    setDateArrival(d, m, y) {
        console.log('rdate', d, m, y)
        const $dateArrival = document.querySelector('.js-ibe-arrival-date__val');
        $dateArrival.innerHTML = this.dateToFormat(d, m, y, 'dd.mm.yyyy');

        this.form.rdate = this.dateToFormat(d, m, y, 'yyyy-mm-dd');
        //document.querySelector('.js-ibe-arrival-date__dropdown').classList.add('hide');
        console.log('rdate', d, m, y)
    }

    dateToFormat(d, m, y, format) {
        d = new String(d).padStart(2, '0');
        m = new String(m).padStart(2, '0');
        let result = '';
        switch (format) {
            case 'yyyy-mm-dd':
                result = `${y}-${m}-${d}`
                break;

            case 'dd.mm.yyyy':
                result = `${d}.${m}.${y}`
                break;
        
            default:
                result = `${d}.${m}.${y}`
                break;
        }
        return result
    }

    /**
     * Устанавливает значение формы для туристов
     * @param {*} 
     */
    setTourists(data) {
        console.log('torists: ', data)
        let valueString = `${data.adult} ${this.t.tourist_adults} / ${data.child ? data.child + ' ' + this.t.tourist_child : this.t.tourist_child_none}`;
        
        document.querySelector('.js-ibe-tourist__val').innerHTML = valueString;

        this.form.adult = data.adult;
        this.form.child = data.ages.toString();
    }
    
}

const _IBESearch = new IBESearch(i18n_ibe, 'ru', '');

