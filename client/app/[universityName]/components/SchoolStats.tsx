import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SchoolStatsProps {
  studentSize: number;
  tuitionInState: number;
  tuitionOutOfState: number;
  medianEarnings: number;
  medianDebt: number;
}

const SchoolStats = ({
  studentSize,
  tuitionInState,
  tuitionOutOfState,
  medianEarnings,
  medianDebt,
}: SchoolStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Body</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {studentSize?.toLocaleString() ?? "N/A"}
          </p>
          <p className="text-muted-foreground">Total Students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tuition/Year</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(tuitionInState)}
            </p>
            <p className="text-muted-foreground">In-State</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(tuitionOutOfState)}
            </p>
            <p className="text-muted-foreground">Out-of-State</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(medianEarnings)}
            </p>
            <p className="text-muted-foreground">Median Earnings (10 years)</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCurrency(medianDebt)}</p>
            <p className="text-muted-foreground">Median Debt</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolStats;
