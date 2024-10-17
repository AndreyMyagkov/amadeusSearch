/**
 * Класс отрисовки календаря: слайдер месяцев, календарь
 */
class CalendarControl {
    constructor(element, name, i18n) {
        console.log('IBEControlCalendar start', name);

        this.$root = document.querySelector(element);
        this.t = i18n;
        this.name = name;

        this.init();
    }
    
    init() {

    }
}