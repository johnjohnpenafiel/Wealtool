"use client";

import React, { useState } from "react";
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
import SuggestData from "@/components/SuggestData";

interface Program {
  code: string;
  title: string;
}

interface ProgramFormProps {
  programs: Program[];
  onSubmit: (programCode: string) => void;
}

const ProgramForm = ({ programs, onSubmit }: ProgramFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Form Schema
  const formSchema = z.object({
    program: z
      .string()
      .min(1, "Please select a program")
      .refine(
        (val) => programs.some((program) => program.title === val),
        "Please select a valid program"
      ),
  });

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program: "",
    },
  });

  const handleSelect = (value: string) => {
    const program = programs.find((p) => p.title === value);
    if (program) {
      setSelectedProgram(program);
      form.setValue("program", value);
      setSearchTerm(value);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedProgram) {
      onSubmit(selectedProgram.code);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="program"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  placeholder="Search for a program..."
                  {...field}
                  autoComplete="off"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    field.onChange(e);
                    setSelectedProgram(null);
                  }}
                  className="h-16 text-2xl border-2"
                />
              </FormControl>
              <FormMessage />
              {searchTerm.length > 0 && !selectedProgram && (
                <SuggestData
                  searchTerm={searchTerm}
                  data={programs.map((program) => program.title)}
                  onSelect={handleSelect}
                  className="max-h-[350px]"
                  itemClassName="min-h-5 md:min-h-16 text-lg md:text-2xl"
                />
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" size="lg">
          Select Program
        </Button>
      </form>
    </Form>
  );
};

export default ProgramForm;
