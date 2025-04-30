
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Respondent } from "./NPSCalculator";

interface Comment {
  id: string;
  rating: number;
  type: Respondent;
  text: string;
  date: Date;
}

interface CommentsListProps {
  comments: Comment[];
}

export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum comentário disponível.
      </div>
    );
  }

  const getCommentIcon = (type: Respondent) => {
    switch (type) {
      case "promotor":
        return <ThumbsUp className="h-5 w-5 text-nps-promotor" />;
      case "passivo":
        return <div className="h-5 w-5 rounded-full bg-nps-passivo flex items-center justify-center text-white text-xs font-bold">!</div>;
      case "detrator":
        return <ThumbsDown className="h-5 w-5 text-nps-detrator" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <Card key={comment.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getCommentIcon(comment.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold">Nota: {comment.rating}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.date)}</span>
                  </div>
                </div>
                <p className="text-sm">{comment.text || <span className="text-muted-foreground italic">Nenhum comentário adicional</span>}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default CommentsList;
