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
    console.log(data);
    //  Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    
    var metaArray = metadata.filter((data) => data.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultArray[0]

    // Create a variable that holds the first sample in the metadata array.
    var metaResult = metaArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Create a variable that holds the washing frequency.
    var wfreq = metaResult.wfreq;


    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map((element) => `OTU ${element}`).reverse();
    console.log(yticks)
    var top10_otu_labels = otu_labels.slice(0,10).reverse();
    console.log(yticks)
    var top10_sample_values = sample_values.slice(0,10).reverse();

    // Create the trace for the bar chart. 
    var barData = {
      x: top10_sample_values,
      y: yticks,
      text: top10_otu_labels,
      type: 'bar',
      orientation: 'h'
    };

    var data = [barData];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found",
      "titlefont": {"size": 20},
      font: {
        family: 'Courier Prime, monospace'
      },
      width: 400,
      height: 400,
      margin: {
        l: 100,
        r:100,
        t:100,
        b:30
      },
      plot_bgcolor: "aqua",
      paper_bgcolor:"aqua"

    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",data, barLayout);
    
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      "titlefont": {"size": 20},
      font: {
        family: 'Courier Prime, monospace'
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      plot_bgcolor: "aqua",
      paper_bgcolor:"aqua"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)

    // Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      title: {text: "Belly Button Washing Frequency", font: {size: 20, family: 'Courier Prime, monospace'} },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ],
        threshold: {
          line: { color: "black", width: 4 },
          thickness: 0.2,
          value: 490}
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" },
      plot_bgcolor: "aqua",
      paper_bgcolor:"aqua"
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });

}
