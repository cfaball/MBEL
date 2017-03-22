function Product( product) {

	this.constructor.nb++;

	//initialisation
	if( null == product){
		product = {};
	}

	//propriétés publique
	this.id = product.id || Product.DEFAULT_ID;
	this.name = product.name || product.nom || Product.DEFAULT_NAME;
	this.desc = product.desc || Product.DEFAULT_DESC;
	this.image = product.image || Product.DEFAULT_IMG;
	this.price = product.price || product.prix || Product.DEFAULT_PRICE;

	//méthodes privées
	function checkIdCat( id) {
		var _r = id;

		if( 0 == Product.CATEGORIES.filter(function(cat){
			return cat.id === id;
		}).length) {
			_r = Product.CATEGORIES[0].id;
		}

		return _r;
	}


	function notFound() {
		'Produit non trouvé !'.debug();
	}

	//propriétés privées
	var _id_cat = checkIdCat( product.id_cat);
	this.id_cat = _id_cat;//trick / hack

	//méthode publiques

	//setters / getters
	this.idCat = function( idCat) {
		if( null != idCat) {
			this.id_cat = _id_cat = checkIdCat( idCat);
		}
		return _id_cat;
	}

	//utils
	this.fillForm = function() {
		$('#id').val(this.id);
		$('#id_cat').val(this.id_cat);
		$('#nom').val(this.name);
		$('#name').val(this.name);
		$('#prix').val(this.price);
		$('#price').val(this.price);
		$('#desc').val(this.desc);
		$('#image').val(this.images);

	}

	this.category = function() {
		return Product.CATEGORIES.filter(function(cat){
			return cat.id === _id_cat;
		})[0].name;
	}

	this.log = function() {
		console.log( JSON.stringify( this));
	}


	//REST API
	this.get = function( success) {
		$.get({
			url: Product.SERVICE_PATH + '/'+this.id
			 // , success: function(data){
			 // 	console.log(data);
			 // 	if( null == success){ success( data)};
			 // }

			, success: (function(_this){ return function(data){
				
				_id_cat = data.id_cat;
				_this.id_cat = _id_cat;
				_this.name = data.nom;
				_this.price = data.prix;
				_this.desc = data.desc;
				_this.image = data.image;
				if( null != success) success( _this);

			}})(this)
			, statusCode: {
				404: notFound
			}
		});
	}

	this.delete = function( success) {
		$.ajax({
			url: Product.SERVICE_PATH + '/'+this.id
			, method: 'DELETE'
			, success: success
			, statusCode: {
				404: notFound
	//			,403: accesInterdit
			}
		});
	}

	this.update = function( success) {
//		var _data = {};
//		if( null != settings.data.id) _data.id = settings.data.id;//si on travaille avec un objet settings sans une ProductsAPI
		$.ajax({
			url: Product.SERVICE_PATH + '/'+this.id
			, method: 'PATCH'
			, data: JSON.stringify({
				id_cat:_id_cat
				,nom:this.name
				,prix:this.price
				,desc:this.desc
				,image:this.image
			})
			, headers: {'Content-Type':'application/json'}
			, success: success
			, statusCode: {
				404: notFound
	//			,403: accesInterdit
			}
		});
	}

	//destructeur
	this.destroy = function() {
		this.constructor.nb--;
		delete this;//pas bien !
	}
}

//variables de classe
Product.SERVICE_PATH = 'http://localhost:3000/produits';
Product.nb = 0;
Product.DEFAULT_ID = 0;
Product.DEFAULT_NAME = 'Inconnu';
Product.DEFAULT_DESC = '';
Product.DEFAULT_IMG = '/images/Products/default.jpg';
Product.DEFAULT_PRICE = 0.00;
Product.CATEGORIES = [
    {id:1,name:'Alimentation'}
    ,{id:2,name:'Petit électro'}
    ,{id:3,name:'Gros électro'}
    ,{id:4,name:'Jardin'}
];

Product.create = function(product,success) {
	$.ajax({
		url: Product.SERVICE_PATH
		, method: 'POST'
		, data: JSON.stringify({
			id_cat:product.id_cat
			,nom:product.name||product.nom
			,prix:product.price||product.prix
			,desc:product.desc
			,image:product.image
		})
		, headers: {'Content-Type':'application/json'}
		, success: function(data){if( null != success){success((new Product(data)));}}
	});
}

//******************
//* CLASS PRODUCTS *
//******************
function Products( products) {

	this.list = [];
	if( null == products){
		products = [];
	}


	function fillList(prods) {
		this.list = prods.map(function(p){return (new Product(p))});
	}
	fillList.call(this,products);

	this.get = function( success) {
		var fonctionSuccessAutoGeneree = (function(_this){return function(data){
			fillList.call(_this,data);
			if( null != success) success(_this);
		}})(this);
		console.log( fonctionSuccessAutoGeneree.toString());

		$.get(
			Product.SERVICE_PATH
			,fonctionSuccessAutoGeneree
		);


		// $.get(
		// 	Product.SERVICE_PATH
		// 	,(function(_this){return function(data){
		// 	fillList.call(_this,data);
		// 	if( null != success) success(_this);
		// }})(this));
	}

	this.render = function() {
		var _nb = this.list.length;
		var _html = '<div class="produits">';
		for( var i = 0; i < _nb; i++) {
			var _produit = this.list[i];
			_html += Boutique.FRAGMENT_PRODUIT
			.replace( '{{id}}', _produit.id)
			.replace( '{{nom}}', _produit.name)
			.replace( '{{prix}}', _produit.price)
			.replace( '{{desc}}', _produit.desc)
		}
		_html += '</div>';
		return _html;
	}
}


//************
//* TESTEURS *
//************
function testProduct() {
	console.error( 'nb produit 0 = ' + Product.nb);
	var _p1 = new Product();
	console.error( 'nb produit 1 = ' + Product.nb);
	var _p2 = new Product({id_cat:2,nom:'Fer à friser !',prix:39.99});
	console.error( 'nb produit 2 = ' + Product.nb);
	var _p3 = new Product({id_cat:5,name:'Test !',desc:'test',price:12.25});
	console.error( 'nb produit 3 = ' + Product.nb);

	console.warn( '_p1.name = ' + _p1.name);
	console.warn( '_p1._id_cat = ' + _p1._id_cat);
	console.warn( '_p1.idCat() = ' + _p1.idCat());
	_p1.idCat(3);
	console.warn( '_p1.idCat() after 3 = ' + _p1.idCat());
	console.warn( '_p1.category() after 3 = ' + _p1.category());
	_p1.idCat(7);
	console.warn( '_p1.idCat() after 7 = ' + _p1.idCat());
	console.info( '_p1 en JSON = ' + JSON.stringify(_p1));

	console.warn( '_p2.name / _p2.idCat() / _p2.price = ' + _p2.name + '/' + _p2.idCat() + '/' + _p2.price);
	console.warn( '_p3.name / _p3.idCat() / _p2.price = ' + _p3.name + '/' + _p3.idCat() + '/' + _p3.price);

	_p2.destroy();
	console.error( 'nb produit 4 = ' + Product.nb);
}
//testProduct();
