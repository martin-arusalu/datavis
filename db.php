<?php
try {
    $db = new PDO('mysql:host=d61356.mysql.zonevs.eu;dbname=d61356_fairtrade', 'd61356_martin', 'Ukuaru1234');
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}