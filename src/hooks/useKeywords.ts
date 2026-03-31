import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as keywordsApi from "@/api/keywords";

export function useKeywords() {
  const queryClient = useQueryClient();

  const {
    data: keywords = [],
    isLoading,
  } = useQuery({
    queryKey: ["keywords"],
    queryFn: keywordsApi.getKeywords,
  });

  const { mutateAsync: updateKeywords } = useMutation({
    mutationFn: keywordsApi.updateKeywords,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    },
  });

  return { keywords, isLoading, updateKeywords };
}
