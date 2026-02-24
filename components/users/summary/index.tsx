import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const UserSummary = (
  {
    title,
    count
  } :
  {
    title: string
    count: number
  }
) => {
  return (
    <Card>
      <CardHeader className="pb-3">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-3xl">{count}</CardTitle>
      </CardHeader>
    </Card>
  )
}
