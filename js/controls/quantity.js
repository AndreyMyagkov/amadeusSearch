/** 
 *  Контрол + -
 */
class Quantity {
    constructor(selector) {
        this.$root = document.querySelector(selector);
        if (!this.$root) {
            return false
        }
        this.$plus = this.$root.querySelector('.js-ibe-quantity__plus');
        this.$minus = this.$root.querySelector('.js-ibe-quantity__minus');
        this.$input = this.$root.querySelector('.js-ibe-quantity__input');
        this.name = this.$root.querySelector('.js-ibe-quantity__input').getAttribute('name');

        this.minValue = this.getMinValue();
        this.maxValue = this.getMaxValue();

        this.addEvents();
    }

    addEvents() {
        this.$minus.addEventListener('click', () => {
            this.minus()
        })
        this.$plus.addEventListener('click', () => {
            this.plus()
        })
    }

    getMinValue() {
        return this.$input.getAttribute('min') ?? 0;
    }
    getMaxValue() {
        return this.$input.getAttribute('max') ?? 100;
    }

    minus() {
        let val = this.getValue()
        val--;
        if (val >= this.minValue) {
            this.setValue(val)
        }
    }

    plus() {
        let val = this.getValue()
        val++;
        if (val <= this.maxValue) {
            this.setValue(val)
        }
    }

    setValue(val) {
        this.$input.value = val;
        _ibeTourists.onTouristsChange(this.name);
    }

    getValue() {
        return +this.$input.value
    }
}