"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";

import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import sendEmail, { MailProps } from "@/lib/mail";
import { Input } from "@workspace/ui/components/input";
import { useEmailDialog } from "@/hooks/use-email-dialog";
import { useShallow } from "zustand/shallow";
import { toast } from "sonner";

const formSchema = z.object({
  to: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  text: z.string().min(1, { message: "Message is required" }),
  from: z.string().email({ message: "Invalid email address" }),
}) satisfies z.ZodType<MailProps>;

export function EmailDialog() {
  const { open, setOpen } = useEmailDialog(
    useShallow((state) => ({ open: state.open, setOpen: state.setOpen }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "quantumz4gaming@gmail.com",
      subject: "From Your Portfolio",
      from: "",
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.promise(sendEmail(values), {
        loading: "Sending...",
        success: "Email sent successfully",
        error: "Error sending email",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Fill out the form below to send an email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fill Your Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Who are You?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Type your message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send Email</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
