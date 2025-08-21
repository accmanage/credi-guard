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
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-200 border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-1 ${
                trendUp ? 'text-success' : 'text-destructive'
              }`}>
                {trend}
              </p>
            )}
          </div>
          <div className="bg-accent rounded-full p-3">
            <Icon className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;