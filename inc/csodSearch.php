<?php
spl_autoload_register(function ($classname) {
    require 'classes/' . str_replace('\\', '/', $classname) . '.php';
});

use CSODRestAPI as CSODRestAPI;
$csodApi = new CSODRestAPI();
$csodGlobals = $csodApi->getCsodGlobals();
$q = $_POST['q'];

header('Content-Type: application/json');
echo json_encode(array('status' => 'success','message' => 'This worked the query was: ' . $q . ', APIKEY=' . $csodGlobals['csodApiID']));