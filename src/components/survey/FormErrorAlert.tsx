
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormErrorAlertProps {
  error: string;
}

export function FormErrorAlert({ error }: FormErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
