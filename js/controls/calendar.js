/**
 * Класс отрисовки календаря: слайдер месяцев, календарь
 * 1. рендер контрола месяца со стартового месяца и года, если не дали, то текущие
 * 
 */
const searchWizardDateTpl = {
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    
    monthOptions: (monthName, month, year) => `<option value="${month}${year}">${monthName} ${year}</option>
    `,
    monthCurrent: (monthName, month, year) => `<div class="cmsDatePicker-months__current" data-month="${month}" data-year="${year}">${monthName} ${year}</div>`,

    day: (day, month, year, passed) => `<div class="cmsDatePicker__day ${passed ? 'passed' : ''}"  data-day="${`${+day + 100}`.substring(1)}" data-month="${`${+month + 100}`.substring(1)}" data-year="${year}">
        <span>${day}</span></div>
    `,


    outer: (monthOptions, monthCurrent, days, type) => `
    <!-- calendarFrame -->
    <div class="cmsDatePicker__calframe">
        <!-- monthSelect -->
		<div class="cmsDatePicker-months">
			<button class="cmsDatePicker-months__prev js-ibe-calendar__month-prev" type="button"></button>
			${monthCurrent}
			<button class="cmsDatePicker-months__next js-ibe-calendar__month-next" type="button"></button>
		</div>
        <div class="cmsDatePicker__monthSelect" style='display:none'>
            <select class="monthSelect" id="${type == 1 ? 'depDropdown' : 'retDropdown'}" onchange="get${type == 1 ? 'Departure' : 'Return'}Datepicker(this, true);">
                ${monthOptions}
            </select>
        </div>
        <!-- Month Head -->
        <div class="cmsDatePicker__monthhead">
            <div class="cmsDatePicker__monthday">Mo</div>
            <div class="cmsDatePicker__monthday">Di</div>
            <div class="cmsDatePicker__monthday">Mi</div>
            <div class="cmsDatePicker__monthday">Do</div>
            <div class="cmsDatePicker__monthday">Fr</div>
            <div class="cmsDatePicker__monthday">Sa</div>
            <div class="cmsDatePicker__monthday">So</div>
        </div>
        <!-- Month Days -->
        <div class="cmsDatePicker__month">
            <div class="cmsDatePicker__dayFrame">
                ${days}
                <div class="clear"></div>
            </div>
            <!-- Month Days -->
        </div>
  
    </div>
    `


}
class CalendarControl {
    constructor(selector, name, i18n) {
        console.log('IBEControlCalendar start', name);

        this.selector = selector;
        this.name = name;
        this.$root = document.querySelector(selector);
        this.t = i18n;

        this.month = null;
        this.year = null;
        this.day = null;

        this.init();
    }
    
    init() {
        this.renderDatepicker(1);
        this.eventsListener();
    }

    eventsListener() {
        document.addEventListener('click',  e => {
            if (!e.target.closest(this.selector)) {
                return
            }
            if (e.target.closest('.js-ibe-calendar__month-prev')) {
                this.datepickerMonthChange(e.target, -1, 1)
            }
            if (e.target.closest('.js-ibe-calendar__month-next')) {
                this.datepickerMonthChange(e.target, 1, 1)
            }

            if (e.target.closest('.cmsDatePicker__day')) {
                e.stopPropagation();
                const $day = e.target.parentNode;
                if (!$day.classList.contains('passed')) {
                    console.log('день')
                    console.log($day.dataset.day, $day.dataset.month, $day.dataset.year)
                }
                //this.setDate()
            }
        })
        // this.$root.querySelector('.js-ibe-calendar__month-prev').addEventListener('click', (e) => {
        //     this.datepickerMonthChange(e.target, -1, 1)
        // })

        // this.$root.querySelector('.js-ibe-calendar__month-next').addEventListener('click', (e) => {
        //     this.datepickerMonthChange(e.target, 1, 1)
        // })
    }
    /**
     * Изменяет текущий месяц датапикера
     * @param {node} el - элемент
     * @param {number} diff - в какую сторону изменить месяц (1/-1)
     * @param {number} type - тип календаря (отправление, прибытие)
     * @returns 
     */
    datepickerMonthChange(el, diff, type) {
        const currentEl = el.parentNode.querySelector('.cmsDatePicker-months__current');
        const currentMonth = +currentEl.getAttribute('data-month');
        const currentYear = +currentEl.getAttribute('data-year');

        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getUTCMonth() + 1;
        //console.log(diff, currentYear, nowYear, currentMonth, nowMonth)

        // минимальный месяц в текущем году
        if (diff === -1 && currentYear === nowYear && currentMonth <= nowMonth) {
            return
        }
        // Максимальный месяц через год
        if (diff === 1 && currentYear === nowYear + 1 && currentMonth >= nowMonth - 1) {
            return
        }
        

        const resultDate = new Date(currentYear, currentMonth - 1 + diff);
        const resultMonth = resultDate.getMonth();
        const resultYear = resultDate.getFullYear();

        console.log(currentMonth, currentMonth - 1 + diff, resultMonth, resultYear)
        //console.log(type, resultMonth, resultYear);
        // if (type == 1) {
        //     $('#depDropdown').val(`${resultMonth + 1}${resultYear}`);
        //     $('#depDropdown').change();
        // }
        // if (type == 2) {
        //     $('#retDropdown').val(`${resultMonth + 1}${resultYear}`);
        //     $('#retDropdown').change();
        // }

        //$('#departureDatepicker').html(renderDatepicker(1, month, -1));
        this.renderDatepicker(1, resultMonth+1, resultYear, -1)

    }

