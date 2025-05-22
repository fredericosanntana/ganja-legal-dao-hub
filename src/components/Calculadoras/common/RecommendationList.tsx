import React from "react";

interface RecommendationListProps {
  recommendations: string[];
  title?: string;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  title = "Recomendações:",
}) => {
  return (
    <div>
      <h6 className="text-lg font-medium mb-2">{title}</h6>
      <ul className="list-disc pl-5 space-y-1">
        {recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;
