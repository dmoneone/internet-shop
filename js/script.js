    
const delete_item = document.getElementsByClassName('delete_item');
const items_basket = document.querySelector('.items-basket');
const buy_buttons = document.getElementsByClassName('item-button');
const items_wrap = document.querySelector('.products-wrap');
let basket = [];
let savedItems = localStorage.getItem("basket");

const addItemsToDOM = link => {
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
    quantity.innerHTML = link.count;
    quantity.classList.add("item-quantity");
    item_block.appendChild(cost);
    item_block.appendChild(dollar);
    item_block.appendChild(img);
    item_block.appendChild(sex);
    item_block.appendChild(model);
    item_block.appendChild(quantity);
    item_block.appendChild(button);
    items_basket.appendChild(item_block);
}

const addToBasket = arr => {
    let id = event.target.getAttribute('data');
    for ( let i = 0; i < arr.length; i++ ) {
        if ( arr[i].id == id) {
            let item = arr[i].descr;
            if ( item.inBasket == false ) {
                addItemsToBasket(item);
                basket.push(item);
                item.inBasket = true;
            }
            else {
                item.count++; 
            }
            localStorage.setItem("basket", JSON.stringify(basket));
        }
    }    
}

if ( savedItems != undefined ) {
   savedItems = JSON.parse(savedItems);
   basket = savedItems; 
   for ( let i = 0; i < basket.length; i++ ) {
       addItemsToBasket(basket[i]);
   }
}
 
const main = response => {
    
    for ( let i = 0; i < response.length; i++ ) {
        addItemsToDOM(response[i]);
        response[i].descr.inBasket = false;
        response[i].descr.count = 1;
    }
    
    for ( let i = 0; i < buy_buttons.length; i++ ) {
        buy_buttons[i].addEventListener('click', () => addToBasket(response))
    }
    
    document.addEventListener('mousemove', () => {
        for ( let i = 0; i < delete_item.length; i++ ) {
            delete_item[i].addEventListener('click', event => {
                event.target.parentElement.remove();
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
}

fetch('js/items.json')
     .then(resp => resp.json())
     .then(resp => {
          let items = resp;
          main(items);
     })

