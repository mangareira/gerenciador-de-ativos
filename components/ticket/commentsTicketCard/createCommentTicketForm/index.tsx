import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useCreateComment } from "@/utils/hooks/comments/useCreateComment"
import { CreateTicketComment, CreateTicketCommentSchema } from "@/utils/schemas/comment.schemas"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock } from "lucide-react"
import { useForm } from "react-hook-form"

export const CreateCommentTicketForm = ({ ticket } : { ticket : Ticket }) => {

  const form = useForm({
    resolver: zodResolver(CreateTicketCommentSchema),
    defaultValues: {
      comment: "",
      isInternal: false,
      ticketId: ticket.id,
      userId: "cmj0cgrhy0000vaoo7zimheo9"
    }
  })

  const { mutate, isPending } = useCreateComment()

  const onSubmit = (data: CreateTicketComment) => {
    mutate(data, {
      onSuccess: () => {
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4 border-t space-y-3">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Adicionar comentário..."
                  className="min-h-[100px] resize-none"
                  disabled={isPending}
                  onKeyDown={(e) => e.stopPropagation()}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center gap-4">
          <FormField
            control={form.control}
            name="isInternal"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <label className="text-sm text-muted-foreground flex items-center gap-1 cursor-pointer">
                  <Lock className="h-3 w-3" />
                  Comentário interno (não visível ao solicitante)
                </label>
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Adicionar Comentário"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
