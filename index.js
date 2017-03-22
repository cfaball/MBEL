$(document).ready( init);

function init() {
//	debug( 'index ok !');//version fonctionnelle
//	'index ok 2 !'.debug();//version objet
//	'index ok 2 !'.debug.debug();
//	debug( 1+1);
//	debug( 1+'1');
//	debug( 1+(1).toString());
	$('header ul.menu li a').click( gererMenu);
	$('#menuAccueil').click( chargerAccueil);
	$('#menuBoutique').click( chargerBoutique);
//	Product.create({id_cat:1,prix:5.55,nom:'Pêches du Roussillon',desc:'Sans doute les meilleures pêches du monde',image:''},function(objProduct){objProduct.log()});
}

function chargerAccueil() {
	$.get( 'accueil-fragment.html', afficherAccueil);
}

function afficherAccueil( data) {
	$('article').html( data);
}

function chargerBoutique() {
//	$.get( 'js/model/produits.json', afficherBoutique);//mock local
//	$.get( 'http://localhost:3000/produits', afficherBoutique);//version manuelle
	//version classe
	var _objProducts = new Products();
	_objProducts.get( afficherBoutiqueFromProducts);
}

function afficherBoutiqueFromProducts( objProducts) {
	$('article').html( objProducts.render());
	$('article .produits .icon.delete').click( supprimerProduit);
	$('article .produits .icon.form').click( chargerFormulaire);
}

function chargerFormulaire() {
	var _idHTML = $(this).parent().parent().attr('id');
	var _id = _idHTML.substr(7);

	$.get( 'formulaire-produit-fragment.html'
		, function(data){afficherFormulaire(data,_id);}
	);
}

function afficherFormulaire( data, id) {
	$('article').html( data);
	var _p = new Product( {id: id});

	//get V1 - Classe ORM+API
	_p.get(
	 	function(data){
	 		data.fillForm();

	 		//gestion du bouton delete
	 		$('#delete').click(
	 			function(){ data.delete();}
	 		);

	 		//gestion du bouton save
	 		$('#enregistrer').click(
	 			function(ev){
	 				ev.preventDefault();
	 				var _prodToSave = new Product(
	 					{
	 						id: $('#id').val()
	 						, id_cat: parseInt( $('#id_cat').val())
	 						, price: parseFloat( $('#prix').val())
	 						, desc: $('#desc').val()
	 						, image: $('#image').val()
	 						, name: $('#nom').val()
	 					}
	 				);

	 				_prodToSave.update();
	 			}
	 		);

	 		//gestion du bouton reset
	 		//...

	 		// console.log(	 			
	 		// 	JSON.stringify(
	 		// 		data
	 		// 	)
	 		// );
	 	}
	);


	//get V2 - ProductsAPI.get sample
	// _p.get(
	//  	function(data){
	//  		var _p2 = (new Product( data));
	//  		console.log(	 			
	//  			JSON.stringify(
	//  				_p2
	//  			)
	//  		);
	//  	}
	// );
	
}

function afficherBoutique( data) {
	var _nb = data.length;
	var _html = '<div class="produits">';
	for( var i = 0; i < _nb; i++) {
		var _produit = data[i];
		// if( 0 == i) {
		// 	var _p = new Product(_produit);
		// 	_p.idCat( 4);
		// 	_p.update(function(){console.log('produit modifié !');});
		// }

		_html += Boutique.FRAGMENT_PRODUIT
			.replace( '{{id}}', _produit.id)
			.replace( '{{nom}}', _produit.nom)
			.replace( '{{prix}}', _produit.prix)
			.replace( '{{desc}}', _produit.desc)
	}
	_html += '</div>';

	//les produits apparaissent
	$('article').html( _html);

	//initialisation des événements des produits
	$('article .produits .delete').click( supprimerProduit);
}

function supprimerProduit() {
//	var _id = $(this).parent('div.produits').attr('id').substr(7);
	var _idHTML = $(this).parent().parent().attr('id');
	var _id = _idHTML.substr(7);
//	_id.debug();

	(new Product({id:_id})).delete(function(){supprimerHTMLProduit(_idHTML);});
/*
	$.ajax({
		url: 'http://localhost:3000/produits/'+_id
		, method: 'DELETE'
		, success: function(){supprimerHTMLProduit(_idHTML);}
		, statusCode: {
			404: produitNonTrouve
//			,403: accesInterdit
		}
	});
*/
}

function supprimerHTMLProduit(id) {
	$('#'+id).remove();
}


function gererMenu( ev) {
	ev.preventDefault();

	$('a.actif').removeClass('actif');
	$(this).addClass('actif');
}