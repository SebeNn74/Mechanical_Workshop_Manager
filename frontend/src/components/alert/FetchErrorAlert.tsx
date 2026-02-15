import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface FetchErrorAlertProps {
  title: string;
  description: string;
  onRetry: () => void;
}

const FetchErrorAlert = ({
  title,
  description: error,
  onRetry,
}: FetchErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="max-w-2xs">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button
        className="col-start-2 w-fit justify-self-end"
        variant="outline"
        onClick={onRetry}
      >
        Reintentar
      </Button>
    </Alert>
  );
};

export default FetchErrorAlert;
