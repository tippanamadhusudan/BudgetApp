
/**
 * USER INTERFACE CONTROLLER
 */
export const UIController = () => {
    // Saving DOM to make it easier for future changes in HTML document
    const DOMStrings = {
        inputType: document.querySelector('.add__type'),
        inputDescription: document.querySelector(".add__description"),
        inputValue: document.querySelector('.add__value'),
        inputButton: document.querySelector('.add__btn'),
        incomeContainor: document.querySelector('.income_list'),
        expenseContainor: document.querySelector('.expense_list'),
        headIncome: document.getElementById('head_income'),
        headExpense: document.getElementById('head_expense'),
        headBudget: document.getElementById('head_budget'),
        month: document.querySelector('.month')
    };


    return {

        inputs: () => {
            return {
                value: parseInt(DOMStrings.inputValue.value),
                description: DOMStrings.inputDescription.value,
                type: DOMStrings.inputType.value
            };
        },
        
        updateBottomUI: (type, des, val, id, per) => {
            let element, markup;
            if(type === 'inc') {
                element = DOMStrings.incomeContainor;
                
                markup = `
                    <div class="income_item" id="income-${id}">
                        <div class="item__description clearfix">${des}</div>
                        <div class="right">
                            <div class="item__value clearfix">+ ${val}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn">
                                    <b class="btn clearfix"><i class="btn btn-danger" name="delete">delete</i></b>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
            }
            else if(type === 'exp') {
                element = DOMStrings.expenseContainor;
                //exp.calcPercentage(monthSelected);
    
                markup = `
                    <div class="expense_item" id="expense-${id}">
                        <div class="item__description clearfix">${des}</div>
                        <div class="right">
                            <div class="item__value clearfix">- ${val}</div>
                            <div class="item__percentage clearfix">${per}%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn">
                                    <b class="btn clearfix"><i class="btn btn-danger" name="delete">delete</i></b>
                                </button>
                            </div>
                        </div>
                    </div>        
                `;
            }
    
            // Inserting HTML
            element.insertAdjacentHTML('beforeend', markup);
    
        },
        
        updateTopUI: (income, expense, budget) => {
            DOMStrings.headIncome.innerHTML = income;
            DOMStrings.headExpense.innerHTML = expense;
            DOMStrings.headBudget.innerHTML = budget;
        },

        clearFields: () => {
            DOMStrings.inputDescription.value = '';
            DOMStrings.inputValue.value = 0;
        },

        settingUI: () => {
            DOMStrings.headBudget.innerHTML = 0;
            DOMStrings.headExpense.innerHTML = 0;
            DOMStrings.headIncome.innerHTML = 0;
        },

        clearHTML: () => {
            DOMStrings.incomeContainor.innerHTML = '';
            DOMStrings.expenseContainor.innerHTML = '';
        },

        deleteListItem: (selectorID) => {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        }

    };

};