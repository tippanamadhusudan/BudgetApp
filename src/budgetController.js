/**
 * BUDGET CONTROLLER
 */
// Object constructor for income objects
class Income {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = parseInt(value);
    }
}

// Object constructor for income objects
class Expense {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = parseInt(value);
    }
}

export default class Data {
    constructor(month) {
        this.month = month;
        this.inc = [],
        this.exp = [],
        this.budget = 0,
        this.totals = {
            inc: 0,
            exp: 0
        }
    }

    addItem(type, des, val) {
        let newItem, arrLength, ID;

        arrLength = this[type].length;
        if(arrLength === 0) ID = 0;
        else {
            ID = this[type][arrLength - 1].id + 1;
        }

        if(type === 'inc') {
            newItem = new Income(ID, des, val);
        } else if(type === 'exp') {
            newItem = new Expense(ID, des, val);
        }
        // Push newItem 
        this[type].push(newItem);

        // Total
        this.totals[type] += val;
    }

    calcBudget() {
        this.budget = this.totals.inc - this.totals.exp;
    }

    calcTotal(type) {
        let sum = 0;
        this[type].forEach(el => {
            sum += el.value;
        });
        this.totals[type] = sum;
    }

    deleteItem(type, id) {
        let idArray = this[type].map(el => {
            return el.id;
        });

        let index = idArray.indexOf(id);

        if(index !== -1) this[type].splice(index, 1);

        // Total
        this.calcTotal(type);           
    }

    calculatePercentage() {
        if(this.totals.inc > 0) {
            this.exp.forEach(el => {
                el.percentage = Math.round(el.value * 10000 / this.totals.inc) / 100;
            });
        } else {
            this.exp.forEach(el => {
                el.percentage = '---';
            });
        }
    }

}
