import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
};

export function useToast() {
  const defaultDuration = 5000;

  return {
    toast: (props: ToastProps) => {
      toast(props.title, {
        description: props.description,
        action: props.action,
        cancel: props.cancel,
      });
    },
    success: (props: ToastProps) => {
      toast.success(props.title, {
        description: props.description,
        action: props.action,
        cancel: props.cancel,
      });
    },
    error: (props: ToastProps) => {
      toast.error(props.title, {
        description: props.description,
        action: props.action,
        cancel: props.cancel,
      });
    },
    warning: (props: ToastProps) => {
      toast.warning(props.title, {
        description: props.description,
        action: props.action,
        cancel: props.cancel,
      });
    },
    info: (props: ToastProps) => {
      toast.info(props.title, {
        description: props.description,
        action: props.action,
        cancel: props.cancel,
      });
    },
    dismiss: () => {
      toast.dismiss();
    }
  };
} 