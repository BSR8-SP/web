import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Field, FieldGroup, FieldLabel } from "../components/ui/field"
import { Label } from "../components/ui/label"
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../components/ui/chart"

import { Bar, BarChart, Pie, PieChart, CartesianGrid, XAxis } from "recharts"


const day_of_the_week = [
    { label: "Segunda à sexta", value: "segunda-sexta" },
    { label: "Sábados e domingos", value: "sabado-domingo" }
]

// mock data
const crowdednessChartData = [
    { hour: "00h", crowdedness: 1 },
    { hour: "01h", crowdedness: 1 },
    { hour: "02h", crowdedness: 1 },
    { hour: "03h", crowdedness: 1 },
    { hour: "04h", crowdedness: 1 },
    { hour: "05h", crowdedness: 2 },
    { hour: "06h", crowdedness: 3 },
    { hour: "07h", crowdedness: 4 },
    { hour: "08h", crowdedness: 5 },
    { hour: "09h", crowdedness: 4 },
    { hour: "10h", crowdedness: 3 },
    { hour: "11h", crowdedness: 2 },
    { hour: "12h", crowdedness: 3 },
    { hour: "13h", crowdedness: 3 },
    { hour: "14h", crowdedness: 2 },
    { hour: "15h", crowdedness: 2 },
    { hour: "16h", crowdedness: 2 },
    { hour: "17h", crowdedness: 3 },
    { hour: "18h", crowdedness: 5 },
    { hour: "19h", crowdedness: 4 },
    { hour: "20h", crowdedness: 2 },
    { hour: "21h", crowdedness: 2 },
    { hour: "22h", crowdedness: 1 },
    { hour: "23h", crowdedness: 1 },
]

const crowdednessBarChartConfig = {
    crowdedness: { label: "Lotação", color: "var(--chart-1)" }
}

// mock data
const incidentsPieChartData = [
    { category: "robbery",      count: 12, fill:   "var(--color-robbery)" },
    { category: "theft",        count: 20, fill:   "var(--color-theft)" },
    { category: "harassment",   count: 45, fill:   "var(--color-harassment)" },
    { category: "accident",     count: 2, fill:    "var(--color-accident)" },
    { category: "no_incidents", count: 1100, fill: "var(--color-no_incidents)" }
]

const incidentsPieChartConfig = {
    count:        { label: "Número de incidentes" },

    robbery:      { label: "Roubos",    color: "var(--chart-1)" },
    theft:        { label: "Furtos",    color: "var(--chart-2)" },
    harassment:   { label: "Assédios",  color: "var(--chart-3)" },
    accident:     { label: "Acidentes", color: "var(--chart-4)" },
    no_incidents: { label: "Nenhum",    color: "var(--chart-5)" }
}

// mock data
const busFleetAgePieChartData = [
    { category: "old",   count: 0,  fill: "var(--color-old)" },
    { category: "mixed", count: 4,  fill: "var(--color-mixed)" },
    { category: "new",   count: 19, fill: "var(--color-new)" }
]

const busFleetAgePieChartConfig = {
    count: { label: "Número de observações" },

    old:   { label: "Velha", color: "var(--chart-1)" },
    mixed: { label: "Misto", color: "var(--chart-2)" },
    new:   { label: "Nova",  color: "var(--chart-3)" }
}

// mock data
const busAirConditioningPieChartData = [
    { category: "most", count: 46, fill: "var(--color-most)" },
    { category: "half", count: 0, fill: "var(--color-half)" },
    { category: "few", count: 0, fill: "var(--color-few)" }
]

const busAirConditioningPieChartConfig = {
    count: { label: "Número de observações" },

    most:  { label: "Maioria", color: "var(--chart-1)" },
    half:  { label: "Metade",  color: "var(--chart-2)" },
    few:   { label: "Poucos",  color: "var(--chart-3)" }
}

// mock data
const busBreakdownPieChartData = [
    { category: "frequent", count: 1, fill: "var(--color-frequent)" },
    { category: "sometimes", count: 9, fill: "var(--color-sometimes)" },
    { category: "rarely", count: 3, fill: "var(--color-rarely)" }
]

const busBreakdownPieChartConfig = {
    count:     { label: "Número de observações" },

    frequent:  { label: "Frequente", color: "var(--chart-1)" },
    sometimes: { label: "Às vezes",  color: "var(--chart-2)" },
    rarely:    { label: "Raramente",  color: "var(--chart-3)" }
}

// mock data
const mock_comments = ["Comentário 1", "Comentário 2", "Comentário 3"]