    /**
     * Рендерит html датапикера
     * @param type {number} - тип: с - по
     * @param month {number} - месяц, год в формате 72021
     * @param duration {number} - выбранная продолжительность, либо -1, если не нужно выводить
     * @return html
     */
    renderDatepicker(type, month, year) {
        if (!month || !year) {
            month = new Date().getMonth() + 1;
            year = new Date().getFullYear();
        }
        console.log('renderDatepicker', month, year);
        this.month = month;
        this.year = year;

        const monthOptions = this.renderMonthOptions(month, year);

        const monthCurrent = searchWizardDateTpl.monthCurrent(searchWizardDateTpl.monthNames[+month - 1], month, year);

        const days = this.renderDays(month, year);

 
        
        this.$root.innerHTML = searchWizardDateTpl.outer(monthOptions, monthCurrent, days, type)
    }

    /**
     * Рендерит список месяцев для варианта с select
     * //@param month {number} - стартовый месяц
     * @param year {number} - стартовый год
     * @return html
     */
    renderMonthOptions(month, year) {
        let html = '';
        month = new Date().getMonth() + 1; //Fix: рендерим с текущего месяца
        year = new Date().getFullYear();
        for (let i = month; i <= 12; i++) {
            html += searchWizardDateTpl.monthOptions(searchWizardDateTpl.monthNames[i - 1], i, year)
        }

        for (let i = 1; i <= (13 - month); i++) {
            html += searchWizardDateTpl.monthOptions(searchWizardDateTpl.monthNames[i - 1], i, +year + 1)
        }
        return html
    }

    /**
     * Рендерит дни календаря
     * @param month {number} - месяц
     * @param year {number} - год
     * @return {html}
     */
    renderDays(month, year) {
        let html = '';

        // Кол-во дней в предыдущем месяце
        const lastMonthDate = new Date(year, month - 2);
        const lastMonthYear = lastMonthDate.getFullYear();
        const lastMonthMonth = lastMonthDate.getMonth();

        const lastMonthDays = this.daysInMonth(lastMonthMonth + 1, lastMonthYear);
        // День недели первого числа текущего месяца
        let dayOfWeekFirst = new Date(year, month - 1, 1).getDay();
        if (!dayOfWeekFirst) {
            dayOfWeekFirst = 7;
        }

        // Предыдущий месяц
        for (let i = lastMonthDays - dayOfWeekFirst + 2; i <= lastMonthDays; i++) {
            html += searchWizardDateTpl.day(i, lastMonthMonth + 1, lastMonthYear, true)
        }

        const maxDays = this.daysInMonth(month, year);
        // Текеущий месяц
        for (let i = 1; i <= maxDays; i++) {
            html += searchWizardDateTpl.day(i, month, year, false)
        }


        const nextMonthDate = new Date(year, month);
        const nextMonthYear = nextMonthDate.getFullYear();
        let nextMonthMonth = nextMonthDate.getMonth() + 1;
        nextMonthMonth = nextMonthMonth > 12 ? 1 : nextMonthMonth;

        // Дни cледующиго месяца
        const nextDaysCount = 7 - (dayOfWeekFirst - 1 + maxDays) % 7;
        if (nextDaysCount < 7) {
            for (let i = 1; i <= nextDaysCount; i++) {
                html += searchWizardDateTpl.day(i, nextMonthMonth, nextMonthYear, true)
            }
        }
        return html
    }



    /**
     * Возращает кол-во дней в месяце
     * @return {number}
     */
    daysInMonth = (month, year) => new Date(year, month, 0).getDate();
}