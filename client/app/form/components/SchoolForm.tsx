"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  state: z
    .string()
    .min(4, { message: "State must be at least 4 characters" })
    .max(12, { message: "State must be less than 12 characters" }),
  school: z
    .string()
    .max(50, { message: "College must be less than 50 characters" }),
});

const SchoolForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      school: "",
    },
  });

  //  If the state is less than 4 characters, the school input is disabled
  const stateValue = form.watch("state");

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full h-full px-10 py-6 md:px-24 md:py-6"
      >
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="School Location"
                  {...field}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="School Name"
                  {...field}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
                  disabled={!stateValue || stateValue.length < 4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SchoolForm;
