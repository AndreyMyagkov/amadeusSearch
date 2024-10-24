/**
 * Класс отрисовки календаря: слайдер месяцев, календарь
 * 1. рендер контрола месяца со стартового месяца и года, если не дали, то текущие
 * 
 */
const searchWizardDateTpl = {
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    
    /*monthOptions: (monthName, month, year) => `<option value="${month}${year}">${monthName} ${year}</option>
    `,*/
    monthCurrent: (monthName, month, year) => `<div class="cmsDatePicker-months__current" data-month="${month}" data-year="${year}">${monthName} ${year}</div>`,

    day: (day, month, year, passed, selected) => `<div class="cmsDatePicker__day ${passed ? 'passed' : ''} ${selected ? 'active' : ''}"  data-day="${`${+day + 100}`.substring(1)}" data-month="${`${+month + 100}`.substring(1)}" data-year="${year}">
        <span>${day}</span></div>
    `,


    outer: (monthCurrent, days) => `
    <!-- calendarFrame -->
    <div class="cmsDatePicker__calframe">
        <!-- monthSelect -->
		<div class="cmsDatePicker-months">
			<button class="cmsDatePicker-months__prev js-ibe-calendar__month-prev" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" height="20">
                <path d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"/>
            </svg>
            </button>
			${monthCurrent}
			<button class="cmsDatePicker-months__next js-ibe-calendar__month-next" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" height="20">
                    <path d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"/>
                </svg>
            </button>
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

        // Текущая отображаемая дата
        this.day = null;
        this.month = null;
        this.year = null;

        // Текущая дата на сегодня
        this.nowDay = 0;
        this.nowMonth = 0;  
        this.nowYear = 0;

        this.selectedDay = null;
        this.selectedMonth = null;
        this.selectedYear = null;

        this.init();
    }
    
    init() {
        const now = new Date();
        this.nowDay = now.getDate();
        this.nowMonth = now.getMonth();
        this.nowYear = now.getFullYear();

        this.renderDatepicker(this.nowMonth, this.nowYear);
        this.eventsListener();
    }

    eventsListener() {
        document.addEventListener('click',  e => {
            if (!e.target.closest(this.selector)) {
                return
            }
            if (e.target.closest('.js-ibe-calendar__month-prev')) {
                this.datepickerMonthChange(-1)
            }
            if (e.target.closest('.js-ibe-calendar__month-next')) {
                this.datepickerMonthChange(1)
            }
//TODO: refactor
            if (e.target.closest('.cmsDatePicker__day')) {
                e.stopPropagation();
                const $day = e.target.parentNode;
                if ($day.classList.contains('passed')) {
                    return
                }
                const $oldSelectedDay = this.$root.querySelector('.active');
                if ($oldSelectedDay) {
                    $oldSelectedDay.classList.remove('active');
                }
                $day.classList.add('active');
                console.log($day.dataset.day, $day.dataset.month, $day.dataset.year)
                
                this.setDay($day.dataset.day, $day.dataset.month, $day.dataset.year)
            }
        })
        
    }

    setDay(d, m, y) {
        this.selectedDay = d;
        this.selectedMonth = m;
        this.selectedYear = y;
        this.onChange();
    }

    onChange() {
        _IBESearch.setDate(this.name, this.selectedDay, new String(+this.selectedMonth + 1).padStart(2, '0'), this.selectedYear);
    }
    /**
     * Изменяет текущий месяц датапикера
     * @param {number} diff - в какую сторону изменить месяц (1/-1)
     * @returns 
     */
    datepickerMonthChange(diff) {
        const currentEl = this.$root.querySelector('.cmsDatePicker-months__current');
        //const currentMonth = +currentEl.getAttribute('data-month');
        //const currentYear = +currentEl.getAttribute('data-year');

        // const now = new Date();
        // const nowYear = now.getFullYear();
        // const nowMonth = now.getUTCMonth() + 1;
        // console.log('было ', currentMonth, currentYear)
        // console.log('стало ', nowMonth, nowYear)
        // console.log('this', this.day, this.month, this.year)
        //console.log(diff, currentYear, nowYear, currentMonth, nowMonth)

        //const NOW_MONTH_INDEX = getMonthIndex(nowMonth,nowYear);

        // Нельзя выбрать меньший месяц, чем сейчас
        // if (diff === -1 && currentYear === nowYear && currentMonth <= nowMonth) {
        //     return
        // }
        if (diff === -1) {
            if (this.year === this.nowYear && this.month <= this.nowMonth) {
                return
            }
        }
        // Максимальный месяц через год
        // if (diff === 1 && currentYear === nowYear + 1 && currentMonth >= nowMonth - 1) {
        //     return
        // }

        // Нельзя выбрать дату > + 1 год
        if (diff === 1) {
            if (this.year === this.nowYear + 1 && this.month == this.nowMonth) {
                return
            }
        }
        

        const resultDate = new Date(this.year, this.month + diff);
        const resultMonth = resultDate.getMonth();
        const resultYear = resultDate.getFullYear();

        console.log(this.month, this.month + diff, resultMonth, resultYear)
 
        this.renderDatepicker(resultMonth, resultYear)

    }

    /**
     * Порядковый индекс месяца с нулевого года
     * @param {*} y 
     * @param {*} m 
     */
    getMonthIndex(m, y) {
        return y * 12 + m;
    }

    /**
     * Год и месяц по его порядковому номеру
     * @param {*} index 
     * @returns Порядковый номер месяца с нуля! 
     */
    getMonthAndYearFromMonthIndex(index) {
        return {
            year: Math.floor(index / 12),
            month: index % 12
        }
    }

    /**
     * Рендерит html датапикера
     * @param type {number} - тип: с - по
     * @param month {number} - месяц, год в формате 72021
     * @param duration {number} - выбранная продолжительность, либо -1, если не нужно выводить
     * @return html
     */
    renderDatepicker(month, year) {
        // if (!month || !year) {
        //     month = new Date().getMonth() + 1;
        //     year = new Date().getFullYear();
        // }
        this.month = month;
        this.year = year;
        console.log('renderDatepicker', month, year);
        // this.month = month;
        // this.year = year;

        const monthCurrent = searchWizardDateTpl.monthCurrent(searchWizardDateTpl.monthNames[+month], month, year);

        const days = this.renderDays(month, year);
        
        this.$root.innerHTML = searchWizardDateTpl.outer(monthCurrent, days)
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
        const lastMonthDate = new Date(year, month - 1);
        const lastMonthYear = lastMonthDate.getFullYear();
        const lastMonthMonth = lastMonthDate.getMonth();

        const lastMonthDays = this.daysInMonth(lastMonthMonth, lastMonthYear);
        // День недели первого числа текущего месяца
        let dayOfWeekFirst = new Date(year, month, 1).getDay();
        if (!dayOfWeekFirst) {
            dayOfWeekFirst = 7;
        }

        // Предыдущий месяц
        for (let i = lastMonthDays - dayOfWeekFirst + 2; i <= lastMonthDays; i++) {
            html += searchWizardDateTpl.day(i, lastMonthMonth, lastMonthYear, true, false)
        }

        const maxDays = this.daysInMonth(month, year);
        // Текеущий месяц
        for (let i = 1; i <= maxDays; i++) {
            let selected = false;
            let passed = false;
            if (this.selectedMonth == month && this.selectedYear == year && this.selectedDay == i) {
                selected = true
            }

            if (this.nowMonth == month && this.nowYear == year && this.nowDay > i) {
                passed = true
            }

            html += searchWizardDateTpl.day(i, month, year, passed, selected)
        }


        const nextMonthDate = new Date(year, month + 1);
        const nextMonthYear = nextMonthDate.getFullYear();
        let nextMonthMonth = nextMonthDate.getMonth() + 0;
        nextMonthMonth = nextMonthMonth > 12 ? 1 : nextMonthMonth;

        // Дни cледующиго месяца
        const nextDaysCount = 7 - (dayOfWeekFirst - 1 + maxDays) % 7;
        if (nextDaysCount < 7) {
            for (let i = 1; i <= nextDaysCount; i++) {
                html += searchWizardDateTpl.day(i, nextMonthMonth, nextMonthYear, true, false)
            }
        }
        return html
    }


    /**
     * Возращает кол-во дней в месяце
     * @return {number}
     */
    daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
}