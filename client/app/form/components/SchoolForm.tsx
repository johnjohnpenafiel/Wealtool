"use client";

import React, { useState, useRef, useEffect } from "react";
// Hooks
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Components
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
import SuggestSchools from "@/components/SuggestSchools";
// Data
import { states } from "@/lib/data/states";
// API
import { fetchSchools } from "@/lib/api";

// ----- Form Schema ----- //
const formSchema = z.object({
  state: z
    .string()
    .refine((val) => states.some((state) => state.name === val), {
      message: "Please enter a valid state",
    }),
  school: z
    .string()
    .max(150, { message: "School must be less than 150 characters" }),
});

// -------------------------- School Form -------------------------- //
export default function SchoolForm() {
  // ----- State ----- //
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [schoolSearchTerm, setSchoolSearchTerm] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  // ----- Refs ----- //
  const schoolInputRef = useRef<HTMLInputElement>(null);
  // ----- Form ----- //
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      school: "",
    },
  });
  // ----- Check if state field is valid ----- //
  const inputState = form.getFieldState("state");
  const isStateValid = !inputState.invalid && inputState.isDirty;

  // ----- Handle State Selection ----- //
  const handleStateSelect = (stateName: string) => {
    form.setValue("state", stateName);
    const selectedStateCode = states.find(
      (state) => state.name === stateName
    )?.code;
    setStateCode(selectedStateCode || "");
    setStateSearchTerm("");
    if (schoolInputRef.current) {
      schoolInputRef.current.focus();
    }
  };

  // ----- Handle School Selection ----- //
  const handleSchoolSelect = (schoolName: string) => {
    form.setValue("school", schoolName);
    setSchoolSearchTerm("");
  };

  // ----- Fetch Schools ----- //
  useEffect(() => {
    if (stateCode && isStateValid) {
      fetchSchools(stateCode).then((schools) => {
        setSchools(schools);
        console.log("Fetched schools:", schools);
      });
    } else {
      setSchools([]); // Reset schools when state is invalid
    }
  }, [stateCode, isStateValid]);

  // ----- Handle Form Submission ----- //
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  // ----- Render ----- //
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
                    setStateSearchTerm(e.target.value);
                    setStateCode(
                      states.find((state) => state.name === e.target.value)
                        ?.code || ""
                    );
                    field.onChange(e);
                  }}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage />
              {/* Suggest States */}
              {stateSearchTerm.length > 0 && (
                <SuggestStates
                  searchTerm={stateSearchTerm}
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
            <FormItem className="relative">
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="School Name"
                  {...field}
                  ref={schoolInputRef}
                  disabled={!isStateValid}
                  onChange={(e) => {
                    setSchoolSearchTerm(e.target.value);
                    field.onChange(e);
                  }}
                  className="h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage />
              {schoolSearchTerm.length > 0 && isStateValid && (
                <SuggestSchools
                  schools={schools}
                  searchTerm={schoolSearchTerm}
                  onSchoolSelect={handleSchoolSelect}
                />
              )}
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
