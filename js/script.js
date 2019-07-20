const delete_item = document.getElementsByClassName('delete_item');
const basket_wrap = document.querySelector('.basket-wrap');
const buy_buttons = document.getElementsByClassName('item-button');
let basket = [];
let savedItems = localStorage.getItem("basket");

const addItemsToDOM = link => {
    const items_wrap = document.querySelector('.products-wrap');
    const item_block = document.createElement('div');
    item_block.classList.add("item-block");
    const img = document.createElement('img');
    img.src = link.descr.img_src;
    img.classList.add("item-img");
    const model = document.createElement('h2');
    model.innerHTML = link.descr.model;
    model.classList.add("item-model");
    const sex = document.createElement('span');
    sex.innerHTML = link.descr.sex;
    sex.classList.add("item-sex");
    const cost = document.createElement('span');
    cost.innerHTML = link.descr.cost;
    cost.classList.add("item-cost");
    const dollar = document.createElement('span');
    dollar.innerHTML = "$";
    dollar.classList.add("item-dollar");
    const button = document.createElement('button');
    button.classList.add("item-button");
    button.innerHTML = "Buy";
    button.setAttribute('data', link.id);
    item_block.appendChild(cost);
    item_block.appendChild(dollar);
    item_block.appendChild(img);
    item_block.appendChild(sex);
    item_block.appendChild(model);
    item_block.appendChild(button);
    items_wrap.appendChild(item_block);
}

const addItemsToBasket = link => {
    const basket_wrap = document.querySelector('.basket-wrap');
    const item_block = document.createElement('div');
    item_block.classList.add("item-basket-block");
    const img = document.createElement('img');
    img.src = link.img_src;
    img.classList.add("item-basket-img");
    const model = document.createElement('span');
    model.innerHTML = link.model;
    model.classList.add("item-basket-model");
    const sex = document.createElement('span');
    sex.innerHTML = link.sex;
    sex.classList.add("item-basket-sex");
    const cost = document.createElement('span');
    cost.innerHTML = link.cost;
    cost.classList.add("item-basket-cost");
    const dollar = document.createElement('span');
    dollar.innerHTML = "$";
    dollar.classList.add("item-dollar");
    const button = document.createElement('button');
    button.innerHTML = "Delete Item";
    button.classList.add("delete_item");
    button.setAttribute('data', link.id);
    const quantity = document.createElement('span');
    quantity.innerHTML = link.quantity;
    quantity.classList.add("item-quantity");
    item_block.appendChild(cost);
    item_block.appendChild(dollar);
    item_block.appendChild(img);
    item_block.appendChild(sex);
    item_block.appendChild(model);
    item_block.appendChild(quantity);
    item_block.appendChild(button);
    basket_wrap.appendChild(item_block);
}

if ( savedItems != undefined ) {
   savedItems = JSON.parse(savedItems);
   basket = savedItems; 
   for ( let i = 0; i < basket.length; i++ ) {
       addItemsToBasket(basket[i]);
   } 
}

fetch('js/items.json')
     .then(resp => resp.json())
     .then(resp => {
          let items = resp;
    
          for ( let i = 0; i < items.length; i++ ) {
              //console.log(items[i].descr.model)
              addItemsToDOM(items[i])
          }
          for ( let i = 0; i < buy_buttons.length; i++ ) {
              buy_buttons[i].addEventListener('click', () => {
                  const id = event.target.getAttribute('data');
                  for ( let i = 0; i < items.length; i++ ) {
                      if ( items[i].id == id) {
                          let item = items[i].descr;
                          console.log(item)
                          if ( item.inBasket == false ) {
                              addItemsToBasket(item);
                              basket.push(item);
                              item.inBasket = true;
                          }
                          else {
                              const item_quantity = document.querySelector('.item-quantity');
                              item.quantity++; 
                              item_quantity.innerHTML = item.quantity;
                          }
                          localStorage.setItem("basket", JSON.stringify(basket));
                      }
                  }
              })
          }
          document.addEventListener('mousemove', () => {
              for ( let i = 0; i < delete_item.length; i++ ) {
                  delete_item[i].addEventListener('click', event => {
                      basket_wrap.removeChild(event.target.parentElement);
                      const id = event.target.getAttribute('data');
                      basket.forEach((item,i,arr)=>{
                          if ( item.id == id ) {
                              arr.splice(i,1);
                              item.inBasket = false;
                              localStorage.setItem("basket", JSON.stringify(arr)) 
                          }
                      })
                  })
              }
          })
     })


