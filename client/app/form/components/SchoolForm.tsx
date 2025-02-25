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
import SuggestData from "@/components/SuggestData";
// Data
import { states } from "@/lib/data/states";
// API
import { fetchSchools } from "@/lib/api";
// Next
import { useRouter } from "next/navigation";
// Actions
import { submitSchool } from "@/app/actions/schoolActions";

// Add this interface
interface School {
  id: string;
  name: string;
}

// -------------------------- School Form -------------------------- //
export default function SchoolForm() {
  // ----- State ----- //
  const [searchTerms, setSearchTerms] = useState({ state: "", school: "" });
  const [stateCode, setStateCode] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  // ----- Refs ----- //
  const schoolInputRef = useRef<HTMLInputElement>(null);

  // ----- Form Schema ----- //
  const formSchema = z.object({
    state: z
      .string()
      .refine((val) => states.some((state) => state.name === val), {
        message: "Please enter a valid state",
      }),
    school: z
      .string()
      .max(150, { message: "School must be less than 150 characters" })
      .refine((val) => schools.some((school) => school.name === val), {
        message: "Please enter a valid school",
      }),
  });

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
  const handleSelect = (field: "state" | "school", value: string) => {
    form.setValue(field, value);
    setSearchTerms((prev) => ({ ...prev, [field]: "" }));

    if (field === "state") {
      const selectedStateCode = states.find(
        (state) => state.name === value
      )?.code;
      setStateCode(selectedStateCode || "");
      if (schoolInputRef.current) {
        schoolInputRef.current.focus();
      }
    } else if (field === "school") {
      // Set the selected school ID when a school is selected
      const selectedSchool = schools.find((school) => school.name === value);
      setSelectedSchoolId(selectedSchool?.id || null);
    }
  };

  // ----- Fetch Schools ----- //
  useEffect(() => {
    if (stateCode && isStateValid) {
      fetchSchools(stateCode).then((schoolsData) => {
        setSchools(schoolsData);
      });
    } else {
      setSchools([]); // Reset schools when state is invalid
    }
  }, [stateCode, isStateValid]);

  // ----- Router ----- //
  const router = useRouter();

  // ----- Handle Form Submission ----- //
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedSchoolId) {
      console.error("No school ID selected");
      return;
    }
    await submitSchool(selectedSchoolId);
    router.push(`/school/${selectedSchoolId}`);
  }

  // Add this constant at the top of the component
  const INPUT_CLASSES =
    "h-16 md:h-28 text-2xl md:text-7xl md:placeholder:text-7xl border-4 border-neutral-400/80 placeholder:text-neutral-500";

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
                    setSearchTerms((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }));
                    setStateCode(
                      states.find((state) => state.name === e.target.value)
                        ?.code || ""
                    );
                    field.onChange(e);
                  }}
                  className={INPUT_CLASSES}
                />
              </FormControl>
              <FormMessage />
              {searchTerms.state.length > 0 && (
                <SuggestData
                  searchTerm={searchTerms.state}
                  onSelect={(value) => handleSelect("state", value)}
                  data={states.map((state) => state.name)}
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
                    setSearchTerms((prev) => ({
                      ...prev,
                      school: e.target.value,
                    }));
                    field.onChange(e);
                  }}
                  className={INPUT_CLASSES}
                />
              </FormControl>
              <FormMessage />
              {searchTerms.school.length > 0 && isStateValid && (
                <SuggestData
                  searchTerm={searchTerms.school}
                  data={schools.map((school) => school.name)}
                  onSelect={(value) => handleSelect("school", value)}
                />
              )}
            </FormItem>
          )}
        />
        <Button
          className="text-2xl font-medium text-neutral-500"
          size={"lg"}
          variant="outline"
          type="submit"
        >
          Next
        </Button>
      </form>
    </Form>
  );
}
