const airports = [
    {
        countryName: 'Germany',
        groups: [
            {
                name: "Запад",
                value: "_",
                items: [
                    {
                        name: "Berlin",
                        value: "bre"
                    },
                    {
                        name: "Dresden",
                        value: "dre"
                    }
                ]
            }
        ]
    }
];

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
        airports.forEach(country => {
            const countryHtml = '';

        })

    }
    addEventListener() {

    }
}