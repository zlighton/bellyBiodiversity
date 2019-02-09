function buildMetadata(sample) {
    
  console.log(sample);

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.json("/metadata/" + sample).then((metaData) => {
      var panel = d3.select("#sample-metadata");
      console.log(metaData);
      panel.html('')
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metaData).forEach(([key, value]) => {
      var div = panel.append("div");
      div.style("word-wrap", "break-word");
      div.html("<b>"+ key +"</b>:<br>&nbsp;&nbsp;" + value);
    });
  });
};

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  console.log(sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((sampleData) => {

    // @TODO: Build a Bubble Chart using the sample data
    var traceBubble = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      type: "scatter",
      marker: {
        color: sampleData.otu_ids,
        size: sampleData.sample_values
      }
    };

    // Create the data array for the plot
    var dataBubble = [traceBubble];

    // Define the plot layout
    var layoutBubble = {
      title: "",
      xaxis: { title: "OUT ID" },
      yaxis: { title: "" }     
    };

    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log(sampleData)        
    console.log(sampleData.sample_values)
    console.log(sampleData.sample_values.slice(0,10))
 
    var tracePie = {
      type: "pie",
      values: sampleData.sample_values.slice(0,10),
      labels: sampleData.otu_ids.slice(0,10),
      text: sampleData.otu_labels,
    };

    // Create the data array for the plot
    var dataPie = [tracePie];

    // Define layout
    var layoutPie = {
      margin: {
        t: 10, //top margin
        l: 10, //left margin
        r: 10, //right margin
        b: 10 //bottom margin
        },
      legend: {
        x: 100,
        y: .9
      }
    };

    Plotly.newPlot("pie", dataPie, layoutPie);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();