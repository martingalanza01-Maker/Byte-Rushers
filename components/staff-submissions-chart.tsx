"use client";

import {useEffect, useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Calendar as CalendarIcon, BarChart3, RefreshCw} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {apiFetch} from "@/lib/api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {format, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear} from "date-fns";
import {cn} from "@/lib/utils";

type Mode = "day" | "week" | "month" | "year";

type SubmissionsOverviewResponse = {
  oldestDate: string | null;
  from: string;
  to: string;
  document: {inProgress: number; completed: number};
  complaint: {inProgress: number; completed: number};
};

const chartConfig = {
  inProgress: {
    label: "Created",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} as const;

function computeRange(mode: Mode, baseDate: Date) {
  switch (mode) {
    case "week": {
      const from = startOfWeek(baseDate, {weekStartsOn: 1});
      const to = endOfWeek(baseDate, {weekStartsOn: 1});
      return {from, to};
    }
    case "month": {
      const from = startOfMonth(baseDate);
      const to = endOfMonth(baseDate);
      return {from, to};
    }
    case "year": {
      const from = startOfYear(baseDate);
      const to = endOfYear(baseDate);
      return {from, to};
    }
    case "day":
    default: {
      const from = startOfDay(baseDate);
      const to = endOfDay(baseDate);
      return {from, to};
    }
  }
}

export default function StaffSubmissionsChart() {
  const [mode, setMode] = useState<Mode>("day");
  const [baseDate, setBaseDate] = useState<Date>(() => new Date());
  const [oldestDate, setOldestDate] = useState<Date | null>(null);
  const [data, setData] = useState<SubmissionsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {from, to} = useMemo(() => computeRange(mode, baseDate), [mode, baseDate]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      {
        category: "Document",
        inProgress: data.document.inProgress,
        completed: data.document.completed,
      },
      {
        category: "Complaint",
        inProgress: data.complaint.inProgress,
        completed: data.complaint.completed,
      },
    ];
  }, [data]);

  const rangeLabel = useMemo(() => {
    if (!from || !to) return "";
    switch (mode) {
      case "day":
        return format(from, "PPP");
      case "week":
        return `${format(from, "PPP")} - ${format(to, "PPP")}`;
      case "month":
        return format(from, "MMMM yyyy");
      case "year":
        return format(from, "yyyy");
      default:
        return "";
    }
  }, [mode, from, to]);

  const modeLabel = (m: Mode) =>
    m === "day" ? "Day" : m === "week" ? "Week" : m === "month" ? "Month" : "Year";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      });
      const res = (await apiFetch(`/stats/submissions-overview?${params.toString()}`)) as SubmissionsOverviewResponse;
      setData(res);
      if (res.oldestDate) {
        const d = new Date(res.oldestDate);
        if (!Number.isNaN(d.getTime())) {
          setOldestDate(d);
        }
      }
    } catch (e: any) {
      console.error("Failed to load submissions overview", e);
      setError(e?.message || "Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, baseDate]);

  const today = startOfDay(new Date());

  const disabledDates = (date: Date) => {
    const d = startOfDay(date);
    if (d > today) return true;
    if (oldestDate) {
      const min = startOfDay(oldestDate);
      if (d < min) return true;
    }
    return false;
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <BarChart3 className="h-4 w-4" />
            </span>
            <span>Submissions Overview</span>
          </CardTitle>
          <CardDescription>
            Document &amp; Complaint submissions created and completed for the selected {modeLabel(mode).toLowerCase()}.
          </CardDescription>
          {rangeLabel && (
            <p className="mt-1 text-xs text-blue-700/80">
              Showing data for <span className="font-medium">{rangeLabel}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <div className="inline-flex rounded-full bg-blue-50/80 p-1">
            {(["day", "week", "month", "year"] as Mode[]).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mode === m ? "default" : "ghost"}
                className={cn(
                  "rounded-full px-3 text-xs",
                  mode === m
                    ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                    : "text-blue-700 hover:bg-blue-100"
                )}
                onClick={() => setMode(m)}
              >
                {modeLabel(m)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {rangeLabel || "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={baseDate}
                  onSelect={(date) => date && setBaseDate(date)}
                  disabled={disabledDates}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 hover:bg-white"
              onClick={() => {
                setBaseDate(new Date());
                setMode("day");
              }}
            >
              Today
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-700 hover:bg-blue-100"
              onClick={fetchData}
              disabled={loading}
              aria-label="Refresh chart"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>

          {oldestDate && (
            <Badge variant="outline" className="border-blue-200 bg-white/60 text-[10px] text-blue-700">
              Data from {format(oldestDate, "PPP")} to {format(today, "PPP")}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="h-64">
          {loading && !data ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{fontSize: 12}}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{fontSize: 11}}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="inProgress"
                    name="Created"
                    radius={[4, 4, 0, 0]}
                    fill="var(--color-inProgress)"
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                    fill="var(--color-completed)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
