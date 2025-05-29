import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const JobCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-12" />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          
          <div className="mb-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-3 ml-6">
          <Skeleton className="h-8 w-8" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);