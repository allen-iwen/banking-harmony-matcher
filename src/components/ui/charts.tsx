
import * as React from "react";
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  RadarChart as RechartsRadarChart,
  Bar,
  Line,
  Pie,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import { ChartTooltipContent, ChartContainer, ChartTooltip, ChartConfig } from "@/components/ui/chart";

// Default chart config
const defaultChartConfig: ChartConfig = {
  primary: { color: "hsl(222.2 47.4% 11.2%)" },
  secondary: { color: "hsl(215.4 16.3% 46.9%)" },
  tertiary: { color: "hsl(210 40% 96.1%)" },
  success: { color: "hsl(142.1 76.2% 36.3%)" },
  warning: { color: "hsl(48 96% 89%)" },
  error: { color: "hsl(0 84.2% 60.2%)" },
  muted: { color: "hsl(210 40% 96.1%)" },
};

// BarChart Component
interface BarChartProps {
  data: any[];
  options?: any;
}

export const BarChart = ({ data, options }: BarChartProps) => {
  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data?.datasets?.map((dataset: any, index: number) => (
          <Bar
            key={index}
            dataKey={dataset.label || "value"}
            fill={dataset.backgroundColor || "#8884d8"}
            stroke={dataset.borderColor}
            name={dataset.label}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

// LineChart Component
interface LineChartProps {
  data: any[];
  options?: any;
}

export const LineChart = ({ data, options }: LineChartProps) => {
  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data?.datasets?.map((dataset: any, index: number) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label || "value"}
            stroke={dataset.borderColor || "#8884d8"}
            fill={dataset.backgroundColor}
            name={dataset.label}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

// PieChart Component
interface PieChartProps {
  data: any;
  options?: any;
}

export const PieChart = ({ data, options }: PieChartProps) => {
  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data?.datasets?.map((dataset: any, index: number) => (
          <Pie
            key={index}
            data={dataset.data.map((value: number, i: number) => ({
              name: data.labels[i],
              value: value,
            }))}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label
          >
            {dataset.data.map((_: any, i: number) => (
              <Cell key={`cell-${i}`} fill={dataset.backgroundColor?.[i] || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Pie>
        ))}
      </RechartsPieChart>
    </ChartContainer>
  );
};

// RadarChart Component
interface RadarChartProps {
  data: any;
  options?: any;
}

export const RadarChart = ({ data, options }: RadarChartProps) => {
  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data?.datasets?.map((dataset: any, index: number) => {
          // Transform the data into the format expected by RadarChart
          const transformedData = data.labels.map((label: string, i: number) => ({
            name: label,
            value: dataset.data[i],
          }));
          
          return (
            <Radar
              key={index}
              name={dataset.label}
              dataKey="value"
              stroke={dataset.borderColor || "#8884d8"}
              fill={dataset.backgroundColor || "#8884d8"}
              fillOpacity={0.6}
              data={transformedData}
            />
          );
        })}
      </RechartsRadarChart>
    </ChartContainer>
  );
};
