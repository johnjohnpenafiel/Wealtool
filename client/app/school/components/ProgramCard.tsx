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
  isAIGenerated1Year: boolean;
  isAIGenerated2Year: boolean;
}

const ProgramCard = ({ title, earnings1Year, earnings2Year }: Props) => {
  const [earnings, setEarnings] = useState<EarningsState>({
    earnings1Year,
    earnings2Year,
    isAIGenerated1Year: false,
    isAIGenerated2Year: false,
  });

  // Update state when props change
  useEffect(() => {
    setEarnings({
      earnings1Year,
      earnings2Year,
      isAIGenerated1Year: false,
      isAIGenerated2Year: false,
    });
  }, [earnings1Year, earnings2Year, title]);

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
          // Reset earnings to null to trigger loading animation only if data is missing
          setEarnings((prevEarnings) => ({
            ...prevEarnings,
            earnings1Year:
              earnings1Year === null ? null : prevEarnings.earnings1Year,
            earnings2Year:
              earnings2Year === null ? null : prevEarnings.earnings2Year,
          }));

          const data = await generateEarnings(title, missingEarnings);

          if (data) {
            setEarnings((prevEarnings) => ({
              ...prevEarnings,
              earnings1Year:
                data.response["1_year_median_earnings"] ??
                prevEarnings.earnings1Year,
              earnings2Year:
                data.response["2_year_median_earnings"] ??
                prevEarnings.earnings2Year,
              isAIGenerated1Year:
                data.response["1_year_median_earnings"] !== undefined,
              isAIGenerated2Year:
                data.response["2_year_median_earnings"] !== undefined,
            }));
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
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col">
          <p className="text-lg text-white">1 Year Earnings:</p>
          <div className="flex items-center">
            <span
              className={`text-xl ${
                earnings.isAIGenerated1Year
                  ? "text-blue-500 pr-2"
                  : "text-white"
              }`}
            >
              {earnings.earnings1Year !== null ? (
                formatCurrency(earnings.earnings1Year)
              ) : (
                <ScaleLoader
                  color="#ffffff"
                  height={15}
                  width={5}
                  speedMultiplier={0.5}
                />
              )}
            </span>
            {earnings.isAIGenerated1Year && (
              <InfoButton message="This result was generated using AI due to missing data. Please note that it may not be entirely accurate." />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-lg text-white">2 Year Earnings:</p>
          <div className="flex items-center">
            <span
              className={`text-xl ${
                earnings.isAIGenerated2Year
                  ? "text-blue-500 pr-2"
                  : "text-white"
              }`}
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
            <div className="flex items-center justify-center">
              {earnings.isAIGenerated2Year && (
                <InfoButton message="This result was generated using AI due to missing data. Please note that it may not be entirely accurate." />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
