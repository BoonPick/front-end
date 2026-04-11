import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  getAdminKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword,
  type AdminKeyword,
} from "@/api/admin";
import { Pencil, Trash2, Plus, Check, X, ArrowLeft } from "lucide-react";

export function AdminKeywordPage() {
  const [keywords, setKeywords] = useState<AdminKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 추가 폼
  const [newKeyword, setNewKeyword] = useState("");
  const [adding, setAdding] = useState(false);

  // 수정 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  async function fetchKeywords() {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminKeywords();
      setKeywords(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "키워드를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKeywords();
  }, []);

  async function handleCreate() {
    const name = newKeyword.trim();
    if (!name) return;
    setAdding(true);
    setError("");
    try {
      await createKeyword(name);
      setNewKeyword("");
      await fetchKeywords();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "추가에 실패했습니다.");
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(id: number) {
    const name = editingValue.trim();
    if (!name) return;
    setError("");
    try {
      await updateKeyword(id, name);
      setEditingId(null);
      await fetchKeywords();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    }
  }

  async function handleDelete(id: number) {
    setError("");
    try {
      await deleteKeyword(id);
      await fetchKeywords();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  }

  function startEditing(kw: AdminKeyword) {
    setEditingId(kw.id);
    setEditingValue(kw.keyword_name);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingValue("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link to="/board" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">키워드 관리 (Admin)</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* 추가 폼 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>새 키워드 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <Input
              placeholder="키워드 입력"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={adding || !newKeyword.trim()}>
              <Plus className="mr-1 h-4 w-4" />
              추가
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 키워드 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            키워드 목록 ({keywords.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              로딩 중...
            </div>
          ) : keywords.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              등록된 키워드가 없습니다.
            </div>
          ) : (
            <div className="divide-y">
              {keywords.map((kw) => (
                <div
                  key={kw.id}
                  className="flex items-center justify-between py-2.5"
                >
                  {editingId === kw.id ? (
                    <form
                      className="flex flex-1 items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(kw.id);
                      }}
                    >
                      <span className="w-12 text-xs text-muted-foreground">
                        #{kw.id}
                      </span>
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="icon-sm"
                        variant="ghost"
                        disabled={!editingValue.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-xs text-muted-foreground">
                          #{kw.id}
                        </span>
                        <span className="text-sm">{kw.keyword_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => startEditing(kw)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => handleDelete(kw.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
