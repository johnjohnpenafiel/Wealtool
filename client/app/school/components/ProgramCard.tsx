import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateEarnings } from "@/lib/api";

interface Props {
  title: string;
  earnings1Year: number | null;
  earnings2Year: number | null;
}

const ProgramCard = ({ title, earnings1Year, earnings2Year }: Props) => {
  const [earnings, setEarnings] = useState({
    earnings1Year,
    earnings2Year,
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        let missingEarnings = "";
        if (earnings1Year === null) {
          missingEarnings += "1 year median earnings";
        }
        if (earnings2Year === null) {
          if (missingEarnings) missingEarnings += ", ";
          missingEarnings += "2 year median earnings";
        }

        if (missingEarnings) {
          const data = await generateEarnings(title, missingEarnings);
          if (data) {
            setEarnings((prevEarnings) => ({
              earnings1Year: data.earnings1Year ?? prevEarnings.earnings1Year,
              earnings2Year: data.earnings2Years ?? prevEarnings.earnings2Year,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching generated earnings:", error);
      }
    };

    fetchEarnings();
  }, [earnings1Year, earnings2Year, title]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-lg font-bold">
            1 Year Earnings:{" "}
            {earnings.earnings1Year !== null
              ? formatCurrency(earnings.earnings1Year)
              : "Loading..."}
          </p>
        </div>
        <div>
          <p className="text-lg font-bold">
            2 Year Earnings:{" "}
            {earnings.earnings2Year !== null
              ? formatCurrency(earnings.earnings2Year)
              : "Loading..."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
