let categories = [];

function renderCategories() {
  const categoriesLiArr = categories.map((categorie) => {
    return `<li>name: <strong>${categorie.name}</strong> price: <strong>${categorie.price}</strong> quantity: <strong>${categorie.quantity}</strong></li>`;
  });
  document.querySelector(".categories").innerHTML = categoriesLiArr.join("");
}

function addCategory() {
  const name = document.querySelector("#nameAddCategory").value;
  let price = Number(document.querySelector("#priceAddCategory").value);
  let quantity = 0;
  if (document.querySelector("#quantityAddCategory").value !== "") {
    quantity = Number(document.querySelector("#quantityAddCategory").value);
  }
  ///////////////////////// Check if a user typed name and price
  //////////////////////// and then execute the responsible block of code:
  if (!name || !price) {
    alert(
      "Please, enter the name of the snack category and the price of items in the category."
    );
  } else {
    price = price.toFixed(2);
    ///////////////////////// Check if the name of the category a user is trying to add already exists in categories:
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
      renderCategories();
      console.log(name, price, quantity);
    }
  }
}

function addItem() {
  const name = document.querySelector("#nameAddItem").value;
  const quantity = Number(document.querySelector("#quantityAddItem").value);
  ///////////////////////// Check if a user typed name and quantity
  //////////////////////// and then execute the responsible block of code:
  if (name && quantity) {
    let itemIsFound = false;
    for (let categorie of categories) {
      ///////////////////////// Check if the category that a user is trying to add products to exists.
      if (categorie.name === name) {
        itemIsFound = true;
        categorie.quantity += quantity;
        alert(`'${name}' quantity has been successfully updated.`);
        ///////////////// If category was not served, it will be served
        ////////////////again if the quantity of items in category more then 0.
        if (categorie.quantity > 0) {
          categorie.canBeSold = true;
        }
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
  renderCategories();
}

function purchase() {
  const name = document.querySelector("#namePurchase ").value;
  const date = document.querySelector("#datePurchase ").value;
  ///////////////////////// Check if a user typed name and date
  //////////////////////// and then execute the responsible block of code:
  if (name && date) {
    let itemIsFound = false;
    ///////////////////////// Try to find the category that a user typed.
    for (let categorie of categories) {
      if (categorie.name === name) {
        itemIsFound = true;
        /////////////////If the quantity of items in the category a user is trying
        ///to buy 0 or less and Clear function was called, the next block of code will not be executed.
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
    ///////////////////////// Execute the next code if the category was not found.
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
  renderCategories();
}

function report() {
  const date = document.querySelector("#dateReport").value;
  const dayArr = date.split("-");
  const year = dayArr[0];
  const month = dayArr[1];
  const day = dayArr[2];
  let response = {};
  let total = 0;
  ////////////////////// Check if a user wants to see the report for a specific month or since a certian date.
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
    let reportLi = Object.entries(response)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((categorie) => {
        return `<li>name: <strong>${categorie[0]}</strong> earnings in <strong>${date}</strong> = <strong>${categorie[1]}$</strong></li>`;
      });
    reportLi.push(`<li> Total ${total}</li>`);
    document.querySelector(".report").innerHTML = reportLi.join("");
  } else if (dayArr.length === 3) {
    for (let categorie of categories) {
      response[categorie.name] = 0;
      for (let date of categorie.dates) {
        //////////////// The function dateSuits (below) is used when a user wants
        //to see the report since a certain date and we found a suitable date in the dates array of a category.
        function dateSuits() {
          total += Number(categorie.price);
          response[categorie.name] = (
            Number(response[categorie.name]) + Number(categorie.price)
          ).toFixed(2);
        }
        if (date.year > year) {
          dateSuits();
        } else if (date.year === year && date.month > month) {
          dateSuits();
        } else if (
          date.year === year &&
          date.month === month &&
          date.day >= day
        ) {
          dateSuits();
        }
      }
    }
    //// Delete the categories which were not served(value = 0) from the response object.
    for (let property in response) {
      if (response[property] === 0) {
        delete response[property];
      }
    }
    ///////// Convert response object to array and sort it.
    let reportLiSorted = Object.entries(response).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    let reportLiSortedReady = reportLiSorted.map((categorie) => {
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
    reportLiSortedReady.push(`<li>Total ${total}</li>`);
    document.querySelector(".report").innerHTML = reportLiSortedReady.join("");
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
