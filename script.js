
var svg;
var toToggle;
var countries;
var countriesData;

window.addEventListener("load", function () {
  
  // Get svg and countries
  svg = Snap("#africaSvg");
  countries = svg.selectAll("#ivorycoast, #ghana, #nigeria, #cameroon, #uganda, #togo, #sierraleone, #madagascar");

  // What to hide/show;
  toToggle = svg.selectAll("#ivorycoast, #ghana, #nigeria, #cameroon, #uganda, #togo, #sierraleone, #madagascar, #africa");

  // Get data
  fetch('data.php?action=workers')
    .then(e => e.json())
    .then(showData);
});

function showData(data) {
  countriesData = data;
  data.forEach(function (e, index) {
    
    // Colours of the areas depending on it's production amount
    var countryPathId = "#" + e.country.replace(/ /g, '').toLowerCase() + " path";
    var a = Math.floor(30 - e.productionAmount / 20000);
    svg.select(countryPathId).node.style = "fill: rgb(" + (a+30) + "," + (a + 10) + "," + a + ")";

    // Country comparison
    svg.select("#country" + (index + 1) + " .countryname").attr("text", e.country);
    svg.select("#country" + (index + 1) + " .percentage").attr("text", e.workerAmount + " %");
    var bar = svg.select("#country" + (index + 1) + " .bar");
    bar.node.style = "fill: rgb(" + (a+30) + "," + (a + 10) + "," + a + ")";
    bar.animate({width: e.workerAmount*20}, 500*(8-index), mina.elastic);
  });

  // Clear data;    
  svg.selectAll("#bigcountryname, #populationplaceholder, #productionplaceholder, #incomeplaceholder, #percentageplaceholder").forEach(function (e) {
    e.node.classList.add("doNotShow");
  });

  // Actions
  createEventListeners();
}

function createEventListeners() {
  
  // For every area
  countries.forEach(function (country) {
    
    // When mouse hovers an area
    country.node.addEventListener('mouseover', function () {

      // If it's not already enlarged
      if (!country.node.classList.contains('big')) {

        // Search for the selected country's data        
        c = countriesData.find(x => x.country.replace(/ /g, '').toLowerCase() === country.node.id);

        // Replace the data in text containers
        svg.select("#bigcountryname").attr("text", c.country);
        svg.select("#populationplaceholder").attr("text", (Math.round(c.population/100000) / 10) + " mil");
        svg.select("#productionplaceholder").attr("text", c.productionAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " tons");
        svg.select("#incomeplaceholder").attr("text", c.averageIncome + " $");
        svg.select("#percentageplaceholder").attr("text", c.workerAmount + " %");

        // Emphasize the country in comparison list        
        svg.selectAll(".countryname").forEach(function (element) {
          if (element.attr('text') == c.country) {
            element.node.classList.add('slightlyBigger');
          } else {
            element.node.classList.remove('slightlyBigger');
          }
        });

        //Show data
        svg.selectAll("#bigcountryname, #populationplaceholder, #productionplaceholder, #incomeplaceholder, #percentageplaceholder").forEach(function (e) {
          e.node.classList.remove("doNotShow");
          e.node.classList.add("show");
        });

        // Make all countries small    
        countries.forEach(function (oe) { makeSmall(oe); });

        // Make selected country big        
        makeBig(country);
        
        // Hide all other elements
        toToggle.forEach(function (otherCountry) {

          // Except for the selected country
          if (otherCountry != country) {
            otherCountry.node.classList.remove('show');
            otherCountry.node.classList.add('doNotShow');
          }
        });

        // Just for marking selected area
        country.node.classList.toggle('big');
      }
    });

    // When mouse leaves the area    
    country.node.addEventListener('mouseout', function () {
      
      // Check if it's the selected one
      if (country.node.classList.contains('big')) {

        // Clear data;    
        svg.selectAll("#bigcountryname, #populationplaceholder, #productionplaceholder, #incomeplaceholder, #percentageplaceholder").forEach(function (e) {
          e.node.classList.remove("show");
          e.node.classList.add("doNotShow");
        });

        // Make the element normal size again        
        makeSmall(country);

        // Make list normal again
        svg.selectAll(".countryname").forEach(function (element) {
          element.node.classList.remove('slightlyBigger');
        });

        // Show all elements        
        toToggle.forEach(function (otherCountry) {
          otherCountry.node.classList.add('show');
          otherCountry.node.classList.remove('doNotShow');
        });

        // Just for marking selected area 
        country.node.classList.toggle('big');
      }
    });
  });
  
  // After everything is done, show svg
  svg.node.classList.add("appear");
}

function makeSmall(country) {
  
  // Scale it back to normal
  country.animate({ transform: 'scale(1, 1, 1)' }, 500, mina.elastic);
  country.select('path').animate({ strokeWidth: 1 }, 500, mina.elastic);
}

function makeBig(country) {

  // Scale it up
  country.animate({ transform: 'scale(6, 6, 1)' }, 500, mina.elastic);
  country.select('path').animate({ strokeWidth: 0.3 }, 500, mina.elastic);
}