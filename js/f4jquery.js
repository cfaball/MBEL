Boutique = {
	version: '2.0',
	title: 'Ma Boutique en ligne !'
};

Boutique.DEBUG_MODE = true;
//Boutique.DEBUG_MODE = true;

Boutique.FRAGMENT_PRODUIT = '<p id="prod-p-{{id}}">{{nom}}</p>';
$.get( 'produit-fragment.html', function(data){Boutique.FRAGMENT_PRODUIT = data;});

String.prototype.debug = Function.prototype.debug = (function(dm) {if( dm){return function(){ alert(this)};}else{return function(){ console.log(this)};}})(Boutique.DEBUG_MODE);

/*
String.prototype.debug = Function.prototype.debug = (function(dm) {
	if( dm) {
		return fabriquerAlert();
	} else {
		return fabriquerLog();
	}
})(Boutique.DEBUG_MODE);

function fabriquerLog() {
	return function() { console.log(this)};
}

function fabriquerAlert() {
	return function() { alert(this)};
}
*/
function debug( s) {
	if( Boutique.DEBUG_MODE) {
		alert( s);
	} else {
		console.log(s);
	}
}