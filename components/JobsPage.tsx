"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Bookmark,
  BookmarkCheck,
  X,
} from "lucide-react";
import Link from "next/link";

// redux
import {
  selectJobCategories,
  getJobCategories,
} from "@/lib/redux/slices/JobCategories/JobCategoriesSlice";
import { selectJobs, getJobs } from "@/lib/redux/slices/jobs/jobsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import { FilterSkeleton } from "@/components/FilterSkeleton";
import { formatDate } from "@/utils/formartDate";
import { formatSalary } from "@/utils/formaSalary";

// Types
type SalaryType = "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface Filters {
  search: string;
  category: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  salaryType: SalaryType | "";
  allowMultiple: string;
  activeOnly: string;
}

export default function JobsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryType: "",
    allowMultiple: "",
    activeOnly: "true",
  });

  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const jobCategories = useAppSelector(selectJobCategories);
  const jobs = useAppSelector(selectJobs);

  // Debounced search to avoid too many API calls
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          search: searchDebounced || undefined,
          category: filters.category || undefined,
          location: filters.location || undefined,
          activeOnly: filters.activeOnly,
          salaryMin: filters.salaryMin
            ? parseInt(filters.salaryMin)
            : undefined,
          salaryMax: filters.salaryMax
            ? parseInt(filters.salaryMax)
            : undefined,
          salaryType: filters.salaryType || undefined,
          allowMultiple: filters.allowMultiple || undefined,
        };

        await Promise.all([
          dispatch(getJobs(params)).unwrap(),
          dispatch(getJobCategories()).unwrap(),
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    dispatch,
    searchDebounced,
    filters.category,
    filters.location,
    filters.activeOnly,
    filters.salaryMin,
    filters.salaryMax,
    filters.salaryType,
    filters.allowMultiple,
  ]);

  // Extract unique locations from jobs
  const locations = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.location)))
        .filter(Boolean)
        .sort(),
    [jobs]
  );

  const handleFilterChange = (name: keyof Filters, value: string) => {
    const processedValue = value === "all" ? "" : value;
    setFilters((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      salaryType: "",
      allowMultiple: "",
      activeOnly: "true",
    });
  };

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== "activeOnly" && value !== "" && value !== "true"
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <X className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Job
          </h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills and preferences
          </p>
        </div>

        {/* Search and Filters */}
        {loading && !jobs.length ? (
          <FilterSkeleton />
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search jobs or companies..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {jobCategories?.map((category) => (
                      <SelectItem key={category.id} value={category?.name}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location Filter */}
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Salary Type Filter */}
                <Select
                  value={filters.salaryType}
                  onValueChange={(value) =>
                    handleFilterChange("salaryType", value as SalaryType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Salary Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="HOURLY">Hourly</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Min Salary */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Min Salary"
                    type="number"
                    value={filters.salaryMin}
                    onChange={(e) =>
                      handleFilterChange("salaryMin", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>

                {/* Max Salary */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Max Salary"
                    type="number"
                    value={filters.salaryMax}
                    onChange={(e) =>
                      handleFilterChange("salaryMax", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>

                {/* Allow Multiple */}
                <Select
                  value={filters.allowMultiple}
                  onValueChange={(value) =>
                    handleFilterChange("allowMultiple", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Allow Multiple?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600 mr-2">
                    Active filters:
                  </span>
                  {filters.search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.search}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("search", "")}
                      />
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {filters.category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("category", "")}
                      />
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="secondary" className="gap-1">
                      Location: {filters.location}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("location", "")}
                      />
                    </Badge>
                  )}
                  {(filters.salaryMin || filters.salaryMax) && (
                    <Badge variant="secondary" className="gap-1">
                      Salary: {filters.salaryMin && `$${filters.salaryMin}+`}{" "}
                      {filters.salaryMax && `- $${filters.salaryMax}`}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          handleFilterChange("salaryMin", "");
                          handleFilterChange("salaryMax", "");
                        }}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            {loading ? (
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  {jobs.length} Job{jobs.length !== 1 ? "s" : ""} Found
                </h2>
                {filters.search && (
                  <p className="text-gray-600">
                    Results for "{filters.search}"
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 5 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-400 transition-colors">
                          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        {job?.urgent && (
                          <Badge
                            variant="destructive"
                            className="text-xs animate-pulse"
                          >
                            🔥 Urgent
                          </Badge>
                        )}
                        {savedJobs.includes(job.id) && (
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-400"
                          >
                            Saved
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center font-medium text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatSalary(job.salary, job.salaryType)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.workingHours}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {job.category.name}
                        </Badge>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements
                          .split(",")
                          .slice(0, 4)
                          .map((req, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs hover:bg-gray-100 transition-colors"
                            >
                              {req.trim()}
                            </Badge>
                          ))}
                        {job.requirements.split(",").length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-400"
                          >
                            +{job.requirements.split(",").length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                        <span suppressHydrationWarning>
                          Posted {formatDate(job.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {job.allowMultiple && (
                            <Badge variant="outline" className="text-xs">
                              Multiple positions
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {savedJobs.includes(job.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-orange-400" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>

                      <div className="flex lg:flex-col gap-2 flex-1 lg:flex-initial">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex-1 lg:flex-initial"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full whitespace-nowrap"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex-1 lg:flex-initial"
                        >
                          <Button
                            size="sm"
                            className="w-full whitespace-nowrap bg-orange-400 hover:bg-orange-500"
                          >
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // No Results
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-gray-400 mb-6">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any jobs matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleFilterChange("search", "")}
                  >
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {!loading && jobs.length > 0 && jobs.length % 10 === 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
