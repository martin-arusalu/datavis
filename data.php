<?php

// Is something asked
if (isset($_GET['action'])) {
  
  // Initiate connection
  include "db.php";
  
  $stm = "";

  // What to do
  switch ($_GET['action']) {
  case "countries":
    $stm = "SELECT country, continent, population, amount, description
        FROM area a
        JOIN production p ON p.area_id = a.id
        JOIN product_type pt ON pt.id = p.product_type_id
        ORDER BY country;";
    break;
  case "workers":
    $stm = "SELECT
      average_income as averageIncome,
      w.amount as workerAmount,
      country,
      continent,
      population,
      p.amount as productionAmount,
      pt.description as productTypeDescription,
      wt.description as workerTypeDescription 
      FROM worker w
      JOIN area a ON a.id = w.area_id
      JOIN production p ON p.area_id = a.id
      JOIN product_type pt ON pt.id = p.product_type_id
      JOIN worker_type wt ON wt.id = w.worker_type_id
      WHERE wt.id = 1
      ORDER BY workerAmount DESC;";
      break;
  default:
    $stm = "SELECT country FROM area;";
  }

  // Execute query
  $query = $db->prepare($stm);
  $query->execute();
  $results=$query->fetchAll(PDO::FETCH_ASSOC);

  // Return results
  echo json_encode($results);
}