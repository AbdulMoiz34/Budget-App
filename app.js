(() => {

    // get necessary DOM elements
    let budgetInpElem = document.querySelector(".budget-input");
    let budgetBtn = document.querySelector(".budget-button");

    let budgetFormContainerElem = document.querySelector(".budget-form-container");
    let expenseFormContainerElem = document.querySelector(".expense-form-container");
    let expenseListContainer = document.querySelector(".expense-lists-container");

    let prevUserBudget = localStorage.getItem("budgetData");
    let budgetEntries = prevUserBudget ? JSON.parse(prevUserBudget) : [];
    let myIndex = -1;

    // class for making objs & helper function
    class Budget {
        constructor(dueDate, amount, category, paymentDate) {
            this.dueDate = dueDate;
            this.amount = amount;
            this.category = category;
            this.paymentDate = paymentDate;
        }
        static myAlert(sentence, backColor = "#fff", color = "#000") {
            let myAlert = document.querySelector(".my-alert");
            myAlert.style.display = "inline-block";
            myAlert.style.color = color;
            myAlert.style.backgroundColor = backColor;
            myAlert.textContent = sentence;
            setTimeout(() => {
                myAlert.style.display = "none";
            }, 1500);
        };
    }

    const setBudgetInLocalStorage = () => {
        const date = document.querySelector(".date-inp");
        const amount = document.querySelector(".amount-inp");
        const category = document.querySelector(".category-inp");
        const paymentDate = document.querySelector(".payment-date-inp");
        if (myIndex !== -1) {
            // Update existing entry
            const budgetEntry = new Budget(date.value, amount.value, category.value, paymentDate.value);
            budgetEntries[myIndex] = budgetEntry;
            Budget.myAlert("Save to a local storage in your browser");
        } else {
            // Add new entry
            const budgetEntry = new Budget(date.value, amount.value, category.value, paymentDate.value);
            budgetEntries.push(budgetEntry);
            Budget.myAlert("Save to a local storage in your browser");
        }
        localStorage.setItem("budgetData", JSON.stringify(budgetEntries));
        date.value = "";
        amount.value = "";
        category.value = "";
        paymentDate.value = "";
    }

    let totExpense;

    const displayBudget = () => {
        totExpense = 0;

        if (budgetEntries.length !== 0) {
            budgetFormContainerElem.style.display = "none";
            expenseListContainer.style.display = "block";

        } else {
            budgetFormContainerElem.style.display = "block";
            expenseListContainer.style.display = "none";
            budgetInpElem.value = "";
        }
        const ul = document.querySelector(".ul");
        ul.innerHTML = "";
        budgetEntries.forEach((budget, index) => {
            // Diplay due date
            document.querySelector(".due-date").textContent = `Due Date: ${budget.dueDate}`;
            // ---------
            totExpense += +budget.amount;
            let li = document.createElement("li");
            let div = document.createElement("div");
            div.classList.add("container");
            div.innerHTML = ` 
            <div class="box1">
               <h3 class="expense-title">${budget.category}</h3>
               <p class="expense-date">${budget.paymentDate}</p>
            </div>

            <div class="box2">
              <p class="amount">${+budget.amount}</p>
              <span class="editBtn">&#x1F58C</span>
              <span class="delBtn">&#x274C</span>
            </div>`;
            li.appendChild(div);
            ul.appendChild(li);

            // call display result for (sum)
            displayResult(totExpense, localStorage.getItem("userBudget"));

            //delete button click listener
            div.querySelector(".delBtn").addEventListener("click", () => {
                budgetEntries.splice(index, 1);
                localStorage.setItem("budgetData", JSON.stringify(budgetEntries));
                displayBudget();
            });

            //Edit button click listener
            div.querySelector(".editBtn").addEventListener("click", () => {
                let date = document.querySelector(".date-inp");
                let amount = document.querySelector(".amount-inp");
                let category = document.querySelector(".category-inp");
                let paymentDate = document.querySelector(".payment-date-inp");
                expenseFormContainerElem.style.display = "block";
                expenseListContainer.style.display = "none";
                myIndex = index;
                date.value = budget.dueDate;
                amount.value = budget.amount;
                category.value = budget.category;
                paymentDate.value = budget.paymentDate;
            });
        });

    }

    const displayResult = (totExpense, budget) => {
        let expenseElem = document.querySelector(".user-expenses");
        let remainElem = document.querySelector(".remain");
        let budgetElem = document.querySelector(".user-budget");
        let remain = budget - totExpense;
        if (remain < 0) {
            budgetElem.style.color = "red";
            Budget.myAlert("Your expenses is out your budget \uD83D\uDE02", "#e04034", "#fff");
        } else {
            budgetElem.style.color = "green";
        }
        expenseElem.textContent = `Expenses: ${totExpense}`;
        remainElem.textContent = `Remain: ${remain}`;
        budgetElem.value = +budget;
    }
    // Call Initially
    displayBudget();

    // If user removes focus from budget input, save to local storage
    document.querySelector(".user-budget").addEventListener("blur", () => {
        let userBudget = document.querySelector(".user-budget");
        localStorage.setItem("userBudget", userBudget.value);
        Budget.myAlert("Save to a local storage in your browser");
        displayResult(totExpense, localStorage.getItem("userBudget"));
    });

    // add expense button click
    document.querySelector(".add-expense-btn").addEventListener("click", () => {
        expenseFormContainerElem.style.display = "block";
        expenseListContainer.style.display = "none";
        myIndex = -1;

    });

    // Expense form submit listener
    document.querySelector(".expense-form").addEventListener("submit", event => {
        event.preventDefault();
        expenseFormContainerElem.style.display = "none";
        expenseListContainer.style.display = "block";
        setBudgetInLocalStorage();
        displayBudget();
    });

    // budget form submit listener
    document.querySelector(".budget-form-container").addEventListener("submit", (e) => {
        e.preventDefault();
        budgetFormContainerElem.style.display = "none";
        expenseFormContainerElem.style.display = "block";
        localStorage.setItem("userBudget", budgetInpElem.value);
    });
})();