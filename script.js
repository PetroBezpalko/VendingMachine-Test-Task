let categories = [];

function renderTheList() {
  const categoriesItems = categories.map((categorie) => {
    return `<li>name: <strong>${categorie.name}</strong> price: <strong>${categorie.price}</strong> quantity: <strong>${categorie.quantity}</strong></li>`;
  });
  document.querySelector(".categories").innerHTML = categoriesItems.join("");
}

function addCategory() {
  const name = document.querySelector("#nameAddCategory ").value;
  let price = Number(document.querySelector("#priceAddCategory ").value);
  let quantity = 0;
  if (document.querySelector("#quantityAddCategory ").value !== "") {
    quantity = Number(document.querySelector("#quantityAddCategory").value);
  }
  if (!name || !price) {
    alert(
      "Please, enter the name of the snack category and the price of items in the category."
    );
  } else {
    price = price.toFixed(2);
    let newItem = true;
    for (let categorie of categories) {
      if (categorie.name === name) {
        alert(
          `You can not add '${name}' to categories. The product with '${name}' name already exists.`
        );
        newItem = false;
      }
    }
    if (newItem) {
      categories.push({
        name: name,
        price: price,
        quantity: quantity,
        canBeSold: true,
        dates: [],
      });
      renderTheList();
      console.log(name, price, quantity);
    }
  }
}

function addItem() {
  const name = document.querySelector("#nameAddItem").value;
  const quantity = Number(document.querySelector("#quantityAddItem").value);

  if (name && quantity) {
    let itemIsFound = false;
    for (let categorie of categories) {
      if (categorie.name === name) {
        itemIsFound = true;
        categorie.quantity += quantity;
        alert(`'${name}' quantity has been successfully updated.`);
        console.log(name, categorie.price, categorie.quantity);
      }
    }
    if (!itemIsFound) {
      alert(
        `Sorry, there is no such name as '${name}' in the categories. Please, enter a valid name.`
      );
    }
  } else {
    alert(
      "Please, enter the name of the snack category and the quantity of items you want to add."
    );
  }
  renderTheList();
}

function purchase() {
  const name = document.querySelector("#namePurchase ").value;
  const date = document.querySelector("#datePurchase ").value;
  if (name && date) {
    let itemIsFound = false;
    for (let categorie of categories) {
      if (categorie.name === name) {
        itemIsFound = true;
        if (categorie.canBeSold) {
          categorie.quantity -= 1;
          const dayArr = date.split("-");
          const dateObj = {
            year: dayArr[0],
            month: dayArr[1],
            day: dayArr[2],
          };
          categorie.dates.push(dateObj);
          alert(`1 '${name}' has been purchased.`);
        } else {
          alert(`Sorry, the '${name}' can not be purchased. Out of stock!`);
        }
        console.log(date, name, categorie.price);
      }
    }
    if (!itemIsFound) {
      alert(
        `Sorry, there is no such name as '${name}' in the categories. Please, enter a valid name.`
      );
    }
  } else {
    alert(
      "Please, enter the name of the snack category and the purchase date."
    );
  }
  renderTheList();
}

function report() {
  const date = document.querySelector("#dateReport").value;
  const dayArr = date.split("-");
  const year = dayArr[0];
  const month = dayArr[1];
  const day = dayArr[2];
  let response = {};
  let log = [];
  let total = 0;
  if (dayArr.length === 2) {
    for (let categorie of categories) {
      response[categorie.name] = 0;
      for (let date of categorie.dates) {
        if (date.year === year && date.month == month) {
          response[categorie.name] = (
            Number(response[categorie.name]) + Number(categorie.price)
          ).toFixed(2);
          total += Number(categorie.price);
        }
      }
      console.log(
        categorie.name,
        response[categorie.name],
        response[categorie.name] / categorie.price
      );
    }
    console.log(`Total ${total}`);
    let reportLi = Object.entries(response).map((categorie) => {
      return `<li>name: <strong>${categorie[0]}</strong> earnings in <strong>${date}</strong> = <strong>${categorie[1]}$</strong></li>`;
    });
    reportLi.push(`<li> Total ${total}</li>`); //
    document.querySelector(".report").innerHTML = reportLi.join("");
  } else if (dayArr.length === 3) {
    for (let categorie of categories) {
      response[categorie.name] = 0;
      for (let date of categorie.dates) {
        if (date.year > year) {
          total += Number(categorie.price);
          response[categorie.name] = (
            Number(response[categorie.name]) + Number(categorie.price)
          ).toFixed(2);
        } else if (date.year === year && date.month > month) {
          total += Number(categorie.price);
          response[categorie.name] = (
            Number(response[categorie.name]) + Number(categorie.price)
          ).toFixed(2);
        } else if (
          date.year === year &&
          date.month === month &&
          date.day >= day
        ) {
          total += Number(categorie.price);
          response[categorie.name] = (
            Number(response[categorie.name]) + Number(categorie.price)
          ).toFixed(2);
        }
      }
    }
    for (let property in response) {
      if (response[property] === 0) {
        delete response[property];
      }
    }

    const reportLi = Object.entries(response).map((categorie) => {
      for (let categori of categories) {
        if (categori.name === categorie[0]) {
          console.log(
            categorie[0],
            categorie[1],
            categorie[1] / categori.price
          );
        }
      }
      return `<li>name: <strong>${categorie[0]}</strong> earnings since <strong>${date}</strong> = <strong>${categorie[1]}$</strong></li>`;
    });
    reportLi.push(`<li>Total ${total}</li>`);
    document.querySelector(".report").innerHTML = reportLi.join("");
    console.log(`Total ${total}`); //
  } else {
    alert(
      "Please, enter the date in the following format: '2021-04' or '2021-04-13'"
    );
  }
}

function list() {
  const servedCategories = categories.filter((categorie) => {
    return categorie.dates.length > 0 && categorie.canBeSold;
  });

  const sortedByQuantity = servedCategories.sort((a, b) => {
    return b.quantity - a.quantity;
  });
  let servedCategoriesLiArr = [];

  for (let categorie of sortedByQuantity) {
    servedCategoriesLiArr.push(
      `name: <strong>${categorie.name}</strong> price: <strong>${categorie.price}</strong> left: <strong>${categorie.quantity}</strong> items.`
    );
    console.log(categorie.name, categorie.price, categorie.quantity);
  }

  const servedCategoriesLi = servedCategoriesLiArr.map((categorie) => {
    return `<li> ${categorie} </li>`;
  });
  document.querySelector(".list").innerHTML = servedCategoriesLi.join("");
}

function clearr() {
  for (let categorie of categories) {
    if (categorie.quantity <= 0) {
      categorie.canBeSold = false;
      console.log(categorie.name, categorie.price);
    }
  }
  alert(
    "Snack categories that do not have items for sale will not be served any more."
  );
}
