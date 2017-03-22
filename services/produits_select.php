<?php include( "../php/connect.php"); ?>
<?php
sleep( 2);
//récupération de la  catégorie sélectionnée
$strXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
$strXml .= "<produits>";

$strHtml = '<table width="100%" class="produits"><tr><th scope="col">id</th><th scope="col">cat</th><th scope="col">Produit</th><th scope="col">Prix</th><th scope="col">Photo</th></tr>';

$strJson = "[";

//parametre format
$prm_format = "html";

if( isSet( $_GET['format'])) {
	$prm_format = $_GET['format'];
}


$prm_id_cat = "";

if( isSet( $_GET['id_cat'])) {
	$prm_id_cat = $_GET['id_cat'];
}

//- listing produit -
//---------------------
$req = "SELECT * FROM produits";
$req_where = "";

//si une catégorie est sélectionnée
if( ( $prm_id_cat != "") && ( $prm_id_cat != "0"))
{
	$req_where = $req_where." WHERE id_categorie = ".$prm_id_cat;
}

//si on recherche par id
$prm_id = "";
if( isSet( $_GET['id'])) {
	$prm_id = $_GET['id'];
}

if( $prm_id != "")
{
	if( $req_where == "") $req_where = " WHERE id = ".$prm_id;
	else $req_where = $req_where." AND id = ".$prm_id;
}

//si on recherche une chaine
$prm_search = "";
if( isSet( $_GET['search'])) {
	$prm_search = $_GET['search'];
}

if( $prm_search != "")
{
	if( $req_where == "") $req_where = " WHERE nom LIKE '%".$prm_search."%'";
	else $req_where = $req_where." AND nom LIKE '%".$prm_search."%'";
}

//si on recherche une chaine au début
$prm_begin = "";
if( isSet( $_GET['begin'])) {
	$prm_begin = $_GET['begin'];
}

if( $prm_begin != "")
{
	if( $req_where == "") $req_where = " WHERE nom LIKE '".$prm_begin."%'";
	else $req_where = $req_where." AND nom LIKE '".$prm_begin."%'";
}


// génération de la liste des produits
$req = $req.$req_where;
//echo( $req);//!debug!
$res = mysql_query( $req, $connexion);
	
if( mysql_numrows( $res))
{
	for( $i = 0; $i < mysql_numrows($res); $i++)
	{
		$rcd = mysql_fetch_array ($res);
		
		$strXml .= "<produit>";
		$strXml .= "<id>".$rcd["id"]."</id>";
		$strXml .= "<id_cat>".$rcd["id_categorie"]."</id_cat>";
		$strXml .= "<nom>".$rcd["nom"]."</nom>";
		$strXml .= "<desc>".$rcd["desc"]."</desc>";
		$strXml .= "<prix>".$rcd["prix"]."</prix>";
		$strXml .= "<image>".$rcd["image"]."</image>";
		$strXml .= "</produit>";
		
		$strHtml .= "<tr>";
		$strHtml .= "<td>".$rcd["id"]."</td>";
		$strHtml .= "<td>".$rcd["id_categorie"]."</td>";
		$strHtml .= "<td><span class=\"produit\" id=\"prod".$rcd["id"]."\">".$rcd["nom"]."</span></td>";
		$strHtml .= "<td>".$rcd["prix"]." &#x20AC;</td>";
		$strHtml .= "<td><img title=\"".$rcd["desc"]."\" src=\"/".$rcd["image"]."\" alt=\"".$rcd["nom"]."\" /></td>";
		$strHtml .= "</tr>";

		if( 0 != $i) $strJson .= ",";		
		$strJson .= "{\"id\":".$rcd["id"];
		$strJson .= ",\"id_cat\":".$rcd["id_categorie"];
		$strJson .= ",\"prix\":".$rcd["prix"];
		$strJson .= ",\"nom\":\"".$rcd["nom"]."\"";
		$strJson .= ",\"desc\":\"".$rcd["desc"]."\"";
		$strJson .= ",\"image\":\"".$rcd["image"]."\"}";
	}
}

$strXml .= "</produits>";
$strHtml .= "</table>";
$strJson .= "]";

$header = 'Content-Type: text/html';
$data = $strHtml;

if( 'xml' == $prm_format) {
	$header = 'Content-Type: text/xml';
	$data = $strXml;
} else if( 'json' == $prm_format) {
	$header = 'Content-Type: application/json';
	$data = $strJson;
}

header( $header);

echo( utf8_encode( $data));
?>
