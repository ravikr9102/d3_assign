import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  country: string;
  sales: number;
  product: string;
}

const ScatterPlot: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null); // Explicitly specify the type of svgRef

  useEffect(() => {
    const data: DataPoint[] = [
      { country: 'United States', sales: 100000, product: 'Product A' },
      { country: 'Canada', sales: 80000, product: 'Product B' },
      { country: 'Mexico', sales: 60000, product: 'Product C' },
      { country: 'United Kingdom', sales: 40000, product: 'Product D' },
      { country: 'Germany', sales: 20000, product: 'Product E' },
    ];

    if (!svgRef.current) return; // Guard clause to handle the case when svgRef is null

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select<SVGSVGElement, DataPoint>(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleBand<string>()
      .range([0, width])
      .domain(data.map((d) => d.country));

    const yScale = d3
      .scaleLinear<number>()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.sales)!]);

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 100}, ${height - 100})`);

    const legendItems = legend
      .selectAll<SVGGElement, string>('g')
      .data(data.map((_d) => _d.product))
      .enter()
      .append('g')
      .attr('transform', (_d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => {
        if (d === 'Product A') {
          return 'red';
        } else if (d === 'Product B') {
          return 'blue';
        } else if (d === 'Product C') {
          return 'green';
        } else if (d === 'Product D') {
          return 'yellow';
        } else {
          return 'orange';
        }
      });

    legendItems
      .append('text')
      .attr('x', 10)
      .attr('y', 5)
      .text((d) => d);

    svg
      .selectAll<SVGCircleElement, DataPoint>('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.country)!)
      .attr('cy', (d) => yScale(d.sales)!)
      .attr('r', 5)
      .attr('fill', (d) => {
        if (d.product === 'Product A') {
          return 'red';
        } else if (d.product === 'Product B') {
          return 'blue';
        } else if (d.product === 'Product C') {
          return 'green';
        } else if (d.product === 'Product D') {
          return 'yellow';
        } else {
          return 'orange';
        }
      });

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));
  }, []); // Empty dependency array indicates that this effect runs only once after initial render

  return (
    <div className="flex">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ScatterPlot;
