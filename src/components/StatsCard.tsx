import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="h-5 w-5 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-blue-600 mt-1">
                {trend}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;