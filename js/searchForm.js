
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
        destination_no_result: 'No result', //

        departure_placeholder: "Abflughafen",
        departure_drop_header: "Abflughafen",
        departure_airports: "Flughäfen", //TODO: "Flughafen|Flughäfen"

        tourist_adults: "Erw.", //TODO:
        tourist_child_none: "keine Kinder",
        tourist_child: "Kinder",

        departure_date_placeholder: "Anreise",
        departure_date_drop_header: "Früheste Hinreise",
        arrival_date_placeholder: "Rückreise",
        arrival_date_drop_header: "Späteste Rückreise",

        btn_submit: "Suchen",
    }
}
//TODO: Класс перевода i18n i18n-placeholder и тп. Даем root и поехали
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
        this.durationControl = new DurationControl('.js-ibe-duration-control', this.t);
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
        this.form.dur = value;
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
            valueString = `${value.length} ${this.t.departure_airports}`
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
        $dateDeparure.innerHTML = `${d}.${m}.${y}`;
        document.querySelector('.js-ibe-departure-date__dropdown').classList.add('hide');

        this.form.ddate = `${y}.${m}.${d}`;
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
        $dateArrival.innerHTML = `${d}.${m}.${y}`;
        this.form.rdate = `${y}.${m}.${d}`;
        //document.querySelector('.js-ibe-arrival-date__dropdown').classList.add('hide');
        console.log('rdate', d, m, y)
    }

    /**
     * Устанавливает значение формы для туристов
     * @param {*} 
     */
    setTourists(data) {
        console.log('torists: ', data)
        let valueString = `${data.adult} ${this.t.tourist_adults} / ${data.child ? data.child + this.t.tourist_child : this.t.tourist_child_none}`;
        
        document.querySelector('.js-ibe-tourist__val').innerHTML = valueString;

        this.form.adult = data.adult;
        this.form.child = data.ages.toString();
    }
    
}

const _IBESearch = new IBESearch(i18n_ibe, 'de', '');

