<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);

$connexion = mysql_pconnect( 'localhost', 'root', '');
if(!$connexion)
{
	header('Location: http://localhost/erreurs/nodb.html');
}
	
if( !mysql_select_db ('commerce', $connexion))
{
	header('Location: http://localhost/erreurs/nodb.html');
}
?>