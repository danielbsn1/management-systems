"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type {
    PieSectorDataItem,
    PieSectorShapeProps,
} from "recharts/types/polar/Pie"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type View = "tipo" | "status" | "uso"

interface SliceConfig {
    key: string
    label: string
    color: string
}

const TIPOS: SliceConfig[] = [
    { key: "notebook", label: "Notebook", color: "var(--chart-1)" },
    { key: "desktop", label: "Desktop", color: "var(--chart-2)" },
    { key: "monitor", label: "Monitor", color: "var(--chart-3)" },
    { key: "tablet", label: "Tablet", color: "var(--chart-4)" },
    { key: "celular", label: "Celular", color: "var(--chart-5)" },
    { key: "impressora", label: "Impressora", color: "var(--chart-1)" },
    { key: "outros", label: "Outros", color: "var(--chart-2)" },
]

const STATUS: SliceConfig[] = [
    { key: "disponivel", label: "Disponível", color: "var(--chart-1)" },
    { key: "em_uso", label: "Em Uso", color: "var(--chart-2)" },
    { key: "manutencao", label: "Manutenção", color: "var(--chart-3)" },
    { key: "inativo", label: "Inativo", color: "var(--chart-4)" },
]

const USO: SliceConfig[] = [
    { key: "usados", label: "Usados", color: "var(--chart-2)" },
    { key: "nao_usados", label: "Não usados", color: "var(--chart-5)" },
]

const FALLBACK_PALETTE = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

const chartConfig: ChartConfig = {
    notebook: { label: "Notebook", color: "var(--chart-1)" },
    desktop: { label: "Desktop", color: "var(--chart-2)" },
    monitor: { label: "Monitor", color: "var(--chart-3)" },
    tablet: { label: "Tablet", color: "var(--chart-4)" },
    celular: { label: "Celular", color: "var(--chart-5)" },
    impressora: { label: "Impressora", color: "var(--chart-1)" },
    outros: { label: "Outros", color: "var(--chart-2)" },
    disponivel: { label: "Disponível", color: "var(--chart-1)" },
    em_uso: { label: "Em Uso", color: "var(--chart-2)" },
    manutencao: { label: "Manutenção", color: "var(--chart-3)" },
    inativo: { label: "Inativo", color: "var(--chart-4)" },
    usados: { label: "Usados", color: "var(--chart-2)" },
    nao_usados: { label: "Não usados", color: "var(--chart-5)" },
}

function buildData(
    source: Record<string, number>,
    configList: SliceConfig[],
): { key: string; label: string; valor: number; fill: string }[] {
    const configMap = new Map(configList.map((c) => [c.key, c]))

    const entries = Object.entries(source)
        .filter(([, valor]) => valor > 0)
        .sort(([a], [b]) => {
            const ia = configList.findIndex((c) => c.key === a)
            const ib = configList.findIndex((c) => c.key === b)
            if (ia !== -1 && ib !== -1) return ia - ib
            if (ia !== -1) return -1
            if (ib !== -1) return 1
            return 0
        })

    return entries.map(([key, valor], index) => {
        const known = configMap.get(key)
        return {
            key,
            label: known?.label ?? key.charAt(0).toUpperCase() + key.slice(1),
            valor,
            fill: known?.color ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length],
        }
    })
}

interface ChartPieInteractiveProps {
    porTipo: Record<string, number>
    porStatus?: Record<string, number>
    porUso?: Record<string, number>
}

export function ChartPieInteractive({ porTipo, porStatus = {}, porUso = {} }: ChartPieInteractiveProps) {
    const id = "pie-interactive"

    const [view, setView] = React.useState<View>("tipo")

    const source = view === "tipo" ? porTipo : view === "status" ? porStatus : porUso
    const configList = view === "tipo" ? TIPOS : view === "status" ? STATUS : USO

    const data = React.useMemo(
        () => buildData(source, configList),
        [source, configList],
    )

    const [activeKey, setActiveKey] = React.useState(() => data[0]?.key ?? "")

    React.useEffect(() => {
        if (!data.some((item) => item.key === activeKey)) {
            setActiveKey(data[0]?.key ?? "")
        }
    }, [data, activeKey])

    const activeIndex = data.findIndex((item) => item.key === activeKey)

    const renderPieShape = React.useCallback(
        ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
            if (index === activeIndex) {
                return (
                    <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 12}
                        />
                    </g>
                )
            }

            return <Sector {...props} outerRadius={outerRadius} />
        },
        [activeIndex],
    )

    if (data.length === 0) {
        return (
            <Card data-chart={id} className="flex flex-col">
                <CardHeader className="flex-row items-start space-y-0 pb-0">
                    <div className="grid gap-1">
                        <CardTitle>Equipamentos</CardTitle>
                        <CardDescription>Distribuição do inventário</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-1 items-center justify-center pb-0 text-sm text-muted-foreground">
                    Sem dados para exibir.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Equipamentos</CardTitle>
                    <CardDescription>Distribuição do inventário</CardDescription>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
                        {(
                            [
                                { value: "tipo", label: "Por tipo" },
                                { value: "status", label: "Por status" },
                                { value: "uso", label: "Usados / Não usados" },
                            ] as const
                        ).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setView(option.value)}
                                className={cn(
                                    "h-7 rounded-md px-3 text-xs font-medium transition-colors",
                                    view === option.value
                                        ? "bg-background text-foreground shadow"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <Select
                        value={activeKey}
                        onValueChange={(value) => value && setActiveKey(value)}
                    >
                        <SelectTrigger
                            className="h-7 w-[130px] rounded-lg pl-2.5"
                            aria-label="Selecionar categoria"
                        >
                            <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent align="end" className="rounded-xl">
                            {data.map((item) => (
                                <SelectItem
                                    key={item.key}
                                    value={item.key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-xs"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        {item.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="valor"
                            nameKey="key"
                            innerRadius={60}
                            strokeWidth={5}
                            shape={renderPieShape}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="text-3xl font-bold"
                                                    style={{ fill: activeIndex >= 0 ? data[activeIndex].fill : undefined }}
                                                >
                                                    {activeIndex >= 0
                                                        ? data[activeIndex].valor.toLocaleString("pt-BR")
                                                        : 0}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {activeIndex >= 0
                                                        ? data[activeIndex].label
                                                        : "Equipamentos"}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
