import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBoardItem, useRecommendation } from "@/hooks/useBoardItems";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

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

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading: itemLoading } = useBoardItem(id!);
  const { data: recommendation, isLoading: recLoading } = useRecommendation(
    id!,
  );

  if (itemLoading) {
    return <div className="py-8 text-center text-muted-foreground">로딩 중...</div>;
  }

  if (!item) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        뒤로가기
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={categoryColors[item.category]}
            >
              {item.category === "job" && item.workType
                ? item.workType
                : categoryLabels[item.category]}
            </Badge>
            {item.category === "job" && item.workType && (
              <Badge variant="outline">{item.workType}</Badge>
            )}
            {item.category === "job" && item.duty && (
              <Badge variant="outline">{item.duty}</Badge>
            )}
            <span className="text-sm text-muted-foreground">{item.source}</span>
            {item.category === "job" ? (
              item.isAlwaysOpen ? (
                <span className="text-sm text-muted-foreground">상시채용</span>
              ) : item.deadline ? (
                <span className="text-sm text-muted-foreground">
                  {item.deadline} 마감일
                </span>
              ) : null
            ) : (
              <span className="text-sm text-muted-foreground">{item.date}</span>
            )}
          </div>
          <CardTitle className="text-2xl">{item.title}</CardTitle>
          <CardDescription>{item.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-line leading-relaxed">{item.body}</p>
          {item.sourceUrl && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              원문 보기
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">AI 추천 & 준비 가이드</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recLoading ? (
            <p className="text-muted-foreground">분석 중...</p>
          ) : recommendation ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">
                    {recommendation.matchScore}%
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">매칭 점수</p>
                    {recommendation.matchLevel ? (
                      <Badge variant="secondary">
                        {recommendation.matchLevel}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    회원님의 관심 키워드 기반
                  </p>
                </div>
              </div>

              {recommendation.scoreBreakdown &&
              recommendation.scoreBreakdown.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium">세부 점수</h3>
                  {recommendation.scoreBreakdown.map((b, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{b.label}</span>
                        <span className="font-medium">{b.score}점</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(0, Math.min(100, b.score))}%`,
                          }}
                        />
                      </div>
                      {b.comment ? (
                        <p className="text-xs text-muted-foreground">
                          {b.comment}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <div>
                <h3 className="mb-1 font-medium">왜 이 정보를 추천할까요?</h3>
                <p className="text-sm text-muted-foreground">
                  {recommendation.matchReason}
                </p>
              </div>

              {(recommendation.matchedKeywords?.length ?? 0) > 0 ||
              (recommendation.missingKeywords?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {recommendation.matchedKeywords &&
                  recommendation.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium">일치 키워드</span>
                      {recommendation.matchedKeywords.map((kw) => (
                        <Badge key={kw} className="bg-green-600 hover:bg-green-600">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {recommendation.missingKeywords &&
                  recommendation.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium">부족한 키워드</span>
                      {recommendation.missingKeywords.map((kw) => (
                        <Badge key={kw} variant="outline">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {recommendation.deadlineNote ? (
                <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{recommendation.deadlineNote}</span>
                </div>
              ) : null}

              <div>
                <h3 className="mb-2 font-medium">준비해야 할 것들</h3>
                <ul className="space-y-2">
                  {recommendation.preparationTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {recommendation.recommendedActions &&
              recommendation.recommendedActions.length > 0 ? (
                <div>
                  <h3 className="mb-2 font-medium">지금 하면 좋은 것</h3>
                  <ul className="space-y-2">
                    {recommendation.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground">
                * AI 기반 분석 결과이며, 관심 키워드를 구체적으로 설정할수록 정확해집니다.
              </p>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
