"use client";

import React, { useState, useRef } from "react";

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
import SuggestStates from "@/components/SuggestStates";
import { states } from "@/lib/data/states";

// Form Schema
const formSchema = z.object({
  state: z
    .string()
    .refine((val) => states.some((state) => state.name === val), {
      message: "Please enter a valid state",
    }),
  school: z
    .string()
    .max(50, { message: "College must be less than 50 characters" }),
});

// School Form
const SchoolForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      school: "",
    },
  });
  // Handle State Selection
  const handleStateSelect = (stateName: string) => {
    form.setValue("state", stateName);
    setSearchTerm(""); // Clear search term to hide dropdown
    // Focus the school input after state selection
    if (schoolInputRef.current) {
      schoolInputRef.current.focus();
    }
  };

  // Check if state field is valid
  const stateFieldState = form.getFieldState("state");
  const isStateValid = !stateFieldState.invalid && stateFieldState.isDirty;

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full h-full px-10 py-6 md:px-24 md:py-6"
      >
        {/* State Input */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="School Location"
                  {...field}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    field.onChange(e);
                  }}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage />
              {/* Suggest States */}
              {searchTerm.length > 0 && (
                <SuggestStates
                  searchTerm={searchTerm}
                  onStateSelect={handleStateSelect}
                />
              )}
            </FormItem>
          )}
        />
        {/* School Input */}
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="School Name"
                  {...field}
                  ref={schoolInputRef}
                  disabled={!isStateValid}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
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