function DayOfWeekDropdown() {
    return (
        <Select items={day_of_the_week}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione um dia" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {day_of_the_week.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function TimeIntervalSelector() {

    const [value, setValue] = useState({
        start: "00:00",
        end: "23:59",
    });

    return (
        <FieldGroup className="w-full flex flex-row items-center justify-center gap-3">
                
            <FieldLabel className="w-auto flex justify-center" htmlFor="time-interval-start">Início</FieldLabel>

            <Input
                type="time"
                id="time-interval-start"
                step="60"
                value={value.start}
                onChange={(e) => setValue((prev) => ({ ...prev, start: e.target.value }))}
                className="w-auto appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />

            <FieldLabel className="w-auto flex justify-center" htmlFor="time-interval-end">Fim</FieldLabel>

            <Input
                type="time"
                id="time-interval-end"
                step="60"
                value={value.end}
                onChange={(e) => setValue((prev) => ({ ...prev, end: e.target.value }))}
                className="w-auto appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />

        </FieldGroup>
    )
}

function MapTabs() {
    return (
        <Tabs defaultValue="lotacao" className="w-full">

            <TabsList>
                <TabsTrigger value="lotacao">Lotação do ônibus</TabsTrigger>
                <TabsTrigger value="duracao">Duração da viagem</TabsTrigger>
            </TabsList>

            <TabsContent value="lotacao">
                <Card>
                    <CardHeader>
                        <CardTitle>Lotação do ônibus</CardTitle>
                        <CardDescription>
                            Selecione um trecho da rota para visualizar a lotação.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        (Add map here)
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="duracao">
                <Card>
                    <CardHeader>
                        <CardTitle>Duração da viagem</CardTitle>
                        <CardDescription>
                            Selecione um trecho da rota para visualizar o tempo de viagem.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        (Add map here)
                    </CardContent>
                </Card>
            </TabsContent>
            
        </Tabs>
    )
}


function BusBarChart() {
    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Ao longo do dia</CardTitle>
                <CardDescription>Lotação média do ônibus no trecho selecionado</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={crowdednessBarChartConfig}>
                    <BarChart accessibilityLayer data={crowdednessChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="crowdedness" fill="var(--color-crowdedness)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function PieChartCard({ title, description, data_config, chart_data }) {
    return (
        <Card className="h-auto w-full flex flex-col">

            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <div className="flex flex-col md:flex-row items-start gap-6 w-full">

                    <ChartContainer config={data_config} className="w-full aspect-square max-h-[300px] min-w-0 flex-1">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}/>
                            <Pie data={chart_data} dataKey="count" nameKey="category"/>
                        </PieChart>
                    </ChartContainer>

                    <div className="w-full md:w-[100px] lg:w-[125px] flex flex-col justify-start gap-3 shrink-0">
                        {chart_data.map((item) => (
                            <div key={data_config[item.category].label} className="flex items-center gap-2 min-w-0">
                                <span
                                    className="h-3 w-3 rounded-sm shrink-0"
                                    style={{ backgroundColor: data_config[item.category].color }}
                                />
                                <span className="text-sm truncate">{data_config[item.category].label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CommentsSection({ comments_list }) {
    return (
        <div className="w-full flex flex-col gap-3">
            <h1>Comentários</h1>
            {comments_list.map((item) => (
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Card title</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {item}
                        <div className='flex justify-end'>
                            <Button variant='ghost'>Upvote</Button>
                            <Button variant='ghost'>Downvote</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function LineInfoPage() {
    return(
        <div className='flex flex-col justify-center items-center gap-3 lg:w-[700px] md:w-[500px] w-[350px]'>

            <div className="flex flex-col items-center">
                <h1>XXXX-XX</h1>
                <p>Sentido: Lorem Ipsum</p>
            </div>
            
            <DayOfWeekDropdown/>

            <TimeIntervalSelector/>            

            <MapTabs/>

            <BusBarChart/>

            <div className='w-full grid grid-cols-2 gap-4'>
                <PieChartCard
                    title="Incidentes"
                    description="Descrição"
                    data_config={incidentsPieChartConfig}
                    chart_data={incidentsPieChartData}
                />
                <PieChartCard
                    title="Frota"
                    description="Descrição"
                    data_config={busFleetAgePieChartConfig}
                    chart_data={busFleetAgePieChartData}
                />
                <PieChartCard
                    title="Ar-condicionado"
                    description="Descrição"
                    data_config={busAirConditioningPieChartConfig}
                    chart_data={busAirConditioningPieChartData}
                />
                <PieChartCard
                    title="Falhas"
                    description="Descrição"
                    data_config={busBreakdownPieChartConfig}
                    chart_data={busBreakdownPieChartData}
                />
            </div>

            <CommentsSection comments_list={mock_comments}/>
        </div>
    )
}