/**
 * Класс управления контролом выбора взрослых и детей
 * Если выбраны дети - необходимо указать возраст каждого
 * 
 */
class IBEControlTourists {
    constructor(i18n) {
        console.log('IBEControlTourists start');

        this.t = i18n;

        this.$adultCountField = document.querySelector('.js-ibe-adult');
        this.$childCountField = document.querySelector('.js-ibe-child');

        this.init();

    }

    init() {
        this.renderComponent();
        this.eventListener();
        // Запуск контролов кол-ва взрослых, детей
        new Quantity(".js-ibe-adult-quantity");
        new Quantity(".js-ibe-child-quantity");

    }

    //TODO:
    renderComponent() {

    }

    /**
     * Обработчик событий
     */
    eventListener() {
       this.agesEventListener()
        
    }

    /**
     * Обработчик изменений возрастов
     */
    agesEventListener() {
        document.querySelectorAll('.js-ibe-child-age select').forEach(_ => {
            _.addEventListener('change', () => this.onAgesChange())
        })
    }

    onAgesChange() {
        this.onChange()
    }

    onTouristsChange(name) {
        if (name === 'child') {
            this.onChildChange()
        }
        this.onChange()
    }

    /**
     * При изменении кол-ва детей меняем кол-во блоков 
     * возрастов или скрываем их
     */
    onChildChange() {
        const count = this.getChildCount();
        if (count === 0) {
            document.querySelector('.js-ibe-childs-ages').classList.add('hide')
        } else {
            document.querySelector('.js-ibe-childs-ages').classList.remove('hide');

            document.querySelectorAll('.js-ibe-child-age').forEach((_, i) => {
                if ((i + 1) <= count) {
                    _.classList.remove('hide');
                } else {
                    _.classList.add('hide');
                }
            })
        }

    }

    getAdultCount() {
        return +this.$adultCountField.value
    }

    getChildCount() {
        return +this.$childCountField.value
    }

    /**
     * Массив значений возрастов
     */
    getAgesArray() {
        const ages = [];
        document.querySelectorAll('.js-ibe-child-age:not(.hide) select').forEach(_ => {
            ages.push(+_.value)
        })
        return ages
    }

    /**
     * Собирает данные контрола
     */
    getValue() {
        const adult = this.getAdultCount();
        const child = this.getChildCount();
        const ages = this.getAgesArray();

        return {
            adult,
            child,
            ages
        }
    }

    /**
     * Отправка данных в корневой компонент
     */
    onChange() {
        const data = this.getValue();
        _IBESearch.setTourists(data);
    }
}

const _ibeTourists = new IBEControlTourists();
