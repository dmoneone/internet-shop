    
const delete_item = document.getElementsByClassName('delete_item');
const items_basket = document.querySelector('.items-basket');
const buy_buttons = document.getElementsByClassName('item-button');
const items_wrap = document.querySelector('.products-wrap');
const promocode_discount = 0.15;
const basket_wrap = document.querySelector('#basket');
const promocodes = ['dmoneone'];
let flag = false;
let cost;
let basket = [];
let all_prices = [];
let savedItems = localStorage.getItem("basket");
let savedPrices = localStorage.getItem("prices array");
//addToDOM
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
    button.innerHTML = "Add";
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
    quantity.setAttribute('data-id', link.id);
    item_block.appendChild(cost);
    item_block.appendChild(dollar);
    item_block.appendChild(img);
    item_block.appendChild(sex);
    item_block.appendChild(model);
    item_block.appendChild(quantity);
    item_block.appendChild(button);
    items_basket.appendChild(item_block);
}

const sumPrices = arr => {
    return arr.reduce((prev,current) => prev + current);       
}

const addToBasket = arr => {
    let id = event.target.getAttribute('data');
    for ( let i = 0; i < arr.length; i++ ) {
        if ( arr[i].id == id) {
			let item = arr[i].descr,
				ItemInBasket = -1;
            all_prices.push(item.cost);
            localStorage.setItem('prices array', JSON.stringify(all_prices));
            document.querySelector('#allPrice').innerHTML = sumPrices(all_prices);
			for ( let j = 0; j < basket.length; j++ ) {
				if(basket[j].id == id) ItemInBasket = j;
			}

            if ( ItemInBasket < 0 ) {
                addItemsToBasket(item);
                basket.push(item);
            } else {
				document.querySelector(`span[data-id="${id}"]`).textContent = ++basket[ItemInBasket].count; 
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

if ( savedPrices != undefined ) {
   savedPrices = JSON.parse(savedPrices);
   all_prices = savedPrices;
   document.querySelector('#allPrice').innerHTML = sumPrices(all_prices);  
}

const buyItems = () => {
    setTimeout(() => {
       let val = document.querySelector('#in').value;
       for ( let i = 0; i < promocodes.length; i++ ) {
           if (promocodes[i] == val) {
               cost = sumPrices(all_prices) - ( sumPrices(all_prices) * promocode_discount );
           }
           else {
               cost = sumPrices(all_prices) 
           }
       }
       document.querySelector('#cost').innerHTML = cost;
       document.querySelector('.succsseful-block').style.display = 'block'; 
       //Отправляем на сервак
       console.log(basket)  
    },1000)
}

const cleanItems = () => {
    while (items_basket.firstChild) {
        items_basket.removeChild(items_basket.firstChild);
    } 
    basket = [];
    all_prices = [];
    localStorage.setItem('prices array', JSON.stringify(all_prices));
    localStorage.setItem("basket", JSON.stringify(basket));    
    document.querySelector('#allPrice').innerHTML = 0;
    localStorage.removeItem("basket");
    localStorage.removeItem('prices array');
}


const showBasket = () => {
    if ( flag == false ) {
       flag = true;
       basket_wrap.style.right = 0 + "px"; 
    }
    else{
       basket_wrap.style.right = -500 + "px"; 
       flag = false;
    }
}
const hideSuccsefulBlock = () => {
    document.querySelector('.succsseful-block').style.display = 'none'; 
    cleanItems();
    
}

const main = response => {
    
    for ( let i = 0; i < response.length; i++ ) {
        addItemsToDOM(response[i]);
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
                        localStorage.setItem("basket", JSON.stringify(arr));
                        let ret = [];;
                        while(all_prices.indexOf(item.cost) != -1){
                            ret.push( all_prices.indexOf(item.cost) );
                            all_prices.splice(all_prices.indexOf(item.cost), 1);
                        }
                        localStorage.setItem('prices array', JSON.stringify(all_prices));
                        if (all_prices.length > 0 ) document.querySelector('#allPrice').innerHTML = sumPrices(all_prices);
                        else{
                           document.querySelector('#allPrice').innerHTML = 0;  
                           localStorage.removeItem("basket");
                           localStorage.removeItem('prices array');
                        } 
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

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener('mousemove', () => {
        if ( items_basket.childNodes.length > 0) {
           document.getElementById('buy-items').style.opacity = '1';
           document.getElementById('clean-items').style.opacity = '1';
           document.getElementById('in').style.opacity = '1';
           document.querySelector('.full-basket').style.opacity = '1';
        }
        else{
           document.getElementById('buy-items').style.opacity = '0';
           document.getElementById('clean-items').style.opacity = '0';
           document.getElementById('in').style.opacity = '0'; 
           document.querySelector('.full-basket').style.opacity = '0';
        }
    })
    document.getElementById('buy-items').addEventListener('click', buyItems);
    document.getElementById('clean-items').addEventListener('click', cleanItems);
    document.getElementById('basket-button').addEventListener('click', showBasket);
    document.getElementById('ok').addEventListener('click', hideSuccsefulBlock)
});
