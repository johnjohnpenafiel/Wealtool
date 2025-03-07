import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateEarnings } from "@/lib/api";
import InfoButton from "@/components/InfoButton";
import ScaleLoader from "react-spinners/ScaleLoader";

interface Props {
  title: string;
  earnings1Year: number | null;
  earnings2Year: number | null;
}

interface EarningsState {
  earnings1Year: number | null;
  earnings2Year: number | null;
  isGenerated1Year: boolean;
  isGenerated2Year: boolean;
}

const ProgramCard = ({ title, earnings1Year, earnings2Year }: Props) => {
  console.log("Received props:", { earnings1Year, earnings2Year });

  const [earnings, setEarnings] = useState<EarningsState>({
    earnings1Year,
    earnings2Year,
    isGenerated1Year: false,
    isGenerated2Year: false,
  });

  // Update state when props change
  useEffect(() => {
    console.log("Updating state with new props:", {
      earnings1Year,
      earnings2Year,
    });
    setEarnings({
      earnings1Year,
      earnings2Year,
      isGenerated1Year: false,
      isGenerated2Year: false,
    });
  }, [earnings1Year, earnings2Year]);

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

        console.log("Missing earnings:", missingEarnings);

        if (missingEarnings) {
          const data = await generateEarnings(title, missingEarnings);
          console.log("Fetched data:", data);

          if (data) {
            setEarnings((prevEarnings) => {
              const updatedEarnings = {
                ...prevEarnings,
                earnings1Year:
                  data.response["1_year_median_earnings"] ??
                  prevEarnings.earnings1Year,
                earnings2Year:
                  data.response["2_year_median_earnings"] ??
                  prevEarnings.earnings2Year,
                isGenerated1Year:
                  data.response["1_year_median_earnings"] !== undefined,
                isGenerated2Year:
                  data.response["2_year_median_earnings"] !== undefined,
              };
              console.log("Updated earnings state:", updatedEarnings);
              return updatedEarnings;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching generated earnings:", error);
      }
    };

    fetchEarnings();
  }, [earnings1Year, earnings2Year, title]);

  console.log(earnings);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <p className="text-lg font-bold text-white pr-1">
            1 Year Earnings:{" "}
            <span
              className={
                earnings.isGenerated1Year ? "text-blue-500" : "text-white"
              }
            >
              {earnings.earnings1Year !== null ? (
                formatCurrency(earnings.earnings1Year)
              ) : (
                <ScaleLoader
                  color="#ffffff"
                  height={20}
                  width={5}
                  speedMultiplier={0.5}
                />
              )}
            </span>
          </p>
          {earnings.isGenerated1Year && (
            <InfoButton message="This result was generated using AI due to missing data. Please note that it may not be entirely accurate." />
          )}
        </div>
        <div className="flex items-center">
          <p className="text-lg font-bold text-white pr-1">
            2 Year Earnings:{" "}
            <span
              className={
                earnings.isGenerated2Year ? "text-blue-500" : "text-white"
              }
            >
              {earnings.earnings2Year !== null ? (
                formatCurrency(earnings.earnings2Year)
              ) : (
                <ScaleLoader
                  color="#ffffff"
                  height={15}
                  width={5}
                  speedMultiplier={0.5}
                />
              )}
            </span>
          </p>
          {earnings.isGenerated2Year && (
            <InfoButton message="This result was generated using AI due to missing data. Please note that it may not be entirely accurate." />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
