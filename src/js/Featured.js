class Featured {
    constructor(container = ".featured") {
        this.container = container;
        this.source = 'json/products.json';
        this._init(this.source);
    }

    _init(source) {
        fetch(source)
        .then(result => result.json())
        .then(data => {
            for (let item of data.products) {
                this._renderFeaturedItems(item);
            }
        });
    }
    _renderFeaturedItems(item) {
        let $featuredItem = $('<div/>', {
            class: 'featured__item',
        });
        let $btnCartNow = $('<button/>', {
            class: 'cart-now',
            text: 'Add to cart',
            'data-id': item.id_product,
            'data-name': item.name_product,
            'data-img': item.src,
            'data-price': item.price,
        });
        let $imgBtn = $('<img>', {
            src: 'img/curt-now.png',
            alt: 'cart-now',
        });
        $imgBtn.prependTo($btnCartNow);

        let $featuredItemImg = $('<img>', {
            src: item.src,
            class: item.class,
            alt: item.alt,
        });
        $featuredItem.append($btnCartNow);
        $featuredItem.append($featuredItemImg);
        $featuredItem.append($('<p/>', {
            text: item.name_product,
        }));
        $featuredItem.append($(`<p><span>$ ${item.price}.00</span></p>`));
        $featuredItem.appendTo($(this.container));        
    }
}
