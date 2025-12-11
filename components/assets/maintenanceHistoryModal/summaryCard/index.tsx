import { Card, CardContent } from "@/components/ui/card"
import { ComponentType, ReactNode } from "react"

export const SummaryCard = ({
  Icon,
  children,
  className,
  title
} : {
  children: ReactNode,
  Icon: ComponentType<{ className?: string }>
  className?: string
  title: string
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={className}>{children}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
