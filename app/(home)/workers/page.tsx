"use client";

import React from "react";
import {
  selectWorkers,
  getWorkers,
} from "@/lib/redux/slices/worker/workerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkerCard from "@/components/WorkerCard";


const Workers = () => {
  const dispatch = useAppDispatch();
  const workers = useAppSelector(selectWorkers);

  React.useEffect(() => {
    dispatch(getWorkers());
  }, [dispatch]);

  if (!workers || workers.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Workers Found
          </h2>
          <p className="text-lg text-gray-600">
            Currently, there are no workers available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Active Workers</CardTitle>
          <CardDescription>You can choose Your Desired Worker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4  grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Workers;
