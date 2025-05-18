
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

// Define chart data types
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// BarChart Component
interface BarChartProps {
  data: ChartData;
  options?: any;
}

export const BarChart = ({ data, options }: BarChartProps) => {
  // Transform the data format for Recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsBarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar
            key={index}
            dataKey={dataset.label}
            fill={dataset.backgroundColor as string || "#8884d8"}
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
  data: ChartData;
  options?: any;
}

export const LineChart = ({ data, options }: LineChartProps) => {
  // Transform the data format for Recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsLineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor || "#8884d8"}
            fill={dataset.backgroundColor as string}
            name={dataset.label}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

// PieChart Component
interface PieChartProps {
  data: ChartData;
  options?: any;
}

export const PieChart = ({ data, options }: PieChartProps) => {
  // Transform the data for a pie chart
  const transformedData = data.labels.map((label, index) => {
    return {
      name: label,
      value: data.datasets[0].data[index]
    };
  });

  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Pie
          data={transformedData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label
        >
          {transformedData.map((_, index) => {
            const colors = Array.isArray(data.datasets[0].backgroundColor) 
              ? data.datasets[0].backgroundColor 
              : [data.datasets[0].backgroundColor || "#8884d8"];
            
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length] || `#${Math.floor(Math.random() * 16777215).toString(16)}`} 
              />
            );
          })}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
};

// RadarChart Component
interface RadarChartProps {
  data: ChartData;
  options?: any;
}

export const RadarChart = ({ data, options }: RadarChartProps) => {
  // Transform the data for a radar chart
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ChartContainer config={defaultChartConfig} className="w-full h-full">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Radar
            key={index}
            name={dataset.label}
            dataKey={dataset.label}
            stroke={dataset.borderColor || "#8884d8"}
            fill={dataset.backgroundColor as string || "#8884d8"}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ChartContainer>
  );
};
