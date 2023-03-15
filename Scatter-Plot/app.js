// Doping: "Alleged drug use during 1995 due to high hematocrit levels"
// Name: "Marco Pantani"
// Nationality: "ITA"
// Place: 1
// Seconds: 2210
// Time: "36:50"
// URL: "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
// Year: 1995

document.addEventListener("DOMContentLoaded", handleData);

window.addEventListener("resize", () => {
  handleData();
});

async function getData() {
  return fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function handleData() {
  const dataset = await getData();
  if (dataset) {
    displayData(dataset);
  } else {
    console.error("Error handling data");
  }
}

function displayData(dataset) {
  var rootDiv = d3.select(".data");

  const w = parseFloat(rootDiv.style("width"));
  const h = parseFloat(rootDiv.style("height"));
  const padding = 50;

  const xMin = d3.min(dataset, (d) => getYear(d)) - 1;
  const xMax = d3.max(dataset, (d) => getYear(d)) + 1;
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([padding, w - padding]);

  const yMin = d3.max(dataset, (d) => getTimeInSeconds(d)) + 5;
  const yMax = d3.min(dataset, (d) => getTimeInSeconds(d)) - 5;
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([h - padding, padding]);

  rootDiv.selectAll("svg").remove();

  const svg = rootDiv
    .append("svg")
    .attr("viewbox", `0 0 ${w} ${h}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const tooltip = d3
    .select(".data")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")
    .text("");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(getYear(d)))
    .attr("cy", (d) => yScale(getTimeInSeconds(d)))
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .classed("withoutData", (d) => !isDopingInfo(d))
    .on("mouseover", (event, d) => {
      tooltip.html(formatToolbar(d));
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  const xAxis = d3.axisBottom(xScale);

  const timeFormat = d3.timeFormat("%M:%S");
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => timeFormat(new Date(null, null, null, 0, 0, d)));

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

function getYear(data) {
  return data["Year"];
}

function getTimeInSeconds(data) {
  return data["Seconds"];
}

function getFullTime(data) {
  console.log(data);
  return data["Time"];
}

function isDopingInfo(data) {
  return data["Doping"] != "";
}

function formatToolbar(data) {
  return (
    `${data["Name"]} : ${data["Nationality"]}` +
    "<br>" +
    `Year: ${data["Year"]}, Name: ${data["Time"]}` +
    (isDopingInfo(data) ? "<br><br>" + `${data["Doping"]}` : "")
  );
}
