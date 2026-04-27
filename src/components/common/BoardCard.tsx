import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BoardItem } from "@/types";

const categoryLabels: Record<string, string> = {
  job: "채용",
  announcement: "공지",
  scholarship: "장학금",
};

const categoryColors: Record<string, string> = {
  job: "bg-blue-100 text-blue-800",
  announcement: "bg-amber-100 text-amber-800",
  scholarship: "bg-green-100 text-green-800",
};

interface BoardCardProps {
  item: BoardItem;
}

function DeadlineLabel({ item }: { item: BoardItem }) {
  if (item.category !== "job") {
    return <span className="text-xs text-muted-foreground">{item.date}</span>;
  }
  if (item.isAlwaysOpen) {
    return <span className="text-xs text-muted-foreground">상시채용</span>;
  }
  if (item.deadline) {
    return (
      <span className="text-xs text-muted-foreground">
        {item.deadline} 마감일
      </span>
    );
  }
  return null;
}

export function BoardCard({ item }: BoardCardProps) {
  const badgeLabel =
    item.category === "job" && item.workType
      ? item.workType
      : categoryLabels[item.category];

  return (
    <Link to={`/board/${item.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={categoryColors[item.category]}>
              {badgeLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">{item.source}</span>
            <DeadlineLabel item={item} />
          </div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{item.summary}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
