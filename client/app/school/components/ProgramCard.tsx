import React from "react";
import { ProgramResponse } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProgramCard = ({ programData }: { programData: ProgramResponse }) => {
  const programTitle =
    programData.results[0]["latest.programs.cip_4_digit"][0].title;
  const earnings1Year =
    programData.results[0]["latest.programs.cip_4_digit"][0].earnings.highest[
      "1_yr"
    ].overall_median_earnings;
  const earnings2Years =
    programData.results[0]["latest.programs.cip_4_digit"][0].earnings.highest[
      "2_yr"
    ].overall_median_earnings;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-300">
          {programTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-lg font-bold">
            1 Year Earnings: {formatCurrency(earnings1Year)}
          </p>
        </div>
        <div>
          <p className="text-lg font-bold">
            2 Year Earnings: {formatCurrency(earnings2Years)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
