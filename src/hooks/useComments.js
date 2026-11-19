import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export function useComments(bus_line_id, page = 1, limit = 10) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [error, setError] = useState(null);

    // GET /comments/fetch
    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                bus_line_id,
                page: String(page),
                limit: String(limit)
            });

            const data = await apiRequest(`/comments/fetch?${params}`);
            setComments(data);
        }
        catch (err) { setError(err.message); }
        finally { setIsLoading(false); }

    }, [bus_line_id, page, limit]);

    // POST /comments/add
    const createComment = async (body) => {
        setIsCreating(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                body,
                bus_line_id
            });

            const newComment = await apiRequest(`/comments/add?${params}`, { method: "POST" });
            setComments((prev) => [newComment, ...prev]);
            return newComment;
        }
        catch (err) { setError(err.message); return null; }
        finally { setIsCreating(false); }
    };

    // POST /comments/interact
    const interactWithComment = async (comment_id, interaction_type) => {
        setIsInteracting(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                comment_id: String(comment_id),
                interaction_type
            });

            const updatedComment = await apiRequest(`/comments/interact?${params}`, { method: "POST" });

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === updatedComment.id
                        ? updatedComment
                        : comment
                )
            );

            return updatedComment;
        }
        catch (err) { setError(err.message); return null; }
        finally     { setIsInteracting(false); }
    };

    // fetch comments when the parameters change
    useEffect(() => {fetchComments();}, [fetchComments]);

    return {
        comments,
        isLoading,
        isCreating,
        isInteracting,
        error,
        fetchComments,
        createComment,
        interactWithComment
    };
}
