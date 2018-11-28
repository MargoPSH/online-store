class Cart {
    constructor(source = 'json/cart.json', container = '#basket') {
        this.source = source;
        this.container = container;
        this.countGoods = 0;
        this.amount = 0;
        this.basketItems = [];
        this._init(source);
    }

    _render() {
        let $cartContentDiv = $('<div/>', {
            class: 'cart-content'
        });        
        let $cartTotal = $('<div/>', {
            class: 'total'
        });
        let $cartBtnForm = $('<form/>', {
            action: '#',
            class: 'cart-btn'
        });
        $cartBtnForm.append('<button>checkout</button>');
        $cartBtnForm.append('<button>go to cart</button>');
        $cartContentDiv.append($cartTotal);
        $cartContentDiv.append($cartBtnForm);
        $(this.container).append($cartContentDiv);
        $('<span>TOTAL</span>').appendTo($cartTotal);
        $('<span class="total-sum"></span>').appendTo($cartTotal);
    }

    _init(source) {
        this._render();
        fetch(source)
        .then(result => result.json())
        .then(data => {
            for(let product of data.contents) {
                this.basketItems.push(product);
                this._renderItem(product);
            }
            this.countGoods = data.countGoods;
            this.amount = data.amount;
            this._renderSum();
        });
    }

    _renderItem(product) {
        let $position = $('<div/>', {
            class: 'position'
        });
        let $hrefProduct = $('<a/>', {
            href: '#',
            'data-product': product.id_product
        });
        let $fotoDiv = $('<div/>', {
            class: 'foto'
        });
        let $imgFotoDiv = $('<img>', {
            src: product.img,
            alt: product.name_product
        });
        let $fotoTextDiv = $('<div/>', {
            class: 'foto-text'
        });
        let $nameFoto = $('<p/>', {
            text: product.name_product
        });
        let $starsDiv = $('<div/>', {
            class: 'stars-fa-fw'
        });
        let $crossDiv = $(`<div/>`, {
            class: 'cross'
        });
        
        $starsDiv.append(`<i class="fa fa-star fa-fw" aria-hidden="true"></i>
        <i class="fa fa-star fa-fw" aria-hidden="true"></i>
        <i class="fa fa-star fa-fw" aria-hidden="true"></i>
        <i class="fa fa-star fa-fw" aria-hidden="true"></i>
        <i class="fa fa-star fa-fw" aria-hidden="true"></i>`);
        $fotoTextDiv.append($nameFoto);
        $fotoTextDiv.append($starsDiv);
        $fotoTextDiv.append(`<span>${product.quantity} x $${product.price}</span>`);
        $fotoDiv.append($imgFotoDiv);
        $hrefProduct.append($fotoDiv);
        $hrefProduct.append($fotoTextDiv);
        $position.append($hrefProduct);  
        $crossDiv.append('<i class="fa fa-times" aria-hidden="true"></i>');
        $position.append($crossDiv);
        $crossDiv.on('click', event => {
            this._removePosition(product.id_product);
        });
        $('.cart-content').prepend($position);
    }
    
    _renderSum() {
        $('.total-sum').text(`$${this.amount}.00`);
        $('.countGoods').text(`${this.countGoods}`);
    }

    addToCartProduct(elem) {
        let idProduct = +$(elem).data('id');
        let find = this.basketItems.find(product => product.id_product === idProduct);
        if(find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: idProduct,
                name_product: $(elem).data('name'),
                img: $(elem).data('img'),
                price: $(elem).data('price'),
                quantity: 1
            };
            this.basketItems.push(product);
            this.countGoods += product.quantity;
            this.amount += product.price;
            this._renderItem(product);
        }
        this._renderSum();        
    }

    _updateCart(product) {
        let $position = $(`a[data-product="${product.id_product}"]`);
        $position.find('.foto-text span').text(`${product.quantity} x $${product.price}`);
    }

    _removePosition(idProduct) {
        let find = this.basketItems.find(product => product.id_product === idProduct);
        this.amount -= find.quantity * find.price;
        this.countGoods -= find.quantity;
        let $position = $(`a[data-product="${idProduct}"]`);
        this.basketItems.splice(this.basketItems.indexOf(find), 1);
        $position.parent().remove();
        this._renderSum();
    }
}