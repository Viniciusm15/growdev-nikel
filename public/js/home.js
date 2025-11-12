const myModal = new bootstrap.Modal("#transaction-modal");
const session = localStorage.getItem("session");
let logged = sessionStorage.getItem("logged");
let data = {
    transactions: []
};

checkLogged();

//DESLOGAR NO SISTEMA
document.getElementById("button-logout").addEventListener("click", logout);

//NAVEGAR PARA LISTAGEM DE TRANSAÇÕES
document.getElementById("transaction-button").addEventListener("click", function () {
    window.location.href = "transactions.html"
});

//ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions("1", "cash-in-list");
    getTransactions("2", "cash-out-list");
    getTotal();

    alert("Lançamento adicionado com sucesso.")
});

// FUNÇÕES AUXILIARES
function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions("1", "cash-in-list");
    getTransactions("2", "cash-out-list");
    getTotal();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

function getTransactions(type, elementId) {
    const transactions = data.transactions;
    const filteredTransactions = transactions.filter((item) => item.type === type);

    if (filteredTransactions.length) {
        let transactionsHtml = ``;
        let limit = filteredTransactions.length > 5 ? 5 : filteredTransactions.length;

        for (let index = 0; index < limit; index++) {
            transactionsHtml += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${filteredTransactions[index].value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <p>${filteredTransactions[index].description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-end">
                                ${filteredTransactions[index].date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById(elementId).innerHTML = transactionsHtml;
    }
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;

    transactions.forEach((item) => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}
