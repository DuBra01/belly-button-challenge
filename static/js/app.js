// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Log the full metadata to inspect structure
    console.log("Full Metadata:", data.metadata);

    // Get the metadata field
    let metadata = data.metadata;

    // Filter for the object matching the selected sample number
    let result = metadata.find(sampleObj => sampleObj.id == sample);
    
    // Log the filtered metadata to verify
    console.log(`Metadata for sample ${sample}:`, result);

    // Select the metadata panel
    let panel = d3.select("#sample-metadata");

    // Clear existing metadata
    panel.html("");

    // Loop through key-value pairs and append to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    console.log("Metadata panel updated!");
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then((data) => {
      
      // Log the full dataset to inspect structure
      console.log("Full Data:", data);

      // Get the samples field
      let samples = data.samples;
      console.log("Samples Data:", samples);

      // Filter for the object matching the selected sample number
      let result = samples.find(sampleObj => sampleObj.id == sample);
      console.log(`Sample Data for ${sample}:`, result);

      // Check if result exists (avoid undefined errors)
      if (!result) {
        console.error(`No data found for sample ${sample}`);
        return;
      }

      // Get the otu_ids, otu_labels, and sample_values
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      console.log("OTU IDs:", otu_ids);
      console.log("OTU Labels:", otu_labels);
      console.log("Sample Values:", sample_values);

      // ====== BAR CHART ======
      // Slice top 10 OTUs and reverse for proper chart order
      let top_otu_ids = otu_ids.slice(0, 10).reverse();
      let top_otu_labels = otu_labels.slice(0, 10).reverse();
      let top_sample_values = sample_values.slice(0, 10).reverse();

      console.log("Top 10 OTU IDs:", top_otu_ids);
      console.log("Top 10 OTU Labels:", top_otu_labels);
      console.log("Top 10 Sample Values:", top_sample_values);

      // Create trace for bar chart
      let barTrace = {
        x: top_sample_values,
        y: top_otu_ids.map(id => `OTU ${id}`),
        text: top_otu_labels,
        type: "bar",
        orientation: "h",
        marker: {
          color: top_otu_ids,
          colorscale: "Blues"  // Try different colors like "Viridis" or "Earth"
        }
      };

      // Define layout
      let barLayout = {
        title: `Top 10 Bacterias Cultures Found ${sample}`,
        xaxis: { title: "Number of Bacteria" },  // ✅ Add X-axis title
        margin: { t: 30, l: 100 },
        height: 400
      };

      // Render the bar chart in the "bar" div
      Plotly.newPlot("bar", [barTrace], barLayout, {
        displayModeBar: true,
        displaylogo: false,  // 🔥 Remove Plotly logo
        modeBarButtonsToRemove: ["toggleSpikelines"],  // Remove unwanted buttons
        modeBarButtonsToAdd: [],
        responsive: true
      });

      // ====== BUBBLE CHART ======
      let bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth",
          opacity: 0.75,
          line: { width: 1 }
        }
      };

      let bubbleLayout = {
        title: `Bacteria Cultures Per Sample ${sample}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Number of Bacteria" },  // ✅ Add Y-axis title
        hovermode: "closest",
        height: 600
      };

      // Render the bubble chart in the "bubble" div
      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout, {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["toggleSpikelines"],
        modeBarButtonsToAdd: [],
        responsive: true
      });

    }) // Close d3.json .then() correctly
    .catch(error => console.error("Error fetching data:", error)); // Catch any errors
} // Correctly close function



// Function to run on page load
function init() {
  // Fetch data from JSON
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Log the entire dataset to check structure
    console.log("Fetched Data:", data);

    // Extract sample names
    let sampleNames = data.names;
    console.log("Sample Names:", sampleNames);

    // Select the dropdown and clear existing options to prevent duplicates
let selector = d3.select("#selDataset");
selector.html("");  // ✅ Clears previous dropdown entries

// Populate the dropdown with unique sample names
sampleNames.forEach((sample) => {
  selector.append("option")
    .text(sample)
    .property("value", sample);
});

console.log("Dropdown populated without duplicates!");

    // Log confirmation
    console.log("Dropdown populated!");

    // Get the first sample from the list
    let firstSample = sampleNames[0];
    console.log("First Sample Selected:", firstSample);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener when dropdown selection changes
function optionChanged(newSample) {
  console.log("New sample selected:", newSample);

  // Call functions to update metadata and charts
  buildMetadata(newSample);
  buildCharts(newSample);

  console.log(`Updated metadata and charts for sample: ${newSample}`);
}

// Initialize the dashboard
init();

// Reset button event listener
d3.select("#reset-btn").on("click", function() {
  console.log("Dashboard Reset!");

  // ✅ Reset the dropdown selection to "940"
  d3.select("#selDataset").property("value", "940");

  // ✅ Reload the default sample
  init();
});