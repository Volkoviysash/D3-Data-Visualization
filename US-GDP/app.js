async function getData() {
  return fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
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
    displayData(dataset.data);
  } else {
    console.error("Error handle data");
  }
}

document.addEventListener("DOMContentLoaded", handleData);

function displayData(dataset) {
  var rootDiv = d3.select(".data");

  const w = parseFloat(rootDiv.style("width"));
  const h = parseFloat(rootDiv.style("height"));
  const padding = 50;
  const numBars = dataset.length;
  const barWidth = (w - 2 * padding) / numBars;

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d, i) => calculateYear(dataset, i)),
      calculateYear(dataset, dataset.length - 1),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3
    .select(".data")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const tooltip = d3
    .select(".data")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden")
    .text("");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(calculateYear(dataset, i)))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("class", "bar")
    .on("mouseover", (event, d) => {
      tooltip.html("GDP: $" + d[1] + " bn. <br> Date: " + d[0]);
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
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}

function calculateYear(data, elementIndex = 0) {
  const regexYear = /^\d{4}/;
  const regexQuart = /-(\d{2})-/;

  const year = data[elementIndex][0].match(regexYear)[0];
  const month = regexQuart.exec(data[elementIndex][0])[1];
  const quarter = Math.ceil(month / 3);

  return parseFloat(year) + quarter * 0.25;
}

function getStringData(data) {
  const year = Math.floor(data);
  const quarter = Math.ceil((data - year) * 4);

  // Return the formatted string
  return `Quarter ${quarter}, year ${year}`;
}
