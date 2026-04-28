import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "@/api/notifications";
import type { NotificationSettings } from "@/types";

export function useNotificationSettings(userId: string | undefined) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notification-settings", userId],
    queryFn: () => notificationsApi.getNotificationSettings(userId!),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: (settings: NotificationSettings) =>
      notificationsApi.updateNotificationSettings(userId!, settings),
    onSuccess: (data) => {
      qc.setQueryData(["notification-settings", userId], data);
    },
  });

  return {
    settings: query.data ?? null,
    isLoading: query.isLoading,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
