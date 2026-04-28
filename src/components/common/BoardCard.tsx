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

const WORK_TYPE_COLORS: Record<string, string> = {
  정규직: "bg-red-100 text-red-800",
  인턴직: "bg-sky-100 text-sky-800",
  계약직: "bg-purple-100 text-purple-800",
  채용연계형인턴: "bg-lime-100 text-lime-800",
  병역특례: "bg-blue-100 text-blue-800",
};

const WORK_TYPE_FALLBACK = "bg-gray-100 text-gray-800";

function splitWorkType(workType: string): string[] {
  return workType
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
}

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

function HeaderBadges({ item }: { item: BoardItem }) {
  if (item.category === "job" && item.workType) {
    const types = splitWorkType(item.workType);
    if (types.length > 0) {
      return (
        <>
          {types.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className={WORK_TYPE_COLORS[t] ?? WORK_TYPE_FALLBACK}
            >
              {t}
            </Badge>
          ))}
        </>
      );
    }
  }
  return (
    <Badge variant="secondary" className={categoryColors[item.category]}>
      {categoryLabels[item.category]}
    </Badge>
  );
}

export function BoardCard({ item }: BoardCardProps) {
  return (
    <Link to={`/board/${item.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <HeaderBadges item={item} />
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
