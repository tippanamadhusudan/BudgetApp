import budgetController from './budgetController';
import { UIController } from './UIController';
//console.log(budgetController);

/**
 * GLOBAL CONTROLLER
 */

let UICtrl, budCtrl, type, description, value, index;
let month = document.querySelector('.month').value;

UICtrl = UIController();
budCtrl = new budgetController(month);

// Setting UI
UICtrl.settingUI();

// We will save all the data objects in this array
let allData = [];
getData();


// Calling budget controller and UI controller functions
if(month) findMonth();

// if(!month) alert('Please select valid month');
// else {
//     findMonth();
// }

// Both functions below is to save and get data from local storage
function saveData() {
    localStorage.setItem('Madhu', JSON.stringify(allData));
}

function getData() {
    const storage = JSON.parse(localStorage.getItem('Madhu'));
    
    // Restoring data from local storage
    if(storage) {
        allData = storage;
        allData.forEach(el => {
            el.addItem = budCtrl.addItem;
            el.deleteItem = budCtrl.deleteItem;
            el.calcBudget = budCtrl.calcBudget;
            el.calcTotal = budCtrl.calcTotal;
            el.calculatePercentage = budCtrl.calculatePercentage;
        });
    }
    else allData = [];
}

// Google pie chart
function googleChart() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    
    // Draw chart and set values
    function drawChart() {
        //console.log(parseFloat(document.getElementById('head_budget').innerHTML));
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Amount in CAD$'],
            ['Budget', parseFloat(document.getElementById('head_budget').innerHTML)],
            ['Expenses', parseFloat(document.getElementById('head_expense').innerHTML)]
        ]);

        
        // Add a title and set the width and height of the chart
        var options = {
            title: 'My Budget',
            width: '100%',
            height: '100%',
            //backgroundColor: 'aliceblue',
            slices: {
                0:{'color': '#ADFF2F'},
                1:{'color': '#FF4C00'}
            }
        };

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }

}
// calling this function here is to display chart when page reloads
googleChart();

// To display the data saved in localstorage on UI
function render(budCtrl) {
    let inc = budCtrl.inc;
    let exp = budCtrl.exp;
    let income = budCtrl.totals.inc;
    let expense = budCtrl.totals.exp;
    let budget = budCtrl.budget;

    // Income and Expense UI
    if(inc.length > 0) {
        inc.forEach(el => {
            UICtrl.updateBottomUI('inc', el.description, el.value, el.id);
        });
    }
    if(exp.length > 0) {
        exp.forEach(el => {
            UICtrl.updateBottomUI('exp', el.description, el.value, el.id, el.percentage);
        });
    }

    // Top UI
    UICtrl.updateTopUI(income, expense, budget);
}

function findMonth() {
    const found = allData.some(el => el.month === month);

    if(found) {
        for(let i = 0; i < allData.length; i++) {
            if(allData[i].month === month) {
                index = i;
                // Display in UI
                render(allData[i]);
            }
        }
    } else {
        allData.push(new budgetController(month));
        index = allData.length - 1;
    }
}

function updateTopUI() {
    let income, budget, expense;
    income = allData[index].totals.inc;
    expense = allData[index].totals.exp;
    budget = allData[index].budget;
    UICtrl.updateTopUI(income, expense, budget);
}

function updateBottomUI(type, des, val) {
    let percentage, id;
    let length = allData[index][type].length;;

    if(length === 0) id=0;
    else id = allData[index][type][length-1].id;

    if(allData[index].exp.length > 0 && type === 'exp') percentage = allData[index].exp[length - 1].percentage;

    // Display entered details in respective section(Income/Expense) on UI
    UICtrl.updateBottomUI(type, des, val, id, percentage);
}


document.querySelector('.month').addEventListener('change', () => {
    month = document.querySelector('.month').value;
    
    // Clearing UI after change in month
    UICtrl.settingUI();
    UICtrl.clearHTML();
    UICtrl.clearFields();

    // Searching if the month is in array
    findMonth();

    // Display chart
    googleChart();

});


// This does all the operations for adding an item and after that
function ctrlAddItem() {
    
    // Take inputs from UI
    let input = UICtrl.inputs();
    value = input.value;
    description = input.description;
    type = input.type;

    if(!month) alert('Please select the month you are calculating the budget for before entering values!');
    else {
        if(description === '') {
            UICtrl.clearFields();
            alert('Please enter description');
        } else if(value <= 0) {
            UICtrl.clearFields();
            alert('Please enter a valid value');
        }
        else{
            // Add item, calculate Total income, expense, budget, percentages
            allData[index].addItem(type, description, value);
            //allData[index].calcTotal();
            allData[index].calcBudget();
            allData[index].calculatePercentage();

            
            // Display entered details in respective section(Income/Expense) on UI
            updateBottomUI(type, description, value);

            // Display total budget, income, expense on UI
            updateTopUI();
            googleChart()

            // Clear input fields
            UICtrl.clearFields();
        }

        // Save data to local storage
        saveData();
    }
    
}

function ctrlDeleteItem() {
    let itemID, splitID, type, ID;
    /**
     * Learn how this works internally
     * Use closest() so that it will take that element even when clicked on child elements
     * parentNode to go to parent element
     * Our goal is by using parentNode we go to element with class "income_list or expense_list"
     */
    itemID = event.target.closest('.item__delete--btn').parentNode.parentNode.parentNode.id;
    

    if (itemID) {  
        splitID = itemID.split('-');
        type = splitID[0] === 'income' ? 'inc' : 'exp';
        ID = parseInt(splitID[1]);

        // 1. delete the item from the data structure
        allData[index].deleteItem(type, ID);
        
        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID);

        // 3. Update Totals and budget
        allData[index].calcTotal(type);
        allData[index].calcBudget();
        allData[index].calculatePercentage();
        

        // 4. Update Top UI
        updateTopUI();
        googleChart();

        // 5. Save data to local storage
        saveData();
    }
}


// Event listeners
document.querySelector('.add__btn').addEventListener('click', () => {
    ctrlAddItem();
});
document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
    }
});

document.querySelector('.bottom').addEventListener('click', ctrlDeleteItem);
