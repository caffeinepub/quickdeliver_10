import { Check, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { OrderStatus } from '../../backend';
import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

const statusSteps = [
  { status: OrderStatus.placed, label: 'Placed', icon: Package },
  { status: OrderStatus.preparing, label: 'Preparing', icon: Package },
  { status: OrderStatus.outForDelivery, label: 'Out for Delivery', icon: Truck },
  { status: OrderStatus.delivered, label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder: Record<OrderStatus, number> = {
  [OrderStatus.placed]: 0,
  [OrderStatus.preparing]: 1,
  [OrderStatus.outForDelivery]: 2,
  [OrderStatus.delivered]: 3,
  [OrderStatus.cancelled]: -1,
};

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentIndex = statusOrder[currentStatus];
  const isCancelled = currentStatus === OrderStatus.cancelled;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <XCircle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-background text-muted-foreground'
                )}
              >
                {isCompleted && index < currentIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              {index < statusSteps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-12 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-2">
              <p
                className={cn(
                  'font-medium transition-colors',
                  isCurrent ? 'text-foreground' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground mt-0.5">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
