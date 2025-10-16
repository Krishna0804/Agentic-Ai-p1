"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, Leaf, DollarSign, Target, Award } from "lucide-react"

// Mock analytics data
const performanceMetrics = [
  { month: "Jan", efficiency: 82, cost: 15420, carbon: 7800, satisfaction: 85 },
  { month: "Feb", efficiency: 85, cost: 14200, carbon: 7200, satisfaction: 87 },
  { month: "Mar", efficiency: 88, cost: 13800, carbon: 6900, satisfaction: 89 },
  { month: "Apr", efficiency: 87, cost: 14100, carbon: 7100, satisfaction: 88 },
  { month: "May", efficiency: 90, cost: 13200, carbon: 6600, satisfaction: 91 },
  { month: "Jun", efficiency: 92, cost: 12800, carbon: 6400, satisfaction: 93 },
]

const buildingComparison = [
  { building: "Engineering", efficiency: 92, cost: 4200, carbon: 2100, score: 95 },
  { building: "Residence A", efficiency: 88, cost: 3800, carbon: 1900, score: 89 },
  { building: "Admin", efficiency: 75, cost: 2200, carbon: 1400, score: 78 },
  { building: "Sports Center", efficiency: 85, cost: 5200, carbon: 2600, score: 87 },
]

const sustainabilityData = [
  { category: "Energy Efficiency", current: 87, target: 90, improvement: 12 },
  { category: "Carbon Reduction", current: 78, target: 85, improvement: 18 },
  { category: "Water Conservation", current: 82, target: 80, improvement: 8 },
  { category: "Waste Management", current: 91, target: 95, improvement: 15 },
  { category: "Smart Systems", current: 89, target: 92, improvement: 22 },
  { category: "Maintenance Efficiency", current: 85, target: 88, improvement: 10 },
]

const costAnalysis = [
  { category: "Energy", current: 8500, previous: 9200, savings: 700 },
  { category: "Maintenance", current: 3200, previous: 4100, savings: 900 },
  { category: "Operations", current: 2800, previous: 3000, savings: 200 },
  { category: "Water", current: 1200, previous: 1350, savings: 150 },
]

const predictiveInsights = [
  {
    title: "Energy Optimization Opportunity",
    description: "HVAC scheduling optimization could reduce consumption by 15%",
    impact: "High",
    savings: 2400,
    timeframe: "3 months",
    confidence: 87,
  },
  {
    title: "Predictive Maintenance Savings",
    description: "Early intervention on elevator maintenance prevents costly repairs",
    impact: "Medium",
    savings: 1800,
    timeframe: "1 month",
    confidence: 92,
  },
  {
    title: "Smart Lighting Implementation",
    description: "Motion-sensor lighting in common areas reduces energy waste",
    impact: "Medium",
    savings: 1200,
    timeframe: "2 months",
    confidence: 78,
  },
]

export function AnalyticsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [selectedMetric, setSelectedMetric] = useState("efficiency")

  const totalSavings = costAnalysis.reduce((sum, item) => sum + item.savings, 0)
  const avgEfficiency = performanceMetrics.reduce((sum, item) => sum + item.efficiency, 0) / performanceMetrics.length
  const carbonReduction =
    ((performanceMetrics[0].carbon - performanceMetrics[performanceMetrics.length - 1].carbon) /
      performanceMetrics[0].carbon) *
    100

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Efficiency</p>
                <p className="text-2xl font-bold text-green-400">{avgEfficiency.toFixed(1)}%</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+5.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cost Savings</p>
                <p className="text-2xl font-bold text-blue-400">${totalSavings}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">-12.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Carbon Reduction</p>
                <p className="text-2xl font-bold text-green-400">{carbonReduction.toFixed(1)}%</p>
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">-18%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Sustainability Score</p>
                <p className="text-2xl font-bold text-purple-400">87</p>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-green-500">+3.2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="data-[state=active]:bg-blue-600">
            <Leaf className="w-4 h-4 mr-2" />
            Sustainability
          </TabsTrigger>
          <TabsTrigger value="costs" className="data-[state=active]:bg-blue-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Performance Trends</CardTitle>
                    <CardDescription className="text-slate-400">
                      Campus efficiency and satisfaction metrics
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {["3m", "6m", "1y"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className={selectedPeriod === period ? "bg-blue-600" : ""}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Satisfaction %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Building Comparison */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Building Performance</CardTitle>
                <CardDescription className="text-slate-400">
                  Comparative analysis across campus buildings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={buildingComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="building" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" name="Performance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Building Metrics */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Detailed Building Metrics</CardTitle>
              <CardDescription className="text-slate-400">
                Comprehensive performance breakdown by building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {buildingComparison.map((building) => (
                  <div
                    key={building.building}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{building.building}</h4>
                        <p className="text-sm text-slate-400">Performance Score: {building.score}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Efficiency</p>
                        <div className="flex items-center gap-2">
                          <Progress value={building.efficiency} className="w-16 h-2" />
                          <span className="text-white text-sm">{building.efficiency}%</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Monthly Cost</p>
                        <p className="text-white">${building.cost}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Carbon (kg)</p>
                        <p className="text-white">{building.carbon}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sustainability Radar */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Sustainability Scorecard</CardTitle>
                <CardDescription className="text-slate-400">
                  Multi-dimensional sustainability assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={sustainabilityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sustainability Progress */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Progress Tracking</CardTitle>
                <CardDescription className="text-slate-400">Year-over-year sustainability improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sustainabilityData.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{item.current}%</span>
                          <Badge className="bg-green-600 text-xs">+{item.improvement}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.current} className="flex-1 h-2" />
                        <span className="text-xs text-slate-400">Target: {item.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Impact */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Environmental Impact</CardTitle>
              <CardDescription className="text-slate-400">
                Carbon footprint and resource consumption trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="carbon"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Carbon Footprint (kg CO₂)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Cost Analysis</CardTitle>
                <CardDescription className="text-slate-400">Current vs previous period comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costAnalysis.map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-white">{item.category}</h4>
                        <p className="text-sm text-slate-400">Current: ${item.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Previous: ${item.previous}</p>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-green-400 font-medium">${item.savings} saved</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Total Savings</h4>
                      <p className="text-sm text-slate-400">This period</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">${totalSavings}</p>
                      <p className="text-sm text-green-400">-13.2% vs previous</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Analysis */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">ROI Analysis</CardTitle>
                <CardDescription className="text-slate-400">Return on smart campus investments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={costAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="savings" fill="#10b981" name="Savings ($)" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Annual ROI</p>
                    <p className="text-xl font-bold text-green-400">24.5%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Payback Period</p>
                    <p className="text-xl font-bold text-blue-400">3.2 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">AI-Powered Insights</CardTitle>
              <CardDescription className="text-slate-400">
                Predictive analytics and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg">
                          <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{insight.title}</h4>
                          <p className="text-sm text-slate-400">{insight.description}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          insight.impact === "High"
                            ? "bg-red-600"
                            : insight.impact === "Medium"
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }
                      >
                        {insight.impact} Impact
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-slate-400">Potential Savings</p>
                        <p className="text-lg font-bold text-green-400">${insight.savings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Implementation</p>
                        <p className="text-white">{insight.timeframe}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.confidence} className="w-16 h-2" />
                          <span className="text-white text-sm">{insight.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Implement
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
