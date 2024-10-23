
const i18n_ibe = {
    de: {
        destination_placeholder: 'Reiseziel',
        destination_drop_header: 'Top Reiseziel',
        destination_no_result: 'No result', //

        departure_placeholder: "Abflughafen",
        departure_drop_header: "Abflughafen",

        departure_date_placeholder: "Anreise",
        departure_date_drop_header: "Früheste Hinreise",
        arrival_date_placeholder: "Rückreise",
        arrival_date_drop_header: "Späteste Rückreise",
    }
}
//TODO: Класс перевода i18n i18n-placeholder и тп. Даем root и поехали
class IBESearch {
    constructor(i18n_ibe, lng) {
       

        this.i18n_ibe = i18n_ibe;
        this.currentLng = lng;
        this.t = this.i18n_ibe[this.currentLng];

        this.$root = document.querySelector('.ibe');
        this.init();
    }

    init() {
        this.renderTranslates();
        this.eventListeners();
        this.initControls();
    }

    eventListeners() {
        this.togglerListener();
        this.btnCloseDropDownListener();
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
            // const key = _.getAttribute('i18n-placeholder')
            // const value = this.t[key] ?? '*';
            // _.innerText = value;
        })

    }

    /**
     * Инициализация контролов формы
     */
    initControls() {
        this.destinationControl = new DestinationControl(this.t);
        this.aiportControl = new AirportControl('.js-ibe-departure-control', this.t);
        this.destinationDate = new CalendarControl('.js-ibe-deparure-calendar', 'ddate', this.t);
        this.arrivalDate = new CalendarControl('.js-ibe-arrival-calendar', 'rdate', this.t);
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

        console.log(`region: ${id} ${name}`)

    }

    setAirports(value) {
        console.log(`airports: ${value}`)
    }

    setDateDeparture(d, m, y) {
        const $dateDeparure = document.querySelector('.js-ibe-departure-date__val');
        $dateDeparure.innerHTML = `${d}.${m}.${y}`;
        document.querySelector('.js-ibe-departure-date__dropdown').classList.add('hide');
        console.log('ddate', d, m, y)
        console.log($dateDeparure)
    }
    
    /**
     * Устанавливает значение формы для туристов
     * @param {*} 
     */
    setTourists(data) {
        console.log('torists: ', data)

        //TODO: // setPassengers
    }
    
}

const _IBESearch = new IBESearch(i18n_ibe, 'de');

