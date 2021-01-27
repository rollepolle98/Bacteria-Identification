function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // Create the buildCharts function.
  function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var organismData = data.samples;
     
      var organismArray = organismData.filter(sampleObj => sampleObj.id == sample);
      // Create a variable that holds the first sample in the array.
      var organism = organismArray[0];
      // console.log(organism)
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var organismIDs = organism.otu_ids;
      var organismLabels = organism.otu_labels;
      var organismValues = organism.sample_values;

      var wfreq = metaResult.wfreq;

      // Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var ybar = organismIDs.slice(0,10).reverse().map(idText => `OTU ${idText}`);
      console.log(ybar);
      var xbar = organismValues.slice(0,10).reverse();
      console.log(xbar);
      var barlabels = organismLabels.slice(0,10).reverse();
  
      // Create the trace for the bar chart. 
      var barData = [{
        x:xbar,
        y:ybar,
        name: "Bacteria",
        text: barlabels,
        type: "bar",
        orientation: "h"
      }];
      // Create the layout for the bar chart. 
      var barLayout = {
        title: '<b>Top 10 Bacteria Cultures Found'
       
      };
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
      // Create the trace for the bubble chart.
      var bubbleData = [{
        x: organismIDs,
        y: organismValues,
        mode: 'markers',
        marker: {
          color:organismIDs,
          colorscale:'Earth',
          size:organismValues
        },
        text:organismLabels
  
      }];
  
      // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "<b>Bacterial Cultures Per Sample",
        xaxis: {title:'OTU ID'},
        hovermode:'closest'
      };
  
      // Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout)
      
      // Create a variable that filters the metadata array for the object with the desired sample number.
      // Create a variable that holds the first sample in the metadata array.
      var wfreqArray = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
      // console.log(wfreqArray)
  
      // Create a variable that holds the washing frequency.
      var washfreq = wfreqArray.wfreq;
      // console.log(washfreq)
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: washfreq,
        type: 'indicator',
        mode: 'gauge+number',
        title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week'},
        gauge: {
          axis: {
            range:[0,10],
            tickmode:'array',
            tickvals: [0,2,4,6,8,10]},
          bar: {color:'black'},
          steps: [
            {range:[0,2],color:'blue'},
            {range:[2,4],color:'purple'},
            {range:[4,6],color:'orange'},
            {range:[6,8],color:'green'},
            {range:[8,10],color:'blue'}]},
  
      }];
      
      // Create the layout for the gauge chart.
      var gaugeLayout = { width: 600,
      height: 500,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" },
      plot_bgcolor: "purple",
      paper_bgcolor:"purple"
    
      };
  
      // Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);    
    });
  }